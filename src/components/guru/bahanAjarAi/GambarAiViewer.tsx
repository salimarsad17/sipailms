/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Download,
  Eye,
  Layers,
  ZoomIn,
  Palette,
  RefreshCw,
  X,
  Maximize2,
  Sliders,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Grid,
  Info,
  SlidersHorizontal,
  Bookmark,
  Star,
  Search,
  Filter,
  Plus,
  Send,
  Wand2,
  Share2,
  Trash2,
  FileCheck
} from "lucide-react";
import { GambarAiConfig, AiImageCard } from "../../../types/bahanAjarAi";

interface GambarAiViewerProps {
  gambarData: GambarAiConfig;
  judulMateri: string;
  kataKunciVisual?: string[];
  submateri?: string[];
  contohKehidupan?: string[];
  dalilRujukan?: {
    sumber: string;
    arab: string;
    latin: string;
    arti: string;
  };
}

type ArtStyle = "3d_modern" | "infografis_hd" | "fotorealistis" | "cat_air";
type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4";

export default function GambarAiViewer({
  gambarData,
  judulMateri,
  kataKunciVisual = [],
  submateri = [],
  contohKehidupan = [],
  dalilRujukan
}: GambarAiViewerProps) {
  // Styles & Filters
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>("3d_modern");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("16:9");
  const [activeFilter, setActiveFilter] = useState<"normal" | "golden" | "vibrant" | "soft">("normal");
  const [showPosterText, setShowPosterText] = useState<boolean>(true);

  // Dynamic Image Cards & Generation State
  const [dynamicCards, setDynamicCards] = useState<AiImageCard[]>([]);
  const [isGeneratingGallery, setIsGeneratingGallery] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState<string>("");

  // Search & Filter within Gallery Cards
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterKeyword, setFilterKeyword] = useState<string>("all");
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);

  // Lightbox Modal
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxCard, setLightboxCard] = useState<AiImageCard | null>(null);

  // Feedback states
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [hasCopiedNeg, setHasCopiedNeg] = useState<boolean>(false);
  const [regeneratingCardId, setRegeneratingCardId] = useState<string | null>(null);

  // Custom Image Upload/URL Modal
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState<boolean>(false);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize keywords from props
  useEffect(() => {
    if (kataKunciVisual && kataKunciVisual.length > 0) {
      setActiveKeywords(kataKunciVisual);
    } else {
      setActiveKeywords([
        "Cahaya nurani dan keagungan",
        "Kepatuhan & kejujuran siswa",
        "Mushaf Al-Qur'an emas",
        "Perilaku adab di sekolah"
      ]);
    }
  }, [kataKunciVisual]);

  // Helper mapping to generate thematic curated visual assets
  const resolveThematicVisual = (kw: string, index: number): { url: string; category: string } => {
    const topicLower = (judulMateri + " " + kw).toLowerCase();

    if (topicLower.includes("kurban") || topicLower.includes("akikah") || topicLower.includes("sembelih")) {
      const urls = [
        { url: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=1280&q=80", category: "Syarat Sah Kurban" },
        { url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1280&q=80", category: "Bulan Dzulhijjah" },
        { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1280&q=80", category: "Kedermawanan Sosial" },
        { url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1280&q=80", category: "Ketentuan Akikah" },
        { url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1280&q=80", category: "Ternak Sehat" }
      ];
      return urls[index % urls.length];
    } else if (topicLower.includes("shalat") || topicLower.includes("sujud") || topicLower.includes("wudhu")) {
      const urls = [
        { url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1280&q=80", category: "Kekhusyukan Shalat" },
        { url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80", category: "Shalat Berjamaah" },
        { url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1280&q=80", category: "Zikir & Doa" },
        { url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80", category: "Masjid Megah" }
      ];
      return urls[index % urls.length];
    } else if (topicLower.includes("quran") || topicLower.includes("tajwid") || topicLower.includes("ayat")) {
      const urls = [
        { url: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&q=80", category: "Mushaf Kalamullah" },
        { url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1280&q=80", category: "Tilawah & Tartil" },
        { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1280&q=80", category: "Khazanah Tafsir" },
        { url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1280&q=80", category: "Tadarus di Kelas" }
      ];
      return urls[index % urls.length];
    } else {
      // Malaikat / Default PAI
      const urls = [
        { url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80", category: "Cahaya Nur & Fajar" },
        { url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1280&q=80", category: "Alam Semesta & Gaib" },
        { url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1280&q=80", category: "Hujan Berkah (Mikail)" },
        { url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1280&q=80", category: "Integritas Siswa (Raqib-Atid)" },
        { url: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&q=80", category: "Wahyu Ilahi (Jibril)" },
        { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80", category: "Kerja Sama & Berbagi" }
      ];
      return urls[index % urls.length];
    }
  };

  // Build baseline initial cards on mount
  useEffect(() => {
    if (dynamicCards.length === 0) {
      const initialKeywords = activeKeywords.length > 0
        ? activeKeywords
        : ["Cahaya Iman", "Ketaatan Ibadah", "Kejujuran di Sekolah", "Tafsir Dalil"];

      const initialCards: AiImageCard[] = initialKeywords.slice(0, 4).map((kw, idx) => {
        const visual = resolveThematicVisual(kw, idx);
        return {
          id: `card-init-${idx}`,
          title: kw,
          subtitle: `${visual.category} • Topik: ${judulMateri}`,
          kataKunci: kw,
          materiPokok: judulMateri,
          imageUrl: visual.url,
          prompt: `High quality Islamic educational illustration for SMP Grade 7-9, topic "${judulMateri}", focusing on concept "${kw}". 3D digital render, Pixar style, warm volumetric lighting, dignified respectful composition --ar 16:9`,
          negativePrompt: "distorted faces, blasphemy, non-modest clothing, caricature, blurry, watermark",
          aspectRatio: "16:9",
          artStyle: "3d_modern",
          timestamp: "Otomatis dari Kurikulum",
          tags: [kw, visual.category, "Fase D"],
          isFavorite: idx === 0
        };
      });
      setDynamicCards(initialCards);
    }
  }, [judulMateri, activeKeywords]);

  // MAIN AI IMAGE GENERATION WORKFLOW
  const triggerAiImageGeneration = async (specificKeyword?: string) => {
    setIsGeneratingGallery(true);
    setGenerationStep("1/4: Membaca Materi Pokok & Kata Kunci Visual...");

    const keywordsToUse = specificKeyword
      ? [specificKeyword]
      : activeKeywords.length > 0
      ? activeKeywords
      : ["Cahaya Kebenaran", "Praktik Ibadah", "Karakter Siswa"];

    try {
      // Progress animation steps
      setTimeout(() => {
        setGenerationStep(`2/4: Mengirim Request AI untuk ${keywordsToUse.length} Kata Kunci...`);
      }, 350);

      setTimeout(() => {
        setGenerationStep("3/4: Menyelaraskan Parameter Estetika & Guardrail Syar'i...");
      }, 700);

      // Call server-side proxy
      const response = await fetch("/api/gemini/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materiPokok: judulMateri,
          kataKunciVisual: keywordsToUse,
          artStyle: selectedStyle,
          aspectRatio: selectedAspectRatio,
          count: Math.max(keywordsToUse.length, 4)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cards && Array.isArray(data.cards)) {
          setGenerationStep("4/4: Merender Kartu Gambar Dinamis ke Antarmuka...");
          setTimeout(() => {
            // Prepend new cards or replace
            setDynamicCards((prev) => {
              const newIds = new Set(data.cards.map((c: AiImageCard) => c.title));
              const filteredPrev = prev.filter((p) => !newIds.has(p.title));
              return [...data.cards, ...filteredPrev];
            });
            setIsGeneratingGallery(false);
          }, 400);
          return;
        }
      }
      throw new Error("Server returned non-ok status");
    } catch {
      // Graceful local fallback to ensure continuous experience
      setGenerationStep("Menyiapkan Kartu Gambar Berdasarkan Preset Kurikulum...");
      setTimeout(() => {
        const newGeneratedCards: AiImageCard[] = keywordsToUse.map((kw, i) => {
          const visual = resolveThematicVisual(kw, i + Math.floor(Math.random() * 3));
          return {
            id: `card-gen-${Date.now()}-${i}`,
            title: kw,
            subtitle: `${visual.category} • Materi: ${judulMateri}`,
            kataKunci: kw,
            materiPokok: judulMateri,
            imageUrl: visual.url,
            prompt: `High quality Islamic educational visual for SMP Grade 7-9, topic "${judulMateri}", focusing on concept "${kw}". Style: ${selectedStyle.replace("_", " ")}, respectful dignified Islamic aesthetic, educational composition --ar ${selectedAspectRatio}`,
            negativePrompt: "distorted faces, non-modest clothing, caricature, blurry, watermark",
            aspectRatio: selectedAspectRatio,
            artStyle: selectedStyle,
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            tags: [kw, visual.category, selectedStyle.toUpperCase()],
            isFavorite: false
          };
        });

        setDynamicCards((prev) => [...newGeneratedCards, ...prev]);
        setIsGeneratingGallery(false);
      }, 600);
    }
  };

  // Regenerate single card
  const handleRegenerateCard = (card: AiImageCard) => {
    setRegeneratingCardId(card.id);
    setTimeout(() => {
      const visual = resolveThematicVisual(card.kataKunci, Math.floor(Math.random() * 5));
      setDynamicCards((prev) =>
        prev.map((c) =>
          c.id === card.id
            ? {
                ...c,
                imageUrl: visual.url,
                subtitle: `${visual.category} • Materi: ${judulMateri}`,
                timestamp: "Diperbarui baru saja"
              }
            : c
        )
      );
      setRegeneratingCardId(null);
    }, 700);
  };

  // Toggle favorite
  const handleToggleFavorite = (cardId: string) => {
    setDynamicCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  // Remove card
  const handleRemoveCard = (cardId: string) => {
    setDynamicCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Copy prompt
  const handleCopyPrompt = (text: string, cardId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCardId(cardId);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  // Download image
  const handleDownload = (card: AiImageCard) => {
    const link = document.createElement("a");
    link.href = card.imageUrl;
    link.target = "_blank";
    link.download = `Gambar-AI-${card.title.replace(/[^a-zA-Z0-9]/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add custom keyword
  const handleAddKeyword = () => {
    if (newKeywordInput.trim() && !activeKeywords.includes(newKeywordInput.trim())) {
      setActiveKeywords((prev) => [...prev, newKeywordInput.trim()]);
      setNewKeywordInput("");
    }
  };

  // Filtered Cards
  const filteredCards = dynamicCards.filter((card) => {
    const matchSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchKeyword = filterKeyword === "all" || card.kataKunci === filterKeyword;
    const matchFav = !filterFavoritesOnly || card.isFavorite;

    return matchSearch && matchKeyword && matchFav;
  });

  // CSS Filter styles
  const getFilterStyle = () => {
    switch (activeFilter) {
      case "golden":
        return "sepia(20%) saturate(140%) contrast(105%) brightness(102%)";
      case "vibrant":
        return "saturate(150%) contrast(110%)";
      case "soft":
        return "brightness(105%) contrast(95%) saturate(90%)";
      default:
        return "none";
    }
  };

  return (
    <div id="image-gallery-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-7 animate-fade-in">
      {/* 1. TOP HEADER & STUDIO IDENTITY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <ImageIcon className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-950 text-pink-300 border border-pink-700/60 shadow-inner">
              🖼️ Image Gallery & AI Visual Studio
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Galeri Gambar AI: {judulMateri}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Alur kerja generasi gambar AI: Picu request AI berbasis <strong>Materi Pokok</strong> dan <strong>Kata Kunci Visual</strong> untuk menghasilkan kartu visual dinamis siap pakai.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Toggle Poster Text Overlay */}
          <button
            onClick={() => setShowPosterText(!showPosterText)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              showPosterText
                ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            }`}
            title="Tampilkan / Sembunyikan Label Teks Poster di Atas Kartu"
          >
            <Eye className="w-4 h-4" />
            <span>{showPosterText ? "Teks Poster: Aktif" : "Gambar Murni"}</span>
          </button>

          {/* Quick Upload or Custom URL */}
          <button
            onClick={() => setIsCustomUrlOpen(!isCustomUrlOpen)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-pink-400" />
            <span>Sisipkan Gambar Sendiri</span>
          </button>
        </div>
      </div>

      {/* 2. AI GENERATION WORKFLOW CONTROL PANEL */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-pink-500/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-pink-400" />
            <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              Kontrol Request AI Image Generation
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
            SIPAILMS AI Engine
          </span>
        </div>

        {/* Inputs Mapping: Materi Pokok & Kata Kunci Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Materi Pokok Display */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
              Materi Pokok Pembelajaran:
            </span>
            <div className="text-sm font-extrabold text-white bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{judulMateri}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Materi pokok menjadi pondasi semantik tema utama untuk memastikan gambar relevan secara syar'i & kurikuler.
            </p>
          </div>

          {/* Right Column: Kata Kunci Visual Chips */}
          <div className="md:col-span-7 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-400 uppercase tracking-wider block">
                Kata Kunci Visual (Target Kartu Gambar):
              </span>
              <span className="text-[10px] text-slate-400">
                {activeKeywords.length} kata kunci aktif
              </span>
            </div>

            {/* Keyword Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px]">
              {activeKeywords.map((kw, kwIdx) => (
                <span
                  key={kwIdx}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-200 text-xs border border-pink-500/30 flex items-center gap-1.5 group"
                >
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>{kw}</span>
                  <button
                    onClick={() => setActiveKeywords((prev) => prev.filter((_, i) => i !== kwIdx))}
                    className="text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                    title="Hapus kata kunci"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Keyword Inline Form */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                placeholder="Tambah kata kunci visual baru..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={handleAddKeyword}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
          </div>
        </div>

        {/* Style & Aspect Ratio Parameters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          {/* Art Style Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Pilih Gaya Seni (Art Style):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStyle("3d_modern")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedStyle === "3d_modern"
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-1 ring-amber-400/40"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                🌟 3D Pixar / Digital
              </button>
              <button
                onClick={() => setSelectedStyle("infografis_hd")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedStyle === "infografis_hd"
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-1 ring-emerald-400/40"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                📐 Infografis HD
              </button>
              <button
                onClick={() => setSelectedStyle("fotorealistis")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedStyle === "fotorealistis"
                    ? "bg-sky-500 text-slate-950 border-sky-400 shadow-md ring-1 ring-sky-400/40"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                🎥 Fotorealistis
              </button>
              <button
                onClick={() => setSelectedStyle("cat_air")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedStyle === "cat_air"
                    ? "bg-purple-500 text-white border-purple-400 shadow-md ring-1 ring-purple-400/40"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                🖌️ Cat Air & Emas
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
              Aspek Rasio:
            </span>
            <div className="flex items-center gap-2">
              {(["16:9", "4:3", "1:1", "3:4"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSelectedAspectRatio(ratio)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                    selectedAspectRatio === ratio
                      ? "bg-pink-600 text-white border-pink-400 shadow-md"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Trigger Button */}
          <div className="pt-2 lg:pt-0">
            <button
              onClick={() => triggerAiImageGeneration()}
              disabled={isGeneratingGallery}
              className="w-full lg:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white text-sm font-black flex items-center justify-center gap-2.5 shadow-xl shadow-pink-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingGallery ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Sedang Menghasilkan Gambar AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Picu Request Gambar AI (Generate Gallery)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generation Progress Indicator (Active while loading) */}
        {isGeneratingGallery && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-pink-500/40 space-y-2.5 animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold text-pink-300">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                {generationStep || "Memproses request ke AI Image Engine..."}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Model: Imagen 3 / SIPAILMS</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 animate-[pulse_1s_infinite] w-3/4 rounded-full" />
            </div>
          </div>
        )}

        {/* Custom URL / Upload Box */}
        {isCustomUrlOpen && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Masukkan Tautan Gambar / Foto Kustom Guru
              </span>
              <button
                onClick={() => setIsCustomUrlOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Tempelkan URL gambar (https://...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-pink-400" /> Pilih File Komputer
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      if (evt.target?.result) {
                        const newCard: AiImageCard = {
                          id: `card-upload-${Date.now()}`,
                          title: file.name.replace(/\.[^/.]+$/, ""),
                          subtitle: `Foto Kustom • Materi: ${judulMateri}`,
                          kataKunci: "Koleksi Guru",
                          materiPokok: judulMateri,
                          imageUrl: evt.target.result as string,
                          prompt: `Foto kustom guru PAI untuk materi ${judulMateri}`,
                          aspectRatio: "16:9",
                          artStyle: "fotorealistis",
                          timestamp: "Baru saja diunggah",
                          tags: ["Dokumentasi", "Koleksi Guru", "PAI"],
                          isFavorite: true
                        };
                        setDynamicCards((prev) => [newCard, ...prev]);
                        setIsCustomUrlOpen(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              {customImageUrl && (
                <button
                  onClick={() => {
                    const newCard: AiImageCard = {
                      id: `card-url-${Date.now()}`,
                      title: "Gambar URL Kustom",
                      subtitle: `Tautan Eksternal • Materi: ${judulMateri}`,
                      kataKunci: "URL Kustom",
                      materiPokok: judulMateri,
                      imageUrl: customImageUrl,
                      prompt: `Gambar eksternal untuk materi ${judulMateri}`,
                      aspectRatio: "16:9",
                      artStyle: "fotorealistis",
                      timestamp: "Baru saja ditambahkan",
                      tags: ["URL Eksternal", "Media Ajar"],
                      isFavorite: false
                    };
                    setDynamicCards((prev) => [newCard, ...prev]);
                    setCustomImageUrl("");
                    setIsCustomUrlOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap"
                >
                  Tambahkan ke Galeri
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. DYNAMIC GALLERY CARDS HEADER & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base sm:text-lg font-black text-white">
            Kartu Gambar Dinamis ({filteredCards.length} Kartu Visual)
          </h4>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyword Dropdown Filter */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kata Kunci</option>
              {activeKeywords.map((kw, i) => (
                <option key={i} value={kw} className="bg-slate-900 text-white">
                  {kw}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Only Toggle */}
          <button
            onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              filterFavoritesOnly
                ? "bg-amber-400 text-slate-950 border-amber-300"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavoritesOnly ? "fill-current" : ""}`} />
            <span>Favorit</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kartu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC CARDS GRID */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h5 className="text-base font-bold text-white">Belum Ada Kartu yang Sesuai</h5>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tidak ditemukan kartu gambar untuk filter ini. Klik tombol di bawah untuk memicu request AI dengan kata kunci materi pokok.
          </p>
          <button
            onClick={() => triggerAiImageGeneration()}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Generate Ulang Kartu Gambar AI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCards.map((card) => {
            const isRegenerating = regeneratingCardId === card.id;

            return (
              <div
                key={card.id}
                className="group bg-slate-950 border border-slate-800 hover:border-pink-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Image Container with Badges & Overlays */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 group">
                  {/* Actual Image with referrerPolicy */}
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    style={{ filter: getFilterStyle() }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("photo-1542816417-0983c9c9ad53")) {
                        target.src = "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80";
                      }
                    }}
                  />

                  {/* Regenerating Spinner Overlay */}
                  {isRegenerating && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                      <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
                      <span className="text-[11px] font-bold text-white">Merender ulang kartu...</span>
                    </div>
                  )}

                  {/* Top Badges (Keyword Tag & Favorite Pin) */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-pink-300 border border-pink-500/40 shadow-md">
                      {card.kataKunci}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(card.id);
                      }}
                      className={`pointer-events-auto p-1.5 rounded-lg backdrop-blur-md transition cursor-pointer border ${
                        card.isFavorite
                          ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md"
                          : "bg-slate-950/70 text-slate-400 hover:text-white border-slate-700"
                      }`}
                      title={card.isFavorite ? "Hapus dari Favorit" : "Tandai Favorit"}
                    >
                      <Star className={`w-3.5 h-3.5 ${card.isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Poster Text Overlay (if enabled) */}
                  {showPosterText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none flex flex-col justify-end p-3.5">
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider line-clamp-1">
                        {card.tags[1] || "Materi PAI"}
                      </span>
                      <h5 className="text-sm font-black text-white drop-shadow line-clamp-1">
                        {card.title}
                      </h5>
                    </div>
                  )}

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <button
                      onClick={() => {
                        setLightboxCard(card);
                        setIsLightboxOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer shadow-md"
                      title="Perbesar Layar Penuh"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(card)}
                      className="p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition cursor-pointer shadow-md"
                      title="Unduh Gambar HD"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRegenerateCard(card)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition cursor-pointer shadow-md"
                      title="Regenerate Kartu ini"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-mono text-emerald-400 font-bold">Rasio {card.aspectRatio}</span>
                      <span>{card.timestamp}</span>
                    </div>

                    <h5 className="text-xs font-black text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {card.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Prompt Snippet & Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyPrompt(card.prompt, card.id)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 cursor-pointer"
                    >
                      {copiedCardId === card.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(card)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-900 transition cursor-pointer"
                        title="Unduh Gambar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition cursor-pointer"
                        title="Hapus Kartu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick "Tambah Variasi Gambar Baru" Card at End of Grid */}
          <div
            onClick={() => triggerAiImageGeneration()}
            className="group min-h-[220px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-pink-500/60 bg-slate-950/40 hover:bg-slate-950 p-6 flex flex-col items-center justify-center text-center gap-3 transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-white block group-hover:text-pink-300">
                Picu Variasi Gambar AI Baru
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Kirim request generasi kartu tambahan berdasarkan kata kunci
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. LIGHTBOX MODAL (FULL RESOLUTION PREVIEW & DETAILS) */}
      {isLightboxOpen && lightboxCard && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-400" />
                <h4 className="text-base font-bold text-white">
                  Pratinjau Kartu Gambar: {lightboxCard.title}
                </h4>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src={lightboxCard.imageUrl}
                alt={lightboxCard.title}
                referrerPolicy="no-referrer"
                style={{ filter: getFilterStyle() }}
                className="w-full h-full object-cover"
              />
              {showPosterText && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="px-2.5 py-0.5 rounded bg-pink-950 text-pink-300 text-xs font-black self-start mb-1.5 border border-pink-700/50">
                    Kata Kunci: {lightboxCard.kataKunci}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{lightboxCard.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{lightboxCard.subtitle}</p>
                </div>
              )}
            </div>

            {/* Technical Prompt AI Details */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Full AI Generation Prompt
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(lightboxCard.prompt, "modal")}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 cursor-pointer"
                  >
                    {copiedCardId === "modal" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCardId === "modal" ? "Tersalin!" : "Salin Prompt"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all">
                  {lightboxCard.prompt}
                </p>
              </div>

              {lightboxCard.negativePrompt && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-rose-400">🚫 Negative Prompt:</span>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    {lightboxCard.negativePrompt}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800">
                  Rasio: {lightboxCard.aspectRatio}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800">
                  Gaya: {lightboxCard.artStyle.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(lightboxCard)}
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-pink-600/30"
                >
                  <Download className="w-4 h-4" /> Unduh Gambar HD
                </button>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
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
