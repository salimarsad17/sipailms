/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken, isLiveGoogleToken } from "./googleAuth";
import { Siswa, Kelas, RekapNilaiTotal, NilaiSemesterParalel, JurnalMengajar, JurnalIbadahHarian, UserAccount, DataSekolah, Guru } from "../types";

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
  mimeType?: string;
  size?: number | string;
  category?: "spreadsheet" | "document" | "backup" | "file";
  description?: string;
  owners?: { displayName?: string; emailAddress?: string }[];
  isLocal?: boolean;
}

export interface GoogleSheetMetadata {
  spreadsheetId: string;
  properties: {
    title: string;
    locale?: string;
    timeZone?: string;
  };
  sheets: {
    properties: {
      sheetId: number;
      title: string;
      index: number;
      gridProperties?: {
        rowCount: number;
        columnCount: number;
      };
    };
  }[];
}

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowCount: number;
  sheetCount?: number;
}

export interface ExportSheetPayload {
  title: string;
  rows: (string | number)[][] ;
}

/**
 * Extracts spreadsheet ID cleanly from various Google Sheets URL formats or raw IDs
 */
export const extractSpreadsheetId = (input: string): string => {
  if (!input) return "";
  let trimmed = input.trim().replace(/^["']|["']$/g, "");
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  // Strip trailing /edit, /view, #gid=..., ?usp=...
  trimmed = trimmed.replace(/\/(edit|view|htmlview|copy).*$/i, "");
  trimmed = trimmed.replace(/[?#].*$/, "");
  trimmed = trimmed.replace(/\/+$/, "");
  return trimmed;
};

/**
 * Ensures a valid Google OAuth access token is available
 */
const requireToken = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token || !isLiveGoogleToken(token)) {
    throw new Error(
      "Akses Google Sheets langsung memerlukan akun Google yang terhubung dengan token OAuth. Anda dapat mengunduh berkas dalam format Excel (.xlsx) secara langsung."
    );
  }
  return token;
};

/**
 * Lists all files from user's Google Drive or local storage
 */
export const listDriveFiles = async (
  type: "all" | "spreadsheets" | "documents" | "backups" = "all"
): Promise<GoogleDriveFile[]> => {
  const token = await getAccessToken();

  try {
    const res = await fetch(`/api/google/drive/files?type=${type}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data.files)) {
        return data.files;
      }
    }
  } catch (proxyErr) {
    console.warn("Drive proxy attempt failed:", proxyErr);
  }

  // Direct Google Drive API fallback if live token is present
  if (token && isLiveGoogleToken(token)) {
    try {
      let query = "trashed=false";
      if (type === "spreadsheets") {
        query += " and mimeType='application/vnd.google-apps.spreadsheet'";
      }
      const encodedQuery = encodeURIComponent(query);
      const fields = encodeURIComponent("files(id,name,mimeType,size,modifiedTime,webViewLink,owners)");
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=40`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return (data.files || []).map((f: any) => ({
          ...f,
          category: f.mimeType?.includes("spreadsheet") ? "spreadsheet" : "document",
          isLocal: false
        }));
      }
    } catch (err: any) {
      console.warn("Direct Drive API fetch failed:", err);
    }
  }

  return [];
};

/**
 * Lists spreadsheets from user's Google Drive
 */
export const listDriveSpreadsheets = async (): Promise<GoogleDriveFile[]> => {
  return await listDriveFiles("spreadsheets");
};

/**
 * Uploads a file (LKPD, rapor, document, backup) to Google Drive or local file store
 */
export const uploadFileToGoogleDrive = async (payload: {
  name: string;
  mimeType?: string;
  contentBase64?: string;
  textContent?: string;
  category?: "spreadsheet" | "document" | "backup" | "file";
  description?: string;
}): Promise<GoogleDriveFile> => {
  const token = await getAccessToken();
  const res = await fetch("/api/google/drive/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.file) {
    throw new Error(data.error?.message || "Gagal mengunggah berkas ke Google Drive.");
  }
  return data.file;
};

/**
 * Deletes a file from Google Drive or local file store
 */
export const deleteDriveFile = async (id: string): Promise<boolean> => {
  const token = await getAccessToken();
  const res = await fetch(`/api/google/drive/files/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.ok;
};

/**
 * Retrieves metadata for a specific spreadsheet (titles, tabs)
 */
export const getSpreadsheetMetadata = async (spreadsheetId: string): Promise<GoogleSheetMetadata> => {
  const token = await requireToken();

  try {
    // 1. Primary: Backend proxy
    const proxyRes = await fetch(`/api/google/sheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (proxyRes.ok) {
      return await proxyRes.json();
    } else {
      const errData = await proxyRes.json().catch(() => ({}));
      const rawMsg = errData?.error?.message || "";
      if (proxyRes.status === 404 || rawMsg.includes("Requested entity was not found") || rawMsg.includes("not found")) {
        throw new Error(
          `Spreadsheet Google dengan ID '${spreadsheetId}' tidak ditemukan (404). Pastikan URL/ID benar dan berkas telah dibagikan (akses lihat/edit) ke akun Google Anda.`
        );
      }
      if (proxyRes.status === 403) {
        throw new Error("Akses ditolak (403). Akun Google Anda belum memiliki izin membuka spreadsheet ini. Harap minta izin akses ke pemilik berkas.");
      }
      if (rawMsg) {
        throw new Error(rawMsg);
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes("Failed to fetch") && !err.message.includes("proxy")) {
      throw err;
    }
    console.warn("Proxy metadata fetch failed, trying direct fetch:", err);
  }

  // 2. Direct fetch fallback
  if (!isLiveGoogleToken(token)) {
    throw new Error("Token autentikasi Google OAuth 2.0 belum terhubung atau tidak valid.");
  }
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets.properties`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const rawMsg = err?.error?.message || "";
      if (res.status === 404 || rawMsg.includes("Requested entity was not found") || rawMsg.includes("not found")) {
        throw new Error(
          `Spreadsheet Google dengan ID '${spreadsheetId}' tidak ditemukan (404). Pastikan URL/ID benar dan berkas telah dibagikan (akses lihat/edit) ke akun Google Anda.`
        );
      }
      if (res.status === 403) {
        throw new Error("Akses ditolak (403). Akun Google Anda belum memiliki izin membuka spreadsheet ini.");
      }
      throw new Error(rawMsg || `Gagal memuat detail Google Sheets (status ${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    if (err?.message === "Failed to fetch") {
      throw new Error("Koneksi ke Google terhambat browser atau jaringan. Pastikan URL/ID Spreadsheet benar.");
    }
    throw err;
  }
};

/**
 * Reads values from a range in a spreadsheet
 */
export const getSpreadsheetValues = async (
  spreadsheetId: string,
  range: string = "A1:Z500"
): Promise<(string | number)[][]> => {
  const token = await requireToken();
  const encodedRange = encodeURIComponent(range);

  try {
    // 1. Primary: Backend proxy
    const proxyRes = await fetch(`/api/google/sheets/${spreadsheetId}/values?range=${encodedRange}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return data.values || [];
    } else {
      const errData = await proxyRes.json().catch(() => ({}));
      const rawMsg = errData?.error?.message || "";
      if (proxyRes.status === 404 || rawMsg.includes("Requested entity was not found")) {
        throw new Error(
          `Data lembar atau rentang '${range}' tidak ditemukan di spreadsheet ini (404). Pastikan nama tab lembar kerja sesuai.`
        );
      }
      if (rawMsg) {
        throw new Error(rawMsg);
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes("Failed to fetch") && !err.message.includes("proxy")) {
      throw err;
    }
    console.warn("Proxy values fetch failed, trying direct fetch:", err);
  }

  // 2. Direct fetch fallback
  if (!isLiveGoogleToken(token)) {
    throw new Error("Token autentikasi Google OAuth 2.0 belum terhubung atau tidak valid.");
  }
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const rawMsg = err?.error?.message || "";
      if (res.status === 404 || rawMsg.includes("Requested entity was not found")) {
        throw new Error(
          `Data lembar atau rentang '${range}' tidak ditemukan di spreadsheet ini (404). Pastikan nama tab lembar kerja sesuai.`
        );
      }
      throw new Error(rawMsg || `Gagal membaca isi Google Sheets (status ${res.status})`);
    }

    const data = await res.json();
    return data.values || [];
  } catch (err: any) {
    if (err?.message === "Failed to fetch") {
      throw new Error("Koneksi ke Google terhambat browser atau jaringan.");
    }
    throw err;
  }
};

/**
 * Creates a new Google Spreadsheet with multiple sheets/tabs and values
 */
export const createMultiSheetGoogleSpreadsheet = async (
  title: string,
  sheets: ExportSheetPayload[]
): Promise<ExportResult> => {
  const token = await requireToken();
  const safeSheets = sheets.map((s, idx) => ({
    title: (s.title || `Sheet${idx + 1}`).replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 50),
    rows: s.rows || []
  }));

  // 1. Primary: Backend proxy (bypasses browser iframe CORS, handles batch updates)
  try {
    const proxyRes = await fetch("/api/google/sheets/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        sheets: safeSheets
      })
    });

    if (proxyRes.ok) {
      const result: ExportResult = await proxyRes.json();
      return result;
    } else {
      const errData = await proxyRes.json().catch(() => ({}));
      if (errData?.error?.message) {
        throw new Error(errData.error.message);
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes("Failed to fetch")) {
      throw err;
    }
    console.warn("Proxy multi-sheet create failed, attempting direct Google API call:", err);
  }

  // 2. Direct fallback (valid properties without unsupported locale)
  if (!isLiveGoogleToken(token)) {
    throw new Error("Token autentikasi Google OAuth 2.0 belum terhubung. Silakan gunakan opsi Unduh Excel (.xlsx).");
  }
  try {
    const createUrl = "https://sheets.googleapis.com/v4/spreadsheets";
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: safeSheets.map((s) => ({
          properties: {
            title: s.title,
            gridProperties: {
              frozenRowCount: 4
            }
          }
        }))
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal membuat spreadsheet Google baru (status ${createRes.status})`);
    }

    const createdData = await createRes.json();
    const spreadsheetId = createdData.spreadsheetId;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Populate data across sheets
    const dataToPopulate = safeSheets
      .filter((s) => s.rows && s.rows.length > 0)
      .map((s) => ({
        range: `'${s.title}'!A1`,
        values: s.rows
      }));

    if (dataToPopulate.length > 0) {
      const batchRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            valueInputOption: "USER_ENTERED",
            data: dataToPopulate
          })
        }
      );

      if (!batchRes.ok) {
        for (const item of dataToPopulate) {
          const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            item.range
          )}?valueInputOption=USER_ENTERED`;

          await fetch(updateUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: item.values })
          }).catch((e) => console.warn("Direct update fallback error:", item.range, e));
        }
      }
    }

    const totalRows = safeSheets.reduce((acc, s) => acc + s.rows.length, 0);

    return {
      spreadsheetId,
      spreadsheetUrl,
      title,
      rowCount: totalRows,
      sheetCount: safeSheets.length
    };
  } catch (err: any) {
    if (err?.message === "Failed to fetch") {
      throw new Error("Koneksi pembuatan spreadsheet terhambat oleh kebijakan iframe atau jaringan browser.");
    }
    throw err;
  }
};

/**
 * Creates a new Google Spreadsheet with provided single sheet & values (wrapper)
 */
export const createGoogleSpreadsheet = async (
  title: string,
  sheetTitle: string,
  rows: (string | number)[][]
): Promise<ExportResult> => {
  return await createMultiSheetGoogleSpreadsheet(title, [{ title: sheetTitle, rows }]);
};

/**
 * Appends rows to an existing spreadsheet tab
 */
export const appendSpreadsheetValues = async (
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<void> => {
  const token = await requireToken();

  try {
    // 1. Primary: Backend proxy
    const proxyRes = await fetch(`/api/google/sheets/${spreadsheetId}/values/append`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ range, values })
    });

    if (proxyRes.ok) {
      return;
    }
  } catch (err) {
    console.warn("Proxy append failed, trying direct API call:", err);
  }

  // 2. Direct fallback
  if (!isLiveGoogleToken(token)) {
    throw new Error("Token autentikasi Google OAuth 2.0 belum terhubung.");
  }
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal menambahkan baris ke Google Sheets (status ${res.status})`);
    }
  } catch (err: any) {
    if (err?.message === "Failed to fetch") {
      throw new Error("Koneksi penambahan data Google Sheets terhambat browser/jaringan.");
    }
    throw err;
  }
};

