/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link2,
  Copy,
  Check,
  Database,
  UploadCloud,
  Layers,
  Users,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Code2,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
  Loader2
} from "lucide-react";
import {
  GoogleSheetsSyncConfig,
  loadSheetsSyncConfig,
  saveSheetsSyncConfig,
  subscribeSheetsSyncConfig,
  connectExistingRekapSpreadsheet,
  createNewFullDatabaseSpreadsheet,
  syncFullDatabaseToGoogleSheet,
  DatabaseSyncPayload
} from "../../lib/googleSheetsAutoSync";
import { Siswa, Kelas, RekapNilaiTotal, NilaiSemesterParalel, JurnalMengajar, JurnalIbadahHarian, DataSekolah, Guru } from "../../types";

interface MenuSingkronProps {
  students: Siswa[];
  classes: Kelas[];
  rekapNilai: RekapNilaiTotal[];
  nilaiParalelList: NilaiSemesterParalel[];
  jurnalMengajar?: JurnalMengajar[];
  jurnalIbadah?: JurnalIbadahHarian[];
  sekolah?: DataSekolah;
  guru?: Guru;
  schoolName?: string;
  onNavigateToTab?: (tab: string) => void;
}

export default function MenuSingkron({
  students = [],
  classes = [],
  rekapNilai = [],
  nilaiParalelList = [],
  jurnalMengajar = [],
  jurnalIbadah = [],
  sekolah,
  guru,
  schoolName = "UPT SMPN 2 Rebang Tangkas",
  onNavigateToTab
}: MenuSingkronProps) {
  const [config, setConfig] = useState<GoogleSheetsSyncConfig | null>(() => loadSheetsSyncConfig());
  const [sheetUrlInput, setSheetUrlInput] = useState("");
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState("");
  const [customTitleInput, setCustomTitleInput] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
    details?: string[];
  } | null>(null);

  // Subscribe to config updates from anywhere in the app
  useEffect(() => {
    const unsub = subscribeSheetsSyncConfig((newConfig) => {
      setConfig(newConfig);
      if (newConfig) {
        if (newConfig.spreadsheetUrl) setSheetUrlInput(newConfig.spreadsheetUrl);
        else if (newConfig.spreadsheetId) setSheetUrlInput(`https://docs.google.com/spreadsheets/d/${newConfig.spreadsheetId}/edit`);
        if (newConfig.appsScriptUrl) setAppsScriptUrlInput(newConfig.appsScriptUrl);
        if (newConfig.spreadsheetTitle) setCustomTitleInput(newConfig.spreadsheetTitle);
      }
    });
    return () => unsub();
  }, []);

  // Initialize input values on load
  useEffect(() => {
    const current = loadSheetsSyncConfig();
    if (current) {
      if (current.spreadsheetUrl) {
        setSheetUrlInput(current.spreadsheetUrl);
      } else if (current.spreadsheetId) {
        setSheetUrlInput(`https://docs.google.com/spreadsheets/d/${current.spreadsheetId}/edit`);
      }
      if (current.appsScriptUrl) {
        setAppsScriptUrlInput(current.appsScriptUrl);
      }
      if (current.spreadsheetTitle) {
        setCustomTitleInput(current.spreadsheetTitle);
      }
    }
  }, []);

  // Timer interval to keep "X menit lalu" relative indicator up-to-date automatically every 10 seconds
  const [, setTimeAgoTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgoTicker((t) => t + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Helper function to format human-readable relative time (e.g. "Baru saja", "2 menit lalu", "1 jam lalu")
   */
  const getRelativeTimeText = (timestamp?: number, timeStr?: string): string => {
    if (!timestamp && !timeStr) return "Belum pernah disinkronkan";

    let syncTime = timestamp;
    if (!syncTime && timeStr) {
      const parsed = Date.parse(timeStr);
      if (!isNaN(parsed)) {
        syncTime = parsed;
      } else {
        const parts = timeStr.match(/(\d{1,2})[:.](\d{1,2})[:.]?(\d{1,2})?/);
        if (parts) {
          const now = new Date();
          const d = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            parseInt(parts[1], 10),
            parseInt(parts[2], 10),
            parseInt(parts[3] || "0", 10)
          );
          syncTime = d.getTime();
        }
      }
    }

    if (!syncTime) return timeStr ? `Pukul ${timeStr}` : "Belum pernah disinkronkan";

    const diffMs = Date.now() - syncTime;
    if (diffMs < 0 || diffMs < 15000) {
      return "Baru saja";
    }
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) {
      return `${diffSec} detik lalu`;
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} menit lalu`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      return `${diffHour} jam lalu`;
    }
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays} hari lalu`;
  };

  const showNotification = (type: "success" | "error" | "info", title: string, message: string, details?: string[]) => {
    setNotification({ type, title, message, details });
    if (type !== "error") {
      setTimeout(() => setNotification(null), 6000);
    }
  };

  // Helper to construct current full database payload
  const getFullPayload = (): DatabaseSyncPayload => ({
    sekolah,
    guru,
    classes,
    students,
    rekapNilai,
    nilaiParalel: nilaiParalelList,
    jurnalMengajar,
    jurnalIbadah
  });

  // Handle Save Link / Config
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    setNotification(null);

    const cleanSheet = sheetUrlInput.trim();
    const cleanScript = appsScriptUrlInput.trim();

    if (!cleanSheet && !cleanScript) {
      showNotification("error", "Input Belum Lengkap", "Silakan masukkan Link Google Sheet atau Link Google Apps Script.");
      setIsSavingConfig(false);
      return;
    }

    try {
      const updatedConfig = await connectExistingRekapSpreadsheet(
        cleanSheet,
        customTitleInput.trim() || undefined,
        cleanScript
      );
      setConfig(updatedConfig);
      showNotification(
        "success",
        "Tautan Berhasil Disimpan",
        `Link Google Sheet dan Google Apps Script berhasil terhubung sebagai database berjalan.`
      );
    } catch (err: any) {
      showNotification("error", "Gagal Menyimpan Tautan", err?.message || "Terjadi kesalahan saat memproses URL.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Handle Manual Synchronize All Data Now
  const handleSyncAllData = async () => {
    const activeConfig = config || loadSheetsSyncConfig();
    const cleanSheet = sheetUrlInput.trim();
    const cleanScript = appsScriptUrlInput.trim();

    if (!activeConfig && !cleanSheet && !cleanScript) {
      showNotification(
        "error",
        "Belum Ada Link Spreadsheet",
        "Masukkan Link Google Sheet atau Google Apps Script terlebih dahulu sebelum melakukan sinkronisasi."
      );
      return;
    }

    setIsSyncing(true);
    setNotification(null);

    try {
      // If config is not yet saved, save it first
      let currentCfg = activeConfig;
      if (!currentCfg || currentCfg.spreadsheetUrl !== cleanSheet || currentCfg.appsScriptUrl !== cleanScript) {
        if (cleanSheet || cleanScript) {
          currentCfg = await connectExistingRekapSpreadsheet(cleanSheet, customTitleInput.trim() || undefined, cleanScript);
          setConfig(currentCfg);
        }
      }

      if (!currentCfg) {
        throw new Error("Konfigurasi Google Sheet belum aktif.");
      }

      const payload = getFullPayload();
      const resultConfig = await syncFullDatabaseToGoogleSheet(currentCfg, payload, schoolName);
      setConfig(resultConfig);

      const tableList = [
        "Data Sekolah & Guru",
        `Data Kelas (${classes.length} Rombel)`,
        `Data Siswa (${students.length} Siswa)`,
        `Rekap Nilai Siswa (${rekapNilai.length} Entri)`,
        `Buku Nilai Semester Paralel (${nilaiParalelList.length} Entri)`,
        `Jurnal Mengajar Guru (${jurnalMengajar.length} Catatan)`,
        `Jurnal Ibadah Harian (${jurnalIbadah.length} Catatan)`
      ];

      showNotification(
        "success",
        "Sinkronisasi Berhasil!",
        "Seluruh data aplikasi telah berhasil dikirim dan disimpan ke Google Sheet & Google Script secara lengkap.",
        tableList
      );
    } catch (err: any) {
      console.error("Sync error:", err);
      showNotification(
        "error",
        "Gagal Singkron Data",
        err?.message || "Terjadi kesalahan koneksi saat mengirim data ke Google Sheets."
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Create Brand-New Spreadsheet
  const handleCreateNewSpreadsheet = async () => {
    setIsCreatingNew(true);
    setNotification(null);

    const defaultTitle = `PAILMS Database - ${schoolName} - ${new Date().getFullYear()}`;

    try {
      const payload = getFullPayload();
      const newConfig = await createNewFullDatabaseSpreadsheet(defaultTitle, payload, schoolName);
      setConfig(newConfig);
      setSheetUrlInput(newConfig.spreadsheetUrl);
      setCustomTitleInput(newConfig.spreadsheetTitle);

      showNotification(
        "success",
        "Spreadsheet Baru Berhasil Dibuat!",
        `File "${newConfig.spreadsheetTitle}" telah otomatis dibuat di Google Drive dan terisi 13 lembar kerja database.`
      );
    } catch (err: any) {
      console.error("Create spreadsheet error:", err);
      showNotification(
        "error",
        "Gagal Membuat Spreadsheet",
        err?.message || "Pastikan Anda telah login akun Google atau memiliki izin akses Google Drive."
      );
    } finally {
      setIsCreatingNew(false);
    }
  };

  // Toggle Auto-Sync
  const handleToggleAutoSync = () => {
    if (!config) {
      showNotification("info", "Tautkan Spreadsheet Dulu", "Masukkan tautan Google Sheet untuk mengaktifkan Simpan Otomatis.");
      return;
    }
    const nextState = !config.autoSync;
    const updated = {
      ...config,
      autoSync: nextState
    };
    saveSheetsSyncConfig(updated);
    setConfig(updated);

    showNotification(
      nextState ? "success" : "info",
      nextState ? "Simpan Otomatis Diaktifkan" : "Simpan Otomatis Dinonaktifkan",
      nextState
        ? "Setiap penambahan atau pengeditan data di aplikasi akan otomatis disimpan ke Google Sheet secara berkala."
        : "Simpan otomatis dimatikan. Anda dapat menekan tombol 'Singkronkan Data Sekarang' untuk kirim manual."
    );
  };

  // Handle Disconnect
  const handleDisconnect = () => {
    if (window.confirm("Apakah Anda yakin ingin memutuskan tautan Google Sheet saat ini?")) {
      saveSheetsSyncConfig(null);
      setConfig(null);
      setSheetUrlInput("");
      setAppsScriptUrlInput("");
      showNotification("info", "Tautan Diputuskan", "Koneksi Google Sheet telah di-reset.");
    }
  };

  // Copy link handler
  const handleCopyLink = () => {
    const url = config?.spreadsheetUrl || sheetUrlInput;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy Code.gs handler
  const handleCopyCodeSnippet = () => {
    const codeSnippet = `/**
 * BACKEND GOOGLE APPS SCRIPT - DATABASE GOOGLE SHEETS
 * SISTEM INFORMASI & LMS PEMBELAJARAN PAI SMP (PAILMS)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Simpan tabel data payload...
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data tersimpan otomatis." }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const isConnected = !!(config && (config.spreadsheetId || config.appsScriptUrl));
  const activeUrl = config?.spreadsheetUrl || (sheetUrlInput.startsWith("http") ? sheetUrlInput : "");
  const isCurrentSyncing = isSyncing || config?.syncStatus === "syncing";
  const lastSyncRelative = getRelativeTimeText(config?.lastSyncedTimestamp, config?.lastSyncedAt);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-700/60 p-6 md:p-8 shadow-xl">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow">
                <Sparkles className="w-3.5 h-3.5" /> Database Terpusat & Live Sync
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-600/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Google Sheets & Apps Script
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <RefreshCw className={`w-7 h-7 text-amber-400 ${isCurrentSyncing ? "animate-spin" : ""}`} />
              Menu Singkron Data & Google Sheet
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Hubungkan tautan Google Spreadsheet dan Google Apps Script untuk menyinkronkan seluruh database sekolah,
              siswa, nilai, dan jurnal mengajar. Data dapat <span className="text-amber-300 font-semibold">ditambah, diedit, dan disimpan otomatis</span> ke Google Sheets.
            </p>

            {/* DYNAMIC SYNC STATUS PILL IN HEADER */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isCurrentSyncing
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md shadow-amber-950/40 animate-pulse"
                    : isConnected && config?.syncStatus === "synced"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm"
                    : config?.syncStatus === "error"
                    ? "bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-sm"
                    : "bg-slate-900 text-slate-300 border-slate-700"
                }`}
              >
                {isCurrentSyncing ? (
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                ) : isConnected && config?.syncStatus === "synced" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : config?.syncStatus === "error" ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {isCurrentSyncing
                    ? "Sedang mengirim data ke Google Sheets..."
                    : isConnected && config?.lastSyncedAt
                    ? `Terakhir disinkronkan: ${lastSyncRelative}`
                    : "Belum pernah disinkronkan"}
                </span>
                {config?.lastSyncedAt && !isCurrentSyncing && (
                  <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    {config.lastSyncedAt} WIB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Primary Sync Button in Header */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
            <button
              type="button"
              onClick={handleSyncAllData}
              disabled={isCurrentSyncing || isCreatingNew}
              className={`px-5 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                isCurrentSyncing
                  ? "bg-amber-500 text-slate-950 shadow-amber-500/30 cursor-wait"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/25 active:scale-95"
              }`}
            >
              <RefreshCw className={`w-5 h-5 shrink-0 ${isCurrentSyncing ? "animate-spin text-slate-950" : "text-slate-950"}`} />
              <span>{isCurrentSyncing ? "Menyinkronkan Semua Data..." : "Singkronkan Data Sekarang"}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              {isCurrentSyncing ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirim data ke Google Sheets...
                </span>
              ) : isConnected && config?.lastSyncedAt ? (
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Terakhir singkron: <strong className="text-white">{lastSyncRelative}</strong>
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">Siap menyinkronkan data</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-950/80 border-emerald-600/70 text-emerald-200"
              : notification.type === "error"
              ? "bg-rose-950/80 border-rose-600/70 text-rose-200"
              : "bg-sky-950/80 border-sky-600/70 text-sky-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {notification.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {notification.type === "info" && <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}

            <div>
              <h4 className="font-bold text-sm text-white">{notification.title}</h4>
              <p className="text-xs md:text-sm mt-0.5 opacity-90">{notification.message}</p>
              {notification.details && notification.details.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                  {notification.details.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-black/30 text-[11px] font-mono font-medium text-emerald-300 border border-emerald-500/30">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Status & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Status Koneksi */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Status Database
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1.5 ${
                  isCurrentSyncing
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse"
                    : isConnected && config?.syncStatus === "synced"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : config?.syncStatus === "error"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {isCurrentSyncing ? (
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                ) : isConnected && config?.syncStatus === "synced" ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                )}
                {isCurrentSyncing
                  ? "Menyinkronkan..."
                  : isConnected && config?.syncStatus === "synced"
                  ? "Tersambung & Tersinkron"
                  : config?.syncStatus === "error"
                  ? "Gagal Sinkron"
                  : "Belum Terhubung"}
              </span>
            </div>

            <div>
              <p className="text-white font-bold text-base truncate">
                {config?.spreadsheetTitle || (isConnected ? "Database PAI SMP" : "Google Sheet Belum Terhubung")}
              </p>
            </div>

            {/* Live Synchronized Indicator Box */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                isCurrentSyncing
                  ? "bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-inner"
                  : isConnected && config?.syncStatus === "synced"
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : config?.syncStatus === "error"
                  ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                  : "bg-slate-950/40 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isCurrentSyncing ? (
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />
                ) : isConnected && config?.syncStatus === "synced" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : config?.syncStatus === "error" ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">
                      {isCurrentSyncing
                        ? "Sedang Mengirim ke Google Sheets..."
                        : isConnected && config?.syncStatus === "synced"
                        ? "Data Berhasil Terkirim ke Google Sheets"
                        : config?.syncStatus === "error"
                        ? "Gagal Terkirim ke Google Sheets"
                        : "Menunggu Pengaturan Google Sheet"}
                    </span>
                    {isConnected && !isCurrentSyncing && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Terakhir disinkronkan:{" "}
                    <span className="font-mono font-bold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                      {lastSyncRelative}
                    </span>
                  </p>

                  {config?.lastSyncedAt && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Waktu simpan: {config.lastSyncedAt} WIB
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {activeUrl && (
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Google Sheet
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Salin Tautan"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Tersalin" : "Salin"}
              </button>
            </div>
          )}
        </div>

        {/* Card Simpan Otomatis (Auto-Sync) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-amber-400" /> Simpan Otomatis
              </span>
              <button
                type="button"
                onClick={handleToggleAutoSync}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config?.autoSync ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config?.autoSync ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="text-white font-bold text-base">
                {config?.autoSync ? "Simpan Otomatis Aktif" : "Simpan Otomatis Nonaktif"}
              </p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {config?.autoSync
                  ? "Setiap Anda menambah atau mengedit data siswa, nilai, dan jurnal, data langsung tersimpan otomatis ke Google Sheet."
                  : "Perubahan data hanya disimpan secara lokal sampai Anda menekan tombol singkron."}
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Metode Debounce:</span>
            <span className="font-semibold text-emerald-400">Cloud Real-Time</span>
          </div>
        </div>

        {/* Card Ringkasan Data Saat Ini */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" /> Ringkasan Data Terkirim
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white">{students.length}</div>
                  <div className="text-[10px] text-slate-400 truncate">Total Siswa</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white">{rekapNilai.length}</div>
                  <div className="text-[10px] text-slate-400 truncate">Rekap Nilai</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white">{jurnalMengajar.length}</div>
                  <div className="text-[10px] text-slate-400 truncate">Jurnal Mengajar</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black text-white">{jurnalIbadah.length}</div>
                  <div className="text-[10px] text-slate-400 truncate">Jurnal Ibadah</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rombel Kelas:</span>
            <span className="font-semibold text-slate-200">{classes.length} Kelas Terdaftar</span>
          </div>
        </div>
      </div>

      {/* 3. Link Google Sheet & Konfigurasi Koneksi */}
      <div className="p-6 md:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-emerald-400" />
              Link Google Sheet & Backend Google Script
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Tautkan file Google Spreadsheet untuk melihat tabel langsung, atau masukkan URL Google Apps Script Web App.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNewSpreadsheet}
              disabled={isCreatingNew || isSyncing}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCreatingNew
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60 hover:text-white"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? "Membuat Spreadsheet..." : "Buat Spreadsheet Baru"}</span>
            </button>

            {isConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/40 flex items-center gap-1.5 transition cursor-pointer"
                title="Putuskan koneksi Google Sheet"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Putuskan</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-5">
          {/* Input Link Google Sheet */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Link Google Spreadsheet (URL / Spreadsheet ID)
              </span>
              {activeUrl && (
                <span className="text-[11px] text-emerald-400 font-semibold lowercase">
                  tersambung
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sheetUrlInput}
                onChange={(e) => setSheetUrlInput(e.target.value)}
                placeholder="Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
              />
              {activeUrl && (
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Buka Sheet</span>
                </a>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Tempelkan URL Google Spreadsheet yang Anda miliki dari browser, atau biarkan kosong jika hanya menggunakan Web App Google Script.
            </p>
          </div>

          {/* Input Link Google Apps Script */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                Link Google Apps Script Web App (URL /exec)
              </span>
              <button
                type="button"
                onClick={() => setShowCodeGuide(!showCodeGuide)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                {showCodeGuide ? "Sembunyikan Panduan" : "Cara Dapatkan Link"}
                {showCodeGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </label>
            <input
              type="text"
              value={appsScriptUrlInput}
              onChange={(e) => setAppsScriptUrlInput(e.target.value)}
              placeholder="Contoh: https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
            />
            <p className="text-[11px] text-slate-400">
              URL deployment Aplikasi Web dari file <code className="text-amber-300 font-mono">code.gs</code>. Memungkinkan eksekusi backend tanpa batasan sesi Google token.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSavingConfig || isCurrentSyncing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition cursor-pointer ${
                isSavingConfig
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/20 active:scale-95"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isSavingConfig ? "Menyimpan Tautan..." : "Simpan Pengaturan Link"}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncAllData}
              disabled={isCurrentSyncing || isCreatingNew}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition cursor-pointer ${
                isCurrentSyncing
                  ? "bg-amber-500 text-slate-950 font-black cursor-wait shadow-amber-500/30"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-amber-400/20 active:scale-95"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isCurrentSyncing ? "animate-spin text-slate-950" : ""}`} />
              <span>{isCurrentSyncing ? "Sedang Mengirim Data..." : "Singkronkan Data Sekarang"}</span>
            </button>

            {/* Live Indicator next to Form Buttons */}
            <div className="flex items-center gap-2 pl-1 py-1">
              {isCurrentSyncing ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Mengirim data ke Google Sheets...</span>
                </div>
              ) : isConnected && config?.lastSyncedAt ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Data berhasil tersimpan • Terakhir disinkronkan:{" "}
                    <strong className="text-white font-mono">{lastSyncRelative}</strong>
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </form>

        {/* Apps Script Guide Accordion */}
        {showCodeGuide && (
          <div className="p-4 md:p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4 text-xs md:text-sm text-slate-300 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-amber-400 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Panduan Singkat Deployment Google Apps Script (code.gs)
              </h3>
              <button
                type="button"
                onClick={handleCopyCodeSnippet}
                className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-400/30 transition cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? "Kode Tersalin!" : "Salin Contoh Kode"}
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
              <li>
                Buka <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-semibold">script.google.com</a> atau buka Google Spreadsheet Anda lalu klik menu <strong>Ekstensi &gt; Apps Script</strong>.
              </li>
              <li>
                Salin seluruh isi file <code className="text-emerald-300 font-mono">code.gs</code> / <code className="text-emerald-300 font-mono">Kode.gs</code> yang sudah disediakan di folder proyek aplikasi ini ke editor Google Apps Script.
              </li>
              <li>
                Klik tombol <strong>Deploy (Terapkan) &gt; Deployment Baru</strong>.
              </li>
              <li>
                Pilih jenis <strong>Aplikasi Web</strong> (ikon gerigi). Set <em>Execute as: Me</em> dan <em>Who has access: Anyone (Siapa saja)</em>.
              </li>
              <li>
                Klik <strong>Deploy</strong>, izinkan akses Google, lalu salin URL yang berakhiran <code className="text-amber-300 font-mono">/exec</code> ke kolom di atas.
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* 4. Aksi Cepat Tambah & Edit Data (Auto-Save Explained) */}
      <div className="p-6 md:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
              Kemudahan Tambah & Edit Data
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mt-1">
            Data Bisa Ditambah, Diedit & Disimpan Otomatis
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Aplikasi PAILMS telah dilengkapi dengan integrasi dua arah: Anda dapat menambah atau mengubah data murid,
            memasukkan nilai harian/ujian, mengisi jurnal KBM, dan data langsung tersimpan secara aman di Google Sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Card 1: Data Siswa */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-600/50 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Data Siswa & Kelas</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tambah murid baru, ubah NISN, kelas, dan data rombel.
              </p>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("master")}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 text-xs font-bold border border-slate-800 hover:border-emerald-700/60 flex items-center justify-between transition cursor-pointer"
              >
                <span>Kelola Siswa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 2: Rekap Nilai */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-600/50 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center mb-2.5">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Rekap Nilai Siswa</h4>
              <p className="text-xs text-slate-400 mt-1">
                Input & perbarui nilai UH, PTS, PAS, dan Buku Nilai Paralel.
              </p>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("nilai")}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-amber-950 text-slate-300 hover:text-amber-300 text-xs font-bold border border-slate-800 hover:border-amber-700/60 flex items-center justify-between transition cursor-pointer"
              >
                <span>Input Nilai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 3: Jurnal Mengajar */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-600/50 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center justify-center mb-2.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Jurnal Mengajar Guru</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tulis catatan pertemuan KBM, absensi, materi, dan refleksi.
              </p>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("jurnal")}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-sky-950 text-slate-300 hover:text-sky-300 text-xs font-bold border border-slate-800 hover:border-sky-700/60 flex items-center justify-between transition cursor-pointer"
              >
                <span>Buka Jurnal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 4: Pengaturan Sekolah & Guru */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-600/50 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center mb-2.5">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Identitas Sekolah & Guru</h4>
              <p className="text-xs text-slate-400 mt-1">
                Edit NPSN, nama kepala sekolah, NIP guru, dan profil.
              </p>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("pengaturan")}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-teal-950 text-slate-300 hover:text-teal-300 text-xs font-bold border border-slate-800 hover:border-teal-700/60 flex items-center justify-between transition cursor-pointer"
              >
                <span>Pengaturan Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Riwayat Log Sinkronisasi */}
      {config?.syncLogs && config.syncLogs.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Riwayat Sinkronisasi Terakhir
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {config.syncLogs.length} aktivitas tersimpan
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {config.syncLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-slate-200 font-medium">{log.message}</p>
                    {log.affectedSheets && log.affectedSheets.length > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Lembar Kerja: {log.affectedSheets.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
