/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Video as VideoIcon,
  Gamepad2,
  FileText,
  GraduationCap,
  Play,
  Square,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  Clock,
  RotateCcw,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  Maximize2,
  Trophy,
  Star,
  Check,
  X,
  Layers,
  Calendar,
  HelpCircle,
  Upload,
  Edit3,
  Trash2,
  Plus,
  Save,
  FileUp,
  Sliders,
  AlertCircle
} from "lucide-react";
import { DEFAULT_KURIKULUM_PAI_SMP } from "../../data/kurikulumPaiSmp";

interface MediaAjarViewProps {
  guruNama?: string;
  namaSekolah?: string;
}

type ActiveCategory = "overview" | "video" | "game" | "lkpd" | "lms";
type KelasFilter = "SEMUA" | "7" | "8" | "9";

// ==========================================
// INTERFACES FOR MEDIA AJAR ITEMS
// ==========================================

export interface VideoItem {
  id: string;
  judul: string;
  kelas: "7" | "8" | "9";
  semester: "1" | "2";
  durasi: string;
  materi: string;
  dalil: string;
  terjemahan: string;
  naskah: string;
  videoUrl: string; // Embed URL or video link
  thumbnailColor?: string;
  isCustom?: boolean;
}

export interface QuizQuestion {
  id: number | string;
  kelas: "7" | "8" | "9";
  semester?: "1" | "2";
  materi: string;
  pertanyaan: string;
  pilihan: string[];
  kunci: number;
  pembahasan: string;
  isCustom?: boolean;
}

export interface LkpdData {
  id: string;
  kelas: "7" | "8" | "9";
  semester: "1" | "2";
  judul: string;
  materi: string;
  dalil: string;
  terjemahan: string;
  petunjuk: string[];
  tugasIndividu: string;
  tugasKelompok: string;
  rubrik: string;
  isCustom?: boolean;
}

export interface LmsPaket {
  id: string;
  kelas: "7" | "8" | "9";
  semester: "1" | "2";
  judul: string;
  materi: string;
  deskripsi: string;
  videoCount: number;
  kuisCount: number;
  lkpdStatus: string;
  status: "Aktif" | "Draft";
  isCustom?: boolean;
}

// STORAGE KEYS
const STORAGE_KEY_VIDEOS = "media_ajar_pai_videos_v3";
const STORAGE_KEY_QUIZZES = "media_ajar_pai_quizzes_v3";
const STORAGE_KEY_LKPDS = "media_ajar_pai_lkpds_v3";
const STORAGE_KEY_LMS = "media_ajar_pai_lms_v3";

// DEFAULT INITIAL DATA
const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    judul: "Tata Cara Bersuci dari Najis dan Hadas (Thaharah)",
    kelas: "7",
    semester: "1",
    durasi: "08:45",
    materi: "Fikih Thaharah",
    dalil: "QS. Al-Baqarah: 222",
    terjemahan: "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri.",
    naskah: "Thaharah menurut bahasa berarti bersuci. Menurut istilah syara', thaharah adalah mensucikan badan, pakaian, dan tempat dari hadas dan najis sebagai syarat sah ibadah shalat. Pembagian najis meliputi najis mukhaffafah (ringan), mutawassithah (sedang), dan mughalladhah (berat).",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-blue-600 to-indigo-700"
  },
  {
    id: "vid-2",
    judul: "Memahami Makna Asmaul Husna: Al-Alim, Al-Khabir, As-Sami', Al-Bashir",
    kelas: "7",
    semester: "1",
    durasi: "07:30",
    materi: "Akidah Islam",
    dalil: "QS. Al-A'raf: 180",
    terjemahan: "Hanya milik Allah asma-ul husna, maka bermohonlah kepada-Nya dengan menyebut asma-ul husna itu...",
    naskah: "Mengenal empat Asmaul Husna utama yang menumbuhkan sikap muraqabah (senantiasa merasa diawasi oleh Allah SWT). Siswa diajak untuk selalu jujur dalam perkataan dan tindakan karena Allah Maha Mengetahui dan Maha Mendengar.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-sky-600 to-cyan-700"
  },
  {
    id: "vid-3",
    judul: "Ketentuan Shalat Gerhana (Kusuf & Khusuf) dan Shalat Istisqa",
    kelas: "8",
    semester: "1",
    durasi: "10:15",
    materi: "Fikih Ibadah",
    dalil: "HR. Bukhari & Muslim",
    terjemahan: "Sesungguhnya matahari dan bulan adalah dua tanda dari tanda-tanda kebesaran Allah. Keduanya tidak mengalami gerhana karena mati atau hidupnya seseorang...",
    naskah: "Panduan lengkap tata cara ruku ganda dalam shalat gerhana matahari (kusuf) dan gerhana bulan (khusuf), serta khutbah gerhana yang berisi anjuran beristighfar dan bersedekah.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-emerald-600 to-teal-700"
  },
  {
    id: "vid-4",
    judul: "Menghindari Minuman Keras (Khamr), Judi, dan Pertengkaran",
    kelas: "8",
    semester: "1",
    durasi: "09:00",
    materi: "Akhlak Tercela",
    dalil: "QS. Al-Maidah: 90",
    terjemahan: "Hai orang-orang yang beriman, sesungguhnya meminum khamr, berjudi, berkorban untuk berhala, mengundi nasib dengan panah, adalah perbuatan keji termasuk perbuatan setan...",
    naskah: "Dampak buruk minuman keras terhadap akal pikiran dan masa depan remaja, bahaya judi online yang merusak moral dan ekonomi, serta kiat islami membangun persaudaraan tanpa kekerasan.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-amber-600 to-orange-700"
  },
  {
    id: "vid-5",
    judul: "Meyakini Hari Akhir (Kiamat) dan Menggapai Ketenangan Hati",
    kelas: "9",
    semester: "1",
    durasi: "11:20",
    materi: "Akidah Hari Akhir",
    dalil: "QS. Al-Hajj: 7",
    terjemahan: "Dan sungguh, hari kiamat itu pasti datang, tidak ada keraguan padanya; dan sungguh, Allah akan membangkitkan siapa pun yang di dalam kubur.",
    naskah: "Pembahasan kiamat sughra (kematian, bencana alam) dan kiamat kubra (kehancuran alam semesta). Tahapan alam barzakh, yaumul ba'ats, yaumul hisab, yaumul mizan, hingga balasan surga dan neraka.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-purple-600 to-indigo-800"
  },
  {
    id: "vid-6",
    judul: "Tata Cara Penyembelihan Hewan dan Ibadah Qurban & Aqiqah",
    kelas: "9",
    semester: "1",
    durasi: "12:10",
    materi: "Fikih Qurban",
    dalil: "QS. Al-Kautsar: 2",
    terjemahan: "Maka dirikanlah shalat karena Tuhanmu; dan berkorbanlah.",
    naskah: "Ketentuan hewan qurban yang sah (cukup umur dan tidak cacat), adab penyembelihan yang ihsan (menajamkan pisau), tata cara membaca basmalah dan takbir, serta pembagian daging qurban dan aqiqah.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-rose-600 to-pink-700"
  }
];

