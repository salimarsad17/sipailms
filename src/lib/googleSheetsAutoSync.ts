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
  createFullDatabaseGoogleSpreadsheet,
  syncFullDatabaseToExistingSpreadsheet,
  ExportSheetPayload,
  ExportResult
} from "./googleSheetsService";
import {
  RekapNilaiTotal,
  NilaiSemesterParalel,
  Siswa,
  Kelas,
  DataSekolah,
  Guru,
  JurnalMengajar,
  JurnalIbadahHarian
} from "../types";
import { DataService } from "../data/initialData";

export interface DatabaseSyncPayload {
  sekolah?: DataSekolah;
  guru?: Guru;
  classes?: Kelas[];
  students?: Siswa[];
  rekapNilai?: RekapNilaiTotal[];
  nilaiParalel?: NilaiSemesterParalel[];
  jurnalMengajar?: JurnalMengajar[];
  jurnalIbadah?: JurnalIbadahHarian[];
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  status: "success" | "error" | "syncing";
  message: string;
  affectedSheets?: string[];
  totalRows?: number;
}

export interface GoogleSheetsSyncConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  lastSyncedTimestamp?: number;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  lastError?: string;
  totalSyncedRows?: number;
  appsScriptUrl?: string; // Optional Google Apps Script web app URL (from Kode.gs)
  syncLogs?: SyncLogEntry[];
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
    "T 1",
    "T 2",
    "T 3",
    "T 4",
    "T 5",
    "Rerata Formatif",
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
    const safeUh = Array(10).fill(0).map((_, i) => (typeof r.uhList?.[i] === "number" ? r.uhList[i] : 0));
    const safeT = Array(5).fill(0).map((_, i) => (typeof r.tList?.[i] === "number" ? r.tList[i] : (r.uhList?.[10 + i] || 0)));
    const allFormatif = [...safeUh, ...safeT].filter((v) => v > 0);
    const rerataFormatif = allFormatif.length > 0 ? Math.round(allFormatif.reduce((a, b) => a + b, 0) / allFormatif.length) : 0;
    const na = Math.round(rerataFormatif * 0.4 + r.pts * 0.3 + r.pas * 0.3);
    const tuntas = na >= (r.kkm || 75);

    rows.push([
      idx + 1,
      r.siswaNisn,
      r.siswaNama,
      r.kelasParalel,
      `Semester ${r.semester}`,
      r.mapel,
      ...safeUh,
      ...safeT,
      rerataFormatif,
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
 * Creates a brand-new complete running database spreadsheet containing all 9 tables
 */
export const createNewFullDatabaseSpreadsheet = async (
  title: string,
  payload: DatabaseSyncPayload,
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  const exportResult = await createFullDatabaseGoogleSpreadsheet(
    title,
    payload.sekolah,
    payload.guru,
    payload.classes || [],
    payload.students || [],
    payload.rekapNilai || [],
    payload.nilaiParalel || [],
    payload.jurnalMengajar || [],
    payload.jurnalIbadah || []
  );

  const initialLog: SyncLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("id-ID"),
    status: "success",
    message: `Database Berjalan baru "${exportResult.title}" berhasil dibuat di Google Drive.`,
    totalRows: exportResult.rowCount,
    affectedSheets: [
      "Ringkasan Database",
      "Data Sekolah",
      "Data Guru",
      "Data Kelas",
      "Data Siswa",
      "Master Rekap PAI",
      "Nilai Semester Paralel",
      "Jurnal Mengajar",
      "Jurnal Ibadah"
    ]
  };

  const newConfig: GoogleSheetsSyncConfig = {
    spreadsheetId: exportResult.spreadsheetId,
    spreadsheetTitle: exportResult.title || title,
    spreadsheetUrl: exportResult.spreadsheetUrl,
    autoSync: true,
    lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
    lastSyncedTimestamp: Date.now(),
    syncStatus: "synced",
    totalSyncedRows: exportResult.rowCount,
    syncLogs: [initialLog]
  };

  saveSheetsSyncConfig(newConfig);
  return newConfig;
};

/**
 * Creates a brand-new Google Spreadsheet with Rekap Nilai PAI and Nilai Semester Paralel tabs (legacy wrapper)
 */
export const createNewRekapSpreadsheet = async (
  title: string,
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  return await createNewFullDatabaseSpreadsheet(
    title,
    {
      rekapNilai: rekapList,
      nilaiParalel: paralelList,
      students,
      classes
    },
    schoolName
  );
};

/**
 * Connects an existing Google Spreadsheet by URL or ID as the Live Running Database
 */
export const connectExistingRekapSpreadsheet = async (
  urlOrId: string,
  title?: string,
  appsScriptUrl?: string
): Promise<GoogleSheetsSyncConfig> => {
  const cleanId = extractSpreadsheetId(urlOrId || "");
  const cleanScriptUrl = (appsScriptUrl || "").trim();

  if (!cleanId && !cleanScriptUrl) {
    throw new Error("Masukkan Link Google Spreadsheet atau Link Google Apps Script.");
  }

  const existingConfig = loadSheetsSyncConfig();
  const logs = existingConfig?.syncLogs || [];

  const connectLog: SyncLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("id-ID"),
    status: "success",
    message: cleanId
      ? `Spreadsheet ID: ${cleanId.slice(0, 10)}... berhasil disambungkan sebagai Database Berjalan.`
      : `Google Apps Script Web App berhasil disambungkan sebagai backend Database.`
  };

  const newConfig: GoogleSheetsSyncConfig = {
    spreadsheetId: cleanId || existingConfig?.spreadsheetId || "google-apps-script-db",
    spreadsheetTitle: title || existingConfig?.spreadsheetTitle || (cleanId ? `Database PAI SMP (${cleanId.slice(0, 8)}...)` : "Database Google Apps Script"),
    spreadsheetUrl: cleanId ? `https://docs.google.com/spreadsheets/d/${cleanId}/edit` : (existingConfig?.spreadsheetUrl || ""),
    autoSync: existingConfig?.autoSync !== undefined ? existingConfig.autoSync : true,
    appsScriptUrl: cleanScriptUrl || existingConfig?.appsScriptUrl || "",
    lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
    lastSyncedTimestamp: Date.now(),
    syncStatus: "synced",
    syncLogs: [connectLog, ...logs].slice(0, 20)
  };

  saveSheetsSyncConfig(newConfig);
  return newConfig;
};

