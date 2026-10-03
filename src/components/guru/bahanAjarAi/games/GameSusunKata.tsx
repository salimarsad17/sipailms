/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  Volume2,
  VolumeX,
  Shuffle
} from "lucide-react";
import { GameSusunKataData } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameSusunKataProps {
  gameData: GameSusunKataData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameSusunKata({ gameData, onFinishGame }: GameSusunKataProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>(() => [
    ...(gameData.daftarKata[0]?.hurufAcak || [])
  ]);
  const [showHint, setShowHint] = useState(false);
  const [isWordCorrect, setIsWordCorrect] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = gameData.daftarKata[currentIdx] || gameData.daftarKata[0];

  const handlePickLetter = (char: string, indexInAvailable: number) => {
    soundFx.playClick();
    const nextUser = [...userLetters, char];
    setUserLetters(nextUser);

    const nextAvail = [...availableLetters];
    nextAvail.splice(indexInAvailable, 1);
    setAvailableLetters(nextAvail);

    // Check if word complete
    if (nextUser.join("") === currentItem.kataAsli) {
      soundFx.playCorrect();
      setIsWordCorrect(true);
      setScore((s) => s + 20);
    } else if (nextUser.length === currentItem.kataAsli.length) {
      soundFx.playWrong();
    }
  };

  const handleRemoveLetter = (char: string, indexInUser: number) => {
    soundFx.playClick();
    const nextUser = [...userLetters];
    nextUser.splice(indexInUser, 1);
    setUserLetters(nextUser);
    setAvailableLetters((prev) => [...prev, char]);
    setIsWordCorrect(false);
  };

  const handleResetCurrentWord = () => {
    soundFx.playClick();
    setUserLetters([]);
    setAvailableLetters([...currentItem.hurufAcak]);
    setIsWordCorrect(false);
  };

  const handleNextWord = () => {
    soundFx.playClick();
    if (currentIdx < gameData.daftarKata.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setUserLetters([]);
      setAvailableLetters([...gameData.daftarKata[nextIdx].hurufAcak]);
      setIsWordCorrect(false);
      setShowHint(false);
    } else {
      soundFx.playVictory();
      setIsCompleted(true);
      onFinishGame(score + 20, 20, "🔤 Penata Huruf PAI");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-slate-950 font-black text-sm">
            🔤
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-300 block uppercase">
              Kata {currentIdx + 1} dari {gameData.daftarKata.length}
            </span>
            <span className="text-xs font-black text-white">{gameData.judul}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-xl">
            {score} Pts
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
        <div className="space-y-6 animate-fadeIn">
          {/* Petunjuk Kartu */}
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
              Kategori: {currentItem.kategori}
            </span>
            <p className="text-sm font-bold text-amber-950">
              "{currentItem.petunjukMateri}"
            </p>
          </div>

          {/* User Assembled Slots */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">
              Susunan Kata Anda (Klik huruf untuk membatalkan):
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 min-h-[56px] p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
              {userLetters.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Klik ubin huruf di bawah untuk menyusun kata...</span>
              ) : (
                userLetters.map((char, uIdx) => (
                  <button
                    key={uIdx}
                    onClick={() => handleRemoveLetter(char, uIdx)}
                    className="w-11 h-11 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-lg shadow-md transition transform hover:scale-105 cursor-pointer flex items-center justify-center"
                  >
                    {char}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Scrambled Available Letters */}
          <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Pilihan Huruf Acak:
              </span>
              <button
                onClick={handleResetCurrentWord}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Ubin</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableLetters.map((char, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => handlePickLetter(char, aIdx)}
                  className="w-12 h-12 rounded-2xl bg-white hover:bg-amber-100 text-slate-900 border border-slate-300 hover:border-amber-400 font-black text-xl shadow-xs transition transform hover:scale-110 cursor-pointer flex items-center justify-center"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Success / Next Button */}
          {isWordCorrect && (
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>BENAR! Kata yang terbentuk: "{currentItem.kataAsli}" (+20 Poin)</span>
              </div>
              <p className="text-xs text-emerald-700">
                Makna: {currentItem.artiKata}
              </p>
              <button
                onClick={handleNextWord}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                {currentIdx < gameData.daftarKata.length - 1 ? "Kata Berikutnya" : "Lihat Hasil Akhir"}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔤
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">
              Hebat! Seluruh Kata PAI Berhasil Disusun
            </h3>
            <p className="text-xs text-slate-600">Total Skor: {score} Poin</p>
          </div>
          <button
            onClick={() => {
              setCurrentIdx(0);
              setScore(0);
              setUserLetters([]);
              setAvailableLetters([...gameData.daftarKata[0].hurufAcak]);
              setIsWordCorrect(false);
              setIsCompleted(false);
            }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Mainkan Ulang
          </button>
        </div>
      )}
    </div>
  );
}
