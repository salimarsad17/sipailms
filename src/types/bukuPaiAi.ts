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
  sumber: string;
  teksArab: string;
  latin?: string;
  terjemahan: string;
  penjelasanDalil: string;
}

export interface StudiKasusItem {
  id: string;
  judul: string;
  situasi: string;
  masalah: string;
  nilaiIslam: string;
  pertanyaan: string[];
}

export interface SoalPilihanGanda {
  no: number;
  soal: string;
  opsi: [string, string, string, string];
  kunci: number; // 0..3
  pembahasan: string;
}

export interface SoalIsian {
  no: number;
  soal: string;
  kunciSingkat: string;
}

export interface SoalBenarSalah {
  no: number;
  pernyataan: string;
  jawabanBenar: boolean;
  alasan: string;
}

export interface SoalMenjodohkan {
  no: number;
  premis: string;
  pasangan: string;
}

export interface SoalUraian {
  no: number;
  pertanyaan: string;
  rubrikJawaban: string;
}

export interface LatihanBabData {
  pilihanGanda: SoalPilihanGanda[];
  isian: SoalIsian[];
  benarSalah: SoalBenarSalah[];
  menjodohkan: SoalMenjodohkan[];
  uraian: SoalUraian[];
  soalHots: SoalUraian[];
}

export interface RefleksiSiswaData {
  sudahDipahami: string[];
  perluDipelajari: string[];
  sikapDiterapkan: string;
  kebiasaanDilakukan: string;
}

export interface PengayaanData {
  judulProyek: string;
  deskripsi: string;
  tugas: string[];
}

export interface RemedialData {
  ringkasanKonsep: string[];
  latihanMandiri: string[];
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
