/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Settings,
  KeyRound,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  Copy,
  Check,
  Users,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  School,
  Sparkles,
  CloudUpload,
  Cloud,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Database,
  CheckCheck
} from "lucide-react";
import { UserAccount, DataSekolah, Guru, Siswa, Kelas, RekapNilaiTotal, NilaiSemesterParalel } from "../../types";
import { DataService } from "../../data/initialData";
import GuruPhotoFrame from "./GuruPhotoFrame";
import {
  loadSheetsSyncConfig,
  saveSheetsSyncConfig,
  subscribeSheetsSyncConfig,
  syncRekapAllToGoogleSheet,
  createNewRekapSpreadsheet,
  connectExistingRekapSpreadsheet,
  GoogleSheetsSyncConfig
} from "../../lib/googleSheetsAutoSync";
import { getCurrentUser, subscribeAuth, GoogleUser } from "../../lib/googleAuth";

interface PengaturanAkunProps {
  currentUser: {
    role: "GURU" | "SISWA";
    identifier: string; // NIP atau NISN
    nama: string;
  };
  sekolah: DataSekolah;
  guru?: Guru;
  students?: Siswa[];
  classes?: Kelas[];
  rekapNilai?: RekapNilaiTotal[];
  nilaiParalelList?: NilaiSemesterParalel[];
  onPasswordChanged?: (newPassword: string) => void;
  onOpenGoogleSheets?: () => void;
}

