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
      return new Response(JSON.stringify({ error: "Sesi tidak valid" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { attemptId, questionId, answer, isFlagged, flaggedQuestions } = await req.json();
    if (!attemptId || !questionId) {
      return new Response(JSON.stringify({ error: "attemptId dan questionId wajib diisi" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: attempt } = await adminClient
      .from("exam_attempts")
      .select("*, students!inner(user_id)")
      .eq("id", attemptId)
      .single();

    if (!attempt || attempt.students?.user_id !== userData.user.id) {
      return new Response(JSON.stringify({ error: "Akses ditolak" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (attempt.status !== "in_progress") {
      return new Response(JSON.stringify({ error: "Ujian sudah diselesaikan" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = new Date().toISOString();
    const { error: upsertErr } = await adminClient
      .from("student_answers")
      .upsert(
        {
          attempt_id: attemptId,
          question_id: questionId,
          answer: answer ?? {},
          is_flagged: Boolean(isFlagged),
          saved_at: nowIso,
        },
        { onConflict: "attempt_id,question_id" }
      );

    if (upsertErr) {
      return new Response(JSON.stringify({ error: upsertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (Array.isArray(flaggedQuestions)) {
      await adminClient
        .from("exam_attempts")
        .update({ flagged_questions: flaggedQuestions })
        .eq("id", attemptId);
    }

    return new Response(JSON.stringify({ saved: true, saved_at: nowIso }), {
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
