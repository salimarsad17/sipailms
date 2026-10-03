/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  Scroll,
  Search,
  Printer,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Video,
  Gamepad2,
  Puzzle,
  FileText,
  Sliders,
  Award,
  Layers,
  HelpCircle,
  Eye,
  Send,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  ExternalLink,
  BookMarked,
  Info,
  Compass,
  Landmark,
  Volume2
} from "lucide-react";
import { BabBukuPai8 } from "../../types/bukuPaiAi";
import {
  IDENTITAS_BUKU_PAI_KELAS_8,
  SEMUA_BAB_KELAS_8,
  BAB_SEMESTER_1_KELAS_8,
  BAB_SEMESTER_2_KELAS_8,
  GLOSARIUM_LENGKAP_KELAS_8,
  DAFTAR_PUSTAKA_LENGKAP_KELAS_8,
  PROMPT_SISTEM_GENERATOR_BUKU_PAI_8
} from "../../data/bukuDigitalPaiKelas8Data";

interface BukuDigitalPaiKelas8ViewProps {
  guruNama?: string;
  namaSekolah?: string;
  onNavigateToBahanAjarAi?: (options?: {
    kelas: "8";
    materi: string;
    subMateri: string;
    targetTab?: "MATERI" | "VIDEO" | "GAME" | "TTS" | "LKPD" | "CBT";
  }) => void;
}

