/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Layers,
  Search,
  Filter,
  Copy,
  Trash2,
  ExternalLink,
  BookOpen,
  Video,
  Gamepad2,
  Puzzle,
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  ChevronRight
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface BankBahanAjarViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  onSelectBundle: (bundle: BahanAjarAiCompleteBundle) => void;
  onDuplicateBundle: (id: string) => void;
  onDeleteBundle: (id: string) => void;
  initialTypeFilter?: string;
}

export default function BankBahanAjarView({
  bundles,
  onSelectBundle,
  onDuplicateBundle,
  onDeleteBundle,
  initialTypeFilter
}: BankBahanAjarViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string>("Semua");
  const [selectedProductType, setSelectedProductType] = useState<string>(initialTypeFilter || "Semua");

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        b.subMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guruNama.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      // Class
      if (selectedKelas !== "Semua" && b.kelas !== selectedKelas) {
        return false;
      }

      return true;
    });
  }, [bundles, searchQuery, selectedKelas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
            Penyimpanan Terpusat
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Bank Bahan Ajar AI PAI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar paket media pembelajaran PAI yang telah diproduksi dan tersimpan di database.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
          Total Koleksi: <strong>{bundles.length} Paket</strong>
        </div>
      </div>

      {/* Filter & Search Bar (Sesuai Poin 21) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi, sub materi, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Kelas filter */}
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>
        </div>
      </div>

      {/* Bundles List */}
      {filteredBundles.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-2">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Tidak ada bahan ajar ditemukan</h4>
          <p className="text-xs text-slate-500">
            Sesuaikan filter pencarian Anda atau buat bahan ajar baru melalui generator AI.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBundles.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-[10px]">
                    Kelas {b.kelas} SMP
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(b.tanggalDibuat).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 line-clamp-1">
                  {b.subMateri}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  Materi: {b.materi}
                </p>

                {/* 6 badges */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] font-bold text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">Materi</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-100">Video</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">Quiz</span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">Match</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-100">TTS</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100">LKPD</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-100">CBT ({b.cbt.daftarSoal.length})</span>
                </div>
              </div>

              {/* Action Buttons: Buka, Duplikasi, Hapus */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onDuplicateBundle(b.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Duplikasi Bahan Ajar"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Duplikasi</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus paket "${b.subMateri}"?`)) {
                        onDeleteBundle(b.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onSelectBundle(b)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <span>Buka Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
