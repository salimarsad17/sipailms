/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Lock,
  MessageSquare,
  School,
  IdCard,
  Printer,
  Calendar,
  Phone,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Siswa, DataSekolah, UserAccount } from "../../types";
import { DataService } from "../../data/initialData";

interface AkunSiswaViewProps {
  siswa: Siswa;
  sekolah: DataSekolah;
  onNavigateToPesan: () => void;
  onNavigateToDashboard?: () => void;
}

export default function AkunSiswaView({
  siswa,
  sekolah,
  onNavigateToPesan,
  onNavigateToDashboard
}: AkunSiswaViewProps) {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => DataService.getAccounts());
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedNisn, setCopiedNisn] = useState(false);

  useEffect(() => {
    setAccounts(DataService.getAccounts());
  }, []);

  // Find this student's account
  const studentAccount = accounts.find(
    (a) =>
      a.role === "siswa" &&
      a.identifier.trim().toLowerCase() === siswa.nisn.trim().toLowerCase()
  ) || {
    id: `acc-siswa-${siswa.nisn}`,
    role: "siswa" as const,
    identifier: siswa.nisn,
    password: "123",
    nama: siswa.nama,
    kelasId: siswa.kelasId,
    gender: siswa.gender,
    kontak: siswa.kontakOrangTua,
    registeredAt: "2026-01-01T00:00:00.000Z"
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(studentAccount.password);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleCopyNisn = () => {
    navigator.clipboard.writeText(siswa.nisn);
    setCopiedNisn(true);
    setTimeout(() => setCopiedNisn(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-emerald-800/40 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-2 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/30 shrink-0">
              <IdCard className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Akun Resmi Siswa
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  SIPAILMS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Informasi & Kredensial Akun Siswa
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                Tampilan data akun pembelajaran PAI Anda. Untuk keamanan, hak akses pergantian dan reset kata sandi hanya dimiliki oleh Akun Guru PAI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrintCard}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-emerald-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Kartu Akun</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToPesan}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md border border-amber-300 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi Guru PAI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Account Info + Password Security Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Data Akun Siswa Lengkap (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-200">
                  {siswa.nama.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {siswa.nama}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Kelas {siswa.kelasId} • {siswa.gender}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Akun Aktif</span>
              </div>
            </div>

            {/* Profile Grid Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nama Lengkap
                </span>
                <p className="text-sm font-extrabold text-slate-900">{siswa.nama}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    NISN (Username Login)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNisn}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedNisn ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNisn ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
                <p className="text-sm font-black font-mono text-emerald-800">{siswa.nisn}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rombel / Kelas Belajar
                </span>
                <p className="text-sm font-extrabold text-slate-800">Kelas {siswa.kelasId}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Agama
                </span>
                <p className="text-sm font-extrabold text-slate-800">{siswa.agama || "Islam"}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Jenis Kelamin
                </span>
                <p className="text-sm font-extrabold text-slate-800">{siswa.gender}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kontak Siswa / Orang Tua
                </span>
                <p className="text-sm font-extrabold text-slate-800 font-mono">
                  {siswa.kontakOrangTua || studentAccount.kontak || "-"}
                </p>
              </div>
            </div>

            {/* School affiliation */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <School className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Satuan Pendidikan Terdaftar
                </span>
                <p className="font-extrabold text-slate-900">
                  {sekolah.namaSekolah || "UPT SMP Negeri 2 Rebang Tangkas"}
                </p>
                <p className="text-slate-500 text-[11px]">
                  NPSN: {sekolah.npsn || "10806497"} • Akreditasi: {sekolah.akreditasi || "A"} • {sekolah.alamat || "Rebang Tangkas, Way Kanan"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Kredensial Password & Kebijakan Reset Password Guru (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Kredensial login portal siswa</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600">
                Tersimpan
              </span>
            </div>

            {/* Current Password Field */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Password Saat Ini:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Sandi</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-3 rounded-xl border border-amber-300 shadow-2xs">
                <span className="font-mono text-base font-black tracking-wider text-slate-900">
                  {showPassword ? studentAccount.password : "••••••••"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-amber-900 hover:bg-amber-100/60 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  title="Salin Password"
                >
                  {copiedPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[11px]">Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-amber-800 font-medium">
                Gunakan NISN <strong>{siswa.nisn}</strong> dan kata sandi di atas saat masuk kembali ke aplikasi SIPAILMS.
              </p>
            </div>

            {/* KEBIJAKAN KHUSUS: RESET PASSWORD HANYA PADA AKUN GURU */}
            <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200/90 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-red-950 uppercase tracking-wide">
                    Kebijakan Keamanan: Reset Kata Sandi Khusus Akun Guru
                  </h4>
                  <p className="text-[11px] text-red-900/90 mt-1 leading-relaxed">
                    Sesuai dengan ketentuan sistem SIPAILMS, <strong>fitur reset dan pergantian kata sandi akun siswa hanya dapat dilakukan melalui Akun Guru PAI</strong>. Siswa tidak diizinkan mengubah kata sandi sendiri untuk mencegah lupa akses dan menjaga ketertiban data penilaian.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-red-200/70">
                <button
                  type="button"
                  onClick={onNavigateToPesan}
                  className="w-full py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>Minta Guru Reset Password</span>
                </button>
              </div>
            </div>

            {/* Info Hint */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simpan baik-baik NISN dan kata sandi Anda dan jangan berikan kepada orang lain.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
