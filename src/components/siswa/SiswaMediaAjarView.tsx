/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  MonitorPlay,
  Video as VideoIcon,
  Gamepad2,
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  BookOpen,
  FileText,
  Trophy
} from "lucide-react";
import { Siswa, RekapNilaiTotal } from "../../types";
import {
  SharedMediaAjarStorage,
  SharedMediaAjarItem,
  SharedMediaSubmission,
  SharedMediaType,
  SHARED_MEDIA_UPDATED_EVENT
} from "../../services/sharedMediaAjarStorage";
import SharedMediaPlayerModal from "./SharedMediaPlayerModal";

interface SiswaMediaAjarViewProps {
  siswa: Siswa;
  rekapNilai?: RekapNilaiTotal[];
  onUpdateRekapNilai?: (updatedRec: RekapNilaiTotal) => void;
}

export default function SiswaMediaAjarView({
  siswa,
  rekapNilai = [],
  onUpdateRekapNilai
}: SiswaMediaAjarViewProps) {
  const [sharedMediaList, setSharedMediaList] = useState<SharedMediaAjarItem[]>(() =>
    SharedMediaAjarStorage.getItemsForStudent(siswa.kelasId)
  );
  const [mySubmissions, setMySubmissions] = useState<SharedMediaSubmission[]>(() =>
    SharedMediaAjarStorage.getSubmissionsForStudent(siswa.nisn)
  );
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | SharedMediaType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "DONE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMediaToPlay, setActiveMediaToPlay] = useState<SharedMediaAjarItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const refreshData = () => {
    setSharedMediaList(SharedMediaAjarStorage.getItemsForStudent(siswa.kelasId));
    setMySubmissions(SharedMediaAjarStorage.getSubmissionsForStudent(siswa.nisn));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener(SHARED_MEDIA_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SHARED_MEDIA_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [siswa.kelasId, siswa.nisn]);

  const handleSaveMediaSubmission = (sub: SharedMediaSubmission) => {
    SharedMediaAjarStorage.upsertSubmission(sub);
    refreshData();

    if (onUpdateRekapNilai && rekapNilai.length > 0 && sub.type !== "video") {
      const studentRekap = rekapNilai.find((r) => r.siswaNisn === siswa.nisn);
      if (studentRekap) {
        onUpdateRekapNilai({
          ...studentRekap,
          formatifKuis: Math.round((studentRekap.formatifKuis + sub.scorePG) / 2)
        });
      }
    }
  };

  const submissionMap = useMemo(() => {
    const map = new Map<string, SharedMediaSubmission>();
    mySubmissions.forEach((s) => map.set(s.sharedMediaId, s));
    return map;
  }, [mySubmissions]);

  const stats = useMemo(() => {
    const total = sharedMediaList.length;
    const completed = sharedMediaList.filter((m) => submissionMap.has(m.id)).length;
    const pending = total - completed;
    const quizSubs = mySubmissions.filter(
      (s) => s.type !== "video" && sharedMediaList.some((m) => m.id === s.sharedMediaId)
    );
    const avgScore =
      quizSubs.length > 0
        ? Math.round(quizSubs.reduce((acc, s) => acc + (s.nilaiAkhirGuru ?? s.scorePG), 0) / quizSubs.length)
        : null;

    return {
      total,
      completed,
      pending,
      avgScore,
      videoCount: sharedMediaList.filter((m) => m.type === "video").length,
      gameCount: sharedMediaList.filter((m) => m.type === "game").length,
      lmsCount: sharedMediaList.filter((m) => m.type === "lms").length
    };
  }, [sharedMediaList, mySubmissions, submissionMap]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sharedMediaList.filter((item) => {
      if (selectedCategory !== "ALL" && item.type !== selectedCategory) return false;
      const isDone = submissionMap.has(item.id);
      if (statusFilter === "PENDING" && isDone) return false;
      if (statusFilter === "DONE" && !isDone) return false;
      if (q) {
        const matches =
          item.judul.toLowerCase().includes(q) ||
          item.materi.toLowerCase().includes(q) ||
          (item.instruksiGuru || "").toLowerCase().includes(q) ||
          (item.deskripsi || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [sharedMediaList, selectedCategory, statusFilter, searchQuery, submissionMap]);

  const handleOpenPlayer = (media: SharedMediaAjarItem) => {
    setActiveMediaToPlay(media);
    setIsPlayerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Media Ajar & Tugas Interaktif
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Kelas {siswa.kelasId}</span>
                <span aria-hidden="true">·</span>
                <span>{siswa.nama}</span>
                <span aria-hidden="true">·</span>
                <span>Dibagikan langsung oleh Guru PAI</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="block text-[11px] font-medium text-slate-500">Total Media</span>
              <strong className="text-lg font-bold text-slate-900 tabular-nums">{stats.total}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <span className="block text-[11px] font-medium text-amber-800">Belum Dikerjakan</span>
              <strong className="text-lg font-bold text-amber-900 tabular-nums">{stats.pending}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="block text-[11px] font-medium text-emerald-800">Sudah Selesai</span>
              <strong className="text-lg font-bold text-emerald-900 tabular-nums">{stats.completed}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="block text-[11px] font-medium text-slate-500">Rata-rata Skor</span>
              <strong className="text-lg font-bold text-slate-900 tabular-nums">
                {stats.avgScore !== null ? stats.avgScore : "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("video")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "video"
                  ? "bg-white text-sky-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video Materi ({stats.videoCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("game")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "game"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Edukasi ({stats.gameCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("lms")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "lms"
                  ? "bg-white text-[#46178f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Ujian CBT ({stats.lmsCount})</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === "PENDING"
                    ? "bg-white text-amber-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Belum Dikerjakan
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DONE")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === "DONE"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sudah Selesai
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau materi..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Ajar Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {sharedMediaList.length === 0
              ? `Belum ada Media Ajar yang dibagikan untuk Kelas ${siswa.kelasId}`
              : "Tidak ada Media Ajar yang sesuai dengan filter"}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {sharedMediaList.length === 0
              ? "Saat Guru PAI membagikan Video Pembelajaran, Game Kuis Edukasi, atau Ujian CBT PAI di menu Media Ajar Guru, tugas tersebut akan otomatis masuk ke halaman ini."
              : "Coba ubah kategori, filter status, atau kata kunci pencarian untuk melihat media ajar lainnya."}
          </p>
          {sharedMediaList.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setStatusFilter("ALL");
                setSearchQuery("");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition"
            >
              Tampilkan Semua Media Ajar
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredList.map((media) => {
            const sub = submissionMap.get(media.id);
            const pgCount = media.soalList?.filter((s) => s.tipe === "pilihan_ganda").length || 0;
            const essayCount = media.soalList?.filter((s) => s.tipe === "essay").length || 0;
            const typeLabel =
              media.type === "video"
                ? "Video Pembelajaran"
                : media.type === "game"
                ? "Game Edukasi"
                : "Ujian CBT PAI";

            return (
              <article
                key={media.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="space-y-3">
                  {/* Quiet 1-line metadata kicker + explicit state label */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium min-w-0 truncate">
                      {media.type === "video" ? (
                        <VideoIcon className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      ) : media.type === "game" ? (
                        <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-[#46178f] shrink-0" />
                      )}
                      <span className="truncate">{typeLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{media.materi}</span>
                    </div>

                    {sub ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold whitespace-nowrap shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {media.type === "video"
                            ? "Selesai"
                            : `Skor ${sub.nilaiAkhirGuru ?? sub.scorePG}`}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold whitespace-nowrap shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Belum Dikerjakan</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Instruction */}
                  <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {media.judul}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {media.instruksiGuru || media.deskripsi}
                    </p>
                  </div>

                  {/* Clean unboxed task details */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 tabular-nums">
                    {media.type === "video" ? (
                      <span>Durasi {media.videoData?.durasi || "08:00"}</span>
                    ) : (
                      <>
                        {pgCount > 0 && <span>{pgCount} Pilihan Ganda</span>}
                        {pgCount > 0 && essayCount > 0 && <span aria-hidden="true">·</span>}
                        {essayCount > 0 && <span>{essayCount} Essay</span>}
                      </>
                    )}
                    {media.deadline && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Batas {media.deadline.replace("T", " ")}</span>
                      </>
                    )}
                  </div>

                  {/* Submission Summary if already worked on */}
                  {sub && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span className="flex items-center gap-1.5">
                          {media.type === "video" ? (
                            <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{sub.status}</span>
                        </span>
                        <span className="text-[11px] font-normal text-slate-500 tabular-nums">
                          {sub.submittedAt}
                        </span>
                      </div>
                      {media.type !== "video" && sub.totalPG > 0 && (
                        <p className="text-[11px] text-slate-600 tabular-nums">
                          Benar {sub.correctCount} dari {sub.totalPG} soal PG
                          {sub.essayAnswers && Object.keys(sub.essayAnswers).length > 0
                            ? ` · ${Object.keys(sub.essayAnswers).length} jawaban essay terkirim`
                            : ""}
                        </p>
                      )}
                      {media.type === "video" && sub.catatanSiswa && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                          Catatan: "{sub.catatanSiswa}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleOpenPlayer(media)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    sub
                      ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                      : media.type === "video"
                      ? "bg-sky-700 hover:bg-sky-600 text-white"
                      : media.type === "game"
                      ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                      : "bg-[#46178f] hover:bg-[#381273] text-white"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {sub
                      ? media.type === "video"
                        ? "Tonton Ulang & Edit Catatan"
                        : media.type === "lms"
                        ? "Lihat Hasil / Kerjakan Ulang CBT"
                        : "Lihat Hasil / Kerjakan Ulang"
                      : media.type === "video"
                      ? "Putar Video & Kirim Catatan"
                      : media.type === "game"
                      ? "Mainkan Game Kuis"
                      : "Kerjakan Ujian CBT"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Player Modal */}
      <SharedMediaPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        item={activeMediaToPlay}
        siswa={siswa}
        existingSubmission={
          activeMediaToPlay
            ? mySubmissions.find((s) => s.sharedMediaId === activeMediaToPlay.id) || null
            : null
        }
        onSaveSubmission={handleSaveMediaSubmission}
      />
    </div>
  );
}
