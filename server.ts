import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper for fallback generation if API key is not configured or fails
function generateFallbackJurnal(body: {
  kelasId?: string;
  tanggal?: string;
  jamKe?: string;
  materiPokok?: string;
  metode?: string;
  catatanKejadian?: string;
  totalSiswa?: number;
}) {
  const kelas = body.kelasId || "VII-A";
  const jam = body.jamKe || "1-2";
  const topicInput = body.materiPokok?.trim() || "";
  const total = Number(body.totalSiswa) || 30;
  const metode = body.metode || "Diskusi Kelompok & Praktik Terbimbing";

  const topicsByGrade: Record<string, string[]> = {
    "VII": [
      "Bab 1: Menghadirkan Islam Damai Melalui Thaharah dan Bersuci",
      "Bab 2: Meneladani Sifat Amanah dan Jujur dalam Kehidupan Sehari-hari",
      "Bab 3: Mengagumi Kebesaran Allah Melalui Menuntut Ilmu",
      "Bab 4: Mengagungkan Allah SWT Melalui Salat Berjamaah dan Sujud",
      "Bab 5: Meneladani Peradaban Islam Masa Daulah Umayyah di Damaskus"
    ],
    "VIII": [
      "Bab 1: Menghindari Minuman Keras, Judi, dan Pertengkaran Melalui Al-Qur'an",
      "Bab 2: Meneladani Sifat Jujur dan Menepati Janji",
      "Bab 3: Mengamalkan Salat Sunnah Gerhana, Istisqa, dan Jenazah",
      "Bab 4: Menginspirasi Dunia Melalui Peradaban Daulah Abbasiyah di Baghdad",
      "Bab 5: Menghayati Konsep Keadilan Sosial dalam Zakat dan Wakaf"
    ],
    "IX": [
      "Bab 1: Mengimani Hari Akhir dan Mempersiapkan Bekal Amal Kebaikan",
      "Bab 2: Mengasah Empati dan Kepedulian Melalui Zakat, Infaq, dan Sedekah",
      "Bab 3: Menyempurnakan Rukun Islam Melalui Ibadah Haji dan Umrah",
      "Bab 4: Meneladani Sejarah Masuknya Islam di Nusantara dan Wali Songo",
      "Bab 5: Merajut Toleransi dan Kerukunan Antarumat Beragama (Tasāmuh)"
    ]
  };

  let chosenTopic = topicInput;
  if (!chosenTopic) {
    if (kelas.includes("8") || kelas.includes("VIII")) {
      chosenTopic = topicsByGrade["VIII"][0];
    } else if (kelas.includes("9") || kelas.includes("IX")) {
      chosenTopic = topicsByGrade["IX"][0];
    } else {
      chosenTopic = topicsByGrade["VII"][0];
    }
  }

  const hadir = Math.max(1, total - 1);
  const izin = 1;
  const sakit = 0;
  const alpa = 0;

  return {
    materiPokok: chosenTopic,
    jamKe: jam,
    kehadiranHadir: hadir,
    kehadiranIzin: izin,
    kehadiranSakit: sakit,
    kehadiranAlpa: alpa,
    kegiatanKbm: `Kegiatan pembelajaran diawali tadarus dan apersepsi materi ${chosenTopic}. Pembelajaran menggunakan model ${metode}, di mana siswa secara antusias mengkaji dalil naqli, berdiskusi memecahkan studi kasus perilaku islami, serta mempresentasikan kesimpulan kelompok. Sesi ditutup dengan asesmen formatif singkat dan doa bersama.`,
    ringkasanKBM: `Kegiatan pembelajaran diawali tadarus dan apersepsi materi ${chosenTopic}. Pembelajaran menggunakan model ${metode}, di mana siswa secara antusias mengkaji dalil naqli, berdiskusi memecahkan studi kasus perilaku islami, serta mempresentasikan kesimpulan kelompok. Sesi ditutup dengan asesmen formatif singkat dan doa bersama.`,
    catatanKejadian: body.catatanKejadian?.trim()
      ? `${body.catatanKejadian}. Seluruh siswa mengikuti pembelajaran dengan tertib dan aktif bertanya saat sesi diskusi kelompok berlangsung.`
      : `Siswa sangat antusias saat sesi diskusi ${chosenTopic}. Teramati 2 kelompok menunjukkan penalaran kritis dalam menghubungkan dalil naqli dengan implementasi adab sehari-hari. Satu siswa izin keperluan keluarga dengan surat resmi.`,
    refleksiGuru: `Alokasi waktu penyampaian dalil dan asesmen berjalan efektif. Pada pertemuan pekan depan, perlu diperbanyak porsi simulasi praktik langsung dan penguatan hafalan dalil rujukan.`
  };
}

