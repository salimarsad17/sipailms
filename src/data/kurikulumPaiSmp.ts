/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KurikulumKelasItem, MateriPokokItem, KelasTingkatSmp } from "../types/bahanAjarAiModern";

export const DEFAULT_KURIKULUM_PAI_SMP: KurikulumKelasItem[] = [
  // ==========================================
  // KELAS 7 SMP
  // ==========================================
  {
    kelas: "7",
    materiList: [
      {
        id: "k7-m1",
        kategori: "Al-Qur'an dan Hadis",
        judulMateri: "Mencintai Al-Qur'an dan Memahami Tajwid",
        subMateriList: [
          { id: "k7-s1-1", judul: "Hukum Bacaan Al-Syamsiyah dan Al-Qamariyah", deskripsiSingkat: "Mengenal huruf dan cara membaca idgham syamsiyah serta idzhar qamariyah dalam Al-Qur'an." },
          { id: "k7-s1-2", judul: "Kandungan QS. An-Nisa: 59 tentang Ketaatan", deskripsiSingkat: "Memahami ketaatan kepada Allah, Rasul, dan Ulil Amri dalam kehidupan bermasyarakat." },
          { id: "k7-s1-3", judul: "Hukum Nun Mati dan Tanwin (Idzhar, Idgham, Ikhfa, Iqlab)", deskripsiSingkat: "Ketentuan tajwid nun sukun beserta contoh lafal tartilnya." }
        ]
      },
      {
        id: "k7-m2",
        kategori: "Akidah",
        judulMateri: "Meneladani Nama dan Sifat Mulia Allah (Asmaul Husna)",
        subMateriList: [
          { id: "k7-s2-1", judul: "Mengenal Sifat Al-Alim, Al-Khabir, As-Sami', dan Al-Bashir", deskripsiSingkat: "Makna 4 Asmaul Husna dan dampaknya terhadap kesadaran muraqabah (merasa diawasi Allah)." },
          { id: "k7-s2-2", judul: "Mewujudkan Karakter Beriman kepada Malaikat-Malaikat Allah", deskripsiSingkat: "Tugas 10 malaikat utama dan pengaruh keimanan terhadap integritas diri siswa." }
        ]
      },
      {
        id: "k7-m3",
        kategori: "Akhlak",
        judulMateri: "Menghadirkan Akhlak Mulia dalam Keseharian",
        subMateriList: [
          { id: "k7-s3-1", judul: "Menjaga Amanah dan Berlaku Jujur", deskripsiSingkat: "Pentingnya sikap jujur dan amanah di lingkungan sekolah, keluarga, dan media sosial." },
          { id: "k7-s3-2", judul: "Adab Bergaul dengan Teman Sebaya, Guru, dan Orang Tua", deskripsiSingkat: "Sopan santun islami, larangan bullying, serta menghormati orang yang lebih tua." }
        ]
      },
      {
        id: "k7-m4",
        kategori: "Fikih",
        judulMateri: "Thaharah dan Hakikat Shalat",
        subMateriList: [
          { id: "k7-s4-1", judul: "Tata Cara Bersuci dari Hadas Kecil dan Hadas Besar", deskripsiSingkat: "Rukun wudhu, tayamum, mandi wajib, serta pembagian jenis-jenis najis dan cara mensucikannya." },
          { id: "k7-s4-2", judul: "Shalat Fardhu Berjamaah dan Ketentuan Makmum Masbuq", deskripsiSingkat: "Keutamaan shalat berjamaah 27 derajat, syarat imam, dan tata cara sujud sahwi." },
          { id: "k7-s4-3", judul: "Shalat Sunnah Rawatib dan Shalat Gerhana (Khusuf & Kusuf)", deskripsiSingkat: "Ketentuan ibadah shalat sunnah muakkad dan ghairu muakkad." }
        ]
      },
      {
        id: "k7-m5",
        kategori: "Sejarah Peradaban Islam",
        judulMateri: "Peradaban Islam Masa Khulafaur Rasyidin dan Daulah Umayyah",
        subMateriList: [
          { id: "k7-s5-1", judul: "Kepemimpinan Khulafaur Rasyidin yang Demokratis dan Bersahaja", deskripsiSingkat: "Keteladanan Abu Bakar, Umar bin Khattab, Utsman bin Affan, dan Ali bin Abi Thalib." },
          { id: "k7-s5-2", judul: "Kemajuan Ilmu Pengetahuan Masa Daulah Umayyah di Damaskus", deskripsiSingkat: "Faktor kejayaan peradaban Islam awal dalam kodifikasi ilmu dan ekspansi perdamaian." }
        ]
      }
    ]
  },

  // ==========================================
  // KELAS 8 SMP
  // ==========================================
  {
    kelas: "8",
    materiList: [
      {
        id: "k8-m1",
        kategori: "Al-Qur'an dan Hadis",
        judulMateri: "Menjaga Diri dari Bahaya Minuman Keras, Judi, dan Pertengkaran",
        subMateriList: [
          { id: "k8-s1-1", judul: "Tafsir QS. Al-Maidah: 90-91 tentang Larangan Khamr dan Judi", deskripsiSingkat: "Dampak destruktif judi online, miras, dan tawuran bagi generasi muda." },
          { id: "k8-s1-2", judul: "Hukum Bacaan Mad Thabi'i dan Mad Far'i", deskripsiSingkat: "Memahami ragam hukum mad dalam tilawah tartil." }
        ]
      },
      {
        id: "k8-m2",
        kategori: "Akidah",
        judulMateri: "Meyakini Kitab-Kitab Allah dan Menjadikan Al-Qur'an Pedoman Hidup",
        subMateriList: [
          { id: "k8-s2-1", judul: "Mengenal 4 Kitab Suci: Taurat, Zabur, Injil, dan Al-Qur'an", deskripsiSingkat: "Kedudukan Al-Qur'an sebagai penyempurna dan mukjizat abadi sepanjang zaman." },
          { id: "k8-s2-2", judul: "Menumbuhkan Sikap Kritis dan Cinta Literasi Islami", deskripsiSingkat: "Implementasi iman kepada kitab Allah dalam tradisi riset dan membaca." }
        ]
      },
      {
        id: "k8-m3",
        kategori: "Akhlak",
        judulMateri: "Menebarkan Keadilan dan Menepati Janji",
        subMateriList: [
          { id: "k8-s3-1", judul: "Meneladani Sikap Adil dan Menepati Janji", deskripsiSingkat: "Ciri orang munafik dan komitmen moral dalam memenuhi amanah." },
          { id: "k8-s3-2", judul: "Berbakti kepada Orang Tua (Birrul Walidain) dan Menghormati Pendidik", deskripsiSingkat: "Dalil keutamaan berbakti dan adab mulia memuliakan guru." }
        ]
      },
      {
        id: "k8-m4",
        kategori: "Fikih",
        judulMateri: "Ibadah Shalat Jamak, Qashar, dan Sujud-Sujud Khusus",
        subMateriList: [
          { id: "k8-s4-1", judul: "Rukhsah Keringanan: Shalat Jamak dan Qashar bagi Musafir", deskripsiSingkat: "Syarat sah jamak taqdim, jamak takhir, dan qashar dalam perjalanan." },
          { id: "k8-s4-2", judul: "Sujud Syukur, Sujud Tilawah, dan Sujud Sahwi", deskripsiSingkat: "Sebab-sebab, bacaan, dan tata cara pelaksanaan ketiga sujud khusus." },
          { id: "k8-s4-3", judul: "Puasa Wajib (Ramadhan, Nazar, Kifarat) dan Puasa Sunnah", deskripsiSingkat: "Syarat, rukun, hikmah puasa, dan amalan penambah pahala." }
        ]
      },
      {
        id: "k8-m5",
        kategori: "Sejarah Peradaban Islam",
        judulMateri: "Masa Keemasan Daulah Abbasiyah di Baghdad (The Golden Age)",
        subMateriList: [
          { id: "k8-s5-1", judul: "Baitul Hikmah: Pusat Peradaban dan Penerjemahan Dunia", deskripsiSingkat: "Peran Khalifah Harun Ar-Rasyid dan Al-Makmun dalam memajukan perpustakaan dunia." },
          { id: "k8-s5-2", judul: "Tokoh Cendekiawan Muslim: Ibnu Sina, Al-Khawarizmi, dan Al-Ghazali", deskripsiSingkat: "Karya kedokteran, matematika aljabar, dan filsafat etika islam bagi kemajuan dunia modern." }
        ]
      }
    ]
  },

  // ==========================================
  // KELAS 9 SMP
  // ==========================================
  {
    kelas: "9",
    materiList: [
      {
        id: "k9-m1",
        kategori: "Al-Qur'an dan Hadis",
        judulMateri: "Meraih Keberkahan dengan Menuntut Ilmu dan Menghargai Keragaman",
        subMateriList: [
          { id: "k9-s1-1", judul: "Kajian QS. Al-Mujadilah: 11 tentang Derajat Orang Berilmu", deskripsiSingkat: "Kewajiban menuntut ilmu sepanjang hayat dan adab majelis ilmu." },
          { id: "k9-s1-2", judul: "Kajian QS. Al-Hujurat: 13 tentang Persaudaraan dan Toleransi (Tasamuh)", deskripsiSingkat: "Islam menghormati kebinekaan suku, bangsa, dan agama." },
          { id: "k9-s1-3", judul: "Hukum Bacaan Waqaf dan Washal dalam Al-Qur'an", deskripsiSingkat: "Mengenal tanda-tanda waqaf lazim, jaiz, mamnu', serta cara berhenti yang benar." }
        ]
      },
      {
        id: "k9-m2",
        kategori: "Akidah",
        judulMateri: "Mengimani Hari Akhir dan Takdir Allah (Qada dan Qadar)",
        subMateriList: [
          { id: "k9-s2-1", judul: "Peristiwa Hari Akhir: Yaumul Ba'ats, Mizan, Hisab, hingga Jaza'", deskripsiSingkat: "Tahapan alam kubur, hari kebangkitan, dan pertanggungjawaban amal manusia." },
          { id: "k9-s2-2", judul: "Iman kepada Qada dan Qadar: Ikhtiar, Doa, dan Tawakal", deskripsiSingkat: "Memahami takdir mu'allaq dan mubram serta optimisme menjalani masa depan." }
        ]
      },
      {
        id: "k9-m3",
        kategori: "Akhlak",
        judulMateri: "Mengasah Empati, Peduli Lingkungan, dan Menghindari Sifat Buruk",
        subMateriList: [
          { id: "k9-s3-1", judul: "Kepedulian Lingkungan Hidup dan Larangan Melakukan Kerusakan", deskripsiSingkat: "Prinsip ekoteologi Islam dalam menjaga alam, flora, fauna, dan kebersihan bumi." },
          { id: "k9-s3-2", judul: "Menghindari Sifat Riya, Takabur, Hasad, dan Ghibah", deskripsiSingkat: "Bahaya penyakit hati dan cara membersihkan jiwa (tazkiyatun nafs)." }
        ]
      },
      {
        id: "k9-m4",
        kategori: "Fikih",
        judulMateri: "Zakat, Haji, Umrah, serta Penyembelihan Hewan Qurban & Aqiqah",
        subMateriList: [
          { id: "k9-s4-1", judul: "Zakat Fitrah dan Zakat Mal sebagai Instrumen Keadilan Sosial", deskripsiSingkat: "Nisab, kadar zakat emas/perdagangan/pertanian, serta 8 asnaf penerima zakat." },
          { id: "k9-s4-2", judul: "Tata Cara Ibadah Haji dan Umrah (Rukun, Wajib, dan Larangan Ihram)", deskripsiSingkat: "Simulasi manasik haji, tawaf, sa'i, wukuf di Arafah, dan hikmah kesetaraan umat manusia." },
          { id: "k9-s4-3", judul: "Ketentuan Qurban dan Aqiqah serta Adab Menyembelih Hewan", deskripsiSingkat: "Syarat hewan sembelihan dan nilai ketaatan spiritual Nabi Ibrahim AS." }
        ]
      },
      {
        id: "k9-m5",
        kategori: "Sejarah Peradaban Islam",
        judulMateri: "Sejarah Masuknya Islam di Nusantara dan Kearifan Dakwah Wali Songo",
        subMateriList: [
          { id: "k9-s5-1", judul: "Jalur Masuknya Islam ke Nusantara: Teori Gujarat, Arab, dan Persia", deskripsiSingkat: "Penyebaran Islam secara damai melalui perdagangan, perkawinan, dan tasawuf." },
          { id: "k9-s5-2", judul: "Metode Dakwah Akulturasi Budaya Wali Songo di Tanah Jawa", deskripsiSingkat: "Strategi Sunan Kalijaga lewat wayang & tembang, serta seni arsitektur Masjid Demak." },
          { id: "k9-s5-3", judul: "Kerajaan-Kerajaan Islam Nusantara: Samudera Pasai, Demak, Mataram, Gowa-Tallo", deskripsiSingkat: "Pusat peradaban maritim dan perjuangan membela tanah air dari kolonialisme." }
        ]
      }
    ]
  }
];

