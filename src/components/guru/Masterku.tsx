/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Scroll,
  BookMarked,
  Sparkles,
  HeartHandshake,
  Lightbulb,
  Search,
  Copy,
  Check,
  Printer,
  ChevronRight,
  ExternalLink,
  Volume2,
  Bookmark,
  Share2,
  Filter,
  CheckCircle2,
  Award,
  Layers,
  GraduationCap,
  Calendar,
  Compass,
  ArrowRight,
  ChevronLeft,
  Info,
  FileText,
  School,
  Users,
  MapPin,
  Star,
  History,
  Landmark,
  ShieldCheck
} from "lucide-react";
import {
  LIST_SURAH_PILIHAN,
  LIST_HADIST_PILIHAN,
  LIST_BUKU_PELAJARAN,
  LIST_KISAH_NABI,
  LIST_NASEHAT_ISLAMI,
  LIST_HIKMAH_INSPIRATIF,
  SurahData,
  HadistData,
  HaditsItemData,
  TemaHadits,
  RawiUtama,
  BukuPelajaranData,
  KisahNabiData,
  NasehatIslamiData,
  HikmahData
} from "../../data/masterkuData";
import { QuranKemenag114 } from "./QuranKemenag114";

export type MasterkuCategory =
  | "alquran"
  | "hadist"
  | "buku"
  | "kisah_nabi"
  | "nasehat"
  | "hikmah";

interface MasterkuProps {
  initialCategory?: MasterkuCategory;
}

