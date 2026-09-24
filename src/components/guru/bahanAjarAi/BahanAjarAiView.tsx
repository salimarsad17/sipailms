/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  BookOpen,
  Image,
  Film,
  Gamepad2,
  HelpCircle,
  Presentation,
  FileText,
  Heart,
  Plus,
  Trash2,
  Layers,
  Check,
  Copy,
  Printer,
  Save,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Tag,
  Zap,
  BookMarked,
  Info,
  X,
  Users,
  CheckCheck,
  Globe
} from "lucide-react";

import { BahanAjarAiItem, PilihanMediaAi, VideoConfig, GameEdukasiData } from "../../../types/bahanAjarAi";
import { PRESET_BAHAN_AJAR_AI_LIST } from "../../../data/bahanAjarAiPresets";
import { DataService } from "../../../data/initialData";
import GameEdukasiPlayable from "./GameEdukasiPlayable";
import KuisAiInteractive from "./KuisAiInteractive";
import VideoStoryboardViewer from "./VideoStoryboardViewer";
import GambarAiViewer from "./GambarAiViewer";
import PptSlideViewer from "./PptSlideViewer";
import GameEngine from "./GameEngine";
import QuizPlayer from "./QuizPlayer";

const STORAGE_KEY = "sipailms_bahan_ajar_ai_active";

// PANDUAN 12 BAGIAN UTAMA BAHAN AJAR AI
export interface BagianAiGuideItem {
  nomor: number;
  nama: string;
  fungsiAi: string;
  deskripsi: string;
  penerapan: string;
  tips: string;
  iconBg: string;
}

