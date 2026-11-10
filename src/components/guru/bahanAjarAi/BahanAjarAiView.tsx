/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Video,
  Gamepad2,
  FileText,
  GraduationCap,
  Layers,
  Award,
  Share2,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  User,
  CheckCircle2,
  Menu,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  Search,
  Trash2
} from "lucide-react";
import { BahanAjarAiCompleteBundle, KelasTingkatSmp } from "../../../types/bahanAjarAiModern";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";
import { BahanAjarAiFolderStorage } from "../../../services/bahanAjarAiFolderStorage";
import { BabPelajaran } from "../../../types";

// Submenu Views
import BahanAjarAiDashboard from "./BahanAjarAiDashboard";
import BahanAjarAiGenerator from "./BahanAjarAiGenerator";
import BahanAjarAiResultView from "./BahanAjarAiResultView";
import BankBahanAjarView from "./BankBahanAjarView";
import FolderBahanAjarView from "./FolderBahanAjarView";
import HasilSiswaView from "./HasilSiswaView";
import MateriKelasView from "./MateriKelasView";
import VideoPembelajaranView from "./VideoPembelajaranView";
import LkpdDigitalView from "./LkpdDigitalView";
import LmsPembelajaranView from "./LmsPembelajaranView";
import MateriDibagikanView from "./MateriDibagikanView";
import HasilGenerateView from "./HasilGenerateView";
import GameHubVisual from "./games/GameHubVisual";

interface BahanAjarAiViewProps {
  babPelajaran?: BabPelajaran[];
  onUpdateBabPelajaran?: (updated: BabPelajaran[]) => void;
}

export type SubMenuType =
  | "dashboard"
  | "generator"
  | "materi-7"
  | "materi-8"
  | "materi-9"
  | "video"
  | "game"
  | "lkpd"
  | "lms"
  | "bank"
  | "hasil-generate"
  | "dibagikan"
  | "rekap-aktivitas"
  | "folder"
  | "result";

