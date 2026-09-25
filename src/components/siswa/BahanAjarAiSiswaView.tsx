/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Bot,
  BookOpen,
  Film,
  Gamepad2,
  HelpCircle,
  Presentation,
  FileText,
  Heart,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  RotateCcw,
  Check,
  Send,
  Eye,
  Download,
  Share2,
  Trophy,
  Filter,
  Search,
  BookMarked,
  Layers,
  Flame,
  ThumbsUp,
  X,
  Puzzle
} from "lucide-react";
import { Siswa, RekapNilaiTotal } from "../../types";
import { BahanAjarAiItem, SiswaBahanAjarProgressItem } from "../../types/bahanAjarAi";
import { DataService } from "../../data/initialData";
import GameEngine from "../guru/bahanAjarAi/GameEngine";
import QuizPlayer from "../guru/bahanAjarAi/QuizPlayer";
import PptSlideViewer from "../guru/bahanAjarAi/PptSlideViewer";
import VideoStoryboardViewer from "../guru/bahanAjarAi/VideoStoryboardViewer";
import TtsPlayer from "../guru/bahanAjarAi/TtsPlayer";

interface BahanAjarAiSiswaViewProps {
  siswa: Siswa;
  rekapNilai: RekapNilaiTotal[];
  onUpdateRekapNilai: (updatedRec: RekapNilaiTotal) => void;
  onNavigateToLms?: () => void;
}

