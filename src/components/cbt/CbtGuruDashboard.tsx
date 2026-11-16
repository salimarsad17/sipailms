/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import {
  Users,
  School,
  FileQuestion,
  ClipboardList,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  CbtClass,
  CbtExam,
  CbtStudent,
  ExamAttempt,
  ExamResultRecord,
  QuestionBankItem,
} from "../../types/cbt";

interface CbtGuruDashboardProps {
  students: CbtStudent[];
  classes: CbtClass[];
  questions: QuestionBankItem[];
  exams: CbtExam[];
  attempts: ExamAttempt[];
  results: ExamResultRecord[];
  onNavigate: (tab: string) => void;
}

export default function CbtGuruDashboard({
  students,
  classes,
  questions,
  exams,
  attempts,
  results,
  onNavigate,
}: CbtGuruDashboardProps) {
  const stats = useMemo(() => {
    const testedStudentIds = new Set(attempts.map((a) => a.student_id));
    const testedCount = students.filter((s) => testedStudentIds.has(s.id)).length;
    const untestedCount = Math.max(0, students.length - testedCount);

    const scores = results.map((r) => Number(r.final_score));
    const avgScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      totalStudents: students.length,
      totalClasses: classes.length,
      totalQuestions: questions.length,
      totalExams: exams.length,
      testedCount,
      untestedCount,
      avgScore: avgScore.toFixed(1),
      maxScore: maxScore.toFixed(1),
      minScore: minScore.toFixed(1),
    };
  }, [students, classes, questions, exams, attempts, results]);

  // Chart 1: Grafik Nilai Siswa (Top 10 / Terbaru)
  const studentScoreChartData = useMemo(() => {
    return results.slice(0, 10).map((r) => ({
      name: (r.students?.full_name || "Siswa").split(" ").slice(0, 2).join(" "),
      nilai: Number(r.final_score),
      kktp: Number(r.kktp || 75),
    }));
  }, [results]);

  // Chart 2: Grafik Ketuntasan
  const completionPieData = useMemo(() => {
    const tuntas = results.filter((r) => r.completion_status === "Tuntas").length;
    const belum = results.filter((r) => r.completion_status === "Belum Tuntas").length;
    const pending = results.filter((r) => r.completion_status === "Menunggu Koreksi").length;
    return [
      { name: "Tuntas", value: tuntas, color: "#0EA5E9" },
      { name: "Belum Tuntas", value: belum, color: "#F59E0B" },
      { name: "Menunggu Koreksi", value: pending, color: "#64748B" },
    ].filter((d) => d.value > 0);
  }, [results]);

  // Chart 3: Grafik Hasil Ujian Setiap Kelas
  const classResultsChartData = useMemo(() => {
    return classes.map((cls) => {
      const clsResults = results.filter((r) => r.students?.class_id === cls.id);
      const avg =
        clsResults.length > 0
          ? Number(
              (
                clsResults.reduce((s, r) => s + Number(r.final_score), 0) / clsResults.length
              ).toFixed(1)
            )
          : 0;
      return {
        kelas: cls.class_name,
        rataRata: avg,
        peserta: clsResults.length,
      };
    });
  }, [classes, results]);

  // Chart 4: Statistik Aktivitas Ujian per Tanggal
  const activityChartData = useMemo(() => {
    const grouped = new Map<string, number>();
    attempts.forEach((att) => {
      const day = att.started_at ? att.started_at.slice(0, 10) : "Lainnya";
      grouped.set(day, (grouped.get(day) || 0) + 1);
    });
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([tanggal, jumlah]) => ({ tanggal, jumlah }));
  }, [attempts]);

  const statCards = [
    {
      label: "Jumlah Siswa",
      value: stats.totalStudents,
      icon: Users,
      accent: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
      target: "data",
    },
    {
      label: "Jumlah Kelas",
      value: stats.totalClasses,
      icon: School,
      accent: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      target: "data",
    },
    {
      label: "Jumlah Bank Soal",
      value: stats.totalQuestions,
      icon: FileQuestion,
      accent: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      target: "bank-soal",
    },
    {
      label: "Jumlah Ujian",
      value: stats.totalExams,
      icon: ClipboardList,
      accent: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      target: "ujian",
    },
    {
      label: "Sudah Ujian",
      value: stats.testedCount,
      icon: UserCheck,
      accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      target: "hasil",
    },
    {
      label: "Belum Ujian",
      value: stats.untestedCount,
      icon: UserX,
      accent: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
      target: "hasil",
    },
    {
      label: "Rata-rata Nilai",
      value: stats.avgScore,
      icon: TrendingUp,
      accent: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      target: "hasil",
    },
    {
      label: "Tertinggi / Terendah",
      value: `${stats.maxScore} / ${stats.minScore}`,
      icon: Award,
      accent: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      target: "analisis",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0B1B3B] via-[#0F2752] to-[#13346E] text-white p-5 sm:p-6 border border-sky-400/20 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Ringkasan Pelaksanaan Ujian PAI
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold mt-1">
            Dashboard Guru CBT PAI SMART
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/85 mt-1">
            Pantau kesiapan bank soal, jadwal ujian kelas VII–IX, progres pengerjaan siswa, dan analisis capaian nilai secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("bank-soal")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer cbt-transition"
          >
            + Tambah Bank Soal
          </button>
          <button
            type="button"
            onClick={() => onNavigate("ujian")}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md cursor-pointer cbt-transition"
          >
            + Buat Ujian Baru
          </button>
        </div>
      </div>

      {/* 8 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.target)}
              className="text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-xs hover:shadow-md cursor-pointer cbt-transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 cbt-transition" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1B3B] dark:text-white tabular-nums tracking-tight">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {card.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4 Recharts Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Grafik Nilai Siswa */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B1B3B] dark:text-white">
                Grafik Nilai Siswa Terbaru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perbandingan skor akhir dengan batas ketuntasan (KKTP)
              </p>
            </div>
          </div>
          {studentScoreChartData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Belum ada data nilai ujian siswa.
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentScoreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="nilai" name="Nilai Akhir" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 2. Grafik Ketuntasan */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B1B3B] dark:text-white">
              Grafik Ketuntasan Ujian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proporsi siswa Tuntas, Belum Tuntas, & Menunggu Koreksi Esai
            </p>
          </div>
          {completionPieData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Belum ada hasil ketuntasan ujian.
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={84}
                    paddingAngle={4}
                  >
                    {completionPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 3. Grafik Hasil Ujian Setiap Kelas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B1B3B] dark:text-white">
              Grafik Hasil Ujian per Kelas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rata-rata nilai Pendidikan Agama Islam per rombongan belajar
            </p>
          </div>
          {classResultsChartData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Belum ada data kelas terdaftar.
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classResultsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                  <XAxis dataKey="kelas" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="rataRata" name="Rata-rata Nilai" fill="#D97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 4. Statistik Aktivitas Ujian */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B1B3B] dark:text-white">
              Statistik Aktivitas Ujian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tren partisipasi sesi ujian siswa per tanggal pelaksanaan
            </p>
          </div>
          {activityChartData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Belum ada aktivitas pengerjaan ujian.
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="jumlah"
                    name="Sesi Ujian"
                    stroke="#0EA5E9"
                    fill="#0EA5E9"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
