/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// TIPE DATA & STRUKTUR BAHAN AJAR AI PAI SMP
// ==========================================

export type KelasTingkatSmp = "7" | "8" | "9";

export type KategoriPai = 
  | "Al-Qur'an dan Hadis"
  | "Akidah"
  | "Akhlak"
  | "Fikih"
  | "Sejarah Peradaban Islam";

export type TingkatKesulitan = "Mudah" | "Sedang" | "Sulit" | "Campuran";

export type GayaPembelajaran = 
  | "Interaktif"
  | "Cerita"
  | "Animasi"
  | "Diskusi"
  | "Kontekstual"
  | "Permainan";

export type DurasiVideo = "1 menit" | "3 menit" | "5 menit" | "10 menit";

export type JumlahSoalCbt = 10 | 15 | 20 | 25 | 30;

export type JenisBahanAjar = 
  | "MATERI"
  | "VIDEO"
  | "GAME_QUIZ"
  | "GAME_MATCH"
  | "TTS"
  | "LKPD"
  | "CBT";

// 1. STRUKTUR KURIKULUM FLEKSIBEL
export interface SubMateriItem {
  id: string;
  judul: string;
  deskripsiSingkat?: string;
  semester?: "1" | "2";
  alokasiWaktu?: string;
}

export interface MateriPokokItem {
  id: string;
  kategori: KategoriPai;
  judulMateri: string;
  subMateriList: SubMateriItem[];
}

export interface KurikulumKelasItem {
  kelas: KelasTingkatSmp;
  materiList: MateriPokokItem[];
}

// 2. PRODUK 1: MATERI PEMBELAJARAN
export interface MateriDalil {
  sumber: string; // e.g. "QS. Al-Hujurat [49]: 13"
  teksArab: string;
  terjemahan: string;
  penjelasanDalil: string;
}

export interface HadisDalil {
  perawi: string; // e.g. "HR. Bukhari dan Muslim"
  status: "Sahih" | "Hasan";
  teksArab?: string;
  terjemahan: string;
  penjelasan: string;
}

export interface ProdukMateri {
  judul: string;
  tujuanPembelajaran: string[];
  kompetensi: string[];
  apersepsi: string;
  pengantar: string;
  materiInti: string;
  penjelasanKonsep: string[];
  dalilQuran?: MateriDalil;
  hadis?: HadisDalil;
  contohKehidupanSehariHari: string[];
  hikmah: string[];
  rangkuman: string[];
  refleksi: string;
  pertanyaanPemantik: string[];
}

// 3. PRODUK 2: VIDEO PEMBELAJARAN
export interface VideoScene {
  scene: number;
  durasiDetik: number;
  visual: string;
  narasi: string;
  dialog?: string;
  teksLayar: string;
  audioNarator: string;
  promptGambarAi: string;
  promptVideoAi: string;
}

export interface ProdukVideo {
  judulVideo: string;
  tujuanVideo: string;
  durasiTotal: string;
  gayaVideo: string;
  narasiPembuka: string;
  storyboard: VideoScene[];
  kesimpulan: string;
  scriptLengkap: string;
}

// 4. PRODUK 3: GAME EDUKASI
// Game 1: Quiz Challenge
export interface QuizChallengeSoal {
  nomor: number;
  pertanyaan: string;
  pilihan: [string, string, string, string];
  jawabanBenar: number; // 0, 1, 2, 3
  penjelasan: string;
  poin: number;
}

export interface ProdukGameQuiz {
  judul: string;
  instruksi: string;
  waktuPerSoalDetik: number;
  soalList: QuizChallengeSoal[];
}

// Game 2: Match & Word
export interface MatchPair {
  id: string;
  kiri: string;   // Istilah / Ayat / Tokoh / Konsep
  kanan: string;  // Pengertian / Terjemahan / Peran / Contoh
  kategori: string;
}

export interface ProdukGameMatch {
  judul: string;
  instruksi: string;
  jenisPasangan: "Istilah ↔ Pengertian" | "Ayat ↔ Terjemahan" | "Tokoh ↔ Peran" | "Konsep ↔ Contoh";
  pairs: MatchPair[];
  level: number;
  waktuBatasDetik: number;
}