/**
 * Updates/overwrites values in an existing spreadsheet
 */
export const updateSpreadsheetValues = async (
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<void> => {
  const token = await requireToken();

  try {
    // 1. Primary: Backend proxy
    const proxyRes = await fetch(`/api/google/sheets/${spreadsheetId}/values`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ range, values })
    });

    if (proxyRes.ok) {
      return;
    }
  } catch (err) {
    console.warn("Proxy update failed, trying direct API call:", err);
  }

  // 2. Direct fallback
  if (!isLiveGoogleToken(token)) {
    throw new Error("Token autentikasi Google OAuth 2.0 belum terhubung.");
  }
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal memperbarui Google Sheets (status ${res.status})`);
    }
  } catch (err: any) {
    if (err?.message === "Failed to fetch") {
      throw new Error("Koneksi pembaruan data Google Sheets terhambat browser/jaringan.");
    }
    throw err;
  }
};

/**
 * EXPORT 1: Students Directory to Google Sheets (Grouped by Class)
 */
export const exportStudentsToGoogleSheet = async (
  students: Siswa[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  targetKelasId: string = "ALL",
  classes?: Kelas[]
): Promise<ExportResult> => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const cleanSheetTab = (tabName: string) => tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

  const getStudentRow = (s: Siswa, idx: number) => [
    idx + 1,
    s.nisn,
    s.nama,
    s.kelasId,
    s.gender,
    s.agama,
    s.statusKeaktifan,
    s.kontakOrangTua || "-",
    s.catatanKhusus || "-"
  ];

  const headers = [
    "No",
    "NISN",
    "Nama Lengkap",
    "Kelas",
    "Jenis Kelamin",
    "Agama",
    "Status Keaktifan",
    "Kontak Orang Tua",
    "Catatan Khusus"
  ];

  // Specific single class export
  if (targetKelasId && targetKelasId !== "ALL") {
    const classStudents = students.filter((s) => s.kelasId === targetKelasId);
    const wali = classes?.find((c) => c.id === targetKelasId)?.waliKelasNama;

    const rows: (string | number)[][] = [
      [`DAFTAR PESERTA DIDIK KELAS ${targetKelasId} - ${schoolName.toUpperCase()}`],
      [`Wali Kelas: ${wali || "-"} • Rombel: ${targetKelasId} • Total: ${classStudents.length} Siswa • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classStudents.forEach((s, idx) => rows.push(getStudentRow(s, idx)));

    const title = `PAILMS - Data Peserta Didik Kelas ${targetKelasId} (${classStudents.length} Siswa) - ${new Date().toISOString().slice(0, 10)}`;
    return await createGoogleSpreadsheet(title, `Kelas ${targetKelasId}`, rows);
  }

  // Unified single sheet export for all students (no multi-tab splitting)
  const masterRows: (string | number)[][] = [
    [`DAFTAR PESERTA DIDIK (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Aplikasi Pembelajaran PAI & Budi Pekerti (PAILMS) • Total: ${students.length} Siswa • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedStudents = [...students].sort((a, b) => {
    if (a.kelasId !== b.kelasId) return a.kelasId.localeCompare(b.kelasId);
    return a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
  });

  sortedStudents.forEach((s, idx) => masterRows.push(getStudentRow(s, idx)));

  const title = `PAILMS - Data Peserta Didik (${students.length} Siswa) - ${new Date().toISOString().slice(0, 10)}`;
  return await createGoogleSpreadsheet(title, "Data Siswa", masterRows);
};

/**
 * Helper to get unified list of RekapNilai records merged with students data
 * ensuring all students with inputted data are represented.
 */
export const getUnifiedRekapNilaiList = (
  rekapList: RekapNilaiTotal[] = [],
  students: Siswa[] = []
): RekapNilaiTotal[] => {
  const studentMap = new Map<string, Siswa>();
  students.forEach((s) => studentMap.set(s.nisn, s));

  const rekapMap = new Map<string, RekapNilaiTotal>();

  // 1. Add existing rekap records, keeping student name & class in sync with students master
  rekapList.forEach((r) => {
    const s = studentMap.get(r.siswaNisn);
    rekapMap.set(r.siswaNisn, {
      ...r,
      siswaNama: s?.nama || r.siswaNama,
      kelasId: s?.kelasId || r.kelasId || "Tanpa Kelas",
      formatifKuis: typeof r.formatifKuis === "number" ? r.formatifKuis : 80,
      formatifTugas: typeof r.formatifTugas === "number" ? r.formatifTugas : 80,
      formatifDiskusi: typeof r.formatifDiskusi === "number" ? r.formatifDiskusi : 80,
      sumatifPts: typeof r.sumatifPts === "number" ? r.sumatifPts : 80,
      sumatifPas: typeof r.sumatifPas === "number" ? r.sumatifPas : 80,
      hafalanJuzAmmaScore: typeof r.hafalanJuzAmmaScore === "number" ? r.hafalanJuzAmmaScore : 85,
      praktikSholat: typeof r.praktikSholat === "number" ? r.praktikSholat : 85,
      praktikWudhu: typeof r.praktikWudhu === "number" ? r.praktikWudhu : 85
    });
  });

  // 2. For any student not yet in rekapMap, generate standard record with their actual class
  students.forEach((st) => {
    if (!rekapMap.has(st.nisn)) {
      rekapMap.set(st.nisn, {
        siswaNisn: st.nisn,
        siswaNama: st.nama,
        kelasId: st.kelasId || "Tanpa Kelas",
        formatifKuis: 80,
        formatifTugas: 80,
        formatifDiskusi: 80,
        sumatifPts: 80,
        sumatifPas: 80,
        hafalanJuzAmmaScore: 85,
        praktikSholat: 85,
        praktikWudhu: 85
      });
    }
  });

  return Array.from(rekapMap.values());
};

export const REKAP_PAI_HEADERS = [
  "No",
  "NISN",
  "Nama Lengkap Siswa",
  "Kelas",
  "Formatif - Kuis",
  "Formatif - Tugas",
  "Formatif - Diskusi",
  "Rata-rata Formatif",
  "Sumatif - PTS",
  "Sumatif - PAS",
  "Hafalan Juz 'Amma",
  "Praktik Sholat",
  "Praktik Wudhu",
  "Nilai Akhir (NA)",
  "KKTP Acuan",
  "Predikat",
  "Keterangan",
  "Deskripsi Capaian Pembelajaran"
];

export const formatRekapRow = (r: RekapNilaiTotal, idx: number): (string | number)[] => {
  const avgFormatif = Math.round((r.formatifKuis + r.formatifTugas + r.formatifDiskusi) / 3);
  const na = Math.round(avgFormatif * 0.4 + r.sumatifPts * 0.3 + r.sumatifPas * 0.3);
  const predikat =
    na >= 88 ? "A (Sangat Baik)" : na >= 75 ? "B (Baik)" : na >= 65 ? "C (Cukup)" : "D (Perlu Bimbingan)";
  const ket = na >= 75 ? "Tuntas (Melampaui KKTP)" : "Perlu Bimbingan / Remedial";
  const deskripsi =
    na >= 88
      ? "Sangat baik dalam penguasaan materi PAI, hafalan juz 'amma fasih, serta tertib ibadah harian."
      : na >= 75
      ? "Baik dalam pemahaman materi PAI, praktik ibadah sholat dan wudhu, serta kelancaran hafalan."
      : na >= 65
      ? "Cukup menguasai capaian materi, perlu penguatan hafalan surat pendek dan pembiasaan sholat fardhu."
      : "Perlu bimbingan dan pendampingan intensif dalam penguasaan materi dasar PAI dan praktik ibadah.";

  return [
    idx + 1,
    r.siswaNisn,
    r.siswaNama,
    r.kelasId,
    r.formatifKuis,
    r.formatifTugas,
    r.formatifDiskusi,
    avgFormatif,
    r.sumatifPts,
    r.sumatifPas,
    r.hafalanJuzAmmaScore || 85,
    r.praktikSholat || 85,
    r.praktikWudhu || 85,
    na,
    75,
    predikat,
    ket,
    deskripsi
  ];
};

export const formatRekapSummaryRow = (items: RekapNilaiTotal[], labelKelas: string): (string | number)[] => {
  if (items.length === 0) return [];
  let sumKuis = 0,
    sumTugas = 0,
    sumDiskusi = 0,
    sumPts = 0,
    sumPas = 0,
    sumHafalan = 0,
    sumSholat = 0,
    sumWudhu = 0,
    sumNa = 0,
    tuntasCount = 0;

  items.forEach((r) => {
    const avgF = Math.round((r.formatifKuis + r.formatifTugas + r.formatifDiskusi) / 3);
    const na = Math.round(avgF * 0.4 + r.sumatifPts * 0.3 + r.sumatifPas * 0.3);
    sumKuis += r.formatifKuis;
    sumTugas += r.formatifTugas;
    sumDiskusi += r.formatifDiskusi;
    sumPts += r.sumatifPts;
    sumPas += r.sumatifPas;
    sumHafalan += r.hafalanJuzAmmaScore || 85;
    sumSholat += r.praktikSholat || 85;
    sumWudhu += r.praktikWudhu || 85;
    sumNa += na;
    if (na >= 75) tuntasCount++;
  });

  const len = items.length;
  const avgKuis = Math.round(sumKuis / len);
  const avgTugas = Math.round(sumTugas / len);
  const avgDiskusi = Math.round(sumDiskusi / len);
  const avgF = Math.round((avgKuis + avgTugas + avgDiskusi) / 3);
  const avgPts = Math.round(sumPts / len);
  const avgPas = Math.round(sumPas / len);
  const avgHafalan = Math.round(sumHafalan / len);
  const avgSholat = Math.round(sumSholat / len);
  const avgWudhu = Math.round(sumWudhu / len);
  const avgNa = Math.round(sumNa / len);
  const predikatKelas =
    avgNa >= 88 ? "A (Sangat Baik)" : avgNa >= 75 ? "B (Baik)" : avgNa >= 65 ? "C (Cukup)" : "D (Perlu Bimbingan)";
  const pctTuntas = Math.round((tuntasCount / len) * 100);

  return [
    "",
    "",
    `RATA-RATA KELAS (${labelKelas})`,
    labelKelas,
    avgKuis,
    avgTugas,
    avgDiskusi,
    avgF,
    avgPts,
    avgPas,
    avgHafalan,
    avgSholat,
    avgWudhu,
    avgNa,
    75,
    predikatKelas,
    `Tuntas: ${tuntasCount}/${len} (${pctTuntas}%)`,
    `Tingkat Ketuntasan Rombel ${labelKelas}: ${pctTuntas}% (${tuntasCount} dari ${len} siswa mencapai KKTP 75)`
  ];
};

/**
 * EXPORT 2: Grade Summary (Rekap Nilai PAI) to Google Sheets (Grouped by Class)
 */
export const exportRekapNilaiToGoogleSheet = async (
  rekapList: RekapNilaiTotal[],
  students: Siswa[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  targetKelasId: string = "ALL",
  classes?: Kelas[]
): Promise<ExportResult> => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const cleanSheetTab = (tabName: string) =>
    tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

  // Unify rekap and students to guarantee ALL inputted students across every class are included
  const unifiedRekap = getUnifiedRekapNilaiList(rekapList, students);

  // Detect all classes that actually have data inputted (exclude empty classes)
  const inputtedClasses = Array.from(
    new Set(unifiedRekap.map((r) => r.kelasId).filter(Boolean))
  ).sort();

  const headers = REKAP_PAI_HEADERS;
  const getRekapRow = formatRekapRow;
  const getSummaryRow = formatRekapSummaryRow;

  // 1. SPECIFIC SINGLE CLASS EXPORT
  if (targetKelasId && targetKelasId !== "ALL") {
    const classRekap = unifiedRekap
      .filter((r) => r.kelasId === targetKelasId)
      .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
    const wali = classes?.find((c) => c.id === targetKelasId)?.waliKelasNama || "-";

    const rows: (string | number)[][] = [
      [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI - KELAS ${targetKelasId}`],
      [`${schoolName.toUpperCase()}`],
      [`Wali Kelas: ${wali} • Rombel: ${targetKelasId} • KKTP Acuan: 75 • Jumlah: ${classRekap.length} Siswa • Tanggal Ekspor: ${now}`],
      [""],
      headers
    ];

    classRekap.forEach((r, idx) => rows.push(getRekapRow(r, idx)));
    if (classRekap.length > 0) {
      rows.push([]);
      rows.push(getSummaryRow(classRekap, targetKelasId));
      rows.push([]);
      rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
      rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
      rows.push([]);
      rows.push([]);
      rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
      rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
    }

    const title = `PAILMS - Rekap Nilai PAI Kelas ${targetKelasId} (${classRekap.length} Siswa) - ${new Date().toISOString().slice(0, 10)}`;
    return await createGoogleSpreadsheet(title, `Nilai ${targetKelasId}`, rows);
  }

  // 2. UNIFIED SINGLE SHEET EXPORT (NO MULTI-TAB SPLITTING)
  const masterRows: (string | number)[][] = [
    [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2024/2025 • KKTP Acuan: 75 • Total: ${unifiedRekap.length} Siswa • Tanggal Ekspor: ${now}`],
    [""],
    headers
  ];

  unifiedRekap.forEach((r, idx) => masterRows.push(getRekapRow(r, idx)));

  if (unifiedRekap.length > 0) {
    masterRows.push([]);
    masterRows.push(getSummaryRow(unifiedRekap, "Semua Siswa"));
    masterRows.push([]);
    masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
    masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
    masterRows.push([]);
    masterRows.push([]);
    masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
    masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
  }

  const title = `PAILMS - Rekap Nilai PAI (${unifiedRekap.length} Siswa) - ${new Date().toISOString().slice(0, 10)}`;
  return await createGoogleSpreadsheet(title, "Rekap Nilai PAI", masterRows);
};

/**
 * EXPORT 3: Teaching Journal (Jurnal Mengajar) to Google Sheets (Grouped by Class)
 */
export const exportJurnalMengajarToGoogleSheet = async (
  jurnalList: JurnalMengajar[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  targetKelasId: string = "ALL",
  classes?: Kelas[]
): Promise<ExportResult> => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const cleanSheetTab = (tabName: string) => tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

  const headers = [
    "No",
    "Tanggal",
    "Kelas",
    "Jam Ke",
    "Materi Pembelajaran Pokok",
    "Kegiatan KBM",
    "Hadir",
    "Sakit",
    "Izin",
    "Alpa",
    "Catatan Kejadian / Refleksi Kelas"
  ];

  const getJurnalRow = (j: JurnalMengajar, idx: number) => [
    idx + 1,
    j.tanggal,
    j.kelasId,
    j.jamKe,
    j.materiPokok,
    j.kegiatanKbm || "-",
    j.kehadiranHadir,
    j.kehadiranSakit,
    j.kehadiranIzin,
    j.kehadiranAlpa,
    j.catatanKejadian || "-"
  ];

  // Specific single class
  if (targetKelasId && targetKelasId !== "ALL") {
    const classJurnal = jurnalList.filter((j) => j.kelasId === targetKelasId);
    const rows: (string | number)[][] = [
      [`JURNAL AGENDA HARIAN MENGAJAR GURU PAI - KELAS ${targetKelasId}`],
      [`${schoolName.toUpperCase()} • Rombel: ${targetKelasId} • Total: ${classJurnal.length} Tatap Muka • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classJurnal.forEach((j, idx) => rows.push(getJurnalRow(j, idx)));

    const title = `PAILMS - Jurnal Mengajar Kelas ${targetKelasId} (${classJurnal.length} Pertemuan) - ${new Date().toISOString().slice(0, 10)}`;
    return await createGoogleSpreadsheet(title, `Jurnal ${targetKelasId}`, rows);
  }

  // Single unified sheet for all journal entries (no multi-tab splitting)
  const masterRows: (string | number)[][] = [
    [`JURNAL AGENDA HARIAN MENGAJAR GURU PAI - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${jurnalList.length} Catatan Mengajar • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedJurnal = [...jurnalList].sort((a, b) => {
    if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
    return a.kelasId.localeCompare(b.kelasId);
  });
  sortedJurnal.forEach((j, idx) => masterRows.push(getJurnalRow(j, idx)));

  const title = `PAILMS - Jurnal Mengajar Guru (${jurnalList.length} Pertemuan) - ${new Date().toISOString().slice(0, 10)}`;
  return await createGoogleSpreadsheet(title, "Jurnal Mengajar", masterRows);
};

/**
 * EXPORT 4: Worship Journal (Jurnal Ibadah Harian Siswa) to Google Sheets (Unified Single Sheet)
 */
export const exportJurnalIbadahToGoogleSheet = async (
  worships: JurnalIbadahHarian[],
  students: Siswa[],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas",
  targetKelasId: string = "ALL",
  classes?: Kelas[]
): Promise<ExportResult> => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const studentMap = new Map<string, Siswa>();
  students.forEach((s) => studentMap.set(s.nisn, s));

  const headers = [
    "No",
    "Tanggal",
    "NISN",
    "Nama Siswa",
    "Kelas",
    "Subuh",
    "Dzuhur",
    "Ashar",
    "Maghrib",
    "Isya",
    "Dhuha",
    "Tadarus Al-Qur'an",
    "Bantu Orang Tua",
    "Catatan Kebaikan"
  ];

  const getWorshipRow = (w: JurnalIbadahHarian, idx: number) => {
    const s = studentMap.get(w.siswaNisn);
    return [
      idx + 1,
      w.tanggal,
      w.siswaNisn,
      s?.nama || "Siswa",
      s?.kelasId || "-",
      w.sholatSubuh ? "Ya" : "Tidak",
      w.sholatDzuhur ? "Ya" : "Tidak",
      w.sholatAshar ? "Ya" : "Tidak",
      w.sholatMaghrib ? "Ya" : "Tidak",
      w.sholatIsya ? "Ya" : "Tidak",
      w.sholatDhuha ? "Ya" : "Tidak",
      w.membacaAlQuranAyat > 0 ? `${w.membacaAlQuranSurah || "Al-Qur'an"} (${w.membacaAlQuranAyat} ayat)` : "-",
      w.membantuOrangTua ? "Ya" : "Tidak",
      w.catatanKebaikan || "-"
    ];
  };

  // Specific single class
  if (targetKelasId && targetKelasId !== "ALL") {
    const classWorships = worships.filter(
      (w) => (studentMap.get(w.siswaNisn)?.kelasId || "") === targetKelasId
    );
    const rows: (string | number)[][] = [
      [`JURNAL IBADAH MANDIRI PESERTA DIDIK - KELAS ${targetKelasId}`],
      [`${schoolName.toUpperCase()} • Rombel: ${targetKelasId} • Total: ${classWorships.length} Catatan Ibadah • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classWorships.forEach((w, idx) => rows.push(getWorshipRow(w, idx)));

    const title = `PAILMS - Rekap Jurnal Ibadah Siswa Kelas ${targetKelasId} (${classWorships.length} Catatan) - ${new Date().toISOString().slice(0, 10)}`;
    return await createGoogleSpreadsheet(title, `Ibadah ${targetKelasId}`, rows);
  }

  // Single unified sheet for all worship entries (no multi-tab splitting)
  const masterRows: (string | number)[][] = [
    [`JURNAL IBADAH MANDIRI PESERTA DIDIK - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${worships.length} Catatan Ibadah • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedWorships = [...worships].sort((a, b) => {
    if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
    const sA = studentMap.get(a.siswaNisn);
    const sB = studentMap.get(b.siswaNisn);
    const kA = sA?.kelasId || "";
    const kB = sB?.kelasId || "";
    if (kA !== kB) return kA.localeCompare(kB);
    return (sA?.nama || "").localeCompare(sB?.nama || "");
  });
  sortedWorships.forEach((w, idx) => masterRows.push(getWorshipRow(w, idx)));

  const title = `PAILMS - Rekap Jurnal Ibadah Siswa (${worships.length} Catatan) - ${new Date().toISOString().slice(0, 10)}`;
  return await createGoogleSpreadsheet(title, "Jurnal Ibadah", masterRows);
};

/**
 * Parses spreadsheet rows into Siswa records for importing
 */
export const parseSpreadsheetRowsToStudents = (
  values: (string | number)[][],
  defaultClassId: string = "VII-A"
): { students: Siswa[]; skipped: number; warnings: string[] } => {
  const students: Siswa[] = [];
  let skipped = 0;
  const warnings: string[] = [];

  if (!values || values.length === 0) {
    return { students, skipped, warnings };
  }

  // Find header row by searching for keywords
  let headerIndex = -1;
  let nisnCol = -1;
  let namaCol = -1;
  let kelasCol = -1;
  let genderCol = -1;
  let agamaCol = -1;
  let statusCol = -1;
  let kontakCol = -1;
  let catatanCol = -1;

  for (let r = 0; r < Math.min(values.length, 10); r++) {
    const row = values[r].map((cell) => String(cell || "").trim().toLowerCase());
    const nIndex = row.findIndex((c) => c.includes("nisn") || c.includes("induk"));
    const nmIndex = row.findIndex((c) => c.includes("nama"));

    if (nIndex !== -1 && nmIndex !== -1) {
      headerIndex = r;
      nisnCol = nIndex;
      namaCol = nmIndex;
      kelasCol = row.findIndex((c) => c.includes("kelas") || c.includes("rombel"));
      genderCol = row.findIndex((c) => c.includes("gender") || c.includes("kelamin") || c === "jk" || c === "l/p");
      agamaCol = row.findIndex((c) => c.includes("agama"));
      statusCol = row.findIndex((c) => c.includes("status") || c.includes("aktif"));
      kontakCol = row.findIndex((c) => c.includes("kontak") || c.includes("telepon") || c.includes("wa") || c.includes("hp"));
      catatanCol = row.findIndex((c) => c.includes("catatan") || c.includes("keterangan"));
      break;
    }
  }

  // If no explicit header was found, assume columns 1=NISN, 2=Nama, 3=Kelas or 0=No, 1=NISN, 2=Nama
  const startRow = headerIndex >= 0 ? headerIndex + 1 : 0;

  for (let r = startRow; r < values.length; r++) {
    const row = values[r];
    if (!row || row.length === 0) continue;

    let nisn = "";
    let nama = "";
    let kelasId = defaultClassId;
    let gender: "Laki-laki" | "Perempuan" = "Laki-laki";
    let agama = "Islam";
    let statusKeaktifan: "Aktif" | "Tidak Aktif" = "Aktif";
    let kontakOrangTua = "";
    let catatanKhusus = "";

    if (headerIndex >= 0) {
      nisn = String(row[nisnCol] || "").trim();
      nama = String(row[namaCol] || "").trim();
      if (kelasCol >= 0 && row[kelasCol]) kelasId = String(row[kelasCol]).trim();
      if (genderCol >= 0 && row[genderCol]) {
        const g = String(row[genderCol]).trim().toLowerCase();
        gender = g.startsWith("p") || g.includes("wanita") || g.includes("perempuan") ? "Perempuan" : "Laki-laki";
      }
      if (agamaCol >= 0 && row[agamaCol]) agama = String(row[agamaCol]).trim() || "Islam";
      if (statusCol >= 0 && row[statusCol]) {
        const st = String(row[statusCol]).trim().toLowerCase();
        statusKeaktifan = st.includes("tidak") || st.includes("non") ? "Tidak Aktif" : "Aktif";
      }
      if (kontakCol >= 0 && row[kontakCol]) kontakOrangTua = String(row[kontakCol]).trim();
      if (catatanCol >= 0 && row[catatanCol]) catatanKhusus = String(row[catatanCol]).trim();
    } else {
      // Fallback heuristics: check if first col is number or NISN
      const col0 = String(row[0] || "").trim();
      const col1 = String(row[1] || "").trim();
      const col2 = String(row[2] || "").trim();

      if (/^\d{8,12}$/.test(col0)) {
        nisn = col0;
        nama = col1;
        if (col2) kelasId = col2;
      } else if (/^\d{8,12}$/.test(col1)) {
        nisn = col1;
        nama = col2;
        if (row[3]) kelasId = String(row[3]).trim();
      } else if (col1.length > 2) {
        nisn = col0 || `NISN${r + 1000}`;
        nama = col1;
      }
    }

    // Validation
    if (!nama || nama.toLowerCase().includes("nama") || nama.length < 2) {
      skipped++;
      continue;
    }

    if (!nisn) {
      nisn = `00${Math.floor(10000000 + Math.random() * 90000000)}`;
      warnings.push(`Baris ${r + 1}: Siswa "${nama}" tidak memiliki NISN; dibuatkan NISN otomatis ${nisn}`);
    }

    // Clean up NISN
    nisn = nisn.replace(/[^0-9]/g, "");
    if (!nisn) {
      nisn = `00${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    students.push({
      nisn,
      nama,
      kelasId,
      gender,
      agama,
      statusKeaktifan,
      kontakOrangTua: kontakOrangTua || undefined,
      catatanKhusus: catatanKhusus || undefined
    });
  }

  return { students, skipped, warnings };
};

// =========================================================================
// DATA DASAR GOOGLE SHEETS SYNC & FORMATTING (SEKOLAH, GURU, KELAS, SISWA)
// =========================================================================

/**
 * Format Data Sekolah rows for Google Sheets export
 */
export const formatDataSekolahRows = (sekolah?: DataSekolah): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const s = sekolah || {
    namaSekolah: "UPT SMPN 2 Rebang Tangkas",
    npsn: "10806871",
    alamat: "Jl. Lapangan Sriwijaya No. 02, Simpang Tiga, Kec. Rebang Tangkas, Kab. Way Kanan, Lampung 34768",
    akreditasi: "A (Unggul)",
    namaKepsek: "Drs. H. Mulyadi, M.M.",
    nipKepsek: "19700318 199503 1 002"
  };

  return [
    ["PROFIL DAN DATA POKOK SATUAN PENDIDIKAN"],
    [`Diperbarui pada: ${now} • Sumber: Menu Data Dasar PAILMS`],
    [""],
    ["Parameter Informasi", "Keterangan / Nilai Data"],
    ["Nama Satuan Pendidikan", s.namaSekolah],
    ["Nomor Pokok Sekolah Nasional (NPSN)", s.npsn],
    ["Peringkat Akreditasi", s.akreditasi || "A"],
    ["Alamat Lengkap Sekolah", s.alamat],
    ["Nama Kepala Sekolah", s.namaKepsek],
    ["NIP Kepala Sekolah", s.nipKepsek],
    ["Tahun Ajaran Aktif", "2024/2025 (Fase D Kurikulum Merdeka)"],
    ["Status Sinkronisasi", "Terhubung Otomatis ke PAILMS"]
  ];
};

/**
 * Format Data Guru rows for Google Sheets export
 */
export const formatDataGuruRows = (guru?: Guru, sekolah?: DataSekolah): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const g = guru || {
    nama: "Sadiqul Alim, S.Pd.I., M.Pd.",
    nip: "19790917 201407 1 004",
    sertifikasi: "Pendidik Profesional (Sertifikasi Kemenag)",
    kontak: "0812-7890-1234",
    isWaliKelas: true,
    waliKelasDi: "VIII-A"
  };

  const headers = [
    "No",
    "NIP / NUPTK",
    "Nama Lengkap Guru",
    "Mata Pelajaran Diampu",
    "Status Sertifikasi",
    "Nomor Kontak / WhatsApp",
    "Tugas Tambahan Wali Kelas",
    "Rombel Perwalian",
    "Satuan Pendidikan Induk"
  ];

  return [
    ["DATA GURU PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI"],
    [`Satuan Pendidikan: ${sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas"} • Tanggal: ${now}`],
    [""],
    headers,
    [
      1,
      g.nip,
      g.nama,
      "Pendidikan Agama Islam dan Budi Pekerti (Fase D)",
      g.sertifikasi,
      g.kontak || "-",
      g.isWaliKelas ? "Ya (Wali Kelas)" : "Bukan Wali Kelas",
      g.waliKelasDi || "-",
      sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas"
    ]
  ];
};

/**
 * Format Data Kelas rows for Google Sheets export
 */
export const formatDataKelasRows = (classes: Kelas[], students: Siswa[]): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const headers = [
    "No",
    "Kode Rombel",
    "Nama Rombongan Belajar",
    "Tingkat / Fase",
    "NIP Wali Kelas",
    "Nama Lengkap Wali Kelas",
    "Kapasitas Kuota",
    "Jumlah Siswa Terdaftar",
    "Persentase Keterisian (%)"
  ];

  const rows: (string | number)[][] = [
    ["DATA ROMBONGAN BELAJAR (KELAS) SATUAN PENDIDIKAN"],
    [`Total: ${classes.length} Rombel • Tanggal Pembaruan: ${now}`],
    [""],
    headers
  ];

  classes.forEach((c, idx) => {
    const studentCount = students.filter((s) => s.kelasId === c.id).length;
    const kuota = c.kuota || 32;
    const pct = Math.round((studentCount / kuota) * 100);
    const tingkat = c.id.startsWith("VII") ? "Kelas VII" : c.id.startsWith("VIII") ? "Kelas VIII" : "Kelas IX";

    rows.push([
      idx + 1,
      c.id,
      c.nama,
      tingkat,
      c.waliKelasNip || "-",
      c.waliKelasNama || "-",
      kuota,
      studentCount,
      `${pct}%`
    ]);
  });

  return rows;
};

