/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MateriPembelajaranItem,
  VideoPembelajaranItem,
  GameEdukasiItem,
  TekaTekiSilangItem,
  PuzzleItem,
  SoalLkpdItem
} from "../types/bahanAjarAi";

// =========================================================================
// 1. MATERI PEMBELAJARAN PRESETS
// =========================================================================
export const PRESET_MATERI_LIST: MateriPembelajaranItem[] = [
  // ==================== KELAS VII - GANJIL ====================
  {
    id: "materi-k7-g1-asmaulhusna",
    judul: "Meneladani 4 Asmaul Husna (Al-Alim, Al-Khabir, As-Sami', Al-Bashir)",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    deskripsi: "Memahami hakikat empat Asmaul Husna agung dan mewujudkannya dalam sikap kejujuran, kehati-hatian, serta rasa diawasi Allah SWT.",
    isiMateri: `Mengenal Allah SWT melalui nama-nama-Nya yang indah (Al-Asma' Al-Husna) merupakan fondasi utama keimanan. Empat nama yang dipelajari pada bab ini adalah:
1. Al-'Alim (Yang Maha Mengetahui): Allah mengetahui segala sesuatu, baik yang tampak maupun yang gaib, yang ada di langit maupun di bumi.
2. Al-Khabir (Yang Maha Waspada/Teliti): Allah mengetahui hakikat terdalam dari segala perkara, tidak ada satu detak hati atau perbuatan rahasia pun yang luput dari-Nya.
3. As-Sami' (Yang Maha Mendengar): Allah mendengar semua suara, doa, bisikan batin, dan keluh kesah hamba-Nya tanpa batasan jarak atau bahasa.
4. Al-Bashir (Yang Maha Melihat): Allah melihat segala perbuatan hamba-Nya di kegelapan malam sekalipun.

Penerapan Karakter:
- Rajin menuntut ilmu dengan ikhlas karena Allah menyukai orang berilmu (Al-'Alim).
- Teliti dan cermat dalam bertindak serta menghindari kecurangan dalam ujian (Al-Khabir).
- Menjaga lisan dari perkataan dusta, gibah, dan caci maki (As-Sami').
- Menjaga pandangan dan tidak berbuat maksiat meski di tempat sunyi (Al-Bashir).`,
    dalilQuran: {
      surah: "QS. Al-An'am",
      ayat: "59",
      arab: "وَعِنْدَهُۥ مَفَاتِحُ ٱلْغَيْبِ لَا يَعْلَمُهَآ إِلَّا هُوَ ۚ وَيَعْلَمُ مَا فِى ٱلْبَرِّ وَٱلْبَحْرِ ۚ",
      arti: "Dan pada sisi Allah-lah kunci-kunci semua yang gaib; tidak ada yang mengetahuinya kecuali Dia sendiri, dan Dia mengetahui apa yang di daratan dan di lautan."
    },
    poinKunci: [
      "Al-'Alim mengajarkan kita gemar belajar dan bersikap tawadhu.",
      "Al-Khabir menanamkan integritas moral tinggi dalam setiap tugas.",
      "As-Sami' melatih kita menjaga kejujuran kata dan aktif berdoa.",
      "Al-Bashir menumbuhkan sifat Ihsan (merasa selalu dalam pengawasan Allah)."
    ],
    lampiranFile: {
      namaFile: "Modul_PAI_Kelas7_AsmaulHusna.pdf",
      ukuran: "1.4 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-07-15",
    status: "Dipublikasikan"
  },
  {
    id: "materi-k7-g1-malaikat",
    judul: "Meyakini Malaikat Allah dan Meneladani Ketaatannya",
    bab: "Bab 2: Meneladani Ketaatan Malaikat-Malaikat Allah",
    kelas: "VII",
    semester: "Ganjil",
    deskripsi: "Mengenal sifat penciptaan malaikat dari nur (cahaya), nama-nama 10 malaikat beserta tugasnya, serta pengaruh keimanan terhadap perilaku sehari-hari.",
    isiMateri: `Malaikat adalah makhluk gaib ciptaan Allah SWT dari nur (cahaya) yang senantiasa patuh, tidak memiliki hawa nafsu, dan tidak pernah mendurhakai perintah Allah.

Sepuluh Malaikat yang Wajib Diketahui Beserta Tugasnya:
1. Jibril: Menyampaikan wahyu kepada nabi dan rasul.
2. Mikail: Membagikan rezeki dan mengatur hujan serta tumbuhan.
3. Israfil: Meniup sangkakala pada hari kiamat dan hari kebangkitan.
4. Izrail: Mencabut nyawa seluruh makhluk hidup.
5. Munkar: Menanyai manusia di alam kubur tentang ketauhidan.
6. Nakir: Menanyai manusia di alam kubur mendampingi Munkar.
7. Raqib: Mencatat segala amal perbuatan baik manusia.
8. Atid: Mencatat segala amal perbuatan buruk manusia.
9. Malik: Menjaga pintu neraka dengan ketegasan.
10. Ridwan: Menjaga pintu surga dengan kelembutan.`,
    dalilQuran: {
      surah: "QS. Al-Anbiya",
      ayat: "19-20",
      arab: "وَلَهُۥ مَن فِى ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ ۚ وَمَنْ عِندَهُۥ لَا يَسْتَكْبِرُونَ عَنْ عِبَادَتِهِۦ وَلَا يَسْتَحْسِرُونَ",
      arti: "Dan kepunyaan-Nya-lah segala yang di langit dan di bumi. Dan malaikat-malaikat yang di sisi-Nya, mereka tiada mempunyai rasa angkuh untuk menyembah-Nya dan tiada (pula) merasa letih."
    },
    poinKunci: [
      "Malaikat diciptakan dari cahaya, tunduk total tanpa nafsu.",
      "Kehadiran Raqib dan Atid memotivasi diri memperbanyak amal kebajikan.",
      "Kematian adalah kepastian melalui tugas Malaikat Izrail."
    ],
    lampiranFile: {
      namaFile: "Rangkuman_10_Malaikat_PAI7.pdf",
      ukuran: "850 KB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-08-01",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VII - GENAP ====================
  {
    id: "materi-k7-g2-shalatjamaah",
    judul: "Mendirikan Shalat Berjamaah: Syarat, Ketentuan, dan Hikmah",
    bab: "Bab 6: Indahnya Kebersamaan dalam Shalat Berjamaah",
    kelas: "VII",
    semester: "Genap",
    deskripsi: "Panduan lengkap shalat berjamaah, hukum dan keutamaannya bernilai 27 derajat, syarat imam dan makmum, serta adab makmum masbuq.",
    isiMateri: `Shalat berjamaah adalah shalat yang dikerjakan oleh dua orang atau lebih secara bersama-sama, salah seorang menjadi imam dan yang lainnya menjadi makmum. Shalat berjamaah memiliki derajat 27 kali lipat dibandingkan shalat sendirian (munfarid).

Syarat Sah Imam:
- Mengetahui syarat, rukun, dan hal yang membatalkan shalat.
- Fasih membaca ayat-ayat Al-Qur'an.
- Berdiri di depan makmum.
- Tidak berniat menjadi makmum kepada orang lain.

Ketentuan Makmum Masbuq:
Makmum masbuq adalah makmum yang terlambat datang saat imam sudah memulai shalat. Jika makmum masih sempat ruku' bersama imam secara tuma'ninah, maka ia dihitung mendapatkan satu rakaat.`,
    dalilQuran: {
      surah: "Hadits Riwayat Al-Bukhari & Muslim",
      ayat: "No. 645",
      arab: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
      arti: "Shalat berjamaah lebih utama daripada shalat sendirian dengan selisih dua puluh tujuh derajat."
    },
    poinKunci: [
      "Pahala shalat berjamaah dilipatgandakan 27 derajat.",
      "Melatih kedisiplinan shaf, kepemimpinan, dan persaudaraan sesama muslim.",
      "Makmum wajib mengikuti gerakan imam dan tidak boleh mendahuluinya."
    ],
    lampiranFile: {
      namaFile: "Buku_Panduan_Shalat_Berjamaah.pdf",
      ukuran: "2.1 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-01-10",
    status: "Dipublikasikan"
  },
  {
    id: "materi-k7-g2-sujud",
    judul: "Tata Cara Sujud Sahwi, Sujud Tilawah, dan Sujud Syukur",
    bab: "Bab 7: Meraih Ketenangan Hati Melalui Macam-Macam Sujud",
    kelas: "VII",
    semester: "Genap",
    deskripsi: "Penjelasan terperinci mengenai latar belakang, bacaan, dan tata cara pelaksanaan Sujud Sahwi, Sujud Tilawah, dan Sujud Syukur.",
    isiMateri: `Islam mensyariatkan tiga macam sujud di luar sujud rukun shalat sebagai bentuk kerendahan hati:
1. Sujud Sahwi: Dilakukan karena lupa atau ragu-ragu dalam rakaat atau rukun shalat. Dilakukan dua kali sujud sebelum atau sesudah salam.
   Bacaan: سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُو
2. Sujud Tilawah: Dilakukan ketika membaca atau mendengar ayat sajadah di dalam maupun di luar shalat.
   Bacaan: سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ وَصَوَّرَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ بِحَوْلِهِ وَقُوَّتِهِ
3. Sujud Syukur: Dilakukan saat memperoleh kenikmatan besar atau terhindar dari marabahaya secara spontan di luar shalat tanpa disyaratkan wudhu menurut pendapat yang kuat, namun lebih utama dalam keadaan suci.`,
    dalilQuran: {
      surah: "HR. Abu Dawud & Tirmidzi",
      ayat: "No. 1578",
      arab: "أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ كَانَ إِذَا أَتَاهُ أَمْرٌ يَسُرُّهُ خَرَّ سَاجِدًا شُكْرًا لِلَّهِ",
      arti: "Bahwasanya Nabi Muhammad SAW apabila datang kepadanya suatu perkara yang menggembirakan, beliau langsung bersujud sebagai tanda syukur kepada Allah."
    },
    poinKunci: [
      "Sujud Sahwi mengoreksi keraguan dalam shalat.",
      "Sujud Tilawah merupakan respons tunduk atas ayat-ayat sajadah.",
      "Sujud Syukur bentuk terima kasih langsung kepada Allah atas karunia-Nya."
    ],
    lampiranFile: {
      namaFile: "Panduan_3_Macam_Sujud.pdf",
      ukuran: "950 KB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-01-25",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII - GANJIL ====================
  {
    id: "materi-k8-g1-kitab",
    judul: "Meyakini Kitab-Kitab Allah: Menjadikan Al-Qur'an Pedoman Hidup",
    bab: "Bab 1: Menjadikan Al-Qur'an Pedoman Hidup yang Hakiki",
    kelas: "VIII",
    semester: "Ganjil",
    deskripsi: "Mengenal empat kitab suci (Taurat, Zabur, Injil, Al-Qur'an), nabi penerimanya, serta posisi Al-Qur'an sebagai mukjizat abadi dan penyempurna kitab terdahulu.",
    isiMateri: `Beriman kepada kitab-kitab Allah merupakan rukun iman ketiga. Allah SWT menurunkan kitab suci kepada para rasul sebagai pedoman petunjuk bagi umat manusia.

Empat Kitab Suci Allah:
1. Kitab Taurat: Diturunkan kepada Nabi Musa AS berbahasa Ibrani untuk kaum Bani Israil.
2. Kitab Zabur: Diturunkan kepada Nabi Daud AS berbahasa Qibthi berisi kidung pujian dan doa.
3. Kitab Injil: Diturunkan kepada Nabi Isa AS berbahasa Suryani berisi kabar gembira dan ajakan bertauhid.
4. Kitab Al-Qur'an: Diturunkan kepada Nabi Muhammad SAW berbahasa Arab sebagai penyempurna dan pembimbing seluruh umat manusia hingga akhir zaman.`,
    dalilQuran: {
      surah: "QS. Al-Baqarah",
      ayat: "2",
      arab: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ",
      arti: "Kitab (Al-Qur'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa."
    },
    poinKunci: [
      "Al-Qur'an terpelihara keasliannya langsung oleh jaminan Allah SWT.",
      "Al-Qur'an berlaku universal untuk seluruh umat manusia hingga hari kiamat.",
      "Kewajiban muslim adalah membaca, memahami, dan mengamalkannya."
    ],
    lampiranFile: {
      namaFile: "Modul_Beriman_Kitab_Allah_VIII.pdf",
      ukuran: "1.7 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-07-20",
    status: "Dipublikasikan"
  },
  {
    id: "materi-k8-g1-makananhalal",
    judul: "Mengkonsumsi Makanan dan Minuman yang Halal Serta Bergizi (Halalan Thayyiban)",
    bab: "Bab 3: Menjaga Raga dan Jiwa dengan Makanan Halal",
    kelas: "VIII",
    semester: "Ganjil",
    deskripsi: "Kriteria makanan halal dari segi dzat, cara memperoleh, dan cara memprosesnya, serta bahaya makanan haram terhadap kesehatan dan doa.",
    isiMateri: `Islam memerintahkan umatnya untuk memakan rezeki yang halal dan thayyib (baik dan menyehatkan). Halal berkaitan dengan hukum syariat, sedangkan thayyib berkaitan dengan nilai gizi, kebersihan, dan keselamatan tubuh.

Kategori Kehalalan:
1. Halal li dzatihi: Makanan yang pada asalnya suci dan dibolehkan (padi, buah, hewan ternak).
2. Halal sababi: Makanan yang diperoleh dengan cara sah (bukan hasil mencuri, suap, korupsi).
3. Halal proses: Disembelih menyebut asma Allah dan diproses tanpa kontaminasi najis.

Dampak Buruk Makanan Haram:
- Doa dan ibadah terhalang untuk dikabulkan.
- Mengotori hati dan mendorong perilaku maksiat.
- Merusak kesehatan organ tubuh jangka panjang.`,
    dalilQuran: {
      surah: "QS. Al-Baqarah",
      ayat: "168",
      arab: "يَـٰٓأَيُّهَا ٱلنَّاسُ كُلُوا۟ مِمَّا فِى ٱلْأَرْضِ حَلَـٰلًۭا طَيِّبًۭا وَلَا تَتَّبِعُوا۟ خُطُوَٰتِ ٱلشَّيْطَـٰنِ",
      arti: "Wahai manusia! Makanlah dari (makanan) yang halal dan baik yang terdapat di bumi, dan janganlah kamu mengikuti langkah-langkah setan."
    },
    poinKunci: [
      "Halal dan thayyib adalah satu kesatuan kebutuhan jasmani dan ruhani.",
      "Makanan halal menjamin kebersihan hati dan terkabulnya doa.",
      "Waspada terhadap titik kritis kehalalan produk olahan modern."
    ],
    lampiranFile: {
      namaFile: "Buku_Saku_Halalan_Thayyiban.pdf",
      ukuran: "1.2 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-08-15",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII - GENAP ====================
  {
    id: "materi-k8-g2-abbasiyah",
    judul: "Kecemerlangan Ilmu Pengetahuan pada Masa Daulah Abbasiyah",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    deskripsi: "Masa keemasan Islam (The Golden Age of Islam) di Baghdad, Baitul Hikmah, serta tokoh ilmuwan muslim seperti Al-Khawarizmi, Ibnu Sina, dan Al-Kindi.",
    isiMateri: `Daulah Abbasiyah yang berpusat di Baghdad (750-1258 M) merupakan era keemasan peradaban Islam. Para khalifah seperti Harun Ar-Rasyid dan Al-Ma'mun memprioritaskan riset, penerjemahan naskah, dan pendirian perpustakaan agung 'Baitul Hikmah' (The House of Wisdom).

Tokoh Ilmuwan Muslim dan Karyanya:
1. Al-Khawarizmi: Penemu konsep aljabar dan angka nol, bapak matematika modern.
2. Ibnu Sina (Avicenna): Penulis mahakarya 'Al-Qanun fi al-Tibb' (The Canon of Medicine), rujukan kedokteran dunia.
3. Al-Kindi: Filosof muslim pertama yang memadukan filsafat dengan tauhid.
4. Jabir bin Hayyan: Bapak ilmu kimia modern penemu metode distilasi dan kristalisasi.`,
    dalilQuran: {
      surah: "QS. Al-Mujadilah",
      ayat: "11",
      arab: "يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَـٰتٍ",
      arti: "Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat."
    },
    poinKunci: [
      "Islam mendorong kemajuan sains dan teknologi tanpa meninggalkan nilai spiritual.",
      "Baitul Hikmah adalah simbol universitas riset terbuka pertama di dunia.",
      "Generasi muda muslim berkewajiban membangkitkan kembali etos keilmuan Islam."
    ],
    lampiranFile: {
      namaFile: "Sejarah_Ilmuwan_Baitul_Hikmah.pdf",
      ukuran: "2.8 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-02-05",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX - GANJIL ====================
  {
    id: "materi-k9-g1-hariakhir",
    judul: "Meyakini Hari Akhir: Membangun Kesadaran dan Tanggung Jawab Moral",
    bab: "Bab 1: Meniti Hidup Bermakna dengan Meyakini Hari Akhir",
    kelas: "IX",
    semester: "Ganjil",
    deskripsi: "Klasifikasi kiamat sughra dan kubra, tahapan alam barzakh, yaumul ba'ats, yaumul hisab, yaumul mizan, serta jembatan shirat.",
    isiMateri: `Hari Akhir adalah hari hancurnya seluruh alam semesta beserta isinya serta dimulainya kehidupan abadi di akhirat.

Tahapan Perjalanan Manusia Setelah Kematian:
1. Alam Barzakh (Alam Kubur): Masa penantian antara dunia dan akhirat.
2. Yaumul Ba'ats: Hari dibangkitkannya manusia dari alam kubur setelah tiupan sangkakala kedua.
3. Yaumul Mahsyar: Hari dikumpulkannya seluruh umat manusia di Padang Mahsyar.
4. Yaumul Hisab & Mizan: Hari perhitungan dan penimbangan seluruh amal perbuatan.
5. Shirat: Jembatan yang dibentangkan di atas neraka menuju surga.`,
    dalilQuran: {
      surah: "QS. Al-Zalzalah",
      ayat: "1-2",
      arab: "إِذَا زُلْزِلَتِ ٱلْأَرْضُ زِلْزَالَهَا ۝ وَأَخْرَجَتِ ٱلْأَرْضُ أَثْقَالَهَا",
      arti: "Apabila bumi diguncangkan dengan guncangan yang dahsyat, dan bumi telah mengeluarkan beban-beban berat (yang dikandung)nya."
    },
    poinKunci: [
      "Dunia adalah tempat menanam, sedangkan akhirat tempat menuai hasil.",
      "Iman kepada hari akhir melahirkan kejujuran dan rasa tanggung jawab pribadi.",
      "Tidak ada amal sekecil biji zarrah pun yang luput dari timbangan keadilan Allah."
    ],
    lampiranFile: {
      namaFile: "Rangkuman_Perjalanan_Hari_Akhir.pdf",
      ukuran: "1.9 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-07-10",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX - GENAP ====================
  {
    id: "materi-k9-g2-nusantara",
    judul: "Sejarah Perkembangan Islam di Nusantara dan Kearifan Lokal Wali Songo",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    deskripsi: "Teori masuknya Islam (Gujarat, Makkah, Persia, Cina) dan metode dakwah damai kultural Wali Songo melalui seni gamelan, wayang, dan pendidikan pesantren.",
    isiMateri: `Islam masuk ke Nusantara dengan cara damai tanpa pertumpahan darah melalui perdagangan, perkawinan, pendidikan tasawuf, dan akulturasi budaya seni.

Strategi Dakwah Wali Songo:
- Sunan Gresik (Maulana Malik Ibrahim): Mengembangkan pertanian dan sistem pendidikan pesantren.
- Sunan Ampel: Falsafah 'Moh Limo' (tidak berjudi, tidak mabuk, tidak mencuri, tidak berzina, tidak madat).
- Sunan Kalijaga: Menggunakan media wayang kulit dan tembang Ilir-Ilir untuk menanamkan tauhid secara halus.
- Sunan Kudus: Menghormati kearifan lokal sapi larangan potong demi menjaga kerukunan dengan masyarakat Hindu.`,
    dalilQuran: {
      surah: "QS. An-Nahl",
      ayat: "125",
      arab: "ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلْحِكْمَةِ وَٱلْمَوْعِظَةِ ٱلْحَسَنَةِ ۖ وَجَـٰدِلْهُم بِٱلَّتِى هِىَ أَحْسَنُ",
      arti: "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pelajaran yang baik dan bantahlah mereka dengan cara yang baik."
    },
    poinKunci: [
      "Islam di Nusantara diterima karena keramahan dan pendekatan kultural santun.",
      "Wali Songo memadukan nilai syariat dengan tradisi lokal tanpa mengorbankan akidah.",
      "Sikap toleransi dan kebijaksanaan merupakan warisan luhur bangsa Indonesia."
    ],
    lampiranFile: {
      namaFile: "Atlas_Wali_Songo_Ringkas.pdf",
      ukuran: "3.5 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-01-20",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 2. VIDEO PEMBELAJARAN PRESETS
// =========================================================================
export const PRESET_VIDEO_LIST: VideoPembelajaranItem[] = [
  // ==================== KELAS VII ====================
  {
    id: "video-k7-g1-asmaulhusna",
    judul: "Animasi Edukasi: Mengenal 4 Asmaul Husna Utama",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Embed URL video edukasi
    durasi: "11:45",
    deskripsi: "Video animasi visual yang mengisahkan penerapan sifat Al-Alim, Al-Khabir, As-Sami', dan Al-Bashir dalam kehidupan sekolah sehari-hari.",
    poinPembahasan: [
      "Menit 00:00 - Pengantar pentingnya Asmaul Husna",
      "Menit 02:30 - Makna mendalam Al-'Alim dan Al-Khabir",
      "Menit 06:15 - Studi kasus kejujuran saat ujian (As-Sami' & Al-Bashir)",
      "Menit 09:40 - Kesimpulan dan komitmen moral siswa"
    ],
    tanggalDibuat: "2026-07-18",
    status: "Dipublikasikan"
  },
  {
    id: "video-k7-g2-shalatjamaah",
    judul: "Simulasi Praktik: Posisi Shaf dan Tata Cara Shalat Berjamaah",
    bab: "Bab 6: Indahnya Kebersamaan dalam Shalat Berjamaah",
    kelas: "VII",
    semester: "Genap",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durasi: "14:20",
    deskripsi: "Tutorial visual peragaan susunan shaf untuk makmum laki-laki, perempuan, anak-anak, serta penanganan makmum masbuq secara benar.",
    poinPembahasan: [
      "Menit 00:00 - Syarat imam dan keutamaan 27 derajat",
      "Menit 03:40 - Aturan meluruskan dan merapatkan shaf",
      "Menit 08:10 - Contoh gerakan makmum masbuq 1 rakaat dan 2 rakaat",
      "Menit 12:00 - Adab di masjid dan dzikir ba'da shalat"
    ],
    tanggalDibuat: "2026-01-12",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII ====================
  {
    id: "video-k8-g1-kitab",
    judul: "Dokumenter Sejarah: 4 Kitab Suci Samawi dan Kedudukan Al-Qur'an",
    bab: "Bab 1: Menjadikan Al-Qur'an Pedoman Hidup yang Hakiki",
    kelas: "VIII",
    semester: "Ganjil",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durasi: "16:05",
    deskripsi: "Ulasan sejarah diturunkannya Taurat, Zabur, Injil, hingga mukjizat Al-Qur'an dengan bahasa visual yang memukau dan menggugah wawasan.",
    poinPembahasan: [
      "Menit 00:00 - Silsilah para nabi penerima wahyu",
      "Menit 04:50 - Perbedaan syariat dan kemurnian tauhid",
      "Menit 10:20 - Mukjizat sastra dan keilmuan Al-Qur'an",
      "Menit 14:00 - Cara interaksi muslim modern dengan Al-Qur'an"
    ],
    tanggalDibuat: "2026-07-22",
    status: "Dipublikasikan"
  },
  {
    id: "video-k8-g2-abbasiyah",
    judul: "Kisah Baitul Hikmah: Masa Keemasan Sains dan Kedokteran Islam",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durasi: "18:30",
    deskripsi: "Menelusuri kejayaan Baghdad sebagai pusat peradaban dunia, penemuan Al-Khawarizmi, dan klinik pengobatan modern Ibnu Sina.",
    poinPembahasan: [
      "Menit 00:00 - Baghdad kota bundar di tepi sungai Tigris",
      "Menit 05:10 - Gerakan penerjemahan raksasa Baitul Hikmah",
      "Menit 11:30 - Penemuan Aljabar dan Algoritma",
      "Menit 15:45 - Inspirasi bagi kemajuan sains anak bangsa"
    ],
    tanggalDibuat: "2026-02-10",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX ====================
  {
    id: "video-k9-g1-hariakhir",
    judul: "Tafsir Visual: Fase Alam Kubur, Padang Mahsyar, dan Yaumul Hisab",
    bab: "Bab 1: Meniti Hidup Bermakna dengan Meyakini Hari Akhir",
    kelas: "IX",
    semester: "Ganjil",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durasi: "15:50",
    deskripsi: "Pemaparan dalil naqli Al-Qur'an mengenai peristiwa hari kiamat dan tahapan hisab amal manusia dengan visualisasi yang mendalam.",
    poinPembahasan: [
      "Menit 00:00 - Tanda-tanda kiamat kecil dan kiamat besar",
      "Menit 05:00 - Tiupan sangkakala Malaikat Israfil",
      "Menit 09:20 - Buku catatan amal perbuatan manusia",
      "Menit 13:10 - Menyiapkan bekal taqwa di dunia"
    ],
    tanggalDibuat: "2026-07-12",
    status: "Dipublikasikan"
  },
  {
    id: "video-k9-g2-walisongo",
    judul: "Jejak Dakwah Wali Songo: Seni Budaya Menembus Hati Nusantara",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durasi: "20:15",
    deskripsi: "Eksplorasi jejak Sunan Kalijaga dan Sunan Kudus dalam memadukan gamelan sekaten, arsitektur menara, dan tembang filosofis Jawa.",
    poinPembahasan: [
      "Menit 00:00 - Peta penyebaran Islam di pesisir utara Jawa",
      "Menit 06:15 - Rahasia filosofi tembang Lir-Ilir Sunan Kalijaga",
      "Menit 12:40 - Menara Kudus akulturasi Hindu-Jawa dan Islam",
      "Menit 17:30 - Pelajaran toleransi beragama bagi generasi masa depan"
    ],
    tanggalDibuat: "2026-01-28",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 3. GAME EDUKASI PRESETS (KUIS INTERAKTIF BERGAMIFIKASI)
// =========================================================================
export const PRESET_GAME_LIST: GameEdukasiItem[] = [
  // ==================== KELAS VII ====================
  {
    id: "game-k7-g1-asmaulhusna",
    judul: "Petualangan Asmaul Husna & Malaikat Allah",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    deskripsi: "Kuis interaktif gamifikasi dengan 3 nyawa, batas waktu per soal, serta poin skor untuk menguji ketangkasan memahami sifat Allah dan tugas 10 Malaikat.",
    tipeGame: "Petualangan PAI",
    waktuPerSoalDetik: 25,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g-q1",
        pertanyaan: "Asmaul Husna yang berarti Allah Maha Mengetahui segala sesuatu baik yang tampak maupun tersembunyi adalah...",
        pilihan: ["Al-Khabir", "Al-'Alim", "As-Sami'", "Al-Bashir"],
        jawabanBenar: 1,
        pembahasan: "Al-'Alim bermakna Maha Mengetahui segala hal di langit dan di bumi tanpa batas.",
        poin: 25
      },
      {
        id: "g-q2",
        pertanyaan: "Ahmad selalu teliti saat mengerjakan ulangan dan tidak pernah mencurangi tugasnya. Sikap Ahmad mencerminkan pengamalan Asmaul Husna...",
        pilihan: ["Al-Khabir", "As-Sami'", "Al-Bashir", "Al-Ghaffar"],
        jawabanBenar: 0,
        pembahasan: "Al-Khabir menanamkan ketelitian, kehati-hatian, dan integritas tinggi dalam setiap perbuatan.",
        poin: 25
      },
      {
        id: "g-q3",
        pertanyaan: "Malaikat yang bertugas membagikan rezeki serta mengatur jalannya hujan dan tumbuhnya tanam-tanaman adalah...",
        pilihan: ["Malaikat Jibril", "Malaikat Israfil", "Malaikat Mikail", "Malaikat Ridwan"],
        jawabanBenar: 2,
        pembahasan: "Malaikat Mikail ditugaskan oleh Allah SWT untuk mengurus rezeki makhluk dan fenomena alam seperti hujan.",
        poin: 25
      },
      {
        id: "g-q4",
        pertanyaan: "Malaikat diciptakan oleh Allah SWT dari unsur...",
        pilihan: ["Tanah liat", "Cahaya (Nur)", "Api yang menyala", "Udara"],
        jawabanBenar: 1,
        pembahasan: "Berdasarkan hadits sahih, malaikat diciptakan dari cahaya (nur), jin dari api, dan manusia dari tanah.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-07-25",
    status: "Dipublikasikan"
  },
  {
    id: "game-k7-g2-shalat-sujud",
    judul: "Tantangan Cepat: Fiqih Shalat Berjamaah & Sujud Sahwi",
    bab: "Bab 6: Indahnya Kebersamaan dalam Shalat Berjamaah",
    kelas: "VII",
    semester: "Genap",
    deskripsi: "Uji refleks dan pemahaman fiqih shalat berjamaah, aturan makmum masbuq, dan tata cara 3 macam sujud.",
    tipeGame: "Tantangan Waktu",
    waktuPerSoalDetik: 20,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g72-q1",
        pertanyaan: "Pahala mendirikan shalat fardhu secara berjamaah dilipatgandakan menjadi sebanyak...",
        pilihan: ["7 derajat", "17 derajat", "27 derajat", "70 derajat"],
        jawabanBenar: 2,
        pembahasan: "HR Bukhari & Muslim menegaskan shalat berjamaah lebih utama 27 derajat dibanding shalat munfarid.",
        poin: 25
      },
      {
        id: "g72-q2",
        pertanyaan: "Makmum yang terlambat datang saat imam sedang shalat disebut makmum...",
        pilihan: ["Muafiq", "Masbuq", "Munfarid", "Mukallaf"],
        jawabanBenar: 1,
        pembahasan: "Makmum masbuq adalah orang yang shalat bermakmum namun tertinggal rakaat bersama imam.",
        poin: 25
      },
      {
        id: "g72-q3",
        pertanyaan: "Sujud yang dilakukan karena lupa atau ragu terhadap jumlah rakaat shalat disebut sujud...",
        pilihan: ["Sujud Tilawah", "Sujud Syukur", "Sujud Sahwi", "Sujud Rukun"],
        jawabanBenar: 2,
        pembahasan: "Sujud Sahwi dilakukan 2 kali untuk menyempurnakan kekurangan akibat kelupaan dalam shalat.",
        poin: 25
      },
      {
        id: "g72-q4",
        pertanyaan: "Kapan sujud syukur disunnahkan untuk dilakukan?",
        pilihan: [
          "Setiap selesai shalat fardhu lima waktu",
          "Ketika mendapatkan berita gembira atau terhindar dari musibah besar",
          "Saat mendengar imam membaca ayat sajadah",
          "Saat ragu rakaat kedua atau ketiga"
        ],
        jawabanBenar: 1,
        pembahasan: "Sujud syukur dikerjakan spontan ketika memperoleh nikmat tak terduga atau selamat dari bahaya.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-02-01",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII ====================
  {
    id: "game-k8-g1-kitab-halal",
    judul: "Kuis Kilat: Kitab Samawi & Kuliner Halalan Thayyiban",
    bab: "Bab 1: Menjadikan Al-Qur'an Pedoman Hidup yang Hakiki",
    kelas: "VIII",
    semester: "Ganjil",
    deskripsi: "Game tantangan seru mengidentifikasi kitab-kitab suci, para nabi penerimanya, serta kriteria makanan halal dan haram.",
    tipeGame: "Kuis Cepat",
    waktuPerSoalDetik: 20,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g81-q1",
        pertanyaan: "Kitab suci Zabur diturunkan oleh Allah SWT kepada Nabi...",
        pilihan: ["Musa AS", "Daud AS", "Isa AS", "Ibrahim AS"],
        jawabanBenar: 1,
        pembahasan: "Zabur diturunkan kepada Nabi Daud AS berisi syair puji-pujian dan nasihat hikmah.",
        poin: 25
      },
      {
        id: "g81-q2",
        pertanyaan: "Istilah makanan yang 'halalan thayyiban' memiliki arti makanan yang...",
        pilihan: [
          "Banyak dan mengenyangkan perut",
          "Halal menurut syariat dan baik/bergizi bagi tubuh",
          "Harganya terjangkau oleh seluruh kalangan",
          "Dibuat dari bahan-bahan yang diimpor"
        ],
        jawabanBenar: 1,
        pembahasan: "Halal berarti sesuai aturan hukum Islam, sedangkan thayyib berarti higienis, bersih, dan bermanfaat bagi kesehatan.",
        poin: 25
      },
      {
        id: "g81-q3",
        pertanyaan: "Hewan yang mati tanpa disembelih secara syar'i disebut bangkai dan hukum memakannya adalah...",
        pilihan: ["Makruh", "Mubah", "Haram", "Syubhat"],
        jawabanBenar: 2,
        pembahasan: "Bangkai adalah salah satu makanan yang diharamkan secara tegas dalam QS. Al-Ma'idah ayat 3.",
        poin: 25
      },
      {
        id: "g81-q4",
        pertanyaan: "Salah satu mukjizat terbesar Al-Qur'an adalah...",
        pilihan: [
          "Bisa menyembuhkan orang sakit dengan sekali sentuh",
          "Terpelihara keaslian huruf dan lafaznya sepanjang masa",
          "Buku pertama yang dicetak dengan mesin otomatis",
          "Hanya boleh dibaca di tanah Arab"
        ],
        jawabanBenar: 1,
        pembahasan: "Allah SWT menjamin sendiri penjagaan keaslian Al-Qur'an sebagaimana firman-Nya dalam QS. Al-Hijr: 9.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-08-05",
    status: "Dipublikasikan"
  },
  {
    id: "game-k8-g2-sains-islam",
    judul: "Petualangan Intelektual: Kejayaan Daulah Abbasiyah",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    deskripsi: "Eksplorasi ilmuwan muslim legendaris dunia penemu aljabar, kedokteran, optik, dan astronomi.",
    tipeGame: "Petualangan PAI",
    waktuPerSoalDetik: 25,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g82-q1",
        pertanyaan: "Ilmuwan muslim penemu sistem Aljabar dan konsep angka nol bernama...",
        pilihan: ["Ibnu Sina", "Al-Khawarizmi", "Al-Farabi", "Ibnu Rusyd"],
        jawabanBenar: 1,
        pembahasan: "Muhammad bin Musa Al-Khawarizmi menulis kitab Al-Jabr wa'l-Muqabala yang mendasari aljabar modern.",
        poin: 25
      },
      {
        id: "g82-q2",
        pertanyaan: "Pusat perpustakaan, akademi riset, dan penerjemahan naskah ilmu pengetahuan di Baghdad bernama...",
        pilihan: ["Baitul Maal", "Baitul Hikmah", "Darul Ulum", "Baitul Arqam"],
        jawabanBenar: 1,
        pembahasan: "Baitul Hikmah didirikan pada masa Khalifah Harun Ar-Rasyid dan mencapai puncak kejayaan di masa Al-Ma'mun.",
        poin: 25
      },
      {
        id: "g82-q3",
        pertanyaan: "Karya monumental Ibnu Sina dalam dunia medis kedokteran berjudul...",
        pilihan: ["Al-Qanun fi al-Tibb", "Tahafut al-Falasifah", "Ihya Ulumiddin", "Mukaddimah"],
        jawabanBenar: 0,
        pembahasan: "Al-Qanun fi al-Tibb (The Canon of Medicine) menjadi rujukan standar fakultas kedokteran di Eropa berabad-abad.",
        poin: 25
      },
      {
        id: "g82-q4",
        pertanyaan: "Kota yang menjadi pusat ibu kota pemerintahan Daulah Abbasiyah adalah...",
        pilihan: ["Damaskus", "Baghdad", "Kairo", "Kordoba"],
        jawabanBenar: 1,
        pembahasan: "Khalifah Abu Ja'far Al-Manshur memindahkan pusat pemerintahan ke kota bundar Baghdad di Irak.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-02-15",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX ====================
  {
    id: "game-k9-g1-kiamat-haji",
    judul: "Kuis Akhir Zaman & Puncak Manasik Haji",
    bab: "Bab 1: Meniti Hidup Bermakna dengan Meyakini Hari Akhir",
    kelas: "IX",
    semester: "Ganjil",
    deskripsi: "Uji kompetensi pemahaman fase-fase hari akhir, penimbangan amal (Mizan), dan rukun ibadah haji di Baitullah.",
    tipeGame: "Kuis Cepat",
    waktuPerSoalDetik: 25,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g91-q1",
        pertanyaan: "Peristiwa dibangkitkannya kembali seluruh manusia dari alam kubur setelah kiamat dinamakan...",
        pilihan: ["Yaumul Ba'ats", "Yaumul Mahsyar", "Yaumul Hisab", "Yaumul Jaza'"],
        jawabanBenar: 0,
        pembahasan: "Yaumul Ba'ats adalah hari kebangkitan seluruh manusia dari alam kubur.",
        poin: 25
      },
      {
        id: "g91-q2",
        pertanyaan: "Timbangan keadilan Allah yang digunakan untuk menimbang seluruh kebajikan dan keburukan manusia disebut...",
        pilihan: ["Al-Hisab", "Al-Mizan", "Al-Mahsyar", "Al-Kautsar"],
        jawabanBenar: 1,
        pembahasan: "Al-Mizan adalah timbangan amal perbuatan manusia di hari kiamat.",
        poin: 25
      },
      {
        id: "g91-q3",
        pertanyaan: "Inti rukun utama ibadah haji yang wajib dilaksanakan di Padang Arafah pada 9 Dzulhijjah adalah...",
        pilihan: ["Thawaf Wada'", "Sa'i", "Wukuf", "Tahallul"],
        jawabanBenar: 2,
        pembahasan: "Rasulullah SAW bersabda: 'Al-Hajju Arafah' (Inti haji adalah wukuf di Arafah).",
        poin: 25
      },
      {
        id: "g91-q4",
        pertanyaan: "Berjalan bolak-balik sebanyak 7 kali antara bukit Shafa dan Marwah dalam ibadah haji/umrah disebut...",
        pilihan: ["Thawaf", "Sa'i", "Mabit", "Lontar Jumrah"],
        jawabanBenar: 1,
        pembahasan: "Sa'i meneladani keteguhan dan perjuangan Siti Hajar mencari air untuk putranya Nabi Ismail AS.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-07-28",
    status: "Dipublikasikan"
  },
  {
    id: "game-k9-g2-walisongo-damai",
    judul: "Tantangan Sejarah: Jejak Hikmah Wali Songo di Nusantara",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    deskripsi: "Eksplorasi strategi dakwah kultural para wali, media wayang, kidung, dan falsafah Moh Limo.",
    tipeGame: "Petualangan PAI",
    waktuPerSoalDetik: 25,
    jumlahNyawa: 3,
    soalList: [
      {
        id: "g92-q1",
        pertanyaan: "Tokoh Wali Songo yang terkenal dengan ajaran budi pekerti 'Moh Limo' adalah...",
        pilihan: ["Sunan Gresik", "Sunan Ampel", "Sunan Bonang", "Sunan Drajat"],
        jawabanBenar: 1,
        pembahasan: "Sunan Ampel mengajarkan falsafah Moh Limo untuk memberantas kebiasaan buruk masyarakat.",
        poin: 25
      },
      {
        id: "g92-q2",
        pertanyaan: "Sunan Kalijaga menggunakan media seni budaya untuk berdakwah menyebarkan Islam berupa...",
        pilihan: ["Gamelan Sekaten", "Wayang Kulit dan tembang Ilir-Ilir", "Reog Ponorogo", "Tari Saman"],
        jawabanBenar: 1,
        pembahasan: "Sunan Kalijaga memasukkan nilai tauhid ke dalam lakon wayang kulit dan menciptakan tembang Ilir-Ilir.",
        poin: 25
      },
      {
        id: "g92-q3",
        pertanyaan: "Sikap toleran Sunan Kudus kepada masyarakat pemeluk Hindu ditunjukkan melalui anjuran...",
        pilihan: [
          "Membangun pura di samping masjid",
          "Melarang penyembelihan sapi saat Idul Adha demi menghormati keyakinan warga",
          "Mengikuti ritual keagamaan umat lain",
          "Mengubah arah kiblat ke timur"
        ],
        jawabanBenar: 1,
        pembahasan: "Sunan Kudus mengganti hewan kurban sapi dengan kerbau sebagai wujud toleransi kepada warga Hindu yang memuliakan sapi.",
        poin: 25
      },
      {
        id: "g92-q4",
        pertanyaan: "Instrumen gamelan yang dimodifikasi oleh Sunan Bonang untuk memikat masyarakat datang ke masjid dinamakan...",
        pilihan: ["Bonang", "Kendang", "Angklung", "Suling bambu"],
        jawabanBenar: 0,
        pembahasan: "Sunan Bonang piawai memainkan alat musik bonang dengan lantunan syair puji-pujian yang menyentuh hati.",
        poin: 25
      }
    ],
    tanggalDibuat: "2026-02-18",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 4. TEKA-TEKI SILANG PRESETS (TTS INTERAKTIF PAI)
// =========================================================================
export const PRESET_TTS_LIST: TekaTekiSilangItem[] = [
  // ==================== KELAS VII ====================
  {
    id: "tts-k7-g1-asmaulhusna",
    judul: "TTS PAI: Meneladani Asmaul Husna dan Sifat Malaikat",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    deskripsi: "Teka-Teki Silang interaktif menguji wawasan 4 Asmaul Husna, tugas malaikat, dan perilaku mulia. Isilah kotak mendatar dan menurun!",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Asmaul Husna yang berarti Maha Mengetahui segala sesuatu (6 Huruf)",
        jawaban: "ALALIM",
        barisAwal: 1,
        kolomAwal: 1,
        petunjukTambahan: "Dimulai dari huruf A, Allah mengetahui yang tampak dan gaib"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Malaikat penyampai wahyu kepada para nabi dan rasul (6 Huruf)",
        jawaban: "JIBRIL",
        barisAwal: 1,
        kolomAwal: 3,
        petunjukTambahan: "Juga dikenal dengan gelar Ruhul Qudus"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Asmaul Husna Maha Waspada dan Mengetahui hal-hal yang tersembunyi (7 Huruf)",
        jawaban: "KHABIR",
        barisAwal: 3,
        kolomAwal: 2,
        petunjukTambahan: "Membuat kita berhati-hati dan teliti"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Malaikat pencatat seluruh amal kebaikan manusia (5 Huruf)",
        jawaban: "RAQIB",
        barisAwal: 2,
        kolomAwal: 6,
        petunjukTambahan: "Bekerja berdampingan dengan Malaikat Atid"
      },
      {
        nomor: 5,
        tipe: "mendatar",
        pertanyaan: "Cahaya; unsur asal mula penciptaan malaikat (3 Huruf)",
        jawaban: "NUR",
        barisAwal: 5,
        kolomAwal: 5,
        petunjukTambahan: "Berbeda dengan jin yang diciptakan dari api"
      },
      {
        nomor: 6,
        tipe: "menurun",
        pertanyaan: "Sifat pengawasan Allah SWT: Yang Maha Melihat (6 Huruf)",
        jawaban: "BASHIR",
        barisAwal: 1,
        kolomAwal: 8,
        petunjukTambahan: "Mengetahui semut hitam di atas batu hitam di malam kelam"
      }
    ],
    tanggalDibuat: "2026-07-26",
    status: "Dipublikasikan"
  },
  {
    id: "tts-k7-g2-shalat",
    judul: "TTS Fiqih: Shalat Berjamaah dan Macam-Macam Sujud",
    bab: "Bab 6: Indahnya Kebersamaan dalam Shalat Berjamaah",
    kelas: "VII",
    semester: "Genap",
    deskripsi: "Teka-teki silang seputar ketentuan shalat berjamaah, derajat keutamaan, makmum masbuq, dan sujud sahwi.",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Pemimpin dalam shalat berjamaah yang berdiri paling depan (4 Huruf)",
        jawaban: "IMAM",
        barisAwal: 1,
        kolomAwal: 2,
        petunjukTambahan: "Harus fasih membaca Al-Qur'an dan memahami syarat sah"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Makmum yang terlambat datang saat shalat telah dimulai (6 Huruf)",
        jawaban: "MASBUQ",
        barisAwal: 1,
        kolomAwal: 3,
        petunjukTambahan: "Menyempurnakan kekurangan rakaat setelah imam salam"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Sujud yang dilakukan karena lupa jumlah rakaat (5 Huruf)",
        jawaban: "SAHWI",
        barisAwal: 3,
        kolomAwal: 1,
        petunjukTambahan: "Dilakukan dua kali sujud sebelum atau sesudah salam"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Barisan orang yang shalat berjamaah (4 Huruf)",
        jawaban: "SHAF",
        barisAwal: 2,
        kolomAwal: 7,
        petunjukTambahan: "Wajib dirapatkan dan diluruskan agar sempurna"
      },
      {
        nomor: 5,
        tipe: "mendatar",
        pertanyaan: "Sujud spontan ketika menerima kabar gembira yang luar biasa (6 Huruf)",
        jawaban: "SYUKUR",
        barisAwal: 5,
        kolomAwal: 2,
        petunjukTambahan: "Ungkapan terima kasih mendalam kepada Allah SWT"
      }
    ],
    tanggalDibuat: "2026-02-02",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII ====================
  {
    id: "tts-k8-g1-kitab-syariat",
    judul: "TTS PAI: Empat Kitab Suci & Makanan Halalan Thayyiban",
    bab: "Bab 1: Menjadikan Al-Qur'an Pedoman Hidup yang Hakiki",
    kelas: "VIII",
    semester: "Ganjil",
    deskripsi: "Asah kosakata Islami mengenai nama nabi penerima kitab suci dan kriteria kehalalan pangan.",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Kitab suci yang diturunkan kepada Nabi Musa AS (6 Huruf)",
        jawaban: "TAURAT",
        barisAwal: 1,
        kolomAwal: 1,
        petunjukTambahan: "Diturunkan berbahasa Ibrani"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Kitab suci yang diturunkan kepada Nabi Isa AS (5 Huruf)",
        jawaban: "INJIL",
        barisAwal: 1,
        kolomAwal: 5,
        petunjukTambahan: "Membawa kabar gembira kedatangan nabi penutup"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Istilah untuk makanan yang baik, bersih, dan bermanfaat untuk gizi tubuh (7 Huruf)",
        jawaban: "THAYYIB",
        barisAwal: 3,
        kolomAwal: 2,
        petunjukTambahan: "Pasangan dari kata halal: Halalan Thayyiban"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Hewan ternak yang disembelih dengan menyebut nama Allah hukumnya... (5 Huruf)",
        jawaban: "HALAL",
        barisAwal: 2,
        kolomAwal: 8,
        petunjukTambahan: "Boleh dimakan oleh setiap muslim"
      },
      {
        nomor: 5,
        tipe: "mendatar",
        pertanyaan: "Nabi yang menerima kitab suci Zabur (4 Huruf)",
        jawaban: "DAUD",
        barisAwal: 5,
        kolomAwal: 4,
        petunjukTambahan: "Terkenal dengan suaranya yang sangat merdu"
      }
    ],
    tanggalDibuat: "2026-08-08",
    status: "Dipublikasikan"
  },
  {
    id: "tts-k8-g2-abbasiyah",
    judul: "TTS Sejarah Islam: Ilmuwan Muslim Daulah Abbasiyah",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    deskripsi: "Eksplorasi tokoh ilmuwan Baitul Hikmah dan penemuan sains bersejarah peradaban Islam.",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Bapak Kedokteran Dunia penulis Al-Qanun fi al-Tibb (8 Huruf)",
        jawaban: "IBNUSINA",
        barisAwal: 1,
        kolomAwal: 1,
        petunjukTambahan: "Di Barat dikenal dengan sebutan Avicenna"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Kota metropolitan tempat berdirinya Baitul Hikmah (7 Huruf)",
        jawaban: "BAGHDAD",
        barisAwal: 1,
        kolomAwal: 4,
        petunjukTambahan: "Dibangun oleh Khalifah Abu Ja'far Al-Manshur"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Ilmu hitung matematika ciptaan Al-Khawarizmi (7 Huruf)",
        jawaban: "ALJABAR",
        barisAwal: 3,
        kolomAwal: 2,
        petunjukTambahan: "Fondasi dasar pemrograman komputer modern"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Khalifah Abbasiyah terkenal yang mencintai para ulama dan ilmu pengetahuan (5 Huruf)",
        jawaban: "HARUN",
        barisAwal: 2,
        kolomAwal: 7,
        petunjukTambahan: "Nama lengkapnya Harun Ar-Rasyid"
      }
    ],
    tanggalDibuat: "2026-02-16",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX ====================
  {
    id: "tts-k9-g1-hariakhir",
    judul: "TTS Akidah Akhlak: Perjalanan Menuju Yaumul Akhir",
    bab: "Bab 1: Meniti Hidup Bermakna dengan Meyakini Hari Akhir",
    kelas: "IX",
    semester: "Ganjil",
    deskripsi: "Mengenal tahapan alam kubur, hari kebangkitan, hisab amal, dan jembatan shirat.",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Alam perantara tempat penantian sebelum hari kebangkitan tiba (7 Huruf)",
        jawaban: "BARZAKH",
        barisAwal: 1,
        kolomAwal: 1,
        petunjukTambahan: "Sering disebut juga sebagai alam kubur"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Timbangan keadilan untuk menimbang seluruh amal baik dan buruk (5 Huruf)",
        jawaban: "MIZAN",
        barisAwal: 1,
        kolomAwal: 5,
        petunjukTambahan: "Tidak ada satu amal pun yang dirugikan"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Padang luas tempat dikumpulkannya seluruh umat manusia di akhirat (7 Huruf)",
        jawaban: "MAHSYAR",
        barisAwal: 3,
        kolomAwal: 2,
        petunjukTambahan: "Matahari berada sejengkal di atas kepala"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Malaikat yang bertugas meniup sangkakala pada hari kiamat (7 Huruf)",
        jawaban: "ISRAFIL",
        barisAwal: 2,
        kolomAwal: 8,
        petunjukTambahan: "Meniup sangkakala pertama dan kedua"
      },
      {
        nomor: 5,
        tipe: "mendatar",
        pertanyaan: "Jembatan yang dibentangkan di atas neraka menuju surga (6 Huruf)",
        jawaban: "SHIRAT",
        barisAwal: 5,
        kolomAwal: 3,
        petunjukTambahan: "Lebih tipis dari sehelai rambut yang dibelah tujuh"
      }
    ],
    tanggalDibuat: "2026-07-29",
    status: "Dipublikasikan"
  },
  {
    id: "tts-k9-g2-walisongo",
    judul: "TTS Tarikh: Kearifan Lokal Wali Songo di Nusantara",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    deskripsi: "Mengungkap nama-nama wali, gelar, dan media kesenian penyebaran agama Islam.",
    ukuranGrid: { baris: 8, kolom: 10 },
    clues: [
      {
        nomor: 1,
        tipe: "mendatar",
        pertanyaan: "Wali Songo pencipta tembang Ilir-Ilir dan media dakwah wayang (9 Huruf)",
        jawaban: "KALIJAGA",
        barisAwal: 1,
        kolomAwal: 1,
        petunjukTambahan: "Makamnya terletak di Kadilangu, Demak"
      },
      {
        nomor: 2,
        tipe: "menurun",
        pertanyaan: "Pusat kerajaan Islam pertama di pulau Jawa (5 Huruf)",
        jawaban: "DEMAK",
        barisAwal: 1,
        kolomAwal: 4,
        petunjukTambahan: "Didirikan oleh Raden Patah dengan Masjid Agung bertiang tatal"
      },
      {
        nomor: 3,
        tipe: "mendatar",
        pertanyaan: "Falsafah Sunan Ampel untuk menjauhi 5 perkara tercela (7 Huruf)",
        jawaban: "MOHLIMO",
        barisAwal: 3,
        kolomAwal: 2,
        petunjukTambahan: "Moh main, ngombe, maling, madat, madon"
      },
      {
        nomor: 4,
        tipe: "menurun",
        pertanyaan: "Alat musik gamelan yang digunakan Sunan Bonang untuk syiar dakwah (6 Huruf)",
        jawaban: "BONANG",
        barisAwal: 2,
        kolomAwal: 7,
        petunjukTambahan: "Terbuat dari perunggu dengan tonjolan di tengah"
      }
    ],
    tanggalDibuat: "2026-02-19",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 5. PUZZLE PEMBELAJARAN PRESETS (SUSUN AYAT & KARTU KOSAKATA PAI)
// =========================================================================
export const PRESET_PUZZLE_LIST: PuzzleItem[] = [
  // ==================== KELAS VII ====================
  {
    id: "puzzle-k7-g1-anam59",
    judul: "Puzzle Susun Ayat: QS. Al-An'am Ayat 59 (Asmaul Husna Al-Alim)",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    deskripsi: "Susun kembali potongan lafaz ayat Al-Qur'an secara berurutan dan cocokkan dengan terjemahannya untuk memahami kemahatahuan Allah SWT.",
    tipePuzzle: "Susun Ayat Al-Qur'an",
    potonganList: [
      { id: "p1", urutanBenar: 0, teks: "وَعِنْدَهُۥ مَفَاتِحُ ٱلْغَيْبِ", artiTeks: "Dan pada sisi Allah-lah kunci-kunci semua yang gaib;" },
      { id: "p2", urutanBenar: 1, teks: "لَا يَعْلَمُهَآ إِلَّا هُوَ ۚ", artiTeks: "tidak ada yang mengetahuinya kecuali Dia sendiri," },
      { id: "p3", urutanBenar: 2, teks: "وَيَعْلَمُ مَا فِى ٱلْبَرِّ", artiTeks: "dan Dia mengetahui apa yang di daratan" },
      { id: "p4", urutanBenar: 3, teks: "وَٱلْبَحْرِ ۚ", artiTeks: "dan di lautan." }
    ],
    kunciUrutanLengkap: "وَعِنْدَهُۥ مَفَاتِحُ ٱلْغَيْبِ لَا يَعْلَمُهَآ إِلَّا هُوَ ۚ وَيَعْلَمُ مَا فِى ٱلْبَرِّ وَٱلْبَحْرِ ۚ (QS. Al-An'am: 59)",
    tanggalDibuat: "2026-07-27",
    status: "Dipublikasikan"
  },
  {
    id: "puzzle-k7-g2-sujudsahwi",
    judul: "Puzzle Susun Urutan: Tata Cara Pelaksanaan Sujud Sahwi",
    bab: "Bab 7: Meraih Ketenangan Hati Melalui Macam-Macam Sujud",
    kelas: "VII",
    semester: "Genap",
    deskripsi: "Tukarkan kartu langkah-langkah sujud sahwi sehingga tersusun secara runut dan sesuai sunnah Rasulullah SAW.",
    tipePuzzle: "Susun Rukun & Syarat",
    potonganList: [
      { id: "ps1", urutanBenar: 0, teks: "1. Tasyahud Akhir", artiTeks: "Membaca doa tasyahud akhir hingga selesai sebelum salam" },
      { id: "ps2", urutanBenar: 1, teks: "2. Takbir & Sujud Pertama", artiTeks: "Mengucapkan takbir lalu sujud membaca: Subhana man la yanamu wa la yashu" },
      { id: "ps3", urutanBenar: 2, teks: "3. Duduk Antara Dua Sujud", artiTeks: "Bangkit dari sujud pertama dan duduk sejenak dengan tuma'ninah" },
      { id: "ps4", urutanBenar: 3, teks: "4. Sujud Kedua & Bacaan Sahwi", artiTeks: "Melakukan sujud kedua dengan membaca doa sujud sahwi kembali" },
      { id: "ps5", urutanBenar: 4, teks: "5. Bangkit & Mengucapkan Salam", artiTeks: "Duduk kembali lalu mengucapkan salam ke kanan dan ke kiri" }
    ],
    kunciUrutanLengkap: "Tasyahud Akhir -> Sujud Pertama -> Duduk Antara Dua Sujud -> Sujud Kedua -> Salam Selesai.",
    tanggalDibuat: "2026-02-04",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII ====================
  {
    id: "puzzle-k8-g1-baqarah168",
    judul: "Puzzle Susun Ayat: QS. Al-Baqarah Ayat 168 (Halalan Thayyiban)",
    bab: "Bab 3: Menjaga Raga dan Jiwa dengan Makanan Halal",
    kelas: "VIII",
    semester: "Ganjil",
    deskripsi: "Rangkai potongan ayat perintah memakan rezeki bumi yang halal lagi bergizi serta larangan mengikuti langkah setan.",
    tipePuzzle: "Susun Ayat Al-Qur'an",
    potonganList: [
      { id: "pb1", urutanBenar: 0, teks: "يَـٰٓأَيُّهَا ٱلنَّاسُ", artiTeks: "Wahai sekalian manusia!" },
      { id: "pb2", urutanBenar: 1, teks: "كُلُوا۟ مِمَّا فِى ٱلْأَرْضِ", artiTeks: "Makanlah dari apa yang terdapat di bumi" },
      { id: "pb3", urutanBenar: 2, teks: "حَلَـٰلًۭا طَيِّبًۭا", artiTeks: "yang halal lagi baik/menyehatkan," },
      { id: "pb4", urutanBenar: 3, teks: "وَلَا تَتَّبِعُوا۟ خُطُوَٰتِ ٱلشَّيْطَـٰنِ", artiTeks: "dan janganlah kamu mengikuti langkah-langkah setan." }
    ],
    kunciUrutanLengkap: "يَـٰٓأَيُّهَا ٱلنَّاسُ كُلُوا۟ مِمَّا فِى ٱلْأَرْضِ حَلَـٰلًۭا طَيِّبًۭا وَلَا تَتَّبِعُوا۟ خُطُوَٰتِ ٱلشَّيْطَـٰنِ (QS. Al-Baqarah: 168)",
    tanggalDibuat: "2026-08-10",
    status: "Dipublikasikan"
  },
  {
    id: "puzzle-k8-g2-ilmuwan",
    judul: "Puzzle Cocok Kartu: Tokoh Cendekiawan Muslim & Bidang Ilmunya",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    deskripsi: "Susun urutan kronologis tokoh ilmuwan Abbasiyah beserta mahakarya keilmuan yang mereka sumbangkan bagi peradaban dunia.",
    tipePuzzle: "Cocok Kata & Makna",
    potonganList: [
      { id: "pi1", urutanBenar: 0, teks: "Al-Khawarizmi", artiTeks: "Bapak Aljabar, Penemu Angka Nol & Algoritma Komputer" },
      { id: "pi2", urutanBenar: 1, teks: "Ibnu Sina (Avicenna)", artiTeks: "Bapak Kedokteran Dunia & Penulis Al-Qanun fi al-Tibb" },
      { id: "pi3", urutanBenar: 2, teks: "Jabir bin Hayyan (Geber)", artiTeks: "Bapak Kimia Modern Penemu Kristalisasi & Asam Sulfat" },
      { id: "pi4", urutanBenar: 3, teks: "Al-Battani", artiTeks: "Astronom Ulung Penemu Ketepatan Hitungan Tahun 365 Hari" }
    ],
    kunciUrutanLengkap: "Al-Khawarizmi (Matematika) -> Ibnu Sina (Kedokteran) -> Jabir bin Hayyan (Kimia) -> Al-Battani (Astronomi)",
    tanggalDibuat: "2026-02-17",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX ====================
  {
    id: "puzzle-k9-g1-rukunhaji",
    judul: "Puzzle Susun Rukun: 6 Urutan Rukun Pokok Ibadah Haji",
    bab: "Bab 4: Menyempurnakan Rukun Islam Melalui Haji dan Umrah",
    kelas: "IX",
    semester: "Ganjil",
    deskripsi: "Susun kembali rukun haji yang tidak boleh ditinggalkan satu pun agar ibadah haji sah di sisi Allah SWT.",
    tipePuzzle: "Susun Rukun & Syarat",
    potonganList: [
      { id: "rh1", urutanBenar: 0, teks: "1. Ihram disertai Niat", artiTeks: "Memakai pakaian ihram dari miqat dan berniat haji" },
      { id: "rh2", urutanBenar: 1, teks: "2. Wukuf di Padang Arafah", artiTeks: "Berdiam diri bermunajat pada 9 Dzulhijjah" },
      { id: "rh3", urutanBenar: 2, teks: "3. Thawaf Ifadhah", artiTeks: "Mengelilingi Ka'bah sebanyak 7 kali putaran" },
      { id: "rh4", urutanBenar: 3, teks: "4. Sa'i", artiTeks: "Berlari kecil antara bukit Shafa dan Marwah 7 kali" },
      { id: "rh5", urutanBenar: 4, teks: "5. Tahallul (Bercukur)", artiTeks: "Memotong minimal 3 helai rambut kepala" },
      { id: "rh6", urutanBenar: 5, teks: "6. Tertib", artiTeks: "Melaksanakan rukun sesuai urutan tanpa melompat" }
    ],
    kunciUrutanLengkap: "Ihram -> Wukuf di Arafah -> Thawaf Ifadhah -> Sa'i -> Tahallul -> Tertib.",
    tanggalDibuat: "2026-07-30",
    status: "Dipublikasikan"
  },
  {
    id: "puzzle-k9-g2-mohlimo",
    judul: "Puzzle Filosofi Budaya: Ajaran Budi Pekerti 'Moh Limo' Sunan Ampel",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    deskripsi: "Rangkai 5 pantangan moral Jawa-Islam warisan Sunan Ampel dalam membentengi moral generasi muda.",
    tipePuzzle: "Cocok Kata & Makna",
    potonganList: [
      { id: "ml1", urutanBenar: 0, teks: "Moh Main", artiTeks: "Tidak mau berjudi atau taruhan dalam bentuk apa pun" },
      { id: "ml2", urutanBenar: 1, teks: "Moh Ngombe", artiTeks: "Tidak mau meminum khamr/minuman keras yang memabukkan" },
      { id: "ml3", urutanBenar: 2, teks: "Moh Maling", artiTeks: "Tidak mau mencuri, korupsi, atau mengambil hak orang lain" },
      { id: "ml4", urutanBenar: 3, teks: "Moh Madat", artiTeks: "Tidak mau menghisap candu, narkoba, atau zat berbahaya" },
      { id: "ml5", urutanBenar: 4, teks: "Moh Madon", artiTeks: "Tidak mau berzina atau berbuat asusila melanggar kehormatan" }
    ],
    kunciUrutanLengkap: "Moh Main (Judi) -> Moh Ngombe (Miras) -> Moh Maling (Mencuri) -> Moh Madat (Narkoba) -> Moh Madon (Zina)",
    tanggalDibuat: "2026-02-20",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 6. SOAL LKPD PRESETS (LEMBAR KERJA PESERTA DIDIK LENGKAP)
// =========================================================================
export const PRESET_LKPD_LIST: SoalLkpdItem[] = [
  // ==================== KELAS VII ====================
  {
    id: "lkpd-k7-g1-asmaulhusna",
    judul: "LKPD 1: Menghayati dan Menerapkan 4 Asmaul Husna dalam Kehidupan Nyata",
    bab: "Bab 1: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    kelas: "VII",
    semester: "Ganjil",
    alokasiWaktu: "2 x 40 Menit",
    capaianPembelajaran: "Peserta didik mampu memahami sifat-sifat Allah melalui Asmaul Husna (Al-'Alim, Al-Khabir, As-Sami', Al-Bashir) dan mendemonstrasikannya dalam perilaku sehari-hari.",
    tujuanPembelajaran: [
      "Mengidentifikasi dalil naqli dan arti dari 4 Asmaul Husna.",
      "Menganalisis studi kasus perilaku jujur dan teliti di lingkungan sekolah.",
      "Menyusun komitmen tindakan nyata menjauhi kemaksiatan karena meyakini pengawasan Allah."
    ],
    stimulusMateri: `Di era digital saat ini, seorang siswa sering kali berhadapan dengan godaan untuk menyontek saat ujian daring atau mengirimkan pesan negatif di media sosial tanpa nama asli. Keyakinan terhadap sifat Allah Al-Khabir (Maha Waspada) dan Al-Bashir (Maha Melihat) menegaskan bahwa tidak ada ruang hampa dari pandangan Allah. Meskipun orang tua dan guru tidak berada di dekat kita, Allah SWT senantiasa mengawasi gerak-gerik batin manusia.`,
    petunjukPengerjaan: "1. Bacalah stimulus materi di atas dengan seksama.\n2. Jawablah butir pertanyaan di bawah ini dengan argumentasi yang jelas.\n3. Cantumkan contoh konkret yang kamu lakukan di sekolah.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Rani menemukan uang sebesar Rp 50.000 di koridor sekolah yang sedang sepi. Jika Rani menghayati Asmaul Husna As-Sami' dan Al-Bashir, apa tindakan yang seharusnya ia lakukan dan berikan alasan teologisnya!",
        skorMaks: 25
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Jelaskan perbedaan mendasar antara sifat Al-'Alim (Maha Mengetahui) dengan Al-Khabir (Maha Teliti/Waspada) beserta contoh penerapannya dalam kegiatan belajar!",
        skorMaks: 25
      },
      {
        nomor: 3,
        tipeSoal: "Pilihan Ganda",
        pertanyaan: "Sikap seorang muslim yang meyakini bahwa Allah Maha Mendengar bisikan kalbu terdalam tercermin dalam tindakan...",
        pilihanOpsi: [
          "A. Berbicara sekeras-kerasnya agar didengar orang",
          "B. Selalu menjaga lisan dari ghibah dan rajin berdzikir dalam hati",
          "C. Mengabaikan nasihat orang tua",
          "D. Merasa bangga dengan amal ibadah di hadapan teman"
        ],
        kunciJawaban: "B",
        skorMaks: 25
      },
      {
        nomor: 4,
        tipeSoal: "Praktik Ibadah",
        pertanyaan: "Tuliskan rencana aksi 3 perbuatan baik harian yang akan kamu rutinkan selama satu pekan sebagai bukti iman kepada Malaikat Raqib dan Atid!",
        skorMaks: 25
      }
    ],
    rubrikPenilaian: "Skor 86-100: Jawaban sangat mendalam didasari dalil dan contoh riil. Skor 70-85: Jawaban tepat dan cukup lengkap. Skor <70: Jawaban kurang terstruktur.",
    lampiranFile: {
      namaFile: "Lembar_Kerja_Asmaul_Husna_K7.pdf",
      ukuran: "1.1 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-07-28",
    status: "Dipublikasikan"
  },
  {
    id: "lkpd-k7-g2-shalat",
    judul: "LKPD 2: Simulasi Praktik Shalat Berjamaah dan Mengatasi Makmum Masbuq",
    bab: "Bab 6: Indahnya Kebersamaan dalam Shalat Berjamaah",
    kelas: "VII",
    semester: "Genap",
    alokasiWaktu: "2 x 40 Menit",
    capaianPembelajaran: "Peserta didik mampu mempraktikkan tata cara shalat berjamaah, memahami adab makmum masbuq, dan mempraktikkan sujud sahwi secara tepat.",
    tujuanPembelajaran: [
      "Menjelaskan syarat imam dan kriteria pemilihan imam shalat.",
      "Mensimulasikan gerakan makmum masbuq yang tertinggal 1 dan 2 rakaat.",
      "Mempraktikkan bacaan dan gerakan sujud sahwi karena kelebihan rakaat."
    ],
    stimulusMateri: `Pada shalat Maghrib di masjid sekolah, Zaid datang terlambat ketika imam sudah bangkit dari ruku' pada rakaat kedua. Zaid segera berniat takbiratul ihram dan mengikuti imam sujud. Setelah imam membaca salam pada akhir rakaat ketiga, Zaid harus menyelesaikan sisa rakaatnya.`,
    petunjukPengerjaan: "Analisis skenario kasus Zaid, lalu uraikan langkah demi langkah tindakan yang harus diambil Zaid agar shalatnya sah.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Berdasarkan kasus Zaid di atas, berapa rakaatkah yang sudah didapatkan Zaid bersama imam, dan berapa rakaat yang wajib ia tambahkan setelah imam salam? Jelaskan ketentuannya!",
        skorMaks: 30
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Tuliskan bacaan sujud sahwi beserta artinya dan jelaskan dua sebab utama disyariatkannya sujud sahwi dalam shalat fardhu!",
        skorMaks: 35
      },
      {
        nomor: 3,
        tipeSoal: "Praktik Ibadah",
        pertanyaan: "Buatlah bagan urutan posisi shaf shalat berjamaah jika terdiri dari imam laki-laki dewasa, makmum laki-laki dewasa, makmum anak laki-laki, dan makmum wanita!",
        skorMaks: 35
      }
    ],
    rubrikPenilaian: "Ketepatan penentuan rakaat masbuq bernilai 30 poin, hafalan bacaan sahwi 35 poin, bagan posisi shaf 35 poin.",
    lampiranFile: {
      namaFile: "LKPD_Shalat_Berjamaah_Masbuq.pdf",
      ukuran: "980 KB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-02-06",
    status: "Dipublikasikan"
  },

  // ==================== KELAS VIII ====================
  {
    id: "lkpd-k8-g1-makananhalal",
    judul: "LKPD 1: Investigasi Kehalalan Produk Makanan dan Minuman di Kantin Sekolah",
    bab: "Bab 3: Menjaga Raga dan Jiwa dengan Makanan Halal",
    kelas: "VIII",
    semester: "Ganjil",
    alokasiWaktu: "3 x 40 Menit (Proyek Lapangan)",
    capaianPembelajaran: "Peserta didik mampu mengidentifikasi kriteria makanan halalan thayyiban, menganalisis komposisi produk kemasan, serta menghindari makanan haram.",
    tujuanPembelajaran: [
      "Meneliti keberadaan logo halal resmi BPJPH pada 3 produk makanan kemasan.",
      "Mengidentifikasi bahan tambahan pangan (BTP) yang kritis terhadap status halal.",
      "Menyusun laporan mini audit kebersihan dan nilai gizi makanan kantin sekolah."
    ],
    stimulusMateri: `Makanan halal tidak hanya dinilai dari tidak adanya daging babi atau khamr, tetapi juga menyangkut zat pengemulsi (emulsifier), gelatin, perisa, dan cara penyembelihan hewani. Melalui kegiatan investigasi ini, siswa dilatih menjadi konsumen cerdas yang selektif dan senantiasa menjaga kebersihan konsumsi jasmani.`,
    petunjukPengerjaan: "Bekerjalah secara mandiri atau berpasangan. Pilihlah 2 produk makanan ringan kemasan yang sering kamu konsumsi dan periksa komposisi bahannya.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Amati label kemasan produk makanan yang kamu bawa. Tuliskan nama produk, nomor registrasi halal BPJPH, dan analisa 3 bahan utama penyusunnya!",
        skorMaks: 30
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Mengapa makanan yang diperoleh dari hasil tidak halal (misalnya menipu atau mencuri) dapat menghalangi terkabulnya doa seseorang? Hubungkan dengan hadits Rasulullah SAW!",
        skorMaks: 35
      },
      {
        nomor: 3,
        tipeSoal: "Praktik Ibadah",
        pertanyaan: "Tuliskan 3 tips praktis bagi remaja muslim agar terhindar dari membeli makanan olahan yang meragukan (syubhat) saat berada di tempat umum!",
        skorMaks: 35
      }
    ],
    rubrikPenilaian: "Hasil observasi kemasan bernilai 30 poin, kedalaman refleksi dalil hadits 35 poin, orisinalitas tips bernilai 35 poin.",
    lampiranFile: {
      namaFile: "LKPD_Proyek_Audit_Halal_Kantin.pdf",
      ukuran: "1.6 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-08-18",
    status: "Dipublikasikan"
  },
  {
    id: "lkpd-k8-g2-abbasiyah",
    judul: "LKPD 2: Meneladani Etos Intelektual Ilmuwan Muslim Baitul Hikmah",
    bab: "Bab 8: Meneladani Semangat Keilmuan Daulah Abbasiyah",
    kelas: "VIII",
    semester: "Genap",
    alokasiWaktu: "2 x 40 Menit",
    capaianPembelajaran: "Peserta didik mampu menguraikan kontribusi keilmuan Daulah Abbasiyah dan merefleksikan semangat riset ilmuwan muslim dalam studi kontemporer.",
    tujuanPembelajaran: [
      "Menjelaskan peran Baitul Hikmah dalam penerjemahan naskah ilmu pengetahuan dunia.",
      "Membuat biografi singkat salah satu ilmuwan muslim (Al-Khawarizmi / Ibnu Sina).",
      "Menghubungkan inspirasi keilmuan Abbasiyah dengan penguasaan teknologi saat ini."
    ],
    stimulusMateri: `Baghdad pada abad ke-8 hingga ke-12 Masehi dijuluki sebagai mercusuar peradaban dunia. Perpustakaan Baitul Hikmah tidak hanya menyimpan buku, tetapi juga menggaji para ilmuwan dengan timbangan emas murni seberat buku yang mereka terjemahkan. Semangat haus ilmu ini mengantarkan lahirnya konsep aljabar dan metode kedokteran klinis modern.`,
    petunjukPengerjaan: "Jawablah pertanyaan berikut dengan mengkaji fakta sejarah dan analisis relevansi masa kini.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Bagaimana strategi Khalifah Al-Ma'mun memajukan Baitul Hikmah sehingga Baghdad dapat menjadi pusat sains mengungguli peradaban Eropa pada masanya?",
        skorMaks: 30
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Al-Khawarizmi menemukan angka nol dan konsep algoritma yang kini mendasari seluruh teknologi komputer dan kecerdasan buatan (AI). Nilai keteladanan apa yang dapat kamu terapkan dalam kehidupan belajarmu?",
        skorMaks: 35
      },
      {
        nomor: 3,
        tipeSoal: "Praktik Ibadah",
        pertanyaan: "Sebagai seorang pelajar muslim abad ke-21, sebutkan 3 langkah konkret yang akan kamu lakukan untuk berkontribusi memajukan sains dan teknologi yang bermanfaat bagi umat!",
        skorMaks: 35
      }
    ],
    rubrikPenilaian: "Ketepatan fakta sejarah 30 poin, kedalaman analisis inspiratif 35 poin, aksi konkret 35 poin.",
    lampiranFile: {
      namaFile: "LKPD_Inspirasi_Sains_Abbasiyah.pdf",
      ukuran: "1.3 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-02-21",
    status: "Dipublikasikan"
  },

  // ==================== KELAS IX ====================
  {
    id: "lkpd-k9-g1-hariakhir",
    judul: "LKPD 1: Peta Konsep Rangkaian Peristiwa Hari Akhir dan Refleksi Karakter",
    bab: "Bab 1: Meniti Hidup Bermakna dengan Meyakini Hari Akhir",
    kelas: "IX",
    semester: "Ganjil",
    alokasiWaktu: "2 x 40 Menit",
    capaianPembelajaran: "Peserta didik mampu menyusun peta konsep peristiwa yaumul akhir dan merefleksikannya dalam sikap tanggung jawab serta integritas pribadi.",
    tujuanPembelajaran: [
      "Mengurutkan kronologis fase kehidupan setelah kematian (Alam Barzakh hingga Surga/Neraka).",
      "Menganalisis dalil naqli QS. Al-Zalzalah mengenai guncangan kiamat kubra.",
      "Merumuskan ikrar perbaikan diri menghindari perbuatan sia-sia."
    ],
    stimulusMateri: `Keyakinan terhadap hari pembalasan (Yaumul Jaza') adalah penjamin utama moral manusia. Seseorang yang meyakini bahwa setiap perkataan dan ketikan jarinya di media sosial akan dipertanggungjawabkan di hadapan Allah tidak akan mudah menyebarkan fitnah atau berbuat curang.`,
    petunjukPengerjaan: "Lengkapi alur bagan hari akhir dan jawablah soal analisis di bawah ini.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Jelaskan secara berurutan makna dari: Yaumul Ba'ats, Yaumul Mahsyar, Yaumul Hisab, dan Yaumul Mizan beserta kondisi psikologis manusia saat menghadapinya!",
        skorMaks: 35
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Bagaimana cara meyakini hari akhir dapat membentuk benteng pertahanan moral seorang remaja agar tidak terjerumus ke dalam pergaulan bebas dan penyalahgunaan obat-obatan?",
        skorMaks: 35
      },
      {
        nomor: 3,
        tipeSoal: "Pilihan Ganda",
        pertanyaan: "Di Padang Mahsyar, manusia tidak dapat meminta tolong kepada siapa pun kecuali mengharapkan syafaat Rasulullah SAW dan naungan Allah. Golongan pemuda yang mendapatkan naungan istimewa pada hari itu adalah...",
        pilihanOpsi: [
          "A. Pemuda yang menghabiskan waktunya bersenang-senang",
          "B. Pemuda yang tumbuh dewasa dalam ketekunan beribadah kepada Allah",
          "C. Pemuda yang memiliki banyak pengikut di media sosial",
          "D. Pemuda yang gemar berdebat mencari ketenaran"
        ],
        kunciJawaban: "B",
        skorMaks: 30
      }
    ],
    rubrikPenilaian: "Penguasaan konsep 35 poin, refleksi moralitas remaja 35 poin, pemahaman hadits naungan 30 poin.",
    lampiranFile: {
      namaFile: "LKPD_Peta_Konsep_Hari_Akhir.pdf",
      ukuran: "1.4 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-08-01",
    status: "Dipublikasikan"
  },
  {
    id: "lkpd-k9-g2-walisongo",
    judul: "LKPD 2: Analisis Strategi Akulturasi Budaya dan Kearifan Lokal Wali Songo",
    bab: "Bab 7: Merajut Harmoni Nusantara Melalui Jejak Sejarah Islam",
    kelas: "IX",
    semester: "Genap",
    alokasiWaktu: "2 x 40 Menit",
    capaianPembelajaran: "Peserta didik mampu menelaah strategi dakwah kultural Wali Songo dan menyimpulkan nilai kearifan lokal yang relevan untuk memperkokoh persatuan bangsa.",
    tujuanPembelajaran: [
      "Mengidentifikasi 4 jalur masuknya Islam ke Nusantara (perdagangan, perkawinan, pendidikan, seni budaya).",
      "Menganalisis filosofi tembang Lir-Ilir ciptaan Sunan Kalijaga.",
      "Menyusun gagasan pelestarian kearifan lokal bernilai Islami di daerah masing-masing."
    ],
    stimulusMateri: `Wali Songo tidak merusak budaya lokal masyarakat Nusantara yang telah ada sebelumnya, melainkan mewarnai dan menyempurnakannya dengan nilai-nilai tauhid (Islam berkebudayaan). Menara Kudus yang berarsitektur candi Hindu dan tembang dolanan anak merupakan bukti kecerdasan metodologi dakwah yang ramah, santun, dan sejuk.`,
    petunjukPengerjaan: "Kaji lirik tembang Lir-Ilir dan jawablah pertanyaan esai di bawah ini secara mendalam.",
    daftarSoal: [
      {
        nomor: 1,
        tipeSoal: "Analisis Kasus",
        pertanyaan: "Jelaskan makna filosofis dari bait tembang Lir-Ilir: 'Cah angon cah angon penekno blimbing kuwi, lunyu-lunyu penekno kanggo mbasuh dodotiro' dalam kaitannya dengan rukun Islam dan penyucian jiwa!",
        skorMaks: 40
      },
      {
        nomor: 2,
        tipeSoal: "Esai Reflektif",
        pertanyaan: "Mengapa pendekatan dakwah santun dan damai (bil hikmah wal mau'izhatil hasanah) yang dipraktikkan para wali jauh lebih efektif daripada metode kekerasan? Berikan pendapatmu!",
        skorMaks: 30
      },
      {
        nomor: 3,
        tipeSoal: "Praktik Ibadah",
        pertanyaan: "Sebutkan satu tradisi atau seni budaya di daerahmu yang bernafaskan nilai-nilai Islam dan bagaimana cara generasi muda menjaganya agar tetap lestari!",
        skorMaks: 30
      }
    ],
    rubrikPenilaian: "Interpretasi filosofi bait tembang 40 poin, analisis metodologi dakwah 30 poin, aksi pelestarian budaya 30 poin.",
    lampiranFile: {
      namaFile: "LKPD_Akulturasi_Dakwah_Wali_Songo.pdf",
      ukuran: "1.7 MB",
      tipe: "pdf"
    },
    tanggalDibuat: "2026-02-24",
    status: "Dipublikasikan"
  }
];

// =========================================================================
// 7. PRESET PENUGASAN BAHAN AJAR
// =========================================================================
export const PRESET_PENUGASAN_LIST = [
  {
    id: "tugas-preset-1",
    tipe: "materi" as const,
    referensiId: "materi-k7-g1-asmaulhusna",
    judul: "Telaah Mendalam 4 Asmaul Husna (Al-Alim, Al-Khabir, As-Sami', Al-Bashir)",
    kelasId: "Semua Kelas VII",
    kelasTingkat: "VII" as const,
    semester: "Ganjil" as const,
    instruksi: "Bacalah intisari materi Asmaul Husna, catat 4 dalil rujukan, dan tuliskan refleksi amalan nyata dalam buku jurnal.",
    batasWaktu: "2026-10-15",
    tanggalTugas: "2026-07-20"
  },
  {
    id: "tugas-preset-2",
    tipe: "video" as const,
    referensiId: "video-k7-g1-thaharah",
    judul: "Simak Video Praktik Thaharah, Tata Cara Wudhu & Tayamum Sempurna",
    kelasId: "VII-A",
    kelasTingkat: "VII" as const,
    semester: "Ganjil" as const,
    instruksi: "Tonton video tutorial wudhu dan persiapkan diri untuk demonstrasi praktik wudhu di mushola sekolah.",
    batasWaktu: "2026-10-20",
    tanggalTugas: "2026-07-25"
  }
];
