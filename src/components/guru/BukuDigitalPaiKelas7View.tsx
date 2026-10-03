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
  Info
} from "lucide-react";
import { BabBukuPai7 } from "../../types/bukuPaiAi";
import {
  IDENTITAS_BUKU_PAI_KELAS_7,
  SEMUA_BAB_KELAS_7,
  GLOSARIUM_LENGKAP_KELAS_7,
  DAFTAR_PUSTAKA_LENGKAP_KELAS_7,
  PROMPT_SISTEM_GENERATOR_BUKU_PAI_7
} from "../../data/bukuDigitalPaiKelas7Data";
import { BahanAjarAiStorage } from "../../services/bahanAjarAiStorage";

interface BukuDigitalPaiKelas7ViewProps {
  guruNama?: string;
  namaSekolah?: string;
  onNavigateToBahanAjarAi?: (options?: {
    kelas: "7";
    materi: string;
    subMateri: string;
    targetTab?: "MATERI" | "VIDEO" | "GAME" | "TTS" | "LKPD" | "CBT";
  }) => void;
}

export default function BukuDigitalPaiKelas7View({
  guruNama,
  namaSekolah,
  onNavigateToBahanAjarAi
}: BukuDigitalPaiKelas7ViewProps) {
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
    ...IDENTITAS_BUKU_PAI_KELAS_7,
    guruPenyusun: guruNama || IDENTITAS_BUKU_PAI_KELAS_7.guruPenyusun,
    namaSekolah: namaSekolah || IDENTITAS_BUKU_PAI_KELAS_7.namaSekolah
  }), [guruNama, namaSekolah]);

  const currentBab: BabBukuPai7 = useMemo(() => {
    return (
      SEMUA_BAB_KELAS_7.find((b) => b.babNomor === selectedBabNomor) ||
      SEMUA_BAB_KELAS_7[0]
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
    setGenProgressText("Memeriksa kesesuaian kurikulum dan Capaian Pembelajaran...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(30);
    setGenProgressText("Menyusun peta konsep, apersepsi, dan prompt visual edukatif...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(55);
    setGenProgressText("Menelaah teks dalil Al-Qur'an dan Hadis terverifikasi Kemenag...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(75);
    setGenProgressText("Menyusun studi kasus kontekstual dan 6 variasi soal latihan...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(90);
    setGenProgressText("Menjalankan Kontrol Kualitas 10 Titik Cek...");
    await new Promise((r) => setTimeout(r, 600));

    setGenPercent(100);
    setGenProgressText("Buku Digital Berhasil Disusun!");
    await new Promise((r) => setTimeout(r, 400));

    setIsGenerating(false);
    setIsAiGeneratorModalOpen(false);

    if (genScope === "bab") {
      setSelectedBabNomor(genTargetBab);
      setActiveView("bab");
    } else if (genScope === "sem1") {
      setSelectedBabNomor(1);
      setActiveView("bab");
    } else if (genScope === "sem2") {
      setSelectedBabNomor(6);
      setActiveView("bab");
    } else {
      setSelectedBabNomor(1);
      setActiveView("bab");
    }
  };

  // Direct trigger to Bahan Ajar AI products
  const handleOpenMedia = (targetTab: "MATERI" | "VIDEO" | "GAME" | "TTS" | "LKPD" | "CBT") => {
    if (onNavigateToBahanAjarAi) {
      onNavigateToBahanAjarAi({
        kelas: "7",
        materi: currentBab.judulBab,
        subMateri: currentBab.materiPembelajaran[0]?.subJudul || currentBab.judulBab,
        targetTab
      });
    } else {
      alert(`Membuka generator media ${targetTab} untuk ${currentBab.judulBab}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase tracking-wider">
              📚 GENERATOR BUKU PELAJARAN AI
            </span>
            <span className="text-xs font-bold text-slate-500">
              PAI & Budi Pekerti SMP Kelas VII
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Buku Pelajaran Digital PAI Kelas 7
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {identitas.namaSekolah} • Pendidik: {identitas.guruPenyusun} • {identitas.tahunPelajaran}
          </p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer border border-purple-200 shadow-2xs"
            title="Lihat Prompt Sistem Generator Buku Pelajaran AI"
          >
            <FileText className="w-4 h-4 text-purple-700" />
            <span>📜 Prompt Sistem AI</span>
          </button>

          <button
            onClick={() => setIsAiGeneratorModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>✨ BUAT BUKU / BAB AI</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={() => setActiveView("cover")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
              activeView === "cover"
                ? "bg-emerald-800 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Sampul Buku</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BOOK LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: SIDEBAR DAFTAR ISI & NAVIGASI BUKU (3 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 sticky top-4 print:hidden">
          {/* Search box */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari materi atau istilah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Daftar Isi Tree View */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Daftar Isi Buku
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                10 Bab Lengkap
              </span>
            </div>

            {/* SEMESTER 1 (BAB 1 - 5) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block px-2">
                SEMESTER 1 (BAB 1 – 5)
              </span>
              {SEMUA_BAB_KELAS_7.slice(0, 5).map((bab) => {
                const isActive = activeView === "bab" && selectedBabNomor === bab.babNomor;
                const isSavedBookmark = bookmarkedBab.includes(bab.babNomor);

                return (
                  <button
                    key={bab.babNomor}
                    onClick={() => {
                      setSelectedBabNomor(bab.babNomor);
                      setActiveView("bab");
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-sm ring-2 ring-emerald-500"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 ${
                          isActive ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {bab.babNomor}
                      </span>
                      <span className="truncate">{bab.judulBab}</span>
                    </div>
                    {isSavedBookmark && (
                      <Bookmark className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-300" : "text-amber-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SEMESTER 2 (BAB 6 - 10) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider block px-2">
                SEMESTER 2 (BAB 6 – 10)
              </span>
              {SEMUA_BAB_KELAS_7.slice(5, 10).map((bab) => {
                const isActive = activeView === "bab" && selectedBabNomor === bab.babNomor;
                const isSavedBookmark = bookmarkedBab.includes(bab.babNomor);

                return (
                  <button
                    key={bab.babNomor}
                    onClick={() => {
                      setSelectedBabNomor(bab.babNomor);
                      setActiveView("bab");
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-sm ring-2 ring-emerald-500"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 ${
                          isActive ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {bab.babNomor}
                      </span>
                      <span className="truncate">{bab.judulBab}</span>
                    </div>
                    {isSavedBookmark && (
                      <Bookmark className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-300" : "text-amber-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RUJUKAN & EVALUASI AKHIR */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block px-2">
                PELENGKAP & ASESMEN
              </span>
              <button
                onClick={() => setActiveView("evaluasi_sem1")}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeView === "evaluasi_sem1"
                    ? "bg-blue-800 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Evaluasi Semester 1</span>
              </button>

              <button
                onClick={() => setActiveView("evaluasi_sem2")}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeView === "evaluasi_sem2"
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Evaluasi Semester 2</span>
              </button>

              <button
                onClick={() => setActiveView("glosarium")}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeView === "glosarium"
                    ? "bg-emerald-800 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Glosarium Terpadu</span>
              </button>

              <button
                onClick={() => setActiveView("pustaka")}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeView === "pustaka"
                    ? "bg-emerald-800 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Scroll className="w-4 h-4 text-emerald-400" />
                <span>Daftar Pustaka Resmi</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: MAIN READING VIEW & CHAPTER CONTENT (9 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* VIEW 1: COVER BUKU */}
          {activeView === "cover" && (
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white shadow-xl border border-teal-800/80 space-y-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                <BookOpen className="w-96 h-96 text-amber-300" />
              </div>

              {/* Cover Top Badges */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                  Bahan Ajar Digital PAI SMP
                </span>
                <span className="text-xs text-teal-200 font-bold">
                  {identitas.keteranganKurikulum}
                </span>
              </div>

              {/* Cover Title */}
              <div className="relative z-10 space-y-3 max-w-2xl">
                <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  PENDIDIKAN AGAMA ISLAM
                  <span className="block text-amber-300 text-2xl sm:text-4xl mt-1">
                    DAN BUDI PEKERTI
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-teal-100">
                  SMP/MTs KELAS VII (FASE D)
                </p>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                  {identitas.kataPengantar}
                </div>
              </div>

              {/* School & Identity Footer */}
              <div className="relative z-10 pt-6 border-t border-teal-800/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-teal-300 block font-bold uppercase text-[10px]">Satuan Pendidikan:</span>
                  <span className="font-black text-white text-sm">{identitas.namaSekolah}</span>
                </div>
                <div>
                  <span className="text-teal-300 block font-bold uppercase text-[10px]">Guru Penyusun:</span>
                  <span className="font-black text-white text-sm">{identitas.guruPenyusun}</span>
                </div>
                <div>
                  <span className="text-teal-300 block font-bold uppercase text-[10px]">Tahun Pelajaran:</span>
                  <span className="font-black text-white text-sm">{identitas.tahunPelajaran}</span>
                </div>
              </div>

              {/* Action start reading */}
              <div className="relative z-10 pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedBabNomor(1);
                    setActiveView("bab");
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition transform hover:scale-[1.02] cursor-pointer"
                >
                  <span>Mulai Membaca Bab 1</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAiGeneratorModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Kustomisasi / Generate Ulang dengan AI</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: CHAPTER CONTENT (STRUKTUR A s/d S LENGKAP) */}
          {activeView === "bab" && (
            <div className="space-y-6">
              {/* CHAPTER HEADER & MEDIA SHORTCUT TOOLBAR */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase">
                        BAB {currentBab.babNomor} • SEMESTER {currentBab.semester}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {currentBab.verification.status}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {currentBab.judulBab}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(currentBab.babNomor)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        bookmarkedBab.includes(currentBab.babNomor)
                          ? "bg-amber-50 text-amber-600 border-amber-300"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                      title="Tandai Halaman Ini (Bookmark)"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopy(window.location.href, "link-bab")}
                      className="p-2.5 rounded-xl bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                      title="Salin Link Bab"
                    >
                      {copiedText === "link-bab" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* SECTION X: INTEGRASI LANGSUNG DENGAN GENERATOR MEDIA PEMBELAJARAN */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-teal-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-950 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Generator Media Terintegrasi Otomatis (Bab {currentBab.babNomor}):
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      1-Klik Generate Produk
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleOpenMedia("MATERI")}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>📚 Pelajari Materi</span>
                    </button>

                    <button
                      onClick={() => handleOpenMedia("VIDEO")}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>🎬 Buat Video</span>
                    </button>

                    <button
                      onClick={() => handleOpenMedia("GAME")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>🎮 Buat Game</span>
                    </button>

                    <button
                      onClick={() => handleOpenMedia("TTS")}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Puzzle className="w-3.5 h-3.5" />
                      <span>🧩 Buat TTS</span>
                    </button>

                    <button
                      onClick={() => handleOpenMedia("LKPD")}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>📝 Buat LKPD</span>
                    </button>

                    <button
                      onClick={() => handleOpenMedia("CBT")}
                      className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>💻 Buat CBT</span>
                    </button>
                  </div>
                </div>

                {/* A. TUJUAN PEMBELAJARAN & B. KATA KUNCI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* A. Tujuan Pembelajaran */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
                      A. Tujuan Pembelajaran
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {currentBab.tujuanPembelajaran.map((tp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-snug">{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* B. Kata Kunci & C. Peta Konsep */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-amber-500 pl-2">
                        B. Kata Kunci
                      </h3>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {currentBab.kataKunci.map((kk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-xs text-emerald-900 shadow-2xs"
                          >
                            #{kk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-500 pl-2">
                        C. Peta Konsep Bab
                      </h3>
                      <div className="space-y-1 pt-2">
                        {currentBab.petaKonsep.map((pk, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                            <span className="text-blue-600 font-black">▸</span>
                            <span>{pk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* D. AYO MENGAMATI & PROMPT VISUAL AI */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-600" />
                      D. Ayo Mengamati
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                      Stimulasi Visual
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950 text-white space-y-2">
                    <span className="text-[10px] font-mono text-amber-300 uppercase block">
                      Deskripsi Adegan Visual / Ilustrasi Buku:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-serif">
                      "{currentBab.ayoMengamati.deskripsi}"
                    </p>
                    {currentBab.ayoMengamati.captionGambar && (
                      <span className="text-[11px] text-amber-200 italic block pt-1 border-t border-amber-900">
                        {currentBab.ayoMengamati.captionGambar}
                      </span>
                    )}
                  </div>

                  {/* Prompt Gambar AI */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-700 text-[10px] uppercase">
                        Prompt Generator Gambar AI:
                      </span>
                      <button
                        onClick={() => handleCopy(currentBab.ayoMengamati.imagePrompt, "prompt-gambar")}
                        className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === "prompt-gambar" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Salin Prompt</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-slate-600 leading-tight">
                      {currentBab.ayoMengamati.imagePrompt}
                    </p>
                  </div>

                  {/* Pertanyaan Pengamatan */}
                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-black text-slate-800">Pertanyaan Pengamatan:</span>
                    <ul className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                      {currentBab.ayoMengamati.pertanyaanPengamatan.map((tanya, idx) => (
                        <li key={idx}>{tanya}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* E. AYO BERPIKIR (PERTANYAAN PEMANTIK & HOTS) */}
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    E. Ayo Berpikir (Pertanyaan Pemantik & Penalaran HOTS)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {currentBab.ayoBerpikir.map((ab, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-blue-100 text-xs text-slate-800 shadow-2xs font-medium">
                        💡 {ab}
                      </div>
                    ))}
                  </div>
                </div>

                {/* F. MATERI PEMBELAJARAN (URAISAN SUB-BAB) */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-4 border-emerald-700 pl-2.5">
                    F. Materi Pembelajaran & Konsep Inti
                  </h3>
                  <div className="space-y-4">
                    {currentBab.materiPembelajaran.map((mp, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{mp.subJudul}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line pl-8">
                          {mp.konten}
                        </p>
                        {mp.poinKunci && (
                          <div className="ml-8 flex flex-wrap gap-1.5 pt-1">
                            {mp.poinKunci.map((pk, pIdx) => (
                              <span key={pIdx} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                • {pk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* G. AYAT AL-QUR'AN DAN HADIS TERKAIT */}
                {currentBab.dalilTerkait && currentBab.dalilTerkait.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-4 border-amber-600 pl-2.5">
                      G. Ayat Al-Qur'an / Hadis Terkait & Penjelasan
                    </h3>
                    <div className="space-y-4">
                      {currentBab.dalilTerkait.map((dalil, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white space-y-4 border border-emerald-800 shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                              {dalil.sumber}
                            </span>
                            <Scroll className="w-4 h-4 text-amber-300" />
                          </div>

                          {/* Ayat Arab */}
                          <p className="text-xl sm:text-2xl font-serif text-right leading-loose text-amber-200 font-bold pr-2" dir="rtl">
                            {dalil.teksArab}
                          </p>

                          {dalil.latin && (
                            <p className="text-xs text-emerald-200 italic font-medium leading-relaxed bg-white/5 p-2 rounded-xl">
                              {dalil.latin}
                            </p>
                          )}

                          {/* Terjemahan */}
                          <div className="pt-2 border-t border-emerald-800/80 space-y-1">
                            <span className="text-[10px] font-black uppercase text-emerald-300">
                              Terjemahan Resmi Kemenag:
                            </span>
                            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                              "{dalil.terjemahan}"
                            </p>
                          </div>

                          {/* Penjelasan Dalil */}
                          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 text-xs text-emerald-100 leading-relaxed">
                            <strong>Kandungan Dalil:</strong> {dalil.penjelasanDalil}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* H. PENJELASAN KONSEP & I. CONTOH DALAM KEHIDUPAN SEHARI-HARI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* H. Penjelasan Konsep */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-indigo-600 pl-2">
                      H. Penjelasan Konsep Inti
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {currentBab.penjelasanKonsep.map((pk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">▪</span>
                          <span className="leading-snug">{pk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* I. Contoh Kehidupan Sehari-hari */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
                      I. Contoh dalam Kehidupan Sehari-hari
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {currentBab.contohKehidupan.map((ck, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="leading-snug">{ck}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* J. AKTIVITAS INDIVIDU & K. AKTIVITAS KELOMPOK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                      J. Aktivitas Individu
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {currentBab.aktivitasIndividu.map((ai, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{ai}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-teal-950">
                      K. Aktivitas Kelompok / Kolaboratif
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {currentBab.aktivitasKelompok.map((ak, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-teal-200 text-teal-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{ak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* L. STUDI KASUS KONTEKSTUAL (MINIMAL 2 KASUS) */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-4 border-rose-600 pl-2.5">
                    L. Studi Kasus Kontekstual Remaja SMP
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentBab.studiKasus.map((kasus) => (
                      <div key={kasus.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-black text-rose-900 uppercase">
                            Kasus: {kasus.judul}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-bold">
                            Analisis Nilai
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          <strong>Situasi:</strong> {kasus.situasi}
                        </p>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                          <strong>Fokus Masalah:</strong> {kasus.masalah}
                          <br />
                          <strong>Nilai Islam Terkait:</strong> {kasus.nilaiIslam}
                        </div>
                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-black text-slate-800">Pertanyaan Pemecahan:</span>
                          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                            {kasus.pertanyaan.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* M. AYO BERDISKUSI */}
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    M. Ayo Berdiskusi
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentBab.ayoBerdiskusi.map((diskusi, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-medium">
                        <span className="text-indigo-600 font-bold">💬</span>
                        <span>{diskusi}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* N. AYO BERLATIH (6 FORMAT SOAL SESUAI PROMPT) */}
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2.5">
                        N. Ayo Berlatih (Format Lengkap Soal Bab {currentBab.babNomor})
                      </h3>
                      <p className="text-xs text-slate-500 pl-3.5 mt-0.5">
                        10 Pilihan Ganda • 5 Isian • 5 Benar/Salah • 5 Menjodohkan • 5 Uraian • 2 HOTS
                      </p>
                    </div>
                  </div>

                  {/* 1. PILIHAN GANDA (10 SOAL DENGAN PEMBAHASAN INTERAKTIF) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 p-2.5 rounded-xl">
                      Bagian 1: Soal Pilihan Ganda (10 Butir)
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {currentBab.latihan.pilihanGanda.map((pg) => {
                        const answered = userAnswers[`pg-${pg.no}`] !== undefined;
                        const selectedIdx = userAnswers[`pg-${pg.no}`];
                        const isCorrect = selectedIdx === pg.kunci;
                        const showPemb = showPembahasan[`pg-${pg.no}`];

                        return (
                          <div key={pg.no} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {pg.no}. {pg.soal}
                              </span>
                              {answered && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                                    isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {isCorrect ? "✓ BENAR" : "✗ SALAH"}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {pg.opsi.map((op, oIdx) => {
                                let btnClass = "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200";
                                if (answered) {
                                  if (oIdx === pg.kunci) btnClass = "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold";
                                  else if (oIdx === selectedIdx) btnClass = "bg-red-100 text-red-900 border-red-300";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => setUserAnswers((prev) => ({ ...prev, [`pg-${pg.no}`]: oIdx }))}
                                    disabled={answered}
                                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${btnClass}`}
                                  >
                                    <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center font-bold text-[10px] shrink-0 border border-slate-200">
                                      {["A", "B", "C", "D"][oIdx]}
                                    </span>
                                    <span className="leading-tight">{op}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {answered && (
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <button
                                  onClick={() => setShowPembahasan((prev) => ({ ...prev, [`pg-${pg.no}`]: !prev[`pg-${pg.no}`] }))}
                                  className="text-emerald-700 font-bold text-[11px] hover:underline cursor-pointer"
                                >
                                  {showPemb ? "Sembunyikan Pembahasan" : "💡 Lihat Pembahasan Kunci"}
                                </button>
                                {showPemb && (
                                  <span className="text-[11px] text-slate-600 italic">
                                    {pg.pembahasan}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. ISIAN & BENAR/SALAH */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Isian */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-1.5">
                        Bagian 2: Soal Isian Singkat
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
                        {currentBab.latihan.isian.map((is) => (
                          <li key={is.no}>
                            <span>{is.soal}</span>
                            <span className="block mt-1 font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                              Kunci: {is.kunciSingkat}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Benar / Salah */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-1.5">
                        Bagian 3: Soal Benar / Salah
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700">
                        {currentBab.latihan.benarSalah.map((bs) => (
                          <div key={bs.no} className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span>{bs.no}. {bs.pernyataan}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${bs.jawabanBenar ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                {bs.jawabanBenar ? "BENAR" : "SALAH"}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 italic block">
                              Alasan: {bs.alasan}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. MENJODOHKAN & URAIAN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Menjodohkan */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-1.5">
                        Bagian 4: Menjodohkan Pernyataan
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {currentBab.latihan.menjodohkan.map((mj) => (
                          <div key={mj.no} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-800">{mj.premis}</span>
                            <span className="text-emerald-700 font-semibold text-right max-w-[200px]">
                              ↔ {mj.pasangan}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soal Uraian */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-1.5">
                        Bagian 5: Soal Uraian & Pembahasan
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700">
                        {currentBab.latihan.uraian.map((ur) => (
                          <div key={ur.no} className="space-y-1 border-b border-slate-100 pb-1.5 last:border-0">
                            <span className="font-bold text-slate-900">{ur.no}. {ur.pertanyaan}</span>
                            <span className="text-[11px] text-slate-600 block pl-3 border-l-2 border-emerald-500 italic">
                              Rubrik Kunci: {ur.rubrikJawaban}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Soal HOTS */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      Bagian 6: Soal Tantangan HOTS (Higher Order Thinking Skills)
                    </h4>
                    <div className="space-y-3">
                      {currentBab.latihan.soalHots.map((hots) => (
                        <div key={hots.no} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5">
                          <span className="font-black text-amber-900 block">
                            HOTS #{hots.no}: {hots.pertanyaan}
                          </span>
                          <p className="text-[11px] text-slate-600 italic pl-3 border-l-2 border-amber-400">
                            <strong>Pedoman Penilaian:</strong> {hots.rubrikJawaban}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* O. AYO BEREFLEKSI (LEMBAR REFLEKSI SISWA) */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    O. Ayo Berefleksi (Lembar Refleksi Diri Siswa)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-emerald-100">
                      <span className="font-black text-emerald-900 block">Saya sudah memahami:</span>
                      {currentBab.refleksi.sudahDipahami.map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 p-3.5 rounded-xl bg-white border border-emerald-100">
                      <span className="font-black text-emerald-900 block">Sikap & Kebiasaan yang akan saya terapkan:</span>
                      <p className="text-slate-700 italic">"{currentBab.refleksi.sikapDiterapkan}"</p>
                      <p className="text-slate-600 text-[11px] pt-1">
                        <strong>Target Kebiasaan:</strong> {currentBab.refleksi.kebiasaanDilakukan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* P. RANGKUMAN BAB */}
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    P. Rangkuman Poin Penting Bab {currentBab.babNomor}
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {currentBab.rangkuman.map((rg, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0"></span>
                        <span className="leading-snug">{rg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* R. PENGAYAAN & S. REMEDIAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pengayaan */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-2">
                    <h3 className="font-black uppercase text-purple-950 text-[11px]">
                      R. Program Pengayaan
                    </h3>
                    <span className="font-bold text-purple-900 block">{currentBab.pengayaan.judulProyek}</span>
                    <p className="text-slate-600">{currentBab.pengayaan.deskripsi}</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pt-1">
                      {currentBab.pengayaan.tugas.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Remedial */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2">
                    <h3 className="font-black uppercase text-orange-950 text-[11px]">
                      S. Program Remedial
                    </h3>
                    <ul className="space-y-1 text-slate-700">
                      {currentBab.remedial.ringkasanKonsep.map((rk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-orange-600 font-bold">▪</span>
                          <span>{rk}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-1 border-t border-orange-200 space-y-1">
                      <span className="font-bold text-orange-900 text-[10px] uppercase">Latihan Mandiri:</span>
                      <ul className="list-disc list-inside text-slate-600 text-[11px]">
                        {currentBab.remedial.latihanMandiri.map((lm, idx) => (
                          <li key={idx}>{lm}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* BOTTOM NAVIGATION: PREV & NEXT CHAPTER */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                  <button
                    onClick={() => {
                      if (selectedBabNomor > 1) setSelectedBabNomor(selectedBabNomor - 1);
                      else setActiveView("cover");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{selectedBabNomor > 1 ? `Bab ${selectedBabNomor - 1}` : "Sampul Buku"}</span>
                  </button>

                  <span className="text-xs font-bold text-slate-400">
                    Bab {selectedBabNomor} dari 10
                  </span>

                  <button
                    onClick={() => {
                      if (selectedBabNomor < 10) setSelectedBabNomor(selectedBabNomor + 1);
                      else setActiveView("glosarium");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <span>{selectedBabNomor < 10 ? `Bab ${selectedBabNomor + 1}` : "Glosarium"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: GLOSARIUM TERPADU */}
          {activeView === "glosarium" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Daftar Istilah Penting
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Glosarium Terpadu PAI Kelas VII
                </h2>
                <p className="text-xs text-slate-500">
                  Kamus istilah syariat, akidah, fikih, dan sejarah yang digunakan dalam buku ini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GLOSARIUM_LENGKAP_KELAS_7.map((glos, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-black text-emerald-900 block">
                      {glos.istilah}
                    </span>
                    <p className="text-xs text-slate-700 leading-snug">
                      {glos.arti}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: DAFTAR PUSTAKA RESMI */}
          {activeView === "pustaka" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Sumber Rujukan Kredibel
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Daftar Pustaka Resmi & Terverifikasi
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar dokumen kurikulum, kitab hadis, mushaf Kemenag, dan buku acuan standar.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-slate-800">
                {DAFTAR_PUSTAKA_LENGKAP_KELAS_7.map((pustaka, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pustaka}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <strong>Catatan Standar Kurikulum:</strong>
                <p className="text-slate-700 leading-relaxed">
                  Buku digital ini disusun dengan mengacu pada Capaian Pembelajaran (CP) No. 032/H/KR/2024 dan buku teks resmi Kementerian Pendidikan Dasar dan Menengah RI serta mushaf Al-Qur'an Kementerian Agama RI.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 5: EVALUASI SEMESTER 1 & 2 */}
          {(activeView === "evaluasi_sem1" || activeView === "evaluasi_sem2") && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
                  Asesmen Sumatif Akhir Semester
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {activeView === "evaluasi_sem1" ? "Evaluasi Akhir Semester 1 (Bab 1–5)" : "Evaluasi Akhir Semester 2 (Bab 6–10)"}
                </h2>
                <p className="text-xs text-slate-500">
                  Ujian komprehensif mengukur pemahaman konsep, tilawah dalil, dan penalaran studi kasus.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-800 uppercase">
                    Kisi-Kisi Asesmen Sumatif
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Tersedia Kunci Jawaban Guru
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="block text-xl font-black text-emerald-800">25</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Pilihan Ganda</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="block text-xl font-black text-blue-800">10</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Isian Singkat</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="block text-xl font-black text-amber-800">5</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Uraian / Analisis</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="block text-xl font-black text-rose-800">3</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Studi Kasus HOTS</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => handleOpenMedia("CBT")}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center gap-2 mx-auto shadow-md transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Jadikan Ujian CBT Online di LMS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: GENERATOR BUKU / BAB DENGAN AI (POIN G & H PROMPT) */}
      {/* ======================================================== */}
      {isAiGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    Generator Buku Pelajaran AI
                  </h3>
                  <p className="text-[11px] text-slate-500">PAI SMP Kelas VII</p>
                </div>
              </div>
              <button
                onClick={() => !isGenerating && setIsAiGeneratorModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scope Selection */}
            {!isGenerating ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 block">Pilih Cakupan Pembuatan Buku:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGenScope("bab")}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        genScope === "bab" ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="block text-xs font-black">Per Bab</span>
                      <span className="text-[10px] text-slate-500">Buat 1 bab terpilih saja</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenScope("sem1")}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        genScope === "sem1" ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="block text-xs font-black">Semester 1</span>
                      <span className="text-[10px] text-slate-500">Bab 1 s/d Bab 5</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenScope("sem2")}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        genScope === "sem2" ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="block text-xs font-black">Semester 2</span>
                      <span className="text-[10px] text-slate-500">Bab 6 s/d Bab 10</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenScope("all")}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        genScope === "all" ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="block text-xs font-black">Buku Lengkap</span>
                      <span className="text-[10px] text-slate-500">Seluruh Bab 1 s/d 10</span>
                    </button>
                  </div>
                </div>

                {genScope === "bab" && (
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-700 block">Pilih Nomor Bab (1 s/d 10):</label>
                    <select
                      value={genTargetBab}
                      onChange={(e) => setGenTargetBab(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white"
                    >
                      {SEMUA_BAB_KELAS_7.map((b) => (
                        <option key={b.babNomor} value={b.babNomor}>
                          Bab {b.babNomor}: {b.judulBab} (Semester {b.semester})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 10 Quality check notice */}
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                  <span className="font-black block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    Kontrol Kualitas Otomatis (Check 1 s/d 10):
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    AI otomatis memverifikasi keabsahan ayat Al-Qur'an, nomor surah, hadis, fakta sejarah, dan kesesuaian bahasa siswa SMP.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAiGeneratorModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAiGenerator}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    ✨ MULAI GENERATE
                  </button>
                </div>
              </div>
            ) : (
              /* Generating state */
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">
                    Sedang Menyusun Buku Pelajaran AI...
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{genProgressText}</p>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300"
                    style={{ width: `${genPercent}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{genPercent}% Selesai</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROMPT SISTEM GENERATOR BUKU PELAJARAN AI         */}
      {/* ======================================================== */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Prompt Sistem Generator Buku Pelajaran AI
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Spesifikasi Kurikulum & Panduan Baku Buku Pelajaran Digital PAI SMP Kelas VII
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(PROMPT_SISTEM_GENERATOR_BUKU_PAI_7, "system-prompt-full")}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedText === "system-prompt-full" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Prompt</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pr-1">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed whitespace-pre-wrap select-all">
                {PROMPT_SISTEM_GENERATOR_BUKU_PAI_7}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sesuai Surat Edaran BSKAP Kemendikbudristek & Kemenag RI</span>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
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
