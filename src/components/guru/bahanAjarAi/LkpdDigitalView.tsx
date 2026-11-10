/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  Edit3,
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Users,
  User,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface LkpdDigitalViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  activeBundle?: BahanAjarAiCompleteBundle | null;
  onSelectBundle: (b: BahanAjarAiCompleteBundle) => void;
  onOpenGenerator: () => void;
}

export default function LkpdDigitalView({
  bundles,
  activeBundle,
  onSelectBundle,
  onOpenGenerator
}: LkpdDigitalViewProps) {
  const currentBundle = activeBundle || bundles[0];

  // Mode: "preview" (Lembar Kerja Cetak A4) | "digital-interactive" (Siswa Mengisi Digital) | "rubrik" (Pemeriksaan Guru)
  const [viewMode, setViewMode] = useState<"preview" | "digital-interactive" | "rubrik">("preview");

  // Digital student answers state
  const [studentName, setStudentName] = useState("Ahmad Fauzi");
  const [studentNisn, setStudentNisn] = useState("0089123456");
  const [studentAnswers, setStudentAnswers] = useState<{ [key: string]: string }>({});
  const [studentSubmitted, setStudentSubmitted] = useState(false);

  // Teacher grading state
  const [teacherScore, setTeacherScore] = useState<number>(88);
  const [teacherFeedback, setTeacherFeedback] = useState<string>("Sangat baik dan pemahaman dalil sudah tepat.");

  const printableAreaRef = useRef<HTMLDivElement>(null);

  if (!currentBundle) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center mx-auto text-2xl">
          📄
        </div>
        <h3 className="text-xl font-black text-slate-900">Belum Ada LKPD Digital</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Silakan gunakan Generator AI untuk membuat LKPD profesional siap cetak A4.
        </p>
        <button
          onClick={onOpenGenerator}
          className="px-5 py-2.5 bg-blue-900 text-amber-300 font-black text-xs rounded-xl shadow-xs hover:bg-blue-800 transition cursor-pointer"
        >
          Buka Generator LKPD AI
        </button>
      </div>
    );
  }

  const lkpd = currentBundle.lkpd;
  const materi = currentBundle.materiPembelajaran;
  const questionsList = currentBundle.cbt.daftarSoal || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    const content = `
    <html>
      <head><meta charset="utf-8"><title>LKPD PAI ${currentBundle.materi}</title></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 2px;">UPT SMPN 2 REBANG TANGKAS</h2>
        <h3 style="text-align: center; margin-top: 0;">LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL</h3>
        <p style="text-align: center;">Mata Pelajaran: Pendidikan Agama Islam & Budi Pekerti | Kelas ${currentBundle.kelas} SMP</p>
        <hr/>
        <p><strong>Judul Materi:</strong> ${currentBundle.materi} (${currentBundle.subMateri})</p>
        <p><strong>Tujuan Pembelajaran:</strong> ${lkpd.tujuanPembelajaran.join(". ")}</p>
        <p><strong>Petunjuk Pengerjaan:</strong> ${lkpd.petunjukPengerjaan.join("; ")}</p>
        <h4>I. MATERI SINGKAT & DALIL</h4>
        <p>${lkpd.materiSingkat}</p>
        <h4>II. SOAL PILIHAN GANDA & HOTS</h4>
        ${questionsList.map((s, i) => `<p>${i + 1}. ${s.pertanyaan} [${s.tingkatKesulitan}]<br/>A. ${s.pilihan[0]} | B. ${s.pilihan[1]} | C. ${s.pilihan[2]} | D. ${s.pilihan[3]}</p>`).join("")}
        <h4>III. KESIMPULAN & REFLEKSI</h4>
        <p>${lkpd.kesimpulan || "Diskusikan penerapan materi bersama teman kelompokmu."}</p>
      </body>
    </html>
    `;
    const blob = new Blob([content], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LKPD_${currentBundle.materi.replace(/\s+/g, "_")}_A4.doc`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS (NOT PRINTED) */}
      <div className="print:hidden p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-black text-xs uppercase">
              LKPD Digital A4
            </span>
            <span className="text-xs text-slate-500 font-bold">
              UPT SMPN 2 REBANG TANGKAS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {currentBundle.materi}: {currentBundle.subMateri}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div className="p-1 rounded-xl bg-slate-100 flex items-center">
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "preview" ? "bg-white text-slate-900 shadow-xs font-black" : "text-slate-600"
              }`}
            >
              📄 Format Cetak A4
            </button>
            <button
              onClick={() => setViewMode("digital-interactive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "digital-interactive" ? "bg-white text-slate-900 shadow-xs font-black" : "text-slate-600"
              }`}
            >
              ✍️ Siswa Isi Digital
            </button>
            <button
              onClick={() => setViewMode("rubrik")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "rubrik" ? "bg-white text-slate-900 shadow-xs font-black" : "text-slate-600"
              }`}
            >
              📊 Rubrik Nilai Guru
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4 / PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word (DOCX)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PRINTABLE A4 SHEET (POIN 1-22 LENGKAP) */}
      {viewMode === "preview" && (
        <div
          ref={printableAreaRef}
          className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-xl print:shadow-none print:border-none print:p-0 space-y-6 text-slate-900 font-sans"
        >
          {/* 1. COVER & KOP IDENTITAS SEKOLAH (Poin 1, 2) */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-600">
              PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN DAN KEBUDAYAAN
            </h3>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              UPT SMPN 2 REBANG TANGKAS
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              Kecamatan Rebang Tangkas, Kabupaten Way Kanan, Lampung • NPSN: 10806847
            </p>
            <div className="inline-block px-4 py-1 mt-2 rounded-full bg-blue-950 text-amber-300 text-xs font-black uppercase tracking-wider">
              LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL
            </div>
          </div>

          {/* 3, 4, 5, 6, 7. IDENTITAS PEMBELAJARAN (Tabel Identitas) */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <div>
                <span className="font-bold text-slate-500">Mata Pelajaran: </span>
                <strong className="text-slate-900">Pendidikan Agama Islam & Budi Pekerti</strong>
              </div>
              <div>
                <span className="font-bold text-slate-500">Kelas / Semester: </span>
                <strong className="text-slate-900">Kelas {currentBundle.kelas} SMP / Semester Ganjil</strong>
              </div>
              <div>
                <span className="font-bold text-slate-500">Materi Pokok: </span>
                <strong className="text-slate-900">{currentBundle.materi}</strong>
              </div>
              <div>
                <span className="font-bold text-slate-500">Submateri: </span>
                <strong className="text-slate-900">{currentBundle.subMateri}</strong>
              </div>
            </div>

            <div className="space-y-1.5 border-l border-slate-200 pl-4">
              <div>
                <span className="font-bold text-slate-500">Nama Siswa: </span>
                <span className="border-b border-dotted border-slate-600 pb-0.5 inline-block w-44">
                  {studentName || "................................................"}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">NIS / NISN: </span>
                <span className="border-b border-dotted border-slate-600 pb-0.5 inline-block w-44">
                  {studentNisn || "................................................"}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Hari / Tanggal: </span>
                <span className="border-b border-dotted border-slate-600 pb-0.5 inline-block w-44">
                  {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Guru Pengampu: </span>
                <strong className="text-slate-900">{currentBundle.guruNama || "Sadiqul Alim, S.Pd.I., M.Pd."}</strong>
              </div>
            </div>
          </div>

          {/* 8 & 9. TUJUAN PEMBELAJARAN & PETUNJUK */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider flex items-center gap-1.5">
              <span>A. TUJUAN PEMBELAJARAN</span>
            </h4>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-950 font-semibold leading-relaxed">
              {lkpd.tujuanPembelajaran.join(". ")}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider flex items-center gap-1.5">
              <span>B. PETUNJUK PENGERJAAN</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {lkpd.petunjukPengerjaan.join("; ")}
            </p>
          </div>

          {/* 10 & 11. RINGKASAN MATERI & DALIL NAQLI */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>C. RINGKASAN MATERI & DALIL NAQLI</span>
            </h4>
            <div className="text-xs text-slate-800 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200 whitespace-pre-line">
              {lkpd.materiSingkat || materi.materiInti}
            </div>

            {/* Dalil Callout */}
            {materi.dalilQuran && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-950 text-amber-300 font-mono text-[10px] font-black">
                  Dalil Al-Qur'an: {materi.dalilQuran.sumber}
                </span>
                <p className="text-base font-arabic text-right text-slate-900 font-bold py-1">
                  {materi.dalilQuran.teksArab}
                </p>
                <p className="text-xs text-slate-700 italic">
                  "{materi.dalilQuran.terjemahan}"
                </p>
              </div>
            )}
          </div>

          {/* 13. PERTANYAAN PEMANTIK */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>D. PERTANYAAN PEMANTIK</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 font-bold leading-relaxed">
              💬 "Bagaimana ajaran tentang <strong>{currentBundle.subMateri}</strong> dapat kamu amalkan secara nyata dalam kehidupan sehari-hari di lingkungan sekolah dan keluarga?"
            </div>
          </div>

          {/* 14 & 15. KEGIATAN INDIVIDU & DISKUSI KELOMPOK */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>E. KEGIATAN PEMBELAJARAN (INDIVIDU & KELOMPOK)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-blue-900 block">1. Aktivitas Mandiri (Individu):</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lkpd.aktivitasList[0]?.instruksi || "Tuliskan rangkuman dan 3 contoh pengamalan materi ini pada tabel di bawah."}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-blue-900 block">2. Diskusi Kelompok:</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lkpd.aktivitasList[1]?.instruksi || "Diskusikan bersama 4-5 teman kelompok mengenai studi kasus yang terjadi di masyarakat."}
                </p>
              </div>
            </div>
          </div>

          {/* 16. TABEL AKTIVITAS SISWA */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>F. TABEL AKTIVITAS & IDENTIFIKASI SISWA</span>
            </h4>
            <table className="w-full text-xs border border-slate-300 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-black">
                <tr>
                  <th className="p-2 border border-slate-300 w-12 text-center">No</th>
                  <th className="p-2 border border-slate-300 text-left">Aspek / Indikator Perilaku</th>
                  <th className="p-2 border border-slate-300 text-left">Contoh Tindakan Nyata</th>
                  <th className="p-2 border border-slate-300 w-32 text-center">Paraf / Ceklis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Penerapan dalam Ibadah Shalat / Ketaatan",
                  "Sikap Berakhlak Terpuji kepada Sesama",
                  "Menghindari Perbuatan Tercela / Dilarang"
                ].map((aspek, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border border-slate-300 text-center font-bold">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{aspek}</td>
                    <td className="p-2 border border-slate-300 text-slate-400">
                      ...........................................................................
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-400">[ &nbsp; &nbsp; ]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 17, 18, 19. SOAL LATIHAN: PILIHAN GANDA, URAIAN & SOAL HOTS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>G. SOAL LATIHAN & EVALUASI (PILIHAN GANDA, URAIAN & HOTS)</span>
            </h4>
            <div className="space-y-3">
              {questionsList.map((soal, sIdx) => (
                <div key={sIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">Soal No. {sIdx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px]">
                      {soal.tingkatKesulitan || "Sedang"}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{soal.pertanyaan}</p>
                  {soal.pilihan && (
                    <div className="grid grid-cols-2 gap-2 pt-1 pl-2 text-slate-700">
                      {soal.pilihan.map((op, oIdx) => (
                        <div key={oIdx}>
                          <strong>{String.fromCharCode(65 + oIdx)}.</strong> {op}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 text-slate-400">
                    Jawaban Siswa: ...........................................................................................................
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 20. REFLEKSI PEMBELAJARAN */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-950 tracking-wider">
              <span>H. REFLEKSI PEMBELAJARAN SISWA</span>
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>1. Hal baru apa yang paling berkesan setelah kamu mempelajari materi ini?</p>
              <p className="text-slate-400">...................................................................................................................................</p>
              <p>2. Rencana perubahan kebaikan apa yang akan kamu lakukan mulai besok?</p>
              <p className="text-slate-400">...................................................................................................................................</p>
            </div>
          </div>

          {/* 21 & 22. RUBRIK PENILAIAN & KOLOM NILAI GURU */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-300 text-xs">
            {/* Rubrik Penilaian */}
            <div className="space-y-1.5">
              <span className="font-black text-slate-900 uppercase">Rubrik Penilaian:</span>
              <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc pl-4">
                <li>Ketepatan Jawaban Soal (Bobot 40%)</li>
                <li>Kedalaman Analisis Studi Kasus (Bobot 30%)</li>
                <li>Kerapian dan Keaktifan Diskusi (Bobot 30%)</li>
              </ul>
            </div>

            {/* Kolom Tanda Tangan & Nilai */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">
                Rebang Tangkas, {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
              </span>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="block text-[11px] text-slate-500">Nilai Siswa:</span>
                  <div className="w-16 h-12 border-2 border-dashed border-slate-400 rounded-lg mx-auto flex items-center justify-center font-black text-lg text-blue-900">
                    {teacherScore}
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Guru Mata Pelajaran,</span>
                  <div className="h-10"></div>
                  <strong className="block text-xs text-slate-900 underline">
                    {currentBundle.guruNama || "Sadiqul Alim, S.Pd.I."}
                  </strong>
                  <span className="text-[10px] text-slate-500">NIP. 198507142010011012</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DIGITAL INTERACTIVE (SISWA MENGISI DIGITAL) */}
      {viewMode === "digital-interactive" && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase">
              Mode Siswa Digital
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Pengisian Lembar Kerja Siswa Secara Digital
            </h3>
            <p className="text-xs text-slate-500">
              Siswa dapat mengerjakan LKPD langsung melalui gadget/laptop tanpa perlu mencetak kertas.
            </p>
          </div>

          {/* Student Identitas Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">NISN / Nomor Induk:</label>
              <input
                type="text"
                value={studentNisn}
                onChange={(e) => setStudentNisn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 pt-2">
            {questionsList.map((soal, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900">Pertanyaan {idx + 1}:</span>
                  <span className="text-[10px] font-bold text-slate-500">{soal.tingkatKesulitan || "Pilihan Ganda"}</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{soal.pertanyaan}</p>

                {soal.pilihan ? (
                  <div className="space-y-1.5 pt-1">
                    {soal.pilihan.map((op, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      return (
                        <label
                          key={oIdx}
                          className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`soal-${idx}`}
                            checked={studentAnswers[`soal-${idx}`] === letter}
                            onChange={() =>
                              setStudentAnswers({ ...studentAnswers, [`soal-${idx}`]: letter })
                            }
                            className="text-blue-600"
                          />
                          <span>
                            <strong>{letter}.</strong> {op}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    placeholder="Ketikkan jawaban lengkapmu di sini..."
                    value={studentAnswers[`soal-${idx}`] || ""}
                    onChange={(e) =>
                      setStudentAnswers({ ...studentAnswers, [`soal-${idx}`]: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {studentSubmitted ? (
              <div className="flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Jawaban Anda Telah Terkirim ke Guru!</span>
              </div>
            ) : (
              <button
                onClick={() => setStudentSubmitted(true)}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Kirim Jawaban LKPD ke Guru
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: RUBRIK & PEMERIKSAAN GURU */}
      {viewMode === "rubrik" && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase">
              Pemeriksaan & Rubrik Guru
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Formulir Penilaian & Umpan Balik Guru
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Siswa yang Dinilai:</label>
              <input
                type="text"
                value={studentName}
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nilai Akhir (0 - 100):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={teacherScore}
                onChange={(e) => setTeacherScore(Number(e.target.value))}
                className="w-32 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-lg font-black text-blue-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Catatan Umpan Balik Guru:</label>
              <textarea
                rows={3}
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                alert("Nilai dan umpan balik LKPD berhasil disimpan!");
                setViewMode("preview");
              }}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Simpan Penilaian ke Database Siswa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