export default function BahanAjarAiSiswaView({
  siswa,
  rekapNilai,
  onUpdateRekapNilai,
  onNavigateToLms
}: BahanAjarAiSiswaViewProps) {
  // Load published Bahan Ajar AI list
  const [bahanAjarList, setBahanAjarList] = useState<BahanAjarAiItem[]>(() => {
    return DataService.getBahanAjarAiList();
  });

  // Student progress map
  const [progressMap, setProgressMap] = useState<Record<string, SiswaBahanAjarProgressItem>>(() => {
    return DataService.getSiswaBahanAjarProgress(siswa.nisn);
  });

  // Extract student grade (e.g. "VII" -> "7", or "7" -> "7")
  const studentKelasRaw = siswa.kelasId || "VII-A";
  const studentGradeNum = studentKelasRaw.startsWith("VIII")
    ? "8"
    : studentKelasRaw.startsWith("IX")
    ? "9"
    : "7";

  // Selected item to view/work on
  const [selectedItem, setSelectedItem] = useState<BahanAjarAiItem | null>(() => {
    const list = DataService.getBahanAjarAiList();
    // Default to first matching student grade or first item
    const match = list.find((item) => item.identitas.kelas === studentGradeNum);
    return match || list[0] || null;
  });

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<"Semua" | "7" | "8" | "9">(studentGradeNum as any);
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Selesai" | "Belum">("Semua");

  // Active activity tab inside selected item
  const [activeTab, setActiveTab] = useState<
    "materi" | "video" | "ppt" | "game" | "tts" | "kuis" | "refleksi"
  >("materi");

  // Student interactive inputs for Refleksi
  const [refleksiInputs, setRefleksiInputs] = useState<Record<number, string>>({});
  const [saveToast, setSaveToast] = useState<string>("");

  // Sync state when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      const prog = progressMap[selectedItem.id];
      if (prog && prog.refleksiJawaban) {
        setRefleksiInputs(prog.refleksiJawaban);
      } else {
        setRefleksiInputs({});
      }
    }
  }, [selectedItem?.id]);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast("");
    }, 3500);
  };

  // Filtered list
  const filteredList = bahanAjarList.filter((item) => {
    const matchSearch =
      item.materiPokokJudul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.identitas.babMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tujuanPembelajaran.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGrade = gradeFilter === "Semua" || item.identitas.kelas === gradeFilter;

    const prog = progressMap[item.id];
    const isCompleted = prog?.status === "Selesai Dikerjakan" || (prog?.quizScore !== undefined && prog.quizScore > 0);
    const matchStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Selesai" && isCompleted) ||
      (statusFilter === "Belum" && !isCompleted);

    return matchSearch && matchGrade && matchStatus;
  });

  // Handle Quiz completion
  const handleQuizComplete = (finalScore: number) => {
    if (!selectedItem) return;

    // 1. Save student progress for this Bahan Ajar AI
    const isPass = finalScore >= 75;
    const updatedProg: Partial<SiswaBahanAjarProgressItem> = {
      quizScore: finalScore,
      quizCompleted: true,
      status: "Selesai Dikerjakan"
    };

    DataService.saveSiswaBahanAjarProgress(siswa.nisn, selectedItem.id, updatedProg);
    const updatedMap = DataService.getSiswaBahanAjarProgress(siswa.nisn);
    setProgressMap(updatedMap);

    // 2. Synchronize score to rekapNilai for teacher grade book
    const existingRec = rekapNilai.find((r) => r.siswaNisn === siswa.nisn);
    if (existingRec) {
      // Update formatif kuis if newer score is higher or 0
      const currentKuis = existingRec.formatifKuis || 0;
      const newKuis = Math.max(currentKuis, finalScore);
      const updatedRec: RekapNilaiTotal = {
        ...existingRec,
        formatifKuis: newKuis
      };
      onUpdateRekapNilai(updatedRec);
    }

    showToast(
      `🎉 Kuis Selesai! Skor Anda: ${finalScore}/100 ${
        isPass ? "⭐ (Tuntas KKM)" : "💪 (Ayo coba lagi untuk hasil maksimal)"
      }`
    );
  };

  // Handle Game Score update
  const handleGameScore = (score: number) => {
    if (!selectedItem) return;

    const updatedProg: Partial<SiswaBahanAjarProgressItem> = {
      gameScore: score,
      gameCompleted: true
    };

    DataService.saveSiswaBahanAjarProgress(siswa.nisn, selectedItem.id, updatedProg);
    const updatedMap = DataService.getSiswaBahanAjarProgress(siswa.nisn);
    setProgressMap(updatedMap);

    showToast(`🎮 Rekor Game Disimpan: ${score} Poin!`);
  };

  // Handle TTS Score update
  const handleTtsScore = (ttsScore: number) => {
    if (!selectedItem) return;

    const updatedProg: Partial<SiswaBahanAjarProgressItem> = {
      ttsScore,
      ttsCompleted: ttsScore >= 70,
      status: ttsScore === 100 ? "Selesai Dikerjakan" : "Sedang Dikerjakan"
    };

    DataService.saveSiswaBahanAjarProgress(siswa.nisn, selectedItem.id, updatedProg);
    const updatedMap = DataService.getSiswaBahanAjarProgress(siswa.nisn);
    setProgressMap(updatedMap);

    showToast(`🧩 Nilai Teka-Teki Silang Disimpan: ${ttsScore}/100 Poin!`);
  };

  // Handle submit Refleksi 4P
  const handleSubmitRefleksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const countAnswered = Object.values(refleksiInputs).filter(
      (v) => typeof v === "string" && v.trim().length > 0
    ).length;
    if (countAnswered === 0) {
      alert("Harap isi setidaknya satu pertanyaan refleksi diri.");
      return;
    }

    const updatedProg: Partial<SiswaBahanAjarProgressItem> = {
      refleksiJawaban: refleksiInputs,
      refleksiCompleted: true
    };

    DataService.saveSiswaBahanAjarProgress(siswa.nisn, selectedItem.id, updatedProg);
    const updatedMap = DataService.getSiswaBahanAjarProgress(siswa.nisn);
    setProgressMap(updatedMap);

    showToast("💡 Refleksi Diri 4P Berhasil Disimpan! Karakter mulia terus diasah.");
  };

  // Quick stats
  const totalBahanAjar = bahanAjarList.length;
  const completedCount = (Object.values(progressMap) as SiswaBahanAjarProgressItem[]).filter(
    (p) => p.status === "Selesai Dikerjakan" || (p.quizScore !== undefined && p.quizScore >= 75)
  ).length;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-950 text-emerald-100 font-extrabold text-xs sm:text-sm shadow-2xl border border-emerald-500/60 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* HERO BANNER SISWA */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>SIPAILMS • Ruang Belajar Bahan Ajar AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bahan Ajar AI & Asesmen Interaktif
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pelajari materi PAI berdasar kurikulum terpadu yang disusun oleh bapak/ibu guru. Tonton visualisasi video, pelajari slide presentasi, mainkan game edukasi, serta selesaikan kuis interaktif berhadiah nilai langsung!
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-800/90 text-amber-300 border border-slate-700 font-extrabold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Selesai: {completedCount} dari {totalBahanAjar} Modul
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800/90 text-emerald-300 border border-slate-700 font-bold">
                Kelas: {siswa.kelasId}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onNavigateToLms && (
              <button
                type="button"
                onClick={onNavigateToLms}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Buka LMS Kelas</span>
              </button>
            )}
            {selectedItem && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("kuis");
                  const el = document.getElementById("pengerjaan-workspace");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Flame className="w-4 h-4 text-slate-950" />
                <span>Kerjakan Kuis Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & SELECTOR DAFTAR BAHAN AJAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white">Daftar Bahan Ajar AI Guru</h3>
              <p className="text-xs text-slate-400">Pilih materi yang ingin Anda pelajari dan kerjakan hari ini</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau bab..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filter Tingkat:
          </span>
          {(["Semua", "7", "8", "9"] as const).map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setGradeFilter(grade)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                gradeFilter === grade
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                  : "bg-slate-950 text-slate-300 hover:text-white border-slate-800"
              }`}
            >
              {grade === "Semua" ? "Semua Kelas" : `Kelas ${grade === "7" ? "VII" : grade === "8" ? "VIII" : "IX"}`}
            </button>
          ))}

          <span className="text-[11px] font-bold text-slate-400 ml-3 mr-1">Status:</span>
          {(["Semua", "Selesai", "Belum"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                statusFilter === st
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                  : "bg-slate-950 text-slate-300 hover:text-white border-slate-800"
              }`}
            >
              {st === "Semua" ? "Semua Status" : st === "Selesai" ? "Sudah Dikerjakan" : "Belum Dikerjakan"}
            </button>
          ))}
        </div>

        {/* Horizontal Card Carousel or Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {filteredList.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            const prog = progressMap[item.id];
            const hasQuizScore = prog?.quizScore !== undefined;
            const isCompleted = prog?.status === "Selesai Dikerjakan" || (hasQuizScore && (prog.quizScore || 0) >= 75);

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  const el = document.getElementById("pengerjaan-workspace");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-950/80 to-slate-900 border-amber-400 shadow-lg ring-2 ring-amber-400/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800/60">
                      Kelas {item.identitas.kelas === "7" ? "VII" : item.identitas.kelas === "8" ? "VIII" : "IX"} • {item.identitas.semester}
                    </span>
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Nilai: {prog?.quizScore ?? 100}
                      </span>
                    ) : hasQuizScore ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1">
                        Skor: {prog?.quizScore}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-white line-clamp-2 leading-snug">
                    {item.materiPokokJudul}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.tujuanPembelajaran}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    {item.kuisData?.soalList?.length || 10} Soal • Game • Media AI
                  </span>
                  <span className={`font-black flex items-center gap-1 ${isSelected ? "text-amber-400" : "text-emerald-400"}`}>
                    <span>{isSelected ? "Sedang Dibuka" : "Buka Modul"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs font-bold">
              Tidak ada bahan ajar AI yang sesuai dengan filter pencarian Anda.
            </div>
          )}
        </div>
      </div>

      {/* RUANG KERJA & PENGERJAAN BAHAN AJAR AI (WORKSPACE SISWA) */}
      {selectedItem ? (
        <div id="pengerjaan-workspace" className="space-y-6">
          {/* Header Modul Terpilih */}
          <div className="bg-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
                    Kelas {selectedItem.identitas.kelas === "7" ? "VII" : selectedItem.identitas.kelas === "8" ? "VIII" : "IX"} SMP
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-extrabold border border-emerald-800">
                    Semester {selectedItem.identitas.semester}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Durasi: {selectedItem.identitas.alokasiWaktu}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedItem.materiPokokJudul}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  <strong>Tujuan Pembelajaran:</strong> {selectedItem.tujuanPembelajaran}
                </p>
              </div>

              {/* Progress Card of Selected Item */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 shrink-0 min-w-[240px]">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                  Status Capaian Belajar Siswa
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kuis Evaluasi (CBT):</span>
                  <span className="font-extrabold text-white">
                    {progressMap[selectedItem.id]?.quizScore !== undefined
                      ? `${progressMap[selectedItem.id]?.quizScore}/100`
                      : "Belum Dikerjakan"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Game Edukasi:</span>
                  <span className="font-extrabold text-white">
                    {progressMap[selectedItem.id]?.gameScore !== undefined
                      ? `${progressMap[selectedItem.id]?.gameScore} Poin`
                      : "Belum Dimainkan"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Teka-Teki Silang:</span>
                  <span className="font-extrabold text-white">
                    {progressMap[selectedItem.id]?.ttsCompleted || progressMap[selectedItem.id]?.ttsScore !== undefined
                      ? `✅ ${progressMap[selectedItem.id]?.ttsScore || 100} Poin`
                      : "Belum Dikerjakan"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Refleksi Diri 4P:</span>
                  <span className="font-extrabold text-white">
                    {progressMap[selectedItem.id]?.refleksiCompleted ? "✅ Sudah Diisi" : "Belum Diisi"}
                  </span>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR AKTIVITAS SISWA */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("materi")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "materi"
                    ? "bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-400/40"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>1. Materi & Dalil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "video"
                    ? "bg-purple-950 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-400/40"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Film className="w-4 h-4 text-purple-400" />
                <span>2. Video Belajar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ppt")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "ppt"
                    ? "bg-amber-950 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-400/40"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>3. Slide Presentasi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("game")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "game"
                    ? "bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50"
                    : "bg-slate-950 border-slate-800 text-amber-400 hover:text-white"
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>4. Game Edukasi (Kerjakan)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tts")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "tts"
                    ? "bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50"
                    : "bg-slate-950 border-slate-800 text-amber-400 hover:text-white"
                }`}
              >
                <Puzzle className="w-4 h-4 text-amber-400" />
                <span>5. Teka-Teki Silang (Kerjakan)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("kuis")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "kuis"
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg ring-2 ring-emerald-400/50"
                    : "bg-slate-950 border-slate-800 text-emerald-400 hover:text-white"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>6. Kuis CBT (Kerjakan)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("refleksi")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-2 border transition cursor-pointer ${
                  activeTab === "refleksi"
                    ? "bg-blue-950 border-blue-500 text-blue-200 shadow-md ring-1 ring-blue-400/40"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Heart className="w-4 h-4 text-blue-400" />
                <span>7. Refleksi 4P</span>
              </button>
            </div>

            {/* KONTEN AKTIVITAS SESUAI TAB */}
            <div className="pt-2">
              {/* 1. MATERI & DALIL */}
              {activeTab === "materi" && (
                <div className="space-y-6">
                  {/* Dalil Naqli Al-Qur'an & Hadis */}
                  {selectedItem.dalilRujukan && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-800/60 shadow-lg space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                          <BookMarked className="w-4 h-4" />
                          Dalil Naqli Rujukan ({selectedItem.dalilRujukan.sumber})
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-extrabold text-[10px]">
                          Nash Al-Qur'an Al-Karim
                        </span>
                      </div>
                      <p className="text-right font-serif text-xl sm:text-2xl text-emerald-200 leading-loose py-2 font-bold select-all">
                        {selectedItem.dalilRujukan.arab}
                      </p>
                      <p className="text-xs sm:text-sm text-amber-200/90 italic font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        "{selectedItem.dalilRujukan.latin}"
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        <strong>Artinya:</strong> "{selectedItem.dalilRujukan.arti}"
                      </p>
                    </div>
                  )}

                  {/* Uraian Materi Pokok */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm">
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      Uraian Pokok Pembahasan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedItem.materiPokokDeskripsi}
                    </p>

                    {/* Submateri Berpoin */}
                    <div className="pt-3 border-t border-slate-800 space-y-2.5">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                        Poin-Poin Submateri Inti:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedItem.submateri.map((sub, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-medium flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contoh Kehidupan Sehari-hari */}
                    <div className="pt-3 border-t border-slate-800 space-y-2.5">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                        Penerapan & Contoh Akhlak dalam Keseharian:
                      </span>
                      <div className="space-y-2">
                        {selectedItem.contohKehidupan.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-100 flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="text-amber-400 font-black shrink-0">✓</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Menuju Pengerjaan Kuis */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-white">Sudah Paham Materinya?</h4>
                      <p className="text-xs text-slate-300">Uji kemampuan kognitifmu dengan mengerjakan kuis interaktif atau game edukasi!</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("game")}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Main Game</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("kuis")}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Mulai Kuis</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. VIDEO PEMBELAJARAN */}
              {activeTab === "video" && (
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Film className="w-5 h-5 text-purple-400" />
                      Storyboard Video Pembelajaran AI
                    </h3>
                    <p className="text-xs text-slate-400">
                      Naskah adegan demi adegan berdurasi terukur yang memandu visualisasi materi secara runtut dan mendalam.
                    </p>
                  </div>

                  <VideoStoryboardViewer
                    videoData={selectedItem.videoData}
                    judulMateri={selectedItem.materiPokokJudul}
                  />
                </div>
              )}

              {/* 4. SLIDE PRESENTASI PPT */}
              {activeTab === "ppt" && (
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Presentation className="w-5 h-5 text-amber-400" />
                      Slide Presentasi Interaktif PAI
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pelajari poin-poin penting materi slide demi slide dengan penjelasan komprehensif.
                    </p>
                  </div>

                  <PptSlideViewer
                    slides={selectedItem.pptData || []}
                    judulMateri={selectedItem.materiPokokJudul}
                  />
                </div>
              )}

              {/* 5. GAME EDUKASI (KERJAKAN) */}
              {activeTab === "game" && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-950 to-slate-900 border border-amber-700/60 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-amber-400" />
                        Arena Game Edukasi Interaktif
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                        Bisa Dikerjakan Siswa
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Pasangkan konsep dan selesaikan tantangan dengan drag & drop atau klik kartu. Raih skor setinggi-tingginya dan rekor Anda akan tersimpan otomatis!
                    </p>
                  </div>

                  <GameEngine
                    gameData={selectedItem.gameData}
                    judulMateri={selectedItem.materiPokokJudul}
                    onScoreUpdate={(score) => handleGameScore(score)}
                  />
                </div>
              )}

              {/* 5. TEKA-TEKI SILANG ISLAMI (KERJAKAN) */}
              {activeTab === "tts" && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-950 to-slate-900 border border-amber-700/60 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                        <Puzzle className="w-5 h-5 text-amber-400" />
                        Arena Teka-Teki Silang PAI Interaktif
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                        Bisa Dikerjakan Siswa
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Isi kotak-kotak teka-teki silang dengan mengetik huruf yang sesuai dengan materi pembelajaran. Tekan <strong>Periksa Jawaban</strong> untuk menyimpan skor Anda secara otomatis ke buku nilai guru!
                    </p>
                  </div>

                  {selectedItem.ttsData ? (
                    <TtsPlayer
                      ttsData={selectedItem.ttsData}
                      judulMateri={selectedItem.materiPokokJudul}
                      onTtsComplete={(score) => handleTtsScore(score)}
                      isStudentMode={true}
                      kelas={
                        selectedItem.targetKelas
                          ? (selectedItem.targetKelas.startsWith("Kelas") ? selectedItem.targetKelas : `Kelas ${selectedItem.targetKelas}`)
                          : `Kelas ${selectedItem.identitas.kelas === "7" ? "VII (Tujuh)" : selectedItem.identitas.kelas === "8" ? "VIII (Delapan)" : "IX (Sembilan)"}`
                      }
                      semester={selectedItem.identitas.semester}
                      mataPelajaran={selectedItem.identitas.mataPelajaran}
                    />
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-sm">
                      Teka-Teki Silang belum disiapkan oleh guru untuk materi ini.
                    </div>
                  )}
                </div>
              )}

              {/* 6. KUIS & ASESMEN CBT (KERJAKAN) */}
              {activeTab === "kuis" && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-900 border border-emerald-700/60 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-emerald-300 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-400" />
                        Simulator Asesmen CBT Interaktif (10 Soal Berjenjang)
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black uppercase">
                        Bisa Dikerjakan Siswa
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Jawab seluruh butir soal pilihan ganda bergradasi (Mudah, Sedang, Sulit). Ketika selesai, skor otomatis tercatat di data nilai Anda dan dapat dilihat oleh guru PAI! Standar KKM kelulusan: <strong>75</strong>.
                    </p>
                  </div>

                  <QuizPlayer
                    soalList={selectedItem.kuisData.soalList}
                    judulMateri={selectedItem.materiPokokJudul}
                    onQuizComplete={(score) => handleQuizComplete(score)}
                  />
                </div>
              )}

              {/* 7. REFLEKSI DIRI 4P (KERJAKAN) */}
              {activeTab === "refleksi" && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-blue-800/60 shadow-lg space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                          Internalisasi Karakter Berakhlak Mulia
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          Lembar Refleksi Diri Siswa Model 4P
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-700 font-extrabold text-xs">
                        {progressMap[selectedItem.id]?.refleksiCompleted ? "✅ Sudah Mengisi" : "💡 Belum Mengisi"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Refleksi model 4P (<strong>Peristiwa, Perasaan, Pembelajaran, Penerapan</strong>) mengajakmu merenungkan makna mendalam dari materi {selectedItem.materiPokokJudul} untuk membentuk akhlakul karimah dalam keseharian.
                    </p>

                    {/* Kutipan Hikmah */}
                    {selectedItem.refleksiData?.kutipanHikmah && (
                      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 italic leading-relaxed">
                        <span className="text-amber-400 font-bold not-italic block mb-1">Mutiara Hikmah:</span>
                        "{selectedItem.refleksiData.kutipanHikmah}"
                      </div>
                    )}

                    {/* Form Refleksi 4P */}
                    <form onSubmit={handleSubmitRefleksi} className="space-y-4 pt-2">
                      {[
                        {
                          idx: 1,
                          label: "1. Peristiwa (Facts)",
                          desc: "Hal paling menarik atau pengetahuan baru apa yang kamu dapatkan saat mempelajari bab ini?"
                        },
                        {
                          idx: 2,
                          label: "2. Perasaan (Feelings)",
                          desc: "Bagaimana perasaan hatimu setelah memahami keagungan ajaran dan dalil dalam materi ini?"
                        },
                        {
                          idx: 3,
                          label: "3. Pembelajaran (Findings)",
                          desc: "Pelajaran akhlak dan hikmah terbesar apa yang bisa kamu ambil untuk dirimu sendiri?"
                        },
                        {
                          idx: 4,
                          label: "4. Penerapan (Future)",
                          desc: "Aksi nyata dan kebiasaan baik apa yang akan kamu mulai amalkan hari ini di rumah atau sekolah?"
                        }
                      ].map((item) => (
                        <div key={item.idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                          <label className="block text-xs font-black text-amber-300">
                            {item.label}
                          </label>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                          <textarea
                            rows={2}
                            value={refleksiInputs[item.idx] || ""}
                            onChange={(e) =>
                              setRefleksiInputs({ ...refleksiInputs, [item.idx]: e.target.value })
                            }
                            placeholder="Tuliskan refleksi jujur dari hatimu..."
                            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      ))}

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <span className="text-[11px] text-slate-400">
                          Refleksi ini menjadi rekam jejak penguatan Profil Pelajar Pancasila beriman & bertakwa.
                        </span>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Heart className="w-4 h-4 text-slate-950" />
                          <span>Simpan Refleksi Saya</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-sm">
          Pilih salah satu Bahan Ajar AI di atas untuk mulai belajar dan mengerjakan tugas.
        </div>
      )}
    </div>
  );
}
