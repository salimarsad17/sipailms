/**
 * Data Khazanah & Sumber Belajar Islam - Masterku
 * Al-Qur'an, Hadist, Buku Pelajaran, Kisah Nabi & Rosul, Nasehat Islami, dan Hikmah.
 */

export interface SurahData {
  nomor: number;
  nama: string;
  namaArab: string;
  arti: string;
  golongan: "Makkiyyah" | "Madaniyyah";
  jumlahAyat: number;
  deskripsi: string;
  ayatList: {
    nomor: number;
    arab: string;
    latin: string;
    arti: string;
  }[];
}

import {
  type HaditsItemData,
  type HadistData,
  type TemaHadits,
  type RawiUtama,
  LIST_HADITS_125_LENGKAP,
  LIST_HADITS_BUKHARI,
  LIST_HADITS_MUSLIM,
  LIST_HADITS_NASAI,
  LIST_HADITS_ABU_DAUD,
  LIST_HADITS_IBNU_MAJAH
} from "./hadits";

export type { HaditsItemData, HadistData, TemaHadits, RawiUtama };
export {
  LIST_HADITS_125_LENGKAP,
  LIST_HADITS_BUKHARI,
  LIST_HADITS_MUSLIM,
  LIST_HADITS_NASAI,
  LIST_HADITS_ABU_DAUD,
  LIST_HADITS_IBNU_MAJAH
};

import {
  LIST_BUKU_PAI_KEMENDIKBUD,
  type BukuPelajaranData,
  type BabPelajaranData,
  type ElemenCPType
} from "./bukuPaiKemendikbud";
export type { BukuPelajaranData, BabPelajaranData, ElemenCPType };
export { LIST_BUKU_PAI_KEMENDIKBUD };

export type {
  KisahNabiData,
  KeluargaNabiData,
  UmatNabiData,
  DalilKunciData
} from "./kisah25NabiLengkap";
import {
  LIST_KISAH_25_NABI_LENGKAP,
  type KisahNabiData
} from "./kisah25NabiLengkap";
export { LIST_KISAH_25_NABI_LENGKAP };

export interface NasehatIslamiData {
  id: string;
  tokoh: string;
  peran: string;
  tema: string;
  kutipanArab?: string;
  kutipanIndonesia: string;
  uraianHikmah: string;
  amalanPraktis: string;
}

import { HikmahData, LIST_HIKMAH_INSPIRATIF } from "./hikmahData";
export type { HikmahData };
export { LIST_HIKMAH_INSPIRATIF };


