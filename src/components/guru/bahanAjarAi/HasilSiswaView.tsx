/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  Gamepad2,
  Search,
  Filter,
  Trash2,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";
import { HasilCbtSiswa, HasilGameSiswa } from "../../../types/bahanAjarAiModern";

export default function HasilSiswaView() {
  const [cbtResults] = useState<HasilCbtSiswa[]>(() => BahanAjarAiStorage.getHasilCbt());
  const [gameResults] = useState<HasilGameSiswa[]>(() => BahanAjarAiStorage.getHasilGame());
  const [activeTab, setActiveTab] = useState<"CBT" | "GAME">("CBT");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCbt = cbtResults.filter(
    (c) =>
      !searchQuery.trim() ||
      c.siswaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cbtJudul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.siswaNisn.includes(searchQuery)
  );

  const filteredGame = gameResults.filter(
    (g) =>
      !searchQuery.trim() ||
      g.siswaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.gameJudul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-700">
            Monitoring Hasil Evaluasi
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Rekap Hasil Siswa (CBT & Game)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan skor ujian CBT otomatis dan capaian permainan edukatif siswa SMP.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100">
          <button
            onClick={() => setActiveTab("CBT")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "CBT" ? "bg-white text-blue-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Hasil Ujian CBT ({cbtResults.length})
          </button>
          <button
            onClick={() => setActiveTab("GAME")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "GAME" ? "bg-white text-blue-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Hasil Game Edukasi ({gameResults.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau judul bahan ajar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-blue-600"
          />
        </div>
      </div>

      {/* Tables */}
      {activeTab === "CBT" ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Rekapitulasi Nilai Ujian CBT Online
          </h3>

          {filteredCbt.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Belum ada riwayat hasil ujian CBT</p>
              <p className="text-[11px]">Siswa yang mengerjakan CBT akan otomatis tercatat nilainya di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px]">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3">Judul Ujian CBT</th>
                    <th className="p-3 text-center">Benar / Total</th>
                    <th className="p-3 text-center">Nilai</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCbt.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {new Date(r.tanggalUjian).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short"
                        })}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{r.siswaNama}</td>
                      <td className="p-3 font-semibold text-slate-600">{r.kelasId}</td>
                      <td className="p-3 text-slate-800 font-medium">{r.cbtJudul}</td>
                      <td className="p-3 text-center font-bold">
                        {r.jumlahBenar} / {r.jumlahBenar + r.jumlahSalah}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                          r.nilai >= 75 ? "bg-emerald-100 text-emerald-950" : "bg-red-100 text-red-950"
                        }`}>
                          {r.nilai}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.statusLulus ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                        }`}>
                          {r.statusLulus ? "Tuntas KKM" : "Remedial"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Rekapitulasi Progres Game Edukasi Siswa
          </h3>

          {filteredGame.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <Gamepad2 className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Belum ada riwayat permainan siswa</p>
              <p className="text-[11px]">Skor Game Quiz Challenge dan Match & Word akan tampil di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px]">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Jenis Permainan</th>
                    <th className="p-3">Judul Game</th>
                    <th className="p-3 text-center">Skor Poin</th>
                    <th className="p-3 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGame.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {new Date(g.tanggalMain).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short"
                        })}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{g.siswaNama}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                          {g.gameTipe}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 font-medium">{g.gameJudul}</td>
                      <td className="p-3 text-center font-black text-emerald-700">
                        {g.skor} Poin
                      </td>
                      <td className="p-3 text-center font-bold">
                        {g.persentaseBenar}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
