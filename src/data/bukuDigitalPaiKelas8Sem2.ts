/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BabBukuPai8 } from "../types/bukuPaiAi";

export const BAB_SEMESTER_2_KELAS_8: BabBukuPai8[] = [
  // =========================================================================
  // BAB 6: INSPIRASI AL-QUR'AN: CINTA TANAH AIR & HUKUM NUN SUKUN/TANWIN
  // =========================================================================
  {
    babNomor: 6,
    semester: 2,
    judulBab: "Inspirasi Al-Qur'an: Membangun Jiwa Nasionalisme dan Cinta Tanah Air",
    tujuanPembelajaran: [
      "Membaca Q.S. An-Nisa/4: 66 dan hadis tentang kecintaan pada tanah air dengan tartil dan fasih.",
      "Mengidentifikasi serta mempraktikkan 5 hukum bacaan Nun Sukun dan Tanwin (Izhar Halqi, Idgham Bigunnah, Idgham Bilagunnah, Iqlab, dan Ikhfa Haqiqi).",
      "Menjelaskan hakikat cinta tanah air (hubbul wathan) sebagai bagian dari cerminan keimanan (minal iman).",
      "Meneladani semangat Rasulullah SAW saat mencintai tanah kelahiran Makkah dan membela Madinah.",
      "Membiasakan sikap bela negara, menjaga persatuan, dan merawat fasilitas umum bangsa.",
      "Menghasilkan karya kaligrafi atau poster bertema cinta tanah air dan moderasi beragama."
    ],
    kataKunci: ["Hubbul Wathan", "Nun Sukun", "Tanwin", "Izhar", "Idgham", "Iqlab", "Ikhfa", "Bela Negara"],
    petaKonsep: [
      "Kajian Dalil → QS. An-Nisa: 66 & Hadis Cinta Tanah Air",
      "Hukum Tajwid Nun Sukun / Tanwin → Izhar Halqi, Idgham Bigunnah, Idgham Bilagunnah, Iqlab, Ikhfa Haqiqi",
      "Nilai Nasionalisme Islami → Bela Negara, Menghargai Simbol Negara, Gotong Royong",
      "Karakter Pelajar → Berprestasi untuk Bangsa, Menjaga Kerukunan, Cinta Produk Dalam Negeri"
    ],
    ayoMengamati: {
      deskripsi: "Para siswa SMP dengan seragam rapi sedang mengikuti upacara bendera hari Senin dengan sikap tegap dan khidmat menghormat bendera Merah Putih.",
      imagePrompt: "Educational illustration of Indonesian junior high school students standing in neat rows during Monday flag ceremony, saluting Indonesian national flag reverently, crisp morning sunlight, modern Islamic textbook style, 16:9",
      pertanyaanPengamatan: [
        "Sikap apa yang ditunjukkan oleh para siswa saat upacara pengibaran bendera merah putih?",
        "Mengapa menghormati bendera dan menyanyikan lagu Indonesia Raya berkaitan erat dengan kecintaan pada tanah air?",
        "Bagaimana cara generasi muda masa kini membela tanah air di era kemerdekaan?"
      ],
      hubunganMateri: "Mencintai tanah air, menjaga kedaulatan bangsa, dan menghargai jasa para pahlawan merupakan perwujudan syukur atas nikmat kemerdekaan yang dianugerahkan Allah SWT.",
      captionGambar: "Ilustrasi 6.1: Menjunjung tinggi kehormatan bendera merah putih sebagai cermin cinta tanah air."
    },
    ayoBerpikir: [
      "Rasulullah SAW meneteskan air mata saat harus hijrah meninggalkan kota Makkah karena kecintaan beliau yang mendalam pada tanah kelahirannya. Apa pelajaran berharga bagi kita tentang hubungan antara iman dan nasionalisme?",
      "Apakah mencintai tanah air bertentangan dengan prinsip persaudaraan umat Islam sedunia (Ukhuwah Islamiyah)?"
    ],
    tajwid: {
      judulTajwid: "Kaidah Hukum Bacaan Nun Sukun (نْ) dan Tanwin (ً ٍ ٌ)",
      penjelasanKaidah: "Apabila nun sukun atau tanwin bertemu dengan salah satu dari 28 huruf hijaiyah, hukum bacaannya terbagi menjadi 5 kategori:\n1. Izhar Halqi: Dibaca jelas tanpa dengung jika bertemu 6 huruf tenggorokan (ء, هـ, ع, ح, غ, خ).\n2. Idgham Bigunnah: Dilebur dengan mendengung 2 harakat jika bertemu 4 huruf (ي, ن, م, و).\n3. Idgham Bilagunnah: Dilebur tanpa dengung jika bertemu 2 huruf (ل, ر).\n4. Iqlab: Suara nun/tanwin diganti menjadi bunyi mim samar mendengung jika bertemu huruf ba (ب).\n5. Ikhfa Haqiqi: Dibaca samar-samar antara izhar dan idgham disertai dengung jika bertemu 15 huruf (ت, ث, ج, د, ذ, ز, س, ش, ص, ض, ط, ظ, ف, ق, ك).",
      hurufHijaiyah: ["ء", "هـ", "ع", "ح", "غ", "خ", "ي", "ن", "م", "و", "ل", "ر", "ب", "ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
      contohList: [
        { lafaz: "مَنْ ءَامَنَ", surahAyat: "QS. Al-Baqarah: 62", hukum: "Izhar Halqi", caraBaca: "Man aamana (Jelas tanpa dengung)", penjelasan: "Nun sukun bertemu huruf Hamzah" },
        { lafaz: "مَن يَقُولُ", surahAyat: "QS. Al-Baqarah: 8", hukum: "Idgham Bigunnah", caraBaca: "May yaquulu (Melebur berdengung)", penjelasan: "Nun sukun bertemu huruf Ya" },
        { lafaz: "مِّن رَّبِّهِمْ", surahAyat: "QS. Al-Baqarah: 5", hukum: "Idgham Bilagunnah", caraBaca: "Mir rabbihim (Melebur tanpa dengung)", penjelasan: "Nun sukun bertemu huruf Ra" },
        { lafaz: "مِنۢ بَعْدِ", surahAyat: "QS. Al-Baqarah: 27", hukum: "Iqlab", caraBaca: "Mim ba'di (Berubah jadi mim dengung)", penjelasan: "Nun sukun bertemu huruf Ba" },
        { lafaz: "مِن قَبْلُ", surahAyat: "QS. Al-Baqarah: 25", hukum: "Ikhfa Haqiqi", caraBaca: "Ming qablu (Samar dengung)", penjelasan: "Nun sukun bertemu huruf Qaf" }
      ]
    },
    materiPembelajaran: [
      {
        subJudul: "1. Hubbul Wathan Minal Iman: Cinta Tanah Air dalam Perspektif Islam",
        konten: "Cinta tanah air merupakan fitrah naluriah manusia yang diakui dan dimuliakan dalam ajaran Islam. Para ulama merumuskan kaidah 'Hubbul wathan minal iman' (mencintai tanah air adalah cerminan dari kesempurnaan iman). Dalam QS. An-Nisa ayat 66, Allah menyejajarkan antara beratnya ujian mengorbankan jiwa dengan ujian meninggalkan tanah tumpah darah. Ini menunjukkan bahwa tanah air memiliki tempat yang sangat mulia dalam hati setiap manusia beriman.",
        poinKunci: [
          "Cinta tanah air sejalan dengan tuntunan fitrah dan syariat Islam",
          "Kesejajaran cinta jiwa dan cinta tanah air dalam QS. An-Nisa: 66",
          "Kemerdekaan Indonesia adalah berkah rahmat Allah yang wajib disyukuri"
        ]
      },
      {
        subJudul: "2. Keteladanan Rasulullah SAW dalam Mencintai Tanah Air",
        konten: "Ketika kaum musyrikin Makkah memaksa Rasulullah SAW untuk berhijrah, beliau memandang Makkah dari bukit seraya bersabda dengan penuh haru: 'Demi Allah, engkau adalah bumi Allah yang paling aku cintai dan tanah yang paling mulia di sisi-Nya. Seandainya pendudukmu tidak mengusirku, niscaya aku tidak akan keluar' (HR. At-Tirmidzi). Setibanya di Madinah, beliau tidak hanya mencintai tanah baru tersebut, namun juga berdoa agar Allah menumbuhkan kecintaan terhadap Madinah sebagaimana cinta beliau pada Makkah, serta merumuskan Piagam Madinah untuk membela kedaulatan tanah air bersama seluruh elemen masyarakat.",
        poinKunci: [
          "Kerinduan dan doa Rasulullah SAW untuk tanah air Makkah dan Madinah",
          "Bela negara melalui konstitusi bersama di Madinah",
          "Tanggung jawab menjaga keutuhan Negara Kesatuan Republik Indonesia (NKRI)"
        ]
      },
      {
        subJudul: "3. Peran Pelajar Muslim dalam Mengisi Kemerdekaan",
        konten: "Bagi pelajar SMP, wujud cinta tanah air bukan lagi dengan memanggul senjata di medan laga, melainkan:\n1. Belajar tekun untuk mencerdaskan kehidupan bangsa.\n2. Merawat kerukunan di tengah kebinekaan suku, agama, dan budaya.\n3. Bangga menggunakan produk dalam negeri dan melestarikan budaya adiluhung bangsa.\n4. Menjaga ketertiban hukum dan fasilitas umum sekolah serta tempat ibadah.\n5. Menjadi duta perdamaian yang menolak radikalisme, tawuran, dan hoaks pemecah belah bangsa.",
        poinKunci: [
          "Belajar sungguh-sungguh sebagai jihad intelektual pelajar",
          "Bangga berbahasa Indonesia dan mencintai produk lokal",
          "Menjaga kerukunan sosial dan menolak provokasi perpecahan"
        ]
      }
    ],
    dalilTerkait: [
      {
        kategori: "Al-Qur'an",
        surah: "QS. An-Nisa",
        nomorAyat: "66",
        teksArab: "وَلَوْ أَنَّا كَتَبْنَا عَلَيْهِمْ أَنِ ٱقْتُلُوٓا۟ أَنفُسَكُمْ أَوِ ٱخْرُجُوا۟ مِن دِيَـٰرِكُم مَّا فَعَلُوهُ إِلَّا قَلِيلٌۭ مِّنْهُمْ",
        latin: "Walau annā katabnā 'alaihim aniqtulū anfusakum awikhrujū min diyārikum mā fa'alūhu illā qalīlum minhum.",
        terjemahan: "Dan sekalipun telah Kami perintahkan kepada mereka: 'Bunuhlah dirimu atau keluarlah kamu dari kampung halamanmu', niscaya mereka tidak akan melakukannya kecuali sebagian kecil dari mereka.",
        tafsirSingkat: "Ayat ini menunjukkan betapa beratnya meninggalkan tanah air, disandingkan dengan beratnya mengorbankan nyawa, karena manusia memiliki ikatan batiniah yang kuat dengan kampung halamannya.",
        kosakataTerpilih: [
          { lafaz: "ٱخْرُجُوا", arti: "Keluarlah kalian" },
          { lafaz: "مِن دِيَارِكُمْ", arti: "Dari kampung halaman / tanah airmu" },
          { lafaz: "إِلَّا قَلِيلٌ", arti: "Kecuali sebagian kecil" }
        ]
      },
      {
        kategori: "Hadis",
        surah: "HR. At-Tirmidzi & Ahmad",
        nomorAyat: "Sunan At-Tirmidzi No. 3926",
        teksArab: "مَا أَطْيَبَكِ مِنْ بَلَدٍ وَأَحَبَّكِ إِلَيَّ وَلَوْلَا أَنَّ قَوْمِي أَخْرَجُونِي مِنْكِ مَا سَكَنْتُ غَيْرَكِ",
        latin: "Mā aṭyabaki min baladiw wa aḥabbaki ilayya, wa lau lā anna qaumī akhrajūnī minki mā sakantu gairaki.",
        terjemahan: "Alangkah indahnya dirimu wahai tanah airku, dan alangkah cintanya aku kepadamu! Seandainya kaumku tidak mengusirku darimu, niscaya aku tidak akan bertempat tinggal di tempat selainmu.",
        tafsirSingkat: "Sabda Nabi Muhammad SAW ini membuktikan kecintaan yang mendalam seorang rasul terhadap tanah kelahirannya sebagai fitrah yang terpuji.",
        kosakataTerpilih: [
          { lafaz: "مَا أَطْيَبَكِ", arti: "Alangkah indahnya engkau" },
          { lafaz: "مِنْ بَلَدٍ", arti: "Dari sebuah negeri / tanah air" },
          { lafaz: "وَأَحَبَّكِ إِلَيَّ", arti: "Dan alangkah cintanya aku kepadamu" }
        ]
      }
    ],
    contohKehidupan: [
      "Mengikuti upacara bendera hari Senin dengan tertib, khidmat, dan tanpa bercanda.",
      "Menggunakan bahasa Indonesia yang baik dan benar serta mencintai bahasa daerah.",
      "Membeli jajanan produk lokal UMKM dan bangga memakai pakaian batik nusantara.",
      "Tidak merusak fasilitas umum (halte, rambu jalan, taman kota) atau mencoret-coret tembok sekolah.",
      "Menghargai pahlawan kemerdekaan dengan mendoakan mereka setiap selesai salat."
    ],
    aktivitasIndividu: [
      "Carilah 5 contoh hukum bacaan Nun Sukun dan Tanwin (Izhar, Idgham, Iqlab, Ikhfa) dari Surah An-Nisa ayat 66 atau surat lain di juz 30, lalu tuliskan dalam tabel analisis.",
      "Tuliskan sebuah esai mini (300 kata) bertema 'Kontribusiku sebagai Pelajar Muslim untuk Kemajuan Indonesia'."
    ],
    aktivitasKelompok: [
      "Bentuk kelompok beranggotakan 4 siswa. Buatlah kartu permainan 'Kuis Cepat Tajwid Nun Sukun' untuk saling mengetes hukum bacaan di kelas.",
      "Buat video pendek vlog berdurasi 2 menit tentang 'Aksi Nyata Pelajar SMP Cinta Lingkungan Sekolah sebagai Wujud Bela Negara'."
    ],
    studiKasus: [
      {
        judulKasus: "Aksi Vandalisme Fasilitas Taman Kota oleh Remaja",
        deskripsi: "Sekelompok remaja kedapatan mencoret-coret bangku taman kota dan merusak lampu penerangan jalan dengan cat semprot hanya untuk menunjukkan eksistensi geng sekolah mereka.",
        pertanyaan: [
          "Apakah perbuatan merusak fasilitas umum sesuai dengan nilai cinta tanah air yang diajarkan Islam?",
          "Bagaimana pandangan syariat Islam terhadap orang yang berbuat fasad (kerusakan) di muka bumi?",
          "Solusi kreatif apa yang dapat menyalurkan bakat seni remaja tersebut secara positif dan bermanfaat?"
        ],
        solusiGuru: "Merusak fasilitas umum bertentangan dengan ajaran Islam tentang larangan berbuat fasad dan melanggar hak publik. Bakat menggambar cat semprot dapat disalurkan melalui kompetisi mural resmi sekolah bertema 'Pesona Indonesia' atau dekorasi dinding musala."
      }
    ],
    ayoBerdiskusi: [
      "Bagaimana cara kita membela kehormatan bangsa Indonesia di era globalisasi ketika berselancar di dunia maya internasional?",
      "Mengapa hukum tajwid Nun Sukun dan Tanwin sangat penting dikuasai dalam menjaga keindahan dan makna bacaan Al-Qur'an?"
    ],
    latihan: {
      pilihanGanda: [
        {
          id: "pg-k8-6-1",
          pertanyaan: "Hukum bacaan nun sukun bertemu huruf Ba (ب) dalam ilmu tajwid disebut...",
          opsi: ["A. Izhar Halqi", "B. Idgham Bigunnah", "C. Iqlab", "D. Ikhfa Haqiqi"],
          kunciJawaban: 2,
          pembahasan: "Iqlab terjadi apabila nun sukun atau tanwin bertemu huruf ba, suara berubah menjadi mim disertai dengung."
        },
        {
          id: "pg-k8-6-2",
          pertanyaan: "Berikut ini yang merupakan huruf-huruf Idgham Bigunnah adalah...",
          opsi: ["A. ي, ن, م, و", "B. ل, ر", "C. ء, هـ, ع, ح", "D. ت, ث, ج, د"],
          kunciJawaban: 0,
          pembahasan: "Huruf Idgham Bigunnah terangkum dalam lafaz Yanmu (ي, ن, م, و)."
        },
        {
          id: "pg-k8-6-3",
          pertanyaan: "Ungkapan masyhur para ulama nusantara tentang hubungan cinta tanah air dengan keimanan adalah...",
          opsi: ["A. Al-Ilmu Nurun", "B. Hubbul Wathan Minal Iman", "C. Al-Aqlus Salim fil Jismis Salim", "D. An-Nazhafatu Minal Iman"],
          kunciJawaban: 1,
          pembahasan: "'Hubbul wathan minal iman' bermakna mencintai tanah air adalah sebagian dari tanda kesempurnaan iman."
        }
      ],
      isianSingkat: [
        {
          id: "is-k8-6-1",
          pertanyaan: "Hukum bacaan yang artinya membaca nun sukun atau tanwin secara jelas dan terang tanpa dengung disebut...",
          kunciJawaban: "Izhar Halqi",
          pembahasan: "Izhar Halqi dibaca jelas saat bertemu 6 huruf halq (tenggorokan)."
        },
        {
          id: "is-k8-6-2",
          pertanyaan: "Kota yang sangat dicintai oleh Rasulullah SAW sebagai tanah kelahirannya sebelum beliau berhijrah adalah kota...",
          kunciJawaban: "Makkah Al-Mukarramah",
          pembahasan: "Rasulullah sangat mencintai kota Makkah sebagai tanah air kelahirannya."
        }
      ],
      benarSalah: [
        {
          id: "bs-k8-6-1",
          pernyataan: "Hukum Idgham Bilagunnah dibaca dengan meleburkan suara nun sukun disertai dengung yang panjang selama 3 harakat.",
          jawabanBenar: false,
          pembahasan: "Salah. Idgham Bilagunnah (bertemu Lam dan Ra) dibaca melebur tanpa dengung sama sekali."
        },
        {
          id: "bs-k8-6-2",
          pernyataan: "Merawat fasilitas umum dan menjaga kelestarian alam lingkungan Indonesia termasuk bagian dari amal saleh bela negara.",
          jawabanBenar: true,
          pembahasan: "Benar. Merawat bumi pertiwi dan sarana publik adalah bentuk nyata syukur atas nikmat tanah air."
        }
      ],
      menjodohkan: [
        { id: "mj-k8-6-1", pertanyaan: "Izhar Halqi", pasanganJawaban: "Dibaca jelas tanpa dengung (6 huruf)" },
        { id: "mj-k8-6-2", pertanyaan: "Idgham Bigunnah", pasanganJawaban: "Melebur disertai dengung 2 harakat (ي, ن, م, و)" },
        { id: "mj-k8-6-3", pertanyaan: "Idgham Bilagunnah", pasanganJawaban: "Melebur tanpa dengung (ل, ر)" },
        { id: "mj-k8-6-4", pertanyaan: "Iqlab", pasanganJawaban: "Mengubah bunyi nun jadi mim samar bertemu huruf Ba" },
        { id: "mj-k8-6-5", pertanyaan: "Ikhfa Haqiqi", pasanganJawaban: "Membaca samar antara izhar dan idgham (15 huruf)" }
      ],
      uraian: [
        {
          id: "ur-k8-6-1",
          pertanyaan: "Sebutkan 5 huruf hukum bacaan Nun Sukun dan Tanwin, lalu jelaskan perbedaan mendasar antara Izhar Halqi dan Ikhfa Haqiqi!",
          rubrikPenilaian: "Memuat: 5 hukum (Izhar, Idgham Bigunnah, Idgham Bilagunnah, Iqlab, Ikhfa). Penjelasan: Izhar dibaca jelas tanpa dengung, sedangkan Ikhfa dibaca samar-samar disertai dengung."
        }
      ],
      hots: [
        {
          id: "ht-k8-6-1",
          pertanyaan: "Sebagai seorang pelajar muslim di era modern, bagaimana strategi kalian dalam menyikapi paham ekstrimisme yang ingin mengganti ideologi Pancasila dan memecah belah keutuhan NKRI?",
          panduanJawaban: "1) Mengukuhkan pemahaman Islam wasathiyyah (moderat), 2) Menegaskan bahwa Pancasila adalah konsensus kebangsaan (Mu'ahadah Wathaniyyah) yang selaras dengan Piagam Madinah, 3) Aktif berprestasi dan mengkampanyekan persatuan di media sosial."
        }
      ]
    },
    refleksi: {
      pengantar: "Tinjau kembali rasa kepedulian dan baktimu kepada nusa dan bangsa Indonesia:",
      pertanyaanRefleksi: [
        "Apakah saya sudah bersikap disiplin dan khidmat saat menyanyikan lagu kebangsaan Indonesia Raya?",
        "Bagaimana kepedulian saya terhadap kebersihan lingkungan sekolah dan fasilitas umum?",
        "Apakah bacaan Al-Qur'an saya sudah memperhatikan kaidah hukum Nun Sukun dan Tanwin dengan benar?"
      ],
      sikapDiterapkan: "Mencintai tanah air dengan berprestasi dan merawat persaudaraan sebangsa.",
      kebiasaanDilakukan: "Menghafal tajwid Al-Qur'an dan menjaga ketertiban di lingkungan masyarakat."
    },
    rangkuman: [
      "Cinta tanah air (hubbul wathan) merupakan bagian dari keluhuran iman yang dicontohkan langsung oleh Rasulullah SAW.",
      "QS. An-Nisa: 66 menyejajarkan kecintaan pada jiwa dengan kecintaan pada kampung halaman.",
      "Hukum Nun Sukun dan Tanwin terbagi menjadi 5: Izhar Halqi, Idgham Bigunnah, Idgham Bilagunnah, Iqlab, dan Ikhfa Haqiqi.",
      "Pelajar muslim mengisi kemerdekaan melalui prestasi belajar, penguasaan ilmu tajwid, dan menjaga persatuan bangsa.",
      "Merawat fasilitas umum dan menjaga kerukunan antarumat beragama adalah wujud nyata bela negara."
    ],
    pengayaan: {
      judul: "Peran Ulama dan Santri dalam Resolusi Jihad 22 Oktober 1945",
      deskripsi: "Pelajari sejarah lahirnya Resolusi Jihad yang dicetuskan oleh KH. Hasyim Asy'ari yang menegaskan bahwa membela tanah air dari penjajah hukumnya fardu 'ain bagi setiap muslim.",
      referensiLanjut: "Buku Sejarah Perjuangan Umat Islam Indonesia dan Ensiklopedia Tokoh Pahlawan Nasional Santri."
    },
    remedial: {
      fokusMateri: "Identifikasi 5 hukum bacaan nun sukun dan tanwin beserta contoh lafaznya.",
      kegiatan: "Menandai hukum bacaan tajwid pada lembar kerja Surah Al-Baqarah ayat 1-10 dengan pensil warna berbeda."
    },
    evaluasi: [
      "Tuliskan dalil hadis yang menunjukkan kecintaan Rasulullah SAW terhadap tanah air Makkah!",
      "Sebutkan 4 huruf Idgham Bigunnah beserta contoh lafaznya!",
      "Bagaimana cara membaca hukum Iqlab dalam tilawah Al-Qur'an?"
    ],
    glosarium: [
      { istilah: "Hubbul Wathan", arti: "Rasa cinta, bangga, dan komitmen membela tanah air tempat tumpah darah." },
      { istilah: "Izhar", arti: "Membaca huruf secara terang, jelas, dan tegas tanpa dengung." },
      { istilah: "Idgham", arti: "Memasukkan atau meleburkan bunyi suatu huruf ke dalam huruf berikutnya." },
      { istilah: "Iqlab", arti: "Mengganti atau menukar bunyi nun sukun menjadi bunyi mim." },
      { istilah: "Ikhfa", arti: "Menyamarkan bacaan antara izhar dan idgham disertai gunnah (dengung)." }
    ],
    daftarPustaka: [
      "Kementerian Agama RI, Al-Qur'an dan Terjemahannya, Lajnah Pentashihan Mushaf, Jakarta, 2019.",
      "Imam Al-Jazari, Al-Muqaddimah Al-Jazariyyah fi 'Ilmit Tajwid, Darul Kutub Al-Ilmiyyah, Beirut.",
      "Kemendikbudristek, Buku Panduan Guru PAI dan Budi Pekerti SMP Kelas VIII, Jakarta, 2021."
    ],
    verification: {
      status: "Terverifikasi",
      catatan: "Kaidah tajwid diselaraskan dengan kitab Jazariyyah dan Tuhfatul Athfal standar Kemenag RI."
    },
    gameList: [
      { tipe: "Tebak Tajwid", judul: "Detektif Nun Sukun & Tanwin", deskripsi: "Tentukan hukum bacaan lafaz ayat yang muncul dalam waktu 5 detik." },
      { tipe: "Kuis Wawasan", judul: "Pahlawan & Cinta Tanah Air", deskripsi: "Jawab kuis seputar keteladanan pahlawan muslim pembela kemerdekaan Indonesia." }
    ]
  },

  // =========================================================================
  // BAB 7: IMAN KEPADA RASUL-RASUL ALLAH SWT
  // =========================================================================
  {
    babNomor: 7,
    semester: 2,
    judulBab: "Meyakini dan Merefleksikan Iman kepada Rasul-Rasul Allah SWT",
    tujuanPembelajaran: [
      "Menjelaskan pengertian beriman kepada rasul-rasul Allah SWT sebagai rukun iman keempat.",
      "Membedakan pengertian antara nabi dan rasul serta menyebutkan 25 nabi/rasul yang wajib diketahui.",
      "Menganalisis gelar Ulul Azmi beserta kriteria kesabaran dan keteguhan lima rasul penerimanya.",
      "Menjelaskan pengertian dan jenis mukjizat (mukjizat hissi/material dan mukjizat maknawi/spiritual).",
      "Mengambil ibrah perjuangan dakwah para nabi dalam menghadapi cobaan dan penolakan kaumnya.",
      "Meneladani karakter kesabaran, optimisme, dan ketabahan para rasul dalam kehidupan sehari-hari."
    ],
    kataKunci: ["Iman kepada Rasul", "Nabi dan Rasul", "Ulul Azmi", "Mukjizat Hissi", "Mukjizat Maknawi", "Shabar"],
    petaKonsep: [
      "Hakikat Rukun Iman ke-4 → Mengimani Utusan Allah Pembawa Risalah",
      "Perbedaan Nabi & Rasul → Wahyu untuk Diri Sendiri vs Kewajiban Menyampaikan ke Kaum",
      "5 Rasul Ulul Azmi → Nuh as, Ibrahim as, Musa as, Isa as, Muhammad SAW (Singkatan: NIMIM)",
      "Mukjizat Para Rasul → Bukti Kenabian (Hissi: Tongkat/Bulan Terbelah vs Maknawi: Al-Qur'an)",
      "Nilai Karakter → Keteguhan Hati, Anti-Putus Asa, Sabar Menghadapi Ujian"
    ],
    ayoMengamati: {
      deskripsi: "Seorang siswa yang sedang duduk di kursi roda karena cedera tetap tersenyum ceria dan tekun belajar bersama teman-temannya di dalam kelas.",
      imagePrompt: "Educational illustration of Indonesian junior high school student in wheelchair studying enthusiastically with classmates in bright supportive classroom, joyful patient smile, modern Islamic textbook style, 16:9",
      pertanyaanPengamatan: [
        "Sikap mulia apa yang ditunjukkan oleh siswa yang sedang menghadapi keterbatasan fisik tersebut?",
        "Bagaimana ketabahan para nabi dan rasul menginspirasi kita untuk tidak mudah putus asa saat menghadapi cobaan hidup?",
        "Apa peran teman-teman sekelas dalam memberikan dukungan moral dan persahabatan?"
      ],
      hubunganMateri: "Kesabaran dan keikhlasan menghadapi ujian hidup adalah cerminan dari keteladanan agung para rasul Allah SWT.",
      captionGambar: "Ilustrasi 7.1: Meneladani keteguhan dan kesabaran para nabi menghadapi setiap rintangan."
    },
    ayoBerpikir: [
      "Mengapa Allah SWT mengutus para rasul dari kalangan manusia biasa, bukan dari bangsa malaikat?",
      "Nabi Nuh as berdakwah selama 950 tahun namun pengikutnya hanya sedikit. Mengapa kesuksesan dakwah seorang rasul tidak diukur dari banyaknya jumlah pengikut?"
    ],
    materiPembelajaran: [
      {
        subJudul: "1. Pengertian dan Perbedaan Antara Nabi dan Rasul",
        konten: "Iman kepada rasul adalah rukun iman keempat. Secara bahasa, nabi berasal dari kata 'naba' (berita), yaitu manusia pilihan yang diberi wahyu oleh Allah untuk dirinya sendiri dan tidak dibebani kewajiban menyampaikan risalah kepada kaumnya. Sedangkan rasul berasal dari kata 'irsāl' (mengutus), yaitu manusia laki-laki pilihan yang menerima wahyu dan mendapat tugas suci untuk menyampaikannya kepada umatnya. Setiap rasul pasti nabi, namun tidak setiap nabi adalah rasul. Jumlah nabi sangat banyak, namun yang wajib diketahui namanya ada 25 nabi/rasul.",
        poinKunci: [
          "Nabi: menerima wahyu untuk diri sendiri",
          "Rasul: menerima wahyu dan wajib mendakwahkan kepada umatnya",
          "25 Nabi dan Rasul yang wajib diimani secara tafshili dari Adam as hingga Muhammad SAW"
        ]
      },
      {
        subJudul: "2. Mengenal Lima Rasul Ulul Azmi (NIMIM)",
        konten: "Gelar Ulul Azmi ('Ūlul 'Azmi) diberikan kepada rasul-rasul yang memiliki ketabahan, kesabaran, dan keteguhan hati luar biasa dalam menghadapi penentangan dan kezaliman kaumnya. Terdapat lima rasul yang bergelar Ulul Azmi, disingkat NIMIM:\n1. Nabi Nuh as: Sabar berdakwah hampir 1.000 tahun meski diejek dan anaknya Kan'an ingkar.\n2. Nabi Ibrahim as: Tabah dibakar oleh Raja Namrud dan rela mengorbankan putranya demi perintah Allah.\n3. Nabi Musa as: Teguh menghadapi tirani Firaun yang bengis serta kesombongan Bani Israil.\n4. Nabi Isa as: Ikhlas menyebarkan kasih sayang meski dikhianati dan hendak disalib oleh kaumnya.\n5. Nabi Muhammad SAW: Puncak kesabaran menghadapi boikot, pelemparan batu di Thaif, dan perang membela tauhid.",
        poinKunci: [
          "Ulul Azmi: Rasul yang memiliki azam (keteguhan hati dan kesabaran) luar biasa",
          "Lima rasul Ulul Azmi: Nuh as, Ibrahim as, Musa as, Isa as, Muhammad SAW",
          "Menjadi teladan resiliensi dan daya tahan moral menghadapi masa-masa sulit"
        ]
      },
      {
        subJudul: "3. Mukjizat Para Rasul: Bukti Kebenaran Risalah",
        konten: "Allah membekali para rasul dengan mukjizat (kejadian luar biasa yang melemahkan tantangan musuh dan tidak dapat ditiru oleh manusia biasa). Mukjizat terbagi dua:\n1. Mukjizat Hissi (Material/Indrawi): Dapat disaksikan langsung oleh mata dan terikat ruang/waktu. Contoh: Kapal besar Nabi Nuh, api menjadi dingin bagi Nabi Ibrahim, tongkat membelah lautan bagi Nabi Musa, dan menyembuhkan orang buta bagi Nabi Isa.\n2. Mukjizat Maknawi (Rasional/Spiritual): Bersifat kekal, dapat dipahami sepanjang masa melalui akal pikiran dan tadabbur. Mukjizat maknawi terbesar adalah kitab suci Al-Qur'an yang diturunkan kepada Nabi Muhammad SAW.",
        poinKunci: [
          "Mukjizat bertujuan membuktikan kebenaran wahyu Allah",
          "Mukjizat hissi bersifat kasat mata untuk umat terdahulu",
          "Al-Qur'an adalah mukjizat maknawi abadi yang terus relevan hingga akhir zaman"
        ]
      }
    ],
    dalilTerkait: [
      {
        kategori: "Al-Qur'an",
        surah: "QS. Al-Ahqaf",
        nomorAyat: "35",
        teksArab: "فَٱصْبِرْ كَمَا صَبَرَ أُو۟لُوا۟ ٱلْعَزْمِ مِنَ ٱلرُّسُلِ وَلَا تَسْتَعْجِل لَّهُمْ",
        latin: "Faṣbir kamā ṣabara ulul-'azmi minar-rusuli wa lā tasta'jil lahum.",
        terjemahan: "Maka bersabarlah engkau (Muhammad) sebagaimana kesabaran rasul-rasul yang memiliki keteguhan hati (Ulul Azmi), dan janganlah engkau meminta agar azab disegerakan untuk mereka.",
        tafsirSingkat: "Allah memerintahkan Nabi Muhammad SAW dan orang-orang beriman untuk meneladani kesabaran baja para rasul Ulul Azmi dalam mengemban tugas kebenaran.",
        kosakataTerpilih: [
          { lafaz: "فَاصْبِرْ", arti: "Maka bersabarlah engkau" },
          { lafaz: "أُولُوا الْعَزْمِ", arti: "Yang memiliki keteguhan hati / tekad baja" },
          { lafaz: "مِنَ الرُّسُلِ", arti: "Dari kalangan para rasul" }
        ]
      },
      {
        kategori: "Al-Qur'an",
        surah: "QS. An-Nisa",
        nomorAyat: "164",
        teksArab: "وَرُسُلًۭا قَدْ قَصَصْنَـٰهُمْ عَلَيْكَ مِن قَبْلُ وَرُسُلًۭا لَّمْ نَقْصُصْهُمْ عَلَيْكَ ۚ وَكَلَّمَ ٱللَّهُ مُوسَىٰ تَكْلِيمًۭا",
        latin: "Wa rusulan qad qaṣaṣnāhum 'alaika min qablu wa rusulal lam naqṣuṣhum 'alaik, wa kallamallāhu mūsā taklīmā.",
        terjemahan: "Dan ada beberapa rasul yang telah Kami kisahkan mereka kepadamu sebelumnya, dan ada beberapa rasul yang tidak Kami kisahkan kepadamu. Dan Allah telah berfirman kepada Musa secara langsung.",
        tafsirSingkat: "Menegaskan bahwa jumlah nabi dan rasul sangat banyak di setiap umat peradaban, namun yang dikisahkan dalam Al-Qur'an berjumlah 25 rasul.",
        kosakataTerpilih: [
          { lafaz: "قَصَصْنَاهُمْ", arti: "Kami kisahkan mereka" },
          { lafaz: "لَمْ نَقْصُصْهُمْ", arti: "Tidak Kami kisahkan kepadamu" },
          { lafaz: "تَكْلِيمًا", arti: "Secara langsung / kalam hakiki" }
        ]
      }
    ],
    contohKehidupan: [
      "Bersabar dan tidak mengeluh saat menghadapi tugas pelajaran yang sulit atau hasil ujian yang belum memuaskan.",
      "Tetap berbuat baik dan mendoakan kebaikan bagi teman yang pernah mencela atau berbuat zalim kepada kita.",
      "Optimis dalam menggapai cita-cita dengan berikhtiar sungguh-sungguh tanpa mengenal putus asa.",
      "Menghindari perbuatan syirik, sihir, dan ramalan bintang yang merusak tauhid.",
      "Meneladani sikap pemaaf dan kelemahlembutan para nabi dalam lingkungan keluarga."
    ],
    aktivitasIndividu: [
      "Hafalkan nama 25 nabi dan rasul secara berurutan dari Adam as sampai Muhammad SAW.",
      "Tuliskan kisah keteguhan salah satu rasul Ulul Azmi dalam menghadapi ujian besar dan rumuskan 3 hikmah yang relevan bagi kehidupanmu."
    ],
    aktivitasKelompok: [
      "Bentuk kelompok beranggotakan 5 siswa. Buatlah peta konsep visual interaktif yang menggambarkan 5 Rasul Ulul Azmi beserta cobaan terberat dan mukjizat masing-masing.",
      "Lakukan drama singkat/teater kelas yang mengisahkan dialog penuh kesabaran Nabi Ibrahim as saat diperintahkan menyembelih putranya Nabi Ismail as."
    ],
    studiKasus: [
      {
        judulKasus: "Godaan Menggunakan Jimat dan Ramalan Zodiak Menjelang Ujian",
        deskripsi: "Seorang siswa merasa cemas menghadapi asesmen nasional. Temannya menyarankan memakai gelang bertuah (jimat) dan membaca ramalan nasib zodiak di majalah agar lulus dengan nilai terbaik.",
        pertanyaan: [
          "Apakah meyakini jimat dan ramalan zodiak sesuai dengan prinsip iman kepada rasul-rasul Allah?",
          "Bagaimana para nabi mengajarkan cara ikhtiar dan tawakal yang benar dalam menghadapi kecemasan hidup?",
          "Nasihat apa yang dapat kamu sampaikan untuk menguatkan mental sahabatmu tersebut?"
        ],
        solusiGuru: "Meyakini jimat dan ramalan nasib termasuk perbuatan syirik yang merusak akidah. Para nabi mengajarkan bahwa keberhasilan diraih dengan ikhtiar belajar maksimal, doa tulus, dan tawakal kepada Allah SWT semata."
      }
    ],
    ayoBerdiskusi: [
      "Mengapa para nabi dan rasul yang paling dicintai Allah justru mengalami cobaan dan penderitaan hidup yang paling berat dibanding manusia biasa?",
      "Bagaimana membedakan antara mukjizat nabi dengan sihir atau trik sulap tipuan?"
    ],
    latihan: {
      pilihanGanda: [
        {
          id: "pg-k8-7-1",
          pertanyaan: "Berikut ini yang termasuk salah satu dari lima rasul Ulul Azmi adalah...",
          opsi: ["A. Nabi Adam as", "B. Nabi Sulaiman as", "C. Nabi Nuh as", "D. Nabi Yusuf as"],
          kunciJawaban: 2,
          pembahasan: "Lima rasul Ulul Azmi adalah Nuh as, Ibrahim as, Musa as, Isa as, dan Muhammad SAW."
        },
        {
          id: "pg-k8-7-2",
          pertanyaan: "Kejadian luar biasa yang diberikan Allah SWT kepada para rasul untuk membuktikan kebenaran risalah kenabiannya disebut...",
          opsi: ["A. Karomah", "B. Mukjizat", "C. Ma'unah", "D. Istidraj"],
          kunciJawaban: 1,
          pembahasan: "Mukjizat adalah keistimewaan luar biasa yang hanya diberikan kepada para nabi dan rasul."
        },
        {
          id: "pg-k8-7-3",
          pertanyaan: "Al-Qur'an disebut sebagai mukjizat maknawi karena...",
          opsi: ["A. Dapat disentuh dan disimpan dalam lemari", "B. Hanya berlaku bagi bangsa Arab masa lalu", "C. Keindahan sastra dan kebenaran ajarannya dapat dibuktikan oleh akal manusia sepanjang zaman", "D. Ditulis di atas daun lontar dan kulit unta"],
          kunciJawaban: 2,
          pembahasan: "Mukjizat maknawi bersifat rasional, abadi, dan dapat ditelaah oleh akal pikiran manusia hingga akhir zaman."
        }
      ],
      isianSingkat: [
        {
          id: "is-k8-7-1",
          pertanyaan: "Laki-laki pilihan Allah yang menerima wahyu untuk dirinya sendiri tetapi tidak dibebani kewajiban menyampaikan kepada umatnya disebut...",
          kunciJawaban: "Nabi",
          pembahasan: "Nabi menerima wahyu untuk dirinya sendiri, sedangkan rasul wajib menyampaikan wahyu kepada umatnya."
        },
        {
          id: "is-k8-7-2",
          pertanyaan: "Rasul Ulul Azmi yang diuji dengan perintah menyembelih putranya dan selamat saat dibakar dalam kobaran api Raja Namrud adalah...",
          kunciJawaban: "Nabi Ibrahim as",
          pembahasan: "Nabi Ibrahim as bergelar Khalilullah dan merupakan bapak para nabi (Abul Anbiya)."
        }
      ],
      benarSalah: [
        {
          id: "bs-k8-7-1",
          pernyataan: "Setiap rasul Allah pasti seorang nabi, namun tidak semua nabi diangkat menjadi rasul.",
          jawabanBenar: true,
          pembahasan: "Benar. Jenjang kerasulan lebih khusus dan memikul beban dakwah risalah kepada umat."
        },
        {
          id: "bs-k8-7-2",
          pernyataan: "Tukang sihir Fir'aun dapat mengalahkan mukjizat tongkat Nabi Musa as karena sihir lebih sakti.",
          jawabanBenar: false,
          pembahasan: "Salah. Tongkat Nabi Musa berubah menjadi ular nyata yang menelan seluruh tali tipuan tukang sihir hingga mereka tunduk bersujud beriman."
        }
      ],
      menjodohkan: [
        { id: "mj-k8-7-1", pertanyaan: "Nabi Nuh as", pasanganJawaban: "Mukjizat Bahtera Besar Penyelamat Banjir Bandang" },
        { id: "mj-k8-7-2", pertanyaan: "Nabi Ibrahim as", pasanganJawaban: "Api Menjadi Dingin dan Menyelamatkan (Bardaw wa Salaman)" },
        { id: "mj-k8-7-3", pertanyaan: "Nabi Musa as", pasanganJawaban: "Tongkat Membelah Laut Merah Meloloskan dari Firaun" },
        { id: "mj-k8-7-4", pertanyaan: "Nabi Isa as", pasanganJawaban: "Menyembuhkan Orang Buta dan Kusta dengan Izin Allah" },
        { id: "mj-k8-7-5", pertanyaan: "Nabi Muhammad SAW", pasanganJawaban: "Mukjizat Abadi Al-Qur'an dan Peristiwa Isra Mi'raj" }
      ],
      uraian: [
        {
          id: "ur-k8-7-1",
          pertanyaan: "Jelaskan apa yang dimaksud dengan rasul Ulul Azmi dan sebutkan 5 nabi penerima gelar tersebut!",
          rubrikPenilaian: "Memuat: 1) Pengertian Ulul Azmi (rasul yang memiliki ketabahan, kesabaran, dan keteguhan tekad baja luar biasa), 2) Sebutan 5 rasul: Nuh as, Ibrahim as, Musa as, Isa as, dan Muhammad SAW."
        }
      ],
      hots: [
        {
          id: "ht-k8-7-1",
          pertanyaan: "Mengapa kisah perjuangan para nabi di dalam Al-Qur'an sering kali ditutup dengan keselamatan bagi orang beriman dan kebinasaan bagi kaum yang zalim? Pelajaran filosofis apa yang harus dipegang teguh oleh pemuda muslim ketika menghadapi masa-masa sulit atau merasa sendirian dalam memperjuangkan kebenaran?",
          panduanJawaban: "Pelajaran bahwa kebatilan itu rapuh dan pasti lenyap (innal bathila kana zahuqa). Kemenangan sejati adalah milik kesabaran dan kebenaran. Pemuda beriman tidak boleh merasa rendah diri atau menyerah karena pertolongan Allah selalu menyertai hamba-Nya yang istiqamah."
        }
      ]
    },
    refleksi: {
      pengantar: "Renungkan keteguhan pribadimu dalam mengamalkan ajaran para rasul Allah:",
      pertanyaanRefleksi: [
        "Apakah saya mudah mengeluh dan putus asa saat menghadapi nilai pelajaran yang turun?",
        "Apakah saya sudah meneladani sifat pemaaf para nabi saat ada teman yang menyakiti hati saya?",
        "Bagaimana komitmen saya untuk senantiasa berdoa memohon kesabaran dan keikhlasan kepada Allah SWT?"
      ],
      sikapDiterapkan: "Memiliki mental tangguh, sabar, dan tidak mudah menyerah oleh kegagalan.",
      kebiasaanDilakukan: "Membaca kisah para nabi dan meneladani ketulusan mereka dalam berbuat kebajikan."
    },
    rangkuman: [
      "Iman kepada rasul-rasul Allah adalah rukun iman keempat yang wajib diyakini dengan sepenuh hati.",
      "Nabi menerima wahyu untuk diri sendiri, sedangkan rasul wajib menyampaikan wahyu kepada umatnya.",
      "Terdapat 5 rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, Muhammad) yang memiliki ketabahan dan kesabaran tingkat tertinggi.",
      "Allah membekali rasul dengan mukjizat hissi (inderawi) dan mukjizat maknawi (rasional abadi seperti Al-Qur'an).",
      "Karakter utama yang harus diteladani dari para rasul adalah kesabaran, integritas kejujuran, dan pantang putus asa."
    ],
    pengayaan: {
      judul: "Kajian Kitab Qashashul Anbiya karya Ibnu Katsir",
      deskripsi: "Bacalah kisah dakwah Nabi Yusuf as atau Nabi Ayyub as dalam kitab Qashashul Anbiya untuk menelaah bagaimana menjaga kesucian diri di masa muda dan ketabahan menghadapi cobaan sakit menahun.",
      referensiLanjut: "Qashashul Anbiya karya Imam Ibnu Katsir, Terbitan Darul Haq, Jakarta."
    },
    remedial: {
      fokusMateri: "Hafalan 25 nabi/rasul dan 5 rasul Ulul Azmi.",
      kegiatan: "Menghafal dengan irama lagu 25 nabi dan memasangkan nama rasul Ulul Azmi pada papan kartu."
    },
    evaluasi: [
      "Jelaskan 2 perbedaan mendasar antara nabi dan rasul!",
      "Mengapa Nabi Nuh as digelari sebagai salah satu rasul Ulul Azmi?",
      "Sebutkan 2 contoh mukjizat hissi yang diberikan Allah kepada para nabi!"
    ],
    glosarium: [
      { istilah: "Ulul Azmi", arti: "Para rasul yang memiliki keteguhan hati, ketabahan, dan kesabaran luar biasa." },
      { istilah: "Mukjizat Hissi", arti: "Mukjizat bersifat materi kasat mata yang terikat oleh ruang dan waktu." },
      { istilah: "Mukjizat Maknawi", arti: "Mukjizat abadi berupa kalam ilmu pengetahuan yang dapat dibuktikan oleh akal manusia." },
      { istilah: "Ma'shum", arti: "Terpelihara dari dosa dan perbuatan nista yang merusak martabat kenabian." }
    ],
    daftarPustaka: [
      "Ibnu Katsir, Qashashul Anbiya (Kisah Para Nabi), Darul Haq, Jakarta, 2018.",
      "Kementerian Agama RI, Al-Qur'an dan Terjemahannya, Lajnah Pentashihan Mushaf, Jakarta, 2019.",
      "Kemendikbudristek, Buku Siswa PAI dan Budi Pekerti SMP Kelas VIII, Jakarta, 2021."
    ],
    verification: {
      status: "Terverifikasi",
      catatan: "Sesuai akidah Ahlussunnah wal Jama'ah mengenai kenabian dan kemukjizatan nabi."
    },
    gameList: [
      { tipe: "Tebak Nama", judul: "Jejak 25 Nabi dan Rasul", deskripsi: "Tebak nama nabi berdasarkan mukjizat dan nama kaum yang dihadapinya." },
      { tipe: "Resiliensi Ulul Azmi", judul: "Ujian Ketabahan Nabi", deskripsi: "Pilih sikap keteladanan rasul Ulul Azmi dalam menghadapi skenario persoalan hidup." }
    ]
  },

  // =========================================================================
  // BAB 8: CINTA ILMU DALAM KEHIDUPAN & PENGUASAAN TEKNOLOGI
  // =========================================================================
  {
    babNomor: 8,
    semester: 2,
    judulBab: "Menerapkan Makna Cinta Ilmu dan Penguasaan Teknologi dalam Keseharian",
    tujuanPembelajaran: [
      "Menjelaskan kedudukan mulia orang berilmu dalam Q.S. Az-Zumar: 9 dan hadis keutamaan menuntut ilmu.",
      "Menganalisis hukum menuntut ilmu syar'i (fardu 'ain) dan ilmu sains kemasyarakatan (fardu kifayah).",
      "Menerapkan adab menuntut ilmu (ikhlas, menghormati guru, mencatat, mengulang pelajaran, dan tidak sombong).",
      "Mengintegrasikan nilai-nilai islami dalam pemanfaatan teknologi informasi dan kecerdasan buatan (AI).",
      "Membiasakan budaya riset ilmiah, berpikir kritis, serta menjauhi plagiarisme.",
      "Menghasilkan karya inovasi kreatif berbasis sains atau media digital yang bermanfaat bagi masyarakat."
    ],
    kataKunci: ["Cinta Ilmu", "Etos Belajar", "Adab Penuntut Ilmu", "Teknologi", "Kecerdasan Buatan", "Fardu 'Ain", "Fardu Kifayah"],
    petaKonsep: [
      "Kajian Dalil → QS. Az-Zumar: 9, QS. Al-Mujadilah: 11, & Hadis Menuntut Ilmu",
      "Klasifikasi Ilmu → Fardu 'Ain (Akidah, Ibadah, Akhlak) vs Fardu Kifayah (Kedokteran, Teknologi, Sains)",
      "Adab Penuntut Ilmu → Ikhlas, Takzim kepada Guru, Istiqamah Mengulang, Tawaduk",
      "Pemanfaatan Iptek → Bijak Bermedia Digital, Riset Positif, Etika AI & Anti-Plagiarisme"
    ],
    ayoMengamati: {
      deskripsi: "Seorang siswi muslimah SMP sedang mengoperasikan komputer di laboratorium sekolah, merancang program aplikasi robotika dengan didampingi guru pembimbing.",
      imagePrompt: "Educational illustration of Indonesian junior high Muslim girl student coding and working on educational robotics project in modern high-tech school laboratory, supportive teacher beside her, inspiring bright lighting, modern Islamic textbook style, 16:9",
      pertanyaanPengamatan: [
        "Aktivitas apa yang sedang ditekuni oleh siswi pada gambar di atas?",
        "Mengapa penguasaan sains, coding, dan teknologi sangat penting bagi kemajuan umat Islam di era modern?",
        "Bagaimana cara menyeimbangkan antara penguasaan teknologi canggih dengan keluhuran akhlak islami?"
      ],
      hubunganMateri: "Islam adalah agama peradaban yang memotivasi umatnya untuk terus belajar, meneliti fenomena alam semesta, dan memanfaatkan teknologi demi kemaslahatan manusia.",
      captionGambar: "Ilustrasi 8.1: Semangat menguasai teknologi dan sains masa depan berlandaskan akhlak mulia."
    },
    ayoBerpikir: [
      "Imam Syafi'i pernah berpesan: 'Barangsiapa yang tidak pernah merasakan pahitnya belajar barang sesaat, maka ia akan meneguk hinanya kebodohan sepanjang hayat'. Apa makna mendalam nasehat ini bagi seorang pelajar?",
      "Teknologi kecerdasan buatan (AI) dapat membantu menyelesaikan tugas sekolah dalam hitungan detik. Bagaimana cara menjaga integritas kejujuran belajar agar kita tidak menjadi generasi pemalas berpikir?"
    ],
    materiPembelajaran: [
      {
        subJudul: "1. Keutamaan dan Hukum Menuntut Ilmu dalam Islam",
        konten: "Menuntut ilmu adalah ibadah mulia yang menempati posisi terhormat dalam Islam. Allah SWT menegaskan bahwa orang berilmu tidak sama derajatnya dengan orang yang tidak berilmu (QS. Az-Zumar: 9), dan Allah akan meninggikan derajat orang beriman dan berilmu beberapa derajat (QS. Al-Mujadilah: 11). Rasulullah SAW bersabda: 'Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga' (HR. Muslim).\nHukum menuntut ilmu terbagi dua:\n1. Fardu 'Ain: Wajib bagi setiap individu muslim mempelajari ilmu pokok akidah tauhid, tata cara salat, puasa, dan akhlak pembersih hati.\n2. Fardu Kifayah: Kewajiban kolektif untuk mendalami cabang ilmu spesifik seperti kedokteran, teknik, matematika, astronomi, ekonomi, dan teknologi informasi.",
        poinKunci: [
          "Jalan menuntut ilmu adalah jalan lapang menuju surga",
          "Fardu 'Ain: ilmu pokok agama untuk setiap pribadi",
          "Fardu Kifayah: ilmu sains dan keahlian profesi penopang peradaban"
        ]
      },
      {
        subJudul: "2. Adab Luhur Penuntut Ilmu (Adabul 'Alim wal Muta'allim)",
        konten: "Ilmu tidak akan berkah tanpa diiringi adab yang luhur. Para ulama merumuskan adab-adab pokok penuntut ilmu:\n1. Meluruskan Niat (Ikhlas): Belajar semata-mata mencari rida Allah, menghilangkan kebodohan diri, dan memberi manfaat bagi umat, bukan demi pamer atau pujian.\n2. Berdoa Memohon Tambahan Ilmu: Mengamalkan doa 'Rabbi zidni 'ilman warzuqni fahman'.\n3. Menghormati Guru: Mendengarkan penjelasan dengan santun, tidak memotong pembicaraan, dan mendoakan kebaikan guru.\n4. Mengikat Ilmu dengan Tulisan: Mencatat poin-poin penting pelajaran.\n5. Bersungguh-sungguh dan Sabar: Tabah menghadapi keletihan proses belajar.\n6. Tawaduk: Rendah hati dan tidak bersikap sombong atas kepandaian yang dimiliki.",
        poinKunci: [
          "Adab mendahului ilmu: ilmu tanpa adab melahirkan kesombongan",
          "Takzim dan patuh kepada guru adalah kunci terbukanya pemahaman",
          "Mengikat ilmu dengan mencatat dan mengulang (muraja'ah)"
        ]
      },
      {
        subJudul: "3. Etika Digital dan Pemanfaatan Teknologi bagi Pelajar",
        konten: "Di era revolusi industri 4.0 dan era AI, teknologi adalah pedang bermata dua. Pelajar muslim yang mencintai ilmu harus memanfaatkan teknologi secara etis:\n- Memanfaatkan internet untuk riset ilmiah, mengakses perpustakaan digital, dan kursus daring gratis.\n- Memverifikasi setiap informasi (tabayyun) dan tidak ikut menyebarkan hoaks atau konten negatif.\n- Menjaga hak cipta intelektual dengan mencantumkan sumber rujukan dan menolak keras plagiarisme/copypaste curang.\n- Mengatur waktu (screen time) secara seimbang agar gadget tidak melalaikan salat, tilawah Al-Qur'an, dan interaksi nyata dengan keluarga.",
        poinKunci: [
          "Internet dan AI sebagai sarana penunjang riset, bukan alat pemalas berpikir",
          "Tabayyun terhadap informasi dan menjauhi kejahatan siber",
          "Disiplin manajemen waktu antara dunia maya dan ibadah nyata"
        ]
      }
    ],
    dalilTerkait: [
      {
        kategori: "Al-Qur'an",
        surah: "QS. Az-Zumar",
        nomorAyat: "9",
        teksArab: "قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُو۟لُوا۟ ٱلْأَلْبَـٰبِ",
        latin: "Qul hal yastawil-lażīna ya'lamūna wal-lażīna lā ya'lamūn, innamā yatażakkaru ulul-albāb.",
        terjemahan: "Katakanlah: 'Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?' Sesungguhnya hanya orang yang berakallah yang dapat menerima pelajaran.",
        tafsirSingkat: "Ayat ini menegaskan perbedaan mendasar kualitas hidup, kematangan cara berpikir, dan derajat kemuliaan antara orang berilmu dan orang yang enggan belajar.",
        kosakataTerpilih: [
          { lafaz: "هَلْ يَسْتَوِي", arti: "Apakah sama?" },
          { lafaz: "يَعْلَمُونَ", arti: "Orang yang berilmu / mengetahui" },
          { lafaz: "أُولُوا الْأَلْبَابِ", arti: "Orang yang berakal sehat / cerdas" }
        ]
      },
      {
        kategori: "Hadis",
        surah: "HR. Muslim",
        nomorAyat: "Shahih Muslim No. 2699",
        teksArab: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
        latin: "Man salaka ṭarīqan yaltamisu fīhi 'ilman sahhalallāhu lahū bihī ṭarīqan ilal-jannah.",
        terjemahan: "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
        tafsirSingkat: "Setiap langkah kaki seorang pelajar menuju sekolah atau majelis ilmu dihitung sebagai amal fisabilillah dan menjadi pembuka pintu surga.",
        kosakataTerpilih: [
          { lafaz: "مَنْ سَلَكَ طَرِيقًا", arti: "Barangsiapa menempuh jalan" },
          { lafaz: "يَلْتَمِسُ عِلْمًا", arti: "Mencari / menuntut ilmu" },
          { lafaz: "سَهَّلَ اللَّهُ", arti: "Allah akan memudahkan" }
        ]
      }
    ],
    contohKehidupan: [
      "Mempersiapkan buku pelajaran dan membaca materi di malam hari sebelum masuk kelas esok hari.",
      "Mengangkat tangan dengan sopan saat ingin mengajukan pertanyaan kepada guru di kelas.",
      "Membantu menjelaskan materi pelajaran matematika atau IPA kepada teman yang belum paham.",
      "Memanfaatkan smartphone untuk mengunduh aplikasi Al-Qur'an, kamus bahasa Arab, dan ebook edukatif.",
      "Tidak menyontek atau menyalin jawaban karya orang lain saat mengerjakan tugas sekolah."
    ],
    aktivitasIndividu: [
      "Buatlah rencana jadwal belajar mandiri mingguan (study planner) yang memuat waktu muraja'ah, tugas rumah, membaca buku non-pelajaran, dan waktu ibadah harian.",
      "Rangkumlah 1 bab buku ilmu pengetahuan umum/sains pilihanmu ke dalam bentuk infografis satu halaman."
    ],
    aktivitasKelompok: [
      "Bentuk kelompok kerja ilmiah. Rancanglah proyek sains sederhana berbasis lingkungan (misalnya: pembuatan pupuk kompos sekolah atau penjernih air sederhana) dan presentasikan hasilnya.",
      "Diskusikan etika penggunaan Generative AI dalam penyusunan karya tulis ilmiah di sekolah."
    ],
    studiKasus: [
      {
        judulKasus: "Godaan Menyalin Karya AI untuk Lomba Menulis Esai",
        deskripsi: "Rian mengikuti lomba karya tulis ilmiah tingkat kabupaten. Karena keterbatasan waktu, ia meminta bantuan AI untuk menuliskan seluruh isi esai lalu menyalinnya kata per kata tanpa membaca atau menyuntingnya dan mengklaim sebagai karyanya sendiri.",
        pertanyaan: [
          "Apakah tindakan Rian dapat dibenarkan menurut adab pencari ilmu dan etika kejujuran akademik?",
          "Bagaimana seharusnya seorang pelajar menggunakan teknologi AI secara benar dalam menyelesaikan karya tulis?",
          "Dampak buruk apa yang akan menimpa Rian jika ia terbiasa mengandalkan jalan pintas yang tidak jujur?"
        ],
        solusiGuru: "Tindakan tersebut adalah bentuk plagiarisme dan ketidakjujuran intelektual. AI seharusnya digunakan sebagai mitra brainstorming ide atau pengecek tata bahasa, sementara gagasan utama, analisis, dan penulisan harus murni berasal dari pemikiran dan riset siswa sendiri."
      }
    ],
    ayoBerdiskusi: [
      "Mengapa menuntut ilmu agama berhukum fardu 'ain sementara ilmu kedokteran berhukum fardu kifayah? Apa dampaknya jika tidak ada satu pun dokter muslim di suatu daerah?",
      "Bagaimana cara kita menjaga kerendahan hati (tawaduk) saat dianugerahi kecerdasan dan prestasi juara kelas?"
    ],
    latihan: {
      pilihanGanda: [
        {
          id: "pg-k8-8-1",
          pertanyaan: "Hukum mempelajari tata cara salat lima waktu dan dasar-dasar akidah tauhid bagi setiap muslim adalah...",
          opsi: ["A. Fardu 'Ain", "B. Fardu Kifayah", "C. Sunnah Ghairu Muakkad", "D. Mubah"],
          kunciJawaban: 0,
          pembahasan: "Fardu 'ain adalah kewajiban yang dibebankan kepada setiap individu muslim mukalaf."
        },
        {
          id: "pg-k8-8-2",
          pertanyaan: "Janji Allah SWT bagi orang-orang yang menempuh jalan untuk mencari ilmu menurut hadis riwayat Muslim adalah...",
          opsi: ["A. Diberikan kekayaan harta tanpa batas", "B. Dimudahkan jalannya menuju surga", "C. Dijadikan penguasa negeri", "D. Terbebas dari segala penyakit jasmani"],
          kunciJawaban: 1,
          pembahasan: "Rasulullah bersabda bahwa Allah akan memudahkan jalan menuju surga bagi penuntut ilmu."
        },
        {
          id: "pg-k8-8-3",
          pertanyaan: "Sikap rendah hati yang wajib dimiliki oleh seorang penuntut ilmu agar ilmunya berkah disebut...",
          opsi: ["A. Takabur", "B. Riya'", "C. Tawaduk", "D. Sum'ah"],
          kunciJawaban: 2,
          pembahasan: "Tawaduk adalah sifat rendah hati, lawan dari sifat sombong (takabur)."
        }
      ],
      isianSingkat: [
        {
          id: "is-k8-8-1",
          pertanyaan: "Hukum menuntut ilmu-ilmu spesialisasi penopang kehidupan masyarakat seperti kedokteran dan teknik dalam Islam adalah...",
          kunciJawaban: "Fardu Kifayah",
          pembahasan: "Fardu kifayah gugur dosanya jika ada sebagian muslim yang menguasai bidang tersebut."
        },
        {
          id: "is-k8-8-2",
          pertanyaan: "Tindakan menyalin karya atau tulisan orang lain dan mengakuinya sebagai karya pribadi tanpa mencantumkan sumber disebut...",
          kunciJawaban: "Plagiarisme (Menjiplak)",
          pembahasan: "Plagiarisme adalah pelanggaran kejujuran akademik yang dilarang dalam etika Islam."
        }
      ],
      benarSalah: [
        {
          id: "bs-k8-8-1",
          pernyataan: "Menghormati guru dan mendengarkan nasihatnya merupakan pintu utama keberkahan ilmu yang dipelajari.",
          jawabanBenar: true,
          pembahasan: "Benar. Ridha guru dan adab takzim adalah sarana utama pembuka hidayah ilmu."
        },
        {
          id: "bs-k8-8-2",
          pernyataan: "Islam melarang umatnya mempelajari ilmu komputer dan kecerdasan buatan karena dianggap bukan ilmu warisan nabi.",
          jawabanBenar: false,
          pembahasan: "Salah. Islam mendorong umatnya menguasai seluruh ilmu sains yang bermanfaat bagi kemaslahatan manusia."
        }
      ],
      menjodohkan: [
        { id: "mj-k8-8-1", pertanyaan: "Fardu 'Ain", pasanganJawaban: "Wajib bagi setiap individu (Salat, Puasa, Tauhid)" },
        { id: "mj-k8-8-2", pertanyaan: "Fardu Kifayah", pasanganJawaban: "Kewajiban kolektif (Kedokteran, Sains, Teknologi)" },
        { id: "mj-k8-8-3", pertanyaan: "Ulul Albab", pasanganJawaban: "Orang yang menggunakan akal sehat untuk berpikir dan berzikir" },
        { id: "mj-k8-8-4", pertanyaan: "Tabayyun", pasanganJawaban: "Memeriksa kebenaran informasi sebelum mempercayai dan membagikan" }
      ],
      uraian: [
        {
          id: "ur-k8-8-1",
          pertanyaan: "Sebutkan dan jelaskan 4 adab utama seorang murid terhadap gurunya dalam proses pembelajaran!",
          rubrikPenilaian: "Memuat: 1) Niat ikhlas karena Allah, 2) Mendengarkan dan memperhatikan dengan takzim, 3) Berbicara dengan santun dan tidak memotong pembicaraan, 4) Mendoakan guru dan mengamalkan ilmu yang diajarkan."
        }
      ],
      hots: [
        {
          id: "ht-k8-8-1",
          pertanyaan: "Bagaimana cara seorang pelajar mengintegrasikan antara kecerdasan intelektual (IQ), kecerdasan emosional (EQ), dan kecerdasan spiritual (SQ) sehingga penguasaan sains tidak menjadikannya sombong melainkan semakin tunduk bertakwa kepada Allah SWT?",
          panduanJawaban: "Dengan meyakini bahwa setiap ilmu yang didapat adalah titipan nikmat Allah (SQ), menggunakan ilmu untuk menolong sesama dan berempati (EQ), serta terus mengasah logika analisis untuk menemukan solusi masalah bangsa (IQ). Semakin banyak ilmu, semakin menyadari betapa sedikitnya pengetahuan manusia dibanding ilmu Allah."
        }
      ]
    },
    refleksi: {
      pengantar: "Ujilah motivasi dan kesungguhan belajarmu sehari-hari:",
      pertanyaanRefleksi: [
        "Apakah niat saya bersekolah sudah benar mencari rida Allah dan menuntut ilmu, atau sekadar formalitas cari ijazah?",
        "Bagaimana adab bicara dan rasa hormat saya kepada bapak dan ibu guru di sekolah?",
        "Apakah saya menggunakan gadget lebih banyak untuk hal yang menambah ilmu atau untuk hal yang sia-sia?"
      ],
      sikapDiterapkan: "Menjadi pembelajar sepanjang hayat (long life learner) yang berakhlak mulia.",
      kebiasaanDilakukan: "Membaca buku setiap hari, menghormati guru, dan mengamalkan ilmu dalam kebaikan."
    },
    rangkuman: [
      "Menuntut ilmu adalah kewajiban suci yang memudahkan jalan seorang hamba menuju surga (HR. Muslim).",
      "Ilmu fardu 'ain wajib dipelajari setiap orang (akidah, ibadah pokok), sedangkan fardu kifayah menopang hajat publik (kedokteran, sains, teknologi).",
      "Adab mendahului ilmu: ikhlas, takzim pada guru, mencatat pelajaran, tekun mengulang, dan tawaduk.",
      "Teknologi dan kecerdasan buatan harus dimanfaatkan secara etis, bijak, dan menjunjung tinggi integritas kejujuran akademik.",
      "Cita-cita menuntut ilmu adalah mencerdaskan akal, meluhurkan akhlak, dan memberi kemanfaatan luas bagi umat manusia."
    ],
    pengayaan: {
      judul: "Kajian Kitab Ta'limul Muta'allim Thariqat Ta'allum",
      deskripsi: "Pelajari ringkasan kitab klasik legendaris Ta'limul Muta'allim karya Syaikh Az-Zarnuji yang menguraikan metode belajar efektif dan kiat-kiat meraih keberkahan ilmu.",
      referensiLanjut: "Kitab Ta'limul Muta'allim karya Syaikh Az-Zarnuji, Penerbit Al-Miftah, Surabaya."
    },
    remedial: {
      fokusMateri: "Perbedaan hukum menuntut ilmu fardu 'ain dan fardu kifayah.",
      kegiatan: "Mengelompokkan daftar 10 cabang ilmu ke dalam kolom fardu 'ain atau fardu kifayah dan mendiskusikannya dengan guru."
    },
    evaluasi: [
      "Mengapa Allah membedakan derajat orang berilmu dengan orang yang tidak berilmu dalam QS. Az-Zumar: 9?",
      "Sebutkan 3 adab utama seorang murid terhadap gurunya!",
      "Bagaimana etika memanfaatkan internet dan AI agar tidak melanggar kejujuran akademik?"
    ],
    glosarium: [
      { istilah: "Fardu 'Ain", arti: "Kewajiban individual yang dibebankan kepada setiap muslim balig." },
      { istilah: "Fardu Kifayah", arti: "Kewajiban kolektif yang tertunaikan bila telah dikuasai oleh sebagian orang." },
      { istilah: "Tawaduk", arti: "Sikap rendah hati dan tidak membanggakan diri atas kelebihan yang dimiliki." },
      { istilah: "Muraja'ah", arti: "Mengulang kembali pelajaran atau hafalan secara berkala agar tidak lupa." }
    ],
    daftarPustaka: [
      "Syaikh Az-Zarnuji, Ta'limul Muta'allim Thariqat Ta'allum, Al-Hidayah, Surabaya.",
      "Kementerian Agama RI, Al-Qur'an dan Terjemahannya, Lajnah Pentashihan Mushaf, Jakarta, 2019.",
      "Kemendikbudristek, Buku Guru PAI dan Budi Pekerti SMP Kelas VIII, Jakarta, 2021."
    ],
    verification: {
      status: "Terverifikasi",
      catatan: "Sesuai rujukan kitab adab keilmuan Islam dan regulasi etika riset Kemendikbudristek."
    },
    gameList: [
      { tipe: "Kategori Ilmu", judul: "Sortir Fardu 'Ain vs Fardu Kifayah", deskripsi: "Tarik dan letakkan kartu ilmu pada kotak hukum yang sesuai dengan cepat." },
      { tipe: "Teka-Teki Adab", judul: "Tantangan Bintang Murid Teladan", deskripsi: "Pecahkan skenario adab belajar di kelas dan etika berinternet secara sehat." }
    ]
  },

  // =========================================================================
  // BAB 9: KETENTUAN IBADAH HAJI DAN UMRAH
  // =========================================================================
  {
    babNomor: 9,
    semester: 2,
    judulBab: "Menerapkan Ketentuan dan Meneladani Nilai Ibadah Haji dan Umrah",
    tujuanPembelajaran: [
      "Menjelaskan pengertian, dasar hukum, dan syarat wajib ibadah haji dan umrah.",
      "Membedakan antara rukun, wajib, dan sunnah haji serta rukun umrah secara terperinci.",
      "Menjelaskan macam-macam pelaksanaan haji (Ifrad, Qiran, dan Tamattu').",
      "Mengidentifikasi larangan-larangan selama berihram beserta ketentuan dam (denda).",
      "Mempraktikkan tahapan peragaan manasik haji (Ihram, Wukuf di Arafah, Mabit di Muzdalifah & Mina, Lempar Jumrah, Tawaf Ifadah, Sa'i, Tahallul).",
      "Meneladani nilai-nilai kesetaraan, persaudaraan universal, dan pengorbanan Nabi Ibrahim as dalam ibadah haji."
    ],
    kataKunci: ["Haji", "Umrah", "Ihram", "Miqat", "Wukuf di Arafah", "Tawaf", "Sa'i", "Tahallul", "Manasik"],
    petaKonsep: [
      "Dasar Hukum & Syarat → Rukun Islam ke-5 (Syarat Istitha'ah/Mampu)",
      "Perbedaan Haji & Umrah → Waktu Pelaksanaan & Rukun Wukuf di Padang Arafah",
      "Rukun Haji (6) → Ihram, Wukuf, Tawaf Ifadah, Sa'i, Tahallul, Tertib",
      "Wajib Haji (6) → Ihram dari Miqat, Mabit Muzdalifah, Lempar Jumrah, Mabit Mina, Tawaf Wada', Hindari Larangan",
      "Tahapan Manasik → Ihram → Arafah → Muzdalifah → Mina → Makkah → Tahallul"
    ],
    ayoMengamati: {
      deskripsi: "Jutaan jamaah haji dari berbagai negara mengenakan kain ihram putih seragam yang sama, berkumpul dengan penuh harap memanjatkan doa di Padang Arafah.",
      imagePrompt: "Educational illustration of millions of Muslim pilgrims wearing simple white Ihram garments praying emotionally on Plain of Mount Arafat, dramatic sacred sky, universal brotherhood, modern Islamic textbook style, 16:9",
      pertanyaanPengamatan: [
        "Pakaian seragam apa yang dikenakan oleh seluruh jamaah haji laki-laki pada gambar di atas?",
        "Mengapa semua orang, baik pejabat kaya maupun rakyat biasa, mengenakan pakaian yang sama tanpa jahitan?",
        "Pesan kesetaraan manusia apa yang dapat kita tangkap dari peristiwa wukuf di Arafah?"
      ],
      hubunganMateri: "Ibadah haji meruntuhkan sekat keangkuhan kasta, ras, dan kekayaan; di hadapan Allah seluruh manusia adalah sama, hanya ketakwaan yang membedakannya.",
      captionGambar: "Ilustrasi 9.1: Wukuf di Padang Arafah, miniatur padang mahsyar dan puncak kesetaraan manusia."
    },
    ayoBerpikir: [
      "Syarat utama kewajiban haji adalah 'Istitha'ah' (mampu). Apakah mampu hanya sebatas memiliki uang yang cukup untuk tiket dan akomodasi, atau mencakup aspek lainnya?",
      "Mengapa jamaah yang meninggalkan rukun haji hajinya batal dan tidak dapat diganti dengan membayar denda (dam), sedangkan meninggalkan wajib haji hajinya tetap sah dengan membayar dam?"
    ],
    praktik: {
      judulPraktik: "Simulasi Manasik Haji Lengkap di Lapangan Sekolah",
      tujuan: "Peserta didik mampu memperagakan rangkaian manasik haji: niat ihram di miqat, wukuf, mabit, lempar jumrah, tawaf mengitari replika Ka'bah, dan sa'i antara Shafa dan Marwah.",
      alatBahan: ["Replika miniatur Ka'bah", "Kain ihram putih untuk siswa laki-laki", "Busana muslimah putih untuk siswi", "Kerikil peraga manasik"],
      langkahPraktik: [
        "Mengenakan kain ihram dan melafalkan niat haji di titik Miqat (Labbaikallāhumma hajjan).",
        "Melantunkan kalimat Talbiyah bersama-sama sepanjang perjalanan.",
        "Simulasi Wukuf di Arafah dengan memperbanyak zikir, istigfar, dan doa tulus.",
        "Mabit di Muzdalifah untuk mengumpulkan 7 butir kerikil.",
        "Menuju Mina untuk melempar Jumrah Aqabah sebanyak 7 kali lemparan disertai takbir.",
        "Melakukan Tahallul awal (memotong minimal 3 helai rambut).",
        "Menuju Makkah untuk Tawaf Ifadah mengelilingi Ka'bah 7 putaran berlawanan arah jarum jam.",
        "Melakukan Sa'i berjalan dan berlari kecil antara bukit Shafa dan bukit Marwah sebanyak 7 kali bolak-balik.",
        "Tahallul tsani sebagai penutup seluruh rangkaian larangan ihram."
      ],
      rubrikPenilaian: "Kriteria: Ketepatan urutan rukun, hafalan bacaan talbiyah dan doa putaran tawaf, kesesuaian gerakan sa'i, dan kekhidmatan ibadah."
    },
    materiPembelajaran: [
      {
        subJudul: "1. Hakikat, Syarat Wajib, dan Perbedaan Haji dengan Umrah",
        konten: "Haji secara bahasa berarti menyengaja (al-qashdu), sedangkan menurut istilah syariat adalah menyengaja mengunjungi Baitullah di Makkah untuk melaksanakan serangkaian amalan ibadah tertentu pada waktu tertentu (bulan Syawwal, Zulkaidah, dan 1–13 Zulhijjah) dengan syarat-syarat tertentu. Hukum haji adalah fardu 'ain sekali seumur hidup bagi yang mampu (QS. Ali 'Imran: 97).\nSyarat wajib haji: 1) Islam, 2) Balig, 3) Berakal sehat, 4) Merdeka, dan 5) Mampu (Istitha'ah secara fisik, finansial, keamanan, dan mahram bagi wanita).\nPerbedaan Haji dan Umrah: Haji hanya dapat dikerjakan pada bulan Zulhijjah dan memiliki rukun Wukuf di Padang Arafah. Sedangkan Umrah (haji kecil) dapat dikerjakan kapan saja sepanjang tahun dan tidak ada wukuf di Arafah, mabit di Muzdalifah/Mina, maupun lempar jumrah.",
        poinKunci: [
          "Haji rukun Islam ke-5, wajib sekali seumur hidup bagi yang mampu",
          "Istitha'ah mencakup kesehatan fisik, bekal biaya, keamanan jalan, dan nafkah keluarga yang ditinggalkan",
          "Perbedaan mendasar: Wukuf di Arafah hanya ada pada ibadah haji"
        ]
      },
      {
        subJudul: "2. Rukun dan Wajib Haji",
        konten: "Rukun Haji adalah amalan pokok yang wajib dikerjakan dan tidak sah haji jika ditinggalkan serta tidak dapat diganti dengan dam (denda):\n1. Ihram disertai niat haji.\n2. Wukuf di Padang Arafah (tanggal 9 Zulhijjah dari tergelincir matahari hingga terbit fajar 10 Zulhijjah).\n3. Tawaf Ifadah (mengitari Ka'bah 7 putaran).\n4. Sa'i (berjalan 7 kali antara bukit Shafa dan Marwah).\n5. Tahallul (mencukur atau memotong sebagian rambut kepala).\n6. Tertib (berurutan dalam sebagian besar amalan).\nWajib Haji adalah amalan yang harus dikerjakan; jika ditinggalkan hajinya tetap sah namun berdosa dan wajib membayar denda (dam):\n1. Ihram dari miqat makani (batas tempat).\n2. Mabit di Muzdalifah pada malam 10 Zulhijjah.\n3. Melempar Jumrah Aqabah pada hari Iduladha (10 Zulhijjah).\n4. Mabit di Mina pada hari-hari Tasyrik (11, 12, 13 Zulhijjah).\n5. Melempar tiga Jumrah (Ula, Wustha, Aqabah) pada hari Tasyrik.\n6. Tawaf Wada' (tawaf perpisahan sebelum meninggalkan Makkah).\n7. Menjauhi larangan-larangan ihram.",
        poinKunci: [
          "Rukun haji (6): Jika tertinggal, haji batal dan wajib diulang tahun depan",
          "Wajib haji (7): Jika tertinggal, haji tetap sah tetapi wajib bayar dam",
          "Miqat zamani (batas waktu) dan Miqat makani (batas tempat ihram)"
        ]
      },
      {
        subJudul: "3. Macam Pelaksanaan Haji dan Larangan Ihram",
        konten: "Cara pelaksanaan ibadah haji terbagi menjadi tiga macam:\n1. Haji Ifrad: Mengerjakan ibadah haji terlebih dahulu, baru kemudian melaksanakan umrah (paling utama, tidak terkena dam).\n2. Haji Tamattu': Mengerjakan umrah terlebih dahulu di bulan haji, lalu bertahallul, kemudian memakai ihram kembali untuk haji pada 8 Zulhijjah (paling banyak dilakukan jamaah Indonesia, wajib membayar dam seekor kambing).\n3. Haji Qiran: Mengerjakan haji dan umrah secara bersamaan dalam satu kali niat dan ihram (wajib bayar dam).\nLarangan selama ihram: Laki-laki dilarang memakai pakaian berjahit dan penutup kepala. Wanita dilarang menutup wajah (cadar) dan sarung tangan. Kedua jenis kelamin dilarang: memotong kuku/rambut, memakai wewangian, berburu binatang, menebang pohon di tanah suci, melangsungkan akad nikah, serta melakukan hubungan suami-istri.",
        poinKunci: [
          "Haji Ifrad (Haji dulu baru Umrah), Tamattu' (Umrah dulu baru Haji), Qiran (Haji dan Umrah sekaligus)",
          "Larangan ihram menjaga kesucian dan kebersahajaan jiwa di hadapan Allah",
          "Dam berupa menyembelih hewan qurban atau puasa fidyah sesuai pelanggaran"
        ]
      }
    ],
    dalilTerkait: [
      {
        kategori: "Al-Qur'an",
        surah: "QS. Ali 'Imran",
        nomorAyat: "97",
        teksArab: "وَلِلَّهِ عَلَى ٱلنَّاسِ حِجُّ ٱلْبَيْتِ مَنِ ٱسْتَطَاعَ إِلَيْهِ سَبِيلًۭا ۚ وَمَن كَفَرَ فَإِنَّ ٱللَّهَ غَنِىٌّ عَنِ ٱلْعَـٰلَمِينَ",
        latin: "Wa lillāhi 'alan-nāsi ḥijjul-baiti manistaṭā'a ilaihi sabīlā, wa man kafara fa innallāha ganiyyun 'anil-'ālamīn.",
        terjemahan: "Dan (di antara) kewajiban manusia terhadap Allah adalah melaksanakan ibadah haji ke Baitullah, yaitu bagi orang-orang yang mampu mengadakan perjalanan ke sana. Barangsiapa mengingkari (kewajiban haji), maka ketahuilah bahwa Allah Mahakaya (tidak memerlukan sesuatu) dari seluruh alam.",
        tafsirSingkat: "Ayat ini menetapkan kewajiban rukun Islam kelima bagi mukmin yang memiliki kemampuan fisik, biaya, dan keamanan perjalanan.",
        kosakataTerpilih: [
          { lafaz: "حِجُّ الْبَيْتِ", arti: "Haji ke Baitullah (Ka'bah)" },
          { lafaz: "مَنِ اسْتَطَاعَ", arti: "Orang yang mampu" },
          { lafaz: "سَبِيلًا", arti: "Perjalanan / akses ke sana" }
        ]
      },
      {
        kategori: "Hadis",
        surah: "HR. Al-Bukhari & Muslim",
        nomorAyat: "Shahih Bukhari No. 1773",
        teksArab: "الْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلَّا الْجَنَّةُ",
        latin: "Al-ḥajjul-mabrūru laisa lahū jazā'un illal-jannah.",
        terjemahan: "Dan haji yang mabrur tidak ada balasan baginya melainkan surga.",
        tafsirSingkat: "Haji mabrur adalah haji yang dilaksanakan sesuai tuntunan syariat secara ikhlas dan membuahkan perubahan akhlak mulia setelah kembali ke tanah air.",
        kosakataTerpilih: [
          { lafaz: "الْحَجُّ الْمَبْرُورُ", arti: "Haji yang mabrur / diterima" },
          { lafaz: "لَيْسَ لَهُ جَزَاءٌ", arti: "Tidak ada baginya balasan" },
          { lafaz: "إِلَّا الْجَنَّةُ", arti: "Kecuali surga" }
        ]
      }
    ],
    contohKehidupan: [
      "Menabung uang saku secara disiplin di tabungan haji sejak usia remaja.",
      "Menjaga kerukunan dan persaudaraan tanpa membedakan status sosial teman di sekolah sebagaimana nilai ihram.",
      "Meneladani keikhlasan pengorbanan Nabi Ibrahim dan Siti Hajar saat menghadapi kesulitan ekonomi keluarga.",
      "Mendoakan sanak kerabat atau tetangga yang sedang menunaikan ibadah haji di tanah suci.",
      "Mempraktikkan sikap sabar dan antre dengan tertib di fasilitas umum."
    ],
    aktivitasIndividu: [
      "Buatlah bagan diagram alur prosesi manasik haji dari tanggal 8 Zulhijjah (Hari Tarwiyah) sampai tanggal 13 Zulhijjah (selesai hari Tasyrik).",
      "Hafalkan lafaz bacaan Talbiyah lengkap beserta artinya."
    ],
    aktivitasKelompok: [
      "Lakukan simulasi peragaan manasik haji mini di kelas: tunjuk petugas sebagai pemandu rombongan, pelafal talbiyah, dan peraga tawaf.",
      "Buatlah tabel perbandingan antara rukun haji dan rukun umrah serta macam-macam dam haji."
    ],
    studiKasus: [
      {
        judulKasus: "Jamaah Sakit Parah dan Masuk Rumah Sakit saat Hari Arafah",
        deskripsi: "Pak Rahmat yang sedang melaksanakan ibadah haji mendadak terkena serangan jantung pada tanggal 8 Zulhijjah dan harus dirawat intensif di Rumah Sakit Arab Saudi di Makkah. Beliau khawatir ibadah hajinya batal karena tidak bisa berdiri di Padang Arafah pada tanggal 9 Zulhijjah.",
        pertanyaan: [
          "Apakah haji Pak Rahmat otomatis batal jika tidak bisa hadir secara mandiri di Arafah?",
          "Solusi syariat apa yang disediakan oleh panitia haji (Safari Wukuf) untuk menangani jamaah yang sakit?",
          "Mengapa wukuf di Arafah menjadi puncak inti penentu keabsahan ibadah haji (al-hajju arafah)?"
        ],
        solusiGuru: "Rasulullah bersabda: 'Al-Hajju 'Arafah' (Haji itu adalah wukuf di Arafah). Jamaah yang sakit tidak batal hajinya asalkan diikutkan program Safari Wukuf, yaitu dibawa menggunakan ambulans khusus ke Padang Arafah walau hanya sejenak untuk memenuhi rukun wukuf secara sah."
      }
    ],
    ayoBerdiskusi: [
      "Mengapa ibadah haji hanya diwajibkan satu kali seumur hidup, padahal salat lima waktu diwajibkan setiap hari?",
      "Bagaimana pendapatmu tentang orang yang berkali-kali menunaikan ibadah haji dan umrah namun tidak peduli pada tetangganya yang miskin dan kelaparan?"
    ],
    latihan: {
      pilihanGanda: [
        {
          id: "pg-k8-9-1",
          pertanyaan: "Rukun ibadah haji yang menjadi pembeda utama dengan ibadah umrah adalah...",
          opsi: ["A. Tawaf Ifadah", "B. Sa'i antara Shafa dan Marwah", "C. Wukuf di Padang Arafah", "D. Tahallul"],
          kunciJawaban: 2,
          pembahasan: "Wukuf di Padang Arafah hanya ada pada ibadah haji dan tidak ada dalam rukun umrah."
        },
        {
          id: "pg-k8-9-2",
          pertanyaan: "Pelaksanaan ibadah haji di mana jamaah mengerjakan umrah terlebih dahulu, lalu bertahallul, kemudian ihram haji disebut...",
          opsi: ["A. Haji Ifrad", "B. Haji Tamattu'", "C. Haji Qiran", "D. Haji Wada'"],
          kunciJawaban: 1,
          pembahasan: "Haji Tamattu' adalah bersenang-senang (bersantai lepas ihram) setelah umrah sebelum masuk waktu ihram haji."
        },
        {
          id: "pg-k8-9-3",
          pertanyaan: "Batas tempat yang ditentukan bagi jamaah untuk memulai berniat ihram haji atau umrah disebut...",
          opsi: ["A. Miqat Makani", "B. Miqat Zamani", "C. Hijir Ismail", "D. Maqam Ibrahim"],
          kunciJawaban: 0,
          pembahasan: "Miqat Makani adalah batas geografis tempat memulai ihram (seperti Zulhulaifah/Bir Ali, Yalamlam, dll)."
        }
      ],
      isianSingkat: [
        {
          id: "is-k8-9-1",
          pertanyaan: "Berjalan bolak-balik sebanyak 7 kali antara bukit Shafa dan bukit Marwah mengenang perjuangan Siti Hajar disebut...",
          kunciJawaban: "Sa'i",
          pembahasan: "Sa'i adalah rukun haji/umrah berupa berjalan dan berlari kecil antara Shafa dan Marwah."
        },
        {
          id: "is-k8-9-2",
          pertanyaan: "Memotong atau mencukur sebagian rambut kepala sebagai tanda telah terbebasnya seseorang dari larangan ihram disebut...",
          kunciJawaban: "Tahallul",
          pembahasan: "Tahallul mengakhiri masa berlakunya larangan-larangan ihram."
        }
      ],
      benarSalah: [
        {
          id: "bs-k8-9-1",
          pernyataan: "Jika seorang jamaah haji meninggalkan salah satu rukun haji (misal: wukuf di Arafah), hajinya tetap sah asalkan membayar dam seekor unta.",
          jawabanBenar: false,
          pembahasan: "Salah. Rukun haji tidak dapat diganti dengan dam dalam bentuk apa pun; jika ditinggalkan, hajinya batal."
        },
        {
          id: "bs-k8-9-2",
          pernyataan: "Laki-laki yang sedang berihram dilarang memakai pakaian berjahit, sepatu yang menutupi mata kaki, dan penutup kepala.",
          jawabanBenar: true,
          pembahasan: "Benar. Ketentuan pakaian ihram pria adalah 2 lembar kain putih tanpa jahitan."
        }
      ],
      menjodohkan: [
        { id: "mj-k8-9-1", pertanyaan: "Ihram", pasanganJawaban: "Berniat memulai ibadah haji/umrah di titik Miqat" },
        { id: "mj-k8-9-2", pertanyaan: "Wukuf", pasanganJawaban: "Berdiam diri dan berdoa di Padang Arafah tanggal 9 Zulhijjah" },
        { id: "mj-k8-9-3", pertanyaan: "Tawaf", pasanganJawaban: "Mengelilingi Ka'bah sebanyak 7 putaran berlawanan jarum jam" },
        { id: "mj-k8-9-4", pertanyaan: "Tahallul", pasanganJawaban: "Mencukur/memotong rambut kepala tanda bebas larangan ihram" }
      ],
      uraian: [
        {
          id: "ur-k8-9-1",
          pertanyaan: "Jelaskan perbedaan mendasar antara Rukun Haji dan Wajib Haji, serta apa konsekuensi hukum jika salah satunya ditinggalkan!",
          rubrikPenilaian: "Memuat: 1) Rukun haji adalah amalan pokok; jika ditinggalkan haji batal dan wajib diulang tahun berikutnya, tidak bisa diganti dam. 2) Wajib haji jika ditinggalkan haji tetap sah namun berdosa dan wajib membayar denda (dam)."
        }
      ],
      hots: [
        {
          id: "ht-k8-9-1",
          pertanyaan: "Ibadah haji sering disebut sebagai puncak transformasi sosial umat Islam. Nilai-nilai kesetaraan, anti-rasisme, dan solidaritas kemanusiaan apa saja yang dipelajari seorang muslim saat berbaur dengan jutaan jamaah dari 150+ negara di tanah suci?",
          panduanJawaban: "Nilai kesetaraan mutlak di hadapan Allah tanpa memandang kasta atau ras (tercermin dari kain ihram putih yang sama), persaudaraan universal lintas bangsa (Ukhuwah Islamiyah), toleransi dan saling mengalah di tengah kepadatan, serta kesadaran kefanaan bahwa manusia kelak akan dikumpulkan di Padang Mahsyar tanpa membawa harta kekayaan."
        }
      ]
    },
    refleksi: {
      pengantar: "Renungkan nilai-nilai spiritual ibadah haji dalam pembentukan karakter pribadimu:",
      pertanyaanRefleksi: [
        "Apakah saya sudah memiliki niat dan tekad kuat untuk menunaikan ibadah haji ke Baitullah?",
        "Bagaimana sikap saya terhadap teman yang kurang mampu: apakah saya memperlakukan mereka dengan setara?",
        "Apakah saya mampu menahan hawa nafsu dari kata-kata kotor (rafats) dan pertengkaran (jidal)?"
      ],
      sikapDiterapkan: "Menerapkan nilai kesetaraan derajat manusia dan menjauhi kesombongan materi.",
      kebiasaanDilakukan: "Menyisihkan uang saku untuk tabungan masa depan dan membiasakan hidup bersahaja."
    },
    rangkuman: [
      "Haji adalah rukun Islam kelima yang wajib dikerjakan sekali seumur hidup bagi yang mampu (Istitha'ah).",
      "Perbedaan pokok: Haji hanya dikerjakan di bulan haji dan memiliki rukun Wukuf di Padang Arafah; Umrah dapat dilaksanakan sewaktu-waktu.",
      "Rukun haji (6): Ihram, Wukuf di Arafah, Tawaf Ifadah, Sa'i, Tahallul, dan Tertib (tidak bisa diganti dam).",
      "Wajib haji (7): Ihram dari Miqat, Mabit Muzdalifah, Lempar Jumrah, Mabit Mina, Tawaf Wada', dan hindari larangan ihram (bisa ditebus dam).",
      "Nilai filosofis haji adalah kesetaraan manusia, persaudaraan sedunia, kerendahan hati, dan pengorbanan luhur."
    ],
    pengayaan: {
      judul: "Sejarah dan Makna Filosofis Tempat-Tempat Bersejarah Haji",
      deskripsi: "Telusuri napak tilas sejarah Maqam Ibrahim, Hijir Ismail, Sumur Zamzam, Jabal Rahmah, dan bukit Shafa-Marwah melalui tur virtual 3D Masjidil Haram.",
      referensiLanjut: "Buku Ensiklopedia Haji dan Umrah Kemenag RI dan Fiqih Sunnah karya Sayyid Sabiq."
    },
    remedial: {
      fokusMateri: "Hafalan 6 rukun haji dan perbedaan haji dengan umrah.",
      kegiatan: "Menyusun kartu bergambar urutan manasik haji dan latihan membedakan amalan rukun vs wajib haji."
    },
    evaluasi: [
      "Sebutkan 5 syarat wajib haji!",
      "Jelaskan pengertian Haji Tamattu' beserta konsekuensi dam-nya!",
      "Apa saja hal-hal yang dilarang bagi jamaah pria saat mengenakan pakaian ihram?"
    ],
    glosarium: [
      { istilah: "Istitha'ah", arti: "Kemampuan fisik, bekal biaya, keamanan, dan akses transportasi untuk haji." },
      { istilah: "Miqat Makani", arti: "Batas geografis tempat memulai niat ihram haji atau umrah." },
      { istilah: "Tawaf Wada'", arti: "Tawaf perpisahan yang dilakukan sebelum meninggalkan kota suci Makkah." },
      { istilah: "Dam", arti: "Denda berupa sembelihan hewan atau puasa karena melanggar wajib haji atau larangan ihram." }
    ],
    daftarPustaka: [
      "Kementerian Agama RI, Tuntunan Manasik Haji dan Umrah Resmi, Ditjen PHU, Jakarta, 2023.",
      "Sayyid Sabiq, Fiqih Sunnah Jilid 3 (Bab Haji & Umrah), Pena Pundi Aksara, Jakarta, 2017.",
      "Kemendikbudristek, Buku Guru PAI dan Budi Pekerti SMP Kelas VIII, Jakarta, 2021."
    ],
    verification: {
      status: "Terverifikasi",
      catatan: "Sesuai pedoman manasik haji Kementerian Agama RI dan ketentuan fatwa MUI."
    },
    gameList: [
      { tipe: "Rute Manasik", judul: "Peta Perjalanan Haji Akbar", deskripsi: "Tentukan urutan lokasi pergerakan jamaah haji dari Makkah, Arafah, Muzdalifah, hingga Mina." },
      { tipe: "Kuis Dam", judul: "Tantangan Denda Larangan Ihram", deskripsi: "Tebak konsekuensi denda yang harus dibayar jamaah berdasarkan jenis pelanggaran ihram." }
    ]
  },

  // =========================================================================
  // BAB 10: SEJARAH & PERADABAN ISLAM DINASTI TURKI USMANI
  // =========================================================================
  {
    babNomor: 10,
    semester: 2,
    judulBab: "Meneladani Sejarah dan Peradaban Islam: Kejayaan Dinasti Turki Usmani",
    tujuanPembelajaran: [
      "Menceritakan sejarah berdirinya Dinasti Turki Usmani di bawah kepemimpinan Utsman I (1299 M).",
      "Menganalisis strategi gemilang Sultan Mehmed II (Al-Fatih) dalam menaklukkan benteng Konstantinopel tahun 1453 M.",
      "Membuktikan kebenaran hadis nubuwwah Nabi Muhammad SAW tentang penaklukan Konstantinopel.",
      "Mengidentifikasi kemajuan peradaban Turki Usmani di bidang militer (Janissary), hukum (Qanunname), dan arsitektur (Mimar Sinan).",
      "Menganalisis faktor kemajuan serta sebab-sebab kemunduran Dinasti Turki Usmani.",
      "Mengambil ibrah kepemimpinan visioner, kegigihan pantang menyerah, dan toleransi keagamaan bagi generasi muda."
    ],
    kataKunci: ["Turki Usmani", "Mehmed II Al-Fatih", "Konstantinopel", "Hagia Sophia", "Mimar Sinan", "Janissary", "Toleransi"],
    petaKonsep: [
      "Latar Belakang & Pendirian → Kabilah Oghuz & Tokoh Pendiri Utsman I bin Ertugrul (1299 M)",
      "Puncak Penaklukan Bersejarah → Sultan Mehmed II Al-Fatih & Penaklukan Konstantinopel (1453 M)",
      "Peradaban & Warisan → Korps Janissary, Arsitektur Mimar Sinan (Masjid Biru & Suleymaniye)",
      "Toleransi Kekaisaran → Sistem Millet yang Melindungi Hak Umat Kristen dan Yahudi",
      "Ibrah Generasi Muda → Visi Besar, Kemampuan Multibahasa, Penguasaan Teknologi Meriam"
    ],
    ayoMengamati: {
      deskripsi: "Ilustrasi armada kapal perang Sultan Mehmed II ditarik melalui jalur darat melintasi bukit Galata pada malam hari menuju teluk Tanduk Emas (Golden Horn), mengejutkan benteng Konstantinopel.",
      imagePrompt: "Educational illustration of historic Ottoman naval ships being pulled overland on oiled wooden rollers across Galata hills by night under torchlight, led by young Sultan Mehmed II on horseback, epic strategic atmosphere, modern Islamic textbook style, 16:9",
      pertanyaanPengamatan: [
        "Strategi luar biasa apa yang dilakukan oleh Sultan Mehmed II pada ilustrasi sejarah di atas?",
        "Mengapa kapal perang diangkut melalui perbukitan daratan, bukan melalui lautan biasa?",
        "Nilai kegigihan, kreativitas tanpa batas, dan kepemimpinan apa yang dapat kamu pelajari dari peristiwa tersebut?"
      ],
      hubunganMateri: "Penaklukan Konstantinopel pada tahun 1453 M membuktikan bahwa keberhasilan besar lahir dari kombinasi keimanan yang kokoh, kecerdasan strategi, dan penguasaan sains teknologi.",
      captionGambar: "Ilustrasi 10.1: Kejeniusan taktik Sultan Mehmed II memindahkan kapal melalui darat."
    },
    ayoBerpikir: [
      "Hadis Rasulullah SAW menyatakan: 'Konstantinopel pasti akan ditaklukkan. Sebaik-baik pemimpin adalah pemimpinnya dan sebaik-baik pasukan adalah pasukannya'. Mengapa butuh waktu lebih dari 800 tahun sejak sabda itu terucap hingga berhasil ditaklukkan oleh pemuda berusia 21 tahun?",
      "Ketika berhasil memasuki kota Konstantinopel, Sultan Mehmed II menjamin keselamatan warga Nasrani dan tidak merusak tempat ibadah mereka. Bagaimana hal ini membuktikan akhlak toleransi Islam kepada dunia?"
    ],
    materiPembelajaran: [
      {
        subJudul: "1. Berdirinya Dinasti Turki Usmani dan Ekspansi Awal",
        konten: "Dinasti Turki Usmani didirikan oleh Utsman I (putra Ertugrul) dari kabilah Kayi suku Oghuz pada tahun 1299 M di Anatolia (Turki modern). Bermula dari emirat kecil pembela perbatasan, Turki Usmani berkembang menjadi kesultanan adidaya yang menghubungkan tiga benua: Asia, Eropa, dan Afrika. Kepemimpinan dilanjutkan oleh para sultan pemberani seperti Orhan, Murad I (pembentuk pasukan elit Janissary), dan Bayezid I (Sang Kilat).",
        poinKunci: [
          "Didirikan oleh Utsman bin Ertugrul pada tahun 1299 M",
          "Pasukan elit Janissary (Yeniceri) yang disiplin dan terlatih",
          "Kekhalifahan yang menaungi wilayah luas di tiga benua selama lebih dari 6 abad"
        ]
      },
      {
        subJudul: "2. Penaklukan Konstantinopel oleh Sultan Mehmed II (1453 M)",
        konten: "Konstantinopel adalah ibu kota Kekaisaran Romawi Timur (Bizantium) yang dilindungi oleh benteng Theodosius lapis tiga yang kokoh tak tertembus selama lebih dari 1.000 tahun. Pada tanggal 29 Mei 1453 M (20 Jumadil Ula 857 H), di usianya yang baru menginjak 21 tahun, Sultan Mehmed II berhasil menaklukkannya.\nFaktor kejeniusan strategi penaklukan:\n1. Mempelajari 6 bahasa dunia sejak kecil dan mendalami taktik militer serta hadis nubuwwah.\n2. Menggunakan teknologi meriam raksasa tercanggih (Meriam Basilica ciptaan insinyur Orban) untuk mendobrak dinding benteng batu tebal.\n3. Strategi tak terduga memindahkan 70 kapal perang melintasi bukit Galata lewat darat dalam waktu semalam menggunakan balok kayu berpelumas minyak untuk memotong rantai teluk Golden Horn.\nSetelah menaklukkan kota, Sultan bersujud syukur, menjamin kebebasan warga minoritas, mengganti nama kota menjadi Islambul (Istanbul), dan mengubah fungsi gereja Hagia Sophia menjadi masjid agung.",
        poinKunci: [
          "Penaklukan Konstantinopel 29 Mei 1453 M mengakhiri Abad Pertengahan dunia",
          "Sultan Mehmed II menguasai 6 bahasa dan memimpin di usia muda (21 tahun)",
          "Menghidupkan Piagam Toleransi (Sistem Millet) bagi pemeluk Kristen Ortodoks dan Yahudi"
        ]
      },
      {
        subJudul: "3. Puncak Peradaban dan Warisan Arsitektur Mimar Sinan",
        konten: "Turki Usmani mencapai puncak kemakmuran dan supremasi hukum di bawah Sultan Sulaiman Al-Qanuni (Suleiman the Magnificent, 1520–1566 M) yang menyusun kodifikasi hukum terpadu 'Qanunname'. Zaman ini melahirkan arsitek jenius peradaban Islam bernama Mimar Sinan yang membangun mahakarya arsitektur dunia seperti Masjid Suleymaniye di Istanbul dan Masjid Selimiye di Edirne dengan kubah megah tahan gempa. Selain arsitektur, Usmani mewariskan sistem jaminan sosial, rumah sakit wakaf gratis, dan kaligrafi mushaf yang sangat indah.",
        poinKunci: [
          "Puncak kejayaan di bawah Sultan Sulaiman Al-Qanuni",
          "Arsitek legendaris Mimar Sinan: pelopor kubah gantung megah",
          "Faktor kemunduran: krisis suksesi kepemimpinan, korupsi moral, dan stagnasi iptek"
        ]
      }
    ],
    dalilTerkait: [
      {
        kategori: "Hadis",
        surah: "HR. Ahmad",
        nomorAyat: "Musnad Ahmad No. 18977",
        teksArab: "لَتُفْتَحَنَّ الْقُسْطَنْطِينِيَّةُ فَلَنِعْمَ الْأَمِيرُ أَمِيرُهَا وَلَنِعْمَ الْجَيْشُ ذَلِكَ الْجَيْشُ",
        latin: "Latuftaḥannal-qusṭanṭīniyyatu falani'mal-amīru amīruhā wa lani'mal-jaisyu żālikal-jaisy.",
        terjemahan: "Pasti Konstantinopel akan ditaklukkan. Maka sebaik-baik pemimpin adalah pemimpinnya, dan sebaik-baik pasukan adalah pasukan tersebut.",
        tafsirSingkat: "Nubuwwah agung Rasulullah SAW yang terbukti nyata berabad-abad kemudian melalui kepemimpinan bertakwa dan jenius Sultan Mehmed II Al-Fatih.",
        kosakataTerpilih: [
          { lafaz: "لَتُفْتَحَنَّ", arti: "Pasti sungguh akan ditaklukkan" },
          { lafaz: "الْقُسْطَنْطِينِيَّةُ", arti: "Kota Konstantinopel" },
          { lafaz: "فَلَنِعْمَ الْأَمِيرُ", arti: "Maka sebaik-baik pemimpin" },
          { lafaz: "ذَلِكَ الْجَيْشُ", arti: "Pasukan tersebut" }
        ]
      },
      {
        kategori: "Al-Qur'an",
        surah: "QS. Al-Fath",
        nomorAyat: "1",
        teksArab: "إِنَّا فَتَحْنَا لَكَ فَتْحًۭا مُّبِينًۭا",
        latin: "Innā fataḥnā laka fatḥam mubīnā.",
        terjemahan: "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata.",
        tafsirSingkat: "Kemenangan sejati dan pembukaan kota senantiasa dianugerahkan Allah kepada hamba-hamba-Nya yang berjuang dengan keikhlasan, doa, dan kesungguhan strategi.",
        kosakataTerpilih: [
          { lafaz: "إِنَّا فَتَحْنَا", arti: "Sesungguhnya Kami telah membuka / memberi kemenangan" },
          { lafaz: "فَتْحًا مُّبِينًا", arti: "Kemenangan yang sangat nyata" }
        ]
      }
    ],
    contohKehidupan: [
      "Memiliki cita-cita besar di usia muda dan berikhtiar tekun mencapainya sebagaimana Sultan Mehmed II.",
      "Mempelajari bahasa asing (Inggris, Arab, dll.) untuk memperluas wawasan dan pergaulan internasional.",
      "Menghormati hak ibadah dan tempat ibadah penganut agama lain di lingkungan tempat tinggal.",
      "Menghargai warisan seni arsitektur dan cagar budaya peninggalan sejarah bangsa.",
      "Menjaga kedisiplinan dan kekompakan tim dalam menyelesaikan tugas kelompok atau organisasi OSIS."
    ],
    aktivitasIndividu: [
      "Buatlah biografi tokoh 1 lembar tentang Sultan Mehmed II Al-Fatih meliputi: usia saat memimpin, penguasaan bahasa, strategi penaklukan, dan perlakuan terhadap warga taklukan.",
      "Tuliskan analisis: 3 pelajaran berharga dari keruntuhan Dinasti Turki Usmani yang harus diwaspadai bangsa Indonesia."
    ],
    aktivitasKelompok: [
      "Bentuk kelompok kerja. Buatlah replika maket 3D sederhana benteng Konstantinopel dan jalur perahu bukit Galata menggunakan bahan stirofoam/kardus bekas.",
      "Diskusikan dalam kelompok: 'Bagaimana arsitektur Masjid Hagia Sophia memadukan unsur seni Bizantium dan kubah kaligrafi Islam?'."
    ],
    studiKasus: [
      {
        judulKasus: "Pemuda yang Pesimis dan Kurang Percaya Diri dengan Masa Depan",
        deskripsi: "Bayu, seorang siswa kelas VIII, merasa dirinya tidak memiliki bakat apa-apa, malas belajar bahasa asing, dan merasa mustahil bisa menjadi pemimpin atau orang sukses karena berasal dari keluarga sederhana.",
        pertanyaan: [
          "Bagaimana kisah Sultan Mehmed II Al-Fatih yang menaklukkan kota terkuat di usia 21 tahun dapat memotivasi Bayu?",
          "Langkah konkret apa yang harus dimulai Bayu hari ini untuk membangun kompetensi dan rasa percaya dirinya?",
          "Peran apa yang bisa kamu ambil sebagai sahabat untuk mendampingi dan menyemangati Bayu?"
        ],
        solusiGuru: "Kesuksesan besar Mehmed II bukan karena faktor keberuntungan, melainkan buah dari kedisiplinan belajar sejak dini, bimbingan guru bertakwa (Syaikh Aq Syamsuddin), dan keyakinan pada janji Allah. Bayu perlu dibantu menemukan minatnya, menyusun target belajar harian, dan membangun kebiasaan membaca buku secara bertahap."
      }
    ],
    ayoBerdiskusi: [
      "Mengapa toleransi keagamaan yang diterapkan para sultan Usmani (Sistem Millet) menjadi faktor penting kestabilan kekaisaran selama ratusan tahun?",
      "Bagaimana peranan teknologi meriam raksasa Basilica membuktikan pentingnya riset sains dalam pertahanan negara?"
    ],
    latihan: {
      pilihanGanda: [
        {
          id: "pg-k8-10-1",
          pertanyaan: "Ibu kota Kekaisaran Romawi Timur yang berhasil ditaklukkan oleh Sultan Mehmed II pada tanggal 29 Mei 1453 M adalah...",
          opsi: ["A. Athena", "B. Konstantinopel", "C. Roma", "D. Alexandria"],
          kunciJawaban: 1,
          pembahasan: "Kota Konstantinopel ditaklukkan pada 29 Mei 1453 M dan diubah namanya menjadi Istanbul."
        },
        {
          id: "pg-k8-10-2",
          pertanyaan: "Pasukan infanteri elit pengawal pribadi Sultan Turki Usmani yang sangat disiplin dan berdisiplin tinggi bernama...",
          opsi: ["A. Kavaleri", "B. Janissary (Yeniceri)", "C. Samudera", "D. Pasukan Salib"],
          kunciJawaban: 1,
          pembahasan: "Korps Janissary adalah pasukan elit terlatih kebanggaan militer Kesultanan Turki Usmani."
        },
        {
          id: "pg-k8-10-3",
          pertanyaan: "Arsitek legendaris Turki Usmani yang merancang mahakarya Masjid Suleymaniye dan ratusan kubah megah adalah...",
          opsi: ["A. Mimar Sinan", "B. Al-Farabi", "C. Ibnu Khaldun", "D. Al-Jazari"],
          kunciJawaban: 0,
          pembahasan: "Mimar Sinan adalah bapak arsitektur klasik Turki Usmani yang karyanya diakui warisan dunia UNESCO."
        }
      ],
      isianSingkat: [
        {
          id: "is-k8-10-1",
          pertanyaan: "Gelar 'Al-Fatih' yang disematkan kepada Sultan Mehmed II memiliki arti...",
          kunciJawaban: "Sang Penakluk / Pembuka",
          pembahasan: "Al-Fatih berarti pembuka kemenangan bagi kota Konstantinopel."
        },
        {
          id: "is-k8-10-2",
          pertanyaan: "Katedral megah berkubah raksasa di Konstantinopel yang dialihfungsikan menjadi masjid agung oleh Mehmed II adalah...",
          kunciJawaban: "Hagia Sophia (Aya Sofya)",
          pembahasan: "Hagia Sophia menjadi landmark bersejarah perpaduan arsitektur Kristen dan Islam."
        }
      ],
      benarSalah: [
        {
          id: "bs-k8-10-1",
          pernyataan: "Saat menaklukkan Konstantinopel, Sultan Mehmed II memerintahkan pasukannya untuk membantai seluruh warga sipil kota.",
          jawabanBenar: false,
          pembahasan: "Salah. Sultan Mehmed II memberikan jaminan perlindungan penuh bagi warga sipil dan membebaskan mereka beribadah dengan damai."
        },
        {
          id: "bs-k8-10-2",
          pernyataan: "Sultan Mehmed II berhasil memindahkan puluhan kapal perang melalui jalur darat melintasi bukit Galata dalam waktu satu malam.",
          jawabanBenar: true,
          pembahasan: "Benar. Strategi pemindahan kapal lewat darat adalah salah satu taktik militer tercerdas dalam sejarah dunia."
        }
      ],
      menjodohkan: [
        { id: "mj-k8-10-1", pertanyaan: "Utsman I", pasanganJawaban: "Pendiri Dinasti Turki Usmani pada tahun 1299 M" },
        { id: "mj-k8-10-2", pertanyaan: "Mehmed II Al-Fatih", pasanganJawaban: "Penakluk Konstantinopel di Usia 21 Tahun (1453 M)" },
        { id: "mj-k8-10-3", pertanyaan: "Sulaiman Al-Qanuni", pasanganJawaban: "Penyusun Kitab Kodifikasi Hukum Usmani (Qanunname)" },
        { id: "mj-k8-10-4", pertanyaan: "Mimar Sinan", pasanganJawaban: "Arsitek Agung Pembangun Kubah Megah Masjid Usmani" }
      ],
      uraian: [
        {
          id: "ur-k8-10-1",
          pertanyaan: "Jelaskan 3 kunci sukses kepemimpinan Sultan Mehmed II Al-Fatih yang dapat diteladani oleh generasi muda Indonesia!",
          rubrikPenilaian: "Memuat: 1) Kemampuan intelektual menguasai banyak bahasa dan ilmu sains sejak usia dini, 2) Kegigihan mental dan kejeniusan strategi tanpa kenal menyerah, 3) Ketaatan spiritual yang mendalam serta toleransi tinggi terhadap kaum minoritas."
        }
      ],
      hots: [
        {
          id: "ht-k8-10-1",
          pertanyaan: "Mengapa sebuah peradaban besar seperti Dinasti Turki Usmani yang berkuasa selama lebih dari 6 abad pada akhirnya mengalami kemunduran dan keruntuhan pada awal abad ke-20? Pelajaran strategis apa yang harus diambil oleh para pemimpin bangsa Indonesia agar kejayaan negara tetap terjaga?",
          panduanJawaban: "Penyebab keruntuhan: 1) Penurunan moral dan korupsi para pejabat, 2) Keterbelakangan sains dan tertinggalnya riset teknologi dari bangsa barat, 3) Konflik internal perebutan takhta. Pelajarannya: Negara harus konsisten menegakkan supremasi hukum yang adil, mencerdaskan rakyat melalui inovasi iptek, serta menjaga persatuan bangsa dari polarisasi."
        }
      ]
    },
    refleksi: {
      pengantar: "Ambillah ibrah kepemimpinan dan keteladanan dari sejarah agung Turki Usmani:",
      pertanyaanRefleksi: [
        "Apakah saya memiliki mimpi besar untuk membawa perubahan positif bagi agama, bangsa, dan negara?",
        "Apakah saya sudah mulai melatih kedisiplinan dan etos kerja keras dalam keseharian saya?",
        "Bagaimana sikap saya dalam menghargai perbedaan keyakinan teman di lingkungan sekitar?"
      ],
      sikapDiterapkan: "Memiliki jiwa kepemimpinan visioner, ulet, dan menghormati hak sesama manusia.",
      kebiasaanDilakukan: "Belajar tekun, mengasah keterampilan bahasa dan sains, serta menjaga integritas akhlak."
    },
    rangkuman: [
      "Dinasti Turki Usmani didirikan oleh Utsman I pada tahun 1299 M dan berkembang menjadi kekaisaran adidaya di tiga benua.",
      "Sultan Mehmed II Al-Fatih menaklukkan benteng Konstantinopel pada 29 Mei 1453 M di usia 21 tahun, membuktikan nubuwwah hadis Nabi SAW.",
      "Strategi brilian pemindahan kapal perang melintasi bukit Galata lewat darat menjadi catatan emas taktik sejarah dunia.",
      "Turki Usmani mencapai zaman keemasan hukum dan arsitektur di bawah Sulaiman Al-Qanuni dan arsitek agung Mimar Sinan.",
      "Kejayaan peradaban berdiri di atas keimanan yang kokoh, penguasaan sains teknologi, keadilan hukum, dan perlindungan toleransi bagi seluruh rakyat."
    ],
    pengayaan: {
      judul: "Telaah Inovasi Meriam Raksasa Basilica Karya Insinyur Orban",
      deskripsi: "Pelajari bagaimana ilmu metalurgi dan teknik pengecoran perunggu meriam raksasa Basilica abad ke-15 mengubah doktrin perang benteng di Eropa.",
      referensiLanjut: "Buku '1453: The Holy War for Constantinople and the Clash of Islam and the West' karya Roger Crowley."
    },
    remedial: {
      fokusMateri: "Peristiwa penaklukan Konstantinopel tahun 1453 M oleh Mehmed II.",
      kegiatan: "Menjawab kuis kronologi penaklukan dan mengidentifikasi 3 keistimewaan karakter Sultan Al-Fatih."
    },
    evaluasi: [
      "Sebutkan isi hadis Rasulullah SAW tentang penaklukan kota Konstantinopel!",
      "Bagaimana taktik Sultan Mehmed II dalam memindahkan kapal perang ke teluk Tanduk Emas?",
      "Sebutkan 3 peninggalan arsitektur bersejarah dari masa kejayaan Turki Usmani!"
    ],
    glosarium: [
      { istilah: "Al-Fatih", arti: "Gelar Sang Penakluk atau Pembuka kemenangan bagi Sultan Mehmed II." },
      { istilah: "Konstantinopel", arti: "Ibu kota Kekaisaran Bizantium yang kini bernama Istanbul." },
      { istilah: "Janissary", arti: "Korps pasukan infanteri elit terlatih Kesultanan Turki Usmani." },
      { istilah: "Sistem Millet", arti: "Sistem otonomi hukum dan keagamaan bagi komunitas non-muslim di bawah Turki Usmani." }
    ],
    daftarPustaka: [
      "Prof. Dr. Badri Yatim, Sejarah Peradaban Islam, PT RajaGrafindo Persada, Jakarta, 2018.",
      "Roger Crowley, 1453: Detik-Detik Jatuhnya Konstantinopel ke Tangan Muslim, Alvabet, Jakarta, 2017.",
      "Kemendikbudristek, Buku Panduan Guru PAI dan Budi Pekerti SMP Kelas VIII, Jakarta, 2021."
    ],
    verification: {
      status: "Terverifikasi",
      catatan: "Sesuai rujukan hadis Musnad Ahmad dan literatur historiografi kesultanan Usmani terakreditasi."
    },
    gameList: [
      { tipe: "Taktik Al-Fatih", judul: "Tantangan Benteng Konstantinopel", deskripsi: "Pilih strategi tepat dalam mengatasi rintangan laut dan benteng batu Konstantinopel." },
      { tipe: "Kuis Arsitektur", judul: "Mahakarya Mimar Sinan", deskripsi: "Tebak nama masjid dan bangunan bersejarah rancangan arsitek legendaris Mimar Sinan." }
    ]
  }
];
