/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { soundFx } from "../../../../services/soundFxService";

export interface SoalBenarSalahItem {
  id: number;
  pernyataan: string;
  isBenar: boolean;
  pembahasan: string;
  dalilRujukan?: string;
  poin: number;
}

interface GameBenarSalahProps {
  materi?: string;
  subMateri?: string;
  kelas?: string;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

const DEFAULT_SOAL_BENAR_SALAH: SoalBenarSalahItem[] = [
  {
    id: 1,
    pernyataan: "Al-Qur'an dan Sunnah Rasulullah SAW adalah dua pusaka agung yang menjadi pedoman utama hidup umat Islam.",
    isBenar: true,
    pembahasan: "Benar. Berdasarkan hadis riwayat Imam Malik: 'Aku tinggalkan dua perkara yang kalian tidak akan tersesat selamanya selama berpegang teguh pada keduanya, yaitu Kitabullah dan Sunnah Nabi-Nya'.",
    dalilRujukan: "HR. Malik dalam Al-Muwaththa'",
    poin: 10
  },
  {
    id: 2,
    pernyataan: "Hukum bacaan Alif Lam Syamsiyah dibaca dengan jelas tanpa melebur ke huruf berikutnya.",
    isBenar: false,
    pembahasan: "Salah. Alif Lam Syamsiyah dibaca dengan idgham (dileburkan) langsung ke huruf syamsiyah setelahnya, ditandai dengan tanda tasydid.",
    dalilRujukan: "Kaidah Tajwid Tuhfatul Athfal",
    poin: 10
  },
  {
    id: 3,
    pernyataan: "Sifat Al-'Alim artinya Maha Mengetahui segala sesuatu, baik yang tampak maupun yang tersembunyi di dalam hati.",
    isBenar: true,
    pembahasan: "Benar. Allah SWT adalah Al-'Alim, pengetahuannya meliputi langit, bumi, dan apa yang dibisikkan oleh jiwa manusia.",
    dalilRujukan: "Q.S. Al-Baqarah: 29",
    poin: 10
  },
  {
    id: 4,
    pernyataan: "Thaharah hanya mencakup kebersihan badan dari kotoran biasa, dan tidak berkaitan dengan hadas kecil maupun besar.",
    isBenar: false,
    pembahasan: "Salah. Thaharah secara istilah fiqih adalah bersuci dari hadas (kecil dengan wudhu/tayammum, besar dengan mandi wajib) dan najis.",
    dalilRujukan: "Fathul Qarib - Kitab Thaharah",
    poin: 10
  },
  {
    id: 5,
    pernyataan: "Shalat berjamaah memiliki keutamaan 27 derajat lebih tinggi dibanding shalat sendirian (munfarid).",
    isBenar: true,
    pembahasan: "Benar. Sebagaimana sabda Rasulullah SAW: 'Shalat berjamaah lebih utama daripada shalat sendirian dengan dua puluh tujuh derajat.'",
    dalilRujukan: "HR. Bukhari no. 645 dan Muslim no. 650",
    poin: 10
  },
  {
    id: 6,
    pernyataan: "Zakat fitrah wajib dikeluarkan oleh setiap muslim yang mampu pada saat hari raya Idul Adha.",
    isBenar: false,
    pembahasan: "Salah. Zakat fitrah wajib dikeluarkan pada bulan Ramadan hingga sebelum pelaksanaan shalat Idul Fitri, bukan Idul Adha.",
    dalilRujukan: "Q.S. Al-Baqarah: 43",
    poin: 10
  },
  {
    id: 7,
    pernyataan: "Sifat Amanah dan Shiddiq adalah dua sifat wajib bagi para rasul Allah yang harus kita teladani.",
    isBenar: true,
    pembahasan: "Benar. Para rasul memiliki sifat wajib: Shiddiq (Jujur), Amanah (Terpercaya), Tabligh (Menyampaikan), dan Fathonah (Cerdas).",
    dalilRujukan: "Aqidatul Awam",
    poin: 10
  },
  {
    id: 8,
    pernyataan: "Sikap Tasamuh (toleransi) dalam Islam memperbolehkan mencampuradukkan ajaran akidah dan ibadah antaragama.",
    isBenar: false,
    pembahasan: "Salah. Toleransi dalam Islam berlandaskan prinsip 'Lakum dinukum waliyadin' (Untukmu agamamu, dan untukku agamaku), menghormati tanpa kompromi akidah.",
    dalilRujukan: "Q.S. Al-Kafirun: 1-6",
    poin: 10
  },
  {
    id: 9,
    pernyataan: "Berbakti kepada kedua orang tua (Birrul Walidain) merupakan amalan utama setelah beribadah kepada Allah.",
    isBenar: true,
    pembahasan: "Benar. Allah SWT menggandengkan perintah menyembah-Nya dengan perintah berbuat baik kepada orang tua.",
    dalilRujukan: "Q.S. Al-Isra': 23",
    poin: 10
  },
  {
    id: 10,
    pernyataan: "Rukhsah adalah keringanan hukum yang diberikan Allah kepada mukallaf dalam keadaan tertentu seperti safar atau sakit.",
    isBenar: true,
    pembahasan: "Benar. Contoh rukhsah adalah menjamak dan mengqashar shalat saat perjalanan jauh, serta bertayammum jika tiada air.",
    dalilRujukan: "Q.S. Al-Baqarah: 185",
    poin: 10
  }
];

export default function GameBenarSalah({
  materi = "Pendidikan Agama Islam",
  subMateri = "Konsep Dasar PAI SMP",
  onFinishGame
}: GameBenarSalahProps) {
  const [soalList] = useState<SoalBenarSalahItem[]>(DEFAULT_SOAL_BENAR_SALAH);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(25);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => soundFx.getIsMuted());

