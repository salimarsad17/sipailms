/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Video,
  Play,
  Square,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Clock,
  Layers,
  Subtitles,
  Film,
  FileText,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Tv
} from "lucide-react";
import { BahanAjarAiCompleteBundle, DurasiVideo } from "../../../types/bahanAjarAiModern";

interface VideoPembelajaranViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  activeBundle?: BahanAjarAiCompleteBundle | null;
  onOpenGenerator: () => void;
  onSelectBundle: (b: BahanAjarAiCompleteBundle) => void;
}

export default function VideoPembelajaranView({
  bundles,
  activeBundle,
  onOpenGenerator,
  onSelectBundle
}: VideoPembelajaranViewProps) {
  const currentBundle = activeBundle || bundles[0];

  // Video settings state
  const [selectedDurasi, setSelectedDurasi] = useState<DurasiVideo>(currentBundle?.durasiVideo || "5 menit");
  const [selectedGaya, setSelectedGaya] = useState<string>("3D Animasi Islami Modern");
  const [selectedNarator, setSelectedNarator] = useState<string>("Ustadz Fauzan (Suara Tenang & Berwibawa)");
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);

  // Playback state for interactive storyboard video simulator
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"storyboard" | "naskah" | "kuis">("storyboard");

  if (!currentBundle) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center mx-auto text-2xl">
          🎬
        </div>
        <h3 className="text-xl font-black text-slate-900">Belum Ada Video Pembelajaran</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Silakan gunakan Generator AI untuk membuat naskah, storyboard, dan panduan produksi video pembelajaran PAI.
        </p>
        <button
          onClick={onOpenGenerator}
          className="px-5 py-2.5 bg-blue-900 text-amber-300 font-black text-xs rounded-xl shadow-xs hover:bg-blue-800 transition cursor-pointer"
        >
          Buka Generator Video AI
        </button>
      </div>
    );
  }

  const videoData = currentBundle.video;
  const materi = currentBundle.materiPembelajaran;
  const scenes = videoData.storyboard || [];
  const questionsList = currentBundle.cbt.daftarSoal || [];

  const handlePlayStop = () => {
    setIsPlaying(!isPlaying);
  };

  const fullScript = `
=== NASKAH PRODUKSI VIDEO PEMBELAJARAN PAI SMP ===
UPT SMPN 2 REBANG TANGKAS
Judul: ${videoData.judulVideo || currentBundle.materi}
Kelas: ${currentBundle.kelas} SMP | Durasi: ${selectedDurasi}
Gaya Animasi: ${selectedGaya} | Narator: ${selectedNarator}

1. DESKRIPSI & TUJUAN PEMBELAJARAN:
${videoData.tujuanVideo || materi.tujuanPembelajaran.join(". ")}

2. NASKAH PEMBUKAAN (HOOK & GREETING):
${videoData.narasiPembuka}

3. PENJELASAN MATERI INTI & SUBMATERI:
${videoData.scriptLengkap || materi.materiInti}

4. DALIL NAQLI & TERJEMAHAN:
${materi.dalilQuran ? `• Al-Qur'an: ${materi.dalilQuran.sumber} (${materi.dalilQuran.teksArab}): "${materi.dalilQuran.terjemahan}"` : ""}
${materi.hadis ? `• Hadis: ${materi.hadis.perawi} (${materi.hadis.status}): "${materi.hadis.terjemahan}"` : ""}

5. CONTOH PENERAPAN DALAM KEHIDUPAN:
${materi.contohKehidupanSehariHari?.map((c) => `• ${c}`).join("\n") || "Menerapkan nilai kejujuran dan ibadah di sekolah."}

6. KESIMPULAN & REFLEKSI:
${videoData.kesimpulan}

