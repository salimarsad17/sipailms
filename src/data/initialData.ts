/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Guru,
  Kelas,
  Siswa,
  PerangkatAjar,
  JurnalMengajar,
  CatatanSikapSiswa,
  TugasLms,
  PengumpulanTugas,
  JurnalIbadahHarian,
  NilaiKhususPai,
  RekapNilaiTotal,
  NilaiSemesterParalel,
  BabPelajaran,
  RekapPertemuanMurid,
  DataSekolah,
  UserAccount,
  BahanAjarItem,
  JadwalPelajaranItem,
  BerkasLKPDItem,
  ProtaItem,
  PromesItem
} from "../types";
import { BahanAjarAiItem, SiswaBahanAjarProgressItem } from "../types/bahanAjarAi";
import { PRESET_BAHAN_AJAR_AI_LIST } from "./bahanAjarAiPresets";
import {
  defaultProtaList,
  defaultPromesList,
  defaultProtaPromesPerangkatAjar
} from "./protaPromesData";

// Key definitions for LocalStorage
const STORAGE_KEYS = {
  GURU: "pai_lms_guru_data",
  SEKOLAH: "pai_lms_sekolah_data",
  KELAS: "pai_lms_kelas_data",
  SISWA: "pai_lms_siswa_data",
  PERANGKAT: "pai_lms_perangkat_data",
  BAHAN_AJAR: "pai_lms_bahan_ajar_data",
  BAHAN_AJAR_AI_ITEMS: "pai_lms_bahan_ajar_ai_items",
  BAHAN_AJAR_AI_ACTIVE: "sipailms_bahan_ajar_ai_active",
  SISWA_BAHAN_AJAR_PROGRESS: "pai_lms_siswa_bahan_ajar_progress",
  JURNAL_GURU: "pai_lms_jurnal_guru_data",
  CATATAN_SIKAP: "pai_lms_catatan_sikap_data",
  TUGAS: "pai_lms_tugas_data",
  PENGUMPULAN: "pai_lms_pengumpulan_data",
  IBADAH: "pai_lms_ibadah_data",
  NILAI_KHUSUS: "pai_lms_nilai_khusus_data",
  REKAP_NILAI: "pai_lms_rekap_nilai_data",
  NILAI_PARALEL: "pai_lms_nilai_paralel_data",
  BAB_PELAJARAN: "pai_lms_bab_pelajaran_data",
  PERTEMUAN_MURID: "pai_lms_pertemuan_murid_data",
  ACCOUNTS: "pai_lms_accounts_data",
  JADWAL: "pai_lms_jadwal_pelajaran_data",
  BERKAS_LKPD: "pai_lms_berkas_lkpd_data",
  PROTA: "pai_lms_prota_data",
  PROMES: "pai_lms_promes_data"
};

const defaultAccounts: UserAccount[] = [
  {
    id: "acc-guru-default",
    role: "guru",
    identifier: "197909172014071004",
    password: "123",
    nama: "Sadiqul Alim, S.Pd.I., M.Pd.",
    kontak: "+62 812-7345-6789",
    kelasId: "VII-A",
    registeredAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "acc-siswa-default",
    role: "siswa",
    identifier: "0098765432",
    password: "123",
    nama: "Farhan Maulana",
    kelasId: "VII-A",
    gender: "Laki-laki",
    kontak: "0812-7382-9901",
    registeredAt: "2026-01-01T00:00:00.000Z"
  }
];

// Raw initial data definitions
const defaultSekolah: DataSekolah = {
  namaSekolah: "UPT SMP Negeri 2 Rebang Tangkas",
  npsn: "10806892",
  alamat: "Jl. Lintas Rebang Tangkas, Rebang Tangkas, Kabupaten Way Kanan, Lampung 34791",
  akreditasi: "A (Unggul)",
  namaKepsek: "Drs. H. Mulyadi, M.M.",
  nipKepsek: "19700318 199503 1 002"
};

const defaultGuru: Guru = {
  nip: "197909172014071004",
  nama: "Sadiqul Alim, S.Pd.I., M.Pd.",
  sertifikasi: "Sertifikasi Pendidik Profesional Kemenag RI",
  kontak: "+62 812-7345-6789",
  isWaliKelas: true,
  waliKelasDi: "VII-A"
};

const defaultKelas: Kelas[] = [
  { id: "VII-A", nama: "Kelas VII-A", waliKelasNip: "197909172014071004", waliKelasNama: "Sadiqul Alim, S.Pd.I., M.Pd.", kuota: 32, totalSiswa: 6 },
  { id: "VII-B", nama: "Kelas VII-B", waliKelasNip: "198505142014022002", waliKelasNama: "Dra. Nurhayati", kuota: 32, totalSiswa: 5 },
  { id: "VIII-A", nama: "Kelas VIII-A", waliKelasNip: "197808202008011003", waliKelasNama: "Umar Hamdan, S.Ag.", kuota: 32, totalSiswa: 4 },
  { id: "VIII-B", nama: "Kelas VIII-B", waliKelasNip: "198110022010032001", waliKelasNama: "Siti Rahmah, S.Pd.", kuota: 32, totalSiswa: 4 }
];

