/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Copy,
  Printer,
  Eye,
  BookMarked,
  Video,
  Presentation,
  CheckCircle2,
  Share2,
  ChevronRight,
  GraduationCap,
  Calendar,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Library,
  Bookmark,
  Award,
  BookCheck,
  Compass,
  File
} from "lucide-react";
import {
  LIST_BUKU_PAI_KEMENDIKBUD,
  BabPelajaranData,
  BukuPelajaranData,
  ElemenCPType
} from "../../data/bukuPaiKemendikbud";
import { BahanAjarItem } from "../../types";
import { DataService } from "../../data/initialData";
import { LOGO_WAY_KANAN } from "../../assets/logoWayKananBase64";

interface BahanAjarProps {
  onNavigateToPerangkat?: () => void;
}

export default function BahanAjarView({ onNavigateToPerangkat }: BahanAjarProps) {
  // State for Bahan Ajar Items (from DataService / localStorage)
  const [items, setItems] = useState<BahanAjarItem[]>(() => DataService.getBahanAjar());

  // Active Grade / Class Tab
  const [activeKelas, setActiveKelas] = useState<"VII" | "VIII" | "IX" | "koleksi">("VII");

  // Filters
  const [filterSemester, setFilterSemester] = useState<string>("Semua");
  const [filterElemen, setFilterElemen] = useState<string>("Semua");
  const [filterKategori, setFilterKategori] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Reader State for Bab Pelajaran
  const [readingBab, setReadingBab] = useState<{
    bab: BabPelajaranData;
    buku: BukuPelajaranData;
  } | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");

  // Dedicated Print Modal States
  const [printModalBab, setPrintModalBab] = useState<{
    bab: BabPelajaranData;
    buku: BukuPelajaranData;
  } | null>(null);
  const [printModalItem, setPrintModalItem] = useState<BahanAjarItem | null>(null);

  // Modal Add / Edit Custom Bahan Ajar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BahanAjarItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<BahanAjarItem | null>(null);

  // Form State for Add / Edit
  const [formItem, setFormItem] = useState<{
    judul: string;
    kelas: "VII" | "VIII" | "IX" | "Semua";
    semester: "1" | "2" | "Semua";
    bab: string;
    kategori: BahanAjarItem["kategori"];
    elemenCP: BahanAjarItem["elemenCP"];
    deskripsi: string;
    fileSize: string;
    mediaType: NonNullable<BahanAjarItem["mediaType"]>;
    downloadUrl: string;
    textContent: string;
    author: string;
  }>({
    judul: "",
    kelas: "VII",
    semester: "1",
    bab: "Bab 1",
    kategori: "Diktat / Modul",
    elemenCP: "Al-Qur'an dan Hadis",
    deskripsi: "",
    fileSize: "1.5 MB",
    mediaType: "PDF",
    downloadUrl: "",
    textContent: "",
    author: "Guru PAI SMP"
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Active Buku Pelajaran based on selected Grade
  const currentBuku = useMemo(() => {
    return LIST_BUKU_PAI_KEMENDIKBUD.find((b) => b.kelas === activeKelas) || LIST_BUKU_PAI_KEMENDIKBUD[0];
  }, [activeKelas]);

  // Filtered Bab List for the selected grade
  const filteredBabList = useMemo(() => {
    if (!currentBuku) return [];
    return currentBuku.babList.filter((bab) => {
      // Semester Filter
      if (filterSemester !== "Semua") {
        if (filterSemester === "1" && bab.semester !== 1) return false;
        if (filterSemester === "2" && bab.semester !== 2) return false;
      }
      // Elemen Filter
      if (filterElemen !== "Semua" && bab.elemenCP !== filterElemen) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inJudul = bab.judulBab.toLowerCase().includes(q);
        const inCapaian = bab.capaianPembelajaran.toLowerCase().includes(q);
        const inMateri = bab.materiPokok.some((m) => m.toLowerCase().includes(q));
        const inRingkasan = bab.ringkasan.toLowerCase().includes(q);
        const inBabNomor = `bab ${bab.babNomor}`.includes(q);
        if (!inJudul && !inCapaian && !inMateri && !inRingkasan && !inBabNomor) {
          return false;
        }
      }
      return true;
    });
  }, [currentBuku, filterSemester, filterElemen, searchQuery]);

  // Filtered Media / Berkas Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeKelas !== "koleksi" && item.kelas !== activeKelas && item.kelas !== "Semua") {
        return false;
      }
      if (filterSemester !== "Semua" && item.semester !== filterSemester && item.semester !== "Semua") {
        return false;
      }
      if (filterElemen !== "Semua" && item.elemenCP !== filterElemen && item.elemenCP !== "Umum") {
        return false;
      }
      if (filterKategori !== "Semua" && item.kategori !== filterKategori) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inJudul = item.judul.toLowerCase().includes(q);
        const inDeskripsi = item.deskripsi.toLowerCase().includes(q);
        const inBab = (item.bab || "").toLowerCase().includes(q);
        if (!inJudul && !inDeskripsi && !inBab) return false;
      }
      return true;
    });
  }, [items, activeKelas, filterSemester, filterElemen, filterKategori, searchQuery]);

  // Handle Save New or Edited Item
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.judul.trim()) return;

    if (editingItem) {
      // Update existing item
      const updated: BahanAjarItem = {
        ...editingItem,
        judul: formItem.judul,
        kelas: formItem.kelas,
        semester: formItem.semester,
        bab: formItem.bab,
        kategori: formItem.kategori,
        elemenCP: formItem.elemenCP,
        deskripsi: formItem.deskripsi,
        fileSize: formItem.fileSize,
        mediaType: formItem.mediaType,
        downloadUrl: formItem.downloadUrl,
        textContent: formItem.textContent,
        author: formItem.author
      };
      const newItems = items.map((it) => (it.id === editingItem.id ? updated : it));
      setItems(newItems);
      DataService.saveBahanAjar(newItems);
      setEditingItem(null);
      showToast("Bahan ajar berhasil diperbarui!");
    } else {
      // Create new item
      const newItem: BahanAjarItem = {
        id: `ba-custom-${Date.now()}`,
        judul: formItem.judul,
        kelas: formItem.kelas,
        semester: formItem.semester,
        bab: formItem.bab,
        kategori: formItem.kategori,
        elemenCP: formItem.elemenCP,
        deskripsi: formItem.deskripsi,
        fileSize: formItem.fileSize || "1.0 MB",
        mediaType: formItem.mediaType,
        downloadUrl: formItem.downloadUrl,
        textContent: formItem.textContent,
        author: formItem.author || "Guru PAI",
        isCustom: true,
        createdAt: new Date().toISOString().split("T")[0]
      };
      const newItems = [newItem, ...items];
      setItems(newItems);
      DataService.saveBahanAjar(newItems);
      showToast("Bahan ajar baru berhasil ditambahkan!");
    }
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (it: BahanAjarItem) => {
    setEditingItem(it);
    setFormItem({
      judul: it.judul,
      kelas: it.kelas,
      semester: it.semester,
      bab: it.bab || "Bab 1",
      kategori: it.kategori,
      elemenCP: it.elemenCP,
      deskripsi: it.deskripsi,
      fileSize: it.fileSize || "1.5 MB",
      mediaType: it.mediaType || "PDF",
      downloadUrl: it.downloadUrl || "",
      textContent: it.textContent || "",
      author: it.author || "Guru PAI"
    });
    setIsAddModalOpen(true);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const newItems = items.filter((it) => it.id !== deletingItem.id);
    setItems(newItems);
    DataService.saveBahanAjar(newItems);
    setDeletingItem(null);
    showToast("Bahan ajar berhasil dihapus.");
  };

  // Helper Copy Ringkasan Bab to Clipboard
  const handleCopyBabSummary = (bab: BabPelajaranData) => {
    let summaryText = `*RINGKASAN BAHAN AJAR PAI & BUDI PEKERTI*\n`;
    summaryText += `*SMP KELAS ${currentBuku.kelas} - SEMESTER ${bab.semester}*\n`;
    summaryText += `-----------------------------------------\n`;
    summaryText += `*BAB ${bab.babNomor}: ${bab.judulBab}*\n`;
    summaryText += `Elemen CP: ${bab.elemenCP}\n\n`;
    summaryText += `*Capaian Pembelajaran:*\n${bab.capaianPembelajaran}\n\n`;
    summaryText += `*Materi Pokok:*\n${bab.materiPokok.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\n`;
    summaryText += `*Ringkasan Materi:*\n${bab.ringkasan}\n\n`;

    if (bab.dalilAyat && bab.dalilAyat.length > 0) {
      summaryText += `*Dalil Al-Qur'an / Hadits:*\n`;
      bab.dalilAyat.forEach((d) => {
        summaryText += `${d.surah}: ${d.ayat}\n"${d.arti}"\n\n`;
      });
    }

    if (bab.bahanAjarLengkap?.hikmahKarakter) {
      summaryText += `*Hikmah Karakter Profil Pelajar Pancasila:*\n${bab.bahanAjarLengkap.hikmahKarakter}\n`;
    }

    navigator.clipboard.writeText(summaryText);
    showToast(`Rangkuman Bab ${bab.babNomor} disalin ke clipboard!`);
  };

  // Open Print Modal for Bab Modul
  const handleOpenPrintBab = (bab: BabPelajaranData, buku: BukuPelajaranData) => {
    setPrintModalItem(null);
    setPrintModalBab({ bab, buku });
    showToast(`Membuka dokumen cetak Bab ${bab.babNomor}...`);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.log("Print preview ready", e);
      }
    }, 450);
  };

  // Open Print Modal for Custom Bahan Ajar Item
  const handleOpenPrintItem = (item: BahanAjarItem) => {
    setPrintModalBab(null);
    setPrintModalItem(item);
    showToast(`Membuka dokumen cetak: ${item.judul}...`);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.log("Print preview ready", e);
      }
    }, 450);
  };

  // Direct print execution
  const handleExecutePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error("Print error:", err);
      if (printModalBab) {
        handleOpenInNewWindowBab(printModalBab.bab, printModalBab.buku);
      } else if (printModalItem) {
        handleOpenInNewWindowItem(printModalItem);
      }
    }
  };

  // Print Bab Modul via hidden iframe or modal
  const handlePrintBab = (bab: BabPelajaranData, buku: BukuPelajaranData) => {
    // Open dedicated print preview modal which is robust across browsers and iframes
    handleOpenPrintBab(bab, buku);
  };

  // Hidden legacy frame printer (optional fallback)
  const legacyFramePrint = (bab: BabPelajaranData, buku: BukuPelajaranData) => {
    const oldFrame = document.getElementById("document-print-frame");
    if (oldFrame && oldFrame.parentNode) {
      oldFrame.parentNode.removeChild(oldFrame);
    }

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "1px";
    printFrame.style.height = "1px";
    printFrame.style.opacity = "0.01";
    printFrame.style.border = "0";
    printFrame.style.pointerEvents = "none";
    printFrame.setAttribute("id", "document-print-frame");
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (!frameDoc) {
      window.print();
      return;
    }

    const subMateriHtml = bab.bahanAjarLengkap?.subMateri
      ? bab.bahanAjarLengkap.subMateri
          .map(
            (s, idx) => `
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h3 style="font-size: 13pt; color: #064e3b; margin: 0 0 8px 0; border-bottom: 1.5px solid #10b981; padding-bottom: 4px;">
              Sub-Bab ${idx + 1}: ${s.judul}
            </h3>
            <p style="text-align: justify; line-height: 1.6; margin: 0 0 10px 0; color: #1e293b;">
              ${s.konten}
            </p>
            ${
              s.poinPenting && s.poinPenting.length > 0
                ? `
              <div style="background: #f8fafc; border-left: 3px solid #10b981; padding: 8px 12px; margin: 8px 0;">
                <strong style="font-size: 10pt; color: #0f172a;">Poin Kunci Pembelajaran:</strong>
                <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 10pt; color: #334155; line-height: 1.5;">
                  ${s.poinPenting.map((p) => `<li>${p}</li>`).join("")}
                </ul>
              </div>
            `
                : ""
            }
          </div>
        `
          )
          .join("")
      : `<p style="line-height: 1.6;">${bab.ringkasan}</p>`;

    const dalilHtml =
      bab.dalilAyat && bab.dalilAyat.length > 0
        ? `
      <div style="margin: 18px 0; background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 14px;">
        <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 11pt;">Dalil Naqli Rujukan (Al-Qur'an & Hadits)</h4>
        ${bab.dalilAyat
          .map(
            (d) => `
          <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #6ee7b7;">
            <div style="font-weight: bold; color: #047857; font-size: 10pt; margin-bottom: 4px;">${d.surah} Ayat ${d.ayat}:</div>
            <div style="font-size: 16pt; font-family: 'Amiri', 'Traditional Arabic', serif; text-align: right; line-height: 2; color: #064e3b; margin: 6px 0;">${d.teksArab}</div>
            <div style="font-size: 9.5pt; color: #1f2937; font-style: italic; line-height: 1.5;">Artinya: "${d.arti}"</div>
          </div>
        `
          )
          .join("")}
      </div>
    `
        : "";

    const aktivitasHtml =
      bab.bahanAjarLengkap?.aktivitasSiswa && bab.bahanAjarLengkap.aktivitasSiswa.length > 0
        ? `
      <div style="margin: 18px 0; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 12px;">
        <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 11pt;">Aktivitas Pembelajaran / Diskusi Siswa</h4>
        <ol style="margin: 0 0 0 18px; padding: 0; font-size: 10pt; color: #78350f; line-height: 1.5;">
          ${bab.bahanAjarLengkap.aktivitasSiswa.map((a) => `<li style="margin-bottom: 4px;">${a}</li>`).join("")}
        </ol>
      </div>
    `
        : "";

    const hikmahHtml = bab.bahanAjarLengkap?.hikmahKarakter
      ? `
      <div style="margin: 18px 0; background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 12px;">
        <h4 style="margin: 0 0 6px 0; color: #1e40af; font-size: 11pt;">Hikmah Karakter Profil Pelajar Pancasila</h4>
        <p style="margin: 0; font-size: 10pt; color: #1e3a8a; line-height: 1.5;">${bab.bahanAjarLengkap.hikmahKarakter}</p>
      </div>
    `
      : "";

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bahan Ajar PAI - Bab ${bab.babNomor} ${bab.judulBab}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; line-height: 1.4; margin: 0; padding: 0; }
          .kop-table { width: 100%; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
          .kop-title-1 { font-size: 12pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 0; }
          .kop-title-2 { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 2px 0; }
          .kop-title-3 { font-size: 11pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 0; }
          .kop-sub { font-size: 9pt; text-align: center; font-style: italic; margin-top: 2px; }
          .title-box { text-align: center; margin: 14px 0 16px 0; padding: 8px; background-color: #f1f5f9; border: 1px solid #cbd5e1; }
          .meta-table { width: 100%; font-size: 10pt; margin-bottom: 16px; border-collapse: collapse; }
          .meta-table td { padding: 3px 6px; vertical-align: top; }
        </style>
      </head>
      <body>
        <table class="kop-table">
          <tr>
            <td style="width: 70px; text-align: center; vertical-align: middle;">
              <div style="width: 55px; height: 55px; border-radius: 50%; border: 2px solid #047857; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; color: #047857; font-size: 16pt;">PAI</div>
            </td>
            <td style="text-align: center;">
              <div class="kop-title-1">PEMERINTAH KABUPATEN WAY KANAN</div>
              <div class="kop-title-1">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
              <div class="kop-title-2">UPT SMP NEGERI 2 REBANG TANGKAS</div>
              <div class="kop-sub">Alamat: Jl. Lintas Rebang Tangkas, Rebang Tangkas, Way Kanan, Lampung 34791</div>
            </td>
          </tr>
        </table>

        <div class="title-box">
          <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; color: #064e3b;">MODUL & BAHAN AJAR PAI DAN BUDI PEKERTI</div>
          <div style="font-size: 10pt; color: #334155; margin-top: 2px;">Kurikulum Merdeka BSKAP Kemendikbudristek • Fase D</div>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 130px; font-weight: bold;">Mata Pelajaran</td>
            <td style="width: 10px;">:</td>
            <td>Pendidikan Agama Islam &amp; Budi Pekerti</td>
            <td style="width: 110px; font-weight: bold;">Tingkat/Kelas</td>
            <td style="width: 10px;">:</td>
            <td>${buku.tingkat}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Materi Pokok (Bab)</td>
            <td>:</td>
            <td><strong>Bab ${bab.babNomor}: ${bab.judulBab}</strong></td>
            <td style="font-weight: bold;">Semester</td>
            <td>:</td>
            <td>${bab.semester} (${bab.semester === 1 ? "Ganjil" : "Genap"})</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Elemen Capaian</td>
            <td>:</td>
            <td>${bab.elemenCP}</td>
            <td style="font-weight: bold;">Tahun Ajaran</td>
            <td>:</td>
            <td>2026/2027</td>
          </tr>
        </table>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 10.5pt; color: #0f172a;">A. Capaian Pembelajaran (CP):</strong>
          <p style="margin: 4px 0 0 0; text-align: justify; font-size: 10pt; line-height: 1.5; color: #334155;">
            ${bab.capaianPembelajaran}
          </p>
        </div>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 10.5pt; color: #0f172a;">B. Tujuan Pembelajaran (TP):</strong>
          <ol style="margin: 4px 0 0 20px; padding: 0; font-size: 10pt; line-height: 1.5; color: #334155;">
            ${bab.tujuanPembelajaran.map((t) => `<li>${t}</li>`).join("")}
          </ol>
        </div>

        ${dalilHtml}

        <div style="margin-top: 16px;">
          <strong style="font-size: 11pt; color: #0f172a; display: block; margin-bottom: 8px;">C. Uraian Bahan Ajar &amp; Penjabaran Materi:</strong>
          ${
            bab.bahanAjarLengkap?.pendahuluan
              ? `
            <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 10pt; line-height: 1.6; font-style: italic; color: #334155;">
              <strong>Pendahuluan:</strong> ${bab.bahanAjarLengkap.pendahuluan}
            </div>
          `
              : ""
          }
          ${subMateriHtml}
        </div>

        ${aktivitasHtml}
        ${hikmahHtml}

        <div style="margin-top: 30px; page-break-inside: avoid;">
          <table style="width: 100%; font-size: 10pt;">
            <tr>
              <td style="width: 60%;"></td>
              <td style="text-align: center;">
                <div>Rebang Tangkas, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                <div style="margin-top: 4px;">Guru Mata Pelajaran PAI,</div>
                <div style="height: 50px;"></div>
                <div style="font-weight: bold; text-decoration: underline;">Sadiqul Alim, S.Pd.I., M.Pd.</div>
                <div>NIP. 197909172014071004</div>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    }, 400);
  };

  // Standalone new window popout for Bab
  const handleOpenInNewWindowBab = (bab: BabPelajaranData, buku: BukuPelajaranData) => {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();
    const todayStr = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());

    const win = window.open("", "_blank", "width=900,height=850,menubar=no,toolbar=no,location=no,status=no");
    if (!win) {
      alert("Popup terblokir oleh browser. Silakan gunakan tombol 'Cetak Dokumen Sekarang' langsung di halaman ini.");
      return;
    }

    const subMateriHtml = bab.bahanAjarLengkap?.subMateri
      ? bab.bahanAjarLengkap.subMateri
          .map(
            (s, idx) => `
          <div style="margin-bottom: 16px; page-break-inside: avoid;">
            <h4 style="font-size: 11pt; font-weight: bold; color: #064e3b; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
              ${idx + 1}. ${s.judul}
            </h4>
            <p style="font-size: 10pt; line-height: 1.6; text-align: justify; margin: 0 0 8px 0;">${s.konten}</p>
            ${
              s.poinPenting && s.poinPenting.length > 0
                ? `<div style="background: #f8fafc; border-left: 3px solid #059669; padding: 6px 10px; margin: 6px 0; font-size: 9.5pt;">
                    <strong>Poin Kunci Pembelajaran:</strong>
                    <ul style="margin: 4px 0 0 18px; padding: 0;">
                      ${s.poinPenting.map((p) => `<li style="margin-bottom: 3px;">${p}</li>`).join("")}
                    </ul>
                  </div>`
                : ""
            }
          </div>
        `
          )
          .join("")
      : "<p style='font-style: italic; color: #64748b;'>Ringkasan materi utama terlampir pada buku cetak PAI Kemendikbudristek.</p>";

    const aktivitasHtml =
      bab.bahanAjarLengkap?.aktivitasSiswa && bab.bahanAjarLengkap.aktivitasSiswa.length > 0
        ? `<div style="margin-top: 14px; page-break-inside: avoid; background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 14px; border-radius: 6px;">
            <h4 style="font-size: 10.5pt; font-weight: bold; color: #1e3a8a; margin: 0 0 6px 0;">Aktivitas Pembelajaran / LKPD Peserta Didik:</h4>
            <ol style="margin: 0 0 0 18px; padding: 0; font-size: 9.5pt; line-height: 1.5;">
              ${bab.bahanAjarLengkap.aktivitasSiswa.map((akt) => `<li style="margin-bottom: 4px;">${akt}</li>`).join("")}
            </ol>
          </div>`
        : "";

    const hikmahHtml = bab.bahanAjarLengkap?.hikmahKarakter
      ? `<div style="margin-top: 14px; page-break-inside: avoid; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; border-radius: 6px;">
          <h4 style="font-size: 10pt; font-weight: bold; color: #14532d; margin: 0 0 4px 0;">Hikmah Karakter Profil Pelajar Pancasila:</h4>
          <p style="font-size: 9.5pt; line-height: 1.5; color: #166534; margin: 0;">${bab.bahanAjarLengkap.hikmahKarakter}</p>
        </div>`
      : "";

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Modul_PAI_Bab_${bab.babNomor}_Kelas_${buku.tingkat}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #111827; background: #ffffff; margin: 0; padding: 15px; }
    .kop-container { display: flex; align-items: center; justify-content: center; gap: 16px; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 14px; }
    .kop-logo { width: 65px; height: auto; object-fit: contain; }
    .kop-text { text-align: center; flex: 1; }
    .kop-text h2 { margin: 0; font-size: 11pt; font-weight: bold; letter-spacing: 0.5px; }
    .kop-text h1 { margin: 1px 0; font-size: 12pt; font-weight: bold; letter-spacing: 0.5px; }
    .kop-text h3 { margin: 1px 0; font-size: 13.5pt; font-weight: 900; }
    .kop-text p { margin: 2px 0 0 0; font-size: 8.5pt; font-style: italic; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9.5pt; }
    .meta-table td { padding: 3px 6px; vertical-align: top; }
    .meta-table td.label { font-weight: bold; width: 26%; }
    .meta-table td.colon { width: 2%; text-align: center; }
    .section-title { font-size: 11pt; font-weight: bold; color: #064e3b; margin: 12px 0 6px 0; text-transform: uppercase; border-bottom: 1.5px solid #064e3b; padding-bottom: 2px; }
    .signature-container { display: flex; justify-content: space-between; margin-top: 30px; page-break-inside: avoid; font-size: 10pt; }
    .signature-box { text-align: center; width: 45%; }
    .signature-space { height: 60px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Pratinjau Dokumen Siap Cetak A4</strong> • UPT SMPN 2 Rebang Tangkas</div>
    <button onclick="window.print()" style="background: #047857; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer;">Cetak Dokumen (Print / PDF)</button>
  </div>

  <div class="kop-container">
    <img src="${LOGO_WAY_KANAN}" alt="Logo Way Kanan" class="kop-logo" />
    <div class="kop-text">
      <h2>PEMERINTAH KABUPATEN WAY KANAN</h2>
      <h1>DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
      <h3>UPT SMP NEGERI 2 REBANG TANGKAS</h3>
      <p>${sekolah.alamat} • NPSN: ${sekolah.npsn}</p>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 12px;">
    <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">MODUL & BAHAN AJAR PAI DAN BUDI PEKERTI</h3>
    <p style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: bold; color: #374151;">Kurikulum Merdeka • Fase D (SMP/MTs) • Tahun Ajaran 2026/2027</p>
  </div>

  <table class="meta-table">
    <tr>
      <td class="label">Mata Pelajaran</td>
      <td class="colon">:</td>
      <td>Pendidikan Agama Islam dan Budi Pekerti</td>
      <td class="label">Tingkat / Fase</td>
      <td class="colon">:</td>
      <td>Kelas ${buku.tingkat} (Fase D)</td>
    </tr>
    <tr>
      <td class="label">Bab / Judul Materi</td>
      <td class="colon">:</td>
      <td><strong>Bab ${bab.babNomor}: ${bab.judulBab}</strong></td>
      <td class="label">Semester</td>
      <td class="colon">:</td>
      <td>Semester ${bab.semester} (${bab.semester === 1 ? "Ganjil" : "Genap"})</td>
    </tr>
    <tr>
      <td class="label">Elemen CP</td>
      <td class="colon">:</td>
      <td>${bab.elemenCP}</td>
      <td class="label">Alokasi Waktu Rujukan</td>
      <td class="colon">:</td>
      <td>4 - 6 Jam Pelajaran (2 - 3 Pertemuan)</td>
    </tr>
  </table>

  <div class="section-title">A. Capaian Pembelajaran (CP)</div>
  <p style="font-size: 10pt; line-height: 1.5; margin: 0 0 10px 0; text-align: justify;">${bab.capaianPembelajaran}</p>

  <div class="section-title">B. Tujuan Pembelajaran (TP)</div>
  <ol style="margin: 0 0 12px 18px; padding: 0; font-size: 10pt; line-height: 1.5;">
    ${bab.tujuanPembelajaran.map((tp) => `<li style="margin-bottom: 3px;">${tp}</li>`).join("")}
  </ol>

  <div class="section-title">C. Uraian Bahan Ajar & Pembahasan Materi</div>
  ${
    bab.bahanAjarLengkap?.pendahuluan
      ? `<div style="background: #fdfbf7; border-left: 3px solid #d97706; padding: 8px 12px; margin-bottom: 12px; font-size: 9.5pt; font-style: italic;">
          <strong>Pengantar / Apersepsi:</strong> ${bab.bahanAjarLengkap.pendahuluan}
        </div>`
      : ""
  }
  ${subMateriHtml}

  ${aktivitasHtml ? `<div class="section-title">D. Aktivitas Pembelajaran & Diskusi</div>${aktivitasHtml}` : ""}

  ${hikmahHtml ? `<div class="section-title">E. Profil Pelajar Pancasila</div>${hikmahHtml}` : ""}

  <div class="signature-container">
    <div class="signature-box">
      <p style="margin: 0;">Mengetahui,</p>
      <p style="margin: 0; font-weight: bold;">Kepala UPT SMPN 2 Rebang Tangkas</p>
      <div class="signature-space"></div>
      <p style="margin: 0; font-weight: bold; text-decoration: underline;">${sekolah.namaKepsek}</p>
      <p style="margin: 0;">NIP. ${sekolah.nipKepsek}</p>
    </div>
    <div class="signature-box">
      <p style="margin: 0;">Rebang Tangkas, ${todayStr}</p>
      <p style="margin: 0; font-weight: bold;">Guru Mata Pelajaran PAI</p>
      <div class="signature-space"></div>
      <p style="margin: 0; font-weight: bold; text-decoration: underline;">${guru.nama}</p>
      <p style="margin: 0;">NIP. ${guru.nip}</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
  };

  // Standalone new window popout for custom BahanAjarItem
  const handleOpenInNewWindowItem = (item: BahanAjarItem) => {
    const sekolah = DataService.getSekolah();
    const guru = DataService.getGuru();
    const todayStr = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());

    const win = window.open("", "_blank", "width=900,height=850,menubar=no,toolbar=no,location=no,status=no");
    if (!win) {
      alert("Popup terblokir oleh browser. Silakan gunakan tombol 'Cetak Dokumen Sekarang' langsung di halaman ini.");
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Bahan_Ajar_${item.judul.replace(/[^a-zA-Z0-9]/g, "_")}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #111827; background: #ffffff; margin: 0; padding: 15px; }
    .kop-container { display: flex; align-items: center; justify-content: center; gap: 16px; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 14px; }
    .kop-logo { width: 65px; height: auto; object-fit: contain; }
    .kop-text { text-align: center; flex: 1; }
    .kop-text h2 { margin: 0; font-size: 11pt; font-weight: bold; }
    .kop-text h1 { margin: 1px 0; font-size: 12pt; font-weight: bold; }
    .kop-text h3 { margin: 1px 0; font-size: 13.5pt; font-weight: 900; }
    .kop-text p { margin: 2px 0 0 0; font-size: 8.5pt; font-style: italic; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9.5pt; }
    .meta-table td { padding: 3px 6px; vertical-align: top; }
    .meta-table td.label { font-weight: bold; width: 26%; }
    .meta-table td.colon { width: 2%; text-align: center; }
    .section-title { font-size: 11pt; font-weight: bold; color: #064e3b; margin: 12px 0 6px 0; text-transform: uppercase; border-bottom: 1.5px solid #064e3b; padding-bottom: 2px; }
    .signature-container { display: flex; justify-content: space-between; margin-top: 30px; page-break-inside: avoid; font-size: 10pt; }
    .signature-box { text-align: center; width: 45%; }
    .signature-space { height: 60px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Pratinjau Dokumen Siap Cetak A4</strong> • UPT SMPN 2 Rebang Tangkas</div>
    <button onclick="window.print()" style="background: #047857; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer;">Cetak Dokumen (Print / PDF)</button>
  </div>

  <div class="kop-container">
    <img src="${LOGO_WAY_KANAN}" alt="Logo Way Kanan" class="kop-logo" />
    <div class="kop-text">
      <h2>PEMERINTAH KABUPATEN WAY KANAN</h2>
      <h1>DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
      <h3>UPT SMP NEGERI 2 REBANG TANGKAS</h3>
      <p>${sekolah.alamat} • NPSN: ${sekolah.npsn}</p>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 12px;">
    <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">DOKUMEN & LEMBAR BAHAN AJAR</h3>
    <p style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: bold; color: #374151;">Pendidikan Agama Islam dan Budi Pekerti • Kurikulum Merdeka</p>
  </div>

  <table class="meta-table">
    <tr>
      <td class="label">Judul Bahan Ajar</td>
      <td class="colon">:</td>
      <td colspan="4"><strong>${item.judul}</strong></td>
    </tr>
    <tr>
      <td class="label">Tingkat Kelas</td>
      <td class="colon">:</td>
      <td>Kelas ${item.kelas}</td>
      <td class="label">Semester</td>
      <td class="colon">:</td>
      <td>Semester ${item.semester}</td>
    </tr>
    <tr>
      <td class="label">Kategori Berkas</td>
      <td class="colon">:</td>
      <td>${item.kategori} (${item.mediaType || "Dokumen"})</td>
      <td class="label">Elemen CP</td>
      <td class="colon">:</td>
      <td>${item.elemenCP}</td>
    </tr>
    ${
      item.author
        ? `<tr>
      <td class="label">Penyusun / Guru</td>
      <td class="colon">:</td>
      <td colspan="4">${item.author}</td>
    </tr>`
        : ""
    }
  </table>

  <div class="section-title">Deskripsi & Rangkuman Materi Pokok</div>
  <p style="font-size: 10pt; line-height: 1.6; margin: 0 0 14px 0; text-align: justify;">${item.deskripsi || "Tidak ada deskripsi rinci."}</p>

  ${
    item.downloadUrl
      ? `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; font-size: 9pt;">
          <strong>Tautan Berkas Digital / Cloud Drive:</strong><br />
          <a href="${item.downloadUrl}" style="color: #0369a1; word-break: break-all;">${item.downloadUrl}</a>
        </div>`
      : ""
  }

  <div class="signature-container">
    <div class="signature-box">
      <p style="margin: 0;">Mengetahui,</p>
      <p style="margin: 0; font-weight: bold;">Kepala UPT SMPN 2 Rebang Tangkas</p>
      <div class="signature-space"></div>
      <p style="margin: 0; font-weight: bold; text-decoration: underline;">${sekolah.namaKepsek}</p>
      <p style="margin: 0;">NIP. ${sekolah.nipKepsek}</p>
    </div>
    <div class="signature-box">
      <p style="margin: 0;">Rebang Tangkas, ${todayStr}</p>
      <p style="margin: 0; font-weight: bold;">Guru Mata Pelajaran PAI</p>
      <div class="signature-space"></div>
      <p style="margin: 0; font-weight: bold; text-decoration: underline;">${guru.nama}</p>
      <p style="margin: 0;">NIP. ${guru.nip}</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
  };

  // Helper Elemen Color styling
  const getElemenBadgeStyle = (elemen: string) => {
    switch (elemen) {
      case "Al-Qur'an dan Hadis":
      case "Al-Qur'an & Tajwid":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Akidah":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Akhlak":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Fiqih":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Sejarah Peradaban Islam":
      case "Sejarah (Tarikh)":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Library className="w-80 h-80 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs px-3.5 py-1 rounded-full font-black shadow-md shadow-amber-500/20 border border-amber-300">
              <BookCheck className="w-3.5 h-3.5" />
              <span>BAHAN AJAR PAI &amp; BUDI PEKERTI • FASE D SMP</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormItem({
                    judul: "",
                    kelas: activeKelas === "koleksi" ? "VII" : activeKelas,
                    semester: "1",
                    bab: "Bab 1",
                    kategori: "Diktat / Modul",
                    elemenCP: "Al-Qur'an dan Hadis",
                    deskripsi: "",
                    fileSize: "1.5 MB",
                    mediaType: "PDF",
                    downloadUrl: "",
                    textContent: "",
                    author: "Sadiqul Alim, S.Pd.I., M.Pd."
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20 border border-amber-300 cursor-pointer"
                id="btn-tambah-bahan-ajar"
              >
                <Plus className="w-4 h-4" />
                <span>+ Unggah / Tambah Bahan Ajar</span>
              </button>

              {onNavigateToPerangkat && (
                <button
                  onClick={onNavigateToPerangkat}
                  className="px-3 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Perangkat Ajar (CP, ATP, Modul Ajar RPP)"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Perangkat Ajar</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Khazanah Bahan Ajar &amp; Sumber Pembelajaran</span>
            </h1>
            <p className="text-emerald-200/90 text-xs sm:text-sm max-w-3xl leading-relaxed mt-1">
              Pusat referensi materi siswa dan diktat guru PAI &amp; Budi Pekerti Kurikulum Merdeka SMP.
              Memuat 30 Bab komprehensif Kelas VII, VIII, IX, Buku Teks Siswa &amp; Guru Resmi Kemendikbudristek,
              Slide Pembelajaran (Canva/PPT), LKPD, dan media video edukasi.
            </p>
          </div>

          {/* Quick Statistics Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-emerald-200">
            <span className="bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>30 Bab Fase D Lengkap (10 Bab / Tingkat)</span>
            </span>
            <span className="bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-emerald-300" />
              <span>5 Elemen CP: Qur'an, Akidah, Akhlak, Fikih, Sejarah</span>
            </span>
            <span className="bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3 text-amber-400" />
              <span>Tersedia E-Book Resmi Kemendikbudristek 2024-2026</span>
            </span>
          </div>
        </div>
      </div>

      {/* GRADE / LEVEL TAB NAVIGATION */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveKelas("VII")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeKelas === "VII"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 font-black"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-bahan-kelas-7"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Kelas VII (10 Bab)</span>
          </button>

          <button
            onClick={() => setActiveKelas("VIII")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeKelas === "VIII"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 font-black"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-bahan-kelas-8"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Kelas VIII (10 Bab)</span>
          </button>

          <button
            onClick={() => setActiveKelas("IX")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeKelas === "IX"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 font-black"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-bahan-kelas-9"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Kelas IX (10 Bab)</span>
          </button>

          <button
            onClick={() => setActiveKelas("koleksi")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeKelas === "koleksi"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 font-black"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-bahan-koleksi"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Koleksi Berkas / Media ({items.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi / bab / ayat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter:</span>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterSemester("Semua")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                filterSemester === "Semua" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Semua Semester
            </button>
            <button
              onClick={() => setFilterSemester("1")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                filterSemester === "1" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Semester 1 (Ganjil)
            </button>
            <button
              onClick={() => setFilterSemester("2")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                filterSemester === "2" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Semester 2 (Genap)
            </button>
          </div>

          {/* Elemen CP Filter */}
          <select
            value={filterElemen}
            onChange={(e) => setFilterElemen(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
          >
            <option value="Semua">Semua Elemen CP</option>
            <option value="Al-Qur'an dan Hadis">Elemen Qur'an &amp; Hadis</option>
            <option value="Akidah">Elemen Akidah</option>
            <option value="Akhlak">Elemen Akhlak</option>
            <option value="Fiqih">Elemen Fiqih</option>
            <option value="Sejarah Peradaban Islam">Elemen Sejarah Peradaban Islam</option>
          </select>

          {/* Kategori Filter (for Media/Berkas or general) */}
          {activeKelas === "koleksi" && (
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
            >
              <option value="Semua">Semua Format</option>
              <option value="Buku Teks">Buku Teks &amp; E-Book</option>
              <option value="Diktat / Modul">Diktat / Modul Bab</option>
              <option value="Slide / PPT">Slide PPT / Canva</option>
              <option value="LKPD">LKPD Peserta Didik</option>
              <option value="Video / Media">Video &amp; Media Interaktif</option>
            </select>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Menampilkan:{" "}
          <strong className="text-slate-800">
            {activeKelas === "koleksi" ? filteredItems.length : filteredBabList.length}
          </strong>{" "}
          materi pembelajaran
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: RESMI KURIKULUM MERDEKA BAB PELAJARAN (KELAS VII, VIII, IX)   */}
      {/* ========================================================================= */}
      {activeKelas !== "koleksi" && (
        <div className="space-y-4">
          {/* Textbook Header Banner */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  BUKU TEKS RESMI KEMENDIKBUDRISTEK • BSKAP 032/H/KR/2024
                </span>
                <h3 className="text-base font-bold text-slate-900">{currentBuku.judul}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  Penerbit: {currentBuku.penerbit} ({currentBuku.tahunTerbit}) • Fase D {currentBuku.tingkat} SMP/MTs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={
                  activeKelas === "VII"
                    ? "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-vii"
                    : activeKelas === "VIII"
                    ? "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-viii"
                    : "https://buku.kemdikbud.go.id/katalog/buku-siswa-pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-ix"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                title="Buka Portal E-Book Kemendikbudristek"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>E-Book Kemdikbud</span>
              </a>
            </div>
          </div>

          {/* Grid Bab List */}
          {filteredBabList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600 text-sm">Tidak ada materi bab yang sesuai kriteria pencarian.</p>
              <p className="text-xs">Silakan ubah kata kunci atau setel ulang filter semester &amp; elemen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBabList.map((bab) => {
                const elemenBadgeClass = getElemenBadgeStyle(bab.elemenCP);

                return (
                  <div
                    key={bab.babNomor}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                    id={`bab-card-${bab.babNomor}`}
                  >
                    <div className="space-y-3">
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-amber-300 text-[11px] font-black border border-emerald-800">
                            BAB {bab.babNomor}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Semester {bab.semester}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${elemenBadgeClass}`}
                        >
                          {bab.elemenCP}
                        </span>
                      </div>

                      {/* Judul Bab */}
                      <div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                          {bab.judulBab}
                        </h4>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1 line-clamp-2">
                          {bab.capaianPembelajaran}
                        </p>
                      </div>

                      {/* Dalil Ayat Naqli (jika ada) */}
                      {bab.dalilAyat && bab.dalilAyat.length > 0 && (
                        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                            <BookMarked className="w-3 h-3 text-emerald-600" />
                            <span>Dalil Al-Qur'an / Hadits Rujukan:</span>
                          </div>
                          <p className="text-emerald-950 font-bold line-clamp-1">
                            {bab.dalilAyat.map((d) => `${d.surah} Ayat ${d.ayat}`).join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Materi Pokok Tags */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Materi Pembelajaran Pokok:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {bab.materiPokok.slice(0, 3).map((mat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {mat}
                            </span>
                          ))}
                          {bab.materiPokok.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                              +{bab.materiPokok.length - 3} lagi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyBabSummary(bab)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer"
                          title="Salin Rangkuman Materi ke WhatsApp / LMS"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrintBab(bab, currentBuku)}
                          className="p-2 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition border border-transparent hover:border-emerald-200 cursor-pointer"
                          title="Cetak / Unduh Modul Bahan Ajar (PDF A4 Resmi)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReadingBab({ bab, buku: currentBuku })}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Uraian Bahan Ajar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: KOLEKSI BERKAS / MEDIA / DIKTAT / SLIDE PPT & CANVA            */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Koleksi Berkas Dokumen &amp; Media Pembelajaran PAI</span>
            </h3>
            <p className="text-xs text-slate-500">
              Modul ajar digital, e-book resmi, slide tayang presentasi (PPT/Canva), LKPD, dan media video KBM.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {filteredItems.length} Berkas Terdaftar
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <Layers className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 text-sm">Belum ada berkas bahan ajar untuk filter ini.</p>
            <p className="text-xs">
              Klik tombol <strong>"+ Unggah / Tambah Bahan Ajar"</strong> di bagian atas untuk menambahkan modul baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isPdf = item.mediaType === "PDF";
              const isPpt = item.mediaType === "PPT" || item.mediaType === "Canva";
              const isVideo = item.mediaType === "Video";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    {/* Header item */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isPdf
                            ? "bg-rose-100 text-rose-800"
                            : isPpt
                            ? "bg-amber-100 text-amber-900"
                            : isVideo
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.mediaType || "Dokumen"}
                      </span>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <span>Kelas {item.kelas}</span>•<span>Sem. {item.semester}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition line-clamp-2 leading-snug">
                        {item.judul}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.deskripsi}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 font-medium">
                      <span>Kategori: <strong>{item.kategori}</strong></span>
                      {item.fileSize && <span>• {item.fileSize}</span>}
                      {item.author && <span>• Oleh: {item.author}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {item.isCustom && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Bahan Ajar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Bahan Ajar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPrintItem(item)}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition border border-transparent hover:border-emerald-200 cursor-pointer"
                        title="Cetak Lembar Informasi Bahan Ajar (A4)"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-emerald-200"
                        >
                          {isVideo ? <Video className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                          <span>{isVideo ? "Tonton" : "Buka / Unduh"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE READER MODAL FOR BAB PELAJARAN                       */}
      {/* ========================================================================= */}
      {readingBab && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/80 rounded-t-2xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 border border-emerald-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-900 text-amber-300 text-[10px] font-black rounded">
                      BAB {readingBab.bab.babNomor}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {readingBab.buku.tingkat} • Semester {readingBab.bab.semester}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                      {readingBab.bab.elemenCP}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate mt-0.5">
                    {readingBab.bab.judulBab}
                  </h3>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Font Size controls */}
                <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 mr-1">
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("sm")}
                    className={`px-2 py-1 text-xs rounded font-bold transition cursor-pointer ${
                      readerFontSize === "sm" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Font Kecil"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("base")}
                    className={`px-2 py-1 text-xs rounded font-bold transition cursor-pointer ${
                      readerFontSize === "base" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Font Standar"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize("lg")}
                    className={`px-2 py-1 text-xs rounded font-bold transition cursor-pointer ${
                      readerFontSize === "lg" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Font Besar"
                  >
                    A+
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyBabSummary(readingBab.bab)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  title="Salin Rangkuman Materi"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintBab(readingBab.bab, readingBab.buku)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Cetak Modul Bab A4 Resmi"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak Modul</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReadingBab(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Reader View */}
            <div
              className={`p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 leading-relaxed ${
                readerFontSize === "sm" ? "text-xs" : readerFontSize === "lg" ? "text-base" : "text-sm"
              }`}
            >
              {/* CP Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  <Compass className="w-4 h-4" />
                  <span>Capaian Pembelajaran (CP) Elemen {readingBab.bab.elemenCP}</span>
                </div>
                <p className="font-medium text-slate-700">{readingBab.bab.capaianPembelajaran}</p>
              </div>

              {/* Tujuan Pembelajaran */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tujuan Pembelajaran (TP):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-2">
                  {readingBab.bab.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tp}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Dalil Ayat Naqli (Al-Qur'an & Hadis) */}
              {readingBab.bab.dalilAyat && readingBab.bab.dalilAyat.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-black text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-emerald-700" />
                      Dalil Naqli Rujukan (Al-Qur'an &amp; Hadits)
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">Teks Arab &amp; Terjemahan</span>
                  </div>

                  <div className="space-y-4">
                    {readingBab.bab.dalilAyat.map((dalil, dIdx) => (
                      <div key={dIdx} className="space-y-2.5 bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <div className="font-black text-emerald-800 text-xs">
                          {dalil.surah} Ayat {dalil.ayat}
                        </div>
                        <div className="text-xl sm:text-2xl font-serif text-right text-emerald-950 leading-loose tracking-wide py-1">
                          {dalil.teksArab}
                        </div>
                        <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed border-t border-emerald-50 pt-2">
                          "{dalil.arti}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pendahuluan */}
              {readingBab.bab.bahanAjarLengkap?.pendahuluan && (
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Apersepsi &amp; Pendahuluan Bab:</span>
                  </span>
                  <p className="text-slate-800 italic leading-relaxed">
                    {readingBab.bab.bahanAjarLengkap.pendahuluan}
                  </p>
                </div>
              )}

              {/* Uraian Sub-Materi Lengkap */}
              {readingBab.bab.bahanAjarLengkap?.subMateri && (
                <div className="space-y-6 pt-2">
                  <h4 className="font-black text-slate-900 text-base border-b border-slate-200 pb-2">
                    Uraian Penjabaran Materi Per Sub-Bab
                  </h4>

                  {readingBab.bab.bahanAjarLengkap.subMateri.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <h5 className="font-black text-slate-900 text-base">{sub.judul}</h5>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-justify">{sub.konten}</p>

                      {sub.poinPenting && sub.poinPenting.length > 0 && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                            Poin Kunci Pembelajaran:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
                            {sub.poinPenting.map((p, pIdx) => (
                              <li key={pIdx} className="leading-relaxed">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Aktivitas Siswa / LKPD Diskusi */}
              {readingBab.bab.bahanAjarLengkap?.aktivitasSiswa &&
                readingBab.bab.bahanAjarLengkap.aktivitasSiswa.length > 0 && (
                  <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-3">
                    <h5 className="font-bold text-blue-950 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-700" />
                      <span>Aktivitas Pembelajaran / Lembar Kerja Peserta Didik (LKPD):</span>
                    </h5>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 pl-1">
                      {readingBab.bab.bahanAjarLengkap.aktivitasSiswa.map((akt, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">
                          {akt}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

              {/* Hikmah Karakter Profil Pelajar Pancasila */}
              {readingBab.bab.bahanAjarLengkap?.hikmahKarakter && (
                <div className="bg-emerald-950 p-5 rounded-2xl text-white space-y-2 border border-emerald-800">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Hikmah Karakter &amp; Profil Pelajar Pancasila</span>
                  </div>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    {readingBab.bab.bahanAjarLengkap.hikmahKarakter}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
              <span className="text-xs text-slate-500">
                Arsip Bahan Ajar Resmi UPT SMP Negeri 2 Rebang Tangkas
              </span>
              <button
                type="button"
                onClick={() => setReadingBab(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Pembaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORM TAMBAH / EDIT BAHAN AJAR KUSTOM GURU                        */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? "Edit Bahan Ajar" : "Tambah / Unggah Bahan Ajar Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Arsipkan modul, diktat, materi presentasi Canva/PPT, LKPD, atau media ajar video
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-medium text-slate-700">
              {/* Judul Bahan Ajar */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Judul Bahan Ajar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Slide Interaktif Canva Bab 1: Al-Qur'an Pedoman Hidup..."
                  value={formItem.judul}
                  onChange={(e) => setFormItem({ ...formItem, judul: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white text-slate-900 font-semibold text-sm"
                />
              </div>

              {/* Kelas, Semester, Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={formItem.kelas}
                    onChange={(e) => setFormItem({ ...formItem, kelas: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="VII">Kelas VII (Fase D)</option>
                    <option value="VIII">Kelas VIII (Fase D)</option>
                    <option value="IX">Kelas IX (Fase D)</option>
                    <option value="Semua">Semua Tingkat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Semester
                  </label>
                  <select
                    value={formItem.semester}
                    onChange={(e) => setFormItem({ ...formItem, semester: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                    <option value="Semua">Semua Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Kategori Bahan Ajar
                  </label>
                  <select
                    value={formItem.kategori}
                    onChange={(e) => setFormItem({ ...formItem, kategori: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Diktat / Modul">Diktat / Modul Bab</option>
                    <option value="Slide / PPT">Slide / Presentasi (PPT/Canva)</option>
                    <option value="LKPD">LKPD Peserta Didik</option>
                    <option value="Video / Media">Video / Media Pembelajaran</option>
                    <option value="Buku Teks">Buku Teks / E-Book</option>
                    <option value="Ringkasan">Ringkasan Peta Konsep</option>
                  </select>
                </div>
              </div>

              {/* Elemen CP & Format Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Elemen Capaian Pembelajaran
                  </label>
                  <select
                    value={formItem.elemenCP}
                    onChange={(e) => setFormItem({ ...formItem, elemenCP: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Al-Qur'an dan Hadis">Al-Qur'an dan Hadis</option>
                    <option value="Akidah">Akidah</option>
                    <option value="Akhlak">Akhlak</option>
                    <option value="Fiqih">Fiqih</option>
                    <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
                    <option value="Umum">Umum / Semua Elemen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Format Berkas / Media
                  </label>
                  <select
                    value={formItem.mediaType}
                    onChange={(e) => setFormItem({ ...formItem, mediaType: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="PDF">PDF (Dokumen / Modul)</option>
                    <option value="Canva">Canva (Presentasi / Desain)</option>
                    <option value="PPT">PowerPoint (.pptx)</option>
                    <option value="Video">Video Pembelajaran (YouTube / MP4)</option>
                    <option value="Word">Microsoft Word (.docx)</option>
                    <option value="Web">Tautan Web / Drive</option>
                  </select>
                </div>
              </div>

              {/* URL Akses / Download */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tautan Download / Akses Berkas (Google Drive / Canva / YouTube / dll)
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... atau https://canva.com/..."
                  value={formItem.downloadUrl}
                  onChange={(e) => setFormItem({ ...formItem, downloadUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white text-slate-800"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Deskripsi / Petunjuk Penggunaan
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan materi, petunjuk penggunaan di kelas, atau target capaian..."
                  value={formItem.deskripsi}
                  onChange={(e) => setFormItem({ ...formItem, deskripsi: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white text-slate-800 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-submit-bahan-ajar"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? "Simpan Perubahan" : "Tambahkan Bahan Ajar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS BAHAN AJAR KUSTOM                               */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Hapus Bahan Ajar?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus dokumen <strong>"{deletingItem.judul}"</strong> dari arsip bahan ajar? Tindakan ini tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                id="btn-confirm-delete-bahan"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Bahan Ajar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT PREVIEW & DIRECT PRINT MODAL (A4 WITH OFFICIAL KOP SURAT)           */}
      {/* ========================================================================= */}
      {(printModalBab || printModalItem) && (
        <div
          id="print-modal-container"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-6"
        >
          {/* Print specific styles */}
          <style>{`
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            @media print {
              body {
                background: #ffffff !important;
              }
              body * {
                visibility: hidden !important;
              }
              #print-document-area,
              #print-document-area * {
                visibility: visible !important;
              }
              #print-document-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 10mm 12mm !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          {/* Floating Action Controls (Hidden when printing) */}
          <div className="no-print max-w-4xl w-full bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 mb-4 sticky top-2 z-50 border border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-700 rounded-xl text-white">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-snug">Pratinjau Dokumen Siap Cetak (A4 Resmi)</h4>
                <p className="text-[11px] text-slate-400">
                  Lengkap dengan Kop Surat UPT SMPN 2 Rebang Tangkas &amp; Tanda Tangan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExecutePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                id="btn-execute-print"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen Sekarang (Print / PDF)</span>
              </button>

              {printModalBab && (
                <button
                  type="button"
                  onClick={() => handleOpenInNewWindowBab(printModalBab.bab, printModalBab.buku)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Buka pratinjau di jendela browser terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jendela Baru</span>
                </button>
              )}

              {printModalItem && (
                <button
                  type="button"
                  onClick={() => handleOpenInNewWindowItem(printModalItem)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Buka pratinjau di jendela browser terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jendela Baru</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setPrintModalBab(null);
                  setPrintModalItem(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="Tutup Pratinjau Cetak"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Document Sheet (A4 Layout) */}
          <div
            id="print-document-area"
            className="bg-white text-slate-900 max-w-[210mm] w-full p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 font-serif leading-normal my-2"
          >
            {/* 1. KOP SURAT RESMI */}
            <div className="flex items-center justify-center gap-4 border-b-4 border-double border-slate-900 pb-3 mb-5">
              <img
                src={LOGO_WAY_KANAN}
                alt="Logo Way Kanan"
                className="w-16 h-auto object-contain shrink-0"
              />
              <div className="text-center flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  PEMERINTAH KABUPATEN WAY KANAN
                </h3>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h2>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950 mt-0.5">
                  UPT SMP NEGERI 2 REBANG TANGKAS
                </h1>
                <p className="text-[11px] font-sans text-slate-600 mt-0.5 italic">
                  Alamat: Jl. Lintas Rebang Tangkas, Rebang Tangkas, Way Kanan, Lampung 34791 • NPSN: 10806877
                </p>
              </div>
            </div>

            {/* 2. KONTEN BAB PELAJARAN (JIKA BAB) */}
            {printModalBab && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-base font-black uppercase text-slate-950">
                    MODUL &amp; BAHAN AJAR PAI DAN BUDI PEKERTI
                  </h2>
                  <p className="text-xs font-sans font-bold text-slate-600 mt-0.5">
                    Kurikulum Merdeka • Fase D (SMP/MTs) • Tahun Ajaran 2026/2027
                  </p>
                </div>

                {/* Metadata Table */}
                <table className="w-full text-xs font-sans border-collapse mb-4">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-bold text-slate-700 w-1/4">Mata Pelajaran</td>
                      <td className="py-1 w-3 text-center">:</td>
                      <td className="py-1">Pendidikan Agama Islam dan Budi Pekerti</td>
                      <td className="py-1 font-bold text-slate-700 w-1/4">Tingkat / Fase</td>
                      <td className="py-1 w-3 text-center">:</td>
                      <td className="py-1">Kelas {printModalBab.buku.tingkat} (Fase D)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-bold text-slate-700">Bab / Judul Materi</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-bold text-emerald-950">
                        Bab {printModalBab.bab.babNomor}: {printModalBab.bab.judulBab}
                      </td>
                      <td className="py-1 font-bold text-slate-700">Semester</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">
                        Semester {printModalBab.bab.semester} ({printModalBab.bab.semester === 1 ? "Ganjil" : "Genap"})
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-slate-700">Elemen CP</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">{printModalBab.bab.elemenCP}</td>
                      <td className="py-1 font-bold text-slate-700">Alokasi Waktu</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">4 - 6 JP (2 - 3 Pertemuan)</td>
                    </tr>
                  </tbody>
                </table>

                {/* Bagian A: Capaian Pembelajaran */}
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900 pb-1">
                    A. Capaian Pembelajaran (CP)
                  </h3>
                  <p className="text-xs text-justify leading-relaxed font-sans text-slate-800">
                    {printModalBab.bab.capaianPembelajaran}
                  </p>
                </div>

                {/* Bagian B: Tujuan Pembelajaran */}
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900 pb-1">
                    B. Tujuan Pembelajaran (TP)
                  </h3>
                  <ol className="list-decimal list-outside ml-4 text-xs space-y-1 font-sans text-slate-800 leading-relaxed">
                    {printModalBab.bab.tujuanPembelajaran.map((tp, i) => (
                      <li key={i}>{tp}</li>
                    ))}
                  </ol>
                </div>

                {/* Dalil Naqli Rujukan */}
                {printModalBab.bab.dalilAyat && printModalBab.bab.dalilAyat.length > 0 && (
                  <div className="space-y-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 font-sans">
                      Dalil Al-Qur'an / Hadits Rujukan:
                    </h4>
                    {printModalBab.bab.dalilAyat.map((d, idx) => (
                      <div key={idx} className="border-b border-emerald-200/80 pb-2 last:border-b-0 last:pb-0">
                        <div className="text-[11px] font-bold text-emerald-800 font-sans">
                          {d.surah} Ayat {d.ayat}:
                        </div>
                        <div
                          className="text-right text-base sm:text-lg leading-loose text-slate-950 my-1 font-serif"
                          dir="rtl"
                        >
                          {d.teksArab}
                        </div>
                        <div className="text-xs italic text-slate-700 font-sans">
                          Artinya: "{d.arti}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bagian C: Uraian Bahan Ajar */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900 pb-1">
                    C. Uraian Bahan Ajar &amp; Pembahasan Materi
                  </h3>

                  {printModalBab.bab.bahanAjarLengkap?.pendahuluan && (
                    <div className="bg-amber-50/70 border-l-4 border-amber-600 p-3 rounded-r text-xs text-justify font-sans text-slate-800 leading-relaxed">
                      <strong>Pengantar Konsep:</strong> {printModalBab.bab.bahanAjarLengkap.pendahuluan}
                    </div>
                  )}

                  {printModalBab.bab.bahanAjarLengkap?.subMateri ? (
                    printModalBab.bab.bahanAjarLengkap.subMateri.map((sub, idx) => (
                      <div key={idx} className="space-y-1.5 pb-2">
                        <h4 className="text-xs font-bold text-emerald-950 border-b border-slate-200 pb-0.5">
                          {idx + 1}. {sub.judul}
                        </h4>
                        <p className="text-xs text-justify leading-relaxed font-sans text-slate-800">
                          {sub.konten}
                        </p>
                        {sub.poinPenting && sub.poinPenting.length > 0 && (
                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-sans text-[11px]">
                            <strong className="text-slate-800">Poin Kunci Pembelajaran:</strong>
                            <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                              {sub.poinPenting.map((p, pIdx) => (
                                <li key={pIdx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-sans text-slate-700 italic">
                      {printModalBab.bab.ringkasan}
                    </p>
                  )}
                </div>

                {/* Aktivitas Pembelajaran */}
                {printModalBab.bab.bahanAjarLengkap?.aktivitasSiswa &&
                  printModalBab.bab.bahanAjarLengkap.aktivitasSiswa.length > 0 && (
                    <div className="space-y-1.5 p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                      <h4 className="text-xs font-bold text-blue-950 font-sans uppercase">
                        D. Aktivitas Pembelajaran &amp; LKPD Peserta Didik:
                      </h4>
                      <ol className="list-decimal list-outside ml-4 text-xs font-sans space-y-1 text-slate-800">
                        {printModalBab.bab.bahanAjarLengkap.aktivitasSiswa.map((akt, aIdx) => (
                          <li key={aIdx}>{akt}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                {/* Profil Pelajar Pancasila */}
                {printModalBab.bab.bahanAjarLengkap?.hikmahKarakter && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase">
                      E. Profil Pelajar Pancasila &amp; Karakter:
                    </h4>
                    <p className="text-xs font-sans text-emerald-900 mt-1 leading-relaxed">
                      {printModalBab.bab.bahanAjarLengkap.hikmahKarakter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. KONTEN ITEM BAHAN AJAR (JIKA KOLEKSI BERKAS) */}
            {printModalItem && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-base font-black uppercase text-slate-950">
                    DOKUMEN &amp; LEMBAR BAHAN AJAR
                  </h2>
                  <p className="text-xs font-sans font-bold text-slate-600 mt-0.5">
                    Pendidikan Agama Islam dan Budi Pekerti • Kurikulum Merdeka
                  </p>
                </div>

                <table className="w-full text-xs font-sans border-collapse mb-4">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-bold text-slate-700 w-1/4">Judul Dokumen</td>
                      <td className="py-1 w-3 text-center">:</td>
                      <td className="py-1 font-bold text-emerald-950" colSpan={4}>
                        {printModalItem.judul}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-bold text-slate-700">Tingkat Kelas</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">Kelas {printModalItem.kelas}</td>
                      <td className="py-1 font-bold text-slate-700">Semester</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">Semester {printModalItem.semester}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-bold text-slate-700">Kategori Berkas</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">
                        {printModalItem.kategori} ({printModalItem.mediaType || "Dokumen"})
                      </td>
                      <td className="py-1 font-bold text-slate-700">Elemen CP</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">{printModalItem.elemenCP}</td>
                    </tr>
                    {printModalItem.author && (
                      <tr>
                        <td className="py-1 font-bold text-slate-700">Penyusun / Guru</td>
                        <td className="py-1 text-center">:</td>
                        <td className="py-1" colSpan={4}>
                          {printModalItem.author}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900 pb-1">
                    Deskripsi &amp; Rangkuman Pokok
                  </h3>
                  <p className="text-xs text-justify leading-relaxed font-sans text-slate-800">
                    {printModalItem.deskripsi || "Tidak ada rincian materi khusus."}
                  </p>
                </div>

                {printModalItem.downloadUrl && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-sans text-slate-700">
                    <strong>Tautan Berkas Digital:</strong>{" "}
                    <span className="text-blue-700 underline break-all">{printModalItem.downloadUrl}</span>
                  </div>
                )}
              </div>
            )}

            {/* 4. TANDA TANGAN RESMI KEPSEK & GURU */}
            <div className="mt-8 pt-4 border-t border-slate-300 font-sans text-xs flex justify-between items-start">
              <div className="text-center w-52">
                <p className="m-0 text-slate-700">Mengetahui,</p>
                <p className="m-0 font-bold text-slate-900">Kepala UPT SMPN 2 Rebang Tangkas</p>
                <div className="h-16"></div>
                <p className="m-0 font-bold text-slate-950 underline">M. Yamin, S.Pd., M.M.</p>
                <p className="m-0 text-[11px] text-slate-600">NIP. 197205101998021003</p>
              </div>

              <div className="text-center w-56">
                <p className="m-0 text-slate-700">
                  Rebang Tangkas,{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }).format(new Date())}
                </p>
                <p className="m-0 font-bold text-slate-900">Guru Mata Pelajaran PAI</p>
                <div className="h-16"></div>
                <p className="m-0 font-bold text-slate-950 underline">Sadiqul Alim, S.Pd.I., M.Pd.</p>
                <p className="m-0 text-[11px] text-slate-600">NIP. 197909172014071004</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
