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

    const { data: caller } = await userClient.auth.getUser();
    if (!caller?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", caller.user.id)
      .single();

    if (!callerProfile || !["guru", "admin"].includes(callerProfile.role)) {
      return new Response(JSON.stringify({ error: "Akses khusus Guru / Admin" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const {
      action,
      email,
      password,
      fullName,
      username,
      role = "siswa",
      nis,
      nisn,
      participantNumber,
      classId,
      gender = "L",
    } = payload;

    if (action === "create_student_account") {
      if (!email || !password || !fullName || !nisn) {
        return new Response(JSON.stringify({ error: "Data akun siswa belum lengkap" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: createdUser, error: authErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: "siswa", username: username || nisn },
      });

      if (authErr || !createdUser.user) {
        return new Response(JSON.stringify({ error: authErr?.message || "Gagal membuat user auth" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: studentRow, error: stErr } = await adminClient
        .from("students")
        .upsert(
          {
            user_id: createdUser.user.id,
            nis: nis || nisn,
            nisn,
            participant_number: participantNumber || `CBT-${nisn}`,
            full_name: fullName,
            gender,
            class_id: classId || null,
            is_active: true,
          },
          { onConflict: "nisn" }
        )
        .select("*")
        .single();

      if (stErr) {
        return new Response(JSON.stringify({ error: stErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient.from("profiles").upsert({
        id: createdUser.user.id,
        full_name: fullName,
        username: username || nisn,
        role: "siswa",
        student_id: studentRow.id,
        class_id: classId || null,
      });

      return new Response(JSON.stringify({ created: true, student: studentRow }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Action tidak dikenali" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