// Lazy Gemini client getter
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Jurnal Generation Endpoint
app.post("/api/gemini/generate-jurnal", async (req, res) => {
  const {
    kelasId = "VII-A",
    tanggal = new Date().toISOString().split("T")[0],
    jamKe = "1-2",
    materiPokok = "",
    metode = "",
    catatanKejadian = "",
    totalSiswa = 30,
    namaGuru = "Sadiqul Alim, S.Pd.I., M.Pd.",
    namaSekolah = "UPT SMPN 2 Rebang Tangkas"
  } = req.body || {};

  const ai = getGenAI();

  // If no API key is set, safely provide realistic fallback
  if (!ai) {
    const fallbackData = generateFallbackJurnal({
      kelasId,
      tanggal,
      jamKe,
      materiPokok,
      metode,
      catatanKejadian,
      totalSiswa
    });
    return res.json({
      success: true,
      source: "curriculum_engine",
      data: fallbackData
    });
  }

  try {
    const prompt = `Anda adalah asisten AI resmi untuk guru Pendidikan Agama Islam (PAI) & Budi Pekerti SMP Negeri Kurikulum Merdeka (Fase D).
Data Pembelajaran:
- Nama Guru: ${namaGuru}
- Asal Sekolah: ${namaSekolah}
- Kelas: ${kelasId}
- Tanggal Mengajar: ${tanggal}
- Jam Mengajar Ke: ${jamKe}
- Topik/Materi PAI yang diminta: ${materiPokok || "Materi PAI & Budi Pekerti Kurikulum Merdeka SMP yang sesuai dengan kelas " + kelasId}
- Model / Metode Pembelajaran: ${metode || "Problem Based Learning / Diskusi Kelompok & Praktik Adab"}
- Catatan / Konteks Khusus: ${catatanKejadian || "Kondisi kelas kondusif, siswa antusias"}
- Jumlah Siswa: ${totalSiswa} anak

Buatlah draf jurnal mengajar harian guru secara lengkap, profesional, dan bernuansa edukatif sesuai standar administrasi guru Kurikulum Merdeka.
Format output WAJIB HANYA berupa JSON murni dengan struktur berikut:
{
  "materiPokok": "string (Contoh: Bab 2: Meneladani Sifat Amanah dan Jujur dalam Kehidupan Sehari-hari)",
  "kegiatanKbm": "string (Rangkuman alur KBM dari pendahuluan/tadarus, inti pembelajaran ${metode || 'diskusi/praktik'}, hingga asesmen formatif & penutup)",
  "jamKe": "${jamKe}",
  "kehadiranHadir": number (misal ${Math.max(1, totalSiswa - 1)}),
  "kehadiranIzin": number (misal 1),
  "kehadiranSakit": number (misal 0),
  "kehadiranAlpa": number (misal 0),
  "ringkasanKBM": "string (Sama dengan kegiatanKbm)",
  "catatanKejadian": "string (Catatan observasi kejadian khusus di kelas: keaktifan siswa, penguasaan materi/dalil, dinamika sikap/karakter Profil Pelajar Pancasila, atau catatan bimbingan tertentu)",
  "refleksiGuru": "string (Refleksi evaluasi proses KBM untuk perbaikan pertemuan selanjutnya)"
}
Pastikan hanya mengembalikan JSON yang valid tanpa tanda pembungkus markdown apapun.`;

    let responseText = "";
    let usedModel = "gemini-3.6-flash";
    const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash"];

    for (const m of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        if (response.text) {
          responseText = response.text.trim();
          usedModel = m;
          break;
        }
      } catch (genErr: any) {
        console.warn(`Gemini generation with ${m} failed, trying next:`, genErr?.message || genErr);
      }
    }

    let parsedData;
    try {
      // Clean possible markdown code fences if model still outputs them
      const cleanedText = responseText.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
      parsedData = JSON.parse(cleanedText);
    } catch {
      parsedData = generateFallbackJurnal({
        kelasId,
        tanggal,
        jamKe,
        materiPokok,
        metode,
        catatanKejadian,
        totalSiswa
      });
    }

    return res.json({
      success: true,
      source: usedModel,
      data: parsedData
    });
  } catch (err: unknown) {
    console.error("Gemini Journal generation error, using fallback:", err);
    const fallbackData = generateFallbackJurnal({
      kelasId,
      tanggal,
      jamKe,
      materiPokok,
      metode,
      catatanKejadian,
      totalSiswa
    });
    return res.json({
      success: true,
      source: "curriculum_fallback",
      data: fallbackData
    });
  }
});

