import { ProtaItem, PromesItem, PerangkatAjar } from "../types";

export const PROTA_PROMES_SEKOLAH_INFO = {
  namaSekolah: "UPT SMPN 2 REBANG TANGKAS",
  dinas: "PEMERINTAH KABUPATEN WAY KANAN",
  subDinas: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
  alamat: "Jl. Lapangan Sriwijaya, Tanjung Tiga, Kec. Rebang Tangkas, Kab. Way Kanan, Lampung 34768",
  akreditasi: "Akreditasi B | NPSN: 10806653",
  mataPelajaran: "Pendidikan Agama Islam dan Budi Pekerti (PAI & BP)",
  fase: "Fase D (SMP/MTs)",
  tahunAjaran: "2024/2025",
  kepalaSekolah: "Drs. H. Ahmad Dahlan, M.Pd.",
  nipKepalaSekolah: "196805121994121001",
  guruPai: "Sadiqul Alim, S.Pd.I., M.Pd.",
  nipGuruPai: "197909172014071004",
  tempatTanggal: "Rebang Tangkas, 15 Juli 2024"
};

export const defaultProtaList: ProtaItem[] = [
  // ==================== KELAS VII - SEMESTER 1 ====================
  {
    id: "prota-7-1-1",
    kelas: "VII",
    semester: "1",
    noUrut: 1,
    bab: "Bab 1: Al-Qur'an dan Hadis Pedoman Hidup",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. al-Anbiya/21: 107 tentang Islam Rahmatan lil 'Alamin, membaca sesuai kaidah tajwid, menghafal, dan membiasakan diri membaca Al-Qur'an setiap hari.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-7-1-2",
    kelas: "VII",
    semester: "1",
    noUrut: 2,
    bab: "Bab 2: Meneladani Nama dan Sifat Allah SWT",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami makna al-Asma' al-Husna (al-'Alim, al-Khabir, as-Sami', al-Bashir), menyajikan contoh perilaku teladan di sekolah dan rumah, serta menumbuhkan keimanan teguh.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-7-1-3",
    kelas: "VII",
    semester: "1",
    noUrut: 3,
    bab: "Bab 3: Menghadirkan Islam Damai Melalui Thaharah & Shalat",
    elemen: "Fiqih",
    tujuanPembelajaran: "Mendeskripsikan hakikat bersuci (thaharah) dari hadas dan najis, mempraktikkan tata cara wudhu, tayamum, mandi wajib, serta shalat fardhu berjamaah dan zikir.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-7-1-4",
    kelas: "VII",
    semester: "1",
    noUrut: 4,
    bab: "Bab 4: Mengagungkan Nama Allah dengan Ketundukan",
    elemen: "Fiqih",
    tujuanPembelajaran: "Menjelaskan ketentuan dan hikmah sujud syukur, sujud sahwi, dan sujud tilawah serta mempraktikkannya dengan tertib dalam kehidupan beribadah sehari-hari.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-7-1-5",
    kelas: "VII",
    semester: "1",
    noUrut: 5,
    bab: "Bab 5: Menapaki Jejak Peradaban Islam Daulah Umayyah",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menceritakan sejarah berdirinya Daulah Umayyah di Damaskus, kemajuan peradaban ilmu pengetahuan dan seni arsitektur Islam, serta meneladani semangat belajar para ulama.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },

  // ==================== KELAS VII - SEMESTER 2 ====================
  {
    id: "prota-7-2-1",
    kelas: "VII",
    semester: "2",
    noUrut: 6,
    bab: "Bab 6: Alam Semesta sebagai Tanda Kekuasaan Allah",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. al-Anbiya/21: 30 dan Q.S. al-A'raf/7: 54 tentang penciptaan alam semesta, keteraturan kosmos, hukum bacaan ghunnah, serta pelestarian lingkungan hidup.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-7-2-2",
    kelas: "VII",
    semester: "2",
    noUrut: 7,
    bab: "Bab 7: Mawas Diri dan Beriman kepada Malaikat Allah",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami tugas dan sifat 10 malaikat Allah SWT, menumbuhkan perilaku jujur dan mawas diri karena meyakini pengawasan malaikat Raqib dan Atid di mana pun berada.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-7-2-3",
    kelas: "VII",
    semester: "2",
    noUrut: 8,
    bab: "Bab 8: Meneladani Sikap Jujur, Amanah, dan Istiqamah",
    elemen: "Akhlak",
    tujuanPembelajaran: "Mendeskripsikan makna dan urgensi amanah, kejujuran akademik, dan istiqamah dalam menuntut ilmu, serta merancang proyek pembiasaan karakter profil pelajar Pancasila beriman.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-7-2-4",
    kelas: "VII",
    semester: "2",
    noUrut: 9,
    bab: "Bab 9: Menggapai Berkah Muamalah Tanpa Riba",
    elemen: "Fiqih",
    tujuanPembelajaran: "Memahami asas jual beli yang halal, prinsip kejujuran timbangan, bahaya transaksi riba dan penipuan digital, serta etika berdagang sesuai tuntunan syariat Islam.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-7-2-5",
    kelas: "VII",
    semester: "2",
    noUrut: 10,
    bab: "Bab 10: Meneladani Dinasti Umayyah di Andalusia (Spanyol)",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menelaah kegemilangan Islam di Andalusia (Cordoba dan Granada), kontribusi perpustakaan dan universitas Islam bagi peradaban Eropa, serta menumbuhkan cinta literasi.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },

  // ==================== KELAS VIII - SEMESTER 1 ====================
  {
    id: "prota-8-1-1",
    kelas: "VIII",
    semester: "1",
    noUrut: 1,
    bab: "Bab 1: Inspirasi Al-Qur'an: Melestarikan Alam dan Toleransi",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. ar-Rum/30: 41 dan Q.S. al-Baqarah/2: 256 tentang amanah pemeliharaan bumi dan sikap lapang dada menghormati perbedaan keyakinan.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-8-1-2",
    kelas: "VIII",
    semester: "1",
    noUrut: 2,
    bab: "Bab 2: Beriman kepada Kitab-Kitab Allah SWT",
    elemen: "Akidah",
    tujuanPembelajaran: "Menjelaskan hakikat beriman kepada 4 kitab Allah (Taurat, Zabur, Injil, Al-Qur'an) dan menjadikan Al-Qur'an sebagai pedoman utama pembeda antara yang haq dan bathil.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-8-1-3",
    kelas: "VIII",
    semester: "1",
    noUrut: 3,
    bab: "Bab 3: Menghindari Minuman Keras, Judi, dan Pertengkaran",
    elemen: "Akhlak",
    tujuanPembelajaran: "Menganalisis bahaya miras (khamr), judi online, dan tawuran pelajar berdasarkan Q.S. al-Ma'idah/5: 90-91 serta merancang aksi penolakan narkoba di lingkungan sekolah.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-8-1-4",
    kelas: "VIII",
    semester: "1",
    noUrut: 4,
    bab: "Bab 4: Ibadah Shalat Gerhana, Istisqa, dan Jenazah",
    elemen: "Fiqih",
    tujuanPembelajaran: "Mempraktikkan tata cara shalat sunnah gerhana (kusuf/khusuf), shalat minta hujan (istisqa), serta tata cara memandikan, mengafani, menyalatkan, dan menguburkan jenazah.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-8-1-5",
    kelas: "VIII",
    semester: "1",
    noUrut: 5,
    bab: "Bab 5: Keemasan Sains Daulah Abbasiyah di Baghdad",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menganalisis sejarah Baitul Hikmah di Baghdad, kiprah ilmuwan muslim (Ibnu Sina, al-Khawarizmi, al-Biruni), dan menyerap etos riset ilmiah demi kemajuan bangsa.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },

  // ==================== KELAS VIII - SEMESTER 2 ====================
  {
    id: "prota-8-2-1",
    kelas: "VIII",
    semester: "2",
    noUrut: 6,
    bab: "Bab 6: Menggapai Ketenangan Hati Melalui Shalat dan Zikir",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Memahami Q.S. ar-Ra'd/13: 28 tentang ketentraman hati melalui zikir serta membiasakan doa harian dan zikir pagi petang (al-Matsurat).",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-8-2-2",
    kelas: "VIII",
    semester: "2",
    noUrut: 7,
    bab: "Bab 7: Meneladani Sifat Amanah dan Tabligh Para Nabi dan Rasul",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami sifat wajib, mustahil, dan jaiz bagi Rasul Allah, mu'jizat, serta meneladani keberanian dan kejujuran Rasul Ulul Azmi dalam menghadapi ujian hidup.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-8-2-3",
    kelas: "VIII",
    semester: "2",
    noUrut: 8,
    bab: "Bab 8: Menghidupkan Budaya Gemar Sedekah dan Murah Hati",
    elemen: "Akhlak",
    tujuanPembelajaran: "Menganalisis keutamaan infak, sedekah, dan hadiah, menjauhi sifat kikir (bakhil) dan riya', serta menggalang donasi kepedulian sosial untuk yatim dan dhuafa.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-8-2-4",
    kelas: "VIII",
    semester: "2",
    noUrut: 9,
    bab: "Bab 9: Menjaga Kehalalan dan Kesejahteraan Melalui Makanan Thayyib",
    elemen: "Fiqih",
    tujuanPembelajaran: "Mengidentifikasi kriteria makanan dan minuman halal lagi baik (halalan thayyiban), ketentuan penyembelihan hewan secara syar'i, dan bahaya zat adiktif perusak jasmani.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-8-2-5",
    kelas: "VIII",
    semester: "2",
    noUrut: 10,
    bab: "Bab 10: Meneladani Tokoh Cendekiawan Muslim Masa Daulah Ayyubiyah",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Meneladani kepemimpinan Shalahuddin al-Ayyubi yang berwawasan luas, toleran, mengayomi rakyat, serta membina benteng ilmu dan rumah sakit pengobatan gratis.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },

  // ==================== KELAS IX - SEMESTER 1 ====================
  {
    id: "prota-9-1-1",
    kelas: "IX",
    semester: "1",
    noUrut: 1,
    bab: "Bab 1: Keragaman dan Toleransi dalam Bingkai Al-Qur'an",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. al-Hujurat/49: 13 tentang keragaman suku bangsa, kesetaraan derajat takwa, dan penerapan prinsip moderasi beragama dalam kehidupan berbangsa.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-9-1-2",
    kelas: "IX",
    semester: "1",
    noUrut: 2,
    bab: "Bab 2: Beriman kepada Hari Akhir (Kiamat) dan Kehidupan Akhirat",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami tanda kiamat sughra dan kubra, tahapan alam barzakh hingga yaumul jaza', serta menumbuhkan kesadaran beramal shalih tanpa menunda waktu.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-9-1-3",
    kelas: "IX",
    semester: "1",
    noUrut: 3,
    bab: "Bab 3: Berbakti kepada Orang Tua dan Guru (Birrul Walidain)",
    elemen: "Akhlak",
    tujuanPembelajaran: "Menelaah dalil naqli kewajiban berbakti kepada orang tua dan ta'zhim kepada guru, adab bertutur kata santun, dan mendoakan kebaikan bagi kedua orang tua yang telah wafat.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-9-1-4",
    kelas: "IX",
    semester: "1",
    noUrut: 4,
    bab: "Bab 4: Zakat Fitrah, Zakat Mal, dan Manajemen Wakaf Produktif",
    elemen: "Fiqih",
    tujuanPembelajaran: "Menghitung nisab dan kadar zakat emas, perak, perdagangan, pertanian, peternakan, serta memahami fungsi strategis wakaf uang untuk pemberdayaan ekonomi umat.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-9-1-5",
    kelas: "IX",
    semester: "1",
    noUrut: 5,
    bab: "Bab 5: Sejarah Masuknya Islam di Nusantara & Peran Wali Songo",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menelaah teori masuknya Islam di Nusantara (Gujarat, Makkah, Persia, Cina), strategi dakwah damai kultural Wali Songo, dan pengaruh kesultanan Islam di Nusantara.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },

  // ==================== KELAS IX - SEMESTER 2 ====================
  {
    id: "prota-9-2-1",
    kelas: "IX",
    semester: "2",
    noUrut: 6,
    bab: "Bab 6: Menggapai Ridha Allah Melalui Ibadah Haji dan Umrah",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. Ali 'Imran/3: 97 tentang kewajiban haji bagi yang mampu (istitha'ah), rukun, wajib, larangan ihram, dan nilai persatuan muslim seluruh dunia.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-9-2-2",
    kelas: "IX",
    semester: "2",
    noUrut: 7,
    bab: "Bab 7: Beriman kepada Qadha dan Qadar (Takdir Allah)",
    elemen: "Akidah",
    tujuanPembelajaran: "Membedakan takdir mu'allaq dan mubram, menyeimbangkan ikhtiar, doa, tawakkal, dan qana'ah dalam menghadapi tantangan era modern tanpa putus asa.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-9-2-3",
    kelas: "IX",
    semester: "2",
    noUrut: 8,
    bab: "Bab 8: Menjaga Kehormatan Diri dari Pergaulan Bebas",
    elemen: "Akhlak",
    tujuanPembelajaran: "Memahami bahaya pergaulan bebas, menjaga pandangan (ghadhul bashar), adab bermedia sosial secara bijak, dan membentengi diri dengan kegiatan positif remaja masjid.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  },
  {
    id: "prota-9-2-4",
    kelas: "IX",
    semester: "2",
    noUrut: 9,
    bab: "Bab 9: Ketentuan Aqiqah dan Qurban dalam Syariat Islam",
    elemen: "Fiqih",
    tujuanPembelajaran: "Memahami syarat hewan aqiqah dan qurban, waktu penyembelihan, pembagian daging secara adil, dan nilai solidaritas sosial peduli kaum mustadh'afin.",
    alokasiWaktuJp: 9,
    keterangan: "3 Pekan x 3 JP"
  },
  {
    id: "prota-9-2-5",
    kelas: "IX",
    semester: "2",
    noUrut: 10,
    bab: "Bab 10: Tradisi dan Akulturasi Budaya Islam di Nusantara",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menganalisis tradisi Islam Nusantara (Sekaten, Grebeg Mulud, Halal bi Halal, Kasada, Tabuik) sebagai wujud kearifan lokal yang tidak bertentangan dengan tauhid.",
    alokasiWaktuJp: 12,
    keterangan: "4 Pekan x 3 JP"
  }
];

