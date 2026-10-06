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
  ExportResult,
  getSpreadsheetValues
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

export interface PulledDatabaseResult {
  students?: Siswa[];
  classes?: Kelas[];
  rekapNilai?: RekapNilaiTotal[];
  nilaiParalelList?: NilaiSemesterParalel[];
  jurnalMengajar?: JurnalMengajar[];
  jurnalIbadah?: JurnalIbadahHarian[];
  sekolah?: DataSekolah;
  guru?: Guru;
  source: "appscript" | "spreadsheet" | "mixed";
  summary: {
    totalStudents: number;
    totalClasses: number;
    totalRekapNilai: number;
    totalNilaiParalel: number;
    totalJurnalMengajar: number;
    totalJurnalIbadah: number;
    hasSekolah: boolean;
    hasGuru: boolean;
  };
  pulledAt: string;
}

/**
 * Tarik seluruh data dari Google (Apps Script Web App atau Spreadsheet REST API)
 * dan simpan ke database lokal aplikasi.
 */
export const pullFullDatabaseFromGoogle = async (
  config: GoogleSheetsSyncConfig,
  saveToLocal: boolean = true
): Promise<PulledDatabaseResult> => {
  if (!config || (!config.spreadsheetId && !config.appsScriptUrl)) {
    throw new Error("Link Google Spreadsheet atau Google Apps Script belum terhubung.");
  }

  let students: Siswa[] = [];
  let classes: Kelas[] = [];
  let rekapNilai: RekapNilaiTotal[] = [];
  let nilaiParalelList: NilaiSemesterParalel[] = [];
  let jurnalMengajar: JurnalMengajar[] = [];
  let jurnalIbadah: JurnalIbadahHarian[] = [];
  let sekolah: DataSekolah | undefined;
  let guru: Guru | undefined;
  let source: "appscript" | "spreadsheet" | "mixed" = "spreadsheet";

  // 1. Coba tarik via Google Apps Script jika URL tersedia
  if (config.appsScriptUrl && config.appsScriptUrl.trim()) {
    try {
      const cleanUrl = config.appsScriptUrl.trim();
      let rawData: any = null;

      // 1a. Coba via proxy server
      try {
        const proxyRes = await fetch("/api/google/appscript/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: cleanUrl,
            action: "getAllData",
            payload: {}
          })
        });
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          rawData = json.result || json.data || json;
        }
      } catch (proxyErr) {
        console.warn("Proxy pull attempt notice:", proxyErr);
      }

      // 1b. Coba direct fetch jika proxy belum berhasil
      if (!rawData || (!rawData.siswa && !rawData.kelas && !rawData.sekolah)) {
        try {
          const directRes = await fetch(cleanUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "getAllData" })
          });
          const text = await directRes.text();
          let parsed: any;
          try { parsed = JSON.parse(text); } catch {}
          rawData = parsed?.result || parsed?.data || parsed;
        } catch (directErr) {
          console.warn("Direct pull error:", directErr);
        }
      }

      // 1c. Coba direct GET jika POST belum berhasil
      if (!rawData || (!rawData.siswa && !rawData.kelas && !rawData.sekolah)) {
        try {
          const getUrl = `${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}action=getAllData`;
          const getRes = await fetch(getUrl);
          const getText = await getRes.text();
          let parsedGet: any;
          try { parsedGet = JSON.parse(getText); } catch {}
          rawData = parsedGet?.result || parsedGet?.data || parsedGet;
        } catch (getErr) {
          console.warn("GET pull error:", getErr);
        }
      }

      // Jika data berhasil didapatkan dari Apps Script
      if (rawData && typeof rawData === "object") {
        source = "appscript";

        // Siswa
        const rawSiswa = Array.isArray(rawData.siswa) ? rawData.siswa : (rawData.datasiswa || []);
        if (rawSiswa.length > 0) {
          students = rawSiswa.map((s: any) => ({
            nisn: String(s.nisn || s["NISN"] || "").replace(/[^0-9]/g, ""),
            nama: String(s.nama || s["Nama Lengkap Peserta Didik"] || s["Nama Lengkap"] || s["Nama"] || "").trim(),
            gender: (s.gender === "P" || s.gender === "Perempuan" || String(s.gender || s["Jenis Kelamin"]).toLowerCase() === "perempuan") ? "Perempuan" : "Laki-laki",
            agama: String(s.agama || s["Agama"] || "Islam"),
            statusKeaktifan: String(s.statusKeaktifan || s["Status Keaktifan"] || "Aktif"),
            kelasId: String(s.kelasId || s["Rombel / Kelas"] || s["Kelas"] || "7A").trim(),
            kontakOrangTua: s.kontakOrangTua || s["Kontak Orang Tua / Wali"] ? String(s.kontakOrangTua || s["Kontak Orang Tua / Wali"]) : undefined,
            catatanKhusus: s.catatanKhusus || s["Catatan Khusus"] ? String(s.catatanKhusus || s["Catatan Khusus"]) : undefined
          })).filter((s: Siswa) => s.nama);
        }

        // Kelas
        const rawKelas = Array.isArray(rawData.kelas) ? rawData.kelas : (rawData.datakelas || []);
        if (rawKelas.length > 0) {
          classes = rawKelas.map((k: any) => ({
            id: String(k.id || k["Kode Rombel"] || k.nama || "").trim(),
            nama: String(k.nama || k["Nama Rombongan Belajar"] || `Kelas ${k.id}`).trim(),
            waliKelasNip: String(k.waliKelasNip || k["NIP Wali Kelas"] || ""),
            waliKelasNama: String(k.waliKelasNama || k["Nama Lengkap Wali Kelas"] || ""),
            kuota: Number(k.kuota || k["Kapasitas Kuota"]) || 32,
            totalSiswa: Number(k.totalSiswa || k["Jumlah Siswa Terdaftar"]) || 0
          })).filter((k: Kelas) => k.id);
        }

        // Rekap Nilai Siswa (DataPenilaian / RekapNilai)
        const rawPenilaian = Array.isArray(rawData.rekapNilai)
          ? rawData.rekapNilai
          : Array.isArray(rawData.rekap_nilai)
          ? rawData.rekap_nilai
          : Array.isArray(rawData.penilaian)
          ? rawData.penilaian
          : (rawData.datapenilaian || rawData.rekapnilai || rawData.masterrekappai || rawData.master_rekap_pai || []);
        if (rawPenilaian.length > 0) {
          rekapNilai = rawPenilaian.map((rn: any, idx: number) => ({
            siswaNisn: String(rn.siswaNisn || rn.nisn || rn["NISN"] || `nisn-${idx}`).replace(/[^0-9]/g, ""),
            siswaNama: String(rn.siswaNama || rn.nama || rn["Nama Lengkap Siswa"] || rn["Nama Lengkap Peserta Didik"] || rn["Nama"] || "").trim(),
            kelasId: String(rn.kelasId || rn.kelas || rn["Kelas"] || rn["Rombel"] || "7A").trim(),
            formatifKuis: Number(rn.formatifKuis ?? rn["Formatif - Kuis"] ?? rn.kuis ?? 0),
            formatifTugas: Number(rn.formatifTugas ?? rn["Formatif - Tugas"] ?? rn.tugas ?? 0),
            formatifDiskusi: Number(rn.formatifDiskusi ?? rn["Formatif - Diskusi"] ?? rn.diskusi ?? 0),
            sumatifPts: Number(rn.sumatifPts ?? rn["Sumatif - PTS"] ?? rn.pts ?? 0),
            sumatifPas: Number(rn.sumatifPas ?? rn["Sumatif - PAS"] ?? rn.pas ?? 0),
            hafalanJuzAmmaScore: Number(rn.hafalanJuzAmmaScore ?? rn["Hafalan Juz 'Amma"] ?? rn.hafalan ?? 0),
            praktikSholat: Number(rn.praktikSholat ?? rn["Praktik Sholat"] ?? rn.sholat ?? 0),
            praktikWudhu: Number(rn.praktikWudhu ?? rn["Praktik Wudhu"] ?? rn.wudhu ?? 0)
          })).filter((rn: RekapNilaiTotal) => rn.siswaNama || rn.siswaNisn);
        }

        // Sekolah
        const rawSekolah = Array.isArray(rawData.sekolah) ? rawData.sekolah[0] : (rawData.datasekolah?.[0] || rawData.sekolah);
        if (rawSekolah && (rawSekolah.namaSekolah || rawSekolah["Nama Satuan Pendidikan"])) {
          sekolah = {
            namaSekolah: String(rawSekolah.namaSekolah || rawSekolah["Nama Satuan Pendidikan"] || ""),
            npsn: String(rawSekolah.npsn || rawSekolah["Nomor Pokok Sekolah Nasional (NPSN)"] || ""),
            alamat: String(rawSekolah.alamat || rawSekolah["Alamat Lengkap Sekolah"] || ""),
            akreditasi: String(rawSekolah.akreditasi || rawSekolah["Peringkat Akreditasi"] || "A"),
            namaKepsek: String(rawSekolah.namaKepsek || rawSekolah["Nama Kepala Sekolah"] || ""),
            nipKepsek: String(rawSekolah.nipKepsek || rawSekolah["NIP Kepala Sekolah"] || "")
          };
        }

        // Guru
        const rawGuru = Array.isArray(rawData.guru) ? rawData.guru[0] : (rawData.dataguru?.[0] || rawData.guru);
        if (rawGuru && (rawGuru.nama || rawGuru["Nama Lengkap Guru"])) {
          guru = {
            nip: String(rawGuru.nip || rawGuru["NIP / NUPTK"] || ""),
            nama: String(rawGuru.nama || rawGuru["Nama Lengkap Guru"] || ""),
            sertifikasi: String(rawGuru.sertifikasi || rawGuru["Status Sertifikasi"] || "Sudah Sertifikasi"),
            kontak: String(rawGuru.kontak || rawGuru["Nomor Kontak / WhatsApp"] || ""),
            isWaliKelas: Boolean(rawGuru.isWaliKelas === true || rawGuru.isWaliKelas === "true" || String(rawGuru["Tugas Tambahan Wali Kelas"]).includes("Ya")),
            waliKelasDi: String(rawGuru.waliKelasDi || rawGuru["Rombel Perwalian"] || "VII-A"),
            fotoProfil: "/guru_sadiq.jpg"
          };
        }

        // Jurnal Mengajar
        const rawJurnal = Array.isArray(rawData.jurnal) ? rawData.jurnal : (rawData.jurnalmengajar || []);
        if (rawJurnal.length > 0) {
          jurnalMengajar = rawJurnal.map((j: any, idx: number) => ({
            id: String(j.id || `jm-${Date.now()}-${idx}`),
            tanggal: String(j.tanggal || j["Tanggal"] || ""),
            kelasId: String(j.kelasId || j["Kelas"] || ""),
            jamKe: String(j.jamKe || j["Jam Ke"] || "1-2"),
            materiPokok: String(j.materiPokok || j["Materi Pembelajaran Pokok"] || j["Materi"] || ""),
            kegiatanKbm: String(j.kegiatanKbm || j["Kegiatan KBM"] || j.ringkasanKbm || ""),
            kehadiranHadir: Number(j.kehadiranHadir ?? j["Hadir"] ?? 0),
            kehadiranIzin: Number(j.kehadiranIzin ?? j["Izin"] ?? 0),
            kehadiranSakit: Number(j.kehadiranSakit ?? j["Sakit"] ?? 0),
            kehadiranAlpa: Number(j.kehadiranAlpa ?? j["Alpa"] ?? 0),
            catatanKejadian: String(j.catatanKejadian || j["Catatan Kejadian / Refleksi Kelas"] || j.refleksi || "")
          })).filter((j: JurnalMengajar) => j.tanggal || j.materiPokok);
        }

        // Nilai Paralel
        const rawParalel = Array.isArray(rawData.nilai_paralel) ? rawData.nilai_paralel : (rawData.nilaiparalelsemester || []);
        if (rawParalel.length > 0) {
          nilaiParalelList = rawParalel.map((np: any, idx: number) => ({
            id: String(np.id || `np-${Date.now()}-${idx}`),
            siswaNisn: String(np.siswaNisn || np.nisn || np["NISN"] || "").replace(/[^0-9]/g, ""),
            siswaNama: String(np.siswaNama || np.nama || np["Nama Lengkap Siswa"] || ""),
            kelasParalel: String(np.kelasParalel || np.kelas || np["Kelas Paralel"] || "7A"),
            semester: (Number(np.semester || np["Semester"]) || 1) as any,
            mapel: String(np.mapel || np["Mata Pelajaran"] || "Pendidikan Agama Islam"),
            uhList: Array.isArray(np.uhList) ? np.uhList : (typeof np.uhList === "string" ? JSON.parse(np.uhList || "[]") : []),
            tList: Array.isArray(np.tList) ? np.tList : (typeof np.tList === "string" ? JSON.parse(np.tList || "[]") : []),
            pts: Number(np.pts || np["PTS"] || 0),
            pas: Number(np.pas || np["PAS"] || 0),
            kkm: Number(np.kkm || np["KKM"] || 75)
          })).filter((np: NilaiSemesterParalel) => np.siswaNama || np.siswaNisn);
        }

        // Ibadah
        const rawIbadah = Array.isArray(rawData.ibadah) ? rawData.ibadah : (rawData.jurnalibadahharian || []);
        if (rawIbadah.length > 0) {
          jurnalIbadah = rawIbadah.map((ib: any, idx: number) => {
            const sholatWajib = typeof ib.shalatWajib === "object" && ib.shalatWajib !== null ? ib.shalatWajib : {};
            return {
              id: String(ib.id || `ibadah-${Date.now()}-${idx}`),
              tanggal: String(ib.tanggal || ib["Tanggal"] || ""),
              siswaNisn: String(ib.siswaNisn || ib.nisn || ib["NISN"] || "").replace(/[^0-9]/g, ""),
              sholatSubuh: Boolean(ib.sholatSubuh || sholatWajib.subuh || String(ib["Subuh"]).toLowerCase().startsWith("y")),
              sholatDzuhur: Boolean(ib.sholatDzuhur || sholatWajib.dzuhur || String(ib["Dzuhur"]).toLowerCase().startsWith("y")),
              sholatAshar: Boolean(ib.sholatAshar || sholatWajib.ashar || String(ib["Ashar"]).toLowerCase().startsWith("y")),
              sholatMaghrib: Boolean(ib.sholatMaghrib || sholatWajib.maghrib || String(ib["Maghrib"]).toLowerCase().startsWith("y")),
              sholatIsya: Boolean(ib.sholatIsya || sholatWajib.isya || String(ib["Isya"]).toLowerCase().startsWith("y")),
              sholatDhuha: Boolean(ib.sholatDhuha || String(ib["Dhuha"]).toLowerCase().startsWith("y")),
              membacaAlQuranAyat: Number(ib.membacaAlQuranAyat || ib["Tadarus Al-Qur'an"] || 0),
              membacaAlQuranSurah: String(ib.membacaAlQuranSurah || ""),
              membantuOrangTua: Boolean(ib.membantuOrangTua || String(ib["Bantu Orang Tua"]).toLowerCase().startsWith("y")),
              catatanKebaikan: String(ib.catatanKebaikan || ib["Catatan Kebaikan"] || "")
            };
          }).filter((ib: JurnalIbadahHarian) => ib.siswaNisn);
        }
      }
    } catch (gasErr) {
      console.warn("Apps Script pull failed, attempting Spreadsheet REST fallback:", gasErr);
    }
  }

  // 2. Tarik via Google Spreadsheet REST API / CSV jika spreadsheetId terdaftar
  if (config.spreadsheetId && config.spreadsheetId.trim() && !config.spreadsheetId.includes("apps-script")) {
    try {
      const cleanId = extractSpreadsheetId(config.spreadsheetId);

      // Helper untuk mencoba membaca tabel dengan berbagai kemungkinan variasi nama tab
      const fetchSheetWithFallback = async (names: string[]): Promise<(string | number)[][]> => {
        for (const name of names) {
          try {
            const rows = await getSpreadsheetValues(cleanId, `'${name}'!A1:Z500`);
            if (rows && rows.length > 0) return rows;
          } catch {
            try {
              const rows = await getSpreadsheetValues(cleanId, `${name}!A1:Z500`);
              if (rows && rows.length > 0) return rows;
            } catch {}
          }
        }
        return [];
      };

      // 2a. Data Siswa
      if (students.length === 0) {
        try {
          const rows = await fetchSheetWithFallback(["Data Siswa", "DataSiswa", "Data Siswa (Semua)", "Siswa", "Sheet1"]);
          if (rows && rows.length > 0) {
            // Deteksi baris header
            let headerIdx = rows.findIndex((r) => {
              const line = r.join(" ").toLowerCase();
              return line.includes("nisn") || line.includes("peserta didik") || line.includes("nama lengkap");
            });
            const dataRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : (rows.length > 3 ? rows.slice(3) : rows);

            const parsedSiswa: Siswa[] = [];
            dataRows.forEach((r) => {
              const first = String(r[0] || "").trim().toLowerCase();
              if (!first || first.includes("mengetahui") || first.includes("total") || first.includes("rekapitulasi")) return;

              let nisn = "";
              let nama = "";
              let gender: "Laki-laki" | "Perempuan" = "Laki-laki";
              let agama = "Islam";
              let kelasId = "7A";
              let kontak: string | undefined;
              let catatan: string | undefined;

              if (String(r[1] || "").match(/^\d{8,12}$/)) {
                // Format: [No, NISN, Nama, Gender, Agama, Kelas, Status, Kontak, Catatan]
                nisn = String(r[1]).replace(/[^0-9]/g, "");
                nama = String(r[2] || "").trim();
                gender = String(r[3] || "").toUpperCase().startsWith("P") ? "Perempuan" : "Laki-laki";
                agama = String(r[4] || "Islam");
                kelasId = String(r[5] || "7A").trim();
                kontak = r[7] ? String(r[7]) : undefined;
                catatan = r[8] ? String(r[8]) : undefined;
              } else if (String(r[0] || "").match(/^\d{8,12}$/)) {
                // Format: [NISN, Nama, Gender, Agama, Status, Kelas, ...]
                nisn = String(r[0]).replace(/[^0-9]/g, "");
                nama = String(r[1] || "").trim();
                gender = String(r[2] || "").toUpperCase().startsWith("P") ? "Perempuan" : "Laki-laki";
                agama = String(r[3] || "Islam");
                kelasId = String(r[5] || r[4] || "7A").trim();
                kontak = r[6] ? String(r[6]) : undefined;
                catatan = r[7] ? String(r[7]) : undefined;
              } else if (r[1] && String(r[1]).trim().length >= 2) {
                // Fallback sederhana jika NISN string umum
                nisn = String(r[0] || "").replace(/[^0-9]/g, "") || `nisn-${Date.now()}`;
                nama = String(r[1] || "").trim();
                kelasId = String(r[2] || "7A").trim();
              }

              if (nama && (nisn || parsedSiswa.length < 100)) {
                parsedSiswa.push({
                  nisn: nisn || `nisn-${parsedSiswa.length + 1}`,
                  nama,
                  gender,
                  agama,
                  statusKeaktifan: "Aktif",
                  kelasId,
                  kontakOrangTua: kontak,
                  catatanKhusus: catatan
                });
              }
            });

            if (parsedSiswa.length > 0) {
              students = parsedSiswa;
              source = source === "appscript" ? "mixed" : "spreadsheet";
            }
          }
        } catch (errSheet) {
          console.warn("Could not read Data Siswa tab:", errSheet);
        }
      }

      // 2b. Data Kelas
      if (classes.length === 0) {
        try {
          const rows = await fetchSheetWithFallback(["Data Kelas", "DataKelas", "Kelas"]);
          if (rows && rows.length > 0) {
            let headerIdx = rows.findIndex((r) => {
              const line = r.join(" ").toLowerCase();
              return line.includes("kode rombel") || line.includes("nama rombongan") || line.includes("wali kelas");
            });
            const dataRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : (rows.length > 3 ? rows.slice(3) : rows);

            const parsedKelas: Kelas[] = [];
            dataRows.forEach((r) => {
              const id = String(r[1] && String(r[1]).length <= 6 ? r[1] : r[0] || "").trim();
              const nama = String(r[2] || r[1] || `Kelas ${id}`).trim();
              if (id && !id.toLowerCase().includes("rekap") && !id.toLowerCase().includes("total")) {
                parsedKelas.push({
                  id,
                  nama,
                  waliKelasNip: String(r[4] || r[2] || ""),
                  waliKelasNama: String(r[5] || r[3] || ""),
                  kuota: Number(r[6] || r[4]) || 32,
                  totalSiswa: Number(r[7] || r[5]) || 0
                });
              }
            });
            if (parsedKelas.length > 0) classes = parsedKelas;
          }
        } catch (errSheet) {
          console.warn("Could not read Data Kelas tab:", errSheet);
        }
      }

      // 2c. Rekap Nilai Siswa (Master Rekap PAI)
      if (rekapNilai.length === 0) {
        try {
          const rows = await fetchSheetWithFallback(["Master Rekap PAI", "DataPenilaian", "Data Penilaian", "RekapNilai", "Rekap Nilai PAI"]);
          if (rows && rows.length > 0) {
            let headerIdx = rows.findIndex((r) => {
              const line = r.join(" ").toLowerCase();
              return line.includes("kuis") || line.includes("tugas") || line.includes("formatif") || line.includes("pts");
            });
            const dataRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : (rows.length > 3 ? rows.slice(3) : rows);

            const parsedRekap: RekapNilaiTotal[] = [];
            dataRows.forEach((r) => {
              const first = String(r[0] || "").trim().toLowerCase();
              if (!first || first.includes("mengetahui") || first.includes("total") || first.includes("rekapitulasi") || first.includes("rata-rata")) return;

              let nisn = "";
              let nama = "";
              let kls = "7A";
              let kuis = 0;
              let tugas = 0;
              let diskusi = 0;
              let pts = 0;
              let pas = 0;
              let juz = 0;
              let sholat = 0;
              let wudhu = 0;

              if (String(r[1] || "").match(/^\d{8,12}$/)) {
                // Template with 'No' at col 0: [No, NISN, Nama, Kelas, Kuis, Tugas, Diskusi, Rerata, PTS, PAS, Hafalan, Sholat, Wudhu]
                nisn = String(r[1]).replace(/[^0-9]/g, "");
                nama = String(r[2] || "").trim();
                kls = String(r[3] || "7A").trim();
                kuis = Number(r[4]) || 0;
                tugas = Number(r[5]) || 0;
                diskusi = Number(r[6]) || 0;
                pts = Number(r[8]) || 0;
                pas = Number(r[9]) || 0;
                juz = Number(r[10]) || 0;
                sholat = Number(r[11]) || 0;
                wudhu = Number(r[12]) || 0;
              } else if (String(r[0] || "").match(/^\d{8,12}$/)) {
                // Template starting with NISN: [NISN, Nama, Kelas, Kuis, Tugas, Diskusi, PTS, PAS, ...]
                nisn = String(r[0]).replace(/[^0-9]/g, "");
                nama = String(r[1] || "").trim();
                kls = String(r[2] || "7A").trim();
                kuis = Number(r[3]) || 0;
                tugas = Number(r[4]) || 0;
                diskusi = Number(r[5]) || 0;
                pts = Number(r[6] || r[7]) || 0;
                pas = Number(r[7] || r[8]) || 0;
                juz = Number(r[8] || r[9]) || 0;
                sholat = Number(r[9] || r[10]) || 0;
                wudhu = Number(r[10] || r[11]) || 0;
              }

              if (nama || nisn) {
                parsedRekap.push({
                  siswaNisn: nisn || `nisn-${parsedRekap.length + 1}`,
                  siswaNama: nama,
                  kelasId: kls,
                  formatifKuis: kuis,
                  formatifTugas: tugas,
                  formatifDiskusi: diskusi,
                  sumatifPts: pts,
                  sumatifPas: pas,
                  hafalanJuzAmmaScore: juz,
                  praktikSholat: sholat,
                  praktikWudhu: wudhu
                });
              }
            });

            if (parsedRekap.length > 0) rekapNilai = parsedRekap;
          }
        } catch (errSheet) {
          console.warn("Could not read Master Rekap PAI tab:", errSheet);
        }
      }

      // 2d. Nilai Semester Paralel (12 UH, PTS, PAS)
      if (nilaiParalelList.length === 0) {
        try {
          const rows = await fetchSheetWithFallback(["Nilai Semester Paralel", "NilaiParalelSemester", "Buku Nilai Paralel"]);
          if (rows && rows.length > 0) {
            let headerIdx = rows.findIndex((r) => {
              const line = r.join(" ").toLowerCase();
              return line.includes("uh 1") || line.includes("uh1") || line.includes("mata pelajaran");
            });
            const dataRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : (rows.length > 3 ? rows.slice(3) : rows);

            const parsedParalel: NilaiSemesterParalel[] = [];
            dataRows.forEach((r, idx) => {
              const first = String(r[0] || "").trim().toLowerCase();
              if (!first || first.includes("mengetahui") || first.includes("total") || first.includes("rekapitulasi")) return;

              let nisn = String(r[1] || r[0] || "").replace(/[^0-9]/g, "");
              let nama = String(r[2] || r[1] || "").trim();
              let kls = String(r[3] || r[2] || "7A").trim();

              const safeUh = Array(10).fill(0).map((_, i) => Number(r[6 + i]) || 0);
              const safeT = Array(5).fill(0).map((_, i) => Number(r[16 + i]) || 0);

              if (nama || nisn) {
                parsedParalel.push({
                  id: `np-${nisn || idx}-${Date.now()}`,
                  siswaNisn: nisn || `nisn-${idx}`,
                  siswaNama: nama,
                  kelasParalel: kls,
                  semester: "1",
                  mapel: String(r[5] || "Pendidikan Agama Islam"),
                  uhList: safeUh,
                  tList: safeT,
                  pts: Number(r[22] || r[17]) || 0,
                  pas: Number(r[23] || r[18]) || 0,
                  kkm: Number(r[25] || r[20]) || 75
                });
              }
            });

            if (parsedParalel.length > 0) nilaiParalelList = parsedParalel;
          }
        } catch (errSheet) {
          console.warn("Could not read Nilai Semester Paralel tab:", errSheet);
        }
      }

      // 2e. Jurnal Mengajar Guru
      if (jurnalMengajar.length === 0) {
        try {
          const rows = await fetchSheetWithFallback(["Jurnal Mengajar", "JurnalMengajar", "Jurnal Guru"]);
          if (rows && rows.length > 0) {
            let headerIdx = rows.findIndex((r) => {
              const line = r.join(" ").toLowerCase();
              return line.includes("jam ke") || line.includes("materi pembelajaran") || line.includes("kegiatan kbm");
            });
            const dataRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : (rows.length > 3 ? rows.slice(3) : rows);

            const parsedJurnals: JurnalMengajar[] = [];
            dataRows.forEach((r, idx) => {
              const tgl = String(r[1] || r[0] || "").trim();
              const materi = String(r[4] || r[3] || "").trim();
              if (tgl || materi) {
                parsedJurnals.push({
                  id: String(r[0] || `jm-${Date.now()}-${idx}`),
                  tanggal: tgl,
                  kelasId: String(r[2] || r[1] || "VII-A").trim(),
                  jamKe: String(r[3] || r[2] || "1-2"),
                  materiPokok: materi,
                  kegiatanKbm: String(r[5] || r[4] || ""),
                  kehadiranHadir: Number(r[6] || r[5]) || 0,
                  kehadiranSakit: Number(r[7] || r[6]) || 0,
                  kehadiranIzin: Number(r[8] || r[7]) || 0,
                  kehadiranAlpa: Number(r[9] || r[8]) || 0,
                  catatanKejadian: String(r[10] || r[9] || "")
                });
              }
            });
            if (parsedJurnals.length > 0) jurnalMengajar = parsedJurnals;
          }
        } catch (errSheet) {
          console.warn("Could not read Jurnal Mengajar tab:", errSheet);
        }
      }

      // 2f. Data Sekolah
      if (!sekolah) {
        try {
          const rows = await fetchSheetWithFallback(["Data Sekolah", "DataSekolah"]);
          if (rows && rows.length > 0) {
            // Check if key-value rows
            const s: Partial<DataSekolah> = {};
            rows.forEach((r) => {
              const key = String(r[0] || "").toLowerCase();
              const val = String(r[1] || "").trim();
              if (key.includes("nama satuan") || key.includes("nama sekolah")) s.namaSekolah = val;
              if (key.includes("npsn")) s.npsn = val;
              if (key.includes("alamat")) s.alamat = val;
              if (key.includes("akreditasi")) s.akreditasi = val;
              if (key.includes("nama kepala")) s.namaKepsek = val;
              if (key.includes("nip kepala")) s.nipKepsek = val;
            });
            if (s.namaSekolah) {
              sekolah = {
                namaSekolah: s.namaSekolah,
                npsn: s.npsn || "10806871",
                alamat: s.alamat || "",
                akreditasi: s.akreditasi || "A",
                namaKepsek: s.namaKepsek || "",
                nipKepsek: s.nipKepsek || ""
              };
            }
          }
        } catch {}
      }

      // 2g. Data Guru
      if (!guru) {
        try {
          const rows = await fetchSheetWithFallback(["Data Guru", "DataGuru"]);
          if (rows && rows.length > 0) {
            let gRow = rows.find((r) => String(r[1] || "").match(/^\d{10,20}$/) || String(r[2] || "").includes("S.Pd"));
            if (gRow) {
              guru = {
                nip: String(gRow[1] || ""),
                nama: String(gRow[2] || ""),
                sertifikasi: String(gRow[4] || "Pendidik Profesional"),
                kontak: String(gRow[5] || ""),
                isWaliKelas: String(gRow[6] || "").toLowerCase().includes("ya"),
                waliKelasDi: String(gRow[7] || "VIII-A"),
                fotoProfil: "/guru_sadiq.jpg"
              };
            }
          }
        } catch {}
      }
    } catch (sheetErr) {
      console.warn("Spreadsheet pull error:", sheetErr);
    }
  }

  // Jika kelas kosong tetapi siswa ada, otomatis generate kelas unik dari siswa
  if (classes.length === 0 && students.length > 0) {
    const uniqueKelas = Array.from(new Set(students.map((s) => s.kelasId).filter(Boolean)));
    classes = uniqueKelas.map((kId) => ({
      id: kId,
      nama: `Kelas ${kId}`,
      waliKelasNip: guru?.nip || "19790917 201407 1 004",
      waliKelasNama: guru?.nama || "Sadiqul Alim, S.Pd.I., M.Pd.",
      kuota: 32,
      totalSiswa: students.filter((s) => s.kelasId === kId).length
    }));
  }

  // Jika rekapNilai kosong tetapi siswa ada, buatkan entri rekapNilai awal dari siswa
  if (rekapNilai.length === 0 && students.length > 0) {
    rekapNilai = getUnifiedRekapNilaiList([], students);
  }

  // Validasi apakah setidaknya ada data yang berhasil ditarik
  const totalFound = students.length + classes.length + rekapNilai.length + nilaiParalelList.length + jurnalMengajar.length + jurnalIbadah.length;
  if (totalFound === 0 && !sekolah && !guru) {
    throw new Error(
      "Tidak ada data yang berhasil ditarik. Pastikan link Google Spreadsheet dibagikan ke publik ('Siapa saja yang memiliki link dapat melihat') atau link Google Apps Script Web App (/exec) sudah terpasang dengan benar."
    );
  }

  // 3. Simpan ke Local Storage via DataService
  if (saveToLocal) {
    if (students.length > 0) DataService.saveSiswa(students);
    if (classes.length > 0) DataService.saveKelas(classes);
    if (rekapNilai.length > 0) DataService.saveRekapNilai(rekapNilai);
    if (nilaiParalelList.length > 0) DataService.saveNilaiSemesterParalel(nilaiParalelList);
    if (jurnalMengajar.length > 0) DataService.saveJurnalMengajar(jurnalMengajar);
    if (jurnalIbadah.length > 0) DataService.saveIbadah(jurnalIbadah);
    if (sekolah) DataService.saveSekolah(sekolah);
    if (guru) DataService.saveGuru(guru);
  }

  const nowStr = new Date().toLocaleTimeString("id-ID");
  const summary = {
    totalStudents: students.length,
    totalClasses: classes.length,
    totalRekapNilai: rekapNilai.length,
    totalNilaiParalel: nilaiParalelList.length,
    totalJurnalMengajar: jurnalMengajar.length,
    totalJurnalIbadah: jurnalIbadah.length,
    hasSekolah: !!sekolah,
    hasGuru: !!guru
  };

  const pullLog: SyncLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: nowStr,
    status: "success",
    message: `Tarik Data Berhasil (${source}): ${summary.totalStudents} Siswa, ${summary.totalClasses} Rombel, ${summary.totalRekapNilai} Rekap Nilai, ${summary.totalNilaiParalel} Nilai Paralel, ${summary.totalJurnalMengajar} Jurnal Mengajar.`,
    affectedSheets: ["DataSiswa", "DataKelas", "DataSekolah", "DataGuru", "DataPenilaian", "JurnalMengajar", "JurnalIbadah"]
  };

  saveSheetsSyncConfig({
    ...config,
    syncStatus: "synced",
    lastSyncedAt: nowStr,
    lastSyncedTimestamp: Date.now(),
    syncLogs: [pullLog, ...(config.syncLogs || [])].slice(0, 20)
  });

  return {
    students,
    classes,
    rekapNilai,
    nilaiParalelList,
    jurnalMengajar,
    jurnalIbadah,
    sekolah,
    guru,
    source,
    summary,
    pulledAt: nowStr
  };
};
