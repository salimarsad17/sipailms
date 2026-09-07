/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LayoutGrid,
  ListFilter,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle2,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import {
  DAFTAR_114_SURAT,
  SurahMeta114,
  AyatKemenag,
  SurahDetailKemenag
} from "../../data/quran114List";
import { LIST_SURAH_PILIHAN } from "../../data/masterkuData";

interface QuranKemenag114Props {
  initialSurahNomor?: number;
}

export const QuranKemenag114: React.FC<QuranKemenag114Props> = ({
  initialSurahNomor = 1
}) => {
  // Surah Selection & List Filters
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number>(initialSurahNomor);
  const [searchSurahQuery, setSearchSurahQuery] = useState<string>("");
  const [activeSurahFilter, setActiveSurahFilter] = useState<"semua" | "juz_amma" | "populer" | "makkiyyah" | "madaniyyah">("semua");
  const [showGridModal, setShowGridModal] = useState<boolean>(false);

  // Content Customization
  const [searchAyatQuery, setSearchAyatQuery] = useState<string>("");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTerjemah, setShowTerjemah] = useState<boolean>(true);

  // Data Loading & Caching
  const [currentSurahData, setCurrentSurahData] = useState<SurahDetailKemenag | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const surahCache = useRef<Map<number, SurahDetailKemenag>>(new Map());

  // Audio Playback
  const [playingAyatNomor, setPlayingAyatNomor] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Quick popular surahs list
  const POPULAR_SURAH_NUMBERS = [1, 2, 3, 18, 36, 55, 56, 67, 78, 93, 112, 113, 114];

  // Helper for copying
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Stop current audio when switching surah
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingAyatNomor(null);
    setIsPlayingFullSurah(false);
  };

  // Play audio for specific ayah or full surah
  const handleToggleAudio = (audioUrl: string, ayatNomor: number | "full") => {
    if (!audioUrl) return;

    if (ayatNomor === "full") {
      if (isPlayingFullSurah) {
        stopAudio();
      } else {
        stopAudio();
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setIsPlayingFullSurah(true);
        audio.play().catch(() => setIsPlayingFullSurah(false));
        audio.onended = () => setIsPlayingFullSurah(false);
      }
    } else {
      if (playingAyatNomor === ayatNomor) {
        stopAudio();
      } else {
        stopAudio();
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setPlayingAyatNomor(ayatNomor);
        audio.play().catch(() => setPlayingAyatNomor(null));
        audio.onended = () => setPlayingAyatNomor(null);
      }
    }
  };

  // Convert offline fallback from masterkuData if available
  const getOfflineFallback = (nomor: number): SurahDetailKemenag | null => {
    const offlineSurah = LIST_SURAH_PILIHAN.find((s) => s.nomor === nomor);
    const meta = DAFTAR_114_SURAT.find((s) => s.nomor === nomor);
    if (!offlineSurah || !meta) return null;

    return {
      ...meta,
      ayat: offlineSurah.ayatList.map((a) => ({
        nomorAyat: a.nomor,
        teksArab: a.arab,
        teksLatin: a.latin,
        teksIndonesia: a.arti
      })),
      suratSebelumnya: nomor > 1 ? { nomor: nomor - 1, namaLatin: DAFTAR_114_SURAT[nomor - 2].namaLatin } : false,
      suratSelanjutnya: nomor < 114 ? { nomor: nomor + 1, namaLatin: DAFTAR_114_SURAT[nomor].namaLatin } : false
    };
  };

  // Fetch surah details from equran.id API with memory & local caching
  useEffect(() => {
    let isCancelled = false;
    stopAudio();

    // 1. Check in-memory cache
    if (surahCache.current.has(selectedSurahNomor)) {
      setCurrentSurahData(surahCache.current.get(selectedSurahNomor)!);
      setIsLoading(false);
      setLoadError(null);
      return;
    }

    // 2. Check localStorage cache
    try {
      const cachedStr = localStorage.getItem(`quran_kemenag_surah_${selectedSurahNomor}`);
      if (cachedStr) {
        const parsed: SurahDetailKemenag = JSON.parse(cachedStr);
        surahCache.current.set(selectedSurahNomor, parsed);
        setCurrentSurahData(parsed);
        setIsLoading(false);
        setLoadError(null);
        return;
      }
    } catch {
      // ignore localStorage error
    }

    // 3. Otherwise fetch from API
    setIsLoading(true);
    setLoadError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    fetch(`https://equran.id/api/v2/surat/${selectedSurahNomor}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        clearTimeout(timer);
        if (isCancelled) return;
        if (json && json.data) {
          const s = json.data;
          const meta = DAFTAR_114_SURAT.find((m) => m.nomor === s.nomor);
          const detail: SurahDetailKemenag = {
            nomor: s.nomor,
            nama: s.nama,
            namaLatin: s.namaLatin,
            jumlahAyat: s.jumlahAyat,
            tempatTurun: s.tempatTurun,
            arti: s.arti,
            deskripsi: meta?.deskripsi || s.deskripsi?.replace(/<[^>]*>?/gm, "") || "",
            audioFull: s.audioFull ? s.audioFull["05"] || s.audioFull["01"] : meta?.audioFull,
            ayat: (s.ayat || []).map((ay: any) => ({
              nomorAyat: ay.nomorAyat,
              teksArab: ay.teksArab,
              teksLatin: ay.teksLatin,
              teksIndonesia: ay.teksIndonesia,
              audio: ay.audio
            })),
            suratSebelumnya: s.suratSebelumnya || (s.nomor > 1 ? { nomor: s.nomor - 1, namaLatin: DAFTAR_114_SURAT[s.nomor - 2].namaLatin } : false),
            suratSelanjutnya: s.suratSelanjutnya || (s.nomor < 114 ? { nomor: s.nomor + 1, namaLatin: DAFTAR_114_SURAT[s.nomor].namaLatin } : false)
          };

          surahCache.current.set(selectedSurahNomor, detail);
          try {
            localStorage.setItem(`quran_kemenag_surah_${selectedSurahNomor}`, JSON.stringify(detail));
          } catch {
            // storage may be full
          }
          setCurrentSurahData(detail);
          setIsLoading(false);
        } else {
          throw new Error("Format respon API tidak sesuai");
        }
      })
      .catch((err) => {
        clearTimeout(timer);
        if (isCancelled) return;
        // Check offline fallback
        const fallback = getOfflineFallback(selectedSurahNomor);
        if (fallback) {
          setCurrentSurahData(fallback);
          setIsLoading(false);
          setLoadError(null);
        } else {
          setIsLoading(false);
          setLoadError("Gagal memuat ayat Al-Qur'an dari server. Periksa koneksi internet Anda atau coba lagi.");
        }
      });

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      stopAudio();
    };
  }, [selectedSurahNomor]);

  // Filtered 114 Surah list for dropdown & search
  const filteredSurahList = useMemo(() => {
    return DAFTAR_114_SURAT.filter((s) => {
      // Filter by category
      if (activeSurahFilter === "juz_amma" && s.nomor < 78) return false;
      if (activeSurahFilter === "populer" && !POPULAR_SURAH_NUMBERS.includes(s.nomor)) return false;
      if (activeSurahFilter === "makkiyyah" && !s.tempatTurun.toLowerCase().includes("mekah")) return false;
      if (activeSurahFilter === "madaniyyah" && !s.tempatTurun.toLowerCase().includes("madinah")) return false;

      // Filter by query
      if (searchSurahQuery.trim()) {
        const q = searchSurahQuery.toLowerCase();
        const matchNamaLatin = s.namaLatin.toLowerCase().includes(q);
        const matchArti = s.arti.toLowerCase().includes(q);
        const matchNomor = s.nomor.toString() === q.trim();
        return matchNamaLatin || matchArti || matchNomor;
      }
      return true;
    });
  }, [searchSurahQuery, activeSurahFilter]);

  // Current active Surah metadata
  const currentMeta = useMemo(() => {
    return DAFTAR_114_SURAT.find((s) => s.nomor === selectedSurahNomor) || DAFTAR_114_SURAT[0];
  }, [selectedSurahNomor]);

  // Filtered verses within the current surah
  const filteredAyatList = useMemo(() => {
    if (!currentSurahData) return [];
    if (!searchAyatQuery.trim()) return currentSurahData.ayat;

    const q = searchAyatQuery.toLowerCase();
    return currentSurahData.ayat.filter(
      (ay) =>
        ay.nomorAyat.toString() === q.trim() ||
        ay.teksIndonesia.toLowerCase().includes(q) ||
        ay.teksLatin.toLowerCase().includes(q) ||
        ay.teksArab.includes(q)
    );
  }, [currentSurahData, searchAyatQuery]);

  // Copy full surah text & Kemenag translation
  const handleCopyFullSurah = () => {
    if (!currentSurahData) return;
    const lines = [
      `AL-QUR'AN DAN TERJEMAH KEMENAG RI`,
      `Surah ${currentSurahData.namaLatin} (${currentSurahData.nama}) - Surah ke-${currentSurahData.nomor}`,
      `Arti: "${currentSurahData.arti}" | Golongan: ${currentSurahData.tempatTurun} | Jumlah Ayat: ${currentSurahData.jumlahAyat}`,
      `----------------------------------------------------`,
      `Deskripsi Singkat:`,
      currentSurahData.deskripsi,
      `----------------------------------------------------`,
      ...currentSurahData.ayat.map(
        (a) => `[Ayat ${a.nomorAyat}]\n${a.teksArab}\n${a.teksLatin}\nArtinya: "${a.teksIndonesia}"\n`
      )
    ];
    handleCopy(lines.join("\n"), "full-surah");
  };

  // Font size class mapping
  const arabicFontSizeClass = {
    sm: "text-2xl leading-[2.6rem]",
    md: "text-3xl leading-[3.2rem]",
    lg: "text-4xl leading-[4rem]",
    xl: "text-5xl leading-[4.8rem]"
  }[fontSize];

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. SELEKTOR UTAMA 114 SURAT (DROPDOWN, FILTER, & PENCARIAN) */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                114
              </span>
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Pilih Dari 114 Surat Al-Qur'an (Terjemah Kemenag RI):
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Tersedia lengkap dari Surah ke-1 (Al-Fatihah) sampai ke-114 (An-Nas) dengan terjemahan resmi Kementerian Agama RI.
            </p>
          </div>

          {/* Action Buttons: Modal Grid 114 Surat & Audio Murottal */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowGridModal(true)}
              className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
              title="Buka daftar lengkap 114 surat dalam tampilan kartu visual"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-700" />
              <span>Daftar 114 Surat Lengkap</span>
            </button>

            {currentMeta.audioFull && (
              <button
                onClick={() => handleToggleAudio(currentMeta.audioFull!, "full")}
                className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition ${
                  isPlayingFullSurah
                    ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {isPlayingFullSurah ? (
                  <>
                    <Pause className="w-4 h-4 text-slate-950" />
                    <span>Jeda Murottal</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                    <span>Putar Murottal Surah</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Dropdown 114 Surat & Search Input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Dropdown Select 114 Surahs */}
          <div className="md:col-span-7">
            <select
              value={selectedSurahNomor}
              onChange={(e) => setSelectedSurahNomor(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 font-black text-xs text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs cursor-pointer"
            >
              {DAFTAR_114_SURAT.map((s) => (
                <option key={s.nomor} value={s.nomor}>
                  {s.nomor}. {s.namaLatin} ({s.nama}) — Artinya: "{s.arti}" [{s.jumlahAyat} Ayat, {s.tempatTurun}]
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Surah by Name or Number */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari surat (contoh: Yasin, Al-Kahf, 36, Gua)..."
              value={searchSurahQuery}
              onChange={(e) => setSearchSurahQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
            {searchSurahQuery && (
              <button
                onClick={() => setSearchSurahQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown List if User Typed in Search Bar */}
        {searchSurahQuery.trim() && (
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
            <div className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
              <span>Hasil Pencarian ({filteredSurahList.length} Surat Ditemukan):</span>
              <span className="text-[10px] text-slate-500">Klik untuk langsung membuka</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredSurahList.map((s) => (
                <button
                  key={s.nomor}
                  onClick={() => {
                    setSelectedSurahNomor(s.nomor);
                    setSearchSurahQuery("");
                  }}
                  className={`text-left p-2 rounded-lg border text-xs transition flex items-center justify-between ${
                    selectedSurahNomor === s.nomor
                      ? "bg-emerald-700 text-white border-emerald-600 font-bold shadow-xs"
                      : "bg-white hover:bg-emerald-100/60 text-slate-800 border-emerald-100"
                  }`}
                >
                  <div className="truncate">
                    <span className="font-extrabold mr-1">{s.nomor}.</span>
                    <span>{s.namaLatin}</span>
                    <span className="block text-[10px] opacity-75 truncate">"{s.arti}"</span>
                  </div>
                  <span className="font-serif text-sm ml-1 shrink-0">{s.nama}</span>
                </button>
              ))}
              {filteredSurahList.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-500 font-medium">
                  Tidak ada surat yang cocok dengan kata kunci "{searchSurahQuery}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <ListFilter className="w-3 h-3" />
            Kategori:
          </span>

          <button
            onClick={() => setActiveSurahFilter("semua")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
              activeSurahFilter === "semua"
                ? "bg-emerald-700 text-white border-emerald-600 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Semua (114)
          </button>

          <button
            onClick={() => setActiveSurahFilter("juz_amma")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
              activeSurahFilter === "juz_amma"
                ? "bg-emerald-700 text-white border-emerald-600 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Juz 'Amma (78-114)
          </button>

          <button
            onClick={() => setActiveSurahFilter("populer")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
              activeSurahFilter === "populer"
                ? "bg-emerald-700 text-white border-emerald-600 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Surat Pilihan
          </button>

          <button
            onClick={() => setActiveSurahFilter("makkiyyah")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
              activeSurahFilter === "makkiyyah"
                ? "bg-emerald-700 text-white border-emerald-600 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Makkiyyah (86)
          </button>

          <button
            onClick={() => setActiveSurahFilter("madaniyyah")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
              activeSurahFilter === "madaniyyah"
                ? "bg-emerald-700 text-white border-emerald-600 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Madaniyyah (28)
          </button>
        </div>

        {/* Quick Popular Surah Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Akses Cepat:</span>
          {[
            { n: 1, label: "Al-Fatihah" },
            { n: 18, label: "Al-Kahf" },
            { n: 36, label: "Yasin" },
            { n: 55, label: "Ar-Rahman" },
            { n: 56, label: "Al-Waqi'ah" },
            { n: 67, label: "Al-Mulk" },
            { n: 78, label: "An-Naba'" },
            { n: 93, label: "Ad-Duha" },
            { n: 112, label: "Al-Ikhlas" },
            { n: 113, label: "Al-Falaq" },
            { n: 114, label: "An-Nas" }
          ].map((item) => (
            <button
              key={item.n}
              onClick={() => setSelectedSurahNomor(item.n)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition border ${
                selectedSurahNomor === item.n
                  ? "bg-emerald-800 text-white border-emerald-700 font-extrabold shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HEADER DETAIL SURAH TERPILIH (TERJEMAH KEMENAG RI) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Background Islamic Pattern Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center font-serif text-9xl">
          {currentMeta.nama}
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                  Surah ke-{currentMeta.nomor}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-200 font-bold text-xs">
                  Golongan {currentMeta.tempatTurun}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-200 font-bold text-xs">
                  {currentMeta.jumlahAyat} Ayat
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                  Terjemah Resmi Kemenag RI
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentMeta.namaLatin}
                </h2>
                <span className="text-amber-300 font-serif text-3xl sm:text-4xl">
                  {currentMeta.nama}
                </span>
              </div>

              <p className="text-emerald-100 text-sm font-medium">
                Artinya (Kemenag): <span className="font-bold italic text-amber-200">"{currentMeta.arti}"</span>
              </p>
            </div>

            {/* Navigation & Full Copy */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={selectedSurahNomor <= 1}
                onClick={() => setSelectedSurahNomor((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-950 text-white text-xs font-bold flex items-center gap-1 border border-emerald-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Surat Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                disabled={selectedSurahNomor >= 114}
                onClick={() => setSelectedSurahNomor((prev) => Math.min(114, prev + 1))}
                className="px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-950 text-white text-xs font-bold flex items-center gap-1 border border-emerald-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Surat Selanjutnya"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyFullSurah}
                className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition"
                title="Salin seluruh ayat dan terjemahan resmi Kemenag"
              >
                {copiedKey === "full-surah" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>Salin Surah Lengkap</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Official Kemenag Description & Asbabun Nuzul Box */}
          {currentMeta.deskripsi && (
            <div className="bg-emerald-950/50 border border-emerald-700/40 rounded-xl p-3.5 text-xs text-emerald-100/90 leading-relaxed">
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                Intisari & Deskripsi Surat (Kementerian Agama RI):
              </div>
              <p className="text-[11.5px] leading-relaxed text-emerald-100/90">
                {currentMeta.deskripsi}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KONTROL TAMPILAN AYAT & PENCARIAN ISI AYAT */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Ayat inside Selected Surah */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Cari ayat di Surah ${currentMeta.namaLatin} (nomor ayat atau kata)...`}
            value={searchAyatQuery}
            onChange={(e) => setSearchAyatQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
          />
          {searchAyatQuery && (
            <button
              onClick={() => setSearchAyatQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Options: Toggles & Font Sizing */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Transliterasi Latin */}
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              showLatin
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            {showLatin ? <Eye className="w-3.5 h-3.5 text-emerald-700" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </button>

          {/* Toggle Terjemahan Kemenag */}
          <button
            onClick={() => setShowTerjemah(!showTerjemah)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              showTerjemah
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            {showTerjemah ? <Eye className="w-3.5 h-3.5 text-emerald-700" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Terjemah</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 px-1">Arab:</span>
            <button
              onClick={() => setFontSize("sm")}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                fontSize === "sm" ? "bg-white shadow text-emerald-800 font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kecil
            </button>
            <button
              onClick={() => setFontSize("md")}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                fontSize === "md" ? "bg-white shadow text-emerald-800 font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                fontSize === "lg" ? "bg-white shadow text-emerald-800 font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Besar
            </button>
            <button
              onClick={() => setFontSize("xl")}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                fontSize === "xl" ? "bg-white shadow text-emerald-800 font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Ekstra
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DAFTAR AYAT & TERJEMAHAN KEMENAG RI */}
      {/* ========================================================================= */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Memuat Surah {currentMeta.namaLatin}...</h4>
            <p className="text-xs text-slate-500 mt-1">
              Menghubungkan ke database teks mushaf & terjemahan resmi Kementerian Agama RI
            </p>
          </div>
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-bold text-red-800">{loadError}</p>
          <button
            onClick={() => setSelectedSurahNomor(selectedSurahNomor)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
          >
            Muat Ulang Surah
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bismillah Card (kecuali Surah ke-9 At-Taubah dan Surah ke-1 Al-Fatihah yang ayat 1-nya sudah bismillah) */}
          {selectedSurahNomor !== 1 && selectedSurahNomor !== 9 && (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-1">
              <div className="font-serif text-3xl sm:text-4xl text-emerald-950 font-bold">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </div>
              <div className="text-xs italic text-emerald-800 font-medium pt-1">
                Bismillāhir-raḥmānir-raḥīm
              </div>
              <div className="text-xs text-slate-600">
                Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
              </div>
            </div>
          )}

          {/* Ayah Cards */}
          {filteredAyatList.map((ayat) => {
            const isPlayingAyat = playingAyatNomor === ayat.nomorAyat;
            const ayatAudioUrl =
              ayat.audio?.["05"] ||
              ayat.audio?.["01"] ||
              ayat.audio?.["02"] ||
              ayat.audio?.["03"];

            return (
              <div
                key={ayat.nomorAyat}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                  isPlayingAyat
                    ? "border-amber-400 ring-2 ring-amber-300 shadow-md bg-amber-50/10"
                    : "border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Header per Ayat */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100/90 text-emerald-900 font-black text-xs flex items-center justify-center border border-emerald-200 shadow-2xs">
                      {ayat.nomorAyat}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Ayat ke-{ayat.nomorAyat}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Audio Ayat Button */}
                    {ayatAudioUrl && (
                      <button
                        onClick={() => handleToggleAudio(ayatAudioUrl, ayat.nomorAyat)}
                        className={`p-1.5 rounded-lg border transition ${
                          isPlayingAyat
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-2xs animate-pulse"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                        title={isPlayingAyat ? "Jeda Audio" : "Dengarkan Murottal Ayat"}
                      >
                        {isPlayingAyat ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                    )}

                    {/* Copy Ayat Button */}
                    <button
                      onClick={() =>
                        handleCopy(
                          `${currentMeta.namaLatin} Ayat ${ayat.nomorAyat}:\n${ayat.teksArab}\n${ayat.teksLatin}\nTerjemah Kemenag: "${ayat.teksIndonesia}"`,
                          `ayat-${ayat.nomorAyat}`
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                      title="Salin Ayat & Terjemah Kemenag"
                    >
                      {copiedKey === `ayat-${ayat.nomorAyat}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Teks Arab Berharakat */}
                <div
                  dir="rtl"
                  className={`font-serif text-slate-900 font-semibold tracking-wide text-right selection:bg-emerald-100 ${arabicFontSizeClass}`}
                  style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Scheherazade New', serif" }}
                >
                  {ayat.teksArab}
                  <span className="text-emerald-700 text-2xl mr-2 font-serif select-none">
                    ۝{ayat.nomorAyat}
                  </span>
                </div>

                {/* Transliterasi Latin */}
                {showLatin && (
                  <div className="text-xs sm:text-sm font-medium text-emerald-800 italic bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/60 leading-relaxed">
                    {ayat.teksLatin}
                  </div>
                )}

                {/* Terjemahan Resmi Kemenag RI */}
                {showTerjemah && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Terjemah Kemenag RI:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {ayat.teksIndonesia}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredAyatList.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Tidak ada ayat yang cocok dengan kata pencarian "{searchAyatQuery}".
            </div>
          )}

          {/* Bottom Pagination for Surah */}
          <div className="flex items-center justify-between pt-4 pb-6">
            <button
              disabled={selectedSurahNomor <= 1}
              onClick={() => {
                setSelectedSurahNomor((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>← Surah Sebelumnya</span>
            </button>

            <span className="text-xs font-bold text-slate-400">
              {selectedSurahNomor} dari 114 Surah
            </span>

            <button
              disabled={selectedSurahNomor >= 114}
              onClick={() => {
                setSelectedSurahNomor((prev) => Math.min(114, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Surah Selanjutnya →</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL DIALOG DAFTAR 114 SURAT VISUAL (GRID CARDS) */}
      {/* ========================================================================= */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                  Daftar Lengkap 114 Surat Al-Qur'an (Kemenag RI)
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Pilih salah satu surat dari 114 surat untuk langsung membuka ayat dan terjemahan resmi.
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search inside Modal */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari surat berdasarkan nama latin, arab, nomor, atau arti..."
                  value={searchSurahQuery}
                  onChange={(e) => setSearchSurahQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveSurahFilter("semua")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                    activeSurahFilter === "semua"
                      ? "bg-emerald-700 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  Semua (114)
                </button>
                <button
                  onClick={() => setActiveSurahFilter("juz_amma")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                    activeSurahFilter === "juz_amma"
                      ? "bg-emerald-700 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  Juz 'Amma
                </button>
                <button
                  onClick={() => setActiveSurahFilter("populer")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                    activeSurahFilter === "populer"
                      ? "bg-emerald-700 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  Pilihan
                </button>
              </div>
            </div>

            {/* Modal Body: Grid of 114 Surahs */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredSurahList.map((s) => {
                const isSelected = selectedSurahNomor === s.nomor;
                return (
                  <button
                    key={s.nomor}
                    onClick={() => {
                      setSelectedSurahNomor(s.nomor);
                      setShowGridModal(false);
                      setSearchSurahQuery("");
                    }}
                    className={`text-left p-3 rounded-2xl border transition flex items-center justify-between group ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/50"
                        : "bg-white hover:bg-emerald-50/50 text-slate-800 border-slate-200 hover:border-emerald-200 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-[11px] shrink-0 ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 font-black"
                            : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-900"
                        }`}
                      >
                        {s.nomor}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs truncate">
                          {s.namaLatin}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? "text-emerald-100" : "text-slate-400 group-hover:text-slate-500"
                          }`}
                        >
                          "{s.arti}" • {s.jumlahAyat} Ayat
                        </div>
                      </div>
                    </div>

                    <div
                      className={`font-serif text-lg ml-2 shrink-0 ${
                        isSelected ? "text-amber-300" : "text-emerald-800"
                      }`}
                    >
                      {s.nama}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan {filteredSurahList.length} dari 114 surat Al-Qur'an</span>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
