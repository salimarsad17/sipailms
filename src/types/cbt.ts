/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CbtRole = "guru" | "siswa" | "admin";
export type GradeLevel = "VII" | "VIII" | "IX";
export type SemesterType = "Ganjil" | "Genap";
export type DifficultyLevel = "Mudah" | "Sedang" | "Sulit";
export type ExamType = "UH" | "PH" | "PTS" | "PAS" | "PAT" | "Sumatif";
export type ExamStatus = "draft" | "published" | "ongoing" | "closed";
export type QuestionType =
  | "pilihan_ganda"
  | "pilihan_ganda_kompleks"
  | "benar_salah"
  | "menjodohkan"
  | "isian_singkat"
  | "esai";

export interface AcademicYear {
  id: string;
  year_name: string;
  semester: SemesterType;
  is_active: boolean;
  created_at?: string;
}

export interface CbtClass {
  id: string;
  class_name: string;
  grade_level: GradeLevel;
  academic_year: string;
  homeroom_teacher?: string | null;
  created_at?: string;
}

export interface CbtProfile {
  id: string;
  full_name: string;
  username: string;
  role: CbtRole;
  student_id?: string | null;
  class_id?: string | null;
  nip?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface CbtStudent {
  id: string;
  user_id?: string | null;
  nis: string;
  nisn: string;
  participant_number?: string | null;
  full_name: string;
  gender?: "L" | "P" | null;
  class_id?: string | null;
  is_active: boolean;
  classes?: CbtClass | null;
  created_at?: string;
}

export interface CbtSubject {
  id: string;
  subject_code: string;
  subject_name: string;
  description?: string | null;
}

export interface CbtMaterial {
  id: string;
  subject_id: string;
  class_id?: string | null;
  grade_level: GradeLevel;
  semester: SemesterType;
  title: string;
  sub_material?: string | null;
  learning_objective?: string | null;
  subjects?: CbtSubject | null;
}

export interface QuestionOptionItem {
  key: string; // e.g. "A", "B", "C", "D", "E" or "BENAR", "SALAH"
  text: string;
}

export interface MatchingPairOption {
  id: string;
  left: string;
  right?: string; // Present in teacher view; omitted/pooled in student view
  rightPool?: string[]; // Shuffled pool sent to student browser
}

export interface QuestionTableData {
  headers: string[];
  rows: string[][];
}

export interface QuestionBankItem {
  id: string;
  material_id?: string | null;
  created_by?: string | null;
  subject_name: string;
  grade_level: GradeLevel;
  semester: SemesterType;
  chapter_title?: string | null;
  sub_material?: string | null;
  learning_objective?: string | null;
  question_type: QuestionType;
  question_text: string;
  question_image?: string | null;
  illustration_url?: string | null;
  table_data?: QuestionTableData | null;
  quran_arabic?: string | null;
  quran_translation?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  options: QuestionOptionItem[] | MatchingPairOption[];
  correct_answer?: Record<string, any>; // Only visible to Guru; stripped for Siswa
  explanation?: string | null;
  difficulty: DifficultyLevel;
  score: number;
  created_at?: string;
}

export interface SanitizedExamQuestion {
  id: string;
  order: number;
  score: number;
  question_type: QuestionType;
  question_text: string;
  question_image?: string | null;
  illustration_url?: string | null;
  table_data?: QuestionTableData | null;
  quran_arabic?: string | null;
  quran_translation?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  options: QuestionOptionItem[] | MatchingPairOption[];
  difficulty: DifficultyLevel;
}

export interface ExamSettings {
  question_count: number;
  default_question_score: number;
  kktp: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  max_attempts: number;
  show_result_mode: "immediate" | "after_teacher_review";
  allow_remedial: boolean;
  remedial_min_score?: number;
  questions_per_page: 1 | 5;
  complex_scoring_rule: "semua_benar" | "proporsional";
}

export interface CbtExam {
  id: string;
  created_by?: string | null;
  title: string;
  class_id?: string | null;
  grade_level: GradeLevel;
  semester: SemesterType;
  material_id?: string | null;
  material_name?: string | null;
  exam_type: ExamType;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  access_code: string;
  settings: ExamSettings;
  status: ExamStatus;
  classes?: CbtClass | null;
  created_at?: string;
}

export interface ExamQuestionLink {
  id: string;
  exam_id: string;
  question_id: string;
  question_order: number;
  score: number;
  question_bank?: QuestionBankItem;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  started_at: string;
  submitted_at?: string | null;
  score: number;
  status: "in_progress" | "submitted" | "graded" | "expired";
  attempt_number: number;
  flagged_questions?: string[];
  exams?: CbtExam;
  students?: CbtStudent;
}

export interface StudentAnswerRecord {
  id?: string;
  attempt_id: string;
  question_id: string;
  answer: Record<string, any>;
  is_correct?: boolean | null;
  score_obtained?: number;
  is_flagged?: boolean;
  saved_at: string;
}

export interface ExamResultRecord {
  id: string;
  attempt_id: string;
  student_id: string;
  exam_id: string;
  total_correct: number;
  total_wrong: number;
  total_unanswered: number;
  earned_points: number;
  max_points: number;
  final_score: number;
  kktp: number;
  completion_status: "Tuntas" | "Belum Tuntas" | "Menunggu Koreksi";
  teacher_feedback?: string | null;
  is_published_to_student: boolean;
  created_at?: string;
  students?: CbtStudent;
  exams?: CbtExam;
  exam_attempts?: ExamAttempt;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  npsn?: string | null;
  address?: string | null;
  district?: string | null;
  regency?: string | null;
  principal_name?: string | null;
  principal_nip?: string | null;
  subject_name: string;
  running_text: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  student_id?: string | null;
  action: string;
  detail?: string | null;
  created_at: string;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  pilihan_ganda: "Pilihan Ganda (A-E)",
  pilihan_ganda_kompleks: "Pilihan Ganda Kompleks",
  benar_salah: "Benar / Salah",
  menjodohkan: "Menjodohkan",
  isian_singkat: "Isian Singkat",
  esai: "Esai / Uraian",
};
