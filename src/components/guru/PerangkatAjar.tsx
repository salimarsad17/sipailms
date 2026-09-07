/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  FolderOpen,
  Download,
  Plus,
  Info,
  Video,
  FileText,
  Layout,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  FileCode,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  UploadCloud,
  X,
  Volume2,
  Compass,
  Award,
  Map,
  GraduationCap,
  Sparkles,
  Shield,
  BookOpenCheck,
  HelpCircle,
  Droplets,
  CheckSquare,
  Eye,
  Table,
  Printer,
  FileSpreadsheet,
  Presentation,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sliders,
  FileCheck
} from "lucide-react";
import { PerangkatAjar, BabPelajaran, DokumenBab, VideoBab, SoalPilihanGanda } from "../../types";
import { generateAutomaticQuiz } from "../../lib/quizGenerator";
import GeneratorSoalLKPD from "./GeneratorSoalLKPD";

// Dynamic educational content and subtitles for simulated video playback based on title and timeline progress
const getVideoContent = (videoTitle: string, progress: number) => {
  const lowercaseTitle = videoTitle.toLowerCase();
  
  if (lowercaseTitle.includes("umayyah") || lowercaseTitle.includes("sejarah")) {
    // Sejarah Daulah Umayyah
    if (progress < 25) {
      return {
        bgGradient: "from-amber-950/80 via-slate-900 to-slate-950",
        accentColor: "amber",
        slideTitle: "Mengenal Daulah Umayyah Damaskus",
        caption: "Assalamu'alaikum wr. wb. Selamat datang di modul sejarah Islam. Hari ini kita akan mengkaji era keemasan Daulah Umayyah.",
        bullets: [
          "Kekhalifahan Islam pertama pasca Khulafaur Rasyidin",
          "Membentang luas dari Asia Tengah hingga Andalusia (Spanyol)",
          "Menjadi pusat peradaban baru dunia di abad ke-7 Masehi"
        ],
        illustrationType: "intro"
      };
    } else if (progress < 65) {
      return {
        bgGradient: "from-amber-900/70 via-slate-900 to-slate-950",
        accentColor: "amber",
        slideTitle: "Fase Pendirian (661 M / 41 H)",
        caption: "Daulah Umayyah didirikan di kota Damaskus oleh Muawiyah bin Abi Sufyan setelah peristiwa bersejarah Amul Jama'ah.",
        bullets: [
          "Ibu kota dipindahkan dari Madinah ke Damaskus (Syam)",
          "Merubah sistem Syura menjadi Monarki Heriditer",
          "Mempersatukan kembali faksi-faksi umat Islam yang sempat terpecah"
        ],
        illustrationType: "founding"
      };
    } else if (progress < 115) {
      return {
        bgGradient: "from-yellow-950/80 via-slate-900 to-slate-950",
        accentColor: "yellow",
        slideTitle: "Puncak Kejayaan Daulah",
        caption: "Era keemasan dicapai di bawah Khalifah Al-Walid I dan Abdul Malik bin Marwan yang fokus pada pembangunan fisik & administrasi.",
        bullets: [
          "Mencetak mata uang dinar Islam resmi pertama di dunia",
          "Pembangunan Masjid Agung Damaskus (Masjid Al-Umayyah) yang megah",
          "Arabisasi administrasi negara untuk efisiensi birokrasi"
        ],
        illustrationType: "golden"
      };
    } else if (progress < 155) {
      return {
        bgGradient: "from-indigo-950/80 via-slate-900 to-slate-950",
        accentColor: "indigo",
        slideTitle: "Sains & Perkembangan Peradaban",
        caption: "Lembaga penerjemahan buku, kedokteran, kajian tafsir Al-Qur'an, hadits, dan arsitektur berkembang luar biasa pesat.",
        bullets: [
          "Halaqah keilmuan yang aktif di Masjid Jami' Damaskus",
          "Penyusunan kodifikasi hadits perdana oleh para ulama",
          "Sistem pos terintegrasi (Al-Barid) untuk menghubungkan wilayah luas"
        ],
        illustrationType: "sains"
      };
    } else {
      return {
        bgGradient: "from-emerald-950/80 via-slate-900 to-slate-950",
        accentColor: "emerald",
        slideTitle: "Kesimpulan & Ibrah Sejarah",
        caption: "Hikmah besar sejarah ini mengajarkan kita pentingnya persatuan umat, cinta ilmu, dan inovasi dalam memajukan peradaban mulia.",
        bullets: [
          "Menjaga kerukunan dan persatuan bangsa",
          "Menumbuhkan etos belajar dan semangat riset ilmiah",
          "Meletakkan pondasi kokoh bagi peradaban Islam selanjutnya"
        ],
        illustrationType: "conclusion"
      };
    }
  } else if (lowercaseTitle.includes("thaharah") || lowercaseTitle.includes("bersuci") || lowercaseTitle.includes("wudhu")) {
    // Thaharah / Bersuci
    if (progress < 25) {
      return {
        bgGradient: "from-teal-950/80 via-slate-900 to-slate-950",
        accentColor: "teal",
        slideTitle: "Hakikat & Keutamaan Thaharah",
        caption: "Thaharah secara bahasa artinya bersih dan suci. Bersuci adalah prasyarat mutlak paling utama agar shalat kita diterima oleh Allah.",
        bullets: [
          "Kunci ibadah yang sah menghadap Sang Pencipta",
          "Menjaga kesucian lahiriah fisik sekaligus kebersihan batin",
          "Membedakan jenis air yang suci dan yang dapat mensucikan"
        ],
        illustrationType: "water_intro"
      };
    } else if (progress < 65) {
      return {
        bgGradient: "from-teal-900/70 via-slate-900 to-slate-950",
        accentColor: "teal",
        slideTitle: "Klasifikasi Hadas & Najis",
        caption: "Ingatlah perbedaan penting ini: Hadas disucikan lewat wudhu atau mandi, sedangkan najis disucikan dengan mencuci bendanya.",
        bullets: [
          "Hadas Kecil (batal wudhu) & Hadas Besar (harus mandi wajib)",
          "Najis Mukhaffafah (ringan), Mutawassitah (sedang)",
          "Najis Mughalladah (berat - disucikan dengan 7 kali basuhan air & tanah)"
        ],
        illustrationType: "hadas_najis"
      };
    } else if (progress < 115) {
      return {
        bgGradient: "from-emerald-950/80 via-slate-900 to-slate-950",
        accentColor: "emerald",
        slideTitle: "Tata Cara Berwudhu Sesuai Syariat",
        caption: "Mari perhatikan rukun wudhu secara tertib berurutan, dimulai dari niat, membasuh wajah, tangan, kepala, hingga kedua kaki.",
        bullets: [
          "Niat tulus di dalam hati dan membasuh wajah secara merata",
          "Membasuh kedua belah tangan hingga ke bagian siku",
          "Mengusap sebagian kepala dan membasuh kaki hingga mata kaki secara tertib"
        ],
        illustrationType: "wudhu_steps"
      };
    } else if (progress < 155) {
      return {
        bgGradient: "from-amber-950/80 via-slate-900 to-slate-950",
        accentColor: "amber",
        slideTitle: "Kemudahan Islam: Syarat Tayamum",
        caption: "Bila air tidak tersedia atau dalam kondisi sakit, Islam memberikan kemudahan bertayamum dengan debu yang suci.",
        bullets: [
          "Niat tayamum dan menepukkan kedua telapak tangan ke debu bersih",
          "Mengusap wajah secara merata satu kali",
          "Mengusap kedua tangan hingga siku satu kali secara tertib"
        ],
        illustrationType: "tayamum"
      };
    } else {
      return {
        bgGradient: "from-teal-950/80 via-slate-900 to-slate-950",
        accentColor: "teal",
        slideTitle: "Praktik & Penerapan Kebersihan",
        caption: "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang senantiasa mensucikan diri.",
        bullets: [
          "Melakukan wudhu dengan tenang dan tidak boros menggunakan air",
          "Menjaga kesucian pakaian, badan, dan sajadah setiap waktu shalat",
          "Membiasakan budaya bersih di lingkungan madrasah dan rumah"
        ],
        illustrationType: "water_outro"
      };
    }
  } else {
    // Default PAI Presentation
    if (progress < 25) {
      return {
        bgGradient: "from-indigo-950/80 via-slate-900 to-slate-950",
        accentColor: "indigo",
        slideTitle: "Media Pembelajaran PAI Interaktif",
        caption: "Selamat datang di ruang belajar digital Pendidikan Agama Islam dan Budi Pekerti. Mari siapkan catatan terbaik kita.",
        bullets: [
          "Berbasis Kurikulum Merdeka Belajar Nasional",
          "Menggunakan media presentasi interaktif dan animasi menarik",
          "Fokus pada penguatan karakter serta pembentukan akhlak mulia"
        ],
        illustrationType: "welcome"
      };
    } else if (progress < 65) {
      return {
        bgGradient: "from-purple-950/80 via-slate-900 to-slate-950",
        accentColor: "purple",
        slideTitle: "Uraian Konsep Dasar Materi",
        caption: "Mari kita tadaburi ayat Al-Qur'an dan memahami kandungan dalil naqli terkait lingkup materi pembelajaran minggu ini.",
        bullets: [
          "Tadabur ayat-ayat Al-Qur'an dan Hadits pilihan",
          "Penjelasan mendalam arti kosa kata dan definisi penting",
          "Mempelajari hubungan materi dengan realita kehidupan sosial"
        ],
        illustrationType: "material_1"
      };
    } else if (progress < 115) {
      return {
        bgGradient: "from-blue-950/80 via-slate-900 to-slate-950",
        accentColor: "blue",
        slideTitle: "Penerapan Akhlak dalam Keseharian",
        caption: "Ilmu yang berkah adalah ilmu yang diamalkan. Marilah kita wujudkan akhlakul karimah dalam pergaulan sehari-hari.",
        bullets: [
          "Menerapkan kejujuran, amanah, dan menghormati hak sesama",
          "Sikap toleran, rukun, dan damai terhadap keberagaman sosial",
          "Menjunjung tinggi bakti kepada kedua orang tua serta guru"
        ],
        illustrationType: "material_2"
      };
    } else if (progress < 155) {
      return {
        bgGradient: "from-cyan-950/80 via-slate-900 to-slate-950",
        accentColor: "cyan",
        slideTitle: "Uji Kompetensi & Asesmen Mandiri",
        caption: "Sekarang, mari kita asah pemahaman kognitif dengan menjawab beberapa latihan soal asesmen yang interaktif.",
        bullets: [
          "Mengevaluasi tingkat pemahaman konsep dan dalil",
          "Mengerjakan lembar tugas mandiri siswa di LMS",
          "Refleksi diri atas pencapaian kriteria pembelajaran (KKTP)"
        ],
        illustrationType: "quiz"
      };
    } else {
      return {
        bgGradient: "from-emerald-950/80 via-slate-900 to-slate-950",
        accentColor: "emerald",
        slideTitle: "Rangkuman, Penutup & Doa Majelis",
        caption: "Terima kasih anak-anak soleh-solehah. Mari kita akhiri pembelajaran dengan doa Kaffaratul Majelis bersama-sama.",
        bullets: [
          "Subhaanaka allaahumma wa bihamdika, asyhadu allaailaaha illa anta",
          "Astaghfiruka wa atuubu ilaika (Aku mohon ampun & bertaubat pada-Mu)",
          "Jaga selalu ibadah shalat dan akhlak mulia di mana pun berada"
        ],
        illustrationType: "closing"
      };
    }
  }
};

