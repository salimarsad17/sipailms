import React, { useState, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Copy,
  Printer,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  BookmarkCheck,
  AlertCircle
} from "lucide-react";
import type { KuisMiniData, SoalKuisInteraktif } from "../../data/bukuPaiKemendikbud";

interface KuisMiniInteraktifProps {
  kuisData: KuisMiniData;
  judulBab: string;
  babNomor: number;
}

export const KuisMiniInteraktif: React.FC<KuisMiniInteraktifProps> = ({
  kuisData,
  judulBab,
  babNomor
}) => {
  const [selectedPoin, setSelectedPoin] = useState<number | "all">("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  // Filtered list of questions based on selected point
  const filteredSoal = useMemo(() => {
    if (selectedPoin === "all") return kuisData.soalList;
    return kuisData.soalList.filter((s) => s.poinMateri === selectedPoin);
  }, [kuisData.soalList, selectedPoin]);

  // Handle selecting an answer
  const handleSelectOption = (soalId: string, optionIndex: number) => {
    // If already answered, allow changing answer or keep it interactive
    setUserAnswers((prev) => ({
      ...prev,
      [soalId]: optionIndex
    }));
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  // Score calculations
  const totalQuestions = kuisData.soalList.length;
  const answeredCount = Object.keys(userAnswers).length;

  const correctCount = useMemo(() => {
    return kuisData.soalList.reduce((acc, soal) => {
      if (userAnswers[soal.id] === soal.kunciJawaban) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [kuisData.soalList, userAnswers]);

  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Unique points in the quiz (e.g. 4 or 5 points)
  const uniquePoints = useMemo(() => {
    const pts = new Set<number>();
    kuisData.soalList.forEach((s) => pts.add(s.poinMateri));
    return Array.from(pts).sort((a, b) => a - b);
  }, [kuisData.soalList]);

  // Breakdown per Poin Materi
  const breakdownPoin = useMemo(() => {
    const pointsMap: Record<number, { title: string; total: number; correct: number; answered: number }> = {};

    uniquePoints.forEach((num) => {
      const sample = kuisData.soalList.find((s) => s.poinMateri === num);
      pointsMap[num] = {
        title: sample ? sample.judulPoinMateri : `Poin ${num}`,
        total: 0,
        correct: 0,
        answered: 0
      };
    });

    kuisData.soalList.forEach((s) => {
      if (pointsMap[s.poinMateri]) {
        pointsMap[s.poinMateri].total += 1;
        if (userAnswers[s.id] !== undefined) {
          pointsMap[s.poinMateri].answered += 1;
          if (userAnswers[s.id] === s.kunciJawaban) {
            pointsMap[s.poinMateri].correct += 1;
          }
        }
      }
    });

    return pointsMap;
  }, [kuisData.soalList, uniquePoints, userAnswers]);

  // Copy entire quiz to clipboard (for Guru PAI / LMS)
  const handleCopyQuiz = () => {
    let text = `=======================================================\n`;
    text += `LEMBAR KUIS / LATIHAN SOAL INTERAKTIF PAI KELAS IX\n`;
    text += `BAB ${babNomor}: ${judulBab.toUpperCase()}\n`;
    text += `Tema: ${kuisData.judulKuis}\n`;
    text += `Deskripsi: ${kuisData.deskripsi}\n`;
    text += `=======================================================\n\n`;

    kuisData.soalList.forEach((soal, idx) => {
      text += `${idx + 1}. [${soal.judulPoinMateri}]\n`;
      text += `${soal.pertanyaan}\n`;
      soal.pilihan.forEach((pil, pIdx) => {
        const abcd = ["A", "B", "C", "D"][pIdx];
        text += `   ${abcd}. ${pil}\n`;
      });
      text += `\nKunci Jawaban: ${["A", "B", "C", "D"][soal.kunciJawaban]}\n`;
      text += `Pembahasan: ${soal.pembahasan}\n`;
      if (soal.dalilRujukan) {
        text += `Rujukan Dalil: ${soal.dalilRujukan}\n`;
      }
      text += `\n-------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Print quiz sheet
  const handlePrintQuiz = () => {
    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) return;

    const soalHtml = kuisData.soalList
      .map(
        (s, idx) => `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <div style="font-weight: bold; font-size: 10pt; color: #065f46; margin-bottom: 4px;">
            No. ${idx + 1} (${s.judulPoinMateri})
          </div>
          <div style="font-size: 10.5pt; font-weight: 500; line-height: 1.5; margin-bottom: 8px;">
            ${s.pertanyaan}
          </div>
          <div style="margin-left: 12px; font-size: 10pt; line-height: 1.6;">
            ${s.pilihan
              .map(
                (p, pIdx) => `
              <div style="margin-bottom: 4px;">
                <strong>${["A", "B", "C", "D"][pIdx]}.</strong> ${p}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    const answerKeyHtml = kuisData.soalList
      .map(
        (s, idx) => `
        <div style="margin-bottom: 8px; font-size: 9.5pt; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
          <strong>No. ${idx + 1}: ${["A", "B", "C", "D"][s.kunciJawaban]}</strong> - ${s.pembahasan}
          ${s.dalilRujukan ? `<em>(Rujukan: ${s.dalilRujukan})</em>` : ""}
        </div>
      `
      )
      .join("");

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kuis Latihan PAI Kelas IX - Bab ${babNomor}: ${judulBab}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 25px; color: #0f172a; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 18px; }
          .title { font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0; }
          .sub { font-size: 11pt; margin-top: 4px; }
          .meta { display: flex; justify-content: space-between; font-size: 10pt; margin-bottom: 16px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
          @media print {
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">LEMBAR ASESMEN FORMATIF / KUIS INTERAKTIF SISWA</div>
          <div class="sub">Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti (PAI & BP)</div>
          <div class="sub">Kelas IX (Sembilan) - Semester 1 - Bab ${babNomor}: ${judulBab}</div>
        </div>

        <table style="width: 100%; font-size: 10pt; margin-bottom: 18px;">
          <tr>
            <td><strong>Nama Peserta Didik:</strong> ........................................</td>
            <td style="text-align: right;"><strong>Hari / Tanggal:</strong> ........................................</td>
          </tr>
          <tr>
            <td><strong>Nomor Absen / Kelas:</strong> ........................................</td>
            <td style="text-align: right;"><strong>Skor / Nilai:</strong> .............. / 100</td>
          </tr>
        </table>

        <div>
          <h4 style="font-size: 11pt; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
            Petunjuk: Pilihlah salah satu jawaban A, B, C, atau D yang paling tepat!
          </h4>
          ${soalHtml}
        </div>

        <div class="page-break" style="margin-top: 30px; border-top: 2px dashed #94a3b8; padding-top: 20px;">
          <h3 style="font-size: 12pt; font-weight: bold; color: #065f46; text-transform: uppercase;">
            Kunci Jawaban &amp; Pembahasan Edukatif (Pegangan Guru)
          </h3>
          ${answerKeyHtml}
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200" id="modul-kuis-mini-interaktif">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Modul Asesmen Formatif &amp; Uji Pemahaman</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{kuisData.judulKuis}</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              {kuisData.deskripsi}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyQuiz}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition cursor-pointer backdrop-blur-xs"
              title="Salin Naskah Soal & Kunci Jawaban ke Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Soal"}</span>
            </button>
            <button
              onClick={handlePrintQuiz}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="Cetak Lembar Soal Siswa (PDF A4)"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Kuis</span>
            </button>
          </div>
        </div>

        {/* Live Scorecard Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Total Soal</span>
            <span className="text-base sm:text-lg font-black text-white">{totalQuestions} Butir</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Terjawab</span>
            <span className="text-base sm:text-lg font-black text-amber-300">
              {answeredCount} / {totalQuestions}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Jawaban Benar</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{correctCount} Soal</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Skor / Nilai</span>
            <span className="text-base sm:text-lg font-black text-white">
              {scorePercentage} <span className="text-xs font-normal text-emerald-300">/ 100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress & 5-Point Mastery Indicators */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Capaian Pemahaman Siswa per 5 Poin Materi:
            </h4>
          </div>
          {answeredCount > 0 && (
            <button
              onClick={handleResetQuiz}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ulangi dari Awal</span>
            </button>
          )}
        </div>

        {/* Points Progress Chips */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${uniquePoints.length === 3 ? "md:grid-cols-3" : uniquePoints.length === 4 ? "md:grid-cols-4" : "md:grid-cols-5"} gap-2.5`}>
          {uniquePoints.map((ptNum) => {
            const pt = breakdownPoin[ptNum];
            if (!pt) return null;
            const isFinished = pt.answered === pt.total;
            const isAllCorrect = pt.correct === pt.total && pt.total > 0;
            const pct = pt.total > 0 ? Math.round((pt.correct / pt.total) * 100) : 0;

            return (
              <div
                key={ptNum}
                onClick={() => setSelectedPoin(selectedPoin === ptNum ? "all" : ptNum)}
                className={`p-2.5 rounded-xl border transition cursor-pointer text-left ${
                  selectedPoin === ptNum
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Poin {ptNum}</span>
                  {isFinished && isAllCorrect ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      100%
                    </span>
                  ) : pt.answered > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold text-[9px]">
                      {pct}%
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-medium">0/{pt.total}</span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-slate-800 truncate" title={pt.title}>
                  {pt.title.replace(/^Poin \d+:\s*/, "")}
                </div>
                <div className="mt-1.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct === 100 ? "bg-emerald-600" : pct > 0 ? "bg-amber-500" : "bg-transparent"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs for Questions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tampilkan Soal:</span>
          </div>
          <button
            onClick={() => setSelectedPoin("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedPoin === "all"
                ? "bg-emerald-800 text-white shadow-xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Poin ({kuisData.soalList.length})
          </button>
          {uniquePoints.map((pt) => (
            <button
              key={pt}
              onClick={() => setSelectedPoin(pt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedPoin === pt
                  ? "bg-emerald-800 text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Poin {pt} ({kuisData.soalList.filter((s) => s.poinMateri === pt).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan: <strong className="text-slate-800">{filteredSoal.length}</strong> butir soal
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredSoal.map((soal, index) => {
          const selectedOption = userAnswers[soal.id];
          const hasAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === soal.kunciJawaban;

          return (
            <div
              key={soal.id}
              className={`p-4 sm:p-6 rounded-2xl bg-white border transition shadow-2xs space-y-4 ${
                hasAnswered
                  ? isCorrect
                    ? "border-emerald-300 ring-1 ring-emerald-400/30"
                    : "border-rose-300 ring-1 ring-rose-400/30"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Soal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      {soal.judulPoinMateri}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">
                      Soal #{kuisData.soalList.findIndex((s) => s.id === soal.id) + 1}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed pt-1">
                    {soal.pertanyaan}
                  </h4>
                </div>

                {/* Status Badge */}
                {hasAnswered && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                      isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Benar (+10)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Kurang Tepat</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {soal.pilihan.map((pilihan, pIdx) => {
                  const abcd = ["A", "B", "C", "D"][pIdx];
                  const isSelected = selectedOption === pIdx;
                  const isKey = soal.kunciJawaban === pIdx;

                  let optionStyle =
                    "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 hover:border-slate-300";

                  if (hasAnswered) {
                    if (isKey) {
                      // Correct option always highlighted in Emerald
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      // User's wrong option in Red
                      optionStyle = "border-rose-400 bg-rose-50 text-rose-950 font-bold ring-1 ring-rose-400";
                    } else {
                      optionStyle = "border-slate-100 bg-slate-50/40 text-slate-400 opacity-70";
                    }
                  }

                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleSelectOption(soal.id, pIdx)}
                      className={`p-3 sm:p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer text-xs sm:text-sm ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          hasAnswered
                            ? isKey
                              ? "bg-emerald-600 text-white"
                              : isSelected
                              ? "bg-rose-600 text-white"
                              : "bg-slate-200 text-slate-600"
                            : "bg-white border border-slate-300 text-slate-700 shadow-2xs"
                        }`}
                      >
                        {abcd}
                      </span>
                      <span className="flex-1 leading-snug pt-0.5">{pilihan}</span>
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation Box (Shows after answering) */}
              {hasAnswered && (
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-xs leading-relaxed space-y-1.5 ${
                    isCorrect
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                      : "bg-amber-50/70 border-amber-200 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pembahasan &amp; Kunci Jawaban:</span>
                    <span className="ml-1 text-slate-900 font-bold">
                      (Pilihan {["A", "B", "C", "D"][soal.kunciJawaban]})
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-normal">{soal.pembahasan}</p>
                  {soal.dalilRujukan && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                      <BookOpen className="w-3 h-3 text-emerald-600" />
                      <span>Rujukan Dalil / Fikih: {soal.dalilRujukan}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner if all answered */}
      {answeredCount === totalQuestions && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h4 className="text-base font-black">
                Alhamdulillah! Latihan Kuis 5 Poin Selesai!
              </h4>
              <p className="text-xs text-emerald-100">
                Skor akhir kamu: <strong>{scorePercentage} / 100</strong> ({correctCount} Benar dari {totalQuestions} Soal).
                {scorePercentage >= 80
                  ? " Mumtaz! Pemahamanmu terhadap nilai cinta lingkungan sangat istimewa."
                  : scorePercentage >= 60
                  ? " Jayyid! Pemahamanmu sudah baik, silakan ulas kembali poin yang masih keliru."
                  : " Tetap semangat! Baca ulang materi pada 5 sub-bab di atas dan coba kembali."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 bg-white text-emerald-900 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition cursor-pointer"
            >
              Ulangi Latihan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
