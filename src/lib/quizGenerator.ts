/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BabPelajaran, SoalPilihanGanda } from "../types";

export interface QuizGeneratorOptions {
  count?: number;
  difficulty?: "Mudah" | "Sedang" | "HOTS" | "Campuran";
  topicOverride?: string;
}

type DifficultyLevel = "Mudah" | "Sedang" | "HOTS";

interface TopicQuestionBank {
  mudah: Omit<SoalPilihanGanda, "id">[];
  sedang: Omit<SoalPilihanGanda, "id">[];
  hots: Omit<SoalPilihanGanda, "id">[];
}

// 1. THAHARAH (BERSUCI)
const thaharahBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Menurut bahasa (etimologi), kata Thaharah memiliki arti...",
      pilihan: [
        "A. Mensucikan dan membersihkan diri dari kotoran",
        "B. Beribadah bersama-sama di dalam masjid",
        "C. Menjaga lisan dari perkataan dusta",
        "D. Menghafalkan ayat Al-Qur'an secara tertib"
      ],
      jawabanBenar: "A",
      pembahasan: "Secara bahasa Thaharah berarti bersuci atau bersih. Menurut istilah syara', Thaharah adalah mensucikan diri dari hadats dan najis sebagai syarat sah ibadah shalat.",
      tingkatKesulitan: "Mudah",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Air kencing bayi laki-laki berusia di bawah 2 tahun yang hanya mengonsumsi ASI tergolong najis...",
      pilihan: [
        "A. Najis Mutawassithah (Sedang)",
        "B. Najis Mukhaffafah (Ringan)",
        "C. Najis Mughalladhah (Berat)",
        "D. Najis Ma'fu (Dimaafkan)"
      ],
      jawabanBenar: "B",
      pembahasan: "Air kencing bayi laki-laki di bawah 2 tahun yang belum makan selain ASI adalah najis Mukhaffafah (ringan). Cara mensucikannya cukup dipercikkan air pada bagian yang terkena.",
      tingkatKesulitan: "Mudah",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Air yang suci dan dapat digunakan untuk mensucikan benda lain disebut air...",
      pilihan: [
        "A. Mutlak (Thahir Muthahhir)",
        "B. Musta'mal",
        "C. Mutanajjis",
        "D. Makruh (Musyammas)"
      ],
      jawabanBenar: "A",
      pembahasan: "Air mutlak adalah air murni yang suci dan mensucikan, seperti air hujan, air sumur, air sungai, air laut, salju, dan embun.",
      tingkatKesulitan: "Mudah",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Berikut ini yang merupakan rukun wudhu yang pertama adalah...",
      pilihan: [
        "A. Membasuh kedua telapak tangan",
        "B. Niat ketika membasuh wajah",
        "C. Berkumur-kumur tiga kali",
        "D. Menghirup air ke hidung (istinsyaq)"
      ],
      jawabanBenar: "B",
      pembahasan: "Rukun wudhu yang wajib adalah: (1) Niat saat membasuh wajah, (2) Membasuh wajah, (3) Membasuh kedua tangan sampai siku, (4) Mengusap sebagian kepala, (5) Membasuh kedua kaki sampai mata kaki, (6) Tertib.",
      tingkatKesulitan: "Mudah",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Seseorang yang berhadas besar disyariatkan bersuci dengan cara...",
      pilihan: [
        "A. Cukup berwudhu seperti hendak shalat",
        "B. Mandi wajib (janabah) meratakan air ke seluruh tubuh",
        "C. Mengganti seluruh pakaian yang dikenakan",
        "D. Mencuci muka dan tangan sebanyak tiga kali"
      ],
      jawabanBenar: "B",
      pembahasan: "Hadas besar (seperti mimpi basah atau haid) disucikan dengan mandi janabah (mandi wajib), yaitu membasahi seluruh permukaan kulit dan rambut disertai niat.",
      tingkatKesulitan: "Mudah",
      kategori: "Thaharah"
    }
  ],
  sedang: [
    {
      pertanyaan: "Bagaimanakah tata cara mensucikan benda yang terkena jilatan anjing sesuai hadits Rasulullah SAW?",
      pilihan: [
        "A. Cukup dicuci satu kali menggunakan sabun wangi",
        "B. Dicuci 7 kali dan salah satunya dicampur dengan tanah yang suci",
        "C. Diusap dengan kain basah hingga aromanya hilang",
        "D. Dijemur di bawah terik matahari hingga mengering sempurna"
      ],
      jawabanBenar: "B",
      pembahasan: "Jilatan anjing termasuk najis mughalladhah (berat). Berdasarkan sabda Nabi SAW, bejana yang dijilat anjing harus dibasuh 7 kali, salah satunya dicampur tanah suci.",
      tingkatKesulitan: "Sedang",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Dalam kondisi tidak menemukan air atau sakit yang dilarang dokter terkena air, seorang muslim diperbolehkan bertayamum menggunakan...",
      pilihan: [
        "A. Pasir basah yang diambil dari tepi sungai",
        "B. Debu atau tanah yang suci dan kering",
        "C. Tisu basah yang mengandung antiseptik",
        "D. Kain wol yang bersih dan harum"
      ],
      jawabanBenar: "B",
      pembahasan: "Tayamum dilakukan menggunakan shaidan thayyiban (debu/tanah yang suci dan kering) dengan mengusap wajah dan kedua tangan sampai siku.",
      tingkatKesulitan: "Sedang",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Ketika berwudhu, Ahmad lupa tidak membasuh kedua tangannya hingga siku, lalu langsung membasuh kaki. Bagaimana status wudhunya?",
      pilihan: [
        "A. Tetap sah karena niat dan membasuh wajah sudah terlaksana",
        "B. Tidak sah karena meninggalkan rukun wudhu dan melanggar rukun tertib",
        "C. Sah asalkan ditutup dengan sujud sahwi setelah shalat",
        "D. Cukup sah dengan membayar denda fidyah bersuci"
      ],
      jawabanBenar: "B",
      pembahasan: "Membasuh tangan hingga siku dan tertib (berurutan) adalah rukun wudhu. Jika ditinggalkan atau tidak berurutan, wudhu menjadi batal dan tidak sah.",
      tingkatKesulitan: "Sedang",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Darah luka dan nanah yang keluar dari tubuh seseorang ketika sedang shalat tergolong najis...",
      pilihan: [
        "A. Mughalladhah yang membatalkan shalat seketika",
        "B. Mutawassithah, namun jika jumlahnya sedikit maka tergolong najis Ma'fu (dimaafkan)",
        "C. Mukhaffafah yang cukup ditiup",
        "D. Mutlak yang memerlukan mandi wajib ulang"
      ],
      jawabanBenar: "B",
      pembahasan: "Darah dan nanah termasuk najis sedang (mutawassithah). Namun jika keluarnya hanya sedikit karena luka sendiri tanpa disengaja, tergolong najis ma'fu (dimaafkan).",
      tingkatKesulitan: "Sedang",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Berikut ini yang membatalkan wudhu seseorang adalah...",
      pilihan: [
        "A. Makan makanan yang hangat dan minum air teh",
        "B. Hilang akal karena tidur pulas dalam posisi tidak menetapkan pantat",
        "C. Berbicara santun kepada teman sesama jenis",
        "D. Mengeluarkan keringat setelah berolahraga lari"
      ],
      jawabanBenar: "B",
      pembahasan: "Hal yang membatalkan wudhu antara lain: keluar sesuatu dari kubul/dubur, tidur lelap yang tidak menetap duduknya, hilang akal (pingsan/mabuk), bersentuhan kulit laki-laki dan perempuan bukan mahram tanpa penghalang.",
      tingkatKesulitan: "Sedang",
      kategori: "Thaharah"
    }
  ],
  hots: [
    {
      pertanyaan: "Studi Kasus Fiqih: Seorang pendaki gunung terjebak badai salju di puncak. Suhu udara mencapai -5°C dan air yang ada membeku menjadi es padat. Jika ia memaksakan berwudhu dengan es, tangannya terancam radang dingin (frostbite) parah. Sikap fiqih yang paling tepat adalah...",
      pilihan: [
        "A. Tetap mencairkan es sedikit demi sedikit meski membahayakan keselamatan jiwa",
        "B. Mengambil rukhshah tayamum menggunakan debu pada dinding batu kering dan shalat tepat waktu",
        "C. Menunda seluruh shalat hingga turun gunung beberapa hari kemudian",
        "D. Shalat tanpa bersuci sama sekali dan tidak perlu mengulanginya"
      ],
      jawabanBenar: "B",
      pembahasan: "Agama Islam dibangun atas prinsip kemudahan (taysir) dan menjaga keselamatan jiwa (hifzhun nafs). Bahaya fisik parah akibat kedinginan membolehkan rukhshah bertayamum.",
      tingkatKesulitan: "HOTS",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Analisis Najis: Saat membersihkan kandang kambing di sekolah, pakaian Ridwan terkena kotoran kambing basah yang berbau menyengat. Berdasarkan kaidah fiqih madzhab Syafi'i, bagaimanakah status pakaian tersebut dan cara mensucikannya untuk shalat?",
      pilihan: [
        "A. Pakaian suci karena kotoran hewan halal dagingnya suci mutlak",
        "B. Terkena najis Mutawassithah 'Ainiyyah, wajib dibasuh air hingga hilang wujud fisik, warna, dan baunya",
        "C. Cukup disemprotkan parfum hingga bau kotoran kambing tersamarkan",
        "D. Pakaian harus dibakar karena sudah terkontaminasi najis"
      ],
      jawabanBenar: "B",
      pembahasan: "Dalam madzhab Syafi'i, semua kotoran hewan adalah najis mutawassithah. Karena memiliki wujud, warna, dan bau ('ainiyyah), wajib dicuci dengan air mengalir sampai ketiga sifat najis tersebut hilang.",
      tingkatKesulitan: "HOTS",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Evaluasi Ibadah: Salma sedang berwudhu di sekolah. Ketika membasuh muka, ia ragu apakah ia sudah berniat wudhu atau belum. Sementara ia sudah terlanjur membasuh kedua tangannya. Langkah perbaikan yang paling benar sesuai rukun adalah...",
      pilihan: [
        "A. Mengabaikan keraguan dan langsung melanjutkan membasuh kaki",
        "B. Mengulang wudhu dari awal dengan memasang niat saat membasuh wajah kembali",
        "C. Membayar fidyah kepada guru PAI",
        "D. Menunggu sampai shalat selesai lalu berniat di dalam hati"
      ],
      jawabanBenar: "B",
      pembahasan: "Niat adalah rukun utama wudhu yang harus berbarengan dengan basuhan wajah pertama. Jika ragu pada niat di tengah bersuci, wajib mengulang basuhan wajah disertai niat yang mantap dan tertib.",
      tingkatKesulitan: "HOTS",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Analisis Kritis: Banyak siswa menggunakan hand sanitizer berbasis alkohol sebelum makan. Bagaimana tinjauan hukum fiqih kontemporer mengenai kesucian cairan antiseptik tersebut dan keabsahan shalat sesudahnya?",
      pilihan: [
        "A. Haram dan najis berat sehingga membatalkan wudhu secara otomatis",
        "B. Alkohol medis/antiseptik bukan khamr konsumsi yang najis 'ain, sehingga cairan tersebut suci dan tidak membatalkan wudhu",
        "C. Wajib mandi janabah setelah menyentuh hand sanitizer",
        "D. Hanya boleh digunakan oleh dokter di rumah sakit"
      ],
      jawabanBenar: "B",
      pembahasan: "Fatwa MUI dan mayoritas ulama kontemporer menegaskan alkohol untuk keperluan medis/pembersih bukan najis 'ain (najis bendanya), berbeda dengan khamr minuman keras. Tangannya tetap suci.",
      tingkatKesulitan: "HOTS",
      kategori: "Thaharah"
    },
    {
      pertanyaan: "Dilema Lingkungan: Pada musim kemarau panjang, ketersediaan air bersih di madrasah sangat terbatas untuk minum para siswa. Menurut prioritas maqashid syariah dalam fiqih thaharah, tindakan yang wajib dipilih adalah...",
      pilihan: [
        "A. Mengutamakan air untuk wudhu dan membiarkan para siswa kehausan",
        "B. Mengalokasikan air untuk minum demi menjaga kelangsungan hidup (hifzhun nafs) dan bertayamum untuk shalat",
        "C. Membatalkan pelaksanaan shalat berjamaah secara permanen",
        "D. Membeli air minum kemasan khusus untuk dibasuhkan ke seluruh badan"
      ],
      jawabanBenar: "B",
      pembahasan: "Kaidah fiqih: 'Menolak mudharat didahulukan atas mengambil manfaat'. Menyelamatkan nyawa dari dehidrasi adalah kewajiban mutlak, dan syariat memberikan rukhshah tayamum sebagai gantinya.",
      tingkatKesulitan: "HOTS",
      kategori: "Thaharah"
    }
  ]
};

