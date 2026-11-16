/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Database,
  Sun,
  Moon,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { cbtSupabaseService, SchemaDiagnostics } from "../../services/cbtSupabaseService";

interface CbtAuthViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAuthenticated: () => void;
  onBackToPailms?: () => void;
  schemaStatus: SchemaDiagnostics | null;
  onOpenSetupGuide: () => void;
}

export default function CbtAuthView({
  darkMode,
  onToggleDarkMode,
  onAuthenticated,
  onBackToPailms,
  schemaStatus,
  onOpenSetupGuide,
}: CbtAuthViewProps) {
  const [roleTab, setRoleTab] = useState<"guru" | "siswa">("guru");
  const [mode, setMode] = useState<"login" | "register_guru">("login");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [regName, setRegName] = useState("");
  const [regNip, setRegNip] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!identifier.trim() || !password.trim()) {
      setError("Username/Email dan kata sandi wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await cbtSupabaseService.signIn(identifier.trim(), password);
      onAuthenticated();
    } catch (err: any) {
      setError(err?.message || "Gagal masuk. Periksa kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!regName.trim() || !regEmail.trim() || regPassword.length < 6) {
      setError("Nama lengkap, email/username, dan kata sandi minimal 6 karakter wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await cbtSupabaseService.registerGuru({
        emailOrUsername: regEmail.trim(),
        password: regPassword,
        fullName: regName.trim(),
        nip: regNip.trim(),
      });
      if (res.session) {
        onAuthenticated();
      } else {
        setNotice(
          "Akun Guru berhasil didaftarkan. Silakan verifikasi email Anda atau masuk jika konfirmasi email dinonaktifkan di Supabase."
        );
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.message || "Gagal mendaftarkan akun Guru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060F24] text-slate-900 dark:text-slate-100 cbt-transition">
      {/* Top Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B1B3B]/95 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1B3B] dark:bg-sky-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-display font-extrabold text-base shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[#0B1B3B] dark:text-white">
                CBT PAI SMART
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30">
                PAI SMP VII–IX
              </span>
            </div>
            <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
              UPT SMPN 2 Rebang Tangkas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToPailms && (
            <button
              type="button"
              onClick={onBackToPailms}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer cbt-transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke PAILMS</span>
            </button>
          )}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer cbt-transition"
            title={darkMode ? "Mode Terang" : "Mode Gelap"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Running Text Banner */}
      <div className="bg-[#0B1B3B] dark:bg-[#040B1A] border-b border-sky-500/30 text-white overflow-hidden py-1.5">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-semibold tracking-wide">
          <span className="text-amber-400 font-bold">★ Guru Kreatif, Siswa Aktif</span>
          <span className="text-sky-200">Computer Based Test Pendidikan Agama Islam • UPT SMPN 2 Rebang Tangkas</span>
          <span className="text-amber-400 font-bold">★ Guru Kreatif, Siswa Aktif</span>
          <span className="text-sky-200">Jujur dalam Ujian, Unggul dalam Prestasi • Kelas VII, VIII & IX</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1B3B]">
          {/* Left Navy Hero Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#071229] via-[#0B1B3B] to-[#0F2D5E] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Pendidikan Agama Islam</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  CBT PAI <span className="text-amber-400">SMART</span>
                </h2>
                <p className="text-sm text-sky-100/90 leading-relaxed">
                  Platform ujian berbasis komputer yang aman, responsif, dan terintegrasi langsung dengan Supabase Auth, PostgreSQL, Storage, serta penilaian otomatis.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-200">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-amber-300 mb-0.5">6 Tipe Soal Lengkap</div>
                  <div className="text-slate-300">Pilihan Ganda A–E, PG Kompleks, Benar/Salah, Menjodohkan, Isian Singkat, & Esai dengan Ayat Al-Qur'an RTL.</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-sky-300 mb-0.5">Anti-Kebocoran Kunci Jawaban</div>
                  <div className="text-slate-300">Kunci soal dijaga oleh Row Level Security (RLS) & dikoreksi aman lewat Supabase Edge Functions.</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span>UPT SMPN 2 Rebang Tangkas</span>
              <span className="text-amber-300 font-semibold">Kelas VII • VIII • IX</span>
            </div>
          </div>

          {/* Right Auth Panel */}
          <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between bg-white dark:bg-[#0B1B3B]">
            <div className="space-y-5">
              {/* Schema Setup Warning if needed */}
              {schemaStatus && !schemaStatus.ready && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900 dark:text-amber-200">
                        Skema 12 Tabel CBT Belum Dipasang di Supabase
                      </p>
                      <p className="text-amber-800 dark:text-amber-300/90 mt-0.5">
                        Tabel belum ditemukan: {schemaStatus.missingTables.slice(0, 4).join(", ")}
                        {schemaStatus.missingTables.length > 4 ? ` (+${schemaStatus.missingTables.length - 4} lainnya)` : ""}.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSetupGuide}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 cursor-pointer"
                  >
                    Panduan SQL
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#0B1B3B] dark:text-white">
                    {mode === "login" ? "Masuk Portal CBT PAI" : "Registrasi Guru Pengampu"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Autentikasi aman menggunakan Supabase Auth (tanpa password teks biasa).
                  </p>
                </div>

                {mode === "login" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register_guru");
                      setError("");
                    }}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar Akun Guru</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Kembali ke Login</span>
                  </button>
                )}
              </div>

              {mode === "login" && (
                <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleTab("guru");
                      setError("");
                    }}
                    className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer cbt-transition ${
                      roleTab === "guru"
                        ? "bg-[#0B1B3B] dark:bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Login Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoleTab("siswa");
                      setError("");
                    }}
                    className={`py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer cbt-transition ${
                      roleTab === "siswa"
                        ? "bg-[#0B1B3B] dark:bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>Login Siswa</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {notice && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{notice}</span>
                </div>
              )}

              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {roleTab === "guru" ? "Email / Username Guru" : "Username (NISN) / Email Siswa"}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          roleTab === "guru"
                            ? "contoh: guru@smpn2rt.sch.id atau username"
                            : "contoh: 0098765432 atau email siswa"
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi akun"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0B1B3B] to-[#13316B] hover:from-[#102756] hover:to-[#183E85] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 border border-amber-400/40 cursor-pointer disabled:opacity-60 cbt-transition"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>{loading ? "Memverifikasi..." : roleTab === "guru" ? "Masuk Dashboard Guru" : "Masuk Ruang Ujian Siswa"}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterGuru} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Lengkap & Gelar *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nama Guru PAI"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        NIP (Opsional)
                      </label>
                      <input
                        type="text"
                        value={regNip}
                        onChange={(e) => setRegNip(e.target.value)}
                        placeholder="Nomor Induk Pegawai"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email atau Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contoh: sadiqul.alim@smpn2rt.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kata Sandi (Minimal 6 Karakter) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md cursor-pointer disabled:opacity-60 cbt-transition"
                  >
                    {loading ? "Mendaftarkan Akun..." : "Buat Akun Guru di Supabase"}
                  </button>
                </form>
              )}
            </div>

            <div className="pt-5 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Akun siswa dibuat oleh Guru pada menu Manajemen Data.</span>
              <button
                type="button"
                onClick={onOpenSetupGuide}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                Lihat SQL & Panduan Supabase
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
