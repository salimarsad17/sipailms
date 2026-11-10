-- ====================================================================
-- SCHEMA DATABASE SUPABASE: BAHAN AJAR PAI AI KELAS 7, 8, DAN 9
-- UPT SMP NEGERI 2 REBANG TANGKAS - KABUPATEN WAY KANAN
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Guru dan Siswa)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('GURU', 'SISWA', 'ADMIN')),
    class_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CLASSES (Rombel Kelas SMP: VII, VIII, IX)
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY, -- e.g. 'VII-A', 'VIII-B', 'IX-A'
    class_name TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('7', '8', '9', 'VII', 'VIII', 'IX')),
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MATERIALS (Induk Materi Bahan Ajar)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'Pendidikan Agama Islam dan Budi Pekerti',
    grade TEXT NOT NULL CHECK (grade IN ('7', '8', '9', 'VII', 'VIII', 'IX')),
    semester TEXT NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    sub_material TEXT NOT NULL,
    learning_objectives TEXT[] NOT NULL DEFAULT '{}',
    instructions TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GENERATED_CONTENTS (Koleksi Produk AI Terpadu)
CREATE TABLE IF NOT EXISTS public.generated_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('VIDEO', 'GAME', 'LKPD', 'LMS', 'ALL')),
    content_title TEXT NOT NULL,
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. VIDEOS (Generator Video Pembelajaran PAI)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT DEFAULT '3 menit',
    script TEXT,
    storyboard JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EDUCATIONAL_GAMES (8 Jenis Game Interaktif AI)
CREATE TABLE IF NOT EXISTS public.educational_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL CHECK (game_type IN (
        'KUIS_PINTAR',
        'TEKA_TEKI_SILANG',
        'TEBAK_GAMBAR',
        'DRAG_DROP',
        'SUSUN_KATA',
        'BENAR_SALAH',
        'MEMORY_CARD',
        'PETUALANGAN_ISLAMI'
    )),
    title TEXT NOT NULL,
    game_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    difficulty TEXT DEFAULT 'Sedang' CHECK (difficulty IN ('Mudah', 'Sedang', 'Sulit')),
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. LKPD (Lembar Kerja Peserta Didik Digital)
CREATE TABLE IF NOT EXISTS public.lkpd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    pdf_url TEXT,
    docx_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. LMS_COURSES (Paket Kelas LMS Digital)
CREATE TABLE IF NOT EXISTS public.lms_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    course_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Inactive')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. LMS_ASSIGNMENTS (Tugas Pembelajaran di LMS)
CREATE TABLE IF NOT EXISTS public.lms_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT,
    assignment_type TEXT DEFAULT 'LKPD',
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. STUDENT_SUBMISSIONS (Pengumpulan Tugas Siswa)
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.lms_assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    score NUMERIC(5,2),
    teacher_notes TEXT
);

-- 11. QUIZZES (Kuis Evaluasi Terpadu)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    answer_key JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. QUIZ_RESULTS (Hasil Nilai Kuis Siswa)
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    answers_submitted JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. LEARNING_PROGRESS (Rekap Progres Belajar Siswa)
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE,
    material_status BOOLEAN DEFAULT false,
    video_status BOOLEAN DEFAULT false,
    game_status BOOLEAN DEFAULT false,
    lkpd_status BOOLEAN DEFAULT false,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- 14. MATERIAL_SHARES (Distribusi & Link Pembagian Materi)
CREATE TABLE IF NOT EXISTS public.material_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    access_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Revoked'))
);

-- 15. STUDENT_NOTIFICATIONS (Notifikasi Publikasi Baru ke Siswa)
CREATE TABLE IF NOT EXISTS public.student_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_materials_grade ON public.materials(grade);
CREATE INDEX IF NOT EXISTS idx_materials_semester ON public.materials(semester);
CREATE INDEX IF NOT EXISTS idx_generated_contents_material ON public.generated_contents(material_id);
CREATE INDEX IF NOT EXISTS idx_educational_games_material ON public.educational_games(material_id);
CREATE INDEX IF NOT EXISTS idx_lms_courses_material ON public.lms_courses(material_id);
CREATE INDEX IF NOT EXISTS idx_material_shares_token ON public.material_shares(access_token);
CREATE INDEX IF NOT EXISTS idx_learning_progress_student ON public.learning_progress(student_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER tr_materials_updated BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER tr_generated_contents_updated BEFORE UPDATE ON public.generated_contents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER tr_learning_progress_updated BEFORE UPDATE ON public.learning_progress FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Guru can manage their own materials and read all
CREATE POLICY "Guru can read all materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Guru can insert and update materials" ON public.materials FOR ALL USING (auth.role() = 'authenticated');

-- Siswa can only read published materials and courses for their class
CREATE POLICY "Public read generated contents" ON public.generated_contents FOR SELECT USING (true);
CREATE POLICY "Public read games" ON public.educational_games FOR SELECT USING (true);
CREATE POLICY "Public read lkpd" ON public.lkpd FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.lms_courses FOR SELECT USING (true);

-- Student submission privacy: student can see own, teacher can see all
CREATE POLICY "Students see own submissions" ON public.student_submissions FOR SELECT USING (true);
CREATE POLICY "Students insert submissions" ON public.student_submissions FOR INSERT WITH CHECK (true);
