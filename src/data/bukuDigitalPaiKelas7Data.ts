/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BabBukuPai7, IdentitasBukuPai7 } from "../types/bukuPaiAi";
import { BAB_SEMESTER_1_KELAS_7 } from "./bukuDigitalPaiKelas7Sem1";
import { BAB_SEMESTER_2_KELAS_7 } from "./bukuDigitalPaiKelas7Sem2";

export const IDENTITAS_BUKU_PAI_KELAS_7: IdentitasBukuPai7 = {
  judulUtama: "PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI",
  jenjang: "SMP/MTs KELAS VII",
  namaSekolah: "UPT SMPN 2 Rebang Tangkas",
  guruPenyusun: "Sadiqul Alim, S.Pd.I., M.Pd.",
  tahunPelajaran: "2024/2025 (Fase D Kurikulum Merdeka)",
  keteranganKurikulum:
    "Disusun sebagai bahan ajar digital yang mengacu pada kurikulum dan sumber resmi yang relevan. Dilengkapi integrasi media pembelajaran modern, literasi, numerasi, dan penguatan Profil Pelajar Pancasila.",
  kataPengantar:
    "Alhamdulillāhi Rabbil 'Ālamīn. Puji syukur ke hadirat Allah SWT atas limpahan rahmat dan hidayah-Nya sehingga Buku Digital PAI Kelas VII ini dapat hadir mendampingi proses pembelajaran Pendidikan Agama Islam dan Budi Pekerti di tingkat SMP. Buku ini dirancang secara sistematis dengan gaya buku pelajaran modern yang memadukan kedalaman dalil Al-Qur'an dan Hadis, ketajaman analisis studi kasus kehidupan sehari-hari, serta interaktivitas belajar yang menyenangkan. Semoga buku ini dapat menjadi pemandu bagi para siswa dalam menggapai kematangan akidah, keluhuran akhlak, ketertiban ibadah, dan wawasan sejarah peradaban Islam yang gemilang.",
  petunjukPenggunaan: [
    "Bacalah doa belajar sebelum memulai setiap bab agar ilmu yang dipelajari membawa keberkahan.",
    "Pelajari peta konsep dan kata kunci pada setiap bab untuk memahami arah tujuan pembelajaran.",
    "Amati gambar dan jawab pertanyaan pada rubrik 'Ayo Mengamati' serta telaah tantangan 'Ayo Berpikir'.",
    "Pahami materi inti, renungkan dalil Al-Qur'an dan Hadis beserta maknanya secara mendalam.",
    "Kerjakan aktivitas individu, tugas kelompok, dan selesaikan studi kasus yang disajikan secara kontekstual.",
    "Uji pemahamanmu melalui variasi soal latihan (Pilihan Ganda, Isian, Benar/Salah, Menjodohkan, Uraian, dan HOTS).",
    "Gunakan tombol generator media di setiap bab untuk langsung membuat video, game edukasi, TTS, LKPD, dan CBT terkait bab tersebut."
  ],
  capaianPembelajaran:
    "Pada Fase D (Kelas VII SMP/MTs), peserta didik mampu membaca, menghafal, dan memahami ayat Al-Qur'an serta hadis tentang iman dan takwa; meyakini dan meneladani Asmaul Husna dan sifat malaikat; menerapkan nilai ikhlas, syukur, serta tata cara sujud di luar salat dan rukhsah dalam ibadah; serta merefleksikan peran sejarah Kekhalifahan Bani Umayyah di Damaskus dan Andalusia sebagai inspirasi membangun peradaban masa kini."
};

export const SEMUA_BAB_KELAS_7: BabBukuPai7[] = [
  ...BAB_SEMESTER_1_KELAS_7,
  ...BAB_SEMESTER_2_KELAS_7
];

