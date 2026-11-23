/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Play,
  CheckCircle2,
  Trophy,
  Flame,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Video as VideoIcon,
  GraduationCap,
  Send,
  Clock,
  Check,
  FileText,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Siswa } from "../../types";
import {
  SharedMediaAjarItem,
  SharedMediaSubmission,
  SharedMediaSoalItem
} from "../../services/sharedMediaAjarStorage";
import PaiVideoPlayer from "../common/PaiVideoPlayer";
import { isPlaceholderVideoUrl } from "../../utils/videoEmbed";

interface SharedMediaPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SharedMediaAjarItem | null;
  siswa: Siswa;
  existingSubmission?: SharedMediaSubmission | null;
  onSaveSubmission: (sub: SharedMediaSubmission) => void;
}

export default function SharedMediaPlayerModal({
  isOpen,
  onClose,
  item,
  siswa,
  existingSubmission,
  onSaveSubmission
}: SharedMediaPlayerModalProps) {
  // Video Player reflection state
  const [videoReflection, setVideoReflection] = useState("");

  // Game / Quiz Play states
  const [phase, setPhase] = useState<"intro" | "play" | "essay" | "result">("intro");
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [pgAnswers, setPgAnswers] = useState<Record<string, number>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [streak, setStreak] = useState(1);
  const [gamePoints, setGamePoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(25);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const pgQuestions = useMemo<SharedMediaSoalItem[]>(() => {
    if (!item?.soalList) return [];
    return item.soalList.filter((s) => s.tipe === "pilihan_ganda");
  }, [item]);

  const essayQuestions = useMemo<SharedMediaSoalItem[]>(() => {
    if (!item?.soalList) return [];
    return item.soalList.filter((s) => s.tipe === "essay");
  }, [item]);

  // Reset state whenever modal opens with an item
  useEffect(() => {
    if (!isOpen || !item) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setVideoReflection(existingSubmission?.catatanSiswa || "");
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setPgAnswers(existingSubmission?.pgAnswers || {});
    setEssayAnswers(existingSubmission?.essayAnswers || {});
    setStreak(1);
    setGamePoints(0);
    setCorrectCount(existingSubmission?.correctCount || 0);
    setTimer(25);
    setSavedToast(null);

    if (existingSubmission) {
      setPhase("result");
    } else if (item.type === "video") {
      setPhase("play");
    } else if (pgQuestions.length === 0 && essayQuestions.length > 0) {
      setPhase("essay");
    } else {
      setPhase("intro");
    }
  }, [isOpen, item?.id]);

  // Countdown timer for Game mode or PG mode
  useEffect(() => {
    if (!isOpen || !item || item.type === "video") return;
    if (phase !== "play" || selectedOpt !== null || pgQuestions.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSelectedOpt(-1); // time out
          setStreak(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, item, phase, selectedOpt, pgQuestions.length]);

  if (!isOpen || !item) return null;

  const isPlaceholderYoutube = isPlaceholderVideoUrl(item.videoData?.videoUrl);

  const handleStartPlay = () => {
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setPgAnswers({});
    setEssayAnswers({});
    setStreak(1);
    setGamePoints(0);
    setCorrectCount(0);
    setTimer(25);
    if (pgQuestions.length > 0) {
      setPhase("play");
    } else if (essayQuestions.length > 0) {
      setPhase("essay");
    }
  };

  const handlePickOption = (optIdx: number) => {
    if (selectedOpt !== null) return;
    const currQ = pgQuestions[currentQIdx];
    if (!currQ) return;

    setSelectedOpt(optIdx);
    const updatedAnswers = { ...pgAnswers, [currQ.id]: optIdx };
    setPgAnswers(updatedAnswers);

    if (optIdx === currQ.kunci) {
      const gained = 800 + timer * 15 + streak * 150;
      setGamePoints((p) => p + gained);
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(1);
    }
  };

  const finalizeAndSubmit = (
    finalPgAnswers: Record<string, number>,
    finalEssayAnswers: Record<string, string>
  ) => {
    let correct = 0;
    pgQuestions.forEach((q) => {
      if (finalPgAnswers[q.id] === q.kunci) {
        correct += 1;
      }
    });
    const totalPG = pgQuestions.length;
    const scorePG = totalPG > 0 ? Math.round((correct / totalPG) * 100) : 100;

    const submission: SharedMediaSubmission = {
      id: existingSubmission?.id || "sms-" + Date.now(),
      sharedMediaId: item.id,
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasId: siswa.kelasId,
      type: item.type,
      scorePG,
      correctCount: correct,
      totalPG,
      pgAnswers: finalPgAnswers,
      essayAnswers: finalEssayAnswers,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: essayQuestions.length > 0 ? "Menunggu Penilaian Essay" : "Selesai"
    };

    onSaveSubmission(submission);
    setCorrectCount(correct);
    setPhase("result");
    setSavedToast("Alhamdulillah! Jawaban & skor kamu berhasil dikirim ke Guru PAI.");
    setTimeout(() => setSavedToast(null), 4000);
  };

  const handleNextPgQuestion = () => {
    if (currentQIdx + 1 < pgQuestions.length) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOpt(null);
      setTimer(25);
    } else if (essayQuestions.length > 0) {
      setPhase("essay");
    } else {
      finalizeAndSubmit(pgAnswers, essayAnswers);
    }
  };

  const handleSubmitEssayAndFinish = () => {
    const unfilled = essayQuestions.some((q) => !(essayAnswers[q.id] || "").trim());
    if (unfilled) {
      if (!window.confirm("Ada soal Uraian/Essay yang masih kosong. Tetap kumpulkan sekarang?")) {
        return;
      }
    }
    finalizeAndSubmit(pgAnswers, essayAnswers);
  };

  const handleCompleteVideoTask = () => {
    const submission: SharedMediaSubmission = {
      id: existingSubmission?.id || "sms-" + Date.now(),
      sharedMediaId: item.id,
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasId: siswa.kelasId,
      type: "video",
      scorePG: 100,
      correctCount: 1,
      totalPG: 1,
      watchedVideo: true,
      catatanSiswa: videoReflection.trim() || "Telah menyimak materi video pembelajaran PAI sampai selesai.",
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Selesai"
    };
    onSaveSubmission(submission);
    setPhase("result");
    setSavedToast("Alhamdulillah! Laporan menonton & pemahaman video berhasil dikirim ke Guru PAI.");
    setTimeout(() => setSavedToast(null), 4000);
  };

  const isGameTheme = item.type === "game" || (item.type === "lms" && phase === "play");
  const currentQ = pgQuestions[currentQIdx];
  const finalPct =
    pgQuestions.length > 0 ? Math.round((correctCount / pgQuestions.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div
        className={`rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border space-y-5 my-4 max-h-[92vh] overflow-y-auto relative ${
          isGameTheme
            ? "bg-gradient-to-br from-[#1d0637] via-[#2d0a57] to-[#120224] text-white border-purple-500/40"
            : "bg-white text-slate-900 border-slate-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-3 pb-3 border-b ${
            isGameTheme ? "border-purple-500/30" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                item.type === "video"
                  ? "bg-sky-500 text-white"
                  : item.type === "game"
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-400 text-slate-950"
              }`}
            >
              {item.type === "video" ? (
                <VideoIcon className="w-5 h-5" />
              ) : item.type === "game" ? (
                <Gamepad2 className="w-5 h-5" />
              ) : (
                <GraduationCap className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isGameTheme
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {item.type === "video"
                    ? "VIDEO PEMBELAJARAN"
                    : item.type === "game"
                    ? "GAME KUIS INTERAKTIF"
                    : "UJIAN CBT PAI"}
                </span>
                <span className={`text-[11px] font-bold ${isGameTheme ? "text-purple-200" : "text-slate-500"}`}>
                  {item.materi}
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-black truncate ${isGameTheme ? "text-white" : "text-slate-900"}`}>
                {item.judul}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
              isGameTheme
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedToast && (
          <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* ==================== PHASE: INTRO (FOR LMS & GAME) ==================== */}
        {phase === "intro" && item.type !== "video" && (
          <div className="space-y-5 py-2">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50/50 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Instruksi dari Guru PAI ({item.guruNama}):</span>
                </span>
                {item.deadline && (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Batas: {item.deadline.replace("T", " ")}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {item.instruksiGuru || item.deskripsi}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-white border border-purple-100 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block">Pilihan Ganda</span>
                  <strong className="text-base font-black text-[#46178f]">{pgQuestions.length} Soal</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-amber-100 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block">Uraian / Essay</span>
                  <strong className="text-base font-black text-amber-700">{essayQuestions.length} Soal</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-emerald-100 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 block">Peserta</span>
                  <strong className="text-xs font-black text-emerald-800 truncate block mt-1">{siswa.nama}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartPlay}
              className="w-full py-4 bg-gradient-to-r from-[#46178f] via-indigo-700 to-emerald-600 hover:from-[#381273] hover:to-emerald-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{item.type === "lms" ? "MULAI UJIAN CBT SEKARANG" : "MULAI PLAY / KERJAKAN SEKARANG"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== PHASE: PLAY (PG / GAME) ==================== */}
        {phase === "play" && item.type !== "video" && currentQ && (
          <div className="space-y-5">
            {/* Status bar */}
            <div className="flex items-center justify-between text-xs font-black flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-400/30 text-purple-200">
                Soal {currentQIdx + 1} dari {pgQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Streak x{streak}</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-mono">
                  🏆 {gamePoints} Pts
                </span>
              </div>
            </div>

            {/* Timer bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-purple-200 font-bold">
                <span>⏱️ Waktu Soal Ini:</span>
                <span className={`font-mono font-black ${timer <= 5 ? "text-rose-400 animate-pulse" : "text-amber-300"}`}>
                  {timer} detik
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timer > 12 ? "bg-emerald-400" : timer > 6 ? "bg-amber-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${(timer / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/10 border border-purple-400/30 backdrop-blur-md text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-3 py-1 rounded-full inline-block">
                Pilihan Ganda • {item.materi}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-relaxed">
                {currentQ.pertanyaan}
              </h2>
            </div>

            {/* 4 Wayground Answer Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentQ.pilihan || []).map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.kunci;
                const isAnswered = selectedOpt !== null;
                const colors = [
                  { bg: "bg-rose-600 hover:bg-rose-500", label: "▲ Opsi A" },
                  { bg: "bg-blue-600 hover:bg-blue-500", label: "◆ Opsi B" },
                  { bg: "bg-emerald-600 hover:bg-emerald-500", label: "● Opsi C" },
                  { bg: "bg-amber-500 hover:bg-amber-400", label: "■ Opsi D" }
                ];
                const scheme = colors[idx % 4];
                let btnCls = scheme.bg;
                if (isAnswered) {
                  if (isCorrect) {
                    btnCls = "bg-emerald-600 ring-4 ring-emerald-300 scale-[1.01] shadow-xl";
                  } else if (isSelected && !isCorrect) {
                    btnCls = "bg-rose-700 opacity-85 ring-2 ring-rose-400";
                  } else {
                    btnCls = "bg-slate-800 opacity-45";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handlePickOption(idx)}
                    className={`p-4 rounded-2xl text-left font-bold text-white transition-all active:scale-95 cursor-pointer flex flex-col justify-between min-h-[84px] shadow-lg ${btnCls}`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-90 pb-1">
                      <span className="font-black uppercase">{scheme.label}</span>
                      {isAnswered && isCorrect && <span className="font-black">✓ BENAR</span>}
                      {isAnswered && isSelected && !isCorrect && <span className="font-black">✗ SALAH</span>}
                    </div>
                    <span className="text-sm font-extrabold leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Pembahasan & Next */}
            {selectedOpt !== null && (
              <div className="p-4 rounded-2xl bg-black/40 border border-purple-400/40 space-y-3 animate-fadeIn">
                {item.showExplanations !== false && currentQ.pembahasan && (
                  <div className="space-y-1">
                    <span className="text-xs font-black text-amber-300 block">📖 Pembahasan & Dalil:</span>
                    <p className="text-xs text-purple-100 leading-relaxed">{currentQ.pembahasan}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextPgQuestion}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>
                      {currentQIdx + 1 < pgQuestions.length
                        ? "Lanjut Soal Berikutnya"
                        : essayQuestions.length > 0
                        ? `Lanjut ke Soal Essay (${essayQuestions.length})`
                        : "Selesai & Kirim Jawaban"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PHASE: ESSAY QUESTIONS ==================== */}
        {phase === "essay" && essayQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-black text-amber-950">
                  Bagian Soal Uraian / Essay ({essayQuestions.length} Butir)
                </span>
              </div>
              {pgQuestions.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ✓ Pilihan Ganda Selesai ({correctCount}/{pgQuestions.length} Benar)
                </span>
              )}
            </div>

            <div className="space-y-4">
              {essayQuestions.map((eq, idx) => (
                <div key={eq.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#46178f] text-white text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {eq.pertanyaan}
                      </p>
                    </div>
                    {eq.bobotNilai && (
                      <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                        {eq.bobotNilai} Poin
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={essayAnswers[eq.id] || ""}
                    onChange={(e) =>
                      setEssayAnswers({ ...essayAnswers, [eq.id]: e.target.value })
                    }
                    placeholder="Ketikkan jawaban uraian kamu secara lengkap dan jelas di sini..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-[#46178f]"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSubmitEssayAndFinish}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Semua Jawaban ke Guru</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== PHASE: VIDEO PLAYER ==================== */}
        {phase === "play" && item.type === "video" && (
          <div className="space-y-4">
            <PaiVideoPlayer
              videoKey={item.id}
              judul={item.judul}
              kelas={item.kelasTarget !== "SEMUA" ? item.kelasTarget : undefined}
              materi={item.materi}
              durasi={item.videoData?.durasi || "08:00"}
              dalil={item.videoData?.dalil}
              terjemahan={item.videoData?.terjemahan}
              naskah={item.videoData?.naskah}
              videoUrl={item.videoData?.videoUrl}
              compact
            />

            {/* Script & Dalil */}
            {item.videoData && (
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Ringkasan Materi & Dalil Naqli ({item.videoData.dalil})</span>
                  </strong>
                  {!isPlaceholderYoutube && item.videoData.videoUrl && (
                    <a
                      href={item.videoData.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>Buka Tautan Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-sky-100">
                  "{item.videoData.terjemahan}"
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">{item.videoData.naskah}</p>
              </div>
            )}

            {/* Student Reflection */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label className="text-xs font-black text-slate-800 block">
                Tuliskan Poin Penting / Hikmah dari Video Ini (Bukti Menyimak):
              </label>
              <textarea
                rows={2}
                value={videoReflection}
                onChange={(e) => setVideoReflection(e.target.value)}
                placeholder="Contoh: Dari video ini saya memahami tata cara bersuci dan pentingnya menjaga kebersihan sebelum shalat..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-sky-600"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCompleteVideoTask}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Tandai Selesai & Kirim ke Guru</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PHASE: RESULT ==================== */}
        {phase === "result" && (
          <div className="space-y-5 text-center py-3">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">
                {item.type === "lms" ? "Alhamdulillah! Ujian CBT Selesai" : "Alhamdulillah! Tugas Media Ajar Selesai"}
              </h4>
              <p className="text-xs text-slate-600">
                Hasil pekerjaanmu pada <strong>{item.judul}</strong> telah tersimpan untuk {item.guruNama}.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                  {item.type === "video" ? "Status Video" : item.type === "lms" ? "Nilai CBT (PG)" : "Nilai PG / Game"}
                </span>
                <strong className="text-2xl font-black text-emerald-900">
                  {item.type === "video" ? "100%" : `${existingSubmission?.scorePG ?? finalPct}`}
                </strong>
              </div>

              {item.type !== "video" && (
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">Jawaban Benar</span>
                  <strong className="text-2xl font-black text-[#46178f]">
                    {existingSubmission?.correctCount ?? correctCount} / {existingSubmission?.totalPG ?? pgQuestions.length}
                  </strong>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Status</span>
                <strong className="text-xs font-black text-amber-950 block mt-1.5">
                  {existingSubmission?.status || (essayQuestions.length > 0 ? "Menunggu Penilaian Essay" : "Tuntas")}
                </strong>
              </div>
            </div>

            {/* Review PG & Essay answers if already completed */}
            {essayQuestions.length > 0 && (
              <div className="text-left space-y-2 max-w-xl mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-xs font-black text-slate-800 block">
                  Jawaban Uraian / Essay Kamu:
                </strong>
                {essayQuestions.map((eq, i) => (
                  <div key={eq.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">
                      {i + 1}. {eq.pertanyaan}
                    </p>
                    <p className="text-slate-600 italic">
                      Jawaban: {(existingSubmission?.essayAnswers?.[eq.id] ?? essayAnswers[eq.id]) || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (item.type === "video") {
                    setPhase("play");
                  } else {
                    handleStartPlay();
                  }
                }}
                className="px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-[#46178f] font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {item.type === "video"
                    ? "Putar Ulang Video"
                    : item.type === "lms"
                    ? "Kerjakan Ulang CBT"
                    : "Play / Kerjakan Ulang"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