// 2. AKHLAK (AMANAH & JUJUR)
const akhlakBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Amanah secara etimologi (bahasa) berasal dari kata 'amana' yang bermakna...",
      pilihan: [
        "A. Aman, tenteram, dan dapat dipercaya",
        "B. Bekerja keras tanpa mengenal lelah",
        "C. Mengambil keputusan secara cepat",
        "D. Sopan santun kepada orang yang lebih tua"
      ],
      jawabanBenar: "A",
      pembahasan: "Amanah berarti terpercaya atau titipan yang wajib disampaikan. Seseorang yang amanah adalah pribadi yang dapat dipercaya memegang tanggung jawab.",
      tingkatKesulitan: "Mudah",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Nabi Muhammad SAW sejak masa muda sebelum kenabian telah diberi gelar 'Al-Amin' oleh penduduk Makkah karena...",
      pilihan: [
        "A. Berasal dari suku Quraisy yang paling kaya",
        "B. Sangat jujur dan terpercaya dalam ucapan maupun perdagangan",
        "C. Memiliki kekuatan fisik yang paling gagah",
        "D. Paling pandai membuat gubahan syair"
      ],
      jawabanBenar: "B",
      pembahasan: "Al-Amin bermakna 'Yang Terpercaya'. Gelar ini disematkan karena kejujuran, integritas, dan keluhuran budi pekerti beliau yang tiada tanding.",
      tingkatKesulitan: "Mudah",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Kesesuaian antara ucapan di lisan, keyakinan hati, dan tindakan nyata dinamakan sifat...",
      pilihan: [
        "A. Jujur (As-Siddiq)",
        "B. Istiqamah",
        "C. Qana'ah",
        "D. Tawadhu'"
      ],
      jawabanBenar: "A",
      pembahasan: "Jujur (as-siddiq) adalah kesesuaian antara perkataan dan perbuatan dengan kenyataan yang sebenarnya.",
      tingkatKesulitan: "Mudah",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Menjaga kesehatan anggota tubuh seperti mata, telinga, dan tangan dari perbuatan maksiat adalah wujud amanah terhadap...",
      pilihan: [
        "A. Diri sendiri",
        "B. Teman sebaya",
        "C. Guru di sekolah",
        "D. Lingkungan alam"
      ],
      jawabanBenar: "A",
      pembahasan: "Amanah meliputi 3 ranah: amanah kepada Allah (ibadah), amanah kepada sesama manusia (hak orang lain), dan amanah kepada diri sendiri (menjaga raga dan jiwa).",
      tingkatKesulitan: "Mudah",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Lawan dari sifat jujur (kizib) dan sifat amanah (khianat) termasuk ke dalam ciri-ciri orang...",
      pilihan: [
        "A. Munafik",
        "B. Muttaqin",
        "C. Mukhlisin",
        "D. Muhsinin"
      ],
      jawabanBenar: "A",
      pembahasan: "Tanda-tanda orang munafik ada tiga: jika berbicara berdusta, jika berjanji mengingkari, dan jika dipercaya berkhianat (HR. Bukhari dan Muslim).",
      tingkatKesulitan: "Mudah",
      kategori: "Akhlak"
    }
  ],
  sedang: [
    {
      pertanyaan: "Dalam hadits Rasulullah SAW disebutkan bahwa 'Kejujuran membimbing kepada kebaikan, dan kebaikan membimbing menuju...'",
      pilihan: [
        "A. Surga",
        "B. Ketenaran",
        "C. Kekayaan",
        "D. Jabatan tinggi"
      ],
      jawabanBenar: "A",
      pembahasan: "'Innas-shidqa yahdi ilal birri, wa innal birra yahdi ilal jannah' (HR. Bukhari & Muslim). Kejujuran adalah jalan utama menuju ketenteraman dan surga.",
      tingkatKesulitan: "Sedang",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Ketika dipercaya menjadi bendahara kelas yang mengelola uang kas, contoh tindakan amanah yang paling tepat adalah...",
      pilihan: [
        "A. Memakai uang kas untuk jajan pribadi lalu menggantinya bulan depan",
        "B. Mencatat penerimaan dan pengeluaran secara transparan serta melaporkannya kepada seluruh siswa",
        "C. Menyimpan uang kas di dompet tanpa pernah membuat catatan pembukuan",
        "D. Meminjamkan uang kas kepada teman dekat tanpa persetujuan ketua kelas"
      ],
      jawabanBenar: "B",
      pembahasan: "Amanah keuangan menuntut transparansi, pencatatan yang jujur, dan tidak menggunakan titipan untuk keperluan pribadi tanpa hak.",
      tingkatKesulitan: "Sedang",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Seorang siswa yang berjanji akan mengembalikan buku perpustakaan pada hari Senin, maka sikap yang mencerminkan amanah adalah...",
      pilihan: [
        "A. Mengembalikan buku tepat hari Senin sesuai janji yang telah diucapkan",
        "B. Menunggu hingga ditegur oleh petugas perpustakaan",
        "C. Meminjamkan kembali buku tersebut kepada orang lain",
        "D. Pura-pura lupa dengan tanggal pengembalian"
      ],
      jawabanBenar: "A",
      pembahasan: "Menepati janji adalah bagian integral dari sifat amanah. Menepati janji hukumnya wajib dan menjadi tanda kematangan integritas seorang mukmin.",
      tingkatKesulitan: "Sedang",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Berikut ini yang merupakan contoh penerapan sifat jujur dalam menuntut ilmu di sekolah adalah...",
      pilihan: [
        "A. Membuka catatan ringkasan secara diam-diam saat ujian berlangsung",
        "B. Mengerjakan soal asesmen formatif secara mandiri dengan kemampuan sendiri",
        "C. Menyalin tugas pekerjaan rumah (PR) milik teman di pagi hari sebelum bel masuk",
        "D. Meminta kunci jawaban kepada kakak kelas"
      ],
      jawabanBenar: "B",
      pembahasan: "Kejujuran akademik menuntut kemandirian dalam ujian. Nilai yang diperoleh secara jujur mendatangkan keberkahan ilmu dan ridha Allah SWT.",
      tingkatKesulitan: "Sedang",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Dampak buruk dari perilaku khianat dan dusta dalam kehidupan bermasyarakat adalah...",
      pilihan: [
        "A. Hilangnya kepercayaan orang lain dan merusak tali persaudaraan",
        "B. Meningkatnya jumlah teman akrab di lingkungan sekitar",
        "C. Mendapatkan pujian dari orang banyak",
        "D. Memudahkan tercapainya kesepakatan bisnis"
      ],
      jawabanBenar: "A",
      pembahasan: "Sekali seseorang berdusta atau berkhianat, kepercayaan orang lain akan sirna. Hal ini menimbulkan kecurigaan dan meruntuhkan kerukunan sosial.",
      tingkatKesulitan: "Sedang",
      kategori: "Akhlak"
    }
  ],
  hots: [
    {
      pertanyaan: "Studi Kasus Digital: Rafi menemukan ponsel canggih milik temannya yang tertinggal di laboratorium komputer dalam keadaan terbuka tanpa kata sandi. Di dalamnya terdapat data pribadi dan soal latihan ujian. Sikap yang mencerminkan integrasi iman, amanah, dan kejujuran adalah...",
      pilihan: [
        "A. Membuka isi chat pribadi teman tersebut lalu menertawakannya bersama kawan lain",
        "B. Mengamankan ponsel tersebut tanpa membuka privasi di dalamnya dan segera menyerahkannya ke ruang guru/pemiliknya",
        "C. Memfoto lembar soal ujian untuk dibagikan ke grup belajar pribadi",
        "D. Menyimpan ponsel tersebut dan menunggu sampai pemiliknya menawarkan hadiah imbalan"
      ],
      jawabanBenar: "B",
      pembahasan: "Menjaga privasi digital orang lain adalah bentuk amanah modern. Mukmin sejati menjaga pandangan dan kehormatan saudaranya serta mengembalikan barang temuan secara utuh.",
      tingkatKesulitan: "HOTS",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Dilema Integritas: Di kantin kejujuran sekolah, Fikri membeli makanan seharga Rp 7.000 dan membayar uang Rp 20.000. Saat mengambil kembalian dari kotak uang, ia mendapati ada kelebihan Rp 10.000 karena pembeli sebelumnya salah menaruh kembalian. Analisis tindakan yang paling berakhlak mulia adalah...",
      pilihan: [
        "A. Mengambil kelebihan uang tersebut dan menyedekahkannya ke kotak infak masjid",
        "B. Mengambil hak kembaliannya tepat Rp 13.000 dan merapikan sisa uang di kotak tanpa mengambil hak orang lain",
        "C. Mengambil kelebihan uang tersebut sebagai ganti rugi waktu belanja",
        "D. Membagikan kelebihan uang tersebut kepada teman sekelas untuk jajan bersama"
      ],
      jawabanBenar: "B",
      pembahasan: "Niat sedekah tidak membenarkan pengambilan harta yang bukan haknya. Amanah menuntut mengambil hanya haknya (Rp 13.000) dan membiarkan hak orang lain tetap pada tempatnya.",
      tingkatKesulitan: "HOTS",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Analisis Sosial Media: Sebuah informasi viral menyudutkan salah seorang guru di media sosial. Banyak siswa langsung membagikan (share) postingan tersebut tanpa memeriksa kebenarannya. Berdasarkan prinsip Al-Hujurat ayat 6 tentang tabayyun dan amanah lisan, sikap siswa yang tepat adalah...",
      pilihan: [
        "A. Ikut menyebarkan seluas-luasnya agar semakin banyak orang yang mengetahui",
        "B. Melakukan tabayyun (verifikasi kebenaran fakta) dan menahan diri dari menyebarkan aib atau fitnah yang belum terbukti",
        "C. Memberikan komentar pedas pada postingan tersebut menggunakan akun anonim",
        "D. Menyimpan rasa benci kepada guru tersebut tanpa klarifikasi"
      ],
      jawabanBenar: "B",
      pembahasan: "Surah Al-Hujurat ayat 6 mewajibkan tabayyun (klarifikasi fakta) saat menerima berita agar tidak menimpakan musibah dan penyesalan akibat fitnah.",
      tingkatKesulitan: "HOTS",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Evaluasi Kepemimpinan: Sebagai ketua panitia Pentas Seni Islam di sekolah, Dani menghadapi sisa anggaran kegiatan sebesar Rp 500.000 yang tidak diketahui oleh pihak sekolah. Anggota panitia mengusulkan agar uang tersebut dipakai makan bersama. Evaluasi keputusan Dani yang paling sejalan dengan nilai syariah adalah...",
      pilihan: [
        "A. Menyetujui usulan anggota demi menjaga kebersamaan dan kekompakan tim",
        "B. Menolak usulan tersebut dan melaporkan sisa saldo secara resmi kepada pihak pembina sekolah dalam Laporan Pertanggungjawaban (LPJ)",
        "C. Menyimpan uang tersebut untuk keperluan pribadi ketua panitia",
        "D. Membagi rata uang tersebut secara rahasia kepada seluruh panitia"
      ],
      jawabanBenar: "B",
      pembahasan: "Dana amanah organisasi milik lembaga sekolah. Menggunakannya tanpa izin pengelola resmi tergolong ghulul (penggelapan dana) yang diharamkan syariat.",
      tingkatKesulitan: "HOTS",
      kategori: "Akhlak"
    },
    {
      pertanyaan: "Analisis Kritis: Seseorang berdalih melakukan kebohongan kecil (white lie) saat ditanya oleh orang tuanya mengenai uang SPP yang terpakai untuk main game. Mengapa dalam ajaran Islam kebohongan kecil semacam ini tetap terlarang dan berbahaya bagi perkembangan jiwa?",
      pilihan: [
        "A. Karena kebohongan kecil akan melatih hati menjadi terbiasa berdusta hingga meremehkan dosa besar",
        "B. Karena orang tua pasti memiliki firasat gaib yang mengetahui segalanya",
        "C. Karena permainan game selalu membawa kesialan dalam belajar",
        "D. Karena hanya polisi yang berhak meminta keterangan keuangan"
      ],
      jawabanBenar: "A",
      pembahasan: "Rasulullah SAW memperingatkan bahwa dusta kecil merintis kebiasaan buruk hingga seseorang dicatat di sisi Allah sebagai pendusta (kazzab). Kejujuran membawa keselamatan sejati.",
      tingkatKesulitan: "HOTS",
      kategori: "Akhlak"
    }
  ]
};

