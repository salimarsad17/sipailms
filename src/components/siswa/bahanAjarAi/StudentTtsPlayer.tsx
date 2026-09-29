/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Grid, CheckCircle, RotateCcw, Award, HelpCircle, Eye, Sparkles } from "lucide-react";
import { TekaTekiSilangItem, TtsClue } from "../../../types/bahanAjarAi";

interface StudentTtsPlayerProps {
  tts: TekaTekiSilangItem;
  onFinish: (score: number) => void;
  onClose: () => void;
}

export default function StudentTtsPlayer({ tts, onFinish, onClose }: StudentTtsPlayerProps) {
  // Map of clue id/index to student's answer text
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedClue, setSelectedClue] = useState<TtsClue>(tts.clues[0]);
  const [checkedResults, setCheckedResults] = useState<Record<number, boolean> | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleInputChange = (clueNum: number, value: string) => {
    // Only accept uppercase letters, no spaces, up to clue answer length
    const clean = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const maxLen = tts.clues.find((c) => c.nomor === clueNum)?.jawaban.length || 20;
    setAnswers((prev) => ({
      ...prev,
      [clueNum]: clean.slice(0, maxLen)
    }));
  };

  const handleCheckAll = () => {
    const results: Record<number, boolean> = {};
    let correctCount = 0;

    tts.clues.forEach((c) => {
      const userAns = (answers[c.nomor] || "").trim().toUpperCase();
      const isCorrect = userAns === c.jawaban.toUpperCase();
      results[c.nomor] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setCheckedResults(results);
    const scorePct = Math.round((correctCount / tts.clues.length) * 100);
    setFinalScore(scorePct);

    if (correctCount === tts.clues.length) {
      setIsCompleted(true);
      onFinish(100);
    } else {
      onFinish(scorePct);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCheckedResults(null);
    setShowHint(false);
    setIsCompleted(false);
  };

  const mendatarClues = tts.clues.filter((c) => c.tipe === "mendatar");
  const menurunClues = tts.clues.filter((c) => c.tipe === "menurun");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-blue-500/40 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/60 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white truncate max-w-[280px] sm:max-w-md">{tts.judul}</h3>
              <p className="text-[11px] text-blue-300/80">
                {tts.clues.length} Kata Kunci • Kelas {tts.kelas} ({tts.semester})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Bersihkan Semua Jawaban"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Active Clue Focus Card */}
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-800/80 border border-blue-500/30 p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase text-blue-400 tracking-wider">
                Kotak #{selectedClue.nomor} ({selectedClue.tipe.toUpperCase()} - {selectedClue.jawaban.length} HURUF)
              </span>
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="text-[11px] font-bold text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? "Sembunyikan Petunjuk" : "Lihat Petunjuk"}</span>
              </button>
            </div>

            <h4 className="text-sm font-extrabold text-white leading-relaxed mb-3">
              {selectedClue.pertanyaan}
            </h4>

            {showHint && selectedClue.petunjukTambahan && (
              <div className="text-xs bg-amber-500/10 border border-amber-400/30 text-amber-200 p-2.5 rounded-xl mb-3">
                💡 <strong>Petunjuk:</strong> {selectedClue.petunjukTambahan}
              </div>
            )}

            {/* Letter input boxes for active clue */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {Array.from({ length: selectedClue.jawaban.length }).map((_, letterIdx) => {
                const curVal = (answers[selectedClue.nomor] || "")[letterIdx] || "";
                return (
                  <div
                    key={letterIdx}
                    className={`w-9 h-10 rounded-xl border flex items-center justify-center font-black text-sm uppercase transition shadow-sm ${
                      checkedResults && checkedResults[selectedClue.nomor] !== undefined
                        ? checkedResults[selectedClue.nomor]
                          ? "bg-emerald-950/70 border-emerald-400 text-emerald-300"
                          : "bg-rose-950/70 border-rose-400 text-rose-300"
                        : curVal
                        ? "bg-blue-600/30 border-blue-400 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    {curVal}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ketik ${selectedClue.jawaban.length} huruf jawaban...`}
                value={answers[selectedClue.nomor] || ""}
                onChange={(e) => handleInputChange(selectedClue.nomor, e.target.value)}
                maxLength={selectedClue.jawaban.length}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-400 rounded-xl text-xs text-white uppercase tracking-widest font-mono"
              />
              <span className="text-xs text-slate-400 shrink-0 font-medium">
                {(answers[selectedClue.nomor] || "").length} / {selectedClue.jawaban.length}
              </span>
            </div>
          </div>

          {/* Crossword Clues List (2 Columns: Mendatar & Menurun) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mendatar */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 space-y-2">
              <div className="text-xs font-black text-blue-300 flex items-center justify-between pb-1 border-b border-slate-700">
                <span>MENDATAR (HORIZONTAL)</span>
                <span className="text-[10px] text-slate-400">{mendatarClues.length} Soal</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {mendatarClues.map((c) => {
                  const isCur = selectedClue.nomor === c.nomor;
                  const userAns = answers[c.nomor] || "";
                  const isDone = userAns.length === c.jawaban.length;
                  const isChecked = checkedResults && checkedResults[c.nomor] !== undefined;
                  const isCorrect = isChecked ? checkedResults[c.nomor] : null;

                  return (
                    <button
                      key={c.nomor}
                      onClick={() => {
                        setSelectedClue(c);
                        setShowHint(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                        isCur
                          ? "bg-blue-600/30 border border-blue-400 text-white font-bold"
                          : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-lg bg-blue-950 text-blue-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          {c.nomor}
                        </span>
                        <div className="truncate">
                          <p className="truncate">{c.pertanyaan}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.jawaban.length} huruf {userAns && `• '${userAns}'`}
                          </span>
                        </div>
                      </div>

                      {isChecked ? (
                        isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold shrink-0">Salah</span>
                        )
                      ) : isDone ? (
                        <span className="text-[10px] text-blue-300 shrink-0">✓ Terisi</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menurun */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 space-y-2">
              <div className="text-xs font-black text-cyan-300 flex items-center justify-between pb-1 border-b border-slate-700">
                <span>MENURUN (VERTIKAL)</span>
                <span className="text-[10px] text-slate-400">{menurunClues.length} Soal</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {menurunClues.map((c) => {
                  const isCur = selectedClue.nomor === c.nomor;
                  const userAns = answers[c.nomor] || "";
                  const isDone = userAns.length === c.jawaban.length;
                  const isChecked = checkedResults && checkedResults[c.nomor] !== undefined;
                  const isCorrect = isChecked ? checkedResults[c.nomor] : null;

                  return (
                    <button
                      key={c.nomor}
                      onClick={() => {
                        setSelectedClue(c);
                        setShowHint(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                        isCur
                          ? "bg-cyan-600/30 border border-cyan-400 text-white font-bold"
                          : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-lg bg-cyan-950 text-cyan-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          {c.nomor}
                        </span>
                        <div className="truncate">
                          <p className="truncate">{c.pertanyaan}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.jawaban.length} huruf {userAns && `• '${userAns}'`}
                          </span>
                        </div>
                      </div>

                      {isChecked ? (
                        isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold shrink-0">Salah</span>
                        )
                      ) : isDone ? (
                        <span className="text-[10px] text-cyan-300 shrink-0">✓ Terisi</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Card if Checked */}
          {checkedResults && (
            <div className="bg-slate-800 border border-blue-400/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Skor Ketepatan TTS: <span className="text-amber-400">{finalScore}%</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    {finalScore === 100
                      ? "Masya Allah! Seluruh kata kunci terjawab sempurna!"
                      : `Benar ${Object.values(checkedResults).filter(Boolean).length} dari ${tts.clues.length} kata kunci.`}
                  </p>
                </div>
              </div>

              {finalScore === 100 && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Selesai &amp; Kembali
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Isi seluruh kata kunci di atas, lalu tekan tombol Periksa Jawaban.
          </span>

          <button
            onClick={handleCheckAll}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer"
          >
            Periksa Jawaban TTS
          </button>
        </div>
      </div>
    </div>
  );
}
