/**
 * File Storage & Document Processing Engine
 * Handles IndexedDB persistence, file parsing (DOCX, XLSX, PDF, TXT),
 * and clean A4 document printing.
 */

import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { PerangkatAjar } from "../types";

const DB_NAME = "PAILMS_FILE_STORAGE_DB";
const STORE_NAME = "perangkat_files";
const DB_VERSION = 1;

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

// Save file payload to IndexedDB
export async function saveFileToIndexedDB(id: string, fileData: {
  dataUrl?: string;
  textContent?: string;
  parsedSheets?: { name: string; data: string[][] }[];
  fileName?: string;
  mimeType?: string;
}): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const record = {
        id,
        ...fileData,
        updatedAt: new Date().toISOString()
      };
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB save failed, continuing with in-memory state:", err);
  }
}

// Retrieve file payload from IndexedDB
export async function getFileFromIndexedDB(id: string): Promise<{
  dataUrl?: string;
  textContent?: string;
  parsedSheets?: { name: string; data: string[][] }[];
  fileName?: string;
  mimeType?: string;
} | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB get failed:", err);
    return null;
  }
}

// Delete file payload from IndexedDB
export async function deleteFileFromIndexedDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB delete failed:", err);
  }
}

// Convert Base64 data URL to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Parse Word DOCX into clean formatted HTML using mammoth with style map
export async function parseDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const options = {
      styleMap: [
        "p[style-name='Title'] => h1.doc-title:fresh",
        "p[style-name='Subtitle'] => h2.doc-subtitle:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "table => table.table-bordered:fresh"
      ],
      includeDefaultStyleMap: true
    };
    const result = await mammoth.convertToHtml({ arrayBuffer }, options);
    return result.value || "";
  } catch (err) {
    console.error("Gagal mengurai file DOCX:", err);
    return "";
  }
}

// Parse Excel / Spreadsheet into sheets and table rows preserving exact cell merges & HTML structure
export function parseExcel(data: ArrayBuffer | Uint8Array): {
  name: string;
  data: string[][];
  html?: string;
  colCount?: number;
  rowCount?: number;
}[] {
  try {
    const workbook = XLSX.read(data, { type: "array", cellDates: true, cellStyles: true });
    const sheets: {
      name: string;
      data: string[][];
      html?: string;
      colCount?: number;
      rowCount?: number;
    }[] = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      // Extract raw HTML from SheetJS with all cell merges and spans preserved
      let sheetHtml = "";
      try {
        const fullHtml = XLSX.utils.sheet_to_html(worksheet, { id: `sheet-${sheetName}`, editable: false });
        const match = fullHtml.match(/<table[\s\S]*?<\/table>/i);
        if (match) {
          // Inject table class for uniform high-fidelity rendering
          sheetHtml = match[0].replace("<table", `<table class="excel-parsed-table"`);
        }
      } catch (e) {
        console.warn("sheet_to_html error:", e);
      }

      // Calculate column and row counts from worksheet range
      let colCount = 1;
      let rowCount = 1;
      if (worksheet["!ref"]) {
        try {
          const range = XLSX.utils.decode_range(worksheet["!ref"]);
          colCount = Math.max(range.e.c - range.s.c + 1, 1);
          rowCount = Math.max(range.e.r - range.s.r + 1, 1);
        } catch {
          // ignore
        }
      }

      // Convert to 2D array of string values for formula/cell data fallback
      const jsonRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, raw: false, defval: "" });
      const stringRows: string[][] = (jsonRows || []).map((row) =>
        Array.isArray(row) ? row.map((cell) => (cell !== null && cell !== undefined ? String(cell) : "")) : []
      );

      // If colCount not found from ref, deduce from row lengths
      if (colCount <= 1 && stringRows.length > 0) {
        colCount = Math.max(...stringRows.map((r) => r.length), 1);
      }
      if (rowCount <= 1) {
        rowCount = stringRows.length;
      }

      sheets.push({
        name: sheetName,
        data: stringRows,
        html: sheetHtml,
        colCount,
        rowCount
      });
    }
    return sheets;
  } catch (err) {
    console.error("Gagal mengurai file Excel:", err);
    return [];
  }
}