// 3. SEJARAH PERADABAN ISLAM (DAULAH UMAYYAH & ABBASIYAH)
const sejarahBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Daulah Umayyah resmi berdiri pada tahun 661 Masehi (41 Hijriah) dengan pusat ibu kota pemerintahan di...",
      pilihan: [
        "A. Damaskus (Syam)",
        "B. Madinah Al-Munawwarah",
        "C. Baghdad (Irak)",
        "D. Kairo (Mesir)"
      ],
      jawabanBenar: "A",
      pembahasan: "Setelah peristiwa 'Amul Jama'ah, Muawiyah bin Abu Sufyan memindahkan pusat pemerintahan Daulah Umayyah dari Madinah ke Damaskus (Suriah saat ini).",
      tingkatKesulitan: "Mudah",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Pendiri sekaligus Khalifah pertama dari Daulah Umayyah adalah...",
      pilihan: [
        "A. Muawiyah bin Abu Sufyan",
        "B. Umar bin Abdul Aziz",
        "C. Abdul Malik bin Marwan",
        "D. Al-Walid bin Abdul Malik"
      ],
      jawabanBenar: "A",
      pembahasan: "Muawiyah bin Abu Sufyan merupakan pendiri Daulah Umayyah yang memerintah selama kurang lebih 20 tahun dan merintis berbagai kemajuan birokrasi Islam.",
      tingkatKesulitan: "Mudah",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Khalifah Daulah Umayyah yang sangat termasyhur karena keadilan, kesederhanaan, dan kesalehannya hingga dijuluki Khulafaur Rasyidin ke-5 adalah...",
      pilihan: [
        "A. Umar bin Abdul Aziz",
        "B. Yazid bin Muawiyah",
        "C. Marwan bin Al-Hakam",
        "D. Sulaiman bin Abdul Malik"
      ],
      jawabanBenar: "A",
      pembahasan: "Khalifah Umar bin Abdul Aziz memimpin dengan keadilan mutlak, memberantas korupsi pejabat, dan mengembalikan hak rakyat hingga masyarakat makmur sentosa.",
      tingkatKesulitan: "Mudah",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Karya monumental arsitektur Islam berupa masjid megah dengan tiang marmer dan mozaik indah di Damaskus dibangun pada masa Khalifah...",
      pilihan: [
        "A. Al-Walid bin Abdul Malik",
        "B. Muawiyah bin Abu Sufyan",
        "C. Hisyam bin Abdul Malik",
        "D. Yazid bin Abdul Malik"
      ],
      jawabanBenar: "A",
      pembahasan: "Masjid Agung Damaskus (Masjid Al-Umayyah) dibangun pada masa pemerintahan Khalifah Al-Walid I yang memajukan seni arsitektur dan perlindungan kaum dhuafa.",
      tingkatKesulitan: "Mudah",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Pusat Daulah Umayyah fase kedua yang berhasil dibangun dan berkembang pesat di daratan Benua Eropa beribu kota di...",
      pilihan: [
        "A. Kordoba (Andalusia / Spanyol)",
        "B. Roma (Italia)",
        "C. London (Inggris)",
        "D. Paris (Prancis)"
      ],
      jawabanBenar: "A",
      pembahasan: "Abdurrahman Ad-Dakhil mendirikan keemasan Daulah Umayyah di Andalusia (Spanyol) yang berpusat di Kordoba dan menjadi pusat peradaban ilmu pengetahuan di Eropa.",
      tingkatKesulitan: "Mudah",
      kategori: "Sejarah"
    }
  ],
  sedang: [
    {
      pertanyaan: "Salah satu kebijakan penting Khalifah Abdul Malik bin Marwan dalam memperkuat kedaulatan dan integrasi wilayah kekhalifahan Islam adalah...",
      pilihan: [
        "A. Menetapkan Bahasa Arab sebagai bahasa resmi administrasi negara (Arabisasi) dan mencetak mata uang dinar Islam",
        "B. Menghapus seluruh kegiatan perdagangan antar pulau",
        "C. Menyerahkan kekuasaan militer kepada bangsa Romawi",
        "D. Menolak pembangunan rumah sakit dan panti sosial"
      ],
      jawabanBenar: "A",
      pembahasan: "Khalifah Abdul Malik bin Marwan menetapkan Bahasa Arab sebagai bahasa administrasi resmi negara serta menerbitkan mata uang Islam mandiri berkaligrafi tauhid.",
      tingkatKesulitan: "Sedang",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Panglima militer Islam yang memimpin penyeberangan pasukan dari Afrika Utara melintasi selat menuju Andalusia (Spanyol) pada masa Daulah Umayyah adalah...",
      pilihan: [
        "A. Thariq bin Ziyad",
        "B. Khalid bin Walid",
        "C. Shalahuddin Al-Ayyubi",
        "D. Sa'ad bin Abi Waqqas"
      ],
      jawabanBenar: "A",
      pembahasan: "Thariq bin Ziyad memimpin pasukan Islam menyeberangi selat yang kemudian dinamakan Jabal Thariq (Gibraltar) dan membuka pintu peradaban Islam di Eropa.",
      tingkatKesulitan: "Sedang",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Lembaga administrasi pos dan kurir kilat yang dikembangkan pada masa Daulah Umayyah untuk mempercepat pengiriman surat dinas khalifah dikenal dengan sebutan...",
      pilihan: [
        "A. Diwanul Barid",
        "B. Diwanul Jund",
        "C. Diwanul Kharaj",
        "D. Diwanul Khatam"
      ],
      jawabanBenar: "A",
      pembahasan: "Diwanul Barid adalah jawatan pos terpadu dengan stasiun kuda kilat yang menghubungkan pusat khalifah di Damaskus dengan seluruh provinsi.",
      tingkatKesulitan: "Sedang",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Pada masa pemerintahan Khalifah Umar bin Abdul Aziz, baitul mal mengalami surplus luar biasa sehingga petugas kesulitan menemukan...",
      pilihan: [
        "A. Orang miskin yang berhak menerima zakat (mustahiq)",
        "B. Pasukan perang untuk bertempur",
        "C. Pedagang yang mau menjual barang",
        "D. Arsitek untuk membangun istana"
      ],
      jawabanBenar: "A",
      pembahasan: "Pemerataan ekonomi dan keadilan zakat pada masa Umar bin Abdul Aziz begitu berhasil sehingga seluruh rakyat hidup berkecukupan dan mustahiq zakat tidak lagi ditemukan.",
      tingkatKesulitan: "Sedang",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Perbedaan mendasar peralihan sistem suksesi kepemimpinan dari masa Khulafaur Rasyidin ke masa Daulah Umayyah terletak pada...",
      pilihan: [
        "A. Pergantian sistem musyawarah mufakat (syura) menjadi sistem monarki turun-temurun (dinasti)",
        "B. Pemindahan ibukota ke Kutub Utara",
        "C. Penghentian pelaksanaan ibadah shalat jumat",
        "D. Pembatasan penggunaan Al-Qur'an sebagai pedoman hukum"
      ],
      jawabanBenar: "A",
      pembahasan: "Khulafaur Rasyidin dipilih melalui musyawarah umat (syura), sedangkan Daulah Umayyah menerapkan sistem monarki herediter (kerajaan dinasti turun-temurun).",
      tingkatKesulitan: "Sedang",
      kategori: "Sejarah"
    }
  ],
  hots: [
    {
      pertanyaan: "Analisis Sejarah: Kemajuan sains dan filsafat di Kordoba pada masa Daulah Umayyah di Andalusia menginspirasi kebangkitan Renaisans di Eropa Barat. Faktor apakah yang menjadi kunci utama keterbukaan intelektual ilmuwan muslim masa itu?",
      pilihan: [
        "A. Semangat literasi tinggi, penerjemahan karya ilmiah multi-bahasa, dan penghargaan khalifah terhadap para ilmuwan tanpa membedakan latar belakang",
        "B. Pelarangan warga lokal untuk membaca buku ilmiah",
        "C. Pembakaran perpustakaan kuno Yunani dan Romawi",
        "D. Penutupan akses bagi mahasiswa asing untuk belajar di universitas Kordoba"
      ],
      jawabanBenar: "A",
      pembahasan: "Universitas dan perpustakaan di Kordoba mengoleksi ratusan ribu buku. Sikap toleran dan gairah riset ilmuwan muslim membuka cakrawala ilmu pengetahuan bagi seluruh dunia.",
      tingkatKesulitan: "HOTS",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Evaluasi Kepemimpinan: Ketika dinobatkan sebagai Khalifah, Umar bin Abdul Aziz segera menjual kuda-kuda dinas istana yang mewah dan menyerahkan hasilnya ke kas Baitul Mal, serta hidup sederhana bersama keluarganya. Nilai kepemimpinan apa yang paling relevan untuk diteladani pejabat negara masa kini?",
      pilihan: [
        "A. Hidup bermewah-mewah demi menunjukkan wibawa seorang pemimpin",
        "B. Integritas anti-korupsi, kesederhanaan moral, dan pengutamaan kepentingan kesejahteraan rakyat di atas kepentingan pribadi",
        "C. Menolak menerima tamu rakyat biasa di kantor dinas",
        "D. Membangun istana megah dengan anggaran negara"
      ],
      jawabanBenar: "B",
      pembahasan: "Keteladanan Umar bin Abdul Aziz membuktikan bahwa kewibawaan sejati seorang pemimpin lahir dari keadilan, ketaqwaan, dan keengganannya menggunakan fasilitas negara untuk kepentingan pribadi.",
      tingkatKesulitan: "HOTS",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Refleksi Kritis: Daulah Umayyah mencapai wilayah kekuasaan yang sangat luas membentang dari perbatasan Tiongkok hingga Spanyol. Namun di akhir periodenya, dinasti ini mengalami keruntuhan. Faktor internal utama penyebab kemunduran tersebut adalah...",
      pilihan: [
        "A. Konflik perebutan kekuasaan antar pangeran istana, gaya hidup mewah sebagian khalifah, dan diskriminasi terhadap kaum Mawali",
        "B. Serangan gempa bumi dahsyat di seluruh jazirah Arab",
        "C. Kehabisan pasokan gandum dan kurma dari Yaman",
        "D. Penolakan rakyat untuk menggunakan mata uang dinar"
      ],
      jawabanBenar: "A",
      pembahasan: "Faktor keruntuhan internal Daulah Umayyah: perebutan takhta sesama keluarga dinasti, kemunduran moral akibat hidup mewah, serta perlakuan tidak adil terhadap kaum Mawali (muslim non-Arab).",
      tingkatKesulitan: "HOTS",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Sintesis Peradaban: Pembangunan kubah masjid Dome of the Rock (Qubbah As-Sakhrah) di Yerusalem oleh Khalifah Abdul Malik bin Marwan memadukan teknik arsitektur Bizantium dengan seni kaligrafi Arab Islam. Hal ini mencerminkan karakter peradaban Islam yang...",
      pilihan: [
        "A. Menolak seluruh kemajuan bangsa lain tanpa kompromi",
        "B. Adaptif, inklusif, dan mampu mengislamisasi teknologi estetika menjadi karya berlandaskan tauhid yang agung",
        "C. Sekadar meniru tanpa memiliki identitas keislaman",
        "D. Bersifat tertutup bagi perkembangan seni rupa dunia"
      ],
      jawabanBenar: "B",
      pembahasan: "Peradaban Islam memiliki sifat universal dan dinamis; menyerap kebaikan arsitektur lokal lalu menyempurnakannya dengan muatan tauhid dan nilai estetika kaligrafi Al-Qur'an.",
      tingkatKesulitan: "HOTS",
      kategori: "Sejarah"
    },
    {
      pertanyaan: "Relevansi Pendidikan: Rumah sakit gratis (Bimaristan) dan panti penampungan orang kusta pertama didirikan oleh Khalifah Al-Walid I dengan dokter digaji oleh kas negara. Kebijakan sosial ini membuktikan bahwa ajaran Islam...",
      pilihan: [
        "A. Hanya fokus pada ritual peribadatan shalat dan puasa semata",
        "B. Sangat menjunjung tinggi nilai kemanusiaan, sains kedokteran, dan jaminan sosial bagi masyarakat lemah (dhuafa)",
        "C. Melarang pengobatan medis dan hanya menganjurkan doa pasrah",
        "D. Membatasi pengobatan hanya untuk keluarga istana kerajaan"
      ],
      jawabanBenar: "B",
      pembahasan: "Kekhalifahan Islam mempelopori sistem jaminan kesehatan publik universal. Ini bukti nyata bahwa ajaran Islam adalah rahmatan lil 'alamin yang peduli pada kemaslahatan fisik dan sosial umat.",
      tingkatKesulitan: "HOTS",
      kategori: "Sejarah"
    }
  ]
};

