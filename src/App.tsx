/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  BookOpen,
  PenTool,
  Award,
  LogOut,
  Calendar,
  Users,
  GraduationCap,
  Sparkles,
  Info,
  Sliders,
  RefreshCw,
  Clock,
  Heart,
  UserCheck,
  Globe,
  Link2
} from "lucide-react";

import { DataService } from "./data/initialData";
import {
  Guru,
  Kelas,
  Siswa,
  PerangkatAjar,
  JurnalMengajar,
  CatatanSikapSiswa,
  TugasLms,
  PengumpulanTugas,
  JurnalIbadahHarian,
  NilaiKhususPai,
  RekapNilaiTotal,
  NilaiSemesterParalel,
  BabPelajaran,
  UserAccount
} from "./types";

// Import sub-components
import Login from "./components/Login";
import GuruDashboard from "./components/guru/GuruDashboard";
import DataDasar from "./components/guru/DataDasar";
import PerangkatAjarView from "./components/guru/PerangkatAjar";
import JurnalGuruSiswa from "./components/guru/JurnalGuruSiswa";
import RekapNilai from "./components/guru/RekapNilai";
import PendampinganMurid from "./components/guru/PendampinganMurid";
import LinkLayanan from "./components/guru/LinkLayanan";
import { Masterku } from "./components/guru/Masterku";

import SiswaDashboard from "./components/siswa/SiswaDashboard";
import LmsClassroom from "./components/siswa/LmsClassroom";
import IbadahMandiri from "./components/siswa/IbadahMandiri";
import BukuNilaiSiswa from "./components/siswa/BukuNilaiSiswa";

