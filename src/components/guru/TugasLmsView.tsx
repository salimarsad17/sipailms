/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  X,
  CheckSquare,
  Search,
  Video,
  FileText,
  ArrowRight,
  Eye,
  Calendar,
  CheckCircle2,
  ClipboardList
} from "lucide-react";
import { BabPelajaran, SoalPilihanGanda, Kelas, Siswa, TugasLms, PengumpulanTugas } from "../../types";
import { generateAutomaticQuiz } from "../../lib/quizGenerator";
import GeneratorSoalLKPD from "./GeneratorSoalLKPD";
import MonitoringPengumpulanTugas from "./MonitoringPengumpulanTugas";
import MediaFileViewerModal, { MediaViewerData } from "../common/MediaFileViewerModal";

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
  guruNama = "Sadiqul Alim, S.Pd.I.",
  guruNip = "198905142022211003",
  sekolahNama = "UPT SMPN 2 REBANG TANGKAS",
  initialTab = "monitoring",
  onNavigateToPerangkat
}) => {
  // Original 3-tab PAILMS navigation (distinct from Media Ajar Wayground)
  const [activeTab, setActiveTab] = useState<"monitoring" | "bab" | "generator">(initialTab);

  // Filter & Search States for Kelola Bab LMS
  const [selectedGrade, setSelectedGrade] = useState<"Semua" | "VII" | "VIII" | "IX">("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Media Viewer state
  const [viewerMedia, setViewerMedia] = useState<MediaViewerData | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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

  // Soal Pilihan Ganda States
  const [babSoalList, setBabSoalList] = useState<SoalPilihanGanda[]>([]);
  const [newSoalPertanyaan, setNewSoalPertanyaan] = useState("");
  const [newSoalPilihanA, setNewSoalPilihanA] = useState("");
  const [newSoalPilihanB, setNewSoalPilihanB] = useState("");
  const [newSoalPilihanC, setNewSoalPilihanC] = useState("");
  const [newSoalPilihanD, setNewSoalPilihanD] = useState("");
  const [newSoalJawabanBenar, setNewSoalJawabanBenar] = useState("A");

  // Auto Quiz Generator States for Bab LMS
  const [autoCount, setAutoCount] = useState<number>(5);
  const [autoDifficulty, setAutoDifficulty] = useState<"Mudah" | "Sedang" | "HOTS">("Sedang");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorToast, setGeneratorToast] = useState<string | null>(null);

  // Docs inputs for adding new document items inside the form
  const [newDocJudul, setNewDocJudul] = useState("");
  const [newDocSize, setNewDocSize] = useState("");

  // Preview Modal State
  const [previewBab, setPreviewBab] = useState<BabPelajaran | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Quick Assign Homework Modal State (for Ruang Kelas LMS Siswa)
  const [assignBab, setAssignBab] = useState<BabPelajaran | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignKelasTarget, setAssignKelasTarget] = useState<string>(classes[0]?.id || "VII-A");
  const [assignDeadlineDate, setAssignDeadlineDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  });

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Bab List
  const filteredBabList = useMemo(() => {
    return babPelajaran.filter((b) => {
      const matchGrade = selectedGrade === "Semua" || b.kelasId === selectedGrade;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.judul.toLowerCase().includes(q) ||
        b.deskripsi.toLowerCase().includes(q);
      return matchGrade && matchSearch;
    });
  }, [babPelajaran, selectedGrade, searchQuery]);

  // Overall metrics
  const totalQuestions = useMemo(() => {
    return babPelajaran.reduce((acc, b) => acc + (b.soalList?.length || 0), 0);
  }, [babPelajaran]);

  const pendingSubmissionsCount = useMemo(() => {
    return submissions.filter(
      (s) => s.nilai === undefined || s.nilai === null || s.nilai === ("" as any)
    ).length;
  }, [submissions]);

  // Assign Regular LMS Task from Bab
  const handleConfirmAssign = () => {
    if (!assignBab) return;
    if (onAddTask) {
      const newTask: TugasLms = {
        id: "task-" + Date.now(),
        judul: `Tugas Bab: ${assignBab.judul}`,
        kelasId: assignKelasTarget,
        bab: assignBab.judul,
        deadline: assignDeadlineDate,
        deskripsi: `Pelajari materi dan kerjakan latihan pada ${assignBab.judul} di menu Ruang Kelas LMS PAI.`
      };
      onAddTask(newTask);
    }
    setIsAssignModalOpen(false);
    showToast(`Tugas "${assignBab.judul}" berhasil dikirim ke Kelas ${assignKelasTarget}!`);
  };

  // ==========================================
  // BAB CRUD HANDLERS
  // ==========================================
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
    setActiveTab("bab");
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
    setActiveTab("bab");
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
      alert("Silakan isi Judul Bab terlebih dahulu agar soal PAI yang disusun relevan!");
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
      setGeneratorToast(`Alhamdulillah! ${generatedQuestions.length} Soal PAI (${autoDifficulty}) berhasil disusun untuk ${chapterName}.`);
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
            soalList: babSoalList
          };
        }
        return b;
      });
      showToast("Bab pelajaran berhasil diperbarui dan disinkronkan ke Ruang Kelas LMS Siswa!");
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
        soalList: babSoalList
      };
      updatedList = [...babPelajaran, newBab];
      showToast("Bab pelajaran baru berhasil ditambahkan ke Ruang Kelas LMS PAI!");
    }

    onUpdateBabPelajaran(updatedList);
    setIsEditingBab(false);
  };

  const handleDeleteBabClick = (babId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus bab materi ini dari Ruang Kelas LMS?")) {
      const updatedList = babPelajaran.filter((b) => b.id !== babId);
      onUpdateBabPelajaran(updatedList);
      showToast("Bab pelajaran berhasil dihapus dari LMS!");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-950 text-amber-300 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-black">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. PAILMS TUGAS LMS HEADER                                */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <span>Ruang Tugas &amp; Penilaian LMS PAI</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-200">{sekolahNama}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Tugas LMS, Kelola Bab &amp; Generator Soal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pantau pengumpulan tugas kelas, kelola materi bab &amp; latihan kuis di Ruang Kelas LMS Siswa, serta susun LKPD PAI secara terstruktur.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-700/50">
              <span className="block text-[11px] font-semibold text-emerald-300">Tugas LMS</span>
              <strong className="text-lg font-black text-white tabular-nums">{tasks.length}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-700/50">
              <span className="block text-[11px] font-semibold text-amber-300">Perlu Dinilai</span>
              <strong className="text-lg font-black text-amber-400 tabular-nums">{pendingSubmissionsCount}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-700/50">
              <span className="block text-[11px] font-semibold text-emerald-300">Bab Materi</span>
              <strong className="text-lg font-black text-white tabular-nums">{babPelajaran.length}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-700/50">
              <span className="block text-[11px] font-semibold text-emerald-300">Bank Soal Bab</span>
              <strong className="text-lg font-black text-white tabular-nums">{totalQuestions}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PAILMS NAVIGATION TABS (3 TABS)                        */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setActiveTab("monitoring");
              setIsEditingBab(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "monitoring"
                ? "bg-emerald-800 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ClipboardList className={`w-4 h-4 ${activeTab === "monitoring" ? "text-amber-300" : "text-emerald-700"}`} />
            <span>Monitoring &amp; Penilaian Tugas</span>
            {pendingSubmissionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {pendingSubmissionsCount} Baru
              </span>
            ) : (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "monitoring" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                {submissions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("bab");
              setIsEditingBab(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "bab"
                ? "bg-emerald-800 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === "bab" ? "text-amber-300" : "text-emerald-700"}`} />
            <span>Kelola Bab &amp; Materi LMS</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "bab" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
              {babPelajaran.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("generator");
              setIsEditingBab(false);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "generator"
                ? "bg-emerald-800 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "generator" ? "text-amber-300" : "text-amber-500"}`} />
            <span>Generator Soal &amp; LKPD</span>
          </button>
        </div>

        {onNavigateToPerangkat && (
          <button
            type="button"
            onClick={onNavigateToPerangkat}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <span>Buka Perangkat Ajar PAI</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MONITORING PENGUMPULAN TUGAS & BUKU NILAI          */}
      {/* ========================================================= */}
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

      {/* ========================================================= */}
      {/* TAB 2: KELOLA BAB LMS & MATERI PEMBELAJARAN              */}
      {/* ========================================================= */}
      {activeTab === "bab" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>Pengelolaan Materi Bab &amp; Kuis Ruang Kelas LMS Siswa</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Setiap bab pelajaran yang dikelola di sini langsung tampil pada menu Ruang Kelas LMS PAI Siswa (materi PDF, video pembelajaran, dan kuis latihan bab).
              </p>
            </div>
            {!isEditingBab && (
              <button
                type="button"
                onClick={handleOpenAddBab}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Bab Baru</span>
              </button>
            )}
          </div>

          {!isEditingBab && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                {(["Semua", "VII", "VIII", "IX"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedGrade(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedGrade === k
                        ? "bg-white text-emerald-900 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {k === "Semua" ? "Semua Kelas" : `Kelas ${k}`}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px] sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari judul bab atau materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-700 font-medium"
                />
              </div>
            </div>
          )}

          {isEditingBab ? (
            /* Editing / Adding Bab form */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Edit className="w-4 h-4 text-emerald-700" />
                    <span>{editingBab ? "Edit Bab Pelajaran LMS" : "Tambah Bab Pelajaran LMS Baru"}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Isi rincian bab, tautan video pembelajaran, lampiran PDF, dan latihan kuis pilihan ganda untuk Ruang Kelas LMS Siswa.
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
                        Deskripsi &amp; Ringkasan Bab *
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
                      Bahan Bacaan &amp; Dokumen (PDF)
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
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
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
                          className="px-3 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition cursor-pointer"
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
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:border-emerald-700"
                      />
                      <span className="block text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Mendukung link share atau embed YouTube apa saja, langsung terbaca di pemutar Ruang Kelas LMS siswa.
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
                        Kuis Latihan Bab LMS &amp; Pembuatan Soal Otomatis
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Kelola soal pilihan ganda secara manual atau susun otomatis untuk latihan bab di Ruang Kelas LMS Siswa.
                      </p>
                    </div>
                  </div>

                  {/* Auto Quiz Generator Control Box */}
                  <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-5 text-white shadow-md space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <h4 className="text-xs font-bold tracking-wide">
                          Penyusunan Soal Kuis Bab Otomatis {babJudul ? `– ${babJudul.split(":")[1]?.trim() || babJudul}` : ""}
                        </h4>
                      </div>
                      <span className="text-[10px] text-amber-300 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                        PAILMS Bank Soal
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
                          <option value={10}>10 Soal Lengkap (Evaluasi Bab)</option>
                          <option value={15}>15 Soal Pendalaman Materi</option>
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
                          <option value="Mudah">Dasar (Mudah &amp; Pemahaman)</option>
                          <option value="Sedang">Standar (Sedang / Aplikasi)</option>
                          <option value="HOTS">HOTS (Penalaran Tinggi)</option>
                        </select>
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={handleGenerateTeacherAutoQuiz}
                          className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                              <span>Menyusun Soal...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-slate-950" />
                              <span>Buat Soal Otomatis</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {generatorToast && (
                      <div className="p-3 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{generatorToast}</span>
                      </div>
                    )}
                  </div>

                  {/* Manual Question Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
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
                          className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-700 bg-slate-50 font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-600">
                          Pilihan Jawaban (A, B, C, D) *
                        </label>

                        {[
                          { key: "A", val: newSoalPilihanA, set: setNewSoalPilihanA },
                          { key: "B", val: newSoalPilihanB, set: setNewSoalPilihanB },
                          { key: "C", val: newSoalPilihanC, set: setNewSoalPilihanC },
                          { key: "D", val: newSoalPilihanD, set: setNewSoalPilihanD }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-400 w-4 text-center">{item.key}</span>
                            <input
                              type="text"
                              placeholder={`Teks pilihan ${item.key}...`}
                              value={item.val}
                              onChange={(e) => item.set(e.target.value)}
                              className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium"
                            />
                          </div>
                        ))}
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
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah ke Soal</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Question List Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">
                          Daftar Soal Kuis ({babSoalList.length} Soal)
                        </span>
                        {babSoalList.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setBabSoalList([])}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Hapus Semua Soal
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {babSoalList.length === 0 ? (
                          <div className="p-6 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                            Belum ada soal pada kuis bab ini. Silakan susun otomatis atau ketik manual.
                          </div>
                        ) : (
                          babSoalList.map((soal, sIdx) => (
                            <div key={soal.id || sIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-slate-900 leading-tight">
                                  {sIdx + 1}. {soal.pertanyaan}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSoal(soal.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                                {soal.pilihan.map((p, pIdx) => {
                                  const pKey = String.fromCharCode(65 + pIdx);
                                  const isKey = pKey === soal.jawabanBenar;
                                  return (
                                    <span key={pIdx} className={`truncate px-2 py-0.5 rounded ${isKey ? "bg-emerald-100 text-emerald-900 font-bold" : "bg-slate-50"}`}>
                                      {pKey}. {p} {isKey && "✓"}
                                    </span>
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
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-amber-300" />
                    <span>Simpan Bab Pelajaran LMS</span>
                  </button>
                </div>
              </form>
            </div>
          ) : filteredBabList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 space-y-2.5">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Belum ada Bab Pelajaran yang cocok</p>
              <p className="text-xs text-slate-500">
                Ubah filter kelas atau kata kunci pencarian, atau tambahkan bab pelajaran baru.
              </p>
            </div>
          ) : (
            /* Bab List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBabList.map((bab) => (
                <div
                  key={bab.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800">
                        Kelas {bab.kelasId || "VII"} SMP
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBab(bab);
                            setIsPreviewOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Pratinjau Materi & Soal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditBab(bab)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Bab"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBabClick(bab.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Bab"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{bab.judul}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{bab.deskripsi}</p>

                    <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{bab.soalList?.length || 0} Soal Kuis</span>
                      </span>
                      {bab.video?.source && (
                        <button
                          type="button"
                          onClick={() => {
                            setViewerMedia({
                              title: bab.video.judul || bab.judul,
                              videoUrl: bab.video.source,
                              textContent: bab.deskripsi
                            });
                            setIsViewerOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-sky-700 hover:underline cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video ({bab.video.duration || "Materi"})</span>
                        </button>
                      )}
                      {bab.dokumen && bab.dokumen.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>{bab.dokumen.length} Dokumen PDF</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewBab(bab);
                        setIsPreviewOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAssignBab(bab);
                        setIsAssignModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tugaskan ke Kelas</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GENERATOR SOAL & LKPD                              */}
      {/* ========================================================= */}
      {activeTab === "generator" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-5 shadow-md border border-emerald-700/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">
                Generator Soal &amp; Lembar Kerja Peserta Didik (LKPD) PAI
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                Susun paket soal evaluasi dan LKPD terstruktur untuk diterbitkan ke Ruang Kelas LMS Siswa maupun diunduh untuk pembelajaran tatap muka.
              </p>
            </div>
          </div>

          <GeneratorSoalLKPD
            babPelajaran={babPelajaran}
            onUpdateBabPelajaran={onUpdateBabPelajaran}
            guruNama={guruNama}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PRATINJAU MATERI & SOAL BAB LMS                  */}
      {/* ========================================================= */}
      {isPreviewOpen && previewBab && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Pratinjau Materi &amp; Kuis Bab LMS
                  </h3>
                  <p className="text-xs text-slate-500">
                    {previewBab.judul} (Kelas {previewBab.kelasId} SMP)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-emerald-900 block">Ringkasan Materi Bab:</span>
                <p className="leading-relaxed">{previewBab.deskripsi}</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                  Daftar Soal Latihan Bab ({previewBab.soalList?.length || 0} Soal):
                </span>

                {previewBab.soalList && previewBab.soalList.length > 0 ? (
                  previewBab.soalList.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <p className="font-bold text-slate-900">
                        {idx + 1}. {q.pertanyaan}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {q.pilihan.map((opt, oIdx) => {
                          const letter = String.fromCharCode(65 + oIdx);
                          const isKey = letter === q.jawabanBenar;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border text-[11px] font-medium ${
                                isKey
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}
                            >
                              <span className="font-black mr-1">{letter}.</span>
                              <span>{opt}</span>
                              {isKey && <span className="ml-1 text-emerald-700">✓ Kunci</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 text-center">
                    Belum ada soal latihan pada bab materi ini.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Tutup Pratinjau
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = previewBab;
                  setIsPreviewOpen(false);
                  handleOpenEditBab(b);
                }}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Bab &amp; Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TUGASKAN BAB KE KELAS LMS                        */}
      {/* ========================================================= */}
      {isAssignModalOpen && assignBab && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Tugaskan Bab ke Kelas LMS
                  </h3>
                  <p className="text-xs text-slate-500">
                    {assignBab.judul}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Kelas Tujuan Tugas:
                </label>
                <select
                  value={assignKelasTarget}
                  onChange={(e) => setAssignKelasTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                >
                  {classes.length > 0 ? (
                    classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama || `Kelas ${c.id}`} PAI
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="VII-A">Kelas VII-A PAI</option>
                      <option value="VII-B">Kelas VII-B PAI</option>
                      <option value="VIII-A">Kelas VIII-A PAI</option>
                      <option value="VIII-B">Kelas VIII-B PAI</option>
                      <option value="IX-A">Kelas IX-A PAI</option>
                      <option value="IX-B">Kelas IX-B PAI</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tenggat Waktu Pengerjaan (Deadline):
                </label>
                <input
                  type="date"
                  value={assignDeadlineDate}
                  onChange={(e) => setAssignDeadlineDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Terintegrasi dengan Ruang Kelas LMS Siswa:</span>
                </span>
                <p className="text-emerald-950/80 leading-relaxed">
                  Tugas akan tampil di Garis Waktu &amp; Ruang Kelas LMS Siswa. Pengumpulan siswa langsung masuk ke tab Monitoring &amp; Penilaian Tugas.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Terbitkan Tugas LMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media File Viewer & Player Modal */}
      <MediaFileViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        data={viewerMedia}
      />
    </div>
  );
};

export default TugasLmsView;
