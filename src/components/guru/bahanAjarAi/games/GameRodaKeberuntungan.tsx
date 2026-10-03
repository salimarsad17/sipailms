/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  HelpCircle,
  Coins
} from "lucide-react";
import { GameRodaKeberuntunganData, WheelSegment } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameRodaKeberuntunganProps {
  gameData: GameRodaKeberuntunganData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameRodaKeberuntungan({ gameData, onFinishGame }: GameRodaKeberuntunganProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const [userAnswered, setUserAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(5);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());

  const segments = gameData.segments;
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const handleSpinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;
    soundFx.playClick();
    setIsSpinning(true);
    setSelectedSegment(null);
    setUserAnswered(false);

    // Pick random segment
    const targetIndex = Math.floor(Math.random() * numSegments);
    const extraRounds = 4 + Math.floor(Math.random() * 3);
    const targetRotation = rotationDegrees + extraRounds * 360 + (360 - targetIndex * segmentAngle - segmentAngle / 2);

    // Audio tick simulation
    const tickInterval = setInterval(() => {
      soundFx.playTick();
    }, 150);

    setRotationDegrees(targetRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const chosen = segments[targetIndex];
      setSelectedSegment(chosen);
      setSpinsLeft((s) => s - 1);
      soundFx.playCoin();
    }, 3200);
  };

  const handleCompleteChallenge = (success: boolean) => {
    if (!selectedSegment || userAnswered) return;
    setUserAnswered(true);

    if (success) {
      soundFx.playCorrect();
      const addedPoints = selectedSegment.poin;
      setScore((s) => s + addedPoints);
    } else {
      soundFx.playWrong();
    }

    if (spinsLeft <= 1) {
      setTimeout(() => {
        soundFx.playVictory();
        onFinishGame(score + (success ? selectedSegment.poin : 0), 30, "🎯 Penakluk Roda Hikmah");
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-800 flex items-center justify-center text-amber-300 font-black text-sm">
            🎯
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-300 block uppercase">
              Sisa Putaran: {spinsLeft}
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

      {/* Wheel Arena */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-6">
        {/* Pointer / Jarum */}
        <div className="flex justify-center -mb-4 relative z-20">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-500 filter drop-shadow-md"></div>
        </div>

        {/* Circular Wheel Graphic */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
          <div
            className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl relative overflow-hidden transition-transform duration-[3200ms] ease-out"
            style={{ transform: `rotate(${rotationDegrees}deg)` }}
          >
            {segments.map((seg, idx) => {
              const startAngle = idx * segmentAngle;
              return (
                <div
                  key={seg.id}
                  className="absolute w-full h-full origin-center flex items-start justify-center pt-3 text-[10px] font-black uppercase text-white tracking-tighter"
                  style={{
                    backgroundColor: seg.warna,
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `polygon(50% 50%, 0% 0%, 100% 0%)`
                  }}
                >
                  <span className="transform rotate-90 mt-5 block drop-shadow-md">
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center SPIN Button */}
          <button
            onClick={handleSpinWheel}
            disabled={isSpinning || spinsLeft <= 0}
            className="absolute z-20 w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-black text-xs shadow-xl border-4 border-white flex flex-col items-center justify-center transition transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>SPIN</span>
          </button>
        </div>

        {/* Spin Instruction / Selected Challenge */}
        {selectedSegment ? (
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 animate-fadeIn text-left">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                {selectedSegment.kategori} (+{selectedSegment.poin} Poin)
              </span>
              <span className="text-xs font-mono text-slate-300">Tantangan Terpilih</span>
            </div>

            <p className="text-sm sm:text-base font-bold text-white">
              "{selectedSegment.pertanyaan}"
            </p>

            {!userAnswered ? (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCompleteChallenge(true)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  ✓ Berhasil Jawab
                </button>
                <button
                  onClick={() => handleCompleteChallenge(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Lewati Tantangan
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-xs text-emerald-300 text-center font-bold">
                Tantangan selesai! Putar roda kembali untuk tantangan berikutnya.
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-semibold">
            {spinsLeft > 0
              ? "Tekan tombol SPIN di tengah roda untuk memutar tantangan keberuntungan!"
              : "Putaran telah habis! Kamu telah menuntaskan seluruh tantangan roda."}
          </p>
        )}
      </div>
    </div>
  );
}