// 4. SHALAT & SUJUD (FIQIH IBADAH)
const shalatBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Hukum melaksanakan Shalat Fardhu secara berjamaah bagi laki-laki menurut jumhur ulama adalah...",
      pilihan: [
        "A. Sunnah Muakkad (sangat dianjurkan)",
        "B. Mubah (bebas memilih)",
        "C. Makruh dikerjakan",
        "D. Haram ditinggalkan"
      ],
      jawabanBenar: "A",
      pembahasan: "Shalat berjamaah pahalanya 27 derajat lebih tinggi dibanding shalat sendirian (munfarid). Hukumnya Sunnah Muakkad, bahkan sebagian ulama menyatakannya fardhu kifayah.",
      tingkatKesulitan: "Mudah",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Berikut ini yang merupakan syarat utama menjadi Imam dalam shalat berjamaah adalah...",
      pilihan: [
        "A. Fasih dan tartil bacaan Al-Qur'an serta memahami fiqih shalat",
        "B. Memiliki rumah paling dekat dengan masjid",
        "C. Mengenakan pakaian serba putih paling mahal",
        "D. Paling kaya di lingkungan jamaah"
      ],
      jawabanBenar: "A",
      pembahasan: "Sesuai hadits Rasulullah SAW, yang berhak menjadi imam adalah yang paling aqra' (paling baik dan fasih bacaan Al-Qur'an) serta paham sunnah/hukum shalat.",
      tingkatKesulitan: "Mudah",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Sujud yang dilakukan karena seseorang lupa atau ragu terhadap jumlah rakaat shalat dinamakan sujud...",
      pilihan: [
        "A. Sahwi",
        "B. Tilawah",
        "C. Syukur",
        "D. Qashar"
      ],
      jawabanBenar: "A",
      pembahasan: "Sujud Sahwi dilakukan sebanyak dua kali sujud sebelum atau sesudah salam untuk menambal kekurangan/keraguan dalam rakaat atau rukun tertentu saat shalat.",
      tingkatKesulitan: "Mudah",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Ketika mendengar atau membaca ayat-ayat Sajdah dalam Al-Qur'an, umat Islam disunnahkan melaksanakan sujud...",
      pilihan: [
        "A. Tilawah",
        "B. Sahwi",
        "C. Syukur",
        "D. Hajat"
      ],
      jawabanBenar: "A",
      pembahasan: "Sujud Tilawah disunnahkan saat membaca atau mendengar lantunan ayat sajdah (terdapat 15 ayat dalam mushaf Al-Qur'an ditandai simbol kubah).",
      tingkatKesulitan: "Mudah",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Meringkas shalat yang semula 4 rakaat (Dzuhur, Ashar, Isya) menjadi 2 rakaat bagi musafir disebut...",
      pilihan: [
        "A. Qashar",
        "B. Jamak Taqdim",
        "C. Jamak Ta'khir",
        "D. Istisqa"
      ],
      jawabanBenar: "A",
      pembahasan: "Qashar artinya memendekkan atau meringkas jumlah rakaat shalat 4 rakaat menjadi 2 rakaat karena rukhshah perjalanan jauh (safar).",
      tingkatKesulitan: "Mudah",
      kategori: "Shalat"
    }
  ],
  sedang: [
    {
      pertanyaan: "Makmum yang terlambat datang saat imam sudah memulai shalat dan tidak sempat membaca Al-Fatihah secara sempurna dinamakan makmum...",
      pilihan: [
        "A. Masbuq",
        "B. Muwafiq",
        "C. Munfarid",
        "D. Musafir"
      ],
      jawabanBenar: "A",
      pembahasan: "Makmum masbuq adalah makmum yang tertinggal dari takbiratul ihram imam atau sebagian rakaat shalat imam.",
      tingkatKesulitan: "Sedang",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Apabila seorang makmum masbuq datang saat imam sedang ruku' dan makmum sempat ruku' thuma'ninah bersama imam sebelum bangkit, maka makmum tersebut...",
      pilihan: [
        "A. Terhitung mendapatkan rakaat tersebut secara sempurna",
        "B. Harus mengulang rakaat tersebut dari awal setelah imam salam",
        "C. Shalatnya batal karena tidak membaca Al-Fatihah",
        "D. Wajib melakukan sujud sahwi sendiri"
      ],
      jawabanBenar: "A",
      pembahasan: "Barangsiapa mendapati ruku' bersama imam dengan thuma'ninah, maka ia terhitung mendapatkan satu rakaat tersebut karena bacaan Fatihahnya ditanggung imam.",
      tingkatKesulitan: "Sedang",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Berikut ini shalat fardhu yang BOLEH dijamak dan diqashar saat melakukan safar memenuhi syarat adalah...",
      pilihan: [
        "A. Shalat Dzuhur dengan Ashar, serta Maghrib dengan Isya",
        "B. Shalat Subuh dengan Shalat Dzuhur",
        "C. Shalat Ashar dengan Shalat Maghrib",
        "D. Shalat Isya dengan Shalat Subuh"
      ],
      jawabanBenar: "A",
      pembahasan: "Shalat yang boleh dijamak hanya pasangan Dzuhur-Ashar dan Maghrib-Isya. Shalat Subuh tidak boleh dijamak maupun diqashar.",
      tingkatKesulitan: "Sedang",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Ketika imam pria melakukan kesalahan gerakan atau bacaan dalam shalat berjamaah, cara makmum mengingatkannya adalah...",
      pilihan: [
        "A. Mengucapkan tasbih 'Subhanallah' bagi makmum pria, dan menepuk tangan (tashfiq) bagi wanita",
        "B. Berteriak menyebutkan kesalahan imam dengan suara keras",
        "C. Langsung maju ke depan menggantikan posisi imam",
        "D. Membatalkan shalat secara serentak"
      ],
      jawabanBenar: "A",
      pembahasan: "Sunnah mengingatkan imam: makmum laki-laki membaca tasbih 'Subhanallah', sedangkan makmum perempuan menepukkan punggung tangan kanan ke telapak tangan kiri.",
      tingkatKesulitan: "Sedang",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Sujud syukur dilakukan seseorang tanpa perlu berwudhu terlebih dahulu menurut pendapat rajih ketika...",
      pilihan: [
        "A. Mendapatkan kenikmatan besar yang tak terduga atau terhindar dari musibah marabahaya",
        "B. Sedang tertinggal rakaat shalat fardhu",
        "C. Mengantuk saat mendengarkan khutbah Jumat",
        "D. Lupa membaca doa iftitah"
      ],
      jawabanBenar: "A",
      pembahasan: "Sujud syukur dilakukan sebagai ekspresi terima kasih kepada Allah saat menerima anugerah besar yang membahagiakan atau selamat dari malapetaka.",
      tingkatKesulitan: "Sedang",
      kategori: "Shalat"
    }
  ],
  hots: [
    {
      pertanyaan: "Studi Kasus Fiqih Masbuq: Faris tiba di masjid saat imam sedang tasyahud akhir shalat Isya. Faris bertakbiratul ihram lalu langsung duduk tasyahud bersama imam. Setelah imam salam dua kali, berapa rakaatkah yang wajib dikerjakan Faris untuk menyempurnakan shalatnya?",
      pilihan: [
        "A. Menyelesaikan 4 rakaat penuh karena belum mendapati ruku' di rakaat manapun",
        "B. Cukup mengerjakan 1 rakaat saja karena sudah ikut tasyahud akhir",
        "C. Cukup mengerjakan 2 rakaat qashar",
        "D. Shalatnya tidak sah dan harus wudhu kembali"
      ],
      jawabanBenar: "A",
      pembahasan: "Karena Faris baru bergabung saat tasyahud akhir (setelah ruku' terakhir), ia mendapatkan keutamaan jamaah tetapi belum mendapatkan satu rakaat pun. Wajib berdiri menyempurnakan 4 rakaat.",
      tingkatKesulitan: "HOTS",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Analisis Safar: Sebuah rombongan study tour SMP berangkat dari Rebang Tangkas menuju Jakarta (jarak > 300 km) pada pukul 10.00 pagi. Mereka tiba di rest area pada pukul 12.30 siang dan berencana melanjutkan perjalanan hingga malam. Pilihan shalat yang paling afdhal dan tepat sesuai sunnah adalah...",
      pilihan: [
        "A. Shalat Dzuhur dan Ashar dijamak taqdim serta diqashar (masing-masing 2 rakaat) pada waktu Dzuhur di rest area",
        "B. Menolak shalat dan mengqadhanya keesokan harinya",
        "C. Mengerjakan shalat Dzuhur 4 rakaat dan shalat Subuh 2 rakaat sekaligus",
        "D. Menunggu sampai tiba di hotel pada pukul 23.00 malam baru shalat Dzuhur"
      ],
      jawabanBenar: "A",
      pembahasan: "Musafir yang menempuh jarak safar (>82 km) berhak mengambil rukhshah jamak taqdim dan qashar (Dzuhur 2 rakaat diikuti Ashar 2 rakaat) demi kemudahan dan keselamatan perjalanan.",
      tingkatKesulitan: "HOTS",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Dilema Ragu Rakaat: Saat shalat Maghrib sendirian, pada saat duduk tasyahud, Danu bimbang apakah ia baru menyelesaikan rakaat kedua atau sudah rakaat ketiga. Berdasarkan kaidah fiqih 'Al-Yaqinu la yuzalu bisy-syak' (keyakinan tidak gugur oleh keraguan), tindakan Danu adalah...",
      pilihan: [
        "A. Menetapkan jumlah yang paling sedikit (rakaat kedua), bangkit menambah 1 rakaat lagi, lalu sujud sahwi sebelum salam",
        "B. Memilih rakaat ketiga yang terbanyak agar shalat cepat selesai",
        "C. Membatalkan shalat seketika dan mengulang wudhu",
        "D. Bertanya kepada orang di sekitarnya tanpa membatalkan shalat"
      ],
      jawabanBenar: "A",
      pembahasan: "Sabda Nabi SAW: 'Jika salah seorang kalian ragu dalam shalatnya... hendaklah ia membuang keraguan dan menetapkan di atas apa yang diyakininya (bilangan terkecil), lalu sujud dua kali sebelum salam.'",
      tingkatKesulitan: "HOTS",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Evaluasi Ibadah Sosial: Di sekolah, seorang siswa melihat temannya pingsan dan kejang-kejang tepat di sampingnya saat shalat berjamaah sedang berlangsung di rakaat kedua. Analisis tindakan fiqih yang paling benar adalah...",
      pilihan: [
        "A. Membatalkan shalatnya seketika untuk segera menolong dan menyelamatkan nyawa temannya",
        "B. Melanjutkan shalat dengan tenang sampai salam dan mengabaikan temannya yang pingsan",
        "C. Menendang temannya agar menjauh dari shaf shalat",
        "D. Menyuruh imam shalat membaca surat paling pendek"
      ],
      jawabanBenar: "A",
      pembahasan: "Menyelamatkan nyawa manusia (hifzhun nafs) hukumnya fardhu 'ain darurat yang mendahului kelanjutan shalat sunnah maupun fardhu. Shalat dapat diulang kembali setelah pertolongan diberikan.",
      tingkatKesulitan: "HOTS",
      kategori: "Shalat"
    },
    {
      pertanyaan: "Kritisi Kebiasaan: Sebagian orang terbiasa shalat dengan terburu-buru seperti ayam mematuk makanan tanpa thuma'ninah. Mengapa thuma'ninah ditetapkan sebagai rukun shalat oleh para ulama mazhab?",
      pilihan: [
        "A. Karena thuma'ninah (berhenti sejenak sekadar bacaan tasbih) menjamin ketenangan ruhani dan menjadi syarat sah sahnya ruku' serta sujud",
        "B. Karena thuma'ninah hanya pelengkap agar shalat terlihat lebih lama",
        "C. Agar jamaah tidak cepat pulang ke rumah",
        "D. Supaya imam mendapat sanjungan suara merdu"
      ],
      jawabanBenar: "A",
      pembahasan: "Hadits tentang orang yang buruk shalatnya (al-musi'u shalatahu): Nabi memerintahkannya mengulang shalat 3 kali karena meninggalkan thuma'ninah. Tanpa thuma'ninah, shalat tidak sah.",
      tingkatKesulitan: "HOTS",
      kategori: "Shalat"
    }
  ]
};

