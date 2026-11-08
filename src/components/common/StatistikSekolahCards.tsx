/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, GraduationCap, Layers, Smile, Users } from "lucide-react";

interface StatistikSekolahCardsProps {
  jumlahAkunTerdaftar?: number;
  jumlahAkun?: number;
  dataAkun?: number;
  jumlahRuangKelas?: number;
  dataGuru?: number;
  jumlahGuru?: number;
  teachersCount?: number;
  dataKelas?: number;
  jumlahKelas?: number;
  jumlahTendik?: number;
  dataSiswa?: number;
  jumlahPesertaDidik?: number;
  studentsCount?: number;
  jumlahRombel?: number;
  className?: string;
}

export default function StatistikSekolahCards({
  jumlahAkunTerdaftar,
  jumlahAkun,
  dataAkun,
  jumlahRuangKelas,
  dataGuru,
  jumlahGuru,
  teachersCount,
  dataKelas,
  jumlahKelas,
  jumlahTendik,
  dataSiswa,
  jumlahPesertaDidik,
  studentsCount,
  jumlahRombel = 8,
  className = ""
}: StatistikSekolahCardsProps) {
  const displayAkunCount = jumlahAkunTerdaftar ?? jumlahAkun ?? dataAkun ?? jumlahRuangKelas ?? 0;
  const displayGuruCount = dataGuru ?? teachersCount ?? jumlahGuru ?? 1;
  const displayKelasCount = dataKelas ?? jumlahKelas ?? (jumlahTendik !== undefined ? jumlahTendik : 4);
  const displaySiswaCount = dataSiswa ?? studentsCount ?? jumlahPesertaDidik ?? 0;

  const cards = [
    {
      id: "akun-terdaftar",
      label: "Jumlah Akun Yang Terdaftar",
      value: displayAkunCount,
      icon: <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#6259ca] to-[#5143b8]" // Purple / Indigo
    },
    {
      id: "data-guru",
      label: "Data Guru",
      value: displayGuruCount,
      icon: <GraduationCap className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#00b4d8] to-[#0096c7]" // Cyan / Sky
    },
    {
      id: "data-kelas",
      label: "Data Kelas",
      value: displayKelasCount,
      icon: <Layers className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#f75834] to-[#ea3a12]" // Orange / Coral
    },
    {
      id: "data-siswa",
      label: "Data Siswa",
      value: displaySiswaCount,
      icon: <Smile className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#00a86b] to-[#008f5a]" // Emerald / Green
    },
    {
      id: "rombel",
      label: "Jumlah Rombel",
      value: jumlahRombel,
      icon: <Users className="w-6 h-6 text-white stroke-[2.2]" />,
      gradient: "from-[#e91e63] to-[#c2185b]" // Pink / Magenta
    }
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 ${className}`}>
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-r ${card.gradient} shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between min-h-[96px]`}
        >
          {/* Ambient soft concentric circles matching the screenshot */}
          <div className="w-28 h-28 rounded-full bg-white/10 absolute -right-6 -bottom-6 pointer-events-none" />
          <div className="w-18 h-18 rounded-full bg-white/15 absolute -right-2 -bottom-2 pointer-events-none" />

          {/* Left: Label & Big Numeric Value */}
          <div className="relative z-10 pr-2">
            <span className="block text-xs sm:text-[13px] font-bold text-white/95 tracking-tight leading-tight">
              {card.label}
            </span>
            <span className="block text-3xl sm:text-4xl font-black font-mono tracking-tight text-white leading-none mt-2">
              {card.value}
            </span>
          </div>

          {/* Right: Circular Icon Badge */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
