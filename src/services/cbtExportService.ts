/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CbtExam,
  CbtStudent,
  ExamResultRecord,
  QuestionBankItem,
  QuestionType,
  SchoolSettings,
} from "../types/cbt";

export const cbtExportService = {
  // Ekspor Bank Soal ke Excel (.xlsx)
  exportQuestionsToExcel(questions: QuestionBankItem[], fileName = "Bank_Soal_CBT_PAI_SMART.xlsx") {
    const rows = questions.map((q, idx) => ({
      No: idx + 1,
      "Mata Pelajaran": q.subject_name,
      Kelas: q.grade_level,
      Semester: q.semester,
      "Bab / Materi": q.chapter_title || "",
      Submateri: q.sub_material || "",
      "Tujuan Pembelajaran": q.learning_objective || "",
      "Tingkat Kesulitan": q.difficulty,
      "Jenis Soal": q.question_type,
      Bobot: q.score,
      Pertanyaan: q.question_text,
      "Ayat Al-Quran": q.quran_arabic || "",
      Terjemahan: q.quran_translation || "",
      "Opsi (JSON)": JSON.stringify(q.options || []),
      "Kunci Jawaban (JSON)": JSON.stringify(q.correct_answer || {}),
      Pembahasan: q.explanation || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bank Soal PAI");
    XLSX.writeFile(wb, fileName);
  },

  // Unduh Template Excel Impor Soal
  downloadQuestionTemplateExcel() {
    const rows = [
      {
        "Mata Pelajaran": "Pendidikan Agama Islam",
        Kelas: "VII",
        Semester: "Ganjil",
        "Bab / Materi": "Bab 1 - Al-Qur'an dan Sunnah",
        Submateri: "Hukum Bacaan Alif Lam",
        "Tujuan Pembelajaran": "Memahami hukum bacaan Alif Lam Syamsiyah dan Qamariyah",
        "Tingkat Kesulitan": "Mudah",
        "Jenis Soal": "pilihan_ganda",
        Bobot: 10,
        Pertanyaan: "Tulis teks pertanyaan di sini...",
        "Ayat Al-Quran": "",
        Terjemahan: "",
        "Opsi A": "Pilihan A",
        "Opsi B": "Pilihan B",
        "Opsi C": "Pilihan C",
        "Opsi D": "Pilihan D",
        "Opsi E": "Pilihan E",
        "Kunci Jawaban": "A",
        Pembahasan: "Pembahasan singkat...",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Impor Soal");
    XLSX.writeFile(wb, "Template_Bank_Soal_CBT_PAI.xlsx");
  },

  // Parse file Excel Impor Soal
  async parseQuestionsFromExcel(file: File): Promise<Partial<QuestionBankItem>[]> {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet);

    return rawRows
      .filter((r) => r["Pertanyaan"] || r["question_text"])
      .map((r) => {
        const qTypeRaw = String(r["Jenis Soal"] || r["question_type"] || "pilihan_ganda").trim();
        const validTypes: QuestionType[] = [
          "pilihan_ganda",
          "pilihan_ganda_kompleks",
          "benar_salah",
          "menjodohkan",
          "isian_singkat",
          "esai",
        ];
        const qType: QuestionType = validTypes.includes(qTypeRaw as QuestionType)
          ? (qTypeRaw as QuestionType)
          : "pilihan_ganda";

        let options: any[] = [];
        let correctAnswer: Record<string, any> = {};

        if (r["Opsi (JSON)"]) {
          try {
            options = JSON.parse(String(r["Opsi (JSON)"]));
          } catch {
            options = [];
          }
        } else if (qType === "pilihan_ganda" || qType === "pilihan_ganda_kompleks") {
          const keys = ["A", "B", "C", "D", "E"];
          options = keys
            .map((k) => ({ key: k, text: String(r[`Opsi ${k}`] || "").trim() }))
            .filter((o) => o.text.length > 0);
        } else if (qType === "benar_salah") {
          options = [
            { key: "BENAR", text: "Benar" },
            { key: "SALAH", text: "Salah" },
          ];
        }

        if (r["Kunci Jawaban (JSON)"]) {
          try {
            correctAnswer = JSON.parse(String(r["Kunci Jawaban (JSON)"]));
          } catch {
            correctAnswer = {};
          }
        } else {
          const kunci = String(r["Kunci Jawaban"] || "").trim();
          if (qType === "pilihan_ganda" || qType === "benar_salah") {
            correctAnswer = { value: kunci.toUpperCase() };
          } else if (qType === "pilihan_ganda_kompleks") {
            correctAnswer = {
              values: kunci
                .split(",")
                .map((s) => s.trim().toUpperCase())
                .filter(Boolean),
            };
          } else if (qType === "isian_singkat") {
            correctAnswer = {
              accepted: kunci
                .split("|")
                .map((s) => s.trim())
                .filter(Boolean),
            };
          }
        }

        const gradeRaw = String(r["Kelas"] || "VII").trim().toUpperCase();
        const gradeLevel = (["VII", "VIII", "IX"].includes(gradeRaw) ? gradeRaw : "VII") as "VII" | "VIII" | "IX";
        const semRaw = String(r["Semester"] || "Ganjil").trim();
        const semester = semRaw.toLowerCase() === "genap" ? "Genap" : "Ganjil";
        const diffRaw = String(r["Tingkat Kesulitan"] || "Sedang").trim();
        const difficulty = (["Mudah", "Sedang", "Sulit"].includes(diffRaw) ? diffRaw : "Sedang") as
          | "Mudah"
          | "Sedang"
          | "Sulit";

        return {
          subject_name: String(r["Mata Pelajaran"] || "Pendidikan Agama Islam"),
          grade_level: gradeLevel,
          semester,
          chapter_title: String(r["Bab / Materi"] || ""),
          sub_material: String(r["Submateri"] || ""),
          learning_objective: String(r["Tujuan Pembelajaran"] || ""),
          difficulty,
          question_type: qType,
          score: Number(r["Bobot"] || 10) || 10,
          question_text: String(r["Pertanyaan"] || r["question_text"] || "").trim(),
          quran_arabic: String(r["Ayat Al-Quran"] || ""),
          quran_translation: String(r["Terjemahan"] || ""),
          options,
          correct_answer: correctAnswer,
          explanation: String(r["Pembahasan"] || ""),
        };
      });
  },

  // Ekspor Rekap Nilai ke Excel
  exportResultsToExcel(results: ExamResultRecord[], fileName = "Rekap_Nilai_CBT_PAI_SMART.xlsx") {
    const sorted = [...results].sort((a, b) => Number(b.final_score) - Number(a.final_score));
    const rows = sorted.map((r, idx) => ({
      Peringkat: idx + 1,
      "Nama Siswa": r.students?.full_name || "-",
      NIS: r.students?.nis || "-",
      NISN: r.students?.nisn || "-",
      Kelas: r.students?.classes?.class_name || "-",
      "Nama Ujian": r.exams?.title || "-",
      Jenis: r.exams?.exam_type || "-",
      Semester: r.exams?.semester || "-",
      Tanggal: r.exams?.exam_date || "-",
      Benar: r.total_correct,
      Salah: r.total_wrong,
      "Belum Dijawab": r.total_unanswered,
      "Nilai Akhir": Number(r.final_score),
      KKTP: Number(r.kktp),
      Status: r.completion_status,
      "Catatan Guru": r.teacher_feedback || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai Ujian");
    XLSX.writeFile(wb, fileName);
  },

  // Ekspor Laporan Nilai ke PDF
  exportResultsToPdf(
    results: ExamResultRecord[],
    school: SchoolSettings | null,
    subtitle = "Rekap Hasil Ujian Pendidikan Agama Islam"
  ) {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.text(school?.school_name || "UPT SMPN 2 REBANG TANGKAS", 14, 14);
    doc.setFontSize(11);
    doc.text(`CBT PAI SMART — ${subtitle}`, 14, 21);
    doc.setFontSize(9);
    doc.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, 14, 27);

    const sorted = [...results].sort((a, b) => Number(b.final_score) - Number(a.final_score));
    autoTable(doc, {
      startY: 32,
      head: [[
        "No",
        "Nama Siswa",
        "NIS / NISN",
        "Kelas",
        "Nama Ujian",
        "Tanggal",
        "Benar",
        "Salah",
        "Nilai Akhir",
        "Status",
      ]],
      body: sorted.map((r, idx) => [
        idx + 1,
        r.students?.full_name || "-",
        `${r.students?.nis || "-"} / ${r.students?.nisn || "-"}`,
        r.students?.classes?.class_name || "-",
        r.exams?.title || "-",
        r.exams?.exam_date || "-",
        r.total_correct,
        r.total_wrong,
        Number(r.final_score).toFixed(1),
        r.completion_status,
      ]),
      styles: { fontSize: 8.5, cellPadding: 2.5 },
      headStyles: { fillColor: [11, 27, 59], textColor: [255, 255, 255] },
    });

    doc.save("Laporan_Nilai_CBT_PAI_SMART.pdf");
  },

  // Cetak Kartu Peserta Ujian PDF
  exportParticipantCardsPdf(students: CbtStudent[], school: SchoolSettings | null) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const cardW = 88;
    const cardH = 54;
    const marginX = 12;
    const marginY = 14;
    const gapX = 10;
    const gapY = 8;

    students.forEach((st, idx) => {
      const posInPage = idx % 8;
      if (idx > 0 && posInPage === 0) doc.addPage();
      const col = posInPage % 2;
      const row = Math.floor(posInPage / 2);
      const x = marginX + col * (cardW + gapX);
      const y = marginY + row * (cardH + gapY);

      doc.setDrawColor(11, 27, 59);
      doc.setLineWidth(0.5);
      doc.rect(x, y, cardW, cardH);
      doc.setFillColor(11, 27, 59);
      doc.rect(x, y, cardW, 11, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.text("KARTU PESERTA CBT PAI SMART", x + 3, y + 5);
      doc.setFontSize(7);
      doc.setTextColor(251, 191, 36);
      doc.text((school?.school_name || "UPT SMPN 2 REBANG TANGKAS").toUpperCase(), x + 3, y + 9);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(`No. Peserta : ${st.participant_number || `CBT-${st.nisn}`}`, x + 3, y + 18);
      doc.text(`Nama        : ${st.full_name}`, x + 3, y + 24);
      doc.text(`NIS / NISN  : ${st.nis} / ${st.nisn}`, x + 3, y + 30);
      doc.text(`Kelas       : ${st.classes?.class_name || "-"}`, x + 3, y + 36);
      doc.text(`Mapel       : Pendidikan Agama Islam`, x + 3, y + 42);
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text("Kepala Sekolah / Panitia CBT PAI", x + 3, y + 50);
    });

    doc.save("Kartu_Peserta_CBT_PAI_SMART.pdf");
  },

  // Cetak Berita Acara Pelaksanaan Ujian PDF
  exportBeritaAcaraPdf(
    exam: CbtExam,
    results: ExamResultRecord[],
    school: SchoolSettings | null,
    notes = ""
  ) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(13);
    doc.text(school?.school_name || "UPT SMPN 2 REBANG TANGKAS", 105, 16, { align: "center" });
    doc.setFontSize(11);
    doc.text("BERITA ACARA PELAKSANAAN UJIAN CBT PAI SMART", 105, 23, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(15, 27, 195, 27);

    const examRes = results.filter((r) => r.exam_id === exam.id);
    const avg =
      examRes.length > 0
        ? (examRes.reduce((s, r) => s + Number(r.final_score), 0) / examRes.length).toFixed(1)
        : "0";

    doc.setFontSize(10);
    const lines = [
      `Pada hari ini, tanggal ${exam.exam_date}, telah dilaksanakan Ujian Computer Based Test (CBT):`,
      `Mata Pelajaran   : Pendidikan Agama Islam`,
      `Nama Ujian       : ${exam.title} (${exam.exam_type})`,
      `Kelas / Semester : ${exam.classes?.class_name || `Kelas ${exam.grade_level}`} / ${exam.semester}`,
      `Durasi           : ${exam.duration} Menit`,
      `Jumlah Peserta   : ${examRes.length} Siswa telah menyelesaikan ujian`,
      `Rata-rata Nilai  : ${avg}`,
      `Catatan Pengawas : ${notes || "Ujian berjalan tertib, aman, dan lancar."}`,
    ];
    let curY = 36;
    lines.forEach((line) => {
      doc.text(line, 18, curY);
      curY += 8;
    });

    doc.text("Mengetahui,", 135, curY + 12);
    doc.text("Guru Pengampu / Pengawas CBT PAI", 135, curY + 18);
    doc.text("______________________________", 135, curY + 40);

    doc.save(`Berita_Acara_${exam.title.replace(/\s+/g, "_")}.pdf`);
  },

  // Ekspor Data Master Siswa ke Excel
  exportStudentsToExcel(students: CbtStudent[]) {
    const rows = students.map((s, idx) => ({
      No: idx + 1,
      "Nomor Peserta": s.participant_number || `CBT-${s.nisn}`,
      NIS: s.nis,
      NISN: s.nisn,
      "Nama Lengkap": s.full_name,
      "Jenis Kelamin": s.gender || "L",
      Kelas: s.classes?.class_name || "",
      Status: s.is_active ? "Aktif" : "Nonaktif",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
    XLSX.writeFile(wb, "Data_Siswa_CBT_PAI_SMART.xlsx");
  },

  // Backup seluruh data ke JSON
  exportBackupJson(payload: Record<string, any>) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_CBT_PAI_SMART_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
