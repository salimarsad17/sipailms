/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "./supabase";
import {
  DataSekolah,
  Guru,
  Kelas,
  Siswa,
  RekapNilaiTotal,
  NilaiSemesterParalel,
  JurnalMengajar,
  PengumpulanTugas,
  PesanPai,
  TugasLms,
  UserAccount
} from "../types";
import { DataService } from "../data/initialData";

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

export async function autoSyncJurnalToSupabase(
  jurnals: JurnalMengajar | JurnalMengajar[]
): Promise<boolean> {
  const list = Array.isArray(jurnals) ? jurnals : [jurnals];
  if (list.length === 0) return true;

  try {
    const rows = list.map(mapJurnalToSupabaseRow);
    await supabase.from("jurnal_guru").upsert(rows);
    await supabase.from("app_store").upsert([
      { key: "jurnal", value: DataService.getJurnalMengajar(), updated_at: new Date().toISOString() }
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
    await supabase.from("app_store").upsert([
      { key: "jurnal", value: DataService.getJurnalMengajar(), updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
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

export async function autoSyncPengumpulanToSupabase(
  submissions: PengumpulanTugas | PengumpulanTugas[]
): Promise<boolean> {
  const list = Array.isArray(submissions) ? submissions : [submissions];
  if (list.length === 0) return true;

  try {
    const rows = list.map(mapPengumpulanToSupabaseRow);
    await supabase.from("pengumpulan_tugas").upsert(rows);
    await supabase.from("app_store").upsert([
      { key: "pengumpulan", value: DataService.getPengumpulan(), updated_at: new Date().toISOString() }
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

  const titleMatch = text.match(/^\[(.*?)\]\s*/);
  if (titleMatch) {
    judul = titleMatch[1];
    cleanText = cleanText.replace(titleMatch[0], "");
  }

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

export async function autoSyncPesanToSupabase(
  pesanList: PesanPai | PesanPai[]
): Promise<boolean> {
  const list = Array.isArray(pesanList) ? pesanList : [pesanList];
  if (list.length === 0) return true;

  try {
    const rows = list.map(mapPesanToSupabaseRow);
    await supabase.from("pesan_pai").upsert(rows);
    await supabase.from("app_store").upsert([
      { key: "pesan", value: DataService.getPesan(), updated_at: new Date().toISOString() }
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
    await supabase.from("app_store").upsert([
      { key: "pesan", value: DataService.getPesan(), updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
  } catch (err) {
    console.error("[Supabase] deletePesanFromSupabase error:", err);
  }
}

// ====================================================================
// 4. SEKOLAH & GURU SYNC
// ====================================================================

export async function autoSyncSekolahToSupabase(sekolah: DataSekolah): Promise<boolean> {
  try {
    await supabase.from("sekolah").upsert({
      id: "sekolah-utama",
      nama_sekolah: sekolah.namaSekolah,
      npsn: sekolah.npsn,
      alamat: sekolah.alamat,
      akreditasi: sekolah.akreditasi,
      nama_kepsek: sekolah.namaKepsek,
      nip_kepsek: sekolah.nipKepsek,
      updated_at: new Date().toISOString()
    });
    await supabase.from("app_store").upsert([
      { key: "sekolah", value: sekolah, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncSekolahToSupabase error:", err);
    return false;
  }
}

export async function autoSyncGuruToSupabase(guru: Guru): Promise<boolean> {
  try {
    await supabase.from("guru").upsert({
      nip: guru.nip,
      nama: guru.nama,
      sertifikasi: guru.sertifikasi,
      kontak: guru.kontak,
      is_wali_kelas: guru.isWaliKelas,
      wali_kelas_di: guru.waliKelasDi,
      foto_profil: guru.fotoProfil,
      updated_at: new Date().toISOString()
    });
    await supabase.from("app_store").upsert([
      { key: "guru", value: guru, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncGuruToSupabase error:", err);
    return false;
  }
}

// ====================================================================
// 5. KELAS & SISWA SYNC
// ====================================================================

export async function autoSyncKelasToSupabase(kelasList: Kelas[]): Promise<boolean> {
  try {
    if (kelasList.length > 0) {
      const rows = kelasList.map((k) => ({
        id: k.id,
        nama: k.nama,
        wali_kelas_nip: k.waliKelasNip,
        wali_kelas_nama: k.waliKelasNama,
        kuota: k.kuota,
        total_siswa: k.totalSiswa,
        updated_at: new Date().toISOString()
      }));
      await supabase.from("kelas").upsert(rows);
    }
    await supabase.from("app_store").upsert([
      { key: "kelas", value: kelasList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncKelasToSupabase error:", err);
    return false;
  }
}

export async function deleteKelasFromSupabase(id: string, remaining: Kelas[]): Promise<void> {
  try {
    await supabase.from("kelas").delete().eq("id", id);
    await supabase.from("app_store").upsert([
      { key: "kelas", value: remaining, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
  } catch (err) {
    console.error("[Supabase] deleteKelasFromSupabase error:", err);
  }
}

export async function autoSyncSiswaToSupabase(siswaList: Siswa[]): Promise<boolean> {
  try {
    if (siswaList.length > 0) {
      const rows = siswaList.map((s) => ({
        nisn: s.nisn,
        nama: s.nama,
        gender: s.gender,
        agama: s.agama || "Islam",
        status_keaktifan: s.statusKeaktifan || "Aktif",
        kelas_id: s.kelasId,
        kontak_orang_tua: s.kontakOrangTua || "",
        catatan_khusus: s.catatanKhusus || "",
        updated_at: new Date().toISOString()
      }));
      await supabase.from("siswa").upsert(rows);
    }
    await supabase.from("app_store").upsert([
      { key: "siswa", value: siswaList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncSiswaToSupabase error:", err);
    return false;
  }
}

export async function deleteSiswaFromSupabase(nisn: string, remaining: Siswa[]): Promise<void> {
  try {
    await supabase.from("siswa").delete().eq("nisn", nisn);
    await supabase.from("app_store").upsert([
      { key: "siswa", value: remaining, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
  } catch (err) {
    console.error("[Supabase] deleteSiswaFromSupabase error:", err);
  }
}

// ====================================================================
// 6. NILAI (REKAP & PARALEL) SYNC
// ====================================================================

export async function autoSyncRekapNilaiToSupabase(rekapList: RekapNilaiTotal[]): Promise<boolean> {
  try {
    if (rekapList.length > 0) {
      const rows = rekapList.map((r) => ({
        siswa_nisn: r.siswaNisn,
        siswa_nama: r.siswaNama,
        kelas_id: r.kelasId,
        formatif_kuis: r.formatifKuis,
        formatif_tugas: r.formatifTugas,
        formatif_diskusi: r.formatifDiskusi,
        sumatif_pts: r.sumatifPts,
        sumatif_pas: r.sumatifPas,
        hafalan_juz_amma: r.hafalanJuzAmmaScore,
        praktik_sholat: r.praktikSholat,
        praktik_wudhu: r.praktikWudhu,
        updated_at: new Date().toISOString()
      }));
      await supabase.from("rekap_nilai").upsert(rows);
    }
    await supabase.from("app_store").upsert([
      { key: "rekap_nilai", value: rekapList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncRekapNilaiToSupabase error:", err);
    return false;
  }
}

export async function autoSyncNilaiParalelToSupabase(paralelList: NilaiSemesterParalel[]): Promise<boolean> {
  try {
    await supabase.from("app_store").upsert([
      { key: "nilai_paralel", value: paralelList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncNilaiParalelToSupabase error:", err);
    return false;
  }
}

// ====================================================================
// 7. TUGAS LMS & ACCOUNTS SYNC
// ====================================================================

export async function autoSyncTugasToSupabase(tugasList: TugasLms[]): Promise<boolean> {
  try {
    if (tugasList.length > 0) {
      const rows = tugasList.map((t) => ({
        id: t.id,
        judul: t.judul,
        deskripsi: t.deskripsi || "",
        kelas_id: t.kelasId || "",
        tenggat_waktu: t.deadline && !isNaN(Date.parse(t.deadline)) ? new Date(t.deadline).toISOString() : new Date().toISOString(),
        jenis: t.bab || "Tugas",
        status: "Aktif",
        updated_at: new Date().toISOString()
      }));
      await supabase.from("tugas_lms").upsert(rows);
    }
    await supabase.from("app_store").upsert([
      { key: "tugas", value: tugasList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncTugasToSupabase error:", err);
    return false;
  }
}

export async function deleteTugasFromSupabase(id: string, remaining: TugasLms[]): Promise<void> {
  try {
    await supabase.from("tugas_lms").delete().eq("id", id);
    await supabase.from("app_store").upsert([
      { key: "tugas", value: remaining, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
  } catch (err) {
    console.error("[Supabase] deleteTugasFromSupabase error:", err);
  }
}

export async function autoSyncAccountsToSupabase(accountsList: UserAccount[]): Promise<boolean> {
  try {
    if (accountsList.length > 0) {
      const rows = accountsList.map((a) => ({
        id: a.id,
        role: a.role,
        identifier: a.identifier,
        password: a.password,
        nama: a.nama,
        kelas_id: a.kelasId || null,
        kontak: a.kontak || "",
        registered_at: a.registeredAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      await supabase.from("accounts").upsert(rows);
    }
    await supabase.from("app_store").upsert([
      { key: "accounts", value: accountsList, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });
    return true;
  } catch (err) {
    console.error("[Supabase] autoSyncAccountsToSupabase error:", err);
    return false;
  }
}

// ====================================================================
// 8. FETCH ALL CORE DATASETS ON APPLICATION STARTUP
// ====================================================================

export interface SupabaseFullDatasets {
  sekolah?: DataSekolah;
  guru?: Guru;
  kelas?: Kelas[];
  students?: Siswa[];
  rekapNilai?: RekapNilaiTotal[];
  nilaiParalelList?: NilaiSemesterParalel[];
  jurnals?: JurnalMengajar[];
  tasks?: TugasLms[];
  submissions?: PengumpulanTugas[];
  pesanList?: PesanPai[];
  accounts?: UserAccount[];
}

export async function fetchFullDatasetsFromSupabase(): Promise<SupabaseFullDatasets | null> {
  try {
    const result: SupabaseFullDatasets = {};
    let foundAny = false;

    // 1. Fetch app_store first (stores rich JSON snapshots)
    const { data: storeRows } = await supabase.from("app_store").select("key, value");
    if (storeRows && storeRows.length > 0) {
      storeRows.forEach((r) => {
        if (r.key === "sekolah" && r.value) { result.sekolah = r.value; foundAny = true; }
        if (r.key === "guru" && r.value) { result.guru = r.value; foundAny = true; }
        if (r.key === "kelas" && Array.isArray(r.value)) { result.kelas = r.value; foundAny = true; }
        if (r.key === "siswa" && Array.isArray(r.value)) { result.students = r.value; foundAny = true; }
        if (r.key === "rekap_nilai" && Array.isArray(r.value)) { result.rekapNilai = r.value; foundAny = true; }
        if (r.key === "nilai_paralel" && Array.isArray(r.value)) { result.nilaiParalelList = r.value; foundAny = true; }
        if (r.key === "jurnal" && Array.isArray(r.value)) { result.jurnals = r.value; foundAny = true; }
        if (r.key === "tugas" && Array.isArray(r.value)) { result.tasks = r.value; foundAny = true; }
        if (r.key === "pengumpulan" && Array.isArray(r.value)) { result.submissions = r.value; foundAny = true; }
        if (r.key === "pesan" && Array.isArray(r.value)) { result.pesanList = r.value; foundAny = true; }
        if (r.key === "accounts" && Array.isArray(r.value)) { result.accounts = r.value; foundAny = true; }
      });
    }

    // 2. Fallbacks to relational tables if some keys missing in app_store
    if (!result.students || result.students.length === 0) {
      const { data: sData } = await supabase.from("siswa").select("*");
      if (sData && sData.length > 0) {
        result.students = sData.map((s) => ({
          nisn: s.nisn,
          nama: s.nama,
          gender: s.gender,
          agama: s.agama || "Islam",
          statusKeaktifan: s.status_keaktifan || "Aktif",
          kelasId: s.kelas_id,
          kontakOrangTua: s.kontak_orang_tua,
          catatanKhusus: s.catatan_khusus
        }));
        foundAny = true;
      }
    }

    if (!result.kelas || result.kelas.length === 0) {
      const { data: kData } = await supabase.from("kelas").select("*");
      if (kData && kData.length > 0) {
        result.kelas = kData.map((k) => ({
          id: k.id,
          nama: k.nama,
          waliKelasNip: k.wali_kelas_nip,
          waliKelasNama: k.wali_kelas_nama,
          kuota: k.kuota,
          totalSiswa: k.total_siswa
        }));
        foundAny = true;
      }
    }

    if (!result.jurnals || result.jurnals.length === 0) {
      const { data: jData } = await supabase.from("jurnal_guru").select("*");
      if (jData && jData.length > 0) {
        result.jurnals = jData.map(mapSupabaseRowToJurnal);
        foundAny = true;
      }
    }

    if (!result.submissions || result.submissions.length === 0) {
      const { data: pData } = await supabase.from("pengumpulan_tugas").select("*");
      if (pData && pData.length > 0) {
        result.submissions = pData.map(mapSupabaseRowToPengumpulan);
        foundAny = true;
      }
    }

    if (!result.pesanList || result.pesanList.length === 0) {
      const { data: psData } = await supabase.from("pesan_pai").select("*");
      if (psData && psData.length > 0) {
        result.pesanList = psData.map(mapSupabaseRowToPesan);
        foundAny = true;
      }
    }

    return foundAny ? result : null;
  } catch (err) {
    console.warn("[Supabase] fetchFullDatasetsFromSupabase failed:", err);
    return null;
  }
}

export async function fetchJurnalFromSupabase(): Promise<JurnalMengajar[] | null> {
  try {
    const { data: storeRow } = await supabase.from("app_store").select("value").eq("key", "jurnal").single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) return storeRow.value;
    const { data, error } = await supabase.from("jurnal_guru").select("*").order("tanggal", { ascending: false });
    if (!error && data && data.length > 0) return data.map(mapSupabaseRowToJurnal);
  } catch {}
  return null;
}

export async function fetchPengumpulanFromSupabase(): Promise<PengumpulanTugas[] | null> {
  try {
    const { data: storeRow } = await supabase.from("app_store").select("value").eq("key", "pengumpulan").single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) return storeRow.value;
    const { data, error } = await supabase.from("pengumpulan_tugas").select("*").order("tanggal_kumpul", { ascending: false });
    if (!error && data && data.length > 0) return data.map(mapSupabaseRowToPengumpulan);
  } catch {}
  return null;
}

export async function fetchPesanFromSupabase(): Promise<PesanPai[] | null> {
  try {
    const { data: storeRow } = await supabase.from("app_store").select("value").eq("key", "pesan").single();
    if (storeRow?.value && Array.isArray(storeRow.value) && storeRow.value.length > 0) return storeRow.value;
    const { data, error } = await supabase.from("pesan_pai").select("*").order("timestamp", { ascending: false });
    if (!error && data && data.length > 0) return data.map(mapSupabaseRowToPesan);
  } catch {}
  return null;
}