export const defaultPromesList: PromesItem[] = [
  // ==================== KELAS VII - SEMESTER 1 (Ganjil: Juli - Desember) ====================
  {
    id: "promes-7-1-1",
    kelas: "VII",
    semester: "1",
    noUrut: 1,
    bab: "Bab 1",
    materiPokok: "Al-Qur'an dan Hadis Pedoman Hidup (Q.S. al-Anbiya/21: 107)",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. al-Anbiya/21: 107 tentang Islam Rahmatan lil 'Alamin, kaidah tajwid, dan hafalan ayat.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      Juli_3: 3,
      Juli_4: 3,
      Agustus_1: 3,
      Agustus_2: 3
    },
    keterangan: "4 Pekan KBM Aktif"
  },
  {
    id: "promes-7-1-2",
    kelas: "VII",
    semester: "1",
    noUrut: 2,
    bab: "Bab 2",
    materiPokok: "Meneladani Nama dan Sifat Allah SWT (Asmaul Husna)",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami makna al-'Alim, al-Khabir, as-Sami', dan al-Bashir serta meneladaninya dalam keseharian.",
    alokasiWaktuJp: 9,
    jadwalMingguan: {
      Agustus_3: 3,
      Agustus_4: 3,
      September_1: 3
    },
    keterangan: "3 Pekan KBM Aktif"
  },
  {
    id: "promes-7-1-3",
    kelas: "VII",
    semester: "1",
    noUrut: 3,
    bab: "Bab 3",
    materiPokok: "Islam Damai Melalui Thaharah & Shalat Berjamaah",
    elemen: "Fiqih",
    tujuanPembelajaran: "Mendeskripsikan ketentuan thaharah dari hadas dan najis, wudhu, tayamum, mandi wajib, serta shalat berjamaah.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      September_2: 3,
      September_3: 3,
      Oktober_1: 3,
      Oktober_2: 3
    },
    keterangan: "4 Pekan KBM Aktif (Dipisah Sumatif Tengah Semester)"
  },
  {
    id: "promes-7-1-4",
    kelas: "VII",
    semester: "1",
    noUrut: 4,
    bab: "Bab 4",
    materiPokok: "Ketundukan Ibadah: Sujud Syukur, Sahwi, dan Tilawah",
    elemen: "Fiqih",
    tujuanPembelajaran: "Menjelaskan ketentuan dan mempraktikkan sujud syukur, sujud sahwi, dan sujud tilawah secara tertib.",
    alokasiWaktuJp: 9,
    jadwalMingguan: {
      Oktober_3: 3,
      Oktober_4: 3,
      Oktober_5: 3
    },
    keterangan: "3 Pekan KBM Aktif"
  },
  {
    id: "promes-7-1-5",
    kelas: "VII",
    semester: "1",
    noUrut: 5,
    bab: "Bab 5",
    materiPokok: "Peradaban Daulah Umayyah di Damaskus",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menelaah sejarah berdirinya Daulah Umayyah di Damaskus dan kemajuan peradaban ilmu pengetahuan.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      November_1: 3,
      November_2: 3,
      November_3: 3,
      November_4: 3
    },
    keterangan: "4 Pekan KBM Aktif"
  },

  // ==================== KELAS VII - SEMESTER 2 (Genap: Januari - Juni) ====================
  {
    id: "promes-7-2-1",
    kelas: "VII",
    semester: "2",
    noUrut: 6,
    bab: "Bab 6",
    materiPokok: "Alam Semesta sebagai Tanda Kekuasaan Allah SWT",
    elemen: "Al-Qur'an dan Hadis",
    tujuanPembelajaran: "Menganalisis Q.S. al-Anbiya/21: 30 dan Q.S. al-A'raf/7: 54, kaidah ghunnah, serta pelestarian lingkungan.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      Januari_1: 3,
      Januari_2: 3,
      Januari_3: 3,
      Januari_4: 3
    },
    keterangan: "4 Pekan KBM Aktif"
  },
  {
    id: "promes-7-2-2",
    kelas: "VII",
    semester: "2",
    noUrut: 7,
    bab: "Bab 7",
    materiPokok: "Mawas Diri dan Beriman kepada Malaikat Allah",
    elemen: "Akidah",
    tujuanPembelajaran: "Memahami tugas malaikat Allah SWT dan membiasakan perilaku mawas diri serta kejujuran.",
    alokasiWaktuJp: 9,
    jadwalMingguan: {
      Februari_1: 3,
      Februari_2: 3,
      Februari_3: 3
    },
    keterangan: "3 Pekan KBM Aktif"
  },
  {
    id: "promes-7-2-3",
    kelas: "VII",
    semester: "2",
    noUrut: 8,
    bab: "Bab 8",
    materiPokok: "Meneladani Sikap Jujur, Amanah, dan Istiqamah",
    elemen: "Akhlak",
    tujuanPembelajaran: "Menerapkan perilaku jujur, amanah, dan istiqamah dalam kegiatan belajar dan pergaulan sekolah.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      Februari_4: 3,
      Maret_1: 3,
      Maret_2: 3,
      Maret_4: 3
    },
    keterangan: "4 Pekan KBM Aktif (Dipisah STS Genap)"
  },
  {
    id: "promes-7-2-4",
    kelas: "VII",
    semester: "2",
    noUrut: 9,
    bab: "Bab 9",
    materiPokok: "Menggapai Berkah Muamalah Tanpa Riba",
    elemen: "Fiqih",
    tujuanPembelajaran: "Memahami prinsip jual beli yang halal, larangan riba, dan kejujuran bertransaksi.",
    alokasiWaktuJp: 9,
    jadwalMingguan: {
      April_1: 3,
      April_2: 3,
      April_3: 3
    },
    keterangan: "3 Pekan KBM Aktif"
  },
  {
    id: "promes-7-2-5",
    kelas: "VII",
    semester: "2",
    noUrut: 10,
    bab: "Bab 10",
    materiPokok: "Dinasti Umayyah di Andalusia (Spanyol)",
    elemen: "Sejarah Peradaban Islam",
    tujuanPembelajaran: "Menelaah sejarah kejayaan Islam di Spanyol (Cordoba), kemajuan sains, dan semangat literasi.",
    alokasiWaktuJp: 12,
    jadwalMingguan: {
      Mei_1: 3,
      Mei_2: 3,
      Mei_3: 3,
      Mei_4: 3
    },
    keterangan: "4 Pekan KBM Aktif"
  }
];

