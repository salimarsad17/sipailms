/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DataSekolah {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  akreditasi: string;
  namaKepsek: string;
  nipKepsek: string;
}

export interface Guru {
  nip: string;
  nama: string;
  sertifikasi: string;
  kontak: string;
  isWaliKelas: boolean;
  waliKelasDi: string; // e.g., "VII-A"
}

export interface Kelas {
  id: string; // e.g., "VII-A"
  nama: string;
  waliKelasNip: string;
  waliKelasNama: string;
  kuota: number;
  totalSiswa: number;
}

export interface Siswa {
  nisn: string;
  nama: string;
  gender: "Laki-laki" | "Perempuan";
  agama: string;
  statusKeaktifan: "Aktif" | "Tidak Aktif";
  kelasId: string;
  kontakOrangTua?: string;
  catatanKhusus?: string;
}

export interface PerangkatAjar {
  id: string;
  kategori: "CP_ATP" | "Modul Ajar" | "Media Pembelajaran" | "KKTP";
  judul: string;
  bab: string;
  deskripsi: string;
  fileSize: string;
  downloadUrl: string;
  mediaType?: "PDF" | "PPT" | "Word" | "Excel" | "Video" | "Canva";
  kelas?: string; // e.g., "Kelas VII", "Kelas VIII"
  semester?: string; // e.g., "1", "2"
}

export interface JurnalMengajar {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelasId: string;
  jamKe: string; // e.g., "1-2"
  materiPokok: string;
  kehadiranHadir: number;
  kehadiranIzin: number;
  kehadiranSakit: number;
  kehadiranAlpa: number;
  catatanKejadian: string;
}

export interface CatatanSikapSiswa {
  id: string;
  tanggal: string; // YYYY-MM-DD
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  kategoriSikap: "Spiritual" | "Sosial";
  jenisSikap: "Positif" | "Perbaikan";
  deskripsiKejadian: string;
  tindakLanjut: string;
}

export interface TugasLms {
  id: string;
  kelasId: string;
  judul: string;
  bab: string;
  deskripsi: string;
  deadline: string; // YYYY-MM-DD HH:mm
  filePendukung?: string;
}

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  tugasJudul: string;
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  tanggalKumpul: string;
  tipePengumpulan: "Teks" | "File" | "Audio";
  kontenTeks: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string; // e.g., "01:24" for setoran hafalan
  nilai?: number; // null/undefined if not graded yet
  komentarGuru?: string;
}

export interface JurnalIbadahHarian {
  siswaNisn: string;
  tanggal: string; // YYYY-MM-DD
  sholatSubuh: boolean;
  sholatDzuhur: boolean;
  sholatAshar: boolean;
  sholatMaghrib: boolean;
  sholatIsya: boolean;
  sholatDhuha: boolean;
  membacaAlQuranAyat: number; // number of verses
  membacaAlQuranSurah: string; // surah name e.g. "An-Naba'"
  membantuOrangTua: boolean;
  catatanKebaikan: string;
}

export interface NilaiKhususPai {
  siswaNisn: string;
  surahJuzAmma: string; // e.g. "An-Nas", "Al-Falaq"
  kelancaran: "Lancar" | "Sedang" | "Kurang Lancar";
  tajwid: "Sangat Baik" | "Baik" | "Perlu Bimbingan";
  nilaiPraktikIbadah: {
    wudhu: number; // 0-100
    sholat: number; // 0-100
    tayamum?: number; // 0-100
  };
}

export interface RekapNilaiTotal {
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  formatifKuis: number;
  formatifTugas: number;
  formatifDiskusi: number;
  sumatifPts: number;
  sumatifPas: number;
  hafalanJuzAmmaScore: number; // custom mapping or score
  praktikSholat: number;
  praktikWudhu: number;
}

export interface NilaiSemesterParalel {
  id: string;
  siswaNisn: string;
  siswaNama: string;
  kelasParalel: string; // "7A", "7B", "7C", "7D", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D"
  semester: "1" | "2";
  mapel: string;
  uhList: number[]; // 12 scores for UH/T 1 .. 12
  uhDates?: string[]; // 12 dates for UH 1..12 (YYYY-MM-DD)
  pts: number;
  ptsDate?: string; // date for PTS (YYYY-MM-DD)
  pas: number;
  pasDate?: string; // date for PAS (YYYY-MM-DD)
  kkm: number;
}

export interface DokumenBab {
  judul: string;
  size: string;
}

export interface VideoBab {
  judul: string;
  duration: string;
  source: string;
}

export interface SoalPilihanGanda {
  id: string;
  pertanyaan: string;
  pilihan: string[]; // e.g. ["A", "B", "C", "D"]
  jawabanBenar: string; // e.g. "A", "B", "C", "D"
  pembahasan?: string;
  tingkatKesulitan?: "Mudah" | "Sedang" | "HOTS";
  kategori?: string;
}

export interface RekapPertemuanMurid {
  id: string;
  hariTanggal: string; // e.g., "Senin, 02 Feb 2026"
  pertemuanKe: string; // e.g., "Ke-1", "Ke-2", "Pertemuan 1"
  siswaNisn: string;
  siswaNama: string;
  kelasId: string;
  topikMasalah: string; // Topik atau Masalah yang dibahas
  tindakLanjut: string;
  keterangan: string; // Ket
}

export interface BabPelajaran {
  id: string; // e.g. "bab1", "bab2", "bab3"
  key: string; // e.g. "bab1", "bab2", "bab3"
  judul: string;
  deskripsi: string;
  dokumen: DokumenBab[];
  video: VideoBab;
  kelasId?: string; // e.g. "VII", "VIII", "IX"
  soalList?: SoalPilihanGanda[];
}

export interface FotoKegiatan {
  id: string;
  judul: string;
  tanggal: string;
  kelasId: string;
  kategori: string;
  deskripsi: string;
  fotoUrl: string;
}

export interface UserAccount {
  id: string;
  role: "guru" | "siswa";
  identifier: string; // NIP untuk guru, NISN untuk siswa
  password: string; // Kata sandi
  nama: string;
  kelasId?: string; // ID Kelas (misal VII-A) untuk siswa atau kelas binaan guru
  gender?: "Laki-laki" | "Perempuan";
  kontak?: string;
  registeredAt: string;
}