export const GLOSARIUM_LENGKAP_KELAS_7 = [
  { istilah: "Iman", arti: "Keyakinan teguh dalam hati yang dibenarkan dengan lisan dan dibuktikan dengan perbuatan." },
  { istilah: "Takwa", arti: "Menjalankan perintah Allah dan menjauhi segala larangan-Nya demi memelihara diri dari siksa-Nya." },
  { istilah: "Ikhlas", arti: "Memurnikan niat beramal semata-mata mengharapkan rida Allah SWT tanpa pamrih manusia." },
  { istilah: "Rukhsah", arti: "Keringanan hukum dalam syariat Islam yang diberikan kepada mukalaf karena adanya uzur syar'i." },
  { istilah: "'Azimah", arti: "Ketentuan hukum pokok dalam kondisi normal tanpa uzur darurat." },
  { istilah: "Sujud Syukur", arti: "Sujud satu kali di luar salat sebagai bentuk terima kasih atas nikmat besar atau terhindar dari musibah." },
  { istilah: "Sujud Sahwi", arti: "Sujud dua kali di dalam salat karena lupa rukun sunnah ab'adh atau ragu bilangan rakaat." },
  { istilah: "Sujud Tilawah", arti: "Sujud satu kali saat membaca atau mendengar lantunan salah satu dari 15 ayat sajdah." },
  { istilah: "Asmaul Husna", arti: "Nama-nama yang Maha Indah dan Sempurna milik Allah SWT yang berjumlah 99 nama." },
  { istilah: "Al-'Alim", arti: "Asmaul Husna yang bermakna Allah Maha Mengetahui segala sesuatu tanpa batas." },
  { istilah: "As-Sami'", arti: "Asmaul Husna yang bermakna Allah Maha Mendengar setiap bunyi dan bisikan batin." },
  { istilah: "Al-Bashir", arti: "Asmaul Husna yang bermakna Allah Maha Melihat seluruh gerak-gerik di alam semesta." },
  { istilah: "Al-Khabir", arti: "Asmaul Husna yang bermakna Allah Maha Teliti dan Waspada pada hakikat batiniah perkara." },
  { istilah: "Gunnah", arti: "Hukum tajwid suara mendengung 2 harakat yang keluar dari pangkal hidung pada Nun dan Mim bertasydid." },
  { istilah: "Alif Lam Syamsiyah", arti: "Hukum tajwid di mana lam sukun dileburkan (idgham) ke huruf syamsiyah bertasydid." },
  { istilah: "Alif Lam Qamariyah", arti: "Hukum tajwid di mana lam sukun dibaca terang dan jelas (izhar) bersukun." },
  { istilah: "Malaikat", arti: "Makhluk gaib ciptaan Allah dari cahaya (nur) yang senantiasa taat tanpa hawa nafsu." },
  { istilah: "Bani Umayyah", arti: "Dinasti kekhalifahan Islam pertama pasca Khulafaur Rasyidin yang berpusat di Damaskus (661-750 M)." },
  { istilah: "Andalusia", arti: "Sebutan historis peradaban Islam di Semenanjung Iberia (Spanyol dan Portugal)." },
  { istilah: "Ad-Dakhil", arti: "Gelar Abdurrahman I (Sang Penerobos/Rajawali Quraisy) pendiri Keamiran Umayyah Cordoba (756 M)." },
  { istilah: "Az-Zahrawi", arti: "Bapak bedah modern muslim penemu aneka instrumen operasi medis dari Andalusia." },
  { istilah: "Muraqabah", arti: "Sikap batin senantiasa merasa diawasi oleh Allah SWT dalam setiap keadaan." },
  { istilah: "Tawakal", arti: "Menyerahkan hasil akhir perjuangan hanya kepada kekuasaan dan takdir Allah SWT." }
];

