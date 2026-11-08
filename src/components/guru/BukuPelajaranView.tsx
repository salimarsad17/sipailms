/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Book,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  School,
  CheckCircle2,
  Layers,
  Award,
  Sparkles,
  Printer,
  Search,
  FileText,
  Scroll,
  Check,
  HelpCircle,
  Info,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Compass,
  ArrowRight
} from "lucide-react";
import {
  LIST_BUKU_PAI_KEMENDIKBUD,
  BukuPelajaranData,
  BabPelajaranData
} from "../../data/bukuPaiKemendikbud";

interface BukuPelajaranViewProps {
  guruNama?: string;
  namaSekolah?: string;
  role?: "GURU" | "SISWA";
}

export default function BukuPelajaranView({
  guruNama,
  namaSekolah,
  role = "GURU"
}: BukuPelajaranViewProps) {
  // Selected book: "buku-smp-7" | "buku-smp-8" | "buku-smp-9"
  const [selectedBukuId, setSelectedBukuId] = useState<string>("buku-smp-7");
  // Active view inside the book: "cover" | "daftar_isi" | "baca_bab" | "glosarium"
  const [activeView, setActiveView] = useState<"cover" | "daftar_isi" | "baca_bab" | "glosarium">("cover");
  // Semester filter on Daftar Isi: "all" | 1 | 2
  const [semesterFilter, setSemesterFilter] = useState<"all" | 1 | 2>("all");
  // Selected chapter number (1 to 10)
  const [selectedBabNomor, setSelectedBabNomor] = useState<number>(1);
  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  // Bookmarks
  const [bookmarkedBab, setBookmarkedBab] = useState<number[]>([]);
  // Quiz user answers: Record<questionIndex, selectedOptionIndex>
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showPembahasan, setShowPembahasan] = useState<Record<string, boolean>>({});
  // Reader font scale: "normal" | "large" | "xlarge"
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  // Current active book object
  const currentBuku: BukuPelajaranData = useMemo(() => {
    return (
      LIST_BUKU_PAI_KEMENDIKBUD.find((b) => b.id === selectedBukuId) ||
      LIST_BUKU_PAI_KEMENDIKBUD[0]
    );
  }, [selectedBukuId]);

  // Current active chapter object
  const currentBab: BabPelajaranData = useMemo(() => {
    return (
      currentBuku.babList.find((b) => b.babNomor === selectedBabNomor) ||
      currentBuku.babList[0]
    );
  }, [currentBuku, selectedBabNomor]);

  // Filtered chapters for table of contents
  const filteredBabList = useMemo(() => {
    return currentBuku.babList.filter((b) => {
      const matchSemester = semesterFilter === "all" || b.semester === semesterFilter;
      const matchQuery =
        !searchQuery.trim() ||
        b.judulBab.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.materiPokok.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSemester && matchQuery;
    });
  }, [currentBuku, semesterFilter, searchQuery]);

  // Navigation handlers
  const handleSelectBab = (babNomor: number) => {
    setSelectedBabNomor(babNomor);
    setActiveView("baca_bab");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextBab = () => {
    const currentIndex = currentBuku.babList.findIndex((b) => b.babNomor === selectedBabNomor);
    if (currentIndex < currentBuku.babList.length - 1) {
      setSelectedBabNomor(currentBuku.babList[currentIndex + 1].babNomor);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevBab = () => {
    const currentIndex = currentBuku.babList.findIndex((b) => b.babNomor === selectedBabNomor);
    if (currentIndex > 0) {
      setSelectedBabNomor(currentBuku.babList[currentIndex - 1].babNomor);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleBookmark = (babNo: number) => {
    setBookmarkedBab((prev) =>
      prev.includes(babNo) ? prev.filter((n) => n !== babNo) : [...prev, babNo]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme accent colors based on Grade
  const gradeTheme = useMemo(() => {
    if (selectedBukuId === "buku-smp-7") {
      return {
        name: "Kelas VII",
        colorBg: "from-emerald-900 via-teal-950 to-slate-950",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
        accentText: "text-emerald-400",
        coverSpine: "bg-emerald-800",
        coverBg: "from-emerald-950 via-teal-950 to-slate-950",
        highlightBorder: "border-emerald-600/50",
        badgeGold: "bg-amber-400 text-slate-950",
        btnPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
      };
    } else if (selectedBukuId === "buku-smp-8") {
      return {
        name: "Kelas VIII",
        colorBg: "from-teal-900 via-cyan-950 to-slate-950",
        badgeBg: "bg-teal-500/20 text-teal-300 border-teal-400/30",
        accentText: "text-teal-300",
        coverSpine: "bg-teal-800",
        coverBg: "from-teal-950 via-slate-950 to-cyan-950",
        highlightBorder: "border-teal-600/50",
        badgeGold: "bg-amber-400 text-slate-950",
        btnPrimary: "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white"
      };
    } else {
      return {
        name: "Kelas IX",
        colorBg: "from-blue-900 via-indigo-950 to-slate-950",
        badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        accentText: "text-blue-300",
        coverSpine: "bg-blue-800",
        coverBg: "from-blue-950 via-slate-950 to-indigo-950",
        highlightBorder: "border-blue-600/50",
        badgeGold: "bg-amber-400 text-slate-950",
        btnPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
      };
    }
  }, [selectedBukuId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* ======================================================== */}
      {/* 1. TOP SHELF: GRADE SWITCHER & OFFICIAL LOGO HEADER      */}
      {/* ======================================================== */}
      <div className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-r ${gradeTheme.colorBg} text-white shadow-xl border border-white/10 relative overflow-hidden`}>
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/15 font-bold text-xs">
                <School className="w-3.5 h-3.5 text-amber-300" />
                Kemendikbudristek & Kemenag RI
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${gradeTheme.badgeBg} font-bold text-xs`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kurikulum Merdeka • CP No. 032/H/KR/2024
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black text-xs">
                Fase D (SMP/MTs)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Buku Pelajaran Digital PAI & Budi Pekerti
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Buku teks digital resmi lengkap Semester 1 & Semester 2 untuk Kelas 7, 8, dan 9 dengan sampul buku digital, daftar isi interaktif, dalil Al-Qur'an terverifikasi, dan materi pembelajaran komprehensif.
            </p>
          </div>

          {/* Book / Grade Selector Tabs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
              Pilih Buku Pelajaran:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {LIST_BUKU_PAI_KEMENDIKBUD.map((buku) => {
                const isActive = buku.id === selectedBukuId;
                return (
                  <button
                    key={buku.id}
                    onClick={() => {
                      setSelectedBukuId(buku.id);
                      setSelectedBabNomor(1);
                      setActiveView("cover");
                    }}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-102 ring-2 ring-amber-300"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    <Book className="w-4 h-4 mb-1" />
                    <span>{buku.tingkat}</span>
                    <span className="text-[10px] font-medium opacity-85">Sem 1 & 2</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs inside the active book */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveView("cover")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                activeView === "cover"
                  ? "bg-white text-slate-950 shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Book className="w-3.5 h-3.5" />
              <span>Cover Buku</span>
            </button>

            <button
              onClick={() => setActiveView("daftar_isi")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                activeView === "daftar_isi"
                  ? "bg-white text-slate-950 shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daftar Isi (10 Bab)</span>
            </button>

            <button
              onClick={() => setActiveView("baca_bab")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                activeView === "baca_bab"
                  ? "bg-white text-slate-950 shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Baca Bab {currentBab.babNomor}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
              title="Cetak Halaman atau Simpan ke PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>

            <span className="text-[11px] font-bold text-slate-300 hidden md:inline">
              {currentBuku.penulis}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIEW: REALISTIC BOOK COVER ("COVER BUKU")             */}
      {/* ======================================================== */}
      {activeView === "cover" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Realistic 3D Textbook Cover Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group perspective-1000 max-w-[320px] sm:max-w-[360px] w-full">
              {/* Realistic book shadow underneath */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>

              {/* Physical Book Cover Container */}
              <div className={`relative bg-gradient-to-br ${gradeTheme.coverBg} rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-2xl border-2 ${gradeTheme.highlightBorder} overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[500px]`}>
                {/* Book Spine Simulation Effect */}
                <div className={`absolute top-0 bottom-0 left-0 w-4 ${gradeTheme.coverSpine} opacity-60 border-r border-white/20`}></div>
                {/* Gloss / sheen gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

                {/* Top Ministry Header on Cover */}
                <div className="relative z-10 pl-3 space-y-1.5 text-center border-b border-white/15 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <School className="w-5 h-5 text-amber-300" />
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-200">
                      KEMENTERIAN PENDIDIKAN RI
                    </span>
                  </div>
                  <p className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest">
                    Badan Standar, Kurikulum, & Asesmen Pendidikan (BSKAP)
                  </p>
                </div>

                {/* Center Core Emblem & Title */}
                <div className="relative z-10 my-auto text-center space-y-3 py-6 pl-3">
                  <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md">
                    KURIKULUM MERDEKA
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                    Pendidikan Agama Islam
                    <span className="block text-amber-300 font-extrabold text-lg sm:text-xl">
                      dan Budi Pekerti
                    </span>
                  </h2>

                  {/* Large Grade Medallion */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-xl border-2 border-white/50 font-black text-2xl my-2">
                    {selectedBukuId === "buku-smp-7" ? "VII" : selectedBukuId === "buku-smp-8" ? "VIII" : "IX"}
                  </div>

                  <p className="text-xs font-bold text-emerald-200 tracking-wider uppercase">
                    Untuk SMP/MTs • Fase D
                  </p>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Semester 1 (Ganjil) & Semester 2 (Genap)
                  </p>
                </div>

                {/* Bottom Footer on Cover */}
                <div className="relative z-10 pl-3 pt-4 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="truncate max-w-[170px] font-medium">
                    Penulis: {currentBuku.penulis}
                  </span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300 font-bold">
                    10 Bab
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Metadata, Overview & Quick Action Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                  {currentBuku.tingkat}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                  Semester 1 & 2
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-extrabold text-xs">
                  10 Bab Pelajaran
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentBuku.judul}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentBuku.deskripsiBuku}
              </p>
            </div>

            {/* Quick Structure Pill Cards: Semester 1 and Semester 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-black text-[10px] uppercase">
                    Semester 1 (Ganjil)
                  </span>
                  <span className="text-xs font-bold text-emerald-800">Bab 1 s/d 5</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Membahas 5 bab pembelajaran fondasi akidah, tajwid Al-Qur'an, akhlak terpuji, dan fikih ibadah.
                </p>
                <button
                  onClick={() => handleSelectBab(1)}
                  className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Mulai Bab 1</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-800 text-white font-black text-[10px] uppercase">
                    Semester 2 (Genap)
                  </span>
                  <span className="text-xs font-bold text-blue-800">Bab 6 s/d 10</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Melanjutkan 5 bab pembelajaran lanjutan fikih muamalah, keteladanan rasul/sahabat, dan peradaban Islam.
                </p>
                <button
                  onClick={() => handleSelectBab(6)}
                  className="text-xs font-black text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Mulai Bab 6</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Book Publishing Identity Table */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-black text-slate-900 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-600" />
                Identitas Resmi Publikasi Buku
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-slate-500 block text-[11px]">Penulis / Penyusun:</span>
                  <span className="font-bold text-slate-800">{currentBuku.penulis}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Penerbit Resmi:</span>
                  <span className="font-bold text-slate-800">{currentBuku.penerbit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Regulasi Kurikulum:</span>
                  <span className="font-bold text-slate-800">{currentBuku.regulasiCP}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Edisi / Tahun:</span>
                  <span className="font-bold text-slate-800">{currentBuku.tahunTerbit}</span>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveView("daftar_isi")}
                className={`px-6 py-3 rounded-2xl ${gradeTheme.btnPrimary} font-black text-sm flex items-center gap-2 shadow-lg transition transform hover:scale-[1.02] cursor-pointer`}
              >
                <Layers className="w-4 h-4" />
                <span>Buka Daftar Isi Lengkap</span>
              </button>

              <button
                onClick={() => handleSelectBab(1)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Mulai Baca Bab 1 (Semester 1)</span>
              </button>

              <button
                onClick={() => handleSelectBab(6)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Langsung ke Semester 2 (Bab 6)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VIEW: TABLE OF CONTENTS ("DAFTAR ISI")                */}
      {/* ======================================================== */}
      {activeView === "daftar_isi" && (
        <div className="space-y-6">
          {/* Controls Bar: Semester Filter & Search */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Semester Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
              <button
                onClick={() => setSemesterFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  semesterFilter === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Semester (10 Bab)
              </button>
              <button
                onClick={() => setSemesterFilter(1)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  semesterFilter === 1
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🟢 Semester 1 (Bab 1 - 5)
              </button>
              <button
                onClick={() => setSemesterFilter(2)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  semesterFilter === 2
                    ? "bg-blue-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🔵 Semester 2 (Bab 6 - 10)
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari bab atau materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Table of Contents Book Pages Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 space-y-8">
            {/* Header of Table of Contents */}
            <div className="text-center max-w-xl mx-auto space-y-1 border-b border-slate-200 pb-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
                DAFTAR ISI RESMI • {currentBuku.tingkat}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pendidikan Agama Islam dan Budi Pekerti
              </h3>
              <p className="text-xs text-slate-500">
                Berdasarkan 5 Elemen Capaian Pembelajaran Kurikulum Merdeka (BSKAP No. 032/H/KR/2024)
              </p>
            </div>

            {/* List of Chapters Styled as a Realistic Table of Contents */}
            <div className="space-y-4">
              {filteredBabList.map((bab) => {
                const isSem1 = bab.semester === 1;
                return (
                  <div
                    key={bab.babNomor}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 bg-gradient-to-r from-white via-slate-50/50 to-white hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => handleSelectBab(bab.babNomor)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Bab Number Badge */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow-sm ${
                          isSem1
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-blue-100 text-blue-900 border border-blue-300"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-75">
                          BAB
                        </span>
                        <span className="text-lg leading-none font-black">{bab.babNomor}</span>
                      </div>

                      {/* Chapter Title & Sub-topics */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${
                              isSem1 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}
                          >
                            Semester {bab.semester}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Elemen: {bab.elemenCP}
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {bab.kategori}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800 transition tracking-tight leading-snug">
                          {bab.judulBab}
                        </h4>

                        {/* Sub Topics Preview */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                          {bab.materiPokok.slice(0, 3).map((sub, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              <span className="truncate max-w-[260px]">{sub}</span>
                            </span>
                          ))}
                          {bab.materiPokok.length > 3 && (
                            <span className="text-emerald-700 font-bold">
                              +{bab.materiPokok.length - 3} sub-materi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 self-end md:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBab(bab.babNomor);
                        }}
                        className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
                          isSem1
                            ? "bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm"
                            : "bg-blue-800 hover:bg-blue-900 text-white shadow-sm"
                        }`}
                      >
                        <span>Mulai Baca</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. VIEW: CHAPTER READER ("BACA BAB LENGKAP")             */}
      {/* ======================================================== */}
      {activeView === "baca_bab" && (
        <div className="space-y-6">
          {/* Sticky Chapter Top Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveView("daftar_isi")}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Daftar Isi</span>
              </button>

              {/* Jump to Chapter Dropdown */}
              <select
                value={selectedBabNomor}
                onChange={(e) => setSelectedBabNomor(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-800 focus:outline-emerald-600 bg-slate-50 cursor-pointer"
              >
                {currentBuku.babList.map((b) => (
                  <option key={b.babNomor} value={b.babNomor}>
                    Bab {b.babNomor}: {b.judulBab.slice(0, 45)}... (Sem {b.semester})
                  </option>
                ))}
              </select>
            </div>

            {/* Stepper Buttons: Prev and Next Chapter */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevBab}
                disabled={selectedBabNomor <= 1}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bab Sebelumnya</span>
              </button>

              <button
                onClick={() => toggleBookmark(currentBab.babNomor)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  bookmarkedBab.includes(currentBab.babNomor)
                    ? "bg-amber-100 border-amber-300 text-amber-800"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
                title="Tandai / Bookmark Bab Ini"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextBab}
                disabled={selectedBabNomor >= currentBuku.babList.length}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
              >
                <span className="hidden sm:inline">Bab Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chapter Content Document Canvas */}
          <div className="bg-white rounded-3xl p-6 sm:p-9 lg:p-12 shadow-sm border border-slate-200 space-y-8">
            {/* Chapter Header Banner */}
            <div className="border-b border-slate-200 pb-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full font-black text-xs uppercase ${
                  currentBab.semester === 1 ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"
                }`}>
                  BAB {currentBab.babNomor} • SEMESTER {currentBab.semester}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                  {currentBuku.tingkat} • {currentBab.elemenCP}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-extrabold text-xs">
                  {currentBab.kategori}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {currentBab.judulBab}
              </h2>
            </div>

            {/* SECTION A: AYAT & DALIL AL-QUR'AN / HADIS */}
            {currentBab.dalilAyat && currentBab.dalilAyat.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                  <Scroll className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    A. Ayat dan Dalil Rujukan Utama
                  </h3>
                </div>

                <div className="space-y-4">
                  {currentBab.dalilAyat.map((dalil, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-amber-50/20 border border-emerald-200/90 shadow-2xs space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs">
                          {dalil.surah} Ayat {dalil.ayat}
                        </span>
                        {dalil.keterangan && (
                          <span className="text-[11px] font-bold text-emerald-800">
                            {dalil.keterangan}
                          </span>
                        )}
                      </div>

                      {/* Arabic text with traditional typography */}
                      <p className="text-right font-serif text-xl sm:text-2xl sm:leading-loose text-slate-950 font-bold tracking-wide py-2">
                        {dalil.teksArab}
                      </p>

                      {/* Latin transliteration */}
                      {dalil.latin && (
                        <p className="text-xs sm:text-sm text-emerald-950/90 font-medium italic bg-white/70 p-3 rounded-xl border border-emerald-100">
                          {dalil.latin}
                        </p>
                      )}

                      {/* Indonesian translation */}
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-100">
                        <strong className="text-emerald-900 block mb-1">Artinya:</strong>
                        <p>{dalil.arti}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION B: CAPAIAN PEMBELAJARAN & RINGKASAN BAB */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Compass className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  B. Capaian Pembelajaran & Ringkasan Bab
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                  <h4 className="text-xs font-black uppercase text-teal-950 tracking-wider">
                    Capaian Pembelajaran (CP) Elemen {currentBab.elemenCP}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentBab.capaianPembelajaran}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                    Ringkasan Materi Bab
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentBab.ringkasan}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION C: TUJUAN PEMBELAJARAN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  C. Tujuan Pembelajaran Siswa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentBab.tujuanPembelajaran.map((tujuan, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{tujuan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION D: MATERI POKOK & BAHAN AJAR LENGKAP */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  D. Uraian Materi Pokok Pembelajaran
                </h3>
              </div>

              {currentBab.bahanAjarLengkap ? (
                <div className="space-y-6">
                  {/* Pendahuluan */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong className="text-emerald-900 block mb-1 font-black">
                      Pengantar & Apersepsi Pembelajaran:
                    </strong>
                    <p>{currentBab.bahanAjarLengkap.pendahuluan}</p>
                  </div>

                  {/* Sub Materi Cards */}
                  <div className="space-y-5">
                    {currentBab.bahanAjarLengkap.subMateri.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 bg-white"
                      >
                        <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-black shrink-0">
                            {sIdx + 1}
                          </span>
                          <span>{sub.judul}</span>
                        </h4>

                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-9">
                          {sub.konten}
                        </div>

                        {sub.poinPenting && sub.poinPenting.length > 0 && (
                          <div className="ml-9 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                            <span className="text-[11px] font-black uppercase text-amber-900 block">
                              Poin Kunci & Intisari:
                            </span>
                            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                              {sub.poinPenting.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentBab.materiPokok.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {mIdx + 1}
                      </span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION E: ISTILAH-ISTILAH PENTING (GLOSARIUM BAB) */}
            {currentBab.istilahPenting && currentBab.istilahPenting.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FileText className="w-5 h-5 text-purple-700" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    E. Glosarium & Istilah Penting
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentBab.istilahPenting.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs space-y-1"
                    >
                      <strong className="text-purple-950 font-black text-xs block">
                        {item.kata}
                      </strong>
                      <p className="text-slate-700 leading-snug">{item.arti}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION F: AKTIVITAS SISWA & REFLEKSI KARAKTER */}
            {currentBab.bahanAjarLengkap?.aktivitasSiswa && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Award className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    F. Aktivitas Belajar & Pembiasaan Karakter
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
                    Lembar Kerja & Tugas Portofolio Mandiri
                  </h4>
                  <div className="space-y-2">
                    {currentBab.bahanAjarLengkap.aktivitasSiswa.map((akt, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-3 rounded-xl bg-white border border-blue-100 text-xs text-slate-800 flex items-start gap-2.5 font-medium"
                      >
                        <span className="w-5 h-5 rounded-md bg-blue-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          {aIdx + 1}
                        </span>
                        <span>{akt}</span>
                      </div>
                    ))}
                  </div>

                  {currentBab.bahanAjarLengkap.hikmahKarakter && (
                    <div className="pt-2 border-t border-blue-200/80 text-xs text-blue-900 font-semibold">
                      <strong>Refleksi Profil Pelajar Pancasila & Rahmatan Lil 'Alamin: </strong>
                      {currentBab.bahanAjarLengkap.hikmahKarakter}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION G: KUIS MINI PEMAHAMAN BAB */}
            {currentBab.kuisMini && currentBab.kuisMini.soalList.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      G. Uji Pemahaman: {currentBab.kuisMini.judulKuis}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {currentBab.kuisMini.soalList.length} Soal Latihan
                  </span>
                </div>

                <div className="space-y-4">
                  {currentBab.kuisMini.soalList.map((soal, qIdx) => {
                    const answered = userAnswers[soal.id] !== undefined;
                    const isCorrect = answered && userAnswers[soal.id] === soal.kunciJawaban;
                    const showExplain = showPembahasan[soal.id];

                    return (
                      <div
                        key={soal.id}
                        className={`p-5 rounded-2xl border transition ${
                          answered
                            ? isCorrect
                              ? "bg-emerald-50/50 border-emerald-300"
                              : "bg-red-50/40 border-red-200"
                            : "bg-slate-50/60 border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-black text-slate-800">
                            Soal No. {qIdx + 1} • {soal.judulPoinMateri}
                          </span>
                          {answered && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {isCorrect ? "Benar (+100)" : "Salah"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
                          {soal.pertanyaan}
                        </p>

                        {/* Options */}
                        <div className="space-y-2">
                          {soal.pilihan.map((pil, pIdx) => {
                            const isSelected = userAnswers[soal.id] === pIdx;
                            const isAnswerKey = soal.kunciJawaban === pIdx;
                            return (
                              <button
                                key={pIdx}
                                onClick={() => {
                                  setUserAnswers((prev) => ({ ...prev, [soal.id]: pIdx }));
                                  setShowPembahasan((prev) => ({ ...prev, [soal.id]: true }));
                                }}
                                className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                                  answered
                                    ? isAnswerKey
                                      ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-950"
                                      : isSelected
                                      ? "bg-red-100 border-red-300 font-bold text-red-950"
                                      : "bg-white border-slate-200 opacity-60"
                                    : isSelected
                                    ? "bg-emerald-100 border-emerald-500 font-bold text-emerald-950"
                                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-800"
                                }`}
                              >
                                <span>{pil}</span>
                                {answered && isAnswerKey && (
                                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Toggle */}
                        {showExplain && (
                          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                            <strong className="text-emerald-900 block font-bold">
                              Pembahasan & Dalil Rujukan:
                            </strong>
                            <p>{soal.pembahasan}</p>
                            {soal.dalilRujukan && (
                              <span className="text-[11px] text-slate-500 block">
                                Rujukan: {soal.dalilRujukan}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Stepper Navigation */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handlePrevBab}
                disabled={selectedBabNomor <= 1}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bab Sebelumnya (Bab {selectedBabNomor - 1})</span>
              </button>

              <button
                onClick={() => setActiveView("daftar_isi")}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Layers className="w-4 h-4" />
                <span>Kembali ke Daftar Isi</span>
              </button>

              <button
                onClick={handleNextBab}
                disabled={selectedBabNomor >= currentBuku.babList.length}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Bab Berikutnya (Bab {selectedBabNomor + 1})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
