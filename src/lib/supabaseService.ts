/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, checkSupabaseConnection } from "./supabase";
import { DataService } from "../data/initialData";
import {
  DataSekolah,
  Guru,
  Kelas,
  Siswa,
  RekapNilaiTotal,
  JurnalMengajar,
  TugasLms,
  PengumpulanTugas,
  PesanPai,
  UserAccount
} from "../types";
import {
  mapJurnalToSupabaseRow,
  mapPengumpulanToSupabaseRow,
  mapPesanToSupabaseRow,
  mapSupabaseRowToJurnal,
  mapSupabaseRowToPengumpulan,
  mapSupabaseRowToPesan
} from "./supabaseSyncManager";

export interface SupabaseSyncReport {
  success: boolean;
  timestamp: string;
  pushedCount: {
    siswa: number;
    kelas: number;
    guru: number;
    sekolah: number;
    rekapNilai: number;
    tugas: number;
    pengumpulan: number;
    jurnal: number;
    pesan: number;
    accounts: number;
  };
  tablesUsed: string[];
  usingAppStore: boolean;
  errors: string[];
}

/**
 * Upload all current app data from LocalStorage/Memory to Supabase
 */
export async function pushAllToSupabase(): Promise<SupabaseSyncReport> {
  const report: SupabaseSyncReport = {
    success: false,
    timestamp: new Date().toISOString(),
    pushedCount: {
      siswa: 0,
      kelas: 0,
      guru: 0,
      sekolah: 0,
      rekapNilai: 0,
      tugas: 0,
      pengumpulan: 0,
      jurnal: 0,
      pesan: 0,
      accounts: 0
    },
    tablesUsed: [],
    usingAppStore: false,
    errors: []
  };

  try {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();
    const kelas = DataService.getKelas();
    const siswa = DataService.getSiswa();
    const rekapNilai = DataService.getRekapNilai();
    const tugas = DataService.getTugas();
    const pengumpulan = DataService.getPengumpulan();
    const jurnal = DataService.getJurnalMengajar();
    const pesan = DataService.getPesan();
    const accounts = DataService.getAccounts();

    // 1. Try upserting to unified app_store (Fastest, zero-loss JSON store)
    try {
      const allModules = [
        { key: "sekolah", value: sekolah },
        { key: "guru", value: guru },
        { key: "kelas", value: kelas },
        { key: "siswa", value: siswa },
        { key: "rekap_nilai", value: rekapNilai },
        { key: "tugas", value: tugas },
        { key: "pengumpulan", value: pengumpulan },
        { key: "jurnal", value: jurnal },
        { key: "pesan", value: pesan },
        { key: "accounts", value: accounts }
      ];

      const { error: storeErr } = await supabase
        .from("app_store")
        .upsert(allModules, { onConflict: "key" });

      if (!storeErr) {
        report.usingAppStore = true;
        report.tablesUsed.push("app_store");
      } else {
        report.errors.push(`app_store: ${storeErr.message}`);
      }
    } catch (e: any) {
      report.errors.push(`app_store: ${e.message}`);
    }

    // 2. Upsert into individual relational tables if they exist
    // Table: sekolah
    try {
      const { error } = await supabase.from("sekolah").upsert({
        id: "sekolah-utama",
        nama_sekolah: sekolah.namaSekolah,
        npsn: sekolah.npsn,
        alamat: sekolah.alamat,
        akreditasi: sekolah.akreditasi,
        nama_kepsek: sekolah.namaKepsek,
        nip_kepsek: sekolah.nipKepsek,
        updated_at: new Date().toISOString()
      });
      if (!error) {
        report.pushedCount.sekolah = 1;
        report.tablesUsed.push("sekolah");
      } else {
        report.errors.push(`sekolah: ${error.message}`);
      }
    } catch (e: any) {
      report.errors.push(`sekolah: ${e.message}`);
    }

    // Table: guru
    try {
      const { error } = await supabase.from("guru").upsert({
        nip: guru.nip,
        nama: guru.nama,
        sertifikasi: guru.sertifikasi,
        kontak: guru.kontak,
        is_wali_kelas: guru.isWaliKelas,
        wali_kelas_di: guru.waliKelasDi,
        foto_profil: guru.fotoProfil,
        updated_at: new Date().toISOString()
      });
      if (!error) {
        report.pushedCount.guru = 1;
        report.tablesUsed.push("guru");
      } else {
        report.errors.push(`guru: ${error.message}`);
      }
    } catch (e: any) {
      report.errors.push(`guru: ${e.message}`);
    }

    // Table: kelas
    try {
      if (kelas.length > 0) {
        const rows = kelas.map((k) => ({
          id: k.id,
          nama: k.nama,
          wali_kelas_nip: k.waliKelasNip,
          wali_kelas_nama: k.waliKelasNama,
          kuota: k.kuota,
          total_siswa: k.totalSiswa,
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from("kelas").upsert(rows);
        if (!error) {
          report.pushedCount.kelas = rows.length;
          report.tablesUsed.push("kelas");
        } else {
          report.errors.push(`kelas: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`kelas: ${e.message}`);
    }

    // Table: siswa
    try {
      if (siswa.length > 0) {
        const rows = siswa.map((s) => ({
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
        const { error } = await supabase.from("siswa").upsert(rows);
        if (!error) {
          report.pushedCount.siswa = rows.length;
          report.tablesUsed.push("siswa");
        } else {
          report.errors.push(`siswa: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`siswa: ${e.message}`);
    }

    // Table: rekap_nilai
    try {
      if (rekapNilai.length > 0) {
        const rows = rekapNilai.map((r) => ({
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
        const { error } = await supabase.from("rekap_nilai").upsert(rows);
        if (!error) {
          report.pushedCount.rekapNilai = rows.length;
          report.tablesUsed.push("rekap_nilai");
        } else {
          report.errors.push(`rekap_nilai: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`rekap_nilai: ${e.message}`);
    }

    // Table: accounts
    try {
      if (accounts.length > 0) {
        const rows = accounts.map((a) => ({
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
        const { error } = await supabase.from("accounts").upsert(rows);
        if (!error) {
          report.pushedCount.accounts = rows.length;
          report.tablesUsed.push("accounts");
        } else {
          report.errors.push(`accounts: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`accounts: ${e.message}`);
    }

    // Table: jurnal_guru
    try {
      if (jurnal.length > 0) {
        const rows = jurnal.map(mapJurnalToSupabaseRow);
        const { error } = await supabase.from("jurnal_guru").upsert(rows);
        if (!error) {
          report.pushedCount.jurnal = rows.length;
          report.tablesUsed.push("jurnal_guru");
        } else {
          report.errors.push(`jurnal_guru: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`jurnal_guru: ${e.message}`);
    }

    // Table: pengumpulan_tugas
    try {
      if (pengumpulan.length > 0) {
        const rows = pengumpulan.map(mapPengumpulanToSupabaseRow);
        const { error } = await supabase.from("pengumpulan_tugas").upsert(rows);
        if (!error) {
          report.pushedCount.pengumpulan = rows.length;
          report.tablesUsed.push("pengumpulan_tugas");
        } else {
          report.errors.push(`pengumpulan_tugas: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`pengumpulan_tugas: ${e.message}`);
    }

    // Table: pesan_pai
    try {
      if (pesan.length > 0) {
        const rows = pesan.map(mapPesanToSupabaseRow);
        const { error } = await supabase.from("pesan_pai").upsert(rows);
        if (!error) {
          report.pushedCount.pesan = rows.length;
          report.tablesUsed.push("pesan_pai");
        } else {
          report.errors.push(`pesan_pai: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`pesan_pai: ${e.message}`);
    }

    // Table: tugas_lms
    try {
      if (tugas.length > 0) {
        const rows = tugas.map((t) => ({
          id: t.id,
          judul: t.judul,
          deskripsi: t.deskripsi || "",
          kelas_id: t.kelasId || "",
          tenggat_waktu: t.deadline && !isNaN(Date.parse(t.deadline)) ? new Date(t.deadline).toISOString() : new Date().toISOString(),
          jenis: t.bab || "Tugas",
          status: "Aktif",
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from("tugas_lms").upsert(rows);
        if (!error) {
          report.pushedCount.tugas = rows.length;
          report.tablesUsed.push("tugas_lms");
        } else {
          report.errors.push(`tugas_lms: ${error.message}`);
        }
      }
    } catch (e: any) {
      report.errors.push(`tugas_lms: ${e.message}`);
    }

    report.success = report.tablesUsed.length > 0;
  } catch (err: any) {
    report.errors.push(err.message || "Unknown error during push to Supabase");
  }

  return report;
}

/**
 * Pull all data from Supabase and save to local DataService
 */
export async function pullAllFromSupabase(): Promise<{
  success: boolean;
  pulledFrom: string[];
  message: string;
}> {
  const pulledFrom: string[] = [];

  try {
    // 1. Try app_store first
    const { data: storeRows, error: storeErr } = await supabase
      .from("app_store")
      .select("*");

    if (!storeErr && storeRows && storeRows.length > 0) {
      storeRows.forEach((row) => {
        if (row.key === "sekolah" && row.value) {
          DataService.saveSekolah(row.value);
          pulledFrom.push("sekolah");
        }
        if (row.key === "guru" && row.value) {
          DataService.saveGuru(row.value);
          pulledFrom.push("guru");
        }
        if (row.key === "kelas" && Array.isArray(row.value)) {
          DataService.saveKelas(row.value);
          pulledFrom.push("kelas");
        }
        if (row.key === "siswa" && Array.isArray(row.value)) {
          DataService.saveSiswa(row.value);
          pulledFrom.push("siswa");
        }
        if (row.key === "rekap_nilai" && Array.isArray(row.value)) {
          DataService.saveRekapNilai(row.value);
          pulledFrom.push("rekap_nilai");
        }
        if (row.key === "tugas" && Array.isArray(row.value)) {
          DataService.saveTugas(row.value);
          pulledFrom.push("tugas");
        }
        if (row.key === "pengumpulan" && Array.isArray(row.value)) {
          DataService.savePengumpulan(row.value);
          pulledFrom.push("pengumpulan");
        }
        if (row.key === "jurnal" && Array.isArray(row.value)) {
          DataService.saveJurnalMengajar(row.value);
          pulledFrom.push("jurnal");
        }
        if (row.key === "pesan" && Array.isArray(row.value)) {
          DataService.savePesan(row.value);
          pulledFrom.push("pesan");
        }
        if (row.key === "accounts" && Array.isArray(row.value)) {
          DataService.saveAccounts(row.value);
          pulledFrom.push("accounts");
        }
      });

      return {
        success: true,
        pulledFrom,
        message: `Berhasil mengunduh data dari Supabase (${pulledFrom.join(", ")})`
      };
    }

    // 2. Try individual relational tables
    // Siswa
    const { data: siswaData } = await supabase.from("siswa").select("*");
    if (siswaData && siswaData.length > 0) {
      const mappedSiswa: Siswa[] = siswaData.map((s) => ({
        nisn: s.nisn,
        nama: s.nama,
        gender: s.gender,
        agama: s.agama || "Islam",
        statusKeaktifan: s.status_keaktifan || "Aktif",
        kelasId: s.kelas_id,
        kontakOrangTua: s.kontak_orang_tua,
        catatanKhusus: s.catatan_khusus
      }));
      DataService.saveSiswa(mappedSiswa);
      pulledFrom.push("siswa");
    }

    // Kelas
    const { data: kelasData } = await supabase.from("kelas").select("*");
    if (kelasData && kelasData.length > 0) {
      const mappedKelas: Kelas[] = kelasData.map((k) => ({
        id: k.id,
        nama: k.nama,
        waliKelasNip: k.wali_kelas_nip,
        waliKelasNama: k.wali_kelas_nama,
        kuota: k.kuota,
        totalSiswa: k.total_siswa
      }));
      DataService.saveKelas(mappedKelas);
      pulledFrom.push("kelas");
    }

    // Jurnal Guru
    const { data: jurnalData } = await supabase.from("jurnal_guru").select("*");
    if (jurnalData && jurnalData.length > 0) {
      const mappedJurnal = jurnalData.map(mapSupabaseRowToJurnal);
      DataService.saveJurnalMengajar(mappedJurnal);
      pulledFrom.push("jurnal_guru");
    }

    // Pengumpulan Tugas
    const { data: pengumpulanData } = await supabase.from("pengumpulan_tugas").select("*");
    if (pengumpulanData && pengumpulanData.length > 0) {
      const mappedPengumpulan = pengumpulanData.map(mapSupabaseRowToPengumpulan);
      DataService.savePengumpulan(mappedPengumpulan);
      pulledFrom.push("pengumpulan_tugas");
    }

    // Pesan PAI
    const { data: pesanData } = await supabase.from("pesan_pai").select("*");
    if (pesanData && pesanData.length > 0) {
      const mappedPesan = pesanData.map(mapSupabaseRowToPesan);
      DataService.savePesan(mappedPesan);
      pulledFrom.push("pesan_pai");
    }

    return {
      success: pulledFrom.length > 0,
      pulledFrom,
      message:
        pulledFrom.length > 0
          ? `Data berhasil ditarik dari tabel Supabase: ${pulledFrom.join(", ")}`
          : "Belum ada data pada tabel Supabase."
    };
  } catch (err: any) {
    return {
      success: false,
      pulledFrom,
      message: err.message || "Gagal menarik data dari Supabase"
    };
  }
}
