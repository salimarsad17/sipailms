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
  Gamepad2,
  FileText,
  GraduationCap,
  RotateCcw,
  Save,
  Eye,
  Check
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
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";

interface BahanAjarAiGeneratorProps {
  onGenerated: (bundle: BahanAjarAiCompleteBundle) => void;
  onCancel?: () => void;
  onViewResult?: () => void;
  guruNama?: string;
}

export type JenisMediaPilihan = "SEMUA" | "VIDEO" | "GAME" | "LKPD" | "LMS";

export default function BahanAjarAiGenerator({
  onGenerated,
  onCancel,
  onViewResult,
  guruNama = "Sadiqul Alim, S.Pd.I., M.Pd."
}: BahanAjarAiGeneratorProps) {
  const kurikulum = KurikulumPaiService.getKurikulum();

  // 1. Mata Pelajaran (Locked / Standar)
  const [mataPelajaran] = useState("Pendidikan Agama Islam dan Budi Pekerti");

  // 2. Pilih Kelas
  const [selectedKelas, setSelectedKelas] = useState<KelasTingkatSmp>("7");

  // 3. Pilih Semester
  const [selectedSemester, setSelectedSemester] = useState<"Ganjil" | "Genap">("Ganjil");

  // 4. Tahun Pelajaran
  const [tahunPelajaran, setTahunPelajaran] = useState("2024/2025");

  // 5. Judul Materi (Bisa diketik manual)
  const [judulMateri, setJudulMateri] = useState("Thaharah: Mensucikan Diri dari Najis dan Hadas");

  // 6. Submateri (Bisa diketik manual)
  const [subMateri, setSubMateri] = useState("Pengertian, Pembagian Najis, dan Tata Cara Bersuci Sesuai Sunnah");

  // 7. Tujuan Pembelajaran
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(
    "Peserta didik mampu memahami konsep thaharah, membedakan jenis najis dan hadas, serta mempraktikkan tata cara bersuci dengan benar dalam kehidupan sehari-hari."
  );

  // 8. Deskripsi Tambahan atau Instruksi Khusus
  const [instruksiKhusus, setInstruksiKhusus] = useState(
    "Fokuskan ilustrasi dan studi kasus pada kebiasaan santri di lingkungan sekolah dan rumah. Cantumkan dalil Surah Al-Baqarah ayat 222."
  );

  // 9. Pilihan Jenis Media yang Akan Dibuat
  const [jenisMedia, setJenisMedia] = useState<JenisMediaPilihan>("SEMUA");

  // Optional Customization Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tingkatKesulitan, setTingkatKesulitan] = useState<TingkatKesulitan>("Sedang");
  const [jumlahSoal, setJumlahSoal] = useState<JumlahSoalCbt>(10);
  const [durasiVideo, setDurasiVideo] = useState<DurasiVideo>("5 menit");
  const [gayaPembelajaran, setGayaPembelajaran] = useState<GayaPembelajaran>("Interaktif");

  // Loading & Progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveDraftToast, setSaveDraftToast] = useState(false);

  // Status pembuatan setiap media
  const [mediaStages, setMediaStages] = useState({
    video: "Menunggu",
    game: "Menunggu",
    lkpd: "Menunggu",
    lms: "Menunggu"
  });

  // Presets from Curriculum
  const currentKelasObj = kurikulum.find((k) => k.kelas === selectedKelas) || kurikulum[0];

  const handleSelectFromCurriculum = (materiJudul: string, subJudul: string) => {
    setJudulMateri(materiJudul);
    setSubMateri(subJudul);
    setTujuanPembelajaran(
      `Peserta didik mampu menganalisis konsep ${materiJudul} (${subJudul}), memahami dalil-dalil naqli, dan mengamalkannya dalam kehidupan sehari-hari.`
    );
  };

  const handleResetForm = () => {
    setSelectedKelas("7");
    setSelectedSemester("Ganjil");
    setTahunPelajaran("2024/2025");
    setJudulMateri("");
    setSubMateri("");
    setTujuanPembelajaran("");
    setInstruksiKhusus("");
    setJenisMedia("SEMUA");
    setErrorMessage(null);
  };

  const handleSimpanMateriDraft = () => {
    if (!judulMateri.trim()) {
      setErrorMessage("Silakan isi Judul Materi sebelum menyimpan materi.");
      return;
    }
    // Create draft bundle
    const draft = BahanAjarAiGeneratorEngine.generateOfflineBundle({
      kelas: selectedKelas,
      materi: judulMateri,
      subMateri: subMateri || judulMateri,
      tingkatKesulitan,
      jumlahSoal,
      durasiVideo,
      gayaPembelajaran,
      guruNama
    });
    BahanAjarAiStorage.saveBundle(draft);
    setSaveDraftToast(true);
    setTimeout(() => setSaveDraftToast(false), 3000);
  };

  // Submit Handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!judulMateri.trim()) {
      setErrorMessage("Judul Materi wajib diisi (dapat diketik manual atau dipilih).");
      return;
    }
    if (!subMateri.trim()) {
      setErrorMessage("Submateri wajib diisi (dapat diketik manual).");
      return;
    }

    setIsGenerating(true);
    setProgressPercent(10);
    setCurrentStepText("Menganalisis kurikulum, dalil naqli, dan instruksi guru...");
    setMediaStages({
      video: "Sedang diproses...",
      game: "Menunggu",
      lkpd: "Menunggu",
      lms: "Menunggu"
    });

    try {
      const bundle = await BahanAjarAiGeneratorEngine.generateCompleteBundle({
        kelas: selectedKelas,
        materi: judulMateri.trim(),
        subMateri: subMateri.trim(),
        tingkatKesulitan,
        jumlahSoal,
        durasiVideo,
        gayaPembelajaran,
        guruNama,
        onProgress: (step, pct) => {
          setCurrentStepText(step);
          setProgressPercent(pct);

          if (pct >= 30 && pct < 60) {
            setMediaStages({
              video: "✅ Siap",
              game: "Sedang diproses...",
              lkpd: "Menunggu",
              lms: "Menunggu"
            });
          } else if (pct >= 60 && pct < 80) {
            setMediaStages({
              video: "✅ Siap",
              game: "✅ Siap (8 Game)",
              lkpd: "Sedang diproses...",
              lms: "Menunggu"
            });
          } else if (pct >= 80 && pct < 95) {
            setMediaStages({
              video: "✅ Siap",
              game: "✅ Siap (8 Game)",
              lkpd: "✅ Siap",
              lms: "Sedang diproses..."
            });
          } else if (pct >= 95) {
            setMediaStages({
              video: "✅ Siap",
              game: "✅ Siap (8 Game)",
              lkpd: "✅ Siap",
              lms: "✅ Siap"
            });
          }
        }
      });

      // Update bundle's learning objectives if customized
      if (tujuanPembelajaran.trim()) {
        bundle.lkpd.tujuanPembelajaran = tujuanPembelajaran.trim();
        bundle.materiPembelajaran.tujuanPembelajaran = [tujuanPembelajaran.trim()];
      }

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
      {/* HEADER FORM */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-black uppercase tracking-wider border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Generator Otomatis Media Pembelajaran PAI • SMPN 2 Rebang Tangkas</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          GENERATOR BAHAN AJAR AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ketikkan judul dan submateri pembelajaran secara bebas, atau pilih dari kurikulum tersimpan. AI akan memproduksi 4 media pembelajaran terintegrasi: <strong>Video Pembelajaran</strong>, <strong>8 Game Edukasi Interaktif</strong>, <strong>LKPD Digital Siap Cetak A4</strong>, serta <strong>Paket Kelas LMS Digital</strong>.
        </p>
      </div>

      {saveDraftToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Materi berhasil disimpan ke Bank Bahan Ajar!</span>
        </div>
      )}

      {/* GENERATOR FORM */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. MATA PELAJARAN */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            1. Mata Pelajaran
          </label>
          <input
            type="text"
            readOnly
            value={mataPelajaran}
            className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm cursor-not-allowed"
          />
        </div>

        {/* 2, 3, 4. PILIH KELAS, SEMESTER, TAHUN PELAJARAN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Pilih Kelas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              2. Pilih Kelas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: "7", label: "Kelas VII" },
                { val: "8", label: "Kelas VIII" },
                { val: "9", label: "Kelas IX" }
              ].map((k) => (
                <button
                  key={k.val}
                  type="button"
                  onClick={() => setSelectedKelas(k.val as KelasTingkatSmp)}
                  className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedKelas === k.val
                      ? "bg-blue-900 text-amber-300 shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Semester */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              3. Pilih Semester <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {["Ganjil", "Genap"].map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem as any)}
                  className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedSemester === sem
                      ? "bg-blue-900 text-amber-300 shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Tahun Pelajaran */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              4. Tahun Pelajaran
            </label>
            <input
              type="text"
              value={tahunPelajaran}
              onChange={(e) => setTahunPelajaran(e.target.value)}
              placeholder="e.g. 2024/2025"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* 5. JUDUL MATERI (WAJIB BISA DIKETIK MANUAL) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              5. Judul Materi (Bisa Diketik Manual) <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-blue-700 font-bold">
              💡 Guru Bebas Mengetik Topik Apa Saja
            </span>
          </div>
          <input
            type="text"
            value={judulMateri}
            onChange={(e) => setJudulMateri(e.target.value)}
            placeholder="Contoh: Shalat Berjamaah dan Tata Cara Makmum Masbuq..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />

          {/* Quick preset selector from curriculum */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
              Atau Pilih Cepat dari Bank Kurikulum Kelas {selectedKelas}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentKelasObj.materiList.slice(0, 5).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    handleSelectFromCurriculum(
                      m.judulMateri,
                      m.subMateriList[0]?.judul || m.judulMateri
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-[11px] font-bold text-slate-700 transition cursor-pointer"
                >
                  {m.judulMateri}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6. SUBMATERI (WAJIB BISA DIKETIK MANUAL) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            6. Submateri (Bisa Diketik Manual) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subMateri}
            onChange={(e) => setSubMateri(e.target.value)}
            placeholder="Contoh: Rukun, Syarat Sah, Posisi Shaf, dan Hikmah Shalat Berjamaah..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
        </div>

        {/* 7. TUJUAN PEMBELAJARAN */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            7. Tujuan Pembelajaran
          </label>
          <textarea
            rows={2}
            value={tujuanPembelajaran}
            onChange={(e) => setTujuanPembelajaran(e.target.value)}
            placeholder="Tuliskan capaian dan tujuan kompetensi yang diharapkan..."
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        {/* 8. DESKRIPSI TAMBAHAN ATAU INSTRUKSI KHUSUS */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            8. Deskripsi Tambahan atau Instruksi Khusus
          </label>
          <textarea
            rows={2}
            value={instruksiKhusus}
            onChange={(e) => setInstruksiKhusus(e.target.value)}
            placeholder="Tambahkan penekanan khusus, konteks lingkungan lokal Rebang Tangkas, atau nomor ayat dalil..."
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        {/* 9. PILIHAN JENIS MEDIA YANG AKAN DIBUAT */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            9. Pilihan Jenis Media yang Akan Dibuat
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: "SEMUA", label: "Generate Semua Media", icon: Sparkles },
              { id: "VIDEO", label: "Generate Video", icon: Video },
              { id: "GAME", label: "Generate Game Edukasi", icon: Gamepad2 },
              { id: "LKPD", label: "Generate LKPD", icon: FileText },
              { id: "LMS", label: "Generate LMS", icon: GraduationCap }
            ].map((media) => {
              const Icon = media.icon;
              const isSel = jenisMedia === media.id;
              return (
                <button
                  key={media.id}
                  type="button"
                  onClick={() => setJenisMedia(media.id as any)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    isSel
                      ? "bg-blue-900 border-blue-950 text-amber-300 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-black leading-tight">{media.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOMIZATION EXPANDER */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-black text-blue-900 hover:text-blue-700 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>{showAdvanced ? "Sembunyikan Opsi Kustomisasi Lanjutan ▲" : "Tampilkan Opsi Kustomisasi Lanjutan (Durasi Video, Gaya, Soal) ▼"}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Tingkat Kesulitan</label>
                <select
                  value={tingkatKesulitan}
                  onChange={(e) => setTingkatKesulitan(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                >
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi (HOTS)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Durasi Video</label>
                <select
                  value={durasiVideo}
                  onChange={(e) => setDurasiVideo(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                >
                  <option value="3 menit">3 menit</option>
                  <option value="5 menit">5 menit</option>
                  <option value="10 menit">10 menit</option>
                  <option value="15 menit">15 menit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Jumlah Soal Evaluasi</label>
                <select
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value) as any)}
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                >
                  <option value={5}>5 Soal</option>
                  <option value={10}>10 Soal</option>
                  <option value={15}>15 Soal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Gaya Pendekatan</label>
                <select
                  value={gayaPembelajaran}
                  onChange={(e) => setGayaPembelajaran(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                >
                  <option value="Interaktif">Interaktif & Gamifikasi</option>
                  <option value="Konseptual">Konseptual Mendalam</option>
                  <option value="Kontekstual">Kontekstual & Realitas</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 10. TOMBOL AKSI: GENERATE SEKARANG, SIMPAN MATERI, RESET FORM, LIHAT HASIL */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET FORM</span>
            </button>

            <button
              type="button"
              onClick={handleSimpanMateriDraft}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SIMPAN MATERI</span>
            </button>

            {onViewResult && (
              <button
                type="button"
                onClick={onViewResult}
                className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LIHAT HASIL</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-7 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>MEMPROSES GENERATOR AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>GENERATE SEKARANG</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 11. ANIMASI LOADING & STATUS PEMBUATAN SETIAP MEDIA (POIN C) */}
      {isGenerating && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-300 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-blue-900 animate-spin" />
              <h3 className="text-base font-black text-slate-900">
                AI Sedang Menghasilkan Media Pembelajaran...
              </h3>
            </div>
            <span className="text-base font-black text-blue-900">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-900 via-indigo-700 to-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 font-semibold italic">
            Tahapan saat ini: <strong>{currentStepText}</strong>
          </p>

          {/* Status Pembuatan Setiap Media */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Video Pembelajaran:</span>
              <strong className="text-xs text-slate-900 block">{mediaStages.video}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">2. 8 Game Edukasi:</span>
              <strong className="text-xs text-slate-900 block">{mediaStages.game}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">3. LKPD Digital:</span>
              <strong className="text-xs text-slate-900 block">{mediaStages.lkpd}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">4. LMS Terpadu:</span>
              <strong className="text-xs text-slate-900 block">{mediaStages.lms}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