/**
 * Format Data Siswa rows for Google Sheets export
 */
export const formatDataSiswaRows = (
  students: Siswa[],
  classes: Kelas[],
  sekolah?: DataSekolah
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const headers = [
    "No",
    "NISN",
    "Nama Lengkap Peserta Didik",
    "Jenis Kelamin",
    "Agama",
    "Rombel / Kelas",
    "Status Keaktifan",
    "Kontak Orang Tua / Wali",
    "Catatan Khusus",
    "Satuan Pendidikan"
  ];

  const sortedStudents = [...students].sort((a, b) => {
    if (a.kelasId !== b.kelasId) return a.kelasId.localeCompare(b.kelasId);
    return a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
  });

  const rows: (string | number)[][] = [
    [`BUKU INDUK DATA PESERTA DIDIK - ${sekolah?.namaSekolah?.toUpperCase() || "UPT SMPN 2 REBANG TANGKAS"}`],
    [`Tahun Ajaran 2024/2025 • Total: ${sortedStudents.length} Peserta Didik • Terakhir Disinkron: ${now}`],
    [""],
    headers
  ];

  sortedStudents.forEach((s, idx) => {
    rows.push([
      idx + 1,
      s.nisn,
      s.nama,
      s.gender,
      s.agama,
      s.kelasId,
      s.statusKeaktifan,
      s.kontakOrangTua || "-",
      s.catatanKhusus || "-",
      sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas"
    ]);
  });

  return rows;
};

