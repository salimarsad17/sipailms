/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BahanAjarAiCompleteBundle, HasilCbtSiswa, HasilGameSiswa } from "../types/bahanAjarAiModern";
import { BahanAjarAiGeneratorEngine } from "./bahanAjarAiGeneratorEngine";

const STORAGE_KEY_BUNDLES = "bahan_ajar_ai_pai_bundles";
const STORAGE_KEY_CBT_RESULTS = "bahan_ajar_ai_pai_cbt_results";
const STORAGE_KEY_GAME_RESULTS = "bahan_ajar_ai_pai_game_results";
const STORAGE_KEY_APPS_SCRIPT_URL = "bahan_ajar_ai_pai_apps_script_url";

export class BahanAjarAiStorage {
  // 1. BUNDLES (BANK BAHAN AJAR)
  static getBundles(): BahanAjarAiCompleteBundle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BUNDLES);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal memuat bundles bahan ajar:", e);
    }
    return [];
  }

  static clearAllBundles(): BahanAjarAiCompleteBundle[] {
    try {
      localStorage.setItem(STORAGE_KEY_BUNDLES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_CBT_RESULTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_GAME_RESULTS, JSON.stringify([]));
    } catch (e) {
      console.error("Gagal mengosongkan bundle:", e);
    }
    return [];
  }

  static createInitialBundles(): BahanAjarAiCompleteBundle[] {
    return [];
  }

  static saveBundle(bundle: BahanAjarAiCompleteBundle): BahanAjarAiCompleteBundle[] {
    const list = this.getBundles();
    const existingIdx = list.findIndex((b) => b.id === bundle.id);
    let updated: BahanAjarAiCompleteBundle[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = bundle;
    } else {
      updated = [bundle, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEY_BUNDLES, JSON.stringify(updated));
    } catch (e) {
      console.error("Gagal menyimpan bundle:", e);
    }
    return updated;
  }

  static deleteBundle(id: string): BahanAjarAiCompleteBundle[] {
    const list = this.getBundles().filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_BUNDLES, JSON.stringify(list));
    } catch (e) {
      console.error("Gagal menghapus bundle:", e);
    }
    return list;
  }

  static duplicateBundle(id: string): BahanAjarAiCompleteBundle | null {
    const list = this.getBundles();
    const target = list.find((b) => b.id === id);
    if (!target) return null;

    const duplicated: BahanAjarAiCompleteBundle = {
      ...JSON.parse(JSON.stringify(target)),
      id: `ai-bundle-${Date.now()}`,
      tanggalDibuat: new Date().toISOString(),
      status: "Draft",
      materiPembelajaran: {
        ...target.materiPembelajaran,
        judul: `[Salinan] ${target.materiPembelajaran.judul}`
      }
    };

    this.saveBundle(duplicated);
    return duplicated;
  }

  // 2. HASIL CBT SISWA
  static getHasilCbt(): HasilCbtSiswa[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CBT_RESULTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Gagal memuat hasil CBT:", e);
    }
    return [];
  }

  static saveHasilCbt(hasil: HasilCbtSiswa): HasilCbtSiswa[] {
    const list = this.getHasilCbt();
    const updated = [hasil, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_CBT_RESULTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Gagal menyimpan hasil CBT:", e);
    }
    return updated;
  }

  // 3. HASIL GAME SISWA
  static getHasilGame(): HasilGameSiswa[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_GAME_RESULTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Gagal memuat hasil game:", e);
    }
    return [];
  }

  static saveHasilGame(hasil: HasilGameSiswa): HasilGameSiswa[] {
    const list = this.getHasilGame();
    const updated = [hasil, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_GAME_RESULTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Gagal menyimpan hasil game:", e);
    }
    return updated;
  }

  // 4. GOOGLE APPS SCRIPT URL SETTING
  static getAppsScriptUrl(): string {
    return localStorage.getItem(STORAGE_KEY_APPS_SCRIPT_URL) || "";
  }

  static saveAppsScriptUrl(url: string): void {
    localStorage.setItem(STORAGE_KEY_APPS_SCRIPT_URL, url.trim());
  }

  // 5. PRINT / PDF EXPORT HELPER
  static printElement(elementId: string, title: string = "Dokumen Bahan Ajar AI PAI") {
    const el = document.getElementById(elementId);
    if (!el) {
      window.print();
      return;
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #0f172a; line-height: 1.5; }
            h1, h2, h3 { color: #065f46; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #e2e8f0; }
            @media print {
              button { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${el.innerHTML}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }
}