const defaultSiswa: Siswa[] = [
  // A
  { nisn: "0081122336", nama: "Aditya Pratama", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-A", kontakOrangTua: "0852-7788-9900", catatanKhusus: "Muazin mushola sekolah." },
  { nisn: "0081122334", nama: "Ahmad Fauzi", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-A", kontakOrangTua: "0813-4433-2211", catatanKhusus: "Ketua kelas VIII-A, kepemimpinan baik." },
  { nisn: "0092233445", nama: "Annisa Rahmawati", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0852-1100-3344", catatanKhusus: "Pengurus Remaja Masjid sekolah." },
  { nisn: "0097711221", nama: "Aris Munandar", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "7C", kontakOrangTua: "0812-9900-1122" },
  // B
  { nisn: "0097722331", nama: "Bambang Kurniawan", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "7D", kontakOrangTua: "0821-3344-5566" },
  { nisn: "0095551213", nama: "Budi Santoso", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-B", kontakOrangTua: "0812-3344-5566", catatanKhusus: "Bakat dalam kaligrafi Arab." },
  // C
  { nisn: "0097722332", nama: "Cinta Laura", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "7D", kontakOrangTua: "0852-5566-7788" },
  // D
  { nisn: "0082233441", nama: "Dafa Ramadhan", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-B", kontakOrangTua: "0813-2233-4455", catatanKhusus: "" },
  { nisn: "0082233444", nama: "Dewi Safitri", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-B", kontakOrangTua: "0812-5566-7788", catatanKhusus: "Suka membantu kawan dalam kelompok belajar." },
  { nisn: "0095551215", nama: "Dian Permata", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-B", kontakOrangTua: "0853-2211-0099", catatanKhusus: "Aktif berdiskusi di kelas." },
  { nisn: "0087733441", nama: "Dimas Anggara", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "8C", kontakOrangTua: "0812-6677-8899" },
  // E
  { nisn: "0087733442", nama: "Eka Rahmawati", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "8C", kontakOrangTua: "0813-7788-9900" },
  // F
  { nisn: "0098765432", nama: "Farhan Maulana", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0812-7382-9901", catatanKhusus: "Juara 1 Musabaqah Tilawatil Qur'an (MTQ) Sekolah, hafal Juz 30." },
  { nisn: "0095551214", nama: "Fatimah Azzahra", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-B", kontakOrangTua: "0813-8877-6655", catatanKhusus: "Lancar membaca Al-Qur'an tartil." },
  { nisn: "0087744551", nama: "Fikri Haikal", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "8D", kontakOrangTua: "0821-8899-0011" },
  // G
  { nisn: "0087744552", nama: "Gita Gutawa", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "8D", kontakOrangTua: "0852-9900-1122" },
  // H
  { nisn: "0077755661", nama: "Hafiz Ridwan", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9A", kontakOrangTua: "0812-1122-3344" },
  { nisn: "0082233443", nama: "Hendri Irawan", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-B", kontakOrangTua: "0852-4455-6677", catatanKhusus: "" },
  // I
  { nisn: "0077755662", nama: "Indah Permatasari", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9A", kontakOrangTua: "0813-2233-4455" },
  // J
  { nisn: "0077766771", nama: "Joko Widodo", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9B", kontakOrangTua: "0821-3344-5566" },
  // K
  { nisn: "0077766772", nama: "Kartika Sari", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9B", kontakOrangTua: "0852-4455-6677" },
  { nisn: "0095551216", nama: "Kiki Amalia", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-B", kontakOrangTua: "0812-6677-8899", catatanKhusus: "" },
  // L
  { nisn: "0096677889", nama: "Lailatul Qomariyah", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0813-5544-3322", catatanKhusus: "Sering membantu merapikan perlengkapan ibadah mushola." },
  { nisn: "0077777881", nama: "Lukman Hakim", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9C", kontakOrangTua: "0812-5566-7788" },
  // M
  { nisn: "0077777882", nama: "Maya Sofa", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9C", kontakOrangTua: "0813-6677-8899" },
  { nisn: "0093456789", nama: "Muhammad Rizky", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0821-9988-7711", catatanKhusus: "Sangat aktif dalam kegiatan shalat berjamaah di mushola." },
  // N
  { nisn: "0081122335", nama: "Nabila Fitriani", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-A", kontakOrangTua: "0821-6655-4433", catatanKhusus: "" },
  { nisn: "0077788991", nama: "Naufal Samudra", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9D", kontakOrangTua: "0821-7788-9900" },
  // O
  { nisn: "0077788992", nama: "Oktavia Ramadhani", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "9D", kontakOrangTua: "0852-8899-0011" },
  // P
  { nisn: "0081122337", nama: "Putri Lestari", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-A", kontakOrangTua: "0812-0011-2233", catatanKhusus: "Sangat rapi dalam mencatat pelajaran PAI." },
  // R
  { nisn: "0095551212", nama: "Rian Hidayat", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-B", kontakOrangTua: "0822-1122-3344", catatanKhusus: "Perlu perhatian dalam pengumpulan tugas LMS Tepat waktu." },
  // S
  { nisn: "0082233442", nama: "Sania Mirza", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VIII-B", kontakOrangTua: "0821-3344-5566", catatanKhusus: "Juara olimpiade PAI tingkat kabupaten." },
  { nisn: "0091234567", nama: "Siti Aisyah", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0813-6821-4432", catatanKhusus: "Memerlukan bimbingan hafalan Surah Al-Fajr." },
  // T
  { nisn: "0097711222", nama: "Tania Putri", gender: "Perempuan", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "7C", kontakOrangTua: "0813-1122-3344" },
  // Z
  { nisn: "0094455667", nama: "Zikri Al-Ghifari", gender: "Laki-laki", agama: "Islam", statusKeaktifan: "Aktif", kelasId: "VII-A", kontakOrangTua: "0812-9090-1234", catatanKhusus: "Duduk di barisan depan (pemberitahuan orangtua: kacamata minus)." }
];

const defaultPertemuanMurid: RekapPertemuanMurid[] = [
  {
    id: "pm-1",
    hariTanggal: "Senin, 19 Jan 2026",
    pertemuanKe: "Pertemuan 1",
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasId: "VII-A",
    topikMasalah: "Pembinaan Hafalan Surah Al-Waqi'ah & Persiapan Lomba MTQ",
    tindakLanjut: "Dijadwalkan latihan makhraj tiap Rabu sore setelah shalat Dzuhur",
    keterangan: "Selesai (Progres Sangat Baik)"
  },
  {
    id: "pm-2",
    hariTanggal: "Kamis, 22 Jan 2026",
    pertemuanKe: "Pertemuan 1",
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasId: "VII-A",
    topikMasalah: "Peningkatan Kelancaran Hukum Tajwid Mad Thabi'i dan Izhar",
    tindakLanjut: "Pemberian tugas simak hafalan bersama teman sebaya",
    keterangan: "Dalam Proses Pendampingan"
  },
  {
    id: "pm-3",
    hariTanggal: "Selasa, 27 Jan 2026",
    pertemuanKe: "Pertemuan 2",
    siswaNisn: "0093456789",
    siswaNama: "Muhammad Rizky",
    kelasId: "VII-A",
    topikMasalah: "Motivasi Kepemimpinan Petugas Azan Mushola & Kedisiplinan Shalat",
    tindakLanjut: "Koordinasi dengan pembina Remaja Masjid sekolah",
    keterangan: "Selesai (Aktif Menjadi Muazin)"
  },
  {
    id: "pm-4",
    hariTanggal: "Jumat, 30 Jan 2026",
    pertemuanKe: "Pertemuan 1",
    siswaNisn: "0095551212",
    siswaNama: "Rian Hidayat",
    kelasId: "VII-B",
    topikMasalah: "Konsultasi Kedisiplinan Pengumpulan Tugas LMS PAI Tepat Waktu",
    tindakLanjut: "Menghubungi orangtua via WhatsApp untuk pemantauan jam belajar di rumah",
    keterangan: "Tindak Lanjut Orangtua"
  }
];

const defaultPerangkatAjar: PerangkatAjar[] = [
  {
    id: "pa-1",
    kategori: "CP_ATP",
    judul: "CP & ATP PAI Kelas VII Fase D Kurikulum Merdeka",
    bab: "Dokumen Induk",
    deskripsi: "Capaian Pembelajaran and Alur Tujuan Pembelajaran resmi PAI & Budi Pekerti SMP Kelas 7.",
    fileSize: "1.2 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-2",
    kategori: "Modul Ajar",
    judul: "Modul Ajar Bab 1: Menghadirkan Islam Damai Melalui Thaharah",
    bab: "Bab 1: Thaharah",
    deskripsi: "Rencana Pelaksanaan Pembelajaran (RPP Plus) mencakup ketentuan wudhu, tayamum, mandi wajib.",
    fileSize: "2.4 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-3",
    kategori: "Modul Ajar",
    judul: "Modul Ajar Bab 2: Meneladani Perilaku Amanah dan Jujur",
    bab: "Bab 2: Akhlak",
    deskripsi: "Modul ajar interaktif dengan studi kasus perilaku amanah kepada Allah SWT, sesama, dan diri sendiri.",
    fileSize: "1.8 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-4",
    kategori: "Media Pembelajaran",
    judul: "PPT - Tata Cara Thaharah dari Hadas Kecil dan Hadas Besar",
    bab: "Bab 1: Thaharah",
    deskripsi: "Slide presentasi visual menarik berisi dalil naqli, jenis najis, dan tata cara mensucikannya.",
    fileSize: "4.5 MB",
    downloadUrl: "#",
    mediaType: "PPT",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-5",
    kategori: "Media Pembelajaran",
    judul: "Link Video Animasi: Sejarah Berdirinya Daulah Umayyah",
    bab: "Bab 3: Sejarah Peradaban",
    deskripsi: "Video animasi YouTube mengenai sejarah Daulah Umayyah di Damaskus, khalifah berprestasi dan peninggalan budaya.",
    fileSize: "Link Eksternal",
    downloadUrl: "https://www.youtube.com/watch?v=vV-G7lA7kX0",
    mediaType: "Video",
    kelas: "VII",
    semester: "2"
  },
  {
    id: "pa-6",
    kategori: "KKTP",
    judul: "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Semester Ganjil",
    bab: "Administrasi",
    deskripsi: "Dokumen interval kriteria ketercapaian bagi penilaian formatif dan sumatif kelas VII.",
    fileSize: "850 KB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-6-word",
    kategori: "Modul Ajar",
    judul: "Format Word (.docx) RPP & LKPD PAI Bab 1 Thaharah",
    bab: "Bab 1: Thaharah",
    deskripsi: "Template dokumen Microsoft Word (.docx) dapat diedit berisi instrumen RPP, LKPD, dan lembar kerja kelompok PAI.",
    fileSize: "1.1 MB",
    downloadUrl: "#",
    mediaType: "Word",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-6-excel",
    kategori: "KKTP",
    judul: "Format Excel (.xlsx) Matriks Penilaian & Rekap Hasil Belajar PAI",
    bab: "Administrasi",
    deskripsi: "Spreadsheet Microsoft Excel (.xlsx) lengkap dengan formula otomatis rekap nilai formatif, sumatif, dan interval KKTP PAI.",
    fileSize: "620 KB",
    downloadUrl: "#",
    mediaType: "Excel",
    kelas: "VII",
    semester: "1"
  },
  {
    id: "pa-7",
    kategori: "CP_ATP",
    judul: "CP & ATP PAI Kelas VIII Fase D Kurikulum Merdeka",
    bab: "Dokumen Induk",
    deskripsi: "Capaian Pembelajaran dan Alur Tujuan Pembelajaran resmi PAI & Budi Pekerti SMP Kelas 8.",
    fileSize: "1.3 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VIII",
    semester: "1"
  },
  {
    id: "pa-8",
    kategori: "Modul Ajar",
    judul: "Modul Ajar Bab 1: Menghindari Minuman Keras, Judi, dan Pertengkaran",
    bab: "Bab 1: Akhlak & Sosial",
    deskripsi: "Modul ajar PAI Kelas VIII mengenai bahaya minuman keras, perjudian, dan pertengkaran.",
    fileSize: "2.1 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VIII",
    semester: "1"
  },
  {
    id: "pa-9",
    kategori: "Media Pembelajaran",
    judul: "PPT - Menghindari Miras, Judi, dan Pertengkaran",
    bab: "Bab 1: Akhlak & Sosial",
    deskripsi: "Materi presentasi PowerPoint tentang dampak negatif miras, judi, dan pertengkaran.",
    fileSize: "3.2 MB",
    downloadUrl: "#",
    mediaType: "PPT",
    kelas: "VIII",
    semester: "1"
  },
  {
    id: "pa-10",
    kategori: "KKTP",
    judul: "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Semester Genap Kelas VII",
    bab: "Administrasi",
    deskripsi: "Kriteria penilaian ketercapaian tujuan pembelajaran semester genap untuk kelas VII.",
    fileSize: "780 KB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "2"
  },
  {
    id: "pa-11",
    kategori: "Modul Ajar",
    judul: "Modul Ajar Bab 4: Indahnya Kebersamaan dengan Berjamaah",
    bab: "Bab 4: Shalat Berjamaah",
    deskripsi: "Modul ajar semester genap yang membahas keutamaan shalat berjamaah dan tata caranya.",
    fileSize: "1.9 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "2"
  },
  ...defaultProtaPromesPerangkatAjar
];

const defaultBahanAjar: BahanAjarItem[] = [
  {
    id: "ba-buku-siswa-7",
    judul: "Buku Siswa PAI & Budi Pekerti Kelas VII (Kurikulum Merdeka)",
    kelas: "VII",
    semester: "Semua",
    kategori: "Buku Teks",
    elemenCP: "Umum",
    deskripsi: "Buku teks resmi peserta didik PAI dan Budi Pekerti Kelas VII SMP Kemendikbudristek (BSKAP No. 032/H/KR/2024). Memuat 10 Bab komprehensif Semester 1 dan 2.",
    fileSize: "14.8 MB",
    mediaType: "PDF",
    downloadUrl: "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-vii",
    author: "Kemendikbudristek RI",
    isCustom: false,
    createdAt: "2026-01-10"
  },
  {
    id: "ba-buku-guru-7",
    judul: "Buku Panduan Guru PAI & Budi Pekerti Kelas VII",
    kelas: "VII",
    semester: "Semua",
    kategori: "Buku Teks",
    elemenCP: "Umum",
    deskripsi: "Panduan resmi guru dalam menyusun skenario pembelajaran, strategi diferensiasi, asesmen diagnostik, formatif, dan sumatif Kurikulum Merdeka Fase D.",
    fileSize: "12.4 MB",
    mediaType: "PDF",
    downloadUrl: "https://buku.kemdikbud.go.id/katalog/buku-panduan-guru-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-vii",
    author: "Pusat Perbukuan Kemendikbudristek",
    isCustom: false,
    createdAt: "2026-01-10"
  },
  {
    id: "ba-buku-siswa-8",
    judul: "Buku Siswa PAI & Budi Pekerti Kelas VIII (Kurikulum Merdeka)",
    kelas: "VIII",
    semester: "Semua",
    kategori: "Buku Teks",
    elemenCP: "Umum",
    deskripsi: "Buku teks resmi peserta didik PAI dan Budi Pekerti Kelas VIII SMP memuat materi toleransi ayat Al-Hujurat 13, iman kitab Allah, cinta Rasul, fardhu kifayah jenazah, hingga kekhalifahan Daulah Abbasiyah & Usmani.",
    fileSize: "16.2 MB",
    mediaType: "PDF",
    downloadUrl: "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-viii",
    author: "Kemendikbudristek RI",
    isCustom: false,
    createdAt: "2026-01-10"
  },
  {
    id: "ba-buku-siswa-9",
    judul: "Buku Siswa PAI & Budi Pekerti Kelas IX (Kurikulum Merdeka)",
    kelas: "IX",
    semester: "Semua",
    kategori: "Buku Teks",
    elemenCP: "Umum",
    deskripsi: "Buku teks utama peserta didik PAI dan Budi Pekerti Kelas IX SMP Fase D yang memuat 10 bab pembelajaran lengkap: hukum bacaan mad/waqaf, iman hari akhir, etika pergaulan, zakat & wakaf, hingga sejarah Islam di Nusantara.",
    fileSize: "18.5 MB",
    mediaType: "PDF",
    downloadUrl: "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-ix",
    author: "Kemendikbudristek RI",
    isCustom: false,
    createdAt: "2026-01-10"
  },
  {
    id: "ba-ppt-bab1-7",
    judul: "Slide Presentasi Bab 1: Al-Qur'an dan Sunnah Sebagai Pedoman Hidup",
    kelas: "VII",
    semester: "1",
    bab: "Bab 1",
    kategori: "Slide / PPT",
    elemenCP: "Al-Qur'an dan Hadis",
    deskripsi: "Slide interaktif Canva/PowerPoint materi Q.S. Al-Anbiya/21: 30 dan Q.S. Al-A'raf/7: 54 tentang penciptaan alam semesta dan hukum bacaan Gunnah.",
    fileSize: "5.4 MB",
    mediaType: "Canva",
    downloadUrl: "https://www.canva.com/design",
    author: "MGMP PAI SMP",
    isCustom: false,
    createdAt: "2026-01-12"
  },
  {
    id: "ba-ppt-bab2-7",
    judul: "Slide Pembelajaran Bab 2: Meneladani Nama dan Sifat Allah (Asmaul Husna)",
    kelas: "VII",
    semester: "1",
    bab: "Bab 2",
    kategori: "Slide / PPT",
    elemenCP: "Akidah",
    deskripsi: "Media tayang visual meneladani 4 Asmaul Husna: Al-Alim, Al-Khabir, As-Sami', dan Al-Bashir dalam mewujudkan karakter pelajar berakhlak mulia.",
    fileSize: "4.2 MB",
    mediaType: "PPT",
    downloadUrl: "",
    author: "Sadiqul Alim, S.Pd.I., M.Pd.",
    isCustom: false,
    createdAt: "2026-01-15"
  },
  {
    id: "ba-diktat-bab3-7",
    judul: "Diktat & Ringkasan Bab 3: Menghadirkan Salat dan Zikir dalam Kehidupan",
    kelas: "VII",
    semester: "1",
    bab: "Bab 3",
    kategori: "Diktat / Modul",
    elemenCP: "Fiqih",
    deskripsi: "Modul pembelajaran ringkas tata cara salat gerhana, istisqa, dan jenazah beserta zikir penyejuk hati pencegah perbuatan keji dan munkar.",
    fileSize: "2.1 MB",
    mediaType: "PDF",
    downloadUrl: "",
    author: "Sadiqul Alim, S.Pd.I., M.Pd.",
    isCustom: false,
    createdAt: "2026-01-18"
  },
  {
    id: "ba-lkpd-bab4-7",
    judul: "LKPD Interaktif: Mengagungkan Allah dengan Sujud Syukur, Sahwi, & Tilawah",
    kelas: "VII",
    semester: "1",
    bab: "Bab 4",
    kategori: "LKPD",
    elemenCP: "Fiqih",
    deskripsi: "Lembar Kerja Peserta Didik untuk kegiatan kelompok studi kasus sebab-sebab pelaksanaan sujud sahwi, sujud tilawah, dan sujud syukur.",
    fileSize: "1.8 MB",
    mediaType: "PDF",
    downloadUrl: "",
    author: "Sadiqul Alim, S.Pd.I., M.Pd.",
    isCustom: false,
    createdAt: "2026-01-20"
  },
  {
    id: "ba-video-umayyah",
    judul: "Video Edukasi: Sejarah & Kemegahan Peradaban Bani Umayyah di Damaskus",
    kelas: "VII",
    semester: "1",
    bab: "Bab 5",
    kategori: "Video / Media",
    elemenCP: "Sejarah Peradaban Islam",
    deskripsi: "Video animasi sejarah berdirinya Daulah Bani Umayyah di Damaskus, tokoh ilmuwan muslim, dan jejak kemajuan ilmu pengetahuan Islam.",
    fileSize: "Video Stream",
    mediaType: "Video",
    downloadUrl: "https://www.youtube.com/watch?v=vV-G7lA7kX0",
    author: "Pustaka Edukasi Islam",
    isCustom: false,
    createdAt: "2026-01-22"
  },
  {
    id: "ba-ppt-bab6-7",
    judul: "Slide Presentasi Bab 6: Menghindari Gibah dan Menumbuhkan Sikap Tabayyun",
    kelas: "VII",
    semester: "2",
    bab: "Bab 6",
    kategori: "Slide / PPT",
    elemenCP: "Al-Qur'an dan Hadis",
    deskripsi: "Presentasi materi analisis Q.S. Al-Hujurat/49: 12 dan tajwid bacaan mad tabi'i, bahaya hoaks di media sosial dan pentingnya tabayyun.",
    fileSize: "6.1 MB",
    mediaType: "Canva",
    downloadUrl: "https://www.canva.com/design",
    author: "Sadiqul Alim, S.Pd.I., M.Pd.",
    isCustom: false,
    createdAt: "2026-02-01"
  },
  {
    id: "ba-modul-bab4-9",
    judul: "Modul Lengkap Bab 4: Ketentuan Penyembelihan Hewan, Ibadah Kurban, dan Akikah",
    kelas: "IX",
    semester: "1",
    bab: "Bab 4",
    kategori: "Diktat / Modul",
    elemenCP: "Fiqih",
    deskripsi: "Bahan ajar lengkap buku teks resmi memuat 3 poin esensial: Ketentuan kurban & akikah, syarat rukun tata cara penyembelihan berprinsip ihsan, serta hikmah kurban & akikah disertai kuis interaktif formatif.",
    fileSize: "4.2 MB",
    mediaType: "PDF",
    downloadUrl: "#",
    author: "Sadiqul Alim, S.Pd.I., M.Pd.",
    isCustom: false,
    createdAt: "2026-02-15"
  }
];

const defaultJurnalMengajar: JurnalMengajar[] = [
  {
    id: "jm-1",
    tanggal: "2026-07-13",
    kelasId: "VII-A",
    jamKe: "1-2",
    materiPokok: "Bab 1: Ketentuan bersuci dari hadas kecil dan hadas besar (Thaharah)",
    kegiatanKbm: "Tadarus surah pendek, apersepsi konsep bersuci, demonstrasi tata cara tayamum dan praktik wudhu berkelompok, dilanjutkan telaah dalil dan refleksi KBM.",
    kehadiranHadir: 28,
    kehadiranIzin: 2,
    kehadiranSakit: 1,
    kehadiranAlpa: 1,
    catatanKejadian: "Siswa sangat antusias melakukan demonstrasi tayamum dengan debu bersih di kaca jendela. Farhan Maulana mendemonstrasikan dengan sangat tertib."
  },
  {
    id: "jm-2",
    tanggal: "2026-07-09",
    kelasId: "VII-B",
    jamKe: "3-4",
    materiPokok: "Bab 1: Teori Thaharah dan pembagian macam-macam najis",
    kegiatanKbm: "Pembiasaan doa belajar, penayangan video animasi macam najis, diskusi kelompok diferensiasi najis mukhaffafah, mutawassithah, dan mughalladhah, serta asesmen formatif LKPD.",
    kehadiranHadir: 29,
    kehadiranIzin: 0,
    kehadiranSakit: 1,
    kehadiranAlpa: 0,
    catatanKejadian: "Dua orang siswa (Rian Hidayat & teman sebangku) sempat gaduh saat video animasi diputar. Sudah diberikan teguran persuasif."
  },
  {
    id: "jm-3",
    tanggal: "2026-07-08",
    kelasId: "VIII-A",
    jamKe: "1-2",
    materiPokok: "Bab 1: Menghindari Minuman Keras, Judi, dan Pertengkaran",
    kegiatanKbm: "Kajian dalil Q.S. Al-Ma'idah ayat 90-91, diskusi kelompok studi kasus dampak negatif miras dan judi online, presentasi perwakilan kelompok, serta penegasan komitmen akhlak terpuji.",
    kehadiranHadir: 31,
    kehadiranIzin: 0,
    kehadiranSakit: 0,
    kehadiranAlpa: 0,
    catatanKejadian: "Siswa berdiskusi kelompok dengan tertib mengenai dampak buruk judi online dan miras bagi kesehatan fisik maupun sosial."
  }
];

const defaultCatatanSikap: CatatanSikapSiswa[] = [
  {
    id: "cs-1",
    tanggal: "2026-07-13",
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasId: "VII-A",
    kategoriSikap: "Spiritual",
    jenisSikap: "Positif",
    deskripsiKejadian: "Menunjukkan sikap kepemimpinan yang luar biasa dan sangat ikhlas ketika memimpin doa bersama sebelum pelaksanaan Sholat Dzuhur berjamaah di mushola sekolah.",
    tindakLanjut: "Diberikan apresiasi langsung di depan siswa lain dan ditambahkan poin catatan positif sikap spiritual."
  },
  {
    id: "cs-2",
    tanggal: "2026-07-09",
    siswaNisn: "0095551212",
    siswaNama: "Rian Hidayat",
    kelasId: "VII-B",
    kategoriSikap: "Sosial",
    jenisSikap: "Perbaikan",
    deskripsiKejadian: "Mengganggu temannya dengan menyembunyikan sandal kawan ketika wudhu sholat dzuhur berjamaah, menyebabkan kegaduhan kecil di tempat wudhu.",
    tindakLanjut: "Dipanggil secara persuasif setelah shalat, diberikan nasihat tentang adab di tempat ibadah, dan yang bersangkutan sudah meminta maaf kepada temannya."
  }
];

const defaultTugas: TugasLms[] = [
  {
    id: "tugas-1",
    kelasId: "VII-A",
    judul: "Setoran Hafalan Surah Ad-Duha",
    bab: "Juz Amma / Hafalan",
    deskripsi: "Silakan kumpulkan setoran hafalan Surah Ad-Duha secara tartil. Perhatikan makharijul huruf dan tajwid panjang pendeknya dengan seksama. Anda boleh mengunggah berkas audio rekaman suara langsung atau mengetikkan teks keterangan kesiapan.",
    deadline: "2026-07-20 23:59",
    filePendukung: "Kertas Panduan Ad-Duha.pdf"
  },
  {
    id: "tugas-2",
    kelasId: "VII-A",
    judul: "Latihan Soal Ketentuan Thaharah",
    bab: "Bab 1: Thaharah",
    deskripsi: "Tuliskan jawaban Anda mengenai perbedaan najis mukhaffafah, mutawassitah, dan mugalladah! Berikan masing-masing 2 contoh benda najisnya dan jelaskan langkah-langkah mensucikan masing-masing jenis najis tersebut.",
    deadline: "2026-07-18 18:00",
    filePendukung: "Rangkuman_Najis_PAI_VII.pdf"
  },
  {
    id: "tugas-3",
    kelasId: "VII-A",
    judul: "Praktik Gerakan Wudhu dan Doanya",
    bab: "Bab 1: Thaharah",
    deskripsi: "Unggah rekaman video singkat (durasi maks 3 menit) atau kumpulan foto kolase yang memperlihatkan urutan rukun gerakan wudhu Anda secara tertib mulai dari membasuh muka hingga membasuh kaki, diakhiri doa sesudah wudhu.",
    deadline: "2026-07-25 12:00"
  },
  {
    id: "tugas-4",
    kelasId: "VII-B",
    judul: "Latihan Akhlak Jujur & Amanah",
    bab: "Bab 2: Akhlak",
    deskripsi: "Berikan masing-masing 3 contoh konkret penerapan sikap jujur dan amanah di lingkungan UPT SMPN 2 Rebang Tangkas dalam kehidupan sehari-hari.",
    deadline: "2026-07-19 15:00"
  }
];

const defaultPengumpulan: PengumpulanTugas[] = [
  {
    id: "p-1",
    tugasId: "tugas-2",
    tugasJudul: "Latihan Soal Ketentuan Thaharah",
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasId: "VII-A",
    tanggalKumpul: "2026-07-12 20:15",
    tipePengumpulan: "Teks",
    kontenTeks: "Jawaban Tugas Thaharah Farhan Maulana:\n1. Najis Mukhaffafah (Ringan): Contohnya air kencing bayi laki-laki kurang dari 2 tahun yang belum makan apa-apa selain ASI. Mensucikannya cukup dengan memercikkan air bersih ke bagian yang terkena najis.\n2. Najis Mutawassitah (Sedang): Contohnya darah, nanah, tinja, air kencing dewasa. Mensucikannya dengan membasuhnya menggunakan air mengalir sampai hilang warna, bau, dan rasanya.\n3. Najis Mugalladah (Berat): Contohnya air liur anjing/babi. Mensucikannya wajib dibasuh 7 kali dengan air bersih dan salah satunya wajib dicampur dengan tanah/debu yang suci.",
    nilai: 92,
    komentarGuru: "Alhamdulillah luar biasa Farhan! Jawabannya sangat tepat, rinci, dan rapi sekali. Pertahankan prestasimu!"
  },
  {
    id: "p-2",
    tugasId: "tugas-1",
    tugasJudul: "Setoran Hafalan Surah Ad-Duha",
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasId: "VII-A",
    tanggalKumpul: "2026-07-13 06:40",
    tipePengumpulan: "Audio",
    kontenTeks: "Assalamualaikum Wr Wb pak guru, ini setoran rekaman suara hafalan surah Ad-Duha saya, Siti Aisyah kelas VII-A. Mohon bimbingan dan nilainya nggih pak.",
    fileName: "farhan_adduha_setoran.mp3",
    fileSize: "2.8 MB",
    audioDuration: "01:15",
    // Not graded yet! Ready for live demo grading
    nilai: undefined,
    komentarGuru: ""
  },
  {
    id: "p-3",
    tugasId: "tugas-2",
    tugasJudul: "Latihan Soal Ketentuan Thaharah",
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasId: "VII-A",
    tanggalKumpul: "2026-07-11 14:22",
    tipePengumpulan: "File",
    kontenTeks: "Saya mengunggah berkas foto lembar folio pengerjaan saya pak.",
    fileName: "SitiAisyah_TugasThaharah.jpg",
    fileSize: "1.5 MB",
    nilai: 88,
    komentarGuru: "Tulisan rapi, uraian tata cara mensucikan najis berat sangat jelas."
  },
  {
    id: "p-vsum-1",
    tugasId: "ringkasan-video-bab1",
    tugasJudul: "Ringkasan Video: Video Panduan Tata Cara Wudhu & Tayamum (Bab 1)",
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasId: "VII-A",
    tanggalKumpul: "2026-07-13 09:15",
    tipePengumpulan: "Teks",
    kontenTeks: "📌 [RANGKUMAN INTISARI VIDEO]:\nVideo menjelaskan secara runtut tata cara berwudhu dan tayamum sesuai sunnah Rasulullah SAW. Wudhu diawali niat dan membasuh tangan, berkumur, istinsyaq, membasuh wajah, membasuh tangan hingga siku, mengusap sebagian kepala, telinga, dan membasuh kaki hingga mata kaki secara tertib dan tuma'ninah.\n\n💡 [HIKMAH & PELAJARAN]:\nKebersihan dan kesucian adalah syarat mutlak ibadah diterima. Bersuci menumbuhkan rasa rendah hati dan kesiapan jiwa menghadap Allah SWT.\n\n🎯 [PENERAPAN SEHARI-HARI]:\nSaya berkomitmen untuk tidak terburu-buru saat berwudhu, menyempurnakan basuhan anggota wudhu, dan berhemat air.",
    nilai: 95,
    komentarGuru: "Alhamdulillah ringkasan yang sangat komprehensif, Farhan! Intisari dan komitmen penerapannya sangat menyentuh. Teruskan istiqomah."
  },
  {
    id: "p-vsum-2",
    tugasId: "ringkasan-video-bab1",
    tugasJudul: "Ringkasan Video: Video Panduan Tata Cara Wudhu & Tayamum (Bab 1)",
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasId: "VII-A",
    tanggalKumpul: "2026-07-14 10:30",
    tipePengumpulan: "Teks",
    kontenTeks: "📌 [RANGKUMAN INTISARI VIDEO]:\nPenjelasan video sangat jelas mengenai rukun dan sunnah wudhu. Juga diajarkan bahwa tayamum adalah rukhsah (keringanan) saat tidak ada air atau sakit dengan menggunakan debu yang suci.\n\n💡 [HIKMAH & PELAJARAN]:\nIslam tidak pernah memberatkan umatnya. Selalu ada solusi beribadah dalam setiap keadaan.\n\n🎯 [PENERAPAN SEHARI-HARI]:\nMengamalkan doa setelah wudhu dan menjaga wudhu sebelum membaca Al-Qur'an.",
    nilai: undefined,
    komentarGuru: ""
  }
];

const defaultIbadah: JurnalIbadahHarian[] = [
  {
    siswaNisn: "0098765432",
    tanggal: "2026-07-13",
    sholatSubuh: true,
    sholatDzuhur: true,
    sholatAshar: true,
    sholatMaghrib: true,
    sholatIsya: true,
    sholatDhuha: true,
    membacaAlQuranAyat: 10,
    membacaAlQuranSurah: "An-Naba' Ayat 1-10",
    membantuOrangTua: true,
    catatanKebaikan: "Membantu ibu merapikan tempat tidur dan menyapu mushola rumah."
  },
  {
    siswaNisn: "0098765432",
    tanggal: "2026-07-12",
    sholatSubuh: true,
    sholatDzuhur: true,
    sholatAshar: true,
    sholatMaghrib: true,
    sholatIsya: true,
    sholatDhuha: false,
    membacaAlQuranAyat: 5,
    membacaAlQuranSurah: "Al-Mulk Ayat 1-5",
    membantuOrangTua: true,
    catatanKebaikan: "Membantu menyiram bunga di halaman rumah dan mencuci piring makan sendiri."
  },
  {
    siswaNisn: "0091234567",
    tanggal: "2026-07-13",
    sholatSubuh: true,
    sholatDzuhur: true,
    sholatAshar: true,
    sholatMaghrib: true,
    sholatIsya: true,
    sholatDhuha: true,
    membacaAlQuranAyat: 15,
    membacaAlQuranSurah: "Yasin Ayat 1-15",
    membantuOrangTua: true,
    catatanKebaikan: "Membantu menyiapkan sarapan pagi bersama ibu di dapur."
  }
];

const defaultNilaiKhusus: NilaiKhususPai[] = [
  {
    siswaNisn: "0098765432", // Farhan Maulana
    surahJuzAmma: "An-Naba'",
    kelancaran: "Lancar",
    tajwid: "Sangat Baik",
    nilaiPraktikIbadah: {
      wudhu: 95,
      sholat: 94
    }
  },
  {
    siswaNisn: "0091234567", // Siti Aisyah
    surahJuzAmma: "An-Nazi'at",
    kelancaran: "Sedang",
    tajwid: "Baik",
    nilaiPraktikIbadah: {
      wudhu: 90,
      sholat: 91
    }
  },
  {
    siswaNisn: "0093456789", // Muhammad Rizky
    surahJuzAmma: "Abasa",
    kelancaran: "Kurang Lancar",
    tajwid: "Perlu Bimbingan",
    nilaiPraktikIbadah: {
      wudhu: 80,
      sholat: 85
    }
  },
  {
    siswaNisn: "0092233445", // Annisa Rahmawati
    surahJuzAmma: "At-Takwir",
    kelancaran: "Lancar",
    tajwid: "Sangat Baik",
    nilaiPraktikIbadah: {
      wudhu: 92,
      sholat: 93
    }
  },
  {
    siswaNisn: "0094455667", // Zikri Al-Ghifari
    surahJuzAmma: "Al-Infitar",
    kelancaran: "Lancar",
    tajwid: "Baik",
    nilaiPraktikIbadah: {
      wudhu: 85,
      sholat: 88
    }
  },
  {
    siswaNisn: "0096677889", // Lailatul Qomariyah
    surahJuzAmma: "Al-Mutaffifin",
    kelancaran: "Sedang",
    tajwid: "Baik",
    nilaiPraktikIbadah: {
      wudhu: 88,
      sholat: 90
    }
  }
];

const defaultRekapNilai: RekapNilaiTotal[] = [
  {
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasId: "VII-A",
    formatifKuis: 90,
    formatifTugas: 92,
    formatifDiskusi: 95,
    sumatifPts: 88,
    sumatifPas: 90,
    hafalanJuzAmmaScore: 94,
    praktikSholat: 94,
    praktikWudhu: 95
  },
  {
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasId: "VII-A",
    formatifKuis: 85,
    formatifTugas: 88,
    formatifDiskusi: 90,
    sumatifPts: 85,
    sumatifPas: 87,
    hafalanJuzAmmaScore: 88,
    praktikSholat: 91,
    praktikWudhu: 90
  },
  {
    siswaNisn: "0093456789",
    siswaNama: "Muhammad Rizky",
    kelasId: "VII-A",
    formatifKuis: 78,
    formatifTugas: 80,
    formatifDiskusi: 82,
    sumatifPts: 75,
    sumatifPas: 80,
    hafalanJuzAmmaScore: 72,
    praktikSholat: 85,
    praktikWudhu: 80
  },
  {
    siswaNisn: "0092233445",
    siswaNama: "Annisa Rahmawati",
    kelasId: "VII-A",
    formatifKuis: 88,
    formatifTugas: 90,
    formatifDiskusi: 92,
    sumatifPts: 84,
    sumatifPas: 89,
    hafalanJuzAmmaScore: 93,
    praktikSholat: 93,
    praktikWudhu: 92
  },
  {
    siswaNisn: "0094455667",
    siswaNama: "Zikri Al-Ghifari",
    kelasId: "VII-A",
    formatifKuis: 82,
    formatifTugas: 84,
    formatifDiskusi: 80,
    sumatifPts: 80,
    sumatifPas: 82,
    hafalanJuzAmmaScore: 86,
    praktikSholat: 88,
    praktikWudhu: 85
  },
  {
    siswaNisn: "0096677889",
    siswaNama: "Lailatul Qomariyah",
    kelasId: "VII-A",
    formatifKuis: 84,
    formatifTugas: 86,
    formatifDiskusi: 88,
    sumatifPts: 82,
    sumatifPas: 85,
    hafalanJuzAmmaScore: 88,
    praktikSholat: 90,
    praktikWudhu: 88
  }
];

const defaultBabPelajaran: BabPelajaran[] = [
  {
    id: "bab1",
    key: "bab1",
    judul: "Bab 1: Menghadirkan Islam Damai Melalui Thaharah",
    deskripsi: "Thaharah menurut bahasa berarti bersuci. Sedangkan menurut istilah syara', thaharah adalah mensucikan diri dari hadas kecil, hadas besar, serta najis yang menghalangi keabsahan shalat dan ibadah lainnya.",
    dokumen: [
      { judul: "Modul Lengkap Thaharah Kelas VII.pdf", size: "1.8 MB" },
      { judul: "Langkah-Langkah Wudhu & Tayamum Sesuai Sunnah.pdf", size: "980 KB" }
    ],
    video: {
      judul: "Video Panduan Tata Cara Wudhu & Tayamum",
      duration: "5 Menit 40 Detik",
      source: "Video Pembelajaran SMPN 2 Rebang Tangkas"
    },
    kelasId: "VII",
    soalList: [
      {
        id: "soal1_1",
        pertanyaan: "Menurut istilah syara', apakah yang dimaksud dengan Thaharah?",
        pilihan: [
          "Mandi bunga agar wangi dan segar",
          "Mensucikan diri dari hadas dan najis yang menghalangi keabsahan ibadah",
          "Mencuci tangan sebelum makan agar bersih dari kuman",
          "Berhias dengan pakaian paling indah sebelum ke masjid"
        ],
        jawabanBenar: "B"
      },
      {
        id: "soal1_2",
        pertanyaan: "Air yang suci dan mensucikan disebut juga sebagai air...",
        pilihan: [
          "Mutanajjis (terkena najis)",
          "Mustakmal (sudah dipakai)",
          "Mutlaq (tathir)",
          "Makruh"
        ],
        jawabanBenar: "C"
      },
      {
        id: "soal1_3",
        pertanyaan: "Apabila tidak menemukan air untuk berwudhu, maka bersuci diganti dengan tayamum menggunakan...",
        pilihan: [
          "Pasir pantai yang basah",
          "Dinding yang dicat bersih",
          "Debu yang suci dan bersih",
          "Minyak wangi"
        ],
        jawabanBenar: "C"
      }
    ]
  },
  {
    id: "bab2",
    key: "bab2",
    judul: "Bab 2: Meneladani Perilaku Amanah dan Jujur dalam Kehidupan",
    deskripsi: "Jujur adalah kesesuaian antara perkataan dan perbuatan yang sebenarnya. Sedangkan amanah adalah titipan yang harus disampaikan kepada yang berhak menerimanya, baik amanah kepada Allah SWT, sesama manusia, maupun diri sendiri.",
    dokumen: [
      { judul: "Materi Pengayaan Akhlak Amanah Jujur.pdf", size: "1.2 MB" }
    ],
    video: {
      judul: "Kisah Teladan Kejujuran Rasulullah SAW di Masa Muda",
      duration: "7 Menit 15 Detik",
      source: "Video Tarbiyah Anak Muslim"
    },
    kelasId: "VII",
    soalList: [
      {
        id: "soal2_1",
        pertanyaan: "Sifat amanah sangat penting dipelihara karena amanah memiliki arti...",
        pilihan: [
          "Dapat dipercaya dan menyampaikan hak titipan",
          "Pintar berceramah di depan umum",
          "Memiliki harta yang berlimpah",
          "Selalu menang dalam perdebatan"
        ],
        jawabanBenar: "A"
      },
      {
        id: "soal2_2",
        pertanyaan: "Di bawah ini yang merupakan contoh perilaku jujur di sekolah adalah...",
        pilihan: [
          "Membantu teman memberikan jawaban saat ujian nasional",
          "Mengerjakan soal ujian sendiri tanpa menyontek milik teman",
          "Mengambil uang kas kelas untuk jajan tetapi berjanji mengganti",
          "Pura-pura sakit agar diizinkan pulang cepat"
        ],
        jawabanBenar: "B"
      }
    ]
  },
  {
    id: "bab3",
    key: "bab3",
    judul: "Bab 3: Kegemilangan Daulah Umayyah di Damaskus",
    deskripsi: "Daulah Umayyah berdiri setelah runtuhnya masa Khulafaur Rasyidin. Dipimpin pertama kali oleh Muawiyah bin Abu Sufyan, dinasti ini memberikan banyak kontribusi bagi peradaban Islam termasuk administrasi negara, seni arsitektur, dan perluasan wilayah dakwah.",
    dokumen: [
      { judul: "Peta Konsep Silsilah Khalifah Bani Umayyah.pdf", size: "2.5 MB" }
    ],
    video: {
      judul: "Animasi Sejarah Daulah Umayyah Damaskus",
      duration: "10 Menit",
      source: "Sejarah Peradaban Islam Channel"
    },
    kelasId: "VIII",
    soalList: [
      {
        id: "soal3_1",
        pertanyaan: "Siapakah pendiri pertama Daulah Umayyah di Damaskus?",
        pilihan: [
          "Abdul Malik bin Marwan",
          "Muawiyah bin Abu Sufyan",
          "Umar bin Abdul Aziz",
          "Yazid bin Muawiyah"
        ],
        jawabanBenar: "B"
      }
    ]
  }
];

const sampleUhDates = [
  "2026-07-20", "2026-08-03", "2026-08-18", "2026-09-01", "2026-09-15",
  "2026-09-29", "2026-10-13", "2026-10-27", "2026-11-10", "2026-11-24"
];

const sampleTDates = [
  "2026-07-27", "2026-08-25", "2026-09-22", "2026-10-20", "2026-11-17"
];

const defaultNilaiSemesterParalel: NilaiSemesterParalel[] = [
  {
    id: "nil_0098765432_sem1_7A",
    siswaNisn: "0098765432",
    siswaNama: "Farhan Maulana",
    kelasParalel: "7A",
    semester: "1",
    mapel: "PAI dan Budi Pekerti",
    uhList: [85, 90, 88, 92, 95, 89, 90, 88, 94, 91],
    tList: [88, 92, 90, 93, 95],
    uhDates: [...sampleUhDates],
    tDates: [...sampleTDates],
    pts: 90,
    ptsDate: "2026-10-05",
    pas: 92,
    pasDate: "2026-12-15",
    kkm: 75
  },
  {
    id: "nil_0091234567_sem1_7A",
    siswaNisn: "0091234567",
    siswaNama: "Siti Aisyah",
    kelasParalel: "7A",
    semester: "1",
    mapel: "PAI dan Budi Pekerti",
    uhList: [72, 70, 74, 80, 78, 82, 68, 75, 76, 74],
    tList: [75, 78, 76, 80, 78],
    uhDates: [...sampleUhDates],
    tDates: [...sampleTDates],
    pts: 72,
    ptsDate: "2026-10-05",
    pas: 74,
    pasDate: "2026-12-15",
    kkm: 75
  },
  {
    id: "nil_0093456789_sem1_7A",
    siswaNisn: "0093456789",
    siswaNama: "Muhammad Rizky",
    kelasParalel: "7A",
    semester: "1",
    mapel: "PAI dan Budi Pekerti",
    uhList: [80, 82, 85, 88, 84, 86, 80, 83, 85, 82],
    tList: [82, 85, 86, 84, 88],
    uhDates: [...sampleUhDates],
    tDates: [...sampleTDates],
    pts: 84,
    ptsDate: "2026-10-05",
    pas: 86,
    pasDate: "2026-12-15",
    kkm: 75
  },
  {
    id: "nil_0095551212_sem1_7B",
    siswaNisn: "0095551212",
    siswaNama: "Rian Hidayat",
    kelasParalel: "7B",
    semester: "1",
    mapel: "PAI dan Budi Pekerti",
    uhList: [65, 70, 72, 68, 74, 70, 68, 72, 70, 73],
    tList: [70, 72, 68, 74, 72],
    uhDates: [...sampleUhDates],
    tDates: [...sampleTDates],
    pts: 68,
    ptsDate: "2026-10-05",
    pas: 70,
    pasDate: "2026-12-15",
    kkm: 75
  }
];

// Helper to safely load data from LocalStorage or initialize with defaults
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage`, e);
    return defaultValue;
  }
}

// Helper to safely save data to LocalStorage
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage`, e);
  }
}

export const defaultJadwalPelajaran: JadwalPelajaranItem[] = [
  {
    id: "jdw-1",
    no: 1,
    jam: "07:30 - 09:00 (Jam ke 1-2)",
    hariTanggal: "Senin, 13 Juli 2026",
    ket: "PAI & Budi Pekerti - Kelas VII-A (Materi: Bab 1 Thaharah & Praktek Wudhu di Mushola)",
    kelasId: "VII-A",
    mapel: "Pendidikan Agama Islam",
    ruang: "Mushola Al-Ikhlas",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-2",
    no: 2,
    jam: "09:15 - 10:45 (Jam ke 3-4)",
    hariTanggal: "Senin, 13 Juli 2026",
    ket: "PAI & Budi Pekerti - Kelas VII-B (Materi: Bab 2 Meneladani Sikap Jujur & Amanah)",
    kelasId: "VII-B",
    mapel: "Pendidikan Agama Islam",
    ruang: "Ruang Kelas VII-B",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-3",
    no: 3,
    jam: "10:45 - 12:15 (Jam ke 5-6)",
    hariTanggal: "Selasa, 14 Juli 2026",
    ket: "PAI & Budi Pekerti - Kelas VIII-A (Materi: Meneladani Kitab-Kitab Allah & Karakter Al-Qur'an)",
    kelasId: "VIII-A",
    mapel: "Pendidikan Agama Islam",
    ruang: "Ruang Kelas VIII-A",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-4",
    no: 4,
    jam: "07:30 - 09:00 (Jam ke 1-2)",
    hariTanggal: "Rabu, 15 Juli 2026",
    ket: "PAI & Budi Pekerti - Kelas VIII-B (Materi: Ibadah Shalat Gerhana, Istisqa & Khusyuk)",
    kelasId: "VIII-B",
    mapel: "Pendidikan Agama Islam",
    ruang: "Mushola Al-Ikhlas",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-5",
    no: 5,
    jam: "09:30 - 11:00 (Jam ke 4-5)",
    hariTanggal: "Kamis, 16 Juli 2026",
    ket: "Bimbingan Tahsin Al-Qur'an & Tajwid (Tartil & Makharijul Huruf) - Kelas VII-A",
    kelasId: "VII-A",
    mapel: "PAI & BTA",
    ruang: "Lab Keagamaan",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-6",
    no: 6,
    jam: "07:15 - 08:15 (Jam ke 1)",
    hariTanggal: "Jumat, 17 Juli 2026",
    ket: "Kultum Dhuha & Pembinaan Karakter Profil Pelajar Pancasila Beriman Bertaqwa - Semua Siswa",
    kelasId: "Semua",
    mapel: "Pembiasaan Karakter",
    ruang: "Lapangan Utama / Mushola",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  },
  {
    id: "jdw-7",
    no: 7,
    jam: "08:00 - 09:30 (Jam ke 2-3)",
    hariTanggal: "Sabtu, 18 Juli 2026",
    ket: "Ekstrakurikuler Keagamaan: Rohis & Seni Hadrah Shalawat - Siswa Peminat",
    kelasId: "Semua",
    mapel: "Ekstrakurikuler PAI",
    ruang: "Aula Sekolah UPT SMPN 2 RT",
    guru: "Sadiqul Alim, S.Pd.I., M.Pd."
  }
];

export const defaultBerkasLKPD: BerkasLKPDItem[] = [
  {
    id: "lkpd-doc-1",
    namaBerkas: "LKPD-PAI-Bab1-Praktik-Thaharah-Wudhu.docx",
    judulLkpd: "LKPD Praktik Thaharah, Tata Cara Wudhu & Tayamum Sempurna",
    tipeFile: "docx",
    ukuran: "1.4 MB",
    tanggalUpload: "2026-07-15",
    babId: "bab1",
    babJudul: "Bab 1: Menghadirkan Islam Damai Melalui Thaharah",
    kelasId: "VII",
    semester: "1",
    kategori: "Praktik Ibadah",
    keterangan: "Lembar kerja peserta didik untuk praktik wudhu, tayamum, dan identifikasi jenis hadas beserta cara mensucikannya.",
    statusLms: "Diterbitkan",
    uploadedBy: "Sadiqul Alim, S.Pd.I., M.Pd.",
    textContent: `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI
Satuan Pendidikan: UPT SMPN 2 Rebang Tangkas
Mata Pelajaran: Pendidikan Agama Islam & Budi Pekerti
Kelas / Semester: VII (Tujuh) / Ganjil
Materi Pokok: Thaharah (Bersuci dari Hadas dan Najis)

A. Capaian Pembelajaran:
Peserta didik memahami rukun dan tata cara bersuci (thaharah) dari hadas kecil dan besar, serta mampu mempraktikkan wudhu dan tayamum sesuai ketentuan syariat Islam.

B. Tujuan Pembelajaran:
1. Menjelaskan pengertian dan dalil naqli thaharah (QS. Al-Maidah: 6).
2. Membedakan macam-macam najis (Mukhaffafah, Mutawassithah, Mughalladhah) dan cara mensucikannya.
3. Mempraktikkan tata cara wudhu dan tayamum secara tertib dan benar.

C. Aktivitas Penyelidikan Kelompok:
Diskusikan dalam kelompokmu: Mengapa kebersihan lahiriah (thaharah) menjadi syarat mutlak sahnya shalat dan apa dampaknya bagi kesehatan sehari-hari?

D. Lembar Pengamatan Praktik:
1. Niat wudhu
2. Membasuh muka
3. Membasuh kedua tangan sampai siku
4. Mengusap sebagian kepala
5. Membasuh kedua kaki sampai mata kaki
6. Tertib & Doa sesudah wudhu.`
  },
  {
    id: "lkpd-doc-2",
    namaBerkas: "LKPD-PAI-Bab2-Meneladani-Asmaul-Husna.pdf",
    judulLkpd: "LKPD Studi Kasus & Refleksi: Meneladani Asmaul Husna dalam Kehidupan",
    tipeFile: "pdf",
    ukuran: "2.1 MB",
    tanggalUpload: "2026-08-02",
    babId: "bab2",
    babJudul: "Bab 2: Meneladani Nama dan Sifat Allah untuk Kebaikan Hidup",
    kelasId: "VII",
    semester: "1",
    kategori: "Diskusi Kelompok",
    keterangan: "Studi kasus aktual meneladani sifat Al-Alim, Al-Khabir, As-Sami', dan Al-Bashir di lingkungan sekolah dan keluarga.",
    statusLms: "Diterbitkan",
    uploadedBy: "Sadiqul Alim, S.Pd.I., M.Pd.",
    textContent: `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI
Topik: Asmaul Husna (Al-Alim, Al-Khabir, As-Sami', Al-Bashir)
SMPN 2 Rebang Tangkas - Kelas VII

Petunjuk Pengerjaan:
1. Bacalah stimulus kisah kejujuran seorang penggembala kambing di zaman Khalifah Umar bin Khattab.
2. Analisislah bagaimana kesadaran bahwa Allah Maha Melihat (Al-Bashir) dan Maha Mengetahui (Al-Alim) memengaruhi integritas seseorang.
3. Buatlah rencana aksi nyata penerapan 4 Asmaul Husna dalam buku jurnal harian.`
  },
  {
    id: "lkpd-doc-3",
    namaBerkas: "LKPD-PAI-Bab3-Shalat-Berjamaah-Zikir.docx",
    judulLkpd: "LKPD Asesmen Formatif: Hakikat Shalat Berjamaah dan Ketenangan Zikir",
    tipeFile: "docx",
    ukuran: "950 KB",
    tanggalUpload: "2026-08-20",
    babId: "bab3",
    babJudul: "Bab 3: Menghadirkan Shalat dan Zikir dalam Kehidupan",
    kelasId: "VII",
    semester: "1",
    kategori: "Asesmen Formatif",
    keterangan: "Instrumen penilaian formatif pemahaman ketentuan makmum masbuq, sujud sahwi, dan zikir ba'da shalat fardhu.",
    statusLms: "Diterbitkan",
    uploadedBy: "Sadiqul Alim, S.Pd.I., M.Pd."
  }
];

// Stateful service container to interact with data
export class DataService {
  static getGuru(): Guru {
    return loadFromStorage(STORAGE_KEYS.GURU, defaultGuru);
  }

  static saveGuru(data: Guru): void {
    saveToStorage(STORAGE_KEYS.GURU, data);
  }

  static getSekolah(): DataSekolah {
    return loadFromStorage(STORAGE_KEYS.SEKOLAH, defaultSekolah);
  }

  static saveSekolah(data: DataSekolah): void {
    saveToStorage(STORAGE_KEYS.SEKOLAH, data);
  }

  static getKelas(): Kelas[] {
    return loadFromStorage(STORAGE_KEYS.KELAS, defaultKelas);
  }

  static saveKelas(data: Kelas[]): void {
    saveToStorage(STORAGE_KEYS.KELAS, data);
  }

  static getSiswa(): Siswa[] {
    const list = loadFromStorage(STORAGE_KEYS.SISWA, defaultSiswa);
    const sanitized = list.map((s) => ({
      ...s,
      nisn: (s.nisn || "").replace(/[^0-9]/g, "")
    }));
    return [...sanitized].sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
  }

  static saveSiswa(data: Siswa[]): void {
    const sanitized = data.map((s) => ({
      ...s,
      nisn: (s.nisn || "").replace(/[^0-9]/g, "")
    }));
    const sorted = [...sanitized].sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
    saveToStorage(STORAGE_KEYS.SISWA, sorted);
  }

  static getPerangkatAjar(): PerangkatAjar[] {
    const list = loadFromStorage<PerangkatAjar[]>(STORAGE_KEYS.PERANGKAT, defaultPerangkatAjar);
    let updated = false;
    let mapped = list.map(item => {
      if (item.downloadUrl === "https://www.youtube.com/watch?v=mockUmayyah") {
        updated = true;
        return { ...item, downloadUrl: "https://www.youtube.com/watch?v=vV-G7lA7kX0" };
      }
      return item;
    });

    // Merge default PROTA & PROMES official documents if not yet present in existing storage
    const hasProta = mapped.some(item => item.kategori === "PROTA");
    if (!hasProta) {
      mapped = [...mapped, ...defaultProtaPromesPerangkatAjar];
      updated = true;
    }

    if (updated) {
      saveToStorage(STORAGE_KEYS.PERANGKAT, mapped);
    }
    return mapped;
  }

  static savePerangkatAjar(data: PerangkatAjar[]): void {
    saveToStorage(STORAGE_KEYS.PERANGKAT, data);
  }

  static getBahanAjar(): BahanAjarItem[] {
    return loadFromStorage<BahanAjarItem[]>(STORAGE_KEYS.BAHAN_AJAR, defaultBahanAjar);
  }

  static saveBahanAjar(data: BahanAjarItem[]): void {
    saveToStorage(STORAGE_KEYS.BAHAN_AJAR, data);
  }

  static getBahanAjarAiList(): BahanAjarAiItem[] {
    const list = loadFromStorage<BahanAjarAiItem[]>(STORAGE_KEYS.BAHAN_AJAR_AI_ITEMS, PRESET_BAHAN_AJAR_AI_LIST);
    const active = loadFromStorage<BahanAjarAiItem | null>(STORAGE_KEYS.BAHAN_AJAR_AI_ACTIVE, null);
    if (active) {
      const idx = list.findIndex((x) => x.id === active.id);
      if (idx >= 0) {
        list[idx] = active;
      } else {
        list.unshift(active);
      }
    }
    return list;
  }

  static saveBahanAjarAiList(data: BahanAjarAiItem[]): void {
    saveToStorage(STORAGE_KEYS.BAHAN_AJAR_AI_ITEMS, data);
  }

  static getActiveBahanAjarAi(): BahanAjarAiItem {
    const active = loadFromStorage<BahanAjarAiItem | null>(STORAGE_KEYS.BAHAN_AJAR_AI_ACTIVE, null);
    if (active) return active;
    const list = this.getBahanAjarAiList();
    return list[0] || PRESET_BAHAN_AJAR_AI_LIST[0];
  }

  static saveActiveBahanAjarAi(item: BahanAjarAiItem): void {
    saveToStorage(STORAGE_KEYS.BAHAN_AJAR_AI_ACTIVE, item);
    const currentList = loadFromStorage<BahanAjarAiItem[]>(STORAGE_KEYS.BAHAN_AJAR_AI_ITEMS, PRESET_BAHAN_AJAR_AI_LIST);
    const idx = currentList.findIndex((x) => x.id === item.id);
    let updated: BahanAjarAiItem[];
    if (idx >= 0) {
      updated = [...currentList];
      updated[idx] = item;
    } else {
      updated = [item, ...currentList];
    }
    saveToStorage(STORAGE_KEYS.BAHAN_AJAR_AI_ITEMS, updated);
  }

  static getSiswaBahanAjarProgress(nisn: string): Record<string, SiswaBahanAjarProgressItem> {
    const all = loadFromStorage<Record<string, Record<string, SiswaBahanAjarProgressItem>>>(
      STORAGE_KEYS.SISWA_BAHAN_AJAR_PROGRESS,
      {}
    );
    return all[nisn] || {};
  }

  static saveSiswaBahanAjarProgress(
    nisn: string,
    bahanAjarId: string,
    progress: Partial<SiswaBahanAjarProgressItem>
  ): void {
    const all = loadFromStorage<Record<string, Record<string, SiswaBahanAjarProgressItem>>>(
      STORAGE_KEYS.SISWA_BAHAN_AJAR_PROGRESS,
      {}
    );
    if (!all[nisn]) {
      all[nisn] = {};
    }
    const existing = all[nisn][bahanAjarId] || {
      bahanAjarId,
      siswaNisn: nisn,
      status: "Sedang Dikerjakan",
      updatedAt: new Date().toISOString()
    };

    all[nisn][bahanAjarId] = {
      ...existing,
      ...progress,
      updatedAt: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.SISWA_BAHAN_AJAR_PROGRESS, all);
  }

  static getAllSiswaBahanAjarProgress(): Record<string, Record<string, SiswaBahanAjarProgressItem>> {
    return loadFromStorage<Record<string, Record<string, SiswaBahanAjarProgressItem>>>(
      STORAGE_KEYS.SISWA_BAHAN_AJAR_PROGRESS,
      {}
    );
  }

  static getJurnalMengajar(): JurnalMengajar[] {
    const list = loadFromStorage(STORAGE_KEYS.JURNAL_GURU, defaultJurnalMengajar);
    return list.map((j) => {
      if (j.kegiatanKbm) return j;
      const matched = defaultJurnalMengajar.find((d) => d.id === j.id);
      return {
        ...j,
        kegiatanKbm:
          matched?.kegiatanKbm ||
          `Pembiasaan tadarus Al-Qur'an, penyampaian apersepsi materi ${j.materiPokok}, eksplorasi materi berkelompok, presentasi dan penguatan konsep, serta evaluasi & refleksi KBM.`
      };
    });
  }

  static saveJurnalMengajar(data: JurnalMengajar[]): void {
    saveToStorage(STORAGE_KEYS.JURNAL_GURU, data);
  }

  static getCatatanSikap(): CatatanSikapSiswa[] {
    return loadFromStorage(STORAGE_KEYS.CATATAN_SIKAP, defaultCatatanSikap);
  }

  static saveCatatanSikap(data: CatatanSikapSiswa[]): void {
    saveToStorage(STORAGE_KEYS.CATATAN_SIKAP, data);
  }

  static getTugas(): TugasLms[] {
    return loadFromStorage(STORAGE_KEYS.TUGAS, defaultTugas);
  }

  static saveTugas(data: TugasLms[]): void {
    saveToStorage(STORAGE_KEYS.TUGAS, data);
  }

  static getPengumpulan(): PengumpulanTugas[] {
    return loadFromStorage(STORAGE_KEYS.PENGUMPULAN, defaultPengumpulan);
  }

  static savePengumpulan(data: PengumpulanTugas[]): void {
    saveToStorage(STORAGE_KEYS.PENGUMPULAN, data);
  }

  static getIbadah(): JurnalIbadahHarian[] {
    return loadFromStorage(STORAGE_KEYS.IBADAH, defaultIbadah);
  }

  static saveIbadah(data: JurnalIbadahHarian[]): void {
    saveToStorage(STORAGE_KEYS.IBADAH, data);
  }

  static getNilaiKhusus(): NilaiKhususPai[] {
    return loadFromStorage(STORAGE_KEYS.NILAI_KHUSUS, defaultNilaiKhusus);
  }

  static saveNilaiKhusus(data: NilaiKhususPai[]): void {
    saveToStorage(STORAGE_KEYS.NILAI_KHUSUS, data);
  }

  static getRekapNilai(): RekapNilaiTotal[] {
    return loadFromStorage(STORAGE_KEYS.REKAP_NILAI, defaultRekapNilai);
  }

  static saveRekapNilai(data: RekapNilaiTotal[]): void {
    saveToStorage(STORAGE_KEYS.REKAP_NILAI, data);
  }

  static getNilaiSemesterParalel(): NilaiSemesterParalel[] {
    return loadFromStorage(STORAGE_KEYS.NILAI_PARALEL, defaultNilaiSemesterParalel);
  }

  static saveNilaiSemesterParalel(data: NilaiSemesterParalel[]): void {
    saveToStorage(STORAGE_KEYS.NILAI_PARALEL, data);
  }

  static getBabPelajaran(): BabPelajaran[] {
    return loadFromStorage(STORAGE_KEYS.BAB_PELAJARAN, defaultBabPelajaran);
  }

  static saveBabPelajaran(data: BabPelajaran[]): void {
    saveToStorage(STORAGE_KEYS.BAB_PELAJARAN, data);
  }

  static getPertemuanMurid(): RekapPertemuanMurid[] {
    return loadFromStorage(STORAGE_KEYS.PERTEMUAN_MURID, defaultPertemuanMurid);
  }

  static savePertemuanMurid(data: RekapPertemuanMurid[]): void {
    saveToStorage(STORAGE_KEYS.PERTEMUAN_MURID, data);
  }

  static getAccounts(): UserAccount[] {
    return loadFromStorage(STORAGE_KEYS.ACCOUNTS, defaultAccounts);
  }

  static saveAccounts(data: UserAccount[]): void {
    saveToStorage(STORAGE_KEYS.ACCOUNTS, data);
  }

  static addAccount(newAccount: UserAccount): UserAccount[] {
    const current = this.getAccounts();
    const existingIndex = current.findIndex(
      (a) => a.role === newAccount.role && a.identifier.trim().toLowerCase() === newAccount.identifier.trim().toLowerCase()
    );
    let updated: UserAccount[];
    if (existingIndex >= 0) {
      updated = current.map((a, idx) => (idx === existingIndex ? { ...a, ...newAccount } : a));
    } else {
      updated = [...current, newAccount];
    }
    this.saveAccounts(updated);
    return updated;
  }

  static getJadwalPelajaran(): JadwalPelajaranItem[] {
    return loadFromStorage(STORAGE_KEYS.JADWAL, defaultJadwalPelajaran);
  }

  static saveJadwalPelajaran(data: JadwalPelajaranItem[]): void {
    saveToStorage(STORAGE_KEYS.JADWAL, data);
  }

  static getBerkasLKPD(): BerkasLKPDItem[] {
    return loadFromStorage(STORAGE_KEYS.BERKAS_LKPD, defaultBerkasLKPD);
  }

  static saveBerkasLKPD(data: BerkasLKPDItem[]): void {
    saveToStorage(STORAGE_KEYS.BERKAS_LKPD, data);
  }

  static getProta(): ProtaItem[] {
    return loadFromStorage(STORAGE_KEYS.PROTA, defaultProtaList);
  }

  static saveProta(data: ProtaItem[]): void {
    saveToStorage(STORAGE_KEYS.PROTA, data);
  }

  static getPromes(): PromesItem[] {
    return loadFromStorage(STORAGE_KEYS.PROMES, defaultPromesList);
  }

  static savePromes(data: PromesItem[]): void {
    saveToStorage(STORAGE_KEYS.PROMES, data);
  }

  // Clear all storage and reload with defaults
  static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.GURU);
    localStorage.removeItem(STORAGE_KEYS.KELAS);
    localStorage.removeItem(STORAGE_KEYS.SISWA);
    localStorage.removeItem(STORAGE_KEYS.PERANGKAT);
    localStorage.removeItem(STORAGE_KEYS.BAHAN_AJAR);
    localStorage.removeItem(STORAGE_KEYS.BAHAN_AJAR_AI_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.BAHAN_AJAR_AI_ACTIVE);
    localStorage.removeItem(STORAGE_KEYS.SISWA_BAHAN_AJAR_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.JURNAL_GURU);
    localStorage.removeItem(STORAGE_KEYS.CATATAN_SIKAP);
    localStorage.removeItem(STORAGE_KEYS.TUGAS);
    localStorage.removeItem(STORAGE_KEYS.PENGUMPULAN);
    localStorage.removeItem(STORAGE_KEYS.IBADAH);
    localStorage.removeItem(STORAGE_KEYS.NILAI_KHUSUS);
    localStorage.removeItem(STORAGE_KEYS.REKAP_NILAI);
    localStorage.removeItem(STORAGE_KEYS.BAB_PELAJARAN);
    localStorage.removeItem(STORAGE_KEYS.PERTEMUAN_MURID);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.JADWAL);
    localStorage.removeItem(STORAGE_KEYS.BERKAS_LKPD);
    localStorage.removeItem(STORAGE_KEYS.PROTA);
    localStorage.removeItem(STORAGE_KEYS.PROMES);
    window.location.reload();
  }
}
