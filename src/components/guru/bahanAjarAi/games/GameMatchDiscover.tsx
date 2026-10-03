/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  RotateCcw,
  Clock,
  Star,
  Award,
  Volume2,
  VolumeX,
  Layers,
  HelpCircle
} from "lucide-react";
import { GameMatchDiscoverData } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameMatchDiscoverProps {
  gameData: GameMatchDiscoverData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameMatchDiscover({ gameData, onFinishGame }: GameMatchDiscoverProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundFx.playClick();
    setSelectedLeft(id);
  };

  const handleSelectRight = (pairId: string) => {
    if (matchedIds.includes(pairId) || !selectedLeft) return;

    if (selectedLeft === pairId) {
      soundFx.playCorrect();
      const nextMatched = [...matchedIds, pairId];
      setMatchedIds(nextMatched);
      setScore((prev) => prev + 25);
      setSelectedLeft(null);

      if (nextMatched.length === gameData.pairs.length) {
        soundFx.playVictory();
        setIsCompleted(true);
        onFinishGame(score + 25, 20, "🧩 Master Pencocok Visual PAI");
      }
    } else {
      soundFx.playWrong();
      setSelectedLeft(null);
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setSelectedLeft(null);
    setMatchedIds([]);
    setScore(0);
    setSeconds(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top HUD */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-800 flex items-center justify-center text-amber-300 font-black text-sm">
            🧩
          </div>
          <div>
            <span className="text-[10px] font-mono text-teal-300 block uppercase">
              {gameData.jenisPasangan}
            </span>
            <span className="text-xs font-black text-white">{gameData.judul}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl text-amber-300 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{score} Pts</span>
          </div>

          <button
            onClick={() => setSoundMuted(soundFx.toggleMute())}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 font-bold text-center">
        👉 Klik salah satu kartu di kolom KIRI, lalu klik kartu makna yang selaras di kolom KANAN!
      </div>

      {/* 2 Columns Cards Arena */}
      {!isCompleted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kolom Kiri: Visual / Istilah */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 block text-center">
              KARTU VISUAL / KONSEP
            </span>
            <div className="space-y-2.5">
              {gameData.pairs.map((p) => {
                const isMatched = matchedIds.includes(p.id);
                const isSelected = selectedLeft === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectLeft(p.id)}
                    disabled={isMatched}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between shadow-xs cursor-pointer ${
                      isMatched
                        ? "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60"
                        : isSelected
                        ? "bg-teal-700 text-white border-teal-800 shadow-md ring-4 ring-teal-300 transform scale-[1.02]"
                        : "bg-white hover:bg-teal-50/70 text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-100">{p.kiri.icon}</span>
                      <div>
                        <span className="block text-sm font-black">{p.kiri.label}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{p.kiri.kategori}</span>
                      </div>
                    </div>
                    {isMatched && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Makna / Terjemahan */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 block text-center">
              KARTU MAKNA & PENJELASAN
            </span>
            <div className="space-y-2.5">
              {gameData.pairs.map((p) => {
                const isMatched = matchedIds.includes(p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectRight(p.id)}
                    disabled={isMatched}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between shadow-xs cursor-pointer ${
                      isMatched
                        ? "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60"
                        : "bg-white hover:bg-indigo-50/70 text-slate-800 border-slate-200"
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-bold text-slate-900">{p.kanan.label}</span>
                      <p className="text-xs text-slate-600 mt-0.5">{p.kanan.makna}</p>
                    </div>
                    {isMatched && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 rounded-3xl bg-teal-50 border border-teal-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🎉
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Hebat! Seluruh Pasangan Kartu Terbuka!
            </h3>
            <p className="text-xs text-slate-600">
              Kamu berhasil menuntaskan permainan dalam waktu {Math.floor(seconds / 60)} menit {seconds % 60} detik.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-teal-200 inline-block font-mono text-sm text-teal-900 font-bold">
            Total Skor: {score} Poin ⭐
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Mainkan Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
