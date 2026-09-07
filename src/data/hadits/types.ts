export type TemaHadits = "Tauhid" | "Ibadah" | "Akhlak" | "Fiqih";
export type RawiUtama = "bukhari" | "muslim" | "nasai" | "abu_daud" | "ibnu_majah";

export interface HaditsItemData {
  id: string;
  nomorUrut: number;
  judul: string;
  kitab: string;
  tema: TemaHadits;
  perawi: string;
  rawiUtama: RawiUtama;
  nomorHadits: string;
  arab: string;
  terjemah: string;
  penjelasan: string;
  faidah: string[];
  amalanPraktis?: string;
}

// Alias for backwards compatibility with MasterkuData
export type HadistData = HaditsItemData;
