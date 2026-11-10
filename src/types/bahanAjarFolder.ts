/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileKategoriType = "word" | "excel" | "video" | "pdf" | "audio" | "lainnya";

export interface BahanAjarFolderItem {
  id: string;
  nama: string;
  deskripsi: string;
  warna: "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo" | "teal";
  iconName?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface BahanAjarFileItem {
  id: string;
  folderId: string;
  nama: string;
  kategori: FileKategoriType;
  ekstensi: string; // e.g. "docx", "xlsx", "mp4", "pdf", "mp3"
  ukuran: string; // e.g. "1.5 MB"
  tanggalUpload: string;
  deskripsi: string;
  fileDataUrl?: string; // Base64 data URL
  videoUrl?: string; // YouTube, Google Drive, or MP4 URL for in-app Play & Stop
  textContent?: string; // Rich text / document excerpt for Word/PDF viewer
  tableData?: {
    sheetName?: string;
    headers: string[];
    rows: (string | number)[][];
  }; // Spreadsheet preview data for Excel
  mimeType?: string;
  durasi?: string; // For video/audio (e.g. "09:30")
  isFavorite?: boolean;
  tags?: string[];
}
