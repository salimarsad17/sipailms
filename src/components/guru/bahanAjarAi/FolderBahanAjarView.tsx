/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Upload,
  Search,
  X,
  FileText,
  Table,
  Video as VideoIcon,
  BookOpen,
  Music,
  Play,
  Square,
  Eye,
  Download,
  Trash2,
  Star,
  Plus,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Layers,
  Calendar,
  Tag,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { BahanAjarFolderItem, BahanAjarFileItem, FileKategoriType } from "../../../types/bahanAjarFolder";
import { BahanAjarAiFolderStorage, DEFAULT_FOLDERS, DEFAULT_FILES } from "../../../services/bahanAjarAiFolderStorage";
import MediaFileViewerModal, { MediaViewerData } from "../../common/MediaFileViewerModal";

interface FolderBahanAjarViewProps {
  onBackToDashboard?: () => void;
}

export default function FolderBahanAjarView({ onBackToDashboard }: FolderBahanAjarViewProps) {
  // Folder & File data state
  const [folders, setFolders] = useState<BahanAjarFolderItem[]>(() =>
    BahanAjarAiFolderStorage.getFolders()
  );
  const [files, setFiles] = useState<BahanAjarFileItem[]>(() =>
    BahanAjarAiFolderStorage.getFiles()
  );

  // Active folder: null means "All Folders"
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Search & Filters (Search bar requested explicitly!)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeKategoriFilter, setActiveKategoriFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Media Viewer modal state
  const [viewerMedia, setViewerMedia] = useState<MediaViewerData | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Add / Upload File modal state
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileCategory, setNewFileCategory] = useState<FileKategoriType>("word");
  const [newFileFolderId, setNewFileFolderId] = useState<string>("f_word");
  const [newFileDesc, setNewFileDesc] = useState<string>("");
  const [newVideoUrl, setNewVideoUrl] = useState<string>("");
  const [newFileDataUrl, setNewFileDataUrl] = useState<string>("");
  const [newFileSize, setNewFileSize] = useState<string>("1.5 MB");
  const [newFileMime, setNewFileMime] = useState<string>("");
  const [newFileTextContent, setNewFileTextContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Folder modal state
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFolderDesc, setNewFolderDesc] = useState<string>("");
  const [newFolderWarna, setNewFolderWarna] = useState<
    "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo" | "teal"
  >("blue");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected folder object
  const currentFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => f.id === selectedFolderId) || null;
  }, [folders, selectedFolderId]);

  // Filtered files according to folder, search query, and category filter
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // 1. Folder match
      if (selectedFolderId && file.folderId !== selectedFolderId) {
        return false;
      }

      // 2. Category match
      if (activeKategoriFilter === "FAVORITE") {
        if (!file.isFavorite) return false;
      } else if (activeKategoriFilter !== "ALL" && file.kategori !== activeKategoriFilter.toLowerCase()) {
        return false;
      }

      // 3. Search query match (Searches filename, desc, tags, and category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = file.nama.toLowerCase().includes(q);
        const matchDesc = (file.deskripsi || "").toLowerCase().includes(q);
        const matchExt = file.ekstensi.toLowerCase().includes(q);
        const matchCat = file.kategori.toLowerCase().includes(q);
        const matchTags = (file.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchName || matchDesc || matchExt || matchCat || matchTags;
      }

      return true;
    });
  }, [files, selectedFolderId, activeKategoriFilter, searchQuery]);

  // Folder file count map
  const folderFileCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    folders.forEach((f) => (map[f.id] = 0));
    files.forEach((file) => {
      if (map[file.folderId] !== undefined) {
        map[file.folderId]++;
      }
    });
    return map;
  }, [folders, files]);

  // Open file in in-app viewer (Word, Excel, Video with Play/Stop, PDF)
  const handleOpenFile = (file: BahanAjarFileItem) => {
    const mime =
      file.mimeType ||
      (file.kategori === "video"
        ? "video/mp4"
        : file.kategori === "pdf"
        ? "application/pdf"
        : file.kategori === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    setViewerMedia({
      title: file.nama.replace(/\.[^/.]+$/, ""),
      fileName: file.nama,
      fileSize: file.ukuran,
      fileDataUrl: file.fileDataUrl,
      fileMimeType: mime,
      videoUrl: file.videoUrl,
      textContent: file.textContent || file.deskripsi,
      tableData: file.tableData,
      audioDuration: file.durasi,
      uploadedAt: file.tanggalUpload,
      className: "Bahan Ajar AI PAI"
    });
    setIsViewerOpen(true);
  };

  // Download file
  const handleDownloadFile = (file: BahanAjarFileItem) => {
    if (file.fileDataUrl) {
      const a = document.createElement("a");
      a.href = file.fileDataUrl;
      a.download = file.nama;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = file.textContent || `Berkas Bahan Ajar AI: ${file.nama}\nDeskripsi: ${file.deskripsi}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.nama;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    showToast(`Memulai unduhan berkas: ${file.nama}`);
  };

  // Delete file
  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus berkas "${fileName}" dari folder?`)) {
      const updated = BahanAjarAiFolderStorage.deleteFile(fileId);
      setFiles(updated);
      showToast(`Berkas "${fileName}" berhasil dihapus.`);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (fileId: string) => {
    const updated = BahanAjarAiFolderStorage.toggleFavorite(fileId);
    setFiles(updated);
  };

  // Handle local file selection in upload modal
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    setNewFileName(fileName);
    setNewFileSize(sizeInMb);
    setNewFileMime(file.type);

    // Auto-detect category
    if (["docx", "doc", "odt", "rtf"].includes(ext)) {
      setNewFileCategory("word");
      setNewFileFolderId("f_word");
    } else if (["xlsx", "xls", "csv"].includes(ext)) {
      setNewFileCategory("excel");
      setNewFileFolderId("f_excel");
    } else if (["mp4", "webm", "mov", "mkv", "avi"].includes(ext)) {
      setNewFileCategory("video");
      setNewFileFolderId("f_video");
    } else if (ext === "pdf") {
      setNewFileCategory("pdf");
      setNewFileFolderId("f_pdf");
    } else if (["mp3", "wav", "m4a", "ogg"].includes(ext)) {
      setNewFileCategory("audio");
      setNewFileFolderId("f_media");
    } else {
      setNewFileCategory("lainnya");
    }

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewFileDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Add File
  const handleSaveNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      alert("Silakan masukkan nama berkas!");
      return;
    }

    const ext = newFileName.split(".").pop()?.toLowerCase() || (newFileCategory === "video" ? "mp4" : newFileCategory === "excel" ? "xlsx" : newFileCategory === "word" ? "docx" : "pdf");
    const fullFileName = newFileName.includes(".") ? newFileName : `${newFileName}.${ext}`;

    const newFile: BahanAjarFileItem = {
      id: `file_${Date.now()}`,
      folderId: newFileFolderId,
      nama: fullFileName,
      kategori: newFileCategory,
      ekstensi: ext,
      ukuran: newFileSize || "1.2 MB",
      tanggalUpload: new Date().toISOString().split("T")[0],
      deskripsi: newFileDesc.trim() || `Berkas bahan ajar ${newFileCategory.toUpperCase()} diunggah oleh Guru PAI.`,
      fileDataUrl: newFileDataUrl || undefined,
      videoUrl: newVideoUrl.trim() || undefined,
      textContent: newFileTextContent.trim() || undefined,
      mimeType: newFileMime || undefined,
      durasi: newFileCategory === "video" ? "10:00" : undefined
    };

    const updated = BahanAjarAiFolderStorage.addFile(newFile);
    setFiles(updated);
    setIsAddFileModalOpen(false);

    // Reset form
    setNewFileName("");
    setNewFileDesc("");
    setNewVideoUrl("");
    setNewFileDataUrl("");
    setNewFileTextContent("");
    showToast(`Alhamdulillah! Berkas "${fullFileName}" berhasil disimpan ke folder.`);
  };

  // Submit Create Folder
  const handleSaveNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      alert("Silakan masukkan nama folder!");
      return;
    }

    const newFolder: BahanAjarFolderItem = {
      id: `folder_${Date.now()}`,
      nama: newFolderName.trim(),
      deskripsi: newFolderDesc.trim() || "Folder penyimpanan berkas bahan ajar PAI kustom.",
      warna: newFolderWarna,
      createdAt: new Date().toISOString().split("T")[0],
      iconName: "Folder"
    };

    const updated = BahanAjarAiFolderStorage.addFolder(newFolder);
    setFolders(updated);
    setIsCreateFolderModalOpen(false);
    setNewFolderName("");
    setNewFolderDesc("");
    showToast(`Folder "${newFolder.nama}" berhasil dibuat.`);
  };

  // Delete folder
  const handleDeleteFolder = (folderId: string, folderName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus folder "${folderName}" beserta seluruh berkas di dalamnya?`)) {
      const updatedFolders = BahanAjarAiFolderStorage.deleteFolder(folderId);
      setFolders(updatedFolders);
      setFiles(BahanAjarAiFolderStorage.getFiles());
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
      showToast(`Folder "${folderName}" berhasil dihapus.`);
    }
  };

  // Reset to default data
  const handleResetData = () => {
    if (confirm("Kembalikan seluruh folder dan berkas bawaan resmi Bahan Ajar AI PAI (Word, Excel, Video Play & Stop, PDF)?")) {
      const res = BahanAjarAiFolderStorage.resetToDefaults();
      setFolders(res.folders);
      setFiles(res.files);
      setSelectedFolderId(null);
      setSearchQuery("");
      showToast("Data folder dan berkas berhasil direset ke standar kurikulum.");
    }
  };

  // Color helper
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100/80 border-blue-200/80 text-blue-900",
          icon: "text-blue-600 bg-blue-100",
          badge: "bg-blue-100 text-blue-800"
        };
      case "emerald":
        return {
          bg: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-900",
          icon: "text-emerald-600 bg-emerald-100",
          badge: "bg-emerald-100 text-emerald-800"
        };
      case "amber":
        return {
          bg: "bg-amber-50 hover:bg-amber-100/80 border-amber-200/80 text-amber-900",
          icon: "text-amber-600 bg-amber-100",
          badge: "bg-amber-100 text-amber-800"
        };
      case "rose":
        return {
          bg: "bg-rose-50 hover:bg-rose-100/80 border-rose-200/80 text-rose-900",
          icon: "text-rose-600 bg-rose-100",
          badge: "bg-rose-100 text-rose-800"
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100/80 border-purple-200/80 text-purple-900",
          icon: "text-purple-600 bg-purple-100",
          badge: "bg-purple-100 text-purple-800"
        };
      default:
        return {
          bg: "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900",
          icon: "text-slate-600 bg-slate-100",
          badge: "bg-slate-100 text-slate-800"
        };
    }
  };

  // File icon helper
  const getFileIcon = (kategori: FileKategoriType) => {
    switch (kategori) {
      case "word":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "excel":
        return <Table className="w-5 h-5 text-emerald-600" />;
      case "video":
        return <VideoIcon className="w-5 h-5 text-rose-600" />;
      case "pdf":
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case "audio":
        return <Music className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-amber-300 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-blue-800/60">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Folder className="w-72 h-72 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/60 text-amber-300 text-xs font-black uppercase tracking-wider">
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Penyimpanan & Media Bahan Ajar AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Folder Berkas & Media Pembelajaran PAI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Simpan, kelola, cari, dan buka berkas <strong>Word (.docx)</strong>, <strong>Excel (.xlsx)</strong>, <strong>Video (Play & Stop In-App)</strong>, dan <strong>PDF</strong> langsung di dalam aplikasi SIPAILMS UPT SMPN 2 Rebang Tangkas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddFileModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md border border-amber-300 flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>+ Unggah / Tambah Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="px-4 py-2.5 bg-blue-800/80 hover:bg-blue-700 text-white text-xs font-bold rounded-xl border border-blue-600/80 flex items-center gap-2 transition cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-blue-300" />
              <span>+ Buat Folder Baru</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl border border-white/20 transition cursor-pointer"
              title="Reset ke berkas bawaan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR (REQUESTED EXPLICITLY BY USER!) */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berkas dokumen Word, lembar Excel, video Play & Stop, PDF, materi, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{filteredFiles.length} Berkas Ditemukan</span>
            </span>

            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilan Grid"
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === "list"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilan Tabel / Baris"
              >
                Tabel
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => setActiveKategoriFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "ALL"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Format ({files.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveKategoriFilter("word")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "word"
                ? "bg-blue-700 text-white shadow-2xs"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word (.docx) ({files.filter((f) => f.kategori === "word").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveKategoriFilter("excel")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "excel"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Excel (.xlsx) ({files.filter((f) => f.kategori === "excel").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveKategoriFilter("video")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "video"
                ? "bg-rose-700 text-white shadow-2xs"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60"
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Video Play & Stop ({files.filter((f) => f.kategori === "video").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveKategoriFilter("pdf")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "pdf"
                ? "bg-amber-700 text-white shadow-2xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PDF ({files.filter((f) => f.kategori === "pdf").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveKategoriFilter("FAVORITE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeKategoriFilter === "FAVORITE"
                ? "bg-yellow-500 text-slate-950 shadow-2xs"
                : "bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200/60"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span>Favorit ({files.filter((f) => f.isFavorite).length})</span>
          </button>
        </div>
      </div>

      {/* FOLDERS NAVIGATION / CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-700" />
              <span>Daftar Folder Bahan Ajar AI</span>
            </h3>
            {selectedFolderId && (
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                Sedang Dibuka
              </span>
            )}
          </div>

          {selectedFolderId && (
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tampilkan Semua Folder</span>
            </button>
          )}
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card All Folders */}
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] group ${
              selectedFolderId === null
                ? "bg-blue-900 text-white border-blue-950 shadow-md ring-2 ring-blue-500"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  selectedFolderId === null
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  selectedFolderId === null
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {files.length} Berkas
              </span>
            </div>

            <div>
              <span className="block text-xs sm:text-[13px] font-black leading-tight mt-2">
                Semua Folder & Berkas
              </span>
              <span
                className={`block text-[10px] mt-0.5 truncate ${
                  selectedFolderId === null ? "text-blue-200" : "text-slate-400"
                }`}
              >
                Koleksi lengkap seluruh format
              </span>
            </div>
          </div>

          {/* Specific Folders */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            const count = folderFileCountMap[folder.id] || 0;
            const colorClasses = getColorClasses(folder.warna);

            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] group relative ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-emerald-500"
                    : `${colorClasses.bg} hover:shadow-md`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition group-hover:scale-105 ${
                      isSelected ? "bg-white/20 text-white" : colorClasses.icon
                    }`}
                  >
                    {folder.id === "f_video" ? (
                      <VideoIcon className="w-5 h-5" />
                    ) : folder.id === "f_excel" ? (
                      <Table className="w-5 h-5" />
                    ) : folder.id === "f_word" ? (
                      <FileText className="w-5 h-5" />
                    ) : folder.id === "f_pdf" ? (
                      <BookOpen className="w-5 h-5" />
                    ) : (
                      <Folder className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : colorClasses.badge
                      }`}
                    >
                      {count} File
                    </span>

                    {!folder.isDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id, folder.nama);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-0.5 transition"
                        title="Hapus folder kustom"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-xs sm:text-[13px] font-black leading-tight mt-2 line-clamp-1">
                    {folder.nama}
                  </span>
                  <span
                    className={`block text-[10px] mt-0.5 truncate ${
                      isSelected ? "text-slate-300" : "text-slate-500 opacity-90"
                    }`}
                    title={folder.deskripsi}
                  >
                    {folder.deskripsi}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BREADCRUMB INDICATOR */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400">Lokasi:</span>
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className="text-blue-700 hover:underline font-bold"
          >
            Folder Berkas AI
          </button>
          {currentFolder && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                {currentFolder.nama}
              </span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                Pencarian: "{searchQuery}"
              </span>
            </>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Format didukung: Word, Excel, Video (Play/Stop), PDF
        </span>
      </div>

      {/* FILES CONTAINER (GRID / LIST) */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Tidak Ada Berkas yang Ditemukan
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? `Tidak ditemukan berkas yang cocok dengan kata kunci "${searchQuery}". Coba gunakan istilah lain atau periksa filter format.`
                : "Folder ini masih kosong. Silakan klik tombol '+ Unggah / Tambah Berkas' untuk menambahkan materi Word, Excel, Video, atau PDF."}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Hapus Pencarian
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAddFileModalOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Unggah Berkas Baru</span>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const isVideo = file.kategori === "video";
            const isExcel = file.kategori === "excel";
            const isWord = file.kategori === "word";
            const isPdf = file.kategori === "pdf";

            return (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-blue-300"
              >
                {/* Card Header Top Strip */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-xs ${
                          isWord
                            ? "bg-blue-100 text-blue-700"
                            : isExcel
                            ? "bg-emerald-100 text-emerald-700"
                            : isVideo
                            ? "bg-rose-100 text-rose-700"
                            : isPdf
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {getFileIcon(file.kategori)}
                      </div>

                      <div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isWord
                              ? "bg-blue-50 text-blue-800 border border-blue-200/80"
                              : isExcel
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                              : isVideo
                              ? "bg-rose-50 text-rose-800 border border-rose-200/80"
                              : isPdf
                              ? "bg-amber-50 text-amber-800 border border-amber-200/80"
                              : "bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          .{file.ekstensi.toUpperCase()}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {file.ukuran} {file.durasi ? `• ⏱ ${file.durasi}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(file.id)}
                        className={`p-1.5 rounded-lg transition ${
                          file.isFavorite
                            ? "text-yellow-500 bg-yellow-50"
                            : "text-slate-300 hover:text-yellow-500"
                        }`}
                        title={file.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
                      >
                        <Star className={`w-4 h-4 ${file.isFavorite ? "fill-yellow-500" : ""}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.id, file.nama)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition"
                        title="Hapus berkas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Title & Description */}
                  <div>
                    <h4
                      onClick={() => handleOpenFile(file)}
                      className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-700 transition cursor-pointer line-clamp-2 leading-snug"
                      title={file.nama}
                    >
                      {file.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {file.deskripsi}
                    </p>
                  </div>

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {file.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Primary In-App Viewer / Player button */}
                  <button
                    type="button"
                    onClick={() => handleOpenFile(file)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95 ${
                      isVideo
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : isExcel
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : isWord
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                    title={isVideo ? "Putar video dengan kontrol Play dan Stop" : "Buka dan lihat berkas di aplikasi"}
                  >
                    {isVideo ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar (Play/Stop)</span>
                      </>
                    ) : isExcel ? (
                      <>
                        <Table className="w-3.5 h-3.5" />
                        <span>Buka Spreadsheet</span>
                      </>
                    ) : isWord ? (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>Buka Dokumen</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Berkas</span>
                      </>
                    )}
                  </button>

                  {/* Download button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition shadow-2xs"
                    title="Unduh berkas ke komputer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-3 text-center w-10">#</th>
                <th className="px-4 py-3">Nama Berkas</th>
                <th className="px-3.5 py-3">Kategori & Format</th>
                <th className="px-3.5 py-3">Ukuran</th>
                <th className="px-3.5 py-3">Folder</th>
                <th className="px-3.5 py-3">Tanggal</th>
                <th className="px-4 py-3 text-center">Aksi In-App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFiles.map((file, idx) => {
                const folderName = folders.find((f) => f.id === file.folderId)?.nama || "Umum";
                const isVideo = file.kategori === "video";

                return (
                  <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3.5 py-3 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="shrink-0">{getFileIcon(file.kategori)}</div>
                        <div>
                          <span
                            onClick={() => handleOpenFile(file)}
                            className="font-bold text-slate-900 hover:text-blue-700 transition cursor-pointer block line-clamp-1"
                          >
                            {file.nama}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {file.deskripsi}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="bg-slate-100 text-slate-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-slate-200">
                        {file.kategori} (.{file.ekstensi})
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-mono text-[11px] text-slate-600">
                      {file.ukuran} {file.durasi ? `(${file.durasi})` : ""}
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="text-[11px] text-blue-700 font-semibold truncate block max-w-[140px]">
                        📁 {folderName}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-[11px] text-slate-500 font-mono">
                      {file.tanggalUpload}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenFile(file)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold text-white transition flex items-center gap-1 cursor-pointer shadow-2xs ${
                            isVideo
                              ? "bg-rose-600 hover:bg-rose-700"
                              : file.kategori === "excel"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          title={isVideo ? "Putar video dengan kontrol Play dan Stop" : "Buka berkas di aplikasi"}
                        >
                          {isVideo ? (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Putar (Play/Stop)</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Buka File</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="p-1 text-slate-500 hover:text-slate-800 transition"
                          title="Unduh berkas"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id, file.nama)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Hapus berkas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: UNGGAH / TAMBAH BERKAS BARU */}
      {isAddFileModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setIsAddFileModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Unggah / Simpan Berkas Baru
                  </h3>
                  <p className="text-xs text-blue-200 font-medium">
                    Mendukung Word (.docx), Excel (.xlsx), Video (.mp4 / link), PDF
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddFileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewFile} className="p-5 overflow-y-auto space-y-4 text-xs font-medium text-slate-700">
              {/* Local File Browser input */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border-2 border-dashed border-blue-300 text-center space-y-2">
                <Upload className="w-7 h-7 text-blue-600 mx-auto" />
                <div className="text-xs text-slate-700 font-bold">
                  Pilih berkas dari komputer Anda (Word, Excel, Video MP4, PDF)
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLocalFileChange}
                  accept=".docx,.doc,.xlsx,.xls,.mp4,.webm,.mov,.pdf,.mp3"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Jelajahi File Komputer
                </button>
                {newFileName && (
                  <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 py-1 px-3 rounded-lg mt-2 inline-block">
                    ✓ Terpilih: {newFileName} ({newFileSize})
                  </div>
                )}
              </div>

              {/* File Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Nama Berkas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul_Ajar_PAI_Bab_2_AsmaulHusna.docx"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category & Folder */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Format / Kategori
                  </label>
                  <select
                    value={newFileCategory}
                    onChange={(e) => {
                      const cat = e.target.value as FileKategoriType;
                      setNewFileCategory(cat);
                      if (cat === "word") setNewFileFolderId("f_word");
                      else if (cat === "excel") setNewFileFolderId("f_excel");
                      else if (cat === "video") setNewFileFolderId("f_video");
                      else if (cat === "pdf") setNewFileFolderId("f_pdf");
                      else if (cat === "audio") setNewFileFolderId("f_media");
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="word">📄 Word (.docx / .doc)</option>
                    <option value="excel">📊 Excel (.xlsx / .xls)</option>
                    <option value="video">🎥 Video (MP4 / Web Video)</option>
                    <option value="pdf">📕 PDF Document</option>
                    <option value="audio">🎵 Audio (MP3)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Simpan ke Folder
                  </label>
                  <select
                    value={newFileFolderId}
                    onChange={(e) => setNewFileFolderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video URL Input (If video) */}
              {newFileCategory === "video" && (
                <div className="space-y-1 p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <label className="block text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <VideoIcon className="w-3.5 h-3.5 text-rose-600" />
                    <span>Tautan Video YouTube / Google Drive / MP4 URL</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: https://www.youtube.com/watch?v=vV-G7lA7kX0"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-600 font-mono text-xs"
                  />
                  <span className="text-[10px] text-rose-700 block">
                    ✓ Video dapat di-play dan di-stop langsung di dalam aplikasi!
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Ringkasan / Keterangan Berkas
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan materi pokok, bab, dan petunjuk penggunaan berkas ini..."
                  value={newFileDesc}
                  onChange={(e) => setNewFileDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              {/* Text content fallback for word/document preview */}
              {(newFileCategory === "word" || newFileCategory === "pdf") && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Isi / Kutipan Teks Dokumen (Untuk Pratinjau Cepat)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Masukkan kutipan materi atau poin-poin capaian modul ajar agar bisa langsung dibaca pada jendela viewer..."
                    value={newFileTextContent}
                    onChange={(e) => setNewFileTextContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-sans"
                  ></textarea>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFileModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Berkas ke Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUAT FOLDER BARU */}
      {isCreateFolderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setIsCreateFolderModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden border border-slate-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Buat Folder Bahan Ajar Baru
                  </h3>
                  <p className="text-xs text-blue-200 font-medium">
                    Atur nama dan tema warna folder
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateFolderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewFolder} className="p-5 space-y-4 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Nama Folder *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Media Praktik Shalat & Zakat"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Deskripsi Folder
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat isi materi di dalam folder..."
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Tema Warna Folder
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(["blue", "emerald", "amber", "rose", "purple", "teal"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderWarna(color)}
                      className={`h-8 rounded-xl border-2 transition capitalize font-bold text-[10px] flex items-center justify-center ${
                        newFolderWarna === color ? "border-slate-900 ring-2 ring-blue-500 scale-105" : "border-transparent"
                      } ${
                        color === "blue"
                          ? "bg-blue-500 text-white"
                          : color === "emerald"
                          ? "bg-emerald-500 text-white"
                          : color === "amber"
                          ? "bg-amber-500 text-slate-950"
                          : color === "rose"
                          ? "bg-rose-500 text-white"
                          : color === "purple"
                          ? "bg-purple-500 text-white"
                          : "bg-teal-500 text-white"
                      }`}
                    >
                      {newFolderWarna === color ? "✓" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Buat Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP MEDIA & FILE VIEWER MODAL (Word, Excel, Video with Play/Stop, PDF) */}
      <MediaFileViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        data={viewerMedia}
      />
    </div>
  );
}
