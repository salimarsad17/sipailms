/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet,
  Edit2,
  Check,
  Search,
  Filter,
  Volume2,
  CheckCircle,
  Clock,
  MessageSquare,
  Play,
  Pause,
  Award,
  BookOpen,
  Layers,
  Printer,
  Calendar,
  X,
  Trash2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { RekapNilaiTotal, Siswa, Kelas, PengumpulanTugas, NilaiKhususPai, NilaiSemesterParalel } from "../../types";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";
import * as XLSX from "xlsx";
import {
  getUnifiedRekapNilaiList,
  REKAP_PAI_HEADERS,
  formatRekapRow,
  formatRekapSummaryRow
} from "../../lib/googleSheetsService";
import PenilaianSemesterParalel from "./PenilaianSemesterParalel";
import GoogleSheetsSyncBar from "./GoogleSheetsSyncBar";

interface RekapNilaiProps {
  rekapNilai: RekapNilaiTotal[];
  onUpdateNilai: (updated: RekapNilaiTotal) => void;
  onDeleteNilai?: (siswaNisn: string) => void;
  students: Siswa[];
  classes: Kelas[];
  submissions: PengumpulanTugas[];
  onGradeSubmission: (subId: string, score: number, comment: string) => void;
  nilaiKhusus: NilaiKhususPai[];
  onUpdateNilaiKhusus: (updated: NilaiKhususPai) => void;
  activeSubmissionIdToGrade?: string; // Preselected submission from dashboard
  onClearActiveSubmissionId: () => void;
  nilaiParalelList?: NilaiSemesterParalel[];
  onUpdateNilaiParalelList?: (newList: NilaiSemesterParalel[]) => void;
  onOpenGoogleSheets?: () => void;
}

