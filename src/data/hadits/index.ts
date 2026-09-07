import { HaditsItemData, HadistData, TemaHadits, RawiUtama } from "./types";
import { LIST_HADITS_BUKHARI } from "./haditsBukhari";
import { LIST_HADITS_MUSLIM } from "./haditsMuslim";
import { LIST_HADITS_NASAI } from "./haditsNasai";
import { LIST_HADITS_ABU_DAUD } from "./haditsAbuDaud";
import { LIST_HADITS_IBNU_MAJAH } from "./haditsIbnuMajah";

export type { HaditsItemData, HadistData, TemaHadits, RawiUtama };
export {
  LIST_HADITS_BUKHARI,
  LIST_HADITS_MUSLIM,
  LIST_HADITS_NASAI,
  LIST_HADITS_ABU_DAUD,
  LIST_HADITS_IBNU_MAJAH
};

export const LIST_HADITS_125_LENGKAP: HaditsItemData[] = [
  ...LIST_HADITS_BUKHARI,
  ...LIST_HADITS_MUSLIM,
  ...LIST_HADITS_NASAI,
  ...LIST_HADITS_ABU_DAUD,
  ...LIST_HADITS_IBNU_MAJAH
];

// Alias for seamless compatibility
export const LIST_HADIST_PILIHAN: HadistData[] = LIST_HADITS_125_LENGKAP;
