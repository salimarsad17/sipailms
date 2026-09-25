/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BahanAjarAiIdentitas {
  mataPelajaran: string;
  kelas: "7" | "8" | "9";
  babMateri: string;
  alokasiWaktu: string;
  jenjang: string;
  semester: "Ganjil" | "Genap";
  karakteristikSiswa: "Pemula" | "Sedang" | "Lanjutan";
}

export interface VideoSceneItem {
  sceneNomor: number;
  judulScene: string;
  visual: string;
  narasi: string;
  dialog?: string;
  gerakan: string;
  teksLayar: string;
  durasiDetik: number;
  promptAiVideo: string;
}

export interface VideoConfig {
  durasiTotalDetik: number;
  orientasi: "16:9" | "9:16";
  gaya: "Animasi 3D" | "Kartun Edukasi" | "Realistis Sinematik" | "Motion Graphic";
  jumlahScene: number;
  narator: "Guru PAI" | "Siswa SMP" | "AI Voice Islami";
  bahasa: string;
  scenes: VideoSceneItem[];
}

export interface MatchingPair {
  id: string;
  kiri: string; // e.g. Nama Malaikat
  kanan: string; // e.g. Tugas Malaikat
  kategori?: string;
}

export interface GameEdukasiData {
  jenisGame: "Matching" | "Tebak Gambar" | "Pilihan Ganda" | "Benar/Salah" | "Word Search" | "Puzzle";
  judulGame: string;
  instruksi: string;
  level: "Mudah" | "Sedang" | "Sulit";
  skorMaksimal: number;
  feedbackBenar: string;
  feedbackSalah: string;
  matchingPairs: MatchingPair[];
  tebakItems?: {
    petunjuk: string;
    jawaban: string;
    pilihan: string[];
    gambarPlaceholder?: string;
  }[];
  trueFalseItems?: {
    pernyataan: string;
    isTrue: boolean;
    penjelasan: string;
  }[];
}

export interface GambarAiConfig {
  objekUtama: string;
  lokasi: string;
  materi: string;
  gaya: "3D Animation" | "Watercolor Painting" | "Photorealistic" | "Islamic Flat Art";
  suasana: string;
  rasio: "16:9" | "1:1" | "9:16";
  elemen: string[];
  promptLengkap: string;
  negativePrompt: string;
}

export interface AiImageCard {
  id: string;
  title: string;
  subtitle: string;
  kataKunci: string;
  materiPokok: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "3:4";
  artStyle: "3d_modern" | "infografis_hd" | "fotorealistis" | "cat_air";
  timestamp: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface SoalKuisAi {
  nomor: number;
  tingkat: "Mudah" | "Sedang" | "Sulit";
  pertanyaan: string;
  pilihan: string[]; // A, B, C, D
  jawabanBenar: number; // 0=A, 1=B, 2=C, 3=D
  pembahasan: string;
  skor: number;
}

export interface SlidePptItem {
  nomorSlide: number;
  judulSlide: string;
  subJudul?: string;
  poinKonten: string[];
  catatanPresenter: string;
  layoutVisual: "Title" | "TwoColumns" | "BulletPoints" | "Quote/Dalil" | "Summary";
}

export interface LkpdAiData {
  judulLkpd: string;
  petunjukBelajar: string[];
  stimulusKasus: string;
  pertanyaanAktivitas: string[];
  tugasKelompok: string;
  rubrikPenilaian: {
    kriteria: string;
    skorMaksimal: number;
    deskripsi: string;
  }[];
}

export interface RefleksiAiData {
  pertanyaanRefleksi: string[];
  kutipanHikmah: string;
  ajakanAksiNyata: string;
}

export interface PilihanMediaAi {
  materiTeks: boolean;
  gambarAi?: boolean;
  videoAi: boolean;
  animasi: boolean;
  ppt: boolean;
  infografis: boolean;
  komik: boolean;
  flashcard: boolean;
  audio: boolean;
  gameEdukasi: boolean;
  kuis: boolean;
  lkpd?: boolean;
}

export interface BahanAjarAiItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isPublished?: boolean;
  targetKelas?: string;
  
  // 12 BAGIAN UTAMA YANG DIISI GURU & DIKELOLA AI
  // 1. Identitas Pembelajaran
  identitas: BahanAjarAiIdentitas;

  // 2. Tujuan Pembelajaran
  tujuanPembelajaran: string;

  // 3. Materi Pokok
  materiPokokJudul: string;
  materiPokokDeskripsi: string;
  dalilRujukan?: {
    sumber: string;
    arab: string;
    latin: string;
    arti: string;
  };

  // 4. Submateri
  submateri: string[];

  // 5. Kata Kunci Visual
  kataKunciVisual: string[];

  // 6. Contoh Kehidupan Sehari-hari
  contohKehidupan: string[];

  // 7. Media yang Diinginkan
  mediaPilihan: PilihanMediaAi;

  // 8. Format Video Pembelajaran
  videoData: VideoConfig;

  // 9. Game Edukasi
  gameData: GameEdukasiData;

  // 10. Generator Gambar (Opsional)
  gambarData?: GambarAiConfig;

  // 11. Latihan / Kuis & Evaluasi
  kuisData: {
    jumlahSoal: number;
    soalList: SoalKuisAi[];
  };

  // 12. Refleksi & PPT
  pptData: SlidePptItem[];
  lkpdData?: LkpdAiData;
  refleksiData: RefleksiAiData;
}

export interface SiswaBahanAjarProgressItem {
  bahanAjarId: string;
  siswaNisn: string;
  siswaNama?: string;
  kelasId?: string;
  quizScore?: number;
  quizCompleted?: boolean;
  gameScore?: number;
  gameCompleted?: boolean;
  lkpdJawaban?: string;
  lkpdCompleted?: boolean;
  refleksiJawaban?: Record<number, string>;
  refleksiCompleted?: boolean;
  status: "Belum Dikerjakan" | "Sedang Dikerjakan" | "Selesai Dikerjakan";
  updatedAt: string;
}
