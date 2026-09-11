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
  UserAccount
} from "../types";

// Key definitions for LocalStorage
const STORAGE_KEYS = {
  GURU: "pai_lms_guru_data",
  SEKOLAH: "pai_lms_sekolah_data",
  KELAS: "pai_lms_kelas_data",
  SISWA: "pai_lms_siswa_data",
  PERANGKAT: "pai_lms_perangkat_data",
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
  ACCOUNTS: "pai_lms_accounts_data"
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
  }
];

const defaultJurnalMengajar: JurnalMengajar[] = [
  {
    id: "jm-1",
    tanggal: "2026-07-13",
    kelasId: "VII-A",
    jamKe: "1-2",
    materiPokok: "Bab 1: Ketentuan bersuci dari hadas kecil dan hadas besar (Thaharah)",
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
    const mapped = list.map(item => {
      if (item.downloadUrl === "https://www.youtube.com/watch?v=mockUmayyah") {
        updated = true;
        return { ...item, downloadUrl: "https://www.youtube.com/watch?v=vV-G7lA7kX0" };
      }
      return item;
    });
    if (updated) {
      saveToStorage(STORAGE_KEYS.PERANGKAT, mapped);
    }
    return mapped;
  }

  static savePerangkatAjar(data: PerangkatAjar[]): void {
    saveToStorage(STORAGE_KEYS.PERANGKAT, data);
  }

  static getJurnalMengajar(): JurnalMengajar[] {
    return loadFromStorage(STORAGE_KEYS.JURNAL_GURU, defaultJurnalMengajar);
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

  // Clear all storage and reload with defaults
  static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.GURU);
    localStorage.removeItem(STORAGE_KEYS.KELAS);
    localStorage.removeItem(STORAGE_KEYS.SISWA);
    localStorage.removeItem(STORAGE_KEYS.PERANGKAT);
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
    window.location.reload();
  }
}
