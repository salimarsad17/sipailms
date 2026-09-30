/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquare,
  Send,
  User,
  GraduationCap,
  Clock,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCheck,
  Award,
  HelpCircle,
  ChevronRight,
  Filter,
  CheckCircle2,
  Bell
} from "lucide-react";
import { Siswa, Guru, PesanPai } from "../../types";

interface PesanSiswaViewProps {
  siswa: Siswa;
  guru: Guru;
  pesanList: PesanPai[];
  onSendPesan: (newPesan: PesanPai) => void;
  onMarkAsRead: (pesanIds: string[]) => void;
}

export default function PesanSiswaView({
  siswa,
  guru,
  pesanList,
  onSendPesan,
  onMarkAsRead
}: PesanSiswaViewProps) {
  const [selectedTopic, setSelectedTopic] = useState("Al-Qur'an & Tajwid");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [includeAudioSim, setIncludeAudioSim] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string>("ALL");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const PAI_TOPICS = [
    "Al-Qur'an & Tajwid",
    "Fiqih Sholat & Thaharah",
    "Akidah & Rukun Iman",
    "Akhlak Mulia & Adab",
    "Sejarah Peradaban Islam",
    "Tanya Tugas LMS",
    "Konsultasi Ibadah",
    "Umum"
  ];

  const QUICK_QUESTIONS = [
    {
      topic: "Al-Qur'an & Tajwid",
      title: "Hukum Bacaan Ikhfa & Idgham",
      text: "Assalamu'alaikum Pak Guru. Mohon izin bertanya, bagaimana cara membedakan panjang dengungan ikhfa haqiqi dan idgham bighunnah saat membaca Al-Qur'an?"
    },
    {
      topic: "Fiqih Sholat & Thaharah",
      title: "Tata Cara Sujud Sahwi",
      text: "Assalamu'alaikum Pak. Bila kita ragu jumlah rakaat shalat fardhu, kapan sujud sahwi dilakukan dan bagaimana lafal bacaannya?"
    },
    {
      topic: "Tanya Tugas LMS",
      title: "Konfirmasi Setoran Hafalan LMS",
      text: "Assalamu'alaikum Pak Guru. Saya sudah mengunggah rekaman setoran hafalan surah pilihan di LMS. Mohon masukan bila ada makhraj huruf yang keliru ya Pak."
    },
    {
      topic: "Konsultasi Ibadah",
      title: "Tips Istiqomah Sholat 5 Waktu",
      text: "Pak Guru, bagaimana tips agar saya dan teman-teman bisa selalu istiqomah shalat lima waktu berjamaah tepat pada waktunya?"
    }
  ];

  // Messages related to this student (sent by student, sent specifically to student, or broadcast to student's class)
  const conversationMessages = useMemo(() => {
    return pesanList
      .filter((m) => {
        const isFromStudent = m.senderId === siswa.nisn && m.senderRole === "SISWA";
        const isToStudent = m.recipientId === siswa.nisn && m.recipientRole === "SISWA";
        const isBroadcastToClass =
          m.senderRole === "GURU" &&
          (m.recipientRole === "SEMUA_SISWA" ||
            m.recipientId === `KELAS:${siswa.kelasId}` ||
            m.recipientId === "ALL");

        return isFromStudent || isToStudent || isBroadcastToClass;
      })
      .sort((a, b) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime());
  }, [pesanList, siswa]);

  // Mark unread teacher messages as read when opening
  useEffect(() => {
    const unreadTeacherMsgs = conversationMessages
      .filter((m) => !m.isRead && m.senderRole === "GURU" && m.recipientId === siswa.nisn)
      .map((m) => m.id);

    if (unreadTeacherMsgs.length > 0) {
      onMarkAsRead(unreadTeacherMsgs);
    }
  }, [conversationMessages, siswa.nisn]);

  // Filtered by Topic
  const filteredMessages = useMemo(() => {
    if (filterTopic === "ALL") return conversationMessages;
    return conversationMessages.filter((m) => m.topikMateri === filterTopic);
  }, [conversationMessages, filterTopic]);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newQuestion: PesanPai = {
      id: `pesan-siswa-${Date.now()}`,
      senderRole: "SISWA",
      senderId: siswa.nisn,
      senderNama: siswa.nama,
      recipientRole: "GURU",
      recipientId: guru.nip,
      recipientNama: guru.nama,
      kelasId: siswa.kelasId,
      topikMateri: selectedTopic,
      judul: questionTitle.trim() || undefined,
      isiPesan: questionText.trim(),
      waktu: new Date().toISOString(),
      isRead: false,
      lampiran: includeAudioSim
        ? {
            tipe: "audio",
            nama: "Rekaman Bacaan Audio Siswa.mp3"
          }
        : undefined
    };

    onSendPesan(newQuestion);
    setQuestionTitle("");
    setQuestionText("");
    setIncludeAudioSim(false);

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleUseQuickPrompt = (prompt: (typeof QUICK_QUESTIONS)[0]) => {
    setSelectedTopic(prompt.topic);
    setQuestionTitle(prompt.title);
    setQuestionText(prompt.text);
    // Scroll down to composer
    const composer = document.getElementById("siswa-composer-card");
    if (composer) {
      composer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatWaktu = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs px-3.5 py-1 rounded-full font-black uppercase tracking-wider shadow-md shadow-amber-500/20 border border-amber-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ruang Tanya Jawab & Konsultasi Materi PAI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tanya Guru PAI & Bimbingan Belajar
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Ada ayat Al-Qur'an, tajwid, tata cara sholat, atau tugas LMS yang belum dipahami? Tanyakan langsung kepada Guru PAI di sini untuk mendapatkan bimbingan dan penjelasan lengkap.
            </p>
          </div>

          {/* Teacher Badge Card */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4.5 rounded-2xl border border-emerald-700/50 flex items-center gap-3.5 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center font-black text-xl border border-emerald-700/60 shadow-md">
              🕌
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                Guru PAI Pembimbing
              </span>
              <strong className="text-sm font-black text-white block truncate max-w-[200px]">
                {guru.nama}
              </strong>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-300 font-bold">Siap Membimbing Belajar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl shadow-md flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <strong className="block font-black text-emerald-900">Alhamdulillah! Pertanyaan Anda Berhasil Terkirim.</strong>
            <span className="text-emerald-800">
              Pertanyaan materi PAI telah masuk ke akun Guru ({guru.nama}). Anda akan menerima notifikasi begitu Guru memberikan balasan.
            </span>
          </div>
        </div>
      )}

      {/* Quick Prompts Carousel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Contoh Pertanyaan Cepat Seputar Materi PAI
          </h3>
          <span className="text-[10px] font-bold text-slate-500">Klik untuk langsung menulis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUseQuickPrompt(item)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/40 text-left transition group shadow-2xs cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {item.topic}
                </span>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-900 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-2">
                <span>Gunakan Pertanyaan</span> &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation & Question Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat & Discussion History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                Riwayat Diskusi & Jawaban Guru
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredMessages.length} pesan tercatat
              </span>
            </div>

            {/* Topic Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-2.5 py-1 text-xs font-bold bg-slate-50 rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="ALL">Semua Topik</option>
                {PAI_TOPICS.map((topik) => (
                  <option key={topik} value={topik}>
                    {topik}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-emerald-200" />
                <h3 className="text-xs font-black text-slate-700">Belum Ada Pertanyaan di Topik Ini</h3>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Gunakan formulir di samping untuk mengirim pertanyaan pertama Anda ke Pak Guru.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isFromTeacher = msg.senderRole === "GURU";
                const isBroadcast =
                  msg.recipientRole === "SEMUA_SISWA" || msg.recipientId.startsWith("KELAS:");

                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl p-4 shadow-xs space-y-2.5 transition text-left border ${
                      isFromTeacher
                        ? isBroadcast
                          ? "bg-amber-50/70 border-amber-200 text-slate-900"
                          : "bg-gradient-to-br from-emerald-950 to-slate-950 text-white border-emerald-800"
                        : "bg-slate-50 text-slate-900 border-slate-200"
                    }`}
                  >
                    {/* Header info */}
                    <div
                      className={`flex items-center justify-between gap-2 border-b pb-1.5 text-[10px] ${
                        isFromTeacher && !isBroadcast ? "border-emerald-800/80" : "border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black ${
                            isFromTeacher
                              ? isBroadcast
                                ? "text-amber-950"
                                : "text-amber-300"
                              : "text-emerald-800"
                          }`}
                        >
                          {isFromTeacher ? (
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              {msg.senderNama} {isBroadcast ? "(Pengumuman Kelas)" : "(Guru PAI)"}
                            </span>
                          ) : (
                            `Anda (${msg.senderNama})`
                          )}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-extrabold text-[9px] ${
                          isFromTeacher && !isBroadcast
                            ? "bg-emerald-800 text-emerald-200"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {msg.topikMateri}
                      </span>
                    </div>

                    {/* Question / Subject Title */}
                    {msg.judul && (
                      <h4
                        className={`text-xs font-black ${
                          isFromTeacher && !isBroadcast ? "text-amber-300" : "text-slate-900"
                        }`}
                      >
                        {msg.judul}
                      </h4>
                    )}

                    {/* Content */}
                    <p
                      className={`text-xs leading-relaxed whitespace-pre-wrap ${
                        isFromTeacher && !isBroadcast ? "text-emerald-50" : "text-slate-700"
                      }`}
                    >
                      {msg.isiPesan}
                    </p>

                    {/* Lampiran if any */}
                    {msg.lampiran && (
                      <div
                        className={`p-2 rounded-xl flex items-center gap-2 text-xs font-bold ${
                          isFromTeacher && !isBroadcast
                            ? "bg-emerald-900/90 text-amber-300 border border-emerald-700"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        <Volume2 className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="truncate">{msg.lampiran.nama}</span>
                      </div>
                    )}

                    {/* Footer time */}
                    <div
                      className={`flex items-center justify-between text-[9px] pt-1 ${
                        isFromTeacher && !isBroadcast ? "text-emerald-300" : "text-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatWaktu(msg.waktu)}
                      </span>
                      {!isFromTeacher && (
                        <span className="font-bold text-slate-500 flex items-center gap-1">
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? "text-emerald-600" : "text-slate-400"}`} />
                          <span>{msg.isRead ? "Sudah Dibaca Guru" : "Terkirim"}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Compose Question Card */}
        <div id="siswa-composer-card" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b pb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Ajukan Pertanyaan Baru</h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih materi PAI dan tuliskan pertanyaan Anda
              </span>
            </div>
          </div>

          <form onSubmit={handleSendQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topik Materi PAI:</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {PAI_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Pertanyaan (Opsional):
              </label>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Contoh: Hukum Bacaan Nun Mati di Surah Al-Baqarah"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pertanyaan Anda: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Tuliskan pertanyaan materi PAI dengan sopan, santun, dan jelas..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none text-slate-900"
              />
            </div>

            {/* Audio Attachment Toggle */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="text-[11px]">
                  <strong className="text-slate-900 block font-bold">Lampirkan Audio Bacaan</strong>
                  <span className="text-slate-500">Kirim rekaman suara tajwid/hafalan</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIncludeAudioSim(!includeAudioSim)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  includeAudioSim
                    ? "bg-emerald-800 text-white font-black shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {includeAudioSim ? "Terlampir ✓" : "+ Tambah"}
              </button>
            </div>

            <button
              type="submit"
              disabled={!questionText.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-800 via-emerald-850 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Kirim Pertanyaan ke Pak Guru</span>
            </button>
          </form>

          {/* Etika Bertanya Note */}
          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
            <strong className="block font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Adab Menuntut Ilmu & Bertanya
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Mulailah pertanyaan dengan ucapan salam, gunakan bahasa yang sopan dan santun, serta cantumkan ayat atau bab yang ditanyakan secara jelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
