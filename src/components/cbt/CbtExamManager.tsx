/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  KeyRound,
  CheckSquare,
  Trash2,
  Edit3,
  PlayCircle,
  PauseCircle,
  FileText,
  X,
  Check,
} from "lucide-react";
import {
  CbtClass,
  CbtExam,
  CbtMaterial,
  ExamResultRecord,
  ExamSettings,
  ExamType,
  GradeLevel,
  QUESTION_TYPE_LABELS,
  QuestionBankItem,
  SchoolSettings,
  SemesterType,
} from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";
import { cbtExportService } from "../../services/cbtExportService";

interface CbtExamManagerProps {
  exams: CbtExam[];
  classes: CbtClass[];
  materials: CbtMaterial[];
  questions: QuestionBankItem[];
  results: ExamResultRecord[];
  school: SchoolSettings | null;
  currentUserId: string;
  onRefresh: () => Promise<void>;
}

const DEFAULT_SETTINGS: ExamSettings = {
  question_count: 10,
  default_question_score: 10,
  kktp: 75,
  shuffle_questions: true,
  shuffle_options: true,
  max_attempts: 1,
  show_result_mode: "immediate",
  allow_remedial: true,
  remedial_min_score: 75,
  questions_per_page: 1,
  complex_scoring_rule: "semua_benar",
};

