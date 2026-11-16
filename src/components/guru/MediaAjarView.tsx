/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Video as VideoIcon,
  Gamepad2,
  GraduationCap,
  Play,
  Square,
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
  AlertCircle,
  Flame,
  Zap,
  Users,
  Copy,
  FileText,
  Send
} from "lucide-react";
import { DEFAULT_KURIKULUM_PAI_SMP } from "../../data/kurikulumPaiSmp";
import { Kelas } from "../../types";
import {
  SharedMediaAjarStorage,
  SharedMediaAjarItem,
  SharedMediaSubmission,
  SharedMediaSoalItem,
  SHARED_MEDIA_UPDATED_EVENT
} from "../../services/sharedMediaAjarStorage";

interface MediaAjarViewProps {
  guruNama?: string;
  namaSekolah?: string;
  classes?: Kelas[];
}

type ActiveCategory = "overview" | "video" | "game" | "lms";
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

export interface LmsSoalItem {
  id: string;
  tipe: "pilihan_ganda" | "essay";
  pertanyaan: string;
  pilihan?: string[]; // for PG: 4 choices
  kunci?: number; // 0, 1, 2, 3
  kunciEssay?: string; // for Essay: pedoman penskoran / kunci jawaban
  pembahasan?: string;
  bobotNilai?: number;
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
  status: "Aktif" | "Draft";
  isCustom?: boolean;
  soalList?: LmsSoalItem[];
}

// STORAGE KEYS
const STORAGE_KEY_VIDEOS = "media_ajar_pai_videos_v3";
const STORAGE_KEY_QUIZZES = "media_ajar_pai_quizzes_v3";
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

const INITIAL_LMS: LmsPaket[] = [
  {
    id: "lms-7",
    kelas: "7",
    semester: "1",
    judul: "Paket CBT PAI Kelas VII: Sumatif Thaharah & Asmaul Husna",
    materi: "Thaharah & Akidah",
    deskripsi: "Ujian Berbasis Komputer (CBT) mencakup bank soal pilihan ganda, uraian essay, timer ujian, dan evaluasi otomatis.",
    videoCount: 2,
    kuisCount: 5,
    status: "Aktif"
  },
  {
    id: "lms-8",
    kelas: "8",
    semester: "1",
    judul: "Paket CBT PAI Kelas VIII: Sumatif Shalat Sunnah & Akhlak Terpuji",
    materi: "Fikih Ibadah & Akhlak",
    deskripsi: "Ujian Berbasis Komputer (CBT) shalat gerhana/istisqa, pencegahan khamr & judi online, dan rekap skor otomatis.",
    videoCount: 2,
    kuisCount: 5,
    status: "Aktif"
  },
  {
    id: "lms-9",
    kelas: "9",
    semester: "1",
    judul: "Paket CBT PAI Kelas IX: Sumatif Iman Hari Akhir & Fikih Qurban",
    materi: "Akidah & Fikih Ibadah",
    deskripsi: "Ujian Berbasis Komputer (CBT) asesmen sumatif akhir jenjang, pembahasan kiamat kubra, dan fikih penyembelihan qurban.",
    videoCount: 2,
    kuisCount: 5,
    status: "Aktif"
  }
];

