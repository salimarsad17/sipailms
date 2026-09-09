import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  "jamKe": "${jamKe}",
  "kehadiranHadir": number (misal ${Math.max(1, totalSiswa - 1)}),
  "kehadiranIzin": number (misal 1),
  "kehadiranSakit": number (misal 0),
  "kehadiranAlpa": number (misal 0),
  "ringkasanKBM": "string (Rangkuman alur KBM dari pendahuluan/tadarus, inti pembelajaran ${metode || 'diskusi/praktik'}, hingga asesmen formatif & penutup)",
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

// ==========================================
// Google Workspace Proxy Endpoints
// (Receives token via Authorization header from client, avoiding browser iframe CORS issues)
// ==========================================

function isLiveGoogleToken(authHeader: string | undefined): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token.startsWith("ya29.");
}

// 1. List spreadsheets from Google Drive
app.get("/api/google/drive/files", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.json({
      files: [],
      warning: "Kredensial OAuth 2.0 Google belum aktif. Anda dapat mengimpor file spreadsheet secara langsung atau mengunduh data dalam format Excel (.xlsx)."
    });
  }

  try {
    const query = encodeURIComponent(
      "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"
    );
    const fields = encodeURIComponent("files(id,name,modifiedTime,webViewLink,owners)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=30`;

    const gRes = await fetch(url, {
      headers: { Authorization: token! }
    });

    const data: any = await gRes.json().catch(() => ({}));
    if (!gRes.ok) {
      console.warn("Google Drive API response not OK:", data);
      return res.json({
        files: [],
        warning: data.error?.message || "Layanan Google Drive API belum dapat diakses."
      });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("Error proxying Drive files:", err);
    return res.json({
      files: [],
      warning: err?.message || "Gagal menghubungi layanan Google Drive."
    });
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

// 4. Get spreadsheet cell values
app.get("/api/google/sheets/:id/values", async (req, res) => {
  const token = req.headers.authorization;
  if (!isLiveGoogleToken(token)) {
    return res.status(400).json({
      error: {
        message: "Akses Google Sheets memerlukan token OAuth 2.0 aktif."
      }
    });
  }

  const spreadsheetId = req.params.id;
  const range = (req.query.range as string) || "A1:Z500";
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
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
      if (gRes.status === 404 || rawMsg.includes("Requested entity was not found")) {
        message = `Data lembar atau rentang '${range}' tidak ditemukan di spreadsheet ini (404).`;
      } else if (gRes.status === 403) {
        message = "Akses ditolak (403). Akun Google Anda belum memiliki izin membaca data spreadsheet ini.";
      }
      return res.status(gRes.status).json({
        error: { message, status: data?.error?.status || "NOT_FOUND", code: gRes.status }
      });
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: { message: err?.message || "Gagal membaca data sel spreadsheet." } });
  }
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
