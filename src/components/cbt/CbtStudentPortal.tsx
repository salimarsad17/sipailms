/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import {
  GraduationCap,
  Play,
  Clock,
  Calendar,
  Award,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ActivityLog,
  CbtExam,
  CbtStudent,
  ExamAttempt,
  ExamResultRecord,
} from "../../types/cbt";
import CbtStudentExamRunner from "./CbtStudentExamRunner";

interface CbtStudentPortalProps {
  student: CbtStudent | null;
  exams: CbtExam[];
  attempts: ExamAttempt[];
  results: ExamResultRecord[];
  activityLogs: ActivityLog[];
  onRefresh: () => Promise<void>;
}

export default function CbtStudentPortal({
  student,
  exams,
  attempts,
  results,
  activityLogs,
  onRefresh,
}: CbtStudentPortalProps) {
  const [activeExam, setActiveExam] = useState<CbtExam | null>(null);
  const [tab, setTab] = useState<"exams" | "history" | "activity">("exams");

  const attemptsByExam = useMemo(() => {
    const map = new Map<string, ExamAttempt[]>();
    attempts.forEach((a) => {
      const list = map.get(a.exam_id) || [];
      list.push(a);
      map.set(a.exam_id, list);
    });
    return map;
  }, [attempts]);

  if (!student) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-red-200 dark:border-red-900 text-center space-y-2 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-display font-extrabold text-base">Profil Siswa Belum Terhubung</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Akun login Anda belum terhubung ke baris data <code>students</code>. Hubungi Guru PAI untuk mendaftarkan NISN dan kelas Anda.
        </p>
      </div>
    );
  }

  if (activeExam) {
    return (
      <CbtStudentExamRunner
        exam={activeExam}
        student={student}
        onExit={() => setActiveExam(null)}
        onCompleted={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Identity Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1B3B] via-[#0F2752] to-[#13346E] text-white border border-sky-400/20 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Identitas Peserta Ujian
            </span>
            <h2 className="font-display text-lg sm:text-xl font-extrabold">{student.full_name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-100 mt-1 font-mono-code">
              <span>Kelas: {student.classes?.class_name || "-"}</span>
              <span>•</span>
              <span>No. Peserta: {student.participant_number || `CBT-${student.nisn}`}</span>
              <span>•</span>
              <span>NISN: {student.nisn}</span>
            </div>
          </div>
        </div>

        <div className="flex bg-white/10 p-1 rounded-xl border border-white/15 self-start sm:self-auto">
          {[
            { id: "exams", label: "Daftar Ujian" },
            { id: "history", label: "Riwayat & Nilai" },
            { id: "activity", label: "Aktivitas" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer cbt-transition ${
                tab === item.id ? "bg-amber-400 text-slate-950" : "text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Daftar Ujian Tersedia */}
      {tab === "exams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.length === 0 ? (
            <div className="md:col-span-2 p-10 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Clock className="w-9 h-9 mx-auto text-sky-500/70" />
              <h3 className="font-display font-bold text-base">Belum Ada Ujian Aktif</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ujian Pendidikan Agama Islam akan muncul di sini saat Guru menerbitkan jadwal ujian untuk kelas Anda.
              </p>
            </div>
          ) : (
            exams.map((ex) => {
              const exAttempts = attemptsByExam.get(ex.id) || [];
              const maxAtt = Number(ex.settings?.max_attempts || 1);
              const inProgress = exAttempts.find((a) => a.status === "in_progress");
              const completed = exAttempts.length >= maxAtt && !inProgress;

              return (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-sky-600 dark:text-sky-300">{ex.exam_type}</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Semester {ex.semester}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-extrabold text-[#0B1B3B] dark:text-white">
                      {ex.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        {ex.exam_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {ex.duration} Menit
                      </span>
                      <span>
                        Percobaan: {exAttempts.length}/{maxAtt}
                      </span>
                    </div>
                  </div>

                  {completed ? (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ujian Selesai Dikerjakan</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveExam(ex)}
                      className="w-full py-2.5 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 hover:bg-[#13316B] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-amber-400" />
                      <span>{inProgress ? "Lanjutkan Ujian" : "Kerjakan Ujian"}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Riwayat & Hasil Ujian */}
      {tab === "history" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-extrabold text-base">Riwayat & Hasil Ujian</h3>
          </div>

          {results.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              Belum ada hasil ujian yang dipublikasikan oleh Guru.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 pr-4">Nama Ujian</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Benar / Salah</th>
                    <th className="py-2.5 px-3">Nilai Akhir</th>
                    <th className="py-2.5 pl-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 pr-4 font-bold">{r.exams?.title || "-"}</td>
                      <td className="py-3 px-3">{r.exams?.exam_date || "-"}</td>
                      <td className="py-3 px-3">
                        {r.total_correct} / {r.total_wrong}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-sky-600 dark:text-sky-400">
                        {Number(r.final_score).toFixed(1)}
                      </td>
                      <td className="py-3 pl-3 font-bold">
                        <span
                          className={
                            r.completion_status === "Tuntas"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {r.completion_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Riwayat Aktivitas Siswa */}
      {tab === "activity" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-500" />
            <h3 className="font-display font-extrabold text-base">Riwayat Aktivitas Ujian</h3>
          </div>
          {activityLogs.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              Belum ada catatan aktivitas.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <strong className="text-sky-700 dark:text-sky-300">{log.action}</strong>
                    <p className="text-slate-600 dark:text-slate-300">{log.detail}</p>
                  </div>
                  <span className="text-slate-400 font-mono-code shrink-0">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
