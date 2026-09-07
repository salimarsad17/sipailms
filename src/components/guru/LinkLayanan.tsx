/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ExternalLink,
  Globe,
  Search,
  Copy,
  Check,
  Star,
  ShieldCheck,
  Plus,
  Trash2,
  Pencil,
  Award,
  Sparkles,
  Info,
  RotateCcw
} from "lucide-react";

export interface PortalLinkItem {
  id: string;
  nama: string;
  singkatan: string;
  kategori: "Kemenag & PAI" | "Kemdikbud & GTK" | "Kepegawaian ASN" | "Lainnya";
  url: string;
  deskripsi: string;
  fiturUtama: string[];
  isFeatured?: boolean;
  iconKey?: string;
  themeColor?: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    buttonBg: string;
    buttonHover: string;
  };
}

export function getPortalLogo(item: PortalLinkItem) {
  const key = item.iconKey || item.id;
  if (key === "siaga-pendis" || key === "siaga") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#064E3B" stroke="#10B981" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#047857" />
        <path d="M58 28C52 28 46 33 46 41C46 49 52 54 58 54C54 54 42 50 42 41C42 32 54 28 58 28Z" fill="#F59E0B" />
        <path d="M62 34L63.5 38.5H68L64.3 41.2L65.7 45.5L62 42.8L58.3 45.5L59.7 41.2L56 38.5H60.5L62 34Z" fill="#F59E0B" />
        <path d="M26 62C34 58 46 58 50 62C54 58 66 58 74 62V78C66 74 54 74 50 78C46 74 34 74 26 78V62Z" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
        <path d="M50 62V78" stroke="#10B981" strokeWidth="2" />
        <text x="50" y="88" textAnchor="middle" fill="#34D399" fontSize="10" fontWeight="900" fontFamily="sans-serif">
          SIAGA
        </text>
      </svg>
    );
  }
  if (key === "info-gtk" || key === "gtk") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#1D4ED8" />
        <path d="M50 22L65 35L50 48L35 35L50 22Z" fill="#F59E0B" stroke="#FBBF24" strokeWidth="2" />
        <path d="M25 50C25 40 38 35 50 35C62 35 75 40 75 50C75 65 60 72 50 72C40 72 25 65 25 50Z" fill="#EFF6FF" opacity="0.9" />
        <path d="M36 52L46 60L64 42" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50" y="86" textAnchor="middle" fill="#93C5FD" fontSize="10" fontWeight="900" fontFamily="sans-serif">
          INFO GTK
        </text>
      </svg>
    );
  }
  if (key === "myasn-bkn" || key === "myasn") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#78350F" stroke="#F59E0B" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#B45309" />
        <path d="M50 20L72 32V52C72 67 61 78 50 82C39 78 28 67 28 52V32L50 20Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
        <path d="M50 30L56 42H68L58 49L62 61L50 53L38 61L42 49L32 42H44L50 30Z" fill="#D97706" />
        <text x="50" y="90" textAnchor="middle" fill="#FDE68A" fontSize="9" fontWeight="900" fontFamily="sans-serif">
          MyASN
        </text>
      </svg>
    );
  }
  if (key === "simpkb") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#312E81" stroke="#6366F1" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#4338CA" />
        <path d="M30 40H70M30 50H70M30 60H50" stroke="#EEF2FF" strokeWidth="5" strokeLinecap="round" />
        <circle cx="65" cy="62" r="8" fill="#F59E0B" />
      </svg>
    );
  }
  if (key === "pmm") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#0C4A6E" stroke="#0EA5E9" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#0284C7" />
        <path d="M50 25L75 40V65L50 80L25 65V40L50 25Z" fill="#F0F9FF" opacity="0.9" />
        <path d="M50 38L62 45V58L50 65L38 58V45L50 38Z" fill="#0284C7" />
      </svg>
    );
  }
  if (key === "kemenag-pusaka" || key === "pusaka") {
    return (
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#134E4A" stroke="#14B8A6" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#0D9488" />
        <path d="M50 25C35 25 25 40 25 55C25 70 35 75 50 75C65 75 75 70 75 55C75 40 65 25 50 25Z" fill="#CCFBF1" />
        <circle cx="50" cy="50" r="12" fill="#0D9488" />
      </svg>
    );
  }
  return (
    <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#1E293B" stroke="#10B981" strokeWidth="4" />
      <circle cx="50" cy="50" r="38" fill="#334155" />
      <path d="M35 50L45 60L65 40" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export const INITIAL_PORTAL_LINKS: PortalLinkItem[] = [
  {
    id: "siaga-pendis",
    nama: "SIAGA Pendis (Sistem Informasi & Administrasi Guru Agama)",
    singkatan: "SIAGA PENDIS",
    kategori: "Kemenag & PAI",
    url: "https://www.siagapendis.com",
    deskripsi:
      "Portal resmi Direktorat Pendidikan Agama Islam Kementerian Agama RI untuk pemutakhiran data guru PAI, verifikasi jadwal mengajar, dan pencairan Tunjangan Profesi Guru (TPG).",
    fiturUtama: [
      "Verifikasi Jadwal & Jam Mengajar PAI",
      "Pencairan Tunjangan Profesi Guru (TPG)",
      "Verval Sertifikasi & Riwayat Pendidikan",
      "Absensi / Presensi Kehadiran Guru Agama"
    ],
    isFeatured: true,
    iconKey: "siaga-pendis",
    themeColor: {
      bg: "bg-emerald-950/40",
      border: "border-emerald-600/40",
      text: "text-emerald-400",
      badgeBg: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
      buttonBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
      buttonHover: "hover:bg-emerald-600"
    }
  },
  {
    id: "info-gtk",
    nama: "Info GTK Kemdikbudristek (Informasi Guru & Tenaga Kependidikan)",
    singkatan: "INFO GTK",
    kategori: "Kemdikbud & GTK",
    url: "https://info.gtk.kemdikbud.go.id",
    deskripsi:
      "Portal validasi data kependidikan Guru dari Dapodik Kemdikbudristek. Digunakan untuk memeriksa kevalidan data Jam Mengajar (JJM), NUPTK, dan terbitnya Surat Keputusan Tunjangan Profesi (SKTP).",
    fiturUtama: [
      "Cek Validasi Data Dapodik & NUPTK",
      "Status Kelayakan SKTP Tunjangan Profesi",
      "Verifikasi Beban Mengajar Linear (JJM)",
      "Pantau Kualifikasi Akademik & Sertifikasi"
    ],
    isFeatured: true,
    iconKey: "info-gtk",
    themeColor: {
      bg: "bg-blue-950/40",
      border: "border-blue-600/40",
      text: "text-blue-400",
      badgeBg: "bg-blue-900/60 text-blue-300 border-blue-700/50",
      buttonBg: "bg-blue-600 hover:bg-blue-500 text-white",
      buttonHover: "hover:bg-blue-600"
    }
  },
  {
    id: "myasn-bkn",
    nama: "MyASN BKN (Sistem Informasi Kepegawaian BKN / MySAPK)",
    singkatan: "MyASN BKN",
    kategori: "Kepegawaian ASN",
    url: "https://myasn.bkn.go.id",
    deskripsi:
      "Aplikasi layanan kepegawaian ASN (PNS & PPPK) terintegrasi Badan Kepegawaian Negara (BKN). Digunakan untuk peremajaan data mandiri (PDM), cek SK Jabatan, E-Kinerja, dan kenaikan pangkat.",
    fiturUtama: [
      "Peremajaan Data Mandiri (PDM) ASN",
      "Cek Profil, SK Pangkat & Golongan",
      "Laporan E-Kinerja & SKP Tahunan",
      "Layanan Mutasi & Kenaikan Gaji Berkala"
    ],
    isFeatured: true,
    iconKey: "myasn-bkn",
    themeColor: {
      bg: "bg-amber-950/40",
      border: "border-amber-600/40",
      text: "text-amber-400",
      badgeBg: "bg-amber-900/60 text-amber-300 border-amber-700/50",
      buttonBg: "bg-amber-600 hover:bg-amber-500 text-slate-950 font-black",
      buttonHover: "hover:bg-amber-600"
    }
  },
  {
    id: "simpkb",
    nama: "SIMPKB (Sistem Informasi Manajemen Pengembangan Keprofesian)",
    singkatan: "SIMPKB",
    kategori: "Kemdikbud & GTK",
    url: "https://paspor-gtk.belajar.kemdikbud.go.id",
    deskripsi:
      "Portal induk pengolahan data Pengembangan Keprofesian Berkelanjutan (PKB), pendaftaran PPG (Pendidikan Profesi Guru), Guru Penggerak, dan Diklat Kemdikbudristek.",
    fiturUtama: [
      "Pendaftaran & Seleksi PPG Dalam Jabatan",
      "Program Guru Penggerak & Sekolah Penggerak",
      "Komunitas KKG / MGMP PAI",
      "Diklat Keprofesian & Sertifikasi"
    ],
    iconKey: "simpkb",
    themeColor: {
      bg: "bg-indigo-950/40",
      border: "border-indigo-600/40",
      text: "text-indigo-400",
      badgeBg: "bg-indigo-900/60 text-indigo-300 border-indigo-700/50",
      buttonBg: "bg-indigo-600 hover:bg-indigo-500 text-white",
      buttonHover: "hover:bg-indigo-600"
    }
  },
  {
    id: "pmm",
    nama: "Platform Merdeka Mengajar (PMM Kemdikbudristek)",
    singkatan: "PMM",
    kategori: "Kemdikbud & GTK",
    url: "https://guru.kemdikbud.go.id",
    deskripsi:
      "Platform edukasi publikasi perangkat ajar, Pelatihan Mandiri Kurikulum Merdeka, Bukti Karya, serta Pengelolaan Kinerja Guru dan Kepala Sekolah.",
    fiturUtama: [
      "Pengelolaan Kinerja E-Kinerja Guru",
      "Pelatihan Mandiri & Topik Merdeka Belajar",
      "Unduh Modul Ajar & Bahan Ajar PAI",
      "Upload & Berbagi Bukti Karya Guru"
    ],
    iconKey: "pmm",
    themeColor: {
      bg: "bg-sky-950/40",
      border: "border-sky-600/40",
      text: "text-sky-400",
      badgeBg: "bg-sky-900/60 text-sky-300 border-sky-700/50",
      buttonBg: "bg-sky-600 hover:bg-sky-500 text-white",
      buttonHover: "hover:bg-sky-600"
    }
  },
  {
    id: "kemenag-pusaka",
    nama: "PUSAKA Super Apps Kemenag RI",
    singkatan: "PUSAKA KEMENAG",
    kategori: "Kemenag & PAI",
    url: "https://pusaka.kemenag.go.id",
    deskripsi:
      "Aplikasi terpadu layanan keagamaan dan pendidikan Islam Kementerian Agama RI, mencakup absensi online, layanan kepegawaian, dan informasi PAI.",
    fiturUtama: [
      "Presensi Online ASN Kemenag",
      "Layanan Administrasi Keagamaan",
      "Berita & Kebijakan Pendidikan Islam",
      "Integrasi Layanan Pendis"
    ],
    iconKey: "kemenag-pusaka",
    themeColor: {
      bg: "bg-teal-950/40",
      border: "border-teal-600/40",
      text: "text-teal-400",
      badgeBg: "bg-teal-900/60 text-teal-300 border-teal-700/50",
      buttonBg: "bg-teal-600 hover:bg-teal-500 text-white",
      buttonHover: "hover:bg-teal-600"
    }
  }
];

export default function LinkLayanan() {
  const [links, setLinks] = useState<PortalLinkItem[]>(() => {
    const saved = localStorage.getItem("sipai_portal_links");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => {
            const { logoSvg, ...rest } = item;
            return rest as PortalLinkItem;
          });
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PORTAL_LINKS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(["siaga-pendis", "info-gtk", "myasn-bkn"]);
  const [selectedDetailPortal, setSelectedDetailPortal] = useState<PortalLinkItem | null>(null);

  // Modal Form State (used for BOTH Adding and Editing)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null means adding new item
  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
    kategori: "Kemenag & PAI" as PortalLinkItem["kategori"],
    url: "",
    deskripsi: "",
    fiturUtama: "",
    isFeatured: false
  });

  // Save to local storage helper
  const saveLinksToStorage = (updated: PortalLinkItem[]) => {
    const cleanList = updated.map((item: any) => {
      const { logoSvg, ...rest } = item;
      return rest;
    });
    setLinks(cleanList);
    try {
      localStorage.setItem("sipai_portal_links", JSON.stringify(cleanList));
    } catch {
      // ignore
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Open modal for ADD
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: "",
      singkatan: "",
      kategori: "Lainnya",
      url: "",
      deskripsi: "",
      fiturUtama: "",
      isFeatured: false
    });
    setShowModal(true);
  };

  // Open modal for EDIT
  const openEditModal = (item: PortalLinkItem) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      singkatan: item.singkatan,
      kategori: item.kategori,
      url: item.url,
      deskripsi: item.deskripsi,
      fiturUtama: item.fiturUtama ? item.fiturUtama.join(", ") : "",
      isFeatured: !!item.isFeatured
    });
    setShowModal(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.url) return;

    let formattedUrl = formData.url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const fiturList = formData.fiturUtama
      ? formData.fiturUtama.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Layanan Informasi & Portal Kedinasan"];

    if (editingId) {
      // UPDATE EXISTING LINK
      const updated = links.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            nama: formData.nama,
            singkatan: formData.singkatan || formData.nama.substring(0, 10).toUpperCase(),
            kategori: formData.kategori,
            url: formattedUrl,
            deskripsi: formData.deskripsi || "Portal layanan kedinasan.",
            fiturUtama: fiturList,
            isFeatured: formData.isFeatured
          };
        }
        return item;
      });
      saveLinksToStorage(updated);
    } else {
      // CREATE NEW LINK
      const created: PortalLinkItem = {
        id: `link-${Date.now()}`,
        nama: formData.nama,
        singkatan: formData.singkatan || formData.nama.substring(0, 10).toUpperCase(),
        kategori: formData.kategori,
        url: formattedUrl,
        deskripsi: formData.deskripsi || "Tautan portal kedinasan atau aplikasi pendukung guru.",
        fiturUtama: fiturList,
        isFeatured: formData.isFeatured,
        iconKey: "default",
        themeColor: {
          bg: "bg-slate-900/60",
          border: "border-emerald-600/40",
          text: "text-emerald-400",
          badgeBg: "bg-slate-800 text-slate-300 border-slate-700",
          buttonBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
          buttonHover: "hover:bg-emerald-600"
        }
      };
      saveLinksToStorage([...links, created]);
    }

    setShowModal(false);
  };

  // Handle Delete Link
  const handleDeleteLink = (item: PortalLinkItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${item.nama}"?`)) {
      const updated = links.filter((l) => l.id !== item.id);
      saveLinksToStorage(updated);
    }
  };

  // Handle Reset to Default Initial Links
  const handleResetToDefault = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh daftar tautan ke setelan awal pabrik (SIAGA Pendis, Info GTK, MyASN BKN, SIMPKB, PMM, PUSAKA)?")) {
      saveLinksToStorage(INITIAL_PORTAL_LINKS);
    }
  };

  // Filtered links
  const filteredLinks = links.filter((item) => {
    const matchesCategory = activeCategory === "Semua" || item.kategori === activeCategory;
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.singkatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredList = links.filter((l) => l.isFeatured);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <Globe className="w-96 h-96 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-extrabold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PORTAL TAUTAN RESMI GURU & ASN PAI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Tautan Portal Kedinasan & Layanan Terpadu
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kelola dan akses langsung portal utama Kementerian Agama (SIAGA Pendis), Kemdikbudristek (Info GTK), dan BKN (MyASN). Anda dapat menambah, mengedit, atau menghapus setiap tautan sesuai kebutuhan sekolah Anda.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Link Resmi & Terverifikasi • Bebas Disesuaikan (Fitur Edit & Hapus Aktif)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefault}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                title="Kembalikan Tautan ke Setelan Awal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Reset Awal</span>
              </button>

              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Layanan Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED / HIGHLIGHT CARDS (PINNED / MAIN PORTALS) */}
      {featuredList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Layanan Utama Diunggulkan ({featuredList.length})
            </h2>
            <span className="text-[11px] font-bold text-slate-500">Dapat Di-edit / Di-hapus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredList.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border ${item.themeColor?.border || "border-emerald-600/40"} bg-slate-900 text-white shadow-xl hover:scale-[1.01] transition duration-200 flex flex-col justify-between relative group`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getPortalLogo(item)}
                    </div>
                    
                    {/* Action buttons on card header */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-950/60 rounded-lg transition cursor-pointer"
                        title="Edit Layanan ini"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(item)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg transition cursor-pointer"
                        title="Hapus Layanan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${item.themeColor?.badgeBg || "bg-emerald-900/60 text-emerald-300 border-emerald-700/50"}`}>
                        {item.singkatan}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Online
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition line-clamp-2">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Key Features Pill */}
                  {item.fiturUtama && item.fiturUtama.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Layanan Utama:</span>
                      <ul className="space-y-1">
                        {item.fiturUtama.slice(0, 3).map((f, fIdx) => (
                          <li key={fIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Salin Alamat Tautan"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? "Tersalin!" : "Salin URL"}</span>
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition shadow-md ${item.themeColor?.buttonBg || "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
                  >
                    <span>Buka Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["Semua", "Kemenag & PAI", "Kemdikbud & GTK", "Kepegawaian ASN", "Lainnya"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-emerald-800 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama portal, kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* GRID OF ALL PORTALS */}
      {filteredLinks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Globe className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada layanan yang sesuai dengan pencarian
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci atau klik tombol reset untuk mengembalikan seluruh tautan resmi.
          </p>
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Daftar Tautan Awal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white shrink-0">
                        {getPortalLogo(item)}
                      </div>
                      <div>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded uppercase">
                          {item.kategori}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 line-clamp-1 group-hover:text-emerald-700 transition">
                          {item.singkatan}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isFav ? "text-amber-500 bg-amber-50 dark:bg-amber-950/50" : "text-slate-400 hover:text-amber-500"
                        }`}
                        title={isFav ? "Hapus dari Favorit" : "Tandai Favorit"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-amber-500" : ""}`} />
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition cursor-pointer"
                        title="Edit Layanan ini"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
                        title="Hapus Layanan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                      {item.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Key features bullet points */}
                  {item.fiturUtama && item.fiturUtama.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Layanan Terkait:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.fiturUtama.map((fitur, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-semibold"
                          >
                            {fitur}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDetailPortal(item)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 transition cursor-pointer"
                    title="Lihat Rincian Fitur Portal"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Info Fitur</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="Salin Alamat Tautan"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition shadow-sm"
                    >
                      <span>Kunjungi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL INFO */}
      {selectedDetailPortal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full text-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {getPortalLogo(selectedDetailPortal)}
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-black rounded">
                    {selectedDetailPortal.kategori}
                  </span>
                  <h3 className="text-base font-black text-white mt-1">
                    {selectedDetailPortal.nama}
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <strong className="text-white block mb-1">Deskripsi & Peruntukan:</strong>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
                  {selectedDetailPortal.deskripsi}
                </p>
              </div>

              {selectedDetailPortal.fiturUtama && selectedDetailPortal.fiturUtama.length > 0 && (
                <div>
                  <strong className="text-white block mb-1">Fitur & Layanan Utama:</strong>
                  <ul className="space-y-1.5">
                    {selectedDetailPortal.fiturUtama.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <strong className="text-white block mb-1">Alamat Domain Resmi:</strong>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400">
                  <span className="truncate">{selectedDetailPortal.url}</span>
                  <button
                    onClick={() => handleCopy(selectedDetailPortal.id, selectedDetailPortal.url)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const item = selectedDetailPortal;
                    setSelectedDetailPortal(null);
                    openEditModal(item);
                  }}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    const item = selectedDetailPortal;
                    setSelectedDetailPortal(null);
                    handleDeleteLink(item);
                  }}
                  className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDetailPortal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>

                <a
                  href={selectedDetailPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md"
                >
                  <span>Kunjungi Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-emerald-600" />}
                <span>{editingId ? "Edit Tautan Layanan" : "Tambah Tautan Layanan Baru"}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Nama Lengkap Portal / Layanan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SIAGA Pendis Kemenag RI"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Singkatan / Badge Singkat *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SIAGA PENDIS"
                  value={formData.singkatan}
                  onChange={(e) => setFormData({ ...formData, singkatan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Kemenag & PAI">Kemenag & PAI</option>
                    <option value="Kemdikbud & GTK">Kemdikbud & GTK</option>
                    <option value="Kepegawaian ASN">Kepegawaian ASN</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">
                      Tampilkan di Banner Utama
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  URL / Alamat Tautan Web *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Deskripsi Layanan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan fungsi portal dan dampaknya..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Fitur Utama (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Presensi, Cek TPG, SKTP, PDM ASN"
                  value={formData.fiturUtama}
                  onChange={(e) => setFormData({ ...formData, fiturUtama: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow-md cursor-pointer"
                >
                  {editingId ? "Simpan Perubahan" : "Tambah Tautan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
