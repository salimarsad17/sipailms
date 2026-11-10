/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Share2,
  Save,
  Power,
  Edit,
  Eye,
  Users,
  Video,
  FileText,
  Gamepad2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  Key,
  ShieldCheck,
  Search
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";

interface LmsPembelajaranViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  activeBundle?: BahanAjarAiCompleteBundle | null;
  onSelectBundle: (b: BahanAjarAiCompleteBundle) => void;
  onOpenGenerator: () => void;
}

export default function LmsPembelajaranView({
  bundles,
  activeBundle,
  onSelectBundle,
  onOpenGenerator
}: LmsPembelajaranViewProps) {
  const currentBundle = activeBundle || bundles[0];

  // LMS active tab:
  // "identitas" | "modul" | "kegiatan" | "evaluasi" | "monitoring"
  const [activeTab, setActiveTab] = useState<"identitas" | "modul" | "kegiatan" | "evaluasi" | "monitoring">("identitas");

  // LMS status
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [showTeacherKey, setShowTeacherKey] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Student monitoring roster (empty by default)
  const [studentsRoster, setStudentsRoster] = useState<
    {
      id: string;
      nama: string;
      nisn: string;
      kelas: string;
      ikutMateri: boolean;
      nontonVideo: boolean;
      kerjakanLkpd: boolean;
      kerjakanKuis: boolean;
      nilai: number;
      progres: number;
    }[]
  >([]);

  const [searchStudent, setSearchStudent] = useState("");

  if (!currentBundle) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center mx-auto text-2xl">
          🏫
        </div>
        <h3 className="text-xl font-black text-slate-900">Belum Ada Paket LMS Pembelajaran</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Silakan gunakan Generator AI untuk membuat paket kelas digital PAI terpadu.
        </p>
        <button
          onClick={onOpenGenerator}
          className="px-5 py-2.5 bg-blue-900 text-amber-300 font-black text-xs rounded-xl shadow-xs hover:bg-blue-800 transition cursor-pointer"
        >
          Buka Generator AI LMS
        </button>
      </div>
    );
  }

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const filteredStudents = studentsRoster.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.nisn.includes(searchStudent)
  );

  return (
    <div className="space-y-6">
      {/* HEADER BANNER LMS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-800 text-amber-300 text-xs font-black uppercase tracking-wider">
                LMS KELAS DIGITAL PAI
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPublished ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40" : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                }`}
              >
                {isPublished ? "● Aktif & Dipublikasikan" : "○ Dinonaktifkan (Draft)"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {currentBundle.materi}: {currentBundle.subMateri}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Paket Pembelajaran Kelas VII/VIII/IX • UPT SMPN 2 Rebang Tangkas. Siswa hanya dapat membuka materi yang ditugaskan guru untuk kelasnya.
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Paket kelas berhasil disimpan ke database!")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Kelas</span>
            </button>

            <button
              onClick={() => {
                setIsPublished(!isPublished);
                showNotification(isPublished ? "Kelas telah dinonaktifkan." : "Kelas berhasil dipublikasikan ke siswa!");
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                isPublished
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isPublished ? "Nonaktifkan" : "Publikasikan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 5 CORE TABS OF LMS */}
      <div className="p-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-1">
        {[
          { id: "identitas", label: "1. Identitas Pembelajaran", icon: BookOpen },
          { id: "modul", label: "2. Modul Materi Lengkap", icon: FileText },
          { id: "kegiatan", label: "3. Kegiatan Belajar", icon: Users },
          { id: "evaluasi", label: "4. Evaluasi & Kunci Guru", icon: Award },
          { id: "monitoring", label: "5. Monitoring Siswa", icon: GraduationCap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                isActive
                  ? "bg-blue-900 text-amber-300 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: IDENTITAS PEMBELAJARAN */}
      {activeTab === "identitas" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
              Identitas Pembelajaran LMS
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Profil Modul & Sasaran Kompetensi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-500 block">Judul Pembelajaran:</span>
                <strong className="text-sm text-slate-900">{currentBundle.materi}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mata Pelajaran:</span>
                <strong className="text-slate-900">Pendidikan Agama Islam dan Budi Pekerti</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sasaran Kelas:</span>
                <strong className="text-slate-900">Kelas {currentBundle.kelas} SMP (Fase D)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Semester:</span>
                <strong className="text-slate-900">Semester Ganjil / Genap</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-500 block">Satuan Pendidikan:</span>
                <strong className="text-slate-900">UPT SMPN 2 REBANG TANGKAS</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Guru Pengampu:</span>
                <strong className="text-slate-900">{currentBundle.guruNama || "Sadiqul Alim, S.Pd.I., M.Pd."}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Estimasi Alokasi Waktu:</span>
                <strong className="text-slate-900">2 Pertemuan (4 JP x 40 Menit)</strong>
              </div>
            </div>
          </div>

          {/* Tujuan Pembelajaran */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
            <span className="font-black text-blue-950 uppercase block">Tujuan Pembelajaran:</span>
            <p className="text-blue-900 leading-relaxed font-semibold">
              {currentBundle.lkpd.tujuanPembelajaran}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MODUL MATERI */}
      {activeTab === "modul" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
              Modul Materi Pembelajaran
            </span>
            <h3 className="text-xl font-black text-slate-900">
              {currentBundle.materiPembelajaran.judul}
            </h3>
          </div>

          {/* Ringkasan & Dalil */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
            {currentBundle.materiPembelajaran.materiInti}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase">Dalil Al-Qur'an dan Hadis:</h4>
            {currentBundle.materiPembelajaran.dalilQuran && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-950 text-amber-300 font-mono text-[10px] font-black">
                  {currentBundle.materiPembelajaran.dalilQuran.sumber}
                </span>
                <p className="text-lg font-arabic text-right text-slate-900 font-bold py-1">
                  {currentBundle.materiPembelajaran.dalilQuran.teksArab}
                </p>
                <p className="text-xs text-slate-700 italic">"{currentBundle.materiPembelajaran.dalilQuran.terjemahan}"</p>
              </div>
            )}
            {currentBundle.materiPembelajaran.hadis && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-200 font-mono text-[10px] font-black">
                  {currentBundle.materiPembelajaran.hadis.perawi} ({currentBundle.materiPembelajaran.hadis.status})
                </span>
                {currentBundle.materiPembelajaran.hadis.teksArab && (
                  <p className="text-lg font-arabic text-right text-slate-900 font-bold py-1">
                    {currentBundle.materiPembelajaran.hadis.teksArab}
                  </p>
                )}
                <p className="text-xs text-slate-700 italic">"{currentBundle.materiPembelajaran.hadis.terjemahan}"</p>
              </div>
            )}
          </div>

          {/* Rangkuman */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <span className="font-black text-emerald-950 uppercase block">Rangkuman Materi Pokok:</span>
            <ul className="space-y-1 list-disc pl-4 text-emerald-900 font-medium">
              {currentBundle.materiPembelajaran.rangkuman.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: KEGIATAN BELAJAR */}
      {activeTab === "kegiatan" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
              Alur Kegiatan Belajar
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Sintaks Pembelajaran Aktif di LMS
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                1. Kegiatan Pendahuluan (15 Menit)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Guru menyapa siswa, membaca basmalah dan doa bersama, mengecek kehadiran, serta memutar cuplikan hook video pembelajaran AI untuk memantik rasa ingin tahu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                2. Kegiatan Inti (50 Menit)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Siswa menyimak materi inti, mempelajari dalil naqli, memainkan 8 Game Edukasi PAI untuk penguatan konsep, dan mengisi LKPD digital secara berkolaborasi dalam kelompok.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase">
                3. Kegiatan Penutup (15 Menit)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Refleksi pembelajaran, guru memberikan penguatan atas pemahaman siswa, evaluasi kuis cepat HOTS, dan penutupan dengan hamdalah.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVALUASI & KUNCI GURU */}
      {activeTab === "evaluasi" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
                Bank Evaluasi & Kuis
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Soal Pilihan Ganda, Benar/Salah, & HOTS
              </h3>
            </div>

            <button
              onClick={() => setShowTeacherKey(!showTeacherKey)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                showTeacherKey
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showTeacherKey ? "Kunci Guru Terbuka" : "Buka Kunci Jawaban Khusus Guru"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentBundle.cbt.daftarSoal.map((soal, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900">Soal {idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono text-[10px] font-bold">
                    Tingkat: {soal.tingkatKesulitan}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{soal.pertanyaan}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                  {soal.pilihan.map((op, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isKey = letter === soal.kunciJawaban;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl border ${
                          showTeacherKey && isKey
                            ? "bg-emerald-100 border-emerald-400 font-black text-emerald-950"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <strong>{letter}.</strong> {op}
                      </div>
                    );
                  })}
                </div>

                {showTeacherKey && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <span className="font-black block">💡 Pembahasan Guru:</span>
                    <p>{soal.pembahasan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MONITORING SISWA */}
      {activeTab === "monitoring" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
                Monitoring Progres Kelas
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Aktivitas Pembelajaran Siswa Terpantau Real-Time
              </h3>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau NISN..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px]">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3 text-center">Ikut Materi</th>
                  <th className="p-3 text-center">Nonton Video</th>
                  <th className="p-3 text-center">Isi LKPD</th>
                  <th className="p-3 text-center">Kuis</th>
                  <th className="p-3 text-center">Nilai</th>
                  <th className="p-3 text-center">Progres</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold text-xs">
                      Belum ada riwayat aktivitas pengerjaan siswa pada paket kelas ini.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{s.nama}</td>
                      <td className="p-3 font-mono text-slate-500">{s.nisn}</td>
                      <td className="p-3 text-center">
                        {s.ikutMateri ? "✅" : "⏳"}
                      </td>
                      <td className="p-3 text-center">
                        {s.nontonVideo ? "✅" : "⏳"}
                      </td>
                      <td className="p-3 text-center">
                        {s.kerjakanLkpd ? "✅" : "⏳"}
                      </td>
                      <td className="p-3 text-center">
                        {s.kerjakanKuis ? "✅" : "⏳"}
                      </td>
                      <td className="p-3 text-center font-black text-blue-900">
                        {s.nilai > 0 ? s.nilai : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {s.progres}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