// Convert File to Base64 Data URL
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Convert File to ArrayBuffer
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Read Text File
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

export interface PrintOptions {
  orientation?: "portrait" | "landscape" | "auto";
  activeSheetIndex?: number;
  customHtml?: string;
  includeKop?: boolean;
}

// High-Fidelity Clean A4 Document Printing with Auto Scaling
export function printPerangkatDocument(doc: PerangkatAjar, options?: PrintOptions) {
  // Remove existing print frame if any
  const oldFrame = document.getElementById("document-print-frame");
  if (oldFrame && oldFrame.parentNode) {
    oldFrame.parentNode.removeChild(oldFrame);
  }

  const printFrame = document.createElement("iframe");
  printFrame.style.position = "fixed";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  printFrame.style.width = "1px";
  printFrame.style.height = "1px";
  printFrame.style.opacity = "0.01";
  printFrame.style.border = "0";
  printFrame.style.pointerEvents = "none";
  printFrame.setAttribute("id", "document-print-frame");
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
  if (!frameDoc) {
    window.print();
    return;
  }

  // Determine active sheet and column count for Excel documents
  const activeSheetIndex = options?.activeSheetIndex ?? 0;
  const activeSheet = doc.parsedSheets?.[activeSheetIndex] || doc.parsedSheets?.[0];
  const colCount = activeSheet?.colCount || (activeSheet?.data?.[0]?.length ?? 6);

  // Determine page orientation
  let isLandscape = false;
  if (options?.orientation === "landscape") {
    isLandscape = true;
  } else if (options?.orientation === "portrait") {
    isLandscape = false;
  } else {
    // Auto-detect: if Excel sheet with more than 6 columns, default to Landscape to fit A4 without cutoff
    if (doc.parsedSheets && doc.parsedSheets.length > 0 && colCount > 6) {
      isLandscape = true;
    } else {
      isLandscape = false;
    }
  }

  // Dynamic table font size & padding based on column density
  let tableFontSize = "9pt";
  let cellPadding = "5px 7px";
  if (colCount >= 14) {
    tableFontSize = "6.5pt";
    cellPadding = "2px 3px";
  } else if (colCount >= 10) {
    tableFontSize = "7.5pt";
    cellPadding = "3px 5px";
  } else if (colCount >= 7) {
    tableFontSize = "8.5pt";
    cellPadding = "4px 6px";
  }

  // Construct printable body content
  let bodyHtml = "";

  if (options?.customHtml) {
    bodyHtml = `<div class="content-body docx-parsed-body">${options.customHtml}</div>`;
  } else if (doc.parsedSheets && doc.parsedSheets.length > 0) {
    // Render Excel sheets
    const sheetsToRender =
      options?.activeSheetIndex !== undefined && doc.parsedSheets[options.activeSheetIndex]
        ? [doc.parsedSheets[options.activeSheetIndex]]
        : doc.parsedSheets;

    bodyHtml = sheetsToRender
      .map(
        (sheet, idx) => `
        <div class="sheet-container" style="${idx > 0 ? "page-break-before: always;" : ""} margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 11pt; font-weight: bold; margin: 0; color: #166534;">
              📊 Lembar Kerja: ${sheet.name}
            </h3>
            <span style="font-size: 8.5pt; color: #64748b; font-weight: 600;">
              ${sheet.colCount || (sheet.data?.[0]?.length ?? "-")} Kolom • ${sheet.rowCount || sheet.data.length} Baris
            </span>
          </div>

          ${
            sheet.html
              ? sheet.html
              : `<table class="excel-parsed-table">
                  <tbody>
                    ${sheet.data
                      .map((row, rIdx) => {
                        const isHeader = rIdx === 0;
                        return `<tr>${row
                          .map((cell) =>
                            isHeader
                              ? `<th style="background:#f1f5f9; font-weight:bold;">${cell || ""}</th>`
                              : `<td>${cell || ""}</td>`
                          )
                          .join("")}</tr>`;
                      })
                      .join("")}
                  </tbody>
                </table>`
          }
        </div>
      `
      )
      .join("");
  } else if (doc.textContent) {
    bodyHtml = `<div class="content-body docx-parsed-body">${doc.textContent}</div>`;
  } else if (doc.fileData && doc.fileData.startsWith("data:image/")) {
    bodyHtml = `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${doc.fileData}" style="max-width: 100%; max-height: 800px; border: 1px solid #e2e8f0; border-radius: 8px;" alt="${doc.judul}" />
      </div>
      <p style="text-align: center; font-size: 10pt; color: #64748b;">${doc.deskripsi || ""}</p>
    `;
  } else {
    // Default structured document layout
    bodyHtml = `
      <div class="content-body">
        <h3 style="font-size: 12pt; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">
          I. DESKRIPSI &amp; CAPAIAN PEMBELAJARAN
        </h3>
        <p style="margin-bottom: 16px; line-height: 1.6;">
          ${
            doc.deskripsi ||
            "Dokumen Perangkat Ajar resmi mata pelajaran Pendidikan Agama Islam dan Budi Pekerti Kurikulum Merdeka UPT SMPN 2 Rebang Tangkas. Memuat capaian pembelajaran, alur tujuan pembelajaran, dan instrumen asesmen terpadu."
          }
        </p>

        <h3 style="font-size: 12pt; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">
          II. LINGKUP MATERI &amp; TUJUAN PEMBELAJARAN
        </h3>
        <ul style="margin-left: 20px; margin-bottom: 16px; line-height: 1.6;">
          <li>Memahami konsep materi pada <strong>${doc.bab}</strong> secara komprehensif.</li>
          <li>Menginternalisasikan nilai-nilai keimanan, ketakwaan, dan akhlak mulia dalam kehidupan sehari-hari.</li>
          <li>Mampu menyelesaikan lembar asesmen formatif dan sumatif dengan kriteria KKTP yang ditetapkan.</li>
        </ul>

        <h3 style="font-size: 12pt; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">
          III. INFORMASI BERKAS DIGITAL
        </h3>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 30%; background: #f8fafc; font-weight: bold;">Nama File</td>
            <td>${doc.fileName || doc.judul}</td>
          </tr>
          <tr>
            <td style="background: #f8fafc; font-weight: bold;">Tipe Media</td>
            <td>${doc.mediaType || "Dokumen"}</td>
          </tr>
          <tr>
            <td style="background: #f8fafc; font-weight: bold;">Ukuran Berkas</td>
            <td>${doc.fileSize}</td>
          </tr>
          <tr>
            <td style="background: #f8fafc; font-weight: bold;">Status Berkas</td>
            <td style="color: #166534; font-weight: bold;">Tersimpan Permanen di Sistem</td>
          </tr>
        </table>
      </div>
    `;
  }

  const includeKop = options?.includeKop !== false;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <title>Cetak Perangkat Ajar - ${doc.judul}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: ${isLandscape ? "A4 landscape" : "A4 portrait"};
            margin: ${isLandscape ? "10mm 10mm 10mm 10mm" : "12mm 12mm 12mm 12mm"};
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 10pt;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .kop-surat {
            border-bottom: 2.5px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 14px;
            text-align: center;
          }
          .kop-surat h4 {
            margin: 0 0 2px 0;
            font-size: 9pt;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            color: #475569;
            font-weight: 700;
          }
          .kop-surat h2 {
            margin: 0 0 3px 0;
            font-size: 13pt;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            font-weight: 900;
            color: #0f172a;
          }
          .kop-surat p {
            margin: 0;
            font-size: 8pt;
            color: #64748b;
          }
          .meta-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 16px;
            font-size: 9pt;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: ${isLandscape ? "1fr 1fr 1fr" : "1fr 1fr"};
            gap: 6px;
          }
          .meta-item strong {
            color: #334155;
          }
          table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: auto !important;
            border-collapse: collapse !important;
            margin: 8px 0 16px 0 !important;
            font-size: ${tableFontSize} !important;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #334155 !important;
            padding: ${cellPadding} !important;
            text-align: left;
            vertical-align: middle;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          th, tr:first-child td, tr:first-child th {
            background-color: #f1f5f9 !important;
            font-weight: 800 !important;
            color: #0f172a !important;
          }
          .excel-parsed-table {
            width: 100% !important;
            max-width: 100% !important;
          }
          .excel-parsed-table td {
            white-space: pre-wrap;
          }
          .content-body {
            margin-bottom: 20px;
          }
          .content-body p {
            margin-bottom: 8px;
            text-align: justify;
          }
          .content-body ul, .content-body ol {
            margin-top: 4px;
            margin-bottom: 10px;
          }
          .docx-parsed-body table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 10px 0 !important;
          }
          .docx-parsed-body th, .docx-parsed-body td {
            border: 1px solid #475569 !important;
            padding: 5px 8px !important;
          }
          .signature-section {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px dashed #cbd5e1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
            font-size: 9pt;
            page-break-inside: avoid;
          }
          .signature-space {
            height: 52px;
          }
          .signature-name {
            font-weight: 900;
            text-decoration: underline;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${
          includeKop
            ? `
          <div class="kop-surat">
            <h4>Pemerintah Kabupaten Way Kanan • Dinas Pendidikan dan Kebudayaan</h4>
            <h2>UPT SMP NEGERI 2 REBANG TANGKAS</h2>
            <p>Jl. Lintas Rebang Tangkas, Way Kanan, Lampung • NPSN: 10806899 • Akreditasi: B</p>
            <p style="font-weight: bold; margin-top: 3px; color: #1e293b; font-size: 8.5pt;">
              PERANGKAT AJAR PENDIDIKAN AGAMA ISLAM &amp; BUDI PEKERTI (KURIKULUM MERDEKA)
            </p>
          </div>

          <div class="meta-box">
            <div class="meta-grid">
              <div class="meta-item"><strong>Judul Berkas:</strong> ${doc.judul}</div>
              <div class="meta-item"><strong>Kategori:</strong> ${doc.kategori}</div>
              <div class="meta-item"><strong>Lingkup Materi:</strong> ${doc.bab}</div>
              <div class="meta-item"><strong>Tingkat / Kelas:</strong> ${doc.kelas || "Kelas VII"} (Semester ${doc.semester || "1"})</div>
              <div class="meta-item"><strong>Format Kertas:</strong> A4 ${isLandscape ? "Lanskap (Mendatar)" : "Potret (Tegak)"}</div>
              <div class="meta-item"><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}</div>
            </div>
          </div>
        `
            : ""
        }

        ${bodyHtml}

        ${
          includeKop
            ? `
          <div class="signature-section">
            <div>
              <p style="margin: 0;">Mengetahui,</p>
              <p style="margin: 2px 0; font-weight: bold;">Kepala UPT SMPN 2 Rebang Tangkas</p>
              <div class="signature-space"></div>
              <p class="signature-name">Drs. H. M. YUSUF, M.Pd.</p>
              <p style="margin: 0; font-size: 8pt; color: #64748b;">NIP. 19680312 199403 1 004</p>
            </div>
            <div>
              <p style="margin: 0;">Rebang Tangkas, ${new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}</p>
              <p style="margin: 2px 0; font-weight: bold;">Guru Pengampu PAI &amp; Budi Pekerti</p>
              <div class="signature-space"></div>
              <p class="signature-name">SADIQUL ALIM, S.Pd.I., M.Pd.</p>
              <p style="margin: 0; font-size: 8pt; color: #64748b;">NIP. 19790917 201407 1 004</p>
            </div>
          </div>
        `
            : ""
        }
      </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (e) {
      console.error("Print frame error:", e);
      window.print();
    }
    setTimeout(() => {
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
    }, 2000);
  }, 400);
}
