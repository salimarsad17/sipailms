/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Video,
  Gamepad2,
  Puzzle,
  FileText,
  CheckCircle2,
  Copy,
  Printer,
  Edit3,
  RotateCw,
  Save,
  Download,
  Share2,
  ArrowLeft,
  Clock,
  Play,
  Award,
  HelpCircle,
  Eye,
  EyeOff,
  Check,
  X,
  Volume2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Layers
} from "lucide-react";
import {
  BahanAjarAiCompleteBundle,
  QuizChallengeSoal,
  SoalCbt
} from "../../../types/bahanAjarAiModern";
import { BahanAjarAiGeneratorEngine } from "../../../services/bahanAjarAiGeneratorEngine";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";
import GameHubVisual from "./games/GameHubVisual";

interface BahanAjarAiResultViewProps {
  bundle: BahanAjarAiCompleteBundle;
  onUpdateBundle: (updated: BahanAjarAiCompleteBundle) => void;
  onBack: () => void;
  isStudentMode?: boolean;
}

export default function BahanAjarAiResultView({
  bundle,
  onUpdateBundle,
  onBack,
  isStudentMode = false
}: BahanAjarAiResultViewProps) {
  // Tabs: MATERI, VIDEO, GAME (Visual AI Suite 6+ Games), TTS, LKPD, CBT
  const [activeTab, setActiveTab] = useState<
    "MATERI" | "VIDEO" | "GAME" | "TTS" | "LKPD" | "CBT"
  >("MATERI");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRegeneratingSingle, setIsRegeneratingSingle] = useState(false);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editField, setEditField] = useState<string>("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy helper
  const handleCopyText = (text: string, label: string = "Teks") => {
    navigator.clipboard.writeText(text);
    triggerToast(`Berhasil menyalin ${label} ke clipboard!`);
  };

  // Save bundle
  const handleSave = () => {
    BahanAjarAiStorage.saveBundle(bundle);
    triggerToast("Paket Bahan Ajar AI berhasil disimpan ke Bank Bahan Ajar!");
  };

  // Regenerate Single Product Handler
  const handleRegenerateProduct = async (
    productKey: "MATERI" | "VIDEO" | "GAME_QUIZ" | "GAME_MATCH" | "TTS" | "LKPD" | "CBT"
  ) => {
    setIsRegeneratingSingle(true);
    triggerToast(`Sedang membuat ulang (${productKey})...`);
    try {
      const updated = await BahanAjarAiGeneratorEngine.regenerateSingleProduct(bundle, productKey);
      onUpdateBundle(updated);
      BahanAjarAiStorage.saveBundle(updated);
      triggerToast(`Produk ${productKey} berhasil diperbarui!`);
    } catch (e) {
      console.error(e);
      triggerToast("Gagal meregenerasi produk.");
    } finally {
      setIsRegeneratingSingle(false);
    }
  };

  // Regenerate All
  const handleRegenerateAll = async () => {
    if (!confirm("Apakah Anda yakin ingin membuat ulang SELURUH 6 produk bahan ajar ini?")) return;
    setIsRegeneratingSingle(true);
    triggerToast("Sedang membuat ulang seluruh paket bahan ajar...");
    try {
      const updated = await BahanAjarAiGeneratorEngine.generateCompleteBundle({
        kelas: bundle.kelas,
        materi: bundle.materi,
        subMateri: bundle.subMateri,
        tingkatKesulitan: bundle.tingkatKesulitan,
        jumlahSoal: bundle.jumlahSoal,
        durasiVideo: bundle.durasiVideo,
        gayaPembelajaran: bundle.gayaPembelajaran,
        guruNama: bundle.guruNama
      });
      onUpdateBundle(updated);
      BahanAjarAiStorage.saveBundle(updated);
      triggerToast("Seluruh bahan ajar berhasil digenerate ulang!");
    } catch (e) {
      console.error(e);
      triggerToast("Gagal membuat ulang paket.");
    } finally {
      setIsRegeneratingSingle(false);
    }
  };

  // Print helper
  const handlePrintCurrentTab = () => {
    BahanAjarAiStorage.printElement("printable-content-area", `${bundle.subMateri} - ${activeTab}`);
  };

  // ==========================================
  // GAME 1: QUIZ CHALLENGE STATE
  // ==========================================
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuizItem = bundle.gameQuiz.soalList[quizIdx] || bundle.gameQuiz.soalList[0];

  const handleSelectQuizOption = (optionIndex: number) => {
    if (quizAnswers[quizIdx] !== undefined) return; // already answered
    const isCorrect = optionIndex === currentQuizItem.jawabanBenar;
    setQuizAnswers((prev) => ({ ...prev, [quizIdx]: optionIndex }));
    if (isCorrect) {
      setQuizScore((prev) => prev + currentQuizItem.poin);
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx < bundle.gameQuiz.soalList.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setIsQuizCompleted(true);
      // Save game results
      BahanAjarAiStorage.saveHasilGame({
        id: `game-res-${Date.now()}`,
        gameId: bundle.id,
        gameTipe: "QUIZ_CHALLENGE",
        gameJudul: bundle.gameQuiz.judul,
        siswaNisn: "0098765432",
        siswaNama: "Farhan Maulana",
        kelasId: `VII-A`,
        skor: quizScore,
        waktuDetik: 45,
        persentaseBenar: Math.round((quizScore / (bundle.gameQuiz.soalList.length * 10)) * 100),
        tanggalMain: new Date().toISOString()
      });
    }
  };

  const handleRestartQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizAnswers({});
    setIsQuizCompleted(false);
  };

  // ==========================================
  // GAME 2: MATCH & WORD STATE
  // ==========================================
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState(0);

  const handleSelectMatchLeft = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedLeft(id);
  };

  const handleSelectMatchRight = (pairTarget: typeof bundle.gameMatch.pairs[0]) => {
    if (!selectedLeft || matchedPairs.includes(pairTarget.id)) return;
    if (selectedLeft === pairTarget.id) {
      // Match success!
      setMatchedPairs((prev) => [...prev, pairTarget.id]);
      setMatchScore((prev) => prev + 20);
      setSelectedLeft(null);
    } else {
      // Mismatch penalty / reset
      setSelectedLeft(null);
      triggerToast("Pasangan belum tepat! Silakan coba lagi.");
    }
  };

  const handleRestartMatch = () => {
    setSelectedLeft(null);
    setMatchedPairs([]);
    setMatchScore(0);
  };

  // ==========================================
  // TEKA-TEKI SILANG (TTS) STATE
  // ==========================================
  const [userTtsInputs, setUserTtsInputs] = useState<Record<string, string>>({});
  const [showTtsAnswers, setShowTtsAnswers] = useState(false);
  const [ttsFeedback, setTtsFeedback] = useState<string | null>(null);

  const handleTtsCellChange = (r: number, c: number, val: string) => {
    const clean = val.toUpperCase().slice(-1);
    setUserTtsInputs((prev) => ({ ...prev, [`${r}-${c}`]: clean }));
  };

  const handleCheckTts = () => {
    let correctCount = 0;
    let totalFilled = 0;
    let totalCells = 0;

    bundle.tts.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.isBlocked && cell.hurufBenar) {
          totalCells++;
          const userVal = userTtsInputs[`${r}-${c}`] || "";
          if (userVal) totalFilled++;
          if (userVal === cell.hurufBenar) {
            correctCount++;
          }
        }
      });
    });

    const percent = Math.round((correctCount / totalCells) * 100);
    setTtsFeedback(`Hasil Pengecekan TTS: ${correctCount} dari ${totalCells} huruf benar (${percent}%).`);
  };

  // ==========================================
  // CBT / UJIAN ONLINE STATE
  // ==========================================
  const [cbtExamStarted, setCbtExamStarted] = useState(false);
  const [cbtIdx, setCbtIdx] = useState(0);
  const [cbtAnswers, setCbtAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [cbtFlagged, setCbtFlagged] = useState<Record<number, boolean>>({});
  const [cbtSubmitted, setCbtSubmitted] = useState(false);
  const [cbtTimeRemaining, setCbtTimeRemaining] = useState(bundle.cbt.durasiMenit * 60);

  const currentCbtQuestion = bundle.cbt.daftarSoal[cbtIdx] || bundle.cbt.daftarSoal[0];

  const handleStartCbt = () => {
    setCbtExamStarted(true);
    setCbtSubmitted(false);
    setCbtIdx(0);
    setCbtAnswers({});
    setCbtFlagged({});
    setCbtTimeRemaining(bundle.cbt.durasiMenit * 60);
  };

  const handleSubmitCbt = () => {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan dan mengirim ujian CBT ini?")) return;
    setCbtSubmitted(true);
    // Grade calculation
    let correct = 0;
    bundle.cbt.daftarSoal.forEach((q, idx) => {
      if (cbtAnswers[idx] === q.kunciJawaban) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / bundle.cbt.daftarSoal.length) * 100);

    // Save CBT result
    BahanAjarAiStorage.saveHasilCbt({
      id: `cbt-res-${Date.now()}`,
      cbtId: bundle.id,
      cbtJudul: bundle.cbt.judulUjian,
      siswaNisn: "0098765432",
      siswaNama: "Farhan Maulana",
      kelasId: `VII-A`,
      tanggalUjian: new Date().toISOString(),
      nilai: finalScore,
      jumlahBenar: correct,
      jumlahSalah: bundle.cbt.daftarSoal.length - correct,
      persentase: finalScore,
      durasiPengerjaanDetik: bundle.cbt.durasiMenit * 60 - cbtTimeRemaining,
      jawabanSiswa: cbtAnswers,
      statusLulus: finalScore >= bundle.cbt.kkm
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / NAVIGATION HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Kembali ke Dashboard / Generator"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px]">
                HASIL BAHAN AJAR AI
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">
                Kelas {bundle.kelas} SMP
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Materi: {bundle.materi}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {bundle.subMateri}
            </h2>
          </div>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Paket</span>
          </button>

          <button
            onClick={handlePrintCurrentTab}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleRegenerateAll}
            disabled={isRegeneratingSingle}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>✨ GENERATE ULANG</span>
          </button>
        </div>
      </div>

      {/* 6 PRODUK BAHAN AJAR AI (SESUAI SPESIFIKASI PROMPT) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab("MATERI")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "MATERI"
              ? "bg-blue-700 text-white shadow-md shadow-blue-800/30"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. MATERI</span>
        </button>

        <button
          onClick={() => setActiveTab("VIDEO")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "VIDEO"
              ? "bg-rose-700 text-white shadow-md shadow-rose-800/30"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>2. VIDEO STORYBOARD</span>
        </button>

        <button
          onClick={() => setActiveTab("GAME")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "GAME"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-800/30 ring-2 ring-emerald-400"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>3. GAME EDUKASI VISUAL AI</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px]">
            6 Game Suite
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TTS")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "TTS"
              ? "bg-indigo-700 text-white shadow-md shadow-indigo-800/30"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. TEKA-TEKI SILANG</span>
        </button>

        <button
          onClick={() => setActiveTab("LKPD")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "LKPD"
              ? "bg-amber-600 text-white shadow-md shadow-amber-700/30"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. LEMBAR KERJA (LKPD)</span>
        </button>

        <button
          onClick={() => setActiveTab("CBT")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
            activeTab === "CBT"
              ? "bg-cyan-700 text-white shadow-md shadow-cyan-800/30"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>6. CBT UJIAN ONLINE ({bundle.cbt.daftarSoal.length} SOAL)</span>
        </button>
      </div>

      {/* INDIVIDUAL PRODUCT ACTION TOOLBAR */}
      <div className="p-3.5 px-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-extrabold text-slate-600">
          Alat Produk: <strong>{activeTab}</strong>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === "MATERI") handleRegenerateProduct("MATERI");
              else if (activeTab === "VIDEO") handleRegenerateProduct("VIDEO");
              else if (activeTab === "GAME") handleRegenerateProduct("GAME_QUIZ");
              else if (activeTab === "TTS") handleRegenerateProduct("TTS");
              else if (activeTab === "LKPD") handleRegenerateProduct("LKPD");
              else if (activeTab === "CBT") handleRegenerateProduct("CBT");
            }}
            disabled={isRegeneratingSingle}
            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRegeneratingSingle ? "animate-spin" : ""}`} />
            <span>Regenerate {activeTab}</span>
          </button>

          <button
            onClick={() => handleCopyText(JSON.stringify(bundle), "Data Paket")}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Konten</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE CONTENT AREA FOR ALL TABS */}
      <div id="printable-content-area" className="space-y-6">
        {/* =================================================== */}
        {/* TAB 1: MATERI PEMBELAJARAN */}
        {/* =================================================== */}
        {activeTab === "MATERI" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                Materi Pembelajaran PAI SMP
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {bundle.materiPembelajaran.judul}
              </h1>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span>Kelas: {bundle.kelas} SMP</span>
                <span>•</span>
                <span>Materi: {bundle.materi}</span>
              </div>
            </div>

            {/* Apersepsi & Pengantar */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Apersepsi & Motivasi Belajar
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {bundle.materiPembelajaran.apersepsi}
              </p>
            </div>

            {/* Tujuan Pembelajaran & Kompetensi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2.5">
                <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  Tujuan Pembelajaran
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bundle.materiPembelajaran.tujuanPembelajaran.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Kompetensi Profil Pelajar Pancasila
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bundle.materiPembelajaran.kompetensi.map((k, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Materi Inti & Penjelasan Konsep */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 border-l-4 border-blue-600 pl-3">
                Uraian Materi Inti & Penjelasan Konsep
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {bundle.materiPembelajaran.materiInti}
              </p>

              <div className="space-y-2.5 pt-1">
                {bundle.materiPembelajaran.penjelasanKonsep.map((pk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {pk}
                  </div>
                ))}
              </div>
            </div>

            {/* Dalil Al-Qur'an (Surah & Ayat Terverifikasi) */}
            {bundle.materiPembelajaran.dalilQuran && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white space-y-4 border border-emerald-800/80 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    Dalil Al-Qur'an: {bundle.materiPembelajaran.dalilQuran.sumber}
                  </span>
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>

                {/* Ayat Arab */}
                <p className="text-xl sm:text-2xl font-serif text-right leading-loose text-amber-200 font-bold pr-2" dir="rtl">
                  {bundle.materiPembelajaran.dalilQuran.teksArab}
                </p>

                {/* Terjemahan */}
                <div className="pt-2 border-t border-emerald-800/70 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-300">Terjemahan Resmi Kemenag:</span>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    "{bundle.materiPembelajaran.dalilQuran.terjemahan}"
                  </p>
                </div>

                {/* Penjelasan Dalil */}
                <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 text-xs text-emerald-100 leading-relaxed">
                  <strong>Intisari Tafsir:</strong> {bundle.materiPembelajaran.dalilQuran.penjelasanDalil}
                </div>
              </div>
            )}

            {/* Hadis Sahih */}
            {bundle.materiPembelajaran.hadis && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                    Hadis {bundle.materiPembelajaran.hadis.status}: {bundle.materiPembelajaran.hadis.perawi}
                  </span>
                  <Volume2 className="w-4 h-4 text-blue-700" />
                </div>
                {bundle.materiPembelajaran.hadis.teksArab && (
                  <p className="text-lg font-serif text-right text-slate-900" dir="rtl">
                    {bundle.materiPembelajaran.hadis.teksArab}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-700 italic">
                  "{bundle.materiPembelajaran.hadis.terjemahan}"
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Keterangan:</strong> {bundle.materiPembelajaran.hadis.penjelasan}
                </p>
              </div>
            )}

            {/* Contoh Kehidupan Sehari-hari & Hikmah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Contoh Tindakan Sehari-Hari
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bundle.materiPembelajaran.contohKehidupanSehariHari.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Hikmah & Keutamaan
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bundle.materiPembelajaran.hikmah.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">★</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rangkuman & Refleksi */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
              <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                Rangkuman & Refleksi Diri
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {bundle.materiPembelajaran.rangkuman.map((r, idx) => (
                  <li key={idx}>• {r}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-indigo-200 text-xs text-indigo-950 font-medium italic">
                {bundle.materiPembelajaran.refleksi}
              </div>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 2: VIDEO PEMBELAJARAN (STORYBOARD & PROMPTS) */}
        {/* =================================================== */}
        {activeTab === "VIDEO" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">
                Storyboard & Video Production Blueprint
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {bundle.video.judulVideo}
              </h2>
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                <span>Durasi: {bundle.video.durasiTotal}</span>
                <span>•</span>
                <span>Gaya: {bundle.video.gayaVideo}</span>
              </div>
            </div>

            {/* Quick Action Script / Prompts */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopyText(bundle.video.scriptLengkap, "Script Lengkap")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Script Lengkap</span>
              </button>

              <button
                onClick={() => {
                  const allPrompts = bundle.video.storyboard.map((s) => `Scene ${s.scene}:\nVisual: ${s.promptGambarAi}\nVideo: ${s.promptVideoAi}`).join("\n\n");
                  handleCopyText(allPrompts, "Prompt AI");
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Salin Semua Prompt AI (Gambar & Video)</span>
              </button>
            </div>

            {/* Scenes Storyboard Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Storyboard Adegan demi Adegan (Scene by Scene)
              </h3>

              <div className="space-y-4">
                {bundle.video.storyboard.map((sc) => (
                  <div
                    key={sc.scene}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 font-black text-xs">
                        SCENE {sc.scene} ({sc.durasiDetik} Detik)
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Visual & Audio Sync
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <span className="block font-black text-slate-900 uppercase text-[10px]">
                          Visual & Tata Panggung:
                        </span>
                        <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          {sc.visual}
                        </p>

                        <span className="block font-black text-slate-900 uppercase text-[10px] pt-1">
                          Teks Pada Layar (Overlay):
                        </span>
                        <p className="text-slate-700 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                          {sc.teksLayar}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="block font-black text-slate-900 uppercase text-[10px]">
                          Narasi & Dialog:
                        </span>
                        <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                          <strong>Narator:</strong> "{sc.narasi}"
                          {sc.dialog && (
                            <span className="block pt-1 text-slate-800">
                              <em>{sc.dialog}</em>
                            </span>
                          )}
                        </p>

                        <span className="block font-black text-slate-900 uppercase text-[10px] pt-1">
                          Prompt AI Generator:
                        </span>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                          <p className="text-indigo-900">
                            <strong>Prompt Gambar:</strong> {sc.promptGambarAi}
                          </p>
                          <p className="text-rose-900">
                            <strong>Prompt Video:</strong> {sc.promptVideoAi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 3: GAME EDUKASI VISUAL AI (6+ GAME VISUAL SUITE) */}
        {/* =================================================== */}
        {activeTab === "GAME" && (
          <GameHubVisual
            kelas={bundle.kelas}
            materi={bundle.materi}
            subMateri={bundle.subMateri}
            isStudentMode={isStudentMode}
          />
        )}

        {/* =================================================== */}
        {/* TAB 5: TEKA-TEKI SILANG (TTS) */}
        {/* =================================================== */}
        {activeTab === "TTS" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">
                  Media Teka-Teki Silang (TTS) Interaktif
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  {bundle.tts.judul}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi kotak huruf berdasarkan petunjuk mendatar dan menurun di bawah ini.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckTts}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Cek Jawaban Saya
                </button>

                <button
                  onClick={() => setShowTtsAnswers(!showTtsAnswers)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  {showTtsAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showTtsAnswers ? "Tutup Kunci" : "Mode Guru: Lihat Kunci"}</span>
                </button>
              </div>
            </div>

            {ttsFeedback && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-950 flex items-center justify-between">
                <span>{ttsFeedback}</span>
                <button onClick={() => setTtsFeedback(null)} className="text-indigo-700 hover:text-indigo-950">✕</button>
              </div>
            )}

            {/* TTS Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Grid 9x9 */}
              <div className="p-4 rounded-3xl bg-slate-100 border border-slate-300 inline-block mx-auto shadow-inner">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${bundle.tts.dimensi.kolom}, minmax(0, 1fr))`
                  }}
                >
                  {bundle.tts.grid.map((row, r) =>
                    row.map((cell, c) => {
                      if (cell.isBlocked) {
                        return (
                          <div
                            key={`${r}-${c}`}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-md"
                          ></div>
                        );
                      }

                      const userChar = userTtsInputs[`${r}-${c}`] || "";
                      const isRevealed = showTtsAnswers;
                      const displayChar = isRevealed ? cell.hurufBenar : userChar;

                      return (
                        <div
                          key={`${r}-${c}`}
                          className="relative w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-400 rounded-md flex items-center justify-center font-black text-sm sm:text-base text-slate-900 shadow-2xs"
                        >
                          {cell.nomor && (
                            <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-slate-500 leading-none">
                              {cell.nomor}
                            </span>
                          )}
                          <input
                            type="text"
                            maxLength={1}
                            value={displayChar}
                            onChange={(e) => handleTtsCellChange(r, c, e.target.value)}
                            disabled={showTtsAnswers}
                            className={`w-full h-full text-center uppercase font-black bg-transparent focus:bg-indigo-50 focus:outline-none ${
                              isRevealed ? "text-emerald-700 font-extrabold" : ""
                            }`}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Clues Mendatar & Menurun */}
              <div className="space-y-5">
                {/* Mendatar */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-700"></span>
                    Petunjuk Mendatar (Across)
                  </h4>
                  <div className="space-y-1.5">
                    {bundle.tts.petunjukMendatar.map((clue) => (
                      <div
                        key={clue.nomor}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <strong>{clue.nomor}.</strong> {clue.pertanyaan}
                        {showTtsAnswers && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                            [{clue.jawaban}]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Menurun */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-700"></span>
                    Petunjuk Menurun (Down)
                  </h4>
                  <div className="space-y-1.5">
                    {bundle.tts.petunjukMenurun.map((clue) => (
                      <div
                        key={clue.nomor}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <strong>{clue.nomor}.</strong> {clue.pertanyaan}
                        {showTtsAnswers && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                            [{clue.jawaban}]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 6: LEMBAR KERJA PESERTA DIDIK (LKPD) */}
        {/* =================================================== */}
        {activeTab === "LKPD" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            {/* Kop LKPD */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900">
                LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI
              </h2>
              <p className="text-xs font-bold text-slate-600">
                Fase D • Kurikulum Merdeka • Satuan Pendidikan SMP
              </p>
            </div>

            {/* A. Identitas Siswa / Kelompok */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-600 block">Nama Anggota Kelompok:</span>
                <div className="h-6 border-b border-dotted border-slate-400"></div>
                <div className="h-6 border-b border-dotted border-slate-400"></div>
              </div>
              <div className="space-y-1">
                <div><strong>Kelas:</strong> {bundle.lkpd.identitas.kelas}</div>
                <div><strong>Materi Pokok:</strong> {bundle.lkpd.identitas.materi}</div>
                <div><strong>Sub Materi:</strong> {bundle.lkpd.identitas.subMateri}</div>
                <div><strong>Alokasi Waktu:</strong> {bundle.lkpd.identitas.alokasiWaktu}</div>
              </div>
            </div>

            {/* B & C: Tujuan & Petunjuk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h4 className="font-black text-blue-900 uppercase mb-2">B. Tujuan Pembelajaran</h4>
                <ul className="space-y-1 text-slate-700">
                  {bundle.lkpd.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx}>• {tp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-black text-amber-900 uppercase mb-2">C. Petunjuk Pengerjaan</h4>
                <ul className="space-y-1 text-slate-700">
                  {bundle.lkpd.petunjukPengerjaan.map((pj, idx) => (
                    <li key={idx}>• {pj}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* D & E: Apersepsi & Materi Singkat */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-black text-slate-900 uppercase">D. Apersepsi & Stimulus</h4>
              <p className="text-slate-700 leading-relaxed">{bundle.lkpd.apersepsi}</p>
              <h4 className="font-black text-slate-900 uppercase pt-2">E. Materi Singkat</h4>
              <p className="text-slate-700 leading-relaxed">{bundle.lkpd.materiSingkat}</p>
            </div>

            {/* F - J: 5 Aktivitas LKPD */}
            <div className="space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-4 border-amber-500 pl-3">
                Rangkaian Aktivitas Pembelajaran
              </h3>

              {bundle.lkpd.aktivitasList.map((act) => (
                <div
                  key={act.nomor}
                  className="p-5 rounded-2xl bg-white border border-slate-300 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs">
                      {act.judulAktivitas}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Tipe: {act.tipe}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold">{act.instruksi}</p>

                  <div className="space-y-2 text-xs">
                    {act.pertanyaan.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-1">
                        <p className="font-bold text-slate-900">{qIdx + 1}. {q}</p>
                        {act.ruangJawabanTersedia && (
                          <textarea
                            placeholder="Tuliskan jawaban kelompok di sini..."
                            rows={3}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-blue-500"
                          ></textarea>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Kesimpulan & Evaluasi */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <h4 className="font-black uppercase">K. Kesimpulan Pembelajaran</h4>
              <p>{bundle.lkpd.kesimpulan}</p>
              <h4 className="font-black uppercase pt-1">L. Rubrik Evaluasi Penilaian</h4>
              <ul className="space-y-0.5">
                {bundle.lkpd.evaluasi.map((ev, idx) => (
                  <li key={idx}>• {ev}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 7: COMPUTER BASED TEST (CBT / UJIAN ONLINE) */}
        {/* =================================================== */}
        {activeTab === "CBT" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700">
                  Simulasi CBT / Computer Based Test
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  {bundle.cbt.judulUjian}
                </h2>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 mt-0.5">
                  <span>Jumlah Soal: {bundle.cbt.totalSoal} Butir</span>
                  <span>•</span>
                  <span>Durasi: {bundle.cbt.durasiMenit} Menit</span>
                  <span>•</span>
                  <span>KKM: {bundle.cbt.kkm}</span>
                </div>
              </div>

              {!cbtExamStarted && !cbtSubmitted && (
                <button
                  onClick={handleStartCbt}
                  className="px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Simulasi Ujian CBT</span>
                </button>
              )}
            </div>

            {/* CBT TEST INTERACTIVE ARENA */}
            {cbtExamStarted && !cbtSubmitted ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: Question Area (3 Cols) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Top Bar Question Nav */}
                  <div className="p-3.5 px-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs font-bold shadow-md">
                    <span>Soal Nomor {cbtIdx + 1} dari {bundle.cbt.daftarSoal.length}</span>
                    <span className="flex items-center gap-1.5 text-amber-300 font-mono">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(cbtTimeRemaining / 60)}:{(cbtTimeRemaining % 60).toString().padStart(2, "0")}</span>
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>Tingkat: {currentCbtQuestion.tingkatKesulitan}</span>
                      <span>Indikator: {currentCbtQuestion.indikator}</span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                      {currentCbtQuestion.pertanyaan}
                    </p>

                    {/* Options A, B, C, D */}
                    <div className="space-y-2.5 pt-2">
                      {currentCbtQuestion.pilihan.map((pOpt, pIdx) => {
                        const letter = (["A", "B", "C", "D"][pIdx]) as "A" | "B" | "C" | "D";
                        const isSelected = cbtAnswers[cbtIdx] === letter;

                        return (
                          <button
                            key={pIdx}
                            onClick={() => setCbtAnswers((prev) => ({ ...prev, [cbtIdx]: letter }))}
                            className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-300"
                                : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isSelected ? "bg-white text-blue-900" : "bg-slate-100 text-slate-700"
                            }`}>
                              {letter}
                            </span>
                            <span>{pOpt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Navigation Toolbar */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setCbtIdx((prev) => Math.max(0, prev - 1))}
                      disabled={cbtIdx === 0}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      onClick={() => setCbtFlagged((prev) => ({ ...prev, [cbtIdx]: !prev[cbtIdx] }))}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        cbtFlagged[cbtIdx]
                          ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {cbtFlagged[cbtIdx] ? "✓ Ditandai Ragu-Ragu" : "Tandai Ragu-Ragu"}
                    </button>

                    {cbtIdx < bundle.cbt.daftarSoal.length - 1 ? (
                      <button
                        onClick={() => setCbtIdx((prev) => Math.min(bundle.cbt.daftarSoal.length - 1, prev + 1))}
                        className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitCbt}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                      >
                        Selesai & Kumpulkan
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Grid of Numbers Nav (1 Col) */}
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 h-fit">
                  <span className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Navigasi Nomor Soal
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {bundle.cbt.daftarSoal.map((q, idx) => {
                      const isAnswered = cbtAnswers[idx] !== undefined;
                      const isCurrent = cbtIdx === idx;
                      const isFlagged = cbtFlagged[idx];

                      let btnStyle = "bg-white text-slate-700 border-slate-300";
                      if (isCurrent) btnStyle = "ring-2 ring-blue-600 bg-blue-50 font-black text-blue-900";
                      else if (isFlagged) btnStyle = "bg-amber-400 text-slate-950 font-black";
                      else if (isAnswered) btnStyle = "bg-emerald-600 text-white font-black";

                      return (
                        <button
                          key={idx}
                          onClick={() => setCbtIdx(idx)}
                          className={`w-9 h-9 rounded-xl border text-xs font-bold flex items-center justify-center transition cursor-pointer ${btnStyle}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-emerald-600"></span>
                      <span>Sudah Dijawab ({Object.keys(cbtAnswers).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-amber-400"></span>
                      <span>Ragu-Ragu ({Object.values(cbtFlagged).filter(Boolean).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                      <span>Belum Dijawab ({bundle.cbt.daftarSoal.length - Object.keys(cbtAnswers).length})</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitCbt}
                    className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer"
                  >
                    Kumpulkan Ujian
                  </button>
                </div>
              </div>
            ) : cbtSubmitted ? (
              /* CBT RESULTS AFTER SUBMISSION */
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase">
                    Hasil Rekap Ujian CBT Siswa
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Alhamdulillah, Ujian Telah Selesai!
                  </h3>
                  <div className="flex justify-center items-center gap-4 pt-2">
                    <div className="p-3 px-5 rounded-2xl bg-white/10 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Nilai Akhir</span>
                      <span className="text-3xl font-black text-amber-400">
                        {Math.round(
                          (bundle.cbt.daftarSoal.filter((q, idx) => cbtAnswers[idx] === q.kunciJawaban).length /
                            bundle.cbt.daftarSoal.length) *
                            100
                        )}
                      </span>
                    </div>
                    <div className="p-3 px-5 rounded-2xl bg-white/10 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Benar / Total</span>
                      <span className="text-xl font-black text-emerald-400">
                        {bundle.cbt.daftarSoal.filter((q, idx) => cbtAnswers[idx] === q.kunciJawaban).length} / {bundle.cbt.daftarSoal.length}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartCbt}
                    className="mt-4 px-5 py-2.5 bg-white text-slate-950 font-black text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    Ulangi Simulasi Ujian
                  </button>
                </div>

                {/* Question Review & Explanations */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Pembahasan & Kunci Jawaban Lengkap
                  </h4>
                  {bundle.cbt.daftarSoal.map((q, idx) => {
                    const studentAns = cbtAnswers[idx];
                    const isCorrect = studentAns === q.kunciJawaban;

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border text-xs space-y-2 ${
                          isCorrect ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900">
                            Soal #{idx + 1} • {q.indikator}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            isCorrect ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                          }`}>
                            {isCorrect ? "Jawaban Anda Benar" : `Salah (Jawaban Anda: ${studentAns || "-"})`}
                          </span>
                        </div>

                        <p className="font-bold text-slate-900 text-sm whitespace-pre-line">
                          {q.pertanyaan}
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <p className="text-emerald-900 font-bold">
                            Kunci Jawaban: <strong>{q.kunciJawaban}</strong>
                          </p>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>Pembahasan:</strong> {q.pembahasan}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Pre-Test Overview for Teachers / Students */
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    Daftar Kisi-Kisi & Bank Soal CBT ({bundle.cbt.daftarSoal.length} Butir)
                  </h4>
                  <p className="text-xs text-slate-700">
                    Instrumen asesmen CBT ini siap digunakan secara langsung untuk ulangan harian, PTS, maupun latihan mandiri siswa dengan timer dan penilaian otomatis.
                  </p>
                </div>

                <div className="space-y-3">
                  {bundle.cbt.daftarSoal.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">Nomor {idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                          Kunci: {q.kunciJawaban}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 whitespace-pre-line">{q.pertanyaan}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-600">
                        {q.pilihan.map((p, pIdx) => (
                          <div key={pIdx}>
                            <strong>{["A", "B", "C", "D"][pIdx]}.</strong> {p}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-emerald-800 pt-1">
                        <strong>Pembahasan:</strong> {q.pembahasan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