// 5. AL-QUR'AN & TAJWID
const alquranBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Hukum bacaan tajwid apabila Nun Sukun (نْ) atau Tanwin bertemu dengan huruf Ba (ب) adalah...",
      pilihan: [
        "A. Iqlab",
        "B. Idgham Bighunnah",
        "C. Izhar Halqi",
        "D. Ikhfa Haqiqi"
      ],
      jawabanBenar: "A",
      pembahasan: "Iqlab terjadi jika nun mati/tanwin bertemu huruf Ba. Suara nun/tanwin diganti menjadi huruf Mim sukun disertai dengung (ghunnah).",
      tingkatKesulitan: "Mudah",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Huruf-huruf Izhar Halqi yang dibaca jelas tanpa mendengung berjumlah 6 huruf, yaitu...",
      pilihan: [
        "A. Hamzah (ء), Ha (هـ), 'Ain (ع), Ha (ح), Ghain (غ), Kha (خ)",
        "B. Ya (ي), Nun (ن), Mim (م), Wawu (و)",
        "C. Lam (ل) dan Ra (ر)",
        "D. Ba (ب), Jim (ج), Dal (د), Tha (ط), Qaf (ق)"
      ],
      jawabanBenar: "A",
      pembahasan: "Enam huruf halqi (tenggorokan) adalah hamzah, ha, 'ain, ha, ghain, kha. Cara membacanya wajib izhar (jelas dan terang).",
      tingkatKesulitan: "Mudah",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Kandungan utama Surah Ad-Duha mengajarkan kepada umat Islam agar...",
      pilihan: [
        "A. Senantiasa bersyukur atas anugerah Allah serta tidak bertindak sewenang-wenang terhadap anak yatim dan peminta-minta",
        "B. Melakukan peperangan menaklukkan wilayah baru",
        "C. Menghindari makanan hasil laut",
        "D. Menyimpan harta sebanyak-banyaknya di bank"
      ],
      jawabanBenar: "A",
      pembahasan: "Surah Ad-Duha mengingatkan kasih sayang Allah kepada Nabi SAW, melarang menindas anak yatim, melarang menghardik peminta-minta, dan memerintahkan mensyukuri nikmat.",
      tingkatKesulitan: "Mudah",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Hukum bacaan Alif Lam (ال) yang dibaca jelas karena bertemu huruf qamariyah disebut...",
      pilihan: [
        "A. Alif Lam Qamariyah (Izhar Qamariyah)",
        "B. Alif Lam Syamsiyah (Idgham Syamsiyah)",
        "C. Mad Thabi'i",
        "D. Qalqalah Kubra"
      ],
      jawabanBenar: "A",
      pembahasan: "Alif Lam Qamariyah dibaca terang bunyinya (al-) seperti pada kata Al-Qamaru, Al-Kitabu. Hurufnya terangkum dalam: ibghi hajjaka wa khaf 'aqimah.",
      tingkatKesulitan: "Mudah",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Huruf Qalqalah (memantul) berjumlah lima huruf yang disingkat dengan ungkapan...",
      pilihan: [
        "A. Baju Di Toko (ب - ج - د - ط - ق)",
        "B. Yanmu (ي - ن - م - و)",
        "C. Rala (ر - ل)",
        "D. Ahad (ء - هـ - د)"
      ],
      jawabanBenar: "A",
      pembahasan: "Huruf qalqalah ada 5: Qaf, Tha, Ba, Jim, Dal (qathbu jadin / baju di toko). Dibaca memantul saat berharakat sukun atau waqaf.",
      tingkatKesulitan: "Mudah",
      kategori: "Al-Qur'an"
    }
  ],
  sedang: [
    {
      pertanyaan: "Pada potongan ayat 'مِنْ وَرَائِهِمْ' terdapat hukum bacaan tajwid yaitu...",
      pilihan: [
        "A. Idgham Bighunnah, karena Nun Sukun bertemu huruf Wawu",
        "B. Idgham Bilaghunnah",
        "C. Ikhfa Syafawi",
        "D. Izhar Halqi"
      ],
      jawabanBenar: "A",
      pembahasan: "Nun sukun bertemu huruf Wawu (salah satu huruf Yanmu) dibaca Idgham Bighunnah (memasukkan suara nun ke wawu disertai dengung 2 harakat).",
      tingkatKesulitan: "Sedang",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Surah Al-Mujadilah ayat 11 menegaskan bahwa Allah SWT akan meninggikan derajat orang-orang yang...",
      pilihan: [
        "A. Beriman di antara kalian dan orang-orang yang diberi ilmu pengetahuan beberapa derajat",
        "B. Memiliki kekayaan paling melimpah ruah",
        "C. Memiliki keturunan bangsawan dan tampang rupawan",
        "D. Sering bepergian ke luar negeri"
      ],
      jawabanBenar: "A",
      pembahasan: "'Yarfa'illahulladzina amanu minkum walladzina utul 'ilma darajat' (QS. Al-Mujadilah: 11). Kemuliaan hakiki didasarkan pada perpaduan iman dan ilmu pengetahuan.",
      tingkatKesulitan: "Sedang",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Hukum bacaan Mim Sukun (مْ) bertemu huruf Ba (ب) dinamakan...",
      pilihan: [
        "A. Ikhfa Syafawi",
        "B. Izhar Syafawi",
        "C. Idgham Mutamatsilain",
        "D. Iqlab"
      ],
      jawabanBenar: "A",
      pembahasan: "Mim sukun bertemu Ba dibaca Ikhfa Syafawi (samar-samar di bibir disertai dengung). Contoh: tarmihim bihijarah.",
      tingkatKesulitan: "Sedang",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Perbedaan antara Idgham Bighunnah dan Idgham Bilaghunnah terletak pada...",
      pilihan: [
        "A. Idgham Bighunnah dibaca dengan dengung (huruf: Ya, Nun, Mim, Wawu), sedangkan Bilaghunnah tanpa dengung (huruf: Lam, Ra)",
        "B. Bilaghunnah harus dibaca panjang 6 harakat",
        "C. Bighunnah hanya berlaku di akhir juz 30",
        "D. Keduanya memiliki cara baca dan huruf yang persis sama"
      ],
      jawabanBenar: "A",
      pembahasan: "Bighunnah artinya memakai dengung (ghunnah 2 ketukan). Bilaghunnah artinya tanpa dengung, suara nun/tanwin langsung lebur ke huruf Lam atau Ra.",
      tingkatKesulitan: "Sedang",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Kandungan Surah Al-Hujurat ayat 13 mengajarkan prinsip keragaman manusia diciptakan berbangsa-bangsa dan bersuku-suku dengan tujuan untuk...",
      pilihan: [
        "A. Saling mengenal (lita'arafu) dan berkolaborasi dalam kebajikan",
        "B. Saling menyombongkan keunggulan suku masing-masing",
        "C. Memisahkan diri dari pergaulan dunia luar",
        "D. Berperang memperebutkan wilayah kekuasaan"
      ],
      jawabanBenar: "A",
      pembahasan: "'Waja'alnakum syu'uban waqaba-ila lita'arafu'. Keragaman suku bangsa adalah sunnatullah agar manusia saling mengenal, toleran, dan berlomba dalam ketaqwaan.",
      tingkatKesulitan: "Sedang",
      kategori: "Al-Qur'an"
    }
  ],
  hots: [
    {
      pertanyaan: "Analisis Tajwid Khusus: Dalam kalimat 'الدُّنْيَا' (Ad-Dunya) dan 'بُنْيَانٌ' (Bunyanun), terdapat Nun Sukun bertemu huruf Ya dalam satu kata tunggal. Mengapa hukum bacaannya TIDAK dibaca Idgham Bighunnah melainkan Izhar Wajib (Izhar Mutlaq)?",
      pilihan: [
        "A. Karena jika diidghamkan akan mengubah makna kata dan mengaburkan bentuk kata aslinya",
        "B. Karena huruf Ya dalam kalimat tersebut berharakat kasrah",
        "C. Karena kata tersebut bukan berasal dari bahasa Arab",
        "D. Karena hanya berlaku pada bacaan imam di Mekkah"
      ],
      jawabanBenar: "A",
      pembahasan: "Kaidah Tajwid: Idgham Bighunnah hanya berlaku jika terjadi dalam dua kata terpisah. Jika nun sukun bertemu wawu/ya dalam satu kata (dunya, bunyan, qinwan, sinwan), wajib dibaca Izhar Mutlaq agar arti kata tidak rusak.",
      tingkatKesulitan: "HOTS",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Kontekstualisasi Ayat: Menghadapi maraknya ujaran kebencian di media sosial, bagaimana implementasi nilai Surah Al-Hujurat ayat 12 tentang larangan berprasangka buruk (su'udzon) dan menggunjing (ghibah) bagi seorang pelajar muslim?",
      pilihan: [
        "A. Menyaring setiap informasi, tidak menyebarkan aib pribadi teman di status media sosial, serta mengedepankan husnudzon",
        "B. Membalas setiap komentar negatif dengan kata-kata kasar yang lebih pedas",
        "C. Membuat akun palsu untuk menyerang balik pihak yang berseteru",
        "D. Memblokir seluruh media sosial dan tidak bergaul sama sekali"
      ],
      jawabanBenar: "A",
      pembahasan: "Al-Hujurat:12 melarang tajassus (mencari kesalahan orang) dan ghibah (menggunjing seperti memakan bangkai saudara sendiri). Pelajar wajib menjaga jemari dan lisan di era digital.",
      tingkatKesulitan: "HOTS",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Analisis Kritis: Surah Al-Mujadilah ayat 11 menekankan adab dalam majelis ilmu, yaitu memberi kelapangan tempat bagi sesama penuntut ilmu. Makna filosofis kelapangan tempat dalam pendidikan modern mencakup...",
      pilihan: [
        "A. Inklusivitas belajar, kerelaan berbagi fasilitas belajar, dan tidak bersikap egois menguasai ruang diskusi",
        "B. Mengharuskan kelas dibuat seluas lapangan sepak bola",
        "C. Melarang siswa miskin duduk di barisan depan",
        "D. Membeli bangku sekolah paling empuk"
      ],
      jawabanBenar: "A",
      pembahasan: "'Tafassahu fil majalisi'. Adab majelis adalah membuka ruang keramahan sosial, menyambut sesama pembelajar dengan lapang dada, empati, dan sikap saling mendukung.",
      tingkatKesulitan: "HOTS",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Evaluasi Makna: Dalam Surah Al-Insyirah disebutkan: 'Fa inna ma'al 'usri yusra, inna ma'al 'usri yusra'. Pengulangan kata 'kemudahan' dengan bentuk nakirah setelah 'kesulitan' dengan bentuk ma'rifah menunjukkan hikmah bahwa...",
      pilihan: [
        "A. Satu kesulitan tidak akan pernah mampu mengalahkan dua kemudahan yang Allah sediakan bagi hamba yang sabar",
        "B. Hidup manusia selamanya akan dirundung penderitaan tanpa jalan keluar",
        "C. Kemudahan hanya bisa diraih dengan jalan pintas tanpa berusaha",
        "D. Kesulitan hidup adalah tanda Allah murka kepada hamba-Nya"
      ],
      jawabanBenar: "A",
      pembahasan: "Kaidah tafsir balaghah: Kata al-'usr (kesulitan) disebut ma'rifah (satu kesulitan yang sama), sedangkan yusra (kemudahan) nakirah (kemudahan berlipat ganda). Optimisme adalah watak sejati mukmin.",
      tingkatKesulitan: "HOTS",
      kategori: "Al-Qur'an"
    },
    {
      pertanyaan: "Aplikasi Adab Al-Qur'an: Seorang qari membaca Al-Qur'an dengan nada lagu yang sangat indah namun sering mengorbankan panjang mad dan tajwid agar lagunya pas. Evaluasi terhadap bacaan tersebut sesuai kaidah tartil adalah...",
      pilihan: [
        "A. Tidak tepat, karena ketepatan kaidah tajwid dan makharijul huruf adalah rukun wajib yang mutlak didahulukan sebelum keindahan irama lagu",
        "B. Sangat bagus karena yang terpenting adalah suara yang merdu memikat pendengar",
        "C. Boleh melanggar tajwid asalkan di depan kamera televisi",
        "D. Tajwid hanya sunnah pelengkap yang boleh diabaikan kapan saja"
      ],
      jawabanBenar: "A",
      pembahasan: "Membaca tartil dengan menjaga tajwid hukumnya fardhu 'ain: 'Warattilil qur'ana tartila'. Irama suara adalah penghias, sedangkan tajwid adalah ruh ketepatan kalamullah.",
      tingkatKesulitan: "HOTS",
      kategori: "Al-Qur'an"
    }
  ]
};

