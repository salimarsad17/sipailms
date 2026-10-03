/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Award,
  FileText,
  Video,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  X,
  CheckSquare,
  BookOpenCheck,
  Download,
  ExternalLink,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Send,
  User,
  MessageSquare,
  Copy,
  Check,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  HelpCircle,
  Eye
} from "lucide-react";
import { TugasLms, PengumpulanTugas, Kelas, Siswa } from "../../types";
import * as XLSX from "xlsx";

export type StatusPengumpulanFilter = "semua" | "sudah_dinilai" | "belum_dinilai" | "belum_dikumpul";

interface MonitoringPengumpulanTugasProps {
  tasks: TugasLms[];
  submissions: PengumpulanTugas[];
  classes: Kelas[];
  students: Siswa[];
  onGradeSubmission?: (subId: string, score: number, comment: string) => void;
  onAddTask?: (task: TugasLms) => void;
  onUpdateTask?: (task: TugasLms) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddSubmission?: (submission: PengumpulanTugas) => void;
  onSendMessage?: (recipientId: string, recipientNama: string, kelasId: string, text: string) => void;
  guruNama?: string;
  guruNip?: string;
  sekolahNama?: string;
}

export interface MonitoringRowItem {
  id: string;
  task: TugasLms;
  student: Siswa;
  submission?: PengumpulanTugas;
  status: "sudah_dinilai" | "belum_dinilai" | "belum_dikumpul";
}