export const PANDUAN_12_BAGIAN_AI: Record<number, BagianAiGuideItem> = {
  1: {
    nomor: 1,
    nama: "Identitas Pembelajaran",
    fungsiAi: "Menentukan Konteks & Kalibrasi Kognitif Materi",
    deskripsi: "Mesin AI membaca jenjang kelas (Fase D SMP), semester, alokasi jam tatap muka, dan karakteristik murid untuk mengkalibrasi kompleksitas bahasa, kedalaman dalil naqli, dan gaya tutur narator agar selaras dengan tahap kognitif peserta didik.",
    penerapan: "Kop resmi dokumen bahan ajar, kalibrasi gaya bahasa narasi video, dan tingkat kerumitan soal asesmen.",
    tips: "Pilih kelas (VII/VIII/IX) dan alokasi waktu secara presisi agar estimasi durasi pembelajaran dan narasi AI pas.",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  2: {
    nomor: 2,
    nama: "Tujuan Pembelajaran",
    fungsiAi: "Menentukan Batas Ruang Lingkup & Pagar Konten AI",
    deskripsi: "Berperan sebagai parameter pembatas (guardrail) utama. AI menyelaraskan seluruh materi turunan, kisi-kisi soal kuis, adegan video, dan misi game edukasi agar tepat sasaran dan tidak keluar dari tujuan pembelajaran ini.",
    penerapan: "Indikator soal kuis berjenjang, fokus slide presentasi PPT, dan capaian target studi kasus LKPD.",
    tips: "Tuliskan tujuan dengan kata kerja operasional Kurikulum Merdeka (contoh: 'Peserta didik mampu memahami, menganalisis, dan membiasakan...').",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  3: {
    nomor: 3,
    nama: "Materi Pokok (Sumber Utama AI)",
    fungsiAi: "Landasan Tunggal Substansi Ilmiah & Dalil Syar'i",
    deskripsi: "Prinsip Single-Source: Semua aset media (gambar, storyboard video, game, kuis, PPT, LKPD) diturunkan dari teks materi pokok ini tanpa mengubah substansi dalil Al-Qur'an dan Hadis. Menjamin keabsahan ilmiah materi PAI.",
    penerapan: "Substansi modul teks, narasi voice-over video, dalil rujukan utama, dan butir pemahaman.",
    tips: "Ketik atau tempelkan substansi materi esensial secara runtut beserta bunyi terjemahan dalil Al-Qur'an/Hadis.",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  4: {
    nomor: 4,
    nama: "Submateri (Pecahan Topik)",
    fungsiAi: "Membagi Materi Menjadi Scene Video & Slide PPT",
    deskripsi: "AI memecah konsep materi menjadi unit-unit pembelajaran terukur: Scene 1 hingga N pada video storyboard, dan slide per slide pada presentasi PPT serta babak aktivitas pada LKPD.",
    penerapan: "Storyboard video per adegan, slide-by-slide presentasi PowerPoint, dan babak permainan edukasi.",
    tips: "Bagi materi menjadi 3–5 poin submateri yang logis dan saling berkesinambungan agar alur visual mengalir nyaman.",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  5: {
    nomor: 5,
    nama: "Kata Kunci Visual (Visual Prompts)",
    fungsiAi: "Menghasilkan Prompt Gambar & Estetika Visual AI",
    deskripsi: "Ditransformasikan oleh AI menjadi prompt deskriptif untuk generator gambar beresolusi tinggi (Imagen/Midjourney) dengan nuansa islami modern, pencahayaan sinematik hangat, serta menjaga adab visual islami.",
    penerapan: "Prompt siap salin generator gambar, ilustrasi sampul PPT, dan konsep visual latar video.",
    tips: "Gunakan kata kunci suasana dan objek visual (misal: 'ruang kelas islami', 'cahaya nur', 'santri berdiskusi').",
    iconBg: "bg-pink-500/20 text-pink-400 border-pink-500/30"
  },
  6: {
    nomor: 6,
    nama: "Contoh Kehidupan Sehari-hari",
    fungsiAi: "Membuat Materi Kontekstual & Aplikatif (HOTS)",
    deskripsi: "AI mengolah contoh nyata menjadi skenario studi kasus interaktif pada LKPD, naskah drama pendek pada adegan video, serta soal asesmen kontekstual yang menghubungkan ajaran Islam dengan keseharian siswa.",
    penerapan: "Studi kasus kontekstual LKPD, dialog adegan drama video, dan butir soal aplikasi nyata.",
    tips: "Berikan contoh perbuatan konkret siswa di lingkungan sekolah, keluarga, dan etika bersosial media.",
    iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  7: {
    nomor: 7,
    nama: "Pilih Media AI yang Diinginkan",
    fungsiAi: "Mengendalikan Filter Eksekusi Komputasi AI",
    deskripsi: "Filter eksekusi komputasi cerdas. Guru dapat memilih hanya media yang dibutuhkan untuk pertemuan saat ini (misal: hanya Kuis & Game untuk sesi asesmen), sehingga proses generasi menjadi ringkas dan cepat.",
    penerapan: "Mengontrol tab media mana yang aktif dan ditampilkan pada ruang kerja guru.",
    tips: "Centang sesuai kebutuhan jam mengajar tatap muka hari ini agar persiapan mengajar lebih efisien.",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  8: {
    nomor: 8,
    nama: "Format Video Pembelajaran & Storyboard",
    fungsiAi: "Menyusun Storyboard Adegan, Narasi & Prompt Video",
    deskripsi: "AI merancang naskah per adegan (scene-by-scene) lengkap dengan alokasi detik durasi, visual kamera, narasi suara (voice-over), teks di layar, dan prompt generator video AI (Runway/Pika/Sora).",
    penerapan: "Tabel naskah produksi video pembelajaran, naskah narator, dan panduan rekaman.",
    tips: "Pilih orientasi 16:9 untuk proyektor kelas atau 9:16 untuk video pendek media sosial murid.",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  9: {
    nomor: 9,
    nama: "Game Edukasi Interaktif",
    fungsiAi: "Mengonversi Konsep Menjadi Game Interaktif",
    deskripsi: "AI memetakan submateri dan contoh nyata menjadi kartu berpasangan (matching matrix), tantangan drag-and-drop, atau kuis cepat dengan skor maksimal 100, combo streak, nyawa, dan efek audio.",
    penerapan: "Game edukasi playable yang dapat dimainkan langsung di komputer kelas atau ponsel siswa.",
    tips: "Sangat efektif digunakan sebagai ice breaking apersepsi awal atau asesmen formatif akhir kelas.",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  10: {
    nomor: 10,
    nama: "Latihan & Kuis Interaktif",
    fungsiAi: "Memproduksi Paket Soal Asesmen CBT Berjenjang",
    deskripsi: "AI merumuskan paket soal pilihan ganda bergradasi (3 Mudah, 4 Sedang, 3 Sulit) sesuai Taksonomi Bloom revisi, lengkap dengan distraktor rasional dan opsi penanda ragu-ragu.",
    penerapan: "Simulator kuis CBT digital interaktif mandiri dengan navigasi butir soal 1–10.",
    tips: "Gunakan untuk mengukur pemahaman kognitif siswa secara objektif dan instan.",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  11: {
    nomor: 11,
    nama: "Evaluasi & Pembahasan Dalil",
    fungsiAi: "Menyajikan Analisis Jawaban & Dalil Rujukan",
    deskripsi: "AI menyusun pembahasan terperinci pada tiap butir soal yang menjelaskan mengapa jawaban benar tepat serta mengutip dalil Al-Qur'an/Hadis rujukan untuk menuntaskan miskonsepsi.",
    penerapan: "Kunci jawaban analitis, lembar pembahasan materi kelas, dan penilaian tuntas KKM.",
    tips: "Bahas lembar evaluasi ini bersama siswa setelah sesi pengerjaan kuis selesai.",
    iconBg: "bg-teal-500/20 text-teal-400 border-teal-500/30"
  },
  12: {
    nomor: 12,
    nama: "Refleksi Siswa & LKPD Kolaboratif",
    fungsiAi: "Menstimulasi Metakognisi & Internalisasi Akhlak",
    deskripsi: "AI merancang pertanyaan refleksi diri bermakna (model 4P: Peristiwa, Perasaan, Pembelajaran, Penerapan) serta lembar kerja kolaboratif kelompok yang menumbuhkan karakter beriman dan berakhlak mulia.",
    penerapan: "Formulir refleksi diri siswa yang dapat diisi dan disimpan, serta modul LKPD kelompok.",
    tips: "Berikan waktu 5–10 menit di penghujung pembelajaran agar siswa mengisi lembar refleksi ini.",
    iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  }
};

export default function BahanAjarAiView() {
  // Load active or default preset from DataService
  const [bahanAjar, setBahanAjar] = useState<BahanAjarAiItem>(() => {
    return DataService.getActiveBahanAjarAi();
  });

  const [showStudentMonitoringModal, setShowStudentMonitoringModal] = useState(false);
  const [allStudents, setAllStudents] = useState(() => DataService.getSiswa());
  const [studentProgressMap, setStudentProgressMap] = useState(() => DataService.getAllSiswaBahanAjarProgress());

  // State for Form inputs
  const [mapel, setMapel] = useState(bahanAjar.identitas.mataPelajaran);
  const [kelas, setKelas] = useState<"7" | "8" | "9">(bahanAjar.identitas.kelas);
  const [babMateri, setBabMateri] = useState(bahanAjar.identitas.babMateri);
  const [alokasiWaktu, setAlokasiWaktu] = useState(bahanAjar.identitas.alokasiWaktu);
  const [semester, setSemester] = useState<"Ganjil" | "Genap">(bahanAjar.identitas.semester);
  const [karakteristikSiswa, setKarakteristikSiswa] = useState<"Pemula" | "Sedang" | "Lanjutan">(
    bahanAjar.identitas.karakteristikSiswa
  );

  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(bahanAjar.tujuanPembelajaran);
  const [materiPokokJudul, setMateriPokokJudul] = useState(bahanAjar.materiPokokJudul);
  const [materiPokokDeskripsi, setMateriPokokDeskripsi] = useState(bahanAjar.materiPokokDeskripsi);
  const [submateriList, setSubmateriList] = useState<string[]>(bahanAjar.submateri);
  const [newSubmateri, setNewSubmateri] = useState("");

  const [contohKehidupanList, setContohKehidupanList] = useState<string[]>(bahanAjar.contohKehidupan);
  const [newContoh, setNewContoh] = useState("");

  const [kataKunciList, setKataKunciList] = useState<string[]>(bahanAjar.kataKunciVisual);
  const [newKataKunci, setNewKataKunci] = useState("");

  const [mediaPilihan, setMediaPilihan] = useState<PilihanMediaAi>(bahanAjar.mediaPilihan);

  // UI state
  const [activeOutputTab, setActiveOutputTab] = useState<
    "materi" | "gambar" | "video" | "game" | "kuis" | "ppt" | "lkpd" | "refleksi"
  >("materi");
  const [showTableGuide, setShowTableGuide] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string>("");

  // Additional settings for Sections 8-12
  const [videoGaya, setVideoGaya] = useState<VideoConfig["gaya"]>(bahanAjar.videoData?.gaya || "Animasi 3D");
  const [videoOrientasi, setVideoOrientasi] = useState<"16:9" | "9:16">(bahanAjar.videoData?.orientasi || "16:9");
  const [videoNarator, setVideoNarator] = useState<VideoConfig["narator"]>(bahanAjar.videoData?.narator || "Guru PAI");
  const [gameMode, setGameMode] = useState<GameEdukasiData["jenisGame"]>(bahanAjar.gameData?.jenisGame || "Matching");
  const [gameLevel, setGameLevel] = useState<GameEdukasiData["level"]>(bahanAjar.gameData?.level || "Sedang");
  const [kkmEvaluasi, setKkmEvaluasi] = useState<number>(75);
  const [sertakanDalil, setSertakanDalil] = useState<boolean>(true);
  const [modelRefleksi, setModelRefleksi] = useState<string>("Model 4P (Peristiwa, Perasaan, Pembelajaran, Penerapan)");

  // Info Popover state for 12 Sections
  const [activeInfoPopover, setActiveInfoPopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveInfoPopover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveInfoPopover(null);
      }
    };
    if (activeInfoPopover !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeInfoPopover]);

  // Student reflection responses
  const [refleksiJawaban, setRefleksiJawaban] = useState<Record<number, string>>({});

  // When a preset is chosen
  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_BAHAN_AJAR_AI_LIST.find((p) => p.id === presetId);
    if (!found) return;

    setBahanAjar(found);
    setMapel(found.identitas.mataPelajaran);
    setKelas(found.identitas.kelas);
    setBabMateri(found.identitas.babMateri);
    setAlokasiWaktu(found.identitas.alokasiWaktu);
    setSemester(found.identitas.semester);
    setKarakteristikSiswa(found.identitas.karakteristikSiswa);
    setTujuanPembelajaran(found.tujuanPembelajaran);
    setMateriPokokJudul(found.materiPokokJudul);
    setMateriPokokDeskripsi(found.materiPokokDeskripsi);
    setSubmateriList(found.submateri);
    setContohKehidupanList(found.contohKehidupan);
    setKataKunciList(found.kataKunciVisual);
    setMediaPilihan(found.mediaPilihan);

    if (found.videoData) {
      setVideoGaya(found.videoData.gaya);
      setVideoOrientasi(found.videoData.orientasi);
      setVideoNarator(found.videoData.narator);
    }
    if (found.gameData) {
      setGameMode(found.gameData.jenisGame);
      setGameLevel(found.gameData.level);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    showToastNotification(`Template "${found.identitas.babMateri}" berhasil dimuat!`);
  };

  const showToastNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(""), 3000);
  };

  // Helper component to render Info Popover for each of the 12 sections
  const renderInfoPopover = (nomor: number) => {
    if (activeInfoPopover !== nomor) return null;
    const guide = PANDUAN_12_BAGIAN_AI[nomor];
    if (!guide) return null;

    return (
      <div
        ref={popoverRef}
        className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-88 md:w-96 p-4 rounded-2xl bg-slate-950 border-2 border-amber-400 shadow-2xl shadow-black/90 backdrop-blur-xl text-left animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        id={`popover-info-bagian-${nomor}`}
      >
        <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border ${guide.iconBg}`}>
              {guide.nomor}
            </span>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                PANDUAN FUNGSI AI
              </span>
              <h5 className="text-xs sm:text-sm font-black text-white leading-tight">
                {guide.nama}
              </h5>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveInfoPopover(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Tutup Panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">
              🤖 Fungsi Utama AI:
            </span>
            <p className="font-bold text-emerald-200 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/60 leading-snug">
              {guide.fungsiAi}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
              📖 Mekanisme Pemrosesan AI:
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              {guide.deskripsi}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
              🎯 Luaran Nyata yang Dihasilkan:
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              {guide.penerapan}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-200 flex items-start gap-1.5 leading-snug">
            <span className="text-amber-400 font-bold shrink-0">💡 Tips Guru:</span>
            <span>{guide.tips}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => setActiveInfoPopover(null)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    );
  };

  // Reusable Info Button for section headers and table
  const renderInfoButton = (nomor: number) => (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveInfoPopover(activeInfoPopover === nomor ? null : nomor);
        }}
        className={`px-2.5 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
          activeInfoPopover === nomor
            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/50"
            : "bg-slate-800/90 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border-slate-700 shadow-sm"
        }`}
        title={`Lihat Panduan Fungsi AI Bagian ${nomor}`}
        id={`btn-info-bagian-${nomor}`}
      >
        <Info className="w-3.5 h-3.5 shrink-0 text-amber-400 group-hover:text-amber-300" />
        <span className="text-[11px] font-semibold">Info AI</span>
      </button>
      {renderInfoPopover(nomor)}
    </div>
  );

  // Add / Remove Submateri
  const handleAddSubmateri = () => {
    if (!newSubmateri.trim()) return;
    setSubmateriList([...submateriList, `${submateriList.length + 1}. ${newSubmateri.trim()}`]);
    setNewSubmateri("");
  };

  const handleRemoveSubmateri = (idx: number) => {
    setSubmateriList(submateriList.filter((_, i) => i !== idx));
  };

  // Add / Remove Contoh
  const handleAddContoh = () => {
    if (!newContoh.trim()) return;
    setContohKehidupanList([...contohKehidupanList, `${contohKehidupanList.length + 1}. ${newContoh.trim()}`]);
    setNewContoh("");
  };

  const handleRemoveContoh = (idx: number) => {
    setContohKehidupanList(contohKehidupanList.filter((_, i) => i !== idx));
  };

  // Add / Remove Kata Kunci
  const handleAddKataKunci = () => {
    if (!newKataKunci.trim()) return;
    if (!kataKunciList.includes(newKataKunci.trim())) {
      setKataKunciList([...kataKunciList, newKataKunci.trim()]);
    }
    setNewKataKunci("");
  };

  const handleRemoveKataKunci = (tag: string) => {
    setKataKunciList(kataKunciList.filter((t) => t !== tag));
  };

  // Toggle media checkbox
  const handleToggleMedia = (key: keyof PilihanMediaAi) => {
    setMediaPilihan((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // GENERATE BAHAN AJAR AI
  const handleGenerateAi = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Build updated Bahan Ajar AI object deriving all components from teacher's single primary material
      const updated: BahanAjarAiItem = {
        ...bahanAjar,
        updatedAt: new Date().toISOString().split("T")[0],
        identitas: {
          mataPelajaran: mapel,
          kelas,
          babMateri,
          alokasiWaktu,
          jenjang: "SMP",
          semester,
          karakteristikSiswa
        },
        tujuanPembelajaran,
        materiPokokJudul,
        materiPokokDeskripsi,
        submateri: submateriList,
        kataKunciVisual: kataKunciList,
        contohKehidupan: contohKehidupanList,
        mediaPilihan,
        // Adapt gambar data prompt & visual specs
        gambarData: {
          ...bahanAjar.gambarData,
          materi: materiPokokJudul,
          objekUtama: `Konsep Utama: ${materiPokokJudul}`,
          elemen: kataKunciList.length > 0 ? kataKunciList.slice(0, 5) : ["Buku PAI", "Simbol Islami", "Karakter Siswa Muslim"],
          promptLengkap: `High quality 3D Pixar style animation of an Indonesian Islamic junior high school classroom studying ${materiPokokJudul}. ${kataKunciList.join(
            ", "
          )}, inspiring educational atmosphere, warm golden light, cinematic 8K render`
        },
        // Adapt video data with narration aligned to current material
        videoData: {
          ...bahanAjar.videoData,
          scenes: (submateriList.length > 0 ? submateriList : ["Pengantar", "Pendalaman", "Hikmah"]).slice(0, 4).map((sub, sIdx) => ({
            sceneNomor: sIdx + 1,
            judulScene: `Scene ${sIdx + 1}: ${sub}`,
            visual: `Visualisasi sinematik edukatif materi ${materiPokokJudul}, fokus pada subpokok bahasan ${sub}.`,
            narasi: `Pada bagian ini, kita mempelajari tentang ${sub} dalam materi ${materiPokokJudul}. Perhatikan dalil dan hikmah yang terkandung di dalamnya agar dapat kita amalkan dalam kehidupan sehari-hari.`,
            gerakan: sIdx === 0 ? "Slow zoom-in ke arah judul materi" : sIdx % 2 === 0 ? "Kamera panning ke kanan secara dinamis" : "Transisi halus fokus ke elemen utama",
            teksLayar: sub,
            durasiDetik: 15,
            promptAiVideo: `Cinematic 4K video showing ${sub} of ${materiPokokJudul}, Islamic educational aesthetic, warm light, professional motion`
          }))
        },
        // Adapt game data
        gameData: {
          ...bahanAjar.gameData,
          judulGame: `Game Edukasi: Pasangkan Konsep ${materiPokokJudul}`,
          matchingPairs: (submateriList.length >= 2 ? submateriList : ["Konsep Pokok 1", "Konsep Pokok 2", "Konsep Pokok 3"]).map((sub, pIdx) => ({
            id: `pair-${pIdx + 1}`,
            kiri: sub,
            kanan: contohKehidupanList[pIdx] || `Penerapan dan makna penting dari ${sub} dalam ajaran Islam`
          }))
        }
      };

      setBahanAjar(updated);
      DataService.saveActiveBahanAjarAi(updated);
      setIsGenerating(false);
      showToastNotification("✨ Bahan Ajar AI Berhasil Diterbitkan ke Siswa! Siap dipelajari & dikerjakan di LMS.");

      // Set active output tab to first selected media
      if (mediaPilihan.materiTeks) setActiveOutputTab("materi");
      else if (mediaPilihan.gambarAi) setActiveOutputTab("gambar");
      else if (mediaPilihan.videoAi) setActiveOutputTab("video");
      else if (mediaPilihan.gameEdukasi) setActiveOutputTab("game");
      else if (mediaPilihan.kuis) setActiveOutputTab("kuis");
      else if (mediaPilihan.ppt) setActiveOutputTab("ppt");
      else if (mediaPilihan.lkpd) setActiveOutputTab("lkpd");
    }, 900);
  };

  const handlePublishToLms = () => {
    const updated: BahanAjarAiItem = {
      ...bahanAjar,
      updatedAt: new Date().toISOString().split("T")[0],
      identitas: {
        mataPelajaran: mapel,
        kelas,
        babMateri,
        alokasiWaktu,
        jenjang: "SMP",
        semester,
        karakteristikSiswa
      },
      tujuanPembelajaran,
      materiPokokJudul,
      materiPokokDeskripsi,
      submateri: submateriList,
      kataKunciVisual: kataKunciList,
      contohKehidupan: contohKehidupanList,
      mediaPilihan,
      isPublished: true,
      targetKelas: kelas
    };
    setBahanAjar(updated);
    DataService.saveActiveBahanAjarAi(updated);
    showToastNotification("✨ Bahan Ajar AI Berhasil Diterbitkan ke Siswa! Siswa dapat membuka materi & mengerjakan tugas/kuis.");
  };

  const handlePrintFullDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-900 text-white font-bold text-sm shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* HEADER UTAMA & IDENTITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-black tracking-wider uppercase border border-amber-400/30">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>SIPAILMS AI Content Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Struktur Bahan Ajar AI SIPAILMS
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Arsitektur cerdas penyusunan bahan ajar PAI berbasis <strong>12 Bagian Utama</strong>. Satu sumber materi guru ditransformasikan secara harmonis menjadi <em>materi teks, ilustrasi gambar, script video, game interaktif, kuis berjenjang, slide PPT, LKPD,</em> dan <em>refleksi siswa</em>.
            </p>
          </div>

          {/* Quick Presets & Print */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleLoadPreset("preset-ai-malaikat-7")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Muat Contoh Bab Iman kepada Malaikat (Kelas VII)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Preset Malaikat (Kls 7)</span>
            </button>

            <button
              onClick={() => handleLoadPreset("preset-ai-kurban-9")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Muat Contoh Bab Kurban & Akikah (Kelas IX)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preset Kurban (Kls 9)</span>
            </button>

            <button
              onClick={handlePublishToLms}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Terbitkan Materi ini agar langsung tampil dan bisa dikerjakan siswa di LMS"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <span>Terbitkan ke Siswa</span>
            </button>

            <button
              onClick={() => {
                setStudentProgressMap(DataService.getAllSiswaBahanAjarProgress());
                setShowStudentMonitoringModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Pantau Rekap Pengerjaan Siswa untuk Bahan Ajar AI ini"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Pantau Siswa</span>
            </button>

            <button
              onClick={handlePrintFullDocument}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg"
              title="Cetak Naskah Bahan Ajar AI Lengkap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Modul</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABEL PANDUAN 12 BAGIAN UTAMA & DIAGRAM KONTEN ENGINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Panduan 12 Bagian Utama Bahan Ajar AI & Alur Satu Sumber
              </h3>
              <p className="text-xs text-slate-400">
                Prinsip desain: Semua media diturunkan dari satu materi pokok yang sama agar selaras dan konsisten
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTableGuide(!showTableGuide)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={showTableGuide ? "Sembunyikan Panduan" : "Tampilkan Panduan"}
          >
            {showTableGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showTableGuide && (
          <div className="space-y-6 animate-fade-in">
            {/* Diagram Alur Satu Sumber */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-900/40">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest block text-center mb-3">
                ⭐ Filosofi Inti: Single-Source AI Content Engine
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-xs font-bold text-center">
                <div className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-700/60 shadow-md">
                  📖 MATERI GURU (Substansi Inti)
                </div>
                <div className="text-amber-400 font-mono text-base">➔</div>
                <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg">
                  🤖 AI CONTENT ENGINE SIPAILMS
                </div>
                <div className="text-amber-400 font-mono text-base">➔</div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
                  <span className="px-2 py-1 rounded bg-slate-900 text-pink-300 border border-slate-800">🖼️ Gambar</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-purple-300 border border-slate-800">🎬 Video</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-amber-300 border border-slate-800">🎮 Game</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-emerald-300 border border-slate-800">📝 Kuis</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-orange-300 border border-slate-800">📊 PPT</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-blue-300 border border-slate-800">🧩 LKPD</span>
                  <span className="px-2 py-1 rounded bg-slate-900 text-teal-300 border border-slate-800">💭 Refleksi</span>
                </div>
              </div>
            </div>

            {/* Tabel 12 Bagian Utama */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-black tracking-wider bg-slate-950/60">
                    <th className="py-3 px-3 w-12 text-center">No</th>
                    <th className="py-3 px-4">Bagian yang Diisi Guru</th>
                    <th className="py-3 px-4">Fungsi Mesin AI SIPAILMS</th>
                    <th className="py-3 px-4">Penerapan / Luaran Nyata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">1</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Identitas Pembelajaran</span>
                        {renderInfoButton(1)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menentukan konteks materi</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Mapel, Kelas 7/8/9, Alokasi 2x40m, Semester, Karakteristik Siswa</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">2</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Tujuan Pembelajaran</span>
                        {renderInfoButton(2)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menentukan arah konten</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Batas pembuatan materi, cakupan soal kuis, video, dan LKPD</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">3</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Materi Pokok</span>
                        {renderInfoButton(3)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menjadi sumber utama AI</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Penjelasan teoritis, dalil Al-Qur'an/Hadis, tanpa ubah substansi syar'i</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">4</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Submateri</span>
                        {renderInfoButton(4)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Membagi materi menjadi bagian kecil</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Menjadi storyboard scene video 1..N dan slide per slide presentasi</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">5</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Kata Kunci Visual</span>
                        {renderInfoButton(5)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menentukan objek gambar/video</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Prompt generator gambar (Midjourney/Imagen) & video visual</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">6</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Contoh Kehidupan Sehari-hari</span>
                        {renderInfoButton(6)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Membuat materi kontekstual</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Studi kasus LKPD, scene video drama, dan soal aplikatif harian</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">7</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Media yang Diinginkan</span>
                        {renderInfoButton(7)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menentukan gambar/video/PPT</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Filter format media yang aktif sesuai kebutuhan jam mengajar</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">8</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Format Video & Storyboard</span>
                        {renderInfoButton(8)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Membuat aktivitas interaktif</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Format video scene, stimulus kasus nyata, dan tugas kelompok</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">9</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Game Edukasi</span>
                        {renderInfoButton(9)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Membuat permainan sesuai materi</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Game matching/jodohkan pasangan nama & tugas dengan skor 100</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">10</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Latihan / Kuis</span>
                        {renderInfoButton(10)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Menghasilkan soal otomatis</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">10 butir soal berjenjang (3 mudah, 4 sedang, 3 sulit) + kunci jawaban</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">11</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Evaluasi & Pembahasan</span>
                        {renderInfoButton(11)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Mengukur pemahaman</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">Pembahasan komprehensif berdalil dan skor otomatis per butir</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400">12</td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span>Refleksi Siswa</span>
                        {renderInfoButton(12)}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-300">Membantu siswa menyimpulkan</td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs">4 pertanyaan bermakna + form respon refleksi langsung</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* STRUKTUR FORM INPUT SIPAILMS (Sesuai Diagram User) */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-md">
              <Bot className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                BUAT BAHAN AJAR AI
              </h2>
              <p className="text-xs text-slate-300">
                Isi form di bawah ini lalu tekan tombol generate untuk menghasilkan media serentak
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Status Kurikulum</span>
            <span className="text-xs font-black text-emerald-400">Kurikulum Merdeka • Fase D</span>
          </div>
        </div>

        {/* Form Inputs Grid - 12 Bagian Lengkap */}
        <div className="space-y-6">
          {/* BAGIAN 1: IDENTITAS PEMBELAJARAN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 1: Identitas Pembelajaran
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Konteks jenjang, kelas Fase D, alokasi waktu & kalibrasi kognitif AI
                  </p>
                </div>
              </div>
              {renderInfoButton(1)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mata Pelajaran</label>
                <input
                  type="text"
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Kelas</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none font-bold"
                >
                  <option value="7">Kelas VII (Tujuh)</option>
                  <option value="8">Kelas VIII (Delapan)</option>
                  <option value="9">Kelas IX (Sembilan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none font-medium"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Alokasi Waktu</label>
                <input
                  type="text"
                  value={alokasiWaktu}
                  onChange={(e) => setAlokasiWaktu(e.target.value)}
                  placeholder="2 × 40 menit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Karakteristik Siswa</label>
              <input
                type="text"
                value={karakteristikSiswa}
                onChange={(e) => setKarakteristikSiswa(e.target.value)}
                placeholder="Contoh: Aktif, gaya belajar visual-kinestetik, relevan dengan kehidupan remaja muslim..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* BAGIAN 2: TUJUAN PEMBELAJARAN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 2: Tujuan Pembelajaran
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Parameter pembatas (guardrail) ruang lingkup seluruh media dan soal AI
                  </p>
                </div>
              </div>
              {renderInfoButton(2)}
            </div>

            <div>
              <textarea
                rows={3}
                value={tujuanPembelajaran}
                onChange={(e) => setTujuanPembelajaran(e.target.value)}
                placeholder="Tuliskan tujuan pembelajaran operasional Kurikulum Merdeka..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* BAGIAN 3: MATERI POKOK (SUMBER UTAMA AI) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 3: Materi Pokok (Sumber Utama AI)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Single-source rujukan ilmiah & dalil naqli Al-Qur'an/Hadis tetap utuh
                  </p>
                </div>
              </div>
              {renderInfoButton(3)}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Judul Bab / Pokok Bahasan</label>
                <input
                  type="text"
                  value={babMateri}
                  onChange={(e) => {
                    setBabMateri(e.target.value);
                    setMateriPokokJudul(e.target.value);
                  }}
                  placeholder="Contoh: Iman kepada Malaikat Allah SWT"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm sm:text-base font-bold focus:border-amber-400 focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Uraian Materi Pokok & Dalil Naqli</label>
                <textarea
                  rows={4}
                  value={materiPokokDeskripsi}
                  onChange={(e) => setMateriPokokDeskripsi(e.target.value)}
                  placeholder="Ketik substansi materi pokok, dalil Al-Qur'an, Hadis, dan hikmahnya..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 4: SUBMATERI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black">
                  4
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 4: Submateri (Scene Video & Slide PPT)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Memecah konsep materi menjadi babak scene video dan urutan slide PPT
                  </p>
                </div>
              </div>
              {renderInfoButton(4)}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                {submateriList.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200"
                  >
                    <span className="font-medium">{sub}</span>
                    <button
                      onClick={() => handleRemoveSubmateri(sIdx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Hapus Submateri"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSubmateri}
                  onChange={(e) => setNewSubmateri(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubmateri()}
                  placeholder="Ketik judul submateri baru..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleAddSubmateri}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Submateri
                </button>
              </div>
            </div>
          </div>

          {/* BAGIAN 5: KATA KUNCI VISUAL */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xs font-black">
                  5
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 5: Kata Kunci Visual (Prompt Gambar & Video)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Menghasilkan prompt terstruktur untuk Imagen, Midjourney & storyboard video
                  </p>
                </div>
              </div>
              {renderInfoButton(5)}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {kataKunciList.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <Tag className="w-3 h-3 text-pink-400" />
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveKataKunci(tag)}
                      className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newKataKunci}
                  onChange={(e) => setNewKataKunci(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddKataKunci()}
                  placeholder="Ketik kata kunci visual (misal: ruang kelas modern, cahaya nur, siswa bertasbih)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleAddKataKunci}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Tag
                </button>
              </div>

              {/* Quick Image Gallery Trigger Helper */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Tag ini otomatis menjadi input parameter generator di <strong>Image Gallery</strong>.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveOutputTab("gambar");
                    const el = document.getElementById("tab-btn-image-gallery") || document.getElementById("image-gallery-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-pink-950/80 hover:bg-pink-900 text-pink-300 border border-pink-700/60 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5 text-pink-400" />
                  <span>Buka Image Gallery AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* BAGIAN 6: CONTOH KEHIDUPAN SEHARI-HARI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black">
                  6
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 6: Contoh Kehidupan Sehari-hari (Kontekstualisasi Siswa)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Kontekstualisasi HOTS untuk kasus nyata LKPD, drama video & soal aplikasi
                  </p>
                </div>
              </div>
              {renderInfoButton(6)}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                {contohKehidupanList.map((cth, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200"
                  >
                    <span className="font-medium">{cth}</span>
                    <button
                      onClick={() => handleRemoveContoh(cIdx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Hapus Contoh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newContoh}
                  onChange={(e) => setNewContoh(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddContoh()}
                  placeholder="Contoh: Berkata jujur walaupun tidak ada orang lain yang melihat..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleAddContoh}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Contoh
                </button>
              </div>
            </div>
          </div>

          {/* BAGIAN 7: PILIH MEDIA AI YANG DIINGINKAN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black">
                  7
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 7: Pilih Media yang Diinginkan
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Filter eksekusi komputasi: AI hanya menghasilkan format media yang dicentang
                  </p>
                </div>
              </div>
              {renderInfoButton(7)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
              <label
                onClick={() => handleToggleMedia("materiTeks")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.materiTeks
                    ? "bg-emerald-950/80 border-emerald-600 text-emerald-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.materiTeks} readOnly className="rounded accent-emerald-500" />
                <span>📖 Materi</span>
              </label>

              <label
                onClick={() => handleToggleMedia("gambarAi")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.gambarAi
                    ? "bg-pink-950/80 border-pink-600 text-pink-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.gambarAi} readOnly className="rounded accent-pink-500" />
                <span>🖼️ Gambar</span>
              </label>

              <label
                onClick={() => handleToggleMedia("videoAi")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.videoAi
                    ? "bg-purple-950/80 border-purple-600 text-purple-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.videoAi} readOnly className="rounded accent-purple-500" />
                <span>🎬 Video</span>
              </label>

              <label
                onClick={() => handleToggleMedia("gameEdukasi")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.gameEdukasi
                    ? "bg-amber-950/80 border-amber-600 text-amber-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.gameEdukasi} readOnly className="rounded accent-amber-500" />
                <span>🎮 Game</span>
              </label>

              <label
                onClick={() => handleToggleMedia("kuis")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.kuis
                    ? "bg-emerald-950/80 border-emerald-600 text-emerald-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.kuis} readOnly className="rounded accent-emerald-500" />
                <span>📝 Kuis</span>
              </label>

              <label
                onClick={() => handleToggleMedia("ppt")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.ppt
                    ? "bg-orange-950/80 border-orange-600 text-orange-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.ppt} readOnly className="rounded accent-orange-500" />
                <span>📊 PPT</span>
              </label>

              <label
                onClick={() => handleToggleMedia("lkpd")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold cursor-pointer transition select-none ${
                  mediaPilihan.lkpd
                    ? "bg-blue-950/80 border-blue-600 text-blue-200 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <input type="checkbox" checked={mediaPilihan.lkpd} readOnly className="rounded accent-blue-500" />
                <span>🧩 LKPD</span>
              </label>
            </div>
          </div>

          {/* BAGIAN 8: FORMAT VIDEO PEMBELAJARAN & STORYBOARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black">
                  8
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 8: Format Video Pembelajaran & Storyboard
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Aktivitas interaktif visual, gaya animasi, rasio orientasi & karakter narator AI
                  </p>
                </div>
              </div>
              {renderInfoButton(8)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Gaya Visual Video</label>
                <select
                  value={videoGaya}
                  onChange={(e) => setVideoGaya(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                >
                  <option value="Animasi 3D">🎨 Animasi 3D Pixar Style</option>
                  <option value="Kartun Edukasi">🖌️ Kartun Edukasi 2D</option>
                  <option value="Realistis Sinematik">🎥 Realistis Sinematik 4K</option>
                  <option value="Motion Graphic">✨ Motion Graphic Modern</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Orientasi Layar</label>
                <select
                  value={videoOrientasi}
                  onChange={(e) => setVideoOrientasi(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                >
                  <option value="16:9">🖥️ 16:9 (Lanskap Layar/Laptop)</option>
                  <option value="9:16">📱 9:16 (Vertikal Smartphone/Reels)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Karakter Voice-Over (Narator)</label>
                <select
                  value={videoNarator}
                  onChange={(e) => setVideoNarator(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                >
                  <option value="Guru PAI">👨‍🏫 Guru PAI Berwibawa</option>
                  <option value="Siswa SMP">🧑‍🎓 Siswa SMP Santun & Ceria</option>
                  <option value="AI Voice Islami">🎙️ AI Voice Khusyuk & Jernih</option>
                </select>
              </div>
            </div>
          </div>

          {/* BAGIAN 9: GAME EDUKASI INTERAKTIF (GAME ENGINE) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black">
                  9
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 9: Game Edukasi Interaktif (Game Engine)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Membuat permainan konsep materi: matching/jodohkan pasangan nama & tugas
                  </p>
                </div>
              </div>
              {renderInfoButton(9)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipe Game</label>
                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                >
                  <option value="Matching">🃏 Drag-and-Drop Pasangan Konsep</option>
                  <option value="Quiz">⚡ Tebak Kilat Submateri (Speed)</option>
                  <option value="TebakKata">🔤 Susun Kata Dalil & Istilah</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tingkat Kesulitan</label>
                <select
                  value={gameLevel}
                  onChange={(e) => setGameLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                >
                  <option value="Mudah">🟢 Mudah (Santai, Nyawa Tak Terbatas)</option>
                  <option value="Sedang">🟡 Sedang (3 Nyawa, Streak Combo)</option>
                  <option value="Sulit">🔴 Sulit (Timer Ketat, Tantangan Ekstra)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Skor & Hadiah</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs sm:text-sm font-bold flex items-center justify-between">
                  <span>Maksimal 100 Poin</span>
                  <span className="text-[11px] text-emerald-400">Badge Bintang 3</span>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 10: LATIHAN & KUIS INTERAKTIF (QUIZ PLAYER) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  10
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 10: Latihan / Kuis Interaktif (Quiz Player)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    10 butir soal berjenjang Taksonomi Bloom (3 mudah, 4 sedang, 3 sulit) + kunci jawaban
                  </p>
                </div>
              </div>
              {renderInfoButton(10)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Jumlah Butir Soal</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-between">
                  <span>10 Butir Pilihan Ganda</span>
                  <span className="text-[11px] text-amber-400">Standar Asesmen</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Gradasi Tingkat Kognitif</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-xs sm:text-sm font-medium">
                  3 Mudah • 4 Sedang • 3 Sulit (HOTS)
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Fitur Simulator Ujian</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium">
                  Peta Nomor Soal, Flag Ragu & Timer
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 11: EVALUASI & PEMBAHASAN DALIL */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-black">
                  11
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 11: Evaluasi & Pembahasan Dalil
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ulasan kunci jawaban analitis, rujukan dalil Al-Qur'an/Hadis & standar ketuntasan KKM
                  </p>
                </div>
              </div>
              {renderInfoButton(11)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Standar KKM Kelulusan</label>
                <input
                  type="number"
                  value={kkmEvaluasi}
                  onChange={(e) => setKkmEvaluasi(Number(e.target.value))}
                  min={50}
                  max={100}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col justify-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sertakanDalil}
                    onChange={(e) => setSertakanDalil(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <span>Sertakan Dalil Al-Qur'an & Hadis rujukan pada ulasan setiap butir</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Memastikan siswa memahami dasar hukum syar'i di balik setiap jawaban yang benar
                </span>
              </div>
            </div>
          </div>

          {/* BAGIAN 12: REFLEKSI SISWA & LKPD KOLABORATIF */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                  12
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Bagian 12: Refleksi Siswa & LKPD Kolaboratif
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Internalisasi nilai akhlak model 4P & panduan lembar kerja kolaboratif kasus nyata
                  </p>
                </div>
              </div>
              {renderInfoButton(12)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Model Pertanyaan Reflektif</label>
                <input
                  type="text"
                  value={modelRefleksi}
                  onChange={(e) => setModelRefleksi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Format LKPD Siswa</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-xs sm:text-sm font-medium flex items-center justify-between">
                  <span>Studi Kasus Kontekstual Kelompok</span>
                  <span className="text-[11px] text-slate-400">4 Langkah Aksi</span>
                </div>
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-amber-400/20 disabled:opacity-50"
            >
              <Bot className={`w-6 h-6 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Sedang Mengolah dengan AI Engine..." : "🤖 GENERATE BAHAN AJAR AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* HASIL YANG MUNCUL (Tabs / View Terpadu Sesuai Permintaan) */}
      <div className="space-y-6">
        {/* Output Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {mediaPilihan.materiTeks && (
            <button
              onClick={() => setActiveOutputTab("materi")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "materi"
                  ? "bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>📚 MATERI</span>
            </button>
          )}

          {mediaPilihan.gambarAi && (
            <button
              id="tab-btn-image-gallery"
              onClick={() => setActiveOutputTab("gambar")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "gambar"
                  ? "bg-pink-950 border-pink-500 text-pink-200 shadow-md ring-1 ring-pink-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Image className="w-4 h-4 text-pink-400" />
              <span>🖼️ IMAGE GALLERY</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-black">AI Cards</span>
            </button>
          )}

          {mediaPilihan.videoAi && (
            <button
              onClick={() => setActiveOutputTab("video")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "video"
                  ? "bg-purple-950 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span>🎬 VIDEO</span>
            </button>
          )}

          {mediaPilihan.gameEdukasi && (
            <button
              onClick={() => setActiveOutputTab("game")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "game"
                  ? "bg-amber-950 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>🎮 GAME EDUKASI</span>
            </button>
          )}

          {mediaPilihan.kuis && (
            <button
              onClick={() => setActiveOutputTab("kuis")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "kuis"
                  ? "bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>📝 KUIS</span>
            </button>
          )}

          {mediaPilihan.ppt && (
            <button
              onClick={() => setActiveOutputTab("ppt")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "ppt"
                  ? "bg-orange-950 border-orange-500 text-orange-200 shadow-md ring-1 ring-orange-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Presentation className="w-4 h-4 text-orange-400" />
              <span>📊 PPT</span>
            </button>
          )}

          {mediaPilihan.lkpd && (
            <button
              onClick={() => setActiveOutputTab("lkpd")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                activeOutputTab === "lkpd"
                  ? "bg-blue-950 border-blue-500 text-blue-200 shadow-md ring-1 ring-blue-400/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>🧩 LKPD</span>
            </button>
          )}

          <button
            onClick={() => setActiveOutputTab("refleksi")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 flex items-center gap-2 border transition cursor-pointer ${
              activeOutputTab === "refleksi"
                ? "bg-teal-950 border-teal-500 text-teal-200 shadow-md ring-1 ring-teal-400/40"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4 text-teal-400" />
            <span>💭 REFLEKSI</span>
          </button>
        </div>

        {/* TAB 1: 📚 MATERI PEMBELAJARAN LENGKAP */}
        {activeOutputTab === "materi" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                  📚 Bahan Ajar Teks Lengkap
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {bahanAjar.materiPokokJudul}
                </h3>
                <span className="text-xs text-slate-400">
                  Kelas {bahanAjar.identitas.kelas} SMP • Semester {bahanAjar.identitas.semester} • Alokasi {bahanAjar.identitas.alokasiWaktu}
                </span>
              </div>
            </div>

            {/* Dalil Box */}
            {bahanAjar.dalilRujukan && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-amber-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4" /> Dalil Naqli Rujukan
                  </span>
                  <span className="text-xs font-mono text-slate-400">{bahanAjar.dalilRujukan.sumber}</span>
                </div>
                <p className="text-xl sm:text-2xl text-right font-serif leading-loose text-amber-200 pt-1" dir="rtl">
                  {bahanAjar.dalilRujukan.arab}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed">
                  "{bahanAjar.dalilRujukan.latin}"
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1 border-t border-slate-800">
                  <strong>Artinya: </strong>"{bahanAjar.dalilRujukan.arti}"
                </p>
              </div>
            )}

            {/* Isi Materi Pokok */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-amber-400 uppercase tracking-wider">
                1. Pengertian dan Hakikat Pembelajaran
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                {bahanAjar.materiPokokDeskripsi}
              </p>
            </div>

            {/* Daftar Submateri */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-emerald-400 uppercase tracking-wider">
                2. Rincian Poin Submateri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bahanAjar.submateri.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-800">
                      {sIdx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contoh Kehidupan Sehari-hari */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-blue-400 uppercase tracking-wider">
                3. Penerapan Kontekstual dalam Keseharian
              </h4>
              <div className="space-y-2">
                {bahanAjar.contohKehidupan.map((cth, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
                  >
                    <span className="text-emerald-400 font-black shrink-0">✓</span>
                    <span className="leading-relaxed">{cth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 🖼️ GAMBAR AI */}
        {activeOutputTab === "gambar" && (
          <GambarAiViewer
            gambarData={bahanAjar.gambarData}
            judulMateri={bahanAjar.materiPokokJudul}
            kataKunciVisual={bahanAjar.kataKunciVisual}
            submateri={bahanAjar.submateri}
            contohKehidupan={bahanAjar.contohKehidupan}
            dalilRujukan={bahanAjar.dalilRujukan}
          />
        )}

        {/* TAB 3: 🎬 VIDEO PEMBELAJARAN */}
        {activeOutputTab === "video" && (
          <VideoStoryboardViewer videoData={bahanAjar.videoData} judulMateri={bahanAjar.materiPokokJudul} />
        )}

        {/* TAB 4: 🎮 GAME EDUKASI INTERAKTIF (GAME ENGINE) */}
        {activeOutputTab === "game" && (
          <GameEngine gameData={bahanAjar.gameData} judulMateri={bahanAjar.materiPokokJudul} />
        )}

        {/* TAB 5: 📝 KUIS & ASESMEN (QUIZ PLAYER) */}
        {activeOutputTab === "kuis" && (
          <QuizPlayer soalList={bahanAjar.kuisData.soalList} judulMateri={bahanAjar.materiPokokJudul} />
        )}

        {/* TAB 6: 📊 SLIDE PPT */}
        {activeOutputTab === "ppt" && (
          <PptSlideViewer slides={bahanAjar.pptData} judulMateri={bahanAjar.materiPokokJudul} />
        )}

        {/* TAB 7: 🧩 LKPD (Lembar Kerja Peserta Didik) */}
        {activeOutputTab === "lkpd" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">
                  🧩 Lembar Kerja Peserta Didik (LKPD)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {bahanAjar.lkpdData.judulLkpd}
                </h3>
              </div>
              <button
                onClick={handlePrintFullDocument}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-md"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar LKPD
              </button>
            </div>

            {/* Petunjuk Belajar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                Petunjuk Aktivitas Belajar:
              </span>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-1">
                {bahanAjar.lkpdData.petunjukBelajar.map((p, pIdx) => (
                  <li key={pIdx}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Stimulus Kasus Nyata */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 border border-blue-800/40 space-y-2">
              <span className="text-xs font-black text-blue-300 uppercase tracking-widest block">
                📜 Stimulus Kasus / Masalah Autentik
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                {bahanAjar.lkpdData.stimulusKasus}
              </p>
            </div>

            {/* Pertanyaan Diskusi */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                Pertanyaan Analisis & Investigasi:
              </span>
              <div className="space-y-3">
                {bahanAjar.lkpdData.pertanyaanAktivitas.map((tanya, tIdx) => (
                  <div key={tIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-white flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 text-xs flex items-center justify-center shrink-0">
                        {tIdx + 1}
                      </span>
                      <span>{tanya}</span>
                    </p>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan analisis kelompok di sini..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tugas Kelompok */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                🎯 Tugas Kelompok / Produk Akhir:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {bahanAjar.lkpdData.tugasKelompok}
              </p>
            </div>

            {/* Rubrik Penilaian */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Rubrik Penilaian LKPD (Total 100 Poin):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {bahanAjar.lkpdData.rubrikPenilaian.map((rubrik, rIdx) => (
                  <div key={rIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>{rubrik.kriteria}</span>
                      <span className="text-amber-400 font-mono">{rubrik.skorMaksimal} Poin</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{rubrik.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: 💭 REFLEKSI SISWA */}
        {activeOutputTab === "refleksi" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs font-black text-teal-400 uppercase tracking-wider block">
                💭 Refleksi Siswa Bermakna
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Refleksi Pembelajaran: {bahanAjar.materiPokokJudul}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Membantu siswa menyimpulkan dan merencanakan aksi nyata dalam kehidupan pribadi
              </p>
            </div>

            {/* Mutiara Hikmah */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-950 to-slate-950 border border-teal-700/50 space-y-2">
              <span className="text-xs font-black text-teal-300 uppercase tracking-wider block">
                💎 Mutiara Hikmah Pembelajaran
              </span>
              <p className="text-sm sm:text-base text-teal-100 font-serif italic leading-relaxed">
                "{bahanAjar.refleksiData.kutipanHikmah}"
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-bold">
                <span>⚡ Ajakan Aksi Nyata:</span>
                <span>{bahanAjar.refleksiData.ajakanAksiNyata}</span>
              </div>
            </div>

            {/* 4 Pertanyaan Refleksi Interaktif */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Lembar Refleksi Diri Siswa:
              </h4>

              {bahanAjar.refleksiData.pertanyaanRefleksi.map((pertanyaan, pIdx) => (
                <div key={pIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-200 block flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-900/70 text-teal-300 text-xs flex items-center justify-center shrink-0">
                      {pIdx + 1}
                    </span>
                    <span>{pertanyaan}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={refleksiJawaban[pIdx] || ""}
                    onChange={(e) =>
                      setRefleksiJawaban({
                        ...refleksiJawaban,
                        [pIdx]: e.target.value
                      })
                    }
                    placeholder="Tuliskan ungkapan hatimu secara jujur di sini..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => showToastNotification("✅ Respon refleksi siswa berhasil disimpan!")}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Simpan Respon Refleksi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL PANTAU PENGERJAAN SISWA */}
      {showStudentMonitoringModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Rekap Pengerjaan Siswa: {bahanAjar.materiPokokJudul}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Memantau hasil kuis interaktif, rekor game, dan submission LKPD / Refleksi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentMonitoringModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">No</th>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Nilai Kuis</th>
                      <th className="p-3">Game Edukasi</th>
                      <th className="p-3">LKPD</th>
                      <th className="p-3">Refleksi 4P</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {allStudents.map((s, sIdx) => {
                      const prog = studentProgressMap[s.nisn]?.[bahanAjar.id];
                      const hasQuiz = prog?.quizScore !== undefined;
                      const isPass = (prog?.quizScore || 0) >= 75;

                      return (
                        <tr key={s.id || s.nisn} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 text-slate-500 font-mono">{sIdx + 1}</td>
                          <td className="p-3 font-bold text-white">
                            <div>{s.nama}</div>
                            <div className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</div>
                          </td>
                          <td className="p-3 text-slate-300 font-semibold">{s.kelasId}</td>
                          <td className="p-3">
                            {hasQuiz ? (
                              <span
                                className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                                  isPass
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                                    : "bg-amber-950 text-amber-300 border border-amber-700"
                                }`}
                              >
                                {prog?.quizScore}/100 {isPass ? "⭐" : ""}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">Belum Kuis</span>
                            )}
                          </td>
                          <td className="p-3">
                            {prog?.gameCompleted ? (
                              <span className="text-amber-400 font-bold">
                                🎮 {prog?.gameScore || 100} Pts
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            {prog?.lkpdCompleted ? (
                              <span className="text-cyan-400 font-bold" title={prog?.lkpdJawaban}>
                                ✅ Terkirim
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            {prog?.refleksiCompleted ? (
                              <span className="text-blue-400 font-bold">
                                ✅ Terisi
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prog?.status === "Selesai Dikerjakan" || isPass
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : prog?.status === "Sedang Dikerjakan"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {prog?.status || "Belum Mulai"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowStudentMonitoringModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
