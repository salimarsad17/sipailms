/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  VisualGameSuiteBundle,
  GameVisualMeta,
  GameCharacter,
  QuizAdventureQuestion,
  MatchDiscoverCard,
  TebakGambarItem,
  SusunKataItem,
  MemoryCardPair,
  WheelSegment,
  MissionStage
} from "../types/gamePaiVisual";

export class GameVisualGenerator {
  /**
   * Generates all 7 interactive visual educational games based on topic
   */
  static generateSuite(
    kelas: string,
    materi: string,
    subMateri: string,
    tingkatKesulitan: string = "Sedang"
  ): VisualGameSuiteBundle {
    const isAsmaulHusna = subMateri.toLowerCase().includes("asmaul") || materi.toLowerCase().includes("asmaul") || subMateri.toLowerCase().includes("alim") || subMateri.toLowerCase().includes("sifat");
    const isThaharah = subMateri.toLowerCase().includes("thaharah") || subMateri.toLowerCase().includes("wudhu") || subMateri.toLowerCase().includes("bersuci") || materi.toLowerCase().includes("thaharah");
    const isShalat = subMateri.toLowerCase().includes("shalat") || subMateri.toLowerCase().includes("salat") || materi.toLowerCase().includes("shalat");
    const isSejarah = materi.toLowerCase().includes("sejarah") || materi.toLowerCase().includes("umayyah") || materi.toLowerCase().includes("abbasiyah") || subMateri.toLowerCase().includes("sejarah");

    // 1. Character & Background Meta
    const character: GameCharacter = {
      id: "CHAR_001",
      nama: "Faris & Aisyah",
      avatarIcon: "🎒",
      jenis: "Penjelajah Cilik",
      deskripsi: "Pelajar muslim SMP yang bersemangat mencari ilmu dan mengamalkan adab mulia.",
      pakaian: "Seragam SMP rapi dengan rompi hijau toska beraksen emas islami",
      warnaUtama: "#0d9488"
    };

    const visualMeta: GameVisualMeta = {
      style: "3D educational animation",
      aspectRatio: "16:9",
      character,
      background: {
        namaTempat: isThaharah ? "Tempat Wudhu & Mushola Al-Ikhlas" : isSejarah ? "Perpustakaan Baitul Hikmah" : "Ruang Belajar Digital SMP",
        tema: isThaharah ? "Masjid" : isSejarah ? "Perpustakaan Sejarah" : "Sekolah",
        deskripsi: "Suasana belajar islami modern yang damai, hangat, dan sarat dengan ornamen kaligrafi edukasi.",
        warnaGradien: "from-teal-900 via-blue-900 to-slate-950"
      },
      imagePrompt: {
        subject: `Interactive Islamic education for junior high students exploring ${subMateri}`,
        characters: "Indonesian junior high Muslim boy and girl students with cheerful and polite expressions",
        environment: "Bright educational classroom with Islamic geometric woodcarvings and bookshelf",
        action: "Observing Islamic values, praying, reflecting on nature and studying Qur'an",
        educationalContext: `Islamic moral teaching: ${subMateri} for grade ${kelas} SMP`,
        visualStyle: "Cute 3D stylized educational animation, Pixar-like warm lighting, 4K rendering",
        lighting: "Warm soft morning sunshine with glowing golden aura",
        composition: "Centered composition with high clarity, clean background, child-friendly"
      }
    };

    // 2. Game 1: Quiz Adventure Questions (4 Levels)
    const game1Questions: QuizAdventureQuestion[] = [
      {
        id: "qa-1",
        level: 1,
        pertanyaan: isAsmaulHusna
          ? "Apa makna utama dari Asmaul Husna Al-'Alim?"
          : isThaharah
          ? "Apa yang dimaksud dengan Thaharah dalam syariat Islam?"
          : `Apa tujuan utama mempelajari nilai-nilai ${subMateri}?`,
        visualPrompt: "Icon visual open illuminated book with golden rays",
        visualIcon: "📖",
        visualLabel: "Pengetahuan Dasar",
        pilihan: isAsmaulHusna
          ? ["Allah Maha Mengetahui", "Allah Maha Mendengar", "Allah Maha Melihat", "Allah Maha Bijaksana"]
          : isThaharah
          ? ["Bersuci dari hadas dan najis", "Mandi biasa agar wangi", "Mencuci pakaian di sungai", "Memakai pakaian baru"]
          : ["Membentuk akhlak mulia dan ketakwaan", "Mendapat sanjungan teman", "Sekadar syarat ujian", "Mencari popularitas"],
        jawabanBenar: 0,
        penjelasanEdukasi: isAsmaulHusna
          ? "Al-'Alim bermakna Allah Maha Mengetahui segala sesuatu, baik yang tampak maupun yang tersembunyi di dalam hati."
          : isThaharah
          ? "Thaharah secara bahasa berarti bersih atau bersuci, dan secara istilah adalah menyucikan diri dari hadas dan najis agar sah melaksanakan ibadah shalat."
          : "Pendidikan Agama Islam bertujuan membentuk kepribadian beriman, bertakwa, dan berakhlak terpuji.",
        petunjukHint: "Perhatikan kata kunci dasar yang sering diulang pada pembukaan bab.",
        poin: 10,
        koinBonus: 5
      },
      {
        id: "qa-2",
        level: 2,
        pertanyaan: isAsmaulHusna
          ? "Jika Allah Maha Mendengar (As-Sami'), bagaimana adab berbicara seorang pelajar muslim?"
          : isThaharah
          ? "Bila seseorang tidak menemukan air atau sedang sakit yang dilarang terkena air, maka bersuci diganti dengan..."
          : `Perilaku manakah yang paling mencerminkan pengamalan materi ${subMateri}?`,
        visualPrompt: "Icon visual listening ear and soundwave of goodness",
        visualIcon: "👂",
        visualLabel: "Penerapan Sikap",
        pilihan: isAsmaulHusna
          ? ["Menjaga lisan dari perkataan kotor, ghibah, dan dusta", "Bebas berteriak di mana saja", "Hanya berbisik-bisik rahasia", "Mengabaikan ucapan guru"]
          : isThaharah
          ? ["Tayamum dengan debu yang suci", "Tidak perlu shalat sama sekali", "Mengusap dengan kain kotor", "Menunggu hingga sembuh total"]
          : ["Berlaku jujur dan bertanggung jawab", "Curang saat tidak ada pengawas", "Ingkar janji bila terdesak", "Pamer kebaikan di medsos"],
        jawabanBenar: 0,
        penjelasanEdukasi: isAsmaulHusna
          ? "Meyakini As-Sami' membuat kita senantiasa menjaga lisan karena setiap ucapan didengar dan dicatat oleh malaikat."
          : isThaharah
          ? "Tayamum adalah rukhsah (keringanan) dari Allah untuk bersuci menggunakan debu bersih saat berhalangan menggunakan air."
          : "Akhlakul karimah diwujudkan lewat kejujuran, amanah, dan keteguhan iman.",
        petunjukHint: "Pilihlah tindakan yang mendatangkan pahala dan menjauhkan dosa.",
        poin: 15,
        koinBonus: 10
      },
      {
        id: "qa-3",
        level: 3,
        pertanyaan: isAsmaulHusna
          ? "Nama indah Allah 'Al-Bashir' mengandung arti bahwa Allah..."
          : isThaharah
          ? "Najis mughalladhah (najis berat) seperti air liur anjing disucikan dengan cara membasuhnya sebanyak..."
          : "Ketika menghadapi godaan berbuat curang di ruang ujian, sikap muraqabah mengarahkan kita untuk...",
        visualPrompt: "Eye symbol looking at the peaceful universe",
        visualIcon: "👁️",
        visualLabel: "Tantangan Dalil",
        pilihan: isAsmaulHusna
          ? ["Maha Melihat segala perbuatan sekecil apa pun", "Maha Berkehendak atas takdir", "Maha Menghidupkan makhluk", "Maha Pengampun segala dosa"]
          : isThaharah
          ? ["7 kali basuhan, salah satunya dicampur tanah suci", "1 kali usapan kain kering", "Cukup disiram air hangat", "Dibiarkan mengering sendiri"]
          : ["Tetap jujur karena yakin Allah senantiasa mengawasi", "Melihat contekan jika pengawas lengah", "Menyalahkan teman yang tidak memberi contekan", "Meminta kunci jawaban online"],
        jawabanBenar: 0,
        penjelasanEdukasi: isAsmaulHusna
          ? "Al-Bashir mengajarkan bahwa pandangan Allah menembus kegelapan malam dan lubuk sanubari terdalam manusia."
          : isThaharah
          ? "Ketentuan syariat membersihkan najis berat adalah membasuh 7 kali dengan air bersih dan salah satunya dicampur debu/tanah suci."
          : "Sifat muraqabah adalah rasa senantiasa diawasi oleh Allah SWT di mana pun kita berada.",
        petunjukHint: "Ingat kembali jumlah basuhan khusus atau sifat pengawasan Allah.",
        poin: 20,
        koinBonus: 15
      },
      {
        id: "qa-4",
        level: 4,
        pertanyaan: isAsmaulHusna
          ? "Sifat 'Al-Khabir' berarti Allah Mahateliti. Hikmah meneladaninya bagi siswa SMP adalah..."
          : isThaharah
          ? "Rukun wudhu yang harus dipenuhi secara berurutan (tertib) berjumlah..."
          : `Hikmah terbesar yang diperoleh seseorang yang istiqomah dalam ${subMateri} adalah...`,
        visualPrompt: "Magnifying glass examining golden deeds and crystals",
        visualIcon: "🔍",
        visualLabel: "Level Master",
        pilihan: isAsmaulHusna
          ? ["Selalu cermat, teliti, dan waspada dalam berbuat serta belajar", "Mencari-cari kesalahan teman", "Tergesa-gesa saat bekerja", "Bersikap masa bodoh terhadap aturan"]
          : isThaharah
          ? ["6 rukun (Niat, Muka, Tangan, Kepala, Kaki, Tertib)", "3 rukun saja", "10 rukun wajib", "Tidak ada urutan tertentu"]
          : ["Mendapatkan keridhaan Allah dan ketenangan batin", "Kekayaan materi yang berlimpah", "Pujian berlebihan dari masyarakat", "Terbebas dari seluruh kewajiban"],
        jawabanBenar: 0,
        penjelasanEdukasi: isAsmaulHusna
          ? "Meneladani Al-Khabir membentuk karakter cermat, teliti memeriksa tugas, dan tidak ceroboh dalam mengambil keputusan."
          : isThaharah
          ? "Rukun wudhu ada 6: niat, membasuh wajah, membasuh kedua tangan sampai siku, mengusap sebagian kepala, membasuh kedua kaki sampai mata kaki, dan tertib."
          : "Istiqomah di jalan Allah mendatangkan ketentraman hati (ithmi'nan al-qalb) dan keselamatan akhirat.",
        petunjukHint: "Fokus pada ketelitian dan keutamaan hati yang tulus.",
        poin: 25,
        koinBonus: 20
      }
    ];

    // 3. Game 2: Match & Discover Cards
    const matchPairs: MatchDiscoverCard[] = isAsmaulHusna
      ? [
          {
            id: "m-1",
            kiri: { id: "k-1", label: "Al-'Alim", icon: "📚", kategori: "Asmaul Husna", color: "from-blue-600 to-indigo-700" },
            kanan: { id: "kn-1", label: "Maha Mengetahui", makna: "Mengetahui rahasia lahir dan batin makhluk", kategori: "Makna", color: "from-blue-50 to-indigo-50" }
          },
          {
            id: "m-2",
            kiri: { id: "k-2", label: "As-Sami'", icon: "👂", kategori: "Asmaul Husna", color: "from-emerald-600 to-teal-700" },
            kanan: { id: "kn-2", label: "Maha Mendengar", makna: "Mendengar doa dan bisikan lirih hamba-Nya", kategori: "Makna", color: "from-emerald-50 to-teal-50" }
          },
          {
            id: "m-3",
            kiri: { id: "k-3", label: "Al-Bashir", icon: "👁️", kategori: "Asmaul Husna", color: "from-amber-600 to-yellow-700" },
            kanan: { id: "kn-3", label: "Maha Melihat", makna: "Melihat amal manusia walau di kegelapan", kategori: "Makna", color: "from-amber-50 to-yellow-50" }
          },
          {
            id: "m-4",
            kiri: { id: "k-4", label: "Al-Khabir", icon: "🔍", kategori: "Asmaul Husna", color: "from-purple-600 to-pink-700" },
            kanan: { id: "kn-4", label: "Mahateliti", makna: "Waspada dan mengetahui seluk-beluk perkara", kategori: "Makna", color: "from-purple-50 to-pink-50" }
          }
        ]
      : isThaharah
      ? [
          {
            id: "m-1",
            kiri: { id: "k-1", label: "Najis Mukhaffafah", icon: "💧", kategori: "Jenis Najis", color: "from-blue-600 to-indigo-700" },
            kanan: { id: "kn-1", label: "Najis Ringan", makna: "Air kencing bayi laki-laki di bawah 2 tahun yang hanya minum ASI", kategori: "Penjelasan", color: "from-blue-50 to-indigo-50" }
          },
          {
            id: "m-2",
            kiri: { id: "k-2", label: "Najis Mutawassithah", icon: "🩸", kategori: "Jenis Najis", color: "from-amber-600 to-yellow-700" },
            kanan: { id: "kn-2", label: "Najis Sedang", makna: "Darah, nanah, kotoran hewan, dan bangkai", kategori: "Penjelasan", color: "from-amber-50 to-yellow-50" }
          },
          {
            id: "m-3",
            kiri: { id: "k-3", label: "Najis Mughalladhah", icon: "🐾", kategori: "Jenis Najis", color: "from-red-600 to-rose-700" },
            kanan: { id: "kn-3", label: "Najis Berat", makna: "Air liur anjing atau babi dibasuh 7 kali", kategori: "Penjelasan", color: "from-red-50 to-rose-50" }
          },
          {
            id: "m-4",
            kiri: { id: "k-4", label: "Tayamum", icon: "🌾", kategori: "Cara Bersuci", color: "from-emerald-600 to-teal-700" },
            kanan: { id: "kn-4", label: "Debu Suci", makna: "Pengganti wudhu saat tidak ada air atau sakit", kategori: "Penjelasan", color: "from-emerald-50 to-teal-50" }
          }
        ]
      : [
          {
            id: "m-1",
            kiri: { id: "k-1", label: "Amanah", icon: "🤝", kategori: "Akhlak", color: "from-blue-600 to-indigo-700" },
            kanan: { id: "kn-1", label: "Dapat Dipercaya", makna: "Menjalankan tugas dan tanggung jawab secara jujur", kategori: "Makna", color: "from-blue-50 to-indigo-50" }
          },
          {
            id: "m-2",
            kiri: { id: "k-2", label: "Siddiq", icon: "✨", kategori: "Akhlak", color: "from-emerald-600 to-teal-700" },
            kanan: { id: "kn-2", label: "Benar & Jujur", makna: "Kesesuaian antara lisan, hati, dan perbuatan", kategori: "Makna", color: "from-emerald-50 to-teal-50" }
          },
          {
            id: "m-3",
            kiri: { id: "k-3", label: "Tasamuh", icon: "🕊️", kategori: "Sosial", color: "from-amber-600 to-yellow-700" },
            kanan: { id: "kn-3", label: "Toleransi", makna: "Saling menghargai perbedaan latar belakang", kategori: "Makna", color: "from-amber-50 to-yellow-50" }
          },
          {
            id: "m-4",
            kiri: { id: "k-4", label: "Istiqomah", icon: "⚓", kategori: "Karakter", color: "from-purple-600 to-pink-700" },
            kanan: { id: "kn-4", label: "Teguh Pendirian", makna: "Konsisten berbuat kebaikan sepanjang hayat", kategori: "Makna", color: "from-purple-50 to-pink-50" }
          }
        ];

    // 4. Game 3: Tebak Gambar PAI
    const tebakGambarList: TebakGambarItem[] = [
      {
        id: "tg-1",
        judulVisual: isThaharah ? "Praktik Bersuci Wudhu" : "Simbol Membaca & Menuntut Ilmu",
        ilustrasiSvg: isThaharah ? "Tempat wudhu masjid air mengalir jernih" : "Buku dan mushaf Al-Qur'an bersinar",
        ilustrasiIcon: isThaharah ? "🚿" : "📖",
        deskripsiAdegan: isThaharah
          ? "Seorang siswa muslim sedang membasuh kedua tangan sampai siku dengan air mengalir secara tertib di mushola."
          : "Dua orang siswa SMP sedang mengkaji ayat-ayat Al-Qur'an dengan khusyuk di perpustakaan sekolah.",
        pertanyaan: isThaharah
          ? "Kegiatan ibadah apakah yang sedang dipraktikkan pada ilustrasi visual tersebut?"
          : "Aktivitas mulia apakah yang dicerminkan dalam gambar tersebut?",
        pilihan: isThaharah
          ? ["Berwudhu", "Tayamum", "Mandi Biasa", "Istinja'"]
          : ["Menuntut Ilmu & Tadarus", "Bermain Game", "Tidur di Kelas", "Berdebat Kosong"],
        jawabanBenar: 0,
        petunjukHint: isThaharah ? "Dimulai dari membasuh muka dan tangan sampai siku." : "Berhubungan dengan wahyu pertama surah Al-'Alaq: Iqra'!",
        penjelasan: isThaharah
          ? "Gambar tersebut menunjukkan tata cara berwudhu yang menjadi syarat mutlak sahnya ibadah shalat."
          : "Menuntut ilmu dan mentadaburi Al-Qur'an merupakan kewajiban setiap muslim yang dijanjikan derajat tinggi oleh Allah SWT."
      },
      {
        id: "tg-2",
        judulVisual: "Praktik Shalat Berjamaah",
        ilustrasiSvg: "Siswa berbaris rapi dalam shaf shalat",
        ilustrasiIcon: "🕌",
        deskripsiAdegan: "Para siswa berdiri sejajar bahu-membahu dalam barisan shaf yang lurus menghadap kiblat.",
        pertanyaan: "Keutamaan apakah yang diperoleh dari ibadah bersama yang digambarkan di atas?",
        pilihan: [
          "Mendapat pahala 27 derajat dan mempererat persaudaraan",
          "Mendapat hadiah uang dari guru",
          "Bebas dari mengerjakan tugas sekolah",
          "Hanya sekadar formalitas apel pagi"
        ],
        jawabanBenar: 0,
        petunjukHint: "Bandingkan pahala shalat sendirian (1 derajat) dengan berjamaah.",
        penjelasan: "Rasulullah SAW bersabda bahwa shalat berjamaah lebih utama 27 derajat dibandingkan shalat sendirian."
      },
      {
        id: "tg-3",
        judulVisual: "Berbakti kepada Orang Tua & Guru",
        ilustrasiSvg: "Siswa menyalami dan mencium tangan guru/orang tua",
        ilustrasiIcon: "🤝",
        deskripsiAdegan: "Siswa menundukkan badan dengan santun menyalami bapak/ibu guru di depan pintu gerbang sekolah.",
        pertanyaan: "Sikap terpuji yang ditunjukkan dalam ilustrasi adab di atas disebut...",
        pilihan: [
          "Birrul Walidain & Menghormati Guru",
          "Sikap Sombong & Takabur",
          "Riya dalam Ibadah",
          "Ghibah & Menggunjing"
        ],
        jawabanBenar: 0,
        petunjukHint: "Adab memuliakan orang tua dan pendidik untuk meraih keberkahan ilmu.",
        penjelasan: "Menghormati guru dan berbakti kepada orang tua adalah kunci utama terbukanya pintu ilmu dan keridhaan Allah SWT."
      }
    ];

    // 5. Game 4: Susun Kata PAI
    const susunKataList: SusunKataItem[] = isThaharah
      ? [
          { id: "sk-1", petunjukMateri: "Bersuci dari hadas dan najis dalam istilah fikih.", kataAsli: "THAHARAH", hurufAcak: ["H", "A", "T", "A", "R", "H", "A", "H"], artiKata: "Kebersihan lahir dan batin", kategori: "Fikih" },
          { id: "sk-2", petunjukMateri: "Keringanan bersuci dengan debu bersih pengganti air.", kataAsli: "TAYAMUM", hurufAcak: ["Y", "A", "M", "A", "U", "T", "M"], artiKata: "Bersuci darurat", kategori: "Fikih" },
          { id: "sk-3", petunjukMateri: "Sikap berurutan saat membasuh anggota wudhu.", kataAsli: "TERTIB", hurufAcak: ["B", "I", "T", "E", "T", "R"], artiKata: "Sesuai urutan syariat", kategori: "Rukun" }
        ]
      : isAsmaulHusna
      ? [
          { id: "sk-1", petunjukMateri: "Asmaul Husna yang bermakna Allah Maha Mengetahui.", kataAsli: "ALALIM", hurufAcak: ["L", "A", "M", "I", "L", "A"], artiKata: "Maha Mengetahui", kategori: "Akidah" },
          { id: "sk-2", petunjukMateri: "Asmaul Husna yang bermakna Allah Maha Melihat.", kataAsli: "ALBASHIR", hurufAcak: ["S", "H", "I", "R", "A", "B", "A", "L"], artiKata: "Maha Melihat", kategori: "Akidah" },
          { id: "sk-3", petunjukMateri: "Asmaul Husna yang bermakna Allah Mahateliti/Waspada.", kataAsli: "ALKHABIR", hurufAcak: ["B", "I", "R", "H", "A", "K", "L", "A"], artiKata: "Mahateliti", kategori: "Akidah" }
        ]
      : [
          { id: "sk-1", petunjukMateri: "Sikap dapat dipercaya dalam mengemban tugas.", kataAsli: "AMANAH", hurufAcak: ["N", "A", "A", "M", "H", "A"], artiKata: "Tanggung Jawab", kategori: "Akhlak" },
          { id: "sk-2", petunjukMateri: "Sikap saling menghormati dan toleransi.", kataAsli: "TASAMUH", hurufAcak: ["M", "U", "S", "A", "H", "A", "T"], artiKata: "Toleransi", kategori: "Sosial" },
          { id: "sk-3", petunjukMateri: "Teguh pendirian di atas kebenaran.", kataAsli: "ISTIQOMAH", hurufAcak: ["Q", "O", "M", "A", "I", "S", "T", "H", "A"], artiKata: "Konsisten", kategori: "Karakter" }
        ];

    // 6. Game 5: Memory Cards Pairs
    const memoryCardPairs: MemoryCardPair[] = [
      { id: "c-1a", pairId: "pair-1", tipe: "KARTU_A", teks: isAsmaulHusna ? "Al-'Alim" : isThaharah ? "Wudhu" : "Amanah", icon: "📖", subteks: "Konsep", warna: "from-blue-600 to-indigo-700" },
      { id: "c-1b", pairId: "pair-1", tipe: "KARTU_B", teks: isAsmaulHusna ? "Maha Mengetahui" : isThaharah ? "Bersuci Air" : "Dapat Dipercaya", icon: "💡", subteks: "Makna", warna: "from-blue-600 to-indigo-700" },
      { id: "c-2a", pairId: "pair-2", tipe: "KARTU_A", teks: isAsmaulHusna ? "As-Sami'" : isThaharah ? "Tayamum" : "Siddiq", icon: "👂", subteks: "Konsep", warna: "from-emerald-600 to-teal-700" },
      { id: "c-2b", pairId: "pair-2", tipe: "KARTU_B", teks: isAsmaulHusna ? "Maha Mendengar" : isThaharah ? "Debu Suci" : "Jujur & Benar", icon: "✨", subteks: "Makna", warna: "from-emerald-600 to-teal-700" },
      { id: "c-3a", pairId: "pair-3", tipe: "KARTU_A", teks: isAsmaulHusna ? "Al-Bashir" : isThaharah ? "Mughalladhah" : "Tasamuh", icon: "👁️", subteks: "Konsep", warna: "from-amber-600 to-yellow-700" },
      { id: "c-3b", pairId: "pair-3", tipe: "KARTU_B", teks: isAsmaulHusna ? "Maha Melihat" : isThaharah ? "Najis Berat" : "Toleransi", icon: "🕊️", subteks: "Makna", warna: "from-amber-600 to-yellow-700" },
      { id: "c-4a", pairId: "pair-4", tipe: "KARTU_A", teks: isAsmaulHusna ? "Al-Khabir" : isThaharah ? "Mutawassithah" : "Istiqomah", icon: "🔍", subteks: "Konsep", warna: "from-purple-600 to-pink-700" },
      { id: "c-4b", pairId: "pair-4", tipe: "KARTU_B", teks: isAsmaulHusna ? "Mahateliti" : isThaharah ? "Najis Sedang" : "Konsisten", icon: "⚓", subteks: "Makna", warna: "from-purple-600 to-pink-700" }
    ];

    // 7. Game 6: Roda Keberuntungan Segments
    const wheelSegments: WheelSegment[] = [
      { id: "seg-1", label: "Tanya Dalil", kategori: "Pertanyaan", warna: "#0284c7", pertanyaan: `Sebutkan surah dalam Al-Qur'an yang menjelaskan kemuliaan orang bertakwa!`, poin: 20 },
      { id: "seg-2", label: "Tebak Gambar", kategori: "Tebak Gambar", warna: "#059669", pertanyaan: `Apa makna simbol air mengalir jernih pada materi thaharah?`, poin: 25 },
      { id: "seg-3", label: "Benar / Salah", kategori: "Benar/Salah", warna: "#d97706", pertanyaan: `Benar atau Salah: Mencontek saat ujian termasuk melanggar sifat muraqabah?`, kunci: "Benar", poin: 15 },
      { id: "seg-4", label: "Tantangan Sikap", kategori: "Tantangan", warna: "#7c3aed", pertanyaan: `Ceritakan 1 contoh kejujuran yang pernah kamu lakukan minggu ini!`, poin: 30 },
      { id: "seg-5", label: "BONUS 50 KOIN", kategori: "Bonus Koin", warna: "#e11d48", pertanyaan: `Alhamdulillah! Kamu mendapatkan bonus koin keberuntungan. Terus semangat beramal!`, poin: 50 },
      { id: "seg-6", label: "Hafalan Cepat", kategori: "Hafalan", warna: "#0d9488", pertanyaan: `Lafalkan doa sebelum wudhu atau bismillah beserta artinya!`, poin: 25 },
      { id: "seg-7", label: "Studi Kasus", kategori: "Studi Kasus", warna: "#4338ca", pertanyaan: `Jika temanmu mengajak membolos shalat berjamaah, bagaimana caramu menolak dengan sopan?`, poin: 30 }
    ];

    // 8. Game 7: Mission Challenge Stages (5 Missions)
    const missionStages: MissionStage[] = [
      {
        stage: 1,
        judulMisi: "Misi 1: Pintu Gerbang Konsep",
        instruksi: "Pahami dasar materi sebelum melangkah ke tantangan berikutnya.",
        tipeTantangan: "Pilihan Ganda",
        pertanyaan: `Apakah fondasi utama dari ajaran ${subMateri}?`,
        opsi: ["Keimanan dan keikhlasan", "Riya dan pujian", "Paksaan orang lain", "Mengejar gelar"],
        kunciJawaban: "Keimanan dan keikhlasan",
        penjelasan: "Segala amal ibadah harus dilandasi niat ikhlas mencari ridha Allah SWT.",
        badgeHadiah: "Pencari Ilmu Sejati",
        poinMisi: 20
      },
      {
        stage: 2,
        judulMisi: "Misi 2: Pasangan Makna & Dalil",
        instruksi: "Hubungkan prinsip nilai dengan implementasinya.",
        tipeTantangan: "Pencocokan",
        pertanyaan: `Prinsip ketaatan tertinggi bagi seorang muslim ditujukan kepada...`,
        opsi: ["Allah SWT dan Rasul-Nya", "Hawa nafsu pribadi", "Tren di media sosial", "Kekuatan materi"],
        kunciJawaban: "Allah SWT dan Rasul-Nya",
        penjelasan: "Ketaatan mutlak adalah kepada Allah dan Rasul, diikuti ulil amri dalam batas kebaikan.",
        badgeHadiah: "Pecinta Sunnah",
        poinMisi: 25
      },
      {
        stage: 3,
        judulMisi: "Misi 3: Telaah Kasus Moral",
        instruksi: "Amati situasi dan tentukan keputusan moral terbaik.",
        tipeTantangan: "Analisis Sikap",
        pertanyaan: "Apa yang harus kamu lakukan jika melihat temanmu diejek atau dirundung?",
        opsi: ["Membela dan melaporkan ke guru dengan bijak", "Ikut menertawakan", "Merekam untuk medsos", "Menjauhi korban"],
        kunciJawaban: "Membela dan melaporkan ke guru dengan bijak",
        penjelasan: "Islam melarang keras perundungan (bullying) dan memerintahkan tolong-menolong dalam kebaikan.",
        badgeHadiah: "Sahabat Sejati",
        poinMisi: 30
      },
      {
        stage: 4,
        judulMisi: "Misi 4: Uji Ketelitian Dalil",
        instruksi: "Buktikan pemahaman mendalam tentang hikmah materi.",
        tipeTantangan: "Tebak Makna",
        pertanyaan: "Hati yang tenang (ithmi'nan al-qalb) dapat diraih melalui...",
        opsi: ["Mengingat Allah (Dzikrullah) dan shalat khusyuk", "Bermain game seharian", "Membeli barang mewah", "Membanggakan diri"],
        kunciJawaban: "Mengingat Allah (Dzikrullah) dan shalat khusyuk",
        penjelasan: "QS. Ar-Ra'd: 28: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.'",
        badgeHadiah: "Penjaga Hati",
        poinMisi: 35
      },
      {
        stage: 5,
        judulMisi: "Misi 5: Puncak Ujian Akhlak (Final Challenge)",
        instruksi: "Tuntaskan misi pamungkas untuk dinobatkan sebagai Juara PAI SMP!",
        tipeTantangan: "Pilihan Ganda",
        pertanyaan: "Bagaimanakah cara menjaga agar ilmu dan kebaikan yang kita miliki tetap berkah?",
        opsi: ["Mengamalkannya secara istiqomah dan mengajarkannya", "Menyimpannya sendiri", "Merasa lebih mulia dari orang lain", "Membatasi diri dari belajar"],
        kunciJawaban: "Mengamalkannya secara istiqomah dan mengajarkannya",
        penjelasan: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
        badgeHadiah: "🏆 Bintang PAI SMP",
        poinMisi: 40
      }
    ];

    return {
      id: `suite-${Date.now()}`,
      kelas,
      materi,
      subMateri,
      tingkatKesulitan,
      visualMeta,
      game1QuizAdventure: {
        judul: `Petualangan Menjelajahi ${subMateri}`,
        deskripsi: "Jelajahi 4 level tantangan seru, kumpulkan koin emas dan bintang keberkahan!",
        karakter: character,
        daftarSoal: game1Questions,
        totalLevel: 4
      },
      game2MatchDiscover: {
        judul: `Match & Discover: ${subMateri}`,
        deskripsi: "Cocokkan pasangan kartu visual secara tepat untuk membuka wawasan hikmah!",
        jenisPasangan: "Gambar ↔ Konsep",
        pairs: matchPairs
      },
      game3TebakGambar: {
        judul: `Tebak Gambar PAI: ${subMateri}`,
        deskripsi: "Perhatikan ilustrasi visual adegan dan tentukan jawaban yang paling tepat!",
        daftarSoal: tebakGambarList
      },
      game4SusunKata: {
        judul: `Susun Kata PAI: ${subMateri}`,
        deskripsi: "Susun huruf-huruf yang teracak menjadi kata istilah PAI yang sempurna!",
        daftarKata: susunKataList
      },
      game5MemoryCard: {
        judul: `Memory Card PAI: ${subMateri}`,
        deskripsi: "Buka dan temukan pasangan kartu memori yang cocok dengan konsentrasi tinggi!",
        cards: memoryCardPairs
      },
      game6RodaKeberuntungan: {
        judul: `Roda Keberuntungan Edukatif: ${subMateri}`,
        deskripsi: "Putar roda keberuntungan dan taklukkan tantangan acak yang didapat!",
        segments: wheelSegments
      },
      game7MissionChallenge: {
        judul: `Mission Challenge: Ekspedisi ${subMateri}`,
        deskripsi: "Selesaikan 5 misi bertingkat untuk meraih predikat Juara Bintang PAI SMP!",
        misiList: missionStages
      }
    };
  }
}
