import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (!profile || !["guru", "admin"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Hanya Guru yang dapat mengoreksi soal esai" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { attemptId, grades, teacherFeedback, publishResult = true } = await req.json();
    if (!attemptId || !Array.isArray(grades)) {
      return new Response(JSON.stringify({ error: "attemptId dan grades wajib diisi" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const item of grades) {
      await adminClient
        .from("student_answers")
        .update({
          score_obtained: Number(item.scoreObtained || 0),
          is_correct: Number(item.scoreObtained || 0) > 0,
        })
        .eq("attempt_id", attemptId)
        .eq("question_id", item.questionId);
    }

    const { data: attempt } = await adminClient
      .from("exam_attempts")
      .select("*, exams(*)")
      .eq("id", attemptId)
      .single();

    const { data: eqRows } = await adminClient
      .from("exam_questions")
      .select("question_id, score")
      .eq("exam_id", attempt.exam_id);

    const { data: answers } = await adminClient
      .from("student_answers")
      .select("*")
      .eq("attempt_id", attemptId);

    const maxPoints = (eqRows || []).reduce((sum, eq) => sum + Number(eq.score || 0), 0);
    const earnedPoints = (answers || []).reduce((sum, a) => sum + Number(a.score_obtained || 0), 0);
    const totalCorrect = (answers || []).filter((a) => a.is_correct === true).length;
    const totalWrong = (answers || []).filter((a) => a.is_correct === false).length;
    const totalUnanswered = Math.max(0, (eqRows || []).length - (answers || []).length);
    const finalScore = maxPoints > 0 ? Number(((earnedPoints / maxPoints) * 100).toFixed(2)) : 0;
    const kktp = Number(attempt.exams?.settings?.kktp || 75);
    const completionStatus = finalScore >= kktp ? "Tuntas" : "Belum Tuntas";

    await adminClient
      .from("exam_attempts")
      .update({ score: finalScore, status: "graded" })
      .eq("id", attemptId);

    const { data: updatedResult } = await adminClient
      .from("exam_results")
      .update({
        total_correct: totalCorrect,
        total_wrong: totalWrong,
        total_unanswered: totalUnanswered,
        earned_points: earnedPoints,
        max_points: maxPoints,
        final_score: finalScore,
        completion_status: completionStatus,
        teacher_feedback: teacherFeedback ?? null,
        is_published_to_student: Boolean(publishResult),
      })
      .eq("attempt_id", attemptId)
      .select("*")
      .single();

    return new Response(JSON.stringify({ updated: true, result: updatedResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
