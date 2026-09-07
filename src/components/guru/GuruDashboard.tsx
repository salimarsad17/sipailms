/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, Users, GraduationCap, Clock, Bell, CheckCircle2, AlertCircle, BookOpen, ExternalLink, Link2, Globe, ShieldCheck, Award } from "lucide-react";
import { Guru, Kelas, JurnalMengajar, PengumpulanTugas } from "../../types";

interface GuruDashboardProps {
  guru: Guru;
  classes: Kelas[];
  attendanceRate: number; // e.g. 94.2
  jurnals: JurnalMengajar[];
  pendingSubmissions: PengumpulanTugas[];
  onNavigate: (tab: string, subTab?: string) => void;
  onGradeClick: (submissionId: string) => void;
}

export default function GuruDashboard({
  guru,
  classes,
  attendanceRate,
  jurnals,
  pendingSubmissions,
  onNavigate,
  onGradeClick
}: GuruDashboardProps) {
  const totalSiswa = classes.reduce((sum, c) => sum + c.totalSiswa, 0);

  // Today's agenda items
  const agendaHariIni = [
    { kelas: "VII-A", jam: "Jam ke 1-2 (07:30 - 09:00)", materi: "Thaharah & Praktek Wudhu", tempat: "Mushola Al-Ikhlas" },
    { kelas: "VII-B", jam: "Jam ke 4-5 (10:15 - 11:45)", materi: "Meneladani Sikap Jujur & Amanah", tempat: "Ruang Kelas VII-B" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <BookOpen className="w-80 h-80 text-amber-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs px-3.5 py-1 rounded-full font-black shadow-md shadow-amber-500/20 border border-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>Guru Pendidikan Agama Islam (PAI) & Budi Pekerti</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Selamat Datang, <span className="text-amber-300">{guru.nama}</span>
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Sistem Informasi PAI Terpadu UPT SMPN 2 Rebang Tangkas. Kelola kurikulum, pantau sikap spiritual-sosial siswa, dan selenggarakan kelas interaktif dengan LMS dalam satu dasbor terpadu.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50"><strong>NIP:</strong> <span className="font-mono text-amber-300">{guru.nip}</span></span>
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50"><strong>Wali Kelas:</strong> {guru.isWaliKelas ? `Kelas ${guru.waliKelasDi}` : "Bukan Wali Kelas"}</span>
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50"><strong>Sertifikasi:</strong> {guru.sertifikasi}</span>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase tracking-wider">Kelas Diampu</span>
            <span className="block text-2xl font-black text-slate-900">{classes.length} Kelas</span>
            <span className="block text-xs text-emerald-700 font-bold mt-0.5">Fase D (Kelas VII & VIII)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-100 shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase tracking-wider">Total Siswa Aktif</span>
            <span className="block text-2xl font-black text-slate-900">{totalSiswa} Siswa</span>
            <span className="block text-xs text-blue-700 font-bold mt-0.5">Siswa terdaftar PAILMS</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/70 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase tracking-wider">Kehadiran Siswa</span>
            <span className="block text-2xl font-black text-slate-900">{attendanceRate}%</span>
            <span className="block text-xs text-amber-700 font-bold mt-0.5">Melampaui target bulanan</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Agenda & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                Agenda Mengajar Hari Ini
              </h2>
              <span className="text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Senin, 13 Juli 2026
              </span>
            </div>

            <div className="space-y-3">
              {agendaHariIni.map((agenda, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition duration-150 shadow-xs">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 font-black flex flex-col items-center justify-center text-xs shrink-0 border border-emerald-700 shadow-sm">
                    <span className="text-[9px] uppercase text-emerald-200 tracking-wider font-bold">KELAS</span>
                    <span className="text-base font-black leading-none">{agenda.kelas}</span>
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {agenda.materi}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {agenda.jam}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-800 font-bold">
                        {agenda.tempat}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("jurnal", "jurnal-mengajar")}
                    className="self-center p-2.5 text-slate-500 hover:text-slate-950 hover:bg-amber-100 rounded-xl transition border border-transparent hover:border-amber-300 cursor-pointer"
                    title="Isi Jurnal Mengajar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Laporan jurnal harian akan direkap secara otomatis setiap bulannya.
              </span>
              <button
                onClick={() => onNavigate("jurnal", "jurnal-mengajar")}
                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Lihat Semua Jurnal</span> &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Notifications / Pending Submissions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-emerald-700" />
                Notifikasi & LMS Tugas
                {pendingSubmissions.length > 0 && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 shadow-sm">
                    {pendingSubmissions.length} Baru
                  </span>
                )}
              </h2>

              {pendingSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 border border-emerald-100">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-700 font-bold">Semua tugas siswa telah dinilai!</p>
                  <p className="text-[11px] text-slate-500 mt-1">Tidak ada setoran hafalan tertunda.</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
                  {pendingSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-50 hover:border-amber-300 transition duration-150 space-y-2 text-left"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-black text-slate-900">
                          {sub.siswaNama} ({sub.kelasId})
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-950 rounded border border-amber-300">
                          {sub.tipePengumpulan}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 leading-relaxed line-clamp-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                        <strong className="text-slate-900">{sub.tugasJudul}</strong>: {sub.kontenTeks}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>Hari ini {sub.tanggalKumpul.split(" ")[1]}</span>
                        <button
                          onClick={() => onGradeClick(sub.id)}
                          className="px-2.5 py-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[11px] font-black rounded-lg shadow-xs border border-amber-300 flex items-center gap-1 transition cursor-pointer"
                        >
                          Beri Nilai &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate("nilai")}
                className="w-full text-center py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl border border-amber-300 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                Masuk Rekap Nilai PAI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINK PORTAL KEDINASAN SECTION (SIAGA PENDIS, INFO GTK, MyASN BKN) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[10px] font-black uppercase">
              <Globe className="w-3 h-3" /> Tautan Layanan Kedinasan Resmi
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-amber-400" />
              Akses Cepat Portal Guru & ASN (SIAGA Pendis, Info GTK, MyASN BKN)
            </h2>
          </div>

          <button
            onClick={() => onNavigate("link")}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/25 border border-amber-300 self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Semua Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SIAGA PENDIS CARD */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-700/50 hover:border-amber-400 transition space-y-3 flex flex-col justify-between group shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-900 text-emerald-300 text-[10px] font-black rounded border border-emerald-700/50">
                  KEMENAG RI
                </span>
                <span className="text-[10px] font-extrabold text-amber-400">Aktif / Real-time</span>
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                SIAGA Pendis Kemenag
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                Portal verifikasi jadwal mengajar PAI, pencairan TPG Kemenag, dan verval sertifikasi guru agama.
              </p>
            </div>
            <a
              href="https://www.siagapendis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition shadow-md border border-amber-300 cursor-pointer"
            >
              <span>Buka SIAGA Pendis</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* INFO GTK CARD */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-blue-700/50 hover:border-amber-400 transition space-y-3 flex flex-col justify-between group shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-blue-900 text-blue-300 text-[10px] font-black rounded border border-blue-700/50">
                  KEMDIKBUDRISTEK
                </span>
                <span className="text-[10px] font-extrabold text-blue-300">Dapodik Linked</span>
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                Info GTK Kemdikbud
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                Cek validasi data Dapodik, beban mengajar (JJM), penerbitan SKTP, dan NUPTK guru.
              </p>
            </div>
            <a
              href="https://info.gtk.kemdikbud.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition shadow-md border border-amber-300 cursor-pointer"
            >
              <span>Buka Info GTK</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* MyASN BKN CARD */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-700/50 hover:border-amber-400 transition space-y-3 flex flex-col justify-between group shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] font-black rounded border border-amber-700/50">
                  BADAN KEPEGAWAIAN NEGARA
                </span>
                <span className="text-[10px] font-extrabold text-amber-400">PNS & PPPK</span>
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                MyASN BKN (MySAPK)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                Peremajaan Data Mandiri (PDM) ASN, riwayat SK kepangkatan, E-Kinerja, dan profil BKN.
              </p>
            </div>
            <a
              href="https://myasn.bkn.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition shadow-md border border-amber-300 cursor-pointer"
            >
              <span>Buka MyASN BKN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
