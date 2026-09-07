/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  User,
  ShieldAlert,
  Users,
  Search,
  PlusCircle,
  FileText,
  Printer,
  Sliders,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Heart,
  Smile,
  AlertTriangle,
  Award,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  School,
  Check,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  FileUp,
  ChevronDown
} from "lucide-react";
import { DataSekolah, Guru, Kelas, Siswa, CatatanSikapSiswa, JurnalIbadahHarian, RekapNilaiTotal } from "../../types";
import { DataService } from "../../data/initialData";

interface DataDasarProps {
  guru: Guru;
  onUpdateGuru: (updated: Guru) => void;
  classes: Kelas[];
  onUpdateClasses?: (updatedClasses: Kelas[]) => void;
  students: Siswa[];
  onUpdateStudents?: (updatedStudents: Siswa[]) => void;
  onAddStudent: (newStudent: Siswa) => void;
  onBulkAddStudents?: (newStudentsList: Siswa[]) => void;
  onToggleStudentStatus: (nisn: string) => void;
  attitudes: CatatanSikapSiswa[];
  worships: JurnalIbadahHarian[];
  rekapNilai: RekapNilaiTotal[];
}

export default function DataDasar({
  guru,
  onUpdateGuru,
  classes,
  onUpdateClasses,
  students,
  onUpdateStudents,
  onAddStudent,
  onBulkAddStudents,
  onToggleStudentStatus,
  attitudes,
  worships,
  rekapNilai
}: DataDasarProps) {
  const [subTab, setSubTab] = useState<"guru" | "kelas" | "siswa" | "wali">("guru");

  // Profile & Sekolah Edit State
  const [isEditingGuru, setIsEditingGuru] = useState(false);
  const [editedGuru, setEditedGuru] = useState<Guru>({ ...guru });

  const [sekolah, setSekolah] = useState<DataSekolah>(() => DataService.getSekolah());
  const [isEditingSekolah, setIsEditingSekolah] = useState(false);
  const [editedSekolah, setEditedSekolah] = useState<DataSekolah>(sekolah);

  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.saveSekolah(editedSekolah);
    setSekolah(editedSekolah);
    setIsEditingSekolah(false);
    showToast("Data Sekolah berhasil diperbarui!");
  };

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Class Management States
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [addClassId, setAddClassId] = useState("");
  const [addClassNama, setAddClassNama] = useState("");
  const [addClassWaliNama, setAddClassWaliNama] = useState("");
  const [addClassWaliNip, setAddClassWaliNip] = useState("");
  const [addClassKuota, setAddClassKuota] = useState(32);

  const [editingClass, setEditingClass] = useState<Kelas | null>(null);
  const [editClassNama, setEditClassNama] = useState("");
  const [editClassWaliNama, setEditClassWaliNama] = useState("");
  const [editClassWaliNip, setEditClassWaliNip] = useState("");
  const [editClassKuota, setEditClassKuota] = useState(32);

  const handleOpenAddClass = () => {
    const nextChar = String.fromCharCode(65 + (classes.length % 26));
    setAddClassId(`VII-${nextChar}`);
    setAddClassNama(`Kelas VII-${nextChar}`);
    setAddClassWaliNama("");
    setAddClassWaliNip("");
    setAddClassKuota(32);
    setIsAddClassModalOpen(true);
  };

  const handleSaveNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addClassId.trim() || !addClassNama.trim()) {
      alert("Harap isi Kode Kelas dan Nama Kelas!");
      return;
    }

    const trimmedId = addClassId.trim().toUpperCase();
    if (classes.some((c) => c.id.toUpperCase() === trimmedId)) {
      alert(`Kode Kelas "${trimmedId}" sudah terdaftar! Gunakan kode kelas yang lain.`);
      return;
    }

    const newClassItem: Kelas = {
      id: trimmedId,
      nama: addClassNama.trim(),
      waliKelasNama: addClassWaliNama.trim() || "-",
      waliKelasNip: addClassWaliNip.trim() || "-",
      kuota: Number(addClassKuota) || 32,
      totalSiswa: 0
    };

    const updated = [...classes, newClassItem];
    if (onUpdateClasses) {
      onUpdateClasses(updated);
    }
    DataService.saveKelas(updated);

    setIsAddClassModalOpen(false);
    showToast(`Kelas "${newClassItem.nama}" berhasil ditambahkan!`);
  };

  const handleOpenEditClass = (c: Kelas) => {
    setEditingClass(c);
    setEditClassNama(c.nama);
    setEditClassWaliNama(c.waliKelasNama);
    setEditClassWaliNip(c.waliKelasNip);
    setEditClassKuota(c.kuota);
  };

  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    const updated = classes.map((c) => {
      if (c.id === editingClass.id) {
        return {
          ...c,
          nama: editClassNama.trim(),
          waliKelasNama: editClassWaliNama.trim() || "-",
          waliKelasNip: editClassWaliNip.trim() || "-",
          kuota: Number(editClassKuota) || 32
        };
      }
      return c;
    });

    if (onUpdateClasses) {
      onUpdateClasses(updated);
    }
    DataService.saveKelas(updated);

    setEditingClass(null);
    showToast(`Data kelas "${editClassNama}" berhasil diperbarui!`);
  };

  // Modal Konfirmasi Hapus State
  const [siswaToDelete, setSiswaToDelete] = useState<Siswa | null>(null);
  const [classToDelete, setClassToDelete] = useState<{ id: string; nama: string; studentCount: number } | null>(null);

  const handleDeleteClass = (classId: string, className: string) => {
    const activeStudentCount = students.filter((s) => s.kelasId === classId && s.statusKeaktifan === "Aktif").length;
    setClassToDelete({ id: classId, nama: className, studentCount: activeStudentCount });
  };

  const confirmDeleteClass = () => {
    if (!classToDelete) return;
    const { id: classId, nama: className } = classToDelete;
    const updated = classes.filter((c) => c.id !== classId);
    if (onUpdateClasses) {
      onUpdateClasses(updated);
    }
    DataService.saveKelas(updated);
    setClassToDelete(null);
    showToast(`Kelas "${className}" telah berhasil dihapus.`);
  };

  // Student Filter & Add & Edit States
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingSiswa, setIsAddingSiswa] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [newSiswa, setNewSiswa] = useState<Siswa>({
    nisn: "",
    nama: "",
    gender: "Laki-laki",
    agama: "Islam",
    statusKeaktifan: "Aktif",
    kelasId: "VII-A"
  });

  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [isEditSiswaModalOpen, setIsEditSiswaModalOpen] = useState(false);

  const handleOpenEditSiswa = (siswa: Siswa) => {
    setEditingSiswa({ ...siswa });
    setIsEditSiswaModalOpen(true);
  };

  const handleSaveEditSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSiswa || !editingSiswa.nisn.trim() || !editingSiswa.nama.trim()) {
      alert("Harap lengkapi NISN dan Nama siswa!");
      return;
    }

    const cleanNisn = editingSiswa.nisn.replace(/[^0-9]/g, "");
    if (!cleanNisn) {
      alert("NISN hanya boleh berisi angka!");
      return;
    }

    const cleanedStudent = { ...editingSiswa, nisn: cleanNisn };

    const updatedStudents = students.map((s) =>
      (s.nisn === editingSiswa.nisn || s.nisn === cleanNisn) ? cleanedStudent : s
    );

    if (onUpdateStudents) {
      onUpdateStudents(updatedStudents);
    }
    DataService.saveSiswa(updatedStudents);

    setIsEditSiswaModalOpen(false);
    setEditingSiswa(null);
    showToast(`Data siswa "${editingSiswa.nama}" (NISN: ${cleanNisn}) berhasil diperbarui!`);
  };

  const handleDeleteSiswa = (siswa: Siswa) => {
    setSiswaToDelete(siswa);
  };

  const confirmDeleteSiswa = () => {
    if (!siswaToDelete) return;
    const targetNisn = (siswaToDelete.nisn || "").trim();
    const targetNama = siswaToDelete.nama;

    const updatedStudents = students.filter((s) => (s.nisn || "").trim() !== targetNisn);
    if (onUpdateStudents) {
      onUpdateStudents(updatedStudents);
    }
    DataService.saveSiswa(updatedStudents);

    setSiswaToDelete(null);
    showToast(`Data siswa "${targetNama}" (NISN: ${targetNisn}) telah berhasil dihapus.`);
  };

  // Upload/Import Student Bulk States & Handlers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<"file" | "paste">("file");
  const [uploadRawText, setUploadRawText] = useState("");
  const [uploadParsedStudents, setUploadParsedStudents] = useState<Siswa[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [defaultImportClass, setDefaultImportClass] = useState<string>("VII-A");

  const parseCsvOrTextData = (text: string, defaultClass: string) => {
    if (!text.trim()) {
      setUploadParsedStudents([]);
      setUploadError(null);
      return;
    }

    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Detect column mapping from header row if present
    let nisnIdx = -1;
    let namaIdx = -1;
    let kelasIdx = -1;
    let genderIdx = -1;
    let agamaIdx = -1;
    let phoneIdx = -1;
    let hasHeader = false;

    // Check first line for header keywords
    const firstLineCols = lines[0].split(/,|\t|;/).map((c) => c.trim().toLowerCase());
    const isHeaderLine = firstLineCols.some((col) =>
      ["nisn", "nama", "kelas", "gender", "jenis kelamin", "agama", "telepon", "nomer", "nomor", "kontak", "hp", "wa", "no"].some((k) => col.includes(k))
    );

    if (isHeaderLine) {
      hasHeader = true;
      firstLineCols.forEach((col, idx) => {
        if (col.includes("nisn")) {
          nisnIdx = idx;
        } else if (col.includes("nama")) {
          namaIdx = idx;
        } else if (col.includes("kelas")) {
          kelasIdx = idx;
        } else if (col.includes("gender") || col.includes("kelamin") || col.includes("jk")) {
          genderIdx = idx;
        } else if (col.includes("agama")) {
          agamaIdx = idx;
        } else if (col.includes("telepon") || col.includes("nomer") || col.includes("nomor") || col.includes("kontak") || col.includes("hp") || col.includes("phone")) {
          if (!col.includes("nisn")) {
            phoneIdx = idx;
          }
        }
      });
    }

    const parsedList: Siswa[] = [];

    lines.forEach((line, index) => {
      // Skip header row
      if (index === 0 && hasHeader) return;

      const cols = line.split(/,|\t|;/).map((c) => c.trim());
      if (cols.length === 0) return;

      // Filter out any row where column values are header terms
      const lineLower = line.toLowerCase();
      if (
        lineLower.includes("nomor telepon") ||
        lineLower.includes("nomer telepon") ||
        lineLower.includes("nomor hp") ||
        lineLower.includes("nama lengkap") ||
        lineLower.includes("jenis kelamin") ||
        lineLower.includes("no. telepon")
      ) {
        return;
      }

      let rawNisn = "";
      let rawNama = "";
      let rawKelas = defaultClass;
      let rawGenderStr = "L";
      let rawAgama = "Islam";
      let rawKontak = "";

      if (hasHeader) {
        if (nisnIdx !== -1 && cols[nisnIdx] !== undefined) {
          rawNisn = cols[nisnIdx];
        }
        if (namaIdx !== -1 && cols[namaIdx] !== undefined) {
          rawNama = cols[namaIdx];
        }
        if (kelasIdx !== -1 && cols[kelasIdx] !== undefined) {
          rawKelas = cols[kelasIdx];
        }
        if (genderIdx !== -1 && cols[genderIdx] !== undefined) {
          rawGenderStr = cols[genderIdx];
        }
        if (agamaIdx !== -1 && cols[agamaIdx] !== undefined) {
          rawAgama = cols[agamaIdx];
        }
        if (phoneIdx !== -1 && cols[phoneIdx] !== undefined) {
          rawKontak = cols[phoneIdx];
        }
      }

      // Fallback if no header mapping or missing values
      if (!rawNisn || !rawNama) {
        // Determine column offset: if cols[0] is 1-3 digits (Row No), NISN is cols[1], Nama is cols[2]
        let offset = 0;
        if (cols[0] && /^\d{1,3}$/.test(cols[0]) && cols[1] && /[a-zA-Z]|\d{5,}/.test(cols[1])) {
          offset = 1;
        }

        // Search for column that actually looks like NISN (digits, not starting with 08 or 628 phone prefix)
        if (!rawNisn) {
          for (let i = offset; i < cols.length; i++) {
            const digits = cols[i].replace(/[^0-9]/g, "");
            if (digits.length >= 8 && digits.length <= 13 && !digits.startsWith("08") && !digits.startsWith("628")) {
              rawNisn = digits;
              break;
            }
          }
          if (!rawNisn && cols[offset]) {
            rawNisn = cols[offset].replace(/[^0-9]/g, "");
          }
        }

        if (!rawNama) {
          for (let i = offset; i < cols.length; i++) {
            const val = cols[i];
            if (val && /[a-zA-Z]{2,}/.test(val) && !val.toLowerCase().includes("telepon") && !val.toLowerCase().includes("nomor") && !val.toLowerCase().includes("nomer")) {
              rawNama = val;
              break;
            }
          }
          if (!rawNama && cols[offset + 1]) {
            rawNama = cols[offset + 1];
          }
        }

        if (!rawKelas && cols[offset + 2]) {
          rawKelas = cols[offset + 2];
        }
      }

      // Final clean up of NISN: keep strictly digits only
      rawNisn = rawNisn.replace(/[^0-9]/g, "");

      // Ensure rawNisn is valid digits only (no text like "nomer telepon")
      if (!rawNisn || rawNisn.length < 5) {
        // Generate valid numeric NISN if missing
        rawNisn = `00${Math.floor(10000000 + Math.random() * 90000000)}`;
      }

      // Check if rawNama is invalid / header text
      if (
        !rawNama ||
        rawNama.toLowerCase().includes("nomer") ||
        rawNama.toLowerCase().includes("nomor") ||
        rawNama.toLowerCase().includes("telepon") ||
        rawNama.toLowerCase().includes("nisn")
      ) {
        return; // Skip invalid row
      }

      // Validate class
      rawKelas = rawKelas.toUpperCase();
      if (!classes.some((c) => c.id === rawKelas) && !rawKelas.startsWith("VII") && !rawKelas.startsWith("VIII") && !rawKelas.startsWith("IX")) {
        rawKelas = defaultClass;
      }

      // Validate Gender
      const upperGender = rawGenderStr.toUpperCase();
      const gender: "Laki-laki" | "Perempuan" =
        upperGender === "P" || upperGender.startsWith("PEREMPUAN") || upperGender === "FEMALE" ? "Perempuan" : "Laki-laki";

      parsedList.push({
        nisn: rawNisn,
        nama: rawNama,
        kelasId: rawKelas,
        gender: gender,
        agama: rawAgama || "Islam",
        kontakOrangTua: rawKontak,
        statusKeaktifan: "Aktif",
      });
    });

    if (parsedList.length === 0) {
      setUploadError("Tidak dapat menemukan data siswa yang valid. Gunakan format: NISN, Nama, Kelas, Gender, Agama, Kontak Orang Tua");
    } else {
      setUploadError(null);
    }
    setUploadParsedStudents(parsedList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert worksheet to CSV string
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          setUploadRawText(csvText);
          parseCsvOrTextData(csvText, defaultImportClass);
        } catch (err) {
          console.error("Gagal membaca file Excel:", err);
          setUploadError("Gagal membaca berkas Excel. Pastikan format file .xlsx atau .xls valid.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setUploadRawText(content);
          parseCsvOrTextData(content, defaultImportClass);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUploadRawText(val);
    parseCsvOrTextData(val, defaultImportClass);
  };

  // 1. Download Template Excel (.xlsx) dengan Sheet Petunjuk & Kelas
  const handleDownloadTemplateXls = () => {
    // Sheet 1: Template Data Siswa
    const templateRows = [
      {
        "NISN": "0098765431",
        "Nama Lengkap": "Ahmad Fauzi",
        "Kelas": "VII-A",
        "Jenis Kelamin": "Laki-laki",
        "Agama": "Islam",
        "Kontak Orang Tua": "081234567890"
      },
      {
        "NISN": "0098765432",
        "Nama Lengkap": "Siti Aminah",
        "Kelas": "VII-A",
        "Jenis Kelamin": "Perempuan",
        "Agama": "Islam",
        "Kontak Orang Tua": "081234567891"
      },
      {
        "NISN": "0098765433",
        "Nama Lengkap": "Rizky Pratama",
        "Kelas": "VII-B",
        "Jenis Kelamin": "Laki-laki",
        "Agama": "Islam",
        "Kontak Orang Tua": "081234567892"
      },
      {
        "NISN": "0098765434",
        "Nama Lengkap": "Dewi Lestari",
        "Kelas": "VII-B",
        "Jenis Kelamin": "Perempuan",
        "Agama": "Islam",
        "Kontak Orang Tua": "081234567893"
      },
      {
        "NISN": "0098765435",
        "Nama Lengkap": "Muhammad Hafizh",
        "Kelas": "VIII-A",
        "Jenis Kelamin": "Laki-laki",
        "Agama": "Islam",
        "Kontak Orang Tua": "081234567894"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    ws["!cols"] = [
      { wch: 15 }, // NISN
      { wch: 28 }, // Nama Lengkap
      { wch: 12 }, // Kelas
      { wch: 16 }, // Jenis Kelamin
      { wch: 12 }, // Agama
      { wch: 20 }  // Kontak Orang Tua
    ];

    // Ensure NISN text type to preserve leading zeros
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:F6");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
      if (ws[cellAddress]) {
        ws[cellAddress].t = "s";
      }
    }

    // Sheet 2: Petunjuk Pengisian
    const petunjukRows = [
      ["PETUNJUK PENGISIAN TEMPLATE DATA SISWA"],
      ["PAILMS - UPT SMP NEGERI 2 REBANG TANGKAS"],
      [],
      ["Nama Kolom", "Status", "Aturan Pengisian", "Contoh Nilai"],
      ["NISN", "Wajib", "10 digit angka unik Nomor Induk Siswa Nasional", "0098765431"],
      ["Nama Lengkap", "Wajib", "Nama lengkap siswa tanpa singkatan gelar", "Ahmad Fauzi"],
      ["Kelas", "Wajib", "ID atau Nama kelas yang terdaftar di sekolah", "VII-A / VII-B / VIII-A / VIII-B"],
      ["Jenis Kelamin", "Wajib", "Ketik 'Laki-laki' atau 'Perempuan'", "Laki-laki"],
      ["Agama", "Wajib", "Agama siswa (Default: Islam)", "Islam"],
      ["Kontak Orang Tua", "Opsional", "Nomor WhatsApp / telepon aktif orang tua", "081234567890"],
      [],
      ["CATATAN PENTING:"],
      ["1. Jangan menghapus baris judul (header) pada baris pertama di sheet 'Template_Data_Siswa'."],
      ["2. Format sel NISN harus berupa Teks (String) agar digit 0 di depan tidak terhapus otomatis."],
      ["3. Berkas ini dapat langsung diunggah melalui tombol 'Upload Data Siswa' pada aplikasi PAILMS."]
    ];
    const wsPetunjuk = XLSX.utils.aoa_to_sheet(petunjukRows);
    wsPetunjuk["!cols"] = [{ wch: 18 }, { wch: 12 }, { wch: 50 }, { wch: 25 }];

    // Sheet 3: Referensi Kelas
    const kelasRows = [
      ["ID Kelas", "Nama Kelas", "Wali Kelas", "NIP Wali Kelas", "Kapasitas Siswa"],
      ...classes.map((c) => [c.id, c.nama || c.id, c.waliKelasNama || "-", c.waliKelasNip || "-", `${c.totalSiswa || 0}/${c.kuota || 32}`])
    ];
    const wsKelas = XLSX.utils.aoa_to_sheet(kelasRows);
    wsKelas["!cols"] = [{ wch: 12 }, { wch: 16 }, { wch: 30 }, { wch: 22 }, { wch: 16 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Data_Siswa");
    XLSX.utils.book_append_sheet(wb, wsPetunjuk, "Petunjuk_Pengisian");
    XLSX.utils.book_append_sheet(wb, wsKelas, "Daftar_Kelas_Tersedia");

    XLSX.writeFile(wb, "Template_Upload_Siswa_PAILMS.xlsx");
    showToast("Template Excel (.xlsx) berhasil diunduh!");
  };

  // 2. Download Template CSV (.csv)
  const handleDownloadTemplateCsv = () => {
    const csvHeader = "NISN,Nama Lengkap,Kelas,Jenis Kelamin,Agama,Kontak Orang Tua\n";
    const sampleRows =
      "0098765431,Ahmad Fauzi,VII-A,Laki-laki,Islam,081234567890\n" +
      "0098765432,Siti Aminah,VII-A,Perempuan,Islam,081234567891\n" +
      "0098765433,Rizky Pratama,VII-B,Laki-laki,Islam,081234567892\n" +
      "0098765434,Dewi Lestari,VII-B,Perempuan,Islam,081234567893\n" +
      "0098765435,Muhammad Hafizh,VIII-A,Laki-laki,Islam,081234567894\n";

    const blob = new Blob(["\uFEFF" + csvHeader + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Upload_Siswa_PAILMS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Template CSV berhasil diunduh!");
  };

  // Backward compatibility
  const handleDownloadTemplate = handleDownloadTemplateXls;

  // 3. Export Data Siswa Aktual ke Excel (.xlsx)
  const handleExportDataSiswaXls = () => {
    const listToExport = filteredStudents;
    if (listToExport.length === 0) {
      alert("Tidak ada data siswa untuk diunduh pada filter saat ini.");
      return;
    }

    const titleFilter = selectedClassFilter === "Semua" ? "SEMUA KELAS" : `KELAS ${selectedClassFilter}`;
    const fileFilter = selectedClassFilter === "Semua" ? "SEMUA_KELAS" : `KELAS_${selectedClassFilter}`;

    const headerInfo = [
      ["DATA MASTER SISWA - SISTEM INFORMASI PENDIDIKAN AGAMA ISLAM & LMS"],
      ["UPT SMP NEGERI 2 REBANG TANGKAS"],
      [`Lingkup Data: ${titleFilter} | Jumlah: ${listToExport.length} Siswa Terdaftar`],
      [`Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`],
      []
    ];

    const tableRows = listToExport.map((s, idx) => ({
      "No": idx + 1,
      "NISN": s.nisn,
      "Nama Lengkap": s.nama,
      "Kelas": s.kelasId,
      "Jenis Kelamin": s.gender,
      "Agama": s.agama || "Islam",
      "Status": s.statusKeaktifan || "Aktif",
      "Kontak Orang Tua": s.kontakOrangTua || "-"
    }));

    const ws = XLSX.utils.aoa_to_sheet(headerInfo);
    XLSX.utils.sheet_add_json(ws, tableRows, { origin: "A6" });

    ws["!cols"] = [
      { wch: 6 },  // No
      { wch: 16 }, // NISN
      { wch: 30 }, // Nama Lengkap
      { wch: 12 }, // Kelas
      { wch: 16 }, // Jenis Kelamin
      { wch: 12 }, // Agama
      { wch: 14 }, // Status
      { wch: 22 }  // Kontak Orang Tua
    ];

    // Format NISN as text
    const range = XLSX.utils.decode_range(ws["!ref"] || "A6:H100");
    for (let R = 5; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: 1 });
      if (ws[cellAddress]) {
        ws[cellAddress].t = "s";
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Siswa");

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `DATA_SISWA_PAILMS_${fileFilter}_${dateStr}.xlsx`);
    showToast(`Berhasil mengunduh ${listToExport.length} data siswa (.xlsx)!`);
  };

  // 4. Export Data Siswa Aktual ke CSV (.csv)
  const handleExportDataSiswaCsv = () => {
    const listToExport = filteredStudents;
    if (listToExport.length === 0) {
      alert("Tidak ada data siswa untuk diunduh pada filter saat ini.");
      return;
    }

    const fileFilter = selectedClassFilter === "Semua" ? "SEMUA_KELAS" : `KELAS_${selectedClassFilter}`;
    const header = "No,NISN,Nama Lengkap,Kelas,Jenis Kelamin,Agama,Status Keaktifan,Kontak Orang Tua\n";
    const rows = listToExport
      .map(
        (s, idx) =>
          `${idx + 1},="${s.nisn}","${s.nama.replace(/"/g, '""')}","${s.kelasId}","${s.gender}","${s.agama || "Islam"}","${s.statusKeaktifan || "Aktif"}","${s.kontakOrangTua || "-"}"`
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `DATA_SISWA_PAILMS_${fileFilter}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Berhasil mengunduh ${listToExport.length} data siswa (.csv)!`);
  };

  const handleConfirmImport = () => {
    if (uploadParsedStudents.length === 0) return;

    const existingNisns = new Set(students.map((s) => s.nisn));
    const newStudentsToImport = uploadParsedStudents.filter((s) => !existingNisns.has(s.nisn));

    if (newStudentsToImport.length === 0) {
      alert("Semua data siswa yang diunggah sudah ada di database (NISN duplikat).");
      return;
    }

    if (onBulkAddStudents) {
      onBulkAddStudents(newStudentsToImport);
    } else {
      newStudentsToImport.forEach((st) => onAddStudent(st));
    }

    setIsUploadModalOpen(false);
    setUploadRawText("");
    setUploadParsedStudents([]);
    showToast(`Berhasil mengimpor ${newStudentsToImport.length} data siswa baru!`);
  };

  // Report Card Simulator States
  const [selectedRaporSiswaNisn, setSelectedRaporSiswaNisn] = useState<string>("");
  const [showRaporPreview, setShowRaporPreview] = useState(false);

  // Filter students based on class & search query
  const filteredStudents = students
    .filter(s => {
      const matchesClass = selectedClassFilter === "Semua" || s.kelasId === selectedClassFilter;
      const matchesSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nisn.includes(searchQuery);
      return matchesClass && matchesSearch;
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

  const handleSaveGuru = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGuru(editedGuru);
    setIsEditingGuru(false);
  };

  const handleAddSiswaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNisn = newSiswa.nisn.replace(/[^0-9]/g, "");
    if (!cleanNisn || !newSiswa.nama.trim()) {
      alert("Harap lengkapi NISN (hanya berupa angka) dan Nama siswa!");
      return;
    }
    onAddStudent({ ...newSiswa, nisn: cleanNisn });
    setIsAddingSiswa(false);
    setNewSiswa({
      nisn: "",
      nama: "",
      gender: "Laki-laki",
      agama: "Islam",
      statusKeaktifan: "Aktif",
      kelasId: "VII-A"
    });
  };

  // Extract selected student data for Rapor
  const activeRaporSiswa = students.find(s => s.nisn === selectedRaporSiswaNisn);
  const activeRaporNilai = rekapNilai.find(r => r.siswaNisn === selectedRaporSiswaNisn);
  const activeRaporSikap = attitudes.filter(a => a.siswaNisn === selectedRaporSiswaNisn);
  const activeRaporIbadah = worships.filter(w => w.siswaNisn === selectedRaporSiswaNisn);

  const handlePrintRapor = () => {
    if (!activeRaporSiswa) {
      window.print();
      return;
    }

    const nilaiAkhir = activeRaporNilai
      ? Math.round((activeRaporNilai.formatifKuis + activeRaporNilai.formatifTugas + activeRaporNilai.sumatifPts + activeRaporNilai.sumatifPas) / 4)
      : 86;

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Rapor PAI - ${activeRaporSiswa.nama} (${activeRaporSiswa.nisn})</title>
        <style>
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 11pt;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #111827;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .header h5 { margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #374151; }
          .header h4 { margin: 2px 0; font-size: 11pt; font-weight: bold; text-transform: uppercase; color: #1f2937; }
          .header h3 { margin: 2px 0; font-size: 13pt; font-weight: 900; text-transform: uppercase; color: #111827; }
          .header p { margin: 2px 0; font-size: 8.5pt; font-style: italic; color: #6b7280; }

          .title { text-align: center; margin-bottom: 14px; }
          .title h4 { margin: 0; font-size: 11pt; font-weight: 800; text-decoration: underline; text-transform: uppercase; }
          .title p { margin: 3px 0 0 0; font-size: 9.5pt; font-weight: 700; color: #4b5563; }

          .bio-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 6px 0; }
          .bio-table td { padding: 4px 6px; font-size: 9.5pt; font-weight: 600; vertical-align: top; }

          .section-title { font-weight: 800; font-size: 10pt; text-transform: uppercase; margin-top: 14px; margin-bottom: 6px; text-decoration: underline; color: #111827; }

          table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          table.data-table th, table.data-table td { border: 1px solid #d1d5db; padding: 6px 8px; font-size: 9.5pt; text-align: left; }
          table.data-table th { background-color: #f3f4f6; font-weight: 700; text-transform: uppercase; text-align: center; color: #1f2937; }

          .box { border: 1px solid #d1d5db; padding: 8px 10px; margin-bottom: 12px; font-size: 9.5pt; border-radius: 6px; background-color: #fafafa; }
          .flex-between { display: flex; justify-content: space-between; margin-bottom: 4px; }

          .signatures { margin-top: 36px; display: table; width: 100%; }
          .sig-col { display: table-cell; width: 50%; text-align: center; font-size: 10pt; vertical-align: top; }
          .sig-space { height: 55px; }
          .sig-name { font-weight: bold; text-decoration: underline; }
          .sig-nip { font-size: 8.5pt; color: #6b7280; }

          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h5>PEMERINTAH KABUPATEN WAY KANAN</h5>
          <h4>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
          <h3>${sekolah.namaSekolah.toUpperCase()}</h3>
          <p>Alamat: ${sekolah.alamat}</p>
        </div>

        <div class="title">
          <h4>LEMBAR HASIL EVALUASI DIGITAL PAI & BUDI PEKERTI</h4>
          <p>TAHUN AJARAN 2026/2027 • SEMESTER GANJIL</p>
          <div style="font-size: 8.5pt; color: #4b5563; margin-top: 3px;">Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        </div>

        <table class="bio-table">
          <tr>
            <td width="15%">Nama Siswa</td>
            <td width="35%">: <strong>${activeRaporSiswa.nama}</strong></td>
            <td width="15%">Wali Kelas</td>
            <td width="35%">: ${guru.nama}</td>
          </tr>
          <tr>
            <td>NISN</td>
            <td>: ${activeRaporSiswa.nisn}</td>
            <td>NIP Wali</td>
            <td>: ${guru.nip}</td>
          </tr>
          <tr>
            <td>Kelas / Fase</td>
            <td>: ${activeRaporSiswa.kelasId} / Fase D</td>
            <td>Status Keaktifan</td>
            <td>: ${activeRaporSiswa.statusKeaktifan}</td>
          </tr>
        </table>

        <div class="section-title">A. Capaian Nilai Akademik PAI</div>
        <table class="data-table">
          <thead>
            <tr>
              <th width="35%">Kompetensi / Komponen</th>
              <th width="15%">Nilai Siswa</th>
              <th width="15%">KKTP</th>
              <th width="35%">Deskripsi Capaian</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1. Formatif (Kuis, Tugas & Diskusi)</td>
              <td style="text-align: center;"><strong>${activeRaporNilai?.formatifKuis || 82}</strong></td>
              <td style="text-align: center;">75</td>
              <td>Sangat baik dalam memahami materi harian, aktif mengumpulkan tugas di LMS.</td>
            </tr>
            <tr>
              <td>2. Sumatif Tengah Semester (PTS)</td>
              <td style="text-align: center;"><strong>${activeRaporNilai?.sumatifPts || 85}</strong></td>
              <td style="text-align: center;">75</td>
              <td>Menunjukkan penguasaan memadai pada kompetensi pertengahan semester.</td>
            </tr>
            <tr>
              <td>3. Sumatif Akhir Semester (PAS)</td>
              <td style="text-align: center;"><strong>${activeRaporNilai?.sumatifPas || 88}</strong></td>
              <td style="text-align: center;">75</td>
              <td>Sangat baik dalam menguraikan soal pemecahan masalah (Problem Solving).</td>
            </tr>
            <tr style="background-color: #ecfdf5; font-weight: bold;">
              <td>NILAI AKADEMIK AKHIR PAI</td>
              <td style="text-align: center; font-size: 11pt; color: #047857;"><strong>${nilaiAkhir}</strong></td>
              <td style="text-align: center; color: #047857;">TUNTAS</td>
              <td style="color: #047857;">Tercapai dengan predikat Sangat Baik. Siswa siap melangkah ke kompetensi berikutnya.</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">B. Progress Hafalan Juz Amma & Praktik Ibadah</div>
        <table class="data-table">
          <tr>
            <th width="50%">Progress Hafalan Surah</th>
            <th width="50%">Hasil Praktik Sholat & Wudhu</th>
          </tr>
          <tr>
            <td style="vertical-align: top;">
              <div class="flex-between"><span>Surah Terakhir:</span> <strong>${activeRaporNilai ? "An-Naba' / An-Nazi'at" : "Ad-Duha"}</strong></div>
              <div class="flex-between"><span>Predikat Kelancaran:</span> <strong>Lancar / Tartil</strong></div>
              <div class="flex-between"><span>Tajwid & Makhraj:</span> <strong>Sangat Baik (${activeRaporNilai?.hafalanJuzAmmaScore || 88}/100)</strong></div>
            </td>
            <td style="vertical-align: top;">
              <div class="flex-between"><span>Praktik Sholat:</span> <strong>${activeRaporNilai?.praktikSholat || 94} / 100 (Sangat Baik)</strong></div>
              <div class="flex-between"><span>Praktik Berwudhu:</span> <strong>${activeRaporNilai?.praktikWudhu || 95} / 100 (Sangat Baik)</strong></div>
              <div class="flex-between"><span>Ibadah Harian Mandiri:</span> <strong>Konsisten & Jujur</strong></div>
            </td>
          </tr>
        </table>

        <div class="section-title">C. Catatan Perkembangan Sikap Spiritual & Sosial</div>
        <div class="box">
          ${
            activeRaporSikap.length === 0
              ? "Siswa menunjukkan integritas perilaku yang stabil, tidak memiliki catatan khusus atau pelanggaran adab."
              : activeRaporSikap.map(att => `• <strong>${att.kategoriSikap} (${att.jenisSikap === "Positif" ? "Sangat Baik" : "Bimbingan"}):</strong> ${att.deskripsiKejadian} (Tindak lanjut: ${att.tindakLanjut})`).join('<br/>')
          }
        </div>

        <div class="signatures">
          <div class="sig-col">
            <p>Mengetahui,<br/>Kepala ${sekolah.namaSekolah}</p>
            <div class="sig-space"></div>
            <p class="sig-name">${sekolah.namaKepsek}</p>
            <p class="sig-nip">NIP. ${sekolah.nipKepsek}</p>
          </div>
          <div class="sig-col">
            <p>Way Kanan, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Wali Kelas ${activeRaporSiswa.kelasId}</p>
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

  // Wali Kelas specific data
  const waliKelasSiswa = students
    .filter(s => s.kelasId === guru.waliKelasDi)
    .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation - Hijau Muda Bergaris Biru */}
      <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => { setSubTab("guru"); setShowRaporPreview(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "guru"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="btn-subtab-guru"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "guru" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <User className={`w-4 h-4 ${subTab === "guru" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Data Guru & Sekolah</span>
        </button>

        <button
          onClick={() => { setSubTab("kelas"); setShowRaporPreview(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "kelas"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="btn-subtab-kelas"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "kelas" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <School className={`w-4 h-4 ${subTab === "kelas" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Data Kelas</span>
        </button>

        <button
          onClick={() => { setSubTab("siswa"); setShowRaporPreview(false); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "siswa"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="btn-subtab-siswa"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "siswa" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <Users className={`w-4 h-4 ${subTab === "siswa" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Data Siswa</span>
        </button>

        <button
          onClick={() => { setSubTab("wali"); setSelectedRaporSiswaNisn(waliKelasSiswa[0]?.nisn || ""); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            subTab === "wali"
              ? "bg-emerald-100 text-blue-950 border-2 border-blue-600 shadow-md shadow-blue-600/15 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-emerald-50/80 hover:bg-emerald-100 text-slate-800 hover:text-blue-950 border-2 border-blue-400/80 hover:border-blue-600 shadow-xs"
          }`}
          id="btn-subtab-wali"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${subTab === "wali" ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse" : "bg-blue-400"}`}></span>
          <Award className={`w-4 h-4 ${subTab === "wali" ? "text-blue-700" : "text-blue-600"}`} />
          <span>Menu Guru Wali ({guru.waliKelasDi})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: DATA GURU & DATA SEKOLAH */}
      {subTab === "guru" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1: DATA GURU PAI */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Data Guru PAI</h4>
                  <p className="text-xs text-slate-500">Profil & Kredensial Pendidik</p>
                </div>
              </div>
              {!isEditingGuru && (
                <button
                  onClick={() => { setIsEditingGuru(true); setEditedGuru({ ...guru }); }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-emerald-800 text-xs font-bold rounded-lg border border-slate-200 transition"
                  id="btn-edit-guru"
                >
                  Ubah Profil
                </button>
              )}
            </div>

            {isEditingGuru ? (
              <form onSubmit={handleSaveGuru} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    value={editedGuru.nama}
                    onChange={(e) => setEditedGuru({ ...editedGuru, nama: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    NIP Guru
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editedGuru.nip}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Sertifikasi
                    </label>
                    <input
                      type="text"
                      value={editedGuru.sertifikasi}
                      onChange={(e) => setEditedGuru({ ...editedGuru, sertifikasi: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Kontak / No HP
                    </label>
                    <input
                      type="text"
                      value={editedGuru.kontak}
                      onChange={(e) => setEditedGuru({ ...editedGuru, kontak: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingGuru(false)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition"
                    id="btn-save-guru"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{guru.nama}</h5>
                    <span className="inline-block text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded mt-0.5">
                      NIP. {guru.nip}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                  <div className="p-3 flex justify-between items-center bg-white">
                    <span className="text-slate-400 font-medium">Sertifikasi</span>
                    <span className="text-slate-800 font-bold text-right max-w-[220px]">{guru.sertifikasi}</span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-white">
                    <span className="text-slate-400 font-medium">No. Handphone</span>
                    <span className="text-slate-800 font-bold font-mono">{guru.kontak}</span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-white">
                    <span className="text-slate-400 font-medium">Tugas Tambahan</span>
                    <span className="text-slate-800 font-bold">{guru.isWaliKelas ? `Wali Kelas ${guru.waliKelasDi}` : "-"}</span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-white">
                    <span className="text-slate-400 font-medium">Satuan Pendidikan</span>
                    <span className="text-slate-800 font-bold">{sekolah.namaSekolah}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50 text-xs text-emerald-800 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold mb-0.5">Sertifikasi & Kredensial Pendidik</span>
                    Otoritas penuh untuk mengarsip perangkat ajar PAI dan pengesahan evaluasi rapor peserta didik.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CARD 2: DATA SEKOLAH */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Data Sekolah</h4>
                  <p className="text-xs text-slate-500">Identitas Lembaga & Kepala Sekolah</p>
                </div>
              </div>
              {!isEditingSekolah && (
                <button
                  onClick={() => { setIsEditingSekolah(true); setEditedSekolah({ ...sekolah }); }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-blue-800 text-xs font-bold rounded-lg border border-slate-200 transition"
                  id="btn-edit-sekolah"
                >
                  Ubah Data Sekolah
                </button>
              )}
            </div>

            {isEditingSekolah ? (
              <form onSubmit={handleSaveSekolah} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={editedSekolah.namaSekolah}
                    onChange={(e) => setEditedSekolah({ ...editedSekolah, namaSekolah: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      NPSN
                    </label>
                    <input
                      type="text"
                      value={editedSekolah.npsn}
                      onChange={(e) => setEditedSekolah({ ...editedSekolah, npsn: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Akreditasi
                    </label>
                    <input
                      type="text"
                      value={editedSekolah.akreditasi}
                      onChange={(e) => setEditedSekolah({ ...editedSekolah, akreditasi: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={editedSekolah.alamat}
                    onChange={(e) => setEditedSekolah({ ...editedSekolah, alamat: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Nama Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      value={editedSekolah.namaKepsek}
                      onChange={(e) => setEditedSekolah({ ...editedSekolah, namaKepsek: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      NIP Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      value={editedSekolah.nipKepsek}
                      onChange={(e) => setEditedSekolah({ ...editedSekolah, nipKepsek: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSekolah(false)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition"
                    id="btn-save-sekolah"
                  >
                    Simpan Data Sekolah
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                    <School className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{sekolah.namaSekolah}</h5>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-block text-[11px] font-mono font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                        NPSN: {sekolah.npsn}
                      </span>
                      <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Akreditasi: {sekolah.akreditasi}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                  <div className="p-3 bg-white">
                    <span className="block text-slate-400 font-medium mb-0.5">Alamat Lengkap</span>
                    <span className="text-slate-800 font-semibold">{sekolah.alamat}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Nama Kepala Sekolah</span>
                    <span className="text-slate-800 font-bold">{sekolah.namaKepsek}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center">
                    <span className="text-slate-400 font-medium">NIP Kepala Sekolah</span>
                    <span className="text-slate-800 font-bold font-mono">{sekolah.nipKepsek}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DATA KELAS */}
      {subTab === "kelas" && (
        <div className="space-y-6">
          {/* Header & Stats Banner */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-emerald-700" />
                  Daftar Kelas & Guru Wali
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengelolaan rombongan belajar, penetapan Wali Kelas, dan kapasitas daya tampung peserta didik.
                </p>
              </div>

              <button
                onClick={handleOpenAddClass}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                id="btn-tambah-kelas"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>
            </div>

            {/* Quick Stats overview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Total Rombel</span>
                  <span className="text-xl font-black text-slate-800">{classes.length} Kelas</span>
                </div>
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <School className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Total Siswa Terdaftar</span>
                  <span className="text-xl font-black text-slate-800">
                    {students.filter(s => s.statusKeaktifan === "Aktif").length} Siswa
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Total Kapasitas Kuota</span>
                  <span className="text-xl font-black text-slate-800">
                    {classes.reduce((sum, c) => sum + (c.kuota || 32), 0)} Kursi
                  </span>
                </div>
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Class Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {classes.map((c) => {
              const activeCount = students.filter(s => s.kelasId === c.id && s.statusKeaktifan === "Aktif").length;
              const kuota = c.kuota || 32;
              const fillPercent = Math.min(100, Math.round((activeCount / kuota) * 100));

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden relative group"
                >
                  <div className="p-5 space-y-4">
                    {/* Card Header: Badge & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-200/50">
                          {c.id}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">
                          {c.nama}
                        </h5>
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditClass(c)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit Data Kelas"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(c.id, c.nama)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Wali Kelas Details */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Wali Kelas:
                      </span>
                      <span className="block font-bold text-slate-800 truncate" title={c.waliKelasNama}>
                        {c.waliKelasNama || "-"}
                      </span>
                      {c.waliKelasNip && c.waliKelasNip !== "-" && (
                        <span className="block text-[10px] text-slate-500 font-mono">
                          NIP. {c.waliKelasNip}
                        </span>
                      )}
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium text-[11px]">Kapasitas Siswa:</span>
                        <span className="font-extrabold text-slate-800">
                          {activeCount} / {kuota} ({fillPercent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            fillPercent >= 100 ? "bg-rose-500" : fillPercent >= 80 ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Buttons */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenEditClass(c)}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-lg font-bold transition text-center flex items-center justify-center gap-1 mr-1.5"
                    >
                      <Edit className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Edit Kelas</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClass(c.id, c.nama)}
                      className="py-1.5 px-2.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg font-bold transition text-center flex items-center justify-center"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DATA SISWA */}
      {subTab === "siswa" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Database Siswa PAILMS</h4>
              <p className="text-xs text-slate-400">Total terdaftar {students.length} siswa di database.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama / NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-600 focus:outline-none w-44"
                />
              </div>

              {/* Class Filter */}
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none font-medium"
              >
                <option value="Semua">Semua Kelas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.nama}
                  </option>
                ))}
              </select>

              {/* Unduh Data Siswa Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportDropdown(!showExportDropdown);
                    setShowTemplateDropdown(false);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  title="Unduh Data Siswa Terdaftar (Excel / CSV)"
                  id="btn-unduh-data-siswa"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Unduh Data Siswa</span>
                  <ChevronDown className="w-3 h-3 text-emerald-600" />
                </button>

                {showExportDropdown && (
                  <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fadeIn text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Unduh Data Siswa ({filteredStudents.length} Siswa)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportDataSiswaXls();
                        setShowExportDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-2 transition cursor-pointer"
                      id="btn-export-siswa-xlsx"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="block leading-tight text-emerald-950">Unduh Format Excel (.xlsx)</span>
                        <span className="text-[10px] text-slate-500 font-normal">Kop sekolah, kolom rapi & teks NISN</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportDataSiswaCsv();
                        setShowExportDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-2 transition cursor-pointer border-t border-slate-100"
                      id="btn-export-siswa-csv"
                    >
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="block leading-tight text-slate-900">Unduh Format CSV (.csv)</span>
                        <span className="text-[10px] text-slate-500 font-normal">Berkas data teks koma standar</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Template XLS / CSV Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateDropdown(!showTemplateDropdown);
                    setShowExportDropdown(false);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  title="Unduh Template Format Upload Siswa"
                  id="btn-template-siswa"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Template XLS</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showTemplateDropdown && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fadeIn text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Pilihan Template Impor Siswa
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadTemplateXls();
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-2 transition cursor-pointer"
                      id="btn-download-template-xls"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="block leading-tight text-emerald-950 font-extrabold">Template Excel (.xlsx)</span>
                        <span className="text-[10px] text-emerald-700 font-medium">Ada lembar petunjuk & referensi kelas</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadTemplateCsv();
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-2 transition cursor-pointer border-t border-slate-100"
                      id="btn-download-template-csv"
                    >
                      <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                      <div>
                        <span className="block leading-tight text-slate-900">Template Format CSV (.csv)</span>
                        <span className="text-[10px] text-slate-500 font-normal">Format teks sederhana</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Click-outside backdrop for dropdowns */}
              {(showExportDropdown || showTemplateDropdown) && (
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => {
                    setShowExportDropdown(false);
                    setShowTemplateDropdown(false);
                  }}
                />
              )}

              {/* Upload Students Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
                id="btn-upload-siswa"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Data Siswa</span>
              </button>

              {/* Add Single Student Button */}
              <button
                onClick={() => setIsAddingSiswa(!isAddingSiswa)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition"
                id="btn-tambah-siswa"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Siswa Baru</span>
              </button>
            </div>
          </div>

          {/* New Student Form Modal simulation */}
          {isAddingSiswa && (
            <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-4 animate-fadeIn">
              <span className="block text-sm font-bold text-slate-800">Input Data Siswa Baru</span>
              <form onSubmit={handleAddSiswaSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">NISN (10 digit)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    placeholder="Contoh: 0098761234"
                    value={newSiswa.nisn}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nisn: e.target.value.replace(/[^0-9]/g, "") })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Siswa"
                    value={newSiswa.nama}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nama: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Kelas</label>
                  <select
                    value={newSiswa.kelasId}
                    onChange={(e) => setNewSiswa({ ...newSiswa, kelasId: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Jenis Kelamin</label>
                  <select
                    value={newSiswa.gender}
                    onChange={(e) => setNewSiswa({ ...newSiswa, gender: e.target.value as "Laki-laki" | "Perempuan" })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Agama</label>
                  <input
                    type="text"
                    required
                    value={newSiswa.agama}
                    onChange={(e) => setNewSiswa({ ...newSiswa, agama: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                    id="btn-submit-tambah-siswa"
                  >
                    Simpan Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSiswa(false)}
                    className="py-2 px-3 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 w-12 text-center font-bold text-slate-500">No.</th>
                  <th className="p-4">NISN</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Kelas</th>
                  <th className="p-4">Jenis Kelamin</th>
                  <th className="p-4">Agama</th>
                  <th className="p-4">Keaktifan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                      Tidak menemukan siswa dengan filter ini.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.nisn} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">{s.nisn}</td>
                      <td className="p-4 text-sm font-semibold text-slate-900">{s.nama}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                          {s.kelasId}
                        </span>
                      </td>
                      <td className="p-4">{s.gender}</td>
                      <td className="p-4">{s.agama}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.statusKeaktifan === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.statusKeaktifan === "Aktif" ? "bg-emerald-600" : "bg-red-500"}`}></span>
                          {s.statusKeaktifan}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditSiswa(s)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded-lg border border-amber-200 transition flex items-center gap-1"
                            title="Edit Data Siswa"
                            id={`btn-edit-siswa-${s.nisn}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSiswa(s)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-lg border border-red-200 transition flex items-center gap-1"
                            title="Hapus Data Siswa"
                            id={`btn-delete-siswa-${s.nisn}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                          <button
                            onClick={() => onToggleStudentStatus(s.nisn)}
                            className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                              s.statusKeaktifan === "Aktif"
                                ? "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                                : "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                            title="Ubah Status Keaktifan"
                          >
                            {s.statusKeaktifan === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: MENU GURU WALI */}
      {subTab === "wali" && (
        <div className="space-y-6">
          {/* Wali Kelas banner and general stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-600" />
                    Bilik Wali Kelas VII-A
                  </h4>
                  <p className="text-xs text-slate-500">Otoritas administrasi wali kelas, pengawasan sosial, dan cetak lembar Rapor PAI siswa.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    Siswa Binaan: {waliKelasSiswa.length} Orang
                  </span>
                </div>
              </div>

              {/* Attendance and Social overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Ringkasan Kehadiran Kelas (Juli)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-slate-800">95.4%</span>
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +1.2% bulan lalu
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: "95.4%" }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>95% Hadir</span>
                    <span>3% Izin</span>
                    <span>2% Sakit / Alpa</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Indikator Sosial Kelas VII-A
                  </span>
                  <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Smile className="w-4 h-4 text-emerald-600" /> Kerjasama Diskusi
                      </span>
                      <span className="text-emerald-800 font-bold">Sangat Baik</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Heart className="w-4 h-4 text-rose-500" /> Ketertiban Ibadah
                      </span>
                      <span className="text-emerald-800 font-bold">92% Tertib</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print selection widget */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  Cetak Rapor Digital PAI
                </h4>
                <p className="text-xs text-slate-400">
                  Pilih siswa binaan kelas VII-A untuk merangkum seluruh perolehan nilai, progres hafalan, dan absensi ibadah ke format Rapor resmi.
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    Pilih Siswa VII-A:
                  </label>
                  <select
                    value={selectedRaporSiswaNisn}
                    onChange={(e) => {
                      setSelectedRaporSiswaNisn(e.target.value);
                      setShowRaporPreview(false);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none"
                    id="select-rapor-siswa"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {waliKelasSiswa.map((s) => (
                      <option key={s.nisn} value={s.nisn}>
                        {s.nama} ({s.nisn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowRaporPreview(true)}
                  disabled={!selectedRaporSiswaNisn}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-emerald-700/10"
                  id="btn-preview-rapor"
                >
                  <FileText className="w-4 h-4" />
                  Tinjau & Cetak Rapor
                </button>
              </div>
            </div>
          </div>

          {/* RAPOR DIGITAL PREVIEW PANEL SIMULATOR */}
          {showRaporPreview && activeRaporSiswa && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-8 relative overflow-hidden animate-fadeIn space-y-6 max-w-4xl mx-auto" id="rapor-sheet">
              {/* Report Card Header */}
              <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
                <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                  PEMERINTAH KABUPATEN WAY KANAN
                </h5>
                <h4 className="text-base font-extrabold text-slate-900 uppercase">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h4>
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  UPT SMP NEGERI 2 REBANG TANGKAS
                </h3>
                <p className="text-[10px] text-slate-500 italic">
                  Alamat: Jl. Lintas Rebang Tangkas, Way Kanan, Kode Pos 34791
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center space-y-0.5">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider underline">
                  LEMBAR HASIL EVALUASI DIGITAL PAI & BUDI PEKERTI
                </h4>
                <p className="text-xs text-slate-600 font-semibold">
                  TAHUN AJARAN 2026/2027 • SEMESTER GANJIL
                </p>
              </div>

              {/* Student Bio info */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-800 font-bold border-y border-slate-200 py-3">
                <div className="space-y-1">
                  <div className="flex"><span className="w-24 text-slate-400 font-medium">Nama Siswa</span><span>: {activeRaporSiswa.nama}</span></div>
                  <div className="flex"><span className="w-24 text-slate-400 font-medium">NISN</span><span>: {activeRaporSiswa.nisn}</span></div>
                  <div className="flex"><span className="w-24 text-slate-400 font-medium">Kelas / Fase</span><span>: {activeRaporSiswa.kelasId} / Fase D</span></div>
                </div>
                <div className="space-y-1 text-right sm:text-left sm:pl-12">
                  <div className="flex justify-end sm:justify-start"><span className="w-28 text-slate-400 font-medium">Wali Kelas</span><span>: {guru.nama}</span></div>
                  <div className="flex justify-end sm:justify-start"><span className="w-28 text-slate-400 font-medium">NIP Wali</span><span>: {guru.nip}</span></div>
                  <div className="flex justify-end sm:justify-start"><span className="w-28 text-slate-400 font-medium">Keaktifan</span><span>: {activeRaporSiswa.statusKeaktifan}</span></div>
                </div>
              </div>

              {/* Grades Table */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider underline">
                  A. Capaian Nilai & Akademik PAI
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3 border-r border-slate-200">Komponen Penilaian</th>
                        <th className="p-3 text-center border-r border-slate-200">Nilai Perolehan</th>
                        <th className="p-3 text-center border-r border-slate-200">KKTP</th>
                        <th className="p-3">Deskripsi Pencapaian Kompetensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200 text-slate-900">1. Formatif (Kuis & Tugas)</td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold text-slate-950">
                          {activeRaporNilai ? Math.round((activeRaporNilai.formatifKuis + activeRaporNilai.formatifTugas) / 2) : 85}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 font-semibold text-slate-400">75</td>
                        <td className="p-3 text-slate-600">Sangat baik dalam memahami materi harian, aktif mengumpulkan tugas di LMS.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200 text-slate-900">2. Sumatif Tengah Semester (PTS)</td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold text-slate-950">
                          {activeRaporNilai?.sumatifPts || 85}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 font-semibold text-slate-400">75</td>
                        <td className="p-3 text-slate-600">Menunjukkan penguasaan memadai pada kompetensi pertengahan semester.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200 text-slate-900">3. Sumatif Akhir Semester (PAS)</td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold text-slate-950">
                          {activeRaporNilai?.sumatifPas || 88}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 font-semibold text-slate-400">75</td>
                        <td className="p-3 text-slate-600">Sangat baik dalam menguraikan soal pemecahan masalah (Problem Solving).</td>
                      </tr>
                      <tr className="bg-emerald-50/20">
                        <td className="p-3 font-bold border-r border-slate-200 text-emerald-950">NILAI AKADEMIK AKHIR PAI</td>
                        <td className="p-3 text-center border-r border-slate-200 font-extrabold text-emerald-900 bg-emerald-50 text-sm">
                          {activeRaporNilai ? Math.round((activeRaporNilai.formatifKuis + activeRaporNilai.formatifTugas + activeRaporNilai.sumatifPts + activeRaporNilai.sumatifPas) / 4) : 86}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold text-emerald-800">TUNTAS</td>
                        <td className="p-3 text-emerald-800 font-semibold text-xs">
                          Tercapai dengan predikat Sangat Baik. Siswa siap melangkah ke kompetensi berikutnya.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Special PAI Metrics (Hafalan & Ibadah) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider underline">
                    B. Progress Hafalan Juz Amma
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-semibold text-slate-800">
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Surah Terakhir</span><span>{activeRaporNilai ? "An-Naba' / An-Nazi'at" : "Ad-Duha"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Predikat Kelancaran</span><span className="text-emerald-700">Lancar / Tartil</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Tajwid & Makhraj</span><span className="text-emerald-700">Sangat Baik</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider underline">
                    C. Hasil Praktik Ibadah & Jurnal Mandiri
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-semibold text-slate-800">
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Praktik Sholat</span><span>{activeRaporNilai?.praktikSholat || 94} / 100 (Sangat Baik)</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Praktik Berwudhu</span><span>{activeRaporNilai?.praktikWudhu || 95} / 100 (Sangat Baik)</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Ibadah Harian Mandiri</span><span className="text-emerald-700">Konsisten & Jujur</span></div>
                  </div>
                </div>
              </div>

              {/* Attitude evaluation summary */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider underline">
                  D. Catatan Saku Perkembangan Sikap Spiritual & Sosial
                </span>
                <div className="p-4 bg-amber-50/30 rounded-lg border border-amber-100/60 text-xs space-y-2 leading-relaxed">
                  {activeRaporSikap.length === 0 ? (
                    <p className="text-slate-500 font-medium italic">Siswa menunjukkan integritas perilaku yang stabil, tidak memiliki catatan khusus atau pelanggaran adab.</p>
                  ) : (
                    activeRaporSikap.map((att, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-extrabold text-amber-800 shrink-0">•</span>
                        <div>
                          <strong>{att.kategoriSikap} ({att.jenisSikap === "Positif" ? "Sangat Baik" : "Bimbingan"}):</strong> {att.deskripsiKejadian} <span className="text-slate-500">Tindak lanjut: {att.tindakLanjut}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 text-center text-xs font-bold text-slate-900">
                <div>
                  <p className="mb-16">Mengetahui,<br />Kepala UPT SMPN 2 Rebang Tangkas</p>
                  <p className="underline">Drs. H. Mulyadi, M.M.</p>
                  <p className="text-[10px] text-slate-400 font-medium">NIP. 197003181995031002</p>
                </div>
                <div>
                  <p className="mb-16">Way Kanan, 13 Juli 2026<br />Guru Wali Kelas VII-A</p>
                  <p className="underline">{guru.nama}</p>
                  <p className="text-[10px] text-slate-400 font-medium">NIP. {guru.nip}</p>
                </div>
              </div>

              {/* Print action toolbar inside preview */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3" id="rapor-toolbar">
                <button
                  onClick={() => setShowRaporPreview(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  Tutup Tinjauan
                </button>
                <button
                  onClick={handlePrintRapor}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Lembar Rapor
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: TAMBAH KELAS BARU */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tambah Kelas Baru
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Masukkan data rombongan belajar baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClass} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Kelas (ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={addClassId}
                    onChange={(e) => setAddClassId(e.target.value)}
                    placeholder="Contoh: VII-C"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kuota Siswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={addClassKuota}
                    onChange={(e) => setAddClassKuota(parseInt(e.target.value) || 32)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  required
                  value={addClassNama}
                  onChange={(e) => setAddClassNama(e.target.value)}
                  placeholder="Contoh: Kelas VII-C"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Wali Kelas
                </label>
                <input
                  type="text"
                  value={addClassWaliNama}
                  onChange={(e) => setAddClassWaliNama(e.target.value)}
                  placeholder="Contoh: Dra. Nurhayati, M.Pd."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIP Wali Kelas
                </label>
                <input
                  type="text"
                  value={addClassWaliNip}
                  onChange={(e) => setAddClassWaliNip(e.target.value)}
                  placeholder="Contoh: 198505142014022002"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KELAS */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Data Kelas {editingClass.id}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Perbarui nama, wali kelas, dan kuota kelas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Kelas (ID)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingClass.id}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold uppercase text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kuota Siswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={editClassKuota}
                    onChange={(e) => setEditClassKuota(parseInt(e.target.value) || 32)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  required
                  value={editClassNama}
                  onChange={(e) => setEditClassNama(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Wali Kelas
                </label>
                <input
                  type="text"
                  value={editClassWaliNama}
                  onChange={(e) => setEditClassWaliNama(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIP Wali Kelas
                </label>
                <input
                  type="text"
                  value={editClassWaliNip}
                  onChange={(e) => setEditClassWaliNip(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD / IMPORT DATA SISWA BULK */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-left border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload & Import Data Siswa Bulk
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Unggah berkas CSV/Excel atau tempel data teks untuk impor masal
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadRawText("");
                  setUploadParsedStudents([]);
                  setUploadError(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Action options & info banner */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="block font-bold text-emerald-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Format Berkas Yang Didukung (.xlsx, .xls, .csv)
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Format kolom yang dibaca: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">NISN, Nama Lengkap, Kelas, Gender, Agama, Kontak</code>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadTemplateXls}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm shrink-0 flex items-center gap-1.5 transition cursor-pointer text-xs"
                    title="Unduh Template Lengkap Format Excel (.xlsx)"
                    id="btn-modal-unduh-template-xls"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                    <span>Template XLS</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTemplateCsv}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-lg shadow-sm shrink-0 flex items-center gap-1 transition cursor-pointer text-xs"
                    title="Unduh Format Ringan CSV (.csv)"
                    id="btn-modal-unduh-template-csv"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Template CSV</span>
                  </button>
                </div>
              </div>

              {/* Upload Method Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setUploadTab("file")}
                  className={`py-2 px-4 font-bold border-b-2 transition flex items-center gap-1.5 ${
                    uploadTab === "file"
                      ? "border-emerald-700 text-emerald-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileUp className="w-4 h-4" />
                  <span>Pilih Berkas CSV / Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("paste")}
                  className={`py-2 px-4 font-bold border-b-2 transition flex items-center gap-1.5 ${
                    uploadTab === "paste"
                      ? "border-emerald-700 text-emerald-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tempel Data Teks / Excel</span>
                </button>
              </div>

              {/* Default Class Selector for imported records */}
              <div className="flex items-center gap-2">
                <label className="font-bold text-slate-700">Kelas Default (jika tidak dicantumkan):</label>
                <select
                  value={defaultImportClass}
                  onChange={(e) => {
                    setDefaultImportClass(e.target.value);
                    if (uploadRawText) {
                      parseCsvOrTextData(uploadRawText, e.target.value);
                    }
                  }}
                  className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab 1: File Input */}
              {uploadTab === "file" && (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 transition">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">
                      Pilih atau tarik berkas data Excel (.xlsx / .xls) atau CSV / TXT
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mendukung format Microsoft Excel, Google Sheets CSV, dan berkas teks berpemisah tab/koma
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 file:cursor-pointer cursor-pointer"
                  />
                </div>
              )}

              {/* Tab 2: Paste Area */}
              {uploadTab === "paste" && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Tempelkan Baris Data (Salin dari Excel / Google Sheets):
                  </label>
                  <textarea
                    rows={5}
                    value={uploadRawText}
                    onChange={handlePasteChange}
                    placeholder={`0098765431\tAhmad Fauzi\tVII-A\tLaki-laki\tIslam\n0098765432\tSiti Aminah\tVII-A\tPerempuan\tIslam`}
                    className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  ></textarea>
                </div>
              )}

              {/* Error Warning */}
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Parsed Preview Table */}
              {uploadParsedStudents.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Pratinjau Hasil Pembacaan ({uploadParsedStudents.length} Siswa Terdeteksi)
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                        <tr>
                          <th className="p-2.5">No</th>
                          <th className="p-2.5">NISN</th>
                          <th className="p-2.5">Nama Lengkap</th>
                          <th className="p-2.5">Kelas</th>
                          <th className="p-2.5">Gender</th>
                          <th className="p-2.5">Agama</th>
                          <th className="p-2.5">Status Impor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {uploadParsedStudents.map((st, idx) => {
                          const isDuplicate = students.some((s) => s.nisn === st.nisn);
                          return (
                            <tr key={idx} className={isDuplicate ? "bg-amber-50/60" : "hover:bg-slate-50"}>
                              <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                              <td className="p-2.5 font-mono font-bold text-slate-800">{st.nisn}</td>
                              <td className="p-2.5 font-bold text-slate-900">{st.nama}</td>
                              <td className="p-2.5">
                                <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                                  {st.kelasId}
                                </span>
                              </td>
                              <td className="p-2.5">{st.gender}</td>
                              <td className="p-2.5">{st.agama}</td>
                              <td className="p-2.5">
                                {isDuplicate ? (
                                  <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                                    Sudah Ada (Akan Diabaikan)
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                                    Siap Impor
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-slate-400 text-[11px] font-medium">
                {uploadParsedStudents.length > 0
                  ? `Siap memasukkan ${uploadParsedStudents.filter((st) => !students.some((s) => s.nisn === st.nisn)).length} data baru.`
                  : "Silakan pilih berkas atau tempel data terlebih dahulu."}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadRawText("");
                    setUploadParsedStudents([]);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={uploadParsedStudents.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Proses Import ({uploadParsedStudents.filter((st) => !students.some((s) => s.nisn === st.nisn)).length} Siswa)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA SISWA */}
      {isEditSiswaModalOpen && editingSiswa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ubah / Edit Data Siswa</h3>
                  <p className="text-[11px] text-slate-500 font-mono">NISN: {editingSiswa.nisn}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditSiswaModalOpen(false);
                  setEditingSiswa(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSiswa} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                  NISN (Nomor Induk Siswa Nasional)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={editingSiswa.nisn}
                  onChange={(e) => setEditingSiswa({ ...editingSiswa, nisn: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={editingSiswa.nama}
                  onChange={(e) => setEditingSiswa({ ...editingSiswa, nama: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Kelas
                  </label>
                  <select
                    value={editingSiswa.kelasId}
                    onChange={(e) => setEditingSiswa({ ...editingSiswa, kelasId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={editingSiswa.gender}
                    onChange={(e) => setEditingSiswa({ ...editingSiswa, gender: e.target.value as "Laki-laki" | "Perempuan" })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Agama
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSiswa.agama}
                    onChange={(e) => setEditingSiswa({ ...editingSiswa, agama: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Status Keaktifan
                  </label>
                  <select
                    value={editingSiswa.statusKeaktifan}
                    onChange={(e) => setEditingSiswa({ ...editingSiswa, statusKeaktifan: e.target.value as "Aktif" | "Tidak Aktif" })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                  Kontak Orang Tua / Wali (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Nomor HP/WA Orang Tua"
                  value={editingSiswa.kontakOrangTua || ""}
                  onChange={(e) => setEditingSiswa({ ...editingSiswa, kontakOrangTua: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSiswaModalOpen(false);
                    setEditingSiswa(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center gap-1.5"
                  id="btn-save-edit-siswa"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS DATA SISWA */}
      {siswaToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Hapus Data Siswa?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data siswa ini dari database? Tindakan ini akan menghapus siswa dari daftar kelas.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 text-right">{siswaToDelete.nama}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">NISN:</span>
                <span className="font-mono font-bold text-emerald-800">{siswaToDelete.nisn}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Kelas:</span>
                <span className="font-bold text-slate-800">{siswaToDelete.kelasId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status Keaktifan:</span>
                <span className={`font-bold ${siswaToDelete.statusKeaktifan === "Aktif" ? "text-emerald-700" : "text-slate-500"}`}>
                  {siswaToDelete.statusKeaktifan}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSiswaToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                id="btn-batal-hapus-siswa"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteSiswa}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-1.5 cursor-pointer"
                id="btn-konfirmasi-hapus-siswa"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS DATA KELAS */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Hapus Data Kelas?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah Anda yakin ingin menghapus kelas <span className="font-bold text-slate-900">"{classToDelete.nama}"</span>?
                </p>
              </div>
            </div>

            {classToDelete.studentCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Peringatan:</strong> Terdapat {classToDelete.studentCount} siswa aktif di kelas ini.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                id="btn-batal-hapus-kelas"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteClass}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-1.5 cursor-pointer"
                id="btn-konfirmasi-hapus-kelas"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Kelas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION FLOATING BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
