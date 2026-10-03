# BAHAN AJAR AI PAI
### Generator Media Pembelajaran Pendidikan Agama Islam SMP

Aplikasi modern berbasis web untuk Guru Pendidikan Agama Islam (PAI) tingkat SMP Kelas 7, 8, dan 9.

> **Slogan:** *"Guru Kreatif, Pembelajaran Interaktif, Siswa Aktif"*

---

## 🚀 Fitur Utama

1. **AI Generator 1-Klik:**
   - Guru cukup memilih **Kelas** (7, 8, 9), **Materi Pokok**, dan **Sub Materi**, lalu menekan tombol **[ ✨ BUAT DENGAN AI ]**.
   - Otomatis menghasilkan 6 produk pembelajaran terintegrasi:
     - 📚 **Materi Pembelajaran Lengkap** (Tujuan, Kompetensi, Apersepsi, Materi Inti, Dalil Al-Qur'an & Hadis terverifikasi, Contoh Sehari-hari, Hikmah, Refleksi, Pertanyaan Pemantik).
     - 🎬 **Video Pembelajaran & Storyboard** (Scene-by-scene, Narasi, Dialog, Teks Layar, Prompt Gambar AI, Prompt Video AI).
     - 🎮 **Game Edukasi 1: Quiz Challenge** (Pilihan ganda interaktif, skor +10, timer, pembahasan).
     - 🧩 **Game Edukasi 2: Match & Word** (Mencocokkan istilah ↔ pengertian, ayat ↔ terjemahan, konsep ↔ contoh).
     - 🧠 **Teka-Teki Silang (TTS)** (Grid algoritmik interaktif, petunjuk mendatar & menurun, cek jawaban, mode guru lihat kunci).
     - 📝 **LKPD (Lembar Kerja Peserta Didik)** (Identitas, 5 Aktivitas: Pemahaman Konsep, Analisis, Diskusi, Studi Kasus, Refleksi).
     - 💻 **CBT (Computer Based Test)** (Simulasi ujian online, 10–30 butir soal, timer, navigasi nomor, ragu-ragu, penilaian instan).

2. **Bank Bahan Ajar & Penyimpanan Terpadu:**
   - Pencarian berdasarkan Kelas, Materi, Sub Materi, dan Tanggal.
   - Fitur **Duplikasi Bahan Ajar**, **Salin Konten**, **Cetak**, dan **Ekspor PDF**.
   - Fitur **Regenerate Per Produk** (hanya membuat ulang bagian yang diinginkan) atau **Generate Ulang Seluruh Paket**.

3. **Database Kurikulum PAI Fleksibel:**
   - Mengelola cabang kurikulum Kelas 7, 8, dan 9:
     - *Al-Qur'an dan Hadis*
     - *Akidah*
     - *Akhlak*
     - *Fikih*
     - *Sejarah Peradaban Islam*
   - Guru dan admin dapat menambah, mengedit, dan menghapus sub materi secara dinamis tanpa mengunci kode.

4. **Monitoring Hasil Siswa:**
   - Rekap nilai ujian CBT dan pencapaian skor game edukasi siswa.

5. **Arsitektur Cloud & Google Sheets REST API:**
   - Terintegrasi dengan 14 Sheet database:
     `USERS`, `KELAS`, `MATERI`, `SUB_MATERI`, `BAHAN_AJAR`, `VIDEO`, `GAME`, `TTS`, `LKPD`, `CBT`, `CBT_SOAL`, `HASIL_CBT`, `HASIL_GAME`, `SETTINGS`.

---

## 🛠️ Teknologi & Arsitektur

- **Frontend:** React 19 + TypeScript + Vite
- **UI & Desain:** Tailwind CSS (Modern, Islami, Biru dengan aksen Emas & Hijau lembut)
- **Ikon:** Lucide React
- **Backend / Proxy:** Node.js Express (port 3000)
- **AI Engine:** Google AI / Gemini API (`@google/genai`, model `gemini-3.8-flash`) + Intelligent Curated Fallback Engine
- **Cloud Database:** Google Sheets + Google Apps Script REST API

---

## 📦 Cara Menjalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/your-username/bahan-ajar-ai-pai.git
cd bahan-ajar-ai-pai

# 2. Install dependencies
npm install

# 3. Buat file .env dari .env.example
cp .env.example .env
# Isi variabel GEMINI_API_KEY Anda

# 4. Jalankan development server
npm run dev

# 5. Akses di browser: http://localhost:3000
```

---

## 🔑 Konfigurasi Environment Variables

Buat file `.env` di direktori utama:

```env
# Gemini API Key untuk AI Generation
GEMINI_API_KEY=your_gemini_api_key_here

# (Opsional) URL Web App Google Apps Script untuk sync cloud database
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

---

## 🌐 Cara Deploy ke Vercel

1. Push repository ke GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Bahan Ajar AI PAI SMP"
   git push origin main
   ```
2. Impor project di Vercel Dashboard.
3. Di tab **Environment Variables** Vercel, tambahkan:
   - `GEMINI_API_KEY`: API Key Google AI Studio Anda
   - `GOOGLE_APPS_SCRIPT_URL`: URL Google Apps Script Anda (jika ada)
4. Klik **Deploy**.

---

## 📜 Lisensi & Hak Cipta

Apache-2.0 License. Didedikasikan untuk memajukan pendidikan agama Islam tingkat SMP di seluruh Indonesia.
