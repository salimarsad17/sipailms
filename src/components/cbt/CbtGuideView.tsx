/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Database, Terminal, ShieldAlert, RefreshCw } from "lucide-react";
import { SchemaDiagnostics } from "../../services/cbtSupabaseService";

interface CbtGuideViewProps {
  schemaStatus: SchemaDiagnostics | null;
  onRecheckSchema: () => Promise<void>;
}

export default function CbtGuideView({ schemaStatus, onRecheckSchema }: CbtGuideViewProps) {
  const [checking, setChecking] = useState(false);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-500" />
            <h2 className="font-display text-lg font-extrabold">
              Status Koneksi & Skema 12 Tabel Supabase
            </h2>
          </div>
          <button
            type="button"
            onClick={async () => {
              setChecking(true);
              await onRecheckSchema();
              setChecking(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
            <span>Periksa Ulang</span>
          </button>
        </div>

        {schemaStatus?.ready ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Seluruh 12 tabel inti CBT PAI SMART telah aktif di Supabase.</span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-extrabold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Tabel yang belum ditemukan di database Supabase:</span>
            </div>
            <p className="font-mono-code">
              {schemaStatus?.missingTables.join(", ") || "Memeriksa..."}
            </p>
            <p>
              Jalankan berkas <code>supabase/migrations/001_cbt_pai_smart_schema.sql</code> dan{" "}
              <code>supabase/migrations/002_rls_policies.sql</code> melalui SQL Editor di Dashboard Supabase Anda.
            </p>
          </div>
        )}
      </div>

      {/* Edge Functions Deployment */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-500" />
          <h3 className="font-display text-base font-extrabold">
            Deploy Supabase Edge Functions (Keamanan Ujian & Penilaian Otomatis)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Untuk menjamin kunci jawaban tidak pernah dikirim ke browser siswa dan nilai dihitung aman di backend, deploy 5 Edge Functions berikut menggunakan Supabase CLI:
        </p>
        <pre className="p-3.5 rounded-xl bg-slate-950 text-sky-300 font-mono-code text-xs overflow-x-auto">
{`supabase functions deploy start-exam
supabase functions deploy save-answer
supabase functions deploy submit-exam
supabase functions deploy grade-essay
supabase functions deploy manage-users`}
        </pre>
      </div>

      {/* Panduan Penggunaan */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1B3B] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-500" />
          <h3 className="font-display text-base font-extrabold">
            Panduan Penggunaan CBT PAI SMART
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-extrabold text-sky-700 dark:text-sky-300">Alur Kerja Guru PAI</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>Masuk ke menu <strong>Manajemen Data</strong> untuk mengisi Tahun Pelajaran, Kelas (VII–IX), Mata Pelajaran, Materi PAI, dan Data + Akun Siswa (atau impor Excel).</li>
              <li>Buka <strong>Bank Soal</strong> untuk membuat 6 jenis soal atau impor soal massal menggunakan Template Excel.</li>
              <li>Buka <strong>Buat Ujian</strong> untuk menyusun ujian, menentukan tanggal/durasi/kode akses/KKTP, serta memilih butir soal.</li>
              <li>Setelah siswa selesai ujian, pantau skor pada menu <strong>Hasil & Nilai</strong> (koreksi esai jika ada), unduh laporan PDF/Excel, dan cek <strong>Analisis Soal</strong>.</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Alur Ujian Siswa</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>Siswa masuk menggunakan NISN/Username dan kata sandi yang diberikan oleh Guru.</li>
              <li>Identitas siswa (Nama, Kelas, Nomor Peserta) tampil otomatis di portal siswa.</li>
              <li>Klik <strong>Kerjakan Ujian</strong>, periksa rincian soal & durasi, masukkan Kode Akses dari pengawas, lalu klik <strong>MULAI UJIAN</strong>.</li>
              <li>Jawaban tersimpan otomatis ke Supabase. Jika koneksi terputus, jawaban disimpan lokal dan otomatis tersinkron kembali saat online.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
