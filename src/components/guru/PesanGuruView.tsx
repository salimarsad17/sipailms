/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  User,
  Users,
  CheckCheck,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  X,
  Volume2,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Guru, Siswa, Kelas, PesanPai } from "../../types";

interface PesanGuruViewProps {
  guru: Guru;
  students: Siswa[];
  classes: Kelas[];
  pesanList: PesanPai[];
  onSendPesan: (newPesan: PesanPai) => void;
  onMarkAsRead: (pesanIds: string[]) => void;
  onDeletePesan: (id: string) => void;
  initialSelectedStudentNisn?: string;
}

export default function PesanGuruView({
  guru,
  students,
  classes,
  pesanList,
  onSendPesan,
  onMarkAsRead,
  onDeletePesan,
  initialSelectedStudentNisn
}: PesanGuruViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "broadcast">("all");

  // Selected student conversation
  const [activeStudentNisn, setActiveStudentNisn] = useState<string>(() => {
    if (initialSelectedStudentNisn) return initialSelectedStudentNisn;
    // Default to the first student who sent a message or the first student in list
    const studentWithMsg = students.find((s) =>
      pesanList.some((p) => p.senderId === s.nisn || p.recipientId === s.nisn)
    );
    return studentWithMsg ? studentWithMsg.nisn : students[0]?.nisn || "0098765432";
  });

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyTopic, setReplyTopic] = useState("Al-Qur'an & Tajwid");
  const [includeAudioSim, setIncludeAudioSim] = useState(false);

  // New Broadcast / Message Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState<string>("KELAS:VII-A");
  const [broadcastTopic, setBroadcastTopic] = useState("Umum");
  const [broadcastJudul, setBroadcastJudul] = useState("");
  const [broadcastText, setBroadcastText] = useState("");

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

  const QUICK_TEMPLATES = [
    {
      label: "Ikhfa & Tajwid",
      text: "MasyaAllah pertanyaan yang sangat bagus. Pada hukum tajwid ikhfa haqiqi, suara nun mati/tanwin disamarkan dan didengungkan sepanjang 2 harakat ke arah huruf berikutnya. Silakan latih dengan audio di Bahan Ajar AI Bab 1 ya."
    },
    {
      label: "Sujud Sahwi",
      text: "Apabila kamu ragu jumlah rakaat sholat, ambillah bilangan yang terkecil (paling yakin), genapkan rakaat yang tersisa, lalu lakukan sujud sahwi dua kali sebelum salam dengan membaca 'Subhana man la yanamu wa la yashu'."
    },
    {
      label: "Tugas Diterima",
      text: "Alhamdulillah tugas setoran hafalanmu sudah bapak periksa dan nilai di LMS. Pelafalan makhraj hurufmu sudah sangat baik, terus pertahankan dan tingkatkan kelancaran hafalannya ya."
    },
    {
      label: "Semangat Belajar",
      text: "Terus semangat belajar Pendidikan Agama Islam. Jangan sungkan untuk bertanya kembali bila ada ayat, bacaan tajwid, atau fiqih ibadah yang belum dipahami."
    }
  ];

  // Group conversations by Student
  const conversations = useMemo(() => {
    const map = new Map<string, { student: Siswa; messages: PesanPai[]; unreadCount: number; lastMessage?: PesanPai }>();

    // Seed all known students so teacher can initiate message with any student
    students.forEach((s) => {
      map.set(s.nisn, {
        student: s,
        messages: [],
        unreadCount: 0,
        lastMessage: undefined
      });
    });

    // Populate with messages
    pesanList.forEach((msg) => {
      const targetNisn = msg.senderRole === "SISWA" ? msg.senderId : msg.recipientId;
      if (map.has(targetNisn)) {
        const item = map.get(targetNisn)!;
        item.messages.push(msg);
        if (!msg.isRead && msg.senderRole === "SISWA") {
          item.unreadCount += 1;
        }
      }
    });

    // Sort messages in each conversation chronologically
    map.forEach((item) => {
      item.messages.sort((a, b) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime());
      if (item.messages.length > 0) {
        item.lastMessage = item.messages[item.messages.length - 1];
      }
    });

    return Array.from(map.values());
  }, [students, pesanList]);

  // Broadcast announcements (messages where recipientRole is SEMUA_SISWA or recipientId starts with KELAS:)
  const broadcastMessages = useMemo(() => {
    return pesanList.filter(
      (p) => p.recipientRole === "SEMUA_SISWA" || p.recipientId.startsWith("KELAS:") || p.recipientId === "ALL"
    );
  }, [pesanList]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      // Search filter
      const matchSearch =
        item.student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.student.nisn.includes(searchQuery);
      if (!matchSearch) return false;

      // Class filter
      if (selectedClass !== "ALL" && item.student.kelasId !== selectedClass) {
        return false;
      }

      // Tab filter
      if (filterTab === "unread" && item.unreadCount === 0) {
        return false;
      }

      // Topic filter
      if (selectedTopic !== "ALL") {
        const hasTopic = item.messages.some((m) => m.topikMateri === selectedTopic);
        if (!hasTopic) return false;
      }

      return true;
    }).sort((a, b) => {
      // Unread first, then by last message time
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
      const timeA = a.lastMessage ? new Date(a.lastMessage.waktu).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.waktu).getTime() : 0;
      return timeB - timeA;
    });
  }, [conversations, searchQuery, selectedClass, selectedTopic, filterTab]);

  // Active student object and messages
  const activeStudent = students.find((s) => s.nisn === activeStudentNisn) || students[0];
  const activeConversation = conversations.find((c) => c.student.nisn === activeStudent?.nisn);
  const activeMessages = activeConversation ? activeConversation.messages : [];

  // When active conversation has unread messages, mark them as read
  const handleSelectStudent = (nisn: string) => {
    setActiveStudentNisn(nisn);
    const targetConv = conversations.find((c) => c.student.nisn === nisn);
    if (targetConv && targetConv.unreadCount > 0) {
      const unreadIds = targetConv.messages
        .filter((m) => !m.isRead && m.senderRole === "SISWA")
        .map((m) => m.id);
      if (unreadIds.length > 0) {
        onMarkAsRead(unreadIds);
      }
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeStudent) return;

    const newMsg: PesanPai = {
      id: `pesan-${Date.now()}`,
      senderRole: "GURU",
      senderId: guru.nip,
      senderNama: guru.nama,
      recipientRole: "SISWA",
      recipientId: activeStudent.nisn,
      recipientNama: activeStudent.nama,
      kelasId: activeStudent.kelasId,
      topikMateri: replyTopic,
      isiPesan: replyText.trim(),
      waktu: new Date().toISOString(),
      isRead: false,
      lampiran: includeAudioSim
        ? {
            tipe: "audio",
            nama: "Panduan Suara Bacaan Tajwid Guru PAI.mp3"
          }
        : undefined
    };

    onSendPesan(newMsg);
    setReplyText("");
    setIncludeAudioSim(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    let targetNama = "Seluruh Siswa";
    let kelasIdTarget: string | undefined = undefined;

    if (broadcastTarget.startsWith("KELAS:")) {
      kelasIdTarget = broadcastTarget.replace("KELAS:", "");
      targetNama = `Seluruh Siswa Kelas ${kelasIdTarget}`;
    }

    const newBroadcast: PesanPai = {
      id: `pesan-broadcast-${Date.now()}`,
      senderRole: "GURU",
      senderId: guru.nip,
      senderNama: guru.nama,
      recipientRole: "SEMUA_SISWA",
      recipientId: broadcastTarget,
      recipientNama: targetNama,
      kelasId: kelasIdTarget,
      topikMateri: broadcastTopic,
      judul: broadcastJudul.trim() || undefined,
      isiPesan: broadcastText.trim(),
      waktu: new Date().toISOString(),
      isRead: true
    };

    onSendPesan(newBroadcast);
    setBroadcastJudul("");
    setBroadcastText("");
    setIsBroadcastModalOpen(false);
  };

  // Stats calculation
  const totalIncomingQuestions = pesanList.filter((m) => m.senderRole === "SISWA").length;
  const totalUnread = pesanList.filter((m) => m.senderRole === "SISWA" && !m.isRead).length;
  const activeStudentsCount = new Set(
    pesanList.filter((m) => m.senderRole === "SISWA").map((m) => m.senderId)
  ).size;

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
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs px-3.5 py-1 rounded-full font-black shadow-md shadow-amber-500/20 border border-amber-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Komunikasi & Bimbingan Belajar PAI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Pesan & Tanya Jawab Materi PAI
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Fasilitasi diskusi interaktif, bimbingan tajwid Al-Qur'an, konsultasi fiqih ibadah, dan tanya jawab tugas LMS langsung antara Guru PAI dan seluruh siswa.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 border border-amber-300 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Kirim Pengumuman / Pesan Kelas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase">Pertanyaan Masuk</span>
            <span className="block text-2xl font-black text-slate-900">{totalIncomingQuestions} Pertanyaan</span>
            <span className="block text-[11px] text-emerald-700 font-bold">Materi PAI Terdata</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase">Perlu Dijawab / Baru</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{totalUnread} Pesan</span>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                  Menunggu
                </span>
              )}
            </div>
            <span className="block text-[11px] text-amber-700 font-bold">Respon cepat pendidik</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-extrabold uppercase">Siswa Aktif Tanya</span>
            <span className="block text-2xl font-black text-slate-900">{activeStudentsCount} Siswa</span>
            <span className="block text-[11px] text-blue-700 font-bold">Interaksi belajar dua arah</span>
          </div>
        </div>
      </div>

      {/* Broadcast Announcements Banner List if any */}
      {broadcastMessages.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              Pengumuman & Siaran Guru Terkini
            </h3>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
              {broadcastMessages.length} Pengumuman Terbit
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {broadcastMessages.slice(0, 2).map((bc) => (
              <div key={bc.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-amber-200 text-amber-950 rounded">
                      {bc.recipientNama}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-800 px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                      {bc.topikMateri}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{formatWaktu(bc.waktu)}</span>
                </div>
                {bc.judul && <p className="text-xs font-black text-slate-900">{bc.judul}</p>}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{bc.isiPesan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Messaging Hub (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[640px]">
        {/* Left Column: Student Contacts & Filter Pane */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NISN siswa..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">Semua Kelas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.id}
                  </option>
                ))}
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold focus:outline-none truncate"
              >
                <option value="ALL">Semua Topik PAI</option>
                {PAI_TOPICS.map((topik) => (
                  <option key={topik} value={topik}>
                    {topik}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-black transition cursor-pointer ${
                  filterTab === "all"
                    ? "bg-emerald-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("unread")}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                  filterTab === "unread"
                    ? "bg-amber-500 text-slate-950 font-black shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>Belum Dibalas</span>
                {totalUnread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[560px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">Tidak ada siswa ditemukan</p>
                <p className="text-[11px]">Coba ubah kata kunci pencarian atau filter kelas.</p>
              </div>
            ) : (
              filteredConversations.map((item) => {
                const isSelected = item.student.nisn === activeStudent?.nisn;
                const lastMsg = item.lastMessage;

                return (
                  <div
                    key={item.student.nisn}
                    onClick={() => handleSelectStudent(item.student.nisn)}
                    className={`p-3.5 transition cursor-pointer flex items-start gap-3 text-left ${
                      isSelected
                        ? "bg-emerald-50/80 border-l-4 border-emerald-800"
                        : "hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 font-black text-sm flex items-center justify-center border border-emerald-700/40 shadow-xs">
                        {item.student.nama.charAt(0)}
                      </div>
                      {item.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                          {item.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {item.student.nama}
                        </span>
                        {lastMsg && (
                          <span className="text-[9px] text-slate-400 font-mono shrink-0">
                            {formatWaktu(lastMsg.waktu).split(",")[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {item.student.kelasId}
                        </span>
                        {lastMsg && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 truncate max-w-[120px]">
                            {lastMsg.topikMateri}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 truncate leading-tight">
                        {lastMsg ? (
                          <>
                            {lastMsg.senderRole === "GURU" && <span className="font-bold text-slate-700">Anda: </span>}
                            {lastMsg.isiPesan}
                          </>
                        ) : (
                          <span className="italic text-slate-400">Belum ada percakapan</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full bg-white">
          {activeStudent ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 font-black text-sm flex items-center justify-center border border-emerald-700/50 shadow-xs">
                    {activeStudent.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-slate-900">{activeStudent.nama}</h2>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                        Kelas {activeStudent.kelasId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>NISN: <strong className="font-mono text-slate-700">{activeStudent.nisn}</strong></span>
                      <span>•</span>
                      <span>Agama: {activeStudent.agama}</span>
                      {activeStudent.kontakOrangTua && (
                        <>
                          <span>•</span>
                          <span>HP/WA: {activeStudent.kontakOrangTua}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aktif Berkonsultasi</span>
                  </span>
                </div>
              </div>

              {/* Message Bubbles Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[440px] bg-slate-50/30">
                {activeMessages.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 space-y-2">
                    <BookOpen className="w-10 h-10 mx-auto text-emerald-200" />
                    <h3 className="text-xs font-black text-slate-700">Mulai Percakapan dengan Siswa</h3>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Kirimkan bimbingan materi PAI, motivasi ibadah, atau instruksi setoran hafalan menggunakan formulir di bawah.
                    </p>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isFromGuru = msg.senderRole === "GURU";

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isFromGuru ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs space-y-2 relative text-left ${
                            isFromGuru
                              ? "bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-tr-none border border-emerald-800"
                              : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                          }`}
                        >
                          {/* Sender & Topic metadata */}
                          <div className="flex items-center justify-between gap-2 border-b pb-1.5 text-[10px] border-white/10">
                            <span className={`font-black ${isFromGuru ? "text-amber-400" : "text-emerald-800"}`}>
                              {isFromGuru ? `Anda (${guru.nama})` : msg.senderNama}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-extrabold text-[9px] ${
                                isFromGuru
                                  ? "bg-emerald-800 text-emerald-200"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {msg.topikMateri}
                            </span>
                          </div>

                          {/* Subject if any */}
                          {msg.judul && (
                            <h4
                              className={`text-xs font-black ${
                                isFromGuru ? "text-amber-300" : "text-slate-900"
                              }`}
                            >
                              {msg.judul}
                            </h4>
                          )}

                          {/* Message Body */}
                          <p
                            className={`text-xs leading-relaxed whitespace-pre-wrap ${
                              isFromGuru ? "text-emerald-50" : "text-slate-700"
                            }`}
                          >
                            {msg.isiPesan}
                          </p>

                          {/* Attachment if any */}
                          {msg.lampiran && (
                            <div
                              className={`p-2 rounded-xl flex items-center gap-2 text-xs font-bold ${
                                isFromGuru
                                  ? "bg-emerald-800/80 text-amber-300 border border-emerald-700"
                                  : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                              }`}
                            >
                              <Volume2 className="w-4 h-4 shrink-0 text-amber-400" />
                              <span className="truncate">{msg.lampiran.nama}</span>
                            </div>
                          )}

                          {/* Timestamp & Status */}
                          <div
                            className={`flex items-center justify-end gap-1.5 pt-1 text-[9px] ${
                              isFromGuru ? "text-emerald-300" : "text-slate-400"
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formatWaktu(msg.waktu)}</span>
                            {isFromGuru && (
                              <CheckCheck
                                className={`w-3.5 h-3.5 ml-1 ${
                                  msg.isRead ? "text-amber-400" : "text-emerald-400"
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Template Replies for Guru */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-black text-slate-500 uppercase shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Template Jawaban:
                </span>
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReplyText(tmpl.text);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 rounded-lg text-[10px] font-bold transition shadow-2xs cursor-pointer"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Topik Materi:</span>
                    <select
                      value={replyTopic}
                      onChange={(e) => setReplyTopic(e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:outline-none"
                    >
                      {PAI_TOPICS.map((topik) => (
                        <option key={topik} value={topik}>
                          {topik}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIncludeAudioSim(!includeAudioSim)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      includeAudioSim
                        ? "bg-amber-100 text-amber-900 border border-amber-300 font-black"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{includeAudioSim ? "Audio Aktif" : "+ Lampirkan Audio Tajwid"}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Ketik penjelasan atau jawaban bimbingan materi PAI untuk ${activeStudent.nama}...`}
                    className="flex-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition resize-none font-medium text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-5 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md shadow-emerald-950/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">Pilih Siswa untuk Memulai Percakapan</h3>
              <p className="text-xs text-slate-500">
                Pilih salah satu siswa dari daftar di sebelah kiri untuk melihat riwayat tanya jawab materi PAI.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Message Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Kirim Pengumuman / Pesan Kelas</h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Kirim informasi belajar PAI sekaligus ke seluruh siswa satu kelas
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Penerima:</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ALL">Seluruh Siswa (Semua Kelas)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={`KELAS:${c.id}`}>
                      Seluruh Siswa Kelas {c.id} ({c.totalSiswa} Siswa)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik Materi PAI:</label>
                <select
                  value={broadcastTopic}
                  onChange={(e) => setBroadcastTopic(e.target.value)}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman (Opsional):</label>
                <input
                  type="text"
                  value={broadcastJudul}
                  onChange={(e) => setBroadcastJudul(e.target.value)}
                  placeholder="Contoh: Pengingat Setoran Hafalan Surat Pendek"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pesan Pengumuman:</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="Tuliskan arahan, tugas belajar, atau pengingat ibadah untuk para murid..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim Pengumuman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
