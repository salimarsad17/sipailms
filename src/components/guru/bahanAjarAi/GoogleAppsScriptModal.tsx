/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  Save,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Code
} from "lucide-react";
import { BahanAjarAiStorage } from "../../../services/bahanAjarAiStorage";

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleAppsScriptModal({ isOpen, onClose }: GoogleAppsScriptModalProps) {
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => BahanAjarAiStorage.getAppsScriptUrl());
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const sheetsList = [
    "1. USERS (Akun Guru & Siswa)",
    "2. KELAS (Daftar Tingkat & Rombel)",
    "3. MATERI (Materi Pokok PAI)",
    "4. SUB_MATERI (Sub Materi Kurikulum)",
    "5. BAHAN_AJAR (Data Paket Lengkap)",
    "6. VIDEO (Storyboard & Prompt Video)",
    "7. GAME (Kuis & Susun Kata)",
    "8. TTS (Grid & Petunjuk TTS)",
    "9. LKPD (5 Aktivitas & Penilaian)",
    "10. CBT (Jadwal & Header Ujian)",
    "11. CBT_SOAL (Bank Soal CBT)",
    "12. HASIL_CBT (Rekap Nilai Siswa)",
    "13. HASIL_GAME (Rekap Skor Game)",
    "14. SETTINGS (Konfigurasi Aplikasi)"
  ];

  const appsScriptCode = `/**
 * GOOGLE APPS SCRIPT REST API - BAHAN AJAR AI PAI SMP
 * Deployment: Web App (Access: Anyone)
 */

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === "getKelas") {
      const sheet = ss.getSheetByName("KELAS");
      const data = sheet ? sheet.getDataRange().getValues() : [];
      return createJsonResponse({ success: true, data: data });
    }
    
    if (action === "getMateri") {
      const sheet = ss.getSheetByName("MATERI");
      const data = sheet ? sheet.getDataRange().getValues() : [];
      return createJsonResponse({ success: true, data: data });
    }
    
    if (action === "getSubMateri") {
      const sheet = ss.getSheetByName("SUB_MATERI");
      const data = sheet ? sheet.getDataRange().getValues() : [];
      return createJsonResponse({ success: true, data: data });
    }
    
    if (action === "getBahanAjar") {
      const sheet = ss.getSheetByName("BAHAN_AJAR");
      const data = sheet ? sheet.getDataRange().getValues() : [];
      return createJsonResponse({ success: true, data: data });
    }

    return createJsonResponse({
      success: true,
      message: "API Bahan Ajar AI PAI Aktif",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const payload = postData.payload;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Simpan Paket Bahan Ajar
    if (action === "saveBahanAjar") {
      let sheet = ss.getSheetByName("BAHAN_AJAR");
      if (!sheet) sheet = ss.insertSheet("BAHAN_AJAR");
      sheet.appendRow([
        payload.id,
        new Date().toISOString(),
        payload.guruNama,
        payload.kelas,
        payload.materi,
        payload.subMateri,
        JSON.stringify(payload)
      ]);
      return createJsonResponse({ success: true, message: "Bahan ajar berhasil disimpan ke Google Sheets" });
    }

    // 2. Simpan Hasil CBT Siswa
    if (action === "saveHasilCBT") {
      let sheet = ss.getSheetByName("HASIL_CBT");
      if (!sheet) sheet = ss.insertSheet("HASIL_CBT");
      sheet.appendRow([
        payload.id,
        payload.cbtJudul,
        payload.siswaNisn,
        payload.siswaNama,
        payload.kelasId,
        payload.nilai,
        payload.jumlahBenar,
        payload.tanggalUjian
      ]);
      return createJsonResponse({ success: true, message: "Hasil CBT tersimpan" });
    }

    // 3. Simpan Hasil Game
    if (action === "saveHasilGame") {
      let sheet = ss.getSheetByName("HASIL_GAME");
      if (!sheet) sheet = ss.insertSheet("HASIL_GAME");
      sheet.appendRow([
        payload.id,
        payload.gameTipe,
        payload.gameJudul,
        payload.siswaNama,
        payload.skor,
        payload.tanggalMain
      ]);
      return createJsonResponse({ success: true, message: "Hasil game tersimpan" });
    }

    return createJsonResponse({ success: false, message: "Aksi tidak dikenali" });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Inisialisasi Otomatis 14 Sheet
function setupAll14Sheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = [
    "USERS", "KELAS", "MATERI", "SUB_MATERI", "BAHAN_AJAR", 
    "VIDEO", "GAME", "TTS", "LKPD", "CBT", "CBT_SOAL", 
    "HASIL_CBT", "HASIL_GAME", "SETTINGS"
  ];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
}
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveUrl = () => {
    BahanAjarAiStorage.saveAppsScriptUrl(appsScriptUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Integrasi Database Google Sheets & Apps Script
              </h3>
              <p className="text-xs text-slate-500">
                Arsitektur database cloud menggunakan 14 Sheet dan REST API Google Apps Script.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. URL Apps Script Form */}
        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Web App URL Google Apps Script:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-blue-600"
            />
            <button
              onClick={handleSaveUrl}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? "Tersimpan!" : "Simpan URL"}</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Dapat juga dikonfigurasi melalui Environment Variable: <code>GOOGLE_APPS_SCRIPT_URL</code>
          </span>
        </div>

        {/* 2. Struktur 14 Sheet */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 block flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Struktur 14 Sheet Database (Sesuai Poin 12):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {sheetsList.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Apps Script Code Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              Kode Google Apps Script (REST API Siap Pakai):
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Kode Apps Script"}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
            {appsScriptCode}
          </pre>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
