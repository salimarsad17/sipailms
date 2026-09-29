/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gamepad2, Plus, Edit, Trash2, Upload, Send, Play, Sparkles, Clock, Heart } from "lucide-react";
import { GameEdukasiItem } from "../../../types/bahanAjarAi";

interface GameTabProps {
  games: GameEdukasiItem[];
  onAdd: () => void;
  onEdit: (item: GameEdukasiItem) => void;
  onDelete: (id: string) => void;
  onUpload: (item: GameEdukasiItem) => void;
  onAssign: (item: GameEdukasiItem) => void;
  onPreview: (item: GameEdukasiItem) => void;
}

export default function GameTab({
  games,
  onAdd,
  onEdit,
  onDelete,
  onUpload,
  onAssign,
  onPreview
}: GameTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-900/40 via-amber-800/20 to-transparent p-4 rounded-2xl border border-amber-600/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Game Edukasi PAI
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {games.length} Game Aktif
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Kuis gamifikasi interaktif dengan nyawa, timer, dan skor otomatis untuk siswa.
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Game Baru
        </button>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 p-8">
          <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">Belum ada Game Edukasi</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">Tambahkan kuis game pertama atau gunakan preset.</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            + Buat Game Edukasi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((g) => (
            <div
              key={g.id}
              className="bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Kelas {g.kelas}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Semester {g.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/50 text-purple-300 border border-purple-500/30">
                      {g.tipeGame}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{g.soalList.length} Soal</span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-1">{g.judul}</h4>
                <p className="text-xs text-amber-400/90 font-medium mb-2">{g.bab}</p>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">{g.deskripsi}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-xl mb-3">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{g.waktuPerSoalDetik} dtk/soal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{g.jumlahNyawa} Nyawa</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 ml-auto">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{g.soalList.reduce((acc, q) => acc + q.poin, 0)} Poin Total</span>
                  </div>
                </div>

                {g.lampiranFile && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg mb-3 flex items-center justify-between">
                    <span>Lampiran: {g.lampiranFile.namaFile}</span>
                    <span className="text-slate-400">{g.lampiranFile.ukuran}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(g)}
                    title="Uji Coba Game"
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition text-xs font-bold flex items-center gap-1 px-2.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mainkan</span>
                  </button>
                  <button
                    onClick={() => onUpload(g)}
                    title="Upload Berkas"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(g)}
                    title="Edit Game"
                    className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(g.id)}
                    title="Hapus Game"
                    className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-900/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onAssign(g)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
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
