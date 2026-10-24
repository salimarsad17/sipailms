/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  DownloadCloud,
  Layers,
  Sparkles,
  ShieldCheck,
  Key,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Activity,
  Users,
  Award,
  BookOpen,
  School,
  Lock
} from "lucide-react";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  checkSupabaseConnection
} from "../../lib/supabase";
import {
  pushAllToSupabase,
  pullAllFromSupabase,
  SupabaseSyncReport
} from "../../lib/supabaseService";
import { SUPABASE_SETUP_SQL } from "../../lib/supabaseSchema";
import { Siswa, Kelas, RekapNilaiTotal, Guru, DataSekolah } from "../../types";

interface SupabaseSyncTabProps {
  students?: Siswa[];
  classes?: Kelas[];
  rekapNilai?: RekapNilaiTotal[];
  guru?: Guru;
  sekolah?: DataSekolah;
  onRefreshData?: () => void;
}

export default function SupabaseSyncTab({
  students = [],
  classes = [],
  rekapNilai = [],
  guru,
  sekolah,
  onRefreshData
}: SupabaseSyncTabProps) {
  const [connectionStatus, setConnectionStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
    tablesFound: string[];
    latencyMs?: number;
  }>({
    loading: true,
    connected: false,
    message: "Memeriksa koneksi...",
    tablesFound: []
  });

  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [lastSyncReport, setLastSyncReport] = useState<SupabaseSyncReport | null>(null);
  const [pullMessage, setPullMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSqlCode, setShowSqlCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const verifyConnection = async () => {
    setConnectionStatus((prev) => ({ ...prev, loading: true }));
    const result = await checkSupabaseConnection();
    setConnectionStatus({
      loading: false,
      connected: result.connected,
      message: result.message,
      tablesFound: result.tablesFound || [],
      latencyMs: result.latencyMs
    });
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  const handlePushData = async () => {
    setIsPushing(true);
    setPullMessage(null);
    try {
      const report = await pushAllToSupabase();
      setLastSyncReport(report);
      if (report.success) {
        showToast(
          `Alhamdulillah! Data berhasil dikirim ke Supabase (${report.tablesUsed.join(", ")}).`
        );
      } else {
        showToast(
          `Pengiriman data selesai. Tabel Supabase perlu dibuat melalui SQL Editor.`
        );
      }
      verifyConnection();
    } catch (e: any) {
      showToast(`Gagal sinkron: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const handlePullData = async () => {
    setIsPulling(true);
    setPullMessage(null);
    try {
      const result = await pullAllFromSupabase();
      setPullMessage(result.message);
      if (result.success) {
        showToast(result.message);
        if (onRefreshData) onRefreshData();
      } else {
        showToast(result.message);
      }
      verifyConnection();
    } catch (e: any) {
      showToast(`Gagal menarik data: ${e.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    showToast("Skema SQL Supabase berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    showToast("Anon public key berhasil disalin!");
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const projectId = "wvuacmeuxwpuocpmwzkb";
  const dashboardSqlUrl = `https://supabase.com/dashboard/project/${projectId}/sql`;
  const dashboardTableUrl = `https://supabase.com/dashboard/project/${projectId}/editor`;

  const tablesExpected = [
    { name: "app_store", label: "App Store (JSON Sync)", icon: Layers, desc: "Penyimpanan cepat multi-modul" },
    { name: "sekolah", label: "Data Satuan Pendidikan", icon: School, desc: "Profil sekolah & kepala sekolah" },
    { name: "guru", label: "Data Pendidik PAI", icon: Users, desc: "Profil & sertifikasi guru" },
    { name: "kelas", label: "Data Rombongan Belajar", icon: School, desc: "Daftar kelas & wali kelas" },
    { name: "siswa", label: "Data Peserta Didik", icon: Users, desc: "Biodata siswa VII & VIII" },
    { name: "rekap_nilai", label: "Rekap Nilai Siswa", icon: Award, desc: "Nilai formatif & sumatif" },
    { name: "jurnal_guru", label: "Jurnal Mengajar", icon: BookOpen, desc: "Catatan KBM harian" },
    { name: "tugas_lms", label: "Tugas Pembelajaran", icon: BookOpen, desc: "Materi & penugasan online" },
    { name: "accounts", label: "Akun Pengguna", icon: Lock, desc: "Kredensial login guru & siswa" }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/60 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Supabase Main Status Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-700/60 p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 uppercase tracking-wider shadow">
                <Database className="w-3.5 h-3.5" /> Supabase Cloud PostgreSQL
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 border border-emerald-500/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Terkoneksi Resmi
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-900/80 border border-emerald-700/60 text-emerald-300">
                ⚡
              </span>
              Database Cloud Supabase
            </h2>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Aplikasi ini terhubung langsung ke database cloud <strong className="text-emerald-300">Supabase (PostgreSQL)</strong>.
              Seluruh data sekolah, pendidik, rombel, siswa, nilai, dan akun tersimpan aman di cloud berkecepatan tinggi.
            </p>

            {/* Connection Status Pill */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${
                  connectionStatus.connected
                    ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/60 shadow-sm"
                    : "bg-rose-950/60 text-rose-300 border-rose-500/60"
                }`}
              >
                {connectionStatus.loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : connectionStatus.connected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>
                  {connectionStatus.loading
                    ? "Menguji koneksi ke Supabase..."
                    : connectionStatus.message}
                </span>
                {connectionStatus.latencyMs !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 border border-emerald-700/50 text-emerald-200">
                    {connectionStatus.latencyMs} ms
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={verifyConnection}
                disabled={connectionStatus.loading}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                title="Periksa ulang status koneksi"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${connectionStatus.loading ? "animate-spin" : ""}`}
                />
                <span>Cek Ulang</span>
              </button>
            </div>
          </div>

          {/* Quick Push / Pull Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePushData}
              disabled={isPushing}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isPushing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>{isPushing ? "Mengirim Data..." : "Kirim Data ke Supabase (Upload)"}</span>
            </button>

            <button
              type="button"
              onClick={handlePullData}
              disabled={isPulling}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-600/40 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isPulling ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <DownloadCloud className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isPulling ? "Menarik Data..." : "Tarik Data dari Supabase (Download)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Credentials & Dashboard Info Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Endpoint & Auth Key */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-600" /> Parameter Koneksi Supabase
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Aktif
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Project API URL</p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 break-all select-all flex items-center justify-between">
                <span>{SUPABASE_URL}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[11px] font-bold text-slate-500">Public Anon Key (Client Access)</p>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? "Tersalin" : "Salin Kunci"}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-600 truncate">
                {SUPABASE_ANON_KEY.slice(0, 40)}...{SUPABASE_ANON_KEY.slice(-15)}
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Project Ref: <strong className="font-mono text-slate-700">{projectId}</strong></span>
            <span>Wilayah: <strong className="text-slate-700">Singapore (ap-southeast-1)</strong></span>
          </div>
        </div>

        {/* Right: Quick Links to Dashboard */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-600" /> Dashboard & Table Editor
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Official Console
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda dapat mengelola isi tabel secara visual atau menjalankan query SQL langsung melalui dashboard resmi Supabase.
            </p>
          </div>

          <div className="space-y-2">
            <a
              href={dashboardTableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Buka Table Editor di Dashboard Supabase</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={dashboardSqlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Buka SQL Editor di Dashboard Supabase</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Tables Status Grid */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Status Tabel Database Supabase
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabel yang terdeteksi otomatis dalam skema <code className="font-mono text-emerald-700">public</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              {connectionStatus.tablesFound.length} dari {tablesExpected.length} Tabel Aktif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tablesExpected.map((tbl) => {
            const Icon = tbl.icon;
            const isReady = connectionStatus.tablesFound.includes(tbl.name);

            return (
              <div
                key={tbl.name}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isReady
                    ? "bg-emerald-50/60 border-emerald-300 text-slate-800"
                    : "bg-slate-50/60 border-slate-200 text-slate-600"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isReady ? "bg-emerald-200 text-emerald-900" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>{tbl.label}</span>
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      public.{tbl.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">{tbl.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    isReady
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}
                >
                  {isReady ? "Tersedia" : "Siap Dibuat"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. One-Click SQL Schema Setup Guide */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              Skema SQL Supabase (1-Klik Siap Pakai)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Jalankan skrip SQL ini di <strong>SQL Editor Dashboard Supabase</strong> untuk membuat seluruh tabel sekaligus beserta aturan keamanan (RLS).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? "Berhasil Disalin!" : "Salin Seluruh SQL"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSqlCode(!showSqlCode)}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>{showSqlCode ? "Sembunyikan" : "Lihat Kode"}</span>
              {showSqlCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3 Step Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs font-bold text-slate-900">Salin Skrip SQL</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Klik tombol hijau <strong>"Salin Seluruh SQL"</strong> di atas.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-bold text-slate-900">Buka SQL Editor</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Buka menu SQL Editor di Supabase lalu klik <strong>"New Query"</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-bold text-slate-900">Paste & Klik Run</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Tempelkan (*paste*) kueri SQL lalu klik <strong>"Run"</strong>. Selesai!
            </p>
          </div>
        </div>

        {/* Expandable SQL Code Box */}
        {showSqlCode && (
          <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
            <button
              type="button"
              onClick={handleCopySql}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] flex items-center gap-1 transition"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? "Disalin!" : "Salin"}</span>
            </button>
            <pre className="whitespace-pre">{SUPABASE_SETUP_SQL}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