export default function PengaturanAkun({
  currentUser,
  sekolah,
  guru,
  students = [],
  classes = [],
  rekapNilai: propRekapNilai,
  nilaiParalelList: propNilaiParalel,
  onPasswordChanged,
  onOpenGoogleSheets
}: PengaturanAkunProps) {
  // Accounts from Storage
  const [accounts, setAccounts] = useState<UserAccount[]>(() => DataService.getAccounts());

  // Find or create current account record
  const currentAcc = accounts.find(
    (a) =>
      a.role === (currentUser.role === "GURU" ? "guru" : "siswa") &&
      a.identifier.trim().toLowerCase() === currentUser.identifier.trim().toLowerCase()
  ) || {
    id: `acc-${currentUser.role.toLowerCase()}-current`,
    role: currentUser.role === "GURU" ? "guru" : "siswa",
    identifier: currentUser.identifier,
    password: "123",
    nama: currentUser.nama,
    registeredAt: new Date().toISOString()
  };

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [copiedCurrent, setCopiedCurrent] = useState(false);

  // Status Toast / Message
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Master Accounts Management States (for Guru)
  const [searchAccountQuery, setSearchAccountQuery] = useState("");
  const [accountFilterRole, setAccountFilterRole] = useState<"ALL" | "GURU" | "SISWA">("ALL");
  const [visibleAccountPasswords, setVisibleAccountPasswords] = useState<Record<string, boolean>>({});

  // Modal Edit Password Akun Tertentu (Guru View)
  const [editingTargetAccount, setEditingTargetAccount] = useState<UserAccount | null>(null);
  const [targetNewPassword, setTargetNewPassword] = useState("");
  const [showTargetNewPassword, setShowTargetNewPassword] = useState(false);

  // Modal Tambah Akun Baru
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [addAccountRole, setAddAccountRole] = useState<"guru" | "siswa">("siswa");
  const [addAccountIdentifier, setAddAccountIdentifier] = useState("");
  const [addAccountNama, setAddAccountNama] = useState("");
  const [addAccountPassword, setAddAccountPassword] = useState("123");
  const [addAccountKelasId, setAddAccountKelasId] = useState(classes[0]?.id || "VII-A");

  // Keep accounts synchronized
  const refreshAccounts = () => {
    setAccounts(DataService.getAccounts());
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  // Google Sheets Auto/Manual Sync States
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsSyncConfig | null>(() => loadSheetsSyncConfig());
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => getCurrentUser());
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
    time?: string;
  } | null>(null);

  // Modal Hubungkan / Buat Spreadsheet
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [sheetsModalTab, setSheetsModalTab] = useState<"create" | "existing">("create");
  const [newSheetTitle, setNewSheetTitle] = useState(
    `PAILMS - Rekap Nilai PAI (${sekolah.namaSekolah || "SMPN 2 Rebang Tangkas"}) - ${new Date().getFullYear()}`
  );
  const [existingSheetInput, setExistingSheetInput] = useState("");
  const [isConnectingSheet, setIsConnectingSheet] = useState(false);

  useEffect(() => {
    const unsubConfig = subscribeSheetsSyncConfig((cfg) => {
      setSheetsConfig(cfg);
    });
    const unsubAuth = subscribeAuth((u) => {
      setGoogleUser(u);
    });
    return () => {
      unsubConfig();
      unsubAuth();
    };
  }, []);

  // MANUAL SYNC HANDLER: Uploads all local data directly to Google Sheets without waiting for debounce/auto-sync
  const handleManualSync = async () => {
    if (!sheetsConfig || !sheetsConfig.spreadsheetId) {
      setIsSheetsModalOpen(true);
      return;
    }

    setIsSyncingSheets(true);
    setSyncFeedback(null);

    try {
      const activeRekap = (propRekapNilai && propRekapNilai.length > 0) ? propRekapNilai : DataService.getRekapNilai();
      const activeParalel = (propNilaiParalel && propNilaiParalel.length > 0) ? propNilaiParalel : DataService.getNilaiSemesterParalel();
      const activeStudents = (students && students.length > 0) ? students : DataService.getSiswa();
      const activeClasses = (classes && classes.length > 0) ? classes : DataService.getKelas();
      const schoolName = sekolah.namaSekolah || "UPT SMPN 2 Rebang Tangkas";

      const updatedCfg = await syncRekapAllToGoogleSheet(
        sheetsConfig,
        activeRekap,
        activeParalel,
        activeStudents,
        activeClasses,
        schoolName
      );

      setSheetsConfig(updatedCfg);
      const nowStr = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setSyncFeedback({
        type: "success",
        text: `Alhamdulillah! Data lokal berhasil diunggah langsung ke Google Sheets. Seluruh Buku Rekap Nilai (${activeRekap.length} data), Nilai Semester Paralel (${activeParalel.length} data), dan Data Siswa (${activeStudents.length} siswa) telah tersimpan aman di cloud Google Drive.`,
        time: nowStr
      });
    } catch (err: any) {
      setSyncFeedback({
        type: "error",
        text: err?.message || "Gagal mengunggah data lokal ke Google Sheets. Pastikan koneksi internet tersedia."
      });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleCreateNewSpreadsheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnectingSheet(true);
    try {
      const activeRekap = (propRekapNilai && propRekapNilai.length > 0) ? propRekapNilai : DataService.getRekapNilai();
      const activeParalel = (propNilaiParalel && propNilaiParalel.length > 0) ? propNilaiParalel : DataService.getNilaiSemesterParalel();
      const activeStudents = (students && students.length > 0) ? students : DataService.getSiswa();
      const activeClasses = (classes && classes.length > 0) ? classes : DataService.getKelas();
      const schoolName = sekolah.namaSekolah || "UPT SMPN 2 Rebang Tangkas";

      const title = newSheetTitle.trim() || `PAILMS - Rekap Nilai PAI - ${schoolName}`;
      const newCfg = await createNewRekapSpreadsheet(
        title,
        activeRekap,
        activeParalel,
        activeStudents,
        activeClasses,
        schoolName
      );
      setSheetsConfig(newCfg);
      setIsSheetsModalOpen(false);
      const nowStr = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setSyncFeedback({
        type: "success",
        text: `Spreadsheet Google baru "${newCfg.spreadsheetTitle}" berhasil dibuat dan seluruh data lokal langsung tersinkronisasi ke cloud!`,
        time: nowStr
      });
    } catch (err: any) {
      alert(err?.message || "Gagal membuat spreadsheet baru di Google Drive.");
    } finally {
      setIsConnectingSheet(false);
    }
  };

  const handleConnectExistingSpreadsheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingSheetInput.trim()) return;
    setIsConnectingSheet(true);
    try {
      const activeRekap = (propRekapNilai && propRekapNilai.length > 0) ? propRekapNilai : DataService.getRekapNilai();
      const activeParalel = (propNilaiParalel && propNilaiParalel.length > 0) ? propNilaiParalel : DataService.getNilaiSemesterParalel();
      const activeStudents = (students && students.length > 0) ? students : DataService.getSiswa();
      const activeClasses = (classes && classes.length > 0) ? classes : DataService.getKelas();
      const schoolName = sekolah.namaSekolah || "UPT SMPN 2 Rebang Tangkas";

      const cfg = await connectExistingRekapSpreadsheet(
        existingSheetInput.trim(),
        `Spreadsheet PAI (${schoolName})`
      );
      const syncedCfg = await syncRekapAllToGoogleSheet(
        cfg,
        activeRekap,
        activeParalel,
        activeStudents,
        activeClasses,
        schoolName
      );
      setSheetsConfig(syncedCfg);
      setIsSheetsModalOpen(false);
      setExistingSheetInput("");
      const nowStr = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setSyncFeedback({
        type: "success",
        text: `Spreadsheet Google berhasil terhubung dan seluruh data lokal langsung tersinkronkan ke dalamnya!`,
        time: nowStr
      });
    } catch (err: any) {
      alert(err?.message || "Gagal menghubungkan spreadsheet Google.");
    } finally {
      setIsConnectingSheet(false);
    }
  };

  const handleToggleAutoSync = () => {
    if (!sheetsConfig) return;
    const updated = {
      ...sheetsConfig,
      autoSync: !sheetsConfig.autoSync
    };
    saveSheetsSyncConfig(updated);
    setSheetsConfig(updated);
  };

  const handleCopyCurrentPassword = () => {
    navigator.clipboard.writeText(currentAcc.password);
    setCopiedCurrent(true);
    setTimeout(() => setCopiedCurrent(false), 2000);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanNewPass) {
      setStatusMessage({ type: "error", text: "Kata sandi baru tidak boleh kosong!" });
      return;
    }

    if (cleanNewPass.length < 3) {
      setStatusMessage({ type: "error", text: "Kata sandi baru minimal 3 karakter." });
      return;
    }

    if (cleanNewPass !== cleanConfirm) {
      setStatusMessage({ type: "error", text: "Konfirmasi kata sandi baru tidak cocok!" });
      return;
    }

    if (cleanNewPass === currentAcc.password) {
      setStatusMessage({ type: "error", text: "Kata sandi baru tidak boleh sama dengan kata sandi lama." });
      return;
    }

    // Upsert into accounts list
    const currentList = DataService.getAccounts();
    const targetRole = currentUser.role === "GURU" ? "guru" : "siswa";
    const existingIndex = currentList.findIndex(
      (a) => a.role === targetRole && a.identifier.trim().toLowerCase() === currentUser.identifier.trim().toLowerCase()
    );

    let updatedList: UserAccount[];
    if (existingIndex >= 0) {
      updatedList = currentList.map((a, idx) =>
        idx === existingIndex ? { ...a, password: cleanNewPass } : a
      );
    } else {
      updatedList = [
        ...currentList,
        {
          id: `acc-${targetRole}-${Date.now()}`,
          role: targetRole,
          identifier: currentUser.identifier,
          password: cleanNewPass,
          nama: currentUser.nama,
          registeredAt: new Date().toISOString()
        }
      ];
    }

    DataService.saveAccounts(updatedList);
    setAccounts(updatedList);
    setNewPassword("");
    setConfirmPassword("");
    setStatusMessage({
      type: "success",
      text: "Alhamdulillah! Kata sandi akun Anda berhasil diperbarui dan tersimpan."
    });

    if (onPasswordChanged) {
      onPasswordChanged(cleanNewPass);
    }

    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleToggleAccountPasswordVisibility = (accId: string) => {
    setVisibleAccountPasswords((prev) => ({
      ...prev,
      [accId]: !prev[accId]
    }));
  };

  const handleOpenEditTargetAccount = (acc: UserAccount) => {
    setEditingTargetAccount(acc);
    setTargetNewPassword(acc.password);
    setShowTargetNewPassword(false);
  };

  const handleSaveTargetAccountPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTargetAccount) return;
    const cleanPass = targetNewPassword.trim();
    if (!cleanPass || cleanPass.length < 3) {
      alert("Password minimal 3 karakter!");
      return;
    }

    const currentList = DataService.getAccounts();
    const updated = currentList.map((a) =>
      a.id === editingTargetAccount.id ||
      (a.role === editingTargetAccount.role && a.identifier.trim().toLowerCase() === editingTargetAccount.identifier.trim().toLowerCase())
        ? { ...a, password: cleanPass }
        : a
    );

    DataService.saveAccounts(updated);
    setAccounts(updated);
    setEditingTargetAccount(null);
    setStatusMessage({
      type: "success",
      text: `Password untuk akun ${editingTargetAccount.nama} (${editingTargetAccount.identifier}) berhasil diubah menjadi "${cleanPass}".`
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleCreateNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAccountIdentifier.trim() || !addAccountNama.trim()) {
      alert("Harap isi NIP/NISN dan Nama Akun!");
      return;
    }

    const newAcc: UserAccount = {
      id: `acc-${addAccountRole}-${Date.now()}`,
      role: addAccountRole,
      identifier: addAccountIdentifier.trim(),
      password: addAccountPassword.trim() || "123",
      nama: addAccountNama.trim(),
      kelasId: addAccountRole === "siswa" ? addAccountKelasId : undefined,
      registeredAt: new Date().toISOString()
    };

    DataService.addAccount(newAcc);
    refreshAccounts();
    setIsAddAccountModalOpen(false);
    setAddAccountIdentifier("");
    setAddAccountNama("");
    setAddAccountPassword("123");
    setStatusMessage({
      type: "success",
      text: `Akun baru "${newAcc.nama}" (${newAcc.identifier}) berhasil didaftarkan!`
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Filtered accounts list for Guru table
  const filteredAccounts = accounts.filter((acc) => {
    if (accountFilterRole === "GURU" && acc.role !== "guru") return false;
    if (accountFilterRole === "SISWA" && acc.role !== "siswa") return false;

    if (searchAccountQuery.trim()) {
      const q = searchAccountQuery.toLowerCase();
      const matchNama = acc.nama.toLowerCase().includes(q);
      const matchId = acc.identifier.toLowerCase().includes(q);
      const matchKelas = (acc.kelasId || "").toLowerCase().includes(q);
      return matchNama || matchId || matchKelas;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <Settings className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-400 text-slate-950 shadow-md">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
              Pengaturan Akun & Keamanan
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Informasi Akun, Password & Keamanan Sistem
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Halaman pengaturan kredensial akun pengguna sistem PAILMS {sekolah.namaSekolah || "UPT SMPN 2 Rebang Tangkas"}. Anda dapat memeriksa nama akun, melihat kata sandi saat ini, serta memperbarui password akun dengan aman.
          </p>
        </div>
      </div>

      {/* STATUS NOTIFICATION TOAST */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-slideDown border ${
            statusMessage.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-500/50"
              : "bg-red-950 text-red-100 border-red-500/50"
          }`}
        >
          <div className="flex items-center gap-3">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-bold">{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-300 hover:text-white text-xs font-bold px-2 py-1 rounded bg-black/20"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TOP GRID: CURRENT ACCOUNT INFO & CHANGE PASSWORD FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CARD 1: INFORMASI AKUN SAAT INI (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                {currentUser.role === "GURU" ? (
                  <GuruPhotoFrame size="md" name={currentUser.nama} showUploadTrigger={true} />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Nama Akun & Identitas</h3>
                  <p className="text-[11px] text-slate-500">Profil kredensial login aktif</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Aktif
              </span>
            </div>

            {/* Profil Box */}
            <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border border-slate-200/70 space-y-3">
              <div>
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Nama Akun / Nama Lengkap
                </span>
                <span className="block text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  {currentUser.nama}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {currentUser.role === "GURU" ? "NIP Guru" : "NISN Siswa"} (Username)
                  </span>
                  <span className="block text-xs font-extrabold text-emerald-800 font-mono mt-0.5">
                    {currentUser.identifier}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Peran Akun
                  </span>
                  <span className="block text-xs font-extrabold text-slate-800 mt-0.5">
                    {currentUser.role === "GURU" ? "Guru PAI & Budi Pekerti" : "Peserta Didik"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Satuan Pendidikan
                </span>
                <span className="block text-xs font-bold text-slate-700 mt-0.5">
                  {sekolah.namaSekolah || "UPT SMP Negeri 2 Rebang Tangkas"}
                </span>
              </div>
            </div>

            {/* Password Saat Ini Display */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Password Saat Ini:
                </span>
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-amber-300 shadow-2xs">
                <span className="font-mono text-sm font-black tracking-wider text-slate-900">
                  {showCurrentPassword ? currentAcc.password : "••••••••"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCurrentPassword}
                  className="p-1 text-slate-400 hover:text-amber-800 hover:bg-amber-100/60 rounded transition cursor-pointer"
                  title="Salin Password"
                >
                  {copiedCurrent ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-amber-800 font-medium">
                Gunakan NIP/NISN dan password di atas saat login ke portal LMS.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kredensial disimpan terenkripsi di penyimpanan lokal peramban.</span>
          </div>
        </div>

        {/* CARD 2: FORM GANTI PASSWORD (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Ganti Password Akun</h3>
              <p className="text-xs text-slate-500">Perbarui kata sandi untuk keamanan akses pembelajaran Anda</p>
            </div>
          </div>

          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            {/* Input Password Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Kata Sandi (Password) Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru Anda..."
                  className="w-full pl-3.5 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="block text-[10px] text-slate-400 mt-1">
                Minimal 3 karakter. Kombinasi huruf dan angka disarankan.
              </span>
            </div>

            {/* Input Konfirmasi Password Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full pl-3.5 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <div className="mt-1.5">
                  {newPassword === confirmPassword ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi kata sandi cocok.
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Konfirmasi kata sandi belum sama!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Tips Keamanan */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="block font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Ketentuan & Tips Password:
              </span>
              <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-0.5">
                <li>Password akan langsung berlaku saat disimpan untuk login selanjutnya.</li>
                <li>Pastikan mencatat kata sandi baru agar tidak kesulitan saat masuk kembali.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                id="btn-simpan-password-baru"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>Simpan Password Baru</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: CADANGAN CLOUD & SINKRONISASI GOOGLE SHEETS (KHUSUS GURU) */}
      {currentUser.role === "GURU" && (
        <div className="bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-5 pointer-events-none">
            <FileSpreadsheet className="w-56 h-56 text-emerald-600" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-md shadow-emerald-800/20">
                <CloudUpload className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Cadangan Cloud & Sinkronisasi Manual Google Sheets
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                    <Cloud className="w-3 h-3 text-emerald-700" />
                    Cloud Backup
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unggah langsung data lokal ke Google Sheets tanpa menunggu trigger otomatis untuk memastikan data selalu aman di cloud.
                </p>
              </div>
            </div>

            {/* Connection Status Pill */}
            <div className="flex items-center gap-2 shrink-0">
              {sheetsConfig?.spreadsheetId ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Tersambung ke Cloud</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Belum Terhubung</span>
                </div>
              )}
            </div>
          </div>

          {/* Sync Feedback Toast / Alert inside Card */}
          {syncFeedback && (
            <div
              className={`p-4 rounded-2xl shadow-sm flex items-start justify-between gap-3 animate-slideDown border ${
                syncFeedback.type === "success"
                  ? "bg-emerald-900 text-emerald-100 border-emerald-500/50"
                  : "bg-red-950 text-red-100 border-red-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                {syncFeedback.type === "success" ? (
                  <CheckCheck className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">{syncFeedback.text}</p>
                  {syncFeedback.time && (
                    <span className="text-[11px] text-emerald-300 font-mono mt-0.5 block">
                      Waktu eksekusi sinkronisasi: {syncFeedback.time} WIB
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSyncFeedback(null)}
                className="text-slate-300 hover:text-white text-xs font-bold px-2 py-1 rounded bg-black/20"
              >
                ✕
              </button>
            </div>
          )}

          {/* Details & Action Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Info Grid (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Spreadsheet Google Terhubung
                  </span>
                  <p className="font-extrabold text-slate-900 truncate" title={sheetsConfig?.spreadsheetTitle || "Belum ada"}>
                    {sheetsConfig?.spreadsheetTitle || "Belum terhubung ke spreadsheet"}
                  </p>
                  {sheetsConfig?.spreadsheetUrl && (
                    <a
                      href={sheetsConfig.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Dokumen di Google Sheets ↗</span>
                    </a>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Waktu Terakhir Sinkron
                  </span>
                  <p className="font-mono font-extrabold text-emerald-800">
                    {sheetsConfig?.lastSyncedAt ? `${sheetsConfig.lastSyncedAt} WIB` : "Belum pernah disinkron"}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    Status: <strong className="text-slate-800">{sheetsConfig?.syncStatus === "syncing" ? "Sedang Mengunggah..." : "Tersinkron (Ready)"}</strong>
                  </span>
                </div>
              </div>

              {/* Data Summary Stats */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/70 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-slate-800">Cakupan Data Cadangan Cloud:</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-emerald-900">
                  <span>Rekap Nilai PAI</span>
                  <span>•</span>
                  <span>Semester Paralel</span>
                  <span>•</span>
                  <span>Data Siswa</span>
                </div>
              </div>

              {/* Mode Auto-sync toggle */}
              {sheetsConfig?.spreadsheetId && (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Sinkronisasi Otomatis di Latar Belakang</span>
                    <p className="text-[11px] text-slate-500">Memicu unggahan otomatis saat nilai atau data siswa diedit</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAutoSync}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      sheetsConfig.autoSync
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-slate-100 text-slate-600 border-slate-300"
                    }`}
                  >
                    {sheetsConfig.autoSync ? "Aktif" : "Non-aktif (Hanya Manual)"}
                  </button>
                </div>
              )}
            </div>

            {/* Actions Grid (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                  Aksi Unggah & Cadangkan
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Klik tombol di bawah ini untuk langsung mengunggah dan menimpa cloud dengan data lokal saat ini secara instan tanpa menunggu otomatis.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncingSheets}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                  id="btn-sinkronisasi-manual"
                >
                  <CloudUpload className={`w-5 h-5 text-amber-300 ${isSyncingSheets ? "animate-bounce" : ""}`} />
                  <span>{isSyncingSheets ? "Mengunggah Data ke Google Sheets..." : "Sinkronisasi Manual"}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSheetsModalOpen(true)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{sheetsConfig?.spreadsheetId ? "Atur Spreadsheet" : "Sambungkan Sheet"}</span>
                  </button>

                  {onOpenGoogleSheets && (
                    <button
                      type="button"
                      onClick={onOpenGoogleSheets}
                      className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-emerald-200 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hub Sheets Lengkap ↗</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DAFTAR AKUN PENGGUNA TERDAFTAR (KHUSUS GURU) */}
      {currentUser.role === "GURU" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  Daftar Akun Pengguna Terdaftar (Guru & Siswa)
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-black">
                    {accounts.length} Akun
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Data kredensial akun pengguna sistem untuk keperluan bimbingan dan bantuan lupa password
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Akun</span>
              </button>
              <button
                type="button"
                onClick={refreshAccounts}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition cursor-pointer"
                title="Muat Ulang Akun"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchAccountQuery}
                onChange={(e) => setSearchAccountQuery(e.target.value)}
                placeholder="Cari berdasarkan nama akun, NIP, atau NISN..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAccountFilterRole("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  accountFilterRole === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({accounts.length})
              </button>
              <button
                type="button"
                onClick={() => setAccountFilterRole("GURU")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  accountFilterRole === "GURU" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Guru ({accounts.filter((a) => a.role === "guru").length})
              </button>
              <button
                type="button"
                onClick={() => setAccountFilterRole("SISWA")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  accountFilterRole === "SISWA" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Siswa ({accounts.filter((a) => a.role === "siswa").length})
              </button>
            </div>
          </div>

          {/* Table of Accounts */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Akun & Peran</th>
                  <th className="py-3 px-4">Username Login (NIP/NISN)</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Password Saat Ini</th>
                  <th className="py-3 px-4 text-center">Aksi Ganti Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Tidak ada akun pengguna yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc, idx) => {
                    const isPassVisible = visibleAccountPasswords[acc.id];
                    const isSelf =
                      acc.role === (currentUser.role === "GURU" ? "guru" : "siswa") &&
                      acc.identifier.trim().toLowerCase() === currentUser.identifier.trim().toLowerCase();

                    return (
                      <tr key={acc.id || idx} className={`hover:bg-slate-50/70 ${isSelf ? "bg-emerald-50/40" : ""}`}>
                        <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{acc.nama}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded mt-0.5 ${
                              acc.role === "guru"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-blue-100 text-blue-900"
                            }`}
                          >
                            {acc.role === "guru" ? "Guru PAI" : "Peserta Didik"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {acc.identifier}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {acc.kelasId || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200/80">
                              {isPassVisible ? acc.password : "••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleAccountPasswordVisibility(acc.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                              title={isPassVisible ? "Sembunyikan Password" : "Lihat Password"}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditTargetAccount(acc)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-bold rounded-lg transition inline-flex items-center gap-1.5 border border-slate-200/80 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>Ganti Password</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL GANTI PASSWORD AKUN TERTENTU (GURU VIEW) */}
      {editingTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-extrabold text-slate-900">Ubah Password Akun Pengguna</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingTargetAccount(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Nama Akun & Username:</span>
              <p className="font-extrabold text-slate-900">{editingTargetAccount.nama}</p>
              <p className="font-mono text-emerald-800 font-bold">{editingTargetAccount.identifier} ({editingTargetAccount.role.toUpperCase()})</p>
            </div>

            <form onSubmit={handleSaveTargetAccountPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Baru Akun Ini
                </label>
                <div className="relative">
                  <input
                    type={showTargetNewPassword ? "text" : "password"}
                    value={targetNewPassword}
                    onChange={(e) => setTargetNewPassword(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowTargetNewPassword(!showTargetNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showTargetNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTargetAccount(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH AKUN BARU */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-extrabold text-slate-900">Tambah Akun Pengguna Baru</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Peran Akun</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddAccountRole("siswa")}
                    className={`py-2 text-center rounded-xl font-bold border transition cursor-pointer ${
                      addAccountRole === "siswa"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    Peserta Didik (Siswa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddAccountRole("guru")}
                    className={`py-2 text-center rounded-xl font-bold border transition cursor-pointer ${
                      addAccountRole === "guru"
                        ? "bg-amber-50 border-amber-600 text-amber-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    Guru PAI
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {addAccountRole === "guru" ? "NIP Guru (Username Login)" : "NISN Siswa (Username Login)"}
                </label>
                <input
                  type="text"
                  value={addAccountIdentifier}
                  onChange={(e) => setAddAccountIdentifier(e.target.value)}
                  placeholder={addAccountRole === "guru" ? "1980xxxx..." : "009xxxx..."}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Akun</label>
                <input
                  type="text"
                  value={addAccountNama}
                  onChange={(e) => setAddAccountNama(e.target.value)}
                  placeholder="Nama akun pengguna..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              {addAccountRole === "siswa" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Siswa</label>
                  <select
                    value={addAccountKelasId}
                    onChange={(e) => setAddAccountKelasId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password Awal Akun</label>
                <input
                  type="text"
                  value={addAccountPassword}
                  onChange={(e) => setAddAccountPassword(e.target.value)}
                  placeholder="123"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  required
                />
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Default kata sandi sistem awal: 123
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-black shadow-md cursor-pointer"
                >
                  Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HUBUNGKAN / BUAT SPREADSHEET GOOGLE BARU */}
      {isSheetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-extrabold text-slate-900">Pengaturan Cloud Google Sheets</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs: Buat Baru vs Gunakan Spreadsheet Ada */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSheetsModalTab("create")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  sheetsModalTab === "create" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600"
                }`}
              >
                Buat Spreadsheet Baru
              </button>
              <button
                type="button"
                onClick={() => setSheetsModalTab("existing")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  sheetsModalTab === "existing" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600"
                }`}
              >
                Tautkan Spreadsheet yang Ada
              </button>
            </div>

            {sheetsModalTab === "create" ? (
              <form onSubmit={handleCreateNewSpreadsheet} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Spreadsheet Baru di Google Drive:
                  </label>
                  <input
                    type="text"
                    value={newSheetTitle}
                    onChange={(e) => setNewSheetTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
                    required
                  />
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Spreadsheet akan otomatis dibuat dan seluruh data nilai lokal langsung disinkronkan ke dalamnya.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSheetsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isConnectingSheet}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-black shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isConnectingSheet ? "Membuat Spreadsheet..." : "Buat & Sinkronkan Sekarang"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConnectExistingSpreadsheet} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL atau ID Spreadsheet Google yang Ada:
                  </label>
                  <input
                    type="text"
                    value={existingSheetInput}
                    onChange={(e) => setExistingSheetInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit"
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Salin tautan dari address bar browser saat membuka Google Sheets Anda.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSheetsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isConnectingSheet}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-black shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>{isConnectingSheet ? "Menghubungkan..." : "Hubungkan & Sinkronkan"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
