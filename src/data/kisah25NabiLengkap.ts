/**
 * Data Lengkap 25 Nabi dan Rasul Allah Swt
 * Berisi Sejarah Lengkap, Silsilah & Keluarga, Kaum/Umat, Mukjizat, Ibrah & Nilai Keteladanan,
 * serta Dalil Al-Qur'an Otentik.
 */

export interface KeluargaNabiData {
  ayahIbu: string;
  pasangan: string;
  anakKeturunan: string;
  tokohKeluargaTerkait?: string;
  catatanKeluarga: string;
}

export interface UmatNabiData {
  namaKaum: string;
  wilayah: string;
  karakterKaum: string;
  penolakanDanUjian: string;
  kesudahanKaum: string;
}

export interface DalilKunciData {
  surah: string;
  ayat: string;
  arab: string;
  arti: string;
}

export interface KisahNabiData {
  nomorUrut: number;
  nama: string;
  namaArab?: string;
  gelar?: string;
  isUlulAzmi: boolean;
  periodeKaum: string;
  tempatDakwah: string;
  usia?: string;
  sebutan?: string;
  ayatAlquran: string;
  sejarahLengkap: string;
  ringkasanKisah: string;
  keluarga: KeluargaNabiData;
  umat: UmatNabiData;
  mukjizat: string[];
  ibrah: string[];
  keteladanan: string[];
  dalilKunci?: DalilKunciData;
}

