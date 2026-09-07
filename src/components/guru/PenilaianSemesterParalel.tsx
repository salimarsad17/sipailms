/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FileSpreadsheet,
  Printer,
  Check,
  X,
  Filter,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Download,
  Users,
  Calendar,
  Layers,
  Info,
  Zap,
  Target,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Copy,
  AlertTriangle,
  Save,
  Wand2,
  CalendarDays
} from "lucide-react";
import { Siswa, NilaiSemesterParalel, Kelas } from "../../types";

interface PenilaianSemesterParalelProps {
  students: Siswa[];
  classes: Kelas[];
  nilaiParalelList: NilaiSemesterParalel[];
  onUpdateNilaiParalelList: (newList: NilaiSemesterParalel[]) => void;
}

export default function PenilaianSemesterParalel({
  students,
  classes,
  nilaiParalelList,
  onUpdateNilaiParalelList
}: PenilaianSemesterParalelProps) {
  // Navigation & Filtering state
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2">("1");
  const [selectedKelasParalel, setSelectedKelasParalel] = useState<string>("7A");
  const [selectedMapel, setSelectedMapel] = useState<string>("PAI dan Budi Pekerti");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<NilaiSemesterParalel | null>(null);

  // Print Mode State
  const [isPrintViewOpen, setIsPrintViewOpen] = useState<boolean>(false);
  const [printTanggalCetak, setPrintTanggalCetak] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  // Default initial dates array for UH 1 to 12
  const defaultUhDates = [
    "2026-07-20", "2026-08-03", "2026-08-18", "2026-09-01",
    "2026-09-15", "2026-09-29", "2026-10-13", "2026-10-27",
    "2026-11-10", "2026-11-24", "2026-12-01", "2026-12-08"
  ];

  // Helper to ensure 12 dates array
  const ensure12Dates = (dates?: string[]): string[] => {
    const arr = Array.isArray(dates) ? [...dates] : [];
    return Array.from({ length: 12 }, (_, i) => arr[i] || defaultUhDates[i] || "");
  };

  // Helper to get Indonesian day name and info
  const getDayInfo = (dateStr?: string) => {
    if (!dateStr) return { dayName: "-", isWeekend: false, isSunday: false, isSaturday: false, formatted: "Belum diatur" };
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const dayIndex = d.getDay(); // 0 is Sunday, 6 is Saturday
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dayName = days[dayIndex] || "-";
        const isSunday = dayIndex === 0;
        const isSaturday = dayIndex === 6;
        const isWeekend = isSunday || isSaturday;
        const formatted = d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        return { dayName, isWeekend, isSunday, isSaturday, formatted };
      }
    } catch {}
    return { dayName: "-", isWeekend: false, isSunday: false, isSaturday: false, formatted: dateStr };
  };

  // Helper to add days skipping weekends if desired
  const addDaysToDate = (dateStr: string, days: number, skipWeekend: boolean = true): string => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setDate(d.getDate() + days);
      
      if (skipWeekend) {
        if (d.getDay() === 0) {
          d.setDate(d.getDate() + 1); // Minggu -> Senin
        } else if (d.getDay() === 6) {
          d.setDate(d.getDate() + 2); // Sabtu -> Senin
        }
      }
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return dateStr;
    }
  };

  // Form State for Add/Edit
  const [formData, setFormData] = useState<{
    id: string;
    siswaNisn: string;
    siswaNama: string;
    kelasParalel: string;
    semester: "1" | "2";
    mapel: string;
    uhList: number[];
    uhDates: string[];
    pts: number;
    ptsDate: string;
    pas: number;
    pasDate: string;
    kkm: number;
  }>({
    id: "",
    siswaNisn: "",
    siswaNama: "",
    kelasParalel: "7A",
    semester: "1",
    mapel: "PAI dan Budi Pekerti",
    uhList: [80, 85, 78, 82, 90, 88, 75, 80, 84, 86, 78, 85],
    uhDates: [...defaultUhDates],
    pts: 80,
    ptsDate: "2026-10-05",
    pas: 85,
    pasDate: "2026-12-15",
    kkm: 75
  });

  // Quick Inline Table Edit Mode (Enabled by default for maximum speed)
  const [isQuickEditMode, setIsQuickEditMode] = useState<boolean>(true);

  // Batch Date Setter Modal State
  const [isBatchDateModalOpen, setIsBatchDateModalOpen] = useState<boolean>(false);
  const [batchUhDates, setBatchUhDates] = useState<string[]>([...defaultUhDates]);
  const [batchPtsDate, setBatchPtsDate] = useState<string>("2026-10-05");
  const [batchPasDate, setBatchPasDate] = useState<string>("2026-12-15");
  const [batchDateScope, setBatchDateScope] = useState<"current" | "level" | "all">("current");
  const [filterUhTab, setFilterUhTab] = useState<"all" | "uh1-6" | "uh7-12" | "ujian">("all");
  const [showAutoRoutine, setShowAutoRoutine] = useState<boolean>(false);
  const [autoGenStartDate, setAutoGenStartDate] = useState<string>("2026-07-20");
  const [autoGenInterval, setAutoGenInterval] = useState<number>(14);
  const [autoGenSkipWeekend, setAutoGenSkipWeekend] = useState<boolean>(true);

  // Batch Score Setter Modal State
  const [isBatchScoreModalOpen, setIsBatchScoreModalOpen] = useState<boolean>(false);
  const [batchScoreTarget, setBatchScoreTarget] = useState<string>("all_uh"); // "all_uh" | "uh1".."uh12" | "pts" | "pas"
  const [batchScoreVal, setBatchScoreVal] = useState<number>(85);

  // Inline Direct Table Edit Handler
  const handleInlineScoreChange = (
    rec: NilaiSemesterParalel,
    field: "uh" | "pts" | "pas",
    index: number,
    newVal: number
  ) => {
    const score = isNaN(newVal) ? 0 : Math.min(100, Math.max(0, newVal));
    let updatedList = [...nilaiParalelList];
    const existingIdx = updatedList.findIndex(
      (r) =>
        r.id === rec.id ||
        (r.siswaNisn === rec.siswaNisn &&
          r.kelasParalel === rec.kelasParalel &&
          r.semester === rec.semester &&
          r.mapel === rec.mapel)
    );

    let targetRec: NilaiSemesterParalel;
    if (existingIdx >= 0) {
      targetRec = { ...updatedList[existingIdx] };
    } else {
      targetRec = { ...rec };
    }

    if (field === "uh") {
      const newUh = [...targetRec.uhList];
      newUh[index] = score;
      targetRec.uhList = newUh;
    } else if (field === "pts") {
      targetRec.pts = score;
    } else if (field === "pas") {
      targetRec.pas = score;
    }

    if (existingIdx >= 0) {
      updatedList[existingIdx] = targetRec;
    } else {
      updatedList.push(targetRec);
    }

    onUpdateNilaiParalelList(updatedList);
  };

  // Batch Fill UH/PTS/PAS Scores for entire class
  const handleSaveBatchScores = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...nilaiParalelList];

    activeRecords.forEach((rec) => {
      const index = updatedList.findIndex((r) => r.id === rec.id);
      let targetRec = index >= 0 ? { ...updatedList[index] } : { ...rec };

      if (batchScoreTarget === "all_uh") {
        targetRec.uhList = Array(12).fill(batchScoreVal);
      } else if (batchScoreTarget.startsWith("uh")) {
        const uhIdx = parseInt(batchScoreTarget.replace("uh", ""), 10) - 1;
        if (uhIdx >= 0 && uhIdx < 12) {
          const newUh = [...targetRec.uhList];
          newUh[uhIdx] = batchScoreVal;
          targetRec.uhList = newUh;
        }
      } else if (batchScoreTarget === "pts") {
        targetRec.pts = batchScoreVal;
      } else if (batchScoreTarget === "pas") {
        targetRec.pas = batchScoreVal;
      }

      if (index >= 0) {
        updatedList[index] = targetRec;
      } else {
        updatedList.push(targetRec);
      }
    });

    onUpdateNilaiParalelList(updatedList);
    setIsBatchScoreModalOpen(false);
    showToast(`Berhasil menerapkan nilai ${batchScoreVal} untuk seluruh siswa Kelas ${selectedKelasParalel}`);
  };

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // List of parallel classes available
  const allParallelClasses = [
    { level: "Kelas 7", items: ["7A", "7B", "7C", "7D"] },
    { level: "Kelas 8", items: ["8A", "8B", "8C", "8D"] },
    { level: "Kelas 9", items: ["9A", "9B", "9C", "9D"] }
  ];

  const mapelOptions = [
    "PAI dan Budi Pekerti",
    "Al-Qur'an Hadis",
    "Akidah Akhlak",
    "Fiqih",
    "Sejarah Kebudayaan Islam"
  ];

  // Map student classId to standard parallel class (e.g., "VII-A" -> "7A")
  const normalizeClassId = (rawId: string): string => {
    if (!rawId) return "7A";
    const cleaned = rawId.toUpperCase().trim();
    if (cleaned.startsWith("VII-")) return "7" + cleaned.replace("VII-", "");
    if (cleaned.startsWith("VIII-")) return "8" + cleaned.replace("VIII-", "");
    if (cleaned.startsWith("IX-")) return "9" + cleaned.replace("IX-", "");
    if (cleaned.startsWith("KELAS ")) return cleaned.replace("KELAS ", "").replace("-", "");
    return cleaned;
  };

  // Helper to compute average of 12 UH/T values
  const computeRerataUH = (uhList: number[]): number => {
    if (!uhList || uhList.length === 0) return 0;
    const validScores = uhList.filter((s) => s > 0);
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / validScores.length);
  };

  // Helper to compute final grade
  const computeNilaiAkhir = (rerataUH: number, pts: number, pas: number): number => {
    if (rerataUH === 0 && pts === 0 && pas === 0) return 0;
    return Math.round((rerataUH + pts + pas) / 3);
  };

  // Helper to apply score text color based on 75 boundary
  // >= 75 is Black ('text-slate-900 font-bold')
  // < 75 is Red ('text-red-600 font-extrabold bg-red-50 px-1 py-0.5 rounded border border-red-200')
  const getScoreTextStyle = (score: number, kkm: number = 75): string => {
    if (score === 0) return "text-slate-400 font-normal";
    if (score >= kkm) {
      return "text-slate-900 font-bold";
    }
    return "text-red-600 font-extrabold bg-red-50/90 px-1 py-0.5 rounded border border-red-200/80";
  };

  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  const formatDateFullIndo = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatDateIndoLong = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateIndoDateOnly = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  // Sync / generate records from DATA SISWA if needed
  const activeRecords = useMemo(() => {
    // Get students matching selected parallel class
    const matchingStudents = students.filter((st) => {
      const norm = normalizeClassId(st.kelasId);
      return norm === selectedKelasParalel;
    });

    // Merge existing stored records with students from DATA SISWA
    let list = nilaiParalelList.filter((r) => {
      return (
        r.semester === selectedSemester &&
        r.kelasParalel === selectedKelasParalel &&
        r.mapel === selectedMapel
      );
    });

    // If some students from DATA SISWA are not in record list, auto-create initial entries
    matchingStudents.forEach((st) => {
      const exists = list.some((r) => r.siswaNisn === st.nisn);
      if (!exists) {
        const newRecord: NilaiSemesterParalel = {
          id: `nil_${st.nisn}_sem${selectedSemester}_${selectedKelasParalel}`,
          siswaNisn: st.nisn,
          siswaNama: st.nama,
          kelasParalel: selectedKelasParalel,
          semester: selectedSemester,
          mapel: selectedMapel,
          uhList: [80, 82, 78, 85, 88, 90, 74, 82, 85, 80, 76, 84], // sample realistic grades
          uhDates: [...defaultUhDates],
          pts: 82,
          ptsDate: "2026-10-05",
          pas: 85,
          pasDate: "2026-12-15",
          kkm: 75
        };
        list.push(newRecord);
      }
    });

    // Ensure dates exist and student names match Data Siswa
    list = list.map((r) => {
      const matchSt = students.find((st) => st.nisn === r.siswaNisn);
      return {
        ...r,
        siswaNama: matchSt ? matchSt.nama : r.siswaNama,
        uhDates: ensure12Dates(r.uhDates),
        ptsDate: r.ptsDate || "2026-10-05",
        pasDate: r.pasDate || "2026-12-15"
      };
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.siswaNama.toLowerCase().includes(query) ||
          r.siswaNisn.includes(query) ||
          r.kelasParalel.toLowerCase().includes(query)
      );
    }

    return list.sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
  }, [students, nilaiParalelList, selectedSemester, selectedKelasParalel, selectedMapel, searchQuery]);

  // Open modal for new record
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    const existingRef = activeRecords[0];
    setFormData({
      id: "nil_" + Date.now(),
      siswaNisn: students[0]?.nisn || "0091122334",
      siswaNama: students[0]?.nama || "Siswa Baru",
      kelasParalel: selectedKelasParalel,
      semester: selectedSemester,
      mapel: selectedMapel,
      uhList: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
      uhDates: ensure12Dates(existingRef?.uhDates),
      pts: 80,
      ptsDate: existingRef?.ptsDate || "2026-10-05",
      pas: 80,
      pasDate: existingRef?.pasDate || "2026-12-15",
      kkm: 75
    });
    setIsModalOpen(true);
  };

  // Open modal for editing record
  const handleOpenEditModal = (rec: NilaiSemesterParalel) => {
    setEditingRecord(rec);
    setFormData({
      id: rec.id,
      siswaNisn: rec.siswaNisn,
      siswaNama: rec.siswaNama,
      kelasParalel: rec.kelasParalel,
      semester: rec.semester,
      mapel: rec.mapel,
      uhList: [...rec.uhList],
      uhDates: ensure12Dates(rec.uhDates),
      pts: rec.pts,
      ptsDate: rec.ptsDate || "2026-10-05",
      pas: rec.pas,
      pasDate: rec.pasDate || "2026-12-15",
      kkm: rec.kkm || 75
    });
    setIsModalOpen(true);
  };

  // Open Batch Date Setter Modal
  const handleOpenBatchDateModal = (focusIndex?: number) => {
    const ref = activeRecords[0];
    const currentDates = ref?.uhDates;
    const safeDates = ensure12Dates(currentDates);
    setBatchUhDates(safeDates);
    setBatchPtsDate(ref?.ptsDate || "2026-10-05");
    setBatchPasDate(ref?.pasDate || "2026-12-15");
    setBatchDateScope("current");
    setAutoGenStartDate(safeDates[0] || "2026-07-20");
    if (focusIndex !== undefined) {
      if (focusIndex < 6) setFilterUhTab("uh1-6");
      else setFilterUhTab("uh7-12");
    } else {
      setFilterUhTab("all");
    }
    setIsBatchDateModalOpen(true);
  };

  // Helper actions for individual UH date editing
  const handleUpdateSingleUhDate = (index: number, val: string) => {
    const updated = [...batchUhDates];
    updated[index] = val;
    setBatchUhDates(updated);
  };

  const handleSetSingleUhToday = (index: number) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    handleUpdateSingleUhDate(index, `${y}-${m}-${d}`);
  };

  const handleAddDaysToSingleUh = (index: number, days: number) => {
    const base = batchUhDates[index] || (index > 0 ? batchUhDates[index - 1] : new Date().toISOString().split("T")[0]);
    const nextDate = addDaysToDate(base, days, true);
    handleUpdateSingleUhDate(index, nextDate);
  };

  const handleCopyPrevUhDate = (index: number) => {
    if (index === 0) return;
    const prev = batchUhDates[index - 1];
    if (prev) {
      handleUpdateSingleUhDate(index, prev);
    }
  };

  const handleClearSingleUhDate = (index: number) => {
    handleUpdateSingleUhDate(index, "");
  };

  // Bulk date helpers
  const handleGenerateRoutineDates = () => {
    if (!autoGenStartDate) {
      showToast("Silakan tentukan tanggal mulai terlebih dahulu.");
      return;
    }
    const newDates: string[] = [];
    let curDate = autoGenStartDate;

    try {
      const parts = curDate.split("-");
      let d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (autoGenSkipWeekend) {
        if (d.getDay() === 0) d.setDate(d.getDate() + 1);
        else if (d.getDay() === 6) d.setDate(d.getDate() + 2);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        curDate = `${y}-${m}-${day}`;
      }
    } catch {}

    newDates.push(curDate);

    for (let i = 1; i < 12; i++) {
      curDate = addDaysToDate(curDate, autoGenInterval, autoGenSkipWeekend);
      newDates.push(curDate);
    }

    setBatchUhDates(newDates);
    showToast("Jadwal UH 1 s/d UH 12 berhasil dibuat secara otomatis!");
  };

  const handleResetToDefaultDates = () => {
    setBatchUhDates([...defaultUhDates]);
    setBatchPtsDate("2026-10-05");
    setBatchPasDate("2026-12-15");
    showToast("Tanggal evaluasi dikembalikan ke standar kalender.");
  };

  const handleClearAllUhDates = () => {
    setBatchUhDates(Array(12).fill(""));
    showToast("Semua tanggal UH 1 s/d 12 dikosongkan.");
  };

  const handleSetAllToToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;
    setBatchUhDates(Array(12).fill(todayStr));
    showToast("Seluruh tanggal UH 1 s/d 12 diisi tanggal hari ini.");
  };

  // Save Batch Dates with Scope Support
  const handleSaveBatchDates = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...nilaiParalelList];

    // Determine target classes based on batchDateScope
    let targetClasses: string[] = [selectedKelasParalel];
    if (batchDateScope === "level") {
      const currentLevel = selectedKelasParalel.charAt(0);
      const group = allParallelClasses.find((g) => g.level.includes(currentLevel));
      if (group) {
        targetClasses = group.items;
      }
    } else if (batchDateScope === "all") {
      targetClasses = allParallelClasses.flatMap((g) => g.items);
    }

    let countUpdated = 0;

    targetClasses.forEach((cls) => {
      const classStudents = students.filter((st) => normalizeClassId(st.kelasId) === cls);
      classStudents.forEach((st) => {
        countUpdated++;
        const index = updatedList.findIndex(
          (r) =>
            r.siswaNisn === st.nisn &&
            r.kelasParalel === cls &&
            r.semester === selectedSemester &&
            r.mapel === selectedMapel
        );

        if (index >= 0) {
          updatedList[index] = {
            ...updatedList[index],
            uhDates: [...batchUhDates],
            ptsDate: batchPtsDate,
            pasDate: batchPasDate
          };
        } else {
          updatedList.push({
            id: `nil_${st.nisn}_sem${selectedSemester}_${cls}`,
            siswaNisn: st.nisn,
            siswaNama: st.nama,
            kelasParalel: cls,
            semester: selectedSemester,
            mapel: selectedMapel,
            uhList: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
            uhDates: [...batchUhDates],
            pts: 80,
            ptsDate: batchPtsDate,
            pas: 80,
            pasDate: batchPasDate,
            kkm: 75
          });
        }
      });
    });

    onUpdateNilaiParalelList(updatedList);
    setIsBatchDateModalOpen(false);

    if (batchDateScope === "all") {
      showToast(`Berhasil menerapkan tanggal evaluasi untuk SELURUH kelas paralel (${countUpdated} data siswa)`);
    } else if (batchDateScope === "level") {
      showToast(`Berhasil menerapkan tanggal evaluasi untuk Tingkat Kelas ${selectedKelasParalel.charAt(0)} (${countUpdated} data siswa)`);
    } else {
      showToast(`Berhasil menerapkan tanggal evaluasi untuk Kelas ${selectedKelasParalel} (${countUpdated} data siswa)`);
    }
  };

  // Handle student selection change in modal
  const handleSelectStudentChange = (nisn: string) => {
    const selectedSiswa = students.find((s) => s.nisn === nisn);
    if (selectedSiswa) {
      setFormData((prev) => ({
        ...prev,
        siswaNisn: selectedSiswa.nisn,
        siswaNama: selectedSiswa.nama,
        kelasParalel: normalizeClassId(selectedSiswa.kelasId) || prev.kelasParalel
      }));
    }
  };

  // Update specific UH value in modal form
  const handleUhChange = (index: number, val: number) => {
    const newUh = [...formData.uhList];
    newUh[index] = Math.min(100, Math.max(0, val));
    setFormData((prev) => ({ ...prev, uhList: newUh }));
  };

  // Update specific UH Date in modal form
  const handleUhDateChange = (index: number, val: string) => {
    const newDates = [...formData.uhDates];
    newDates[index] = val;
    setFormData((prev) => ({ ...prev, uhDates: newDates }));
  };

  // Save Add/Edit Record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siswaNama.trim()) {
      alert("Nama siswa tidak boleh kosong!");
      return;
    }

    let updatedList = [...nilaiParalelList];
    const index = updatedList.findIndex((r) => r.id === formData.id);

    if (index >= 0) {
      updatedList[index] = { ...formData };
      showToast(`Berhasil memperbarui data nilai ${formData.siswaNama}`);
    } else {
      updatedList.push({ ...formData });
      showToast(`Berhasil menambahkan data nilai baru ${formData.siswaNama}`);
    }

    onUpdateNilaiParalelList(updatedList);
    setIsModalOpen(false);
  };

  // Delete Record
  const handleDeleteRecord = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus rekap nilai untuk ${nama}?`)) {
      const filtered = nilaiParalelList.filter((r) => r.id !== id);
      onUpdateNilaiParalelList(filtered);
      showToast(`Data nilai ${nama} berhasil dihapus.`);
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    let csv = `REKAPITULASI PENILAIAN PER KELAS PARALEL - UPT SMPN 2 REBANG TANGKAS\n`;
    csv += `Kelas Paralel: ${selectedKelasParalel} | Semester: ${selectedSemester} | Mapel: ${selectedMapel}\n`;
    csv += `KKM Acuan: 75 | Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}\n\n`;

    // Table Header
    csv += `No,NISN,Nama Siswa,Kelas,Mapel,Semester,UH 1,UH 2,UH 3,UH 4,UH 5,UH 6,UH 7,UH 8,UH 9,UH 10,UH 11,UH 12,Rerata UH/T,PTS,PAS,Nilai Akhir,KKM,Ketuntasan\n`;

    activeRecords.forEach((r, idx) => {
      const rerataUH = computeRerataUH(r.uhList);
      const nilaiAkhir = computeNilaiAkhir(rerataUH, r.pts, r.pas);
      const isTuntas = nilaiAkhir >= (r.kkm || 75);
      const statusText = isTuntas ? "TUNTAS" : "BELUM TUNTAS";

      const uhCols = r.uhList.join(",");
      csv += `${idx + 1},="${r.siswaNisn}",${r.siswaNama},${r.kelasParalel},${r.mapel},Semester ${r.semester},${uhCols},${rerataUH},${r.pts},${r.pas},${nilaiAkhir},${r.kkm || 75},${statusText}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PENILAIAN_PARALEL_${selectedKelasParalel}_SEM_${selectedSemester}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Print PDF Dialog
  const handlePrintPdf = () => {
    setIsPrintViewOpen(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-slideDown max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Main Feature Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Sistem Penilaian Akademik Paralel
            </span>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Rekapitulasi Nilai Per Kelas Paralel (7A-D, 8A-D, 9A-D)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pencatatan nilai terintegrasi dari DATA SISWA. Mendukung 12 Komponen Ulangan Harian/Tugas (UH 1 - 12), PTS, PAS, Evaluasi KKM (75), serta Ekspor Laporan Lengkap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Batas KKM</span>
              <span className="text-xs font-black text-amber-300">75 (Tuntas)</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Total Siswa</span>
              <span className="text-xs font-black text-emerald-300">{activeRecords.length} Murid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Semester Selector & Parallel Class Level Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        {/* Row 1: Semester Switcher & Mapel Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Semester Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Pilih Semester:
            </span>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setSelectedSemester("1")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 transition ${
                  selectedSemester === "1"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📘 Semester 1 (Ganjil)
              </button>
              <button
                onClick={() => setSelectedSemester("2")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 transition ${
                  selectedSemester === "2"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📙 Semester 2 (Genap)
              </button>
            </div>
          </div>

          {/* Mapel Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Mata Pelajaran:</span>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 w-full lg:w-64"
            >
              {mapelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Parallel Class Level Group Tabs (7A-D, 8A-D, 9A-D) */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Kelompok Kelas Paralel (DATA SISWA):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allParallelClasses.map((group) => (
              <div key={group.level} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-black text-slate-600 uppercase block">{group.level}</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {group.items.map((cls) => {
                    const isActive = selectedKelasParalel === cls;
                    return (
                      <button
                        key={cls}
                        onClick={() => setSelectedKelasParalel(cls)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-black text-center transition ${
                          isActive
                            ? "bg-slate-900 text-amber-300 shadow-md ring-2 ring-emerald-500"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Search & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Siswa (Nama / NISN / Kelas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsQuickEditMode(!isQuickEditMode)}
              className={`px-3 py-2 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm border ${
                isQuickEditMode
                  ? "bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-300 animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
              title="Aktifkan mode ketik nilai langsung di sel tabel tanpa modal"
            >
              <Zap className={`w-4 h-4 ${isQuickEditMode ? "text-amber-300" : "text-slate-600"}`} />
              <span>{isQuickEditMode ? "⚡ Edit Langsung Aktif" : "⚡ Mode Edit Langsung"}</span>
            </button>

            <button
              onClick={() => setIsBatchScoreModalOpen(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm border border-indigo-500"
              title="Isi nilai UH1-12, PTS, atau PAS secara masal untuk seluruh siswa di kelas"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>🎯 Input Nilai Massal</span>
            </button>

            <button
              onClick={handleOpenBatchDateModal}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm border border-amber-400"
              title="Atur tanggal pelaksanaan UH1-12, PTS, dan PAS serentak untuk seluruh siswa kelas"
            >
              <Calendar className="w-4 h-4 text-slate-900" />
              <span>📅 Atur Tanggal Evaluasi</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Data</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              title="Unduh Spreadsheet (.csv/.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh Excel</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              title="Cetak Berkas PDF Laporan Nilai"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Summary Header */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wide">
              Matriks Penilaian Kelas {selectedKelasParalel} – Semester {selectedSemester}
            </h3>
            <span className="text-[10px] bg-emerald-900/80 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700/50">
              {selectedMapel}
            </span>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="text-slate-300">Keterangan Warna Nilai:</span>
            <span className="flex items-center gap-1 text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-white"></span>
              Nilai ≥ 75 (Hitam / Tuntas)
            </span>
            <span className="flex items-center gap-1 text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Nilai &lt; 75 (Merah / Remedial)
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Header Row 1 */}
              <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px]">
                <th className="p-2.5 border-r border-slate-200 text-center w-10" rowSpan={2}>
                  No
                </th>
                <th className="p-2.5 border-r border-slate-200 min-w-[160px]" rowSpan={2}>
                  Nama Siswa
                </th>
                <th className="p-2.5 border-r border-slate-200 text-center w-16" rowSpan={2}>
                  Kelas
                </th>
                <th className="p-2.5 border-r border-slate-200 min-w-[120px]" rowSpan={2}>
                  Mapel
                </th>
                <th
                  className="p-2 text-center bg-emerald-100/70 text-emerald-950 border-r border-slate-200"
                  colSpan={13}
                >
                  Penilaian Formatif (Ulangan Harian & Tugas 1 s/d 12)
                </th>
                <th
                  className="p-2 text-center bg-amber-100/70 text-amber-950 border-r border-slate-200"
                  colSpan={2}
                >
                  Penilaian Sumatif
                </th>
                <th className="p-2.5 border-r border-slate-200 text-center w-20" rowSpan={2}>
                  Rerata Akhir
                </th>
                <th className="p-2.5 border-r border-slate-200 text-center w-24" rowSpan={2}>
                  KKM / Ketuntasan
                </th>
                <th className="p-2.5 text-center w-20" rowSpan={2}>
                  Aksi
                </th>
              </tr>

              {/* Header Row 2 with Execution Dates */}
              <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200 text-[9px] text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num, idx) => {
                  const dateVal = activeRecords[0]?.uhDates?.[idx];
                  return (
                    <th
                      key={num}
                      onClick={() => handleOpenBatchDateModal(idx)}
                      className="p-1 border-r border-slate-200 w-11 bg-emerald-50/50 hover:bg-emerald-100/80 cursor-pointer transition group"
                      title={dateVal ? `UH ${num}: Tanggal ${dateVal} (Klik untuk atur/edit tanggal)` : `UH ${num} (Klik untuk atur tanggal)`}
                    >
                      <div className="font-extrabold text-[9px] text-emerald-950 group-hover:text-emerald-700 flex items-center justify-center gap-0.5">
                        UH{num}
                      </div>
                      {dateVal ? (
                        <div className="text-[7.5px] text-emerald-800 font-semibold leading-none mt-0.5 group-hover:underline">
                          {formatDateShort(dateVal)}
                        </div>
                      ) : (
                        <div className="text-[7px] text-slate-400 leading-none mt-0.5 group-hover:text-emerald-700">+tgl</div>
                      )}
                    </th>
                  );
                })}
                <th className="p-1.5 border-r border-slate-200 w-12 bg-emerald-100/80 text-emerald-900 font-black">
                  Rerata
                </th>
                <th
                  onClick={() => {
                    handleOpenBatchDateModal();
                    setFilterUhTab("ujian");
                  }}
                  className="p-1 border-r border-slate-200 w-12 bg-amber-50/80 hover:bg-amber-100 cursor-pointer transition text-amber-950 font-bold group"
                  title={activeRecords[0]?.ptsDate ? `PTS: Tanggal ${activeRecords[0].ptsDate} (Klik untuk atur/edit)` : "PTS (Klik untuk atur tanggal)"}
                >
                  <div className="font-extrabold text-[9px] group-hover:text-amber-700">PTS</div>
                  {activeRecords[0]?.ptsDate ? (
                    <div className="text-[7.5px] text-amber-800 font-semibold leading-none mt-0.5 group-hover:underline">
                      {formatDateShort(activeRecords[0].ptsDate)}
                    </div>
                  ) : (
                    <div className="text-[7px] text-slate-400 leading-none mt-0.5 group-hover:text-amber-700">+tgl</div>
                  )}
                </th>
                <th
                  onClick={() => {
                    handleOpenBatchDateModal();
                    setFilterUhTab("ujian");
                  }}
                  className="p-1 border-r border-slate-200 w-12 bg-amber-50/80 hover:bg-amber-100 cursor-pointer transition text-amber-950 font-bold group"
                  title={activeRecords[0]?.pasDate ? `PAS: Tanggal ${activeRecords[0].pasDate} (Klik untuk atur/edit)` : "PAS (Klik untuk atur tanggal)"}
                >
                  <div className="font-extrabold text-[9px] group-hover:text-amber-700">PAS</div>
                  {activeRecords[0]?.pasDate ? (
                    <div className="text-[7.5px] text-amber-800 font-semibold leading-none mt-0.5 group-hover:underline">
                      {formatDateShort(activeRecords[0].pasDate)}
                    </div>
                  ) : (
                    <div className="text-[7px] text-slate-400 leading-none mt-0.5 group-hover:text-amber-700">+tgl</div>
                  )}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 font-medium text-slate-800 text-[11px]">
              {activeRecords.length === 0 ? (
                <tr>
                  <td colSpan={22} className="py-12 text-center text-slate-400 font-semibold space-y-1">
                    <Info className="w-8 h-8 mx-auto text-slate-300" />
                    <p>Belum ada data nilai untuk Kelas {selectedKelasParalel} Semester {selectedSemester}.</p>
                    <p className="text-[10px]">Klik tombol <strong>+ Tambah Data Nilai</strong> untuk memulai pengisian.</p>
                  </td>
                </tr>
              ) : (
                activeRecords.map((rec, index) => {
                  const rerataUH = computeRerataUH(rec.uhList);
                  const nilaiAkhir = computeNilaiAkhir(rerataUH, rec.pts, rec.pas);
                  const kkmVal = rec.kkm || 75;
                  const isTuntas = nilaiAkhir >= kkmVal;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                      {/* No */}
                      <td className="p-2 border-r border-slate-200 text-center font-extrabold text-slate-500 bg-slate-50/50">
                        {index + 1}
                      </td>

                      {/* Nama Siswa */}
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                        <div className="truncate max-w-[180px]" title={rec.siswaNama}>
                          {rec.siswaNama}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono font-normal block">
                          NISN: {rec.siswaNisn}
                        </span>
                      </td>

                      {/* Kelas Paralel */}
                      <td className="p-2 border-r border-slate-200 text-center font-black text-slate-700 bg-slate-50/30">
                        {rec.kelasParalel}
                      </td>

                      {/* Mapel */}
                      <td className="p-2 border-r border-slate-200 text-[10px] text-slate-600 font-medium truncate max-w-[120px]">
                        {rec.mapel}
                      </td>

                      {/* UH 1 to 12 Columns with direct input editing when isQuickEditMode is true */}
                      {rec.uhList.map((score, scoreIdx) => {
                        const dVal = rec.uhDates?.[scoreIdx];
                        if (isQuickEditMode) {
                          return (
                            <td key={scoreIdx} className="p-0.5 border-r border-slate-200 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={score === 0 ? "" : score}
                                onChange={(e) =>
                                  handleInlineScoreChange(
                                    rec,
                                    "uh",
                                    scoreIdx,
                                    e.target.value === "" ? 0 : Number(e.target.value)
                                  )
                                }
                                className={`w-10 p-1 text-center font-extrabold text-xs rounded border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  score < kkmVal
                                    ? "bg-red-50 text-red-600 border-red-300"
                                    : "bg-emerald-50/40 text-slate-900 border-slate-200"
                                }`}
                                title={`UH ${scoreIdx + 1}: ${score} ${dVal ? `(Tgl: ${formatDateShort(dVal)})` : ""}`}
                              />
                            </td>
                          );
                        }
                        return (
                          <td
                            key={scoreIdx}
                            className="p-1 border-r border-slate-200 text-center text-[10px]"
                            title={`UH ${scoreIdx + 1}: ${score} ${dVal ? `| Tanggal: ${formatDateFullIndo(dVal)}` : ""}`}
                          >
                            <span className={getScoreTextStyle(score, kkmVal)}>
                              {score}
                            </span>
                          </td>
                        );
                      })}

                      {/* Rerata UH */}
                      <td className="p-2 border-r border-slate-200 text-center bg-emerald-50/40">
                        <span className={getScoreTextStyle(rerataUH, kkmVal)}>
                          {rerataUH}
                        </span>
                      </td>

                      {/* PTS */}
                      <td
                        className="p-0.5 border-r border-slate-200 text-center bg-amber-50/30"
                        title={`PTS: ${rec.pts} ${rec.ptsDate ? `| Tanggal: ${formatDateFullIndo(rec.ptsDate)}` : ""}`}
                      >
                        {isQuickEditMode ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rec.pts === 0 ? "" : rec.pts}
                            onChange={(e) =>
                              handleInlineScoreChange(
                                rec,
                                "pts",
                                0,
                                e.target.value === "" ? 0 : Number(e.target.value)
                              )
                            }
                            className={`w-11 p-1 text-center font-extrabold text-xs rounded border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              rec.pts < kkmVal
                                ? "bg-red-50 text-red-600 border-red-300"
                                : "bg-white text-amber-900 border-amber-300"
                            }`}
                          />
                        ) : (
                          <span className={getScoreTextStyle(rec.pts, kkmVal)}>
                            {rec.pts}
                          </span>
                        )}
                      </td>

                      {/* PAS */}
                      <td
                        className="p-0.5 border-r border-slate-200 text-center bg-amber-50/30"
                        title={`PAS: ${rec.pas} ${rec.pasDate ? `| Tanggal: ${formatDateFullIndo(rec.pasDate)}` : ""}`}
                      >
                        {isQuickEditMode ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rec.pas === 0 ? "" : rec.pas}
                            onChange={(e) =>
                              handleInlineScoreChange(
                                rec,
                                "pas",
                                0,
                                e.target.value === "" ? 0 : Number(e.target.value)
                              )
                            }
                            className={`w-11 p-1 text-center font-extrabold text-xs rounded border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              rec.pas < kkmVal
                                ? "bg-red-50 text-red-600 border-red-300"
                                : "bg-white text-amber-900 border-amber-300"
                            }`}
                          />
                        ) : (
                          <span className={getScoreTextStyle(rec.pas, kkmVal)}>
                            {rec.pas}
                          </span>
                        )}
                      </td>

                      {/* Rerata Akhir */}
                      <td className="p-2 border-r border-slate-200 text-center font-black bg-slate-100/60">
                        <span className={`text-xs ${getScoreTextStyle(nilaiAkhir, kkmVal)}`}>
                          {nilaiAkhir}
                        </span>
                      </td>

                      {/* Ketuntasan KKM (75) */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        {isTuntas ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            ✓ Tuntas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                            ⚠ Remedial
                          </span>
                        )}
                      </td>

                      {/* Action Buttons (CRUD) */}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(rec)}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                            title="Edit Data Nilai"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec.id, rec.siswaNama)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus Rekap Nilai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT GRADE RECORD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                {editingRecord ? "Edit Nilai Murid" : "Tambah Input Nilai Murid Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              {/* Select Student or Custom Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Pilih Dari DATA SISWA *
                  </label>
                  <select
                    value={formData.siswaNisn}
                    onChange={(e) => handleSelectStudentChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-slate-50 text-slate-800"
                  >
                    {students.map((st) => (
                      <option key={st.nisn} value={st.nisn}>
                        {st.nama} ({st.kelasId}) – {st.nisn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.siswaNama}
                    onChange={(e) => setFormData({ ...formData, siswaNama: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Class, Semester, Mapel */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Kelas Paralel</label>
                  <select
                    value={formData.kelasParalel}
                    onChange={(e) => setFormData({ ...formData, kelasParalel: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  >
                    {["7A", "7B", "7C", "7D", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D"].map(
                      (c) => (
                        <option key={c} value={c}>
                          Kelas {c}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Mapel</label>
                  <input
                    type="text"
                    value={formData.mapel}
                    onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* 12 UH/T Score & Date Inputs */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold uppercase text-emerald-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Nilai & Tanggal Ulangan Harian/Tugas (UH 1 s/d 12)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, uhList: Array(12).fill(75) }))}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200"
                    >
                      Isi 75
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, uhList: Array(12).fill(80) }))}
                      className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200"
                    >
                      Isi 80
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, uhList: Array(12).fill(85) }))}
                      className="text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-200"
                    >
                      Isi 85
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, uhList: Array(12).fill(90) }))}
                      className="text-[9px] bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200"
                    >
                      Isi 90
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-64 overflow-y-auto">
                  {formData.uhList.map((score, i) => (
                    <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-900">UH {i + 1}</span>
                        <span className="text-[8px] text-slate-400 font-semibold">Tgl Evaluasi</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score}
                          onChange={(e) => handleUhChange(i, Number(e.target.value))}
                          placeholder="Nilai"
                          className={`w-full p-1 rounded-md border text-center font-bold text-xs ${
                            score < formData.kkm
                              ? "bg-red-50 text-red-600 border-red-300"
                              : "bg-white text-slate-900 border-slate-300"
                          }`}
                        />
                        <input
                          type="date"
                          value={formData.uhDates?.[i] || ""}
                          onChange={(e) => handleUhDateChange(i, e.target.value)}
                          className="w-full p-1 rounded-md border border-slate-200 text-[10px] font-medium text-slate-700 bg-slate-50 text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PTS, PAS, KKM with Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-amber-950 flex items-center justify-between">
                    <span>PTS (Sumatif)</span>
                    <span className="text-[8px] text-amber-800 font-normal">Nilai & Tanggal</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pts}
                    onChange={(e) => setFormData({ ...formData, pts: Number(e.target.value) })}
                    placeholder="Nilai PTS"
                    className="w-full p-1.5 rounded-lg border border-amber-300 font-extrabold text-amber-900 bg-white text-xs"
                  />
                  <input
                    type="date"
                    value={formData.ptsDate || ""}
                    onChange={(e) => setFormData({ ...formData, ptsDate: e.target.value })}
                    className="w-full p-1 rounded-lg border border-amber-200 text-[10px] text-slate-800 bg-white"
                  />
                </div>

                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-amber-950 flex items-center justify-between">
                    <span>PAS (Sumatif)</span>
                    <span className="text-[8px] text-amber-800 font-normal">Nilai & Tanggal</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pas}
                    onChange={(e) => setFormData({ ...formData, pas: Number(e.target.value) })}
                    placeholder="Nilai PAS"
                    className="w-full p-1.5 rounded-lg border border-amber-300 font-extrabold text-amber-900 bg-white text-xs"
                  />
                  <input
                    type="date"
                    value={formData.pasDate || ""}
                    onChange={(e) => setFormData({ ...formData, pasDate: e.target.value })}
                    className="w-full p-1 rounded-lg border border-amber-200 text-[10px] text-slate-800 bg-white"
                  />
                </div>

                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-700">Acuan KKM</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.kkm}
                    onChange={(e) => setFormData({ ...formData, kkm: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 bg-white text-xs"
                  />
                  <p className="text-[9px] text-slate-500 italic">Nilai di bawah KKM ditandai warna merah.</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-md"
                >
                  Simpan Data Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BATCH EVALUATION DATE SETTER FOR CLASS */}
      {isBatchDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-xl">
                    <Calendar className="w-5 h-5 text-amber-700" />
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Atur & Edit Tanggal Pelaksanaan Evaluasi (UH 1 - 12, PTS, PAS)
                  </h3>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-full border border-emerald-300">
                    Kelas {selectedKelasParalel}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-full">
                    Semester {selectedSemester}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Sesuaikan tanggal pelaksanaan untuk setiap Ulangan Harian (UH 1 s/d 12), PTS, dan PAS sesuai jadwal pembelajaran {selectedMapel}.
                </p>
              </div>
              <button
                onClick={() => setIsBatchDateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveBatchDates} className="space-y-4 overflow-y-auto pr-1 py-1 text-xs flex-1">
              {/* Quick Assistant & Generation Toolbar */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Aksi Cepat & Generator Jadwal:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAutoRoutine(!showAutoRoutine)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition flex items-center gap-1 border ${
                        showAutoRoutine
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{showAutoRoutine ? "Tutup Generator" : "Generator Otomatis (Rutin)"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToDefaultDates}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-300 transition flex items-center gap-1"
                      title="Kembalikan ke susunan tanggal bawaan kurikulum semester"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Bawaan</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSetAllToToday}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-300 transition flex items-center gap-1"
                      title="Isi seluruh UH 1 s/d 12 dengan tanggal hari ini"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hari Ini ke Semua</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllUhDates}
                      className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-600 font-bold text-[11px] rounded-xl border border-red-200 transition flex items-center gap-1"
                      title="Kosongkan seluruh tanggal UH"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Kosongkan</span>
                    </button>
                  </div>
                </div>

                {/* Generator Details Panel */}
                {showAutoRoutine && (
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-3 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[11px] text-amber-950 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        Atur Pola Berkala untuk UH 1 s/d UH 12:
                      </span>
                      <span className="text-[10px] text-amber-800">
                        Otomatis mengisi tanggal berurutan dari UH 1 ke UH 12
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 mb-1">
                          Tanggal Mulai (UH 1):
                        </label>
                        <input
                          type="date"
                          value={autoGenStartDate}
                          onChange={(e) => setAutoGenStartDate(e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-amber-300 bg-white font-bold text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 mb-1">
                          Jeda Evaluasi:
                        </label>
                        <select
                          value={autoGenInterval}
                          onChange={(e) => setAutoGenInterval(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-amber-300 bg-white font-bold text-xs text-slate-800"
                        >
                          <option value={7}>Setiap 1 Minggu (7 Hari)</option>
                          <option value={14}>Setiap 2 Minggu (14 Hari - Rekomendasi)</option>
                          <option value={21}>Setiap 3 Minggu (21 Hari)</option>
                          <option value={30}>Setiap 1 Bulan (30 Hari)</option>
                        </select>
                      </div>
                      <div className="flex flex-col justify-end space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-amber-950 select-none">
                          <input
                            type="checkbox"
                            checked={autoGenSkipWeekend}
                            onChange={(e) => setAutoGenSkipWeekend(e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span>Hindari Libur (Sabtu/Ahad ➡️ Senin)</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateRoutineDates}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-sm border border-amber-400 transition flex items-center justify-center gap-1.5"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Terapkan Pola ke UH 1 - 12</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Navigation Filter */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilterUhTab("all")}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                      filterUhTab === "all"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    Semua Evaluasi (12 UH & Ujian)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterUhTab("uh1-6")}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                      filterUhTab === "uh1-6"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    UH 1 s/d 6 (Paruh Awal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterUhTab("uh7-12")}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                      filterUhTab === "uh7-12"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    UH 7 s/d 12 (Paruh Akhir)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterUhTab("ujian")}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                      filterUhTab === "ujian"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-900"
                    }`}
                  >
                    PTS & PAS Saja
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-bold">
                  Klik tombol aksi di setiap kartu untuk ubah cepat
                </span>
              </div>

              {/* UH 1-12 Dates Cards Grid */}
              {filterUhTab !== "ujian" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Tanggal Pelaksanaan Ulangan Harian (UH)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Format: Tanggal / Bulan / Tahun
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {batchUhDates.map((dVal, i) => {
                      // Filter checks
                      if (filterUhTab === "uh1-6" && i >= 6) return null;
                      if (filterUhTab === "uh7-12" && i < 6) return null;

                      const dayInfo = getDayInfo(dVal);

                      return (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition space-y-2 flex flex-col justify-between"
                        >
                          {/* Card Header: UH Badge & Day info */}
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded-lg text-xs font-black border border-emerald-300">
                              UH {i + 1}
                            </span>

                            {/* Day Status Tag */}
                            {dayInfo.isSunday ? (
                              <span className="text-[9.5px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Ahad (Libur)
                              </span>
                            ) : dayInfo.isSaturday ? (
                              <span className="text-[9.5px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                Sabtu
                              </span>
                            ) : dVal ? (
                              <span className="text-[9.5px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                {dayInfo.dayName}
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full italic">
                                Belum diatur
                              </span>
                            )}
                          </div>

                          {/* Date Input */}
                          <div className="space-y-1">
                            <input
                              type="date"
                              value={dVal || ""}
                              onChange={(e) => handleUpdateSingleUhDate(i, e.target.value)}
                              className="w-full p-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                            <div className="text-[10px] font-medium text-slate-500 px-0.5 truncate" title={dayInfo.formatted}>
                              {dayInfo.formatted}
                            </div>
                          </div>

                          {/* Quick Mini Actions for this UH */}
                          <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-100 text-[9.5px]">
                            <button
                              type="button"
                              onClick={() => handleSetSingleUhToday(i)}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                              title="Set ke tanggal hari ini"
                            >
                              Hari Ini
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddDaysToSingleUh(i, 7)}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                              title="Tambah 7 hari dari tanggal saat ini"
                            >
                              +7h
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddDaysToSingleUh(i, 14)}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                              title="Tambah 14 hari dari tanggal saat ini"
                            >
                              +14h
                            </button>
                            {i > 0 && (
                              <button
                                type="button"
                                onClick={() => handleCopyPrevUhDate(i)}
                                className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded flex items-center gap-0.5"
                                title={`Salin tanggal dari UH ${i}`}
                              >
                                <Copy className="w-2.5 h-2.5" />
                                <span>Salin UH{i}</span>
                              </button>
                            )}
                            {dVal && (
                              <button
                                type="button"
                                onClick={() => handleClearSingleUhDate(i)}
                                className="px-1.5 py-0.5 hover:bg-red-50 text-red-600 font-bold rounded ml-auto"
                                title="Kosongkan tanggal UH ini"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PTS & PAS Dates (Sumatif) */}
              {(filterUhTab === "all" || filterUhTab === "ujian") && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tanggal Penilaian Sumatif (PTS & PAS)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* PTS Card */}
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          Penilaian Tengah Semester (PTS)
                        </span>
                        {getDayInfo(batchPtsDate).dayName !== "-" && (
                          <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            {getDayInfo(batchPtsDate).dayName}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={batchPtsDate || ""}
                        onChange={(e) => setBatchPtsDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-black text-slate-900 bg-white focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-medium text-amber-900">{getDayInfo(batchPtsDate).formatted}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const y = now.getFullYear();
                            const m = String(now.getMonth() + 1).padStart(2, "0");
                            const d = String(now.getDate()).padStart(2, "0");
                            setBatchPtsDate(`${y}-${m}-${d}`);
                          }}
                          className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition"
                        >
                          Hari Ini
                        </button>
                      </div>
                    </div>

                    {/* PAS Card */}
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-700" />
                          Penilaian Akhir Semester (PAS)
                        </span>
                        {getDayInfo(batchPasDate).dayName !== "-" && (
                          <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            {getDayInfo(batchPasDate).dayName}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={batchPasDate || ""}
                        onChange={(e) => setBatchPasDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-black text-slate-900 bg-white focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-medium text-amber-900">{getDayInfo(batchPasDate).formatted}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const y = now.getFullYear();
                            const m = String(now.getMonth() + 1).padStart(2, "0");
                            const d = String(now.getDate()).padStart(2, "0");
                            setBatchPasDate(`${y}-${m}-${d}`);
                          }}
                          className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition"
                        >
                          Hari Ini
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scope Selector: Apply to Which Class? */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  <span>Jangkauan Penerapan Tanggal:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      batchDateScope === "current"
                        ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dateScope"
                      checked={batchDateScope === "current"}
                      onChange={() => setBatchDateScope("current")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-[11px]">Hanya Kelas {selectedKelasParalel}</div>
                      <div className="text-[9.5px] text-slate-500">Khusus siswa di kelas aktif ini</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      batchDateScope === "level"
                        ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dateScope"
                      checked={batchDateScope === "level"}
                      onChange={() => setBatchDateScope("level")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-[11px]">
                        Tingkat {selectedKelasParalel.charAt(0)} ({allParallelClasses.find(g => g.level.includes(selectedKelasParalel.charAt(0)))?.items.join(', ')})
                      </div>
                      <div className="text-[9.5px] text-slate-500">Seluruh kelas paralel jenjang ini</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      batchDateScope === "all"
                        ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dateScope"
                      checked={batchDateScope === "all"}
                      onChange={() => setBatchDateScope("all")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-[11px]">Seluruh Kelas Paralel</div>
                      <div className="text-[9.5px] text-slate-500">Semua kelas (7A s/d 9D)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0">
                <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {batchDateScope === "current" && `Berlaku untuk Kelas ${selectedKelasParalel} (${selectedMapel} - Semester ${selectedSemester})`}
                    {batchDateScope === "level" && `Berlaku serentak untuk seluruh Kelas Tingkat ${selectedKelasParalel.charAt(0)}`}
                    {batchDateScope === "all" && `Berlaku serentak untuk seluruh kelas (7A s.d. 9D)`}
                  </span>
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsBatchDateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md border border-emerald-600 transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terapkan Tanggal</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BATCH SCORE SETTER FOR CLASS */}
      {isBatchScoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  Pengisian Nilai Massal Kelas {selectedKelasParalel}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Isi nilai UH (1-12), PTS, atau PAS secara cepat untuk seluruh {activeRecords.length} siswa di Kelas {selectedKelasParalel}
                </p>
              </div>
              <button
                onClick={() => setIsBatchScoreModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatchScores} className="space-y-4 text-xs">
              {/* Target Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-700 block">
                  Pilih Target Kolom Evaluasi
                </label>
                <select
                  value={batchScoreTarget}
                  onChange={(e) => setBatchScoreTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="all_uh">⚡ SEMUA UH (UH 1 s/d UH 12)</option>
                  <option value="uh1">UH 1 (Ulangan Harian 1)</option>
                  <option value="uh2">UH 2 (Ulangan Harian 2)</option>
                  <option value="uh3">UH 3 (Ulangan Harian 3)</option>
                  <option value="uh4">UH 4 (Ulangan Harian 4)</option>
                  <option value="uh5">UH 5 (Ulangan Harian 5)</option>
                  <option value="uh6">UH 6 (Ulangan Harian 6)</option>
                  <option value="uh7">UH 7 (Ulangan Harian 7)</option>
                  <option value="uh8">UH 8 (Ulangan Harian 8)</option>
                  <option value="uh9">UH 9 (Ulangan Harian 9)</option>
                  <option value="uh10">UH 10 (Ulangan Harian 10)</option>
                  <option value="uh11">UH 11 (Ulangan Harian 11)</option>
                  <option value="uh12">UH 12 (Ulangan Harian 12)</option>
                  <option value="pts">PTS (Penilaian Tengah Semester)</option>
                  <option value="pas">PAS (Penilaian Akhir Semester)</option>
                </select>
              </div>

              {/* Score Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-700 block">
                  Nilai Yang Diterapkan (0 - 100)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batchScoreVal}
                    onChange={(e) => setBatchScoreVal(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-indigo-300 font-black text-lg text-indigo-950 bg-indigo-50/50 text-center focus:bg-white"
                  />
                  <div className="grid grid-cols-3 gap-1">
                    {[75, 80, 85, 88, 90, 95].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBatchScoreVal(val)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition ${
                          batchScoreVal === val
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info summary */}
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 text-[11px] text-indigo-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Ringkasan Penerapan Massal:</span>
                </div>
                <p>
                  Mengisi nilai <span className="font-black text-indigo-950">{batchScoreVal}</span> pada{" "}
                  <span className="font-bold underline">
                    {batchScoreTarget === "all_uh"
                      ? "Seluruh UH 1 s/d 12"
                      : batchScoreTarget.toUpperCase()}
                  </span>{" "}
                  untuk seluruh <span className="font-black">{activeRecords.length} siswa</span> di Kelas {selectedKelasParalel}.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchScoreModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md border border-indigo-500"
                >
                  Terapkan Ke Seluruh Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPrintViewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
          {/* CSS Print Styles Override */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-rekap-paralel, #printable-rekap-paralel * {
                visibility: visible !important;
              }
              #printable-rekap-paralel {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 14px 18px !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              table {
                page-break-inside: auto;
                width: 100% !important;
              }
              tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
              }
              thead {
                display: table-header-group !important;
              }
            }
          `}</style>

          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none my-8">
            {/* Modal Toolbar Header (Hidden in Print) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Pratinjau Dokumen Cetak Rekap Nilai Siswa
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Kelas Paralel {selectedKelasParalel} • Semester {selectedSemester} ({selectedSemester === "1" ? "Ganjil" : "Genap"})
                  </p>
                </div>
              </div>

              {/* Tanggal Cetak Setting & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-600">Tanggal Cetak:</span>
                  <input
                    type="date"
                    value={printTanggalCetak}
                    onChange={(e) => setPrintTanggalCetak(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const y = now.getFullYear();
                      const m = String(now.getMonth() + 1).padStart(2, "0");
                      const d = String(now.getDate()).padStart(2, "0");
                      setPrintTanggalCetak(`${y}-${m}-${d}`);
                    }}
                    className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition cursor-pointer"
                  >
                    Hari Ini
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintViewOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  title="Tutup Pratinjau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div id="printable-rekap-paralel" className="space-y-4 text-black font-sans">
              {/* Header Kop Sekolah */}
              <div className="text-center border-b-4 border-double border-black pb-3 space-y-1">
                <h1 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  PEMERINTAH KABUPATEN WAY KANAN – DINAS PENDIDIKAN
                </h1>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-black">
                  UPT SMP NEGERI 2 REBANG TANGKAS
                </h2>
                <p className="text-[11px] italic font-serif text-slate-600">
                  Jl. Lintas Rebang Tangkas, Rebang Tangkas, Kabupaten Way Kanan, Lampung 34791
                </p>
              </div>

              {/* Document Title & Metadata */}
              <div className="space-y-2">
                <div className="text-center">
                  <h3 className="text-sm font-bold uppercase underline tracking-wide">
                    LAPORAN REKAPITULASI HASIL PENILAIAN PESERTA DIDIK
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    Mata Pelajaran: {selectedMapel}
                  </p>
                </div>

                {/* Metadata Box with Tanggal Cetak */}
                <div className="bg-slate-50 border border-black p-2.5 rounded text-[10px] grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <p>Kelas Paralel: <strong>{selectedKelasParalel}</strong></p>
                    <p>Semester: <strong>{selectedSemester === "1" ? "1 (Ganjil)" : "2 (Genap)"}</strong></p>
                    <p>Tahun Pelajaran: <strong>2026/2027</strong></p>
                    <p>Standar KKM: <strong>75 (Tuntas)</strong></p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p>Tanggal Cetak: <strong className="text-black bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 font-bold">{formatDateIndoLong(printTanggalCetak)}</strong></p>
                    <p>Jumlah Siswa: <strong>{activeRecords.length} Murid</strong></p>
                    <p>Guru Pengampu: <strong>Sadiqul Alim, S.Pd.I., M.Pd.</strong></p>
                    <p>NIP: <strong>19790917 201407 1 004</strong></p>
                  </div>
                </div>
              </div>

              {/* Table Print with Dates */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-[9px]">
                  <thead>
                    <tr className="bg-gray-200 text-center font-bold">
                      <th className="border border-black p-1 w-6" rowSpan={2}>No</th>
                      <th className="border border-black p-1 min-w-[130px]" rowSpan={2}>Nama Siswa</th>
                      <th className="border border-black p-1 w-20" rowSpan={2}>NISN</th>
                      <th className="border border-black p-1" colSpan={12}>
                        Ulangan Harian & Tugas (UH 1 - 12)
                      </th>
                      <th className="border border-black p-1 w-10" rowSpan={2}>Rerata UH</th>
                      <th className="border border-black p-1 w-12" rowSpan={2}>
                        <div>PTS</div>
                        {activeRecords[0]?.ptsDate && (
                          <div className="text-[7px] font-normal text-slate-700 mt-0.5">
                            {formatDateShort(activeRecords[0].ptsDate)}
                          </div>
                        )}
                      </th>
                      <th className="border border-black p-1 w-12" rowSpan={2}>
                        <div>PAS</div>
                        {activeRecords[0]?.pasDate && (
                          <div className="text-[7px] font-normal text-slate-700 mt-0.5">
                            {formatDateShort(activeRecords[0].pasDate)}
                          </div>
                        )}
                      </th>
                      <th className="border border-black p-1 w-11" rowSpan={2}>Nilai Akhir</th>
                      <th className="border border-black p-1 w-9" rowSpan={2}>KKM</th>
                      <th className="border border-black p-1 w-12" rowSpan={2}>Ket.</th>
                    </tr>
                    <tr className="bg-gray-100 text-center font-bold">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num, idx) => {
                        const dateVal = activeRecords[0]?.uhDates?.[idx];
                        return (
                          <th key={num} className="border border-black p-0.5 min-w-[24px]">
                            <div className="font-extrabold text-[8.5px] leading-tight">UH{num}</div>
                            <div className="text-[7px] font-normal text-slate-700 leading-tight">
                              {dateVal ? formatDateShort(dateVal) : "-"}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRecords.map((rec, i) => {
                      const rerataUH = computeRerataUH(rec.uhList);
                      const nilaiAkhir = computeNilaiAkhir(rerataUH, rec.pts, rec.pas);
                      const kkmVal = rec.kkm || 75;
                      const isTuntas = nilaiAkhir >= kkmVal;

                      return (
                        <tr key={rec.id} className="text-center">
                          <td className="border border-black p-1">{i + 1}</td>
                          <td className="border border-black p-1 text-left font-bold">{rec.siswaNama}</td>
                          <td className="border border-black p-1 font-mono text-[8.5px]">{rec.siswaNisn}</td>
                          {rec.uhList.map((score, sIdx) => (
                            <td
                              key={sIdx}
                              className={`border border-black p-0.5 ${
                                score >= kkmVal ? "text-black font-bold" : "text-red-600 font-black bg-red-50"
                              }`}
                            >
                              {score}
                            </td>
                          ))}
                          <td className={`border border-black p-1 ${rerataUH >= kkmVal ? "text-black font-bold" : "text-red-600 font-black"}`}>
                            {rerataUH}
                          </td>
                          <td className={`border border-black p-1 ${rec.pts >= kkmVal ? "text-black font-bold" : "text-red-600 font-black"}`}>
                            {rec.pts}
                          </td>
                          <td className={`border border-black p-1 ${rec.pas >= kkmVal ? "text-black font-bold" : "text-red-600 font-black"}`}>
                            {rec.pas}
                          </td>
                          <td className={`border border-black p-1 font-black ${nilaiAkhir >= kkmVal ? "text-black" : "text-red-600"}`}>
                            {nilaiAkhir}
                          </td>
                          <td className="border border-black p-1 font-bold">{kkmVal}</td>
                          <td className={`border border-black p-1 text-[8px] font-bold ${isTuntas ? "text-emerald-800" : "text-red-600"}`}>
                            {isTuntas ? "Tuntas" : "Remedial"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Rincian Tanggal Pelaksanaan Penilaian Box */}
              <div className="border border-slate-400 p-2 rounded text-[8.5px] text-slate-800 bg-slate-50 space-y-1">
                <p className="font-bold text-[9px] uppercase tracking-wide text-black border-b border-slate-300 pb-0.5">
                  Jadwal Tanggal Pelaksanaan Penilaian Terdaftar:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n, i) => (
                    <div key={n}>
                      UH {n}: <strong>{formatDateFullIndo(activeRecords[0]?.uhDates?.[i])}</strong>
                    </div>
                  ))}
                  <div>PTS: <strong>{formatDateFullIndo(activeRecords[0]?.ptsDate)}</strong></div>
                  <div>PAS: <strong>{formatDateFullIndo(activeRecords[0]?.pasDate)}</strong></div>
                </div>
              </div>

              {/* Signature Block */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 font-sans break-inside-avoid">
                <div className="text-center space-y-12">
                  <p>Mengetahui,<br />Kepala UPT SMPN 2 Rebang Tangkas</p>
                  <p className="font-bold underline">
                    Drs. H. Mulyadi, M.M.<br />
                    <span className="font-normal text-[10px]">NIP. 19700318 199503 1 002</span>
                  </p>
                </div>
                <div className="text-center space-y-12">
                  <p>
                    Rebang Tangkas, {formatDateIndoDateOnly(printTanggalCetak)}<br />
                    Guru Mata Pelajaran PAI & Budi Pekerti
                  </p>
                  <p className="font-bold underline">
                    Sadiqul Alim, S.Pd.I., M.Pd.<br />
                    <span className="font-normal text-[10px]">NIP. 19790917 201407 1 004</span>
                  </p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-300 text-[8px] text-slate-500 flex justify-between items-center">
                <span>Dokumen Resmi Rekap Nilai Akademik PAI • UPT SMPN 2 Rebang Tangkas</span>
                <span>Dicetak pada: {formatDateIndoLong(printTanggalCetak)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
