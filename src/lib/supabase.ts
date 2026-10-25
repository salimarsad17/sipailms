/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

const getEnvVar = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return fallback;
};

export const SUPABASE_URL = getEnvVar(
  "VITE_SUPABASE_URL",
  "https://wvuacmeuxwpuocpmwzkb.supabase.co"
);

export const SUPABASE_ANON_KEY = getEnvVar(
  "VITE_SUPABASE_ANON_KEY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2dWFjbWV1eHdwdW9jcG13emtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MDg4OTksImV4cCI6MjEwODM4NDg5OX0.PkbgfEtCmN9fBAnDdQG59DxNyi0Def6bNq4FaB8A6Ao"
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Checks connection status to Supabase instance
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  tablesFound?: string[];
  latencyMs?: number;
}> {
  const startTime = DateTrans.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: SUPABASE_ANON_KEY
      }
    });

    const latencyMs = DateTrans.now() - startTime;

    if (!res.ok) {
      return {
        connected: false,
        message: `HTTP ${res.status}: Gagal otentikasi kunci anon Supabase`,
        latencyMs
      };
    }

    // Check which tables are created in Supabase
    const tablesToCheck = [
      "app_store",
      "sekolah",
      "guru",
      "kelas",
      "siswa",
      "rekap_nilai",
      "jurnal_guru",
      "pengumpulan_tugas",
      "pesan_pai",
      "tugas_lms",
      "accounts"
    ];
    const tablesFound: string[] = [];

    await Promise.all(
      tablesToCheck.map(async (tbl) => {
        try {
          const { error } = await supabase
            .from(tbl)
            .select("*")
            .limit(1);
          if (!error) {
            tablesFound.push(tbl);
          }
        } catch {
          // table doesn't exist yet
        }
      })
    );

    return {
      connected: true,
      message:
        tablesFound.length > 0
          ? `Terhubung ke Supabase Cloud (${tablesFound.length} tabel aktif)`
          : "Terhubung ke Supabase Cloud (Database aktif & siap digunakan)",
      tablesFound,
      latencyMs
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || "Gagal menghubungi Supabase",
      latencyMs: DateTrans.now() - startTime
    };
  }
}

const DateTrans = {
  now: () => (typeof performance !== "undefined" ? Math.round(performance.now()) : Date.now())
};