export default function App() {
  // Session Authentication state
  const [role, setRole] = useState<"GUEST" | "GURU" | "SISWA">("GUEST");
  const [loggedGuruNip, setLoggedGuruNip] = useState<string>("");
  const [loggedSiswaNisn, setLoggedSiswaNisn] = useState<string>("");

  // DB States synchronized with LocalStorage
  const [guruData, setGuruData] = useState<Guru>(DataService.getGuru());
  const [classes, setClasses] = useState<Kelas[]>(DataService.getKelas());
  const [students, setStudents] = useState<Siswa[]>(DataService.getSiswa());
  const [perangkatAjar, setPerangkatAjar] = useState<PerangkatAjar[]>(DataService.getPerangkatAjar());
  const [jurnals, setJurnals] = useState<JurnalMengajar[]>(DataService.getJurnalMengajar());
  const [attitudes, setAttitudes] = useState<CatatanSikapSiswa[]>(DataService.getCatatanSikap());
  const [tasks, setTasks] = useState<TugasLms[]>(DataService.getTugas());
  const [submissions, setSubmissions] = useState<PengumpulanTugas[]>(DataService.getPengumpulan());
  const [worships, setWorships] = useState<JurnalIbadahHarian[]>(DataService.getIbadah());
  const [nilaiKhusus, setNilaiKhusus] = useState<NilaiKhususPai[]>(DataService.getNilaiKhusus());
  const [rekapNilai, setRekapNilai] = useState<RekapNilaiTotal[]>(DataService.getRekapNilai());
  const [nilaiParalelList, setNilaiParalelList] = useState<NilaiSemesterParalel[]>(DataService.getNilaiSemesterParalel());
  const [babPelajaran, setBabPelajaran] = useState<BabPelajaran[]>(DataService.getBabPelajaran());

  const handleUpdateNilaiParalelList = (updated: NilaiSemesterParalel[]) => {
    setNilaiParalelList(updated);
    DataService.saveNilaiSemesterParalel(updated);
  };

  const handleUpdateBabPelajaran = (updatedBab: BabPelajaran[]) => {
    setBabPelajaran(updatedBab);
    DataService.saveBabPelajaran(updatedBab);
  };

  // Navigation Panel Tabs
  const [guruActiveTab, setGuruActiveTab] = useState<"dashboard" | "master" | "perangkat" | "jurnal" | "nilai" | "wali" | "masterku" | "link">("dashboard");
  const [siswaActiveTab, setSiswaActiveTab] = useState<"dashboard" | "lms" | "ibadah" | "nilai" | "masterku">("dashboard");

  const sortStudentsByName = (list: Siswa[]): Siswa[] => {
    return [...list].sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
  };

  const handleUpdateStudents = (updatedStudents: Siswa[]) => {
    const sorted = sortStudentsByName(updatedStudents);
    setStudents(sorted);
    DataService.saveSiswa(sorted);

    // Synchronize names and classes in rekapNilai state
    const updatedRekap = rekapNilai.map((rec) => {
      const match = sorted.find((s) => s.nisn === rec.siswaNisn);
      if (match) {
        return {
          ...rec,
          siswaNama: match.nama,
          kelasId: match.kelasId,
        };
      }
      return rec;
    });
    setRekapNilai(updatedRekap);
    DataService.saveRekapNilai(updatedRekap);
  };

  // Preselected grading ID to route directly from notification panel
  const [activeSubmissionIdToGrade, setActiveSubmissionIdToGrade] = useState<string>("");

  // Synchronize student stats on classes total
  useEffect(() => {
    const updatedClasses = classes.map((c) => {
      const classStudentsCount = students.filter((s) => s.kelasId === c.id && s.statusKeaktifan === "Aktif").length;
      return { ...c, totalSiswa: classStudentsCount };
    });
    // check difference to prevent endless cycles
    if (JSON.stringify(updatedClasses) !== JSON.stringify(classes)) {
      setClasses(updatedClasses);
      DataService.saveKelas(updatedClasses);
    }
  }, [students]);

  // Auth logins & registration
  const handleLoginGuru = (nip: string) => {
    const acc = DataService.getAccounts().find(
      (a) => a.role === "guru" && a.identifier.trim().toLowerCase() === nip.trim().toLowerCase()
    );
    if (acc && acc.nama) {
      const updatedGuru: Guru = {
        nip: acc.identifier,
        nama: acc.nama,
        sertifikasi: "Pendidik Profesional PAI SMP",
        kontak: acc.kontak || guruData.kontak,
        isWaliKelas: Boolean(acc.kelasId),
        waliKelasDi: acc.kelasId || guruData.waliKelasDi || "VII-A"
      };
      setGuruData(updatedGuru);
      DataService.saveGuru(updatedGuru);
    }
    setLoggedGuruNip(nip);
    setRole("GURU");
    setGuruActiveTab("dashboard");
  };

  const handleLoginSiswa = (nisn: string) => {
    const acc = DataService.getAccounts().find(
      (a) => a.role === "siswa" && a.identifier.trim().toLowerCase() === nisn.trim().toLowerCase()
    );
    if (acc && !students.some((s) => s.nisn === acc.identifier)) {
      const newSiswaObj: Siswa = {
        nisn: acc.identifier,
        nama: acc.nama,
        gender: acc.gender || "Laki-laki",
        agama: "Islam",
        statusKeaktifan: "Aktif",
        kelasId: acc.kelasId || "VII-A",
        kontakOrangTua: acc.kontak || ""
      };
      const updated = sortStudentsByName([...students, newSiswaObj]);
      setStudents(updated);
      DataService.saveSiswa(updated);
    }
    setLoggedSiswaNisn(nisn);
    setRole("SISWA");
    setSiswaActiveTab("dashboard");
  };

  const handleRegisterGuru = (newGuru: Guru, password: string) => {
    const newAcc: UserAccount = {
      id: `acc-guru-${Date.now()}`,
      role: "guru",
      identifier: newGuru.nip,
      password: password,
      nama: newGuru.nama,
      kelasId: newGuru.waliKelasDi,
      kontak: newGuru.kontak,
      registeredAt: new Date().toISOString()
    };
    DataService.addAccount(newAcc);
    setGuruData(newGuru);
    DataService.saveGuru(newGuru);
  };

  const handleRegisterSiswa = (newSiswa: Siswa, password: string) => {
    const newAcc: UserAccount = {
      id: `acc-siswa-${Date.now()}`,
      role: "siswa",
      identifier: newSiswa.nisn,
      password: password,
      nama: newSiswa.nama,
      kelasId: newSiswa.kelasId,
      gender: newSiswa.gender,
      kontak: newSiswa.kontakOrangTua,
      registeredAt: new Date().toISOString()
    };
    DataService.addAccount(newAcc);

    const exists = students.some((s) => s.nisn === newSiswa.nisn);
    let updated: Siswa[];
    if (exists) {
      updated = students.map((s) => (s.nisn === newSiswa.nisn ? { ...s, ...newSiswa } : s));
    } else {
      updated = sortStudentsByName([...students, newSiswa]);
    }
    handleUpdateStudents(updated);
  };

  const handleLogOut = () => {
    setRole("GUEST");
    setLoggedGuruNip("");
    setLoggedSiswaNisn("");
    setActiveSubmissionIdToGrade("");
  };

  // State Writers with LocalStorage sync
  const handleUpdateGuru = (updated: Guru) => {
    setGuruData(updated);
    DataService.saveGuru(updated);
  };

  const handleUpdateClasses = (updatedClasses: Kelas[]) => {
    setClasses(updatedClasses);
    DataService.saveKelas(updatedClasses);
  };

  const handleAddStudent = (newStudent: Siswa) => {
    const updated = sortStudentsByName([...students, newStudent]);
    setStudents(updated);
    DataService.saveSiswa(updated);

    // Prepare their empty grade rekap automatically!
    const emptyRekap: RekapNilaiTotal = {
      siswaNisn: newStudent.nisn,
      siswaNama: newStudent.nama,
      kelasId: newStudent.kelasId,
      formatifKuis: 80,
      formatifTugas: 80,
      formatifDiskusi: 80,
      sumatifPts: 80,
      sumatifPas: 80,
      hafalanJuzAmmaScore: 80,
      praktikSholat: 80,
      praktikWudhu: 80
    };
    const updatedRekap = [...rekapNilai, emptyRekap];
    setRekapNilai(updatedRekap);
    DataService.saveRekapNilai(updatedRekap);
  };

  const handleBulkAddStudents = (newStudentsList: Siswa[]) => {
    const updated = sortStudentsByName([...students, ...newStudentsList]);
    setStudents(updated);
    DataService.saveSiswa(updated);

    const newRekaps: RekapNilaiTotal[] = newStudentsList.map((st) => ({
      siswaNisn: st.nisn,
      siswaNama: st.nama,
      kelasId: st.kelasId,
      formatifKuis: 80,
      formatifTugas: 80,
      formatifDiskusi: 80,
      sumatifPts: 80,
      sumatifPas: 80,
      hafalanJuzAmmaScore: 80,
      praktikSholat: 80,
      praktikWudhu: 80
    }));

    const updatedRekap = [...rekapNilai, ...newRekaps];
    setRekapNilai(updatedRekap);
    DataService.saveRekapNilai(updatedRekap);
  };

  const handleToggleStudentStatus = (nisn: string) => {
    const updated = sortStudentsByName(
      students.map((s) => {
        if (s.nisn === nisn) {
          return {
            ...s,
            statusKeaktifan: (s.statusKeaktifan === "Aktif" ? "Tidak Aktif" : "Aktif") as "Aktif" | "Tidak Aktif"
          };
        }
        return s;
      })
    );
    setStudents(updated);
    DataService.saveSiswa(updated);
  };

  const handleAddPerangkat = (newPa: PerangkatAjar) => {
    const updated = [newPa, ...perangkatAjar];
    setPerangkatAjar(updated);
    DataService.savePerangkatAjar(updated);
  };

  const handleEditPerangkat = (updatedPa: PerangkatAjar) => {
    const updated = perangkatAjar.map((pa) => pa.id === updatedPa.id ? updatedPa : pa);
    setPerangkatAjar(updated);
    DataService.savePerangkatAjar(updated);
  };

  const handleDeletePerangkat = (id: string) => {
    const updated = perangkatAjar.filter((pa) => pa.id !== id);
    setPerangkatAjar(updated);
    DataService.savePerangkatAjar(updated);
  };

  const handleAddJurnal = (newJm: JurnalMengajar) => {
    const updated = [newJm, ...jurnals];
    setJurnals(updated);
    DataService.saveJurnalMengajar(updated);
  };

  const handleAddAttitude = (newCs: CatatanSikapSiswa) => {
    const updated = [newCs, ...attitudes];
    setAttitudes(updated);
    DataService.saveCatatanSikap(updated);
  };

  const handleAddSubmission = (newSub: PengumpulanTugas) => {
    const index = submissions.findIndex(
      (s) => s.id === newSub.id || (s.tugasId === newSub.tugasId && s.siswaNisn === newSub.siswaNisn)
    );
    let updated: PengumpulanTugas[];
    if (index >= 0) {
      updated = [...submissions];
      updated[index] = { ...updated[index], ...newSub };
    } else {
      updated = [newSub, ...submissions];
    }
    setSubmissions(updated);
    DataService.savePengumpulan(updated);
  };

  const handleGradeSubmission = (subId: string, score: number, comment: string) => {
    const updated = submissions.map((sub) => {
      if (sub.id === subId) {
        return { ...sub, nilai: score, komentarGuru: comment };
      }
      return sub;
    });
    setSubmissions(updated);
    DataService.savePengumpulan(updated);
  };

  const handleAddWorship = (newWorship: JurnalIbadahHarian) => {
    // Check if record exists for today
    const index = worships.findIndex((w) => w.siswaNisn === newWorship.siswaNisn && w.tanggal === newWorship.tanggal);
    let updated = [...worships];
    if (index >= 0) {
      updated[index] = newWorship;
    } else {
      updated = [newWorship, ...updated];
    }
    setWorships(updated);
    DataService.saveIbadah(updated);
  };

  const handleUpdateNilai = (updatedRec: RekapNilaiTotal) => {
    const updated = rekapNilai.map((rec) => (rec.siswaNisn === updatedRec.siswaNisn ? updatedRec : rec));
    setRekapNilai(updated);
    DataService.saveRekapNilai(updated);
  };

  const handleUpdateNilaiKhusus = (updatedNk: NilaiKhususPai) => {
    const updated = nilaiKhusus.map((nk) => (nk.siswaNisn === updatedNk.siswaNisn ? updatedNk : nk));
    setNilaiKhusus(updated);
    DataService.saveNilaiKhusus(updated);
  };

  // Direct LMS grading router from stats card
  const handleGradeClickFromDashboard = (submissionId: string) => {
    setActiveSubmissionIdToGrade(submissionId);
    setGuruActiveTab("nilai");
  };

  // Reset entire application database mock helper
  const handleResetApp = () => {
    if (confirm("Apakah Anda yakin ingin mengatur ulang semua data simulasi ke setelan awal?")) {
      DataService.resetAll();
    }
  };

  // Pre-calculated stats for Teacher Dashboard
  const currentMonthJurnals = jurnals.filter((j) => j.tanggal.startsWith("2026-07"));
  const totalStudentsInMonth = classes.reduce((sum, c) => sum + c.totalSiswa, 0);

  const attendanceTotalPercent = currentMonthJurnals.length > 0
    ? Math.round(
        (currentMonthJurnals.reduce((sum, j) => sum + j.kehadiranHadir, 0) /
          (currentMonthJurnals.length * totalStudentsInMonth)) *
          1000
      ) / 10
    : 95.4;

  const pendingSubmissions = submissions.filter((s) => s.nilai === undefined || s.nilai === null);

  // Active student object with fallback to registered account
  const registeredSiswaAccount = DataService.getAccounts().find(
    (a) => a.role === "siswa" && a.identifier.trim().toLowerCase() === loggedSiswaNisn.trim().toLowerCase()
  );
  const activeSiswaObj =
    students.find((s) => s.nisn === loggedSiswaNisn) ||
    (registeredSiswaAccount
      ? {
          nisn: registeredSiswaAccount.identifier,
          nama: registeredSiswaAccount.nama,
          gender: registeredSiswaAccount.gender || "Laki-laki",
          agama: "Islam",
          statusKeaktifan: "Aktif" as const,
          kelasId: registeredSiswaAccount.kelasId || "VII-A",
          kontakOrangTua: registeredSiswaAccount.kontak || ""
        }
      : undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* GLOBAL BANNER HEADER */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-sm relative z-20 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center font-black text-xl shadow-md shadow-emerald-900/20 border border-emerald-700/40">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                PAILMS
              </h1>
              <span className="bg-amber-400/90 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                V2.6
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider block mt-0.5">
              UPT SMPN 2 REBANG TANGKAS
            </span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          {role !== "GUEST" && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-900 border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse ring-2 ring-amber-300/50"></span>
              <span>Aktif: <strong className="text-slate-900 font-extrabold">{role === "GURU" ? "Guru PAI" : `Siswa (${activeSiswaObj?.nama})`}</strong></span>
            </div>
          )}

          <button
            onClick={handleResetApp}
            className="px-3 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
            title="Reset Database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Atur Ulang Data</span>
          </button>

          {role !== "GUEST" && (
            <button
              onClick={handleLogOut}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </header>

      {/* RENDER BODY DISPATCHER */}
      {role === "GUEST" ? (
        <Login
          onLoginGuru={handleLoginGuru}
          onLoginSiswa={handleLoginSiswa}
          onRegisterGuru={handleRegisterGuru}
          onRegisterSiswa={handleRegisterSiswa}
          teachers={guruData}
          students={students}
          classes={classes}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* SIDEBAR NAVIGATION PANEL */}
          <aside className="w-full md:w-68 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 justify-between print:hidden shadow-lg">
            {/* Nav list */}
            <div className="p-4 space-y-5">
              {role === "GURU" ? (
                /* GURU SIDEBAR NAVIGATION */
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                    <span className="block text-[11px] font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Profil Pendidik
                    </span>
                    <span className="block text-sm font-black text-white truncate">{guruData.nama}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800/60">
                      Guru PAI Utama
                    </span>
                  </div>

                  <div>
                    <span className="block px-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Menu Utama Aplikasi
                    </span>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setGuruActiveTab("dashboard")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "dashboard"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <LayoutDashboard className={`w-5 h-5 ${guruActiveTab === "dashboard" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Dashboard Guru</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("master")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "master"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Database className={`w-5 h-5 ${guruActiveTab === "master" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Data Dasar (Master)</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("perangkat")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "perangkat"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <BookOpen className={`w-5 h-5 ${guruActiveTab === "perangkat" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Perangkat Ajar PAI</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("jurnal")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "jurnal"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <PenTool className={`w-5 h-5 ${guruActiveTab === "jurnal" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Jurnal Guru & Siswa</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("nilai")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "nilai"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Award className={`w-5 h-5 ${guruActiveTab === "nilai" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Rekap Nilai PAI</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("wali")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "wali"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <UserCheck className={`w-5 h-5 ${guruActiveTab === "wali" ? "text-amber-400" : "text-amber-400/80"}`} />
                        <span>Guru Wali</span>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("masterku")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "masterku"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Sparkles className={`w-5 h-5 ${guruActiveTab === "masterku" ? "text-amber-400" : "text-amber-400/90"}`} />
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5">
                            Masterku
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                              Khazanah
                            </span>
                          </span>
                          <span className="text-[10px] font-normal text-slate-400 truncate max-w-[170px]">
                            Qur'an, Hadist, Buku, Nabi, Nasehat, Hikmah
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => setGuruActiveTab("link")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          guruActiveTab === "link"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Globe className={`w-5 h-5 ${guruActiveTab === "link" ? "text-amber-400" : "text-emerald-400"}`} />
                        <span>Link Layanan (SIAGA, GTK, MyASN)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* SISWA SIDEBAR NAVIGATION */
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                    <span className="block text-[11px] font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Identitas Siswa
                    </span>
                    <span className="block text-sm font-black text-white truncate">{activeSiswaObj?.nama}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800/60">
                      Kelas {activeSiswaObj?.kelasId}
                    </span>
                  </div>

                  <div>
                    <span className="block px-2 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Menu Siswa
                    </span>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setSiswaActiveTab("dashboard")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          siswaActiveTab === "dashboard"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <LayoutDashboard className={`w-5 h-5 ${siswaActiveTab === "dashboard" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Dashboard Utama</span>
                      </button>

                      <button
                        onClick={() => setSiswaActiveTab("lms")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          siswaActiveTab === "lms"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <BookOpen className={`w-5 h-5 ${siswaActiveTab === "lms" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Ruang Kelas LMS PAI</span>
                      </button>

                      <button
                        onClick={() => setSiswaActiveTab("ibadah")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          siswaActiveTab === "ibadah"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${siswaActiveTab === "ibadah" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Jurnal Ibadah Mandiri</span>
                      </button>

                      <button
                        onClick={() => setSiswaActiveTab("nilai")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          siswaActiveTab === "nilai"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Award className={`w-5 h-5 ${siswaActiveTab === "nilai" ? "text-amber-400" : "text-slate-400"}`} />
                        <span>Buku Nilai Siswa</span>
                      </button>

                      <button
                        onClick={() => setSiswaActiveTab("masterku")}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all ${
                          siswaActiveTab === "masterku"
                            ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Sparkles className={`w-5 h-5 ${siswaActiveTab === "masterku" ? "text-amber-400" : "text-amber-400/90"}`} />
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5">
                            Masterku
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                              Khazanah
                            </span>
                          </span>
                          <span className="text-[10px] font-normal text-slate-400 truncate max-w-[170px]">
                            Qur'an, Hadist, Buku, Nabi, Nasehat, Hikmah
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Credit line inside Sidebar */}
            <div className="p-4 border-t border-slate-800 text-xs text-slate-400 font-medium bg-slate-950/50">
              <span className="text-slate-300 font-bold block">UPT SMPN 2 Rebang Tangkas</span>
              <span className="block text-[11px] text-amber-400 font-bold mt-0.5">PAILMS v2.6</span>
            </div>
          </aside>

          {/* MAIN PAGE PANEL CONTAINER */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {role === "GURU" ? (
              /* GURU MAIN ROUTING SWITCHES */
              <div>
                {guruActiveTab === "dashboard" && (
                  <GuruDashboard
                    guru={guruData}
                    classes={classes}
                    attendanceRate={attendanceTotalPercent}
                    jurnals={jurnals}
                    pendingSubmissions={pendingSubmissions}
                    onNavigate={(tab, subTab) => {
                      setGuruActiveTab(tab as any);
                    }}
                    onGradeClick={handleGradeClickFromDashboard}
                  />
                )}

                {guruActiveTab === "master" && (
                  <DataDasar
                    guru={guruData}
                    onUpdateGuru={handleUpdateGuru}
                    classes={classes}
                    onUpdateClasses={handleUpdateClasses}
                    students={students}
                    onUpdateStudents={handleUpdateStudents}
                    onAddStudent={handleAddStudent}
                    onBulkAddStudents={handleBulkAddStudents}
                    onToggleStudentStatus={handleToggleStudentStatus}
                    attitudes={attitudes}
                    worships={worships}
                    rekapNilai={rekapNilai}
                  />
                )}

                {guruActiveTab === "perangkat" && (
                  <PerangkatAjarView
                    items={perangkatAjar}
                    onAddItem={handleAddPerangkat}
                    onEditItem={handleEditPerangkat}
                    onDeleteItem={handleDeletePerangkat}
                    babPelajaran={babPelajaran}
                    onUpdateBabPelajaran={handleUpdateBabPelajaran}
                  />
                )}

                {guruActiveTab === "jurnal" && (
                  <JurnalGuruSiswa
                    jurnals={jurnals}
                    onAddJurnal={handleAddJurnal}
                    attitudes={attitudes}
                    onAddAttitude={handleAddAttitude}
                    students={students}
                    classes={classes}
                  />
                )}

                {guruActiveTab === "nilai" && (
                  <RekapNilai
                    rekapNilai={rekapNilai}
                    onUpdateNilai={handleUpdateNilai}
                    students={students}
                    classes={classes}
                    submissions={submissions}
                    onGradeSubmission={handleGradeSubmission}
                    nilaiKhusus={nilaiKhusus}
                    onUpdateNilaiKhusus={handleUpdateNilaiKhusus}
                    activeSubmissionIdToGrade={activeSubmissionIdToGrade}
                    onClearActiveSubmissionId={() => setActiveSubmissionIdToGrade("")}
                    nilaiParalelList={nilaiParalelList}
                    onUpdateNilaiParalelList={handleUpdateNilaiParalelList}
                  />
                )}

                {guruActiveTab === "wali" && (
                  <PendampinganMurid
                    guru={guruData}
                    students={students}
                    classes={classes}
                    onUpdateStudents={handleUpdateStudents}
                  />
                )}

                {guruActiveTab === "masterku" && (
                  <Masterku />
                )}

                {guruActiveTab === "link" && (
                  <LinkLayanan />
                )}
              </div>
            ) : (
              /* SISWA MAIN ROUTING SWITCHES */
              <div>
                {activeSiswaObj ? (
                  <div>
                    {siswaActiveTab === "dashboard" && (
                      <SiswaDashboard
                        siswa={activeSiswaObj}
                        tasks={tasks}
                        submissions={submissions}
                        onNavigate={(tab) => setSiswaActiveTab(tab as any)}
                      />
                    )}

                    {siswaActiveTab === "lms" && (
                      <LmsClassroom
                        siswa={activeSiswaObj}
                        tasks={tasks}
                        submissions={submissions}
                        onAddSubmission={handleAddSubmission}
                        babPelajaran={babPelajaran}
                        rekapNilai={rekapNilai}
                        onUpdateRekapNilai={handleUpdateNilai}
                        onUpdateBabPelajaran={handleUpdateBabPelajaran}
                      />
                    )}

                    {siswaActiveTab === "ibadah" && (
                      <IbadahMandiri
                        siswa={activeSiswaObj}
                        worships={worships}
                        onAddWorship={handleAddWorship}
                      />
                    )}

                    {siswaActiveTab === "nilai" && (
                      <BukuNilaiSiswa
                        siswa={activeSiswaObj}
                        tasks={tasks}
                        submissions={submissions}
                        rekapNilai={rekapNilai}
                        nilaiKhusus={nilaiKhusus}
                      />
                    )}

                    {siswaActiveTab === "masterku" && (
                      <Masterku />
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-red-50 text-red-800 text-xs rounded-xl font-bold border border-red-100">
                    Siswa tidak ditemukan. Harap keluar dan masuk kembali menggunakan NISN yang valid.
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
