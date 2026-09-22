/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Presentation, ChevronLeft, ChevronRight, Copy, Check, MessageSquare, Maximize2 } from "lucide-react";
import { SlidePptItem } from "../../../types/bahanAjarAi";

interface PptSlideViewerProps {
  slides: SlidePptItem[];
  judulMateri: string;
}

export default function PptSlideViewer({ slides, judulMateri }: PptSlideViewerProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [hasCopiedPpt, setHasCopiedPpt] = useState<boolean>(false);

  const activeSlide = slides[currentSlideIdx] || slides[0];

  const handleCopyAllSlides = () => {
    const text = slides
      .map(
        (s, idx) => `=== SLIDE ${idx + 1}: ${s.judulSlide} ===
${s.subJudul ? `Sub-judul: ${s.subJudul}\n` : ""}
Poin Materi:
${s.poinKonten.map((p) => `• ${p}`).join("\n")}

Catatan Guru/Presenter:
${s.catatanPresenter}
`
      )
      .join("\n----------------------------------------\n\n");

    navigator.clipboard.writeText(`SLIDE PRESENTASI PAI: ${judulMateri}\n\n${text}`);
    setHasCopiedPpt(true);
    setTimeout(() => setHasCopiedPpt(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header PPT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-400/10 text-orange-400 border border-orange-400/20">
              <Presentation className="w-5 h-5" />
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-950 text-orange-300 border border-orange-800/60">
              📊 Slide Presentasi PPT • {slides.length} Slide
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">Materi Tayang / Slide Interaktif</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Format presentasi ringkas dan berdaya ingat tinggi untuk proyektor kelas
          </p>
        </div>

        <button
          onClick={handleCopyAllSlides}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          {hasCopiedPpt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
          <span>{hasCopiedPpt ? "Tersalin!" : "Salin Format Slide (PPT/Canva)"}</span>
        </button>
      </div>

      {/* Main Slide Stage */}
      {activeSlide && (
        <div className="space-y-4">
          <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/60 border-2 border-slate-700/80 p-6 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden">
            {/* Slide Header Decor */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  SIPAILMS • Pembelajaran Berdiferensiasi
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Slide {currentSlideIdx + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Body */}
            <div className="my-auto py-4 space-y-4">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {activeSlide.judulSlide}
              </h2>
              {activeSlide.subJudul && (
                <p className="text-sm sm:text-base font-semibold text-amber-300">{activeSlide.subJudul}</p>
              )}

              <div className="space-y-2.5 pt-2">
                {activeSlide.poinKonten.map((poin, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2"></span>
                    <span className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">{poin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span>Pendidikan Agama Islam & Budi Pekerti</span>
              <span>Tata Nilai & Penguatan Profil Pelajar Pancasila</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto px-1">
            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Slide Sebelumnya
            </button>

            {/* Slide dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setCurrentSlideIdx(sIdx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlideIdx === sIdx ? "w-7 bg-amber-400" : "w-2.5 bg-slate-800 hover:bg-slate-700"
                  }`}
                  title={`Ke Slide ${sIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIdx === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              Slide Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Presenter Notes */}
          <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Catatan Guru / Speaker Notes (Slide {currentSlideIdx + 1}):</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">{activeSlide.catatanPresenter}</p>
          </div>
        </div>
      )}
    </div>
  );
}
