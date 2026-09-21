import React, { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  Printer,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  BookOpen,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  Layers
} from "lucide-react";
import * as XLSX from "xlsx";
import { ProtaItem } from "../../types";
import { DataService } from "../../data/initialData";
import { PROTA_PROMES_SEKOLAH_INFO, defaultProtaList } from "../../data/protaPromesData";

interface ProtaViewProps {
  onNotify?: (msg: string) => void;
}

export default function ProtaView({ onNotify }: ProtaViewProps) {
  const [activeKelas, setActiveKelas] = useState<"VII" | "VIII" | "IX">("VII");
  const [protaList, setProtaList] = useState<ProtaItem[]>([]);
  const [editingItem, setEditingItem] = useState<ProtaItem | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Form states
  const [formSemester, setFormSemester] = useState<"1" | "2">("1");
  const [formNoUrut, setFormNoUrut] = useState<number>(1);
  const [formBab, setFormBab] = useState<string>("");
  const [formElemen, setFormElemen] = useState<ProtaItem["elemen"]>("Al-Qur'an dan Hadis");
  const [formTujuan, setFormTujuan] = useState<string>("");
  const [formJp, setFormJp] = useState<number>(12);
  const [formKeterangan, setFormKeterangan] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = DataService.getProta();
    setProtaList(list);
  };

  const currentClassItems = protaList.filter((item) => item.kelas === activeKelas);
  const sem1Items = currentClassItems.filter((item) => item.semester === "1");
  const sem2Items = currentClassItems.filter((item) => item.semester === "2");

  const totalJpSem1 = sem1Items.reduce((acc, curr) => acc + (Number(curr.alokasiWaktuJp) || 0), 0);
  const totalJpSem2 = sem2Items.reduce((acc, curr) => acc + (Number(curr.alokasiWaktuJp) || 0), 0);
  const totalJpYear = totalJpSem1 + totalJpSem2;

  const handleOpenAdd = (semester: "1" | "2" = "1") => {
    setEditingItem(null);
    setFormSemester(semester);
    const existingInSem = currentClassItems.filter((i) => i.semester === semester);
    setFormNoUrut(existingInSem.length > 0 ? Math.max(...existingInSem.map((i) => i.noUrut)) + 1 : 1);
    setFormBab("");
    setFormElemen("Al-Qur'an dan Hadis");
    setFormTujuan("");
    setFormJp(12);
    setFormKeterangan("4 Pekan x 3 JP");
    setIsAdding(true);
  };

  const handleOpenEdit = (item: ProtaItem) => {
    setEditingItem(item);
    setFormSemester(item.semester);
    setFormNoUrut(item.noUrut);
    setFormBab(item.bab);
    setFormElemen(item.elemen);
    setFormTujuan(item.tujuanPembelajaran);
    setFormJp(item.alokasiWaktuJp);
    setFormKeterangan(item.keterangan || "");
    setIsAdding(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBab.trim() || !formTujuan.trim()) {
      alert("Mohon lengkapi Bab materi dan Alur Tujuan Pembelajaran!");
      return;
    }

    let updated: ProtaItem[];
    if (editingItem) {
      updated = protaList.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              semester: formSemester,
              noUrut: Number(formNoUrut),
              bab: formBab,
              elemen: formElemen,
              tujuanPembelajaran: formTujuan,
              alokasiWaktuJp: Number(formJp),
              keterangan: formKeterangan
            }
          : i
      );
    } else {
      const newItem: ProtaItem = {
        id: `prota-${activeKelas}-${formSemester}-${Date.now()}`,
        kelas: activeKelas,
        semester: formSemester,
        noUrut: Number(formNoUrut),
        bab: formBab,
        elemen: formElemen,
        tujuanPembelajaran: formTujuan,
        alokasiWaktuJp: Number(formJp),
        keterangan: formKeterangan
      };
      updated = [...protaList, newItem];
    }

    DataService.saveProta(updated);
    setProtaList(updated);
    setIsAdding(false);
    setEditingItem(null);
    if (onNotify) onNotify("Alokasi Program Tahunan (PROTA) berhasil diperbarui!");
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alokasi materi PROTA ini?")) {
      const updated = protaList.filter((i) => i.id !== id);
      DataService.saveProta(updated);
      setProtaList(updated);
      if (onNotify) onNotify("Alokasi materi PROTA berhasil dihapus.");
    }
  };

  const handleResetDefault = () => {
    if (window.confirm(`Reset alokasi PROTA Kelas ${activeKelas} ke standar Kurikulum Merdeka?`)) {
      const filteredOther = protaList.filter((i) => i.kelas !== activeKelas);
      const defaultCurrentClass = defaultProtaList.filter((i) => i.kelas === activeKelas);
      const updated = [...filteredOther, ...defaultCurrentClass];
      DataService.saveProta(updated);
      setProtaList(updated);
      if (onNotify) onNotify(`Data PROTA Kelas ${activeKelas} berhasil direset ke standar.`);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const rows = [
        ["PROGRAM TAHUNAN (PROTA) KURIKULUM MERDEKA"],
        [`Satuan Pendidikan: ${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}`],
        [`Mata Pelajaran: ${PROTA_PROMES_SEKOLAH_INFO.mataPelajaran}`],
        [`Fase / Kelas: ${PROTA_PROMES_SEKOLAH_INFO.fase} / Kelas ${activeKelas}`],
        [`Tahun Ajaran: ${PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}`],
        [`Alokasi Waktu: 3 JP / Minggu (Total: ${totalJpYear} JP)`],
        [],
        ["No", "Semester", "Lingkup Materi / Bab", "Elemen Capaian", "Alur Tujuan Pembelajaran (ATP)", "Alokasi Waktu (JP)", "Keterangan"]
      ];

      // Semester 1
      sem1Items.forEach((item) => {
        rows.push([
          item.noUrut.toString(),
          "1 (Ganjil)",
          item.bab,
          item.elemen,
          item.tujuanPembelajaran,
          item.alokasiWaktuJp.toString(),
          item.keterangan || ""
        ]);
      });
      rows.push(["", "Subtotal Semester 1", "", "", "", totalJpSem1.toString(), "18 Pekan Efektif"]);

      // Semester 2
      sem2Items.forEach((item) => {
        rows.push([
          item.noUrut.toString(),
          "2 (Genap)",
          item.bab,
          item.elemen,
          item.tujuanPembelajaran,
          item.alokasiWaktuJp.toString(),
          item.keterangan || ""
        ]);
      });
      rows.push(["", "Subtotal Semester 2", "", "", "", totalJpSem2.toString(), "18 Pekan Efektif"]);
      rows.push(["", "TOTAL 1 TAHUN AJARAN", "", "", "", totalJpYear.toString(), "36 Pekan Efektif"]);

      rows.push([]);
      rows.push([`${PROTA_PROMES_SEKOLAH_INFO.tempatTanggal}`]);
      rows.push(["Mengetahui,", "", "", "", "Guru Mata Pelajaran PAI,"]);
      rows.push(["Kepala Sekolah,", "", "", "", ""]);
      rows.push([]);
      rows.push([]);
      rows.push([PROTA_PROMES_SEKOLAH_INFO.kepalaSekolah, "", "", "", PROTA_PROMES_SEKOLAH_INFO.guruPai]);
      rows.push([`NIP. ${PROTA_PROMES_SEKOLAH_INFO.nipKepalaSekolah}`, "", "", "", `NIP. ${PROTA_PROMES_SEKOLAH_INFO.nipGuruPai}`]);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 6 }, { wch: 14 }, { wch: 35 }, { wch: 24 }, { wch: 60 }, { wch: 14 }, { wch: 20 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `PROTA_Kelas_${activeKelas}`);
      XLSX.writeFile(wb, `PROTA_PAI_Kelas_${activeKelas}_Kurikulum_Merdeka.xlsx`);
      if (onNotify) onNotify("Berkas Excel PROTA berhasil diunduh!");
    } catch (err) {
      console.error("Export Excel error:", err);
      alert("Gagal mengunduh berkas Excel. Silakan gunakan tombol cetak A4.");
    }
  };

  // Export to Word (.doc HTML format)
  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>PROTA PAI Kelas ${activeKelas}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; margin: 20mm; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
          .kop h2 { margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; }
          .kop h3 { margin: 2px 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
          .kop p { margin: 0; font-size: 9pt; }
          h1 { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
          .meta { width: 100%; margin-bottom: 12px; font-size: 10.5pt; }
          .meta td { padding: 2px 4px; }
          table.data { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
          table.data th, table.data td { border: 1px solid #000; padding: 5px 6px; }
          table.data th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
          .ttd { width: 100%; margin-top: 25px; font-size: 11pt; }
          .ttd td { text-align: center; vertical-align: top; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>${PROTA_PROMES_SEKOLAH_INFO.dinas}</h2>
          <h2>${PROTA_PROMES_SEKOLAH_INFO.subDinas}</h2>
          <h3>${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</h3>
          <p>${PROTA_PROMES_SEKOLAH_INFO.alamat} | ${PROTA_PROMES_SEKOLAH_INFO.akreditasi}</p>
        </div>

        <h1>PROGRAM TAHUNAN (PROTA)</h1>
        <p style="text-align: center; margin: 0 0 14px 0; font-weight: bold;">KURIKULUM MERDEKA TAHUN AJARAN ${PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}</p>

        <table class="meta">
          <tr><td width="22%">Satuan Pendidikan</td><td width="2%">:</td><td width="40%">${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</td><td width="18%">Fase / Kelas</td><td width="2%">:</td><td width="16%">${PROTA_PROMES_SEKOLAH_INFO.fase} / ${activeKelas}</td></tr>
          <tr><td>Mata Pelajaran</td><td>:</td><td>${PROTA_PROMES_SEKOLAH_INFO.mataPelajaran}</td><td>Alokasi Waktu</td><td>:</td><td>3 JP / Minggu (${totalJpYear} JP)</td></tr>
        </table>

        <table class="data">
          <thead>
            <tr>
              <th width="5%">No</th>
              <th width="9%">Sem.</th>
              <th width="24%">Lingkup Materi / Bab</th>
              <th width="18%">Elemen</th>
              <th width="32%">Alur Tujuan Pembelajaran (ATP)</th>
              <th width="12%">Alokasi Waktu</th>
            </tr>
          </thead>
          <tbody>
            ${sem1Items
              .map(
                (item) => `
              <tr>
                <td style="text-align: center;">${item.noUrut}</td>
                <td style="text-align: center;">1 (Ganjil)</td>
                <td><b>${item.bab}</b></td>
                <td>${item.elemen}</td>
                <td>${item.tujuanPembelajaran}</td>
                <td style="text-align: center; font-weight: bold;">${item.alokasiWaktuJp} JP</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="5" style="text-align: right;">Jumlah Alokasi Waktu Semester 1 (Ganjil):</td>
              <td style="text-align: center;">${totalJpSem1} JP</td>
            </tr>
            ${sem2Items
              .map(
                (item) => `
              <tr>
                <td style="text-align: center;">${item.noUrut}</td>
                <td style="text-align: center;">2 (Genap)</td>
                <td><b>${item.bab}</b></td>
                <td>${item.elemen}</td>
                <td>${item.tujuanPembelajaran}</td>
                <td style="text-align: center; font-weight: bold;">${item.alokasiWaktuJp} JP</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="5" style="text-align: right;">Jumlah Alokasi Waktu Semester 2 (Genap):</td>
              <td style="text-align: center;">${totalJpSem2} JP</td>
            </tr>
            <tr style="background-color: #e5e7eb; font-weight: bold; font-size: 10.5pt;">
              <td colspan="5" style="text-align: right;">TOTAL ALOKASI WAKTU 1 TAHUN AJARAN:</td>
              <td style="text-align: center;">${totalJpYear} JP</td>
            </tr>
          </tbody>
        </table>

        <table class="ttd">
          <tr>
            <td width="50%">
              Mengetahui,<br>
              Kepala ${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}
              <br><br><br><br><br>
              <b><u>${PROTA_PROMES_SEKOLAH_INFO.kepalaSekolah}</u></b><br>
              NIP. ${PROTA_PROMES_SEKOLAH_INFO.nipKepalaSekolah}
            </td>
            <td width="50%">
              ${PROTA_PROMES_SEKOLAH_INFO.tempatTanggal}<br>
              Guru Mata Pelajaran PAI & BP
              <br><br><br><br><br>
              <b><u>${PROTA_PROMES_SEKOLAH_INFO.guruPai}</u></b><br>
              NIP. ${PROTA_PROMES_SEKOLAH_INFO.nipGuruPai}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PROTA_PAI_Kelas_${activeKelas}_Kurikulum_Merdeka.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onNotify) onNotify("Dokumen Word PROTA berhasil diunduh!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md border border-emerald-900/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wide">
                Administrasi PAI
              </span>
              <span className="text-xs text-emerald-200 font-semibold">
                Kurikulum Merdeka • {PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-amber-300" />
              Program Tahunan (PROTA) PAI &amp; Budi Pekerti
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              Pemetaan rencana alokasi jam pembelajaran selama satu tahun ajaran penuh (Semester 1 dan 2)
              berdasarkan Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) pada {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Pratinjau & Cetak Dokumen A4 Resmi"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak A4 Resmi</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-950 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-emerald-600/40 cursor-pointer"
              title="Ekspor ke Format Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-950 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-emerald-600/40 cursor-pointer"
              title="Ekspor ke Format Dokumen Word (.doc)"
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Unduh Word</span>
            </button>
          </div>
        </div>

        {/* Class Selection Navigation */}
        <div className="mt-5 pt-4 border-t border-emerald-600/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/40 p-1 rounded-xl border border-emerald-600/40">
            {(["VII", "VIII", "IX"] as const).map((kelas) => (
              <button
                key={kelas}
                onClick={() => setActiveKelas(kelas)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                  activeKelas === kelas
                    ? "bg-white text-emerald-900 shadow-md scale-[1.02]"
                    : "text-emerald-100 hover:bg-white/15"
                }`}
              >
                Kelas {kelas} (Fase D)
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100">
            <button
              onClick={handleResetDefault}
              className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-950 text-emerald-200 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 border border-emerald-700/50 transition cursor-pointer"
              title="Reset ke alokasi baku Kurikulum Merdeka"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              onClick={() => handleOpenAdd("1")}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-black flex items-center gap-1 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Alokasi Bab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total 1 Tahun</div>
            <div className="text-xl font-black text-slate-900">{totalJpYear} JP</div>
            <div className="text-[10px] text-emerald-700 font-semibold">36 Pekan Efektif KBM</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Semester 1 (Ganjil)</div>
            <div className="text-xl font-black text-slate-900">{totalJpSem1} JP</div>
            <div className="text-[10px] text-sky-700 font-semibold">{sem1Items.length} Bab • 18 Pekan</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Semester 2 (Genap)</div>
            <div className="text-xl font-black text-slate-900">{totalJpSem2} JP</div>
            <div className="text-[10px] text-indigo-700 font-semibold">{sem2Items.length} Bab • 18 Pekan</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Beban Mengajar</div>
            <div className="text-xl font-black text-slate-900">3 JP / Minggu</div>
            <div className="text-[10px] text-amber-800 font-semibold">Standar Permendikbudristek</div>
          </div>
        </div>
      </div>

      {/* SEMESTER 1 (GANJIL) TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Semester 1 (Ganjil) - Kelas {activeKelas}
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              {sem1Items.length} Bab • Subtotal: {totalJpSem1} JP
            </span>
          </div>
          <button
            onClick={() => handleOpenAdd("1")}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bab Sem 1</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-[11px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 w-56">Lingkup Materi / Bab</th>
                <th className="px-4 py-3 w-40">Elemen PAI</th>
                <th className="px-4 py-3">Alur Tujuan Pembelajaran (ATP)</th>
                <th className="px-4 py-3 w-28 text-center">Alokasi Waktu</th>
                <th className="px-4 py-3 w-28 text-center">Keterangan</th>
                <th className="px-4 py-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sem1Items.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                  <td className="px-4 py-3 text-center font-bold text-slate-500">{item.noUrut}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{item.bab}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px] inline-block">
                      {item.elemen}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 leading-relaxed font-medium">
                    {item.tujuanPembelajaran}
                  </td>
                  <td className="px-4 py-3 text-center font-black text-emerald-800 text-sm">
                    {item.alokasiWaktuJp} JP
                  </td>
                  <td className="px-4 py-3 text-center text-[10px] text-slate-500 font-semibold">
                    {item.keterangan || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit Alokasi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sem1Items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 italic">
                    Belum ada data materi untuk Semester 1.
                  </td>
                </tr>
              )}
              <tr className="bg-emerald-50/70 font-black text-slate-900 border-t-2 border-emerald-200">
                <td colSpan={4} className="px-4 py-2.5 text-right uppercase tracking-wider text-xs">
                  Jumlah Jam Pelajaran Semester 1:
                </td>
                <td className="px-4 py-2.5 text-center text-emerald-900 text-sm font-black">
                  {totalJpSem1} JP
                </td>
                <td colSpan={2} className="px-4 py-2.5 text-xs text-emerald-800 font-bold">
                  18 Pekan Efektif KBM
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SEMESTER 2 (GENAP) TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50 to-purple-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Semester 2 (Genap) - Kelas {activeKelas}
            </h3>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">
              {sem2Items.length} Bab • Subtotal: {totalJpSem2} JP
            </span>
          </div>
          <button
            onClick={() => handleOpenAdd("2")}
            className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bab Sem 2</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-[11px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 w-56">Lingkup Materi / Bab</th>
                <th className="px-4 py-3 w-40">Elemen PAI</th>
                <th className="px-4 py-3">Alur Tujuan Pembelajaran (ATP)</th>
                <th className="px-4 py-3 w-28 text-center">Alokasi Waktu</th>
                <th className="px-4 py-3 w-28 text-center">Keterangan</th>
                <th className="px-4 py-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sem2Items.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/40 transition">
                  <td className="px-4 py-3 text-center font-bold text-slate-500">{item.noUrut}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{item.bab}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px] inline-block">
                      {item.elemen}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 leading-relaxed font-medium">
                    {item.tujuanPembelajaran}
                  </td>
                  <td className="px-4 py-3 text-center font-black text-indigo-900 text-sm">
                    {item.alokasiWaktuJp} JP
                  </td>
                  <td className="px-4 py-3 text-center text-[10px] text-slate-500 font-semibold">
                    {item.keterangan || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit Alokasi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sem2Items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 italic">
                    Belum ada data materi untuk Semester 2.
                  </td>
                </tr>
              )}
              <tr className="bg-indigo-50/70 font-black text-slate-900 border-t-2 border-indigo-200">
                <td colSpan={4} className="px-4 py-2.5 text-right uppercase tracking-wider text-xs">
                  Jumlah Jam Pelajaran Semester 2:
                </td>
                <td className="px-4 py-2.5 text-center text-indigo-900 text-sm font-black">
                  {totalJpSem2} JP
                </td>
                <td colSpan={2} className="px-4 py-2.5 text-xs text-indigo-800 font-bold">
                  18 Pekan Efektif KBM
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* GRAND TOTAL SUMMARY BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
            ∑
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Alokasi Pembelajaran 1 Tahun (Semester 1 &amp; 2)
            </div>
            <div className="text-xl font-black text-emerald-300">
              {totalJpYear} Jam Pelajaran (JP) • 36 Pekan Efektif
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmi A4</span>
          </button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>{editingItem ? "Edit Alokasi Bab PROTA" : "Tambah Bab ke PROTA"}</span>
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as "1" | "2")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Urut Bab</label>
                  <input
                    type="number"
                    value={formNoUrut}
                    onChange={(e) => setFormNoUrut(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lingkup Materi / Judul Bab</label>
                <input
                  type="text"
                  value={formBab}
                  onChange={(e) => setFormBab(e.target.value)}
                  placeholder="Contoh: Bab 1: Al-Qur'an dan Hadis Pedoman Hidup"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Elemen Capaian PAI</label>
                  <select
                    value={formElemen}
                    onChange={(e) => setFormElemen(e.target.value as ProtaItem["elemen"])}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Al-Qur'an dan Hadis">Al-Qur'an dan Hadis</option>
                    <option value="Akidah">Akidah</option>
                    <option value="Akhlak">Akhlak</option>
                    <option value="Fiqih">Fiqih</option>
                    <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi Waktu (JP)</label>
                  <input
                    type="number"
                    value={formJp}
                    onChange={(e) => setFormJp(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-800"
                    min="1"
                    max="36"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alur Tujuan Pembelajaran (ATP)</label>
                <textarea
                  value={formTujuan}
                  onChange={(e) => setFormTujuan(e.target.value)}
                  placeholder="Deskripsikan Alur Tujuan Pembelajaran (kompetensi dan konten capaian pembelajaran)..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-800 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Contoh: 4 Pekan x 3 JP"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black shadow-sm cursor-pointer"
                >
                  Simpan Alokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-700" />
                  <span>Pratinjau Cetak Program Tahunan (PROTA) A4</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dokumen resmi lengkap dengan Kop UPT SMPN 2 Rebang Tangkas dan Tanda Tangan
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sekarang</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Sheet Container */}
            <div className="bg-white p-6 sm:p-10 border border-slate-300 shadow-md font-serif text-black leading-relaxed space-y-5 rounded-sm">
              {/* KOP SURAT RESMI */}
              <div className="text-center border-b-4 border-double border-black pb-3 space-y-0.5">
                <div className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                  {PROTA_PROMES_SEKOLAH_INFO.dinas}
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                  {PROTA_PROMES_SEKOLAH_INFO.subDinas}
                </div>
                <div className="text-base sm:text-xl font-black tracking-wide uppercase text-slate-900">
                  {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600">
                  {PROTA_PROMES_SEKOLAH_INFO.alamat} • {PROTA_PROMES_SEKOLAH_INFO.akreditasi}
                </div>
              </div>

              {/* JUDUL */}
              <div className="text-center space-y-1 py-1">
                <h2 className="text-base sm:text-lg font-black uppercase underline tracking-wider">
                  PROGRAM TAHUNAN (PROTA)
                </h2>
                <div className="text-xs font-bold uppercase">
                  KURIKULUM MERDEKA TAHUN AJARAN {PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}
                </div>
              </div>

              {/* IDENTITAS */}
              <div className="grid grid-cols-2 gap-y-1 gap-x-6 text-xs text-black border-y border-black py-2.5">
                <div>
                  <span className="font-bold inline-block w-36">Satuan Pendidikan</span>
                  <span>: {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</span>
                </div>
                <div>
                  <span className="font-bold inline-block w-32">Fase / Kelas</span>
                  <span>: {PROTA_PROMES_SEKOLAH_INFO.fase} / {activeKelas}</span>
                </div>
                <div>
                  <span className="font-bold inline-block w-36">Mata Pelajaran</span>
                  <span>: {PROTA_PROMES_SEKOLAH_INFO.mataPelajaran}</span>
                </div>
                <div>
                  <span className="font-bold inline-block w-32">Alokasi Waktu</span>
                  <span>: 3 JP / Pekan (Total: {totalJpYear} JP)</span>
                </div>
              </div>

              {/* TABEL DOKUMEN CETAK */}
              <table className="w-full text-left text-[11px] border-collapse border border-black">
                <thead>
                  <tr className="bg-slate-100 text-black font-bold uppercase text-center">
                    <th className="border border-black p-2 w-10">No</th>
                    <th className="border border-black p-2 w-16">Sem.</th>
                    <th className="border border-black p-2 w-48">Lingkup Materi / Bab</th>
                    <th className="border border-black p-2 w-32">Elemen</th>
                    <th className="border border-black p-2">Alur Tujuan Pembelajaran (ATP)</th>
                    <th className="border border-black p-2 w-20">Alokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {sem1Items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black p-2 text-center">{item.noUrut}</td>
                      <td className="border border-black p-2 text-center">1</td>
                      <td className="border border-black p-2 font-bold">{item.bab}</td>
                      <td className="border border-black p-2">{item.elemen}</td>
                      <td className="border border-black p-2">{item.tujuanPembelajaran}</td>
                      <td className="border border-black p-2 text-center font-bold">{item.alokasiWaktuJp} JP</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={5} className="border border-black p-2 text-right">
                      Jumlah Alokasi Waktu Semester 1 (Ganjil):
                    </td>
                    <td className="border border-black p-2 text-center">{totalJpSem1} JP</td>
                  </tr>

                  {sem2Items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black p-2 text-center">{item.noUrut}</td>
                      <td className="border border-black p-2 text-center">2</td>
                      <td className="border border-black p-2 font-bold">{item.bab}</td>
                      <td className="border border-black p-2">{item.elemen}</td>
                      <td className="border border-black p-2">{item.tujuanPembelajaran}</td>
                      <td className="border border-black p-2 text-center font-bold">{item.alokasiWaktuJp} JP</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={5} className="border border-black p-2 text-right">
                      Jumlah Alokasi Waktu Semester 2 (Genap):
                    </td>
                    <td className="border border-black p-2 text-center">{totalJpSem2} JP</td>
                  </tr>

                  <tr className="bg-slate-200 font-bold text-xs">
                    <td colSpan={5} className="border border-black p-2 text-right uppercase">
                      Total Alokasi Waktu 1 Tahun Pelajaran:
                    </td>
                    <td className="border border-black p-2 text-center font-black">{totalJpYear} JP</td>
                  </tr>
                </tbody>
              </table>

              {/* TANDA TANGAN */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div>Mengetahui,</div>
                  <div>Kepala {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</div>
                  <div className="h-20"></div>
                  <div className="font-bold underline">{PROTA_PROMES_SEKOLAH_INFO.kepalaSekolah}</div>
                  <div>NIP. {PROTA_PROMES_SEKOLAH_INFO.nipKepalaSekolah}</div>
                </div>

                <div>
                  <div>{PROTA_PROMES_SEKOLAH_INFO.tempatTanggal}</div>
                  <div>Guru Mata Pelajaran PAI &amp; BP</div>
                  <div className="h-20"></div>
                  <div className="font-bold underline">{PROTA_PROMES_SEKOLAH_INFO.guruPai}</div>
                  <div>NIP. {PROTA_PROMES_SEKOLAH_INFO.nipGuruPai}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