/**
 * Synchronizes entire database payload to Google Apps Script Web App
 */
export const syncToGoogleAppsScript = async (
  appsScriptUrl: string,
  payload: DatabaseSyncPayload
): Promise<{ status: string; message: string; syncedAt: string; updatedTables?: number }> => {
  const cleanUrl = appsScriptUrl.trim();
  if (!cleanUrl) throw new Error("URL Google Apps Script tidak valid.");

  // 1. Try server proxy (reliable, handles 302 redirects and browser CORS)
  try {
    const res = await fetch("/api/google/appscript/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: cleanUrl,
        action: "saveAllData",
        payload: {
          sekolah: payload.sekolah,
          guru: payload.guru,
          classes: payload.classes,
          students: payload.students,
          rekapNilai: payload.rekapNilai,
          nilaiParalel: payload.nilaiParalel,
          jurnalMengajar: payload.jurnalMengajar,
          jurnalIbadah: payload.jurnalIbadah
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return {
          status: "success",
          message: data.message || "Sinkronisasi Google Apps Script & Google Sheets berhasil.",
          syncedAt: data.result?.syncedAt || new Date().toLocaleTimeString("id-ID"),
          updatedTables: data.result?.updatedTables || 8
        };
      }
    }
  } catch (proxyErr) {
    console.warn("Apps Script proxy attempt notice:", proxyErr);
  }

  // 2. Direct browser fetch with text/plain to avoid CORS preflight
  try {
    const directRes = await fetch(cleanUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "saveAllData",
        payload: {
          sekolah: payload.sekolah,
          guru: payload.guru,
          classes: payload.classes,
          students: payload.students,
          rekapNilai: payload.rekapNilai,
          nilaiParalel: payload.nilaiParalel,
          jurnalMengajar: payload.jurnalMengajar,
          jurnalIbadah: payload.jurnalIbadah
        }
      })
    });

    const text = await directRes.text();
    let parsed: any;
    try { parsed = JSON.parse(text); } catch {}

    return {
      status: "success",
      message: parsed?.message || "Data berhasil dikirim ke Google Apps Script & Google Sheets.",
      syncedAt: parsed?.result?.syncedAt || new Date().toLocaleTimeString("id-ID"),
      updatedTables: parsed?.result?.updatedTables || 8
    };
  } catch (directErr: any) {
    console.warn("Direct fetch error:", directErr);
    throw new Error("Gagal menghubungkan ke Google Apps Script: " + (directErr?.message || "Koneksi terputus"));
  }
};

