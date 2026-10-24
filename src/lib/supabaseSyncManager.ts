/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "./supabase";
import { JurnalMengajar, PengumpulanTugas, PesanPai, TugasLms } from "../types";

// ====================================================================
// 1. JURNAL GURU SYNC
// ====================================================================

export function mapJurnalToSupabaseRow(j: JurnalMengajar) {
  let cleanDate = j.tanggal;
  if (!cleanDate || cleanDate.length !== 10) {
    cleanDate = new Date().toISOString().slice(0, 10);
  }
  return {
    id: j.id,
    tanggal: cleanDate,
    jam_ke: j.jamKe || "",
    kelas_id: j.kelasId || "",
    materi: j.materiPokok || "",
    capaian_pembelajaran: j.materiPokok || "",
    aktivitas: j.kegiatanKbm || "",
    kehadiran: {
      hadir: Number(j.kehadiranHadir || 0),
      izin: Number(j.kehadiranIzin || 0),
      sakit: Number(j.kehadiranSakit || 0),
      alpa: Number(j.kehadiranAlpa || 0)
    },
    evaluasi_siswa: j.catatanKejadian || "",
    updated_at: new Date().toISOString()
  };
}

export function mapSupabaseRowToJurnal(row: any): JurnalMengajar {
  const keh = row.kehadiran || {};
  return {
    id: row.id,
    tanggal: row.tanggal || new Date().toISOString().slice(0, 10),
    kelasId: row.kelas_id || "",
    jamKe: row.jam_ke || "1-2",
    materiPokok: row.materi || row.capaian_pembelajaran || "Materi PAI",
    kegiatanKbm: row.aktivitas || undefined,
    kehadiranHadir: Number(keh.hadir ?? 30),
    kehadiranIzin: Number(keh.izin ?? 0),
    kehadiranSakit: Number(keh.sakit ?? 0),
    kehadiranAlpa: Number(keh.alpa ?? 0),
    catatanKejadian: row.evaluasi_siswa || ""
  };
}

/**
 * Sync single or multiple Jurnal entries to Supabase immediately
 */
export async function autoSyncJurnalToSupabase(
  jurnals: JurnalMengajar | JurnalMengajar[]
): Promise<boolean> {
  const list = Array.isArray(jurnals) ? jurnals : [jurnals];
  if (list.length === 0) return true;

  try {
    // 1. Upsert into public.jurnal_guru table
    const rows = list.map(mapJurnalToSupabaseRow);
    const { error: tblErr } = await supabase.from("jurnal_guru").upsert(rows);
    if (tblErr) {
      console.warn("[Supabase] jurnal_guru table upsert notice:", tblErr.message);
    }

    // 2. Also keep full JSON in app_store key "jurnal"
    await supabase.from("app_store").upsert([
      {
        key: "jurnal",
        value: list,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: "key" });

    return true;
  } catch (err: any) {
    console.error("[Supabase] autoSyncJurnalToSupabase error:", err);
    return false;
  }
}

export async function deleteJurnalFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from("jurnal_guru").delete().eq("id", id);
  } catch (err) {
    console.error("[Supabase] deleteJurnalFromSupabase error:", err);
  }
}

// ====================================================================
// 2. PENGUMPULAN TUGAS SYNC
// ====================================================================

export function mapPengumpulanToSupabaseRow(p: PengumpulanTugas) {
  let ts = p.tanggalKumpul;
  if (!ts || isNaN(Date.parse(ts))) {
    ts = new Date().toISOString();
  } else {
    ts = new Date(ts).toISOString();
  }

  return {
    id: p.id,
    tugas_id: p.tugasId || "",
    siswa_nisn: p.siswaNisn || "",
    siswa_nama: p.siswaNama || "",
    kelas_id: p.kelasId || "",
    tanggal_kumpul: ts,
    status: p.nilai !== undefined && p.nilai !== null ? "Dinilai" : "Diserahkan",
    nilai: p.nilai !== undefined && p.nilai !== null ? Number(p.nilai) : null,
    feedback: p.komentarGuru || "",
    file_url: p.fileName || p.kontenTeks || "",
    updated_at: new Date().toISOString()
  };
}

export function mapSupabaseRowToPengumpulan(row: any): PengumpulanTugas {
  return {
    id: row.id,
    tugasId: row.tugas_id || "",
    tugasJudul: "Tugas PAI",
    siswaNisn: row.siswa_nisn || "",
    siswaNama: row.siswa_nama || "",
    kelasId: row.kelas_id || "",
    tanggalKumpul: row.tanggal_kumpul || new Date().toISOString(),
    tipePengumpulan: row.file_url?.startsWith("data:") || row.file_url?.includes(".pdf") ? "File" : "Teks",
    kontenTeks: row.file_url || "",
    nilai: row.nilai !== null && row.nilai !== undefined ? Number(row.nilai) : undefined,
    komentarGuru: row.feedback || undefined
  };
}

/**
 * Sync single or multiple Pengumpulan Tugas entries to Supabase immediately
 */