export default function MonitoringPengumpulanTugas({
  tasks = [],
  submissions = [],
  classes = [],
  students = [],
  onGradeSubmission,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddSubmission,
  onSendMessage,
  guruNama = "Guru PAI",
  guruNip = "",
  sekolahNama = "UPT SMPN 2 Rebang Tangkas"
}: MonitoringPengumpulanTugasProps) {
  // Filter States
  const [filterStatus, setFilterStatus] = useState<StatusPengumpulanFilter>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string>("Semua");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("Semua");

  // Modals
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [activeGradingRow, setActiveGradingRow] = useState<MonitoringRowItem | null>(null);
  const [scoreInput, setScoreInput] = useState<number | "">("");
  const [commentInput, setCommentInput] = useState("");

  // Reminder Modal
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activeReminderRow, setActiveReminderRow] = useState<MonitoringRowItem | null>(null);
  const [reminderMessage, setReminderMessage] = useState("");
  const [copiedReminder, setCopiedReminder] = useState(false);
  const [reminderSentToast, setReminderSentToast] = useState(false);

  // Manual Submission Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [activeManualRow, setActiveManualRow] = useState<MonitoringRowItem | null>(null);
  const [manualNote, setManualNote] = useState("");
  const [manualScore, setManualScore] = useState<number | "">("");
  const [manualComment, setManualComment] = useState("");

  // Create Task Modal
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [taskJudul, setTaskJudul] = useState("");
  const [taskKelasId, setTaskKelasId] = useState(classes[0]?.id || "VII-A");
  const [taskBab, setTaskBab] = useState("Bab 1: Meneladani Karakter Mulia");
  const [taskDeskripsi, setTaskDeskripsi] = useState("");
  const [taskDeadlineDate, setTaskDeadlineDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  });
  const [taskFilePendukung, setTaskFilePendukung] = useState("");

  // Audio simulation state for hafalan submission review
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Available classes list
  const availableClassIds = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.id));
    students.forEach((s) => s.kelasId && set.add(s.kelasId));
    tasks.forEach((t) => t.kelasId && t.kelasId !== "Semua" && set.add(t.kelasId));
    return Array.from(set).sort();
  }, [classes, students, tasks]);

  // Build the complete universe of monitoring rows (student x task)
  const allRows: MonitoringRowItem[] = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const rows: MonitoringRowItem[] = [];
    const handledCombinations = new Set<string>();

    tasks.forEach((task) => {
      // Find students targeted by this task
      const targetStudents = students.filter((s) => {
        if (task.kelasId === "Semua") return true;
        return s.kelasId === task.kelasId;
      });

      targetStudents.forEach((student) => {
        const key = `${task.id}_${student.nisn}`;
        handledCombinations.add(key);

        const sub = submissions.find(
          (s) => s.tugasId === task.id && s.siswaNisn === student.nisn
        );

        let status: "sudah_dinilai" | "belum_dinilai" | "belum_dikumpul" = "belum_dikumpul";
        if (sub) {
          if (sub.nilai !== undefined && sub.nilai !== null && sub.nilai !== ("" as any)) {
            status = "sudah_dinilai";
          } else {
            status = "belum_dinilai";
          }
        }

        rows.push({
          id: key,
          task,
          student,
          submission: sub,
          status
        });
      });
    });

    // Also include any stray submissions where student or task combination wasn't matched above
    submissions.forEach((sub) => {
      const key = `${sub.tugasId}_${sub.siswaNisn}`;
      if (!handledCombinations.has(key)) {
        handledCombinations.add(key);
        const matchingTask = tasks.find((t) => t.id === sub.tugasId) || {
          id: sub.tugasId,
          kelasId: sub.kelasId || "VII-A",
          judul: sub.tugasJudul || "Tugas Mandiri LMS",
          bab: "Materi PAI",
          deskripsi: "Pengumpulan tugas LMS siswa",
          deadline: sub.tanggalKumpul || "-"
        };
        const matchingStudent = students.find((s) => s.nisn === sub.siswaNisn) || {
          nisn: sub.siswaNisn,
          nama: sub.siswaNama || "Siswa PAI",
          gender: "Laki-laki" as const,
          agama: "Islam",
          statusKeaktifan: "Aktif" as const,
          kelasId: sub.kelasId || "VII-A"
        };

        const status =
          sub.nilai !== undefined && sub.nilai !== null && sub.nilai !== ("" as any)
            ? "sudah_dinilai"
            : "belum_dinilai";

        rows.push({
          id: key,
          task: matchingTask,
          student: matchingStudent,
          submission: sub,
          status
        });
      }
    });

    return rows;
  }, [tasks, students, submissions]);

  // Compute stats across current class and task scope
  const scopedRows = useMemo(() => {
    return allRows.filter((row) => {
      const matchKelas = selectedKelas === "Semua" || row.student.kelasId === selectedKelas;
      const matchTask = selectedTaskId === "Semua" || row.task.id === selectedTaskId;
      return matchKelas && matchTask;
    });
  }, [allRows, selectedKelas, selectedTaskId]);

  const totalTargetCount = scopedRows.length;
  const sudahDinilaiCount = scopedRows.filter((r) => r.status === "sudah_dinilai").length;
  const belumDinilaiCount = scopedRows.filter((r) => r.status === "belum_dinilai").length;
  const belumDikumpulCount = scopedRows.filter((r) => r.status === "belum_dikumpul").length;

  const completionPercentage =
    totalTargetCount > 0 ? Math.round((sudahDinilaiCount / totalTargetCount) * 100) : 0;
  const submittedPercentage =
    totalTargetCount > 0
      ? Math.round(((sudahDinilaiCount + belumDinilaiCount) / totalTargetCount) * 100)
      : 0;

  // Filtered rows applying status filter & search query
  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return scopedRows.filter((row) => {
      // 1. Status Filter
      if (filterStatus === "sudah_dinilai" && row.status !== "sudah_dinilai") return false;
      if (filterStatus === "belum_dinilai" && row.status !== "belum_dinilai") return false;
      if (filterStatus === "belum_dikumpul" && row.status !== "belum_dikumpul") return false;

      // 2. Search Query (Nama, NISN, Judul Tugas, Bab, Komentar)
      if (q) {
        const studentNama = row.student.nama.toLowerCase();
        const studentNisn = (row.student.nisn || "").toLowerCase();
        const taskJudul = row.task.judul.toLowerCase();
        const taskBab = (row.task.bab || "").toLowerCase();
        const komentar = (row.submission?.komentarGuru || "").toLowerCase();
        const konten = (row.submission?.kontenTeks || "").toLowerCase();

        const matchSearch =
          studentNama.includes(q) ||
          studentNisn.includes(q) ||
          taskJudul.includes(q) ||
          taskBab.includes(q) ||
          komentar.includes(q) ||
          konten.includes(q);

        if (!matchSearch) return false;
      }

      return true;
    });
  }, [scopedRows, filterStatus, searchQuery]);

  // Open Grading Modal
  const handleOpenGrading = (row: MonitoringRowItem) => {
    setActiveGradingRow(row);
    setScoreInput(row.submission?.nilai !== undefined ? row.submission.nilai : 85);
    setCommentInput(row.submission?.komentarGuru || "");
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setGradingModalOpen(true);
  };

  // Submit Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingRow || !activeGradingRow.submission) {
      alert("Pengumpulan tidak ditemukan!");
      return;
    }
    const scoreVal = typeof scoreInput === "number" ? scoreInput : parseInt(String(scoreInput), 10);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert("Masukkan nilai angka yang valid antara 0 sampai 100!");
      return;
    }

    if (onGradeSubmission) {
      onGradeSubmission(activeGradingRow.submission.id, scoreVal, commentInput.trim());
    }
    setGradingModalOpen(false);
    setActiveGradingRow(null);
  };

  // Open Reminder Modal
  const handleOpenReminder = (row: MonitoringRowItem) => {
    setActiveReminderRow(row);
    const defaultMsg = `Assalamualaikum Wr. Wb. Mengingatkan ananda ${row.student.nama} (${row.student.kelasId || "Kelas PAI"}) agar segera menyelesaikan dan mengumpulkan tugas LMS: "${row.task.judul}". Batas tenggat: ${row.task.deadline || "Segera"}. Semangat belajar dan terus berprestasi! (Guru PAI: ${guruNama})`;
    setReminderMessage(defaultMsg);
    setCopiedReminder(false);
    setReminderSentToast(false);
    setReminderModalOpen(true);
  };

  const handleCopyReminder = () => {
    navigator.clipboard.writeText(reminderMessage);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  const handleSendLmsMessage = () => {
    if (!activeReminderRow) return;
    if (onSendMessage) {
      onSendMessage(
        activeReminderRow.student.nisn,
        activeReminderRow.student.nama,
        activeReminderRow.student.kelasId || "VII-A",
        reminderMessage
      );
    }
    setReminderSentToast(true);
    setTimeout(() => {
      setReminderSentToast(false);
      setReminderModalOpen(false);
    }, 1500);
  };

  // Open Manual Submission Modal
  const handleOpenManualModal = (row: MonitoringRowItem) => {
    setActiveManualRow(row);
    setManualNote("Mengumpulkan tugas fisik / lembar kerja di kelas secara langsung.");
    setManualScore(85);
    setManualComment("Tugas luring telah diperiksa dan dinilai dengan baik.");
    setManualModalOpen(true);
  };

  const handleSaveManualSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManualRow) return;
    const scoreVal = typeof manualScore === "number" ? manualScore : parseInt(String(manualScore), 10);

    const newSub: PengumpulanTugas = {
      id: "sub-manual-" + Date.now(),
      tugasId: activeManualRow.task.id,
      tugasJudul: activeManualRow.task.judul,
      siswaNisn: activeManualRow.student.nisn,
      siswaNama: activeManualRow.student.nama,
      kelasId: activeManualRow.student.kelasId || "VII-A",
      tanggalKumpul: new Date().toISOString().replace("T", " ").slice(0, 16),
      tipePengumpulan: "Teks",
      kontenTeks: manualNote.trim(),
      nilai: !isNaN(scoreVal) ? scoreVal : undefined,
      komentarGuru: manualComment.trim()
    };

    if (onAddSubmission) {
      onAddSubmission(newSub);
    }
    setManualModalOpen(false);
    setActiveManualRow(null);
  };

  // Handle Create Task
  const handleSaveCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskJudul.trim()) {
      alert("Judul tugas wajib diisi!");
      return;
    }
    const newTask: TugasLms = {
      id: "tugas-" + Date.now(),
      kelasId: taskKelasId,
      judul: taskJudul.trim(),
      bab: taskBab.trim(),
      deskripsi: taskDeskripsi.trim(),
      deadline: taskDeadlineDate.replace("T", " "),
      filePendukung: taskFilePendukung.trim() || undefined
    };

    if (onAddTask) {
      onAddTask(newTask);
    }
    setCreateTaskModalOpen(false);
    setTaskJudul("");
    setTaskDeskripsi("");
    setTaskFilePendukung("");
  };

  // Export to Excel
  const handleExportExcel = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const rows = [
      [`REKAPITULASI MONITORING PENGUMPULAN TUGAS LMS PAI`],
      [`SEKOLAH: ${sekolahNama.toUpperCase()}`],
      [`GURU PAI: ${guruNama.toUpperCase()} • TANGGAL CETAK: ${dateStr}`],
      [`CAKUPAN KELAS: ${selectedKelas} • FILTER STATUS: ${filterStatus.toUpperCase()}`],
      [],
      [
        "No",
        "Nama Siswa",
        "NISN",
        "Kelas",
        "Judul Tugas LMS",
        "Bab Materi",
        "Batas Tenggat (Deadline)",
        "Waktu Pengumpulan",
        "Jenis Pengumpulan",
        "Status Pengumpulan",
        "Nilai Siswa",
        "Komentar / Catatan Guru"
      ]
    ];

    filteredRows.forEach((row, index) => {
      const statusText =
        row.status === "sudah_dinilai"
          ? "Sudah Dinilai"
          : row.status === "belum_dinilai"
          ? "Belum Dinilai (Menunggu)"
          : "Belum Dikumpul";

      rows.push([
        index + 1,
        row.student.nama,
        row.student.nisn,
        row.student.kelasId || "-",
        row.task.judul,
        row.task.bab || "-",
        row.task.deadline || "-",
        row.submission?.tanggalKumpul || "Belum Dikumpulkan",
        row.submission?.tipePengumpulan || "-",
        statusText,
        row.submission?.nilai !== undefined ? row.submission.nilai : "-",
        row.submission?.komentarGuru || "-"
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Monitoring Tugas LMS");
    XLSX.writeFile(wb, `PAILMS_Monitoring_Tugas_${selectedKelas}_${dateStr}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* KPI / Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Target */}
        <div
          onClick={() => setFilterStatus("semua")}
          className={`bg-white rounded-2xl p-4 border transition cursor-pointer transform hover:-translate-y-0.5 ${
            filterStatus === "semua"
              ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
              : "border-slate-200/80 shadow-2xs hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Target Siswa</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalTargetCount}
            </span>
            <span className="text-[11px] font-bold text-slate-400">Tugas Siswa</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
            <span>Diterbitkan di {tasks.length} Tugas LMS</span>
          </div>
        </div>

        {/* Sudah Dinilai */}
        <div
          onClick={() => setFilterStatus("sudah_dinilai")}
          className={`bg-white rounded-2xl p-4 border transition cursor-pointer transform hover:-translate-y-0.5 ${
            filterStatus === "sudah_dinilai"
              ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/20"
              : "border-slate-200/80 shadow-2xs hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Sudah Dinilai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {sudahDinilaiCount}
            </span>
            <span className="text-[11px] font-extrabold text-emerald-600">
              ({completionPercentage}%)
            </span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Award className="w-3 h-3 text-emerald-600" />
            <span>Telah selesai dikoreksi guru</span>
          </div>
        </div>

        {/* Belum Dinilai */}
        <div
          onClick={() => setFilterStatus("belum_dinilai")}
          className={`bg-white rounded-2xl p-4 border transition cursor-pointer transform hover:-translate-y-0.5 ${
            filterStatus === "belum_dinilai"
              ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/20"
              : "border-slate-200/80 shadow-2xs hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Belum Dinilai</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {belumDinilaiCount}
            </span>
            {belumDinilaiCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black animate-pulse">
                Perlu Aksi
              </span>
            )}
          </div>
          <div className="mt-2 text-[10px] text-amber-700 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Menunggu penilaian guru</span>
          </div>
        </div>

        {/* Belum Dikumpul */}
        <div
          onClick={() => setFilterStatus("belum_dikumpul")}
          className={`bg-white rounded-2xl p-4 border transition cursor-pointer transform hover:-translate-y-0.5 ${
            filterStatus === "belum_dikumpul"
              ? "border-rose-500 ring-2 ring-rose-500/20 shadow-md bg-rose-50/20"
              : "border-slate-200/80 shadow-2xs hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Belum Dikumpul</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {belumDikumpulCount}
            </span>
            <span className="text-[11px] font-bold text-rose-500">
              ({totalTargetCount > 0 ? Math.round((belumDikumpulCount / totalTargetCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[10px] text-rose-700 font-semibold flex items-center gap-1">
            <span>Dapat dikirimi pesan pengingat</span>
          </div>
        </div>
      </div>

      {/* Progress Bar of Submissions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
          <span className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Tingkat Kepatuhan Pengumpulan & Penilaian Tugas PAI</span>
          </span>
          <span className="text-emerald-700 font-black">
            {submittedPercentage}% Terkumpul ({sudahDinilaiCount + belumDinilaiCount}/{totalTargetCount})
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex p-0.5 border border-slate-200/60">
          <div
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
            title={`Sudah Dinilai: ${sudahDinilaiCount} siswa (${completionPercentage}%)`}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{
              width: `${
                totalTargetCount > 0
                  ? Math.round((belumDinilaiCount / totalTargetCount) * 100)
                  : 0
              }%`
            }}
            title={`Belum Dinilai: ${belumDinilaiCount} siswa`}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Sudah Dinilai: <strong className="text-slate-800">{sudahDinilaiCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Belum Dinilai (Menunggu): <strong className="text-slate-800">{belumDinilaiCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              Belum Dikumpul: <strong className="text-slate-800">{belumDikumpulCount}</strong>
            </span>
          </div>
          <span className="text-[10px] italic text-slate-400">
            *Klik kartu di atas atau tab status di bawah untuk memfilter cepat
          </span>
        </div>
      </div>

      {/* Control Toolbar: Search, Status Filter Pills, Class & Task Dropdowns */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Row 1: Search & Action Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama siswa, NISN, atau judul tugas LMS..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-sm hover:shadow cursor-pointer shrink-0"
              title="Buat Tugas LMS Baru"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas LMS Baru</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200 cursor-pointer shrink-0"
              title="Unduh Rekap Status Pengumpulan (Excel)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Ekspor Excel</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs (Fitur Utama yang diminta pengguna) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1.5 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
            </span>

            {/* Semua Status */}
            <button
              type="button"
              onClick={() => setFilterStatus("semua")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                filterStatus === "semua"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              <span>Semua Status</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  filterStatus === "semua"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {scopedRows.length}
              </span>
            </button>

            {/* Sudah Dinilai */}
            <button
              type="button"
              onClick={() => setFilterStatus("sudah_dinilai")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                filterStatus === "sudah_dinilai"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                  : "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/60"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sudah Dinilai</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  filterStatus === "sudah_dinilai"
                    ? "bg-emerald-800 text-white"
                    : "bg-emerald-200 text-emerald-900"
                }`}
              >
                {sudahDinilaiCount}
              </span>
            </button>

            {/* Belum Dinilai */}
            <button
              type="button"
              onClick={() => setFilterStatus("belum_dinilai")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                filterStatus === "belum_dinilai"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-950/20"
                  : "bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/60"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-900" />
              <span>Belum Dinilai</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  filterStatus === "belum_dinilai"
                    ? "bg-amber-700 text-white"
                    : "bg-amber-200 text-amber-950"
                }`}
              >
                {belumDinilaiCount}
              </span>
            </button>

            {/* Belum Dikumpul */}
            <button
              type="button"
              onClick={() => setFilterStatus("belum_dikumpul")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                filterStatus === "belum_dikumpul"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-950/20"
                  : "bg-rose-50 hover:bg-rose-100/80 text-rose-800 border border-rose-200/60"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>Belum Dikumpul</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  filterStatus === "belum_dikumpul"
                    ? "bg-rose-800 text-white"
                    : "bg-rose-200 text-rose-900"
                }`}
              >
                {belumDikumpulCount}
              </span>
            </button>
          </div>

          {/* Row 3 Dropdowns: Class & Task Selector */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Filter Kelas */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Kelas:</span>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Semua">Semua Kelas</option>
                {availableClassIds.map((cId) => (
                  <option key={cId} value={cId}>
                    Kelas {cId}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tugas */}
            <div className="flex items-center gap-1.5 max-w-[220px] sm:max-w-[260px]">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Tugas:</span>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer truncate"
              >
                <option value="Semua">Semua Tugas LMS ({tasks.length})</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.kelasId}] {t.judul}
                  </option>
                ))}
              </select>
            </div>

            {(filterStatus !== "semua" || searchQuery || selectedKelas !== "Semua" || selectedTaskId !== "Semua") && (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("semua");
                  setSearchQuery("");
                  setSelectedKelas("Semua");
                  setSelectedTaskId("Semua");
                }}
                className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-bold"
                title="Reset Semua Filter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Summary */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Daftar Status Pengumpulan Siswa
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700">
              {filteredRows.length} data ditemukan
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Menampilkan status:{" "}
            <strong className="text-slate-800">
              {filterStatus === "semua"
                ? "Semua Status"
                : filterStatus === "sudah_dinilai"
                ? "Sudah Dinilai"
                : filterStatus === "belum_dinilai"
                ? "Belum Dinilai (Menunggu)"
                : "Belum Dikumpul"}
            </strong>
          </div>
        </div>

        {/* Content Table */}
        {filteredRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Siswa (Nama &amp; NISN)</th>
                  <th className="py-3 px-3 text-center">Kelas</th>
                  <th className="py-3 px-4">Tugas LMS</th>
                  <th className="py-3 px-4">Waktu Kumpul</th>
                  <th className="py-3 px-3 text-center">Tipe</th>
                  <th className="py-3 px-4 text-center">Status &amp; Nilai</th>
                  <th className="py-3 px-4 text-center">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRows.map((row, idx) => {
                  const isGraded = row.status === "sudah_dinilai";
                  const isSubmittedUngraded = row.status === "belum_dinilai";
                  const isNotSubmitted = row.status === "belum_dikumpul";

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSubmittedUngraded ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                        {idx + 1}
                      </td>

                      {/* Siswa */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              row.student.gender === "Perempuan"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {row.student.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block truncate max-w-[180px] sm:max-w-[220px]">
                              {row.student.nama}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              NISN: {row.student.nisn || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kelas */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black border border-slate-200">
                          {row.student.kelasId || row.task.kelasId || "-"}
                        </span>
                      </td>

                      {/* Tugas LMS */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[200px] sm:max-w-[250px]">
                          <span className="font-bold text-slate-800 block truncate">
                            {row.task.judul}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {row.task.bab || "Materi PAI"}
                          </span>
                        </div>
                      </td>

                      {/* Waktu Kumpul */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {row.submission ? (
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800 block">
                              {row.submission.tanggalKumpul.slice(0, 10)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Pukul {row.submission.tanggalKumpul.slice(11, 16) || "WIB"}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-400" />
                            <span>Tenggat: {row.task.deadline.slice(0, 10)}</span>
                          </div>
                        )}
                      </td>

                      {/* Tipe Pengumpulan */}
                      <td className="py-3.5 px-3 text-center">
                        {row.submission ? (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black inline-flex items-center gap-1 ${
                              row.submission.tipePengumpulan === "Audio"
                                ? "bg-purple-100 text-purple-800"
                                : row.submission.tipePengumpulan === "File"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {row.submission.tipePengumpulan === "Audio" && "🎤 Audio"}
                            {row.submission.tipePengumpulan === "File" && "📎 File"}
                            {row.submission.tipePengumpulan === "Teks" && "✍️ Teks"}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold">-</span>
                        )}
                      </td>

                      {/* Status & Nilai */}
                      <td className="py-3.5 px-4 text-center">
                        {isGraded ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200/80 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Nilai: {row.submission?.nilai}/100</span>
                            </span>
                            {row.submission?.komentarGuru && (
                              <span
                                className="text-[9px] text-slate-400 italic truncate max-w-[120px] mt-0.5"
                                title={row.submission.komentarGuru}
                              >
                                &ldquo;{row.submission.komentarGuru}&rdquo;
                              </span>
                            )}
                          </div>
                        ) : isSubmittedUngraded ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300/80 flex items-center justify-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Belum Dinilai</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center justify-center gap-1">
                            <X className="w-3 h-3 text-rose-500" />
                            <span>Belum Dikumpul</span>
                          </span>
                        )}
                      </td>

                      {/* Aksi Guru */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {row.submission ? (
                            <button
                              type="button"
                              onClick={() => handleOpenGrading(row)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                                isSubmittedUngraded
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                              title={isSubmittedUngraded ? "Beri Nilai Tugas Ini" : "Edit Nilai / Catatan"}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>{isSubmittedUngraded ? "Beri Nilai" : "Edit"}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenReminder(row)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 flex items-center gap-1 transition cursor-pointer"
                                title="Kirim Pengingat Tugas ke Siswa"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                                <span>Ingatkan</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenManualModal(row)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                                title="Tandai Kumpul Fisik/Manual di Kelas"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              Tidak ada data pengumpulan yang cocok
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tidak ditemukan data siswa dengan filter status{" "}
              <strong>&ldquo;{filterStatus}&rdquo;</strong> pada kelas{" "}
              <strong>&ldquo;{selectedKelas}&rdquo;</strong>
              {searchQuery && ` dengan kata kunci "${searchQuery}"`}.
            </p>
            <button
              onClick={() => {
                setFilterStatus("semua");
                setSearchQuery("");
                setSelectedKelas("Semua");
                setSelectedTaskId("Semua");
              }}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold transition hover:bg-emerald-600"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* ==================== MODAL PENILAIAN TUGAS (GRADING MODAL) ==================== */}
      {gradingModalOpen && activeGradingRow && activeGradingRow.submission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Pemeriksaan &amp; Penilaian Tugas LMS
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium">
                    {activeGradingRow.task.judul} • Kelas {activeGradingRow.student.kelasId || "PAI"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSaveGrade} className="p-6 space-y-5">
              {/* Student Identity Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Nama Siswa
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {activeGradingRow.student.nama}
                  </span>
                  <span className="text-xs font-mono text-slate-500 ml-2">
                    (NISN: {activeGradingRow.student.nisn})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Waktu Pengumpulan
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {activeGradingRow.submission.tanggalKumpul}
                  </span>
                </div>
              </div>

              {/* Submitted Content Area */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Konten Pengumpulan Siswa ({activeGradingRow.submission.tipePengumpulan}):</span>
                  {activeGradingRow.submission.fileName && (
                    <span className="text-[11px] font-medium text-emerald-700">
                      Berkas: {activeGradingRow.submission.fileName} ({activeGradingRow.submission.fileSize || "1 MB"})
                    </span>
                  )}
                </label>

                {/* If audio hafalan */}
                {activeGradingRow.submission.tipePengumpulan === "Audio" && (
                  <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
                          🎤
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Rekaman Suara Setoran Hafalan
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Durasi: {activeGradingRow.submission.audioDuration || "01:15"} • Kualitas Jernih
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlayingAudio(!isPlayingAudio);
                          if (!isPlayingAudio) {
                            setAudioProgress(25);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                          isPlayingAudio
                            ? "bg-amber-500 text-slate-950"
                            : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Jeda</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Putar Audio</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simulated Waveform Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: isPlayingAudio ? "65%" : `${audioProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{isPlayingAudio ? "00:48" : "00:00"}</span>
                        <span>{activeGradingRow.submission.audioDuration || "01:15"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {activeGradingRow.submission.kontenTeks || "(Tidak ada catatan teks)"}
                </div>
              </div>

              {/* Grading Input & Quick Presets */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Beri Nilai Angka (Skala 0 - 100):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={(e) =>
                      setScoreInput(e.target.value === "" ? "" : parseInt(e.target.value, 10))
                    }
                    placeholder="Contoh: 85"
                    className="w-32 px-4 py-2.5 text-center text-lg font-black bg-white rounded-xl border-2 border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-slate-900"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[75, 80, 85, 90, 95, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setScoreInput(preset)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                          scoreInput === preset
                            ? "bg-emerald-700 text-white border-emerald-700"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment & Feedback Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Komentar, Evaluasi, atau Apresiasi Guru:
                </label>
                <textarea
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tuliskan catatan apresiasi, perbaikan tajwid/materi, atau dorongan semangat..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                />

                {/* Quick Feedback Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Pilihan Cepat:</span>
                  {[
                    "Alhamdulillah, bacaan sangat tartil dan tajwid tepat!",
                    "Jawaban lengkap, runtut, dan argumen tepat.",
                    "Bagus, tingkatkan lagi pemahaman pada ketentuan najis.",
                    "Sangat memuaskan, pertahankan prestasimu!"
                  ].map((phrase, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCommentInput(phrase)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 font-medium transition"
                    >
                      &ldquo;{phrase.slice(0, 24)}...&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Simpan Nilai &amp; Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL PENGINGAT TUGAS (REMINDER MODAL) ==================== */}
      {reminderModalOpen && activeReminderRow && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-700 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-rose-200">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Kirim Pengingat Tugas LMS
                  </h3>
                  <p className="text-xs text-rose-200 font-medium">
                    Kepada: {activeReminderRow.student.nama} ({activeReminderRow.student.kelasId || "Kelas PAI"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">
                  Informasi Tugas Belum Dikumpul
                </span>
                <p className="text-xs font-extrabold text-slate-800">
                  {activeReminderRow.task.judul}
                </p>
                <p className="text-[11px] text-slate-600">
                  Batas Tenggat: <strong>{activeReminderRow.task.deadline}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Isi Pesan Pengingat:
                </label>
                <textarea
                  rows={4}
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 leading-relaxed"
                />
              </div>

              {reminderSentToast && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center animate-in fade-in">
                  ✅ Pesan pengingat berhasil dikirimkan ke kotak masuk LMS siswa!
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyReminder}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  {copiedReminder ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin (untuk WhatsApp)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendLmsMessage}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan LMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL MANUAL SUBMISSION ==================== */}
      {manualModalOpen && activeManualRow && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Catat Pengumpulan Manual / Luring
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium">
                    {activeManualRow.student.nama} • {activeManualRow.task.judul}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualSubmission} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Catatan Pengumpulan Fisik / Di Kelas:
                </label>
                <textarea
                  rows={2}
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Nilai Langsung (Opsional, 0 - 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={manualScore}
                  onChange={(e) =>
                    setManualScore(e.target.value === "" ? "" : parseInt(e.target.value, 10))
                  }
                  placeholder="Contoh: 85"
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-center"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Catatan / Komentar Guru:
                </label>
                <input
                  type="text"
                  value={manualComment}
                  onChange={(e) => setManualComment(e.target.value)}
                  placeholder="Catatan apresiasi atau tindak lanjut..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm"
                >
                  Simpan Pengumpulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL TAMBAH TUGAS LMS BARU ==================== */}
      {createTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Buat Tugas LMS Baru
                  </h3>
                  <p className="text-xs text-emerald-300 font-medium">
                    Akan tampil pada antarmuka akun siswa LMS Classroom
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateTaskModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreateTask} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Judul Tugas LMS:
                </label>
                <input
                  type="text"
                  required
                  value={taskJudul}
                  onChange={(e) => setTaskJudul(e.target.value)}
                  placeholder="Contoh: Setoran Hafalan Surah Al-Alaq"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Target Kelas:
                  </label>
                  <select
                    value={taskKelasId}
                    onChange={(e) => setTaskKelasId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {availableClassIds.map((cId) => (
                      <option key={cId} value={cId}>
                        Kelas {cId}
                      </option>
                    ))}
                    <option value="Semua">Semua Kelas</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Batas Tenggat (Deadline):
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={taskDeadlineDate}
                    onChange={(e) => setTaskDeadlineDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Bab / Topik Materi:
                </label>
                <input
                  type="text"
                  value={taskBab}
                  onChange={(e) => setTaskBab(e.target.value)}
                  placeholder="Contoh: Bab 1: Ketentuan Thaharah"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Petunjuk &amp; Instruksi Tugas:
                </label>
                <textarea
                  rows={3}
                  value={taskDeskripsi}
                  onChange={(e) => setTaskDeskripsi(e.target.value)}
                  placeholder="Tuliskan petunjuk pengerjaan tugas secara rinci untuk siswa..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  File Pendukung / Lembar Panduan (Opsional):
                </label>
                <input
                  type="text"
                  value={taskFilePendukung}
                  onChange={(e) => setTaskFilePendukung(e.target.value)}
                  placeholder="Contoh: Panduan_Hafalan.pdf"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm"
                >
                  Terbitkan Tugas LMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
