/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken } from "./googleAuth";
import { Siswa, Kelas, RekapNilaiTotal, JurnalMengajar, JurnalIbadahHarian, UserAccount } from "../types";

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
  owners?: { displayName?: string; emailAddress?: string }[];
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
  rows: (string | number)[][];
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
  if (!token) {
    throw new Error(
      "Akses Google belum terhubung. Silakan klik 'Masuk dengan Akun Google' untuk melanjutkan."
    );
  }
  return token;
};

/**
 * Lists spreadsheets from user's Google Drive
 */
export const listDriveSpreadsheets = async (): Promise<GoogleDriveFile[]> => {
  const token = await requireToken();

  try {
    // 1. Primary: Use backend proxy to avoid browser iframe CORS and network errors
    const res = await fetch("/api/google/drive/files", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.warning) {
        console.warn("Drive files warning:", data.warning);
      }
      return data.files || [];
    }
  } catch (proxyErr) {
    console.warn("Drive proxy attempt failed, trying direct client fetch:", proxyErr);
  }

  // 2. Fallback: Direct Google Drive API fetch with error softening
  try {
    const query = encodeURIComponent(
      "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"
    );
    const fields = encodeURIComponent("files(id,name,modifiedTime,webViewLink,owners)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=30`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("Drive API returned status:", res.status, err);
      return [];
    }

    const data = await res.json();
    return data.files || [];
  } catch (err: any) {
    console.warn("Direct Drive API fetch failed:", err);
    return [];
  }
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

  // Multi-sheet grouped by existing classes
  const sheets: ExportSheetPayload[] = [];

  // Tab 1: Master List (All Students)
  const masterRows: (string | number)[][] = [
    [`DAFTAR PESERTA DIDIK (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Aplikasi Pembelajaran PAI & Budi Pekerti (PAILMS) • Total: ${students.length} Siswa • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedStudents = [...students].sort((a, b) => {
    if (a.kelasId !== b.kelasId) return a.kelasId.localeCompare(b.kelasId);
    return a.nama.localeCompare(b.nama);
  });

  sortedStudents.forEach((s, idx) => masterRows.push(getStudentRow(s, idx)));
  sheets.push({ title: "Semua Siswa", rows: masterRows });

  // Separate sheet per existing class
  const definedClassIds = classes?.map((c) => c.id) || [];
  const studentClassIds = students.map((s) => s.kelasId);
  const allClasses = Array.from(new Set([...definedClassIds, ...studentClassIds].filter(Boolean))).sort();

  allClasses.forEach((cId) => {
    const classStudents = students.filter((s) => s.kelasId === cId);
    if (classStudents.length === 0) return;

    const wali = classes?.find((c) => c.id === cId)?.waliKelasNama;
    const classRows: (string | number)[][] = [
      [`DAFTAR PESERTA DIDIK KELAS ${cId} - ${schoolName.toUpperCase()}`],
      [`Wali Kelas: ${wali || "-"} • Rombel: ${cId} • Total: ${classStudents.length} Siswa • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classStudents.forEach((s, idx) => classRows.push(getStudentRow(s, idx)));
    sheets.push({
      title: cleanSheetTab(`Kelas ${cId}`),
      rows: classRows
    });
  });

  const rombelCount = sheets.length - 1;
  const title = `PAILMS - Data Peserta Didik Per Kelas (${students.length} Siswa, ${rombelCount} Rombel) - ${new Date().toISOString().slice(0, 10)}`;
  return await createMultiSheetGoogleSpreadsheet(title, sheets);
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

  const cleanSheetTab = (tabName: string) => tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

  const studentMap = new Map<string, Siswa>();
  students.forEach((s) => studentMap.set(s.nisn, s));

  const headers = [
    "No",
    "NISN",
    "Nama Lengkap",
    "Kelas",
    "Formatif Kuis",
    "Formatif Tugas",
    "Formatif Diskusi",
    "Rata-rata Formatif",
    "Sumatif PTS",
    "Sumatif PAS",
    "Hafalan Juz Amma",
    "Praktik Sholat",
    "Praktik Wudhu",
    "Nilai Akhir (NA)",
    "Predikat",
    "Keterangan"
  ];

  const getRekapRow = (r: RekapNilaiTotal, idx: number) => {
    const s = studentMap.get(r.siswaNisn);
    const avgFormatif = Math.round((r.formatifKuis + r.formatifTugas + r.formatifDiskusi) / 3);
    const na = Math.round(avgFormatif * 0.4 + r.sumatifPts * 0.3 + r.sumatifPas * 0.3);
    const predikat = na >= 88 ? "A (Sangat Baik)" : na >= 75 ? "B (Baik)" : na >= 65 ? "C (Cukup)" : "D (Perlu Bimbingan)";
    const ket = na >= 75 ? "Tuntas (Melampaui KKTP)" : "Remedial";

    return [
      idx + 1,
      r.siswaNisn,
      r.siswaNama || s?.nama || "Siswa",
      r.kelasId || s?.kelasId || "-",
      r.formatifKuis,
      r.formatifTugas,
      r.formatifDiskusi,
      avgFormatif,
      r.sumatifPts,
      r.sumatifPas,
      r.hafalanJuzAmmaScore || 90,
      r.praktikSholat || 90,
      r.praktikWudhu || 90,
      na,
      predikat,
      ket
    ];
  };

  const getSummaryRow = (items: RekapNilaiTotal[], labelKelas: string) => {
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
      sumHafalan += r.hafalanJuzAmmaScore || 90;
      sumSholat += r.praktikSholat || 90;
      sumWudhu += r.praktikWudhu || 90;
      sumNa += na;
      if (na >= 75) tuntasCount++;
    });

    const len = items.length;
    const avgF = Math.round((sumKuis + sumTugas + sumDiskusi) / (3 * len));
    const avgNa = Math.round(sumNa / len);

    return [
      "",
      "",
      "RATA-RATA KELAS",
      labelKelas,
      Math.round(sumKuis / len),
      Math.round(sumTugas / len),
      Math.round(sumDiskusi / len),
      avgF,
      Math.round(sumPts / len),
      Math.round(sumPas / len),
      Math.round(sumHafalan / len),
      Math.round(sumSholat / len),
      Math.round(sumWudhu / len),
      avgNa,
      "-",
      `Tuntas: ${tuntasCount} / Remedial: ${len - tuntasCount}`
    ];
  };

  // Specific single class export
  if (targetKelasId && targetKelasId !== "ALL") {
    const classRekap = rekapList.filter(
      (r) => (r.kelasId || studentMap.get(r.siswaNisn)?.kelasId) === targetKelasId
    );
    const wali = classes?.find((c) => c.id === targetKelasId)?.waliKelasNama;

    const rows: (string | number)[][] = [
      [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM - KELAS ${targetKelasId}`],
      [`${schoolName.toUpperCase()} • Wali Kelas: ${wali || "-"} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Diekspor: ${now}`],
      [""],
      headers
    ];

    classRekap.forEach((r, idx) => rows.push(getRekapRow(r, idx)));
    if (classRekap.length > 0) {
      rows.push([]);
      rows.push(getSummaryRow(classRekap, targetKelasId));
    }

    const title = `PAILMS - Rekap Nilai PAI Kelas ${targetKelasId} (${classRekap.length} Siswa) - ${new Date().toISOString().slice(0, 10)}`;
    return await createGoogleSpreadsheet(title, `Nilai ${targetKelasId}`, rows);
  }

  // Multi-sheet grouped by existing classes
  const sheets: ExportSheetPayload[] = [];

  // Tab 1: Master Recap (All Students)
  const masterRows: (string | number)[][] = [
    [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Semester Ganjil / Genap • KKTP: 75 • Sumber Data: PAILMS • Total: ${rekapList.length} Siswa • Diekspor: ${now}`],
    [""],
    headers
  ];

  const sortedRekap = [...rekapList].sort((a, b) => {
    const kA = a.kelasId || studentMap.get(a.siswaNisn)?.kelasId || "";
    const kB = b.kelasId || studentMap.get(b.siswaNisn)?.kelasId || "";
    if (kA !== kB) return kA.localeCompare(kB);
    const nA = a.siswaNama || studentMap.get(a.siswaNisn)?.nama || "";
    const nB = b.siswaNama || studentMap.get(b.siswaNisn)?.nama || "";
    return nA.localeCompare(nB);
  });

  sortedRekap.forEach((r, idx) => masterRows.push(getRekapRow(r, idx)));
  if (rekapList.length > 0) {
    masterRows.push([]);
    masterRows.push(getSummaryRow(rekapList, "Semua Kelas"));
  }
  sheets.push({ title: "Rekap Nilai Semua", rows: masterRows });

  // Separate sheets for each class
  const classIds = Array.from(
    new Set([
      ...(classes?.map((c) => c.id) || []),
      ...rekapList.map((r) => r.kelasId || studentMap.get(r.siswaNisn)?.kelasId)
    ].filter(Boolean))
  ).sort();

  classIds.forEach((cId) => {
    const classRekap = rekapList.filter(
      (r) => (r.kelasId || studentMap.get(r.siswaNisn)?.kelasId) === cId
    );
    if (classRekap.length === 0) return;

    const wali = classes?.find((c) => c.id === cId)?.waliKelasNama;
    const classRows: (string | number)[][] = [
      [`BUKU REKAPITULASI NILAI PAI KELAS ${cId} - ${schoolName.toUpperCase()}`],
      [`Wali Kelas: ${wali || "-"} • Rombel: ${cId} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Diekspor: ${now}`],
      [""],
      headers
    ];

    classRekap.forEach((r, idx) => classRows.push(getRekapRow(r, idx)));
    classRows.push([]);
    classRows.push(getSummaryRow(classRekap, cId));

    sheets.push({
      title: cleanSheetTab(`Nilai ${cId}`),
      rows: classRows
    });
  });

  const rombelCount = sheets.length - 1;
  const title = `PAILMS - Rekap Nilai PAI Per Kelas (${rekapList.length} Siswa, ${rombelCount} Rombel) - ${new Date().toISOString().slice(0, 10)}`;
  return await createMultiSheetGoogleSpreadsheet(title, sheets);
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
    "Materi Pokok / Pembahasan",
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

  // Multi-sheet grouped by existing classes
  const sheets: ExportSheetPayload[] = [];

  // Tab 1: All entries
  const masterRows: (string | number)[][] = [
    [`JURNAL AGENDA HARIAN MENGAJAR GURU PAI (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${jurnalList.length} Catatan Mengajar • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedJurnal = [...jurnalList].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  sortedJurnal.forEach((j, idx) => masterRows.push(getJurnalRow(j, idx)));
  sheets.push({ title: "Semua Jurnal", rows: masterRows });

  // Separate sheets for each class
  const classIds = Array.from(
    new Set([
      ...(classes?.map((c) => c.id) || []),
      ...jurnalList.map((j) => j.kelasId)
    ].filter(Boolean))
  ).sort();

  classIds.forEach((cId) => {
    const classJurnal = jurnalList.filter((j) => j.kelasId === cId);
    if (classJurnal.length === 0) return;

    const classRows: (string | number)[][] = [
      [`JURNAL AGENDA HARIAN MENGAJAR GURU PAI - KELAS ${cId}`],
      [`${schoolName.toUpperCase()} • Rombel: ${cId} • Total: ${classJurnal.length} Tatap Muka • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classJurnal.forEach((j, idx) => classRows.push(getJurnalRow(j, idx)));
    sheets.push({
      title: cleanSheetTab(`Jurnal ${cId}`),
      rows: classRows
    });
  });

  const rombelCount = sheets.length - 1;
  const title = `PAILMS - Jurnal Mengajar Per Kelas (${jurnalList.length} Pertemuan, ${rombelCount} Rombel) - ${new Date().toISOString().slice(0, 10)}`;
  return await createMultiSheetGoogleSpreadsheet(title, sheets);
};

