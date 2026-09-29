/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Grid, Plus, Edit, Trash2, Upload, Send, Play, HelpCircle } from "lucide-react";
import { TekaTekiSilangItem } from "../../../types/bahanAjarAi";

interface TtsTabProps {
  ttsList: TekaTekiSilangItem[];
  onAdd: () => void;
  onEdit: (item: TekaTekiSilangItem) => void;
  onDelete: (id: string) => void;
  onUpload: (item: TekaTekiSilangItem) => void;
  onAssign: (item: TekaTekiSilangItem) => void;
  onPreview: (item: TekaTekiSilangItem) => void;
}

export default function TtsTab({
  ttsList,
  onAdd,
  onEdit,
  onDelete,
  onUpload,
  onAssign,
  onPreview
}: TtsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-transparent p-4 rounded-2xl border border-blue-600/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Teka-Teki Silang (TTS) PAI
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {ttsList.length} Modul TTS
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Crossword interaktif dengan kisi-kisi mendatar & menurun untuk mengasah daya ingat istilah PAI.
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah TTS Baru
        </button>
      </div>

      {ttsList.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 p-8">
          <Grid className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">Belum ada Teka-Teki Silang</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">Tambahkan kisi-kisi TTS pertama untuk melatih siswa.</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
          >
            + Buat TTS Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ttsList.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/80 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Kelas {t.kelas}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Semester {t.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/40 text-cyan-300">
                      Grid {t.ukuranGrid.baris}x{t.ukuranGrid.kolom}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{t.clues.length} Pertanyaan</span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-1">{t.judul}</h4>
                <p className="text-xs text-blue-400/90 font-medium mb-2">{t.bab}</p>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">{t.deskripsi}</p>

                <div className="bg-slate-800/60 p-2.5 rounded-xl mb-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="text-blue-300">
                      Mendatar: {t.clues.filter((c) => c.tipe === "mendatar").length} kata
                    </span>
                    <span className="text-cyan-300">
                      Menurun: {t.clues.filter((c) => c.tipe === "menurun").length} kata
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.clues.slice(0, 4).map((c) => (
                      <span key={c.nomor + c.tipe} className="text-[10px] px-2 py-0.5 bg-slate-900 rounded text-slate-400">
                        {c.nomor}. {c.jawaban.length} huruf ({c.tipe})
                      </span>
                    ))}
                    {t.clues.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400">+{t.clues.length - 4} lagi</span>
                    )}
                  </div>
                </div>

                {t.lampiranFile && (
                  <div className="text-[11px] text-blue-300 bg-blue-950/40 border border-blue-500/30 px-2.5 py-1.5 rounded-lg mb-3 flex items-center justify-between">
                    <span>Lampiran: {t.lampiranFile.namaFile}</span>
                    <span className="text-slate-400">{t.lampiranFile.ukuran}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(t)}
                    title="Uji Coba TTS"
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition text-xs font-bold flex items-center gap-1 px-2.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Buka TTS</span>
                  </button>
                  <button
                    onClick={() => onUpload(t)}
                    title="Upload Berkas"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(t)}
                    title="Edit TTS"
                    className="p-1.5 rounded-lg bg-slate-800 text-blue-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    title="Hapus TTS"
                    className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-900/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onAssign(t)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
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