export default function BahanAjarAiView({
  babPelajaran,
  onUpdateBabPelajaran
}: BahanAjarAiViewProps) {
  // Navigation Submenu State
  const [currentMenu, setCurrentMenu] = useState<SubMenuType>("dashboard");

  // Collapsible sidebar state (can be collapsed or expanded)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Notifications dropdown state
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);

  // Stored Bundles
  const [bundles, setBundles] = useState<BahanAjarAiCompleteBundle[]>(() =>
    BahanAjarAiStorage.getBundles()
  );

  // Active Selected Bundle
  const [activeBundle, setActiveBundle] = useState<BahanAjarAiCompleteBundle | null>(() =>
    bundles[0] || null
  );

  // Bank initial tab helper
  const [bankInitialFilter, setBankInitialFilter] = useState<string | undefined>(undefined);

  // Notification items
  const notificationsList = [
    {
      id: "notif-1",
      title: "Materi Baru Ter-generate",
      desc: "Video & 8 Game Thaharah Kelas VII siap digunakan.",
      time: "10 menit lalu",
      unread: true
    },
    {
      id: "notif-2",
      title: "LKPD Dikumpulkan",
      desc: "Ahmad Fauzi (VII-A) telah mengumpulkan jawaban LKPD.",
      time: "25 menit lalu",
      unread: true
    },
    {
      id: "notif-3",
      title: "Sinkronisasi Supabase Aktif",
      desc: "Seluruh progres belajar siswa UPT SMPN 2 Rebang Tangkas tersinkron.",
      time: "1 jam lalu",
      unread: true
    }
  ];

  // Callback when AI finishes generating a new bundle
  const handleGenerated = (newBundle: BahanAjarAiCompleteBundle) => {
    const updated = BahanAjarAiStorage.saveBundle(newBundle);
    setBundles(updated);
    setActiveBundle(newBundle);
    setCurrentMenu("result");
  };

  const handleDuplicate = (id: string) => {
    const dup = BahanAjarAiStorage.duplicateBundle(id);
    if (dup) {
      setBundles(BahanAjarAiStorage.getBundles());
      setActiveBundle(dup);
      setCurrentMenu("result");
    }
  };

  const handleDelete = (id: string) => {
    const updated = BahanAjarAiStorage.deleteBundle(id);
    setBundles(updated);
    if (activeBundle?.id === id) {
      setActiveBundle(updated[0] || null);
    }
  };

  // Efek inisialisasi: bersihkan data contoh lama agar bahan ajar AI benar-benar kosong sesuai instruksi guru
  useEffect(() => {
    const stored = BahanAjarAiStorage.getBundles();
    if (stored.length > 0 && stored.some((b) => b.id.includes("bundle_sample_") || b.id.includes("b_thaharah"))) {
      BahanAjarAiStorage.clearAllBundles();
      BahanAjarAiFolderStorage.clearAllFiles();
      setBundles([]);
      setActiveBundle(null);
    }
  }, []);

  const handleHapusSemuaIsi = () => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin MENGHAPUS SEMUA ISI Bahan Ajar AI?\n\n" +
      "Tindakan ini akan mengosongkan seluruh:\n" +
      "• Paket Bahan Ajar & Modul AI\n" +
      "• Berkas di Folder (Word, Excel, Video, PDF)\n" +
      "• Riwayat Nilai CBT & Skor Game Siswa\n\n" +
      "Klik OK untuk menghapus semuanya."
    );

    if (konfirmasi) {
      BahanAjarAiStorage.clearAllBundles();
      BahanAjarAiFolderStorage.clearAllFiles();
      setBundles([]);
      setActiveBundle(null);
      setCurrentMenu("dashboard");
      alert("Seluruh isi Bahan Ajar AI berhasil dihapus dan dikosongkan.");
    }
  };

  const handleGenerateForMateri = (materi: string, subMateri: string, kelas: KelasTingkatSmp) => {
    setCurrentMenu("generator");
  };

  // Submenu configuration (Section B)
  const menuItems = [
    { id: "dashboard" as SubMenuType, label: "1. Dashboard Bahan Ajar", icon: LayoutDashboard, badge: "Home" },
    { id: "generator" as SubMenuType, label: "2. Generator Bahan Ajar AI", icon: Sparkles, badge: "AI Core" },
    { id: "materi-7" as SubMenuType, label: "3. Materi Kelas 7", icon: BookOpen, badge: "Fase D" },
    { id: "materi-8" as SubMenuType, label: "4. Materi Kelas 8", icon: BookOpen, badge: "Fase D" },
    { id: "materi-9" as SubMenuType, label: "5. Materi Kelas 9", icon: BookOpen, badge: "Fase D" },
    { id: "video" as SubMenuType, label: "6. Video Pembelajaran", icon: Video, badge: "Studio" },
    { id: "game" as SubMenuType, label: "7. Game Edukasi (8 Game)", icon: Gamepad2, badge: "8-in-1" },
    { id: "lkpd" as SubMenuType, label: "8. LKPD Digital", icon: FileText, badge: "A4 Print" },
    { id: "lms" as SubMenuType, label: "9. LMS Pembelajaran", icon: GraduationCap, badge: "Kelas" },
    { id: "bank" as SubMenuType, label: "10. Bank Materi", icon: Layers, badge: `${bundles.length}` },
    { id: "hasil-generate" as SubMenuType, label: "11. Hasil Generate Saya", icon: Award, badge: "Karya" },
    { id: "dibagikan" as SubMenuType, label: "12. Materi yang Dibagikan", icon: Share2, badge: "WA & Web" },
    { id: "rekap-aktivitas" as SubMenuType, label: "13. Rekap Aktivitas Siswa", icon: CheckCircle2, badge: "Nilai" }
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* TOP HEADER WITH BRAND, ACTIONS & PROFILE */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDarkMode
            ? "bg-slate-900/90 border-slate-800 text-white"
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-2xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDarkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title={sidebarCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-600">
                UPT SMPN 2 REBANG TANGKAS
              </span>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center gap-1.5">
                <span className="text-blue-900 dark:text-blue-400">BAHAN AJAR</span>
                <span className="text-amber-500 font-black">PAI AI</span>
              </h1>
            </div>
          </div>

          {/* Right: Quick Folder, Dark Mode, Notification, Teacher Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Folder Access */}
            <button
              onClick={() => setCurrentMenu("folder")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
                currentMenu === "folder"
                  ? "bg-blue-900 text-amber-300 border-blue-950 shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              }`}
              title="Folder Berkas & Media Word, Excel, Video, PDF"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Folder Berkas</span>
            </button>

            {/* Quick Hapus Semua Isi Bahan Ajar */}
            <button
              onClick={handleHapusSemuaIsi}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
                isDarkMode
                  ? "bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60"
                  : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
              }`}
              title="Hapus semua isi bahan ajar AI"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDarkMode ? "bg-slate-800 text-amber-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title={isDarkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (unreadNotifications > 0) setUnreadNotifications(0);
                }}
                className={`p-2 rounded-xl relative transition cursor-pointer ${
                  isDarkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl shadow-2xl border p-4 space-y-3 z-50 animate-fadeIn ${
                    isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-black uppercase text-blue-600">Notifikasi Guru</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notificationsList.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border text-xs space-y-1 ${
                          isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 dark:text-white font-black">{n.title}</strong>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-indigo-900 text-amber-300 font-black text-xs flex items-center justify-center shadow-xs border border-amber-400/40">
                SA
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-black block leading-tight">Sadiqul Alim, S.Pd.I.</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Guru PAI • SMPN 2 Rebang Tangkas</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE CONTAINER WITH COLLAPSIBLE SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* COLLAPSIBLE SIDEBAR NAV (13 SUBMENUS - POIN B) */}
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-full md:w-20" : "w-full md:w-72"
          }`}
        >
          <div
            className={`rounded-3xl p-4 border transition-colors shadow-sm sticky top-20 space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/90"
            }`}
          >
            {/* Sidebar Title */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-black text-xs shadow-xs">
                  🕌
                </div>
                {!sidebarCollapsed && (
                  <span className="text-xs font-black tracking-wide text-slate-900 dark:text-white uppercase">
                    MENU BAHAN AJAR
                  </span>
                )}
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:block text-slate-400 hover:text-slate-600 p-1"
                title={sidebarCollapsed ? "Perluas" : "Perkecil"}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Menu List */}
            <nav className="space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto scrollbar-thin">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isSelected = currentMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "bank") setBankInitialFilter(undefined);
                      setCurrentMenu(item.id);
                    }}
                    title={item.label}
                    className={`w-full p-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-900 to-indigo-900 text-amber-300 shadow-md border border-blue-800"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition ${
                          isSelected ? "text-amber-400" : "text-blue-700 dark:text-blue-400 group-hover:scale-110"
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          isSelected
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Extra: Folder Berkas & Media */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentMenu("folder")}
                  className={`w-full p-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    currentMenu === "folder"
                      ? "bg-blue-900 text-amber-300 shadow-md"
                      : "bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    {!sidebarCollapsed && <span>📁 Folder Berkas (Word/Excel/PDF)</span>}
                  </div>
                </button>
              </div>
            </nav>

            {/* Quick Generator CTA inside Sidebar */}
            {!sidebarCollapsed && currentMenu !== "generator" && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentMenu("generator")}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Generate AI Baru</span>
                </button>
              </div>
            )}

            {/* Hapus Semua Isi Bahan Ajar Action */}
            {!sidebarCollapsed && (
              <div className="pt-1">
                <button
                  onClick={handleHapusSemuaIsi}
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Hapus semua isi bahan ajar AI"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Hapus Semua Isi Bahan Ajar</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN VIEW CONTENT CONTAINER */}
        <main className="flex-1 min-w-0">
          {/* Submenu 1: Dashboard Bahan Ajar */}
          {currentMenu === "dashboard" && (
            <BahanAjarAiDashboard
              bundles={bundles}
              onOpenGenerator={() => setCurrentMenu("generator")}
              onOpenBank={(filter) => {
                setBankInitialFilter(filter);
                setCurrentMenu("bank");
              }}
              onOpenKurikulum={() => setCurrentMenu("materi-7")}
              onOpenHasil={() => setCurrentMenu("rekap-aktivitas")}
              onOpenFolder={() => setCurrentMenu("folder")}
              onSelectBundle={(bundle) => {
                setActiveBundle(bundle);
                setCurrentMenu("result");
              }}
            />
          )}

          {/* Submenu 2: Generator Bahan Ajar AI */}
          {currentMenu === "generator" && (
            <BahanAjarAiGenerator
              onGenerated={handleGenerated}
              onCancel={() => setCurrentMenu("dashboard")}
              onViewResult={activeBundle ? () => setCurrentMenu("result") : undefined}
            />
          )}

          {/* Submenu 3: Materi Kelas 7 */}
          {currentMenu === "materi-7" && (
            <MateriKelasView
              kelas="7"
              bundles={bundles}
              onGenerateForMateri={handleGenerateForMateri}
              onOpenBundle={(bundle) => {
                setActiveBundle(bundle);
                setCurrentMenu("result");
              }}
            />
          )}

          {/* Submenu 4: Materi Kelas 8 */}
          {currentMenu === "materi-8" && (
            <MateriKelasView
              kelas="8"
              bundles={bundles}
              onGenerateForMateri={handleGenerateForMateri}
              onOpenBundle={(bundle) => {
                setActiveBundle(bundle);
                setCurrentMenu("result");
              }}
            />
          )}

          {/* Submenu 5: Materi Kelas 9 */}
          {currentMenu === "materi-9" && (
            <MateriKelasView
              kelas="9"
              bundles={bundles}
              onGenerateForMateri={handleGenerateForMateri}
              onOpenBundle={(bundle) => {
                setActiveBundle(bundle);
                setCurrentMenu("result");
              }}
            />
          )}

          {/* Submenu 6: Video Pembelajaran */}
          {currentMenu === "video" && (
            <VideoPembelajaranView
              bundles={bundles}
              activeBundle={activeBundle}
              onOpenGenerator={() => setCurrentMenu("generator")}
              onSelectBundle={(b) => setActiveBundle(b)}
            />
          )}

          {/* Submenu 7: Game Edukasi (8 Game Interaktif) */}
          {currentMenu === "game" && (
            <GameHubVisual
              kelas={activeBundle?.kelas || "7"}
              materi={activeBundle?.materi || "Thaharah: Bersuci dari Najis dan Hadas"}
              subMateri={activeBundle?.subMateri || "Tata Cara Thaharah dan Pembagian Najis"}
            />
          )}

          {/* Submenu 8: LKPD Digital */}
          {currentMenu === "lkpd" && (
            <LkpdDigitalView
              bundles={bundles}
              activeBundle={activeBundle}
              onSelectBundle={(b) => setActiveBundle(b)}
              onOpenGenerator={() => setCurrentMenu("generator")}
            />
          )}

          {/* Submenu 9: LMS Pembelajaran */}
          {currentMenu === "lms" && (
            <LmsPembelajaranView
              bundles={bundles}
              activeBundle={activeBundle}
              onSelectBundle={(b) => setActiveBundle(b)}
              onOpenGenerator={() => setCurrentMenu("generator")}
            />
          )}

          {/* Submenu 10: Bank Materi */}
          {currentMenu === "bank" && (
            <BankBahanAjarView
              bundles={bundles}
              onSelectBundle={(b) => {
                setActiveBundle(b);
                setCurrentMenu("result");
              }}
              onDuplicateBundle={handleDuplicate}
              onDeleteBundle={handleDelete}
              initialTypeFilter={bankInitialFilter}
            />
          )}

          {/* Submenu 11: Hasil Generate Saya */}
          {currentMenu === "hasil-generate" && (
            <HasilGenerateView
              bundles={bundles}
              onSelectBundle={(b) => {
                setActiveBundle(b);
                setCurrentMenu("result");
              }}
              onDuplicateBundle={handleDuplicate}
              onDeleteBundle={handleDelete}
              onOpenGenerator={() => setCurrentMenu("generator")}
            />
          )}

          {/* Submenu 12: Materi yang Dibagikan */}
          {currentMenu === "dibagikan" && (
            <MateriDibagikanView
              bundles={bundles}
              onOpenGenerator={() => setCurrentMenu("generator")}
              onOpenBundle={(bundle) => {
                setActiveBundle(bundle);
                setCurrentMenu("result");
              }}
            />
          )}

          {/* Submenu 13: Rekap Aktivitas Siswa */}
          {currentMenu === "rekap-aktivitas" && <HasilSiswaView />}

          {/* Extra: Folder Berkas & Media Word/Excel/Video/PDF */}
          {currentMenu === "folder" && (
            <FolderBahanAjarView onBackToDashboard={() => setCurrentMenu("dashboard")} />
          )}

          {/* View: Hasil Detail Bundle Aktif */}
          {currentMenu === "result" && activeBundle && (
            <BahanAjarAiResultView
              bundle={activeBundle}
              onUpdateBundle={(updated) => {
                setActiveBundle(updated);
                setBundles(BahanAjarAiStorage.getBundles());
              }}
              onBack={() => setCurrentMenu("dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
