/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  CheckCircle,
  Award,
  Clock,
  Printer,
  Send,
  Save,
  Sparkles,
  Users,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Check,
  AlertCircle
} from "lucide-react";
import { BabPelajaran, Siswa, PengumpulanTugas, LKPDItem, SoalPilihanGanda } from "../../types";
import { getOrGenerateLkpdForBab } from "../../lib/lkpdGenerator";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";
import { DataService } from "../../data/initialData";

interface SoalLKPDGuruProps {
  bab: BabPelajaran;
  siswa: Siswa;
  onUpdateBabPelajaran?: (updated: BabPelajaran[]) => void;
  allBabPelajaran?: BabPelajaran[];
  onAddSubmission?: (sub: PengumpulanTugas) => void;
  savedQuizScore?: { score: number; tanggal: string };
  onSaveQuizScore?: (score: number) => void;
}

export default function SoalLKPDGuru({
  bab,
  siswa,
  onUpdateBabPelajaran,
  allBabPelajaran,
  onAddSubmission,
  savedQuizScore,
  onSaveQuizScore
}: SoalLKPDGuruProps) {
  // Get or auto-generate official LKPD data for this chapter
  const [lkpd, setLkpd] = useState<LKPDItem>(() => getOrGenerateLkpdForBab(bab));

  // Active sub-tab inside LKPD: "pilgan" | "esai" | "kelompok" | "stimulus" | "rubrik"
  const [activeTab, setActiveTab] = useState<"pilgan" | "esai" | "kelompok" | "stimulus" | "rubrik">("pilgan");

  // State for multiple-choice quiz answers inside LKPD
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(savedQuizScore ? savedQuizScore.score : null);

  // State for Essay HOTS answers
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [groupDiscussionNotes, setGroupDiscussionNotes] = useState<string>("");
  const [isEssaySubmitted, setIsEssaySubmitted] = useState<boolean>(false);
  const [essaySubmittedDate, setEssaySubmittedDate] = useState<string | null>(null);

  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Character reflection checklist
  const [checkedReflections, setCheckedReflections] = useState<Record<number, boolean>>({});

  // Sync when chapter changes
  useEffect(() => {
    const activeLkpd = getOrGenerateLkpdForBab(bab);
    setLkpd(activeLkpd);
    setIsQuizSubmitted(!!savedQuizScore);
    setQuizScore(savedQuizScore ? savedQuizScore.score : null);
    setUserAnswers({});

    // Load saved essay answers from localStorage if present
    try {
      const storageKey = `lkpd_essay_${siswa.nisn}_${bab.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setEssayAnswers(parsed.answers);
        if (parsed.groupNotes) setGroupDiscussionNotes(parsed.groupNotes);
        if (parsed.submitted) {
          setIsEssaySubmitted(true);
          setEssaySubmittedDate(parsed.submittedDate || null);
        } else {
          setIsEssaySubmitted(false);
          setEssaySubmittedDate(null);
        }
      } else {
        setEssayAnswers({});
        setGroupDiscussionNotes("");
        setIsEssaySubmitted(false);
        setEssaySubmittedDate(null);
      }
    } catch {
      // Fallback
    }
  }, [bab.id, bab.lkpdData, bab.soalList, savedQuizScore, siswa.nisn]);

  // Handle selecting multiple choice option
  const handleSelectOption = (qIndex: number, optionLetter: string) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionLetter
    }));
  };

  // Submit Multiple Choice Quiz
  const handleSubmitQuiz = () => {
    const questions = lkpd.soalPilihanGanda;
    if (questions.length === 0) return;

    const unanswered = questions.filter((_, idx) => !userAnswers[idx]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `Anda masih memiliki ${unanswered.length} soal kuis LKPD yang belum dijawab. Yakin ingin mengumpulkan sekarang?`
      );
      if (!confirmSubmit) return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.jawabanBenar) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculatedScore);
    setIsQuizSubmitted(true);

    if (onSaveQuizScore) {
      onSaveQuizScore(calculatedScore);
    }

    setToastMessage(`🎉 Alhamdulillah! Kuis LKPD berhasil dikumpulkan. Nilai Anda: ${calculatedScore} / 100 (${correctCount} dari ${questions.length} Benar).`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Handle saving essay drafts locally
  const handleSaveEssayDraft = (isSubmitting: boolean = false) => {
    const storageKey = `lkpd_essay_${siswa.nisn}_${bab.id}`;
    const dateStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const payload = {
      answers: essayAnswers,
      groupNotes: groupDiscussionNotes,
      submitted: isSubmitting,
      submittedDate: isSubmitting ? dateStr : essaySubmittedDate
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Ignore
    }

    if (isSubmitting) {
      setIsEssaySubmitted(true);
      setEssaySubmittedDate(dateStr);

      // Create LMS Submission for Guru to grade
      if (onAddSubmission) {
        const fullContent = [
          `LEMBAR JAWABAN SOAL ESAI & DISKUSI LKPD GURU PAI`,
          `Bab: ${bab.judul}`,
          `Siswa: ${siswa.nama} (${siswa.nisn}) - Kelas ${siswa.kelasId}`,
          `Waktu Kumpul: ${dateStr}`,
          `----------------------------------------------------`,
          `[A] JAWABAN PERTANYAAN PEMAHAMAN MANDIRI HOTS:`,
          ...lkpd.aktivitasMandiri.pertanyaanHots.map(
            (q, idx) => `Soal #${idx + 1}: ${q}\nJawaban: ${essayAnswers[idx] || "(Belum dijawab)"}\n`
          ),
          `----------------------------------------------------`,
          `[B] RESUME HASIL DISKUSI KELOMPOK:`,
          `Tugas: ${lkpd.aktivitasKelompok.judulTugas}`,
          `Hasil Resume: ${groupDiscussionNotes || "(Tidak ada catatan)"}`
        ].join("\n");

        const sub: PengumpulanTugas = {
          id: "sub-lkpd-" + Date.now(),
          tugasId: "lkpd-" + bab.id,
          tugasJudul: `LKPD: ${bab.judul}`,
          siswaNisn: siswa.nisn,
          siswaNama: siswa.nama,
          kelasId: siswa.kelasId,
          tanggalKumpul: new Date().toISOString().replace("T", " ").substring(0, 16),
          tipePengumpulan: "Teks",
          kontenTeks: fullContent
        };

        onAddSubmission(sub);
      }

      setToastMessage("🚀 Alhamdulillah! Jawaban Soal Esai LKPD berhasil dikumpulkan ke Guru PAI (Sadiqul Alim, S.Pd.I)!");
    } else {
      setToastMessage("💾 Draf isian soal LKPD Anda berhasil disimpan di perangkat ini.");
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Trigger Print dialog for LKPD
  const handlePrintLKPD = () => {
    window.print();
  };

  return (
    <div id="section-soal-lkpd-guru" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl flex items-center justify-between gap-3 border border-emerald-500/50 m-4 animate-slideDown">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <BookOpen className="w-40 h-40" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Instrumen LKPD Guru PAI
              </span>
              <span className="bg-emerald-700/80 text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600/60">
                Kurikulum Merdeka
              </span>
              <span className="bg-teal-700/80 text-teal-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-600/60">
                Elemen: {lkpd.elemen}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug">
              Lembar Kerja Peserta Didik (LKPD) &amp; Soal Asesmen PAI
            </h3>

            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Soal-soal latihan dan penugasan formatif resmi yang disusun oleh Guru PAI untuk <strong className="text-amber-300 font-bold">{bab.judul}</strong>. Selesaikan soal pilihan ganda interaktif, pertanyaan pemahaman mandiri HOTS, dan lembar studi kasus di bawah ini.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-emerald-200/90">
              <span>👤 Penyusun: <strong>Sadiqul Alim, S.Pd.I</strong></span>
              <span>•</span>
              <span>🏫 UPT SMPN 2 Rebang Tangkas</span>
              <span>•</span>
              <span>⏱️ Alokasi: {lkpd.alokasiWaktu}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
            <button
              onClick={handlePrintLKPD}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5 shadow-sm"
              title="Cetak format cetak LKPD dengan biodata siswa"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Cetak LKPD</span>
            </button>

            {quizScore !== null && (
              <div className="bg-emerald-950/80 border border-emerald-400/40 px-3 py-1.5 rounded-xl text-center shadow-xs">
                <span className="block text-[8px] uppercase tracking-wider text-emerald-300 font-extrabold">Skor Kuis LKPD</span>
                <span className="text-sm font-black text-amber-300">{quizScore} / 100</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CP, TP & Identitas Ringkas Panel */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/70 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
            Capaian Pembelajaran (CP):
          </span>
          <p className="text-slate-700 font-medium leading-relaxed text-[11px]">
            {lkpd.capaianPembelajaran}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-teal-700" />
            Tujuan Pembelajaran (TP):
          </span>
          <ul className="space-y-1 text-slate-700 font-medium text-[11px]">
            {lkpd.tujuanPembelajaran.slice(0, 3).map((tp, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{tp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-100/70 p-1.5 gap-1.5 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab("pilgan")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pilgan"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>1. Soal Kuis Pilihan Ganda ({lkpd.soalPilihanGanda.length})</span>
          {isQuizSubmitted && (
            <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded-full">
              {quizScore}/100
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("esai")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "esai"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Soal Esai HOTS ({lkpd.aktivitasMandiri.pertanyaanHots.length})</span>
          {isEssaySubmitted && (
            <span className="text-[9px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.5 rounded-full">
              Terkumpul ✓
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("kelompok")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "kelompok"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Soal &amp; Kasus Diskusi Kelompok</span>
        </button>

        <button
          onClick={() => setActiveTab("stimulus")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "stimulus"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Stimulus &amp; Dalil Naqli</span>
        </button>

        <button
          onClick={() => setActiveTab("rubrik")}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "rubrik"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5. Rubrik Penilaian KKTP</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: SOAL PILIHAN GANDA LKPD GURU                        */}
        {/* ========================================================= */}
        {activeTab === "pilgan" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Butir Soal Pilihan Ganda Formatif LKPD
                </h4>
                <p className="text-[11px] text-emerald-800/90 font-medium mt-0.5">
                  Pilihlah salah satu jawaban yang paling tepat (A, B, C, atau D). Setelah selesai, klik <strong>Kumpulkan Jawaban Kuis LKPD</strong> untuk memperoleh penilaian langsung.
                </p>
              </div>

              {isQuizSubmitted ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-700 text-white shadow-xs">
                    Skor: {quizScore} / 100
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm("Ingin mengulang pengerjaan kuis LKPD ini?")) {
                        setIsQuizSubmitted(false);
                        setUserAnswers({});
                        setQuizScore(null);
                      }
                    }}
                    className="text-[10px] font-bold text-slate-600 underline hover:text-slate-900 px-2 py-1"
                  >
                    Kerjakan Ulang
                  </button>
                </div>
              ) : (
                <span className="text-[10px] font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                  {Object.keys(userAnswers).length} dari {lkpd.soalPilihanGanda.length} Terjawab
                </span>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {lkpd.soalPilihanGanda.map((soal, qIdx) => {
                const isSelected = userAnswers[qIdx];
                const isCorrect = isQuizSubmitted && isSelected === soal.jawabanBenar;
                const isWrong = isQuizSubmitted && isSelected && isSelected !== soal.jawabanBenar;

                return (
                  <div
                    key={soal.id || qIdx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isQuizSubmitted
                        ? isCorrect
                          ? "bg-emerald-50/40 border-emerald-300"
                          : isWrong
                          ? "bg-rose-50/40 border-rose-300"
                          : "bg-amber-50/30 border-amber-200"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isQuizSubmitted
                          ? isCorrect
                            ? "bg-emerald-700 text-white"
                            : isWrong
                            ? "bg-rose-600 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {qIdx + 1}
                      </span>

                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Soal LKPD Guru PAI • Tingkat HOTS
                          </span>
                          {isQuizSubmitted && (
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              isCorrect
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : "bg-rose-100 text-rose-900 border border-rose-300"
                            }`}>
                              {isCorrect ? "✓ Jawaban Benar (+20)" : `✗ Kunci Benar: ${soal.jawabanBenar}`}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                          {soal.pertanyaan}
                        </p>

                        {/* Multiple Choice Options */}
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {soal.pilihan.map((pil, pIdx) => {
                            const letter = String.fromCharCode(65 + pIdx); // A, B, C, D
                            const isChosen = userAnswers[qIdx] === letter;
                            const isKey = isQuizSubmitted && letter === soal.jawabanBenar;

                            let optionStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80";
                            if (isQuizSubmitted) {
                              if (isKey) {
                                optionStyle = "bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold";
                              } else if (isChosen && !isKey) {
                                optionStyle = "bg-rose-100/80 border-rose-400 text-rose-950 line-through";
                              } else {
                                optionStyle = "bg-slate-50/50 border-slate-100 text-slate-400";
                              }
                            } else if (isChosen) {
                              optionStyle = "bg-emerald-700 text-white border-emerald-700 shadow-sm";
                            }

                            return (
                              <button
                                key={pIdx}
                                type="button"
                                disabled={isQuizSubmitted}
                                onClick={() => handleSelectOption(qIdx, letter)}
                                className={`w-full text-left p-2.5 sm:p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${optionStyle}`}
                              >
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  isChosen && !isQuizSubmitted
                                    ? "bg-white text-emerald-800"
                                    : "bg-black/5"
                                }`}>
                                  {letter}
                                </span>
                                <span className="leading-relaxed flex-1">{pil}</span>
                                {isKey && <Check className="w-4 h-4 text-emerald-700 shrink-0 self-center ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Action Submit */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Pengerjaan tercatat atas nama <strong className="text-slate-800">{siswa.nama} ({siswa.nisn})</strong>
              </span>

              {!isQuizSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kumpulkan Jawaban Kuis LKPD</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    Nilai telah tersimpan otomatis ke Rekap Nilai Formatif Siswa!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SOAL ESAI PEMAHAMAN MANDIRI HOTS                    */}
        {/* ========================================================= */}
        {activeTab === "esai" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-700" />
                  Soal Pemahaman Mandiri (Higher Order Thinking Skills)
                </h4>
                <p className="text-[11px] text-teal-800/90 font-medium mt-0.5">
                  Jawablah pertanyaan analisis kontekstual di bawah ini secara mendalam dan komprehensif. Jawaban dapat Anda simpan sebagai draf atau langsung dikirimkan ke Guru PAI.
                </p>
              </div>

              {isEssaySubmitted && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Terkumpul ({essaySubmittedDate})
                </span>
              )}
            </div>

            {/* Essay Question Items with Inputs */}
            <div className="space-y-5">
              {lkpd.aktivitasMandiri.pertanyaanHots.map((pertanyaan, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 inline-block">
                        Pertanyaan Esai HOTS Guru
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {pertanyaan}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Jawaban dan Argumentasi Anda:
                    </label>
                    <textarea
                      rows={4}
                      value={essayAnswers[idx] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEssayAnswers((prev) => ({ ...prev, [idx]: val }));
                      }}
                      placeholder="Ketikkan analisis, penjelasan dalil, dan solusi Anda di sini..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-teal-600 focus:outline-none transition leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons for Essay */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSaveEssayDraft(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Simpan Draf Jawaban</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveEssayDraft(true)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kumpulkan Lembar Jawaban Esai ke Guru PAI</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SOAL KASUS & AKTIVITAS DISKUSI KELOMPOK             */}
        {/* ========================================================= */}
        {activeTab === "kelompok" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                Aktivitas Kolaboratif Kelompok (3–4 Siswa)
              </span>
              <h4 className="text-sm font-black text-slate-900 mt-1">
                {lkpd.aktivitasKelompok.judulTugas}
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                {lkpd.aktivitasKelompok.instruksi}
              </p>
            </div>

            {/* Questions to discuss */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Butir Masalah / Pertanyaan Diskusi Kelompok:
              </span>
              <div className="space-y-3">
                {lkpd.aktivitasKelompok.pertanyaanDiskusi.map((diskusi, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      {diskusi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Notes Box */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Catatan Hasil Diskusi / Kesepakatan Kelompok Anda:
              </label>
              <textarea
                rows={4}
                value={groupDiscussionNotes}
                onChange={(e) => setGroupDiscussionNotes(e.target.value)}
                placeholder="Tuliskan nama anggota kelompok dan intisari musyawarah kelompok Anda..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-600 focus:outline-none transition leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveEssayDraft(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Catatan Diskusi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STIMULUS BACAAN & DALIL NAQLI                       */}
        {/* ========================================================= */}
        {activeTab === "stimulus" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-black text-slate-900">
                  {lkpd.stimulusBacaan.judul}
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {lkpd.stimulusBacaan.teks}
              </p>
            </div>

            {lkpd.stimulusBacaan.dalilNaqli && (
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Ayat Al-Qur&apos;an / Hadis Rujukan (Dalil Naqli)
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    {lkpd.stimulusBacaan.dalilNaqli.sumber}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-200/60 text-right font-serif text-lg text-emerald-950 leading-loose">
                  {lkpd.stimulusBacaan.dalilNaqli.teksArab}
                </div>

                <div className="text-xs text-slate-700 italic leading-relaxed pt-1">
                  <strong>Artinya:</strong> &ldquo;{lkpd.stimulusBacaan.dalilNaqli.terjemahan}&rdquo;
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: RUBRIK PENILAIAN KKTP DARI GURU PAI                */}
        {/* ========================================================= */}
        {activeTab === "rubrik" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Guru
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                Gunakan rubrik berikut untuk mengetahui standar ketuntasan penilaian formatif yang digunakan oleh Guru PAI.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold text-[11px]">
                    <th className="p-3 border-r border-slate-200">Aspek Penilaian</th>
                    <th className="p-3 border-r border-slate-200 bg-emerald-50 text-emerald-900">Sangat Baik (Skor 4)</th>
                    <th className="p-3 border-r border-slate-200 bg-teal-50 text-teal-900">Baik (Skor 3)</th>
                    <th className="p-3 bg-amber-50 text-amber-900">Perlu Bimbingan (Skor 2)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {lkpd.rubrikPenilaian.map((rubrik, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold border-r border-slate-200 bg-slate-50/40">{rubrik.aspek}</td>
                      <td className="p-3 border-r border-slate-200">{rubrik.skor4}</td>
                      <td className="p-3 border-r border-slate-200">{rubrik.skor3}</td>
                      <td className="p-3">{rubrik.skor2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Refleksi Karakter PPP */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-black text-slate-800 block">
                Refleksi Karakter Profil Pelajar Pancasila &amp; Nilai Karakter Islami:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lkpd.refleksiKarakter.map((ref, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-emerald-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedReflections[idx]}
                      onChange={(e) =>
                        setCheckedReflections((prev) => ({ ...prev, [idx]: e.target.checked }))
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-medium">{ref}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer info & sync badge */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Terhubung Langsung dengan Generator LKPD Guru PAI &amp; LMS UPT SMPN 2 Rebang Tangkas
        </span>
        <span className="text-slate-400">
          Tanggal Pembuatan: {lkpd.tanggalDibuat}
        </span>
      </div>
    </div>
  );
}