// Definition of months & weeks for Semester 1 (Ganjil: Juli - Desember)
export const BULAN_PROMES_SEM1 = [
  { nama: "Juli", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Agustus", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "September", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Oktober", mingguCount: 5, weeks: [1, 2, 3, 4, 5] },
  { nama: "November", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Desember", mingguCount: 4, weeks: [1, 2, 3, 4] }
];

// Definition of months & weeks for Semester 2 (Genap: Januari - Juni)
export const BULAN_PROMES_SEM2 = [
  { nama: "Januari", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Februari", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Maret", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "April", mingguCount: 4, weeks: [1, 2, 3, 4] },
  { nama: "Mei", mingguCount: 5, weeks: [1, 2, 3, 4, 5] },
  { nama: "Juni", mingguCount: 4, weeks: [1, 2, 3, 4] }
];

// Special event weeks configuration
export const SPECIAL_EVENTS_SEM1: Record<string, { label: string; color: string; full: string }> = {
  Juli_1: { label: "MPLS", color: "bg-amber-100 text-amber-800 border-amber-300", full: "Masa Pengenalan Lingkungan Sekolah (MPLS)" },
  Juli_2: { label: "MPLS", color: "bg-amber-100 text-amber-800 border-amber-300", full: "Masa Ta'aruf Siswa & Pemetaan Awal" },
  September_4: { label: "STS", color: "bg-sky-100 text-sky-800 border-sky-300", full: "Sumatif Tengah Semester (STS) Ganjil" },
  Desember_1: { label: "SAS", color: "bg-rose-100 text-rose-800 border-rose-300", full: "Sumatif Akhir Semester (SAS) Ganjil" },
  Desember_2: { label: "REMED", color: "bg-indigo-100 text-indigo-800 border-indigo-300", full: "Pengolahan Nilai & Remedial / Pengayaan" },
  Desember_3: { label: "RAPORT", color: "bg-purple-100 text-purple-800 border-purple-300", full: "Pembagian Buku Laporan Hasil Belajar (Raport)" },
  Desember_4: { label: "LIBUR", color: "bg-slate-200 text-slate-700 border-slate-300", full: "Libur Akhir Semester Ganjil" }
};

export const SPECIAL_EVENTS_SEM2: Record<string, { label: string; color: string; full: string }> = {
  Maret_3: { label: "STS", color: "bg-sky-100 text-sky-800 border-sky-300", full: "Sumatif Tengah Semester (STS) Genap" },
  April_4: { label: "LIBUR", color: "bg-slate-200 text-slate-700 border-slate-300", full: "Prakiraan Libur Hari Raya Idul Fitri" },
  Mei_5: { label: "SAT", color: "bg-rose-100 text-rose-800 border-rose-300", full: "Sumatif Akhir Tahun (SAT) Kenaikan Kelas" },
  Juni_1: { label: "REMED", color: "bg-indigo-100 text-indigo-800 border-indigo-300", full: "Pengolahan Nilai & Rapat Pleno Kenaikan Kelas" },
  Juni_2: { label: "RAPORT", color: "bg-purple-100 text-purple-800 border-purple-300", full: "Pembagian Raport Semester Genap" },
  Juni_3: { label: "LIBUR", color: "bg-slate-200 text-slate-700 border-slate-300", full: "Libur Akhir Tahun Ajaran" },
  Juni_4: { label: "LIBUR", color: "bg-slate-200 text-slate-700 border-slate-300", full: "Libur Akhir Tahun Ajaran" }
};

// Default pre-packaged PROTA and PROMES documents for PerangkatAjar archive
export const defaultProtaPromesPerangkatAjar: PerangkatAjar[] = [
  {
    id: "doc-prota-vii-resmi",
    kategori: "PROTA",
    judul: "Program Tahunan (PROTA) PAI & Budi Pekerti Kelas VII Kurikulum Merdeka",
    bab: "Administrasi Kurikulum Induk",
    deskripsi: "Dokumen resmi Program Tahunan mencakup alokasi 108 JP, 10 Bab, 5 Elemen PAI, distribusi pekan efektif dan tanda tangan Kepala Sekolah & Guru PAI.",
    fileSize: "1.4 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1",
    uploadedAt: "2024-07-15",
    textContent: `PROGRAM TAHUNAN (PROTA) KURIKULUM MERDEKA
Mata Pelajaran : Pendidikan Agama Islam dan Budi Pekerti
Satuan Pendidikan : UPT SMPN 2 Rebang Tangkas
Fase / Kelas : Fase D / Kelas VII
Tahun Ajaran : 2024/2025
Alokasi Waktu : 3 JP / Minggu x 36 Minggu Efektif = 108 JP

A. SEMESTER 1 (GANJIL) - 54 JP
1. Bab 1: Al-Qur'an dan Hadis Pedoman Hidup (Q.S. al-Anbiya/21: 107) - 12 JP
2. Bab 2: Meneladani Nama dan Sifat Allah SWT (Asmaul Husna) - 9 JP
3. Bab 3: Menghadirkan Islam Damai Melalui Thaharah & Shalat Berjamaah - 12 JP
4. Bab 4: Mengagungkan Nama Allah dengan Ketundukan (Sujud Syukur, Sahwi, Tilawah) - 9 JP
5. Bab 5: Menapaki Jejak Peradaban Islam Daulah Umayyah di Damaskus - 12 JP
Jumlah JP Semester 1: 54 JP

B. SEMESTER 2 (GENAP) - 54 JP
6. Bab 6: Alam Semesta sebagai Tanda Kekuasaan Allah (Q.S. al-Anbiya: 30) - 12 JP
7. Bab 7: Mawas Diri dan Beriman kepada Malaikat-Malaikat Allah - 9 JP
8. Bab 8: Meneladani Sikap Jujur, Amanah, dan Istiqamah dalam Kehidupan - 12 JP
9. Bab 9: Menggapai Berkah Muamalah Tanpa Riba - 9 JP
10. Bab 10: Meneladani Dinasti Umayyah di Andalusia (Spanyol) - 12 JP
Jumlah JP Semester 2: 54 JP

TOTAL ALOKASI WAKTU 1 TAHUN: 108 JP

Mengetahui,
Kepala UPT SMPN 2 Rebang Tangkas
Drs. H. Ahmad Dahlan, M.Pd.
NIP. 196805121994121001

Guru Mata Pelajaran PAI & BP
Sadiqul Alim, S.Pd.I., M.Pd.
NIP. 197909172014071004`
  },
  {
    id: "doc-promes-vii-sem1-resmi",
    kategori: "PROMES",
    judul: "Program Semester (PROMES) PAI & Budi Pekerti Kelas VII Semester Ganjil",
    bab: "Administrasi Semester Ganjil",
    deskripsi: "Matriks distribusi alokasi waktu mingguan per bulan (Juli s.d. Desember), 18 minggu KBM efektif, kalender MPLS, STS, SAS, dan pembagian raport.",
    fileSize: "1.2 MB",
    downloadUrl: "#",
    mediaType: "Excel",
    kelas: "VII",
    semester: "1",
    uploadedAt: "2024-07-15"
  },
  {
    id: "doc-promes-vii-sem2-resmi",
    kategori: "PROMES",
    judul: "Program Semester (PROMES) PAI & Budi Pekerti Kelas VII Semester Genap",
    bab: "Administrasi Semester Genap",
    deskripsi: "Matriks program semester genap (Januari s.d. Juni) dengan pemetaan alokasi 54 JP materi bab 6-10, STS, SAT, dan kenaikan kelas.",
    fileSize: "1.2 MB",
    downloadUrl: "#",
    mediaType: "Word",
    kelas: "VII",
    semester: "2",
    uploadedAt: "2025-01-06"
  },
  {
    id: "doc-prota-viii-resmi",
    kategori: "PROTA",
    judul: "Program Tahunan (PROTA) PAI & Budi Pekerti Kelas VIII Kurikulum Merdeka",
    bab: "Administrasi Kurikulum Induk",
    deskripsi: "Dokumen lengkap PROTA Kelas VIII Fase D tahun ajaran 2024/2025 dengan 10 bab dan alokasi 108 JP.",
    fileSize: "1.3 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "VIII",
    semester: "1",
    uploadedAt: "2024-07-15"
  },
  {
    id: "doc-promes-viii-resmi",
    kategori: "PROMES",
    judul: "Program Semester (PROMES) PAI & Budi Pekerti Kelas VIII Lengkap",
    bab: "Administrasi Semester",
    deskripsi: "Matriks distribusi mingguan KBM PAI Kelas VIII semester ganjil dan genap.",
    fileSize: "1.1 MB",
    downloadUrl: "#",
    mediaType: "Excel",
    kelas: "VIII",
    semester: "1",
    uploadedAt: "2024-07-15"
  },
  {
    id: "doc-prota-ix-resmi",
    kategori: "PROTA",
    judul: "Program Tahunan (PROTA) PAI & Budi Pekerti Kelas IX Kurikulum Merdeka",
    bab: "Administrasi Kurikulum Induk",
    deskripsi: "Dokumen resmi PROTA Kelas IX dengan materi toleransi, hari akhir, zakat & wakaf, haji umrah, serta sejarah Islam Nusantara.",
    fileSize: "1.3 MB",
    downloadUrl: "#",
    mediaType: "PDF",
    kelas: "IX",
    semester: "1",
    uploadedAt: "2024-07-15"
  },
  {
    id: "doc-promes-ix-resmi",
    kategori: "PROMES",
    judul: "Program Semester (PROMES) PAI & Budi Pekerti Kelas IX Lengkap",
    bab: "Administrasi Semester",
    deskripsi: "Matriks distribusi mingguan KBM PAI Kelas IX semester ganjil dan genap.",
    fileSize: "1.1 MB",
    downloadUrl: "#",
    mediaType: "Word",
    kelas: "IX",
    semester: "1",
    uploadedAt: "2024-07-15"
  }
];
