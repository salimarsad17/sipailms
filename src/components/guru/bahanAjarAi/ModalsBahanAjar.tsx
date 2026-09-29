/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Sparkles, Plus, Trash2 } from "lucide-react";
import {
  GameEdukasiItem,
  TekaTekiSilangItem,
  PuzzleItem,
  SoalLkpdItem,
  KelasTingkat,
  SemesterTipe
} from "../../../types/bahanAjarAi";

// ==================== GAME MODAL ====================
interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: GameEdukasiItem) => void;
  editingGame: GameEdukasiItem | null;
}

export function GameModal({ isOpen, onClose, onSave, editingGame }: GameModalProps) {
  const [judul, setJudul] = useState(editingGame?.judul || "");
  const [bab, setBab] = useState(editingGame?.bab || "");
  const [kelas, setKelas] = useState<KelasTingkat>(editingGame?.kelas || "VII");
  const [semester, setSemester] = useState<SemesterTipe>(editingGame?.semester || "Ganjil");
  const [deskripsi, setDeskripsi] = useState(editingGame?.deskripsi || "");
  const [tipeGame, setTipeGame] = useState<any>(editingGame?.tipeGame || "Kuis Cepat");
  const [waktuPerSoal, setWaktuPerSoal] = useState(editingGame?.waktuPerSoalDetik || 25);
  const [jumlahNyawa, setJumlahNyawa] = useState(editingGame?.jumlahNyawa || 3);
  const [q1Teks, setQ1Teks] = useState(editingGame?.soalList[0]?.pertanyaan || "");
  const [q1Opsi, setQ1Opsi] = useState(editingGame?.soalList[0]?.pilihan.join(", ") || "Opsi A, Opsi B, Opsi C, Opsi D");
  const [q1Benar, setQ1Benar] = useState(editingGame?.soalList[0]?.jawabanBenar || 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pilihanArray = q1Opsi.split(",").map((s) => s.trim());
    const item: GameEdukasiItem = {
      id: editingGame?.id || `game-${Date.now()}`,
      judul,
      bab,
      kelas,
      semester,
      deskripsi,
      tipeGame,
      waktuPerSoalDetik: Number(waktuPerSoal),
      jumlahNyawa: Number(jumlahNyawa),
      soalList: editingGame?.soalList || [
        {
          id: `q-${Date.now()}`,
          pertanyaan: q1Teks,
          pilihan: pilihanArray.length >= 2 ? pilihanArray : ["A", "B", "C", "D"],
          jawabanBenar: Number(q1Benar),
          pembahasan: "Pembahasan materi terverifikasi.",
          poin: 25
        }
      ],
      tanggalDibuat: editingGame?.tanggalDibuat || new Date().toISOString().split("T")[0],
      status: "Dipublikasikan"
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {editingGame ? "Edit Game Edukasi" : "Tambah Game Edukasi PAI"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Judul Game</label>
            <input
              required
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Tingkat Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as KelasTingkat)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterTipe)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Bab / Topik Pelajaran</label>
            <input
              required
              type="text"
              value={bab}
              onChange={(e) => setBab(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Deskripsi &amp; Petunjuk</label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Tipe Game</label>
              <select
                value={tipeGame}
                onChange={(e) => setTipeGame(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value="Kuis Cepat">Kuis Cepat</option>
                <option value="Petualangan PAI">Petualangan PAI</option>
                <option value="Tantangan Waktu">Tantangan Waktu</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Detik/Soal</label>
              <input
                type="number"
                value={waktuPerSoal}
                onChange={(e) => setWaktuPerSoal(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Jumlah Nyawa</label>
              <input
                type="number"
                value={jumlahNyawa}
                onChange={(e) => setJumlahNyawa(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <span className="font-bold text-amber-300 block">Contoh Butir Soal Utama:</span>
            <input
              type="text"
              placeholder="Teks pertanyaan kuis..."
              value={q1Teks}
              onChange={(e) => setQ1Teks(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
            />
            <input
              type="text"
              placeholder="Pilihan jawaban (pisahkan dengan koma)..."
              value={q1Opsi}
              onChange={(e) => setQ1Opsi(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black shadow-md cursor-pointer"
            >
              Simpan Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== TTS MODAL ====================
interface TtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tts: TekaTekiSilangItem) => void;
  editingTts: TekaTekiSilangItem | null;
}

export function TtsModal({ isOpen, onClose, onSave, editingTts }: TtsModalProps) {
  const [judul, setJudul] = useState(editingTts?.judul || "");
  const [bab, setBab] = useState(editingTts?.bab || "");
  const [kelas, setKelas] = useState<KelasTingkat>(editingTts?.kelas || "VII");
  const [semester, setSemester] = useState<SemesterTipe>(editingTts?.semester || "Ganjil");
  const [deskripsi, setDeskripsi] = useState(editingTts?.deskripsi || "");
  const [clueMendatar, setClueMendatar] = useState(
    editingTts?.clues.find((c) => c.tipe === "mendatar")?.pertanyaan || ""
  );
  const [jawabanMendatar, setJawabanMendatar] = useState(
    editingTts?.clues.find((c) => c.tipe === "mendatar")?.jawaban || ""
  );
  const [clueMenurun, setClueMenurun] = useState(
    editingTts?.clues.find((c) => c.tipe === "menurun")?.pertanyaan || ""
  );
  const [jawabanMenurun, setJawabanMenurun] = useState(
    editingTts?.clues.find((c) => c.tipe === "menurun")?.jawaban || ""
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: TekaTekiSilangItem = {
      id: editingTts?.id || `tts-${Date.now()}`,
      judul,
      bab,
      kelas,
      semester,
      deskripsi,
      ukuranGrid: editingTts?.ukuranGrid || { baris: 8, kolom: 10 },
      clues: editingTts?.clues || [
        {
          nomor: 1,
          tipe: "mendatar",
          pertanyaan: clueMendatar || "Pertanyaan mendatar",
          jawaban: (jawabanMendatar || "JAWABAN").replace(/\s/g, "").toUpperCase(),
          barisAwal: 1,
          kolomAwal: 1
        },
        {
          nomor: 2,
          tipe: "menurun",
          pertanyaan: clueMenurun || "Pertanyaan menurun",
          jawaban: (jawabanMenurun || "KUNCI").replace(/\s/g, "").toUpperCase(),
          barisAwal: 1,
          kolomAwal: 3
        }
      ],
      tanggalDibuat: editingTts?.tanggalDibuat || new Date().toISOString().split("T")[0],
      status: "Dipublikasikan"
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-blue-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            {editingTts ? "Edit Teka-Teki Silang" : "Tambah TTS Baru"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Judul TTS</label>
            <input
              required
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as KelasTingkat)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterTipe)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Bab Pelajaran</label>
            <input
              required
              type="text"
              value={bab}
              onChange={(e) => setBab(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <span className="font-bold text-blue-300 block">Soal Kata Kunci Pertama:</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Pertanyaan Mendatar..."
                value={clueMendatar}
                onChange={(e) => setClueMendatar(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                placeholder="Jawaban (Huruf besar)..."
                value={jawabanMendatar}
                onChange={(e) => setJawabanMendatar(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white uppercase"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-black shadow-md cursor-pointer"
            >
              Simpan TTS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== PUZZLE MODAL ====================
interface PuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (puzzle: PuzzleItem) => void;
  editingPuzzle: PuzzleItem | null;
}

export function PuzzleModal({ isOpen, onClose, onSave, editingPuzzle }: PuzzleModalProps) {
  const [judul, setJudul] = useState(editingPuzzle?.judul || "");
  const [bab, setBab] = useState(editingPuzzle?.bab || "");
  const [kelas, setKelas] = useState<KelasTingkat>(editingPuzzle?.kelas || "VII");
  const [semester, setSemester] = useState<SemesterTipe>(editingPuzzle?.semester || "Ganjil");
  const [deskripsi, setDeskripsi] = useState(editingPuzzle?.deskripsi || "");
  const [tipePuzzle, setTipePuzzle] = useState<any>(editingPuzzle?.tipePuzzle || "Susun Ayat Al-Qur'an");
  const [kunciUrutan, setKunciUrutan] = useState(editingPuzzle?.kunciUrutanLengkap || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PuzzleItem = {
      id: editingPuzzle?.id || `puzzle-${Date.now()}`,
      judul,
      bab,
      kelas,
      semester,
      deskripsi,
      tipePuzzle,
      potonganList: editingPuzzle?.potonganList || [
        { id: "p1", urutanBenar: 0, teks: "Potongan Pertama" },
        { id: "p2", urutanBenar: 1, teks: "Potongan Kedua" },
        { id: "p3", urutanBenar: 2, teks: "Potongan Ketiga" }
      ],
      kunciUrutanLengkap: kunciUrutan || "Urutan yang benar.",
      tanggalDibuat: editingPuzzle?.tanggalDibuat || new Date().toISOString().split("T")[0],
      status: "Dipublikasikan"
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            {editingPuzzle ? "Edit Puzzle" : "Tambah Puzzle Pembelajaran Baru"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Judul Puzzle</label>
            <input
              required
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as KelasTingkat)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterTipe)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Tipe Puzzle</label>
            <select
              value={tipePuzzle}
              onChange={(e) => setTipePuzzle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="Susun Ayat Al-Qur'an">Susun Ayat Al-Qur'an</option>
              <option value="Susun Rukun & Syarat">Susun Rukun &amp; Syarat</option>
              <option value="Cocok Kata & Makna">Cocok Kata &amp; Makna</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Kunci Urutan Lengkap</label>
            <textarea
              rows={2}
              value={kunciUrutan}
              onChange={(e) => setKunciUrutan(e.target.value)}
              placeholder="Contoh: Ayat 1 -> Ayat 2 -> Ayat 3..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 rounded-xl font-black shadow-md cursor-pointer"
            >
              Simpan Puzzle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== LKPD MODAL ====================
interface LkpdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lkpd: SoalLkpdItem) => void;
  editingLkpd: SoalLkpdItem | null;
}

export function LkpdModal({ isOpen, onClose, onSave, editingLkpd }: LkpdModalProps) {
  const [judul, setJudul] = useState(editingLkpd?.judul || "");
  const [bab, setBab] = useState(editingLkpd?.bab || "");
  const [kelas, setKelas] = useState<KelasTingkat>(editingLkpd?.kelas || "VII");
  const [semester, setSemester] = useState<SemesterTipe>(editingLkpd?.semester || "Ganjil");
  const [alokasiWaktu, setAlokasiWaktu] = useState(editingLkpd?.alokasiWaktu || "2 x 40 Menit");
  const [capaian, setCapaian] = useState(editingLkpd?.capaianPembelajaran || "");
  const [stimulus, setStimulus] = useState(editingLkpd?.stimulusMateri || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: SoalLkpdItem = {
      id: editingLkpd?.id || `lkpd-${Date.now()}`,
      judul,
      bab,
      kelas,
      semester,
      alokasiWaktu,
      capaianPembelajaran: capaian,
      tujuanPembelajaran: editingLkpd?.tujuanPembelajaran || ["Menguasai konsep materi"],
      stimulusMateri: stimulus,
      petunjukPengerjaan: "Jawablah soal-soal di bawah ini dengan runut dan jelas.",
      daftarSoal: editingLkpd?.daftarSoal || [
        {
          nomor: 1,
          tipeSoal: "Analisis Kasus",
          pertanyaan: "Analisis permasalahan materi tersebut dan simpulkan tindakan yang tepat!",
          skorMaks: 50
        },
        {
          nomor: 2,
          tipeSoal: "Esai Reflektif",
          pertanyaan: "Bagaimana cara menerapkan nilai pembelajaran ini dalam kehidupan sehari-hari?",
          skorMaks: 50
        }
      ],
      rubrikPenilaian: "Skor 85-100: Sangat baik dan lengkap.",
      tanggalDibuat: editingLkpd?.tanggalDibuat || new Date().toISOString().split("T")[0],
      status: "Dipublikasikan"
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            {editingLkpd ? "Edit Lembar Kerja LKPD" : "Tambah Soal LKPD Baru"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Judul LKPD</label>
            <input
              required
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as KelasTingkat)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterTipe)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Waktu</label>
              <input
                type="text"
                value={alokasiWaktu}
                onChange={(e) => setAlokasiWaktu(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Bab Pembelajaran</label>
            <input
              required
              type="text"
              value={bab}
              onChange={(e) => setBab(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Capaian Pembelajaran (CP)</label>
            <textarea
              rows={2}
              value={capaian}
              onChange={(e) => setCapaian(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Stimulus / Bacaan Kasus</label>
            <textarea
              rows={3}
              value={stimulus}
              onChange={(e) => setStimulus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 rounded-xl font-black shadow-md cursor-pointer"
            >
              Simpan LKPD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