/**
 * Format Data Siswa per Kelas spesifik untuk lembar kerja (tab) terpisah
 */
export const formatDataSiswaPerKelasRows = (
  kelasId: string,
  students: Siswa[],
  classes: Kelas[] = [],
  sekolah?: DataSekolah
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const classObj = classes.find((c) => c.id === kelasId);
  const classStudents = students
    .filter((s) => s.kelasId === kelasId)
    .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

  const totalL = classStudents.filter((s) => s.gender === "Laki-laki").length;
  const totalP = classStudents.filter((s) => s.gender === "Perempuan").length;
  const totalAktif = classStudents.filter((s) => s.statusKeaktifan === "Aktif").length;
  const wali = classObj?.waliKelasNama || "-";
  const nipWali = classObj?.waliKelasNip || "-";
  const kuota = classObj?.kuota || 32;

  const headers = [
    "No",
    "NISN",
    "Nama Lengkap Peserta Didik",
    "Jenis Kelamin",
    "Agama",
    "Status Keaktifan",
    "Kontak Orang Tua / Wali",
    "Catatan Khusus"
  ];

  const rows: (string | number)[][] = [
    [`DAFTAR PESERTA DIDIK KELAS ${kelasId} - ${sekolah?.namaSekolah?.toUpperCase() || "UPT SMPN 2 REBANG TANGKAS"}`],
    [`Wali Kelas: ${wali} (NIP: ${nipWali}) • Kapasitas: ${classStudents.length}/${kuota} Siswa (${totalL} L / ${totalP} P, ${totalAktif} Aktif) • Terakhir Disinkron: ${now}`],
    [""],
    headers
  ];

  classStudents.forEach((s, idx) => {
    rows.push([
      idx + 1,
      s.nisn,
      s.nama,
      s.gender,
      s.agama || "Islam",
      s.statusKeaktifan,
      s.kontakOrangTua || "-",
      s.catatanKhusus || "-"
    ]);
  });

  // Rekapitulasi Rombel di bagian bawah
  rows.push([""]);
  rows.push(["REKAPITULASI DATA KELAS", kelasId]);
  rows.push(["Total Siswa Terdaftar", classStudents.length]);
  rows.push(["Siswa Laki-laki (L)", totalL]);
  rows.push(["Siswa Perempuan (P)", totalP]);
  rows.push(["Siswa Aktif", totalAktif]);

  return rows;
};