export default function BukuDigitalPaiKelas8View({
  guruNama,
  namaSekolah,
  onNavigateToBahanAjarAi
}: BukuDigitalPaiKelas8ViewProps) {
  // Navigation: "cover" | "bab" | "glosarium" | "pustaka" | "evaluasi_sem1" | "evaluasi_sem2"
  const [activeView, setActiveView] = useState<
    "cover" | "bab" | "glosarium" | "pustaka" | "evaluasi_sem1" | "evaluasi_sem2"
  >("cover");

  const [selectedBabNomor, setSelectedBabNomor] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedBab, setBookmarkedBab] = useState<number[]>([1]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // AI Generator Modal state
  const [isAiGeneratorModalOpen, setIsAiGeneratorModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [genScope, setGenScope] = useState<"bab" | "sem1" | "sem2" | "all">("bab");
  const [genTargetBab, setGenTargetBab] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgressText, setGenProgressText] = useState("");
  const [genPercent, setGenPercent] = useState(0);

  // Exercise interaction state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showPembahasan, setShowPembahasan] = useState<Record<string, boolean>>({});

  const identitas = useMemo(() => ({
    ...IDENTITAS_BUKU_PAI_KELAS_8,
    guruPenyusun: guruNama || IDENTITAS_BUKU_PAI_KELAS_8.guruPenyusun,
    namaSekolah: namaSekolah || IDENTITAS_BUKU_PAI_KELAS_8.namaSekolah
  }), [guruNama, namaSekolah]);

  const currentBab: BabBukuPai8 = useMemo(() => {
    return (
      SEMUA_BAB_KELAS_8.find((b) => b.babNomor === selectedBabNomor) ||
      SEMUA_BAB_KELAS_8[0]
    );
  }, [selectedBabNomor]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Bookmark toggle
  const toggleBookmark = (babNo: number) => {
    setBookmarkedBab((prev) =>
      prev.includes(babNo) ? prev.filter((b) => b !== babNo) : [...prev, babNo]
    );
  };

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  // Simulated AI Generator
  const handleRunAiGenerator = async () => {
    setIsGenerating(true);
    setGenPercent(10);
    setGenProgressText("Memeriksa kesesuaian kurikulum dan Capaian Pembelajaran PAI Kelas 8...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(30);
    setGenProgressText("Menyusun peta konsep, dalil Al-Qur'an terverifikasi, dan hukum tajwid...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(55);
    setGenProgressText("Menyusun studi kasus kontekstual remaja dan panduan praktik ibadah...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(75);
    setGenProgressText("Menyusun bank soal 6 variasi (PG, Isian, Benar/Salah, Menjodohkan, Uraian, HOTS)...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(90);
    setGenProgressText("Menjalankan Kontrol Kualitas 10 Titik Cek Buku Standar BSKAP...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(100);
    setGenProgressText("Buku Digital PAI Kelas 8 Berhasil Disusun!");
    await new Promise((r) => setTimeout(r, 400));

    setIsGenerating(false);
    setIsAiGeneratorModalOpen(false);

    if (genScope === "bab") {
      setSelectedBabNomor(genTargetBab);
      setActiveView("bab");
    } else {
      setActiveView("cover");
    }
  };

  // Filtered chapters for search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEMUA_BAB_KELAS_8.filter(
      (b) =>
        b.judulBab.toLowerCase().includes(q) ||
        b.kataKunci.some((k) => k.toLowerCase().includes(q)) ||
        b.materiPembelajaran.some(
          (m) =>
            m.subJudul.toLowerCase().includes(q) ||
            m.konten.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Main Navigation Card */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg border border-teal-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 font-bold text-xs">
              <Scroll className="w-3.5 h-3.5 text-teal-300" />
              Buku Pelajaran Digital PAI Kelas VIII
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Kurikulum Merdeka • Fase D
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-extrabold text-[11px]">
              10 Bab Lengkap (A s/d T)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Pendidikan Agama Islam & Budi Pekerti — Kelas VIII
          </h1>
          <p className="text-xs text-teal-200/90 leading-relaxed max-w-2xl">
            Disusun sistematis dengan 20 rubrik komprehensif, dalil Al-Qur'an & Hadis terverifikasi, kaidah tajwid Nun Sukun/Tanwin, panduan praktik ibadah, wawasan peradaban Islam, dan bank soal 6 variasi.
          </p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            title="Lihat Prompt Sistem Generator AI Lengkap"
          >
            <Scroll className="w-4 h-4 text-slate-950" />
            <span>📜 Prompt Sistem AI</span>
          </button>

          <button
            onClick={() => setIsAiGeneratorModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            title="Buka Generator AI Buku Pelajaran"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>⚡ Generator Bab AI</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20"
            title="Cetak atau Simpan ke PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* SIDEBAR: NAVIGASI DAFTAR ISI KELAS 8                      */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-800" />
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Daftar Isi Buku Digital
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              10 Bab
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi, ayat, tokoh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Result Dropdown if searching */}
          {searchQuery && (
            <div className="bg-slate-50 border border-teal-200 rounded-2xl p-2 max-h-60 overflow-y-auto space-y-1">
              <span className="text-[11px] font-bold text-teal-800 px-2 block">
                Hasil Pencarian ({searchResults.length}):
              </span>
              {searchResults.length === 0 ? (
                <p className="text-xs text-slate-500 p-2 italic">
                  Tidak ditemukan materi dengan kata kunci "{searchQuery}".
                </p>
              ) : (
                searchResults.map((b) => (
                  <button
                    key={b.babNomor}
                    onClick={() => {
                      setSelectedBabNomor(b.babNomor);
                      setActiveView("bab");
                      setSearchQuery("");
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-teal-100/70 transition flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {b.babNomor}
                    </span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {b.judulBab}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Navigation Section Buttons */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => setActiveView("cover")}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeView === "cover"
                  ? "bg-gradient-to-r from-teal-800 to-emerald-900 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-amber-300" />
                <span>Sampul & Petunjuk Penggunaan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>

          {/* SEMESTER 1 CHAPTERS */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between px-2 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <span>Semester 1 (Bab 1 - 5)</span>
              <span className="text-[10px] text-teal-700 font-bold">Ganjil</span>
            </div>
            {BAB_SEMESTER_1_KELAS_8.map((bab) => {
              const isSelected = activeView === "bab" && selectedBabNomor === bab.babNomor;
              const isBookmarked = bookmarkedBab.includes(bab.babNomor);
              return (
                <button
                  key={bab.babNomor}
                  onClick={() => {
                    setSelectedBabNomor(bab.babNomor);
                    setActiveView("bab");
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl transition flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-teal-50 border-2 border-teal-600 shadow-sm"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-teal-800 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {bab.babNomor}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? "text-teal-900 font-black" : "text-slate-800"
                      }`}
                    >
                      {bab.judulBab}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {bab.kataKunci.slice(0, 2).join(" • ")}
                      </span>
                    </div>
                  </div>
                  {isBookmarked && (
                    <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* SEMESTER 2 CHAPTERS */}
          <div className="space-y-1.5 pt-3">
            <div className="flex items-center justify-between px-2 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <span>Semester 2 (Bab 6 - 10)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Genap</span>
            </div>
            {BAB_SEMESTER_2_KELAS_8.map((bab) => {
              const isSelected = activeView === "bab" && selectedBabNomor === bab.babNomor;
              const isBookmarked = bookmarkedBab.includes(bab.babNomor);
              return (
                <button
                  key={bab.babNomor}
                  onClick={() => {
                    setSelectedBabNomor(bab.babNomor);
                    setActiveView("bab");
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl transition flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-teal-50 border-2 border-teal-600 shadow-sm"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-teal-800 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {bab.babNomor}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? "text-teal-900 font-black" : "text-slate-800"
                      }`}
                    >
                      {bab.judulBab}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {bab.kataKunci.slice(0, 2).join(" • ")}
                      </span>
                    </div>
                  </div>
                  {isBookmarked && (
                    <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* GLOSSARY & REFERENCES */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => setActiveView("glosarium")}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeView === "glosarium"
                  ? "bg-teal-800 text-white shadow-sm"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Glosarium Istilah Lengkap</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                {GLOSARIUM_LENGKAP_KELAS_8.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("pustaka")}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeView === "pustaka"
                  ? "bg-teal-800 text-white shadow-sm"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-teal-400" />
                <span>Daftar Pustaka & Rujukan Resmi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN READER AREA                                         */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* VIEW: COVER PAGE */}
          {activeView === "cover" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
              {/* Cover Header Banner */}
              <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-950 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl border border-teal-700/50">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative space-y-3 max-w-xl mx-auto">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black text-xs uppercase tracking-widest">
                    {identitas.jenjang}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                    {identitas.judulUtama}
                  </h1>
                  <p className="text-sm font-semibold text-teal-200">
                    Buku Pelajaran Digital Interaktif Berbasis AI
                  </p>
                  <div className="pt-4 border-t border-teal-700/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-teal-100">
                    <span><strong>Sekolah:</strong> {identitas.namaSekolah}</span>
                    <span>•</span>
                    <span><strong>Penyusun:</strong> {identitas.guruPenyusun}</span>
                    <span>•</span>
                    <span><strong>Tahun:</strong> {identitas.tahunPelajaran}</span>
                  </div>
                </div>
              </div>

              {/* Kata Pengantar */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Kata Pengantar
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  {identitas.kataPengantar}
                </p>
              </div>

              {/* Capaian Pembelajaran */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-700" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Capaian Pembelajaran (CP) Fase D Kelas VIII
                  </h3>
                </div>
                <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl text-xs sm:text-sm text-teal-950 leading-relaxed font-medium">
                  {identitas.capaianPembelajaran}
                </div>
              </div>

              {/* Petunjuk Penggunaan */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Petunjuk Penggunaan Buku Digital
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {identitas.petunjukPenggunaan.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Start Chapter Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  Klik tombol di samping untuk mulai mempelajari Bab 1:
                </div>
                <button
                  onClick={() => {
                    setSelectedBabNomor(1);
                    setActiveView("bab");
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:from-teal-900 hover:to-emerald-950 transition cursor-pointer"
                >
                  <span>Mulai Belajar: Bab 1</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: CHAPTER READER (BAB 1 - 10) */}
          {activeView === "bab" && (
            <div className="space-y-6">
              {/* Chapter Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-teal-800 text-white font-black text-xs">
                      BAB {currentBab.babNomor}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs">
                      Semester {currentBab.semester}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      {currentBab.verification.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(currentBab.babNomor)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        bookmarkedBab.includes(currentBab.babNomor)
                          ? "bg-amber-50 border-amber-300 text-amber-600"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                      }`}
                      title="Tandai Halaman Ini"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedBab.includes(currentBab.babNomor)
                            ? "fill-amber-500"
                            : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          `${currentBab.judulBab}\n\n${currentBab.materiPembelajaran
                            .map((m) => `${m.subJudul}\n${m.konten}`)
                            .join("\n\n")}`,
                          `bab-${currentBab.babNomor}`
                        )
                      }
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 transition cursor-pointer"
                      title="Salin Seluruh Teks Bab Ini"
                    >
                      {copiedText === `bab-${currentBab.babNomor}` ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentBab.judulBab}
                </h2>

                {/* Kata Kunci */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">
                    Kata Kunci:
                  </span>
                  {currentBab.kataKunci.map((kata, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/60"
                    >
                      #{kata}
                    </span>
                  ))}
                </div>
              </div>

              {/* RUBRIK: TUJUAN PEMBELAJARAN */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    A. Tujuan Pembelajaran
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {currentBab.tujuanPembelajaran.map((tujuan, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {tujuan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: PETA KONSEP */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-700" />
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    B. Peta Konsep Pembelajaran
                  </h3>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  {currentBab.petaKonsep.map((peta, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <span className="text-teal-700 font-bold shrink-0">✦</span>
                      <span>{peta}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: AYO MENGAMATI */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-700" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      C. Ayo Mengamati
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Apersepsi Visual
                  </span>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2 text-xs text-amber-950">
                  <p className="font-semibold">{currentBab.ayoMengamati.deskripsi}</p>
                  <p className="text-[11px] text-amber-800/80 italic font-mono">
                    <strong>Prompt Visual:</strong> {currentBab.ayoMengamati.imagePrompt}
                  </p>
                  {currentBab.ayoMengamati.captionGambar && (
                    <p className="text-[11px] font-bold text-amber-900">
                      {currentBab.ayoMengamati.captionGambar}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pertanyaan Pengamatan:
                  </h4>
                  <div className="space-y-1.5">
                    {currentBab.ayoMengamati.pertanyaanPengamatan.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RUBRIK: AYO BERPIKIR */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    D. Ayo Berpikir (Nalar Kritis & Refleksi Awal)
                  </h3>
                </div>
                <div className="space-y-2">
                  {currentBab.ayoBerpikir.map((tanya, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border-l-4 border-amber-500 rounded-r-2xl text-xs sm:text-sm text-slate-800 font-medium leading-relaxed"
                    >
                      {tanya}
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: MATERI PEMBELAJARAN INTI */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-800" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      E. Materi Pembelajaran Utama
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700">
                    {currentBab.materiPembelajaran.length} Sub-Materi
                  </span>
                </div>

                <div className="space-y-6">
                  {currentBab.materiPembelajaran.map((materi, idx) => (
                    <div
                      key={idx}
                      className="space-y-3 p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl"
                    >
                      <h4 className="text-sm sm:text-base font-black text-teal-950">
                        {materi.subJudul}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-line font-medium">
                        {materi.konten}
                      </p>

                      {materi.poinKunci && materi.poinKunci.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                            Poin Kunci:
                          </span>
                          <div className="space-y-1">
                            {materi.poinKunci.map((poin, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex items-start gap-2 text-xs text-slate-700 font-semibold"
                              >
                                <span className="text-teal-700">✔</span>
                                <span>{poin}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: DALIL AL-QUR'AN & HADIS TERVERIFIKASI */}
              {currentBab.dalilTerkait && currentBab.dalilTerkait.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Scroll className="w-5 h-5 text-teal-800" />
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        F. Teks Dalil Al-Qur'an & Hadis Terverifikasi
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {currentBab.dalilTerkait.length} Dalil Sahih
                    </span>
                  </div>

                  <div className="space-y-6">
                    {currentBab.dalilTerkait.map((dalil, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200 rounded-3xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-teal-800 text-white font-bold text-xs">
                            {dalil.surah} {dalil.nomorAyat ? `Ayat ${dalil.nomorAyat}` : ""}
                          </span>
                          <span className="text-xs font-bold text-emerald-800">
                            {dalil.kategori}
                          </span>
                        </div>

                        {/* Arabic text with crisp typography */}
                        <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100 shadow-inner">
                          <p
                            className="text-right text-xl sm:text-2xl font-serif text-slate-900 leading-loose"
                            dir="rtl"
                          >
                            {dalil.teksArab}
                          </p>
                        </div>

                        {/* Latin & Translation */}
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="font-semibold text-teal-900 italic font-mono">
                            {dalil.latin}
                          </p>
                          <p className="text-slate-800 leading-relaxed font-medium">
                            <strong>Terjemahan:</strong> "{dalil.terjemahan}"
                          </p>
                          {dalil.tafsirSingkat && (
                            <p className="text-xs text-slate-600 bg-white/60 p-2.5 rounded-xl border border-emerald-100">
                              <strong>Tafsir Singkat:</strong> {dalil.tafsirSingkat}
                            </p>
                          )}
                        </div>

                        {/* Selected Vocabulary */}
                        {dalil.kosakataTerpilih && dalil.kosakataTerpilih.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                              Kosakata Kunci Terpilih:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {dalil.kosakataTerpilih.map((kosa, kIdx) => (
                                <div
                                  key={kIdx}
                                  className="p-2 bg-white rounded-xl border border-emerald-100 text-center"
                                >
                                  <span className="block font-bold text-sm text-teal-900" dir="rtl">
                                    {kosa.lafaz}
                                  </span>
                                  <span className="block text-[10px] text-slate-600 font-medium">
                                    {kosa.arti}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RUBRIK: TAJWID (JIKA ADA PADA BAB) */}
              {currentBab.tajwid && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Volume2 className="w-5 h-5 text-teal-800" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      G. Rubrik Tajwid: {currentBab.tajwid.judulTajwid}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {currentBab.tajwid.penjelasanKaidah}
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                      <thead className="bg-teal-900 text-white font-bold">
                        <tr>
                          <th className="p-3">Lafaz Contoh</th>
                          <th className="p-3">Ayat / Surah</th>
                          <th className="p-3">Hukum Tajwid</th>
                          <th className="p-3">Cara Membaca</th>
                          <th className="p-3">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {currentBab.tajwid.contohList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-teal-50/50">
                            <td className="p-3 font-serif text-base font-bold text-teal-950" dir="rtl">
                              {item.lafaz}
                            </td>
                            <td className="p-3 font-medium text-slate-700">{item.surahAyat || "-"}</td>
                            <td className="p-3 font-bold text-teal-800">{item.hukum}</td>
                            <td className="p-3 font-semibold text-slate-800">{item.caraBaca}</td>
                            <td className="p-3 text-slate-600">{item.penjelasan || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RUBRIK: PRAKTIK KHUSUS (JIKA ADA) */}
              {currentBab.praktik && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Landmark className="w-5 h-5 text-teal-800" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      H. Panduan Praktik Ibadah: {currentBab.praktik.judulPraktik}
                    </h3>
                  </div>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs sm:text-sm text-teal-950 font-medium">
                    <strong>Tujuan Praktik:</strong> {currentBab.praktik.tujuan}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Langkah-Langkah Praktik:
                    </h4>
                    <div className="space-y-2">
                      {currentBab.praktik.langkahPraktik.map((langkah, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-slate-800"
                        >
                          <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium leading-relaxed">{langkah}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentBab.praktik.rubrikPenilaian && (
                    <p className="text-xs text-slate-600 bg-slate-100 p-3 rounded-xl">
                      <strong>Rubrik Penilaian:</strong> {currentBab.praktik.rubrikPenilaian}
                    </p>
                  )}
                </div>
              )}

              {/* RUBRIK: CONTOH DALAM KEHIDUPAN NYATA */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    I. Contoh Nyata dalam Kehidupan Sehari-hari
                  </h3>
                </div>
                <div className="space-y-2">
                  {currentBab.contohKehidupan.map((contoh, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border-l-4 border-teal-600 rounded-r-2xl text-xs sm:text-sm text-slate-800 font-medium leading-relaxed"
                    >
                      {contoh}
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: AKTIVITAS INDIVIDU & KELOMPOK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-800" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      J. Aktivitas Individu
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {currentBab.aktivitasIndividu.map((tugas, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium leading-relaxed">{tugas}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      K. Aktivitas Kelompok
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {currentBab.aktivitasKelompok.map((tugas, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium leading-relaxed">{tugas}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RUBRIK: STUDI KASUS KONTEKSTUAL */}
              {currentBab.studiKasus && currentBab.studiKasus.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-500" />
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        L. Studi Kasus Kontekstual & Solusi
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Analisis Moral
                    </span>
                  </div>

                  {currentBab.studiKasus.map((kasus, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                    >
                      <h4 className="font-black text-sm text-slate-900">
                        {kasus.judulKasus}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {kasus.deskripsi}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-600 block">
                          Pertanyaan Diskusi:
                        </span>
                        {kasus.pertanyaan.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="text-xs text-slate-800 font-medium flex items-start gap-2"
                          >
                            <span className="text-amber-600 font-bold">{tIdx + 1}.</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 font-medium leading-relaxed">
                        <strong>Solusi Guru:</strong> {kasus.solusiGuru}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RUBRIK: AYO BERDISKUSI */}
              {currentBab.ayoBerdiskusi && currentBab.ayoBerdiskusi.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-teal-700" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      M. Ayo Berdiskusi (Moderasi & Wawasan)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {currentBab.ayoBerdiskusi.map((diskusi, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border-l-4 border-teal-600 rounded-r-2xl text-xs sm:text-sm text-slate-800 font-medium leading-relaxed"
                      >
                        {diskusi}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RUBRIK: AYO BERLATIH (BANK SOAL 6 VARIASI) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-teal-800" />
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      N. Ayo Berlatih (Evaluasi Pemahaman 6 Variasi)
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    Interaktif
                  </span>
                </div>

                {/* 1. Pilihan Ganda */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    1. Pilihan Ganda (Pilihlah Jawaban Paling Tepat)
                  </h4>
                  <div className="space-y-4">
                    {currentBab.latihan.pilihanGanda.map((pg, pgIdx) => {
                      const selectedAns = userAnswers[pg.id];
                      const isSubmitted = selectedAns !== undefined;
                      const isCorrect = selectedAns === pg.kunciJawaban;
                      const showPemb = showPembahasan[pg.id];

                      return (
                        <div
                          key={pg.id}
                          className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3"
                        >
                          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {pgIdx + 1}. {pg.pertanyaan}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pg.opsi.map((opsi, oIdx) => {
                              const isThisSelected = selectedAns === oIdx;
                              let btnClass = "bg-white hover:bg-slate-100 text-slate-800 border-slate-200";
                              if (isSubmitted) {
                                if (oIdx === pg.kunciJawaban) {
                                  btnClass = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
                                } else if (isThisSelected) {
                                  btnClass = "bg-rose-100 border-rose-500 text-rose-900";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => {
                                    setUserAnswers((prev) => ({ ...prev, [pg.id]: oIdx }));
                                    setShowPembahasan((prev) => ({ ...prev, [pg.id]: true }));
                                  }}
                                  className={`p-2.5 text-left rounded-xl text-xs border transition cursor-pointer font-medium ${btnClass}`}
                                >
                                  {opsi}
                                </button>
                              );
                            })}
                          </div>

                          {showPemb && (
                            <div
                              className={`p-3 rounded-xl text-xs leading-relaxed ${
                                isCorrect
                                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                                  : "bg-rose-50 border border-rose-200 text-rose-900"
                              }`}
                            >
                              <p className="font-bold mb-1">
                                {isCorrect ? "✅ Jawaban Anda Benar!" : "❌ Kurang Tepat!"}
                              </p>
                              <p><strong>Pembahasan:</strong> {pg.pembahasan}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Isian Singkat */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    2. Isian Singkat
                  </h4>
                  <div className="space-y-3">
                    {currentBab.latihan.isianSingkat.map((is, isIdx) => (
                      <div
                        key={is.id}
                        className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs"
                      >
                        <p className="font-bold text-slate-900">
                          {isIdx + 1}. {is.pertanyaan}
                        </p>
                        <details className="cursor-pointer text-teal-800 font-bold">
                          <summary className="hover:underline">Lihat Kunci Jawaban</summary>
                          <div className="mt-2 p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-medium">
                            <p><strong>Kunci:</strong> {is.kunciJawaban}</p>
                            <p className="text-[11px] text-slate-600 mt-1">
                              <strong>Pembahasan:</strong> {is.pembahasan}
                            </p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Benar / Salah */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    3. Benar atau Salah
                  </h4>
                  <div className="space-y-2">
                    {currentBab.latihan.benarSalah.map((bs, bsIdx) => (
                      <div
                        key={bs.id}
                        className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {bsIdx + 1}. {bs.pernyataan}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Kunci: <strong className={bs.jawabanBenar ? "text-emerald-700" : "text-rose-700"}>{bs.jawabanBenar ? "BENAR" : "SALAH"}</strong> — {bs.pembahasan}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Menjodohkan */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    4. Menjodohkan Konsep
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentBab.latihan.menjodohkan.map((mj) => (
                      <div
                        key={mj.id}
                        className="p-3 bg-teal-50/60 border border-teal-200/70 rounded-xl flex items-center justify-between gap-2"
                      >
                        <span className="font-bold text-teal-950">{mj.pertanyaan}</span>
                        <span className="font-medium text-slate-600 text-right">
                          ➜ {mj.pasanganJawaban}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Uraian & HOTS */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    5. Soal Uraian & Tantangan HOTS
                  </h4>
                  <div className="space-y-3">
                    {currentBab.latihan.uraian.map((ur, uIdx) => (
                      <div
                        key={ur.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs sm:text-sm"
                      >
                        <p className="font-bold text-slate-900">
                          Uraian {uIdx + 1}: {ur.pertanyaan}
                        </p>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                          <strong>Rubrik Penilaian:</strong> {ur.rubrikPenilaian}
                        </div>
                      </div>
                    ))}

                    {currentBab.latihan.hots.map((ht, hIdx) => (
                      <div
                        key={ht.id}
                        className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>Soal Tantangan Bernalar Kritis (HOTS {hIdx + 1})</span>
                        </div>
                        <p className="font-bold text-slate-900">{ht.pertanyaan}</p>
                        <div className="p-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-700">
                          <strong>Panduan Solusi:</strong> {ht.panduanJawaban}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RUBRIK: AYO BEREFLEKSI */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    O. Ayo Berefleksi (Refleksi Diri & Karakter)
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {currentBab.refleksi.pengantar}
                </p>

                <div className="space-y-2">
                  {currentBab.refleksi.pertanyaanRefleksi.map((tanya, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="text-teal-700 font-bold shrink-0">?</span>
                      <span>{tanya}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                    <span className="font-bold text-emerald-900 block mb-1">
                      Sikap yang Diterapkan:
                    </span>
                    <p className="text-emerald-800 font-medium">
                      {currentBab.refleksi.sikapDiterapkan}
                    </p>
                  </div>
                  <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs">
                    <span className="font-bold text-teal-900 block mb-1">
                      Kebiasaan yang Dilakukan:
                    </span>
                    <p className="text-teal-800 font-medium">
                      {currentBab.refleksi.kebiasaanDilakukan}
                    </p>
                  </div>
                </div>
              </div>

              {/* RUBRIK: RANGKUMAN MATERI */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Scroll className="w-5 h-5 text-teal-800" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    P. Rangkuman Materi Inti
                  </h3>
                </div>
                <div className="space-y-2">
                  {currentBab.rangkuman.map((poin, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border-l-4 border-teal-700 rounded-r-2xl text-xs sm:text-sm text-slate-800 font-medium leading-relaxed"
                    >
                      {poin}
                    </div>
                  ))}
                </div>
              </div>

              {/* RUBRIK: PENGAYAAN & REMEDIAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Q. Pengayaan
                    </h3>
                  </div>
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-black text-amber-950">{currentBab.pengayaan.judul}</h4>
                    <p className="text-amber-900 font-medium leading-relaxed">
                      {currentBab.pengayaan.deskripsi}
                    </p>
                    {currentBab.pengayaan.referensiLanjut && (
                      <p className="text-[11px] text-slate-600 pt-1">
                        <strong>Referensi:</strong> {currentBab.pengayaan.referensiLanjut}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-teal-700" />
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      R. Remedial
                    </h3>
                  </div>
                  <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-black text-teal-950">
                      Fokus: {currentBab.remedial.fokusMateri}
                    </h4>
                    <p className="text-teal-900 font-medium leading-relaxed">
                      {currentBab.remedial.kegiatan}
                    </p>
                  </div>
                </div>
              </div>

              {/* RUBRIK: GLOSARIUM & REFERENSI BAB */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Layers className="w-5 h-5 text-teal-800" />
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    S. Glosarium Bab & Referensi Pustaka
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentBab.glosarium.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <strong className="text-teal-950">{g.istilah}:</strong>{" "}
                      <span className="text-slate-700 font-medium">{g.arti}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Daftar Rujukan:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {currentBab.daftarPustaka.map((dp, idx) => (
                      <li key={idx} className="font-medium">{dp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RUBRIK: INTEGRASI GENERATOR MEDIA AI */}
              <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-md border border-teal-800/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    T. Integrasi Bahan Ajar AI & Game Interaktif
                  </h3>
                </div>

                <p className="text-xs text-teal-200 leading-relaxed max-w-2xl font-medium">
                  Manfaatkan modul generator kecerdasan buatan untuk mengonversi bab ini secara instan menjadi video pembelajaran, kuis mini, TTS, LKPD terformat, atau bank soal CBT online.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {onNavigateToBahanAjarAi && (
                    <>
                      <button
                        onClick={() =>
                          onNavigateToBahanAjarAi({
                            kelas: "8",
                            materi: currentBab.judulBab,
                            subMateri: currentBab.materiPembelajaran[0]?.subJudul || "",
                            targetTab: "VIDEO"
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                      >
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        <span>Generator Video AI</span>
                      </button>

                      <button
                        onClick={() =>
                          onNavigateToBahanAjarAi({
                            kelas: "8",
                            materi: currentBab.judulBab,
                            subMateri: currentBab.materiPembelajaran[0]?.subJudul || "",
                            targetTab: "GAME"
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                      >
                        <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Game Interaktif</span>
                      </button>

                      <button
                        onClick={() =>
                          onNavigateToBahanAjarAi({
                            kelas: "8",
                            materi: currentBab.judulBab,
                            subMateri: currentBab.materiPembelajaran[0]?.subJudul || "",
                            targetTab: "TTS"
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                      >
                        <Puzzle className="w-3.5 h-3.5 text-teal-300" />
                        <span>TTS PAI</span>
                      </button>

                      <button
                        onClick={() =>
                          onNavigateToBahanAjarAi({
                            kelas: "8",
                            materi: currentBab.judulBab,
                            subMateri: currentBab.materiPembelajaran[0]?.subJudul || "",
                            targetTab: "LKPD"
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-300" />
                        <span>Buat LKPD Otomatis</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Navigation Buttons (Prev / Next Bab) */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  disabled={currentBab.babNomor === 1}
                  onClick={() => {
                    setSelectedBabNomor((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
                    currentBab.babNomor === 1
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bab Sebelumnya</span>
                </button>

                <span className="text-xs font-bold text-slate-500">
                  Bab {currentBab.babNomor} dari 10
                </span>

                <button
                  disabled={currentBab.babNomor === 10}
                  onClick={() => {
                    setSelectedBabNomor((prev) => Math.min(10, prev + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
                    currentBab.babNomor === 10
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-gradient-to-r from-teal-800 to-emerald-900 hover:from-teal-900 hover:to-emerald-950 text-white shadow-sm cursor-pointer"
                  }`}
                >
                  <span>Bab Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: GLOSARIUM LENGKAP KELAS 8 */}
          {activeView === "glosarium" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-800" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Glosarium Istilah Lengkap PAI Kelas VIII
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                  {GLOSARIUM_LENGKAP_KELAS_8.length} Istilah
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GLOSARIUM_LENGKAP_KELAS_8.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1"
                  >
                    <span className="font-black text-sm text-teal-900 block">
                      {item.istilah}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.arti}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: DAFTAR PUSTAKA LENGKAP KELAS 8 */}
          {activeView === "pustaka" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Scroll className="w-5 h-5 text-teal-800" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Daftar Pustaka & Rujukan Resmi
                </h3>
              </div>

              <div className="space-y-3">
                {DAFTAR_PUSTAKA_LENGKAP_KELAS_8.map((pustaka, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {pustaka}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: AI GENERATOR BUKU PELAJARAN                       */}
      {/* ======================================================== */}
      {isAiGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 text-base">
                  Generator Bahan Ajar AI — Buku PAI Kelas VIII
                </h3>
              </div>
              <button
                onClick={() => setIsAiGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {!isGenerating ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih cakupan materi buku pelajaran digital yang ingin disinkronkan dan dihasilkan secara komprehensif menggunakan modul kecerdasan buatan:
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Cakupan Generator:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setGenScope("bab")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        genScope === "bab"
                          ? "bg-teal-800 text-white border-teal-800 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>Satu Bab Spesifik</span>
                      <span className="block text-[10px] font-normal opacity-85">
                        Bab {genTargetBab}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenScope("all")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        genScope === "all"
                          ? "bg-teal-800 text-white border-teal-800 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>Seluruh 10 Bab</span>
                      <span className="block text-[10px] font-normal opacity-85">
                        Semester 1 & 2
                      </span>
                    </button>
                  </div>
                </div>

                {genScope === "bab" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pilih Nomor Bab:
                    </label>
                    <select
                      value={genTargetBab}
                      onChange={(e) => setGenTargetBab(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {SEMUA_BAB_KELAS_8.map((b) => (
                        <option key={b.babNomor} value={b.babNomor}>
                          Bab {b.babNomor}: {b.judulBab}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAiGeneratorModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAiGenerator}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white font-extrabold text-xs shadow-md hover:from-teal-900 hover:to-emerald-950 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Mulai Susun Buku AI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-800 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-slate-900">
                    Menyusun Buku Digital PAI Kelas VIII...
                  </h4>
                  <p className="text-xs text-slate-500">{genProgressText}</p>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${genPercent}%` }}
                  />
                </div>
                <span className="text-xs font-black text-teal-800">
                  {genPercent}% Selesai
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROMPT SISTEM GENERATOR BUKU PELAJARAN AI         */}
      {/* ======================================================== */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Prompt Sistem AI: Generator Buku Pelajaran PAI Kelas 8
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Spesifikasi baku prompt rekayasa instruksi untuk menyusun buku digital lengkap
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Prompt View Content */}
            <div className="flex-1 overflow-y-auto my-4 p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed space-y-2 whitespace-pre-wrap select-all">
              {PROMPT_SISTEM_GENERATOR_BUKU_PAI_8}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
              <span className="text-[11px] text-slate-500">
                Panjang: ~{PROMPT_SISTEM_GENERATOR_BUKU_PAI_8.length} karakter
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(PROMPT_SISTEM_GENERATOR_BUKU_PAI_8, "system-prompt-8")}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  {copiedText === "system-prompt-8" ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Prompt Sistem</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