export const DAFTAR_PUSTAKA_LENGKAP_KELAS_7 = [
  "Al-Qur'an dan Terjemahannya, Lajnah Pentashihan Mushaf Al-Qur'an, Kementerian Agama Republik Indonesia, Jakarta.",
  "Buku Guru Pendidikan Agama Islam dan Budi Pekerti SMP Kelas VII, Pusat Kurikulum dan Perbukuan, Kemendikbudristek RI, Jakarta.",
  "Buku Siswa Pendidikan Agama Islam dan Budi Pekerti SMP Kelas VII, Pusat Kurikulum dan Perbukuan, Kemendikbudristek RI, Jakarta.",
  "Fathul Qarib Al-Mujib fi Syarhi Alfazhit Taqrib karya Syaikh Muhammad bin Qasim Al-Ghazi.",
  "Riyadhus Shalihin min Kalami Sayyidil Mursalin karya Imam Abu Zakariya Yahya bin Syaraf An-Nawawi.",
  "Tarikh Khulafa': Sejarah Para Khalifah karya Imam Jalaluddin As-Suyuthi.",
  "Sejarah Peradaban Islam karya Prof. Dr. Badri Yatim, M.A., PT RajaGrafindo Persada, Jakarta.",
  "Tafsir Al-Maraghi karya Ahmad Mustafa Al-Maraghi, Darul Fikr, Beirut."
];

