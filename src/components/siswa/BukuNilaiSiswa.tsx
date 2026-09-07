/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FileText,
  MessageSquare,
  Clock,
  HelpCircle,
  CheckCircle,
  Award,
  Star,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Check,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { Siswa, TugasLms, PengumpulanTugas, RekapNilaiTotal, NilaiKhususPai } from "../../types";

interface BukuNilaiSiswaProps {
  siswa: Siswa;
  tasks: TugasLms[];
  submissions: PengumpulanTugas[];
  rekapNilai: RekapNilaiTotal[];
  nilaiKhusus: NilaiKhususPai[];
}

export default function BukuNilaiSiswa({
  siswa,
  tasks,
  submissions,
  rekapNilai,
  nilaiKhusus
}: BukuNilaiSiswaProps) {
  // Extract overall rekap grades for this student
  const studentRekap = rekapNilai.find((r) => r.siswaNisn === siswa.nisn);
  const studentKhusus = nilaiKhusus.find((nk) => nk.siswaNisn === siswa.nisn);

  const classTasks = tasks.filter((t) => t.kelasId === siswa.kelasId);

  // Core Academics Average (Cognitive)
  const cognitiveAverage = studentRekap
    ? Math.round(
        (studentRekap.formatifKuis +
          studentRekap.formatifTugas +
          studentRekap.formatifDiskusi +
          studentRekap.sumatifPts +
          studentRekap.sumatifPas) /
          5
      )
    : 85;

  // Practical average (Aesthetic & Skill)
  const practicalAverage = studentRekap
    ? Math.round(
        (studentRekap.hafalanJuzAmmaScore +
          studentRekap.praktikSholat +
          studentRekap.praktikWudhu) /
          3
      )
    : 88;

  // Overall combined average
  const totalAverage = Math.round(cognitiveAverage * 0.6 + practicalAverage * 0.4);

  // Helper to determine predicate and visual styles
  const getGradeInfo = (score: number) => {
    if (score >= 90) {
      return {
        letter: "A",
        label: "Sangat Baik",
        colorClass: "text-emerald-700 bg-emerald-50 border-emerald-100",
        badgeClass: "bg-emerald-600 text-white"
      };
    }
    if (score >= 80) {
      return {
        letter: "B",
        label: "Baik",
        colorClass: "text-blue-700 bg-blue-50 border-blue-100",
        badgeClass: "bg-blue-600 text-white"
      };
    }
    if (score >= 70) {
      return {
        letter: "C",
        label: "Cukup",
        colorClass: "text-amber-700 bg-amber-50 border-amber-100",
        badgeClass: "bg-amber-600 text-white"
      };
    }
    return {
      letter: "D",
      label: "Perlu Bimbingan",
      colorClass: "text-rose-700 bg-rose-50 border-rose-100",
      badgeClass: "bg-rose-600 text-white"
    };
  };

  const finalGradeInfo = getGradeInfo(totalAverage);

  // Complete breakdown of all individual grades inputted by the teacher
  const componentsList = [
    {
      no: 1,
      nama: "Kuis Terstruktur Harian",
      kategori: "Formatif",
      nilai: studentRekap?.formatifKuis ?? 80,
      kkm: 75,
      deskripsi: "Sangat memahami materi esensial dalam kuis PAI mingguan dengan analisis dalil yang tepat."
    },
    {
      no: 2,
      nama: "Tugas Mandiri & Lembar Kerja",
      kategori: "Formatif",
      nilai: studentRekap?.formatifTugas ?? 80,
      kkm: 75,
      deskripsi: "Disiplin menyelesaikan tugas resume, infografis materi, dan pengumpulan tepat waktu."
    },
    {
      no: 3,
      nama: "Keaktifan Forum & Diskusi",
      kategori: "Formatif",
      nilai: studentRekap?.formatifDiskusi ?? 80,
      kkm: 75,
      deskripsi: "Aktif memberikan tanggapan santun dan solutif dalam forum diskusi fikih ibadah di kelas."
    },
    {
      no: 4,
      nama: "Asesmen Tengah Semester (PTS)",
      kategori: "Sumatif",
      nilai: studentRekap?.sumatifPts ?? 80,
      kkm: 75,
      deskripsi: "Menunjukkan penguasaan teoretis yang mantap dalam lingkup materi paruh pertama semester."
    },
    {
      no: 5,
      nama: "Asesmen Akhir Semester (PAS)",
      kategori: "Sumatif",
      nilai: studentRekap?.sumatifPas ?? 80,
      kkm: 75,
      deskripsi: "Menguasai seluruh indikator ketercapaian kompetensi akhir secara menyeluruh di lembar asesmen."
    },
    {
      no: 6,
      nama: "Setoran Hafalan Juz Amma",
      kategori: "Praktik & Karakter",
      nilai: studentRekap?.hafalanJuzAmmaScore ?? 80,
      kkm: 75,
      deskripsi: `Mampu menghafalkan surah ${
        studentKhusus ? studentKhusus.surahJuzAmma : "Ad-Duha"
      } dengan kelancaran ${studentKhusus ? studentKhusus.kelancaran : "Lancar"} dan tajwid ${
        studentKhusus ? studentKhusus.tajwid : "Baik"
      }.`
    },
    {
      no: 7,
      nama: "Praktik Gerakan Sholat Fardhu",
      kategori: "Praktik & Karakter",
      nilai: studentRekap?.praktikSholat ?? 80,
      kkm: 75,
      deskripsi: "Menguasai keselarasan rukun fi'liyah dan qauliyah gerakan sholat fardhu secara tuma'ninah."
    },
    {
      no: 8,
      nama: "Praktik Wudhu & Bersuci",
      kategori: "Praktik & Karakter",
      nilai: studentRekap?.praktikWudhu ?? 80,
      kkm: 75,
      deskripsi: "Tertib dalam tata cara berwudhu, menyempurnakan basuhan, serta melafalkan doa setelah wudhu."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Student Identity Metadata */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
            <FileText className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Buku Lembar Rapor Digital PAI & Budi Pekerti
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Tahun Ajaran 2026/2027 • Semester Ganjil • Kurikulum Merdeka
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Nama Siswa</span>
            <span className="text-slate-900 truncate block max-w-[120px]" title={siswa.nama}>{siswa.nama}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">NISN Siswa</span>
            <span className="text-slate-900 font-mono">{siswa.nisn}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Kelas Aktif</span>
            <span className="text-slate-900">{siswa.kelasId}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Guru Pengampu</span>
            <span className="text-emerald-800 font-bold truncate block max-w-[120px]" title="Sadiqul Alim, S.Pd.I., M.Pd.">Sadiqul Alim</span>
          </div>
        </div>
      </div>

      {/* Grades overall banners */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {/* GPA Academic average */}
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-950 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-10">
            <Award className="w-24 h-24" />
          </div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-200 relative z-10">
            Rata-Rata Gabungan (Akhir)
          </span>
          <div className="my-2 relative z-10">
            <span className="text-4xl font-black">{totalAverage}</span>
            <span className="text-xs text-emerald-200 ml-1.5">/ 100</span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide bg-white/10 px-2 py-1 rounded-full inline-block self-start relative z-10 border border-white/10">
            Predikat: {finalGradeInfo.label} ({finalGradeInfo.letter})
          </span>
        </div>

        {/* Cognitive average */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rata-Rata Kognitif (Akademik)
          </span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900">{cognitiveAverage}</span>
            <span className="text-xs text-slate-400 ml-1">/ 100</span>
          </div>
          <span className="text-[10px] text-indigo-700 font-bold uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block self-start border border-indigo-150">
            Bobot Raport: 60%
          </span>
        </div>

        {/* Practical average */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rata-Rata Praktik & Hafalan
          </span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900">{practicalAverage}</span>
            <span className="text-xs text-slate-400 ml-1">/ 100</span>
          </div>
          <span className="text-[10px] text-teal-700 font-bold uppercase bg-teal-50 px-2.5 py-0.5 rounded-full inline-block self-start border border-teal-150">
            Bobot Raport: 40%
          </span>
        </div>

        {/* Status KKM */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ketercapaian KKM Akademik
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-700 block uppercase">
              {totalAverage >= 75 ? "TUNTAS KKM" : "PERLU REMEDIAL"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Target Minimal Sekolah: 75</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold uppercase flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Terverifikasi Sistem SMPN 2
          </span>
        </div>
      </div>

      {/* NEW: COMPLETE MASTER REPORT CARD TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              Transkrip Rincian Nilai Sesuai Input Guru PAI
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Lembar capaian lengkap yang telah diinput secara resmi oleh wali kelas/guru PAI di sistem administrasi nilai.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold self-start sm:self-center">
            DIUPDATE: REAL-TIME SINKRON
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase">
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">Komponen Penilaian</th>
                <th className="p-3 w-32">Kategori</th>
                <th className="p-3 w-20 text-center">KKM</th>
                <th className="p-3 w-24 text-center bg-slate-100/40">Nilai Angka</th>
                <th className="p-3 w-24 text-center">Predikat</th>
                <th className="p-3 w-28 text-center">Ketuntasan</th>
                <th className="p-3 max-w-sm">Deskripsi Capaian Kompetensi (Kurikulum Merdeka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {componentsList.map((comp) => {
                const gradeInfo = getGradeInfo(comp.nilai);
                return (
                  <tr key={comp.no} className="hover:bg-slate-50/40 transition">
                    <td className="p-3 text-center text-slate-400 font-bold">{comp.no}</td>
                    <td className="p-3 font-bold text-slate-900">{comp.nama}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                        comp.kategori.includes("Formatif")
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : comp.kategori.includes("Sumatif")
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-teal-50 text-teal-700 border-teal-100"
                      }`}>
                        {comp.kategori}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-400 font-mono font-bold">{comp.kkm}</td>
                    <td className="p-3 text-center bg-slate-100/10 text-slate-900 font-extrabold text-sm font-mono">
                      {comp.nilai}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${gradeInfo.colorClass}`}>
                        {gradeInfo.letter}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        comp.nilai >= comp.kkm
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {comp.nilai >= comp.kkm ? "✓ TUNTAS" : "✗ REMEDIAL"}
                      </span>
                    </td>
                    <td className="p-3 max-w-sm text-[11px] text-slate-500 font-medium leading-relaxed">
                      {comp.deskripsi}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chapter Breakdown & Assignments list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          Rincian Nilai & Ulasan Setiap Tugas LMS Siswa
        </h3>

        <div className="space-y-4">
          {classTasks.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 italic">Belum ada tugas LMS yang aktif di kelas Anda.</p>
            </div>
          ) : (
            classTasks.map((task) => {
              const sub = submissions.find(
                (s) => s.tugasId === task.id && s.siswaNisn === siswa.nisn
              );

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{task.judul}</h4>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide font-extrabold">
                        {task.bab}
                      </span>
                    </div>

                    {sub ? (
                      sub.nilai !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Tuntas Dinilai
                          </span>
                          <span className="text-xs font-extrabold bg-emerald-700 text-white px-2.5 py-0.5 rounded">
                            {sub.nilai} / 100
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          Ulasan Tertunda (Sedang Diulas Guru)
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full font-bold">
                        Belum Dikumpulkan
                      </span>
                    )}
                  </div>

                  {/* Submission content & Teacher remarks */}
                  {sub && (
                    <div className="space-y-2.5 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-semibold leading-relaxed">
                        <strong className="text-slate-400 block mb-0.5 text-[9px] uppercase">Jawaban Anda:</strong>
                        <div className="whitespace-pre-line">{sub.kontenTeks}</div>
                        {sub.fileName && (
                          <span className="block mt-1 text-slate-400">📂 Lampiran: {sub.fileName}</span>
                        )}
                      </div>

                      {sub.nilai !== undefined && (
                        <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100/50 flex gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[10px] text-emerald-800 uppercase tracking-wide">
                              Catatan Perbaikan & Apresiasi Guru:
                            </strong>
                            <p className="text-[11px] text-slate-700 font-bold leading-relaxed mt-0.5">
                              {sub.komentarGuru || "Bagus sekali pengerjaannya!"}
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
    </div>
  );
}