// Endpoint: AI Bahan Ajar PAI SMP (6 Produk Terpadu)
app.post("/api/gemini/generate-bahan-ajar-ai", async (req, res) => {
  const {
    kelas = "7",
    materi = "",
    subMateri = "",
    tingkatKesulitan = "Sedang",
    jumlahSoal = 10,
    durasiVideo = "3 menit",
    gayaPembelajaran = "Interaktif"
  } = req.body || {};

  const ai = getGenAI();
  if (!ai) {
    return res.json({
      success: false,
      message: "Gemini API key belum dikonfigurasi, gunakan generator kurikulum lokal."
    });
  }

  try {
    const prompt = `Anda adalah Pakar Kurikulum Pendidikan Agama Islam (PAI) & Budi Pekerti SMP (Fase D).
Buatlah paket media pembelajaran lengkap untuk:
- Jenjang: Kelas ${kelas} SMP
- Materi Pokok: ${materi}
- Sub Materi: ${subMateri}
- Tingkat Kesulitan: ${tingkatKesulitan}
- Jumlah Soal CBT: ${jumlahSoal} butir
- Durasi Video: ${durasiVideo}
- Gaya Pembelajaran: ${gayaPembelajaran}

WAJIB hasilkan HANYA JSON valid sesuai struktur berikut:
{
  "materiPembelajaran": {
    "judul": "${subMateri} - Kajian PAI SMP Kelas ${kelas}",
    "tujuanPembelajaran": ["string", "string", "string"],
    "kompetensi": ["string", "string"],
    "apersepsi": "string",
    "pengantar": "string",
    "materiInti": "string",
    "penjelasanKonsep": ["string", "string", "string"],
    "dalilQuran": {
      "sumber": "QS. NamaSurah: nomor_ayat",
      "teksArab": "Teks ayat arab yang sah",
      "terjemahan": "Terjemahan Kemenag",
      "penjelasanDalil": "Intisari kandungan ayat"
    },
    "hadis": {
      "perawi": "HR. Bukhari / Muslim / Abu Dawud",
      "status": "Sahih",
      "teksArab": "Teks hadis",
      "terjemahan": "Arti hadis",
      "penjelasan": "Hikmah hadis"
    },
    "contohKehidupanSehariHari": ["string", "string", "string"],
    "hikmah": ["string", "string"],
    "rangkuman": ["string", "string"],
    "refleksi": "string",
    "pertanyaanPemantik": ["string", "string"]
  },
  "video": {
    "judulVideo": "string",
    "tujuanVideo": "string",
    "durasiTotal": "${durasiVideo}",
    "gayaVideo": "${gayaPembelajaran}",
    "narasiPembuka": "string",
    "storyboard": [
      {
        "scene": 1,
        "durasiDetik": 15,
        "visual": "string visual scene",
        "narasi": "string narasi",
        "dialog": "string dialog",
        "teksLayar": "string overlay text",
        "audioNarator": "string petunjuk audio",
        "promptGambarAi": "prompt english for image gen",
        "promptVideoAi": "prompt english for video gen"
      }
    ],
    "kesimpulan": "string",
    "scriptLengkap": "string"
  },
  "gameQuiz": {
    "judul": "Quiz Challenge: ${subMateri}",
    "instruksi": "Pilihlah salah satu jawaban yang paling tepat. Benar +10 poin!",
    "waktuPerSoalDetik": 30,
    "soalList": [
      {
        "nomor": 1,
        "pertanyaan": "string",
        "pilihan": ["A", "B", "C", "D"],
        "jawabanBenar": 0,
        "penjelasan": "string",
        "poin": 10
      }
    ]
  },
  "gameMatch": {
    "judul": "Match & Word PAI: ${subMateri}",
    "instruksi": "Cocokkan pasangan istilah dengan pengertian/makna yang tepat!",
    "jenisPasangan": "Istilah ↔ Pengertian",
    "pairs": [
      {
        "id": "p1",
        "kiri": "Istilah / Konsep",
        "kanan": "Makna / Pengertian",
        "kategori": "PAI"
      }
    ],
    "level": 1,
    "waktuBatasDetik": 60
  },
  "tts": {
    "judul": "Teka-Teki Silang PAI: ${subMateri}",
    "petunjukMendatar": [
      { "nomor": 1, "arah": "mendatar", "pertanyaan": "string", "jawaban": "HURUF KAPITAL", "row": 0, "col": 0 }
    ],
    "petunjukMenurun": [
      { "nomor": 2, "arah": "menurun", "pertanyaan": "string", "jawaban": "HURUF KAPITAL", "row": 0, "col": 3 }
    ],
    "dimensi": { "baris": 9, "kolom": 9 },
    "grid": []
  },
  "lkpd": {
    "identitas": {
      "mataPelajaran": "Pendidikan Agama Islam dan Budi Pekerti",
      "kelas": "Kelas ${kelas} SMP",
      "materi": "${materi}",
      "subMateri": "${subMateri}",
      "alokasiWaktu": "2 x 40 Menit"
    },
    "tujuanPembelajaran": ["string"],
    "petunjukPengerjaan": ["string"],
    "apersepsi": "string",
    "materiSingkat": "string",
    "aktivitasList": [
      {
        "nomor": 1,
        "judulAktivitas": "Aktivitas 1: Pemahaman Konsep",
        "tipe": "Pemahaman Konsep",
        "instruksi": "string",
        "pertanyaan": ["string", "string"],
        "ruangJawabanTersedia": true
      },
      {
        "nomor": 2,
        "judulAktivitas": "Aktivitas 2: Analisis Dalil Naqli",
        "tipe": "Analisis",
        "instruksi": "string",
        "pertanyaan": ["string", "string"],
        "ruangJawabanTersedia": true
      },
      {
        "nomor": 3,
        "judulAktivitas": "Aktivitas 3: Diskusi Kelompok",
        "tipe": "Diskusi Kelompok",
        "instruksi": "string",
        "pertanyaan": ["string", "string"],
        "ruangJawabanTersedia": true
      },
      {
        "nomor": 4,
        "judulAktivitas": "Aktivitas 4: Studi Kasus Kehidupan Sehari-Hari",
        "tipe": "Studi Kasus Kehidupan",
        "instruksi": "string",
        "pertanyaan": ["string", "string"],
        "ruangJawabanTersedia": true
      },
      {
        "nomor": 5,
        "judulAktivitas": "Aktivitas 5: Refleksi Diri",
        "tipe": "Refleksi",
        "instruksi": "string",
        "pertanyaan": ["string", "string"],
        "ruangJawabanTersedia": true
      }
    ],
    "kesimpulan": "string",
    "evaluasi": ["string", "string"]
  },
  "cbt": {
    "judulUjian": "CBT PAI & Budi Pekerti: ${subMateri}",
    "kelas": "Kelas ${kelas} SMP",
    "materi": "${materi}",
    "subMateri": "${subMateri}",
    "durasiMenit": ${Number(jumlahSoal) * 2},
    "totalSoal": ${Number(jumlahSoal)},
    "kkm": 75,
    "daftarSoal": [
      {
        "nomor": 1,
        "pertanyaan": "string",
        "pilihan": ["A", "B", "C", "D"],
        "kunciJawaban": "A",
        "pembahasan": "string",
        "indikator": "string",
        "tingkatKesulitan": "Sedang"
      }
    ]
  }
}
Pastikan ayat Al-Qur'an dan Hadis tidak dikarang, sebutkan nama surah dan nomor ayat dengan tepat.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      const cleaned = response.text.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json({ success: true, data: parsed });
    }

    return res.status(500).json({ success: false, error: "Empty response from Gemini" });
  } catch (err: any) {
    console.warn("Gemini Bahan Ajar AI error:", err?.message || err);
    return res.status(500).json({ success: false, error: err?.message || "Failed to generate" });
  }
});

// Endpoint to upload official teacher photo (FOTOKU.jpg)
app.post("/api/upload-guru-foto", (req, res) => {
  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ success: false, error: "Data gambar (imageBase64) wajib disertakan." });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const pubPath1 = path.join(process.cwd(), "public", "guru_sadiq.jpg");
    const pubPath2 = path.join(process.cwd(), "public", "FOTOKU.jpg");
    const assetPath = path.join(process.cwd(), "src", "assets", "images", "FOTOKU.jpg");

    fs.writeFileSync(pubPath1, buffer);
    fs.writeFileSync(pubPath2, buffer);
    fs.writeFileSync(assetPath, buffer);

    return res.json({ success: true, message: "Foto resmi guru berhasil diperbarui!" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Gagal menyimpan foto guru:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
});

// Image Generation Endpoint for Bahan Ajar AI Image Gallery
app.post("/api/gemini/generate-images", async (req, res) => {
  const {
    materiPokok = "Pendidikan Agama Islam",
    kataKunciVisual = [],
    artStyle = "3d_modern",
    aspectRatio = "16:9",
    count = 4
  } = req.body || {};

  const cleanKeywords: string[] = Array.isArray(kataKunciVisual) && kataKunciVisual.length > 0
    ? kataKunciVisual.map((k: string) => String(k).trim()).filter(Boolean)
    : [
        "Cahaya ilmu dan keteladanan",
        "Pemahaman konsep bermakna",
        "Praktik ibadah khusyuk",
        "Akhlak mulia di sekolah"
      ];

  // Helper mapping for styles
  const styleDescriptions: Record<string, string> = {
    "3d_modern": "3D digital illustration, Pixar style, octane render, soft warm volumetric lighting, high aesthetic, 8K resolution",
    "infografis_hd": "high definition educational infographic, modern vector graphic layout, golden Islamic geometric arabesque, clean typography, 4K",
    "fotorealistis": "cinematic photorealistic photography, natural daylight, candid authentic expression, Nikon D850 50mm f/1.8 lens",
    "cat_air": "delicate watercolor painting, golden calligraphy accents, soft pastel color palette, textured paper finish, serene artistic atmosphere"
  };

  const selectedStyleDesc = styleDescriptions[artStyle] || styleDescriptions["3d_modern"];

  // Thematic Islamic Educational Image Curations based on topic keywords
  const topicLower = (materiPokok + " " + cleanKeywords.join(" ")).toLowerCase();

  const isMalaikat = topicLower.includes("malaikat") || topicLower.includes("gaib") || topicLower.includes("nur");
  const isKurban = topicLower.includes("kurban") || topicLower.includes("akikah") || topicLower.includes("sembelih") || topicLower.includes("haji");
  const isShalat = topicLower.includes("shalat") || topicLower.includes("sujud") || topicLower.includes("wudhu") || topicLower.includes("ibadah");
  const isQuran = topicLower.includes("quran") || topicLower.includes("tajwid") || topicLower.includes("ayat") || topicLower.includes("surah") || topicLower.includes("ilmu");

  const poolMalaikat = [
    {
      url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80",
      title: "Kemuliaan Ciptaan Nur & Fajar",
      category: "Konsep Ketauhidan"
    },
    {
      url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1280&q=80",
      title: "Malaikat Penjaga & Langit Bertabur Bintang",
      category: "Alam Semesta & Gaib"
    },
    {
      url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1280&q=80",
      title: "Rezeki & Hujan Berkah (Tugas Malaikat)",
      category: "Tanda Kekuasaan Allah"
    },
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1280&q=80",
      title: "Integritas & Kejujuran Siswa di Kelas",
      category: "Keteladanan Raqib-Atid"
    },
    {
      url: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&q=80",
      title: "Mushaf Wahyu Illahi (Malaikat Jibril)",
      category: "Rujukan Dalil Naqli"
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80",
      title: "Kolaborasi Pelajar Menuntut Ilmu",
      category: "Profil Pancasila"
    }
  ];

  const poolKurban = [
    {
      url: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=1280&q=80",
      title: "Hewan Ternak Sesuai Syariat",
      category: "Syarat Sah Kurban"
    },
    {
      url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1280&q=80",
      title: "Baitullah Ka'bah & Bulan Dzulhijjah",
      category: "Waktu Pelaksanaan"
    },
    {
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1280&q=80",
      title: "Kedermawanan & Berbagi Daging Kurban",
      category: "Kepedulian Sosial"
    },
    {
      url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1280&q=80",
      title: "Syukur Kelahiran Bayi & Akikah",
      category: "Ketentuan Akikah"
    },
    {
      url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1280&q=80",
      title: "Padang Penggembalaan Hewan",
      category: "Ketahanan Ternak"
    },
    {
      url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80",
      title: "Shalat Idul Adha Berjamaah",
      category: "Ibadah Sunnah Muakkad"
    }
  ];

  const poolShalat = [
    {
      url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1280&q=80",
      title: "Sujud Khusyuk di Hadapan Sang Khalik",
      category: "Kekhusyukan Ibadah"
    },
    {
      url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80",
      title: "Kerapian Shaf Shalat Berjamaah",
      category: "Ukhuwah Islamiyah"
    },
    {
      url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1280&q=80",
      title: "Zikir & Doa Pasca Ibadah",
      category: "Penyempurna Ibadah"
    },
    {
      url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80",
      title: "Menara Masjid Mengumandangkan Adzan",
      category: "Seruan Shalat"
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80",
      title: "Siswa Berlatih Gerakan & Bacaan Shalat",
      category: "Praktik KBM"
    },
    {
      url: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&q=80",
      title: "Membaca Ayat-ayat Pilihan dalam Shalat",
      category: "Rukun Qauli"
    }
  ];

  const poolQuran = [
    {
      url: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&q=80",
      title: "Mushaf Al-Qur'an Cahaya Petunjuk",
      category: "Kalamullah"
    },
    {
      url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1280&q=80",
      title: "Tadarus & Mendaras Ayat Suci",
      category: "Tilawah & Tartil"
    },
    {
      url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1280&q=80",
      title: "Khazanah Literatur & Tafsir Ilmu",
      category: "Menuntut Ilmu"
    },
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1280&q=80",
      title: "Bimbingan Guru PAI Menghafal Al-Qur'an",
      category: "Pembelajaran Interaktif"
    },
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1280&q=80",
      title: "Generasi Qur'ani Cerdas Berkarakter",
      category: "Profil Pelajar"
    },
    {
      url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1280&q=80",
      title: "Keindahan Arsitektur Islami",
      category: "Peradaban Islam"
    }
  ];

  const activePool = isMalaikat
    ? poolMalaikat
    : isKurban
    ? poolKurban
    : isShalat
    ? poolShalat
    : poolQuran;

  const targetCount = Math.min(Math.max(Number(count) || 4, 2), 6);
  const cards = [];

  for (let i = 0; i < targetCount; i++) {
    const kw = cleanKeywords[i % cleanKeywords.length] || `Konsep Pokok ${i + 1}`;
    const poolItem = activePool[i % activePool.length];

    const cardPrompt = `High quality Islamic educational visual for SMP Grade 7-9, topic "${materiPokok}", focusing on concept "${kw}". ${selectedStyleDesc}, respectful dignified Islamic aesthetic, modest attire, no distorted faces, no shirk symbols, educational composition --ar ${aspectRatio}`;

    cards.push({
      id: `img-card-${Date.now()}-${i}`,
      title: `${kw}`,
      subtitle: `${poolItem.title} • Materi: ${materiPokok}`,
      kataKunci: kw,
      materiPokok: materiPokok,
      imageUrl: poolItem.url,
      prompt: cardPrompt,
      negativePrompt: "low quality, distorted faces, blasphemy, non-modest clothing, cartoon caricature of holy prophets, dark gloomy scary atmosphere, blurry, watermark",
      aspectRatio: aspectRatio as "16:9" | "4:3" | "1:1" | "3:4",
      artStyle: artStyle as "3d_modern" | "infografis_hd" | "fotorealistis" | "cat_air",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      tags: [kw, poolItem.category, artStyle.replace("_", " ").toUpperCase()],
      isFavorite: i === 0
    });
  }

  return res.json({
    success: true,
    source: "ai_studio_engine",
    materiPokok,
    kataKunciVisual: cleanKeywords,
    totalCards: cards.length,
    cards
  });
});

// ==========================================
// Google Workspace Proxy Endpoints
// (Receives token via Authorization header from client, avoiding browser iframe CORS issues)
// ==========================================

function isLiveGoogleToken(authHeader: string | undefined): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token.startsWith("ya29.");
}

// In-memory & local fallback file repository for Google Drive storage
interface StoredDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number | string;
  modifiedTime: string;
  webViewLink: string;
  category?: "spreadsheet" | "document" | "backup" | "file";
  description?: string;
  dataBase64?: string;
  isLocal?: boolean;
}

const localDriveFiles: StoredDriveFile[] = [
  {
    id: "sample-lkpd-1",
    name: "LKPD_PAI_Bab_2_Meneladani_Amanah_Jujur.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 245000,
    modifiedTime: new Date(Date.now() - 3600000 * 24).toISOString(),
    webViewLink: "#",
    category: "document",
    description: "Lembar Kerja Peserta Didik Bab 2 Sikap Amanah dan Jujur Kelas VII",
    isLocal: true
  },
  {
    id: "sample-modul-1",
    name: "Modul_Ajar_PAI_Fase_D_Kurikulum_Merdeka.pdf",
    mimeType: "application/pdf",
    size: 1420000,
    modifiedTime: new Date(Date.now() - 3600000 * 48).toISOString(),
    webViewLink: "#",
    category: "document",
    description: "Modul Perangkat Ajar Kurikulum Merdeka Fase D UPT SMPN 2 Rebang Tangkas",
    isLocal: true
  }
];

// 1. List spreadsheets and files from Google Drive / Local Storage
app.get("/api/google/drive/files", async (req, res) => {
  const token = req.headers.authorization;
  const fileType = String(req.query.type || "all").toLowerCase();

  // If live Google OAuth token is present, query Google Drive API
  if (isLiveGoogleToken(token)) {
    try {
      let query = "trashed=false";
      if (fileType === "spreadsheets") {
        query += " and mimeType='application/vnd.google-apps.spreadsheet'";
      } else if (fileType === "documents") {
        query += " and (mimeType='application/vnd.google-apps.document' or mimeType='application/pdf' or mimeType contains 'officedocument')";
      }

      const encodedQuery = encodeURIComponent(query);
      const fields = encodeURIComponent("files(id,name,mimeType,size,modifiedTime,webViewLink,owners,description)");
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=50`;

      const gRes = await fetch(url, {
        headers: { Authorization: token! }
      });

      const data: any = await gRes.json().catch(() => ({}));
      if (gRes.ok && Array.isArray(data.files)) {
        // Merge Drive files with local user-saved files
        const mappedDriveFiles = data.files.map((f: any) => ({
          ...f,
          isLocal: false,
          category: f.mimeType?.includes("spreadsheet")
            ? "spreadsheet"
            : f.name?.includes("Backup") || f.name?.includes("Arsip")
            ? "backup"
            : "document"
        }));

        const combined = [...mappedDriveFiles, ...localDriveFiles];
        return res.json({
          files: combined,
          source: "google_drive"
        });
      }
    } catch (err: any) {
      console.warn("Direct Drive API fetch error:", err);
    }
  }

  // Fallback / Standalone mode: return local files repository
  let filtered = localDriveFiles;
  if (fileType === "spreadsheets") {
    filtered = localDriveFiles.filter((f) => f.category === "spreadsheet" || f.mimeType?.includes("sheet"));
  } else if (fileType === "documents") {
    filtered = localDriveFiles.filter((f) => f.category === "document" || !f.mimeType?.includes("sheet"));
  } else if (fileType === "backups") {
    filtered = localDriveFiles.filter((f) => f.category === "backup" || f.name?.includes("Backup"));
  }

  return res.json({
    files: filtered,
    source: "local_repository",
    warning: isLiveGoogleToken(token) ? undefined : "Berjalan dalam mode repositori berkas lokal/server. Hubungkan akun Google untuk sinkronisasi langsung ke Google Drive cloud Anda."
  });
});

