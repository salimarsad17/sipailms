/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  Video as VideoIcon,
  Download,
  AlertCircle
} from "lucide-react";
import {
  getEmbedInfo,
  getDefaultPaiYoutubeUrl,
  isPlaceholderVideoUrl
} from "../../utils/videoEmbed";
import { isIndexedDbVideoUrl, resolveVideoBlobUrl } from "../../services/videoBlobStorage";

export interface PaiVideoPlayerProps {
  videoKey: string;
  judul: string;
  kelas?: string;
  materi?: string;
  durasi?: string;
  dalil?: string;
  terjemahan?: string;
  naskah?: string;
  videoUrl?: string;
  autoPlay?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onOpenModalViewer?: () => void;
  onEnded?: () => void;
  compact?: boolean;
}

function formatSeconds(secs: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(secs) ? secs : 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PaiVideoPlayer({
  videoKey,
  judul,
  kelas,
  materi,
  durasi = "08:00",
  dalil = "",
  terjemahan = "",
  naskah = "",
  videoUrl = "",
  autoPlay = false,
  onEdit,
  onDelete,
  onShare,
  onOpenModalViewer,
  onEnded
}: PaiVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Always guarantee a real playable video URL (user's link/upload or verified PAI YouTube video)
  const effectiveRawUrl = useMemo(() => {
    if (!isPlaceholderVideoUrl(videoUrl)) return videoUrl.trim();
    return getDefaultPaiYoutubeUrl(kelas, `${judul} ${materi || ""}`);
  }, [videoUrl, kelas, judul, materi]);

  const [iframeAutoPlay, setIframeAutoPlay] = useState<boolean>(autoPlay);
  const [iframeRefreshKey, setIframeRefreshKey] = useState<number>(0);

  const embedInfo = useMemo(
    () => getEmbedInfo(effectiveRawUrl, iframeAutoPlay),
    [effectiveRawUrl, iframeAutoPlay]
  );

  const isYouTube = embedInfo.type === "youtube";
  const isIframeEmbed =
    embedInfo.type === "youtube" ||
    embedInfo.type === "googledrive" ||
    embedInfo.type === "vimeo";
  const isDirectVideo = embedInfo.type === "direct";

  const [resolvedDirectUrl, setResolvedDirectUrl] = useState<string>("");
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [directDuration, setDirectDuration] = useState<number>(0);

  // Send native YouTube IFrame API command via postMessage
  const sendYouTubeCommand = (func: string, args: unknown[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch {
      // ignore cross-origin postMessage errors
    }
  };

  // Resolve local IndexedDB video files
  useEffect(() => {
    let active = true;
    setVideoLoadError(null);

    if (!isDirectVideo || !embedInfo.embedUrl) {
      setResolvedDirectUrl("");
      return;
    }

    if (isIndexedDbVideoUrl(embedInfo.embedUrl)) {
      resolveVideoBlobUrl(embedInfo.embedUrl).then((url) => {
        if (!active) return;
        if (url) {
          setResolvedDirectUrl(url);
        } else {
          setVideoLoadError(
            "Berkas video lokal tidak ditemukan di perangkat ini. Silakan unggah ulang file video atau masukkan link YouTube."
          );
        }
      });
    } else {
      setResolvedDirectUrl(embedInfo.embedUrl);
    }

    return () => {
      active = false;
    };
  }, [isDirectVideo, embedInfo.embedUrl]);

  // Reset player whenever active video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setDirectDuration(0);
    setVideoLoadError(null);
    setIframeAutoPlay(autoPlay);
    setIsPlaying(autoPlay);
    setIframeRefreshKey((k) => k + 1);
  }, [videoKey, effectiveRawUrl]);

  // Autoplay HTML5 video if requested
  useEffect(() => {
    if (autoPlay && isDirectVideo && resolvedDirectUrl && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [autoPlay, isDirectVideo, resolvedDirectUrl]);

  const handlePlay = () => {
    setVideoLoadError(null);
    if (isYouTube) {
      sendYouTubeCommand("playVideo");
      if (!iframeAutoPlay) {
        setIframeAutoPlay(true);
      }
      setIsPlaying(true);
      return;
    }
    if (isIframeEmbed) {
      setIframeAutoPlay(true);
      setIframeRefreshKey((k) => k + 1);
      setIsPlaying(true);
      return;
    }
    if (isDirectVideo && videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handlePause = () => {
    if (isYouTube) {
      sendYouTubeCommand("pauseVideo");
      setIsPlaying(false);
      return;
    }
    if (isDirectVideo && videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (isYouTube) {
      sendYouTubeCommand("stopVideo");
      setIframeAutoPlay(false);
      setIframeRefreshKey((k) => k + 1);
      setIsPlaying(false);
      return;
    }
    if (isIframeEmbed) {
      setIframeAutoPlay(false);
      setIframeRefreshKey((k) => k + 1);
      setIsPlaying(false);
      return;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    if (isYouTube) {
      sendYouTubeCommand("seekTo", [0, true]);
      sendYouTubeCommand("playVideo");
      if (!iframeAutoPlay) {
        setIframeAutoPlay(true);
        setIframeRefreshKey((k) => k + 1);
      }
      setIsPlaying(true);
      return;
    }
    if (isIframeEmbed) {
      setIframeAutoPlay(true);
      setIframeRefreshKey((k) => k + 1);
      setIsPlaying(true);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    setCurrentTime(0);
  };

  const handleDownloadNote = () => {
    if (isDirectVideo && resolvedDirectUrl) {
      const a = document.createElement("a");
      a.href = resolvedDirectUrl;
      a.download = `${judul.replace(/\s+/g, "_")}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const blob = new Blob(
      [
        `BERKAS VIDEO PEMBELAJARAN PAI\n` +
          `Satuan Pendidikan: UPT SMPN 2 Rebang Tangkas\n` +
          `Judul Video: ${judul}\n` +
          `Kelas: ${kelas ? `Kelas ${kelas} SMP` : "-"}\n` +
          `Materi: ${materi || "-"}\n` +
          `Durasi: ${durasi}\n` +
          `Dalil Naqli: ${dalil || "-"}\n` +
          `Terjemahan: ${terjemahan || "-"}\n` +
          `Tautan Video: ${embedInfo.watchUrl || effectiveRawUrl}\n\n` +
          `Ringkasan Naskah Materi:\n${naskah || "-"}`
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Video_PAI_${judul.replace(/[^a-zA-Z0-9]+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
      {/* 1. TOP DARK HEADER (EXACT STYLE FROM SCREENSHOT) */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <VideoIcon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                BERKAS VIDEO
              </span>
              {durasi && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {durasi}
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
              {judul}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadNote}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Unduh Berkas / Ringkasan Video"
          >
            <Download className="w-4 h-4" />
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Edit Video / Ganti Link YouTube atau Upload MP4"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Hapus Video"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {onOpenModalViewer && (
            <button
              type="button"
              onClick={onOpenModalViewer}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Buka Viewer Layar Besar"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. METADATA SUB-BAR */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="font-semibold text-slate-700 truncate">
            Materi: {judul}
          </span>
          {kelas && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
              Kelas {kelas} SMP
            </span>
          )}
          {materi && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              • {materi}
            </span>
          )}
        </div>

        {embedInfo.watchUrl && !isIndexedDbVideoUrl(embedInfo.watchUrl) && (
          <a
            href={embedInfo.watchUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Buka di YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* 3. LIGHT GRAY CANVAS CONTAINER WITH ROUNDED DARK VIDEO PLAYER */}
      <div className="p-4 sm:p-5 bg-slate-100 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
          {/* VIDEO SCREEN VIEWPORT (16:9) */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {isIframeEmbed ? (
              <iframe
                ref={iframeRef}
                key={`${videoKey}-${iframeRefreshKey}`}
                src={embedInfo.embedUrl}
                className="w-full h-full border-0"
                title={judul}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : isDirectVideo ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                {resolvedDirectUrl && !videoLoadError ? (
                  <video
                    ref={videoRef}
                    src={resolvedDirectUrl}
                    controls
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain bg-black"
                    onLoadedMetadata={() => {
                      if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
                        setDirectDuration(videoRef.current.duration);
                      }
                    }}
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                      onEnded?.();
                    }}
                    onError={() => {
                      setIsPlaying(false);
                      setVideoLoadError(
                        "Format video tidak didukung oleh browser atau tautan tidak dapat diakses."
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                    <p className="text-xs text-slate-200 max-w-md leading-relaxed">
                      {videoLoadError || "Memuat berkas video..."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center space-y-2">
                <VideoIcon className="w-10 h-10 text-amber-400" />
                <p className="text-xs text-slate-300">Tautan video tidak dikenali.</p>
              </div>
            )}
          </div>

          {/* DEDICATED IN-APP VIDEO CONTROL BAR: PLAY (PUTAR), PAUSE (JEDA), STOP (BERHENTI), ULANGI AWAL */}
          <div className="p-3.5 sm:p-4 bg-slate-900 border-t border-slate-800 text-white space-y-3">
            {/* Progress slider for direct HTML5 video */}
            {isDirectVideo && (
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={directDuration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const nextTime = parseFloat(e.target.value);
                    setCurrentTime(nextTime);
                    if (videoRef.current) {
                      videoRef.current.currentTime = nextTime;
                    }
                  }}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(directDuration)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Left primary controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlay}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
                  title="Putar Video (Play)"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY (PUTAR)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePause}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm ${
                    isPlaying
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-[1.02] active:scale-95"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Jeda Video (Pause)"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE (JEDA)</span>
                </button>

                <button
                  type="button"
                  onClick={handleStop}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
                  title="Hentikan Video & Kembali ke Awal (Stop)"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>STOP (BERHENTI)</span>
                </button>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                {isDirectVideo && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const speeds = [0.75, 1, 1.25, 1.5];
                        const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                        setPlaybackSpeed(next);
                        if (videoRef.current) videoRef.current.playbackRate = next;
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs transition cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextMute = !isMuted;
                        setIsMuted(nextMute);
                        if (videoRef.current) videoRef.current.muted = nextMute;
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      title={isMuted ? "Bunyikan" : "Bisukan"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Putar Ulang dari Detik Awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Awal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WHITE FOOTER BAR (EXACT STATUS & ACTION BAR FROM SCREENSHOT) */}
      <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Status:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            Terverifikasi di SIPAILMS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share ke Siswa</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadNote}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Berkas</span>
          </button>

          {onOpenModalViewer && (
            <button
              type="button"
              onClick={onOpenModalViewer}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer shadow-xs"
            >
              Buka Viewer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