export default function RekapNilai({
  rekapNilai,
  onUpdateNilai,
  onDeleteNilai,
  students,
  classes,
  submissions,
  onGradeSubmission,
  nilaiKhusus,
  onUpdateNilaiKhusus,
  activeSubmissionIdToGrade,
  onClearActiveSubmissionId,
  nilaiParalelList = [],
  onUpdateNilaiParalelList = () => {},
  onOpenGoogleSheets
}: RekapNilaiProps) {
  // Navigation mode tab ("paralel" or "lms")
  const [viewMode, setViewMode] = useState<"paralel" | "lms">("paralel");

  const [selectedClass, setSelectedClass] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const availableClasses = useMemo(() => {
    const fromProps = classes?.map((c) => c.id) || [];
    const fromStudents = students?.map((s) => s.kelasId) || [];
    const fromRekap = rekapNilai?.map((r) => r.kelasId) || [];
    return Array.from(new Set([...fromProps, ...fromStudents, ...fromRekap].filter(Boolean))).sort();
  }, [classes, students, rekapNilai]);

  // Editing state for Rekap Nilai Table
  const [editingStudentNisn, setEditingStudentNisn] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<RekapNilaiTotal | null>(null);

  // LMS Grading state
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(activeSubmissionIdToGrade || "");
  const [lmsScore, setLmsScore] = useState<number>(85);
  const [lmsComment, setLmsComment] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState(30);

  // Print Mode State for LMS View
  const [isPrintLmsOpen, setIsPrintLmsOpen] = useState(false);
  const [printTanggalCetakLms, setPrintTanggalCetakLms] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const formatDateIndoFull = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateIndoDateOnly = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Merge students list with rekapNilai records to ensure ALL current students in Data Siswa are included with their latest name
  const classStudents = selectedClass === "Semua"
    ? students
    : students.filter((st) => st.kelasId === selectedClass);

  const mergedRecords: RekapNilaiTotal[] = classStudents.map((st) => {
    const existing = rekapNilai.find((r) => r.siswaNisn === st.nisn);
    if (existing) {
      return {
        ...existing,
        siswaNama: st.nama, // ALWAYS use the latest student name from Data Siswa
        kelasId: st.kelasId, // ALWAYS use the latest class assignment from Data Siswa
      };
    }
    return {
      siswaNisn: st.nisn,
      siswaNama: st.nama,
      kelasId: st.kelasId,
      formatifKuis: 80,
      formatifTugas: 80,
      formatifDiskusi: 80,
      sumatifPts: 80,
      sumatifPas: 80,
      hafalanJuzAmmaScore: 80,
      praktikSholat: 80,
      praktikWudhu: 80,
    };
  });

  const filteredRecords = mergedRecords
    .filter((rec) => {
      const q = searchQuery.toLowerCase();
      return (
        rec.siswaNama.toLowerCase().includes(q) ||
        rec.siswaNisn.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));

  // Filter submissions for the active class that are still UNGRADED
  const pendingSubmissions = submissions.filter(
    (sub) => sub.nilai === undefined || sub.nilai === null
  );

  const selectedSubObj = submissions.find((s) => s.id === selectedSubmissionId);

  // Auto-fill existing score and comment when selecting a submission
  useEffect(() => {
    if (selectedSubObj) {
      if (selectedSubObj.nilai !== undefined && selectedSubObj.nilai !== null) {
        setLmsScore(selectedSubObj.nilai);
      } else {
        setLmsScore(85);
      }
      setLmsComment(selectedSubObj.komentarGuru || "");
    }
  }, [selectedSubmissionId, selectedSubObj?.id, selectedSubObj?.nilai]);

  const handleEditClick = (rec: RekapNilaiTotal) => {
    setEditingStudentNisn(rec.siswaNisn);
    setEditedRecord({ ...rec });
  };

  const handleSaveClick = () => {
    if (editedRecord) {
      onUpdateNilai(editedRecord);
      setEditingStudentNisn(null);
      setEditedRecord(null);
    }
  };

  const handleDeleteNilaiClick = (rec: RekapNilaiTotal) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus / mengosongkan nilai untuk ${rec.siswaNama}?\n\nNilai formatif, sumatif, hafalan, dan praktik siswa ini akan direset ke 0 dan perubahan otomatis tersimpan ke Google Sheets & database lokal.`
      )
    ) {
      if (onDeleteNilai) {
        onDeleteNilai(rec.siswaNisn);
      } else {
        const cleared: RekapNilaiTotal = {
          ...rec,
          formatifKuis: 0,
          formatifTugas: 0,
          formatifDiskusi: 0,
          sumatifPts: 0,
          sumatifPas: 0,
          hafalanJuzAmmaScore: 0,
          praktikSholat: 0,
          praktikWudhu: 0
        };
        onUpdateNilai(cleared);
      }
    }
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionId) return;
    onGradeSubmission(selectedSubmissionId, Number(lmsScore), lmsComment);

    // Also update this student's rekap record in our mock service
    const targetSub = submissions.find(s => s.id === selectedSubmissionId);
    if (targetSub) {
      const existingRekap = rekapNilai.find(r => r.siswaNisn === targetSub.siswaNisn);
      if (existingRekap) {
        // If they graded 'Latihan Soal Thaharah' or 'Ringkasan Video', it updates formatifTugas
        const updated = { ...existingRekap };
        if (
          targetSub.tugasId === "tugas-2" ||
          targetSub.tugasId.startsWith("ringkasan-video-") ||
          targetSub.tugasJudul.toLowerCase().includes("ringkasan")
        ) {
          updated.formatifTugas = Number(lmsScore);
        } else if (targetSub.tugasId === "tugas-1") {
          updated.hafalanJuzAmmaScore = Number(lmsScore);
        } else {
          updated.formatifTugas = Number(lmsScore);
        }
        onUpdateNilai(updated);
      }
    }

    alert("Tugas berhasil dinilai dan tersinkronisasi langsung ke Rekap Nilai!");
    setSelectedSubmissionId("");
    setLmsScore(85);
    setLmsComment("");
    onClearActiveSubmissionId();
  };

  const handleAudioPlayToggle = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      const interval = setInterval(() => {
        setAudioPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlayingAudio(false);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    }
  };

  // Automated Excel format exporter
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const dateStr = new Date().toISOString().slice(0, 10);
    const todayFormatted = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const cleanSheetTab = (tabName: string) =>
      tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

    const headers = REKAP_PAI_HEADERS;

    const unifiedList = getUnifiedRekapNilaiList(rekapNilai, students);
    const inputtedClasses = Array.from(new Set(unifiedList.map((r) => r.kelasId).filter(Boolean))).sort();

    if (selectedClass === "Semua") {
      // Tab 1: Master Sheet (Grouped by each inputted class)
      const masterRows: (string | number)[][] = [
        ["BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI (SEMUA KELAS) - UPT SMPN 2 REBANG TANGKAS"],
        [`Tahun Ajaran 2025/2026 • KKTP Acuan: 75 • Total: ${unifiedList.length} Siswa (${inputtedClasses.length} Rombel Terdata) • Tanggal Ekspor: ${todayFormatted}`],
        []
      ];

      inputtedClasses.forEach((cId) => {
        const classRekap = unifiedList
          .filter((r) => r.kelasId === cId)
          .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
        if (classRekap.length === 0) return;

        const wali = classes.find((c) => c.id === cId)?.waliKelasNama || "-";
        masterRows.push([`=== KELOMPOK ROMBEL KELAS ${cId} (Wali Kelas: ${wali} • Total: ${classRekap.length} Siswa) ===`]);
        masterRows.push(headers);

        classRekap.forEach((r, idx) => masterRows.push(formatRekapRow(r, idx)));
        masterRows.push(formatRekapSummaryRow(classRekap, cId));
        masterRows.push([]);
      });

      if (unifiedList.length > 0) {
        masterRows.push(formatRekapSummaryRow(unifiedList, "Semua Kelas"));
      }

      masterRows.push([]);
      masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
      masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala UPT SMPN 2 Rebang Tangkas,", "", ""]);
      masterRows.push([]);
      masterRows.push([]);
      masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
      masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(masterRows), "Master Semua Kelas");

      // Tab 2..N: Individual sheet for each inputted class
      inputtedClasses.forEach((cId) => {
        const classRekap = unifiedList
          .filter((r) => r.kelasId === cId)
          .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
        if (classRekap.length === 0) return;

        const wali = classes.find((c) => c.id === cId)?.waliKelasNama || "-";
        const classRows: (string | number)[][] = [
          [`BUKU REKAPITULASI NILAI PAI & BUDI PEKERTI - KELAS ${cId}`],
          ["UPT SMP NEGERI 2 REBANG TANGKAS"],
          [`Wali Kelas: ${wali} • Rombel: ${cId} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Tanggal: ${todayFormatted}`],
          [],
          headers
        ];

        classRekap.forEach((r, idx) => classRows.push(formatRekapRow(r, idx)));
        classRows.push([]);
        classRows.push(formatRekapSummaryRow(classRekap, cId));
        classRows.push([]);
        classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
        classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala UPT SMPN 2 Rebang Tangkas,", "", ""]);
        classRows.push([]);
        classRows.push([]);
        classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
        classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);

        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(classRows), cleanSheetTab(`Kelas ${cId}`));
      });
    } else {
      const classRekap = unifiedList
        .filter((r) => r.kelasId === selectedClass)
        .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
      const wali = classes.find((c) => c.id === selectedClass)?.waliKelasNama || "-";

      const rows: (string | number)[][] = [
        [`BUKU REKAPITULASI NILAI PAI & BUDI PEKERTI - KELAS ${selectedClass}`],
        ["UPT SMP NEGERI 2 REBANG TANGKAS"],
        [`Wali Kelas: ${wali} • Rombel: ${selectedClass} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Tanggal: ${todayFormatted}`],
        [],
        headers
      ];

      classRekap.forEach((r, idx) => rows.push(formatRekapRow(r, idx)));
      if (classRekap.length > 0) {
        rows.push([]);
        rows.push(formatRekapSummaryRow(classRekap, selectedClass));
        rows.push([]);
        rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
        rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala UPT SMPN 2 Rebang Tangkas,", "", ""]);
        rows.push([]);
        rows.push([]);
        rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
        rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
      }

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), cleanSheetTab(`Kelas ${selectedClass}`));
    }

    XLSX.writeFile(wb, `REKAP_NILAI_PAI_${selectedClass}_${dateStr}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Google Sheets Live Sync Bar */}
      <GoogleSheetsSyncBar
        rekapNilai={rekapNilai}
        nilaiParalelList={nilaiParalelList}
        students={students}
        classes={classes}
      />

      {/* Sub-menu Tab Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("paralel")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              viewMode === "paralel"
                ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>📊 Penilaian Semester & Paralel (7A-D, 8A-D, 9A-D)</span>
          </button>

          <button
            onClick={() => setViewMode("lms")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              viewMode === "lms"
                ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>📝 Review Penilaian LMS & Papan Master Rekap</span>
          </button>
        </div>

        <span className="text-[10px] font-bold text-slate-400 hidden lg:inline-block px-3">
          UPT SMPN 2 Rebang Tangkas
        </span>
      </div>

      {viewMode === "paralel" ? (
        <PenilaianSemesterParalel
          students={students}
          classes={classes}
          nilaiParalelList={nilaiParalelList}
          onUpdateNilaiParalelList={onUpdateNilaiParalelList}
          rekapNilai={rekapNilai}
        />
      ) : (
        <>
          {/* SECTION 1: LMS GRADING TERMINAL PORTAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
              Terminal Penilaian LMS Siswa
            </h4>
            <p className="text-xs text-slate-400">
              Ulas lembar pengerjaan kuis, setoran file, dan rekaman audio hafalan Juz Amma siswa di sini secara real-time.
            </p>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">
                Pilih Tugas Terkumpul:
              </label>
              <select
                value={selectedSubmissionId}
                onChange={(e) => setSelectedSubmissionId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none"
                id="select-pending-task"
              >
                <option value="">-- {pendingSubmissions.length} Tugas Menunggu Penilaian --</option>
                {submissions.map((sub) => {
                  const currentNama = students.find((s) => s.nisn === sub.siswaNisn)?.nama || sub.siswaNama;
                  return (
                    <option key={sub.id} value={sub.id}>
                      {currentNama} - {sub.tugasJudul} ({sub.nilai !== undefined ? `Sudah Dinilai: ${sub.nilai}` : "Belum Dinilai"})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-50 text-[11px] text-slate-500">
            Nilai yang Anda masukkan akan langsung tersinkronisasi ke rekap akademik dan buku rapor masing-masing siswa.
          </div>
        </div>

        {/* ACTIVE SUBMISSION REVIEWER */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {selectedSubObj ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Review Tugas: {selectedSubObj.tugasJudul}
                  </h4>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">
                    Siswa: {students.find((s) => s.nisn === selectedSubObj.siswaNisn)?.nama || selectedSubObj.siswaNama} ({selectedSubObj.kelasId}) • NISN: {selectedSubObj.siswaNisn}
                  </span>
                </div>
                <span className="self-start sm:self-center text-[10px] font-mono text-slate-400">
                  Dikumpulkan: {selectedSubObj.tanggalKumpul}
                </span>
              </div>

              {/* Submitted Content Display */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Konten Hasil Pengumpulan Siswa
                  </span>
                  {(selectedSubObj.tugasId.includes("ringkasan") || selectedSubObj.tugasJudul.toLowerCase().includes("ringkasan")) && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      🎥 Tugas Ringkasan Video Bab
                    </span>
                  )}
                </div>

                {/* Simulated Audio Setoran Hafalan */}
                {selectedSubObj.tipePengumpulan === "Audio" ? (
                  <div className="p-4 rounded-xl bg-emerald-700 text-white space-y-3 shadow-md shadow-emerald-700/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-amber-300" />
                        <span className="text-xs font-bold font-sans">Setoran_Suara_Hafalan_AdDuha.mp3</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">{selectedSubObj.audioDuration || "01:15"}</span>
                    </div>

                    {/* Audio wave simulation */}
                    <div className="h-10 flex items-center justify-between gap-1 px-2">
                      {[30, 60, 45, 90, 70, 40, 20, 65, 80, 50, 95, 30, 40, 75, 85, 20, 60, 45, 30, 50, 85, 60].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i * 5 < audioPlaybackProgress ? "bg-amber-400" : "bg-emerald-600"
                          }`}
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleAudioPlayToggle}
                        type="button"
                        className="w-10 h-10 rounded-full bg-white text-emerald-800 flex items-center justify-center hover:scale-105 active:scale-95 transition"
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-4 h-4 fill-emerald-800" />
                        ) : (
                          <Play className="w-4 h-4 fill-emerald-800 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 text-[10px] leading-relaxed text-emerald-100">
                        {isPlayingAudio ? "Sedang memutar lantunan hafalan siswa..." : "Tekan putar untuk menguji pelafalan Makhraj & Tajwid siswa."}
                      </div>
                    </div>
                  </div>
                ) : selectedSubObj.tipePengumpulan === "File" ? (
                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[240px]">
                      📂 {selectedSubObj.fileName || "Lembar_Kerja_PAI.jpg"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({selectedSubObj.fileSize || "1.2 MB"})
                    </span>
                  </div>
                ) : null}

                <div className="text-xs text-slate-700 font-semibold leading-relaxed bg-white/70 p-3 rounded border border-slate-150 whitespace-pre-line">
                  {selectedSubObj.kontenTeks}
                </div>
              </div>

              {/* Evaluation Form */}
              <form onSubmit={handleGradeSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Beri Nilai (Skala 0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={lmsScore}
                    onChange={(e) => setLmsScore(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Catatan Evaluasi / Komentar Guru
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sangat lancar, tajwidnya luar biasa bagus..."
                    value={lmsComment}
                    onChange={(e) => setLmsComment(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubmissionId("");
                      onClearActiveSubmissionId();
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    Batal Ulas
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-md"
                    id="btn-save-grading"
                  >
                    Kirim & Input Nilai
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Volume2 className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-xs text-slate-500 font-bold">Ulasan Lembar Jawaban & Audio</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Pilih salah satu tugas siswa di menu kiri untuk memulai penilaian interaktif.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: REKAP NILAI MASTER BOARD */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">Papan Rekapitulasi Nilai PAI</h4>
            <p className="text-xs text-slate-400">Rangkuman nilai formatif, sumatif, hafalan, dan praktik kelas.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none w-36"
              />
            </div>

            {/* Class filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Semua">Semua Kelas (Multi-Tab)</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>Kelas {cls}</option>
              ))}
            </select>

            {/* Export Google Sheets */}
            {onOpenGoogleSheets && (
              <button
                type="button"
                onClick={onOpenGoogleSheets}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                title="Buka Sinkronisasi & Ekspor Google Sheets"
                id="btn-google-sheets-rekap"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <span>Google Sheets</span>
              </button>
            )}

            {/* Export Excel */}
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100/50 flex items-center gap-1 transition cursor-pointer"
              id="btn-export-excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Ekspor ERapor
            </button>

            {/* Print Rekap */}
            <button
              onClick={() => setIsPrintLmsOpen(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              id="btn-print-rekap-lms"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Cetak Rekap
            </button>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase">
                <th className="p-3 w-28">NISN</th>
                <th className="p-3 w-36">Nama Siswa</th>
                <th className="p-3 text-center bg-blue-50/20 text-blue-700">Kuis (Form)</th>
                <th className="p-3 text-center bg-blue-50/20 text-blue-700">Tugas (Form)</th>
                <th className="p-3 text-center bg-blue-50/20 text-blue-700">Diskusi (Form)</th>
                <th className="p-3 text-center bg-amber-50/10 text-amber-800">PTS (Sum)</th>
                <th className="p-3 text-center bg-amber-50/10 text-amber-800">PAS (Sum)</th>
                <th className="p-3 text-center bg-emerald-50/10 text-emerald-800">Hafalan Juz Amma</th>
                <th className="p-3 text-center bg-emerald-50/10 text-emerald-800">Praktik Sholat</th>
                <th className="p-3 text-center bg-emerald-50/10 text-emerald-800">Praktik Wudhu</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredRecords.map((rec) => {
                const isEditing = editingStudentNisn === rec.siswaNisn;
                const recKhusus = nilaiKhusus.find(nk => nk.siswaNisn === rec.siswaNisn);

                return (
                  <tr key={rec.siswaNisn} className="hover:bg-slate-50/30 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{rec.siswaNisn}</td>
                    <td className="p-3 text-sm font-semibold text-slate-900">{rec.siswaNama}</td>

                    {/* Formative Kuis */}
                    <td className="p-3 text-center bg-blue-50/10">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.formatifKuis || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, formatifKuis: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.formatifKuis
                      )}
                    </td>

                    {/* Formative Tugas */}
                    <td className="p-3 text-center bg-blue-50/10">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.formatifTugas || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, formatifTugas: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.formatifTugas
                      )}
                    </td>

                    {/* Formative Diskusi */}
                    <td className="p-3 text-center bg-blue-50/10">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.formatifDiskusi || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, formatifDiskusi: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.formatifDiskusi
                      )}
                    </td>

                    {/* Sumative PTS */}
                    <td className="p-3 text-center bg-amber-50/5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.sumatifPts || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, sumatifPts: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.sumatifPts
                      )}
                    </td>

                    {/* Sumative PAS */}
                    <td className="p-3 text-center bg-amber-50/5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.sumatifPas || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, sumatifPas: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.sumatifPas
                      )}
                    </td>

                    {/* Juz Amma recitation */}
                    <td className="p-3 text-center bg-emerald-50/5 font-bold text-emerald-800">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.hafalanJuzAmmaScore || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, hafalanJuzAmmaScore: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span>{rec.hafalanJuzAmmaScore}</span>
                          {recKhusus && (
                            <span className="text-[8px] text-slate-400 font-medium font-sans">
                              {recKhusus.surahJuzAmma} ({recKhusus.kelancaran === "Lancar" ? "Lcr" : "Sdg"})
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Practice Sholat */}
                    <td className="p-3 text-center bg-emerald-50/5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.praktikSholat || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, praktikSholat: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.praktikSholat
                      )}
                    </td>

                    {/* Practice Wudhu */}
                    <td className="p-3 text-center bg-emerald-50/5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedRecord?.praktikWudhu || 0}
                          onChange={(e) => setEditedRecord({ ...editedRecord!, praktikWudhu: Number(e.target.value) })}
                          className="w-12 p-1 border border-slate-300 rounded text-center text-xs"
                        />
                      ) : (
                        rec.praktikWudhu
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={handleSaveClick}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Simpan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditClick(rec)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                            title="Ubah Nilai"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNilaiClick(rec)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus / Kosongkan Nilai Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Print Modal for LMS View Mode */}
      {isPrintLmsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
          {/* CSS Print Styles Override */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-rekap-lms, #printable-rekap-lms * {
                visibility: visible !important;
              }
              #printable-rekap-lms {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 14px 18px !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              table {
                page-break-inside: auto;
                width: 100% !important;
              }
              tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
              }
              thead {
                display: table-header-group !important;
              }
            }
          `}</style>

          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none my-8">
            {/* Modal Toolbar Header (Hidden in Print) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Pratinjau Cetak Rekapitulasi Nilai PAI
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Kelas: {selectedClass} • Tahun Pelajaran 2026/2027
                  </p>
                </div>
              </div>

              {/* Tanggal Cetak Setting & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-600">Tanggal Cetak:</span>
                  <input
                    type="date"
                    value={printTanggalCetakLms}
                    onChange={(e) => setPrintTanggalCetakLms(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const y = now.getFullYear();
                      const m = String(now.getMonth() + 1).padStart(2, "0");
                      const d = String(now.getDate()).padStart(2, "0");
                      setPrintTanggalCetakLms(`${y}-${m}-${d}`);
                    }}
                    className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition cursor-pointer"
                  >
                    Hari Ini
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintLmsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  title="Tutup Pratinjau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div id="printable-rekap-lms" className="space-y-4 text-black font-sans">
              {/* Header Kop Sekolah */}
              <div className="border-b-4 border-double border-black pb-3">
                <div className="flex items-center justify-between gap-4">
                  <img
                    src={LOGO_WAY_KANAN}
                    alt="Logo Kabupaten Way Kanan"
                    className="w-16 h-auto max-h-20 object-contain shrink-0"
                  />
                  <div className="text-center space-y-1 flex-1">
                    <h1 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      PEMERINTAH KABUPATEN WAY KANAN – DINAS PENDIDIKAN
                    </h1>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-black">
                      UPT SMP NEGERI 2 REBANG TANGKAS
                    </h2>
                    <p className="text-[11px] italic font-serif text-slate-600">
                      Jl. Lintas Rebang Tangkas, Rebang Tangkas, Kabupaten Way Kanan, Lampung 34791
                    </p>
                  </div>
                  <div className="w-16 shrink-0 hidden sm:block" aria-hidden="true" />
                </div>
              </div>

              {/* Document Title & Metadata */}
              <div className="space-y-2">
                <div className="text-center">
                  <h3 className="text-sm font-bold uppercase underline tracking-wide">
                    LAPORAN REKAPITULASI EVALUASI BELAJAR PAI & BUDI PEKERTI
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    Kelas: {selectedClass} • Tahun Pelajaran 2026/2027
                  </p>
                </div>

                {/* Metadata Box with Tanggal Cetak */}
                <div className="bg-slate-50 border border-black p-2.5 rounded text-[10px] grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <p>Mata Pelajaran: <strong>Pendidikan Agama Islam & Budi Pekerti</strong></p>
                    <p>Kelas: <strong>{selectedClass}</strong></p>
                    <p>Semester: <strong>1 (Ganjil)</strong></p>
                    <p>Standar KKM: <strong>75 (Tuntas)</strong></p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p>Tanggal Cetak: <strong className="text-black bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 font-bold">{formatDateIndoFull(printTanggalCetakLms)}</strong></p>
                    <p>Total Peserta Didik: <strong>{filteredRecords.length} Siswa</strong></p>
                    <p>Guru Pengampu: <strong>Sadiqul Alim, S.Pd.I., M.Pd.</strong></p>
                    <p>NIP: <strong>19790917 201407 1 004</strong></p>
                  </div>
                </div>
              </div>

              {/* Master Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-[9.5px]">
                  <thead>
                    <tr className="bg-gray-200 text-center font-bold">
                      <th className="border border-black p-1 w-7">No</th>
                      <th className="border border-black p-1 w-20">NISN</th>
                      <th className="border border-black p-1 min-w-[140px]">Nama Siswa</th>
                      <th className="border border-black p-1 w-12">Kuis</th>
                      <th className="border border-black p-1 w-12">Tugas</th>
                      <th className="border border-black p-1 w-12">Diskusi</th>
                      <th className="border border-black p-1 w-12">PTS</th>
                      <th className="border border-black p-1 w-12">PAS</th>
                      <th className="border border-black p-1 w-14">Hafalan</th>
                      <th className="border border-black p-1 w-14">Sholat</th>
                      <th className="border border-black p-1 w-14">Wudhu</th>
                      <th className="border border-black p-1 w-14">Nilai Akhir</th>
                      <th className="border border-black p-1 w-16">Predikat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((rec, idx) => {
                      const avg = Math.round(
                        (rec.formatifKuis +
                          rec.formatifTugas +
                          rec.formatifDiskusi +
                          rec.sumatifPts +
                          rec.sumatifPas) / 5
                      );
                      const predikat = avg >= 88 ? "Sangat Baik" : avg >= 75 ? "Baik" : "Perlu Bimbingan";

                      return (
                        <tr key={rec.siswaNisn} className="text-center">
                          <td className="border border-black p-1">{idx + 1}</td>
                          <td className="border border-black p-1 font-mono">{rec.siswaNisn}</td>
                          <td className="border border-black p-1 text-left font-bold">{rec.siswaNama}</td>
                          <td className="border border-black p-1">{rec.formatifKuis}</td>
                          <td className="border border-black p-1">{rec.formatifTugas}</td>
                          <td className="border border-black p-1">{rec.formatifDiskusi}</td>
                          <td className="border border-black p-1">{rec.sumatifPts}</td>
                          <td className="border border-black p-1">{rec.sumatifPas}</td>
                          <td className="border border-black p-1">{rec.hafalanJuzAmmaScore}</td>
                          <td className="border border-black p-1">{rec.praktikSholat}</td>
                          <td className="border border-black p-1">{rec.praktikWudhu}</td>
                          <td className={`border border-black p-1 font-black ${avg >= 75 ? "text-black" : "text-red-600"}`}>
                            {avg}
                          </td>
                          <td className={`border border-black p-1 text-[8.5px] font-bold ${avg >= 75 ? "text-emerald-800" : "text-red-600"}`}>
                            {predikat}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signature Block */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 font-sans break-inside-avoid">
                <div className="text-center space-y-12">
                  <p>Mengetahui,<br />Kepala UPT SMPN 2 Rebang Tangkas</p>
                  <p className="font-bold underline">
                    Drs. H. Mulyadi, M.M.<br />
                    <span className="font-normal text-[10px]">NIP. 19700318 199503 1 002</span>
                  </p>
                </div>
                <div className="text-center space-y-12">
                  <p>
                    Rebang Tangkas, {formatDateIndoDateOnly(printTanggalCetakLms)}<br />
                    Guru Mata Pelajaran PAI & Budi Pekerti
                  </p>
                  <p className="font-bold underline">
                    Sadiqul Alim, S.Pd.I., M.Pd.<br />
                    <span className="font-normal text-[10px]">NIP. 19790917 201407 1 004</span>
                  </p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-300 text-[8px] text-slate-500 flex justify-between items-center">
                <span>Dokumen Resmi Rekap Nilai Akademik PAI • UPT SMPN 2 Rebang Tangkas</span>
                <span>Dicetak pada: {formatDateIndoFull(printTanggalCetakLms)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