// 6. AKIDAH & ASMAUL HUSNA
const akidahBank: TopicQuestionBank = {
  mudah: [
    {
      pertanyaan: "Nama agung Allah SWT 'Al-'Alim' memiliki arti...",
      pilihan: [
        "A. Maha Mengetahui segala sesuatu",
        "B. Maha Mendengar bisikan hati",
        "C. Maha Melihat perbuatan manusia",
        "D. Maha Teliti dan Waspada"
      ],
      jawabanBenar: "A",
      pembahasan: "Al-'Alim artinya Maha Mengetahui, baik yang tampak (syahadah) maupun yang tersembunyi (ghaib). Tiada sebutir debu pun yang luput dari pengetahuan-Nya.",
      tingkatKesulitan: "Mudah",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Malaikat yang bertugas menyampaikan wahyu kepada para Nabi dan Rasul adalah Malaikat...",
      pilihan: [
        "A. Jibril",
        "B. Mikail",
        "C. Israfil",
        "D. Izrail"
      ],
      jawabanBenar: "A",
      pembahasan: "Malaikat Jibril adalah Ruhul Qudus pembawa wahyu ilahi. Mikail mengurus rezeki/hujan, Israfil meniup sangkakala, Izrail mencabut nyawa.",
      tingkatKesulitan: "Mudah",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Asmaul Husna 'Al-Khabir' mengandung makna bahwa Allah SWT...",
      pilihan: [
        "A. Maha Teliti dan Maha Waspada terhadap rincian seluruh ciptaan-Nya",
        "B. Maha Perkasa tanpa tandingan",
        "C. Maha Pengampun segala dosa",
        "D. Maha Menghidupkan orang mati"
      ],
      jawabanBenar: "A",
      pembahasan: "Al-Khabir berarti Maha Mengetahui hal-hal yang lembut, rahasia terdalam, dan teliti dalam setiap ketentuan ciptaan-Nya.",
      tingkatKesulitan: "Mudah",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Jumlah Rukun Iman yang wajib diyakini dan diikrarkan oleh setiap muslim berjumlah...",
      pilihan: [
        "A. 6 Perkara",
        "B. 5 Perkara",
        "C. 4 Perkara",
        "D. 7 Perkara"
      ],
      jawabanBenar: "A",
      pembahasan: "Rukun Iman ada 6: Iman kepada Allah, Malaikat-Nya, Kitab-kitab-Nya, Rasul-rasul-Nya, Hari Kiamat, serta Qada dan Qadar.",
      tingkatKesulitan: "Mudah",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Malaikat yang bertugas mencatat seluruh amal baik dan amal buruk manusia di dunia adalah...",
      pilihan: [
        "A. Raqib dan Atid",
        "B. Munkar dan Nakir",
        "C. Malik dan Ridwan",
        "D. Jibril dan Mikail"
      ],
      jawabanBenar: "A",
      pembahasan: "Malaikat Raqib mencatat kebajikan, sedangkan Malaikat Atid mencatat keburukan. Tiada satu kata pun terucap melainkan ada pengawas yang hadir.",
      tingkatKesulitan: "Mudah",
      kategori: "Akidah"
    }
  ],
  sedang: [
    {
      pertanyaan: "Contoh perilaku seorang siswa yang meneladani Asmaul Husna 'As-Sami'' (Maha Mendengar) dalam keseharian adalah...",
      pilihan: [
        "A. Menjaga lisan dari perkataan kotor, ghibah, dan dusta karena yakin Allah selalu mendengar ucapannya",
        "B. Menguping pembicaraan rahasia teman sebangku",
        "C. Menggunakan headphone dengan volume suara paling keras",
        "D. Tidak mau mendengarkan nasehat orang tua"
      ],
      jawabanBenar: "A",
      pembahasan: "Meyakini As-Sami' mendorong seorang mukmin selalu berkata santun, jujur, dan berdzikir, serta takut berucap keburukan karena Allah Maha Mendengar.",
      tingkatKesulitan: "Sedang",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Keyakinan bahwa Allah SWT Maha Melihat (Al-Bashir) akan melahirkan sikap mental 'Muraqabah', yaitu...",
      pilihan: [
        "A. Perasaan selalu diawasi oleh Allah SWT di mana pun berada, baik saat ramai maupun sendirian",
        "B. Merasa diri paling suci di antara orang lain",
        "C. Ketakutan berlebihan hingga tidak berani keluar rumah",
        "D. Memasang kamera CCTV di seluruh ruangan"
      ],
      jawabanBenar: "A",
      pembahasan: "Muraqabah adalah kesadaran spiritual bahwa Allah Maha Menyaksikan segala gerak-gerik hamba-Nya, sehingga mencegah seseorang berbuat maksiat meski di ruang sepi.",
      tingkatKesulitan: "Sedang",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Perbedaan hakiki antara karakter penciptaan Malaikat dengan Manusia adalah...",
      pilihan: [
        "A. Malaikat diciptakan dari cahaya (nur), tidak memiliki hawa nafsu, dan selalu taat, sedangkan manusia diciptakan dari tanah dan memiliki nafsu serta akal",
        "B. Malaikat memerlukan makan dan minum seperti manusia",
        "C. Malaikat memiliki jenis kelamin laki-laki dan perempuan",
        "D. Malaikat sering melanggar perintah Allah"
      ],
      jawabanBenar: "A",
      pembahasan: "Malaikat tercipta dari cahaya, suci dari nafsu, tidak beranak-pinak, dan senantiasa bertasbih taat menjalankan perintah Allah SWT.",
      tingkatKesulitan: "Sedang",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Fungsi utama iman kepada Hari Akhir (Kiamat) dalam mengontrol perilaku manusia di dunia adalah...",
      pilihan: [
        "A. Mendorong manusia senantiasa berbuat kebajikan dan bertanggung jawab karena seluruh perbuatan akan diadili di Yaumul Hisab",
        "B. Menghabiskan seluruh harta untuk bersenang-senang sebelum dunia kiamat",
        "C. Menyerah pada nasib dan berhenti belajar di sekolah",
        "D. Menghitung tanggal pasti terjadinya kiamat"
      ],
      jawabanBenar: "A",
      pembahasan: "Iman kepada Hari Akhir memberikan visi pertanggungjawaban moral. Manusia sadar bahwa kehidupan dunia adalah ladang amal untuk kehidupan akhirat yang kekal.",
      tingkatKesulitan: "Sedang",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Sikap seorang mukmin yang benar ketika menghadapi takdir yang tidak sesuai dengan keinginannya (Qada dan Qadar) adalah...",
      pilihan: [
        "A. Berikhtiar maksimal, bersabar, dan berprasangka baik (husnudzon) bahwa ada hikmah terbaik di balik ketetapan Allah",
        "B. Menyalahkan takdir dan mengutuk keadaan",
        "C. Berhenti beribadah karena merasa doanya tidak dikabulkan",
        "D. Mengurung diri dan tidak mau bergaul dengan orang lain"
      ],
      jawabanBenar: "A",
      pembahasan: "Iman kepada Qada dan Qadar menumbuhkan jiwa yang tangguh (ridha), sabar atas musibah, dan bersyukur atas nikmat tanpa berputus asa dari rahmat-Nya.",
      tingkatKesulitan: "Sedang",
      kategori: "Akidah"
    }
  ],
  hots: [
    {
      pertanyaan: "Studi Kasus Integritas: Di dalam kamar tertutup sendirian pada malam hari tanpa ada orang tua yang melihat, Bagas hendak membuka konten pornografi di gawai miliknya. Namun tiba-tiba hatinya bergetar teringat Asmaul Husna Al-Bashir dan Al-Khabir, lalu ia segera menutup gawai tersebut dan beristighfar. Sikap Bagas merupakan manifestasi dari derajat...",
      pilihan: [
        "A. Ihsan (beribadah kepada Allah seolah-olah melihat-Nya, atau yakin Dia melihat kita)",
        "B. Taklid buta",
        "C. Riya' agar dipuji orang tua",
        "D. Sombong secara spiritual"
      ],
      jawabanBenar: "A",
      pembahasan: "Ihsan adalah puncak keimanan: 'An ta'budallaha ka-annaka tarahu, fain lam takun tarahu fainnahu yaraka'. Kesadaran akan pengawasan Allah menundukkan hawa nafsu pribadi.",
      tingkatKesulitan: "HOTS",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Analisis Teologis: Seseorang berpendapat: 'Karena takdir kelulusan ujian sudah ditetapkan di Lauhul Mahfuzh, maka saya tidak perlu belajar lagi.' Bagaimanakah bantahan rasional dan syar'i terhadap pemikiran fatalistik (Jabariyah) semacam ini?",
      pilihan: [
        "A. Keliru, karena takdir mu'allaq berkaitan erat dengan ikhtiar, doa, dan kesungguhan manusia sesuai sunnatullah sebab-akibat",
        "B. Pendapat tersebut sangat benar dan patut ditiru seluruh siswa",
        "C. Belajar itu haram jika takdir sudah ditulis",
        "D. Takdir baru ditentukan Allah setelah manusia selesai ujian"
      ],
      jawabanBenar: "A",
      pembahasan: "Ajaran Ahlussunnah wal Jama'ah mengajarkan ikhtiar maksimal. Rasulullah SAW bersabda: 'I'malu fa kullun muyassarun lima khuliqa lahu' (Beramallah, sebab setiap orang dimudahkan menuju jalan takdirnya).",
      tingkatKesulitan: "HOTS",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Dilema Modern: Sebagian orang saat ini mempercayai ramalan zodiak bintang dan tarot untuk menentukan jodoh, nasib sial, dan peruntungan masa depan. Mengapa dalam akidah tauhid Islam perbuatan ini digolongkan sebagai syirik dan bahaya bagi keimanan?",
      pilihan: [
        "A. Karena menyekutukan Allah dalam hak prerogatif ilmu ghaib yang hanya dimiliki oleh Sang Pencipta",
        "B. Karena kartu tarot harganya terlalu mahal",
        "C. Karena ramalan bintang membuat orang malas bekerja di kantor",
        "D. Karena hanya para ilmuwan fisika yang boleh meramal bintang"
      ],
      jawabanBenar: "A",
      pembahasan: "Tauhid rububiyyah dan asma' wa shifat menegaskan bahwa perkara ghaib masa depan hanya milik Allah (QS. Luqman: 34). Mempercayai peramal menodai kemurnian tauhid.",
      tingkatKesulitan: "HOTS",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Kontekstualisasi Iman: Keyakinan bahwa Malaikat Raqib dan Atid senantiasa mengawasi dan mencatat seluruh amal perbuatan seharusnya berdampak pada etika bermedia sosial seorang remaja berupa...",
      pilihan: [
        "A. Menyadari bahwa setiap ketikan status, komentar, dan konten video akan dipertanggungjawabkan di hadapan Allah",
        "B. Menghapus jejak digital history browser agar malaikat tidak bisa membaca",
        "C. Menggunakan bahasa sandi rahasia yang tidak dipahami manusia",
        "D. Membatasi pengikut (followers) akun medsos maksimal 10 orang"
      ],
      jawabanBenar: "A",
      pembahasan: "'Ma yalfidzu min qaulin illa ladaihi raqibun 'atid'. Setiap huruf yang diposting tercatat abadi. Mukmin yang sadar akan kehadiran malaikat sangat berhati-hati dalam bermedsos.",
      tingkatKesulitan: "HOTS",
      kategori: "Akidah"
    },
    {
      pertanyaan: "Evaluasi Sikap: Gempa bumi melanda suatu daerah dan merusak fasilitas umum. Tokoh A berkata musibah ini semata-mata karena murka Allah atas dosa warga, sedangkan Tokoh B mengajak warga introspeksi diri sekaligus segera mengirim bantuan kemanusiaan tanggap darurat. Sikap yang paling sesuai dengan proporsionalitas akidah Islam adalah...",
      pilihan: [
        "A. Sikap Tokoh B, karena musibah adalah sunnatullah alam sekaligus ladang empati kebajikan tanpa menghakimi korban secara sepihak",
        "B. Sikap Tokoh A yang gemar menuduh azab kepada korban bencana",
        "C. Mengabaikan bencana karena bukan urusan pribadi",
        "D. Menyalahkan pemerintah atas terjadinya pergeseran lempeng bumi"
      ],
      jawabanBenar: "A",
      pembahasan: "Mukmin memandang bencana sebagai cobaan pembersih dosa bagi korban dan ujian kepedulian bagi sesama. Menuduh azab secara sepihak bertentangan dengan akhlak rahmat dan empati.",
      tingkatKesulitan: "HOTS",
      kategori: "Akidah"
    }
  ]
};