/**
 * Format Ringkasan Terpadu Master Data Dasar
 */
export const formatMasterDataDasarSummaryRows = (
  sekolah?: DataSekolah,
  guru?: Guru,
  classes: Kelas[] = [],
  students: Siswa[] = []
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const totalL = students.filter((s) => s.gender === "Laki-laki").length;
  const totalP = students.filter((s) => s.gender === "Perempuan").length;
  const totalAktif = students.filter((s) => s.statusKeaktifan === "Aktif").length;

  return [
    ["MASTER DATA DASAR PENDIDIKAN - RINGKASAN EKSEKUTIF"],
    [`${sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas"} • Tanggal Pembaruan: ${now}`],
    [""],
    ["KATEGORI DATA", "PARAMETER UTAMA", "JUMLAH / RINCIAN"],
    ["1. Profil Sekolah", "Nama Sekolah", sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas"],
    ["", "NPSN", sekolah?.npsn || "10806871"],
    ["", "Peringkat Akreditasi", sekolah?.akreditasi || "A (Unggul)"],
    ["", "Kepala Sekolah", sekolah?.namaKepsek || "Drs. H. Mulyadi, M.M."],
    ["2. Pendidik PAI", "Nama Guru", guru?.nama || "Sadiqul Alim, S.Pd.I., M.Pd."],
    ["", "NIP Guru", guru?.nip || "19790917 201407 1 004"],
    ["", "Sertifikasi", guru?.sertifikasi || "Pendidik Profesional"],
    ["", "Kontak", guru?.kontak || "0812-7890-1234"],
    ["3. Rombel / Kelas", "Total Rombongan Belajar", `${classes.length} Rombel`],
    ["", "Daftar Rombel", classes.map((c) => c.nama).join(", ")],
    ["4. Peserta Didik", "Total Siswa Terdaftar", `${students.length} Siswa`],
    ["", "Siswa Aktif", `${totalAktif} Siswa`],
    ["", "Siswa Laki-laki (L)", `${totalL} Siswa`],
    ["", "Siswa Perempuan (P)", `${totalP} Siswa`],
    [""],
    ["Keterangan:", "Data ini disinkronkan secara otomatis dari modul Data Dasar PAILMS."]
  ];
};

/**
 * Creates a brand-new multi-sheet Google Spreadsheet containing ALL Data Dasar:
 * 1. RINGKASAN DATA DASAR
 * 2. DATA SEKOLAH
 * 3. DATA GURU
 * 4. DATA KELAS
 * 5. DATA SISWA (SEMUA)
 * 6. DATA SISWA PER MASING-MASING ROMBEL KELAS (Kelas VII-A, VII-B, dst.)
 */
export const createDataDasarGoogleSpreadsheet = async (
  title: string,
  sekolah?: DataSekolah,
  guru?: Guru,
  classes: Kelas[] = [],
  students: Siswa[] = []
): Promise<ExportResult> => {
  const masterRows = formatMasterDataDasarSummaryRows(sekolah, guru, classes, students);
  const sekolahRows = formatDataSekolahRows(sekolah);
  const guruRows = formatDataGuruRows(guru, sekolah);
  const kelasRows = formatDataKelasRows(classes, students);
  const siswaRows = formatDataSiswaRows(students, classes, sekolah);

  const sheets: ExportSheetPayload[] = [
    { title: "Ringkasan Data Dasar", rows: masterRows },
    { title: "Data Sekolah", rows: sekolahRows },
    { title: "Data Guru", rows: guruRows },
    { title: "Data Kelas", rows: kelasRows },
    { title: "Data Siswa (Semua)", rows: siswaRows }
  ];

  // Tambahkan sheet data siswa per masing-masing rombel kelas!
  const definedClassIds = classes.map((c) => c.id);
  const studentClassIds = students.map((s) => s.kelasId);
  const allClasses = Array.from(new Set([...definedClassIds, ...studentClassIds].filter(Boolean))).sort();

  allClasses.forEach((cId) => {
    const classRows = formatDataSiswaPerKelasRows(cId, students, classes, sekolah);
    sheets.push({
      title: `Siswa Kelas ${cId}`.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30),
      rows: classRows
    });
  });

  return await createMultiSheetGoogleSpreadsheet(title, sheets);
};