const STORAGE_KEY_KURIKULUM = "pai_lms_kurikulum_smp_data";

export class KurikulumPaiService {
  static getKurikulum(): KurikulumKelasItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_KURIKULUM);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Gagal membaca kurikulum dari storage:", e);
    }
    return DEFAULT_KURIKULUM_PAI_SMP;
  }

  static saveKurikulum(data: KurikulumKelasItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_KURIKULUM, JSON.stringify(data));
    } catch (e) {
      console.error("Gagal menyimpan kurikulum:", e);
    }
  }

  static addSubMateri(kelas: KelasTingkatSmp, materiId: string, newSubMateri: { judul: string; deskripsiSingkat?: string }): KurikulumKelasItem[] {
    const list = this.getKurikulum();
    const updated = list.map((item) => {
      if (item.kelas !== kelas) return item;
      return {
        ...item,
        materiList: item.materiList.map((m) => {
          if (m.id !== materiId) return m;
          const newId = `sub-${Date.now()}`;
          return {
            ...m,
            subMateriList: [...m.subMateriList, { id: newId, judul: newSubMateri.judul, deskripsiSingkat: newSubMateri.deskripsiSingkat }]
          };
        })
      };
    });
    this.saveKurikulum(updated);
    return updated;
  }

  static updateSubMateri(kelas: KelasTingkatSmp, materiId: string, subMateriId: string, updatedData: { judul: string; deskripsiSingkat?: string }): KurikulumKelasItem[] {
    const list = this.getKurikulum();
    const updated = list.map((item) => {
      if (item.kelas !== kelas) return item;
      return {
        ...item,
        materiList: item.materiList.map((m) => {
          if (m.id !== materiId) return m;
          return {
            ...m,
            subMateriList: m.subMateriList.map((s) => s.id === subMateriId ? { ...s, ...updatedData } : s)
          };
        })
      };
    });
    this.saveKurikulum(updated);
    return updated;
  }

  static deleteSubMateri(kelas: KelasTingkatSmp, materiId: string, subMateriId: string): KurikulumKelasItem[] {
    const list = this.getKurikulum();
    const updated = list.map((item) => {
      if (item.kelas !== kelas) return item;
      return {
        ...item,
        materiList: item.materiList.map((m) => {
          if (m.id !== materiId) return m;
          return {
            ...m,
            subMateriList: m.subMateriList.filter((s) => s.id !== subMateriId)
          };
        })
      };
    });
    this.saveKurikulum(updated);
    return updated;
  }

  static resetToDefault(): KurikulumKelasItem[] {
    this.saveKurikulum(DEFAULT_KURIKULUM_PAI_SMP);
    return DEFAULT_KURIKULUM_PAI_SMP;
  }
}