// Map of topics
const topicBanks: Record<string, TopicQuestionBank> = {
  thaharah: thaharahBank,
  akhlak: akhlakBank,
  sejarah: sejarahBank,
  shalat: shalatBank,
  alquran: alquranBank,
  akidah: akidahBank
};

/**
 * Detect topic from title and description
 */
function detectTopicKey(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes("thaharah") || text.includes("bersuci") || text.includes("wudhu") || text.includes("najis") || text.includes("hadas") || text.includes("mandi") || text.includes("tayamum")) {
    return "thaharah";
  }
  if (text.includes("amanah") || text.includes("jujur") || text.includes("akhlak") || text.includes("adab") || text.includes("budi pekerti") || text.includes("sopan")) {
    return "akhlak";
  }
  if (text.includes("umayyah") || text.includes("sejarah") || text.includes("damaskus") || text.includes("khalifah") || text.includes("abbasiyah") || text.includes("peradaban") || text.includes("andalusia")) {
    return "sejarah";
  }
  if (text.includes("shalat") || text.includes("sholat") || text.includes("berjamaah") || text.includes("sujud") || text.includes("imam") || text.includes("makmum") || text.includes("qashar") || text.includes("jamak")) {
    return "shalat";
  }
  if (text.includes("qur'an") || text.includes("quran") || text.includes("tajwid") || text.includes("surah") || text.includes("ayat") || text.includes("hafalan") || text.includes("nun sukun")) {
    return "alquran";
  }
  if (text.includes("iman") || text.includes("akidah") || text.includes("aqidah") || text.includes("asmaul") || text.includes("malaikat") || text.includes("kiamat") || text.includes("qada") || text.includes("qadar")) {
    return "akidah";
  }
  // Default fallback
  return "thaharah";
}

