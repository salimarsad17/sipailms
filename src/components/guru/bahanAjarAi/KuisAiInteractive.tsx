/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Printer,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Timer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  ListOrdered,
  FileText
} from "lucide-react";
import { SoalKuisAi } from "../../../types/bahanAjarAi";
import { SoundEngine } from "./audioSynth";

interface KuisAiInteractiveProps {
  soalList: SoalKuisAi[];
  judulMateri: string;
}

export default function KuisAiInteractive({ soalList, judulMateri }: KuisAiInteractiveProps) {
  // Modes: "interactive" (Satu per satu / CBT) vs "all" (Lembar Soal Lengkap)
  const [viewMode, setViewMode] = useState<"interactive" | "all">("interactive");

  // Quiz States
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showPembahasan, setShowPembahasan] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.getIsMuted());

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isSubmitted]);

  // Reset quiz
  const handleResetKuis = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowPembahasan(false);
    setActiveQuestionIdx(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  // Select an option for a question
  const handleSelectAnswer = (soalNomor: number, pilihanIdx: number) => {
    SoundEngine.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [soalNomor]: pilihanIdx
    }));
  };

  // Submit the quiz
  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    SoundEngine.playFanfare();
  };

  // Score calculations
  const totalScore = soalList.reduce((acc, soal) => {
    if (userAnswers[soal.nomor] === soal.jawabanBenar) {
      return acc + (soal.skor || 10);
    }
    return acc;
  }, 0);

  const maxScore = soalList.reduce((acc, s) => acc + (s.skor || 10), 0);
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = soalList.filter((s) => userAnswers[s.nomor] === s.jawabanBenar).length;
  const scorePercentage = Math.round((totalScore / (maxScore || 100)) * 100);

  const currentSoal = soalList[activeQuestionIdx] || soalList[0];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopySoal = () => {
    const text = soalList
      .map((s, idx) => {
        const pilihanStr = s.pilihan.map((p, pIdx) => `  ${String.fromCharCode(65 + pIdx)}. ${p}`).join("\n");
        return `Soal ${idx + 1} (${s.tingkat}):\n${s.pertanyaan}\n${pilihanStr}\nKunci: ${String.fromCharCode(
          65 + s.jawabanBenar
        )}\nPembahasan: ${s.pembahasan}\n`;
      })
      .join("\n---------------------------\n\n");

    navigator.clipboard.writeText(`KUIS PEMBELAJARAN PAI: ${judulMateri}\n\n${text}`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-inner">
              📝 Kuis Interaktif AI SIPAILMS • {soalList.length} Soal
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{judulMateri}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Dapat langsung dikerjakan siswa dengan mode CBT simulator atau dicetak sebagai lembar ujian kertas.
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("interactive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "interactive"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mode Interaktif CBT</span>
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "all"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Semua Soal</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isMuted
                ? "bg-red-950 text-red-300 border-red-800/60"
                : "bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700"
            }`}
            title={isMuted ? "Suara Efek Mati" : "Suara Efek Aktif"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Salin & Cetak */}
          <button
            onClick={handleCopySoal}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Salin Naskah Soal & Kunci"
          >
            {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition cursor-pointer"
            title="Cetak Soal ke Kertas"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetKuis}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Ulangi Kuis"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Live Score Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Waktu</span>
            <span className="text-base font-mono font-black text-white">{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
            {answeredCount}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Dijawab</span>
            <span className="text-sm font-black text-white">
              {answeredCount} / {soalList.length} Soal
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Nilai Perolehan</span>
            <span className="text-base font-black text-amber-400">
              {totalScore} <span className="text-xs text-slate-500 font-normal">/ {maxScore}</span>
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
              <span>Ketuntasan</span>
              <span className="text-emerald-400">{Math.round((answeredCount / soalList.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / soalList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FINAL SCORECARD MODAL (When Submitted) */}
      {isSubmitted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-amber-400 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-400/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Laporan Evaluasi Pembelajaran Siswa
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {scorePercentage >= 75 ? "Mumtaz! Lulus Sangat Baik!" : "Alhamdulillah, Tetap Semangat!"}
            </h4>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Nilai Akhir</span>
                <span className="text-2xl font-black text-amber-400">{totalScore}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Benar</span>
                <span className="text-2xl font-black text-emerald-400">{correctCount}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Salah</span>
                <span className="text-2xl font-black text-red-400">{soalList.length - correctCount}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Waktu</span>
                <span className="text-2xl font-black text-blue-400 font-mono">{formatTimer(timerSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPembahasan(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Lihat Kunci & Pembahasan
            </button>
            <button
              onClick={handleResetKuis}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-slate-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Kuis
            </button>
          </div>
        </div>
      )}

      {/* MODE 1: INTERACTIVE CBT (ONE QUESTION AT A TIME) */}
      {viewMode === "interactive" && currentSoal && (
        <div className="space-y-6">
          {/* Question Nav Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {soalList.map((s, idx) => {
              const isAnswered = userAnswers[s.nomor] !== undefined;
              const isActive = activeQuestionIdx === idx;
              const isCorrect = isAnswered && userAnswers[s.nomor] === s.jawabanBenar;

              return (
                <button
                  key={s.nomor}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-black text-xs shrink-0 transition flex items-center justify-center border cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-md scale-105"
                      : isSubmitted
                      ? isCorrect
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : "bg-red-950 text-red-300 border-red-800"
                      : isAnswered
                      ? "bg-emerald-900/60 text-emerald-200 border-emerald-700/80"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
            {/* Header Soal */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 font-black text-sm flex items-center justify-center border border-slate-700">
                  {activeQuestionIdx + 1}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    currentSoal.tingkat === "Mudah"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : currentSoal.tingkat === "Sedang"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-red-950 text-red-300 border-red-800"
                  }`}
                >
                  Tingkat {currentSoal.tingkat} • {currentSoal.skor || 10} Poin
                </span>
              </div>

              {userAnswers[currentSoal.nomor] !== undefined && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Sudah Dijawab
                </span>
              )}
            </div>

            {/* Question Text */}
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentSoal.pertanyaan}
            </p>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentSoal.pilihan.map((pilihanText, pIdx) => {
                const letter = String.fromCharCode(65 + pIdx);
                const isChosen = userAnswers[currentSoal.nomor] === pIdx;
                const isRightOption = pIdx === currentSoal.jawabanBenar;

                let optionClass = "bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700";

                if (isSubmitted || showPembahasan) {
                  if (isRightOption) {
                    optionClass = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold ring-2 ring-emerald-500/50 shadow-md";
                  } else if (isChosen && !isRightOption) {
                    optionClass = "bg-red-950 border-red-600 text-red-200 ring-2 ring-red-600/50";
                  }
                } else if (isChosen) {
                  optionClass = "bg-amber-400 text-slate-950 font-black border-amber-300 ring-4 ring-amber-400/40 shadow-xl scale-[1.01]";
                }

                return (
                  <button
                    key={pIdx}
                    onClick={() => handleSelectAnswer(currentSoal.nomor, pIdx)}
                    className={`w-full text-left p-4 rounded-2xl text-sm transition-all border flex items-start gap-3.5 cursor-pointer ${optionClass}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border ${
                        isChosen && !isSubmitted
                          ? "bg-slate-950 text-amber-400 border-slate-900"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="leading-relaxed pt-0.5">{pilihanText}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Discussion (if submitted or revealed) */}
            {(isSubmitted || showPembahasan) && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 text-xs sm:text-sm space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Kunci Jawaban: Pilihan {String.fromCharCode(65 + currentSoal.jawabanBenar)}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-100">Pembahasan Berdalil: </strong>
                  {currentSoal.pembahasan}
                </p>
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))}
                disabled={activeQuestionIdx === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
              </button>

              {activeQuestionIdx < soalList.length - 1 ? (
                <button
                  onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  Soal Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Selesaikan Kuis
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: SEMUA SOAL SEKALIGUS (LEMBAR SOAL LENGKAP) */}
      {viewMode === "all" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400">
              Menampilkan {soalList.length} Butir Soal Lengkap:
            </span>
            <button
              onClick={() => setShowPembahasan(!showPembahasan)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                showPembahasan
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              {showPembahasan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPembahasan ? "Sembunyikan Pembahasan" : "Tampilkan Semua Pembahasan"}</span>
            </button>
          </div>

          <div className="space-y-5">
            {soalList.map((soal, idx) => {
              const userAnswer = userAnswers[soal.nomor];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = isAnswered && userAnswer === soal.jawabanBenar;

              return (
                <div
                  key={soal.nomor}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Level {soal.tingkat}</span>
                    </div>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCorrect ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"
                        }`}
                      >
                        {isCorrect ? "Benar" : "Salah"}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-bold text-white">{soal.pertanyaan}</p>

                  <div className="grid grid-cols-1 gap-2">
                    {soal.pilihan.map((p, pIdx) => {
                      const letter = String.fromCharCode(65 + pIdx);
                      const isChosen = userAnswer === pIdx;
                      const isRightOption = pIdx === soal.jawabanBenar;

                      let optClass = "bg-slate-900 border-slate-800 text-slate-300";
                      if (showPembahasan) {
                        if (isRightOption) optClass = "bg-emerald-950 border-emerald-600 text-emerald-200 font-bold";
                        else if (isChosen && !isRightOption) optClass = "bg-red-950 border-red-700 text-red-200";
                      } else if (isChosen) {
                        optClass = "bg-amber-400 text-slate-950 font-black border-amber-300";
                      }

                      return (
                        <button
                          key={pIdx}
                          onClick={() => handleSelectAnswer(soal.nomor, pIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm border flex items-center gap-2.5 transition cursor-pointer ${optClass}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-slate-800 font-bold text-xs flex items-center justify-center shrink-0 text-inherit">
                            {letter}
                          </span>
                          <span>{p}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showPembahasan && (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-400/30 text-xs text-slate-300 space-y-1">
                      <strong className="text-amber-400">Pembahasan: </strong>
                      {soal.pembahasan}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
