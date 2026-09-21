/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  RotateCcw, 
  Search, 
  Filter, 
  Check, 
  X, 
  BookOpen,
  MapPin,
  Users
} from "lucide-react";
import { JadwalPelajaranItem } from "../../types";

interface JadwalPelajaranTableProps {
  jadwalList: JadwalPelajaranItem[];
  onUpdateJadwalList?: (newList: JadwalPelajaranItem[]) => void;
  isEditable?: boolean;
  defaultKelasFilter?: string; // e.g. "VII-A" for student
  role?: "guru" | "siswa" | "guest";
  namaPengguna?: string;
}

export default function JadwalPelajaranTable({
  jadwalList,
  onUpdateJadwalList,
  isEditable = true,
  defaultKelasFilter = "Semua",
  role = "guru",
  namaPengguna = "Pengguna"
}: JadwalPelajaranTableProps) {
  const [selectedHari, setSelectedHari] = useState<string>("Semua");
  const [selectedKelas, setSelectedKelas] = useState<string>(defaultKelasFilter);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddingModalOpen, setIsAddingModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<JadwalPelajaranItem | null>(null);

  // Form states for adding / editing
  const [formJam, setFormJam] = useState<string>("");
  const [formHariTanggal, setFormHariTanggal] = useState<string>("Senin");
  const [formKet, setFormKet] = useState<string>("");
  const [formKelasId, setFormKelasId] = useState<string>("VII-A");
  const [formMapel, setFormMapel] = useState<string>("Pendidikan Agama Islam");
  const [formRuang, setFormRuang] = useState<string>("");

  const daysList = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const kelasOptions = ["Semua", "VII-A", "VII-B", "VIII-A", "VIII-B"];

  // Filtered schedule list
  const filteredJadwal = useMemo(() => {
    return jadwalList.filter((item) => {
      // Day filter
      if (selectedHari !== "Semua") {
        const itemDay = item.hariTanggal.toLowerCase();
        if (!itemDay.includes(selectedHari.toLowerCase())) return false;
      }
      // Class filter
      if (selectedKelas !== "Semua") {
        if (item.kelasId && item.kelasId !== "Semua" && item.kelasId !== selectedKelas) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchKet = item.ket.toLowerCase().includes(query);
        const matchJam = item.jam.toLowerCase().includes(query);
        const matchHari = item.hariTanggal.toLowerCase().includes(query);
        const matchRuang = (item.ruang || "").toLowerCase().includes(query);
        const matchMapel = (item.mapel || "").toLowerCase().includes(query);
        if (!matchKet && !matchJam && !matchHari && !matchRuang && !matchMapel) {
          return false;
        }
      }
      return true;
    });
  }, [jadwalList, selectedHari, selectedKelas, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormJam("07:30 - 09:00 (Jam ke 1-2)");
    setFormHariTanggal(selectedHari !== "Semua" ? selectedHari : "Senin");
    setFormKet("");
    setFormKelasId(selectedKelas !== "Semua" ? selectedKelas : "VII-A");
    setFormMapel("Pendidikan Agama Islam");
    setFormRuang("Mushola Al-Ikhlas");
    setIsAddingModalOpen(true);
  };

  const handleOpenEdit = (item: JadwalPelajaranItem) => {
    setEditingItem(item);
    setFormJam(item.jam);
    setFormHariTanggal(item.hariTanggal);
    setFormKet(item.ket);
    setFormKelasId(item.kelasId || "VII-A");
    setFormMapel(item.mapel || "Pendidikan Agama Islam");
    setFormRuang(item.ruang || "");
    setIsAddingModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJam.trim() || !formHariTanggal.trim() || !formKet.trim()) {
      alert("Mohon lengkapi Jam, Hari/Tanggal, dan Keterangan.");
      return;
    }

    if (!onUpdateJadwalList) return;

    if (editingItem) {
      // Update
      const updated = jadwalList.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              jam: formJam.trim(),
              hariTanggal: formHariTanggal.trim(),
              ket: formKet.trim(),
              kelasId: formKelasId,
              mapel: formMapel.trim(),
              ruang: formRuang.trim()
            }
          : item
      );
      onUpdateJadwalList(updated);
    } else {
      // Add new
      const nextNo = jadwalList.length > 0 ? Math.max(...jadwalList.map((j) => j.no || 0)) + 1 : 1;
      const newItem: JadwalPelajaranItem = {
        id: `jdw-${Date.now()}`,
        no: nextNo,
        jam: formJam.trim(),
        hariTanggal: formHariTanggal.trim(),
        ket: formKet.trim(),
        kelasId: formKelasId,
        mapel: formMapel.trim(),
        ruang: formRuang.trim(),
        guru: "Sadiqul Alim, S.Pd.I., M.Pd."
      };
      onUpdateJadwalList([...jadwalList, newItem]);
    }

    setIsAddingModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      if (onUpdateJadwalList) {
        const updated = jadwalList
          .filter((j) => j.id !== id)
          .map((item, index) => ({ ...item, no: index + 1 }));
        onUpdateJadwalList(updated);
      }
    }
  };

  const handleResetDefault = () => {
    if (confirm("Kembalikan jadwal ke susunan jadwal standar semester ini?")) {
      localStorage.removeItem("pai_lms_jadwal_pelajaran_data");
      window.location.reload();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-400/40 text-amber-300">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Jadwal Pelajaran &amp; Kegiatan KBM</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Semester Berjalan
                </span>
              </h2>
              <p className="text-xs text-emerald-100/80 font-medium">
                UPT SMPN 2 Rebang Tangkas • Pendidikan Agama Islam &amp; Budi Pekerti
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isEditable && onUpdateJadwalList && (
            <button
              onClick={handleOpenAdd}
              type="button"
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md border border-amber-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            type="button"
            className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 hover:text-white text-xs font-bold rounded-xl border border-emerald-700/70 flex items-center gap-1.5 transition cursor-pointer"
            title="Cetak Jadwal Pelajaran"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {isEditable && onUpdateJadwalList && (
            <button
              onClick={handleResetDefault}
              type="button"
              className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 hover:text-amber-300 rounded-xl border border-emerald-800/60 transition cursor-pointer"
              title="Reset ke Jadwal Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Day Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            Hari:
          </span>
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedHari(day)}
              className={`px-3 py-1 rounded-lg font-extrabold text-xs transition shrink-0 cursor-pointer ${
                selectedHari === day
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Right Search & Class Filter */}
        <div className="flex items-center gap-2">
          {/* Kelas selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kelas</option>
              {kelasOptions.filter((k) => k !== "Semua").map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari materi / ruang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table: with top row headers exactly: ( no, jam, hari/tanggal, ket ) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200/90 text-xs font-black uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 w-14 text-center border-r border-slate-200/70">
                no
              </th>
              <th scope="col" className="py-3.5 px-4 w-44 sm:w-52 border-r border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>jam</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 w-44 sm:w-56 border-r border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>hari/tanggal</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ket</span>
                </div>
              </th>
              {isEditable && onUpdateJadwalList && (
                <th scope="col" className="py-3.5 px-4 w-24 text-center">
                  aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredJadwal.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditable && onUpdateJadwalList ? 5 : 4}
                  className="py-8 text-center text-slate-400 italic bg-slate-50/40"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Calendar className="w-7 h-7 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">Tidak ada jadwal yang cocok dengan filter</span>
                    <span className="text-[11px] text-slate-400">Silakan ubah pilihan Hari atau Kelas di atas.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredJadwal.map((item, idx) => {
                const isOdd = idx % 2 === 1;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-amber-50/30 transition duration-150 ${
                      isOdd ? "bg-slate-50/50" : "bg-white"
                    }`}
                  >
                    {/* no */}
                    <td className="py-3 px-4 text-center font-black text-slate-800 border-r border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center text-[11px] font-bold">
                        {item.no ?? idx + 1}
                      </span>
                    </td>

                    {/* jam */}
                    <td className="py-3 px-4 border-r border-slate-100 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-200">
                          {item.jam}
                        </span>
                      </div>
                    </td>

                    {/* hari/tanggal */}
                    <td className="py-3 px-4 border-r border-slate-100 font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="font-extrabold text-slate-900">{item.hariTanggal}</span>
                      </div>
                    </td>

                    {/* ket */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">
                            {item.ket}
                          </span>
                          {item.kelasId && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-slate-700 shrink-0">
                              Kelas {item.kelasId}
                            </span>
                          )}
                        </div>
                        {(item.ruang || item.mapel || item.guru) && (
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium flex-wrap">
                            {item.ruang && (
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <MapPin className="w-3 h-3" />
                                <span>{item.ruang}</span>
                              </span>
                            )}
                            {item.guru && (
                              <span className="text-slate-500">
                                Guru: <strong className="text-slate-700 font-semibold">{item.guru}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* aksi (Guru only) */}
                    {isEditable && onUpdateJadwalList && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Jadwal"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Total Jadwal Aktif: <strong className="text-slate-800 font-bold">{filteredJadwal.length}</strong> sesi pembelajaran
          </span>
        </div>
        <div className="text-slate-400 text-center sm:text-right">
          Tahun Ajaran 2026/2027 • Kurikulum Merdeka UPT SMPN 2 Rebang Tangkas
        </div>
      </div>

      {/* Modal Add / Edit Jadwal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">
                  {editingItem ? "Edit Jadwal Pelajaran" : "Tambah Jadwal Pelajaran Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hari / Tanggal */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hari / Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Senin atau Senin, 13 Juli 2026"
                    value={formHariTanggal}
                    onChange={(e) => setFormHariTanggal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Jam */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jam Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 07:30 - 09:00 (Jam ke 1-2)"
                    value={formJam}
                    onChange={(e) => setFormJam(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kelas */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Kelas
                  </label>
                  <select
                    value={formKelasId}
                    onChange={(e) => setFormKelasId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="VII-A">Kelas VII-A</option>
                    <option value="VII-B">Kelas VII-B</option>
                    <option value="VIII-A">Kelas VIII-A</option>
                    <option value="VIII-B">Kelas VIII-B</option>
                    <option value="Semua">Semua Kelas</option>
                  </select>
                </div>

                {/* Ruang */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ruang / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Mushola Al-Ikhlas, Ruang 7A"
                    value={formRuang}
                    onChange={(e) => setFormRuang(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan (Materi / Kegiatan / Mapel) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: PAI & Budi Pekerti - Materi: Bab 1 Thaharah & Praktek Wudhu di Mushola"
                  value={formKet}
                  onChange={(e) => setFormKet(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? "Simpan Perubahan" : "Tambahkan Jadwal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
