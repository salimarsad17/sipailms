/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipForward,
  SkipBack,
  Clock,
  Sparkles,
  Copy,
  Check,
  Subtitles,
  Sliders,
  Layers,
  Monitor,
  Share2,
  BookOpen
} from "lucide-react";
import { VideoConfig, VideoSceneItem } from "../../../types/bahanAjarAi";
import { VoiceNarration, SoundEngine } from "./audioSynth";

interface VideoStoryboardViewerProps {
  videoData: VideoConfig;
  judulMateri: string;
}

export default function VideoStoryboardViewer({ videoData, judulMateri }: VideoStoryboardViewerProps) {
  // Tabs: "player" vs "storyboard"
  const [activeTab, setActiveTab] = useState<"player" | "storyboard">("player");

  // Player States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [sceneElapsedTime, setSceneElapsedTime] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Copy states
  const [hasCopiedScript, setHasCopiedScript] = useState<boolean>(false);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const scenes = videoData.scenes && videoData.scenes.length > 0 ? videoData.scenes : [
    {
      sceneNomor: 1,
      judulScene: "Prolog Materi",
      durasiDetik: 15,
      visual: "Visual pengantar materi dengan latar belakang islami elegan",
      narasi: `Selamat datang di pembelajaran Pendidikan Agama Islam: ${judulMateri}. Mari kita pelajari bersama dengan seksama.`,
      gerakan: "Slow zoom-in ke arah judul materi",
      teksLayar: judulMateri,
      promptAiVideo: "Cinematic islamic background with golden light, 4k resolution"
    }
  ];

  const currentScene: VideoSceneItem = scenes[activeSceneIdx] || scenes[0];

  // Calculate cumulative start time for scenes
  const getSceneStartTime = (idx: number) => {
    let t = 0;
    for (let i = 0; i < idx; i++) {
      t += scenes[i]?.durasiDetik || 15;
    }
    return t;
  };

  // Play / Pause toggler
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      VoiceNarration.pause();
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        VoiceNarration.speak(currentScene.narasi, playbackSpeed);
      }
    }
  };

  // Switch to specific scene
  const goToScene = (newIdx: number, autoPlay: boolean = isPlaying) => {
    if (newIdx < 0 || newIdx >= scenes.length) return;
    VoiceNarration.stop();
    setActiveSceneIdx(newIdx);
    setSceneElapsedTime(0);
    setTotalElapsedTime(getSceneStartTime(newIdx));

    if (autoPlay && !isMuted) {
      VoiceNarration.speak(scenes[newIdx].narasi, playbackSpeed);
    }
  };

  // Restart video from beginning
  const handleRestart = () => {
    VoiceNarration.stop();
    setActiveSceneIdx(0);
    setSceneElapsedTime(0);
    setTotalElapsedTime(0);
    setIsPlaying(true);
    if (!isMuted) {
      VoiceNarration.speak(scenes[0].narasi, playbackSpeed);
    }
  };

  // Timer loop when playing
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 250;
      timerRef.current = setInterval(() => {
        setSceneElapsedTime((prevSceneSec) => {
          const added = (intervalMs / 1000) * playbackSpeed;
          const nextSceneSec = prevSceneSec + added;
          const sceneDuration = currentScene.durasiDetik || 15;

          if (nextSceneSec >= sceneDuration) {
            // Scene finished -> Go to next scene or finish
            if (activeSceneIdx < scenes.length - 1) {
              const nextIdx = activeSceneIdx + 1;
              setActiveSceneIdx(nextIdx);
              if (!isMuted) {
                VoiceNarration.speak(scenes[nextIdx].narasi, playbackSpeed);
              }
              return 0;
            } else {
              // Video completed!
              setIsPlaying(false);
              VoiceNarration.stop();
              SoundEngine.playFanfare();
              return sceneDuration;
            }
          }
          return nextSceneSec;
        });

        setTotalElapsedTime((prev) => {
          const added = (intervalMs / 1000) * playbackSpeed;
          return Math.min(videoData.durasiTotalDetik, prev + added);
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSceneIdx, playbackSpeed, isMuted, currentScene, scenes, videoData.durasiTotalDetik]);

  // Clean up narration when unmounted
  useEffect(() => {
    return () => {
      VoiceNarration.stop();
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleCopyFullScript = () => {
    const text = scenes
      .map(
        (s) => `🎬 ${s.judulScene} (${s.durasiDetik} Detik)
Visual: ${s.visual}
Narasi: ${s.narasi}
${s.dialog ? `Dialog: ${s.dialog}\n` : ""}Gerakan: ${s.gerakan}
Teks Layar: ${s.teksLayar}
Prompt AI Video: ${s.promptAiVideo}`
      )
      .join("\n\n===================================\n\n");

    const header = `STORYBOARD & SCRIPT VIDEO PEMBELAJARAN PAI: ${judulMateri}\nDurasi: ${videoData.durasiTotalDetik} Detik | Orientasi: ${videoData.orientasi} | Gaya: ${videoData.gaya}\n\n`;
    navigator.clipboard.writeText(header + text);
    setHasCopiedScript(true);
    setTimeout(() => setHasCopiedScript(false), 2000);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setHasCopiedPrompt(true);
    setTimeout(() => setHasCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Film className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-700/60 shadow-inner">
              🎬 Video Pembelajaran AI SIPAILMS • Siap Putar
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{judulMateri}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Dapat langsung diputar dengan narasi suara otomatis, animasi scene visual, dan teks overlay!
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("player")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "player"
                ? "bg-purple-600 text-white shadow-lg ring-1 ring-purple-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Pemutar Video</span>
          </button>
          <button
            onClick={() => setActiveTab("storyboard")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "storyboard"
                ? "bg-purple-600 text-white shadow-lg ring-1 ring-purple-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Naskah & Prompt AI</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PEMUTAR VIDEO INTERAKTIF */}
      {activeTab === "player" && (
        <div className="space-y-5">
          {/* Main Video Screen Container */}
          <div
            ref={playerContainerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-purple-900/40 shadow-2xl group select-none ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "aspect-video w-full"
            }`}
          >
            {/* Visual Animated Stage / Scenery */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 overflow-hidden">
              {/* Background ambient Islamic patterns & light rays */}
              <div
                className={`absolute inset-0 opacity-25 transition-transform duration-1000 ease-out ${
                  isPlaying ? "scale-105" : "scale-100"
                }`}
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`
                }}
              />

              {/* Dynamic Islamic Motif / Star Geometry Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                <svg className="w-96 h-96 text-purple-300 animate-spin-slow" viewBox="0 0 100 100" fill="none">
                  <polygon points="50,5 61,38 95,38 67,58 78,91 50,71 22,91 33,58 5,38 39,38" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
              </div>

              {/* Central Scene Illustration & Animation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                {/* Scene Icon / Emblem */}
                <div
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-500/20 via-indigo-500/30 to-amber-400/20 border border-purple-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-2xl transition-all duration-700 ${
                    isPlaying ? "scale-105 shadow-purple-500/30" : "scale-100"
                  }`}
                >
                  <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 animate-pulse text-amber-300" />
                </div>

                {/* Big Scene Title */}
                <div className="inline-block px-3.5 py-1 rounded-full bg-slate-900/80 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-2 backdrop-blur-md">
                  Scene {currentScene.sceneNomor} • {currentScene.judulScene}
                </div>

                {/* Visual Direction Description (Simulated Camera Movement) */}
                <p className="text-xs sm:text-base text-slate-200 max-w-xl font-medium px-4 line-clamp-2 drop-shadow-md">
                  {currentScene.visual}
                </p>

                {/* Camera / Action Badge */}
                <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-amber-300 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20 backdrop-blur-sm">
                  <span>🎥 {currentScene.gerakan}</span>
                </div>
              </div>

              {/* Lower-Third Graphic Banner */}
              {currentScene.teksLayar && (
                <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 z-20 animate-fade-in max-w-md">
                  <div className="bg-slate-900/90 border-l-4 border-amber-400 px-4 py-2 rounded-r-xl shadow-2xl backdrop-blur-md border-t border-r border-b border-slate-700/60">
                    <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">
                      POKOK BAHASAN
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white leading-tight block">
                      {currentScene.teksLayar}
                    </span>
                  </div>
                </div>
              )}

              {/* Subtitles (Narasi Teks) */}
              {showSubtitles && (
                <div className="absolute bottom-16 sm:bottom-20 right-4 left-4 sm:left-auto sm:right-8 sm:max-w-xl z-20 text-center sm:text-right">
                  <div className="inline-block bg-slate-950/85 border border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium text-emerald-200 font-serif leading-relaxed">
                    "{currentScene.narasi}"
                  </div>
                </div>
              )}

              {/* Big Center Play Button Overlay (when paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-950/40 backdrop-blur-xs">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 hover:scale-110 transition-all cursor-pointer border-2 border-white/40"
                    title="Putar Video Sekarang"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3 sm:p-4 z-40 flex flex-col gap-2">
              {/* Progress Scrubber */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-slate-300 w-12 text-right">
                  {formatTime(totalElapsedTime)}
                </span>
                <div
                  className="flex-1 h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer group/bar"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    const targetTime = ratio * videoData.durasiTotalDetik;
                    // Find scene index
                    let acc = 0;
                    for (let i = 0; i < scenes.length; i++) {
                      acc += scenes[i].durasiDetik;
                      if (targetTime <= acc) {
                        goToScene(i, isPlaying);
                        break;
                      }
                    }
                  }}
                >
                  {/* Progress fill */}
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-200 relative"
                    style={{
                      width: `${(totalElapsedTime / (videoData.durasiTotalDetik || 60)) * 100}%`
                    }}
                  />

                  {/* Scene dividers */}
                  {scenes.map((s, idx) => {
                    if (idx === 0) return null;
                    const startTime = getSceneStartTime(idx);
                    const pct = (startTime / videoData.durasiTotalDetik) * 100;
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-950"
                        style={{ left: `${pct}%` }}
                        title={`Scene ${idx + 1}: ${s.judulScene}`}
                      />
                    );
                  })}
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400 w-12">
                  {formatTime(videoData.durasiTotalDetik)}
                </span>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-between">
                {/* Left Controls: Play, Skip, Restart */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 sm:p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer shadow-md"
                    title={isPlaying ? "Jeda (Pause)" : "Putar (Play)"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => goToScene(Math.max(0, activeSceneIdx - 1), isPlaying)}
                    disabled={activeSceneIdx === 0}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Scene Sebelumnya"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => goToScene(Math.min(scenes.length - 1, activeSceneIdx + 1), isPlaying)}
                    disabled={activeSceneIdx === scenes.length - 1}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Scene Berikutnya"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
                    title="Ulangi dari Awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Scene Counter Tag */}
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-purple-300">
                    Scene {activeSceneIdx + 1} / {scenes.length}
                  </span>
                </div>

                {/* Right Controls: Audio, Speed, Subtitles, Fullscreen */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Mute Voice Narration */}
                  <button
                    onClick={() => {
                      const next = !isMuted;
                      setIsMuted(next);
                      if (next) VoiceNarration.stop();
                      else if (isPlaying) VoiceNarration.speak(currentScene.narasi, playbackSpeed);
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isMuted
                        ? "bg-red-950 text-red-300 border border-red-800/60"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                    }`}
                    title={isMuted ? "Suara Narasi Mati (Klik untuk Nyalakan)" : "Suara Narasi Aktif (Klik untuk Mute)"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  {/* Subtitles Toggle */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`p-2 rounded-xl transition cursor-pointer text-xs font-bold ${
                      showSubtitles
                        ? "bg-slate-800 text-amber-400 border border-slate-700"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                    }`}
                    title="Tampilkan / Sembunyikan Teks Subtitle"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>

                  {/* Speed Selector */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-slate-900 text-slate-200 border border-slate-800 text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none cursor-pointer"
                    title="Kecepatan Pemutaran Video"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.25}>1.25x Cepat</option>
                    <option value={1.5}>1.5x Kilat</option>
                  </select>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
                    title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scene Playlist Quick Selector Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Daftar Scene Video ({scenes.length} Bagian):</span>
              <span className="text-purple-400">Klik kartu scene untuk langsung melompat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scenes.map((sc, sIdx) => {
                const isSelected = activeSceneIdx === sIdx;
                return (
                  <button
                    key={sc.sceneNomor}
                    onClick={() => goToScene(sIdx, true)}
                    className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-950/70 border-purple-500 shadow-md ring-2 ring-purple-400/40"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                          Scene {sIdx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {sc.durasiDetik}s
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{sc.judulScene}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 italic">
                        "{sc.narasi}"
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">{sc.teksLayar}</span>
                      {isSelected && isPlaying && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Memutar
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORYBOARD & NASKAH EKSPOR LENGKAP */}
      {activeTab === "storyboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                Naskah & Prompt AI Video Lengkap
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Dapat langsung disalin dan ditempel ke platform video AI eksternal seperti Runway, Kling, Sora, Pika, atau Canva.
              </p>
            </div>
            <button
              onClick={handleCopyFullScript}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-md"
            >
              {hasCopiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{hasCopiedScript ? "Seluruh Naskah Tersalin!" : "Salin Seluruh Naskah"}</span>
            </button>
          </div>

          {/* Meta Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Durasi Total</span>
              <span className="text-white font-extrabold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {videoData.durasiTotalDetik} Detik
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Orientasi</span>
              <span className="text-white font-extrabold flex items-center gap-1 mt-0.5">
                <Monitor className="w-3.5 h-3.5 text-blue-400" /> {videoData.orientasi}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Gaya Visual</span>
              <span className="text-white font-extrabold truncate block mt-0.5">{videoData.gaya}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Karakter Narator</span>
              <span className="text-white font-extrabold truncate block mt-0.5">{videoData.narator}</span>
            </div>
          </div>

          {/* Detailed Scene Cards */}
          <div className="space-y-4">
            {scenes.map((scene, idx) => (
              <div
                key={scene.sceneNomor}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-purple-800/60 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-xs">
                      {scene.sceneNomor}
                    </span>
                    <h4 className="text-base font-bold text-white">{scene.judulScene}</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-amber-300 border border-slate-800 font-mono self-start sm:self-auto">
                    {scene.durasiDetik} Detik
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-1">
                      👁️ Visual Kamera
                    </span>
                    <p className="text-slate-300 leading-relaxed">{scene.visual}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">
                      🎙️ Naskah Narasi
                    </span>
                    <p className="text-emerald-100 font-serif italic leading-relaxed">"{scene.narasi}"</p>
                  </div>
                </div>

                {/* Prompt Generator AI Video */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> Prompt Video AI (Runway / Kling / Pika):
                    </span>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      {scene.promptAiVideo}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(scene.promptAiVideo)}
                    className="px-3 py-1.5 rounded-lg bg-purple-800/60 hover:bg-purple-700 text-purple-200 border border-purple-600/50 text-xs font-bold shrink-0 self-start sm:self-center transition cursor-pointer"
                  >
                    Salin Prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
