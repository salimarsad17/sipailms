/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Video,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Play,
  Send,
  Calendar,
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import {
  MateriPembelajaranItem,
  VideoPembelajaranItem,
  PenugasanBahanAjar,
  SiswaProgressBahanAjar
} from "../../types/bahanAjarAi";
import { Siswa } from "../../types";
import { DataService } from "../../data/initialData";

interface BahanAjarAiSiswaViewProps {
  siswa: Siswa;
}

export default function BahanAjarAiSiswaView({ siswa }: BahanAjarAiSiswaViewProps) {
  // Extract grade level from student class (e.g., "VII-A" -> "VII", "VIII-B" -> "VIII", "IX-C" -> "IX")
  const studentKelasTingkat = siswa.kelasId?.startsWith("VII")
    ? "VII"
    : siswa.kelasId?.startsWith("VIII")
    ? "VIII"
    : siswa.kelasId?.startsWith("IX")
    ? "IX"
    : "VII";

  const [activeTab, setActiveTab] = useState<"tugas" | "materi" | "video">("tugas");
  const [selectedSemester, setSelectedSemester] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [materiList] = useState<MateriPembelajaranItem[]>(() => DataService.getMateriList());
  const [videoList] = useState<VideoPembelajaranItem[]>(() => DataService.getVideoList());
  const [penugasanList] = useState<PenugasanBahanAjar[]>(() => DataService.getPenugasanBahanAjarList());
  const [progressList, setProgressList] = useState<SiswaProgressBahanAjar[]>(() =>
    DataService.getSiswaProgressList()
  );

  const [viewingMateri, setViewingMateri] = useState<MateriPembelajaranItem | null>(null);
  const [viewingVideo, setViewingVideo] = useState<VideoPembelajaranItem | null>(null);

  const [refleksiText, setRefleksiText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter assignments matching this student's class
  const studentTasks = penugasanList.filter((t) => {
    const matchClass =
      t.kelasId === siswa.kelasId ||
      t.kelasId === `Semua Kelas ${studentKelasTingkat}` ||
      t.kelasId === "Semua Kelas";
    const matchSemester = selectedSemester === "Semua" || t.semester === selectedSemester;
    return matchClass && matchSemester;
  });

  // Filter materials for this student's grade
  const studentMateri = materiList.filter((m) => {
    const matchGrade = m.kelas === studentKelasTingkat;
    const matchSemester = selectedSemester === "Semua" || m.semester === selectedSemester;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSemester && matchSearch;
  });

  // Filter videos for this student's grade
  const studentVideos = videoList.filter((v) => {
    const matchGrade = v.kelas === studentKelasTingkat;
    const matchSemester = selectedSemester === "Semua" || v.semester === selectedSemester;
    const matchSearch =
      v.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSemester && matchSearch;
  });

  const getProgress = (referensiId: string): SiswaProgressBahanAjar | undefined => {
    return progressList.find(
      (p) => p.siswaNisn === siswa.nisn && p.referensiId === referensiId
    );
  };

  const handleMarkComplete = (referensiId: string, tipe: "materi" | "video") => {
    const newProgress: SiswaProgressBahanAjar = {
      id: `prog-${Date.now()}`,
      siswaNisn: siswa.nisn,
      referensiId,
      tipe,
      status: "Selesai",
      catatanRefleksi: refleksiText.trim(),
      tanggalSelesai: new Date().toISOString().split("T")[0]
    };

    DataService.saveSiswaProgress(newProgress);
    setProgressList(DataService.getSiswaProgressList());
    setRefleksiText("");
    setViewingMateri(null);
    setViewingVideo(null);
    showToast("🎉 Hebat! Pembelajaran telah diselesaikan dan dicatat.");
  };

  const getEmbedYoutubeUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-900 text-white border border-emerald-500 shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Ruang Belajar Bahan Ajar AI • Kelas {studentKelasTingkat}
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              Materi &amp; Video Pembelajaran PAI
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/80 mt-1 max-w-xl">
              Pelajari materi kurikulum terstruktur, simak video edukasi bermutu, dan selesaikan tugas pembelajaran mandiri secara interaktif.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-500/30 text-xs shrink-0">
            <span className="text-emerald-300 font-bold block">Peserta Didik:</span>
            <span className="font-black text-sm text-white block">{siswa.nama}</span>
            <span className="text-slate-300 font-mono text-[11px]">
              Kelas {siswa.kelasId} • NISN: {siswa.nisn}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {/* Tab 1: Tugas dari Guru */}
          <button
            type="button"
            onClick={() => setActiveTab("tugas")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "tugas"
                ? "bg-amber-500 text-slate-950 shadow-md border-b-2 border-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Tugas dari Guru</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-white font-mono font-bold">
              {studentTasks.length}
            </span>
          </button>

          {/* Tab 2: Materi */}
          <button
            type="button"
            onClick={() => setActiveTab("materi")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "materi"
                ? "bg-emerald-700 text-white shadow-md border-b-2 border-amber-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Materi Pembelajaran</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 font-mono">
              {studentMateri.length}
            </span>
          </button>

          {/* Tab 3: Video */}
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === "video"
                ? "bg-purple-700 text-white shadow-md border-b-2 border-amber-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>2. Video Pembelajaran</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950 text-purple-300 font-mono">
              {studentVideos.length}
            </span>
          </button>
        </div>

        {/* Filter semester */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="Semua">Semua</option>
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>
        </div>
      </div>

      {/* ==================== TAB 1: TUGAS DARI GURU ==================== */}
      {activeTab === "tugas" && (
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Tugas Bahan Ajar Aktif ({studentTasks.length})</span>
          </h2>

          {studentTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada tugas bahan ajar yang sedang berlangsung.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Kamu dapat langsung mengeksplorasi tab Materi dan Video Pembelajaran di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentTasks.map((tugas) => {
                const prog = getProgress(tugas.referensiId);
                const isDone = prog?.status === "Selesai";

                return (
                  <div
                    key={tugas.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                      isDone
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tugas.tipe === "materi" ? "📚 Modul Materi" : "🎬 Video Pelajaran"}
                        </span>

                        {isDone ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Selesai
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Perlu Dikerjakan
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                          {tugas.judul}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                          "{tugas.instruksi}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> Tenggat: {tugas.batasWaktu}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      {tugas.tipe === "materi" ? (
                        <button
                          type="button"
                          onClick={() => {
                            const found = materiList.find((m) => m.id === tugas.referensiId);
                            if (found) setViewingMateri(found);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Buka Materi</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const found = videoList.find((v) => v.id === tugas.referensiId);
                            if (found) setViewingVideo(found);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Tonton Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: MATERI PEMBELAJARAN ==================== */}
      {activeTab === "materi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentMateri.map((item) => {
              const prog = getProgress(item.id);
              const isDone = prog?.status === "Selesai";

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                        {item.bab}
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Dipelajari
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    {item.dalilQuran && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
                        <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                          {item.dalilQuran.surah} {item.dalilQuran.ayat ? `:${item.dalilQuran.ayat}` : ""}
                        </span>
                        <p className="font-arabic text-right font-bold text-slate-800 dark:text-slate-200">
                          {item.dalilQuran.arab}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Semester {item.semester}</span>
                    <button
                      type="button"
                      onClick={() => setViewingMateri(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Baca Materi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: VIDEO PEMBELAJARAN ==================== */}
      {activeTab === "video" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentVideos.map((item) => {
              const prog = getProgress(item.id);
              const isDone = prog?.status === "Selesai";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={getEmbedYoutubeUrl(item.urlVideo)}
                        title={item.judul}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                          {item.bab}
                        </span>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Ditonton
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">Durasi: {item.durasi}</span>
                    <button
                      type="button"
                      onClick={() => setViewingVideo(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 shadow transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Buka &amp; Refleksi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== MODAL: BACA MATERI SISWA ==================== */}
      {viewingMateri && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8 relative">
            <button
              type="button"
              onClick={() => setViewingMateri(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
              {viewingMateri.bab}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {viewingMateri.judul}
            </h2>

            {viewingMateri.dalilQuran && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 my-4 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {viewingMateri.dalilQuran.surah} {viewingMateri.dalilQuran.ayat ? `:${viewingMateri.dalilQuran.ayat}` : ""}
                </span>
                <p className="text-base font-arabic text-right text-slate-900 dark:text-slate-100 font-bold leading-loose">
                  {viewingMateri.dalilQuran.arab}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{viewingMateri.dalilQuran.arti}"
                </p>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line py-2 max-h-72 overflow-y-auto border-y border-slate-100 dark:border-slate-800 my-3 pr-2">
              {viewingMateri.isiMateri}
            </div>

            {/* Reflection and complete button */}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Catatan Refleksi Pemahaman Siswa:
              </label>
              <textarea
                rows={2}
                value={refleksiText}
                onChange={(e) => setRefleksiText(e.target.value)}
                placeholder="Tuliskan apa yang kamu pelajari dari materi ini..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setViewingMateri(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkComplete(viewingMateri.id, "materi")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai Membaca &amp; Kirim Refleksi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: TONTON VIDEO SISWA ==================== */}
      {viewingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 relative">
            <button
              type="button"
              onClick={() => setViewingVideo(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
              {viewingVideo.bab}
            </span>
            <h2 className="text-xl font-black">{viewingVideo.judul}</h2>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={getEmbedYoutubeUrl(viewingVideo.urlVideo)}
                title={viewingVideo.judul}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                Catatan Refleksi Setelah Menonton Video:
              </label>
              <textarea
                rows={2}
                value={refleksiText}
                onChange={(e) => setRefleksiText(e.target.value)}
                placeholder="Tuliskan poin penting yang kamu dapatkan dari video ini..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setViewingVideo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkComplete(viewingVideo.id, "video")}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai Menonton &amp; Simpan Catatan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
