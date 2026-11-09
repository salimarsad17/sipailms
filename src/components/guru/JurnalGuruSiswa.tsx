/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Plus,
  PenTool,
  CheckCircle,
  Award,
  Smile,
  ShieldAlert,
  FileText,
  Download,
  UserPlus,
  FileCheck,
  Printer,
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  ArrowRight,
  Loader2,
  Lightbulb,
  Bot,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { JurnalMengajar, CatatanSikapSiswa, Siswa, Kelas } from "../../types";
import { DataService } from "../../data/initialData";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";

export const BUTIR_SIKAP_PRESETS = [
  "Ketaatan Beribadah",
  "Berdoa Sebelum & Sesudah Kegiatan",
  "Toleransi & Menghargai Perbedaan",
  "Kejujuran & Integritas",
  "Kedisiplinan & Ketepatan Waktu",
  "Tanggung Jawab",
  "Sopan Santun & Akhlakul Karimah",
  "Gotong Royong & Tolong Menolong",
  "Percaya Diri & Kemandirian",
  "Kepedulian Sosial & Lingkungan",
  "Santun Berdiskusi & Menghormati Pendapat",
  "Adab Bertutur Kata",
  "Kerapian & Kebersihan Diri/Kelas",
  "Lainnya (Ketik Manual)"
];

