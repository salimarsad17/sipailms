/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Check,
  X,
  RotateCcw,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { KurikulumPaiService } from "../../../data/kurikulumPaiSmp";
import { KelasTingkatSmp, KurikulumKelasItem, MateriPokokItem } from "../../../types/bahanAjarAiModern";

export default function DataKurikulumPaiView() {
  const [kurikulum, setKurikulum] = useState<KurikulumKelasItem[]>(() =>
    KurikulumPaiService.getKurikulum()
  );
  const [activeKelas, setActiveKelas] = useState<KelasTingkatSmp>("7");

  // New sub materi state
  const [addingToMateriId, setAddingToMateriId] = useState<string | null>(null);
  const [newSubJudul, setNewSubJudul] = useState("");
  const [newSubDeskripsi, setNewSubDeskripsi] = useState("");

  // Edit sub materi state
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editMateriId, setEditMateriId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState("");

  const currentKelasData = kurikulum.find((k) => k.kelas === activeKelas) || kurikulum[0];

  const handleAddSubMateri = (materiId: string) => {
    if (!newSubJudul.trim()) return;
    const updated = KurikulumPaiService.addSubMateri(activeKelas, materiId, {
      judul: newSubJudul.trim(),
      deskripsiSingkat: newSubDeskripsi.trim()
    });
    setKurikulum(updated);
    setAddingToMateriId(null);
    setNewSubJudul("");
    setNewSubDeskripsi("");
  };

  const handleStartEdit = (materiId: string, subId: string, currentJ: string, currentD?: string) => {
    setEditMateriId(materiId);
    setEditingSubId(subId);
    setEditJudul(currentJ);
    setEditDeskripsi(currentD || "");
  };

  const handleSaveEdit = () => {
    if (!editingSubId || !editMateriId || !editJudul.trim()) return;
    const updated = KurikulumPaiService.updateSubMateri(activeKelas, editMateriId, editingSubId, {
      judul: editJudul.trim(),
      deskripsiSingkat: editDeskripsi.trim()
    });
    setKurikulum(updated);
    setEditingSubId(null);
    setEditMateriId(null);
  };

  const handleDeleteSubMateri = (materiId: string, subId: string) => {
    if (!confirm("Hapus sub materi ini dari daftar kurikulum?")) return;
    const updated = KurikulumPaiService.deleteSubMateri(activeKelas, materiId, subId);
    setKurikulum(updated);
  };

  const handleResetKurikulum = () => {
    if (!confirm("Kembalikan struktur kurikulum PAI ke setelan standar bawaan?")) return;
    const def = KurikulumPaiService.resetToDefault();
    setKurikulum(def);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
            Database Kurikulum Fleksibel
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Struktur Data Kurikulum PAI SMP
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin dan guru dapat menambah, mengubah, atau menghapus sub materi kurikulum secara langsung tanpa menyentuh kode program.
          </p>
        </div>

        <button
          onClick={handleResetKurikulum}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Bawaan</span>
        </button>
      </div>

      {/* Grade Selector Tabs: Kelas 7, Kelas 8, Kelas 9 */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 w-fit">
        {(["7", "8", "9"] as KelasTingkatSmp[]).map((k) => (
          <button
            key={k}
            onClick={() => setActiveKelas(k)}
            className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
              activeKelas === k
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kelas {k} SMP
          </button>
        ))}
      </div>

      {/* Curriculum Trees for Current Grade */}
      <div className="space-y-4">
        {currentKelasData.materiList.map((materi) => (
          <div
            key={materi.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black uppercase">
                  {materi.kategori}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {materi.judulMateri}
                </h3>
              </div>

              <button
                onClick={() => setAddingToMateriId(materi.id)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex items-center gap-1 self-start sm:self-center transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Sub Materi</span>
              </button>
            </div>

            {/* Sub Materi List */}
            <div className="space-y-2">
              {materi.subMateriList.map((sub, sIdx) => {
                const isEditing = editingSubId === sub.id;

                if (isEditing) {
                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3"
                    >
                      <input
                        type="text"
                        value={editJudul}
                        onChange={(e) => setEditJudul(e.target.value)}
                        placeholder="Judul Sub Materi..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        value={editDeskripsi}
                        onChange={(e) => setEditDeskripsi(e.target.value)}
                        placeholder="Deskripsi singkat / fokus materi..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs text-slate-800"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan Perubahan</span>
                        </button>
                        <button
                          onClick={() => setEditingSubId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">
                        {sIdx + 1}. {sub.judul}
                      </span>
                      {sub.deskripsiSingkat && (
                        <p className="text-slate-500 text-[11px]">{sub.deskripsiSingkat}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(materi.id, sub.id, sub.judul, sub.deskripsiSingkat)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                        title="Edit Sub Materi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubMateri(materi.id, sub.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Sub Materi Inline Form */}
            {addingToMateriId === materi.id && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 animate-fadeIn">
                <span className="text-xs font-black uppercase text-blue-900 block">
                  Tambah Sub Materi Baru ke "{materi.judulMateri}"
                </span>
                <input
                  type="text"
                  placeholder="Judul Sub Materi (misal: Hukum Bacaan Al-Syamsiyah)..."
                  value={newSubJudul}
                  onChange={(e) => setNewSubJudul(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Fokus ringkasan bahasan (opsional)..."
                  value={newSubDeskripsi}
                  onChange={(e) => setNewSubDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs text-slate-800"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddSubMateri(materi.id)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Database</span>
                  </button>
                  <button
                    onClick={() => setAddingToMateriId(null)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
