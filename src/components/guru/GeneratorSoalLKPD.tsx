/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  FileText,
  Printer,
  Copy,
  Check,
  Save,
  HelpCircle,
  CheckCircle,
  Sliders,
  Award,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Send,
  BookOpenCheck,
  Zap,
  Info
} from "lucide-react";
import { BabPelajaran, SoalPilihanGanda } from "../../types";
import { generateAutomaticLKPD, LKPDItem } from "../../lib/lkpdGenerator";

interface GeneratorSoalLKPDProps {
  babPelajaran: BabPelajaran[];
  onUpdateBabPelajaran: (updated: BabPelajaran[]) => void;
}

export default function GeneratorSoalLKPD({
  babPelajaran,
  onUpdateBabPelajaran
}: GeneratorSoalLKPDProps) {
  // Config & Form States
  const [selectedBabId, setSelectedBabId] = useState<string>(babPelajaran[0]?.id || "custom");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [customDesc, setCustomDesc] = useState<string>("");
  const [kelasId, setKelasId] = useState<string>("VII");
  const [semester, setSemester] = useState<string>("1");
  const [difficulty, setDifficulty] = useState<"Mudah" | "Sedang" | "HOTS">("HOTS");
  const [jumlahSoal, setJumlahSoal] = useState<number>(5);
  const [targetBabForLms, setTargetBabForLms] = useState<string>(babPelajaran[0]?.id || "");

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [activeResultTab, setActiveResultTab] = useState<"lkpd" | "soal">("lkpd");
  const [generatedLKPD, setGeneratedLKPD] = useState<LKPDItem | null>(null);

  // Success Feedback
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [savedToLmsToast, setSavedToLmsToast] = useState<string | null>(null);

  // Sync custom inputs when Bab dropdown changes
  const handleSelectBabChange = (id: string) => {
    setSelectedBabId(id);
    if (id !== "custom") {
      const bab = babPelajaran.find((b) => b.id === id);
      if (bab) {
        setCustomTopic(bab.judul);
        setCustomDesc(bab.deskripsi);
        setKelasId(bab.kelasId || "VII");
        setTargetBabForLms(bab.id);
      }
    } else {
      setCustomTopic("");
      setCustomDesc("");
    }
  };

  // Run AI Generator simulation
  const handleGenerateClick = () => {
    const topic = selectedBabId === "custom" ? customTopic : customTopic || babPelajaran.find(b => b.id === selectedBabId)?.judul || "";
    if (!topic.trim()) {
      alert("Silakan masukkan Judul Bab atau Topik Materi PAI terlebih dahulu!");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("1. Menganalisis Kurikulum Merdeka PAI & Elemen Pembelajaran...");

    setTimeout(() => {
      setGenerationStep("2. Menyusun Indikator TP, Pertanyaan Pemantik & Dalil Naqli...");
      setTimeout(() => {
        setGenerationStep("3. Merumuskan Aktivitas Kelompok & Soal HOTS Pilihan Ganda...");
        setTimeout(() => {
          setGenerationStep("4. Finalisasi Rubrik Penilaian KKTP & Format LKPD...");
          setTimeout(() => {
            const lkpd = generateAutomaticLKPD(topic, customDesc, {
              kelasId,
              semester,
              difficulty,
              jumlahSoal
            });
            setGeneratedLKPD(lkpd);
            setIsGenerating(false);
            setGenerationStep("");
          }, 400);
        }, 500);
      }, 500);
    }, 500);
  };

  // Copy full LKPD text to clipboard
  const handleCopyText = () => {
    if (!generatedLKPD) return;

    let text = `====================================================\n`;
    text += `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI\n`;
    text += `UPT SMPN 2 REBANG TANGKAS\n`;
    text += `====================================================\n\n`;
    text += `Mata Pelajaran : PAI dan Budi Pekerti\n`;
    text += `Judul Bab      : ${generatedLKPD.babJudul}\n`;
    text += `Kelas/Semester : Kelas ${generatedLKPD.kelasId} / Semester ${generatedLKPD.semester}\n`;
    text += `Elemen PAI     : ${generatedLKPD.elemen}\n`;
    text += `Alokasi Waktu  : ${generatedLKPD.alokasiWaktu}\n\n`;

    text += `----------------------------------------------------\n`;
    text += `I. CAPAIAN & TUJUAN PEMBELAJARAN\n`;
    text += `----------------------------------------------------\n`;
    text += `Capaian: ${generatedLKPD.capaianPembelajaran}\n\nTujuan Pembelajaran:\n`;
    generatedLKPD.tujuanPembelajaran.forEach((tp, i) => {
      text += `${i + 1}. ${tp}\n`;
    });

    text += `\n----------------------------------------------------\n`;
    text += `II. STIMULUS BACAAN & DALIL NAQLI\n`;
    text += `----------------------------------------------------\n`;
    text += `Judul: ${generatedLKPD.stimulusBacaan.judul}\n`;
    text += `${generatedLKPD.stimulusBacaan.teks}\n`;
    if (generatedLKPD.stimulusBacaan.dalilNaqli) {
      text += `\nDalil Naqli:\n"${generatedLKPD.stimulusBacaan.dalilNaqli.teksArab}"\n`;
      text += `Artinya: "${generatedLKPD.stimulusBacaan.dalilNaqli.terjemahan}" (${generatedLKPD.stimulusBacaan.dalilNaqli.sumber})\n`;
    }

    text += `\n----------------------------------------------------\n`;
    text += `III. AKTIVITAS KELOMPOK\n`;
    text += `----------------------------------------------------\n`;
    text += `Tugas: ${generatedLKPD.aktivitasKelompok.judulTugas}\n`;
    text += `Instruksi: ${generatedLKPD.aktivitasKelompok.instruksi}\n`;
    generatedLKPD.aktivitasKelompok.pertanyaanDiskusi.forEach((p, i) => {
      text += `${i + 1}. ${p}\n`;
    });

    text += `\n----------------------------------------------------\n`;
    text += `IV. SOAL LATIHAN PILIHAN GANDA (${generatedLKPD.soalPilihanGanda.length} SOAL)\n`;
    text += `----------------------------------------------------\n`;
    generatedLKPD.soalPilihanGanda.forEach((s, i) => {
      text += `${i + 1}. ${s.pertanyaan}\n`;
      s.pilihan.forEach((p) => {
        text += `   ${p}\n`;
      });
      text += `   Kunci: ${s.jawabanBenar}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Print view handler
  const handlePrint = () => {
    window.print();
  };

  // Save generated questions to LMS Quiz Bank for students
  const handleSaveToLms = () => {
    if (!generatedLKPD || generatedLKPD.soalPilihanGanda.length === 0) return;

    const targetBab = babPelajaran.find((b) => b.id === targetBabForLms);
    if (!targetBab) {
      alert("Pilih Bab Pelajaran target di LMS terlebih dahulu!");
      return;
    }

    const currentQuestions = targetBab.soalList || [];
    const newQuestions = generatedLKPD.soalPilihanGanda;

    // Merge non-duplicate questions
    const mergedList = [...currentQuestions];
    newQuestions.forEach((nq) => {
      if (!mergedList.some((q) => q.pertanyaan === nq.pertanyaan)) {
        mergedList.push(nq);
      }
    });

    const updatedBabList = babPelajaran.map((b) => {
      if (b.id === targetBab.id) {
        return {
          ...b,
          soalList: mergedList
        };
      }
      return b;
    });

    onUpdateBabPelajaran(updatedBabList);
    setSavedToLmsToast(`⚡ Alhamdulillah! ${newQuestions.length} Soal PAI otomatis berhasil ditambahkan ke Kuis LMS ${targetBab.judul}. Siswa kini dapat mengaksesnya di Ruang Kelas LMS.`);
    setTimeout(() => setSavedToLmsToast(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {savedToLmsToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-slideDown max-w-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
          <p className="font-semibold">{savedToLmsToast}</p>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Fitur AI Generator PAI
            </span>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Pembuatan Soal & LKPD Otomatis (AI)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Susun Lembar Kerja Peserta Didik (LKPD), Asesmen Formatif, dan Soal Kuis Pilihan Ganda HOTS secara otomatis disesuaikan dengan Kurikulum Merdeka PAI SMP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Target Kurikulum</span>
              <span className="text-xs font-black text-amber-300">Merdeka PAI SMP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Pengaturan Parameter AI
            </h3>
          </div>

          {/* Bab Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-700">
              Pilih Bab Pelajaran PAI *
            </label>
            <select
              value={selectedBabId}
              onChange={(e) => handleSelectBabChange(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              {babPelajaran.map((bab) => (
                <option key={bab.id} value={bab.id}>
                  Kelas {bab.kelasId || "VII"} – {bab.judul}
                </option>
              ))}
              <option value="custom">+ Tulis Bab / Topik Khusus Manual</option>
            </select>
          </div>

          {/* Custom Topic Input if Custom Selected */}
          {selectedBabId === "custom" && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Judul Bab / Topik *</label>
                <input
                  type="text"
                  placeholder="Contoh: Bab 4 Sujud Syukur, Sahwi, dan Tilawah"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 font-semibold bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Deskripsi Ringkas Materi</label>
                <textarea
                  placeholder="Ringkasan materi atau tujuan utama..."
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 font-medium bg-white"
                />
              </div>
            </div>
          )}

          {/* Grid Options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Kelas Target</label>
              <select
                value={kelasId}
                onChange={(e) => setKelasId(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
              >
                <option value="1">Semester 1 (Ganjil)</option>
                <option value="2">Semester 2 (Genap)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Tingkat Kesulitan</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50 text-emerald-800"
              >
                <option value="Mudah">Mudah (Pemahaman)</option>
                <option value="Sedang">Sedang (Aplikasi)</option>
                <option value="HOTS">HOTS (Analisis Tinggi)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Jumlah Soal Kuis</label>
              <select
                value={jumlahSoal}
                onChange={(e) => setJumlahSoal(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
              >
                <option value={3}>3 Soal Singkat</option>
                <option value={5}>5 Soal Standar (Rekomendasi)</option>
                <option value={8}>8 Soal Komprehensif</option>
                <option value={10}>10 Soal Ujian</option>
              </select>
            </div>
          </div>

          {/* Action Execution Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Menyusun LKPD & Soal AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Generate Soal & LKPD Otomatis</span>
                </>
              )}
            </button>
          </div>

          {/* Generating Loader Step */}
          {isGenerating && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-[11px] font-semibold space-y-1 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="font-extrabold">Proses Generasi AI Berjalan...</span>
              </div>
              <p className="text-[10px] text-emerald-700 leading-tight">{generationStep}</p>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[10px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" /> Informasi Output
            </span>
            <p>
              Hasil generasi mencakup struktur dokumen LKPD lengkap (Identitas, CP, TP, Stimulus Dalil Naqli, Diskusi Kelompok, Soal Kuis, Refleksi Karakter, & Rubrik KKTP).
            </p>
          </div>
        </div>

        {/* Right Column: Display Generated Result */}
        <div className="lg:col-span-2 space-y-4">
          {!generatedLKPD ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center text-slate-400 space-y-3 shadow-sm min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-2xl border border-emerald-100">
                📝
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Belum Ada Dokumen Ditampilkan</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Pilih Bab Pelajaran di sebelah kiri lalu klik <span className="font-bold text-emerald-700">"Generate Soal & LKPD Otomatis"</span> untuk membuat instrumen pembelajaran baru.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              {/* Output Action Header */}
              <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 print:hidden">
                {/* Result Tabs */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveResultTab("lkpd")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                      activeResultTab === "lkpd"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Dokumen LKPD
                  </button>
                  <button
                    onClick={() => setActiveResultTab("soal")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                      activeResultTab === "soal"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <BookOpenCheck className="w-3.5 h-3.5 text-amber-300" />
                    Kuis ({generatedLKPD.soalPilihanGanda.length} Soal)
                  </button>
                </div>

                {/* Document Actions toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
                    title="Salin Seluruh Teks ke Clipboard"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
                    title="Cetak Berkas LKPD"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {/* Target LMS Quick Save Box */}
              <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-semibold print:hidden">
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Simpan Soal Kuis ke LMS Siswa Bab:
                  </span>
                  <select
                    value={targetBabForLms}
                    onChange={(e) => setTargetBabForLms(e.target.value)}
                    className="p-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    {babPelajaran.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.judul}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveToLms}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Soal ke LMS Siswa</span>
                </button>
              </div>

              {/* Document Content Sheet */}
              <div className="p-6 md:p-8 space-y-6 text-slate-800 text-xs leading-relaxed max-h-[650px] overflow-y-auto">
                {activeResultTab === "lkpd" ? (
                  /* TAB 1: FORMATED LKPD WORKSHEET */
                  <div className="space-y-6 font-sans">
                    {/* Header Kop */}
                    <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                      <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                        LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI
                      </h2>
                      <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                        UPT SMPN 2 REBANG TANGKAS – KURIKULUM MERDEKA
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Tahun Ajaran 2026/2027 • Asesmen Formatif Pembelajaran PAI
                      </p>
                    </div>

                    {/* Identitas Table */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Mata Pelajaran:</span>{" "}
                        <strong className="text-slate-900">PAI dan Budi Pekerti</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Kelas / Semester:</span>{" "}
                        <strong className="text-slate-900">Kelas {generatedLKPD.kelasId} / Semester {generatedLKPD.semester}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Judul Bab:</span>{" "}
                        <strong className="text-emerald-800">{generatedLKPD.babJudul}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Elemen PAI:</span>{" "}
                        <strong className="text-slate-900">{generatedLKPD.elemen}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Alokasi Waktu:</span>{" "}
                        <strong className="text-slate-900">{generatedLKPD.alokasiWaktu}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Tanggal Dibuat:</span>{" "}
                        <strong className="text-slate-900">{generatedLKPD.tanggalDibuat}</strong>
                      </div>
                    </div>

                    {/* I. Capaian & Tujuan Pembelajaran */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        I. Capaian & Tujuan Pembelajaran (TP)
                      </h4>
                      <p className="text-slate-700 pl-2">
                        <strong>Capaian Pembelajaran (CP):</strong> {generatedLKPD.capaianPembelajaran}
                      </p>
                      <div className="pl-2 space-y-1">
                        <strong>Tujuan Pembelajaran:</strong>
                        <ol className="list-decimal list-inside space-y-1 pl-2 font-medium text-slate-700">
                          {generatedLKPD.tujuanPembelajaran.map((tp, i) => (
                            <li key={i}>{tp}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* II. Petunjuk Kerja */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        II. Petunjuk Pengerjaan
                      </h4>
                      <ul className="list-disc list-inside space-y-1 pl-4 font-medium text-slate-700">
                        {generatedLKPD.petunjukKerja.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* III. Stimulus Bacaan & Dalil Naqli */}
                    <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                        III. Stimulus Bacaan & Dalil Naqli
                      </h4>
                      <h5 className="font-bold text-slate-900 text-xs">{generatedLKPD.stimulusBacaan.judul}</h5>
                      <p className="text-slate-700 leading-relaxed font-medium">{generatedLKPD.stimulusBacaan.teks}</p>

                      {generatedLKPD.stimulusBacaan.dalilNaqli && (
                        <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1 text-center">
                          <p className="text-sm font-serif font-bold text-emerald-950 leading-loose">
                            {generatedLKPD.stimulusBacaan.dalilNaqli.teksArab}
                          </p>
                          <p className="text-[11px] text-slate-700 italic font-medium">
                            "{generatedLKPD.stimulusBacaan.dalilNaqli.terjemahan}"
                          </p>
                          <span className="text-[10px] font-bold text-emerald-800 block">
                            ({generatedLKPD.stimulusBacaan.dalilNaqli.sumber})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* IV. Aktivitas Kelompok */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        IV. Lembar Diskusi & Studi Kasus Kelompok
                      </h4>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <h5 className="font-extrabold text-slate-900">{generatedLKPD.aktivitasKelompok.judulTugas}</h5>
                        <p className="text-slate-700 font-medium">{generatedLKPD.aktivitasKelompok.instruksi}</p>
                        <div className="pt-2 space-y-2">
                          <span className="font-bold text-slate-900 block">Pertanyaan Diskusi:</span>
                          {generatedLKPD.aktivitasKelompok.pertanyaanDiskusi.map((q, idx) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 font-semibold text-slate-800">
                              {idx + 1}. {q}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* V. Aktivitas Mandiri HOTS */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        V. Pertanyaan Pemahaman Mandiri (HOTS)
                      </h4>
                      <div className="space-y-2">
                        {generatedLKPD.aktivitasMandiri.pertanyaanHots.map((q, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                            <span className="font-extrabold text-slate-900 block">Pertanyaan {idx + 1}:</span>
                            <p className="text-slate-800 font-medium">{q}</p>
                            <div className="h-16 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 p-2 text-[10px] text-slate-400">
                              [Tempat Lembar Jawaban Siswa...]
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VI. Refleksi Karakter */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        VI. Refleksi Karakter Profil Pelajar Pancasila & Rahmatan Lil 'Alamin
                      </h4>
                      <div className="space-y-1.5 pl-2">
                        {generatedLKPD.refleksiKarakter.map((ref, idx) => (
                          <label key={idx} className="flex items-start gap-2 text-slate-700 font-medium p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <input type="checkbox" className="mt-0.5 rounded text-emerald-700" />
                            <span>{ref}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* VII. Rubrik Penilaian KKTP */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 p-2 rounded-lg border-l-4 border-emerald-700">
                        VII. Rubrik Penilaian KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
                          <thead>
                            <tr className="bg-slate-800 text-white font-bold">
                              <th className="p-2 border border-slate-700">Aspek Penilaian</th>
                              <th className="p-2 border border-slate-700">Sangat Baik (Skor 4)</th>
                              <th className="p-2 border border-slate-700">Baik (Skor 3)</th>
                              <th className="p-2 border border-slate-700">Perlu Bimbingan (Skor 2)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatedLKPD.rubrikPenilaian.map((r, idx) => (
                              <tr key={idx} className="border-b border-slate-200">
                                <td className="p-2 border border-slate-200 font-bold bg-slate-50">{r.aspek}</td>
                                <td className="p-2 border border-slate-200 text-emerald-900 bg-emerald-50/30">{r.skor4}</td>
                                <td className="p-2 border border-slate-200 text-slate-700">{r.skor3}</td>
                                <td className="p-2 border border-slate-200 text-amber-900 bg-amber-50/30">{r.skor2}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TAB 2: QUIZ QUESTIONS LIST */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Daftar Soal Kuis Pilihan Ganda ({generatedLKPD.soalPilihanGanda.length} Soal)
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Soal otomatis disusun berdasarkan Kurikulum Merdeka PAI ({difficulty}).
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        Tingkat: {difficulty}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {generatedLKPD.soalPilihanGanda.map((soal, sIdx) => (
                        <div key={soal.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                              {sIdx + 1}
                            </span>
                            <p className="text-xs font-bold text-slate-900 leading-relaxed pt-0.5">
                              {soal.pertanyaan}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                            {soal.pilihan.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isCorrect = soal.jawabanBenar === letter || opt.startsWith(letter + ".");
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-lg border text-xs font-semibold ${
                                    isCorrect
                                      ? "bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold"
                                      : "bg-white border-slate-200 text-slate-700"
                                  }`}
                                >
                                  {opt}
                                  {isCorrect && (
                                    <span className="ml-2 text-[10px] font-black text-emerald-800 uppercase">
                                      ✓ Kunci
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {soal.pembahasan && (
                            <div className="ml-8 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                              <span className="font-extrabold block uppercase tracking-wider text-[9px] text-amber-800">
                                💡 Pembahasan Fiqih/Pelajaran:
                              </span>
                              <p className="font-medium">{soal.pembahasan}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
