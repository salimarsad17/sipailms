/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Puzzle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  Eye
} from "lucide-react";
import { soundFx } from "../../../../services/soundFxService";

interface TtsClue {
  nomor: number;
  tipe: "MENDATAR" | "MENURUN";
  pertanyaan: string;
  jawaban: string;
  panjang: number;
  pembahasan: string;
}

interface GameTtsInteraktifProps {
  materi?: string;
  subMateri?: string;
  kelas?: string;
  onFinishGame: (finalScore: number, coins: number, badge: string) => void;
}

const DEFAULT_TTS_CLUES: TtsClue[] = [
  {
    nomor: 1,
    tipe: "MENDATAR",
    pertanyaan: "Kitab suci terakhir yang diturunkan kepada Nabi Muhammad SAW sebagai mukjizat terbesar.",
    jawaban: "ALQURAN",
    panjang: 7,
    pembahasan: "Al-Qur'an adalah kalamullah yang diturunkan kepada Nabi Muhammad SAW melalui Malaikat Jibril secara mutawatir."
  },
  {
    nomor: 2,
    tipe: "MENDATAR",
    pertanyaan: "Bersuci dari hadas kecil maupun hadas besar dalam istilah fiqih Islam.",
    jawaban: "THAHARAH",
    panjang: 8,
    pembahasan: "Thaharah merupakan syarat sah pelaksanaan shalat dan ibadah lainnya."
  },
  {
    nomor: 3,
    tipe: "MENDATAR",
    pertanyaan: "Sifat wajib bagi rasul yang berarti menyampaikan wahyu Allah tanpa ada yang disembunyikan.",
    jawaban: "TABLIGH",
    panjang: 7,
    pembahasan: "Tabligh adalah lawan dari sifat kitman (menyembunyikan)."
  },
  {
    nomor: 4,
    tipe: "MENDATAR",
    pertanyaan: "Keringanan hukum dalam ibadah yang diberikan Allah kepada mukallaf yang menghadapi kesukaran.",
    jawaban: "RUKHSAH",
    panjang: 7,
    pembahasan: "Contoh rukhsah: tayamum saat tidak ada air, shalat jamak dan qashar bagi musafir."
  },
  {
    nomor: 5,
    tipe: "MENDATAR",
    pertanyaan: "Sikap saling menghormati dan menghargai perbedaan keyakinan tanpa mengorbankan akidah.",
    jawaban: "TASAMUH",
    panjang: 7,
    pembahasan: "Tasamuh adalah istilah bahasa Arab untuk toleransi yang berakhlak mulia."
  },
  {
    nomor: 6,
    tipe: "MENURUN",
    pertanyaan: "Nama Asmaul Husna yang bermakna Maha Teliti dan Maha Mengetahui rahasia tersembunyi.",
    jawaban: "KHABIR",
    panjang: 6,
    pembahasan: "Al-Khabir berarti Allah mengetahui hal-hal yang lembut dan tersembunyi."
  },
  {
    nomor: 7,
    tipe: "MENURUN",
    pertanyaan: "Sifat dapat dipercaya dan memegang teguh titipan tanggung jawab dengan baik.",
    jawaban: "AMANAH",
    panjang: 6,
    pembahasan: "Amanah adalah lawan dari khianat."
  },
  {
    nomor: 8,
    tipe: "MENURUN",
    pertanyaan: "Ibadah rukun Islam kelima yang wajib dilaksanakan bagi yang mampu ke Baitullah Makkah.",
    jawaban: "HAJI",
    panjang: 4,
    pembahasan: "Ibadah haji dilaksanakan pada bulan Dzulhijjah di kota suci Makkah dan sekitarnya."
  },
  {
    nomor: 9,
    tipe: "MENURUN",
    pertanyaan: "Tindakan mencari kebenaran dan klarifikasi informasi agar tidak termakan kabar bohong / fitnah.",
    jawaban: "TABAYYUN",
    panjang: 8,
    pembahasan: "Diperintahkan dalam Q.S. Al-Hujurat ayat 6 saat menerima berita dari orang fasik."
  },
  {
    nomor: 10,
    tipe: "MENURUN",
    pertanyaan: "Bersuci dengan debu tanah suci sebagai pengganti wudhu dan mandi wajib ketika tiada air.",
    jawaban: "TAYAMUM",
    panjang: 7,
    pembahasan: "Tayamum dilakukan dengan mengusap muka dan kedua belah tangan hingga siku dengan debu yang suci."
  }
];

