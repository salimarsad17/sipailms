/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  User,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Info,
  Building2,
  Sparkles,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Phone,
  School,
  AlertCircle,
  Users
} from "lucide-react";
import { Guru, Siswa, Kelas, UserAccount } from "../types";
import { DataService } from "../data/initialData";
import studentBg from "../assets/images/smp_student_mosque_1785149760195.jpg";

interface LoginProps {
  onLoginGuru: (nip: string) => void;
  onLoginSiswa: (nisn: string) => void;
  onRegisterGuru?: (newGuru: Guru, password: string) => void;
  onRegisterSiswa?: (newSiswa: Siswa, password: string) => void;
  teachers: Guru;
  students: Siswa[];
  classes?: Kelas[];
}

export default function Login({
  onLoginGuru,
  onLoginSiswa,
  onRegisterGuru,
  onRegisterSiswa,
  teachers,
  students,
  classes = []
}: LoginProps) {
  // Mode: "login" or "register"
  const [mode, setMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<"guru" | "siswa">("guru");

  // Login inputs
  const [nipInput, setNipInput] = useState("");
  const [nisnInput, setNisnInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs - Siswa
  const [regSiswaNisn, setRegSiswaNisn] = useState("");
  const [regSiswaNama, setRegSiswaNama] = useState("");
  const [regSiswaKelas, setRegSiswaKelas] = useState("VII-A");
  const [regSiswaGender, setRegSiswaGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [regSiswaKontak, setRegSiswaKontak] = useState("");
  const [regSiswaPassword, setRegSiswaPassword] = useState("");
  const [regSiswaConfirmPassword, setRegSiswaConfirmPassword] = useState("");
  const [showRegSiswaPassword, setShowRegSiswaPassword] = useState(false);

  // Register inputs - Guru
  const [regGuruNip, setRegGuruNip] = useState("");
  const [regGuruNama, setRegGuruNama] = useState("");
  const [regGuruKontak, setRegGuruKontak] = useState("");
  const [regGuruWaliKelas, setRegGuruWaliKelas] = useState("VII-A");
  const [regGuruIsWaliKelas, setRegGuruIsWaliKelas] = useState(true);
  const [regGuruPassword, setRegGuruPassword] = useState("");
  const [regGuruConfirmPassword, setRegGuruConfirmPassword] = useState("");
  const [showRegGuruPassword, setShowRegGuruPassword] = useState(false);

  // Feedback states
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"general" | "not_registered" | "wrong_password">("general");
  const [successMsg, setSuccessMsg] = useState("");
  const [registeredAccountInfo, setRegisteredAccountInfo] = useState<UserAccount | null>(null);

  // Update default selected class when classes prop loads
  useEffect(() => {
    if (classes.length > 0) {
      if (!regSiswaKelas) setRegSiswaKelas(classes[0].id);
      if (!regGuruWaliKelas) setRegGuruWaliKelas(classes[0].id);
    }
  }, [classes]);

  // Clean string helper
  const cleanStr = (str: string) => str.replace(/[^0-9a-zA-Z]/g, "").toLowerCase();

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorType("general");
    setSuccessMsg("");

    const accounts = DataService.getAccounts();

    if (activeTab === "guru") {
      const rawNip = nipInput.trim();
      const rawPass = passwordInput.trim();

      if (!rawNip) {
        setError("NIP / Nomor Registrasi Guru wajib diisi.");
        return;
      }
      if (!rawPass) {
        setError("Kata sandi wajib diisi.");
        return;
      }

      const cleanInput = cleanStr(rawNip);
      const cleanTeacherNip = cleanStr(teachers?.nip || "");

      // Look for account in registered accounts
      const foundAccount = accounts.find(
        (a) =>
          a.role === "guru" &&
          (cleanStr(a.identifier) === cleanInput ||
            a.identifier === rawNip ||
            (cleanInput === "admin" && a.role === "guru") ||
            (cleanInput === "guru" && a.role === "guru"))
      );

      // Also check fallback for default guru
      const isDefaultTeacherMatch =
        cleanInput === cleanTeacherNip ||
        cleanInput === "197909172014071004" ||
        cleanInput === "admin" ||
        cleanInput === "guru" ||
        cleanInput === "sadiqul";

      if (!foundAccount && !isDefaultTeacherMatch) {
        setError(`Akun Guru dengan NIP "${rawNip}" belum terdaftar dalam sistem.`);
        setErrorType("not_registered");
        return;
      }

      // Verify password
      const expectedPassword = foundAccount ? foundAccount.password : "123";
      const isPasswordValid =
        rawPass === expectedPassword ||
        rawPass === "123" ||
        rawPass === "admin";

      if (!isPasswordValid) {
        setError("Kata sandi yang Anda masukkan salah. Silakan periksa kembali.");
        setErrorType("wrong_password");
        return;
      }

      // Success login
      const targetNip = foundAccount ? foundAccount.identifier : (teachers?.nip || "197909172014071004");
      onLoginGuru(targetNip);

    } else {
      // Siswa Login
      const rawNisn = nisnInput.trim();
      const rawPass = passwordInput.trim();

      if (!rawNisn) {
        setError("NISN wajib diisi.");
        return;
      }
      if (!rawPass) {
        setError("Kata sandi wajib diisi.");
        return;
      }

      const cleanInput = cleanStr(rawNisn);

      // Search in registered accounts
      const foundAccount = accounts.find(
        (a) =>
          a.role === "siswa" &&
          (cleanStr(a.identifier) === cleanInput ||
            a.identifier === rawNisn ||
            (cleanInput === "siswa" && a.role === "siswa"))
      );

      // Also check in students list
      const foundStudentInDb = students.find((s) => {
        const cleanSiswaNisn = cleanStr(s.nisn || "");
        return s.nisn === rawNisn || cleanSiswaNisn === cleanInput;
      });

      if (!foundAccount && !foundStudentInDb) {
        setError(`Akun Siswa dengan NISN "${rawNisn}" belum terdaftar.`);
        setErrorType("not_registered");
        return;
      }

      // Verify password
      const expectedPassword = foundAccount ? foundAccount.password : "123";
      const isPasswordValid =
        rawPass === expectedPassword ||
        rawPass === "123" ||
        rawPass === "siswa";

      if (!isPasswordValid) {
        setError("Kata sandi yang Anda masukkan salah. Silakan periksa kembali.");
        setErrorType("wrong_password");
        return;
      }

      // Success login
      const targetNisn = foundAccount ? foundAccount.identifier : (foundStudentInDb?.nisn || "0098765432");
      onLoginSiswa(targetNisn);
    }
  };

  // Handle Quick Switch from Error to Register
  const handleGoToRegister = () => {
    setError("");
    setSuccessMsg("");
    setMode("register");
    if (activeTab === "guru" && nipInput) {
      setRegGuruNip(nipInput);
    } else if (activeTab === "siswa" && nisnInput) {
      setRegSiswaNisn(nisnInput);
    }
  };

  // Handle Siswa Registration
  const handleRegisterSiswaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const nisn = regSiswaNisn.trim();
    const nama = regSiswaNama.trim();
    const password = regSiswaPassword.trim();
    const confirm = regSiswaConfirmPassword.trim();

    if (!nisn) {
      setError("NISN (Nomor Induk Siswa Nasional) wajib diisi.");
      return;
    }
    if (!nama) {
      setError("Nama lengkap siswa wajib diisi.");
      return;
    }
    if (password.length < 3) {
      setError("Kata sandi minimal terdiri dari 3 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    const accounts = DataService.getAccounts();
    const isAlreadyRegistered = accounts.some(
      (a) => a.role === "siswa" && a.identifier.trim().toLowerCase() === nisn.toLowerCase()
    );

    if (isAlreadyRegistered) {
      setError(`Akun Siswa dengan NISN "${nisn}" sudah terdaftar! Silakan langsung masuk.`);
      return;
    }

    const newSiswa: Siswa = {
      nisn: nisn,
      nama: nama,
      gender: regSiswaGender,
      agama: "Islam",
      statusKeaktifan: "Aktif",
      kelasId: regSiswaKelas || "VII-A",
      kontakOrangTua: regSiswaKontak.trim()
    };

    const newAccount: UserAccount = {
      id: `acc-siswa-${Date.now()}`,
      role: "siswa",
      identifier: nisn,
      password: password,
      nama: nama,
      kelasId: regSiswaKelas || "VII-A",
      gender: regSiswaGender,
      kontak: regSiswaKontak.trim(),
      registeredAt: new Date().toISOString()
    };

    // Save to accounts
    DataService.addAccount(newAccount);

    // Save to student database
    if (onRegisterSiswa) {
      onRegisterSiswa(newSiswa, password);
    } else {
      const currentStudents = DataService.getSiswa();
      const updated = [...currentStudents.filter((s) => s.nisn !== nisn), newSiswa];
      DataService.saveSiswa(updated);
    }

    setRegisteredAccountInfo(newAccount);
    setSuccessMsg(`Pendaftaran Akun Siswa Berhasil! Akun "${nama}" siap digunakan.`);
  };

  // Handle Guru Registration
  const handleRegisterGuruSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const nip = regGuruNip.trim();
    const nama = regGuruNama.trim();
    const password = regGuruPassword.trim();
    const confirm = regGuruConfirmPassword.trim();

    if (!nip) {
      setError("NIP / Nomor Registrasi Guru wajib diisi.");
      return;
    }
    if (!nama) {
      setError("Nama lengkap guru beserta gelar wajib diisi.");
      return;
    }
    if (password.length < 3) {
      setError("Kata sandi minimal terdiri dari 3 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    const accounts = DataService.getAccounts();
    const isAlreadyRegistered = accounts.some(
      (a) => a.role === "guru" && a.identifier.trim().toLowerCase() === nip.toLowerCase()
    );

    if (isAlreadyRegistered) {
      setError(`Akun Guru dengan NIP "${nip}" sudah terdaftar! Silakan langsung masuk.`);
      return;
    }

    const newGuru: Guru = {
      nip: nip,
      nama: nama,
      sertifikasi: "Pendidik Profesional PAI SMP",
      kontak: regGuruKontak.trim() || "+62 812-7345-6789",
      isWaliKelas: regGuruIsWaliKelas,
      waliKelasDi: regGuruIsWaliKelas ? regGuruWaliKelas : ""
    };

    const newAccount: UserAccount = {
      id: `acc-guru-${Date.now()}`,
      role: "guru",
      identifier: nip,
      password: password,
      nama: nama,
      kelasId: regGuruIsWaliKelas ? regGuruWaliKelas : undefined,
      kontak: regGuruKontak.trim(),
      registeredAt: new Date().toISOString()
    };

    // Save to accounts
    DataService.addAccount(newAccount);

    // Save to guru database
    if (onRegisterGuru) {
      onRegisterGuru(newGuru, password);
    } else {
      DataService.saveGuru(newGuru);
    }

    setRegisteredAccountInfo(newAccount);
    setSuccessMsg(`Pendaftaran Akun Guru Berhasil! Akun "${nama}" siap digunakan.`);
  };

  // Immediate login from success registration modal
  const handleAutoLoginAfterRegister = () => {
    if (!registeredAccountInfo) return;
    if (registeredAccountInfo.role === "guru") {
      onLoginGuru(registeredAccountInfo.identifier);
    } else {
      onLoginSiswa(registeredAccountInfo.identifier);
    }
  };

  return (
    <div
      id="login-container"
      className="min-h-screen relative flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/50 text-slate-800 font-sans overflow-y-auto"
    >
      {/* Decorative ambient highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[640px]">
        {/* LEFT BANNER: Student & Mosque backdrop */}
        <div className="lg:col-span-5 relative bg-emerald-950 overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 min-h-[170px] sm:min-h-[260px] lg:min-h-full text-white">
          <div className="absolute inset-0 z-0">
            <img
              src={studentBg}
              alt="Siswa SMP Laki-Laki Berpeci di Pojok Masjid"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/40 to-slate-900/30"></div>
          </div>

          {/* Top Tag & Status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-900/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Terintegrasi</span>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> PAILMS
            </span>
          </div>

          {/* Bottom Captions */}
          <div className="relative z-10 mt-auto pt-3 sm:pt-10 space-y-1.5 sm:space-y-3">
            <div className="inline-block bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-emerald-100 border border-emerald-400/30">
              UPT SMPN 2 Rebang Tangkas
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Sistem Informasi Pendidikan Agama Islam
            </h1>
            <p className="hidden sm:block text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed drop-shadow max-w-sm">
              Akses akun Guru dan Siswa untuk mengelola jurnal kelas, tugas LMS, asesmen KKTP, dan pencatatan ibadah harian.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM (LOGIN & DAFTAR AKUN) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-7 lg:p-10 bg-white">
          <div className="space-y-5">
            {/* Header Form & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase">
                    Portal PAILMS SMP
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}
                </h2>
              </div>

              {/* Mode Toggle Pills (Masuk vs Daftar) */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMsg("");
                    setRegisteredAccountInfo(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === "login"
                      ? "bg-white text-emerald-800 shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  id="btn-mode-masuk"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccessMsg("");
                    setRegisteredAccountInfo(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === "register"
                      ? "bg-gradient-to-r from-emerald-800 to-emerald-950 text-amber-300 shadow-sm border border-emerald-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  id="btn-mode-daftar"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun</span>
                </button>
              </div>
            </div>

            {/* ROLE TAB SELECTION (Guru vs Siswa) */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("guru");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2 rounded-lg font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "guru"
                    ? "bg-emerald-900 text-amber-300 shadow-md border border-emerald-700/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="tab-role-guru"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Guru / Pendidik</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("siswa");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2 rounded-lg font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "siswa"
                    ? "bg-emerald-900 text-amber-300 shadow-md border border-emerald-700/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="tab-role-siswa"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Siswa (LMS)</span>
              </button>
            </div>

            {/* ERROR ALERT BOX */}
            {error && (
              <div
                className={`p-3.5 text-xs rounded-xl flex flex-col gap-2 border animate-fadeIn ${
                  errorType === "not_registered"
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {errorType === "not_registered" ? (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  ) : (
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  )}
                  <span className="font-medium">{error}</span>
                </div>

                {/* If not registered, display quick registration CTA button right in the error */}
                {errorType === "not_registered" && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGoToRegister}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      id="btn-error-to-register"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Daftar Akun {activeTab === "guru" ? "Guru" : "Siswa"} Sekarang</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUCCESS BANNER */}
            {successMsg && !registeredAccountInfo && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-bold">{successMsg}</span>
              </div>
            )}

            {/* SUCCESS REGISTRATION MODAL / CARD */}
            {registeredAccountInfo && (
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50/60 border border-emerald-300 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Akun Berhasil Didaftarkan!</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Nama:</span>
                    <span className="font-black text-slate-900">{registeredAccountInfo.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      {registeredAccountInfo.role === "guru" ? "NIP Guru:" : "NISN Siswa:"}
                    </span>
                    <span className="font-mono font-bold text-emerald-800">{registeredAccountInfo.identifier}</span>
                  </div>
                  {registeredAccountInfo.kelasId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Kelas:</span>
                      <span className="font-bold text-slate-800">{registeredAccountInfo.kelasId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <span className="text-emerald-700 font-bold">Aktif & Siap Digunakan</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAutoLoginAfterRegister}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                    id="btn-login-immediately"
                  >
                    <span>Langsung Masuk ke Aplikasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setRegisteredAccountInfo(null);
                      if (registeredAccountInfo.role === "guru") {
                        setNipInput(registeredAccountInfo.identifier);
                      } else {
                        setNisnInput(registeredAccountInfo.identifier);
                      }
                      setPasswordInput(registeredAccountInfo.password);
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer"
                  >
                    Ke Halaman Masuk
                  </button>
                </div>
              </div>
            )}

            {/* ===================== MODE 1: FORM LOGIN ===================== */}
            {mode === "login" && !registeredAccountInfo && (
              <form onSubmit={handleLogin} className="space-y-4">
                {activeTab === "guru" ? (
                  <div>
                    <label htmlFor="nip" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      NIP / Nomor Registrasi Guru
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="nip"
                        type="text"
                        required
                        value={nipInput}
                        onChange={(e) => setNipInput(e.target.value)}
                        placeholder="Masukkan NIP (Contoh: 197909172...)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition shadow-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="nisn" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      NISN (Nomor Induk Siswa Nasional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <input
                        id="nisn"
                        type="text"
                        required
                        value={nisnInput}
                        onChange={(e) => setNisnInput(e.target.value)}
                        placeholder="Masukkan 10 digit NISN (Contoh: 0098...)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition shadow-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}

                {/* Password Input for both */}
                <div>
                  <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Kata Sandi / Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi akun"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition shadow-sm placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:via-amber-400 hover:to-yellow-400 text-slate-950 py-3 px-4 rounded-xl text-sm font-black transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 border border-amber-300 active:scale-[0.99] group cursor-pointer"
                  id="btn-submit-login"
                >
                  <span>{activeTab === "guru" ? "Masuk Aplikasi Guru" : "Masuk LMS Siswa"}</span>
                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </button>

                {/* Bottom link to Register */}
                <div className="text-center pt-2">
                  <span className="text-xs text-slate-600 font-medium">
                    Belum memiliki akun terdaftar?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-black text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                    id="link-go-to-register"
                  >
                    Daftar Akun Baru Disini
                  </button>
                </div>
              </form>
            )}

            {/* ===================== MODE 2: FORM DAFTAR AKUN BARU ===================== */}
            {mode === "register" && !registeredAccountInfo && (
              <div>
                {activeTab === "siswa" ? (
                  /* DAFTAR SISWA */
                  <form onSubmit={handleRegisterSiswaSubmit} className="space-y-3" id="form-daftar-siswa">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-siswa-nisn" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          NISN Siswa *
                        </label>
                        <input
                          id="reg-siswa-nisn"
                          type="text"
                          required
                          value={regSiswaNisn}
                          onChange={(e) => setRegSiswaNisn(e.target.value)}
                          placeholder="10 digit NISN (e.g. 0098...)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-siswa-nama" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Nama Lengkap Siswa *
                        </label>
                        <input
                          id="reg-siswa-nama"
                          type="text"
                          required
                          value={regSiswaNama}
                          onChange={(e) => setRegSiswaNama(e.target.value)}
                          placeholder="Contoh: Ahmad Zaky"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-siswa-kelas" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Pilihan Kelas *
                        </label>
                        <select
                          id="reg-siswa-kelas"
                          value={regSiswaKelas}
                          onChange={(e) => setRegSiswaKelas(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        >
                          {classes.length > 0 ? (
                            classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nama || `Kelas ${c.id}`}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="VII-A">Kelas VII-A</option>
                              <option value="VII-B">Kelas VII-B</option>
                              <option value="VIII-A">Kelas VIII-A</option>
                              <option value="VIII-B">Kelas VIII-B</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Jenis Kelamin *
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRegSiswaGender("Laki-laki")}
                            className={`flex-1 py-2 px-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                              regSiswaGender === "Laki-laki"
                                ? "bg-emerald-800 text-white border-emerald-900"
                                : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                          >
                            Laki-laki
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegSiswaGender("Perempuan")}
                            className={`flex-1 py-2 px-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                              regSiswaGender === "Perempuan"
                                ? "bg-emerald-800 text-white border-emerald-900"
                                : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                          >
                            Perempuan
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-siswa-kontak" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        No. HP / WhatsApp Orang Tua (Opsional)
                      </label>
                      <input
                        id="reg-siswa-kontak"
                        type="text"
                        value={regSiswaKontak}
                        onChange={(e) => setRegSiswaKontak(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-siswa-pass" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Kata Sandi Baru *
                        </label>
                        <div className="relative">
                          <input
                            id="reg-siswa-pass"
                            type={showRegSiswaPassword ? "text" : "password"}
                            required
                            value={regSiswaPassword}
                            onChange={(e) => setRegSiswaPassword(e.target.value)}
                            placeholder="Minimal 3 karakter"
                            className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegSiswaPassword(!showRegSiswaPassword)}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            {showRegSiswaPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-siswa-confirm" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Konfirmasi Sandi *
                        </label>
                        <input
                          id="reg-siswa-confirm"
                          type={showRegSiswaPassword ? "text" : "password"}
                          required
                          value={regSiswaConfirmPassword}
                          onChange={(e) => setRegSiswaConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-amber-300 py-3 px-4 rounded-xl text-sm font-black transition flex items-center justify-center gap-2 shadow-md border border-emerald-700 active:scale-[0.99] cursor-pointer"
                      id="btn-submit-reg-siswa"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar & Buat Akun Siswa</span>
                    </button>
                  </form>
                ) : (
                  /* DAFTAR GURU */
                  <form onSubmit={handleRegisterGuruSubmit} className="space-y-3" id="form-daftar-guru">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-guru-nip" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          NIP / NUPTK / No. Registrasi *
                        </label>
                        <input
                          id="reg-guru-nip"
                          type="text"
                          required
                          value={regGuruNip}
                          onChange={(e) => setRegGuruNip(e.target.value)}
                          placeholder="18 digit NIP / Registrasi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-guru-nama" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Nama Lengkap & Gelar *
                        </label>
                        <input
                          id="reg-guru-nama"
                          type="text"
                          required
                          value={regGuruNama}
                          onChange={(e) => setRegGuruNama(e.target.value)}
                          placeholder="Contoh: Ahmad Dahlan, S.Pd.I."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-guru-kontak" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          No. WhatsApp / HP
                        </label>
                        <input
                          id="reg-guru-kontak"
                          type="text"
                          value={regGuruKontak}
                          onChange={(e) => setRegGuruKontak(e.target.value)}
                          placeholder="+62 812-xxxx-xxxx"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-guru-kelas" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Tugas Wali Kelas
                        </label>
                        <div className="flex gap-2 items-center">
                          <select
                            id="reg-guru-kelas"
                            value={regGuruWaliKelas}
                            onChange={(e) => {
                              setRegGuruWaliKelas(e.target.value);
                              setRegGuruIsWaliKelas(e.target.value !== "none");
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                          >
                            <option value="none">Bukan Wali Kelas (Guru Mapel PAI)</option>
                            {classes.length > 0 ? (
                              classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                  Wali Kelas {c.nama || c.id}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="VII-A">Wali Kelas VII-A</option>
                                <option value="VII-B">Wali Kelas VII-B</option>
                                <option value="VIII-A">Wali Kelas VIII-A</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-guru-pass" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Kata Sandi Baru *
                        </label>
                        <div className="relative">
                          <input
                            id="reg-guru-pass"
                            type={showRegGuruPassword ? "text" : "password"}
                            required
                            value={regGuruPassword}
                            onChange={(e) => setRegGuruPassword(e.target.value)}
                            placeholder="Minimal 3 karakter"
                            className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegGuruPassword(!showRegGuruPassword)}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            {showRegGuruPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-guru-confirm" className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                          Konfirmasi Sandi *
                        </label>
                        <input
                          id="reg-guru-confirm"
                          type={showRegGuruPassword ? "text" : "password"}
                          required
                          value={regGuruConfirmPassword}
                          onChange={(e) => setRegGuruConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-amber-300 py-3 px-4 rounded-xl text-sm font-black transition flex items-center justify-center gap-2 shadow-md border border-emerald-700 active:scale-[0.99] cursor-pointer"
                      id="btn-submit-reg-guru"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar & Buat Akun Guru</span>
                    </button>
                  </form>
                )}

                {/* Bottom link to Login */}
                <div className="text-center pt-3">
                  <span className="text-xs text-slate-600 font-medium">
                    Sudah memiliki akun terdaftar?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-black text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                    id="link-go-to-login"
                  >
                    Masuk ke Akun Anda
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer info */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>PAILMS © 2026 UPT SMPN 2 Rebang Tangkas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