const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    kelas: "7",
    semester: "1",
    materi: "Thaharah",
    pertanyaan: "Air kencing bayi laki-laki yang belum berumur dua tahun dan hanya meminum ASI termasuk jenis najis...",
    pilihan: ["Mukhaffafah (Ringan)", "Mutawassithah (Sedang)", "Mughalladhah (Berat)", "Ma'fu (Dimaafkan)"],
    kunci: 0,
    pembahasan: "Najis mukhaffafah cukup disucikan dengan memercikkan air bersih pada benda yang terkena najis tersebut."
  },
  {
    id: 2,
    kelas: "7",
    semester: "1",
    materi: "Asmaul Husna",
    pertanyaan: "Sikap senantiasa berhati-hati dalam berbuat karena meyakini Allah Maha Melihat segala gerak-gerik adalah pengamalan Asmaul Husna...",
    pilihan: ["Al-Alim", "Al-Khabir", "As-Sami'", "Al-Bashir"],
    kunci: 3,
    pembahasan: "Al-Bashir artinya Allah Maha Melihat segala sesuatu, baik yang tampak maupun yang tersembunyi."
  },
  {
    id: 3,
    kelas: "8",
    semester: "1",
    materi: "Shalat Sunnah",
    pertanyaan: "Shalat sunnah yang dilakukan saat terjadi gerhana bulan disebut shalat...",
    pilihan: ["Kusuf", "Khusuf", "Istisqa", "Tarawih"],
    kunci: 1,
    pembahasan: "Shalat gerhana bulan disebut Khusuf (dengan huruf Kha), sedangkan gerhana matahari disebut Kusuf (dengan huruf Kaf)."
  },
  {
    id: 4,
    kelas: "8",
    semester: "1",
    materi: "Akhlak",
    pertanyaan: "Berikut ini yang merupakan dampak negatif meminum minuman keras (khamr) bagi kesehatan akal adalah...",
    pilihan: ["Menghilangkan kesadaran dan merusak sel otak", "Menambah daya konsentrasi belajar", "Mempererat tali silaturahmi", "Meningkatkan nafsu makan"],
    kunci: 0,
    pembahasan: "Khamr secara bahasa berarti penutup akal, yang menyebabkan peminumnya hilang kesadaran dan dapat melakukan tindak kejahatan."
  },
  {
    id: 5,
    kelas: "9",
    semester: "1",
    materi: "Hari Akhir",
    pertanyaan: "Hari dibangkitkannya seluruh manusia dari alam kubur setelah tiupan sangkakala kedua dinamakan...",
    pilihan: ["Yaumul Ba'ats", "Yaumul Mahsyar", "Yaumul Hisab", "Yaumul Mizan"],
    kunci: 0,
    pembahasan: "Yaumul Ba'ats adalah hari kebangkitan manusia dari kuburnya untuk mempertanggungjawabkan seluruh amal perbuatan."
  },
  {
    id: 6,
    kelas: "9",
    semester: "1",
    materi: "Qurban & Aqiqah",
    pertanyaan: "Jumlah kambing yang disembelih untuk aqiqah anak laki-laki menurut sunnah Rasulullah SAW adalah...",
    pilihan: ["1 Ekor", "2 Ekor", "3 Ekor", "1 Ekor Sapi"],
    kunci: 1,
    pembahasan: "Menurut hadis riwayat Tirmidzi, aqiqah anak laki-laki adalah 2 ekor kambing yang sepadan, dan untuk anak perempuan 1 ekor kambing."
  }
];

const INITIAL_LKPDS: LkpdData[] = [
  {
    id: "lkpd-7",
    kelas: "7",
    semester: "1",
    judul: "LKPD Digital: Fikih Thaharah dan Pembagian Najis",
    materi: "Thaharah dan Hakikat Shalat",
    dalil: "QS. Al-Baqarah: 222",
    terjemahan: "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri.",
    petunjuk: [
      "Awali kegiatan dengan membaca Basmalah dan doa sebelum belajar.",
      "Cermati studi kasus tentang thaharah di lingkungan madrasah/sekolah.",
      "Tuliskan analisis dalil dan tata cara bersuci secara tepat pada lembar ini."
    ],
    tugasIndividu: "Jelaskan langkah-langkah praktis mensucikan pakaian yang terkena air kencing bayi perempuan dan bandingkan dengan najis mukhaffafah!",
    tugasKelompok: "Buatlah bagan klasifikasi 3 jenis najis (mukhaffafah, mutawassithah, mughalladhah) beserta contoh nyata dan tata cara pensuciannya!",
    rubrik: "Kesesuaian dalil (30%), Ketepatan langkah pensucian (40%), Kerapian dan kerja sama tim (30%)."
  },
  {
    id: "lkpd-8",
    kelas: "8",
    semester: "1",
    judul: "LKPD Digital: Menjauhi Khamr, Judi, dan Pertengkaran",
    materi: "Menghindari Akhlak Tercela",
    dalil: "QS. Al-Maidah: 90",
    terjemahan: "Hai orang-orang yang beriman, sesungguhnya meminum khamr, berjudi, berkorban untuk berhala, mengundi nasib dengan panah, adalah perbuatan keji...",
    petunjuk: [
      "Pelajari kandungan QS. Al-Maidah ayat 90 tentang larangan khamr dan judi.",
      "Diskusikan kasus maraknya judi slot online di kalangan remaja saat ini.",
      "Rumuskan solusi preventif berbasis nilai-nilai keimanan."
    ],
    tugasIndividu: "Uraikan 3 bahaya utama judi online terhadap kesehatan mental dan stabilitas keuangan keluarga!",
    tugasKelompok: "Rancang kampanye digital atau slogan poster pencegahan pergaulan bebas dan minuman keras di lingkungan sekolah!",
    rubrik: "Pemahaman ayat larangan (30%), Daya kritis analisis dampak (40%), Solusi islami yang diajukan (30%)."
  },
  {
    id: "lkpd-9",
    kelas: "9",
    semester: "1",
    judul: "LKPD Digital: Meyakini Hari Kiamat dan Akibat Amal Manusia",
    materi: "Meyakini Hari Akhir (Kiamat)",
    dalil: "QS. Al-Zalzalah: 7-8",
    terjemahan: "Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya. Dan barangsiapa mengerjakan kejahatan seberat zarrah, niscaya dia akan melihatnya pula.",
    petunjuk: [
      "Baca dan tadabburi QS. Al-Zalzalah ayat 7-8 dengan tartil.",
      "Pahami tahapan peristiwa yaumul ba'ats, yaumul hisab, dan yaumul mizan.",
      "Kerjakan tugas reflektif secara mandiri dan bertanggung jawab."
    ],
    tugasIndividu: "Tuliskan refleksi pribadi mengenai bagaimana keyakinan terhadap Hari Pembalasan dapat mengendalikan perbuatan Anda di media sosial!",
    tugasKelompok: "Buat peta konsep urutan peristiwa Hari Kiamat mulai dari tiupan sangkakala pertama hingga alam surga dan neraka!",
    rubrik: "Kedalaman refleksi diri (40%), Ketepatan urutan yaumul qiyamah (35%), Kesesuaian dalil naqli (25%)."
  }
];

const INITIAL_LMS: LmsPaket[] = [
  {
    id: "lms-7",
    kelas: "7",
    semester: "1",
    judul: "Paket Pembelajaran PAI Kelas VII: Fikih Thaharah & Asmaul Husna",
    materi: "Thaharah & Akidah",
    deskripsi: "Modul digital lengkap mencakup video wudhu/tayamum, kuis Asmaul Husna, LKPD lembar kerja siswa, dan evaluasi sumatif.",
    videoCount: 2,
    kuisCount: 5,
    lkpdStatus: "Tersedia & Siap Cetak",
    status: "Aktif"
  },
  {
    id: "lms-8",
    kelas: "8",
    semester: "1",
    judul: "Paket Pembelajaran PAI Kelas VIII: Shalat Sunnah & Akhlak Terpuji",
    materi: "Fikih Ibadah & Akhlak",
    deskripsi: "Modul digital terpadu shalat gerhana/istisqa, pencegahan khamr & judi online, LKPD diskusi kelompok, dan monitoring progres.",
    videoCount: 2,
    kuisCount: 5,
    lkpdStatus: "Tersedia & Siap Cetak",
    status: "Aktif"
  },
  {
    id: "lms-9",
    kelas: "9",
    semester: "1",
    judul: "Paket Pembelajaran PAI Kelas IX: Iman Hari Akhir & Fikih Qurban",
    materi: "Akidah & Fikih Ibadah",
    deskripsi: "Modul digital esensial persiapan asesmen sumatif akhir jenjang, pembahasan kiamat kubra, simulasi penyembelihan qurban, dan tes CBT.",
    videoCount: 2,
    kuisCount: 5,
    lkpdStatus: "Tersedia & Siap Cetak",
    status: "Aktif"
  }
];

