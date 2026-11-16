/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Copy,
  Edit3,
  Trash2,
  Image as ImageIcon,
  FileSpreadsheet,
  BookOpen,
  Table2,
  Volume2,
  Video,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  CbtMaterial,
  DifficultyLevel,
  GradeLevel,
  MatchingPairOption,
  QUESTION_TYPE_LABELS,
  QuestionBankItem,
  QuestionOptionItem,
  QuestionType,
  SemesterType,
} from "../../types/cbt";
import { cbtSupabaseService } from "../../services/cbtSupabaseService";
import { cbtExportService } from "../../services/cbtExportService";

interface CbtQuestionBankProps {
  questions: QuestionBankItem[];
  materials: CbtMaterial[];
  onRefresh: () => Promise<void>;
  currentUserId: string;
}

const DEFAULT_PG_OPTIONS: QuestionOptionItem[] = [
  { key: "A", text: "" },
  { key: "B", text: "" },
  { key: "C", text: "" },
  { key: "D", text: "" },
  { key: "E", text: "" },
];

export default function CbtQuestionBank({
  questions,
  materials,
  onRefresh,
  currentUserId,
}: CbtQuestionBankProps) {
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("ALL");
  const [filterSemester, setFilterSemester] = useState<string>("ALL");
  const [filterMaterial, setFilterMaterial] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const excelInputRef = useRef<HTMLInputElement>(null);

  // Editor state
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("VII");
  const [semester, setSemester] = useState<SemesterType>("Ganjil");
  const [materialId, setMaterialId] = useState<string>("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [subMaterial, setSubMaterial] = useState("");
  const [learningObjective, setLearningObjective] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Sedang");
  const [questionType, setQuestionType] = useState<QuestionType>("pilihan_ganda");
  const [score, setScore] = useState<number>(10);
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [illustrationUrl, setIllustrationUrl] = useState("");
  const [quranArabic, setQuranArabic] = useState("");
  const [quranTranslation, setQuranTranslation] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [explanation, setExplanation] = useState("");

  // Table block
  const [useTable, setUseTable] = useState(false);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["Kolom 1", "Kolom 2"]);
  const [tableRows, setTableRows] = useState<string[][]>([["", ""]]);

  // Options & Answer Keys per Type
  const [pgOptions, setPgOptions] = useState<QuestionOptionItem[]>(DEFAULT_PG_OPTIONS);
  const [pgAnswer, setPgAnswer] = useState<string>("A");
  const [pgComplexAnswers, setPgComplexAnswers] = useState<string[]>(["A"]);
  const [bsAnswer, setBsAnswer] = useState<"BENAR" | "SALAH">("BENAR");
  const [matchingPairs, setMatchingPairs] = useState<MatchingPairOption[]>([
    { id: "p1", left: "", right: "" },
    { id: "p2", left: "", right: "" },
  ]);
  const [shortAnswers, setShortAnswers] = useState<string>("");
  const [essayRubric, setEssayRubric] = useState<string>("");

  const resetForm = () => {
    setEditingId(null);
    setGradeLevel("VII");
    setSemester("Ganjil");
    setMaterialId("");
    setChapterTitle("");
    setSubMaterial("");
    setLearningObjective("");
    setDifficulty("Sedang");
    setQuestionType("pilihan_ganda");
    setScore(10);
    setQuestionText("");
    setQuestionImage("");
    setIllustrationUrl("");
    setQuranArabic("");
    setQuranTranslation("");
    setAudioUrl("");
    setVideoUrl("");
    setExplanation("");
    setUseTable(false);
    setTableHeaders(["Kolom 1", "Kolom 2"]);
    setTableRows([["", ""]]);
    setPgOptions(DEFAULT_PG_OPTIONS.map((o) => ({ ...o })));
    setPgAnswer("A");
    setPgComplexAnswers(["A"]);
    setBsAnswer("BENAR");
    setMatchingPairs([
      { id: "p1", left: "", right: "" },
      { id: "p2", left: "", right: "" },
    ]);
    setShortAnswers("");
    setEssayRubric("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  const openEditModal = (q: QuestionBankItem) => {
    setEditingId(q.id);
    setGradeLevel(q.grade_level);
    setSemester(q.semester);
    setMaterialId(q.material_id || "");
    setChapterTitle(q.chapter_title || "");
    setSubMaterial(q.sub_material || "");
    setLearningObjective(q.learning_objective || "");
    setDifficulty(q.difficulty);
    setQuestionType(q.question_type);
    setScore(Number(q.score || 10));
    setQuestionText(q.question_text);
    setQuestionImage(q.question_image || "");
    setIllustrationUrl(q.illustration_url || "");
    setQuranArabic(q.quran_arabic || "");
    setQuranTranslation(q.quran_translation || "");
    setAudioUrl(q.audio_url || "");
    setVideoUrl(q.video_url || "");
    setExplanation(q.explanation || "");

    if (q.table_data?.headers?.length) {
      setUseTable(true);
      setTableHeaders(q.table_data.headers);
      setTableRows(q.table_data.rows || []);
    } else {
      setUseTable(false);
    }

    const ans = q.correct_answer || {};
    if (q.question_type === "pilihan_ganda") {
      const opts = (q.options as QuestionOptionItem[]) || [];
      setPgOptions(
        ["A", "B", "C", "D", "E"].map(
          (k) => opts.find((o) => o.key === k) || { key: k, text: "" }
        )
      );
      setPgAnswer(String(ans.value || "A"));
    } else if (q.question_type === "pilihan_ganda_kompleks") {
      const opts = (q.options as QuestionOptionItem[]) || [];
      setPgOptions(
        ["A", "B", "C", "D", "E"].map(
          (k) => opts.find((o) => o.key === k) || { key: k, text: "" }
        )
      );
      setPgComplexAnswers(Array.isArray(ans.values) ? ans.values : ["A"]);
    } else if (q.question_type === "benar_salah") {
      setBsAnswer(ans.value === "SALAH" ? "SALAH" : "BENAR");
    } else if (q.question_type === "menjodohkan") {
      const pairs = (q.options as MatchingPairOption[]) || [];
      setMatchingPairs(
        pairs.length > 0
          ? pairs.map((p) => ({ id: p.id, left: p.left, right: p.right || "" }))
          : [
              { id: "p1", left: "", right: "" },
              { id: "p2", left: "", right: "" },
            ]
      );
    } else if (q.question_type === "isian_singkat") {
      const acc = Array.isArray(ans.accepted) ? ans.accepted : ans.value ? [ans.value] : [];
      setShortAnswers(acc.join(" | "));
    } else {
      setEssayRubric(String(ans.rubric || ""));
    }

    setIsEditorOpen(true);
  };

  const handleUploadImage = async (file: File, target: "question" | "illustration") => {
    setUploadingMedia(true);
    try {
      const url = await cbtSupabaseService.uploadQuestionMedia(file);
      if (target === "question") setQuestionImage(url);
      else setIllustrationUrl(url);
      setFeedback({ type: "ok", msg: "Gambar berhasil diunggah ke Supabase Storage." });
    } catch (err: any) {
      setFeedback({ type: "err", msg: err?.message || "Gagal mengunggah gambar." });
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setFeedback({ type: "err", msg: "Teks pertanyaan wajib diisi." });
      return;
    }

    let optionsPayload: any[] = [];
    let correctPayload: Record<string, any> = {};

    if (questionType === "pilihan_ganda") {
      optionsPayload = pgOptions.filter((o) => o.text.trim().length > 0);
      if (optionsPayload.length < 2) {
        setFeedback({ type: "err", msg: "Minimal isi 2 pilihan jawaban (A dan B)." });
        return;
      }
      correctPayload = { value: pgAnswer };
    } else if (questionType === "pilihan_ganda_kompleks") {
      optionsPayload = pgOptions.filter((o) => o.text.trim().length > 0);
      if (pgComplexAnswers.length === 0) {
        setFeedback({ type: "err", msg: "Pilih minimal 1 jawaban benar." });
        return;
      }
      correctPayload = { values: pgComplexAnswers };
    } else if (questionType === "benar_salah") {
      optionsPayload = [
        { key: "BENAR", text: "Benar" },
        { key: "SALAH", text: "Salah" },
      ];
      correctPayload = { value: bsAnswer };
    } else if (questionType === "menjodohkan") {
      const cleanPairs = matchingPairs.filter((p) => p.left.trim() && (p.right || "").trim());
      if (cleanPairs.length < 2) {
        setFeedback({ type: "err", msg: "Minimal isi 2 pasangan menjodohkan." });
        return;
      }
      optionsPayload = cleanPairs;
      const pairsMap: Record<string, string> = {};
      cleanPairs.forEach((p) => {
        pairsMap[p.id] = p.right || "";
      });
      correctPayload = { pairs: pairsMap };
    } else if (questionType === "isian_singkat") {
      const accepted = shortAnswers
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      correctPayload = { accepted };
    } else {
      correctPayload = { rubric: essayRubric.trim() };
    }

    setSaving(true);
    try {
      const selectedMat = materials.find((m) => m.id === materialId);
      const payload: Partial<QuestionBankItem> = {
        ...(editingId ? { id: editingId } : {}),
        created_by: currentUserId,
        material_id: materialId || null,
        subject_name: "Pendidikan Agama Islam",
        grade_level: gradeLevel,
        semester,
        chapter_title: selectedMat?.title || chapterTitle.trim() || null,
        sub_material: subMaterial.trim() || selectedMat?.sub_material || null,
        learning_objective: learningObjective.trim() || null,
        difficulty,
        question_type: questionType,
        score: Number(score) || 10,
        question_text: questionText.trim(),
        question_image: questionImage.trim() || null,
        illustration_url: illustrationUrl.trim() || null,
        table_data: useTable ? { headers: tableHeaders, rows: tableRows } : null,
        quran_arabic: quranArabic.trim() || null,
        quran_translation: quranTranslation.trim() || null,
        audio_url: audioUrl.trim() || null,
        video_url: videoUrl.trim() || null,
        options: optionsPayload,
        correct_answer: correctPayload,
        explanation: explanation.trim() || null,
      };
      await cbtSupabaseService.upsertQuestion(payload);
      await onRefresh();
      setIsEditorOpen(false);
      setFeedback({
        type: "ok",
        msg: editingId ? "Soal berhasil diperbarui." : "Soal baru berhasil disimpan ke Bank Soal.",
      });
    } catch (err: any) {
      setFeedback({ type: "err", msg: err?.message || "Gagal menyimpan soal." });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (q: QuestionBankItem) => {
    try {
      const { id, created_at, ...rest } = q;
      await cbtSupabaseService.upsertQuestion({
        ...rest,
        question_text: `${q.question_text} (Salinan)`,
        created_by: currentUserId,
      });
      await onRefresh();
      setFeedback({ type: "ok", msg: "Soal berhasil diduplikat." });
    } catch (err: any) {
      setFeedback({ type: "err", msg: err?.message || "Gagal menduplikat soal." });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cbtSupabaseService.deleteQuestion(id);
      await onRefresh();
      setFeedback({ type: "ok", msg: "Soal dihapus dari Bank Soal." });
    } catch (err: any) {
      setFeedback({ type: "err", msg: err?.message || "Gagal menghapus soal." });
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await cbtExportService.parseQuestionsFromExcel(file);
      if (parsed.length === 0) {
        setFeedback({ type: "err", msg: "Tidak ada baris soal valid ditemukan di file Excel." });
        return;
      }
      await cbtSupabaseService.bulkInsertQuestions(
        parsed.map((item) => ({ ...item, created_by: currentUserId }))
      );
      await onRefresh();
      setFeedback({ type: "ok", msg: `${parsed.length} soal berhasil diimpor dari Excel.` });
    } catch (err: any) {
      setFeedback({ type: "err", msg: err?.message || "Gagal mengimpor file Excel." });
    } finally {
      if (excelInputRef.current) excelInputRef.current.value = "";
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterGrade !== "ALL" && q.grade_level !== filterGrade) return false;
      if (filterSemester !== "ALL" && q.semester !== filterSemester) return false;
      if (filterType !== "ALL" && q.question_type !== filterType) return false;
      if (filterMaterial !== "ALL" && (q.chapter_title || "") !== filterMaterial) return false;
      if (search.trim()) {
        const kw = search.toLowerCase();
        const hay = `${q.question_text} ${q.chapter_title || ""} ${q.sub_material || ""}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [questions, filterGrade, filterSemester, filterType, filterMaterial, search]);

  const uniqueChapters = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.chapter_title).filter(Boolean))) as string[];
  }, [questions]);

  return (
    <div className="space-y-5">
      {/* Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1B3B] dark:text-white">
            Bank Soal Pendidikan Agama Islam
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola 6 jenis soal, ayat Al-Qur'an Arab, gambar, tabel, impor/ekspor Excel. Total saat ini:{" "}
            <strong className="text-sky-600 dark:text-sky-300 tabular-nums">{questions.length}</strong> soal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => cbtExportService.downloadQuestionTemplateExcel()}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Template Excel</span>
          </button>

          <button
            type="button"
            onClick={() => excelInputRef.current?.click()}
            className="px-3 py-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Excel</span>
          </button>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => cbtExportService.exportQuestionsToExcel(filteredQuestions)}
            disabled={filteredQuestions.length === 0}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 hover:bg-[#13316B] dark:hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tambah Soal</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            feedback.type === "ok"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          <span>{feedback.msg}</span>
          <button type="button" onClick={() => setFeedback(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan, bab materi, submateri..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
          />
        </div>

        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Kelas (VII–IX)</option>
          <option value="VII">Kelas VII</option>
          <option value="VIII">Kelas VIII</option>
          <option value="IX">Kelas IX</option>
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Semester</option>
          <option value="Ganjil">Semester Ganjil</option>
          <option value="Genap">Semester Genap</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
        >
          <option value="ALL">Semua Jenis Soal</option>
          {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((t) => (
            <option key={t} value={t}>
              {QUESTION_TYPE_LABELS[t]}
            </option>
          ))}
        </select>

        {uniqueChapters.length > 0 && (
          <select
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="lg:col-span-5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="ALL">Semua Bab / Materi PAI</option>
            {uniqueChapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-sky-500/70" />
          <h3 className="font-display text-base font-bold text-[#0B1B3B] dark:text-white">
            Bank Soal Masih Kosong
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Belum ada soal yang dibuat atau sesuai filter. Klik <strong>Tambah Soal</strong> atau <strong>Impor Excel</strong> untuk mulai mengisi bank soal PAI.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-[#0B1B3B] dark:bg-sky-600 text-white tabular-nums">
                      #{idx + 1}
                    </span>
                    <span className="text-sky-700 dark:text-sky-300">
                      {QUESTION_TYPE_LABELS[q.question_type]}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Kelas {q.grade_level} ({q.semester})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {q.difficulty} • Bobot {q.score}
                    </span>
                  </div>
                  {q.chapter_title && (
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Materi: {q.chapter_title} {q.sub_material ? `— ${q.sub_material}` : ""}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(q)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 cursor-pointer"
                    title="Edit Soal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(q)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 cursor-pointer"
                    title="Duplikat Soal"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {q.quran_arabic && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <p className="font-arabic text-xl text-right text-[#0B1B3B] dark:text-amber-200">
                    {q.quran_arabic}
                  </p>
                  {q.quran_translation && (
                    <p className="text-xs italic text-slate-600 dark:text-slate-400">
                      "{q.quran_translation}"
                    </p>
                  )}
                </div>
              )}

              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                {q.question_text}
              </p>

              {q.question_image && (
                <img
                  src={q.question_image}
                  alt="Lampiran soal"
                  className="max-h-48 rounded-xl border border-slate-200 dark:border-slate-700 object-contain"
                />
              )}

              {(q.question_type === "pilihan_ganda" || q.question_type === "pilihan_ganda_kompleks") &&
                Array.isArray(q.options) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {(q.options as QuestionOptionItem[]).map((opt) => {
                      const isCorrect =
                        q.question_type === "pilihan_ganda"
                          ? q.correct_answer?.value === opt.key
                          : Array.isArray(q.correct_answer?.values) &&
                            q.correct_answer.values.includes(opt.key);
                      return (
                        <div
                          key={opt.key}
                          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                            isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 font-bold text-emerald-800 dark:text-emerald-200"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <span className="font-extrabold">{opt.key}.</span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Rich Question Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-[#0B1B3B] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 bg-[#0B1B3B] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <h3 className="font-display font-extrabold text-base">
                {editingId ? "Edit Soal PAI" : "Tambah Soal Baru ke Bank Soal"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Identitas Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Kelas *</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Semester *</label>
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
                  <label className="block text-xs font-bold mb-1">Tingkat Kesulitan *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Materi dari Master Data</label>
                  <select
                    value={materialId}
                    onChange={(e) => {
                      setMaterialId(e.target.value);
                      const found = materials.find((m) => m.id === e.target.value);
                      if (found) {
                        setChapterTitle(found.title);
                        if (found.sub_material) setSubMaterial(found.sub_material);
                        if (found.learning_objective) setLearningObjective(found.learning_objective);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  >
                    <option value="">-- Ketik Manual / Pilih --</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        Kelas {m.grade_level} • {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Bab / Materi</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Contoh: Iman Kepada Malaikat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Submateri</label>
                  <input
                    type="text"
                    value={subMaterial}
                    onChange={(e) => setSubMaterial(e.target.value)}
                    placeholder="Contoh: Tugas Malaikat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold mb-1">Jenis Soal *</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold"
                  >
                    {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((t) => (
                      <option key={t} value={t}>
                        {QUESTION_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Bobot Nilai *</label>
                  <input
                    type="number"
                    min={1}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Tujuan Pembelajaran</label>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    placeholder="Opsional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Konten Pertanyaan & Ayat Al-Qur'an */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Ayat Al-Qur'an / Hadis (Teks Arab RTL - Opsional)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={quranArabic}
                    onChange={(e) => setQuranArabic(e.target.value)}
                    placeholder="بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-arabic text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Terjemahan Ayat (Opsional)</label>
                  <input
                    type="text"
                    value={quranTranslation}
                    onChange={(e) => setQuranTranslation(e.target.value)}
                    placeholder="Arti ayat / hadis..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Pertanyaan Soal *</label>
                  <textarea
                    rows={3}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Tulis pertanyaan dengan jelas..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Media Pendukung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                    <span>Gambar Soal (Upload Supabase Storage / URL)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={questionImage}
                      onChange={(e) => setQuestionImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <label className="px-2.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold cursor-pointer shrink-0">
                      {uploadingMedia ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleUploadImage(e.target.files[0], "question")
                        }
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ilustrasi Pendukung (Opsional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={illustrationUrl}
                      onChange={(e) => setIllustrationUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <label className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleUploadImage(e.target.files[0], "illustration")
                        }
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>URL Audio Tilawah / Penjelasan (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://.../audio.mp3"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span>URL Video Pendukung (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://.../video.mp4"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useTable}
                      onChange={(e) => setUseTable(e.target.checked)}
                    />
                    <Table2 className="w-4 h-4 text-sky-500" />
                    <span>Sertakan Tabel Stimulus pada Soal</span>
                  </label>

                  {useTable && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 overflow-x-auto">
                      <div className="flex gap-2">
                        {tableHeaders.map((h, ci) => (
                          <input
                            key={ci}
                            value={h}
                            onChange={(e) => {
                              const next = [...tableHeaders];
                              next[ci] = e.target.value;
                              setTableHeaders(next);
                            }}
                            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs font-bold w-36 bg-white dark:bg-slate-800"
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setTableHeaders([...tableHeaders, `Kolom ${tableHeaders.length + 1}`]);
                            setTableRows(tableRows.map((r) => [...r, ""]));
                          }}
                          className="px-2 py-1 rounded bg-sky-600 text-white text-xs font-bold cursor-pointer"
                        >
                          + Kolom
                        </button>
                      </div>
                      {tableRows.map((row, ri) => (
                        <div key={ri} className="flex gap-2">
                          {row.map((cell, ci) => (
                            <input
                              key={ci}
                              value={cell}
                              onChange={(e) => {
                                const next = tableRows.map((r) => [...r]);
                                next[ri][ci] = e.target.value;
                                setTableRows(next);
                              }}
                              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs w-36 bg-white dark:bg-slate-800"
                            />
                          ))}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setTableRows([...tableRows, tableHeaders.map(() => "")])}
                        className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                      >
                        + Baris
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Opsi & Kunci Jawaban sesuai Tipe Soal */}
              <div className="p-4 rounded-xl border border-amber-300/60 dark:border-amber-700/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Opsi & Kunci Jawaban ({QUESTION_TYPE_LABELS[questionType]})
                </h4>

                {(questionType === "pilihan_ganda" || questionType === "pilihan_ganda_kompleks") && (
                  <div className="space-y-2">
                    {pgOptions.map((opt, idx) => {
                      const checked =
                        questionType === "pilihan_ganda"
                          ? pgAnswer === opt.key
                          : pgComplexAnswers.includes(opt.key);
                      return (
                        <div key={opt.key} className="flex items-center gap-2">
                          <input
                            type={questionType === "pilihan_ganda" ? "radio" : "checkbox"}
                            name="pg-correct"
                            checked={checked}
                            onChange={() => {
                              if (questionType === "pilihan_ganda") {
                                setPgAnswer(opt.key);
                              } else {
                                setPgComplexAnswers((prev) =>
                                  prev.includes(opt.key)
                                    ? prev.filter((x) => x !== opt.key)
                                    : [...prev, opt.key]
                                );
                              }
                            }}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                          <span className="w-6 text-xs font-extrabold">{opt.key}.</span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const next = [...pgOptions];
                              next[idx] = { ...opt, text: e.target.value };
                              setPgOptions(next);
                            }}
                            placeholder={`Teks pilihan ${opt.key}`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {questionType === "benar_salah" && (
                  <div className="flex gap-3">
                    {(["BENAR", "SALAH"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBsAnswer(val)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs border cursor-pointer ${
                          bsAnswer === val
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        Kunci: {val}
                      </button>
                    ))}
                  </div>
                )}

                {questionType === "menjodohkan" && (
                  <div className="space-y-2">
                    {matchingPairs.map((pair, idx) => (
                      <div key={pair.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pair.left}
                          onChange={(e) => {
                            const next = [...matchingPairs];
                            next[idx] = { ...pair, left: e.target.value };
                            setMatchingPairs(next);
                          }}
                          placeholder={`Pernyataan Kiri ${idx + 1}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                        />
                        <input
                          type="text"
                          value={pair.right || ""}
                          onChange={(e) => {
                            const next = [...matchingPairs];
                            next[idx] = { ...pair, right: e.target.value };
                            setMatchingPairs(next);
                          }}
                          placeholder={`Pasangan Kanan ${idx + 1}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setMatchingPairs([
                          ...matchingPairs,
                          { id: `p${matchingPairs.length + 1}`, left: "", right: "" },
                        ])
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      + Tambah Pasangan
                    </button>
                  </div>
                )}

                {questionType === "isian_singkat" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Kata Kunci Jawaban Benar (pisahkan variasi jawaban diterima dengan tanda | )
                    </label>
                    <input
                      type="text"
                      value={shortAnswers}
                      onChange={(e) => setShortAnswers(e.target.value)}
                      placeholder="Contoh: Alif Lam Syamsiyah | Syamsiyah"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                )}

                {questionType === "esai" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Pedoman Penskoran / Rubrik Esai (Dikoreksi Manual oleh Guru)
                    </label>
                    <textarea
                      rows={2}
                      value={essayRubric}
                      onChange={(e) => setEssayRubric(e.target.value)}
                      placeholder="Kriteria penilaian jawaban esai..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1">Pembahasan Soal (Opsional)</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Penjelasan jawaban benar..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0B1B3B] dark:bg-sky-600 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan ke Bank Soal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