7. KUIS DI AKHIR VIDEO:
${questionsList.slice(0, 3).map((q, i) => `${i + 1}. ${q.pertanyaan}\nKunci: ${q.kunciJawaban} - ${q.pembahasan}`).join("\n\n")}
`.trim();

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Video Studio & Production Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Video Pembelajaran: {videoData.judulVideo || currentBundle.materi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Materi: Kelas {currentBundle.kelas} SMP • {currentBundle.materi} ({currentBundle.subMateri}). Naskah produksi, dalil, dan storyboard adegan terstruktur siap produksi.
            </p>
          </div>

          {/* Bundle selector if multiple exist */}
          {bundles.length > 1 && (
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
                Pilih Materi Video:
              </label>
              <select
                value={currentBundle.id}
                onChange={(e) => {
                  const b = bundles.find((x) => x.id === e.target.value);
                  if (b) onSelectBundle(b);
                }}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
              >
                {bundles.map((b) => (
                  <option key={b.id} value={b.id}>
                    Kelas {b.kelas}: {b.materi}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO SIMULATOR & PLAYBACK ARENA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl aspect-video flex flex-col justify-between p-5 text-white">
            {/* Top Bar inside Player */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-black tracking-wide border border-amber-400/30">
                UPT SMPN 2 REBANG TANGKAS
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-slate-300">
                Adegan {activeSceneIndex + 1} / {scenes.length || 1}
              </span>
            </div>

            {/* Center Scene Visual Content */}
            <div className="my-auto text-center space-y-3 z-10 p-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/80 border border-blue-500/40 text-amber-300 flex items-center justify-center text-3xl mx-auto shadow-lg animate-pulse">
                🎬
              </div>
              <h4 className="text-lg sm:text-xl font-black text-amber-200">
                Adegan {scenes[activeSceneIndex]?.scene || activeSceneIndex + 1}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed line-clamp-3">
                {scenes[activeSceneIndex]?.visual || videoData.narasiPembuka}
              </p>
            </div>

            {/* Subtitles Overlay */}
            {showSubtitles && (
              <div className="z-10 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-sm text-center border border-white/10 text-xs sm:text-sm font-semibold text-yellow-300 max-w-xl mx-auto">
                💬 {scenes[activeSceneIndex]?.narasi || scenes[activeSceneIndex]?.teksLayar || videoData.narasiPembuka}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayStop}
                  className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
                    isPlaying
                      ? "bg-rose-600 hover:bg-rose-500 text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>Stop Video</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Video</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    showSubtitles ? "bg-amber-400 text-slate-950 font-black" : "bg-white/10 text-slate-300"
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>Subtitles</span>
                </button>
              </div>

              {/* Scene navigator */}
              <div className="flex items-center gap-1">
                {scenes.map((sc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer ${
                      activeSceneIndex === idx
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {sc.scene || idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio & Narration Disclaimer Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <Tv className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black block">Status Bahan Produksi Video:</span>
              <p className="text-[11px] leading-relaxed">
                Naskah, alur durasi, storyboard adegan, dalil, dan narasi audio telah ter-generate lengkap. Guru dapat menggunakan paket naskah ini langsung di kelas atau mengekspornya ke perangkat lunak editor video (seperti Canva Edu, CapCut, atau Filmora).
              </p>
            </div>
          </div>
        </div>

        {/* Right: Video Production Settings & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Parameter Produksi Video AI
            </h3>

            {/* Durasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Durasi Video:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["1 menit", "3 menit", "5 menit", "10 menit"] as DurasiVideo[]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDurasi(dur)}
                    className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      selectedDurasi === dur
                        ? "bg-blue-900 text-amber-300 shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Gaya Animasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Gaya Visual Animasi:</label>
              <select
                value={selectedGaya}
                onChange={(e) => setSelectedGaya(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value="3D Animasi Islami Modern">3D Animasi Islami Modern</option>
                <option value="Flat Kartun Santri Kreatif">Flat Kartun Santri Kreatif</option>
                <option value="Ilustrasi Lukisan Kaligrafi">Ilustrasi Lukisan Kaligrafi & Sejarah</option>
                <option value="Motion Graphics Infografis Edukasi">Motion Graphics Infografis Edukasi</option>
              </select>
            </div>

            {/* Narator */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pilihan Karakter Narator:</label>
              <select
                value={selectedNarator}
                onChange={(e) => setSelectedNarator(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value="Ustadz Fauzan (Suara Tenang & Berwibawa)">Ustadz Fauzan (Suara Tenang & Berwibawa)</option>
                <option value="Ustadzah Fatimah (Suara Ramah & Santun)">Ustadzah Fatimah (Suara Ramah & Santun)</option>
                <option value="Raihan & Zahra (Karakter Siswa Cilik)">Raihan & Zahra (Karakter Siswa Cilik)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullScript);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? "Naskah Video Berhasil Disalin!" : "Salin Naskah Video Lengkap"}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([fullScript], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Naskah_Video_${currentBundle.materi.replace(/\s+/g, "_")}.txt`;
                  a.click();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Naskah Produksi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TABS: STORYBOARD / NASKAH / KUIS AKHIR */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("storyboard")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "storyboard"
                ? "bg-blue-900 text-amber-300 shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Storyboard Per Adegan ({scenes.length})
          </button>
          <button
            onClick={() => setActiveTab("naskah")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "naskah"
                ? "bg-blue-900 text-amber-300 shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Naskah Lengkap & Dalil
          </button>
          <button
            onClick={() => setActiveTab("kuis")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "kuis"
                ? "bg-blue-900 text-amber-300 shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Kuis di Akhir Video
          </button>
        </div>

        {activeTab === "storyboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((sc, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                    Adegan {sc.scene || i + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    ⏱️ {sc.durasiDetik || 45}s
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900">{sc.teksLayar || `Adegan ${i + 1}`}</h4>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Visual Shot:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{sc.visual}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-800 block">Narasi Suara:</span>
                  <p className="text-xs text-amber-950 italic leading-relaxed">"{sc.narasi || sc.audioNarator}"</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "naskah" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900">Naskah Penjelasan Materi</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {videoData.scriptLengkap || materi.materiInti}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900">Dalil Al-Qur'an dan Hadis Relevan</h3>
              <div className="space-y-3">
                {materi.dalilQuran && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-900 text-amber-300 font-mono text-[10px] font-black">
                      {materi.dalilQuran.sumber}
                    </span>
                    <p className="text-base sm:text-lg font-arabic text-right text-slate-900 font-bold py-1">
                      {materi.dalilQuran.teksArab}
                    </p>
                    <p className="text-xs text-slate-700 italic">"{materi.dalilQuran.terjemahan}"</p>
                  </div>
                )}
                {materi.hadis && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-900 text-amber-300 font-mono text-[10px] font-black">
                      {materi.hadis.perawi} ({materi.hadis.status})
                    </span>
                    <p className="text-xs text-slate-700 italic">"{materi.hadis.terjemahan}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "kuis" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Kuis Evaluasi Interaktif di Akhir Video
            </h3>
            <div className="space-y-3">
              {questionsList.slice(0, 3).map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black text-blue-900">Pertanyaan {idx + 1}:</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{q.pertanyaan}</p>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                    💡 <strong>Kunci Jawaban ({q.kunciJawaban}):</strong> {q.pembahasan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
