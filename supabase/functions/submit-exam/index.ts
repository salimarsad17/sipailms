import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

function evaluateQuestion(qb: any, maxScore: number, studentAns: any, complexRule: string) {
  const type = qb.question_type;
  const key = qb.correct_answer || {};

  if (!studentAns || (typeof studentAns === "object" && Object.keys(studentAns).length === 0)) {
    return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
  }

  if (type === "pilihan_ganda" || type === "benar_salah") {
    const chosen = String(studentAns.value ?? "").trim().toUpperCase();
    const expected = String(key.value ?? "").trim().toUpperCase();
    if (!chosen) return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
    const ok = chosen === expected;
    return { answered: true, isCorrect: ok, scoreObtained: ok ? maxScore : 0, needsManual: false };
  }

  if (type === "pilihan_ganda_kompleks") {
    const chosenArr: string[] = Array.isArray(studentAns.values) ? studentAns.values.map(String) : [];
    const expectedArr: string[] = Array.isArray(key.values) ? key.values.map(String) : [];
    if (chosenArr.length === 0) {
      return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
    }
    const chosenSet = new Set(chosenArr.map((v) => v.toUpperCase()));
    const expectedSet = new Set(expectedArr.map((v) => v.toUpperCase()));
    const exactMatch =
      chosenSet.size === expectedSet.size && [...expectedSet].every((x) => chosenSet.has(x));

    if (complexRule === "proporsional" && expectedSet.size > 0) {
      let correctSelected = 0;
      let wrongSelected = 0;
      chosenSet.forEach((c) => {
        if (expectedSet.has(c)) correctSelected++;
        else wrongSelected++;
      });
      const ratio = Math.max(0, (correctSelected - wrongSelected) / expectedSet.size);
      return {
        answered: true,
        isCorrect: exactMatch,
        scoreObtained: Number((maxScore * ratio).toFixed(2)),
        needsManual: false,
      };
    }

    return {
      answered: true,
      isCorrect: exactMatch,
      scoreObtained: exactMatch ? maxScore : 0,
      needsManual: false,
    };
  }

  if (type === "menjodohkan") {
    const pairs = studentAns.pairs && typeof studentAns.pairs === "object" ? studentAns.pairs : {};
    const expectedPairs = key.pairs && typeof key.pairs === "object" ? key.pairs : {};
    const keys = Object.keys(expectedPairs);
    if (Object.keys(pairs).length === 0) {
      return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
    }
    if (keys.length === 0) {
      return { answered: true, isCorrect: false, scoreObtained: 0, needsManual: false };
    }
    let matched = 0;
    for (const k of keys) {
      if (String(pairs[k] ?? "").trim() === String(expectedPairs[k] ?? "").trim()) {
        matched++;
      }
    }
    const allOk = matched === keys.length;
    const score = Number(((matched / keys.length) * maxScore).toFixed(2));
    return { answered: true, isCorrect: allOk, scoreObtained: score, needsManual: false };
  }

  if (type === "isian_singkat") {
    const text = String(studentAns.text ?? "").trim();
    if (!text) return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
    const accepted: string[] = Array.isArray(key.accepted)
      ? key.accepted.map((s: any) => String(s).trim().toLowerCase())
      : key.value
      ? [String(key.value).trim().toLowerCase()]
      : [];
    if (accepted.length === 0) {
      return { answered: true, isCorrect: null, scoreObtained: 0, needsManual: true };
    }
    const ok = accepted.includes(text.toLowerCase());
    return { answered: true, isCorrect: ok, scoreObtained: ok ? maxScore : 0, needsManual: false };
  }

  // Esai -> koreksi manual guru
  const essayText = String(studentAns.text ?? "").trim();
  if (!essayText) return { answered: false, isCorrect: false, scoreObtained: 0, needsManual: false };
  return { answered: true, isCorrect: null, scoreObtained: 0, needsManual: true };
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

    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Sesi tidak valid" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { attemptId, bulkAnswers } = await req.json();
    if (!attemptId) {
      return new Response(JSON.stringify({ error: "attemptId wajib diisi" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: attempt } = await adminClient
      .from("exam_attempts")
      .select("*, exams(*), students!inner(*)")
      .eq("id", attemptId)
      .single();

    if (!attempt || attempt.students?.user_id !== userData.user.id) {
      return new Response(JSON.stringify({ error: "Akses ditolak" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (attempt.status !== "in_progress") {
      const { data: existingRes } = await adminClient
        .from("exam_results")
        .select("*")
        .eq("attempt_id", attemptId)
        .single();
      return new Response(JSON.stringify({ alreadySubmitted: true, result: existingRes }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sinkronkan jawaban offline yang tersisa sebelum koreksi
    if (Array.isArray(bulkAnswers) && bulkAnswers.length > 0) {
      const rows = bulkAnswers.map((b: any) => ({
        attempt_id: attemptId,
        question_id: b.questionId,
        answer: b.answer ?? {},
        is_flagged: Boolean(b.isFlagged),
        saved_at: b.savedAt || new Date().toISOString(),
      }));
      await adminClient.from("student_answers").upsert(rows, { onConflict: "attempt_id,question_id" });
    }

    const { data: eqRows } = await adminClient
      .from("exam_questions")
      .select("question_id, score, question_bank(*)")
      .eq("exam_id", attempt.exam_id);

    const { data: studentAnsRows } = await adminClient
      .from("student_answers")
      .select("*")
      .eq("attempt_id", attemptId);

    const ansByQid = new Map<string, any>(
      (studentAnsRows || []).map((a: any) => [a.question_id, a])
    );
    const settings = attempt.exams?.settings || {};
    const complexRule = String(settings.complex_scoring_rule || "semua_benar");
    const kktp = Number(settings.kktp || 75);
    const showImmediately = settings.show_result_mode !== "after_teacher_review";

    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnanswered = 0;
    let earnedPoints = 0;
    let maxPoints = 0;
    let hasPendingManual = false;

    for (const eq of eqRows || []) {
      const qb = eq.question_bank;
      const qScore = Number(eq.score || qb?.score || 10);
      maxPoints += qScore;
      const existingAns = ansByQid.get(eq.question_id);
      const evalRes = evaluateQuestion(qb, qScore, existingAns?.answer, complexRule);

      if (!evalRes.answered) {
        totalUnanswered++;
      } else if (evalRes.needsManual) {
        hasPendingManual = true;
      } else if (evalRes.isCorrect) {
        totalCorrect++;
      } else {
        totalWrong++;
      }

      earnedPoints += evalRes.scoreObtained;

      if (existingAns) {
        await adminClient
          .from("student_answers")
          .update({
            is_correct: evalRes.isCorrect,
            score_obtained: evalRes.scoreObtained,
          })
          .eq("id", existingAns.id);
      }
    }

    const finalScore = maxPoints > 0 ? Number(((earnedPoints / maxPoints) * 100).toFixed(2)) : 0;
    const completionStatus = hasPendingManual
      ? "Menunggu Koreksi"
      : finalScore >= kktp
      ? "Tuntas"
      : "Belum Tuntas";

    const attemptStatus = hasPendingManual ? "submitted" : "graded";
    const nowIso = new Date().toISOString();

    await adminClient
      .from("exam_attempts")
      .update({
        submitted_at: nowIso,
        score: finalScore,
        status: attemptStatus,
      })
      .eq("id", attemptId);

    const { data: savedResult } = await adminClient
      .from("exam_results")
      .upsert(
        {
          attempt_id: attemptId,
          student_id: attempt.student_id,
          exam_id: attempt.exam_id,
          total_correct: totalCorrect,
          total_wrong: totalWrong,
          total_unanswered: totalUnanswered,
          earned_points: earnedPoints,
          max_points: maxPoints,
          final_score: finalScore,
          kktp,
          completion_status: completionStatus,
          is_published_to_student: showImmediately && !hasPendingManual,
        },
        { onConflict: "attempt_id" }
      )
      .select("*")
      .single();

    await adminClient.from("activity_logs").insert({
      user_id: userData.user.id,
      student_id: attempt.student_id,
      action: "SUBMIT_EXAM",
      detail: `Menyelesaikan ujian: ${attempt.exams?.title || attempt.exam_id}`,
    });

    return new Response(
      JSON.stringify({
        submitted: true,
        showResultToStudent: showImmediately && !hasPendingManual,
        hasPendingManual,
        result: showImmediately && !hasPendingManual ? savedResult : null,
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