// 1b. Upload / Save file to Google Drive or Local File Storage
app.post("/api/google/drive/upload", async (req, res) => {
  const token = req.headers.authorization;
  const {
    name,
    mimeType = "application/octet-stream",
    contentBase64,
    textContent,
    category = "file",
    description = ""
  } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: { message: "Nama berkas wajib diisi." } });
  }

  const rawBuffer = contentBase64
    ? Buffer.from(contentBase64.replace(/^data:[^;]+;base64,/, ""), "base64")
    : Buffer.from(textContent || "", "utf-8");

  const fileSize = rawBuffer.length;

  // 1. If Google OAuth token is present, upload directly to Google Drive via multipart upload
  if (isLiveGoogleToken(token)) {
    try {
      const metadata = {
        name,
        mimeType,
        description: description || `Disimpan dari PAILMS UPT SMPN 2 Rebang Tangkas pada ${new Date().toLocaleString("id-ID")}`
      };

      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelimiter = "\r\n--" + boundary + "--";

      const multipartRequestBody = Buffer.concat([
        Buffer.from(
          delimiter +
            "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            `Content-Type: ${mimeType}\r\n` +
            "Content-Transfer-Encoding: base64\r\n\r\n"
        ),
        Buffer.from(rawBuffer.toString("base64")),
        Buffer.from(closeDelimiter)
      ]);

      const driveRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: token!,
          "Content-Type": `multipart/related; boundary=${boundary}`,
          "Content-Length": String(multipartRequestBody.length)
        },
        body: multipartRequestBody
      });

      const driveData: any = await driveRes.json().catch(() => ({}));
      if (driveRes.ok && driveData.id) {
        const uploadedFile: StoredDriveFile = {
          id: driveData.id,
          name: driveData.name || name,
          mimeType: driveData.mimeType || mimeType,
          size: fileSize,
          modifiedTime: new Date().toISOString(),
          webViewLink: `https://drive.google.com/file/d/${driveData.id}/view`,
          category: category as any,
          description,
          isLocal: false
        };

        localDriveFiles.unshift(uploadedFile);

        return res.json({
          success: true,
          source: "google_drive",
          file: uploadedFile,
          message: `Berkas "${name}" berhasil disimpan langsung ke Google Drive!`
        });
      } else {
        console.warn("Drive upload API returned error:", driveData);
      }
    } catch (uploadErr) {
      console.warn("Drive API upload failed, saving to local store:", uploadErr);
    }
  }

  // 2. Standalone / Local storage fallback
  const newFileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const storedItem: StoredDriveFile = {
    id: newFileId,
    name,
    mimeType,
    size: fileSize,
    modifiedTime: new Date().toISOString(),
    webViewLink: `/api/google/drive/download/${newFileId}`,
    category: category as any,
    description,
    dataBase64: rawBuffer.toString("base64"),
    isLocal: true
  };

  localDriveFiles.unshift(storedItem);

  return res.json({
    success: true,
    source: "local_storage",
    file: storedItem,
    message: `Berkas "${name}" berhasil disimpan ke sistem penyimpanan berkas digital PAILMS.`
  });
});

