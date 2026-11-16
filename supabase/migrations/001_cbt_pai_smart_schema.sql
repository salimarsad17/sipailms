-- ============================================================================
-- CBT PAI SMART - UPT SMPN 2 REBANG TANGKAS
-- Skema Database PostgreSQL Supabase (Produksi, Tanpa Data Dummy Otomatis)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fungsi trigger untuk memperbarui kolom updated_at secara otomatis
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. academic_years (Tahun Pelajaran)
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_name TEXT NOT NULL UNIQUE,
  semester TEXT NOT NULL DEFAULT 'Ganjil' CHECK (semester IN ('Ganjil', 'Genap')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. classes (Data Kelas VII, VIII, IX)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name TEXT NOT NULL,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('VII', 'VIII', 'IX')),
  academic_year TEXT NOT NULL,
  homeroom_teacher TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_name, academic_year)
);

-- 3. profiles (Profil Pengguna terhubung ke auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guru', 'siswa', 'admin')),
  student_id UUID,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  nip TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. students (Data Identitas Siswa)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  nis TEXT NOT NULL,
  nisn TEXT NOT NULL UNIQUE,
  participant_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  gender TEXT DEFAULT 'L' CHECK (gender IN ('L', 'P')),
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tambahkan FK profiles.student_id -> students.id setelah tabel students dibuat
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_student_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_student_id_fkey
      FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. subjects (Mata Pelajaran)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL UNIQUE,
  subject_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. materials (Materi Pembelajaran PAI)
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('VII', 'VIII', 'IX')),
  semester TEXT NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
  title TEXT NOT NULL,
  sub_material TEXT,
  learning_objective TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. question_bank (Bank Soal 6 Tipe + Media + Ayat Al-Qur'an)
CREATE TABLE IF NOT EXISTS public.question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject_name TEXT NOT NULL DEFAULT 'Pendidikan Agama Islam',
  grade_level TEXT NOT NULL DEFAULT 'VII' CHECK (grade_level IN ('VII', 'VIII', 'IX')),
  semester TEXT NOT NULL DEFAULT 'Ganjil' CHECK (semester IN ('Ganjil', 'Genap')),
  chapter_title TEXT,
  sub_material TEXT,
  learning_objective TEXT,
  question_type TEXT NOT NULL CHECK (
    question_type IN (
      'pilihan_ganda',
      'pilihan_ganda_kompleks',
      'benar_salah',
      'menjodohkan',
      'isian_singkat',
      'esai'
    )
  ),
  question_text TEXT NOT NULL,
  question_image TEXT,
  illustration_url TEXT,
  table_data JSONB,
  quran_arabic TEXT,
  quran_translation TEXT,
  audio_url TEXT,
  video_url TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer JSONB NOT NULL DEFAULT '{}'::jsonb,
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Sedang' CHECK (difficulty IN ('Mudah', 'Sedang', 'Sulit')),
  score NUMERIC(6, 2) NOT NULL DEFAULT 10 CHECK (score > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. exams (Konfigurasi & Jadwal Ujian)
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  grade_level TEXT NOT NULL DEFAULT 'VII' CHECK (grade_level IN ('VII', 'VIII', 'IX')),
  semester TEXT NOT NULL DEFAULT 'Ganjil' CHECK (semester IN ('Ganjil', 'Genap')),
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  material_name TEXT,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('UH', 'PH', 'PTS', 'PAS', 'PAT', 'Sumatif')),
  exam_date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  access_code TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. exam_questions (Relasi Soal ke Ujian)
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL DEFAULT 1,
  score NUMERIC(6, 2) NOT NULL DEFAULT 10 CHECK (score > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (exam_id, question_id)
);

-- 10. exam_attempts (Sesi Pengerjaan Ujian Siswa)
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC(6, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  question_order JSONB DEFAULT '[]'::jsonb,
  option_order JSONB DEFAULT '{}'::jsonb,
  flagged_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (exam_id, student_id, attempt_number)
);

-- 11. student_answers (Jawaban Detail per Soal)
CREATE TABLE IF NOT EXISTS public.student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
  answer JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_correct BOOLEAN,
  score_obtained NUMERIC(6, 2) NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, question_id)
);

-- 12. exam_results (Rekap Nilai Final & Status Ketuntasan)
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL UNIQUE REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_wrong INTEGER NOT NULL DEFAULT 0,
  total_unanswered INTEGER NOT NULL DEFAULT 0,
  earned_points NUMERIC(8, 2) NOT NULL DEFAULT 0,
  max_points NUMERIC(8, 2) NOT NULL DEFAULT 0,
  final_score NUMERIC(6, 2) NOT NULL DEFAULT 0,
  kktp NUMERIC(6, 2) NOT NULL DEFAULT 75,
  completion_status TEXT NOT NULL DEFAULT 'Belum Tuntas' CHECK (completion_status IN ('Tuntas', 'Belum Tuntas', 'Menunggu Koreksi')),
  teacher_feedback TEXT,
  is_published_to_student BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Pendukung Fitur Tambahan (Section L)
CREATE TABLE IF NOT EXISTS public.school_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  school_name TEXT NOT NULL DEFAULT 'UPT SMPN 2 Rebang Tangkas',
  npsn TEXT,
  address TEXT,
  district TEXT,
  regency TEXT,
  principal_name TEXT,
  principal_nip TEXT,
  subject_name TEXT NOT NULL DEFAULT 'Pendidikan Agama Islam',
  running_text TEXT NOT NULL DEFAULT 'Guru Kreatif, Siswa Aktif',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks Performa Query
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_nisn ON public.students(nisn);
CREATE INDEX IF NOT EXISTS idx_materials_grade_semester ON public.materials(grade_level, semester);
CREATE INDEX IF NOT EXISTS idx_qbank_filters ON public.question_bank(grade_level, semester, question_type, difficulty);
CREATE INDEX IF NOT EXISTS idx_exams_class_status ON public.exams(class_id, status, exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON public.exam_questions(exam_id, question_order);
CREATE INDEX IF NOT EXISTS idx_attempts_exam_student ON public.exam_attempts(exam_id, student_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON public.student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_student ON public.exam_results(exam_id, student_id);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_academic_years_updated_at ON public.academic_years;
CREATE TRIGGER trg_academic_years_updated_at BEFORE UPDATE ON public.academic_years FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_classes_updated_at ON public.classes;
CREATE TRIGGER trg_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_students_updated_at ON public.students;
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_subjects_updated_at ON public.subjects;
CREATE TRIGGER trg_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_question_bank_updated_at ON public.question_bank;
CREATE TRIGGER trg_question_bank_updated_at BEFORE UPDATE ON public.question_bank FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_exams_updated_at ON public.exams;
CREATE TRIGGER trg_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_exam_attempts_updated_at ON public.exam_attempts;
CREATE TRIGGER trg_exam_attempts_updated_at BEFORE UPDATE ON public.exam_attempts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_exam_results_updated_at ON public.exam_results;
CREATE TRIGGER trg_exam_results_updated_at BEFORE UPDATE ON public.exam_results FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage Bucket untuk Media Soal (Gambar, Audio, Video)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cbt-media', 'cbt-media', true)
ON CONFLICT (id) DO NOTHING;