/**
 * Updates an existing Google Spreadsheet with the latest Data Dasar including per-class sheets
 */
export const syncDataDasarToExistingSpreadsheet = async (
  spreadsheetId: string,
  sekolah?: DataSekolah,
  guru?: Guru,
  classes: Kelas[] = [],
  students: Siswa[] = []
): Promise<void> => {
  const masterRows = formatMasterDataDasarSummaryRows(sekolah, guru, classes, students);
  const sekolahRows = formatDataSekolahRows(sekolah);
  const guruRows = formatDataGuruRows(guru, sekolah);
  const kelasRows = formatDataKelasRows(classes, students);
  const siswaRows = formatDataSiswaRows(students, classes, sekolah);

  // Sync to available sheets or append
  await updateSpreadsheetValues(spreadsheetId, "Ringkasan Data Dasar!A1:Z100", masterRows).catch(() =>
    updateSpreadsheetValues(spreadsheetId, "Sheet1!A1:Z100", masterRows)
  );
  await updateSpreadsheetValues(spreadsheetId, "Data Sekolah!A1:Z50", sekolahRows).catch(() => {});
  await updateSpreadsheetValues(spreadsheetId, "Data Guru!A1:Z50", guruRows).catch(() => {});
  await updateSpreadsheetValues(spreadsheetId, "Data Kelas!A1:Z100", kelasRows).catch(() => {});
  await updateSpreadsheetValues(spreadsheetId, "Data Siswa!A1:Z500", siswaRows).catch(() => {});
  await updateSpreadsheetValues(spreadsheetId, "'Data Siswa (Semua)'!A1:Z500", siswaRows).catch(() => {});

  // Sync per-class sheets
  const definedClassIds = classes.map((c) => c.id);
  const studentClassIds = students.map((s) => s.kelasId);
  const allClasses = Array.from(new Set([...definedClassIds, ...studentClassIds].filter(Boolean))).sort();

  for (const cId of allClasses) {
    const classRows = formatDataSiswaPerKelasRows(cId, students, classes, sekolah);
    const safeTitle = `Siswa Kelas ${cId}`.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);
    await updateSpreadsheetValues(spreadsheetId, `'${safeTitle}'!A1:Z500`, classRows).catch(() => {});
  }
};