// 1c. Download / View local drive file
app.get("/api/google/drive/download/:id", (req, res) => {
  const { id } = req.params;
  const item = localDriveFiles.find((f) => f.id === id);
  if (!item || !item.dataBase64) {
    return res.status(404).send("Berkas tidak ditemukan.");
  }

  const buffer = Buffer.from(item.dataBase64, "base64");
  res.setHeader("Content-Type", item.mimeType || "application/octet-stream");
  res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(item.name)}"`);
  res.setHeader("Content-Length", buffer.length);
  return res.send(buffer);
});

// 1d. Delete a file from Drive or Local storage
app.delete("/api/google/drive/files/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;

  // Try delete in Google Drive if live token
  if (isLiveGoogleToken(token) && !id.startsWith("file-") && !id.startsWith("sample-")) {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        method: "DELETE",
        headers: { Authorization: token! }
      });
    } catch (e) {
      console.warn("Failed deleting file from Drive:", e);
    }
  }

  const idx = localDriveFiles.findIndex((f) => f.id === id);
  if (idx !== -1) {
    localDriveFiles.splice(idx, 1);
  }

  return res.json({ success: true, message: "Berkas berhasil dihapus." });
});

// 1c. Google Apps Script Web App Proxy (Solves browser CORS / 302 redirect issues)
app.post("/api/google/appscript/proxy", async (req, res) => {
  const { url, action = "saveAllData", payload = {} } = req.body || {};
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return res.status(400).json({ error: { message: "URL Google Apps Script tidak valid." } });
  }

  try {
    const postBody = JSON.stringify({
      action,
      payload
    });

    const scriptRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: postBody,
      redirect: "follow"
    });

    const text = await scriptRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text, status: scriptRes.ok ? "success" : "error" };
    }

    return res.status(scriptRes.status).json(data);
  } catch (err: any) {
    console.warn("Apps Script Proxy error:", err);
    return res.status(500).json({ error: { message: err?.message || "Gagal menghubungi Google Apps Script." } });
  }
});

