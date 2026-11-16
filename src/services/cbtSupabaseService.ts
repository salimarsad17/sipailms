/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "../lib/supabase";
import {
  AcademicYear,
  ActivityLog,
  CbtClass,
  CbtExam,
  CbtMaterial,
  CbtProfile,
  CbtStudent,
  CbtSubject,
  ExamAttempt,
  ExamQuestionLink,
  ExamResultRecord,
  QuestionBankItem,
  SanitizedExamQuestion,
  SchoolSettings,
  StudentAnswerRecord,
} from "../types/cbt";

const USERNAME_DOMAIN = "@cbt.smpn2rt.sch.id";

export function normalizeLoginEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  const safeUser = trimmed.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
  return `${safeUser}${USERNAME_DOMAIN}`;
}

export interface SchemaDiagnostics {
  ready: boolean;
  missingTables: string[];
  checkedTables: string[];
}

const REQUIRED_TABLES = [
  "academic_years",
  "classes",
  "profiles",
  "students",
  "subjects",
  "materials",
  "question_bank",
  "exams",
  "exam_questions",
  "exam_attempts",
  "student_answers",
  "exam_results",
];

export const cbtSupabaseService = {
  // Diagnosa kesiapan 12 tabel Supabase
  async diagnoseSchema(): Promise<SchemaDiagnostics> {
    const missing: string[] = [];
    await Promise.all(
      REQUIRED_TABLES.map(async (tbl) => {
        const { error } = await supabase.from(tbl).select("id").limit(1);
        if (error && (error.code === "42P01" || error.message?.includes("does not exist") || error.message?.includes("schema cache"))) {
          missing.push(tbl);
        }
      })
    );
    return {
      ready: missing.length === 0,
      missingTables: missing,
      checkedTables: REQUIRED_TABLES,
    };
  },

  // ================= AUTH & SESSION =================
  async getCurrentSessionProfile(): Promise<{
    userId: string;
    email: string;
    profile: CbtProfile | null;
    student: CbtStudent | null;
  } | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    let student: CbtStudent | null = null;
    if (profile?.role === "siswa" || profile?.student_id) {
      const { data: st } = await supabase
        .from("students")
        .select("*, classes(*)")
        .eq("user_id", user.id)
        .maybeSingle();
      student = (st as CbtStudent) || null;
    }

    return {
      userId: user.id,
      email: user.email || "",
      profile: (profile as CbtProfile) || null,
      student,
    };
  },

  async signIn(identifier: string, password: string) {
    let loginEmail = normalizeLoginEmail(identifier);

    // Jika input bukan email, coba cek email auth atau konvensi username@cbt.smpn2rt.sch.id
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      throw new Error(error.message || "Username/email atau kata sandi tidak valid.");
    }
    return data;
  },

  async registerGuru(params: {
    emailOrUsername: string;
    password: string;
    fullName: string;
    nip?: string;
  }) {
    const email = normalizeLoginEmail(params.emailOrUsername);
    const username = params.emailOrUsername.includes("@")
      ? params.emailOrUsername.split("@")[0]
      : params.emailOrUsername.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          role: "guru",
          username,
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Pendaftaran gagal, periksa konfigurasi Supabase Auth.");

    // Jika session aktif langsung tersedia (confirm email off), buat baris profile guru
    if (data.session) {
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: params.fullName,
        username,
        role: "guru",
        nip: params.nip || null,
      });
      if (profErr) {
        throw new Error(
          `Akun auth terbuat, namun gagal menyimpan profil guru: ${profErr.message}`
        );
      }
    }
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  // ================= SCHOOL & MASTER DATA =================
  async getSchoolSettings(): Promise<SchoolSettings | null> {
    const { data } = await supabase.from("school_settings").select("*").eq("id", "main").maybeSingle();
    return (data as SchoolSettings) || null;
  },

  async saveSchoolSettings(payload: Partial<SchoolSettings>) {
    const { data, error } = await supabase
      .from("school_settings")
      .upsert({ id: "main", ...payload })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as SchoolSettings;
  },

  async getAcademicYears(): Promise<AcademicYear[]> {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .order("year_name", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as AcademicYear[];
  },

  async upsertAcademicYear(item: Partial<AcademicYear>) {
    if (item.is_active) {
      await supabase.from("academic_years").update({ is_active: false }).neq("id", item.id || "");
    }
    const { data, error } = await supabase.from("academic_years").upsert(item).select("*").single();
    if (error) throw new Error(error.message);
    return data as AcademicYear;
  },

  async deleteAcademicYear(id: string) {
    const { error } = await supabase.from("academic_years").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async getClasses(): Promise<CbtClass[]> {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("grade_level", { ascending: true })
      .order("class_name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as CbtClass[];
  },

  async upsertClass(item: Partial<CbtClass>) {
    const { data, error } = await supabase.from("classes").upsert(item).select("*").single();
    if (error) throw new Error(error.message);
    return data as CbtClass;
  },

  async deleteClass(id: string) {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async getStudents(): Promise<CbtStudent[]> {
    const { data, error } = await supabase
      .from("students")
      .select("*, classes(*)")
      .order("full_name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as CbtStudent[];
  },

  async upsertStudent(item: Partial<CbtStudent>) {
    const { data, error } = await supabase.from("students").upsert(item).select("*, classes(*)").single();
    if (error) throw new Error(error.message);
    return data as CbtStudent;
  },

  async provisionStudentAccount(params: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    nis: string;
    nisn: string;
    participantNumber?: string;
    classId?: string | null;
    gender?: "L" | "P";
  }) {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: {
        action: "create_student_account",
        ...params,
      },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  },

  async deleteStudent(id: string) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async getTeachers(): Promise<CbtProfile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["guru", "admin"])
      .order("full_name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as CbtProfile[];
  },

  async getSubjects(): Promise<CbtSubject[]> {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("subject_name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as CbtSubject[];
  },

  async upsertSubject(item: Partial<CbtSubject>) {
    const { data, error } = await supabase.from("subjects").upsert(item).select("*").single();
    if (error) throw new Error(error.message);
    return data as CbtSubject;
  },

  async deleteSubject(id: string) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async getMaterials(): Promise<CbtMaterial[]> {
    const { data, error } = await supabase
      .from("materials")
      .select("*, subjects(*)")
      .order("grade_level", { ascending: true })
      .order("title", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as CbtMaterial[];
  },

  async upsertMaterial(item: Partial<CbtMaterial>) {
    const { data, error } = await supabase.from("materials").upsert(item).select("*, subjects(*)").single();
    if (error) throw new Error(error.message);
    return data as CbtMaterial;
  },

  async deleteMaterial(id: string) {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // ================= QUESTION BANK & STORAGE =================
  async uploadQuestionMedia(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "bin";
    const filePath = `questions/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("cbt-media").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(`Gagal unggah media ke Supabase Storage: ${error.message}`);
    const { data } = supabase.storage.from("cbt-media").getPublicUrl(filePath);
    return data.publicUrl;
  },

  async getQuestions(): Promise<QuestionBankItem[]> {
    const { data, error } = await supabase
      .from("question_bank")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as QuestionBankItem[];
  },

  async upsertQuestion(item: Partial<QuestionBankItem>) {
    const { data, error } = await supabase.from("question_bank").upsert(item).select("*").single();
    if (error) throw new Error(error.message);
    return data as QuestionBankItem;
  },

  async bulkInsertQuestions(items: Partial<QuestionBankItem>[]) {
    const { data, error } = await supabase.from("question_bank").insert(items).select("*");
    if (error) throw new Error(error.message);
    return (data || []) as QuestionBankItem[];
  },

  async deleteQuestion(id: string) {
    const { error } = await supabase.from("question_bank").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // ================= EXAMS =================
  async getExams(): Promise<CbtExam[]> {
    const { data, error } = await supabase
      .from("exams")
      .select("*, classes(*)")
      .order("exam_date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as CbtExam[];
  },

  async saveExamWithQuestions(
    examPayload: Partial<CbtExam>,
    selectedQuestions: { question_id: string; question_order: number; score: number }[]
  ): Promise<CbtExam> {
    const { data: savedExam, error: exErr } = await supabase
      .from("exams")
      .upsert(examPayload)
      .select("*, classes(*)")
      .single();
    if (exErr || !savedExam) throw new Error(exErr?.message || "Gagal menyimpan ujian");

    await supabase.from("exam_questions").delete().eq("exam_id", savedExam.id);
    if (selectedQuestions.length > 0) {
      const rows = selectedQuestions.map((q) => ({
        exam_id: savedExam.id,
        question_id: q.question_id,
        question_order: q.question_order,
        score: q.score,
      }));
      const { error: eqErr } = await supabase.from("exam_questions").insert(rows);
      if (eqErr) throw new Error(eqErr.message);
    }
    return savedExam as CbtExam;
  },

  async getExamQuestionsForTeacher(examId: string): Promise<ExamQuestionLink[]> {
    const { data, error } = await supabase
      .from("exam_questions")
      .select("*, question_bank(*)")
      .eq("exam_id", examId)
      .order("question_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as ExamQuestionLink[];
  },

  async updateExamStatus(examId: string, status: CbtExam["status"]) {
    const { error } = await supabase.from("exams").update({ status }).eq("id", examId);
    if (error) throw new Error(error.message);
  },

  async deleteExam(examId: string) {
    const { error } = await supabase.from("exams").delete().eq("id", examId);
    if (error) throw new Error(error.message);
  },

  // ================= SECURE EDGE FUNCTIONS (SISWA EXAM & GRADING) =================
  async startExam(examId: string, accessCode: string): Promise<{
    attempt: ExamAttempt;
    exam: CbtExam;
    questions: SanitizedExamQuestion[];
    savedAnswers: StudentAnswerRecord[];
  }> {
    const { data, error } = await supabase.functions.invoke("start-exam", {
      body: { examId, accessCode },
    });
    if (error) {
      throw new Error(
        error.message || "Gagal memanggil Edge Function start-exam. Pastikan Edge Functions telah di-deploy."
      );
    }
    if (data?.error) throw new Error(data.error);
    return data;
  },

  async saveAnswer(params: {
    attemptId: string;
    questionId: string;
    answer: Record<string, any>;
    isFlagged?: boolean;
    flaggedQuestions?: string[];
  }) {
    const { data, error } = await supabase.functions.invoke("save-answer", {
      body: params,
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  },

  async submitExam(attemptId: string, bulkAnswers: any[] = []) {
    const { data, error } = await supabase.functions.invoke("submit-exam", {
      body: { attemptId, bulkAnswers },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data as {
      submitted?: boolean;
      alreadySubmitted?: boolean;
      showResultToStudent?: boolean;
      hasPendingManual?: boolean;
      result: ExamResultRecord | null;
    };
  },

  async gradeEssay(params: {
    attemptId: string;
    grades: { questionId: string; scoreObtained: number }[];
    teacherFeedback?: string;
    publishResult?: boolean;
  }) {
    const { data, error } = await supabase.functions.invoke("grade-essay", {
      body: params,
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  },

  // ================= RESULTS, ATTEMPTS, ANSWERS & ACTIVITY LOGS =================
  async getExamAttempts(): Promise<ExamAttempt[]> {
    const { data, error } = await supabase
      .from("exam_attempts")
      .select("*, exams(*), students(*, classes(*))")
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as ExamAttempt[];
  },

  async getExamResults(): Promise<ExamResultRecord[]> {
    const { data, error } = await supabase
      .from("exam_results")
      .select("*, students(*, classes(*)), exams(*, classes(*)), exam_attempts(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as ExamResultRecord[];
  },

  async getAnswersForAttempt(attemptId: string): Promise<StudentAnswerRecord[]> {
    const { data, error } = await supabase
      .from("student_answers")
      .select("*")
      .eq("attempt_id", attemptId);
    if (error) throw new Error(error.message);
    return (data || []) as StudentAnswerRecord[];
  },

  async getAllAnswersForAnalysis(examId?: string): Promise<any[]> {
    let query = supabase
      .from("student_answers")
      .select("*, exam_attempts!inner(exam_id, student_id, score), question_bank(id, question_text, question_type, difficulty, score)");
    if (examId) {
      query = query.eq("exam_attempts.exam_id", examId);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async publishResultToStudent(resultId: string, publish: boolean) {
    const { error } = await supabase
      .from("exam_results")
      .update({ is_published_to_student: publish })
      .eq("id", resultId);
    if (error) throw new Error(error.message);
  },

  async getActivityLogs(limit = 30): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as ActivityLog[];
  },
};
