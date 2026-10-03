/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Layers,
  Award
} from "lucide-react";
import { GameMemoryCardData, MemoryCardPair } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameMemoryCardProps {
  gameData: GameMemoryCardData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameMemoryCard({ gameData, onFinishGame }: GameMemoryCardProps) {
  // Shuffle cards
  const [shuffledCards, setShuffledCards] = useState<MemoryCardPair[]>(() => {
    return [...gameData.cards].sort(() => Math.random() - 0.5);
  });

  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx)) return;
    const card = shuffledCards[idx];
    if (matchedPairIds.includes(card.pairId)) return;

    soundFx.playClick();
    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = shuffledCards[nextFlipped[0]];
      const card2 = shuffledCards[nextFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // Matched!
        setTimeout(() => {
          soundFx.playCorrect();
          const nextMatched = [...matchedPairIds, card1.pairId];
          setMatchedPairIds(nextMatched);
          setScore((s) => s + 25);
          setFlippedIndices([]);

          // Check if all pairs matched
          const totalPairs = gameData.cards.length / 2;
          if (nextMatched.length >= totalPairs) {
            soundFx.playVictory();
            setIsCompleted(true);
            onFinishGame(score + 25, 20, "🧠 Memori Cerdas PAI");
          }
        }, 500);
      } else {
        // Mismatch - flip back
        setTimeout(() => {
          soundFx.playWrong();
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setShuffledCards([...gameData.cards].sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMoves(0);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-800 flex items-center justify-center text-amber-300 font-black text-sm">
            🎴
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-300 block uppercase">
              Permainan Kartu Memori
            </span>
            <span className="text-xs font-black text-white">{gameData.judul}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-300 bg-white/10 px-2.5 py-1 rounded-xl">
            Langkah: {moves}
          </span>
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
        <div className="space-y-4 animate-fadeIn">
          <p className="text-xs text-slate-500 text-center font-bold">
            👉 Buka dua kartu sekaligus. Jika konsep dan maknanya cocok, kartu akan tetap terbuka!
          </p>

          {/* Cards Grid 4x2 or 4x4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {shuffledCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx);
              const isMatched = matchedPairIds.includes(card.pairId);
              const showFront = isFlipped || isMatched;

              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  disabled={isMatched}
                  className={`h-32 sm:h-36 rounded-3xl p-3 text-center transition-all duration-300 shadow-sm cursor-pointer flex flex-col items-center justify-center border ${
                    showFront
                      ? isMatched
                        ? "bg-emerald-50 border-emerald-400 text-emerald-950 scale-95"
                        : "bg-white border-purple-500 text-slate-900 shadow-md ring-2 ring-purple-300"
                      : "bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-700 hover:border-purple-400 text-white"
                  }`}
                >
                  {showFront ? (
                    <div className="space-y-1.5 animate-fadeIn">
                      <span className="text-2xl sm:text-3xl block">{card.icon}</span>
                      <span className="block text-xs sm:text-sm font-black leading-snug line-clamp-2">
                        {card.teks}
                      </span>
                      {card.subteks && (
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          {card.subteks}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg mx-auto">
                        🕌
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 block uppercase">
                        PAI CARD
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 rounded-3xl bg-purple-50 border border-purple-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🎴
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">
              Luar Biasa! Daya Ingat & Pemahamanmu Sempurna!
            </h3>
            <p className="text-xs text-slate-600">
              Diselesaikan dalam {moves} kali percobaan. Total Skor: {score} Poin.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Acak & Mainkan Lagi
          </button>
        </div>
      )}
    </div>
  );
}
