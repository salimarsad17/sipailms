/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  Wifi,
  WifiOff,
  AlertTriangle,
  Play,
  Send,
  ShieldCheck,
  Award,
  ArrowLeft,
} from "lucide-react";
import {
  CbtExam,
  CbtStudent,
  ExamAttempt,
  ExamResultRecord,
  MatchingPairOption,
  QuestionOptionItem,
  SanitizedExamQuestion,
} from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";

interface CbtStudentExamRunnerProps {
  exam: CbtExam;
  student: CbtStudent;
  onExit: () => void;
  onCompleted: () => Promise<void>;
}

export default function CbtStudentExamRunner({
  exam,
  student,
  onExit,
  onCompleted,
}: CbtStudentExamRunnerProps) {
  const [phase, setPhase] = useState<"prestart" | "running" | "finished">("prestart");
  const [accessCode, setAccessCode] = useState("");
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<SanitizedExamQuestion[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<string, Record<string, any>>>({});
  const [flaggedSet, setFlaggedSet] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(exam.duration * 60);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [syncState, setSyncState] = useState<"synced" | "saving" | "offline">("synced");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [submitOutcome, setSubmitOutcome] = useState<{
    showResultToStudent?: boolean;
    hasPendingManual?: boolean;
    result: ExamResultRecord | null;
  } | null>(null);

  const hasAutoSubmittedRef = useRef(false);
  const perPage = exam.settings?.questions_per_page === 5 ? 5 : 1;

  const queueKey = attempt ? `cbt_offline_queue_${attempt.id}` : "";
  const localDraftKey = `cbt_active_session_${exam.id}_${student.id}`;

  // Monitor network reconnect & resync offline answers
  const flushOfflineQueue = useCallback(async () => {
    if (!attempt || !navigator.onLine) return;
    try {
      const raw = localStorage.getItem(`cbt_offline_queue_${attempt.id}`);
      if (!raw) return;
      const queued: Record<string, { answer: any; isFlagged: boolean; savedAt: string }> =
        JSON.parse(raw);
      const entries = Object.entries(queued);
      if (entries.length === 0) return;
      setSyncState("saving");
      for (const [qid, item] of entries) {
        await cbtSupabaseService.saveAnswer({
          attemptId: attempt.id,
          questionId: qid,
          answer: item.answer,
          isFlagged: item.isFlagged,
          flaggedQuestions: Array.from(flaggedSet),
        });
      }
      localStorage.removeItem(`cbt_offline_queue_${attempt.id}`);
      setSyncState("synced");
    } catch {
      setSyncState("offline");
    }
  }, [attempt, flaggedSet]);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      flushOfflineQueue();
    };
    const onOffline = () => {
      setIsOnline(false);
      setSyncState("offline");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [flushOfflineQueue]);

  // Resume session automatically if student reloaded browser during active attempt
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(localDraftKey);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.autoResume) {
          handleStartExam(undefined, true);
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartExam = async (e?: React.FormEvent, isResume = false) => {
    if (e) e.preventDefault();
    setError("");
    setStarting(true);
    try {
      const data = await cbtSupabaseService.startExam(exam.id, isResume ? exam.access_code : accessCode);
      setAttempt(data.attempt);
      setQuestions(data.questions || []);

      const initialAns: Record<string, Record<string, any>> = {};
      (data.savedAnswers || []).forEach((sa) => {
        initialAns[sa.question_id] = sa.answer || {};
      });

      // Merge any unsynced offline local answers
      try {
        const offlineRaw = localStorage.getItem(`cbt_offline_queue_${data.attempt.id}`);
        if (offlineRaw) {
          const offlineParsed = JSON.parse(offlineRaw);
          Object.entries(offlineParsed).forEach(([qid, val]: [string, any]) => {
            initialAns[qid] = val.answer;
          });
        }
      } catch {
        // ignore
      }

      setAnswersMap(initialAns);
      setFlaggedSet(
        new Set<string>(
          Array.isArray(data.attempt.flagged_questions)
            ? data.attempt.flagged_questions.map(String)
            : []
        )
      );

      const startedMs = new Date(data.attempt.started_at).getTime();
      const totalSec = Number(data.exam.duration || exam.duration) * 60;
      const elapsedSec = Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
      setSecondsLeft(Math.max(0, totalSec - elapsedSec));

      localStorage.setItem(localDraftKey, JSON.stringify({ autoResume: true, attemptId: data.attempt.id }));
      setPhase("running");
    } catch (err: any) {
      setError(err?.message || "Gagal memulai ujian. Periksa kode akses atau jadwal.");
    } finally {
      setStarting(false);
    }
  };

  const persistAnswer = async (questionId: string, newAnswer: Record<string, any>) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: newAnswer }));
    if (!attempt) return;

    const isFlagged = flaggedSet.has(questionId);
    // Always write offline fallback queue first
    try {
      const existing = JSON.parse(localStorage.getItem(queueKey) || "{}");
      existing[questionId] = {
        answer: newAnswer,
        isFlagged,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(queueKey, JSON.stringify(existing));
    } catch {
      // ignore
    }

    if (!navigator.onLine) {
      setSyncState("offline");
      return;
    }

    setSyncState("saving");
    try {
      await cbtSupabaseService.saveAnswer({
        attemptId: attempt.id,
        questionId,
        answer: newAnswer,
        isFlagged,
        flaggedQuestions: Array.from(flaggedSet),
      });
      // Remove from offline queue on success
      try {
        const existing = JSON.parse(localStorage.getItem(queueKey) || "{}");
        delete existing[questionId];
        if (Object.keys(existing).length === 0) localStorage.removeItem(queueKey);
        else localStorage.setItem(queueKey, JSON.stringify(existing));
      } catch {
        // ignore
      }
      setSyncState("synced");
    } catch {
      setSyncState("offline");
    }
  };

  const toggleFlagQuestion = async (questionId: string) => {
    const next = new Set<string>(flaggedSet);
    if (next.has(questionId)) next.delete(questionId);
    else next.add(questionId);
    setFlaggedSet(next);
    if (!attempt || !navigator.onLine) return;
    try {
      await cbtSupabaseService.saveAnswer({
        attemptId: attempt.id,
        questionId,
        answer: answersMap[questionId] || {},
        isFlagged: next.has(questionId),
        flaggedQuestions: Array.from(next),
      });
    } catch {
      // ignore
    }
  };

  const handleSubmitExam = useCallback(async () => {
    if (!attempt || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      let bulkAnswers: any[] = [];
      try {
        const qRaw = localStorage.getItem(`cbt_offline_queue_${attempt.id}`);
        if (qRaw) {
          const parsed = JSON.parse(qRaw);
          bulkAnswers = Object.entries(parsed).map(([qid, v]: [string, any]) => ({
            questionId: qid,
            answer: v.answer,
            isFlagged: v.isFlagged,
            savedAt: v.savedAt,
          }));
        }
      } catch {
        // ignore
      }

      const res = await cbtSupabaseService.submitExam(attempt.id, bulkAnswers);
      localStorage.removeItem(`cbt_offline_queue_${attempt.id}`);
      localStorage.removeItem(localDraftKey);
      setSubmitOutcome({
        showResultToStudent: res.showResultToStudent,
        hasPendingManual: res.hasPendingManual,
        result: res.result,
      });
      setShowConfirmModal(false);
      setPhase("finished");
      await onCompleted();
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim jawaban. Pastikan koneksi internet aktif.");
    } finally {
      setSubmitting(false);
    }
  }, [attempt, localDraftKey, onCompleted, submitting]);

  // Countdown Timer + Auto-submit when 0
  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasAutoSubmittedRef.current) {
            hasAutoSubmittedRef.current = true;
            handleSubmitExam();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, handleSubmitExam]);

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const isQuestionAnswered = (q: SanitizedExamQuestion) => {
    const ans = answersMap[q.id];
    if (!ans) return false;
    if (q.question_type === "pilihan_ganda" || q.question_type === "benar_salah") {
      return Boolean(ans.value);
    }
    if (q.question_type === "pilihan_ganda_kompleks") {
      return Array.isArray(ans.values) && ans.values.length > 0;
    }
    if (q.question_type === "menjodohkan") {
      return ans.pairs && Object.keys(ans.pairs).length > 0;
    }
    return Boolean(String(ans.text || "").trim());
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => isQuestionAnswered(q)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, answersMap]
  );

  const visibleQuestions = useMemo(() => {
    if (perPage === 1) return questions.slice(currentIndex, currentIndex + 1);
    const pageStart = Math.floor(currentIndex / perPage) * perPage;
    return questions.slice(pageStart, pageStart + perPage);
  }, [questions, currentIndex, perPage]);

  // =================== PHASE 1: PRE-START CARD ===================
  if (phase === "prestart") {
    return (
      <div className="max-w-2xl mx-auto py-4 sm:py-8">
        <button
          type="button"
          onClick={onExit}
          className="mb-4 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Ujian</span>
        </button>

        <div className="rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#0B1B3B] to-[#13346E] text-white border-b border-amber-400/30">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Konfirmasi Peserta Ujian CBT</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold mt-1">{exam.title}</h2>
          </div>

          <form onSubmit={(e) => handleStartExam(e, false)} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Nama Siswa</span>
                <strong className="text-[#0B1B3B] dark:text-white">{student.full_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Nomor Peserta</span>
                <strong className="font-mono-code text-sky-700 dark:text-sky-300">
                  {student.participant_number || `CBT-${student.nisn}`}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Kelas</span>
                <strong>{student.classes?.class_name || `Kelas ${exam.grade_level}`}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Jumlah Soal & Durasi</span>
                <strong className="tabular-nums">
                  {exam.settings?.question_count || 0} Soal • {exam.duration} Menit
                </strong>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5">
                Masukkan Kode Akses Ujian dari Guru
              </label>
              <input
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Contoh: PAI2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono-code text-base font-extrabold tracking-widest uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={starting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B1B3B] to-[#13346E] hover:from-[#102756] hover:to-[#183E85] text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg border border-amber-400/40 cursor-pointer disabled:opacity-60"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{starting ? "Menyiapkan Soal Ujian..." : "MULAI UJIAN"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =================== PHASE 3: FINISHED SUMMARY ===================
  if (phase === "finished") {
    const res = submitOutcome?.result;
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-9 h-9" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-[#0B1B3B] dark:text-white">
              Ujian Telah Dikirimkan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Alhamdulillah, jawaban Anda untuk <strong>{exam.title}</strong> telah tersimpan aman di server.
            </p>
          </div>

          {submitOutcome?.showResultToStudent && res ? (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Nilai Akhir</span>
                <span className="font-display text-3xl font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
                  {Number(res.final_score).toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold tabular-nums">
                  Benar: {res.total_correct}
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold tabular-nums">
                  Salah: {res.total_wrong}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold tabular-nums">
                  Kosong: {res.total_unanswered}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span>Status Ketuntasan (KKTP {res.kktp})</span>
                <strong
                  className={
                    res.completion_status === "Tuntas"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {res.completion_status}
                </strong>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 font-semibold">
              {submitOutcome?.hasPendingManual
                ? "Ujian mengandung soal Esai / Isian yang memerlukan koreksi Guru. Nilai akhir akan tampil setelah dikoreksi."
                : "Sesuai pengaturan Guru, hasil nilai akan dipublikasikan setelah ujian selesai diperiksa."}
            </div>
          )}

          <button
            type="button"
            onClick={onExit}
            className="w-full py-3 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white font-bold text-sm cursor-pointer"
          >
            Kembali ke Portal Siswa
          </button>
        </div>
      </div>
    );
  }

  // =================== PHASE 2: ACTIVE CBT EXAM RUNNER ===================
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Sticky Top Exam Status Bar */}
      <div className="sticky top-2 z-20 p-3.5 sm:p-4 rounded-2xl bg-[#0B1B3B] text-white shadow-lg border border-sky-400/30 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display font-extrabold text-sm sm:text-base truncate">{exam.title}</h2>
          <div className="text-[11px] text-sky-200 flex items-center gap-3 mt-0.5 tabular-nums">
            <span>
              Terjawab: <strong>{answeredCount}</strong> / {questions.length} ({progressPct}%)
            </span>
            <span className="flex items-center gap-1">
              {isOnline && syncState !== "offline" ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{syncState === "saving" ? "Menyimpan..." : "Tersimpan"}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mode Offline (Antrean Lokal)</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-2 rounded-xl font-mono-code font-extrabold text-sm sm:text-base flex items-center gap-2 tabular-nums ${
              secondsLeft <= 300
                ? "bg-red-500/20 text-red-300 border border-red-400/50"
                : "bg-white/10 text-amber-300 border border-amber-400/30"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatCountdown(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-amber-400 cbt-transition"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Area */}
        <div className="lg:col-span-8 space-y-4">
          {visibleQuestions.map((q) => {
            const globalIdx = questions.findIndex((item) => item.id === q.id);
            const curAns = answersMap[q.id] || {};
            const isFlagged = flaggedSet.has(q.id);

            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0B1B3B] dark:bg-sky-600 text-white font-display font-extrabold text-xs tabular-nums">
                      Soal No. {globalIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Bobot {q.score}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlagQuestion(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border cursor-pointer cbt-transition ${
                      isFlagged
                        ? "bg-amber-400 text-slate-950 border-amber-500"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isFlagged ? "Ditandai Ragu" : "Tandai Tinjau"}</span>
                  </button>
                </div>

                {q.quran_arabic && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <p className="font-arabic text-2xl text-right text-[#0B1B3B] dark:text-amber-200">
                      {q.quran_arabic}
                    </p>
                    {q.quran_translation && (
                      <p className="text-xs italic text-slate-600 dark:text-slate-400">
                        "{q.quran_translation}"
                      </p>
                    )}
                  </div>
                )}

                {q.question_image && (
                  <img
                    src={q.question_image}
                    alt="Gambar soal"
                    className="max-h-64 rounded-xl border border-slate-200 dark:border-slate-700 object-contain"
                  />
                )}

                {q.table_data?.headers?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300 dark:border-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                          {q.table_data.headers.map((h, i) => (
                            <th key={i} className="p-2 border border-slate-300 dark:border-slate-700 text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {q.table_data.rows.map((r, ri) => (
                          <tr key={ri}>
                            {r.map((cell, ci) => (
                              <td key={ci} className="p-2 border border-slate-300 dark:border-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {q.audio_url && (
                  <audio controls src={q.audio_url} className="w-full" />
                )}

                {q.video_url && (
                  <video controls src={q.video_url} className="w-full max-h-60 rounded-xl" />
                )}

                <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                  {q.question_text}
                </p>

                {/* Render Input based on Question Type */}
                {(q.question_type === "pilihan_ganda" || q.question_type === "benar_salah") && (
                  <div className="space-y-2.5 pt-1">
                    {(q.options as QuestionOptionItem[]).map((opt) => {
                      const selected = curAns.value === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => persistAnswer(q.id, { value: opt.key })}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer cbt-transition ${
                            selected
                              ? "bg-sky-50 dark:bg-sky-900/50 border-sky-500 text-[#0B1B3B] dark:text-white font-bold shadow-xs"
                              : "bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-sky-300"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              selected
                                ? "bg-sky-600 text-white"
                                : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "pilihan_ganda_kompleks" && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-300">
                      Pilih satu atau lebih jawaban yang benar:
                    </p>
                    {(q.options as QuestionOptionItem[]).map((opt) => {
                      const vals: string[] = Array.isArray(curAns.values) ? curAns.values : [];
                      const selected = vals.includes(opt.key);
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            const nextVals = selected
                              ? vals.filter((x) => x !== opt.key)
                              : [...vals, opt.key];
                            persistAnswer(q.id, { values: nextVals });
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer cbt-transition ${
                            selected
                              ? "bg-sky-50 dark:bg-sky-900/50 border-sky-500 font-bold"
                              : "bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-extrabold border shrink-0 ${
                              selected
                                ? "bg-sky-600 border-sky-600 text-white"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {selected ? "✓" : opt.key}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "menjodohkan" && (
                  <div className="space-y-3 pt-1">
                    {(q.options as MatchingPairOption[]).map((pair) => {
                      const chosenMap = curAns.pairs || {};
                      return (
                        <div
                          key={pair.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center"
                        >
                          <div className="text-sm font-semibold">{pair.left}</div>
                          <select
                            value={chosenMap[pair.id] || ""}
                            onChange={(e) => {
                              const nextPairs = { ...chosenMap, [pair.id]: e.target.value };
                              persistAnswer(q.id, { pairs: nextPairs });
                            }}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                          >
                            <option value="">-- Pilih Pasangan --</option>
                            {(pair.rightPool || []).map((rOpt, ri) => (
                              <option key={ri} value={rOpt}>
                                {rOpt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(q.question_type === "isian_singkat" || q.question_type === "esai") && (
                  <div className="pt-1">
                    <textarea
                      rows={q.question_type === "esai" ? 5 : 2}
                      value={curAns.text || ""}
                      onChange={(e) => persistAnswer(q.id, { text: e.target.value })}
                      placeholder={
                        q.question_type === "isian_singkat"
                          ? "Ketik jawaban singkat Anda di sini..."
                          : "Uraikan jawaban esai Anda dengan lengkap dan jelas..."
                      }
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Prev / Next Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - perPage))}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1B3B] border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex + perPage < questions.length ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + perPage))
                }
                className="px-5 py-2.5 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Akhiri & Kumpulkan Ujian</span>
              </button>
            )}
          </div>
        </div>

        {/* Square Question Number Grid Sidebar */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-display text-sm font-extrabold text-[#0B1B3B] dark:text-white">
            Navigasi Nomor Soal
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent =
                idx >= Math.floor(currentIndex / perPage) * perPage &&
                idx < Math.floor(currentIndex / perPage) * perPage + perPage;
              const answered = isQuestionAnswered(q);
              const flagged = flaggedSet.has(q.id);

              let cls =
                "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
              if (answered) {
                cls = "bg-sky-600 text-white border-sky-700";
              }
              if (flagged) {
                cls = "bg-amber-400 text-slate-950 border-amber-500";
              }
              if (isCurrent) {
                cls += " ring-2 ring-offset-2 ring-[#0B1B3B] dark:ring-amber-400";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded-xl border font-display font-extrabold text-xs flex items-center justify-center cursor-pointer tabular-nums cbt-transition ${cls}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-sky-600 inline-block" />
              <span>Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 inline-block" />
              <span>Belum Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block" />
              <span>Ditandai Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded ring-2 ring-[#0B1B3B] dark:ring-amber-400 inline-block" />
              <span>Sedang Dibuka</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-base">Konfirmasi Akhiri Ujian</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pastikan seluruh jawaban telah diperiksa sebelum dikirim.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1 tabular-nums">
              <div className="flex justify-between">
                <span>Soal Terjawab:</span>
                <strong>
                  {answeredCount} dari {questions.length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Ditandai Ragu:</span>
                <strong>{flaggedSet.size} soal</strong>
              </div>
              <div className="flex justify-between">
                <span>Sisa Waktu:</span>
                <strong>{formatCountdown(secondsLeft)}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Mengirim..." : "Ya, Kumpulkan Jawaban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
