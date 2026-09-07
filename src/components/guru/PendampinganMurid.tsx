/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  FileText,
  UserCheck,
  Edit,
  Save,
  X,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Plus,
  Trash2,
  BookOpen,
  MessageSquare,
  Layers,
  ListFilter,
  LayoutGrid,
  Camera,
  Image,
  Upload,
  Eye
} from "lucide-react";
import { Siswa, Guru, Kelas, RekapPertemuanMurid, FotoKegiatan } from "../../types";
import { DataService } from "../../data/initialData";

interface PendampinganMuridProps {
  guru: Guru;
  students: Siswa[];
  classes: Kelas[];
  onUpdateStudents?: (updatedStudents: Siswa[]) => void;
}

export default function PendampinganMurid({
  guru,
  students,
  classes,
  onUpdateStudents
}: PendampinganMuridProps) {
  // Class selection default to Guru's Wali class if assigned, or "ALL"
  const defaultSelectedClass = guru.isWaliKelas && guru.waliKelasDi ? guru.waliKelasDi : "ALL";
  const [selectedClassId, setSelectedClassId] = useState<string>(defaultSelectedClass);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "L" | "P">("ALL");

  // Layout mode state: "grid" (3-column side-by-side) or "stacked"
  const [viewLayout, setViewLayout] = useState<"grid" | "stacked">("grid");
  // Active section tab: "ALL" (side-by-side 3 sections), "PENDAMPINGAN", "REKAP", "FOTO"
  const [activeSectionTab, setActiveSectionTab] = useState<"ALL" | "PENDAMPINGAN" | "REKAP" | "FOTO">("ALL");

  // Data State for Rekap Pertemuan Dengan Murid
  const [pertemuanList, setPertemuanList] = useState<RekapPertemuanMurid[]>(() => {
    return DataService.getPertemuanMurid();
  });

  // Editing state for updating student contact & notes (Table 1)
  const [editingStudent, setEditingStudent] = useState<Siswa | null>(null);
  const [editKontak, setEditKontak] = useState<string>("");
  const [editCatatan, setEditCatatan] = useState<string>("");

  // Modal state for Adding New Student (Table 1)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [addNisn, setAddNisn] = useState<string>("");
  const [addNama, setAddNama] = useState<string>("");
  const [addGender, setAddGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [addAgama, setAddAgama] = useState<string>("Islam");
  const [addStatus, setAddStatus] = useState<"Aktif" | "Tidak Aktif">("Aktif");
  const [addKelasId, setAddKelasId] = useState<string>("");
  const [addKontak, setAddKontak] = useState<string>("");
  const [addCatatan, setAddCatatan] = useState<string>("");

  // Modal state for Adding/Editing Pertemuan Murid (Table 2)
  const [isPertemuanModalOpen, setIsPertemuanModalOpen] = useState<boolean>(false);
  const [editingPertemuan, setEditingPertemuan] = useState<RekapPertemuanMurid | null>(null);

  // Form states for Pertemuan Murid
  const [formHariTanggal, setFormHariTanggal] = useState<string>("");
  const [formPertemuanKe, setFormPertemuanKe] = useState<string>("Pertemuan 1");
  const [formSiswaNisn, setFormSiswaNisn] = useState<string>("");
  const [formTopikMasalah, setFormTopikMasalah] = useState<string>("");
  const [formTindakLanjut, setFormTindakLanjut] = useState<string>("");
  const [formKeterangan, setFormKeterangan] = useState<string>("Selesai");

  const [showToast, setShowToast] = useState<string | null>(null);

  // Foto Kegiatan State & Initial Data
  const INITIAL_FOTO_KEGIATAN: FotoKegiatan[] = [
    {
      id: "foto_1",
      judul: "Pembiasaan Sholat Dhuha Berjamaah & Tadarus Al-Qur'an",
      tanggal: "2026-07-20",
      kelasId: guru.waliKelasDi || "4A",
      kategori: "Kegiatan Pembiasaan",
      deskripsi: "Siswa binaan kelas melaksanakan sholat dhuha berjamaah dan tadarus Surat Yasin dibimbing langsung oleh Guru Wali.",
      fotoUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "foto_2",
      judul: "Kunjungan Rumah (Home Visit) & Silaturahmi Wali Murid",
      tanggal: "2026-07-25",
      kelasId: guru.waliKelasDi || "4A",
      kategori: "Home Visit",
      deskripsi: "Guru Wali melakukan kunjungan rumah ke kediaman ananda Muhammad Farhan untuk bimbingan konseling dan sinergi belajar di rumah.",
      fotoUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "foto_3",
      judul: "Rapat Parenting Wali Murid & Pembentukan Pengurus Kelas",
      tanggal: "2026-07-28",
      kelasId: guru.waliKelasDi || "4A",
      kategori: "Pertemuan Orang Tua",
      deskripsi: "Pertemuan berkala orang tua murid binaan kelas untuk sosialisasi program sekolah dan evaluasi kedisiplinan siswa.",
      fotoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [fotoKegiatanList, setFotoKegiatanList] = useState<FotoKegiatan[]>(() => {
    const saved = localStorage.getItem("guru_foto_kegiatan_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FOTO_KEGIATAN;
  });

  const updateFotoKegiatanList = (newList: FotoKegiatan[]) => {
    setFotoKegiatanList(newList);
    localStorage.setItem("guru_foto_kegiatan_list", JSON.stringify(newList));
  };

  // State Modal Tambah/Edit Foto Kegiatan
  const [isFotoModalOpen, setIsFotoModalOpen] = useState<boolean>(false);
  const [editingFoto, setEditingFoto] = useState<FotoKegiatan | null>(null);

  const [fotoJudul, setFotoJudul] = useState<string>("");
  const [fotoTanggal, setFotoTanggal] = useState<string>("");
  const [fotoKelasId, setFotoKelasId] = useState<string>("");
  const [fotoKategori, setFotoKategori] = useState<string>("Kegiatan Pembiasaan");
  const [fotoDeskripsi, setFotoDeskripsi] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>("");

  // Preview / Zoom Modal State
  const [previewFoto, setPreviewFoto] = useState<FotoKegiatan | null>(null);

  // Print Modal & Document Type State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printDocType, setPrintDocType] = useState<"ALL" | "PENDAMPINGAN" | "REKAP" | "FOTO">("ALL");

  const handleOpenPrint = (type: "ALL" | "PENDAMPINGAN" | "REKAP" | "FOTO" = "ALL") => {
    setPrintDocType(type);
    setIsPrintModalOpen(true);
  };

  // Handlers for Foto Kegiatan
  const handleOpenNewFoto = () => {
    setEditingFoto(null);
    setFotoJudul("");
    setFotoTanggal(new Date().toISOString().split("T")[0]);
    setFotoKelasId(selectedClassId !== "ALL" ? selectedClassId : (guru.waliKelasDi || "4A"));
    setFotoKategori("Kegiatan Pembiasaan");
    setFotoDeskripsi("");
    setFotoUrl("https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80");
    setIsFotoModalOpen(true);
  };

  const handleOpenEditFoto = (f: FotoKegiatan) => {
    setEditingFoto(f);
    setFotoJudul(f.judul);
    setFotoTanggal(f.tanggal);
    setFotoKelasId(f.kelasId);
    setFotoKategori(f.kategori);
    setFotoDeskripsi(f.deskripsi);
    setFotoUrl(f.fotoUrl);
    setIsFotoModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file foto maksimal 5 MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoJudul.trim()) {
      alert("Silakan masukkan judul kegiatan!");
      return;
    }
    if (!fotoUrl) {
      alert("Silakan unggah atau pilih foto kegiatan!");
      return;
    }

    if (editingFoto) {
      const updated = fotoKegiatanList.map((item) => {
        if (item.id === editingFoto.id) {
          return {
            ...item,
            judul: fotoJudul.trim(),
            tanggal: fotoTanggal,
            kelasId: fotoKelasId,
            kategori: fotoKategori,
            deskripsi: fotoDeskripsi.trim(),
            fotoUrl: fotoUrl
          };
        }
        return item;
      });
      updateFotoKegiatanList(updated);
      setShowToast(`Foto kegiatan "${fotoJudul.trim()}" berhasil diperbarui.`);
    } else {
      const newFoto: FotoKegiatan = {
        id: "foto_" + Date.now(),
        judul: fotoJudul.trim(),
        tanggal: fotoTanggal || new Date().toISOString().split("T")[0],
        kelasId: fotoKelasId || "4A",
        kategori: fotoKategori,
        deskripsi: fotoDeskripsi.trim(),
        fotoUrl: fotoUrl
      };
      const updated = [newFoto, ...fotoKegiatanList];
      updateFotoKegiatanList(updated);
      setShowToast(`Foto kegiatan "${newFoto.judul}" berhasil ditambahkan.`);
    }

    setTimeout(() => setShowToast(null), 4000);
    setIsFotoModalOpen(false);
  };

  const handleDeleteFoto = (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus foto kegiatan "${judul}"?`)) {
      const updated = fotoKegiatanList.filter((item) => item.id !== id);
      updateFotoKegiatanList(updated);
      setShowToast(`Foto kegiatan "${judul}" berhasil dihapus.`);
      setTimeout(() => setShowToast(null), 4000);
    }
  };

  // Filter students based on Class, Search, and Gender
  const filteredStudents = students
    .filter((s) => {
      if (selectedClassId !== "ALL" && s.kelasId !== selectedClassId) return false;
      if (genderFilter === "L" && s.gender !== "Laki-laki") return false;
      if (genderFilter === "P" && s.gender !== "Perempuan") return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchNisn = s.nisn.toLowerCase().includes(q);
        const matchNama = s.nama.toLowerCase().includes(q);
        const matchCatatan = (s.catatanKhusus || "").toLowerCase().includes(q);
        const matchKontak = (s.kontakOrangTua || "").toLowerCase().includes(q);
        return matchNisn || matchNama || matchCatatan || matchKontak;
      }
      return true;
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

  // Filter pertemuan based on Class and Search
  const filteredPertemuan = pertemuanList.filter((p) => {
    if (selectedClassId !== "ALL" && p.kelasId !== selectedClassId) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNama = p.siswaNama.toLowerCase().includes(q);
      const matchTopik = p.topikMasalah.toLowerCase().includes(q);
      const matchTindak = p.tindakLanjut.toLowerCase().includes(q);
      const matchKet = p.keterangan.toLowerCase().includes(q);
      const matchHari = p.hariTanggal.toLowerCase().includes(q);
      return matchNama || matchTopik || matchTindak || matchKet || matchHari;
    }
    return true;
  });

  // Filter foto kegiatan based on Class and Search
  const filteredFotoList = fotoKegiatanList.filter((f) => {
    if (selectedClassId !== "ALL" && f.kelasId !== selectedClassId) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchJudul = f.judul.toLowerCase().includes(q);
      const matchDesc = f.deskripsi.toLowerCase().includes(q);
      const matchKat = f.kategori.toLowerCase().includes(q);
      return matchJudul || matchDesc || matchKat;
    }
    return true;
  });

  // Calculate statistics
  const targetClassStudents = selectedClassId === "ALL"
    ? students
    : students.filter((s) => s.kelasId === selectedClassId);

  const totalMurid = targetClassStudents.length;
  const countLaki = targetClassStudents.filter((s) => s.gender === "Laki-laki").length;
  const countPerempuan = targetClassStudents.filter((s) => s.gender === "Perempuan").length;
  const countCatatanKhusus = targetClassStudents.filter(
    (s) => s.catatanKhusus && s.catatanKhusus.trim().length > 0
  ).length;

  // Handle Edit Student Contact & Notes (Table 1)
  const handleOpenEditStudent = (siswa: Siswa) => {
    setEditingStudent(siswa);
    setEditKontak(siswa.kontakOrangTua || "");
    setEditCatatan(siswa.catatanKhusus || "");
  };

  const handleOpenAddStudent = () => {
    setAddNisn(`009${Math.floor(1000000 + Math.random() * 9000000)}`);
    setAddNama("");
    setAddGender("Laki-laki");
    setAddAgama("Islam");
    setAddStatus("Aktif");
    setAddKelasId(selectedClassId !== "ALL" ? selectedClassId : (classes[0]?.id || "VII-A"));
    setAddKontak("");
    setAddCatatan("");
    setIsAddStudentModalOpen(true);
  };

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNisn.trim() || !addNama.trim()) return;

    if (students.some((s) => s.nisn === addNisn.trim())) {
      alert("NISN ini sudah terdaftar. Silakan gunakan NISN lain.");
      return;
    }

    const newStudent: Siswa = {
      nisn: addNisn.trim(),
      nama: addNama.trim(),
      gender: addGender,
      agama: addAgama,
      statusKeaktifan: addStatus,
      kelasId: addKelasId,
      kontakOrangTua: addKontak.trim(),
      catatanKhusus: addCatatan.trim()
    };

    const updated = [newStudent, ...students];
    if (onUpdateStudents) {
      onUpdateStudents(updated);
    }
    DataService.saveSiswa(updated);

    setShowToast(`Data murid "${newStudent.nama}" (Kelas ${newStudent.kelasId}) berhasil ditambahkan.`);
    setTimeout(() => setShowToast(null), 4000);
    setIsAddStudentModalOpen(false);
  };

  const [studentToDelete, setStudentToDelete] = useState<{ nisn: string; nama: string } | null>(null);

  const handleDeleteStudent = (nisn: string, nama: string) => {
    setStudentToDelete({ nisn, nama });
  };

  const confirmDeleteStudent = () => {
    if (!studentToDelete) return;
    const { nisn, nama } = studentToDelete;
    const updated = students.filter((s) => (s.nisn || "").trim() !== nisn.trim());
    if (onUpdateStudents) {
      onUpdateStudents(updated);
    }
    DataService.saveSiswa(updated);
    setShowToast(`Data murid "${nama}" berhasil dihapus.`);
    setTimeout(() => setShowToast(null), 4000);
    setStudentToDelete(null);
  };

  const handleSaveStudentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = students.map((s) => {
      if (s.nisn === editingStudent.nisn) {
        return {
          ...s,
          kontakOrangTua: editKontak.trim(),
          catatanKhusus: editCatatan.trim()
        };
      }
      return s;
    });

    if (onUpdateStudents) {
      onUpdateStudents(updated);
    }
    DataService.saveSiswa(updated);

    setShowToast(`Catatan pendampingan murid "${editingStudent.nama}" berhasil diperbarui.`);
    setTimeout(() => setShowToast(null), 4000);
    setEditingStudent(null);
  };

  // Handle Open Modal for New Pertemuan (Table 2)
  const handleOpenNewPertemuan = () => {
    setEditingPertemuan(null);
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    setFormHariTanggal(todayStr);
    setFormPertemuanKe("Pertemuan 1");
    setFormSiswaNisn(filteredStudents[0]?.nisn || students[0]?.nisn || "");
    setFormTopikMasalah("");
    setFormTindakLanjut("");
    setFormKeterangan("Selesai (Progres Baik)");
    setIsPertemuanModalOpen(true);
  };

  // Handle Open Modal for Edit Pertemuan
  const handleOpenEditPertemuan = (p: RekapPertemuanMurid) => {
    setEditingPertemuan(p);
    setFormHariTanggal(p.hariTanggal);
    setFormPertemuanKe(p.pertemuanKe);
    setFormSiswaNisn(p.siswaNisn);
    setFormTopikMasalah(p.topikMasalah);
    setFormTindakLanjut(p.tindakLanjut);
    setFormKeterangan(p.keterangan);
    setIsPertemuanModalOpen(true);
  };

  // Save Pertemuan Record
  const handleSavePertemuan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSiswaNisn) return;

    const targetSiswa = students.find((s) => s.nisn === formSiswaNisn);
    const targetNama = targetSiswa ? targetSiswa.nama : "Siswa";
    const targetKelas = targetSiswa ? targetSiswa.kelasId : (selectedClassId !== "ALL" ? selectedClassId : "VII-A");

    let updatedList: RekapPertemuanMurid[];

    if (editingPertemuan) {
      updatedList = pertemuanList.map((item) => {
        if (item.id === editingPertemuan.id) {
          return {
            ...item,
            hariTanggal: formHariTanggal.trim(),
            pertemuanKe: formPertemuanKe.trim(),
            siswaNisn: formSiswaNisn,
            siswaNama: targetNama,
            kelasId: targetKelas,
            topikMasalah: formTopikMasalah.trim(),
            tindakLanjut: formTindakLanjut.trim(),
            keterangan: formKeterangan.trim()
          };
        }
        return item;
      });
      setShowToast(`Rekap pertemuan dengan ${targetNama} berhasil diperbarui.`);
    } else {
      const newItem: RekapPertemuanMurid = {
        id: `pm-${Date.now()}`,
        hariTanggal: formHariTanggal.trim() || "Senin, 02 Feb 2026",
        pertemuanKe: formPertemuanKe.trim() || "Pertemuan 1",
        siswaNisn: formSiswaNisn,
        siswaNama: targetNama,
        kelasId: targetKelas,
        topikMasalah: formTopikMasalah.trim(),
        tindakLanjut: formTindakLanjut.trim(),
        keterangan: formKeterangan.trim() || "Selesai"
      };
      updatedList = [newItem, ...pertemuanList];
      setShowToast(`Rekap pertemuan baru bersama ${targetNama} berhasil ditambahkan.`);
    }

    setPertemuanList(updatedList);
    DataService.savePertemuanMurid(updatedList);
    setTimeout(() => setShowToast(null), 4000);
    setIsPertemuanModalOpen(false);
  };

  // Delete Pertemuan Record
  const handleDeletePertemuan = (id: string, nama: string) => {
    if (confirm(`Hapus catatan rekap pertemuan dengan ${nama}?`)) {
      const updated = pertemuanList.filter((p) => p.id !== id);
      setPertemuanList(updated);
      DataService.savePertemuanMurid(updated);
      setShowToast(`Rekap pertemuan dengan ${nama} berhasil dihapus.`);
      setTimeout(() => setShowToast(null), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {showToast && (
        <div className="p-4 bg-emerald-800 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-fadeIn border border-emerald-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{showToast}</span>
          </div>
          <button onClick={() => setShowToast(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 opacity-10">
          <UserCheck className="w-72 h-72 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-black border border-amber-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Menu Guru Wali Kelas
            </span>
            {guru.isWaliKelas && (
              <span className="bg-white/10 text-emerald-100 text-[10px] px-2.5 py-1 rounded-full font-bold">
                Wali Kelas: {guru.waliKelasDi}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Guru Wali – Pendampingan & Rekap Pertemuan Murid
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Pusat pemantauan peserta didik bagi Guru Wali Kelas. Mengelola kontak orangtua, catatan khusus perkembangan murid, serta rekap catatan pertemuan berkala secara lengkap.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Murid</span>
            <span className="block text-xl font-extrabold text-slate-900">{totalMurid}</span>
            <span className="text-[10px] text-slate-500 font-medium">Siswa Terdaftar</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <span className="font-black text-sm">L</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Laki-Laki (L)</span>
            <span className="block text-xl font-extrabold text-slate-900">{countLaki}</span>
            <span className="text-[10px] text-slate-500 font-medium">Murid Putra</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
            <span className="font-black text-sm">P</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perempuan (P)</span>
            <span className="block text-xl font-extrabold text-slate-900">{countPerempuan}</span>
            <span className="text-[10px] text-slate-500 font-medium">Murid Putri</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rekap Pertemuan</span>
            <span className="block text-xl font-extrabold text-slate-900">{filteredPertemuan.length}</span>
            <span className="text-[10px] text-amber-700 font-semibold">Sesi Catatan</span>
          </div>
        </div>
      </div>

      {/* SEKSI PILIHAN NAVIGASI TAB BERDAMPINGAN BERBARIS DI ATAS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Main Top Nav Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSectionTab("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeSectionTab === "ALL"
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Tampilkan semua 3 modul berdampingan dalam grid"
            >
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>3 Kolom Berdampingan</span>
            </button>

            <button
              onClick={() => setActiveSectionTab("PENDAMPINGAN")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeSectionTab === "PENDAMPINGAN"
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Tabel Pendampingan Murid</span>
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  activeSectionTab === "PENDAMPINGAN"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {filteredStudents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSectionTab("REKAP")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeSectionTab === "REKAP"
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>2. Rekap Pertemuan Murid</span>
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  activeSectionTab === "REKAP"
                    ? "bg-white/20 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {filteredPertemuan.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSectionTab("FOTO")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeSectionTab === "FOTO"
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>3. Foto Kegiatan Wali Kelas</span>
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  activeSectionTab === "FOTO"
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {filteredFotoList.length}
              </span>
            </button>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAddStudent}
              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
              title="Tambah Data Murid Baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Murid</span>
            </button>
            <button
              onClick={handleOpenNewPertemuan}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
              title="Tambah Rekap Sesi Pertemuan"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Sesi Pertemuan</span>
            </button>
            <button
              onClick={handleOpenNewFoto}
              className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
              title="Upload Foto Kegiatan Baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Foto Kegiatan</span>
            </button>
            <button
              onClick={() => handleOpenPrint("ALL")}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center gap-1"
              title="Cetak Laporan Lengkap"
            >
              <Printer className="w-3.5 h-3.5 text-slate-800" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Class Selector, Search, Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Pilih Kelas</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama} {guru.waliKelasDi === c.id ? "(Kelas Binaan)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Filter Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua (L & P)</option>
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          {activeSectionTab === "ALL" && (
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Format Tata Letak</label>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewLayout("grid")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    viewLayout === "grid"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="3 Kolom Berdampingan"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>3 Kolom Berdampingan</span>
                </button>
                <button
                  onClick={() => setViewLayout("stacked")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    viewLayout === "stacked"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Bertumpuk Kebawah"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Bertumpuk</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Nama, NISN, Topik, atau Catatan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SEKSI UTAMA MODUL GURU WALI (3 KOLOM BERDAMPINGAN ATAU SINGLE TAB) */}
      <div
        className={
          activeSectionTab === "ALL"
            ? viewLayout === "grid"
              ? "grid grid-cols-1 lg:grid-cols-3 gap-5 items-start"
              : "space-y-6"
            : "space-y-6"
        }
      >
        {/* ==================== TABEL 1: PENDAMPINGAN MURID ==================== */}
        {(activeSectionTab === "ALL" || activeSectionTab === "PENDAMPINGAN") && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  1. Tabel Pendampingan Murid {selectedClassId !== "ALL" ? `— Kelas ${selectedClassId}` : ""}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {filteredStudents.length} Murid
                </span>
                <button
                  onClick={handleOpenAddStudent}
                  className="p-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[10px] font-bold flex items-center gap-1 px-2 print:hidden transition"
                  title="Tambah Data Murid"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
                <button
                  onClick={() => handleOpenPrint("PENDAMPINGAN")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition flex items-center gap-1 border border-slate-300 print:hidden"
                  title="Cetak Tabel Pendampingan Murid"
                >
                  <Printer className="w-3 h-3 text-emerald-700" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                  <tr className="text-slate-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 text-center w-10 border-r border-slate-200">No</th>
                    <th className="py-3 px-3 border-r border-slate-200 w-28">NISN</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[130px]">Nama Murid</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-12">L/P</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-16">Kelas</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[130px]">Kontak Orangtua</th>
                    <th className="py-3 px-3 min-w-[160px]">Catatan Khusus (Jika Ada)</th>
                    <th className="py-3 px-2 text-center w-20 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((siswa, index) => {
                      const isGenderL = siswa.gender === "Laki-laki";
                      const hasNote = siswa.catatanKhusus && siswa.catatanKhusus.trim().length > 0;
                      const hasContact = siswa.kontakOrangTua && siswa.kontakOrangTua.trim().length > 0;

                      return (
                        <tr
                          key={siswa.nisn}
                          className="hover:bg-emerald-50/40 transition-colors"
                        >
                          {/* 1. No */}
                          <td className="py-3 px-2.5 text-center font-bold text-slate-500 border-r border-slate-100">
                            {index + 1}
                          </td>

                          {/* 2. NISN */}
                          <td className="py-3 px-3 font-mono font-semibold text-slate-700 border-r border-slate-100 text-[11px]">
                            {siswa.nisn}
                          </td>

                          {/* 3. Nama Murid */}
                          <td className="py-3 px-3 border-r border-slate-100 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{siswa.nama}</span>
                              {siswa.statusKeaktifan === "Aktif" ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Aktif" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Tidak Aktif" />
                              )}
                            </div>
                          </td>

                          {/* 4. L/P */}
                          <td className="py-3 px-2 text-center border-r border-slate-100">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                                isGenderL
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-pink-100 text-pink-800 border border-pink-200"
                              }`}
                            >
                              {isGenderL ? "L" : "P"}
                            </span>
                          </td>

                          {/* 5. Kelas */}
                          <td className="py-3 px-2 text-center font-bold text-slate-800 border-r border-slate-100">
                            <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px]">
                              {siswa.kelasId}
                            </span>
                          </td>

                          {/* 6. Kontak Orangtua */}
                          <td className="py-3 px-3 border-r border-slate-100">
                            {hasContact ? (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                <a
                                  href={`https://wa.me/${(siswa.kontakOrangTua || "").replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-semibold text-emerald-700 hover:underline text-[11px]"
                                  title="Hubungi via WhatsApp"
                                >
                                  {siswa.kontakOrangTua}
                                </a>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Belum diisi</span>
                            )}
                          </td>

                          {/* 7. Catatan Khusus (Jika Ada) */}
                          <td className="py-3 px-3">
                            {hasNote ? (
                              <div className="p-1.5 bg-amber-50 border border-amber-200/80 rounded-md text-[11px] text-amber-950 leading-tight">
                                {siswa.catatanKhusus}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">-</span>
                            )}
                          </td>

                          {/* Aksi */}
                          <td className="py-3 px-2 text-center print:hidden">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEditStudent(siswa)}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                                title="Edit Kontak & Catatan"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(siswa.nisn, siswa.nama)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Hapus Murid"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        Tidak ada data murid.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TABEL 2: REKAP PERTEMUAN DENGAN MURID ==================== */}
        {(activeSectionTab === "ALL" || activeSectionTab === "REKAP") && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  2. REKAP PERTEMUAN DENGAN MURID
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {filteredPertemuan.length} Sesi
                </span>
                <button
                  onClick={handleOpenNewPertemuan}
                  className="p-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[10px] font-bold flex items-center gap-1 px-2 print:hidden"
                  title="Tambah Sesi Pertemuan"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
                <button
                  onClick={() => handleOpenPrint("REKAP")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition flex items-center gap-1 border border-slate-300 print:hidden"
                  title="Cetak Rekap Pertemuan Dengan Murid"
                >
                  <Printer className="w-3 h-3 text-emerald-700" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                  <tr className="text-slate-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-2 text-center w-8 border-r border-slate-200">No</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[100px]">Hari/Tanggal</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 min-w-[80px]">Pertemuan</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[120px]">Nama Murid</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[150px]">Topik / Masalah</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[140px]">Tindak Lanjut</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[90px]">Ket</th>
                    <th className="py-3 px-2 text-center w-16 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
                  {filteredPertemuan.length > 0 ? (
                    filteredPertemuan.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-amber-50/40 transition-colors"
                      >
                        {/* 1. No */}
                        <td className="py-3 px-2 text-center font-bold text-slate-500 border-r border-slate-100">
                          {idx + 1}
                        </td>

                        {/* 2. Hari/Tanggal */}
                        <td className="py-3 px-3 border-r border-slate-100 font-semibold text-slate-700 text-[11px]">
                          {item.hariTanggal}
                        </td>

                        {/* 3. Pertemuan */}
                        <td className="py-3 px-2 text-center border-r border-slate-100">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-extrabold">
                            {item.pertemuanKe}
                          </span>
                        </td>

                        {/* 4. Nama Murid */}
                        <td className="py-3 px-3 border-r border-slate-100 font-bold text-slate-900">
                          <div>
                            <div>{item.siswaNama}</div>
                            <span className="text-[10px] font-medium text-slate-400">
                              Kelas {item.kelasId}
                            </span>
                          </div>
                        </td>

                        {/* 5. Topik atau Masalah yang Dibahas */}
                        <td className="py-3 px-3 border-r border-slate-100 leading-relaxed text-[11px] text-slate-800">
                          {item.topikMasalah}
                        </td>

                        {/* 6. Tindak Lanjut */}
                        <td className="py-3 px-3 border-r border-slate-100 leading-relaxed text-[11px] text-slate-700">
                          {item.tindakLanjut}
                        </td>

                        {/* 7. Ket (Keterangan) */}
                        <td className="py-3 px-3 border-r border-slate-100">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200 text-[10px] font-semibold">
                            {item.keterangan}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-2 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditPertemuan(item)}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                              title="Edit Rekap Pertemuan"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePertemuan(item.id, item.siswaNama)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              title="Hapus Sesi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        Belum ada catatan rekap pertemuan murid. Klik tombol <strong>+ Tambah Pertemuan</strong> untuk membuat catatan baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== SEKSI 3: DOKUMENTASI FOTO KEGIATAN GURU WALI ==================== */}
        {(activeSectionTab === "ALL" || activeSectionTab === "FOTO") && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full space-y-0">
            {/* Header Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-700" />
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>3. DOKUMENTASI FOTO KEGIATAN WALI KELAS</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {filteredFotoList.length} Foto
                </span>
                <button
                  onClick={handleOpenNewFoto}
                  className="px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold rounded-md shadow-sm transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  onClick={() => handleOpenPrint("FOTO")}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md border border-slate-300 transition flex items-center gap-1"
                  title="Cetak Laporan Foto Kegiatan"
                >
                  <Printer className="w-3 h-3 text-blue-700" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            {/* Photos Grid Container */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[580px]">
              {filteredFotoList.length > 0 ? (
                <div className={activeSectionTab === "ALL" && viewLayout === "grid" ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
                  {filteredFotoList.map((foto) => (
                    <div
                      key={foto.id}
                      className="bg-slate-50/80 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                    >
                      {/* Photo Container with Hover Overlay */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={foto.fotoUrl}
                          alt={foto.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md border border-white/20">
                            Kelas {foto.kelasId}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[10px] font-extrabold rounded-md shadow">
                            {foto.kategori}
                          </span>
                        </div>

                        {/* Date Badge Bottom Left */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold text-slate-200 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{foto.tanggal}</span>
                        </div>

                        {/* Action Overlay Buttons */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                          <button
                            onClick={() => setPreviewFoto(foto)}
                            className="p-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg shadow text-xs transition"
                            title="Lihat Foto Ukuran Penuh"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditFoto(foto)}
                            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow text-xs transition"
                            title="Edit / Upload Ulang"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFoto(foto.id, foto.judul)}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow text-xs transition"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Text Details Body */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-left">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                            {foto.judul}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                            {foto.deskripsi || "Tidak ada deskripsi tambahan."}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => handleOpenEditFoto(foto)}
                            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload / Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFoto(foto.id, foto.judul)}
                            className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Belum Ada Foto Kegiatan Wali Kelas</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                      Klik <strong>"Upload"</strong> untuk menambahkan foto dokumentasi kegiatan wali kelas.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenNewFoto}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 0: TAMBAH MURID BARU (TABEL 1) */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tambah Murid Baru
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Masukkan data peserta didik ke daftar pendampingan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NISN Murid
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={addNisn}
                    onChange={(e) => setAddNisn(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 0098765432"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={addKelasId}
                    onChange={(e) => setAddKelasId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama} {guru.waliKelasDi === c.id ? "(Wali Kelas)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Murid
                </label>
                <input
                  type="text"
                  required
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={addGender}
                    onChange={(e) => setAddGender(e.target.value as "Laki-laki" | "Perempuan")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  >
                    <option value="Laki-laki">Laki-laki (L)</option>
                    <option value="Perempuan">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Keaktifan
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as "Aktif" | "Tidak Aktif")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kontak Orangtua / Wali (HP / WhatsApp)</span>
                </label>
                <input
                  type="text"
                  value={addKontak}
                  onChange={(e) => setAddKontak(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Catatan Khusus (Jika Ada)</span>
                </label>
                <textarea
                  rows={3}
                  value={addCatatan}
                  onChange={(e) => setAddCatatan(e.target.value)}
                  placeholder="Masukkan catatan khusus perkembangan siswa, hafalan, atau kondisi khusus..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Murid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT CONTACT & NOTES FOR STUDENT (TABLE 1) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Data Pendampingan Murid
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {editingStudent.nama} ({editingStudent.nisn}) — Kelas {editingStudent.kelasId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kontak Orangtua / Wali (HP / WhatsApp)</span>
                </label>
                <input
                  type="text"
                  value={editKontak}
                  onChange={(e) => setEditKontak(e.target.value)}
                  placeholder="Contoh: 0812-7890-1122"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Catatan Khusus Pendampingan (Jika Ada)</span>
                </label>
                <textarea
                  rows={4}
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  placeholder="Masukkan catatan khusus perkembangan siswa, prestasi, kendala kesehatan, hafalan Al-Qur'an, atau pesan dari orangtua..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT REKAP PERTEMUAN DENGAN MURID (TABLE 2) */}
      {isPertemuanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingPertemuan ? "Edit Rekap Pertemuan" : "Tambah Rekap Pertemuan Dengan Murid"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Formulir jurnal pendampingan konseling dan pertemuan personal siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPertemuanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePertemuan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hari / Tanggal
                  </label>
                  <input
                    type="text"
                    required
                    value={formHariTanggal}
                    onChange={(e) => setFormHariTanggal(e.target.value)}
                    placeholder="Contoh: Senin, 02 Feb 2026"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pertemuan Ke-
                  </label>
                  <input
                    type="text"
                    required
                    value={formPertemuanKe}
                    onChange={(e) => setFormPertemuanKe(e.target.value)}
                    placeholder="Contoh: Pertemuan 1, Ke-2, dst"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Nama Murid
                </label>
                <select
                  value={formSiswaNisn}
                  onChange={(e) => setFormSiswaNisn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                >
                  {students.map((s) => (
                    <option key={s.nisn} value={s.nisn}>
                      {s.nama} ({s.nisn}) — Kelas {s.kelasId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Topik atau Masalah yang Dibahas
                </label>
                <textarea
                  rows={3}
                  required
                  value={formTopikMasalah}
                  onChange={(e) => setFormTopikMasalah(e.target.value)}
                  placeholder="Masukkan pembahasan pertemuan (e.g., hafalan Al-Qur'an, kedisiplinan, motivasi belajar, konsultasi pribadi)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tindak Lanjut
                </label>
                <textarea
                  rows={2}
                  required
                  value={formTindakLanjut}
                  onChange={(e) => setFormTindakLanjut(e.target.value)}
                  placeholder="Langkah tindak lanjut guru / orangtua (e.g., komunikasi ortu, jadwal simakan hafalan, pemantauan kelas)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan (Ket)
                </label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Contoh: Selesai, Dalam Progres, Perlu Dipantau, Tindak Lanjut Ortud"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPertemuanModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Rekap</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH / INPUT / UPLOAD FOTO KEGIATAN */}
      {isFotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingFoto ? "Edit / Upload Ulang Foto Kegiatan" : "Tambah Dokumentasi Foto Kegiatan Wali Kelas"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload foto kegiatan, deskripsi, dan kategori dokumentasi kelas binaan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFotoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFoto} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fotoJudul}
                  onChange={(e) => setFotoJudul(e.target.value)}
                  placeholder="Contoh: Pembiasaan Sholat Dhuha / Home Visit Ananda Farhan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    required
                    value={fotoTanggal}
                    onChange={(e) => setFotoTanggal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kelas Binaan
                  </label>
                  <select
                    value={fotoKelasId}
                    onChange={(e) => setFotoKelasId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama} {guru.waliKelasDi === c.id ? "(Wali Kelas)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={fotoKategori}
                    onChange={(e) => setFotoKategori(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                  >
                    <option value="Kegiatan Pembiasaan">Kegiatan Pembiasaan</option>
                    <option value="Home Visit">Home Visit / Kunjungan Rumah</option>
                    <option value="Bimbingan Siswa">Bimbingan Siswa</option>
                    <option value="Pertemuan Orang Tua">Pertemuan Orang Tua</option>
                    <option value="Kegiatan Kelas">Kegiatan Kelas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Upload Foto Input Section */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload File Foto Kegiatan</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Format: JPG, PNG (Maks 5MB)</span>
                </label>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center space-y-2 hover:border-blue-500 transition">
                  {fotoUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-40 max-w-md mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img src={fotoUrl} alt="Preview Foto" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFotoUrl("")}
                          className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition"
                          title="Hapus foto saat ini"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Foto Siap Disimpan</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-slate-700">Pilih file foto dari perangkat Anda</p>
                      <p className="text-[10px] text-slate-400">Klik tombol di bawah atau unggah gambar</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"
                  />
                </div>

                {/* Sample Presets Selection if User wants to test easily */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    Atau Pilih Contoh Foto Sample:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setFotoUrl("https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-md border border-slate-200 shrink-0"
                    >
                      📷 Sample Sholat/Pembiasaan
                    </button>
                    <button
                      type="button"
                      onClick={() => setFotoUrl("https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-md border border-slate-200 shrink-0"
                    >
                      📷 Sample Home Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setFotoUrl("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-md border border-slate-200 shrink-0"
                    >
                      📷 Sample Rapat Wali Murid
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Catatan Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={fotoDeskripsi}
                  onChange={(e) => setFotoDeskripsi(e.target.value)}
                  placeholder="Jelaskan ringkasan kegiatan, lokasi, hasil yang dicapai, atau catatan wali kelas..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Foto Kegiatan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PREVIEW / ZOOM FOTO KEGIATAN */}
      {previewFoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-left border border-slate-200 space-y-0">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Dokumentasi Kelas {previewFoto.kelasId} — {previewFoto.kategori}
                </span>
                <h3 className="text-sm font-bold">{previewFoto.judul}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFoto(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img src={previewFoto.fotoUrl} alt={previewFoto.judul} className="max-w-full max-h-[60vh] object-contain" />
            </div>

            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tanggal: {previewFoto.tanggal}</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold">
                  Kelas {previewFoto.kelasId}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {previewFoto.deskripsi || "Tidak ada deskripsi."}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewFoto(null);
                    handleOpenEditFoto(previewFoto);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit / Upload Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFoto(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CETAK LAPORAN FORMAL & PRATINJAU DOKUMEN */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
          {/* CSS Print Styles Override */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-document, #printable-document * {
                visibility: visible !important;
              }
              #printable-document {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 24px !important;
                background: #ffffff !important;
                color: #000000 !important;
                font-size: 11pt !important;
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

          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-6 border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none">
            {/* Modal Toolbar Header (Hidden in Print) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Pratinjau Cetak Laporan Guru Wali Kelas
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Dokumen siap cetak resmi dengan Kop Surat & Tanda Tangan Wali Kelas
                  </p>
                </div>
              </div>

              {/* Report Type Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPrintDocType("PENDAMPINGAN")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    printDocType === "PENDAMPINGAN"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tabel Pendampingan
                </button>
                <button
                  type="button"
                  onClick={() => setPrintDocType("REKAP")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    printDocType === "REKAP"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Rekap Pertemuan
                </button>
                <button
                  type="button"
                  onClick={() => setPrintDocType("FOTO")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    printDocType === "FOTO"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Foto Kegiatan
                </button>
                <button
                  type="button"
                  onClick={() => setPrintDocType("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    printDocType === "ALL"
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Laporan Lengkap (Semua)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DOKUMEN CETAK DENGAN KOP SURAT (Visible in Modal Preview & Outputted to Printer) */}
            <div
              id="printable-document"
              className="p-6 sm:p-8 bg-white text-slate-900 font-sans leading-relaxed space-y-6 border border-slate-200 rounded-xl print:border-none print:p-0"
            >
              {/* KOP SURAT RESMI */}
              <div className="text-center border-b-4 border-double border-slate-900 pb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
                  PEMERINTAH KABUPATEN / KOTA — DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h4>
                <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight my-1">
                  SMP ISLAM TERPADU / SMP NEGERI AL-HIKMAH
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  Jl. Pendidikan No. 45, Kompleks Perguruan Islam, Telp. (021) 555-0199 | Website: www.sekolah-alhikmah.sch.id
                </p>
              </div>

              {/* METADATA LAPORAN */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-semibold gap-2 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-sm font-extrabold uppercase text-slate-900">
                    {printDocType === "PENDAMPINGAN" && "LAPORAN DATA PENDAMPINGAN DAN CATATAN KHUSUS MURID"}
                    {printDocType === "REKAP" && "LAPORAN REKAP PERTEMUAN DAN JURNAL KONSELING MURID"}
                    {printDocType === "FOTO" && "DOKUMENTASI FOTO KEGIATAN WALI KELAS"}
                    {printDocType === "ALL" && "LAPORAN LENGKAP WALI KELAS (PENDAMPINGAN, REKAP PERTEMUAN & FOTO KEGIATAN)"}
                  </p>
                  <p className="text-slate-600 font-medium mt-0.5">
                    Kelas: <strong className="text-slate-900">{selectedClassId === "ALL" ? "Semua Kelas" : `Kelas ${selectedClassId}`}</strong> | Semester: <strong>Genap (2)</strong> | Tahun Ajaran: <strong>2025/2026</strong>
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <p>Tanggal Cetak: <strong className="text-slate-900">{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong></p>
                  <p>Guru Wali Kelas: <strong className="text-slate-900">{guru.nama}</strong> (NIP. {guru.nip})</p>
                </div>
              </div>

              {/* SEKSI 1: TABEL PENDAMPINGAN MURID */}
              {(printDocType === "PENDAMPINGAN" || printDocType === "ALL") && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-emerald-800 pl-2 py-0.5">
                    1. TABEL PENDAMPINGAN MURID & KONTAK ORANGTUA ({filteredStudents.length} MURID)
                  </h3>
                  <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-extrabold border-b border-slate-400 text-[11px] text-center uppercase">
                        <th className="py-2.5 px-2 border-r border-slate-400 w-8">No</th>
                        <th className="py-2.5 px-3 border-r border-slate-400 w-24">NISN</th>
                        <th className="py-2.5 px-3 border-r border-slate-400 min-w-[130px]">Nama Murid</th>
                        <th className="py-2.5 px-2 border-r border-slate-400 w-10">L/P</th>
                        <th className="py-2.5 px-2 border-r border-slate-400 w-14">Kelas</th>
                        <th className="py-2.5 px-3 border-r border-slate-400 w-32">Kontak Orangtua</th>
                        <th className="py-2.5 px-3">Catatan Khusus Perkembangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium text-slate-800">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((siswa, idx) => (
                          <tr key={siswa.nisn} className="hover:bg-slate-50">
                            <td className="py-2 px-2 text-center font-bold border-r border-slate-300">{idx + 1}</td>
                            <td className="py-2 px-3 font-mono border-r border-slate-300 text-[11px]">{siswa.nisn}</td>
                            <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-300">{siswa.nama}</td>
                            <td className="py-2 px-2 text-center font-bold border-r border-slate-300">{siswa.gender === "Laki-laki" ? "L" : "P"}</td>
                            <td className="py-2 px-2 text-center font-bold border-r border-slate-300">{siswa.kelasId}</td>
                            <td className="py-2 px-3 border-r border-slate-300">{siswa.kontakOrangTua || "-"}</td>
                            <td className="py-2 px-3 leading-tight">{siswa.catatanKhusus || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-4 text-center italic text-slate-500">Tidak ada data murid.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SEKSI 2: REKAP PERTEMUAN DENGAN MURID */}
              {(printDocType === "REKAP" || printDocType === "ALL") && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-amber-800 pl-2 py-0.5">
                    {printDocType === "ALL" ? "2. REKAP PERTEMUAN & JURNAL KONSELING MURID" : "REKAP PERTEMUAN & JURNAL KONSELING MURID"} ({filteredPertemuan.length} SESI)
                  </h3>
                  <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-extrabold border-b border-slate-400 text-[11px] text-center uppercase">
                        <th className="py-2.5 px-2 border-r border-slate-400 w-8">No</th>
                        <th className="py-2.5 px-3 border-r border-slate-400 w-28">Hari / Tanggal</th>
                        <th className="py-2.5 px-2 border-r border-slate-400 w-20">Pertemuan</th>
                        <th className="py-2.5 px-3 border-r border-slate-400 w-36">Nama Murid</th>
                        <th className="py-2.5 px-3 border-r border-slate-400">Topik / Masalah Dibahas</th>
                        <th className="py-2.5 px-3 border-r border-slate-400">Tindak Lanjut</th>
                        <th className="py-2.5 px-2 w-24 text-center">Ket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium text-slate-800">
                      {filteredPertemuan.length > 0 ? (
                        filteredPertemuan.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-2 px-2 text-center font-bold border-r border-slate-300">{idx + 1}</td>
                            <td className="py-2 px-3 border-r border-slate-300 font-semibold text-[11px]">{item.hariTanggal}</td>
                            <td className="py-2 px-2 text-center font-bold border-r border-slate-300">{item.pertemuanKe}</td>
                            <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-300">
                              {item.siswaNama} <span className="font-normal text-[10px] text-slate-600 block">({item.kelasId})</span>
                            </td>
                            <td className="py-2 px-3 border-r border-slate-300 leading-tight">{item.topikMasalah}</td>
                            <td className="py-2 px-3 border-r border-slate-300 leading-tight">{item.tindakLanjut}</td>
                            <td className="py-2 px-2 text-center font-bold text-[11px]">{item.keterangan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-4 text-center italic text-slate-500">Belum ada catatan rekap pertemuan murid.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SEKSI 3: DOKUMENTASI FOTO KEGIATAN WALI KELAS */}
              {(printDocType === "FOTO" || printDocType === "ALL") && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-800 pl-2 py-0.5">
                    {printDocType === "ALL" ? "3. DOKUMENTASI FOTO KEGIATAN WALI KELAS" : "DOKUMENTASI FOTO KEGIATAN WALI KELAS"} ({filteredFotoList.length} DOKUMENTASI)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredFotoList.length > 0 ? (
                      filteredFotoList.map((f, idx) => (
                        <div key={f.id} className="border border-slate-300 rounded-lg p-3 bg-white space-y-2 break-inside-avoid">
                          <div className="w-full h-40 rounded border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img src={f.fotoUrl} alt={f.judul} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1 text-left">
                            <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold border-b border-slate-100 pb-1">
                              <span>Kegiatan #{idx + 1} — Kelas {f.kelasId}</span>
                              <span>{f.tanggal}</span>
                            </div>
                            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">{f.judul}</h5>
                            <p className="text-[10px] text-slate-700 leading-normal">{f.deskripsi}</p>
                            <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              Kategori: {f.kategori}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 py-4 text-center italic text-slate-500 text-xs">Belum ada foto kegiatan wali kelas.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TANDA TANGAN / LEMBAR PENGESAHAN */}
              <div className="pt-8 flex justify-between items-start text-xs font-semibold text-slate-900 break-inside-avoid">
                <div className="text-center w-56 space-y-12">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold uppercase">Kepala Sekolah</p>
                  </div>
                  <div>
                    <p className="font-extrabold underline">Drs. H. Ahmad Dahlan, M.Pd.</p>
                    <p className="text-[11px] text-slate-600">NIP. 19680512 199403 1 002</p>
                  </div>
                </div>

                <div className="text-center w-56 space-y-12">
                  <div>
                    <p>Kota Bandung, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p className="font-bold uppercase">Guru Wali Kelas</p>
                  </div>
                  <div>
                    <p className="font-extrabold underline">{guru.nama}</p>
                    <p className="text-[11px] text-slate-600">NIP. {guru.nip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS MURID */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Hapus Data Murid?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong className="text-slate-900">{studentToDelete.nama}</strong> (NISN: {studentToDelete.nisn})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Murid</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
