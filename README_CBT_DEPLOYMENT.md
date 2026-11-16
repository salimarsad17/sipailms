# CBT PAI SMART – UPT SMPN 2 REBANG TANGKAS

Aplikasi Computer Based Test (CBT) modern untuk mata pelajaran **Pendidikan Agama Islam (PAI)** tingkat SMP kelas VII, VIII, dan IX menggunakan **React + TypeScript + Tailwind CSS + Supabase (Auth, PostgreSQL, Storage, Edge Functions)**.

---

## 1. Struktur Folder Utama

```text
├── index.html
├── .env.example
├── package.json
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   │   └── cbt.ts
│   ├── services/
│   │   ├── cbtSupabaseService.ts
│   │   └── cbtExportService.ts
│   └── components/
│       └── cbt/
│           ├── CbtApp.tsx
│           ├── CbtAuthView.tsx
│           ├── CbtGuruDashboard.tsx
│           ├── CbtQuestionBank.tsx
│           ├── CbtExamManager.tsx
│           ├── CbtStudentPortal.tsx
│           ├── CbtStudentExamRunner.tsx
│           ├── CbtResultsAndGrading.tsx
│           ├── CbtQuestionAnalysis.tsx
│           ├── CbtMasterData.tsx
│           └── CbtGuideView.tsx
└── supabase/
    ├── config.toml
    ├── migrations/
    │   ├── 001_cbt_pai_smart_schema.sql
    │   └── 002_rls_policies.sql
    └── functions/
        ├── _shared/cors.ts
        ├── start-exam/index.ts
        ├── save-answer/index.ts
        ├── submit-exam/index.ts
        ├── grade-essay/index.ts
        └── manage-users/index.ts
```

---

## 2. Langkah Instalasi & Setup Database Supabase

1. **Salin Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
   **PENTING:** Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` di `.env` frontend (`VITE_*`).

2. **Jalankan Skema SQL & RLS di Supabase SQL Editor**
   - Buka **Supabase Dashboard → SQL Editor**.
   - Jalankan `supabase/migrations/001_cbt_pai_smart_schema.sql` untuk membuat 12 tabel utama (`academic_years`, `classes`, `profiles`, `students`, `subjects`, `materials`, `question_bank`, `exams`, `exam_questions`, `exam_attempts`, `student_answers`, `exam_results`), tabel pengaturan sekolah, log aktivitas, indeks, serta bucket Storage `cbt-media`.
   - Jalankan `supabase/migrations/002_rls_policies.sql` untuk mengaktifkan Row Level Security (RLS) yang mencegah siswa membaca `correct_answer` atau memanipulasi nilai.

3. **Deploy Supabase Edge Functions**
   Pastikan Supabase CLI terpasang (`npm i -g supabase`):
   ```bash
   supabase login
   supabase link --project-ref <PROJECT_REF>
   supabase functions deploy start-exam
   supabase functions deploy save-answer
   supabase functions deploy submit-exam
   supabase functions deploy grade-essay
   supabase functions deploy manage-users
   ```

4. **Buat Akun Guru Pertama**
   - Masuk ke menu **Daftar Akun Guru** di halaman login **CBT PAI SMART** (atau buat user melalui **Supabase Auth → Users** lalu tambahkan baris ke `public.profiles` dengan `role = 'guru'`).
   - Database dimulai dalam kondisi **kosong tanpa data siswa atau soal contoh** dan siap diisi langsung oleh Guru melalui menu **Manajemen Data** & **Bank Soal**.

---

## 3. Jalankan Lokal & Build Produksi

```bash
npm install
npm run dev
```

Build produksi & deploy ke Vercel / Netlify / Node server:
```bash
npm run build
npm run start
```