export const PROMPT_SISTEM_GENERATOR_BUKU_PAI_7 = `# PROMPT SISTEM GENERATOR BUKU PELAJARAN AI

## PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI SMP KELAS 7

Buat fitur khusus dalam aplikasi "BAHAN AJAR AI PAI" bernama:

# 📚 GENERATOR BUKU PELAJARAN AI

Fitur ini digunakan untuk menghasilkan bahan ajar PAI kelas 7 SMP dalam bentuk buku pelajaran digital yang lengkap, sistematis, interaktif, mudah dipahami siswa, dan dapat digunakan sebagai bahan ajar guru.

Buku harus disusun dengan gaya buku pelajaran SMP, bukan sekadar artikel atau rangkuman.

==================================================
A. PRINSIP UTAMA
================

Buku harus:

1. Menggunakan bahasa Indonesia yang sesuai untuk siswa SMP kelas 7.
2. Sistematis seperti buku pelajaran.
3. Mengembangkan pengetahuan, keterampilan, sikap, dan refleksi.
4. Menggunakan pendekatan pembelajaran aktif.
5. Kontekstual dengan kehidupan sehari-hari siswa.
6. Menyediakan aktivitas individu dan kelompok.
7. Menyediakan latihan dan evaluasi.
8. Mengintegrasikan literasi, numerasi sederhana jika relevan, berpikir kritis, kreativitas, komunikasi, dan kolaborasi.
9. Menggunakan sumber yang dapat dipertanggungjawabkan.
10. Untuk Al-Qur'an dan hadis, jangan membuat teks secara otomatis jika sumber tidak terverifikasi.
11. Jangan mengarang ayat, hadis, terjemahan, nomor ayat, nama tokoh, tahun sejarah, atau fakta sejarah.
12. Jika terdapat informasi yang belum dapat diverifikasi, tandai untuk pemeriksaan guru.
13. Jangan mengklaim hasil AI sebagai "Buku Resmi Kemendikdasmen".
14. Gunakan istilah:
    "Bahan Ajar PAI Kelas 7"
    atau
    "Buku Digital PAI Kelas 7"
    dan keterangan:
    "Disusun sebagai bahan ajar yang mengacu pada kurikulum dan sumber resmi yang relevan."

==================================================
B. IDENTITAS BUKU
=================

Buat halaman sampul:

PENDIDIKAN AGAMA ISLAM
DAN BUDI PEKERTI

SMP/MTs KELAS VII

Bahan Ajar Digital

Tambahkan:

Nama Sekolah:
UPT SMPN 2 Rebang Tangkas

Guru:
[ambil dari database]

Tahun Pelajaran:
[ambil dari SETTINGS]

Tambahkan ilustrasi edukatif Islami yang sesuai usia siswa SMP.

==================================================
C. STRUKTUR BUKU
================

Buku harus memiliki:

1. Sampul
2. Identitas buku
3. Kata pengantar
4. Petunjuk penggunaan buku
5. Daftar isi
6. Peta konsep
7. Capaian pembelajaran
8. Tujuan pembelajaran
9. Materi setiap bab
10. Aktivitas pembelajaran
11. Ayat/hadis terkait
12. Contoh kehidupan sehari-hari
13. Studi kasus
14. Ayo berdiskusi
15. Ayo berlatih
16. Ayo berefleksi
17. Rangkuman
18. Evaluasi bab
19. Pengayaan
20. Remedial
21. Glosarium
22. Daftar pustaka
23. Indeks istilah jika diperlukan

==================================================
D. STRUKTUR SETIAP BAB
======================

Setiap bab WAJIB memiliki struktur:

BAB [NOMOR]

JUDUL BAB

A. Tujuan Pembelajaran

B. Kata Kunci

C. Peta Konsep

D. Ayo Mengamati

E. Ayo Berpikir

F. Materi Pembelajaran

G. Ayat Al-Qur'an/Hadis Terkait

H. Penjelasan

I. Contoh dalam Kehidupan Sehari-hari

J. Aktivitas Individu

K. Aktivitas Kelompok

L. Studi Kasus

M. Ayo Berdiskusi

N. Ayo Berlatih

O. Ayo Berefleksi

P. Rangkuman

Q. Evaluasi

R. Pengayaan

S. Remedial

==================================================
E. SEMESTER 1
=============

Gunakan urutan materi berikut sebagai struktur BAB.

---

BAB 1
AL-QUR'AN DAN IMAN
------------------

Materi pokok:

Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman:

QS. An-Nisa ayat 136

dan

QS. Al-Anfal ayat 2–4

serta memahami kaidah tajwid tentang hukum bacaan Alif Lam.

Submateri wajib:

1. Pengertian iman.
2. Pentingnya iman dalam kehidupan.
3. Kandungan QS. An-Nisa ayat 136.
4. Kandungan QS. Al-Anfal ayat 2–4.
5. Kosakata penting ayat.
6. Terjemahan ayat.
7. Pesan utama ayat.
8. Hubungan iman dengan perilaku.
9. Cara membaca ayat dengan benar.
10. Latihan membaca.
11. Latihan menulis ayat.
12. Latihan menghafal.
13. Tajwid hukum bacaan Alif Lam.
14. Alif Lam Syamsiyah.
15. Alif Lam Qamariyah.
16. Contoh bacaan.
17. Latihan identifikasi hukum bacaan.
18. Penerapan iman dalam kehidupan sehari-hari.

Aktivitas:

* Mengamati ayat.
* Menandai hukum tajwid.
* Membaca bergantian.
* Menghafal.
* Menulis ayat.
* Diskusi kandungan ayat.
* Studi kasus tentang perilaku orang beriman.

Evaluasi harus mencakup:

* Membaca
* Menulis
* Menghafal
* Memahami
* Menganalisis
* Menerapkan

---

BAB 2
MENELADANI SIFAT ALLAH MELALUI ASMAUL HUSNA
-------------------------------------------

Materi:

Meyakini dan merefleksikan iman kepada Allah Swt. melalui sifat dan Asmaul Husna:

1. Al-'Alim
2. As-Sami'
3. Al-Bashir
4. Al-Khabir

Submateri:

* Pengertian Asmaul Husna.
* Makna Al-'Alim.
* Makna As-Sami'.
* Makna Al-Bashir.
* Makna Al-Khabir.
* Dalil terkait.
* Contoh perilaku.
* Hikmah beriman kepada Asmaul Husna.
* Penerapan dalam kehidupan.
* Refleksi diri.

Aktivitas:

* Mengamati gambar.
* Mencocokkan Asmaul Husna dengan arti.
* Studi kasus.
* Permainan kartu.
* Diskusi.
* Jurnal refleksi.

---

BAB 3
IKHLAS DALAM KEHIDUPAN
----------------------

Materi:

Menerapkan makna ikhlas dalam kehidupan sehari-hari.

Submateri:

1. Pengertian ikhlas.
2. Dalil tentang ikhlas.
3. Ciri-ciri orang ikhlas.
4. Perbedaan ikhlas dan riya.
5. Contoh ikhlas.
6. Ikhlas dalam belajar.
7. Ikhlas dalam membantu orang lain.
8. Ikhlas dalam beribadah.
9. Hambatan menjaga keikhlasan.
10. Cara melatih keikhlasan.
11. Refleksi diri.

Buat studi kasus:

* membantu teman,
* bersedekah,
* mengerjakan tugas,
* beribadah,
* mendapatkan pujian.

Siswa diminta menentukan tindakan yang menunjukkan keikhlasan.

---

BAB 4
MACAM-MACAM SUJUD DI LUAR RUKUN SALAT
-------------------------------------

Materi:

Menerapkan ketentuan macam-macam sujud di luar rukun salat.

Bahas secara sistematis:

1. Pengertian sujud.
2. Sujud syukur.
3. Sujud sahwi.
4. Sujud tilawah.
5. Dasar/dalil yang relevan.
6. Sebab dilaksanakan.
7. Ketentuan.
8. Tata cara.
9. Bacaan jika relevan.
10. Perbedaan ketiganya.
11. Contoh penerapan.
12. Hikmah.

Buat tabel perbandingan:

Jenis Sujud
Sebab
Waktu
Tata Cara
Hikmah

Buat aktivitas praktik.

---

BAB 5
BANI UMAYYAH PERIODE DAMASKUS
-----------------------------

Materi:

Merefleksikan sejarah dan peran kekhalifahan Islam pasca Khulafaur Rasyidin, khususnya Bani Umayyah periode Damaskus.

Submateri:

1. Latar belakang berdirinya Bani Umayyah.
2. Muawiyah bin Abi Sufyan.
3. Pusat pemerintahan Damaskus.
4. Perkembangan pemerintahan.
5. Tokoh-tokoh penting.
6. Perkembangan ilmu pengetahuan.
7. Perkembangan pendidikan.
8. Perkembangan ekonomi.
9. Perkembangan administrasi.
10. Perkembangan arsitektur.
11. Perluasan wilayah.
12. Faktor kemajuan.
13. Faktor kemunduran.
14. Akhir kekuasaan.
15. Keteladanan dan pelajaran sejarah.

Buat:

* timeline sejarah,
* peta konsep,
* peta wilayah jika memungkinkan,
* profil tokoh,
* studi kasus,
* refleksi.

Jangan membuat tahun atau fakta sejarah yang tidak terverifikasi.

==================================================
F. SEMESTER 2
=============

Gunakan urutan berikut.

---

BAB 6
TAQWA DAN KETAATAN KEPADA ALLAH
-------------------------------

Materi:

Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang takwa:

QS. Al-Baqarah ayat 103

dan

QS. Ali Imran ayat 76

serta memahami kaidah tajwid tentang Gunnah dan hadis terkait.

Submateri:

1. Pengertian takwa.
2. Hubungan iman dan takwa.
3. Kandungan QS. Al-Baqarah ayat 103.
4. Kandungan QS. Ali Imran ayat 76.
5. Kosakata ayat.
6. Terjemahan.
7. Pesan utama ayat.
8. Contoh perilaku takwa.
9. Hukum bacaan Gunnah.
10. Pengertian Gunnah.
11. Contoh Gunnah.
12. Cara membaca.
13. Latihan identifikasi Gunnah.
14. Hadis terkait takwa.
15. Penerapan takwa dalam kehidupan.

Pastikan teks ayat, hadis, dan terjemahan diverifikasi sebelum dipublikasikan.

---

BAB 7
IMAN KEPADA MALAIKAT ALLAH SWT.
-------------------------------

Materi:

Meyakini dan merefleksikan iman kepada malaikat Allah Swt.

Submateri:

1. Pengertian iman kepada malaikat.
2. Dalil.
3. Sifat malaikat.
4. Nama-nama malaikat yang wajib diketahui.
5. Tugas malaikat.
6. Perbedaan malaikat dengan manusia.
7. Hikmah beriman kepada malaikat.
8. Perilaku yang mencerminkan iman kepada malaikat.
9. Contoh dalam kehidupan.
10. Refleksi.

Buat tabel:

Nama Malaikat
Tugas
Contoh sikap yang dapat diteladani

---

BAB 8
BERSYUKUR KEPADA ALLAH SWT.
---------------------------

Materi:

Menerapkan makna bersyukur kepada Allah.

Submateri:

1. Pengertian syukur.
2. Dalil tentang syukur.
3. Nikmat Allah.
4. Syukur dengan hati.
5. Syukur dengan lisan.
6. Syukur dengan perbuatan.
7. Contoh syukur di rumah.
8. Contoh syukur di sekolah.
9. Contoh syukur kepada orang lain.
10. Akibat tidak bersyukur.
11. Cara membiasakan syukur.
12. Jurnal syukur.
13. Refleksi.

Buat aktivitas:

"Jurnal Syukur 7 Hari"

---

BAB 9
RUKHSAH DALAM IBADAH
--------------------

Materi:

Menerapkan ketentuan rukhsah dalam ibadah.

Submateri:

1. Pengertian rukhsah.
2. Dasar hukum.
3. Sebab adanya rukhsah.
4. Rukhsah dalam salat.
5. Salat dalam perjalanan.
6. Jamak.
7. Qasar.
8. Jamak qasar sesuai ketentuan.
9. Rukhsah dalam puasa.
10. Rukhsah terkait ibadah lainnya sesuai materi.
11. Syarat dan ketentuan.
12. Contoh kasus.
13. Hikmah rukhsah.
14. Latihan penerapan.

Buat tabel:

Kondisi
Ketentuan Normal
Rukhsah
Syarat
Contoh

Berikan studi kasus kehidupan nyata.

---

BAB 10
BANI UMAYYAH PERIODE ANDALUSIA
------------------------------

Materi:

Merefleksikan diri terhadap sejarah dan peran kekhalifahan Islam pasca Khulafaur Rasyidin, khususnya Bani Umayyah periode Andalusia.

Submateri:

1. Latar belakang Islam di Andalusia.
2. Masuknya Islam ke Andalusia.
3. Bani Umayyah di Andalusia.
4. Abd al-Rahman I.
5. Perkembangan Cordoba.
6. Pendidikan.
7. Ilmu pengetahuan.
8. Perpustakaan.
9. Kedokteran.
10. Matematika.
11. Astronomi.
12. Arsitektur.
13. Kebudayaan.
14. Kehidupan masyarakat.
15. Tokoh-tokoh penting.
16. Faktor kemajuan.
17. Faktor kemunduran.
18. Warisan peradaban.
19. Nilai keteladanan.
20. Refleksi bagi kehidupan siswa.

Buat:

* timeline,
* peta Andalusia,
* profil tokoh ilmuwan.

==================================================
G. OUTPUT YANG DIHASILKAN
=========================

AI harus menghasilkan:

1. Buku Digital PAI Kelas 7 lengkap.
2. Teks terformat rapi.
3. Siap dibaca.
4. Siap diekspor ke PDF/print.
5. Siap diubah menjadi:
   * slide presentasi,
   * video pembelajaran,
   * ringkasan materi,
   * kuis interaktif,
   * LKPD,
   * bank soal.
`;

