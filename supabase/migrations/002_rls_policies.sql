-- ============================================================================
-- CBT PAI SMART - UPT SMPN 2 REBANG TANGKAS
-- Row Level Security (RLS) & Keamanan Akses Berbasis Peran
-- ============================================================================

-- Helper Functions (SECURITY DEFINER agar tidak memicu rekursi RLS)
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('guru', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS UUID AS $$
  SELECT id FROM public.students
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. academic_years
DROP POLICY IF EXISTS "academic_years_read_all" ON public.academic_years;
CREATE POLICY "academic_years_read_all" ON public.academic_years
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "academic_years_teacher_manage" ON public.academic_years;
CREATE POLICY "academic_years_teacher_manage" ON public.academic_years
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 2. classes
DROP POLICY IF EXISTS "classes_read_all" ON public.classes;
CREATE POLICY "classes_read_all" ON public.classes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "classes_teacher_manage" ON public.classes;
CREATE POLICY "classes_teacher_manage" ON public.classes
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 3. profiles
DROP POLICY IF EXISTS "profiles_read_own_or_teacher" ON public.profiles;
CREATE POLICY "profiles_read_own_or_teacher" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_teacher());

DROP POLICY IF EXISTS "profiles_insert_own_or_teacher" ON public.profiles;
CREATE POLICY "profiles_insert_own_or_teacher" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_teacher()
    OR (id = auth.uid() AND role = 'siswa')
    OR (
      id = auth.uid()
      AND role = 'guru'
      AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE role IN ('guru', 'admin'))
    )
  );

DROP POLICY IF EXISTS "profiles_update_own_safe" ON public.profiles;
CREATE POLICY "profiles_update_own_safe" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_teacher())
  WITH CHECK (
    public.is_teacher()
    OR (id = auth.uid() AND role = 'siswa')
  );

-- 4. students
DROP POLICY IF EXISTS "students_read_own_or_teacher" ON public.students;
CREATE POLICY "students_read_own_or_teacher" ON public.students
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_teacher());

DROP POLICY IF EXISTS "students_teacher_manage" ON public.students;
CREATE POLICY "students_teacher_manage" ON public.students
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 5. subjects & 6. materials
DROP POLICY IF EXISTS "subjects_read_all" ON public.subjects;
CREATE POLICY "subjects_read_all" ON public.subjects
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "subjects_teacher_manage" ON public.subjects;
CREATE POLICY "subjects_teacher_manage" ON public.subjects
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

DROP POLICY IF EXISTS "materials_read_all" ON public.materials;
CREATE POLICY "materials_read_all" ON public.materials
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "materials_teacher_manage" ON public.materials;
CREATE POLICY "materials_teacher_manage" ON public.materials
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 7. question_bank (CRITICAL: Siswa DILARANG membaca langsung agar correct_answer tidak bocor)
DROP POLICY IF EXISTS "question_bank_teacher_only" ON public.question_bank;
CREATE POLICY "question_bank_teacher_only" ON public.question_bank
  FOR ALL TO authenticated
  USING (public.is_teacher())
  WITH CHECK (public.is_teacher());

-- 8. exams (Siswa hanya dapat melihat ujian yang dipublikasikan untuk kelasnya, tanpa akses code guru)
DROP POLICY IF EXISTS "exams_teacher_manage" ON public.exams;
CREATE POLICY "exams_teacher_manage" ON public.exams
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

DROP POLICY IF EXISTS "exams_student_read_published" ON public.exams;
CREATE POLICY "exams_student_read_published" ON public.exams
  FOR SELECT TO authenticated
  USING (
    status IN ('published', 'ongoing', 'closed')
    AND (
      class_id IS NULL
      OR class_id = (SELECT class_id FROM public.students WHERE user_id = auth.uid() LIMIT 1)
    )
  );

-- 9. exam_questions (Hanya guru; siswa menerima daftar soal aman via Edge Function start-exam)
DROP POLICY IF EXISTS "exam_questions_teacher_only" ON public.exam_questions;
CREATE POLICY "exam_questions_teacher_only" ON public.exam_questions
  FOR ALL TO authenticated
  USING (public.is_teacher())
  WITH CHECK (public.is_teacher());

-- 10. exam_attempts (Siswa hanya baca miliknya; pembuatan & penilaian lewat Edge Functions)
DROP POLICY IF EXISTS "exam_attempts_read_own_or_teacher" ON public.exam_attempts;
CREATE POLICY "exam_attempts_read_own_or_teacher" ON public.exam_attempts
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR public.is_teacher());

DROP POLICY IF EXISTS "exam_attempts_teacher_manage" ON public.exam_attempts;
CREATE POLICY "exam_attempts_teacher_manage" ON public.exam_attempts
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 11. student_answers (Siswa hanya baca jawaban miliknya; simpan jawaban lewat Edge Function save-answer)
DROP POLICY IF EXISTS "student_answers_read_own_or_teacher" ON public.student_answers;
CREATE POLICY "student_answers_read_own_or_teacher" ON public.student_answers
  FOR SELECT TO authenticated
  USING (
    public.is_teacher()
    OR attempt_id IN (
      SELECT id FROM public.exam_attempts WHERE student_id = public.current_student_id()
    )
  );

DROP POLICY IF EXISTS "student_answers_teacher_manage" ON public.student_answers;
CREATE POLICY "student_answers_teacher_manage" ON public.student_answers
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- 12. exam_results (Siswa hanya baca hasil miliknya yang sudah diizinkan tampil; siswa tidak boleh mengubah nilai)
DROP POLICY IF EXISTS "exam_results_read_own_or_teacher" ON public.exam_results;
CREATE POLICY "exam_results_read_own_or_teacher" ON public.exam_results
  FOR SELECT TO authenticated
  USING (
    public.is_teacher()
    OR (student_id = public.current_student_id() AND is_published_to_student = true)
  );

DROP POLICY IF EXISTS "exam_results_teacher_manage" ON public.exam_results;
CREATE POLICY "exam_results_teacher_manage" ON public.exam_results
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

-- school_settings & activity_logs
DROP POLICY IF EXISTS "school_settings_read_all" ON public.school_settings;
CREATE POLICY "school_settings_read_all" ON public.school_settings
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "school_settings_teacher_manage" ON public.school_settings;
CREATE POLICY "school_settings_teacher_manage" ON public.school_settings
  FOR ALL TO authenticated USING (public.is_teacher()) WITH CHECK (public.is_teacher());

DROP POLICY IF EXISTS "activity_logs_read_own_or_teacher" ON public.activity_logs;
CREATE POLICY "activity_logs_read_own_or_teacher" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_teacher());

DROP POLICY IF EXISTS "activity_logs_insert_own" ON public.activity_logs;
CREATE POLICY "activity_logs_insert_own" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_teacher());

-- Storage RLS untuk bucket cbt-media
DROP POLICY IF EXISTS "cbt_media_public_read" ON storage.objects;
CREATE POLICY "cbt_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cbt-media');

DROP POLICY IF EXISTS "cbt_media_teacher_insert" ON storage.objects;
CREATE POLICY "cbt_media_teacher_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cbt-media' AND public.is_teacher());

DROP POLICY IF EXISTS "cbt_media_teacher_delete" ON storage.objects;
CREATE POLICY "cbt_media_teacher_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cbt-media' AND public.is_teacher());