// Renders highly detailed, responsive, and beautifully animated Islamic-themed educational screens based on current sub-chapter
const renderVideoIllustration = (type: string, playing: boolean, videoProgress: number) => {
  const animClass = playing ? "animate-pulse" : "";
  const spinClass = playing ? "animate-[spin_12s_linear_infinite]" : "";
  const bounceClass = playing ? "animate-bounce" : "";
  
  switch (type) {
    case "intro":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-amber-500/10 rounded-full border border-amber-500/20 shadow-lg shadow-amber-950/40 relative ${spinClass}`}>
            <Compass className="w-12 h-12 text-amber-500" />
            <Sparkles className="w-4 h-4 text-amber-400 absolute top-1 right-1 animate-ping" />
          </div>
          <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest mt-2.5 animate-pulse">Sejarah Daulah Umayyah</p>
        </div>
      );
    case "founding":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="flex items-end gap-2">
            <div className={`p-3 bg-amber-500/20 rounded-lg border border-amber-500/30 ${animClass}`}>
              <Map className="w-10 h-10 text-amber-400" />
            </div>
            <div className="bg-amber-600 text-white font-black px-2 py-1 text-[10px] rounded-md shadow-md transform -rotate-12 select-none animate-pulse">
              661 M
            </div>
          </div>
          <p className="text-[10px] text-amber-400 font-bold mt-2.5">Ibu Kota Baru: Damaskus</p>
        </div>
      );
    case "golden":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="relative">
            <div className={`p-4 bg-yellow-500/20 rounded-full border-2 border-yellow-400/50 shadow-xl shadow-yellow-950/40 ${animClass}`}>
              <Award className="w-12 h-12 text-yellow-400" />
            </div>
            <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <p className="text-[10px] text-yellow-400 font-bold mt-2.5 font-sans tracking-wide">Puncak Kejayaan Peradaban</p>
        </div>
      );
    case "sains":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 ${animClass}`}>
              <BookOpen className="w-10 h-10 text-indigo-400" />
            </div>
            <div className={`p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 ${spinClass}`}>
              <Compass className="w-10 h-10 text-indigo-300" />
            </div>
          </div>
          <p className="text-[10px] text-indigo-400 font-bold mt-2.5">Baitul Hikmah & Sains Islam</p>
        </div>
      );
    case "conclusion":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 relative ${bounceClass}`}>
            <GraduationCap className="w-12 h-12 text-emerald-400" />
            <CheckCircle className="w-5 h-5 text-emerald-300 absolute bottom-0 right-0 animate-pulse" />
          </div>
          <p className="text-[10px] text-emerald-400 font-bold mt-2.5">Insan Kamil Berakhlak Karimah</p>
        </div>
      );
    case "water_intro":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="relative">
            <div className={`p-4 bg-teal-500/20 rounded-full border border-teal-500/30 ${animClass}`}>
              <Droplets className="w-12 h-12 text-teal-400" />
            </div>
            {playing && (
              <>
                <div className="absolute -top-1 -left-2 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-teal-300 rounded-full animate-bounce"></div>
              </>
            )}
          </div>
          <p className="text-[10px] text-teal-400 font-bold mt-2.5">Bersuci Dari Hadas & Najis</p>
        </div>
      );
    case "hadas_najis":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="flex gap-4">
            <div className="bg-teal-950/60 p-2.5 rounded-lg border border-teal-800 text-center shadow-md">
              <span className="text-[8px] font-extrabold text-teal-300 uppercase block mb-1 tracking-wide">Hadas</span>
              <div className="text-teal-400 text-[10px] font-black">Wudhu / Mandi</div>
            </div>
            <div className="bg-teal-950/60 p-2.5 rounded-lg border border-teal-800 text-center shadow-md">
              <span className="text-[8px] font-extrabold text-amber-300 uppercase block mb-1 tracking-wide">Najis</span>
              <div className="text-amber-400 text-[10px] font-black">Cuci Air & Tanah</div>
            </div>
          </div>
          <p className="text-[10px] text-teal-300 font-bold mt-3">Panduan Mensucikan Diri</p>
        </div>
      );
    case "wudhu_steps":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black border text-[11px] transition duration-300 ${
                  playing && Math.floor(videoProgress / 10) % 3 === step - 1
                    ? "bg-emerald-500 border-emerald-400 text-slate-950 scale-110 shadow-lg shadow-emerald-950/50"
                    : "bg-slate-900 border-emerald-900/40 text-emerald-500"
                }`}
              >
                {step === 1 ? "Niat" : step === 2 ? "Wajah" : "Kaki"}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-emerald-400 font-bold mt-3">Urutan Rukun Wudhu Tertib</p>
        </div>
      );
    case "tayamum":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="relative">
            <div className={`p-4 bg-amber-500/20 rounded-full border border-amber-500/30 ${animClass}`}>
              <Shield className="w-12 h-12 text-amber-400" />
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 absolute top-1 right-1 animate-spin" />
          </div>
          <p className="text-[10px] text-amber-400 font-bold mt-2.5">Debu Suci sebagai Rukhshah</p>
        </div>
      );
    case "water_outro":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-teal-500/20 rounded-full border border-teal-500/30 ${bounceClass}`}>
            <CheckSquare className="w-12 h-12 text-teal-400" />
          </div>
          <p className="text-[10px] text-teal-400 font-bold mt-2.5">Ibadah Sah & Hati Bersih</p>
        </div>
      );
    case "welcome":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-indigo-500/20 rounded-full border border-indigo-500/30 ${animClass}`}>
            <GraduationCap className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider mt-2.5">Pendidikan Agama Islam</p>
        </div>
      );
    case "material_1":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 ${animClass}`}>
              <BookOpenCheck className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <p className="text-[10px] text-purple-400 font-bold mt-2.5">Tadabur Kandungan Ayat</p>
        </div>
      );
    case "material_2":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-blue-500/20 rounded-full border border-blue-500/30 ${bounceClass}`}>
            <Shield className="w-12 h-12 text-blue-400" />
          </div>
          <p className="text-[10px] text-blue-400 font-bold mt-2.5">Implementasi Karakter Mulia</p>
        </div>
      );
    case "quiz":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className="relative">
            <div className={`p-4 bg-cyan-500/20 rounded-full border border-cyan-500/30 ${animClass}`}>
              <HelpCircle className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
          <p className="text-[10px] text-cyan-400 font-bold mt-2.5">Kuis & Asesmen Mandiri</p>
        </div>
      );
    case "closing":
      return (
        <div className="flex flex-col items-center justify-center h-28 relative">
          <div className={`p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 ${bounceClass}`}>
            <Award className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-[10px] text-emerald-400 font-bold mt-2.5">Majelis Ilmu Berkah</p>
        </div>
      );
    default:
      return null;
  }
};

