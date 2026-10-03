/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Gamepad2,
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  Award,
  Volume2,
  VolumeX,
  Sliders,
  Eye,
  ArrowLeft,
  ChevronRight,
  Shield,
  Coins,
  Star,
  Layers,
  Settings,
  Image as ImageIcon
} from "lucide-react";
import { VisualGameSuiteBundle, GameVisualType } from "../../../../types/gamePaiVisual";
import { GameVisualGenerator } from "../../../../services/gameVisualGenerator";
import { soundFx } from "../../../../services/soundFxService";
import { BahanAjarAiStorage } from "../../../../services/bahanAjarAiStorage";

// Sub Game Components
import GameQuizAdventure from "./GameQuizAdventure";
import GameMatchDiscover from "./GameMatchDiscover";
import GameTebakGambar from "./GameTebakGambar";
import GameSusunKata from "./GameSusunKata";
import GameMemoryCard from "./GameMemoryCard";
import GameRodaKeberuntungan from "./GameRodaKeberuntungan";
import GameMissionChallenge from "./GameMissionChallenge";

interface GameHubVisualProps {
  kelas: string;
  materi: string;
  subMateri: string;
  isStudentMode?: boolean;
}

export default function GameHubVisual({
  kelas,
  materi,
  subMateri,
  isStudentMode = false
}: GameHubVisualProps) {
  // Generate visual game suite automatically based on topic
  const [suiteBundle, setSuiteBundle] = useState<VisualGameSuiteBundle>(() =>
    GameVisualGenerator.generateSuite(kelas, materi, subMateri)
  );

  const [activeGameType, setActiveGameType] = useState<GameVisualType | null>(null);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());

  // Result popup modal state
  const [finishedResult, setFinishedResult] = useState<{
    score: number;
    coins: number;
    badge: string;
    gameTitle: string;
  } | null>(null);

  // Guru prompt modal state
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleFinishGame = (finalScore: number, coins: number, badge: string) => {
    const gameTitle = activeGameType ? getGameTitle(activeGameType) : "Game Edukasi PAI";
    setFinishedResult({
      score: finalScore,
      coins,
      badge,
      gameTitle
    });

    // Save result to storage
    BahanAjarAiStorage.saveHasilGame({
      id: `game-res-${Date.now()}`,
      gameId: suiteBundle.id,
      gameTipe: (activeGameType as any) || "QUIZ_ADVENTURE",
      gameJudul: gameTitle,
      siswaNisn: "0098765432",
      siswaNama: "Farhan Maulana",
      kelasId: `${kelas}-A`,
      skor: finalScore,
      waktuDetik: 90,
      persentaseBenar: Math.min(100, Math.round((finalScore / 100) * 100)),
      tanggalMain: new Date().toISOString()
    });
  };

  const getGameTitle = (type: GameVisualType) => {
    switch (type) {
      case "QUIZ_ADVENTURE":
        return suiteBundle.game1QuizAdventure.judul;
      case "MATCH_DISCOVER":
        return suiteBundle.game2MatchDiscover.judul;
      case "TEBAK_GAMBAR":
        return suiteBundle.game3TebakGambar.judul;
      case "SUSUN_KATA":
        return suiteBundle.game4SusunKata.judul;
      case "MEMORY_CARD":
        return suiteBundle.game5MemoryCard.judul;
      case "RODA_KEBERUNTUNGAN":
        return suiteBundle.game6RodaKeberuntungan.judul;
      case "MISSION_CHALLENGE":
        return suiteBundle.game7MissionChallenge.judul;
    }
  };

  const gameCardsList = [
    {
      id: "QUIZ_ADVENTURE" as GameVisualType,
      title: "1. Quiz Adventure",
      subtitle: "Petualangan 4 Level dengan Karakter & Nyawa",
      icon: "🧭",
      color: "from-teal-600 to-emerald-700",
      badge: "Game Petualangan"
    },
    {
      id: "MATCH_DISCOVER" as GameVisualType,
      title: "2. Match & Discover",
      subtitle: "Mencocokkan Kartu Visual Gambar & Konsep",
      icon: "🧩",
      color: "from-blue-600 to-indigo-700",
      badge: "Pencocokan Visual"
    },
    {
      id: "TEBAK_GAMBAR" as GameVisualType,
      title: "3. Tebak Gambar PAI",
      subtitle: "Tebak Skenario Ibadah & Perilaku Terpuji",
      icon: "🖼️",
      color: "from-indigo-600 to-purple-700",
      badge: "Tebak Ilustrasi"
    },
    {
      id: "SUSUN_KATA" as GameVisualType,
      title: "4. Susun Kata PAI",
      subtitle: "Susun Ubin Huruf Menjadi Istilah Syariat",
      icon: "🔤",
      color: "from-amber-500 to-yellow-600",
      badge: "Word Scramble"
    },
    {
      id: "MEMORY_CARD" as GameVisualType,
      title: "5. Memory Card PAI",
      subtitle: "Permainan Buka Pasangan Kartu Memori",
      icon: "🎴",
      color: "from-purple-600 to-pink-700",
      badge: "Daya Ingat"
    },
    {
      id: "RODA_KEBERUNTUNGAN" as GameVisualType,
      title: "6. Roda Keberuntungan",
      subtitle: "Putar Roda & Taklukkan Tantangan Acak",
      icon: "🎯",
      color: "from-rose-600 to-red-700",
      badge: "Spin the Wheel"
    },
    {
      id: "MISSION_CHALLENGE" as GameVisualType,
      title: "7. Mission Challenge",
      subtitle: "Tuntaskan 5 Misi untuk Meraih Lencana Juara",
      icon: "🛡️",
      color: "from-slate-800 to-slate-950",
      badge: "Misi Bertingkat"
    }
  ];

  return (
    <div className="space-y-6">
      {/* ARENA HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-teal-800/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                7 IN 1 GAME EDUKASI VISUAL PAI
              </span>
              <span className="text-xs text-teal-300 font-semibold">
                Kelas {kelas} SMP • {materi}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {subMateri}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Media pembelajaran game interaktif visual: bermain sambil belajar konsep, akidah, akhlak, dan syariat Islam dengan tantangan menyenangkan!
            </p>
          </div>

          {/* Controls: Sound & AI Visual Prompts */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setSoundMuted(soundFx.toggleMute())}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
              <span>{soundMuted ? "Suara OFF" : "Suara ON"}</span>
            </button>

            {!isStudentMode && (
              <button
                onClick={() => setShowPromptModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Prompt Visual AI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GAME ARENA: ACTIVE GAME OR SELECTION HUB */}
      {activeGameType ? (
        <div className="space-y-4">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGameType(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu Game</span>
            </button>

            <span className="text-xs font-bold text-slate-500">
              Sedang Memainkan: <strong className="text-slate-900">{getGameTitle(activeGameType)}</strong>
            </span>
          </div>

          {/* Active Game Renderer */}
          {activeGameType === "QUIZ_ADVENTURE" && (
            <GameQuizAdventure
              gameData={suiteBundle.game1QuizAdventure}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "MATCH_DISCOVER" && (
            <GameMatchDiscover
              gameData={suiteBundle.game2MatchDiscover}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "TEBAK_GAMBAR" && (
            <GameTebakGambar
              gameData={suiteBundle.game3TebakGambar}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "SUSUN_KATA" && (
            <GameSusunKata
              gameData={suiteBundle.game4SusunKata}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "MEMORY_CARD" && (
            <GameMemoryCard
              gameData={suiteBundle.game5MemoryCard}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "RODA_KEBERUNTUNGAN" && (
            <GameRodaKeberuntungan
              gameData={suiteBundle.game6RodaKeberuntungan}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeGameType === "MISSION_CHALLENGE" && (
            <GameMissionChallenge
              gameData={suiteBundle.game7MissionChallenge}
              onFinishGame={handleFinishGame}
            />
          )}
        </div>
      ) : (
        /* 7 GAME SELECTION CARDS (SESUAI POIN 35-41) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-teal-700" />
              Pilih Salah Satu dari 7 Game Visual PAI:
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Semua game 100% playable langsung di browser
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameCardsList.map((g) => (
              <div
                key={g.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveGameType(g.id);
                }}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-3 rounded-2xl bg-slate-100 group-hover:scale-110 transition transform">
                      {g.icon}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-black text-[10px]">
                      {g.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {g.subtitle}
                    </p>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 group-hover:from-teal-600 group-hover:to-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mainkan Game</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME FINISHED REWARD POPUP (POIN 55) */}
      {finishedResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 text-center space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🎉
            </div>

            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                GAME SELESAI!
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {finishedResult.gameTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Materi: {subMateri}
              </p>
            </div>

            {/* Stars & Score stats */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-center text-amber-400 gap-1 text-xl">
                ⭐⭐⭐⭐⭐
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Skor</span>
                  <span className="text-xl font-black text-emerald-700">{finishedResult.score} Pts</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Koin Bonus</span>
                  <span className="text-xl font-black text-amber-500">+{finishedResult.coins} 🪙</span>
                </div>
              </div>
            </div>

            {/* Badge award */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
              {finishedResult.badge}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setFinishedResult(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setFinishedResult(null);
                  setActiveGameType(null);
                }}
                className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Pilih Game Lain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMPT VISUAL AI MODAL (POIN 34, 42, 53) */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-black text-slate-900">
                  Prompt Generator Gambar AI Game (Poin 34 & 53)
                </h3>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Gunakan prompt terstruktur di bawah ini pada AI Image Generator (Midjourney, DALL-E, atau Gemini Imagen) untuk menghasilkan poster & aset game edukasi PAI berkualitas tinggi.
            </p>

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(suiteBundle.visualMeta, null, 2)}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(suiteBundle.visualMeta, null, 2));
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? "Prompt Tersalin!" : "Salin Prompt JSON"}</span>
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
