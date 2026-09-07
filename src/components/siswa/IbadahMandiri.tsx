/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Calendar, Check, Save, Heart, ShieldCheck, Star, Info, TrendingUp } from "lucide-react";
import { Siswa, JurnalIbadahHarian } from "../../types";

interface IbadahMandiriProps {
  siswa: Siswa;
  worships: JurnalIbadahHarian[];
  onAddWorship: (newWorship: JurnalIbadahHarian) => void;
}

export default function IbadahMandiri({
  siswa,
  worships,
  onAddWorship
}: IbadahMandiriProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Find if there is already a record for today
  const todayRecord = worships.find(
    (w) => w.siswaNisn === siswa.nisn && w.tanggal === todayStr
  );

  // Active form state (default to existing today's record or blank)
  const [formData, setFormData] = useState<JurnalIbadahHarian>({
    siswaNisn: siswa.nisn,
    tanggal: todayStr,
    sholatSubuh: todayRecord?.sholatSubuh || false,
    sholatDzuhur: todayRecord?.sholatDzuhur || false,
    sholatAshar: todayRecord?.sholatAshar || false,
    sholatMaghrib: todayRecord?.sholatMaghrib || false,
    sholatIsya: todayRecord?.sholatIsya || false,
    sholatDhuha: todayRecord?.sholatDhuha || false,
    membacaAlQuranAyat: todayRecord?.membacaAlQuranAyat || 0,
    membacaAlQuranSurah: todayRecord?.membacaAlQuranSurah || "",
    membantuOrangTua: todayRecord?.membantuOrangTua || false,
    catatanKebaikan: todayRecord?.catatanKebaikan || ""
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCheckboxToggle = (field: keyof JurnalIbadahHarian) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field] as any
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWorship(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Extract weekly records for active student
  const studentHistory = worships.filter((w) => w.siswaNisn === siswa.nisn);

  return (
    <div className="space-y-6">
      {/* Save Notification alert */}
      {saveSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-800 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-700 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>
            Jurnal Ibadah Harian Anda berhasil disimpan dan disinkronkan ke Dasbor Guru!
          </span>
        </div>
      )}

      {/* Main Form container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-emerald-600" />
                Catatan Ibadah Mandiri Harian
              </h3>
              <p className="text-xs text-slate-500">Pantaulah kedisiplinan ibadah Anda secara jujur dan istiqomah.</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">
              Hari ini: Senin, 13 Juli 2026
            </span>
          </div>

          {/* Section 1: Sholat 5 Waktu */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Kedisiplinan Shalat Fardhu (5 Waktu)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Subuh", key: "sholatSubuh" as const },
                { label: "Dzuhur", key: "sholatDzuhur" as const },
                { label: "Ashar", key: "sholatAshar" as const },
                { label: "Maghrib", key: "sholatMaghrib" as const },
                { label: "Isya", key: "sholatIsya" as const }
              ].map((sholat) => (
                <button
                  key={sholat.key}
                  type="button"
                  onClick={() => handleCheckboxToggle(sholat.key)}
                  className={`p-3.5 rounded-xl border transition flex flex-col items-center justify-center gap-1 font-semibold text-xs ${
                    formData[sholat.key]
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100/50"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">{sholat.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    formData[sholat.key] ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                  }`}>
                    {formData[sholat.key] && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Sholat Sunnah & Tilawah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sholat Dhuha Toggle */}
            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">Shalat Dhuha</span>
                <span className="text-[10px] text-slate-400">Melaksanakan shalat dhuha pagi hari</span>
              </div>
              <button
                type="button"
                onClick={() => handleCheckboxToggle("sholatDhuha")}
                className={`w-12 h-6 rounded-full transition duration-300 relative ${
                  formData.sholatDhuha ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all duration-300 ${
                  formData.sholatDhuha ? "right-1" : "left-1"
                }`}></span>
              </button>
            </div>

            {/* Help Parents Toggle */}
            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  Membantu Orang Tua <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </span>
                <span className="text-[10px] text-slate-400">Membantu menyapu, cuci piring, dll.</span>
              </div>
              <button
                type="button"
                onClick={() => handleCheckboxToggle("membantuOrangTua")}
                className={`w-12 h-6 rounded-full transition duration-300 relative ${
                  formData.membantuOrangTua ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all duration-300 ${
                  formData.membantuOrangTua ? "right-1" : "left-1"
                }`}></span>
              </button>
            </div>
          </div>

          {/* Section 3: Membaca Al-Qur'an */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-3.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Tadarus Al-Qur'an Mandiri
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Surah / Ayat Yang Dibaca
                </label>
                <input
                  type="text"
                  placeholder="Contoh: An-Naba' Ayat 1-10"
                  value={formData.membacaAlQuranSurah}
                  onChange={(e) => setFormData({ ...formData, membacaAlQuranSurah: e.target.value })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Jumlah Ayat Terbaca
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.membacaAlQuranAyat}
                  onChange={(e) => setFormData({ ...formData, membacaAlQuranAyat: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Good Deeds notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Catatan Kebaikan & Akhlak Hari Ini
            </label>
            <textarea
              placeholder="Tuliskan amalan baik yang Anda lakukan hari ini (Contoh: Menyingkirkan duri di jalanan, bersedekah di mushola, dsb.)"
              value={formData.catatanKebaikan}
              onChange={(e) => setFormData({ ...formData, catatanKebaikan: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white min-h-[70px]"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-emerald-700/10"
              id="btn-save-worship"
            >
              <Save className="w-4 h-4" />
              Simpan Jurnal Ibadah
            </button>
          </div>
        </form>

        {/* Weekly Progress Tracker Card (Right pane) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                Histori Ibadah Pekan Ini
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Berikut rekapitulasi pelaporan ibadah mandiri Anda yang sudah masuk ke lembar pembinaan wali kelas.
              </p>

              {studentHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada histori terisi pekan ini.</p>
              ) : (
                <div className="space-y-3">
                  {studentHistory.map((hist, idx) => {
                    const totalTicked =
                      Number(hist.sholatSubuh) +
                      Number(hist.sholatDzuhur) +
                      Number(hist.sholatAshar) +
                      Number(hist.sholatMaghrib) +
                      Number(hist.sholatIsya) +
                      Number(hist.sholatDhuha);

                    return (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center text-slate-700"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-slate-400 text-xs shrink-0 mt-0.5">{idx + 1}.</span>
                          <div className="space-y-0.5 text-left">
                            <span className="font-extrabold block text-slate-900">{hist.tanggal}</span>
                            {hist.membacaAlQuranAyat > 0 ? (
                              <span className="block text-[10px] text-emerald-800 font-bold">
                                📖 Tilawah: {hist.membacaAlQuranSurah}
                              </span>
                            ) : (
                              <span className="block text-[10px] text-slate-400">Tilawah: Belum</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full">
                            Sholat: {totalTicked} / 6
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 text-[10px] text-slate-400 leading-relaxed font-medium flex gap-1 items-start">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Setiap entri yang dikirimkan dipantau langsung oleh guru PAI sebagai bobot penilaian karakter & akhlak mulia siswa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
