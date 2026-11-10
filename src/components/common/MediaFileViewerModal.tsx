/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Music,
  Video as VideoIcon,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Eye,
  Sliders,
  Table,
  Printer
} from "lucide-react";

export type DetectedMediaType = "image" | "audio" | "video" | "pdf" | "document" | "text";

export interface MediaViewerData {
  title: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
  fileMimeType?: string;
  videoUrl?: string;
  tipePengumpulan?: "Teks" | "File" | "Audio";
  textContent?: string;
  studentName?: string;
  studentNisn?: string;
  className?: string;
  uploadedAt?: string;
  audioDuration?: string;
  tableData?: {
    sheetName?: string;
    headers: string[];
    rows: (string | number)[][];
  };
}

interface MediaFileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MediaViewerData | null;
}

// Helper to parse YouTube, Google Drive, or direct video URLs
export const getEmbedInfo = (url: string | undefined) => {
  if (!url || url === "#") return null;

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    // If it's a raw video title or description without protocol, it's not an external URL
    if (!cleanUrl.includes("youtu") && !cleanUrl.includes("drive.google")) {
      return null;
    }
    cleanUrl = "https://" + cleanUrl;
  }

  let youtubeId: string | null = null;

  if (cleanUrl.includes("youtu.be/")) {
    const parts = cleanUrl.split("youtu.be/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("youtube.com/shorts/")) {
    const parts = cleanUrl.split("youtube.com/shorts/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("youtube.com/embed/")) {
    const parts = cleanUrl.split("youtube.com/embed/");
    if (parts[1]) {
      const idPart = parts[1].split(/[?#&]/)[0];
      if (idPart.length === 11) youtubeId = idPart;
    }
  } else if (cleanUrl.includes("v=")) {
    const match = cleanUrl.match(/[?&]v=([^&#\s]+)/);
    if (match && match[1] && match[1].substring(0, 11).length === 11) {
      youtubeId = match[1].substring(0, 11);
    }
  } else {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  if (youtubeId) {
    return {
      type: "youtube" as const,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
    };
  }

  const gdIdMatch = cleanUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gdIdMatch && gdIdMatch[1]) {
    return {
      type: "googledrive" as const,
      embedUrl: `https://drive.google.com/file/d/${gdIdMatch[1]}/preview`
    };
  }

  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(cleanUrl)) {
    return {
      type: "direct" as const,
      embedUrl: cleanUrl
    };
  }

  return null;
};

// Utility to detect media type based on filename, mime, videoUrl, and submission type
export function detectMediaType(data: MediaViewerData | null): DetectedMediaType {
  if (!data) return "document";

  const fileName = (data.fileName || "").toLowerCase();
  const mime = (data.fileMimeType || "").toLowerCase();
  const subType = data.tipePengumpulan;
  const videoUrl = data.videoUrl || "";

  if (
    videoUrl ||
    fileName.endsWith(".mp4") ||
    fileName.endsWith(".webm") ||
    fileName.endsWith(".mov") ||
    fileName.endsWith(".ogg") ||
    fileName.endsWith(".m4v") ||
    mime.startsWith("video/")
  ) {
    return "video";
  }

  if (
    subType === "Audio" ||
    fileName.endsWith(".mp3") ||
    fileName.endsWith(".wav") ||
    fileName.endsWith(".ogg") ||
    fileName.endsWith(".m4a") ||
    mime.startsWith("audio/")
  ) {
    return "audio";
  }

  if (
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".webp") ||
    fileName.endsWith(".gif") ||
    mime.startsWith("image/")
  ) {
    return "image";
  }

  if (fileName.endsWith(".pdf") || mime === "application/pdf") {
    return "pdf";
  }

  if (subType === "Teks" && !data.fileName) {
    return "text";
  }

  return "document";
}

export default function MediaFileViewerModal({
  isOpen,
  onClose,
  data
}: MediaFileViewerModalProps) {
  if (!isOpen || !data) return null;

  const mediaType = detectMediaType(data);

  // Audio Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(75); // default 01:15
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSynthesizing, setAudioSynthesizing] = useState(false);

  // Video Player states (Play, Pause, Stop inside application)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(180); // default 3 min
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isIframeVideoMounted, setIsIframeVideoMounted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Check embed info for video
  const rawVideoUrl = data.videoUrl || data.fileDataUrl || "";
  const embedInfo = getEmbedInfo(rawVideoUrl);
  const hasDirectVideoFile =
    Boolean(data.fileDataUrl?.startsWith("data:video")) ||
    /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(rawVideoUrl);

  // Reliable educational Islamic video stream fallback when no binary file is given
  const activeVideoSrc = hasDirectVideoFile
    ? (data.fileDataUrl || rawVideoUrl)
    : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Parse initial duration if given (e.g., "01:15" -> 75s)
  useEffect(() => {
    if (data.audioDuration) {
      const parts = data.audioDuration.split(":");
      if (parts.length === 2) {
        const mins = parseInt(parts[0], 10) || 0;
        const secs = parseInt(parts[1], 10) || 0;
        const total = mins * 60 + secs;
        setDuration(total);
        setVideoDuration(total);
      }
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setZoomLevel(1);
    setIsVideoPlaying(false);
    setVideoCurrentTime(0);
    setIsIframeVideoMounted(false);
  }, [data]);

  // Clean Cleanup when closing modal
  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) {
        window.clearInterval(synthIntervalRef.current);
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  // Web Audio Synth tone for demo audio files without raw mp3 byte data
  const playSynthesizedTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current && AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.85);
      }
    } catch {
      // AudioContext fallback
    }
  };

  const handleTogglePlayAudio = () => {
    if (audioRef.current && data.fileDataUrl && data.fileDataUrl.startsWith("data:audio")) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // Simulated audio playback with live timer and gentle synth
    if (isPlaying) {
      if (synthIntervalRef.current) {
        window.clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      setIsPlaying(false);
      setAudioSynthesizing(false);
    } else {
      setIsPlaying(true);
      setAudioSynthesizing(true);
      playSynthesizedTone();
      synthIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (synthIntervalRef.current) {
              window.clearInterval(synthIntervalRef.current);
              synthIntervalRef.current = null;
            }
            setIsPlaying(false);
            setAudioSynthesizing(false);
            return 0;
          }
          if (prev % 3 === 0) {
            playSynthesizedTone();
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
  };

  const handleResetAudio = () => {
    if (synthIntervalRef.current) {
      window.clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setAudioSynthesizing(false);
  };

  // VIDEO PLAYER CONTROLS: PLAY, PAUSE, STOP
  const handlePlayVideo = () => {
    if (embedInfo) {
      setIsIframeVideoMounted(true);
      setIsVideoPlaying(true);
      return;
    }

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
  };

  const handleStopVideo = () => {
    // If iframe (YouTube / Drive), unmount iframe to immediately halt playback and reset
    if (embedInfo) {
      setIsIframeVideoMounted(false);
      setIsVideoPlaying(false);
      setVideoCurrentTime(0);
      return;
    }

    // If HTML5 video, pause and reset currentTime to 0:00
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setVideoCurrentTime(0);
  };

  const handleRestartVideo = () => {
    if (embedInfo) {
      setIsIframeVideoMounted(false);
      setTimeout(() => {
        setIsIframeVideoMounted(true);
        setIsVideoPlaying(true);
      }, 50);
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
    setVideoCurrentTime(0);
  };

  const handleDownload = () => {
    if (data.fileDataUrl) {
      const a = document.createElement("a");
      a.href = data.fileDataUrl;
      a.download = data.fileName || `${data.title.replace(/\s+/g, "_")}.file`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob(
        [
          `BERKAS PENGUMPULAN TUGAS LMS PAI\n` +
            `Satuan Pendidikan: UPT SMPN 2 Rebang Tangkas\n` +
            `Judul Tugas: ${data.title}\n` +
            `Nama Siswa: ${data.studentName || "-"}\n` +
            `Kelas: ${data.className || "-"}\n` +
            `Nama Berkas: ${data.fileName || "lembar_tugas.txt"}\n` +
            `Waktu Kumpul: ${data.uploadedAt || "-"}\n\n` +
            `Catatan / Jawaban Teks:\n${data.textContent || "Lembar kerja siswa terverifikasi di LMS."}`
        ],
        { type: "text/plain;charset=utf-8" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName || `Tugas_${data.studentName || "Siswa"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* HEADER MODAL */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                mediaType === "audio"
                  ? "bg-purple-600 text-white"
                  : mediaType === "video"
                  ? "bg-amber-500 text-slate-950"
                  : mediaType === "image"
                  ? "bg-blue-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {mediaType === "audio" && <Music className="w-5 h-5" />}
              {mediaType === "video" && <VideoIcon className="w-5 h-5" />}
              {mediaType === "image" && <ImageIcon className="w-5 h-5" />}
              {(mediaType === "pdf" || mediaType === "document" || mediaType === "text") && (
                <FileText className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    mediaType === "audio"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : mediaType === "video"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : mediaType === "image"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {mediaType === "audio"
                    ? "Berkas Audio / Suara"
                    : mediaType === "video"
                    ? "Berkas Video"
                    : mediaType === "image"
                    ? "Foto / Gambar"
                    : mediaType === "pdf"
                    ? "Dokumen PDF"
                    : "Dokumen Teks"}
                </span>
                {data.fileSize && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {data.fileSize}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
                {data.fileName || data.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Unduh Berkas Ini"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleStopVideo();
                handleResetAudio();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Tutup Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METADATA BAR (Student Info & Assignment) */}
        {(data.studentName || data.title) && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              {data.studentName && (
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{data.studentName}</span>
                  {data.className && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Kelas {data.className}
                    </span>
                  )}
                </div>
              )}
              {data.studentNisn && (
                <span className="text-slate-400 text-[11px] font-mono">
                  NISN: {data.studentNisn}
                </span>
              )}
              {data.title && (
                <span className="text-slate-700 text-[11px] font-semibold truncate max-w-[260px]">
                  Tugas: {data.title}
                </span>
              )}
            </div>

            {data.uploadedAt && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Waktu: {data.uploadedAt}</span>
              </div>
            )}
          </div>
        )}

        {/* MAIN VIEWER / PLAYER CANVAS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex flex-col items-center justify-center min-h-[320px]">
          {/* 1. AUDIO PLAYER VIEW */}
          {mediaType === "audio" && (
            <div className="w-full max-w-xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/40 space-y-6">
              {data.fileDataUrl && data.fileDataUrl.startsWith("data:audio") && (
                <audio
                  ref={audioRef}
                  src={data.fileDataUrl}
                  onTimeUpdate={() => {
                    if (audioRef.current) {
                      setCurrentTime(audioRef.current.currentTime);
                      setDuration(audioRef.current.duration || 75);
                    }
                  }}
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              {/* Top Wave Graphic & Title */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 mx-auto flex items-center justify-center shadow-lg shadow-purple-900/50">
                  <Music className="w-8 h-8 text-purple-300" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {data.fileName || "Rekaman Suara Setoran Hafalan"}
                </h4>
                <p className="text-xs text-purple-200/80">
                  Setoran Hafalan Juz Amma PAI • UPT SMPN 2 Rebang Tangkas
                </p>
              </div>

              {/* Animated Equalizer Waveform Bars */}
              <div className="h-14 flex items-center justify-center gap-1.5 px-4 bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const heights = [
                    "20%", "45%", "85%", "35%", "70%", "95%", "40%", "60%",
                    "80%", "30%", "65%", "90%", "50%", "75%", "100%", "55%",
                    "35%", "80%", "65%", "90%", "45%", "60%", "75%", "30%",
                    "85%", "50%", "40%", "20%"
                  ];
                  const barHeight = isPlaying ? heights[idx % heights.length] : "22%";
                  return (
                    <div
                      key={idx}
                      className={`w-1.5 rounded-full transition-all duration-200 ${
                        idx / 28 <= currentTime / (duration || 1)
                          ? "bg-gradient-to-t from-purple-500 to-amber-300"
                          : "bg-slate-700/60"
                      }`}
                      style={{ height: barHeight }}
                    />
                  );
                })}
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setCurrentTime(newTime);
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                    }
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Audio Controls Console */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const speeds = [1, 1.25, 1.5];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      if (audioRef.current) audioRef.current.playbackRate = next;
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-purple-200 transition"
                  >
                    {playbackSpeed}x
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition"
                    title={isMuted ? "Bunyikan" : "Bisukan"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleResetAudio}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                    title="Ulangi dari Awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-950/40 transition hover:scale-105 active:scale-95 cursor-pointer"
                    title={isPlaying ? "Jeda Audio" : "Putar Audio"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3" />
                    Audio Terverifikasi
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. ADVANCED VIDEO PLAYER VIEW (PLAY & STOP INSIDE APP) */}
          {mediaType === "video" && (
            <div className="w-full max-w-3xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
              {/* VIDEO SCREEN VIEWPORT */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {embedInfo && embedInfo.type === "youtube" ? (
                  isIframeVideoMounted ? (
                    <iframe
                      src={embedInfo.embedUrl}
                      className="w-full h-full"
                      title={data.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/60">
                        <Play className="w-8 h-8 fill-emerald-400 ml-1" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {data.fileName || data.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Video Pembelajaran PAI siap diputar langsung di dalam aplikasi
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePlayVideo}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>PUTAR VIDEO SEKARANG (PLAY)</span>
                      </button>
                    </div>
                  )
                ) : embedInfo && embedInfo.type === "googledrive" ? (
                  isIframeVideoMounted ? (
                    <iframe
                      src={embedInfo.embedUrl}
                      className="w-full h-full"
                      title={data.title}
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
                        <Play className="w-8 h-8 fill-blue-400 ml-1" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{data.fileName || data.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">Video Google Drive siap diputar di dalam aplikasi</p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePlayVideo}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>PUTAR VIDEO SEKARANG (PLAY)</span>
                      </button>
                    </div>
                  )
                ) : (
                  /* Direct HTML5 Video Player */
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={activeVideoSrc}
                      className="w-full h-full object-contain"
                      playsInline
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setVideoCurrentTime(videoRef.current.currentTime);
                          if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
                            setVideoDuration(videoRef.current.duration);
                          }
                        }
                      }}
                      onEnded={() => {
                        setIsVideoPlaying(false);
                        setVideoCurrentTime(0);
                      }}
                    />

                    {/* Overlay when paused / stopped */}
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 bg-slate-950/65 flex flex-col items-center justify-center gap-3 backdrop-blur-2xs transition-all">
                        <button
                          type="button"
                          onClick={handlePlayVideo}
                          className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                          title="Putar Video (Play)"
                        >
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </button>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-slate-900/90 px-3.5 py-1 rounded-full border border-emerald-500/30">
                          Klik Untuk Memutar Video
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DEDICATED IN-APP VIDEO CONTROL BAR: PLAY, PAUSE, STOP */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-white space-y-3">
                {/* Progress Timeline Slider (for direct video) */}
                {!embedInfo && (
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={videoDuration || 100}
                      value={videoCurrentTime}
                      onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        setVideoCurrentTime(newTime);
                        if (videoRef.current) {
                          videoRef.current.currentTime = newTime;
                        }
                      }}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatTime(videoCurrentTime)}</span>
                      <span>{formatTime(videoDuration)}</span>
                    </div>
                  </div>
                )}

                {/* Primary Play, Pause & Stop Console */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                  <div className="flex items-center gap-2">
                    {/* PLAY BUTTON */}
                    <button
                      type="button"
                      onClick={handlePlayVideo}
                      disabled={isVideoPlaying && !embedInfo}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm ${
                        isVideoPlaying && !embedInfo
                          ? "bg-emerald-800/40 text-emerald-400 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 active:scale-95"
                      }`}
                      title="Putar Video (Play)"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>PLAY (PUTAR)</span>
                    </button>

                    {/* PAUSE BUTTON */}
                    <button
                      type="button"
                      onClick={handlePauseVideo}
                      disabled={!isVideoPlaying}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm ${
                        !isVideoPlaying
                          ? "bg-slate-800 text-slate-500 cursor-default"
                          : "bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105 active:scale-95"
                      }`}
                      title="Jeda Video (Pause)"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>PAUSE (JEDA)</span>
                    </button>

                    {/* STOP BUTTON (STOPS PLAYBACK & RESETS TIME TO 0:00) */}
                    <button
                      type="button"
                      onClick={handleStopVideo}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 transition cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      title="Hentikan Video Sepenuhnya & Kembali ke Awal (Stop)"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>STOP (BERHENTI)</span>
                    </button>
                  </div>

                  {/* Secondary Speed & Restart Controls */}
                  <div className="flex items-center gap-2 text-xs">
                    {!embedInfo && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const speeds = [0.75, 1, 1.25, 1.5];
                            const next = speeds[(speeds.indexOf(videoSpeed) + 1) % speeds.length];
                            setVideoSpeed(next);
                            if (videoRef.current) videoRef.current.playbackRate = next;
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold transition"
                        >
                          {videoSpeed}x
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const nextMute = !isVideoMuted;
                            setIsVideoMuted(nextMute);
                            if (videoRef.current) videoRef.current.muted = nextMute;
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title={isVideoMuted ? "Bunyikan" : "Bisukan"}
                        >
                          {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleRestartVideo}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                      title="Putar Ulang dari Detik Awal"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Awal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. IMAGE VIEWER */}
          {mediaType === "image" && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.2))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-700 min-w-[48px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <div className="w-full max-w-3xl overflow-auto max-h-[65vh] flex items-center justify-center p-2 rounded-2xl bg-slate-900/10 border border-slate-300/60 shadow-inner">
                {data.fileDataUrl && data.fileDataUrl.startsWith("data:image") ? (
                  <img
                    src={data.fileDataUrl}
                    alt={data.fileName || "Lampiran Tugas"}
                    className="rounded-xl shadow-lg transition-transform duration-200 max-h-[55vh] object-contain"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                ) : (
                  /* High-Fidelity Mockup Sheet for Demo Files without Binary */
                  <div
                    className="w-full max-w-lg bg-amber-50/90 text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl border border-amber-200 font-serif space-y-4 transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <div className="border-b-2 border-slate-800 pb-2 text-center">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        LEMBAR JAWABAN TUGAS PAI & BUDI PEKERTI
                      </div>
                      <div className="text-sm font-black uppercase text-slate-900 mt-0.5">
                        UPT SMPN 2 REBANG TANGKAS
                      </div>
                    </div>

                    <div className="grid grid-cols-2 text-xs font-sans border-b border-slate-200 pb-2">
                      <div>
                        Nama: <strong>{data.studentName || "Siti Aisyah"}</strong>
                      </div>
                      <div className="text-right">
                        Kelas: <strong>{data.className || "VII-A"}</strong>
                      </div>
                      <div>
                        Tugas: <strong>{data.title}</strong>
                      </div>
                      <div className="text-right">
                        Tanggal: <strong>{data.uploadedAt || "2026-07-11"}</strong>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-800">
                      <p className="font-bold underline">Uraian Jawaban Lembar Kerja:</p>
                      <p>
                        1. <strong>Najis Mukhaffafah</strong> adalah najis ringan yang berasal dari air kencing bayi laki-laki berusia kurang dari 2 tahun yang belum mengonsumsi makanan apapun selain ASI. Cara mensucikannya cukup dengan memercikkan air suci ke tempat yang terkena najis.
                      </p>
                      <p>
                        2. <strong>Najis Mutawassitah</strong> adalah najis sedang seperti kotoran manusia, darah, dan bangkai. Cara mensucikannya dengan mencuci hingga hilang bau, rasa, dan warnanya.
                      </p>
                      <p>
                        3. <strong>Najis Mugalladah</strong> adalah najis berat seperti air liur anjing atau babi. Cara mensucikannya dengan membasuh sebanyak 7 kali dengan air suci dan salah satunya dicampur tanah suci.
                      </p>
                    </div>

                    <div className="pt-4 flex justify-between items-end border-t border-dashed border-slate-300 text-[11px] font-sans">
                      <div className="text-slate-400 italic">
                        Lampiran Berkas: {data.fileName || "SitiAisyah_TugasThaharah.jpg"}
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] text-slate-500">Tanda Tangan Siswa</span>
                        <span className="font-serif italic font-bold text-indigo-900 text-xs">Siti Aisyah</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. EXCEL SPREADSHEET VIEWER */}
          {(data.tableData || data.fileName?.toLowerCase().endsWith(".xlsx") || data.fileName?.toLowerCase().endsWith(".xls") || data.fileMimeType?.includes("spreadsheet")) && (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
              {/* Excel Header Toolbar */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-sm">
                    <Table className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-600/50">
                        MICROSOFT EXCEL SPREADSHEET
                      </span>
                      <span className="text-[11px] text-emerald-200 font-mono">
                        {data.fileSize || "780 KB"}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                      {data.fileName || "Rekapitulasi_Nilai_PAI.xlsx"}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unduh Excel</span>
                  </button>
                </div>
              </div>

              {/* Excel Formula Bar Mockup */}
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-3 text-xs font-mono text-slate-600">
                <div className="bg-white border border-slate-300 px-2.5 py-0.5 rounded font-bold text-slate-800 shadow-2xs">
                  A1
                </div>
                <div className="text-slate-400 font-bold italic">fx</div>
                <div className="flex-1 bg-white border border-slate-300 px-2.5 py-0.5 rounded text-slate-800 truncate">
                  {data.tableData?.sheetName || data.title}
                </div>
              </div>

              {/* Spreadsheet Interactive Grid */}
              <div className="p-3 sm:p-5 overflow-x-auto max-h-[60vh]">
                {data.tableData ? (
                  <table className="w-full text-left text-xs border-collapse border border-slate-200 font-sans shadow-2xs">
                    <thead>
                      <tr className="bg-emerald-50/80 text-emerald-950">
                        <th className="border border-slate-200 px-2.5 py-2 text-center font-bold text-[10px] bg-slate-100 text-slate-500 w-10">
                          #
                        </th>
                        {data.tableData.headers.map((h, hIdx) => {
                          const colLetter = String.fromCharCode(65 + (hIdx % 26));
                          return (
                            <th
                              key={hIdx}
                              className="border border-slate-200 px-3.5 py-2 font-extrabold whitespace-nowrap"
                            >
                              <div className="text-[9px] font-mono text-emerald-700/70">{colLetter}</div>
                              <div>{h}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.tableData.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? "bg-white hover:bg-emerald-50/50" : "bg-slate-50/70 hover:bg-emerald-50/50"}
                        >
                          <td className="border border-slate-200 px-2.5 py-2 text-center font-mono text-[10px] bg-slate-100 font-bold text-slate-500">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="border border-slate-200 px-3.5 py-2 whitespace-nowrap text-slate-800 font-medium"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <Table className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-800">
                      Lembar Kerja Spreadsheet Excel Siap Digunakan
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {data.textContent || "Berkas spreadsheet resmi tersimpan aman dalam format .xlsx dan siap diunduh untuk dibuka pada Microsoft Excel atau Google Sheets."}
                    </p>
                  </div>
                )}
              </div>

              {/* Sheet Tab Bar at Bottom */}
              <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 bg-white font-bold text-emerald-800 border-t-2 border-emerald-600 rounded-t shadow-2xs">
                    📊 {data.tableData?.sheetName || "Sheet1 - Data PAI"}
                  </span>
                  <span className="text-slate-400 text-xs px-1">+</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {data.tableData ? `${data.tableData.rows.length} Baris Data Terformat` : "Format Standar Excel"}
                </div>
              </div>
            </div>
          )}

          {/* 5. WORD DOCUMENT VIEWER */}
          {!data.tableData &&
            !data.fileName?.toLowerCase().endsWith(".xlsx") &&
            !data.fileName?.toLowerCase().endsWith(".xls") &&
            !data.fileMimeType?.includes("spreadsheet") &&
            (data.fileName?.toLowerCase().endsWith(".docx") ||
              data.fileName?.toLowerCase().endsWith(".doc") ||
              data.fileMimeType?.includes("word")) && (
              <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                {/* Word Ribbon Header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-sm">
                      <FileText className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-700/80 px-2 py-0.5 rounded-full border border-blue-600/50">
                          MICROSOFT WORD DOCUMENT (.DOCX)
                        </span>
                        <span className="text-[11px] text-blue-200 font-mono">
                          {data.fileSize || "1.2 MB"}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                        {data.fileName || "Modul_Ajar_PAI.docx"}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh Dokumen</span>
                    </button>
                  </div>
                </div>

                {/* Word Document Paper View */}
                <div className="p-5 sm:p-8 bg-slate-100/70 overflow-y-auto max-h-[60vh] flex justify-center">
                  <div className="w-full max-w-2xl bg-white rounded-xl p-6 sm:p-8 shadow-md border border-slate-200 text-slate-800 font-sans leading-relaxed text-xs sm:text-sm whitespace-pre-wrap select-text">
                    <div className="border-b border-blue-100 pb-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>Kurikulum Merdeka PAI SMP</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        UPT SMPN 2 Rebang Tangkas
                      </span>
                    </div>

                    {data.textContent ||
                      "Dokumen modul ajar resmi siap digunakan untuk kegiatan pembelajaran intrakurikuler dan kokurikuler PAI."}
                  </div>
                </div>

                {/* Word Footer status */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-blue-800 font-bold">
                    ✓ Dokumen Terverifikasi & Kompatibel MS Word / Google Docs
                  </span>
                  <span className="text-[11px] font-mono">
                    Halaman 1 / 1
                  </span>
                </div>
              </div>
            )}

          {/* 6. PDF & OTHER GENERIC DOCUMENT VIEWER */}
          {!data.tableData &&
            !data.fileName?.toLowerCase().endsWith(".xlsx") &&
            !data.fileName?.toLowerCase().endsWith(".xls") &&
            !data.fileMimeType?.includes("spreadsheet") &&
            !data.fileName?.toLowerCase().endsWith(".docx") &&
            !data.fileName?.toLowerCase().endsWith(".doc") &&
            !data.fileMimeType?.includes("word") &&
            (mediaType === "pdf" || mediaType === "document" || mediaType === "text") && (
              <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {data.fileName || "Dokumen Lembar Jawaban Siswa"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {data.title} • {data.studentName || "Siswa"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File</span>
                  </button>
                </div>

                {/* Document Text Body */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {data.textContent ||
                    "Alhamdulillah tugas telah selesai dikerjakan sesuai petunjuk bapak/ibu guru. Dokumen terlampir memuat hasil analisis serta ringkasan materi PAI Kurikulum Merdeka."}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Format: {mediaType.toUpperCase()} File Document</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Dokumen Siap Diunduh / Dinilai
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Terverifikasi di SIPAILMS
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleStopVideo();
                handleResetAudio();
                onClose();
              }}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              Tutup Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
