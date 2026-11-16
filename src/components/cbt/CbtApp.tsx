/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileQuestion,
  ClipboardList,
  Award,
  BarChart3,
  Database,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cbtSupabaseService, SchemaDiagnostics } from "../../services/cbtSupabaseService";
import {
  AcademicYear,
  ActivityLog,
  CbtClass,
  CbtExam,
  CbtMaterial,
  CbtProfile,
  CbtStudent,
  CbtSubject,
  ExamAttempt,
  ExamResultRecord,
  QuestionBankItem,
  SchoolSettings,
} from "../../types/cbt";
import CbtAuthView from "./CbtAuthView";
import CbtGuruDashboard from "./CbtGuruDashboard";
import CbtQuestionBank from "./CbtQuestionBank";
import CbtExamManager from "./CbtExamManager";
import CbtResultsAndGrading from "./CbtResultsAndGrading";
import CbtQuestionAnalysis from "./CbtQuestionAnalysis";
import CbtMasterData from "./CbtMasterData";
import CbtStudentPortal from "./CbtStudentPortal";
import CbtGuideView from "./CbtGuideView";

interface CbtAppProps {
  onBackToPailms?: () => void;
}

export default function CbtApp({ onBackToPailms }: CbtAppProps) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("cbt_pai_dark_mode") === "true";
    } catch {
      return false;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CbtProfile | null>(null);
  const [studentSelf, setStudentSelf] = useState<CbtStudent | null>(null);
  const [schemaStatus, setSchemaStatus] = useState<SchemaDiagnostics | null>(null);
  const [showAuthGuide, setShowAuthGuide] = useState(false);

  // Navigation
  const [guruTab, setGuruTab] = useState<
    "dashboard" | "bank-soal" | "ujian" | "hasil" | "analisis" | "data" | "panduan"
  >("dashboard");
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Live Supabase Datasets (Starts cleanly empty — no sample students/questions)
  const [school, setSchool] = useState<SchoolSettings | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<CbtClass[]>([]);
  const [students, setStudents] = useState<CbtStudent[]>([]);
  const [teachers, setTeachers] = useState<CbtProfile[]>([]);
  const [subjects, setSubjects] = useState<CbtSubject[]>([]);
  const [materials, setMaterials] = useState<CbtMaterial[]>([]);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [exams, setExams] = useState<CbtExam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [results, setResults] = useState<ExamResultRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("cbt_pai_dark_mode", String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  const checkSchema = useCallback(async () => {
    const diag = await cbtSupabaseService.diagnoseSchema();
    setSchemaStatus(diag);
  }, []);

  const loadAllData = useCallback(async (role?: string) => {
    try {
      const [sc, yrs, cls, exs, atts, ress, logs] = await Promise.all([
        cbtSupabaseService.getSchoolSettings().catch(() => null),
        cbtSupabaseService.getAcademicYears().catch(() => []),
        cbtSupabaseService.getClasses().catch(() => []),
        cbtSupabaseService.getExams().catch(() => []),
        cbtSupabaseService.getExamAttempts().catch(() => []),
        cbtSupabaseService.getExamResults().catch(() => []),
        cbtSupabaseService.getActivityLogs().catch(() => []),
      ]);
      setSchool(sc);
      setAcademicYears(yrs);
      setClasses(cls);
      setExams(exs);
      setAttempts(atts);
      setResults(ress);
      setActivityLogs(logs);

      if (role === "guru" || role === "admin") {
        const [sts, tchs, subs, mats, qbs] = await Promise.all([
          cbtSupabaseService.getStudents().catch(() => []),
          cbtSupabaseService.getTeachers().catch(() => []),
          cbtSupabaseService.getSubjects().catch(() => []),
          cbtSupabaseService.getMaterials().catch(() => []),
          cbtSupabaseService.getQuestions().catch(() => []),
        ]);
        setStudents(sts);
        setTeachers(tchs);
        setSubjects(subs);
        setMaterials(mats);
        setQuestions(qbs);
      }
    } catch {
      // ignore initial schema errors cleanly
    }
  }, []);

  const refreshSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      await checkSchema();
      const sess = await cbtSupabaseService.getCurrentSessionProfile();
      if (!sess) {
        setSessionUserId(null);
        setProfile(null);
        setStudentSelf(null);
      } else {
        setSessionUserId(sess.userId);
        setProfile(sess.profile);
        setStudentSelf(sess.student);
        await loadAllData(sess.profile?.role);
      }
    } finally {
      setAuthLoading(false);
    }
  }, [checkSchema, loadAllData]);

  useEffect(() => {
    refreshSession();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refreshSession();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [refreshSession]);

  // Notifications: new exams & ending soon exams
  const examNotifications = useMemo(() => {
    const now = Date.now();
    return exams
      .filter((e) => e.status === "published" || e.status === "ongoing")
      .map((e) => {
        const endMs = new Date(e.end_time).getTime();
        const minsLeft = Math.round((endMs - now) / 60000);
        if (minsLeft > 0 && minsLeft <= 60) {
          return {
            id: e.id,
            title: `Ujian Segera Berakhir (${minsLeft} menit lagi)`,
            detail: e.title,
          };
        }
        return {
          id: e.id,
          title: "Ujian Tersedia",
          detail: `${e.title} • ${e.exam_date}`,
        };
      });
  }, [exams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060F24] text-slate-600 dark:text-sky-200 text-sm font-bold">
        Memuat CBT PAI SMART – UPT SMPN 2 Rebang Tangkas...
      </div>
    );
  }

  if (!sessionUserId) {
    return (
      <>
        <CbtAuthView
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onAuthenticated={refreshSession}
          onBackToPailms={onBackToPailms}
          schemaStatus={schemaStatus}
          onOpenSetupGuide={() => setShowAuthGuide(true)}
        />
        {showAuthGuide && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-4xl w-full bg-slate-50 dark:bg-[#060F24] rounded-2xl border border-slate-300 dark:border-slate-700 p-5 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-extrabold text-base">
                  Setup Database & Edge Functions Supabase
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAuthGuide(false)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CbtGuideView schemaStatus={schemaStatus} onRecheckSchema={checkSchema} />
            </div>
          </div>
        )}
      </>
    );
  }

  const isGuru = profile?.role === "guru" || profile?.role === "admin";
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard Guru", icon: LayoutDashboard },
    { id: "bank-soal", label: "Bank Soal PAI", icon: FileQuestion },
    { id: "ujian", label: "Buat & Kelola Ujian", icon: ClipboardList },
    { id: "hasil", label: "Hasil & Rekap Nilai", icon: Award },
    { id: "analisis", label: "Analisis Soal", icon: BarChart3 },
    { id: "data", label: "Manajemen Data", icon: Database },
    { id: "panduan", label: "Panduan & Setup", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060F24] text-slate-900 dark:text-slate-100 cbt-transition">
      {/* Global Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B1B3B]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isGuru && (
              <button
                type="button"
                onClick={() => setMobileDrawer(!mobileDrawer)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 md:hidden cursor-pointer"
              >
                {mobileDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3B] dark:bg-sky-500/20 border border-amber-400/50 text-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-sm sm:text-base tracking-tight truncate">
                  CBT PAI SMART
                </h1>
                <span className="hidden sm:inline text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  • {school?.subject_name || "Pendidikan Agama Islam"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 truncate">
                {school?.school_name || "UPT SMPN 2 Rebang Tangkas"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToPailms && (
              <button
                type="button"
                onClick={onBackToPailms}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PAILMS</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotif(!showNotif)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer"
                title="Notifikasi Ujian"
              >
                <Bell className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                {examNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
                    {examNotifications.length}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200 dark:border-slate-700 shadow-xl p-3 space-y-2 z-50">
                  <div className="text-xs font-extrabold border-b border-slate-100 dark:border-slate-800 pb-2">
                    Notifikasi Ujian
                  </div>
                  {examNotifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">Tidak ada notifikasi ujian aktif.</p>
                  ) : (
                    examNotifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs">
                        <div className="font-bold text-amber-600 dark:text-amber-400">{n.title}</div>
                        <div className="text-slate-600 dark:text-slate-300">{n.detail}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-300 cursor-pointer"
              title={darkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => cbtSupabaseService.signOut()}
              className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Running Ticker */}
        <div className="bg-[#0B1B3B] dark:bg-[#040B1A] border-t border-sky-500/20 text-white overflow-hidden py-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-semibold">
            <span className="text-amber-400 font-bold">
              ★ {school?.running_text || "Guru Kreatif, Siswa Aktif"}
            </span>
            <span className="text-sky-200">
              CBT PAI SMART • {school?.school_name || "UPT SMPN 2 Rebang Tangkas"} • Mata Pelajaran Pendidikan Agama Islam
            </span>
            <span className="text-amber-400 font-bold">
              ★ {school?.running_text || "Guru Kreatif, Siswa Aktif"}
            </span>
            <span className="text-sky-200">
              Evaluasi Jujur, Transparan, & Akurat untuk Kelas VII, VIII, dan IX
            </span>
          </div>
        </div>
      </header>

      {/* Body Layout */}
      <div className="flex-1 flex min-w-0">
        {isGuru && (
          <>
            {/* Desktop Guru Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-[#0B1B3B] text-slate-200 flex-col justify-between border-r border-slate-800 shrink-0 sticky top-[86px] h-[calc(100vh-86px)] overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Guru Pengampu PAI
                  </span>
                  <div className="font-display font-extrabold text-sm text-white truncate mt-0.5">
                    {profile?.full_name || "Guru PAI"}
                  </div>
                  <div className="text-[11px] text-sky-200 truncate">@{profile?.username}</div>
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const active = guruTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGuruTab(item.id as any)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold flex items-center gap-3 cursor-pointer cbt-transition ${
                          active
                            ? "bg-sky-600 text-white shadow-md"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-amber-300" : "text-sky-400"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400">
                <div>CBT PAI SMART</div>
                <div className="text-amber-400 font-semibold">UPT SMPN 2 Rebang Tangkas</div>
              </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileDrawer && (
              <div className="fixed inset-0 z-50 md:hidden flex">
                <div
                  className="fixed inset-0 bg-slate-950/75"
                  onClick={() => setMobileDrawer(false)}
                />
                <div className="relative w-64 bg-[#0B1B3B] text-white h-full p-4 space-y-2 z-50">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setGuruTab(item.id as any);
                          setMobileDrawer(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer ${
                          guruTab === item.id ? "bg-sky-600 text-white" : "hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full min-w-0">
          {isGuru ? (
            <>
              {guruTab === "dashboard" && (
                <CbtGuruDashboard
                  students={students}
                  classes={classes}
                  questions={questions}
                  exams={exams}
                  attempts={attempts}
                  results={results}
                  onNavigate={(tab) => setGuruTab(tab as any)}
                />
              )}
              {guruTab === "bank-soal" && (
                <CbtQuestionBank
                  questions={questions}
                  materials={materials}
                  currentUserId={sessionUserId}
                  onRefresh={() => loadAllData(profile?.role)}
                />
              )}
              {guruTab === "ujian" && (
                <CbtExamManager
                  exams={exams}
                  classes={classes}
                  materials={materials}
                  questions={questions}
                  results={results}
                  school={school}
                  currentUserId={sessionUserId}
                  onRefresh={() => loadAllData(profile?.role)}
                />
              )}
              {guruTab === "hasil" && (
                <CbtResultsAndGrading
                  results={results}
                  classes={classes}
                  exams={exams}
                  school={school}
                  onRefresh={() => loadAllData(profile?.role)}
                />
              )}
              {guruTab === "analisis" && (
                <CbtQuestionAnalysis exams={exams} results={results} />
              )}
              {guruTab === "data" && (
                <CbtMasterData
                  school={school}
                  teachers={teachers}
                  classes={classes}
                  students={students}
                  academicYears={academicYears}
                  subjects={subjects}
                  materials={materials}
                  allDataBackup={{
                    school,
                    academicYears,
                    classes,
                    students,
                    subjects,
                    materials,
                    questions,
                    exams,
                    results,
                  }}
                  onRefresh={() => loadAllData(profile?.role)}
                />
              )}
              {guruTab === "panduan" && (
                <CbtGuideView schemaStatus={schemaStatus} onRecheckSchema={checkSchema} />
              )}
            </>
          ) : (
            <CbtStudentPortal
              student={studentSelf}
              exams={exams}
              attempts={attempts}
              results={results}
              activityLogs={activityLogs}
              onRefresh={() => loadAllData("siswa")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
