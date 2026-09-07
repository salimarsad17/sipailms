/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoalPilihanGanda, BabPelajaran } from "../types";
import { generateAutomaticQuiz } from "./quizGenerator";

export interface LKPDItem {
  id: string;
  judul: string;
  kelasId: string;
  semester: string;
  babJudul: string;
  elemen: "Al-Qur'an Hadis" | "Akidah" | "Akhlak" | "Fiqih" | "Sejarah Peradaban Islam";
  alokasiWaktu: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  petunjukKerja: string[];
  stimulusBacaan: {
    judul: string;
    teks: string;
    dalilNaqli?: {
      teksArab: string;
      terjemahan: string;
      sumber: string;
    };
  };
  aktivitasMandiri: {
    pertanyaanHots: string[];
  };
  aktivitasKelompok: {
    judulTugas: string;
    instruksi: string;
    pertanyaanDiskusi: string[];
  };
  soalPilihanGanda: SoalPilihanGanda[];
  refleksiKarakter: string[];
  rubrikPenilaian: {
    aspek: string;
    skor4: string;
    skor3: string;
    skor2: string;
  }[];
  tanggalDibuat: string;
}

export interface LKPDGeneratorOptions {
  kelasId?: string;
  semester?: string;
  difficulty?: "Mudah" | "Sedang" | "HOTS";
  jumlahSoal?: number;
  tipeLKPD?: "Individu" | "Kelompok" | "Komprehensif";
}

export function generateAutomaticLKPD(
  babJudul: string,
  deskripsi: string = "",
  options: LKPDGeneratorOptions = {}
): LKPDItem {
  const kelas = options.kelasId || "VII";
  const sem = options.semester || "1";
  const diff = options.difficulty || "HOTS";
  const jumlahSoal = options.jumlahSoal || 5;

  const topicLower = babJudul.toLowerCase() + " " + deskripsi.toLowerCase();

  // Create mock BabPelajaran to pass to quiz generator
  const tempBab: BabPelajaran = {
    id: "temp_" + Date.now(),
    key: "temp_" + Date.now(),
    judul: babJudul,
    deskripsi: deskripsi || babJudul,
    dokumen: [],
    video: {
      judul: "Video PAI",
      duration: "10 Menit",
      source: "#"
    },
    kelasId: kelas,
    soalList: []
  };

  const quizList = generateAutomaticQuiz(tempBab, { count: jumlahSoal, difficulty: diff });

  if (topicLower.includes("thaharah") || topicLower.includes("bersuci") || topicLower.includes("wudhu") || topicLower.includes("najis")) {
    return buildThaharahLKPD(babJudul, kelas, sem, diff, quizList);
  } else if (topicLower.includes("amanah") || topicLower.includes("jujur") || topicLower.includes("akhlak")) {
    return buildAkhlakLKPD(babJudul, kelas, sem, diff, quizList);
  } else if (topicLower.includes("umayyah") || topicLower.includes("sejarah") || topicLower.includes("damaskus")) {
    return buildSejarahLKPD(babJudul, kelas, sem, diff, quizList);
  } else if (topicLower.includes("shalat") || topicLower.includes("sujud") || topicLower.includes("jamaah")) {
    return buildShalatLKPD(babJudul, kelas, sem, diff, quizList);
  } else if (topicLower.includes("qur'an") || topicLower.includes("tajwid") || topicLower.includes("surah")) {
    return buildAlQuranLKPD(babJudul, kelas, sem, diff, quizList);
  } else {
    return buildGenericLKPD(babJudul, kelas, sem, diff, quizList);
  }
}

function buildThaharahLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Fiqih",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: "Peserta didik memahami ketentuan bersuci dari hadas dan najis, mampu mengidentifikasi jenis-jenis najis, serta dapat mempraktikkan tata cara wudhu, tayamum, dan mandi wajib sesuai syariat Islam.",
    tujuanPembelajaran: [
      "Menguraikan pengertian Thaharah dan perbedaan antara hadas kecil, hadas besar, serta jenis-jenis najis.",
      "Menganalisis tata cara bersuci (wudhu, tayamum, mandi wajib) sesuai kaidah Fiqih Kurikulum Merdeka.",
      "Menyajikan simulasi/praktik tata cara wudhu dan tayamum secara tertib dalam kehidupan sehari-hari."
    ],
    petunjukKerja: [
      "Bacalah stimulus teks bacaan dan dalil Naqli dengan cermat bersama anggota kelompok Anda.",
      "Diskusikan pertanyaan analisis pada Aktivitas Kelompok dan tuliskan hasil perumusan solusi.",
      "Kerjakan soal latihan mandiri secara individu untuk mengukur pemahaman materi.",
      "Isilah lembar refleksi sikap diri sebagai wujud komitmen penerapan budaya bersih."
    ],
    stimulusBacaan: {
      judul: "Kemuliaan Bersuci dan Kebersihan dalam Islam",
      teks: "Thaharah merupakan asas utama keabsahan ibadah dalam ajaran Islam. Allah SWT menyukai hamba-Nya yang senantiasa menjaga kebersihan fisik, pakaian, dan tempat tinggal dari segala kotoran maupun najis.",
      dalilNaqli: {
        teksArab: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
        terjemahan: "Sungguh, Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri. (QS. Al-Baqarah: 222)",
        sumber: "QS. Al-Baqarah [2]: 222"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        "Jelaskan mengapa seseorang yang telah berwudhu tetapi pakaiannya terkena najis Mutawassitah tidak sah melaksanakan shalat, serta bagaimanakah langkah penyuciannya?",
        "Analisislah kondisi-kondisi darurat yang membolehkan seorang Muslim mengganti wudhu dengan tayamum saat melakukan perjalanan jauh!"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Analisis Studi Kasus Fiqih Thaharah Sehari-hari",
      instruksi: "Diskusikan dengan kelompokmu skenario berikut: 'Budi sedang berkemah di area pegunungan dan suhu udara sangat dingin hingga mendekati titik beku. Persediaan air sangat terbatas dan hanya cukup untuk minum. Budi mengalami hadas besar. Apa ketetapan hukum Islam dan tata cara bersuci yang harus Budi lakukan?'",
      pertanyaanDiskusi: [
        "Identifikasi jenis hadas yang dialami oleh Budi dalam skenario di atas!",
        "Apakah Budi diperbolehkan bertayamum? Sebutkan alasan hukum fiqihnya!",
        "Tuliskan langkah-langkah praktis tayamum yang benar secara berurutan!"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya senantiasa menjaga kebersihan badan, pakaian, dan meja belajar sebelum memulai pembelajaran.",
      "Saya berwudhu secara tertib tanpa membuang-buang air berlebihan.",
      "Saya membiasakan mencuci tangan dan menjaga kebersihan lingkungan sekolah."
    ],
    rubrikPenilaian: [
      {
        aspek: "Pemahaman Konsep Fiqih",
        skor4: "Mampu menjelaskan jenis hadas & najis serta hukum penyuciannya secara lengkap dan tepat.",
        skor3: "Mampu menjelaskan sebagian besar konsep fiqih dengan tepat.",
        skor2: "Penjelasan konsep fiqih masih terbatas dan memerlukan bimbingan."
      },
      {
        aspek: "Kerjasama Diskusi Kelompok",
        skor4: "Sangat aktif berdiskusi, memberikan ide konstruktif, dan menghargai pendapat teman.",
        skor3: "Cukup aktif dalam diskusi kelompok.",
        skor2: "Pasif dan hanya menerima jawaban dari teman kelompok."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}

function buildAkhlakLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Akhlak",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: "Peserta didik memahami hakikat sifat Jujur dan Amanah, mampu mengaitkannya dengan keteladanan Nabi Muhammad SAW, serta menerapkan akhlakul karimah dalam kehidupan sekolah, keluarga, dan masyarakat.",
    tujuanPembelajaran: [
      "Menjelaskan makna Jujur dan Amanah serta dalil Naqli yang melandasinya.",
      "Menganalisis contoh penerapan perilaku jujur dan amanah di sekolah dan kantin kejujuran.",
      "Mendesain komitmen pribadi untuk mempraktikkan sifat jujur dan terpercaya."
    ],
    petunjukKerja: [
      "Pahami teks stimulus mengenai keteladanan Nabi Muhammad SAW berpola hidup jujur.",
      "Analisislah studi kasus dilema etika di sekolah pada bagian aktivitas kelompok.",
      "Selesaikan latihan soal objektif dan tuliskan komitmen karakter harian."
    ],
    stimulusBacaan: {
      judul: "Gelar Al-Amin dan Kejujuran Rasulullah SAW",
      teks: "Sejak masa muda sebelum diangkat menjadi Nabi, Muhammad SAW telah dikenal masyarakat Makkah sebagai sosok yang sangat jujur dan memegang teguh amanah sehingga dianugerahi gelar Al-Amin.",
      dalilNaqli: {
        teksArab: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
        terjemahan: "Wahai orang-orang yang beriman! Bertakwalah kepada Allah, dan bersamalah kamu dengan orang-orang yang benar/jujur. (QS. At-Tawbah: 119)",
        sumber: "QS. At-Tawbah [9]: 119"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        "Bagaimana pendapatmu jika seorang teman mengajak menyontek dengan alasan menjaga rasa solidaritas? Berikan argumen Fiqih dan Akhlak yang tepat!",
        "Mengapa kejujuran disebut sebagai induk dari segala kebaikan dalam ajaran Islam?"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Diskusi Dilema Moral di Kantin Kejujuran",
      instruksi: "Diskusikan dalam kelompok: 'Seorang siswa menemukan dompet berisi uang di perpustakaan tanpa ada identitas pemilik. Teman dekatnya menyarankan untuk menggunakan uang tersebut untuk kas kelas. Bagaimana keputusan yang paling berakhlak?'",
      pertanyaanDiskusi: [
        "Sebutkan nilai amanah yang diuji dalam skenario tersebut!",
        "Tuliskan langkah terbaik yang harus dilakukan siswa tersebut sesuai ajaran Islam!",
        "Apa dampak negatif jika seseorang melanggar sifat amanah terhadap kepercayaan orang lain?"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya selalu berkata jujur kepada orang tua dan guru dalam situasi apapun.",
      "Saya tidak pernah menyontek saat mengerjakan tugas, kuis, atau ujian sekolah.",
      "Saya menjaga barang titipan teman dengan penuh rasa tanggung jawab."
    ],
    rubrikPenilaian: [
      {
        aspek: "Penalaram Moral & Akhlak",
        skor4: "Memberikan argumentasi moral yang sangat tajam berbasis dalil Al-Qur'an & Hadits.",
        skor3: "Argumentasi moral runtut dan relevan dengan topik.",
        skor2: "Argumentasi moral masih kurang mendasar."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}

function buildSejarahLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Sejarah Peradaban Islam",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: "Peserta didik menganalisis sejarah perkembangan peradaban Islam masa Daulah Umayyah di Damaskus, kemajuan sains, kebudayaan, serta mengambil ibrah dan nilai keteladanan.",
    tujuanPembelajaran: [
      "Menguraikan sejarah berdirinya Daulah Umayyah dan tokoh-tokoh khalifah berprestasi.",
      "Mengidentifikasi pusat perkembangan ilmu pengetahuan, sains, dan seni arsitektur Islam.",
      "Mengambil ibrah sejarah untuk menumbuhkan semangat belajar dan persatuan bangsa."
    ],
    petunjukKerja: [
      "Bacalah paparan sejarah perkembangan Daulah Umayyah Damaskus.",
      "Buatlah peta konsep atau linimasa perkembangan peradaban Islam bersama kelompok.",
      "Jawablah pertanyaan kuis dan lembar refleksi sejarah."
    ],
    stimulusBacaan: {
      judul: "Era Keemasan Sains dan Arsitektur Damaskus",
      teks: "Daulah Umayyah di Damaskus menjadi jembatan keemasan ekspansi peradaban Islam. Pembangunan Masjid Agung Damaskus, pencetakan mata uang dinar Islam, dan pengembangan ilmu qira'at menjadi bukti keagungan Islam.",
      dalilNaqli: {
        teksArab: "قُلْ سِيرُوا فِي الْأَرْضِ فَانْظُرُوا كَيْفَ بَدَأَ الْخَلْقَ",
        terjemahan: "Katakanlah: 'Berjalanlah di bumi, maka perhatikanlah bagaimana Allah menciptakan (manusia) dari permulaannya...' (QS. Al-Ankabut: 20)",
        sumber: "QS. Al-Ankabut [29]: 20"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        "Jelaskan faktor-faktor kunci yang menyebabkan Daulah Umayyah mampu memperluas wilayah dan mengembangkan sains hingga ke wilayah Eropa/Andalusia!",
        "Pelajaran berharga apa dari kepemimpinan Umar bin Abdul Aziz yang sangat relevan dicontoh oleh pemimpin muda masa kini?"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Proyek Linimasa Peta Peradaban Islam",
      instruksi: "Buatlah bagan linimasa (timeline) perkembangan Daulah Umayyah dari fase pendirian oleh Muawiyah I, puncak kejayaan Al-Walid I, hingga kepemimpinan adil Umar bin Abdul Aziz.",
      pertanyaanDiskusi: [
        "Apa perbedaan sistem suksesi kepemimpinan Khulafaur Rasyidin dan Daulah Umayyah?",
        "Tuliskan 3 karya besar Daulah Umayyah yang bermanfaat bagi peradaban dunia!",
        "Bagaimana cara generasi muda Muslim meneladani etos ilmu ilmuwan Muslim masa lalu?"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya memiliki semangat tinggi dalam mempelajari ilmu pengetahuan umum dan agama.",
      "Saya menghargai warisan sejarah peradaban Islam dan menjaga persatuan.",
      "Saya meneladani kesederhanaan dan keadilan Khalifah Umar bin Abdul Aziz."
    ],
    rubrikPenilaian: [
      {
        aspek: "Kelengkapan Linimasa Sejarah",
        skor4: "Linimasa sangat runtut, memuat tokoh kunci, tahun penting, dan narasi ibrah secara komprehensif.",
        skor3: "Linimasa cukup runtut dan memuat informasi utama.",
        skor2: "Linimasa kurang lengkap."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}

function buildShalatLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Fiqih",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: "Peserta didik memahami tata cara shalat fardhu, shalat berjamaah, dan zikir serta doa sesudah shalat sebagai sarana mendekatkan diri kepada Allah SWT.",
    tujuanPembelajaran: [
      "Menjelaskan keutamaan shalat berjamaah dan tata cara menjadi imam serta makmum.",
      "Menganalisis syarat sah shalat dan hal-hal yang membatalkannya.",
      "Mempraktikkan gerakan dan bacaan shalat secara khusyu'."
    ],
    petunjukKerja: [
      "Amati peragaan gerakan shalat dan bacaan dari guru/video.",
      "Simulasikan tata cara shalat berjamaah bersama kelompok di musala sekolah.",
      "Selesaikan tugas evaluasi tertulis."
    ],
    stimulusBacaan: {
      judul: "Kedudukan Shalat Sebagai Tiang Agama",
      teks: "Shalat adalah ibadah pertama yang akan dihisab di hari kiamat. Shalat berjamaah melatih kedisiplinan, persatuan umat, dan rasa kebersamaan tanpa membeda-bedakan status sosial.",
      dalilNaqli: {
        teksArab: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
        terjemahan: "Dan laksanakanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk. (QS. Al-Baqarah: 43)",
        sumber: "QS. Al-Baqarah [2]: 43"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        "Bagaimanakah tata cara makmum masbuq (terlambat) saat mendapati imam sudah dalam posisi ruku'?",
        "Mengapa shalat mencegah seseorang dari perbuatan keji dan munkar?"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Praktik & Simulasi Tata Cara Shalat Berjamaah",
      instruksi: "Bagi anggota kelompok menjadi Imam, Makmum Muwafiq, dan Makmum Masbuq. Praktikkan gerakan dan adab shalat berjamaah secara benar.",
      pertanyaanDiskusi: [
        "Sebutkan syarat menjadi imam shalat berjamaah!",
        "Bagaimana tindakan makmum jika imam lupa bilangan rakaat shalat?",
        "Tuliskan doa kebaikan dunia akhirat sesudah shalat!"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya berusaha mendirikan shalat 5 waktu tepat pada waktunya.",
      "Saya mengutamakan shalat berjamaah di masjid/musala.",
      "Saya mempraktikkan zikir dan doa dengan tenang sesudah shalat."
    ],
    rubrikPenilaian: [
      {
        aspek: "Kesesuaian Gerakan & Bacaan Shalat",
        skor4: "Gerakan tuma'ninah sempurna, bacaan fasih dan lancar.",
        skor3: "Gerakan dan bacaan cukup baik.",
        skor2: "Masih terdapat kesalahan bacaan/gerakan."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}

function buildAlQuranLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Al-Qur'an Hadis",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: "Peserta didik mampu membaca Al-Qur'an dengan tartil menerapkan hukum tajwid, memahami kandungan ayat, dan menghafalkan surah pilihan.",
    tujuanPembelajaran: [
      "Mengidentifikasi hukum bacaan Tajwid dalam surah pilihan.",
      "Menterjemahkan ayat per ayat dan menguraikan pesan utamanya.",
      "Menampilkan hafalan surah pilihan secara fasih."
    ],
    petunjukKerja: [
      "Bacalah ayat Al-Qur'an dengan cermat memperhatikan tanda tajwid.",
      "Tandai hukum bacaan Nun Sukun, Tanwin, atau Mad pada lembar kerja.",
      "Diskusikan kandungan ayat bersama kawan sebangku."
    ],
    stimulusBacaan: {
      judul: "Keagungan Al-Qur'an Sebagai Petunjuk Hidup",
      teks: "Al-Qur'an diturunkan sebagai petunjuk (Hudan) dan pembeda antara yang hak dan batil. Membacanya mendapat pahala berlipat ganda pada setiap hurufnya.",
      dalilNaqli: {
        teksArab: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        terjemahan: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya. (HR. Bukhari)",
        sumber: "HR. Bukhari No. 5027"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        "Uraikan perbedaan hukum bacaan Idgham Bighunnah dan Idgham Bilaghunnah beserta contohlafazhnya dalam Surah Pilihan!",
        "Bagaimana cara menerapkan pesan kandungan Al-Qur'an dalam menghadapi tantangan era digital saat ini?"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Tadarus & Pemetaan Tajwid Ayat Al-Qur'an",
      instruksi: "Analisis surah pilihan, temukan setidaknya 5 hukum bacaan tajwid yang berbeda, dan tuliskan alasan hukumnya.",
      pertanyaanDiskusi: [
        "Tuliskan potongan ayat yang mengandung hukum Idzhar Halqi!",
        "Mengapa membaca Al-Qur'an harus menggunakan hukum tajwid?",
        "Jelaskan kandungan moral dari surah yang dipelajari!"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya menyempatkan membaca Al-Qur'an setiap hari sesudah shalat Maghrib/Subuh.",
      "Saya belajar membaca Al-Qur'an dengan tajwid yang benar.",
      "Saya mengamalkan pesan moral Al-Qur'an dalam bersikap."
    ],
    rubrikPenilaian: [
      {
        aspek: "Ketepatan Bacaan Tajwid",
        skor4: "Makhraj dan hukum tajwid sangat presisi, bacaan tartil.",
        skor3: "Makhraj dan tajwid cukup baik.",
        skor2: "Banyak kekeliruan tajwid."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}

function buildGenericLKPD(judul: string, kelas: string, sem: string, diff: string, quizList: SoalPilihanGanda[]): LKPDItem {
  return {
    id: "lkpd_" + Date.now(),
    judul: `LKPD PAI: ${judul}`,
    kelasId: kelas,
    semester: sem,
    babJudul: judul,
    elemen: "Akidah",
    alokasiWaktu: "2 x 40 Menit (1 Pertemuan)",
    capaianPembelajaran: `Peserta didik memahami esensi materi ${judul} Kurikulum Merdeka PAI SMP, mampu mengidentifikasi nilai-nilai keislaman, serta menerapkannya dalam kehidupan harian.`,
    tujuanPembelajaran: [
      `Memahami konsep dasar materi ${judul} secara utuh.`,
      "Menganalisis keterkaitan ajaran Islam dengan kehidupan bermasyarakat.",
      "Menunjukkan sikap dan karakter Profil Pelajar Pancasila & Rahmatan Lil 'Alamin."
    ],
    petunjukKerja: [
      "Simak paparan materi dari guru dan bacalah bahan ajar.",
      "Kerjakan tugas diskusi kelompok dan latihan mandiri.",
      "Isilah penilaian refleksi diri."
    ],
    stimulusBacaan: {
      judul: `Pendalaman Materi PAI: ${judul}`,
      teks: `Pembelajaran ${judul} memberikan panduan moral dan spiritual bagi murid untuk tumbuh menjadi pribadi yang beriman, bertaqwa, dan berakhlak mulia.`,
      dalilNaqli: {
        teksArab: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
        terjemahan: "Dan katakanlah: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.' (QS. Taha: 114)",
        sumber: "QS. Taha [20]: 114"
      }
    },
    aktivitasMandiri: {
      pertanyaanHots: [
        `Mengapa pemahaman tentang ${judul} penting dalam membentuk karakter generasi muda Muslim masa kini?`,
        "Berikan contoh konkret penerapan ilmu yang dipelajari dalam kehidupan sehari-hari di sekolah!"
      ]
    },
    aktivitasKelompok: {
      judulTugas: "Studi Kasus dan Lembar Diskusi Kelompok",
      instruksi: "Diskusikan dalam kelompok mengenai penerapan materi ini di lingkungan sekolah dan solusi atas hambatan yang ditemui.",
      pertanyaanDiskusi: [
        "Apa poin-poin utama yang dipelajari pada bab ini?",
        "Bagaimana cara mengatasi tantangan dalam mengamalkan nilai-nilai ini?",
        "Tuliskan kesimpulan hasil diskusi kelompokmu!"
      ]
    },
    soalPilihanGanda: quizList,
    refleksiKarakter: [
      "Saya bersemangat mengikuti pembelajaran PAI.",
      "Saya mengamalkan ilmu yang didapat untuk kebaikan bersama.",
      "Saya menghormati teman, guru, dan orang tua."
    ],
    rubrikPenilaian: [
      {
        aspek: "Keaktifan dan Kualitas Hasil Kerja",
        skor4: "Sangat aktif dan hasil kerja sangat terstruktur.",
        skor3: "Aktif dan hasil kerja memadai.",
        skor2: "Kurang aktif dan membutuhkan bimbingan."
      }
    ],
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  };
}
