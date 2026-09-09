/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FolderSync,
  FileText,
  Users,
  Award,
  BookOpen,
  Heart,
  Search,
  Check,
  X,
  Lock,
  LogOut,
  Info,
  Filter,
  Layers
} from "lucide-react";
import GoogleSignInButton from "../common/GoogleSignInButton";
import {
  subscribeAuth,
  googleSignIn,
  logoutGoogle,
  getCurrentUser,
  GoogleUser
} from "../../lib/googleAuth";
import * as XLSX from "xlsx";
import {
  listDriveSpreadsheets,
  getSpreadsheetMetadata,
  getSpreadsheetValues,
  extractSpreadsheetId,
  exportStudentsToGoogleSheet,
  exportRekapNilaiToGoogleSheet,
  exportJurnalMengajarToGoogleSheet,
  exportJurnalIbadahToGoogleSheet,
  parseSpreadsheetRowsToStudents,
  getUnifiedRekapNilaiList,
  REKAP_PAI_HEADERS,
  formatRekapRow,
  formatRekapSummaryRow,
  GoogleDriveFile,
  ExportResult
} from "../../lib/googleSheetsService";
import { Siswa, Kelas, RekapNilaiTotal, JurnalMengajar, JurnalIbadahHarian } from "../../types";

interface GoogleSheetsHubProps {
  students: Siswa[];
  classes: Kelas[];
  rekapNilai: RekapNilaiTotal[];
  jurnalMengajar: JurnalMengajar[];
  jurnalIbadah: JurnalIbadahHarian[];
  onBulkAddStudents?: (newStudents: Siswa[]) => void;
  schoolName?: string;
}

