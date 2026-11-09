/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Layers,
  Smile,
  UserCheck,
  Eye,
  X,
  Search,
  Phone,
  FileText,
  ArrowRight,
  Sparkles,
  Users
} from "lucide-react";
import { Siswa } from "../../types";
import { DataService } from "../../data/initialData";

export interface StatistikSekolahCardsProps {
  jumlahAkunTerdaftar?: number;
  jumlahAkun?: number;
  dataAkun?: number;
  jumlahRuangKelas?: number;
  dataGuru?: number;
  jumlahGuru?: number;
  teachersCount?: number;
  dataKelas?: number;
  jumlahKelas?: number;
  jumlahTendik?: number;
  dataSiswa?: number;
  jumlahPesertaDidik?: number;
  studentsCount?: number;
  jumlahRombel?: number;
  // Props untuk Guru Wali & Murid Pendampingan
  guruWaliNama?: string;
  guruWaliNip?: string;
  guruWaliKelas?: string;
  muridPendampingan?: Siswa[];
  onOpenGuruWaliTab?: () => void;
  className?: string;
}

export default function StatistikSekolahCards({
  jumlahAkunTerdaftar,
  jumlahAkun,
  dataAkun,
  jumlahRuangKelas,
  dataGuru,
  jumlahGuru,
  teachersCount,
  dataKelas,
  jumlahKelas,
  jumlahTendik,
  dataSiswa,
  jumlahPesertaDidik,
  studentsCount,
  jumlahRombel,
  guruWaliNama,
  guruWaliNip,
  guruWaliKelas,
  muridPendampingan,
  onOpenGuruWaliTab,
  className = ""
}: StatistikSekolahCardsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const displayAkunCount = jumlahAkunTerdaftar ?? jumlahAkun ?? dataAkun ?? jumlahRuangKelas ?? 0;
  const displayGuruCount = dataGuru ?? teachersCount ?? jumlahGuru ?? 1;
  const displayKelasCount = dataKelas ?? jumlahKelas ?? (jumlahTendik !== undefined ? jumlahTendik : 4);
  const displaySiswaCount = dataSiswa ?? studentsCount ?? jumlahPesertaDidik ?? 0;

  // Resolve default Guru Wali and Murid Pendampingan if not supplied via props
  const resolvedGuru = guruWaliNama ? null : DataService.getGuru();
  const displayGuruWaliNama = guruWaliNama || resolvedGuru?.nama || "Sadiqul Alim, S.Pd.I., M.Pd.";
  const displayGuruWaliNip = guruWaliNip || resolvedGuru?.nip || "197909172014071004";
  const displayWaliKelas = guruWaliKelas || resolvedGuru?.waliKelasDi || "VII-A";

  const effectiveMuridList: Siswa[] = React.useMemo(() => {
    if (muridPendampingan && muridPendampingan.length > 0) {
      return muridPendampingan;
    }
    const allStudents = DataService.getSiswa();
    const filtered = allStudents.filter(
      (s) => s.kelasId === displayWaliKelas || (displayWaliKelas === "ALL" && true)
    );
    return filtered.length > 0 ? filtered : allStudents.slice(0, 6);
  }, [muridPendampingan, displayWaliKelas]);

  // Names preview for the card (e.g. "Annisa, Farhan, Lailatul +3 lainnya")
  const namesPreviewText = React.useMemo(() => {
    if (effectiveMuridList.length === 0) return "Belum ada murid binaan";
    const firstNames = effectiveMuridList
      .slice(0, 3)
      .map((s) => s.nama.split(" ")[0]);
    const remaining = effectiveMuridList.length - 3;
    if (remaining > 0) {
      return `${firstNames.join(", ")} +${remaining} lainnya`;
    }
    return firstNames.join(", ");
  }, [effectiveMuridList]);

  // All student names comma separated for tooltip
  const allStudentNamesString = React.useMemo(() => {
    return effectiveMuridList.map((s, idx) => `${idx + 1}. ${s.nama}`).join("\n");
  }, [effectiveMuridList]);

  // Filtered murid list in modal
  const modalFilteredMurid = effectiveMuridList.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.nama.toLowerCase().includes(q) ||
      s.nisn.toLowerCase().includes(q) ||
      (s.catatanKhusus || "").toLowerCase().includes(q) ||
      (s.kontakOrangTua || "").toLowerCase().includes(q)
    );
  });

  const countLaki = effectiveMuridList.filter((s) => s.gender === "Laki-laki").length;
  const countPerempuan = effectiveMuridList.filter((s) => s.gender === "Perempuan").length;

  const cards = [
    {
      id: "akun-terdaftar",
      label: "Jumlah Akun Yang Terdaftar",
      value: displayAkunCount,
      icon: <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#6259ca] to-[#5143b8]" // Purple / Indigo
    },
    {
      id: "data-guru",
      label: "Data Guru",
      value: displayGuruCount,
      icon: <GraduationCap className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#00b4d8] to-[#0096c7]" // Cyan / Sky
    },
    {
      id: "data-kelas",
      label: "Data Kelas",
      value: displayKelasCount,
      icon: <Layers className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#f75834] to-[#ea3a12]" // Orange / Coral
    },
    {
      id: "data-siswa",
      label: "Data Siswa",
      value: displaySiswaCount,
      icon: <Smile className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#00a86b] to-[#008f5a]" // Emerald / Green
    },
    {
      id: "guru-wali",
      label: "Guru Wali",
      value: effectiveMuridList.length,
      icon: <UserCheck className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#e91e63] to-[#c2185b]", // Pink / Magenta
      isGuruWali: true
    }
  ];

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 ${className}`}>
        {cards.map((card) => {
          if (card.isGuruWali) {
            return (
              <div
                key={card.id}
                onClick={() => setIsModalOpen(true)}
                className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-r ${card.gradient} shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[105px] group cursor-pointer border border-white/10`}
                title={`Klik untuk melihat rincian nama murid pendampingan di Guru Wali (${effectiveMuridList.length} Murid)`}
              >
                {/* Ambient soft concentric circles */}
                <div className="w-28 h-28 rounded-full bg-white/10 absolute -right-6 -bottom-6 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="w-18 h-18 rounded-full bg-white/15 absolute -right-2 -bottom-2 pointer-events-none" />

                {/* Top Row: Label, Badge & Icon */}
                <div className="relative z-10 flex items-start justify-between gap-1 w-full">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="block text-xs sm:text-[13px] font-black text-white tracking-tight leading-tight">
                        Guru Wali
                      </span>
                      <span className="inline-block text-[9px] font-extrabold bg-white/25 px-1.5 py-0.2 rounded text-white shadow-2xs">
                        {displayWaliKelas}
                      </span>
                    </div>
                    <span className="block text-2xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none mt-1.5">
                      {card.value}{" "}
                      <span className="text-xs sm:text-sm font-sans font-bold opacity-90">
                        Murid
                      </span>
                    </span>
                  </div>

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
                    {card.icon}
                  </div>
                </div>

                {/* Bottom Row: Student Names Snippet & Interactive Button */}
                <div className="relative z-10 mt-2 pt-2 border-t border-white/20 flex items-center justify-between gap-1">
                  <span
                    className="text-[10px] font-medium text-white/95 truncate max-w-[140px] sm:max-w-[150px]"
                    title={allStudentNamesString}
                  >
                    👥 {namesPreviewText}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    className="text-[9px] font-black uppercase tracking-wider bg-white/25 hover:bg-white/40 active:scale-95 text-white px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Eye className="w-2.5 h-2.5" />
                    <span>Lihat</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-r ${card.gradient} shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between min-h-[105px]`}
            >
              {/* Ambient soft concentric circles */}
              <div className="w-28 h-28 rounded-full bg-white/10 absolute -right-6 -bottom-6 pointer-events-none" />
              <div className="w-18 h-18 rounded-full bg-white/15 absolute -right-2 -bottom-2 pointer-events-none" />

              {/* Left: Label & Big Numeric Value */}
              <div className="relative z-10 pr-2">
                <span className="block text-xs sm:text-[13px] font-bold text-white/95 tracking-tight leading-tight">
                  {card.label}
                </span>
                <span className="block text-3xl sm:text-4xl font-black font-mono tracking-tight text-white leading-none mt-2">
                  {card.value}
                </span>
              </div>

              {/* Right: Circular Icon Badge */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                {card.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL RINCIAN NAMA MURID PENDAMPINGAN GURU WALI */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-800/60 relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      DATA GURU WALI
                    </span>
                    <span className="text-[10px] font-bold text-emerald-200 bg-emerald-800/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                      Rombel Binaan: {displayWaliKelas}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    Daftar Nama Murid Pendampingan Guru Wali
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium">
                    Guru Wali: <strong className="text-amber-300">{displayGuruWaliNama}</strong>{" "}
                    {displayGuruWaliNip && `(NIP: ${displayGuruWaliNip})`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Header Stats & Search */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Total Murid: {effectiveMuridList.length} Siswa</span>
                </span>
                <span className="bg-sky-100 text-sky-900 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-sky-200">
                  👦 Laki-laki: {countLaki}
                </span>
                <span className="bg-pink-100 text-pink-900 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-pink-200">
                  👧 Perempuan: {countPerempuan}
                </span>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama murid, NISN, catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Modal Content: Table of Students */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {modalFilteredMurid.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Smile className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">
                    Tidak ditemukan data murid yang cocok dengan kata kunci "{searchTerm}".
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan ejaan nama atau NISN sudah sesuai.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead className="bg-emerald-900 text-white uppercase text-[10px] font-black tracking-wider">
                      <tr>
                        <th className="px-3.5 py-3 text-center w-12">No</th>
                        <th className="px-4 py-3">Nama Murid Pendampingan</th>
                        <th className="px-3.5 py-3">NISN</th>
                        <th className="px-3 py-3 text-center">L/P</th>
                        <th className="px-3.5 py-3 text-center">Kelas</th>
                        <th className="px-4 py-3">Kontak Orang Tua</th>
                        <th className="px-4 py-3">Catatan Pendampingan Guru Wali</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white font-medium">
                      {modalFilteredMurid.map((murid, idx) => {
                        const initial = (murid.nama || "S").charAt(0).toUpperCase();
                        const isLaki = murid.gender === "Laki-laki";

                        return (
                          <tr
                            key={murid.nisn || idx}
                            className="hover:bg-emerald-50/60 transition-colors"
                          >
                            <td className="px-3.5 py-3 text-center font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs ${
                                    isLaki ? "bg-sky-600" : "bg-pink-600"
                                  }`}
                                >
                                  {initial}
                                </div>
                                <div>
                                  <span className="block font-black text-slate-900 text-xs sm:text-[13px]">
                                    {murid.nama}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    Agama: {murid.agama || "Islam"} • Status: {murid.statusKeaktifan || "Aktif"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-3.5 py-3 font-mono font-bold text-emerald-800">
                              {murid.nisn}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  isLaki
                                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                                    : "bg-pink-100 text-pink-800 border border-pink-200"
                                }`}
                              >
                                {isLaki ? "L" : "P"}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 text-center">
                              <span className="bg-slate-100 text-slate-800 font-extrabold px-2 py-0.5 rounded text-[11px] border border-slate-200">
                                {murid.kelasId || displayWaliKelas}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {murid.kontakOrangTua ? (
                                <a
                                  href={`tel:${murid.kontakOrangTua.replace(/[^0-9+]/g, "")}`}
                                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{murid.kontakOrangTua}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {murid.catatanKhusus ? (
                                <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed">
                                  {murid.catatanKhusus}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">
                                  Belum ada catatan khusus
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
                ℹ️ Data nama murid di atas merupakan murid yang menjadi pendampingan Guru Wali ({displayWaliKelas}).
              </span>

              <div className="flex items-center gap-2">
                {onOpenGuruWaliTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onOpenGuruWaliTab();
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Buka Menu Guru Wali Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
