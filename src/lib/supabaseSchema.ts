/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SUPABASE_SETUP_SQL = `-- ====================================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI PAI LMS & BUDI PEKERTI
-- Proyek: UPT SMPN 2 Rebang Tangkas
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ====================================================================

-- 1. Tabel Utama: Penyimpanan Cepat Terintegrasi (app_store)
-- Tabel ini memungkinkan sinkronisasi otomatis seluruh modul secara instan
CREATE TABLE IF NOT EXISTS public.app_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Data Sekolah
CREATE TABLE IF NOT EXISTS public.sekolah (
    id TEXT PRIMARY KEY DEFAULT 'sekolah-utama',
    nama_sekolah TEXT NOT NULL,
    npsn TEXT,
    alamat TEXT,
    akreditasi TEXT,
    nama_kepsek TEXT,
    nip_kepsek TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Guru
CREATE TABLE IF NOT EXISTS public.guru (
    nip TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    sertifikasi TEXT,
    kontak TEXT,
    is_wali_kelas BOOLEAN DEFAULT false,
    wali_kelas_di TEXT,
    foto_profil TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Kelas
CREATE TABLE IF NOT EXISTS public.kelas (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    wali_kelas_nip TEXT,
    wali_kelas_nama TEXT,
    kuota INT DEFAULT 32,
    total_siswa INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Siswa
CREATE TABLE IF NOT EXISTS public.siswa (
    nisn TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    gender TEXT,
    agama TEXT DEFAULT 'Islam',
    status_keaktifan TEXT DEFAULT 'Aktif',
    kelas_id TEXT REFERENCES public.kelas(id) ON DELETE SET NULL,
    kontak_orang_tua TEXT,
    catatan_khusus TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Rekap Nilai Siswa
CREATE TABLE IF NOT EXISTS public.rekap_nilai (
    siswa_nisn TEXT PRIMARY KEY,
    siswa_nama TEXT NOT NULL,
    kelas_id TEXT,
    formatif_kuis NUMERIC DEFAULT 0,
    formatif_tugas NUMERIC DEFAULT 0,
    formatif_diskusi NUMERIC DEFAULT 0,
    sumatif_pts NUMERIC DEFAULT 0,
    sumatif_pas NUMERIC DEFAULT 0,
    hafalan_juz_amma NUMERIC DEFAULT 0,
    praktik_sholat NUMERIC DEFAULT 0,
    praktik_wudhu NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Jurnal Guru
CREATE TABLE IF NOT EXISTS public.jurnal_guru (
    id TEXT PRIMARY KEY,
    tanggal DATE,
    jam_ke TEXT,
    kelas_id TEXT,
    materi TEXT,
    capaian_pembelajaran TEXT,
    aktivitas TEXT,
    kehadiran JSONB,
    evaluasi_siswa TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Tugas LMS
CREATE TABLE IF NOT EXISTS public.tugas_lms (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    deskripsi TEXT,
    kelas_id TEXT,
    tenggat_waktu TIMESTAMPTZ,
    jenis TEXT,
    status TEXT DEFAULT 'Aktif',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabel Pengumpulan Tugas
CREATE TABLE IF NOT EXISTS public.pengumpulan_tugas (
    id TEXT PRIMARY KEY,
    tugas_id TEXT,
    siswa_nisn TEXT,
    siswa_nama TEXT,
    kelas_id TEXT,
    tanggal_kumpul TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Diserahkan',
    nilai NUMERIC,
    feedback TEXT,
    file_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabel Pesan Komunikasi PAI
CREATE TABLE IF NOT EXISTS public.pesan_pai (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_role TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false,
    attachment_url TEXT
);

-- 11. Tabel Akun Pengguna
CREATE TABLE IF NOT EXISTS public.accounts (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    identifier TEXT NOT NULL,
    password TEXT NOT NULL,
    nama TEXT NOT NULL,
    kelas_id TEXT,
    kontak TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS) & IZIN AKSES ANON PUBLIC
ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekap_nilai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tugas_lms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumpulan_tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_pai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Buat Policy agar Public Anon Key dapat melakukan SELECT, INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Public Anon Access" ON public.app_store;
CREATE POLICY "Public Anon Access" ON public.app_store FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.sekolah;
CREATE POLICY "Public Anon Access" ON public.sekolah FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.guru;
CREATE POLICY "Public Anon Access" ON public.guru FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.kelas;
CREATE POLICY "Public Anon Access" ON public.kelas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.siswa;
CREATE POLICY "Public Anon Access" ON public.siswa FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.rekap_nilai;
CREATE POLICY "Public Anon Access" ON public.rekap_nilai FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.jurnal_guru;
CREATE POLICY "Public Anon Access" ON public.jurnal_guru FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.tugas_lms;
CREATE POLICY "Public Anon Access" ON public.tugas_lms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.pengumpulan_tugas;
CREATE POLICY "Public Anon Access" ON public.pengumpulan_tugas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.pesan_pai;
CREATE POLICY "Public Anon Access" ON public.pesan_pai FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Anon Access" ON public.accounts;
CREATE POLICY "Public Anon Access" ON public.accounts FOR ALL USING (true) WITH CHECK (true);
`;
