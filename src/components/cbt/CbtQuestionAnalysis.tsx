/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, Sparkles, AlertTriangle } from "lucide-react";
import { CbtExam, ExamResultRecord } from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";

interface CbtQuestionAnalysisProps {
  exams: CbtExam[];
  results: ExamResultRecord[];
}

export default function CbtQuestionAnalysis({ exams, results }: CbtQuestionAnalysisProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const rows = await cbtSupabaseService.getAllAnswersForAnalysis(selectedExamId || undefined);
        setAnswers(rows);
      } catch {
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedExamId]);

  const itemStats = useMemo(() => {
    const grouped = new Map<string, { text: string; items: any[] }>();
    answers.forEach((a) => {
      const qid = a.question_id;
      const entry = grouped.get(qid) || {
        text: a.question_bank?.question_text || "Soal",
        items: [],
      };
      entry.items.push(a);
      grouped.set(qid, entry);
    });

    const list = Array.from(grouped.entries()).map(([qid, g]) => {
      const total = g.items.length;
      const correct = g.items.filter((i) => i.is_correct === true).length;
      const wrong = total - correct;
      const pIndex = total > 0 ? correct / total : 0;

      // Daya pembeda (Upper 50% vs Lower 50% berdasarkan total skor attempt)
      const sorted = [...g.items].sort(
        (a, b) => Number(b.exam_attempts?.score || 0) - Number(a.exam_attempts?.score || 0)
      );
      const half = Math.max(1, Math.floor(sorted.length / 2));
      const upper = sorted.slice(0, half);
      const lower = sorted.slice(-half);
      const pUpper = upper.length ? upper.filter((x) => x.is_correct).length / upper.length : 0;
      const pLower = lower.length ? lower.filter((x) => x.is_correct).length / lower.length : 0;
      const dIndex = Number((pUpper - pLower).toFixed(2));

      const difficultyLabel =
        pIndex >= 0.7 ? "Mudah" : pIndex >= 0.31 ? "Sedang" : "Sulit";

      return {
        id: qid,
        questionText: g.text,
        total,
        correctPct: Number((pIndex * 100).toFixed(1)),
        wrongPct: Number((((wrong / Math.max(1, total)) * 100)).toFixed(1)),
        pIndex: Number(pIndex.toFixed(2)),
        dIndex,
        difficultyLabel,
      };
    });

    return list.sort((a, b) => b.correctPct - a.correctPct);
  }, [answers]);

  const easiest = itemStats[0] || null;
  const hardest = itemStats.length > 0 ? itemStats[itemStats.length - 1] : null;

  const scoreDistribution = useMemo(() => {
    const targetResults = selectedExamId
      ? results.filter((r) => r.exam_id === selectedExamId)
      : results;
    const buckets = [
      { range: "0–49", count: 0 },
      { range: "50–64", count: 0 },
      { range: "65–74", count: 0 },
      { range: "75–89", count: 0 },
      { range: "90–100", count: 0 },
    ];
    targetResults.forEach((r) => {
      const s = Number(r.final_score);
      if (s < 50) buckets[0].count++;
      else if (s < 65) buckets[1].count++;
      else if (s < 75) buckets[2].count++;
      else if (s < 90) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [results, selectedExamId]);

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1B3B] dark:text-white">
            Analisis Butir Soal & Distribusi Nilai
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Indeks kesukaran (P), daya pembeda (D), persentase benar/salah, soal termudah & tersulit.
          </p>
        </div>

        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold"
        >
          <option value="">Semua Ujian</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>
      </div>

      {/* Easiest vs Hardest Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-emerald-200 dark:border-emerald-900/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Soal Paling Mudah</span>
          </div>
          {easiest ? (
            <>
              <p className="text-sm font-bold line-clamp-2">{easiest.questionText}</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Benar: <strong className="text-emerald-600">{easiest.correctPct}%</strong> • Indeks P:{" "}
                <strong>{easiest.pIndex}</strong>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Belum ada data jawaban siswa.</p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-amber-200 dark:border-amber-900/60 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Soal Paling Sulit</span>
          </div>
          {hardest ? (
            <>
              <p className="text-sm font-bold line-clamp-2">{hardest.questionText}</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Benar: <strong className="text-amber-600">{hardest.correctPct}%</strong> • Indeks P:{" "}
                <strong>{hardest.pIndex}</strong>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Belum ada data jawaban siswa.</p>
          )}
        </div>
      </div>

      {/* Distribusi Nilai Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-500" />
          <h3 className="font-display text-sm font-extrabold">Distribusi Nilai Siswa</h3>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Jumlah Siswa" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Item Analysis Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Menghitung analisis soal...</div>
        ) : itemStats.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Belum ada data jawaban siswa untuk dianalisis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Pertanyaan Soal</th>
                  <th className="p-3">Respon</th>
                  <th className="p-3">% Benar</th>
                  <th className="p-3">% Salah</th>
                  <th className="p-3">Kesukaran (P)</th>
                  <th className="p-3">Daya Pembeda (D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
                {itemStats.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-3 font-bold">{idx + 1}</td>
                    <td className="p-3 max-w-md truncate font-medium">{item.questionText}</td>
                    <td className="p-3">{item.total}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {item.correctPct}%
                    </td>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">
                      {item.wrongPct}%
                    </td>
                    <td className="p-3">
                      {item.pIndex} ({item.difficultyLabel})
                    </td>
                    <td className="p-3 font-bold">{item.dIndex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