export const LIST_SURAH_PILIHAN: SurahData[] = [
  {
    nomor: 1,
    nama: "Al-Fatihah",
    namaArab: "الفاتحة",
    arti: "Pembukaan",
    golongan: "Makkiyyah",
    jumlahAyat: 7,
    deskripsi: "Surah pembuka Al-Qur'an dan induk Al-Qur'an (Ummul Kitab) yang wajib dibaca dalam setiap rakaat shalat.",
    ayatList: [
      { nomor: 1, arab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", latin: "Bismillāhir-raḥmānir-raḥīm(i)", arti: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang." },
      { nomor: 2, arab: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ", latin: "Al-ḥamdu lillāhi rabbil-'ālamīn(a)", arti: "Segala puji bagi Allah, Tuhan seluruh alam," },
      { nomor: 3, arab: "الرَّحْمٰنِ الرَّحِيْمِۙ", latin: "Ar-raḥmānir-raḥīm(i)", arti: "Yang Maha Pengasih, Maha Penyayang," },
      { nomor: 4, arab: "مٰلِكِ يَوْمِ الدِّيْنِۗ", latin: "Māliki yaumid-dīn(i)", arti: "Pemilik hari pembalasan." },
      { nomor: 5, arab: "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ", latin: "Iyyāka na'budu wa iyyāka nasta'īn(u)", arti: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan." },
      { nomor: 6, arab: "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَۙ", latin: "Ihdinaṣ-ṣirāṭal-mustaqīm(a)", arti: "Tunjukilah kami jalan yang lurus," },
      { nomor: 7, arab: "صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ", latin: "Ṣirāṭal-lażīna an'amta 'alaihim, gairil-magḍūbi 'alaihim walāḍ-ḍāllīn(a)", arti: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat." }
    ]
  },
  {
    nomor: 112,
    nama: "Al-Ikhlas",
    namaArab: "الإخلاص",
    arti: "Kemurnian Keesaan Allah",
    golongan: "Makkiyyah",
    jumlahAyat: 4,
    deskripsi: "Menegaskan pokok akidah tauhid murni bahwa Allah itu Maha Esa dan tempat bergantung seluruh makhluk.",
    ayatList: [
      { nomor: 1, arab: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ", latin: "Qul huwallāhu aḥad(un)", arti: "Katakanlah (Nabi Muhammad), 'Dialah Allah Yang Maha Esa.'" },
      { nomor: 2, arab: "اَللّٰهُ الصَّمَدُۚ", latin: "Allāhuṣ-ṣamad(u)", arti: "Allah tempat meminta segala sesuatu." },
      { nomor: 3, arab: "لَمْ يَلِدْ وَلَمْ يُوْلَدْۙ", latin: "Lam yalid wa lam yūlad", arti: "Dia tidak beranak dan tidak pula diperanakkan," },
      { nomor: 4, arab: "وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ", latin: "Wa lam yakul lahū kufuwan aḥad(un)", arti: "dan tidak ada sesuatu pun yang setara dengan Dia." }
    ]
  },
  {
    nomor: 113,
    nama: "Al-Falaq",
    namaArab: "الفلق",
    arti: "Waktu Subuh",
    golongan: "Makkiyyah",
    jumlahAyat: 5,
    deskripsi: "Doa perlindungan diri kepada Allah dari kejahatan malam, sihir, dan kedengkian orang yang hasad.",
    ayatList: [
      { nomor: 1, arab: "قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ", latin: "Qul a'ūżu birabbil-falaq(i)", arti: "Katakanlah (Nabi Muhammad), 'Aku berlindung kepada Tuhan yang menguasai subuh (fajar)'" },
      { nomor: 2, arab: "مِنْ شَرِّ مَا خَلَقَۙ", latin: "Min syarri mā khalaq(a)", arti: "dari kejahatan (makhluk yang) Dia ciptakan," },
      { nomor: 3, arab: "وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ", latin: "Wa min syarri gāsiqin iżā waqab(a)", arti: "dari kejahatan malam apabila telah gelap gulita," },
      { nomor: 4, arab: "وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِۙ", latin: "Wa min syarrin-naffāṡāti fil-'uqad(i)", arti: "dari kejahatan perempuan-perempuan (penyihir) yang meniup pada buhul-buhul (talinya)," },
      { nomor: 5, arab: "وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ", latin: "Wa min syarri ḥāsidin iżā ḥasad(a)", arti: "dan dari kejahatan orang yang dengki apabila dia dengki." }
    ]
  },
  {
    nomor: 114,
    nama: "An-Nas",
    namaArab: "الناس",
    arti: "Manusia",
    golongan: "Makkiyyah",
    jumlahAyat: 6,
    deskripsi: "Surah penutup mushaf yang mengajarkan permohonan perlindungan kepada Raja dan Sembahan manusia dari bisikan setan.",
    ayatList: [
      { nomor: 1, arab: "قُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ", latin: "Qul a'ūżu birabbin-nās(i)", arti: "Katakanlah (Nabi Muhammad), 'Aku berlindung kepada Tuhannya manusia,'" },
      { nomor: 2, arab: "مَلِكِ النَّاسِۙ", latin: "Malikin-nās(i)", arti: "Raja manusia," },
      { nomor: 3, arab: "اِلٰهِ النَّاسِۙ", latin: "Ilāhin-nās(i)", arti: "Sembahan manusia," },
      { nomor: 4, arab: "مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۖ", latin: "Min syarril-waswāsil-khannās(i)", arti: "dari kejahatan (bisikan) setan yang bersembunyi," },
      { nomor: 5, arab: "الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِۙ", latin: "Allażī yuwaswisu fī ṣudūrin-nās(i)", arti: "yang membisikkan (kejahatan) ke dalam dada manusia," },
      { nomor: 6, arab: "مِنَ الْجِنَّةِ وَالنَّاسِ", latin: "Minal-jinnati wan-nās(i)", arti: "dari (golongan) jin dan manusia." }
    ]
  },
  {
    nomor: 103,
    nama: "Al-'Asr",
    namaArab: "العصر",
    arti: "Masa / Waktu",
    golongan: "Makkiyyah",
    jumlahAyat: 3,
    deskripsi: "Menjelaskan bahwa manusia berada dalam kerugian kecuali yang beriman, beramal saleh, dan saling berpesan dalam kebenaran dan kesabaran.",
    ayatList: [
      { nomor: 1, arab: "وَالْعَصْرِۙ", latin: "Wal-'aṣr(i)", arti: "Demi masa," },
      { nomor: 2, arab: "اِنَّ الْاِنْسَانَ لَفِيْ خُسْرٍۙ", latin: "Innal-insāna lafī khusr(in)", arti: "sungguh, manusia berada dalam kerugian," },
      { nomor: 3, arab: "اِلَّا الَّذِيْنَ اٰمَنُوْا وَعَمِلُوا الصّٰلِحٰتِ وَتَوَاصَوْا بِالْحَقِّ ەۙ وَتَوَاصَوْا بِالصَّبْرِ", latin: "Illal-lażīna āmanū wa 'amiluṣ-ṣāliḥāti wa tawāṣau bil-ḥaqqi wa tawāṣau biṣ-ṣabr(i)", arti: "kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran." }
    ]
  },
  {
    nomor: 108,
    nama: "Al-Kausar",
    namaArab: "الكوثر",
    arti: "Nikmat yang Berlimpah",
    golongan: "Makkiyyah",
    jumlahAyat: 3,
    deskripsi: "Perintah mendirikan shalat dan berkurban sebagai wujud syukur atas limpahan nikmat Allah SWT.",
    ayatList: [
      { nomor: 1, arab: "اِنَّآ اَعْطَيْنٰكَ الْكَوْثَرَۗ", latin: "Innā a'ṭainākal-kauṡar(a)", arti: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak." },
      { nomor: 2, arab: "فَصَلِّ لِرَبِّكَ وَانْحَرْۗ", latin: "Faṣalli lirabbika wanḥar", arti: "Maka laksanakanlah shalat karena Tuhanmu, dan berkurbanlah." },
      { nomor: 3, arab: "اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ", latin: "Inna syāni'aka huwal-abtar(u)", arti: "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah)." }
    ]
  },
  {
    nomor: 94,
    nama: "Asy-Syarh (Al-Insyirah)",
    namaArab: "الشرح",
    arti: "Kelapangan Dada",
    golongan: "Makkiyyah",
    jumlahAyat: 8,
    deskripsi: "Memberikan ketenangan bahwa bersama kesulitan pasti selalu ada kemudahan ganda.",
    ayatList: [
      { nomor: 1, arab: "اَلَمْ نَشْرَحْ لَكَ صَدْرَكَۙ", latin: "A lam nasyraḥ laka ṣadrak(a)", arti: "Bukankah Kami telah melapangkan dadamu (Nabi Muhammad)?" },
      { nomor: 2, arab: "وَوَضَعْنَا عَنْكَ وِزْرَكَۙ", latin: "Wa waḍa'nā 'anka wizrak(a)", arti: "Kami pun telah menurunkan bebanmu darimu," },
      { nomor: 3, arab: "الَّذِيْٓ اَنْقَضَ ظَهْرَكَۙ", latin: "Allażī anqaḍa ẓahrak(a)", arti: "yang memberatkan punggungmu," },
      { nomor: 4, arab: "وَرَفَعْنَا لَكَ ذِكْرَكَۗ", latin: "Wa rafa'nā laka żikrak(a)", arti: "dan Kami tinggikan bagimu sebutan (nama)-mu." },
      { nomor: 5, arab: "فَاِنَّ مَعَ الْعُسْرِ يُسْرًاۙ", latin: "Fa inna ma'al-'usri yusrā(n)", arti: "Maka, sesungguhnya beserta kesulitan ada kemudahan." },
      { nomor: 6, arab: "اِنَّ مَعَ الْعُسْرِ يُسْرًاۗ", latin: "Inna ma'al-'usri yusrā(n)", arti: "Sesungguhnya beserta kesulitan ada kemudahan." },
      { nomor: 7, arab: "فَاِذَا فَرَغْتَ فَانْصَبْۙ", latin: "Fa iżā faragta fanṣab", arti: "Apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain)," },
      { nomor: 8, arab: "وَاِلٰى رَبِّكَ فَارْغَبْ", latin: "Wa ilā rabbika fargab", arti: "dan hanya kepada Tuhanmulah engkau berharap." }
    ]
  },
  {
    nomor: 95,
    nama: "At-Tin",
    namaArab: "التين",
    arti: "Buah Tin",
    golongan: "Makkiyyah",
    jumlahAyat: 8,
    deskripsi: "Menegaskan penciptaan manusia dalam bentuk yang sebaik-baiknya dan pentingnya menjaga martabat kemanusiaan dengan iman.",
    ayatList: [
      { nomor: 1, arab: "وَالتِّيْنِ وَالزَّيْتُوْنِۙ", latin: "Wat-tīni waz-zaitūn(i)", arti: "Demi (buah) Tin dan (buah) Zaitun," },
      { nomor: 2, arab: "وَطُوْرِ سِيْنِيْنَۙ", latin: "Wa ṭūri sīnīn(a)", arti: "demi gunung Sinai," },
      { nomor: 3, arab: "وَهٰذَا الْبَلَدِ الْاَمِيْنِۙ", latin: "Wa hāżal-baladil-amīn(i)", arti: "dan demi negeri (Mekah) yang aman ini." },
      { nomor: 4, arab: "لَقَدْ خَلَقْنَا الْاِنْسَانَ فِيْٓ اَحْسَنِ تَقْوِيْمٍۖ", latin: "Laqad khalaqnal-insāna fī aḥsani taqwīm(in)", arti: "Sungguh, Kami benar-benar telah menciptakan manusia dalam bentuk yang sebaik-baiknya." },
      { nomor: 5, arab: "ثُمَّ رَدَدْنٰهُ اَسْفَلَ سَافِلِيْنَۙ", latin: "Ṡumma radadnāhu asfala sāfilīn(a)", arti: "Kemudian, Kami mengembalikannya ke tingkat yang serendah-rendahnya," },
      { nomor: 6, arab: "اِلَّا الَّذِيْنَ اٰمَنُوْا وَعَمِلُوا الصّٰلِحٰتِ فَلَهُمْ اَجْرٌ غَيْرُ مَمْنُوْنٍۗ", latin: "Illal-lażīna āmanū wa 'amiluṣ-ṣāliḥāti falahum ajrun gairu mamnūn(in)", arti: "kecuali orang-orang yang beriman dan mengerjakan kebajikan. Maka, bagi mereka pahala yang tidak putus-putusnya." },
      { nomor: 7, arab: "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّيْنِۗ", latin: "Famā yukażżibuka ba'du bid-dīn(i)", arti: "Maka, apa yang menyebabkan (mereka) mendustakanmu tentang (hari) pembalasan setelah (adanya bukti-bukti) itu?" },
      { nomor: 8, arab: "اَلَيْسَ اللّٰهُ بِاَحْكَمِ الْحٰكِمِيْنَ", latin: "Alaisallāhu bi'aḥkamil-ḥākimīn(a)", arti: "Bukankah Allah hakim yang paling adil?" }
    ]
  },
  {
    nomor: 67,
    nama: "Al-Mulk",
    namaArab: "الملك",
    arti: "Kerajaan",
    golongan: "Makkiyyah",
    jumlahAyat: 30,
    deskripsi: "Keagungan kekuasaan Allah atas langit, bumi, dan kematian serta kehidupan sebagai sarana ujian bagi manusia.",
    ayatList: [
      { nomor: 1, arab: "تَبٰرَكَ الَّذِيْ بِيَدِهِ الْمُلْكُۖ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌۙ", latin: "Tabārakal-lażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr(un)", arti: "Mahaberkah Allah yang di tangan-Nyalah segala kerajaan dan Dia Mahakuasa atas segala sesuatu," },
      { nomor: 2, arab: "الَّذِيْ خَلَقَ الْمَوْتَ وَالْحَيٰوةَ لِيَبْلُوَكُمْ اَيُّكُمْ اَحْسَنُ عَمَلًاۗ وَهُوَ الْعَزِيْزُ الْغَفُوْرُۙ", latin: "Allażī khalaqal-mauta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā(n), wa huwal-'azīzul-gafūr(u)", arti: "Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa, Maha Pengampun." },
      { nomor: 3, arab: "الَّذِيْ خَلَقَ سَبْعَ سَمٰوٰتٍ طِبَاقًاۗ مَا تَرٰى فِيْ خَلْقِ الرَّحْمٰنِ مِنْ تَفٰوُتٍۗ فَارْجِعِ الْبَصَرَۙ هَلْ تَرٰى مِنْ فُطُوْرٍ", latin: "Allażī khalaqa sab'a samāwātin ṭibāqā(n), mā tarā fī khalqir-raḥmāni min tafāwut(in), farji'il-baṣara hal tarā min fuṭūr(in)", arti: "Yang menciptakan tujuh langit berlapis-lapis. Kamu tidak melihat pada ciptaan Tuhan Yang Maha Pengasih sesuatu yang tidak seimbang. Maka lihatlah sekali lagi, adakah kamu lihat sesuatu yang cacat?" }
    ]
  },
  {
    nomor: 2,
    nama: "Ayat Kursi (Al-Baqarah: 255)",
    namaArab: "آية الكرسي",
    arti: "Ayat Singgasana Keagungan Allah",
    golongan: "Madaniyyah",
    jumlahAyat: 1,
    deskripsi: "Ayat paling agung dalam Al-Qur'an tentang tauhid, keesaan, dan keabadian kekuasaan Allah yang tidak mengantuk dan tidak tidur.",
    ayatList: [
      {
        nomor: 255,
        arab: "اَللّٰهُ لَآ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُۚ لَا تَأْخُذُهٗ سِنَةٌ وَّلَا نَوْمٌۗ لَهٗ مَا فِى السَّمٰوٰتِ وَمَا فِى الْاَرْضِۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهٗٓ اِلَّا بِاِذْنِهٖۗ يَعْلَمُ مَا بَيْنَ اَيْدِيْهِمْ وَمَا خَلْفَهُمْۚ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهٖٓ اِلَّا بِمَا شَاۤءَۚ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْاَرْضَۚ وَلَا يَـُٔوْدُهٗ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ",
        latin: "Allāhu lā ilāha illā huw(a), al-ḥayyul-qayyūm(u), lā ta'khużuhū sinatuw walā naum(un), lahū mā fis-samāwāti wa mā fil-arḍ(i), man żal-lażī yasyfa'u 'indahū illā bi'iżnih(ī), ya'lamu mā baina aidīhim wa mā khalfahum, walā yuḥīṭūna bisyai'im min 'ilmihī illā bimā syā'(a), wasi'a kursiyyuhus-samāwāti wal-arḍ(a), walā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm(u)",
        arti: "Allah, tidak ada tuhan selain Dia, Yang Mahahidup lagi senantiasa mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang ada di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar."
      }
    ]
  }
];

export const LIST_HADIST_PILIHAN: HadistData[] = LIST_HADITS_125_LENGKAP;

export const LIST_BUKU_PELAJARAN: BukuPelajaranData[] = LIST_BUKU_PAI_KEMENDIKBUD;

export const LIST_KISAH_NABI: KisahNabiData[] = LIST_KISAH_25_NABI_LENGKAP;

export const LIST_NASEHAT_ISLAMI: NasehatIslamiData[] = [
  {
    id: "n-01",
    tokoh: "Imam Asy-Syafi'i rahimahullah",
    peran: "Mujtahid Mutlak & Pendiri Mazhab Syafi'i",
    tema: "Menuntut Ilmu & Adab",
    kutipanArab: "أَخِي لَنْ تَنَالَ العِلْمَ إِلَّا بِسِتَّةٍ سَأُنْبِيكَ عَنْ تَفْصِيلِهَا بِبَيَانِ: ذَكَاءٌ وَحِرْصٌ وَاجْتِهَادٌ وَبُلْغَةٌ وَصُحْبَةُ أُسْتَاذٍ وَطُولُ زَمَانِ",
    kutipanIndonesia: "Wahai saudaraku, engkau tidak akan meraih ilmu kecuali dengan enam perkara yang akan kuterangkan kepadamu dengan jelas: Kecerdasan akal, tekad yang kuat, kesungguhan gigih, bekal yang cukup, bimbingan seorang guru, dan masa waktu yang panjang.",
    uraianHikmah: "Ilmu tidak diperoleh secara instan atau sekadar hafalan daring tanpa adab talaqqi kepada guru. Dibutuhkan ketekunan, rasa haus akan kebenaran, pengorbanan waktu, dan kepatuhan memuliakan ustadz/guru agar ilmu membuahkan keberkahan dalam amal.",
    amalanPraktis: "Mencatat setiap materi ajar, menghormati bapak/ibu guru dengan mendengarkan tanpa memotong penjelasan, dan mengulang kembali pelajaran di rumah."
  },
  {
    id: "n-02",
    tokoh: "Umar bin Khattab radhiyallahu 'anhu",
    peran: "Khalifah Kedua / Al-Faruq",
    tema: "Muhasabah & Introspeksi Diri",
    kutipanArab: "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوهَا قَبْلَ أَنْ تُوزَنُوا",
    kutipanIndonesia: "Hisablah (koreksilah) diri kalian sebelum kalian dihisab oleh Allah kelak pada hari kiamat, dan timbanglah amal perbuatan kalian sebelum kalian ditimbang.",
    uraianHikmah: "Orang yang cerdas adalah orang yang mampu menundukkan hawa nafsunya dan mempersiapkan bekal untuk kehidupan setelah kematian. Jangan sibuk mencari cela dan aib orang lain sementara diri sendiri berlumuran dosa dan kelalaian.",
    amalanPraktis: "Meluangkan waktu 5 menit setiap malam sebelum tidur untuk merenungi apa saja dosa yang dilakukan hari ini, lalu beristighfar dan bertekad memperbaiki diri esok hari."
  },
  {
    id: "n-03",
    tokoh: "Hasan Al-Bashri rahimahullah",
    peran: "Ulama Tabi'in Terkemuka & Ahli Zuhud",
    tema: "Waktu dan Nilai Umur",
    kutipanArab: "يَا ابْنَ آدَمَ إِنَّمَا أَنْتَ أَيَّامٌ، كُلَّمَا ذَهَبَ يَوْمٌ ذَهَبَ بَعْضُكَ",
    kutipanIndonesia: "Wahai anak Adam! Sesungguhnya engkau hanyalah kumpulan hari-hari. Setiap kali satu hari berlalu, maka hilanglah sebagian dari dirimu.",
    uraianHikmah: "Waktu adalah modal termahal yang tidak dapat dibeli kembali dengan emas dan permata. Setiap hembusan nafas yang terbuang sia-sia tanpa zikir, belajar, atau amal kebaikan adalah kerugian yang tidak akan pernah bisa tergantikan.",
    amalanPraktis: "Membuat jadwal kegiatan harian yang teratur, mengurangi waktu scrolling media sosial yang tidak bermanfaat, dan memanfaatkan waktu luang untuk membaca Al-Qur'an."
  },
  {
    id: "n-04",
    tokoh: "Ali bin Abi Thalib karramallahu wajhah",
    peran: "Khalifah Keempat & Pintu Gerbang Ilmu",
    tema: "Menjaga Rahasia & Kehormatan Diri",
    kutipanArab: "سِرُّكَ أَسِيرُكَ، فَإِذَا تَكَلَّمْتَ بِهِ صِرْتَ أَسِيرَهُ",
    kutipanIndonesia: "Rahasia hatimu adalah tawananmu, namun jika engkau telah membicarakannya kepada orang lain, maka engkaulah yang menjadi tawanannya.",
    uraianHikmah: "Keberanian sejati adalah kemampuan mengendalikan lisan. Banyak perselisihan, fitnah, dan permusuhan bermula dari ketidakmampuan menjaga rahasia kawan atau mengumbar aib pribadi ke muka publik.",
    amalanPraktis: "Menjaga amanah sahabat, tidak menyebarkan berita yang belum terbukti kebenarannya (tabayyun), dan menutup aib saudara seiman."
  },
  {
    id: "n-05",
    tokoh: "Luqman Al-Hakim",
    peran: "Hamba Saleh Penasihat Generasi",
    tema: "Adab Berbicara & Rendah Hati",
    kutipanArab: "وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِى الْاَرْضِ مَرَحًاۗ اِنَّ اللّٰهَ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُوْرٍ",
    kutipanIndonesia: "Dan janganlah engkau memalingkan wajahmu dari manusia (karena sombong) dan janganlah berjalan di bumi dengan angkuh. Sungguh, Allah tidak menyukai orang-orang yang sombong dan membanggakan diri. (Q.S. Luqman: 18)",
    uraianHikmah: "Ketinggian martabat manusia bukan diukur dari pakaian mewah, jabatan, atau kekayaan, melainkan dari ketawadhuan jiwa. Semakin berisi padi, ia semakin merunduk.",
    amalanPraktis: "Tersenyum dan mengucapkan salam saat berpapasan dengan teman atau guru, serta tidak meninggikan suara saat berdiskusi."
  },
  {
    id: "n-06",
    tokoh: "Imam Al-Ghazali rahimahullah",
    peran: "Hujjatul Islam / Penulis Kitab Ihya' Ulumiddin",
    tema: "Ikhlas Mencegah Riya'",
    kutipanArab: "النَّاسُ كُلُّهُمْ هَلْكَى إِلَّا العَالِمُونَ، وَالعَالِمُونَ كُلُّهُمْ هَلْكَى إِلَّا العَامِلُونَ، وَالعَامِلُونَ كُلُّهُمْ هَلْكَى إِلَّا المُخْلِصُونَ، وَالمُخْلِصُونَ عَلَى خَطَرٍ عَظِيمٍ",
    kutipanIndonesia: "Manusia semuanya binasa kecuali orang yang berilmu. Orang yang berilmu semuanya binasa kecuali yang mengamalkan ilmunya. Orang yang beramal semuanya binasa kecuali yang ikhlas. Dan orang yang ikhlas pun senantiasa berada dalam kekhawatiran besar.",
    uraianHikmah: "Ikhlas adalah nyawa dari setiap amal ibadah. Tanpa ikhlas, amal kebajikan hanya bagaikan debu beterbangan yang tidak memiliki bobot di timbangan akhirat.",
    amalanPraktis: "Menyembunyikan amalan sunnah sebagaimana kita menyembunyikan aib diri, serta melatih diri tidak haus akan pujian orang lain."
  }
];