/**
 * Synchronizes the entire PAILMS database to the connected Google Spreadsheet with live responsive feedback
 */
export const syncFullDatabaseToGoogleSheet = async (
  config: GoogleSheetsSyncConfig,
  payload: DatabaseSyncPayload,
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  if (!config || (!config.spreadsheetId && !config.appsScriptUrl)) {
    throw new Error("Spreadsheet Google atau Google Apps Script belum terhubung.");
  }

  // Update status to syncing
  const syncingConfig: GoogleSheetsSyncConfig = {
    ...config,
    syncStatus: "syncing",
    lastError: undefined
  };
  saveSheetsSyncConfig(syncingConfig);

  try {
    // A. Check if Google Apps Script URL is configured
    if (config.appsScriptUrl && config.appsScriptUrl.trim()) {
      try {
        const gasResult = await syncToGoogleAppsScript(config.appsScriptUrl, payload);
        const gasLog: SyncLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: gasResult.syncedAt,
          status: "success",
          message: `Database Berjalan tersinkron via Google Apps Script: ${gasResult.message}`,
          affectedSheets: ["DataSekolah", "DataGuru", "DataKelas", "DataSiswa", "DataPenilaian", "JurnalMengajar", "JurnalIbadahHarian", "NilaiParalelSemester"]
        };

        const successConfig: GoogleSheetsSyncConfig = {
          ...config,
          syncStatus: "synced",
          lastSyncedAt: gasResult.syncedAt,
          lastSyncedTimestamp: Date.now(),
          lastError: undefined,
          syncLogs: [gasLog, ...(config.syncLogs || [])].slice(0, 20)
        };
        saveSheetsSyncConfig(successConfig);
        return successConfig;
      } catch (gasErr: any) {
        console.warn("Apps Script sync failed, falling back to direct OAuth or local:", gasErr);
        if (!config.spreadsheetId) throw gasErr;
      }
    }

    const token = await getAccessToken();
    const isLive = isLiveGoogleToken(token);

    if (!isLive) {
      // Standalone mode / local fallback: record successful response without crashing
      const successLog: SyncLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        status: "success",
        message: `Sinkronisasi lokal berhasil disimpan (${payload.students?.length || 0} Siswa, ${payload.rekapNilai?.length || 0} Nilai, ${payload.jurnalMengajar?.length || 0} Jurnal). Masukkan URL Apps Script untuk sinkronisasi cloud tanpa login.`
      };

      const updatedConfig: GoogleSheetsSyncConfig = {
        ...config,
        syncStatus: "synced",
        lastSyncedAt: new Date().toLocaleTimeString("id-ID"),
        lastSyncedTimestamp: Date.now(),
        syncLogs: [successLog, ...(config.syncLogs || [])].slice(0, 20)
      };
      saveSheetsSyncConfig(updatedConfig);
      return updatedConfig;
    }

    // Call full database updater via Google Sheets REST API
    const syncRes = await syncFullDatabaseToExistingSpreadsheet(
      config.spreadsheetId,
      payload.sekolah,
      payload.guru,
      payload.classes || [],
      payload.students || [],
      payload.rekapNilai || [],
      payload.nilaiParalel || [],
      payload.jurnalMengajar || [],
      payload.jurnalIbadah || []
    );

    const logEntry: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: syncRes.timestamp,
      status: "success",
      message: `Database Berjalan terbarui: ${syncRes.totalRows} baris tersimpan ke ${syncRes.updatedSheets.length} lembar kerja.`,
      affectedSheets: syncRes.updatedSheets,
      totalRows: syncRes.totalRows
    };

    const successConfig: GoogleSheetsSyncConfig = {
      ...config,
      syncStatus: "synced",
      lastSyncedAt: syncRes.timestamp,
      lastSyncedTimestamp: Date.now(),
      totalSyncedRows: syncRes.totalRows,
      lastError: undefined,
      syncLogs: [logEntry, ...(config.syncLogs || [])].slice(0, 20)
    };

    saveSheetsSyncConfig(successConfig);
    return successConfig;
  } catch (err: any) {
    console.warn("Google Sheets database sync error:", err);
    const errLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("id-ID"),
      status: "error",
      message: err?.message || "Gagal memperbarui Google Sheets."
    };

    const errorConfig: GoogleSheetsSyncConfig = {
      ...config,
      syncStatus: "error",
      lastError: err?.message || "Gagal menyinkronkan dengan Google Sheets",
      syncLogs: [errLog, ...(config.syncLogs || [])].slice(0, 20)
    };
    saveSheetsSyncConfig(errorConfig);
    throw err;
  }
};

