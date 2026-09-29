/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FileSpreadsheet, CheckCircle, Upload, Send, Clock, BookOpen, FileText, Download } from "lucide-react";
import { SoalLkpdItem } from "../../../types/bahanAjarAi";

interface StudentLkpdPlayerProps {
  lkpd: SoalLkpdItem;
  initialAnswers?: Record<number, string>;
  onSubmit: (answers: Record<number, string>, uploadedFileName?: string) => void;
  onClose: () => void;
}

export default function StudentLkpdPlayer({
  lkpd,
  initialAnswers = {},
  onSubmit,
  onClose
}: StudentLkpdPlayerProps) {
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (soalNo: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [soalNo]: text
    }));
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmit(answers, uploadedFile || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-teal-950/60 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white truncate max-w-[280px] sm:max-w-md">{lkpd.judul}</h3>
              <p className="text-[11px] text-teal-300/80">
                Alokasi: {lkpd.alokasiWaktu} • Kelas {lkpd.kelas} ({lkpd.semester})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
          >
            Tutup
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Stimulus Materi Box */}
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>STIMULUS &amp; BACAAN MATERI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 font-sans">
              {lkpd.stimulusMateri}
            </p>
            {lkpd.petunjukPengerjaan && (
              <p className="text-[11px] text-slate-400 italic">
                {lkpd.petunjukPengerjaan}
              </p>
            )}
          </div>

          {/* Soal List with Input Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-teal-300 tracking-wider flex items-center justify-between">
              <span>LEMBAR JAWABAN SISWA ({lkpd.daftarSoal.length} BUTIR SOAL)</span>
              <span className="text-[10px] text-slate-400">Tulis jawaban langsung di kotak bawah</span>
            </h4>

            {lkpd.daftarSoal.map((soal) => (
              <div
                key={soal.nomor}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 font-black text-xs flex items-center justify-center shrink-0">
                      {soal.nomor}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-teal-400 font-bold">
                      {soal.tipeSoal}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Maks. {soal.skorMaks} Poin</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  {soal.pertanyaan}
                </p>

                {soal.pilihanOpsi && soal.pilihanOpsi.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 my-2">
                    {soal.pilihanOpsi.map((opsi, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleAnswerChange(soal.nomor, opsi.charAt(0))}
                        className={`text-left text-xs p-2.5 rounded-xl border transition ${
                          (answers[soal.nomor] || "") === opsi.charAt(0)
                            ? "bg-teal-500/20 border-teal-400 text-teal-200 font-bold"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {opsi}
                      </button>
                    ))}
                  </div>
                )}

                {/* Textarea for essay / explanation */}
                <textarea
                  rows={3}
                  value={answers[soal.nomor] || ""}
                  onChange={(e) => handleAnswerChange(soal.nomor, e.target.value)}
                  placeholder={`Ketik uraian jawaban soal nomor ${soal.nomor} di sini...`}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Optional Attachment Upload */}
          <div className="bg-slate-800/40 border border-dashed border-slate-700 p-4 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Unggah Berkas Lembar Kerja / Foto Tulisan Tangan (Opsional):</span>
              {uploadedFile && <span className="text-emerald-400 font-bold">✓ Terlampir</span>}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Pilih File PDF/Foto</span>
                <input type="file" onChange={handleSimulateUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
              </label>

              {uploadedFile ? (
                <span className="text-xs text-teal-300 font-mono truncate">{uploadedFile}</span>
              ) : (
                <span className="text-xs text-slate-500">Maks. 10 MB (Format PDF/Gambar)</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isSubmitted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Jawaban LKPD Berhasil Dikumpulkan!
              </span>
            ) : (
              `${Object.keys(answers).filter((k) => (answers[Number(k)] || "").trim().length > 0).length} dari ${lkpd.daftarSoal.length} soal telah dijawab`
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kumpulkan Tugas LKPD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
