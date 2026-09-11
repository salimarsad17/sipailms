/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link2,
  Plus,
  X,
  Lock,
  Sparkles,
  Zap,
  Check,
  ChevronDown
} from "lucide-react";
import {
  GoogleSheetsSyncConfig,
  loadSheetsSyncConfig,
  saveSheetsSyncConfig,
  subscribeSheetsSyncConfig,
  createNewRekapSpreadsheet,
  connectExistingRekapSpreadsheet,
  syncRekapAllToGoogleSheet
} from "../../lib/googleSheetsAutoSync";
import { getCurrentUser, googleSignIn, isLiveGoogleToken, getAccessToken, GoogleUser, subscribeAuth } from "../../lib/googleAuth";
import { Siswa, Kelas, RekapNilaiTotal, NilaiSemesterParalel } from "../../types";

interface GoogleSheetsSyncBarProps {
  rekapNilai: RekapNilaiTotal[];
  nilaiParalelList: NilaiSemesterParalel[];
  students: Siswa[];
  classes: Kelas[];
  schoolName?: string;
  onSyncComplete?: () => void;
}

export default function GoogleSheetsSyncBar({
  rekapNilai,
  nilaiParalelList,
  students,
  classes,
  schoolName = "UPT SMPN 2 Rebang Tangkas",
  onSyncComplete
}: GoogleSheetsSyncBarProps) {
  const [config, setConfig] = useState<GoogleSheetsSyncConfig | null>(() => loadSheetsSyncConfig());
  const [user, setUser] = useState<GoogleUser | null>(() => getCurrentUser());
  const [token, setToken] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"create" | "existing">("create");
  const [spreadsheetUrlInput, setSpreadsheetUrlInput] = useState("");
  const [customTitleInput, setCustomTitleInput] = useState(
    `PAILMS - Rekap Nilai PAI (${schoolName}) - ${new Date().getFullYear()}`
  );

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Subscribe to config changes
  useEffect(() => {
    const unsub = subscribeSheetsSyncConfig((cfg) => {
      setConfig(cfg);
    });
    return () => unsub();
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const unsub = subscribeAuth((usr, tok) => {
      setUser(usr);
      setToken(tok);
    });
    return () => unsub();
  }, []);

  // Manual Trigger Sync
  const handleManualSync = async () => {
    if (!config) {
      setIsModalOpen(true);
      return;
    }

    setIsActionLoading(true);
    setErrorMessage(null);
    try {
      await syncRekapAllToGoogleSheet(config, rekapNilai, nilaiParalelList, students, classes, schoolName);
      setSuccessMessage("Berhasil menyinkronkan data dengan Google Sheets!");
      setTimeout(() => setSuccessMessage(null), 3500);
      if (onSyncComplete) onSyncComplete();
    } catch (err: any) {
      setErrorMessage(err?.message || "Gagal menyinkronkan ke Google Sheets.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Create New Spreadsheet
  const handleCreateNewSpreadsheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    setErrorMessage(null);
    try {
      const newCfg = await createNewRekapSpreadsheet(
        customTitleInput.trim() || `PAILMS - Rekap Nilai PAI - ${schoolName}`,
        rekapNilai,
        nilaiParalelList,
        students,
        classes,
        schoolName
      );
      setConfig(newCfg);
      setSuccessMessage("Spreadsheet Google baru berhasil dibuat dan terhubung!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Gagal membuat spreadsheet di Google Drive.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Connect Existing Spreadsheet
  const handleConnectExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetUrlInput.trim()) {
      setErrorMessage("Silakan masukkan tautan atau ID Google Sheets.");
      return;
    }

    setIsActionLoading(true);
    setErrorMessage(null);
    try {
      const newCfg = await connectExistingRekapSpreadsheet(spreadsheetUrlInput.trim());
      setConfig(newCfg);
      // Immediately trigger initial sync
      await syncRekapAllToGoogleSheet(newCfg, rekapNilai, nilaiParalelList, students, classes, schoolName);
      setSuccessMessage("Google Sheet berhasil terhubung dan tersinkronisasi!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Tautan atau ID Spreadsheet tidak valid.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Disconnect
  const handleDisconnect = () => {
    if (confirm("Apakah Anda yakin ingin memutuskan koneksi Google Sheets ini? Data lokal aplikasi akan tetap aman.")) {
      saveSheetsSyncConfig(null);
      setConfig(null);
      setIsModalOpen(false);
    }
  };

  // Toggle Auto-save
  const handleToggleAutoSave = () => {
    if (!config) return;
    const updated: GoogleSheetsSyncConfig = {
      ...config,
      autoSync: !config.autoSync
    };
    saveSheetsSyncConfig(updated);
    setConfig(updated);
  };

  const isLiveOAuth = Boolean(token && isLiveGoogleToken(token));

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Status & Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                config
                  ? "bg-emerald-100 text-emerald-700 shadow-inner"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Integrasi Google Sheets
                </span>
                {config ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Terkoneksi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Belum Terhubung
                  </span>
                )}

                {config?.syncStatus === "syncing" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Menyimpan otomatis...
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {config ? (
                  <>
                    <h4 className="text-sm font-bold text-slate-900 truncate max-w-xs md:max-w-md">
                      {config.spreadsheetTitle}
                    </h4>
                    <a
                      href={config.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Buka di Google Sheets
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-slate-600">
                    Hubungkan Google Sheet agar nilai yang diinput & dihapus otomatis tersimpan real-time.
                  </p>
                )}
              </div>

              {/* Sub status info */}
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Auto-Save Aktif: Perubahan input nilai & delete langsung tersimpan.
                </span>
                {config?.lastSyncedAt && (
                  <span>• Sinkron terakhir: {config.lastSyncedAt}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {config ? (
              <>
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isActionLoading || config.syncStatus === "syncing"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 disabled:opacity-50"
                  title="Sinkronkan data rekap nilai sekarang"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${config.syncStatus === "syncing" ? "animate-spin" : ""}`} />
                  Sinkron Sekarang
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
                >
                  Pengaturan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md transition active:scale-95"
              >
                <Link2 className="w-4 h-4" />
                Hubungkan ke Google Sheets
              </button>
            )}
          </div>
        </div>

        {/* Transient alert message */}
        {successMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {errorMessage}
          </div>
        )}
      </div>

      {/* MODAL: CONNECT / CREATE GOOGLE SHEET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Koneksi Google Sheets Rekap Nilai</h3>
                  <p className="text-xs text-emerald-100">
                    Otomatis menyimpan setiap input dan penghapusan data nilai
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 transition text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* If connected, show current info */}
              {config && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-emerald-800">
                      Spreadsheet Terhubung Saat Ini
                    </span>
                    <span className="text-[10px] bg-emerald-200/60 font-bold px-2 py-0.5 rounded text-emerald-900">
                      ID: {config.spreadsheetId.slice(0, 12)}...
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{config.spreadsheetTitle}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={config.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      Buka di Tab Baru <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Putuskan Koneksi
                    </button>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setModalTab("create");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    modalTab === "create"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Buat Spreadsheet Baru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalTab("existing");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    modalTab === "existing"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tautkan yang Sudah Ada
                </button>
              </div>

              {/* Tab 1: Create New */}
              {modalTab === "create" && (
                <form onSubmit={handleCreateNewSpreadsheet} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul File Spreadsheet
                    </label>
                    <input
                      type="text"
                      required
                      value={customTitleInput}
                      onChange={(e) => setCustomTitleInput(e.target.value)}
                      placeholder="Masukkan nama spreadsheet..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Akan otomatis membuat tab <strong>Master Rekap PAI</strong>, <strong>Nilai Semester Paralel</strong>, dan tab per rombel kelas.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Fitur Otomatisasi:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                      <li>Setiap input nilai formatif, sumatif, PTS, PAS otomatis terisi ke baris siswa.</li>
                      <li>Penghapusan data di aplikasi otomatis menghapus baris terkait.</li>
                      <li>Data tersimpan ganda: di Google Sheets & penyimpanan lokal browser.</li>
                    </ul>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isActionLoading}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {isActionLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sedang Membuat Spreadsheet...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Buat & Hubungkan Sekarang
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Tab 2: Connect Existing */}
              {modalTab === "existing" && (
                <form onSubmit={handleConnectExisting} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL atau Spreadsheet ID Google Sheets
                    </label>
                    <input
                      type="text"
                      required
                      value={spreadsheetUrlInput}
                      onChange={(e) => setSpreadsheetUrlInput(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFM.../edit"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Salin tautan dari bilah alamat browser Google Sheets Anda. Pastikan berkas memiliki izin akses lihat/edit.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isActionLoading}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {isActionLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Menghubungkan Spreadsheet...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        Hubungkan & Sinkronkan Sekarang
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Akun: {user?.displayName || "Pengguna PAI"}</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-bold text-slate-700 hover:text-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