// 5. PRODUK 4: TEKA-TEKI SILANG (TTS)
export interface TtsClueItem {
  nomor: number;
  arah: "mendatar" | "menurun";
  pertanyaan: string;
  jawaban: string; // HURUF KAPITAL tanpa spasi
  row: number; // Baris awal pada grid 0..N
  col: number; // Kolom awal pada grid 0..N
}

export interface TtsGridCell {
  row: number;
  col: number;
  hurufBenar: string; // Empty or character
  nomor?: number;
  isBlocked: boolean; // True jika sel hitam/kosong
}

export interface ProdukTts {
  judul: string;
  petunjukMendatar: TtsClueItem[];
  petunjukMenurun: TtsClueItem[];
  dimensi: { baris: number; kolom: number };
  grid: TtsGridCell[][];
}

// 6. PRODUK 5: LKPD
export interface AktivitasLkpd {
  nomor: number;
  judulAktivitas: string;
  tipe: "Pemahaman Konsep" | "Analisis" | "Diskusi Kelompok" | "Studi Kasus Kehidupan" | "Refleksi";
  instruksi: string;
  pertanyaan: string[];
  ruangJawabanTersedia: boolean;
}

export interface ProdukLkpd {
  identitas: {
    mataPelajaran: string;
    kelas: string;
    materi: string;
    subMateri: string;
    alokasiWaktu: string;
  };
  tujuanPembelajaran: string[];
  petunjukPengerjaan: string[];
  apersepsi: string;
  materiSingkat: string;
  aktivitasList: AktivitasLkpd[];
  kesimpulan: string;
  evaluasi: string[];
}

// 7. PRODUK 6: CBT / UJIAN ONLINE
export interface SoalCbt {
  nomor: number;
  pertanyaan: string;
  pilihan: [string, string, string, string];
  kunciJawaban: "A" | "B" | "C" | "D";
  pembahasan: string;
  indikator: string;
  tingkatKesulitan: "Mudah" | "Sedang" | "Sulit";
}

export interface ProdukCbt {
  judulUjian: string;
  kelas: string;
  materi: string;
  subMateri: string;
  durasiMenit: number;
  totalSoal: number;
  kkm: number;
  daftarSoal: SoalCbt[];
}

// ==========================================
// KUMPULAN LENGKAP HASIL GENERASI AI
// ==========================================
export interface BahanAjarAiCompleteBundle {
  id: string;
  tanggalDibuat: string;
  guruNama: string;
  kelas: KelasTingkatSmp;
  materi: string;
  subMateri: string;
  tingkatKesulitan: TingkatKesulitan;
  jumlahSoal: JumlahSoalCbt;
  durasiVideo: DurasiVideo;
  gayaPembelajaran: GayaPembelajaran;
  status: "Draft" | "Tersimpan" | "Dipublikasikan";

  // 6 Produk Terintegrasi
  materiPembelajaran: ProdukMateri;
  video: ProdukVideo;
  gameQuiz: ProdukGameQuiz;
  gameMatch: ProdukGameMatch;
  tts: ProdukTts;
  lkpd: ProdukLkpd;
  cbt: ProdukCbt;
}

// ==========================================
// HASIL SISWA (CBT & GAME)
// ==========================================
export interface HasilCbtSiswa {
  id: string;
  cbtId: string;
  cbtJudul: string;
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  tanggalUjian: string;
  nilai: number; // 0 - 100
  jumlahBenar: number;
  jumlahSalah: number;
  persentase: number;
  durasiPengerjaanDetik: number;
  jawabanSiswa: Record<number, "A" | "B" | "C" | "D">;
  statusLulus: boolean;
}

export interface HasilGameSiswa {
  id: string;
  gameId: string;
  gameTipe: "QUIZ_CHALLENGE" | "MATCH_AND_WORD" | "TTS";
  gameJudul: string;
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  skor: number;
  waktuDetik: number;
  persentaseBenar: number;
  tanggalMain: string;
}
