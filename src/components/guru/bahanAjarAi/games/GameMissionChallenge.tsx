/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  Shield,
  Star,
  Clock,
  Volume2,
  VolumeX
} from "lucide-react";
import { GameMissionChallengeData, MissionStage } from "../../../../types/gamePaiVisual";
import { soundFx } from "../../../../services/soundFxService";

interface GameMissionChallengeProps {
  gameData: GameMissionChallengeData;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

export default function GameMissionChallenge({ gameData, onFinishGame }: GameMissionChallengeProps) {
  const [stageIdx, setStageIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());

  const currentMission = gameData.misiList[stageIdx] || gameData.misiList[0];

  const handleSelectOption = (opt: string) => {
    if (selectedOpt !== null) return;
    soundFx.playClick();
    setSelectedOpt(opt);
    setShowFeedback(true);

    const isCorrect = opt === currentMission.kunciJawaban;
    if (isCorrect) {
      soundFx.playCorrect();
      setScore((s) => s + currentMission.poinMisi);
      setCorrectCount((c) => c + 1);
      if (!earnedBadges.includes(currentMission.badgeHadiah)) {
        setEarnedBadges((b) => [...b, currentMission.badgeHadiah]);
      }
    } else {
      soundFx.playWrong();
    }
  };

  const handleNextMission = () => {
    soundFx.playClick();
    setSelectedOpt(null);
    setShowFeedback(false);

    if (stageIdx < gameData.misiList.length - 1) {
      setStageIdx((prev) => prev + 1);
    } else {
      soundFx.playVictory();
      setIsCompleted(true);
      onFinishGame(score + 35, 40, "🏆 Juara Utama Misi PAI");
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setStageIdx(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setShowFeedback(false);
    setEarnedBadges([]);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-sm">
            🛡️
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-300 block uppercase">
              MISI {currentMission.stage} DARI {gameData.misiList.length}
            </span>
            <span className="text-xs font-black text-white">{currentMission.judulMisi}</span>
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
        <div className="space-y-5 animate-fadeIn">
          {/* Mission Briefing Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/60 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                Tantangan #{currentMission.stage} • {currentMission.tipeTantangan}
              </span>
              <span className="text-xs text-amber-300 font-bold">
                Hadiah: {currentMission.badgeHadiah}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {currentMission.instruksi}
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white pt-1">
              "{currentMission.pertanyaan}"
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentMission.opsi.map((opt, idx) => {
              const hasSelected = selectedOpt !== null;
              const isSelected = selectedOpt === opt;
              const isCorrect = opt === currentMission.kunciJawaban;

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
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasSelected}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between shadow-2xs cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {hasSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {hasSelected && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-3 animate-fadeIn">
              <span className={`block font-black text-sm ${selectedOpt === currentMission.kunciJawaban ? "text-emerald-700" : "text-rose-700"}`}>
                {selectedOpt === currentMission.kunciJawaban
                  ? `🎉 MISI ${currentMission.stage} SUKSES! (+${currentMission.poinMisi} Poin)`
                  : "💡 Misi Tertahan! Pembahasan Hikmah:"}
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {currentMission.penjelasan}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextMission}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <span>{stageIdx < gameData.misiList.length - 1 ? "Lanjut Misi Berikutnya" : "Lihat Hasil Akhir Misi"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mission Complete Screen */
        <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 animate-fadeIn shadow-2xl border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-inner font-black">
            🏆
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
              MISSION COMPLETE
            </span>
            <h3 className="text-2xl font-black text-white">
              Seluruh 5 Misi Berhasil Dituntaskan!
            </h3>
            <p className="text-xs text-slate-300">
              Misi Terselesaikan dengan {correctCount} jawaban benar dari {gameData.misiList.length} rintangan.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 inline-block font-mono text-sm">
            Total Skor: <strong className="text-amber-400">{score} Poin</strong>
          </div>

          {/* Badges Earned */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-black uppercase text-amber-300 block">Lencana yang Diraih:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {earnedBadges.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                  🎖️ {b}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Ulangi Misi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
