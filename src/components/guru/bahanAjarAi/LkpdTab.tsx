/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileSpreadsheet, Plus, Edit, Trash2, Upload, Send, Eye, FileText, CheckCircle, Clock } from "lucide-react";
import { SoalLkpdItem } from "../../../types/bahanAjarAi";

interface LkpdTabProps {
  lkpdList: SoalLkpdItem[];
  onAdd: () => void;
  onEdit: (item: SoalLkpdItem) => void;
  onDelete: (id: string) => void;
  onUpload: (item: SoalLkpdItem) => void;
  onAssign: (item: SoalLkpdItem) => void;
  onPreview: (item: SoalLkpdItem) => void;
}

export default function LkpdTab({
  lkpdList,
  onAdd,
  onEdit,
  onDelete,
  onUpload,
  onAssign,
  onPreview
}: LkpdTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-teal-900/40 via-teal-800/20 to-transparent p-4 rounded-2xl border border-teal-600/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Soal &amp; Lembar Kerja Peserta Didik (LKPD) PAI
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-400/30">
                {lkpdList.length} LKPD Lengkap
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Modul lembar kerja siswa berstandar kurikulum dengan stimulus, indikator, esai analisis, dan rubrik penilaian.
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah LKPD Baru
        </button>
      </div>

      {lkpdList.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 p-8">
          <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">Belum ada Soal LKPD</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">Tambahkan instrumen LKPD untuk menugaskan peserta didik.</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            + Buat LKPD Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lkpdList.map((lk) => (
            <div
              key={lk.id}
              className="bg-slate-900/80 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Kelas {lk.kelas}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Semester {lk.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lk.alokasiWaktu}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold">{lk.daftarSoal.length} Butir Soal</span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-1">{lk.judul}</h4>
                <p className="text-xs text-teal-400/90 font-medium mb-2">{lk.bab}</p>

                <div className="bg-slate-800/60 p-2.5 rounded-xl mb-3 space-y-2">
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-amber-300">Capaian Pembelajaran:</span>{" "}
                    <span className="line-clamp-2 text-slate-400">{lk.capaianPembelajaran}</span>
                  </div>
                  <div className="border-t border-slate-700/60 pt-1.5">
                    <div className="text-[10px] font-bold text-slate-400 mb-1">Butir Pertanyaan:</div>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {lk.daftarSoal.slice(0, 2).map((s) => (
                        <li key={s.nomor} className="flex items-start gap-1.5">
                          <span className="font-bold text-teal-400 shrink-0">{s.nomor}.</span>
                          <span className="truncate">{s.pertanyaan}</span>
                          <span className="ml-auto text-[9px] px-1 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                            {s.skorMaks}p
                          </span>
                        </li>
                      ))}
                      {lk.daftarSoal.length > 2 && (
                        <li className="text-[10px] text-slate-500 italic">+{lk.daftarSoal.length - 2} soal lainnya</li>
                      )}
                    </ul>
                  </div>
                </div>

                {lk.lampiranFile && (
                  <div className="text-[11px] text-teal-300 bg-teal-950/40 border border-teal-500/30 px-2.5 py-1.5 rounded-lg mb-3 flex items-center justify-between">
                    <span>Lampiran: {lk.lampiranFile.namaFile}</span>
                    <span className="text-slate-400">{lk.lampiranFile.ukuran}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(lk)}
                    title="Buka Lembar Kerja"
                    className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition text-xs font-bold flex items-center gap-1 px-2.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat LKPD</span>
                  </button>
                  <button
                    onClick={() => onUpload(lk)}
                    title="Upload Berkas"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(lk)}
                    title="Edit LKPD"
                    className="p-1.5 rounded-lg bg-slate-800 text-teal-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(lk.id)}
                    title="Hapus LKPD"
                    className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-900/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onAssign(lk)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  Tugaskan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