export const LIST_KISAH_25_NABI_LENGKAP: KisahNabiData[] = [
  {
    "nomorUrut": 1,
    "nama": "Nabi Adam as",
    "namaArab": "آدَمُ عَلَيْهِ السَّلَام",
    "gelar": "Abul Basyar (Bapak Umat Manusia) / Khalifatullah fil-Ardh",
    "isUlulAzmi": false,
    "periodeKaum": "Awal Penciptaan Kehidupan Manusia di Bumi",
    "tempatDakwah": "Bumi (setelah turun dari Surga)",
    "usia": "Sekitar 930 - 1000 tahun",
    "sebutan": "Manusia pertama sekaligus Nabi pertama",
    "ayatAlquran": "Q.S. Al-Baqarah: 30-38, Q.S. Al-A'raf: 11-25, Q.S. Thaha: 115-123",
    "keluarga": {
      "ayahIbu": "Diciptakan langsung oleh Allah Swt dari saripati tanah liat (tanpa ayah dan ibu)",
      "pasangan": "Siti Hawa (diciptakan Allah dari tulang rusuk kiri Nabi Adam as)",
      "anakKeturunan": "Dikaruniai anak-anak kembar berpasangan (40 kali melahirkan / sekitar 80 anak), di antaranya Qabil & Iqlima, Habil & Labuda, serta Nabi Syits as (penerus risalah kenabian)",
      "tokohKeluargaTerkait": "Habil (putra shalih yang taat) dan Qabil (putra yang terperdaya hawa nafsu dan membunuh Habil)",
      "catatanKeluarga": "Keluarga pertama di muka bumi yang menjadi tonggak peradaban, mengajarkan pentingnya pernikahan syar'i, ketaatan berqurban, dan bahaya hasad antar saudara."
    },
    "umat": {
      "namaKaum": "Anak-cucu dan keturunan awal umat manusia di bumi",
      "wilayah": "Jazirah Arab / Mekkah / Jabal Rahmah hingga kawasan timur",
      "karakterKaum": "Generasi awal manusia yang mulai berkembang populasinya; sebagian taat beribadah dan sebagian mulai dihinggapi rasa dengki serta godaan nafsu",
      "penolakanDanUjian": "Peristiwa pembunuhan pertama di muka bumi ketika Qabil membunuh Habil karena hasad qurbannya tidak diterima, serta duka mendalam Adam atas kehilangan kedua putranya",
      "kesudahanKaum": "Nabi Adam terus membimbing anak-cucunya dalam tauhid dan ketaatan kepada Allah hingga risalah dilanjutkan oleh putranya, Nabi Syits as."
    },
    "sejarahLengkap": "Allah Swt mengabarkan kepada para malaikat tentang kehendak-Nya menciptakan manusia sebagai khalifah di bumi. Para malaikat sempat bertanya tentang potensi manusia berbuat kerusakan dan menumpahkan darah, namun Allah menegaskan keluasan ilmu-Nya. Nabi Adam diciptakan dari tanah liat, ditiupkan ruh oleh Allah, lalu diajarkan nama-nama seluruh benda di alam semesta. Ketika para malaikat diperintahkan bersujud penghormatan, seluruhnya bersujud kecuali Iblis yang menolak dengan pongah karena merasa lebih mulia tercipta dari api.\n\nNabi Adam kemudian dipertemukan dengan Siti Hawa dan tinggal di dalam kenikmatan Surga. Mereka diperbolehkan menikmati apa saja di surga kecuali satu larangan: tidak boleh mendekati pohon terlarang (syajaratul khuldi). Namun, Iblis melancarkan tipu daya dan sumpah palsu hingga Adam dan Hawa terbujuk mencicipi buah tersebut. Seketika aurat mereka tersingkap dan rasa penyesalan mendalam melanda sanubari mereka.\n\nDengan kerendahan hati yang tulus, Adam dan Hawa memanjatkan doa taubat: 'Rabbana zhalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal khasirin'. Allah menerima taubat mereka, lalu menurunkan keduanya ke bumi untuk memulai misi peradaban dan ibadah. Di bumi, Adam dan Hawa dipertemukan kembali di Jabal Rahmah (Arafah) dan mendidik keturunannya dalam jalan tauhid.",
    "ringkasanKisah": "Diciptakan sebagai manusia dan nabi pertama, dimuliakan dengan ilmu oleh Allah hingga malaikat bersujud hormat. Mengakui kekhilafannya setelah terbujuk tipu daya Iblis memakan buah terlarang, bertaubat dengan tulus, lalu diampuni Allah dan diturunkan ke bumi untuk mengemban amanah kekhalifahan serta membimbing anak-cucunya.",
    "mukjizat": [
      "Diciptakan langsung oleh Allah Swt dari tanah liat dan ditiupkan ruh ciptaan-Nya tanpa perantara orang tua",
      "Dianugerahi ilmu ladunni mengetahui nama, fungsi, dan hakikat seluruh benda di alam semesta yang malaikat pun tidak mengetahuinya",
      "Mendapat penghormatan sujud dari seluruh malaikat atas perintah Allah Swt",
      "Memiliki postur dan rupa yang sangat sempurna serta umur panjang mendekati 1000 tahun"
    ],
    "ibrah": [
      "Mengakui kesalahan dan segera bertaubat: Kunci kemuliaan seorang hamba adalah kejujuran mengakui dosa dan bersujud memohon ampunan Allah",
      "Keutamaan ilmu pengetahuan: Kemuliaan manusia atas makhluk lainnya terletak pada kapasitas keilmuan dan akal yang dilandasi iman",
      "Waspada terhadap tipu daya Iblis: Setan selalu membungkus maksiat dengan janji manis kelestarian dan kenikmatan semu",
      "Menjaga persaudaraan dan menjauhi hasad: Kisah Habil dan Qabil mengajarkan bahwa kedengkian hanya akan melahirkan penyesalan abadi"
    ],
    "keteladanan": [
      "Mengakui kesalahan dan segera bertaubat kepada Allah.",
      "Pentingnya ilmu pengetahuan sebagai modal utama kepemimpinan.",
      "Waspada terhadap bujuk rayu dan tipu daya iblis/setan.",
      "Menjaga kerukunan keluarga dan menghindari rasa iri dengki."
    ],
    "dalilKunci": {
      "surah": "Al-Baqarah",
      "ayat": "30",
      "arab": "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
      "arti": "Dan (ingatlah) ketika Tuhanmu berfirman kepada para malaikat: 'Sesungguhnya Aku hendak menjadikan seorang khalifah di muka bumi'."
    }
  },
  {
    "nomorUrut": 2,
    "nama": "Nabi Idris as",
    "namaArab": "إِدْرِيسُ عَلَيْهِ السَّلَام",
    "gelar": "Asadul Usud (Singa dari Segala Singa) / Al-Khattath",
    "isUlulAzmi": false,
    "periodeKaum": "Generasi ke-6 keturunan Nabi Adam as (Sebelum Era Banjir Nuh)",
    "tempatDakwah": "Babilonia (Irak Kuno) lalu hijrah ke Mesir (sekitar Sungai Nil)",
    "usia": "Sekitar 345 - 365 tahun",
    "sebutan": "Pelopor tulis-menulis dengan pena dan penjahit busana",
    "ayatAlquran": "Q.S. Maryam: 56-57, Q.S. Al-Anbiya: 85-86",
    "keluarga": {
      "ayahIbu": "Yarid bin Mihlayil bin Qainan (garis silsilah lurus dari Nabi Syits bin Adam as)",
      "pasangan": "Wanita shalihah di Babilonia",
      "anakKeturunan": "Putra beliau bernama Matusyalakh (yang kelak menurunkan Nabi Nuh as)",
      "tokohKeluargaTerkait": "Nabi Syits as (leluhur pembawa ajaran tauhid) dan Nabi Nuh as (cicitnya)",
      "catatanKeluarga": "Keluarga peradaban mulia yang menjaga shalat, puasa, dan lembaran wahyu suci (suhuf) warisan Nabi Syits dan Nabi Adam."
    },
    "umat": {
      "namaKaum": "Masyarakat Babilonia dan keturunan Qabil yang mulai menyimpang",
      "wilayah": "Mesopotamia (Irak) dan lembah Sungai Nil (Mesir)",
      "karakterKaum": "Banyak yang melupakan ajaran tauhid, terjerumus dalam kemaksiatan, perzinahan, dan pemujaan hawa nafsu",
      "penolakanDanUjian": "Kaumnya sulit diajak kembali pada kebenaran sehingga Nabi Idris memimpin hijrah kaum beriman menuju tanah Mesir yang subur",
      "kesudahanKaum": "Mereka yang menolak dakwah hidup dalam kebodohan dan kesesatan hingga datang masa kemusyrikan besar di era berikutnya."
    },
    "sejarahLengkap": "Nabi Idris as dinamakan 'Idris' karena ketekunannya yang luar biasa dalam mempelajari (darasa) suhuf-suhuf Allah yang diturunkan kepada Nabi Adam dan Nabi Syits. Beliau dikenal sangat cerdas, tekun, dan menjadi pelopor berbagai peradaban mendasar umat manusia. Sebelum era beliau, manusia mengenakan pakaian dari kulit binatang seadanya, lalu Nabi Idris menemukan keahlian memintal benang, menenun, dan menjahit pakaian rapi yang menutup aurat.\n\nSelain itu, Nabi Idris adalah manusia pertama yang mencatat wahyu dan ilmu pengetahuan menggunakan pena (khatt bil qalam). Beliau juga menguasai dasar-dasar ilmu falak (astronomi perbintangan), matematika hitungan, dan tata kelola pemukiman. Di tengah masyarakat Babilonia yang semakin rusak moralitasnya akibat pengaruh keturunan Qabil yang durhaka, Nabi Idris berdiri tegak menyampaikan risalah tauhid dan keadilan.\n\nDakwah beliau yang penuh ketegasan membuatnya digelari Asadul Usud (Singa dari Segala Singa) karena keberaniannya menentang kemungkaran tanpa gentar. Ketika tantangan dakwah di Babilonia semakin berat, beliau memimpin pengikutnya berhijrah ke tanah Mesir di tepian Sungai Nil. Atas keshalihan, kejujuran, dan kesabarannya yang luar biasa, Allah memuliakan beliau dengan mengangkat derajatnya ke tempat yang tinggi (makanan 'aliyya).",
    "ringkasanKisah": "Nabi Idris as adalah sosok teladan ilmuwan dan nabi pertama yang menulis dengan pena, menjahit pakaian, dan menguasai ilmu falaq. Berdakwah dengan gigih di Babilonia dan Mesir mengajak kaumnya bertauhid, berakhlak mulia, dan menjauhi kemaksiatan, hingga Allah mengangkat derajatnya ke tempat yang amat tinggi.",
    "mukjizat": [
      "Manusia pertama yang menerima wahyu keterampilan menulis dengan pena (khatt bil qalam)",
      "Mempelopori teknologi menjahit dan menenun pakaian rapi dari serat benang",
      "Dikaruniai pemahaman ilmu falak (astronomi langit), ilmu hitung, dan manajemen kota",
      "Diangkat derajat dan kedudukannya oleh Allah Swt ke tempat yang amat tinggi (makanan 'aliyya di langit)",
      "Menerima 30 suhuf petunjuk dari Allah Swt"
    ],
    "ibrah": [
      "Semangat belajar tanpa henti (long-life learning): Ilmu pengetahuan dan sains adalah instrumen penguat tauhid dan peradaban",
      "Kreativitas dan inovasi kerja: Bekerja dengan keterampilan profesional (menjahit, menulis) adalah tradisi para nabi",
      "Keberanian menegakkan kebenaran: Tidak gentar beramar ma'ruf nahi munkar di tengah dominasi kemungkaran",
      "Pentingnya hijrah: Rela berpindah demi menjaga integritas keimanan dan membangun tatanan hidup yang lebih bersih"
    ],
    "keteladanan": [
      "Rajin membaca, menulis, dan mempelajari ilmu yang bermanfaat.",
      "Bekerja keras dan menghasilkan karya yang berguna bagi masyarakat.",
      "Berani membela kebenaran tanpa takut celaan orang lain.",
      "Senantiasa berdzikir di sela-sela aktivitas pekerjaan harian."
    ],
    "dalilKunci": {
      "surah": "Maryam",
      "ayat": "56-57",
      "arab": "وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا ۝ وَرَفَعْنَاهُ مَكَانًا عَلِيًّا",
      "arti": "Dan ceritakanlah (hai Muhammad kepada mereka, kisah) Idris di dalam Al-Qur'an. Sesungguhnya ia adalah seorang yang sangat membenarkan dan seorang nabi. Dan Kami telah mengangkatnya ke martabat yang tinggi."
    }
  },
  {
    "nomorUrut": 3,
    "nama": "Nabi Nuh as",
    "namaArab": "نُوحٌ عَلَيْهِ السَّلَام",
    "gelar": "Syaikhul Anbiya' (Guru Para Nabi) / Rasul Ulul Azmi Pertama",
    "isUlulAzmi": true,
    "periodeKaum": "Sekitar 3900 - 2900 SM (Masa Kemusyrikan Berhala Pertama)",
    "tempatDakwah": "Wilayah Mesopotamia Selatan (Irak Kuno)",
    "usia": "Usia dakwah 950 tahun (total usia sekitar 1050 tahun)",
    "sebutan": "Bapak Kedua Umat Manusia (setelah peristiwa banjir besar)",
    "ayatAlquran": "Q.S. Nuh: 1-28, Q.S. Hud: 25-49, Q.S. Al-Anbiya: 76-77, Q.S. Al-Mu'minun: 23-30",
    "keluarga": {
      "ayahIbu": "Lamak bin Matusyalakh bin Idris as",
      "pasangan": "Walighah (istri yang mengkhianati dakwah dan menolak beriman)",
      "anakKeturunan": "Memiliki 4 putra: Sam, Ham, Yafits (ketiganya beriman dan selamat di kapal), serta Kan'an / Yam (anak yang durhaka dan tewas tenggelam)",
      "tokohKeluargaTerkait": "Kan'an (putra yang menolak naik kapal karena mengira puncak gunung bisa melindunginya dari air)",
      "catatanKeluarga": "Ujian terberat Nabi Nuh adalah penolakan dari istri dan putranya sendiri. Menjadi bukti abadi bahwa hidayah semata milik Allah dan ikatan akidah melampaui ikatan nasab."
    },
    "umat": {
      "namaKaum": "Bani Rasib / Kaum Penyembah 5 Berhala (Wadd, Suwa', Yaghuts, Ya'uq, dan Nasr)",
      "wilayah": "Kawasan subur Mesopotamia di antara Sungai Eufrat dan Tigris (Irak)",
      "karakterKaum": "Sangat keras kepala, sombong, menindas kaum miskin, dan membela pemujaan berhala nenek moyang secara membabi buta",
      "penolakanDanUjian": "Selama 950 tahun berdakwah siang malam, kaumnya menutup telinga, menutupkan baju ke kepala, mengejek Nabi Nuh gila, dan mengancam merajamnya",
      "kesudahanKaum": "Ditenggelamkan secara total oleh air bah raksasa (thufan) yang memancar dari perut bumi dan dicurahkan dari langit, menyisakan Nabi Nuh dan pengikutnya yang beriman di atas bahtera."
    },
    "sejarahLengkap": "Setelah wafatnya generasi shalih pasca Nabi Idris, masyarakat mulai membuat patung orang-orang shalih (Wadd, Suwa', Yaghuts, Ya'uq, Nasr) untuk mengenang keshalihan mereka. Lambat laun, Iblis membisikkan agar patung-patung itu disembah dan dimintai pertolongan. Lahirlah kemusyrikan pertama di muka bumi. Allah Swt mengutus Nabi Nuh as untuk meluruskan akidah kaumnya dan mengingatkan akan datangnya hari pembalasan.\n\nNabi Nuh berdakwah tanpa kenal lelah selama 950 tahun. Beliau berdakwah secara sembunyi-sembunyi maupun terang-terangan, dengan kelembutan tutur kata dan argumentasi nalar. Namun para pemuka kaumnya justru mencibir: 'Engkau hanyalah manusia biasa seperti kami, dan kami lihat tidak ada yang mengikutimu selain orang-orang hina dina di antara kami.' Setiap generasi tua mendidik generasi mudanya untuk memusuhi Nuh.\n\nKetika Allah mewahyukan bahwa tidak akan ada lagi yang beriman kecuali segelintir orang yang telah percaya, Allah memerintahkan Nuh membuat kapal besar (safinah) di atas bukit kering yang jauh dari laut. Kaum kafir menertawakan dan mengejeknya: 'Dulu engkau mengaku nabi, sekarang engkau beralih profesi menjadi tukang kayu!' Nuh menjawab tenang: 'Jika kalian mengejek kami, sesungguhnya kami pun akan mengejek kalian karena kebodohan kalian.'\n\nSaat perintah Allah tiba, tanur (dapur tanah) memancarkan air deras dan pintu-pintu langit terbuka mencurahkan hujan lebat tak henti-henti. Nabi Nuh memuat kaum beriman dan sepasang hewan dari tiap jenis ke dalam kapal. Pemandangan memilukan terjadi ketika Nuh memanggil putranya Kan'an yang berenang menyelamatkan diri: 'Wahai anakku, naiklah bersama kami dan janganlah engkau bersama orang-orang kafir!' Kan'an menolak dan berkata akan berlindung ke puncak gunung, lalu gelombang raksasa menenggelamkannya. Kapal Nuh berlayar di atas ombak laksana gunung hingga akhirnya berlabuh dengan selamat di atas Gunung Judi.",
    "ringkasanKisah": "Rasul Ulul Azmi pertama yang berdakwah selama 950 tahun dengan kesabaran luar biasa menghadapi kaum penyembah berhala. Diperintahkan membangun bahtera raksasa di atas bukit, menyelamatkan orang-orang beriman dan pasangan binatang, sementara kaum kafir termasuk istri dan putranya Kan'an binasa ditenggelamkan banjir bandang.",
    "mukjizat": [
      "Mampu merancang dan membangun kapal raksasa kokoh bertingkat tiga di atas daratan bukit kering tandus berdasarkan bimbingan wahyu Allah",
      "Selamat dari banjir bandang dahsyat (thufan) yang menutupi puncak-puncak gunung tertinggi di bumi",
      "Mampu menghimpun dan menjinakkan aneka satwa berpasang-pasangan masuk ke dalam bahtera dengan damai",
      "Dikaruniai ketahanan fisik, mental, dan usia dakwah sangat panjang (950 tahun) dalam keteguhan tauhid"
    ],
    "ibrah": [
      "Kesabaran tanpa batas (Ulul Azmi): Jalan dakwah dan kebaikan membutuhkan nafas panjang, keteguhan hati, dan pantang putus asa",
      "Ikatan iman mengalahkan ikatan darah: Hubungan sejati di hadapan Allah dibangun atas dasar kesamaan akidah, bukan sekadar garis keturunan",
      "Ketaatan mutlak kepada petunjuk ilahi: Melaksanakan perintah Allah meskipun seringkali belum dipahami oleh logika dangkal manusia",
      "Doa orang tertindas: Ketika kesombongan orang zalim sudah melampaui batas, doa nabi yang tulus mengundang keadilan dan pertolongan Allah"
    ],
    "keteladanan": [
      "Sabar dan gigih dalam menyampaikan kebaikan kepada siapapun.",
      "Tidak patah semangat saat diejek atau diremehkan orang lain.",
      "Mengedepankan keimanan dan ketaatan di atas segala kepentingan pribadi.",
      "Menyayangi hewan dan menjaga kelestarian makhluk hidup."
    ],
    "dalilKunci": {
      "surah": "Hud",
      "ayat": "41",
      "arab": "وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ",
      "arti": "Dan Nuh berkata: 'Naiklah kamu sekalian ke dalamnya dengan menyebut nama Allah di waktu berlayar dan berlabuhnya.' Sesungguhnya Tuhanku benar-benar Maha Pengampun lagi Maha Penyayang."
    }
  },
  {
    "nomorUrut": 4,
    "nama": "Nabi Hud as",
    "namaArab": "هُودٌ عَلَيْهِ السَّلَام",
    "gelar": "Rasul Kaum 'Ad / Al-Muballighul Amin",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 2400 - 2300 SM (Pasca Generasi Nabi Nuh)",
    "tempatDakwah": "Wilayah Al-Ahqaf (Bukit-bukit pasir antara Yaman, Oman, dan Hadramaut)",
    "usia": "Sekitar 150 - 265 tahun",
    "sebutan": "Nabi pertama dari kalangan bangsa Arab asli ('Arab 'Aribah)",
    "ayatAlquran": "Q.S. Hud: 50-60, Q.S. Al-A'raf: 65-72, Q.S. Asy-Syu'ara: 123-140, Q.S. Al-Ahqaf: 21-26",
    "keluarga": {
      "ayahIbu": "Syalikh bin Arfakhsyad bin Sam bin Nuh as",
      "pasangan": "Wanita shalihah dari kalangan kaum beriman",
      "anakKeturunan": "Menurunkan bangsa Arab Qahthan dan Hadramaut",
      "tokohKeluargaTerkait": "Nabi Nuh as (kakek buyutnya)",
      "catatanKeluarga": "Berasal dari nasab keluarga bangsawan terhormat dan terpercaya di tengah suku 'Ad, dikenal santun, berbudi luhur, dan berwibawa."
    },
    "umat": {
      "namaKaum": "Kaum 'Ad pertama (pemilik bangunan megah berpilar tinggi: Iram Dzatil 'Imad)",
      "wilayah": "Al-Ahqaf (perbukitan pasir subur Yaman dan Oman)",
      "karakterKaum": "Memiliki fisik raksasa, tubuh sangat tinggi dan perkasa, arsitektur istana pilar megah tiada tanding, namun sangat takabur, bengis kepada kaum lemah, dan menyembah berhala Shamud dan Hada",
      "penolakanDanUjian": "Mendustakan Nabi Hud dengan sombong seraya menantang: 'Siapakah yang lebih besar kekuatannya daripada kami?' Mereka menuduh Hud terjangkit penyakit gila akibat kutukan berhala",
      "kesudahanKaum": "Ditiup angin topan es yang amat dingin, kering, dan membahana (rihin sharsharin 'atiyah) selama 7 malam 8 hari tanpa henti, mencabut manusia dan membalikkannya bagai tunggul-tunggul kurma yang tumbang membujur kaku."
    },
    "sejarahLengkap": "Kaum 'Ad dianugerahi Allah kenikmatan yang tiada tara: tanah perkebunan yang subur di tengah gurun, sumber air melimpah, istana megah berpilar tinggi (Iram Dzatil 'Imad), dan fisik tubuh yang kekar perkasa. Sayangnya, seluruh nikmat itu justru membuat mereka lupa diri. Mereka menindas suku-suku lain, berbuat zalim, dan menyembah berhala-berhala batu.\n\nAllah mengutus Nabi Hud as yang berasal dari kaum mereka sendiri. Dengan tutur kata yang santun, Hud menasihati: 'Wahai kaumku, sembahlah Allah, sekali-kali tidak ada Tuhan bagimu selain Dia. Ingatlah ketika Allah menjadikan kalian khalifah-khalifah sesudah kaum Nuh dan melebihkan kalian dalam kekuatan tubuh. Maka ingatlah nikmat-nikmat Allah agar kalian beruntung.' Beliau menegaskan bahwa ia tidak meminta upah sedikit pun atas dakwahnya, upahnya semata dari Allah.\n\nNamun pembesar kaum 'Ad membalas dengan keangkuhan: 'Engkau hanyalah orang bodoh dan pendusta. Apakah engkau datang hendak mengalihkan kami dari tuhan-tuhan nenek moyang kami? Datangkanlah azab yang engkau ancamkan jika engkau orang benar!'\n\nAllah kemudian menahan hujan hingga kaum 'Ad menderita kekeringan panjang. Ketika mereka melihat gumpalan awan hitam bergerak menuju lembah-lembah mereka, mereka bersorak gembira: 'Ini awan yang akan membawa hujan bagi kita!' Hud membalas: 'Bukan! Itu adalah azab yang kalian minta disegerakan, angin kencang yang membawa siksa pedih!' Angin topan dingin bertiup dahsyat selama 7 malam 8 hari berturut-turut, menyapu bersih seluruh kaum kafir dan bangunan mereka. Nabi Hud dan orang-orang beriman diselamatkan Allah dengan rahmat-Nya.",
    "ringkasanKisah": "Nabi Hud diutus kepada Kaum 'Ad yang berfisik perkasa dan bertubuh raksasa di perbukitan pasir Al-Ahqaf. Kaum 'Ad menyombongkan kekuatannya dan menyembah berhala, menolak nasihat Hud. Allah membinasakan mereka dengan badai angin dingin dahsyat selama 7 malam 8 hari, sementara Nabi Hud dan kaum mukmin diselamatkan.",
    "mukjizat": [
      "Selamat tanpa luka sedikit pun dari ancaman pembunuhan dan konspirasi pembesar Kaum 'Ad yang berfisik raksasa",
      "Mendapat perlindungan ilahi saat badai angin topan 'atiyah mengamuk memporak-porandakan seluruh negeri",
      "Mampu memprediksi datangnya azab dalam gumpalan awan yang dikira membawa hujan pembawa berkah oleh kaumnya",
      "Doa mendatangkan dan menahan hujan sebagai bukti kebenaran risalah tauhid"
    ],
    "ibrah": [
      "Bahaya kesombongan fisik dan teknologi: Kekuatan tubuh, arsitektur megah, dan kecanggihan materi tidak akan mampu menandingi kekuasaan Allah",
      "Mensyukuri nikmat: Kekayaan dan kemakmuran hendaknya melahirkan kerendahan hati dan kepedulian sosial, bukan kezaliman",
      "Ketulusan ikhlas dalam berbuat baik: Nabi Hud mengajarkan berdakwah tanpa pamrih imbalan duniawi",
      "Keadilan hukum ilahi: Bangsa yang tiran dan bengis pada akhirnya akan dihancurkan oleh kezalimannya sendiri"
    ],
    "keteladanan": [
      "Tidak menyombongkan kekuatan fisik, kepintaran, atau harta benda.",
      "Selalu bersyukur atas nikmat kesehatan dan rezeki yang diterima.",
      "Berbicara dengan sopan dan santun saat menasihati sesama teman.",
      "Ikhlas menolong sesama tanpa mengharapkan pujian manusia."
    ],
    "dalilKunci": {
      "surah": "Hud",
      "ayat": "52",
      "arab": "وَيَا قَوْمِ اسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا وَيَزِدْكُمْ قُوَّةً إِلَىٰ قُوَّتِكُمْ",
      "arti": "Dan (Hud berkata): 'Hai kaumku, mohonlah ampun kepada Tuhanmu lalu bertobatlah kepada-Nya, niscaya Dia menurunkan hujan yang sangat lebat atasmu dan menambahkan kekuatan kepada kekuatanmu'."
    }
  },
  {
    "nomorUrut": 5,
    "nama": "Nabi Saleh as",
    "namaArab": "صَالِحٌ عَلَيْهِ السَّلَام",
    "gelar": "Nabiyullah Kaum Tsamud / Shahibun Naqah",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 2100 - 2000 SM (Generasi Kaum Tsamud)",
    "tempatDakwah": "Wilayah Al-Hijr (Mada'in Saleh, antara Hijaz dan Tabuk, barat laut Arab)",
    "usia": "Sekitar 150 - 200 tahun",
    "sebutan": "Nabi dengan mukjizat unta betina bunting dari batu cadas",
    "ayatAlquran": "Q.S. Hud: 61-68, Q.S. Al-A'raf: 73-79, Q.S. Asy-Syu'ara: 141-159, Q.S. Al-Qamar: 23-32, Q.S. Asy-Syams: 11-15",
    "keluarga": {
      "ayahIbu": "Ubaid bin Masih bin Ubaid bin Hadzir bin Sam bin Nuh as",
      "pasangan": "Wanita shalihah dari kalangan pengikutnya",
      "anakKeturunan": "Menurunkan generasi muslim yang kelak hijrah ke Palestina dan Syam",
      "tokohKeluargaTerkait": "Berasal dari suku Tsamud kabilah paling terhormat yang sebelum kenabiannya dipersiapkan menjadi calon pemimpin suku",
      "catatanKeluarga": "Dikenal sejak belia sebagai pemuda yang paling cerdas, jujur, dan berakhlak mulia di mata seluruh warga Tsamud."
    },
    "umat": {
      "namaKaum": "Kaum Tsamud (arsitek pemahat gunung batu menjadi istana megah)",
      "wilayah": "Kawasan Al-Hijr / Mada'in Saleh (kini situs warisan di Arab Saudi)",
      "karakterKaum": "Mahir luar biasa memahat bukit-bukit batu cadas menjadi tempat tinggal musim dingin dan musim panas yang kokoh dan artistik, namun menyembah patung berhala dan dipimpin oleh 9 komplotan perusak moral (tis'atu rahthin yufsiduna fil ardh)",
      "penolakanDanUjian": "Menantang mukjizat mustahil: meminta batu karang cadas terbelah dan mengeluarkan unta betina besar yang sedang bunting tua. Setelah mukjizat terjadi, 9 perusak dipimpin Qudar bin Salif justru menyembelih unta tersebut",
      "kesudahanKaum": "Diguncang gempa bumi dahsyat yang meluluhlantakkan tanah dan diterpa suara petir halilintar menggelegar dahsyat (ash-shaihah) yang memecahkan jantung mereka seketika di dalam rumah-rumah mereka."
    },
    "sejarahLengkap": "Setelah Kaum 'Ad binasa, kaum Tsamud mewarisi peradaban mereka. Tsamud dikaruniai keahlian teknik sipil dan seni arsitektur yang mencengangkan: mereka memahat dinding-dinding gunung batu cadas menjadi rumah-rumah dan istana megah yang aman dari terpaan badai. Sayangnya, mereka hidup bermewah-mewah, berbuat maksiat, menyembah berhala, dan menindas rakyat kecil.\n\nNabi Saleh as diutus menyeru kaumnya kembali kepada tauhid. Para pemuka Tsamud mencibir: 'Wahai Saleh, sesungguhnya sebelum ini engkau adalah orang yang kami harapkan menjadi pemimpin kami. Mengapa engkau melarang kami menyembah apa yang disembah nenek moyang kami?' Mereka kemudian menantang Saleh untuk membuktikan kenabiannya dengan syarat mustahil: mengeluarkan seekor unta betina bunting sepuluh bulan dari bongkahan batu cadas besar bernama Al-Katibah.\n\nNabi Saleh shalat memohon kepada Allah. Atas izin Allah, batu cadas itu bergetar hebat, terbelah, dan melahirkan seekor unta betina raksasa yang sangat elok. Saleh memberi peringatan tegas: 'Inilah unta betina mukjizat Allah bagi kalian. Biarkan ia makan di bumi Allah dan jangan sentuh dengan kejahatan sedikit pun! Ada giliran minum baginya satu hari, dan giliran minum bagi kalian di hari berikutnya.' Air susu unta ini bahkan dapat diperah dan mencukupi kebutuhan seluruh penduduk kota.\n\nNamun komplotan sembilan penjahat yang dipimpin oleh Qudar bin Salif tidak senang. Di bawah pengaruh minuman keras dan hasutan wanita kafir, mereka menghadang unta itu dan menyembelihnya dengan kejam, lalu menantang Saleh mendatangkan azab. Saleh berkata sedih: 'Bersenang-senanglah kalian di rumah kalian selama tiga hari. Itu janji yang tidak dapat didustakan.' Di hari pertama wajah mereka menguning, hari kedua memerah, hari ketiga menghitam. Pada pagi hari keempat, suara petir halilintar yang memekakkan telinga meremukkan organ dalam mereka dan gempa bumi membalikkan rumah mereka. Nabi Saleh dan orang beriman diselamatkan Allah.",
    "ringkasanKisah": "Nabi Saleh diutus kepada Kaum Tsamud yang pandai memahat gunung batu menjadi istana. Beliau diberi mukjizat berupa unta betina bunting yang keluar dari batu cadas. Kaum Tsamud melanggar perjanjian dengan menyembelih unta mukjizat tersebut, hingga Allah membinasakan mereka dengan suara petir menggelegar dan gempa bumi dahsyat.",
    "mukjizat": [
      "Mengeluarkan seekor unta betina raksasa yang sedang bunting tua langsung dari rekahan batu karang cadas yang padat",
      "Air susu unta mukjizat yang melimpah ruah mampu mencukupi kebutuhan minum seluruh penduduk negeri",
      "Mendapat kabar ghaib tentang waktu pasti turunnya azab (tiga hari bertahap dengan perubahan warna wajah)",
      "Selamat dari rencana konspirasi pembunuhan malam hari yang dirancang sembilan gembong perusak kota"
    ],
    "ibrah": [
      "Menghormati hak makhluk hidup: Larangan keras menyiksa binatang dan mengeksploitasi alam melampaui batas kewajaran",
      "Bahaya komplotan kriminal: Kerusakan suatu bangsa seringkali berawal dari segelintir elite jahat yang dibiarkan bertindak leluasa tanpa dicegah",
      "Menepati komitmen dan janji: Mengkhianati perjanjian moral dan hukum membawa malapetaka sosial yang menghancurkan",
      "Ketakwaan adalah benteng hakiki: Rumah megah yang dipahat di batu cadas tidak mampu melindungi pemiliknya dari murka Allah"
    ],
    "keteladanan": [
      "Menyayangi hewan dan tidak menyiksanya semena-mena.",
      "Berani menolak ajakan teman untuk berbuat curang atau merusak fasilitas umum.",
      "Menepati janji dan kesepakatan bersama dengan penuh integritas.",
      "Tenang dan sabar dalam menghadapi tekanan serta fitnah."
    ],
    "dalilKunci": {
      "surah": "Al-A'raf",
      "ayat": "73",
      "arab": "قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ قَدْ جَاءَتْكُم بَيِّنَةٌ مِّن رَّبِّكُمْ ۖ هَٰذِهِ نَاقَةُ اللَّهِ لَكُمْ آيَةً",
      "arti": "Saleh berkata: 'Hai kaumku, sembahlah Allah, sekali-kali tidak ada Tuhan bagimu selain-Nya. Sesungguhnya telah datang kepadamu bukti yang nyata dari Tuhanmu. Unta betina Allah ini menjadi tanda bagimu'."
    }
  },
  {
    "nomorUrut": 6,
    "nama": "Nabi Ibrahim as",
    "namaArab": "إِبْرَاهِيمُ عَلَيْهِ السَّلَام",
    "gelar": "Khalilullah (Kekasih Allah) / Abul Anbiya' (Bapak Para Nabi) / Imamal Li-nnas / Rasul Ulul Azmi",
    "isUlulAzmi": true,
    "periodeKaum": "Sekitar 1996 - 1821 SM (Era Kerajaan Babilonia & Raja Namrud)",
    "tempatDakwah": "Ur (Babilonia/Irak), Harran, Kan'an (Palestina), Mesir, dan Makkah Al-Mukarramah",
    "usia": "Sekitar 175 - 200 tahun",
    "sebutan": "Peletak pondasi Millah Ibrahim (Tauhid Murni) dan Pembangun Ka'bah",
    "ayatAlquran": "Q.S. Al-Baqarah: 124-132, Q.S. Al-An'am: 74-83, Q.S. Al-Anbiya: 51-73, Q.S. As-Saffat: 83-113, Q.S. Ibrahim: 35-41",
    "keluarga": {
      "ayahIbu": "Tarikh (dikenal bergelar Azar, pengukir dan pedagang berhala di istana Babilonia)",
      "pasangan": "Siti Sarah (ibu Nabi Ishaq as) dan Siti Hajar (ibu Nabi Ismail as)",
      "anakKeturunan": "Dua putra agung pembawa garis kenabian: Nabi Ismail as (leluhur bangsa Arab dan Nabi Muhammad SAW) serta Nabi Ishaq as (leluhur nabi-nabi Bani Israil)",
      "tokohKeluargaTerkait": "Nabi Luth as (keponakannya yang beriman sejak awal perjuangan dakwahnya)",
      "catatanKeluarga": "Keluarga teladan peradaban sepanjang zaman. Ujian qurban Ismail, penempatan Hajar di lembah tandus Mekkah, dan keikhlasan Sarah melahirkan syariat haji, qurban, dan tahallul."
    },
    "umat": {
      "namaKaum": "Masyarakat Babilonia & Raja Namrud bin Kan'an (penyembah bintang, tata surya, dan patung berhala)",
      "wilayah": "Ur / Mesopotamia (Irak), lalu Syam (Palestina) dan Hijaz (Makkah)",
      "karakterKaum": "Penyembah benda langit dan dewa-dewa buatan, dipimpin raja tiran arogan Namrud yang mendaku dirinya sebagai tuhan yang berkuasa menghidupkan dan mematikan",
      "penolakanDanUjian": "Ibrahim menghancurkan berhala-berhala kota saat festival lalu mengalungkan kapak ke leher patung terbesar. Atas perintah Namrud, Ibrahim dilemparkan ke tengah kobaran api unggun raksasa yang menyala-nyala",
      "kesudahanKaum": "Raja Namrud dihancurkan Allah dengan tentara nyamuk kecil yang masuk ke rongga kepalanya hingga tewas tersiksa, dan kerajaan Babilonia runtuh."
    },
    "sejarahLengkap": "Nabi Ibrahim as tumbuh di tengah peradaban Babilonia yang pekat dengan kemusyrikan. Sejak belia, fitrah kecerdasannya mencari hakikat Tuhan Yang Maha Esa. Beliau mengamati bintang, bulan, dan matahari, namun menolak menuhankannya karena semuanya tenggelam dan sirna. Beliau berkesimpulan tegas: 'Sesungguhnya aku menghadapkan wajahku kepada Tuhan yang menciptakan langit dan bumi dengan cenderung kepada kebenaran, dan aku bukanlah termasuk orang-orang yang mempersekutukan Allah.'\n\nNabi Ibrahim berdakwah kepada ayahnya, Azar, dengan panggilan penuh santun: 'Ya Abati' (Wahai ayahandaku tercinta). Namun ayahnya menolak dan mengancam akan merajamnya. Suatu ketika saat penduduk kota pergi merayakan festival, Ibrahim memasuki kuil pemujaan dan menghancurkan seluruh berhala dengan kapak, menyisakan berhala terbesar dengan kapak tergantung di lehernya. Saat disidang, Ibrahim membalik logika mereka: 'Tanyakanlah kepada patung besar itu jika mereka dapat berbicara!' Terpojok oleh logika akal sehat, Namrud dan para pembesar memutuskan membakar Ibrahim hidup-hidup.\n\nKayu bakar dikumpulkan berminggu-minggu hingga apinya membubung tinggi membakar burung di udara. Ibrahim diikat dan dilontarkan ke kobaran api menggunakan manjanik (ketapel raksasa). Di saat gentar, Malaikat Jibril menawarkan bantuan, namun Ibrahim menjawab dengan tawakal paripurna: 'Hasbunallahu wa ni'mal wakil' (Cukuplah Allah menjadi Penolong kami). Allah berfirman: 'Wahai api, jadilah dingin dan penyelamat bagi Ibrahim!' Api hanya membakar tali pengikatnya dan Ibrahim keluar tanpa cacat sedikit pun.\n\nUjian kepatuhan Ibrahim terus berlanjut hingga masa tuanya: diperintahkan menempatkan Siti Hajar dan bayinya Ismail di lembah tandus Makkah, diperintahkan menyembelih Ismail yang kemudian ditebus dengan sembelihan domba besar dari surga, hingga bersama Ismail meninggikan pondasi Baitullah Ka'bah sebagai kiblat persatuan umat beriman.",
    "ringkasanKisah": "Bapak para nabi (Abul Anbiya) dan Rasul Ulul Azmi yang meruntuhkan kemusyrikan Babilonia dengan argumen nalar tajam. Dilempar ke dalam kobaran api unggun raksasa Namrud namun diselamatkan Allah karena api menjadi dingin. Bersama Ismail membangun Ka'bah dan mengikhlaskan qurban yang menjadi syariat Idul Adha.",
    "mukjizat": [
      "Tubuh tidak terbakar sedikit pun saat dilemparkan ke tengah kobaran api unggun raksasa Namrud (api menjadi dingin dan damai)",
      "Menghidupkan kembali empat ekor burung yang dicincang dan diletakkan di puncak empat gunung terpisah untuk memperteguh keyakinan tentang hari kebangkitan",
      "Mengeluarkan mata air Zamzam di lembah tandus Makkah atas doa dan ikhtiarnya bersama Hajar dan Ismail",
      "Membangun dan meletakkan pondasi Ka'bah (Maqam Ibrahim berupa batu pijakan yang melunak dan mencetak jejak kakinya)",
      "Doanya yang dikabulkan sepanjang masa menjadikan Makkah kota berkah aman sentosa dan melahirkan Nabi Muhammad SAW"
    ],
    "ibrah": [
      "Tauhid murni tanpa kompromi: Menolak segala bentuk penghambaan materi dan kemusyrikan dengan nalar kritis dan keberanian moral",
      "Tawakal total kepada Allah: Kepasrahan hakiki seorang hamba saat berada di puncak ujian mendatangkan pertolongan mukjizat ilahi",
      "Keteladanan pendidikan keluarga: Menjadikan rumah tangga sebagai madrasah akidah yang melahirkan generasi anak-anak shalih",
      "Keikhlasan berkorban: Mengorbankan apa yang paling dicintai demi menjalankan syariat Allah mendatangkan kemuliaan derajat"
    ],
    "keteladanan": [
      "Berpikir kritis dalam mencari kebenaran dan teguh membela kebenaran.",
      "Berbicara lemah lembut dan santun kepada orang tua meskipun berbeda pendapat.",
      "Ikhlas berkorban dan mendahulukan perintah Allah dalam kehidupan.",
      "Senantiasa mendoakan kebaikan bagi keturunan dan keluarga."
    ],
    "dalilKunci": {
      "surah": "Al-Anbiya",
      "ayat": "69",
      "arab": "قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ",
      "arti": "Kami berfirman: 'Hai api menjadi dinginlah, dan menjadi keselamatanlah bagi Ibrahim!'."
    }
  },
  {
    "nomorUrut": 7,
    "nama": "Nabi Luth as",
    "namaArab": "لُوطٌ عَلَيْهِ السَّلَام",
    "gelar": "Rasul Kaum Sodom / Al-Muhajir ilallah",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1950 - 1870 SM (Sezaman dengan Nabi Ibrahim as)",
    "tempatDakwah": "Kota Sodom, Gomorrah, dan wilayah Sadum (sekitar Laut Mati / Yordania)",
    "usia": "Sekitar 175 tahun",
    "sebutan": "Pejuang kesucian moral dan penentang penyimpangan seksual fitrah manusia",
    "ayatAlquran": "Q.S. Hud: 77-83, Q.S. Al-Hijr: 57-77, Q.S. Asy-Syu'ara: 160-175, Q.S. Al-Ankabut: 28-35",
    "keluarga": {
      "ayahIbu": "Haran bin Tarikh (Luth adalah keponakan kandung dari Nabi Ibrahim as)",
      "pasangan": "Wali'ah (istri yang durhaka, membocorkan rahasia dakwah kepada kaum homoseksual Sodom dan turut binasa)",
      "anakKeturunan": "Dua putri shalihah yang beriman dan taat (Ra'tsa dan Za'rura)",
      "tokohKeluargaTerkait": "Nabi Ibrahim as (paman sekaligus guru dan pendukung perjuangannya)",
      "catatanKeluarga": "Istri Nabi Luth menjadi contoh abadi dalam Al-Qur'an tentang pengkhianatan akidah di balik kedekatan fisik rumah tangga seorang nabi."
    },
    "umat": {
      "namaKaum": "Penduduk Negeri Sodom, Gomorrah, dan Amorah (Sadum)",
      "wilayah": "Kawasan Laut Mati / Danau Luth (antara Yordania dan Palestina)",
      "karakterKaum": "Melakukan perbuatan keji (fahisyah) yang belum pernah dilakukan oleh manusia sebelumnya: melampiaskan syahwat kepada sesama jenis (homoseksual/LGBT), membegal musafir, dan berbuat nista secara terang-terangan di tempat umum",
      "penolakanDanUjian": "Mengancam mengusir Nabi Luth dan keluarganya dengan dalih sok suci: 'Usirlah mereka dari negerimu, sesungguhnya mereka adalah orang-orang yang sok bersih!' Ketika malaikat bertamu dalam rupa pemuda tampan, kaum Sodom mengepung rumah Luth untuk menodai tamu tersebut",
      "kesudahanKaum": "Dihantam suara gemuruh petir fajar, negerinya diangkat lalu dijungkirbalikkan oleh Malaikat Jibril (ja'alna 'aliyaha safilaha), lalu dihujani batu belerang panas yang bertubi-tubi bertanda dari Tuhan."
    },
    "sejarahLengkap": "Nabi Luth as beriman kepada Nabi Ibrahim as dan menyertai pamannya berhijrah dari Babilonia ke Syam dan Mesir. Beliau kemudian diutus Allah menjadi rasul untuk penduduk negeri Sodom di tepi Laut Mati. Masyarakat Sodom telah kehilangan kompas moral kemanusiaan: mereka mempraktikkan homoseksualitas secara terang-terangan, merampok pedagang yang lewat, dan mempermainkan kehormatan manusia di balai-balai pertemuan mereka.\n\nNabi Luth berseru dengan penuh iba: 'Mengapa kalian mendatangi jenis lelaki di antara manusia dan kalian tinggalkan istri-istri yang dijadikan Tuhanmu untukmu? Bahkan kalian adalah kaum yang melampaui batas!' Namun masyarakat Sodom yang bebal menjawab dengan cemooh dan mengancam akan merajam dan mengusirnya.\n\nAllah kemudian mengutus malaikat-malaikat mulia (termasuk Jibril) dalam rupa pemuda-pemuda yang sangat tampan. Mereka singgah di rumah Nabi Luth. Istri Luth yang berkhianat menyelinap keluar dan memberitahu kaum Sodom bahwa di rumahnya ada tamu-tamu rupawan. Seketika gerombolan kaum Sodom datang berbondong-bondong mengepung rumah Luth dan mendobrak pintu.\n\nNabi Luth merasa sesak dada dan menawarkan jalan halal: 'Wahai kaumku, inilah putri-putri negeriku (menikahlah secara sah), mereka lebih suci bagi kalian. Bertakwalah kepada Allah dan jangan hinakan aku di depan tamuku!' Mereka menolak mentah-mentah. Para malaikat lalu menenangkan Luth dan membutakan mata orang-orang kafir yang hendak mendobrak. Para malaikat memerintahkan Luth dan putrinya keluar dari kota di waktu malam sebelum subuh, serta melarang mereka menoleh ke belakang. Di waktu subuh menjelang, azab dahsyat menimpa: tanah Sodom dijungkirbalikkan dan dihujani batu sijjil hingga musnah tak bersisa.",
    "ringkasanKisah": "Nabi Luth diutus kepada kaum Sodom yang memiliki penyimpangan seksual homoseksual dan gemar merampok musafir. Nabi Luth berdakwah menjaga kesucian fitrah pernikahan, namun ditentang keras bahkan istrinya sendiri berkhianat. Allah membalikkan tanah Sodom dan menghujani mereka dengan batu sijjil hingga binasa.",
    "mukjizat": [
      "Selamat dari kepungan massa brutal kaum Sodom berkat kebutaan mendadak yang menimpa mata para penyerang",
      "Mendapat perlindungan langsung dari pasukan Malaikat Jibril, Mikail, dan Israfil",
      "Diselamatkan Allah keluar dari kota Sodom sebelum fajar azab membalikkan seluruh daratan negeri",
      "Kisah kehancuran negerinya diabadikan menjadi laut mati bergaram tinggi sebagai tanda kekuasaan Allah"
    ],
    "ibrah": [
      "Menjaga fitrah kemanusiaan: Penyimpangan seksual dan dekadensi moral bertentangan dengan fitrah dan menghancurkan tatanan peradaban",
      "Menjaga kesucian pernikahan sah: Islam mengatur institusi keluarga yang mulia antara pria dan wanita demi kelangsungan generasi yang beradab",
      "Pentingnya memilih pasangan seakidah: Istri yang berkhianat tidak akan diselamatkan oleh kemuliaan suaminya yang seorang nabi",
      "Ketegasan menolak normalisasi maksiat: Kejahatan moral tidak boleh dianggap lumrah atau dibela atas nama kebebasan semu"
    ],
    "keteladanan": [
      "Menjaga pergaulan sehat dan menjauhi pornografi serta perbuatan keji.",
      "Berani menolak tren buruk dan perilaku menyimpang di lingkungan pertemanan.",
      "Melindungi tamu dan menghormati hak orang yang berkunjung ke rumah.",
      "Setia kepada kebenaran meskipun berada di tengah mayoritas yang salah."
    ],
    "dalilKunci": {
      "surah": "Hud",
      "ayat": "82",
      "arab": "فَلَمَّا جَاءَ أَمْرُنَا جَعَلْنَا عَالِيَهَا سَافِلَهَا وَأَمْطَرْنَا عَلَيْهَا حِجَارَةً مِّن سِجِّيلٍ مَّنضُودٍ",
      "arti": "Maka tatkala datang azab Kami, Kami jadikan negeri kaum Luth itu yang di atas ke bawah (Kami balikkan), dan Kami hujani mereka dengan batu dari tanah yang terbakar dengan bertubi-tubi."
    }
  },
  {
    "nomorUrut": 8,
    "nama": "Nabi Ismail as",
    "namaArab": "إِسْمَاعِيلُ عَلَيْهِ السَّلَام",
    "gelar": "Adz-Dzabih (Hamba yang Bersedia Dikorbankan) / Shadiqul Wa'di",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1900 - 1763 SM (Era Awal Pembangunan Makkah)",
    "tempatDakwah": "Makkah Al-Mukarramah dan sekitarnya (Hijaz)",
    "usia": "Sekitar 137 tahun",
    "sebutan": "Leluhur Bangsa Arab 'Adnaniyah dan Rasulullah Muhammad SAW",
    "ayatAlquran": "Q.S. As-Saffat: 100-111, Q.S. Maryam: 54-55, Q.S. Al-Baqarah: 125-129, Q.S. Al-Anbiya: 85-86",
    "keluarga": {
      "ayahIbu": "Nabi Ibrahim as dan Siti Hajar (wanita mulia nan shalihah)",
      "pasangan": "Halah binti Auf bin Muhallim (istri kedua dari suku Jurhum yang shalihah dan ramah, menggantikan istri pertama yang suka mengeluh)",
      "anakKeturunan": "Dikaruniai 12 putra bangsawan (di antaranya Nabit dan Qaidar yang menjadi leluhur suku Quraisy dan Nabi Muhammad SAW)",
      "tokohKeluargaTerkait": "Nabi Ishaq as (adik seayah) dan Nabi Ibrahim as (ayahandanya tercinta)",
      "catatanKeluarga": "Keteladanan kepatuhan anak kepada orang tua (birrul walidain) paling agung dalam sejarah umat manusia."
    },
    "umat": {
      "namaKaum": "Kabilah Jurhum dari Yaman dan suku-suku pengembara Jazirah Arab",
      "wilayah": "Lembah Bakkah / Makkah Al-Mukarramah",
      "karakterKaum": "Masyarakat kabilah nomaden yang kemudian menetap di Makkah setelah ditemukannya sumur Zamzam; belajar bahasa Arab fushah dan ajaran tauhid dari Ismail",
      "penolakanDanUjian": "Ujian terberat berupa perintah Allah kepada ayahnya untuk menyembelihnya, serta ujian kehausan di padang pasir saat masih bayi",
      "kesudahanKaum": "Masyarakat Jurhum hidup damai, beriman dan memakmurkan Baitullah Ka'bah di bawah bimbingan Nabi Ismail as."
    },
    "sejarahLengkap": "Nabi Ismail as lahir dari Siti Hajar ketika Nabi Ibrahim telah berusia lanjut dan sangat merindukan kehadiran keturunan shalih. Tak lama setelah kelahirannya, Allah menguji keimanan Ibrahim dengan memerintahkannya membawa Hajar dan bayi Ismail ke lembah tandus Makkah yang tak berpenghuni dan tiada sumber air. Ketika Ibrahim hendak kembali ke Palestina, Hajar bertanya dengan tawakal: 'Apakah Allah yang memerintahkanmu berbuat ini?' Ibrahim menjawab: 'Benar.' Hajar berkata tenang: 'Jika demikian, Allah tidak akan menyia-nyiakan kami.'\n\nKetika bekal air habis dan bayi Ismail menangis kehausan, Hajar berlari-lari kecil antara bukit Shafa dan Marwah sebanyak tujuh kali mencari pertolongan (yang diabadikan menjadi rukun Sa'i). Saat kembali kepada bayinya, Malaikat Jibril mengepakkan sayapnya (atau hentakan tumit mungil Ismail) ke tanah dan memancarlah air Zamzam yang berkah melimpah ruah hingga kini. Kafilah suku Jurhum yang melintas melihat burung-burung berputar di udara lalu meminta izin menetap di sekitar sumur Zamzam.\n\nIsmail tumbuh menjadi pemuda yang santun, tangkas, dan fasih berbahasa Arab. Ketika beranjak remaja, Nabi Ibrahim bermimpi diperintahkan Allah untuk menyembelih putranya. Ibrahim bermusyawarah kepada Ismail: 'Wahai anakku, sesungguhnya aku melihat dalam mimpi bahwa aku menyembelihmu, maka pikirkanlah apa pendapatmu!' Tanpa ragu sedikit pun Ismail menjawab: 'Wahai ayahku, laksanakanlah apa yang diperintahkan kepadamu; insya Allah engkau akan mendapatiku termasuk orang-orang yang sabar.'\n\nDi Mina, saat keduanya telah berserah diri dan pisau tajam hendak digerakkan di leher Ismail, Allah berseru memanggil Ibrahim bahwa mimpinya telah dibenarkan. Pisau tidak dapat melukai leher Ismail dan Allah menebusnya dengan seekor domba besar dari surga. Peristiwa ini melahirkan syariat Hari Raya Idul Adha. Setelah dewasa, Ismail bersama ayahnya meninggikan pondasi Ka'bah dan berdoa memohon lahirnya rasul penutup dari anak keturunannya.",
    "ringkasanKisah": "Putra sulung Nabi Ibrahim dan Siti Hajar yang tumbuh di lembah Makkah. Menjadi asbab memancarnya mata air Zamzam lewat ibunya di Shafa dan Marwah. Menunjukkan ketaatan mutlak saat bersedia disembelih oleh ayahnya demi perintah Allah hingga diganti domba surga, serta bersama ayahnya mendirikan Ka'bah.",
    "mukjizat": [
      "Hentakan kakinya saat bayi memancarkan mata air Zamzam yang tidak pernah kering selama ribuan tahun",
      "Selamat dari pisau sembelihan yang tajam karena keikhlasan total menjalankan perintah Allah (diganti domba kibasy surga)",
      "Bersama ayahnya meninggikan pondasi Ka'bah dan meletakkan Hajar Aswad di sudut Ka'bah",
      "Menjadi leluhur utama dari garis keturunan agung Nabi Muhammad SAW"
    ],
    "ibrah": [
      "Bakti paripurna kepada orang tua (birrul walidain): Mendengarkan nasihat dan siap berkorban demi kehormatan dan ketaatan keluarga",
      "Keikhlasan menjalankan syariat: Ketundukan hati melahirkan jalan keluar dan pertolongan tak terduga dari Allah",
      "Menepati janji (shadiqul wa'di): Menjaga integritas perkataan dan komitmen moral dalam pergaulan sehari-hari",
      "Pentingnya memilih pasangan hidup: Nasihat Ibrahim kepada Ismail untuk mengganti tiang pintu rumah (memilih istri yang bersyukur dan tidak banyak mengeluh)"
    ],
    "keteladanan": [
      "Sangat berbakti, patuh, dan hormat kepada kedua orang tua.",
      "Ikhlas berkorban dan mendahulukan ketaatan kepada Allah Swt.",
      "Selalu menepati janji dan jujur dalam setiap perkataan.",
      "Pandai bersyukur dan tidak mengeluh saat menghadapi kesusahan hidup."
    ],
    "dalilKunci": {
      "surah": "Maryam",
      "ayat": "54",
      "arab": "وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ ۚ إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَّبِيًّا",
      "arti": "Dan ceritakanlah (hai Muhammad kepada mereka) kisah Ismail di dalam Al-Qur'an. Sesungguhnya ia adalah seorang yang benar janjinya, dan dia adalah seorang rasul dan nabi."
    }
  },
  {
    "nomorUrut": 9,
    "nama": "Nabi Ishaq as",
    "namaArab": "إِسْحَاقُ عَلَيْهِ السَّلَام",
    "gelar": "Al-Basyir / Nabi yang Shalih / Ghulamin 'Alim",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1896 - 1716 SM (Era Kerajaan Kan'an)",
    "tempatDakwah": "Wilayah Kan'an (Palestina) dan Al-Khalil (Hebron)",
    "usia": "Sekitar 180 tahun",
    "sebutan": "Leluhur para Nabi dan Rasul Bani Israil",
    "ayatAlquran": "Q.S. Maryam: 49-50, Q.S. As-Saffat: 112-113, Q.S. Hud: 71-73, Q.S. Al-Anbiya: 72-73",
    "keluarga": {
      "ayahIbu": "Nabi Ibrahim as dan Siti Sarah (yang dikaruniai anak di usia senja sekitar 90 tahun)",
      "pasangan": "Ribka (Rifqa) binti Betuel (wanita bangsawan yang shalihah dan bijak)",
      "anakKeturunan": "Dikaruniai putra kembar: 'Aish (Esau, leluhur bangsa Romawi) dan Nabi Ya'qub as (Israil, leluhur nabi-nabi Bani Israil)",
      "tokohKeluargaTerkait": "Nabi Ismail as (kakak seayah) dan Nabi Ibrahim as (ayah)",
      "catatanKeluarga": "Kelahirannya diwartakan langsung oleh para malaikat pembawa kabar gembira kepada Sarah yang mandul dan Ibrahim yang berusia 100 tahun."
    },
    "umat": {
      "namaKaum": "Masyarakat Kan'an di Palestina",
      "wilayah": "Syam / Kan'an (Al-Khalil / Hebron)",
      "karakterKaum": "Masyarakat pedesaan dan kota di Kan'an yang memiliki beragam aliran kepercayaan animisme dan politeisme lokal",
      "penolakanDanUjian": "Ujian kesabaran menghadapi gesekan lokal antar kabilah dan menjaga kemurnian tauhid warisan ayahnya",
      "kesudahanKaum": "Banyak yang menerima ajaran tauhid dan hidup damai di bawah keteladanan akhlak dan keadilan hukum Nabi Ishaq as."
    },
    "sejarahLengkap": "Nabi Ishaq as lahir sebagai mukjizat dan hadiah dari Allah atas kesabaran panjang Nabi Ibrahim as dan Siti Sarah. Para malaikat yang diutus menghancurkan kaum Luth terlebih dahulu singgah di kediaman Ibrahim untuk menyampaikan kabar gembira: bahwa Sarah yang mandul dan telah berusia 90 tahun akan melahirkan seorang anak laki-laki yang berilmu (ghulam 'alim) bernama Ishaq, dan sesudah Ishaq akan lahir Ya'qub.\n\nSarah sempat terkejut seraya tertawa keheranan: 'Sungguh mengherankan, apakah aku akan melahirkan anak padahal aku sudah tua renta dan suamiku pun telah lanjut usia?' Para malaikat menjawab: 'Apakah engkau merasa heran dengan ketetapan Allah? Rahmat Allah dan berkah-Nya tercurah atas kamu sekalian wahai ahlul bait! Sesungguhnya Allah Maha Terpuji lagi Maha Mulia.'\n\nNabi Ishaq tumbuh menjadi sosok yang tenang, lemah lembut, penuh hikmah, dan sangat berilmu. Beliau mewarisi kepemimpinan spiritual ayahnya di wilayah Kan'an (Palestina). Beliau berdakwah mengajak kaum Kan'an menjauhi penyembahan berhala dan menegakkan shalat, zakat, serta silaturahmi. Menikah dengan Ribka (Rifqa), beliau dikaruniai anak kembar yaitu 'Aish dan Ya'qub. Dari jalur Nabi Ishaq inilah kemudian lahir nabi-nabi besar seperti Ya'qub, Yusuf, Musa, Harun, Daud, Sulaiman, Zakaria, Yahya, hingga Isa as.",
    "ringkasanKisah": "Putra kedua Nabi Ibrahim dari Siti Sarah yang kelahirannya dikabarkan langsung oleh malaikat sebagai kabar gembira di usia senja kedua orang tuanya. Dikenal berilmu tinggi, lemah lembut, dan bijaksana. Membimbing kaum Kan'an dalam tauhid dan menurunkan garis kenabian Bani Israil melalui putranya Nabi Ya'qub as.",
    "mukjizat": [
      "Kelahirannya merupakan mukjizat kabar gembira malaikat kepada seorang ibu yang mandul di usia 90 tahun dan ayah berusia 100 tahun",
      "Doa-doanya mustajab menyembuhkan dan mendatangkan keberkahan tanah perkebunan di Kan'an",
      "Dikaruniai ilmu hikmah kenabian dan ketajaman wawasan (ghulamin 'alim)",
      "Menjadi mata rantai leluhur utama nabi-nabi agung Bani Israil"
    ],
    "ibrah": [
      "Kuasa mutlak Allah melampaui hukum biologis: Jangan pernah berputus asa dari rahmat dan keajaiban doa kepada Allah",
      "Keberkahan rumah tangga shalih: Doa tulus orang tua melahirkan keturunan yang melanjutkan estafet risalah kebajikan",
      "Dakwah dengan kelembutan dan kebijaksanaan: Menghadapi masyarakat majemuk dengan akhlak mulia dan ketenangan sikap",
      "Menjaga kerukunan persaudaraan anak-cucu agar senantiasa berpegang pada jalan tauhid"
    ],
    "keteladanan": [
      "Berbakti kepada orang tua dan menjaga nama baik keluarga.",
      "Bersikap lemah lembut dan sabar dalam menghadapi teman yang berbeda pendapat.",
      "Tekun menuntut ilmu dan mengamalkannya dengan bijak.",
      "Optimis dan tidak mudah berputus asa saat berdoa."
    ],
    "dalilKunci": {
      "surah": "As-Saffat",
      "ayat": "112",
      "arab": "وَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِّنَ الصَّالِحِينَ",
      "arti": "Dan Kami beri dia kabar gembira dengan (kelahiran) Ishaq seorang nabi yang termasuk orang-orang yang shalih."
    }
  },
  {
    "nomorUrut": 10,
    "nama": "Nabi Ya'qub as",
    "namaArab": "يَعْقُوبُ عَلَيْهِ السَّلَام",
    "gelar": "Israil (Hamba Allah yang Berjalan di Malam Hari) / Shahibul Huzni wal-Washiyyah",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1837 - 1690 SM (Era Awal Kaum Bani Israil)",
    "tempatDakwah": "Faddan Aram (Irak), Kan'an (Palestina), dan Mesir",
    "usia": "Sekitar 147 tahun",
    "sebutan": "Bapak 12 Suku Asbath (Bani Israil)",
    "ayatAlquran": "Q.S. Yusuf: 1-100, Q.S. Al-Baqarah: 132-133, Q.S. Ali 'Imran: 93, Q.S. Maryam: 49-50",
    "keluarga": {
      "ayahIbu": "Nabi Ishaq as dan Ribka (Rifqa)",
      "pasangan": "Liyya dan Rahil (dua putri Laban di Haran, dinikahi berurutan secara sah sesuai syariat masa itu), serta dua hamba Bilhah dan Zilfah",
      "anakKeturunan": "12 putra agung (Asbath): Rubin, Syam'un, Laway, Yahudza, Yasykar, Zabulun, Yusuf, Bunyamin, Dan, Naftali, Jad, dan Asyir",
      "tokohKeluargaTerkait": "Nabi Yusuf as (putra kesayangan yang menjadi nabi dan menteri di Mesir) dan Nabi Ibrahim as (kakek)",
      "catatanKeluarga": "Ujian kesedihan terpanjang dialami Nabi Ya'qub saat kehilangan Yusuf puluhan tahun, namun beliau membalasnya dengan sabar yang indah (fashabrun jamil)."
    },
    "umat": {
      "namaKaum": "Keluarga besar Asbath dan masyarakat Kan'an di Palestina",
      "wilayah": "Kan'an (Palestina) lalu hijrah ke Mesir",
      "karakterKaum": "Masyarakat peternak dan penggembala; di antara anak-anaknya sempat dihinggapi rasa iri hati terhadap Yusuf sebelum akhirnya bertaubat",
      "penolakanDanUjian": "Anak-anaknya bersekongkol membuang Yusuf ke sumur tua lalu membawa baju berlumur darah palsu, mendera Ya'qub dengan kesedihan hingga matanya memutih karena tangis",
      "kesudahanKaum": "Keluarga Bani Israil bersatu kembali di istana Mesir, bertaubat di hadapan ayah mereka, dan mendapat pengampunan Allah."
    },
    "sejarahLengkap": "Nabi Ya'qub as adalah putra Nabi Ishaq yang diberi gelar 'Israil' (Hamba Allah). Beliau merantau ke Faddan Aram (Haran) dan bekerja menggembala domba pada pamannya, Laban, dengan penuh kejujuran dan etos kerja tinggi. Beliau dikaruniai 12 putra yang kelak menjadi cikal bakal dua belas suku Bani Israil.\n\nDi antara putra-putranya, Yusuf dan Bunyamin yang lahir dari Rahil memiliki akhlak yang sangat mulia dan paling disayangi oleh Ya'qub. Rasa kasih sayang ini memicu kedengkian dari sepuluh saudaranya yang lebih tua. Suatu hari mereka meminta izin mengajak Yusuf bermain, lalu melemparkannya ke dalam sumur tua di gurun. Mereka kembali dengan menangis palsu seraya membawa gamis Yusuf yang dilumuri darah kambing, mengaku Yusuf diterkam serigala.\n\nNabi Ya'qub yang memiliki firasat kenabian mencium kepalsuan itu. Beliau berkata tegar: 'Sebenarnya dirimulah yang memandang baik perbuatan buruk itu. Maka kesabaranku adalah kesabaran yang indah (fa shabrun jamil). Dan hanya kepada Allah aku memohon pertolongan terhadap apa yang kalian ceritakan.'\n\nSelama berpuluh-puluh tahun Ya'qub menanggung rindu mendalam kepada Yusuf hingga kedua matanya memutih karena menangis. Namun keimanannya tidak pernah goyah. Ketika putra-putranya memintanya melupakan Yusuf, beliau menjawab agung: 'Innama asyku bats-tsi wa huzni ilallah' (Sesungguhnya hanyalah kepada Allah aku mengadukan kesusahan dan kesedihanku, dan aku mengetahui dari Allah apa yang tidak kalian ketahui). Keyakinan itu terbukti: Yusuf yang telah menjadi bendahara agung Mesir mengirimkan gamisnya untuk diusapkan ke mata sang ayah, seketika penglihatan Ya'qub pulih. Ya'qub dan seluruh keluarganya diboyong ke Mesir hidup mulia.\n\nMenjelang wafatnya, Ya'qub mengumpulkan seluruh putranya dan berwasiat: 'Apa yang kalian sembah sepeninggalku?' Mereka serentak menjawab: 'Kami akan menyembah Tuhanmu dan Tuhan nenek moyangmu: Ibrahim, Ismail, dan Ishaq, Tuhan Yang Maha Esa, dan kami tunduk patuh kepada-Nya.'",
    "ringkasanKisah": "Nabi Ya'qub (Israil) adalah ayah dari 12 suku Bani Israil termasuk Nabi Yusuf as. Menghadapi konspirasi anak-anaknya yang membuang Yusuf dengan kesabaran paripurna (fashabrun jamil) dan mengadukan duka hanya kepada Allah. Penglihatannya pulih setelah mencium aroma gamis Yusuf, lalu berwasiat tauhid kepada seluruh keturunannya sebelum wafat.",
    "mukjizat": [
      "Firasat dan intuisi kenabian tajam yang mampu mendeteksi kepalsuan darah di baju Yusuf dan mencium aroma gamis Yusuf dari jarak ratusan mil di Mesir",
      "Sembuhnya kebutaan kedua matanya seketika setelah mengusapkan gamis Nabi Yusuf ke wajahnya atas izin Allah",
      "Doa ampunan bagi sepuluh putranya yang dikabulkan Allah di waktu sahur",
      "Melahirkan garis keturunan 12 suku Bani Israil yang melahirkan banyak nabi"
    ],
    "ibrah": [
      "Kesabaran yang indah (fashabrun jamil): Tidak mengeluh kepada manusia melainkan menumpahkan seluruh air mata dan duka hanya kepada Allah",
      "Optimisme dan husnuzhan kepada Allah: Tidak pernah berputus asa dari jalan keluar Allah meski puluhan tahun dalam kegelapan ujian",
      "Keadilan dalam mendidik anak: Kasih sayang orang tua harus diekspresikan dengan cermat agar tidak menyulut api cemburu antar saudara",
      "Wasiat ketauhidan sebelum wafat: Warisan terbesar orang tua kepada anak-anaknya adalah kemurnian akidah dan komitmen ibadah"
    ],
    "keteladanan": [
      "Hanya mengadukan keluh kesah dan masalah hidup kepada Allah Swt dalam doa.",
      "Memiliki kesabaran luar biasa saat menghadapi musibah kehilangan.",
      "Memaafkan kesalahan anak dan saudara yang pernah berbuat khilaf.",
      "Menjaga kerukunan keluarga dan membimbingnya ke jalan ibadah."
    ],
    "dalilKunci": {
      "surah": "Yusuf",
      "ayat": "86",
      "arab": "قَالَ إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ",
      "arti": "Ya'qub menjawab: 'Sesungguhnya hanyalah kepada Allah aku mengadukan kesusahan dan kesedihanku, dan aku mengetahui dari Allah apa yang kamu tiada mengetahuinya'."
    }
  },
  {
    "nomorUrut": 11,
    "nama": "Nabi Yusuf as",
    "namaArab": "يُوسُفُ عَلَيْهِ السَّلَام",
    "gelar": "Ash-Shiddiq (Yang Terpercaya) / Al-Kariim ibnal Kariim / Teladan Iffah",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1745 - 1635 SM (Era Kerajaan Mesir Kuno / Dinasti Hyksos)",
    "tempatDakwah": "Negeri Mesir (istana, penjara, hingga pusat pemerintahan)",
    "usia": "Sekitar 110 tahun",
    "sebutan": "Kisah Terbaik dalam Al-Qur'an (Ahsanul Qashash)",
    "ayatAlquran": "Q.S. Yusuf: 1-111, Q.S. Al-An'am: 84, Q.S. Ghafir: 34",
    "keluarga": {
      "ayahIbu": "Nabi Ya'qub as dan Rahil",
      "pasangan": "Asnat binti Potifera (atau Zulaikha setelah bertaubat dan menjadi wanita shalihah)",
      "anakKeturunan": "Dua putra: Manassa (Manasseh) dan Ifrayim (Ephraim, kakek buyut Nabi Yusha' bin Nun)",
      "tokohKeluargaTerkait": "Bunyamin (adik kandung sebunda) dan 10 saudara tirinya",
      "catatanKeluarga": "Perjalanan keluarga dari kecemburuan dan pengkhianatan menuju pertaubatan, pemaafan agung, dan reuni suci di istana Mesir."
    },
    "umat": {
      "namaKaum": "Masyarakat Mesir Kuno (para bangsawan, tahanan penjara, rakyat jelata) dan keluarga besar Bani Israil",
      "wilayah": "Ibukota Mesir Kuno (Memphis / Avaris)",
      "karakterKaum": "Masyarakat berstrata sosial tinggi, politeis penyembah dewa Amun dan Ra, gemar kemewahan materi, dan dipimpin raja yang adil",
      "penolakanDanUjian": "Dibuang saudara ke sumur tua, dijual murah sebagai budak, difitnah rayuan mesum oleh istri Al-Aziz (Zulaikha), dan dipenjara selama bertahun-tahun dalam ketidakadilan",
      "kesudahanKaum": "Seluruh rakyat Mesir dan kawasan sekitarnya selamat dari bahaya kelaparan 7 tahun masa paceklik berkat manajemen logistik Yusuf, dan mereka mengagungkan tauhid."
    },
    "sejarahLengkap": "Kisah Nabi Yusuf as diabadikan dalam Al-Qur'an sebagai Ahsanul Qashash (Kisah Terbaik). Dimulai dari mimpinya melihat sebelas bintang, matahari, dan bulan sujud kepadanya, yang ditafsirkan ayahnya bahwa Allah akan memilihnya menjadi nabi. Akibat rasa iri sepuluh saudaranya, Yusuf dilemparkan ke dasar sumur tua, ditemukan kafilah dagang musafir, lalu dijual sebagai budak di pasar Mesir kepada seorang pembesar istana bernama Al-Aziz (Qithfir).\n\nYusuf tumbuh menjadi pemuda yang dianugerahi separuh keelokan paras manusia di dunia serta kesucian budi pekerti. Istri majikannya (Zulaikha) jatuh cinta dan mencoba merayu Yusuf di kamar terkunci. Yusuf lari menuju pintu seraya berseru: 'Ma'adzallah!' (Aku berlindung kepada Allah). Gamis Yusuf terkoyak di bagian belakang, membuktikan bahwa ia yang dikejar dan berada di pihak yang benar. Namun demi menutup skandal bangsawan, Yusuf difitnah dan dijebloskan ke penjara.\n\nDi dalam penjara, Yusuf tetap berdakwah tauhid dan menafsirkan mimpi dua rekannya dengan tepat. Bertahun-tahun kemudian, Raja Mesir bermimpi aneh: tujuh sapi betina gemuk dimakan tujuh sapi betina kurus, serta tujuh bulir gandum hijau dan tujuh bulir gandum kering. Tak ada peramal istana yang mampu menafsirkan. Yusuf dipanggil dan menerangkan maknanya: Mesir akan mengalami 7 tahun panen raya yang disusul 7 tahun musim paceklik kelaparan ekstrem. Yusuf menyarankan strategi lumbung pangan hemat.\n\nRaja membebaskan Yusuf, memulihkan nama baiknya, dan mengangkatnya sebagai Menteri Keuangan dan Ketahanan Pangan (Hafizhun 'Alim). Ketika masa paceklik tiba, saudara-saudara Yusuf datang dari Kan'an untuk membeli gandum tanpa menyadari Yusuf adalah menteri agung tersebut. Setelah menguji kebaikan mereka dan mempertemukan Bunyamin, Yusuf membuka identitasnya seraya berkata penuh maaf: 'La tatsriba 'alaikumul yaum' (Tidak ada celaan atas kalian pada hari ini, semoga Allah mengampuni kalian). Seluruh keluarga ayahnya diboyong ke Mesir dan bersujud hormat, memenuhi mimpinya di masa kecil.",
    "ringkasanKisah": "Nabi Yusuf as diuji dengan kedengkian saudara-saudaranya yang membuangnya ke sumur, dijual jadi budak di Mesir, difitnah hingga dipenjara, namun teguh menjaga kehormatan diri (iffah). Diberkahi kemampuan menafsirkan mimpi raja hingga diangkat menjadi menteri ketahanan pangan Mesir dan memaafkan saudara-saudaranya dengan kelapangan dada.",
    "mukjizat": [
      "Dikaruniai ketampanan paras lahiriah dan keelokan batiniah separuh keindahan dunia",
      "Kemampuan menakwilkan dan menafsirkan mimpi-mimpi masa depan secara tepat atas wahyu Allah (ta'wilul ahadits)",
      "Kecakapan agung memanajemen ketahanan pangan dan ekonomi negara menghadapi krisis 7 tahun paceklik",
      "Gamisnya yang diusapkan ke mata ayahnya mampu menyembuhkan kebutaan Ya'qub seketika"
    ],
    "ibrah": [
      "Menjaga kesucian diri (iffah): Keberanian lari dari godaan maksiat dan syahwat adalah bukti kemuliaan iman seorang pemuda",
      "Kelapangan dada memaafkan: Membalas kejahatan masa lalu dengan kebaikan, santunan, dan pemaafan tanpa dendam",
      "Profesionalisme dan integritas kepemimpinan: Jabatan publik harus dipegang oleh orang yang berintegritas (hafizh) dan berkompeten (alim)",
      "Pertolongan Allah di balik kegelapan sumur dan penjara: Setiap kesulitan adalah anak tangga menuju takdir kemuliaan"
    ],
    "keteladanan": [
      "Menjaga pandangan, rasa malu, dan kesucian diri dari perbuatan dosa.",
      "Tidak menyimpan dendam dan tulus memaafkan teman yang bersalah.",
      "Amanah, jujur, dan terpercaya saat diberi tugas atau tanggung jawab.",
      "Tetap rendah hati dan bersyukur saat berada di puncak kesuksesan."
    ],
    "dalilKunci": {
      "surah": "Yusuf",
      "ayat": "92",
      "arab": "قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
      "arti": "Dia (Yusuf) berkata: 'Pada hari ini tidak ada celaan terhadap kamu, mudah-mudahan Allah mengampuni kamu, dan Dia adalah Maha Penyayang di antara para penyayang'."
    }
  },
  {
    "nomorUrut": 12,
    "nama": "Nabi Ayyub as",
    "namaArab": "أَيُّوبُ عَلَيْهِ السَّلَام",
    "gelar": "Ash-Shabir (Simbol Puncak Kesabaran Umat Manusia) / Teladan Syukur",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1630 - 1500 SM (Masa Antara Yusuf dan Musa)",
    "tempatDakwah": "Dataran Hauran (perbatasan Suriah, Yordania, dan Palestina)",
    "usia": "Sekitar 93 - 140 tahun",
    "sebutan": "Hamba Allah yang dipuji dalam Al-Qur'an: Ni'mal 'abdu innahu awwab",
    "ayatAlquran": "Q.S. Al-Anbiya: 83-84, Q.S. Shad: 41-44, Q.S. An-Nisa: 163",
    "keluarga": {
      "ayahIbu": "Amush bin Razih bin 'Aish bin Ishaq bin Ibrahim as",
      "pasangan": "Rahmah binti Ifrayim bin Yusuf as (istri teladan paling setia yang rela bekerja keras merawat suaminya yang sakit)",
      "anakKeturunan": "Seluruh putra-putrinya wafat saat ujian gempa melanda, lalu setelah sembuh Allah menganugerahkannya kembali anak-cucu berlipat ganda, termasuk Nabi Zulkifli as (Basyar)",
      "tokohKeluargaTerkait": "Nabi Ibrahim as (kakek buyutnya) dan Nabi Yusuf as (kakek istrinya)",
      "catatanKeluarga": "Keteladanan rumah tangga sakinah yang tetap kokoh berpegang pada cinta dan tauhid di saat badai kemiskinan dan penyakit menimpa."
    },
    "umat": {
      "namaKaum": "Masyarakat Hauran dan Bathaniyyah (wilayah Syam)",
      "wilayah": "Hauran / Golan (Suriah-Yordania)",
      "karakterKaum": "Masyarakat peternak dan petani kaya yang sebagian memandang nilai seseorang hanya dari kemakmuran materi dan kekayaannya",
      "penolakanDanUjian": "Ketika Ayyub ditimpa sakit parah, masyarakat menjauhinya karena takut tertular atau mengira ia dikutuk tuhan, hingga ia harus mengasingkan diri ke pinggiran kota",
      "kesudahanKaum": "Masyarakat kagum menyaksikan kesembuhan ajaib Ayyub dan kembalinya kekayaannya, lalu mereka berbondong-bondong memeluk tauhid."
    },
    "sejarahLengkap": "Nabi Ayyub as pada mulanya adalah orang yang sangat kaya raya di tanah Syam. Beliau memiliki ribuan ekor unta, sapi, domba, tanah perkebunan luas, rumah megah, serta putra-putri yang tampan dan shalih. Yang paling mengagumkan, kekayaan melimpah ruah itu tidak pernah melalaikannya dari beribadah, menyantuni anak yatim, dan memberi makan orang miskin.\n\nAllah kemudian menguji keimanan Ayyub dengan ujian bertubi-tubi: seluruh ternaknya mati mendadak, perkebunannya terbakar musnah, rumahnya runtuh menewaskan seluruh anak-anaknya, hingga tubuhnya diserang penyakit kulit kronis yang amat parah selama bertahun-tahun. Seluruh kerabat dan sahabat meninggalkannya, kecuali istrinya yang shalihah, Rahmah, yang setia merawatnya dan bekerja memintal kain demi membelikan sesuap roti.\n\nKetika istrinya memohon: 'Wahai Ayyub, seandainya engkau berdoa kepada Allah, tentu Dia akan menyembuhkanmu!' Ayyub menjawab santun: 'Berapa lama kita hidup dalam kenikmatan dan kemakmuran?' Istrinya menjawab: 'Tujuh puluh tahun.' Ayyub berkata: 'Berapa lama kita diuji penderitaan ini?' Istrinya menjawab: 'Baru sekitar tujuh tahun.' Ayyub berujar malu: 'Aku malu kepada Allah memohon kelapangan padahal masa sakitku belum menyamai masa kenikmatan yang Dia berikan.'\n\nKetika rasa sakit semakin memuncak dan istrinya dicibir orang, Ayyub berdoa dengan adab paling santun: 'Robbi inni massaniyad-dhurru wa Anta arhamur-rahimin' (Ya Tuhanku, sesungguhnya aku telah ditimpa penyakit dan Engkau adalah Tuhan Yang Maha Penyayang di antara semua penyayang). Allah mengabulkan doanya dan memerintahkan Ayyub menghentakkan kakinya ke tanah. Memancarlah mata air sejuk: air itu diminum membersihkan penyakit dalam perutnya dan dibasuhkan ke kulitnya melenyapkan seluruh luka seketika. Allah mengembalikan paras mudanya, menurunkan hujan belalang emas, dan mengganti anak-anaknya berlipat ganda.",
    "ringkasanKisah": "Nabi Ayyub diuji dengan lenyapnya seluruh kekayaan ternak, wafatnya seluruh anaknya, dan menderita penyakit parah selama belasan tahun, namun lidahnya tak pernah berhenti berdzikir dan bersyukur. Istrinya merawatnya dengan setia. Allah menyembuhkannya melalui mukjizat air sejuk dan mengembalikan seluruh kenikmatannya berlipat ganda.",
    "mukjizat": [
      "Hentakan kakinya ke tanah memancarkan mata air ajaib yang sejuk untuk mandi dan minum, menyembuhkan seluruh penyakit dalam dan luar seketika",
      "Dikaruniai hujan belalang emas dan permata dari langit sebagai ganti harta kekayaannya yang hilang",
      "Kembalinya masa muda, kesehatan prima, dan keturunan yang berlipat ganda setelah masa ujian berakhir",
      "Kekuatan fisik dan ketabahan batin luar biasa yang dipuji langsung oleh Allah dalam Al-Qur'an"
    ],
    "ibrah": [
      "Hakikat sabar dan syukur: Sikap hamba sejati tidak berubah saat kaya maupun miskin, lapang maupun sempit",
      "Adab berdoa dalam musibah: Mengadukan kelemahan diri kepada Allah tanpa menyalahkan takdir atau berburuk sangka",
      "Kesetiaan dalam rumah tangga: Keteladanan istri Ayyub yang mendampingi suami di saat papa dan sakit mengajarkan makna cinta sejati",
      "Ujian adalah tanda cinta ilahi: Beratnya cobaan yang menimpa orang beriman bertujuan mengangkat derajat dan menghapus dosa"
    ],
    "keteladanan": [
      "Sabar dan tidak mengeluh saat tertimpa sakit atau kehilangan sesuatu.",
      "Berprasangka baik (husnuzhan) kepada Allah dalam segala keadaan.",
      "Setia kawan dan menyayangi keluarga di saat suka maupun duka.",
      "Memperbanyak dzikir dan doa saat menghadapi masa-masa sulit."
    ],
    "dalilKunci": {
      "surah": "Al-Anbiya",
      "ayat": "83",
      "arab": "وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
      "arti": "Dan (ingatlah kisah) Ayyub, ketika ia menyeru Tuhannya: '(Ya Tuhanku), sesungguhnya aku telah ditimpa penyakit dan Engkau adalah Yang Maha Penyayang di antara semua penyayang'."
    }
  },
  {
    "nomorUrut": 13,
    "nama": "Nabi Syu'aib as",
    "namaArab": "شُعَيْبٌ عَلَيْهِ السَّلَام",
    "gelar": "Khatibul Anbiya' (Juru Bicara / Orator Para Nabi)",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1600 - 1500 SM (Masa Menjelang Nabi Musa as)",
    "tempatDakwah": "Negeri Madyan dan Al-Aikah (pesisir Laut Merah, barat laut Hijaz / Yordania)",
    "usia": "Sekitar 110 - 140 tahun",
    "sebutan": "Pelopor etika bisnis Islam, kejujuran takaran dan anti-korupsi",
    "ayatAlquran": "Q.S. Al-A'raf: 85-93, Q.S. Hud: 84-95, Q.S. Asy-Syu'ara: 176-191, Q.S. Al-Ankabut: 36-37",
    "keluarga": {
      "ayahIbu": "Nuwaib bin Maikil bin Madyan bin Ibrahim as",
      "pasangan": "Wanita shalihah keturunan Nabi Luth as",
      "anakKeturunan": "Dua putri yang shalihah, pemalu, dan santun (salah satunya Shafura / Zipporah yang dinikahi Nabi Musa as di Madyan)",
      "tokohKeluargaTerkait": "Nabi Musa as (menantunya yang berguru dan menggembala kambingnya selama 8-10 tahun)",
      "catatanKeluarga": "Keluarga teladan moral kesopanan dan etika pergaulan: putri Syu'aib berjalan dengan penuh rasa malu (tamtsyi 'alastihya') saat memanggil Musa."
    },
    "umat": {
      "namaKaum": "Penduduk Negeri Madyan dan Ashabul Aikah (penyembah pohon besar)",
      "wilayah": "Madyan (wilayah perbatasan Arab, Yordania, dan Sinai)",
      "karakterKaum": "Masyarakat pedagang dan pebisnis yang gemar berbuat curang dalam takaran dan timbangan (mengurangi hak pembeli dan melebihkan hak sendiri), memungut pajak liar di jalanan, dan menyembah pohon rimbun",
      "penolakanDanUjian": "Menertawakan shalat dan nasihat Syu'aib seraya berkata sinis: 'Apakah agamamu menyuruhmu agar kami meninggalkan apa yang disembah nenek moyang kami atau melarang kami mengelola harta kami sesuka kami?' Mereka mengancam akan merajam Syu'aib jika bukan karena memandang keluarganya",
      "kesudahanKaum": "Ditimpa azab gempa bumi yang dahsyat (ar-rajfah) serta dinaungi awan panas yang menyemburkan kobaran api dan suara petir (adzabu yaumiz-zhullah), mematikan mereka membujur kaku di rumah-rumah mereka."
    },
    "sejarahLengkap": "Nabi Syu'aib as diutus kepada penduduk Madyan dan Ashabul Aikah yang menjadi simpul jalur perdagangan kafilah antara Syam, Yaman, dan Mesir. Posisi strategis ini disalahgunakan untuk menimbun harta dengan cara curang: memotong nilai mata uang, mengurangi takaran dan timbangan, serta memalak para kafilah dagang musafir yang melintas di jalan-jalan.\n\nNabi Syu'aib yang dianugerahi kepiawaian berorasi dan berdebat secara memikat (Khatibul Anbiya') menyeru: 'Wahai kaumku, sembahlah Allah, sekali-kali tidak ada Tuhan bagimu selain Dia. Telah datang kepadamu bukti nyata dari Tuhanmu. Maka sempurnakanlah takaran dan timbangan dan janganlah kamu merugikan manusia pada hak-hak mereka, dan janganlah kamu berbuat kerusakan di muka bumi setelah kebaikannya!'\n\nKaum Madyan membantah arogan seraya menantang azab. Ketika Nabi Musa as melarikan diri dari Mesir, beliau singgah di Madyan dan menolong kedua putri Syu'aib memberi minum ternak. Kagum akan sifat kuat dan amanah Musa (al-qawiyyul amin), Syu'aib menikahkan putrinya Shafura dengan Musa dengan mahar menggembalakan kambing selama 8 hingga 10 tahun.\n\nSetelah peringatan demi peringatan ditolak oleh kaum Madyan, Allah menurunkan hawa panas mencekam selama berhari-hari hingga mereka kehausan dan kegerahan hebat. Tiba-tiba muncul awan hitam menaungi lembah. Kaum Madyan berhamburan ke bawah awan mengira akan turun hujan sejuk, padahal awan itu menyemburkan bunga api dan guntur memekakkan telinga (adzabu yaumiz-zhullah) disertai gempa bumi dahsyat yang melenyapkan kaum kafir Madyan seketika.",
    "ringkasanKisah": "Nabi Syu'aib (Khatibul Anbiya) diutus kepada kaum Madyan dan Ashabul Aikah yang curang dalam takaran timbangan dan merampok musafir. Beliau adalah mertua Nabi Musa as yang mengajarkan etika bisnis jujur. Kaum Madyan menolak dakwahnya hingga dibinasakan dengan gempa bumi dan naungan awan api.",
    "mukjizat": [
      "Dikaruniai kefasihan lisan luar biasa, argumentasi logika yang mematahkan kebatilan, dan wibawa bicara (Khatibul Anbiya')",
      "Selamat dari ancaman rajam dan pengusiran kaumnya yang arogan",
      "Mendapat firasat tajam mengenai integritas moral dan fisik calon menantunya (Nabi Musa as)",
      "Diselamatkan Allah dari siksaan awan hitam berapi (adzabu yaumiz-zhullah) dan gempa rajfah"
    ],
    "ibrah": [
      "Integritas dalam muamalah dan perdagangan: Menjauhi segala bentuk kecurangan takaran, korupsi, spekulasi jahat, dan penipuan konsumen",
      "Harta halal membawa berkah: Sedikit rezeki yang halal (baqiyyatullahi khairun lakum) jauh lebih mulia daripada kekayaan melimpah dari hasil menipu",
      "Etika memilih menantu/pekerja: Menomorsatukan dua sifat utama: kompetensi (al-qawiyyu) dan integritas kejujuran (al-amin)",
      "Menjaga rasa malu (al-haya'): Sikap putri Nabi Syu'aib mengajarkan keanggunan wanita muslimah dalam berinteraksi sosial"
    ],
    "keteladanan": [
      "Jujur dalam berniaga, bertransaksi, dan mengukur sesuatu secara adil.",
      "Tidak mengambil hak teman atau fasilitas umum yang bukan haknya.",
      "Menjaga rasa malu, sopan santun, dan tutur kata dalam pergaulan.",
      "Menyampaikan nasihat dengan tutur kata yang santun dan berbobot."
    ],
    "dalilKunci": {
      "surah": "Hud",
      "ayat": "85",
      "arab": "وَيَا قَوْمِ أَوْفُوا الْمِكْيَالَ وَالْمِيزَانَ بِالْقِسْطِ ۖ وَلَا تَبْخَسُوا النَّاسَ أَشْيَاءَهُمْ وَلَا تَعْثَوْا فِي الْأَرْضِ مُفْسِدِينَ",
      "arti": "Dan (Syu'aib berkata): 'Hai kaumku, cukupkanlah takaran dan timbangan dengan adil, dan janganlah kamu merugikan manusia terhadap hak-hak mereka dan janganlah kamu membuat kejahatan di muka bumi dengan berbuat kerusakan'."
    }
  },
  {
    "nomorUrut": 14,
    "nama": "Nabi Musa as",
    "namaArab": "مُوسَى عَلَيْهِ السَّلَام",
    "gelar": "Kalimullah (Orang yang Berbicara Langsung dengan Allah) / Pemimpin Kaum Tertindas / Rasul Ulul Azmi",
    "isUlulAzmi": true,
    "periodeKaum": "Sekitar 1527 - 1407 SM (Era Fir'aun Ramses II / Meneptah)",
    "tempatDakwah": "Negeri Mesir Kuno, Madyan, Gurun Sinai (Thur Sina), dan Lembah Tiih",
    "usia": "Sekitar 120 tahun",
    "sebutan": "Nabi yang kisahnya paling banyak disebut dalam Al-Qur'an (136 kali)",
    "ayatAlquran": "Q.S. Thaha: 9-98, Q.S. Al-Qashash: 3-46, Q.S. Al-A'raf: 103-162, Q.S. Asy-Syu'ara: 10-68, Q.S. Al-Baqarah: 49-61",
    "keluarga": {
      "ayahIbu": "Imran bin Qahats bin Laway bin Ya'qub as dan Yukhabad (Yukabad, ibu mulia yang mendapat ilham menghanyutkan bayi Musa di Sungai Nil)",
      "pasangan": "Shafura (Zipporah) binti Nabi Syu'aib as (wanita shalihah penolong musafir)",
      "anakKeturunan": "Dikaruniai putra bernama Gershom dan Eliezer",
      "tokohKeluargaTerkait": "Nabi Harun as (kakak kandung sekaligus rekan perjuangan dakwahnya), Maryam (kakak perempuan yang memantau peti Musa di Sungai Nil), dan Asiyah binti Muzahim (istri Fir'aun yang mengangkatnya jadi anak dan melindunginya di istana)",
      "catatanKeluarga": "Perlindungan Allah nyata: Musa yang dicari Fir'aun untuk dibunuh justru dibesarkan di istana Fir'aun dan disusui oleh ibu kandungnya sendiri."
    },
    "umat": {
      "namaKaum": "Fir'aun (Raja Mesir yang mendaku tuhan), Haman (perdana menteri), Qarun (konglomerat sombong), bangsa Qibthi, serta Bani Israil yang diperbudak",
      "wilayah": "Lembah Sungai Nil (Mesir), Semenanjung Sinai, dan Gurun Tiih",
      "karakterKaum": "Fir'aun sangat kejam, membantai setiap bayi laki-laki Bani Israil dan membiarkan hidup bayi perempuan. Sementara Bani Israil telah berabad-abad diperbudak hingga bermental lemah, mudah mengeluh, dan gampang tergoda menyembah patung anak sapi (Samiri)",
      "penolakanDanUjian": "Tantangan perang sihir istana Fir'aun, 9 tulah azab, pengejaran bala tentara Mesir di bibir Laut Merah, kebebalan Bani Israil yang menolak masuk tanah suci Palestina",
      "kesudahanKaum": "Fir'aun dan seluruh bala tentaranya ditenggelamkan di dasar Laut Merah, Qarun ditelan bumi bersama hartanya, sedangkan Bani Israil diselamatkan menyeberangi lautan."
    },
    "sejarahLengkap": "Nabi Musa as lahir di tengah dekrit kejam Fir'aun yang membunuhi seluruh bayi lelaki Bani Israil karena ramalan mimpinya bahwa seorang anak lelaki Israil akan meruntuhkan kerajaannya. Ibu Musa diberi ilham oleh Allah untuk menyusui Musa lalu meletakkannya di dalam peti kayu dan menghanyutkannya ke Sungai Nil. Peti itu ditemukan oleh pelayan istana dan diserahkan kepada Asiyah, istri Fir'aun. Asiyah membujuk suaminya agar tidak membunuh bayi itu dan menjadikannya anak angkat. Atas skenario ilahi melalui kakak Musa (Maryam), ibu kandung Musa dipanggil ke istana menjadi ibu susuannya.\n\nMusa tumbuh menjadi pemuda yang berbadan tegap dan kuat di istana. Suatu hari, beliau melerai perkelahian antara orang Qibthi dan Bani Israil, hingga tanpa sengaja pukulannya menewaskan orang Qibthi. Mengetahui dirinya dicari untuk dieksekusi, Musa melarikan diri ke negeri Madyan, menikah dengan putri Nabi Syu'aib, dan mengabdi selama 10 tahun.\n\nKetika kembali ke Mesir bersama keluarganya, di Lembah Suci Thuwa di kaki Bukit Sinai, Musa melihat api di semak belukar. Di sanalah Allah berbicara langsung kepada Musa (Kalimullah) dan mengangkatnya menjadi rasul, mengabulkan doanya mengangkat Harun sebagai juru bicara wazirnya, serta memberinya dua mukjizat utama: tongkat yang berubah menjadi ular besar dan telapak tangan yang memancarkan cahaya putih tanpa cela.\n\nMusa dan Harun mendatangi Fir'aun menuntut pembebasan Bani Israil. Fir'aun mengumpulkan para tukang sihir terbaik seantero Mesir. Ketika para penyihir melemparkan tali dan tongkat mereka yang tampak bergerak seperti ular, Musa melemparkan tongkatnya yang berubah menjadi ular raksasa asli memakan seluruh kepalsuan mereka. Para penyihir seketika bersujud memeluk agama Musa tanpa takut ancaman salib Fir'aun.\n\nSetelah 9 azab (darah, katak, kutu, belalang, dll) melanda Mesir tanpa membuat Fir'aun sadar, Musa memimpin Bani Israil eksodus di waktu malam. Fir'aun dan pasukannya mengepung mereka di tepi Laut Merah. Ketika kaumnya berteriak putus asa: 'Kita pasti tertangkap!', Musa menjawab lantang: 'Kalla! Inna ma'iya Rabbi sayahdin' (Sekali-kali tidak! Sesungguhnya Tuhanku bersamaku, Dia akan memberi petunjuk kepadaku). Musa memukulkan tongkatnya ke laut, terbelahlah Laut Merah menjadi 12 jalan kering berdinding air laksana gunung. Bani Israil menyeberang dengan selamat, sementara Fir'aun dan pasukannya digulung ombak raksasa hingga tewas tenggelam. Musa kemudian menerima Kitab Suci Taurat di Bukit Sinai.",
    "ringkasanKisah": "Rasul Ulul Azmi yang berbicara langsung dengan Allah (Kalimullah). Dibesarkan di istana Fir'aun, lari ke Madyan, lalu kembali menuntut kebebasan Bani Israil dari perbudakan. Mengalahkan para penyihir Fir'aun, membelah Laut Merah dengan tongkat mukjizatnya hingga Fir'aun tenggelam, dan menerima Kitab Suci Taurat di Bukit Sinai.",
    "mukjizat": [
      "Tongkat kayu yang berubah menjadi ular raksasa pemangsa sihir dan mampu membelah Laut Merah menjadi 12 jalan kering penyeberangan",
      "Telapak tangan yang memancarkan cahaya putih benderang menyilaukan tanpa cela penyakit (yadun baidha')",
      "Sembilan tanda azab ilahi bagi Fir'aun: air sungai Nil menjadi darah, wabah katak, kutu, belalang, badai es, dan kegelapan",
      "Memancarkan 12 mata air dari sebongkah batu karang dengan satu pukulan tongkat di padang pasir",
      "Menerima Kitab Suci Taurat di atas lembaran batu (alwah) dan berbicara langsung dengan Allah Swt tanpa perantara di Lembah Thuwa (Kalimullah)",
      "Diturunkan makanan surga Manna dan Salwa untuk Bani Israil di Padang Tiih"
    ],
    "ibrah": [
      "Keberanian melawan tirani: Menegakkan kebenaran dan membela hak-hak asasi kaum tertindas di hadapan penguasa zalim",
      "Tawakal di jalan buntu: Ketika di depan terbentang lautan dan di belakang mengejar bala tentara musuh, keyakinan kepada pertolongan Allah membuka jalan keajaiban",
      "Pentingnya kerja sama tim (teamwork): Musa memohon Harun mendampinginya demi saling menguatkan lisan dan mental dalam dakwah",
      "Karakteristik kepemimpinan: Pemimpin harus berani, sabar mengayomi rakyat yang sering mengeluh, dan pantang menyerah"
    ],
    "keteladanan": [
      "Berani menyuarakan kebenaran dan membela teman yang dizalimi.",
      "Teguh beriman dan tidak takut menghadapi ancaman saat berada di jalan yang benar.",
      "Rendah hati untuk terus menuntut ilmu (sebagaimana kisahnya berguru kepada Nabi Khidir as).",
      "Senantiasa berdoa memohon kelapangan dada dan kemudahan urusan kepada Allah."
    ],
    "dalilKunci": {
      "surah": "Asy-Syu'ara",
      "ayat": "63",
      "arab": "فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ فَكَانَ كُلُّ فِرْقٍ كَالطَّوْدِ الْعَظِيمِ",
      "arti": "Lalu Kami wahyukan kepada Musa: 'Pukullah lautan itu dengan tongkatmu.' Maka terbelahlah lautan itu dan tiap-tiap belahan adalah seperti gunung yang besar."
    }
  },
  {
    "nomorUrut": 15,
    "nama": "Nabi Harun as",
    "namaArab": "هَارُونُ عَلَيْهِ السَّلَام",
    "gelar": "Wazirullah (Pendamping Setia Nabi Musa) / Al-Fashihul Lisan",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1530 - 1408 SM (Sezaman dengan Nabi Musa as)",
    "tempatDakwah": "Negeri Mesir Kuno dan Gurun Sinai",
    "usia": "Sekitar 122 tahun (wafat sebelum Nabi Musa di Bukit Hor / Gurun Tiih)",
    "sebutan": "Juru bicara ulung, lemah lembut, dan penjaga persatuan umat",
    "ayatAlquran": "Q.S. Thaha: 29-36 & 90-94, Q.S. Maryam: 51-53, Q.S. Al-Furqan: 35, Q.S. Al-A'raf: 142",
    "keluarga": {
      "ayahIbu": "Imran dan Yukhabad (kakak kandung Nabi Musa as)",
      "pasangan": "Elisheba (Alisyiba binti Aminadab dari suku Yehuda)",
      "anakKeturunan": "Dikaruniai 4 putra: Nadab, Abihu, Eleazar (Al-'Izar, penerus imam besar), dan Itamar",
      "tokohKeluargaTerkait": "Nabi Musa as (adik kandung) dan Maryam (kakak perempuan)",
      "catatanKeluarga": "Menjadi teladan persaudaraan sejati yang saling menopang dalam dakwah, bebas dari rasa iri hati meskipun adiknya memegang mandat rasul utama."
    },
    "umat": {
      "namaKaum": "Bani Israil dan bangsa Qibthi Mesir",
      "wilayah": "Mesir Kuno dan Semenanjung Sinai",
      "karakterKaum": "Bani Israil yang masih labil akidahnya dan mudah dipengaruhi oleh provokator Samiri ketika ditinggal Musa bermunajat 40 hari di Sinai",
      "penolakanDanUjian": "Ujian terberat Harun adalah saat kaumnya disihir Samiri menyembah patung anak sapi emas (Al-'Ijl); Harun diancam dibunuh jika mencegah dengan kekerasan fisik, dan dituduh lalai saat Musa kembali",
      "kesudahanKaum": "Harun mampu menjelaskan duduk perkara dengan santun kepada Musa sehingga persaudaraan mereka tetap utuh, dan Samiri diasingkan dari pergaulan umat."
    },
    "sejarahLengkap": "Nabi Harun as adalah kakak kandung Nabi Musa as yang berusia sekitar tiga tahun lebih tua. Ketika Nabi Musa menerima wahyu di Lembah Thuwa, Musa berdoa secara khusus memohon kepada Allah agar mengangkat saudaranya Harun sebagai pendamping (wazir): 'Dan jadikanlah untukku seorang pembantu dari keluargaku, (yaitu) Harun saudaraku, teguhkanlah kekuatanku dengannya, dan jadikanlah dia sekutu dalam urusanku, agar kami banyak bertasbih kepada-Mu.' Doa itu dikabulkan Allah karena Harun memiliki kelebihan lisan yang sangat fasih, tutur kata yang memikat, berwibawa, dan berwatak tenang penuh kelembutan.\n\nHarun setia mendampingi Musa menghadapi Fir'aun di istana. Beliau menyampaikan argumen-argumen dakwah dengan bahasa yang runtut dan beradab. Ketika Fir'aun tenggelam dan Bani Israil berhasil menyeberangi Laut Merah menuju Tanah Suci, Musa dipanggil Allah ke puncak Gunung Sinai selama 40 malam untuk menerima lembaran wahyu Taurat. Musa menunjuk Harun sebagai pengganti kepemimpinan sementara (khalifah): 'Gantikanlah aku dalam (memimpin) kaumku, dan perbaikilah, dan janganlah kamu mengikuti jalan orang-orang yang membuat kerusakan.'\n\nDi saat Musa tidak ada, seorang munafik bernama Samiri mengumpulkan perhiasan emas rampasan dan mencetaknya menjadi patung anak sapi yang dapat mengeluarkan suara dengung seperti desauan angin. Sebagian besar Bani Israil terpikat dan mulai menyembahnya. Nabi Harun mengingatkan sekuat tenaga: 'Wahai kaumku, sesungguhnya kamu hanya diuji dengan anak sapi itu, dan sesungguhnya Tuhanmu adalah Tuhan Yang Maha Pemurah, maka ikutilah aku dan taatilah perintahku!' Namun mereka menentang dan hampir membunuh Harun.\n\nKetika Musa kembali dan melihat kemusyrikan itu, Musa sangat marah hingga melempar lembaran batu Taurat dan memegang janggut serta menarik kepala saudaranya. Harun meredakan kemarahan adiknya dengan santun: 'Wahai putra ibuku! Janganlah engkau pegang janggutku dan jangan pula kepalaku; sesungguhnya aku khawatir engkau akan berkata: Kamu telah memecah belah antara Bani Israil dan kamu tidak memelihara amanatku.' Mendengar penjelasan jujur itu, Musa luluh dan berdoa memohon ampunan bagi dirinya dan saudaranya.",
    "ringkasanKisah": "Kakak kandung Nabi Musa yang diangkat menjadi nabi atas permohonan Musa karena kefasihan lisan dan kelembutan hatinya. Mendampingi dakwah di istana Fir'aun dan menjaga persatuan Bani Israil saat Musa bermunajat di Sinai. Menjadi teladan meredam konflik persaudaraan dan menjaga ukhuwah.",
    "mukjizat": [
      "Kefasihan lisan dan retorika diplomasinya yang mempesona diakui langsung oleh Nabi Musa dan Allah Swt",
      "Tongkat kayu Harun yang bertunas, berbunga, dan berbuah atas izin Allah sebagai tanda kemuliaan garis keimaman ibadahnya",
      "Mendapat status kenabian khusus berkat doa syafa'at dan permohonan adiknya Nabi Musa as",
      "Selamat dari ancaman pembunuhan kaum Samiri dan sukses menjaga stabilitas mayoritas Bani Israil"
    ],
    "ibrah": [
      "Kekuatan komunikasi yang persuasif: Lisan yang fasih, jujur, dan beradab adalah modal utama dalam diplomasi dan dakwah",
      "Kelembutan dalam meredam amarah: Menghadapi kemarahan saudara dengan kata-kata penuh kasih (Ya bna Umma / Wahai putra ibuku)",
      "Menjaga persatuan umat: Menghindari tindakan gegabah yang berpotensi menyulut perang saudara atau perpecahan internal",
      "Sinergi dan kolaborasi: Tidak ada rasa iri terhadap keutamaan yang dimiliki saudara, melainkan saling melengkapi demi tujuan mulia"
    ],
    "keteladanan": [
      "Mendukung dan saling menopang dalam kebaikan dengan saudara kandung.",
      "Menenangkan teman yang sedang emosi dengan tutur kata yang santun dan sejuk.",
      "Menghargai kelebihan orang lain tanpa merasa minder atau dengki.",
      "Menjaga kerukunan dan kekompakan dalam kelompok/organisasi."
    ],
    "dalilKunci": {
      "surah": "Thaha",
      "ayat": "29-30",
      "arab": "وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي ۝ هَارُونَ أَخِي",
      "arti": "Dan jadikanlah untukku seorang pembantu dari keluargaku, (yaitu) Harun, saudaraku."
    }
  },
  {
    "nomorUrut": 16,
    "nama": "Nabi Zulkifli as",
    "namaArab": "ذُو الْكِفْلِ عَلَيْهِ السَّلَام",
    "gelar": "Dzul Kifli (Pemilik Kesanggupan yang Menepati Janji) / Al-Hakim Ash-Shabir",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1500 - 1425 SM (Masa Pasca Nabi Musa & Harun)",
    "tempatDakwah": "Damaskus / Syam (Suriah) dan wilayah Irak Kuno",
    "usia": "Sekitar 75 - 95 tahun",
    "sebutan": "Raja yang adil, ahli puasa siang hari dan qiyamul lail tanpa amarah",
    "ayatAlquran": "Q.S. Al-Anbiya: 85-86, Q.S. Shad: 48",
    "keluarga": {
      "ayahIbu": "Nabi Ayyub as dan Rahmah (nama aslinya adalah Basyar)",
      "pasangan": "Wanita shalihah di Damaskus",
      "anakKeturunan": "Menurunkan generasi shalih di wilayah Syam",
      "tokohKeluargaTerkait": "Nabi Ayyub as (ayahanda tercinta yang mewariskan ketabahan dan kesabaran puncak)",
      "catatanKeluarga": "Tumbuh dalam didikan keluarga yang kenyang dengan tempaan kesabaran dan rasa syukur mendalam."
    },
    "umat": {
      "namaKaum": "Masyarakat negeri Damaskus dan sekitarnya (Bani Israil dan kaum Amoria)",
      "wilayah": "Syam / Damaskus (Suriah)",
      "karakterKaum": "Masyarakat yang terbiasa berselisih sengketa hukum, membutuhkan hakim yang adil, jujur, dan tidak mempan disuap",
      "penolakanDanUjian": "Iblis berulang kali menyamar menjadi musafir tua yang mengganggu waktu istirahat dan tidurnya di siang hari demi memancing kemarahannya, namun Zulkifli tetap sabar melayani rakyat",
      "kesudahanKaum": "Masyarakat hidup aman, makmur, dan damai berkat tegaknya supremasi hukum yang adil dan teladan moral sang raja-nabi."
    },
    "sejarahLengkap": "Nama asli Nabi Zulkifli as adalah Basyar, putra dari Nabi Ayyub as. Beliau dinamakan 'Zulkifli' (yang memiliki kesanggupan / menepati janji) karena peristiwa sayembara kepemimpinan di negerinya. Raja Syam yang telah lanjut usia dan tidak memiliki keturunan mengumpulkan rakyatnya dan mengumumkan sayembara: 'Siapakah di antara kalian yang sanggup berpuasa di siang hari, beribadah qiyamul lail di malam hari, dan tidak pernah marah saat memutuskan perkara hukum, maka tahta kerajaanku akan kuserahkan kepadanya.'\n\nSemua hadirin terdiam karena merasa syarat itu teramat berat. Namun seorang pemuda bernama Basyar berdiri mengangkat tangannya: 'Saya sanggup!' Raja mengulangi sayembaranya tiga kali, dan pada setiap kesempatan hanya Basyar yang menyatakan kesiapannya. Raja pun menyerahkan kepemimpinan negeri kepadanya, dan sejak saat itu beliau digelari Dzul Kifli.\n\nSebagai raja sekaligus nabi, Zulkifli membagi waktunya dengan cermat: siang hari beliau berpuasa dan melayani sidang pengadilan rakyat, malam hari beliau habiskan untuk shalat dan munajat kepada Allah, dan hanya tidur sejenak di waktu qailulah (menjelang dzuhur). Iblis yang dengki berniat menggagalkan komitmennya dengan menyamar sebagai kakek tua yang mengadu sengketa di waktu tidur siangnya. Kakek itu datang berulang kali dengan cerita berbelit-belit dan mengulur waktu agar Zulkifli marah dan kehilangan kesabaran. Namun Nabi Zulkifli melayaninya dengan senyum, kelemahlembutan, dan ketenangan tanpa mengeluh sedikit pun hingga tipu daya iblis terbongkar. Beliau dipuji Allah dalam Al-Qur'an sebagai sosok yang sabar dan termasuk hamba-hamba pilihan yang terbaik.",
    "ringkasanKisah": "Putra Nabi Ayyub yang nama aslinya Basyar. Mengemban amanah menjadi raja setelah menyanggupi tiga syarat: puasa di siang hari, shalat di malam hari, dan tidak pernah marah dalam mengadili rakyat. Mampu menepis godaan Iblis yang memancing emosinya dan memimpin rakyat dengan penuh keadilan.",
    "mukjizat": [
      "Ketahanan fisik dan spiritual luar biasa mampu berpuasa setiap hari, menghidupkan malam dengan ibadah, serta memimpin sidang rakyat tanpa lelah",
      "Pengendalian emosi dan hawa nafsu sempurna yang tidak dapat digoyahkan oleh provokasi iblis dan manusia",
      "Mampu menyingkap penyamaran tipu daya Iblis yang hendak merusak kepemimpinannya",
      "Keadilan hukum yang menyejahterakan seluruh rakyat negeri tanpa ada yang terzalimi"
    ],
    "ibrah": [
      "Menepati komitmen dan janji: Integritas seorang muslim diukur dari kemampuannya menepati janji-janji yang telah diucapkannya",
      "Manajemen emosi (menahan amarah): Kemampuan mengendalikan amarah adalah ciri utama orang kuat dan beriman sejati",
      "Keseimbangan ibadah dan pelayanan publik: Kesibukan bekerja mengurus masyarakat tidak boleh melalaikan shalat malam dan puasa",
      "Keadilan hukum tanpa diskriminasi: Memutuskan perkara rakyat dengan mata hati yang jernih dan bebas dari kepentingan hawa nafsu"
    ],
    "keteladanan": [
      "Menepati janji kepada teman, guru, dan keluarga.",
      "Mampu menahan amarah dan tidak mudah terpancing emosi saat diganggu orang lain.",
      "Disiplin membagi waktu belajar, membantu orang tua, dan beribadah.",
      "Bertindak adil dan tidak membeda-bedakan teman dalam bergaul."
    ],
    "dalilKunci": {
      "surah": "Al-Anbiya",
      "ayat": "85-86",
      "arab": "وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ ۖ كُلٌّ مِّنَ الصَّابِرِينَ ۝ وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا ۖ إِنَّهُم مِّنَ الصَّالِحِينَ",
      "arti": "Dan (ingatlah kisah) Ismail, Idris dan Zulkifli. Semua mereka termasuk orang-orang yang sabar. Kami telah memasukkan mereka kedalam rahmat Kami. Sesungguhnya mereka termasuk orang-orang yang shalih."
    }
  },
  {
    "nomorUrut": 17,
    "nama": "Nabi Daud as",
    "namaArab": "دَاوُودُ عَلَيْهِ السَّلَام",
    "gelar": "Khalifatullah fil-Ardh / Pemilik Suara Terindah / Shahibuz Zabur",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1040 - 970 SM (Era Kejayaan Kerajaan Bani Israil)",
    "tempatDakwah": "Palestina / Baitul Maqdis (Yerusalem)",
    "usia": "Sekitar 70 - 100 tahun",
    "sebutan": "Raja agung pemenang perang melawan Jalut dan penerima Kitab Zabur",
    "ayatAlquran": "Q.S. Shad: 17-26, Q.S. Saba: 10-11, Q.S. Al-Anbiya: 78-80, Q.S. Al-Baqarah: 251, Q.S. Al-Isra: 55",
    "keluarga": {
      "ayahIbu": "Isya (Jesse) bin Uwaibaid bin Ba'az bin Salmun bin Yahudza bin Ya'qub as (suku Yehuda)",
      "pasangan": "Mikhal binti Raja Thalut (Saul) dan Batsyeba",
      "anakKeturunan": "Memiliki beberapa putra, di antaranya Nabi Sulaiman as (pewaris tahta kerajaan dan ilmu hikmah kenabian)",
      "tokohKeluargaTerkait": "Raja Thalut (mertua) dan Nabi Sulaiman as (putra tercinta)",
      "catatanKeluarga": "Keluarga kerajaan tauhid pertama yang memadukan mahkota kekuasaan politik dengan keagungan wahyu kenabian."
    },
    "umat": {
      "namaKaum": "Bani Israil dan penduduk Palestina",
      "wilayah": "Yerusalem / Baitul Maqdis dan sekitarnya",
      "karakterKaum": "Bani Israil yang sempat tertindas oleh bangsa Filistin dan raksasa Jalut (Goliath); memerlukan pemimpin yang berani, adil, dan mengayomi",
      "penolakanDanUjian": "Ujian fitnah kepemimpinan dan perselisihan sengketa peradilan rakyat, yang ditebus Daud dengan memperbanyak ruku' dan sujud bertaubat",
      "kesudahanKaum": "Kerajaan Bani Israil mencapai puncak kemakmuran, kemandirian ekonomi, dan keadilan hukum di bawah naungan Kitab Zabur."
    },
    "sejarahLengkap": "Nabi Daud as pada masa mudanya adalah seorang pemuda penggembala domba yang bersahaja dari suku Yehuda. Ketika Raja Thalut memimpin tentara Bani Israil menghadapi tentara bangsa Filistin yang dipimpin oleh raksasa perang kejam bernama Jalut (Goliath), tak ada satupun prajurit yang berani maju berduel. Daud yang masih belia mengajukan diri. Hanya berbekal tongkat gembala, lima butir batu kali, dan sebuah ketapel tali (mikhlaf), Daud melontarkan batu tepat mengenai kening Jalut hingga tersungkur tewas seketika. Kemenangan ajaib ini membalikkan jalannya peperangan dan mengantarkan Daud menjadi pahlawan besar.\n\nSetelah Raja Thalut wafat, rakyat membaiat Daud menjadi raja Bani Israil. Allah Swt kemudian menganugerahkannya kenabian, hikmah kepemimpinan (fashlul khithab), serta menurunkan Kitab Suci Zabur yang berisi mazmur pujian, dzikir, dan pengagungan kepada Allah. Daud memiliki suara yang teramat merdu; ketika beliau melantunkan ayat-ayat Zabur, burung-burung di angkasa berhenti terbang dan berkumpul mengitari kepalanya, serta gunung-gunung turut bergema bertasbih bersamanya di waktu pagi dan petang.\n\nAllah juga menganugerahi Daud mukjizat luar biasa berupa kemampuan melunakkan besi baja dengan tangan kosong tanpa perlu api pembakaran atau palu tempa. Daud merancang dan menganyam baju besi perang (zirah rantai) yang fleksibel dan kuat untuk pasukannya. Kendati menjadi raja besar berkuasa, Daud tidak pernah mengambil gaji dari kas negara; beliau mencukupi kebutuhan makan keluarganya dari hasil jerih payah tangannya sendiri membuat baju besi. Rasulullah SAW memuji Daud sebagai teladan ibadah terbaik: shalat malam separuh waktu, dan puasa Daud (sehari berpuasa, sehari berbuka).",
    "ringkasanKisah": "Pemuda pemberani yang mengalahkan raksasa Jalut dengan ketapel batunya, lalu diangkat menjadi raja Bani Israil dan menerima Kitab Zabur. Dianugerahi suara teramat merdu yang membuat burung dan gunung ikut bertasbih, mampu melunakkan besi baja dengan tangan kosong untuk baju zirah, dan hidup mandiri dari hasil keringat sendiri.",
    "mukjizat": [
      "Suara merdu tiada tanding yang membuat burung-burung di udara dan gunung-gunung batu ikut bertasbih bersamanya mengagungkan Allah",
      "Mampu melunakkan besi baja padat menjadi lentur bagai lilin atau adonan tepung hanya dengan sentuhan tangan kosong tanpa bantuan api",
      "Menemukan dan merancang teknologi baju besi perang anyaman cincin (dar'an) yang ringan namun kebal senjata",
      "Menerima Kitab Suci Zabur sebagai petunjuk dan pujian tauhid bagi kaumnya",
      "Membunuh raksasa perang Jalut hanya dengan sebutir batu ketapel kecil atas pertolongan Allah"
    ],
    "ibrah": [
      "Kemandirian ekonomi (etos kerja): Menolak ketergantungan pada fasilitas negara dan bangga memakan rezeki dari hasil keringat tangan sendiri",
      "Ibadah yang istiqamah: Menjaga keseimbangan puasa sunnah selang-seling (Puasa Daud) dan shalat malam di tengah kesibukan mengurus negara",
      "Keadilan dalam memutuskan perkara: Berhati-hati mendengarkan kedua belah pihak dan segera memohon ampunan Allah jika merasa khilaf",
      "Kekuatan iman mengalahkan fisik: Keberanian pemuda beriman mampu meruntuhkan kesombongan raksasa bersenjata lengkap"
    ],
    "keteladanan": [
      "Mandiri dan tidak bergantung kepada pemberian orang lain.",
      "Rajin beribadah (puasa sunnah dan shalat malam).",
      "Gemar membaca Al-Qur'an dan melantunkan dzikir dengan tartil.",
      "Berani membela kebenaran meskipun menghadapi lawan yang tampak lebih kuat."
    ],
    "dalilKunci": {
      "surah": "Saba",
      "ayat": "10",
      "arab": "يَا جِبَالُ أَوِّبِي مَعَهُ وَالطَّيْرَ ۖ وَأَلَنَّا لَهُ الْحَدِيدَ",
      "arti": "Hai gunung-gunung dan burung-burung, bertasbihlah berulang-ulang bersama Daud, dan Kami telah melunakkan besi untuknya."
    }
  },
  {
    "nomorUrut": 18,
    "nama": "Nabi Sulaiman as",
    "namaArab": "سُلَيْمَانُ عَلَيْهِ السَّلَام",
    "gelar": "Raja Terbesar Sepanjang Sejarah / Al-Hakim Al-Muwaffaq / Teladan Syukur Paripurna",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 990 - 931 SM (Masa Keemasan Kerajaan Israil Raya)",
    "tempatDakwah": "Palestina (Baitul Maqdis), Syam, hingga Yaman (Kerajaan Saba')",
    "usia": "Sekitar 52 - 60 tahun",
    "sebutan": "Raja yang memimpin tentara gabungan manusia, jin, burung, dan angin",
    "ayatAlquran": "Q.S. An-Naml: 15-44, Q.S. Saba: 12-14, Q.S. Shad: 30-40, Q.S. Al-Anbiya: 81-82",
    "keluarga": {
      "ayahIbu": "Nabi Daud as dan Batsyeba",
      "pasangan": "Ratu Bilqis (setelah masuk Islam bertaubat dari pemujaan matahari) serta istri-istri lainnya",
      "anakKeturunan": "Putra beliau bernama Rehabeam (yang mewarisi sebagian wilayah kerajaan)",
      "tokohKeluargaTerkait": "Nabi Daud as (ayah yang mewariskan kerajaan dan hikmah peradilan)",
      "catatanKeluarga": "Doa Nabi Sulaiman diabadikan dalam Al-Qur'an: memohon kerajaan agung yang tidak tertandingi oleh siapa pun sesudahnya, semata-mata untuk mengabdi kepada Allah."
    },
    "umat": {
      "namaKaum": "Bani Israil, bangsa Jin, hewan liar dan burung, serta masyarakat Kerajaan Saba' di Yaman",
      "wilayah": "Kawasan Syam, Palestina, dan Jazirah Arab Selatan (Yaman)",
      "karakterKaum": "Rakyat hidup dalam kemakmuran peradaban tinggi; sementara bangsa jin tunduk bekerja keras menyelam di lautan dan membangun istana",
      "penolakanDanUjian": "Ujian kemegahan takhta dan kuda-kuda perang unggul, serta dakwah diplomasi kepada Ratu Bilqis penyembah matahari",
      "kesudahanKaum": "Ratu Bilqis menyatakan keislamannya berserah diri bersama Sulaiman kepada Allah Rabbul 'Alamin, dan Baitul Maqdis berhasil dipugar dengan megah."
    },
    "sejarahLengkap": "Nabi Sulaiman as mewarisi tahta kerajaan dan ilmu hikmah dari ayahnya, Nabi Daud as. Sejak belia, Sulaiman telah menunjukkan kecerdasan luar biasa dalam memberikan solusi hukum peradilan yang adil dan memuaskan kedua belah pihak. Beliau memanjatkan doa agung kepada Allah: 'Rabbi-ghfirli wa habli mulkan la yanbaghi li-ahadin min ba'di' (Ya Tuhanku, ampunilah aku dan anugerahkanlah kepadaku kerajaan yang tidak dimiliki oleh seorang pun sesudahku). Allah mengabulkan permohonannya dan memberinya kekuasaan yang tak pernah ada tandingannya di muka bumi.\n\nAllah menundukkan angin kencang berhembus sejuk atas perintah Sulaiman, membawanya menempuh jarak perjalanan satu bulan hanya dalam waktu setengah hari. Allah juga menundukkan golongan jin dan setan untuk bekerja di bawah komandonya: menyelam mencari mutiara di dasar samudra, membangun istana kristal megah, membuat mihrab-mihrab ibadah, dan mengalirkan mata air tembaga cair ('Ainal Qithri).\n\nSelain itu, Nabi Sulaiman dikaruniai mukjizat memahami bahasa segala jenis binatang. Suatu ketika saat pasukannya yang terdiri dari jin, manusia, dan burung berbaris rapi di lembah semut, seekor ratu semut berseru panik: 'Wahai semut-semut! Masuklah ke dalam sarang-sarangmu agar kamu tidak diinjak oleh Sulaiman dan tentaranya dalam keadaan tidak sadar!' Mendengar ucapan semut kecil itu, Sulaiman tersenyum bahagia seraya berdoa penuh syukur: 'Rabbi awzi'ni an asykura ni'matakal-lati an'amta 'alayya wa 'ala walidayya' (Ya Tuhanku, anugerahkanlah aku ilham untuk tetap mensyukuri nikmat-Mu).\n\nMelalui perantara burung Hud-hud yang cermat, Sulaiman mengetahui adanya Kerajaan Saba' di Yaman yang makmur namun menyembah matahari di bawah pimpinan Ratu Bilqis. Sulaiman mengirimkan surat dakwah berbunyi: 'Bismillahir-Rahmanir-Rahim, Janganlah kalian berlaku sombong terhadapku dan datanglah kepadaku sebagai orang-orang yang berserah diri.' Setelah menyaksikan singgasananya dipindahkan dalam sekejap mata oleh seorang berilmu dan lantai kaca istana Sulaiman yang dikira kolam air dalam, Ratu Bilqis luluh dan menyatakan keimanannya kepada Allah.\n\nWafatnya Nabi Sulaiman pun menjadi bukti ketidakberdayaan jin: beliau wafat dalam posisi berdiri bersandar pada tongkatnya saat mengawasi jin bekerja. Jin-jin tersebut tidak menyadari kematiannya hingga seekor rayap menggerogoti tongkatnya dan jasad beliau tersungkur, membuktikan bahwa jin tidak mengetahui hal yang ghaib.",
    "ringkasanKisah": "Nabi dan raja terkaya sepanjang sejarah yang dianugerahi kerajaan tak tertandingi. Mampu memahami bahasa binatang, memerintah bala tentara jin dan burung, menundukkan angin untuk kendaraannya, serta mengalirkan tembaga cair. Berhasil mengajak Ratu Bilqis dan Kerajaan Saba' memeluk Islam dengan dakwah diplomasi yang agung.",
    "mukjizat": [
      "Memahami bahasa dan percakapan seluruh jenis hewan (semut, burung hud-hud, kuda, dll)",
      "Mampu menundukkan dan memerintah bala tentara bangsa jin dan setan untuk menyelam ke dasar laut dan membangun istana megah",
      "Menundukkan angin kencang yang dapat bertiup membawanya menempuh perjalanan sebulan dalam waktu setengah hari saja",
      "Mengalirkan mata air tembaga cair ('ainal qithri) dari dalam perut bumi untuk industri peradaban",
      "Singgasana Ratu Bilqis dipindahkan dari Yaman ke Palestina dalam sekejap mata (sebelum kedipan mata)"
    ],
    "ibrah": [
      "Puncak rasa syukur: Kekayaan melimpah dan kekuasaan mutlak tidak menjadikannya sombong melainkan kian merunduk bersujud (Hadza min fadhli Rabbi)",
      "Kepedulian pemimpin terhadap rakyat terkecil: Menyayangi semut kecil di tanah dan tidak merusak alam dalam mobilisasi kekuasaan",
      "Diplomasi berwibawa: Mengedepankan surat perdamaian dan pertukaran gagasan rasional sebelum menempuh jalan konfrontasi militer",
      "Batasan makhluk: Mematahkan mitos perdukunan dan membuktikan bahwa bangsa jin sama sekali tidak mengetahui masa depan ghaib"
    ],
    "keteladanan": [
      "Selalu bersyukur atas setiap nikmat kepintaran, harta, dan kemudahan hidup.",
      "Menyayangi binatang dan tidak menyiksa makhluk hidup yang lebih kecil.",
      "Menjadi pemimpin yang adil, teliti, dan bijaksana dalam mengambil keputusan.",
      "Menggunakan kelebihan diri untuk menolong sesama dan menegakkan agama Allah."
    ],
    "dalilKunci": {
      "surah": "An-Naml",
      "ayat": "19",
      "arab": "فَتَبَسَّمَ ضَاحِكًا مِّن قَوْلِهَا وَقَالَ رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ",
      "arti": "Maka dia tersenyum dengan tertawa karena (mendengar) perkataan semut itu. Dan dia berdoa: 'Ya Tuhanku berilah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada dua orang ibu bapakku'."
    }
  },
  {
    "nomorUrut": 19,
    "nama": "Nabi Ilyas as",
    "namaArab": "إِلْيَاسُ عَلَيْهِ السَّلَام",
    "gelar": "Rasul Penumpas Berhala Ba'al / Al-Ghayyur 'ala Dinillah (Pencemburu Agama Allah)",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 910 - 850 SM (Era Raja Ahab & Ratu Izebel di Israel Utara)",
    "tempatDakwah": "Kota Baalbek (Lebanon / Syam) dan wilayah Israel Utara (Samaria)",
    "usia": "Sekitar 60 - 80 tahun",
    "sebutan": "Nabi yang menentang kemusyrikan kultus patung emas Ba'al",
    "ayatAlquran": "Q.S. Ash-Shaffat: 123-132, Q.S. Al-An'am: 85",
    "keluarga": {
      "ayahIbu": "Yasin bin Finhas bin Al-'Izar bin Nabi Harun as",
      "pasangan": "Wanita shalihah di pedalaman Syam",
      "anakKeturunan": "Menurunkan garis pejuang tauhid di bumi Syam",
      "tokohKeluargaTerkait": "Nabi Harun as (kakek buyutnya) dan Nabi Ilyasa' as (anak angkat sekaligus murid dan penerus risalahnya)",
      "catatanKeluarga": "Berasal dari trah keimaman Harun yang teguh memelihara kemurnian ajaran Taurat dari kontaminasi budaya berhala Kan'an."
    },
    "umat": {
      "namaKaum": "Penduduk kota Baalbek (Ba'labak di Lebanon) dan Bani Israil",
      "wilayah": "Lembah Bekaa (Lebanon) dan Samaria (Palestina)",
      "karakterKaum": "Tersesat memuja patung berhala emas raksasa bernama 'Ba'al' di bawah hasutan raja lalim Ahab dan istrinya yang jahat Izebel",
      "penolakanDanUjian": "Mengejar dan mengancam membunuh Nabi Ilyas hingga beliau harus bersembunyi di gua-gua gunung selama bertahun-tahun dalam keprihatinan",
      "kesudahanKaum": "Ditimpa bencana kekeringan ekstrem dan paceklik kelaparan selama 3 tahun berturut-turut hingga ternak musnah, baru kemudian memohon doa Ilyas."
    },
    "sejarahLengkap": "Nabi Ilyas as (Elia) diutus kepada penduduk kota Baalbek di wilayah Lebanon sekarang. Kota megah itu dinamai sesuai berhala terbesar yang mereka sembah: patung berhala emas raksasa bernama Ba'al. Para penguasa dan rakyatnya telah meninggalkan ajaran tauhid Taurat dan beralih mempersembahkan korban-korban syirik kepada Ba'al.\n\nNabi Ilyas tampil memperingatkan mereka dengan lantang sebagaimana direkam dalam Al-Qur'an: 'Mengapa kamu menyembah Ba'al dan kamu tinggalkan sebaik-baik Pencipta? (Yaitu) Allah Tuhanmu dan Tuhan bapak-bapakmu yang terdahulu?' Namun raja dan kaumnya mendustakan peringatan tersebut dan mengorganisir pasukan untuk membunuh Ilyas. Beliau terpaksa mengungsi dan bersembunyi di gua-gua Gunung Karmel dan lembah terjal selama bertahun-tahun, di mana Allah memeliharanya dengan mengutus burung gagak membawakan makanan dan rezeki.\n\nAtas doa Nabi Ilyas, Allah menahan turunnya hujan selama tiga tahun penuh. Negeri Baalbek dilanda kemarau membakar, sumur-sumur mengering, ladang gandum terbakar panas, dan ribuan orang mati kelaparan. Ratusan pendeta berhala Ba'al menggelar ritual pemujaan memohon hujan namun tak ada setetes air pun yang turun. Menyadari ketidakberdayaan tuhan palsu mereka, kaumnya mencari Nabi Ilyas dan berjanji akan beriman jika hujan turun.\n\nNabi Ilyas berdoa kepada Allah memohon diturunkannya hujan rahmat. Langit tiba-tiba menggelap dan hujan lebat tercurah memulihkan tanah yang tandus. Dalam pengasingannya, Ilyas sempat singgah di rumah seorang janda miskin yang memiliki anak laki-laki yang sedang sakit keras bernama Ilyasa'. Atas doa Ilyas, anak itu sembuh dan kelak diangkat menjadi murid setia yang menemani dakwahnya. Sayangnya, setelah kemakmuran pulih, sebagian besar kaum Baalbek kembali ingkar kepada syariat, hingga azab kehancuran menimpa mereka.",
    "ringkasanKisah": "Nabi Ilyas diutus kepada kaum penyembah berhala Ba'al di Baalbek (Lebanon). Menghadapi ancaman pembunuhan dari penguasa kafir dengan mengungsi di gua. Membuktikan kebatilan berhala lewat kemarau panjang 3 tahun yang baru berakhir setelah doa beliau. Mendidik Nabi Ilyasa' sebagai penerus dakwah tauhid.",
    "mukjizat": [
      "Doanya menahan dan mendatangkan hujan berkah setelah 3 tahun masa kemarau dan kekeringan dahsyat",
      "Selamat berulang kali dari kejaran pasukan pembunuh raja tiran Ahab",
      "Menyembuhkan pemuda Ilyasa' yang sakit parah hingga pulih dan menjadi nabi penerusnya",
      "Keberkahan bekal makanan seorang janda miskin yang tidak habis dikonsumsi selama berhari-hari"
    ],
    "ibrah": [
      "Keteguhan tauhid di tengah mayoritas sesat: Tidak gentar menyuarakan kebenaran seorang diri di hadapan masyarakat yang menyembah berhala",
      "Sifat manusia yang mudah lupa nikmat: Manusia seringkali bertaubat saat tertimpa bencana namun kembali bermaksiat saat hidup makmur",
      "Kaderisasi dan regenerasi: Mendidik murid (Nabi Ilyasa') dengan keteladanan nyata untuk melanjutkan estafet perjuangan",
      "Pertolongan Allah bagi hamba yang sabar di kala kesempitan dan pengasingan"
    ],
    "keteladanan": [
      "Teguh memegang prinsip kebenaran dan tidak ikut-ikutan tren buruk.",
      "Sabar dan tawakal saat menghadapi tekanan dari teman sebaya.",
      "Senantiasa bersyukur dan tidak melupakan janji setelah kesulitan berlalu.",
      "Berbakti membimbing adik kelas atau teman yang membutuhkan bantuan belajar."
    ],
    "dalilKunci": {
      "surah": "Ash-Shaffat",
      "ayat": "125-126",
      "arab": "أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ ۝ اللَّهَ رَبَّكُمْ وَرَبَّ آبَائِكُمُ الْأَوَّلِينَ",
      "arti": "Patutkah kamu menyembah Ba'al dan kamu tinggalkan sebaik-baik Pencipta? (yaitu) Allah Tuhanmu dan Tuhan bapak-bapakmu yang terdahulu?"
    }
  },
  {
    "nomorUrut": 20,
    "nama": "Nabi Ilyasa' as",
    "namaArab": "الْيَسَعُ عَلَيْهِ السَّلَام",
    "gelar": "Penerus Estafet Nabi Ilyas / Al-Mubarak / Minal Akhyar (Orang Pilihan Terbaik)",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 850 - 785 SM (Era Kerajaan Israel Utara)",
    "tempatDakwah": "Wilayah Syam, Samaria, dan lembah Yordania",
    "usia": "Sekitar 90 tahun",
    "sebutan": "Murid teladan yang menjaga syariat dan membimbing raja-raja yang bertaubat",
    "ayatAlquran": "Q.S. Al-An'am: 86, Q.S. Shad: 48",
    "keluarga": {
      "ayahIbu": "Akhthub bin 'Ajuz",
      "pasangan": "Wanita shalihah di Samaria",
      "anakKeturunan": "Menurunkan generasi ulama dan ahli kitab di kalangan Bani Israil",
      "tokohKeluargaTerkait": "Nabi Ilyas as (ayah angkat spiritual, guru, dan pembimbing dakwahnya)",
      "catatanKeluarga": "Teladan adab santri/murid yang berbakti penuh kesetiaan mengabdi mendampingi sang guru hingga akhir hayat."
    },
    "umat": {
      "namaKaum": "Bani Israil di wilayah Israel Utara (Samaria) dan Syam",
      "wilayah": "Palestina Utara, Damaskus, dan lembah Yordania",
      "karakterKaum": "Masyarakat Bani Israil yang berwatak labil, mudah terombang-ambing antara ketaatan tauhid dan godaan materi peradaban sekitarnya",
      "penolakanDanUjian": "Tantangan menegakkan syariat Taurat pasca wafatnya Nabi Ilyas di tengah intrik perebutan kekuasaan politik internal kerajaan",
      "kesudahanKaum": "Selama Nabi Ilyasa' hidup memimpin, rakyat hidup dalam kedamaian, keamanan dari invasi musuh asing, dan kemakmuran berkah."
    },
    "sejarahLengkap": "Nabi Ilyasa' as (Elisa) pada masa mudanya didera penyakit parah menahun yang membuat tubuhnya kurus lemah tak berdaya. Ketika Nabi Ilyas as singgah di kediaman ibunya saat menghindari kejaran penguasa zalim, sang ibu memohon doa kesembuhan untuk putranya. Nabi Ilyas mendoakan Ilyasa' kepada Allah, dan seketika penyakitnya sembuh total tanpa bekas. Takjub akan mukjizat tersebut, Ilyasa' memutuskan mengabdikan seluruh sisa hidupnya untuk berguru, mendampingi, dan berkhidmat kepada Nabi Ilyas.\n\nIlyasa' belajar Taurat, hikmah kenabian, dan akhlak dakwah secara langsung dari sang guru. Ketika Nabi Ilyas wafat (atau diangkat Allah), kepemimpinan risalah dakwah Bani Israil diserahkan kepada Nabi Ilyasa'. Beliau diangkat Allah menjadi nabi dan rasul untuk melanjutkan pembinaan spiritual umat.\n\nNabi Ilyasa' dikenal sebagai nabi yang penuh karamah mukjizat: beliau menyembuhkan orang berpenyakit lepra kusta, menyehatkan sumber mata air beracun di Yerikho dengan melempar segenggam garam sehingga airnya menjadi tawar dan subur, serta melipatgandakan sebotol kecil minyak zaitun milik janda miskin yang terlilit hutang hingga mampu mengisi puluhan tempayan besar dan melunasi seluruh hutangnya.\n\nBeliau memimpin umat dengan kesabaran luar biasa, memberikan nasihat berani kepada para raja, dan menjaga persatuan bangsa dari ancaman invasi tentara Aramia (Suriah Kuno). Di dalam Al-Qur'an, Allah memuji Nabi Ilyasa' bersama nabi-nabi agung lainnya sebagai figur-figur pilihan terbaik (wa kullun fadh-dhalna 'alal 'alamin).",
    "ringkasanKisah": "Murid setia Nabi Ilyas yang sembuh dari sakit parah berkat doa sang guru. Melanjutkan estafet kenabian membimbing Bani Israil di Syam. Memiliki banyak mukjizat penyembuhan, melipatgandakan minyak janda miskin, memurnikan mata air beracun, dan dipuji Allah sebagai hamba pilihan terbaik.",
    "mukjizat": [
      "Menyembuhkan orang yang menderita kusta/lepra kronis atas izin Allah Swt",
      "Memurnikan sumber mata air pahit beracun menjadi air tawar yang menyehatkan dan menyuburkan tanaman",
      "Melipatgandakan sedikit minyak zaitun seorang janda miskin hingga mampu melunasi seluruh tanggungan hutang",
      "Menghidupkan kembali anak kecil yang telah meninggal dunia atas izin Allah Swt"
    ],
    "ibrah": [
      "Adab dan loyalitas seorang murid: Menghormati guru, menyerap ilmunya dengan tawadhu', dan meneruskan cita-cita dakwahnya",
      "Kepedulian sosial kepada kaum dhuafa: Membantu janda miskin dan rakyat kecil menyelesaikan beban kesulitan hidup mereka",
      "Istiqamah menjaga warisan kebaikan: Meneruskan program perbaikan moral masyarakat meski tantangan zaman kian kompleks",
      "Kemuliaan akhlak minal akhyar: Menjadi teladan integritas moral yang diakui kawan maupun lawan"
    ],
    "keteladanan": [
      "Hormat, patuh, dan menjaga adab kepada guru yang mendidik.",
      "Suka menolong teman dan orang miskin yang terlilit kesulitan.",
      "Menjaga amanah kepemimpinan dan tugas yang diwariskan dengan sebaik-baiknya.",
      "Tawadhu' dan tidak menyombongkan kelebihan ilmu yang dimiliki."
    ],
    "dalilKunci": {
      "surah": "Shad",
      "ayat": "48",
      "arab": "وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ ۖ وَكُلٌّ مِّنَ الْأَخْيَارِ",
      "arti": "Dan ingatlah akan Ismail, Ilyasa' dan Zulkifli. Semuanya termasuk orang-orang yang paling baik."
    }
  },
  {
    "nomorUrut": 21,
    "nama": "Nabi Yunus as",
    "namaArab": "يُونُسُ عَلَيْهِ السَّلَام",
    "gelar": "Dzan-Nun (Pemilik Ikan Paus) / Shahibul Hut / Teladan Taubat & Tasbih",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 820 - 750 SM (Era Kerajaan Asyur / Assyria)",
    "tempatDakwah": "Kota Ninawa (Nineveh, dekat Mosul di Irak Utara) dan Laut Mediterania",
    "usia": "Sekitar 70 - 75 tahun",
    "sebutan": "Satu-satunya kaum nabi yang seluruh penduduknya bertaubat dan diselamatkan Allah",
    "ayatAlquran": "Q.S. Al-Anbiya: 87-88, Q.S. Yunus: 98, Q.S. Ash-Shaffat: 139-148, Q.S. Al-Qalam: 48-50",
    "keluarga": {
      "ayahIbu": "Matta (dikenal Yunus bin Matta, dinisbatkan kepada ibunya yang shalihah)",
      "pasangan": "Wanita shalihah di Ninawa",
      "anakKeturunan": "Menurunkan generasi beriman di kawasan Mesopotamia",
      "tokohKeluargaTerkait": "Berasal dari keturunan Nabi Ya'qub as dari suku Bunyamin",
      "catatanKeluarga": "Doa ibunya sejak dalam kandungan memohon anak yang shalih dan bermanfaat bagi umat."
    },
    "umat": {
      "namaKaum": "Penduduk kota metropolis Ninawa (Nineveh di Irak Kuno, berjumlah lebih dari 100.000 jiwa)",
      "wilayah": "Ninawa / Mosul (Irak Utara)",
      "karakterKaum": "Penyembah berhala patung Ishtar dan dewa-dewa Asyur, sombong akan kekayaan niaga dan kekuatan benteng kota mereka",
      "penolakanDanUjian": "Berdakwah selama 33 tahun hanya mendapat dua orang pengikut; Yunus merasa putus asa lalu meninggalkan kaumnya dalam keadaan marah sebelum ada izin hijrah dari Allah",
      "kesudahanKaum": "Ketika tanda azab awan hitam mengepung kota, seluruh 100.000 penduduk Ninawa serentak bertaubat, menangis memakai kain karung, hingga Allah mencabut azab dari mereka."
    },
    "sejarahLengkap": "Nabi Yunus bin Matta as diutus membimbing penduduk kota metropolitan Ninawa yang berpenduduk lebih dari 100.000 orang. Selama puluhan tahun berdakwah dengan gigih, kaumnya tetap membangkang dan memperolok ancamannya. Merasa dada sesak dan kecewa atas kebebalan mereka, Yunus mengancam bahwa azab Allah akan turun dalam tiga hari, lalu beliau pergi meninggalkan kota dalam keadaan marah (ghadban) tanpa menunggu instruksi wahyu Allah.\n\nYunus menaiki sebuah kapal layar di pelabuhan menuju lautan luas. Di tengah samudra lepas, badai ombak dahsyat mengamuk dan kapal terancam karam akibat kelebihan muatan. Kapten kapal memutuskan melempar salah satu penumpang melalui undian. Nama Yunus keluar pada undian pertama. Para awak yang melihat keshalihannya menolak dan mengulang undian hingga tiga kali, namun nama Yunus selalu keluar. Sadar ini adalah teguran Allah atas tindakannya meninggalkan umat tanpa izin, Yunus dengan ikhlas melompat ke dalam gelombang samudra yang gelap gulita.\n\nAllah memerintahkan seekor ikan paus raksasa (Al-Hut) menelan tubuh Yunus bulat-bulat tanpa mematahkan tulangnya atau melukai dagingnya. Di dalam tiga lapisan kegelapan pekat (kegelapan perut ikan, kegelapan dasar lautan, dan kegelapan malam), Yunus bersujud dan memanjatkan doa istighfar paling tulus yang menggetarkan para malaikat di langit: 'La ilaha illa Anta subhanaka inni kuntu minaz-zhalimin' (Tidak ada Tuhan selain Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim).\n\nAllah mengabulkan taubatnya dan memerintahkan ikan paus memuntahkan tubuh Yunus yang lemas tak berdaya ke pantai pasir yang tandus. Allah menumbuhkan sebatang pohon sejenis labu (syajaratan min yaqthin) yang berdaun lebar menaungi tubuhnya dari sengatan matahari dan getahnya menjadi obat penyembuh. Setelah sembuh, Yunus kembali ke Ninawa dan tertegun kagum: ternyata seluruh penduduk kota telah bertaubat total dan menyambut sang nabi dengan penuh hormat.",
    "ringkasanKisah": "Nabi Yunus as meninggalkan kaumnya di Ninawa karena marah atas penolakan mereka. Di tengah laut, beliau diundi dan dilempar ke ombak, lalu ditelan ikan paus raksasa. Di dalam perut ikan, beliau melantunkan doa tasbih dan pengakuan dosa hingga diselamatkan Allah ke pantai dan mendapati seluruh 100.000 kaumnya telah bertaubat.",
    "mukjizat": [
      "Bertahan hidup dalam keadaan bernapas dan selamat di dalam perut ikan paus raksasa selama berhari-hari di dasar laut tanpa terluka sedikit pun",
      "Doa istighfar dan tasbihnya menembus langit hingga didengar malaikat dan menyelamatkannya dari kematian",
      "Ditanamkannya pohon yaqthin (sejenis labu) yang tumbuh instan menaungi dan mengobati kulitnya di tepi pantai",
      "Satu-satunya nabi yang dakwahnya berhasil membuat seluruh 100.000 lebih penduduk kota serentak bertaubat kepada Allah"
    ],
    "ibrah": [
      "Pantang berputus asa dalam mendidik: Menahan emosi dan tidak boleh tergesa-gesa meninggalkan tugas sebelum ada perintah yang jelas",
      "Kedahsyatan doa pengakuan dosa (tasbih Yunus): Mengakui kezaliman diri di hadapan keagungan Allah adalah kunci pembuka pintu jalan keluar dari segala musibah pelik",
      "Pintu taubat selalu terbuka: Kasih sayang Allah mendahului murka-Nya bagi siapa pun yang bertaubat dengan tulus",
      "Tunduk pada teguran ilahi: Kerendahan hati menerima kritik dan memperbaiki langkah hidup"
    ],
    "keteladanan": [
      "Tidak mudah marah dan pantang menyerah dalam menghadapi kesulitan belajar.",
      "Segera mengakui kesalahan dan membaca doa istighfar Nabi Yunus saat berbuat khilaf.",
      "Berprasangka baik bahwa masa depan bisa berubah menjadi lebih baik.",
      "Menghargai proses pembinaan dan sabar menghadapi kekurangan teman."
    ],
    "dalilKunci": {
      "surah": "Al-Anbiya",
      "ayat": "87",
      "arab": "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      "arti": "Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku adalah termasuk orang-orang yang zalim."
    }
  },
  {
    "nomorUrut": 22,
    "nama": "Nabi Zakaria as",
    "namaArab": "زَكَرِيَّا عَلَيْهِ السَّلَام",
    "gelar": "Kafilu Maryam (Pengasuh Wanita Suci Maryam) / Imam Mihrab Baitul Maqdis",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 100 SM - 20 M (Era Pendudukan Kekaisaran Romawi di Yudea)",
    "tempatDakwah": "Yerusalem / Baitul Maqdis (Palestina)",
    "usia": "Sekitar 95 - 120 tahun",
    "sebutan": "Nabi ahli pertukangan kayu dan teladan doa tanpa putus asa di usia senja",
    "ayatAlquran": "Q.S. Maryam: 1-11, Q.S. Ali 'Imran: 37-41, Q.S. Al-Anbiya: 89-90",
    "keluarga": {
      "ayahIbu": "Dan bin Muslim bin Shaduq (garis keturunan dari Nabi Sulaiman bin Daud as)",
      "pasangan": "Isya' (Elisabeth) binti Faqudz (wanita mandul yang sudah lanjut usia, saudari kandung Hannah ibu Maryam)",
      "anakKeturunan": "Dikaruniai putra tunggal yang agung: Nabi Yahya as",
      "tokohKeluargaTerkait": "Maryam binti Imran (anak asuh yang dirawat di mihrab) dan Nabi Isa as (cucu keponakan istrinya)",
      "catatanKeluarga": "Keluarga penjaga Baitul Maqdis yang hidup dalam mihrab ibadah, kesucian akhlak, dan kepasrahan total kepada Allah."
    },
    "umat": {
      "namaKaum": "Bani Israil di bawah dominasi penjajahan imperium Romawi dan boneka Raja Herodes",
      "wilayah": "Yerusalem / Baitul Maqdis (Palestina)",
      "karakterKaum": "Para pemuka agama Yahudi yang banyak terjebak formalisme hukum kaku, kemunafikan, dan komersialisasi ibadah kuil",
      "penolakanDanUjian": "Ujian kesabaran puluhan tahun menanti keturunan, serta fitnah keji dari orang-orang zalim hingga beliau wafat syahid saat dikejar pasukan tiran",
      "kesudahanKaum": "Allah melimpahkan keberkahan kelahiran Nabi Yahya as sebagai penyambung risalah tauhid di Baitul Maqdis."
    },
    "sejarahLengkap": "Nabi Zakaria as adalah seorang nabi yang juga bekerja mencari nafkah sebagai tukang kayu yang bersahaja dan jujur. Beliau adalah imam besar dan penjaga kunci Baitul Maqdis. Ketika Hannah (istri Imran) melahirkan Maryam dan menyerahkannya untuk berkhidmat di Baitul Maqdis, para pemuka agama berebut ingin mengasuhnya. Zakaria terpilih menjadi wali pengasuh Maryam setelah pena undiannya tetap mengapung melawan arus air sungai.\n\nZakaria membuatkan mihrab khusus yang suci untuk Maryam. Setiap kali Zakaria memasuki mihrab, beliau takjub mendapati buah-buahan musim dingin tersedia di musim panas, dan buah-buahan musim panas tersedia di musim dingin. Ketika ditanya, Maryam menjawab tenang: 'Itu dari sisi Allah, sesungguhnya Allah memberi rezeki kepada siapa yang dikehendaki-Nya tanpa hisab.'\n\nMenyaksikan mukjizat rezeki tersebut, timbullah getaran kerinduan di hati Zakaria untuk memohon keturunan yang akan meneruskan risalah dakwahnya. Beliau menyadari rambutnya telah memutih penuh uban, tulangnya telah rapuh, dan istrinya mandul. Di dalam mihrab, Zakaria berdoa dengan suara lembut penuh kepasrahan: 'Rabbi habli min ladunka dzurriyyatan thayyibah' (Ya Tuhanku, berilah aku dari sisi-Mu seorang anak yang baik). Beliau khawatir sepeninggalnya tidak ada lagi orang yang membimbing Bani Israil dalam jalan kebenaran.\n\nKetika beliau sedang berdiri shalat di mihrab, para malaikat menyerunya menyampaikan kabar gembira: Allah menganugerahkannya seorang putra bernama Yahya, nama yang belum pernah diberikan kepada siapa pun sebelumnya. Zakaria memohon tanda kepastian, lalu Allah menetapkan tandanya: beliau tidak dapat berbicara dengan manusia selama tiga hari tiga malam kecuali dengan bahasa isyarat, dan diperintahkan memperbanyak tasbih di waktu pagi dan petang. Yahya pun lahir sebagai berkah suci bagi semesta.",
    "ringkasanKisah": "Imam Baitul Maqdis dan pengasuh Siti Maryam yang bekerja sebagai tukang kayu. Meskipun telah berusia sangat senja (hampir 100 tahun) dan istrinya mandul, beliau tidak pernah putus asa berdoa memohon keturunan shalih. Doanya dikabulkan Allah dengan kelahiran Nabi Yahya as.",
    "mukjizat": [
      "Dikaruniai putra shalih (Nabi Yahya as) pada usia sangat lanjut (hampir 100 tahun) dari seorang istri yang mandul atas mukjizat doa",
      "Menyaksikan hidangan buah-buahan surga di luar musimnya selalu tersedia di dalam mihrab anak asuhnya, Maryam binti Imran",
      "Tanda kenabian berupa tertahannya lisan dari berbicara selama tiga hari kecuali dengan isyarat saat menerima kabar gembira kehamilan istrinya",
      "Pena kayunya mengapung dan bergerak melawan arus sungai saat undian pengasuhan Maryam"
    ],
    "ibrah": [
      "Optimisme doa tanpa batas logika manusia: Tidak ada kata terlambat atau mustahil bagi kekuasaan Allah Swt",
      "Adab berdoa dengan suara lembut (nida'an khafiyya): Memanjatkan doa dengan ketulusan hati yang khusyuk dan penuh pengharapan",
      "Amanah mengasuh generasi shalih: Menjaga kesucian dan pendidikan anak asuh dengan penuh rasa tanggung jawab",
      "Kemandirian nafkah: Seorang ulama/nabi tidak segan bekerja keras sebagai tukang kayu untuk menafkahi keluarga"
    ],
    "keteladanan": [
      "Tidak pernah bosan dan putus asa dalam berdoa kepada Allah.",
      "Rajin bekerja keras dan tidak gengsi melakukan pekerjaan halal.",
      "Menyayangi dan mendidik anak-anak kecil dengan penuh kelembutan.",
      "Menjaga adab kesopanan dalam berdoa dan berbicara."
    ],
    "dalilKunci": {
      "surah": "Maryam",
      "ayat": "4",
      "arab": "قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا",
      "arti": "Ia berkata: 'Ya Tuhanku, sesungguhnya tulangku telah lemah dan kepalaku telah ditumbuhi uban, dan aku belum pernah kecewa dalam berdoa kepada Engkau, ya Tuhanku'."
    }
  },
  {
    "nomorUrut": 23,
    "nama": "Nabi Yahya as",
    "namaArab": "يَحْيَىٰ عَلَيْهِ السَّلَام",
    "gelar": "Al-Hasur (Hamba Suci Terbebas dari Syahwat Maksiat) / Syahidul Haq / Sayyidan wa Hasuran wa Nabiyyan",
    "isUlulAzmi": false,
    "periodeKaum": "Sekitar 1 SM - 30 M (Sezaman dengan Nabi Isa as)",
    "tempatDakwah": "Palestina, Lembah Yordania, dan Yerusalem",
    "usia": "Sekitar 30 - 33 tahun",
    "sebutan": "Nabi yang diberi hikmah kenabian sejak masa kanak-kanak dan wafat syahid membela syariat",
    "ayatAlquran": "Q.S. Maryam: 12-15, Q.S. Ali 'Imran: 38-39, Q.S. Al-Anbiya: 90",
    "keluarga": {
      "ayahIbu": "Nabi Zakaria as dan Isya' (Elisabeth)",
      "pasangan": "Hidup membujang (hasur), memusatkan seluruh usianya untuk ibadah dan dakwah",
      "anakKeturunan": "Tidak memiliki keturunan karena wafat muda dalam keadaan syahid membela kesucian syariat",
      "tokohKeluargaTerkait": "Nabi Zakaria as (ayahanda tercinta) dan Nabi Isa as (saudara sepupu satu generasi)",
      "catatanKeluarga": "Namanya ('Yahya' = yang hidup) diberikan langsung oleh Allah dari langit sebelum beliau dilahirkan."
    },
    "umat": {
      "namaKaum": "Bani Israil dan penguasa tiran Yudea (Raja Herodes Antipas)",
      "wilayah": "Tepian Sungai Yordan dan Baitul Maqdis (Palestina)",
      "karakterKaum": "Masyarakat yang mengalami degradasi moral di bawah pengaruh dekadensi Romawi; para elit istana gemar pesta pora dan melanggar batas-batas pernikahan syar'i",
      "penolakanDanUjian": "Berani menentang rencana pernikahan inses terlarang Raja Herodes yang hendak menikahi keponakannya sendiri (Herodias/Salome), hingga Yahya dipenjara dan dipenggal lehernya",
      "kesudahanKaum": "Nabi Yahya wafat syahid sebagai pahlawan kebenaran, dan kerajaan Herodes kelak diruntuhkan Romawi dalam kehinaan."
    },
    "sejarahLengkap": "Nabi Yahya as lahir sebagai bukti nyata kekuasaan Allah atas doa Nabi Zakaria. Namanya dipilih langsung oleh Allah, belum pernah ada orang bernama Yahya sebelumnya. Sejak masih berusia kanak-kanak, Yahya tidak pernah tertarik dengan permainan anak-anak sebayanya. Ketika diajak bermain, beliau menjawab bijak: 'Bukan untuk bermain-main aku diciptakan.' Allah Swt menganugerahkannya kecerdasan memahami Kitab Taurat dan hikmah kenabian sejak usia belia (wa atainahul hukma shabiyya).\n\nYahya dikenal memiliki hati yang sangat lembut, penuh belas kasih kepada manusia dan satwa liar, gemar menangis karena takut kepada Allah, dan hidup sangat zuhud. Beliau sering mengasingkan diri beribadah di lembah Sungai Yordan, mengenakan pakaian sederhana dari bulu unta, dan memakan pucuk dedaunan serta madu hutan. Satwa liar gurun pun tunduk dan jinak di dekatnya. Beliau berkhutbah mengajak Bani Israil bertaubat dan menyucikan diri dari noda dosa (pembaptisan/syariat thaharah masa itu).\n\nKeberanian moral Yahya teruji saat Raja Herodes Antipas berniat menikahi anak tirinya/keponakannya sendiri demi nafsu birahi dan persekutuan politik. Pernikahan inses ini diharamkan secara tegas dalam hukum Taurat. Para pemuka agama lain memilih bungkam karena takut kepada raja, namun Nabi Yahya berdiri tegak di hadapan istana dan mengharamkan pernikahan tersebut secara terbuka: 'Pernikahan itu tidak halal bagimu!'\n\nIbu sang putri (Herodias) sangat dendam kepada Yahya. Saat raja mabuk dalam pesta ulang tahun dan terpikat oleh tarian erotis sang putri, raja berjanji mengabulkan permintaan apa pun darinya. Atas bisikan ibunya, sang putri meminta kepala Yahya di atas nampan emas. Yahya yang sedang shalat di penjara dieksekusi pancung oleh algojo istana. Beliau wafat syahid di usia muda, dan Allah memujinya dengan salam keselamatan pada hari lahirnya, hari wafatnya, dan hari kebangkitannya.",
    "ringkasanKisah": "Putra Nabi Zakaria yang dianugerahi hikmah kenabian sejak usia belia. Hidup zuhud, lemah lembut, dan suci dari maksiat. Memiliki integritas keberanian luar biasa menegur pernikahan inses Raja Herodes yang melanggar syariat Taurat, hingga beliau wafat syahid dipenggal di penjara.",
    "mukjizat": [
      "Diberi karunia hikmah ilmu kenabian, pemahaman mendalam Taurat, dan wibawa sejak usia masih kanak-kanak (wa atainahul hukma shabiyya)",
      "Memiliki kesucian batin (hananan wa zakatan) dan terjaga dari godaan maksiat syahwat (hasuran)",
      "Satwa liar dan burung-burung di gurun pasir tunduk dan bersahabat dengannya saat beliau berdzikir",
      "Mendapat salam penghormatan dan keselamatan langsung dari Allah Swt di hari lahir, wafat, dan kebangkitannya"
    ],
    "ibrah": [
      "Integritas moral tanpa kompromi: Berani menyuarakan kebenaran syariat di hadapan penguasa tiran meskipun nyawa menjadi taruhannya",
      "Kematangan karakter sejak belia: Memanfaatkan masa muda untuk belajar, beribadah, dan menempa kematangan pribadi",
      "Kesucian diri (zuhud): Tidak tergiur oleh gemerlap pangkat, wanita, dan harta materi duniawi",
      "Kemuliaan mati syahid: Gugur membela kehormatan hukum Allah adalah puncak kemenangan abadi seorang pejuang kebenaran"
    ],
    "keteladanan": [
      "Fokus belajar dan tidak menghabiskan waktu muda untuk hal-hal sia-sia.",
      "Berani berkata jujur dan benar meskipun tidak disukai orang lain.",
      "Menjaga kesucian diri dan menghormati batasan pergaulan.",
      "Menyayangi binatang dan menjaga kelestarian alam sekitar."
    ],
    "dalilKunci": {
      "surah": "Maryam",
      "ayat": "12-13",
      "arab": "يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ ۖ وَآتَيْنَاهُ الْحُكْمَ صَبِيًّا ۝ وَحَنَانًا مِّن لَّدُنَّا وَزَكَاةً ۖ وَكَانَ تَقِيًّا",
      "arti": "Hai Yahya, ambillah Al-Kitab (Taurat) itu dengan sungguh-sungguh. Dan Kami berikan kepadanya hikmah selagi ia masih kanak-kanak, dan rasa belas kasihan yang mendalam dari sisi Kami dan kesucian (dan dosa). Dan ia adalah seorang yang bertakwa."
    }
  },
  {
    "nomorUrut": 24,
    "nama": "Nabi Isa as",
    "namaArab": "عِيسَى عَلَيْهِ السَّلَام",
    "gelar": "Al-Masih / Ruhullah / Kalimatullah / Sayyiduna 'Isa ibnu Maryam / Rasul Ulul Azmi",
    "isUlulAzmi": true,
    "periodeKaum": "Sekitar 1 SM - 33 M (Era Kekaisaran Romawi Kuno)",
    "tempatDakwah": "Palestina, Nazaret, Danau Galilea, dan Baitul Maqdis (Yerusalem)",
    "usia": "Diangkat ke langit pada usia 33 tahun (akan turun kembali di akhir zaman)",
    "sebutan": "Nabi yang lahir tanpa ayah dari wanita suci Maryam dan pembawa Kitab Suci Injil",
    "ayatAlquran": "Q.S. Maryam: 16-36, Q.S. Ali 'Imran: 45-59, Q.S. Al-Ma'idah: 110-120, Q.S. An-Nisa: 157-158",
    "keluarga": {
      "ayahIbu": "Lahir tanpa perantara ayah manusia dari rahim perawan suci Sayyidah Maryam binti Imran (melalui tiupan Ruh ciptaan Allah lewat Malaikat Jibril)",
      "pasangan": "Belum menikah saat diangkat ke langit",
      "anakKeturunan": "Tidak memiliki keturunan",
      "tokohKeluargaTerkait": "Nabi Yahya as (saudara sepupu) dan Nabi Zakaria as (paman pengasuh ibunya)",
      "catatanKeluarga": "Kelahirannya adalah mukjizat penciptaan agung yang membuktikan kekuasaan mutlak Allah, disamakan dalam Al-Qur'an seperti penciptaan Adam dari tanah."
    },
    "umat": {
      "namaKaum": "Bani Israil era Romawi (para rahib, kaum Farisi, dan penguasa Romawi)",
      "wilayah": "Palestina (Nazaret, Betlehem, Yerusalem, dan Galilea)",
      "karakterKaum": "Para pemuka agama Bani Israil yang mengutamakan hukum lahiriah kaku namun hatinya munafik dan rakus duniawi",
      "penolakanDanUjian": "Dituduh penyihir, difitnah hendak memberontak pada Kaisar Romawi, dan dikonspirasikan untuk disalib di bukit Golgota",
      "kesudahanKaum": "Allah menyelamatkan Isa dengan mengangkatnya hidup-hidup ke langit (Rafa'ahullah), sementara orang yang diserupakan dengannya (Yudas Iskariot) disalib oleh tentara Romawi."
    },
    "sejarahLengkap": "Nabi Isa as dilahirkan secara ajaib dari rahim wanita suci Maryam binti Imran tanpa pernah disentuh oleh lelaki mana pun. Malaikat Jibril mendatangi Maryam dan mengabarkan bahwa Allah akan menganugerahkannya seorang anak laki-laki suci bernama Al-Masih Isa ibnu Maryam. Ketika Maryam melahirkan sendirian di bawah pohon kurma di Betlehem, beliau sempat merasa tertekan oleh tuduhan fitnah keji kaumnya. Namun Allah menenangkannya dengan memancarkan anak sungai di bawah kakinya dan menjatuhkan buah kurma matang.\n\nSaat Maryam kembali ke kaumnya menggendong bayi Isa, orang-orang mencibir: 'Wahai Maryam, sesungguhnya kamu telah membawa sesuatu yang amat mungkar!' Maryam hanya menunjuk kepada bayinya. Mereka berkata heran: 'Bagaimana kami akan berbicara dengan anak kecil yang masih dalam buaian?' Seketika bayi mungil Isa berbicara fasih membela ibunya: 'Inni 'abdullah, ataniyal kitaba wa ja'alani nabiyya' (Sesungguhnya aku ini hamba Allah, Dia memberiku Al-Kitab dan Dia menjadikan aku seorang nabi, dan Dia menjadikan aku seorang yang diberkahi di mana saja aku berada, dan Dia memerintahkan kepadaku mendirikan shalat dan menunaikan zakat selama aku hidup, dan berbakti kepada ibuku).\n\nSetelah dewasa, Nabi Isa menerima Kitab Suci Injil yang membenarkan Taurat dan membawa kabar gembira tentang kedatangan nabi terakhir bernama Ahmad (Muhammad SAW). Dakwahnya didampingi oleh dua belas murid setia yang ikhlas (Al-Hawariyyun). Isa mengajarkan cinta kasih, pembersihan hati dari ketamakan, dan membela kaum papa. Atas izin Allah, Isa dianugerahi mukjizat mencengangkan: membuat burung dari tanah liat lalu ditiup menjadi burung hidup, menyembuhkan orang buta sejak lahir, memulihkan penderita lepra/kusta seketika, menghidupkan orang mati, hingga menurunkan jamuan hidangan lezat langsung dari langit (Al-Ma'idah).\n\nKedengkian para rahib Yahudi memuncak saat rakyat jelata berbondong-bondong mengikutinya. Mereka berkomplot menyuap salah seorang murid pengkhianat (Yudas) dan memfitnah Isa di hadapan Gubernur Romawi Pontius Pilatus. Ketika tentara mengepung tempat persembunyiannya untuk menyalib Isa, Allah menunjukkan kekuasaan-Nya: Allah mengangkat Nabi Isa hidup-hidup ke langit dan menyerupakan wajah serta postur sang pengkhianat menjadi persis seperti Isa. Dialah yang ditangkap dan disalib, sementara Nabi Isa selamat dan akan turun kembali di akhir zaman menegakkan keadilan.",
    "ringkasanKisah": "Lahir tanpa perantara ayah dari Sayyidah Maryam, berbicara saat masih bayi merah membela ibunya. Menerima Kitab Injil, dianugerahi mukjizat menyembuhkan kusta, orang buta sejak lahir, dan menghidupkan orang mati atas izin Allah. Diselamatkan Allah ke langit dari konspirasi pembunuhan dan penyaliban.",
    "mukjizat": [
      "Lahir tanpa ayah dari perawan suci Maryam binti Imran atas kehendak ciptaan Allah Swt (kalimatullah)",
      "Mampu berbicara dengan fasih dan berwibawa membela kesucian ibunya ketika masih bayi merah di dalam buaian",
      "Membentuk burung dari tanah liat lalu ditiupnya dan menjadi burung hidup sungguhan atas izin Allah",
      "Menyembuhkan orang yang buta sejak lahir dan penderita penyakit lepra/kusta kronis seketika atas izin Allah",
      "Menghidupkan kembali orang yang telah mati atas izin Allah Swt",
      "Menurunkan hidangan makanan dan minuman lengkap langsung dari langit (Al-Ma'idah) untuk kaum Hawariyyun",
      "Menerima Kitab Suci Injil dan diangkat hidup-hidup ke langit oleh Allah Swt (selamat dari penyaliban)"
    ],
    "ibrah": [
      "Kekuasaan mutlak Allah: Penciptaan Isa tanpa ayah menunjukkan bahwa Allah Maha Kuasa menciptakan segala sesuatu sesuai kehendak-Nya",
      "Kasih sayang kepada kaum lemah: Mengedepankan cinta kasih, kelembutan, dan pembersihan jiwa dari ketamakan materi duniawi",
      "Keteguhan membela kehormatan orang tua: Berbakti kepada ibu dan membela kehormatan keluarganya di hadapan celaan manusia",
      "Pertolongan Allah kepada hamba yang ikhlas: Allah menyelamatkan rasul-Nya dari tipu daya musuh dan mengangkat derajatnya"
    ],
    "keteladanan": [
      "Sangat menyayangi dan berbakti kepada ibu tercinta.",
      "Bersikap lemah lembut, pemaaf, dan berbelas kasih kepada teman.",
      "Zuhud dan tidak silau oleh kemewahan duniawi.",
      "Teguh beriman dan mempercayai kabar gembira kenabian penutup Nabi Muhammad SAW."
    ],
    "dalilKunci": {
      "surah": "Ali 'Imran",
      "ayat": "49",
      "arab": "أَنِّي قَدْ جِئْتُكُم بِآيَةٍ مِّن رَّبِّكُمْ ۖ أَنِّي أَخْلُقُ لَكُم مِّنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ",
      "arti": "Sesungguhnya aku telah datang kepadamu dengan membawa sesuatu tanda (mukjizat) dari Tuhanmu, yaitu aku membuat untuk kamu dari tanah berbentuk burung; kemudian aku meniupnya, maka ia menjadi seekor burung dengan seizin Allah."
    }
  },
  {
    "nomorUrut": 25,
    "nama": "Nabi Muhammad SAW",
    "namaArab": "مُحَمَّدٌ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
    "gelar": "Khatamun Nabiyyin (Penutup Para Nabi & Rasul) / Sayyidul Mursalin / Habibullah / Rahmatan lil 'Alamin / Al-Amin / Rasul Ulul Azmi Teragung",
    "isUlulAzmi": true,
    "periodeKaum": "571 - 632 M (Tahun Gajah hingga Era Khulafaur Rasyidin)",
    "tempatDakwah": "Makkah Al-Mukarramah, Madinah Al-Munawwarah, Thaif, dan seluruh Jazirah Arab",
    "usia": "63 tahun (wafat 12 Rabi'ul Awwal 11 H di Madinah)",
    "sebutan": "Nabi Terakhir Penutup Seluruh Risalah Langit untuk Seluruh Alam Semesta",
    "ayatAlquran": "Q.S. Al-Ahzab: 21 & 40, Q.S. Al-Anbiya: 107, Q.S. Al-Fath: 28-29, Q.S. At-Taubah: 128, Q.S. Al-Qalam: 4",
    "keluarga": {
      "ayahIbu": "Sayyid Abdullah bin Abdul Muthallib (wafat saat Nabi masih dalam kandungan) dan Sayyidah Aminah binti Wahb (wafat di Al-Abwa saat Nabi berusia 6 tahun). Diasuh ibu susu Halimah As-Sa'diyah, kakek Abdul Muthallib, dan paman Abu Thalib",
      "pasangan": "Sayyidah Khadijah binti Khuwailid (istri pertama tercinta yang setia berkorban harta dan jiwa di masa awal dakwah), serta Ummahatul Mukminin: Saudah, Aisyah binti Abu Bakar, Hafshah binti Umar, Zainab binti Khuzaimah, Ummu Salamah, Zainab binti Jahsy, Juwairiyah, Ummu Habibah, Shafiyyah, Maimunah, dan Mariyah Al-Qibthiyyah",
      "anakKeturunan": "Tiga putra yang wafat saat belia: Al-Qasim, Abdullah, dan Ibrahim; serta empat putri mulia: Zainab, Ruqayyah, Ummu Kultsum, dan Sayyidah Fatimah Az-Zahra (ibunda Sayyid Hasan dan Sayyid Husain, yang menurunkan para habaib dan ahlul bait di seluruh penjuru dunia)",
      "tokohKeluargaTerkait": "Ali bin Abi Thalib (sepupu sekaligus menantu), Hamzah bin Abdul Muthallib (paman bergelar Asadullah / Singa Allah), Abbas bin Abdul Muthallib, Ja'far bin Abi Thalib",
      "catatanKeluarga": "Keluarga teladan suci (Ahlul Bait / Baitun Nubuwwah) yang menjadi rujukan puncak adab, kehangatan kasih sayang rumah tangga sakinah, kedermawanan, dan ketabahan menghadapi duka."
    },
    "umat": {
      "namaKaum": "Kaum Quraisy, seluruh kabilah bangsa Arab, dan seluruh umat manusia serta bangsa Jin hingga hari kiamat (Kaffatan lin-nas)",
      "wilayah": "Makkah Al-Mukarramah, Madinah Al-Munawwarah, Jazirah Arab, dan seruan dakwah ke raja-raja dunia (Romawi, Persia, Habasyah, Mesir)",
      "karakterKaum": "Masyarakat Jahiliyyah yang menyembah 360 berhala di sekeliling Ka'bah, mengubur hidup-hidup bayi perempuan karena aib, fanatisme kesukuan buta (ashabiyyah), riba dan penindasan kaum budak, serta gemar berperang",
      "penolakanDanUjian": "Dituduh gila, penyair dusta, dan tukang sihir; dilempari batu hingga berdarah-darah di Thaif; diboikot total selama 3 tahun di Syi'ib Abu Thalib hingga memakan dedaunan; rencana pembunuhan malam hijrah; serta konfrontasi perang mempertahankan iman (Badar, Uhud, Khandaq, Hunain)",
      "kesudahanKaum": "Fathu Makkah (pembebasan Makkah) terlaksana secara damai tanpa dendam; 360 berhala dirobohkan dari Ka'bah; bangsa Arab berbondong-bondong masuk Islam (afwaja); dan tegaknya peradaban Madinah yang adil, makmur, dan beradab."
    },
    "sejarahLengkap": "Nabi Muhammad SAW lahir pada Tahun Gajah (571 M) di Makkah dalam keadaan yatim. Di masa mudanya, beliau dikenal memiliki kejujuran dan integritas moral yang tak tertandingi hingga seluruh penduduk Makkah memberinya gelar Al-Amin (orang yang sangat terpercaya). Pada usia 25 tahun, beliau menikah dengan wanita bangsawan mulia Sayyidah Khadijah binti Khuwailid.\n\nMenjelang usia 40 tahun, menyaksikan kebobrokan moral masyarakat Jahiliyyah, beliau sering berkhalwat (menyendiri) memohon petunjuk di Gua Hira. Pada malam 17 Ramadhan, Malaikat Jibril turun membawa wahyu pertama: 'Iqra' bismi Rabbikal-ladzi khalaq' (Bacalah dengan menyebut nama Tuhanmu yang menciptakan). Beliau diangkat menjadi rasul penutup zaman.\n\nDakwah dimulai secara sembunyi-sembunyi selama tiga tahun kepada kerabat terdekat (As-Sabiqunal Awwalun), lalu secara terang-terangan di Bukit Shafa. Kaum musyrik Quraisy melancarkan siksaan keji kepada para sahabat (seperti Bilal bin Rabah dan keluarga Yasir), memboikot keluarga Bani Hasyim selama 3 tahun, dan bersekongkol membunuh Nabi. Di saat duka mendalam atas wafatnya Khadijah dan Abu Thalib ('Amul Huzni), Allah menghibur Rasulullah dengan peristiwa agung Isra' Mi'raj menembus Sidratul Muntaha untuk menerima perintah shalat lima waktu.\n\nAtas perintah Allah, Rasulullah memimpin hijrah ke Madinah (Yatsrib). Di Madinah, beliau mempersaudarakan kaum Muhajirin dan Anshar, membangun Masjid Nabawi, dan merumuskan Piagam Madinah (konstitusi tertulis pertama di dunia yang menjamin hak asasi dan kerukunan lintas agama). Setelah melalui berbagai perang mempertahankan eksistensi tauhid (Perang Badar, Uhud, Khandaq), pada tahun ke-8 Hijriyah Rasulullah memimpin 10.000 pasukan membebaskan Makkah (Fathu Makkah). Tanpa meneteskan darah dan tanpa dendam, beliau memaafkan seluruh musuh-musuh lamanya seraya mengumumkan: 'Pergilah, kalian semua bebas!'\n\nPada tahun ke-10 H, beliau menunaikan Haji Wada' (Haji Perpisahan) dan menyampaikan khutbah agung tentang persamaan derajat manusia, penghapusan riba, serta perlindungan hak-hak kaum wanita. Beliau berwasiat: 'Aku tinggalkan kepada kalian dua perkara, yang jika kalian berpegang teguh kepadanya niscaya tidak akan tersesat selamanya: Kitabullah (Al-Qur'an) dan Sunnah Rasul-Nya.' Beliau wafat dengan tenang di pangkuan Sayyidah Aisyah pada usia 63 tahun, meninggalkan warisan peradaban Islam yang menerangi seluruh penjuru dunia.",
    "ringkasanKisah": "Rasulullah penutup para nabi (Khatamun Nabiyyin) dan rahmat bagi seluruh alam semesta. Dikenal bergelar Al-Amin sejak muda, menerima wahyu Al-Qur'an di Gua Hira, berdakwah di Makkah dengan penuh kesabaran menghadapi boikot, hijrah ke Madinah mendirikan peradaban Piagam Madinah, hingga Fathu Makkah yang penuh pemaafan agung.",
    "mukjizat": [
      "Kitab Suci Al-Qur'anul Karim: Mukjizat abadi sepanjang masa yang terpelihara keaslian huruf dan maknanya hingga akhir zaman",
      "Peristiwa Isra' Mi'raj: Melakukan perjalanan malam dari Masjidil Haram ke Masjidil Aqsha lalu menembus Sidratul Muntaha dalam satu malam menerima syariat shalat 5 waktu",
      "Membelah bulan menjadi dua bagian (Insiqaqul Qamar) dengan isyarat telunjuk di hadapan kaum kafir Quraisy",
      "Air memancar deras dari sela-sela jemari tangan beliau yang mencukupi minum dan wudhu ribuan pasukan sahabat yang kehausan",
      "Makanan yang sedikit mampu mengenyangkan ribuan pasukan sahabat saat penggalian parit Perang Khandaq",
      "Batang pohon kurma menangis merintih bagai anak kecil karena rindu mendengar khutbah beliau saat dipindahkan ke mimbar kayu",
      "Doa-doanya mustajab seketika (hujan turun saat khutbah istisqa, kesembuhan mata Ali bin Abi Thalib saat Perang Khaibar)"
    ],
    "ibrah": [
      "Uswatun Hasanah: Menjadikan pribadi Rasulullah SAW sebagai teladan sempurna dalam ibadah, kepemimpinan, perniagaan, dan keluarga",
      "Keluhuran akhlak dan pemaaf agung: Memaafkan orang-orang yang pernah memusuhi dan melukai diri beliau saat mencapai puncak kemenangan (Fathu Makkah)",
      "Rahmatan lil 'Alamin: Menegakkan ajaran Islam yang membawa kedamaian, keadilan sosial, penghapusan rasisme, dan perlindungan kaum dhuafa",
      "Pentingnya ilmu dan literasi: Perintah wahyu pertama 'Iqra' (Bacalah) menegaskan bahwa kemajuan peradaban Islam berpijak pada tradisi membaca dan ilmu",
      "Istiqamah menjaga wasiat Al-Qur'an dan As-Sunnah sebagai pedoman keselamatan hidup dunia dan akhirat"
    ],
    "keteladanan": [
      "Meneladani sifat wajib rasul: Shiddiq (jujur), Amanah (terpercaya), Tabligh (menyampaikan kebaikan), dan Fathanah (cerdas bijaksana).",
      "Pemaaf dan tidak membalas kejahatan dengan kejahatan serupa.",
      "Sangat mencintai orang tua, anak yatim, orang miskin, dan menyayangi sesama makhluk.",
      "Disiplin mendirikan shalat lima waktu dan senantiasa berdzikir kepada Allah."
    ],
    "dalilKunci": {
      "surah": "Al-Ahzab",
      "ayat": "21",
      "arab": "لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ لِّمَن كَانَ يَرْجُو اللَّهَ وَالْيَوْمَ الْآخِرَ وَذَكَرَ اللَّهَ كَثِيرًا",
      "arti": "Sesungguhnya telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari kiamat dan dia banyak menyebut Allah."
    }
  }
];
