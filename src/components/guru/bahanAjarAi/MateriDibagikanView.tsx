/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Users,
  Eye,
  Trash2,
  CheckCircle2,
  Download,
  Printer,
  Globe,
  Lock,
  Layers,
  Sparkles
} from "lucide-react";
import { BahanAjarAiCompleteBundle } from "../../../types/bahanAjarAiModern";

interface MateriDibagikanViewProps {
  bundles: BahanAjarAiCompleteBundle[];
  onOpenGenerator: () => void;
  onOpenBundle: (bundle: BahanAjarAiCompleteBundle) => void;
}

interface RiwayatShare {
  id: string;
  namaMateri: string;
  kelasPenerima: string;
  jenisKonten: string;
  tanggalPublikasi: string;
  jumlahSiswa: number;
  status: "Dipublikasikan" | "Ditarik";
  selesaiMengerjakan: number;
  tokenLink: string;
}

export default function MateriDibagikanView({
  bundles,
  onOpenGenerator,
  onOpenBundle
}: MateriDibagikanViewProps) {
  // Share form states
  const [selectedBundleId, setSelectedBundleId] = useState<string>(bundles[0]?.id || "");
  const [targetKelas, setTargetKelas] = useState<string>("VII");
  const [jenisKonten, setJenisKonten] = useState<string>("Paket Lengkap");
  const [pesanPengantar, setPesanPengantar] = useState<string>(
    "Assalamu'alaikum wr. wb. Anak-anak hebat SMPN 2 Rebang Tangkas, silakan pelajari materi dan kerjakan tugas digital pada tautan pembelajaran berikut."
  );

  // Link copy toast
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Distribution history state (empty initially)
  const [riwayatList, setRiwayatList] = useState<RiwayatShare[]>([]);

  const currentSelectedBundle = bundles.find((b) => b.id === selectedBundleId) || bundles[0];

  const handleKirimKeSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedBundle) return;

    const newShare: RiwayatShare = {
      id: `share-${Date.now()}`,
      namaMateri: `${currentSelectedBundle.materi}: ${currentSelectedBundle.subMateri}`,
      kelasPenerima: `Kelas ${targetKelas}`,
      jenisKonten,
      tanggalPublikasi: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB",
      jumlahSiswa: targetKelas === "VII" ? 64 : targetKelas === "VIII" ? 60 : 58,
      status: "Dipublikasikan",
      selesaiMengerjakan: 0,
      tokenLink: `https://smpn2rebangtangkas.sch.id/belajar/pai-${targetKelas.toLowerCase()}-${Date.now().toString(36)}`
    };

    setRiwayatList([newShare, ...riwayatList]);
    setSuccessMsg(`Bahan ajar berhasil didistribusikan ke seluruh siswa Kelas ${targetKelas}!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleTarikPublikasi = (id: string) => {
    setRiwayatList(
      riwayatList.map((r) => (r.id === id ? { ...r, status: "Ditarik" } : r))
    );
  };

  const handleShareWa = (link: string, materi: string, kelasTarget: string) => {
    const text = encodeURIComponent(
      `*UPT SMPN 2 REBANG TANGKAS*\n*Materi Pembelajaran PAI & Budi Pekerti*\n\nKepada Siswa ${kelasTarget}:\n${pesanPengantar}\n\n📖 *Materi:* ${materi}\n🔗 *Link Akses Belajar:* ${link}\n\n_Guru Kreatif, Siswa Aktif_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Distribusi & Publikasi Bahan Ajar Siswa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Materi yang Dibagikan ke Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Publikasikan materi ke dashboard siswa Kelas VII, VIII, atau IX, salin tautan belajar, kirim melalui WhatsApp resmi, atau tarik akses materi kapan saja.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* FORM DISTRIBUSI BARU */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
            Formulir Publikasi Baru
          </span>
          <h3 className="text-xl font-black text-slate-900">
            Kirimkan Bahan Ajar ke Siswa
          </h3>
        </div>

        <form onSubmit={handleKirimKeSiswa} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pilih Materi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">1. Pilih Bahan Ajar:</label>
              <select
                value={selectedBundleId}
                onChange={(e) => setSelectedBundleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
              >
                {bundles.map((b) => (
                  <option key={b.id} value={b.id}>
                    Kelas {b.kelas}: {b.materi} ({b.subMateri})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Kelas */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">2. Target Siswa Penerima:</label>
              <select
                value={targetKelas}
                onChange={(e) => setTargetKelas(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
              >
                <option value="VII">Seluruh Siswa Kelas VII (VII-A, VII-B)</option>
                <option value="VIII">Seluruh Siswa Kelas VIII (VIII-A, VIII-B)</option>
                <option value="IX">Seluruh Siswa Kelas IX (IX-A, IX-B)</option>
                <option value="Semua">Semua Siswa SMPN 2 Rebang Tangkas</option>
              </select>
            </div>

            {/* Jenis Konten */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">3. Jenis Konten yang Dibagikan:</label>
              <select
                value={jenisKonten}
                onChange={(e) => setJenisKonten(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
              >
                <option value="Paket Lengkap">Paket Lengkap (Semua Media)</option>
                <option value="Materi Pembelajaran">Materi Teks & Dalil Saja</option>
                <option value="Video Pembelajaran">Video Pembelajaran</option>
                <option value="Game Edukasi">Game Edukasi Interaktif</option>
                <option value="LKPD Digital">LKPD Digital</option>
                <option value="LMS Kelas Digital">LMS Kelas Digital</option>
              </select>
            </div>
          </div>

          {/* Pesan Pengantar untuk WhatsApp */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">4. Pesan Pengantar Siswa / Wali Murid:</label>
            <textarea
              rows={2}
              value={pesanPengantar}
              onChange={(e) => setPesanPengantar(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>KIRIM KE SISWA</span>
            </button>
          </div>
        </form>
      </div>

      {/* RIWAYAT PENGIRIMAN & PUBLIKASI */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
              Riwayat Distribusi
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Daftar Materi yang Telah Dipublikasikan ({riwayatList.length})
            </h3>
          </div>
        </div>

        {riwayatList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-3xl block">📤</span>
            <p className="text-xs font-black text-slate-800">Belum Ada Riwayat Materi yang Dibagikan</p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Silakan pilih bahan ajar pada formulir di atas dan klik <strong>"KIRIM KE SISWA"</strong> untuk membagikan tautan pembelajaran ke peserta didik.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {riwayatList.map((riwayat) => (
            <div
              key={riwayat.id}
              className={`p-5 rounded-3xl border transition space-y-3 ${
                riwayat.status === "Dipublikasikan"
                  ? "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                  : "bg-slate-50/70 border-slate-200 opacity-70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        riwayat.status === "Dipublikasikan"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      ● {riwayat.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {riwayat.tanggalPublikasi}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">{riwayat.namaMateri}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>
                      🎯 Penerima: <strong>{riwayat.kelasPenerima}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      📦 Konten: <strong>{riwayat.jenisKonten}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      👥 Siswa: <strong>{riwayat.selesaiMengerjakan}/{riwayat.jumlahSiswa} selesai</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  <button
                    onClick={() => copyToClipboard(riwayat.tokenLink, riwayat.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === riwayat.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === riwayat.id ? "Tersalin!" : "SALIN LINK"}</span>
                  </button>

                  <button
                    onClick={() => handleShareWa(riwayat.tokenLink, riwayat.namaMateri, riwayat.kelasPenerima)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>BAGIKAN WHATSAPP</span>
                  </button>

                  {riwayat.status === "Dipublikasikan" && (
                    <button
                      onClick={() => handleTarikPublikasi(riwayat.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>TARIK PUBLIKASI</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
