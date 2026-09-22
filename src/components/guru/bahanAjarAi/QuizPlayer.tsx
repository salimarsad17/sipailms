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
  RotateCcw,
  Timer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Bookmark,
  FileCheck
} from "lucide-react";
import { SoalKuisAi } from "../../../types/bahanAjarAi";
import { SoundEngine } from "./audioSynth";

export interface QuizPlayerProps {
  soalList: SoalKuisAi[];
  judulMateri: string;
  onQuizComplete?: (finalScore: number, totalQuestions: number) => void;
}

export default function QuizPlayer({ soalList, judulMateri, onQuizComplete }: QuizPlayerProps) {
  // Self-Contained Quiz State
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showExplanations, setShowExplanations] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.getIsMuted());

  // Score tracking storage key
  const storageKey = `quiz_player_high_score_${judulMateri.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const [savedBestScore, setSavedBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && !isFinished) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isFinished]);

  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  const handleSelectOption = (soalNomor: number, optionIdx: number) => {
    SoundEngine.playClick();
    setAnswers((prev) => ({
      ...prev,
      [soalNomor]: optionIdx
    }));
  };

  const handleToggleFlag = (soalNomor: number) => {
    setFlagged((prev) => ({
      ...prev,
      [soalNomor]: !prev[soalNomor]
    }));
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    setIsTimerActive(false);
    SoundEngine.playFanfare();

    const final = calculateScore();
    if (final > savedBestScore) {
      setSavedBestScore(final);
      try {
        localStorage.setItem(storageKey, final.toString());
      } catch (e) {
        // ignore
      }
    }
    if (onQuizComplete) {
      onQuizComplete(final, soalList.length);
    }
  };

  const handleRestartQuiz = () => {
    setAnswers({});
    setFlagged({});
    setIsFinished(false);
    setShowExplanations(false);
    setCurrentIdx(0);
    setTimerSeconds(0);
    setIsTimerActive(true);
  };

  // Calculations
  const calculateScore = () => {
    return soalList.reduce((acc, soal) => {
      if (answers[soal.nomor] === soal.jawabanBenar) {
        return acc + (soal.skor || 10);
      }
      return acc;
    }, 0);
  };

  const totalScore = calculateScore();
  const maxScore = soalList.reduce((acc, s) => acc + (s.skor || 10), 0);
  const correctCount = soalList.filter((s) => answers[s.nomor] === s.jawabanBenar).length;
  const answeredCount = Object.keys(answers).length;
  const activeSoal = soalList[currentIdx] || soalList[0];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-inner">
              ⚡ QuizPlayer • Dedicated CBT Simulator
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{judulMateri}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Simulator Asesmen CBT Mandiri • {soalList.length} Soal Pilihan Ganda PAI
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isMuted
                ? "bg-red-950 text-red-300 border-red-800"
                : "bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700"
            }`}
            title={isMuted ? "Suara Efek Mati" : "Suara Efek Aktif"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRestartQuiz}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Ulangi Kuis"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <Timer className="w-5 h-5 text-blue-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Durasi</span>
            <span className="text-base font-mono font-black text-white">{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Progres Terjawab</span>
            <span className="text-base font-black text-emerald-400">
              {answeredCount} / {soalList.length}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Saat Ini</span>
            <span className="text-base font-black text-amber-400">
              {totalScore} / {maxScore}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Rekor Tertinggi</span>
            <span className="text-base font-black text-purple-400">{savedBestScore} Pts</span>
          </div>
        </div>
      </div>

      {/* Finished Summary Scorecard */}
      {isFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-amber-400 text-center space-y-5 shadow-2xl animate-fade-in">
          <Trophy className="w-14 h-14 text-amber-400 mx-auto" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Hasil Asesmen Pembelajaran Siswa
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Skor Akhir: {totalScore} dari {maxScore} ({Math.round((totalScore / maxScore) * 100)}%)
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Benar: <strong className="text-emerald-400">{correctCount}</strong> • Salah:{" "}
              <strong className="text-red-400">{soalList.length - correctCount}</strong> • Waktu:{" "}
              <strong className="text-blue-400">{formatTimer(timerSeconds)}</strong>
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> {showExplanations ? "Tutup Pembahasan" : "Lihat Pembahasan Lengkap"}
            </button>
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-slate-700"
            >
              Ulangi Asesmen
            </button>
          </div>
        </div>
      ) : null}

      {/* CBT Question Display */}
      {activeSoal && (
        <div className="space-y-6">
          {/* Question Nav Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {soalList.map((s, idx) => {
              const isAnswered = answers[s.nomor] !== undefined;
              const isFlagged = flagged[s.nomor];
              const isActive = currentIdx === idx;

              return (
                <button
                  key={s.nomor}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-black text-xs shrink-0 transition flex items-center justify-center border relative cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-md scale-105"
                      : isFlagged
                      ? "bg-amber-950 text-amber-300 border-amber-600"
                      : isAnswered
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 font-black text-sm flex items-center justify-center border border-slate-700">
                  {currentIdx + 1}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Tingkat: <strong className="text-amber-400">{activeSoal.tingkat}</strong> • Bobot:{" "}
                  <strong className="text-emerald-400">{activeSoal.skor || 10} Poin</strong>
                </span>
              </div>

              <button
                onClick={() => handleToggleFlag(activeSoal.nomor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  flagged[activeSoal.nomor]
                    ? "bg-amber-400 text-slate-950 border-amber-300 font-black"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flagged[activeSoal.nomor] ? "Ragu-ragu (Ditandai)" : "Tandai Ragu-ragu"}</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {activeSoal.pertanyaan}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {activeSoal.pilihan.map((pilihanText, pIdx) => {
                const letter = String.fromCharCode(65 + pIdx);
                const isSelected = answers[activeSoal.nomor] === pIdx;
                const isRightOption = pIdx === activeSoal.jawabanBenar;

                let btnClass = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700";

                if (isFinished || showExplanations) {
                  if (isRightOption) {
                    btnClass = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold ring-2 ring-emerald-500/50";
                  } else if (isSelected && !isRightOption) {
                    btnClass = "bg-red-950 border-red-600 text-red-200 ring-2 ring-red-600/50";
                  }
                } else if (isSelected) {
                  btnClass = "bg-amber-400 text-slate-950 font-black border-amber-300 ring-4 ring-amber-400/40 shadow-xl scale-[1.01]";
                }

                return (
                  <button
                    key={pIdx}
                    onClick={() => handleSelectOption(activeSoal.nomor, pIdx)}
                    className={`w-full text-left p-4 rounded-2xl text-sm transition-all border flex items-start gap-3.5 cursor-pointer ${btnClass}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border ${
                        isSelected && !isFinished
                          ? "bg-slate-950 text-amber-400 border-slate-900"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{pilihanText}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Discussion */}
            {(isFinished || showExplanations) && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 text-xs sm:text-sm space-y-1.5 animate-fade-in">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Kunci Jawaban: {String.fromCharCode(65 + activeSoal.jawabanBenar)}
                </span>
                <p className="text-slate-300 leading-relaxed">{activeSoal.pembahasan}</p>
              </div>
            )}

            {/* Nav controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>

              {currentIdx < soalList.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                !isFinished && (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Selesaikan Ujian
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