export default function GameTtsInteraktif({
  materi = "Pendidikan Agama Islam",
  subMateri = "Teka-Teki Silang PAI",
  onFinishGame
}: GameTtsInteraktifProps) {
  const [clues] = useState<TtsClue[]>(DEFAULT_TTS_CLUES);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<number, boolean>>({});
  const [showHintMap, setShowHintMap] = useState<Record<number, boolean>>({});

  const handleInputChange = (nomor: number, val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z]/g, "");
    setUserAnswers((prev) => ({ ...prev, [nomor]: clean }));
  };

  const handleCheckAnswer = (clue: TtsClue) => {
    soundFx.playClick();
    const ans = (userAnswers[clue.nomor] || "").trim();
    if (ans === clue.jawaban) {
      soundFx.playCorrect();
      setCheckedStatus((prev) => ({ ...prev, [clue.nomor]: true }));
    } else {
      soundFx.playWrong();
      setCheckedStatus((prev) => ({ ...prev, [clue.nomor]: false }));
    }
  };

  const mendatarClues = clues.filter((c) => c.tipe === "MENDATAR");
  const menurunClues = clues.filter((c) => c.tipe === "MENURUN");

  const totalCorrect = Object.values(checkedStatus).filter(Boolean).length;
  const isAllDone = totalCorrect === clues.length;

  const handleFinish = () => {
    const score = Math.round((totalCorrect / clues.length) * 100);
    const coins = totalCorrect * 15;
    const badge = score >= 90 ? "Master TTS PAI" : score >= 70 ? "Cendekiawan Kata" : "Pembelajar Tangguh";
    onFinishGame(score, coins, badge);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700/60">
              GAME EDUKASI 2: TEKA-TEKI SILANG ISLAMI
            </span>
            <span className="text-xs text-amber-300 font-bold">
              {totalCorrect} / {clues.length} Terjawab Benar
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            TTS Interaktif: {subMateri}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
            Skor: {Math.round((totalCorrect / clues.length) * 100)}%
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow transition cursor-pointer active:scale-95"
          >
            Selesai & Simpan Skor
          </button>
        </div>
      </div>

      {/* Grid of Clues: Mendatar & Menurun */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mendatar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/60">
            <Puzzle className="w-4 h-4 text-indigo-400" />
            <span>MENDATAR (ACROSS)</span>
          </div>

          <div className="space-y-3">
            {mendatarClues.map((clue) => {
              const isCorrect = checkedStatus[clue.nomor] === true;
              const isWrong = checkedStatus[clue.nomor] === false;
              const inputVal = userAnswers[clue.nomor] || "";

              return (
                <div
                  key={clue.nomor}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCorrect
                      ? "bg-emerald-950/50 border-emerald-600/80"
                      : isWrong
                      ? "bg-rose-950/50 border-rose-600/80"
                      : "bg-slate-800/70 border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-black text-xs bg-slate-900 px-2 py-0.5 rounded text-amber-400">
                      {clue.nomor}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {clue.panjang} Huruf
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium mt-1.5 leading-relaxed">
                    {clue.pertanyaan}
                  </p>

                  {/* Letter input & check */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      maxLength={clue.panjang}
                      placeholder={`${clue.panjang} HURUF...`}
                      value={inputVal}
                      disabled={isCorrect}
                      onChange={(e) => handleInputChange(clue.nomor, e.target.value)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border font-mono font-black text-xs uppercase tracking-widest ${
                        isCorrect
                          ? "bg-emerald-900/60 border-emerald-500 text-emerald-200"
                          : "bg-slate-900 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      }`}
                    />

                    <button
                      type="button"
                      disabled={isCorrect || !inputVal.trim()}
                      onClick={() => handleCheckAnswer(clue)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {isCorrect ? "✓ Benar" : "Periksa"}
                    </button>
                  </div>

                  {/* Pembahasan if correct */}
                  {isCorrect && (
                    <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-900/40 p-2 rounded-lg border border-emerald-700/50 leading-relaxed">
                      💡 {clue.pembahasan}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Menurun */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-teal-400 font-black text-xs uppercase tracking-wider bg-teal-950/60 p-2.5 rounded-xl border border-teal-800/60">
            <Puzzle className="w-4 h-4 text-teal-400" />
            <span>MENURUN (DOWN)</span>
          </div>

          <div className="space-y-3">
            {menurunClues.map((clue) => {
              const isCorrect = checkedStatus[clue.nomor] === true;
              const isWrong = checkedStatus[clue.nomor] === false;
              const inputVal = userAnswers[clue.nomor] || "";

              return (
                <div
                  key={clue.nomor}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCorrect
                      ? "bg-emerald-950/50 border-emerald-600/80"
                      : isWrong
                      ? "bg-rose-950/50 border-rose-600/80"
                      : "bg-slate-800/70 border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono font-black text-xs bg-slate-900 px-2 py-0.5 rounded text-amber-400">
                      {clue.nomor}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {clue.panjang} Huruf
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium mt-1.5 leading-relaxed">
                    {clue.pertanyaan}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      maxLength={clue.panjang}
                      placeholder={`${clue.panjang} HURUF...`}
                      value={inputVal}
                      disabled={isCorrect}
                      onChange={(e) => handleInputChange(clue.nomor, e.target.value)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border font-mono font-black text-xs uppercase tracking-widest ${
                        isCorrect
                          ? "bg-emerald-900/60 border-emerald-500 text-emerald-200"
                          : "bg-slate-900 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      }`}
                    />

                    <button
                      type="button"
                      disabled={isCorrect || !inputVal.trim()}
                      onClick={() => handleCheckAnswer(clue)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {isCorrect ? "✓ Benar" : "Periksa"}
                    </button>
                  </div>

                  {isCorrect && (
                    <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-900/40 p-2 rounded-lg border border-emerald-700/50 leading-relaxed">
                      💡 {clue.pembahasan}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