export default function MediaAjarView({
  guruNama = "Sadiqul Alim, S.Pd.I.",
  namaSekolah = "UPT SMPN 2 REBANG TANGKAS"
}: MediaAjarViewProps) {
  // Navigation & Category states
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("overview");
  const [selectedKelas, setSelectedKelas] = useState<KelasFilter>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ==================== DATA STATES (WITH PERSISTENCE) ====================
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved videos:", e);
    }
    return INITIAL_VIDEOS;
  });

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZZES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved quizzes:", e);
    }
    return INITIAL_QUIZZES;
  });

  const [lkpds, setLkpds] = useState<LkpdData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LKPDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved lkpds:", e);
    }
    return INITIAL_LKPDS;
  });

  const [lmsList, setLmsList] = useState<LmsPaket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved lms:", e);
    }
    return INITIAL_LMS;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
    } catch (e) {}
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    } catch (e) {}
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LKPDS, JSON.stringify(lkpds));
    } catch (e) {}
  }, [lkpds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LMS, JSON.stringify(lmsList));
    } catch (e) {}
  }, [lmsList]);

  // ==================== VIDEO PLAYER STATES ====================
  const [activeVideo, setActiveVideo] = useState<VideoItem>(() => videos[0] || INITIAL_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // ==================== GAME STATES ====================
  const [activeGameType, setActiveGameType] = useState<"kuis" | "tebak">("kuis");
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // ==================== LKPD STATES ====================
  const [activeLkpd, setActiveLkpd] = useState<LkpdData>(() => lkpds[0] || INITIAL_LKPDS[0]);
  const [studentNameInput, setStudentNameInput] = useState<string>("Ahmad Fauzi");
  const [studentNisnInput, setStudentNisnInput] = useState<string>("0089234123");
  const [studentAnswerText, setStudentAnswerText] = useState<{ [key: string]: string }>({});

  // ==================== MODAL STATES ====================
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Currently Editing Item
  const [editingItemType, setEditingItemType] = useState<"video" | "game" | "lkpd" | "lms">("video");
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [editingLkpd, setEditingLkpd] = useState<LkpdData | null>(null);

  // ==================== FORM INPUT / UPLOAD STATES ====================
  const [uploadCategory, setUploadCategory] = useState<"video" | "game" | "lkpd" | "lms">("video");
  const [formKelas, setFormKelas] = useState<"7" | "8" | "9">("7");
  const [formSemester, setFormSemester] = useState<"1" | "2">("1");
  const [formJudul, setFormJudul] = useState<string>("");
  const [formMateri, setFormMateri] = useState<string>("");
  const [formDalil, setFormDalil] = useState<string>("");
  const [formTerjemahan, setFormTerjemahan] = useState<string>("");
  const [formDeskripsi, setFormDeskripsi] = useState<string>("");
  const [formVideoUrl, setFormVideoUrl] = useState<string>("");
  const [formDurasi, setFormDurasi] = useState<string>("08:00");
  const [formQuizOptions, setFormQuizOptions] = useState<string[]>(["Opsi A", "Opsi B", "Opsi C", "Opsi D"]);
  const [formQuizKey, setFormQuizKey] = useState<number>(0);
  const [formQuizExplanation, setFormQuizExplanation] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // ==================== AI GENERATOR STATES ====================
  const [aiKelas, setAiKelas] = useState<"7" | "8" | "9">("7");
  const [aiSemester, setAiSemester] = useState<"1" | "2">("1");
  const [aiMateriSelection, setAiMateriSelection] = useState<string>("");
  const [aiCustomTopic, setAiCustomTopic] = useState<string>("");
  const [aiMediaType, setAiMediaType] = useState<"semua" | "video" | "game" | "lkpd" | "lms">("semua");
  const [aiIsGenerating, setAiIsGenerating] = useState<boolean>(false);
  const [aiStep, setAiStep] = useState<string>("");
  const [aiProgress, setAiProgress] = useState<number>(0);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered lists
  const filteredVideos = videos.filter((v) => {
    const matchKelas = selectedKelas === "SEMUA" || v.kelas === selectedKelas;
    const matchSearch =
      v.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.materi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  const filteredQuizzes = quizzes.filter((q) => {
    const matchKelas = selectedKelas === "SEMUA" || q.kelas === selectedKelas;
    const matchSearch =
      q.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.materi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  const filteredLkpds = lkpds.filter((l) => {
    const matchKelas = selectedKelas === "SEMUA" || l.kelas === selectedKelas;
    const matchSearch =
      l.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.materi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  const filteredLms = lmsList.filter((m) => {
    const matchKelas = selectedKelas === "SEMUA" || m.kelas === selectedKelas;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.materi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  // Get pre-loaded topics for chosen AI Class
  const classCurriculum = DEFAULT_KURIKULUM_PAI_SMP.find((k) => k.kelas === aiKelas);
  const availableTopics = classCurriculum?.materiList || [];

  // ==================== CRUD HANDLERS ====================

  // Open Create Modal
  const handleOpenUploadModal = (category: "video" | "game" | "lkpd" | "lms" = "video") => {
    setUploadCategory(category);
    setFormKelas(selectedKelas === "SEMUA" ? "7" : selectedKelas);
    setFormSemester("1");
    setFormJudul("");
    setFormMateri("");
    setFormDalil("");
    setFormTerjemahan("");
    setFormDeskripsi("");
    setFormVideoUrl("");
    setFormDurasi("08:00");
    setFormQuizOptions(["Opsi A", "Opsi B", "Opsi C", "Opsi D"]);
    setFormQuizKey(0);
    setFormQuizExplanation("");
    setUploadedFileName("");
    setIsUploadModalOpen(true);
  };

  // Submit Create
  const handleSaveNewMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) {
      alert("Harap masukkan judul media ajar!");
      return;
    }

    if (uploadCategory === "video") {
      const newVideo: VideoItem = {
        id: "vid-" + Date.now(),
        judul: formJudul,
        kelas: formKelas,
        semester: formSemester,
        durasi: formDurasi || "08:00",
        materi: formMateri || "Materi PAI",
        dalil: formDalil || "QS. Al-Baqarah",
        terjemahan: formTerjemahan || "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang",
        naskah: formDeskripsi || "Naskah video pembelajaran PAI terpadu.",
        videoUrl: formVideoUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        thumbnailColor: "from-sky-600 to-indigo-700",
        isCustom: true
      };
      setVideos([newVideo, ...videos]);
      setActiveVideo(newVideo);
      showToast(`Video materi Kelas ${formKelas} berhasil diunggah!`);
    } else if (uploadCategory === "game") {
      const newQuiz: QuizQuestion = {
        id: Date.now(),
        kelas: formKelas,
        semester: formSemester,
        materi: formMateri || "Kuis PAI",
        pertanyaan: formJudul,
        pilihan: formQuizOptions,
        kunci: formQuizKey,
        pembahasan: formQuizExplanation || "Pembahasan dalil naqli materi.",
        isCustom: true
      };
      setQuizzes([newQuiz, ...quizzes]);
      showToast(`Soal game kuis Kelas ${formKelas} berhasil ditambahkan!`);
    } else if (uploadCategory === "lkpd") {
      const newLkpd: LkpdData = {
        id: "lkpd-" + Date.now(),
        kelas: formKelas,
        semester: formSemester,
        judul: formJudul,
        materi: formMateri || "Materi PAI",
        dalil: formDalil || "QS. Al-An'am",
        terjemahan: formTerjemahan || "Katakanlah: Marilah kubacakan apa yang diharamkan atas kamu oleh Tuhanmu...",
        petunjuk: [
          "Baca Basmalah sebelum mulai mengerjakan lembar kerja.",
          "Cermati studi kasus dan dalil naqli dengan seksama.",
          "Jawablah seluruh tugas individu dan kelompok dengan jujur."
        ],
        tugasIndividu: formDeskripsi || "Jelaskan penerapan materi ini dalam kehidupan sehari-hari!",
        tugasKelompok: "Diskusikan bersama kelompok mengenai hikmah dan contoh perbuatan nyata di lingkungan sekolah!",
        rubrik: "Kesesuaian dalil (40%), Ketepatan analisis (30%), Kreativitas solusi (30%).",
        isCustom: true
      };
      setLkpds([newLkpd, ...lkpds]);
      setActiveLkpd(newLkpd);
      showToast(`LKPD Digital Kelas ${formKelas} berhasil dibuat!`);
    } else if (uploadCategory === "lms") {
      const newLms: LmsPaket = {
        id: "lms-" + Date.now(),
        kelas: formKelas,
        semester: formSemester,
        judul: formJudul,
        materi: formMateri || "Materi PAI",
        deskripsi: formDeskripsi || "Paket modul pembelajaran digital terpadu.",
        videoCount: 1,
        kuisCount: 5,
        lkpdStatus: "Tersedia & Siap Cetak",
        status: "Aktif",
        isCustom: true
      };
      setLmsList([newLms, ...lmsList]);
      showToast(`Paket LMS Kelas ${formKelas} berhasil diterbitkan!`);
    }

    setIsUploadModalOpen(false);
  };

  // Open Edit Modal for Video
  const handleEditVideo = (v: VideoItem) => {
    setEditingItemType("video");
    setEditingVideo(v);
    setFormKelas(v.kelas);
    setFormSemester(v.semester);
    setFormJudul(v.judul);
    setFormMateri(v.materi);
    setFormDalil(v.dalil);
    setFormTerjemahan(v.terjemahan);
    setFormDeskripsi(v.naskah);
    setFormVideoUrl(v.videoUrl);
    setFormDurasi(v.durasi);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal for Quiz
  const handleEditQuiz = (q: QuizQuestion) => {
    setEditingItemType("game");
    setEditingQuiz(q);
    setFormKelas(q.kelas);
    setFormJudul(q.pertanyaan);
    setFormMateri(q.materi);
    setFormQuizOptions([...q.pilihan]);
    setFormQuizKey(q.kunci);
    setFormQuizExplanation(q.pembahasan);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal for LKPD
  const handleEditLkpd = (l: LkpdData) => {
    setEditingItemType("lkpd");
    setEditingLkpd(l);
    setFormKelas(l.kelas);
    setFormSemester(l.semester);
    setFormJudul(l.judul);
    setFormMateri(l.materi);
    setFormDalil(l.dalil);
    setFormTerjemahan(l.terjemahan);
    setFormDeskripsi(l.tugasIndividu);
    setIsEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItemType === "video" && editingVideo) {
      const updated = videos.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              judul: formJudul,
              kelas: formKelas,
              semester: formSemester,
              durasi: formDurasi,
              materi: formMateri,
              dalil: formDalil,
              terjemahan: formTerjemahan,
              naskah: formDeskripsi,
              videoUrl: formVideoUrl
            }
          : v
      );
      setVideos(updated);
      if (activeVideo.id === editingVideo.id) {
        setActiveVideo({ ...activeVideo, judul: formJudul, naskah: formDeskripsi, materi: formMateri });
      }
      showToast("Perubahan video pembelajaran berhasil disimpan!");
    } else if (editingItemType === "game" && editingQuiz) {
      const updated = quizzes.map((q) =>
        q.id === editingQuiz.id
          ? {
              ...q,
              pertanyaan: formJudul,
              kelas: formKelas,
              materi: formMateri,
              pilihan: formQuizOptions,
              kunci: formQuizKey,
              pembahasan: formQuizExplanation
            }
          : q
      );
      setQuizzes(updated);
      showToast("Perubahan kuis game edukasi berhasil disimpan!");
    } else if (editingItemType === "lkpd" && editingLkpd) {
      const updated = lkpds.map((l) =>
        l.id === editingLkpd.id
          ? {
              ...l,
              judul: formJudul,
              kelas: formKelas,
              semester: formSemester,
              materi: formMateri,
              dalil: formDalil,
              terjemahan: formTerjemahan,
              tugasIndividu: formDeskripsi
            }
          : l
      );
      setLkpds(updated);
      if (activeLkpd.id === editingLkpd.id) {
        setActiveLkpd({ ...activeLkpd, judul: formJudul, materi: formMateri, tugasIndividu: formDeskripsi });
      }
      showToast("Perubahan LKPD digital berhasil disimpan!");
    }

    setIsEditModalOpen(false);
  };

  // Delete Video
  const handleDeleteVideo = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus video "${judul}"?`)) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      if (activeVideo.id === id && updated.length > 0) {
        setActiveVideo(updated[0]);
      }
      showToast(`Video berhasil dihapus!`);
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = (id: number | string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus soal game kuis ini?`)) {
      const updated = quizzes.filter((q) => q.id !== id);
      setQuizzes(updated);
      showToast(`Soal game kuis berhasil dihapus!`);
    }
  };

  // Delete LKPD
  const handleDeleteLkpd = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus LKPD "${judul}"?`)) {
      const updated = lkpds.filter((l) => l.id !== id);
      setLkpds(updated);
      if (activeLkpd.id === id && updated.length > 0) {
        setActiveLkpd(updated[0]);
      }
      showToast(`LKPD berhasil dihapus!`);
    }
  };

  // Delete LMS
  const handleDeleteLms = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket LMS "${judul}"?`)) {
      const updated = lmsList.filter((l) => l.id !== id);
      setLmsList(updated);
      showToast(`Paket LMS berhasil dihapus!`);
    }
  };

  // ==================== AI GENERATOR ENGINE ====================
  const handleRunAiGenerator = () => {
    const topic = aiCustomTopic.trim() || aiMateriSelection || "Pendidikan Agama Islam";
    setAiIsGenerating(true);
    setAiProgress(15);
    setAiStep(`Menganalisis Capaian Pembelajaran (CP) PAI Kelas ${aiKelas} SMP...`);

    setTimeout(() => {
      setAiProgress(45);
      setAiStep(`Menyusun dalil naqli Al-Qur'an dan Hadis shahih topik "${topic}"...`);
    }, 600);

    setTimeout(() => {
      setAiProgress(75);
      setAiStep(`Merancang media terpadu: Naskah Video, 5 Soal Game Kuis, LKPD Cetak A4, & Modul LMS...`);
    }, 1200);

    setTimeout(() => {
      setAiProgress(100);
      setAiStep("Selesai! Mengintegrasikan media baru ke sistem...");

      const timestamp = Date.now();
      const dalilList = [
        { dalil: "QS. Al-Baqarah: 222", terjemah: "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan mensucikan diri." },
        { dalil: "QS. Al-Maidah: 90", terjemah: "Jauhilah perbuatan keji agar kamu beruntung." },
        { dalil: "QS. Al-Zalzalah: 7-8", terjemah: "Barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat balasannya." },
        { dalil: "QS. Al-Hujurat: 13", terjemah: "Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertaqwa." }
      ];
      const selectedDalil = dalilList[Math.floor(Math.random() * dalilList.length)];

      // 1. Create AI Video
      if (aiMediaType === "semua" || aiMediaType === "video") {
        const generatedVideo: VideoItem = {
          id: `ai-vid-${timestamp}`,
          judul: `[AI] Video Pembelajaran: ${topic}`,
          kelas: aiKelas,
          semester: aiSemester,
          durasi: "09:30",
          materi: topic,
          dalil: selectedDalil.dalil,
          terjemahan: selectedDalil.terjemah,
          naskah: `Naskah Video Pembelajaran AI untuk Kelas ${aiKelas} SMP:\n1. Pembukaan: Mengajak siswa bertadabbur atas ciptaan Allah.\n2. Inti: Penjelasan konsep ${topic} dengan menghubungkannya pada kehidupan nyata.\n3. Dalil: ${selectedDalil.dalil} ("${selectedDalil.terjemah}").\n4. Kesimpulan dan aksi nyata akhlak mulia.`,
          videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          thumbnailColor: "from-emerald-700 to-teal-900",
          isCustom: true
        };
        setVideos((prev) => [generatedVideo, ...prev]);
        setActiveVideo(generatedVideo);
      }

      // 2. Create AI Quiz
      if (aiMediaType === "semua" || aiMediaType === "game") {
        const generatedQuiz: QuizQuestion = {
          id: timestamp,
          kelas: aiKelas,
          semester: aiSemester,
          materi: topic,
          pertanyaan: `Berdasarkan materi ${topic} untuk siswa Kelas ${aiKelas} SMP, sikap yang mencerminkan pemahaman nilai dalil naqli yang benar adalah...`,
          pilihan: [
            "Menerapkannya secara konsisten dalam kehidupan sehari-hari dengan niat ikhlas",
            "Menghafalkannya tanpa mengamalkan maknanya",
            "Menunjukkannya hanya saat di hadapan guru di sekolah",
            "Mengabaikan nasihat orang tua dan teman sebaya"
          ],
          kunci: 0,
          pembahasan: `Pengamalan nilai ${topic} yang benar harus bersumber dari keikhlasan hati dan konsistensi perbuatan sehari-hari.`,
          isCustom: true
        };
        setQuizzes((prev) => [generatedQuiz, ...prev]);
      }

      // 3. Create AI LKPD
      if (aiMediaType === "semua" || aiMediaType === "lkpd") {
        const generatedLkpd: LkpdData = {
          id: `ai-lkpd-${timestamp}`,
          kelas: aiKelas,
          semester: aiSemester,
          judul: `[AI] LKPD Lembar Kerja: ${topic}`,
          materi: topic,
          dalil: selectedDalil.dalil,
          terjemahan: selectedDalil.terjemah,
          petunjuk: [
            "Awali dengan membaca Basmalah dan doa sebelum belajar.",
            "Pahami dalil Al-Qur'an dan Hadis yang tertera dengan seksama.",
            "Tuliskan analisis penerapan dan jawaban Anda pada lembar kerja."
          ],
          tugasIndividu: `Jelaskan bagaimana konsep ${topic} dapat Anda wujudkan dalam pergaulan dengan teman di sekolah dan keluarga!`,
          tugasKelompok: `Diskusikan bersama kelompok Anda tantangan nyata dalam menerapkan ${topic} di era modern serta rumuskan solusinya!`,
          rubrik: "Kesesuaian pemahaman dalil (40%), Ketajaman analisis kontekstual (35%), Kerapian dan tata bahasa (25%).",
          isCustom: true
        };
        setLkpds((prev) => [generatedLkpd, ...prev]);
        setActiveLkpd(generatedLkpd);
      }

      // 4. Create AI LMS
      if (aiMediaType === "semua" || aiMediaType === "lms") {
        const generatedLms: LmsPaket = {
          id: `ai-lms-${timestamp}`,
          kelas: aiKelas,
          semester: aiSemester,
          judul: `[AI] Paket Modul Digital: ${topic}`,
          materi: topic,
          deskripsi: `Paket modul belajar terpadu Kurikulum Merdeka PAI Kelas ${aiKelas} SMP semester ${aiSemester}.`,
          videoCount: 2,
          kuisCount: 5,
          lkpdStatus: "Siap Cetak A4",
          status: "Aktif",
          isCustom: true
        };
        setLmsList((prev) => [generatedLms, ...prev]);
      }

      setTimeout(() => {
        setAiIsGenerating(false);
        setIsAiModalOpen(false);
        showToast(`✨ Media Ajar AI untuk Kelas ${aiKelas} ("${topic}") berhasil di-generate!`);
        if (aiMediaType === "video") setActiveCategory("video");
        else if (aiMediaType === "game") setActiveCategory("game");
        else if (aiMediaType === "lkpd") setActiveCategory("lkpd");
        else if (aiMediaType === "lms") setActiveCategory("lms");
      }, 500);
    }, 1800);
  };

  // Game Handlers
  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const activeQ = filteredQuizzes[currentQuizIdx] || quizzes[0];
    if (idx === activeQ.kunci) {
      setQuizScore((prev) => prev + 20);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx + 1 < filteredQuizzes.length) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };

  // Print & Download LKPD
  const handlePrintLkpd = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    const htmlContent = `
      <html>
        <head><meta charset="utf-8"><title>LKPD PAI Kelas ${activeLkpd.kelas} SMP - ${namaSekolah}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6;">
          <h2 style="text-align: center; margin-bottom: 2px;">${namaSekolah}</h2>
          <h3 style="text-align: center; margin-top: 0;">LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL PAI</h3>
          <hr/>
          <p><strong>Mata Pelajaran:</strong> Pendidikan Agama Islam dan Budi Pekerti</p>
          <p><strong>Kelas:</strong> ${activeLkpd.kelas} SMP | <strong>Materi:</strong> ${activeLkpd.materi}</p>
          <p><strong>Guru Pengampu:</strong> ${guruNama}</p>
          <p><strong>Nama Siswa:</strong> _____________________________ | <strong>NISN:</strong> ______________</p>
          <hr/>
          <h4>A. DALIL NAQLI</h4>
          <p><em>"${activeLkpd.dalil}"</em></p>
          <p>"${activeLkpd.terjemahan}"</p>
          <h4>B. PETUNJUK PENGERJAAN</h4>
          <ol>
            ${activeLkpd.petunjuk.map((p) => `<li>${p}</li>`).join("")}
          </ol>
          <h4>C. TUGAS INDIVIDU</h4>
          <p>${activeLkpd.tugasIndividu}</p>
          <div style="border: 1px solid #ccc; height: 100px; margin-top: 10px;"></div>
          <h4>D. TUGAS KELOMPOK</h4>
          <p>${activeLkpd.tugasKelompok}</p>
          <div style="border: 1px solid #ccc; height: 100px; margin-top: 10px;"></div>
          <h4>E. RUBRIK PENILAIAN GURU</h4>
          <p>${activeLkpd.rubrik}</p>
          <br/><br/>
          <div style="text-align: right;">
            <p>Guru Pengampu,</p>
            <br/><br/>
            <strong>${guruNama}</strong>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LKPD_${activeLkpd.materi.replace(/\s+/g, "_")}_Kelas_${activeLkpd.kelas}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-950 text-amber-300 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-black">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER BANNER (Contoh Gambar yang Diunggah Pengguna) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-1 shadow-xl border border-emerald-500/30">
        <div className="relative overflow-hidden rounded-2.5xl bg-slate-900/40">
          <img
            src="/assets/aistudio/image_1a19bb72.png"
            alt="Media Ajar PAI (Pendidikan Agama Islam) Kelas 7, 8, & 9 SMP"
            className="w-full h-auto max-h-[380px] object-cover object-center rounded-2.5xl shadow-md"
          />
        </div>
      </div>

      {/* 2. SUB-HEADER & ACTION CONTROLS (+ UPLOAD, ✨ GENERATE AI, & KELAS FILTER) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Title & School Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              {namaSekolah} • Kurikulum Merdeka PAI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Media Ajar PAI SMP (Kelas 7, 8, & 9)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat terpadu Video Pembelajaran, Game Edukasi, LKPD Digital A4, dan LMS Kelas Digital.
          </p>
        </div>

        {/* Center/Right: Action Buttons & Kelas Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Tombol Input Upload Baru */}
          <button
            onClick={() => handleOpenUploadModal(activeCategory === "overview" ? "video" : activeCategory)}
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <Upload className="w-3.5 h-3.5" />
            <span>Upload / Tambah Media</span>
          </button>

          {/* Tombol Generate AI Media Ajar (Sesuai Kelas) */}
          <button
            onClick={() => {
              setAiKelas(selectedKelas === "SEMUA" ? "7" : selectedKelas);
              setIsAiModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md border border-amber-300 flex items-center gap-1.5 transition cursor-pointer transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>✨ Generate AI (Kelas {selectedKelas === "SEMUA" ? "7, 8, 9" : selectedKelas})</span>
          </button>

          {/* Filter Kelas */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-x-auto">
            {(["SEMUA", "7", "8", "9"] as KelasFilter[]).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKelas(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedKelas === k
                    ? "bg-emerald-700 text-white shadow-xs font-extrabold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"
                }`}
              >
                {k === "SEMUA" ? "Semua" : `Kls ${k}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 4 MAIN CATEGORY SHOWCASE CARDS (PERSIS SEPERTI GAMBAR DI ATAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Video Pembelajaran (Sky Blue / Cyan) */}
        <div
          onClick={() => setActiveCategory("video")}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            activeCategory === "video"
              ? "bg-sky-50/90 border-sky-400 shadow-md ring-2 ring-sky-400/50"
              : "bg-white border-sky-200/80 hover:border-sky-400 hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition transform">
                <VideoIcon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                Studio
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-sky-700 transition">
                VIDEO PEMBELAJARAN
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Media video interaktif materi PAI dengan pemutar in-app, naskah dalil, dan kontrol play/stop.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1 text-[9px] font-bold text-sky-800">
              <span className="bg-sky-100/70 px-2 py-0.5 rounded">🎬 Play & Stop</span>
              <span className="bg-sky-100/70 px-2 py-0.5 rounded">📖 Dalil & Naskah</span>
            </div>
          </div>

          <div className="pt-4 border-t border-sky-100 mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800">Buka Video ({filteredVideos.length})</span>
            <div className="w-7 h-7 rounded-full bg-sky-100 group-hover:bg-sky-600 group-hover:text-white text-sky-700 flex items-center justify-center transition">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Game Edukasi (Vibrant Green) */}
        <div
          onClick={() => setActiveCategory("game")}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            activeCategory === "game"
              ? "bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-400/50"
              : "bg-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition transform">
                <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Interaktif
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
                GAME EDUKASI
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kuis Seru, Trivia Islami, dan Gamifikasi belajar PAI dengan skor otomatis dan timer interaktif.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1 text-[9px] font-bold text-emerald-800">
              <span className="bg-emerald-100/70 px-2 py-0.5 rounded">⭐ Kuis Seru!</span>
              <span className="bg-emerald-100/70 px-2 py-0.5 rounded">🎮 {filteredQuizzes.length} Soal</span>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-100 mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Mainkan Game</span>
            <div className="w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center transition">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 3: LKPD Lembar Kerja (Vibrant Coral/Red) */}
        <div
          onClick={() => setActiveCategory("lkpd")}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            activeCategory === "lkpd"
              ? "bg-rose-50/90 border-rose-400 shadow-md ring-2 ring-rose-400/50"
              : "bg-white border-rose-200/80 hover:border-rose-400 hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 group-hover:scale-105 transition transform">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                A4 Cetak
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-rose-700 transition">
                LKPD (LEMBAR KERJA)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Lembar Kerja Peserta Didik terstruktur, soal HOTS, rubrik nilai, siap cetak A4 dan unduh Word.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1 text-[9px] font-bold text-rose-800">
              <span className="bg-rose-100/70 px-2 py-0.5 rounded">🖨️ Cetak Langsung</span>
              <span className="bg-rose-100/70 px-2 py-0.5 rounded">📄 Unduh DOCX</span>
            </div>
          </div>

          <div className="pt-4 border-t border-rose-100 mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Buka LKPD ({filteredLkpds.length})</span>
            <div className="w-7 h-7 rounded-full bg-rose-100 group-hover:bg-rose-600 group-hover:text-white text-rose-700 flex items-center justify-center transition">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 4: LMS Learning Management System (Ocean Teal) */}
        <div
          onClick={() => setActiveCategory("lms")}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            activeCategory === "lms"
              ? "bg-teal-50/90 border-teal-400 shadow-md ring-2 ring-teal-400/50"
              : "bg-white border-teal-200/80 hover:border-teal-400 hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/25 group-hover:scale-105 transition transform">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                E-Learning
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-teal-800 transition">
                LMS (KELAS DIGITAL)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sistem manajemen pembelajaran digital, monitoring progres siswa, evaluasi dan publikasi materi.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1 text-[9px] font-bold text-teal-800">
              <span className="bg-teal-100/70 px-2 py-0.5 rounded">📊 Pantau Siswa</span>
              <span className="bg-teal-100/70 px-2 py-0.5 rounded">🌐 Bagikan Tautan</span>
            </div>
          </div>

          <div className="pt-4 border-t border-teal-100 mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800">Buka LMS PAI ({filteredLms.length})</span>
            <div className="w-7 h-7 rounded-full bg-teal-100 group-hover:bg-teal-700 group-hover:text-white text-teal-700 flex items-center justify-center transition">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE SECTION DISPLAY */}

      {/* ========================================================= */}
      {/* SECTION 1: VIDEO PEMBELAJARAN (IN-APP PLAY & STOP PLAYER) */}
      {/* ========================================================= */}
      {(activeCategory === "video" || activeCategory === "overview") && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                <VideoIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Video Pembelajaran Interaktif (Play & Stop)
                </h3>
                <p className="text-xs text-slate-500">
                  Putar materi multimedia langsung di dalam aplikasi untuk siswa Kelas 7, 8, dan 9 SMP.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenUploadModal("video")}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Video Baru</span>
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari video materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Main Video Player Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Active Player Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between p-4 group">
                {/* Simulated Interactive Video Screen */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex flex-col items-center justify-center text-center p-6 text-white">
                  <div className={`w-16 h-16 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-lg transition transform ${isPlaying ? "scale-110 animate-pulse" : "group-hover:scale-105"}`}>
                    {isPlaying ? <Square className="w-6 h-6 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
                  </div>

                  <div className="mt-4 max-w-md space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-400/30">
                      Kelas {activeVideo.kelas} SMP • {activeVideo.materi}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white line-clamp-2">
                      {activeVideo.judul}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {activeVideo.dalil} — {activeVideo.terjemahan}
                    </p>
                  </div>
                </div>

                {/* Top Video Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate max-w-xs">{activeVideo.judul}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-400 text-[11px]">{activeVideo.durasi}</span>
                    <button
                      onClick={() => handleEditVideo(activeVideo)}
                      className="p-1 rounded-lg bg-white/15 hover:bg-white/30 text-sky-200 transition"
                      title="Edit Video"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(activeVideo.id, activeVideo.judul)}
                      className="p-1 rounded-lg bg-rose-500/30 hover:bg-rose-500 text-rose-200 transition"
                      title="Hapus Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Control Bar (Play, Stop, Volume, Fullscreen) */}
                <div className="relative z-10 flex items-center justify-between gap-3 text-white bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      {isPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{isPlaying ? "STOP" : "PLAY"}</span>
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-xs font-mono text-slate-300">
                      {isPlaying ? "01:25" : "00:00"} / {activeVideo.durasi}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
                      ● Siap Diputar In-App
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Script & Dalil Accordion */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase text-sky-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Naskah & Dalil Naqli Materi</span>
                  </h5>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-sky-700">{activeVideo.dalil}</span>
                    <button
                      onClick={() => handleEditVideo(activeVideo)}
                      className="text-[11px] text-sky-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Naskah</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-serif italic bg-white p-2.5 rounded-xl border border-sky-100">
                  "{activeVideo.terjemahan}"
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {activeVideo.naskah}
                </p>
              </div>
            </div>

            {/* Right: Video Playlist for Selected Class */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center justify-between">
                <span>Daftar Video Pembelajaran</span>
                <span className="text-sky-600 font-bold">{filteredVideos.length} Video</span>
              </h4>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredVideos.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      activeVideo.id === item.id
                        ? "bg-sky-50 border-sky-400 shadow-xs"
                        : "bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setActiveVideo(item);
                        setIsPlaying(true);
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {activeVideo.id === item.id && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3">
                            <span className="w-1 bg-white h-full animate-bounce"></span>
                            <span className="w-1 bg-white h-2 animate-bounce"></span>
                            <span className="w-1 bg-white h-3 animate-bounce"></span>
                          </div>
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                          <span className="text-sky-700 font-extrabold">Kelas {item.kelas} SMP</span>
                          <span>•</span>
                          <span>{item.durasi}</span>
                          {item.isCustom && (
                            <span className="bg-amber-100 text-amber-900 px-1 rounded text-[8px]">Kustom</span>
                          )}
                        </div>
                        <h5 className="text-xs font-black text-slate-900 truncate">
                          {item.judul}
                        </h5>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.materi}
                        </span>
                      </div>
                    </div>

                    {/* Quick Edit & Delete Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVideo(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-100 transition cursor-pointer"
                        title="Edit Video"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVideo(item.id, item.judul);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        title="Hapus Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: GAME EDUKASI (KUIS SERU & GAMIFIKASI INTERAKTIF)*/}
      {/* ========================================================= */}
      {(activeCategory === "game" || activeCategory === "overview") && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Game Edukasi PAI Interaktif (Kuis Seru & Gamifikasi)
                </h3>
                <p className="text-xs text-slate-500">
                  Bermain sambil belajar dengan skor otomatis, pembahasan dalil, dan level tantangan.
                </p>
              </div>
            </div>

            {/* Game Action Controls: Tambah Soal & Edit */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenUploadModal("game")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal Kuis</span>
              </button>

              <div className="flex items-center gap-1 p-1 rounded-2xl bg-emerald-50 border border-emerald-200">
                <button
                  onClick={() => setActiveGameType("kuis")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeGameType === "kuis"
                      ? "bg-emerald-600 text-white shadow-xs font-black"
                      : "text-emerald-900 hover:bg-emerald-100"
                  }`}
                >
                  🎮 Kuis Pintar ({filteredQuizzes.length})
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Game Arena */}
          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-xl border border-emerald-400/30 space-y-5">
            {!quizFinished && filteredQuizzes.length > 0 ? (
              <>
                {/* Game Top Bar: Question Index & Live Score */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-amber-300 font-black">
                      Soal {currentQuizIdx + 1} dari {filteredQuizzes.length}
                    </span>
                    <span className="text-emerald-200">
                      Kelas {filteredQuizzes[currentQuizIdx]?.kelas || "7"} • {filteredQuizzes[currentQuizIdx]?.materi}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-black text-amber-300">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Skor: {quizScore}</span>
                    </div>

                    {/* Edit & Delete Current Question */}
                    {filteredQuizzes[currentQuizIdx] && (
                      <div className="flex items-center gap-1 pl-2 border-l border-emerald-800">
                        <button
                          onClick={() => handleEditQuiz(filteredQuizzes[currentQuizIdx])}
                          className="p-1 rounded text-emerald-300 hover:text-white hover:bg-white/10"
                          title="Edit Soal Ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(filteredQuizzes[currentQuizIdx].id)}
                          className="p-1 rounded text-rose-300 hover:text-white hover:bg-rose-500/40"
                          title="Hapus Soal Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="py-2">
                  <h4 className="text-base sm:text-lg font-black leading-snug text-white">
                    {filteredQuizzes[currentQuizIdx]?.pertanyaan}
                  </h4>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {filteredQuizzes[currentQuizIdx]?.pilihan.map((pil, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === filteredQuizzes[currentQuizIdx]?.kunci;
                    let btnStyle = "bg-white/10 hover:bg-white/20 text-white border-white/15";

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500 text-slate-950 border-emerald-300 font-black";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-500 text-white border-rose-400 font-black";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{pil}</span>
                        </div>
                        {selectedAnswer !== null && isCorrect && (
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                        )}
                        {selectedAnswer !== null && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-white stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/40 text-xs space-y-1 animate-fadeIn">
                    <strong className="text-amber-300 block font-bold">💡 Pembahasan:</strong>
                    <p className="text-emerald-100 leading-relaxed">
                      {filteredQuizzes[currentQuizIdx]?.pembahasan}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {selectedAnswer !== null && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuiz}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <span>{currentQuizIdx + 1 < filteredQuizzes.length ? "Lanjut Soal Berikutnya" : "Lihat Hasil Akhir"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : filteredQuizzes.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-emerald-200">Belum ada soal kuis untuk kelas ini.</p>
                <button
                  onClick={() => handleOpenUploadModal("game")}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  + Tambah Soal Pertama
                </button>
              </div>
            ) : (
              /* Quiz Result Summary Card */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">Alhamdulillah! Kuis Selesai</h4>
                  <p className="text-xs text-emerald-200">
                    Selamat, Anda telah menyelesaikan tantangan game edukasi PAI SMP.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 inline-block px-8">
                  <span className="text-xs font-bold text-amber-300 block uppercase">Total Nilai Capaian</span>
                  <span className="text-3xl font-black text-white">{quizScore} / 100</span>
                </div>

                <div>
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Main Ulang Kuis</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: LKPD DIGITAL (LEMBAR KERJA PESERTA DIDIK A4)   */}
      {/* ========================================================= */}
      {(activeCategory === "lkpd" || activeCategory === "overview") && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  LKPD Digital & Siap Cetak A4 (Lembar Kerja Peserta Didik)
                </h3>
                <p className="text-xs text-slate-500">
                  Dapat diisi langsung oleh siswa secara digital atau dicetak/diunduh format Word oleh guru.
                </p>
              </div>
            </div>

            {/* Actions: Tambah LKPD, Edit, Cetak & Unduh Word */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenUploadModal("lkpd")}
                className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat LKPD Baru</span>
              </button>

              <button
                onClick={() => handleEditLkpd(activeLkpd)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-rose-600" />
                <span>Edit LKPD Ini</span>
              </button>

              <button
                onClick={handlePrintLkpd}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak A4</span>
              </button>

              <button
                onClick={handleDownloadDocx}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word</span>
              </button>
            </div>
          </div>

          {/* LKPD Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs font-bold text-slate-500">Pilih Lembar Kerja:</span>
            {filteredLkpds.map((lk) => (
              <button
                key={lk.id}
                onClick={() => setActiveLkpd(lk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeLkpd.id === lk.id
                    ? "bg-rose-600 text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>Kelas {lk.kelas}: {lk.materi}</span>
                {lk.isCustom && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLkpd(lk.id, lk.judul);
                    }}
                    className="hover:text-rose-200"
                    title="Hapus LKPD"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* LKPD A4 Sheet Preview */}
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-slate-50 border-2 border-slate-300/80 shadow-md space-y-6 font-sans">
            {/* Sheet Kop Resmi Sekolah */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                {namaSekolah}
              </h3>
              <h4 className="text-xs sm:text-sm font-extrabold text-rose-800 uppercase">
                {activeLkpd.judul}
              </h4>
              <p className="text-[11px] text-slate-500">
                Pendidikan Agama Islam dan Budi Pekerti • Kelas {activeLkpd.kelas} SMP • Semester {activeLkpd.semester}
              </p>
            </div>

            {/* Student Metadata Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold block">Nama Siswa:</span>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 font-bold block">NISN / Kelas:</span>
                <input
                  type="text"
                  value={studentNisnInput}
                  onChange={(e) => setStudentNisnInput(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs"
                />
              </div>
            </div>

            {/* Dalil Box */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1 text-xs">
              <strong className="text-rose-900 font-black block">📖 Dalil Naqli ({activeLkpd.dalil}):</strong>
              <p className="font-serif italic text-slate-800 leading-relaxed">
                "{activeLkpd.terjemahan}"
              </p>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
              <strong className="block font-black text-amber-900">📌 Petunjuk Pengerjaan:</strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                {activeLkpd.petunjuk.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ol>
            </div>

            {/* Interactive Tasks */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h5 className="text-xs font-black text-slate-900">
                  A. Tugas Individu (Analisis & Penerapan)
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeLkpd.tugasIndividu}
                </p>
                <textarea
                  rows={3}
                  placeholder="Ketik jawaban tugas individu di sini..."
                  value={studentAnswerText["soal-1"] || ""}
                  onChange={(e) =>
                    setStudentAnswerText({ ...studentAnswerText, "soal-1": e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-rose-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h5 className="text-xs font-black text-slate-900">
                  B. Tugas Kelompok (Diskusi & Pemecahan Masalah)
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeLkpd.tugasKelompok}
                </p>
                <textarea
                  rows={3}
                  placeholder="Ketik jawaban tugas kelompok di sini..."
                  value={studentAnswerText["soal-2"] || ""}
                  onChange={(e) =>
                    setStudentAnswerText({ ...studentAnswerText, "soal-2": e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Teacher Grading & Signature */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
              <div>
                <span className="block font-bold">Rubrik Penilaian:</span>
                <span className="text-slate-400 italic text-[11px]">{activeLkpd.rubrik}</span>
              </div>
              <div className="text-center">
                <span className="block">Guru Mata Pelajaran PAI</span>
                <div className="h-12"></div>
                <strong className="block underline text-slate-900">{guruNama}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: LMS (LEARNING MANAGEMENT SYSTEM KELAS DIGITAL) */}
      {/* ========================================================= */}
      {(activeCategory === "lms" || activeCategory === "overview") && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  LMS (Learning Management System PAI)
                </h3>
                <p className="text-xs text-slate-500">
                  Paket kelas digital terintegrasi untuk mendistribusikan materi, video, game, dan LKPD kepada siswa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenUploadModal("lms")}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Terbitkan Paket Kelas Baru</span>
              </button>

              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  showToast("Tautan pembelajaran LMS PAI berhasil disalin!");
                }}
                className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Salin Link</span>
              </button>
            </div>
          </div>

          {/* LMS Modules Grid per Class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredLms.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-black text-[10px]">
                      Paket Kelas {item.kelas} SMP
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-emerald-600 font-bold">● {item.status}</span>
                      <button
                        onClick={() => handleDeleteLms(item.id, item.judul)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus Modul"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">
                    {item.judul}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.deskripsi}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span>🎬 Video Materi:</span>
                      <strong className="text-slate-900">{item.videoCount} Video</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span>🎮 Game Interaktif:</span>
                      <strong className="text-slate-900">{item.kuisCount} Soal</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span>📄 LKPD Digital:</span>
                      <strong className="text-slate-900">{item.lkpdStatus}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Paket LMS Kelas ${item.kelas} "${item.judul}" telah siap diakses oleh siswa.`)}
                  className="w-full mt-2 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Buka Kelas Digital PAI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: UPLOAD / TAMBAH MEDIA AJAR BARU                  */}
      {/* ========================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Upload / Tambah Media Ajar</h3>
                  <p className="text-xs text-slate-500">Tambahkan materi baru sesuai tingkat kelas.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewMedia} className="space-y-3.5">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Kategori Media Ajar:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "video", label: "🎬 Video", bg: "hover:bg-sky-50" },
                    { id: "game", label: "🎮 Game", bg: "hover:bg-emerald-50" },
                    { id: "lkpd", label: "📄 LKPD", bg: "hover:bg-rose-50" },
                    { id: "lms", label: "🏫 LMS", bg: "hover:bg-teal-50" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setUploadCategory(cat.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        uploadCategory === cat.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : `bg-slate-50 text-slate-700 border-slate-200 ${cat.bg}`
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kelas & Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Kelas:</label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="7">Kelas VII (7) SMP</option>
                    <option value="8">Kelas VIII (8) SMP</option>
                    <option value="9">Kelas IX (9) SMP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Semester:</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="1">Semester Ganjil (1)</option>
                    <option value="2">Semester Genap (2)</option>
                  </select>
                </div>
              </div>

              {/* Judul & Materi */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {uploadCategory === "game" ? "Pertanyaan Kuis / Tantangan:" : "Judul Media Ajar:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    uploadCategory === "video"
                      ? "Contoh: Tata Cara Shalat Sunnah Rawatib"
                      : uploadCategory === "game"
                      ? "Contoh: Shalat yang dikerjakan saat terjadi gerhana bulan adalah..."
                      : "Contoh: LKPD Penerapan Nilai Kejujuran dan Amanah"
                  }
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topik / Materi Pokok:</label>
                <input
                  type="text"
                  placeholder="Contoh: Fikih Ibadah / Akidah Islam"
                  value={formMateri}
                  onChange={(e) => setFormMateri(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              {/* Extra fields for Video */}
              {uploadCategory === "video" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Link Video (YouTube/MP4):</label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/embed/..."
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Estimasi Durasi:</label>
                      <input
                        type="text"
                        placeholder="Contoh: 08:30"
                        value={formDurasi}
                        onChange={(e) => setFormDurasi(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Dalil Naqli Al-Qur'an / Hadis:</label>
                    <input
                      type="text"
                      placeholder="Contoh: QS. Al-Baqarah: 222"
                      value={formDalil}
                      onChange={(e) => setFormDalil(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Extra fields for Game */}
              {uploadCategory === "game" && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 block">Pilihan Jawaban (A, B, C, D):</label>
                  {formQuizOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-xs font-black">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...formQuizOptions];
                          copy[idx] = e.target.value;
                          setFormQuizOptions(copy);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                      <input
                        type="radio"
                        name="correctKey"
                        checked={formQuizKey === idx}
                        onChange={() => setFormQuizKey(idx)}
                        title="Tandai sebagai Kunci Jawaban Benar"
                        className="w-4 h-4 text-emerald-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">Kunci</span>
                    </div>
                  ))}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mt-1">Pembahasan Jawaban:</label>
                    <input
                      type="text"
                      placeholder="Uraikan dalil atau alasan mengapa jawaban tersebut benar..."
                      value={formQuizExplanation}
                      onChange={(e) => setFormQuizExplanation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Upload file optional */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lampirkan Berkas (Opsional - Video / PDF / Word):
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200">
                    <FileUp className="w-4 h-4 text-blue-600" />
                    <span>Pilih Berkas Komputer</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                        }
                      }}
                    />
                  </label>
                  {uploadedFileName && (
                    <span className="text-xs text-emerald-700 font-bold truncate max-w-xs">
                      ✓ {uploadedFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Deskripsi / Naskah */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {uploadCategory === "video" ? "Ringkasan Naskah Materi:" : "Uraian / Petunjuk Pengerjaan:"}
                </label>
                <textarea
                  rows={2}
                  placeholder="Ketik keterangan atau catatan pembelajaran di sini..."
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Media Ajar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT MEDIA AJAR                                 */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Media Ajar ({editingItemType.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-500">Perbarui rincian konten media pembelajaran.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Kelas:</label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="7">Kelas VII (7) SMP</option>
                    <option value="8">Kelas VIII (8) SMP</option>
                    <option value="9">Kelas IX (9) SMP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Semester:</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="1">Semester Ganjil (1)</option>
                    <option value="2">Semester Genap (2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {editingItemType === "game" ? "Pertanyaan Kuis:" : "Judul Media:"}
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Materi Pokok:</label>
                <input
                  type="text"
                  value={formMateri}
                  onChange={(e) => setFormMateri(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {editingItemType === "video" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Link Video:</label>
                      <input
                        type="text"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Durasi:</label>
                      <input
                        type="text"
                        value={formDurasi}
                        onChange={(e) => setFormDurasi(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Dalil Naqli:</label>
                    <input
                      type="text"
                      value={formDalil}
                      onChange={(e) => setFormDalil(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </>
              )}

              {editingItemType === "game" && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 block">Pilihan Jawaban (A, B, C, D):</label>
                  {formQuizOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-xs font-black">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...formQuizOptions];
                          copy[idx] = e.target.value;
                          setFormQuizOptions(copy);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                      <input
                        type="radio"
                        name="editCorrectKey"
                        checked={formQuizKey === idx}
                        onChange={() => setFormQuizKey(idx)}
                        className="w-4 h-4 text-emerald-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">Kunci</span>
                    </div>
                  ))}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mt-1">Pembahasan:</label>
                    <input
                      type="text"
                      value={formQuizExplanation}
                      onChange={(e) => setFormQuizExplanation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi / Uraian:</label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: GENERATE AI MEDIA AJAR (SESUAI KELASNYA)          */}
      {/* ========================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">AI Media Ajar Generator</h3>
                  <p className="text-xs text-slate-500">
                    Otomatisasi bahan ajar sesuai capaian kurikulum per kelas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!aiIsGenerating) setIsAiModalOpen(false);
                }}
                disabled={aiIsGenerating}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {!aiIsGenerating ? (
              <div className="space-y-4">
                {/* 1. Pilih Kelas Target */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    1. Tentukan Tingkat Kelas Target:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["7", "8", "9"] as ("7" | "8" | "9")[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setAiKelas(k);
                          setAiMateriSelection("");
                        }}
                        className={`py-2 px-3 rounded-2xl text-xs font-black border transition text-center cursor-pointer ${
                          aiKelas === k
                            ? "bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-500/50"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Kelas {k} SMP
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Pilih Semester */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Semester:</label>
                    <select
                      value={aiSemester}
                      onChange={(e) => setAiSemester(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                    >
                      <option value="1">Semester Ganjil (1)</option>
                      <option value="2">Semester Genap (2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Media:</label>
                    <select
                      value={aiMediaType}
                      onChange={(e) => setAiMediaType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                    >
                      <option value="semua">⭐ Paket Lengkap (4-in-1)</option>
                      <option value="video">🎬 Video & Naskah</option>
                      <option value="game">🎮 Game Edukasi</option>
                      <option value="lkpd">📄 LKPD Siap Cetak</option>
                      <option value="lms">🏫 Modul LMS</option>
                    </select>
                  </div>
                </div>

                {/* 3. Pilih Materi Berdasarkan Kurikulum Kelas Terpilih */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Pilih Materi Pokok Kurikulum PAI Kelas {aiKelas}:
                  </label>
                  <select
                    value={aiMateriSelection}
                    onChange={(e) => setAiMateriSelection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  >
                    <option value="">-- Pilih Topik Kurikulum Merdeka --</option>
                    {availableTopics.map((m) => (
                      <option key={m.id} value={m.judulMateri}>
                        [{m.kategori}] {m.judulMateri}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Atau Ketik Topik Manual */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Atau Ketik Judul / Submateri Sendiri:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Praktik Shalat Jamak & Qashar Musafir..."
                    value={aiCustomTopic}
                    onChange={(e) => setAiCustomTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-600"
                  />
                </div>

                {/* Info preview */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Penyesuaian Otomatis Capaian Kelas {aiKelas}:</span>
                  </span>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    AI menyusun dalil naqli, narasi video, soal kuis HOTS, rubrik LKPD, dan modul kelas yang akurat sesuai buku PAI SMP Kemdikbudristek.
                  </p>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleRunAiGenerator}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>GENERATE SEKARANG</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Loading Generator Animation */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner animate-spin">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-slate-900">
                    AI Sedang Membuat Media Ajar Kelas {aiKelas}...
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">{aiStep}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-300"
                    style={{ width: `${aiProgress}%` }}
                  ></div>
                </div>

                <span className="text-[11px] font-bold text-emerald-800">
                  {aiProgress}% Selesai
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
