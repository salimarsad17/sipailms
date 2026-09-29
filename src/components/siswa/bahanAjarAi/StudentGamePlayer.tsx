/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Gamepad2, Heart, Clock, Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { GameEdukasiItem } from "../../../types/bahanAjarAi";

interface StudentGamePlayerProps {
  game: GameEdukasiItem;
  onFinish: (score: number) => void;
  onClose: () => void;
}

export default function StudentGamePlayer({ game, onFinish, onClose }: StudentGamePlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [lives, setLives] = useState(game.jumlahNyawa);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.waktuPerSoalDetik);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = game.soalList[currentIdx];

  useEffect(() => {
    if (isAnswerChecked || isGameOver || isFinished) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswerChecked, isGameOver, isFinished]);

  const handleTimeOut = () => {
    setIsAnswerChecked(true);
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setIsGameOver(true);
      }
      return nextLives;
    });
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentQ.jawabanBenar;
    if (isCorrect) {
      setScore((prev) => prev + currentQ.poin);
    } else {
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < game.soalList.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setTimeLeft(game.waktuPerSoalDetik);
    } else {
      setIsFinished(true);
      const totalPossible = game.soalList.reduce((acc, q) => acc + q.poin, 0);
      const finalPercentage = Math.round((score / (totalPossible || 1)) * 100);
      onFinish(finalPercentage);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setLives(game.jumlahNyawa);
    setScore(0);
    setTimeLeft(game.waktuPerSoalDetik);
    setIsGameOver(false);
    setIsFinished(false);
  };

  const totalPossibleScore = game.soalList.reduce((acc, q) => acc + q.poin, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white truncate max-w-[280px] sm:max-w-md">{game.judul}</h3>
              <p className="text-[11px] text-amber-300/80">
                Soal {currentIdx + 1} dari {game.soalList.length} • {game.tipeGame}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: game.jumlahNyawa }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition ${
                    i < lives ? "fill-rose-500 text-rose-500" : "fill-slate-700 text-slate-700 opacity-40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {isGameOver ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center text-3xl font-black">
                💔
              </div>
              <h4 className="text-xl font-black text-white">Game Over! Nyawa Habis</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Jangan berkecil hati. Kamu bisa mengulang kembali kuis untuk memperkuat pemahaman materi PAI ini.
              </p>
              <div className="bg-slate-800/80 rounded-2xl p-4 max-w-xs mx-auto text-amber-300 font-extrabold text-sm">
                Skor yang Dikumpulkan: {score} Poin
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Main Ulang
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          ) : isFinished ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="text-xl font-black text-white">Selamat! Game Selesai</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Kamu telah menuntaskan seluruh tantangan kuis ini dengan sangat baik.
              </p>
              <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-emerald-500/20 rounded-2xl p-5 max-w-sm mx-auto border border-amber-500/30">
                <div className="text-xs text-slate-300 mb-1">Skor Akhir Kamu:</div>
                <div className="text-3xl font-black text-amber-300">
                  {score} / {totalPossibleScore}
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  Nilai: {Math.round((score / (totalPossibleScore || 1)) * 100)} (Selesai Tercatat)
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs transition shadow-md"
                >
                  Selesai &amp; Simpan
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Timer Bar */}
              <div className="flex items-center justify-between gap-3 text-xs mb-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Waktu: {timeLeft} detik</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Skor: {score} Poin</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft > 10 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${(timeLeft / game.waktuPerSoalDetik) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Pertanyaan #{currentIdx + 1}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-1 leading-relaxed">
                  {currentQ.pertanyaan}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.pilihan.map((opsi, idx) => {
                  let btnColor = "bg-slate-800/60 border-slate-700 text-slate-200 hover:border-amber-400/60";
                  if (selectedOption === idx) {
                    btnColor = "bg-amber-500/20 border-amber-400 text-white font-bold";
                  }
                  if (isAnswerChecked) {
                    if (idx === currentQ.jawabanBenar) {
                      btnColor = "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-extrabold";
                    } else if (selectedOption === idx) {
                      btnColor = "bg-rose-500/25 border-rose-400 text-rose-200 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer text-xs sm:text-sm ${btnColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opsi}</span>
                      </div>
                      {isAnswerChecked && idx === currentQ.jawabanBenar && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerChecked && selectedOption === idx && idx !== currentQ.jawabanBenar && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when checked */}
              {isAnswerChecked && (
                <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs space-y-1 animate-fadeIn">
                  <div className="font-extrabold text-amber-300">Pembahasan Soal:</div>
                  <p className="text-slate-300 leading-relaxed">{currentQ.pembahasan}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Action Bar */}
        {!isGameOver && !isFinished && (
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isAnswerChecked ? (
                selectedOption === currentQ.jawabanBenar ? (
                  <span className="text-emerald-400 font-bold">Jawaban Benar! (+{currentQ.poin} Poin)</span>
                ) : (
                  <span className="text-rose-400 font-bold">Jawaban Kurang Tepat (-1 Nyawa)</span>
                )
              ) : (
                "Pilih jawaban lalu tekan tombol 'Periksa'"
              )}
            </span>

            {!isAnswerChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <span>{currentIdx + 1 < game.soalList.length ? "Soal Berikutnya" : "Lihat Hasil"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