/**
 * Format Jurnal Mengajar into 2D rows for Google Sheets / Excel
 */
export const formatJurnalMengajarSheetRows = (
  jurnalList: JurnalMengajar[] = [],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const headers = [
    "No",
    "Tanggal",
    "Kelas",
    "Jam Ke",
    "Materi Pembelajaran Pokok",
    "Kegiatan KBM",
    "Hadir",
    "Sakit",
    "Izin",
    "Alpa",
    "Catatan Kejadian / Refleksi Kelas"
  ];

  const rows: (string | number)[][] = [
    [`JURNAL AGENDA HARIAN MENGAJAR GURU PAI - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${jurnalList.length} Catatan Pertemuan • Sinkronisasi: ${now}`],
    [""],
    headers
  ];

  const sorted = [...jurnalList].sort((a, b) => {
    if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
    return a.kelasId.localeCompare(b.kelasId);
  });

  sorted.forEach((j, idx) => {
    rows.push([
      idx + 1,
      j.tanggal,
      j.kelasId,
      j.jamKe,
      j.materiPokok,
      j.kegiatanKbm || "-",
      j.kehadiranHadir,
      j.kehadiranSakit,
      j.kehadiranIzin,
      j.kehadiranAlpa,
      j.catatanKejadian || "-"
    ]);
  });

  return rows;
};

/**
 * Format Jurnal Ibadah Siswa into 2D rows for Google Sheets / Excel
 */
export const formatJurnalIbadahSheetRows = (
  worships: JurnalIbadahHarian[] = [],
  students: Siswa[] = [],
  schoolName: string = "UPT SMPN 2 Rebang Tangkas"
): (string | number)[][] => {
  const now = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const studentMap = new Map<string, Siswa>();
  students.forEach((s) => studentMap.set(s.nisn, s));

  const headers = [
    "No",
    "Tanggal",
    "NISN",
    "Nama Siswa",
    "Kelas",
    "Subuh",
    "Dzuhur",
    "Ashar",
    "Maghrib",
    "Isya",
    "Dhuha",
    "Tadarus Al-Qur'an",
    "Bantu Orang Tua",
    "Catatan Kebaikan"
  ];

  const rows: (string | number)[][] = [
    [`JURNAL IBADAH MANDIRI PESERTA DIDIK - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${worships.length} Catatan Ibadah • Sinkronisasi: ${now}`],
    [""],
    headers
  ];

  const sorted = [...worships].sort((a, b) => {
    if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal);
    const sA = studentMap.get(a.siswaNisn);
    const sB = studentMap.get(b.siswaNisn);
    const kA = sA?.kelasId || "";
    const kB = sB?.kelasId || "";
    if (kA !== kB) return kA.localeCompare(kB);
    return (sA?.nama || "").localeCompare(sB?.nama || "");
  });

  sorted.forEach((w, idx) => {
    const s = studentMap.get(w.siswaNisn);
    rows.push([
      idx + 1,
      w.tanggal,
      w.siswaNisn,
      s?.nama || "Siswa",
      s?.kelasId || "-",
      w.sholatSubuh ? "Ya" : "Tidak",
      w.sholatDzuhur ? "Ya" : "Tidak",
      w.sholatAshar ? "Ya" : "Tidak",
      w.sholatMaghrib ? "Ya" : "Tidak",
      w.sholatIsya ? "Ya" : "Tidak",
      w.sholatDhuha ? "Ya" : "Tidak",
      w.membacaAlQuranAyat > 0 ? `${w.membacaAlQuranSurah || "Al-Qur'an"} (${w.membacaAlQuranAyat} ayat)` : "-",
      w.membantuOrangTua ? "Ya" : "Tidak",
      w.catatanKebaikan || "-"
    ]);
  });

  return rows;
};

/**
 * Creates a brand-new comprehensive running database in Google Sheets with 9 primary tables:
 * 1. Ringkasan Database
 * 2. Data Sekolah
 * 3. Data Guru
 * 4. Data Kelas
 * 5. Data Siswa
 * 6. Master Rekap PAI
 * 7. Nilai Semester Paralel
 * 8. Jurnal Mengajar
 * 9. Jurnal Ibadah
 */
