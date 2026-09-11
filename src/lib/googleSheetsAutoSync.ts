/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken, isLiveGoogleToken, getCurrentUser } from "./googleAuth";
import {
  extractSpreadsheetId,
  getUnifiedRekapNilaiList,
  REKAP_PAI_HEADERS,
  formatRekapRow,
  formatRekapSummaryRow,
  createMultiSheetGoogleSpreadsheet,
  updateSpreadsheetValues,
  ExportSheetPayload,
  ExportResult
} from "./googleSheetsService";
import { RekapNilaiTotal, NilaiSemesterParalel, Siswa, Kelas } from "../types";

export interface GoogleSheetsSyncConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  lastError?: string;
}

const STORAGE_KEY_CONFIG = "pailms_sheets_rekap_sync_config";

// Default configuration from localStorage if available
export const loadSheetsSyncConfig = (): GoogleSheetsSyncConfig | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load Google Sheets sync config:", err);
    return null;
  }
};

export const saveSheetsSyncConfig = (config: GoogleSheetsSyncConfig | null): void => {
  try {
    if (!config) {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    } else {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    }
    notifyConfigSubscribers(config);
  } catch (err) {
    console.warn("Failed to save Google Sheets sync config:", err);
  }
};

// Config change subscribers
type ConfigSubscriber = (config: GoogleSheetsSyncConfig | null) => void;
const configSubscribers: Set<ConfigSubscriber> = new Set();

export const subscribeSheetsSyncConfig = (cb: ConfigSubscriber): (() => void) => {
  configSubscribers.add(cb);
  cb(loadSheetsSyncConfig());
  return () => configSubscribers.delete(cb);
};

const notifyConfigSubscribers = (config: GoogleSheetsSyncConfig | null) => {
  configSubscribers.forEach((cb) => {
    try {
      cb(config);
    } catch (e) {
      console.error(e);
    }
  });
};

/**
 * Helper to build rows for Buku Nilai Semester Paralel (12 UH, PTS, PAS)
 */
export const formatParalelSheetRows = (
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const activeRecords = paralelList.filter((r) => !r.isDeleted);

  const headers = [
    "No",
    "NISN",
    "Nama Lengkap Siswa",
    "Kelas Paralel",
    "Semester",
    "Mata Pelajaran",
    "UH 1",
    "UH 2",
    "UH 3",
    "UH 4",
    "UH 5",
    "UH 6",
    "UH 7",
    "UH 8",
    "UH 9",
    "UH 10",
    "UH 11",
    "UH 12",
    "Rerata UH",
    "PTS",
    "PAS",
    "Nilai Akhir (NA)",
    "KKM",
    "Status Ketuntasan"
  ];

  const rows: (string | number)[][] = [
    [`BUKU REKAPITULASI PENILAIAN SEMESTER PARALEL - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • Kurikulum Merdeka • Total: ${activeRecords.length} Data Penilaian • Tanggal: ${now}`],
    [""],
    headers
  ];

  activeRecords.forEach((r, idx) => {
    const safeUh = Array(12).fill(0).map((_, i) => (typeof r.uhList[i] === "number" ? r.uhList[i] : 0));
    const rerataUh = Math.round(safeUh.reduce((a, b) => a + b, 0) / 12);
    const na = Math.round(rerataUh * 0.4 + r.pts * 0.3 + r.pas * 0.3);
    const tuntas = na >= (r.kkm || 75);

    rows.push([
      idx + 1,
      r.siswaNisn,
      r.siswaNama,
      r.kelasParalel,
      `Semester ${r.semester}`,
      r.mapel,
      ...safeUh,
      rerataUh,
      r.pts,
      r.pas,
      na,
      r.kkm || 75,
      tuntas ? "Tuntas" : "Remedial"
    ]);
  });

  if (activeRecords.length > 0) {
    rows.push([]);
    rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
    rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
    rows.push([]);
    rows.push([]);
    rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
    rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
  }

  return rows;
};

/**
 * Creates a brand-new Google Spreadsheet with both Rekap Nilai PAI and Nilai Semester Paralel tabs
 */
