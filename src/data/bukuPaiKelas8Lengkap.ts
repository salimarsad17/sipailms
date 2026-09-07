import type { BabPelajaranData, BukuPelajaranData } from "./bukuPaiKemendikbud";

export const BAB_LIST_KELAS_8: BabPelajaranData[] = [
  // =========================================================================
  // SEMESTER 1 (BAB 1 - 5)
  // =========================================================================
  {
    babNomor: 1,
    semester: 1,
    judulBab: "Membaca, Menghafal, Menulis, dan Menjelaskan Ayat Al-Qur'an tentang Toleransi (Q.S. Al-Hujurat: 13 dan Q.S. Al-Baqarah: 256) serta Hadis Terkait",
    kategori: "Al-Qur'an & Tajwid",
    elemenCP: "Al-Qur'an dan Hadis",
    capaianPembelajaran:
      "Peserta didik mampu membaca secara tartil, menghafal fasih, menuliskan ayat dengan kaidah khat standar, serta menjelaskan kandungan Q.S. Al-Hujurat/49: 13 dan Q.S. Al-Baqarah/2: 256 tentang konsep toleransi (tasamuh), keragaman sebagai sunnatullah, tidak adanya paksaan dalam agama, mengaitkannya dengan hadis Nabi SAW, serta mengimplementasikannya dalam kehidupan kebinekaan bangsa.",
    ringkasan:
      "Allah SWT menciptakan manusia bersuku-suku dan berbangsa-bangsa agar saling mengenal (lita'arafu), di mana kemuliaan manusia di sisi Allah diukur semata-mata dari ketakwaannya (Q.S. Al-Hujurat: 13). Islam menegaskan prinsip tidak ada paksaan dalam memilih keyakinan agama (Q.S. Al-Baqarah: 256). Bab ini membahas hakikat tasamuh, batasan toleransi dalam akidah dan muamalah, serta hadis keutamaan agama yang hanif dan toleran.",
    tujuanPembelajaran: [
      "Membaca Q.S. Al-Hujurat/49: 13 dan Q.S. Al-Baqarah/2: 256 dengan tartil dan makhraj yang tepat.",
      "Menghafalkan Q.S. Al-Hujurat/49: 13 dan Q.S. Al-Baqarah/2: 256 beserta terjemahannya secara lancar.",
      "Menuliskan kembali ayat-ayat toleransi dengan kaidah kaligrafi/khat mushaf standar Kemenag RI.",
      "Menganalisis konsep lita'arafu (saling mengenal dan berkolaborasi) dalam keragaman suku, ras, dan agama.",
      "Menjelaskan prinsip 'Laa ikraaha fid-din' (tidak ada paksaan dalam agama) dan batas toleransi islami.",
      "Membiasakan sikap tasamuh, saling menghargai perbedaan, dan menolak diskriminasi di sekolah dan masyarakat."
    ],
    materiPokok: [
      "Teks ayat, terjemah kata per kata, dan asbabun nuzul Q.S. Al-Hujurat/49: 13 tentang kesetaraan umat manusia.",
      "Teks ayat dan tafsir Q.S. Al-Baqarah/2: 256 tentang kebebasan beragama dan prinsip anti-paksaan.",
      "Hadis Nabi Muhammad SAW tentang kemuliaan akhlak yang toleran dan kelapangan dada (al-hanifiyyah as-samhah).",
      "Perbedaan mendasar antara toleransi dalam ranah sosial (muamalah) dan batasan dalam akidah/ibadah.",
      "Praktik adab hidup rukun dan harmoni sosial di tengah masyarakat majemuk Indonesia."
    ],
    istilahPenting: [
      { kata: "Tasamuh", arti: "Sikap saling menghormati, lapang dada, dan menghargai perbedaan keyakinan serta pendapat sesama manusia." },
      { kata: "Lita'arafu", arti: "Agar kalian saling mengenal, memahami kultur, dan bekerja sama dalam kebaikan kebajikan." },
      { kata: "Inna Akramakum", arti: "Sesungguhnya yang paling mulia di antara kalian di sisi Allah adalah orang yang paling bertakwa." },
      { kata: "Laa Ikraaha fid-Din", arti: "Tidak ada paksaan dalam memeluk keyakinan agama Islam karena kebenaran telah jelas dari kesesatan." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Hujurat",
        ayat: "13",
        teksArab: "يَـٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقْنَـٰكُم مِّن ذَكَرٍۢ وَأُنثَىٰ وَجَعَلْنَـٰكُمْ شُعُوبًۭا وَقَبَآئِلَ لِتَعَارَفُوٓا۟ ۚ إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ ۚ إِنَّ ٱللَّهَ عَلِيمٌ خَبِيرٌۭ",
        latin: "Yā ayyuhan-nāsu innā khalaqnākum min żakariw wa unṡā wa ja'alnākum syu'ūbaw wa qabā'ila lita'ārafū, inna akramakum 'indallāhi atqākum, innallāha 'alīmun khabīr.",
        arti: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sesungguhnya yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa. Sungguh, Allah Maha Mengetahui, Mahateliti."
      },
      {
        surah: "Q.S. Al-Baqarah",
        ayat: "256",
        teksArab: "لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ ۚ فَمَن يَكْفُرْ بِٱلطَّـٰغُوتِ وَيُؤْمِنۢ بِٱللَّهِ فَقَدِ ٱسْتَمْسَكَ بِٱلْعُرْوَةِ ٱلْوُثْقَىٰ لَا ٱنفِصَامَ لَهَا ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ",
        latin: "Lā ikrāha fid-dīn, qad tabayyanar-rusydu minal-gayy, famay yakfur biṭ-ṭāgūti wa yu'mim billāhi faqadistamsaka bil-'urwatil-wuṡqā lanfiṣāma lahā, wallāhu samī'un 'alīm.",
        arti: "Tidak ada paksaan dalam (menganut) agama (Islam); sesungguhnya telah jelas perbedaan antara jalan yang benar dengan jalan yang sesat. Barangsiapa ingkar kepada Thaghut dan beriman kepada Allah, maka sungguh, dia telah berpegang (teguh) pada tali yang sangat kuat yang tidak akan putus. Allah Maha Mendengar, Maha Mengetahui."
      },
      {
        surah: "Hadits Riwayat Ahmad & Al-Bukhari",
        ayat: "Musnad Ahmad No. 2003",
        teksArab: "أَحَبُّ الدِّينِ إِلَى اللَّهِ الْحَنِيفِيَّةُ السَّمْحَةُ",
        latin: "Aḥabbud-dīni ilallāhil-ḥanīfiyyatus-samḥah.",
        arti: "Agama yang paling dicintai di sisi Allah adalah agama yang lurus dan penuh toleransi (kelapangan)."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Toleransi bukan berarti mengorbankan keyakinan, melainkan kemampuan hidup berdampingan secara damai di tengah perbedaan fitrah kemanusiaan. Al-Qur'an secara tegas meletakkan fondasi bahwa keberagaman suku, bahasa, dan bangsa merupakan rancangan Ilahi agar manusia saling melengkapi dan bersinergi, bukan saling menindas.",
      subMateri: [
        {
          judul: "1. Makna Keberagaman sebagai Sunnatullah (Q.S. Al-Hujurat: 13)",
          konten:
            "Manusia berasal dari satu keturunan (Adam dan Hawa) yang kemudian berkembang menjadi beraneka suku dan bangsa. Kata 'lita'arafu' mengandung arti aktif saling mempelajari kebaikan budaya lain, berkolaborasi dalam nilai-nilai kebajikan bersama, serta mengikis prasangka primordial. Standar kemuliaan manusia di mata Allah adalah ketaatan dan ketakwaan (atqakum), bukan warna kulit, nasab bangsawan, maupun kekayaan materi.",
          poinPenting: [
            "Keragaman suku, ras, dan bangsa adalah keniscayaan sunnatullah.",
            "Ukuran kemuliaan mutlak seorang hamba adalah derajat ketakwaan.",
            "Menghilangkan rasa superioritas suku atau golongan (anti-chauvinisme)."
          ]
        },
        {
          judul: "2. Prinsip Kebebasan Beragama dan Batasan Toleransi (Q.S. Al-Baqarah: 256)",
          konten:
            "Ayat 'La ikraha fid-din' menegaskan bahwa hidayah dan iman tidak boleh dipaksakan dengan pedang, ancaman, atau intimidasi. Dalam ajaran Islam dikenal dua pilar toleransi: toleransi muamalah (berdagang, bergotong royong, menjaga keamanan lingkungan dengan non-muslim) dan batas toleransi akidah/ibadah (lakum dinukum waliyadin—tidak mencampuradukkan ajaran ritual).",
          poinPenting: [
            "Islam melarang pemaksaan agama kepada siapa pun.",
            "Toleransi muamalah dianjurkan seluas-luasnya demi ketenteraman bersama.",
            "Toleransi akidah mengharuskan masing-masing teguh pada keyakinan agamanya tanpa kompromi syariat."
          ]
        },
        {
          judul: "3. Hadis Nabi SAW dan Praktik Toleransi Piagam Madinah",
          konten:
            "Rasulullah SAW mencontohkan toleransi tertinggi melalui Piagam Madinah (Shahifah al-Madinah), dokumen konstitusi tertulis pertama di dunia yang menyatukan kaum Muslimin, Nasrani, dan Yahudi sebagai satu bangsa (ummah wahidah) dengan hak dan kewajiban pertahanan kota yang setara. Rasulullah juga bersabda bahwa agama yang dicintai Allah adalah yang lurus dan lapang (al-hanifiyyah as-samhah).",
          poinPenting: [
            "Piagam Madinah menjamin perlindungan tempat ibadah dan hak kaum minoritas.",
            "Membela non-muslim mu'ahid (yang terikat perjanjian damai) dari kezaliman.",
            "Mewujudkan moderasi beragama (wasathiyyah) di lingkungan sekolah majemuk."
          ]
        }
      ],
      aktivitasSiswa: [
        "Diskusi Studi Kasus: Menganalisis contoh toleransi pelajar di sekolah dan mengidentifikasi batas antara muamalah sosial vs akidah.",
        "Praktik Menulis Khat Indah: Menuliskan kaligrafi Q.S. Al-Hujurat ayat 13 lengkap dengan harakat dan terjemah.",
        "Proyek Kampanye Damai: Membuat poster kampanye 'Stop Bullying & Hormati Keberagaman Budaya Nusantara'."
      ],
      hikmahKarakter:
        "Profil Pelajar Pancasila (Berkebinekaan Global & Berakhlak Mulia): Terbiasa bersikap terbuka, menghargai martabat sesama insan, menolak diskriminasi, serta menjadi duta perdamaian di era global."
    }
  },

  {
    babNomor: 2,
    semester: 1,
    judulBab: "Meyakini dan Merefleksikan Iman kepada Kitab-Kitab Allah SWT",
    kategori: "Akidah",
    elemenCP: "Akidah",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan merefleksikan makna iman kepada kitab-kitab Allah SWT (Taurat, Zabur, Injil, dan Al-Qur'an) serta suhuf-suhuf para nabi, menganalisis fungsi dan kedudukan Al-Qur'an sebagai kitab pamungkas dan penyempurna (muhaimin), serta membuktikan keimanan melalui kecintaan membaca, mentadaburi, dan mengamalkan isi Al-Qur'an.",
    ringkasan:
      "Beriman kepada kitab Allah merupakan rukun iman ketiga. Allah menurunkan wahyu-Nya sebagai pedoman hidup (hudan lin-nas) agar manusia selamat di dunia dan akhirat. Empat kitab samawi utama adalah Taurat (Nabi Musa as), Zabur (Nabi Daud as), Injil (Nabi Isa as), dan Al-Qur'an (Nabi Muhammad SAW). Al-Qur'an mengoreksi, menguji, sekaligus menyempurnakan syariat kitab terdahulu, dengan jaminan pemeliharaan langsung oleh Allah SWT.",
    tujuanPembelajaran: [
      "Menjelaskan hakikat dan pengertian beriman kepada kitab-kitab Allah SWT beserta dalil naqlinya.",
      "Menyebutkan nama-nama kitab suci Allah, nabi penerimanya, serta bahasa aslinya.",
      "Membedakan antara kitab suci dan suhuf yang diturunkan kepada para rasul.",
      "Menganalisis fungsi dan keistimewaan Al-Qur'an dibanding kitab-kitab samawi sebelumnya.",
      "Menjelaskan perilaku mukmin yang mencerminkan iman kepada Al-Qur'an dalam keseharian.",
      "Membiasakan tilawah, hafalan, dan tadabur ayat-ayat Al-Qur'an secara rutin setiap hari."
    ],
    materiPokok: [
      "Pengertian iman kepada kitab Allah secara ijmali (garis besar) dan tafshili (terperinci).",
      "Mengenal 4 Kitab Suci: Taurat (Ibrani), Zabur (Qibti/Suryani), Injil (Suryani), dan Al-Qur'an (Arab).",
      "Mengenal suhuf yang diberikan kepada Nabi Ibrahim as dan Nabi Musa as.",
      "Keistimewaan dan mukjizat Al-Qur'an: keasliannya terjaga hingga kiamat (Q.S. Al-Hijr: 9) dan menjadi petunjuk universal.",
      "Adab terhadap mushaf Al-Qur'an dan cara mengamalkan hukum-hukumnya dalam keluarga dan masyarakat."
    ],
    istilahPenting: [
      { kata: "Kitab Samawi", arti: "Kitab suci yang wahyunya diturunkan langsung dari langit (Allah SWT) melalui malaikat Jibril kepada para rasul." },
      { kata: "Suhuf", arti: "Lembaran-lembaran wahyu Allah berisikan nasehat dan puji-pujian yang diberikan kepada nabi tertentu seperti Ibrahim dan Musa." },
      { kata: "Muhaimin", arti: "Kedudukan Al-Qur'an sebagai saksi, batu uji, pemelihara, dan penyempurna kitab-kitab suci terdahulu." },
      { kata: "Tadabbur", arti: "Merenungkan secara mendalam makna dan rahasia firman Allah untuk diamalkan dalam perbuatan nyata." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Ma'idah",
        ayat: "48",
        teksArab: "وَأَنزَلْنَآ إِلَيْكَ ٱلْكِتَـٰبَ بِٱلْحَقِّ مُصَدِّقًۭا لِّمَا بَيْنَ يَدَيْهِ مِنَ ٱلْكِتَـٰبِ وَمُهَيْمِنًا عَلَيْهِ",
        latin: "Wa anzalnā ilaikal-kitāba bil-ḥaqqi muṣaddiqal limā baina yadaihi minal-kitābi wa muhaiminan 'alaih.",
        arti: "Dan Kami telah menurunkan Kitab (Al-Qur'an) kepadamu (Muhammad) dengan membawa kebenaran, yang membenarkan kitab-kitab yang diturunkan sebelumnya dan menjaganya (menjadi batu uji atas kitab-kitab tersebut)."
      },
      {
        surah: "Q.S. Al-Hijr",
        ayat: "9",
        teksArab: "إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ",
        latin: "Innā naḥnu nazzalnaż-żikra wa innā lahū laḥāfiẓūn.",
        arti: "Sesungguhnya Kamilah yang menurunkan Al-Qur'an, dan pasti Kami (pula) yang memeliharanya."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Manusia diciptakan dengan akal, namun akal memiliki keterbatasan dalam mengetahui hakikat alam gaib, syariat ibadah, dan tujuan penciptaan hidup. Oleh karena itu, Allah Yang Maha Pengasih menurunkan kitab-kitab suci sebagai pedoman cahaya yang menerangi kegelapan dan membimbing manusia menuju kebahagiaan sejati.",
      subMateri: [
        {
          judul: "1. Empat Kitab Samawi dan Para Nabi Penerimanya",
          konten:
            "Kitab Taurat diturunkan kepada Nabi Musa as pada abad ke-12 SM dalam bahasa Ibrani untuk Bani Israil. Kitab Zabur diturunkan kepada Nabi Daud as pada abad ke-10 SM berisikan mazmur puji-pujian. Kitab Injil diturunkan kepada Nabi Isa as pada abad ke-1 M dalam bahasa Suryani yang mengajarkan zuhud dan kasih sayang. Terakhir, Al-Qur'an diturunkan kepada Nabi Muhammad SAW pada abad ke-7 M dalam bahasa Arab yang fasih untuk seluruh semesta alam.",
          poinPenting: [
            "Taurat kepada Nabi Musa as (fokus hukum syariat Bani Israil).",
            "Zabur kepada Nabi Daud as (fokus doa, zikir, dan hikmah).",
            "Injil kepada Nabi Isa as (fokus akhlak rohani dan pengabaran Nabi penutup).",
            "Al-Qur'an kepada Nabi Muhammad SAW (kitab penyempurna dan universal)."
          ]
        },
        {
          judul: "2. Al-Qur'an sebagai Kitab Pamungkas dan Terjaga",
          konten:
            "Al-Qur'an memiliki mukjizat abadi berupa keindahan sastra yang tak tertandingi, kebenaran ilmiah yang terbukti seiring perkembangan zaman, serta tidak akan pernah mengalami distorsi atau pemalsuan karena dijamin langsung pemeliharaannya oleh Allah (Q.S. Al-Hijr: 9). Al-Qur'an menghapus hukum-hukum kitab sebelumnya yang bersifat lokal temporal dan menetapkan syariat yang relevan hingga kiamat.",
          poinPenting: [
            "Mukjizat balaghah (sastra bahasa Arab) dan mukjizat sains.",
            "Keaslian dijaga jutaan penghafal (huffazh) di seluruh belahan bumi.",
            "Menjadi penyembuh batin (syifa') dan petunjuk praktis kehidupan (hudan)."
          ]
        },
        {
          judul: "3. Bukti Konkret Mengimani Kitab Suci dalam Keseharian",
          konten:
            "Mengimani kitab Allah bukan hanya disimpan di hati atau ditaruh di lemari, melainkan diwujudkan dalam lima jenjang: membaca (tilawah) setiap hari, mempelajari kaidah tajwidnya, memahami dan mentadaburi tafsirnya, mengamalkan perintah dan menjauhi larangannya, serta mendakwahkannya kepada orang lain dengan santun.",
          poinPenting: [
            "Membiasakan program one day one juz / one day several verses.",
            "Menghormati mushaf dengan bersuci saat memegangnya.",
            "Menjadikan Al-Qur'an sebagai rujukan akhlak dan penyelesaian masalah pribadi."
          ]
        }
      ],
      aktivitasSiswa: [
        "Tabel Komparasi Kitab Suci: Menyusun bagan nama kitab, nabi penerima, abad, bahasa, dan garis besar isinya.",
        "Jurnal Tilawah Harian: Mengisi kartu pantau tilawah Al-Qur'an mandiri selama 1 semester.",
        "Refleksi Ayat Sains Al-Qur'an: Menelaah ayat-ayat Al-Qur'an tentang penciptaan alam semesta dan embriologi."
      ],
      hikmahKarakter:
        "Integritas & Cinta Al-Qur'an: Menumbuhkan komitmen moral yang teguh berlandaskan wahyu Ilahi serta menjunjung tinggi objektivitas dan kejujuran."
    }
  },

  {
    babNomor: 3,
    semester: 1,
    judulBab: "Menerapkan Makna Cinta Rasul dalam Kehidupan Sehari-hari",
    kategori: "Akhlak",
    elemenCP: "Akhlak",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan menginternalisasi makna hakiki cinta kepada Rasulullah SAW, meneladani sifat-sifat mulia kenabian (shiddiq, amanah, fathanah, tabligh), memperbanyak selawat, serta membiasakan sunnah-sunnah Rasulullah dalam perilaku sehari-hari sebagai bukti keimanan sejati.",
    ringkasan:
      "Mencintai Nabi Muhammad SAW merupakan konsekuensi logis dari dua kalimat syahadat dan syarat kesempurnaan iman. Bukti cinta rasul bukan sekadar perayaan seremonial, melainkan 'ittiba' (mengikuti jejak langkah dan sunnah beliau), memperbanyak bacaan selawat, mencintai keluarga dan sahabat nabi, serta meneladani akhlak luhur beliau yang penuh kasih sayang, pemaaf, adil, dan berakhlak mulia.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian dan urgensi mencintai Rasulullah SAW berdasarkan dalil Al-Qur'an dan Hadis.",
      "Menyebutkan tanda-tanda dan bukti nyata kecintaan kepada Nabi Muhammad SAW.",
      "Mengidentifikasi 4 sifat wajib Rasul (Shiddiq, Amanah, Tabligh, Fathanah) dan penerapannya bagi remaja.",
      "Menjelaskan keutamaan berselawat kepada Baginda Rasulullah SAW.",
      "Membiasakan sunnah harian Nabi SAW seperti senyum, menjaga kebersihan, makan dengan tangan kanan, dan berzikir.",
      "Menunjukkan sikap santun dan pembelaan terhadap kehormatan ajaran Nabi SAW dengan cara yang bijaksana."
    ],
    materiPokok: [
      "Dalil perintah mencintai Rasulullah melebihi kecintaan kepada diri sendiri, orang tua, dan manusia seluruhnya.",
      "Hakikat 'Ittiba'ur-Rasul (meneladani petunjuk Nabi) sebagai bukti cinta kepada Allah (Q.S. Ali 'Imran: 31).",
      "Keutamaan selawat atas Nabi: berselawat sekali, Allah membalas dengan sepuluh kali rahmat (H.R. Muslim).",
      "Karakteristik kepemimpinan Rasulullah: Uswatun Hasanah dalam diplomasi, pendidikan, dan keluarga.",
      "Praktik adab hidup berlandaskan sunnah nabawiyah dalam era digital modern."
    ],
    istilahPenting: [
      { kata: "Ittiba'", arti: "Mengikuti dan meneladani ucapan, perbuatan, dan ketetapan Rasulullah SAW dengan penuh keikhlasan." },
      { kata: "Uswatun Hasanah", arti: "Teladan yang baik dan sempurna dalam segala aspek kepribadian dan akhlak." },
      { kata: "Shalawat", arti: "Doa permohonan limpahan rahmat dan kemuliaan dari Allah bagi Nabi Muhammad SAW beserta keluarganya." },
      { kata: "Sunnah Taqririyyah", arti: "Persetujuan diam-diam Rasulullah terhadap perkataan atau perbuatan para sahabat." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Ali 'Imran",
        ayat: "31",
        teksArab: "قُلْ إِن كُنتُمْ تُحِبُّونَ ٱللَّهَ فَٱتَّبِعُونِى يُحْبِبْكُمُ ٱللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَٱللَّهُ غَفُورٌۭ رَّحِيمٌۭ",
        latin: "Qul in kuntum tuḥibbūnallāha fattabi'ūnī yuḥbibkumullāhu wa yagfir lakum żunūbakum, wallāhu gafūrur raḥīm.",
        arti: "Katakanlah (Muhammad), 'Jika kamu mencintai Allah, ikutilah aku, niscaya Allah mencintaimu dan mengampuni dosa-dosamu.' Dan Allah Maha Pengampun, Maha Penyayang."
      },
      {
        surah: "Q.S. Al-Ahzab",
        ayat: "21",
        teksArab: "لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌۭ لِّمَن كَانَ يَرْجُوا۟ ٱللَّهَ وَٱلْيَوْمَ ٱلْـَٔاخِرَ وَذَكَرَ ٱللَّهَ كَثِيرًۭا",
        latin: "Laqad kāna lakum fī rasūlillāhi uswatun ḥasanatul liman kāna yarjullāha wal-yaumal-ākhira wa żakarallāha kaṡīrā.",
        arti: "Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari Kiamat dan dia banyak mengingat Allah."
      },
      {
        surah: "Hadits Riwayat Al-Bukhari & Muslim",
        ayat: "Shahih Bukhari No. 15",
        teksArab: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ",
        latin: "Lā yu'minu aḥadukum ḥattā akūna aḥabba ilaihi miw wālidihī wa waladihī wan-nāsi ajma'īn.",
        arti: "Tidaklah sempurna iman salah seorang di antara kalian hingga aku lebih dicintainya daripada orang tuanya, anaknya, dan seluruh umat manusia."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Cinta kepada Rasulullah SAW adalah energi penggerak ketaatan seorang muslim. Rasulullah menghabiskan seluruh hidupnya berkorban dan menangis demi mendoakan keselamatan umatnya hingga akhir zaman. Membalas cinta beliau adalah dengan menjadikan tuntunannya sebagai kompas kehidupan sehari-hari.",
      subMateri: [
        {
          judul: "1. Hakikat dan Kedudukan Cinta Rasul dalam Islam",
          konten:
            "Kecintaan kepada Rasulullah SAW menempati derajat tertinggi setelah cinta kepada Allah SWT. Tanpa perantara bimbingan Nabi Muhammad SAW, manusia tidak akan mengenal Islam, salat, iman, dan surga. Indikator sejati cinta rasul adalah mendahulukan perintah beliau di atas hawa nafsu dan tradisi yang menyimpang.",
          poinPenting: [
            "Cinta Rasul merupakan pilar utama kesempurnaan iman.",
            "Rasa syukur terbesar atas nikmat diutusnya nabi akhir zaman sebagai rahmatal lil 'alamin.",
            "Kerinduan untuk berjumpa dengan Nabi di telaga Al-Kautsar kelak di hari kiamat."
          ]
        },
        {
          judul: "2. Tanda dan Bukti Konkret Mencintai Rasulullah",
          konten:
            "Ulama membagi bukti cinta Rasul ke dalam 4 aspek: (1) Ittiba' sunnah dalam ibadah dan akhlak, (2) Memperbanyak selawat di mana pun berada terutama hari Jumat, (3) Mempelajari sirah nabawiyah (sejarah perjuangan hidup Nabi), (4) Mencintai ahlul bait (keluarga Nabi) dan para sahabat yang setia mendampingi dakwah beliau.",
          poinPenting: [
            "Menjadikan hadis shahih sebagai pedoman etika dan hukum.",
            "Rajin melantunkan selawat Ibrahimiyaah dan selawat nabi lainnya.",
            "Membaca sirah nabawiyah agar mengenal kepribadian beliau secara utuh."
          ]
        },
        {
          judul: "3. Menghidupkan Sunnah Harian bagi Pelajar SMP",
          konten:
            "Remaja muslim dapat menghidupkan sunnah dengan langkah sederhana namun berpahala besar: mendahulukan kaki kanan saat masuk masjid, membaca doa saat makan dan berpakaian, berkata jujur (shiddiq) saat ujian, menjaga amanah tugas sekolah, bersikap ramah, serta memaafkan teman yang bersalah tanpa mendendam.",
          poinPenting: [
            "Meneladani sifat Shiddiq (jujur), Amanah (dapat dipercaya), Tabligh (menyampaikan kebenaran), dan Fathanah (cerdas solutif).",
            "Membiasakan salat sunnah rawatib dan salat dhuha.",
            "Menjauhi ujaran kebencian, caci maki, dan perundungan."
          ]
        }
      ],
      aktivitasSiswa: [
        "Proyek Infografis Sirah: Membuat peta perjalanan hidup Rasulullah SAW dari fase Makkah hingga Madinah.",
        "Program 100 Shalawat Sehari: Mencatat kebiasaan membaca selawat minimal 100 kali setiap hari.",
        "Role-Playing Sifat Wajib Rasul: Memeragakan skenario penyelesaian konflik antarteman dengan sifat Fathanah dan Amanah."
      ],
      hikmahKarakter:
        "Teladan Kasih Sayang & Kesantunan: Menjadikan pribadi nabi sebagai inspirasi utama dalam bertutur kata santun, berjiwa pemaaf, dan memiliki kepedulian sosial yang tinggi."
    }
  },

  {
    babNomor: 4,
    semester: 1,
    judulBab: "Menerapkan Ketentuan Kewajiban terhadap Penyelenggaraan Jenazah",
    kategori: "Fiqih",
    elemenCP: "Fiqih",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan mempraktikkan ketentuan fardhu kifayah dalam penyelenggaraan jenazah muslim yang meliputi: memandikan, mengafani, menyalatkan (shalat jenazah empat takbir), dan menguburkan jenazah sesuai sunnah, serta memahami adab takziah dan ziarah kubur untuk mengingat kematian.",
    ringkasan:
      "Hukum mengurus jenazah muslim adalah Fardhu Kifayah bagi masyarakat setempat. Empat kewajiban pokok tersebut adalah: (1) Memandikan jenazah dengan air suci, sabun, dan kapur barus, (2) Mengafani jenazah dengan kain kafan putih (3 lapis untuk pria, 5 lapis untuk wanita), (3) Menyalatkan jenazah dengan 4 takbir tanpa ruku' dan sujud, dan (4) Menguburkan jenazah menghadap kiblat ke arah lahat. Bab ini juga membekali adab bertakziah dan ziarah kubur yang benar.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian fardhu kifayah dan empat tahapan kewajiban muslim terhadap jenazah.",
      "Mendeskripsikan syarat, tata cara, dan adab memandikan jenazah.",
      "Menjelaskan ukuran dan teknik mengafani jenazah laki-laki dan perempuan.",
      "Mendemonstrasikan tata cara dan bacaan salat jenazah 4 takbir dengan tertib.",
      "Menjelaskan adab dan tata cara menguburkan jenazah di liang lahat sesuai sunnah.",
      "Menjelaskan hikmah takziah, mendoakan keluarga yang ditinggalkan, serta adab ziarah kubur."
    ],
    materiPokok: [
      "Konsep hukum Fardhu Kifayah dan Fardhu 'Ain dalam syariat Islam.",
      "Tata cara memandikan jenazah: yang berhak memandikan, menjaga aurat, dan penggunaan air daun bidara/kapur barus.",
      "Tata cara mengafani: lembaran kain kafan laki-laki (3 lapis) dan wanita (5 lapis: gamis, kerudung, sarung, 2 pembungkus).",
      "Praktik Salat Jenazah: Takbir 1 (Al-Fatihah), Takbir 2 (Shalawat Nabi), Takbir 3 (Doa jenazah), Takbir 4 (Doa keluarga dan salam).",
      "Prosesi pemakaman: posisi liang lahat/syaq, melepas ikatan kafan, menghadapkan pipi kanan ke tanah kiblat, dan talqin/doa kubur.",
      "Adab takziah (maksimal 3 hari, membawa makanan/hiburan) dan ziarah kubur (mengingat akhirat, bukan memohon ke kuburan)."
    ],
    istilahPenting: [
      { kata: "Fardhu Kifayah", arti: "Kewajiban bersama yang apabila telah dikerjakan oleh sebagian muslim, maka gugurlah dosa seluruh penduduk setempat." },
      { kata: "Liang Lahat", arti: "Lubang ceruk di dasar kubur sebelah barat (arah kiblat) tempat meletakkan jenazah." },
      { kata: "Takziah", arti: "Menghibur keluarga duka, menyemangati mereka untuk bersabar, dan mendoakan jenazah agar diampuni dosanya." },
      { kata: "Ziarah Kubur", arti: "Mengunjungi makam untuk mendoakan ahli kubur dan mengambil pelajaran (i'tibar) akan kepastian datangnya maut." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Ali 'Imran",
        ayat: "185",
        teksArab: "كُلُّ نَفْسٍۢ ذَآئِقَةُ ٱلْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ ٱلْقِيَـٰمَةِ",
        latin: "Kullu nafsin żā'iqatul-maūt, wa innamā tuwaffawna ujūrakum yaumal-qiyāmah.",
        arti: "Setiap yang bernyawa akan merasakan mati. Dan hanya pada hari Kiamat sajalah diberikan dengan sempurna balasanmu."
      },
      {
        surah: "Hadits Riwayat Al-Bukhari & Muslim",
        ayat: "Shahih Bukhari No. 1325",
        teksArab: "مَنْ شَهِدَ الْجَنَازَةَ حَتَّى يُصَلَّى عَلَيْهَا فَلَهُ قِيرَاطٌ، وَمَنْ شَهِدَهَا حَتَّى تُدْفَنَ فَلَهُ قِيرَاطَانِ. قِيلَ: وَمَا الْقِيرَاطَانِ؟ قَالَ: مِثْلُ الْجَبَلَيْنِ الْعَظِيمَيْنِ",
        latin: "Man syahidal-janāzata ḥattā yuṣallā 'alaihā falahū qīrāṭ, wa man syahidahā ḥattā tudfana falahū qīrāṭān. Qīla: wa mal-qīrāṭān? Qāla: miṡlul-jabalainil-'aẓīmain.",
        arti: "Barangsiapa menghadiri jenazah hingga disalatkan, baginya pahala satu qirath. Dan barangsiapa menghadirinya hingga dimakamkan, baginya dua qirath. Ditanyakan: 'Apakah dua qirath itu?' Beliau menjawab: 'Seperti dua gunung yang sangat besar.'"
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Kematian adalah gerbang kepastian yang menyapa setiap makhluk. Islam memberikan penghormatan tertinggi kepada jenazah manusia sejak embusan nafas terakhir hingga terbaring di haribaan tanah. Penyelenggaraan jenazah melatih empati sosial, solidaritas kemanusiaan, serta pengingat tajam akan kesementaraan duniawi.",
      subMateri: [
        {
          judul: "1. Memandikan dan Mengafani Jenazah Muslim",
          konten:
            "Jenazah dimandikan di tempat tertutup oleh muhrim atau sesama jenis (kecuali suami/istri). Aurat jenazah tetap ditutup kain basahan. Urutan memandikan: membersihkan kotoran perut, mewudhukan jenazah, lalu membasuh seluruh tubuh dengan air sabun dan bilasan akhir air kapur barus/wewangian. Mengafani disunnahkan memakai kain putih bersih dan wangi, 3 lapis untuk jenazah laki-laki dan 5 lapis untuk jenazah wanita.",
          poinPenting: [
            "Menjaga kerahasiaan aib fisik jenazah yang dimandikan.",
            "Air disiramkan dari anggota wudhu dan sebelah kanan tubuh.",
            "Tali pengikat kafan diletakkan di sisi kiri tubuh agar mudah dilepas saat di kubur."
          ]
        },
        {
          judul: "2. Praktik Tata Cara Salat Jenazah 4 Takbir",
          konten:
            "Salat jenazah dilakukan dengan berdiri (tanpa ruku', sujud, dan iktidal). Takbir 1: membaca surat Al-Fatihah. Takbir 2: membaca shalawat nabi (minimal Allahumma shalli 'ala sayyidina Muhammad). Takbir 3: membaca doa ampunan jenazah (Allahummaghfir lahu/laha...). Takbir 4: membaca doa pencegah fitnah bagi yang ditinggalkan (Allahumma la tahrimna ajrahu/laha...) dan diakhiri dengan salam ke kanan dan ke kiri.",
          poinPenting: [
            "Posisi imam: sejajar kepala jenazah laki-laki, atau sejajar perut/pinggang jenazah wanita.",
            "Minimal terdiri dari 3 shaf makmum bila memungkinkan.",
            "Bisa dilakukan salat ghaib jika jenazah berada di tempat yang jauh."
          ]
        },
        {
          judul: "3. Tata Cara Pemakaman, Takziah, dan Ziarah Kubur",
          konten:
            "Kuburan digali sedalam postur orang dewasa (sekitar 1,5 - 2 meter). Jenazah dimasukkan perlahan dengan membaca 'Bismillahi wa 'ala millati rasulillah', diletakkan miring menghadap kiblat di liang lahat, ikatan tali kepala dan kaki dibuka, pipi ditempelkan tanah, lalu ditutup papan kayu dan ditimbun tanah. Takziah disunnahkan untuk menghibur ahli musibah dengan membawa makanan bagi mereka.",
          poinPenting: [
            "Sunnah membuatkan makanan untuk keluarga yang berduka (hadis Ja'far bin Abi Thalib).",
            "Larangan meratap (niyahah), merobek baju, dan menyiksa diri saat berduka.",
            "Ziarah kubur untuk melembutkan hati dan mendoakan ahli kubur dengan salam islami."
          ]
        }
      ],
      aktivitasSiswa: [
        "Praktik Simulasi Salat Jenazah: Praktik bergiliran menjadi imam dan makmum salat jenazah 4 takbir di musala sekolah.",
        "Praktik Melipat dan Mengikat Kain Kafan: Latihan memotong, menaburi wewangian, dan mengikat kain kafan pada boneka/manekin peraga.",
        "Menghafal Doa Salat Jenazah: Setoran hafalan doa takbir ketiga dan keempat salat jenazah."
      ],
      hikmahKarakter:
        "Kesadaran Spiritual & Empati Kemanusiaan: Mengingat kepastian mati agar tidak sombong, gemar menolong sesama, serta menghibur kawan yang sedang ditimpa musibah duka cita."
    }
  },

  {
    babNomor: 5,
    semester: 1,
    judulBab: "Merefleksikan Diri terhadap Sejarah dan Peran Kekhalifahan Islam Paska Khulafaur Rasyidin: Dinasti Abbasiyah",
    kategori: "Sejarah (Tarikh)",
    elemenCP: "Sejarah Peradaban Islam",
    capaianPembelajaran:
      "Peserta didik mampu menelaah dan merefleksikan sejarah berdirinya Dinasti Abbasiyah di Baghdad (750-1258 M), menganalisis masa keemasan peradaban Islam (The Golden Age of Islam) di bidang sains, filsafat, kedokteran, dan penerjemahan melalui lembaga Baitul Hikmah, serta meneladani semangat literasi dan riset para ilmuwan muslim terkemuka.",
    ringkasan:
      "Dinasti Abbasiyah didirikan oleh Abul Abbas As-Saffah pada tahun 750 M setelah menggulingkan Bani Umayyah. Berpusat di kota metropolitan Baghdad yang dibangun megah oleh Khalifah Abu Ja'far Al-Manshur, Dinasti Abbasiyah mencapai puncak keemasan (Golden Age) pada masa Khalifah Harun Al-Rasyid dan putranya Al-Ma'mun. Lembaga riset Baitul Hikmah menjadi pusat penerjemahan dunia yang melahirkan cendekiawan besar seperti Al-Khawarizmi, Ibnu Sina, Al-Kindi, dan Ar-Razi.",
    tujuanPembelajaran: [
      "Menceritakan latar belakang sejarah berdirinya Dinasti Abbasiyah dan silsilah kekhalifahannya.",
      "Menganalisis kemajuan peradaban Islam pada masa Khalifah Harun Al-Rasyid dan Al-Ma'mun.",
      "Menjelaskan peran monumental Baitul Hikmah sebagai pusat riset, perpustakaan, dan penerjemahan karya dunia.",
      "Mengidentifikasi tokoh-tokoh ilmuwan muslim Abbasiyah di bidang kedokteran, matematika, astronomi, dan tafsir.",
      "Menjelaskan faktor-faktor kemunduran dan runtuhnya Dinasti Abbasiyah akibat serangan bangsa Mongol (1258 M).",
      "Mengambil ibrah dan menumbuhkan semangat gemar membaca, meneliti, dan berinovasi di kalangan pelajar."
    ],
    materiPokok: [
      "Sejarah berdirinya Daulah Abbasiyah: Tokoh pendiri (Abul Abbas As-Saffah & Abu Ja'far Al-Manshur) dan pemindahan ibukota ke Baghdad.",
      "Puncak kejayaan era Harun Al-Rasyid: Pembangunan rumah sakit, universitas, jaringan irigasi, dan diplomasi internasional.",
      "Era Khalifah Al-Ma'mun dan Gerakan Penerjemahan Akbar di Baitul Hikmah.",
      "Galeri Ilmuwan Muslim Abbasiyah: Al-Khawarizmi (Aljabar & Algoritma), Ibnu Sina (Avicenna / Kedokteran), Al-Kindi (Filsafat), Ar-Razi (Cacar & Campak), Imam Bukhari & Muslim (Hadis).",
      "Sebab-sebab kehancuran Dinasti Abbasiyah: Perang saudara, kemerosotan moral pejabat, dan penyerbuan tentara Hulagu Khan 1258 M."
    ],
    istilahPenting: [
      { kata: "Baitul Hikmah", arti: "Perpustakaan akbar, akademi sains, dan biro penerjemahan terbesar di Baghdad pada masa keemasan Abbasiyah." },
      { kata: "The Golden Age", arti: "Zaman keemasan peradaban Islam ketika sains, teknologi, dan kebudayaan Islam memimpin peradaban global." },
      { kata: "Aljabar", arti: "Cabang ilmu matematika yang dirintis oleh Muhammad bin Musa Al-Khawarizmi melalui kitab Al-Jabr wal Muqabalah." },
      { kata: "Hulagu Khan", arti: "Panglima tentara Mongol yang membumihanguskan kota Baghdad dan menghancurkan khazanah buku Baitul Hikmah pada tahun 1258 M." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Mujadilah",
        ayat: "11",
        teksArab: "يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَـٰتٍۢ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌۭ",
        latin: "Yarfa'illāhullażīna āmanū minkum wallażīna ūtul-'ilma darajāt, wallāhu bimā ta'malūna khabīr.",
        arti: "Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat. Dan Allah Mahateliti apa yang kamu kerjakan."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Ketika Eropa berada dalam abad kegelapan (Dark Ages), dunia Islam di bawah naungan Daulah Abbasiyah menyalakan lentera peradaban dunia. Baghdad menjadi kota bundar yang kosmopolitan, dipenuhi sarjana dari berbagai bangsa dan agama yang berkumpul meneliti naskah kuno Yunani, Persia, dan India, lalu mengembangkannya menjadi ilmu pengetahuan modern.",
      subMateri: [
        {
          judul: "1. Berdirinya Dinasti Abbasiyah dan Transformasi Baghdad",
          konten:
            "Didirikan pada tahun 132 H / 750 M oleh keturunan paman Nabi, Abbas bin Abdul Muthalib. Khalifah kedua, Abu Ja'far Al-Manshur, mendirikan Baghdad sebagai 'Madinatus Salam' (Kota Kedamaian). Berbeda dengan Umayyah yang didominasi bangsa Arab, Abbasiyah merangkul kaum Mawali (non-Arab seperti bangsa Persia dan Turki) dalam birokrasi pemerintahan, sehingga tercipta integrasi budaya dan intelektual yang sangat kaya.",
          poinPenting: [
            "Peralihan pusat kekhalifahan dari Damaskus ke Baghdad.",
            "Kesetaraan kaum Mawali dalam pemerintahan dan ilmu pengetahuan.",
            "Perkembangan pesat tata kota, perpustakaan publik, dan perdagangan lintas benua."
          ]
        },
        {
          judul: "2. Baitul Hikmah dan Revolusi Sains Islam",
          konten:
            "Didirikan oleh Khalifah Harun Al-Rasyid dan dikembangkan secara masif oleh Al-Ma'mun. Khalifah menggaji para penerjemah dengan emas seberat buku yang mereka terjemahkan. Dari Baitul Hikmah inilah lahir algoritma, angka nol (zero), alat observatorium astronomi, diagnosis penyakit cacar, bedah optik, hingga penyusunan ensiklopedia ilmu syariat (kitab fiqih 4 madzhab dan kitab hadis Shahih Bukhari-Muslim).",
          poinPenting: [
            "Gerakan penerjemahan karya filsafat Yunani, India, dan Persia ke bahasa Arab.",
            "Harmonisasi antara wahyu Ilahi dan akal riset ilmiah.",
            "Dukungan penuh para khalifah terhadap pendanaan riset sarjana."
          ]
        },
        {
          judul: "3. Hikmah Keruntuhan Baghdad dan Pembelajaran Pelajar",
          konten:
            "Pada tahun 1258 M, pasukan Mongol yang dipimpin Hulagu Khan mengepung dan membumihanguskan Baghdad. Jutaan kitab di Baitul Hikmah dilemparkan ke Sungai Tigris hingga air sungai menghitam oleh tinta. Kehancuran ini disebabkan oleh konflik internal perebutan kekuasaan, perpecahan sekte, serta penguasa yang terlena dalam kemewahan hidup.",
          poinPenting: [
            "Perpecahan internal dan hedonisme adalah bibit kehancuran sebuah peradaban.",
            "Tinta para ulama dan sarjana adalah warisan peradaban yang harus terus dijaga.",
            "Bangkitnya generasi muda Indonesia dengan semangat literasi dan riset teknologi."
          ]
        }
      ],
      aktivitasSiswa: [
        "Pohon Tokoh Sains Abbasiyah: Membuat bagan silsilah penemu muslim (nama ilmuwan, bidang riset, karya monumental, dan kegunaannya bagi dunia saat ini).",
        "Kliping Tokoh Al-Khawarizmi: Menulis esai singkat tentang bagaimana Al-Khawarizmi menemukan aljabar yang menjadi dasar komputer dan coding modern.",
        "Refleksi Literasi: Menghitung durasi membaca buku non-pelajaran dalam sepekan dibandingkan waktu bermain media sosial/game."
      ],
      hikmahKarakter:
        "Berpikir Kritis & Berwawasan Global: Meneladani etos riset sarjana Abbasiyah, gemar membaca, menghargai penemuan ilmiah, serta tidak lekas puas dengan pengetahuan yang dimiliki."
    }
  },

  // =========================================================================
  // SEMESTER 2 (BAB 6 - 10)
  // =========================================================================
  {
    babNomor: 6,
    semester: 2,
    judulBab: "Membaca, Menghafal, Menulis, dan Menjelaskan Ayat Al-Qur'an tentang Cinta Tanah Air (Q.S. An-Nisa: 66) dan Hadis Terkait serta Hukum Bacaan Nun Sukun dan Tanwin",
    kategori: "Al-Qur'an & Tajwid",
    elemenCP: "Al-Qur'an dan Hadis",
    capaianPembelajaran:
      "Peserta didik mampu membaca secara tartil, menghafal fasih, menuliskan ayat secara tepat, serta menjelaskan kandungan Q.S. An-Nisa/4: 66 tentang keterikatan jiwa manusia dengan tanah airnya, menelaah hadis kecintaan Rasulullah terhadap tanah tumpah darah, mempraktikkan hukum bacaan tajwid Nun Sukun dan Tanwin (Izhar, Idgham Bighunnah, Idgham Bilaghunnah, Iqlab, dan Ikhfa'), serta membuktikan sikap nasionalisme dan bela negara.",
    ringkasan:
      "Mencintai tanah air (Hubbul Wathan) adalah tabiat suci kemanusiaan dan sejalan dengan nilai-nilai syariat Islam. Q.S. An-Nisa: 66 menyamakan beratnya ujian meninggalkan tanah air dan kampung halaman dengan ujian mengorbankan jiwa. Rasulullah SAW mencontohkan kecintaan mendalam saat menatap kota Makkah ketika hijrah. Bab ini juga membedah tuntas kaidah tajwid hukum Nun Sukun dan Tanwin yang wajib dipahami oleh setiap pembaca Al-Qur'an.",
    tujuanPembelajaran: [
      "Membaca Q.S. An-Nisa/4: 66 dengan tartil sesuai makhraj dan kaidah tajwid yang benar.",
      "Menghafalkan Q.S. An-Nisa/4: 66 beserta artinya dengan lancar dan tartil.",
      "Menuliskan teks Q.S. An-Nisa: 66 dengan kaidah imla/khat yang rapi.",
      "Mengidentifikasi dan mempraktikkan hukum bacaan Nun Sukun dan Tanwin: Izhar Halqi, Idgham Bighunnah, Idgham Bilaghunnah, Iqlab, dan Ikhfa Haqiqi.",
      "Menganalisis keterkaitan antara keimanan dan kecintaan kepada tanah air (Hubbul Wathan minal Iman).",
      "Menunjukkan sikap bangga, cinta produk dalam negeri, menjaga kerukunan bangsa, dan menjaga keutuhan NKRI."
    ],
    materiPokok: [
      "Kajian ayat, terjemah, dan konteks Q.S. An-Nisa/4: 66 tentang kecintaan fitrah manusia pada tanah kelahirannya.",
      "Hadis riwayat At-Tirmidzi tentang rasa cinta mendalam Nabi Muhammad SAW kepada kota Makkah dan Madinah.",
      "Hukum Tajwid Nun Sukun (نْ) dan Tanwin (ـًـــٍـــٌ):",
      "  - Izhar Halqi (6 huruf: ء هـ ع ح غ خ) - dibaca jelas tanpa dengung.",
      "  - Idgham Bighunnah (4 huruf: ي ن م و) - melebur disertai dengung 2 harakat.",
      "  - Idgham Bilaghunnah (2 huruf: ل ر) - melebur tanpa dengung.",
      "  - Iqlab (1 huruf: ب) - berubah menjadi bunyi mim sukun disertai dengung.",
      "  - Ikhfa Haqiqi (15 huruf: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك) - dibaca samar-samar antara izhar dan idgham.",
      "Manifestasi cinta tanah air bagi pelajar: belajar tekun, menjaga fasilitas publik, mengharumkan nama bangsa, dan merawat persatuan."
    ],
    istilahPenting: [
      { kata: "Hubbul Wathan", arti: "Rasa cinta, bangga, dan loyalitas positif terhadap tanah air tempat tumpah darah dan berteduh." },
      { kata: "Izhar Halqi", arti: "Mengeluarkan huruf dari tenggorokan secara jelas dan tegas tanpa ditahan/dengung." },
      { kata: "Idgham Bighunnah", arti: "Memasukkan bunyi nun sukun/tanwin ke huruf berikutnya disertai suara dengung (ghunnah)." },
      { kata: "Iqlab", arti: "Membalikkan bunyi nun sukun/tanwin menjadi bunyi mim sukun ringan saat bertemu huruf ba (ب)." },
      { kata: "Ikhfa Haqiqi", arti: "Menyamarkan pengucapan nun sukun/tanwin mendekati huruf berikutnya disertai dengung." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. An-Nisa",
        ayat: "66",
        teksArab: "وَلَوْ أَنَّا كَتَبْنَا عَلَيْهِمْ أَنِ ٱقْتُلُوٓا۟ أَنفُسَكُمْ أَوِ ٱخْرُجُوا۟ مِن دِيَـٰرِكُم مَّا فَعَلُوهُ إِلَّا قَلِيلٌۭ مِّنْهُمْ ۖ وَلَوْ أَنَّهُمْ فَعَلُوا۟ مَا يُوعَظُونَ بِهِۦ لَكَانَ خَيْرًۭا لَّهُمْ وَأَشَدَّ تَثْبِيتًۭا",
        latin: "Walaw annā katabnā 'alaihim aniqtulū anfusakum awikhrujū min diyārikum mā fa'alūhu illā qalīlum minhum, walaw annahum fa'alū mā yū'aẓūna bihī lakāna khairal lahum wa asyadda taṡbītā.",
        arti: "Dan sekalipun telah Kami perintahkan kepada mereka, 'Bunuhlah dirimu atau keluarlah kamu dari kampung halamanmu,' niscaya mereka tidak akan melakukannya kecuali sebagian kecil dari mereka. Dan sekiranya mereka benar-benar melakukan apa yang diperintahkan, tentulah itu lebih baik bagi mereka dan lebih menguatkan (iman mereka)."
      },
      {
        surah: "Hadits Riwayat At-Tirmidzi",
        ayat: "Sunan At-Tirmidzi No. 3926",
        teksArab: "مَا أَطْيَبَكِ مِنْ بَلَدٍ وَأَحَبَّكِ إِلَيَّ، وَلَوْلَا أَنَّ قَوْمِي أَخْرَجُونِي مِنْكِ مَا سَكَنْتُ غَيْرَكِ",
        latin: "Mā aṭyabaki mim baladiw wa aḥabbaki ilayya, walawlā anna qaumī akhrajūnī minki mā sakantu gairaki.",
        arti: "Alangkah baiknya engkau wahai negeriku (Makkah) dan alangkah cintanya aku kepadamu. Seandainya kaumku tidak mengusirku darimu, niscaya aku tidak akan bertempat tinggal di selain engkau."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Tanah air adalah anugerah tempat kita sujud beribadah, mencari nafkah, dan menjalin persaudaraan. Membela kemerdekaan, menjaga kedamaian, dan memajukan negeri adalah bagian dari amanah keagamaan. Islam tidak mempertentangkan antara kecintaan pada tanah air dan ketaatan kepada agama.",
      subMateri: [
        {
          judul: "1. Hubbul Wathan dalam Perspektif Al-Qur'an dan Sunnah",
          konten:
            "Q.S. An-Nisa: 66 mengisyaratkan bahwa diusir dari tanah air ('ukhruju min diyārikum') dirasakan manusia sama pedihnya dengan mengorbankan nyawa. Hal ini membuktikan bahwa rasa memiliki negeri adalah fitrah yang tertanam kuat. Rasulullah SAW ketika hijrah ke Madinah selalu mendoakan agar kota Madinah dicintai sebagaimana beliau mencintai kota Makkah, bahkan lebih.",
          poinPenting: [
            "Mencintai tanah kelahiran adalah fitrah luhur manusiawi.",
            "Para ulama dan kiai Nusantara berjuang merebut kemerdekaan berlandaskan fatwa resolusi jihad membela tanah air.",
            "Menjaga kerukunan antarumat sebagai wujud syukur atas nikmat bangsa Indonesia."
          ]
        },
        {
          judul: "2. Pendalaman Kaidah Tajwid: Hukum Nun Sukun dan Tanwin",
          konten:
            "Hukum Nun Sukun dan Tanwin terbagi menjadi 5 ketentuan utama: (1) Izhar Halqi: terbaca jelas tanpa dengung saat bertemu 6 huruf halq (ء هـ ع ح غ خ), (2) Idgham Bighunnah: melebur berdengung 2 harakat saat bertemu huruf (ي ن م و), (3) Idgham Bilaghunnah: melebur tanpa dengung pada huruf (ل ر), (4) Iqlab: bunyi nun berubah menjadi mim samar saat bertemu huruf ba (ب), (5) Ikhfa Haqiqi: menyamarkan bacaan antara izhar dan idgham saat bertemu 15 huruf hijaiyah lainnya.",
          poinPenting: [
            "Ketelitian membedakan idgham bighunnah di satu kata (wajib dibaca izhar muthlaq: dunya, bunyanun).",
            "Menebalkan bunyi dengung ikhfa pada huruf isti'la (shad, dhad, tha, zha, qaf).",
            "Panjang dengung (ghunnah) distandarkan 2 harakat atau satu alif."
          ]
        },
        {
          judul: "3. Perwujudan Cinta Tanah Air bagi Generasi Z dan Remaja",
          konten:
            "Bela negara bagi pelajar masa kini bukan mengangkat senjata, melainkan: (a) Berprestasi di bidang sains, olahraga, dan seni untuk mengibarkan merah putih di kancah dunia, (b) Menjaga kelestarian lingkungan dan budaya lokal, (c) Menangkal hoaks, narasi radikalisme, dan adu domba di media sosial, (d) Menerapkan nilai-nilai Pancasila yang selaras dengan syariat Islam.",
          poinPenting: [
            "Menghargai pahlawan kemerdekaan yang telah berkorban darah dan air mata.",
            "Bijak bersosial media dan menolak perpecahan suku bangsa.",
            "Membeli dan bangga menggunakan produk karya anak bangsa."
          ]
        }
      ],
      aktivitasSiswa: [
        "Tabel Deteksi Tajwid: Mencari 5 contoh hukum nun sukun/tanwin (izhar, idgham, iqlab, ikhfa) dalam surah An-Nisa ayat 66 dan juz 30.",
        "Aktivitas Menghafal Mandiri: Tasmi' hafalan Q.S. An-Nisa: 66 di hadapan guru atau teman sebangku.",
        "Proyek Video Inspiratif: Membuat video pendek 60 detik bertema 'Aku Bangga Jadi Pelajar Muslim Indonesia yang Cinta NKRI'."
      ],
      hikmahKarakter:
        "Nasionalisme & Profil Pelajar Pancasila: Memadukan ketaatan ibadah kepada Allah dengan kecintaan sejati kepada bangsa dan negara, setia pada konsensus kebangsaan."
    }
  },

  {
    babNomor: 7,
    semester: 2,
    judulBab: "Meyakini dan Merefleksikan Iman kepada Rasul-Rasul Allah SWT",
    kategori: "Akidah",
    elemenCP: "Akidah",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan merefleksikan hakikat iman kepada Rasul-rasul Allah SWT, membedakan antara nabi dan rasul, meneladani keteguhan hati para Rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, dan Muhammad SAW), menganalisis sifat wajib, mustahil, dan jaiz bagi rasul, serta meneladani integritas rasul dalam kehidupan modern.",
    ringkasan:
      "Iman kepada rasul adalah rukun iman keempat. Rasul adalah manusia pilihan Allah yang menerima wahyu untuk dirinya dan wajib menyampaikannya kepada umatnya. Kita wajib mengimani 25 nabi dan rasul yang namanya tercantum dalam Al-Qur'an. Lima di antaranya dianugerahi gelar Ulul Azmi karena ketabahan luar biasa menghadapi ujian dakwah. Bab ini menanamkan keteladanan sifat Shiddiq, Amanah, Tabligh, dan Fathanah dalam membentuk karakter pelajar berintegritas.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian dan dalil naqli beriman kepada rasul-rasul Allah SWT.",
      "Membedakan fungsi dan pengertian antara nabi dan rasul.",
      "Menyebutkan 25 nama nabi dan rasul secara urut.",
      "Menjelaskan makna gelar Ulul Azmi serta nama-nama rasul penerimanya (NIMIM: Nuh, Ibrahim, Musa, Isa, Muhammad SAW).",
      "Menguraikan sifat wajib (Shiddiq, Amanah, Tabligh, Fathanah), sifat mustahil (Kizib, Khianat, Kitman, Baladah), dan sifat jaiz rasul.",
      "Menjelaskan fungsi mukjizat bagi pembuktian kebenaran kerasulan.",
      "Meneladani kesabaran, kejujuran, dan kegigihan para rasul dalam kehidupan sehari-hari."
    ],
    materiPokok: [
      "Pengertian Nabi (menerima wahyu tanpa kewajiban mendakwahkan ke umat baru) dan Rasul (menerima syariat dan wajib mendakwahkannya).",
      "Silsilah 25 Nabi dan Rasul dari Nabi Adam as hingga Nabi Muhammad SAW.",
      "Kisah keteguhan 5 Rasul Ulul Azmi menghadapi kezaliman penguasa dan penolakan kaumnya.",
      "Sifat Wajib Rasul: Shiddiq (Jujur), Amanah (Dapat Dipercaya), Tabligh (Menyampaikan), Fathanah (Cerdas Bijaksana).",
      "Sifat Mustahil Rasul: Kizib (Dusta), Khianat (Culas), Kitman (Menyembunyikan), Baladah (Bodoh).",
      "Sifat Jaiz Rasul: Al-A'radhul Basyariyyah (memiliki tabiat manusiawi seperti makan, minum, sakit, berumah tangga tanpa mengurangi derajat keluhurannya).",
      "Mukjizat Kauniyah (fisik) dan Mukjizat Aqliyah (Al-Qur'an)."
    ],
    istilahPenting: [
      { kata: "Ulul Azmi", arti: "Gelar kehormatan bagi rasul yang memiliki ketabahan, kesabaran, dan keteguhan hati luar biasa dalam mengemban risalah dakwah." },
      { kata: "Mukjizat", arti: "Kejadian luar biasa dari Allah yang menyalahi hukum alam yang diberikan kepada rasul untuk membuktikan kebenaran risalahnya." },
      { kata: "Shiddiq", arti: "Sifat selalu benar dan jujur dalam perkataan, perbuatan, dan keyakinan hati." },
      { kata: "A'radhul Basyariyyah", arti: "Sifat kemanusiaan biasa yang ada pada diri rasul seperti tidur, lapar, dan lelah yang tidak mencoreng martabat kenabian." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Al-Ahqaf",
        ayat: "35",
        teksArab: "فَٱصْبِرْ كَمَا صَبَرَ أُو۟لُوا۟ ٱلْعَزْمِ مِنَ ٱلرُّسُلِ وَلَا تَسْتَعْجِل لَّهُمْ",
        latin: "Faṣbir kamā ṣabara ulul-'azmi minar-rusuli wa lā tasta'jil lahum.",
        arti: "Maka bersabarlah engkau (Muhammad) sebagaimana kesabaran rasul-rasul yang memiliki keteguhan hati (Ulul Azmi), dan janganlah engkau meminta agar azab disegerakan untuk mereka."
      },
      {
        surah: "Q.S. Al-An'am",
        ayat: "48",
        teksArab: "وَمَا نُرْسِلُ ٱلْمُرْسَلِينَ إِلَّا مُبَشِّرِينَ وَمُنذِرِينَ ۖ فَمَنْ ءَامَنَ وَأَصْلَحَ فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
        latin: "Wa mā nursilul-mursalīna illā mubasysyirīna wa munżirīn, faman āmana wa aṣlaḥa falā khawfun 'alaihim wa lā hum yaḥzanūn.",
        arti: "Para rasul yang Kami utus itu adalah untuk memberi kabar gembira dan memberi peringatan. Barangsiapa beriman dan mengadakan perbaikan, maka tidak ada rasa takut pada mereka dan mereka tidak bersedih hati."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Rasulullah adalah lentera pembimbing zaman. Tanpa kehadiran para rasul, manusia akan tersesat dalam kebingungan moral dan menyembah berhala. Mengimani para rasul menanamkan optimisme bahwa kebaikan dan kebenaran pada akhirnya akan selalu menang menghadapi kezaliman dan kepalsuan.",
      subMateri: [
        {
          judul: "1. Hakikat Rasul dan Perbedaannya dengan Nabi",
          konten:
            "Nabi adalah laki-laki merdeka yang dipilih Allah menerima wahyu untuk dirinya sendiri. Rasul adalah nabi yang dipilih Allah menerima wahyu berupa syariat baru dan diperintahkan untuk menyampaikannya kepada kaumnya yang belum beriman. Setiap rasul pasti nabi, namun tidak setiap nabi adalah rasul. Jumlah nabi sangat banyak, namun yang wajib kita ketahui namanya berjumlah 25 orang.",
          poinPenting: [
            "Tugas utama rasul: membawa kabar gembira (basyir) dan peringatan (nadzir).",
            "Nabi pertama adalah Nabi Adam as dan rasul penutup adalah Nabi Muhammad SAW (Khatamun Nabiyyin).",
            "Tidak membeda-bedakan keimanan terhadap para rasul Allah."
          ]
        },
        {
          judul: "2. Mengenal Lima Rasul Ulul Azmi dan Mukjizatnya",
          konten:
            "Lima rasul Ulul Azmi disingkat NIMIM: (1) Nabi Nuh as: tabah berdakwah 950 tahun dan membuat bahtera penyelamat banjir bandang, (2) Nabi Ibrahim as: dijuluki Khalilullah, tabah dibakar Raja Namrud dan diperintah menyembelih putranya Ismail, (3) Nabi Musa as: dijuluki Kalimullah, membelah Laut Merah dengan tongkatnya menghadapi Firaun, (4) Nabi Isa as: dijuluki Ruhullah, menghidupkan orang mati dan menyembuhkan penyakit kusta atas izin Allah, (5) Nabi Muhammad SAW: penutup para nabi dengan mukjizat Al-Qur'an dan peristiwa Isra' Mi'raj.",
          poinPenting: [
            "Ketabahan baja dalam menghadapi cemoohan, siksaan, dan ancaman pembunuhan.",
            "Mukjizat bukan sihir, melainkan pertolongan langsung dari Allah SWT.",
            "Keteladanan doa para nabi yang selalu mendoakan kebaikan bagi kaumnya."
          ]
        },
        {
          judul: "3. Sifat-Sifat Rasul sebagai Fondasi Karakter Pelajar",
          konten:
            "Empat sifat wajib rasul wajib diinternalisasi ke dalam jiwa remaja: Shiddiq (tidak mencontek dan berani mengakui kesalahan), Amanah (menjaga barang titipan dan mengerjakan tugas tepat waktu), Tabligh (mengajak teman berbuat baik dan mencegah perundungan), Fathanah (rajin belajar, berwawasan luas, dan mampu memecahkan masalah dengan bijak).",
          poinPenting: [
            "Menjauhi sifat Kizib (kebohongan lisan dan medsos).",
            "Menghindari khianat terhadap kepercayaan orang tua dan guru.",
            "Mengasah kecerdasan intelektual, emosional, dan spiritual secara seimbang."
          ]
        }
      ],
      aktivitasSiswa: [
        "Lagu / Nasyid 25 Nabi: Melantunkan dan menghafal nama-nama 25 nabi dan rasul secara bergantian.",
        "Komik Strip Keteladanan: Menggambar cerita pendek mengenai ketabahan Nabi Nuh as atau Nabi Ibrahim as saat diuji kaumnya.",
        "Kartu Karakter 4 Sifat Rasul: Menuliskan komitmen tindakan nyata di sekolah untuk sifat Shiddiq, Amanah, Tabligh, dan Fathanah."
      ],
      hikmahKarakter:
        "Integritas, Keteguhan & Kepemimpinan: Membangun pribadi yang tahan banting menghadapi cobaan hidup, tidak mudah putus asa, dan memegang teguh kejujuran di mana pun berada."
    }
  },

  {
    babNomor: 8,
    semester: 2,
    judulBab: "Menerapkan Makna Cinta Ilmu dalam Kehidupan Sehari-hari",
    kategori: "Akhlak",
    elemenCP: "Akhlak",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan menerapkan makna cinta ilmu pengetahuan, mengkaji dalil kewajiban menuntut ilmu (thalabul 'ilmi) dari buaian hingga liang lahad, mempraktikkan adab mulia murid terhadap guru, sumber ilmu, dan buku, serta membangun etos belajar mandiri, bernalar kritis, dan gemar berinovasi.",
    ringkasan:
      "Menuntut ilmu adalah kewajiban mutlak bagi setiap muslim (fardhu 'ain untuk ilmu fardhu, dan fardhu kifayah untuk ilmu umum). Allah SWT meninggikan derajat orang-orang yang beriman dan berilmu beberapa derajat (Q.S. Al-Mujadilah: 11). Para malaikat membentangkan sayapnya karena ridha kepada para pencari ilmu. Bab ini membedah adab penuntut ilmu, etika menghormati guru, pentingnya membaca (iqra'), serta bahaya menyombongkan ilmu.",
    tujuanPembelajaran: [
      "Menjelaskan kewajiban dan keutamaan menuntut ilmu dalam pandangan Islam.",
      "Menghafalkan hadis 'Thalabul 'ilmi faridhatun 'ala kulli muslim' beserta maknanya.",
      "Mengidentifikasi adab-adab murid terhadap guru dalam proses pembelajaran.",
      "Menjelaskan syarat-syarat sukses menuntut ilmu menurut nasihat Imam Syafi'i (kecerdasan, tekun, bekal, petunjuk guru, dan waktu yang lama).",
      "Membiasakan budaya literasi membaca buku, riset perpustakaan, dan pemanfaatan internet secara edukatif.",
      "Menunjukkan sikap rendah hati (tawadhu') dan membagikan ilmu yang bermanfaat kepada orang lain."
    ],
    materiPokok: [
      "Perintah pertama dalam Al-Qur'an: Iqra' (membaca, meneliti, menelaah fenomena alam dan teks wahyu).",
      "Kedudukan orang berilmu dalam Islam: diangkat derajatnya oleh Allah dan didoakan seluruh makhluk di laut dan di udara.",
      "Hadis-hadis keutamaan ilmu: pahala sedekah jariyah, doa anak shaleh, dan ilmu yang bermanfaat yang pahalanya terus mengalir setelah mati.",
      "Adab penuntut ilmu: niat ikhlas mencari ridha Allah, menghormati guru, tidak menyela pembicaraan guru, mencatat ilmu (ikatlah ilmu dengan menuliskannya), dan mengamalkannya.",
      "Enam syarat menuntut ilmu dalam syair Diwan Imam Syafi'i: Dzaka' (cerdas), Hirsh (semangat membara), Ijtihad (sungguh-sungguh), Dirham (bekal materi), Shuhbatu Ustadz (bimbingan guru), Thulu Zaman (waktu yang panjang)."
    ],
    istilahPenting: [
      { kata: "Thalabul 'Ilmi", arti: "Aktivitas menuntut, mencari, dan memperdalam ilmu pengetahuan agama maupun sains demi kemaslahatan hidup." },
      { kata: "'Ilmun Nafi'", arti: "Ilmu yang memberikan manfaat nyata bagi pemiliknya dan orang lain, mendekatkan diri kepada Allah, serta diamalkan." },
      { kata: "Tawadhu'", arti: "Sikap rendah hati, tidak sombong dan tidak merasa lebih pintar dari orang lain meskipun memiliki ilmu luas." },
      { kata: "Ta'zhim", arti: "Sikap hormat, memuliakan, dan menghargai guru sebagai perantara sampainya hidayah dan ilmu." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Fatir",
        ayat: "28",
        teksArab: "إِنَّمَا يَخْشَى ٱللَّهَ مِنْ عِبَادِهِ ٱلْعُلَمَـٰٓؤُا۟ ۗ إِنَّ ٱللَّهَ عَزِيزٌ غَفُورٌ",
        latin: "Innamā yakhsyallāha min 'ibādihil-'ulamā', innallāha 'azīzun gafūr.",
        arti: "Di antara hamba-hamba Allah yang takut kepada-Nya hanyalah para ulama (orang-orang yang berilmu). Sungguh, Allah Mahaperkasa, Maha Pengampun."
      },
      {
        surah: "Hadits Riwayat Ibnu Majah",
        ayat: "Sunan Ibnu Majah No. 224",
        teksArab: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        latin: "Ṭalabul-'ilmi farīḍatun 'alā kulli muslim.",
        arti: "Menuntut ilmu itu wajib atas setiap orang muslim."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Wahyu pertama yang turun kepada Nabi Muhammad SAW bukanlah perintah shalat atau jihad, melainkan perintah membaca: 'Iqra'!' (Q.S. Al-'Alaq: 1). Ini adalah bukti bahwa peradaban Islam berdiri tegak di atas pilar literasi, ilmu pengetahuan, dan keterbukaan akal budi. Menuntut ilmu merupakan ibadah agung yang jalan tempuhnya memudahkan langkah menuju surga.",
      subMateri: [
        {
          judul: "1. Keutamaan Agung Penuntut Ilmu dalam Islam",
          konten:
            "Rasulullah SAW bersabda: 'Siapa yang menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga' (H.R. Muslim). Orang berilmu lebih utama daripada orang yang hanya gemar beribadah tanpa ilmu, laksana perbandingan keindahan bulan purnama dibanding bintang-bintang. Bahkan ikan di lautan dan semut di lubangnya memohonkan ampunan bagi guru yang mengajarkan kebaikan.",
          poinPenting: [
            "Menuntut ilmu bernilai pahala jihad fii sabilillah.",
            "Ilmu adalah warisan para nabi, bukan emas dan perak.",
            "Ilmu menjaga pemiliknya, sedangkan harta harus dijaga oleh pemiliknya."
          ]
        },
        {
          judul: "2. Adab-Adab Luhur Murid terhadap Guru dan Sumber Belajar",
          konten:
            "Imam Malik berkata: 'Pelajarilah adab sebelum engkau mempelajari ilmu.' Keberkahan ilmu sangat bergantung pada keridhaan guru. Adab murid meliputi: mendengarkan penjelasan guru dengan seksama, tidak memotong pembicaraan, menyapa dan mencium tangan dengan takzim, mendoakan kebaikan guru, serta tidak mencari-cari kesalahan guru. Terhadap buku dan alat tulis: merawatnya, tidak melipat sembarangan, dan meletakkannya di tempat yang terhormat.",
          poinPenting: [
            "Keberkahan ilmu diperoleh melalui adab dan doa restu guru.",
            "Menghindari sifat sombong (merasa pintar) dan malu yang keliru (malu bertanya).",
            "Mencatat pelajaran (qaidul 'ilmi bil kitab) agar tidak hilang tertelan waktu."
          ]
        },
        {
          judul: "3. Membangun Etos Literasi Remaja di Era Digital",
          konten:
            "Tantangan generasi masa kini adalah banjir informasi namun defisit pemahaman mendalam. Pelajar muslim harus cerdas memilah informasi: melakukan tabayyun (verifikasi data), tidak menelan mentah-mentah berita internet, menggunakan kecerdasan buatan (AI) dan gawai untuk riset pengetahuan, bukan untuk kecanduan game online dan medsos yang sia-sia.",
          poinPenting: [
            "Prinsip Tabayyun dalam menyerap informasi digital.",
            "Menjadikan gadget sebagai perpustakaan digital saku.",
            "Menyeimbangkan antara ilmu syariat (fardhu 'ain) dan sains teknologi (fardhu kifayah)."
          ]
        }
      ],
      aktivitasSiswa: [
        "Bedah Kutipan Imam Syafi'i: Mendiskusikan 6 syarat sukses menuntut ilmu dan membuat target belajar mingguan.",
        "Kunjungan Perpustakaan & Resume Buku: Menghabiskan 2 jam di perpustakaan sekolah dan meresume 1 buku ilmiah atau biografi tokoh.",
        "Surat Cinta untuk Guru: Menulis surat ucapan terima kasih dan permohonan maaf kepada guru yang telah mendidik dengan tulus."
      ],
      hikmahKarakter:
        "Rasa Ingin Tahu & Kehausan Intelektual: Membangun pribadi pembelajar sepanjang hayat (lifelong learner) yang rendah hati, beradab santun, dan produktif berkarya bagi kemanusiaan."
    }
  },

  {
    babNomor: 9,
    semester: 2,
    judulBab: "Menerapkan Ketentuan Ibadah Haji dan Umrah",
    kategori: "Fiqih",
    elemenCP: "Fiqih",
    capaianPembelajaran:
      "Peserta didik mampu memahami dan mendeskripsikan ketentuan ibadah haji dan umrah, menganalisis syarat, rukun, wajib, dan larangan ihram, membedakan antara haji dan umrah, memahami macam-macam pelaksanaan haji (Ifrad, Qiran, Tamattu'), menghitung dam (denda pelanggaran), serta meneladani nilai-nilai pengorbanan Nabi Ibrahim as dan persatuan umat sedunia.",
    ringkasan:
      "Haji adalah rukun Islam kelima yang wajib ditunaikan sekali seumur hidup bagi orang yang mampu (istitha'ah). Haji dilaksanakan pada bulan Syawal, Dzulqa'dah, dan Dzulhijjah, sedangkan umrah (haji kecil) dapat dilaksanakan kapan saja sepanjang tahun. Rukun haji terdiri dari: Ihram, Wukuf di Arafah, Thawaf Ifadhah, Sa'i, Tahallul, dan Tertib. Jika rukun ditinggalkan, haji tidak sah dan tidak bisa diganti dam. Bab ini juga membahas wajib haji, miqat makani/zamani, serta hikmah napak tilas perjuangan keluarga Nabi Ibrahim as dan Siti Hajar.",
    tujuanPembelajaran: [
      "Menjelaskan pengertian, hukum, dalil naqli, dan syarat istitha'ah (mampu) ibadah haji dan umrah.",
      "Mengidentifikasi persamaan dan perbedaan pokok antara ibadah haji dan umrah.",
      "Menyebutkan rukun haji (Ihram, Wukuf di Arafah, Thawaf, Sa'i, Tahallul, Tertib) dan rukun umrah.",
      "Menjelaskan wajib haji (Ihram dari miqat, mabit di Muzdalifah, mabit di Mina, melempar jumrah, thawaf wada').",
      "Menjelaskan 3 cara pelaksanaan haji: Tamattu', Ifrad, dan Qiran beserta konsekuensi damnya.",
      "Menyebutkan larangan-larangan ihram bagi laki-laki dan perempuan serta sanksinya.",
      "Mendemonstrasikan praktik manasik haji sederhana di sekolah."
    ],
    materiPokok: [
      "Konsep Istitha'ah: Finansial, kesehatan fisik/mental, keamanan perjalanan, dan mahram bagi wanita.",
      "Perbedaan Haji dan Umrah: Waktu pelaksanaan (haji terikat waktu tertentu, umrah bebas), rukun wukuf di Arafah (hanya ada pada haji).",
      "Miqat Zamani (batas waktu) dan Miqat Makani (batas tempat memulai niat ihram: Dzulhulaifah/Bir Ali, Juhfah, Yalamlam, Qarnul Manazil, Dzatul 'Irq).",
      "Rukun Haji: Ihram berniat, Wukuf di Arafah (9 Dzulhijjah), Thawaf Ifadhah (mengelilingi Ka'bah 7 putaran), Sa'i (berlari-lari kecil antara Safa dan Marwah 7 kali), Tahallul (mencukur rambut), Tertib.",
      "Wajib Haji: Ihram dari miqat, Mabit di Muzdalifah, Mabit di Mina, Melempar Jumrah (Ula, Wustha, Aqabah), Menjauhi larangan ihram, dan Thawaf Wada'.",
      "Jenis Pelaksanaan Haji: Tamattu' (umrah dulu baru haji, kena dam), Ifrad (haji dulu baru umrah, tanpa dam), Qiran (haji dan umrah sekaligus dalam satu niat, kena dam).",
      "Hikmah Haji: Pakaian ihram putih melambangkan persamaan derajat manusia di hadapan Allah, wukuf miniatur padang mahsyar, dan sa'i mengenang perjuangan Siti Hajar mencari air zamzam."
    ],
    istilahPenting: [
      { kata: "Istitha'ah", arti: "Kemampuan fisik, finansial, dan keamanan perjalanan untuk menunaikan ibadah haji." },
      { kata: "Wukuf", arti: "Berdiam diri dan berdoa di Padang Arafah pada tanggal 9 Dzulhijjah sejak tergelincir matahari hingga terbit fajar 10 Dzulhijjah." },
      { kata: "Thawaf", arti: "Berjalan mengelilingi Ka'bah sebanyak 7 putaran berlawanan arah jarum jam dengan Ka'bah berada di sebelah kiri." },
      { kata: "Sa'i", arti: "Berjalan/berlari-lari kecil sebanyak 7 kali bolak-balik dari bukit Safa ke bukit Marwah." },
      { kata: "Tahallul", arti: "Keluarnya seseorang dari keadaan ihram setelah mencukur atau memotong sebagian rambut kepala." },
      { kata: "Dam", arti: "Denda berupa menyembelih hewan qurban, berpuasa, atau sedekah akibat melanggar larangan ihram atau meninggalkan wajib haji." }
    ],
    dalilAyat: [
      {
        surah: "Q.S. Ali 'Imran",
        ayat: "97",
        teksArab: "وَلِلَّهِ عَلَى ٱلنَّاسِ حِجُّ ٱلْبَيْتِ مَنِ ٱسْتَطَاعَ إِلَيْهِ سَبِيلًۭ ۚ وَمَن كَفَرَ فَإِنَّ ٱللَّهَ غَنِىٌّ عَنِ ٱلْعَـٰلَمِينَ",
        latin: "Wa lillāhi 'alan-nāsi ḥijjul-baiti manistaṭā'a ilaihi sabīlā, wa may kafara fa innallāha ganiyyun 'anil-'ālamīn.",
        arti: "Dan (di antara) kewajiban manusia terhadap Allah adalah melaksanakan ibadah haji ke Baitullah, yaitu bagi orang-orang yang mampu mengadakan perjalanan ke sana. Barangsiapa mengingkari (kewajiban haji), maka ketahuilah bahwa Allah Mahakaya (tidak memerlukan sesuatu) dari seluruh alam."
      },
      {
        surah: "Hadits Riwayat Al-Bukhari & Muslim",
        ayat: "Shahih Bukhari No. 1773",
        teksArab: "الْعُمْرَةُ إِلَى الْعُمْرَةِ كَفَّارَةٌ لِمَا بَيْنَهُمَا، وَالْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلَّا الْجَنَّةُ",
        latin: "Al-'umratu ilal-'umrati kaffāratul limā bainahumā, wal-ḥajjul-mabrūru laisa lahū jazā'un illal-jannah.",
        arti: "Suatu umrah ke umrah berikutnya adalah penghapus dosa di antara keduanya, dan haji yang mabrur tidak ada balasan baginya selain surga."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Ibadah haji adalah muktamar akbar tahunan umat Islam sedunia. Jutaan manusia berkumpul dari berbagai penjuru bumi dengan ras, warna kulit, dan bahasa yang beraneka ragam, melepaskan segala atribut kemewahan duniawi, dan mengenakan kain kafan ihram putih yang sama untuk menyahut panggilan Ilahi: 'Labbaikallahumma Labbaik'.",
      subMateri: [
        {
          judul: "1. Syarat Istitha'ah dan Perbedaan Haji dengan Umrah",
          konten:
            "Kewajiban haji bersyarat istitha'ah (mampu): memiliki bekal biaya perjalanan dan nafkah keluarga yang ditinggalkan, badan sehat dan kuat, aman jalan yang dilalui, serta tersedianya kuota/kendaraan. Perbedaan mendasar: Haji hanya sah dikerjakan pada bulan haji (Syawal, Dzulqa'dah, Dzulhijjah) dan memiliki rukun wukuf di Arafah. Sedangkan umrah bisa dilaksanakan kapan saja sepanjang tahun dan tidak ada wukuf di Arafah.",
          poinPenting: [
            "Haji wajib sekali seumur hidup bagi yang mampu, selebihnya sunnah.",
            "Rukun haji harus dilaksanakan dan tidak bisa diganti dengan denda (dam).",
            "Wajib haji jika ditinggalkan hajinya tetap sah namun wajib membayar dam (fidyah)."
          ]
        },
        {
          judul: "2. Rukun, Wajib, dan Larangan dalam Ihram",
          konten:
            "Larangan ihram bagi laki-laki: memakai pakaian bertiras/berjahit yang membentuk lekuk tubuh dan memakai sepatu yang menutup mata kaki. Larangan bagi perempuan: menutup wajah (cadar) dan menutup kedua telapak tangan (sarung tangan). Larangan bagi keduanya: memakai wewangian, memotong rambut/kuku, membunuh hewan buruan, memotong pohon di tanah haram, melangsungkan akad nikah, dan bersetubuh/bercumbu.",
          poinPenting: [
            "Bacaan talbiyah dilantunkan terus-menerus sejak ihram hingga melempar jumrah aqabah.",
            "Wukuf di Arafah pada 9 Dzulhijjah adalah inti dari ibadah haji (Al-Hajju 'Arafah).",
            "Thawaf wada' (perpisahan) dilakukan sebelum meninggalkan kota Makkah Al-Mukarramah."
          ]
        },
        {
          judul: "3. Tiga Jenis Pelaksanaan Haji dan Pembayaran Dam",
          konten:
            "Jemaah Indonesia umumnya memilih Haji Tamattu' (melaksanakan umrah terlebih dahulu di bulan haji, lalu bertahallul bebas, kemudian memakai ihram lagi pada 8 Dzulhijjah untuk ibadah haji) karena dinilai lebih ringan dan praktis, dengan konsekuensi wajib membayar dam seekor kambing. Haji Ifrad (haji dahulu baru umrah) dan Haji Qiran (menggabungkan niat haji dan umrah sekaligus).",
          poinPenting: [
            "Haji Tamattu' mewajibkan dam seekor kibas/kambing atau puasa 10 hari (3 hari di tanah suci, 7 hari di tanah air).",
            "Napak tilas pengorbanan Nabi Ibrahim as mengajarkan keikhlasan mutlak kepada perintah Allah.",
            "Haji Mabrur ditandai dengan perubahan akhlak menjadi semakin dermawan dan santun bermasyarakat."
          ]
        }
      ],
      aktivitasSiswa: [
        "Praktik Manasik Haji di Sekolah: Memakai kain ihram bagi putra dan mukena putih bagi putri, mempraktikkan thawaf mengelilingi miniatur Ka'bah, sa'i, dan melempar jumrah kerikil.",
        "Pembuatan Peta Alur Haji: Menggambar bagan rute perjalanan jemaah haji dari Miqat -> Makkah -> Arafah -> Muzdalifah -> Mina -> Makkah.",
        "Latihan Melantunkan Talbiyah: Melantunkan bersama kalimat 'Labbaikallahumma labbaik...' dengan penghayatan makna yang mendalam."
      ],
      hikmahKarakter:
        "Persaudaraan Universal (Ukhuwah Islamiyah) & Kedisiplinan: Mengikis arogansi kekayaan dan status sosial, melatih kesabaran fisik, serta memperkuat solidaritas kemanusiaan sedunia."
    }
  },

  {
    babNomor: 10,
    semester: 2,
    judulBab: "Merefleksikan Diri terhadap Sejarah dan Peran Kekhalifahan Islam Paska Khulafaur Rasyidin: Dinasti Turki Usmani",
    kategori: "Sejarah (Tarikh)",
    elemenCP: "Sejarah Peradaban Islam",
    capaianPembelajaran:
      "Peserta didik mampu menelaah dan merefleksikan sejarah berdirinya Dinasti Turki Usmani (Ottoman Empire) oleh Utsman I, menganalisis peristiwa bersejarah penaklukan Konstantinopel (1453 M) oleh Sultan Muhammad Al-Fatih sebagai pembuktian nubuat Rasulullah SAW, mengidentifikasi kemajuan hukum dan arsitektur era Sultan Sulaiman Al-Qanuni, serta meneladani kegigihan pemuda dalam mewujudkan cita-cita peradaban.",
    ringkasan:
      "Dinasti Turki Usmani didirikan oleh Utsman I bin Ertugrul pada tahun 1299 M di Anatolia (Turki modern). Dinasti ini berkembang menjadi kekaisaran adidaya lintas tiga benua (Asia, Eropa, dan Afrika). Puncak kegemilangan dicapai ketika pemuda berusia 21 tahun, Sultan Muhammad Al-Fatih (Mehmed II), menaklukkan benteng tak tertembus Konstantinopel pada tahun 1453 M, merealisasikan sabda Nabi SAW. Di masa Sultan Sulaiman Al-Qanuni (The Magnificent), hukum perdata Islam dikodifikasi dan arsitektur masjid megah karya Mimar Sinan menghiasi Istanbul.",
    tujuanPembelajaran: [
      "Menceritakan asal-usul berdirinya Dinasti Turki Usmani oleh Utsman I bin Ertugrul.",
      "Menganalisis strategi militer, persiapan spiritual, dan taktik cerdas Sultan Muhammad Al-Fatih saat menaklukkan Konstantinopel.",
      "Menghubungkan peristiwa penaklukan Konstantinopel dengan hadis nabi tentang sebaik-baik panglima dan sebaik-baik pasukan.",
      "Menjelaskan masa kejayaan era Sultan Sulaiman Al-Qanuni (The Magnificent) dalam bidang kodifikasi hukum perundang-undangan.",
      "Mengidentifikasi kemajuan seni arsitektur Islam Turki Usmani seperti Masjid Biru (Sultan Ahmed), Masjid Suleymaniye, dan Istana Topkapi.",
      "Mengambil ibrah dari kepemimpinan pemuda Islam yang visioner, disiplin, berakhlak mulia, dan bermental juara."
    ],
    materiPokok: [
      "Sejarah awal berdirinya Dinasti Usmani: Peran suku Kayi, Ertugrul, dan deklarasi kemerdekaan oleh Utsman I pada 1299 M.",
      "Penaklukan Konstantinopel 1453 M: Taktik memindahkan 70 kapal perang melintasi daratan bukit Galata dalam satu malam, meriam raksasa Urban (Basilica), dan pidato moral Al-Fatih.",
      "Perlakuan toleran Al-Fatih kepada penduduk Kristen Konstantinopel dan perlindungan gereja-gereja serta transformasi Hagia Sophia menjadi masjid.",
      "Masa keemasan Sultan Sulaiman Al-Qanuni (1520-1566 M): Penyusunan Qanun-name (kitab undang-undang negara) yang adil dan menjamin hak semua warga.",
      "Institusi militer Yanisari (Janissary) dan keajaiban teknik sipil Mimar Sinan.",
      "Faktor keruntuhan Dinasti Usmani di abad ke-20: Kemunduran moral istana, kalah dalam Perang Dunia I, dan dihapuskannya sistem khilafah pada 1924 M."
    ],
    istilahPenting: [
      { kata: "Muhammad Al-Fatih", arti: "Sultan ketujuh Daulah Usmani yang dijuluki 'Sang Penakluk' karena berhasil menaklukkan ibu kota Romawi Timur (Konstantinopel) di usia muda (21 tahun)." },
      { kata: "Al-Qanuni", arti: "Gelar untuk Sultan Sulaiman I karena jasanya meletakkan dan menyusun sistem hukum undang-undang negara yang komprehensif dan adil." },
      { kata: "Yanisari", arti: "Korps pasukan infanteri elit militer Turki Usmani yang sangat disiplin dan ditakuti di medan perang dunia." },
      { kata: "Mimar Sinan", arti: "Arsitek jenius Dinasti Usmani yang merancang ratusan mahakarya arsitektur seperti Masjid Suleymaniye dan Masjid Selimiye." }
    ],
    dalilAyat: [
      {
        surah: "Hadits Riwayat Ahmad",
        ayat: "Musnad Ahmad No. 18957",
        teksArab: "لَتُفْتَحَنَّ الْقُسْطَنْطِينِيَّةُ فَلَنِعْمَ الْأَمِيرُ أَمِيرُهَا وَلَنِعْمَ الْجَيْشُ ذَلِكَ الْجَيْشُ",
        latin: "Latuftaḥannal-qusṭanṭīniyyatu falani'mal-amīru amīruhā wa lani'mal-jaysyu żālikal-jaysy.",
        arti: "Pasti Konstantinopel akan ditaklukkan. Sebaik-baik pemimpin adalah pemimpinnya (yang menaklukkannya), dan sebaik-baik pasukan adalah pasukan tersebut."
      },
      {
        surah: "Q.S. Al-Fath",
        ayat: "1",
        teksArab: "إِنَّا فَتَحْنَا لَكَ فَتْحًۭا مُّبِينًۭا",
        latin: "Innā fataḥnā laka fat-ḥam mubīnā.",
        arti: "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata."
      }
    ],
    bahanAjarLengkap: {
      pendahuluan:
        "Kisah penaklukan Konstantinopel adalah inspirasi terbesar tentang kekuatan iman, visi kepemimpinan pemuda, dan keunggulan teknologi. Sebuah kota benteng yang dikelilingi tembok tiga lapis dan rantai laut raksasa yang gagal ditaklukkan selama 800 tahun akhirnya takluk di tangan pemuda saleh berusia 21 tahun yang menguasai 7 bahasa dan tidak pernah meninggalkan salat tahajud.",
      subMateri: [
        {
          judul: "1. Berdirinya Daulah Usmani dan Karakteristik Para Pendirinya",
          konten:
            "Berasal dari kabilah Oghuz suku Kayi yang bermigrasi menghindari invasi Mongol. Di bawah kepemimpinan Utsman I, mereka mendirikan emirat independen yang menjunjung tinggi keadilan Islam, nilai ksatria (Gazi), dan rasa hormat yang mendalam kepada para ulama dan sufi pembimbing spiritual (seperti Syaikh Edebali).",
          poinPenting: [
            "Prinsip wasiat Syaikh Edebali: 'Peliharalah manusia, niscaya negara akan terpelihara'.",
            "Ekspansi damai dan perlindungan terhadap rakyat jelata di perbatasan Byzantium.",
            "Pembentukan korps militer Yanisari yang terlatih secara fisik dan batin."
          ]
        },
        {
          judul: "2. Detik-Detik Penaklukan Konstantinopel oleh Al-Fatih (1453 M)",
          konten:
            "Sultan Mehmed II mempersiapkan penaklukan dengan matang: membangun benteng Rumeli Hisari, mencetak meriam raksasa penembus tembok benteng bersama insinyur Urban, dan strategi tak terduga memindahkan 70 kapal melalui darat dalam satu malam untuk menghindari rantai Tanduk Emas (Golden Horn). Tepat pada hari Selasa, 29 Mei 1453 M, benteng berhasil ditembus. Ketika masuk kota, Al-Fatih melarang pembunuhan warga sipil, membebaskan tawanan, dan menjamin kebebasan ibadah umat Kristen Ortodoks.",
          poinPenting: [
            "Kombinasi antara doa tahajud yang khusyuk dan kecanggihan strategi militer modern.",
            "Toleransi mulia sang pemenang: menjamin keamanan nyawa dan gereja penduduk Kristen.",
            "Konstantinopel diubah namanya menjadi Islambol / Istanbul (Kota Islam)."
          ]
        },
        {
          judul: "3. Puncak Kejayaan Sulaiman Al-Qanuni dan Pelajaran Sejarah",
          konten:
            "Pada abad ke-16, Sultan Sulaiman Al-Qanuni memimpin wilayah yang membentang dari Budapest di Eropa hingga Yaman di Jazirah Arab. Beliau merumuskan kitab undang-undang Kanun yang menegakkan supremasi hukum tanpa pandang bulu. Pelajaran penting dari keruntuhan Usmani: perpecahan internal, korupsi moral, tertinggal dalam revolusi industri barat, dan hilangnya persatuan umat berakibat pada runtuhnya kekhalifahan.",
          poinPenting: [
            "Kekuasaan adidaya harus dilandasi penegakan hukum yang adil dan bersih.",
            "Pentingnya menguasai sains, teknologi manufaktur, dan bahasa asing.",
            "Pemuda masa kini harus memiliki mentalitas Al-Fatih: berilmu tinggi, berakhlak mulia, dan berani mewujudkan mimpi besar."
          ]
        }
      ],
      aktivitasSiswa: [
        "Analisis Taktik Al-Fatih: Menonton dokumenter atau membaca artikel tentang pemindahan kapal melintasi bukit dan membuat peta taktiknya.",
        "Refleksi Diri 'Menjadi Generasi Penakluk Impian': Menuliskan target prestasi akademik dan spiritual yang ingin dicapai sebelum usia 20 tahun.",
        "Eksplorasi Virtual Arsitektur Mimar Sinan: Mengamati foto kubah Masjid Suleymaniye dan menganalisis keindahan perpaduan seni kaligrafi dan arsitektur kubahnya."
      ],
      hikmahKarakter:
        "Ketangguhan Visi, Religiositas & Kepemimpinan: Mengikis rasa malas dan inferior, menanamkan keyakinan bahwa pemuda berakhlak mulia dan berilmu tinggi sanggup mengukir sejarah kegemilangan bagi peradaban dunia."
    }
  }
];

export const BUKU_PAI_KELAS_8_LENGKAP: BukuPelajaranData = {
  id: "buku-smp-8",
  judul: "Pendidikan Agama Islam dan Budi Pekerti SMP Kelas VIII",
  kelas: "Kelas VIII (Fase D)",
  tingkat: "Kelas VIII",
  fase: "Fase D (SMP/MTs)",
  kurikulum: "Kurikulum Merdeka (Kemendikbudristek)",
  regulasiCP: "Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024 (Regulasi CP 2024-2026)",
  penulis: "Tatik Pudjiani & Bagus Mustakim",
  penerbit: "Pusat Perbukuan, BSKAP Kementerian Pendidikan RI",
  tahunTerbit: "Edisi Revisi Resmi 2024/2026",
  deskripsiBuku:
    "Buku teks utama siswa dan bahan ajar komprehensif PAI dan Budi Pekerti untuk kelas VIII SMP yang memuat 10 bab pembelajaran lengkap (Semester 1: Bab 1-5 & Semester 2: Bab 6-10) berdasarkan 5 elemen Capaian Pembelajaran (CP) terbaru: toleransi ayat Al-Hujurat 13 & Al-Baqarah 256, iman kitab Allah, cinta Rasul, fardhu kifayah jenazah, kejayaan Daulah Abbasiyah, cinta tanah air ayat An-Nisa 66 & tajwid nun sukun/tanwin, iman kepada rasul & Ulul Azmi, cinta ilmu, haji dan umrah, hingga sejarah kekhalifahan Dinasti Turki Usmani.",
  babList: BAB_LIST_KELAS_8
};
