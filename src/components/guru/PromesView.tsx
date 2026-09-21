import React, { useState, useEffect } from "react";
import {
  CalendarRange,
  Printer,
  FileSpreadsheet,
  FileText,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Clock,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import { PromesItem } from "../../types";
import { DataService } from "../../data/initialData";
import {
  PROTA_PROMES_SEKOLAH_INFO,
  defaultPromesList,
  BULAN_PROMES_SEM1,
  BULAN_PROMES_SEM2,
  SPECIAL_EVENTS_SEM1,
  SPECIAL_EVENTS_SEM2
} from "../../data/protaPromesData";

interface PromesViewProps {
  onNotify?: (msg: string) => void;
}

export default function PromesView({ onNotify }: PromesViewProps) {
  const [activeKelas, setActiveKelas] = useState<"VII" | "VIII" | "IX">("VII");
  const [activeSemester, setActiveSemester] = useState<"1" | "2">("1");
  const [promesList, setPromesList] = useState<PromesItem[]>([]);
  const [editingItem, setEditingItem] = useState<PromesItem | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Form states
  const [formBab, setFormBab] = useState<string>("");
  const [formMateri, setFormMateri] = useState<string>("");
  const [formElemen, setFormElemen] = useState<PromesItem["elemen"]>("Al-Qur'an dan Hadis");
  const [formTujuan, setFormTujuan] = useState<string>("");
  const [formJp, setFormJp] = useState<number>(12);
  const [formNoUrut, setFormNoUrut] = useState<number>(1);
  const [formKeterangan, setFormKeterangan] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = DataService.getPromes();
    setPromesList(list);
  };

  const currentMonths = activeSemester === "1" ? BULAN_PROMES_SEM1 : BULAN_PROMES_SEM2;
  const currentSpecialEvents = activeSemester === "1" ? SPECIAL_EVENTS_SEM1 : SPECIAL_EVENTS_SEM2;

  // Filter items for current class and semester
  const currentItems = promesList.filter(
    (item) => item.kelas === activeKelas && item.semester === activeSemester
  );

  const totalJpSemester = currentItems.reduce((acc, curr) => acc + (Number(curr.alokasiWaktuJp) || 0), 0);

  // Calculate sum per week key across all items
  const getWeeklySum = (monthName: string, weekNum: number) => {
    const key = `${monthName}_${weekNum}`;
    return currentItems.reduce((acc, item) => {
      const val = item.jadwalMingguan?.[key];
      return acc + (typeof val === "number" ? val : 0);
    }, 0);
  };

  // Toggle or edit cell hours
  const handleToggleCell = (itemId: string, monthName: string, weekNum: number) => {
    const key = `${monthName}_${weekNum}`;
    const updated = promesList.map((item) => {
      if (item.id === itemId) {
        const currentVal = item.jadwalMingguan?.[key];
        let newVal: number | undefined;
        if (typeof currentVal === "number" && currentVal > 0) {
          newVal = undefined; // clear
        } else {
          newVal = 3; // default 3 JP
        }
        const newJadwal = { ...item.jadwalMingguan };
        if (newVal === undefined) {
          delete newJadwal[key];
        } else {
          newJadwal[key] = newVal;
        }
        return { ...item, jadwalMingguan: newJadwal };
      }
      return item;
    });

    DataService.savePromes(updated);
    setPromesList(updated);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormBab(`Bab ${currentItems.length + 1}`);
    setFormMateri("");
    setFormElemen("Al-Qur'an dan Hadis");
    setFormTujuan("");
    setFormJp(12);
    setFormNoUrut(currentItems.length + 1);
    setFormKeterangan("4 Pekan KBM");
    setIsAdding(true);
  };

  const handleOpenEdit = (item: PromesItem) => {
    setEditingItem(item);
    setFormBab(item.bab);
    setFormMateri(item.materiPokok);
    setFormElemen(item.elemen);
    setFormTujuan(item.tujuanPembelajaran);
    setFormJp(item.alokasiWaktuJp);
    setFormNoUrut(item.noUrut);
    setFormKeterangan(item.keterangan || "");
    setIsAdding(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMateri.trim()) {
      alert("Mohon isi Materi Pokok!");
      return;
    }

    let updated: PromesItem[];
    if (editingItem) {
      updated = promesList.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              bab: formBab,
              materiPokok: formMateri,
              elemen: formElemen,
              tujuanPembelajaran: formTujuan,
              alokasiWaktuJp: Number(formJp),
              noUrut: Number(formNoUrut),
              keterangan: formKeterangan
            }
          : i
      );
    } else {
      const newItem: PromesItem = {
        id: `promes-${activeKelas}-${activeSemester}-${Date.now()}`,
        kelas: activeKelas,
        semester: activeSemester,
        noUrut: Number(formNoUrut),
        bab: formBab,
        elemen: formElemen,
        materiPokok: formMateri,
        tujuanPembelajaran: formTujuan,
        alokasiWaktuJp: Number(formJp),
        jadwalMingguan: {},
        keterangan: formKeterangan
      };
      updated = [...promesList, newItem];
    }

    DataService.savePromes(updated);
    setPromesList(updated);
    setIsAdding(false);
    setEditingItem(null);
    if (onNotify) onNotify("Data Program Semester (PROMES) berhasil diperbarui!");
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Hapus baris alokasi PROMES ini?")) {
      const updated = promesList.filter((i) => i.id !== id);
      DataService.savePromes(updated);
      setPromesList(updated);
      if (onNotify) onNotify("Materi PROMES berhasil dihapus.");
    }
  };

  const handleResetDefault = () => {
    if (
      window.confirm(
        `Reset matriks PROMES Kelas ${activeKelas} Semester ${activeSemester} ke standar Kurikulum Merdeka?`
      )
    ) {
      const filteredOther = promesList.filter(
        (i) => !(i.kelas === activeKelas && i.semester === activeSemester)
      );
      const defaultCurrent = defaultPromesList.filter(
        (i) => i.kelas === activeKelas && i.semester === activeSemester
      );
      const updated = [...filteredOther, ...defaultCurrent];
      DataService.savePromes(updated);
      setPromesList(updated);
      if (onNotify) onNotify("Matriks PROMES berhasil direset ke standar.");
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      // Build Headers
      const title1 = ["PROGRAM SEMESTER (PROMES) PAI & BUDI PEKERTI"];
      const title2 = [`Satuan Pendidikan: ${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}`];
      const title3 = [
        `Kelas: ${activeKelas} | Semester: ${activeSemester === "1" ? "1 (Ganjil)" : "2 (Genap)"} | Tahun Ajaran: ${PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}`
      ];

      // Row 1 of Table Header: No, Materi, Elemen, Tujuan, JP, then month names merged
      const headerRow1 = ["No", "Bab", "Lingkup Materi Pokok", "Elemen", "Tujuan Pembelajaran", "JP"];
      const headerRow2 = ["", "", "", "", "", ""];

      currentMonths.forEach((m) => {
        headerRow1.push(m.nama);
        for (let i = 1; i < m.weeks.length; i++) {
          headerRow1.push("");
        }
        m.weeks.forEach((w) => {
          headerRow2.push(`M${w}`);
        });
      });

      const dataRows = [title1, title2, title3, [], headerRow1, headerRow2];

      currentItems.forEach((item) => {
        const row = [
          item.noUrut.toString(),
          item.bab,
          item.materiPokok,
          item.elemen,
          item.tujuanPembelajaran,
          item.alokasiWaktuJp.toString()
        ];
        currentMonths.forEach((m) => {
          m.weeks.forEach((w) => {
            const key = `${m.nama}_${w}`;
            const val = item.jadwalMingguan?.[key];
            row.push(val ? val.toString() : "");
          });
        });
        dataRows.push(row);
      });

      // Total row
      const totalRow = ["", "", "JUMLAH JAM PELAJARAN (JP)", "", "", totalJpSemester.toString()];
      currentMonths.forEach((m) => {
        m.weeks.forEach((w) => {
          const sum = getWeeklySum(m.nama, w);
          totalRow.push(sum > 0 ? sum.toString() : "");
        });
      });
      dataRows.push(totalRow);

      const ws = XLSX.utils.aoa_to_sheet(dataRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `PROMES_${activeKelas}_Sem${activeSemester}`);
      XLSX.writeFile(
        wb,
        `PROMES_PAI_Kelas_${activeKelas}_Sem_${activeSemester}_Kurikulum_Merdeka.xlsx`
      );
      if (onNotify) onNotify("Berkas Excel PROMES berhasil diunduh!");
    } catch (err) {
      console.error("Export Excel error:", err);
      alert("Gagal mengekspor Excel.");
    }
  };

  // Export to Word (.doc HTML table format)
  const handleExportWord = () => {
    const semName = activeSemester === "1" ? "1 (Ganjil)" : "2 (Genap)";
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>PROMES PAI Kelas ${activeKelas} Semester ${activeSemester}</title>
        <style>
          @page { size: landscape; margin: 15mm; }
          body { font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.2; }
          .kop { text-align: center; border-bottom: 2px double #000; padding-bottom: 6px; margin-bottom: 12px; }
          .kop h2 { margin: 0; font-size: 11pt; font-weight: bold; }
          .kop h3 { margin: 2px 0; font-size: 13pt; font-weight: bold; }
          .kop p { margin: 0; font-size: 8pt; }
          h1 { text-align: center; font-size: 12pt; font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
          table.data { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 8.5pt; }
          table.data th, table.data td { border: 1px solid #000; padding: 3px 4px; }
          table.data th { background-color: #f2f2f2; text-align: center; }
          .ttd { width: 100%; margin-top: 20px; font-size: 10pt; }
          .ttd td { text-align: center; vertical-align: top; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>${PROTA_PROMES_SEKOLAH_INFO.dinas}</h2>
          <h2>${PROTA_PROMES_SEKOLAH_INFO.subDinas}</h2>
          <h3>${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</h3>
          <p>${PROTA_PROMES_SEKOLAH_INFO.alamat}</p>
        </div>

        <h1>PROGRAM SEMESTER (PROMES)</h1>
        <p style="text-align: center; margin: 0 0 10px 0; font-weight: bold;">
          KURIKULUM MERDEKA - SEMESTER ${semName.toUpperCase()} T.A. ${PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}
        </p>

        <p style="margin: 4px 0;">
          <b>Mata Pelajaran:</b> ${PROTA_PROMES_SEKOLAH_INFO.mataPelajaran} &nbsp;|&nbsp; 
          <b>Kelas:</b> ${activeKelas} &nbsp;|&nbsp; 
          <b>Alokasi Waktu:</b> 3 JP / Minggu (Total: ${totalJpSemester} JP)
        </p>

        <table class="data">
          <thead>
            <tr>
              <th rowspan="2" width="3%">No</th>
              <th rowspan="2" width="22%">Materi Pokok / Bab</th>
              <th rowspan="2" width="12%">Elemen</th>
              <th rowspan="2" width="5%">JP</th>
              ${currentMonths
                .map((m) => `<th colspan="${m.weeks.length}">${m.nama}</th>`)
                .join("")}
            </tr>
            <tr>
              ${currentMonths
                .map((m) => m.weeks.map((w) => `<th>${w}</th>`).join(""))
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${currentItems
              .map(
                (item) => `
              <tr>
                <td style="text-align: center;">${item.noUrut}</td>
                <td><b>${item.bab}:</b> ${item.materiPokok}</td>
                <td>${item.elemen}</td>
                <td style="text-align: center; font-weight: bold;">${item.alokasiWaktuJp}</td>
                ${currentMonths
                  .map((m) =>
                    m.weeks
                      .map((w) => {
                        const key = `${m.nama}_${w}`;
                        const val = item.jadwalMingguan?.[key];
                        return `<td style="text-align: center; font-weight: bold;">${val || ""}</td>`;
                      })
                      .join("")
                  )
                  .join("")}
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f2f2f2; font-weight: bold;">
              <td colspan="3" style="text-align: right;">Jumlah Jam Pelajaran:</td>
              <td style="text-align: center;">${totalJpSemester}</td>
              ${currentMonths
                .map((m) =>
                  m.weeks
                    .map((w) => {
                      const sum = getWeeklySum(m.nama, w);
                      return `<td style="text-align: center;">${sum > 0 ? sum : ""}</td>`;
                    })
                    .join("")
                )
                .join("")}
            </tr>
          </tbody>
        </table>

        <table class="ttd">
          <tr>
            <td width="50%">
              Mengetahui,<br>
              Kepala ${PROTA_PROMES_SEKOLAH_INFO.namaSekolah}
              <br><br><br><br>
              <b><u>${PROTA_PROMES_SEKOLAH_INFO.kepalaSekolah}</u></b><br>
              NIP. ${PROTA_PROMES_SEKOLAH_INFO.nipKepalaSekolah}
            </td>
            <td width="50%">
              ${PROTA_PROMES_SEKOLAH_INFO.tempatTanggal}<br>
              Guru Mata Pelajaran PAI & BP
              <br><br><br><br>
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
    link.download = `PROMES_PAI_Kelas_${activeKelas}_Sem_${activeSemester}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onNotify) onNotify("Dokumen Word PROMES berhasil diunduh!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-900/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wide">
                Administrasi PAI
              </span>
              <span className="text-xs text-teal-200 font-semibold">
                Matriks Mingguan • Kurikulum Merdeka
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
              <CalendarRange className="w-6 h-6 text-amber-300" />
              Program Semester (PROMES) PAI &amp; Budi Pekerti
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-3xl leading-relaxed">
              Distribusi alokasi waktu per pekan dalam satu semester (Semester 1 / Ganjil &amp; Semester 2 / Genap)
              dilengkapi penanda kegiatan kalender pendidikan (MPLS, STS, SAS/SAT, Remedial, Raport, dan Libur).
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Pratinjau & Cetak Format A4 Landscape"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak A4 Landscape</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-teal-950/80 hover:bg-teal-950 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-teal-600/40 cursor-pointer"
              title="Unduh Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-300" />
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3.5 py-2 bg-teal-950/80 hover:bg-teal-950 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-teal-600/40 cursor-pointer"
              title="Unduh Word (.doc)"
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Unduh Word</span>
            </button>
          </div>
        </div>

        {/* Class and Semester Dual Controls */}
        <div className="mt-5 pt-4 border-t border-teal-700/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class tabs */}
            <div className="flex items-center gap-1 bg-teal-950/50 p-1 rounded-xl border border-teal-600/40">
              {(["VII", "VIII", "IX"] as const).map((kelas) => (
                <button
                  key={kelas}
                  onClick={() => setActiveKelas(kelas)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition ${
                    activeKelas === kelas
                      ? "bg-white text-teal-900 shadow-md scale-[1.02]"
                      : "text-teal-100 hover:bg-white/15"
                  }`}
                >
                  Kelas {kelas}
                </button>
              ))}
            </div>

            {/* Semester tabs */}
            <div className="flex items-center gap-1 bg-teal-950/50 p-1 rounded-xl border border-teal-600/40">
              <button
                onClick={() => setActiveSemester("1")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                  activeSemester === "1"
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "text-teal-100 hover:bg-white/15"
                }`}
              >
                🍁 Semester 1 (Juli - Des)
              </button>
              <button
                onClick={() => setActiveSemester("2")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                  activeSemester === "2"
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "text-teal-100 hover:bg-white/15"
                }`}
              >
                🌸 Semester 2 (Jan - Jun)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-teal-100">
            <button
              onClick={handleResetDefault}
              className="px-3 py-1.5 bg-teal-900/60 hover:bg-teal-950 text-teal-200 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 border border-teal-700/50 transition cursor-pointer"
              title="Reset ke alokasi baku Kurikulum Merdeka"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-black flex items-center gap-1 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris Materi</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats & Legend Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Target Semester {activeSemester}</div>
              <div className="text-lg font-black text-slate-900">{totalJpSemester} JP</div>
              <div className="text-[10px] text-emerald-700 font-semibold">18 Pekan KBM Aktif</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Jumlah Bab</div>
              <div className="text-lg font-black text-slate-900">{currentItems.length} Materi Bab</div>
              <div className="text-[10px] text-sky-700 font-semibold">Kelas {activeKelas}</div>
            </div>
          </div>
        </div>

        {/* Legend bar */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Petunjuk Warna &amp; Kode Kalender Pendidikan:</span>
            <span className="text-[10px] text-emerald-700 font-semibold lowercase">
              💡 klik sel angka untuk mengubah/menandai jam JP
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>KBM Efektif (3 JP)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>MPLS / Ta'aruf</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-100 text-sky-900 rounded-lg border border-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>STS (Sumatif Tengah Semester)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-900 rounded-lg border border-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>SAS / SAT (Sumatif Akhir)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-900 rounded-lg border border-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Remedial &amp; Raport</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-200 text-slate-800 rounded-lg border border-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span>Libur Semester</span>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              Matriks Program Semester {activeSemester === "1" ? "1 (Ganjil)" : "2 (Genap)"} - Kelas {activeKelas}
            </h3>
          </div>
          <div className="text-[11px] font-bold text-slate-500">
            SMPN 2 Rebang Tangkas • TA {PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Row 1: Main Headers + Month Headers */}
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-center">
                <th rowSpan={2} className="px-2 py-2.5 w-10 border-r border-slate-200">No</th>
                <th rowSpan={2} className="px-3 py-2.5 text-left w-52 border-r border-slate-200">Lingkup Materi Pokok</th>
                <th rowSpan={2} className="px-3 py-2.5 text-left w-36 border-r border-slate-200">Elemen</th>
                <th rowSpan={2} className="px-2 py-2.5 w-14 border-r border-slate-200">Jml JP</th>

                {currentMonths.map((m) => (
                  <th
                    key={m.nama}
                    colSpan={m.weeks.length}
                    className="px-2 py-1.5 border-r border-slate-200 bg-slate-200/70 text-slate-900 font-black uppercase text-[11px]"
                  >
                    {m.nama}
                  </th>
                ))}
                <th rowSpan={2} className="px-2 py-2.5 w-20 text-center">Aksi</th>
              </tr>

              {/* Row 2: Week Numbers (1, 2, 3, 4, 5) */}
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-center text-[10px]">
                {currentMonths.map((m) =>
                  m.weeks.map((w) => {
                    const eventKey = `${m.nama}_${w}`;
                    const event = currentSpecialEvents[eventKey];
                    return (
                      <th
                        key={`${m.nama}-${w}`}
                        className={`p-1 border-r border-slate-200 w-8 ${
                          event ? event.color : ""
                        }`}
                        title={event ? event.full : `${m.nama} Pekan ke-${w}`}
                      >
                        {event ? event.label : w}
                      </th>
                    );
                  })
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-[11px]">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-2 py-2.5 text-center font-bold text-slate-500 border-r border-slate-200">
                    {item.noUrut}
                  </td>
                  <td className="px-3 py-2.5 border-r border-slate-200">
                    <div className="font-bold text-slate-900 leading-snug">{item.bab}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{item.materiPokok}</div>
                  </td>
                  <td className="px-3 py-2.5 border-r border-slate-200 text-slate-600 font-medium">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                      {item.elemen}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center font-black text-emerald-800 text-xs border-r border-slate-200">
                    {item.alokasiWaktuJp} JP
                  </td>

                  {/* Month & Week Cells */}
                  {currentMonths.map((m) =>
                    m.weeks.map((w) => {
                      const key = `${m.nama}_${w}`;
                      const val = item.jadwalMingguan?.[key];
                      const event = currentSpecialEvents[key];

                      return (
                        <td
                          key={key}
                          onClick={() => handleToggleCell(item.id, m.nama, w)}
                          className={`p-1 text-center font-black border-r border-slate-200 transition cursor-pointer select-none ${
                            typeof val === "number" && val > 0
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                              : event
                              ? `${event.color} opacity-40 hover:opacity-80`
                              : "hover:bg-emerald-100/60 text-slate-300"
                          }`}
                          title={`Klik untuk mengatur JP (${m.nama} Minggu ${w})`}
                        >
                          {typeof val === "number" && val > 0 ? val : ""}
                        </td>
                      );
                    })
                  )}

                  <td className="px-2 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded"
                        title="Edit Baris"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={25}
                    className="px-4 py-8 text-center text-slate-400 italic"
                  >
                    Belum ada data materi untuk Kelas {activeKelas} Semester {activeSemester}.
                  </td>
                </tr>
              )}

              {/* Weekly Sum Row */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300 text-center">
                <td colSpan={3} className="px-3 py-2 text-right uppercase tracking-wider text-[10px]">
                  Jumlah Jam KBM per Pekan:
                </td>
                <td className="px-2 py-2 text-center text-emerald-900 text-xs border-r border-slate-200">
                  {totalJpSemester} JP
                </td>

                {currentMonths.map((m) =>
                  m.weeks.map((w) => {
                    const sum = getWeeklySum(m.nama, w);
                    return (
                      <td
                        key={`sum-${m.nama}-${w}`}
                        className={`p-1 border-r border-slate-200 text-xs ${
                          sum > 0 ? "bg-emerald-100 text-emerald-950 font-black" : "text-slate-300"
                        }`}
                      >
                        {sum > 0 ? sum : "-"}
                      </td>
                    );
                  })
                )}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-teal-700" />
                <span>{editingItem ? "Edit Materi PROMES" : "Tambah Materi ke PROMES"}</span>
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
                  <label className="block font-bold text-slate-700 mb-1">Bab Pelajaran</label>
                  <input
                    type="text"
                    value={formBab}
                    onChange={(e) => setFormBab(e.target.value)}
                    placeholder="Contoh: Bab 1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Urut</label>
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
                <label className="block font-bold text-slate-700 mb-1">Lingkup Materi Pokok</label>
                <input
                  type="text"
                  value={formMateri}
                  onChange={(e) => setFormMateri(e.target.value)}
                  placeholder="Contoh: Al-Qur'an dan Hadis Pedoman Hidup (Q.S. al-Anbiya: 107)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Elemen Capaian</label>
                  <select
                    value={formElemen}
                    onChange={(e) => setFormElemen(e.target.value as PromesItem["elemen"])}
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
                  <label className="block font-bold text-slate-700 mb-1">Total Alokasi (JP)</label>
                  <input
                    type="number"
                    value={formJp}
                    onChange={(e) => setFormJp(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-teal-800"
                    min="1"
                    max="36"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alur Tujuan Pembelajaran</label>
                <textarea
                  value={formTujuan}
                  onChange={(e) => setFormTujuan(e.target.value)}
                  placeholder="Uraian ringkas tujuan pembelajaran..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Contoh: 4 Pekan KBM Aktif"
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
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black shadow-sm cursor-pointer"
                >
                  Simpan Baris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL (LANDSCAPE A4) */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-teal-700" />
                  <span>Pratinjau Cetak Program Semester (PROMES) A4 Landscape</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Format resmi UPT SMPN 2 Rebang Tangkas lengkap matriks mingguan dan pengesahan
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
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

            {/* Printable Landscape Sheet */}
            <div className="bg-white p-6 sm:p-8 border border-slate-300 shadow-md font-serif text-black leading-tight space-y-4 rounded-sm overflow-x-auto">
              {/* KOP */}
              <div className="text-center border-b-2 border-black pb-2 space-y-0.5">
                <div className="text-xs font-bold uppercase">{PROTA_PROMES_SEKOLAH_INFO.dinas}</div>
                <div className="text-xs font-bold uppercase">{PROTA_PROMES_SEKOLAH_INFO.subDinas}</div>
                <div className="text-base font-black uppercase text-slate-900">
                  {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}
                </div>
                <div className="text-[9px] text-slate-600">{PROTA_PROMES_SEKOLAH_INFO.alamat}</div>
              </div>

              {/* JUDUL */}
              <div className="text-center space-y-0.5">
                <h2 className="text-sm font-black uppercase underline">PROGRAM SEMESTER (PROMES)</h2>
                <div className="text-[11px] font-bold uppercase">
                  KURIKULUM MERDEKA - SEMESTER {activeSemester === "1" ? "1 (GANJIL)" : "2 (GENAP)"} TAHUN AJARAN {PROTA_PROMES_SEKOLAH_INFO.tahunAjaran}
                </div>
              </div>

              {/* IDENTITAS */}
              <div className="flex justify-between text-[10.5px] border-y border-black py-1.5">
                <div>
                  <b>Mata Pelajaran:</b> {PROTA_PROMES_SEKOLAH_INFO.mataPelajaran} &nbsp;|&nbsp;
                  <b>Kelas / Fase:</b> {activeKelas} / {PROTA_PROMES_SEKOLAH_INFO.fase}
                </div>
                <div>
                  <b>Alokasi Waktu:</b> 3 JP / Pekan &nbsp;|&nbsp;
                  <b>Total Semester:</b> {totalJpSemester} JP
                </div>
              </div>

              {/* MATRIKS TABEL */}
              <table className="w-full text-left text-[9px] border-collapse border border-black">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th rowSpan={2} className="border border-black p-1 w-6">No</th>
                    <th rowSpan={2} className="border border-black p-1 text-left w-48">Materi Pokok / Bab</th>
                    <th rowSpan={2} className="border border-black p-1 text-left w-24">Elemen</th>
                    <th rowSpan={2} className="border border-black p-1 w-10">JP</th>
                    {currentMonths.map((m) => (
                      <th
                        key={m.nama}
                        colSpan={m.weeks.length}
                        className="border border-black p-1 font-bold uppercase"
                      >
                        {m.nama}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-slate-50 text-center font-bold">
                    {currentMonths.map((m) =>
                      m.weeks.map((w) => (
                        <th key={`${m.nama}-${w}`} className="border border-black p-0.5 w-6">
                          {w}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black p-1 text-center font-bold">{item.noUrut}</td>
                      <td className="border border-black p-1">
                        <b>{item.bab}:</b> {item.materiPokok}
                      </td>
                      <td className="border border-black p-1">{item.elemen}</td>
                      <td className="border border-black p-1 text-center font-bold">{item.alokasiWaktuJp}</td>
                      {currentMonths.map((m) =>
                        m.weeks.map((w) => {
                          const key = `${m.nama}_${w}`;
                          const val = item.jadwalMingguan?.[key];
                          return (
                            <td key={key} className="border border-black p-0.5 text-center font-bold">
                              {val || ""}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={3} className="border border-black p-1 text-right">
                      Jumlah Jam Pelajaran:
                    </td>
                    <td className="border border-black p-1 text-center font-bold">{totalJpSemester}</td>
                    {currentMonths.map((m) =>
                      m.weeks.map((w) => {
                        const sum = getWeeklySum(m.nama, w);
                        return (
                          <td key={`sum-${m.nama}-${w}`} className="border border-black p-0.5 text-center">
                            {sum > 0 ? sum : ""}
                          </td>
                        );
                      })
                    )}
                  </tr>
                </tbody>
              </table>

              {/* TANDA TANGAN */}
              <div className="pt-4 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div>Mengetahui,</div>
                  <div>Kepala {PROTA_PROMES_SEKOLAH_INFO.namaSekolah}</div>
                  <div className="h-16"></div>
                  <div className="font-bold underline">{PROTA_PROMES_SEKOLAH_INFO.kepalaSekolah}</div>
                  <div>NIP. {PROTA_PROMES_SEKOLAH_INFO.nipKepalaSekolah}</div>
                </div>

                <div>
                  <div>{PROTA_PROMES_SEKOLAH_INFO.tempatTanggal}</div>
                  <div>Guru Mata Pelajaran PAI &amp; BP</div>
                  <div className="h-16"></div>
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
