/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  Eye,
  Award
} from "lucide-react";
import { GameTebakGambarData } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameTebakGambarProps {
  gameData: GameTebakGambarData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameTebakGambar({ gameData, onFinishGame }: GameTebakGambarProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = gameData.daftarSoal[currentIdx] || gameData.daftarSoal[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    soundFx.playClick();
    setSelectedOpt(idx);
    setShowExplanation(true);

    if (idx === currentItem.jawabanBenar) {
      soundFx.playCorrect();
      setScore((prev) => prev + 30);
    } else {
      soundFx.playWrong();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    setSelectedOpt(null);
    setShowExplanation(false);
    setShowHint(false);

    if (currentIdx < gameData.daftarSoal.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      soundFx.playVictory();
      setIsCompleted(true);
      onFinishGame(score + 30, 25, "👁️ Pengamat Cermat PAI");
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setShowHint(false);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-800 flex items-center justify-center text-amber-300 font-black text-sm">
            🖼️
          </div>
          <div>
            <span className="text-[10px] font-mono text-indigo-300 block uppercase">
              Tantangan {currentIdx + 1} dari {gameData.daftarSoal.length}
            </span>
            <span className="text-xs font-black text-white">{gameData.judul}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-xl">
            {score} Poin
          </span>
          <button
            onClick={() => setSoundMuted(soundFx.toggleMute())}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Visual Scene Display Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-700/60 shadow-lg text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl mx-auto shadow-inner">
              {currentItem.ilustrasiIcon}
            </div>
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-indigo-500/50 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
                {currentItem.judulVisual}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium italic max-w-md mx-auto">
                "{currentItem.deskripsiAdegan}"
              </p>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">
              Pertanyaan Visual
            </span>
            <h3 className="text-base font-black text-slate-900">
              {currentItem.pertanyaan}
            </h3>
          </div>

          {/* Hint button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? "Tutup Petunjuk" : "💡 Butuh Petunjuk Gambar?"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
              💡 <strong>Petunjuk:</strong> {currentItem.petunjukHint}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.pilihan.map((opt, idx) => {
              const hasSelected = selectedOpt !== null;
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentItem.jawabanBenar;

              let style = "bg-white hover:bg-slate-50 border-slate-200 text-slate-800";
              if (hasSelected) {
                if (isCorrect) {
                  style = "bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400";
                } else if (isSelected) {
                  style = "bg-rose-100 border-rose-500 text-rose-950 font-black";
                } else {
                  style = "opacity-50 bg-slate-50 border-slate-200 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSelected}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between shadow-2xs cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs shrink-0 text-slate-700">
                      {["A", "B", "C", "D"][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {hasSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {hasSelected && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showExplanation && (
            <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-3 animate-fadeIn">
              <span className={`block font-black text-sm ${selectedOpt === currentItem.jawabanBenar ? "text-emerald-700" : "text-rose-700"}`}>
                {selectedOpt === currentItem.jawabanBenar ? "🎉 BENAR! Pengamatanmu Sangat Tajam" : "💡 COBA LAGI! Cermati Uraian Berikut:"}
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {currentItem.penjelasan}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <span>{currentIdx < gameData.daftarSoal.length - 1 ? "Soal Gambar Berikutnya" : "Lihat Hasil Akhir"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🌟
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">
              Alhamdulillah! Seluruh Gambar Berhasil Ditebak
            </h3>
            <p className="text-xs text-slate-600">
              Skor Perolehan Tebak Gambar: {score} Poin
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Mainkan Ulang
          </button>
        </div>
      )}
    </div>
  );
}