export default function GoogleSheetsHub({
  students,
  classes,
  rekapNilai,
  jurnalMengajar,
  jurnalIbadah,
  onBulkAddStudents,
  schoolName = "UPT SMPN 2 Rebang Tangkas"
}: GoogleSheetsHubProps) {
  // Auth state
  const [user, setUser] = useState<GoogleUser | null>(() => getCurrentUser());
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [isPopupClosed, setIsPopupClosed] = useState(false);
  const isInsideIframe = typeof window !== "undefined" && window.self !== window.top;

  // Tabs
  const [activeTab, setActiveTab] = useState<"export" | "rekap-pai" | "drive" | "import">("export");

  // Tab Rekap PAI dedicated state
  const [rekapTabClassFilter, setRekapTabClassFilter] = useState<string>("ALL");
  const [rekapTabSearchQuery, setRekapTabSearchQuery] = useState<string>("");

  // Export state
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [recentExports, setRecentExports] = useState<ExportResult[]>([]);
  const [exportError, setExportError] = useState<string | null>(null);
  const [selectedExportClass, setSelectedExportClass] = useState<string>("ALL");

  // Unify rekap and students data so ALL inputted students in every class are accounted for
  const unifiedRekap = useMemo(() => {
    return getUnifiedRekapNilaiList(rekapNilai, students);
  }, [rekapNilai, students]);

  // Classes that actually have data inputted (exclude empty classes)
  const inputtedRekapClasses = useMemo(() => {
    return Array.from(new Set(unifiedRekap.map((r) => r.kelasId).filter(Boolean))).sort();
  }, [unifiedRekap]);

  // Filtered rekap list for the dedicated rekap-pai tab
  const rekapTabFiltered = useMemo(() => {
    return unifiedRekap.filter((r) => {
      const matchClass = rekapTabClassFilter === "ALL" || r.kelasId === rekapTabClassFilter;
      const q = rekapTabSearchQuery.toLowerCase().trim();
      const matchSearch = !q || r.siswaNama.toLowerCase().includes(q) || r.siswaNisn.includes(q);
      return matchClass && matchSearch;
    });
  }, [unifiedRekap, rekapTabClassFilter, rekapTabSearchQuery]);

  // Summary statistics for rekapTabFiltered
  const rekapTabStats = useMemo(() => {
    if (rekapTabFiltered.length === 0) {
      return { avgNA: 0, tuntasCount: 0, pctTuntas: 0, avgFormatif: 0, avgSumatif: 0 };
    }
    let sumNA = 0;
    let sumF = 0;
    let sumS = 0;
    let tuntas = 0;
    rekapTabFiltered.forEach((r) => {
      const avgF = Math.round((r.formatifKuis + r.formatifTugas + r.formatifDiskusi) / 3);
      const na = Math.round(avgF * 0.4 + r.sumatifPts * 0.3 + r.sumatifPas * 0.3);
      sumNA += na;
      sumF += avgF;
      sumS += Math.round((r.sumatifPts + r.sumatifPas) / 2);
      if (na >= 75) tuntas++;
    });
    const len = rekapTabFiltered.length;
    return {
      avgNA: Math.round(sumNA / len),
      tuntasCount: tuntas,
      pctTuntas: Math.round((tuntas / len) * 100),
      avgFormatif: Math.round(sumF / len),
      avgSumatif: Math.round(sumS / len),
    };
  }, [rekapTabFiltered]);

  // Available classes for export grouping
  const availableExportClasses = useMemo(() => {
    const fromProps = classes?.map((c) => c.id) || [];
    const fromStudents = students?.map((s) => s.kelasId) || [];
    const fromRekap = unifiedRekap?.map((r) => r.kelasId) || [];
    const fromJurnal = jurnalMengajar?.map((j) => j.kelasId) || [];
    const set = new Set([...fromProps, ...fromStudents, ...fromRekap, ...fromJurnal].filter(Boolean));
    return Array.from(set).sort();
  }, [classes, students, unifiedRekap, jurnalMengajar]);

  // Filtered counts based on selectedExportClass
  const filteredStudentCount = useMemo(() => {
    if (selectedExportClass === "ALL") return students.length;
    return students.filter((s) => s.kelasId === selectedExportClass).length;
  }, [students, selectedExportClass]);

  const filteredRekapCount = useMemo(() => {
    if (selectedExportClass === "ALL") return unifiedRekap.length;
    return unifiedRekap.filter((r) => r.kelasId === selectedExportClass).length;
  }, [unifiedRekap, selectedExportClass]);

  const filteredJurnalCount = useMemo(() => {
    if (selectedExportClass === "ALL") return jurnalMengajar.length;
    return jurnalMengajar.filter((j) => j.kelasId === selectedExportClass).length;
  }, [jurnalMengajar, selectedExportClass]);

  const filteredIbadahCount = useMemo(() => {
    if (selectedExportClass === "ALL") return jurnalIbadah.length;
    const studentMap = new Map(students.map((s) => [s.nisn, s]));
    return jurnalIbadah.filter(
      (w) => studentMap.get(w.siswaNisn)?.kelasId === selectedExportClass
    ).length;
  }, [jurnalIbadah, students, selectedExportClass]);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState("");
  const [driveError, setDriveError] = useState<string | null>(null);

  // Import state
  const [sheetUrlOrId, setSheetUrlOrId] = useState("");
  const [selectedSheetTab, setSelectedSheetTab] = useState("");
  const [availableSheetTabs, setAvailableSheetTabs] = useState<string[]>([]);
  const [isLoadingSheetData, setIsLoadingSheetData] = useState(false);
  const [previewRows, setPreviewRows] = useState<(string | number)[][]>([]);
  const [parsedStudents, setParsedStudents] = useState<Siswa[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [importClassId, setImportClassId] = useState(classes[0]?.id || "VII-A");
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Confirmation Modal state for workspace operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    itemCount?: number;
    actionLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionLabel: "Lanjutkan",
    onConfirm: () => {}
  });

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = subscribeAuth((currUser, currToken) => {
      setUser(currUser);
      setToken(currToken);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Drive files when user signs in or opens Drive tab
  useEffect(() => {
    if (user && token && activeTab === "drive" && driveFiles.length === 0) {
      loadDriveFiles();
    }
  }, [user, token, activeTab]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    setIsPopupBlocked(false);
    setIsPopupClosed(false);
    try {
      const res = await googleSignIn();
      setUser(res.user);
      setToken(res.accessToken);
    } catch (err: any) {
      const code = err?.code || "";
      const msg = err?.message || "";

      const isClosed =
        code === "auth/popup-closed-by-user" ||
        err?.isPopupClosed === true ||
        msg.includes("popup-closed-by-user") ||
        msg.includes("popup closed by user") ||
        msg.includes("ditutup");

      const isBlocked =
        code === "auth/popup-blocked" ||
        err?.isPopupBlocked === true ||
        msg.includes("popup-blocked") ||
        msg.includes("popup_blocked") ||
        msg.includes("diblokir");

      setIsPopupBlocked(isBlocked);
      setIsPopupClosed(isClosed);

      if (isBlocked) {
        setAuthError(
          "Jendela pop-up login Google diblokir oleh peramban. Silakan buka aplikasi di Tab Baru atau izinkan pop-up pada peramban Anda."
        );
      } else if (isClosed) {
        setAuthError(
          "Jendela login ditutup sebelum otentikasi selesai. Jika jendela tertutup otomatis karena pembatasan keamanan di pratinjau (iframe), Anda disarankan membuka aplikasi di Tab Baru untuk login dengan lancar."
        );
      } else {
        console.warn("Gagal menghubungkan Google:", msg || err);
        setAuthError(
          msg || "Gagal menghubungkan akun Google. Pastikan jendela popup izin tidak diblokir oleh peramban."
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    setRecentExports([]);
  };

  const loadDriveFiles = async () => {
    if (!token || !token.startsWith("ya29.")) {
      setDriveFiles([]);
      return;
    }
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const files = await listDriveSpreadsheets();
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "";
      if (msg.includes("Failed to fetch")) {
        setDriveError("Koneksi Google Drive dibatasi oleh browser. Anda tetap dapat memasukkan tautan/ID spreadsheet langsung pada tab Impor Data.");
      } else {
        setDriveError(msg || "Gagal memuat berkas spreadsheet dari Google Drive.");
      }
    } finally {
      setIsLoadingDrive(false);
    }
  };

  // Trigger export: Google Sheets (if live OAuth token available) or direct Excel download
  const requestExport = (
    type: "students" | "rekap" | "jurnal" | "ibadah",
    title: string,
    description: string,
    itemCount: number
  ) => {
    // If live Google OAuth token is present, export to Google Drive Sheets
    if (token && token.startsWith("ya29.")) {
      setConfirmModal({
        isOpen: true,
        title,
        description,
        itemCount,
        actionLabel: "Buat Spreadsheet di Google Drive",
        onConfirm: async () => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setIsExporting(type);
          setExportError(null);
          try {
            let res: ExportResult;
            if (type === "students") {
              res = await exportStudentsToGoogleSheet(students, schoolName, selectedExportClass, classes);
            } else if (type === "rekap") {
              res = await exportRekapNilaiToGoogleSheet(rekapNilai, students, schoolName, selectedExportClass, classes);
            } else if (type === "jurnal") {
              res = await exportJurnalMengajarToGoogleSheet(jurnalMengajar, schoolName, selectedExportClass, classes);
            } else {
              res = await exportJurnalIbadahToGoogleSheet(jurnalIbadah, students, schoolName, selectedExportClass, classes);
            }

            setRecentExports((prev) => [res, ...prev]);
          } catch (err: any) {
            console.error(err);
            const msg = err?.message || "";
            if (msg.includes("Failed to fetch")) {
              setExportError("Koneksi ekspor cloud terhambat. Anda dapat menggunakan tombol 'Unduh Excel' di bawah untuk ekspor langsung.");
            } else {
              setExportError(msg || "Terjadi kesalahan saat mengekspor ke Google Sheets.");
            }
          } finally {
            setIsExporting(null);
          }
        }
      });
      return;
    }

    // In local / standalone mode without Google OAuth token:
    // Download formatted multi-tab Excel (.xlsx) file immediately
    downloadExcel(type);
    const dateStr = new Date().toISOString().slice(0, 10);
    const typeTitles: Record<string, string> = {
      students: "Data Siswa",
      rekap: "Rekap Nilai PAI",
      jurnal: "Jurnal Mengajar Guru",
      ibadah: "Jurnal Ibadah Siswa"
    };
    const newExport: ExportResult = {
      spreadsheetId: `local-xlsx-${Date.now()}`,
      spreadsheetUrl: "",
      title: `PAILMS - ${typeTitles[type] || "Export"} (${dateStr}).xlsx`,
      rowCount: itemCount,
      sheetCount: selectedExportClass === "ALL" ? availableExportClasses.length + 1 : 1
    };
    setRecentExports((prev) => [newExport, ...prev]);
  };

  // Instant XLSX export (Multi-tab, 100% compatible with Google Drive / Google Sheets / MS Excel)
  const downloadExcel = (type: "students" | "rekap" | "jurnal" | "ibadah") => {
    const wb = XLSX.utils.book_new();
    const dateStr = new Date().toISOString().slice(0, 10);
    const now = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    if (type === "students") {
      const exportStudents = selectedExportClass === "ALL" ? students : students.filter((s) => s.kelasId === selectedExportClass);
      const headers = ["No", "NISN", "Nama Lengkap", "Kelas", "Jenis Kelamin", "Agama", "Status Keaktifan", "Kontak Orang Tua", "Catatan Khusus"];
      const masterRows = [
        [`DATA PESERTA DIDIK - ${schoolName.toUpperCase()}`],
        [`Rombel: ${selectedExportClass === "ALL" ? "Semua Kelas" : selectedExportClass} • Total: ${exportStudents.length} Siswa • Tanggal: ${now}`],
        [],
        headers,
        ...exportStudents.map((s, idx) => [
          idx + 1, s.nisn, s.nama, s.kelasId, s.gender, s.agama, s.statusKeaktifan, s.kontakOrangTua || "-", s.catatanKhusus || "-"
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(masterRows), "Master Siswa");

      if (selectedExportClass === "ALL") {
        availableExportClasses.forEach((clsId) => {
          const clsStudents = students.filter((s) => s.kelasId === clsId);
          if (clsStudents.length > 0) {
            const clsRows = [
              [`DATA PESERTA DIDIK KELAS ${clsId} - ${schoolName.toUpperCase()}`],
              [`Rombel: ${clsId} • Total: ${clsStudents.length} Siswa`],
              [],
              headers,
              ...clsStudents.map((s, idx) => [
                idx + 1, s.nisn, s.nama, s.kelasId, s.gender, s.agama, s.statusKeaktifan, s.kontakOrangTua || "-", s.catatanKhusus || "-"
              ])
            ];
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(clsRows), `Kelas ${clsId}`);
          }
        });
      }
      XLSX.writeFile(wb, `PAILMS_Siswa_${selectedExportClass}_${dateStr}.xlsx`);
    } else if (type === "rekap") {
      const cleanSheetTab = (tabName: string) =>
        tabName.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 30);

      const headers = REKAP_PAI_HEADERS;
      const getRekapRow = formatRekapRow;
      const getSummaryRow = formatRekapSummaryRow;

      if (selectedExportClass === "ALL") {
        // Tab 1: Master Sheet with clear grouping sections per inputted class
        const masterRows: (string | number)[][] = [
          [`BUKU REKAPITULASI NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI (SEMUA KELAS) - ${schoolName.toUpperCase()}`],
          [`Tahun Ajaran 2025/2026 • KKTP Acuan: 75 • Total: ${unifiedRekap.length} Siswa (${inputtedRekapClasses.length} Rombel Terdata) • Tanggal Ekspor: ${now}`],
          []
        ];

        inputtedRekapClasses.forEach((cId) => {
          const classRekap = unifiedRekap
            .filter((r) => r.kelasId === cId)
            .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
          if (classRekap.length === 0) return;

          const wali = classes?.find((c) => c.id === cId)?.waliKelasNama || "-";
          masterRows.push([`=== KELOMPOK ROMBEL KELAS ${cId} (Wali Kelas: ${wali} • Total: ${classRekap.length} Siswa) ===`]);
          masterRows.push(headers);

          classRekap.forEach((r, idx) => masterRows.push(getRekapRow(r, idx)));
          masterRows.push(getSummaryRow(classRekap, cId));
          masterRows.push([]); // blank visual separator
        });

        if (unifiedRekap.length > 0) {
          masterRows.push(getSummaryRow(unifiedRekap, "Semua Kelas"));
          masterRows.push([]);
          masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
          masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
          masterRows.push([]);
          masterRows.push([]);
          masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
          masterRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
        }
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(masterRows), "Master Semua Kelas");

        // Tab 2..N: Individual sheet for each inputted class
        inputtedRekapClasses.forEach((cId) => {
          const classRekap = unifiedRekap
            .filter((r) => r.kelasId === cId)
            .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
          if (classRekap.length === 0) return;

          const wali = classes?.find((c) => c.id === cId)?.waliKelasNama || "-";
          const classRows: (string | number)[][] = [
            [`BUKU REKAPITULASI NILAI PAI & BUDI PEKERTI - KELAS ${cId}`],
            [`${schoolName.toUpperCase()}`],
            [`Wali Kelas: ${wali} • Rombel: ${cId} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Tanggal Ekspor: ${now}`],
            [],
            headers
          ];

          classRekap.forEach((r, idx) => classRows.push(getRekapRow(r, idx)));
          classRows.push([]);
          classRows.push(getSummaryRow(classRekap, cId));
          classRows.push([]);
          classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
          classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
          classRows.push([]);
          classRows.push([]);
          classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
          classRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);

          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(classRows), cleanSheetTab(`Kelas ${cId}`));
        });
      } else {
        // Specific class sheet
        const classRekap = unifiedRekap
          .filter((r) => r.kelasId === selectedExportClass)
          .sort((a, b) => a.siswaNama.localeCompare(b.siswaNama, "id", { sensitivity: "base" }));
        const wali = classes?.find((c) => c.id === selectedExportClass)?.waliKelasNama || "-";

        const rows: (string | number)[][] = [
          [`BUKU REKAPITULASI NILAI PAI & BUDI PEKERTI - KELAS ${selectedExportClass}`],
          [`${schoolName.toUpperCase()}`],
          [`Wali Kelas: ${wali} • Rombel: ${selectedExportClass} • KKTP: 75 • Jumlah: ${classRekap.length} Siswa • Tanggal Ekspor: ${now}`],
          [],
          headers
        ];

        classRekap.forEach((r, idx) => rows.push(getRekapRow(r, idx)));
        if (classRekap.length > 0) {
          rows.push([]);
          rows.push(getSummaryRow(classRekap, selectedExportClass));
          rows.push([]);
          rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Mengetahui,", "", "Guru Mata Pelajaran PAI,"]);
          rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Kepala Sekolah,", "", ""]);
          rows.push([]);
          rows.push([]);
          rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Drs. H. Mulyadi, M.M.", "", "Sadiqul Alim, S.Pd.I., M.Pd."]);
          rows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "NIP. 19700318 199503 1 002", "", "NIP. 19790917 201407 1 004"]);
        }

        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), cleanSheetTab(`Kelas ${selectedExportClass}`));
      }

      XLSX.writeFile(wb, `PAILMS_RekapNilai_${selectedExportClass}_${dateStr}.xlsx`);
    } else if (type === "jurnal") {
      const exportJurnal = selectedExportClass === "ALL" ? jurnalMengajar : jurnalMengajar.filter((j) => j.kelasId === selectedExportClass);
      const headers = ["No", "Tanggal", "Kelas", "Jam Ke", "Materi Pokok", "Hadir", "Sakit", "Izin", "Alpa", "Catatan Refleksi"];
      const rows = [
        [`JURNAL MENGAJAR GURU PAI - ${schoolName.toUpperCase()}`],
        [`Rombel: ${selectedExportClass === "ALL" ? "Semua Kelas" : selectedExportClass} • Total: ${exportJurnal.length} Pertemuan • Tanggal: ${now}`],
        [],
        headers,
        ...exportJurnal.map((j, idx) => [
          idx + 1,
          j.tanggal,
          j.kelasId,
          j.jamKe,
          j.materiPokok,
          j.kehadiranHadir,
          j.kehadiranSakit,
          j.kehadiranIzin,
          j.kehadiranAlpa,
          j.catatanKejadian || "-"
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Jurnal Mengajar");
      XLSX.writeFile(wb, `PAILMS_JurnalMengajar_${selectedExportClass}_${dateStr}.xlsx`);
    } else if (type === "ibadah") {
      const studentMap = new Map<string, Siswa>();
      students.forEach((s) => studentMap.set(s.nisn, s));

      const exportIbadah = selectedExportClass === "ALL"
        ? jurnalIbadah
        : jurnalIbadah.filter((i) => (studentMap.get(i.siswaNisn)?.kelasId || "") === selectedExportClass);

      const headers = ["No", "Tanggal", "NISN", "Nama Siswa", "Kelas", "Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya", "Dhuha", "Tadarus Al-Qur'an", "Bantu Orang Tua", "Catatan"];
      const rows = [
        [`JURNAL IBADAH HARIAN SISWA - ${schoolName.toUpperCase()}`],
        [`Rombel: ${selectedExportClass === "ALL" ? "Semua Kelas" : selectedExportClass} • Total: ${exportIbadah.length} Catatan • Tanggal: ${now}`],
        [],
        headers,
        ...exportIbadah.map((i, idx) => {
          const s = studentMap.get(i.siswaNisn);
          return [
            idx + 1,
            i.tanggal,
            i.siswaNisn,
            s?.nama || "Siswa",
            s?.kelasId || "-",
            i.sholatSubuh ? "Ya" : "Tidak",
            i.sholatDzuhur ? "Ya" : "Tidak",
            i.sholatAshar ? "Ya" : "Tidak",
            i.sholatMaghrib ? "Ya" : "Tidak",
            i.sholatIsya ? "Ya" : "Tidak",
            i.sholatDhuha ? "Ya" : "Tidak",
            i.membacaAlQuranAyat > 0 ? `${i.membacaAlQuranSurah || "Al-Qur'an"} (${i.membacaAlQuranAyat} ayat)` : "-",
            i.membantuOrangTua ? "Ya" : "Tidak",
            i.catatanKebaikan || "-"
          ];
        })
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Jurnal Ibadah");
      XLSX.writeFile(wb, `PAILMS_JurnalIbadah_${selectedExportClass}_${dateStr}.xlsx`);
    }
  };

  // Load sheet metadata & tabs for import
  const handleInspectSheet = async (idOrUrl?: string) => {
    const target = idOrUrl || sheetUrlOrId;
    const spreadsheetId = extractSpreadsheetId(target);
    if (!spreadsheetId) {
      setImportError("Harap masukkan URL atau ID Google Spreadsheet yang valid.");
      return;
    }

    setIsLoadingSheetData(true);
    setImportError(null);
    setPreviewRows([]);
    setParsedStudents([]);
    setParseWarnings([]);
    setImportSuccessMessage(null);

    try {
      const meta = await getSpreadsheetMetadata(spreadsheetId);
      const tabNames = meta.sheets.map((s) => s.properties.title);
      setAvailableSheetTabs(tabNames);
      const activeTabName = tabNames[0] || "Sheet1";
      setSelectedSheetTab(activeTabName);

      // Fetch first 30 rows for preview
      const range = `'${activeTabName}'!A1:Z50`;
      const values = await getSpreadsheetValues(spreadsheetId, range);
      setPreviewRows(values);

      // Parse students preview
      const { students: parsed, warnings } = parseSpreadsheetRowsToStudents(values, importClassId);
      setParsedStudents(parsed);
      setParseWarnings(warnings);
    } catch (err: any) {
      console.warn("Gagal membuka spreadsheet:", err?.message || err);
      let msg = err?.message || "";
      if (
        msg.includes("Requested entity was not found") ||
        msg.includes("not found") ||
        msg.includes("404")
      ) {
        msg = `Spreadsheet Google dengan ID '${spreadsheetId}' tidak ditemukan (404). Pastikan tautan/ID benar dan dokumen telah dibagikan (akses lihat/edit) ke akun Google Anda.`;
      } else if (msg.includes("Failed to fetch")) {
        msg = "Koneksi membaca spreadsheet terhambat browser atau jaringan. Pastikan URL/ID benar dan akun Google Anda memiliki akses.";
      }
      setImportError(
        msg ||
          "Gagal membuka spreadsheet. Pastikan tautan benar dan akun Google Anda memiliki akses ke berkas tersebut."
      );
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  // Direct local Excel file upload (.xlsx / .xls / .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoadingSheetData(true);
    setImportError(null);
    setImportSuccessMessage(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const tabs = wb.SheetNames;
        if (!tabs || tabs.length === 0) {
          throw new Error("Berkas Excel tidak memiliki lembar kerja (tab).");
        }
        setAvailableSheetTabs(tabs);
        const firstTab = tabs[0];
        setSelectedSheetTab(firstTab);
        const ws = wb.Sheets[firstTab];
        const data: (string | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        setPreviewRows(data);
        const { students: parsed, warnings } = parseSpreadsheetRowsToStudents(data, importClassId);
        setParsedStudents(parsed);
        setParseWarnings(warnings);
        setImportSuccessMessage(`Berkas '${file.name}' berhasil dibaca. Ditemukan ${parsed.length} data siswa.`);
      } catch (err: any) {
        console.error("Gagal membaca berkas Excel:", err);
        setImportError("Gagal membaca berkas Excel: " + (err?.message || "Format tidak valid"));
      } finally {
        setIsLoadingSheetData(false);
      }
    };
    reader.onerror = () => {
      setImportError("Gagal membaca berkas dari perangkat.");
      setIsLoadingSheetData(false);
    };
    reader.readAsBinaryString(file);
  };

  // Commit imported students to application state
  const handleCommitImport = () => {
    if (parsedStudents.length === 0) {
      setImportError("Tidak ada data siswa valid yang ditemukan untuk diimpor.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Impor Data Siswa",
      description: `Apakah Anda yakin ingin menambahkan ${parsedStudents.length} peserta didik dari Google Sheets ke database lokal PAILMS?`,
      itemCount: parsedStudents.length,
      actionLabel: "Impor Sekarang",
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        if (onBulkAddStudents) {
          onBulkAddStudents(parsedStudents);
          setImportSuccessMessage(
            `Berhasil mengimpor ${parsedStudents.length} peserta didik ke dalam database aplikasi!`
          );
          setPreviewRows([]);
          setParsedStudents([]);
        }
      }
    });
  };

  const filteredDriveFiles = driveFiles.filter((f) =>
    f.name.toLowerCase().includes(driveSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Integrasi Google Workspace & Sheets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sinkronisasi Google Sheets & Drive
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Ekspor daftar siswa, buku nilai PAI, jurnal mengajar, dan jurnal ibadah langsung ke
              spreadsheet Google Drive pribadi Anda, atau impor data peserta didik dalam hitungan detik.
            </p>
          </div>

          {/* Account Card / Google Sign In */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 max-w-sm">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Google User"}
                      className="w-10 h-10 rounded-full border-2 border-amber-400 shadow-sm object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-amber-300 font-black flex items-center justify-center text-sm border-2 border-amber-400">
                      {(user.displayName || user.email || "G")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {token?.startsWith("ya29.") ? "Google Workspace Aktif" : "Sesi Guru Aktif (Mandiri)"}
                    </span>
                    <span className="block text-sm font-bold text-white truncate max-w-[190px]">
                      {user.displayName || "Pengguna Google"}
                    </span>
                    <span className="block text-[11px] text-emerald-200 truncate max-w-[190px]">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  {token?.startsWith("ya29.") ? (
                    <button
                      type="button"
                      onClick={loadDriveFiles}
                      disabled={isLoadingDrive}
                      className="text-[11px] font-bold text-emerald-200 hover:text-white flex items-center gap-1 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingDrive ? "animate-spin" : ""}`} />
                      Segarkan Drive
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignIn}
                      disabled={isSigningIn}
                      className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition cursor-pointer"
                    >
                      <UploadCloud className="w-3 h-3" />
                      {isSigningIn ? "Menghubungkan..." : "Hubungkan Google"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[11px] font-bold text-red-300 hover:text-red-200 flex items-center gap-1 transition cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1 justify-center sm:justify-start">
                    <span className="block text-xs font-bold text-amber-300">
                      Hubungkan Akun Google
                    </span>
                    {isInsideIframe && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md font-semibold">
                        Mode Pratinjau
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-100 leading-snug">
                    Izin diperlukan untuk membuat dan mengelola spreadsheet di Google Drive Anda.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <GoogleSignInButton
                    onClick={handleSignIn}
                    isLoading={isSigningIn}
                    className="w-full text-xs py-2"
                  />
                  {isInsideIframe && (
                    <button
                      type="button"
                      onClick={() => window.open(window.location.href, "_blank")}
                      className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold rounded-xl border border-emerald-600/60 flex items-center justify-center gap-1.5 shrink-0 transition cursor-pointer"
                      title="Buka aplikasi di tab baru agar login Google lancar tanpa terhalang sandbox iframe"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>Buka Tab Baru</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-4 p-4 bg-amber-950/90 border border-amber-500/60 rounded-2xl text-xs text-amber-100 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>
                    {isPopupBlocked
                      ? "Jendela Pop-up Login Diblokir Peramban"
                      : isPopupClosed
                      ? "Jendela Login Google Ditutup"
                      : "Pemberitahuan Akun Google"}
                  </span>
                </div>
                <p className="leading-relaxed text-amber-200/90">{authError}</p>

                {(isPopupBlocked || isPopupClosed || isInsideIframe) && (
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => window.open(window.location.href, "_blank")}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Aplikasi di Tab Baru (Disarankan)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-white/20"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Coba Login Lagi</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  setIsPopupBlocked(false);
                  setIsPopupClosed(false);
                }}
                className="text-amber-300 hover:text-white p-1 rounded-lg transition cursor-pointer"
                title="Tutup Pesan"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-white rounded-2xl p-1.5 shadow-xs gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("export")}
          className={`flex-1 min-w-[150px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === "export"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <DownloadCloud className="w-4 h-4 text-amber-400" />
          <span>Ekspor Cepat Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rekap-pai")}
          className={`flex-1 min-w-[180px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === "rekap-pai"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Rekap Nilai PAI (Multi-Tab)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("drive")}
          className={`flex-1 min-w-[150px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === "drive"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FolderSync className="w-4 h-4 text-amber-400" />
          <span>Spreadsheet Google Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("import")}
          className={`flex-1 min-w-[150px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === "import"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Impor dari Google Sheets</span>
        </button>
      </div>

      {/* TAB 1: EKSPOR CEPAT */}
      {activeTab === "export" && (
        <div className="space-y-6">
          {/* Class Filter Bar for Grouping */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                  <Filter className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Pengelompokan Rombel Kelas untuk Ekspor
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                  <Layers className="w-3 h-3 text-emerald-700" />
                  <span>
                    {selectedExportClass === "ALL"
                      ? `Multi-Tab Otomatis (${availableExportClasses.length} Rombel)`
                      : `Khusus Kelas ${selectedExportClass}`}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedExportClass === "ALL"
                  ? "Pilihan 'Semua Kelas' akan otomatis mengelompokkan data ke lembar kerja (tab) terpisah untuk setiap kelas, ditambah lembar ringkasan master."
                  : `Hanya mengekspor data yang termasuk dalam rombel Kelas ${selectedExportClass} ke spreadsheet.`}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <label htmlFor="export-class-select" className="text-xs font-bold text-slate-600 shrink-0">
                Pilih Rombel:
              </label>
              <select
                id="export-class-select"
                value={selectedExportClass}
                onChange={(e) => setSelectedExportClass(e.target.value)}
                className="w-full md:w-64 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none transition cursor-pointer"
              >
                <option value="ALL">🌟 Semua Kelas (Tab Terpisah per Rombel)</option>
                {availableExportClasses.map((cId) => (
                  <option key={cId} value={cId}>
                    Khusus Rombel Kelas {cId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Siswa */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedExportClass === "ALL" ? "Multi-Tab" : selectedExportClass}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Daftar Peserta Didik</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedExportClass === "ALL"
                    ? `Ekspor ${students.length} siswa dengan lembar tab terpisah per rombel kelas.`
                    : `Ekspor data ${filteredStudentCount} siswa khusus rombel Kelas ${selectedExportClass}.`}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    requestExport(
                      "students",
                      selectedExportClass === "ALL"
                        ? "Ekspor Data Siswa (Multi-Tab per Kelas)"
                        : `Ekspor Data Siswa Kelas ${selectedExportClass}`,
                      selectedExportClass === "ALL"
                        ? `Aplikasi akan membuat Google Spreadsheet berisi data seluruh ${students.length} peserta didik yang dikelompokkan ke tab lembar kerja terpisah untuk masing-masing rombel (${availableExportClasses.join(", ")}), plus 1 tab master ringkasan.`
                        : `Aplikasi akan membuat Google Spreadsheet berisi data ${filteredStudentCount} peserta didik khusus untuk rombel Kelas ${selectedExportClass}.`,
                      filteredStudentCount
                    )
                  }
                  disabled={isExporting !== null || filteredStudentCount === 0}
                  className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExporting === "students" ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {selectedExportClass === "ALL"
                      ? `Ekspor Sheets (${students.length})`
                      : `Ekspor Sheets ${selectedExportClass} (${filteredStudentCount})`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadExcel("students")}
                  disabled={filteredStudentCount === 0}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Rekap Nilai */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedExportClass === "ALL" ? "Multi-Tab" : selectedExportClass}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Rekapitulasi Nilai PAI</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedExportClass === "ALL"
                    ? `Buku nilai otomatis ${unifiedRekap.length} siswa, dikelompokkan ke tab terpisah per rombel kelas (${inputtedRekapClasses.join(", ")}).`
                    : `Buku nilai ${filteredRekapCount} siswa khusus rombel Kelas ${selectedExportClass}.`}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    requestExport(
                      "rekap",
                      selectedExportClass === "ALL"
                        ? "Ekspor Rekapitulasi Nilai (Multi-Tab per Kelas)"
                        : `Ekspor Rekapitulasi Nilai Kelas ${selectedExportClass}`,
                      selectedExportClass === "ALL"
                        ? `Aplikasi akan membuat Google Spreadsheet berisi buku rekap nilai PAI yang dikelompokkan per tab rombel kelas (${inputtedRekapClasses.join(", ")}), lengkap dengan capaian KKTP dan rata-rata.`
                        : `Aplikasi akan membuat Google Spreadsheet berisi rekap nilai ${filteredRekapCount} peserta didik khusus untuk rombel Kelas ${selectedExportClass}.`,
                      filteredRekapCount
                    )
                  }
                  disabled={isExporting !== null || filteredRekapCount === 0}
                  className="w-full py-2.5 px-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExporting === "rekap" ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {selectedExportClass === "ALL"
                      ? `Ekspor Sheets (${unifiedRekap.length})`
                      : `Ekspor Sheets ${selectedExportClass} (${filteredRekapCount})`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadExcel("rekap")}
                  disabled={filteredRekapCount === 0}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Card 3: Jurnal Mengajar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {selectedExportClass === "ALL" ? "Multi-Tab" : selectedExportClass}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Jurnal Mengajar Guru</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedExportClass === "ALL"
                    ? `Agenda ${jurnalMengajar.length} tatap muka, dikelompokkan ke tab per rombel kelas.`
                    : `Agenda ${filteredJurnalCount} tatap muka khusus rombel Kelas ${selectedExportClass}.`}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    requestExport(
                      "jurnal",
                      selectedExportClass === "ALL"
                        ? "Ekspor Jurnal Mengajar (Multi-Tab per Kelas)"
                        : `Ekspor Jurnal Mengajar Kelas ${selectedExportClass}`,
                      selectedExportClass === "ALL"
                        ? `Aplikasi akan membuat Google Spreadsheet berisi agenda mengajar harian yang dikelompokkan ke tab lembar kerja terpisah per rombel kelas.`
                        : `Aplikasi akan membuat Google Spreadsheet agenda mengajar khusus untuk rombel Kelas ${selectedExportClass} (${filteredJurnalCount} pertemuan).`,
                      filteredJurnalCount
                    )
                  }
                  disabled={isExporting !== null || filteredJurnalCount === 0}
                  className="w-full py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExporting === "jurnal" ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {selectedExportClass === "ALL"
                      ? `Ekspor Sheets (${jurnalMengajar.length})`
                      : `Ekspor Sheets ${selectedExportClass} (${filteredJurnalCount})`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadExcel("jurnal")}
                  disabled={filteredJurnalCount === 0}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Card 4: Jurnal Ibadah */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    {selectedExportClass === "ALL" ? "Multi-Tab" : selectedExportClass}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Jurnal Ibadah Siswa</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedExportClass === "ALL"
                    ? `Catatan ${jurnalIbadah.length} amalan ibadah, dikelompokkan ke tab per rombel.`
                    : `Catatan ${filteredIbadahCount} amalan khusus rombel Kelas ${selectedExportClass}.`}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    requestExport(
                      "ibadah",
                      selectedExportClass === "ALL"
                        ? "Ekspor Jurnal Ibadah (Multi-Tab per Kelas)"
                        : `Ekspor Jurnal Ibadah Siswa Kelas ${selectedExportClass}`,
                      selectedExportClass === "ALL"
                        ? `Aplikasi akan membuat Google Spreadsheet berisi catatan ibadah harian yang dikelompokkan ke dalam tab lembar kerja terpisah per rombel kelas.`
                        : `Aplikasi akan membuat Google Spreadsheet catatan ibadah khusus untuk rombel Kelas ${selectedExportClass} (${filteredIbadahCount} catatan).`,
                      filteredIbadahCount
                    )
                  }
                  disabled={isExporting !== null || filteredIbadahCount === 0}
                  className="w-full py-2.5 px-3 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExporting === "ibadah" ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {selectedExportClass === "ALL"
                      ? `Ekspor Sheets (${jurnalIbadah.length})`
                      : `Ekspor Sheets ${selectedExportClass} (${filteredIbadahCount})`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadExcel("ibadah")}
                  disabled={filteredIbadahCount === 0}
                  className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>

          {!user && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  Silakan masuk dengan akun Google untuk mengaktifkan tombol ekspor langsung ke Google Drive.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <GoogleSignInButton onClick={handleSignIn} isLoading={isSigningIn} text="Masuk Google" />
                {isInsideIframe && (
                  <button
                    type="button"
                    onClick={() => window.open(window.location.href, "_blank")}
                    className="p-2.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition cursor-pointer"
                    title="Buka di Tab Baru untuk login tanpa batasan iframe"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-800" />
                  </button>
                )}
              </div>
            </div>
          )}

          {exportError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {/* Recent Exports Log */}
          {recentExports.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Berkas Baru Saja Dibuat di Google Sheets</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {recentExports.length} Berkas
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {recentExports.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          {item.rowCount} baris data
                          {item.sheetCount && item.sheetCount > 1
                            ? ` • ${item.sheetCount} tab rombel`
                            : ""}
                          {" "}• ID: {item.spreadsheetId.slice(0, 16)}...
                        </span>
                      </div>
                    </div>
                    {item.spreadsheetUrl ? (
                      <a
                        href={item.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0 border border-emerald-200"
                      >
                        <span>Buka di Google Sheets</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersimpan di Perangkat (.xlsx)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB REKAP NILAI PAI (MULTI-TAB PER KELAS) */}
      {activeTab === "rekap-pai" && (
        <div className="space-y-6">
          {/* Top Banner & Action Bar */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Buku Rekapitulasi Nilai PAI & Budi Pekerti
                  </span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-emerald-100 font-bold text-[11px] rounded-full">
                    KKTP Acuan: 75
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Rekap Nilai Siswa Terkelompok Per Kelas
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Laporan rekapitulasi nilai komprehensif (Formatif, Sumatif, Hafalan Juz &apos;Amma, Praktik Ibadah, Nilai Akhir, Predikat, dan Deskripsi Capaian). Siap diekspor langsung ke Google Sheets (Multi-Tab Otomatis) atau diunduh ke Excel (.xlsx).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExportClass(rekapTabClassFilter);
                    requestExport(
                      "rekap",
                      rekapTabClassFilter === "ALL"
                        ? "Ekspor Rekapitulasi Nilai PAI (Multi-Tab per Rombel)"
                        : `Ekspor Rekapitulasi Nilai PAI Kelas ${rekapTabClassFilter}`,
                      rekapTabClassFilter === "ALL"
                        ? `Aplikasi akan membuat Google Spreadsheet berisi seluruh ${unifiedRekap.length} data nilai siswa, dikelompokkan ke tab terpisah untuk setiap kelas (${inputtedRekapClasses.join(", ")}), plus 1 tab Master Semua Kelas.`
                        : `Aplikasi akan membuat Google Spreadsheet berisi rekap nilai ${rekapTabFiltered.length} siswa khusus untuk rombel Kelas ${rekapTabClassFilter}.`,
                      rekapTabFiltered.length
                    );
                  }}
                  disabled={isExporting !== null || rekapTabFiltered.length === 0}
                  className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isExporting === "rekap" ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                  ) : (
                    <DownloadCloud className="w-4 h-4 text-slate-950" />
                  )}
                  <span>
                    {rekapTabClassFilter === "ALL"
                      ? `Ekspor ke Sheets (${unifiedRekap.length})`
                      : `Ekspor Sheets ${rekapTabClassFilter} (${rekapTabFiltered.length})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedExportClass(rekapTabClassFilter);
                    downloadExcel("rekap");
                  }}
                  disabled={rekapTabFiltered.length === 0}
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar: Grouped by Inputted Classes */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Pilih Kelompok Rombel Kelas Terinput:
                </span>
                <p className="text-xs text-slate-600">
                  Data otomatis dikelompokkan berdasarkan rombel siswa yang sudah memiliki data nilai di sistem.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={rekapTabSearchQuery}
                  onChange={(e) => setRekapTabSearchQuery(e.target.value)}
                  placeholder="Cari siswa atau NISN..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                {rekapTabSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRekapTabSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Class Pill Filters */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => setRekapTabClassFilter("ALL")}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  rekapTabClassFilter === "ALL"
                    ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Semua Rombel (Multi-Tab Master)</span>
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  rekapTabClassFilter === "ALL" ? "bg-white/20 text-white" : "bg-white text-slate-600"
                }`}>
                  {unifiedRekap.length}
                </span>
              </button>

              {inputtedRekapClasses.map((cls) => {
                const count = unifiedRekap.filter((r) => r.kelasId === cls).length;
                const isSelected = rekapTabClassFilter === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setRekapTabClassFilter(cls)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Kelas {cls}</span>
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-white text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Siswa Terdata</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{rekapTabFiltered.length}</span>
                <span className="text-xs text-slate-500 font-semibold">
                  {rekapTabClassFilter === "ALL" ? `dari ${inputtedRekapClasses.length} Rombel` : `Rombel ${rekapTabClassFilter}`}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Rerata Nilai Akhir (NA)</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`text-2xl font-black ${rekapTabStats.avgNA >= 75 ? "text-emerald-700" : "text-amber-700"}`}>
                  {rekapTabStats.avgNA}
                </span>
                <span className="text-xs text-slate-500 font-semibold">KKTP: 75</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ketuntasan Belajar</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">{rekapTabStats.pctTuntas}%</span>
                <span className="text-xs text-slate-500 font-semibold">
                  {rekapTabStats.tuntasCount}/{rekapTabFiltered.length} Siswa
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Rata Formatif & Sumatif</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-700">{rekapTabStats.avgFormatif}</span>
                <span className="text-xs text-slate-500 font-semibold">
                  / Sumatif: {rekapTabStats.avgSumatif}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Rekap Table with All Columns */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Daftar Nilai PAI: {rekapTabClassFilter === "ALL" ? "Semua Rombel (Seluruh Kelas)" : `Kelas ${rekapTabClassFilter}`}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  ({rekapTabFiltered.length} Siswa)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-semibold">Format Kolom: Standar Kurikulum Merdeka PAI</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 w-12 text-center">No</th>
                    <th className="py-3 px-3 w-28">NISN</th>
                    <th className="py-3 px-4 min-w-[200px]">Nama Lengkap Siswa</th>
                    <th className="py-3 px-3 w-20 text-center">Kelas</th>
                    <th className="py-3 px-2.5 text-center bg-blue-50/40 text-blue-900">Kuis</th>
                    <th className="py-3 px-2.5 text-center bg-blue-50/40 text-blue-900">Tugas</th>
                    <th className="py-3 px-2.5 text-center bg-blue-50/40 text-blue-900">Diskusi</th>
                    <th className="py-3 px-2.5 text-center bg-blue-100/60 font-extrabold text-blue-950">Rata Fmt</th>
                    <th className="py-3 px-2.5 text-center bg-amber-50/40 text-amber-900">PTS</th>
                    <th className="py-3 px-2.5 text-center bg-amber-50/40 text-amber-900">PAS</th>
                    <th className="py-3 px-2.5 text-center bg-purple-50/40 text-purple-900">Hafalan</th>
                    <th className="py-3 px-2.5 text-center bg-purple-50/40 text-purple-900">Sholat</th>
                    <th className="py-3 px-2.5 text-center bg-purple-50/40 text-purple-900">Wudhu</th>
                    <th className="py-3 px-3 text-center bg-emerald-100/70 font-black text-emerald-950">NA</th>
                    <th className="py-3 px-2.5 text-center">KKTP</th>
                    <th className="py-3 px-3 text-center">Predikat</th>
                    <th className="py-3 px-3 text-center">Keterangan</th>
                    <th className="py-3 px-4 min-w-[220px]">Deskripsi Capaian Pembelajaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {rekapTabFiltered.length === 0 ? (
                    <tr>
                      <td colSpan={18} className="py-12 text-center text-slate-400">
                        Tidak ada data nilai siswa untuk filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    rekapTabFiltered.map((r, idx) => {
                      const avgFormatif = Math.round((r.formatifKuis + r.formatifTugas + r.formatifDiskusi) / 3);
                      const na = Math.round(avgFormatif * 0.4 + r.sumatifPts * 0.3 + r.sumatifPas * 0.3);
                      const isTuntas = na >= 75;
                      const predikat =
                        na >= 88 ? "A (Sangat Baik)" : na >= 75 ? "B (Baik)" : na >= 65 ? "C (Cukup)" : "D (Perlu Bimbingan)";
                      const deskripsi =
                        na >= 88
                          ? "Sangat menguasai pemahaman materi PAI, bacaan Qur'an & praktik ibadah dengan prima."
                          : na >= 75
                          ? "Mampu memahami materi PAI serta melaksanakan tata cara ibadah harian dengan baik."
                          : na >= 65
                          ? "Cukup memahami materi pokok PAI, memerlukan pendampingan berkala pada praktik ibadah."
                          : "Perlu bimbingan intensif dan remedial terjadwal pada kompetensi PAI & pengamalan ibadah.";

                      return (
                        <tr key={r.siswaNisn || idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 text-center text-slate-400 text-xs font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{r.siswaNisn}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{r.siswaNama}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                              {r.kelasId}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.formatifKuis}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.formatifTugas}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.formatifDiskusi}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold bg-blue-50/50 text-blue-900">
                            {avgFormatif}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.sumatifPts}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.sumatifPas}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.hafalanJuzAmmaScore || 85}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.praktikSholat || 85}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono">{r.praktikWudhu || 85}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-black text-sm bg-emerald-50/70 text-emerald-950">
                            {na}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono text-slate-500">75</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              na >= 88
                                ? "bg-emerald-100 text-emerald-800"
                                : na >= 75
                                ? "bg-blue-100 text-blue-800"
                                : na >= 65
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {predikat}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isTuntas ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {isTuntas ? "Tuntas" : "Remedial"}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-xs text-slate-600 leading-relaxed">
                            {deskripsi}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {rekapTabFiltered.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={3} className="py-3 px-4 text-right">
                        RATA-RATA KELAS ({rekapTabClassFilter === "ALL" ? "Seluruh Rombel" : `Kelas ${rekapTabClassFilter}`}):
                      </td>
                      <td className="py-3 px-3 text-center">{rekapTabClassFilter}</td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + b.formatifKuis, 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + b.formatifTugas, 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + b.formatifDiskusi, 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono text-blue-900">
                        {rekapTabStats.avgFormatif}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + b.sumatifPts, 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + b.sumatifPas, 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + (b.hafalanJuzAmmaScore || 85), 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + (b.praktikSholat || 85), 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">
                        {Math.round(rekapTabFiltered.reduce((a, b) => a + (b.praktikWudhu || 85), 0) / rekapTabFiltered.length)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-900 text-sm">
                        {rekapTabStats.avgNA}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono">75</td>
                      <td className="py-3 px-3 text-center">
                        {rekapTabStats.avgNA >= 88 ? "A" : rekapTabStats.avgNA >= 75 ? "B" : "C"}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-emerald-800">
                        Tuntas: {rekapTabStats.tuntasCount}/{rekapTabFiltered.length} ({rekapTabStats.pctTuntas}%)
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        Rata-rata ketuntasan kelas {rekapTabStats.pctTuntas}%
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Info Banner: Multi-Tab Architecture Guarantee */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs text-emerald-950">
              <h4 className="font-extrabold text-sm text-emerald-900">
                Struktur Multi-Tab Otomatis Berkas Google Sheets & Excel
              </h4>
              <p className="leading-relaxed text-emerald-800">
                Saat mengekspor <span className="font-bold">&quot;Semua Rombel (Multi-Tab)&quot;</span>, berkas Google Sheets maupun unduhan Excel akan otomatis disusun menjadi:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-900/90 pt-1 font-medium">
                <li><span className="font-bold">Tab 1 (Master Semua Kelas):</span> Berisi rekapitulasi seluruh rombel dengan pemisah kelompok kelas, subtotal nilai per rombel, serta rekapitulasi total.</li>
                <li><span className="font-bold">Tab 2..N (Tab Mandiri Per Rombel):</span> Setiap kelas yang telah diinputkan (misal: <span className="font-mono font-bold">{inputtedRekapClasses.map(c => `Kelas ${c}`).join(", ")}</span>) memiliki sheet terpisah yang rapi.</li>
                <li><span className="font-bold">Format Resmi & Tanda Tangan:</span> Dilengkapi kop UPT SMPN 2 Rebang Tangkas, KKTP 75, Predikat, Keterangan, Deskripsi Capaian, serta kolom tanda tangan Kepala Sekolah & Guru PAI.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TELUSURI GOOGLE DRIVE */}
      {activeTab === "drive" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Berkas Google Sheets di Google Drive Anda
              </h3>
              <p className="text-xs text-slate-500">
                Daftar dokumen spreadsheet yang dapat Anda buka, bagikan, atau gunakan sebagai sumber data.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama spreadsheet..."
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={loadDriveFiles}
                disabled={isLoadingDrive}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition cursor-pointer"
                title="Segarkan berkas"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDrive ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {(!token || !token.startsWith("ya29.")) ? (
            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Lock className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Akses Google Drive Memerlukan Akun Google Terhubung</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Aplikasi sedang beroperasi dalam mode mandiri (tanpa Firebase). Untuk menjelajahi dan membuka berkas Google Spreadsheet di Google Drive Anda, hubungkan akun Google dengan tombol di bawah.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <GoogleSignInButton onClick={handleSignIn} isLoading={isSigningIn} />
                {isInsideIframe && (
                  <button
                    type="button"
                    onClick={() => window.open(window.location.href, "_blank")}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Buka Tab Baru</span>
                  </button>
                )}
              </div>
            </div>
          ) : driveError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center justify-between">
              <span>{driveError}</span>
              <button
                onClick={loadDriveFiles}
                className="font-bold text-red-900 underline hover:no-underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : isLoadingDrive ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs font-bold">Memuat berkas dari Google Drive...</p>
            </div>
          ) : filteredDriveFiles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                {driveSearch ? "Tidak ada spreadsheet yang cocok dengan pencarian" : "Belum ada spreadsheet ditemukan"}
              </p>
              <p className="text-[11px] text-slate-400">
                Gunakan tab "Ekspor ke Google Sheets" untuk membuat spreadsheet pertama Anda.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {filteredDriveFiles.map((file) => (
                <div
                  key={file.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 truncate">
                        {file.name}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        Diperbarui: {new Date(file.modifiedTime).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSheetUrlOrId(file.id);
                        setActiveTab("import");
                        handleInspectSheet(file.id);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Impor Data</span>
                    </button>

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg transition"
                        title="Buka Spreadsheet di Google Sheets"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IMPOR DATA DARI GOOGLE SHEETS */}
      {activeTab === "import" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Impor Data Peserta Didik dari Google Sheets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan tautan berbagi atau ID spreadsheet Google untuk membaca baris data siswa secara otomatis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tempel URL (https://docs.google.com/spreadsheets/d/...) atau ID Spreadsheet"
                  value={sheetUrlOrId}
                  onChange={(e) => setSheetUrlOrId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleInspectSheet()}
                disabled={isLoadingSheetData || !sheetUrlOrId.trim()}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoadingSheetData ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Search className="w-4 h-4 text-amber-400" />
                )}
                <span>Muat Lembar Kerja</span>
              </button>
            </div>

            {/* Direct Local Excel File Upload */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold text-slate-800">
                    Atau Unggah Berkas Excel dari Komputer (.xlsx / .xls / .csv)
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Impor langsung tanpa memerlukan login akun Google.
                  </span>
                </div>
              </div>
              <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0">
                <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilih Berkas Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {(!token || !token.startsWith("ya29.")) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>Ingin membuka Google Sheets privat Anda langsung dari Google Drive?</span>
                <div className="flex items-center gap-2 shrink-0">
                  <GoogleSignInButton onClick={handleSignIn} isLoading={isSigningIn} text="Hubungkan Google" />
                  {isInsideIframe && (
                    <button
                      type="button"
                      onClick={() => window.open(window.location.href, "_blank")}
                      className="p-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition cursor-pointer"
                      title="Buka di Tab Baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-800" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            {/* Sheet Tabs & Class selection */}
            {availableSheetTabs.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Pilih Lembar (Tab):</label>
                  <select
                    value={selectedSheetTab}
                    onChange={(e) => {
                      const tab = e.target.value;
                      setSelectedSheetTab(tab);
                      const id = extractSpreadsheetId(sheetUrlOrId);
                      if (id) {
                        const range = `'${tab}'!A1:Z50`;
                        getSpreadsheetValues(id, range)
                          .then((vals) => {
                            setPreviewRows(vals);
                            const { students: p, warnings: w } = parseSpreadsheetRowsToStudents(
                              vals,
                              importClassId
                            );
                            setParsedStudents(p);
                            setParseWarnings(w);
                          })
                          .catch((err) => {
                            console.warn("Gagal membaca tab spreadsheet:", err?.message || err);
                            setImportError(
                              err?.message || `Gagal membaca isi tab '${tab}'.`
                            );
                          });
                      }
                    }}
                    className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    {availableSheetTabs.map((tab) => (
                      <option key={tab} value={tab}>
                        {tab}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Kelas Default:</label>
                  <select
                    value={importClassId}
                    onChange={(e) => {
                      setImportClassId(e.target.value);
                      if (previewRows.length > 0) {
                        const { students: p, warnings: w } = parseSpreadsheetRowsToStudents(
                          previewRows,
                          e.target.value
                        );
                        setParsedStudents(p);
                        setParseWarnings(w);
                      }
                    }}
                    className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* PARSED STUDENTS PREVIEW */}
          {parsedStudents.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terdeteksi {parsedStudents.length} Peserta Didik Siap Diimpor</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tinjau data di bawah ini sebelum menyimpannya ke database PAILMS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCommitImport}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Simpan ke Database Siswa</span>
                </button>
              </div>

              {parseWarnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <span className="font-bold block">Peringatan / Penyesuaian Kolom:</span>
                  {parseWarnings.slice(0, 3).map((w, idx) => (
                    <p key={idx} className="text-[11px]">
                      • {w}
                    </p>
                  ))}
                  {parseWarnings.length > 3 && (
                    <p className="text-[11px] text-amber-600 italic">
                      + {parseWarnings.length - 3} catatan lainnya
                    </p>
                  )}
                </div>
              )}

              <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold sticky top-0">
                    <tr>
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">NISN</th>
                      <th className="p-2.5">Nama Lengkap</th>
                      <th className="p-2.5">Kelas</th>
                      <th className="p-2.5">Gender</th>
                      <th className="p-2.5">Kontak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {parsedStudents.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-900">{s.nisn}</td>
                        <td className="p-2.5 font-bold">{s.nama}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {s.kelasId}
                          </span>
                        </td>
                        <td className="p-2.5">{s.gender}</td>
                        <td className="p-2.5 text-slate-500">{s.kontakOrangTua || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION DIALOG (Mandatory Workspace API Mutation Requirement) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 truncate">
                  {confirmModal.title}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Izin Operasi Google Workspace
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmModal.description}
            </p>

            {confirmModal.itemCount !== undefined && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Jumlah rekaman data:</span>
                <span className="font-extrabold text-slate-900">{confirmModal.itemCount} Baris</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition cursor-pointer"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
