/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Search,
  Filter,
  Trash2,
  Copy,
  Eye,
  Video,
  Gamepad2,
  FileText,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Share2
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface HasilGenerateViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  onSelectBundle: (b: BahanAjarAiCompleteBundle) => void;
  onDuplicateBundle: (id: string) => void;
  onDeleteBundle: (id: string) => void;
  onOpenGenerator: () => void;
}

export default function HasilGenerateView({
  bundles,
  onSelectBundle,
  onDuplicateBundle,
  onDeleteBundle,
  onOpenGenerator
}: HasilGenerateViewProps) {
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("SEMUA");

  const filtered = bundles.filter((b) => {
    const matchesSearch =
      b.materi.toLowerCase().includes(search.toLowerCase()) ||
      b.subMateri.toLowerCase().includes(search.toLowerCase());
    const matchesKelas = filterKelas === "SEMUA" || b.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Arsip Karya Bahan Ajar Guru</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hasil Generate Saya ({bundles.length} Modul)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Seluruh produk media pembelajaran PAI yang dihasilkan melalui AI Generator tersimpan di sini. Buka, edit naskah video, mainkan game, cetak LKPD, atau publikasikan ke LMS siswa.
            </p>
          </div>

          <button
            onClick={onOpenGenerator}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start md:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Generate Bahan Ajar Baru</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Filter Kelas:</span>
          {["SEMUA", "7", "8", "9"].map((k) => (
            <button
              key={k}
              onClick={() => setFilterKelas(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterKelas === k
                  ? "bg-blue-900 text-amber-300 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {k === "SEMUA" ? "Semua Kelas" : `Kelas ${k}`}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS GRID */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="text-3xl">🔍</div>
          <h4 className="text-base font-bold text-slate-800">Tidak ada materi yang cocok</h4>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau buat bahan ajar baru dengan generator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((bundle) => (
            <div
              key={bundle.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                    Kelas {bundle.kelas} SMP • Semester Ganjil
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(bundle.tanggalDibuat).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{bundle.materi}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{bundle.subMateri}</p>
                </div>

                {/* Badges of 4 Media Components */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Video & Naskah</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>8 Game Edukasi</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>LKPD Digital A4</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>LMS Terpadu</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectBundle(bundle)}
                  className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka Detail Media</span>
                </button>

                <button
                  title="Duplikat Bahan Ajar"
                  onClick={() => onDuplicateBundle(bundle.id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  title="Hapus Bahan Ajar"
                  onClick={() => onDeleteBundle(bundle.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