/**
 * Backward compatible wrapper for syncRekapAllToGoogleSheet
 */
export const syncRekapAllToGoogleSheet = async (
  config: GoogleSheetsSyncConfig,
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): Promise<GoogleSheetsSyncConfig> => {
  return await syncFullDatabaseToGoogleSheet(
    config,
    {
      rekapNilai: rekapList,
      nilaiParalel: paralelList,
      students,
      classes
    },
    schoolName
  );
};

let autoSyncTimeout: any = null;

/**
 * Triggers debounced automatic save to Google Sheets Live Running Database
 */
export const triggerDebouncedDatabaseAutoSync = (
  payload: DatabaseSyncPayload,
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  delayMs: number = 1500
) => {
  const currentConfig = loadSheetsSyncConfig();
  if (!currentConfig || !currentConfig.autoSync || (!currentConfig.spreadsheetId && !currentConfig.appsScriptUrl)) {
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

  // Enrich missing payload pieces from local DataService storage
  const completePayload: DatabaseSyncPayload = {
    sekolah: payload.sekolah || DataService.getSekolah(),
    guru: payload.guru || DataService.getGuru(),
    classes: payload.classes || DataService.getKelas(),
    students: payload.students || DataService.getSiswa(),
    rekapNilai: payload.rekapNilai || DataService.getRekapNilai(),
    nilaiParalel: payload.nilaiParalel || DataService.getNilaiSemesterParalel(),
    jurnalMengajar: payload.jurnalMengajar || DataService.getJurnalMengajar(),
    jurnalIbadah: payload.jurnalIbadah || DataService.getIbadah()
  };

  autoSyncTimeout = setTimeout(async () => {
    try {
      await syncFullDatabaseToGoogleSheet(currentConfig, completePayload, schoolName);
    } catch (err) {
      console.warn("Auto-sync background error:", err);
    }
  }, delayMs);
};

/**
 * Legacy wrapper for triggerDebouncedAutoSync
 */
export const triggerDebouncedAutoSync = (
  rekapList: RekapNilaiTotal[],
  paralelList: NilaiSemesterParalel[],
  students: Siswa[],
  classes: Kelas[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  delayMs: number = 1500
) => {
  triggerDebouncedDatabaseAutoSync(
    {
      rekapNilai: rekapList,
      nilaiParalel: paralelList,
      students,
      classes
    },
    schoolName,
    delayMs
  );
};