export const Masterku: React.FC<MasterkuProps> = ({ initialCategory = "alquran" }) => {
  // Main Category State
  const [activeCategory, setActiveCategory] = useState<MasterkuCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selection states for each module:
  // 1. Hadist
  const [selectedHadistId, setSelectedHadistId] = useState<string>(LIST_HADIST_PILIHAN[0].id);
  const [haditsRawiFilter, setHaditsRawiFilter] = useState<"all" | "bukhari" | "muslim" | "nasai" | "abu_daud" | "ibnu_majah">("all");
  const [haditsTemaFilter, setHaditsTemaFilter] = useState<"all" | "Tauhid" | "Ibadah" | "Akhlak" | "Fiqih">("all");
  const [haditsSearchQuery, setHaditsSearchQuery] = useState<string>("");

  // 3. Buku Pelajaran
  const [selectedBukuId, setSelectedBukuId] = useState<string>(LIST_BUKU_PELAJARAN[0].id);
  const [selectedBabNomor, setSelectedBabNomor] = useState<number>(1);
  const [bukuSemesterFilter, setBukuSemesterFilter] = useState<"all" | 1 | 2>("all");

  // 4. Kisah Nabi & Rasul
  const [selectedNabiNomor, setSelectedNabiNomor] = useState<number>(1); // Default Nabi Adam
  const [nabiSearchQuery, setNabiSearchQuery] = useState<string>("");
  const [nabiFilter, setNabiFilter] = useState<"all" | "ulul_azmi">("all");
  const [activeNabiTab, setActiveNabiTab] = useState<"semua" | "sejarah" | "keluarga" | "umat" | "mukjizat" | "ibrah">("semua");

  // 5. Nasehat Islami
  const [selectedNasehatId, setSelectedNasehatId] = useState<string>(LIST_NASEHAT_ISLAMI[0].id);

  // 6. Hikmah (Kisah Orang Sholih & Ulama Masyhur)
  const [selectedHikmahId, setSelectedHikmahId] = useState<string>(LIST_HIKMAH_INSPIRATIF[0].id);
  const [hikmahSearchQuery, setHikmahSearchQuery] = useState<string>("");
  const [hikmahFilterKategori, setHikmahFilterKategori] = useState<string>("all");

  // Toast / copy feedback
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrintCurrent = () => {
    window.print();
  };

  // Hadits Filtered List
  const allHaditsList = LIST_HADIST_PILIHAN as HaditsItemData[];
  const filteredHaditsList = allHaditsList.filter((h) => {
    if (haditsRawiFilter !== "all" && h.rawiUtama !== haditsRawiFilter) {
      return false;
    }
    if (haditsTemaFilter !== "all" && h.tema !== haditsTemaFilter) {
      return false;
    }
    if (haditsSearchQuery.trim()) {
      const q = haditsSearchQuery.toLowerCase().trim();
      const matchJudul = h.judul.toLowerCase().includes(q);
      const matchTerjemah = h.terjemah.toLowerCase().includes(q);
      const matchArab = h.arab.includes(q);
      const matchPerawi = h.perawi.toLowerCase().includes(q);
      const matchPenjelasan = h.penjelasan ? h.penjelasan.toLowerCase().includes(q) : false;
      const matchNomor = h.nomorHadits ? h.nomorHadits.toLowerCase().includes(q) : false;
      return matchJudul || matchTerjemah || matchArab || matchPerawi || matchPenjelasan || matchNomor;
    }
    return true;
  });

  // Current active selections
  const currentHadist = allHaditsList.find((h) => h.id === selectedHadistId) || filteredHaditsList[0] || allHaditsList[0];
  const currentHadistIndex = filteredHaditsList.findIndex((h) => h.id === currentHadist.id);
  const prevHadist = currentHadistIndex > 0 ? filteredHaditsList[currentHadistIndex - 1] : null;
  const nextHadist = currentHadistIndex >= 0 && currentHadistIndex < filteredHaditsList.length - 1 ? filteredHaditsList[currentHadistIndex + 1] : null;

  const currentBuku = LIST_BUKU_PELAJARAN.find((b) => b.id === selectedBukuId) || LIST_BUKU_PELAJARAN[0];
  const currentBab = currentBuku.babList.find((bb) => bb.babNomor === selectedBabNomor) || currentBuku.babList[0];
  const currentNabi = LIST_KISAH_NABI.find((n) => n.nomorUrut === selectedNabiNomor) || LIST_KISAH_NABI[0];
  const currentNasehat = LIST_NASEHAT_ISLAMI.find((n) => n.id === selectedNasehatId) || LIST_NASEHAT_ISLAMI[0];
  const currentHikmah = LIST_HIKMAH_INSPIRATIF.find((hk) => hk.id === selectedHikmahId) || LIST_HIKMAH_INSPIRATIF[0];

  // Hikmah Filter & Navigation Helpers
  const filteredHikmahList = LIST_HIKMAH_INSPIRATIF.filter((hk) => {
    const q = hikmahSearchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      hk.judul.toLowerCase().includes(q) ||
      hk.tokohKisah.toLowerCase().includes(q) ||
      hk.kategori.toLowerCase().includes(q) ||
      (hk.eraAtauMasa && hk.eraAtauMasa.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (hikmahFilterKategori === "all") return true;
    return hk.subKategori === hikmahFilterKategori;
  });

  const currentHikmahIndex = LIST_HIKMAH_INSPIRATIF.findIndex((h) => h.id === currentHikmah.id);
  const prevHikmah = currentHikmahIndex > 0 ? LIST_HIKMAH_INSPIRATIF[currentHikmahIndex - 1] : null;
  const nextHikmah = currentHikmahIndex < LIST_HIKMAH_INSPIRATIF.length - 1 ? LIST_HIKMAH_INSPIRATIF[currentHikmahIndex + 1] : null;


  const categories = [
    {
      id: "alquran" as MasterkuCategory,
      title: "Al-Qur'an & Terjemah",
      desc: "114 Surat & Terjemah Kemenag RI",
      icon: BookOpen,
      badge: "114 Surat Lengkap",
      color: "from-emerald-700 to-teal-800",
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      id: "hadist" as MasterkuCategory,
      title: "Hadist Pilihan",
      desc: "Matan Arab, syarah & perawi",
      icon: Scroll,
      badge: "125 Hadits (5 Ulama)",
      color: "from-amber-700 to-yellow-800",
      accent: "text-amber-700 bg-amber-50 border-amber-200"
    },
    {
      id: "buku" as MasterkuCategory,
      title: "Buku Pelajaran PAI",
      desc: "PAI Kelas 7, 8, 9 Kemendikbud CP 2024-2026",
      icon: BookMarked,
      badge: "CP BSKAP 2024-2026",
      color: "from-blue-700 to-indigo-800",
      accent: "text-blue-700 bg-blue-50 border-blue-200"
    },
    {
      id: "kisah_nabi" as MasterkuCategory,
      title: "Kisah Nabi & Rosul",
      desc: "Mukjizat, dakwah & keteladanan",
      icon: Compass,
      badge: "25 Nabi & Rasul",
      color: "from-teal-700 to-emerald-900",
      accent: "text-teal-700 bg-teal-50 border-teal-200"
    },
    {
      id: "nasehat" as MasterkuCategory,
      title: "Nasehat Islami",
      desc: "Kalam salafush shalih & ulama",
      icon: HeartHandshake,
      badge: "Mutiara Adab",
      color: "from-purple-700 to-indigo-900",
      accent: "text-purple-700 bg-purple-50 border-purple-200"
    },
    {
      id: "hikmah" as MasterkuCategory,
      title: "Kisah Hikmah",
      desc: "Inspirasi ibrah penyejuk jiwa",
      icon: Lightbulb,
      badge: "29 Kisah Teladan",
      color: "from-rose-700 to-amber-800",
      accent: "text-rose-700 bg-rose-50 border-rose-200"
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-amber-300 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>KHAZANAH ISLAM & SUMBER BELAJAR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Masterku
              <span className="text-sm font-semibold text-emerald-300 px-3 py-0.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50">
                Pustaka Digital PAI
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pusat referensi pembelajaran Islam terpadu: Al-Qur'an dan terjemahannya, Hadits shahih, materi buku pelajaran kurikulum, kisah 25 nabi dan rasul, untaian nasehat islami, serta kisah-kisah hikmah penuh ibrah. Cukup pilih topik yang Anda inginkan, seluruh konten akan otomatis tersaji seketika.
            </p>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrintCurrent}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 border border-white/15 transition shadow-sm backdrop-blur-sm"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Konten</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Category Selector Tabs (Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                isActive
                  ? "bg-white shadow-lg border-emerald-600 ring-2 ring-emerald-500/30 -translate-y-0.5"
                  : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  )}
                </div>
                <div>
                  <h3 className={`font-black text-xs leading-snug ${isActive ? "text-emerald-950 font-black" : "text-slate-800"}`}>
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-slate-400 group-hover:text-emerald-700">
                  {cat.badge}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-emerald-700" : "text-slate-300"}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. AL-QUR'AN DAN TERJEMAH KEMENAG RI (114 SURAT LENGKAP) */}
      {/* ========================================================================= */}
      {activeCategory === "alquran" && (
        <QuranKemenag114 />
      )}

      {/* ========================================================================= */}
      {/* 2. HADIST PILIHAN (125 HADITS: BUKHARI, MUSLIM, NASAI, ABU DAUD, IBNU MAJAH) */}
      {/* ========================================================================= */}
      {activeCategory === "hadist" && (
        <div className="space-y-5">
          {/* Filter & Selector Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {/* Header info & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Scroll className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">
                    Koleksi 125 Hadits Pilihan (5 Ulama Besar Hadits)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Lengkap dengan teks Arab berharakat, terjemahan resmi, penjelasan syarah, 4 pilar tema, dan amalan praktis.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[280px] sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={haditsSearchQuery}
                  onChange={(e) => setHaditsSearchQuery(e.target.value)}
                  placeholder="Cari hadits, perawi, topik, nomor..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
                />
                {haditsSearchQuery && (
                  <button
                    onClick={() => setHaditsSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter 1: Ulama Hadits (5 Ulama) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Pilih Ulama Hadits:
                </label>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {filteredHaditsList.length} dari {allHaditsList.length} Hadits Tersedia
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: "all", label: "Semua Ulama", count: 125, sub: "Koleksi Lengkap" },
                  { id: "bukhari", label: "Imam Bukhari", count: 25, sub: "Shahih Bukhari" },
                  { id: "muslim", label: "Imam Muslim", count: 25, sub: "Shahih Muslim" },
                  { id: "nasai", label: "Imam An-Nasa'i", count: 25, sub: "Sunan An-Nasa'i" },
                  { id: "abu_daud", label: "Imam Abu Daud", count: 25, sub: "Sunan Abu Daud" },
                  { id: "ibnu_majah", label: "Imam Ibnu Majah", count: 25, sub: "Sunan Ibnu Majah" }
                ].map((u) => {
                  const isActive = haditsRawiFilter === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setHaditsRawiFilter(u.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        isActive
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{u.label}</span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                            isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {u.count}
                        </span>
                      </div>
                      <span className={`text-[10px] mt-0.5 ${isActive ? "text-amber-100" : "text-slate-400"}`}>
                        {u.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: 4 Pilar Tema (Tauhid, Ibadah, Akhlak, Fiqih) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                Filter 4 Pilar Tema:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "Semua Tema", badge: "125" },
                  { id: "Tauhid", label: "1. Tauhid & Akidah", badge: "28 Hadits" },
                  { id: "Ibadah", label: "2. Ibadah & Thaharah", badge: "35 Hadits" },
                  { id: "Akhlak", label: "3. Akhlak & Adab", badge: "31 Hadits" },
                  { id: "Fiqih", label: "4. Fiqih & Muamalah", badge: "31 Hadits" }
                ].map((t) => {
                  const isActive = haditsTemaFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setHaditsTemaFilter(t.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                        isActive
                          ? "bg-emerald-700 text-white border-emerald-600 shadow-xs"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span>{t.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {t.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Hadits Carousel / Grid Pills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">Daftar Hadits (Klik untuk membaca):</span>
                <span>{filteredHaditsList.length} Hadits ditemukan</span>
              </div>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {filteredHaditsList.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                    Tidak ditemukan hadits yang sesuai dengan kata kunci pencarian atau filter.
                  </div>
                ) : (
                  filteredHaditsList.map((h) => {
                    const isSelected = selectedHadistId === h.id;
                    const temaColor =
                      h.tema === "Tauhid"
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : h.tema === "Ibadah"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : h.tema === "Akhlak"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-amber-100 text-amber-800 border-amber-200";

                    return (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHadistId(h.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/30 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {h.nomorUrut || h.id.replace("h-", "")}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${temaColor}`}>
                                {h.tema}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 truncate">
                                {h.kitab}
                              </span>
                            </div>
                            <h4 className={`text-xs font-black truncate ${isSelected ? "text-amber-950" : "text-slate-800"}`}>
                              {h.judul}
                            </h4>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-600" : "text-slate-300"}`} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Current Hadits Card Detail */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Hadits Card Header */}
            <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-yellow-950 p-5 sm:p-6 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px] border border-white/20">
                      {currentHadist.kitab}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px]">
                      Pilar: {currentHadist.tema}
                    </span>
                    {currentHadist.nomorHadits && (
                      <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-amber-200 font-bold text-[11px]">
                        {currentHadist.nomorHadits}
                      </span>
                    )}
                    {currentHadist.nomorUrut && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-mono">
                        Hadits #{currentHadist.nomorUrut} dari 125
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentHadist.judul}
                  </h2>
                  <p className="text-xs text-amber-200/90 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Takhrij Sanad / Perawi: <strong className="text-white">{currentHadist.perawi}</strong></span>
                  </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 self-start lg:self-center">
                  <button
                    onClick={() => {
                      const text = `${currentHadist.judul}\n${currentHadist.perawi}\n${currentHadist.nomorHadits || ""}\n\n${currentHadist.arab}\n\nArtinya:\n"${currentHadist.terjemah}"\n\nPenjelasan:\n${currentHadist.penjelasan || ""}\n\nAmalan Praktis:\n${currentHadist.amalanPraktis || ""}\n\nFaidah:\n` +
                        currentHadist.faidah.map((f, i) => `${i + 1}. ${f}`).join("\n");
                      handleCopyText(text, `hadist-${currentHadist.id}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition shadow-sm"
                  >
                    {copiedId === `hadist-${currentHadist.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Hadits Lengkap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Hadits Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Matan Arab */}
              <div className="bg-amber-50/50 p-6 sm:p-7 rounded-2xl border border-amber-200/80 text-right relative shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-200/60 text-[10px] uppercase tracking-wider font-black text-amber-900">
                    Matan Hadits (Bahasa Arab Berharakat)
                  </span>
                  <button
                    onClick={() => handleCopyText(currentHadist.arab, `arab-${currentHadist.id}`)}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition"
                    title="Salin teks Arab saja"
                  >
                    {copiedId === `arab-${currentHadist.id}` ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Salin Arab</span>
                  </button>
                </div>
                <p dir="rtl" className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-[2.5] font-normal tracking-wide">
                  {currentHadist.arab}
                </p>
              </div>

              {/* Terjemahan */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  Terjemahan Bahasa Indonesia:
                </span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-200 italic">
                  "{currentHadist.terjemah}"
                </p>
              </div>

              {/* Penjelasan Syarah Hadits (As requested: "lengkap dengan penjelasannya") */}
              {currentHadist.penjelasan && (
                <div className="space-y-2 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-yellow-50/60 p-5 rounded-2xl border border-amber-200">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    Penjelasan & Syarah Ilmiyah:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {currentHadist.penjelasan}
                  </p>
                </div>
              )}

              {/* Penerapan & Amalan Praktis Pembelajaran */}
              {currentHadist.amalanPraktis && (
                <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border border-emerald-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wide">
                      Penerapan & Amalan Praktis (Guru & Siswa):
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                      {currentHadist.amalanPraktis}
                    </p>
                  </div>
                </div>
              )}

              {/* Faidah & Kandungan Hadits */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Kandungan & Faidah Hadits untuk Bahan Ajar:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentHadist.faidah.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-amber-400 transition"
                    >
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {f}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation (Previous & Next Hadits) */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  disabled={!prevHadist}
                  onClick={() => {
                    if (prevHadist) setSelectedHadistId(prevHadist.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition border ${
                    prevHadist
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                      : "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Hadits Sebelumnya</span>
                  <span className="sm:hidden">Sebelumnya</span>
                </button>

                <span className="text-xs font-bold text-slate-500 text-center">
                  Hadits {currentHadistIndex + 1} dari {filteredHaditsList.length} dalam daftar
                </span>

                <button
                  disabled={!nextHadist}
                  onClick={() => {
                    if (nextHadist) setSelectedHadistId(nextHadist.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition border ${
                    nextHadist
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">Hadits Berikutnya</span>
                  <span className="sm:hidden">Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BUKU PELAJARAN PAI */}
      {/* ========================================================================= */}
      {activeCategory === "buku" && (() => {
        // Filter chapters based on semester
        const filteredBabList = currentBuku.babList.filter((b) => {
          if (bukuSemesterFilter === "all") return true;
          return b.semester === bukuSemesterFilter;
        });

        // Previous and Next chapter navigation
        const currentIndex = currentBuku.babList.findIndex((b) => b.babNomor === selectedBabNomor);
        const prevBab = currentIndex > 0 ? currentBuku.babList[currentIndex - 1] : null;
        const nextBab = currentIndex < currentBuku.babList.length - 1 ? currentBuku.babList[currentIndex + 1] : null;

        return (
          <div className="space-y-5">
            {/* Top Official Kemendikbud Header Card */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-blue-800/60">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold text-xs">
                      <School className="w-3.5 h-3.5 text-blue-300" />
                      Kementerian Pendidikan RI • BSKAP
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      CP No. 032/H/KR/2024 (Regulasi 2026)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-extrabold text-[11px]">
                      {currentBuku.fase}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentBuku.judul}
                  </h2>
                  <p className="text-xs text-blue-200/90 leading-relaxed max-w-3xl">
                    {currentBuku.deskripsiBuku}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-[11px] text-blue-200/80 font-medium">
                    <span><strong>Penulis:</strong> {currentBuku.penulis}</span>
                    <span>•</span>
                    <span><strong>Penerbit:</strong> {currentBuku.penerbit}</span>
                    <span>•</span>
                    <span><strong>Edisi:</strong> {currentBuku.tahunTerbit}</span>
                  </div>
                </div>

                {/* Class selector quick tabs */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
                    Pilih Tingkat Kelas:
                  </span>
                  <div className="flex gap-1.5">
                    {LIST_BUKU_PELAJARAN.map((buku) => {
                      const isActive = buku.id === selectedBukuId;
                      return (
                        <button
                          key={buku.id}
                          onClick={() => {
                            setSelectedBukuId(buku.id);
                            setSelectedBabNomor(1);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center ${
                            isActive
                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-102"
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                          }`}
                        >
                          <span>{buku.tingkat}</span>
                          <span className="text-[10px] font-normal opacity-85">10 Bab</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Selection & Semester Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Daftar 10 Bab Materi Pelajaran ({currentBuku.kelas})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Disusun berdasarkan Capaian Pembelajaran (CP) terbaru 5 elemen PAI
                    </p>
                  </div>
                </div>

                {/* Semester Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 px-2">Filter:</span>
                  <button
                    onClick={() => setBukuSemesterFilter("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      bukuSemesterFilter === "all"
                        ? "bg-white text-blue-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua (10)
                  </button>
                  <button
                    onClick={() => setBukuSemesterFilter(1)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      bukuSemesterFilter === 1
                        ? "bg-white text-blue-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semester 1 (Bab 1-5)
                  </button>
                  <button
                    onClick={() => setBukuSemesterFilter(2)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      bukuSemesterFilter === 2
                        ? "bg-white text-blue-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semester 2 (Bab 6-10)
                  </button>
                </div>
              </div>

              {/* Chapter Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                {filteredBabList.map((bab) => {
                  const isSelected = selectedBabNomor === bab.babNomor;
                  return (
                    <button
                      key={bab.babNomor}
                      onClick={() => setSelectedBabNomor(bab.babNomor)}
                      className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? "bg-blue-700 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/30"
                          : "bg-slate-50/70 hover:bg-slate-100/90 text-slate-800 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                        }`}>
                          Bab {bab.babNomor}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-200/80 text-slate-700"
                        }`}>
                          Smtr {bab.semester}
                        </span>
                      </div>
                      <div className="font-bold text-xs leading-snug line-clamp-2">
                        {bab.judulBab}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                        {bab.elemenCP}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chapter Detail View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Header Bab */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px]">
                        {currentBuku.kelas}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/30 border border-indigo-300/30 text-indigo-100 font-bold text-[11px]">
                        Semester {currentBab.semester}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px]">
                        {currentBab.kategori}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 border border-emerald-300/30 text-emerald-100 font-bold text-[11px]">
                        Elemen: {currentBab.elemenCP}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Bab {currentBab.babNomor}: {currentBab.judulBab}
                    </h2>
                    <p className="text-xs text-blue-100/90 font-medium">
                      {currentBuku.kurikulum} • {currentBuku.regulasiCP}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        let fullSummary = `Buku: ${currentBuku.judul} (${currentBuku.kelas})\nRegulasi: ${currentBuku.regulasiCP}\nBab ${currentBab.babNomor}: ${currentBab.judulBab}\nElemen CP: ${currentBab.elemenCP} (Semester ${currentBab.semester})\n\n[CAPAIAN PEMBELAJARAN (CP)]:\n${currentBab.capaianPembelajaran}\n\n[RINGKASAN MATERI]:\n${currentBab.ringkasan}\n\n[TUJUAN PEMBELAJARAN (ATP)]:\n${currentBab.tujuanPembelajaran.map((t) => `- ${t}`).join("\n")}\n\n[MATERI POKOK]:\n${currentBab.materiPokok.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\n[GLOSARIUM / ISTILAH PENTING]:\n${currentBab.istilahPenting.map((ist) => `- ${ist.kata}: ${ist.arti}`).join("\n")}`;

                        if (currentBab.dalilAyat && currentBab.dalilAyat.length > 0) {
                          fullSummary += `\n\n[DALIL AL-QUR'AN & HADIS]:\n` +
                            currentBab.dalilAyat.map((d, idx) => `${idx + 1}. ${d.surah} ${d.ayat ? `Ayat ${d.ayat}` : ""}\nArab: ${d.teksArab}\nLatin: ${d.latin || "-"}\nArti: "${d.arti}"`).join("\n\n");
                        }

                        if (currentBab.bahanAjarLengkap) {
                          fullSummary += `\n\n[BAHAN AJAR & PENJABARAN MATERI]:\nPendahuluan: ${currentBab.bahanAjarLengkap.pendahuluan}\n\n` +
                            currentBab.bahanAjarLengkap.subMateri.map((s, idx) => `Sub-Bab ${idx + 1}: ${s.judul}\n${s.konten}\nPoin Kunci:\n${(s.poinPenting || []).map((p) => `  * ${p}`).join("\n")}`).join("\n\n") +
                            `\n\nAktivitas Siswa / LKPD:\n${(currentBab.bahanAjarLengkap.aktivitasSiswa || []).map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\nHikmah Karakter: ${currentBab.bahanAjarLengkap.hikmahKarakter || "-"}`;
                        }

                        handleCopyText(fullSummary, `bab-${currentBuku.id}-${currentBab.babNomor}`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition"
                    >
                      {copiedId === `bab-${currentBuku.id}-${currentBab.babNomor}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-amber-300" />
                          <span>Rangkuman & CP Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Lengkap Bab</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Body Bab Content */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* Capaian Pembelajaran (CP) Card */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 space-y-2 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-700" />
                      Capaian Pembelajaran (CP) Resmi — Elemen {currentBab.elemenCP}:
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                      BSKAP Kemendikbudristek No. 032/H/KR/2024
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-emerald-100">
                    "{currentBab.capaianPembelajaran}"
                  </p>
                </div>

                {/* Ringkasan & Intisari Bab */}
                <div className="bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-200/80 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-blue-700" />
                    Ringkasan & Intisari Bab:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {currentBab.ringkasan}
                  </p>
                </div>

                {/* Grid: Tujuan Pembelajaran (ATP) & Materi Pokok */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tujuan Pembelajaran */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      Tujuan Pembelajaran (Alur TP / ATP):
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {currentBab.tujuanPembelajaran.map((tp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            ✓
                          </span>
                          <span className="leading-snug">{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Materi Pokok Bahasan */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Materi Pokok Bahasan:
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {currentBab.materiPokok.map((mp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{mp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Glosarium & Istilah Penting */}
                {currentBab.istilahPenting && currentBab.istilahPenting.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Glosarium & Istilah Penting Islami:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentBab.istilahPenting.map((ist, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
                          <span className="font-black text-xs text-emerald-800 block">
                            {ist.kata}
                          </span>
                          <span className="text-xs text-slate-600 leading-snug">
                            {ist.arti}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dalil Al-Qur'an dan Hadis Terkait (Jika Ada) */}
                {currentBab.dalilAyat && currentBab.dalilAyat.length > 0 && (
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Scroll className="w-4 h-4 text-blue-600" />
                        Dalil Al-Qur'an & Hadits Terkait Bab:
                      </h3>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {currentBab.dalilAyat.length} Dalil Naqli
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentBab.dalilAyat.map((dalil, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-amber-50/40 via-white to-slate-50 p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
                            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {dalil.surah} {dalil.ayat ? `Ayat ${dalil.ayat}` : ""}
                            </span>
                            {dalil.keterangan && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {dalil.keterangan}
                              </span>
                            )}
                          </div>

                          {/* Arabic Text */}
                          <div className="text-right py-1">
                            <p
                              dir="rtl"
                              className="text-lg sm:text-2xl font-serif leading-loose text-slate-900 tracking-wide"
                              style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
                            >
                              {dalil.teksArab}
                            </p>
                          </div>

                          {/* Transliteration Latin */}
                          {dalil.latin && (
                            <p className="text-xs font-medium text-amber-900/90 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 leading-relaxed">
                              {dalil.latin}
                            </p>
                          )}

                          {/* Translation */}
                          <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                              Artinya:
                            </span>
                            <p className="text-xs text-slate-800 leading-relaxed">
                              "{dalil.arti}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bahan Ajar & Penjabaran Materi Lengkap (Jika Ada) */}
                {currentBab.bahanAjarLengkap && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            Bahan Ajar & Penjabaran Materi Lengkap
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Uraian komprehensif bahan ajar guru dan materi siswa per sub-bab
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Bahan Ajar Standar
                      </span>
                    </div>

                    {/* Pendahuluan */}
                    {currentBab.bahanAjarLengkap.pendahuluan && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-indigo-600" />
                          Apersepsi & Pengantar Bab:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {currentBab.bahanAjarLengkap.pendahuluan}
                        </p>
                      </div>
                    )}

                    {/* Sub Materi Elaborasi */}
                    <div className="space-y-3">
                      {currentBab.bahanAjarLengkap.subMateri.map((sub, idx) => (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                        >
                          <h4 className="text-xs sm:text-sm font-black text-blue-950 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            {sub.judul}
                          </h4>

                          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-8">
                            {sub.konten}
                          </div>

                          {sub.poinPenting && sub.poinPenting.length > 0 && (
                            <div className="ml-8 mt-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5">
                              <span className="text-[11px] font-bold text-blue-900 block">
                                Poin Kunci Pembelajaran:
                              </span>
                              <ul className="space-y-1 text-xs text-slate-700">
                                {sub.poinPenting.map((pt, pIdx) => (
                                  <li key={pIdx} className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Aktivitas Siswa / LKPD Mini */}
                    {currentBab.bahanAjarLengkap.aktivitasSiswa && currentBab.bahanAjarLengkap.aktivitasSiswa.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Aktivitas Pembelajaran Siswa (Praktik / LKPD):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {currentBab.bahanAjarLengkap.aktivitasSiswa.map((akt, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-start gap-2"
                            >
                              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {aIdx + 1}
                              </span>
                              <span className="text-xs text-slate-700 leading-snug">
                                {akt}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hikmah & Karakter Pelajar */}
                    {currentBab.bahanAjarLengkap.hikmahKarakter && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3">
                        <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-950 block">
                            Penguatan Profil Pelajar Pancasila (Akhlak & Karakter):
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {currentBab.bahanAjarLengkap.hikmahKarakter}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Navigation between chapters */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {prevBab ? (
                    <button
                      onClick={() => setSelectedBabNomor(prevBab.babNomor)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bab {prevBab.babNomor}: {prevBab.judulBab.slice(0, 24)}...</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextBab ? (
                    <button
                      onClick={() => setSelectedBabNomor(nextBab.babNomor)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <span>Bab {nextBab.babNomor}: {nextBab.judulBab.slice(0, 24)}...</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. KISAH-KISAH 25 NABI DAN ROSUL LENGKAP */}
      {/* ========================================================================= */}
      {activeCategory === "kisah_nabi" && (() => {
        // Filtered list based on search and Ulul Azmi filter
        const filteredNabiList = LIST_KISAH_NABI.filter((n) => {
          const q = nabiSearchQuery.toLowerCase().trim();
          const matchesSearch =
            !q ||
            n.nama.toLowerCase().includes(q) ||
            (n.gelar && n.gelar.toLowerCase().includes(q)) ||
            n.tempatDakwah.toLowerCase().includes(q) ||
            (n.umat && n.umat.namaKaum.toLowerCase().includes(q)) ||
            (n.sebutan && n.sebutan.toLowerCase().includes(q));
          const matchesFilter =
            nabiFilter === "all" || (nabiFilter === "ulul_azmi" && n.isUlulAzmi);
          return matchesSearch && matchesFilter;
        });

        const handleCopyFullNabi = () => {
          let text = `========================================================\n`;
          text += `KISAH LENGKAP 25 NABI & RASUL ALLAH SWT\n`;
          text += `========================================================\n`;
          text += `Nama Nabi: ${currentNabi.nama} ${currentNabi.namaArab ? `(${currentNabi.namaArab})` : ""}\n`;
          text += `Urutan: Nabi & Rasul ke-${currentNabi.nomorUrut} dari 25 Nabi\n`;
          if (currentNabi.gelar) text += `Gelar Mulia: ${currentNabi.gelar}\n`;
          if (currentNabi.isUlulAzmi) text += `Klasifikasi: Rasul Ulul Azmi (Memiliki Ketabahan Luar Biasa)\n`;
          text += `Periode / Era: ${currentNabi.periodeKaum}\n`;
          text += `Tempat Dakwah: ${currentNabi.tempatDakwah}\n`;
          if (currentNabi.usia) text += `Usia: ${currentNabi.usia}\n`;
          text += `Rujukan Al-Qur'an: ${currentNabi.ayatAlquran}\n\n`;

          text += `--------------------------------------------------------\n`;
          text += `1. RINGKASAN PERJALANAN DAKWAH\n`;
          text += `--------------------------------------------------------\n`;
          text += `${currentNabi.ringkasanKisah}\n\n`;

          text += `--------------------------------------------------------\n`;
          text += `2. SEJARAH LENGKAP & KISAH PERJUANGAN\n`;
          text += `--------------------------------------------------------\n`;
          text += `${currentNabi.sejarahLengkap}\n\n`;

          text += `--------------------------------------------------------\n`;
          text += `3. SILSILAH & KELUARGA NABI\n`;
          text += `--------------------------------------------------------\n`;
          text += `• Orang Tua (Ayah & Ibu): ${currentNabi.keluarga.ayahIbu}\n`;
          text += `• Pasangan / Istri: ${currentNabi.keluarga.pasangan}\n`;
          text += `• Anak & Keturunan: ${currentNabi.keluarga.anakKeturunan}\n`;
          if (currentNabi.keluarga.tokohKeluargaTerkait) {
            text += `• Tokoh Terkait: ${currentNabi.keluarga.tokohKeluargaTerkait}\n`;
          }
          text += `• Hikmah Keluarga: ${currentNabi.keluarga.catatanKeluarga}\n\n`;

          text += `--------------------------------------------------------\n`;
          text += `4. KONDISI UMAT & KAUM DAKWAH\n`;
          text += `--------------------------------------------------------\n`;
          text += `• Nama Kaum & Wilayah: ${currentNabi.umat.namaKaum} (${currentNabi.umat.wilayah})\n`;
          text += `• Karakter Kaum: ${currentNabi.umat.karakterKaum}\n`;
          text += `• Penolakan & Ujian: ${currentNabi.umat.penolakanDanUjian}\n`;
          text += `• Kesudahan Kaum: ${currentNabi.umat.kesudahanKaum}\n\n`;

          text += `--------------------------------------------------------\n`;
          text += `5. MUKJIZAT & KEISTIMEWAAN ATAS IZIN ALLAH\n`;
          text += `--------------------------------------------------------\n`;
          currentNabi.mukjizat.forEach((m, idx) => {
            text += `${idx + 1}. ${m}\n`;
          });
          text += `\n`;

          text += `--------------------------------------------------------\n`;
          text += `6. IBRAH & PELAJARAN PENTING\n`;
          text += `--------------------------------------------------------\n`;
          currentNabi.ibrah.forEach((ib, idx) => {
            text += `${idx + 1}. ${ib}\n`;
          });
          text += `\n`;

          text += `--------------------------------------------------------\n`;
          text += `7. NILAI KETELADANAN AKHLAK UNTUK SISWA\n`;
          text += `--------------------------------------------------------\n`;
          currentNabi.keteladanan.forEach((kt) => {
            text += `✓ ${kt}\n`;
          });
          text += `\n`;

          if (currentNabi.dalilKunci) {
            text += `--------------------------------------------------------\n`;
            text += `8. DALIL KUNCI AL-QUR'AN (Q.S. ${currentNabi.dalilKunci.surah}: ${currentNabi.dalilKunci.ayat})\n`;
            text += `--------------------------------------------------------\n`;
            text += `${currentNabi.dalilKunci.arab}\n`;
            text += `Artinya: "${currentNabi.dalilKunci.arti}"\n`;
          }

          handleCopyText(text, `nabi-full-${currentNabi.nomorUrut}`);
        };

        const prevNabiNomor = currentNabi.nomorUrut > 1 ? currentNabi.nomorUrut - 1 : 25;
        const nextNabiNomor = currentNabi.nomorUrut < 25 ? currentNabi.nomorUrut + 1 : 1;

        return (
          <div className="space-y-4">
            {/* Control & Selector Panel */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {/* Header Selector */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-black text-[11px] uppercase tracking-wider">
                      Ensiklopedia Sirah Nabawiyyah
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px]">
                      25 Nabi & Rasul Lengkap
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-teal-700" />
                    Pilih Kisah 25 Nabi & Rasul Allah Swt
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kajian lengkap riwayat sejarah, silsilah keluarga, kondisi umat kaum, mukjizat, ibrah hikmah, serta keteladanan akhlak.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Ulul Azmi */}
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                    <button
                      onClick={() => setNabiFilter("all")}
                      className={`px-3 py-1 rounded-lg transition ${
                        nabiFilter === "all"
                          ? "bg-white text-teal-800 shadow-sm font-black"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Semua (25)
                    </button>
                    <button
                      onClick={() => setNabiFilter("ulul_azmi")}
                      className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                        nabiFilter === "ulul_azmi"
                          ? "bg-white text-amber-700 shadow-sm font-black"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      5 Ulul Azmi
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama nabi / kaum..."
                      value={nabiSearchQuery}
                      onChange={(e) => setNabiSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  {/* Dropdown 25 Nabi */}
                  <select
                    value={selectedNabiNomor}
                    onChange={(e) => setSelectedNabiNomor(Number(e.target.value))}
                    className="px-3.5 py-1.5 rounded-xl border border-teal-300 bg-teal-50/80 font-black text-xs text-teal-950 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {LIST_KISAH_NABI.map((n) => (
                      <option key={n.nomorUrut} value={n.nomorUrut}>
                        {n.nomorUrut}. {n.nama} {n.isUlulAzmi ? "⭐ [Ulul Azmi]" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 25 Nabi Quick Access */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span>Daftar 25 Nabi & Rasul (Klik untuk membuka):</span>
                  <span>{filteredNabiList.length} dari 25 nabi ditampilkan</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-1.5">
                  {filteredNabiList.map((n) => {
                    const isSelected = selectedNabiNomor === n.nomorUrut;
                    return (
                      <button
                        key={n.nomorUrut}
                        onClick={() => setSelectedNabiNomor(n.nomorUrut)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between gap-1 border text-left ${
                          isSelected
                            ? "bg-teal-700 text-white border-teal-600 shadow-sm"
                            : "bg-slate-50 hover:bg-teal-50/60 text-slate-700 border-slate-200 hover:border-teal-300"
                        }`}
                        title={`${n.nama} (${n.periodeKaum})`}
                      >
                        <span className="truncate flex items-center gap-1">
                          <span
                            className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {n.nomorUrut}
                          </span>
                          <span className="truncate">{n.nama.replace("Nabi ", "")}</span>
                        </span>
                        {n.isUlulAzmi && (
                          <span className="text-amber-400 text-xs shrink-0" title="Rasul Ulul Azmi">
                            ⭐
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Nabi Showcase Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Hero Banner Nabi */}
              <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-5 sm:p-6 text-white relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Identity Info */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs">
                        Nabi & Rasul ke-{currentNabi.nomorUrut} dari 25 Nabi
                      </span>
                      {currentNabi.isUlulAzmi && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
                          <span>⭐ Rasul Ulul Azmi</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-200 font-extrabold text-[11px] border border-emerald-700/50">
                        {currentNabi.periodeKaum}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {currentNabi.nama}
                      </h2>
                      {currentNabi.namaArab && (
                        <span className="text-xl sm:text-2xl font-serif text-amber-300/90 font-bold" dir="rtl">
                          {currentNabi.namaArab}
                        </span>
                      )}
                    </div>

                    {currentNabi.gelar && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-200 font-bold bg-white/10 px-3 py-1 rounded-lg w-fit border border-white/10">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Gelar: {currentNabi.gelar}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-teal-100/90 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-300" />
                        Lokasi: <strong>{currentNabi.tempatDakwah}</strong>
                      </span>
                      {currentNabi.usia && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-300" />
                          Usia: <strong>{currentNabi.usia}</strong>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                        Al-Qur'an: <strong>{currentNabi.ayatAlquran}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions & Navigation */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedNabiNomor(prevNabiNomor)}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 border border-white/20 transition"
                        title="Nabi Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                      </button>
                      <button
                        onClick={() => setSelectedNabiNomor(nextNabiNomor)}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 border border-white/20 transition"
                        title="Nabi Selanjutnya"
                      >
                        <span className="hidden sm:inline">Selanjutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyFullNabi}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        {copiedId === `nabi-full-${currentNabi.nomorUrut}` ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-800" />
                            <span>Kisah Lengkap Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Salin Kisah Lengkap</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handlePrintCurrent}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/20 transition"
                        title="Cetak Kisah"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs Navigasi Rincian */}
              <div className="border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-2">
                <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
                  {[
                    { id: "semua", label: "📋 Semua Rincian Lengkap" },
                    { id: "sejarah", label: "📜 Sejarah Lengkap" },
                    { id: "keluarga", label: "👥 Silsilah & Keluarga" },
                    { id: "umat", label: "🏛️ Kaum & Umat Dakwah" },
                    { id: "mukjizat", label: "✨ Mukjizat & Dalil" },
                    { id: "ibrah", label: "💎 Ibrah & Keteladanan" }
                  ].map((tb) => (
                    <button
                      key={tb.id}
                      onClick={() => setActiveNabiTab(tb.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        activeNabiTab === tb.id
                          ? "bg-teal-700 text-white font-black shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      {tb.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* 1. SEJARAH LENGKAP & RINGKASAN */}
                {(activeNabiTab === "semua" || activeNabiTab === "sejarah") && (
                  <div className="space-y-4">
                    {/* Ringkasan Intisari */}
                    <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-900">
                        <History className="w-4 h-4 text-teal-700" />
                        <span>Intisari Perjalanan Dakwah:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-teal-950 leading-relaxed font-medium">
                        {currentNabi.ringkasanKisah}
                      </p>
                    </div>

                    {/* Riwayat Sejarah Lengkap */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <Scroll className="w-4 h-4 text-teal-700" />
                          <span>Sejarah Lengkap & Kronologi Perjuangan:</span>
                        </h4>
                        <span className="text-[11px] text-slate-400 font-bold">
                          Rujukan: {currentNabi.ayatAlquran}
                        </span>
                      </div>
                      <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-3.5 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                        {currentNabi.sejarahLengkap}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SILSILAH & KELUARGA NABI */}
                {(activeNabiTab === "semua" || activeNabiTab === "keluarga") && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-700" />
                      <span>Silsilah & Lingkungan Keluarga Nabi:</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Box 1: Orang Tua & Pasangan */}
                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 block">
                            👨‍👩‍👦 Orang Tua (Ayah & Ibu):
                          </span>
                          <p className="text-xs text-blue-950 font-medium leading-relaxed">
                            {currentNabi.keluarga.ayahIbu}
                          </p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-blue-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 block">
                            💍 Pasangan / Istri:
                          </span>
                          <p className="text-xs text-blue-950 font-medium leading-relaxed">
                            {currentNabi.keluarga.pasangan}
                          </p>
                        </div>
                      </div>

                      {/* Box 2: Keturunan & Tokoh Terkait */}
                      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 block">
                            👶 Anak & Keturunan:
                          </span>
                          <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                            {currentNabi.keluarga.anakKeturunan}
                          </p>
                        </div>
                        {currentNabi.keluarga.tokohKeluargaTerkait && (
                          <div className="space-y-1 pt-2 border-t border-indigo-200/60">
                            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 block">
                              🌟 Tokoh Keluarga Terkait:
                            </span>
                            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                              {currentNabi.keluarga.tokohKeluargaTerkait}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hikmah Keluarga */}
                    <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 flex items-start gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-xs text-slate-800 leading-relaxed">
                        <strong className="text-slate-900 block font-black">
                          Hikmah & Teladan Kehidupan Keluarga:
                        </strong>
                        <span>{currentNabi.keluarga.catatanKeluarga}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. KONDISI UMAT & KAUM DAKWAH */}
                {(activeNabiTab === "semua" || activeNabiTab === "umat") && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-purple-700" />
                      <span>Kondisi Umat & Kaum Tempat Nabi Diutus:</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Identitas & Karakter Kaum */}
                      <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 block">
                            🏙️ Nama Kaum & Wilayah:
                          </span>
                          <p className="text-xs text-purple-950 font-bold">
                            {currentNabi.umat.namaKaum}
                          </p>
                          <p className="text-[11px] text-purple-800">
                            Wilayah Geografis: {currentNabi.umat.wilayah}
                          </p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-purple-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 block">
                            ⚠️ Karakter & Kebiasaan Kaum:
                          </span>
                          <p className="text-xs text-purple-950 font-medium leading-relaxed">
                            {currentNabi.umat.karakterKaum}
                          </p>
                        </div>
                      </div>

                      {/* Penolakan & Kesudahan Kaum */}
                      <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 block">
                            ⚡ Penolakan, Ejekan & Ujian Dakwah:
                          </span>
                          <p className="text-xs text-rose-950 font-medium leading-relaxed">
                            {currentNabi.umat.penolakanDanUjian}
                          </p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-rose-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 block">
                            🌊 Kesudahan & Ketetapan Akhir Kaum:
                          </span>
                          <p className="text-xs text-rose-950 font-medium leading-relaxed">
                            {currentNabi.umat.kesudahanKaum}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MUKJIZAT & DALIL AL-QUR'AN */}
                {(activeNabiTab === "semua" || activeNabiTab === "mukjizat") && (
                  <div className="space-y-4 pt-2">
                    {/* Mukjizat List */}
                    <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>Mukjizat & Keistimewaan atas Izin Allah Swt:</span>
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-black text-[10px]">
                          {currentNabi.mukjizat.length} Mukjizat Utama
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {currentNabi.mukjizat.map((mk, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-white/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950 leading-snug"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              {idx + 1}
                            </span>
                            <span className="font-medium">{mk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dalil Kunci Al-Qur'an */}
                    {currentNabi.dalilKunci && (
                      <div className="p-4 sm:p-5 rounded-xl bg-emerald-950 text-white space-y-3">
                        <div className="flex items-center justify-between text-xs text-emerald-300 font-bold border-b border-emerald-800/80 pb-2">
                          <span className="flex items-center gap-1.5">
                            <BookMarked className="w-4 h-4 text-amber-300" />
                            <span>Dalil Al-Qur'an Terkait Kisah:</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-100 font-extrabold text-[11px]">
                            Q.S. {currentNabi.dalilKunci.surah}: {currentNabi.dalilKunci.ayat}
                          </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-serif text-amber-200 text-right leading-loose pt-1" dir="rtl">
                          {currentNabi.dalilKunci.arab}
                        </p>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal italic pt-1 border-t border-emerald-800/60">
                          "{currentNabi.dalilKunci.arti}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. IBRAH & KETELADANAN AKHLAK */}
                {(activeNabiTab === "semua" || activeNabiTab === "ibrah") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Ibrah & Pelajaran Mendalam */}
                    <div className="p-4 sm:p-5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-teal-700" />
                        <span>Ibrah & Pelajaran Filosofis Kehidupan:</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-teal-950">
                        {currentNabi.ibrah.map((ib, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-teal-100">
                            <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{ib}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Keteladanan Praktis untuk Siswa */}
                    <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Nilai Keteladanan Akhlak untuk Siswa:</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-emerald-950">
                        {currentNabi.keteladanan.map((kt, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              ✓
                            </span>
                            <span className="leading-relaxed font-medium">{kt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 5. NASEHAT ISLAMI */}
      {/* ========================================================================= */}
      {activeCategory === "nasehat" && (
        <div className="space-y-4">
          {/* Selector Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-purple-700" />
                  Pilih Untaian Nasehat Ulama & Salaf:
                </label>
                <div className="text-xs text-slate-500">
                  Pilih salah satu tokoh bijak untuk memunculkan kalam hikmah, renungan batin, dan amalan praktis harian.
                </div>
              </div>

              {/* Dropdown Tokoh */}
              <select
                value={selectedNasehatId}
                onChange={(e) => setSelectedNasehatId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-purple-300 bg-purple-50/60 font-black text-xs text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-none min-w-[280px]"
              >
                {LIST_NASEHAT_ISLAMI.map((n) => (
                  <option key={n.id} value={n.id}>
                    [{n.tema}] {n.tokoh}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Tokoh Salaf:</span>
              {LIST_NASEHAT_ISLAMI.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNasehatId(n.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    selectedNasehatId === n.id
                      ? "bg-purple-700 text-white border-purple-600 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {n.tokoh.split(" ")[0]} ({n.tema})
                </button>
              ))}
            </div>
          </div>

          {/* Current Nasehat Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            {/* Header Nasehat */}
            <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 p-5 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px]">
                      {currentNasehat.tema}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-200 font-extrabold text-[11px]">
                      {currentNasehat.peran}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">{currentNasehat.tokoh}</h2>
                </div>

                <button
                  onClick={() => {
                    const text = `Nasehat dari ${currentNasehat.tokoh} (${currentNasehat.tema}):\n\n` +
                      (currentNasehat.kutipanArab ? `${currentNasehat.kutipanArab}\n\n` : '') +
                      `"${currentNasehat.kutipanIndonesia}"\n\nUraian Hikmah:\n${currentNasehat.uraianHikmah}\n\nAmalan Praktis:\n${currentNasehat.amalanPraktis}`;
                    handleCopyText(text, `nasehat-${currentNasehat.id}`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition self-start sm:self-auto"
                >
                  {copiedId === `nasehat-${currentNasehat.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      <span>Nasehat Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Nasehat</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Body Nasehat */}
            <div className="p-6 space-y-6">
              {/* Kutipan Arab jika ada */}
              {currentNasehat.kutipanArab && (
                <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-200/80 text-right">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-800 block text-left mb-2">
                    Kutipan Asli:
                  </span>
                  <p dir="rtl" className="font-serif text-xl sm:text-2xl text-slate-900 leading-[2.2]">
                    {currentNasehat.kutipanArab}
                  </p>
                </div>
              )}

              {/* Kutipan Indonesia / Kata Mutiara */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50/50 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-900 block">
                  Kalam Mutiara Bijak:
                </span>
                <p className="text-base text-slate-900 font-bold italic leading-relaxed">
                  "{currentNasehat.kutipanIndonesia}"
                </p>
              </div>

              {/* Uraian Hikmah & Amalan Praktis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    Refleksi & Makna Mendalam:
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentNasehat.uraianHikmah}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Amalan & Aplikasi Praktis Harian:
                  </h3>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {currentNasehat.amalanPraktis}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HIKMAH (29 KISAH ORANG SHOLIH & ULAMA MASYHUR) */}
      {/* ========================================================================= */}
      {activeCategory === "hikmah" && (
        <div className="space-y-5">
          {/* Filter & Search Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Khazanah 29 Kisah Hikmah Orang Sholih & Ulama Masyhur
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kumpulan teladan akhlak, kejujuran, keikhlasan, birrul walidain, dan adab menuntut ilmu untuk apersepsi, ice breaking & kultum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hikmahSearchQuery}
                    onChange={(e) => setHikmahSearchQuery(e.target.value)}
                    placeholder="Cari tokoh, judul, era, atau tema..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                  {hikmahSearchQuery && (
                    <button
                      onClick={() => setHikmahSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  onClick={handlePrintCurrent}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                  title="Cetak kisah saat ini"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Kategori Tokoh:
              </span>
              {[
                { id: "all", label: "Semua Tokoh", count: 29 },
                { id: "sahabat", label: "Sahabat Nabi", count: 8 },
                { id: "tabiin", label: "Tabi'in & Tabi'ut Tabi'in", count: 5 },
                { id: "imam_madzhab", label: "4 Imam Madzhab", count: 4 },
                { id: "ulama_hadits", label: "Ulama Hadits", count: 3 },
                { id: "ulama_sholihin", label: "Ulama Shalihin & Zahid", count: 6 },
                { id: "pemimpin_sholih", label: "Pemimpin Adil", count: 1 },
                { id: "al_quran", label: "Ashabul Kahfi / Al-Qur'an", count: 2 }
              ].map((tab) => {
                const isActive = hikmahFilterKategori === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setHikmahFilterKategori(tab.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      isActive
                        ? "bg-rose-700 text-white border-rose-600 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stories Horizontal Quick Grid */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Daftar Pilihan Kisah ({filteredHikmahList.length} dari 29 Kisah):
                </span>
                {filteredHikmahList.length === 0 && (
                  <span className="text-xs text-amber-600 font-bold">Tidak ada kisah yang cocok dengan kata kunci.</span>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {filteredHikmahList.map((hk) => {
                  const isSelected = selectedHikmahId === hk.id;
                  return (
                    <button
                      key={hk.id}
                      onClick={() => setSelectedHikmahId(hk.id)}
                      className={`px-3 py-2 rounded-xl text-left transition shrink-0 border w-64 ${
                        isSelected
                          ? "bg-rose-900 text-white border-rose-800 shadow-md ring-2 ring-rose-600/50"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-rose-100" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          #{hk.nomor}
                        </span>
                        <span
                          className={`text-[10px] font-bold truncate max-w-[150px] ${
                            isSelected ? "text-rose-200" : "text-slate-500"
                          }`}
                        >
                          {hk.eraAtauMasa || hk.kategori}
                        </span>
                      </div>
                      <div className="font-bold text-xs line-clamp-1">{hk.tokohKisah}</div>
                      <div
                        className={`text-[11px] line-clamp-1 mt-0.5 ${
                          isSelected ? "text-rose-100/80" : "text-slate-500"
                        }`}
                      >
                        {hk.judul}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Hikmah Detailed Viewer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            {/* Header Banner Kisah */}
            <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-slate-900 p-6 text-white relative">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/30 text-rose-200 font-black text-xs border border-rose-400/30">
                      Kisah #{currentHikmah.nomor} dari 29
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white font-extrabold text-xs">
                      {currentHikmah.kategori}
                    </span>
                    {currentHikmah.eraAtauMasa && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 font-bold text-xs border border-amber-400/20 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {currentHikmah.eraAtauMasa}
                      </span>
                    )}
                  </div>

                  {/* Title & Tokoh */}
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    {currentHikmah.judul}
                  </h2>
                  <div className="text-sm font-semibold text-rose-200 flex items-center gap-2">
                    <span className="text-rose-300/80">Tokoh Utama:</span>
                    <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                      {currentHikmah.tokohKisah}
                    </span>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
                  {/* Prev Button */}
                  {prevHikmah && (
                    <button
                      onClick={() => setSelectedHikmahId(prevHikmah.id)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 border border-white/15 transition"
                      title={`Kisah sebelumnya: ${prevHikmah.tokohKisah}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Kisah #{prevHikmah.nomor}</span>
                    </button>
                  )}

                  {/* Next Button */}
                  {nextHikmah && (
                    <button
                      onClick={() => setSelectedHikmahId(nextHikmah.id)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 border border-white/15 transition"
                      title={`Kisah selanjutnya: ${nextHikmah.tokohKisah}`}
                    >
                      <span className="hidden sm:inline">Kisah #{nextHikmah.nomor}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => {
                      const text = `========================================================\n` +
                        `KISAH HIKMAH ISLAMI: ${currentHikmah.judul}\n` +
                        `========================================================\n` +
                        `Tokoh Utama : ${currentHikmah.tokohKisah}\n` +
                        `Era / Masa  : ${currentHikmah.eraAtauMasa || "-"}\n` +
                        `Kategori    : ${currentHikmah.kategori}\n` +
                        `Dalil/Sumber: ${currentHikmah.dalilTerkait}\n\n` +
                        `[SINOPSIS SINGKAT]\n${currentHikmah.sinopsis}\n\n` +
                        `[ALUR KISAH LENGKAP]\n${currentHikmah.kisahLengkap}\n\n` +
                        `[BUTIR-BUTIR PELAJARAN HIKMAH]\n` +
                        currentHikmah.pelajaranHikmah.map((p, i) => `${i + 1}. ${p}`).join("\n") +
                        `\n\n[AMALAN PRAKTIS UNTUK SISWA]\n${currentHikmah.amalanPraktisSiswa || "-"}\n\n` +
                        `Sumber Rujukan: ${currentHikmah.dalilTerkait}\n` +
                        `Sumber: Modul Masterku Guru PAI`;
                      handleCopyText(text, `hikmah-${currentHikmah.id}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    {copiedId === `hikmah-${currentHikmah.id}` ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Kisah Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Kisah Lengkap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Body Hikmah */}
            <div className="p-6 space-y-6">
              {/* 1. Sinopsis Inti */}
              <div className="bg-gradient-to-r from-rose-50/70 to-amber-50/70 p-5 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                    Sinopsis & Intisari Kisah:
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium pl-4 border-l-2 border-rose-400">
                  {currentHikmah.sinopsis}
                </p>
              </div>

              {/* 2. Alur Kisah Lengkap Naratif */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-rose-700" />
                    Alur Cerita Naratif Lengkap:
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Bahan Bacaan Siswa & Materi Kultum
                  </span>
                </div>

                <div className="text-sm text-slate-800 leading-relaxed bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs">
                  <div className="whitespace-pre-line text-slate-800 leading-relaxed font-normal">
                    {currentHikmah.kisahLengkap}
                  </div>
                </div>
              </div>

              {/* 3. Butir-Butir Ibrah & Pelajaran Moral */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-700" />
                    3 Butir Ibrah & Pelajaran Hikmah Karakter:
                  </h3>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                    Refleksi Diri
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentHikmah.pelajaranHikmah.map((plj, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {plj}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Amalan Praktis untuk Siswa */}
              {currentHikmah.amalanPraktisSiswa && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Panduan Amalan Praktis untuk Siswa:
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium pl-5">
                    {currentHikmah.amalanPraktisSiswa}
                  </p>
                </div>
              )}

              {/* 5. Dalil & Rujukan Sumber */}
              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-500">Dalil / Rujukan Terkait:</span>
                  <span className="font-bold text-slate-800">{currentHikmah.dalilTerkait}</span>
                </div>
                <button
                  onClick={() => {
                    const text = `${currentHikmah.judul}\nTokoh: ${currentHikmah.tokohKisah}\nDalil: ${currentHikmah.dalilTerkait}`;
                    handleCopyText(text, `dalil-${currentHikmah.id}`);
                  }}
                  className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Dalil</span>
                </button>
              </div>

              {/* Bottom Quick Navigation Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {prevHikmah ? (
                  <button
                    onClick={() => setSelectedHikmahId(prevHikmah.id)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 font-normal">Kisah Sebelumnya:</div>
                      <div className="font-bold line-clamp-1 max-w-[180px] sm:max-w-xs">{prevHikmah.tokohKisah}</div>
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}

                {nextHikmah ? (
                  <button
                    onClick={() => setSelectedHikmahId(nextHikmah.id)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold text-xs flex items-center gap-2 transition"
                  >
                    <div className="text-right">
                      <div className="text-[10px] text-rose-700 font-normal">Kisah Selanjutnya:</div>
                      <div className="font-bold line-clamp-1 max-w-[180px] sm:max-w-xs">{nextHikmah.tokohKisah}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-700" />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
