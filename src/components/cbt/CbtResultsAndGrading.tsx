/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  FileDown,
  Edit3,
  Eye,
  EyeOff,
  X,
  Award,
  AlertTriangle,
} from "lucide-react";
import {
  CbtClass,
  CbtExam,
  ExamQuestionLink,
  ExamResultRecord,
  SchoolSettings,
  StudentAnswerRecord,
} from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";
import { cbtExportService } from "../../services/cbtExportService";

interface CbtResultsAndGradingProps {
  results: ExamResultRecord[];
  classes: CbtClass[];
  exams: CbtExam[];
  school: SchoolSettings | null;
  onRefresh: () => Promise<void>;
}

export default function CbtResultsAndGrading({
  results,
  classes,
  exams,
  school,
  onRefresh,
}: CbtResultsAndGradingProps) {
  const [filterClass, setFilterClass] = useState("ALL");
  const [filterExam, setFilterExam] = useState("ALL");
  const [filterSemester, setFilterSemester] = useState("ALL");
  const [viewMode, setViewMode] = useState<"semua" | "remedial" | "per_siswa">("semua");

  // Manual Essay Grading Modal State
  const [gradingTarget, setGradingTarget] = useState<ExamResultRecord | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionLink[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswerRecord[]>([]);
  const [essayScores, setEssayScores] = useState<Record<string, number>>({});
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);

  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        if (filterClass !== "ALL" && r.students?.class_id !== filterClass) return false;
        if (filterExam !== "ALL" && r.exam_id !== filterExam) return false;
        if (filterSemester !== "ALL" && r.exams?.semester !== filterSemester) return false;
        if (viewMode === "remedial" && r.completion_status !== "Belum Tuntas") return false;
        return true;
      })
      .sort((a, b) => Number(b.final_score) - Number(a.final_score));
  }, [results, filterClass, filterExam, filterSemester, viewMode]);

  const summary = useMemo(() => {
    const scores = filteredResults.map((r) => Number(r.final_score));
    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0.0";
    const max = scores.length ? Math.max(...scores).toFixed(1) : "0.0";
    const min = scores.length ? Math.min(...scores).toFixed(1) : "0.0";
    const remedialCount = filteredResults.filter((r) => r.completion_status === "Belum Tuntas").length;
    return { avg, max, min, remedialCount };
  }, [filteredResults]);

  const openManualGrading = async (res: ExamResultRecord) => {
    setGradingTarget(res);
    setTeacherFeedback(res.teacher_feedback || "");
    try {
      const [eq, sa] = await Promise.all([
        cbtSupabaseService.getExamQuestionsForTeacher(res.exam_id),
        cbtSupabaseService.getAnswersForAttempt(res.attempt_id),
      ]);
      setExamQuestions(eq);
      setStudentAnswers(sa);
      const map: Record<string, number> = {};
      sa.forEach((a) => {
        map[a.question_id] = Number(a.score_obtained || 0);
      });
      setEssayScores(map);
    } catch {
      setExamQuestions([]);
      setStudentAnswers([]);
    }
  };

  const handleSaveManualGrades = async () => {
    if (!gradingTarget) return;
    setSavingGrade(true);
    try {
      const manualItems = examQuestions.filter(
        (eq) =>
          eq.question_bank?.question_type === "esai" ||
          eq.question_bank?.question_type === "isian_singkat"
      );
      await cbtSupabaseService.gradeEssay({
        attemptId: gradingTarget.attempt_id,
        grades: manualItems.map((eq) => ({
          questionId: eq.question_id,
          scoreObtained: Number(essayScores[eq.question_id] || 0),
        })),
        teacherFeedback,
        publishResult: true,
      });
      await onRefresh();
      setGradingTarget(null);
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1B3B] dark:text-white">
            Hasil Ujian, Koreksi Esai & Rekap Nilai
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peringkat nilai, daftar siswa remedial, koreksi esai manual, ekspor Excel & cetak laporan PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={filteredResults.length === 0}
            onClick={() => cbtExportService.exportResultsToExcel(filteredResults)}
            className="px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
          <button
            type="button"
            disabled={filteredResults.length === 0}
            onClick={() => cbtExportService.exportResultsToPdf(filteredResults, school)}
            className="px-3.5 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Filters + Mode Tabs */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          value={filterExam}
          onChange={(e) => setFilterExam(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Ujian</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.class_name}
            </option>
          ))}
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Semester</option>
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {[
            { id: "semua", label: "Peringkat" },
            { id: "remedial", label: `Remedial (${summary.remedialCount})` },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setViewMode(m.id as any)}
              className={`flex-1 py-1 rounded-lg cursor-pointer ${
                viewMode === m.id ? "bg-[#0B1B3B] dark:bg-sky-600 text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Rata-rata Kelas</div>
          <div className="font-display text-xl font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
            {summary.avg}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Nilai Tertinggi</div>
          <div className="font-display text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {summary.max}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Nilai Terendah</div>
          <div className="font-display text-xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {summary.min}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {filteredResults.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 dark:text-slate-400">
            Belum ada hasil ujian yang tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">NIS / NISN</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Nama Ujian</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Benar / Salah</th>
                  <th className="p-3">Nilai Akhir</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
                {filteredResults.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-extrabold text-sky-600 dark:text-sky-400">{idx + 1}</td>
                    <td className="p-3 font-bold">{r.students?.full_name || "-"}</td>
                    <td className="p-3 font-mono-code">
                      {r.students?.nis || "-"} / {r.students?.nisn || "-"}
                    </td>
                    <td className="p-3">{r.students?.classes?.class_name || "-"}</td>
                    <td className="p-3 font-semibold">{r.exams?.title || "-"}</td>
                    <td className="p-3">{r.exams?.exam_date || "-"}</td>
                    <td className="p-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {r.total_correct}
                      </span>{" "}
                      /{" "}
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {r.total_wrong}
                      </span>
                    </td>
                    <td className="p-3 font-display text-sm font-extrabold">
                      {Number(r.final_score).toFixed(1)}
                    </td>
                    <td className="p-3 font-bold">
                      <span
                        className={
                          r.completion_status === "Tuntas"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : r.completion_status === "Menunggu Koreksi"
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-amber-600 dark:text-amber-400"
                        }
                      >
                        {r.completion_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openManualGrading(r)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Koreksi Esai & Beri Catatan"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await cbtSupabaseService.publishResultToStudent(
                              r.id,
                              !r.is_published_to_student
                            );
                            await onRefresh();
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title={
                            r.is_published_to_student
                              ? "Sembunyikan dari Siswa"
                              : "Tampilkan Nilai ke Siswa"
                          }
                        >
                          {r.is_published_to_student ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Koreksi Esai */}
      {gradingTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-[#0B1B3B] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-[#0B1B3B] text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-sm sm:text-base">
                  Koreksi Jawaban Esai — {gradingTarget.students?.full_name}
                </h3>
                <p className="text-[11px] text-sky-200">{gradingTarget.exams?.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setGradingTarget(null)}
                className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {examQuestions
                .filter(
                  (eq) =>
                    eq.question_bank?.question_type === "esai" ||
                    eq.question_bank?.question_type === "isian_singkat"
                )
                .map((eq, idx) => {
                  const ans = studentAnswers.find((a) => a.question_id === eq.question_id);
                  return (
                    <div
                      key={eq.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="font-bold text-[#0B1B3B] dark:text-white">
                        #{idx + 1} (Maks Skor: {eq.score}) — {eq.question_bank?.question_text}
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          Jawaban Siswa:
                        </span>
                        <p className="whitespace-pre-wrap">{ans?.answer?.text || "(Tidak dijawab)"}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <label className="font-bold">Berikan Skor (0 – {eq.score}):</label>
                        <input
                          type="number"
                          min={0}
                          max={eq.score}
                          value={essayScores[eq.question_id] ?? 0}
                          onChange={(e) =>
                            setEssayScores({
                              ...essayScores,
                              [eq.question_id]: Math.min(Number(eq.score), Math.max(0, Number(e.target.value))),
                            })
                          }
                          className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center tabular-nums"
                        />
                      </div>
                    </div>
                  );
                })}

              <div>
                <label className="block text-xs font-bold mb-1">Umpan Balik / Catatan Guru</label>
                <textarea
                  rows={2}
                  value={teacherFeedback}
                  onChange={(e) => setTeacherFeedback(e.target.value)}
                  placeholder="Catatan pembinaan untuk siswa..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingGrade}
                onClick={handleSaveManualGrades}
                className="px-5 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
              >
                {savingGrade ? "Menghitung Ulang..." : "Simpan Skor & Hitung Nilai Akhir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