app.get("/api/google/appscript/proxy", async (req, res) => {
  const url = String(req.query.url || "");
  const action = String(req.query.action || "ping");
  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: { message: "URL Google Apps Script tidak valid." } });
  }

  try {
    const fullUrl = new URL(url);
    fullUrl.searchParams.set("action", action);
    for (const [k, v] of Object.entries(req.query)) {
      if (k !== "url") fullUrl.searchParams.set(k, String(v));
    }

    const scriptRes = await fetch(fullUrl.toString(), {
      method: "GET",
      redirect: "follow"
    });

    const text = await scriptRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text, status: scriptRes.ok ? "success" : "error" };
    }

    return res.status(scriptRes.status).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: { message: err?.message || "Gagal menghubungi Google Apps Script." } });
  }
});

// 2. Create a new Google Spreadsheet and populate initial values
app.post("/api/google/sheets/create", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.status(400).json({
      error: {
        message: "Token Google OAuth 2.0 belum aktif atau tidak valid. Silakan gunakan opsi 'Unduh Excel (.xlsx)' untuk menyimpan berkas secara langsung."
      }
    });
  }

  try {
    const { title = "Spreadsheet Baru", sheetTitle = "Sheet1", rows = [], sheets } = req.body || {};

    let sheetsList: { title: string; rows: (string | number)[][] }[] = [];

    if (Array.isArray(sheets) && sheets.length > 0) {
      sheetsList = sheets.map((s: any, idx: number) => ({
        title: String(s.title || `Sheet${idx + 1}`).replace(/[\\/?*[\]:]/g, "-").slice(0, 50),
        rows: Array.isArray(s.rows) ? s.rows : []
      }));
    } else {
      sheetsList = [
        {
          title: String(sheetTitle).replace(/[\\/?*[\]:]/g, "-").slice(0, 50),
          rows: Array.isArray(rows) ? rows : []
        }
      ];
    }

    // Create spreadsheet with all sheets defined
    const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: sheetsList.map((s) => ({
          properties: {
            title: s.title,
            gridProperties: {
              frozenRowCount: 4
            }
          }
        }))
      })
    });

    const createdData: any = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      if (createRes.status === 401) {
        return res.status(401).json({
          error: {
            message: "Sesi token Google telah kedaluwarsa. Silakan hubungkan kembali akun Google Anda atau unduh berkas dalam format Excel (.xlsx)."
          }
        });
      }
      const errorMsg = createdData.error?.message || `Gagal membuat spreadsheet (status ${createRes.status})`;
      return res.status(createRes.status).json({ error: { message: errorMsg } });
    }

    const spreadsheetId = createdData.spreadsheetId;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Populate values across sheets
    const dataToPopulate = sheetsList
      .filter((s) => s.rows && s.rows.length > 0)
      .map((s) => ({
        range: `'${s.title}'!A1`,
        values: s.rows
      }));

    if (dataToPopulate.length > 0) {
      const batchRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: token!,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            valueInputOption: "USER_ENTERED",
            data: dataToPopulate
          })
        }
      );

      if (!batchRes.ok) {
        console.warn("Batch update values failed, falling back to sequential update");
        for (const item of dataToPopulate) {
          const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            item.range
          )}?valueInputOption=USER_ENTERED`;

          await fetch(updateUrl, {
            method: "PUT",
            headers: {
              Authorization: token!,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              values: item.values
            })
          }).catch((e) => console.warn("Failed updating sheet:", item.range, e));
        }
      }
    }

    const totalRowCount = sheetsList.reduce((sum, s) => sum + s.rows.length, 0);

    return res.json({
      spreadsheetId,
      spreadsheetUrl,
      title,
      rowCount: totalRowCount,
      sheetCount: sheetsList.length
    });
  } catch (err: any) {
    console.error("Error creating spreadsheet via proxy:", err);
    return res.status(500).json({ error: { message: err?.message || "Gagal membuat spreadsheet Google." } });
  }
});

// 3. Get spreadsheet metadata
app.get("/api/google/sheets/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.status(400).json({
      error: {
        message: "Akses Google Sheets memerlukan token OAuth 2.0 aktif. Silakan gunakan impor berkas manual atau hubungkan akun Google."
      }
    });
  }

  const spreadsheetId = req.params.id;
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets.properties`;
    const gRes = await fetch(url, {
      headers: { Authorization: token! }
    });

    const data: any = await gRes.json().catch(() => ({}));
    if (!gRes.ok) {
      if (gRes.status === 401) {
        return res.status(401).json({
          error: {
            message: "Token Google telah kedaluwarsa. Silakan hubungkan kembali akun Google Anda.",
            status: "UNAUTHENTICATED"
          }
        });
      }
      const rawMsg = data?.error?.message || "";
      let message = rawMsg;
      if (gRes.status === 404 || rawMsg.includes("Requested entity was not found") || rawMsg.includes("not found")) {
        message = `Spreadsheet Google dengan ID '${spreadsheetId}' tidak ditemukan (404). Pastikan URL/ID benar dan berkas sudah dibagikan ke akun Google Anda.`;
      } else if (gRes.status === 403) {
        message = "Akses ditolak (403). Akun Google Anda belum memiliki izin membuka spreadsheet ini. Harap minta izin akses ke pemilik berkas.";
      }
      return res.status(gRes.status).json({
        error: { message, status: data?.error?.status || "NOT_FOUND", code: gRes.status }
      });
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: { message: err?.message || "Gagal memuat metadata spreadsheet." } });
  }
});

