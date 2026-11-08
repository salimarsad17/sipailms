/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RekapNilaiTotal, Siswa } from "../types";

export const REKAP_PAI_HEADERS = [
  "No",
  "NISN",
  "Nama Siswa",
  "Kelas",
  "Formatif Kuis",
  "Formatif Tugas",
  "Formatif Diskusi",
  "Sumatif PTS",
  "Sumatif PAS",
  "Hafalan Juz Amma",
  "Praktik Sholat",
  "Praktik Wudhu",
  "Nilai Akhir",
  "Predikat"
];

export function getUnifiedRekapNilaiList(
  rekapList: RekapNilaiTotal[],
  studentsList: Siswa[]
): RekapNilaiTotal[] {
  const map = new Map<string, RekapNilaiTotal>();
  rekapList.forEach((r) => {
    if (r.siswaNisn) map.set(r.siswaNisn, r);
  });

  return studentsList.map((s) => {
    const existing = map.get(s.nisn);
    if (existing) {
      return {
        ...existing,
        siswaNama: s.nama,
        kelasId: s.kelasId
      };
    }
    return {
      siswaNisn: s.nisn,
      siswaNama: s.nama,
      kelasId: s.kelasId,
      formatifKuis: 80,
      formatifTugas: 80,
      formatifDiskusi: 80,
      sumatifPts: 80,
      sumatifPas: 80,
      hafalanJuzAmmaScore: 80,
      praktikSholat: 80,
      praktikWudhu: 80
    };
  });
}

function calculateAverage(r: RekapNilaiTotal): number {
  const scores = [
    r.formatifKuis,
    r.formatifTugas,
    r.formatifDiskusi,
    r.sumatifPts,
    r.sumatifPas,
    r.hafalanJuzAmmaScore,
    r.praktikSholat,
    r.praktikWudhu
  ];
  const sum = scores.reduce((acc, val) => acc + (Number(val) || 0), 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

function getPredikat(avg: number): string {
  if (avg >= 90) return "A (Sangat Baik)";
  if (avg >= 80) return "B (Baik)";
  if (avg >= 70) return "C (Cukup)";
  return "D (Perlu Bimbingan)";
}

export function formatRekapRow(r: RekapNilaiTotal, idx: number): (string | number)[] {
  const avg = calculateAverage(r);
  return [
    idx + 1,
    r.siswaNisn,
    r.siswaNama,
    r.kelasId || "-",
    r.formatifKuis || 0,
    r.formatifTugas || 0,
    r.formatifDiskusi || 0,
    r.sumatifPts || 0,
    r.sumatifPas || 0,
    r.hafalanJuzAmmaScore || 0,
    r.praktikSholat || 0,
    r.praktikWudhu || 0,
    avg,
    getPredikat(avg)
  ];
}

export function formatRekapSummaryRow(
  list: RekapNilaiTotal[],
  label: string
): (string | number)[] {
  if (list.length === 0) {
    return ["", "", `Rata-rata (${label})`, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, ""];
  }

  const sumKey = (key: keyof RekapNilaiTotal) =>
    Math.round(
      (list.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0) / list.length) * 10
    ) / 10;

  const avgKuis = sumKey("formatifKuis");
  const avgTugas = sumKey("formatifTugas");
  const avgDiskusi = sumKey("formatifDiskusi");
  const avgPts = sumKey("sumatifPts");
  const avgPas = sumKey("sumatifPas");
  const avgHafalan = sumKey("hafalanJuzAmmaScore");
  const avgSholat = sumKey("praktikSholat");
  const avgWudhu = sumKey("praktikWudhu");

  const overallAvg =
    Math.round(
      ((avgKuis +
        avgTugas +
        avgDiskusi +
        avgPts +
        avgPas +
        avgHafalan +
        avgSholat +
        avgWudhu) /
        8) *
        10
    ) / 10;

  return [
    "",
    "",
    `Rata-rata (${label})`,
    "",
    avgKuis,
    avgTugas,
    avgDiskusi,
    avgPts,
    avgPas,
    avgHafalan,
    avgSholat,
    avgWudhu,
    overallAvg,
    getPredikat(overallAvg)
  ];
}
