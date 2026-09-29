/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Puzzle, Plus, Edit, Trash2, Upload, Send, Play, Layers } from "lucide-react";
import { PuzzleItem } from "../../../types/bahanAjarAi";

interface PuzzleTabProps {
  puzzles: PuzzleItem[];
  onAdd: () => void;
  onEdit: (item: PuzzleItem) => void;
  onDelete: (id: string) => void;
  onUpload: (item: PuzzleItem) => void;
  onAssign: (item: PuzzleItem) => void;
  onPreview: (item: PuzzleItem) => void;
}

export default function PuzzleTab({
  puzzles,
  onAdd,
  onEdit,
  onDelete,
  onUpload,
  onAssign,
  onPreview
}: PuzzleTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-900/40 via-emerald-800/20 to-transparent p-4 rounded-2xl border border-emerald-600/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Puzzle Pembelajaran PAI
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {puzzles.length} Puzzle
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Puzzle interaktif susun potongan ayat Al-Qur'an, rukun ibadah, dan kartu istilah sejarah Islam.
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Puzzle Baru
        </button>
      </div>

      {puzzles.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 p-8">
          <Puzzle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">Belum ada Puzzle Pembelajaran</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">Tambahkan puzzle susun ayat atau kartu istilah pertama.</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            + Buat Puzzle Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {puzzles.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Kelas {p.kelas}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Semester {p.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-900/40 text-teal-300 border border-teal-500/30">
                      {p.tipePuzzle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{p.potonganList.length} Potongan</span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-1">{p.judul}</h4>
                <p className="text-xs text-emerald-400/90 font-medium mb-2">{p.bab}</p>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">{p.deskripsi}</p>

                <div className="bg-slate-800/60 p-2.5 rounded-xl mb-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400">Preview Potongan Kartu / Ayat:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {p.potonganList.slice(0, 4).map((piece, idx) => (
                      <div
                        key={piece.id}
                        className="bg-slate-900/90 border border-slate-700 p-1.5 rounded-lg text-[11px] text-slate-200 truncate"
                        title={piece.teks}
                      >
                        <span className="text-emerald-400 font-bold mr-1">#{idx + 1}</span>
                        {piece.teks}
                      </div>
                    ))}
                  </div>
                  {p.potonganList.length > 4 && (
                    <div className="text-[10px] text-slate-400 text-right">+{p.potonganList.length - 4} kartu lagi</div>
                  )}
                </div>

                {p.lampiranFile && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg mb-3 flex items-center justify-between">
                    <span>Lampiran: {p.lampiranFile.namaFile}</span>
                    <span className="text-slate-400">{p.lampiranFile.ukuran}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(p)}
                    title="Uji Coba Puzzle"
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition text-xs font-bold flex items-center gap-1 px-2.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Susun</span>
                  </button>
                  <button
                    onClick={() => onUpload(p)}
                    title="Upload Berkas"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(p)}
                    title="Edit Puzzle"
                    className="p-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    title="Hapus Puzzle"
                    className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-900/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onAssign(p)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
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
