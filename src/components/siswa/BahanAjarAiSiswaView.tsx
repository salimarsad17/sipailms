/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Video,
  Gamepad2,
  Puzzle,
  FileText,
  CheckCircle2,
  Layers,
  Search,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Siswa, RekapNilaiTotal } from "../../types";
import { BahanAjarAiCompleteBundle, KelasTingkatSmp } from "../../types/bahanAjarAiModern";
import { BahanAjarAiStorage } from "../../services/bahanAjarAiStorage";
import { BahanAjarAiGeneratorEngine } from "../../services/bahanAjarAiGeneratorEngine";
import BahanAjarAiResultView from "../guru/bahanAjarAi/BahanAjarAiResultView";

interface BahanAjarAiSiswaViewProps {
  siswa: Siswa;
  rekapNilai?: RekapNilaiTotal[];
  onUpdateRekapNilai?: (updatedRec: RekapNilaiTotal) => void;
  onNavigateToLms?: () => void;
}

export default function BahanAjarAiSiswaView({ siswa }: BahanAjarAiSiswaViewProps) {
  // Determine student grade
  const kelasGrade: KelasTingkatSmp = siswa.kelasId?.includes("8") || siswa.kelasId?.includes("VIII")
    ? "8"
    : siswa.kelasId?.includes("9") || siswa.kelasId?.includes("IX")
    ? "9"
    : "7";

  const [bundles, setBundles] = useState<BahanAjarAiCompleteBundle[]>(() =>
    BahanAjarAiStorage.getBundles()
  );

  const [selectedBundle, setSelectedBundle] = useState<BahanAjarAiCompleteBundle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBundles = bundles.filter(
    (b) =>
      b.kelas === kelasGrade &&
      (!searchQuery.trim() ||
        b.subMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.materi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {selectedBundle ? (
        <BahanAjarAiResultView
          bundle={selectedBundle}
          onUpdateBundle={(updated) => {
            setSelectedBundle(updated);
            BahanAjarAiStorage.saveBundle(updated);
            setBundles(BahanAjarAiStorage.getBundles());
          }}
          onBack={() => setSelectedBundle(null)}
          isStudentMode={true}
        />
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-blue-800/60">
            <div className="relative z-10 space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-800/80 border border-blue-600/60 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Media Pembelajaran Digital Siswa SMP</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                BAHAN AJAR AI PAI KELAS {kelasGrade}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Marhaban, <strong>{siswa.nama}</strong>! Jelajahi materi PAI interaktif, tonton video storyboard animasi, 
                mainkan <strong>6 Game Visual Edukasi PAI</strong> (Quiz Adventure, Match & Discover, Tebak Gambar, Susun Kata, Memory Card, Roda Keberuntungan), 
                pecahkan <strong>Teka-Teki Silang (TTS)</strong>, kerjakan <strong>LKPD</strong>, serta latih kemampuanmu di <strong>CBT Online</strong>.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari materi pembelajaran PAI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-blue-600"
              />
            </div>
          </div>

          {/* Bundles for student's grade */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-700" />
                Daftar Paket Pembelajaran Kelas {kelasGrade} SMP
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {filteredBundles.length} Paket Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBundles.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBundle(b)}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-[10px]">
                        Kelas {b.kelas} SMP
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Pendidik: {b.guruNama}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition">
                      {b.subMateri}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      Materi: {b.materi}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100">📚 Materi</span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-100">🎬 Video</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">🎮 6 Game Visual</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">🧠 TTS</span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-100">📝 LKPD</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-50 border border-cyan-100">💻 CBT ({b.cbt.daftarSoal.length} Soal)</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 group-hover:from-blue-600 group-hover:to-indigo-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5">
                    <span>Mulai Belajar & Kerjakan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