/**
 * EXPORT 4: Worship Journal (Jurnal Ibadah Harian Siswa) to Google Sheets (Grouped by Class)
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

  const cleanSheetTab = (tabName: string) => tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

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

  // Multi-sheet grouped by existing classes
  const sheets: ExportSheetPayload[] = [];

  // Tab 1: All worship entries
  const masterRows: (string | number)[][] = [
    [`JURNAL IBADAH MANDIRI PESERTA DIDIK (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
    [`Aplikasi PAILMS • Total: ${worships.length} Catatan Ibadah • Diekspor pada: ${now}`],
    [""],
    headers
  ];

  const sortedWorships = [...worships].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  sortedWorships.forEach((w, idx) => masterRows.push(getWorshipRow(w, idx)));
  sheets.push({ title: "Semua Ibadah", rows: masterRows });

  // Separate sheets for each class
  const classIds = Array.from(
    new Set([
      ...(classes?.map((c) => c.id) || []),
      ...students.map((s) => s.kelasId)
    ].filter(Boolean))
  ).sort();

  classIds.forEach((cId) => {
    const classWorships = worships.filter(
      (w) => (studentMap.get(w.siswaNisn)?.kelasId || "") === cId
    );
    if (classWorships.length === 0) return;

    const classRows: (string | number)[][] = [
      [`REKAPITULASI JURNAL IBADAH PESERTA DIDIK KELAS ${cId} - ${schoolName.toUpperCase()}`],
      [`Rombel: ${cId} • Total: ${classWorships.length} Catatan Ibadah • Diekspor pada: ${now}`],
      [""],
      headers
    ];

    classWorships.forEach((w, idx) => classRows.push(getWorshipRow(w, idx)));
    sheets.push({
      title: cleanSheetTab(`Ibadah ${cId}`),
      rows: classRows
    });
  });

  const rombelCount = sheets.length - 1;
  const title = `PAILMS - Rekap Jurnal Ibadah Siswa Per Kelas (${worships.length} Catatan, ${rombelCount} Rombel) - ${new Date().toISOString().slice(0, 10)}`;
  return await createMultiSheetGoogleSpreadsheet(title, sheets);
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
