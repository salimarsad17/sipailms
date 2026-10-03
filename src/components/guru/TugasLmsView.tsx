/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  X,
  CheckSquare,
  HelpCircle,
  Filter,
  Search,
  BookOpenCheck,
  Video,
  FileText,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sliders,
  Award
} from "lucide-react";
import { BabPelajaran, SoalPilihanGanda, Kelas, Siswa, TugasLms, PengumpulanTugas } from "../../types";
import { generateAutomaticQuiz } from "../../lib/quizGenerator";
import GeneratorSoalLKPD from "./GeneratorSoalLKPD";
import MonitoringPengumpulanTugas from "./MonitoringPengumpulanTugas";

const getEmbedInfo = (url: string | undefined) => {
  if (!url || url === "#") return null;

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  let youtubeId: string | null = null;
  if (cleanUrl.includes("youtu.be/")) {
    const parts = cleanUrl.split("youtu.be/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("youtube.com/shorts/")) {
    const parts = cleanUrl.split("youtube.com/shorts/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("youtube.com/embed/")) {
    const parts = cleanUrl.split("youtube.com/embed/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("v=")) {
    const match = cleanUrl.match(/[?&]v=([^&#\s]+)/);
    if (match && match[1] && match[1].substring(0, 11).length === 11) {
      youtubeId = match[1].substring(0, 11);
    }
  } else {
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

  const gdIdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gdIdMatch && gdIdMatch[1]) {
    return {
      type: "googledrive",
      embedUrl: `https://drive.google.com/file/d/${gdIdMatch[1]}/preview`
    };
  }

  return null;
};

interface TugasLmsViewProps {
  babPelajaran: BabPelajaran[];
  onUpdateBabPelajaran: (updated: BabPelajaran[]) => void;
  classes?: Kelas[];
  students?: Siswa[];
  tasks?: TugasLms[];
  submissions?: PengumpulanTugas[];
  onGradeSubmission?: (subId: string, score: number, comment: string) => void;
  onAddTask?: (task: TugasLms) => void;
  onUpdateTask?: (task: TugasLms) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddSubmission?: (submission: PengumpulanTugas) => void;
  onSendMessage?: (recipientId: string, recipientNama: string, kelasId: string, text: string) => void;
  guruNama?: string;
  guruNip?: string;
  sekolahNama?: string;
  initialTab?: "monitoring" | "bab" | "generator";
  onNavigateToPerangkat?: () => void;
}

export const TugasLmsView: React.FC<TugasLmsViewProps> = ({
  babPelajaran,
  onUpdateBabPelajaran,
  classes = [],
  students = [],
  tasks = [],
  submissions = [],
  onGradeSubmission,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddSubmission,
  onSendMessage,
  guruNama,
  guruNip,
  sekolahNama,
  initialTab = "monitoring",
  onNavigateToPerangkat
}) => {
  const [activeTab, setActiveTab] = useState<"monitoring" | "bab" | "generator">(initialTab);

  // Bab Pelajaran form and management states
  const [isEditingBab, setIsEditingBab] = useState(false);
  const [editingBab, setEditingBab] = useState<BabPelajaran | null>(null);
  const [babJudul, setBabJudul] = useState("");
  const [babDeskripsi, setBabDeskripsi] = useState("");
  const [babDocs, setBabDocs] = useState<{ judul: string; size: string }[]>([]);
  const [babVideoJudul, setBabVideoJudul] = useState("");
  const [babVideoDurasi, setBabVideoDurasi] = useState("");
  const [babVideoSource, setBabVideoSource] = useState("");
  const [babKelasId, setBabKelasId] = useState("VII");
  const [babKelasFilter, setBabKelasFilter] = useState<string>("Semua");
  const [babSearchQuery, setBabSearchQuery] = useState("");

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

  // Docs inputs for adding new document items inside the form
  const [newDocJudul, setNewDocJudul] = useState("");
  const [newDocSize, setNewDocSize] = useState("");

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
        setNewSoalPertanyaan("");
        setNewSoalPilihanA("");
        setNewSoalPilihanB("");
        setNewSoalPilihanC("");
        setNewSoalPilihanD("");
        setNewSoalJawabanBenar("A");
      }
    }

    let updatedList: BabPelajaran[] = [];
    if (editingBab) {
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
      alert("Bab Pelajaran berhasil diperbarui dan disinkronkan ke LMS Siswa!");
    } else {
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
      alert("Bab Pelajaran baru berhasil ditambahkan dan langsung aktif di LMS Siswa!");
    }

    onUpdateBabPelajaran(updatedList);
    setIsEditingBab(false);
  };

  const handleDeleteBabClick = (babId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Bab Pelajaran ini? Tindakan ini tidak dapat dibatalkan.")) {
      const updatedList = babPelajaran.filter((b) => b.id !== babId);
      onUpdateBabPelajaran(updatedList);
      alert("Bab Pelajaran berhasil dihapus dari LMS!");
    }
  };

  const filteredBab = babPelajaran.filter((b) => {
    const matchKelas = babKelasFilter === "Semua" || b.kelasId === babKelasFilter;
    const q = babSearchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      b.judul.toLowerCase().includes(q) ||
      b.deskripsi.toLowerCase().includes(q);
    return matchKelas && matchSearch;
  });

  const totalQuestions = babPelajaran.reduce(
    (acc, b) => acc + (b.soalList?.length || 0),
    0
  );

  const pendingSubmissionsCount = submissions.filter(
    (s) => s.nilai === undefined || s.nilai === null || s.nilai === ("" as any)
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Menu Tugas LMS</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10 text-emerald-300 border border-emerald-400/30">
                Integrasi Siswa & AI Generator
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Pengelolaan Bab Pelajaran, Tugas LMS &amp; Generator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat monitoring status pengumpulan tugas siswa (cek sudah dinilai, belum dinilai, belum dikumpul), pengelolaan materi bab interaktif LMS, serta generator otomatis soal &amp; LKPD berbasis AI Kurikulum Merdeka.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:grid sm:grid-cols-3 gap-3 shrink-0">
            <div
              onClick={() => setActiveTab("monitoring")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px] cursor-pointer transition"
              title="Buka Status Pengumpulan Tugas"
            >
              <span className="text-2xl font-black text-amber-400 block">
                {submissions.length}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                Pengumpulan
              </span>
              {pendingSubmissionsCount > 0 && (
                <span className="text-[9px] font-extrabold text-amber-300 block mt-0.5">
                  {pendingSubmissionsCount} Perlu Nilai
                </span>
              )}
            </div>
            <div
              onClick={() => setActiveTab("bab")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px] cursor-pointer transition"
              title="Buka Kelola Bab LMS"
            >
              <span className="text-2xl font-black text-emerald-400 block">
                {babPelajaran.length}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                Bab Aktif
              </span>
            </div>
            <div
              onClick={() => setActiveTab("generator")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px] cursor-pointer transition"
              title="Buka Generator Soal & LKPD"
            >
              <span className="text-2xl font-black text-amber-300 block">
                {totalQuestions}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                Soal Kuis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Switches */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tab 1: Status Pengumpulan Tugas */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("monitoring");
              setIsEditingBab(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "monitoring"
                ? "bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md shadow-emerald-950/25 border-b-2 border-amber-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-300" />
            <span>Status Pengumpulan Tugas</span>
            {pendingSubmissionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 animate-pulse">
                {pendingSubmissionsCount} Perlu Nilai
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white">
                {tasks.length} Tugas
              </span>
            )}
          </button>

          {/* Tab 2: Kelola Bab LMS */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("bab");
              setIsEditingBab(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "bab"
                ? "bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-900/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Kelola Bab LMS Siswa</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white">
              {babPelajaran.length}
            </span>
          </button>

          {/* Tab 3: Generator Soal & LKPD */}
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "generator"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Generator Soal &amp; LKPD (AI)</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
              AI
            </span>
          </button>
        </div>

        {onNavigateToPerangkat && (
          <button
            type="button"
            onClick={onNavigateToPerangkat}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
            title="Buka Menu Perangkat Ajar PAI (PROTA, PROMES, Modul Ajar)"
          >
            <span>Buka Perangkat Ajar PAI</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        )}
      </div>

      {/* TAB 1: STATUS PENGUMPULAN TUGAS (Cek & Nilai dengan Filter Status) */}
      {activeTab === "monitoring" && (
        <MonitoringPengumpulanTugas
          tasks={tasks}
          submissions={submissions}
          classes={classes}
          students={students}
          onGradeSubmission={onGradeSubmission}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onAddSubmission={onAddSubmission}
          onSendMessage={onSendMessage}
          guruNama={guruNama}
          guruNip={guruNip}
          sekolahNama={sekolahNama}
        />
      )}

      {/* TAB 2: KELOLA BAB LMS */}
      {activeTab === "bab" && (
        <div className="space-y-6">
          {/* Header Action panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>Daftar Bab Pelajaran PAI (Integrasi LMS Siswa)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Setiap bab pelajaran yang dibuat di sini otomatis tampil pada antarmuka akun LMS Siswa lengkap dengan video penjelasan, bahan bacaan dokumen, serta kuis pilihan ganda.
              </p>
            </div>
            {!isEditingBab && (
              <button
                type="button"
                onClick={handleOpenAddBab}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Bab Pelajaran Baru</span>
              </button>
            )}
          </div>

          {isEditingBab ? (
            /* Editing / Adding Bab form */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Edit className="w-4 h-4 text-emerald-700" />
                    <span>{editingBab ? "Edit Bab Pelajaran LMS" : "Tambah Bab Pelajaran LMS Baru"}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Isi rincian bab, tautan media video YouTube, lampiran PDF, dan latihan kuis pilihan ganda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingBab(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBabSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Judul, Kelas, Deskripsi */}
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                        Judul Bab Pelajaran *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bab 4: Iman Kepada Malaikat"
                        value={babJudul}
                        onChange={(e) => setBabJudul(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                        Target Tingkat Kelas LMS *
                      </label>
                      <select
                        value={babKelasId}
                        onChange={(e) => setBabKelasId(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold bg-slate-50 text-slate-800"
                      >
                        <option value="VII">Kelas VII (Fase D)</option>
                        <option value="VIII">Kelas VIII (Fase D)</option>
                        <option value="IX">Kelas IX (Fase D)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                        Deskripsi & Ringkasan Bab *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Jelaskan secara garis besar cakupan materi pada bab ini untuk panduan siswa..."
                        value={babDeskripsi}
                        onChange={(e) => setBabDeskripsi(e.target.value)}
                        className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold bg-slate-50 resize-none"
                      />
                    </div>
                  </div>

                  {/* Middle Column: Documents & PDFs */}
                  <div className="md:col-span-1 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Bahan Bacaan & Dokumen (PDF)
                    </span>

                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                      {babDocs.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic font-semibold p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                          Belum ada dokumen bahan ajar terlampir.
                        </p>
                      ) : (
                        babDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-700"
                          >
                            <span className="truncate max-w-[170px]">📄 {doc.judul} ({doc.size})</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBabDoc(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Document small form */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="block text-[10px] font-bold text-slate-600 uppercase">
                        Tambah Berkas Pendukung
                      </span>
                      <input
                        type="text"
                        placeholder="Judul Berkas PDF..."
                        value={newDocJudul}
                        onChange={(e) => setNewDocJudul(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ukuran (misal: 1.5 MB)"
                          value={newDocSize}
                          onChange={(e) => setNewDocSize(e.target.value)}
                          className="flex-1 p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddBabDoc}
                          className="px-3 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Video Lesson */}
                  <div className="md:col-span-1 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Media Pembelajaran Video
                    </span>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                        Judul Video
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Video Penjelasan Thaharah"
                        value={babVideoJudul}
                        onChange={(e) => setBabVideoJudul(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                        Durasi Video
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 10 Menit"
                        value={babVideoDurasi}
                        onChange={(e) => setBabVideoDurasi(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1 flex items-center justify-between">
                        <span>URL Video YouTube / Tautan *</span>
                        <span className="text-[9px] text-amber-700 font-extrabold">Link YouTube</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://www.youtube.com/watch?v=..."
                        value={babVideoSource}
                        onChange={(e) => setBabVideoSource(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:border-emerald-600"
                      />
                      <span className="block text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Mendukung link share atau embed YouTube apa saja, langsung terbaca di pemutar LMS siswa.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Pembuatan Soal Pilihan Ganda (LMS) */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">
                        📝 Kuis LMS & Pembuatan Soal Otomatis (AI)
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Buat dan kelola latihan kuis pilihan ganda secara manual atau gunakan AI Generator otomatis Kurikulum Merdeka yang akan dikerjakan siswa di LMS.
                      </p>
                    </div>
                  </div>

                  {/* AI Generator Control Box for Teacher */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-2xl p-5 text-white shadow-md space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
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
                          className="w-full bg-slate-800/80 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-400 font-semibold"
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
                          className="w-full bg-slate-800/80 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-400 font-semibold"
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
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* Form Input Soal Baru */}
                    <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                        Tambah Soal Secara Manual
                      </span>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Pertanyaan Soal *
                        </label>
                        <textarea
                          placeholder="Tuliskan pertanyaan disini..."
                          rows={2}
                          value={newSoalPertanyaan}
                          onChange={(e) => setNewSoalPertanyaan(e.target.value)}
                          className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-600">
                          Pilihan Jawaban (A, B, C, D) *
                        </label>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-4 text-center">A</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan A..."
                            value={newSoalPilihanA}
                            onChange={(e) => setNewSoalPilihanA(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-4 text-center">B</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan B..."
                            value={newSoalPilihanB}
                            onChange={(e) => setNewSoalPilihanB(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-4 text-center">C</span>
                          <input
                            type="text"
                            placeholder="Teks pilihan C..."
                            value={newSoalPilihanC}
                            onChange={(e) => setNewSoalPilihanC(e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-4 text-center">D</span>
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
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Kunci Jawaban Benar *
                          </label>
                          <select
                            value={newSoalJawabanBenar}
                            onChange={(e) => setNewSoalJawabanBenar(e.target.value)}
                            className="w-full p-2 text-xs rounded-lg border border-slate-300 font-bold bg-slate-50 text-slate-700"
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
                            className="w-full p-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
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
                        Daftar Soal Kuis ({babSoalList.length} Soal Tersedia)
                      </span>

                      <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 space-y-2.5">
                        {babSoalList.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-xl bg-white text-slate-400 space-y-1">
                            <HelpCircle className="w-8 h-8 text-slate-300" />
                            <p className="text-xs font-semibold">Belum ada latihan soal.</p>
                            <p className="text-[10px] text-slate-400">Gunakan form di samping atau AI Generator untuk menyusun soal kuis.</p>
                          </div>
                        ) : (
                          babSoalList.map((soal, sIdx) => (
                            <div key={soal.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs relative space-y-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveSoal(soal.id)}
                                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingBab(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Simpan Bab Pelajaran LMS
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Chapters List view */
            <div className="space-y-6">
              {/* Filter Kelas & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex-1 md:w-72 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari bab pelajaran..."
                      value={babSearchQuery}
                      onChange={(e) => setBabSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <span className="text-xs font-black text-slate-600 shrink-0">Filter Kelas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Semua", "VII", "VIII", "IX"].map((kelas) => (
                      <button
                        type="button"
                        key={kelas}
                        onClick={() => setBabKelasFilter(kelas)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          babKelasFilter === kelas
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {kelas === "Semua" ? "Semua Kelas" : `Kelas ${kelas}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Bab Pelajaran */}
              {filteredBab.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-700">Tidak ada bab pelajaran yang ditemukan</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto font-medium">
                    {babSearchQuery || babKelasFilter !== "Semua"
                      ? "Coba sesuaikan kata kunci pencarian atau ganti filter kelas."
                      : "Mulai tambahkan bab pelajaran pertama untuk ditampilkan pada LMS siswa."}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddBab}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition inline-flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Bab Pelajaran</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                  {filteredBab.map((bab) => {
                    return (
                      <div
                        key={bab.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden space-y-4"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Aktif di LMS
                              </span>
                              <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                Kelas {bab.kelasId || "VII"}
                              </span>
                              {bab.soalList && bab.soalList.length > 0 && (
                                <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                  📝 {bab.soalList.length} Soal Kuis
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditBab(bab)}
                                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                title="Edit Bab"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBabClick(bab.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Hapus Bab"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                              {bab.judul}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                              {bab.deskripsi}
                            </p>
                          </div>

                          {/* Video info snippet */}
                          {bab.video && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
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
                              Dokumen Bahan Ajar ({bab.dokumen?.length || 0}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {bab.dokumen && bab.dokumen.length > 0 ? (
                                bab.dokumen.map((doc, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 max-w-[170px] truncate"
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

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                          <span>Kode: {bab.id}</span>
                          <span className="text-emerald-700 flex items-center gap-1 font-bold">
                            ✔ Sinkron ke Siswa
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GENERATOR SOAL & LKPD AI */}
      {activeTab === "generator" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="leading-relaxed">
              <span className="font-extrabold">Generator Soal & Lembar Kerja Peserta Didik (LKPD) berbasis AI Kurikulum Merdeka.</span>
              {" "}Seluruh soal pilihan ganda, isian, uraian, rubrik penilaian, dan LKPD dapat dicetak, diunduh ke Word/Excel, atau disimpan langsung ke dalam Bab Pelajaran LMS Siswa.
            </div>
          </div>

          <GeneratorSoalLKPD
            babPelajaran={babPelajaran}
            onUpdateBabPelajaran={onUpdateBabPelajaran}
            guruNama={guruNama}
          />
        </div>
      )}
    </div>
  );
};

export default TugasLmsView;
