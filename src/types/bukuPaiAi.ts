/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AyoMengamatiData {
  deskripsi: string;
  imagePrompt: string;
  pertanyaanPengamatan: string[];
  hubunganMateri: string;
  captionGambar?: string;
}

export interface DalilBukuData {
  sumber?: string;
  teksArab: string;
  latin?: string;
  terjemahan: string;
  penjelasanDalil?: string;
  kategori?: string;
  surah?: string;
  nomorAyat?: string;
  tafsirSingkat?: string;
  kosakataTerpilih?: { kata?: string; lafaz?: string; arti: string }[];
}

export interface StudiKasusItem {
  id?: string;
  judul?: string;
  judulKasus?: string;
  situasi?: string;
  deskripsi?: string;
  deskripsiKasus?: string;
  masalah?: string;
  nilaiIslam?: string;
  solusiGuru?: string;
  pertanyaan?: string[];
  pertanyaanDiskusi?: string[];
}

export interface SoalPilihanGanda {
  id?: string;
  no?: number;
  soal?: string;
  pertanyaan?: string;
  opsi: [string, string, string, string] | string[];
  kunci?: number; // 0..3
  kunciJawaban?: string | number;
  pembahasan: string;
}

export interface SoalIsian {
  id?: string;
  no?: number;
  soal?: string;
  pertanyaan?: string;
  kunciSingkat?: string;
  kunciJawaban?: string;
  pembahasan?: string;
}

export interface SoalBenarSalah {
  id?: string;
  no?: number;
  pernyataan: string;
  jawabanBenar: boolean;
  alasan?: string;
  pembahasan?: string;
}

export interface SoalMenjodohkan {
  id?: string;
  no?: number;
  premis?: string;
  pertanyaan?: string;
  pasangan?: string;
  pasanganJawaban?: string;
}

export interface SoalUraian {
  id?: string;
  no?: number;
  pertanyaan: string;
  rubrikJawaban?: string;
  rubrikPenilaian?: string;
  panduanJawaban?: string;
}

export interface LatihanBabData {
  pilihanGanda: SoalPilihanGanda[];
  isian?: SoalIsian[];
  isianSingkat?: SoalIsian[];
  benarSalah: SoalBenarSalah[];
  menjodohkan: SoalMenjodohkan[];
  uraian: SoalUraian[];
  soalHots?: SoalUraian[];
  hots?: SoalUraian[];
}

export interface RefleksiSiswaData {
  pengantar?: string;
  pertanyaanRefleksi?: string[];
  sudahDipahami?: string[];
  perluDipelajari?: string[];
  sikapDiterapkan?: string;
  kebiasaanDilakukan?: string;
}

export interface PengayaanData {
  judul?: string;
  judulProyek?: string;
  deskripsi: string;
  tugas?: string[];
  referensiLanjut?: string | string[];
}

export interface RemedialData {
  fokusMateri?: string;
  ringkasanKonsep?: string[];
  latihanMandiri?: string[];
  kegiatan?: string | string[];
}

export interface BabBukuPai7 {
  babNomor: number;
  semester: 1 | 2;
  judulBab: string;
  tujuanPembelajaran: string[];
  kataKunci: string[];
  petaKonsep: string[];
  ayoMengamati: AyoMengamatiData;
  ayoBerpikir: string[];
  materiPembelajaran: {
    subJudul: string;
    konten: string;
    poinKunci?: string[];
  }[];
  dalilTerkait: DalilBukuData[];
  penjelasanKonsep: string[];
  contohKehidupan: string[];
  aktivitasIndividu: string[];
  aktivitasKelompok: string[];
  studiKasus: StudiKasusItem[];
  ayoBerdiskusi: string[];
  latihan: LatihanBabData;
  refleksi: RefleksiSiswaData;
  rangkuman: string[];
  pengayaan: PengayaanData;
  remedial: RemedialData;
  evaluasi: string[];
  glosarium: { istilah: string; arti: string }[];
  daftarPustaka: string[];
  verification: {
    status: "Terverifikasi" | "Perlu Verifikasi Guru";
    catatan: string;
  };
  gameList: {
    tipe: string;
    judul: string;
    deskripsi: string;
  }[];
}

export interface TajwidContohItem {
  lafaz: string;
  surahAyat?: string;
  hukum: string;
  caraBaca: string;
  penjelasan?: string;
}

export interface TajwidBabData {
  judulTajwid: string;
  penjelasanKaidah: string;
  hurufHijaiyah?: string[];
  contohList: TajwidContohItem[];
}

export interface PraktikBabData {
  judulPraktik: string;
  tujuan: string;
  alatBahan?: string[];
  langkahPraktik: string[];
  rubrikPenilaian?: string;
}

export interface BabBukuPai8 {
  babNomor: number;
  semester: 1 | 2;
  judulBab: string;
  tujuanPembelajaran: string[];
  kataKunci: string[];
  petaKonsep: string[];
  ayoMengamati: AyoMengamatiData;
  ayoBerpikir: string[];
  materiPembelajaran: {
    subJudul: string;
    konten: string;
    poinKunci?: string[];
  }[];
  dalilTerkait: DalilBukuData[];
  tajwid?: TajwidBabData;
  contohKehidupan: string[];
  aktivitasIndividu: string[];
  aktivitasKelompok: string[];
  praktik?: PraktikBabData;
  studiKasus: StudiKasusItem[];
  ayoBerdiskusi: string[];
  latihan: LatihanBabData;
  refleksi: RefleksiSiswaData;
  rangkuman: string[];
  pengayaan: PengayaanData;
  remedial: RemedialData;
  evaluasi: string[];
  glosarium: { istilah: string; arti: string }[];
  daftarPustaka: string[];
  verification: {
    status: "Terverifikasi" | "Perlu Verifikasi Guru";
    catatan: string;
  };
  gameList: {
    tipe: string;
    judul: string;
    deskripsi: string;
  }[];
}

export interface IdentitasBukuPai8 {
  judulUtama: string;
  jenjang: string;
  namaSekolah: string;
  guruPenyusun: string;
  tahunPelajaran: string;
  keteranganKurikulum: string;
  kataPengantar: string;
  petunjukPenggunaan: string[];
  capaianPembelajaran: string;
}

export interface IdentitasBukuPai7 {
  judulUtama: string;
  jenjang: string;
  namaSekolah: string;
  guruPenyusun: string;
  tahunPelajaran: string;
  keteranganKurikulum: string;
  kataPengantar: string;
  petunjukPenggunaan: string[];
  capaianPembelajaran: string;
}
