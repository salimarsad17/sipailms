/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Data Resmi Buku Pelajaran PAI & Budi Pekerti SMP Kelas 7, 8, 9
 * Kementerian Pendidikan Dasar dan Menengah / BSKAP Kemendikbudristek
 * Sesuai Capaian Pembelajaran (CP) No. 032/H/KR/2024 / Regulasi Kurikulum Merdeka Terbaru 2024-2026
 * Fase D (Kelas VII, VIII, IX SMP/MTs)
 */

import { BUKU_PAI_KELAS_7_LENGKAP } from "./bukuPaiKelas7Lengkap";
import { BUKU_PAI_KELAS_8_LENGKAP } from "./bukuPaiKelas8Lengkap";
import { BUKU_PAI_KELAS_9_LENGKAP } from "./bukuPaiKelas9Lengkap";

export type ElemenCPType =
  | "Al-Qur'an dan Hadis"
  | "Akidah"
  | "Akhlak"
  | "Fiqih"
  | "Sejarah Peradaban Islam";

export interface AyatDalilData {
  surah: string;
  ayat: string;
  teksArab: string;
  latin?: string;
  arti: string;
  keterangan?: string;
}

export interface SubMateriData {
  judul: string;
  subJudul?: string;
  konten: string;
  poinPenting?: string[];
}

export interface BahanAjarLengkapData {
  pendahuluan: string;
  subMateri: SubMateriData[];
  aktivitasSiswa?: string[];
  hikmahKarakter?: string;
}

export interface BabPelajaranData {
  babNomor: number;
  semester: 1 | 2;
  judulBab: string;
  kategori: "Al-Qur'an & Tajwid" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah (Tarikh)";
  elemenCP: ElemenCPType;
  capaianPembelajaran: string;
  ringkasan: string;
  tujuanPembelajaran: string[];
  materiPokok: string[];
  istilahPenting: { kata: string; arti: string }[];
  dalilAyat?: AyatDalilData[];
  bahanAjarLengkap?: BahanAjarLengkapData;
}

export interface BukuPelajaranData {
  id: string;
  judul: string;
  kelas: string;
  tingkat: "Kelas VII" | "Kelas VIII" | "Kelas IX";
  fase: string;
  kurikulum: string;
  regulasiCP: string;
  penulis: string;
  penerbit: string;
  tahunTerbit: string;
  deskripsiBuku: string;
  babList: BabPelajaranData[];
}

export const LIST_BUKU_PAI_KEMENDIKBUD: BukuPelajaranData[] = [
  // =========================================================================
  // 1. BUKU PAI KELAS 7 (VII) SMP - FASE D (10 BAB LENGKAP CP TERBARU)
  // =========================================================================
  BUKU_PAI_KELAS_7_LENGKAP,

  // =========================================================================
  // 2. BUKU PAI KELAS 8 (VIII) SMP - FASE D (10 BAB LENGKAP CP TERBARU)
  // =========================================================================
  BUKU_PAI_KELAS_8_LENGKAP,

  // =========================================================================
  // 3. BUKU PAI KELAS 9 (IX) SMP - FASE D (10 BAB LENGKAP CP TERBARU)
  // =========================================================================
  BUKU_PAI_KELAS_9_LENGKAP
];
