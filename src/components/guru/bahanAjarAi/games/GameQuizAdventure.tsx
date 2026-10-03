/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  Coins,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  ChevronRight,
  Award,
  Clock,
  Compass
} from "lucide-react";
import { GameQuizAdventureData } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameQuizAdventureProps {
  gameData: GameQuizAdventureData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameQuizAdventure({ gameData, onFinishGame }: GameQuizAdventureProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());

  const currentQ = gameData.daftarSoal[currentIdx] || gameData.daftarSoal[0];

  const handleToggleSound = () => {
    const nextMute = soundFx.toggleMute();
    setSoundMuted(nextMute);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || lives <= 0) return;
    soundFx.playClick();
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === currentQ.jawabanBenar) {
      soundFx.playCorrect();
      setScore((prev) => prev + currentQ.poin);
      setCoins((prev) => prev + currentQ.koinBonus);
    } else {
      soundFx.playWrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setIsGameOver(true);
      }
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    setSelectedOption(null);
    setShowExplanation(false);
    setShowHint(false);

    if (currentIdx < gameData.daftarSoal.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      soundFx.playVictory();
      setIsGameWon(true);
      onFinishGame(score + 20, coins, "🏆 Penjelajah Bintang PAI");
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setScore(0);
    setCoins(0);
    setLives(3);
    setSelectedOption(null);
    setShowExplanation(false);
    setShowHint(false);
    setIsGameOver(false);
    setIsGameWon(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top HUD: Level, Lives, Coins, Score, Sound */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-teal-800 flex items-center justify-center text-sm font-black text-amber-300">
            {gameData.karakter.avatarIcon}
          </span>
          <div>
            <span className="text-[10px] font-mono text-teal-300 block">LEVEL {currentQ.level}</span>
            <span className="text-xs font-black text-white">{currentQ.visualLabel}</span>
          </div>
        </div>

        {/* Lives & Coins & Score */}
        <div className="flex items-center gap-3">
          {/* Nyawa */}
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? "fill-red-500 text-red-500 animate-pulse" : "text-slate-600"}`}
              />
            ))}
          </div>

          {/* Koin */}
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl text-amber-300 text-xs font-black">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{coins}</span>
          </div>

          {/* Skor */}
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl text-emerald-300 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{score} Pts</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
            title={soundMuted ? "Suara nonaktif" : "Suara aktif"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
          </button>
        </div>
      </div>

      {/* Progress Map Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            Jalur Petualangan ({currentIdx + 1}/{gameData.daftarSoal.length})
          </span>
          <span>Progres: {Math.round(((currentIdx + 1) / gameData.daftarSoal.length) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / gameData.daftarSoal.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Active Game Arena */}
      {!isGameOver && !isGameWon ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Visual Scene Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-blue-900 to-slate-950 text-white p-6 sm:p-7 shadow-lg border border-teal-700/60 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl mx-auto shadow-inner">
              {currentQ.visualIcon}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest block">
                Tantangan Level {currentQ.level} • {currentQ.visualLabel}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white max-w-xl mx-auto leading-relaxed">
                "{currentQ.pertanyaan}"
              </h3>
            </div>
          </div>

          {/* Hint Trigger */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? "Tutup Petunjuk" : "💡 Butuh Petunjuk?"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium animate-fadeIn">
              💡 <strong>Petunjuk Edukasi:</strong> {currentQ.petunjukHint}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.pilihan.map((opt, idx) => {
              const hasSelected = selectedOption !== null;
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.jawabanBenar;

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
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-3 shadow-2xs cursor-pointer ${style}`}
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

          {/* Feedback & Explanation Card */}
          {showExplanation && (
            <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between font-black">
                <span className={selectedOption === currentQ.jawabanBenar ? "text-emerald-700" : "text-rose-700"}>
                  {selectedOption === currentQ.jawabanBenar ? "🎉 Tepat Sekali! +10 Poin, +5 Koin" : "💡 Belum Tepat! Pelajari Hikmahnya:"}
                </span>
                <span className="text-[10px] text-slate-500">Penjelasan Syariat</span>
              </div>
              <p className="leading-relaxed text-slate-800">
                {currentQ.penjelasanEdukasi}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <span>{currentIdx < gameData.daftarSoal.length - 1 ? "Lanjut Misi Berikutnya" : "Lihat Hasil Akhir"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : isGameOver ? (
        /* Game Over Card */
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
            💔
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-rose-950">Nyawa Petualang Habis!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Jangan putus asa, kegagalan adalah guru terbaik. Luruskan niat dan pelajari kembali materinya.
            </p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-rose-200 inline-block font-mono text-xs">
            Skor Diperoleh: <strong>{score} Pts</strong> • Koin: <strong>{coins}</strong>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Coba Ulang Petualangan
            </button>
          </div>
        </div>
      ) : (
        /* Victory Card */
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏆
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              PETUALANGAN SELESAI
            </span>
            <h3 className="text-2xl font-black text-slate-900">MasyaAllah! Misi Berhasil</h3>
            <p className="text-xs text-slate-600">
              Kamu berhasil menuntaskan seluruh 4 level tantangan dengan gemilang!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-center">
            <div className="p-3 bg-white rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Skor</span>
              <span className="text-2xl font-black text-emerald-700">{score}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Koin</span>
              <span className="text-2xl font-black text-amber-500">+{coins} 🪙</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Mainkan Ulang
          </button>
        </div>
      )}
    </div>
  );
}