export default function CbtExamManager({
  exams,
  classes,
  materials,
  questions,
  results,
  school,
  currentUserId,
  onRefresh,
}: CbtExamManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Exam Form Fields
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("VII");
  const [semester, setSemester] = useState<SemesterType>("Ganjil");
  const [materialId, setMaterialId] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [examType, setExamType] = useState<ExamType>("UH");
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startHour, setStartHour] = useState("07:30");
  const [endHour, setEndHour] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [accessCode, setAccessCode] = useState("");
  const [status, setStatus] = useState<CbtExam["status"]>("published");
  const [settings, setSettings] = useState<ExamSettings>(DEFAULT_SETTINGS);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [customScores, setCustomScores] = useState<Record<string, number>>({});

  // Quick Inline Question Creator inside Exam
  const [showInlineQuestion, setShowInlineQuestion] = useState(false);
  const [inlineText, setInlineText] = useState("");
  const [inlineOpts, setInlineOpts] = useState({ A: "", B: "", C: "", D: "" });
  const [inlineKey, setInlineKey] = useState("A");

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setAccessCode(code);
  };

  const openNewExam = () => {
    setEditingId(null);
    setTitle("");
    setClassId("");
    setGradeLevel("VII");
    setSemester("Ganjil");
    setMaterialId("");
    setMaterialName("");
    setExamType("UH");
    setExamDate(new Date().toISOString().slice(0, 10));
    setStartHour("07:30");
    setEndHour("17:00");
    setDuration(60);
    generateCode();
    setStatus("published");
    setSettings({ ...DEFAULT_SETTINGS });
    setSelectedQuestionIds([]);
    setCustomScores({});
    setIsModalOpen(true);
  };

  const openEditExam = async (exam: CbtExam) => {
    setEditingId(exam.id);
    setTitle(exam.title);
    setClassId(exam.class_id || "");
    setGradeLevel(exam.grade_level);
    setSemester(exam.semester);
    setMaterialId(exam.material_id || "");
    setMaterialName(exam.material_name || "");
    setExamType(exam.exam_type);
    setExamDate(exam.exam_date);
    setStartHour(new Date(exam.start_time).toTimeString().slice(0, 5));
    setEndHour(new Date(exam.end_time).toTimeString().slice(0, 5));
    setDuration(exam.duration);
    setAccessCode(exam.access_code);
    setStatus(exam.status);
    setSettings({ ...DEFAULT_SETTINGS, ...(exam.settings || {}) });

    try {
      const links = await cbtSupabaseService.getExamQuestionsForTeacher(exam.id);
      setSelectedQuestionIds(links.map((l) => l.question_id));
      const scMap: Record<string, number> = {};
      links.forEach((l) => {
        scMap[l.question_id] = Number(l.score);
      });
      setCustomScores(scMap);
    } catch {
      setSelectedQuestionIds([]);
    }
    setIsModalOpen(true);
  };

  const handleQuickAddQuestion = async () => {
    if (!inlineText.trim() || !inlineOpts.A.trim() || !inlineOpts.B.trim()) return;
    try {
      const created = await cbtSupabaseService.upsertQuestion({
        created_by: currentUserId,
        subject_name: "Pendidikan Agama Islam",
        grade_level: gradeLevel,
        semester,
        chapter_title: materialName || "Materi Ujian PAI",
        question_type: "pilihan_ganda",
        question_text: inlineText.trim(),
        options: (Object.entries(inlineOpts) as [string, string][])
          .filter(([, text]) => text.trim().length > 0)
          .map(([key, text]) => ({ key, text })),
        correct_answer: { value: inlineKey },
        difficulty: "Sedang",
        score: settings.default_question_score,
      });
      await onRefresh();
      setSelectedQuestionIds((prev) => [...prev, created.id]);
      setInlineText("");
      setInlineOpts({ A: "", B: "", C: "", D: "" });
      setShowInlineQuestion(false);
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "Gagal membuat soal cepat." });
    }
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMsg({ type: "err", text: "Nama ujian wajib diisi." });
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setMsg({ type: "err", text: "Pilih minimal 1 soal dari Bank Soal atau buat soal baru." });
      return;
    }

    const startIso = new Date(`${examDate}T${startHour}:00`).toISOString();
    const endIso = new Date(`${examDate}T${endHour}:00`).toISOString();

    setSaving(true);
    try {
      await cbtSupabaseService.saveExamWithQuestions(
        {
          ...(editingId ? { id: editingId } : {}),
          created_by: currentUserId,
          title: title.trim(),
          class_id: classId || null,
          grade_level: gradeLevel,
          semester,
          material_id: materialId || null,
          material_name: materialName.trim() || null,
          exam_type: examType,
          exam_date: examDate,
          start_time: startIso,
          end_time: endIso,
          duration: Number(duration) || 60,
          access_code: accessCode.trim() || "PAI2026",
          settings: {
            ...settings,
            question_count: selectedQuestionIds.length,
          },
          status,
        },
        selectedQuestionIds.map((qid, idx) => ({
          question_id: qid,
          question_order: idx + 1,
          score: Number(customScores[qid] ?? settings.default_question_score ?? 10),
        }))
      );
      await onRefresh();
      setIsModalOpen(false);
      setMsg({ type: "ok", text: "Ujian berhasil disimpan dan dijadwalkan." });
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "Gagal menyimpan ujian." });
    } finally {
      setSaving(false);
    }
  };

  const toggleQuestionPick = (qid: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
    );
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1B3B] dark:text-white">
            Manajemen & Pembuatan Ujian CBT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atur jadwal UH, PH, PTS, PAS, PAT, Sumatif, kode akses, pengacakan soal, KKTP, dan remedial.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewExam}
          className="px-4 py-2.5 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 hover:bg-[#13316B] text-white text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Buat Ujian Baru</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            msg.type === "ok"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
          <Calendar className="w-10 h-10 mx-auto text-sky-500/70" />
          <h3 className="font-display text-base font-bold">Belum Ada Jadwal Ujian</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Klik <strong>Buat Ujian Baru</strong> untuk menyusun ujian dari Bank Soal Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-sky-600 dark:text-sky-300">{ex.exam_type}</span>
                    <span className="text-slate-400">•</span>
                    <span>
                      {ex.classes?.class_name || `Kelas ${ex.grade_level}`} ({ex.semester})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span
                      className={
                        ex.status === "published" || ex.status === "ongoing"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {ex.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-extrabold text-[#0B1B3B] dark:text-white mt-1">
                    {ex.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono-code text-xs font-extrabold">
                  {ex.access_code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  <span>{ex.exam_date}</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{ex.duration} Menit</span>
                </div>
                <div>Soal: {ex.settings?.question_count || 0} Butir</div>
                <div>KKTP: {ex.settings?.kktp || 75}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEditExam(ex)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const nextStatus = ex.status === "closed" ? "published" : "closed";
                    await cbtSupabaseService.updateExamStatus(ex.id, nextStatus);
                    await onRefresh();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {ex.status === "closed" ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Buka Ujian</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tutup Ujian</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => cbtExportService.exportBeritaAcaraPdf(ex, results, school)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Berita Acara</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await cbtSupabaseService.deleteExam(ex.id);
                    await onRefresh();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat / Edit Ujian */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-[#0B1B3B] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 bg-[#0B1B3B] text-white flex items-center justify-between shrink-0">
              <h3 className="font-display font-extrabold text-base">
                {editingId ? "Edit Pengaturan Ujian" : "Buat Ujian CBT PAI Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">Nama Ujian *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: PTS Pendidikan Agama Islam Kelas VII"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Jenis Penilaian *</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as ExamType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
                  >
                    {(["UH", "PH", "PTS", "PAS", "PAT", "Sumatif"] as ExamType[]).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Kelas Spesifik</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="">Semua Kelas Jenjang</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.class_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Tingkat Kelas</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as SemesterType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Materi PAI</label>
                  <input
                    type="text"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Materi Ujian"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Tanggal Ujian</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Kode Akses</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono-code font-bold"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 cursor-pointer"
                      title="Acak Kode"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pengaturan Lanjutan */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">KKTP (Nilai Minimal Tuntas)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settings.kktp}
                    onChange={(e) => setSettings({ ...settings, kktp: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Batas Percobaan Siswa</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={settings.max_attempts}
                    onChange={(e) =>
                      setSettings({ ...settings, max_attempts: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tampilan Hasil ke Siswa</label>
                  <select
                    value={settings.show_result_mode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        show_result_mode: e.target.value as "immediate" | "after_teacher_review",
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="immediate">Langsung Setelah Submit</option>
                    <option value="after_teacher_review">Setelah Dikoreksi Guru</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Tampilan Soal Siswa</label>
                  <select
                    value={settings.questions_per_page}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        questions_per_page: Number(e.target.value) as 1 | 5,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value={1}>1 Soal per Halaman</option>
                    <option value={5}>5 Soal per Halaman</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Aturan PG Kompleks</label>
                  <select
                    value={settings.complex_scoring_rule}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        complex_scoring_rule: e.target.value as "semua_benar" | "proporsional",
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="semua_benar">Semua Jawaban Harus Tepat</option>
                    <option value="proporsional">Skor Proporsional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CbtExam["status"])}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="published">Published (Siswa Bisa Akses)</option>
                    <option value="ongoing">Ongoing (Sedang Berlangsung)</option>
                    <option value="draft">Draft (Belum Dibuka)</option>
                    <option value="closed">Closed (Ditutup)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex flex-wrap gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shuffle_questions}
                      onChange={(e) =>
                        setSettings({ ...settings, shuffle_questions: e.target.checked })
                      }
                    />
                    <span>Acak Urutan Soal</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shuffle_options}
                      onChange={(e) =>
                        setSettings({ ...settings, shuffle_options: e.target.checked })
                      }
                    />
                    <span>Acak Pilihan Jawaban</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allow_remedial}
                      onChange={(e) =>
                        setSettings({ ...settings, allow_remedial: e.target.checked })
                      }
                    />
                    <span>Izinkan Remedial bagi Nilai &lt; KKTP</span>
                  </label>
                </div>
              </div>

              {/* Pemilih Soal dari Bank Soal */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    Pilih Soal dari Bank Soal ({selectedQuestionIds.length} terpilih)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowInlineQuestion(!showInlineQuestion)}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    {showInlineQuestion ? "Tutup Form Soal Cepat" : "+ Buat Soal Langsung Disini"}
                  </button>
                </div>

                {showInlineQuestion && (
                  <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/50 space-y-2">
                    <input
                      type="text"
                      value={inlineText}
                      onChange={(e) => setInlineText(e.target.value)}
                      placeholder="Tulis pertanyaan pilihan ganda baru..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {(["A", "B", "C", "D"] as const).map((k) => (
                        <input
                          key={k}
                          type="text"
                          value={inlineOpts[k]}
                          onChange={(e) => setInlineOpts({ ...inlineOpts, [k]: e.target.value })}
                          placeholder={`Opsi ${k}`}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <select
                        value={inlineKey}
                        onChange={(e) => setInlineKey(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="A">Kunci: A</option>
                        <option value="B">Kunci: B</option>
                        <option value="C">Kunci: C</option>
                        <option value="D">Kunci: D</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleQuickAddQuestion}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Simpan & Tambahkan ke Ujian
                      </button>
                    </div>
                  </div>
                )}

                <div className="max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  {questions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Bank soal kosong. Buat soal langsung di atas atau melalui menu Bank Soal.
                    </div>
                  ) : (
                    questions.map((q) => {
                      const picked = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestionPick(q.id)}
                          className={`p-3 flex items-center gap-3 cursor-pointer text-xs ${
                            picked ? "bg-sky-50 dark:bg-sky-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                              picked
                                ? "bg-sky-600 border-sky-600 text-white"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {picked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{q.question_text}</p>
                            <p className="text-[11px] text-slate-500">
                              Kelas {q.grade_level} • {QUESTION_TYPE_LABELS[q.question_type]}
                            </p>
                          </div>
                          {picked && (
                            <input
                              type="number"
                              min={1}
                              onClick={(e) => e.stopPropagation()}
                              value={customScores[q.id] ?? q.score ?? settings.default_question_score}
                              onChange={(e) =>
                                setCustomScores({
                                  ...customScores,
                                  [q.id]: Number(e.target.value),
                                })
                              }
                              className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center tabular-nums"
                              title="Bobot Soal"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan & Terbitkan Ujian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
