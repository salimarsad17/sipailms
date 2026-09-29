/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type KelasTingkat = "VII" | "VIII" | "IX";
export type SemesterTipe = "Ganjil" | "Genap";

export type BahanAjarAiTipe = "materi" | "video" | "game" | "tts" | "puzzle" | "lkpd";

// ==================== 1. MATERI PEMBELAJARAN ====================
export interface MateriPembelajaranItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  deskripsi: string;
  isiMateri: string;
  dalilQuran?: {
    surah: string;
    ayat: string;
    arab: string;
    arti: string;
  };
  poinKunci: string[];
  lampiranFile?: {
    namaFile: string;
    ukuran?: string;
    tipe: "pdf" | "doc" | "ppt" | "image";
    url?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== 2. VIDEO PEMBELAJARAN ====================
export interface VideoPembelajaranItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  urlVideo: string; // YouTube embed or video URL
  durasi: string;
  deskripsi: string;
  poinPembahasan: string[];
  lampiranVideoFile?: {
    namaFile: string;
    ukuran?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== 3. GAME EDUKASI ====================
export interface GameQuestion {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenar: number; // index 0-3
  pembahasan: string;
  poin: number;
}

export interface GameEdukasiItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  deskripsi: string;
  tipeGame: "Kuis Cepat" | "Petualangan PAI" | "Tantangan Waktu" | "Tebak Dalil";
  waktuPerSoalDetik: number;
  jumlahNyawa: number;
  soalList: GameQuestion[];
  lampiranFile?: {
    namaFile: string;
    ukuran?: string;
    tipe: "pdf" | "doc" | "image";
    url?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== 4. TEKA-TEKI SILANG (TTS) ====================
export interface TtsClue {
  nomor: number;
  tipe: "mendatar" | "menurun";
  pertanyaan: string;
  jawaban: string; // uppercase without space
  barisAwal: number; // 0-based index
  kolomAwal: number; // 0-based index
  petunjukTambahan?: string;
}

export interface TekaTekiSilangItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  deskripsi: string;
  ukuranGrid: { baris: number; kolom: number };
  clues: TtsClue[];
  lampiranFile?: {
    namaFile: string;
    ukuran?: string;
    tipe: "pdf" | "doc" | "image";
    url?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== 5. PUZZLE PEMBELAJARAN ====================
export interface PuzzlePiece {
  id: string;
  urutanBenar: number; // 0-based index
  teks: string;
  artiTeks?: string;
  audio?: string;
}

export interface PuzzleItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  deskripsi: string;
  tipePuzzle: "Susun Ayat Al-Qur'an" | "Susun Rukun & Syarat" | "Cocok Kata & Makna" | "Puzzle Kaligrafi";
  potonganList: PuzzlePiece[];
  kunciUrutanLengkap: string; // full sentence or correct explanation
  gambarUrl?: string;
  lampiranFile?: {
    namaFile: string;
    ukuran?: string;
    tipe: "pdf" | "doc" | "image";
    url?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== 6. SOAL LKPD ====================
export interface LkpdSoalDetail {
  nomor: number;
  tipeSoal: "Pilihan Ganda" | "Esai Reflektif" | "Analisis Kasus" | "Praktik Ibadah";
  pertanyaan: string;
  pilihanOpsi?: string[];
  kunciJawaban?: string;
  skorMaks: number;
}

export interface SoalLkpdItem {
  id: string;
  judul: string;
  bab: string;
  kelas: KelasTingkat;
  semester: SemesterTipe;
  alokasiWaktu: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  stimulusMateri: string;
  petunjukPengerjaan: string;
  daftarSoal: LkpdSoalDetail[];
  rubrikPenilaian: string;
  lampiranFile?: {
    namaFile: string;
    ukuran?: string;
    tipe: "pdf" | "doc" | "image";
    url?: string;
  };
  tanggalDibuat: string;
  status: "Draft" | "Dipublikasikan";
}

// ==================== PENUGASAN & PROGRES ====================
export interface PenugasanBahanAjar {
  id: string;
  tipe: BahanAjarAiTipe;
  referensiId: string;
  judul: string;
  kelasId: string; // e.g. "VII-A" or "Semua Kelas VII"
  kelasTingkat: KelasTingkat;
  semester: SemesterTipe;
  instruksi: string;
  batasWaktu: string;
  tanggalTugas: string;
}

export interface SiswaProgressBahanAjar {
  id: string;
  siswaNisn: string;
  referensiId: string;
  tipe: BahanAjarAiTipe;
  status: "Belum Dibaca" | "Sedang Dipelajari" | "Selesai";
  catatanRefleksi?: string;
  skor?: number;
  jawabanLkpd?: Record<number, string>; // nomor -> jawaban text
  jawabanTts?: Record<string, string>; // nomor-tipe -> input user
  fileJawabanUpload?: string;
  tanggalSelesai?: string;
}
