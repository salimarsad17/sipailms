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
  Move,
  RotateCcw,
  Lightbulb,
  MousePointerClick,
  Layers,
  ArrowRight,
  Flame,
  Check
} from "lucide-react";
import { GameEdukasiData, MatchingPair } from "../../../types/bahanAjarAi";
import { SoundEngine } from "./audioSynth";

export interface GameEngineProps {
  gameData: GameEdukasiData;
  judulMateri: string;
  onScoreUpdate?: (score: number, maxScore: number) => void;
}

export type ExerciseType = "drag_drop" | "matching" | "speed_run";

interface DropZoneState {
  targetId: string; // id of pair
  targetKiri: string;
  targetKanan: string;
  droppedItemId: string | null;
  droppedItemLabel: string | null;
  isCorrect: boolean;
}

export default function GameEngine({ gameData, judulMateri, onScoreUpdate }: GameEngineProps) {
  // Active Exercise Type
  const [exerciseType, setExerciseType] = useState<ExerciseType>("drag_drop");

  // Self-Contained State & Score Tracking
  const [score, setScore] = useState<number>(0);
  const [maxScore] = useState<number>(gameData.skorMaksimal || 100);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.getIsMuted());

  // High score tracking via localStorage
  const storageKey = `game_engine_high_score_${judulMateri.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const val = localStorage.getItem(storageKey);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });

  // DRAG & DROP STATE
  const [availableChips, setAvailableChips] = useState<{ id: string; label: string }[]>([]);
  const [dropZones, setDropZones] = useState<DropZoneState[]>([]);
  const [draggingItem, setDraggingItem] = useState<{ id: string; label: string } | null>(null);
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null); // For click-to-drop fallback on mobile

  // MATCHING STATE
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shuffledRights, setShuffledRights] = useState<MatchingPair[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState<{ leftId: string; rightId: string } | null>(null);

  // SPEED RUN STATE
  const [speedIdx, setSpeedIdx] = useState<number>(0);
  const [speedTimer, setSpeedTimer] = useState<number>(30);
  const [speedLives, setSpeedLives] = useState<number>(3);
  const [isSpeedOver, setIsSpeedOver] = useState<boolean>(false);

  // Sound toggle
  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  // Helper shuffle
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  // INITIALIZE DRAG & DROP
  const initDragDrop = () => {
    const pairs = gameData.matchingPairs || [];
    // Chips are the 'kiri' names shuffled
    const chips = shuffle(pairs.map((p) => ({ id: p.id, label: p.kiri })));
    setAvailableChips(chips);

    // Drop zones are 'kanan' definitions
    const zones: DropZoneState[] = pairs.map((p) => ({
      targetId: p.id,
      targetKiri: p.kiri,
      targetKanan: p.kanan,
      droppedItemId: null,
      droppedItemLabel: null,
      isCorrect: false
    }));
    setDropZones(zones);

    // Reset score tracking
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setCorrectCount(0);
    setIsCompleted(false);
    setFeedback(null);
    setSelectedChipId(null);
    setTimerSeconds(0);
    setIsTimerActive(true);
  };

  // INITIALIZE MATCHING
  const initMatching = () => {
    const rights = shuffle(gameData.matchingPairs || []);
    setShuffledRights(rights);
    setMatchSelectedLeft(null);
    setMatchedIds([]);
    setWrongAttempt(null);
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setCorrectCount(0);
    setIsCompleted(false);
    setFeedback(null);
    setTimerSeconds(0);
    setIsTimerActive(true);
  };

  // INITIALIZE SPEED RUN
  const initSpeedRun = () => {
    setSpeedIdx(0);
    setSpeedTimer(30);
    setSpeedLives(3);
    setIsSpeedOver(false);
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setCorrectCount(0);
    setIsCompleted(false);
    setFeedback(null);
  };

  // Initialize active mode
  useEffect(() => {
    if (exerciseType === "drag_drop") initDragDrop();
    else if (exerciseType === "matching") initMatching();
    else if (exerciseType === "speed_run") initSpeedRun();
  }, [exerciseType, gameData]);

  // General Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && !isCompleted && exerciseType !== "speed_run") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isCompleted, exerciseType]);

  // Speed Run Timer
  useEffect(() => {
    let interval: any = null;
    if (exerciseType === "speed_run" && !isSpeedOver && !isCompleted) {
      interval = setInterval(() => {
        setSpeedTimer((prev) => {
          if (prev <= 1) {
            setIsSpeedOver(true);
            SoundEngine.playWrong();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exerciseType, isSpeedOver, isCompleted]);

  // Notify parent on score changes & update high score
  const updateScoreAndNotify = (newScore: number) => {
    setScore(newScore);
    if (onScoreUpdate) {
      onScoreUpdate(newScore, maxScore);
    }
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem(storageKey, newScore.toString());
      } catch (e) {
        // ignore
      }
    }
  };

  // ================= DRAG & DROP HANDLERS =================
  const handleDragStart = (e: React.DragEvent, item: { id: string; label: string }) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zone: DropZoneState) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData("text/plain");
    if (!itemData) return;
    try {
      const item = JSON.parse(itemData) as { id: string; label: string };
      executeDropItem(item, zone);
    } catch (err) {
      console.warn("Drop parse error", err);
    }
  };

  // Core drop validation logic (works for both HTML5 drag and click-to-place)
  const executeDropItem = (item: { id: string; label: string }, zone: DropZoneState) => {
    if (zone.isCorrect) return; // already completed

    setAttempts((prev) => prev + 1);

    if (item.id === zone.targetId) {
      // MATCH SUCCESS!
      SoundEngine.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);

      // Place item into zone
      setDropZones((prev) =>
        prev.map((z) =>
          z.targetId === zone.targetId
            ? { ...z, droppedItemId: item.id, droppedItemLabel: item.label, isCorrect: true }
            : z
        )
      );

      // Remove from available chips
      setAvailableChips((prev) => prev.filter((c) => c.id !== item.id));
      setSelectedChipId(null);

      // Score calculation
      const pointsPerItem = Math.round(maxScore / gameData.matchingPairs.length);
      const newScore = Math.min(maxScore, nextCorrect * pointsPerItem);
      updateScoreAndNotify(newScore);

      setFeedback({
        text: `Tepat sekali! "${item.label}" cocok dengan deskripsi ini. ${nextStreak > 1 ? `🔥 Streak x${nextStreak}!` : ""}`,
        isSuccess: true
      });

      // Check if all zones filled
      if (nextCorrect === gameData.matchingPairs.length) {
        setIsCompleted(true);
        setIsTimerActive(false);
        updateScoreAndNotify(maxScore);
        SoundEngine.playFanfare();
      }
    } else {
      // MATCH WRONG
      SoundEngine.playWrong();
      setStreak(0);
      setFeedback({
        text: `Belum tepat. "${item.label}" tidak sesuai dengan deskripsi ini. Coba lagi!`,
        isSuccess: false
      });
      setSelectedChipId(null);
    }
  };

  // Click-to-place fallback handler
  const handleZoneClickToDrop = (zone: DropZoneState) => {
    if (!selectedChipId) return;
    const item = availableChips.find((c) => c.id === selectedChipId);
    if (!item) return;
    executeDropItem(item, zone);
  };

  // ================= MATCHING HANDLERS =================
  const handleSelectMatchLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    SoundEngine.playClick();
    setMatchSelectedLeft(id);
    setWrongAttempt(null);
  };

  const handleSelectMatchRight = (pair: MatchingPair) => {
    if (!matchSelectedLeft || matchedIds.includes(pair.id)) return;
    setAttempts((prev) => prev + 1);

    if (matchSelectedLeft === pair.id) {
      // Correct!
      SoundEngine.playCorrect();
      const newMatched = [...matchedIds, pair.id];
      setMatchedIds(newMatched);
      setMatchSelectedLeft(null);
      setWrongAttempt(null);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);

      const pointsPerItem = Math.round(maxScore / gameData.matchingPairs.length);
      const newScore = Math.min(maxScore, newMatched.length * pointsPerItem);
      updateScoreAndNotify(newScore);

      setFeedback({
        text: `${gameData.feedbackBenar} ${nextStreak > 1 ? `🔥 Combo x${nextStreak}!` : ""}`,
        isSuccess: true
      });

      if (newMatched.length === gameData.matchingPairs.length) {
        setIsCompleted(true);
        setIsTimerActive(false);
        updateScoreAndNotify(maxScore);
        SoundEngine.playFanfare();
      }
    } else {
      // Wrong!
      SoundEngine.playWrong();
      setStreak(0);
      setWrongAttempt({ leftId: matchSelectedLeft, rightId: pair.id });
      setFeedback({ text: gameData.feedbackSalah, isSuccess: false });
      setTimeout(() => {
        setWrongAttempt(null);
        setMatchSelectedLeft(null);
      }, 1000);
    }
  };

  // ================= SPEED RUN HANDLERS =================
  const handleSpeedChoice = (chosenKanan: string) => {
    const currentPair = gameData.matchingPairs[speedIdx];
    if (!currentPair) return;
    setAttempts((prev) => prev + 1);

    if (chosenKanan === currentPair.kanan) {
      // Correct!
      SoundEngine.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);

      const pointsPerItem = Math.round(maxScore / gameData.matchingPairs.length);
      const newScore = Math.min(maxScore, nextCorrect * pointsPerItem);
      updateScoreAndNotify(newScore);

      if (speedIdx < gameData.matchingPairs.length - 1) {
        setSpeedIdx((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        updateScoreAndNotify(maxScore);
        SoundEngine.playFanfare();
      }
    } else {
      // Wrong!
      SoundEngine.playWrong();
      setStreak(0);
      const nextLives = speedLives - 1;
      setSpeedLives(nextLives);
      if (nextLives <= 0) {
        setIsSpeedOver(true);
        SoundEngine.playWrong();
      }
    }
  };

  // Calculate star rating
  const getStarRating = () => {
    if (score >= 90) return 3;
    if (score >= 60) return 2;
    if (score > 0) return 1;
    return 0;
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header & Exercise Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-inner">
              ⚡ GameEngine • Interactive Exercise Suite
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{gameData.judulGame}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Materi: <strong className="text-amber-400">{judulMateri}</strong> • Pilih tipe aktivitas interaktif di bawah:
          </p>
        </div>

        {/* Exercise Type Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setExerciseType("drag_drop")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              exerciseType === "drag_drop"
                ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Drag & Drop</span>
          </button>

          <button
            onClick={() => setExerciseType("matching")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              exerciseType === "matching"
                ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cocokkan Kartu</span>
          </button>

          <button
            onClick={() => setExerciseType("speed_run")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              exerciseType === "speed_run"
                ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tebak Kilat</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl transition cursor-pointer ml-1 ${
              isMuted
                ? "bg-red-950 text-red-300 border border-red-800"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isMuted ? "Suara Efek Mati" : "Suara Efek Nyala"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Internal Score & Telemetry Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Current Score */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Skor Latihan</span>
            <span className="text-xl font-black text-amber-400 leading-none">
              {score} <span className="text-xs text-slate-500 font-normal">/ {maxScore}</span>
            </span>
          </div>
        </div>

        {/* Stopwatch */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
              {exerciseType === "speed_run" ? "Sisa Waktu" : "Waktu Belajar"}
            </span>
            <span className="text-xl font-mono font-black text-blue-300 leading-none">
              {exerciseType === "speed_run" ? `${speedTimer}s` : formatTimer(timerSeconds)}
            </span>
          </div>
        </div>

        {/* Combo Streak */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20">
            <Flame className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Streak Combo</span>
            <span className="text-xl font-black text-purple-300 leading-none">
              {streak > 0 ? `x${streak}` : "-"}
            </span>
          </div>
        </div>

        {/* High Score & Stars */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Rekor Terbaik</span>
            <span className="text-base font-black text-emerald-400 leading-none flex items-center gap-1">
              {highScore} Pts
              <span className="text-amber-400 text-xs">
                {"★".repeat(getStarRating())}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all shadow-lg animate-fade-in ${
            feedback.isSuccess
              ? "bg-emerald-950/85 border border-emerald-500/80 text-emerald-200"
              : "bg-red-950/85 border border-red-500/80 text-red-200"
          }`}
        >
          {feedback.isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-amber-400 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-400/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex justify-center gap-1.5 mb-2">
              <Star className="w-7 h-7 fill-amber-400 text-amber-400 animate-bounce" />
              <Star className="w-7 h-7 fill-amber-400 text-amber-400 animate-bounce delay-100" />
              <Star className="w-7 h-7 fill-amber-400 text-amber-400 animate-bounce delay-200" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">Alhamdulillah! Latihan Selesai Sempurna!</h4>
            <p className="text-sm text-amber-200 max-w-lg mx-auto mt-1">
              Kamu berhasil menyelesaikan aktivitas <strong>{exerciseType.replace("_", " ").toUpperCase()}</strong>{" "}
              dengan skor <strong>{score} dari {maxScore} Poin</strong> dalam waktu{" "}
              <strong>{formatTimer(timerSeconds)}</strong>!
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={
                exerciseType === "drag_drop"
                  ? initDragDrop
                  : exerciseType === "matching"
                  ? initMatching
                  : initSpeedRun
              }
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Mainkan Sekali Lagi
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE 1: DRAG & DROP ENGINE */}
      {exerciseType === "drag_drop" && !isCompleted && (
        <div className="space-y-6">
          {/* Instructions */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <MousePointerClick className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Petunjuk:</strong> Tarik (drag) kartu konsep di rak atas, lalu jatuhkan (drop) ke kotak deskripsi yang sesuai. Atau klik kartu lalu klik kotak target!
              </span>
            </div>
            <button
              onClick={initDragDrop}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold shrink-0 transition cursor-pointer"
            >
              Reset Rak
            </button>
          </div>

          {/* Draggable Chips Shelf */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-amber-400/30 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-400">
              <span>Rak Kartu Konsep ({availableChips.length} Tersedia)</span>
              {selectedChipId && (
                <span className="text-emerald-400 font-bold animate-pulse">
                  Kartu Terpilih: Sekarang klik salah satu kotak target di bawah!
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 min-h-12 items-center">
              {availableChips.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Semua kartu konsep sudah berhasil dipasangkan ke target!
                </span>
              ) : (
                availableChips.map((chip) => {
                  const isSelected = selectedChipId === chip.id;
                  return (
                    <div
                      key={chip.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, chip)}
                      onClick={() => {
                        SoundEngine.playClick();
                        setSelectedChipId(selectedChipId === chip.id ? null : chip.id);
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold cursor-grab active:cursor-grabbing select-none transition-all shadow-md flex items-center gap-2 border ${
                        isSelected
                          ? "bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 scale-105"
                          : "bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-amber-400/60 hover:scale-102"
                      }`}
                    >
                      <Move className="w-3.5 h-3.5 text-amber-400" />
                      <span>{chip.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Target Drop Zones Grid */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block px-1">
              Kotak Target Deskripsi & Makna ({dropZones.filter((z) => z.isCorrect).length} / {dropZones.length} Terjawab)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dropZones.map((zone, zIdx) => {
                const isTargetReady = selectedChipId !== null && !zone.isCorrect;

                return (
                  <div
                    key={zone.targetId}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, zone)}
                    onClick={() => handleZoneClickToDrop(zone)}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 ${
                      zone.isCorrect
                        ? "bg-emerald-950/40 border-emerald-500/80 shadow-emerald-500/10 shadow-lg"
                        : isTargetReady
                        ? "bg-slate-950/90 border-amber-400/80 border-dashed hover:bg-emerald-950/30 cursor-pointer scale-[1.01]"
                        : "bg-slate-950/60 border-slate-800 border-dashed"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Target #{zIdx + 1}
                        </span>
                        {zone.isCorrect && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Tepat
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        "{zone.targetKanan}"
                      </p>
                    </div>

                    {/* Dropped Slot Placeholder */}
                    <div
                      className={`p-3 rounded-2xl text-xs font-black border transition-all flex items-center justify-between ${
                        zone.isCorrect
                          ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                          : isTargetReady
                          ? "bg-amber-400/10 border-amber-400/60 text-amber-300 animate-pulse"
                          : "bg-slate-900/60 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="truncate">
                        {zone.droppedItemLabel
                          ? `✓ ${zone.droppedItemLabel}`
                          : isTargetReady
                          ? "Klik di sini untuk pasangkan kartu terpilih!"
                          : "Jatuhkan kartu konsep ke sini..."}
                      </span>
                      {zone.isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE 2: MATCHING MATRIX */}
      {exerciseType === "matching" && !isCompleted && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block px-1">
                1. Pilih Nama / Objek
              </span>
              <div className="space-y-2.5">
                {gameData.matchingPairs.map((pair, pIdx) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isSelected = matchSelectedLeft === pair.id;
                  const isWrong = wrongAttempt?.leftId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectMatchLeft(pair.id)}
                      disabled={isMatched}
                      className={`w-full text-left p-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all border cursor-pointer ${
                        isMatched
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 line-through opacity-70 cursor-default"
                          : isWrong
                          ? "bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500"
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
                        <span>{pair.kiri}</span>
                      </div>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block px-1">
                2. Pasangkan ke Deskripsi
              </span>
              <div className="space-y-2.5">
                {shuffledRights.map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isWrong = wrongAttempt?.rightId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectMatchRight(pair)}
                      disabled={isMatched || !matchSelectedLeft}
                      className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all border ${
                        isMatched
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 line-through opacity-70 cursor-default"
                          : isWrong
                          ? "bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500"
                          : matchSelectedLeft
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

      {/* EXERCISE 3: SPEED RUN CHALLENGE */}
      {exerciseType === "speed_run" && !isCompleted && !isSpeedOver && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-slate-400">
              Pertanyaan #{speedIdx + 1} dari {gameData.matchingPairs.length}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-400 mr-1">Nyawa:</span>
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-sm ${i < speedLives ? "text-red-400" : "text-slate-600"}`}>
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 shadow-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Konsep / Objek:
            </span>
            <h4 className="text-2xl font-black text-white">
              "{gameData.matchingPairs[speedIdx]?.kiri}"
            </h4>
            <p className="text-xs text-slate-400">Pilih penjelasan yang paling tepat dengan cepat:</p>

            <div className="grid grid-cols-1 gap-2.5 text-left pt-2">
              {shuffle(gameData.matchingPairs).map((pair) => (
                <button
                  key={pair.id}
                  onClick={() => handleSpeedChoice(pair.kanan)}
                  className="p-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-950/80 hover:border-emerald-500 border border-slate-800 text-xs sm:text-sm text-slate-200 transition cursor-pointer font-medium leading-relaxed"
                >
                  {pair.kanan}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Speed Over Banner */}
      {isSpeedOver && (
        <div className="p-8 rounded-3xl bg-red-950/60 border border-red-700/60 text-center space-y-4 max-w-lg mx-auto shadow-2xl animate-fade-in">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h4 className="text-2xl font-black text-white">Waktu atau Nyawa Habis!</h4>
          <p className="text-xs text-slate-300">
            Skor yang kamu kumpulkan: <strong className="text-amber-400 text-lg">{score} Poin</strong>.
          </p>
          <button
            onClick={initSpeedRun}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
          >
            Coba Sekali Lagi
          </button>
        </div>
      )}
    </div>
  );
}
