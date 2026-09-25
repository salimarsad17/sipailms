/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Puzzle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Timer,
  Volume2,
  VolumeX,
  RotateCcw,
  Lightbulb,
  Eye,
  EyeOff,
  Printer,
  Award,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  Check,
  X,
  School,
  FileText,
  CheckSquare,
  Square,
  Download,
  ExternalLink
} from "lucide-react";
import { TtsAiData, TtsClueItem } from "../../../types/bahanAjarAi";
import { SoundEngine } from "./audioSynth";
import { DataService } from "../../../data/initialData";
import { LOGO_WAY_KANAN } from "../../../assets/logoWayKananBase64";

interface TtsPlayerProps {
  ttsData: TtsAiData;
  judulMateri: string;
  onTtsComplete?: (score: number) => void;
  isStudentMode?: boolean;
  kelas?: string;
  semester?: "Ganjil" | "Genap" | string;
  mataPelajaran?: string;
}

export default function TtsPlayer({
  ttsData,
  judulMateri,
  onTtsComplete,
  isStudentMode = false,
  kelas = "Kelas VII (Tujuh)",
  semester = "Ganjil",
  mataPelajaran = "Pendidikan Agama Islam dan Budi Pekerti"
}: TtsPlayerProps) {
  const { baris, kolom } = ttsData.ukuranGrid;

  // Active cell & direction
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<"mendatar" | "menurun">("mendatar");
  const [activeClue, setActiveClue] = useState<TtsClueItem | null>(null);

  // User input: key is `${row}_${col}`
  const [userLetters, setUserLetters] = useState<Record<string, string>>({});
  const [isCheckMode, setIsCheckMode] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Timer & Sound
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.getIsMuted());

  // Stats
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [feedbackToast, setFeedbackToast] = useState<string>("");

  // PRINT MODAL & SETTINGS
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printKop, setPrintKop] = useState<boolean>(true);

  // Available classes list from school database & standard SMP classes
  const kelasOptions = React.useMemo(() => {
    try {
      const fromService = DataService.getKelas().map((k) => k.nama);
      const defaults = [
        "Kelas VII-A",
        "Kelas VII-B",
        "Kelas VII-C",
        "Kelas VII (Tujuh)",
        "Kelas VIII-A",
        "Kelas VIII-B",
        "Kelas VIII-C",
        "Kelas VIII (Delapan)",
        "Kelas IX-A",
        "Kelas IX-B",
        "Kelas IX-C",
        "Kelas IX (Sembilan)"
      ];
      return Array.from(new Set([...fromService, ...defaults]));
    } catch {
      return [
        "Kelas VII-A",
        "Kelas VII-B",
        "Kelas VII-C",
        "Kelas VII (Tujuh)",
        "Kelas VIII-A",
        "Kelas VIII-B",
        "Kelas VIII-C",
        "Kelas VIII (Delapan)",
        "Kelas IX-A",
        "Kelas IX-B",
        "Kelas IX-C",
        "Kelas IX (Sembilan)"
      ];
    }
  }, []);

  const [printKelas, setPrintKelas] = useState<string>(() => {
    if (kelas && kelas.trim()) {
      return kelas.startsWith("Kelas") ? kelas : `Kelas ${kelas}`;
    }
    return "Kelas VII-A";
  });
  const [printType, setPrintType] = useState<"soal" | "kunci">("soal");
  const [printSignature, setPrintSignature] = useState<boolean>(true);

  // Synchronize printKelas if prop changes
  useEffect(() => {
    if (kelas && kelas.trim()) {
      setPrintKelas(kelas.startsWith("Kelas") ? kelas : `Kelas ${kelas}`);
    }
  }, [kelas]);

  // Refs for cell inputs
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Build grid coordinate map for clues
  const cellMap = React.useMemo(() => {
    const map: Record<
      string,
      { clueNumbers: number[]; partOfClues: TtsClueItem[]; correctLetter: string }
    > = {};

    ttsData.clues.forEach((clue) => {
      const clueLen = clue.panjang;
      for (let i = 0; i < clueLen; i++) {
        const r = clue.arah === "mendatar" ? clue.baris : clue.baris + i;
        const c = clue.arah === "mendatar" ? clue.kolom + i : clue.kolom;
        const key = `${r}_${c}`;
        const letter = clue.jawaban[i].toUpperCase();

        if (!map[key]) {
          map[key] = { clueNumbers: [], partOfClues: [], correctLetter: letter };
        }
        if (i === 0) {
          if (!map[key].clueNumbers.includes(clue.nomor)) {
            map[key].clueNumbers.push(clue.nomor);
          }
        }
        map[key].partOfClues.push(clue);
        map[key].correctLetter = letter;
      }
    });

    return map;
  }, [ttsData]);

  // Total playable cells
  const totalPlayableCells = Object.keys(cellMap).length;

  // Initialize or reset when ttsData changes
  useEffect(() => {
    setUserLetters({});
    setIsCheckMode(false);
    setShowSolution(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setScore(0);
    setIsCompleted(false);
    setHintCount(0);

    // Default select first clue
    if (ttsData.clues.length > 0) {
      const first = ttsData.clues[0];
      setActiveClue(first);
      setActiveCell({ row: first.baris, col: first.kolom });
      setDirection(first.arah);
    }
  }, [ttsData]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Sound toggle
  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(""), 3000);
  };

  // Select Clue
  const handleSelectClue = (clue: TtsClueItem) => {
    setActiveClue(clue);
    setDirection(clue.arah);
    setActiveCell({ row: clue.baris, col: clue.kolom });
    focusCell(clue.baris, clue.kolom);
  };

  // Focus cell helper
  const focusCell = (row: number, col: number) => {
    const key = `${row}_${col}`;
    setTimeout(() => {
      inputRefs.current[key]?.focus();
      inputRefs.current[key]?.select();
    }, 10);
  };

  // Cell click handler
  const handleCellClick = (row: number, col: number) => {
    const key = `${row}_${col}`;
    const info = cellMap[key];
    if (!info) return;

    if (activeCell?.row === row && activeCell?.col === col) {
      const hasMendatar = info.partOfClues.some((c) => c.arah === "mendatar");
      const hasMenurun = info.partOfClues.some((c) => c.arah === "menurun");

      if (hasMendatar && hasMenurun) {
        const nextDir = direction === "mendatar" ? "menurun" : "mendatar";
        setDirection(nextDir);
        const matched = info.partOfClues.find((c) => c.arah === nextDir);
        if (matched) setActiveClue(matched);
      }
    } else {
      setActiveCell({ row, col });
      let matched = info.partOfClues.find((c) => c.arah === direction);
      if (!matched && info.partOfClues.length > 0) {
        matched = info.partOfClues[0];
        setDirection(matched.arah);
      }
      if (matched) setActiveClue(matched);
    }
  };

  // Keyboard navigation & typing
  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    const key = `${row}_${col}`;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (userLetters[key]) {
        setUserLetters((prev) => ({ ...prev, [key]: "" }));
      } else {
        moveToPreviousCell(row, col);
      }
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveToNextCellInDirection(row, col + 1, 0, 1);
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveToNextCellInDirection(row, col - 1, 0, -1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveToNextCellInDirection(row + 1, col, 1, 0);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveToNextCellInDirection(row - 1, col, -1, 0);
      return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      setUserLetters((prev) => ({ ...prev, [key]: letter }));
      SoundEngine.playClick();
      moveToNextCell(row, col);
    }
  };

  // Move to next cell along active direction
  const moveToNextCell = (currRow: number, currCol: number) => {
    if (!activeClue) return;
    const nextRow = direction === "mendatar" ? currRow : currRow + 1;
    const nextCol = direction === "mendatar" ? currCol + 1 : currCol;
    const nextKey = `${nextRow}_${nextCol}`;

    if (cellMap[nextKey]) {
      setActiveCell({ row: nextRow, col: nextCol });
      focusCell(nextRow, nextCol);
    }
  };

  // Move to previous cell along active direction
  const moveToPreviousCell = (currRow: number, currCol: number) => {
    const prevRow = direction === "mendatar" ? currRow : currRow - 1;
    const prevCol = direction === "mendatar" ? currCol - 1 : currCol;
    const prevKey = `${prevRow}_${prevCol}`;

    if (cellMap[prevKey]) {
      setUserLetters((prev) => ({ ...prev, [prevKey]: "" }));
      setActiveCell({ row: prevRow, col: prevCol });
      focusCell(prevRow, prevCol);
    }
  };

  // Arrow key movement helper
  const moveToNextCellInDirection = (r: number, c: number, dr: number, dc: number) => {
    let targetR = r;
    let targetC = c;
    while (targetR >= 0 && targetR < baris && targetC >= 0 && targetC < kolom) {
      const key = `${targetR}_${targetC}`;
      if (cellMap[key]) {
        setActiveCell({ row: targetR, col: targetC });
        focusCell(targetR, targetC);
        return;
      }
      targetR += dr;
      targetC += dc;
    }
  };

  // Check answers
  const handleCheckAnswers = () => {
    setIsCheckMode(true);
    let correctCount = 0;

    Object.keys(cellMap).forEach((key) => {
      const info = cellMap[key];
      const val = (userLetters[key] || "").toUpperCase();
      if (val === info.correctLetter) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalPlayableCells) * 100);
    setScore(calculatedScore);

    if (correctCount === totalPlayableCells) {
      setIsCompleted(true);
      setIsTimerRunning(false);
      SoundEngine.playFanfare();
      showToast("🎉 MasyaAllah! Semua jawaban Teka-Teki Silang Benar 100%!");
      if (onTtsComplete) {
        onTtsComplete(100);
      }
    } else {
      if (calculatedScore >= 70) {
        SoundEngine.playCorrect();
        showToast(`✨ Bagus! Skor Anda: ${calculatedScore}/100. Periksa kembali kotak merah!`);
      } else {
        SoundEngine.playWrong();
        showToast(`💡 Skor Anda: ${calculatedScore}/100. Jangan menyerah, coba teliti lagi!`);
      }
      if (onTtsComplete) {
        onTtsComplete(calculatedScore);
      }
    }
  };

  // Give Hint (reveals 1 letter in active clue)
  const handleGiveHint = () => {
    if (!activeClue) {
      showToast("Pilih salah satu nomor petunjuk terlebih dahulu!");
      return;
    }

    const clueLen = activeClue.panjang;
    for (let i = 0; i < clueLen; i++) {
      const r = activeClue.arah === "mendatar" ? activeClue.baris : activeClue.baris + i;
      const c = activeClue.arah === "mendatar" ? activeClue.kolom + i : activeClue.kolom;
      const key = `${r}_${c}`;
      const correct = activeClue.jawaban[i].toUpperCase();

      if ((userLetters[key] || "").toUpperCase() !== correct) {
        setUserLetters((prev) => ({ ...prev, [key]: correct }));
        setHintCount((prev) => prev + 1);
        SoundEngine.playCorrect();
        showToast(`💡 Petunjuk diberikan untuk huruf: "${correct}"`);
        setActiveCell({ row: r, col: c });
        focusCell(r, c);
        return;
      }
    }

    showToast("Semua huruf pada kata ini sudah terisi dengan benar!");
  };

  // Reset TTS
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang Teka-Teki Silang ini dari awal?")) {
      setUserLetters({});
      setIsCheckMode(false);
      setShowSolution(false);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setScore(0);
      setIsCompleted(false);
      SoundEngine.playClick();
      showToast("Teka-Teki Silang berhasil diatur ulang.");
    }
  };

  // Check if a clue is fully & correctly filled
  const isClueCompleted = (clue: TtsClueItem): boolean => {
    const clueLen = clue.panjang;
    for (let i = 0; i < clueLen; i++) {
      const r = clue.arah === "mendatar" ? clue.baris : clue.baris + i;
      const c = clue.arah === "mendatar" ? clue.kolom + i : clue.kolom;
      const key = `${r}_${c}`;
      if ((userLetters[key] || "").toUpperCase() !== clue.jawaban[i].toUpperCase()) {
        return false;
      }
    }
    return true;
  };

  const completedCluesCount = ttsData.clues.filter((c) => isClueCompleted(c)).length;

  // GENERATE HTML FOR PRINTING WITH KOP SURAT AND KELAS
  const generatePrintHtml = () => {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Generate crossword table
    let gridHtml = `<table style="border-collapse: collapse; margin: 10px auto 14px auto; border: 2.5px solid #000; box-shadow: 0 0 0 1px #000;">`;
    for (let r = 0; r < baris; r++) {
      gridHtml += `<tr>`;
      for (let c = 0; c < kolom; c++) {
        const key = `${r}_${c}`;
        const info = cellMap[key];
        if (info) {
          const numStr = info.clueNumbers.length > 0 ? info.clueNumbers.join("/") : "";
          const letter = printType === "kunci" ? info.correctLetter : "";
          gridHtml += `
            <td style="width: 30px; height: 30px; border: 1.5px solid #000; position: relative; text-align: center; vertical-align: middle; background-color: #ffffff !important; padding: 0;">
              ${
                numStr
                  ? `<span style="position: absolute; top: 1px; left: 2px; font-size: 8px; font-weight: bold; line-height: 1; color: #000;">${numStr}</span>`
                  : ""
              }
              <span style="font-size: 13.5px; font-weight: 800; font-family: 'Courier New', monospace; color: #000;">${letter}</span>
            </td>
          `;
        } else {
          gridHtml += `<td style="width: 30px; height: 30px; border: 1.5px solid #000; background-color: #000000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;"></td>`;
        }
      }
      gridHtml += `</tr>`;
    }
    gridHtml += `</table>`;

    // Clues
    const mendatarClues = ttsData.clues.filter((c) => c.arah === "mendatar");
    const menurunClues = ttsData.clues.filter((c) => c.arah === "menurun");

    const mendatarList = mendatarClues
      .map(
        (c) => `
      <li style="margin-bottom: 5px; line-height: 1.35;">
        <strong>${c.nomor}.</strong> ${c.pertanyaan} <em style="font-size: 8pt; color: #475569;">(${c.panjang} huruf)</em>
        ${printType === "kunci" ? `<br/><span style="color: #047857; font-weight: bold; font-size: 8.5pt;">↳ Kunci: ${c.jawaban}</span>` : ""}
      </li>
    `
      )
      .join("");

    const menurunList = menurunClues
      .map(
        (c) => `
      <li style="margin-bottom: 5px; line-height: 1.35;">
        <strong>${c.nomor}.</strong> ${c.pertanyaan} <em style="font-size: 8pt; color: #475569;">(${c.panjang} huruf)</em>
        ${printType === "kunci" ? `<br/><span style="color: #047857; font-weight: bold; font-size: 8.5pt;">↳ Kunci: ${c.jawaban}</span>` : ""}
      </li>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>${ttsData.judulTts || `TTS PAI - ${judulMateri}`} - ${printKelas}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 14mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 9.5pt;
            line-height: 1.3;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .kop-container {
            border-bottom: 3px double #000;
            padding-bottom: 8px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .kop-logo {
            width: 65px;
            height: auto;
            max-height: 80px;
            object-fit: contain;
          }
          .kop-text {
            text-align: center;
            flex: 1;
            padding: 0 10px;
          }
          .kop-text h4 {
            margin: 0;
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #1e293b;
            letter-spacing: 0.5px;
          }
          .kop-text h2 {
            margin: 2px 0;
            font-size: 13.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
            letter-spacing: 0.8px;
          }
          .kop-text p {
            margin: 1px 0 0 0;
            font-size: 8.5pt;
            color: #334155;
          }
          .doc-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .doc-title {
            font-size: 12pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-decoration: underline;
            margin: 0 0 2px 0;
          }
          .doc-subtitle {
            font-size: 9pt;
            color: #334155;
            margin: 0;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9pt;
            border: 1.5px solid #000;
          }
          .meta-table td {
            padding: 4px 7px;
            border: 1px solid #000;
            vertical-align: middle;
          }
          .meta-label {
            background-color: #f1f5f9;
            font-weight: bold;
            width: 18%;
          }
          .meta-val {
            width: 32%;
          }
          .clues-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 10px;
            font-size: 8.5pt;
          }
          .clue-box {
            border: 1px solid #000;
            border-radius: 4px;
            padding: 8px 10px;
            background-color: #fafafa;
          }
          .clue-box h5 {
            margin: 0 0 6px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #000;
            font-size: 9pt;
            font-weight: 800;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .clue-box ol {
            margin: 0;
            padding-left: 14px;
          }
          .signature-section {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            page-break-inside: avoid;
          }
          .signature-box {
            text-align: center;
            width: 220px;
          }
          .signature-space {
            height: 46px;
          }
          .signature-name {
            font-weight: bold;
            text-decoration: underline;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table {
              page-break-inside: avoid !important;
            }
          }
        </style>
      </head>
      <body>
        ${
          printKop
            ? `
          <div class="kop-container">
            <img src="${LOGO_WAY_KANAN}" class="kop-logo" alt="Logo Kabupaten Way Kanan" />
            <div class="kop-text">
              <h4>PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
              <h2>${sekolah.namaSekolah || "UPT SMP NEGERI 2 REBANG TANGKAS"}</h2>
              <p>${sekolah.alamat || "Jl. Lintas Rebang Tangkas, Rebang Tangkas, Way Kanan, Lampung 34791"}</p>
              <p>NPSN: ${sekolah.npsn || "10806892"} • Akreditasi: ${sekolah.akreditasi || "A (Unggul)"} • Kode Pos: 34791</p>
            </div>
            <div style="width: 65px;"></div>
          </div>
        `
            : ""
        }

        <div class="doc-header">
          <h3 class="doc-title">
            ${
              printType === "kunci"
                ? "KUNCI JAWABAN GURU • TEKA-TEKI SILANG ISLAMI (TTS PAI)"
                : "LEMBAR KERJA PESERTA DIDIK (LKPD) • TEKA-TEKI SILANG ISLAMI"
            }
          </h3>
          <p class="doc-subtitle">
            ${mataPelajaran} • Kurikulum Merdeka
          </p>
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-label">Materi Pokok</td>
            <td class="meta-val"><strong>${judulMateri}</strong></td>
            <td class="meta-label">Nama Siswa</td>
            <td class="meta-val">${printType === "kunci" ? "<strong>(KUNCI JAWABAN RESMI GURU)</strong>" : "..................................................."}</td>
          </tr>
          <tr>
            <td class="meta-label">Kelas / Semester</td>
            <td class="meta-val"><strong style="color:#000; font-size:10pt;">${printKelas}</strong> / ${semester || "Ganjil"}</td>
            <td class="meta-label">No. Absen / NISN</td>
            <td class="meta-val">...................................................</td>
          </tr>
          <tr>
            <td class="meta-label">Alokasi Waktu</td>
            <td class="meta-val">20 - 30 Menit</td>
            <td class="meta-label">Hari / Tanggal</td>
            <td class="meta-val">${todayStr}</td>
          </tr>
        </table>

        <!-- SCORE BOX & PETUNJUK -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 8.5pt;">
          <div>
            <strong>Petunjuk:</strong> ${ttsData.petunjuk || "Isilah kotak-kotak putih dengan huruf kapital yang tepat sesuai nomor petunjuk Mendatar dan Menurun."}
          </div>
          <div style="border: 1.5px solid #000; padding: 2px 10px; border-radius: 4px; text-align: center; background: #f8fafc; shrink-0; min-width: 90px;">
            <span style="font-size: 7.5pt; font-weight: bold; display: block;">NILAI / PARAF</span>
            <span style="font-size: 13pt; font-weight: 900; line-height: 1.2;">&nbsp;</span>
          </div>
        </div>

        <!-- GRID CROSSWORD -->
        ${gridHtml}

        <!-- CLUES LIST 2-COLUMNS -->
        <div class="clues-grid">
          <div class="clue-box">
            <h5>➡️ Petunjuk Mendatar (Across)</h5>
            <ol>
              ${mendatarList || "<li>Tidak ada petunjuk mendatar</li>"}
            </ol>
          </div>

          <div class="clue-box">
            <h5>⬇️ Petunjuk Menurun (Down)</h5>
            <ol>
              ${menurunList || "<li>Tidak ada petunjuk menurun</li>"}
            </ol>
          </div>
        </div>

        <!-- SIGNATURES -->
        ${
          printSignature
            ? `
          <div class="signature-section">
            <div class="signature-box">
              <p style="margin: 0;">Mengetahui,</p>
              <p style="margin: 0; font-weight: bold;">Kepala ${sekolah.namaSekolah || "UPT SMPN 2 Rebang Tangkas"}</p>
              <div class="signature-space"></div>
              <p class="signature-name">${sekolah.namaKepsek || "Drs. H. Mulyadi, M.M."}</p>
              <p style="margin: 0; font-size: 8pt;">NIP. ${sekolah.nipKepsek || "19700318 199503 1 002"}</p>
            </div>

            <div class="signature-box">
              <p style="margin: 0;">Rebang Tangkas, ${todayStr}</p>
              <p style="margin: 0; font-weight: bold;">Guru Mata Pelajaran PAI</p>
              <div class="signature-space"></div>
              <p class="signature-name">${guru.nama || "Sadiqul Alim, S.Pd.I., M.Pd."}</p>
              <p style="margin: 0; font-size: 8pt;">NIP. ${guru.nip || "197909172014071004"}</p>
            </div>
          </div>
        `
            : ""
        }
      </body>
      </html>
    `;
  };

  // TRIGGER DIRECT BROWSER PRINT (ROBUST & BEAUTIFUL)
  const handleExecutePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Direct window.print failed, attempting new window print", e);
      handleOpenInNewWindow();
    }
  };

  // OPEN IN NEW TAB / STANDALONE PRINT WINDOW FALLBACK
  const handleOpenInNewWindow = () => {
    try {
      const html = generatePrintHtml();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 350);
      } else {
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (err) {
      console.error("Popup print failed, trying iframe print", err);
      printViaIframeFallback();
    }
  };

  // IFRAME FALLBACK PRINT
  const printViaIframeFallback = () => {
    const html = generatePrintHtml();
    let iframe = document.getElementById("tts-print-iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "tts-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "100px";
      iframe.style.height = "100px";
      iframe.style.opacity = "0.01";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 400);
    }
  };

  // DOWNLOAD STANDALONE HTML FILE
  const handleDownloadHtml = () => {
    const html = generatePrintHtml();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cleanTitle = (judulMateri || "Materi").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanKelas = (printKelas || "Kelas").replace(/[^a-zA-Z0-9_-]/g, "_");
    a.download = `TTS_PAI_${cleanTitle}_${cleanKelas}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 animate-fade-in text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Puzzle className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest block">
                TEKA-TEKI SILANG ISLAMI (TTS PAI)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {ttsData.judulTts || `Teka-Teki Silang: ${judulMateri}`}
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold text-xs border border-slate-700">
              🏷️ {printKelas}
            </span>
            <span className="text-xs text-slate-400">
              {ttsData.petunjuk ||
                "Isilah kotak-kotak kosong dengan huruf yang tepat berdasarkan petunjuk Mendatar dan Menurun yang bersumber dari materi pembelajaran."}
            </span>
          </div>
        </div>

        {/* STATS & QUICK CONTROLS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Progress Indicator */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Progres Kata</span>
              <span className="text-xs font-black text-white">
                {completedCluesCount} / {ttsData.clues.length}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Waktu</span>
              <span className="text-xs font-mono font-black text-white">{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Score Badge */}
          {score > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-emerald-300 block leading-tight">Skor TTS</span>
                <span className="text-xs font-black text-emerald-200">{score}/100</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isMuted
                ? "bg-slate-800/80 text-slate-400 border-slate-700"
                : "bg-amber-500/20 text-amber-400 border-amber-500/40"
            }`}
            title={isMuted ? "Aktifkan Efek Suara" : "Matikan Efek Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Print Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            title="Cetak Lembar Kerja TTS dengan Kop Sekolah dan Identitas Kelas"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak TTS</span>
          </button>
        </div>
      </div>

      {/* TOAST FEEDBACK NOTIFICATION */}
      {feedbackToast && (
        <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs font-bold text-center shadow-lg animate-in fade-in zoom-in-95">
          {feedbackToast}
        </div>
      )}

      {/* CELEBRATION BANNER ON FULL COMPLETION */}
      {isCompleted && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border-2 border-emerald-500/80 text-center space-y-2 shadow-2xl animate-bounce-short">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-1">
            <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white">
            Alhamdulillah! Teka-Teki Silang Berhasil Diselesaikan!
          </h4>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto">
            Seluruh kata telah terjawab dengan tepat dalam waktu <strong>{formatTimer(timerSeconds)}</strong>. Skor sempurna <strong>100 Pts</strong> tercatat!
          </p>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE: GRID + CLUES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CROSSWORD GRID */}
        <div className="lg:col-span-7 flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-inner overflow-x-auto w-full">
          {/* Active Clue Breadcrumb */}
          {activeClue && (
            <div className="w-full mb-4 p-3 rounded-xl bg-slate-900 border border-amber-500/40 text-left flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-black shrink-0">
                {activeClue.nomor} {activeClue.arah === "mendatar" ? "➡️ Mendatar" : "⬇️ Menurun"}
              </span>
              <div className="text-xs">
                <span className="font-bold text-white block">{activeClue.pertanyaan}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({activeClue.panjang} Huruf)
                </span>
              </div>
            </div>
          )}

          {/* Grid Table */}
          <div
            className="inline-block p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl max-w-full overflow-auto"
            tabIndex={0}
          >
            <div
              className="grid gap-1 sm:gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${kolom}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: baris }).map((_, rIdx) =>
                Array.from({ length: kolom }).map((_, cIdx) => {
                  const key = `${rIdx}_${cIdx}`;
                  const info = cellMap[key];
                  const isPlayable = Boolean(info);

                  if (!isPlayable) {
                    return (
                      <div
                        key={key}
                        className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-slate-950/80 border border-slate-900"
                        aria-hidden="true"
                      />
                    );
                  }

                  const isActive = activeCell?.row === rIdx && activeCell?.col === cIdx;
                  const isPartOfActiveClue =
                    activeClue &&
                    info.partOfClues.some(
                      (c) => c.nomor === activeClue.nomor && c.arah === activeClue.arah
                    );

                  const userVal = showSolution
                    ? info.correctLetter
                    : userLetters[key] || "";

                  const isChecked = isCheckMode && !showSolution;
                  const isCorrect = userVal.toUpperCase() === info.correctLetter;

                  let cellBg = "bg-slate-900 border-slate-700 text-white";
                  if (isActive) {
                    cellBg = "bg-amber-400 border-amber-300 text-slate-950 font-black shadow-lg ring-2 ring-amber-400/80";
                  } else if (isPartOfActiveClue) {
                    cellBg = "bg-amber-950/70 border-amber-500/70 text-amber-200 ring-1 ring-amber-400/40";
                  }

                  if (isChecked && userVal) {
                    if (isCorrect) {
                      cellBg = "bg-emerald-950/90 border-emerald-500 text-emerald-300 font-black";
                    } else {
                      cellBg = "bg-red-950/90 border-red-500 text-red-300 font-black";
                    }
                  }

                  return (
                    <div
                      key={key}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg border flex items-center justify-center cursor-pointer transition select-none ${cellBg}`}
                    >
                      {/* Clue Number Badge in Cell */}
                      {info.clueNumbers.length > 0 && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[9px] font-black leading-none text-amber-400 opacity-90">
                          {info.clueNumbers.join("/")}
                        </span>
                      )}

                      {/* Letter Display & Hidden Input for Keyboard Interactivity */}
                      <span className="text-xs sm:text-base font-black uppercase pointer-events-none">
                        {userVal}
                      </span>

                      <input
                        ref={(el) => {
                          inputRefs.current[key] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={userVal}
                        onChange={() => {}}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-center"
                        aria-label={`Kotak baris ${rIdx + 1} kolom ${cIdx + 1}`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Direction Helper */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
            <span>Arah saat ini:</span>
            <button
              onClick={() => setDirection(direction === "mendatar" ? "menurun" : "mendatar")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              {direction === "mendatar" ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              <span>{direction === "mendatar" ? "Mendatar (Ketik ke Kanan)" : "Menurun (Ketik ke Bawah)"}</span>
            </button>
            <span className="hidden sm:inline text-slate-500">• Klik kotak 2x untuk ubah arah</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PETUNJUK (MENDATAR & MENURUN) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-inner flex flex-col max-h-[620px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Daftar Petunjuk Soal
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                {ttsData.clues.length} Butir Kata
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              {/* PETUNJUK MENDATAR */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-800/60">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  Mendatar (Across)
                </span>

                <div className="space-y-1.5">
                  {ttsData.clues
                    .filter((c) => c.arah === "mendatar")
                    .map((clue) => {
                      const isSelected = activeClue?.nomor === clue.nomor && activeClue?.arah === "mendatar";
                      const done = isClueCompleted(clue);

                      return (
                        <div
                          key={`clue-${clue.nomor}-mendatar`}
                          onClick={() => handleSelectClue(clue)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-amber-400/10 border-amber-400 text-white font-bold shadow-md ring-1 ring-amber-400/40"
                              : done
                              ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-200"
                              : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                              isSelected
                                ? "bg-amber-400 text-slate-950"
                                : done
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {clue.nomor}
                          </span>

                          <div className="flex-1 leading-snug">
                            <span className={done ? "line-through opacity-80" : ""}>
                              {clue.pertanyaan}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                              ({clue.panjang} huruf)
                            </span>
                          </div>

                          {done && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* PETUNJUK MENURUN */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-800/60">
                  <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                  Menurun (Down)
                </span>

                <div className="space-y-1.5">
                  {ttsData.clues
                    .filter((c) => c.arah === "menurun")
                    .map((clue) => {
                      const isSelected = activeClue?.nomor === clue.nomor && activeClue?.arah === "menurun";
                      const done = isClueCompleted(clue);

                      return (
                        <div
                          key={`clue-${clue.nomor}-menurun`}
                          onClick={() => handleSelectClue(clue)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-amber-400/10 border-amber-400 text-white font-bold shadow-md ring-1 ring-amber-400/40"
                              : done
                              ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-200"
                              : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                              isSelected
                                ? "bg-amber-400 text-slate-950"
                                : done
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {clue.nomor}
                          </span>

                          <div className="flex-1 leading-snug">
                            <span className={done ? "line-through opacity-80" : ""}>
                              {clue.pertanyaan}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                              ({clue.panjang} huruf)
                            </span>
                          </div>

                          {done && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Check Answers Button */}
          <button
            onClick={handleCheckAnswers}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Periksa Jawaban</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={handleGiveHint}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Buka 1 huruf petunjuk pada kata yang sedang dipilih"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Beri Petunjuk {hintCount > 0 ? `(${hintCount})` : ""}</span>
          </button>

          {/* Toggle Solution (Teacher or Review) */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
            title={showSolution ? "Sembunyikan Kunci" : "Tampilkan Kunci Jawaban"}
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showSolution ? "Tutup Kunci" : "Kunci Jawaban"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Open Print Modal with Kop & Kelas */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition cursor-pointer"
            title="Cetak Lembar Kerja TTS dengan Kop Sekolah & Identitas Kelas Lengkap"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak TTS (Kop & Kelas)</span>
          </button>

          {/* Reset Grid */}
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Hapus semua isian dan ulangi TTS"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* MODAL PRATINJAU CETAK TTS DENGAN KOP SEKOLAH DAN KELAS */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  <Printer className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Cetak Lembar Kerja Teka-Teki Silang (TTS PAI)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi Kop Surat Resmi, Identitas Kelas, dan Lembar Soal / Kunci Jawaban
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Settings Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Kop Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Kop Surat Sekolah</label>
                <button
                  type="button"
                  onClick={() => setPrintKop(!printKop)}
                  className={`w-full px-3 py-2 rounded-xl border flex items-center justify-between font-bold transition cursor-pointer ${
                    printKop
                      ? "bg-amber-400/10 border-amber-400 text-amber-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <School className="w-4 h-4" />
                    {printKop ? "Kop Aktif" : "Tanpa Kop"}
                  </span>
                  {printKop ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                </button>
              </div>

              {/* Kelas Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Identitas Kelas (Pilih / Edit)</label>
                <div className="space-y-1.5">
                  <select
                    value={kelasOptions.includes(printKelas) ? printKelas : "custom"}
                    onChange={(e) => {
                      if (e.target.value !== "custom") {
                        setPrintKelas(e.target.value);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold text-xs focus:border-amber-400 focus:outline-none"
                  >
                    {!kelasOptions.includes(printKelas) && <option value="custom">-- Kelas Kustom: {printKelas} --</option>}
                    {kelasOptions.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                    <option value="custom">✏️ Ketik Manual / Kelas Kustom...</option>
                  </select>
                  <input
                    type="text"
                    value={printKelas}
                    onChange={(e) => setPrintKelas(e.target.value)}
                    placeholder="Contoh: Kelas VII-A"
                    className="w-full px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    title="Ubah teks kelas yang akan dicetak pada lembar TTS"
                  />
                </div>
              </div>

              {/* Format Dokumen (Soal Siswa vs Kunci Guru) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tipe Lembar</label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setPrintType("soal")}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      printType === "soal"
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Soal Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintType("kunci")}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      printType === "kunci"
                        ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Kunci Guru</span>
                  </button>
                </div>
              </div>

              {/* Signature Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tanda Tangan Pengesahan</label>
                <button
                  type="button"
                  onClick={() => setPrintSignature(!printSignature)}
                  className={`w-full px-3 py-2 rounded-xl border flex items-center justify-between font-bold transition cursor-pointer ${
                    printSignature
                      ? "bg-blue-400/10 border-blue-400 text-blue-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  <span>TTD Kepsek & Guru</span>
                  {printSignature ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                </button>
              </div>
            </div>

            {/* Live Paper Preview Sheet */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/90 flex justify-center">
              <div className="bg-white text-slate-900 w-full max-w-2xl p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-300 text-left font-sans select-none text-[10.5pt]">
                {/* Kop Surat Sekolah Preview */}
                {printKop && (
                  <div className="border-b-[3px] border-double border-slate-900 pb-2.5 mb-3 flex items-center justify-between gap-3">
                    <img
                      src={LOGO_WAY_KANAN}
                      alt="Logo Way Kanan"
                      className="w-14 sm:w-16 h-auto max-h-20 object-contain shrink-0"
                    />
                    <div className="text-center flex-1">
                      <h4 className="m-0 text-[10pt] sm:text-[11pt] font-bold uppercase tracking-wide text-slate-800">
                        PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN DAN KEBUDAYAAN
                      </h4>
                      <h2 className="m-0 text-[13pt] sm:text-[15pt] font-black uppercase text-slate-950">
                        {DataService.getSekolah().namaSekolah || "UPT SMP NEGERI 2 REBANG TANGKAS"}
                      </h2>
                      <p className="m-0 text-[8pt] text-slate-600 leading-tight mt-0.5">
                        {DataService.getSekolah().alamat || "Jl. Lintas Rebang Tangkas, Rebang Tangkas, Way Kanan, Lampung 34791"}
                      </p>
                      <p className="m-0 text-[8pt] text-slate-600 leading-tight">
                        NPSN: {DataService.getSekolah().npsn || "10806892"} • Akreditasi: {DataService.getSekolah().akreditasi || "A (Unggul)"} • Kode Pos: 34791
                      </p>
                    </div>
                    <div className="w-14 sm:w-16 shrink-0" aria-hidden="true"></div>
                  </div>
                )}

                {/* Judul & Meta */}
                <div className="text-center mb-3">
                  <h3 className="text-xs sm:text-sm font-black uppercase underline tracking-wide text-slate-950">
                    {printType === "kunci"
                      ? "KUNCI JAWABAN GURU • TEKA-TEKI SILANG ISLAMI (TTS PAI)"
                      : "LEMBAR KERJA PESERTA DIDIK (LKPD) • TEKA-TEKI SILANG ISLAMI"}
                  </h3>
                  <p className="text-[9pt] text-slate-600">{mataPelajaran} • Kurikulum Merdeka</p>
                </div>

                {/* Tabel Identitas Kelas & Siswa */}
                <table className="w-full border-collapse border border-slate-900 mb-3 text-[9pt]">
                  <tbody>
                    <tr>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold w-[20%]">Materi Pokok</td>
                      <td className="p-1.5 border border-slate-900 w-[30%]"><strong>{judulMateri}</strong></td>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold w-[20%]">Nama Siswa</td>
                      <td className="p-1.5 border border-slate-900 w-[30%]">
                        {printType === "kunci" ? <em className="text-emerald-700 font-bold">(KUNCI JAWABAN RESMI)</em> : "..................................................."}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold">Kelas / Sem</td>
                      <td className="p-1.5 border border-slate-900 font-bold text-slate-950">
                        {printKelas} / {semester || "Ganjil"}
                      </td>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold">No. Absen / NISN</td>
                      <td className="p-1.5 border border-slate-900">...................................................</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold">Alokasi Waktu</td>
                      <td className="p-1.5 border border-slate-900">20 - 30 Menit</td>
                      <td className="p-1.5 border border-slate-900 bg-slate-100 font-bold">Hari / Tanggal</td>
                      <td className="p-1.5 border border-slate-900">
                        {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Score badge in preview */}
                <div className="flex justify-between items-center text-[8.5pt] mb-2">
                  <p className="m-0 text-slate-700 italic">
                    <strong>Petunjuk:</strong> {ttsData.petunjuk || "Isilah kotak-kotak putih dengan huruf kapital yang tepat sesuai nomor petunjuk."}
                  </p>
                  <div className="border border-slate-900 px-3 py-1 rounded bg-slate-50 text-center shrink-0">
                    <span className="text-[7.5pt] font-bold block">NILAI / PARAF</span>
                    <span className="text-sm font-black">&nbsp;</span>
                  </div>
                </div>

                {/* Crossword Grid in Preview */}
                <div className="flex justify-center my-3 overflow-x-auto">
                  <div
                    className="grid gap-[1px] bg-slate-900 p-0.5 border-2 border-slate-950 shadow-md"
                    style={{ gridTemplateColumns: `repeat(${kolom}, 24px)` }}
                  >
                    {Array.from({ length: baris }).map((_, r) =>
                      Array.from({ length: kolom }).map((_, c) => {
                        const key = `${r}_${c}`;
                        const info = cellMap[key];
                        if (info) {
                          const numStr = info.clueNumbers.length > 0 ? info.clueNumbers.join("/") : "";
                          const letter = printType === "kunci" ? info.correctLetter : "";
                          return (
                            <div
                              key={key}
                              className="w-6 h-6 bg-white relative flex items-center justify-center border border-slate-400"
                            >
                              {numStr && (
                                <span className="absolute top-0 left-0.5 text-[7px] font-bold text-slate-950 leading-none">
                                  {numStr}
                                </span>
                              )}
                              <span className="text-xs font-black font-mono text-slate-950">
                                {letter}
                              </span>
                            </div>
                          );
                        } else {
                          return <div key={key} className="w-6 h-6 bg-slate-950" />;
                        }
                      })
                    )}
                  </div>
                </div>

                {/* Clues Preview (2 Columns) */}
                <div className="grid grid-cols-2 gap-4 mt-3 text-[8pt] text-slate-900">
                  <div className="border border-slate-900 rounded p-2.5 bg-slate-50">
                    <h5 className="font-bold border-b border-slate-400 pb-1 mb-1.5 uppercase">
                      ➡️ Petunjuk Mendatar
                    </h5>
                    <ol className="list-decimal pl-4 space-y-1">
                      {ttsData.clues
                        .filter((c) => c.arah === "mendatar")
                        .map((c) => (
                          <li key={`pv-md-${c.nomor}`}>
                            <strong>{c.nomor}.</strong> {c.pertanyaan} <em className="text-slate-600">({c.panjang} huruf)</em>
                            {printType === "kunci" && (
                              <span className="text-emerald-700 font-bold block text-[7.5pt]">
                                ↳ Kunci: {c.jawaban}
                              </span>
                            )}
                          </li>
                        ))}
                    </ol>
                  </div>

                  <div className="border border-slate-900 rounded p-2.5 bg-slate-50">
                    <h5 className="font-bold border-b border-slate-400 pb-1 mb-1.5 uppercase">
                      ⬇️ Petunjuk Menurun
                    </h5>
                    <ol className="list-decimal pl-4 space-y-1">
                      {ttsData.clues
                        .filter((c) => c.arah === "menurun")
                        .map((c) => (
                          <li key={`pv-mn-${c.nomor}`}>
                            <strong>{c.nomor}.</strong> {c.pertanyaan} <em className="text-slate-600">({c.panjang} huruf)</em>
                            {printType === "kunci" && (
                              <span className="text-emerald-700 font-bold block text-[7.5pt]">
                                ↳ Kunci: {c.jawaban}
                              </span>
                            )}
                          </li>
                        ))}
                    </ol>
                  </div>
                </div>

                {/* Signature Preview */}
                {printSignature && (
                  <div className="flex justify-between mt-5 text-[8.5pt] text-slate-900 pt-2 border-t border-dashed border-slate-300">
                    <div className="text-center w-48">
                      <p className="m-0">Mengetahui,</p>
                      <p className="m-0 font-bold">Kepala {DataService.getSekolah().namaSekolah || "UPT SMPN 2 Rebang Tangkas"}</p>
                      <div className="h-10"></div>
                      <p className="m-0 font-bold underline">{DataService.getSekolah().namaKepsek || "Drs. H. Mulyadi, M.M."}</p>
                      <p className="m-0 text-[7.5pt]">NIP. {DataService.getSekolah().nipKepsek || "19700318 199503 1 002"}</p>
                    </div>

                    <div className="text-center w-48">
                      <p className="m-0">Rebang Tangkas, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p className="m-0 font-bold">Guru Mata Pelajaran PAI</p>
                      <div className="h-10"></div>
                      <p className="m-0 font-bold underline">{DataService.getGuru().nama || "Muhammad Sadiq, S.Pd.I"}</p>
                      <p className="m-0 text-[7.5pt]">NIP. {DataService.getGuru().nip || "197909172014071004"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  Format Cetak: <strong>A4 Potret</strong> • Kertas Kerja Resmi ({printType === "kunci" ? "Kunci Jawaban Guru" : "Soal Siswa"})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Unduh file HTML TTS siap cetak atau disimpan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh HTML</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInNewWindow}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Buka tampilan cetak di jendela baru browser"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tab Baru</span>
                </button>

                <button
                  type="button"
                  onClick={handleExecutePrint}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sekarang (Print / PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL CSS OVERRIDE FOR DIRECT WINDOW.PRINT */}
      <style>{`
        @media print {
          /* Hide non-printable interface */
          body * {
            visibility: hidden !important;
          }
          #tts-printable-document,
          #tts-printable-document * {
            visibility: visible !important;
          }
          #tts-printable-document {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 8mm 12mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            font-size: 9.5pt !important;
            line-height: 1.3 !important;
            z-index: 99999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          .no-print, .print\\:hidden {
            display: none !important;
          }
          table {
            page-break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* EMBEDDED PRINTABLE DOCUMENT NODE (ACCESSIBLE TO DIRECT WINDOW.PRINT) */}
      <div id="tts-printable-document" className="hidden print:block font-sans text-black bg-white">
        {printKop && (
          <div style={{ borderBottom: "3px double #000", paddingBottom: "8px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={LOGO_WAY_KANAN} style={{ width: "65px", height: "auto", maxHeight: "80px", objectFit: "contain" }} alt="Logo Way Kanan" />
            <div style={{ textAlign: "center", flex: 1, padding: "0 10px" }}>
              <h4 style={{ margin: 0, fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", color: "#1e293b", letterSpacing: "0.5px" }}>
                PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h4>
              <h2 style={{ margin: "2px 0", fontSize: "13.5pt", fontWeight: 900, textTransform: "uppercase", color: "#000", letterSpacing: "0.8px" }}>
                {DataService.getSekolah().namaSekolah || "UPT SMP NEGERI 2 REBANG TANGKAS"}
              </h2>
              <p style={{ margin: "1px 0 0 0", fontSize: "8.5pt", color: "#334155" }}>
                {DataService.getSekolah().alamat || "Jl. Lintas Rebang Tangkas, Rebang Tangkas, Way Kanan, Lampung 34791"}
              </p>
              <p style={{ margin: "1px 0 0 0", fontSize: "8.5pt", color: "#334155" }}>
                NPSN: {DataService.getSekolah().npsn || "10806892"} • Akreditasi: {DataService.getSekolah().akreditasi || "A (Unggul)"} • Kode Pos: 34791
              </p>
            </div>
            <div style={{ width: "65px" }}></div>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h3 style={{ fontSize: "12pt", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "underline", margin: "0 0 2px 0" }}>
            {printType === "kunci" ? "KUNCI JAWABAN GURU • TEKA-TEKI SILANG ISLAMI (TTS PAI)" : "LEMBAR KERJA PESERTA DIDIK (LKPD) • TEKA-TEKI SILANG ISLAMI"}
          </h3>
          <p style={{ fontSize: "9pt", color: "#334155", margin: 0 }}>
            {mataPelajaran} • Kurikulum Merdeka
          </p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "9pt", border: "1.5px solid #000" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold", width: "18%" }}>Materi Pokok</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000", width: "32%" }}><strong>{judulMateri}</strong></td>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold", width: "18%" }}>Nama Siswa</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000", width: "32%" }}>{printType === "kunci" ? <strong>(KUNCI JAWABAN RESMI GURU)</strong> : "..................................................."}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold" }}>Kelas / Semester</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000" }}><strong style={{ color: "#000", fontSize: "10pt" }}>{printKelas}</strong> / {semester || "Ganjil"}</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold" }}>No. Absen / NISN</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000" }}>...................................................</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold" }}>Alokasi Waktu</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000" }}>20 - 30 Menit</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000", backgroundColor: "#f1f5f9", fontWeight: "bold" }}>Hari / Tanggal</td>
              <td style={{ padding: "4px 7px", border: "1px solid #000" }}>{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
            </tr>
          </tbody>
        </table>

        {/* Petunjuk & Nilai */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", fontSize: "8.5pt" }}>
          <div>
            <strong>Petunjuk:</strong> {ttsData.petunjuk || "Isilah kotak-kotak putih dengan huruf kapital yang tepat sesuai nomor petunjuk Mendatar dan Menurun."}
          </div>
          <div style={{ border: "1.5px solid #000", padding: "2px 10px", borderRadius: "4px", textAlign: "center", backgroundColor: "#f8fafc", minWidth: "90px" }}>
            <span style={{ fontSize: "7.5pt", fontWeight: "bold", display: "block" }}>NILAI / PARAF</span>
            <span style={{ fontSize: "13pt", fontWeight: 900, lineHeight: 1.2 }}>&nbsp;</span>
          </div>
        </div>

        {/* Grid Table */}
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 12px 0" }}>
          <table style={{ borderCollapse: "collapse", border: "2.5px solid #000" }}>
            <tbody>
              {Array.from({ length: baris }).map((_, r) => (
                <tr key={`direct-print-row-${r}`}>
                  {Array.from({ length: kolom }).map((_, c) => {
                    const key = `${r}_${c}`;
                    const info = cellMap[key];
                    if (info) {
                      const numStr = info.clueNumbers.length > 0 ? info.clueNumbers.join("/") : "";
                      const letter = printType === "kunci" ? info.correctLetter : "";
                      return (
                        <td
                          key={`direct-print-cell-${key}`}
                          style={{
                            width: "30px",
                            height: "30px",
                            border: "1.5px solid #000",
                            position: "relative",
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor: "#ffffff",
                            padding: 0
                          }}
                        >
                          {numStr && (
                            <span style={{ position: "absolute", top: "1px", left: "2px", fontSize: "8px", fontWeight: "bold", lineHeight: 1, color: "#000" }}>
                              {numStr}
                            </span>
                          )}
                          <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "'Courier New', monospace", color: "#000" }}>
                            {letter}
                          </span>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={`direct-print-cell-${key}`}
                          style={{
                            width: "30px",
                            height: "30px",
                            border: "1.5px solid #000",
                            backgroundColor: "#000000"
                          }}
                        />
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clues 2 Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "8px", fontSize: "8.5pt" }}>
          <div style={{ border: "1px solid #000", borderRadius: "4px", padding: "6px 8px", backgroundColor: "#fafafa" }}>
            <h5 style={{ margin: "0 0 5px 0", paddingBottom: "3px", borderBottom: "1px solid #000", fontSize: "9pt", fontWeight: "bold", textTransform: "uppercase" }}>
              ➡️ Petunjuk Mendatar (Across)
            </h5>
            <ol style={{ margin: 0, paddingLeft: "14px" }}>
              {ttsData.clues
                .filter((c) => c.arah === "mendatar")
                .map((c) => (
                  <li key={`direct-print-md-${c.nomor}`} style={{ marginBottom: "4px", lineHeight: 1.3 }}>
                    <strong>{c.nomor}.</strong> {c.pertanyaan} <em style={{ fontSize: "7.5pt", color: "#475569" }}>({c.panjang} huruf)</em>
                    {printType === "kunci" && (
                      <span style={{ color: "#047857", fontWeight: "bold", display: "block", fontSize: "8pt" }}>
                        ↳ Kunci: {c.jawaban}
                      </span>
                    )}
                  </li>
                ))}
            </ol>
          </div>

          <div style={{ border: "1px solid #000", borderRadius: "4px", padding: "6px 8px", backgroundColor: "#fafafa" }}>
            <h5 style={{ margin: "0 0 5px 0", paddingBottom: "3px", borderBottom: "1px solid #000", fontSize: "9pt", fontWeight: "bold", textTransform: "uppercase" }}>
              ⬇️ Petunjuk Menurun (Down)
            </h5>
            <ol style={{ margin: 0, paddingLeft: "14px" }}>
              {ttsData.clues
                .filter((c) => c.arah === "menurun")
                .map((c) => (
                  <li key={`direct-print-mn-${c.nomor}`} style={{ marginBottom: "4px", lineHeight: 1.3 }}>
                    <strong>{c.nomor}.</strong> {c.pertanyaan} <em style={{ fontSize: "7.5pt", color: "#475569" }}>({c.panjang} huruf)</em>
                    {printType === "kunci" && (
                      <span style={{ color: "#047857", fontWeight: "bold", display: "block", fontSize: "8pt" }}>
                        ↳ Kunci: {c.jawaban}
                      </span>
                    )}
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* Tanda Tangan */}
        {printSignature && (
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "9pt", pageBreakInside: "avoid" }}>
            <div style={{ textAlign: "center", width: "220px" }}>
              <p style={{ margin: 0 }}>Mengetahui,</p>
              <p style={{ margin: 0, fontWeight: "bold" }}>Kepala {DataService.getSekolah().namaSekolah || "UPT SMPN 2 Rebang Tangkas"}</p>
              <div style={{ height: "46px" }}></div>
              <p style={{ margin: 0, fontWeight: "bold", textDecoration: "underline" }}>{DataService.getSekolah().namaKepsek || "Drs. H. Mulyadi, M.M."}</p>
              <p style={{ margin: 0, fontSize: "8pt" }}>NIP. {DataService.getSekolah().nipKepsek || "19700318 199503 1 002"}</p>
            </div>

            <div style={{ textAlign: "center", width: "220px" }}>
              <p style={{ margin: 0 }}>Rebang Tangkas, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p style={{ margin: 0, fontWeight: "bold" }}>Guru Mata Pelajaran PAI</p>
              <div style={{ height: "46px" }}></div>
              <p style={{ margin: 0, fontWeight: "bold", textDecoration: "underline" }}>{DataService.getGuru().nama || "Sadiqul Alim, S.Pd.I., M.Pd."}</p>
              <p style={{ margin: 0, fontSize: "8pt" }}>NIP. {DataService.getGuru().nip || "197909172014071004"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
