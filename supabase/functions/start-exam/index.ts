import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Sesi pengguna tidak valid" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { examId, accessCode } = await req.json();
    if (!examId) {
      return new Response(JSON.stringify({ error: "examId wajib diisi" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: student, error: stErr } = await adminClient
      .from("students")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (stErr || !student) {
      return new Response(JSON.stringify({ error: "Data siswa tidak ditemukan untuk akun ini" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: exam, error: exErr } = await adminClient
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    if (exErr || !exam) {
      return new Response(JSON.stringify({ error: "Ujian tidak ditemukan" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (exam.status === "draft" || exam.status === "closed") {
      return new Response(JSON.stringify({ error: "Ujian tidak sedang dibuka" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (exam.class_id && student.class_id && exam.class_id !== student.class_id) {
      return new Response(JSON.stringify({ error: "Ujian ini bukan untuk kelas Anda" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const startMs = new Date(exam.start_time).getTime();
    const endMs = new Date(exam.end_time).getTime();
    if (now < startMs || now > endMs) {
      return new Response(JSON.stringify({ error: "Di luar jadwal pelaksanaan ujian" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cek attempt yang sedang berjalan terlebih dahulu (resume saat reload/putus koneksi)
    const { data: existingAttempts } = await adminClient
      .from("exam_attempts")
      .select("*")
      .eq("exam_id", examId)
      .eq("student_id", student.id)
      .order("attempt_number", { ascending: false });

    const inProgressAttempt = (existingAttempts || []).find((a) => a.status === "in_progress");
    const settings = exam.settings || {};
    const maxAttempts = Number(settings.max_attempts || 1);

    let activeAttempt = inProgressAttempt;

    if (!activeAttempt) {
      if ((existingAttempts || []).length >= maxAttempts) {
        return new Response(
          JSON.stringify({ error: `Batas percobaan (${maxAttempts}x) telah habis` }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (exam.access_code && String(accessCode || "").trim() !== String(exam.access_code).trim()) {
        return new Response(JSON.stringify({ error: "Kode akses ujian tidak sesuai" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: examQuestions, error: eqErr } = await adminClient
        .from("exam_questions")
        .select("question_id, question_order, score, question_bank(id, question_type, options)")
        .eq("exam_id", examId)
        .order("question_order", { ascending: true });

      if (eqErr || !examQuestions || examQuestions.length === 0) {
        return new Response(JSON.stringify({ error: "Ujian belum memiliki soal" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let qOrder = examQuestions.map((eq) => eq.question_id);
      if (settings.shuffle_questions) {
        qOrder = shuffleArray(qOrder);
      }

      const optionOrder: Record<string, string[]> = {};
      if (settings.shuffle_options) {
        for (const eq of examQuestions) {
          const qb: any = eq.question_bank;
          if (
            qb &&
            Array.isArray(qb.options) &&
            (qb.question_type === "pilihan_ganda" || qb.question_type === "pilihan_ganda_kompleks")
          ) {
            optionOrder[qb.id] = shuffleArray(qb.options.map((o: any) => String(o.key || o.id)));
          }
        }
      }

      const nextAttemptNo = (existingAttempts || []).length + 1;
      const { data: createdAttempt, error: createErr } = await adminClient
        .from("exam_attempts")
        .insert({
          exam_id: examId,
          student_id: student.id,
          attempt_number: nextAttemptNo,
          status: "in_progress",
          question_order: qOrder,
          option_order: optionOrder,
        })
        .select("*")
        .single();

      if (createErr || !createdAttempt) {
        return new Response(JSON.stringify({ error: "Gagal memulai sesi ujian" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      activeAttempt = createdAttempt;

      await adminClient.from("activity_logs").insert({
        user_id: userData.user.id,
        student_id: student.id,
        action: "START_EXAM",
        detail: `Memulai ujian: ${exam.title} (Percobaan #${nextAttemptNo})`,
      });
    }

    // Ambil soal HANYA kolom aman (TANPA correct_answer & TANPA explanation)
    const { data: eqRows } = await adminClient
      .from("exam_questions")
      .select(
        "question_id, question_order, score, question_bank(id, grade_level, semester, chapter_title, sub_material, question_type, question_text, question_image, illustration_url, table_data, quran_arabic, quran_translation, audio_url, video_url, options, difficulty)"
      )
      .eq("exam_id", examId);

    const savedOrder: string[] = Array.isArray(activeAttempt.question_order)
      ? activeAttempt.question_order
      : [];
    const byId = new Map((eqRows || []).map((r: any) => [r.question_id, r]));
    const orderedRows =
      savedOrder.length > 0
        ? savedOrder.map((qid) => byId.get(qid)).filter(Boolean)
        : (eqRows || []).sort((a: any, b: any) => a.question_order - b.question_order);

    const optOrderMap = activeAttempt.option_order || {};
    const sanitizedQuestions = orderedRows.map((row: any, idx: number) => {
      const qb = row.question_bank;
      let options = Array.isArray(qb.options) ? [...qb.options] : [];
      if (Array.isArray(optOrderMap[qb.id])) {
        const orderKeys: string[] = optOrderMap[qb.id];
        options.sort((a: any, b: any) => orderKeys.indexOf(a.key) - orderKeys.indexOf(b.key));
      }
      // Untuk menjodohkan, acak sisi kanan tanpa membocorkan pasangan tepat
      if (qb.question_type === "menjodohkan" && Array.isArray(qb.options)) {
        const rightItems = shuffleArray(qb.options.map((p: any) => p.right));
        options = qb.options.map((p: any, i: number) => ({
          id: p.id,
          left: p.left,
          rightPool: rightItems,
        }));
      }

      return {
        id: qb.id,
        order: idx + 1,
        score: Number(row.score || 10),
        question_type: qb.question_type,
        question_text: qb.question_text,
        question_image: qb.question_image,
        illustration_url: qb.illustration_url,
        table_data: qb.table_data,
        quran_arabic: qb.quran_arabic,
        quran_translation: qb.quran_translation,
        audio_url: qb.audio_url,
        video_url: qb.video_url,
        options,
        difficulty: qb.difficulty,
      };
    });

    const { data: savedAnswers } = await adminClient
      .from("student_answers")
      .select("question_id, answer, is_flagged, saved_at")
      .eq("attempt_id", activeAttempt.id);

    return new Response(
      JSON.stringify({
        attempt: activeAttempt,
        exam: {
          id: exam.id,
          title: exam.title,
          exam_type: exam.exam_type,
          duration: exam.duration,
          start_time: exam.start_time,
          end_time: exam.end_time,
          settings: exam.settings,
        },
        questions: sanitizedQuestions,
        savedAnswers: savedAnswers || [],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
