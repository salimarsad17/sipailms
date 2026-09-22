/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Award,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Timer,
  Volume2,
  VolumeX,
  Zap,
  Star,
  Check,
  RotateCcw
} from "lucide-react";
import { GameEdukasiData, MatchingPair } from "../../../types/bahanAjarAi";
import { SoundEngine } from "./audioSynth";

interface GameEdukasiPlayableProps {
  gameData: GameEdukasiData;
}

export default function GameEdukasiPlayable({ gameData }: GameEdukasiPlayableProps) {
  // Game Modes: "match" (Mencocokkan Kartu) vs "speed" (Tebak Kilat)
  const [gameMode, setGameMode] = useState<"match" | "speed">("match");

  // Matching Mode State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState<{ leftId: string; rightId: string } | null>(null);
  const [shuffledRights, setShuffledRights] = useState<MatchingPair[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Timer state
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Speed Challenge Mode State
  const [speedCurrentIdx, setSpeedCurrentIdx] = useState<number>(0);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(30);
  const [isSpeedFinished, setIsSpeedFinished] = useState<boolean>(false);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.getIsMuted());

  // Shuffling helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Init Matching Game
  const initMatchingGame = () => {
    const rights = shuffleArray(gameData.matchingPairs);
    setShuffledRights(rights);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setWrongAttempt(null);
    setScore(0);
    setStreak(0);
    setFeedbackMessage("");
    setIsGameFinished(false);
    setTimeSeconds(0);
    setIsTimerRunning(true);
  };

  // Init Speed Challenge
  const initSpeedGame = () => {
    setSpeedCurrentIdx(0);
    setSpeedScore(0);
    setSpeedTimeLeft(30);
    setIsSpeedFinished(false);
    setIsTimerRunning(true);
  };

  // Re-initialize when gameData changes or gameMode changes
  useEffect(() => {
    if (gameMode === "match") {
      initMatchingGame();
    } else {
      initSpeedGame();
    }
  }, [gameData, gameMode]);

  // Matching Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isGameFinished && gameMode === "match") {
      interval = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isGameFinished, gameMode]);

  // Speed Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSpeedFinished && gameMode === "speed") {
      interval = setInterval(() => {
        setSpeedTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSpeedFinished(true);
            SoundEngine.playFanfare();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isSpeedFinished, gameMode]);

  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  // Handle selecting left card
  const handleSelectLeft = (id: string) => {
    if (matchedPairs.includes(id)) return;
    SoundEngine.playClick();
    setSelectedLeft(id);
    setWrongAttempt(null);
  };

  // Handle selecting right card
  const handleSelectRight = (pair: MatchingPair) => {
    if (!selectedLeft) return;
    if (matchedPairs.includes(pair.id)) return;

    if (selectedLeft === pair.id) {
      // Correct match!
      SoundEngine.playCorrect();
      const newMatched = [...matchedPairs, pair.id];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setWrongAttempt(null);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const pointsPerMatch = Math.round(gameData.skorMaksimal / gameData.matchingPairs.length);
      const newScore = Math.min(gameData.skorMaksimal, newMatched.length * pointsPerMatch);
      setScore(newScore);
      setFeedbackMessage(`${gameData.feedbackBenar} ${nextStreak > 1 ? `🔥 Combo x${nextStreak}!` : ""}`);

      if (newMatched.length === gameData.matchingPairs.length) {
        setIsGameFinished(true);
        setIsTimerRunning(false);
        setScore(gameData.skorMaksimal);
        SoundEngine.playFanfare();
      }
    } else {
      // Wrong match
      SoundEngine.playWrong();
      setStreak(0);
      setWrongAttempt({ leftId: selectedLeft, rightId: pair.id });
      setFeedbackMessage(gameData.feedbackSalah);
      setTimeout(() => {
        setWrongAttempt(null);
        setSelectedLeft(null);
      }, 1000);
    }
  };

  // Handle Speed Quiz Answer
  const handleSpeedAnswer = (chosenRight: string) => {
    const currentPair = gameData.matchingPairs[speedCurrentIdx];
    if (!currentPair) return;

    if (chosenRight === currentPair.kanan) {
      SoundEngine.playCorrect();
      setSpeedScore((prev) => prev + 20);
    } else {
      SoundEngine.playWrong();
    }

    if (speedCurrentIdx < gameData.matchingPairs.length - 1) {
      setSpeedCurrentIdx((prev) => prev + 1);
    } else {
      setIsSpeedFinished(true);
      SoundEngine.playFanfare();
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-inner">
              🎮 Game Edukasi Interaktif PAI • Siap Main
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{gameData.judulGame}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{gameData.instruksi}</p>
        </div>

        {/* Mode Switcher & Audio Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setGameMode("match")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                gameMode === "match"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🧩 Cocokkan Kartu
            </button>
            <button
              onClick={() => setGameMode("speed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                gameMode === "speed"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Tebak Kilat
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

          {/* Restart Game */}
          <button
            onClick={gameMode === "match" ? initMatchingGame : initSpeedGame}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Mulai Ulang Game"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODE 1: MENCOCOKKAN PASANGAN KARTU */}
      {gameMode === "match" && (
        <div className="space-y-6">
          {/* Status Bar: Score, Timer, Streak */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Skor</span>
                <span className="text-lg font-black text-amber-400 leading-none">
                  {score} <span className="text-xs text-slate-500 font-normal">/ {gameData.skorMaksimal}</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Waktu</span>
                <span className="text-lg font-mono font-black text-blue-300 leading-none">
                  {formatTimer(timeSeconds)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Combo Streak</span>
                <span className="text-lg font-black text-purple-300 leading-none">
                  {streak > 0 ? `x${streak}` : "-"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Terselesaikan</span>
                <span className="text-lg font-black text-emerald-400 leading-none">
                  {matchedPairs.length} <span className="text-xs text-slate-500 font-normal">/ {gameData.matchingPairs.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all shadow-md ${
                feedbackMessage.includes(gameData.feedbackBenar)
                  ? "bg-emerald-950/80 border border-emerald-600/80 text-emerald-200"
                  : "bg-red-950/80 border border-red-600/80 text-red-200"
              }`}
            >
              {feedbackMessage.includes(gameData.feedbackBenar) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Victory Modal Banner */}
          {isGameFinished && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-amber-400 text-center space-y-4 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-400/30">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="flex justify-center gap-1 mb-2">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <h4 className="text-2xl font-black text-white">Alhamdulillah! Luar Biasa!</h4>
                <p className="text-sm text-amber-200 max-w-md mx-auto mt-1">
                  Kamu berhasil menyelesaikan seluruh tantangan materi dalam waktu{" "}
                  <strong>{formatTimer(timeSeconds)}</strong> dengan skor sempurna{" "}
                  <strong>100 Poin</strong>!
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={initMatchingGame}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Mainkan Sekali Lagi
                </button>
              </div>
            </div>
          )}

          {/* Matching Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Names / Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-wider px-1">
                <span>1. Pilih Nama / Objek (Kolom Kiri)</span>
                <span className="text-[11px] text-slate-400">
                  {matchedPairs.length} Selesai
                </span>
              </div>
              <div className="space-y-2.5">
                {gameData.matchingPairs.map((pair, pIdx) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedLeft === pair.id;
                  const isWrong = wrongAttempt?.leftId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectLeft(pair.id)}
                      disabled={isMatched}
                      className={`w-full text-left p-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all border cursor-pointer ${
                        isMatched
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 line-through opacity-70 cursor-default"
                          : isWrong
                          ? "bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500 animate-shake"
                          : isSelected
                          ? "bg-amber-400 text-slate-950 border-amber-300 shadow-xl font-black ring-4 ring-amber-400/40 scale-[1.02]"
                          : "bg-slate-950/80 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center border ${
                            isSelected
                              ? "bg-slate-950 text-amber-400 border-slate-900"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {pIdx + 1}
                        </span>
                        <span className="text-sm font-extrabold">{pair.kiri}</span>
                      </div>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Descriptions / Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-emerald-400 uppercase tracking-wider px-1">
                <span>2. Pasangkan ke Tugas / Penjelasan (Kolom Kanan)</span>
                <span className="text-amber-400 text-[11px] flex items-center gap-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> {selectedLeft ? "Klik jawabanmu!" : "Pilih kiri dahulu"}
                </span>
              </div>
              <div className="space-y-2.5">
                {shuffledRights.map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isWrong = wrongAttempt?.rightId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectRight(pair)}
                      disabled={isMatched || !selectedLeft}
                      className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all border ${
                        isMatched
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 line-through opacity-70 cursor-default"
                          : isWrong
                          ? "bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500"
                          : selectedLeft
                          ? "bg-slate-950 hover:bg-emerald-950/80 hover:border-emerald-500 text-slate-200 border-slate-700 cursor-pointer shadow-md hover:scale-[1.01]"
                          : "bg-slate-950/40 text-slate-500 border-slate-800/60 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span className="leading-relaxed">{pair.kanan}</span>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: TEBAK KILAT (SPEED FLASHCARDS) */}
      {gameMode === "speed" && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Header Speed: Time Left & Score */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Sisa Waktu:</span>
              <span
                className={`text-xl font-black font-mono ${
                  speedTimeLeft <= 10 ? "text-red-400 animate-pulse" : "text-amber-400"
                }`}
              >
                {speedTimeLeft} Detik
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Skor Kilat:</span>
              <span className="text-xl font-black text-emerald-400">{speedScore} Poin</span>
            </div>
          </div>

          {!isSpeedFinished ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl animate-fade-in text-center">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400">
                Pertanyaan {speedCurrentIdx + 1} dari {gameData.matchingPairs.length}
              </span>

              <h4 className="text-xl sm:text-2xl font-black text-white">
                "{gameData.matchingPairs[speedCurrentIdx]?.kiri}"
              </h4>
              <p className="text-xs text-slate-400">Cocokkan dengan tugas atau penjelasan yang paling tepat:</p>

              {/* Multiple Choice Options for this pair */}
              <div className="grid grid-cols-1 gap-2.5 text-left">
                {shuffleArray(gameData.matchingPairs).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSpeedAnswer(opt.kanan)}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-emerald-950/80 hover:border-emerald-500 border border-slate-800 text-xs sm:text-sm text-slate-200 transition cursor-pointer font-medium"
                  >
                    {opt.kanan}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 to-slate-950 border border-amber-400/40 text-center space-y-4 shadow-2xl animate-fade-in">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="text-2xl font-black text-white">Tantangan Kilat Selesai!</h4>
              <p className="text-sm text-slate-300">
                Skor Akhir Kamu: <strong className="text-amber-400 text-xl font-black">{speedScore} Poin</strong>
              </p>
              <button
                onClick={initSpeedGame}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
