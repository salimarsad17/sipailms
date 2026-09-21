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
  kategori: "CP_ATP" | "Modul Ajar" | "Media Pembelajaran" | "KKTP" | "PROTA" | "PROMES";
  judul: string;
  bab: string;
  deskripsi: string;
  fileSize: string;
  downloadUrl: string;
  mediaType?: "PDF" | "PPT" | "Word" | "Excel" | "Video" | "Canva";
  kelas?: string; // e.g., "Kelas VII", "Kelas VIII"
  semester?: string; // e.g., "1", "2"
  fileData?: string; // Data URL (data:application/pdf;base64,...)
  fileName?: string; // Original uploaded file name
  textContent?: string; // Parsed HTML or text content for Word/Text
  parsedSheets?: {
    name: string;
    data: string[][];
    html?: string;
    colCount?: number;
    rowCount?: number;
  }[]; // Parsed Excel sheets
  uploadedAt?: string;
}

export interface ProtaItem {
  id: string;
  kelas: "VII" | "VIII" | "IX";
  semester: "1" | "2";
  noUrut: number;
  bab: string;
  elemen: "Al-Qur'an dan Hadis" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah Peradaban Islam";
  tujuanPembelajaran: string;
  alokasiWaktuJp: number;
  keterangan?: string;
}

export interface PromesItem {
  id: string;
  kelas: "VII" | "VIII" | "IX";
  semester: "1" | "2";
  noUrut: number;
  bab: string;
  elemen: "Al-Qur'an dan Hadis" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah Peradaban Islam";
  materiPokok: string;
  tujuanPembelajaran: string;
  alokasiWaktuJp: number;
  // Key format e.g. "Juli_1": 3, "Juli_2": 3
  jadwalMingguan: Record<string, number | string>;
  keterangan?: string;
}

export interface BahanAjarItem {
  id: string;
  judul: string;
  kelas: "VII" | "VIII" | "IX" | "Semua";
  semester: "1" | "2" | "Semua";
  bab?: string;
  kategori: "Buku Teks" | "Diktat / Modul" | "Slide / PPT" | "LKPD" | "Video / Media" | "Ringkasan";
  elemenCP: "Al-Qur'an dan Hadis" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah Peradaban Islam" | "Umum";
  deskripsi: string;
  fileSize?: string;
  mediaType?: "PDF" | "PPT" | "Word" | "Excel" | "Video" | "Canva" | "Web";
  downloadUrl?: string;
  textContent?: string;
  author?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface JurnalMengajar {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelasId: string;
  jamKe: string; // e.g., "1-2"
  materiPokok: string;
  kegiatanKbm?: string; // Kegiatan KBM / Pembelajaran di kelas
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
  uhList: number[]; // 10 scores for UH 1 .. 10
  tList?: number[]; // 5 scores for Tugas (T 1 .. 5)
  uhDates?: string[]; // 10 dates for UH 1..10 (YYYY-MM-DD)
  tDates?: string[]; // 5 dates for T 1..5 (YYYY-MM-DD)
  pts: number;
  ptsDate?: string; // date for PTS (YYYY-MM-DD)
  pas: number;
  pasDate?: string; // date for PAS (YYYY-MM-DD)
  kkm: number;
  isDeleted?: boolean;
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

export interface LKPDItem {
  id: string;
  judul: string;
  kelasId: string;
  semester: string;
  babJudul: string;
  elemen: "Al-Qur'an Hadis" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah Peradaban Islam";
  alokasiWaktu: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  petunjukKerja: string[];
  stimulusBacaan: {
    judul: string;
    teks: string;
    dalilNaqli?: {
      teksArab: string;
      terjemahan: string;
      sumber: string;
    };
  };
  aktivitasMandiri: {
    pertanyaanHots: string[];
  };
  aktivitasKelompok: {
    judulTugas: string;
    instruksi: string;
    pertanyaanDiskusi: string[];
  };
  soalPilihanGanda: SoalPilihanGanda[];
  refleksiKarakter: string[];
  rubrikPenilaian: {
    aspek: string;
    skor4: string;
    skor3: string;
    skor2: string;
  }[];
  tanggalDibuat: string;
}

export interface BerkasLKPDItem {
  id: string;
  namaBerkas: string;
  judulLkpd: string;
  tipeFile: "pdf" | "docx" | "doc" | "xlsx" | "xls" | "pptx" | "image" | "text" | "other";
  ukuran: string; // e.g. "1.4 MB"
  tanggalUpload: string;
  babId: string;
  babJudul: string;
  kelasId: string; // "VII" | "VIII" | "IX"
  semester: string; // "1" | "2"
  kategori?: string; // "Diskusi Kelompok" | "Praktik Ibadah" | "Diferensiasi" | "Mandiri & Refleksi" | "Asesmen Formatif"
  keterangan?: string;
  fileDataUrl?: string; // Data URL for preview & download
  textContent?: string; // Plain text or parsed content
  parsedHtml?: string; // DOCX Mammoth converted HTML
  statusLms?: "Diterbitkan" | "Draft";
  uploadedBy?: string;
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
  lkpdData?: LKPDItem;
  berkasLkpdList?: BerkasLKPDItem[];
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

export interface JadwalPelajaranItem {
  id: string;
  no: number;
  jam: string;
  hariTanggal: string;
  ket: string;
  kelasId?: string;
  mapel?: string;
  ruang?: string;
  guru?: string;
}


