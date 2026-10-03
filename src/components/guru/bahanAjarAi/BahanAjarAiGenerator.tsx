/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  ChevronDown,
  Layers,
  Clock,
  Video,
  FileQuestion,
  GraduationCap
} from "lucide-react";
import {
  KelasTingkatSmp,
  TingkatKesulitan,
  JumlahSoalCbt,
  DurasiVideo,
  GayaPembelajaran,
  BahanAjarAiCompleteBundle
} from "../../../types/bahanAjarAiModern";
import { KurikulumPaiService } from "../../../data/kurikulumPaiSmp";
import { BahanAjarAiGeneratorEngine } from "../../../services/bahanAjarAiGeneratorEngine";

interface BahanAjarAiGeneratorProps {
  onGenerated: (bundle: BahanAjarAiCompleteBundle) => void;
  onCancel?: () => void;
  guruNama?: string;
}

export default function BahanAjarAiGenerator({
  onGenerated,
  onCancel,
  guruNama = "Sadiqul Alim, S.Pd.I., M.Pd."
}: BahanAjarAiGeneratorProps) {
  // Curriculum state
  const [kurikulum] = useState(() => KurikulumPaiService.getKurikulum());

  // Form states
  const [selectedKelas, setSelectedKelas] = useState<KelasTingkatSmp>("7");
  const [selectedMateriId, setSelectedMateriId] = useState<string>("");
  const [selectedSubMateriId, setSelectedSubMateriId] = useState<string>("");

  // Optional customization settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tingkatKesulitan, setTingkatKesulitan] = useState<TingkatKesulitan>("Sedang");
  const [jumlahSoal, setJumlahSoal] = useState<JumlahSoalCbt>(10);
  const [durasiVideo, setDurasiVideo] = useState<DurasiVideo>("3 menit");
  const [gayaPembelajaran, setGayaPembelajaran] = useState<GayaPembelajaran>("Interaktif");

  // Loading & Progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available Materi based on selected class
  const currentKelasObj = kurikulum.find((k) => k.kelas === selectedKelas) || kurikulum[0];
  const availableMateriList = currentKelasObj ? currentKelasObj.materiList : [];

  // When class changes, select first available materi
  useEffect(() => {
    if (availableMateriList.length > 0) {
      setSelectedMateriId(availableMateriList[0].id);
    } else {
      setSelectedMateriId("");
    }
  }, [selectedKelas]);

  // Selected Materi object
  const currentMateriObj = availableMateriList.find((m) => m.id === selectedMateriId);
  const availableSubMateriList = currentMateriObj ? currentMateriObj.subMateriList : [];

  // When materi changes, select first available sub materi
  useEffect(() => {
    if (availableSubMateriList.length > 0) {
      setSelectedSubMateriId(availableSubMateriList[0].id);
    } else {
      setSelectedSubMateriId("");
    }
  }, [selectedMateriId]);

  const currentSubMateriObj = availableSubMateriList.find((s) => s.id === selectedSubMateriId);

  // Submit Handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation
    if (!selectedKelas) {
      setErrorMessage("Silakan pilih jenjang Kelas terlebih dahulu.");
      return;
    }
    if (!currentMateriObj) {
      setErrorMessage("Silakan pilih Materi pokok pembelajaran.");
      return;
    }
    if (!currentSubMateriObj) {
      setErrorMessage("Silakan pilih Sub Materi yang akan dibuatkan bahan ajar.");
      return;
    }

    setIsGenerating(true);
    setProgressPercent(5);
    setCurrentStepText("Menganalisis materi...");

    try {
      const bundle = await BahanAjarAiGeneratorEngine.generateCompleteBundle({
        kelas: selectedKelas,
        materi: currentMateriObj.judulMateri,
        subMateri: currentSubMateriObj.judul,
        tingkatKesulitan,
        jumlahSoal,
        durasiVideo,
        gayaPembelajaran,
        guruNama,
        onProgress: (step, pct) => {
          setCurrentStepText(step);
          setProgressPercent(pct);
        }
      });

      setIsGenerating(false);
      onGenerated(bundle);
    } catch (err: any) {
      console.error("Generator error:", err);
      setIsGenerating(false);
      setErrorMessage(err?.message || "Terjadi kesalahan saat memproses generasi AI. Silakan coba kembali.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-wider border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Generator Otomatis Media Pembelajaran PAI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          GENERATOR BAHAN AJAR AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Tentukan topik kurikulum di bawah ini. Sekali klik tombol <strong>"✨ BUAT DENGAN AI"</strong>, 
          sistem AI akan langsung memproduksi 6 jenis media pembelajaran PAI SMP yang komprehensif dan selaras.
        </p>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Pilih Kelas, Materi, Sub Materi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Kelas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              1. Kelas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value as KelasTingkatSmp)}
                disabled={isGenerating}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="7">Kelas 7 SMP (Fase D)</option>
                <option value="8">Kelas 8 SMP (Fase D)</option>
                <option value="9">Kelas 9 SMP (Fase D)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="block text-[10px] text-slate-500">Tingkat jenjang SMP</span>
          </div>

          {/* Materi */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              2. Materi Pokok PAI <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedMateriId}
                onChange={(e) => setSelectedMateriId(e.target.value)}
                disabled={isGenerating || availableMateriList.length === 0}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                {availableMateriList.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.kategori}] {m.judulMateri}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="block text-[10px] text-slate-500">
              Kategori: Al-Qur'an & Hadis, Akidah, Akhlak, Fikih, Sejarah Peradaban Islam
            </span>
          </div>
        </div>

        {/* Sub Materi */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            3. Sub Materi Spesifik <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedSubMateriId}
              onChange={(e) => setSelectedSubMateriId(e.target.value)}
              disabled={isGenerating || availableSubMateriList.length === 0}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition appearance-none cursor-pointer"
            >
              {availableSubMateriList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.judul} {s.deskripsiSingkat ? `— (${s.deskripsiSingkat})` : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {currentSubMateriObj?.deskripsiSingkat && (
            <p className="text-xs text-blue-800 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/60 font-medium">
              💡 <strong>Fokus Pembahasan:</strong> {currentSubMateriObj.deskripsiSingkat}
            </p>
          )}
        </div>

        {/* 2. Pilihan Opsional (Tingkat Kesulitan, Jumlah Soal, Durasi Video, Gaya Belajar) */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-black text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>{showAdvanced ? "Sembunyikan Opsi Lanjutan ▲" : "Tampilkan Opsi Kustomisasi Lanjutan ▼"}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4.5 rounded-2xl bg-slate-50 border border-slate-200">
              {/* Tingkat Kesulitan */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Tingkat Kesulitan
                </label>
                <select
                  value={tingkatKesulitan}
                  onChange={(e) => setTingkatKesulitan(e.target.value as TingkatKesulitan)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                  <option value="Campuran">Campuran</option>
                </select>
              </div>

              {/* Jumlah Soal CBT */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Jumlah Soal CBT
                </label>
                <select
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value) as JumlahSoalCbt)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value={10}>10 Soal</option>
                  <option value={15}>15 Soal</option>
                  <option value={20}>20 Soal</option>
                  <option value={25}>25 Soal</option>
                  <option value={30}>30 Soal</option>
                </select>
              </div>

              {/* Durasi Video */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Durasi Video
                </label>
                <select
                  value={durasiVideo}
                  onChange={(e) => setDurasiVideo(e.target.value as DurasiVideo)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="1 menit">1 menit (Microlearning)</option>
                  <option value="3 menit">3 menit (Standar)</option>
                  <option value="5 menit">5 menit (Eksplorasi)</option>
                  <option value="10 menit">10 menit (Mendalam)</option>
                </select>
              </div>

              {/* Gaya Pembelajaran */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Gaya Pembelajaran
                </label>
                <select
                  value={gayaPembelajaran}
                  onChange={(e) => setGayaPembelajaran(e.target.value as GayaPembelajaran)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="Interaktif">Interaktif</option>
                  <option value="Cerita">Cerita / Kisah Hikmah</option>
                  <option value="Animasi">Animasi Visual</option>
                  <option value="Diskusi">Diskusi & Refleksi</option>
                  <option value="Kontekstual">Kontekstual Sehari-hari</option>
                  <option value="Permainan">Permainan / Game-Based</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 3. Output Preview Checklist */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <span className="block text-[11px] font-black uppercase tracking-wider text-blue-900">
            Produk yang otomatis diproduksi:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 1. Materi Lengkap & Dalil</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 2. Storyboard Video & Prompt</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 3. Game Quiz Challenge</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 4. Game Match & Word</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 5. Teka-Teki Silang (TTS)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 6. LKPD 5 Aktivitas & CBT</span>
          </div>
        </div>

        {/* 4. Action Button / Loading Step Animation */}
        {isGenerating ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white space-y-4 shadow-lg animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{currentStepText || "Sedang memproses..."}</span>
              </span>
              <span>{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="text-[11px] text-slate-300 text-center font-medium">
              Mohon tunggu, AI sedang menyusun keterhubungan materi pembelajaran, storyboard, kuis, teka-teki silang, dan instrumen CBT...
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>✨ BUAT DENGAN AI</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