export const createFullDatabaseGoogleSpreadsheet = async (
  title: string,
  sekolah?: DataSekolah,
  guru?: Guru,
  classes: Kelas[] = [],
  students: Siswa[] = [],
  rekapNilai: RekapNilaiTotal[] = [],
  nilaiParalel: NilaiSemesterParalel[] = [],
  jurnalMengajar: JurnalMengajar[] = [],
  jurnalIbadah: JurnalIbadahHarian[] = []
): Promise<ExportResult> => {
  const schoolName = sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas";
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // 1. Ringkasan Database
  const summaryRows = formatMasterDataDasarSummaryRows(sekolah, guru, classes, students);
  summaryRows.push([]);
  summaryRows.push(["5. Modul Nilai & Aktivitas", "Rekap Nilai PAI Terdata", `${rekapNilai.length} Catatan Nilai`]);
  summaryRows.push(["", "Nilai Semester Paralel Terdata", `${nilaiParalel.length} Catatan Nilai`]);
  summaryRows.push(["", "Jurnal Mengajar Guru", `${jurnalMengajar.length} Catatan Tatap Muka`]);
  summaryRows.push(["", "Jurnal Ibadah Siswa", `${jurnalIbadah.length} Catatan Ibadah Harian`]);
  summaryRows.push(["", "Terakhir Disinkronkan", `${now} (Database Berjalan PAILMS)`]);

  // 2. Data Dasar Rows
  const sekolahRows = formatDataSekolahRows(sekolah);
  const guruRows = formatDataGuruRows(guru, sekolah);
  const kelasRows = formatDataKelasRows(classes, students);
  const siswaRows = formatDataSiswaRows(students, classes, sekolah);

  // 3. Rekap Nilai PAI Rows
  const unified = getUnifiedRekapNilaiList(rekapNilai, students);
  const masterRekapRows: (string | number)[][] = [
    [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • KKTP: 75 • Total: ${unified.length} Siswa • Terakhir Disinkron: ${now}`],
    [""],
    REKAP_PAI_HEADERS
  ];
  unified.forEach((r, idx) => masterRekapRows.push(formatRekapRow(r, idx)));
  if (unified.length > 0) {
    masterRekapRows.push([]);
    masterRekapRows.push(formatRekapSummaryRow(unified, "Semua Kelas"));
  }

  // 4. Nilai Semester Paralel Rows (from helper)
  const paralelRows: (string | number)[][] = [
    [`BUKU REKAPITULASI PENILAIAN SEMESTER PARALEL - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • Kurikulum Merdeka • Total: ${nilaiParalel.length} Data Penilaian • Tanggal: ${now}`],
    [""],
    [
      "No", "NISN", "Nama Lengkap Siswa", "Kelas Paralel", "Semester", "Mata Pelajaran",
      "UH 1", "UH 2", "UH 3", "UH 4", "UH 5", "UH 6", "UH 7", "UH 8", "UH 9", "UH 10",
      "T 1", "T 2", "T 3", "T 4", "T 5", "Rerata Formatif", "PTS", "PAS", "Nilai Akhir (NA)", "KKM", "Status"
    ]
  ];
  nilaiParalel.filter((r) => !r.isDeleted).forEach((r, idx) => {
    const safeUh = Array(10).fill(0).map((_, i) => (typeof r.uhList?.[i] === "number" ? r.uhList[i] : 0));
    const safeT = Array(5).fill(0).map((_, i) => (typeof r.tList?.[i] === "number" ? r.tList[i] : 0));
    const allFormatif = [...safeUh, ...safeT].filter((v) => v > 0);
    const rerataFormatif = allFormatif.length > 0 ? Math.round(allFormatif.reduce((a, b) => a + b, 0) / allFormatif.length) : 0;
    const na = Math.round(rerataFormatif * 0.4 + r.pts * 0.3 + r.pas * 0.3);
    paralelRows.push([
      idx + 1, r.siswaNisn, r.siswaNama, r.kelasParalel, `Semester ${r.semester}`, r.mapel,
      ...safeUh, ...safeT, rerataFormatif, r.pts, r.pas, na, r.kkm || 75, na >= (r.kkm || 75) ? "Tuntas" : "Remedial"
    ]);
  });

  // 5. Jurnal Mengajar & Ibadah Rows
  const jurnalRows = formatJurnalMengajarSheetRows(jurnalMengajar, schoolName);
  const ibadahRows = formatJurnalIbadahSheetRows(jurnalIbadah, students, schoolName);

  const sheets: ExportSheetPayload[] = [
    { title: "Ringkasan Database", rows: summaryRows },
    { title: "Data Sekolah", rows: sekolahRows },
    { title: "Data Guru", rows: guruRows },
    { title: "Data Kelas", rows: kelasRows },
    { title: "Data Siswa", rows: siswaRows },
    { title: "Master Rekap PAI", rows: masterRekapRows },
    { title: "Nilai Semester Paralel", rows: paralelRows },
    { title: "Jurnal Mengajar", rows: jurnalRows },
    { title: "Jurnal Ibadah", rows: ibadahRows }
  ];

  return await createMultiSheetGoogleSpreadsheet(title, sheets);
};

/**
 * Updates all tables in an existing running Google Spreadsheet database
 */
export const syncFullDatabaseToExistingSpreadsheet = async (
  spreadsheetId: string,
  sekolah?: DataSekolah,
  guru?: Guru,
  classes: Kelas[] = [],
  students: Siswa[] = [],
  rekapNilai: RekapNilaiTotal[] = [],
  nilaiParalel: NilaiSemesterParalel[] = [],
  jurnalMengajar: JurnalMengajar[] = [],
  jurnalIbadah: JurnalIbadahHarian[] = []
): Promise<{ timestamp: string; totalRows: number; updatedSheets: string[] }> => {
  const schoolName = sekolah?.namaSekolah || "UPT SMPN 2 Rebang Tangkas";
  const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const updatedSheets: string[] = [];

  // 1. Ringkasan Database
  const summaryRows = formatMasterDataDasarSummaryRows(sekolah, guru, classes, students);
  summaryRows.push([]);
  summaryRows.push(["5. Modul Nilai & Aktivitas", "Rekap Nilai PAI Terdata", `${rekapNilai.length} Catatan Nilai`]);
  summaryRows.push(["", "Nilai Semester Paralel Terdata", `${nilaiParalel.length} Catatan Nilai`]);
  summaryRows.push(["", "Jurnal Mengajar Guru", `${jurnalMengajar.length} Catatan Tatap Muka`]);
  summaryRows.push(["", "Jurnal Ibadah Siswa", `${jurnalIbadah.length} Catatan Ibadah Harian`]);
  summaryRows.push(["", "Terakhir Disinkronkan", `${now} (Database Berjalan PAILMS)`]);

  // 2. Data Dasar
  const sekolahRows = formatDataSekolahRows(sekolah);
  const guruRows = formatDataGuruRows(guru, sekolah);
  const kelasRows = formatDataKelasRows(classes, students);
  const siswaRows = formatDataSiswaRows(students, classes, sekolah);

  // 3. Rekap Nilai
  const unified = getUnifiedRekapNilaiList(rekapNilai, students);
  const masterRekapRows: (string | number)[][] = [
    [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • KKTP: 75 • Total: ${unified.length} Siswa • Terakhir Disinkron: ${now}`],
    [""],
    REKAP_PAI_HEADERS
  ];
  unified.forEach((r, idx) => masterRekapRows.push(formatRekapRow(r, idx)));
  if (unified.length > 0) {
    masterRekapRows.push([]);
    masterRekapRows.push(formatRekapSummaryRow(unified, "Semua Kelas"));
  }

  // 4. Paralel
  const paralelRows: (string | number)[][] = [
    [`BUKU REKAPITULASI PENILAIAN SEMESTER PARALEL - ${schoolName.toUpperCase()}`],
    [`Tahun Ajaran 2025/2026 • Kurikulum Merdeka • Total: ${nilaiParalel.length} Data Penilaian • Tanggal: ${now}`],
    [""],
    [
      "No", "NISN", "Nama Lengkap Siswa", "Kelas Paralel", "Semester", "Mata Pelajaran",
      "UH 1", "UH 2", "UH 3", "UH 4", "UH 5", "UH 6", "UH 7", "UH 8", "UH 9", "UH 10",
      "T 1", "T 2", "T 3", "T 4", "T 5", "Rerata Formatif", "PTS", "PAS", "Nilai Akhir (NA)", "KKM", "Status"
    ]
  ];
  nilaiParalel.filter((r) => !r.isDeleted).forEach((r, idx) => {
    const safeUh = Array(10).fill(0).map((_, i) => (typeof r.uhList?.[i] === "number" ? r.uhList[i] : 0));
    const safeT = Array(5).fill(0).map((_, i) => (typeof r.tList?.[i] === "number" ? r.tList[i] : 0));
    const allFormatif = [...safeUh, ...safeT].filter((v) => v > 0);
    const rerataFormatif = allFormatif.length > 0 ? Math.round(allFormatif.reduce((a, b) => a + b, 0) / allFormatif.length) : 0;
    const na = Math.round(rerataFormatif * 0.4 + r.pts * 0.3 + r.pas * 0.3);
    paralelRows.push([
      idx + 1, r.siswaNisn, r.siswaNama, r.kelasParalel, `Semester ${r.semester}`, r.mapel,
      ...safeUh, ...safeT, rerataFormatif, r.pts, r.pas, na, r.kkm || 75, na >= (r.kkm || 75) ? "Tuntas" : "Remedial"
    ]);
  });

  // 5. Jurnal
  const jurnalRows = formatJurnalMengajarSheetRows(jurnalMengajar, schoolName);
  const ibadahRows = formatJurnalIbadahSheetRows(jurnalIbadah, students, schoolName);

  // Sync to sheets with fallback
  await updateSpreadsheetValues(spreadsheetId, "'Ringkasan Database'!A1", summaryRows)
    .catch(() => updateSpreadsheetValues(spreadsheetId, "Sheet1!A1", summaryRows))
    .then(() => updatedSheets.push("Ringkasan Database"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Data Sekolah'!A1", sekolahRows)
    .then(() => updatedSheets.push("Data Sekolah"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Data Guru'!A1", guruRows)
    .then(() => updatedSheets.push("Data Guru"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Data Kelas'!A1", kelasRows)
    .then(() => updatedSheets.push("Data Kelas"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Data Siswa'!A1", siswaRows)
    .then(() => updatedSheets.push("Data Siswa"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Master Rekap PAI'!A1", masterRekapRows)
    .then(() => updatedSheets.push("Master Rekap PAI"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Nilai Semester Paralel'!A1", paralelRows)
    .then(() => updatedSheets.push("Nilai Semester Paralel"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Jurnal Mengajar'!A1", jurnalRows)
    .then(() => updatedSheets.push("Jurnal Mengajar"))
    .catch(() => {});

  await updateSpreadsheetValues(spreadsheetId, "'Jurnal Ibadah'!A1", ibadahRows)
    .then(() => updatedSheets.push("Jurnal Ibadah"))
    .catch(() => {});

  const totalRows =
    summaryRows.length +
    sekolahRows.length +
    guruRows.length +
    kelasRows.length +
    siswaRows.length +
    masterRekapRows.length +
    paralelRows.length +
    jurnalRows.length +
    ibadahRows.length;

  return {
    timestamp: new Date().toLocaleTimeString("id-ID"),
    totalRows,
    updatedSheets
  };
};

