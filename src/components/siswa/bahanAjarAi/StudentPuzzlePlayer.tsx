/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Puzzle, ArrowUpDown, CheckCircle, RotateCcw, Award, Sparkles, Shuffle } from "lucide-react";
import { PuzzleItem, PuzzlePiece } from "../../../types/bahanAjarAi";

interface StudentPuzzlePlayerProps {
  puzzle: PuzzleItem;
  onFinish: (score: number) => void;
  onClose: () => void;
}

export default function StudentPuzzlePlayer({ puzzle, onFinish, onClose }: StudentPuzzlePlayerProps) {
  // Scramble the pieces initially
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => {
    const list = [...puzzle.potonganList];
    // Shuffle deterministically or pseudo-randomly
    return list.sort(() => Math.random() - 0.5);
  });

  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [isCheckDone, setIsCheckDone] = useState(false);
  const [score, setScore] = useState(0);
  const [isPerfect, setIsPerfect] = useState(false);

  const handlePieceClick = (idx: number) => {
    if (selectedPieceIdx === null) {
      setSelectedPieceIdx(idx);
    } else if (selectedPieceIdx === idx) {
      setSelectedPieceIdx(null); // Deselect
    } else {
      // Swap pieces
      const newPieces = [...pieces];
      const temp = newPieces[selectedPieceIdx];
      newPieces[selectedPieceIdx] = newPieces[idx];
      newPieces[idx] = temp;
      setPieces(newPieces);
      setSelectedPieceIdx(null);
      setIsCheckDone(false);
    }
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const newPieces = [...pieces];
    const temp = newPieces[idx];
    newPieces[idx] = newPieces[idx - 1];
    newPieces[idx - 1] = temp;
    setPieces(newPieces);
    setIsCheckDone(false);
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= pieces.length - 1) return;
    const newPieces = [...pieces];
    const temp = newPieces[idx];
    newPieces[idx] = newPieces[idx + 1];
    newPieces[idx + 1] = temp;
    setPieces(newPieces);
    setIsCheckDone(false);
  };

  const handleCheckOrder = () => {
    let correctCount = 0;
    pieces.forEach((p, idx) => {
      if (p.urutanBenar === idx) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / pieces.length) * 100);
    setScore(calculatedScore);
    setIsCheckDone(true);

    if (correctCount === pieces.length) {
      setIsPerfect(true);
      onFinish(100);
    } else {
      onFinish(calculatedScore);
    }
  };

  const handleShuffle = () => {
    setPieces([...puzzle.potonganList].sort(() => Math.random() - 0.5));
    setSelectedPieceIdx(null);
    setIsCheckDone(false);
    setIsPerfect(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/60 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white truncate max-w-[280px] sm:max-w-md">{puzzle.judul}</h3>
              <p className="text-[11px] text-emerald-300/80">
                {pieces.length} Potongan Puzzle • {puzzle.tipePuzzle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              title="Acak Ulang Kartu"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 transition"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Acak</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-5 pt-4 text-xs text-slate-300 flex items-center justify-between gap-2">
          <p>
            💡 <strong>Petunjuk:</strong> Klik satu kartu lalu klik kartu lain untuk menukar posisi, atau gunakan tombol panah atas/bawah.
          </p>
          {selectedPieceIdx !== null && (
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] shrink-0">
              Kartu #{selectedPieceIdx + 1} Dipilih
            </span>
          )}
        </div>

        {/* Pieces List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          {pieces.map((piece, idx) => {
            const isSelected = selectedPieceIdx === idx;
            const isCorrectPosition = isCheckDone && piece.urutanBenar === idx;
            const isWrongPosition = isCheckDone && piece.urutanBenar !== idx;

            let cardStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-emerald-500/60";
            if (isSelected) {
              cardStyle = "bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 scale-[1.01]";
            }
            if (isCorrectPosition) {
              cardStyle = "bg-emerald-950/60 border-emerald-400 text-emerald-200";
            } else if (isWrongPosition) {
              cardStyle = "bg-rose-950/40 border-rose-500/60 text-rose-200";
            }

            return (
              <div
                key={piece.id}
                onClick={() => handlePieceClick(idx)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-900 border border-slate-700 text-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-relaxed">{piece.teks}</p>
                    {piece.artiTeks && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                        {piece.artiTeks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition text-[10px]"
                    title="Pindah ke Atas"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === pieces.length - 1}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition text-[10px]"
                    title="Pindah ke Bawah"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}

          {/* Validation Result Box */}
          {isCheckDone && (
            <div className="bg-slate-800 border border-emerald-500/40 p-4 rounded-2xl mt-4 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-black text-sm text-white">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>
                    Skor Urutan Puzzle: <span className="text-amber-400">{score}%</span>
                  </span>
                </div>
                {isPerfect && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs">
                    Masya Allah! 100% Sempurna
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-amber-300">Kunci Urutan Sebenarnya:</span>
                <p className="mt-1 text-slate-200 leading-relaxed font-mono text-[11px]">
                  {puzzle.kunciUrutanLengkap}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isPerfect ? "Puzzle telah tersusun rapi!" : "Susun seluruh urutan lalu klik tombol periksa"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckOrder}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              Periksa Urutan Puzzle
            </button>
            {isPerfect && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
