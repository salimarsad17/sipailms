import type { BabPelajaranData, BukuPelajaranData } from "./bukuPaiKemendikbud";

export const BAB_LIST_KELAS_9: BabPelajaranData[] = [
  // =========================================================================
  // SEMESTER 1 (BAB 1 - 5)
  // =========================================================================
  {
    babNomor: 1,
    semester: 1,
    judulBab: "Membaca, Menghafal, Menulis, dan Menjelaskan Ayat Al-Qur'an tentang Semangat Keilmuan (Q.S. Al-Mujadilah: 11 dan Q.S. Az-Zumar: 9) serta Hadis Terkait dan Hukum Bacaan Mim Sukun",
    kategori: "Al-Qur'an & Tajwid",
    elemenCP: "Al-Qur'an dan Hadis",
    capaianPembelajaran:
      "Peserta didik mampu membaca secara tartil, menghafal secara fasih, menulis kembali dengan kaidah khat standar, dan menjelaskan kandungan Q.S. Al-Mujadilah/58: 11 dan Q.S. Az-Zumar/39: 9 serta hadis terkait tentang etos menuntut ilmu dan keutamaan orang berilmu, menerapkan hukum tajwid Mim Sukun (Ikhfa Syafawi, Idgham Mimi, dan Izhar Syafawi), serta menginternalisasikan semangat keilmuan dalam kehidupan sehari-hari.",
    ringkasan:
      "Ilmu pengetahuan adalah pelita kehidupan yang mengangkat derajat manusia di sisi Allah SWT dan sesama makhluk (Q.S. Al-Mujadilah: 11). Al-Qur'an menegaskan perbedaan mutlak antara orang yang berilmu dengan orang yang tidak berpengetahuan (Q.S. Az-Zumar: 9). Bab ini membedah adab majelis ilmu, hukum bacaan mim sukun, serta panggilan moral seorang muslim untuk menjadi pembelajar sepanjang hayat.",
    tujuanPembelajaran: [
      "Membaca Q.S. Al-Mujadilah/58: 11 dan Q.S. Az-Zumar/39: 9 dengan tartil sesuai kaidah tajwid dan makhraj yang benar.",
      "Menghafalkan Q.S. Al-Mujadilah/58: 11 dan Q.S. Az-Zumar/39: 9 beserta terjemahannya secara lancar dan mutqin.",
      "Menuliskan kembali ayat-ayat Al-Qur'an tentang semangat keilmuan dengan kaidah imla' dan khat mushaf standar.",
      "Mengidentifikasi dan mengaplikasikan hukum bacaan Mim Sukun (Ikhfa Syafawi, Idgham Mimi/Mutamatsilain, dan Izhar Syafawi).",
      "Menjelaskan kandungan makna ayat tentang tingginya derajat orang yang beriman dan berilmu pengetahuan serta adab bermajelis.",
      "Menunjukkan sikap tekun belajar, kritis, cinta literasi sains, dan rendah hati dalam menuntut ilmu."
    ],
    materiPokok: [
      "Teks ayat, transliterasi Latin, dan terjemahan Q.S. Al-Mujadilah/58: 11 dan Q.S. Az-Zumar/39: 9.",
      "Kajian hukum tajwid Mim Sukun (مْ): Ikhfa Syafawi (bertemu ب), Idgham Mimi (bertemu م), dan Izhar Syafawi (bertemu selain م dan ب).",
      "Asbabun nuzul dan adab menghadiri majelis ilmu (memberikan kelapangan tempat duduk dan kepatuhan dalam kebaikan).",
      "Komparasi derajat orang berilmu vs orang bodoh menurut Q.S. Az-Zumar: 9 dan hadis Nabi SAW jalan menuju surga.",
      "Etos keilmuan muslim: Budaya riset, membaca (iqra'), berpikir kritis, dan implementasi teknologi bermanfaat."
    ],
    istilahPenting: [
      { kata: "Tafassahu fil-Majalis", arti: "Berlapang-lapanglah kamu dalam majelis-majelis pertemuan dan ilmu pengetahuan." },
      { kata: "Yarfa'illahu", arti: "Allah akan mengangkat dan meninggikan derajat orang-orang yang beriman dan berilmu." },
      { kata: "Ulul Albab", arti: "Orang-orang yang memiliki akal budi mendalam dan senantiasa berzikir serta berpikir kritis." },
      { kata: "Ikhfa Syafawi", arti: "Hukum mim sukun bertemu huruf ba (ب), dibaca samar di kedua bibir disertai ghunnah (dengung)." },
      { kata: "Idgham Mimi", arti: "Hukum mim sukun bertemu huruf mim (م), dibaca melebur sempurna dengan ghunnah." },
      { kata: "Izhar Syafawi", arti: "Hukum mim sukun bertemu 26 huruf hijaiyah selain ba dan mim, dibaca jelas tanpa dengung." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Mujadilah",
        ayat: "11",
        teksArab: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْٓا اِذَا قِيْلَ لَكُمْ تَفَسَّحُوْا فِى الْمَجٰلِسِ فَافْسَحُوْا يَفْسَحِ اللّٰهُ لَكُمْۚ وَاِذَا قِيْلَ انْشُزُوْا فَانْشُزُوْا يَرْفَعِ اللّٰهُ الَّذِيْنَ اٰمَنُوْا مِنْكُمْۙ وَالَّذِيْنَ اُوْتُوا الْعِلْمَ دَرَجٰتٍۗ وَاللّٰهُ بِمَا تَعْمَلُوْنَ خَبِيْرٌ",
        latin: "Yā ayyuhallażīna āmanū iżā qīla lakum tafassaḥū fil-majālisi fafsaḥū yafsaḥillāhu lakum, wa iżā qīlansyuzū fansyuzū yarfa'illāhullażīna āmanū minkum wallażīna ūtul-'ilma darajāt, wallāhu bimā ta'malūna khabīr.",
        arti: "Wahai orang-orang yang beriman! Apabila dikatakan kepadamu, 'Berilah kelapangan di dalam majelis-majelis,' maka lapangkanlah, niscaya Allah akan memberi kelapangan untukmu. Dan apabila dikatakan, 'Berdirilah kamu,' maka berdirilah, niscaya Allah akan mengangkat derajat orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat. Dan Allah Mahateliti terhadap apa yang kamu kerjakan."
      },
      {
        surah: "Q.S. Az-Zumar",
        ayat: "9",
        teksArab: "أَمَّنْ هُوَ قَـٰنِتٌ ءَانَآءَ ٱلَّيْلِ سَاجِدًۭا وَقَآئِمًۭا يَحْذَرُ ٱلْـَٔاخِرَةَ وَيَرْجُوا۟ رَحْمَةَ رَبِّهِۦ ۗ قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُو۟لُوا۟ ٱلْأَلْبَـٰبِ",
        latin: "Am man huwa qānitun ānā'al-laili sājidaw wa qā'imay yaḥżarul-ākhirata wa yarjū raḥmata rabbih, qul hal yastawillażīna ya'lamūna wallażīna lā ya'lamūn, innamā yatażakkaru ulul-albāb.",
        arti: "(Apakah kamu orang musyrik yang lebih beruntung) ataukah orang yang beribadah pada waktu malam dengan sujud dan berdiri, karena takut kepada (azab) akhirat dan mengharapkan rahmat Tuhannya? Katakanlah, 'Apakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?' Sebenarnya hanya orang yang berakal sehat yang dapat menerima pelajaran."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Shahih Muslim No. 2699",
        teksArab: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
        latin: "Man salaka ṭarīqan yaltamisu fīhi 'ilman sahhalallāhu lahū bihī ṭarīqan ilal-jannah.",
        arti: "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Islam adalah peradaban ilmu. Ayat pertama yang diwahyukan kepada Nabi Muhammad SAW adalah 'Iqra' (bacalah), yang meletakkan dasar literasi, observasi sains, dan spiritualitas. Menuntut ilmu bukan sekadar pilihan karier duniawi, melainkan kewajiban mutlak dan ibadah mulia yang menaikkan martabat manusia di dunia dan akhirat.",
      subMateri: [
        {
          judul: "1. Keutamaan Orang Berilmu dan Adab Bermajelis (Q.S. Al-Mujadilah: 11)",
          konten:
            "Ayat ini turun ketika sahabat berebut tempat duduk di dekat Rasulullah SAW. Allah mendidik orang beriman agar memiliki kelapangan dada dan tepas selira. Allah menjanjikan kemuliaan berlipat: bukan hanya orang beriman, tetapi orang beriman yang memiliki ilmu pengetahuan ('utul 'ilma darajat). Ilmu tanpa iman melahirkan kehancuran, sedangkan iman tanpa ilmu rentan disesatkan.",
          poinPenting: [
            "Allah mengangkat derajat orang beriman dan berilmu beberapa tingkatan di dunia dan akhirat.",
            "Adab bermajelis: Memberikan ruang tempat duduk, tidak berdesakan egois, dan siap menerima tugas kebaikan.",
            "Perpaduan sinergis antara integritas keimanan dan kepakaran sains teknologi."
          ]
        },
        {
          judul: "2. Nilai Kritis dan Keistimewaan Ulul Albab (Q.S. Az-Zumar: 9)",
          konten:
            "Pertanyaan retoris 'Hal yastawi...' menegaskan ketidaksetaraan nilai antara orang terpelajar dan orang bodoh. Orang berilmu beribadah dengan kesadaran penuh dan rasa harap-cemas (khauf dan raja') kepada Allah. Mereka digelari 'Ulul Albab'—yakni pemikir yang merenungkan ciptaan langit dan bumi serta mengambil ibrah sejarah.",
          poinPenting: [
            "Orang berilmu memiliki orientasi ukhrawi dan kesadaran spiritual yang lebih jernih.",
            "Islam melarang kejumudan berpikir dan mendorong semangat riset ilmiah.",
            "Ilmu sejati melahirkan rasa takut dan tunduk kepada keagungan Allah SWT."
          ]
        },
        {
          judul: "3. Hukum Tajwid Mim Sukun (Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi)",
          konten:
            "Kaidah mim sukun terjadi apabila huruf mim berharakat sukun (مْ) bertemu huruf hijaiyah berikutnya: 1) Ikhfa Syafawi: bertemu huruf Ba (ب), dibaca samar dan mendengung 2 harakat; 2) Idgham Mimi/Mutamatsilain: bertemu sesama huruf Mim (م), dibaca melebur disertai ghunnah; 3) Izhar Syafawi: bertemu salah satu dari 26 huruf hijaiyah lainnya, dibaca jelas di bibir tanpa dengung berlebih.",
          poinPenting: [
            "Ikhfa Syafawi: Mim sukun + Ba (contoh: تَرْمِيهِم بِحِجَارَةٍ).",
            "Idgham Mimi: Mim sukun + Mim (contoh: لَهُم مَّا يَشَآءُونَ).",
            "Izhar Syafawi: Mim sukun + 26 huruf selain Mim dan Ba (contoh: أَنْعَمْتَ عَلَيْهِمْ)."
          ]
        }
      ],
      aktivitasSiswa: [
        "Identifikasi Tajwid: Menemukan dan mengklasifikasikan hukum bacaan mim sukun dalam surah Al-Mujadilah ayat 11.",
        "Praktik Tahfiz & Tilawah: Melantunkan Q.S. Az-Zumar ayat 9 dengan tajwid sempurna di hadapan guru dan teman sejawat.",
        "Karya Literasi Sains: Menulis esai reflektif bertema 'Peran Pelajar Muslim Abad 21 dalam Menguasai Kecerdasan Buatan dan Sains Berakhlak Mulia'."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Bernalar Kritis & Mandiri): Gemar membaca, haus akan ilmu pengetahuan bermanfaat, tidak cepat puas, serta mengamalkan kepandaiannya untuk menolong sesama makhluk."
    }
  },

  {
    babNomor: 2,
    semester: 1,
    judulBab: "Meyakini dan Merefleksikan Iman kepada Hari Akhir",
    kategori: "Akidah",
    elemenCP: "Akidah",
    capaianPembelajaran:
      "Peserta didik mampu meyakini dan merefleksikan makna beriman kepada Hari Akhir sebagai rukun iman kelima, menganalisis tanda-tanda kiamat sugra dan kubra, mendeskripsikan tahapan kehidupan alam akhirat, serta menumbuhkan kesadaran moral, tanggung jawab, dan integritas amal saleh dalam kehidupan sehari-hari.",
    ringkasan:
      "Hari Akhir (Kiamat) adalah hari kehancuran total seluruh alam semesta dan awal kehidupan abadi pembalasan di akhirat. Setiap hembusan nafas dan perbuatan manusia dicatat oleh malaikat Raqib dan Atid. Mengimani hari akhir membentuk jiwa yang wara' (berhati-hati), memupuk kejujuran, dan menyadarkan manusia bahwa dunia hanyalah ladang tempat menanam bekal bagi kehidupan abadi kelak.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian, dalil naqli, dan dalil aqli tentang kepastian tibanya Hari Akhir.",
      "Mengklasifikasikan tanda-tanda kiamat sugra (kecil) dan kiamat kubra (besar) berdasarkan hadis shahih.",
      "Mendeskripsikan tahapan alam akhirat: Barzakh, Ba'ats, Mahsyar, Hisab, Mizan, Shirath, Surga, dan Neraka.",
      "Menganalisis hikmah dan dampak positif keimanan pada hari kiamat terhadap pembentukan akhlak terpuji.",
      "Menampilkan perilaku jujur, tanggung jawab, disiplin ibadah, dan menjauhi perbuatan maksiat."
    ],
    materiPokok: [
      "Hakikat Rukun Iman kelima: Kewajiban meyakini Hari Kiamat dan Hari Pembalasan.",
      "Perbedaan Kiamat Sugra (kematian personal, bencana alam, pergeseran moral) dan Kiamat Kubra (kehancuran kosmis).",
      "Perjalanan manusia di alam akhirat: Yaumul Ba'ats (kebangkitan), Yaumul Mahsyar, Yaumul Hisab, Yaumul Mizan, dan Shirath.",
      "Surga sebagai balasan orang bertakwa dan Neraka sebagai ganjaran orang kafir serta pendosa.",
      "Refleksi sikap: Integritas anti-korupsi, anti-mencontek, dan persiapan bekal amal jariyah."
    ],
    istilahPenting: [
      { kata: "Kiamat Sugra", arti: "Kiamat kecil, yaitu kematian seseorang atau bencana alam yang merusak sebagian wilayah bumi." },
      { kata: "Kiamat Kubra", arti: "Kiamat besar, yaitu kehancuran total seluruh jagat raya dan berakhirnya kehidupan alam dunia." },
      { kata: "Yaumul Barzakh", arti: "Alam kubur tempat penantian ruh manusia hingga ditiupnya sangkakala kebangkitan." },
      { kata: "Yaumul Ba'ats", arti: "Hari dibangkitkannya seluruh manusia dari kubur untuk mempertanggungjawabkan perbuatannya." },
      { kata: "Yaumul Mahsyar", arti: "Hari dikumpulkannya seluruh makhluk di padang yang sangat luas di bawah terik matahari yang dekat." },
      { kata: "Yaumul Hisab & Mizan", arti: "Hari perhitungan rincian amal dan penimbangan beratnya kebajikan melawan keburukan." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Hajj",
        ayat: "7",
        teksArab: "وَأَنَّ ٱلسَّاعَةَ ءَاتِيَةٌۭ لَّا رَيْبَ فِيهَا وَأَنَّ ٱللَّهَ يَبْعَثُ مَن فِى ٱلْقُبُورِ",
        latin: "Wa annas-sā'ata ātiyatul lā raiba fīhā wa annallāha yab'aṡu man fil-qubūr.",
        arti: "Dan sungguh, (hari) Kiamat itu pasti datang, tidak ada keraguan padanya; dan sungguh, Allah akan membangkitkan siapa pun yang di dalam kubur."
      },
      {
        surah: "Q.S. Al-Zalzalah",
        ayat: "7-8",
        teksArab: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًۭا يَرَهُۥ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍۢ شَرًّۭا يَرَهُۥ",
        latin: "Famay ya'mal miṡqāla żarratin khairay yarah. Wa may ya'mal miṡqāla żarratin syarray yarah.",
        arti: "Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya. Dan barangsiapa mengerjakan kejahatan seberat zarrah, niscaya dia akan melihat (balasan)nya."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Hadits Arba'in No. 2 (Hadits Jibril)",
        teksArab: "قَالَ فَأَخْبِرْنِي عَنِ السَّاعَةِ قَالَ مَا الْمَسْئُولُ عَنْهَا بِأَعْلَمَ مِنَ السَّائِلِ",
        latin: "Qāla fa'akhbirnī 'anis-sā'ah, qāla mal-mas'ūlu 'anhā bi'a'lama minas-sā'il.",
        arti: "Jibril bertanya: 'Beritahukan kepadaku kapan terjadinya Kiamat?' Rasulullah menjawab: 'Orang yang ditanya tentangnya tidak lebih tahu daripada orang yang bertanya.'"
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Keyakinan akan adanya Hari Akhir adalah kompas moral paling ampuh bagi seorang manusia. Bila seseorang meyakini bahwa setiap detik kehidupannya dipantau dan akan diadili tanpa kompromi, ia tidak akan berani melakukan kecurangan, penindasan, atau kezaliman tersembunyi sekalipun.",
      subMateri: [
        {
          judul: "1. Hakikat dan Kepastian Hari Akhir Menurut Dalil Naqli dan Sains",
          konten:
            "Secara ilmiah (teori fisika kosmologi/entropi dan hukum termodinamika), energi matahari akan habis dan jagat raya akan mengalami keruntuhan (Big Crunch). Al-Qur'an menggambarkan bumi diguncangkan, gunung diterbangkan laksana bulu, dan bintang-bintang berhamburan. Hari akhir adalah kepastian mutlak yang wajib diyakini tanpa keraguan.",
          poinPenting: [
            "Kehancuran alam semesta sejalan dengan dalil Al-Qur'an dan hukum fisika kosmologi.",
            "Waktu terjadinya kiamat merupakan rahasia gaib yang hanya diketahui oleh Allah SWT.",
            "Kematian setiap manusia (kiamat sugra) adalah pintu gerbang menuju alam akhirat."
          ]
        },
        {
          judul: "2. Tahapan Perjalanan Manusia di Alam Akhirat",
          konten:
            "Dimulai dari alam barzakh (pertanyaan malaikat Munkar dan Nakir), ditiupnya sangkakala pertama (kematian kosmis) dan sangkakala kedua (kebangkitan dari kubur/Yaumul Ba'ats). Manusia digiring ke Padang Mahsyar, menerima kitab catatan amal (Yaumut Talaqi), diadili melalui Yaumul Hisab, ditimbang melalui Yaumul Mizan, meniti jembatan Ash-Shirath, hingga menetap di Surga atau Neraka.",
          poinPenting: [
            "Alam Barzakh: Dinding pemisah antara dunia dan akhirat, merasakan nikmat atau siksa kubur.",
            "Yaumul Hisab dan Mizan: Penghitungan dan penimbangan amal yang adil dan transparan.",
            "Ash-Shirath: Titian di atas neraka Jahannam yang dilintasi manusia sesuai kadar amalnya."
          ]
        },
        {
          judul: "3. Pengaruh Keimanan terhadap Pembentukan Kepribadian",
          konten:
            "Orang yang beriman pada hari akhir memiliki kendali diri (self-control) yang tangguh. Ia menjauhi perbuatan tercela seperti korupsi, fitnah, perundungan, dan kecurangan akademik karena takut akan azab Allah. Sebaliknya, ia bersemangat memperbanyak sedekah jariyah, shalat, menuntut ilmu, dan berbakti kepada orang tua.",
          poinPenting: [
            "Menumbuhkan sifat mawas diri dan rasa tanggung jawab pribadi.",
            "Menjauhkan diri dari keserakahan duniawi dan perilaku hedonisme.",
            "Memberikan ketabahan dan harapan bahwa setiap keadilan yang belum tuntas di dunia akan diadili di akhirat."
          ]
        }
      ],
      aktivitasSiswa: [
        "Bagan Kronologis: Menyusun infografik alur tahapan kehidupan manusia dari alam dunia hingga alam surga/neraka.",
        "Refleksi Diri (Muhasabah): Menulis jurnal 'Surat untuk Diriku Sendiri di Alam Kubur' mengenai bekal amal yang sudah disiapkan.",
        "Analisis Isu: Diskusi kelompok tentang fenomena krisis moral remaja dan solusinya melalui penguatan iman hari akhir."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Beriman, Bertakwa, dan Berakhlak Mulia): Senantiasa jujur, bertanggung jawab, menghargai waktu, dan menjaga kebersihan hati dari niat-niat buruk."
    }
  },

  {
    babNomor: 3,
    semester: 1,
    judulBab: "Menerapkan Makna Cinta Lingkungan dalam Kehidupan Sehari-hari",
    kategori: "Akhlak",
    elemenCP: "Akhlak",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan menerapkan nilai-nilai akhlak Islam terhadap lingkungan hidup (ekoteologi Islam), menganalisis pesan Q.S. Ar-Rum/30: 41 dan Q.S. Al-A'raf/7: 56 tentang larangan berbuat kerusakan di bumi, serta merefleksikan peran khalifah fil-ardh melalui tindakan nyata konservasi alam di sekolah, rumah, dan masyarakat.",
    ringkasan:
      "Bumi dan seisinya adalah amanah Allah SWT kepada manusia sebagai khalifah di muka bumi. Eksploitasi berlebihan, pencemaran limbah, pembalakan liar, dan pemborosan energi telah memicu krisis iklim global (Q.S. Ar-Rum: 41). Islam mengajarkan akhlak ekologis (Hifzhul Bi'ah): menjaga kelestarian air, menanam pohon, mengelola sampah, dan dilarang keras membuat kerusakan di muka bumi setelah Allah memperbaikinya (Q.S. Al-A'raf: 56).",
    tujuanPembelajaran: [
      "Membaca dan menelaah kandungan Q.S. Ar-Rum/30: 41 dan Q.S. Al-A'raf/7: 56 tentang larangan merusak lingkungan.",
      "Menjelaskan konsep manusia sebagai Khalifah fil-Ardh yang bertugas memakmurkan dan menjaga ekosistem bumi.",
      "Mengidentifikasi faktor penyebab dan dampak kerusakan alam akibat ulah tangan manusia.",
      "Menjelaskan hadis Nabi SAW tentang keutamaan menanam pohon (shadaqah jariyah ekologis) dan hemat air.",
      "Mempraktikkan budaya ramah lingkungan: Gerakan 3R (Reduce, Reuse, Recycle), konservasi air wudhu, dan pilah sampah di sekolah."
    ],
    materiPokok: [
      "Kajian Q.S. Ar-Rum: 41 tentang tampak rusaknya daratan dan lautan akibat keserakahan manusia.",
      "Kajian Q.S. Al-A'raf: 56 tentang larangan berbuat kerusakan di bumi setelah Allah memperbaikinya.",
      "Hadis riwayat Ahmad dan Bukhari tentang menanam pohon sebagai amalan sedekah yang pahalanya terus mengalir.",
      "Prinsip Ekoteologi Islam: Hifzhul Bi'ah (menjaga lingkungan), larangan tabzir (boros), dan larangan israf.",
      "Aksi mitigasi krisis iklim: Gerakan hemat energi, reboisasi, pengolahan sampah organik dan anorganik."
    ],
    istilahPenting: [
      { kata: "Khalifatullah fil Ardh", arti: "Wakil atau pengelola bumi yang diberi amanah untuk memakmurkan dan melestarikan alam." },
      { kata: "Fasad fil Ardh", arti: "Segala bentuk kerusakan, perusakan lingkungan hidup, polusi, dan eksploitasi alam yang merugikan kehidupan." },
      { kata: "Hifzhul Bi'ah", arti: "Prinsip syariat untuk menjaga, merawat, dan melestarikan lingkungan hidup dan ekosistem alam." },
      { kata: "Tabzir & Israf", arti: "Perilaku boros, menghambur-hamburkan sumber daya air, makanan, dan energi secara sia-sia." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Ar-Rum",
        ayat: "41",
        teksArab: "ظَهَرَ ٱلْفَسَادُ فِى ٱلْبَرِّ وَٱلْبَحْرِ بِمَا كَسَبَتْ أَيْدِى ٱلنَّاسِ لِيُذِيقَهُم بَعْضَ ٱلَّذِى عَمِلُوا۟ لَعَلَّهُمْ يَرْجِعُونَ",
        latin: "Ẓaharal-fasādu fil-barri wal-baḥri bimā kasabat aidin-nāsi liyużīqahum ba'ḍallażī 'amilū la'allahum yarji'ūn.",
        arti: "Telah tampak kerusakan di darat dan di laut disebabkan karena perbuatan tangan manusia; Allah menghendaki agar mereka merasakan sebagian dari (akibat) perbuatan mereka, agar mereka kembali (ke jalan yang benar)."
      },
      {
        surah: "Q.S. Al-A'raf",
        ayat: "56",
        teksArab: "وَلَا تُفْسِدُوا۟ فِى ٱلْأَرْضِ بَعْدَ إِصْلَـٰحِهَا وَٱدْعُوهُ خَوْفًۭا وَطَمَعًا ۚ إِنَّ رَحْمَتَ ٱللَّهِ قَرِيبٌۭ مِّنَ ٱلْمُحْسِنِينَ",
        latin: "Wa lā tufsidū fil-arḍi ba'da iṣlāḥihā wad'ūhu khaufaw wa ṭama'ā, inna raḥmatallāhi qarībum minal-muḥsinīn.",
        arti: "Dan janganlah kamu berbuat kerusakan di bumi setelah (diciptakan) dengan baik. Berdoalah kepada-Nya dengan rasa takut dan penuh harap. Sesungguhnya rahmat Allah sangat dekat kepada orang-orang yang berbuat kebaikan."
      },
      {
        surah: "Hadits Riwayat Al-Bukhari & Muslim",
        ayat: "Shahih Bukhari No. 2320",
        teksArab: "مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا أَوْ يَزْرَعُ زَرْعًا فَيَأْكُلُ مِنْهُ طَيْرٌ أَوْ إِنْسَانٌ أَوْ بَهِيمَةٌ إِلَّا كَانَ لَهُ بِهِ صَدَقَةٌ",
        latin: "Mā min muslimin yagrisu garsan au yazra'u zar'an faya'kulu minhu ṭairun au insānun au bahīmatun illā kāna lahū bihī ṣadaqah.",
        arti: "Tidaklah seorang muslim menanam pohon atau menabur benih tanaman, lalu tanaman itu dimakan oleh burung, manusia, atau binatang ternak, melainkan hal itu menjadi sedekah baginya."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Krisis lingkungan hidup seperti pemanasan global, banjir, dan kekeringan adalah akibat langsung dari keserakahan manusia yang memutus etika spiritual dari sains. Dalam Islam, menjaga kebersihan dan kelestarian alam adalah bagian mutlak dari cabang keimanan. Merusak alam identik dengan mengkhianati amanah kekhalifahan di bumi.",
      subMateri: [
        {
          judul: "1. Fasad di Darat dan Laut: Analisis Ekologis Q.S. Ar-Rum: 41",
          konten:
            "Ayat ini secara gamblang menghubungkan antara musibah ekologis (banjir bandang, polusi udara, pencemaran mikroplastik di lautan) dengan 'kasabat aidin-nas' (perilaku destruktif manusia). Allah menurunkan dampak buruk tersebut bukan untuk membinasakan, melainkan sebagai peringatan agar manusia sadar dan bertaubat memperbaiki tata kelola lingkungannya.",
          poinPenting: [
            "Kerusakan ekosistem diakibatkan oleh tangan dan nafsu serakah manusia.",
            "Musibah lingkungan merupakan sarana teguran agar manusia kembali ramah pada alam.",
            "Eksploitasi sumber daya alam harus memperhatikan daya dukung bumi dan generasi masa depan."
          ]
        },
        {
          judul: "2. Prinsip Ekoteologi: Larangan Merusak Setelah Diperbaiki (Q.S. Al-A'raf: 56)",
          konten:
            "Bumi diciptakan Allah dalam keadaan seimbang (mizan). Merusak hutan bakau, membuang limbah beracun ke sungai, dan membakar hutan adalah bentuk 'fasad fil-ardh ba'da ishlahiha'. Rasulullah SAW melarang kencing di air yang menggenang, melarang menebang pohon sembarangan bahkan saat situasi perang, serta mencontohkan hemat air saat berwudhu.",
          poinPenting: [
            "Menjaga keseimbangan ekosistem ciptaan Allah adalah kewajiban ibadah.",
            "Larangan membuang sampah sembarangan dan mencemari sumber air bersih.",
            "Etika peperangan dalam Islam pun tetap melindungi pohon, tanaman, dan satwa."
          ]
        },
        {
          judul: "3. Gerakan Aksi Nyata Pelajar Muslim Peduli Lingkungan",
          konten:
            "Pelajar muslim dapat mengamalkan akhlak lingkungan melalui langkah-langkah praktis: membawa botol minum guna ulang (tumbler), memilah sampah organik untuk kompos dan anorganik untuk didaur ulang, mematikan lampu ruang kelas saat siang hari, serta merawat tanaman di taman sekolah (Adiwiyata).",
          poinPenting: [
            "Mengurangi sampah plastik sekali pakai dalam kegiatan sehari-hari.",
            "Menanam dan mengadopsi pohon di pekarangan rumah dan lingkungan madrasah/sekolah.",
            "Menerapkan prinsip wudhu hemat air (mengalirkan air secukupnya tanpa mubazir)."
          ]
        }
      ],
      aktivitasSiswa: [
        "Aksi Audit Sampah Sekolah: Menimbang dan memilah sampah plastik di kantin sekolah bersama tim OSIS.",
        "Proyek Sedekah Pohon: Menanam bibit pohon pelindung atau tanaman obat keluarga (TOGA) di sekolah.",
        "Desain Poster Digital: Membuat infografis kreatif kampanye 'Wudhu Hemat Air: Ikuti Sunnah Rasulullah SAW'."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Bergotong Royong & Berakhlak kepada Alam): Memiliki rasa empati ekologis, peduli kebersihan sanitasi, cinta makhluk ciptaan Allah, dan aktif memelihara bumi pertiwi."
    }
  },

  {
    babNomor: 4,
    semester: 1,
    judulBab: "Menerapkan Ketentuan Penyembelihan Hewan, serta Kurban dan Akikah",
    kategori: "Fiqih",
    elemenCP: "Fiqih",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan mempraktikkan tata cara penyembelihan hewan sesuai syariat Islam yang mengedepankan prinsip ihsan (kesejahteraan hewan), menganalisis ketentuan ibadah kurban dan akikah, serta merefleksikan nilai kepedulian sosial, keikhlasan berkorban, dan rasa syukur kepada Allah SWT.",
    ringkasan:
      "Mengonsumsi makanan halal dan thayyib mensyaratkan proses penyembelihan hewan darat secara syar'i dengan memutus saluran napas (hulqum), kerongkongan (mari'), dan dua urat leher (wadajain) menggunakan pisau sangat tajam. Bab ini mengkaji rukun dan adab menyembelih, ketentuan ibadah Kurban (Udhiyah) pada bulan Dzulhijjah, serta ibadah Akikah sebagai wujud syukur atas kelahiran anak.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian, rukun, syarat penyembelih, hewan sembelihan, dan alat sembelih menurut fikih Islam.",
      "Menerapkan adab dan prinsip ihsan dalam menyembelih hewan (menajamkan pisau, tidak memperlihatkan pisau di hadapan hewan).",
      "Menjelaskan ketentuan ibadah kurban: Hukum, waktu pelaksanaan (10-13 Dzulhijjah), syarat hewan (musinnah/cukup umur), dan pembagian dagingnya.",
      "Menjelaskan ketentuan akikah: Waktu afdhal (hari ke-7), kadar hewan (2 ekor kambing untuk laki-laki, 1 ekor untuk wanita), dan sunnah pengolahannya.",
      "Menganalisis perbedaan mendasar antara ibadah kurban dan akikah serta hikmah sosial kemasyarakatannya."
    ],
    materiPokok: [
      "Ketentuan umum penyembelihan hewan: Syarat penyembelih (muslim/baligh/berakal), alat (tajam/bukan kuku-gigi), dan membaca basmalah.",
      "Adab menyembelih berbasis prinsip ihsan dan animal welfare dalam sunnah Rasulullah SAW.",
      "Ibadah Kurban (Udhiyah): Dalil Q.S. Al-Kautsar: 1-2, sejarah pengorbanan Nabi Ibrahim dan Ismail as, hewan kurban (unta, sapi/kerbau, kambing/domba).",
      "Ibadah Akikah: Dalil hadis samurah, mencukur rambut bayi, memberi nama baik, dan hikmah menebus gadaian kelahiran bayi.",
      "Distribusi daging kurban dan akikah: Memberdayakan kaum dhuafa, menumbuhkan solidaritas antartangga."
    ],
    istilahPenting: [
      { kata: "Hulqum & Mari'", arti: "Saluran pernapasan (hulqum) dan saluran makanan/tenggorokan (mari') yang wajib terputus saat penyembelihan." },
      { kata: "Wadajain", arti: "Dua urat nadi dan pembuluh darah leher hewan yang mempercepat kematian tanpa rasa sakit berlebih." },
      { kata: "Udhiyah (Kurban)", arti: "Penyembelihan hewan ternak pada Hari Raya Idul Adha dan hari Tasyrik untuk mendekatkan diri kepada Allah SWT." },
      { kata: "Musinnah", arti: "Kriteria usia minimal hewan ternak kurban (kambing minimal 1 tahun, sapi 2 tahun, unta 5 tahun)." },
      { kata: "Akikah", arti: "Penyembelihan hewan kambing/domba pada hari ketujuh kelahiran anak sebagai ungkapan rasa syukur kepada Allah." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Kautsar",
        ayat: "1-2",
        teksArab: "إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",
        latin: "Innā a'ṭainākal-kauṡar. Faṣalli lirabbika wan-ḥar.",
        arti: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak. Maka laksanakanlah shalat karena Tuhanmu, dan berkurbanlah."
      },
      {
        surah: "Q.S. Al-Hajj",
        ayat: "37",
        teksArab: "لَن يَنَالَ ٱللَّهَ لُحُومُهَا وَلَا دِمَآؤُهَا وَلَـٰكِن يَنَالُهُ ٱلتَّقْوَىٰ مِنكُمْ",
        latin: "Lay yanālallāha luḥūmuhā wa lā dimā'uhā wa lākiy yanāluhut-taqwā minkum.",
        arti: "Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan dari kamulah yang dapat mencapainya."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Shahih Muslim No. 1955",
        teksArab: "إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذَّبْحَ وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ فَلْيُرِحْ ذَبِيحَتَهُ",
        latin: "Innallāha katabal-iḥsāna 'alā kulli syai', fa'iżā qataltum fa'aḥsinul-qitlah, wa iżā żabaḥtum fa'aḥsinuż-żabḥa, walyuḥidda aḥadukum syafratahū falyuriḥ żabīḥatah.",
        arti: "Sesungguhnya Allah mewajibkan berbuat baik (ihsan) atas segala sesuatu. Jika kalian membunuh maka bunuhlah dengan baik, dan jika kalian menyembelih maka sembelihlah dengan baik; hendaklah salah seorang di antara kalian menajamkan pisaunya dan memberi kenyamanan pada hewan sembelihannya."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Islam adalah syariat yang penuh kasih sayang (rahmatan lil-'alamin), bahkan saat memperlakukan hewan ternak. Penyembelihan bukan sekadar ritual mematikan hewan, melainkan pengagungan nama Allah dan kepatuhan syar'i agar darah kotor terbuang tuntas sehingga daging higienis dan halal dikonsumsi.",
      subMateri: [
        {
          judul: "1. Kaidah Fikih Penyembelihan Hewan dan Prinsip Kesejahteraan Satwa",
          konten:
            "Hewan yang disembelih harus halal, masih hidup (hayat mustaqirrah), dan disembelih pada pangkal leher dengan membaca 'Bismillahi Allahu Akbar'. Nabi SAW melarang menyembelih dengan pisau tumpul, melarang mengasah pisau di depan mata hewan, dan melarang menguliti atau memotong anggota tubuh sebelum hewan benar-benar mati sempurna.",
          poinPenting: [
            "Syarat alat: Sangat tajam, terbuat dari besi/baja/batu keras, bukan dari kuku, tulang, atau gigi.",
            "Tiga saluran wajib terputus: Hulqum (napas), Mari' (makanan), dan Wadajain (dua urat leher).",
            "Menerapkan prinsip ihsan: Merebahkan hewan ke sisi kiri menghadap kiblat dengan perlakuan lemah lembut."
          ]
        },
        {
          judul: "2. Ibadah Kurban (Udhiyah): Makna, Syarat, dan Ketentuan",
          konten:
            "Kurban hukumnya sunnah muakkadah bagi muslim yang mampu, dilaksanakan mulai usai shalat Idul Adha tanggal 10 Dzulhijjah hingga matahari terbenam 13 Dzulhijjah (hari Tasyrik). Hewan kurban harus sehat, tidak pincang, tidak buta, tidak kurus kering, dan telah poel (musinnah). Daging kurban dibagikan kepada fakir miskin (wajib), tetangga sekitar, dan boleh dimakan sebagian oleh shohibul qurban.",
          poinPenting: [
            "Kurban mengenang pengorbanan suci Nabi Ibrahim as dan Nabi Ismail as.",
            "Ketentuan kuota: 1 ekor sapi/unta untuk 7 orang, 1 ekor kambing/domba untuk 1 orang.",
            "Mengharamkan menjual kulit dan daging kurban; upah jagal tidak boleh dari bagian kurban."
          ]
        },
        {
          judul: "3. Ibadah Akikah: Tanda Syukur dan Penyambutan Generasi",
          konten:
            "Akikah adalah penyembelihan hewan kambing sebagai tebusan kelahiran anak, sunnah dilaksanakan pada hari ke-7 bersamaan dengan pemotongan rambut bayi dan pemberian nama yang baik. Untuk anak laki-laki dianjurkan 2 ekor kambing dan perempuan 1 ekor kambing. Sunnahnya daging akikah dimasak manis terlebih dahulu sebelum dibagikan kepada tetangga dan sanak kerabat.",
          poinPenting: [
            "Hikmah akikah: Menebus status anak agar memberi syafaat bagi kedua orang tuanya.",
            "Sedekah perak/emas seberat rambut bayi yang dicukur untuk diserahkan kepada fakir miskin.",
            "Mempererat keharmonisan dan ukhuwah masyarakat dalam menyambut kelahiran anggota keluarga baru."
          ]
        }
      ],
      aktivitasSiswa: [
        "Simulasi Praktik Penyembelihan: Memperagakan adab dan posisi menyembelih hewan menggunakan boneka peraga dan pisau kayu tumpul sesuai panduan fikih.",
        "Tabel Komparasi Fikih: Membuat bagan perbedaan mendalam antara Ibadah Kurban vs Akikah (hukum, waktu, jenis hewan, olahan daging).",
        "Kepanitiaan Mini Kurban: Berlatih menyusun proposal distribusi daging kurban yang adil bagi warga prasejahtera di sekitar lingkungan sekolah."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Peduli Sesama & Berakhlak Mulia): Menumbuhkan jiwa dermawan, rela berkorban demi kemaslahatan umat, bersyukur atas nikmat rizki, dan menjunjung tinggi kasih sayang kepada makhluk ciptaan Allah."
    }
  },

  {
    babNomor: 5,
    semester: 1,
    judulBab: "Merefleksikan Sejarah Masuknya Islam di Indonesia",
    kategori: "Sejarah (Tarikh)",
    elemenCP: "Sejarah Peradaban Islam",
    capaianPembelajaran:
      "Peserta didik mampu menelaah dan merefleksikan alur sejarah masuk dan berkembangnya Islam di Nusantara, menganalisis teori-teori masuknya Islam (Teori Makkah, Gujarat, Persia, dan Cina), mengidentifikasi saluran-saluran dakwah yang damai dan akomodatif terhadap kearifan lokal, serta meneladani integritas para saudagar dan ulama perintis dakwah.",
    ringkasan:
      "Berbeda dari penaklukan wilayah di benua lain, Islam masuk ke kepulauan Indonesia secara damai tanpa kontak senjata. Masuknya Islam didorong oleh interaksi jalur maritim perdagangan rempah-rempah internasional, perkawinan silang bangsawan, dakwah tasawuf, pendidikan pesantren tradisional, dan kesenian budaya. Lahir kerajaan-kerajaan maritim seperti Samudera Pasai di Aceh yang menjadi mercusuar peradaban Islam di Asia Tenggara.",
    tujuanPembelajaran: [
      "Menganalisis empat teori masuknya Islam ke Indonesia: Teori Makkah/Arab, Teori Gujarat, Teori Persia, dan Teori Cina beserta bukti-bukti sejarahnya.",
      "Mengidentifikasi 6 saluran penyebaran dakwah Islam di Nusantara: Perdagangan, Perkawinan, Tasawuf, Pendidikan Pesantren, Kesenian, dan Politik.",
      "Mendeskripsikan peran bandar-bandar pelabuhan kuno (Barus, Samudera Pasai, Malaka, Gresik) dalam integrasi dakwah nusantara.",
      "Menjelaskan karakteristik dakwah Islam nusantara yang santun, ramah, dan adaptif terhadap kearifan lokal tanpa mencampuradukkan syariat.",
      "Mengambil ibrah keteladanan para ulama dan saudagar muslim dalam memadukan etos kerja, kejujuran perniagaan, dan dakwah tauhid."
    ],
    materiPokok: [
      "Peta jalur pelayaran dagang maritim Selat Malaka dan kepulauan Nusantara abad ke-7 hingga ke-13 M.",
      "Teori Masuknya Islam: Teori Makkah (Buya Hamka), Teori Gujarat (Snouck Hurgronje), Teori Persia (Hoesein Djajadiningrat), dan Teori Cina (Slamet Muljana).",
      "Saluran Dakwah Islam Damai: Perniagaan syar'i, pernikahan dengan putri adipati lokal, pendekatan mistik tasawuf berakhlak, lembaga pesantren.",
      "Bukti Sejarah Awal: Makam Fatimah binti Maimun di Leran Gresik (1082 M), Batu Nisan Sultan Malik As-Saleh (1297 M), catatan Marco Polo dan Ibnu Battuta.",
      "Integrasi sosial-budaya: Mengubah struktur kasta feodal menuju kesetaraan derajat manusia di hadapan Allah SWT."
    ],
    istilahPenting: [
      { kata: "Teori Makkah", arti: "Teori bahwa Islam masuk langsung dari tanah Arab pada abad ke-7 M (abad ke-1 H) dibawa oleh musafir dan pedagang Arab." },
      { kata: "Teori Gujarat", arti: "Teori bahwa Islam masuk ke Nusantara dari Gujarat dan Malabar India pada abad ke-13 M yang dibawa oleh pedagang Cambay." },
      { kata: "Samudera Pasai", arti: "Kerajaan Islam tertua di kepulauan Nusantara yang terletak di Lhokseumawe Aceh, dipimpin Sultan Malik As-Saleh." },
      { kata: "Akulturasi Damai", arti: "Proses perpaduan nilai-nilai Islam dengan kebudayaan lokal secara harmonis tanpa meniadakan akidah tauhid." },
      { kata: "Barus (Fansur)", arti: "Kota pelabuhan kuno di pesisir barat Sumatera Utara penghasil kapur barus yang tercatat disinggahi pedagang Arab sejak abad ke-7 M." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. An-Nahl",
        ayat: "125",
        teksArab: "ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلْحِكْمَةِ وَٱلْمَوْعِظَةِ ٱلْحَسَنَةِ ۖ وَجَـٰدِلْهُم بِٱلَّتِى هِىَ أَحْسَنُ",
        latin: "Ud'u ilā sabīli rabbika bil-ḥikmati wal-mau'iẓatil-ḥasanati wa jādilhum billatī hiya aḥsan.",
        arti: "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik, dan berdebatlah dengan mereka dengan cara yang baik."
      },
      {
        surah: "Q.S. Al-Anbiya",
        ayat: "107",
        teksArab: "وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةًۭ لِّلْعَـٰلَمِينَ",
        latin: "Wa mā arsalnāka illā raḥmatal lil-'ālamīn.",
        arti: "Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Sejarah penyebaran Islam di Indonesia merupakan salah satu kisah paling menakjubkan dalam peradaban dunia. Tanpa pengerahan kekuatan militer, ratusan pulau dan jutaan masyarakat dengan beraneka ragam bahasa serta tradisi sukarela memeluk agama Islam karena terpikat oleh keluhuran budi pekerti, kejujuran pedagang muslim, dan kesetaraan harkat martabat.",
      subMateri: [
        {
          judul: "1. Empat Teori Masuknya Islam ke Nusantara: Analisis Kritis",
          konten:
            "1) Teori Makkah (didukung Buya Hamka): Menyatakan Islam masuk sejak abad ke-7 M (abad ke-1 H) langsung dari jazirah Arab berdasarkan catatan Dinasti Tang tentang perkampungan Arab di pantai barat Sumatera; 2) Teori Gujarat (Snouck Hurgronje): Berpendapat Islam dibawa pedagang Cambay India pada abad ke-13 M dengan bukti nisan kubur; 3) Teori Persia (Hoesein Djajadiningrat): Menyoroti persamaan tradisi peringatan 10 Muharram (Tabuik) dan ejaan bacaan Al-Qur'an; 4) Teori Cina: Mengaitkan peranan laksamana muslim Cheng Ho dan komunitas Tionghoa muslim di pesisir utara Jawa.",
          poinPenting: [
            "Teori Makkah menjelaskan waktu awal masuknya Islam (abad ke-7 M).",
            "Teori Gujarat dan Persia menjelaskan perkembangan dan pembentukan institusi kesultanan.",
            "Keberagaman teori membuktikan Nusantara merupakan pusat perjumpaan lintas bangsa dunia."
          ]
        },
        {
          judul: "2. Saluran-Saluran Dakwah Islam yang Menyejukkan",
          konten:
            "Ulama dan saudagar muslim menyebarkan Islam melalui pendekatan simpatik: Perdagangan (menjunjung kejujuran takaran dan keramahan), Perkawinan (saudagar muslim menikah dengan keluarga bangsawan pribumi), Pendidikan Pesantren (pesantren tradisional mengajarkan ilmu agama dan kemandirian), Tasawuf (mengajarkan kesucian hati yang mudah diterima masyarakat beraliran kebatinan), dan Seni Budaya (gamelan, wayang, suluk).",
          poinPenting: [
            "Perdagangan maritim menjadi urat nadi perjumpaan sosial ekonomi dan agama.",
            "Pendekatan kultural dan tasawuf membuat Islam diterima hangat tanpa benturan fisik.",
            "Pondok pesantren melahirkan kader ulama lokal yang mempercepat penyebaran Islam ke pelosok pedalaman."
          ]
        },
        {
          judul: "3. Jejak Awal Kesultanan Samudera Pasai dan Makam Kuno",
          konten:
            "Kerajaan Samudera Pasai di bawah Sultan Malik As-Saleh (Meurah Silu) menjadi mercusuar Islam pertama yang menerapkan syariat bermazhab Syafi'i di Nusantara. Ibnu Battuta mencatat Sultan Samudera Pasai sangat gemar berdiskusi dengan para fuqaha dan mencintai rakyatnya. Penemuan nisan Fatimah binti Maimun di Leran Gresik (1082 M) menjadi bukti awal hadirnya komunitas muslim di tanah Jawa.",
          poinPenting: [
            "Samudera Pasai menjadi pusat transit perdagangan dan transmisi keilmuan Islam Asia Tenggara.",
            "Sultan-sultan Islam berperan sebagai pelindung rakyat dan penegak keadilan.",
            "Prinsip egalitarianisme Islam menghapus sekat diskriminasi kasta di masyarakat."
          ]
        }
      ],
      aktivitasSiswa: [
        "Peta Konsep Jalur Sutera Maritim: Menggambar peta interaktif pelayaran dakwah Islam dari Arab/India melewati Selat Malaka menuju pelabuhan Nusantara.",
        "Debat Akademik Sejarah: Mengadakan diskusi kelas mempertahankan argumen Teori Makkah vs Teori Gujarat dengan bukti-bukti arkeologis.",
        "Eksplorasi Tokoh: Menulis biografi singkat tentang Sultan Malik As-Saleh dan perannya meletakkan pondasi peradaban Islam di Nusantara."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Berkebinekaan Global & Bernalar Kritis): Menghargai sejarah perjuangan bangsa, bersikap inklusif, menghormati keragaman budaya, serta mengedepankan dialog damai dalam menyelesaikan persoalan."
    }
  },

  // =========================================================================
  // SEMESTER 2 (BAB 6 - 10)
  // =========================================================================
  {
    babNomor: 6,
    semester: 2,
    judulBab: "Membaca, Menghafal, Menulis, dan Menjelaskan Ayat Al-Qur'an tentang Sabar dalam Menghadapi Musibah dan Ujian (Q.S. Al-Baqarah: 155-156 dan Q.S. Ibrahim: 9) serta Hukum Mad Tabi’i, Mad Wajib Muttasil, dan Mad Jaiz Munfasil",
    kategori: "Al-Qur'an & Tajwid",
    elemenCP: "Al-Qur'an dan Hadis",
    capaianPembelajaran:
      "Peserta didik mampu membaca dengan tartil, menghafal secara mutqin, menulis dengan kaidah khat standar, serta menjelaskan pesan Q.S. Al-Baqarah/2: 155-156 dan Q.S. Ibrahim/14: 9 tentang hakikat sabar dalam menghadapi musibah dan ujian hidup, menerapkan hukum bacaan Mad Tabi'i, Mad Wajib Muttasil, dan Mad Jaiz Munfasil, serta menampilkan sikap tabah, optimis, dan tawakal.",
    ringkasan:
      "Ujian dan musibah adalah keniscayaan hidup bagi manusia untuk menguji kualitas keimanannya (Q.S. Al-Baqarah: 155-156). Bentuk ujian meliputi ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Orang yang sabar senantiasa mengucapkan kalimat istirja' (Inna lillahi wa inna ilaihi raji'un) dan menyadari kepemilikan mutlak hanyalah milik Allah. Bab ini juga menelaah hukum tajwid Mad Tabi'i, Mad Wajib Muttasil, dan Mad Jaiz Munfasil.",
    tujuanPembelajaran: [
      "Membaca Q.S. Al-Baqarah/2: 155-156 dan Q.S. Ibrahim/14: 9 dengan tartil sesuai makhraj dan tajwid.",
      "Menghafal Q.S. Al-Baqarah/2: 155-156 dan Q.S. Ibrahim/14: 9 beserta terjemahannya secara lancar.",
      "Menuliskan kembali ayat-ayat tentang sabar menghadapi ujian dengan kaidah khat dan tanda baca yang benar.",
      "Mengidentifikasi dan mempraktikkan hukum bacaan Mad Tabi'i (Mad Asli), Mad Wajib Muttasil, dan Mad Jaiz Munfasil.",
      "Menjelaskan macam-macam sabar: Sabar dalam ketaatan, sabar menjauhi maksiat, dan sabar menghadapi musibah takdir.",
      "Membiasakan melafalkan kalimat istirja' saat tertimpa musibah dan tidak mengeluh putus asa."
    ],
    materiPokok: [
      "Teks ayat, terjemahan, dan asbabun nuzul Q.S. Al-Baqarah/2: 155-156 tentang ragam ujian hidup dan kabar gembira bagi orang sabar.",
      "Teks ayat dan telaah Q.S. Ibrahim/14: 9 tentang kisah ujian umat terdahulu (Kaum Nuh, 'Ad, Tsamud) dan ketabahan para rasul.",
      "Hukum Tajwid Mad: Mad Tabi'i (2 harakat), Mad Wajib Muttasil (bertemu hamzah 1 kata, 4-5 harakat), Mad Jaiz Munfasil (bertemu hamzah lain kata, 2/4/5 harakat).",
      "Kalimat Istirja' (إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ): Filosofi penyerahan diri dan hakikat kepemilikan Ilahi.",
      "Hadis Nabi SAW tentang pahala kesabaran seorang muslim bahkan hingga saat tertusuk sebutir duri."
    ],
    istilahPenting: [
      { kata: "Basy-syiris-Shabirin", arti: "Dan sampaikanlah kabar gembira keselamatan dan surga kepada orang-orang yang bersabar." },
      { kata: "Kalimat Istirja'", arti: "Ucapan 'Inna lillahi wa inna ilaihi raji'un' (Sesungguhnya kami milik Allah dan kepada-Nya kami kembali)." },
      { kata: "Mad Tabi'i (Mad Asli)", arti: "Huruf mad (Alif, Wawu, Ya') yang tidak bertemu hamzah atau sukun, dibaca panjang 2 harakat (1 alif)." },
      { kata: "Mad Wajib Muttasil", arti: "Mad Tabi'i bertemu huruf hamzah dalam satu kata bersambung, wajib dibaca panjang 4 sampai 5 harakat." },
      { kata: "Mad Jaiz Munfasil", arti: "Mad Tabi'i bertemu huruf hamzah dalam kata terpisah, boleh dibaca 2, 4, atau 5 harakat." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Baqarah",
        ayat: "155-156",
        teksArab: "وَلَنَبْلُوَنَّكُم بِشَىْءٍۢ مِّنَ ٱلْخَوْفِ وَٱلْجُوعِ وَنَقْصٍۢ مِّنَ ٱلْأَمْوَٰلِ وَٱلْأَنفُسِ وَٱلثَّمَرَٰتِ ۗ وَبَشِّرِ ٱلصَّـٰبِرِينَ ۝ ٱلَّذِينَ إِذَآ أَصَـٰبَتْهُم مُّصِيبَةٌۭ قَالُوٓا۟ إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ",
        latin: "Wa lanabluwannakum bisyai'im minal-khaufi wal-jū'i wa naqṣim minal-amwāli wal-anfusi waṡ-ṡamarāt, wa basysyiriṣ-ṣābirīn. Allażīna iżā aṣābathum muṣībatun qālū innā lillāhi wa innā ilaihi rāji'ūn.",
        arti: "Dan pasti Kami uji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (yaitu) orang-orang yang apabila ditimpa musibah, mereka mengucapkan: 'Innā lillāhi wa innā ilaihi rāji'ūn' (Sesungguhnya kami milik Allah dan kepada-Nya lah kami kembali)."
      },
      {
        surah: "Q.S. Ibrahim",
        ayat: "9",
        teksArab: "أَلَمْ يَأْتِكُمْ نَبَؤُا۟ ٱلَّذِينَ مِن قَبْلِكُمْ قَوْمِ نُوحٍۢ وَعَادٍۢ وَثَمُودَ ۛ وَٱلَّذِينَ مِنۢ بَعْدِهِمْ ۛ لَا يَعْلَمُهُمْ إِلَّا ٱللَّهُ",
        latin: "Alam ya'tikum naba'ullażīna min qablikum qaumi Nūḥiw wa 'Ādiw wa Ṡamūd, wallażīna mim ba'dihim, lā ya'lamuhum illallāh.",
        arti: "Apakah belum sampai kepadamu berita orang-orang sebelum kamu (yaitu) kaum Nuh, 'Ad, Tsamud dan orang-orang setelah mereka. Tidak ada yang mengetahui mereka selain Allah..."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Shahih Muslim No. 2999",
        teksArab: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
        latin: "'Ajaban li'amril-mu'mini inna amrahū kullahū khair, wa laisa żāka li'aḥadin illā lil-mu'min, in aṣābathu sarrā'u syakara fakāna khairal lah, wa in aṣābathu ḍarrā'u ṣabara fakāna khairal lah.",
        arti: "Sungguh menakjubkan urusan seorang mukmin! Seluruh urusannya adalah kebaikan baginya, dan hal itu tidak dimiliki siapapun selain mukmin: Jika ia memperoleh kesenangan ia bersyukur maka itu baik baginya, dan jika ia ditimpa kesulitan ia bersabar maka itu pun baik baginya."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Kehidupan di dunia bukanlah surga yang steril dari kepedihan. Setiap insan—bahkan para nabi sekalipun—pasti melewati gelombang ujian. Kematian orang tercinta, kegagalan nilai ujian, sakit penyakit, maupun kekurangan rezeki adalah sarana pembersih dosa dan pengangkat derajat bagi orang yang menyikapi musibah dengan sabar dan husnudzan kepada Allah SWT.",
      subMateri: [
        {
          judul: "1. Hakikat Ujian dan Macam-Macam Sabar (Q.S. Al-Baqarah: 155-156)",
          konten:
            "Allah menguji hamba-Nya dengan lima hal: rasa takut (khauf), kelaparan (ju'), kekurangan harta, kehilangan jiwa (kematian), dan gagal panen/rejeki. Sabar terbagi menjadi tiga martabat: 1) Sabar dalam menjalankan perintah dan ketaatan kepada Allah; 2) Sabar dalam menahan hawa nafsu dari maksiat; 3) Sabar dalam menerima takdir musibah yang menyakitkan tanpa mengeluh dan mencela takdir.",
          poinPenting: [
            "Ujian hidup adalah sarana seleksi kualitas keimanan seorang hamba.",
            "Sabar bukan sikap pasif berdiam diri, melainkan ketahanan jiwa yang aktif mencari solusi.",
            "Kalimat istirja' meredakan kepanikan batin dengan mengembalikan hakikat kepemilikan kepada Allah."
          ]
        },
        {
          judul: "2. Pelajaran dari Kaum Terdahulu (Q.S. Ibrahim: 9)",
          konten:
            "Ayat ini mengajak manusia merenungkan sejarah ketabahan Nabi Nuh as, Nabi Hud as, dan Nabi Shalih as menghadapi penentangan dahsyat kaumnya. Ketabahan para rasul dalam memegang prinsip kebenaran membuktikan bahwa ujian berat selalu berujung pada pertolongan Allah bagi orang-orang yang teguh dan istiqamah.",
          poinPenting: [
            "Ibrah sejarah nabi terdahulu menjadi suntikan energi moral bagi generasi muda.",
            "Kesulitan hidup bersifat sementara, sedangkan pahala kesabaran berbuah surga abadi.",
            "Menghindari keputusasaan (su'udzan) kepada rahmat dan kasih sayang Allah SWT."
          ]
        },
        {
          judul: "3. Kaidah Tajwid: Mad Tabi'i, Mad Wajib Muttasil, dan Mad Jaiz Munfasil",
          konten:
            "Mad berarti memanjangkan suara huruf. 1) Mad Tabi'i: Huruf alif jatuh setelah fathah, wawu sukun setelah dhammah, atau ya sukun setelah kasrah (panjang 2 harakat); 2) Mad Wajib Muttasil: Mad tabi'i bertemu hamzah dalam SATU KATA (wajib 4-5 harakat, contoh: جَآءَ, السَّمَآءِ); 3) Mad Jaiz Munfasil: Mad tabi'i bertemu hamzah di KATA TERPISAH (boleh 2, 4, atau 5 harakat, contoh: إِنَّآ أَعْطَيْنَـٰكَ, قُوٓا۟ أَنفُسَكُمْ).",
          poinPenting: [
            "Mad Tabi'i adalah pondasi seluruh jenis mad far'i lainnya (2 harakat).",
            "Mad Wajib Muttasil berada dalam satu kata bersambung (4-5 harakat).",
            "Mad Jaiz Munfasil berada pada dua kata yang terpisah (2/4/5 harakat)."
          ]
        }
      ],
      aktivitasSiswa: [
        "Tabel Deteksi Mad: Menganalisis potongan ayat Q.S. Al-Baqarah 155-156 dan menandai hukum Mad Tabi'i, Wajib Muttasil, dan Jaiz Munfasil.",
        "Praktik Hafalan Mutqin: Tasmi' hafalan Q.S. Al-Baqarah: 155-156 dengan intonasi tartil di depan kelas.",
        "Kisah Inspiratif: Menuliskan refleksi pengalaman pribadi ketika menghadapi musibah atau kegagalan dan hikmah kesabaran yang dipetik."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Mandiri & Berakhlak Mulia): Bermental tangguh (resilience), tidak cengeng menghadapi tantangan, senantiasa berprasangka baik kepada Allah, dan saling menguatkan sesama teman yang tertimpa kesedihan."
    }
  },

  {
    babNomor: 7,
    semester: 2,
    judulBab: "Meyakini dan Merefleksikan Iman kepada Qada’ dan Qadar Allah Swt.",
    kategori: "Akidah",
    elemenCP: "Akidah",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan merefleksikan makna beriman kepada Qada dan Qadar (takdir Allah SWT) sebagai rukun iman keenam, membedakan takdir mubram dan takdir muallaq, menganalisis korelasi harmonis antara ikhtiar, doa, dan tawakal, serta menolak paham fatalisme maupun kesombongan intelektual.",
    ringkasan:
      "Qada adalah ketetapan dan kehendak Allah SWT sejak zaman azali mengenai segala sesuatu. Qadar adalah realisasi perwujudan takdir tersebut sesuai ukuran, waktu, dan hukum sunnatullah di alam nyata (Q.S. Al-Qamar: 49). Takdir terbagi dua: Takdir Mubram (ketetapan mutlak yang tidak dapat diubah manusia seperti kelahiran, kematian, jenis kelamin) dan Takdir Muallaq (ketetapan bersyarat yang terkait dengan ikhtiar kerja keras dan doa manusia, Q.S. Ar-Ra'd: 11).",
    tujuanPembelajaran: [
      "Menjelaskan pengertian Qada dan Qadar serta dalil naqli kewajiban mengimani takdir Allah SWT.",
      "Membedakan konsep Takdir Mubram (ketetapan pasti) dan Takdir Muallaq (ketetapan berproses ikhtiar).",
      "Menganalisis hubungan seimbang antara ikhtiar lahiriah maksimal, doa khusyuk, dan penyerahan diri (tawakal).",
      "Menolak pemahaman keliru tentang takdir: Paham fatalisme pasrah tanpa usaha (Jabariyah) dan paham sombong menafikan takdir (Qadariyah).",
      "Menampilkan sikap pantang putus asa saat menemui kendala dan rendah hati (tidak takabur) saat meraih kesuksesan."
    ],
    materiPokok: [
      "Hakikat Rukun Iman keenam: Keimanan kepada Qada dan Qadar yang tertulis di Lauhul Mahfuzh.",
      "Karakteristik Takdir Mubram: Ajal kematian manusia, bencana kiamat, peredaran orbit tata surya.",
      "Karakteristik Takdir Muallaq: Prestasi belajar, kesehatan jasmani, keberhasilan karier yang dipengaruhi usaha dan doa.",
      "Segitiga emas kesuksesan seorang mukmin: Ikhtiar (usaha cerdas), Doa (senjata batin), dan Tawakal (lapang dada).",
      "Hikmah beriman pada takdir: Ketenangan jiwa, lenyapnya rasa iri/dengki, dan terhindar dari stres depresi."
    ],
    istilahPenting: [
      { kata: "Qada", arti: "Ketetapan, rencana, dan kehendak Allah SWT sejak zaman azali sebelum alam semesta diciptakan." },
      { kata: "Qadar", arti: "Realisasi atau perwujudan ketetapan Allah yang berlaku pada makhluk sesuai ukuran dan ketentuan waktu-Nya." },
      { kata: "Takdir Mubram", arti: "Ketetapan Allah yang bersifat mutlak dan pasti terjadi tanpa dapat diubah oleh campur tangan manusia." },
      { kata: "Takdir Muallaq", arti: "Ketetapan Allah yang digantungkan dan berkaitan erat dengan ikhtiar sungguh-sungguh serta doa manusia." },
      { kata: "Tawakal", arti: "Menyerahkan segala hasil akhir perjuangan kepada Allah SWT setelah mengerahkan ikhtiar secara maksimal." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Qamar",
        ayat: "49",
        teksArab: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَـٰهُ بِقَدَرٍۢ",
        latin: "Innā kulla syai'in khalaqnāhu biqadar.",
        arti: "Sungguh, Kami menciptakan segala sesuatu menurut ukuran (takdir)."
      },
      {
        surah: "Q.S. Ar-Ra'd",
        ayat: "11",
        teksArab: "إِنَّ ٱللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا۟ مَا بِأَنفُسِهِمْ",
        latin: "Innallāha lā yugayyiru mā biqaumin ḥattā yugayyirū mā bi'anfusihim.",
        arti: "Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Shahih Muslim No. 2653",
        teksArab: "كَتَبَ اللَّهُ مَقَادِيرَ الْخَلَائِقِ قَبْلَ أَنْ يَخْلُقَ السَّمَاوَاتِ وَالْأَرْضَ بِخَمْسِينَ أَلْفَ سَنَةٍ",
        latin: "Kataballāhu maqādīral-khalā'iqi qabla ay yakhluqas-samāwāti wal-arḍa bikhamsīna alfa sanah.",
        arti: "Allah telah menetapkan takdir seluruh makhluk lima puluh ribu tahun sebelum Dia menciptakan langit dan bumi."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Beriman kepada Qada dan Qadar bukanlah pembenaran untuk bermalas-malasan atau menyalahkan takdir atas kegagalan diri. Sebaliknya, iman kepada takdir adalah generator motivasi tertinggi: manusia diperintahkan berikhtiar sekuat tenaga seolah-olah segalanya ditentukan oleh usahanya, lalu bertawakal sebulat hati menyadari bahwa hasil akhir mutlak di tangan Allah SWT.",
      subMateri: [
        {
          judul: "1. Pengertian Qada, Qadar, dan Dalil Penetapan Takdir",
          konten:
            "Qada merupakan cetak biru kehendak Allah sejak azali, sedangkan Qadar adalah eksekusi hukum alam (sunnatullah) di dunia nyata. Beriman kepada takdir mencakup empat pilar: meyakini ilmu Allah yang meliputi segalanya, meyakini penulisan takdir di Lauhul Mahfuzh, meyakini kehendak mutlak (masyi'ah) Allah, dan meyakini bahwa Allah adalah Pencipta segala amal perbuatan hamba.",
          poinPenting: [
            "Seluruh peristiwa alam semesta berjalan menurut rencana dan ukuran Allah yang presisi.",
            "Iman kepada takdir melahirkan ketenteraman batin dan optimisme masa depan.",
            "Manusia tidak mengetahui takdir akhirnya, sehingga wajib terus berikhtiar mencari yang terbaik."
          ]
        },
        {
          judul: "2. Klasifikasi Takdir: Mubram vs Muallaq",
          konten:
            "1) Takdir Mubram: Ketetapan mutlak tanpa pilihan manusia, contohnya kelahiran dari rahim ibu tertentu, tanggal ajal tiba, dan terbitnya matahari dari timur; 2) Takdir Muallaq: Ketetapan yang membuka ruang ikhtiar dan doa manusia, contohnya seorang siswa yang belajar sungguh-sungguh akan memperoleh kepandaian dan prestasi akademik (Q.S. Ar-Ra'd: 11).",
          poinPenting: [
            "Takdir Mubram disikapi dengan kepasrahan rida dan sabar.",
            "Takdir Muallaq disikapi dengan kerja keras, disiplin, optimisme, dan doa terus-menerus.",
            "Doa dan silaturahmi dapat mengubah ketentuan takdir yang muallaq atas izin Allah SWT."
          ]
        },
        {
          judul: "3. Hikmah Mengimani Takdir dalam Kehidupan Remaja",
          konten:
            "Keimanan ini menghindarkan seorang remaja dari dua penyakit mental: 1) Tidak takabur (sombong) ketika meraih juara atau kekayaan, karena menyadari semua adalah anugerah Allah; 2) Tidak putus asa atau depresi ketika mengalami kegagalan, melainkan bangkit kembali melakukan evaluasi dan husnudzan bahwa Allah merencanakan hal yang jauh lebih indah.",
          poinPenting: [
            "Membangun etos kerja pantang menyerah dan daya juang tinggi.",
            "Menghilangkan rasa dengki atas nikmat yang diperoleh orang lain.",
            "Membentengi kesehatan mental dari kecemasan berlebihan menghadapi masa depan."
          ]
        }
      ],
      aktivitasSiswa: [
        "Analisis Studi Kasus: Menelaah fenomena remaja yang menyalahkan takdir atas kegagalan ujian dan mendiskusikan koreksi sikap yang tepat.",
        "Peta Ikhtiar Cita-Cita: Menyusun target pendidikan masa depan lengkap dengan rencana ikhtiar, jadwal doa, dan komitmen tawakal.",
        "Kuis Pemahaman: Mengelompokkan 10 peristiwa nyata ke dalam kategori Takdir Mubram atau Takdir Muallaq."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Mandiri & Bernalar Kritis): Memiliki etos kerja keras, tabah menerima kenyataan hidup, tidak sombong atas prestasi yang diraih, dan senantiasa bersandar kepada pertolongan Allah SWT."
    }
  },

  {
    babNomor: 8,
    semester: 2,
    judulBab: "Menerapkan Makna Cinta Diri Sendiri dan Sesama dalam Kehidupan Sehari-hari",
    kategori: "Akhlak",
    elemenCP: "Akhlak",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan menerapkan nilai-nilai akhlak mulia dalam menyayangi diri sendiri (self-love islami) dan mencintai sesama manusia (ukhuwah insaniyyah & islamiyyah), menjauhi perilaku destruktif (perundungan/bullying, narkoba, judi online), serta membiasakan empati, tolong-menolong, dan menebarkan kedamaian sosial.",
    ringkasan:
      "Mencintai diri sendiri dalam Islam berarti memelihara fitrah raga dan rohani dari kebinasaan (Q.S. Al-Baqarah: 195) dengan menjaga kesehatan mental, kebersihan jasmani, dan menjauhi maksiat. Cinta diri yang sehat akan melahirkan kemampuan tulus untuk mencintai sesama insan. Rasulullah SAW menegaskan bahwa kesempurnaan iman seseorang diukur dari sejauh mana ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    tujuanPembelajaran: [
      "Menjelaskan hakikat mencintai diri sendiri (self-respect/self-care) dalam bingkai syariat Islam.",
      "Menjelaskan hadis Nabi SAW tentang keharusan mencintai saudara sesama muslim sebagaimana mencintai diri sendiri.",
      "Mengidentifikasi bentuk-bentuk merawat diri: Menjaga kehormatan, pola hidup sehat, menjauhi narkoba, miras, pergaulan bebas, dan kecanduan gawai.",
      "Menganalisis bahaya perilaku perundungan (bullying), ghibah, fitnah, dan ujaran kebencian di media sosial.",
      "Mempraktikkan budaya empati, tolong-menolong (ta'awun), menebarkan salam, dan memaafkan kesalahan orang lain."
    ],
    materiPokok: [
      "Konsep Hifzhun Nafs (menjaga jiwa/diri) sebagai salah satu maqashid syariah pokok dalam Islam.",
      "Kajian Q.S. Al-Baqarah: 195 tentang larangan menjatuhkan diri sendiri ke dalam jurang kebinasaan.",
      "Hadis riwayat Al-Bukhari dan Muslim tentang mencintai saudara laksana mencintai diri sendiri.",
      "Cinta sesama: Menolak perundungan (stop bullying), persaudaraan tanpa membedakan status sosial, dan adab digital.",
      "Aksi empati: Menjenguk teman sakit, membantu korban bencana, dan menjadi pendengar yang baik bagi sahabat."
    ],
    istilahPenting: [
      { kata: "Hifzhun Nafs", arti: "Prinsip perlindungan keselamatan jiwa, kesehatan raga, dan stabilitas mental dalam syariat Islam." },
      { kata: "Self-Love Islami", arti: "Menghargai diri sebagai amanah ciptaan Allah dengan merawatnya secara halal dan menjauhkannya dari dosa." },
      { kata: "Ukhuwah Islamiyyah", arti: "Persaudaraan yang diikat oleh kesamaan akidah dan keimanan kepada Allah dan Rasul-Nya." },
      { kata: "Ta'awun", arti: "Saling tolong-menolong dalam kebajikan dan ketakwaan, serta tidak tolong-menolong dalam dosa dan permusuhan." },
      { kata: "Anti-Bullying", arti: "Gerakan menolak segala bentuk kekerasan fisik, verbal, maupun siber terhadap sesama manusia." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Baqarah",
        ayat: "195",
        teksArab: "وَلَا تُلْقُوا۟ بِأَيْدِيكُمْ إِلَى ٱلتَّهْلُكَةِ ۛ وَأَحْسِنُوٓا۟ ۛ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُحْسِنِينَ",
        latin: "Wa lā tulqū bi'aidīkum ilat-tahlukati wa aḥsinū, innallāha yuḥibbul-muḥsinīn.",
        arti: "Dan janganlah kamu menjatuhkan dirimu sendiri ke dalam kebinasaan dengan tanganmu sendiri, dan berbuat baiklah. Sungguh, Allah menyukai orang-orang yang berbuat baik."
      },
      {
        surah: "Q.S. Al-Hujurat",
        ayat: "10",
        teksArab: "إِنَّمَا ٱلْمُؤْمِنُونَ إِخْوَةٌۭ فَأَصْلِحُوا۟ بَيْنَ أَخَوَيْكُمْ ۚ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُرْحَمُونَ",
        latin: "Innamal-mu'minūna ikhwatun fa'aṣliḥū baina akhawaikum wattaqullāha la'allakum turḥamūn.",
        arti: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu (yang berselisih) dan bertakwalah kepada Allah agar kamu mendapat rahmat."
      },
      {
        surah: "Hadits Riwayat Al-Bukhari & Muslim",
        ayat: "Shahih Bukhari No. 13",
        teksArab: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        latin: "Lā yu'minu aḥadukum ḥattā yuḥibba li'akhīhi mā yuḥibbu linafsih.",
        arti: "Tidak sempurna iman salah seorang di antara kalian sampai dia mencintai untuk saudaranya apa yang dia cintai untuk dirinya sendiri."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Banyak remaja mengalami krisis kepercayaan diri (insecure) atau sebaliknya terjebak dalam narsisme dan pergaulan beracun. Islam mengajarkan keseimbangan: cintailah dirimu sebagai mahakarya Allah yang mulia, rawatlah tubuh dan pikiranmu dari racun kemaksiatan, lalu salurkan cinta itu untuk menyinari sesama melalui kehangatan empati dan persaudaraan.",
      subMateri: [
        {
          judul: "1. Hakikat Cinta Diri Sendiri (Self-Respect) Menurut Syariat",
          konten:
            "Tubuh dan jiwa kita adalah titipan Allah yang kelak akan bersaksi di akhirat. Mencintai diri sendiri bukanlah egois, melainkan menjauhi hal-hal yang merusak diri: tidak merokok, menolak miras/narkoba, tidak menyakiti diri sendiri (self-harm), tidur teratur, dan membentengi diri dari paparan pornografi dan judi online yang merusak otak.",
          poinPenting: [
            "Menjaga tubuh dan pikiran adalah wujud syukur kepada Sang Pencipta.",
            "Dilarang melakukan tindakan yang mencelakakan diri sendiri (Q.S. Al-Baqarah: 195).",
            "Membangun rasa percaya diri positif berlandaskan ketakwaan dan prestasi nyata."
          ]
        },
        {
          judul: "2. Nilai Luhur Cinta Sesama dan Ukhuwah (Shahih Bukhari No. 13)",
          konten:
            "Tanda kematangan iman adalah hilangnya kedengkian. Jika kita senang dipuji dan diperlakukan sopan, maka perlakukanlah orang lain dengan penuh kesopanan. Jika kita sakit hati saat diejek, jangan pernah melontarkan ejekan atau hinaan fisik (body shaming) kepada teman sebaya.",
          poinPenting: [
            "Standar perlakuan kepada orang lain adalah bagaimana kita ingin diperlakukan.",
            "Menebarkan salam, senyuman, dan perkataan yang menyejukkan hati.",
            "Menghilangkan penyakit hati seperti hasad (iri dengki) dan dendam kesumat."
          ]
        },
        {
          judul: "3. Gerakan Sekolah Damai: Stop Bullying dan Tebar Empati",
          konten:
            "Perundungan (bullying)—baik berupa kekerasan fisik, verbal memanggil nama buruk, pengucilan sosial, maupun cyberbullying di media sosial—diharamkan secara tegas dalam Islam. Pelajar muslim harus menjadi penengah yang mendamaikan (ishlah) dan pelindung bagi teman yang lemah atau tertindas.",
          poinPenting: [
            "Perundungan melanggar hak asasi kehormatan manusia yang dilindungi syariat.",
            "Berani bersuara membela korban perundungan dan melaporkan kepada guru BK.",
            "Menumbuhkan kebiasaan tolong-menolong (ta'awun) dalam belajar dan kebaikan bersama."
          ]
        }
      ],
      aktivitasSiswa: [
        "Deklarasi Anti-Perundungan: Membuat pohon komitmen kelas 'Sekolahku Rumah Damai: Stop Bullying & Sebarkan Kasih Sayang'.",
        "Kotak Empati Sahabat: Menulis kartu ucapan apresiasi dan dukungan semangat secara anonim untuk teman sekelas.",
        "Role Play Mediasi: Simulasi teknik menyelesaikan perselisihan antarteman dengan adab ishlah dan saling memaafkan."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Berakhlak Mulia & Bergotong Royong): Memiliki kepekaan sosial tinggi, menghargai diri dan sesama insan, menolak segala bentuk kekerasan, dan menjadi teladan kerukunan antarteman."
    }
  },

  {
    babNomor: 9,
    semester: 2,
    judulBab: "Menerapkan Ketentuan Ibadah Wakaf untuk Kesejahteraan Umat",
    kategori: "Fiqih",
    elemenCP: "Fiqih",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan menerapkan ketentuan syariat tentang ibadah wakaf sebagai instrumen filantropi Islam, menganalisis rukun dan syarat wakaf, membedakan wakaf benda tak bergerak dan wakaf uang kontemporer, serta merefleksikan peran strategis wakaf dalam pembangunan sarana pendidikan, kesehatan, dan kemandirian ekonomi umat.",
    ringkasan:
      "Wakaf secara bahasa berarti menahan. Secara istilah syariat, wakaf adalah menahan harta benda yang tahan lama dan menyalurkan manfaat atau hasilnya untuk kepentingan umum yang diridhai Allah SWT (Q.S. Ali 'Imran: 92). Berbeda dari sedekah biasa, pokok harta wakaf tidak boleh dijual, diwariskan, atau dihibahkan. Bab ini mengkaji rukun wakaf, peran Nazhir profesional, regulasi UU Wakaf di Indonesia, serta inovasi wakaf uang bagi generasi muda.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian, landasan hukum Al-Qur'an, dan hadis tentang keutamaan ibadah wakaf.",
      "Mengidentifikasi 4 rukun wakaf: Wakif (pemberi wakaf), Mauquf bih (harta wakaf), Mauquf 'alaih (penerima manfaat), dan Sighat (ikrar wakaf).",
      "Menjelaskan syarat-syarat harta wakaf dan kriteria seorang Nazhir (pengelola wakaf) yang amanah dan profesional.",
      "Membedakan antara Wakaf Benda Tak Bergerak (tanah, gedung sekolah, masjid) dan Wakaf Benda Bergerak (Wakaf Uang / Cash Waqf).",
      "Menganalisis regulasi wakaf di Indonesia berdasarkan UU No. 41 Tahun 2004 dan peran Badan Wakaf Indonesia (BWI).",
      "Menumbuhkan jiwa kedermawanan dan membiasakan diri berwakaf sejak dini melalui program wakaf uang digital."
    ],
    materiPokok: [
      "Konsep Sedekah Jariyah: Hadis riwayat Muslim tentang 3 amalan yang pahalanya tidak terputus setelah kematian.",
      "Kajian Q.S. Ali 'Imran: 92 tentang menyedekahkan harta terbaik yang paling dicintai untuk meraih kebajikan sejati.",
      "Rukun dan Syarat Wakaf: Wakif, Mauquf bih, Mauquf 'alaih, dan Shighat (Lafaz Ikrar Wakaf/AIW).",
      "Kisah Inspiratif Sahabat Nabi: Wakaf sumur Raumah oleh Utsman bin Affan r.a. dan kebun kurma Bairuha oleh Abu Thalhah r.a.",
      "Wakaf Kontemporer: Wakaf produktif, wakaf uang, dan peran wakaf dalam membiayai beasiswa pendidikan dan rumah sakit gratis."
    ],
    istilahPenting: [
      { kata: "Wakaf", arti: "Menahan hak milik atas suatu harta yang tahan lama untuk diserahkan pemanfaatan hasilnya di jalan kebaikan Allah." },
      { kata: "Wakif", arti: "Orang atau badan hukum yang menyerahkan sebagian hartanya untuk diwakafkan secara sukarela." },
      { kata: "Mauquf Bih", arti: "Harta benda yang diwakafkan, harus bernilai, tahan lama, dan tidak habis sekali pakai." },
      { kata: "Mauquf 'Alaih", arti: "Pihak atau peruntukan yang ditunjuk untuk menerima manfaat hasil dari pengelolaan harta wakaf." },
      { kata: "Nazhir", arti: "Pihak yang menerima dan diberi amanah untuk mengelola, mengembangkan, dan memelihara harta benda wakaf." },
      { kata: "Akta Ikrar Wakaf (AIW)", arti: "Dokumen bukti pernyataan kehendak dari Wakif untuk mewakafkan hartanya di hadapan Pejabat Pembuat AIW." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Ali 'Imran",
        ayat: "92",
        teksArab: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍۢ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌۭ",
        latin: "Lan tanālul-birra ḥattā tunfiqū mimmā tuḥibbūn, wa mā tunfiqū min syai'in fa'innallāha bihī 'alīm.",
        arti: "Kamu sekali-kali tidak akan memperoleh kebajikan (yang sempurna), sebelum kamu menginfakkan sebagian harta yang kamu cintai. Dan apa pun yang kamu infakkan, tentang hal itu sungguh, Allah Maha Mengetahui."
      },
      {
        surah: "Hadits Riwayat Muslim",
        ayat: "Shahih Muslim No. 1631",
        teksArab: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
        latin: "Iżā mātal-insānu-nqaṭa'a 'anhu 'amaluhū illā min ṡalāṡah: illā min ṣadaqatin jāriyatin au 'ilmin yuntafa'u bihī au waladin ṣāliḥiy yad'ū lah.",
        arti: "Apabila manusia meninggal dunia, maka terputuslah semua amalnya kecuali tiga perkara: sedekah jariyah (wakaf), ilmu yang bermanfaat, atau anak saleh yang selalu mendoakannya."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Wakaf adalah pilar peradaban Islam yang telah membuktikan kehebatannya sepanjang sejarah. Universitas Al-Azhar di Kairo telah berdiri lebih dari seribu tahun dan menggratiskan jutaan mahasiswa dunia semata-mata didanai dari hasil wakaf produktif. Wakaf bukan hanya milik orang kaya berharta tanah ribuan meter, melainkan dapat dilakukan oleh pelajar melalui gerakan wakaf uang receh.",
      subMateri: [
        {
          judul: "1. Hakikat Wakaf dan Landasan Sedekah Jariyah",
          konten:
            "Harta yang kita makan akan jadi kotoran, pakaian yang kita pakai akan usang lapuk, tetapi harta yang diwakafkan di jalan Allah akan kekal abadi mengalirkan pahala hingga hari kiamat. Syarat mutlak harta wakaf adalah memiliki nilai manfaat berkelanjutan (tidak langsung habis dikonsumsi seperti makanan) dan digunakan untuk kepentingan yang mubah menurut syariat.",
          poinPenting: [
            "Pahala wakaf terus mengalir ke alam kubur meskipun orang yang berwakaf telah wafat.",
            "Harta wakaf dilindungi: Haram diperjualbelikan, diwariskan, digadaikan, atau disita.",
            "Keutamaan menginfakkan harta yang paling bernilai dan dicintai (Q.S. Ali 'Imran: 92)."
          ]
        },
        {
          judul: "2. Rukun, Syarat, dan Peran Penting Nazhir Profesional",
          konten:
            "Empat rukun wakaf harus terpenuhi: 1) Wakif (pemilik sah yang baligh dan berakal); 2) Mauquf bih (benda yang jelas dan bertahan lama); 3) Mauquf 'alaih (penerima manfaat kebajikan); 4) Sighat (ikrar serah terima). Nazhir memegang peranan kunci: jika Nazhir amanah dan inovatif, tanah wakaf tidak terbengkalai melainkan bisa dibangun rumah sakit, ruko produktif, dan perkebunan beromzet tinggi.",
          poinPenting: [
            "Nazhir berhak menerima bagian imbalan operasional maksimal 10% dari hasil bersih pengelolaan.",
            "Pencatatan resmi AIW di KUA menjamin kepastian hukum agar tanah wakaf tidak digugat ahli waris.",
            "Transformasi Nazhir dari sekadar penjaga kubur/masjid menjadi manajer aset produktif."
          ]
        },
        {
          judul: "3. Wakaf Kontemporer: Gerakan Wakaf Uang bagi Generasi Muda",
          konten:
            "Berdasarkan Fatwa MUI dan UU No. 41 Tahun 2004, wakaf uang (cash waqf) sah hukumnya. Nilai pokok uang dihimpun oleh Nazhir berizin (seperti BWI/LKS-PWU) lalu diinvestasikan ke instrumen syariah yang aman (sukuk wakaf/SBSN). Pokok uang tetap utuh dan berkembang, sementara bagi hasilnya disalurkan untuk beasiswa pendidikan anak yatim dan fasilitas kesehatan gratis.",
          poinPenting: [
            "Wakaf uang memungkinkan siapa saja berwakaf mulai dari nominal Rp 10.000.",
            "Mendukung pembangunan fasilitas publik dan membebaskan umat dari jeratan rentenir.",
            "Membangun kemandirian peradaban Islam tanpa bergantung pada utang luar negeri."
          ]
        }
      ],
      aktivitasSiswa: [
        "Simulasi Ikrar Wakaf: Memperagakan prosesi ikrar serah terima wakaf antara Wakif dan Nazhir disaksikan Pejabat KUA dengan dokumen AIW.",
        "Analisis Kasus Wakaf: Meneliti pemanfaatan tanah wakaf di sekitar lingkungan madrasah/tempat tinggal peserta didik.",
        "Proyek Filantropi Remaja: Mengadakan program 'Gerakan Wakaf Buku Perpustakaan' untuk disumbangkan ke panti asuhan atau daerah 3T."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Kreatif & Berjiwa Sosial): Berjiwa dermawan, visioner memikirkan bekal akhirat, peduli fasilitas kemaslahatan umum, dan gemar berbagi harta demi kemajuan umat."
    }
  },

  {
    babNomor: 10,
    semester: 2,
    judulBab: "Merefleksikan terhadap Tradisi dan Seni Budaya Islam Nusantara",
    kategori: "Sejarah (Tarikh)",
    elemenCP: "Sejarah Peradaban Islam",
    capaianPembelajaran:
      "Peserta didik mampu memahami, mengapresiasi, dan merefleksikan nilai-nilai kearifan dalam tradisi, kesenian, dan adat istiadat Islam di berbagai wilayah Nusantara, menganalisis metode dakwah kultural para Wali Songo (akulturasi tanpa kompromi akidah), serta memiliki komitmen melestarikan warisan seni budaya bangsa yang bernafaskan nilai-nilai tauhid.",
    ringkasan:
      "Para ulama dan Wali Songo menyebarkan ajaran Islam di kepulauan Nusantara dengan pendekatan kebudayaan yang sangat arif. Mereka tidak menghancurkan tradisi lokal, melainkan menyerap dan mengisinya dengan ruh tauhid melalui proses akulturasi. Lahir berbagai tradisi luhur seperti Sekaten di Jawa, Halalbihalal, Grebeg Maulud, Kasada muslim, Tari Saman di Aceh, upacara Tabuik di Pariaman, dan musik hadrah rebana.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian dan prinsip akulturasi ajaran Islam dengan tradisi budaya nusantara sesuai kaidah fikih.",
      "Mengidentifikasi ragam tradisi Islam di berbagai daerah: Sekaten (Yogyakarta/Surakarta), Grebeg Maulud, Tradisi Halalbihalal Idul Fitri, Tradisi Meugang di Aceh, dan Dugderan di Semarang.",
      "Menjelaskan filosofi seni arsitektur Islam nusantara: Atap tumpang meru tiga tingkat pada masjid kuno (lambang Iman, Islam, Ihsan), bedug, dan kolam wudhu.",
      "Menganalisis peran karya seni Wali Songo: Wayang kulit Sunan Kalijaga, tembang Ilir-Ilir, dan gamelan Bonang Sunan Bonang dalam dakwah tauhid.",
      "Menumbuhkan rasa bangga terhadap kekayaan budaya bangsa serta mampu memilah tradisi yang sesuai syariat dengan bijak."
    ],
    materiPokok: [
      "Kaidah Fiqih Dakwah Kultural: 'Al-Adatu Muhakkamah' (adat kebiasaan yang baik dan tidak bertentangan dengan Al-Qur'an dan Sunnah dapat menjadi pertimbangan hukum).",
      "Kaidah 'Al-Muhafazhah 'alal-qadimis-shalih wal-akhzu bil-jadidil-ashlah' (melestarikan tradisi lama yang baik dan mengambil hal baru yang lebih maslahat).",
      "Ragam Tradisi Islam Nusantara: Sekaten (berasal dari kata Syahadatain), Tradisi Halalbihalal pemaafan khas Indonesia, Grebeg Maulud, Meugang Aceh, Dugderan Semarang.",
      "Kesenian Islam Nusantara: Tari Saman dan Seudati Aceh, Seni Musik Rebana/Hadrah, Kasidah, Tembang Macapat Islami, Seni Kaligrafi Arab-Melayu (Pegon).",
      "Arsitektur Masjid Tradisional: Masjid Agung Demak, Masjid Menara Kudus (harmonisasi ornamen Hindu-Islam), Masjid Raya Baiturrahman Aceh."
    ],
    istilahPenting: [
      { kata: "Akulturasi Budaya", arti: "Perpaduan dua kebudayaan berbeda yang melahirkan bentuk baru yang harmonis tanpa menghilangkan esensi aslinya." },
      { kata: "Sekaten", arti: "Upacara peringatan Maulid Nabi SAW di Keraton Yogyakarta dan Surakarta yang berasal dari kata Syahadatain." },
      { kata: "Halalbihalal", arti: "Tradisi silaturahmi khas muslim Indonesia pasca Idul Fitri untuk saling memaafkan kekhilafan dan merekatkan persaudaraan." },
      { kata: "Atap Tumpang Meru", arti: "Arsitektur atap masjid tradisional bertingkat ganjil (1, 3, atau 5) yang menyimbolkan tingkatan Iman, Islam, dan Ihsan." },
      { kata: "Aksara Pegon", arti: "Huruf Arab hijaiyah yang dimodifikasi untuk menuliskan kosakata bahasa Jawa, Madura, atau Sunda." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-A'raf",
        ayat: "199",
        teksArab: "خُذِ ٱلْعَفْوَ وَأْمُرْ بِٱلْعُرْفِ وَأَعْرِضْ عَنِ ٱلْجَـٰهِلِينَ",
        latin: "Khużil-'afwa wa'mur bil-'urfi wa a'riḍ 'anil-jāhilīn.",
        arti: "Jadilah pemaaf dan suruhlah orang mengerjakan yang makruf (adat kebiasaan yang baik), serta jangan pedulikan orang-orang yang bodoh."
      },
      {
        surah: "Kaidah Fikih Ushul",
        ayat: "Al-Asybah wan-Nazha'ir",
        teksArab: "الْعَادَةُ مُحَكَّمَةٌ",
        latin: "Al-'ādatu muḥakkamah.",
        arti: "Adat kebiasaan (yang baik dan tidak bertentangan dengan syariat) dapat dijadikan rujukan hukum."
      },
      {
        surah: "Kaidah Ulama Pesantren",
        ayat: "Kaidah Salafus Shalih",
        teksArab: "الْمُحَافَظَةُ عَلَى الْقَدِيمِ الصَّالِحِ وَالأَخْذُ بِالْجَدِيدِ الأَصْلَحِ",
        latin: "Al-muḥāfaẓatu 'alal-qadīmiṣ-ṣāliḥi wal-akhżu bil-jadīdil-aṣlaḥ.",
        arti: "Memelihara tradisi lama yang baik dan mengambil hal baru yang lebih maslahat (baik)."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Islam di Indonesia memiliki corak yang khas: santun, ramah, dan kaya akan estetika budaya. Para ulama perintis dakwah tidak merobohkan kearifan lokal masyarakat, melainkan mengislamkan substansi tradisi tersebut. Kearifan lokal ini menjadi jembatan emas yang memudahkan masyarakat berbondong-bondong memeluk agama tauhid dengan rasa damai.",
      subMateri: [
        {
          judul: "1. Kaidah Syariat dalam Menyikapi Tradisi Lokal ('Urf)",
          konten:
            "Para ulama membagi tradisi menjadi tiga: 1) 'Urf Shahih (tradisi baik yang sejalan dengan syariat, seperti gotong royong dan silaturahmi); 2) 'Urf Fasid (tradisi buruk yang bertentangan dengan tauhid, seperti perjudian dan sesajen syirik); 3) Tradisi netral yang diakulturasi (seperti pagelaran wayang kulit yang jalan ceritanya diganti dari pemujaan dewa menjadi kisah kepahlawanan muslim dan penegakan kalimat syahadat).",
          poinPenting: [
            "Islam menghargai kearifan lokal selama tidak menodai kemurnian tauhid.",
            "Kaidah 'Al-'Adatu Muhakkamah' membuktikan keluwesan dan elastisitas syariat Islam.",
            "Menolak sikap puritan ekstrem yang membid'ahkan seluruh tradisi budaya leluhur."
          ]
        },
        {
          judul: "2. Ragam Tradisi Akbar Islam di Nusantara",
          konten:
            "1) Upacara Sekaten di kraton Mataram (Yogyakarta & Solo): Membunyikan gamelan Kiai Gunturmadu untuk mengajak masyarakat berkumpul di alun-alun lalu mendengarkan khutbah syahadatain; 2) Halalbihalal: Tradisi khas Indonesia yang digagas para pendiri bangsa untuk merekonsiliasi persatuan nasional; 3) Meugang di Aceh: Tradisi memasak daging sapi bersama sehari sebelum Ramadhan dan Idul Fitri untuk disantap bersama kaum yatim dan miskin; 4) Dugderan di Semarang: Pesta rakyat menyambut hilal bulan suci Ramadhan.",
          poinPenting: [
            "Sekaten bermakna syahadatain, menegaskan fungsi seni gamelan sebagai sarana dakwah.",
            "Tradisi Halalbihalal memperkokoh persaudaraan ukhuwah wathaniyyah dan islamiyyah.",
            "Tradisi Meugang dan Dugderan menumbuhkan kegembiraan menyambut syiar ibadah puasa."
          ]
        },
        {
          judul: "3. Seni Arsitektur dan Sastra Islam Nusantara",
          konten:
            "Masjid kuno di Jawa umumnya beratap tumpang tiga tingkat melambangkan rukun agama (Iman, Islam, dan Ihsan) dengan mustaka di puncaknya. Menara Kudus berbentuk candi bata merah membuktikan penghormatan Sunan Kudus kepada umat Hindu masa itu. Di bidang sastra, Sunan Kalijaga menggubah tembang 'Lir-Ilir' yang sarat pesan spiritual untuk bangun beribadah sebelum ajal menjemput.",
          poinPenting: [
            "Arsitektur masjid kuno nusantara merefleksikan harmoni toleransi dan estetika lokal.",
            "Tembang Jawa Islami menjadi media pengajaran akidah dan akhlak yang mengakar di hati rakyat.",
            "Kewajiban generasi muda menjaga, meneliti, dan melestarikan warisan peradaban Islam Nusantara."
          ]
        }
      ],
      aktivitasSiswa: [
        "Pameran Budaya Islam Nusantara: Menyelenggarakan festival kelas menampilkan miniatur rumah adat, tradisi kuliner berkah, dan busana muslim khas daerah Nusantara.",
        "Analisis Makna Lagu Tradisional: Membedah lirik tembang 'Lir-Ilir' ciptaan Sunan Kalijaga dan menuliskan pesan spiritual yang terkandung di dalamnya.",
        "Refleksi Literasi Budaya: Membuat artikel opini bertema 'Menjadi Generasi Z yang Islami, Cinta Budaya Bangsa, dan Anti-Ekstremisme'."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Berkebinekaan Global & Kreatif): Bangga terhadap jati diri budaya Indonesia, menghargai jasa para ulama dan Wali Songo, mampu memilah budaya secara bijaksana, dan menjadi perekat harmoni kebinekaan bangsa."
    }
  }
];

export const BUKU_PAI_KELAS_9_LENGKAP: BukuPelajaranData = {
  id: "buku-smp-9",
  judul: "Pendidikan Agama Islam dan Budi Pekerti SMP Kelas IX",
  kelas: "Kelas IX (Fase D)",
  tingkat: "Kelas IX",
  fase: "Fase D (SMP/MTs)",
  kurikulum: "Kurikulum Merdeka (Kemendikbudristek)",
  regulasiCP: "Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024 (CP Terbaru 2024-2026)",
  penulis: "Iis Suryatini & Hasyim Asy'ari (Penelaah: Pusat Perbukuan Kemendikbudristek)",
  penerbit: "Pusat Perbukuan, BSKAP Kementerian Pendidikan Dasar dan Menengah RI",
  tahunTerbit: "Edisi Revisi Resmi Terbaru 2024/2026",
  deskripsiBuku:
    "Buku teks utama siswa PAI dan Budi Pekerti untuk kelas IX SMP/MTs Fase D Kurikulum Merdeka yang menjabarkan secara lengkap 10 bab pembelajaran: Semangat Keilmuan & Mim Sukun, Iman Hari Akhir, Cinta Lingkungan Hidup, Penyembelihan Hewan Kurban & Akikah, Sejarah Masuknya Islam di Indonesia, Sabar Menghadapi Ujian & Tajwid Mad Tabi'i/Wajib/Jaiz, Iman kepada Qada dan Qadar, Cinta Diri Sendiri & Sesama, Ketentuan Ibadah Wakaf, hingga Apresiasi Tradisi & Seni Budaya Islam Nusantara.",
  babList: BAB_LIST_KELAS_9
};