export default function MediaAjarView({
  guruNama = "Sadiqul Alim, S.Pd.I.",
  namaSekolah = "UPT SMPN 2 REBANG TANGKAS",
  classes = []
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

  const [lmsList, setLmsList] = useState<LmsPaket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LMS);
      if (saved) {
        const parsed: LmsPaket[] = JSON.parse(saved);
        return parsed.map((item) => {
          const defaultCbt = INITIAL_LMS.find((d) => d.id === item.id);
          if (defaultCbt && item.judul.startsWith("Paket Pembelajaran PAI")) {
            return {
              ...item,
              judul: defaultCbt.judul,
              deskripsi: defaultCbt.deskripsi
            };
          }
          return item;
        });
      }
    } catch (e) {
      console.error("Error reading saved cbt:", e);
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

  // ==================== MODAL STATES ====================
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Currently Editing Item
  const [editingItemType, setEditingItemType] = useState<"video" | "game" | "lms">("video");
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [editingLms, setEditingLms] = useState<LmsPaket | null>(null);

  // ==================== WAYGROUND LMS INTERACTIVE STATES ====================
  const [gamePinInput, setGamePinInput] = useState<string>("");

  // 1. Wayground Live Game Arena Modal
  const [isWaygroundGameOpen, setIsWaygroundGameOpen] = useState<boolean>(false);
  const [waygroundGamePin, setWaygroundGamePin] = useState<string>("842 109");
  const [waygroundSelectedPaket, setWaygroundSelectedPaket] = useState<LmsPaket | null>(null);
  const [waygroundPhase, setWaygroundPhase] = useState<"lobby" | "game" | "podium">("lobby");
  const [waygroundQuestionIdx, setWaygroundQuestionIdx] = useState<number>(0);
  const [waygroundScore, setWaygroundScore] = useState<number>(0);
  const [waygroundStreak, setWaygroundStreak] = useState<number>(1);
  const [waygroundSelectedAns, setWaygroundSelectedAns] = useState<number | null>(null);
  const [waygroundSound, setWaygroundSound] = useState<boolean>(true);
  const [waygroundTimer, setWaygroundTimer] = useState<number>(20);
  const [waygroundCorrectCount, setWaygroundCorrectCount] = useState<number>(0);

  // 2. Wayground PR (Homework) Modal
  const [isAssignPrOpen, setIsAssignPrOpen] = useState<boolean>(false);
  const [assignPrPaket, setAssignPrPaket] = useState<LmsPaket | null>(null);
  const [assignPrKelas, setAssignPrKelas] = useState<"7" | "8" | "9">("7");
  const [assignPrDeadline, setAssignPrDeadline] = useState<string>("2026-11-20T23:59");
  const [assignPrAttempts, setAssignPrAttempts] = useState<string>("Bebas (Tanpa Batas)");
  const [assignPrShuffle, setAssignPrShuffle] = useState<boolean>(true);
  const [assignPrShowExplanations, setAssignPrShowExplanations] = useState<boolean>(true);

  // 3. Ruang Belajar Mandiri LMS (Digital Classroom) Modal
  const [isDigitalClassOpen, setIsDigitalClassOpen] = useState<boolean>(false);
  const [activeDigitalClassPaket, setActiveDigitalClassPaket] = useState<LmsPaket | null>(null);
  const [digitalClassActiveTab, setDigitalClassActiveTab] = useState<"modul" | "video" | "kuis" | "tugas">("modul");
  const [digitalClassQuizAnswers, setDigitalClassQuizAnswers] = useState<Record<number, number>>({});
  const [digitalClassQuizSubmitted, setDigitalClassQuizSubmitted] = useState<boolean>(false);

  // ==================== SHARE KE DASHBOARD SISWA STATES ====================
  const [sharedToSiswaList, setSharedToSiswaList] = useState<SharedMediaAjarItem[]>(() =>
    SharedMediaAjarStorage.getSharedItems()
  );
  const [sharedSubmissions, setSharedSubmissions] = useState<SharedMediaSubmission[]>(() =>
    SharedMediaAjarStorage.getSubmissions()
  );
  const [isShareSiswaModalOpen, setIsShareSiswaModalOpen] = useState<boolean>(false);
  const [isMonitorSharedModalOpen, setIsMonitorSharedModalOpen] = useState<boolean>(false);
  const [shareDraftType, setShareDraftType] = useState<"lms" | "game" | "video">("lms");
  const [shareDraftSourceId, setShareDraftSourceId] = useState<string>("");
  const [shareDraftJudul, setShareDraftJudul] = useState<string>("");
  const [shareDraftMateri, setShareDraftMateri] = useState<string>("");
  const [shareDraftDeskripsi, setShareDraftDeskripsi] = useState<string>("");
  const [shareDraftKelas, setShareDraftKelas] = useState<"SEMUA" | "7" | "8" | "9">("7");
  const [shareDraftRombel, setShareDraftRombel] = useState<string>("SEMUA");
  const [shareDraftDeadline, setShareDraftDeadline] = useState<string>("2026-11-20T23:59");
  const [shareDraftInstruksi, setShareDraftInstruksi] = useState<string>("");
  const [shareDraftVideoData, setShareDraftVideoData] = useState<VideoItem | null>(null);
  const [shareDraftSoalList, setShareDraftSoalList] = useState<SharedMediaSoalItem[]>([]);
  const [selectedMonitorMediaId, setSelectedMonitorMediaId] = useState<string>("");

  useEffect(() => {
    const syncShared = () => {
      setSharedToSiswaList(SharedMediaAjarStorage.getSharedItems());
      setSharedSubmissions(SharedMediaAjarStorage.getSubmissions());
    };
    window.addEventListener(SHARED_MEDIA_UPDATED_EVENT, syncShared);
    window.addEventListener("storage", syncShared);
    return () => {
      window.removeEventListener(SHARED_MEDIA_UPDATED_EVENT, syncShared);
      window.removeEventListener("storage", syncShared);
    };
  }, []);

  // ==================== LMS SOAL MANAGEMENT STATES (FOR EDIT MODAL) ====================
  const [lmsEditingSoalList, setLmsEditingSoalList] = useState<LmsSoalItem[]>([]);
  const [lmsActiveSoalTab, setLmsActiveSoalTab] = useState<"list" | "input" | "upload">("list");
  const [lmsFilterSoalType, setLmsFilterSoalType] = useState<"semua" | "pilihan_ganda" | "essay">("semua");
  const [isInlineAddingSoal, setIsInlineAddingSoal] = useState<boolean>(false);
  
  // New Question Form state
  const [lmsNewSoalType, setLmsNewSoalType] = useState<"pilihan_ganda" | "essay">("pilihan_ganda");
  const [lmsNewQuestion, setLmsNewQuestion] = useState<string>("");
  const [lmsNewOptions, setLmsNewOptions] = useState<string[]>(["", "", "", ""]);
  const [lmsNewKey, setLmsNewKey] = useState<number>(0);
  const [lmsNewEssayKey, setLmsNewEssayKey] = useState<string>("");
  const [lmsNewPembahasan, setLmsNewPembahasan] = useState<string>("");
  const [lmsNewBobot, setLmsNewBobot] = useState<number>(20);

  // Upload/Import Soal state
  const [lmsUploadText, setLmsUploadText] = useState<string>("");
  const [lmsUploadedFileName, setLmsUploadedFileName] = useState<string>("");

  // ==================== FORM INPUT / UPLOAD STATES ====================
  const [uploadCategory, setUploadCategory] = useState<"video" | "game" | "lms">("video");
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
  const [aiMediaType, setAiMediaType] = useState<"semua" | "video" | "game" | "lms">("semua");
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
  const handleOpenUploadModal = (category: "video" | "game" | "lms" = "video") => {
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
    } else if (uploadCategory === "lms") {
      const newLms: LmsPaket = {
        id: "lms-" + Date.now(),
        kelas: formKelas,
        semester: formSemester,
        judul: formJudul,
        materi: formMateri || "Materi PAI",
        deskripsi: formDeskripsi || "Paket Ujian Berbasis Komputer (CBT) PAI terpadu.",
        videoCount: 1,
        kuisCount: 5,
        status: "Aktif",
        isCustom: true
      };
      setLmsList([newLms, ...lmsList]);
      showToast(`Paket Ujian CBT Kelas ${formKelas} berhasil diterbitkan!`);
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
    } else if (editingItemType === "lms" && editingLms) {
      const updated = lmsList.map((l) =>
        l.id === editingLms.id
          ? {
              ...l,
              judul: formJudul,
              kelas: formKelas,
              semester: formSemester,
              materi: formMateri,
              deskripsi: formDeskripsi,
              soalList: lmsEditingSoalList,
              kuisCount: lmsEditingSoalList.length
            }
          : l
      );
      setLmsList(updated);
      showToast("Perubahan paket CBT & bank soal (PG & Essay) berhasil disimpan!");
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

  // Delete CBT
  const handleDeleteLms = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket Ujian CBT "${judul}"?`)) {
      const updated = lmsList.filter((l) => l.id !== id);
      setLmsList(updated);
      showToast(`Paket Ujian CBT berhasil dihapus!`);
    }
  };

  // Default Soal Generator for Class
  const getDefaultSoalForLms = (kelas: "7" | "8" | "9", materi: string): LmsSoalItem[] => {
    if (kelas === "7") {
      return [
        {
          id: "pg-7-1",
          tipe: "pilihan_ganda",
          pertanyaan: "Najis yang cara mensucikannya cukup dengan memercikkan air bersih ke bagian yang terkena najis adalah...",
          pilihan: ["Najis Mukhaffafah (Ringan)", "Najis Mutawassithah (Sedang)", "Najis Mughalladhah (Berat)", "Najis Hukmiyah"],
          kunci: 0,
          pembahasan: "HR. Abu Dawud & An-Nasa'i: Kencing bayi laki-laki yang belum makan makanan dipercikkan air."
        },
        {
          id: "pg-7-2",
          tipe: "pilihan_ganda",
          pertanyaan: "Makna Asmaul Husna Al-Alim dalam kehidupan sehari-hari mengajarkan kita untuk...",
          pilihan: ["Bersikap sombong atas ilmu", "Selalu jujur karena Allah Maha Mengetahui", "Menyembunyikan kebenaran", "Merasa paling pandai di kelas"],
          kunci: 1,
          pembahasan: "QS. Al-Baqarah: 29: Dan Dia Maha Mengetahui segala sesuatu."
        },
        {
          id: "pg-7-3",
          tipe: "pilihan_ganda",
          pertanyaan: "Alat bersuci pengganti air apabila sakit parah atau tidak ada air sama sekali adalah...",
          pilihan: ["Debu tanah yang suci (Tayamum)", "Kain basah bernoda", "Minyak wangi", "Air kelapa muda"],
          kunci: 0,
          pembahasan: "QS. Al-Maidah: 6: Maka bertayamumlah dengan debu yang baik (suci)..."
        },
        {
          id: "ess-7-1",
          tipe: "essay",
          pertanyaan: "Jelaskan perbedaan antara najis mukhaffafah, mutawassithah, dan mughalladhah beserta contoh dan cara mensucikannya!",
          kunciEssay: "Mukhaffafah (ringan): kencing bayi laki-laki ASI dipercikkan air. Mutawassithah (sedang): darah/kotoran dibasuh hingga hilang rasa, bau, warna. Mughalladhah (berat): liur anjing/babi dibasuh 7 kali salah satunya dengan tanah.",
          pembahasan: "Pedoman penskoran: Menyebutkan 3 jenis najis secara lengkap (skor 30), contoh (skor 30), cara bersuci (skor 40).",
          bobotNilai: 50
        },
        {
          id: "ess-7-2",
          tipe: "essay",
          pertanyaan: "Bagaimana cara seorang muslim menerapkan sikap muraqabah (merasa diawasi oleh Allah SWT) saat menghadapi ujian di sekolah?",
          kunciEssay: "Tidak menyontek, percaya pada kemampuan diri sendiri, senantiasa berbuat jujur walau pengawas tidak melihat karena yakin Allah Maha Melihat.",
          pembahasan: "Pedoman penskoran: Mengaitkan sikap muraqabah dengan kejujuran akademis.",
          bobotNilai: 50
        }
      ];
    } else if (kelas === "8") {
      return [
        {
          id: "pg-8-1",
          tipe: "pilihan_ganda",
          pertanyaan: "Shalat sunnah yang dikerjakan ketika terjadi fenomena gerhana bulan disebut shalat...",
          pilihan: ["Shalat Kusuf", "Shalat Khusuf", "Shalat Istisqa", "Shalat Tarawih"],
          kunci: 1,
          pembahasan: "HR. Bukhari & Muslim: Kusuf untuk gerhana matahari, sedangkan Khusuf untuk gerhana bulan."
        },
        {
          id: "pg-8-2",
          tipe: "pilihan_ganda",
          pertanyaan: "Hukum meminum minuman keras (khamr) dan bermain judi online dalam Islam menurut QS. Al-Maidah: 90 adalah...",
          pilihan: ["Makruh tanzih", "Haram mutlak perbuatan setan", "Mubah jika tidak mabuk", "Boleh untuk hiburan semata"],
          kunci: 1,
          pembahasan: "QS. Al-Maidah: 90: Khamr, judi, berhala adalah najis perbuatan setan, maka jauhilah."
        },
        {
          id: "ess-8-1",
          tipe: "essay",
          pertanyaan: "Uraikan 3 dampak negatif bahaya judi online dan minuman keras bagi masa depan generasi muda menurut pandangan Islam!",
          kunciEssay: "Merusak akal dan kesehatan fisik, menghancurkan masa depan finansial, serta memicu permusuhan dan kebencian antar sesama.",
          pembahasan: "Bobot nilai: 50 poin.",
          bobotNilai: 50
        },
        {
          id: "ess-8-2",
          tipe: "essay",
          pertanyaan: "Jelaskan tata cara pelaksanaan shalat sunnah gerhana bulan (khusuf) yang membedakannya dengan shalat sunnah biasa!",
          kunciEssay: "2 rakaat dengan 4 kali berdiri dan 4 kali ruku' (2 ruku' per rakaat), dianjurkan berjamaah dan diakhiri dengan khutbah.",
          pembahasan: "Bobot nilai: 50 poin.",
          bobotNilai: 50
        }
      ];
    } else {
      return [
        {
          id: "pg-9-1",
          tipe: "pilihan_ganda",
          pertanyaan: "Beriman kepada Hari Akhir (Hari Kiamat) menempati urutan rukun iman yang ke...",
          pilihan: ["Ketiga", "Keempat", "Kelima", "Keenam"],
          kunci: 2,
          pembahasan: "Hadis Jibril: Iman itu engkau percaya kepada Allah, Malaikat-Nya, Kitab-Nya, Rasul-Nya, Hari Akhir..."
        },
        {
          id: "pg-9-2",
          tipe: "pilihan_ganda",
          pertanyaan: "Waktu pelaksanaan penyembelihan hewan qurban yang disyariatkan dalam Islam adalah...",
          pilihan: ["10 Dzulhijjah & hari Tasyrik (11, 12, 13 Dzulhijjah)", "Hanya pada 1 Syawal", "Sepanjang bulan Ramadhan", "Malam tahun baru Hijriyah"],
          kunci: 0,
          pembahasan: "HR. Ahmad: Semua hari tasyrik adalah hari penyembelihan hewan qurban."
        },
        {
          id: "ess-9-1",
          tipe: "essay",
          pertanyaan: "Jelaskan tahapan peristiwa Hari Akhir mulai dari Yaumul Ba'ats hingga Yaumul Jaza'!",
          kunciEssay: "Yaumul Ba'ats (kebangkitan dari kubur), Yaumul Mahsyar (berkumpul di padang mahsyar), Yaumul Hisab (perhitungan amal), Yaumul Mizan (penimbangan amal), Shirath, dan Yaumul Jaza' (balasan surga/neraka).",
          pembahasan: "Bobot nilai: 50 poin.",
          bobotNilai: 50
        },
        {
          id: "ess-9-2",
          tipe: "essay",
          pertanyaan: "Sebutkan syarat-syarat sah hewan yang boleh dijadikan qurban menurut syariat Islam!",
          kunciEssay: "Termasuk hewan ternak (kambing, domba, sapi, kerbau, unta), cukup umur (musinnah), sehat tidak cacat (tidak buta, tidak pincang, tidak kurus kering).",
          pembahasan: "Bobot nilai: 50 poin.",
          bobotNilai: 50
        }
      ];
    }
  };

  // Edit LMS
  const handleEditLms = (item: LmsPaket) => {
    setEditingItemType("lms");
    setEditingLms(item);
    setFormKelas(item.kelas);
    setFormSemester(item.semester);
    setFormJudul(item.judul);
    setFormMateri(item.materi);
    setFormDeskripsi(item.deskripsi);

    // Load existing questions or initialize from default
    if (item.soalList && item.soalList.length > 0) {
      setLmsEditingSoalList([...item.soalList]);
    } else {
      setLmsEditingSoalList(getDefaultSoalForLms(item.kelas, item.materi));
    }

    setLmsActiveSoalTab("list");
    setLmsFilterSoalType("semua");
    setIsInlineAddingSoal(false);
    setLmsNewSoalType("pilihan_ganda");
    setLmsNewQuestion("");
    setLmsNewOptions(["", "", "", ""]);
    setLmsNewKey(0);
    setLmsNewEssayKey("");
    setLmsNewPembahasan("");
    setLmsNewBobot(20);
    setLmsUploadText("");
    setLmsUploadedFileName("");
    setIsEditModalOpen(true);
  };

  // Soal Management Handlers for LMS Edit
  const handleAddLmsSoal = () => {
    if (!lmsNewQuestion.trim()) {
      alert("Teks pertanyaan soal tidak boleh kosong!");
      return;
    }

    if (lmsNewSoalType === "pilihan_ganda") {
      const validOptions = lmsNewOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        alert("Pilihan Ganda harus memiliki minimal 2 pilihan jawaban yang terisi!");
        return;
      }
      const newSoal: LmsSoalItem = {
        id: "soal-" + Date.now(),
        tipe: "pilihan_ganda",
        pertanyaan: lmsNewQuestion.trim(),
        pilihan: lmsNewOptions.map((o, idx) => o.trim() || `Pilihan ${String.fromCharCode(65 + idx)}`),
        kunci: lmsNewKey,
        pembahasan: lmsNewPembahasan.trim() || "Pembahasan materi terpadu."
      };
      setLmsEditingSoalList([...lmsEditingSoalList, newSoal]);
      showToast("✓ Soal Pilihan Ganda berhasil ditambahkan ke bank soal!");
    } else {
      const newSoal: LmsSoalItem = {
        id: "essay-" + Date.now(),
        tipe: "essay",
        pertanyaan: lmsNewQuestion.trim(),
        kunciEssay: lmsNewEssayKey.trim() || "Pedoman penskoran / kunci jawaban uraian.",
        pembahasan: lmsNewPembahasan.trim() || "Rubrik kriteria penilaian.",
        bobotNilai: lmsNewBobot || 20
      };
      setLmsEditingSoalList([...lmsEditingSoalList, newSoal]);
      showToast("✓ Soal Essay / Uraian berhasil ditambahkan ke bank soal!");
    }

    // Reset inputs
    setLmsNewQuestion("");
    setLmsNewOptions(["", "", "", ""]);
    setLmsNewKey(0);
    setLmsNewEssayKey("");
    setLmsNewPembahasan("");
    setLmsActiveSoalTab("list");
    setIsInlineAddingSoal(false);
  };

  const handleDeleteLmsSoal = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus butir soal ini dari paket CBT?")) {
      setLmsEditingSoalList((prev) => prev.filter((s) => s.id !== id));
      showToast("Soal berhasil dihapus dari paket CBT.");
    }
  };

  const handleClearAllLmsSoal = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus SELURUH soal (Pilihan Ganda & Essay) dalam paket ini?")) {
      setLmsEditingSoalList([]);
      showToast("Seluruh soal dalam paket telah dikosongkan.");
    }
  };

  const handleFileUploadSoal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLmsUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setLmsUploadText(content);
        showToast(`Berkas ${file.name} berhasil dibaca! Klik 'Proses & Impor' untuk memasukkan.`);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessUploadSoal = () => {
    if (!lmsUploadText.trim()) {
      alert("Silakan pilih berkas atau tempel teks naskah soal terlebih dahulu!");
      return;
    }

    try {
      // 1. Try parsing JSON
      if (lmsUploadText.trim().startsWith("[") || lmsUploadText.trim().startsWith("{")) {
        const parsed = JSON.parse(lmsUploadText);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        const newItems: LmsSoalItem[] = items.map((item, idx) => ({
          id: "imp-" + Date.now() + "-" + idx,
          tipe: item.tipe === "essay" ? "essay" : "pilihan_ganda",
          pertanyaan: item.pertanyaan || item.soal || `Soal ${idx + 1}`,
          pilihan: Array.isArray(item.pilihan) ? item.pilihan : ["A", "B", "C", "D"],
          kunci: typeof item.kunci === "number" ? item.kunci : 0,
          kunciEssay: item.kunciEssay || item.jawaban || "",
          pembahasan: item.pembahasan || item.dalil || "",
          bobotNilai: item.bobotNilai || 20
        }));
        setLmsEditingSoalList([...lmsEditingSoalList, ...newItems]);
        showToast(`✓ Berhasil mengimpor ${newItems.length} butir soal dari JSON!`);
        setLmsActiveSoalTab("list");
        return;
      }
    } catch {
      // Fallback to text parsing
    }

    // 2. Parse plain text line by line
    const lines = lmsUploadText.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsedItems: LmsSoalItem[] = [];
    let currentSoal: Partial<LmsSoalItem> | null = null;
    let currentOptions: string[] = [];

    const flushCurrent = () => {
      if (currentSoal && currentSoal.pertanyaan) {
        if (currentSoal.tipe === "essay") {
          parsedItems.push({
            id: "imp-ess-" + Date.now() + "-" + parsedItems.length,
            tipe: "essay",
            pertanyaan: currentSoal.pertanyaan,
            kunciEssay: currentSoal.kunciEssay || "Kunci uraian pedoman penskoran.",
            pembahasan: currentSoal.pembahasan || "",
            bobotNilai: 20
          });
        } else {
          parsedItems.push({
            id: "imp-pg-" + Date.now() + "-" + parsedItems.length,
            tipe: "pilihan_ganda",
            pertanyaan: currentSoal.pertanyaan,
            pilihan: currentOptions.length >= 2 ? currentOptions : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
            kunci: currentSoal.kunci ?? 0,
            pembahasan: currentSoal.pembahasan || ""
          });
        }
      }
      currentSoal = null;
      currentOptions = [];
    };

    for (const line of lines) {
      if (line.toUpperCase().includes("[ESSAY]") || line.toUpperCase().includes("[URAIAN]")) {
        flushCurrent();
        currentSoal = { tipe: "essay", pertanyaan: line.replace(/\[ESSAY\]|\[URAIAN\]/gi, "").trim() };
      } else if (/^\d+[\.\)]\s*/.test(line)) {
        flushCurrent();
        currentSoal = {
          tipe: "pilihan_ganda",
          pertanyaan: line.replace(/^\d+[\.\)]\s*/, "").trim()
        };
      } else if (/^[A-Da-d][\.\)]\s*/.test(line)) {
        const optText = line.replace(/^[A-Da-d][\.\)]\s*/, "").trim();
        currentOptions.push(optText);
      } else if (line.toUpperCase().startsWith("KUNCI:") || line.toUpperCase().startsWith("JAWABAN:")) {
        const val = line.replace(/^(KUNCI|JAWABAN):\s*/i, "").trim().toUpperCase();
        if (currentSoal?.tipe === "essay") {
          currentSoal.kunciEssay = val;
        } else {
          const mapKey: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          currentSoal = { ...currentSoal, kunci: mapKey[val] ?? 0 };
        }
      } else if (line.toUpperCase().startsWith("PEMBAHASAN:")) {
        const exp = line.replace(/^PEMBAHASAN:\s*/i, "").trim();
        currentSoal = { ...currentSoal, pembahasan: exp };
      } else if (currentSoal) {
        currentSoal.pertanyaan += " " + line;
      }
    }
    flushCurrent();

    if (parsedItems.length > 0) {
      setLmsEditingSoalList([...lmsEditingSoalList, ...parsedItems]);
      showToast(`✓ Berhasil mengimpor ${parsedItems.length} butir soal ke paket LMS!`);
      setLmsActiveSoalTab("list");
      setLmsUploadText("");
      setLmsUploadedFileName("");
    } else {
      alert("Format teks tidak terdeteksi. Gunakan format '1. Pertanyaan ... A. ... B. ... Kunci: A' atau [ESSAY] untuk soal essay.");
    }
  };

  // Retrieve dynamic curriculum questions for Wayground Game
  const waygroundQuestions = useMemo(() => {
    // Check if package has custom questions in soalList
    const customPg = waygroundSelectedPaket?.soalList?.filter((s) => s.tipe === "pilihan_ganda");
    if (customPg && customPg.length > 0) {
      return customPg.map((s, idx) => ({
        id: idx + 1,
        q: s.pertanyaan,
        options: s.pilihan && s.pilihan.length >= 2 ? s.pilihan : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        key: typeof s.kunci === "number" ? s.kunci : 0,
        dalil: s.pembahasan || "Dalil Naqli Kurikulum Merdeka",
        exp: s.pembahasan || "Pembahasan materi terpadu."
      }));
    }

    const k = waygroundSelectedPaket?.kelas || "7";
    if (k === "7") {
      return [
        {
          id: 1,
          q: "Najis yang cara mensucikannya cukup dengan memercikkan air bersih ke bagian yang terkena najis adalah...",
          options: ["Najis Mukhaffafah (Ringan)", "Najis Mutawassithah (Sedang)", "Najis Mughalladhah (Berat)", "Najis Hukmiyah"],
          key: 0,
          dalil: "HR. Abu Dawud & An-Nasa'i: Kencing bayi laki-laki yang belum makan makanan dipercikkan.",
          exp: "Air kencing bayi laki-laki berusia di bawah 2 tahun yang hanya minum ASI termasuk najis mukhaffafah."
        },
        {
          id: 2,
          q: "Makna Asmaul Husna Al-Alim dalam kehidupan sehari-hari mengajarkan kita untuk...",
          options: ["Bersikap sombong atas ilmu", "Selalu jujur karena Allah Maha Mengetahui", "Menyembunyikan kebenaran", "Merasa paling pandai di kelas"],
          key: 1,
          dalil: "QS. Al-Baqarah: 29: Dan Dia Maha Mengetahui segala sesuatu.",
          exp: "Al-Alim berarti Allah Maha Mengetahui segala rahasia di langit dan bumi, menumbuhkan integritas dan kejujuran."
        },
        {
          id: 3,
          q: "Sikap muraqabah yang lahir dari pemahaman Asmaul Husna As-Sami' dan Al-Bashir adalah...",
          options: ["Berbicara tanpa dipikirkan", "Takut berbuat maksiat walau sendirian", "Pamer ibadah di media sosial", "Menghakimi teman"],
          key: 1,
          dalil: "QS. Al-Hujurat: 1: Sesungguhnya Allah Maha Mendengar lagi Maha Mengetahui.",
          exp: "Muraqabah adalah keyakinan teguh bahwa Allah senantiasa mendengar ucapan dan melihat gerak-gerik hamba-Nya."
        },
        {
          id: 4,
          q: "Alat bersuci pengganti air apabila sakit parah atau tidak ada air sama sekali adalah...",
          options: ["Debu tanah yang suci (Tayamum)", "Kain basah bernoda", "Minyak wangi", "Air kelapa muda"],
          key: 0,
          dalil: "QS. Al-Maidah: 6: Maka bertayamumlah dengan debu yang baik (suci)...",
          exp: "Tayamum merupakan rukhshah (keringanan) dari Allah SWT menggunakan debu suci."
        },
        {
          id: 5,
          q: "Hukum bersuci (thaharah) dari hadas besar sebelum melaksanakan ibadah shalat fardhu adalah...",
          options: ["Sunnah muakkadah", "Fardhu / Wajib mutlak", "Mubah jika sempat", "Makruh bila terlambat"],
          key: 1,
          dalil: "QS. Al-Maidah: 6: Dan jika kamu junub maka mandilah...",
          exp: "Suci dari hadas besar dan kecil merupakan syarat sah mutlak dalam menjalankan shalat."
        }
      ];
    } else if (k === "8") {
      return [
        {
          id: 1,
          q: "Shalat sunnah yang dikerjakan ketika terjadi fenomena gerhana bulan disebut shalat...",
          options: ["Shalat Kusuf", "Shalat Khusuf", "Shalat Istisqa", "Shalat Tarawih"],
          key: 1,
          dalil: "HR. Bukhari & Muslim: Sesungguhnya matahari dan bulan adalah tanda kekuasaan Allah...",
          exp: "Kusuf untuk gerhana matahari, sedangkan Khusuf untuk gerhana bulan."
        },
        {
          id: 2,
          q: "Hukum meminum minuman keras (khamr) dan bermain judi online dalam Islam menurut QS. Al-Maidah: 90 adalah...",
          options: ["Makruh tanzih", "Haram mutlak perbuatan setan", "Mubah jika tidak mabuk", "Boleh untuk hiburan semata"],
          key: 1,
          dalil: "QS. Al-Maidah: 90: Khamr, judi, berkorban untuk berhala adalah najis perbuatan setan.",
          exp: "Khamr dan judi merusak akal budi dan memicu permusuhan antar sesama manusia."
        },
        {
          id: 3,
          q: "Shalat sunnah dua rakaat yang dianjurkan untuk memohon turunnya hujan saat kemarau berkepanjangan adalah...",
          options: ["Shalat Istisqa", "Shalat Hajat", "Shalat Dhuha", "Shalat Tahajjud"],
          key: 0,
          dalil: "HR. Bukhari: Rasulullah SAW keluar ke tanah lapang lalu memohon hujan...",
          exp: "Shalat Istisqa disertai khutbah dan anjuran memperbanyak istighfar kepada Allah SWT."
        },
        {
          id: 4,
          q: "Ciri khas pengerjaan shalat sunnah gerhana yang membedakannya dari shalat sunnah biasa adalah...",
          options: ["Memiliki 2 kali ruku' dalam tiap rakaat", "Dikerjakan sambil berlari", "Tanpa membaca Surah Al-Fatihah", "Tidak ada sujud"],
          key: 0,
          dalil: "HR. Muslim: Rasulullah SAW shalat gerhana 2 rakaat dengan 4 kali ruku' dan 4 kali sujud.",
          exp: "Setiap rakaat shalat gerhana memiliki 2 kali berdiri dan 2 kali ruku'."
        },
        {
          id: 5,
          q: "Sikap terpuji yang wajib ditunjukkan seorang muslim ketika menghadapi perselisihan adalah...",
          options: ["Memperkeruh suasana", "Mengutamakan tabayyun dan musyawarah damai", "Membalas dengan kekerasan", "Membuat provokasi"],
          key: 1,
          dalil: "QS. Al-Hujurat: 9: Damaikanlah antara kedua saudaramu yang berselisih...",
          exp: "Tabayyun (klarifikasi) mencegah fitnah dan menjaga ukhuwah islamiyah."
        }
      ];
    } else {
      return [
        {
          id: 1,
          q: "Beriman kepada Hari Akhir (Hari Kiamat) menempati urutan rukun iman yang ke...",
          options: ["Ketiga", "Keempat", "Kelima", "Keenam"],
          key: 2,
          dalil: "Hadis Jibril: Iman itu engkau percaya kepada Allah, Malaikat-Nya, Kitab-Nya, Rasul-Nya, Hari Akhir...",
          exp: "Rukun Iman ke-5 adalah iman kepada Hari Akhir."
        },
        {
          id: 2,
          q: "Peristiwa dibangkitkannya seluruh manusia dari alam kubur setelah tiupan sangkakala malaikat Israfil disebut...",
          options: ["Yaumul Ba'ats", "Yaumul Mahsyar", "Yaumul Mizan", "Yaumul Jaza'"],
          key: 0,
          dalil: "QS. Yasin: 51: Dan ditiuplah sangkakala, maka tiba-tiba mereka keluar dari kuburnya...",
          exp: "Yaumul Ba'ats adalah hari kebangkitan seluruh manusia dari alam kubur."
        },
        {
          id: 3,
          q: "Waktu penyembelihan hewan qurban yang disyariatkan dalam Islam adalah...",
          options: ["10 Dzulhijjah & hari Tasyrik (11, 12, 13 Dzulhijjah)", "Hanya pada 1 Syawal", "Sepanjang bulan Ramadhan", "Malam tahun baru Hijriyah"],
          key: 0,
          dalil: "HR. Ahmad: Semua hari tasyrik adalah hari penyembelihan.",
          exp: "Penyembelihan qurban sah sejak selesai shalat Idul Adha (10 Dzulhijjah) hingga terbenam matahari 13 Dzulhijjah."
        },
        {
          id: 4,
          q: "Timbangan amal perbuatan manusia yang sangat adil di akhirat dinamakan...",
          options: ["Shirath", "Mizan", "Mahsyar", "Hisab"],
          key: 1,
          dalil: "QS. Al-Anbiya: 47: Dan Kami akan meletakkan timbangan yang adil pada hari kiamat...",
          exp: "Mizan adalah timbangan amal kebaikan dan keburukan."
        },
        {
          id: 5,
          q: "Dampak positif meyakini adanya Hari Pembalasan dalam perilaku remaja sehari-hari adalah...",
          options: ["Bersikap malas belajar", "Menghargai waktu dan rajin beramal saleh", "Mengejar kesenangan duniawi tanpa batas", "Pesimis dan takut bergaul"],
          key: 1,
          dalil: "QS. Al-Zalzalah: 7: Barangsiapa mengerjakan kebaikan seberat zarrah dia akan melihatnya.",
          exp: "Iman Hari Akhir melahirkan motivasi tinggi berbuat kebajikan dan berakhlak mulia."
        }
      ];
    }
  }, [waygroundSelectedPaket?.kelas]);

  // Wayground Timer Countdown Effect
  useEffect(() => {
    let timerInterval: any = null;
    if (isWaygroundGameOpen && waygroundPhase === "game" && waygroundSelectedAns === null && waygroundTimer > 0) {
      timerInterval = setInterval(() => {
        setWaygroundTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setWaygroundSelectedAns(-1);
            setWaygroundStreak(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isWaygroundGameOpen, waygroundPhase, waygroundSelectedAns, waygroundTimer]);

  // Wayground Button Actions
  const handleStartLiveGame = (paket?: LmsPaket, customPin?: string) => {
    const targetPaket = paket || lmsList[0] || INITIAL_LMS[0];
    const generatedPin = customPin || `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    setWaygroundSelectedPaket(targetPaket);
    setWaygroundGamePin(generatedPin);
    setWaygroundPhase("lobby");
    setWaygroundQuestionIdx(0);
    setWaygroundScore(0);
    setWaygroundStreak(1);
    setWaygroundSelectedAns(null);
    setWaygroundCorrectCount(0);
    setWaygroundTimer(20);
    setIsWaygroundGameOpen(true);
  };

  const handleJoinGamePin = () => {
    const cleanPin = gamePinInput.trim() || "842 109";
    const matchedPaket = lmsList.find((l) => l.kelas === "7") || lmsList[0] || INITIAL_LMS[0];
    handleStartLiveGame(matchedPaket, cleanPin);
    setGamePinInput("");
  };

  const handleStartGameplay = () => {
    setWaygroundPhase("game");
    setWaygroundQuestionIdx(0);
    setWaygroundSelectedAns(null);
    setWaygroundTimer(20);
  };

  const handleSelectWaygroundAnswer = (idx: number) => {
    if (waygroundSelectedAns !== null) return;
    setWaygroundSelectedAns(idx);
    const currQ = waygroundQuestions[waygroundQuestionIdx];
    if (idx === currQ.key) {
      const addedScore = 800 + (waygroundTimer * 15) + (waygroundStreak * 200);
      setWaygroundScore((prev) => prev + addedScore);
      setWaygroundStreak((prev) => prev + 1);
      setWaygroundCorrectCount((prev) => prev + 1);
    } else {
      setWaygroundStreak(1);
    }
  };

  const handleNextWaygroundQuestion = () => {
    if (waygroundQuestionIdx + 1 < waygroundQuestions.length) {
      setWaygroundQuestionIdx((prev) => prev + 1);
      setWaygroundSelectedAns(null);
      setWaygroundTimer(20);
    } else {
      setWaygroundPhase("podium");
    }
  };

  const getLmsQuestionsSnapshot = (paket: LmsPaket): SharedMediaSoalItem[] => {
    if (paket.soalList && paket.soalList.length > 0) {
      return paket.soalList.map((s) => ({
        id: s.id,
        tipe: s.tipe,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        kunci: s.kunci,
        kunciEssay: s.kunciEssay,
        pembahasan: s.pembahasan,
        bobotNilai: s.bobotNilai
      }));
    }
    return getDefaultSoalForLms(paket.kelas, paket.materi).map((s) => ({
      id: s.id,
      tipe: s.tipe,
      pertanyaan: s.pertanyaan,
      pilihan: s.pilihan,
      kunci: s.kunci,
      kunciEssay: s.kunciEssay,
      pembahasan: s.pembahasan,
      bobotNilai: s.bobotNilai
    }));
  };

  const handleOpenShareLms = (paket: LmsPaket) => {
    setShareDraftType("lms");
    setShareDraftSourceId(paket.id);
    setShareDraftJudul(paket.judul);
    setShareDraftMateri(paket.materi);
    setShareDraftDeskripsi(paket.deskripsi);
    setShareDraftKelas(paket.kelas);
    setShareDraftRombel("SEMUA");
    setShareDraftDeadline("2026-11-20T23:59");
    setShareDraftInstruksi(
      `Silakan kerjakan Ujian CBT PAI "${paket.judul}" dengan jujur dan teliti. Baca dalil serta pembahasan setelah menjawab!`
    );
    setShareDraftVideoData(null);
    setShareDraftSoalList(getLmsQuestionsSnapshot(paket));
    setIsShareSiswaModalOpen(true);
  };

  const handleOpenShareVideo = (vid: VideoItem) => {
    setShareDraftType("video");
    setShareDraftSourceId(vid.id);
    setShareDraftJudul(vid.judul);
    setShareDraftMateri(vid.materi);
    setShareDraftDeskripsi(vid.naskah);
    setShareDraftKelas(vid.kelas);
    setShareDraftRombel("SEMUA");
    setShareDraftDeadline("2026-11-20T23:59");
    setShareDraftInstruksi(
      `Tonton video pembelajaran materi "${vid.materi}" sampai selesai, pahami dalil ${vid.dalil}, lalu tuliskan poin penting / hikmah yang kamu pelajari.`
    );
    setShareDraftVideoData(vid);
    setShareDraftSoalList([]);
    setIsShareSiswaModalOpen(true);
  };

  const handleOpenShareGame = () => {
    const activeQs = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;
    const targetKls: "SEMUA" | "7" | "8" | "9" = selectedKelas;
    setShareDraftType("game");
    setShareDraftSourceId(`game-${targetKls}`);
    setShareDraftJudul(
      `Game Kuis Edukasi PAI ${targetKls === "SEMUA" ? "SMP (Kelas 7, 8, 9)" : `Kelas ${targetKls} SMP`}`
    );
    setShareDraftMateri("Kuis Interaktif & Trivia PAI");
    setShareDraftDeskripsi(
      `Tantangan Game Kuis PAI berisi ${activeQs.length} butir soal pilihan ganda lengkap dengan timer dan pembahasan dalil.`
    );
    setShareDraftKelas(targetKls);
    setShareDraftRombel("SEMUA");
    setShareDraftDeadline("2026-11-20T23:59");
    setShareDraftInstruksi(
      `Mainkan Game Kuis PAI dengan cepat dan tepat untuk meraih poin tertinggi serta melatih pemahaman materi!`
    );
    setShareDraftVideoData(null);
    setShareDraftSoalList(
      activeQs.map((q) => ({
        id: String(q.id),
        tipe: "pilihan_ganda" as const,
        pertanyaan: q.pertanyaan,
        pilihan: q.pilihan,
        kunci: q.kunci,
        pembahasan: q.pembahasan
      }))
    );
    setIsShareSiswaModalOpen(true);
  };

  const handleConfirmShareToSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareDraftJudul.trim()) {
      alert("Harap isi judul tugas/media ajar!");
      return;
    }

    const newItem: SharedMediaAjarItem = {
      id: `shared-${shareDraftType}-${Date.now()}`,
      sourceId: shareDraftSourceId,
      type: shareDraftType,
      judul: shareDraftJudul.trim(),
      materi: shareDraftMateri.trim() || "Pendidikan Agama Islam",
      deskripsi: shareDraftDeskripsi.trim(),
      kelasTarget: shareDraftKelas,
      rombelTarget: shareDraftRombel || "SEMUA",
      deadline: shareDraftDeadline,
      instruksiGuru: shareDraftInstruksi.trim(),
      guruNama,
      sharedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      modeMain:
        shareDraftType === "video"
          ? "tonton_video"
          : shareDraftType === "game"
          ? "play_game"
          : "kerjakan_soal",
      showExplanations: true,
      videoData: shareDraftVideoData
        ? {
            durasi: shareDraftVideoData.durasi,
            dalil: shareDraftVideoData.dalil,
            terjemahan: shareDraftVideoData.terjemahan,
            naskah: shareDraftVideoData.naskah,
            videoUrl: shareDraftVideoData.videoUrl
          }
        : undefined,
      soalList: shareDraftSoalList
    };

    const updated = SharedMediaAjarStorage.shareItem(newItem);
    setSharedToSiswaList(updated);
    setIsShareSiswaModalOpen(false);
    showToast(
      `🚀 "${newItem.judul}" berhasil dibagikan ke Dashboard Siswa (${
        shareDraftRombel !== "SEMUA"
          ? `Kelas ${shareDraftRombel}`
          : shareDraftKelas === "SEMUA"
          ? "Semua Kelas"
          : `Kelas ${shareDraftKelas} SMP`
      })!`
    );
  };

  const handleUnshareFromSiswa = (id: string, judul: string) => {
    if (window.confirm(`Tarik/hapus "${judul}" dari Dashboard Siswa?`)) {
      const updated = SharedMediaAjarStorage.unshareItem(id);
      setSharedToSiswaList(updated);
      showToast(`Media "${judul}" ditarik dari Dashboard Siswa.`);
    }
  };

  const handleOpenAssignPr = (paket: LmsPaket) => {
    setAssignPrPaket(paket);
    setAssignPrKelas(paket.kelas);
    setIsAssignPrOpen(true);
  };

  const handleConfirmAssignPr = () => {
    if (!assignPrPaket) return;
    const soalSnapshot = getLmsQuestionsSnapshot(assignPrPaket);
    const sharedPrItem: SharedMediaAjarItem = {
      id: `shared-pr-${Date.now()}`,
      sourceId: assignPrPaket.id,
      type: "lms",
      judul: assignPrPaket.judul,
      materi: assignPrPaket.materi,
      deskripsi: assignPrPaket.deskripsi,
      kelasTarget: assignPrKelas,
      rombelTarget: "SEMUA",
      semester: assignPrPaket.semester,
      deadline: assignPrDeadline,
      instruksiGuru: `Ujian CBT PAI (${assignPrAttempts}). Kerjakan ${soalSnapshot.length} butir soal dengan jujur dan teliti!`,
      guruNama,
      sharedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      modeMain: "kerjakan_soal",
      shuffleQuestions: assignPrShuffle,
      showExplanations: assignPrShowExplanations,
      attemptsLimit: assignPrAttempts,
      soalList: soalSnapshot
    };
    const updated = SharedMediaAjarStorage.shareItem(sharedPrItem);
    setSharedToSiswaList(updated);
    setIsAssignPrOpen(false);
    showToast(
      `🚀 Ujian CBT "${assignPrPaket.judul}" berhasil diterbitkan & langsung tampil di Dashboard Siswa Kelas ${assignPrKelas} SMP!`
    );
  };

  const handleOpenDigitalClass = (paket: LmsPaket) => {
    setActiveDigitalClassPaket(paket);
    setDigitalClassActiveTab("modul");
    setDigitalClassQuizAnswers({});
    setDigitalClassQuizSubmitted(false);
    setIsDigitalClassOpen(true);
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
      setAiStep(`Merancang media terpadu: Naskah Video Pembelajaran, 5 Soal Game Kuis, & Paket Ujian CBT...`);
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

      // 3. Create AI CBT
      if (aiMediaType === "semua" || aiMediaType === "lms") {
        const generatedLms: LmsPaket = {
          id: `ai-lms-${timestamp}`,
          kelas: aiKelas,
          semester: aiSemester,
          judul: `[AI] Paket Ujian CBT: ${topic}`,
          materi: topic,
          deskripsi: `Paket Ujian Berbasis Komputer (CBT) Kurikulum Merdeka PAI Kelas ${aiKelas} SMP semester ${aiSemester}.`,
          videoCount: 2,
          kuisCount: 5,
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
            Pusat terpadu Video Pembelajaran Interaktif, Game Edukasi Islami, dan CBT (Computer Based Test).
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

          {/* Tombol Monitor Media Dishare ke Dashboard Siswa */}
          <button
            type="button"
            onClick={() => {
              setSelectedMonitorMediaId(sharedToSiswaList[0]?.id || "");
              setIsMonitorSharedModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Dishare ke Siswa ({sharedToSiswaList.length})</span>
            {sharedSubmissions.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {sharedSubmissions.length}
              </span>
            )}
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

      {/* 3. 3 MAIN CATEGORY SHOWCASE CARDS (VIDEO, GAME, LMS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

        {/* Card 3: CBT (Computer Based Test) PAI */}
        <div
          onClick={() => setActiveCategory("lms")}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            activeCategory === "lms"
              ? "bg-purple-50/90 border-[#8854c0] shadow-md ring-2 ring-[#8854c0]/50"
              : "bg-white border-purple-200/80 hover:border-[#8854c0] hover:shadow-md"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5a2ea6] to-[#46178f] text-white flex items-center justify-center shadow-md shadow-purple-600/25 group-hover:scale-105 transition transform">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                Ujian CBT
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#46178f] transition">
                CBT PAI (COMPUTER BASED TEST)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sistem Ujian Berbasis Komputer (CBT), Token ruang ujian, bank soal Pilihan Ganda & Essay, serta rekap nilai otomatis.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1 text-[9px] font-bold text-purple-900">
              <span className="bg-purple-100/80 px-2 py-0.5 rounded">🖥️ Token Ruang CBT</span>
              <span className="bg-purple-100/80 px-2 py-0.5 rounded">📝 PG & Essay Otomatis</span>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100 mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900">Buka Ujian CBT ({filteredLms.length})</span>
            <div className="w-7 h-7 rounded-full bg-purple-100 group-hover:bg-[#46178f] group-hover:text-white text-purple-800 flex items-center justify-center transition">
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
                    <button
                      type="button"
                      onClick={() => handleOpenShareVideo(activeVideo)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share ke Dashboard Siswa</span>
                    </button>
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

                    {/* Quick Share, Edit & Delete Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenShareVideo(item);
                        }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                        title="Share Video ke Dashboard Siswa"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
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

            {/* Game Action Controls: Share, Tambah Soal & Edit */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenShareGame}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#46178f] to-indigo-700 hover:from-[#381273] hover:to-indigo-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Share Game ke Dashboard Siswa</span>
              </button>

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
      {/* SECTION 4: CBT (COMPUTER BASED TEST) PAI                  */}
      {/* ========================================================= */}
      {(activeCategory === "lms" || activeCategory === "overview") && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/20 via-white to-white border border-purple-200/90 shadow-md space-y-6">
          {/* CBT Banner & Fast Token Bar */}
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#29084e] via-[#46178f] to-[#1c0535] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="relative z-10 space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CBT PAI • COMPUTER BASED TEST</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Sistem Ujian Berbasis Komputer (CBT) PAI
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Kelola asesmen & ujian digital berbasis komputer: terbitkan Token Ruang CBT, tugaskan ujian berbatas waktu, kelola bank soal Pilihan Ganda & Essay, serta pantau hasil skor siswa secara langsung.
              </p>
            </div>

            {/* Fast Token Joiner Box */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] uppercase font-black text-amber-300 block">🖥️ Masuk Ruang CBT</span>
                <span className="text-xs text-purple-200">Masukkan 6 Digit Token CBT</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  maxLength={7}
                  value={gamePinInput}
                  onChange={(e) => setGamePinInput(e.target.value)}
                  placeholder="842 109"
                  className="w-32 bg-white text-slate-950 font-black tracking-widest text-center text-sm py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJoinGamePin();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleJoinGamePin}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0 active:scale-95"
                >
                  Masuk CBT
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                Daftar Paket Ujian CBT PAI (Kelas 7, 8, & 9 SMP)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#46178f] font-extrabold text-[10px]">
                {filteredLms.length} Paket CBT
              </span>
              <button
                type="button"
                onClick={() => handleStartLiveGame()}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-[10px] rounded-lg border border-amber-300 flex items-center gap-1 transition"
              >
                <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>Simulasi CBT Cepat</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenUploadModal("lms")}
                className="px-3.5 py-2 bg-[#46178f] hover:bg-[#5a2ea6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Terbitkan Paket CBT Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/cbt/pai?sekolah=UPT_SMPN_2_REBANG_TANGKAS`;
                  navigator.clipboard.writeText(url);
                  showToast("Tautan Ujian CBT PAI berhasil disalin ke clipboard!");
                }}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#46178f] border border-purple-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-700" />
                <span>Salin Tautan CBT</span>
              </button>
            </div>
          </div>

          {/* CBT Modules Grid per Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLms.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white border-2 border-purple-100 hover:border-[#8854c0] hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-xs"
              >
                {/* Card Top Banner */}
                <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-[#46178f] text-white font-black text-[10px] shadow-xs">
                      Kelas {item.kelas} SMP
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ● {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditLms(item)}
                      className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                      title="Edit Paket CBT"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLms(item.id, item.judul)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Paket CBT"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-[#46178f] transition line-clamp-1">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* CBT Metric Boxes */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-100">
                      <span className="text-[10px] text-purple-700 font-bold block">⏱️ Sesi & Materi</span>
                      <strong className="text-xs text-slate-900">{item.videoCount} Paket Sesi</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold block">📝 Bank Soal CBT</span>
                        <strong className="text-xs text-slate-900">{item.kuisCount || 5} Soal PG/Essay</strong>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLms(item);
                          setIsInlineAddingSoal(true);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-[10px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Buka Bank Soal CBT & Tambah Soal untuk Paket Ini"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Soal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-purple-900">🖥️ Token & Penugasan CBT</span>
                    <span className="font-bold text-emerald-600">🎯 Skor Otomatis</span>
                  </div>
                </div>

                {/* CBT Action Buttons */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartLiveGame(item)}
                      className="py-2.5 px-3 bg-[#46178f] hover:bg-[#5a2ea6] text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Simulasi CBT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignPr(item)}
                      className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Tugaskan CBT</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDigitalClass(item)}
                    className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-[#46178f] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-purple-200 active:scale-98"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Preview Ruang CBT</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenShareLms(item)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Share ke Dashboard Siswa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL SIMULASI CBT LIVE (TOKEN & ARENA UJIAN)             */}
      {/* ========================================================= */}
      {isWaygroundGameOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-gradient-to-br from-[#1d0637] via-[#2d0a57] to-[#120224] text-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border-2 border-purple-500/40 space-y-6 my-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/30 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                      SIMULASI CBT LIVE
                    </span>
                    <span className="text-xs text-purple-300">
                      Kelas {waygroundSelectedPaket?.kelas || "7"} SMP
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {waygroundSelectedPaket?.judul || "Paket Ujian CBT PAI"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWaygroundSound(!waygroundSound)}
                  className={`p-2 rounded-xl border transition ${
                    waygroundSound
                      ? "bg-purple-900/60 border-purple-400/40 text-purple-200"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                  title={waygroundSound ? "Suara Aktif" : "Suara Dibisukan"}
                >
                  {waygroundSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaygroundGameOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-sm cursor-pointer"
                  title="Tutup Arena"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PHASE 1: LOBBY / RUANG TUNGGU CBT */}
            {waygroundPhase === "lobby" && (
              <div className="space-y-6 text-center py-4 relative z-10">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-purple-300 font-extrabold block">
                    Beri Tahu Siswa untuk Membuka Aplikasi & Masukkan Token CBT:
                  </span>
                  <div className="inline-block p-4 sm:p-5 rounded-3xl bg-white/10 border-2 border-amber-400/50 backdrop-blur-md shadow-2xl">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-amber-300 font-mono select-all">
                      {waygroundGamePin}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(waygroundGamePin.replace(/\s+/g, ""));
                      showToast(`Kode Token CBT ${waygroundGamePin} berhasil disalin!`);
                    }}
                    className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400/40 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Token CBT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const link = `${window.location.origin}/cbt/join?token=${waygroundGamePin.replace(/\s+/g, "")}`;
                      navigator.clipboard.writeText(link);
                      showToast("Tautan langsung ruang ujian CBT berhasil disalin!");
                    }}
                    className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400/40 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Salin Link Ruang CBT</span>
                  </button>
                  {waygroundSelectedPaket && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsWaygroundGameOpen(false);
                        handleOpenShareLms(waygroundSelectedPaket);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share ke Dashboard Siswa</span>
                    </button>
                  )}
                </div>

                {/* Joined Participants Avatar List */}
                <div className="p-4 rounded-2xl bg-black/30 border border-purple-500/20 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      5 Siswa Siap di Ruang Tunggu CBT:
                    </span>
                    <span className="text-[11px] text-emerald-400 font-black animate-pulse">● Siap Ujian</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Ahmad Fauzi", kls: "7A", bg: "bg-emerald-500/20 border-emerald-400/40 text-emerald-200" },
                      { name: "Siti Nurhaliza", kls: "7B", bg: "bg-blue-500/20 border-blue-400/40 text-blue-200" },
                      { name: "Dimas Pratama", kls: "7C", bg: "bg-amber-500/20 border-amber-400/40 text-amber-200" },
                      { name: "Aisyah Azzahra", kls: "7A", bg: "bg-pink-500/20 border-pink-400/40 text-pink-200" },
                      { name: "Rizky Hidayat", kls: "7B", bg: "bg-indigo-500/20 border-indigo-400/40 text-indigo-200" }
                    ].map((player, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-black inline-flex items-center gap-1.5 shadow-sm ${player.bg}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        <span>{player.name} ({player.kls})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Live CBT Button */}
                <button
                  type="button"
                  onClick={handleStartGameplay}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>MULAI SIMULASI CBT ({waygroundQuestions.length} SOAL)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* PHASE 2: GAMEPLAY LIVE INTERAKTIF */}
            {waygroundPhase === "game" && (
              <div className="space-y-5 relative z-10">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-black pb-2 border-b border-purple-500/20 flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-400/30 text-purple-200">
                    Soal {waygroundQuestionIdx + 1} dari {waygroundQuestions.length}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 font-black">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Streak x{waygroundStreak}</span>
                    </span>

                    <span className="px-3 py-1 rounded-xl bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-mono">
                      🏆 {waygroundScore} Pts
                    </span>
                  </div>
                </div>

                {/* Countdown Timer Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                    <span>⏱️ Waktu Tersisa:</span>
                    <span className={`font-mono text-xs font-black ${waygroundTimer <= 5 ? "text-rose-400 animate-pulse" : "text-amber-300"}`}>
                      {waygroundTimer} detik
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        waygroundTimer > 10 ? "bg-emerald-400" : waygroundTimer > 5 ? "bg-amber-400" : "bg-rose-500"
                      }`}
                      style={{ width: `${(waygroundTimer / 20) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white/10 border border-purple-400/30 backdrop-blur-md text-center space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-3 py-1 rounded-full inline-block">
                    {waygroundSelectedPaket?.materi || "Materi PAI SMP"}
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-white leading-relaxed">
                    {waygroundQuestions[waygroundQuestionIdx]?.q}
                  </h2>
                </div>

                {/* 4 Colored Wayground Answer Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {waygroundQuestions[waygroundQuestionIdx]?.options.map((opt, idx) => {
                    const isSelected = waygroundSelectedAns === idx;
                    const isCorrect = idx === waygroundQuestions[waygroundQuestionIdx].key;
                    const isAnswered = waygroundSelectedAns !== null;

                    // Color schemes per option
                    const colors = [
                      { bg: "bg-rose-600 hover:bg-rose-500", ring: "ring-rose-400", shape: "▲ Opsi A" },
                      { bg: "bg-blue-600 hover:bg-blue-500", ring: "ring-blue-400", shape: "◆ Opsi B" },
                      { bg: "bg-emerald-600 hover:bg-emerald-500", ring: "ring-emerald-400", shape: "● Opsi C" },
                      { bg: "bg-amber-500 hover:bg-amber-400", ring: "ring-amber-400", shape: "■ Opsi D" }
                    ];

                    let stateClass = colors[idx].bg;
                    if (isAnswered) {
                      if (isCorrect) {
                        stateClass = "bg-emerald-600 ring-4 ring-emerald-300 scale-[1.02] shadow-xl";
                      } else if (isSelected && !isCorrect) {
                        stateClass = "bg-rose-700 opacity-80 ring-2 ring-rose-400";
                      } else {
                        stateClass = "bg-slate-800 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectWaygroundAnswer(idx)}
                        className={`p-4 sm:p-5 rounded-2xl text-left font-bold text-white transition-all transform active:scale-95 cursor-pointer flex flex-col justify-between min-h-[90px] shadow-lg ${stateClass}`}
                      >
                        <div className="flex items-center justify-between text-xs opacity-90 pb-1">
                          <span className="font-black uppercase tracking-wider">{colors[idx].shape}</span>
                          {isAnswered && isCorrect && <span className="text-xs font-black">✓ BENAR!</span>}
                          {isAnswered && isSelected && !isCorrect && <span className="text-xs font-black">✗ SALAH</span>}
                        </div>
                        <span className="text-sm sm:text-base font-extrabold leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card and Next Button */}
                {waygroundSelectedAns !== null && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-400/40 space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-300">📖 Pembahasan & Dalil:</span>
                        <span className="text-[11px] text-purple-200 italic">
                          {waygroundQuestions[waygroundQuestionIdx]?.dalil}
                        </span>
                      </div>
                      <p className="text-xs text-purple-100">
                        {waygroundQuestions[waygroundQuestionIdx]?.exp}
                      </p>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleNextWaygroundQuestion}
                        className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>
                          {waygroundQuestionIdx + 1 < waygroundQuestions.length ? "Lanjut ke Soal Berikutnya" : "Lihat Hasil Akhir CBT"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 3: REKAP HASIL SIMULASI CBT */}
            {waygroundPhase === "podium" && (
              <div className="space-y-6 text-center py-4 relative z-10 animate-fadeIn">
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl">
                    <Trophy className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Alhamdulillah! Simulasi CBT Selesai</h2>
                  <p className="text-xs sm:text-sm text-purple-200">
                    Sesi Simulasi CBT Materi "{waygroundSelectedPaket?.judul}" Berhasil Dilaksanakan.
                  </p>
                </div>

                {/* Podium Champions Visualization */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 max-w-lg mx-auto">
                  {/* Rank 2 */}
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center mx-auto shadow-md">
                      2
                    </div>
                    <span className="text-xs font-black text-white block truncate">Ahmad Fauzi</span>
                    <div className="h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-600 to-slate-400 flex flex-col justify-center items-center text-white shadow-lg">
                      <span className="text-xs font-black">🥈 Peringkat 2</span>
                      <span className="text-[11px] font-mono">3,850 Pts</span>
                    </div>
                  </div>

                  {/* Rank 1 (Tallest) */}
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-300/50">
                      👑 1
                    </div>
                    <span className="text-xs font-black text-amber-300 block truncate">Siti Nurhaliza</span>
                    <div className="h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-600 to-amber-400 flex flex-col justify-center items-center text-slate-950 shadow-2xl">
                      <span className="text-xs font-black">🥇 Peringkat 1</span>
                      <span className="text-xs font-mono font-black">4,450 Pts</span>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md">
                      3
                    </div>
                    <span className="text-xs font-black text-white block truncate">Dimas Pratama</span>
                    <div className="h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-900 to-amber-700 flex flex-col justify-center items-center text-white shadow-lg">
                      <span className="text-xs font-black">🥉 Peringkat 3</span>
                      <span className="text-[11px] font-mono">3,200 Pts</span>
                    </div>
                  </div>
                </div>

                {/* Score & Accuracy Summary Card */}
                <div className="p-4 rounded-2xl bg-white/10 border border-purple-400/30 max-w-md mx-auto grid grid-cols-2 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-purple-300 font-bold uppercase block">Skor Simulasi CBT</span>
                    <span className="text-2xl font-black text-amber-300">{waygroundScore} Pts</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 font-bold uppercase block">Tingkat Akurasi</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {Math.round((waygroundCorrectCount / waygroundQuestions.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartLiveGame(waygroundSelectedPaket)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ulangi Simulasi CBT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsWaygroundGameOpen(false);
                      if (waygroundSelectedPaket) handleOpenAssignPr(waygroundSelectedPaket);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Tugaskan Sebagai Ujian CBT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWaygroundGameOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Tutup Ruang CBT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL TUGASKAN UJIAN CBT (ASYNCHRONOUS CBT)               */}
      {/* ========================================================= */}
      {isAssignPrOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tugaskan Ujian CBT ke Siswa</h3>
                  <p className="text-xs text-slate-500">Siswa dapat mengerjakan ujian CBT secara mandiri sesuai batas waktu.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignPrOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] font-black uppercase text-purple-700 block">Paket Aktivitas:</span>
                <strong className="text-xs text-slate-900 block mt-0.5">{assignPrPaket?.judul}</strong>
                <span className="text-[11px] text-slate-600 block mt-0.5">Topik: {assignPrPaket?.materi}</span>
              </div>

              {/* Kelas Target */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Kelas Sasaran:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["7", "8", "9"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setAssignPrKelas(k)}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition cursor-pointer ${
                        assignPrKelas === k
                          ? "bg-[#46178f] text-white border-[#46178f] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50"
                      }`}
                    >
                      Kelas {k} SMP
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline & Kesempatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Batas Waktu (Deadline):</label>
                  <input
                    type="datetime-local"
                    value={assignPrDeadline}
                    onChange={(e) => setAssignPrDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-[#46178f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Batas Pengerjaan:</label>
                  <select
                    value={assignPrAttempts}
                    onChange={(e) => setAssignPrAttempts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-[#46178f]"
                  >
                    <option value="1x Kesempatan">1x Kesempatan</option>
                    <option value="2x Kesempatan">2x Kesempatan</option>
                    <option value="3x Kesempatan">3x Kesempatan</option>
                    <option value="Bebas (Tanpa Batas)">Bebas (Tanpa Batas)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={assignPrShuffle}
                    onChange={(e) => setAssignPrShuffle(e.target.checked)}
                    className="w-4 h-4 text-[#46178f] rounded accent-[#46178f]"
                  />
                  <span>Acak urutan soal dan pilihan jawaban</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={assignPrShowExplanations}
                    onChange={(e) => setAssignPrShowExplanations(e.target.checked)}
                    className="w-4 h-4 text-[#46178f] rounded accent-[#46178f]"
                  />
                  <span>Tampilkan pembahasan dalil naqli setelah siswa selesai</span>
                </label>
              </div>

              {/* Shareable Link Box */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tautan Ujian CBT Siswa:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/cbt/ujian?paket=${assignPrPaket?.id}&kls=${assignPrKelas}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-100 text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const link = `${window.location.origin}/cbt/ujian?paket=${assignPrPaket?.id}&kls=${assignPrKelas}`;
                      navigator.clipboard.writeText(link);
                      showToast("Tautan ujian CBT berhasil disalin!");
                    }}
                    className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#46178f] font-bold text-xs rounded-xl border border-purple-200 shrink-0 flex items-center gap-1 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignPrOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignPr}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Terbitkan Ujian CBT Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL PREVIEW RUANG UJIAN CBT PAI                         */}
      {/* ========================================================= */}
      {isDigitalClassOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-purple-200 space-y-5 my-6 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#46178f] text-white flex items-center justify-center font-black shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                      RUANG UJIAN CBT PAI
                    </span>
                    <span className="text-xs text-slate-500">
                      Kelas {activeDigitalClassPaket?.kelas} SMP • Semester {activeDigitalClassPaket?.semester}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 line-clamp-1">
                    {activeDigitalClassPaket?.judul}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDigitalClassOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto shrink-0">
              {[
                { id: "modul", label: "📋 Kisi & Petunjuk CBT", desc: "Materi Ujian" },
                { id: "video", label: "🎬 Video Pengantar", desc: "Briefing Materi" },
                { id: "kuis", label: "📝 Latihan Soal CBT", desc: "Formatif" },
                { id: "tugas", label: "📊 Kriteria Penilaian CBT", desc: "Pedoman Skor" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDigitalClassActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    digitalClassActiveTab === tab.id
                      ? "bg-[#46178f] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-purple-50"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="overflow-y-auto space-y-4 pr-1 text-slate-800 flex-1">
              {/* TAB 1: MODUL & DALIL */}
              {digitalClassActiveTab === "modul" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <span className="text-[10px] uppercase font-black text-purple-900 block">Materi Inti Pembelajaran:</span>
                    <h4 className="text-base font-black text-purple-950">{activeDigitalClassPaket?.materi}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeDigitalClassPaket?.deskripsi}
                    </p>
                  </div>

                  {/* Dalil Calligraphy Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-2 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-black text-amber-300 block">Dalil Naqli Al-Qur'an:</span>
                    <p className="text-xl sm:text-2xl font-serif text-amber-200 py-1" dir="rtl">
                      يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ
                    </p>
                    <p className="text-xs text-purple-200 italic max-w-lg mx-auto">
                      "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku..." (QS. Al-Ma'idah: 6)
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="text-xs font-black text-slate-900">Nilai Karakter & Budi Pekerti:</h5>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      <li>Senantiasa menjaga kebersihan lahiriah dan batiniah dalam kehidupan sehari-hari.</li>
                      <li>Menumbuhkan sikap disiplin waktu shalat dan keikhlasan dalam beribadah kepada Allah SWT.</li>
                      <li>Membiasakan sikap tabayyun, menjauhi pertengkaran, dan menyayangi sesama manusia.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO INTERAKTIF */}
              {digitalClassActiveTab === "video" && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-slate-950 overflow-hidden aspect-video flex items-center justify-center shadow-lg border border-slate-800">
                    <div className="text-center p-6 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center mx-auto shadow-xl transition transform hover:scale-110 cursor-pointer">
                        <Play className="w-7 h-7 ml-1 fill-white" />
                      </div>
                      <h4 className="text-sm font-black text-white max-w-md mx-auto line-clamp-2">
                        Video Pembelajaran Digital PAI: {activeDigitalClassPaket?.judul}
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        Durasi Estimasi: ~08:30 Menit • Format Interaktif
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-slate-700">
                    <strong className="text-purple-950 block mb-1">Catatan Guru:</strong>
                    Tonton video penjelasan sampai tuntas sebelum melanjutkan ke kuis evaluasi formatif mandiri.
                  </div>
                </div>
              )}

              {/* TAB 3: EVALUASI CEPAT FORMATIF */}
              {digitalClassActiveTab === "kuis" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">
                      Uji Pemahaman Mandiri (3 Soal Pilihan Ganda):
                    </span>
                    {digitalClassQuizSubmitted && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Terverifikasi Selesai
                      </span>
                    )}
                  </div>

                  {waygroundQuestions.slice(0, 3).map((qItem, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#46178f] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{qItem.q}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-7">
                        {qItem.options.map((opt, optIdx) => {
                          const isPicked = digitalClassQuizAnswers[idx] === optIdx;
                          const isCorrect = optIdx === qItem.key;
                          let optStyle = "bg-white border-slate-200 text-slate-700 hover:bg-purple-50";

                          if (digitalClassQuizSubmitted) {
                            if (isCorrect) optStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-black";
                            else if (isPicked && !isCorrect) optStyle = "bg-rose-100 border-rose-300 text-rose-900";
                            else optStyle = "bg-slate-100 border-slate-200 opacity-60 text-slate-500";
                          } else if (isPicked) {
                            optStyle = "bg-purple-100 border-[#46178f] text-[#46178f] font-black shadow-xs";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={digitalClassQuizSubmitted}
                              onClick={() => setDigitalClassQuizAnswers({ ...digitalClassQuizAnswers, [idx]: optIdx })}
                              className={`p-2.5 rounded-xl text-xs text-left border transition cursor-pointer ${optStyle}`}
                            >
                              <span className="font-mono font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    {!digitalClassQuizSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDigitalClassQuizSubmitted(true);
                          showToast("Jawaban berhasil dinilai! Skor evaluasi tersimpan di sesi kelas.");
                        }}
                        className="px-5 py-2.5 bg-[#46178f] hover:bg-[#5a2ea6] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                      >
                        Periksa Jawaban Kuis
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDigitalClassQuizSubmitted(false);
                          setDigitalClassQuizAnswers({});
                        }}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Reset & Coba Lagi
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PANDUAN TUGAS */}
              {digitalClassActiveTab === "tugas" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <span className="text-[10px] uppercase font-black text-amber-800 block">Tugas Kelompok & Praktik:</span>
                    <h5 className="text-xs font-black text-slate-900">Studi Kasus Pembelajaran Bermakna</h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Diskusikan bersama kelompok 4 orang: bagaimana menerapkan konsep akhlak terpuji dan pencegahan perilaku menyimpang di lingkungan sekolah dan media sosial. Buatlah infografis atau ringkasan 1 lembar.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <strong className="text-slate-900 block">Kriteria Penilaian:</strong>
                    <div>1. Kedalaman analisis dalil Al-Qur'an dan Hadis (Bobot 40%)</div>
                    <div>2. Relevansi contoh penerapan kehidupan sehari-hari (Bobot 30%)</div>
                    <div>3. Kerapian penyajian dan kerja sama kelompok (Bobot 30%)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/cbt/ruang?id=${activeDigitalClassPaket?.id}`;
                    navigator.clipboard.writeText(url);
                    showToast("Tautan ruang CBT berhasil disalin!");
                  }}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#46178f] border border-purple-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link CBT</span>
                </button>
                {activeDigitalClassPaket && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDigitalClassOpen(false);
                      handleOpenShareLms(activeDigitalClassPaket);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share ke Dashboard Siswa</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDigitalClassOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup Ruang CBT
              </button>
            </div>
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "video", label: "🎬 Video", bg: "hover:bg-sky-50" },
                    { id: "game", label: "🎮 Game", bg: "hover:bg-emerald-50" },
                    { id: "lms", label: "🖥️ CBT", bg: "hover:bg-teal-50" }
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
                      : "Contoh: Paket Ujian CBT Fikih Ibadah Terpadu"
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
          <div className={`bg-white rounded-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-8 ${
            editingItemType === "lms" ? "max-w-4xl max-h-[92vh] overflow-y-auto" : "max-w-xl"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Media Ajar ({editingItemType === "lms" ? "CBT" : editingItemType.toUpperCase()})
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
                  rows={2}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* ========================================================= */}
              {/* LMS QUESTION BANK MANAGEMENT: PG & ESSAY (INPUT/UPLOAD/DELETE) */}
              {/* ========================================================= */}
              {editingItemType === "lms" && (
                <div className="pt-3 border-t border-purple-200 space-y-4">
                  {/* Section Banner Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#46178f] text-white font-black text-[10px] uppercase tracking-wider">
                          BANK SOAL UJIAN CBT
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          Pilihan Ganda & Uraian / Essay
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Masukkan soal melalui input manual, unggah berkas (Word, Excel, Text, JSON), atau hapus butir soal sesuai kebutuhan kelas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className="px-3 py-1 rounded-xl bg-purple-100 text-[#46178f] font-black text-xs border border-purple-200">
                        Total: {lmsEditingSoalList.length} Soal
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-[11px] border border-blue-200">
                        {lmsEditingSoalList.filter((s) => s.tipe === "pilihan_ganda").length} PG
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-950 font-extrabold text-[11px] border border-amber-200">
                        {lmsEditingSoalList.filter((s) => s.tipe === "essay").length} Essay
                      </span>
                    </div>
                  </div>

                  {/* Navigation Tabs for Question Operations */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setLmsActiveSoalTab("list")}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        lmsActiveSoalTab === "list"
                          ? "bg-[#46178f] text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-purple-50"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Daftar Soal Aktif ({lmsEditingSoalList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLmsActiveSoalTab("input")}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        lmsActiveSoalTab === "input"
                          ? "bg-[#46178f] text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-purple-50"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Form Tambah Soal (PG / Essay)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLmsActiveSoalTab("upload")}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        lmsActiveSoalTab === "upload"
                          ? "bg-[#46178f] text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-purple-50"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Impor Berkas Soal</span>
                    </button>
                  </div>

                  {/* TAB 1: LIST / DAFTAR SOAL & DELETE */}
                  {lmsActiveSoalTab === "list" && (
                    <div className="space-y-3">
                      {/* BAR AKSI UTAMA DAFTAR SOAL: TOMBOL TAMBAH SOAL */}
                      <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-2xl border border-purple-200/90 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-[#46178f] text-white flex items-center justify-center font-black text-xs shadow-xs">
                            {lmsEditingSoalList.length}
                          </span>
                          <div>
                            <h5 className="text-xs font-black text-slate-900 leading-none">
                              Daftar Soal Paket CBT
                            </h5>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {lmsEditingSoalList.filter((s) => s.tipe === "pilihan_ganda").length} PG • {lmsEditingSoalList.filter((s) => s.tipe === "essay").length} Essay
                            </span>
                          </div>
                        </div>

                        {/* TOMBOL TAMBAH SOAL (LANGSUNG DI DAFTAR SOAL) */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsInlineAddingSoal((prev) => !prev)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                              isInlineAddingSoal
                                ? "bg-slate-800 text-white hover:bg-slate-700"
                                : "bg-gradient-to-r from-[#46178f] to-indigo-700 hover:from-[#3a1377] hover:to-indigo-800 text-white ring-2 ring-purple-300"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            <span>{isInlineAddingSoal ? "Tutup Form Tambah" : "+ TAMBAH SOAL"}</span>
                          </button>

                          <div className="hidden sm:flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setLmsNewSoalType("pilihan_ganda");
                                setIsInlineAddingSoal(true);
                              }}
                              className="px-2.5 py-2 rounded-xl text-[11px] font-black bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-200 transition cursor-pointer flex items-center gap-1"
                              title="Tambah Butir Pilihan Ganda Baru"
                            >
                              <Plus className="w-3 h-3" />
                              <span>PG</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLmsNewSoalType("essay");
                                setIsInlineAddingSoal(true);
                              }}
                              className="px-2.5 py-2 rounded-xl text-[11px] font-black bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-200 transition cursor-pointer flex items-center gap-1"
                              title="Tambah Butir Uraian/Essay Baru"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Essay</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* FORM INLINE TAMBAH SOAL DI ATAS DAFTAR SOAL */}
                      {isInlineAddingSoal && (
                        <div className="p-4 rounded-2xl bg-white border-2 border-[#46178f]/40 shadow-lg space-y-3.5 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#46178f] text-white flex items-center justify-center font-black text-xs">
                                +
                              </span>
                              <strong className="text-xs font-black text-slate-900">
                                Tambah Soal Baru ({lmsNewSoalType === "pilihan_ganda" ? "Pilihan Ganda" : "Uraian / Essay"})
                              </strong>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => setLmsNewSoalType("pilihan_ganda")}
                                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                    lmsNewSoalType === "pilihan_ganda"
                                      ? "bg-[#46178f] text-white shadow-2xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  Pilihan Ganda
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLmsNewSoalType("essay")}
                                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                    lmsNewSoalType === "essay"
                                      ? "bg-amber-500 text-slate-950 shadow-2xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  Uraian / Essay
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsInlineAddingSoal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 text-xs font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Pertanyaan */}
                          <div>
                            <label className="text-xs font-bold text-slate-800 block mb-1">
                              Teks Pertanyaan Soal:
                            </label>
                            <textarea
                              rows={2}
                              value={lmsNewQuestion}
                              onChange={(e) => setLmsNewQuestion(e.target.value)}
                              placeholder={
                                lmsNewSoalType === "pilihan_ganda"
                                  ? "Ketikkan pertanyaan pilihan ganda PAI di sini..."
                                  : "Ketikkan pertanyaan uraian / essay pemahaman PAI di sini..."
                              }
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-[#46178f]"
                            />
                          </div>

                          {/* Opsi Pilihan Ganda */}
                          {lmsNewSoalType === "pilihan_ganda" && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-800 block">
                                Pilihan Jawaban (Klik tombol 'KUNCI' pada jawaban yang benar):
                              </label>
                              {lmsNewOptions.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <input
                                    type="text"
                                    placeholder={`Ketik teks pilihan ${String.fromCharCode(65 + idx)}...`}
                                    value={opt}
                                    onChange={(e) => {
                                      const copy = [...lmsNewOptions];
                                      copy[idx] = e.target.value;
                                      setLmsNewOptions(copy);
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-[#46178f]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setLmsNewKey(idx)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1 ${
                                      lmsNewKey === idx
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50"
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Kunci {String.fromCharCode(65 + idx)}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Kunci Uraian jika Essay */}
                          {lmsNewSoalType === "essay" && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-800 block">
                                Pedoman Penskoran / Kunci Jawaban Uraian:
                              </label>
                              <textarea
                                rows={2}
                                value={lmsNewEssayKey}
                                onChange={(e) => setLmsNewEssayKey(e.target.value)}
                                placeholder="Uraikan kriteria jawaban yang benar untuk pedoman guru dalam menilai..."
                                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-[#46178f]"
                              />
                            </div>
                          )}

                          {/* Pembahasan & Bobot */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Pembahasan / Dalil Naqli (Opsional):
                              </label>
                              <input
                                type="text"
                                value={lmsNewPembahasan}
                                onChange={(e) => setLmsNewPembahasan(e.target.value)}
                                placeholder="Contoh: QS. Al-Baqarah: 183..."
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Bobot Nilai Soal (Poin):
                              </label>
                              <input
                                type="number"
                                min={5}
                                max={100}
                                step={5}
                                value={lmsNewBobot}
                                onChange={(e) => setLmsNewBobot(Number(e.target.value) || 20)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
                              />
                            </div>
                          </div>

                          {/* Action Buttons in Inline Form */}
                          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setIsInlineAddingSoal(false)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={handleAddLmsSoal}
                              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Simpan ke Daftar Soal</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Filter Tipe & Tombol Hapus Semua */}
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-600">Filter:</span>
                          {[
                            { id: "semua", label: `Semua (${lmsEditingSoalList.length})` },
                            { id: "pilihan_ganda", label: `Pilihan Ganda (${lmsEditingSoalList.filter((s) => s.tipe === "pilihan_ganda").length})` },
                            { id: "essay", label: `Uraian / Essay (${lmsEditingSoalList.filter((s) => s.tipe === "essay").length})` }
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setLmsFilterSoalType(f.id as any)}
                              className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer text-xs ${
                                lmsFilterSoalType === f.id
                                  ? "bg-slate-900 text-white shadow-2xs"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        {lmsEditingSoalList.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllLmsSoal}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Semua Soal</span>
                          </button>
                        )}
                      </div>

                      {/* List Cards */}
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {lmsEditingSoalList
                          .filter((s) => lmsFilterSoalType === "semua" || s.tipe === lmsFilterSoalType)
                          .map((soal, idx) => (
                            <div
                              key={soal.id || idx}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition space-y-2 relative group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="w-6 h-6 rounded-lg bg-[#46178f] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                                    {idx + 1}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                      soal.tipe === "pilihan_ganda"
                                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                                        : "bg-amber-100 text-amber-950 border border-amber-200"
                                    }`}
                                  >
                                    {soal.tipe === "pilihan_ganda" ? "Pilihan Ganda (PG)" : "Uraian / Essay"}
                                  </span>
                                  {soal.bobotNilai && (
                                    <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                                      Bobot: {soal.bobotNilai} Poin
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLmsSoal(soal.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 text-xs"
                                  title="Hapus Butir Soal Ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span className="text-[11px] text-rose-600 font-bold hidden sm:inline">Hapus</span>
                                </button>
                              </div>

                              <p className="text-xs font-extrabold text-slate-900 pl-8 leading-snug">
                                {soal.pertanyaan}
                              </p>

                              {/* Pilihan Ganda Choices */}
                              {soal.tipe === "pilihan_ganda" && soal.pilihan && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 pt-1">
                                  {soal.pilihan.map((opt, optIdx) => (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                                        optIdx === soal.kunci
                                          ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs"
                                          : "bg-white border-slate-200 text-slate-700"
                                      }`}
                                    >
                                      <span className="font-mono font-black">{String.fromCharCode(65 + optIdx)}.</span>
                                      <span className="truncate">{opt}</span>
                                      {optIdx === soal.kunci && (
                                        <span className="ml-auto text-[9px] font-black text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">
                                          KUNCI ✓
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Essay Answer Key */}
                              {soal.tipe === "essay" && (
                                <div className="pl-8 pt-1">
                                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                                    <strong className="block text-[10px] uppercase font-black text-amber-800">
                                      Kunci Jawaban / Pedoman Penskoran:
                                    </strong>
                                    <p className="text-xs leading-relaxed">{soal.kunciEssay || "Belum ada kunci uraian."}</p>
                                  </div>
                                </div>
                              )}

                              {/* Pembahasan / Dalil */}
                              {soal.pembahasan && (
                                <div className="pl-8 text-[11px] text-slate-500 italic">
                                  📖 Pembahasan / Dalil: {soal.pembahasan}
                                </div>
                              )}
                            </div>
                          ))}

                        {lmsEditingSoalList.length === 0 && (
                          <div className="text-center py-8 rounded-2xl bg-white border-2 border-dashed border-slate-300 space-y-3">
                            <p className="text-xs text-slate-500 font-medium">
                              Belum ada butir soal di dalam paket kelas ini. Tambahkan soal sekarang!
                            </p>
                            <div className="flex justify-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setLmsNewSoalType("pilihan_ganda");
                                  setIsInlineAddingSoal(true);
                                }}
                                className="px-4 py-2 bg-[#46178f] hover:bg-[#381273] text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                              >
                                <Plus className="w-4 h-4" />
                                <span>+ Tambah Soal Pilihan Ganda</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setLmsNewSoalType("essay");
                                  setIsInlineAddingSoal(true);
                                }}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                              >
                                <Plus className="w-4 h-4" />
                                <span>+ Tambah Soal Essay</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setLmsActiveSoalTab("upload")}
                                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#46178f] border border-purple-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Berkas Soal</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* BAR AKSI BAWAH: TAMBAH SOAL BARU */}
                      {lmsEditingSoalList.length > 0 && (
                        <div className="pt-2 flex items-center justify-between gap-3 flex-wrap border-t border-slate-200">
                          <span className="text-xs text-slate-500 font-semibold">
                            Total: {lmsEditingSoalList.length} butir soal tersimpan
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLmsNewSoalType("pilihan_ganda");
                                setIsInlineAddingSoal(true);
                              }}
                              className="px-3.5 py-2 bg-[#46178f] hover:bg-[#381273] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Tambah Soal PG</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLmsNewSoalType("essay");
                                setIsInlineAddingSoal(true);
                              }}
                              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Tambah Soal Essay</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: INPUT MANUAL SOAL (PG / ESSAY) */}
                  {lmsActiveSoalTab === "input" && (
                    <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-200">
                        <span className="text-xs font-black text-purple-950">
                          Formulir Tambah Soal Manual ({lmsNewSoalType === "pilihan_ganda" ? "Pilihan Ganda" : "Uraian / Essay"})
                        </span>

                        {/* Switch Type Buttons */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-purple-100 border border-purple-200">
                          <button
                            type="button"
                            onClick={() => setLmsNewSoalType("pilihan_ganda")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                              lmsNewSoalType === "pilihan_ganda"
                                ? "bg-[#46178f] text-white shadow-xs"
                                : "text-purple-900 hover:bg-purple-200/50"
                            }`}
                          >
                            Pilihan Ganda (PG)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLmsNewSoalType("essay")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                              lmsNewSoalType === "essay"
                                ? "bg-amber-400 text-slate-950 shadow-xs"
                                : "text-purple-900 hover:bg-purple-200/50"
                            }`}
                          >
                            Uraian / Essay
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Teks Pertanyaan Soal:
                        </label>
                        <textarea
                          rows={2}
                          value={lmsNewQuestion}
                          onChange={(e) => setLmsNewQuestion(e.target.value)}
                          placeholder={
                            lmsNewSoalType === "pilihan_ganda"
                              ? "Contoh: Shalat sunnah yang dikerjakan saat terjadi gerhana bulan adalah..."
                              : "Contoh: Jelaskan hikmah thaharah bagi kesehatan jasmani dan rohani seorang muslim!"
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-[#46178f]"
                        />
                      </div>

                      {/* Mode: Pilihan Ganda Form */}
                      {lmsNewSoalType === "pilihan_ganda" && (
                        <div className="space-y-2 p-3.5 rounded-2xl bg-white border border-purple-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800">
                              Pilihan Jawaban (A, B, C, D) & Tandai Kunci Jawaban:
                            </label>
                            <span className="text-[11px] text-emerald-800 font-black">
                              Kunci Jawaban: Opsi {String.fromCharCode(65 + lmsNewKey)}
                            </span>
                          </div>

                          {lmsNewOptions.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-6 text-xs font-black text-slate-700">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              <input
                                type="text"
                                placeholder={`Ketik teks pilihan ${String.fromCharCode(65 + idx)}...`}
                                value={opt}
                                onChange={(e) => {
                                  const copy = [...lmsNewOptions];
                                  copy[idx] = e.target.value;
                                  setLmsNewOptions(copy);
                                }}
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-[#46178f]"
                              />
                              <button
                                type="button"
                                onClick={() => setLmsNewKey(idx)}
                                className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1 ${
                                  lmsNewKey === idx
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Kunci</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mode: Essay Form */}
                      {lmsNewSoalType === "essay" && (
                        <div className="space-y-3 p-3.5 rounded-2xl bg-white border border-amber-200">
                          <div>
                            <label className="text-xs font-bold text-slate-800 block mb-1">
                              Pedoman Penskoran / Kunci Jawaban Uraian:
                            </label>
                            <textarea
                              rows={2}
                              value={lmsNewEssayKey}
                              onChange={(e) => setLmsNewEssayKey(e.target.value)}
                              placeholder="Uraikan kriteria jawaban yang benar untuk pedoman guru dalam menilai..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-[#46178f]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-800 block mb-1">
                              Bobot Nilai Maksimal:
                            </label>
                            <input
                              type="number"
                              min={5}
                              max={100}
                              value={lmsNewBobot}
                              onChange={(e) => setLmsNewBobot(Number(e.target.value))}
                              className="w-32 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                            />
                          </div>
                        </div>
                      )}

                      {/* Pembahasan / Dalil */}
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Pembahasan & Dalil Naqli (Opsional):
                        </label>
                        <input
                          type="text"
                          value={lmsNewPembahasan}
                          onChange={(e) => setLmsNewPembahasan(e.target.value)}
                          placeholder="Contoh: HR. Bukhari & Muslim / QS. Al-Baqarah: 222..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-[#46178f]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setLmsActiveSoalTab("list")}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddLmsSoal}
                          className="px-5 py-2.5 bg-[#46178f] hover:bg-[#5a2ea6] text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Tambahkan Soal ke Paket</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: UPLOAD / IMPORT BERKAS SOAL */}
                  {lmsActiveSoalTab === "upload" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Upload Berkas Soal atau Tempel Naskah
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Mendukung file teks .txt, JSON, CSV, serta salin-tempel dari Word / Excel.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-3.5 py-2 bg-white hover:bg-purple-50 text-[#46178f] border border-purple-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs">
                            <FileUp className="w-4 h-4" />
                            <span>Pilih Berkas Soal</span>
                            <input
                              type="file"
                              accept=".txt,.json,.csv,.doc,.docx"
                              className="hidden"
                              onChange={handleFileUploadSoal}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setLmsUploadText(`1. Siapakah malaikat yang bertugas meniup sangkakala pada hari kiamat?
A. Malaikat Jibril
B. Malaikat Mikail
C. Malaikat Israfil
D. Malaikat Izrail
Kunci: C
Pembahasan: QS. Yasin: 51 dan hadis shahih mengenai malaikat Israfil.

2. Hukum thaharah sebelum melaksanakan ibadah shalat fardhu adalah...
A. Sunnah
B. Wajib mutlak
C. Mubah
D. Makruh
Kunci: B
Pembahasan: Suci dari hadas adalah syarat sah shalat.

[ESSAY]
1. Uraikan minimal 3 manfaat beriman kepada Hari Pembalasan bagi kehidupan seorang pelajar muslim!
Kunci: Menumbuhkan integritas, rajin beramal saleh, dan takut berbuat curang atau maksiat.`);
                              showToast("Contoh format naskah soal berhasil dimuat ke editor!");
                            }}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                          >
                            Isi Contoh Template
                          </button>
                        </div>
                      </div>

                      {lmsUploadedFileName && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Berkas terpilih: {lmsUploadedFileName}</span>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Naskah Soal (Format: Nomor soal, opsi A-D, Kunci: X, atau [ESSAY]):
                        </label>
                        <textarea
                          rows={6}
                          value={lmsUploadText}
                          onChange={(e) => setLmsUploadText(e.target.value)}
                          placeholder={`Tempel soal di sini, contoh format:\n1. Pertanyaan pilihan ganda...\nA. Opsi A\nB. Opsi B\nC. Opsi C\nD. Opsi D\nKunci: A\n\n[ESSAY]\n1. Pertanyaan uraian...\nKunci: Kunci jawaban uraian`}
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-[#46178f]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setLmsActiveSoalTab("list")}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleProcessUploadSoal}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Proses & Impor Semua Soal ke Paket</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                      <option value="semua">⭐ Paket Lengkap (Video, Game, & CBT)</option>
                      <option value="video">🎬 Video & Naskah</option>
                      <option value="game">🎮 Game Edukasi</option>
                      <option value="lms">🖥️ Paket Ujian CBT</option>
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
                    AI menyusun dalil naqli, narasi video, soal kuis interaktif, dan paket ujian CBT yang akurat sesuai buku PAI SMP Kemdikbudristek.
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
      {/* ========================================================= */}
      {/* MODAL 4: SHARE MEDIA AJAR / TUGAS KE DASHBOARD SISWA       */}
      {/* ========================================================= */}
      {isShareSiswaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Share ke Dashboard Siswa
                  </h3>
                  <p className="text-xs text-slate-500">
                    Siswa langsung dapat melihat & mengerjakan / play tugas ini di Dashboard mereka.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareSiswaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmShareToSiswa} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-black text-emerald-900 uppercase">
                  Jenis:{" "}
                  {shareDraftType === "video"
                    ? "🎬 Video Pembelajaran"
                    : shareDraftType === "game"
                    ? "🎮 Game Kuis Edukasi"
                    : "🖥️ Paket Ujian CBT"}
                </span>
                {shareDraftType !== "video" && (
                  <span className="text-[11px] font-bold text-[#46178f] bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {shareDraftSoalList.filter((s) => s.tipe === "pilihan_ganda").length} PG •{" "}
                    {shareDraftSoalList.filter((s) => s.tipe === "essay").length} Essay
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Jenjang Kelas:
                  </label>
                  <select
                    value={shareDraftKelas}
                    onChange={(e) => {
                      setShareDraftKelas(e.target.value as any);
                      setShareDraftRombel("SEMUA");
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="SEMUA">Semua Kelas (7, 8, & 9 SMP)</option>
                    <option value="7">Kelas VII (7) SMP</option>
                    <option value="8">Kelas VIII (8) SMP</option>
                    <option value="9">Kelas IX (9) SMP</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Rombel Kelas (Opsional):
                  </label>
                  <select
                    value={shareDraftRombel}
                    onChange={(e) => setShareDraftRombel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="SEMUA">Semua Rombel di Jenjang Ini</option>
                    {classes
                      .filter((c) => {
                        if (shareDraftKelas === "SEMUA") return true;
                        const prefix = shareDraftKelas === "7" ? "VII" : shareDraftKelas === "8" ? "VIII" : "IX";
                        return c.id.startsWith(prefix) || c.id.includes(shareDraftKelas);
                      })
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          Khusus Kelas {c.id}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Media / Tugas di Dashboard Siswa:
                </label>
                <input
                  type="text"
                  required
                  value={shareDraftJudul}
                  onChange={(e) => setShareDraftJudul(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instruksi / Pesan Guru untuk Siswa:
                </label>
                <textarea
                  rows={2}
                  value={shareDraftInstruksi}
                  onChange={(e) => setShareDraftInstruksi(e.target.value)}
                  placeholder="Contoh: Kerjakan semua soal pilihan ganda & uraian dengan jujur sebelum batas waktu!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Batas Waktu Pengerjaan (Deadline):
                </label>
                <input
                  type="datetime-local"
                  value={shareDraftDeadline}
                  onChange={(e) => setShareDraftDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShareSiswaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim & Tayangkan di Dashboard Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MONITOR MEDIA DISHARE & HASIL PENGERJAAN SISWA   */}
      {/* ========================================================= */}
      {isMonitorSharedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Media Ajar Aktif di Dashboard Siswa & Hasil Pengerjaan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pantau daftar tugas/media yang sedang tampil di Dashboard Siswa beserta nilai siswa yang telah mengerjakan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMonitorSharedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {sharedToSiswaList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
                <Share2 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Belum ada Media Ajar yang dibagikan ke Dashboard Siswa.
                </p>
                <p className="text-[11px] text-slate-500">
                  Klik tombol "Share ke Dashboard Siswa" pada Video, Game Kuis, atau Paket Ujian CBT untuk menayangkannya ke siswa.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left: Shared items list */}
                <div className="lg:col-span-2 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {sharedToSiswaList.map((item) => {
                    const countSubs = sharedSubmissions.filter((s) => s.sharedMediaId === item.id).length;
                    const isSelected = (selectedMonitorMediaId || sharedToSiswaList[0]?.id) === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMonitorMediaId(item.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-400 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {item.type === "lms" ? "CBT" : item.type.toUpperCase()} •{" "}
                            {item.rombelTarget && item.rombelTarget !== "SEMUA"
                              ? item.rombelTarget
                              : item.kelasTarget === "SEMUA"
                              ? "Semua Kls"
                              : `Kls ${item.kelasTarget}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnshareFromSiswa(item.id, item.judul);
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Hapus dari Dashboard Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-2">{item.judul}</h4>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span>✓ {countSubs} Siswa Mengerjakan</span>
                          <span>{item.sharedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Submissions for selected shared item */}
                <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-h-[420px] overflow-y-auto">
                  {(() => {
                    const activeId = selectedMonitorMediaId || sharedToSiswaList[0]?.id;
                    const activeItem = sharedToSiswaList.find((i) => i.id === activeId);
                    const subs = sharedSubmissions.filter((s) => s.sharedMediaId === activeId);

                    return (
                      <>
                        <div className="pb-2 border-b border-slate-200">
                          <span className="text-[10px] font-black uppercase text-emerald-700 block">
                            Daftar Siswa yang Sudah Mengerjakan / Play:
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-0.5">
                            {activeItem?.judul}
                          </h4>
                        </div>

                        {subs.length === 0 ? (
                          <div className="py-10 text-center text-xs text-slate-500">
                            Belum ada siswa yang menyelesaikan media ajar ini.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {subs.map((sub) => (
                              <div
                                key={sub.id}
                                className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <strong className="text-xs font-black text-slate-900 block">
                                      {sub.siswaNama}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      NISN: {sub.siswaNisn} • Kelas {sub.kelasId} • {sub.submittedAt}
                                    </span>
                                  </div>
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs">
                                    {sub.type === "video" ? "✓ Tuntas" : `Skor: ${sub.scorePG}`}
                                  </span>
                                </div>
                                {sub.catatanSiswa && (
                                  <p className="text-[11px] text-slate-600 bg-sky-50 p-2 rounded-lg border border-sky-100">
                                    <strong>Catatan Video:</strong> {sub.catatanSiswa}
                                  </p>
                                )}
                                {sub.essayAnswers && Object.keys(sub.essayAnswers).length > 0 && (
                                  <div className="text-[11px] text-slate-700 bg-amber-50 p-2 rounded-lg border border-amber-100 space-y-1">
                                    <strong className="text-amber-900 block">Jawaban Essay Siswa:</strong>
                                    {Object.entries(sub.essayAnswers).map(([qId, ans], i) => (
                                      <div key={qId}>
                                        <span className="font-bold">Soal #{i + 1}:</span> {ans || "-"}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMonitorSharedModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
