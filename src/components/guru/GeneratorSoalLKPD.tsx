/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  Sparkles,
  BookOpen,
  FileText,
  Printer,
  Copy,
  Check,
  Save,
  HelpCircle,
  CheckCircle,
  Sliders,
  Award,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Send,
  BookOpenCheck,
  Zap,
  Info,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Search,
  Filter,
  X,
  FileUp,
  FolderOpen,
  Clock,
  Calendar,
  CheckCircle2,
  Paperclip
} from "lucide-react";
import { BabPelajaran, SoalPilihanGanda, LKPDItem, BerkasLKPDItem } from "../../types";
import { generateAutomaticLKPD } from "../../lib/lkpdGenerator";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";
import { DataService } from "../../data/initialData";
import {
  saveFileToIndexedDB,
  getFileFromIndexedDB,
  deleteFileFromIndexedDB,
  parseDocx,
  parseExcel,
  fileToDataUrl,
  fileToArrayBuffer
} from "../../lib/fileStorage";

interface GeneratorSoalLKPDProps {
  babPelajaran: BabPelajaran[];
  onUpdateBabPelajaran: (updated: BabPelajaran[]) => void;
  guruNama?: string;
}

export default function GeneratorSoalLKPD({
  babPelajaran,
  onUpdateBabPelajaran,
  guruNama = "Sadiqul Alim, S.Pd.I., M.Pd."
}: GeneratorSoalLKPDProps) {
  // Top-level Navigation Mode
  const [mainMode, setMainMode] = useState<"generator" | "upload" | "bank">("generator");

  // ==================== GENERATOR (AI) STATES ====================
  const [selectedBabId, setSelectedBabId] = useState<string>(babPelajaran[0]?.id || "custom");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [customDesc, setCustomDesc] = useState<string>("");
  const [kelasId, setKelasId] = useState<string>("VII");
  const [semester, setSemester] = useState<string>("1");
  const [difficulty, setDifficulty] = useState<"Mudah" | "Sedang" | "HOTS">("HOTS");
  const [jumlahSoal, setJumlahSoal] = useState<number>(5);
  const [targetBabForLms, setTargetBabForLms] = useState<string>(babPelajaran[0]?.id || "");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [activeResultTab, setActiveResultTab] = useState<"lkpd" | "soal">("lkpd");
  const [generatedLKPD, setGeneratedLKPD] = useState<LKPDItem | null>(null);

  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [savedToLmsToast, setSavedToLmsToast] = useState<string | null>(null);

  // ==================== UPLOAD BERKAS LKPD STATES ====================
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadJudulLkpd, setUploadJudulLkpd] = useState<string>("");
  const [uploadBabId, setUploadBabId] = useState<string>(babPelajaran[0]?.id || "umum");
  const [uploadKelasId, setUploadKelasId] = useState<string>("VII");
  const [uploadSemester, setUploadSemester] = useState<string>("1");
  const [uploadKategori, setUploadKategori] = useState<string>("Praktik Ibadah");
  const [uploadKeterangan, setUploadKeterangan] = useState<string>("");
  const [uploadPublishLms, setUploadPublishLms] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // ==================== BANK & ARSIP BERKAS STATES ====================
  const [berkasList, setBerkasList] = useState<BerkasLKPDItem[]>(() => {
    return DataService.getBerkasLKPD();
  });
  const [bankSearch, setBankSearch] = useState<string>("");
  const [bankBabFilter, setBankBabFilter] = useState<string>("Semua");
  const [bankKelasFilter, setBankKelasFilter] = useState<string>("Semua");
  const [bankKategoriFilter, setBankKategoriFilter] = useState<string>("Semua");

  // ==================== PREVIEW MODAL STATE ====================
  const [previewBerkas, setPreviewBerkas] = useState<BerkasLKPDItem | null>(null);

  // Sync custom inputs when Bab dropdown changes in Generator
  const handleSelectBabChange = (id: string) => {
    setSelectedBabId(id);
    if (id !== "custom") {
      const bab = babPelajaran.find((b) => b.id === id);
      if (bab) {
        setCustomTopic(bab.judul);
        setCustomDesc(bab.deskripsi);
        setKelasId(bab.kelasId || "VII");
        setTargetBabForLms(bab.id);
        if (bab.lkpdData) {
          setGeneratedLKPD(bab.lkpdData);
        }
      }
    } else {
      setCustomTopic("");
      setCustomDesc("");
    }
  };

  // Run AI Generator
  const handleGenerateClick = () => {
    const topic = selectedBabId === "custom" ? customTopic : customTopic || babPelajaran.find(b => b.id === selectedBabId)?.judul || "";
    if (!topic.trim()) {
      alert("Silakan masukkan Judul Bab atau Topik Materi PAI terlebih dahulu!");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("1. Menganalisis Kurikulum Merdeka PAI & Elemen Pembelajaran...");

    setTimeout(() => {
      setGenerationStep("2. Menyusun Indikator TP, Pertanyaan Pemantik & Dalil Naqli...");
      setTimeout(() => {
        setGenerationStep("3. Merumuskan Aktivitas Kelompok & Soal HOTS Pilihan Ganda...");
        setTimeout(() => {
          setGenerationStep("4. Finalisasi Rubrik Penilaian KKTP & Format LKPD...");
          setTimeout(() => {
            const lkpd = generateAutomaticLKPD(topic, customDesc, {
              kelasId,
              semester,
              difficulty,
              jumlahSoal
            });
            setGeneratedLKPD(lkpd);
            setIsGenerating(false);
            setGenerationStep("");

            // Auto-sync LKPD and questions to active Bab in LMS
            const targetId = selectedBabId !== "custom" ? selectedBabId : targetBabForLms;
            const targetBab = babPelajaran.find((b) => b.id === targetId);
            if (targetBab) {
              const currentQuestions = targetBab.soalList || [];
              const mergedList = [...currentQuestions];
              lkpd.soalPilihanGanda.forEach((nq) => {
                if (!mergedList.some((q) => q.pertanyaan === nq.pertanyaan)) {
                  mergedList.push(nq);
                }
              });
              const updatedBabList = babPelajaran.map((b) => {
                if (b.id === targetBab.id) {
                  return {
                    ...b,
                    soalList: mergedList,
                    lkpdData: lkpd
                  };
                }
                return b;
              });
              onUpdateBabPelajaran(updatedBabList);
              DataService.saveBabPelajaran(updatedBabList);
              setSavedToLmsToast(`⚡ Alhamdulillah! Instrumen LKPD & ${lkpd.soalPilihanGanda.length} Soal PAI otomatis diterbitkan ke Ruang Kelas LMS ${targetBab.judul}.`);
              setTimeout(() => setSavedToLmsToast(null), 5000);
            }
          }, 400);
        }, 500);
      }, 500);
    }, 500);
  };

  // Convert LKPD to printable plain text
  const formatLKPDToText = (lkpd: LKPDItem): string => {
    let text = `====================================================\n`;
    text += `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI\n`;
    text += `UPT SMPN 2 REBANG TANGKAS\n`;
    text += `====================================================\n\n`;
    text += `Mata Pelajaran : PAI dan Budi Pekerti\n`;
    text += `Judul Bab      : ${lkpd.babJudul}\n`;
    text += `Kelas/Semester : Kelas ${lkpd.kelasId} / Semester ${lkpd.semester}\n`;
    text += `Elemen PAI     : ${lkpd.elemen}\n`;
    text += `Alokasi Waktu  : ${lkpd.alokasiWaktu}\n\n`;

    text += `----------------------------------------------------\n`;
    text += `I. CAPAIAN & TUJUAN PEMBELAJARAN\n`;
    text += `----------------------------------------------------\n`;
    text += `Capaian: ${lkpd.capaianPembelajaran}\n\nTujuan Pembelajaran:\n`;
    lkpd.tujuanPembelajaran.forEach((tp, i) => {
      text += `${i + 1}. ${tp}\n`;
    });

    text += `\n----------------------------------------------------\n`;
    text += `II. STIMULUS BACAAN & DALIL NAQLI\n`;
    text += `----------------------------------------------------\n`;
    text += `Judul: ${lkpd.stimulusBacaan.judul}\n`;
    text += `${lkpd.stimulusBacaan.teks}\n`;
    if (lkpd.stimulusBacaan.dalilNaqli) {
      text += `\nDalil Naqli:\n"${lkpd.stimulusBacaan.dalilNaqli.teksArab}"\n`;
      text += `Artinya: "${lkpd.stimulusBacaan.dalilNaqli.terjemahan}" (${lkpd.stimulusBacaan.dalilNaqli.sumber})\n`;
    }

    text += `\n----------------------------------------------------\n`;
    text += `III. AKTIVITAS KELOMPOK\n`;
    text += `----------------------------------------------------\n`;
    text += `Tugas: ${lkpd.aktivitasKelompok.judulTugas}\n`;
    text += `Instruksi: ${lkpd.aktivitasKelompok.instruksi}\n`;
    lkpd.aktivitasKelompok.pertanyaanDiskusi.forEach((p, i) => {
      text += `${i + 1}. ${p}\n`;
    });

    text += `\n----------------------------------------------------\n`;
    text += `IV. SOAL LATIHAN PILIHAN GANDA (${lkpd.soalPilihanGanda.length} SOAL)\n`;
    text += `----------------------------------------------------\n`;
    lkpd.soalPilihanGanda.forEach((s, i) => {
      text += `${i + 1}. ${s.pertanyaan}\n`;
      s.pilihan.forEach((p) => {
        text += `   ${p}\n`;
      });
      text += `   Kunci: ${s.jawabanBenar}\n\n`;
    });

    return text;
  };

  // Copy full LKPD text to clipboard
  const handleCopyText = () => {
    if (!generatedLKPD) return;
    const text = formatLKPDToText(generatedLKPD);
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Print view handler for generated LKPD
  const handlePrint = () => {
    window.print();
  };

  // Save generated questions to LMS Quiz Bank for students
  const handleSaveToLms = () => {
    if (!generatedLKPD || generatedLKPD.soalPilihanGanda.length === 0) return;

    const targetBab = babPelajaran.find((b) => b.id === targetBabForLms);
    if (!targetBab) {
      alert("Pilih Bab Pelajaran target di LMS terlebih dahulu!");
      return;
    }

    const currentQuestions = targetBab.soalList || [];
    const newQuestions = generatedLKPD.soalPilihanGanda;

    const mergedList = [...currentQuestions];
    newQuestions.forEach((nq) => {
      if (!mergedList.some((q) => q.pertanyaan === nq.pertanyaan)) {
        mergedList.push(nq);
      }
    });

    const updatedBabList = babPelajaran.map((b) => {
      if (b.id === targetBab.id) {
        return {
          ...b,
          soalList: mergedList,
          lkpdData: generatedLKPD
        };
      }
      return b;
    });

    onUpdateBabPelajaran(updatedBabList);
    DataService.saveBabPelajaran(updatedBabList);

    setSavedToLmsToast(`⚡ Alhamdulillah! Seluruh Instrumen LKPD & ${newQuestions.length} Soal PAI resmi berhasil diterbitkan ke Ruang Kelas LMS ${targetBab.judul}.`);
    setTimeout(() => setSavedToLmsToast(null), 5000);
  };

  // Archive AI Generated LKPD to Berkas Bank
  const handleArchiveGeneratedLKPD = () => {
    if (!generatedLKPD) return;
    const targetBab = babPelajaran.find(b => b.id === targetBabForLms);
    const newId = `lkpd-gen-${Date.now()}`;
    const cleanJudul = generatedLKPD.babJudul.replace(/^Bab\s*\d+\s*:\s*/i, "");
    const newBerkas: BerkasLKPDItem = {
      id: newId,
      namaBerkas: `LKPD-PAI-${generatedLKPD.kelasId}-${cleanJudul.replace(/[^a-zA-Z0-9]/g, "-")}.docx`,
      judulLkpd: `LKPD: ${generatedLKPD.babJudul}`,
      tipeFile: "docx",
      ukuran: "1.2 MB",
      tanggalUpload: new Date().toISOString().split("T")[0],
      babId: targetBab?.id || "umum",
      babJudul: generatedLKPD.babJudul,
      kelasId: generatedLKPD.kelasId,
      semester: generatedLKPD.semester,
      kategori: "Pembelajaran Berdiferensiasi",
      keterangan: `Instrumen LKPD Kurikulum Merdeka disusun otomatis mencakup CP, TP, Dalil Naqli, Diskusi Kelompok, ${generatedLKPD.soalPilihanGanda.length} Soal Kuis HOTS, dan Rubrik KKTP.`,
      textContent: formatLKPDToText(generatedLKPD),
      statusLms: "Diterbitkan",
      uploadedBy: guruNama
    };

    const updatedList = [newBerkas, ...berkasList];
    setBerkasList(updatedList);
    DataService.saveBerkasLKPD(updatedList);

    if (targetBab) {
      const currentAttached = targetBab.berkasLkpdList || [];
      const updatedAttached = [newBerkas, ...currentAttached.filter(b => b.id !== newBerkas.id)];
      const updatedBabList = babPelajaran.map(b => b.id === targetBab.id ? { ...b, berkasLkpdList: updatedAttached } : b);
      onUpdateBabPelajaran(updatedBabList);
      DataService.saveBabPelajaran(updatedBabList);
    }

    setSavedToLmsToast(`⚡ Dokumen LKPD resmi diarsipkan ke Bank Berkas LKPD dan diterbitkan ke LMS Siswa.`);
    setTimeout(() => setSavedToLmsToast(null), 5000);
  };

  // ==================== UPLOAD BERKAS FILE HANDLERS ====================
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Suggest clean title from filename
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ");
    setUploadJudulLkpd(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleProcessUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Silakan pilih atau seret berkas LKPD terlebih dahulu!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const fileName = selectedFile.name;
      const ext = fileName.split(".").pop()?.toLowerCase() || "";
      let fileType: BerkasLKPDItem["tipeFile"] = "other";
      if (ext === "pdf") fileType = "pdf";
      else if (ext === "docx") fileType = "docx";
      else if (ext === "doc") fileType = "doc";
      else if (ext === "xlsx") fileType = "xlsx";
      else if (ext === "xls") fileType = "xls";
      else if (ext === "pptx" || ext === "ppt") fileType = "pptx";
      else if (["png", "jpg", "jpeg", "webp"].includes(ext)) fileType = "image";
      else if (ext === "txt") fileType = "text";

      const sizeBytes = selectedFile.size;
      const sizeFormatted =
        sizeBytes < 1024 * 1024
          ? `${(sizeBytes / 1024).toFixed(1)} KB`
          : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;

      setUploadProgress(45);

      // Convert File to Data URL
      const dataUrl = await fileToDataUrl(selectedFile);
      setUploadProgress(70);

      // Parse text or HTML if DOCX / XLSX
      let parsedHtml: string | undefined = undefined;
      let textContent: string | undefined = undefined;

      if (ext === "docx") {
        try {
          const arrayBuffer = await fileToArrayBuffer(selectedFile);
          parsedHtml = await parseDocx(arrayBuffer);
        } catch (docxErr) {
          console.warn("Mammoth parse error:", docxErr);
        }
      } else if (ext === "xlsx" || ext === "xls") {
        try {
          const arrayBuffer = await fileToArrayBuffer(selectedFile);
          const sheets = parseExcel(arrayBuffer);
          if (sheets.length > 0 && sheets[0].html) {
            parsedHtml = sheets[0].html;
          }
        } catch (excelErr) {
          console.warn("Excel parse error:", excelErr);
        }
      }

      setUploadProgress(90);

      const targetBab = babPelajaran.find((b) => b.id === uploadBabId);
      const newBerkasId = `lkpd-file-${Date.now()}`;

      const newBerkas: BerkasLKPDItem = {
        id: newBerkasId,
        namaBerkas: fileName,
        judulLkpd: uploadJudulLkpd.trim() || fileName,
        tipeFile: fileType,
        ukuran: sizeFormatted,
        tanggalUpload: new Date().toISOString().split("T")[0],
        babId: uploadBabId,
        babJudul: targetBab ? targetBab.judul : "Materi PAI Terpadu / Umum",
        kelasId: uploadKelasId,
        semester: uploadSemester,
        kategori: uploadKategori,
        keterangan: uploadKeterangan.trim(),
        fileDataUrl: dataUrl,
        parsedHtml: parsedHtml,
        textContent: textContent,
        statusLms: uploadPublishLms ? "Diterbitkan" : "Draft",
        uploadedBy: guruNama
      };

      // Persist binary payload into IndexedDB
      await saveFileToIndexedDB(newBerkasId, {
        dataUrl,
        textContent: parsedHtml || textContent,
        fileName,
        mimeType: selectedFile.type
      });

      // Update local storage and state
      const updatedList = [newBerkas, ...berkasList];
      setBerkasList(updatedList);
      DataService.saveBerkasLKPD(updatedList);

      // Attach to target Bab in LMS
      if (targetBab) {
        const currentAttached = targetBab.berkasLkpdList || [];
        const updatedAttached = [newBerkas, ...currentAttached.filter((b) => b.id !== newBerkas.id)];
        const updatedBabPelajaran = babPelajaran.map((b) =>
          b.id === targetBab.id ? { ...b, berkasLkpdList: updatedAttached } : b
        );
        onUpdateBabPelajaran(updatedBabPelajaran);
        DataService.saveBabPelajaran(updatedBabPelajaran);
      }

      setUploadProgress(100);
      setIsUploading(false);
      setSelectedFile(null);
      setUploadJudulLkpd("");
      setUploadKeterangan("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      setUploadSuccessToast(
        `Alhamdulillah! Berkas LKPD "${newBerkas.judulLkpd}" (${newBerkas.ukuran}) berhasil diunggah${
          uploadPublishLms ? " dan langsung diterbitkan ke LMS Siswa!" : "."
        }`
      );
      setTimeout(() => setUploadSuccessToast(null), 6000);

      // Switch to Bank tab so teacher can immediately see the uploaded file
      setMainMode("bank");
    } catch (err) {
      console.error("Gagal mengunggah berkas LKPD:", err);
      alert("Terjadi kesalahan saat memproses berkas LKPD. Silakan coba kembali.");
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // ==================== BANK & ARSIP ACTIONS ====================
  const handleDeleteBerkas = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berkas LKPD ini?")) return;

    try {
      await deleteFileFromIndexedDB(id);
    } catch (e) {
      console.warn("Delete indexedDB error:", e);
    }

    const updatedList = berkasList.filter((b) => b.id !== id);
    setBerkasList(updatedList);
    DataService.saveBerkasLKPD(updatedList);

    // Also remove from babPelajaran.berkasLkpdList
    const updatedBabPelajaran = babPelajaran.map((b) => ({
      ...b,
      berkasLkpdList: (b.berkasLkpdList || []).filter((item) => item.id !== id)
    }));
    onUpdateBabPelajaran(updatedBabPelajaran);
    DataService.saveBabPelajaran(updatedBabPelajaran);
  };

  const handleTogglePublish = (id: string) => {
    const updatedList = berkasList.map((b) => {
      if (b.id === id) {
        const nextStatus = b.statusLms === "Diterbitkan" ? ("Draft" as const) : ("Diterbitkan" as const);
        return { ...b, statusLms: nextStatus };
      }
      return b;
    });
    setBerkasList(updatedList);
    DataService.saveBerkasLKPD(updatedList);

    // Sync to babPelajaran
    const updatedBabPelajaran = babPelajaran.map((b) => ({
      ...b,
      berkasLkpdList: (b.berkasLkpdList || []).map((item) =>
        item.id === id
          ? { ...item, statusLms: item.statusLms === "Diterbitkan" ? ("Draft" as const) : ("Diterbitkan" as const) }
          : item
      )
    }));
    onUpdateBabPelajaran(updatedBabPelajaran);
    DataService.saveBabPelajaran(updatedBabPelajaran);
  };

  const handleDownloadBerkas = async (berkas: BerkasLKPDItem) => {
    let url = berkas.fileDataUrl;
    if (!url) {
      try {
        const record = await getFileFromIndexedDB(berkas.id);
        if (record && record.dataUrl) {
          url = record.dataUrl;
        }
      } catch (e) {
        console.warn("IndexedDB load error:", e);
      }
    }

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = berkas.namaBerkas || `${berkas.judulLkpd}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const text = berkas.textContent || berkas.keterangan || berkas.judulLkpd;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = berkas.namaBerkas.endsWith(".txt") ? berkas.namaBerkas : `${berkas.namaBerkas}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handlePrintBerkas = (berkas: BerkasLKPDItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const contentHtml = berkas.parsedHtml
      ? berkas.parsedHtml
      : berkas.textContent
      ? `<pre style="font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11pt; line-height: 1.6;">${berkas.textContent}</pre>`
      : `<div style="padding: 20px; font-size: 11.5pt; line-height: 1.6;"><h3 style="margin-top:0;">${berkas.judulLkpd}</h3><p>${berkas.keterangan || "Lembar Kerja Peserta Didik Resmi Mata Pelajaran PAI & Budi Pekerti"}</p></div>`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${berkas.judulLkpd} - UPT SMPN 2 Rebang Tangkas</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Times New Roman', Times, serif; color: #111; margin: 0; padding: 0; }
          .kop { border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 18px; text-align: center; position: relative; }
          .kop-logo { position: absolute; left: 10px; top: 2px; width: 65px; height: 75px; object-fit: contain; }
          .kop h3 { margin: 0; font-size: 12pt; font-weight: normal; text-transform: uppercase; }
          .kop h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
          .kop p { margin: 0; font-size: 8.5pt; }
          .title { text-align: center; margin: 14px 0 10px 0; font-size: 13pt; font-weight: bold; text-decoration: underline; }
          .meta-table { width: 100%; margin-bottom: 16px; font-size: 10pt; border-collapse: collapse; }
          .meta-table td { padding: 3px 2px; vertical-align: top; }
          .content { font-size: 10.5pt; line-height: 1.6; }
          .table-bordered, table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
          .table-bordered td, .table-bordered th, table td, table th { border: 1px solid #333; padding: 5px 7px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="kop">
          <img src="${LOGO_WAY_KANAN}" class="kop-logo" alt="Logo Way Kanan" />
          <h3>Pemerintah Kabupaten Way Kanan</h3>
          <h3>Dinas Pendidikan dan Kebudayaan</h3>
          <h2>UPT SMP Negeri 2 Rebang Tangkas</h2>
          <p>Alamat: Jl. Poros Rebang Tangkas, Way Kanan, Lampung 34768 • Akreditasi B</p>
        </div>

        <div class="title">LEMBAR KERJA PESERTA DIDIK (LKPD) PAI &amp; BUDI PEKERTI</div>

        <table class="meta-table">
          <tr>
            <td style="width: 120px;"><strong>Mata Pelajaran</strong></td>
            <td style="width: 12px;">:</td>
            <td>Pendidikan Agama Islam &amp; Budi Pekerti</td>
            <td style="width: 110px;"><strong>Kelas / Sem</strong></td>
            <td style="width: 12px;">:</td>
            <td>Kelas ${berkas.kelasId} / Semester ${berkas.semester}</td>
          </tr>
          <tr>
            <td><strong>Bab Pelajaran</strong></td>
            <td>:</td>
            <td>${berkas.babJudul}</td>
            <td><strong>Kategori LKPD</strong></td>
            <td>:</td>
            <td>${berkas.kategori || "Praktik & Asesmen Formatif"}</td>
          </tr>
          <tr>
            <td><strong>Judul Dokumen</strong></td>
            <td>:</td>
            <td colspan="4"><strong>${berkas.judulLkpd}</strong></td>
          </tr>
        </table>

        <div class="content">
          ${contentHtml}
        </div>

        <div style="margin-top: 35px; display: table; width: 100%; font-size: 10.5pt;">
          <div style="display: table-cell; width: 50%;">
            <p>Mengetahui,<br/>Kepala UPT SMPN 2 Rebang Tangkas</p>
            <br/><br/><br/>
            <p><strong>Drs. H. Ahmad Dahlan, M.Pd.</strong><br/>NIP. 196805121994121001</p>
          </div>
          <div style="display: table-cell; width: 50%; text-align: right;">
            <p>Rebang Tangkas, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran PAI,</p>
            <br/><br/><br/>
            <p><strong>${berkas.uploadedBy || guruNama}</strong><br/>NIP. 197909172014071004</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered Berkas List
  const filteredBerkasList = berkasList.filter((b) => {
    const matchSearch =
      b.judulLkpd.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.namaBerkas.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.babJudul.toLowerCase().includes(bankSearch.toLowerCase());
    const matchBab = bankBabFilter === "Semua" || b.babId === bankBabFilter;
    const matchKelas = bankKelasFilter === "Semua" || b.kelasId === bankKelasFilter;
    const matchKategori = bankKategoriFilter === "Semua" || b.kategori === bankKategoriFilter;
    return matchSearch && matchBab && matchKelas && matchKategori;
  });

  const getFileBadgeColor = (type: BerkasLKPDItem["tipeFile"]) => {
    switch (type) {
      case "pdf":
        return "bg-red-50 text-red-700 border-red-200";
      case "docx":
      case "doc":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "xlsx":
      case "xls":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pptx":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "image":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedbacks */}
      {uploadSuccessToast && (
        <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-700 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{uploadSuccessToast}</span>
          </div>
          <button
            onClick={() => setUploadSuccessToast(null)}
            className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {savedToLmsToast && (
        <div className="p-4 bg-slate-900 text-amber-200 rounded-2xl border border-amber-500/50 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{savedToLmsToast}</span>
          </div>
          <button
            onClick={() => setSavedToLmsToast(null)}
            className="text-amber-400 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header Card with Navigation Tabs */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-emerald-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/60 rounded-full border border-emerald-600/40 text-[11px] font-black text-amber-300">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Instrumen LKPD & Asesmen Kurikulum Merdeka</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Soal & Lembar Kerja Peserta Didik (LKPD) PAI
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Pusat kelengkapan instrumen LKPD: Susun otomatis dengan kecerdasan buatan (AI) Kurikulum Merdeka atau unggah berkas LKPD resmi (Word/PDF/Excel) dan terbitkan langsung ke LMS peserta didik.
            </p>
          </div>

          {/* Quick Stats or Curriculum Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Total Berkas LKPD</span>
              <span className="text-base font-black text-amber-300">{berkasList.length} Berkas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Target Satuan</span>
              <span className="text-xs font-black text-emerald-200">SMPN 2 RT</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Switcher (Generator vs Upload vs Bank) */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 flex flex-wrap gap-2 relative z-10">
          <button
            onClick={() => setMainMode("generator")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              mainMode === "generator"
                ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                : "bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-100 border border-emerald-700/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Soal & LKPD (AI)</span>
          </button>

          <button
            onClick={() => setMainMode("upload")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer relative ${
              mainMode === "upload"
                ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                : "bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-100 border border-emerald-700/50"
            }`}
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>Upload Berkas LKPD</span>
            <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase">
              Fitur Baru
            </span>
          </button>

          <button
            onClick={() => setMainMode("bank")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              mainMode === "bank"
                ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                : "bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-100 border border-emerald-700/50"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Bank & Arsip Berkas LKPD ({berkasList.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: UPLOAD BERKAS LKPD (THE NEW REQUESTED FEATURE)                   */}
      {/* ========================================================================= */}
      {mainMode === "upload" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Upload Form Box */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-emerald-700" />
                    Form Unggah Berkas LKPD Resmi
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggah lembar kerja peserta didik buatan guru dalam format Word, PDF, Excel, atau PPT untuk diarsipkan dan didistribusikan ke LMS siswa.
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                  Otomatis Terbit di LMS
                </span>
              </div>

              {/* Drag & Drop File Upload Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? "border-emerald-600 bg-emerald-50/70"
                    : selectedFile
                    ? "border-emerald-500 bg-emerald-50/20"
                    : "border-slate-300 bg-slate-50/50 hover:border-emerald-500 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                />

                <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shadow-inner">
                  <FileUp className="w-7 h-7" />
                </div>

                <div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold">
                        Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk ganti berkas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-800">
                        Tarik & lepaskan berkas LKPD di sini, atau <span className="text-emerald-700 underline">pilih berkas</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Mendukung: Word (.docx/.doc), PDF (.pdf), Excel (.xlsx/.xls), PPT (.pptx), Teks, dan Gambar
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Progress Bar if active */}
                {isUploading && uploadProgress !== null && (
                  <div className="w-full max-w-sm space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>Memproses & Menyimpan Berkas...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Metadata LKPD */}
              <form onSubmit={handleProcessUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Judul LKPD */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Judul Lembar Kerja Peserta Didik (LKPD) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: LKPD Praktik Thaharah, Wudhu dan Tayamum"
                      value={uploadJudulLkpd}
                      onChange={(e) => setUploadJudulLkpd(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Pilih Bab Pelajaran Target */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Bab Pelajaran PAI Target *
                    </label>
                    <select
                      value={uploadBabId}
                      onChange={(e) => setUploadBabId(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      {babPelajaran.map((bab) => (
                        <option key={bab.id} value={bab.id}>
                          Kelas {bab.kelasId || "VII"} – {bab.judul}
                        </option>
                      ))}
                      <option value="umum">+ Berkas LKPD Tematik / Non-Bab</option>
                    </select>
                  </div>

                  {/* Kategori LKPD */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Kategori / Model LKPD *
                    </label>
                    <select
                      value={uploadKategori}
                      onChange={(e) => setUploadKategori(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Praktik Ibadah">Praktik Ibadah (Wudhu, Shalat, Sujud)</option>
                      <option value="Diskusi Kelompok">Diskusi & Penyelidikan Kelompok</option>
                      <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
                      <option value="Mandiri & Refleksi">Mandiri & Refleksi Karakter</option>
                      <option value="Asesmen Formatif">Asesmen Formatif & Portofolio</option>
                    </select>
                  </div>

                  {/* Kelas & Semester */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500">Kelas Target</label>
                      <select
                        value={uploadKelasId}
                        onChange={(e) => setUploadKelasId(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50"
                      >
                        <option value="VII">Kelas VII</option>
                        <option value="VIII">Kelas VIII</option>
                        <option value="IX">Kelas IX</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500">Semester</label>
                      <select
                        value={uploadSemester}
                        onChange={(e) => setUploadSemester(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50"
                      >
                        <option value="1">Semester 1 (Ganjil)</option>
                        <option value="2">Semester 2 (Genap)</option>
                      </select>
                    </div>
                  </div>

                  {/* LMS Publish Status */}
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="publishCheck"
                      checked={uploadPublishLms}
                      onChange={(e) => setUploadPublishLms(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <label htmlFor="publishCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Terbitkan langsung ke LMS Siswa (Dapat diakses & diunduh murid)
                    </label>
                  </div>

                  {/* Keterangan Tambahan / Petunjuk Kerja */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Petunjuk Pengerjaan / Catatan Guru untuk Siswa
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Kerjakan secara berkelompok (4-5 siswa), bawa mushaf Al-Qur'an dan amati tata cara bersuci..."
                      value={uploadKeterangan}
                      onChange={(e) => setUploadKeterangan(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadJudulLkpd("");
                      setUploadKeterangan("");
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Menyimpan Berkas...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-amber-300" />
                        <span>Simpan & Terbitkan Berkas LKPD</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Panduan & Tips Penyusunan LKPD */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3 border border-emerald-800">
                <div className="flex items-center gap-2 text-amber-300">
                  <Award className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Format Standar LKPD PAI</h4>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed font-medium">
                  Berdasarkan Panduan Pembelajaran & Asesmen Kurikulum Merdeka Kemendikbudristek, dokumen LKPD hendaknya memuat:
                </p>
                <ul className="text-[11px] text-emerald-200/90 space-y-1.5 list-disc pl-4 font-medium">
                  <li><strong>Identitas:</strong> Mapel PAI, Bab/Materi, Kelas, Alokasi Waktu.</li>
                  <li><strong>Tujuan Pembelajaran (TP):</strong> Rumusan capaian yang hendak dicapai.</li>
                  <li><strong>Stimulus:</strong> Dalil Al-Qur'an/Hadits, ilustrasi kasus, atau teks bacaan.</li>
                  <li><strong>Aktivitas Belajar:</strong> Panduan diskusi kelompok atau praktik ibadah.</li>
                  <li><strong>Rubrik Penilaian KKTP:</strong> Kriteria ketuntasan yang transparan.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  Kelebihan Format Berkas
                </h4>
                <div className="space-y-2 text-[11px] text-slate-600">
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <strong className="text-blue-900 block">📄 Word (.docx):</strong>
                    Otomatis diparse teksnya sehingga dapat langsung dipratinjau & dicetak di dalam aplikasi.
                  </div>
                  <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100">
                    <strong className="text-red-900 block">📑 PDF (.pdf):</strong>
                    Menjaga tata letak, kop surat, tabel penilaian, dan grafik persis seperti aslinya.
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 block">📊 Excel (.xlsx):</strong>
                    Cocok untuk lembar observasi penilaian sikap & skor rubrik praktikum.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: BANK & ARSIP BERKAS LKPD (BROWSE, PREVIEW, PRINT, DOWNLOAD)      */}
      {/* ========================================================================= */}
      {mainMode === "bank" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul LKPD, nama berkas, atau materi..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMainMode("upload")}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Berkas Baru</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-slate-500 whitespace-nowrap">Bab:</span>
                <select
                  value={bankBabFilter}
                  onChange={(e) => setBankBabFilter(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="Semua">Semua Bab Pelajaran</option>
                  {babPelajaran.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-slate-500 whitespace-nowrap">Kelas:</span>
                <select
                  value={bankKelasFilter}
                  onChange={(e) => setBankKelasFilter(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-slate-500 whitespace-nowrap">Kategori:</span>
                <select
                  value={bankKategoriFilter}
                  onChange={(e) => setBankKategoriFilter(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Praktik Ibadah">Praktik Ibadah</option>
                  <option value="Diskusi Kelompok">Diskusi Kelompok</option>
                  <option value="Pembelajaran Berdiferensiasi">Diferensiasi</option>
                  <option value="Mandiri & Refleksi">Mandiri & Refleksi</option>
                  <option value="Asesmen Formatif">Asesmen Formatif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredBerkasList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center flex flex-col items-center justify-center text-slate-400 space-y-3 shadow-sm">
              <FolderOpen className="w-12 h-12 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">Tidak ada berkas LKPD ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Coba sesuaikan kata kunci pencarian atau unggah berkas LKPD baru menggunakan tombol di atas.
              </p>
              <button
                onClick={() => setMainMode("upload")}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                + Upload Berkas Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBerkasList.map((berkas) => (
                <div
                  key={berkas.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Card: Badges & LMS Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getFileBadgeColor(
                          berkas.tipeFile
                        )}`}
                      >
                        {berkas.tipeFile.toUpperCase()} • {berkas.ukuran}
                      </span>

                      <button
                        onClick={() => handleTogglePublish(berkas.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition cursor-pointer flex items-center gap-1 ${
                          berkas.statusLms === "Diterbitkan"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-slate-100 text-slate-600 border-slate-300"
                        }`}
                        title="Klik untuk mengubah status terbit di LMS"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{berkas.statusLms || "Diterbitkan"}</span>
                      </button>
                    </div>

                    {/* Title & Metadata */}
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {berkas.judulLkpd}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                        📄 {berkas.namaBerkas}
                      </p>
                    </div>

                    {/* Badges Info */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        Kelas {berkas.kelasId} / Sem {berkas.semester}
                      </span>
                      {berkas.kategori && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                          {berkas.kategori}
                        </span>
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-semibold text-slate-600 line-clamp-2">
                      <strong className="text-slate-900">Materi:</strong> {berkas.babJudul}
                    </div>

                    {berkas.keterangan && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic font-medium">
                        "{berkas.keterangan}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => setPreviewBerkas(berkas)}
                      className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                      title="Lihat Pratinjau Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>

                    <button
                      onClick={() => handlePrintBerkas(berkas)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Cetak Berkas Resmi A4"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDownloadBerkas(berkas)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Unduh Berkas Asli"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteBerkas(berkas.id)}
                      className="p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition"
                      title="Hapus Berkas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: GENERATE SOAL & LKPD (AI) (EXISTING POWERFUL GENERATOR)          */}
      {/* ========================================================================= */}
      {mainMode === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pengaturan Parameter AI
              </h3>
            </div>

            {/* Bab Selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-700">
                Pilih Bab Pelajaran PAI *
              </label>
              <select
                value={selectedBabId}
                onChange={(e) => handleSelectBabChange(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-bold bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                {babPelajaran.map((bab) => (
                  <option key={bab.id} value={bab.id}>
                    Kelas {bab.kelasId || "VII"} – {bab.judul}
                  </option>
                ))}
                <option value="custom">+ Tulis Bab / Topik Khusus Manual</option>
              </select>
            </div>

            {/* Custom Topic Input if Custom Selected */}
            {selectedBabId === "custom" && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Judul Bab / Topik *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bab 4 Sujud Syukur, Sahwi, dan Tilawah"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Deskripsi Ringkas Materi</label>
                  <textarea
                    placeholder="Ringkasan materi atau tujuan utama..."
                    rows={2}
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 font-medium bg-white"
                  />
                </div>
              </div>
            )}

            {/* Grid Options */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Kelas Target</label>
                <select
                  value={kelasId}
                  onChange={(e) => setKelasId(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Tingkat Kesulitan</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50 text-emerald-800"
                >
                  <option value="Mudah">Mudah (Pemahaman)</option>
                  <option value="Sedang">Sedang (Aplikasi)</option>
                  <option value="HOTS">HOTS (Analisis Tinggi)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Jumlah Soal Kuis</label>
                <select
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold bg-slate-50"
                >
                  <option value={3}>3 Soal Singkat</option>
                  <option value={5}>5 Soal Standar (Rekomendasi)</option>
                  <option value={8}>8 Soal Komprehensif</option>
                  <option value={10}>10 Soal Ujian</option>
                </select>
              </div>
            </div>

            {/* Action Execution Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Menyusun LKPD & Soal AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Generate Soal & LKPD Otomatis</span>
                  </>
                )}
              </button>
            </div>

            {/* Generating Loader Step */}
            {isGenerating && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-[11px] font-semibold space-y-1 animate-pulse">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span className="font-extrabold">Proses Generasi AI Berjalan...</span>
                </div>
                <p className="text-[10px] text-emerald-700 leading-tight">{generationStep}</p>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[10px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Informasi Output
              </span>
              <p>
                Hasil generasi mencakup struktur dokumen LKPD lengkap (Identitas, CP, TP, Stimulus Dalil Naqli, Diskusi Kelompok, Soal Kuis, Refleksi Karakter, & Rubrik KKTP).
              </p>
            </div>
          </div>

          {/* Right Column: Display Generated Result */}
          <div className="lg:col-span-2 space-y-4">
            {!generatedLKPD ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center text-slate-400 space-y-3 shadow-sm min-h-[420px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-2xl border border-emerald-100">
                  📝
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Belum Ada Dokumen Ditampilkan</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Pilih Bab Pelajaran di sebelah kiri lalu klik <span className="font-bold text-emerald-700">"Generate Soal & LKPD Otomatis"</span> atau beralih ke tab <span className="font-bold text-emerald-700" onClick={() => setMainMode("upload")}>"Upload Berkas LKPD"</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                {/* Output Action Header */}
                <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 print:hidden">
                  {/* Result Tabs */}
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveResultTab("lkpd")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                        activeResultTab === "lkpd"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Dokumen LKPD
                    </button>
                    <button
                      onClick={() => setActiveResultTab("soal")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
                        activeResultTab === "soal"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <BookOpenCheck className="w-3.5 h-3.5 text-amber-300" />
                      Kuis ({generatedLKPD.soalPilihanGanda.length} Soal)
                    </button>
                  </div>

                  {/* Document Actions toolbar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleArchiveGeneratedLKPD}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
                      title="Arsipkan ke Bank Berkas LKPD"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                      <span>Arsipkan ke Bank LKPD</span>
                    </button>

                    <button
                      onClick={handleCopyText}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
                      title="Salin Seluruh Teks ke Clipboard"
                    >
                      {copiedNotification ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
                      title="Cetak Berkas LKPD"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak</span>
                    </button>
                  </div>
                </div>

                {/* Target LMS Quick Save Box */}
                <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-semibold print:hidden">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Simpan Soal Kuis ke LMS Siswa Bab:</span>
                    <select
                      value={targetBabForLms}
                      onChange={(e) => setTargetBabForLms(e.target.value)}
                      className="p-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-slate-800"
                    >
                      {babPelajaran.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.judul}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSaveToLms}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Soal ke LMS Siswa</span>
                  </button>
                </div>

                {/* Document Content Sheet */}
                <div className="p-6 md:p-8 space-y-6 text-slate-800 text-xs leading-relaxed max-h-[650px] overflow-y-auto">
                  {activeResultTab === "lkpd" ? (
                    /* TAB 1: FORMATED LKPD WORKSHEET */
                    <div className="space-y-6 font-sans">
                      {/* Header Kop */}
                      <div className="border-b-2 border-slate-900 pb-4">
                        <div className="flex items-center justify-between gap-4">
                          <img
                            src={LOGO_WAY_KANAN}
                            alt="Logo Kabupaten Way Kanan"
                            className="w-14 h-auto max-h-18 object-contain shrink-0"
                          />
                          <div className="text-center space-y-1 flex-1">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN &amp; KEBUDAYAAN
                            </h4>
                            <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                              LEMBAR KERJA PESERTA DIDIK (LKPD) PAI &amp; BUDI PEKERTI
                            </h2>
                            <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                              UPT SMP NEGERI 2 REBANG TANGKAS – KURIKULUM MERDEKA
                            </h3>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Alamat: Jl. Poros Rebang Tangkas, Way Kanan, Lampung 34768
                            </p>
                          </div>
                          <div className="w-14 shrink-0 text-right text-[10px] font-bold text-slate-400">
                            Fase D
                          </div>
                        </div>
                      </div>

                      {/* Identitas Dokumen Table */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Kelas / Semester:</span>
                          <strong className="text-slate-900">Kelas {generatedLKPD.kelasId} / Semester {generatedLKPD.semester}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Materi Pokok:</span>
                          <strong className="text-emerald-800">{generatedLKPD.babJudul}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Elemen PAI:</span>
                          <strong className="text-slate-900">{generatedLKPD.elemen}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Alokasi Waktu:</span>
                          <strong className="text-slate-900">{generatedLKPD.alokasiWaktu}</strong>
                        </div>
                      </div>

                      {/* I. Capaian & Tujuan Pembelajaran */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                          <span>I. Capaian &amp; Tujuan Pembelajaran</span>
                        </h4>
                        <p className="text-slate-700">
                          <strong>Capaian Pembelajaran (CP):</strong> {generatedLKPD.capaianPembelajaran}
                        </p>
                        <div className="pt-1">
                          <strong className="text-slate-900 block mb-1">Tujuan Pembelajaran (TP):</strong>
                          <ul className="list-decimal pl-5 space-y-1 text-slate-700">
                            {generatedLKPD.tujuanPembelajaran.map((tp, i) => (
                              <li key={i}>{tp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* II. Petunjuk Kerja */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                          <span>II. Petunjuk Kerja Siswa</span>
                        </h4>
                        <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                          {generatedLKPD.petunjukKerja.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ol>
                      </div>

                      {/* III. Stimulus Bacaan & Dalil Naqli */}
                      <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70">
                        <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
                          <span>III. Stimulus &amp; Dalil Naqli</span>
                        </h4>
                        <h5 className="font-bold text-slate-900 text-xs">{generatedLKPD.stimulusBacaan.judul}</h5>
                        <p className="text-slate-700 leading-relaxed font-medium">{generatedLKPD.stimulusBacaan.teks}</p>

                        {generatedLKPD.stimulusBacaan.dalilNaqli && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-200 text-center space-y-1">
                            <p className="font-serif text-sm font-bold text-slate-900 leading-loose">
                              {generatedLKPD.stimulusBacaan.dalilNaqli.teksArab}
                            </p>
                            <p className="text-[11px] italic text-slate-600">
                              "{generatedLKPD.stimulusBacaan.dalilNaqli.terjemahan}"
                            </p>
                            <p className="text-[10px] font-bold text-emerald-800">
                              ({generatedLKPD.stimulusBacaan.dalilNaqli.sumber})
                            </p>
                          </div>
                        )}
                      </div>

                      {/* IV. Aktivitas Kelompok */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                          <span>IV. Lembar Diskusi &amp; Penyelidikan Kelompok</span>
                        </h4>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <h5 className="font-extrabold text-slate-900">{generatedLKPD.aktivitasKelompok.judulTugas}</h5>
                          <p className="text-slate-700 font-medium">{generatedLKPD.aktivitasKelompok.instruksi}</p>
                          <div className="pt-2 space-y-1.5">
                            <span className="block font-bold text-slate-800 text-[11px]">Pertanyaan Diskusi:</span>
                            {generatedLKPD.aktivitasKelompok.pertanyaanDiskusi.map((q, idx) => (
                              <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200">
                                <span className="font-bold text-emerald-800 mr-2">{idx + 1}.</span>
                                <span className="text-slate-800 font-medium">{q}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* V. Pertanyaan Mandiri HOTS */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                          <span>V. Pertanyaan Mandiri Penalaran Kritis (HOTS)</span>
                        </h4>
                        <div className="space-y-2">
                          {generatedLKPD.aktivitasMandiri.pertanyaanHots.map((q, idx) => (
                            <div key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
                              <p className="font-bold text-slate-800">
                                <span className="text-amber-800 mr-1.5">{idx + 1}.</span>
                                {q}
                              </p>
                              <div className="h-12 border-b border-dashed border-amber-300 w-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* VI. Rubrik Penilaian KKTP */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                          <span>VI. Rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</span>
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px] border border-slate-200 text-left">
                            <thead className="bg-slate-100 text-slate-700">
                              <tr>
                                <th className="p-2 border border-slate-200">Aspek Penilaian</th>
                                <th className="p-2 border border-slate-200">Sangat Mahir (4)</th>
                                <th className="p-2 border border-slate-200">Mahir (3)</th>
                                <th className="p-2 border border-slate-200">Cukup (2)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedLKPD.rubrikPenilaian.map((r, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-2 border border-slate-200 font-bold text-slate-900">{r.aspek}</td>
                                  <td className="p-2 border border-slate-200 text-slate-700">{r.skor4}</td>
                                  <td className="p-2 border border-slate-200 text-slate-700">{r.skor3}</td>
                                  <td className="p-2 border border-slate-200 text-slate-700">{r.skor2}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* TAB 2: QUIZ QUESTIONS LIST */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpenCheck className="w-4 h-4 text-emerald-700" />
                          Daftar Soal Kuis Pilihan Ganda ({generatedLKPD.soalPilihanGanda.length} Soal)
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Tingkat: {difficulty} • Kelas {generatedLKPD.kelasId}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {generatedLKPD.soalPilihanGanda.map((soal, sIdx) => (
                          <div key={soal.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex items-start gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                {sIdx + 1}
                              </span>
                              <p className="text-xs font-bold text-slate-900 leading-relaxed pt-0.5">
                                {soal.pertanyaan}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                              {soal.pilihan.map((opt, optIdx) => {
                                const letter = String.fromCharCode(65 + optIdx);
                                const isCorrect = soal.jawabanBenar === letter || opt.startsWith(letter + ".");
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2.5 rounded-lg border text-xs font-semibold ${
                                      isCorrect
                                        ? "bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold"
                                        : "bg-white border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    {opt}
                                    {isCorrect && (
                                      <span className="ml-2 text-[10px] font-black text-emerald-800 uppercase">
                                        ✓ Kunci
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {soal.pembahasan && (
                              <div className="ml-8 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                                <span className="font-extrabold block uppercase tracking-wider text-[9px] text-amber-800">
                                  💡 Pembahasan Fiqih/Pelajaran:
                                </span>
                                <p className="font-medium">{soal.pembahasan}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW BERKAS LKPD (INTERACTIVE VIEWER)                           */}
      {/* ========================================================================= */}
      {previewBerkas && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black truncate max-w-lg">
                    {previewBerkas.judulLkpd}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {previewBerkas.namaBerkas} • {previewBerkas.ukuran} • Kelas {previewBerkas.kelasId} ({previewBerkas.kategori || "LKPD"})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintBerkas(previewBerkas)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak A4</span>
                </button>

                <button
                  onClick={() => handleDownloadBerkas(previewBerkas)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>

                <button
                  onClick={() => setPreviewBerkas(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Area */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {/* Kop Surat SMPN 2 Rebang Tangkas */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
                  <img
                    src={LOGO_WAY_KANAN}
                    alt="Logo Way Kanan"
                    className="w-14 h-auto max-h-16 object-contain shrink-0"
                  />
                  <div className="text-center space-y-0.5 flex-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN &amp; KEBUDAYAAN
                    </h4>
                    <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                      LEMBAR KERJA PESERTA DIDIK (LKPD) PAI &amp; BUDI PEKERTI
                    </h2>
                    <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                      UPT SMP NEGERI 2 REBANG TANGKAS – KURIKULUM MERDEKA
                    </h3>
                  </div>
                  <div className="w-14 text-right text-[10px] font-bold text-slate-400">
                    Resmi
                  </div>
                </div>

                {/* Metadata Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-bold">Materi Bab:</span>
                    <strong className="text-slate-900">{previewBerkas.babJudul}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Kelas / Semester:</span>
                    <strong className="text-slate-900">Kelas {previewBerkas.kelasId} / Semester {previewBerkas.semester}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Kategori LKPD:</span>
                    <strong className="text-emerald-800">{previewBerkas.kategori || "Praktik & Asesmen"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Status LMS:</span>
                    <strong className={previewBerkas.statusLms === "Diterbitkan" ? "text-emerald-700 font-black" : "text-amber-700"}>
                      {previewBerkas.statusLms || "Diterbitkan"}
                    </strong>
                  </div>
                </div>

                {/* Content Renderer */}
                <div className="pt-2 space-y-4">
                  {previewBerkas.parsedHtml ? (
                    <div
                      className="prose prose-sm max-w-none text-xs text-slate-800 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: previewBerkas.parsedHtml }}
                    />
                  ) : previewBerkas.fileDataUrl && previewBerkas.tipeFile === "pdf" ? (
                    <div className="w-full h-[550px] rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                      <iframe
                        src={previewBerkas.fileDataUrl}
                        className="w-full h-full border-0"
                        title={previewBerkas.judulLkpd}
                      />
                    </div>
                  ) : previewBerkas.fileDataUrl && previewBerkas.tipeFile === "image" ? (
                    <div className="text-center p-4 bg-slate-100 rounded-xl border border-slate-200">
                      <img
                        src={previewBerkas.fileDataUrl}
                        alt={previewBerkas.judulLkpd}
                        className="max-h-[500px] max-w-full mx-auto rounded-lg shadow-sm object-contain"
                      />
                    </div>
                  ) : previewBerkas.textContent ? (
                    <pre className="font-sans whitespace-pre-wrap text-xs text-slate-800 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200">
                      {previewBerkas.textContent}
                    </pre>
                  ) : (
                    <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        Berkas ({previewBerkas.namaBerkas}) tersimpan dengan aman.
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                        Gunakan tombol "Unduh Berkas" atau "Cetak A4" di pojok kanan atas untuk membuka berkas asli pada perangkat Anda.
                      </p>
                    </div>
                  )}

                  {previewBerkas.keterangan && (
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-950">
                      <strong>Catatan / Petunjuk Guru:</strong> {previewBerkas.keterangan}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                Diupload oleh: <strong>{previewBerkas.uploadedBy || guruNama}</strong> • {previewBerkas.tanggalUpload}
              </span>
              <button
                onClick={() => setPreviewBerkas(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
