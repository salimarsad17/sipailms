/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, CheckCheck, Clock, BookOpen, ChevronRight, X } from "lucide-react";
import { PesanPai } from "../../types";

interface NotificationBellProps {
  role: "GURU" | "SISWA";
  currentUserId: string; // NIP Guru or NISN Siswa
  pesanList: PesanPai[];
  onOpenPesan: (targetIdentifier?: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationBell({
  role,
  currentUserId,
  pesanList,
  onOpenPesan,
  onMarkAllAsRead
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter messages relevant to current user
  const relevantMessages = pesanList.filter((m) => {
    if (role === "GURU") {
      return m.recipientRole === "GURU" || m.senderRole === "SISWA";
    } else {
      // Siswa
      return (
        m.recipientId === currentUserId ||
        m.recipientRole === "SEMUA_SISWA" ||
        m.recipientId === "ALL" ||
        (m.recipientId.startsWith("KELAS:") && m.senderRole === "GURU") ||
        (m.senderId === currentUserId && m.senderRole === "SISWA")
      );
    }
  });

  // Calculate unread for current user
  const unreadMessages = relevantMessages.filter((m) => {
    if (m.isRead) return false;
    if (role === "GURU") {
      return m.senderRole === "SISWA";
    } else {
      return m.senderRole === "GURU";
    }
  });

  const unreadCount = unreadMessages.length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatWaktu = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    } catch {
      return isoString;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
        title="Notifikasi Pesan & Tanya Jawab PAI"
        aria-label="Notifikasi Pesan"
      >
        <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${unreadCount > 0 ? "text-amber-500 animate-bounce" : "text-slate-600"}`} />
        <span className="hidden sm:inline text-xs font-bold text-slate-700">Pesan</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
                  Pesan & Tanya Jawab PAI
                </h3>
                <span className="text-[10px] text-amber-300 font-medium">
                  {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua pesan telah dibaca"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-600 text-[11px] uppercase tracking-wider">
              {role === "GURU" ? "Pertanyaan Siswa Terbaru" : "Pemberitahuan & Jawaban Guru"}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onMarkAllAsRead();
                }}
                className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          {/* Message List */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
            {relevantMessages.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                <p className="text-xs font-bold text-slate-600">Belum ada pesan masuk</p>
                <p className="text-[11px]">Gunakan menu Pesan untuk mulai tanya jawab materi PAI.</p>
              </div>
            ) : (
              relevantMessages.slice(0, 6).map((msg) => {
                const isMsgUnread = !msg.isRead && (
                  (role === "GURU" && msg.senderRole === "SISWA") ||
                  (role === "SISWA" && msg.senderRole === "GURU")
                );

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setIsOpen(false);
                      onOpenPesan(role === "GURU" ? msg.senderId : undefined);
                    }}
                    className={`p-3.5 hover:bg-emerald-50/60 transition cursor-pointer text-left space-y-1 ${
                      isMsgUnread ? "bg-amber-50/70 border-l-4 border-amber-500" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                        <span className="text-xs font-black text-slate-900 truncate">
                          {msg.senderNama}
                        </span>
                        {msg.kelasId && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded shrink-0">
                            {msg.kelasId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatWaktu(msg.waktu)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {msg.topikMateri}
                      </span>
                      {msg.judul && (
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          {msg.judul}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {msg.isiPesan}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenPesan();
              }}
              className="w-full py-2 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 transition cursor-pointer"
            >
              <span>Buka Menu Pesan & Tanya Jawab</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