  const currentSoal = soalList[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (selectedAnswer !== null || isGameFinished) return;
    if (timer <= 0) {
      handleAnswer(null); // Time out
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, selectedAnswer, isGameFinished]);

  const handleToggleSound = () => {
    const next = soundFx.toggleMute();
    setSoundMuted(next);
  };

  const handleAnswer = (choice: boolean | null) => {
    if (selectedAnswer !== null) return;
    soundFx.playClick();
    setSelectedAnswer(choice);
    setShowExplanation(true);

    if (choice === currentSoal.isBenar) {
      soundFx.playCorrect();
      setScore((s) => s + currentSoal.poin);
      setCoins((c) => c + 15);
    } else {
      soundFx.playWrong();
    }
  };

  const handleNextSoal = () => {
    soundFx.playClick();
    if (currentIdx + 1 < soalList.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(25);
    } else {
      setIsGameFinished(true);
      const finalScore = score + (selectedAnswer === currentSoal.isBenar ? currentSoal.poin : 0);
      const earnedCoins = coins + (selectedAnswer === currentSoal.isBenar ? 15 : 0);
      const badge =
        finalScore >= 90
          ? "Peneliti Dalil Sejati"
          : finalScore >= 70
          ? "Mujtahid Cermat"
          : "Santri Pembelajar";
      onFinishGame(finalScore, earnedCoins, badge);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setCoins(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimer(25);
    setIsGameFinished(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border border-slate-800 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-900/80 text-rose-300 px-2 py-0.5 rounded-full border border-rose-700/60">
              GAME EDUKASI 6: BENAR ATAU SALAH
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Soal {currentIdx + 1} dari {soalList.length}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Uji Ketelitian & Dalil: {subMateri}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            timer <= 7 ? "bg-rose-900/80 border-rose-600 text-rose-300 animate-pulse" : "bg-slate-800 border-slate-700 text-amber-300"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timer}s</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            <span>{score} Pts</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-5 text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-emerald-400" />
        </div>

        <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
          Tentukan Apakah Pernyataan Berikut BENAR atau SALAH
        </span>

        <p className="text-base sm:text-xl font-bold text-white leading-relaxed max-w-2xl mx-auto font-sans">
          "{currentSoal.pernyataan}"
        </p>

        {/* Buttons BENAR and SALAH */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
          <button
            type="button"
            disabled={selectedAnswer !== null}
            onClick={() => handleAnswer(true)}
            className={`p-4 sm:p-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer shadow-lg border-2 ${
              selectedAnswer !== null
                ? currentSoal.isBenar
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : selectedAnswer === true
                  ? "bg-rose-900 border-rose-500 text-rose-200 opacity-60"
                  : "bg-slate-800 border-slate-700 text-slate-500"
                : "bg-emerald-700 hover:bg-emerald-600 border-emerald-500 text-white hover:scale-[1.02]"
            }`}
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span>BENAR</span>
          </button>

          <button
            type="button"
            disabled={selectedAnswer !== null}
            onClick={() => handleAnswer(false)}
            className={`p-4 sm:p-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer shadow-lg border-2 ${
              selectedAnswer !== null
                ? !currentSoal.isBenar
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : selectedAnswer === false
                  ? "bg-rose-900 border-rose-500 text-rose-200 opacity-60"
                  : "bg-slate-800 border-slate-700 text-slate-500"
                : "bg-rose-700 hover:bg-rose-600 border-rose-500 text-white hover:scale-[1.02]"
            }`}
          >
            <XCircle className="w-6 h-6 shrink-0" />
            <span>SALAH</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      {showExplanation && (
        <div className={`p-4 sm:p-5 rounded-2xl border animate-fadeIn space-y-2 text-left ${
          selectedAnswer === currentSoal.isBenar
            ? "bg-emerald-950/80 border-emerald-600 text-emerald-200"
            : "bg-rose-950/80 border-rose-600 text-rose-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm">
              {selectedAnswer === currentSoal.isBenar ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">Jawaban Tepat! (+{currentSoal.poin} Poin)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="text-rose-300">Jawaban Belum Tepat. Yang benar adalah: {currentSoal.isBenar ? "BENAR" : "SALAH"}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextSoal}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{currentIdx + 1 < soalList.length ? "Soal Berikutnya" : "Lihat Hasil Akhir"}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <p className="text-xs text-white/90 leading-relaxed font-sans">
            <strong>Pembahasan:</strong> {currentSoal.pembahasan}
          </p>
          {currentSoal.dalilRujukan && (
            <p className="text-[11px] text-amber-300 font-mono">
              📖 Rujukan: {currentSoal.dalilRujukan}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
