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
  Link2,
  Menu,
  X,
  ChevronRight,
  FileSpreadsheet
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
import GoogleSheetsHub from "./components/guru/GoogleSheetsHub";
import { triggerDebouncedAutoSync } from "./lib/googleSheetsAutoSync";

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
    triggerDebouncedAutoSync(rekapNilai, updated, students, classes);
  };

  const handleUpdateBabPelajaran = (updatedBab: BabPelajaran[]) => {
    setBabPelajaran(updatedBab);
    DataService.saveBabPelajaran(updatedBab);
  };

  // Navigation Panel Tabs
  const [guruActiveTab, setGuruActiveTab] = useState<"dashboard" | "master" | "perangkat" | "jurnal" | "nilai" | "wali" | "masterku" | "link" | "googlesheets">("dashboard");
  const [siswaActiveTab, setSiswaActiveTab] = useState<"dashboard" | "lms" | "ibadah" | "nilai" | "masterku">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    triggerDebouncedAutoSync(updated, nilaiParalelList, students, classes);
  };

  const handleDeleteNilai = (nisn: string) => {
    const updated = rekapNilai.map((rec) => {
      if (rec.siswaNisn === nisn) {
        return {
          ...rec,
          formatifKuis: 0,
          formatifTugas: 0,
          formatifDiskusi: 0,
          sumatifPts: 0,
          sumatifPas: 0,
          hafalanJuzAmmaScore: 0,
          praktikSholat: 0,
          praktikWudhu: 0
        };
      }
      return rec;
    });
    setRekapNilai(updated);
    DataService.saveRekapNilai(updated);
    triggerDebouncedAutoSync(updated, nilaiParalelList, students, classes);
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

  const renderNavItems = (isMobile: boolean = false) => {
    const onItemClick = (callback: () => void) => {
      callback();
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    };

    if (role === "GURU") {
      return (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Profil Pendidik
            </span>
            <span className="block text-sm font-black text-white truncate">{guruData.nama}</span>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800/60">
                Guru PAI Utama
              </span>
              <span className="text-[10px] font-mono text-slate-400">NIP: {guruData.nip}</span>
            </div>
          </div>

          <div>
            <span className="block px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Menu Utama Aplikasi
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => onItemClick(() => setGuruActiveTab("dashboard"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "dashboard"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${guruActiveTab === "dashboard" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Dashboard Guru</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("master"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "master"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Database className={`w-5 h-5 shrink-0 ${guruActiveTab === "master" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Data Dasar (Master)</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("perangkat"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "perangkat"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className={`w-5 h-5 shrink-0 ${guruActiveTab === "perangkat" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Perangkat Ajar PAI</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("jurnal"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "jurnal"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <PenTool className={`w-5 h-5 shrink-0 ${guruActiveTab === "jurnal" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Jurnal Guru & Siswa</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("nilai"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "nilai"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Award className={`w-5 h-5 shrink-0 ${guruActiveTab === "nilai" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Rekap Nilai PAI</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("wali"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "wali"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <UserCheck className={`w-5 h-5 shrink-0 ${guruActiveTab === "wali" ? "text-amber-400" : "text-amber-400/80"}`} />
                <span>Guru Wali</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("masterku"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "masterku"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className={`w-5 h-5 shrink-0 ${guruActiveTab === "masterku" ? "text-amber-400" : "text-amber-400/90"}`} />
                <div className="flex flex-col min-w-0">
                  <span className="flex items-center gap-1.5">
                    Masterku
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      Khazanah
                    </span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 truncate max-w-[170px]">
                    Qur'an, Hadist, Buku, Kisah
                  </span>
                </div>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("link"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "link"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Globe className={`w-5 h-5 shrink-0 ${guruActiveTab === "link" ? "text-amber-400" : "text-emerald-400"}`} />
                <span className="truncate">Link Layanan (SIAGA/GTK)</span>
              </button>

              <button
                onClick={() => onItemClick(() => setGuruActiveTab("googlesheets"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  guruActiveTab === "googlesheets"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
                id="nav-btn-googlesheets"
              >
                <FileSpreadsheet className={`w-5 h-5 shrink-0 ${guruActiveTab === "googlesheets" ? "text-amber-400" : "text-emerald-400"}`} />
                <div className="flex flex-col min-w-0">
                  <span className="flex items-center gap-1.5">
                    Google Sheets
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                      Drive
                    </span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 truncate max-w-[170px]">
                    Ekspor & Impor Nilai/Siswa
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Identitas Siswa
            </span>
            <span className="block text-sm font-black text-white truncate">{activeSiswaObj?.nama}</span>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800/60">
                Kelas {activeSiswaObj?.kelasId}
              </span>
              <span className="text-[10px] font-mono text-slate-400">NISN: {activeSiswaObj?.nisn}</span>
            </div>
          </div>

          <div>
            <span className="block px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Menu Siswa
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => onItemClick(() => setSiswaActiveTab("dashboard"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  siswaActiveTab === "dashboard"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${siswaActiveTab === "dashboard" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Dashboard Utama</span>
              </button>

              <button
                onClick={() => onItemClick(() => setSiswaActiveTab("lms"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  siswaActiveTab === "lms"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className={`w-5 h-5 shrink-0 ${siswaActiveTab === "lms" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Ruang Kelas LMS PAI</span>
              </button>

              <button
                onClick={() => onItemClick(() => setSiswaActiveTab("ibadah"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  siswaActiveTab === "ibadah"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Heart className={`w-5 h-5 shrink-0 ${siswaActiveTab === "ibadah" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Jurnal Ibadah Mandiri</span>
              </button>

              <button
                onClick={() => onItemClick(() => setSiswaActiveTab("nilai"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  siswaActiveTab === "nilai"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Award className={`w-5 h-5 shrink-0 ${siswaActiveTab === "nilai" ? "text-amber-400" : "text-slate-400"}`} />
                <span>Buku Nilai Siswa</span>
              </button>

              <button
                onClick={() => onItemClick(() => setSiswaActiveTab("masterku"))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  siswaActiveTab === "masterku"
                    ? "bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-extrabold shadow-md shadow-emerald-950/50 border-l-4 border-amber-400"
                    : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className={`w-5 h-5 shrink-0 ${siswaActiveTab === "masterku" ? "text-amber-400" : "text-amber-400/90"}`} />
                <div className="flex flex-col min-w-0">
                  <span className="flex items-center gap-1.5">
                    Masterku
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      Khazanah
                    </span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 truncate max-w-[170px]">
                    Qur'an, Hadist, Buku, Kisah
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* GLOBAL BANNER HEADER */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xs relative z-30 print:hidden sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Hamburger Menu Toggle on Mobile */}
          {role !== "GUEST" && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-1 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-xl md:hidden transition cursor-pointer"
              aria-label="Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-800" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center font-black text-lg sm:text-xl shadow-md shadow-emerald-900/20 border border-emerald-700/40 shrink-0">
            🕌
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-none truncate">
                PAILMS
              </h1>
              <span className="bg-amber-400/90 text-slate-950 font-black text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                V2.6
              </span>
            </div>
            <span className="text-[9px] sm:text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider block mt-0.5 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
              UPT SMPN 2 REBANG TANGKAS
            </span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {role !== "GUEST" && (
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-900 border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse ring-2 ring-amber-300/50"></span>
              <span className="truncate max-w-[180px]">
                Aktif: <strong className="text-slate-900 font-extrabold">{role === "GURU" ? "Guru PAI" : `Siswa (${activeSiswaObj?.nama})`}</strong>
              </span>
            </div>
          )}

          <button
            onClick={handleResetApp}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            title="Atur Ulang Data"
          >
            <RefreshCw className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="hidden sm:inline">Atur Ulang Data</span>
          </button>

          {role !== "GUEST" && (
            <button
              onClick={handleLogOut}
              className="p-2 sm:px-3 sm:py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY (SLIDE OVER) */}
      {role !== "GUEST" && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-50 overflow-y-auto justify-between border-r border-slate-800 animate-fadeIn">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center font-black text-sm border border-emerald-700/50 shrink-0">
                    🕌
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white leading-none">PAILMS</h2>
                    <span className="text-[10px] text-amber-400 font-bold block mt-0.5">UPT SMPN 2 Rebang Tangkas</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition"
                  aria-label="Tutup Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Menu Items */}
              <div className="p-4">
                {renderNavItems(true)}
              </div>
            </div>

            {/* Drawer Footer with Quick Reset, Logout, and Credit */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleResetApp();
                  }}
                  className="flex-1 py-2 px-2 bg-slate-800 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-slate-700/60 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogOut();
                  }}
                  className="flex-1 py-2 px-2 bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 border border-red-800/60 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
              <div className="text-[10px] text-slate-500 text-center font-medium">
                UPT SMPN 2 Rebang Tangkas • PAILMS v2.6
              </div>
            </div>
          </div>
        </div>
      )}

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
          {/* DESKTOP SIDEBAR NAVIGATION PANEL */}
          <aside className="hidden md:flex md:w-64 lg:w-68 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 justify-between print:hidden shadow-lg sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            {/* Desktop Nav Items */}
            <div className="p-4 space-y-5">
              {renderNavItems(false)}
            </div>

            {/* Bottom Credit line inside Desktop Sidebar */}
            <div className="p-4 border-t border-slate-800 text-xs text-slate-400 font-medium bg-slate-950/50">
              <span className="text-slate-300 font-bold block">UPT SMPN 2 Rebang Tangkas</span>
              <span className="block text-[11px] text-amber-400 font-bold mt-0.5">PAILMS v2.6</span>
            </div>
          </aside>

          {/* MAIN PAGE PANEL CONTAINER */}
          <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-24 md:pb-8">
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
                    onOpenGoogleSheets={() => setGuruActiveTab("googlesheets")}
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
                    onDeleteNilai={handleDeleteNilai}
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
                    onOpenGoogleSheets={() => setGuruActiveTab("googlesheets")}
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

                {guruActiveTab === "googlesheets" && (
                  <GoogleSheetsHub
                    students={students}
                    classes={classes}
                    rekapNilai={rekapNilai}
                    jurnalMengajar={jurnals}
                    jurnalIbadah={worships}
                    onBulkAddStudents={(newStudents) => {
                      const updated = sortStudentsByName([...students, ...newStudents]);
                      handleUpdateStudents(updated);
                    }}
                  />
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

          {/* MOBILE BOTTOM NAVIGATION BAR */}
          {role !== "GUEST" && (
            <nav
              id="mobile-bottom-nav"
              className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 px-1 py-1 flex items-center justify-around md:hidden shadow-2xl safe-area-bottom"
            >
              {role === "GURU" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setGuruActiveTab("dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      guruActiveTab === "dashboard"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Dasbor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGuruActiveTab("master");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      guruActiveTab === "master"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Master</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGuruActiveTab("perangkat");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      guruActiveTab === "perangkat"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Perangkat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGuruActiveTab("nilai");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      guruActiveTab === "nilai"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Nilai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      isMobileMenuOpen || ["jurnal", "wali", "masterku", "link"].includes(guruActiveTab)
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Menu className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSiswaActiveTab("dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      siswaActiveTab === "dashboard"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Beranda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSiswaActiveTab("lms");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      siswaActiveTab === "lms"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">LMS PAI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSiswaActiveTab("ibadah");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      siswaActiveTab === "ibadah"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Ibadah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSiswaActiveTab("nilai");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      siswaActiveTab === "nilai"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Nilai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSiswaActiveTab("masterku");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-0.5 flex flex-col items-center justify-center min-h-[46px] rounded-xl transition cursor-pointer ${
                      siswaActiveTab === "masterku"
                        ? "text-amber-400 font-black bg-emerald-950/60 border-t-2 border-amber-400"
                        : "text-slate-400 hover:text-slate-200 font-semibold"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] tracking-tight mt-0.5">Masterku</span>
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
