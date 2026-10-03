/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Sparkles,
  BookOpen,
  Video,
  Gamepad2,
  Puzzle,
  FileText,
  CheckCircle2,
  Plus,
  ArrowRight,
  GraduationCap,
  Layers,
  Database,
  ExternalLink,
  Search,
  Flame,
  Award,
  Clock,
  Trash2,
  Copy,
  ChevronRight
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface BahanAjarAiDashboardProps {
  bundles: BahanAjarAiCompleteBundle[];
  onOpenGenerator: () => void;
  onOpenBank: (tabFilter?: string) => void;
  onOpenKurikulum: () => void;
  onOpenHasil: () => void;
  onSelectBundle: (bundle: BahanAjarAiCompleteBundle) => void;
  onOpenAppsScript: () => void;
}

export default function BahanAjarAiDashboard({
  bundles,
  onOpenGenerator,
  onOpenBank,
  onOpenKurikulum,
  onOpenHasil,
  onSelectBundle,
  onOpenAppsScript
}: BahanAjarAiDashboardProps) {
  // Statistics calculations
  const totalBundles = bundles.length;
  const totalMateri = totalBundles;
  const totalVideo = totalBundles;
  const totalGame = totalBundles * 6; // 6 Visual Games per bundle
  const totalTts = totalBundles;
  const totalLkpd = totalBundles;
  const totalCbt = totalBundles;

  const countKelas7 = bundles.filter((b) => b.kelas === "7").length;
  const countKelas8 = bundles.filter((b) => b.kelas === "8").length;
  const countKelas9 = bundles.filter((b) => b.kelas === "9").length;

  return (
    <div className="space-y-7">
      {/* 1. HERO BANNER BERANDA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-7 sm:p-10 text-white shadow-xl border border-blue-800/60">
        {/* Subtle Islamic geometric watermarks */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <BookOpen className="w-80 h-80 text-amber-400" />
        </div>
        <div className="absolute right-1/4 top-0 opacity-15 pointer-events-none">
          <Sparkles className="w-44 h-44 text-emerald-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 border border-blue-600/60 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Generator Media Pembelajaran Pendidikan Agama Islam SMP</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              BAHAN AJAR AI PAI
            </h1>
            <p className="text-base sm:text-lg font-bold text-blue-200">
              Generator Cerdas Bahan Ajar Pendidikan Agama Islam
            </p>
          </div>

          {/* Slogan */}
          <div className="inline-block p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-extrabold text-sm sm:text-base shadow-inner">
            ✨ "Guru Kreatif, Pembelajaran Interaktif, Siswa Aktif"
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            Cukup tentukan <strong>Kelas</strong>, <strong>Materi</strong>, dan <strong>Sub Materi</strong>. 
            Dalam satu klik, AI otomatis menghasilkan 6 produk pembelajaran terintegrasi: 
            Materi Lengkap, Storyboard Video Animasi, 6 Game Edukasi Visual AI, Teka-Teki Silang (TTS), LKPD Berdiferensiasi, serta CBT Ujian Online.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGenerator}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 border border-amber-300 flex items-center gap-2.5 transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-5 h-5 text-slate-950 stroke-[3]" />
              <span>+ BUAT BAHAN AJAR AI</span>
            </button>

            <button
              onClick={() => onOpenBank()}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/25 flex items-center gap-2 transition cursor-pointer backdrop-blur-sm"
            >
              <Layers className="w-4 h-4 text-blue-300" />
              <span>Buka Bank Bahan Ajar ({totalBundles})</span>
            </button>

            <button
              onClick={onOpenAppsScript}
              className="px-4 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs sm:text-sm rounded-2xl border border-emerald-700/60 flex items-center gap-2 transition cursor-pointer"
              title="Integrasi Google Sheets & Google Apps Script"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets API</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATISTIK UTAMA (SESUAI SPESIFIKASI PROMPT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-700" />
            Statistik Produk & Bank Media
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Terhubung otomatis dengan Kurikulum Merdeka PAI SMP
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Materi */}
          <div
            onClick={() => onOpenBank("MATERI")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Materi
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalMateri}</span>
            <span className="block text-[10px] text-blue-700 font-bold">Kajian Lengkap Dalil</span>
          </div>

          {/* Total Video */}
          <div
            onClick={() => onOpenBank("VIDEO")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black">
              <Video className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Video
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalVideo}</span>
            <span className="block text-[10px] text-rose-700 font-bold">Storyboard & Prompt</span>
          </div>

          {/* Total Game */}
          <div
            onClick={() => onOpenBank("GAME")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Game
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalGame}</span>
            <span className="block text-[10px] text-emerald-700 font-bold">6 Game Visual AI</span>
          </div>

          {/* Total TTS */}
          <div
            onClick={() => onOpenBank("TTS")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
              <Puzzle className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total TTS
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalTts}</span>
            <span className="block text-[10px] text-indigo-700 font-bold">Teka-Teki Silang</span>
          </div>

          {/* Total LKPD */}
          <div
            onClick={() => onOpenBank("LKPD")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total LKPD
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalLkpd}</span>
            <span className="block text-[10px] text-amber-700 font-bold">Aktivitas 1 - 5</span>
          </div>

          {/* Total CBT */}
          <div
            onClick={() => onOpenBank("CBT")}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total CBT
            </span>
            <span className="block text-2xl font-black text-slate-900">{totalCbt}</span>
            <span className="block text-[10px] text-teal-700 font-bold">Ujian Online Siap Pakai</span>
          </div>
        </div>

        {/* 3 KELAS TINGKAT STATS (KELAS 7, KELAS 8, KELAS 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase text-blue-900 tracking-wider">
                Kelas 7 SMP
              </span>
              <span className="block text-xl font-black text-blue-950">{countKelas7} Paket Bahan Ajar</span>
              <span className="text-[10px] text-blue-700 font-medium">Thaharah, Asmaul Husna, Jujur & Amanah</span>
            </div>
            <span className="px-3 py-1 bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs">
              Fase D (VII)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">
                Kelas 8 SMP
              </span>
              <span className="block text-xl font-black text-emerald-950">{countKelas8} Paket Bahan Ajar</span>
              <span className="text-[10px] text-emerald-700 font-medium">Kitab Allah, Shalat Jamak Qashar, Abbasiyah</span>
            </div>
            <span className="px-3 py-1 bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs">
              Fase D (VIII)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase text-amber-950 tracking-wider">
                Kelas 9 SMP
              </span>
              <span className="block text-xl font-black text-amber-950">{countKelas9} Paket Bahan Ajar</span>
              <span className="text-[10px] text-amber-800 font-medium">Hari Akhir, Zakat & Haji, Sejarah Wali Songo</span>
            </div>
            <span className="px-3 py-1 bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs">
              Fase D (IX)
            </span>
          </div>
        </div>
      </div>

      {/* 3. RECENT BUNDLES & QUICK ACTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Bundles list */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Paket Bahan Ajar AI Tersimpan
            </h3>
            {bundles.length > 0 && (
              <button
                onClick={() => onOpenBank()}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {bundles.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Belum Ada Bahan Ajar AI</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Mulai buat media pembelajaran PAI berkualitas tinggi pertama Anda dengan sekali klik tombol di bawah ini.
                </p>
              </div>
              <button
                onClick={onOpenGenerator}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                + Buat Bahan Ajar Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bundles.slice(0, 4).map((bundle) => (
                <div
                  key={bundle.id}
                  onClick={() => onSelectBundle(bundle)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black">
                        Kelas {bundle.kelas} SMP
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {bundle.materi}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(bundle.tanggalDibuat).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-700 transition truncate">
                      {bundle.subMateri}
                    </h4>

                    {/* Products tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9px] font-extrabold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">📚 Materi</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">🎬 Video</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">🎮 Quiz & Match</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">🧠 TTS</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">📝 LKPD</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">💻 CBT ({bundle.cbt.daftarSoal.length} Soal)</span>
                    </div>
                  </div>

                  <button className="px-3.5 py-2 bg-blue-50 group-hover:bg-blue-700 group-hover:text-white text-blue-800 font-black text-xs rounded-xl transition flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <span>Buka Media</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Features & Curriculum Quick Nav */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              Kelola Kurikulum PAI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Struktur materi PAI bersifat dinamis. Anda dapat menambah, menyunting, atau menghapus sub materi kapan saja tanpa mengunci kode.
            </p>
            <button
              onClick={onOpenKurikulum}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Buka Pengaturan Kurikulum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-950 text-white border border-indigo-900/60 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="text-sm font-black text-white">Monitoring Hasil Belajar</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Pantau rekap skor ujian CBT dan progres skor game interaktif siswa secara realtime.
            </p>
            <button
              onClick={onOpenHasil}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <span>Lihat Rekap Hasil Siswa</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