/**
 * Synthesizes dynamic contextual questions if count requested exceeds curated bank
 */
function createSyntheticQuestion(
  babJudul: string,
  difficulty: DifficultyLevel,
  index: number
): Omit<SoalPilihanGanda, "id"> {
  const cleanTitle = babJudul.split(":")[1]?.trim() || babJudul;

  if (difficulty === "HOTS") {
    return {
      pertanyaan: `[Analisis Kasus ${index + 1}] Dalam penerapan materi "${cleanTitle}" pada era digital saat ini, seorang pelajar SMP sering dihadapkan pada situasi dilema moral antara mengikuti tren pergaulan bebas atau berpegang teguh pada tuntunan syariat. Berdasarkan kaidah Al-Qur'an dan Sunnah, manakah solusi terbaik yang mencerminkan pemahaman materi ini secara mendalam?`,
      pilihan: [
        "A. Memperkuat literasi agama, memilih lingkungan pertemanan yang positif (sholih), dan mengedepankan prinsip kebaikan (maslahat) di atas kesenangan sesaat",
        "B. Mengikuti arus pergaulan bebas sepenuhnya agar tidak dianggap ketinggalan zaman oleh teman",
        "C. Mengisolasi diri di rumah dan menolak bersosialisasi dengan siapa pun",
        "D. Menyerahkan urusan ibadah hanya saat sudah berusia lanjut nanti"
      ],
      jawabanBenar: "A",
      pembahasan: `Materi "${cleanTitle}" menuntut internalisasi nilai syariah ke dalam perilaku nyata. Pembelajar sejati mampu menyeleksi pengaruh budaya luar dengan filter keimanan dan ketaqwaan.`,
      tingkatKesulitan: "HOTS",
      kategori: cleanTitle
    };
  } else if (difficulty === "Sedang") {
    return {
      pertanyaan: `[Penerapan Kaidah] Bagaimana cara mengamalkan pesan utama dalam pembelajaran "${cleanTitle}" dalam kehidupan sehari-hari di lingkungan sekolah UPT SMPN 2 Rebang Tangkas?`,
      pilihan: [
        "A. Menjalankan perintah syariat dengan tertib, menghormati guru dan teman, serta istiqamah dalam kebajikan",
        "B. Cukup menghafal definisinya saat akan menghadapi ujian semester saja",
        "C. Mengabaikan bimbingan guru dan berbuat semaunya sendiri",
        "D. Mengerjakan tugas hanya bila diawasi oleh kepala sekolah"
      ],
      jawabanBenar: "A",
      pembahasan: `Tujuan inti pembelajaran "${cleanTitle}" adalah pembiasaan akhlak mulia dan penegakan syariat ibadah secara konsisten di lingkungan madrasah dan keluarga.`,
      tingkatKesulitan: "Sedang",
      kategori: cleanTitle
    };
  } else {
    return {
      pertanyaan: `[Pemahaman Konsep] Apakah tujuan pokok seorang muslim mempelajari pokok bahasan "${cleanTitle}" dalam Kurikulum Merdeka PAI SMP?`,
      pilihan: [
        "A. Memahami ajaran Islam secara komprehensif untuk diamalkan sebagai pedoman keselamatan dunia dan akhirat",
        "B. Sekadar mengejar nilai angka di raport tanpa niat beribadah",
        "C. Menunjukkan kesombongan intelektual di hadapan orang lain",
        "D. Memenuhi formalitas jam pelajaran tanpa penghayatan iman"
      ],
      jawabanBenar: "A",
      pembahasan: `Pendidikan Agama Islam pada materi "${cleanTitle}" berfokus membangun fondasi keimanan yang kokoh dan akhlak karimah peserta didik.`,
      tingkatKesulitan: "Mudah",
      kategori: cleanTitle
    };
  }
}

/**
 * Intelligent PAI Curriculum Question Bank & Synthesizer
 * Generates structured, high-quality PAI SMP questions automatically based on Bab title & description
 * GUARANTEES returning EXACTLY `count` questions matching the requested difficulty!
 */
export function generateAutomaticQuiz(
  bab: BabPelajaran,
  options: QuizGeneratorOptions = {}
): SoalPilihanGanda[] {
  const count = options.count && options.count > 0 ? options.count : 5;
  const requestedDiff = options.difficulty || "Sedang";
  const topicKey = detectTopicKey(bab.judul || "", bab.deskripsi || "");
  const bank = topicBanks[topicKey] || topicBanks["thaharah"];

  let candidatePool: Omit<SoalPilihanGanda, "id">[] = [];

  if (requestedDiff === "Campuran") {
    // Balanced distribution: roughly 30% Mudah, 40% Sedang, 30% HOTS
    const countMudah = Math.max(1, Math.round(count * 0.3));
    const countHots = Math.max(1, Math.round(count * 0.3));
    const countSedang = Math.max(1, count - countMudah - countHots);

    const mShuffled = [...bank.mudah].sort(() => 0.5 - Math.random()).slice(0, countMudah);
    const sShuffled = [...bank.sedang].sort(() => 0.5 - Math.random()).slice(0, countSedang);
    const hShuffled = [...bank.hots].sort(() => 0.5 - Math.random()).slice(0, countHots);

    candidatePool = [...mShuffled, ...sShuffled, ...hShuffled];
  } else if (requestedDiff === "HOTS") {
    // Prioritize HOTS questions
    candidatePool = [...bank.hots].sort(() => 0.5 - Math.random());
    // If not enough in topic HOTS, supplement from other topics' HOTS pools
    if (candidatePool.length < count) {
      Object.keys(topicBanks).forEach((k) => {
        if (k !== topicKey && candidatePool.length < count) {
          const others = [...topicBanks[k].hots].sort(() => 0.5 - Math.random());
          for (const q of others) {
            if (candidatePool.length < count && !candidatePool.some(c => c.pertanyaan === q.pertanyaan)) {
              candidatePool.push(q);
            }
          }
        }
      });
    }
  } else if (requestedDiff === "Mudah") {
    // Prioritize Mudah questions
    candidatePool = [...bank.mudah].sort(() => 0.5 - Math.random());
    if (candidatePool.length < count) {
      Object.keys(topicBanks).forEach((k) => {
        if (k !== topicKey && candidatePool.length < count) {
          const others = [...topicBanks[k].mudah].sort(() => 0.5 - Math.random());
          for (const q of others) {
            if (candidatePool.length < count && !candidatePool.some(c => c.pertanyaan === q.pertanyaan)) {
              candidatePool.push(q);
            }
          }
        }
      });
    }
  } else {
    // "Sedang" / Standard
    candidatePool = [...bank.sedang].sort(() => 0.5 - Math.random());
    if (candidatePool.length < count) {
      Object.keys(topicBanks).forEach((k) => {
        if (k !== topicKey && candidatePool.length < count) {
          const others = [...topicBanks[k].sedang].sort(() => 0.5 - Math.random());
          for (const q of others) {
            if (candidatePool.length < count && !candidatePool.some(c => c.pertanyaan === q.pertanyaan)) {
              candidatePool.push(q);
            }
          }
        }
      });
    }
  }

  // Shuffle candidate pool
  candidatePool = [...candidatePool].sort(() => 0.5 - Math.random());

  // Slice to count
  const result: Omit<SoalPilihanGanda, "id">[] = candidatePool.slice(0, count);

  // If still less than requested count, generate dynamic contextual questions
  let synthIdx = 1;
  while (result.length < count) {
    const diffToUse: DifficultyLevel =
      requestedDiff === "Campuran"
        ? (synthIdx % 3 === 1 ? "Mudah" : synthIdx % 3 === 2 ? "Sedang" : "HOTS")
        : (requestedDiff as DifficultyLevel);

    const synthetic = createSyntheticQuestion(bab.judul, diffToUse, result.length);
    result.push(synthetic);
    synthIdx++;
  }

  // Guarantee exact count and assign clean IDs
  return result.slice(0, count).map((q, idx) => ({
    ...q,
    id: `auto_${bab.id}_${Date.now()}_${idx + 1}`
  }));
}
