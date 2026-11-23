/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Maximize2,
  Printer,
  Rows3,
  Square,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import type { HalamanGambarData } from "../../data/bukuPaiKemendikbud";

interface BukuHalamanGambarViewerProps {
  pages: HalamanGambarData[];
  babNomor: number;
  babJudul: string;
  kelasLabel?: string;
}

type ViewMode = "scroll" | "spread" | "single";

export default function BukuHalamanGambarViewer({
  pages,
  babNomor,
  babJudul,
  kelasLabel = "Kelas IX SMP/MTs",
}: BukuHalamanGambarViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("scroll");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(100);

  // Ensure pages are always strictly sorted by page number
  const orderedPages = React.useMemo(
    () => [...pages].sort((a, b) => a.halaman - b.halaman),
    [pages]
  );

  const totalPages = orderedPages.length;

  const handleJumpToPage = (index: number) => {
    setCurrentIndex(index);
    if (viewMode === "scroll") {
      const el = document.getElementById(`buku-halaman-${babNomor}-${orderedPages[index].halaman}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (viewMode === "spread") {
        const aligned = prev % 2 === 0 ? prev - 2 : prev - 1;
        return Math.max(0, aligned);
      }
      return Math.max(0, prev - 1);
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (viewMode === "spread") {
        const aligned = prev % 2 === 0 ? prev + 2 : prev + 1;
        return Math.min(totalPages - 1, aligned);
      }
      return Math.min(totalPages - 1, prev + 1);
    });
  }, [viewMode, totalPages]);

  // Keyboard navigation for lightbox and single/spread modes
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") {
          setLightboxIndex(null);
          setLightboxZoom(100);
        } else if (e.key === "ArrowLeft") {
          setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
        } else if (e.key === "ArrowRight") {
          setLightboxIndex((i) => (i !== null && i < totalPages - 1 ? i + 1 : i));
        }
      } else if (viewMode !== "scroll") {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, totalPages, viewMode, handlePrev, handleNext]);

  // Compute current spread pair (e.g., [0, 1], [2, 3], ...)
  const spreadStart = currentIndex % 2 === 0 ? currentIndex : currentIndex - 1;
  const spreadPages = orderedPages.slice(spreadStart, spreadStart + 2);

  // Width class / style derived from zoomPercent for scroll/single modes
  const getPageMaxWidth = () => {
    const basePx = viewMode === "spread" ? 560 : 760;
    return `${Math.round((basePx * zoomPercent) / 100)}px`;
  };

  return (
    <div className="space-y-5">
      {/* Top Reader Control Toolbar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Reader Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                Halaman Buku Pelajaran Resmi ({kelasLabel} • Bab {babNomor})
              </h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Menampilkan {totalPages} halaman berurutan (Halaman{" "}
                {orderedPages[0]?.halaman ?? 1} s.d.{" "}
                {orderedPages[totalPages - 1]?.halaman ?? totalPages}) • Klik halaman untuk memperbesar
              </p>
            </div>
          </div>

          {/* Controls: View Mode + Zoom + Print */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
              <button
                type="button"
                onClick={() => setViewMode("scroll")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === "scroll"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Tampilkan Semua Halaman Berurutan"
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span>Berurutan</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("spread")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === "spread"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Tampilan 2 Halaman Berdampingan"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>2 Halaman</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("single")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === "single"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Tampilan Fokus 1 Halaman"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Per Halaman</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.max(70, z - 15))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                disabled={zoomPercent <= 70}
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-black text-slate-700 min-w-[38px] text-center">
                {zoomPercent}%
              </span>
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.min(160, z + 15))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                disabled={zoomPercent >= 160}
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition"
              title="Cetak Halaman Buku"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Quick Page Number Strip (Halaman 1 - 20) */}
        <div className="pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0 mr-1">
            Halaman:
          </span>
          {orderedPages.map((pg, idx) => {
            const isActive =
              viewMode === "spread"
                ? idx === spreadStart || idx === spreadStart + 1
                : idx === currentIndex;
            return (
              <button
                key={pg.halaman}
                type="button"
                onClick={() => handleJumpToPage(idx)}
                className={`min-w-[30px] h-7 px-2 rounded-lg text-xs font-extrabold transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200"
                }`}
                title={`Halaman ${pg.halaman} — ${pg.label}`}
              >
                {pg.halaman}
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: SEMUA HALAMAN BERURUTAN (DEFAULT — HAL 1 s.d. 20) */}
      {viewMode === "scroll" && (
        <div className="space-y-6 flex flex-col items-center">
          {orderedPages.map((pg, idx) => (
            <div
              key={pg.halaman}
              id={`buku-halaman-${babNomor}-${pg.halaman}`}
              className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              style={{ maxWidth: getPageMaxWidth() }}
            >
              {/* Page Card Top Strip */}
              <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-[11px] font-black shrink-0">
                    Halaman {pg.halaman}
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate">
                    {pg.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxZoom(100);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition"
                  title="Perbesar Halaman"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Perbesar</span>
                </button>
              </div>

              {/* Page Image */}
              <div
                onClick={() => {
                  setCurrentIndex(idx);
                  setLightboxIndex(idx);
                  setLightboxZoom(100);
                }}
                className="bg-white p-2 sm:p-4 flex justify-center cursor-zoom-in"
              >
                <img
                  src={pg.imageUrl}
                  alt={`Buku PAI ${kelasLabel} Bab ${babNomor} - Halaman ${pg.halaman}: ${pg.label}`}
                  loading={idx < 3 ? "eager" : "lazy"}
                  className="w-full h-auto rounded-lg border border-slate-100 shadow-2xs select-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: 2 HALAMAN BERDAMPINGAN (SPREAD BUKU TERBUKA) */}
      {viewMode === "spread" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-items-center">
            {spreadPages.map((pg) => {
              const realIdx = orderedPages.findIndex((p) => p.halaman === pg.halaman);
              return (
                <div
                  key={pg.halaman}
                  className="w-full bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden"
                  style={{ maxWidth: getPageMaxWidth() }}
                >
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-black shrink-0">
                        Hal. {pg.halaman}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 truncate">
                        {pg.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLightboxIndex(realIdx);
                        setLightboxZoom(100);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-600 cursor-pointer"
                      title="Perbesar Halaman"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div
                    onClick={() => {
                      setLightboxIndex(realIdx);
                      setLightboxZoom(100);
                    }}
                    className="p-2 sm:p-3 bg-white cursor-zoom-in"
                  >
                    <img
                      src={pg.imageUrl}
                      alt={`Halaman ${pg.halaman} - ${pg.label}`}
                      className="w-full h-auto rounded-lg border border-slate-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spread Prev / Next Bar */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={spreadStart <= 0}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Halaman Sebelumnya</span>
            </button>

            <span className="text-xs font-black text-slate-700">
              Halaman {spreadPages[0]?.halaman}
              {spreadPages[1] ? ` – ${spreadPages[1].halaman}` : ""} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={spreadStart + 2 >= totalPages}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>Halaman Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: FOKUS PER HALAMAN (1 HALAMAN) */}
      {viewMode === "single" && orderedPages[currentIndex] && (
        <div className="space-y-4 flex flex-col items-center">
          <div
            className="w-full bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden"
            style={{ maxWidth: getPageMaxWidth() }}
          >
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-black shrink-0">
                  Halaman {orderedPages[currentIndex].halaman} / {totalPages}
                </span>
                <span className="text-xs font-bold text-slate-700 truncate">
                  {orderedPages[currentIndex].label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(currentIndex);
                  setLightboxZoom(100);
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Layar Penuh</span>
              </button>
            </div>
            <div
              onClick={() => {
                setLightboxIndex(currentIndex);
                setLightboxZoom(100);
              }}
              className="p-3 sm:p-5 bg-white cursor-zoom-in"
            >
              <img
                src={orderedPages[currentIndex].imageUrl}
                alt={`Halaman ${orderedPages[currentIndex].halaman} - ${orderedPages[currentIndex].label}`}
                className="w-full h-auto rounded-lg border border-slate-100"
              />
            </div>
          </div>

          {/* Single Page Prev / Next Bar */}
          <div className="w-full max-w-3xl flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Halaman {currentIndex > 0 ? orderedPages[currentIndex - 1].halaman : 1}</span>
            </button>

            <span className="text-xs font-black text-slate-700">
              Halaman {orderedPages[currentIndex].halaman} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= totalPages - 1}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>
                Halaman{" "}
                {currentIndex < totalPages - 1
                  ? orderedPages[currentIndex + 1].halaman
                  : totalPages}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX ZOOM MODAL */}
      {lightboxIndex !== null && orderedPages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-sm flex flex-col"
          onClick={() => {
            setLightboxIndex(null);
            setLightboxZoom(100);
          }}
        >
          {/* Lightbox Header */}
          <div
            className="px-4 sm:px-6 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shrink-0">
                Halaman {orderedPages[lightboxIndex].halaman} / {totalPages}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                Bab {babNomor}: {babJudul} — {orderedPages[lightboxIndex].label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(70, z - 20))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-black min-w-[44px] text-center">
                {lightboxZoom}%
              </span>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(220, z + 20))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(100)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(null);
                  setLightboxZoom(100);
                }}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white ml-1 cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Area */}
          <div
            className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={orderedPages[lightboxIndex].imageUrl}
              alt={`Halaman ${orderedPages[lightboxIndex].halaman} - ${orderedPages[lightboxIndex].label}`}
              className="rounded-xl shadow-2xl bg-white transition-all duration-150"
              style={{
                width: `${Math.round((680 * lightboxZoom) / 100)}px`,
                maxWidth: "none",
                height: "auto",
              }}
            />
          </div>

          {/* Lightbox Footer Navigation */}
          <div
            className="px-4 sm:px-6 py-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
              disabled={lightboxIndex <= 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-bold text-slate-300">
              Halaman {orderedPages[lightboxIndex].halaman} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setLightboxIndex((i) => (i !== null && i < totalPages - 1 ? i + 1 : i))
              }
              disabled={lightboxIndex >= totalPages - 1}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
