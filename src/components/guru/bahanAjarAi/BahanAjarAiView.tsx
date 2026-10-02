/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Video,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  FileText,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  UserCheck
} from "lucide-react";
import { BabPelajaran } from "../../../types";
import {
  MateriPembelajaranItem,
  VideoPembelajaranItem,
  PenugasanBahanAjar,
  SiswaProgressBahanAjar,
  KelasTingkat,
  SemesterTipe
} from "../../../types/bahanAjarAi";
import { DataService } from "../../../data/initialData";

interface BahanAjarAiViewProps {
  babPelajaran: BabPelajaran[];
  onUpdateBabPelajaran: (updated: BabPelajaran[]) => void;
}

export default function BahanAjarAiView({
  babPelajaran,
  onUpdateBabPelajaran
}: BahanAjarAiViewProps) {
  const [activeTab, setActiveTab] = useState<"materi" | "video" | "penugasan">("materi");
  const [selectedKelas, setSelectedKelas] = useState<"Semua" | KelasTingkat>("Semua");
  const [selectedSemester, setSelectedSemester] = useState<"Semua" | SemesterTipe>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [materiList, setMateriList] = useState<MateriPembelajaranItem[]>(() =>
    DataService.getMateriList()
  );
  const [videoList, setVideoList] = useState<VideoPembelajaranItem[]>(() =>
    DataService.getVideoList()
  );
  const [penugasanList, setPenugasanList] = useState<PenugasanBahanAjar[]>(() =>
    DataService.getPenugasanBahanAjarList()
  );
  const [progressList] = useState<SiswaProgressBahanAjar[]>(() =>
    DataService.getSiswaProgressList()
  );

  // Modal State for adding new assignment
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetItem, setAssignTargetItem] = useState<{
    id: string;
    judul: string;
    tipe: "materi" | "video";
    kelas: KelasTingkat;
    semester: SemesterTipe;
  } | null>(null);

  const [assignKelasId, setAssignKelasId] = useState("Semua Kelas VII");
  const [assignInstruksi, setAssignInstruksi] = useState("Bacalah dan pahami intisari materi di bawah ini, kemudian tuliskan refleksi pembelajaran.");
  const [assignBatasWaktu, setAssignBatasWaktu] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

  const [previewMateri, setPreviewMateri] = useState<MateriPembelajaranItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Materi
  const filteredMateri = materiList.filter((m) => {
    const matchKelas = selectedKelas === "Semua" || m.kelas === selectedKelas;
    const matchSem = selectedSemester === "Semua" || m.semester === selectedSemester;
    const matchSearch =
      !searchQuery.trim() ||
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSem && matchSearch;
  });

  // Filtered Video
  const filteredVideo = videoList.filter((v) => {
    const matchKelas = selectedKelas === "Semua" || v.kelas === selectedKelas;
    const matchSem = selectedSemester === "Semua" || v.semester === selectedSemester;
    const matchSearch =
      !searchQuery.trim() ||
      v.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSem && matchSearch;
  });

  const handleOpenAssignModal = (
    item: MateriPembelajaranItem | VideoPembelajaranItem,
    tipe: "materi" | "video"
  ) => {
    setAssignTargetItem({
      id: item.id,
      judul: item.judul,
      tipe,
      kelas: item.kelas,
      semester: item.semester
    });
    setAssignKelasId(`Semua Kelas ${item.kelas}`);
    setIsAssignModalOpen(true);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetItem) return;

    const newPenugasan: PenugasanBahanAjar = {
      id: `tugas-ai-${Date.now()}`,
      tipe: assignTargetItem.tipe,
      referensiId: assignTargetItem.id,
      judul: assignTargetItem.judul,
      kelasId: assignKelasId,
      kelasTingkat: assignTargetItem.kelas,
      semester: assignTargetItem.semester,
      instruksi: assignInstruksi.trim(),
      batasWaktu: assignBatasWaktu,
      tanggalTugas: new Date().toISOString().split("T")[0]
    };

    DataService.savePenugasanBahanAjar(newPenugasan);
    setPenugasanList(DataService.getPenugasanBahanAjarList());
    setIsAssignModalOpen(false);
    setAssignTargetItem(null);
    showToast(`✅ Berhasil menerbitkan penugasan Bahan Ajar AI ke ${assignKelasId}!`);
  };

  const handleDeletePenugasan = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus penugasan ini?")) {
      DataService.deletePenugasanBahanAjar(id);
      setPenugasanList(DataService.getPenugasanBahanAjarList());
      showToast("Penugasan berhasil dihapus.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="font-semibold">{toastMsg}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Sparkles className="w-72 h-72 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SIPAILMS • Ruang Bahan Ajar AI Terpadu
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Pusat Bahan Ajar & Modul Digital PAI
            </h1>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Materi pembelajaran terstruktur Kurikulum Merdeka Fase D (Kelas VII, VIII, IX), video visual, serta generator penugasan daring otomatis untuk seluruh rombel siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Materi PAI</span>
              <span className="text-xs font-black text-amber-300">{materiList.length} Modul</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Video Media</span>
              <span className="text-xs font-black text-emerald-300">{videoList.length} Video</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Penugasan Aktif</span>
              <span className="text-xs font-black text-amber-300">{penugasanList.length} Tugas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("materi")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === "materi"
                  ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Modul & Materi ({filteredMateri.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === "video"
                  ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>🎥 Video Pembelajaran ({filteredVideo.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("penugasan")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === "penugasan"
                  ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>🚀 Penugasan Terbit ({penugasanList.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value as any)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="Semua">Semua Tingkat (7, 8, 9)</option>
              <option value="VII">Kelas VII (Tujuh)</option>
              <option value="VIII">Kelas VIII (Delapan)</option>
              <option value="IX">Kelas IX (Sembilan)</option>
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="Semua">Semua Semester</option>
              <option value="Ganjil">Semester 1 (Ganjil)</option>
              <option value="Genap">Semester 2 (Genap)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi, judul bab, atau topik pembahasan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Content Section: Materi */}
      {activeTab === "materi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMateri.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    Kelas {item.kelas} • {item.semester}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                  {item.judul}
                </h3>
                <p className="text-[11px] font-bold text-emerald-700">
                  {item.bab}
                </p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMateri(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Baca</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAssignModal(item, "materi")}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tugaskan ke Siswa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Section: Video */}
      {activeTab === "video" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideo.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                    Kelas {item.kelas} • {item.semester}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ⏱️ {item.durasi}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                  {item.judul}
                </h3>
                <p className="text-[11px] font-bold text-indigo-700">
                  {item.bab}
                </p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={item.urlVideo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>Tonton</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenAssignModal(item, "video")}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tugaskan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Section: Penugasan Aktif */}
      {activeTab === "penugasan" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Daftar Penugasan Bahan Ajar AI yang Sedang Berjalan
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {penugasanList.length} Penugasan Aktif
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3 w-28">Tipe</th>
                  <th className="p-3">Judul Bahan Ajar</th>
                  <th className="p-3 w-36">Target Kelas</th>
                  <th className="p-3 w-32">Batas Waktu</th>
                  <th className="p-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {penugasanList.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        t.tipe === "materi" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"
                      }`}>
                        {t.tipe === "materi" ? "📚 Materi" : "🎥 Video"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.judul}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{t.instruksi}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {t.kelasId}
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {t.batasWaktu}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeletePenugasan(t.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Hapus Penugasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Terbitkan Tugas Bahan Ajar */}
      {isAssignModalOpen && assignTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Tugaskan Bahan Ajar ke Siswa
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Materi yang Ditugaskan
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">
                  {assignTargetItem.judul} ({assignTargetItem.tipe.toUpperCase()})
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Target Kelas
                </label>
                <input
                  type="text"
                  value={assignKelasId}
                  onChange={(e) => setAssignKelasId(e.target.value)}
                  placeholder="Contoh: VII-A atau Semua Kelas VII"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Instruksi untuk Siswa
                </label>
                <textarea
                  rows={3}
                  value={assignInstruksi}
                  onChange={(e) => setAssignInstruksi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-normal focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Batas Waktu Pengerjaan
                </label>
                <input
                  type="date"
                  value={assignBatasWaktu}
                  onChange={(e) => setAssignBatasWaktu(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md"
                >
                  Terbitkan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Materi */}
      {previewMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Kelas {previewMateri.kelas} • {previewMateri.semester}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {previewMateri.judul}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMateri(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-1">Intisari Bab:</strong>
                {previewMateri.deskripsi}
              </div>

              {previewMateri.dalilQuran && (
                <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">
                    📖 Dalil Rujukan ({previewMateri.dalilQuran.surah} Ayat {previewMateri.dalilQuran.ayat})
                  </span>
                  <div className="text-right font-serif text-lg text-emerald-950">
                    {previewMateri.dalilQuran.arab}
                  </div>
                  <div className="text-slate-700 italic">
                    "{previewMateri.dalilQuran.arti}"
                  </div>
                </div>
              )}

              <div>
                <strong className="block text-slate-900 font-bold mb-2">Isi Materi Lengkap:</strong>
                {previewMateri.isiMateri}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewMateri(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