// Helper to parse CSV into 2D string array
function parseCsvToValues(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = "";
  let insideQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      row.push(current);
      current = "";
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current);
      if (row.some((c) => c.trim() !== "")) {
        result.push(row);
      }
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current);
    if (row.some((c) => c.trim() !== "")) {
      result.push(row);
    }
  }
  return result;
}

// 4. Get spreadsheet cell values (with OAuth & Public CSV Fallback)
app.get("/api/google/sheets/:id/values", async (req, res) => {
  const token = req.headers.authorization;
  const spreadsheetId = req.params.id;
  const range = (req.query.range as string) || "A1:Z500";

  // 4a. If live OAuth token exists, try official Google Sheets v4 API first
  if (token && isLiveGoogleToken(token)) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
      const gRes = await fetch(url, {
        headers: { Authorization: token }
      });

      const data: any = await gRes.json().catch(() => ({}));
      if (gRes.ok && data?.values) {
        return res.json(data);
      }
    } catch (e) {
      console.warn("OAuth spreadsheet values fetch error, falling back to public CSV export:", e);
    }
  }

  // 4b. Fallback: Public Google Sheet CSV Reader (supports shared spreadsheets without OAuth login)
  try {
    const rawSheet = range.includes("!") ? range.split("!")[0] : "";
    const cleanSheet = rawSheet.replace(/^['"]|['"]$/g, "").trim();

    const publicUrls = [
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${cleanSheet ? `&sheet=${encodeURIComponent(cleanSheet)}` : ""}`,
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${cleanSheet ? `&sheet=${encodeURIComponent(cleanSheet)}` : ""}`
    ];

    for (const pUrl of publicUrls) {
      try {
        const pRes = await fetch(pUrl, { redirect: "follow" });
        if (pRes.ok) {
          const text = await pRes.text();
          if (!text.includes("<!DOCTYPE html") && !text.includes("<html")) {
            const values = parseCsvToValues(text);
            if (values.length > 0) {
              return res.json({
                values,
                source: "public_csv",
                range: cleanSheet || range
              });
            }
          }
        }
      } catch (errPublic) {
        // try next public URL
      }
    }
  } catch (errFallback) {
    console.warn("Public CSV fallback error:", errFallback);
  }

  return res.status(404).json({
    error: {
      message: `Data lembar atau rentang '${range}' tidak dapat diakses. Pastikan Google Spreadsheet dibagikan dengan opsi 'Siapa saja yang memiliki link dapat melihat' atau gunakan URL Google Apps Script (/exec).`
    }
  });
});

// 5. Append values to spreadsheet
app.post("/api/google/sheets/:id/values/append", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.status(400).json({
      error: {
        message: "Akses Google Sheets memerlukan token OAuth 2.0 aktif."
      }
    });
  }

  const spreadsheetId = req.params.id;
  const { range = "A1", values = [] } = req.body || {};
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;
    const gRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    });

    const data = await gRes.json().catch(() => ({}));
    if (!gRes.ok) {
      return res.status(gRes.status).json(data);
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: { message: err?.message || "Gagal menambah baris ke spreadsheet." } });
  }
});

// 6. Update values in spreadsheet
app.put("/api/google/sheets/:id/values", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.status(400).json({
      error: {
        message: "Akses Google Sheets memerlukan token OAuth 2.0 aktif."
      }
    });
  }
  if (!token) {
    return res.status(401).json({ error: { message: "Token autentikasi Google tidak ditemukan." } });
  }

  const spreadsheetId = req.params.id;
  const { range = "A1", values = [] } = req.body || {};
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`;
    const gRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    });

    const data = await gRes.json().catch(() => ({}));
    if (!gRes.ok) {
      return res.status(gRes.status).json(data);
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: { message: err?.message || "Gagal memperbarui nilai spreadsheet." } });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
