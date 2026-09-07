/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Bell, Calendar, Clock, ArrowRight, UserCheck, ChevronRight, FileText } from "lucide-react";
import { Siswa, TugasLms, PengumpulanTugas } from "../../types";

interface SiswaDashboardProps {
  siswa: Siswa;
  tasks: TugasLms[];
  submissions: PengumpulanTugas[];
  onNavigate: (tab: string) => void;
}

export default function SiswaDashboard({
  siswa,
  tasks,
  submissions,
  onNavigate
}: SiswaDashboardProps) {
  // Find which tasks are already submitted vs pending
  const classTasks = tasks.filter((t) => t.kelasId === siswa.kelasId);

  const pendingTasks = classTasks.filter(
    (task) => !submissions.some((sub) => sub.tugasId === task.id)
  );

  const announcements = [
    {
      id: "a-1",
      sender: "Sadiqul Alim, S.Pd.I., M.Pd.",
      date: "Hari ini, 08:00",
      content: "Assalamualaikum Wr Wb anak-anakku Kelas VII-A. Mengingat hari Kamis esok akan dilaksanakan praktik Sholat Gerhana (Khusuf), dimohon kepada seluruh siswa agar membawa perlengkapan ibadah (mukena bagi siswi, sarung & peci bagi siswa) serta membawa mushaf Al-Qur'an saku ke mushola sekolah tepat jam ke-1.",
      badge: "PENTING"
    },
    {
      id: "a-2",
      sender: "Sadiqul Alim, S.Pd.I., M.Pd.",
      date: "Kemarin",
      content: "Bagi yang belum melengkapi setoran hafalan surah Ad-Duha di LMS, bapak tunggu batas pengumpulannya hingga minggu depan nggih. Harap dibaca tajwid panjang-pendeknya dengan baik.",
      badge: "PENGUMUMAN"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Student Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 pointer-events-none">
          <GraduationCap className="w-72 h-72 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-amber-500/20 border border-amber-300">
              <span>Ruang Belajar Digital Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Marhaban, <span className="text-amber-300">{siswa.nama}</span>
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Selamat datang di portal pembelajaran PAI UPT SMPN 2 Rebang Tangkas. Mari luruskan niat belajar kita hari ini untuk meraih keberkahan ilmu!
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-emerald-200">
              <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50 font-mono">NISN: <span className="text-amber-300">{siswa.nisn}</span></span>
              <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">Kelas: <span className="text-amber-300">{siswa.kelasId}</span></span>
              <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">Agama: {siswa.agama}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-700/40 text-center shrink-0 w-full sm:w-auto shadow-lg space-y-2">
            <span className="block text-[11px] text-emerald-300 font-extrabold uppercase tracking-wider">Tugas Menunggu</span>
            <span className="block text-3xl font-black text-amber-400 my-0.5">{pendingTasks.length}</span>
            <button
              onClick={() => onNavigate("lms")}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 mx-auto transition shadow-md border border-amber-300 cursor-pointer"
            >
              <span>Buka LMS Kelas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Announcements vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-emerald-700" />
              Mading & Pengumuman Kelas
            </h2>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-amber-200 hover:bg-amber-50/10 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{ann.sender}</span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      ann.badge === "PENTING"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}>
                      {ann.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {ann.content}
                  </p>
                  <span className="block text-[11px] text-slate-500 text-right font-medium">
                    {ann.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Garis Waktu Tugas (Timeline) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-700" />
                Garis Waktu Tugas (Timeline)
              </h2>

              {pendingTasks.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 border border-emerald-100">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-900">Alhamdulillah!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Semua tugas PAI Anda sudah dikerjakan.</p>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="relative pl-7 space-y-1.5 group">
                      {/* Circle timeline dot */}
                      <span className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-amber-500 shadow-sm ring-1 ring-amber-300 transition group-hover:scale-110"></span>

                      <div className="text-left">
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-black uppercase font-mono border border-amber-300">
                          Batas: {task.deadline}
                        </span>
                        <h4 className="text-xs font-black text-slate-950 line-clamp-1 mt-1">
                          {task.judul}
                        </h4>
                        <span className="block text-[11px] text-slate-500">
                          {task.bab}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigate("lms")}
                        className="px-3 py-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[11px] font-black rounded-lg shadow-xs border border-amber-300 flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Kerjakan Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