export const formatHariTanggalIndo = (dateStr?: string, customHariTanggal?: string): string => {
  if (customHariTanggal && customHariTanggal.trim()) {
    return customHariTanggal;
  }
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const hari = days[d.getDay()] || "Senin";
      const tgl = day.toString().padStart(2, "0");
      const bln = (month + 1).toString().padStart(2, "0");
      return `${hari}, ${tgl}/${bln}/${year}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const hari = days[d.getDay()];
      const tgl = d.getDate().toString().padStart(2, "0");
      const bln = (d.getMonth() + 1).toString().padStart(2, "0");
      return `${hari}, ${tgl}/${bln}/${d.getFullYear()}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const PAI_TOPIC_PRESETS = [
  { kelas: "VII", bab: "Bab 1: Menghadirkan Islam Damai Melalui Thaharah" },
  { kelas: "VII", bab: "Bab 2: Meneladani Sifat Amanah dan Jujur" },
  { kelas: "VII", bab: "Bab 3: Mengagumi Kebesaran Allah Lewat Menuntut Ilmu" },
  { kelas: "VII", bab: "Bab 4: Salat Berjamaah dan Sujud Syukur, Sahwi, Tilawah" },
  { kelas: "VII", bab: "Bab 5: Meneladani Peradaban Islam Masa Daulah Umayyah" },
  { kelas: "VIII", bab: "Bab 1: Menghindari Minuman Keras, Judi, & Pertengkaran" },
  { kelas: "VIII", bab: "Bab 2: Meneladani Sifat Jujur dan Menepati Janji" },
  { kelas: "VIII", bab: "Bab 3: Salat Sunnah Gerhana, Istisqa, dan Jenazah" },
  { kelas: "VIII", bab: "Bab 4: Peradaban Daulah Abbasiyah di Baghdad" },
  { kelas: "VIII", bab: "Bab 5: Keadilan Sosial Melalui Zakat dan Wakaf" },
  { kelas: "IX", bab: "Bab 1: Mengimani Hari Akhir dan Bekal Amal Kebaikan" },
  { kelas: "IX", bab: "Bab 2: Mengasah Empati Melalui Zakat Fitrah & Mal" },
  { kelas: "IX", bab: "Bab 3: Meraih Keberkahan Melalui Ibadah Haji dan Umrah" },
  { kelas: "IX", bab: "Bab 4: Meneladani Sejarah Masuknya Islam di Nusantara" },
  { kelas: "IX", bab: "Bab 5: Merajut Toleransi dan Kerukunan Beragama (Tasāmuh)" }
];

const PAI_METODE_OPTIONS = [
  "Diskusi Kelompok & Presentasi (Problem Based Learning)",
  "Demonstrasi & Praktik Langsung Tata Cara Ibadah",
  "Tanya Jawab Interaktif & Kajian Dalil Naqli",
  "Penayangan Video / Slide PPT & Analisis Kasus",
  "Pembelajaran Berdiferensiasi & Lembar Kerja (LKPD)",
  "Ceramah Bermakna & Refleksi Nilai Akhlak Mulia"
];

interface JurnalGuruSiswaProps {
  jurnals: JurnalMengajar[];
  onAddJurnal: (newJurnal: JurnalMengajar) => void;
  onUpdateJurnal?: (updatedJurnal: JurnalMengajar) => void;
  onDeleteJurnal?: (id: string) => void;
  attitudes: CatatanSikapSiswa[];
  onAddAttitude: (newAttitude: CatatanSikapSiswa) => void;
  onUpdateAttitude?: (updatedAttitude: CatatanSikapSiswa) => void;
  onDeleteAttitude?: (id: string) => void;
  students: Siswa[];
  classes: Kelas[];
}

export default function JurnalGuruSiswa({
  jurnals,
  onAddJurnal,
  onUpdateJurnal,
  onDeleteJurnal,
  attitudes,
  onAddAttitude,
  onUpdateAttitude,
  onDeleteAttitude,
  students,
  classes
}: JurnalGuruSiswaProps) {
  const [subTab, setSubTab] = useState<"mengajar" | "saku">("mengajar");
  const [isAddingJurnal, setIsAddingJurnal] = useState(false);
  const [isAddingAttitude, setIsAddingAttitude] = useState(false);

  // Mode for Journal Input: Manual vs AI Otomatis
  const [jurnalInputMode, setJurnalInputMode] = useState<"manual" | "ai">("manual");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isEnhancingNotes, setIsEnhancingNotes] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [aiMetodeInput, setAiMetodeInput] = useState("Diskusi Kelompok & Presentasi (Problem Based Learning)");
  const [aiCatatanExtra, setAiCatatanExtra] = useState("");
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState<{
    materiPokok: string;
    kegiatanKbm?: string;
    jamKe: string;
    kehadiranHadir: number;
    kehadiranIzin: number;
    kehadiranSakit: number;
    kehadiranAlpa: number;
    ringkasanKBM?: string;
    catatanKejadian: string;
    refleksiGuru?: string;
    source?: string;
  } | null>(null);

  // Teaching Journal form state
  const [newJurnal, setNewJurnal] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    kelasId: "VII-A",
    jamKe: "1-2",
    materiPokok: "",
    kegiatanKbm: "",
    kehadiranHadir: 30,
    kehadiranIzin: 0,
    kehadiranSakit: 0,
    kehadiranAlpa: 0,
    catatanKejadian: ""
  });

  // Jurnal Siswa (Catatan Sikap & Perilaku) form state
  const [newAttitude, setNewAttitude] = useState({
    kelasId: "VII-A",
    tanggal: new Date().toISOString().split("T")[0],
    hariTanggal: "",
    siswaNisn: "",
    kejadianPerilaku: "",
    butirSikap: "Ketaatan Beribadah",
    customButirSikap: "",
    positifNegatif: "Positif" as "Positif" | "Negatif",
    tindakLanjut: ""
  });

  // Edit and Delete state for Jurnal Siswa
  const [editingAttitude, setEditingAttitude] = useState<CatatanSikapSiswa | null>(null);
  const [deletingAttitude, setDeletingAttitude] = useState<CatatanSikapSiswa | null>(null);
  const [filterAttitudeKelas, setFilterAttitudeKelas] = useState<string>("ALL");
  const [filterAttitudeJenis, setFilterAttitudeJenis] = useState<string>("ALL");
  const [searchAttitudeQuery, setSearchAttitudeQuery] = useState<string>("");

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMonth, setExportMonth] = useState("07"); // July

  // Edit and Delete state for Teaching Journal
  const [editingJurnal, setEditingJurnal] = useState<JurnalMengajar | null>(null);
  const [deletingJurnal, setDeletingJurnal] = useState<JurnalMengajar | null>(null);
  const [filterJurnalKelas, setFilterJurnalKelas] = useState<string>("ALL");
  const [searchJurnalQuery, setSearchJurnalQuery] = useState<string>("");
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const handleOpenEdit = (jurnal: JurnalMengajar) => {
    setEditingJurnal({ ...jurnal });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJurnal) return;
    if (!editingJurnal.materiPokok.trim()) {
      alert("Harap isi materi pembelajaran pokok!");
      return;
    }
    if (onUpdateJurnal) {
      onUpdateJurnal(editingJurnal);
    } else {
      const updated = jurnals.map((j) => (j.id === editingJurnal.id ? editingJurnal : j));
      DataService.saveJurnalMengajar(updated);
    }
    showToast(`Log jurnal ${editingJurnal.kelasId} (${editingJurnal.tanggal}) berhasil diperbarui.`);
    setEditingJurnal(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingJurnal) return;
    const targetId = deletingJurnal.id;
    const info = `${deletingJurnal.kelasId} (${deletingJurnal.tanggal})`;
    if (onDeleteJurnal) {
      onDeleteJurnal(targetId);
    } else {
      const updated = jurnals.filter((j) => j.id !== targetId);
      DataService.saveJurnalMengajar(updated);
    }
    showToast(`Log jurnal ${info} berhasil dihapus.`, "info");
    setDeletingJurnal(null);
  };

  const handleJurnalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJurnal.materiPokok) {
      alert("Harap isi materi pokok!");
      return;
    }
    const item: JurnalMengajar = {
      id: "jm-" + Date.now(),
      tanggal: newJurnal.tanggal,
      kelasId: newJurnal.kelasId,
      jamKe: newJurnal.jamKe,
      materiPokok: newJurnal.materiPokok,
      kegiatanKbm: newJurnal.kegiatanKbm.trim() || undefined,
      kehadiranHadir: Number(newJurnal.kehadiranHadir),
      kehadiranIzin: Number(newJurnal.kehadiranIzin),
      kehadiranSakit: Number(newJurnal.kehadiranSakit),
      kehadiranAlpa: Number(newJurnal.kehadiranAlpa),
      catatanKejadian: newJurnal.catatanKejadian
    };
    onAddJurnal(item);
    setIsAddingJurnal(false);
    setNewJurnal({
      tanggal: new Date().toISOString().split("T")[0],
      kelasId: "VII-A",
      jamKe: "1-2",
      materiPokok: "",
      kegiatanKbm: "",
      kehadiranHadir: 30,
      kehadiranIzin: 0,
      kehadiranSakit: 0,
      kehadiranAlpa: 0,
      catatanKejadian: ""
    });
  };

  const getStudentCountForClass = (clsId: string) => {
    const count = students.filter(s => s.kelasId === clsId).length;
    return count > 0 ? count : 30;
  };

  const handleGenerateAiJurnal = async () => {
    setIsGeneratingAi(true);
    const totalCount = getStudentCountForClass(newJurnal.kelasId);
    const guru = DataService.getGuru();
    const sekolah = DataService.getSekolah();

    const topicToSend = aiTopicInput.trim() || newJurnal.materiPokok.trim();

    try {
      const response = await fetch("/api/gemini/generate-jurnal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelasId: newJurnal.kelasId,
          tanggal: newJurnal.tanggal,
          jamKe: newJurnal.jamKe,
          materiPokok: topicToSend,
          metode: aiMetodeInput,
          catatanKejadian: aiCatatanExtra.trim(),
          totalSiswa: totalCount,
          namaGuru: guru.nama,
          namaSekolah: sekolah.namaSekolah
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const kbmText = resJson.data.kegiatanKbm || resJson.data.ringkasanKBM || "";
        setAiGeneratedPreview({
          ...resJson.data,
          kegiatanKbm: kbmText,
          ringkasanKBM: kbmText,
          source: resJson.source
        });
      } else {
        throw new Error("Respon tidak valid");
      }
    } catch (err) {
      console.warn("Server AI generation fallback to client synthesis:", err);
      const fallbackTopic = topicToSend || "Bab 2: Meneladani Sifat Amanah dan Jujur dalam Kehidupan Sehari-hari";
      const fallbackKbm = `Kegiatan dimulai dengan pembiasaan tadarus Al-Qur'an dan pengondisian kelas. Memasuki kegiatan inti, siswa mendiskusikan materi ${fallbackTopic} menggunakan model ${aiMetodeInput}. Dilanjutkan dengan presentasi perwakilan kelompok dan penguatan dalil naqli oleh guru. Pertemuan ditutup dengan refleksi ketercapaian dan doa bersama.`;
      setAiGeneratedPreview({
        materiPokok: fallbackTopic,
        kegiatanKbm: fallbackKbm,
        jamKe: newJurnal.jamKe || "1-2",
        kehadiranHadir: Math.max(1, totalCount - 1),
        kehadiranIzin: 1,
        kehadiranSakit: 0,
        kehadiranAlpa: 0,
        ringkasanKBM: fallbackKbm,
        catatanKejadian: aiCatatanExtra.trim()
          ? `${aiCatatanExtra}. Antusiasme belajar siswa sangat baik, kerja sama kelompok berjalan produktif dan santun.`
          : `Pembelajaran berlangsung tertib, interaktif, dan penuh khidmat. Siswa aktif bertanya mengenai implementasi nilai kejujuran dan amanah di lingkungan sekolah. Satu siswa berhalangan hadir dengan surat keterangan izin dari orang tua.`,
        refleksiGuru: `Pemahaman konsep peserta didik terhadap indikator capaian pembelajaran telah terpenuhi dengan baik. Perlu penguatan pembiasaan amalan harian pada sesi pembelajaran tatap muka berikutnya.`,
        source: "engine_client_synthesis"
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleInlineEnhanceNotes = async () => {
    if (!newJurnal.materiPokok.trim()) {
      alert("Harap isi materi pokok terlebih dahulu agar AI dapat menyusun catatan observasi kelas yang relevan!");
      return;
    }
    setIsEnhancingNotes(true);
    const totalCount = getStudentCountForClass(newJurnal.kelasId);
    const guru = DataService.getGuru();
    const sekolah = DataService.getSekolah();

    try {
      const response = await fetch("/api/gemini/generate-jurnal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelasId: newJurnal.kelasId,
          tanggal: newJurnal.tanggal,
          jamKe: newJurnal.jamKe,
          materiPokok: newJurnal.materiPokok,
          metode: "Pembelajaran Bermakna Kurikulum Merdeka",
          catatanKejadian: newJurnal.catatanKejadian,
          totalSiswa: totalCount,
          namaGuru: guru.nama,
          namaSekolah: sekolah.namaSekolah
        })
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const enriched = [
          resJson.data.ringkasanKBM ? `[KBM]: ${resJson.data.ringkasanKBM}` : "",
          resJson.data.catatanKejadian ? `[Observasi Kelas]: ${resJson.data.catatanKejadian}` : "",
          resJson.data.refleksiGuru ? `[Refleksi]: ${resJson.data.refleksiGuru}` : ""
        ].filter(Boolean).join("\n\n");

        setNewJurnal(prev => ({
          ...prev,
          kegiatanKbm: prev.kegiatanKbm || resJson.data.kegiatanKbm || resJson.data.ringkasanKBM || "",
          catatanKejadian: enriched
        }));
      }
    } catch {
      const sampleKbm = `Dilaksanakan kegiatan pembelajaran materi ${newJurnal.materiPokok} dengan pembiasaan tadarus, diskusi kontekstual, dan refleksi dalil naqli.`;
      const sampleNote = `[KBM]: ${sampleKbm}\n\n[Observasi Kelas]: Dinamika keaktifan kelas kondusif. Siswa menunjukkan adab santun dan antusiasme tinggi dalam menganalisis kasus akhlak sehari-hari.\n\n[Refleksi]: Pembelajaran mencapai indikator pemahaman dasar dengan sangat memuaskan.`;
      setNewJurnal(prev => ({
        ...prev,
        kegiatanKbm: prev.kegiatanKbm || sampleKbm,
        catatanKejadian: sampleNote
      }));
    } finally {
      setIsEnhancingNotes(false);
    }
  };

  const handleApplyAiToForm = () => {
    if (!aiGeneratedPreview) return;
    const chosenKbm = aiGeneratedPreview.kegiatanKbm || aiGeneratedPreview.ringkasanKBM || "";
    const combinedNotes = [
      aiGeneratedPreview.catatanKejadian ? `[Observasi]: ${aiGeneratedPreview.catatanKejadian}` : "",
      aiGeneratedPreview.refleksiGuru ? `[Refleksi]: ${aiGeneratedPreview.refleksiGuru}` : ""
    ].filter(Boolean).join("\n\n");

    setNewJurnal({
      tanggal: newJurnal.tanggal,
      kelasId: newJurnal.kelasId,
      jamKe: aiGeneratedPreview.jamKe || newJurnal.jamKe,
      materiPokok: aiGeneratedPreview.materiPokok,
      kegiatanKbm: chosenKbm,
      kehadiranHadir: Number(aiGeneratedPreview.kehadiranHadir),
      kehadiranIzin: Number(aiGeneratedPreview.kehadiranIzin),
      kehadiranSakit: Number(aiGeneratedPreview.kehadiranSakit),
      kehadiranAlpa: Number(aiGeneratedPreview.kehadiranAlpa),
      catatanKejadian: combinedNotes || aiGeneratedPreview.catatanKejadian
    });
    setJurnalInputMode("manual");
  };

  const handleSaveAiDirectly = () => {
    if (!aiGeneratedPreview) return;
    const chosenKbm = aiGeneratedPreview.kegiatanKbm || aiGeneratedPreview.ringkasanKBM || "";
    const combinedNotes = [
      aiGeneratedPreview.catatanKejadian ? `[Observasi]: ${aiGeneratedPreview.catatanKejadian}` : "",
      aiGeneratedPreview.refleksiGuru ? `[Refleksi]: ${aiGeneratedPreview.refleksiGuru}` : ""
    ].filter(Boolean).join("\n\n");

    const item: JurnalMengajar = {
      id: "jm-" + Date.now(),
      tanggal: newJurnal.tanggal,
      kelasId: newJurnal.kelasId,
      jamKe: aiGeneratedPreview.jamKe || newJurnal.jamKe,
      materiPokok: aiGeneratedPreview.materiPokok,
      kegiatanKbm: chosenKbm,
      kehadiranHadir: Number(aiGeneratedPreview.kehadiranHadir),
      kehadiranIzin: Number(aiGeneratedPreview.kehadiranIzin),
      kehadiranSakit: Number(aiGeneratedPreview.kehadiranSakit),
      kehadiranAlpa: Number(aiGeneratedPreview.kehadiranAlpa),
      catatanKejadian: combinedNotes || aiGeneratedPreview.catatanKejadian
    };

    onAddJurnal(item);
    setIsAddingJurnal(false);
    setAiGeneratedPreview(null);
    setAiTopicInput("");
    setAiCatatanExtra("");
  };

  const handleAttitudeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttitude.siswaNisn) {
      alert("Harap pilih nama murid terlebih dahulu!");
      return;
    }
    const studentObj = students.find(s => s.nisn === newAttitude.siswaNisn);
    if (!studentObj) return;

    const kejadian = newAttitude.kejadianPerilaku.trim();
    if (!kejadian) {
      alert("Harap masukkan kejadian / perilaku murid!");
      return;
    }

    const finalButir =
      newAttitude.butirSikap === "Lainnya (Ketik Manual)"
        ? (newAttitude.customButirSikap.trim() || "Akhlak Terpuji")
        : newAttitude.butirSikap;

    const formattedHariTgl = formatHariTanggalIndo(newAttitude.tanggal, newAttitude.hariTanggal);

    const item: CatatanSikapSiswa = {
      id: "cs-" + Date.now(),
      tanggal: newAttitude.tanggal,
      hariTanggal: formattedHariTgl,
      siswaNisn: newAttitude.siswaNisn,
      siswaNama: studentObj.nama,
      kelasId: newAttitude.kelasId || studentObj.kelasId,
      kategoriSikap: "Spiritual",
      jenisSikap: newAttitude.positifNegatif === "Positif" ? "Positif" : "Perbaikan",
      deskripsiKejadian: kejadian,
      kejadianPerilaku: kejadian,
      butirSikap: finalButir,
      positifNegatif: newAttitude.positifNegatif,
      tindakLanjut: newAttitude.tindakLanjut.trim() || "Diberikan bimbingan dan penguatan positif"
    };

    onAddAttitude(item);
    setIsAddingAttitude(false);
    setNewAttitude({
      kelasId: newAttitude.kelasId,
      tanggal: new Date().toISOString().split("T")[0],
      hariTanggal: "",
      siswaNisn: "",
      kejadianPerilaku: "",
      butirSikap: "Ketaatan Beribadah",
      customButirSikap: "",
      positifNegatif: "Positif",
      tindakLanjut: ""
    });
    showToast(`Data jurnal siswa untuk ${studentObj.nama} berhasil dicatat!`, "success");
  };

  const handleOpenEditAttitude = (att: CatatanSikapSiswa) => {
    setEditingAttitude({ ...att });
  };

  const handleSaveEditAttitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttitude) return;

    const kejadian = (editingAttitude.kejadianPerilaku || editingAttitude.deskripsiKejadian || "").trim();
    if (!kejadian) {
      alert("Harap isi deskripsi kejadian / perilaku murid!");
      return;
    }

    const formattedHariTgl = formatHariTanggalIndo(editingAttitude.tanggal, editingAttitude.hariTanggal);

    const updated: CatatanSikapSiswa = {
      ...editingAttitude,
      kejadianPerilaku: kejadian,
      deskripsiKejadian: kejadian,
      hariTanggal: formattedHariTgl,
      positifNegatif: editingAttitude.positifNegatif || (editingAttitude.jenisSikap === "Positif" ? "Positif" : "Negatif"),
      jenisSikap: (editingAttitude.positifNegatif === "Positif" || editingAttitude.jenisSikap === "Positif") ? "Positif" : "Perbaikan"
    };

    if (onUpdateAttitude) {
      onUpdateAttitude(updated);
    } else {
      const allAtts = attitudes.map((a) => (a.id === updated.id ? updated : a));
      DataService.saveCatatanSikap(allAtts);
    }

    showToast(`Jurnal siswa untuk ${updated.siswaNama} berhasil diperbarui!`, "success");
    setEditingAttitude(null);
  };

  const handleConfirmDeleteAttitude = () => {
    if (!deletingAttitude) return;
    const targetId = deletingAttitude.id;
    const nama = deletingAttitude.siswaNama;

    if (onDeleteAttitude) {
      onDeleteAttitude(targetId);
    } else {
      const allAtts = attitudes.filter((a) => a.id !== targetId);
      DataService.saveCatatanSikap(allAtts);
    }

    showToast(`Catatan jurnal siswa untuk ${nama} berhasil dihapus.`, "info");
    setDeletingAttitude(null);
  };

  // Helpers to get day name in Indonesian
  const getIndoDay = (dateStr: string) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  const getIndoMonthName = (monthCode: string) => {
    const months: Record<string, string> = {
      "01": "Januari", "02": "Februari", "03": "Maret", "04": "April", "05": "Mei", "06": "Juni",
      "07": "Juli", "08": "Agustus", "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
    };
    return months[monthCode] || "Juli";
  };

  const handlePrintRekapBulanan = () => {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();
    const monthJurnals = jurnals.filter(j => j.tanggal.split("-")[1] === exportMonth);
    const monthName = getIndoMonthName(exportMonth);

    const printWindow = window.open("", "_blank", "width=950,height=800");
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Jurnal Mengajar PAI - ${monthName} 2026</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 10pt;
            line-height: 1.3;
          }
          .header {
            border-bottom: 3px double #111827;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .header-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
          }
          .header-logo {
            width: 68px;
            height: auto;
            max-height: 82px;
            object-fit: contain;
            flex-shrink: 0;
          }
          .header-text {
            text-align: center;
            flex: 1;
          }
          .header-spacer {
            width: 68px;
            flex-shrink: 0;
          }
          .header-text h5 { margin: 0; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; color: #374151; }
          .header-text h4 { margin: 2px 0; font-size: 10.5pt; font-weight: bold; text-transform: uppercase; color: #1f2937; }
          .header-text h3 { margin: 2px 0; font-size: 12pt; font-weight: 900; text-transform: uppercase; color: #111827; }
          .header-text p { margin: 2px 0; font-size: 8pt; font-style: italic; color: #4b5563; }

          .title { text-align: center; margin-bottom: 14px; }
          .title h4 { margin: 0; font-size: 11pt; font-weight: 800; text-decoration: underline; text-transform: uppercase; }
          .title p { margin: 2px 0 0 0; font-size: 9pt; font-weight: 700; color: #374151; }

          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .info-table td { padding: 3px 6px; font-size: 9pt; font-weight: 600; vertical-align: top; }

          table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          table.data-table th, table.data-table td { border: 1px solid #9ca3af; padding: 6px 8px; font-size: 8.5pt; }
          table.data-table th { background-color: #f3f4f6; font-weight: 700; text-transform: uppercase; text-align: center; color: #111827; }

          .signatures { margin-top: 28px; display: table; width: 100%; page-break-inside: avoid; }
          .sig-col { display: table-cell; width: 50%; text-align: center; font-size: 9.5pt; vertical-align: top; }
          .sig-space { height: 50px; }
          .sig-name { font-weight: bold; text-decoration: underline; }
          .sig-nip { font-size: 8.5pt; color: #4b5563; }

          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-wrapper">
            <img src="${LOGO_WAY_KANAN}" alt="Logo Kabupaten Way Kanan" class="header-logo" />
            <div class="header-text">
              <h5>PEMERINTAH KABUPATEN WAY KANAN</h5>
              <h4>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
              <h3>${sekolah.namaSekolah.toUpperCase()}</h3>
              <p>${sekolah.alamat} • NPSN: ${sekolah.npsn} • Akreditasi: ${sekolah.akreditasi}</p>
            </div>
            <div class="header-spacer" aria-hidden="true"></div>
          </div>
        </div>

        <div class="title">
          <h4>REKAPITULASI JURNAL AKTIVITAS MENGAJAR GURU PAI & BUDI PEKERTI</h4>
          <p>PERIODE BULAN: ${monthName.toUpperCase()} 2026 • TAHUN AJARAN 2026/2027</p>
        </div>

        <table class="info-table">
          <tr>
            <td width="15%">Nama Guru PAI</td>
            <td width="35%">: <strong>${guru.nama}</strong></td>
            <td width="15%">Nama Sekolah</td>
            <td width="35%">: ${sekolah.namaSekolah}</td>
          </tr>
          <tr>
            <td>NIP Guru</td>
            <td>: ${guru.nip}</td>
            <td>Kepala Sekolah</td>
            <td>: ${sekolah.namaKepsek}</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th width="4%">No.</th>
              <th width="11%">Hari / Tanggal</th>
              <th width="6%">Kelas</th>
              <th width="6%">Jam Ke</th>
              <th width="21%">Materi Pembelajaran Pokok</th>
              <th width="26%">Kegiatan KBM</th>
              <th width="6%">Hadir</th>
              <th width="7%">S / I / A</th>
              <th width="13%">Catatan / Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            ${
              monthJurnals.length === 0
                ? `<tr><td colspan="9" style="text-align: center; padding: 12px; color: #6b7280; font-style: italic;">Tidak ada catatan jurnal mengajar pada bulan ${monthName} 2026.</td></tr>`
                : monthJurnals.map((j, idx) => `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                    <td style="text-align: center;">${getIndoDay(j.tanggal)}, ${j.tanggal}</td>
                    <td style="text-align: center; font-weight: bold;">${j.kelasId}</td>
                    <td style="text-align: center;">${j.jamKe}</td>
                    <td style="font-weight: 600;">${j.materiPokok}</td>
                    <td>${j.kegiatanKbm || "-"}</td>
                    <td style="text-align: center; font-weight: bold; color: #047857;">${j.kehadiranHadir}</td>
                    <td style="text-align: center;">${j.kehadiranSakit} / ${j.kehadiranIzin} / ${j.kehadiranAlpa}</td>
                    <td>${j.catatanKejadian || "-"}</td>
                  </tr>
                `).join('')
            }
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-col">
            <p>Mengetahui,<br/>Kepala ${sekolah.namaSekolah}</p>
            <div class="sig-space"></div>
            <p class="sig-name">${sekolah.namaKepsek}</p>
            <p class="sig-nip">NIP. ${sekolah.nipKepsek}</p>
          </div>
          <div class="sig-col">
            <p>Way Kanan, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru PAI & Budi Pekerti</p>
            <div class="sig-space"></div>
            <p class="sig-name">${guru.nama}</p>
            <p class="sig-nip">NIP. ${guru.nip}</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setShowExportModal(false);
  };

  const handlePrintCatatanSikap = () => {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) {
      window.print();
      return;
    }

    // Filter printed data based on active filters
    const filteredAttitudes = attitudes.filter((a) => {
      const matchKelas = filterAttitudeKelas === "ALL" || a.kelasId === filterAttitudeKelas;
      const posNeg = a.positifNegatif || (a.jenisSikap === "Positif" ? "Positif" : "Negatif");
      const matchJenis = filterAttitudeJenis === "ALL" || posNeg === filterAttitudeJenis;
      const query = searchAttitudeQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        a.siswaNama.toLowerCase().includes(query) ||
        (a.kejadianPerilaku && a.kejadianPerilaku.toLowerCase().includes(query)) ||
        (a.deskripsiKejadian && a.deskripsiKejadian.toLowerCase().includes(query)) ||
        (a.butirSikap && a.butirSikap.toLowerCase().includes(query)) ||
        a.kelasId.toLowerCase().includes(query);
      return matchKelas && matchJenis && matchSearch;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Rekapitulasi Jurnal Siswa PAI</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 16px;
            font-size: 9.5pt;
            line-height: 1.3;
          }
          .header {
            border-bottom: 3px double #111827;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .header-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
          }
          .header-logo {
            width: 68px;
            height: auto;
            max-height: 82px;
            object-fit: contain;
            flex-shrink: 0;
          }
          .header-text {
            text-align: center;
            flex: 1;
          }
          .header-spacer {
            width: 68px;
            flex-shrink: 0;
          }
          .header-text h5 { margin: 0; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; color: #374151; }
          .header-text h4 { margin: 2px 0; font-size: 10.5pt; font-weight: bold; text-transform: uppercase; color: #1f2937; }
          .header-text h3 { margin: 2px 0; font-size: 12pt; font-weight: 900; text-transform: uppercase; color: #111827; }
          .header-text p { margin: 2px 0; font-size: 8pt; font-style: italic; color: #4b5563; }

          .title { text-align: center; margin-bottom: 14px; }
          .title h4 { margin: 0; font-size: 11pt; font-weight: 800; text-decoration: underline; text-transform: uppercase; }
          .title p { margin: 2px 0 0 0; font-size: 9pt; font-weight: 700; color: #374151; }

          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .info-table td { padding: 3px 6px; font-size: 9pt; font-weight: 600; vertical-align: top; }

          table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          table.data-table th, table.data-table td { border: 1px solid #9ca3af; padding: 6px 8px; font-size: 8.5pt; vertical-align: middle; }
          table.data-table th { background-color: #f3f4f6; font-weight: 700; text-transform: uppercase; text-align: center; color: #111827; }

          .badge-positif { color: #047857; font-weight: bold; }
          .badge-negatif { color: #b91c1c; font-weight: bold; }

          .signatures { margin-top: 28px; display: table; width: 100%; page-break-inside: avoid; }
          .sig-col { display: table-cell; width: 50%; text-align: center; font-size: 9.5pt; vertical-align: top; }
          .sig-space { height: 50px; }
          .sig-name { font-weight: bold; text-decoration: underline; }
          .sig-nip { font-size: 8.5pt; color: #4b5563; }

          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-wrapper">
            <img src="${LOGO_WAY_KANAN}" alt="Logo Kabupaten Way Kanan" class="header-logo" />
            <div class="header-text">
              <h5>PEMERINTAH KABUPATEN WAY KANAN</h5>
              <h4>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
              <h3>${sekolah.namaSekolah.toUpperCase()}</h3>
              <p>${sekolah.alamat} • NPSN: ${sekolah.npsn} • Akreditasi: ${sekolah.akreditasi}</p>
            </div>
            <div class="header-spacer" aria-hidden="true"></div>
          </div>
        </div>

        <div class="title">
          <h4>REKAPITULASI JURNAL SISWA (CATATAN PERKEMBANGAN SIKAP & PERILAKU)</h4>
          <p>PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI • TAHUN AJARAN 2026/2027</p>
        </div>

        <table class="info-table">
          <tr>
            <td width="15%">Nama Guru PAI</td>
            <td width="35%">: <strong>${guru.nama}</strong></td>
            <td width="15%">Nama Sekolah</td>
            <td width="35%">: ${sekolah.namaSekolah}</td>
          </tr>
          <tr>
            <td>NIP Guru</td>
            <td>: ${guru.nip}</td>
            <td>Kepala Sekolah</td>
            <td>: ${sekolah.namaKepsek}</td>
          </tr>
          <tr>
            <td>Filter Kelas</td>
            <td>: <strong>${filterAttitudeKelas === "ALL" ? "Semua Kelas" : "Kelas " + filterAttitudeKelas}</strong></td>
            <td>Total Catatan</td>
            <td>: ${filteredAttitudes.length} siswa</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th width="4%">No.</th>
              <th width="8%">Kelas</th>
              <th width="14%">Hari/Tanggal</th>
              <th width="16%">Nama Murid</th>
              <th width="24%">Kejadian / Perilaku</th>
              <th width="14%">Butir Sikap</th>
              <th width="10%">Positif / Negatif</th>
              <th width="10%">Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            ${
              filteredAttitudes.length === 0
                ? `<tr><td colspan="8" style="text-align: center; padding: 12px; color: #6b7280; font-style: italic;">Belum ada catatan jurnal siswa.</td></tr>`
                : filteredAttitudes.map((a, idx) => {
                    const posNeg = a.positifNegatif || (a.jenisSikap === "Positif" ? "Positif" : "Negatif");
                    const hariTgl = a.hariTanggal || formatHariTanggalIndo(a.tanggal);
                    const kejadian = a.kejadianPerilaku || a.deskripsiKejadian || "-";
                    const butir = a.butirSikap || a.kategoriSikap || "Akhlak Terpuji";
                    const isPos = posNeg === "Positif";
                    return `
                      <tr>
                        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                        <td style="text-align: center; font-weight: bold;">${a.kelasId}</td>
                        <td style="text-align: center;">${hariTgl}</td>
                        <td><strong>${a.siswaNama}</strong></td>
                        <td>&ldquo;${kejadian}&rdquo;</td>
                        <td style="text-align: center;">${butir}</td>
                        <td style="text-align: center;" class="${isPos ? "badge-positif" : "badge-negatif"}">${posNeg}</td>
                        <td>${a.tindakLanjut || "-"}</td>
                      </tr>
                    `;
                  }).join('')
            }
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-col">
            <p>Mengetahui,<br/>Kepala ${sekolah.namaSekolah}</p>
            <div class="sig-space"></div>
            <p class="sig-name">${sekolah.namaKepsek}</p>
            <p class="sig-nip">NIP. ${sekolah.nipKepsek}</p>
          </div>
          <div class="sig-col">
            <p>Way Kanan, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru PAI & Budi Pekerti</p>
            <div class="sig-space"></div>
            <p class="sig-name">${guru.nama}</p>
            <p class="sig-nip">NIP. ${guru.nip}</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs - Hijau Muda Bergaris Biru */}
      <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setSubTab("mengajar")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "mengajar"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="tab-jurnal-mengajar"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "mengajar" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <BookOpen className={`w-4 h-4 ${subTab === "mengajar" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Jurnal Harian Mengajar Guru</span>
        </button>
        <button
          onClick={() => setSubTab("saku")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "saku"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="tab-jurnal-siswa"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "saku" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <PenTool className={`w-4 h-4 ${subTab === "saku" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Jurnal Siswa</span>
        </button>
      </div>

      {/* VIEW A: JURNAL MENGAJAR GURU */}
      {subTab === "mengajar" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Jurnal Aktivitas Mengajar Harian</h4>
              <p className="text-xs text-slate-500 mt-1">
                Catat setiap sesi tatap muka pembelajaran PAI. Jurnal ini akan merekap kehadiran dan catatan khusus untuk dilaporkan kepada Kepala Sekolah.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                id="btn-rekap-jurnal"
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Cetak Rekap Bulanan
              </button>
              <button
                onClick={() => {
                  setIsAddingJurnal(true);
                  setJurnalInputMode("manual");
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition border ${
                  isAddingJurnal && jurnalInputMode === "manual"
                    ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800"
                }`}
                id="btn-tambah-jurnal-manual"
              >
                <Plus className="w-4 h-4" />
                Input Manual
              </button>
              <button
                onClick={() => {
                  setIsAddingJurnal(true);
                  setJurnalInputMode("ai");
                  if (!aiTopicInput && newJurnal.materiPokok) {
                    setAiTopicInput(newJurnal.materiPokok);
                  }
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm border ${
                  isAddingJurnal && jurnalInputMode === "ai"
                    ? "bg-gradient-to-r from-teal-700 via-emerald-700 to-blue-700 text-white ring-2 ring-emerald-400 border-teal-800"
                    : "bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white border-teal-600"
                }`}
                id="btn-tambah-jurnal-ai"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Generate AI Otomatis</span>
              </button>
            </div>
          </div>

          {/* Form input jurnal baru (Bisa Manual atau Otomatis AI) */}
          {isAddingJurnal && (
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs animate-fadeIn space-y-5">
              {/* Header & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">
                      {jurnalInputMode === "ai" ? "Generator Jurnal PAI Otomatis (AI)" : "Input Jurnal Mengajar Manual"}
                    </span>
                    {jurnalInputMode === "ai" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Gemini 3.8 Flash
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {jurnalInputMode === "ai"
                      ? "Pilih materi dan metode KBM, AI akan merumuskan presensi, ringkasan alur KBM, dan catatan kejadian kelas secara otomatis."
                      : "Isi data tatap muka mandiri dengan opsi bantuan AI untuk menyusun catatan observasi kelas."}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setJurnalInputMode("manual")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        jurnalInputMode === "manual"
                          ? "bg-white text-emerald-900 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      id="btn-switch-manual"
                    >
                      <PenTool className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Manual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setJurnalInputMode("ai");
                        if (!aiTopicInput && newJurnal.materiPokok) {
                          setAiTopicInput(newJurnal.materiPokok);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        jurnalInputMode === "ai"
                          ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      id="btn-switch-ai"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Otomatis (AI)</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingJurnal(false);
                      setAiGeneratedPreview(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
                    title="Tutup Formulir"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MODE A: GENERATOR JURNAL OTOMATIS BERBASIS AI */}
              {jurnalInputMode === "ai" && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-blue-50/50 p-4 rounded-xl border border-emerald-200/70 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                          Tanggal Mengajar
                        </label>
                        <input
                          type="date"
                          value={newJurnal.tanggal}
                          onChange={(e) => setNewJurnal({ ...newJurnal, tanggal: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                          Kelas Target
                        </label>
                        <select
                          value={newJurnal.kelasId}
                          onChange={(e) => {
                            const selectedCls = e.target.value;
                            const studentCount = getStudentCountForClass(selectedCls);
                            setNewJurnal({
                              ...newJurnal,
                              kelasId: selectedCls,
                              kehadiranHadir: studentCount
                            });
                          }}
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {classes.map(c => {
                            const count = students.filter(s => s.kelasId === c.id).length;
                            return (
                              <option key={c.id} value={c.id}>
                                {c.nama} ({count > 0 ? `${count} Siswa` : "30 Siswa"})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                          Jam Mengajar Ke
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 1-2 atau 3-4"
                          value={newJurnal.jamKe}
                          onChange={(e) => setNewJurnal({ ...newJurnal, jamKe: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Topik / Materi PAI dengan Preset Cepat */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          Topik / Materi Pembelajaran PAI & Budi Pekerti
                        </label>
                        <span className="text-[10px] text-slate-500">Ketik materi bebas atau klik preset di bawah</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Contoh: Meneladani Sifat Amanah dan Jujur dalam Kehidupan Sehari-hari"
                        value={aiTopicInput}
                        onChange={(e) => setAiTopicInput(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
                      {/* Chip Preset Materi Cepat */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          Rekomendasi Cepat:
                        </span>
                        {PAI_TOPIC_PRESETS.filter(p => {
                          if (newJurnal.kelasId.includes("7") || newJurnal.kelasId.includes("VII")) return p.kelas === "VII";
                          if (newJurnal.kelasId.includes("8") || newJurnal.kelasId.includes("VIII")) return p.kelas === "VIII";
                          if (newJurnal.kelasId.includes("9") || newJurnal.kelasId.includes("IX")) return p.kelas === "IX";
                          return true;
                        }).slice(0, 5).map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAiTopicInput(preset.bab)}
                            className={`text-[10px] px-2 py-1 rounded-md border transition cursor-pointer ${
                              aiTopicInput === preset.bab
                                ? "bg-emerald-600 text-white border-emerald-700 font-bold"
                                : "bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            {preset.bab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Model / Metode Pembelajaran & Catatan Dinamika */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                          Model / Metode Pembelajaran
                        </label>
                        <select
                          value={aiMetodeInput}
                          onChange={(e) => setAiMetodeInput(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {PAI_METODE_OPTIONS.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                          Catatan Tambahan Kejadian Kelas (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Siswa aktif diskusi, 1 siswa izin, simulasi praktik lancar"
                          value={aiCatatanExtra}
                          onChange={(e) => setAiCatatanExtra(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Tombol Eksekusi Generate AI */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-emerald-600" />
                        <span>AI akan menyusun draf jurnal mengajar komprehensif, terstruktur, dan siap ditinjau.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateAiJurnal}
                        disabled={isGeneratingAi}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60 cursor-pointer"
                        id="btn-run-generate-ai"
                      >
                        {isGeneratingAi ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI Sedang Merumuskan Jurnal...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>✨ Generate Jurnal Sekarang (AI)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW HASIL GENERASI AI */}
                  {aiGeneratedPreview && (
                    <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 shadow-md shadow-emerald-500/5 animate-fadeIn space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse"></span>
                          <h6 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                            Draf Jurnal Hasil AI Gemini (Siap Disimpan atau Diedit)
                          </h6>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {aiGeneratedPreview.source === "gemini-3.8-flash" ? "Generated by Gemini AI" : "Kurikulum Engine Ready"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Materi Pokok</span>
                          <p className="font-bold text-slate-800 text-sm">{aiGeneratedPreview.materiPokok}</p>
                          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{newJurnal.kelasId}</span>
                            <span>Jam ke: {aiGeneratedPreview.jamKe || newJurnal.jamKe}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Presensi Siswa</span>
                          <div className="grid grid-cols-4 gap-1 text-center font-bold text-xs pt-1">
                            <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200">
                              <span className="block text-[9px] text-emerald-600">Hadir</span>
                              <span className="text-emerald-800 text-sm">{aiGeneratedPreview.kehadiranHadir}</span>
                            </div>
                            <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                              <span className="block text-[9px] text-amber-600">Izin</span>
                              <span className="text-amber-800 text-sm">{aiGeneratedPreview.kehadiranIzin}</span>
                            </div>
                            <div className="bg-blue-50 p-1.5 rounded border border-blue-200">
                              <span className="block text-[9px] text-blue-600">Sakit</span>
                              <span className="text-blue-800 text-sm">{aiGeneratedPreview.kehadiranSakit}</span>
                            </div>
                            <div className="bg-rose-50 p-1.5 rounded border border-rose-200">
                              <span className="block text-[9px] text-rose-600">Alpa</span>
                              <span className="text-rose-800 text-sm">{aiGeneratedPreview.kehadiranAlpa}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Metode & Pendekatan</span>
                          <p className="font-semibold text-slate-700 text-xs">{aiMetodeInput}</p>
                          <span className="mt-2 inline-block text-[10px] text-slate-400 font-medium">Berbasis Profil Pelajar Pancasila</span>
                        </div>
                      </div>

                      {/* Ringkasan KBM & Catatan Khusus */}
                      <div className="space-y-2 text-xs">
                        {(aiGeneratedPreview.kegiatanKbm || aiGeneratedPreview.ringkasanKBM) && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kegiatan KBM (Aktivitas Pembelajaran)</span>
                            <p className="text-slate-700 leading-relaxed font-medium">{aiGeneratedPreview.kegiatanKbm || aiGeneratedPreview.ringkasanKBM}</p>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Catatan Kejadian Khusus di Kelas & Refleksi</span>
                          <p className="text-slate-700 leading-relaxed font-medium">{aiGeneratedPreview.catatanKejadian}</p>
                          {aiGeneratedPreview.refleksiGuru && (
                            <p className="mt-2 pt-2 border-t border-slate-200/60 text-slate-600 italic text-[11px]">
                              <strong>Refleksi Guru:</strong> {aiGeneratedPreview.refleksiGuru}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tombol Tindakan Preview AI */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleGenerateAiJurnal}
                          disabled={isGeneratingAi}
                          className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
                          <span>Generate Ulang</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyAiToForm}
                          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                          id="btn-terapkan-ai-ke-form"
                        >
                          <PenTool className="w-3.5 h-3.5 text-blue-600" />
                          <span>Terapkan ke Formulir & Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAiDirectly}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                          id="btn-simpan-langsung-ai"
                        >
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>Simpan Langsung ke Jurnal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE B: INPUT MANUAL */}
              {jurnalInputMode === "manual" && (
                <form onSubmit={handleJurnalSubmit} className="space-y-4 text-xs font-medium text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Tanggal Mengajar
                      </label>
                      <input
                        type="date"
                        required
                        value={newJurnal.tanggal}
                        onChange={(e) => setNewJurnal({ ...newJurnal, tanggal: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Kelas
                      </label>
                      <select
                        value={newJurnal.kelasId}
                        onChange={(e) => {
                          const clsId = e.target.value;
                          const studentCount = getStudentCountForClass(clsId);
                          setNewJurnal({
                            ...newJurnal,
                            kelasId: clsId,
                            kehadiranHadir: studentCount
                          });
                        }}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800"
                      >
                        {classes.map(c => {
                          const count = students.filter(s => s.kelasId === c.id).length;
                          return (
                            <option key={c.id} value={c.id}>
                              {c.nama} ({count > 0 ? `${count} Siswa` : "30 Siswa"})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Jam Mengajar Ke
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 1-2 atau 3-4"
                        value={newJurnal.jamKe}
                        onChange={(e) => setNewJurnal({ ...newJurnal, jamKe: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Baris Materi Pembelajaran Pokok */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Materi Pembelajaran Pokok
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bab 1: Ketentuan bersuci dari hadas kecil dan hadas besar (Thaharah)"
                      value={newJurnal.materiPokok}
                      onChange={(e) => setNewJurnal({ ...newJurnal, materiPokok: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800 font-semibold"
                    />
                  </div>

                  {/* Baris Kegiatan KBM setelah baris materi pembelajaran pokok */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Kegiatan KBM
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Aktivitas pendahuluan/tadarus, inti pembelajaran/praktik/diskusi, dan evaluasi & penutup
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Tadarus bersama, apersepsi konsep materi, eksplorasi dalil naqli berkelompok, demonstrasi praktik wudhu/tayamum, serta evaluasi & refleksi KBM..."
                      value={newJurnal.kegiatanKbm}
                      onChange={(e) => setNewJurnal({ ...newJurnal, kegiatanKbm: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800 leading-relaxed"
                    />
                  </div>

                  {/* Kehadiran block */}
                  <div className="p-4 rounded-xl bg-white border border-slate-150 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Laporan Presensi Kehadiran Siswa
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Total Siswa Kelas: {getStudentCountForClass(newJurnal.kelasId)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Hadir (Siswa)</label>
                        <input
                          type="number"
                          min="0"
                          value={newJurnal.kehadiranHadir}
                          onChange={(e) => setNewJurnal({ ...newJurnal, kehadiranHadir: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none font-semibold text-emerald-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Izin (Siswa)</label>
                        <input
                          type="number"
                          min="0"
                          value={newJurnal.kehadiranIzin}
                          onChange={(e) => setNewJurnal({ ...newJurnal, kehadiranIzin: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none font-semibold text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Sakit (Siswa)</label>
                        <input
                          type="number"
                          min="0"
                          value={newJurnal.kehadiranSakit}
                          onChange={(e) => setNewJurnal({ ...newJurnal, kehadiranSakit: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none font-semibold text-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Alpa (Siswa)</label>
                        <input
                          type="number"
                          min="0"
                          value={newJurnal.kehadiranAlpa}
                          onChange={(e) => setNewJurnal({ ...newJurnal, kehadiranAlpa: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none font-semibold text-rose-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        Catatan Kejadian Khusus di Kelas & Refleksi KBM
                      </label>
                      <button
                        type="button"
                        onClick={handleInlineEnhanceNotes}
                        disabled={isEnhancingNotes}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-60"
                        title="Gunakan AI untuk merumuskan catatan kejadian khusus berdasarkan materi pokok"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{isEnhancingNotes ? "Menyusun catatan..." : "✨ AI Bantu Catatan Kelas"}</span>
                      </button>
                    </div>
                    <textarea
                      placeholder="Contoh: Siswa aktif berdiskusi kelompok, siswa menunjukkan adab dan penalaran kritis dalam menganalisis dalil naqli..."
                      value={newJurnal.catatanKejadian}
                      onChange={(e) => setNewJurnal({ ...newJurnal, catatanKejadian: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-800 min-h-[90px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setJurnalInputMode("ai");
                        if (!aiTopicInput && newJurnal.materiPokok) {
                          setAiTopicInput(newJurnal.materiPokok);
                        }
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ingin lebih cepat? Coba Mode Otomatis dengan AI ➜</span>
                    </button>
                    <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddingJurnal(false)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition cursor-pointer"
                        id="btn-submit-jurnal"
                      >
                        Simpan Jurnal
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Jurnal List Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-800">Daftar Log Jurnal Pembelajaran</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full font-bold">
                  {jurnals.filter((j) => {
                    const matchClass = filterJurnalKelas === "ALL" || j.kelasId === filterJurnalKelas;
                    const q = searchJurnalQuery.trim().toLowerCase();
                    const matchQuery =
                      !q ||
                      j.materiPokok.toLowerCase().includes(q) ||
                      (j.kegiatanKbm && j.kegiatanKbm.toLowerCase().includes(q)) ||
                      j.tanggal.toLowerCase().includes(q) ||
                      j.kelasId.toLowerCase().includes(q) ||
                      (j.catatanKejadian && j.catatanKejadian.toLowerCase().includes(q));
                    return matchClass && matchQuery;
                  }).length} dari {jurnals.length} Sesi
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Filter */}
                <div className="relative min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari materi / tanggal..."
                    value={searchJurnalQuery}
                    onChange={(e) => setSearchJurnalQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                  {searchJurnalQuery && (
                    <button
                      onClick={() => setSearchJurnalQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Class Filter */}
                <select
                  value={filterJurnalKelas}
                  onChange={(e) => setFilterJurnalKelas(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer"
                >
                  <option value="ALL">Semua Rombel</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="p-4 w-12 text-center font-bold text-slate-500">No.</th>
                    <th className="p-4 w-32">Hari / Tanggal</th>
                    <th className="p-4 w-20">Kelas</th>
                    <th className="p-4 w-20">Jam Ke</th>
                    <th className="p-4 min-w-[200px]">Materi Pembelajaran Pokok</th>
                    <th className="p-4 min-w-[240px]">Kegiatan KBM</th>
                    <th className="p-4 w-32 text-center">Kehadiran Siswa</th>
                    <th className="p-4 min-w-[160px]">Catatan Sesi Kelas</th>
                    <th className="p-4 w-24 text-center font-bold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {(() => {
                    const displayedJurnals = jurnals.filter((j) => {
                      const matchClass = filterJurnalKelas === "ALL" || j.kelasId === filterJurnalKelas;
                      const q = searchJurnalQuery.trim().toLowerCase();
                      const matchQuery =
                        !q ||
                        j.materiPokok.toLowerCase().includes(q) ||
                        (j.kegiatanKbm && j.kegiatanKbm.toLowerCase().includes(q)) ||
                        j.tanggal.toLowerCase().includes(q) ||
                        j.kelasId.toLowerCase().includes(q) ||
                        (j.catatanKejadian && j.catatanKejadian.toLowerCase().includes(q));
                      return matchClass && matchQuery;
                    });

                    if (displayedJurnals.length === 0) {
                      return (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400 font-normal">
                            Belum ada catatan log jurnal mengajar
                            {searchJurnalQuery || filterJurnalKelas !== "ALL"
                              ? " yang sesuai dengan filter pencarian."
                              : ". Silakan gunakan formulir input di atas untuk mencatat jurnal harian."}
                          </td>
                        </tr>
                      );
                    }

                    return displayedJurnals.map((j, idx) => (
                      <tr key={j.id} className="hover:bg-slate-50/40 transition">
                        <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-4">
                          <span className="block font-bold text-slate-900">{getIndoDay(j.tanggal)}</span>
                          <span className="block text-[10px] text-slate-400">{j.tanggal}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                            {j.kelasId}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{j.jamKe}</td>
                        <td className="p-4 font-bold text-slate-900 text-sm leading-snug">
                          {j.materiPokok}
                        </td>
                        <td className="p-4 text-slate-700 text-xs font-normal leading-relaxed">
                          {j.kegiatanKbm || <span className="italic text-slate-400">-</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col items-center gap-0.5 text-[10px]">
                            <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Hadir: {j.kehadiranHadir}
                            </span>
                            <div className="flex gap-1 text-[9px] text-slate-400">
                              <span>I: {j.kehadiranIzin}</span>•
                              <span>S: {j.kehadiranSakit}</span>•
                              <span>A: {j.kehadiranAlpa}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-medium leading-relaxed max-w-xs" title={j.catatanKejadian}>
                          <span className="line-clamp-2">{j.catatanKejadian || "-"}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(j)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-200 cursor-pointer shadow-2xs"
                              title="Edit Log Jurnal"
                              id={`btn-edit-jurnal-${j.id}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingJurnal(j)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer shadow-2xs"
                              title="Hapus Log Jurnal"
                              id={`btn-delete-jurnal-${j.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: JURNAL SISWA (Perkembangan Sikap & Perilaku Murid) */}
      {subTab === "saku" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Smile className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Jurnal Siswa
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Catatan perkembangan sikap dan perilaku siswa dengan format baris: No, Kelas, Hari/Tanggal, Nama Murid, Kejadian/Perilaku, Butir Sikap, Positif/Negatif, dan Tindak Lanjut.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrintCatatanSikap}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-300 shadow-xs cursor-pointer"
                id="btn-cetak-jurnal-siswa"
                title="Cetak Rekapitulasi Jurnal Siswa"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Cetak Jurnal Siswa</span>
              </button>
              <button
                onClick={() => setIsAddingAttitude(!isAddingAttitude)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                  isAddingAttitude
                    ? "bg-slate-700 hover:bg-slate-800 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
                id="btn-tambah-jurnal-siswa"
              >
                <Plus className={`w-4 h-4 transition-transform ${isAddingAttitude ? "rotate-45" : ""}`} />
                <span>{isAddingAttitude ? "Tutup Form" : "Input Jurnal Siswa"}</span>
              </button>
            </div>
          </div>

          {/* Form Input Jurnal Siswa Baru */}
          {isAddingAttitude && (
            <div className="bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 rounded-2xl p-6 border-2 border-emerald-200/80 shadow-md animate-fadeIn space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-sm font-extrabold text-slate-900">Form Input Jurnal Siswa Baru</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingAttitude(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAttitudeSubmit} className="space-y-4 text-xs font-medium text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Kelas */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      1. Kelas
                    </label>
                    <select
                      value={newAttitude.kelasId}
                      onChange={(e) => {
                        const newKelas = e.target.value;
                        const matchingStudents = students.filter(s => s.kelasId === newKelas);
                        setNewAttitude({
                          ...newAttitude,
                          kelasId: newKelas,
                          siswaNisn: matchingStudents.length > 0 ? matchingStudents[0].nisn : ""
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-semibold"
                      required
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>
                          Kelas {c.nama} ({c.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hari & Tanggal */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      2. Hari / Tanggal
                    </label>
                    <input
                      type="date"
                      value={newAttitude.tanggal}
                      onChange={(e) => {
                        const tgl = e.target.value;
                        setNewAttitude({
                          ...newAttitude,
                          tanggal: tgl,
                          hariTanggal: formatHariTanggalIndo(tgl)
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-semibold"
                      required
                    />
                    <span className="block text-[11px] text-emerald-700 font-bold mt-1">
                      {newAttitude.hariTanggal || formatHariTanggalIndo(newAttitude.tanggal)}
                    </span>
                  </div>

                  {/* Nama Murid */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      3. Nama Murid
                    </label>
                    <select
                      value={newAttitude.siswaNisn}
                      onChange={(e) => setNewAttitude({ ...newAttitude, siswaNisn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-semibold"
                      required
                    >
                      <option value="">-- Pilih Nama Murid --</option>
                      {students
                        .filter(s => !newAttitude.kelasId || s.kelasId === newAttitude.kelasId)
                        .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }))
                        .map(s => (
                          <option key={s.nisn} value={s.nisn}>
                            {s.nama} ({s.kelasId} • NISN: {s.nisn})
                          </option>
                        ))}
                      {/* Fallback to all students if no match */}
                      {students.filter(s => !newAttitude.kelasId || s.kelasId === newAttitude.kelasId).length === 0 &&
                        students.map(s => (
                          <option key={s.nisn} value={s.nisn}>
                            {s.nama} ({s.kelasId})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Butir Sikap */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      4. Butir Sikap
                    </label>
                    <select
                      value={newAttitude.butirSikap}
                      onChange={(e) => setNewAttitude({ ...newAttitude, butirSikap: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800 font-semibold"
                    >
                      {BUTIR_SIKAP_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                    {newAttitude.butirSikap === "Lainnya (Ketik Manual)" && (
                      <input
                        type="text"
                        placeholder="Ketik butir sikap yang diamati..."
                        value={newAttitude.customButirSikap}
                        onChange={(e) => setNewAttitude({ ...newAttitude, customButirSikap: e.target.value })}
                        className="mt-2 w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-800 font-medium"
                        required
                      />
                    )}
                  </div>

                  {/* Positif / Negatif */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      5. Positif / Negatif
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setNewAttitude({ ...newAttitude, positifNegatif: "Positif" })}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                          newAttitude.positifNegatif === "Positif"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Positif</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAttitude({ ...newAttitude, positifNegatif: "Negatif" })}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                          newAttitude.positifNegatif === "Negatif"
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-rose-50"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Negatif</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kejadian / Perilaku */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      6. Kejadian / Perilaku
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Uraikan peristiwa atau tindakan siswa secara objektif..."
                      value={newAttitude.kejadianPerilaku}
                      onChange={(e) => setNewAttitude({ ...newAttitude, kejadianPerilaku: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800"
                    />
                  </div>

                  {/* Tindak Lanjut */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                      7. Tindak Lanjut
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Diberikan apresiasi di depan kelas, dibimbing persuasif saat salat dhuha, dsb."
                      value={newAttitude.tindakLanjut}
                      onChange={(e) => setNewAttitude({ ...newAttitude, tindakLanjut: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddingAttitude(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    id="btn-submit-jurnal-siswa"
                  >
                    <Check className="w-4 h-4" />
                    Simpan Jurnal Siswa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Bar & Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Filter Kelas */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Kelas:</span>
                <select
                  value={filterAttitudeKelas}
                  onChange={(e) => setFilterAttitudeKelas(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      Kelas {cls.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Positif/Negatif */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Sikap:</span>
                <select
                  value={filterAttitudeJenis}
                  onChange={(e) => setFilterAttitudeJenis(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">Semua (Positif & Negatif)</option>
                  <option value="Positif">Hanya Positif</option>
                  <option value="Negatif">Hanya Negatif</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari murid, butir sikap, kejadian..."
                  value={searchAttitudeQuery}
                  onChange={(e) => setSearchAttitudeQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 px-3 py-1 rounded-lg bg-slate-100">
              Total:{" "}
              <span className="text-emerald-700 font-extrabold">
                {
                  attitudes.filter((a) => {
                    const matchKelas = filterAttitudeKelas === "ALL" || a.kelasId === filterAttitudeKelas;
                    const posNeg = a.positifNegatif || (a.jenisSikap === "Positif" ? "Positif" : "Negatif");
                    const matchJenis = filterAttitudeJenis === "ALL" || posNeg === filterAttitudeJenis;
                    const query = searchAttitudeQuery.toLowerCase().trim();
                    const matchSearch =
                      !query ||
                      a.siswaNama.toLowerCase().includes(query) ||
                      (a.kejadianPerilaku && a.kejadianPerilaku.toLowerCase().includes(query)) ||
                      (a.deskripsiKejadian && a.deskripsiKejadian.toLowerCase().includes(query)) ||
                      (a.butirSikap && a.butirSikap.toLowerCase().includes(query)) ||
                      a.kelasId.toLowerCase().includes(query);
                    return matchKelas && matchJenis && matchSearch;
                  }).length
                }
              </span>{" "}
              Baris
            </div>
          </div>

          {/* TABLE JURNAL SISWA - FORMAT BARIS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs" id="table-jurnal-siswa">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                    <th className="py-3 px-3 text-center w-20 border-r border-slate-200">Kelas</th>
                    <th className="py-3 px-3 text-center w-36 border-r border-slate-200">Hari / Tanggal</th>
                    <th className="py-3 px-3 w-48 border-r border-slate-200">Nama Murid</th>
                    <th className="py-3 px-4 min-w-[220px] border-r border-slate-200">Kejadian / Perilaku</th>
                    <th className="py-3 px-3 text-center w-40 border-r border-slate-200">Butir Sikap</th>
                    <th className="py-3 px-3 text-center w-28 border-r border-slate-200">Positif / Negatif</th>
                    <th className="py-3 px-4 min-w-[200px] border-r border-slate-200">Tindak Lanjut</th>
                    <th className="py-3 px-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const filtered = attitudes.filter((a) => {
                      const matchKelas = filterAttitudeKelas === "ALL" || a.kelasId === filterAttitudeKelas;
                      const posNeg = a.positifNegatif || (a.jenisSikap === "Positif" ? "Positif" : "Negatif");
                      const matchJenis = filterAttitudeJenis === "ALL" || posNeg === filterAttitudeJenis;
                      const query = searchAttitudeQuery.toLowerCase().trim();
                      const matchSearch =
                        !query ||
                        a.siswaNama.toLowerCase().includes(query) ||
                        (a.kejadianPerilaku && a.kejadianPerilaku.toLowerCase().includes(query)) ||
                        (a.deskripsiKejadian && a.deskripsiKejadian.toLowerCase().includes(query)) ||
                        (a.butirSikap && a.butirSikap.toLowerCase().includes(query)) ||
                        a.kelasId.toLowerCase().includes(query);
                      return matchKelas && matchJenis && matchSearch;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Smile className="w-8 h-8 text-slate-300" />
                              <p className="font-semibold text-sm text-slate-500">Belum ada catatan jurnal siswa yang sesuai.</p>
                              <button
                                type="button"
                                onClick={() => setIsAddingAttitude(true)}
                                className="mt-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Input Jurnal Siswa Sekarang
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((att, idx) => {
                      const posNeg = att.positifNegatif || (att.jenisSikap === "Positif" ? "Positif" : "Negatif");
                      const isPositive = posNeg === "Positif";
                      const hariTgl = att.hariTanggal || formatHariTanggalIndo(att.tanggal);
                      const kejadian = att.kejadianPerilaku || att.deskripsiKejadian || "-";
                      const butir = att.butirSikap || att.kategoriSikap || "Akhlak Terpuji";

                      return (
                        <tr
                          key={att.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isPositive ? "bg-white" : "bg-rose-50/20"
                          }`}
                        >
                          {/* 1. No */}
                          <td className="py-3 px-3 text-center font-bold text-slate-500 border-r border-slate-100">
                            {idx + 1}
                          </td>

                          {/* 2. Kelas */}
                          <td className="py-3 px-3 text-center border-r border-slate-100">
                            <span className="inline-block px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                              {att.kelasId}
                            </span>
                          </td>

                          {/* 3. Hari / Tanggal */}
                          <td className="py-3 px-3 text-center font-semibold text-slate-700 border-r border-slate-100 whitespace-nowrap">
                            {hariTgl}
                          </td>

                          {/* 4. Nama Murid */}
                          <td className="py-3 px-3 border-r border-slate-100">
                            <div className="font-extrabold text-slate-900 leading-tight">
                              {att.siswaNama}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              NISN: {att.siswaNisn}
                            </div>
                          </td>

                          {/* 5. Kejadian / Perilaku */}
                          <td className="py-3 px-4 border-r border-slate-100 text-slate-700 leading-relaxed font-medium">
                            &ldquo;{kejadian}&rdquo;
                          </td>

                          {/* 6. Butir Sikap */}
                          <td className="py-3 px-3 text-center border-r border-slate-100">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
                              {butir}
                            </span>
                          </td>

                          {/* 7. Positif / Negatif */}
                          <td className="py-3 px-3 text-center border-r border-slate-100">
                            {isPositive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                Positif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                Negatif
                              </span>
                            )}
                          </td>

                          {/* 8. Tindak Lanjut */}
                          <td className="py-3 px-4 border-r border-slate-100 text-slate-800 font-semibold leading-relaxed">
                            {att.tindakLanjut || "-"}
                          </td>

                          {/* 9. Aksi */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditAttitude(att)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit Jurnal Siswa"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingAttitude(att)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Hapus Jurnal Siswa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY JOURNAL EXPORT PREVIEW MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-scaleUp">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Cetak Lembar Jurnal Mengajar Bulanan
                </h4>
                <p className="text-xs text-slate-400">Pilih bulan rekapitulasi pelaporan harian.</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value)}
                  className="p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex-1 focus:outline-none"
                >
                  <option value="07">Juli 2026</option>
                  <option value="08">Agustus 2026</option>
                  <option value="09">September 2026</option>
                  <option value="10">Oktober 2026</option>
                  <option value="11">November 2026</option>
                  <option value="12">Desember 2026</option>
                </select>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-800 leading-relaxed font-semibold">
                Sistem mendeteksi {jurnals.filter(j => j.tanggal.split("-")[1] === exportMonth).length} log mengajar yang valid pada bulan {getIndoMonthName(exportMonth)} 2026. Laporan siap dicetak dan ditandatangani oleh Kepala Sekolah.
              </div>

              {/* Simulated Printable area preview */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-[10px] space-y-3 font-medium text-slate-700 max-h-[150px] overflow-y-auto">
                <div className="text-center font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5 uppercase">
                  LAPORAN BULANAN AKTIVITAS MENGAJAR PAI - {getIndoMonthName(exportMonth)} 2026
                </div>
                {jurnals.filter(j => j.tanggal.split("-")[1] === exportMonth).map((j, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-1.5 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{j.tanggal} ({j.kelasId}) • Jam: {j.jamKe}</span>
                      <span className="text-emerald-700 font-bold">Hadir: {j.kehadiranHadir}</span>
                    </div>
                    <div className="font-semibold text-slate-900 truncate">Materi: {j.materiPokok}</div>
                    {j.kegiatanKbm && (
                      <div className="text-[9px] text-slate-500 line-clamp-1 italic">KBM: {j.kegiatanKbm}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handlePrintRekapBulanan}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-700/10 flex items-center gap-1 transition cursor-pointer"
                id="btn-confirm-print-rekap"
              >
                <Download className="w-4 h-4" />
                Cetak & Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT JURNAL MENGAJAR */}
      {editingJurnal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Log Jurnal Mengajar</h3>
                  <p className="text-xs text-slate-500">Perbarui rincian KBM, materi pembelajaran, dan presensi</p>
                </div>
              </div>
              <button
                onClick={() => setEditingJurnal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Tanggal Mengajar
                  </label>
                  <input
                    type="date"
                    required
                    value={editingJurnal.tanggal}
                    onChange={(e) => setEditingJurnal({ ...editingJurnal, tanggal: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Kelas
                  </label>
                  <select
                    value={editingJurnal.kelasId}
                    onChange={(e) => setEditingJurnal({ ...editingJurnal, kelasId: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-bold cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Jam Ke
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1-2"
                    value={editingJurnal.jamKe}
                    onChange={(e) => setEditingJurnal({ ...editingJurnal, jamKe: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Materi Pokok */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Materi Pembelajaran Pokok <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Materi pokok pembelajaran..."
                  value={editingJurnal.materiPokok}
                  onChange={(e) => setEditingJurnal({ ...editingJurnal, materiPokok: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold text-sm"
                />
              </div>

              {/* Kegiatan KBM */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Kegiatan KBM
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Pendahuluan/Tadarus, Inti & Praktik, Evaluasi/Penutup
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Tuliskan alur kegiatan belajar mengajar..."
                  value={editingJurnal.kegiatanKbm || ""}
                  onChange={(e) => setEditingJurnal({ ...editingJurnal, kegiatanKbm: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 leading-relaxed"
                />
              </div>

              {/* Presensi Kehadiran */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Presensi Kehadiran Siswa
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-800 mb-1 text-center">HADIR</span>
                    <input
                      type="number"
                      min="0"
                      value={editingJurnal.kehadiranHadir}
                      onChange={(e) => setEditingJurnal({ ...editingJurnal, kehadiranHadir: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full p-2 rounded-lg border border-emerald-300 bg-white text-emerald-950 font-bold text-center text-sm"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-amber-700 mb-1 text-center">SAKIT (S)</span>
                    <input
                      type="number"
                      min="0"
                      value={editingJurnal.kehadiranSakit}
                      onChange={(e) => setEditingJurnal({ ...editingJurnal, kehadiranSakit: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full p-2 rounded-lg border border-amber-300 bg-white text-amber-950 font-bold text-center text-sm"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-blue-700 mb-1 text-center">IZIN (I)</span>
                    <input
                      type="number"
                      min="0"
                      value={editingJurnal.kehadiranIzin}
                      onChange={(e) => setEditingJurnal({ ...editingJurnal, kehadiranIzin: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full p-2 rounded-lg border border-blue-300 bg-white text-blue-950 font-bold text-center text-sm"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-rose-700 mb-1 text-center">ALPA (A)</span>
                    <input
                      type="number"
                      min="0"
                      value={editingJurnal.kehadiranAlpa}
                      onChange={(e) => setEditingJurnal({ ...editingJurnal, kehadiranAlpa: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full p-2 rounded-lg border border-rose-300 bg-white text-rose-950 font-bold text-center text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Catatan Kejadian */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Catatan Sesi Kelas / Observasi & Refleksi
                </label>
                <textarea
                  rows={2}
                  value={editingJurnal.catatanKejadian || ""}
                  onChange={(e) => setEditingJurnal({ ...editingJurnal, catatanKejadian: e.target.value })}
                  placeholder="Catatan keaktifan siswa, kendala pembelajaran, refleksi guru..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingJurnal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-save-edit-jurnal"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS JURNAL */}
      {deletingJurnal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Hapus Log Jurnal Mengajar?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus sesi jurnal pembelajaran ini dari arsip? Tindakan ini tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-semibold">{getIndoDay(deletingJurnal.tanggal)}, {deletingJurnal.tanggal}</span>
                <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Kelas {deletingJurnal.kelasId} (Jam {deletingJurnal.jamKe})</span>
              </div>
              <p className="font-bold text-slate-900 text-sm leading-snug">{deletingJurnal.materiPokok}</p>
              {deletingJurnal.kegiatanKbm && (
                <p className="text-[11px] text-slate-600 italic line-clamp-2">KBM: {deletingJurnal.kegiatanKbm}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingJurnal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                id="btn-confirm-delete-jurnal"
              >
                <Trash2 className="w-4 h-4" />
                Ya, Hapus Jurnal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT JURNAL SISWA */}
      {editingAttitude && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Pencil className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Jurnal Siswa</h3>
                  <p className="text-xs text-slate-500">Perbarui rincian catatan sikap dan perilaku murid.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAttitude(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAttitude} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Kelas */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Kelas
                  </label>
                  <select
                    value={editingAttitude.kelasId}
                    onChange={(e) => setEditingAttitude({ ...editingAttitude, kelasId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={editingAttitude.tanggal}
                    onChange={(e) => {
                      const tgl = e.target.value;
                      setEditingAttitude({
                        ...editingAttitude,
                        tanggal: tgl,
                        hariTanggal: formatHariTanggalIndo(tgl)
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                {/* Hari / Tanggal display */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Format Hari / Tanggal
                  </label>
                  <input
                    type="text"
                    value={editingAttitude.hariTanggal || formatHariTanggalIndo(editingAttitude.tanggal)}
                    onChange={(e) => setEditingAttitude({ ...editingAttitude, hariTanggal: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-800 font-semibold"
                    placeholder="Contoh: Senin, 09/11/2026"
                  />
                </div>
              </div>

              {/* Nama Murid */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Nama Murid
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold flex items-center justify-between">
                  <span>{editingAttitude.siswaNama}</span>
                  <span className="text-[11px] text-slate-400 font-normal">NISN: {editingAttitude.siswaNisn}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Butir Sikap */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Butir Sikap
                  </label>
                  <select
                    value={
                      BUTIR_SIKAP_PRESETS.includes(editingAttitude.butirSikap || "")
                        ? editingAttitude.butirSikap
                        : "Lainnya (Ketik Manual)"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Lainnya (Ketik Manual)") {
                        setEditingAttitude({ ...editingAttitude, butirSikap: "" });
                      } else {
                        setEditingAttitude({ ...editingAttitude, butirSikap: val });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 font-semibold"
                  >
                    {BUTIR_SIKAP_PRESETS.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>
                  {(!BUTIR_SIKAP_PRESETS.includes(editingAttitude.butirSikap || "") || editingAttitude.butirSikap === "") && (
                    <input
                      type="text"
                      placeholder="Ketik butir sikap..."
                      value={editingAttitude.butirSikap || ""}
                      onChange={(e) => setEditingAttitude({ ...editingAttitude, butirSikap: e.target.value })}
                      className="mt-2 w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-800 font-medium"
                    />
                  )}
                </div>

                {/* Positif / Negatif */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Positif / Negatif
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAttitude({ ...editingAttitude, positifNegatif: "Positif", jenisSikap: "Positif" })}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        (editingAttitude.positifNegatif === "Positif" || editingAttitude.jenisSikap === "Positif")
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Positif</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAttitude({ ...editingAttitude, positifNegatif: "Negatif", jenisSikap: "Perbaikan" })}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        (editingAttitude.positifNegatif === "Negatif" || (editingAttitude.jenisSikap && editingAttitude.jenisSikap !== "Positif"))
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-rose-50"
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Negatif</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Kejadian / Perilaku */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Kejadian / Perilaku <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingAttitude.kejadianPerilaku || editingAttitude.deskripsiKejadian || ""}
                  onChange={(e) => setEditingAttitude({
                    ...editingAttitude,
                    kejadianPerilaku: e.target.value,
                    deskripsiKejadian: e.target.value
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800"
                />
              </div>

              {/* Tindak Lanjut */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Tindak Lanjut
                </label>
                <textarea
                  rows={2}
                  value={editingAttitude.tindakLanjut || ""}
                  onChange={(e) => setEditingAttitude({ ...editingAttitude, tindakLanjut: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAttitude(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-save-edit-jurnal-siswa"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS JURNAL SISWA */}
      {deletingAttitude && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Hapus Jurnal Siswa?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus catatan jurnal siswa ini? Tindakan ini tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-semibold">{deletingAttitude.hariTanggal || formatHariTanggalIndo(deletingAttitude.tanggal)}</span>
                <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Kelas {deletingAttitude.kelasId}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm leading-snug">{deletingAttitude.siswaNama}</p>
              <p className="text-slate-600 italic line-clamp-2">
                &ldquo;{deletingAttitude.kejadianPerilaku || deletingAttitude.deskripsiKejadian}&rdquo;
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {deletingAttitude.butirSikap || deletingAttitude.kategoriSikap || "Akhlak Terpuji"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  (deletingAttitude.positifNegatif === "Positif" || deletingAttitude.jenisSikap === "Positif")
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {deletingAttitude.positifNegatif || (deletingAttitude.jenisSikap === "Positif" ? "Positif" : "Negatif")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingAttitude(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAttitude}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                id="btn-confirm-delete-attitude"
              >
                <Trash2 className="w-4 h-4" />
                Ya, Hapus Jurnal Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast.message}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
