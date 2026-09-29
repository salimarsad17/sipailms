/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from "react";
import {
  BookOpen,
  Video,
  Plus,
  Edit,
  Trash2,
  Upload,
  Send,
  Calendar,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  AlertCircle,
  X,
  FileUp,
  Download,
  Eye,
  Film
} from "lucide-react";
import {
  MateriPembelajaranItem,
  VideoPembelajaranItem,
  PenugasanBahanAjar,
  KelasTingkat,
  SemesterTipe
} from "../../types/bahanAjarAi";
import { DataService } from "../../data/initialData";
import { Kelas } from "../../types";

interface BahanAjarAiViewProps {
  initialSubTab?: "materi" | "video" | "penugasan";
  classes?: Kelas[];
}

export default function BahanAjarAiView({
  initialSubTab = "materi",
  classes = []
}: BahanAjarAiViewProps) {
  // Active sub-tab: materi, video, or penugasan
  const [activeSubTab, setActiveSubTab] = useState<"materi" | "video" | "penugasan">(initialSubTab);

  // Filters
  const [selectedKelas, setSelectedKelas] = useState<string>("Semua");
  const [selectedSemester, setSelectedSemester] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [materiList, setMateriList] = useState<MateriPembelajaranItem[]>(() => DataService.getMateriList());
  const [videoList, setVideoList] = useState<VideoPembelajaranItem[]>(() => DataService.getVideoList());
  const [penugasanList, setPenugasanList] = useState<PenugasanBahanAjar[]>(() => DataService.getPenugasanBahanAjarList());

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [isMateriModalOpen, setIsMateriModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<MateriPembelajaranItem | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoPembelajaranItem | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetItem, setUploadTargetItem] = useState<{
    id: string;
    tipe: "materi" | "video";
    judul: string;
  } | null>(null);

  const [isPenugasanModalOpen, setIsPenugasanModalOpen] = useState(false);
  const [targetForPenugasan, setTargetForPenugasan] = useState<{
    id: string;
    tipe: "materi" | "video";
    judul: string;
    kelas: KelasTingkat;
    semester: SemesterTipe;
  } | null>(null);

  const [viewDetailItem, setViewDetailItem] = useState<MateriPembelajaranItem | null>(null);
  const [viewVideoItem, setViewVideoItem] = useState<VideoPembelajaranItem | null>(null);

  // Form states for Materi Modal
  const [formMateriJudul, setFormMateriJudul] = useState("");
  const [formMateriBab, setFormMateriBab] = useState("");
  const [formMateriKelas, setFormMateriKelas] = useState<KelasTingkat>("VII");
  const [formMateriSemester, setFormMateriSemester] = useState<SemesterTipe>("Ganjil");
  const [formMateriDeskripsi, setFormMateriDeskripsi] = useState("");
  const [formMateriIsi, setFormMateriIsi] = useState("");
  const [formMateriSurah, setFormMateriSurah] = useState("");
  const [formMateriAyat, setFormMateriAyat] = useState("");
  const [formMateriArab, setFormMateriArab] = useState("");
  const [formMateriArti, setFormMateriArti] = useState("");
  const [formMateriPoin, setFormMateriPoin] = useState("");

  // Form states for Video Modal
  const [formVideoJudul, setFormVideoJudul] = useState("");
  const [formVideoBab, setFormVideoBab] = useState("");
  const [formVideoKelas, setFormVideoKelas] = useState<KelasTingkat>("VII");
  const [formVideoSemester, setFormVideoSemester] = useState<SemesterTipe>("Ganjil");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formVideoDurasi, setFormVideoDurasi] = useState("");
  const [formVideoDeskripsi, setFormVideoDeskripsi] = useState("");
  const [formVideoPoin, setFormVideoPoin] = useState("");

  // Form states for Penugasan Modal
  const [formTugasKelasId, setFormTugasKelasId] = useState("");
  const [formTugasBatasWaktu, setFormTugasBatasWaktu] = useState("");
  const [formTugasInstruksi, setFormTugasInstruksi] = useState("");

  // Upload simulation state
  const [uploadFileName, setUploadFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Accessible unique IDs for form elements
  const filterKelasId = useId();
  const filterSemesterId = useId();
  const searchInputId = useId();

  // Listen to custom dispatch events from navigation
  React.useEffect(() => {
    const handleSetSubTab = (e: any) => {
      if (e.detail && ["materi", "video", "penugasan"].includes(e.detail)) {
        setActiveSubTab(e.detail);
      }
    };
    window.addEventListener("set-bahan-ai-tab", handleSetSubTab);
    return () => window.removeEventListener("set-bahan-ai-tab", handleSetSubTab);
  }, []);

  // Filter logic
  const filteredMateri = materiList.filter((m) => {
    const matchKelas = selectedKelas === "Semua" || m.kelas === selectedKelas;
    const matchSemester = selectedSemester === "Semua" || m.semester === selectedSemester;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSemester && matchSearch;
  });

  const filteredVideo = videoList.filter((v) => {
    const matchKelas = selectedKelas === "Semua" || v.kelas === selectedKelas;
    const matchSemester = selectedSemester === "Semua" || v.semester === selectedSemester;
    const matchSearch =
      v.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSemester && matchSearch;
  });

  // ==================== MATERI CRUD ====================
  const handleOpenAddMateri = () => {
    setEditingMateri(null);
    setFormMateriJudul("");
    setFormMateriBab("Bab 1: Menghadirkan Nilai Ketakwaan");
    setFormMateriKelas("VII");
    setFormMateriSemester("Ganjil");
    setFormMateriDeskripsi("");
    setFormMateriIsi("");
    setFormMateriSurah("");
    setFormMateriAyat("");
    setFormMateriArab("");
    setFormMateriArti("");
    setFormMateriPoin("");
    setIsMateriModalOpen(true);
  };

  const handleOpenEditMateri = (item: MateriPembelajaranItem) => {
    setEditingMateri(item);
    setFormMateriJudul(item.judul);
    setFormMateriBab(item.bab);
    setFormMateriKelas(item.kelas);
    setFormMateriSemester(item.semester);
    setFormMateriDeskripsi(item.deskripsi);
    setFormMateriIsi(item.isiMateri);
    setFormMateriSurah(item.dalilQuran?.surah || "");
    setFormMateriAyat(item.dalilQuran?.ayat || "");
    setFormMateriArab(item.dalilQuran?.arab || "");
    setFormMateriArti(item.dalilQuran?.arti || "");
    setFormMateriPoin(item.poinKunci.join("\n"));
    setIsMateriModalOpen(true);
  };

  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMateriJudul.trim() || !formMateriIsi.trim()) {
      alert("Mohon lengkapi judul dan isi materi pembelajaran!");
      return;
    }

    const poinArr = formMateriPoin
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const dalilObj =
      formMateriSurah.trim() || formMateriArab.trim()
        ? {
            surah: formMateriSurah.trim(),
            ayat: formMateriAyat.trim(),
            arab: formMateriArab.trim(),
            arti: formMateriArti.trim()
          }
        : undefined;

    let updatedList: MateriPembelajaranItem[];
    if (editingMateri) {
      updatedList = materiList.map((m) =>
        m.id === editingMateri.id
          ? {
              ...m,
              judul: formMateriJudul,
              bab: formMateriBab,
              kelas: formMateriKelas,
              semester: formMateriSemester,
              deskripsi: formMateriDeskripsi,
              isiMateri: formMateriIsi,
              dalilQuran: dalilObj,
              poinKunci: poinArr.length > 0 ? poinArr : m.poinKunci
            }
          : m
      );
      showToast("✅ Materi pembelajaran berhasil diperbarui!");
    } else {
      const newItem: MateriPembelajaranItem = {
        id: `materi-${Date.now()}`,
        judul: formMateriJudul,
        bab: formMateriBab,
        kelas: formMateriKelas,
        semester: formMateriSemester,
        deskripsi: formMateriDeskripsi,
        isiMateri: formMateriIsi,
        dalilQuran: dalilObj,
        poinKunci: poinArr.length > 0 ? poinArr : ["Pahami materi dengan tekun dan teliti."],
        tanggalDibuat: new Date().toISOString().split("T")[0],
        status: "Dipublikasikan"
      };
      updatedList = [newItem, ...materiList];
      showToast("✨ Materi pembelajaran baru berhasil ditambahkan!");
    }

    setMateriList(updatedList);
    DataService.saveMateriList(updatedList);
    setIsMateriModalOpen(false);
  };

  const handleDeleteMateri = (id: string, judul: string) => {
    if (window.confirm(`Hapus materi "${judul}"?`)) {
      const updated = materiList.filter((m) => m.id !== id);
      setMateriList(updated);
      DataService.saveMateriList(updated);
      showToast("🗑️ Materi berhasil dihapus.");
    }
  };

  // ==================== VIDEO CRUD ====================
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setFormVideoJudul("");
    setFormVideoBab("Bab 1: Menghadirkan Nilai Ketakwaan");
    setFormVideoKelas("VII");
    setFormVideoSemester("Ganjil");
    setFormVideoUrl("https://www.youtube.com/watch?v=kJQP7kiw5Fk");
    setFormVideoDurasi("12:00");
    setFormVideoDeskripsi("");
    setFormVideoPoin("");
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (item: VideoPembelajaranItem) => {
    setEditingVideo(item);
    setFormVideoJudul(item.judul);
    setFormVideoBab(item.bab);
    setFormVideoKelas(item.kelas);
    setFormVideoSemester(item.semester);
    setFormVideoUrl(item.urlVideo);
    setFormVideoDurasi(item.durasi);
    setFormVideoDeskripsi(item.deskripsi);
    setFormVideoPoin(item.poinPembahasan.join("\n"));
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVideoJudul.trim() || !formVideoUrl.trim()) {
      alert("Mohon lengkapi judul dan URL video pembelajaran!");
      return;
    }

    const poinArr = formVideoPoin
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    let updatedList: VideoPembelajaranItem[];
    if (editingVideo) {
      updatedList = videoList.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              judul: formVideoJudul,
              bab: formVideoBab,
              kelas: formVideoKelas,
              semester: formVideoSemester,
              urlVideo: formVideoUrl,
              durasi: formVideoDurasi || "10:00",
              deskripsi: formVideoDeskripsi,
              poinPembahasan: poinArr.length > 0 ? poinArr : v.poinPembahasan
            }
          : v
      );
      showToast("✅ Video pembelajaran berhasil diperbarui!");
    } else {
      const newItem: VideoPembelajaranItem = {
        id: `video-${Date.now()}`,
        judul: formVideoJudul,
        bab: formVideoBab,
        kelas: formVideoKelas,
        semester: formVideoSemester,
        urlVideo: formVideoUrl,
        durasi: formVideoDurasi || "10:00",
        deskripsi: formVideoDeskripsi,
        poinPembahasan: poinArr.length > 0 ? poinArr : ["Saksikan tayangan materi secara saksama."],
        tanggalDibuat: new Date().toISOString().split("T")[0],
        status: "Dipublikasikan"
      };
      updatedList = [newItem, ...videoList];
      showToast("✨ Video pembelajaran baru berhasil ditambahkan!");
    }

    setVideoList(updatedList);
    DataService.saveVideoList(updatedList);
    setIsVideoModalOpen(false);
  };

  const handleDeleteVideo = (id: string, judul: string) => {
    if (window.confirm(`Hapus video pembelajaran "${judul}"?`)) {
      const updated = videoList.filter((v) => v.id !== id);
      setVideoList(updated);
      DataService.saveVideoList(updated);
      showToast("🗑️ Video pembelajaran berhasil dihapus.");
    }
  };

  // ==================== UPLOAD BERKAS ====================
  const handleOpenUpload = (id: string, tipe: "materi" | "video", judul: string) => {
    setUploadTargetItem({ id, tipe, judul });
    setUploadFileName("");
    setIsUploadModalOpen(true);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      alert("Pilih atau ketikkan nama berkas lampiran!");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (uploadTargetItem?.tipe === "materi") {
        const updated = materiList.map((m) =>
          m.id === uploadTargetItem.id
            ? {
                ...m,
                lampiranFile: {
                  namaFile: uploadFileName,
                  ukuran: "2.5 MB",
                  tipe: (uploadFileName.endsWith(".pdf")
                    ? "pdf"
                    : uploadFileName.endsWith(".ppt") || uploadFileName.endsWith(".pptx")
                    ? "ppt"
                    : "doc") as any
                }
              }
            : m
        );
        setMateriList(updated);
        DataService.saveMateriList(updated);
      } else if (uploadTargetItem?.tipe === "video") {
        const updated = videoList.map((v) =>
          v.id === uploadTargetItem.id
            ? {
                ...v,
                lampiranVideoFile: {
                  namaFile: uploadFileName,
                  ukuran: "75 MB"
                }
              }
            : v
        );
        setVideoList(updated);
        DataService.saveVideoList(updated);
      }

      showToast(`📁 Berkas "${uploadFileName}" berhasil diunggah dan ditautkan!`);
      setIsUploadModalOpen(false);
    }, 700);
  };

  // ==================== PENUGASAN ====================
  const handleOpenPenugasan = (
    id: string,
    tipe: "materi" | "video",
    judul: string,
    kelas: KelasTingkat,
    semester: SemesterTipe
  ) => {
    setTargetForPenugasan({ id, tipe, judul, kelas, semester });
    // Default class based on item
    const matchedClass = classes.find((c) => c.id.startsWith(kelas))?.id || `${kelas}-A`;
    setFormTugasKelasId(matchedClass);
    // Default deadline: 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setFormTugasBatasWaktu(d.toISOString().split("T")[0]);
    setFormTugasInstruksi(
      tipe === "materi"
        ? `Bacalah dan pahami seluruh isi materi "${judul}". Catat dalil dan poin penting di buku catatanmu.`
        : `Tontonlah video pembelajaran "${judul}" sampai selesai. Tuliskan 3 hal penting yang kamu pelajari.`
    );
    setIsPenugasanModalOpen(true);
  };

  const handleSavePenugasan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetForPenugasan) return;

    const newPenugasan: PenugasanBahanAjar = {
      id: `tugas-${Date.now()}`,
      tipe: targetForPenugasan.tipe,
      referensiId: targetForPenugasan.id,
      judul: targetForPenugasan.judul,
      kelasId: formTugasKelasId || "Semua Kelas",
      kelasTingkat: targetForPenugasan.kelas,
      semester: targetForPenugasan.semester,
      instruksi: formTugasInstruksi,
      batasWaktu: formTugasBatasWaktu,
      tanggalTugas: new Date().toISOString().split("T")[0]
    };

    const updated = [newPenugasan, ...penugasanList];
    setPenugasanList(updated);
    DataService.savePenugasanBahanAjar(newPenugasan);

    setIsPenugasanModalOpen(false);
    setActiveSubTab("penugasan");
    showToast(`🚀 Berhasil menugaskan "${targetForPenugasan.judul}" ke Kelas ${newPenugasan.kelasId}!`);
  };

  const handleDeletePenugasan = (id: string, judul: string) => {
    if (window.confirm(`Batalkan / hapus penugasan "${judul}"?`)) {
      const updated = penugasanList.filter((p) => p.id !== id);
      setPenugasanList(updated);
      DataService.deletePenugasanBahanAjar(id);
      showToast("🗑️ Penugasan berhasil dihapus.");
    }
  };

  const handleResetPresets = () => {
    if (
      window.confirm(
        "Kembalikan seluruh materi dan video pembelajaran ke preset bawaan Kurikulum PAI Lengkap?"
      )
    ) {
      DataService.resetBahanAjarAiPresets();
      setMateriList(DataService.getMateriList());
      setVideoList(DataService.getVideoList());
      showToast("✨ Berhasil memulihkan materi & video bawaan kurikulum!");
    }
  };

  // Convert youtube watch URL to embed URL if needed
  const getEmbedYoutubeUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white border border-emerald-500/50 shadow-2xl flex items-center gap-3 animate-slideUp">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Bahan Ajar AI &amp; Penugasan Siswa
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Modul Pembelajaran &amp; Video Edukatif PAI
            </h1>
            <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              Kelola materi teks terstruktur, dalil Al-Qur'an, video pembelajaran interaktif, serta penugasan siswa terkelompok berdasarkan Kelas (VII, VIII, IX) dan Semester (Ganjil &amp; Genap).
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={activeSubTab === "materi" ? handleOpenAddMateri : handleOpenAddVideo}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input {activeSubTab === "materi" ? "Materi Baru" : activeSubTab === "video" ? "Video Baru" : "Data Baru"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (materiList.length > 0) {
                  handleOpenUpload(materiList[0].id, "materi", materiList[0].judul);
                } else if (videoList.length > 0) {
                  handleOpenUpload(videoList[0].id, "video", videoList[0].judul);
                } else {
                  alert("Tambahkan materi atau video terlebih dahulu!");
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/40 shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Berkas</span>
            </button>

            <button
              type="button"
              onClick={handleResetPresets}
              className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Reset ke modul kurikulum awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Bawaan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Learning Sequence Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {/* Tab 1: Materi */}
          <button
            type="button"
            onClick={() => setActiveSubTab("materi")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2.5 transition cursor-pointer ${
              activeSubTab === "materi"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/30 border-b-2 border-amber-400"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <BookOpen className="w-4 h-4" />
            <span>1. Materi Pembelajaran</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-900/80 text-emerald-200 ml-1">
              {materiList.length}
            </span>
          </button>

          {/* Tab 2: Video */}
          <button
            type="button"
            onClick={() => setActiveSubTab("video")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2.5 transition cursor-pointer ${
              activeSubTab === "video"
                ? "bg-purple-700 text-white shadow-md shadow-purple-900/30 border-b-2 border-amber-400"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <span className="w-5 h-5 rounded-md bg-purple-950 text-purple-300 text-[10px] font-black flex items-center justify-center">
              2
            </span>
            <Video className="w-4 h-4" />
            <span>2. Video Pembelajaran</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-900/80 text-purple-200 ml-1">
              {videoList.length}
            </span>
          </button>

          {/* Tab 3: Penugasan */}
          <button
            type="button"
            onClick={() => setActiveSubTab("penugasan")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2.5 transition cursor-pointer ${
              activeSubTab === "penugasan"
                ? "bg-amber-600 text-slate-950 shadow-md shadow-amber-900/30 border-b-2 border-slate-950"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Penugasan Siswa</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950/20 text-amber-900 dark:text-amber-300 ml-1 font-mono font-bold">
              {penugasanList.length}
            </span>
          </button>
        </div>

        {/* Quick info */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filter Kelas &amp; Semester aktif di bawah</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter Kelas */}
          <div className="flex items-center gap-1.5">
            <label htmlFor={filterKelasId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kelas:
            </label>
            <select
              id={filterKelasId}
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="VII">Kelas VII (7)</option>
              <option value="VIII">Kelas VIII (8)</option>
              <option value="IX">Kelas IX (9)</option>
            </select>
          </div>

          {/* Filter Semester */}
          <div className="flex items-center gap-1.5">
            <label htmlFor={filterSemesterId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Semester:
            </label>
            <select
              id={filterSemesterId}
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Semester</option>
              <option value="Ganjil">Semester Ganjil (1)</option>
              <option value="Genap">Semester Genap (2)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <label htmlFor={searchInputId} className="sr-only">
            Cari materi, bab, topik...
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id={searchInputId}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, bab, topik..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SUB-TAB: MATERI PEMBELAJARAN (URUTAN 1)               */}
      {/* ======================================================== */}
      {activeSubTab === "materi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-900 text-emerald-300 text-xs font-black flex items-center justify-center">
                1
              </span>
              <span>Daftar Materi Pembelajaran PAI ({filteredMateri.length})</span>
            </h2>
            <button
              type="button"
              onClick={handleOpenAddMateri}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Materi Baru</span>
            </button>
          </div>

          {filteredMateri.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Tidak ada materi pembelajaran yang cocok dengan filter.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Silakan ganti filter Kelas/Semester atau buat materi baru menggunakan tombol di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMateri.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                          Kelas {item.kelas}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          Semester {item.semester}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.tanggalDibuat}
                      </span>
                    </div>

                    {/* Judul & Bab */}
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {item.bab}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Dalil Quran Snippet */}
                    {item.dalilQuran && (
                      <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Dalil Rujukan: {item.dalilQuran.surah} {item.dalilQuran.ayat ? `:${item.dalilQuran.ayat}` : ""}
                        </span>
                        <p className="text-xs font-arabic text-right text-slate-800 dark:text-slate-200 mt-1 font-bold">
                          {item.dalilQuran.arab}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic mt-1 line-clamp-2">
                          "{item.dalilQuran.arti}"
                        </p>
                      </div>
                    )}

                    {/* Lampiran berkas */}
                    {item.lampiranFile && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                            {item.lampiranFile.namaFile}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({item.lampiranFile.ukuran || "1.2 MB"})
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase">Lampiran</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Tugaskan, Baca, Edit, Upload, Hapus */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenPenugasan(item.id, "materi", item.judul, item.kelas, item.semester)
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
                        title="Tugaskan materi ini ke kelas"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Tugaskan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewDetailItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                        title="Baca materi lengkap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Baca</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload(item.id, "materi", item.judul)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition cursor-pointer"
                        title="Upload/Ganti berkas lampiran"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditMateri(item)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition cursor-pointer"
                        title="Edit materi"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMateri(item.id, item.judul)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Hapus materi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUB-TAB: VIDEO PEMBELAJARAN (URUTAN 2)                */}
      {/* ======================================================== */}
      {activeSubTab === "video" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-900 text-purple-300 text-xs font-black flex items-center justify-center">
                2
              </span>
              <span>Daftar Video Pembelajaran PAI ({filteredVideo.length})</span>
            </h2>
            <button
              type="button"
              onClick={handleOpenAddVideo}
              className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Video Baru</span>
            </button>
          </div>

          {filteredVideo.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Tidak ada video pembelajaran yang cocok dengan filter.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Silakan ganti filter Kelas/Semester atau tambahkan video baru menggunakan tombol di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredVideo.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Video Player Preview / Thumbnail */}
                    <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                      <iframe
                        src={getEmbedYoutubeUrl(item.urlVideo)}
                        title={item.judul}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                        {item.durasi}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold text-[11px] border border-purple-200 dark:border-purple-800/60">
                            Kelas {item.kelas}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                            Semester {item.semester}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.tanggalDibuat}
                        </span>
                      </div>

                      {/* Judul & Bab */}
                      <div>
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                          {item.bab}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          {item.judul}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.deskripsi}
                        </p>
                      </div>

                      {/* Poin Pembahasan */}
                      {item.poinPembahasan && item.poinPembahasan.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Fokus Pembahasan:
                          </span>
                          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                            {item.poinPembahasan.slice(0, 2).map((p, idx) => (
                              <li key={idx} className="truncate">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Lampiran berkas video */}
                      {item.lampiranVideoFile && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Film className="w-4 h-4 text-purple-600 shrink-0" />
                            <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                              {item.lampiranVideoFile.namaFile}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              ({item.lampiranVideoFile.ukuran || "45 MB"})
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-purple-600 uppercase">Berkas</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenPenugasan(item.id, "video", item.judul, item.kelas, item.semester)
                        }
                        className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
                        title="Tugaskan video ini ke kelas"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Tugaskan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewVideoItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                        title="Tonton video layar penuh"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Tonton</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload(item.id, "video", item.judul)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-600 transition cursor-pointer"
                        title="Upload/Ganti berkas video"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditVideo(item)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition cursor-pointer"
                        title="Edit video"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(item.id, item.judul)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Hapus video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUB-TAB: PENUGASAN SISWA                              */}
      {/* ======================================================== */}
      {activeSubTab === "penugasan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-500" />
                <span>Daftar Penugasan Bahan Ajar ({penugasanList.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau materi dan video yang telah dibagikan kepada peserta didik.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (materiList.length > 0) {
                  handleOpenPenugasan(
                    materiList[0].id,
                    "materi",
                    materiList[0].judul,
                    materiList[0].kelas,
                    materiList[0].semester
                  );
                } else {
                  alert("Tambahkan materi terlebih dahulu!");
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tugas Baru</span>
            </button>
          </div>

          {penugasanList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Belum ada bahan ajar yang ditugaskan ke siswa.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Buka tab Materi atau Video lalu klik tombol "Tugaskan" pada kartu modul yang ingin dibagikan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {penugasanList.map((tugas) => (
                <div
                  key={tugas.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800/60">
                        Kelas: {tugas.kelasId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tugas.tipe === "materi" ? "📚 Materi" : "🎬 Video"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {tugas.judul}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                        "{tugas.instruksi}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ditugaskan: {tugas.tanggalTugas}</span>
                      </div>
                      <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Tenggat: {tugas.batasWaktu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Aktif di Ruang Belajar Siswa
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeletePenugasan(tugas.id, tugas.judul)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      Batalkan Tugas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: INPUT / EDIT MATERI                               */}
      {/* ======================================================== */}
      {isMateriModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8 relative">
            <button
              type="button"
              onClick={() => setIsMateriModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>{editingMateri ? "Edit Materi Pembelajaran" : "Input Materi Pembelajaran Baru"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi informasi materi, kelas, semester, dalil rujukan, dan teks lengkap.
            </p>

            <form onSubmit={handleSaveMateri} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas Target *
                  </label>
                  <select
                    value={formMateriKelas}
                    onChange={(e) => setFormMateriKelas(e.target.value as KelasTingkat)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="VII">Kelas VII (7)</option>
                    <option value="VIII">Kelas VIII (8)</option>
                    <option value="IX">Kelas IX (9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formMateriSemester}
                    onChange={(e) => setFormMateriSemester(e.target.value as SemesterTipe)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Ganjil">Semester Ganjil (1)</option>
                    <option value="Genap">Semester Genap (2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bab / Topik Pembelajaran *
                </label>
                <input
                  type="text"
                  value={formMateriBab}
                  onChange={(e) => setFormMateriBab(e.target.value)}
                  placeholder="Contoh: Bab 1: Menghadirkan Shalat dan Dzikir"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Materi Pembelajaran *
                </label>
                <input
                  type="text"
                  value={formMateriJudul}
                  onChange={(e) => setFormMateriJudul(e.target.value)}
                  placeholder="Contoh: Meneladani 4 Asmaul Husna dalam Kehidupan"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Ringkasan Singkat
                </label>
                <textarea
                  rows={2}
                  value={formMateriDeskripsi}
                  onChange={(e) => setFormMateriDeskripsi(e.target.value)}
                  placeholder="Ringkasan isi modul pembelajaran..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Dalil Section */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                  Dalil Al-Qur'an / Hadis Rujukan (Opsional)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formMateriSurah}
                    onChange={(e) => setFormMateriSurah(e.target.value)}
                    placeholder="Nama Surah (mis: QS. Al-An'am)"
                    className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={formMateriAyat}
                    onChange={(e) => setFormMateriAyat(e.target.value)}
                    placeholder="Ayat (mis: 59)"
                    className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formMateriArab}
                  onChange={(e) => setFormMateriArab(e.target.value)}
                  placeholder="Teks Arab ayat/hadits..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-arabic text-right bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={formMateriArti}
                  onChange={(e) => setFormMateriArti(e.target.value)}
                  placeholder="Terjemahan arti ayat/hadits..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Materi Pembelajaran Lengkap *
                </label>
                <textarea
                  rows={6}
                  value={formMateriIsi}
                  onChange={(e) => setFormMateriIsi(e.target.value)}
                  placeholder="Tuliskan materi pelajaran komprehensif..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Poin Kunci / Kesimpulan (1 poin per baris)
                </label>
                <textarea
                  rows={3}
                  value={formMateriPoin}
                  onChange={(e) => setFormMateriPoin(e.target.value)}
                  placeholder="Tuliskan poin kunci materi, pisahkan tiap baris..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMateriModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: INPUT / EDIT VIDEO                                */}
      {/* ======================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl my-8 relative">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              <span>{editingVideo ? "Edit Video Pembelajaran" : "Input Video Pembelajaran Baru"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan URL video YouTube atau berkas MP4 pembelajaran PAI.
            </p>

            <form onSubmit={handleSaveVideo} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas *
                  </label>
                  <select
                    value={formVideoKelas}
                    onChange={(e) => setFormVideoKelas(e.target.value as KelasTingkat)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="VII">Kelas VII (7)</option>
                    <option value="VIII">Kelas VIII (8)</option>
                    <option value="IX">Kelas IX (9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formVideoSemester}
                    onChange={(e) => setFormVideoSemester(e.target.value as SemesterTipe)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Ganjil">Semester Ganjil (1)</option>
                    <option value="Genap">Semester Genap (2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bab / Topik *
                </label>
                <input
                  type="text"
                  value={formVideoBab}
                  onChange={(e) => setFormVideoBab(e.target.value)}
                  placeholder="Contoh: Bab 2: Meneladani Ketaatan Malaikat"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Video *
                </label>
                <input
                  type="text"
                  value={formVideoJudul}
                  onChange={(e) => setFormVideoJudul(e.target.value)}
                  placeholder="Contoh: Video Eksplorasi 10 Malaikat Allah"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Video (YouTube / MP4) *
                  </label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Video
                  </label>
                  <input
                    type="text"
                    value={formVideoDurasi}
                    onChange={(e) => setFormVideoDurasi(e.target.value)}
                    placeholder="12:30"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Video
                </label>
                <textarea
                  rows={2}
                  value={formVideoDeskripsi}
                  onChange={(e) => setFormVideoDeskripsi(e.target.value)}
                  placeholder="Ringkasan tayangan video..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Poin Pembahasan Video (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  value={formVideoPoin}
                  onChange={(e) => setFormVideoPoin(e.target.value)}
                  placeholder="Contoh: Studi kasus kejujuran..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  Simpan Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: UPLOAD BERKAS LAMPIRAN                            */}
      {/* ======================================================== */}
      {isUploadModalOpen && uploadTargetItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <span>Upload Berkas Lampiran</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              Untuk: <span className="font-bold text-slate-700 dark:text-slate-300">{uploadTargetItem.judul}</span>
            </p>

            <form onSubmit={handleSimulateUpload} className="space-y-4 mt-5">
              <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2">
                <FileUp className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pilih atau drag &amp; drop file dokumen / video
                </p>
                <p className="text-[10px] text-slate-400">
                  Mendukung berkas PDF, DOCX, PPTX, MP4, atau Gambar Rangkuman
                </p>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                  id="file-upload-input"
                />
                <label
                  htmlFor="file-upload-input"
                  className="inline-block px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow transition mt-2"
                >
                  Pilih Berkas Komputer
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Berkas Terpilih:
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="Contoh: Modul_Pembelajaran_PAI_Lengkap.pdf"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <span>Mengunggah...</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PENUGASAN KE SISWA                                */}
      {/* ======================================================== */}
      {isPenugasanModalOpen && targetForPenugasan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsPenugasanModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider">
              <Send className="w-4 h-4" />
              <span>Penugasan Bahan Ajar ke Siswa</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
              {targetForPenugasan.judul}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih kelas tujuan, tenggat penyelesaian, dan tuliskan instruksi tugas.
            </p>

            <form onSubmit={handleSavePenugasan} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kelas Tujuan Penugasan *
                </label>
                <select
                  value={formTugasKelasId}
                  onChange={(e) => setFormTugasKelasId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  required
                >
                  <option value={`${targetForPenugasan.kelas}-A`}>Kelas {targetForPenugasan.kelas}-A</option>
                  <option value={`${targetForPenugasan.kelas}-B`}>Kelas {targetForPenugasan.kelas}-B</option>
                  <option value={`Semua Kelas ${targetForPenugasan.kelas}`}>
                    Semua Kelas {targetForPenugasan.kelas}
                  </option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batas Waktu Penyelesaian (Tenggat) *
                </label>
                <input
                  type="date"
                  value={formTugasBatasWaktu}
                  onChange={(e) => setFormTugasBatasWaktu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instruksi Guru untuk Siswa *
                </label>
                <textarea
                  rows={3}
                  value={formTugasInstruksi}
                  onChange={(e) => setFormTugasInstruksi(e.target.value)}
                  placeholder="Tuliskan arahan tugas yang harus dikerjakan siswa..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPenugasanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Penugasan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DETAIL BACA MATERI LENGKAP                        */}
      {/* ======================================================== */}
      {viewDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl my-8 relative">
            <button
              type="button"
              onClick={() => setViewDetailItem(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
              <span>Kelas {viewDetailItem.kelas}</span>
              <span>•</span>
              <span>Semester {viewDetailItem.semester}</span>
              <span>•</span>
              <span>{viewDetailItem.bab}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {viewDetailItem.judul}
            </h2>

            {/* Dalil */}
            {viewDetailItem.dalilQuran && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 my-4 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Dalil Naqli: {viewDetailItem.dalilQuran.surah} {viewDetailItem.dalilQuran.ayat ? `:${viewDetailItem.dalilQuran.ayat}` : ""}
                </span>
                <p className="text-lg font-arabic text-right text-slate-900 dark:text-slate-100 font-bold leading-loose">
                  {viewDetailItem.dalilQuran.arab}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{viewDetailItem.dalilQuran.arti}"
                </p>
              </div>
            )}

            {/* Isi Materi */}
            <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line py-2">
              {viewDetailItem.isiMateri}
            </div>

            {/* Poin Kunci */}
            {viewDetailItem.poinKunci && viewDetailItem.poinKunci.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Poin Kunci Pembelajaran:
                </span>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {viewDetailItem.poinKunci.map((pk, idx) => (
                    <li key={idx}>{pk}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const itm = viewDetailItem;
                  setViewDetailItem(null);
                  handleOpenPenugasan(itm.id, "materi", itm.judul, itm.kelas, itm.semester);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tugaskan ke Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TONTON VIDEO LENGKAP                              */}
      {/* ======================================================== */}
      {viewVideoItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative text-white space-y-4">
            <button
              type="button"
              onClick={() => setViewVideoItem(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <span>Kelas {viewVideoItem.kelas}</span>
                <span>•</span>
                <span>Semester {viewVideoItem.semester}</span>
                <span>•</span>
                <span>{viewVideoItem.durasi}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {viewVideoItem.judul}
              </h2>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={getEmbedYoutubeUrl(viewVideoItem.urlVideo)}
                title={viewVideoItem.judul}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {viewVideoItem.deskripsi}
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const itm = viewVideoItem;
                  setViewVideoItem(null);
                  handleOpenPenugasan(itm.id, "video", itm.judul, itm.kelas, itm.semester);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tugaskan Video Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setViewVideoItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
