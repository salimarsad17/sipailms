/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BahanAjarFolderItem, BahanAjarFileItem } from "../types/bahanAjarFolder";

const STORAGE_KEY_FOLDERS = "sipai_bahan_ajar_ai_folders";
const STORAGE_KEY_FILES = "sipai_bahan_ajar_ai_files";

export const DEFAULT_FOLDERS: BahanAjarFolderItem[] = [
  {
    id: "f_word",
    nama: "Modul Ajar & RPP Digital (Word)",
    deskripsi: "Kumpulan berkas dokumen Word (.docx) modul ajar, ATP, CP, dan LKPD tertulis Kurikulum Merdeka PAI.",
    warna: "blue",
    iconName: "FileText",
    createdAt: "2026-07-15",
    isDefault: true
  },
  {
    id: "f_excel",
    nama: "Rekap Penilaian & Administrasi (Excel)",
    deskripsi: "Format lembar kerja spreadsheet Excel (.xlsx) rekap nilai sumatif, formatif, dan hafalan siswa.",
    warna: "emerald",
    iconName: "Table",
    createdAt: "2026-07-16",
    isDefault: true
  },
  {
    id: "f_video",
    nama: "Media Video Pembelajaran (Play & Stop)",
    deskripsi: "Koleksi berkas video materi pembelajaran PAI interaktif yang dapat diputar (Play) dan dihentikan (Stop) in-app.",
    warna: "rose",
    iconName: "Video",
    createdAt: "2026-07-17",
    isDefault: true
  },
  {
    id: "f_pdf",
    nama: "Buku & Bahan Bacaan Kurikulum Merdeka (PDF)",
    deskripsi: "E-book, modul referensi, buku panduan guru, dan modul P5 berformat PDF resmi Kemdikbud.",
    warna: "amber",
    iconName: "BookOpen",
    createdAt: "2026-07-18",
    isDefault: true
  },
  {
    id: "f_media",
    nama: "Media Audio Murottal & Presentasi",
    deskripsi: "Rekaman lantunan ayat suci Al-Qur'an tartil, audio doa harian, dan berkas presentasi multimedia PAI.",
    warna: "purple",
    iconName: "Music",
    createdAt: "2026-07-19",
    isDefault: true
  }
];

// All dummy files removed: starts completely clean (0 files)
export const DEFAULT_FILES: BahanAjarFileItem[] = [];

export class BahanAjarAiFolderStorage {
  // Load folders
  static getFolders(): BahanAjarFolderItem[] {
    const raw = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (!raw) {
      this.saveFolders(DEFAULT_FOLDERS);
      return DEFAULT_FOLDERS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing folders storage:", e);
    }
    this.saveFolders(DEFAULT_FOLDERS);
    return DEFAULT_FOLDERS;
  }

  // Save folders
  static saveFolders(folders: BahanAjarFolderItem[]): void {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  }

  // Add folder
  static addFolder(folder: BahanAjarFolderItem): BahanAjarFolderItem[] {
    const list = this.getFolders();
    const updated = [folder, ...list];
    this.saveFolders(updated);
    return updated;
  }

  // Delete folder
  static deleteFolder(folderId: string): BahanAjarFolderItem[] {
    const list = this.getFolders();
    const updated = list.filter((f) => f.id !== folderId);
    this.saveFolders(updated);

    const files = this.getFiles();
    const updatedFiles = files.filter((file) => file.folderId !== folderId);
    this.saveFiles(updatedFiles);

    return updated;
  }

  // Load files (empty by default)
  static getFiles(): BahanAjarFileItem[] {
    const raw = localStorage.getItem(STORAGE_KEY_FILES);
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing files storage:", e);
      }
    }
    return [];
  }

  // Save files
  static saveFiles(files: BahanAjarFileItem[]): void {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }

  // Clear all files
  static clearAllFiles(): BahanAjarFileItem[] {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify([]));
    return [];
  }

  // Add new file
  static addFile(file: BahanAjarFileItem): BahanAjarFileItem[] {
    const list = this.getFiles();
    const updated = [file, ...list];
    this.saveFiles(updated);
    return updated;
  }

  // Delete file
  static deleteFile(fileId: string): BahanAjarFileItem[] {
    const list = this.getFiles();
    const updated = list.filter((f) => f.id !== fileId);
    this.saveFiles(updated);
    return updated;
  }

  // Toggle favorite
  static toggleFavorite(fileId: string): BahanAjarFileItem[] {
    const list = this.getFiles();
    const updated = list.map((f) => (f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f));
    this.saveFiles(updated);
    return updated;
  }

  // Reset to initial clean state
  static resetToDefaults(): { folders: BahanAjarFolderItem[]; files: BahanAjarFileItem[] } {
    this.saveFolders(DEFAULT_FOLDERS);
    this.saveFiles([]);
    return { folders: DEFAULT_FOLDERS, files: [] };
  }
}
