/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Plus,
  Play,
  FileText,
  Gamepad2,
  Layers,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Share2
} from "lucide-react";
import { KurikulumPaiService } from "../../../data/kurikulumPaiSmp";
import { KelasTingkatSmp, KurikulumKelasItem, MateriPokokItem, BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface MateriKelasViewProps {
  kelas: KelasTingkatSmp;
  bundles: BahanAjarAiCompleteBundle[];
  onGenerateForMateri: (materi: string, subMateri: string, kelas: KelasTingkatSmp) => void;
  onOpenBundle: (bundle: BahanAjarAiCompleteBundle) => void;
}

export default function MateriKelasView({
  kelas,
  bundles,
  onGenerateForMateri,
  onOpenBundle
}: MateriKelasViewProps) {
  const kurikulum = KurikulumPaiService.getKurikulum();
  const currentKelasData = kurikulum.find((k) => k.kelas === kelas) || kurikulum[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("SEMUA");
  const [selectedSemester, setSelectedSemester] = useState<string>("SEMUA");

  // Filter materials for this class
  const classBundles = bundles.filter((b) => b.kelas === kelas);

  const filteredMateriList = currentKelasData.materiList.filter((m) => {
    const matchesSearch =
      m.judulMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subMateriList.some((s) => s.judul.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesKategori = selectedKategori === "SEMUA" || m.kategori === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  const getRomawiKelas = (k: string) => {
    if (k === "7") return "VII";
    if (k === "8") return "VIII";
    return "IX";
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER KELAS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <span>Kurikulum Merdeka • Fase D</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Materi PAI & Budi Pekerti Kelas {getRomawiKelas(kelas)} SMP
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Daftar bab kurikulum terpadu semester ganjil dan genap. Pilih topik apa saja untuk membuat video pembelajaran AI, game interaktif, LKPD digital, dan modul LMS otomatis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="block text-2xl font-black text-amber-400">{currentKelasData.materiList.length}</span>
              <span className="text-[11px] font-bold text-slate-200">Bab Pokok</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="block text-2xl font-black text-emerald-400">{classBundles.length}</span>
              <span className="text-[11px] font-bold text-slate-200">Bahan Ajar Siap</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari bab materi atau submateri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </span>
          {["SEMUA", "Al-Qur'an & Hadis", "Akidah", "Akhlak", "Fikih", "Sejarah Peradaban Islam"].map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedKategori === kat
                  ? "bg-blue-900 text-amber-300 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* MATERI LIST CARDS */}
      <div className="space-y-4">
        {filteredMateriList.map((materi, idx) => {
          // Check if there is an existing generated bundle for this materi
          const existingBundle = classBundles.find((b) => b.materi === materi.judulMateri);

          return (
            <div
              key={materi.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                      Bab {idx + 1} • {materi.kategori}
                    </span>
                    {existingBundle && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bahan Ajar Tersedia
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-900 transition">
                    {materi.judulMateri}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {existingBundle ? (
                    <button
                      onClick={() => onOpenBundle(existingBundle)}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buka Bahan Ajar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onGenerateForMateri(
                          materi.judulMateri,
                          materi.subMateriList[0]?.judul || materi.judulMateri,
                          kelas
                        )
                      }
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate dengan AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub Materi Chips */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                  Sub-Materi & Pokok Bahasan ({materi.subMateriList.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {materi.subMateriList.map((sub, sIdx) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition flex items-start justify-between gap-2 shadow-2xs group/sub"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {sIdx + 1}. {sub.judul}
                        </span>
                        {sub.deskripsiSingkat && (
                          <span className="text-[10px] text-slate-500 line-clamp-1 block">
                            {sub.deskripsiSingkat}
                          </span>
                        )}
                      </div>
                      <button
                        title="Buat media untuk submateri ini"
                        onClick={() => onGenerateForMateri(materi.judulMateri, sub.judul, kelas)}
                        className="opacity-0 group-hover/sub:opacity-100 p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