const getEmbedInfo = (url: string | undefined) => {
  if (!url || url === "#") return null;

  let cleanUrl = url.trim();
  
  // Auto-prepend https:// if the user copied a link without protocol
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  // Highly robust YouTube URL parser
  let youtubeId: string | null = null;

  if (cleanUrl.includes("youtu.be/")) {
    const parts = cleanUrl.split("youtu.be/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("youtube.com/shorts/")) {
    const parts = cleanUrl.split("youtube.com/shorts/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("youtube.com/embed/")) {
    const parts = cleanUrl.split("youtube.com/embed/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) {
        youtubeId = idPart;
      }
    }
  } else if (cleanUrl.includes("v=")) {
    const match = cleanUrl.match(/[?&]v=([^&#\s]+)/);
    if (match && match[1] && match[1].substring(0, 11).length === 11) {
      youtubeId = match[1].substring(0, 11);
    }
  } else {
    // Standard regex fallback for other youtube links
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  if (youtubeId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
    };
  }

  // Google Drive Matchers
  const gdIdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gdIdMatch && gdIdMatch[1]) {
    return {
      type: "googledrive",
      embedUrl: `https://drive.google.com/file/d/${gdIdMatch[1]}/preview`
    };
  }

  // Direct video files
  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(cleanUrl)) {
    return {
      type: "direct",
      embedUrl: cleanUrl
    };
  }

  // Fallback as generic web page or iframe
  return {
    type: "generic",
    embedUrl: cleanUrl
  };
};

interface PerangkatAjarProps {
  items: PerangkatAjar[];
  onAddItem: (newItem: PerangkatAjar) => void;
  onEditItem: (updatedItem: PerangkatAjar) => void;
  onDeleteItem: (id: string) => void;
  babPelajaran: BabPelajaran[];
  onUpdateBabPelajaran: (updatedBab: BabPelajaran[]) => void;
}

export default function PerangkatAjarView({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  babPelajaran = [],
  onUpdateBabPelajaran
}: PerangkatAjarProps) {
  // Navigation & View mode states
  const [activeKelas, setActiveKelas] = useState<string>("VII");
  const [viewMode, setViewMode] = useState<"folder" | "grid" | "bab" | "generator">("folder");
  const [semester1Expanded, setSemester1Expanded] = useState(true);
  const [semester2Expanded, setSemester2Expanded] = useState(true);

  // Grid view filter states
  const [gridKelasFilter, setGridKelasFilter] = useState<string>("Semua");
  const [gridSemesterFilter, setGridSemesterFilter] = useState<string>("Semua");
  const [gridKategoriFilter, setGridKategoriFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAdding, setIsAdding] = useState(false);

  // Upload/File Drop simulation state
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item form state
  const [newItem, setNewItem] = useState<{
    kategori: "CP_ATP" | "Modul Ajar" | "Media Pembelajaran" | "KKTP";
    judul: string;
    bab: string;
    deskripsi: string;
    fileSize: string;
    mediaType: "PDF" | "PPT" | "Word" | "Excel" | "Video" | "Canva";
    kelas: string;
    semester: string;
    downloadUrl: string;
  }>({
    kategori: "Modul Ajar",
    judul: "",
    bab: "",
    deskripsi: "",
    fileSize: "1.5 MB",
    mediaType: "PDF",
    kelas: "VII",
    semester: "1",
    downloadUrl: ""
  });

  // Edit item state
  const [editingItem, setEditingItem] = useState<PerangkatAjar | null>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<PerangkatAjar | null>(null);

  // Document Viewer Modal State (for PDF, PowerPoint, Word, Excel, Video, Canva)
  const [previewDocument, setPreviewDocument] = useState<PerangkatAjar | null>(null);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [pptCurrentSlide, setPptCurrentSlide] = useState<number>(0);
  const [pptIsPlaying, setPptIsPlaying] = useState<boolean>(false);
  const [excelActiveSheet, setExcelActiveSheet] = useState<number>(0);
  const [excelSearchTerm, setExcelSearchTerm] = useState<string>("");
  const [docZoom, setDocZoom] = useState<number>(100);

  // Interactive Video Player State
  const [activeVideo, setActiveVideo] = useState<PerangkatAjar | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // in seconds
  const videoDuration = 185; // fixed video duration simulation (3 minutes 5 seconds)
  const [playerMode, setPlayerMode] = useState<"video" | "slide">("video");

  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Bab Pelajaran form and management states
  const [isEditingBab, setIsEditingBab] = useState(false);
  const [editingBab, setEditingBab] = useState<BabPelajaran | null>(null); // null means adding a new one
  const [babJudul, setBabJudul] = useState("");
  const [babDeskripsi, setBabDeskripsi] = useState("");
  const [babDocs, setBabDocs] = useState<{ judul: string; size: string }[]>([]);
  const [babVideoJudul, setBabVideoJudul] = useState("");
  const [babVideoDurasi, setBabVideoDurasi] = useState("");
  const [babVideoSource, setBabVideoSource] = useState("");
  const [babKelasId, setBabKelasId] = useState("VII");
  const [babKelasFilter, setBabKelasFilter] = useState<string>("Semua");

  // Soal Pilihan Ganda States
  const [babSoalList, setBabSoalList] = useState<SoalPilihanGanda[]>([]);
  const [newSoalPertanyaan, setNewSoalPertanyaan] = useState("");
  const [newSoalPilihanA, setNewSoalPilihanA] = useState("");
  const [newSoalPilihanB, setNewSoalPilihanB] = useState("");
  const [newSoalPilihanC, setNewSoalPilihanC] = useState("");
  const [newSoalPilihanD, setNewSoalPilihanD] = useState("");
  const [newSoalJawabanBenar, setNewSoalJawabanBenar] = useState("A");

  // AI Generator States for Teacher
  const [autoCount, setAutoCount] = useState<number>(5);
  const [autoDifficulty, setAutoDifficulty] = useState<"Mudah" | "Sedang" | "HOTS">("Sedang");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorToast, setGeneratorToast] = useState<string | null>(null);

  const handleGenerateTeacherAutoQuiz = () => {
    if (!babJudul.trim()) {
      alert("Silakan isi Judul Bab terlebih dahulu agar AI dapat menyusun soal PAI yang relevan!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const tempBabObj: BabPelajaran = {
        id: editingBab?.id || "temp_bab_" + Date.now(),
        key: editingBab?.key || "temp_key_" + Date.now(),
        judul: babJudul,
        deskripsi: babDeskripsi || babJudul,
        dokumen: babDocs,
        video: {
          judul: babVideoJudul || "Video Pembelajaran PAI",
          duration: babVideoDurasi || "10 Menit",
          source: babVideoSource || "https://www.youtube.com/watch?v=vV-G7lA7kX0"
        },
        kelasId: babKelasId,
        soalList: []
      };

      const generatedQuestions = generateAutomaticQuiz(tempBabObj, {
        count: autoCount,
        difficulty: autoDifficulty
      });

      setBabSoalList(generatedQuestions);
      setIsGenerating(false);

      const chapterName = babJudul.split(":")[1]?.trim() || babJudul;
      setGeneratorToast(`⚡ Alhamdulillah! ${generatedQuestions.length} Soal PAI otomatis (${autoDifficulty}) berhasil disusun untuk ${chapterName}. Silakan periksa daftar soal di bawah.`);
      setTimeout(() => setGeneratorToast(null), 5000);
    }, 500);
  };

  // Docs inputs for adding new document items inside the form
  const [newDocJudul, setNewDocJudul] = useState("");
  const [newDocSize, setNewDocSize] = useState("");

  // Auto-set playerMode when a new video is loaded
  useEffect(() => {
    if (activeVideo) {
      const embedInfo = getEmbedInfo(activeVideo.downloadUrl);
      setPlayerMode(embedInfo ? "video" : "slide");
    }
  }, [activeVideo]);

  // Video interval player simulation
  useEffect(() => {
    let interval: any = null;
    if (activeVideo && videoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= videoDuration) {
            setVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeVideo, videoPlaying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.judul || !newItem.bab) {
      alert("Harap lengkapi judul dan nama bab/lingkup materi!");
      return;
    }
    const createdItem: PerangkatAjar = {
      id: "pa-" + Date.now(),
      kategori: newItem.kategori,
      judul: newItem.judul,
      bab: newItem.bab,
      deskripsi: newItem.deskripsi,
      fileSize: newItem.kategori === "Media Pembelajaran" && newItem.mediaType === "Video" ? "Link Eksternal" : newItem.fileSize,
      downloadUrl: newItem.downloadUrl || "#",
      mediaType: newItem.mediaType,
      kelas: newItem.kelas,
      semester: newItem.semester
    };
    onAddItem(createdItem);
    setIsAdding(false);
    setUploadFileName("");
    setUploadProgress(null);
    
    // Reset to default
    setNewItem({
      kategori: "Modul Ajar",
      judul: "",
      bab: "",
      deskripsi: "",
      fileSize: "1.5 MB",
      mediaType: "PDF",
      kelas: activeKelas,
      semester: "1",
      downloadUrl: ""
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (!editingItem.judul || !editingItem.bab) {
        alert("Judul dan bab tidak boleh kosong!");
        return;
      }
      onEditItem(editingItem);
      setEditingItem(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingItem) {
      onDeleteItem(deletingItem.id);
      setDeletingItem(null);
    }
  };

  const handleDownloadSimulation = (title: string) => {
    setDownloadNotification(title);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 4000);
  };

  const handleOpenAddBab = () => {
    setEditingBab(null);
    setBabJudul("");
    setBabDeskripsi("");
    setBabDocs([]);
    setBabVideoJudul("");
    setBabVideoDurasi("");
    setBabVideoSource("");
    setBabKelasId("VII");
    setBabSoalList([]);
    setNewSoalPertanyaan("");
    setNewSoalPilihanA("");
    setNewSoalPilihanB("");
    setNewSoalPilihanC("");
    setNewSoalPilihanD("");
    setNewSoalJawabanBenar("A");
    setIsEditingBab(true);
  };

  const handleOpenEditBab = (bab: BabPelajaran) => {
    setEditingBab(bab);
    setBabJudul(bab.judul);
    setBabDeskripsi(bab.deskripsi);
    setBabDocs(bab.dokumen || []);
    setBabVideoJudul(bab.video?.judul || "");
    setBabVideoDurasi(bab.video?.duration || "");
    setBabVideoSource(bab.video?.source || "");
    setBabKelasId(bab.kelasId || "VII");
    setBabSoalList(bab.soalList || []);
    setNewSoalPertanyaan("");
    setNewSoalPilihanA("");
    setNewSoalPilihanB("");
    setNewSoalPilihanC("");
    setNewSoalPilihanD("");
    setNewSoalJawabanBenar("A");
    setIsEditingBab(true);
  };

  const handleAddBabDoc = () => {
    if (!newDocJudul.trim()) {
      alert("Masukkan judul dokumen terlebih dahulu!");
      return;
    }
    const size = newDocSize.trim() || "1.0 MB";
    setBabDocs([...babDocs, { judul: newDocJudul.trim(), size }]);
    setNewDocJudul("");
    setNewDocSize("");
  };

  const handleRemoveBabDoc = (idx: number) => {
    setBabDocs(babDocs.filter((_, i) => i !== idx));
  };

  const handleAddSoal = () => {
    if (!newSoalPertanyaan.trim()) {
      alert("Pertanyaan soal wajib diisi!");
      return;
    }
    if (!newSoalPilihanA.trim() || !newSoalPilihanB.trim() || !newSoalPilihanC.trim() || !newSoalPilihanD.trim()) {
      alert("Semua 4 pilihan jawaban (A, B, C, D) wajib diisi!");
      return;
    }

    const newSoal: SoalPilihanGanda = {
      id: "soal-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      pertanyaan: newSoalPertanyaan.trim(),
      pilihan: [
        newSoalPilihanA.trim(),
        newSoalPilihanB.trim(),
        newSoalPilihanC.trim(),
        newSoalPilihanD.trim()
      ],
      jawabanBenar: newSoalJawabanBenar
    };

    setBabSoalList([...babSoalList, newSoal]);
    setNewSoalPertanyaan("");
    setNewSoalPilihanA("");
    setNewSoalPilihanB("");
    setNewSoalPilihanC("");
    setNewSoalPilihanD("");
    setNewSoalJawabanBenar("A");
  };

  const handleRemoveSoal = (id: string) => {
    setBabSoalList(babSoalList.filter((s) => s.id !== id));
  };

  const handleSaveBabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babJudul.trim() || !babDeskripsi.trim()) {
      alert("Judul Bab dan Deskripsi wajib diisi!");
      return;
    }

    const videoObj = {
      judul: babVideoJudul.trim() || "Video Pembelajaran PAI",
      duration: babVideoDurasi.trim() || "10 Menit",
      source: babVideoSource.trim() || "https://www.youtube.com/watch?v=vV-G7lA7kX0"
    };

    // Auto-save currently drafted question if valid and not yet added to list
    let finalSoalList = [...babSoalList];
    if (newSoalPertanyaan.trim()) {
      if (newSoalPilihanA.trim() && newSoalPilihanB.trim() && newSoalPilihanC.trim() && newSoalPilihanD.trim()) {
        const autoSoal: SoalPilihanGanda = {
          id: "soal-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          pertanyaan: newSoalPertanyaan.trim(),
          pilihan: [
            newSoalPilihanA.trim(),
            newSoalPilihanB.trim(),
            newSoalPilihanC.trim(),
            newSoalPilihanD.trim()
          ],
          jawabanBenar: newSoalJawabanBenar
        };
        finalSoalList.push(autoSoal);
        // Clear input draft
        setNewSoalPertanyaan("");
        setNewSoalPilihanA("");
        setNewSoalPilihanB("");
        setNewSoalPilihanC("");
        setNewSoalPilihanD("");
        setNewSoalJawabanBenar("A");
      } else {
        alert("Peringatan: Pertanyaan yang sedang Anda ketik memiliki pilihan jawaban yang belum lengkap, sehingga tidak ikut tersimpan.");
      }
    }

    let updatedList: BabPelajaran[] = [];

    if (editingBab) {
      // Edit mode
      updatedList = babPelajaran.map((b) => {
        if (b.id === editingBab.id) {
          return {
            ...b,
            judul: babJudul.trim(),
            deskripsi: babDeskripsi.trim(),
            dokumen: babDocs,
            video: videoObj,
            kelasId: babKelasId,
            soalList: finalSoalList
          };
        }
        return b;
      });
      alert("Bab Pelajaran berhasil diperbarui!");
    } else {
      // Add mode
      const newId = "bab-" + Date.now();
      const newBab: BabPelajaran = {
        id: newId,
        key: newId,
        judul: babJudul.trim(),
        deskripsi: babDeskripsi.trim(),
        dokumen: babDocs,
        video: videoObj,
        kelasId: babKelasId,
        soalList: finalSoalList
      };
      updatedList = [...babPelajaran, newBab];
      alert("Bab Pelajaran baru berhasil ditambahkan!");
    }

    onUpdateBabPelajaran(updatedList);
    setIsEditingBab(false);
  };

  const handleDeleteBabClick = (babId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Bab Pelajaran ini? Tindakan ini tidak dapat dibatalkan.")) {
      const updatedList = babPelajaran.filter((b) => b.id !== babId);
      onUpdateBabPelajaran(updatedList);
      alert("Bab Pelajaran berhasil dihapus!");
    }
  };

  // Drag and drop file handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processUploadedFile = (file: File) => {
    const fileName = file.name;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const extension = fileName.split(".").pop()?.toLowerCase();

    // Map extension to media type
    let determinedType: "PDF" | "PPT" | "Word" | "Excel" | "Video" | "Canva" = "PDF";
    let determinedCategory: "CP_ATP" | "Modul Ajar" | "Media Pembelajaran" | "KKTP" = "Modul Ajar";

    if (extension === "ppt" || extension === "pptx") {
      determinedType = "PPT";
      determinedCategory = "Media Pembelajaran";
    } else if (extension === "doc" || extension === "docx") {
      determinedType = "Word";
      determinedCategory = "Modul Ajar";
    } else if (extension === "xls" || extension === "xlsx" || extension === "csv") {
      determinedType = "Excel";
      determinedCategory = "KKTP";
    } else if (extension === "mp4" || extension === "mkv" || extension === "avi" || extension === "mov") {
      determinedType = "Video";
      determinedCategory = "Media Pembelajaran";
    } else if (fileName.toLowerCase().includes("atp") || fileName.toLowerCase().includes("cp")) {
      determinedCategory = "CP_ATP";
    } else if (fileName.toLowerCase().includes("kktp") || fileName.toLowerCase().includes("kriteria")) {
      determinedCategory = "KKTP";
    }

    // Create a real object URL for uploaded file so it can be previewed/downloaded immediately
    let objectUrl = "#";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      objectUrl = "#";
    }

    setUploadFileName(fileName);
    setUploadProgress(0);

    // Simulate progress counting up
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Set state values once completed
        setNewItem((prev) => ({
          ...prev,
          judul: fileName.substring(0, fileName.lastIndexOf(".")) || fileName,
          fileSize: sizeInMB,
          mediaType: determinedType,
          kategori: determinedCategory,
          downloadUrl: objectUrl
        }));
      }
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const getIconForType = (type?: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-4 h-4 text-rose-600" />;
      case "PPT":
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case "Word":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "Excel":
        return <Table className="w-4 h-4 text-emerald-600" />;
      case "Canva":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getItemKelas = (item: PerangkatAjar) => item.kelas || "VII";
  const getItemSemester = (item: PerangkatAjar) => item.semester || "1";

  // Filter items for folder view mode (based on chosen active kelas tab)
  const folderItems = items.filter((item) => getItemKelas(item) === activeKelas);

  const getSemesterItems = (sem: string) => {
    return folderItems.filter((item) => getItemSemester(item) === sem);
  };

  const getCategoryItemsFromList = (list: PerangkatAjar[], cat: PerangkatAjar["kategori"]) => {
    return list.filter((item) => item.kategori === cat);
  };

  // Filter items for flat grid view mode
  const filteredGridItems = items.filter((item) => {
    const matchesKelas = gridKelasFilter === "Semua" || getItemKelas(item) === gridKelasFilter;
    const matchesSemester = gridSemesterFilter === "Semua" || getItemSemester(item) === gridSemesterFilter;
    const matchesKategori = gridKategoriFilter === "Semua" || item.kategori === gridKategoriFilter;
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKelas && matchesSemester && matchesKategori && matchesSearch;
  });

  // Time conversion helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Download Alert notification */}
      {downloadNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Mengunduh berkas: <strong>{downloadNotification}</strong>... Berhasil disimpan!
          </span>
        </div>
      )}

      {/* Intro section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-700" />
            Administrasi Perangkat Ajar Digital
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Arsip terstruktur untuk CP & ATP, Modul Ajar, Media Pembelajaran, dan KKTP. Dikelompokkan rapi per Kelas dan Semester.
          </p>
        </div>

        <button
          onClick={() => {
            setNewItem((prev) => ({ ...prev, kelas: activeKelas }));
            setIsAdding(!isAdding);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition shrink-0 shadow-sm"
          id="btn-tambah-perangkat"
        >
          <Plus className="w-4 h-4" />
          Arsipkan Dokumen Baru
        </button>
      </div>

      {/* Add New Perangkat Ajar form with Upload Simulation */}
      {isAdding && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-inner animate-fadeIn space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-900">Arsipkan Perangkat Ajar Baru</h4>
            <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
              Mode Upload atau Input Manual
            </span>
          </div>

          {/* Drag & Drop Upload Simulation Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
              isDragActive
                ? "border-emerald-600 bg-emerald-50/50"
                : "border-slate-300 bg-white hover:border-emerald-500 hover:bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.ppt,.pptx,.mp4,.avi,.mkv"
            />
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-700">
                Tarik & letakkan berkas administrasi di sini, atau <span className="text-emerald-700 hover:underline">pilih file</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Format yang didukung: PDF, PPT, PPTX, MP4, dsb (Ukuran maksimal 50MB)
              </p>
            </div>

            {uploadProgress !== null && (
              <div className="w-full max-w-xs mt-2 space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-600">
                  <span className="truncate max-w-[200px]">{uploadFileName}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                {uploadProgress === 100 && (
                  <p className="text-[9px] text-emerald-600 font-extrabold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Berkas berhasil diproses! Metadata otomatis terisi.
                  </p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Kategori Dokumen
                </label>
                <select
                  value={newItem.kategori}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      kategori: e.target.value as "CP_ATP" | "Modul Ajar" | "Media Pembelajaran" | "KKTP"
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 font-semibold"
                >
                  <option value="CP_ATP">CP & ATP</option>
                  <option value="Modul Ajar">Modul Ajar (RPP Plus)</option>
                  <option value="Media Pembelajaran">Media Pembelajaran</option>
                  <option value="KKTP">KKTP (Kriteria Ketercapaian)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Kelas Tingkat
                </label>
                <select
                  value={newItem.kelas}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      kelas: e.target.value
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 font-semibold"
                >
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Semester Periode
                </label>
                <select
                  value={newItem.semester}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      semester: e.target.value
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 font-semibold"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Bab / Lingkup Materi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bab 1: Thaharah"
                  value={newItem.bab}
                  onChange={(e) => setNewItem({ ...newItem, bab: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white font-medium text-slate-800"
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Judul Dokumen Perangkat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Thaharah - Pertemuan Ke-1"
                  value={newItem.judul}
                  onChange={(e) => setNewItem({ ...newItem, judul: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Format Berkas
                </label>
                <select
                  value={newItem.mediaType}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      mediaType: e.target.value as any
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 font-semibold"
                >
                  <option value="PDF">Dokumen PDF (.pdf)</option>
                  <option value="PPT">PowerPoint Slide (.ppt / .pptx)</option>
                  <option value="Word">Dokumen Word (.doc / .docx)</option>
                  <option value="Excel">Spreadsheet Excel (.xls / .xlsx)</option>
                  <option value="Video">Video Link (YouTube / MP4)</option>
                  <option value="Canva">Infografis / Media Canva</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Ukuran Berkas / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 1.5 MB atau Link Youtube"
                  value={newItem.fileSize}
                  onChange={(e) => setNewItem({ ...newItem, fileSize: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white font-semibold text-slate-700"
                  disabled={newItem.kategori === "Media Pembelajaran" && newItem.mediaType === "Video"}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Tautan / Link URL Dokumen (Contoh: Google Drive, Canva, Youtube, dll.)
              </label>
              <input
                type="text"
                placeholder="Contoh: https://drive.google.com/drive/folders/... atau https://canva.com/..."
                value={newItem.downloadUrl}
                onChange={(e) => setNewItem({ ...newItem, downloadUrl: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white font-semibold text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Deskripsi Singkat Dokumen
              </label>
              <textarea
                placeholder="Berikan ringkasan materi atau tujuan pembelajaran untuk dokumen ini..."
                rows={2}
                value={newItem.deskripsi}
                onChange={(e) => setNewItem({ ...newItem, deskripsi: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800 font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setUploadFileName("");
                  setUploadProgress(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                id="btn-submit-perangkat"
              >
                Simpan Arsip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Filter & View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        {/* Class Selection Tabs (For Folder Mode) */}
        {viewMode === "folder" ? (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {(["VII", "VIII", "IX"] as const).map((kelas) => (
              <button
                key={kelas}
                onClick={() => setActiveKelas(kelas)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                  activeKelas === kelas
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                Kelas {kelas}
              </button>
            ))}
          </div>
        ) : viewMode === "bab" ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Kelola Bab Pelajaran yang Tampil di LMS Siswa</span>
          </div>
        ) : viewMode === "generator" ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Generator Soal & LKPD Otomatis berbasis AI Kurikulum Merdeka</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Pencarian dan Filter Dokumen</span>
          </div>
        )}

        {/* View Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-auto">
          <button
            onClick={() => setViewMode("folder")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
              viewMode === "folder"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tampilan Folder Kelas & Semester"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Folder Semester</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
              viewMode === "grid"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tampilan Semua Berkas (Grid)"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Semua Grid</span>
          </button>
          <button
            onClick={() => setViewMode("bab")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
              viewMode === "bab"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Kelola Bab Pembelajaran LMS"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bab LMS (Siswa)</span>
          </button>
          <button
            onClick={() => setViewMode("generator")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
              viewMode === "generator"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Pembuatan Soal & LKPD Otomatis (AI)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Soal & LKPD (AI)</span>
          </button>
        </div>
      </div>

      {/* RENDER MODES */}
      {viewMode === "folder" ? (
        /* ==================== FOLDER VIEW MODE ==================== */
        <div className="space-y-6">
          {/* SEMESTER 1 SECTION */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setSemester1Expanded(!semester1Expanded)}
              className="w-full px-6 py-4 bg-slate-50/60 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🍁</span>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Semester 1 (Ganjil) - Kelas {activeKelas}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Arsip administrasi kurikulum paruh pertama tahun ajaran aktif
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-100">
                  {getSemesterItems("1").length} Dokumen
                </span>
                {semester1Expanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {semester1Expanded && (
              <div className="p-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Category 1: CP & ATP */}
                  {renderCategoryFolder(
                    "CP & ATP",
                    "CP_ATP",
                    getCategoryItemsFromList(getSemesterItems("1"), "CP_ATP"),
                    "border-l-4 border-emerald-600"
                  )}

                  {/* Category 2: Modul Ajar */}
                  {renderCategoryFolder(
                    "Modul Ajar (RPP)",
                    "Modul Ajar",
                    getCategoryItemsFromList(getSemesterItems("1"), "Modul Ajar"),
                    "border-l-4 border-sky-500"
                  )}

                  {/* Category 3: Media Ajar */}
                  {renderCategoryFolder(
                    "Media Belajar",
                    "Media Pembelajaran",
                    getCategoryItemsFromList(getSemesterItems("1"), "Media Pembelajaran"),
                    "border-l-4 border-indigo-500"
                  )}

                  {/* Category 4: KKTP */}
                  {renderCategoryFolder(
                    "KKTP (Interval Nilai)",
                    "KKTP",
                    getCategoryItemsFromList(getSemesterItems("1"), "KKTP"),
                    "border-l-4 border-amber-500"
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEMESTER 2 SECTION */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setSemester2Expanded(!semester2Expanded)}
              className="w-full px-6 py-4 bg-slate-50/60 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌸</span>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Semester 2 (Genap) - Kelas {activeKelas}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Arsip administrasi kurikulum paruh kedua tahun ajaran aktif
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-100">
                  {getSemesterItems("2").length} Dokumen
                </span>
                {semester2Expanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {semester2Expanded && (
              <div className="p-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Category 1: CP & ATP */}
                  {renderCategoryFolder(
                    "CP & ATP",
                    "CP_ATP",
                    getCategoryItemsFromList(getSemesterItems("2"), "CP_ATP"),
                    "border-l-4 border-emerald-600"
                  )}

                  {/* Category 2: Modul Ajar */}
                  {renderCategoryFolder(
                    "Modul Ajar (RPP)",
                    "Modul Ajar",
                    getCategoryItemsFromList(getSemesterItems("2"), "Modul Ajar"),
                    "border-l-4 border-sky-500"
                  )}

                  {/* Category 3: Media Ajar */}
                  {renderCategoryFolder(
                    "Media Belajar",
                    "Media Pembelajaran",
                    getCategoryItemsFromList(getSemesterItems("2"), "Media Pembelajaran"),
                    "border-l-4 border-indigo-500"
                  )}

                  {/* Category 4: KKTP */}
                  {renderCategoryFolder(
                    "KKTP (Interval Nilai)",
                    "KKTP",
                    getCategoryItemsFromList(getSemesterItems("2"), "KKTP"),
                    "border-l-4 border-amber-500"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : viewMode === "bab" ? (
        /* ==================== BAB PELAJARAN MANAGEMENT MODE ==================== */
        <div className="space-y-6">
          {/* Header Action panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                Daftar Bab Pelajaran PAI (Integrasi LMS Siswa)
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Ubah, tambah, atau hapus bab pelajaran. Setiap perubahan akan langsung sinkron dan terbaca pada LMS akun Siswa.
              </p>
            </div>
            {!isEditingBab && (
              <button
                onClick={handleOpenAddBab}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bab Pelajaran</span>
              </button>
            )}
          </div>

          {isEditingBab ? (
            /* Editing / Adding Bab form */
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {editingBab ? "Edit Bab Pelajaran" : "Tambah Bab Pelajaran Baru"}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingBab(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBabSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        Judul Bab *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bab 4: Iman Kepada Malaikat"
                        value={babJudul}
                        onChange={(e) => setBabJudul(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-semibold bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        Target Kelas LMS *
                      </label>
                      <select
                        value={babKelasId}
                        onChange={(e) => setBabKelasId(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold bg-slate-50 text-slate-700"
                      >
                        <option value="VII">Kelas VII</option>
                        <option value="VIII">Kelas VIII</option>
                        <option value="IX">Kelas IX</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        Deskripsi Bab *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Jelaskan secara garis besar cakupan materi pada bab ini..."
                        value={babDeskripsi}
                        onChange={(e) => setBabDeskripsi(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-semibold bg-slate-50 resize-none"
                      />
                    </div>
                  </div>

                  {/* Documents & PDFs */}
                  <div className="md:col-span-1 space-y-4 border-l border-slate-100 pl-0 md:pl-5">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Bahan Bacaan & Dokumen (PDF)
                    </span>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {babDocs.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic font-semibold">
                          Belum ada dokumen pendukung.
                        </p>
                      ) : (
                        babDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-700"
                          >
                            <span className="truncate max-w-[150px]">📄 {doc.judul} ({doc.size})</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBabDoc(idx)}
                              className="text-red-500 hover:text-red-700"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Document small form */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Tambah Berkas Pendukung</span>
                      <input
                        type="text"
                        placeholder="Judul Berkas PDF..."
                        value={newDocJudul}
                        onChange={(e) => setNewDocJudul(e.target.value)}
                        className="w-full p-2 text-[10px] rounded border border-slate-200 bg-white font-medium"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ukuran (misal: 1.2 MB)"
                          value={newDocSize}
                          onChange={(e) => setNewDocSize(e.target.value)}
                          className="flex-1 p-2 text-[10px] rounded border border-slate-200 bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddBabDoc}
                          className="px-3 bg-indigo-600 text-white text-[10px] font-bold rounded hover:bg-indigo-700 transition"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Lesson (YouTube dll) */}
                  <div className="md:col-span-1 space-y-4 border-l border-slate-100 pl-0 md:pl-5">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Media Pembelajaran Video
                    </span>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Judul Video
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Video Penjelasan Thaharah"
                        value={babVideoJudul}
                        onChange={(e) => setBabVideoJudul(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Durasi Video (Teks)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 8 Menit"
                        value={babVideoDurasi}
                        onChange={(e) => setBabVideoDurasi(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center justify-between">
                        <span>URL Video YouTube / Tautan *</span>
                        <span className="text-[9px] text-amber-600 font-extrabold lowercase">Mendukung link share & embed</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://www.youtube.com/watch?v=vV-G7lA7kX0"
                        value={babVideoSource}
                        onChange={(e) => setBabVideoSource(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:border-amber-500"
                      />
                      <span className="block text-[9px] text-slate-400 mt-1 leading-relaxed">
                        Masukkan URL YouTube apa saja. Pemutar video di LMS siswa akan otomatis membaca format tersebut sehingga video bisa langsung diputar normal tanpa error konfigurasi.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Pembuatan Soal Pilihan Ganda (LMS) */}
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">📝 Kuis LMS & Pembuatan Soal Otomatis (Guru PAI)</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Buat dan kelola latihan kuis pilihan ganda secara manual atau gunakan AI Generator otomatis Kurikulum Merdeka yang akan dikerjakan siswa di LMS.</p>
                    </div>
                  </div>

                  {/* AI Generator Control Box for Teacher */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-xl p-4 text-white shadow-md space-y-3.5 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <h4 className="text-xs font-bold tracking-wide">
                          Pembuatan Soal Kuis Otomatis (AI) {babJudul ? `– ${babJudul.split(":")[1]?.trim() || babJudul}` : ""}
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                        AI Generator Guru PAI
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] text-slate-300 font-bold mb-1">
                          Jumlah Soal Dihasilkan
                        </label>
                        <select
                          value={autoCount}
                          onChange={(e) => setAutoCount(Number(e.target.value))}
                          className="w-full bg-slate-800/80 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-emerald-400 font-semibold"
                        >
                          <option value={3}>3 Soal Singkat</option>
                          <option value={5}>5 Soal Standar (Rekomendasi)</option>
                          <option value={8}>8 Soal Komprehensif</option>
                          <option value={10}>10 Soal Lengkap (Ujian/Asesmen)</option>
                          <option value={15}>15 Soal Pendalaman Materi</option>
                          <option value={20}>20 Soal Paket Lengkap Sumatif</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-300 font-bold mb-1">
                          Tingkat Kesulitan
                        </label>
                        <select
                          value={autoDifficulty}
                          onChange={(e) => setAutoDifficulty(e.target.value as any)}
                          className="w-full bg-slate-800/80 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-emerald-400 font-semibold"
                        >
                          <option value="Mudah">🟢 Dasar (Mudah & Pemahaman)</option>
                          <option value="Sedang">🟡 Standar (Sedang / Aplikasi)</option>
                          <option value="HOTS">🔴 HOTS (Penalaran Tinggi / Tantangan)</option>
                        </select>
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={handleGenerateTeacherAutoQuiz}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-black py-2.5 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Menyusun Soal AI...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Buat Soal Otomatis (AI)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {generatorToast && (
                      <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 animate-fadeIn">
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{generatorToast}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/55 p-4 rounded-2xl border border-slate-200/50">
                    {/* Form Input Soal Baru */}
                    <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <span className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Tambah Soal Baru</span>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Pertanyaan Soal *</label>
                        <textarea
                          placeholder="Tuliskan pertanyaan disini..."
                          rows={2}
                          value={newSoalPertanyaan}
                          onChange={(e) => setNewSoalPertanyaan(e.target.value)}
                          className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-500">Pilihan Jawaban (A, B, C, D) *</label>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400">A</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan A..."
                            value={newSoalPilihanA}
                            onChange={(e) => setNewSoalPilihanA(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400">B</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan B..."
                            value={newSoalPilihanB}
                            onChange={(e) => setNewSoalPilihanB(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400">C</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan C..."
                            value={newSoalPilihanC}
                            onChange={(e) => setNewSoalPilihanC(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400">D</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan D..."
                            value={newSoalPilihanD}
                            onChange={(e) => setNewSoalPilihanD(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Kunci Jawaban Benar *</label>
                          <select
                            value={newSoalJawabanBenar}
                            onChange={(e) => setNewSoalJawabanBenar(e.target.value)}
                            className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50 text-slate-700"
                          >
                            <option value="A">Pilihan A</option>
                            <option value="B">Pilihan B</option>
                            <option value="C">Pilihan C</option>
                            <option value="D">Pilihan D</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleAddSoal}
                            className="w-full p-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Soal
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Daftar Soal yang Sudah Ditambahkan */}
                    <div className="space-y-3 flex flex-col">
                      <span className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        Daftar Soal Kuis ({babSoalList.length} Soal)
                      </span>

                      <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 space-y-2.5">
                        {babSoalList.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl bg-white text-slate-400 space-y-1">
                            <HelpCircle className="w-8 h-8 text-slate-300" />
                            <p className="text-xs font-semibold">Belum ada latihan soal.</p>
                            <p className="text-[10px] text-slate-400">Gunakan form di sebelah kiri untuk membuat soal pertama Anda.</p>
                          </div>
                        ) : (
                          babSoalList.map((soal, sIdx) => (
                            <div key={soal.id} className="p-3.5 bg-white rounded-xl border border-slate-200/60 shadow-sm relative space-y-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveSoal(soal.id)}
                                className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Hapus Soal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="pr-6">
                                <span className="text-[10px] font-extrabold text-emerald-800 mr-1.5">No. {sIdx + 1}</span>
                                <span className="text-xs font-bold text-slate-800 leading-relaxed">{soal.pertanyaan}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-semibold pt-1">
                                {["A", "B", "C", "D"].map((optLetter, optIdx) => {
                                  const isCorrect = soal.jawabanBenar === optLetter;
                                  return (
                                    <div
                                      key={optLetter}
                                      className={`p-1.5 rounded-md border flex items-center gap-1.5 ${
                                        isCorrect
                                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                                          : "bg-slate-50 border-slate-100 text-slate-600"
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${
                                        isCorrect ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                                      }`}>
                                        {optLetter}
                                      </span>
                                      <span className="truncate text-slate-800">{soal.pilihan[optIdx]}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingBab(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    Simpan Bab Pelajaran
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Chapters List view */
            <div className="space-y-6">
              {/* Filter Kelas */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-black text-slate-700">Filter Berdasarkan Kelas LMS:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {["Semua", "VII", "VIII", "IX"].map((kelas) => (
                    <button
                      type="button"
                      key={kelas}
                      onClick={() => setBabKelasFilter(kelas)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                        babKelasFilter === kelas
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {kelas === "Semua" ? "Semua Kelas" : `Kelas ${kelas}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Bab Pelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                {babPelajaran
                  .filter((bab) => babKelasFilter === "Semua" || bab.kelasId === babKelasFilter)
                  .map((bab) => {
                    const videoEmbed = getEmbedInfo(bab.video?.source);
                    return (
                      <div
                        key={bab.id}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                Aktif di LMS
                              </span>
                              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                Kelas {bab.kelasId || "VII"}
                              </span>
                              {bab.soalList && bab.soalList.length > 0 && (
                                <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                                  📝 {bab.soalList.length} Soal Kuis
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditBab(bab)}
                                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                                title="Edit Bab"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBabClick(bab.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Hapus Bab"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {bab.judul}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                          {bab.deskripsi}
                        </p>
                      </div>

                      {/* Video info snippet */}
                      {bab.video && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/70 space-y-1">
                          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                            Media Video Terlampir:
                          </span>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span className="truncate max-w-[200px]">🎥 {bab.video.judul}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{bab.video.duration}</span>
                          </div>
                          <span className="block text-[9px] font-medium text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 truncate">
                            Sumber: {bab.video.source}
                          </span>
                        </div>
                      )}

                      {/* Documents list summary */}
                      <div className="space-y-1">
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Dokumen Terlampir ({bab.dokumen?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {bab.dokumen && bab.dokumen.length > 0 ? (
                            bab.dokumen.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 max-w-[150px] truncate"
                              >
                                📄 {doc.judul}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] text-slate-400 italic">Tidak ada lampiran dokumen</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>ID: {bab.id}</span>
                      <span className="text-emerald-700">Terbaca oleh Siswa</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      ) : viewMode === "generator" ? (
        <GeneratorSoalLKPD
          babPelajaran={babPelajaran}
          onUpdateBabPelajaran={onUpdateBabPelajaran}
        />
      ) : (
        /* ==================== FLAT GRID VIEW MODE ==================== */
        <div className="space-y-6">
          {/* SEARCH BAR & FILTERS PANEL */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul, bab, atau deskripsi dokumen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              {/* Advanced filter select menus */}
              <div className="grid grid-cols-3 gap-2.5 min-w-[340px]">
                <select
                  value={gridKelasFilter}
                  onChange={(e) => setGridKelasFilter(e.target.value)}
                  className="p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none text-slate-600 font-bold"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>

                <select
                  value={gridSemesterFilter}
                  onChange={(e) => setGridSemesterFilter(e.target.value)}
                  className="p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none text-slate-600 font-bold"
                >
                  <option value="Semua">Semua Sem.</option>
                  <option value="1">Sem. 1 Ganjil</option>
                  <option value="2">Sem. 2 Genap</option>
                </select>

                <select
                  value={gridKategoriFilter}
                  onChange={(e) => setGridKategoriFilter(e.target.value)}
                  className="p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none text-slate-600 font-bold"
                >
                  <option value="Semua">Semua Kat.</option>
                  <option value="CP_ATP">CP & ATP</option>
                  <option value="Modul Ajar">Modul Ajar</option>
                  <option value="Media Pembelajaran">Media Ajar</option>
                  <option value="KKTP">KKTP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid display */}
          {filteredGridItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGridItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {item.kategori === "CP_ATP" ? "CP & ATP" : item.kategori}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                          Kls {getItemKelas(item)}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded">
                          Sem. {getItemSemester(item)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400 mr-1">
                          {item.fileSize}
                        </span>
                        {/* Quick actions inside card header */}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition"
                          title="Edit Dokumen"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0 mt-1">
                        {getIconForType(item.mediaType)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.judul}
                        </h4>
                        <span className="block text-[10px] text-emerald-800 font-extrabold uppercase">
                          {item.bab}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Format: {item.mediaType || "PDF"}
                    </span>

                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {/* Preview / Lihat Dokumen Button (PDF, PPT, Word, Excel) */}
                      <button
                        onClick={() => setPreviewDocument(item)}
                        className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-extrabold rounded-lg flex items-center gap-1 transition shadow-sm cursor-pointer"
                        title="Pratinjau / Lihat Dokumen (PDF, PowerPoint, Word, Excel)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Dokumen</span>
                      </button>

                      {/* Tautan Link Button */}
                      <a
                        href={item.downloadUrl && item.downloadUrl !== "#" ? item.downloadUrl : "https://drive.google.com/drive/my-drive"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-100/50 flex items-center gap-1 transition"
                        title="Buka Link Tautan Rujukan"
                      >
                        <ExternalLink className="w-3 h-3 text-indigo-500" />
                        Tautan
                      </a>

                      {/* If Video, show PLAY/STOP trigger */}
                      {item.mediaType === "Video" ? (
                        <button
                          onClick={() => {
                            setActiveVideo(item);
                            setVideoProgress(0);
                            setVideoPlaying(true);
                          }}
                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition shadow-sm shadow-rose-200"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Putar Video
                        </button>
                      ) : item.mediaType === "Canva" ? (
                        <a
                          href={item.downloadUrl && item.downloadUrl !== "#" ? item.downloadUrl : "https://canva.com"}
                          onClick={(e) => {
                            if (!item.downloadUrl || item.downloadUrl === "#") {
                              e.preventDefault();
                              handleDownloadSimulation(item.judul);
                            }
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 flex items-center gap-1 transition"
                        >
                          <ExternalLink className="w-3 h-3 text-amber-500" />
                          Buka Canva
                        </a>
                      ) : (
                        <button
                          onClick={() => handleDownloadSimulation(item.judul)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-100/50 flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3 text-emerald-600" />
                          Unduh Berkas
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs font-semibold">
              Tidak ditemukan dokumen perangkat ajar yang sesuai dengan filter pencarian.
            </div>
          )}
        </div>
      )}

      {/* Info validasi footer banner */}
      <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/50 flex items-start gap-2.5 text-xs text-amber-800">
        <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong>Informasi Penjaminan Mutu:</strong> Seluruh berkas administrasi ajar ini disinkronisasikan langsung ke dalam dashboard validasi Kepala Sekolah dan Pengawas Pembina Dinas Pendidikan untuk keperluan supervisi berkala.
        </div>
      </div>

      {/* ==================== EDIT DIALOG/MODAL ==================== */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="px-6 py-4 bg-emerald-700 text-white flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Perangkat Ajar
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-white hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Kategori Dokumen
                  </label>
                  <select
                    value={editingItem.kategori}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        kategori: e.target.value as any
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-slate-50 font-semibold"
                  >
                    <option value="CP_ATP">CP & ATP</option>
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="Media Pembelajaran">Media Pembelajaran</option>
                    <option value="KKTP">KKTP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Format Berkas
                  </label>
                  <select
                    value={editingItem.mediaType}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        mediaType: e.target.value as any
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-slate-50 font-semibold"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="PPT">PowerPoint (.ppt / .pptx)</option>
                    <option value="Word">Word (.doc / .docx)</option>
                    <option value="Excel">Excel (.xls / .xlsx)</option>
                    <option value="Video">Video (MP4 / YouTube)</option>
                    <option value="Canva">Canva / Link</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Kelas
                  </label>
                  <select
                    value={getItemKelas(editingItem)}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        kelas: e.target.value
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-slate-50 font-semibold"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Semester
                  </label>
                  <select
                    value={getItemSemester(editingItem)}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        semester: e.target.value
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-slate-50 font-semibold"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.judul}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        judul: e.target.value
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Bab / Lingkup Materi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.bab}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        bab: e.target.value
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Ukuran Berkas
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.fileSize}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        fileSize: e.target.value
                      })
                    }
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Tautan / Link URL Berkas (Contoh: Google Drive, Canva, YouTube, dll.)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: https://drive.google.com/drive/folders/... atau #"
                  value={editingItem.downloadUrl || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      downloadUrl: e.target.value
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none font-semibold text-slate-800 mb-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingItem.deskripsi}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      deskripsi: e.target.value
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deletingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-slate-800">
                Konfirmasi Hapus Dokumen
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus dokumen <strong>"{deletingItem.judul}"</strong> dari arsip perangkat ajar? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition flex-1"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE VIDEO PLAYER MODAL ==================== */}
      {activeVideo && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-950 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-slate-100">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 rounded border border-rose-500/20">
                  <Video className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black text-slate-200 truncate max-w-[400px]">
                    {activeVideo.judul}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                    {activeVideo.bab} • Media Pembelajaran Kelas {getItemKelas(activeVideo)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setVideoPlaying(false);
                  setActiveVideo(null);
                }}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas/Visualizer */}
            {(() => {
              const embedInfo = getEmbedInfo(activeVideo.downloadUrl);
              const content = getVideoContent(activeVideo.judul, videoProgress);
              const accentBgMap: Record<string, string> = {
                amber: "bg-amber-500",
                yellow: "bg-yellow-500",
                indigo: "bg-indigo-500",
                emerald: "bg-emerald-500",
                teal: "bg-teal-500",
                purple: "bg-purple-500",
                blue: "bg-blue-500",
                cyan: "bg-cyan-500"
              };
              const dotBgClass = accentBgMap[content.accentColor] || "bg-rose-500";
              const borderClassMap: Record<string, string> = {
                amber: "border-amber-500/25",
                yellow: "border-yellow-500/25",
                indigo: "border-indigo-500/25",
                emerald: "border-emerald-500/25",
                teal: "border-teal-500/25",
                purple: "border-purple-500/25",
                blue: "border-blue-500/25",
                cyan: "border-cyan-500/25"
              };
              const borderClass = borderClassMap[content.accentColor] || "border-rose-500/25";
              const textClassMap: Record<string, string> = {
                amber: "text-amber-400",
                yellow: "text-yellow-400",
                indigo: "text-indigo-400",
                emerald: "text-emerald-400",
                teal: "text-teal-400",
                purple: "text-purple-400",
                blue: "text-blue-400",
                cyan: "text-cyan-400"
              };
              const textColorClass = textClassMap[content.accentColor] || "text-rose-400";

              return (
                <div className="relative w-full aspect-video flex flex-col items-center justify-center overflow-hidden border-b border-slate-900 bg-black">
                  {/* Mode switcher if embed info is available */}
                  {embedInfo && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/90 border border-slate-800/80 p-0.5 rounded-lg flex items-center shadow-2xl">
                      <button
                        onClick={() => setPlayerMode("video")}
                        className={`px-3 py-1 rounded text-[10px] font-black tracking-wide transition ${
                          playerMode === "video"
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        🎥 VIDEO UTAMA
                      </button>
                      <button
                        onClick={() => setPlayerMode("slide")}
                        className={`px-3 py-1 rounded text-[10px] font-black tracking-wide transition ${
                          playerMode === "slide"
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        💡 MODUL SLIDE
                      </button>
                    </div>
                  )}

                  {/* Render based on Mode */}
                  {embedInfo && playerMode === "video" ? (
                    <div className="absolute inset-0 w-full h-full bg-black z-10 flex items-center justify-center">
                      {embedInfo.type === "direct" ? (
                        <video
                          src={embedInfo.embedUrl}
                          controls
                          autoPlay={videoPlaying}
                          onPlay={() => setVideoPlaying(true)}
                          onPause={() => setVideoPlaying(false)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={embedInfo.embedUrl}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          title={activeVideo.judul}
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      )}
                    </div>
                  ) : (
                    // Slide Simulation Mode
                    <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${content.bgGradient}`}>
                      {/* Subtle spinning geometric overlay */}
                      <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] ${videoPlaying ? "animate-[pulse_4s_infinite_ease-in-out]" : ""}`} />
                      
                      {/* Clickable zone to play/pause */}
                      <div 
                        onClick={() => setVideoPlaying(!videoPlaying)} 
                        className="absolute inset-0 z-10 cursor-pointer" 
                        title={videoPlaying ? "Klik untuk Jeda" : "Klik untuk Putar"}
                      />

                      {/* Interactive Blackboard / Educational Screen */}
                      <div className={`relative z-20 bg-slate-950/85 border ${borderClass} rounded-2xl p-4 md:p-5 w-[85%] max-w-lg shadow-2xl backdrop-blur-sm transition duration-300 transform ${videoPlaying ? "scale-[1.01]" : "scale-100"}`}>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          {/* Left Side: Animated Illustration */}
                          <div className="w-full md:w-5/12 bg-slate-900/40 rounded-xl p-2 border border-slate-800/60 flex items-center justify-center shrink-0">
                            {renderVideoIllustration(content.illustrationType, videoPlaying, videoProgress)}
                          </div>

                          {/* Right Side: Key Learning Bullets */}
                          <div className="flex-1 flex flex-col justify-center text-left">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${textColorClass} mb-0.5`}>
                              Materi Aktif • Slide {videoProgress < 25 ? "1" : videoProgress < 65 ? "2" : videoProgress < 115 ? "3" : videoProgress < 155 ? "4" : "5"}
                            </span>
                            <h4 className="text-[11px] md:text-xs font-black text-slate-100 tracking-tight leading-snug line-clamp-1">
                              {content.slideTitle}
                            </h4>
                            
                            <div className="w-8 h-0.5 bg-slate-800 my-1.5" />

                            <ul className="space-y-1 text-[9.5px] md:text-[10.5px] text-slate-300 font-bold leading-normal">
                              {content.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotBgClass}`} />
                                  <span className="line-clamp-1">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Audio Wave Indicator in corner */}
                      {videoPlaying && (
                        <div className="absolute bottom-4 right-4 z-20 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1">
                          <span className="text-[8px] font-mono text-emerald-400 font-black mr-1 tracking-wider uppercase animate-pulse">Audio</span>
                          <div className="flex items-end gap-0.5 h-2.5">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="bg-emerald-500 w-[2px] rounded-full transition-all duration-300"
                                style={{
                                  height: `${4 + Math.sin((videoProgress + i) * 2) * 6}px`,
                                  animation: `pulse 1s infinite ease-in-out ${i * 0.15}s`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Live CC / Subtitle Overlay */}
                      <div className="absolute bottom-16 left-4 right-4 z-20 flex justify-center pointer-events-none">
                        <p className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] md:text-[11px] leading-relaxed text-slate-100 font-extrabold tracking-wide text-center border border-slate-800/80 max-w-[90%] shadow-2xl transition duration-300">
                          "{content.caption}"
                        </p>
                      </div>

                      {/* Hover/Paused Play overlay */}
                      {!videoPlaying && (
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px] flex items-center justify-center z-20 pointer-events-none transition duration-200">
                          <div className="w-14 h-14 bg-rose-600/90 text-white rounded-full flex items-center justify-center border border-rose-400/40 shadow-2xl scale-110 animate-pulse">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Beautiful Floating watermarks */}
                      <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800/80 z-20">
                        MEDIA DIGITAL PAI
                      </div>

                      <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800/80 flex items-center gap-1.5 z-20">
                        <div className={`w-1.5 h-1.5 rounded-full ${videoPlaying ? "bg-rose-500 animate-ping" : "bg-slate-500"}`}></div>
                        <span>{videoPlaying ? "PLAYING" : "PAUSED"}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Custom Interactive Player Controller (Play, Pause, Stop) */}
            <div className="p-5 bg-slate-900 space-y-5">
              {getEmbedInfo(activeVideo.downloadUrl) && playerMode === "video" && (
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 justify-between">
                  <div className="text-left text-[11px] font-medium text-slate-400 leading-relaxed max-w-[70%]">
                    💡 <strong>Kontrol Pemutaran Video Aktif:</strong> Anda dapat memutar, menjeda, mengatur volume, dan memperbesar video langsung melalui tombol kontrol internal yang ada pada tampilan video di atas.
                  </div>
                  <a
                    href={activeVideo.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition transform active:scale-95 shadow-md shadow-rose-950/40 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Tonton di YouTube
                  </a>
                </div>
              )}

              {/* Seek track progress bar - enlarged clickable overlay zone */}
              <div className="space-y-1.5">
                <div
                  className="w-full py-2.5 -my-2.5 cursor-pointer group/track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    setVideoProgress(Math.min(videoDuration, Math.max(0, Math.floor(percentage * videoDuration))));
                  }}
                  title="Geser Durasi Video"
                >
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative border border-slate-700/50 group-hover/track:border-slate-600 transition">
                    <div
                      className="bg-rose-500 h-full transition-all duration-100 group-hover/track:bg-rose-400"
                      style={{ width: `${(videoProgress / videoDuration) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 font-extrabold px-1">
                  <span>{formatTime(videoProgress)}</span>
                  <span>{formatTime(videoDuration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play Button */}
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs md:text-sm font-black tracking-wide transition-all duration-150 transform active:scale-95 ${
                      videoPlaying
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 hover:shadow-emerald-500/20"
                    }`}
                    disabled={videoPlaying}
                    title="Mulai Putar"
                  >
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>PUTAR</span>
                  </button>

                  {/* Pause Button */}
                  <button
                    onClick={() => setVideoPlaying(false)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs md:text-sm font-black tracking-wide transition-all duration-150 transform active:scale-95 ${
                      !videoPlaying && videoProgress > 0
                        ? "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-950/60 hover:shadow-amber-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                    disabled={!videoPlaying}
                    title="Jeda (Pause)"
                  >
                    <Pause className="w-4 h-4 fill-current shrink-0" />
                    <span>JEDA</span>
                  </button>

                  {/* Stop Button */}
                  <button
                    onClick={() => {
                      setVideoPlaying(false);
                      setVideoProgress(0);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs md:text-sm font-black tracking-wide transition-all duration-150 transform active:scale-95 shadow-lg shadow-rose-950/60 hover:shadow-rose-500/20"
                    title="Hentikan (Stop)"
                  >
                    <Square className="w-4 h-4 fill-current shrink-0" />
                    <span>STOP</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-extrabold bg-slate-950 px-4 py-3 rounded-xl border border-slate-800/80">
                  <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                  <span>Audio Terintegrasi Aktif</span>
                </div>
              </div>
            </div>

            {/* Footer summary */}
            <div className="px-6 py-3 bg-slate-950/60 text-center text-[10px] text-slate-500 border-t border-slate-900">
              Media Pembelajaran Digital terverifikasi Kurikulum Merdeka UPT SMPN 2 Rebang Tangkas
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PRATINJAU DOKUMEN (PDF, POWERPOINT, WORD, EXCEL) ==================== */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Top Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 shrink-0">
                  {getIconForType(previewDocument.mediaType)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                      {previewDocument.mediaType || "PDF"}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded-md">
                      {previewDocument.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Kelas {getItemKelas(previewDocument)} • Semester {getItemSemester(previewDocument)}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                    {previewDocument.judul}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                  title="Cetak Dokumen"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>

                <button
                  onClick={() => handleDownloadSimulation(previewDocument.judul)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md cursor-pointer"
                  title="Unduh File Perangkat Ajar"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh Berkas</span>
                </button>

                {previewDocument.downloadUrl && previewDocument.downloadUrl !== "#" && (
                  <a
                    href={previewDocument.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    title="Buka Tautan Asli"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Buka Tautan</span>
                  </a>
                )}

                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  title="Tutup Modal Pratinjau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Viewers */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-950 text-slate-100">
              {/* 1. POWERPOINT / PPT VIEWER */}
              {(previewDocument.mediaType === "PPT" || previewDocument.judul.toLowerCase().includes("ppt") || previewDocument.judul.toLowerCase().includes("slide")) ? (
                <div className="space-y-4">
                  {/* Presentation Control Bar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-400 flex items-center gap-1">
                        <Presentation className="w-4 h-4" /> Presentasi PowerPoint
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-medium">Slide {pptCurrentSlide + 1} dari 6</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPptCurrentSlide(Math.max(0, pptCurrentSlide - 1))}
                        disabled={pptCurrentSlide === 0}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        onClick={() => setPptCurrentSlide(Math.min(5, pptCurrentSlide + 1))}
                        disabled={pptCurrentSlide === 5}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPptIsPlaying(!pptIsPlaying)}
                        className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${pptIsPlaying ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
                      >
                        {pptIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{pptIsPlaying ? "Jeda Slide" : "Putar Slide"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Slide Stage Canvas */}
                  <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
                    {/* Background Graphic Watermark */}
                    <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Slide Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-md uppercase">
                          Slide {pptCurrentSlide + 1}
                        </span>
                        <span className="text-xs font-bold text-amber-200">
                          {previewDocument.bab}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        UPT SMPN 2 REBANG TANGKAS • PAI FASE D
                      </span>
                    </div>

                    {/* Dynamic Slide Content by Slide Index */}
                    <div className="my-auto py-4 space-y-3">
                      {pptCurrentSlide === 0 && (
                        <div className="text-center space-y-4 max-w-2xl mx-auto py-4">
                          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold rounded-full">
                            PRESENTASI MEDIA PEMBELAJARAN DIGITAL
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                            {previewDocument.judul}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                            {previewDocument.deskripsi || "Media tayang interaktif untuk mendukung proses belajar mengajar PAI & Budi Pekerti SMP Kurikulum Merdeka."}
                          </p>
                          <div className="pt-2 text-xs font-bold text-amber-400">
                            Disusun oleh: Guru Mata Pelajaran PAI & Budi Pekerti
                          </div>
                        </div>
                      )}

                      {pptCurrentSlide === 1 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl font-black text-amber-300 border-l-4 border-amber-500 pl-3">
                            Peta Konsep & Tujuan Pembelajaran (ATP)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase">Fokus 1</span>
                              <h4 className="text-xs font-bold text-white">Pemahaman Konsep & Dalil</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">Memahami dasar hukum Islam, ayat Al-Qur'an dan Hadits terkait materi.</p>
                            </div>
                            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase">Fokus 2</span>
                              <h4 className="text-xs font-bold text-white">Praktik & Tata Cara</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">Menerapkan tata cara ibadah dan perilaku akhlak terpuji secara mandiri.</p>
                            </div>
                            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase">Fokus 3</span>
                              <h4 className="text-xs font-bold text-white">Hikmah & Budi Pekerti</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">Meneladani ketaatan dan menumbuhkan profil pelajar Pancasila di sekolah.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {pptCurrentSlide === 2 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl font-black text-amber-300 border-l-4 border-amber-500 pl-3">
                            Inti Pembahasan & Ketentuan Pokok
                          </h3>
                          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Definisi & Syarat:</strong> Ketentuan wajib yang harus dipenuhi oleh setiap peserta didik sesuai syariat Islam.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Rukun & Tata Cara:</strong> Tahapan urut (tertib) dalam pelaksanaan ibadah maupun penerapan perilaku terpuji.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Hal-hal yang Membatalkan / Menggugurkan:</strong> Pemahaman hal larangan agar pelaksanaan ibadah sah dan berkah.</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {pptCurrentSlide === 3 && (
                        <div className="space-y-3 text-left">
                          <h3 className="text-xl font-black text-amber-300 border-l-4 border-amber-500 pl-3">
                            Dalil Naqli Al-Qur'an & Hadits
                          </h3>
                          <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/30 text-center space-y-3">
                            <p className="text-xl sm:text-2xl font-serif text-amber-200 leading-loose" dir="rtl">
                              يَٰٓأَيُّهَا الَّذِينَ ءَامَنُوا۟ إِذَا قُمْتُمْ إِلَى الصَّلَوٰةِ فَاغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ
                            </p>
                            <div className="h-px bg-slate-800 w-3/4 mx-auto" />
                            <p className="text-xs sm:text-sm text-slate-300 italic font-medium">
                              "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan salat, maka basuhlah wajahmu dan tanganmu sampai ke siku..." (QS. Al-Ma'idah: 6)
                            </p>
                          </div>
                        </div>
                      )}

                      {pptCurrentSlide === 4 && (
                        <div className="space-y-3 text-left">
                          <h3 className="text-xl font-black text-amber-300 border-l-4 border-amber-500 pl-3">
                            Aktivitas Kelompok & Studi Kasus
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">Tugas Diskusi A</span>
                              <p className="text-xs text-slate-300">Diskusi kelompok mengenai penerapan kejujuran dan disiplin ibadah dalam kehidupan sekolah.</p>
                            </div>
                            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">Tugas Diskusi B</span>
                              <p className="text-xs text-slate-300">Praktik peragaan bersama tata cara ibadah secara bergantian antarkelompok.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {pptCurrentSlide === 5 && (
                        <div className="space-y-4 text-center py-2">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
                            KESIMPULAN & REFLEKSI AKHIR
                          </span>
                          <h3 className="text-2xl font-black text-white">
                            Rangkuman Materi & Evaluasi Formatif
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                            Mari kita biasakan mengamalkan pembelajaran PAI ini dalam ibadah harian dan pergaulan sesama teman di sekolah maupun masyarakat.
                          </p>
                          <button
                            onClick={() => handleDownloadSimulation(previewDocument.judul)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Unduh File PPT Lengkap
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Slide Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400 font-medium">
                      <span>Modul Media Ajar Digital PAI SMP</span>
                      <span>Halaman Slide {pptCurrentSlide + 1} / 6</span>
                    </div>
                  </div>

                  {/* Thumbnail Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setPptCurrentSlide(idx)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold shrink-0 transition border cursor-pointer ${
                          pptCurrentSlide === idx
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        Slide {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (previewDocument.mediaType === "Word" || previewDocument.judul.toLowerCase().includes("doc") || previewDocument.judul.toLowerCase().includes("rpp") || previewDocument.judul.toLowerCase().includes("modul")) ? (
                /* 2. MICROSOFT WORD (.DOC / .DOCX) VIEWER */
                <div className="space-y-4">
                  {/* Word Ribbon Toolbar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-blue-400 flex items-center gap-1">
                        <FileText className="w-4 h-4" /> Microsoft Word (.docx)
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded font-semibold text-[11px]">
                        Mode Pembaca Dokumen RPP / Modul Ajar
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print / PDF
                      </button>
                      <button
                        onClick={() => handleDownloadSimulation(previewDocument.judul)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh .docx
                      </button>
                    </div>
                  </div>

                  {/* Word A4 Document Paper Canvas */}
                  <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-10 max-w-3xl mx-auto shadow-2xl border border-slate-200 space-y-6 text-left font-sans leading-relaxed">
                    {/* Kop Surat Resmi */}
                    <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        DINAS PENDIDIKAN & KEBUDAYAAN UPT SMPN 2 REBANG TANGKAS
                      </h4>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        PERANGKAT AJAR PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        Kurikulum Merdeka Fase D • Tahun Ajaran 2025/2026
                      </p>
                    </div>

                    {/* Identitas Dokumen */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold text-slate-800">
                        <div><strong className="text-slate-600">Nama Dokumen:</strong> {previewDocument.judul}</div>
                        <div><strong className="text-slate-600">Lingkup Bab:</strong> {previewDocument.bab}</div>
                        <div><strong className="text-slate-600">Sasaran Kelas:</strong> Kelas {getItemKelas(previewDocument)} (Semester {getItemSemester(previewDocument)})</div>
                        <div><strong className="text-slate-600">Ukuran / Status:</strong> {previewDocument.fileSize} (Tersimpan di Server)</div>
                      </div>
                    </div>

                    {/* Isi Dokumen Word */}
                    <div className="space-y-4 text-xs text-slate-800">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
                          I. CAPAIAN PEMBELAJARAN & TUJUAN PEMBELAJARAN
                        </h4>
                        <p className="leading-relaxed">
                          Peserta didik mampu memahami dan menerapkan ketentuan syariat Islam, nilai-nilai akhlak terpuji, serta meneladani sejarah peradaban Islam dalam kehidupan sehari-hari dengan penuh tanggung jawab.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
                          II. RINGKASAN DESKRIPSI PELAKSANAAN
                        </h4>
                        <p className="leading-relaxed">
                          {previewDocument.deskripsi || "Modul ini memuat rancangan kegiatan belajar aktif, lembar diskusi siswa, penilaian sikap spiritual dan sosial, serta kisi-kisi asesmen formatif PAI."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
                          III. KEGIATAN PEMBELAJARAN
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 pl-1 font-medium">
                          <li><strong>Pendahuluan (10 Menit):</strong> Membuka dengan doa bersama, membaca Al-Qur'an surah pendek, dan apersepsi.</li>
                          <li><strong>Kegiatan Inti (60 Menit):</strong> Mengamati tayangan/materi, diskusi kelompok, presentasi hasil karya siswa, dan penguatan dari guru.</li>
                          <li><strong>Penutup (10 Menit):</strong> Refleksi bersama, evaluasi singkat, penyampaian tugas rumah, dan doa penutup.</li>
                        </ol>
                      </div>

                      <div className="space-y-1 pt-2">
                        <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
                          IV. ASESMEN & KRITERIA KETERCAPAIAN (KKTP)
                        </h4>
                        <p className="leading-relaxed">
                          Asesmen menggunakan tes tertulis pilihan ganda, tugas unjuk kerja/praktik ibadah, dan penilaian jurnal sikap harian siswa.
                        </p>
                      </div>
                    </div>

                    {/* Pengesahan Tanda Tangan */}
                    <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-800 font-semibold">
                      <div>
                        <p>Mengetahui,</p>
                        <p className="font-bold">Kepala UPT SMPN 2 Rebang Tangkas</p>
                        <div className="h-16" />
                        <p className="font-black underline">Drs. H. M. YUSUF, M.Pd.</p>
                        <p className="text-[10px] text-slate-500">NIP. 19680312 199403 1 004</p>
                      </div>
                      <div>
                        <p>Guru Mata Pelajaran PAI,</p>
                        <p className="font-bold">Pengampu PAI & Budi Pekerti</p>
                        <div className="h-16" />
                        <p className="font-black underline">SALIM ARSAD, S.Pd.I.</p>
                        <p className="text-[10px] text-slate-500">NIP. 19850520 201101 1 012</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (previewDocument.mediaType === "Excel" || previewDocument.judul.toLowerCase().includes("xls") || previewDocument.judul.toLowerCase().includes("kktp") || previewDocument.judul.toLowerCase().includes("matriks")) ? (
                /* 3. MICROSOFT EXCEL (.XLS / .XLSX) SPREADSHEET VIEWER */
                <div className="space-y-4">
                  {/* Excel Ribbon & Formula Bar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                          <Table className="w-4 h-4" /> Microsoft Excel (.xlsx)
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-semibold text-[11px]">
                          Spreadsheet Penilaian & Matriks KKTP PAI
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadSimulation(previewDocument.judul)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh .xlsx
                        </button>
                      </div>
                    </div>

                    {/* Formula Bar */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold shrink-0">fx</span>
                      <span className="text-slate-500 shrink-0">B4:</span>
                      <span className="text-slate-200 truncate font-semibold">
                        =IF(AVERAGE(D4:G4)&gt;=75, "TUNTAS", "PERLU BIMBINGAN")
                      </span>
                    </div>
                  </div>

                  {/* Sheet Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
                    {["📊 Matriks KKTP & Kriteria", "📝 Rekap Nilai Formatif & Sumatif", "📖 Progress Hafalan Juz Amma"].map((tabName, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setExcelActiveSheet(tIdx)}
                        className={`px-3 py-1.5 rounded-t-lg text-xs font-extrabold transition cursor-pointer ${
                          excelActiveSheet === tIdx
                            ? "bg-emerald-600 text-white border-b-2 border-emerald-400"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {tabName}
                      </button>
                    ))}
                  </div>

                  {/* Excel Interactive Grid Table */}
                  <div className="bg-white text-slate-900 rounded-xl border border-slate-300 overflow-x-auto shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300 text-center">
                          <th className="p-2 border-r border-slate-300 w-12 bg-slate-300">#</th>
                          <th className="p-2 border-r border-slate-300 w-28">A (NISN)</th>
                          <th className="p-2 border-r border-slate-300">B (Nama Peserta Didik)</th>
                          <th className="p-2 border-r border-slate-300 w-24">C (Formatif 1)</th>
                          <th className="p-2 border-r border-slate-300 w-24">D (Formatif 2)</th>
                          <th className="p-2 border-r border-slate-300 w-24">E (Sumatif PTS)</th>
                          <th className="p-2 border-r border-slate-300 w-24">F (Sumatif PAS)</th>
                          <th className="p-2 border-r border-slate-300 w-24 bg-emerald-100 font-black">G (Rata-Rata)</th>
                          <th className="p-2 w-32 bg-slate-100 font-black">H (Status KKTP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                        {[
                          { nisn: "0081234561", nama: "Ahmad Rizky Pratama", f1: 88, f2: 90, pts: 85, pas: 92 },
                          { nisn: "0081234562", nama: "Aisyah Nabila Putri", f1: 92, f2: 95, pts: 90, pas: 94 },
                          { nisn: "0081234563", nama: "Bagas Satria Wibowo", f1: 78, f2: 82, pts: 80, pas: 84 },
                          { nisn: "0081234564", nama: "Citra Dewi Lestari", f1: 85, f2: 88, pts: 86, pas: 89 },
                          { nisn: "0081234565", nama: "Dimas Anggara", f1: 70, f2: 74, pts: 72, pas: 75 },
                          { nisn: "0081234566", nama: "Farah Diba", f1: 90, f2: 92, pts: 88, pas: 91 },
                          { nisn: "0081234567", nama: "Gilang Ramadhan", f1: 84, f2: 86, pts: 85, pas: 87 }
                        ].map((row, idx) => {
                          const avg = Math.round((row.f1 + row.f2 + row.pts + row.pas) / 4);
                          const isTuntas = avg >= 75;
                          return (
                            <tr key={idx} className="hover:bg-emerald-50/50 transition">
                              <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500 bg-slate-100">{idx + 1}</td>
                              <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-center">{row.nisn}</td>
                              <td className="p-2 border-r border-slate-200 font-bold">{row.nama}</td>
                              <td className="p-2 border-r border-slate-200 text-center">{row.f1}</td>
                              <td className="p-2 border-r border-slate-200 text-center">{row.f2}</td>
                              <td className="p-2 border-r border-slate-200 text-center">{row.pts}</td>
                              <td className="p-2 border-r border-slate-200 text-center">{row.pas}</td>
                              <td className="p-2 border-r border-slate-200 text-center font-black bg-emerald-50 text-emerald-900">{avg}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${isTuntas ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                  {isTuntas ? "TUNTAS (≥75)" : "PERLU BIMBINGAN"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : previewDocument.mediaType === "Video" ? (
                /* 4. VIDEO MEDIA VIEWER */
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative flex items-center justify-center">
                    {previewDocument.downloadUrl && previewDocument.downloadUrl.includes("youtube.com") ? (
                      <iframe
                        src={previewDocument.downloadUrl.replace("watch?v=", "embed/")}
                        className="w-full h-full border-0"
                        allowFullScreen
                        title={previewDocument.judul}
                      />
                    ) : (
                      <div className="text-center p-8 space-y-3">
                        <Video className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                        <h3 className="text-base font-bold text-white">{previewDocument.judul}</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">{previewDocument.deskripsi}</p>
                        <a
                          href={previewDocument.downloadUrl !== "#" ? previewDocument.downloadUrl : "https://youtube.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition"
                        >
                          <ExternalLink className="w-4 h-4" /> Buka Tautan Video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 5. PDF & GENERAL DOCUMENT VIEWER */
                <div className="space-y-4">
                  {/* PDF Viewer Controls Bar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <FileText className="w-4 h-4" /> Dokumen PDF Digital
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-medium">Halaman {pdfPage} dari 5</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPdfPage(Math.max(1, pdfPage - 1))}
                        disabled={pdfPage === 1}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        onClick={() => setPdfPage(Math.min(5, pdfPage + 1))}
                        disabled={pdfPage === 5}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="h-4 w-px bg-slate-800 mx-1" />
                      <button
                        onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono text-slate-300 font-bold px-1">{pdfZoom}%</span>
                      <button
                        onClick={() => setPdfZoom(Math.min(150, pdfZoom + 10))}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Render iframe if real blob URL or external link exists, else render rich A4 Document Canvas */}
                  {previewDocument.downloadUrl && (previewDocument.downloadUrl.startsWith("blob:") || previewDocument.downloadUrl.startsWith("http")) && previewDocument.downloadUrl !== "#" ? (
                    <iframe
                      src={previewDocument.downloadUrl}
                      className="w-full h-[600px] rounded-xl border border-slate-800 bg-white"
                      title={previewDocument.judul}
                    />
                  ) : (
                    <div
                      style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: "top center" }}
                      className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 max-w-3xl mx-auto shadow-2xl border border-slate-200 font-serif leading-relaxed text-left space-y-6 transition-all duration-200"
                    >
                      {/* Kop Dokumen PDF */}
                      <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                        <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-500">
                          UPT SMPN 2 REBANG TANGKAS — KURIKULUM MERDEKA
                        </h4>
                        <h2 className="text-base font-sans font-black text-slate-900 uppercase tracking-tight">
                          PERANGKAT AJAR DOKUMEN DIGITAL (PDF)
                        </h2>
                        <p className="text-[11px] font-sans text-slate-600 font-medium">
                          {previewDocument.kategori} • {previewDocument.bab}
                        </p>
                      </div>

                      <div className="space-y-4 font-sans text-xs text-slate-800">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <h3 className="text-sm font-black text-slate-900">{previewDocument.judul}</h3>
                          <p className="text-slate-600 leading-relaxed">{previewDocument.deskripsi}</p>
                          <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-500 font-bold border-t border-slate-200">
                            <span>Mata Pelajaran: PAI & Budi Pekerti</span>
                            <span>Kelas: {getItemKelas(previewDocument)}</span>
                            <span>Semester: {getItemSemester(previewDocument)}</span>
                            <span>Ukuran: {previewDocument.fileSize}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <h4 className="font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
                            RINGKASAN CAKUPAN MATERI (HALAMAN {pdfPage})
                          </h4>
                          <p className="leading-relaxed">
                            Dokumen ini telah terverifikasi secara resmi oleh Tim Pengembang Kurikulum PAI UPT SMPN 2 Rebang Tangkas. Berisi pedoman pelaksanaan kegiatan pembelajaran, instrumen asesmen formatif, serta rubrik penilaian Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
                          </p>
                          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
                            <li>Panduan pelaksanaan kegiatan pembelajaran tatap muka dan diskusi mandiri.</li>
                            <li>Teks bacaan, dalil Naqli, dan lembar kerja peserta didik (LKPD) PAI.</li>
                            <li>Instrumen rubrik observasi sikap dan penilaian harian.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200 flex items-center justify-between font-sans text-[10px] text-slate-400 font-bold">
                        <span>Verified Digital PDF Document • UPT SMPN 2 Rebang Tangkas</span>
                        <span>Halaman {pdfPage} dari 5</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 font-semibold shrink-0">
              Pratinjau Berkas Administrasi & Perangkat Ajar Digital UPT SMPN 2 Rebang Tangkas
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // HELPER RENDER FUNCTION FOR FOLDER CARDS WITH ACTIONS
  function renderCategoryFolder(
    label: string,
    cat: PerangkatAjar["kategori"],
    catItems: PerangkatAjar[],
    borderClass: string
  ) {
    return (
      <div className={`bg-slate-50/50 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between min-h-[280px] ${borderClass}`}>
        <div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
              {label}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
              {catItems.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {catItems.length > 0 ? (
              catItems.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 bg-white rounded-lg border border-slate-100/80 hover:border-emerald-200 hover:shadow-xs transition relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="mt-0.5 shrink-0 text-slate-400">
                        {getIconForType(doc.mediaType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5
                          onClick={() => setPreviewDocument(doc)}
                          className="text-[11px] font-bold text-slate-800 truncate cursor-pointer hover:text-blue-700 hover:underline"
                          title="Klik untuk pratinjau dokumen"
                        >
                          {doc.judul}
                        </h5>
                        <p className="text-[9px] text-slate-400 truncate font-semibold mt-0.5">
                          {doc.bab} • {doc.fileSize}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      {/* Lihat / Pratinjau Dokumen Button */}
                      <button
                        onClick={() => setPreviewDocument(doc)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 active:scale-90 rounded-md transition duration-150 cursor-pointer"
                        title="Lihat Pratinjau Dokumen (PDF, PPT, Word, Excel)"
                      >
                        <Eye className="w-3 h-3" />
                      </button>

                      {/* Action Play/Canva/Unduh */}
                      {doc.mediaType === "Video" ? (
                        <button
                          onClick={() => {
                            setActiveVideo(doc);
                            setVideoProgress(0);
                            setVideoPlaying(true);
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 active:scale-90 text-rose-600 rounded-md transition duration-150"
                          title="Putar Video"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      ) : doc.mediaType === "Canva" ? (
                        <a
                          href={doc.downloadUrl && doc.downloadUrl !== "#" ? doc.downloadUrl : "https://canva.com"}
                          onClick={(e) => {
                            if (!doc.downloadUrl || doc.downloadUrl === "#") {
                              e.preventDefault();
                              handleDownloadSimulation(doc.judul);
                            }
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 active:scale-90 text-amber-700 rounded-md transition duration-150"
                          title="Buka Canva"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => handleDownloadSimulation(doc.judul)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 active:scale-90 text-emerald-700 rounded-md transition duration-150"
                          title="Unduh Berkas"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      )}

                      {/* Tautan Link */}
                      <a
                        href={doc.downloadUrl && doc.downloadUrl !== "#" ? doc.downloadUrl : "https://drive.google.com/drive/my-drive"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 active:scale-90 rounded-md transition duration-150"
                        title="Buka Tautan Link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingItem(doc)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 active:scale-90 rounded-md transition duration-150"
                        title="Edit Dokumen"
                      >
                        <Edit className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingItem(doc)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 rounded-md transition duration-150"
                        title="Hapus Dokumen"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400/80 italic text-center py-6">
                Belum ada berkas
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 text-[9px] text-slate-400 font-medium">
          Divalidasi Kepala Sekolah
        </div>
      </div>
    );
  }
}
