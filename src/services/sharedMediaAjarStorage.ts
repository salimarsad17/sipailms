/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "../lib/supabase";

export type SharedMediaType = "lms" | "game" | "video";

export interface SharedMediaSoalItem {
  id: string;
  tipe: "pilihan_ganda" | "essay";
  pertanyaan: string;
  pilihan?: string[];
  kunci?: number;
  kunciEssay?: string;
  pembahasan?: string;
  bobotNilai?: number;
}

export interface SharedMediaVideoData {
  durasi: string;
  dalil: string;
  terjemahan: string;
  naskah: string;
  videoUrl: string;
}

export interface SharedMediaAjarItem {
  id: string;
  sourceId: string;
  type: SharedMediaType;
  judul: string;
  materi: string;
  deskripsi: string;
  kelasTarget: "SEMUA" | "7" | "8" | "9";
  rombelTarget?: string; // e.g., "SEMUA" or "VII-A"
  semester?: "1" | "2";
  deadline?: string;
  instruksiGuru?: string;
  guruNama: string;
  sharedAt: string;
  modeMain: "play_game" | "kerjakan_soal" | "tonton_video";
  gamePin?: string;
  shuffleQuestions?: boolean;
  showExplanations?: boolean;
  attemptsLimit?: string;
  videoData?: SharedMediaVideoData;
  soalList?: SharedMediaSoalItem[];
}

export interface SharedMediaSubmission {
  id: string;
  sharedMediaId: string;
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  type: SharedMediaType;
  scorePG: number;
  correctCount: number;
  totalPG: number;
  essayAnswers?: Record<string, string>;
  pgAnswers?: Record<string, number>;
  watchedVideo?: boolean;
  catatanSiswa?: string;
  submittedAt: string;
  status: "Selesai" | "Menunggu Penilaian Essay";
  nilaiAkhirGuru?: number;
  komentarGuru?: string;
}

const STORAGE_KEY_SHARED_MEDIA = "pai_lms_shared_media_ajar_v1";
const STORAGE_KEY_SHARED_SUBMISSIONS = "pai_lms_shared_media_submissions_v1";
export const SHARED_MEDIA_UPDATED_EVENT = "sipailms_shared_media_updated";

function dispatchUpdateEvent() {
  try {
    window.dispatchEvent(new CustomEvent(SHARED_MEDIA_UPDATED_EVENT));
  } catch {
    // ignore
  }
}

async function syncToSupabase(key: string, value: unknown) {
  try {
    await supabase.from("app_store").upsert(
      [{ key, value, updated_at: new Date().toISOString() }],
      { onConflict: "key" }
    );
  } catch {
    // Supabase optional fallback
  }
}

export const SharedMediaAjarStorage = {
  getSharedItems(): SharedMediaAjarItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SHARED_MEDIA);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed reading shared media ajar:", e);
    }
    return [];
  },

  saveSharedItems(items: SharedMediaAjarItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SHARED_MEDIA, JSON.stringify(items));
      dispatchUpdateEvent();
      syncToSupabase("shared_media_ajar", items).catch(() => {});
    } catch (e) {
      console.error("Failed saving shared media ajar:", e);
    }
  },

  shareItem(newItem: SharedMediaAjarItem): SharedMediaAjarItem[] {
    const current = this.getSharedItems();
    // Replace if same sourceId + type + kelasTarget + rombelTarget already exists, else prepend
    const idx = current.findIndex(
      (i) =>
        i.sourceId === newItem.sourceId &&
        i.type === newItem.type &&
        i.kelasTarget === newItem.kelasTarget &&
        (i.rombelTarget || "SEMUA") === (newItem.rombelTarget || "SEMUA")
    );
    let updated: SharedMediaAjarItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...newItem, id: current[idx].id };
    } else {
      updated = [newItem, ...current];
    }
    this.saveSharedItems(updated);
    return updated;
  },

  unshareItem(id: string): SharedMediaAjarItem[] {
    const current = this.getSharedItems();
    const updated = current.filter((i) => i.id !== id);
    this.saveSharedItems(updated);
    return updated;
  },

  getItemsForStudent(studentKelasId: string): SharedMediaAjarItem[] {
    const all = this.getSharedItems();
    const cleanKelas = (studentKelasId || "").trim().toUpperCase();
    let studentGrade: "7" | "8" | "9" = "7";
    if (cleanKelas.includes("8") || cleanKelas.startsWith("VIII")) {
      studentGrade = "8";
    } else if (cleanKelas.includes("9") || cleanKelas.startsWith("IX")) {
      studentGrade = "9";
    } else if (cleanKelas.includes("7") || cleanKelas.startsWith("VII")) {
      studentGrade = "7";
    }

    const normalizeRombel = (val: string) =>
      val
        .trim()
        .toUpperCase()
        .replace(/^VIII/, "8")
        .replace(/^VII/, "7")
        .replace(/^IX/, "9")
        .replace(/[-_\s]/g, "");

    const normalizedStudentKelas = normalizeRombel(cleanKelas);

    return all.filter((item) => {
      const gradeMatch = item.kelasTarget === "SEMUA" || item.kelasTarget === studentGrade;
      const rombelMatch =
        !item.rombelTarget ||
        item.rombelTarget === "SEMUA" ||
        normalizeRombel(item.rombelTarget) === normalizedStudentKelas;
      return gradeMatch && rombelMatch;
    });
  },

  getSubmissions(): SharedMediaSubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SHARED_SUBMISSIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed reading shared media submissions:", e);
    }
    return [];
  },

  saveSubmissions(subs: SharedMediaSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SHARED_SUBMISSIONS, JSON.stringify(subs));
      dispatchUpdateEvent();
      syncToSupabase("shared_media_submissions", subs).catch(() => {});
    } catch (e) {
      console.error("Failed saving shared media submissions:", e);
    }
  },

  upsertSubmission(sub: SharedMediaSubmission): SharedMediaSubmission[] {
    const current = this.getSubmissions();
    const idx = current.findIndex(
      (s) => s.sharedMediaId === sub.sharedMediaId && s.siswaNisn === sub.siswaNisn
    );
    let updated: SharedMediaSubmission[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...sub, id: current[idx].id };
    } else {
      updated = [sub, ...current];
    }
    this.saveSubmissions(updated);
    return updated;
  },

  getSubmissionsForStudent(siswaNisn: string): SharedMediaSubmission[] {
    return this.getSubmissions().filter((s) => s.siswaNisn === siswaNisn);
  },

  getSubmissionsForMedia(sharedMediaId: string): SharedMediaSubmission[] {
    return this.getSubmissions().filter((s) => s.sharedMediaId === sharedMediaId);
  },

  hydrateSharedItemsFromCloud(items: SharedMediaAjarItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SHARED_MEDIA, JSON.stringify(items));
      dispatchUpdateEvent();
    } catch (e) {
      console.error("Failed hydrating shared media ajar:", e);
    }
  },

  hydrateSubmissionsFromCloud(subs: SharedMediaSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SHARED_SUBMISSIONS, JSON.stringify(subs));
      dispatchUpdateEvent();
    } catch (e) {
      console.error("Failed hydrating shared media submissions:", e);
    }
  }
};