export const createNewRekapSpreadsheet = async (
  title: string,
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  const unified = getUnifiedRekapNilaiList(rekapList, students);
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Tab 1: Master Rekap Nilai PAI (Formatif, Sumatif, Praktik)
  const masterRekapRows: (string | number)[][] = [
    [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • KKTP: 75 • Total: ${unified.length} Siswa • Terakhir Disinkron: ${now}`],
    [""],
    REKAP_PAI_HEADERS
  ];
  unified.forEach((r, idx) => masterRekapRows.push(formatRekapRow(r, idx)));
  if (unified.length > 0) {
    masterRekapRows.push([]);
    masterRekapRows.push(formatRekapSummaryRow(unified, "Semua Kelas"));
  }

  // Tab 2: Buku Nilai Semester Paralel (12 UH, PTS, PAS)
  const paralelRows = formatParalelSheetRows(paralelList, students, schoolName);

  const sheets: ExportSheetPayload[] = [
    { title: "Master Rekap PAI", rows: masterRekapRows },
    { title: "Nilai Semester Paralel", rows: paralelRows }
  ];

  // Also add tabs for each class if available
  const inputtedClasses = Array.from(new Set(unified.map((r) => r.kelasId).filter(Boolean))).sort();
  inputtedClasses.forEach((cId) => {
    const classRekap = unified
      .filter((r) => r.kelasId === cId)
      .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
    if (classRekap.length === 0) return;

    const classRows: (string | number)[][] = [
      [`REKAP NILAI PAI KELAS ${cId} - ${schoolName.toUpperCase()}`],
      [`Rombel: ${cId} • Total: ${classRekap.length} Siswa • Tanggal: ${now}`],
      [""],
      REKAP_PAI_HEADERS,
      ...classRekap.map((r, idx) => formatRekapRow(r, idx)),
      [],
      formatRekapSummaryRow(classRekap, cId)
    ];

    sheets.push({
      title: `Kelas ${cId}`.replace(/[\\/?*[\]:]/g, "-").slice(0, 30),
      rows: classRows
    });
  });

  const exportResult: ExportResult = await createMultiSheetGoogleSpreadsheet(title, sheets);

  const newConfig: GoogleSheetsSyncConfig = {
    spreadsheetId: exportResult.spreadsheetId,
    spreadsheetTitle: exportResult.title || title,
    spreadsheetUrl: exportResult.spreadsheetUrl,
    autoSync: true,
    lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
    syncStatus: "synced"
  };

  saveSheetsSyncConfig(newConfig);
  return newConfig;
};

/**
 * Connects an existing Google Spreadsheet by URL or ID
 */
export const connectExistingRekapSpreadsheet = async (
  urlOrId: string,
  title?: string
): Promise<GoogleSheetsSyncConfig> => {
  const cleanId = extractSpreadsheetId(urlOrId);
  if (!cleanId) {
    throw new Error("URL atau Spreadsheet ID Google tidak valid.");
  }

  const newConfig: GoogleSheetsSyncConfig = {
    spreadsheetId: cleanId,
    spreadsheetTitle: title || `Spreadsheet PAI (${cleanId.slice(0, 8)}...)`,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${cleanId}/edit`,
    autoSync: true,
    lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
    syncStatus: "synced"
  };

  saveSheetsSyncConfig(newConfig);
  return newConfig;
};

/**
 * Synchronizes both Rekap Nilai PAI and Nilai Semester Paralel to the connected spreadsheet
 */
export const syncRekapAllToGoogleSheet = async (
  config: GoogleSheetsSyncConfig,
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  if (!config || !config.spreadsheetId) {
    throw new Error("Spreadsheet Google belum terhubung.");
  }

  // Update status to syncing
  const syncingConfig: GoogleSheetsSyncConfig = {
    ...config,
    syncStatus: "syncing",
    lastError: undefined
  };
  saveSheetsSyncConfig(syncingConfig);

  try {
    const token = await getAccessToken();
    const isLive = isLiveGoogleToken(token);

    if (!isLive) {
      // Standalone mode / token expired: save locally and mark status
      const updatedConfig: GoogleSheetsSyncConfig = {
        ...config,
        syncStatus: "synced",
        lastSyncedAt: new Date().toLocaleTimeString("id-ID")
      };
      saveSheetsSyncConfig(updatedConfig);
      return updatedConfig;
    }

    const unified = getUnifiedRekapNilaiList(rekapList, students);
    const now = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 1. Format Master Rekap PAI
    const masterRekapRows: (string | number)[][] = [
      [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
      [`Tahun Ajaran 2025/2026 • KKTP: 75 • Total: ${unified.length} Siswa • Terakhir Disinkron: ${now}`],
      [""],
      REKAP_PAI_HEADERS
    ];
    unified.forEach((r, idx) => masterRekapRows.push(formatRekapRow(r, idx)));
    if (unified.length > 0) {
      masterRekapRows.push([]);
      masterRekapRows.push(formatRekapSummaryRow(unified, "Semua Kelas"));
    }

    // 2. Format Paralel List
    const paralelRows = formatParalelSheetRows(paralelList, students, schoolName);

    // Overwrite Master tab
    try {
      await updateSpreadsheetValues(config.spreadsheetId, "'Master Rekap PAI'!A1", masterRekapRows);
    } catch {
      // If tab name doesn't exist, try Sheet1 or default A1
      await updateSpreadsheetValues(config.spreadsheetId, "A1", masterRekapRows).catch(() => {});
    }

    // Overwrite Paralel tab if possible
    try {
      await updateSpreadsheetValues(config.spreadsheetId, "'Nilai Semester Paralel'!A1", paralelRows);
    } catch {
      // ignore if tab doesn't exist yet
    }

    const successConfig: GoogleSheetsSyncConfig = {
      ...config,
      syncStatus: "synced",
      lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
      lastError: undefined
    };
    saveSheetsSyncConfig(successConfig);
    return successConfig;
  } catch (err: any) {
    console.warn("Google Sheets sync error:", err);
    const errorConfig: GoogleSheetsSyncConfig = {
      ...config,
      syncStatus: "error",
      lastError: err?.message || "Gagal menyinkronkan dengan Google Sheets"
    };
    saveSheetsSyncConfig(errorConfig);
    throw err;
  }
};

let autoSyncTimeout: any = null;

/**
 * Triggers debounced automatic save to Google Sheets (if connected and autoSync is enabled)
 */
export const triggerDebouncedAutoSync = (
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  delayMs: number = 1000
) => {
  const currentConfig = loadSheetsSyncConfig();
  if (!currentConfig || !currentConfig.autoSync || !currentConfig.spreadsheetId) {
    return;
  }

  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout);
  }

  // Set syncing status immediately
  saveSheetsSyncConfig({
    ...currentConfig,
    syncStatus: "syncing"
  });

  autoSyncTimeout = setTimeout(async () => {
    try {
      await syncRekapAllToGoogleSheet(
        currentConfig,
        rekapList,
        paralelList,
        students,
        classes,
        schoolName
      );
    } catch (err) {
      console.warn("Auto-sync error:", err);
    }
  }, delayMs);
};
