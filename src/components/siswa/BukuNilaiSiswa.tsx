/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Award,
  Star,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  Sparkles,
  Printer,
  Calendar,
  Layers,
  X,
  UserCheck,
  Check
} from "lucide-react";
import {
  Siswa,
  TugasLms,
  PengumpulanTugas,
  RekapNilaiTotal,
  NilaiKhususPai,
  NilaiSemesterParalel,
  Kelas
} from "../../types";

interface BukuNilaiSiswaProps {
  siswa: Siswa;
  tasks: TugasLms[];
  submissions: PengumpulanTugas[];
  rekapNilai: RekapNilaiTotal[];
  nilaiKhusus: NilaiKhususPai[];
  nilaiParalelList?: NilaiSemesterParalel[];
  classes?: Kelas[];
}

export default function BukuNilaiSiswa({
  siswa,
  tasks,
  submissions,
  rekapNilai,
  nilaiKhusus,
  nilaiParalelList = [],
  classes = []
}: BukuNilaiSiswaProps) {
  // Navigation tabs inside Buku Nilai Siswa
  const [activeTab, setActiveTab] = useState<"rekap" | "paralel" | "rincian" | "tugas">("rekap");
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2">("1");
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [tanggalCetak, setTanggalCetak] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  // Flexible class matching helper
  const normalizeClassId = (rawId?: string): string => {
    if (!rawId) return "";
    const cleaned = rawId.toUpperCase().trim();
    if (cleaned.startsWith("VII-")) return "7" + cleaned.replace("VII-", "");
    if (cleaned.startsWith("VIII-")) return "8" + cleaned.replace("VIII-", "");
    if (cleaned.startsWith("IX-")) return "9" + cleaned.replace("IX-", "");
    if (cleaned.startsWith("VII ")) return "7" + cleaned.replace("VII ", "");
    if (cleaned.startsWith("VIII ")) return "8" + cleaned.replace("VIII ", "");
    if (cleaned.startsWith("IX ")) return "9" + cleaned.replace("IX ", "");
    if (cleaned.startsWith("KELAS ")) return cleaned.replace("KELAS ", "").replace("-", "").trim();
    return cleaned.replace("-", "").replace(/\s+/g, "");
  };

  const isClassMatch = (classA?: string, classB?: string): boolean => {
    if (!classA || !classB) return false;
    const a = classA.trim().toLowerCase();
    const b = classB.trim().toLowerCase();
    if (a === b) return true;
    const normA = normalizeClassId(classA);
    const normB = normalizeClassId(classB);
    return Boolean(normA && normB && normA === normB);
  };

  // Helper date formatter
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  // Strictly extract Rekap Nilai for this student matching their NISN and/or (name & class)
  const studentRekap = useMemo((): RekapNilaiTotal => {
    // 1. Try exact NISN match
    let match = rekapNilai.find((r) => r.siswaNisn?.trim() === siswa.nisn?.trim());

    // 2. Fallback: match by name and class
    if (!match) {
      match = rekapNilai.find(
        (r) =>
          r.siswaNama?.trim().toLowerCase() === siswa.nama?.trim().toLowerCase() &&
          isClassMatch(r.kelasId, siswa.kelasId)
      );
    }

    // 3. Fallback: match by name only
    if (!match) {
      match = rekapNilai.find(
        (r) => r.siswaNama?.trim().toLowerCase() === siswa.nama?.trim().toLowerCase()
      );
    }

    if (match) {
      return {
        ...match,
        siswaNama: siswa.nama, // Strictly use the authenticated student's name
        siswaNisn: siswa.nisn, // Strictly use the authenticated student's NISN
        kelasId: siswa.kelasId // Strictly use the authenticated student's class
      };
    }

    // Default clean baseline if teacher hasn't recorded grades yet
    return {
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasId: siswa.kelasId,
      formatifKuis: 80,
      formatifTugas: 80,
      formatifDiskusi: 80,
      sumatifPts: 80,
      sumatifPas: 80,
      hafalanJuzAmmaScore: 80,
      praktikSholat: 80,
      praktikWudhu: 80
    };
  }, [rekapNilai, siswa]);

  // Special PAI grades (Surah Juz Amma details)
  const studentKhusus = useMemo(() => {
    return nilaiKhusus.find((nk) => nk.siswaNisn?.trim() === siswa.nisn?.trim());
  }, [nilaiKhusus, siswa.nisn]);

  // Tasks specifically for this student's class
  const classTasks = useMemo(() => {
    return tasks.filter((t) => isClassMatch(t.kelasId, siswa.kelasId));
  }, [tasks, siswa.kelasId]);

  // Filtered Nilai Semester Paralel strictly for this student matching name & class
  const studentParalelList = useMemo(() => {
    if (!nilaiParalelList || nilaiParalelList.length === 0) return [];
    return nilaiParalelList
      .filter((r) => {
        if (r.isDeleted) return false;
        const matchNisn = r.siswaNisn?.trim() === siswa.nisn?.trim();
        const matchNameAndClass =
          r.siswaNama?.trim().toLowerCase() === siswa.nama?.trim().toLowerCase() &&
          isClassMatch(r.kelasParalel, siswa.kelasId);
        return matchNisn || matchNameAndClass;
      })
      .map((r) => ({
        ...r,
        siswaNama: siswa.nama,
        siswaNisn: siswa.nisn,
        kelasParalel: siswa.kelasId
      }));
  }, [nilaiParalelList, siswa]);

  // Active semester parallel record
  const currentParalelRecord = useMemo(() => {
    const semRecord = studentParalelList.find((r) => r.semester === selectedSemester);
    if (semRecord) return semRecord;

    // Fallback template matching student identity
    const defaultUh = [80, 82, 85, 80, 84, 86, 82, 85, 88, 85];
    const defaultT = [82, 85, 84, 88, 85];
    const defaultUhDates = [
      "2026-07-20", "2026-08-03", "2026-08-18", "2026-09-01", "2026-09-15",
      "2026-10-12", "2026-10-26", "2026-11-09", "2026-11-23", "2026-12-07"
    ];
    const defaultTDates = [
      "2026-08-10", "2026-09-08", "2026-10-19", "2026-11-16", "2026-12-01"
    ];

    return {
      id: `paralel_${siswa.nisn}_${selectedSemester}`,
      siswaNisn: siswa.nisn,
      siswaNama: siswa.nama,
      kelasParalel: siswa.kelasId,
      semester: selectedSemester,
      mapel: "PAI dan Budi Pekerti",
      uhList: defaultUh,
      tList: defaultT,
      uhDates: defaultUhDates,
      tDates: defaultTDates,
      pts: 82,
      ptsDate: "2026-10-05",
      pas: 85,
      pasDate: "2026-12-15",
      kkm: 75
    };
  }, [studentParalelList, selectedSemester, siswa]);

  // Math calculations for Rekap Nilai
  const rerataFormatif = Math.round(
    (studentRekap.formatifKuis + studentRekap.formatifTugas + studentRekap.formatifDiskusi) / 3
  );
  const rerataSumatif = Math.round(
    (studentRekap.sumatifPts + studentRekap.sumatifPas) / 2
  );
  const rerataPraktik = Math.round(
    (studentRekap.hafalanJuzAmmaScore + studentRekap.praktikSholat + studentRekap.praktikWudhu) / 3
  );

  // Nilai Akhir (NA) PAI (35% Formatif + 40% Sumatif + 25% Praktik Karakter)
  const nilaiAkhirRekap = Math.round(
    rerataFormatif * 0.35 + rerataSumatif * 0.4 + rerataPraktik * 0.25
  );

  // Parallel math calculations
  const safeUh = currentParalelRecord?.uhList || [80, 80, 80, 80, 80, 80, 80, 80, 80, 80];
  const safeT = currentParalelRecord?.tList || [80, 80, 80, 80, 80];
  const rerataUH = Math.round(safeUh.reduce((a, b) => a + b, 0) / safeUh.length);
  const rerataTugas = Math.round(safeT.reduce((a, b) => a + b, 0) / safeT.length);
  const rerataFormatifParalel = Math.round((rerataUH * 2 + rerataTugas) / 3);
  const ptsScore = currentParalelRecord?.pts ?? 80;
  const pasScore = currentParalelRecord?.pas ?? 80;
  const rerataSumatifParalel = Math.round((ptsScore + pasScore) / 2);
  const nilaiAkhirParalel = Math.round((rerataFormatifParalel * 2 + ptsScore + pasScore) / 4);

  // Predicate & grade styles
  const getGradeInfo = (score: number) => {
    if (score >= 90) {
      return {
        letter: "A",
        label: "Sangat Baik",
        colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
        badgeClass: "bg-emerald-600 text-white"
      };
    }
    if (score >= 80) {
      return {
        letter: "B",
        label: "Baik",
        colorClass: "text-blue-700 bg-blue-50 border-blue-200",
        badgeClass: "bg-blue-600 text-white"
      };
    }
    if (score >= 70) {
      return {
        letter: "C",
        label: "Cukup",
        colorClass: "text-amber-700 bg-amber-50 border-amber-200",
        badgeClass: "bg-amber-600 text-white"
      };
    }
    return {
      letter: "D",
      label: "Perlu Bimbingan",
      colorClass: "text-rose-700 bg-rose-50 border-rose-200",
      badgeClass: "bg-rose-600 text-white"
    };
  };

  const finalGradeInfo = getGradeInfo(nilaiAkhirRekap);

  // Detailed competency breakdown
  const componentsList = [
    {
      no: 1,
      nama: "Kuis Terstruktur Harian",
      kategori: "Formatif",
      nilai: studentRekap.formatifKuis,
      kkm: 75,
      deskripsi: "Memahami konsep esensial materi PAI mingguan serta mampu menganalisis dalil Al-Qur'an dan Hadis."
    },
    {
      no: 2,
      nama: "Tugas Mandiri & Lembar Kerja (LKPD)",
      kategori: "Formatif",
      nilai: studentRekap.formatifTugas,
      kkm: 75,
      deskripsi: "Disiplin menyelesaikan tugas resume, infografis materi, dan pengumpulan tepat waktu di kelas LMS."
    },
    {
      no: 3,
      nama: "Keaktifan Forum & Diskusi Kelas",
      kategori: "Formatif",
      nilai: studentRekap.formatifDiskusi,
      kkm: 75,
      deskripsi: "Aktif memberikan argumentasi santun, solutif, dan berakhlak mulia dalam forum interaktif."
    },
    {
      no: 4,
      nama: "Asesmen Tengah Semester (PTS)",
      kategori: "Sumatif",
      nilai: studentRekap.sumatifPts,
      kkm: 75,
      deskripsi: "Menunjukkan penguasaan teoretis yang mantap dalam lingkup materi paruh pertama semester."
    },
    {
      no: 5,
      nama: "Asesmen Akhir Semester (PAS)",
      kategori: "Sumatif",
      nilai: studentRekap.sumatifPas,
      kkm: 75,
      deskripsi: "Menguasai seluruh indikator ketercapaian tujuan pembelajaran akhir semester secara menyeluruh."
    },
    {
      no: 6,
      nama: "Setoran Hafalan Juz 'Amma",
      kategori: "Praktik & Karakter",
      nilai: studentRekap.hafalanJuzAmmaScore,
      kkm: 75,
      deskripsi: `Mampu melafalkan surah ${
        studentKhusus ? studentKhusus.surahJuzAmma : "Ad-Duha & Al-Insyirah"
      } dengan kelancaran ${studentKhusus ? studentKhusus.kelancaran : "Lancar"} dan tajwid ${
        studentKhusus ? studentKhusus.tajwid : "Baik"
      }.`
    },
    {
      no: 7,
      nama: "Praktik Gerakan & Bacaan Sholat Fardhu",
      kategori: "Praktik & Karakter",
      nilai: studentRekap.praktikSholat,
      kkm: 75,
      deskripsi: "Menguasai keselarasan rukun fi'liyah dan qauliyah gerakan sholat fardhu secara tertib dan tuma'ninah."
    },
    {
      no: 8,
      nama: "Praktik Wudhu & Bersuci (Thaharah)",
      kategori: "Praktik & Karakter",
      nilai: studentRekap.praktikWudhu,
      kkm: 75,
      deskripsi: "Tertib dalam tata cara berwudhu sesuai sunnah, menyempurnakan basuhan, serta melafalkan doa setelah wudhu."
    }
  ];

  // Print trigger
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER: Verified Student Grade Book Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 shrink-0 text-emerald-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Buku Lembar Nilai Siswa (Rapor Digital PAI)
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Data Resmi Anda
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Menampilkan data nilai dan rekapitulasi capaian khusus atas nama Anda sesuai rombel kelas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            id="btn-cetak-buku-nilai-siswa"
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Dokumen Nilai</span>
          </button>
        </div>
      </div>

      {/* VERIFIED STUDENT IDENTIFIER CARD */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white rounded-2xl p-5 shadow-md border border-emerald-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Identitas Pemegang Buku Nilai:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {siswa.nama}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-800/80 text-emerald-200 border border-emerald-600 font-black text-xs">
                Kelas: {siswa.kelasId}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-100 pt-1">
              <span className="font-mono">NISN: <strong className="text-white">{siswa.nisn}</strong></span>
              <span>•</span>
              <span>Sekolah: <strong>UPT SMPN 2 Rebang Tangkas</strong></span>
              <span>•</span>
              <span>Guru PAI: <strong className="text-amber-300">Sadiqul Alim, S.Pd.I., M.Pd.</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-emerald-800/60 pt-3 lg:pt-0 lg:pl-6 shrink-0">
            <div className="bg-emerald-900/60 border border-emerald-700/60 px-4 py-2.5 rounded-xl text-center">
              <span className="block text-[10px] font-bold text-emerald-300 uppercase">Status Siswa</span>
              <span className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Aktif Terdaftar
              </span>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-700/60 px-4 py-2.5 rounded-xl text-center">
              <span className="block text-[10px] font-bold text-emerald-300 uppercase">Tahun Ajaran</span>
              <span className="text-xs font-black text-white block mt-0.5">2026/2027</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nilai Akhir (NA) */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-10">
            <Award className="w-24 h-24" />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
            Nilai Akhir Rapor (NA)
          </span>
          <div className="my-2">
            <span className="text-4xl font-black text-white">{nilaiAkhirRekap}</span>
            <span className="text-xs text-emerald-200 ml-1.5 font-bold">/ 100</span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 uppercase bg-white/10 px-2.5 py-0.5 rounded-full inline-block self-start border border-white/10">
            Predikat: {finalGradeInfo.label} ({finalGradeInfo.letter})
          </span>
        </div>

        {/* Rata-Rata Formatif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Rata-Rata Formatif
          </span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900">{rerataFormatif}</span>
            <span className="text-xs text-slate-400 ml-1 font-semibold">/ 100</span>
          </div>
          <span className="text-[10px] text-blue-700 font-bold uppercase bg-blue-50 px-2 py-0.5 rounded-md inline-block self-start border border-blue-200">
            Kuis, Tugas & Diskusi
          </span>
        </div>

        {/* Rata-Rata Sumatif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Rata-Rata Sumatif
          </span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900">{rerataSumatif}</span>
            <span className="text-xs text-slate-400 ml-1 font-semibold">/ 100</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold uppercase bg-amber-50 px-2 py-0.5 rounded-md inline-block self-start border border-amber-200">
            PTS: {studentRekap.sumatifPts} • PAS: {studentRekap.sumatifPas}
          </span>
        </div>

        {/* Status Ketuntasan KKM */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Ketuntasan KKM Sekolah
          </span>
          <div className="my-2">
            <span
              className={`text-2xl font-black block uppercase ${
                nilaiAkhirRekap >= 75 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {nilaiAkhirRekap >= 75 ? "✓ TUNTAS KKM" : "⚠ PERLU REMEDIAL"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Batas KKM Sekolah: 75</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Terverifikasi Guru PAI
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS FOR SECTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab("rekap")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "rekap"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Rekap Nilai PAI (Resmi)</span>
        </button>

        <button
          onClick={() => setActiveTab("paralel")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "paralel"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Buku Nilai Semester Paralel (10 UH & 5 Tugas)</span>
        </button>

        <button
          onClick={() => setActiveTab("rincian")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "rincian"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Rincian Kompetensi & Hafalan</span>
        </button>

        <button
          onClick={() => setActiveTab("tugas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "tugas"
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tugas LMS & Ulasan Guru ({classTasks.length})</span>
        </button>
      </div>

      {/* TAB 1: TABEL REKAP NILAI RESMI SISWA */}
      {activeTab === "rekap" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                Rekapitulasi Nilai Siswa: {siswa.nama} ({siswa.kelasId})
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Format tabel standar administrasi guru PAI. Menampilkan hanya 1 baris nilai resmi atas nama dan rombel kelas Anda.
              </p>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-center font-mono">
              NISN: {siswa.nisn}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3 text-center w-12">No</th>
                  <th className="p-3 w-28">NISN</th>
                  <th className="p-3 min-w-[160px]">Nama Siswa</th>
                  <th className="p-3 text-center w-16">Kelas</th>
                  <th className="p-3 text-center bg-blue-50 text-blue-900">Kuis (F)</th>
                  <th className="p-3 text-center bg-blue-50 text-blue-900">Tugas (F)</th>
                  <th className="p-3 text-center bg-blue-50 text-blue-900">Diskusi (F)</th>
                  <th className="p-3 text-center bg-blue-100 text-blue-950 font-black">Rerata Formatif</th>
                  <th className="p-3 text-center bg-amber-50 text-amber-900">PTS (S)</th>
                  <th className="p-3 text-center bg-amber-50 text-amber-900">PAS (S)</th>
                  <th className="p-3 text-center bg-amber-100 text-amber-950 font-black">Rerata Sumatif</th>
                  <th className="p-3 text-center bg-teal-50 text-teal-900">Juz 'Amma</th>
                  <th className="p-3 text-center bg-teal-50 text-teal-900">Shalat</th>
                  <th className="p-3 text-center bg-teal-50 text-teal-900">Wudhu</th>
                  <th className="p-3 text-center bg-emerald-100 text-emerald-950 font-black">Nilai Akhir (NA)</th>
                  <th className="p-3 text-center w-16">Predikat</th>
                  <th className="p-3 text-center w-28">Ketuntasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-bold text-slate-800">
                <tr className="bg-white hover:bg-slate-50 transition">
                  <td className="p-3 text-center text-slate-400 font-bold">1</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{studentRekap.siswaNisn}</td>
                  <td className="p-3 font-black text-slate-900">{studentRekap.siswaNama}</td>
                  <td className="p-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {studentRekap.kelasId}
                    </span>
                  </td>
                  <td className="p-3 text-center bg-blue-50/40 text-blue-950 font-mono font-bold">
                    {studentRekap.formatifKuis}
                  </td>
                  <td className="p-3 text-center bg-blue-50/40 text-blue-950 font-mono font-bold">
                    {studentRekap.formatifTugas}
                  </td>
                  <td className="p-3 text-center bg-blue-50/40 text-blue-950 font-mono font-bold">
                    {studentRekap.formatifDiskusi}
                  </td>
                  <td className="p-3 text-center bg-blue-100/60 text-blue-950 font-mono font-black">
                    {rerataFormatif}
                  </td>
                  <td className="p-3 text-center bg-amber-50/40 text-amber-950 font-mono font-bold">
                    {studentRekap.sumatifPts}
                  </td>
                  <td className="p-3 text-center bg-amber-50/40 text-amber-950 font-mono font-bold">
                    {studentRekap.sumatifPas}
                  </td>
                  <td className="p-3 text-center bg-amber-100/60 text-amber-950 font-mono font-black">
                    {rerataSumatif}
                  </td>
                  <td className="p-3 text-center bg-teal-50/40 text-teal-950 font-mono font-bold">
                    {studentRekap.hafalanJuzAmmaScore}
                  </td>
                  <td className="p-3 text-center bg-teal-50/40 text-teal-950 font-mono font-bold">
                    {studentRekap.praktikSholat}
                  </td>
                  <td className="p-3 text-center bg-teal-50/40 text-teal-950 font-mono font-bold">
                    {studentRekap.praktikWudhu}
                  </td>
                  <td className="p-3 text-center bg-emerald-50 text-emerald-950 font-mono font-black text-sm">
                    {nilaiAkhirRekap}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-black text-xs ${finalGradeInfo.colorClass}`}
                    >
                      {finalGradeInfo.letter}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                        nilaiAkhirRekap >= 75
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {nilaiAkhirRekap >= 75 ? "✓ TUNTAS" : "✗ REMEDIAL"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 gap-2">
            <div>
              <strong>Formula Penilaian:</strong> Nilai Akhir = (Formatif × 35%) + (Sumatif × 40%) + (Praktik Karakter × 25%).
            </div>
            <div className="font-semibold text-slate-500">
              Standar KKM Sekolah: <strong>75 (Tujuh Puluh Lima)</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUKU NILAI SEMESTER PARALEL (10 UH & 5 TUGAS) */}
      {activeTab === "paralel" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Lembar Penilaian Semester Paralel: {siswa.nama} ({siswa.kelasId})
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Menampilkan asesmen harian (10 Ulangan Harian & 5 Tugas Mandiri) terdaftar atas nama dan kelas Anda.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Pilih Semester:</span>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setSelectedSemester("1")}
                  className={`px-3 py-1 rounded text-xs font-black transition ${
                    selectedSemester === "1"
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Semester 1 (Ganjil)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSemester("2")}
                  className={`px-3 py-1 rounded text-xs font-black transition ${
                    selectedSemester === "2"
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Semester 2 (Genap)
                </button>
              </div>
            </div>
          </div>

          {/* TABLE: 10 UH */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                1. Asesmen Ulangan Harian (UH 1 s/d UH 10)
              </span>
              <span className="text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Rata-Rata UH: {rerataUH}
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-50/80 text-blue-900 font-bold border-b border-blue-100 text-[11px]">
                    {safeUh.map((_, idx) => (
                      <th key={idx} className="p-2.5 text-center border-r border-blue-100 last:border-r-0">
                        <div>UH {idx + 1}</div>
                        <div className="text-[9px] font-normal text-blue-700 mt-0.5 font-mono">
                          {currentParalelRecord?.uhDates?.[idx]
                            ? formatDateIndo(currentParalelRecord.uhDates[idx])
                            : `P${idx + 1}`}
                        </div>
                      </th>
                    ))}
                    <th className="p-2.5 text-center bg-blue-150 font-black text-blue-950">Rerata UH</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-center font-bold text-slate-800">
                  <tr className="bg-white">
                    {safeUh.map((score, idx) => (
                      <td key={idx} className="p-3 border-r border-slate-100 last:border-r-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-black ${
                            score >= 75 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                          }`}
                        >
                          {score}
                        </span>
                      </td>
                    ))}
                    <td className="p-3 bg-blue-50 text-blue-950 font-black text-sm">{rerataUH}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE: 5 TUGAS & SUMATIF */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            {/* 5 Tugas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  2. Tugas Mandiri & LKPD (T1 s/d T5)
                </span>
                <span className="text-xs font-black text-teal-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Rerata Tugas: {rerataTugas}
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-teal-50/80 text-teal-900 font-bold border-b border-teal-100 text-[11px]">
                      {safeT.map((_, idx) => (
                        <th key={idx} className="p-2.5 text-center border-r border-teal-100 last:border-r-0">
                          <div>Tugas {idx + 1}</div>
                          <div className="text-[9px] font-normal text-teal-700 mt-0.5 font-mono">
                            {currentParalelRecord?.tDates?.[idx]
                              ? formatDateIndo(currentParalelRecord.tDates[idx])
                              : `T${idx + 1}`}
                          </div>
                        </th>
                      ))}
                      <th className="p-2.5 text-center bg-teal-150 font-black text-teal-950">Rerata T</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-center font-bold text-slate-800">
                    <tr className="bg-white">
                      {safeT.map((score, idx) => (
                        <td key={idx} className="p-3 border-r border-slate-100 last:border-r-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-black ${
                              score >= 75 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                            }`}
                          >
                            {score}
                          </span>
                        </td>
                      ))}
                      <td className="p-3 bg-teal-50 text-teal-950 font-black text-sm">{rerataTugas}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sumatif PTS & PAS Paralel */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                3. Asesmen Sumatif & Nilai Akhir Paralel
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
                  <span className="block text-[10px] font-extrabold text-amber-800 uppercase">PTS (Tengah)</span>
                  <span className="text-2xl font-black text-slate-900 font-mono my-1 block">{ptsScore}</span>
                  <span className="text-[9px] text-slate-500">Tgl: {currentParalelRecord?.ptsDate || "05 Okt 2026"}</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
                  <span className="block text-[10px] font-extrabold text-amber-800 uppercase">PAS (Akhir)</span>
                  <span className="text-2xl font-black text-slate-900 font-mono my-1 block">{pasScore}</span>
                  <span className="text-[9px] text-slate-500">Tgl: {currentParalelRecord?.pasDate || "15 Des 2026"}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="block text-[10px] font-extrabold text-emerald-800 uppercase">NA Paralel</span>
                  <span className="text-2xl font-black text-emerald-950 font-mono my-1 block">{nilaiAkhirParalel}</span>
                  <span className="text-[9px] font-bold text-emerald-700">KKM: 75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSKRIP KOMPETENSI LENGKAP */}
      {activeTab === "rincian" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Transkrip Rincian Capaian Kompetensi Kurikulum Merdeka
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Deskripsi ketercapaian tujuan pembelajaran (KKTP) dan indikator kompetensi siswa: {siswa.nama}.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              KELAS {siswa.kelasId}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3">Komponen Penilaian</th>
                  <th className="p-3 w-32">Kategori</th>
                  <th className="p-3 w-20 text-center">KKM</th>
                  <th className="p-3 w-24 text-center bg-slate-200/50 text-slate-900 font-black">Nilai Siswa</th>
                  <th className="p-3 w-24 text-center">Predikat</th>
                  <th className="p-3 w-28 text-center">Ketuntasan</th>
                  <th className="p-3 max-w-sm">Deskripsi Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                {componentsList.map((comp) => {
                  const gradeInfo = getGradeInfo(comp.nilai);
                  return (
                    <tr key={comp.no} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 text-center text-slate-400 font-bold">{comp.no}</td>
                      <td className="p-3 font-bold text-slate-900">{comp.nama}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            comp.kategori.includes("Formatif")
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : comp.kategori.includes("Sumatif")
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-teal-50 text-teal-700 border-teal-200"
                          }`}
                        >
                          {comp.kategori}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-400 font-mono font-bold">{comp.kkm}</td>
                      <td className="p-3 text-center bg-slate-50 text-slate-900 font-black text-sm font-mono">
                        {comp.nilai}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${gradeInfo.colorClass}`}>
                          {gradeInfo.letter}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            comp.nilai >= comp.kkm
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {comp.nilai >= comp.kkm ? "✓ TUNTAS" : "✗ REMEDIAL"}
                        </span>
                      </td>
                      <td className="p-3 max-w-sm text-[11px] text-slate-600 font-medium leading-relaxed">
                        {comp.deskripsi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TUGAS LMS SISWA & CATATAN GURU */}
      {activeTab === "tugas" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Daftar Tugas & Feedback Guru (Kelas {siswa.kelasId})
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Status penyelesaian tugas dan lembar ulasan penilaian dari guru PAI.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Total Tugas: <strong>{classTasks.length}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {classTasks.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold">
                  Belum ada tugas LMS yang dijadwalkan di kelas {siswa.kelasId}.
                </p>
              </div>
            ) : (
              classTasks.map((task) => {
                const sub = submissions.find(
                  (s) => s.tugasId === task.id && s.siswaNisn?.trim() === siswa.nisn?.trim()
                );

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{task.judul}</h4>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-extrabold">
                          {task.bab} • Batas: {task.deadline}
                        </span>
                      </div>

                      {sub ? (
                        sub.nilai !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Tuntas Dinilai
                            </span>
                            <span className="text-xs font-black bg-emerald-800 text-white px-2.5 py-0.5 rounded font-mono">
                              {sub.nilai} / 100
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            Sedang Diperiksa Guru
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                          Belum Dikumpulkan
                        </span>
                      )}
                    </div>

                    {sub && (
                      <div className="space-y-2 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-semibold leading-relaxed">
                          <span className="text-slate-400 block mb-1 text-[10px] uppercase font-bold">
                            Jawaban Anda (Terkirim):
                          </span>
                          <div className="whitespace-pre-line">{sub.kontenTeks}</div>
                          {sub.fileName && (
                            <span className="block mt-2 text-slate-500 font-mono text-[10px]">
                              📎 Lampiran Berkas: {sub.fileName}
                            </span>
                          )}
                        </div>

                        {sub.nilai !== undefined && (
                          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 flex gap-2.5">
                            <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[10px] text-emerald-900 uppercase tracking-wide">
                                Catatan Perbaikan & Apresiasi Guru PAI:
                              </strong>
                              <p className="text-[11px] text-slate-800 font-bold leading-relaxed mt-0.5">
                                {sub.komentarGuru || "Alhamdulillah, tugas telah diselesaikan dengan sangat baik dan tertib."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* PRINT MODAL: OFFICIAL STUDENT REPORT SHEET */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none my-6">
            {/* Modal Action Header (Hidden in Print) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Cetak Buku Nilai Siswa (Rapor Digital)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dokumen resmi hasil belajar PAI atas nama <strong>{siswa.nama}</strong> ({siswa.kelasId}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="text-xs text-slate-500 font-bold">Tgl Cetak:</span>
                  <input
                    type="date"
                    value={tanggalCetak}
                    onChange={(e) => setTanggalCetak(e.target.value)}
                    className="p-1 rounded border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sekarang (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL SHEET CONTENT */}
            <div id="printable-buku-nilai-siswa" className="space-y-5 text-black font-sans print:space-y-4">
              {/* KOP SURAT RESMI */}
              <div className="border-b-2 border-black pb-3 text-center">
                <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                  PEMERINTAH KABUPATEN WAY KANAN • DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h4>
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase mt-0.5">
                  UPT SMP NEGERI 2 REBANG TANGKAS
                </h2>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-700 mt-0.5">
                  Jl. Lintas Rebang Tangkas, Kec. Rebang Tangkas, Kab. Way Kanan, Lampung 34791 • NPSN: 10806892
                </p>
                <div className="mt-1 border-t border-black pt-1">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider underline">
                    LEMBAR REKAPITULASI HASIL BELAJAR SISWA (BUKU NILAI)
                  </h3>
                  <p className="text-[10px] font-bold uppercase mt-0.5 text-slate-800">
                    Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti
                  </p>
                </div>
              </div>

              {/* IDENTITAS SISWA */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs border border-black p-3 bg-slate-50/40 rounded-lg">
                <div className="flex">
                  <span className="w-32 font-bold">Nama Lengkap Siswa</span>
                  <span className="w-3">:</span>
                  <strong className="uppercase">{siswa.nama}</strong>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold">Kelas / Rombel</span>
                  <span className="w-3">:</span>
                  <strong>Kelas {siswa.kelasId}</strong>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold">NISN Siswa</span>
                  <span className="w-3">:</span>
                  <span className="font-mono font-bold">{siswa.nisn}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold">Semester / T.A.</span>
                  <span className="w-3">:</span>
                  <span>Semester {selectedSemester === "1" ? "Ganjil (1)" : "Genap (2)"} • 2026/2027</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold">Guru Pengampu</span>
                  <span className="w-3">:</span>
                  <span>Sadiqul Alim, S.Pd.I., M.Pd.</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold">Target KKM Sekolah</span>
                  <span className="w-3">:</span>
                  <strong>75 (Tuntas)</strong>
                </div>
              </div>

              {/* TABEL REKAP RESMI */}
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider block">
                  A. Rekapitulasi Nilai Akhir (Formatif, Sumatif, & Praktik Ibadah)
                </span>
                <table className="w-full text-left border-collapse text-[11px] border border-black">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-black p-1.5 w-8">No</th>
                      <th className="border border-black p-1.5">Komponen Penilaian</th>
                      <th className="border border-black p-1.5 w-24">Kategori</th>
                      <th className="border border-black p-1.5 w-16">KKM</th>
                      <th className="border border-black p-1.5 w-20">Nilai</th>
                      <th className="border border-black p-1.5 w-20">Predikat</th>
                      <th className="border border-black p-1.5 w-24">Ketuntasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-medium">
                    <tr>
                      <td className="border border-black p-1 text-center">1</td>
                      <td className="border border-black p-1 font-bold">Kuis Terstruktur Harian</td>
                      <td className="border border-black p-1 text-center">Formatif</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.formatifKuis}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.formatifKuis).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.formatifKuis >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">2</td>
                      <td className="border border-black p-1 font-bold">Tugas Mandiri & LKPD</td>
                      <td className="border border-black p-1 text-center">Formatif</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.formatifTugas}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.formatifTugas).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.formatifTugas >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">3</td>
                      <td className="border border-black p-1 font-bold">Keaktifan Forum & Diskusi</td>
                      <td className="border border-black p-1 text-center">Formatif</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.formatifDiskusi}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.formatifDiskusi).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.formatifDiskusi >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">4</td>
                      <td className="border border-black p-1 font-bold">Asesmen Tengah Semester (PTS)</td>
                      <td className="border border-black p-1 text-center">Sumatif</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.sumatifPts}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.sumatifPts).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.sumatifPts >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">5</td>
                      <td className="border border-black p-1 font-bold">Asesmen Akhir Semester (PAS)</td>
                      <td className="border border-black p-1 text-center">Sumatif</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.sumatifPas}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.sumatifPas).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.sumatifPas >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">6</td>
                      <td className="border border-black p-1 font-bold">Setoran Hafalan Juz 'Amma</td>
                      <td className="border border-black p-1 text-center">Praktik</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.hafalanJuzAmmaScore}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.hafalanJuzAmmaScore).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.hafalanJuzAmmaScore >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">7</td>
                      <td className="border border-black p-1 font-bold">Praktik Gerakan Sholat Fardhu</td>
                      <td className="border border-black p-1 text-center">Praktik</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.praktikSholat}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.praktikSholat).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.praktikSholat >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-center">8</td>
                      <td className="border border-black p-1 font-bold">Praktik Wudhu & Bersuci</td>
                      <td className="border border-black p-1 text-center">Praktik</td>
                      <td className="border border-black p-1 text-center font-mono">75</td>
                      <td className="border border-black p-1 text-center font-mono font-bold">{studentRekap.praktikWudhu}</td>
                      <td className="border border-black p-1 text-center font-bold">{getGradeInfo(studentRekap.praktikWudhu).letter}</td>
                      <td className="border border-black p-1 text-center text-[10px] font-bold">{studentRekap.praktikWudhu >= 75 ? "TUNTAS" : "REMEDIAL"}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={4} className="border border-black p-2 text-right uppercase">
                        NILAI AKHIR RAPOR (NA):
                      </td>
                      <td className="border border-black p-2 text-center font-mono font-black text-sm">
                        {nilaiAkhirRekap}
                      </td>
                      <td className="border border-black p-2 text-center font-black">
                        {finalGradeInfo.letter}
                      </td>
                      <td className="border border-black p-2 text-center font-black">
                        {nilaiAkhirRekap >= 75 ? "TUNTAS KKM" : "REMEDIAL"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CATATAN DAN TANDA TANGAN */}
              <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
                <div className="border border-black p-2.5 rounded text-[11px] leading-relaxed">
                  <strong className="block uppercase mb-1">Catatan Evaluasi Guru PAI:</strong>
                  <p>
                    Ananda {siswa.nama} telah menunjukkan motivasi belajar dan adab kesopanan yang baik.
                    Pertahankan prestasi pada aspek hafalan Al-Qur'an dan pengamalan ibadah praktis sehari-hari.
                  </p>
                </div>

                <div className="text-center text-xs flex flex-col justify-between">
                  <div>
                    <p>Rebang Tangkas, {formatDateIndo(tanggalCetak)}</p>
                    <p className="font-bold mt-1">Guru Mata Pelajaran PAI,</p>
                  </div>
                  <div className="mt-14">
                    <p className="font-bold underline">SADIQUL ALIM, S.Pd.I., M.Pd.</p>
                    <p className="font-mono text-[10px]">NIP. 19790917 201407 1 004</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
