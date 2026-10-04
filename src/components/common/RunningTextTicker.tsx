/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Award } from "lucide-react";

interface RunningTextTickerProps {
  customText?: string;
  className?: string;
}

export default function RunningTextTicker({
  customText = "Guru Kreatif Siswa Aktif",
  className = ""
}: RunningTextTickerProps) {
  // Items in the ticker
  const tickerItems = [
    { text: customText, isHighlight: true },
    { text: "Menuju Generasi Qur'ani, Berakhlak Mulia & Cerdas Berkarakter", isHighlight: false },
    { text: customText, isHighlight: true },
    { text: "Pembelajaran Bermakna PAI & Budi Pekerti UPT SMPN 2 Rebang Tangkas", isHighlight: false },
    { text: customText, isHighlight: true },
    { text: "Berinovasi Mendidik dengan Hati, Bersemangat Meraih Prestasi", isHighlight: false },
  ];

  return (
    <div
      className={`relative z-20 overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/50 shadow-xs print:hidden ${className}`}
      role="region"
      aria-label="Running Text Informasi & Motto"
    >
      <div className="flex items-center">
        {/* Left Fixed Badge */}
        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-900 to-emerald-950 border-r border-emerald-700/60 shadow-md shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <div className="flex items-center gap-1 text-amber-300 font-black text-[10px] sm:text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">MOTTO:</span>
          </div>
        </div>

        {/* Marquee Scrolling Viewport */}
        <div className="flex-1 overflow-hidden relative py-1.5 sm:py-2 select-none">
          {/* Subtle gradient fades at edges for smooth entry/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-emerald-950 to-transparent z-1 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-950 to-transparent z-1 pointer-events-none"></div>

          {/* Double content container for infinite seamless loop */}
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {/* First Set */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
              {tickerItems.map((item, idx) => (
                <div key={`set1-${idx}`} className="flex items-center gap-3">
                  {item.isHighlight ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm tracking-wide shadow-xs">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.text}</span>
                    </span>
                  ) : (
                    <span className="text-emerald-100/90 text-xs sm:text-sm font-medium">
                      {item.text}
                    </span>
                  )}
                  <span className="text-amber-400/50 font-bold">•</span>
                </div>
              ))}
            </div>

            {/* Second Duplicate Set for 100% Seamless Continuous Loop */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
              {tickerItems.map((item, idx) => (
                <div key={`set2-${idx}`} className="flex items-center gap-3">
                  {item.isHighlight ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm tracking-wide shadow-xs">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.text}</span>
                    </span>
                  ) : (
                    <span className="text-emerald-100/90 text-xs sm:text-sm font-medium">
                      {item.text}
                    </span>
                  )}
                  <span className="text-amber-400/50 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
