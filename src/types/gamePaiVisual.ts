/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// TIPE DATA GAME EDUKASI VISUAL AI PAI SMP
// ==========================================

export type GameVisualType =
  | "QUIZ_ADVENTURE"
  | "MATCH_DISCOVER"
  | "TEBAK_GAMBAR"
  | "SUSUN_KATA"
  | "MEMORY_CARD"
  | "RODA_KEBERUNTUNGAN"
  | "MISSION_CHALLENGE";

export type VisualStyle =
  | "3D educational animation"
  | "Cartoon education"
  | "Islamic educational illustration"
  | "Flat illustration"
  | "Modern classroom"
  | "Semi-realistic educational";

export interface GameCharacter {
  id: string; // e.g. "CHAR_001"
  nama: string;
  avatarIcon: string; // emoji / icon identifier
  jenis: "Siswa Laki-laki" | "Siswa Perempuan" | "Guru Pembimbing" | "Penjelajah Cilik";
  deskripsi: string;
  pakaian: string;
  warnaUtama: string;
}

export interface GameVisualMeta {
  style: VisualStyle;
  aspectRatio: "16:9" | "1:1";
  character: GameCharacter;
  background: {
    namaTempat: string;
    tema: "Masjid" | "Sekolah" | "Perpustakaan Sejarah" | "Rumah Beradab" | "Alam Terbuka";
    deskripsi: string;
    warnaGradien: string;
  };
  imagePrompt: {
    subject: string;
    characters: string;
    environment: string;
    action: string;
    educationalContext: string;
    visualStyle: string;
    lighting: string;
    composition: string;
  };
}

// 1. GAME 1: QUIZ ADVENTURE
export interface QuizAdventureQuestion {
  id: string;
  level: 1 | 2 | 3 | 4;
  pertanyaan: string;
  visualPrompt: string;
  visualIcon: string;
  visualLabel: string;
  pilihan: [string, string, string, string];
  jawabanBenar: number; // 0, 1, 2, 3
  penjelasanEdukasi: string;
  petunjukHint: string;
  poin: number;
  koinBonus: number;
}

export interface GameQuizAdventureData {
  judul: string;
  deskripsi: string;
  karakter: GameCharacter;
  daftarSoal: QuizAdventureQuestion[];
  totalLevel: number;
}

// 2. GAME 2: MATCH & DISCOVER
export interface MatchDiscoverCard {
  id: string;
  kiri: {
    id: string;
    label: string;
    icon: string;
    kategori: string;
    color: string;
  };
  kanan: {
    id: string;
    label: string;
    makna: string;
    kategori: string;
    color: string;
  };
}

export interface GameMatchDiscoverData {
  judul: string;
  deskripsi: string;
  jenisPasangan: "Gambar ↔ Konsep" | "Istilah ↔ Pengertian" | "Ayat ↔ Arti" | "Tokoh ↔ Peran";
  pairs: MatchDiscoverCard[];
}

// 3. GAME 3: TEBAK GAMBAR PAI
export interface TebakGambarItem {
  id: string;
  judulVisual: string;
  ilustrasiSvg: string; // deskripsi / tag ilustrasi
  ilustrasiIcon: string;
  deskripsiAdegan: string;
  pertanyaan: string;
  pilihan: [string, string, string, string];
  jawabanBenar: number;
  petunjukHint: string;
  penjelasan: string;
}

export interface GameTebakGambarData {
  judul: string;
  deskripsi: string;
  daftarSoal: TebakGambarItem[];
}

// 4. GAME 4: SUSUN KATA (WORD SCRAMBLE)
export interface SusunKataItem {
  id: string;
  petunjukMateri: string;
  kataAsli: string; // misal "THAHARAH"
  hurufAcak: string[]; // ["H", "A", "T", "A", "R", "H", "A", "H"]
  artiKata: string;
  kategori: string;
}

export interface GameSusunKataData {
  judul: string;
  deskripsi: string;
  daftarKata: SusunKataItem[];
}

// 5. GAME 5: MEMORY CARD PAI
export interface MemoryCardPair {
  id: string;
  pairId: string;
  tipe: "KARTU_A" | "KARTU_B";
  teks: string;
  icon: string;
  subteks?: string;
  warna: string;
}

export interface GameMemoryCardData {
  judul: string;
  deskripsi: string;
  cards: MemoryCardPair[];
}

// 6. GAME 6: RODA KEBERUNTUNGAN (SPIN THE WHEEL)
export interface WheelSegment {
  id: string;
  label: string;
  kategori: "Pertanyaan" | "Tebak Gambar" | "Benar/Salah" | "Tantangan" | "Bonus Koin" | "Hafalan" | "Studi Kasus";
  warna: string;
  pertanyaan: string;
  opsi?: string[];
  kunci?: string;
  poin: number;
}

export interface GameRodaKeberuntunganData {
  judul: string;
  deskripsi: string;
  segments: WheelSegment[];
}

// 7. GAME 7: MISSION CHALLENGE
export interface MissionStage {
  stage: number;
  judulMisi: string;
  instruksi: string;
  tipeTantangan: "Pilihan Ganda" | "Pencocokan" | "Tebak Makna" | "Analisis Sikap";
  pertanyaan: string;
  opsi: string[];
  kunciJawaban: string;
  penjelasan: string;
  badgeHadiah: string;
  poinMisi: number;
}

export interface GameMissionChallengeData {
  judul: string;
  deskripsi: string;
  misiList: MissionStage[];
}

// ==========================================
// BUNDLE UTAMA GAME EDUKASI VISUAL PAI
// ==========================================
export interface VisualGameSuiteBundle {
  id: string;
  kelas: string;
  materi: string;
  subMateri: string;
  tingkatKesulitan: string;
  visualMeta: GameVisualMeta;

  // 7 Game Interaktif Lengkap
  game1QuizAdventure: GameQuizAdventureData;
  game2MatchDiscover: GameMatchDiscoverData;
  game3TebakGambar: GameTebakGambarData;
  game4SusunKata: GameSusunKataData;
  game5MemoryCard: GameMemoryCardData;
  game6RodaKeberuntungan: GameRodaKeberuntunganData;
  game7MissionChallenge: GameMissionChallengeData;
}