export async function autoSyncPengumpulanToSupabase(
  submissions: PengumpulanTugas | PengumpulanTugas[]
): Promise<boolean> {
  const list = Array.isArray(submissions) ? submissions : [submissions];
  if (list.length === 0) return true;

  try {
    // 1. Upsert into public.pengumpulan_tugas table
    const rows = list.map(mapPengumpulanToSupabaseRow);
    const { error: tblErr } = await supabase.from("pengumpulan_tugas").upsert(rows);
    if (tblErr) {
      console.warn("[Supabase] pengumpulan_tugas table upsert notice:", tblErr.message);
    }

    // 2. Also keep full JSON in app_store key "pengumpulan"
    await supabase.from("app_store").upsert([
      {
        key: "pengumpulan",
        value: list,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: "key" });

    return true;
  } catch (err: any) {
    console.error("[Supabase] autoSyncPengumpulanToSupabase error:", err);
    return false;
  }
}

// ====================================================================
// 3. PESAN PAI SYNC
// ====================================================================

export function mapPesanToSupabaseRow(msg: PesanPai) {
  let ts = msg.waktu;
  if (!ts || isNaN(Date.parse(ts))) {
    ts = new Date().toISOString();
  } else {
    ts = new Date(ts).toISOString();
  }

  // Construct text content cleanly
  const titlePart = msg.judul ? `[${msg.judul}] ` : "";
  const topicPart = msg.topikMateri ? `(${msg.topikMateri}) ` : "";
  const fullText = `${titlePart}${topicPart}${msg.isiPesan || ""}`.trim() || "Pesan PAI";

  return {
    id: msg.id,
    sender_id: msg.senderId || "anon",
    sender_name: msg.senderNama || "Pengguna",
    sender_role: msg.senderRole || "GURU",
    receiver_id: msg.recipientId || "ALL",
    receiver_name: msg.recipientNama || "Semua",
    receiver_role: msg.recipientRole || "SEMUA_SISWA",
    text: fullText,
    timestamp: ts,
    is_read: Boolean(msg.isRead),
    attachment_url: msg.lampiran?.url || msg.lampiran?.nama || null
  };
}

export function mapSupabaseRowToPesan(row: any): PesanPai {
  const text: string = row.text || "";
  let judul: string | undefined = undefined;
  let topikMateri: string = "Umum";
  let cleanText = text;

  // Extract [Judul] if present
  const titleMatch = text.match(/^\[(.*?)\]\s*/);
  if (titleMatch) {
    judul = titleMatch[1];
    cleanText = cleanText.replace(titleMatch[0], "");
  }

  // Extract (Topik) if present
  const topicMatch = cleanText.match(/^\((.*?)\)\s*/);
  if (topicMatch) {
    topikMateri = topicMatch[1];
    cleanText = cleanText.replace(topicMatch[0], "");
  }

  return {
    id: row.id,
    senderRole: row.sender_role === "SISWA" ? "SISWA" : "GURU",
    senderId: row.sender_id || "",
    senderNama: row.sender_name || "",
    recipientRole: row.receiver_role || "SISWA",
    recipientId: row.receiver_id || "",
    recipientNama: row.receiver_name || "",
    topikMateri,
    judul,
    isiPesan: cleanText,
    waktu: row.timestamp || new Date().toISOString(),
    isRead: Boolean(row.is_read),
    lampiran: row.attachment_url
      ? {
          tipe: "file",
          nama: "Lampiran Dokumen",
          url: row.attachment_url
        }
      : undefined
  };
}

/**
 * Sync single or multiple Pesan entries to Supabase immediately
 */
export async function autoSyncPesanToSupabase(
  pesanList: PesanPai | PesanPai[]
): Promise<boolean> {
  const list = Array.isArray(pesanList) ? pesanList : [pesanList];
  if (list.length === 0) return true;

  try {
    // 1. Upsert into public.pesan_pai table
    const rows = list.map(mapPesanToSupabaseRow);
    const { error: tblErr } = await supabase.from("pesan_pai").upsert(rows);
    if (tblErr) {
      console.warn("[Supabase] pesan_pai table upsert notice:", tblErr.message);
    }

    // 2. Also keep full JSON in app_store key "pesan"
    await supabase.from("app_store").upsert([
      {
        key: "pesan",
        value: list,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: "key" });

    return true;
  } catch (err: any) {
    console.error("[Supabase] autoSyncPesanToSupabase error:", err);
    return false;
  }
}

export async function deletePesanFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from("pesan_pai").delete().eq("id", id);
  } catch (err) {
    console.error("[Supabase] deletePesanFromSupabase error:", err);
  }
}

// ====================================================================
// 4. PULL / FETCH LATEST DATA FROM SUPABASE
// ====================================================================

export async function fetchJurnalFromSupabase(): Promise<JurnalMengajar[] | null> {
  try {
    // Try app_store first
    const { data: storeRow } = await supabase
      .from("app_store")
      .select("value")
      .eq("key", "jurnal")
      .single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) {
      return storeRow.value;
    }

    // Fallback to table
    const { data, error } = await supabase
      .from("jurnal_guru")
      .select("*")
      .order("tanggal", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseRowToJurnal);
    }
  } catch {
    // Supabase offline or not yet initialized
  }
  return null;
}

export async function fetchPengumpulanFromSupabase(): Promise<PengumpulanTugas[] | null> {
  try {
    // Try app_store first
    const { data: storeRow } = await supabase
      .from("app_store")
      .select("value")
      .eq("key", "pengumpulan")
      .single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) {
      return storeRow.value;
    }

    // Fallback to table
    const { data, error } = await supabase
      .from("pengumpulan_tugas")
      .select("*")
      .order("tanggal_kumpul", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseRowToPengumpulan);
    }
  } catch {
    // Supabase offline
  }
  return null;
}

export async function fetchPesanFromSupabase(): Promise<PesanPai[] | null> {
  try {
    // Try app_store first
    const { data: storeRow } = await supabase
      .from("app_store")
      .select("value")
      .eq("key", "pesan")
      .single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) {
      return storeRow.value;
    }

    // Fallback to table
    const { data, error } = await supabase
      .from("pesan_pai")
      .select("*")
      .order("timestamp", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseRowToPesan);
    }
  } catch {
    // Supabase offline
  }
  return null;
}
