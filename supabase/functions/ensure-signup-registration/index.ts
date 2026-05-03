import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const strictEmail = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) throw new Error("Backend não configurado");

    const admin = createClient(supabaseUrl, serviceKey);
    const body = await req.json().catch(() => ({}));
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    let user = null;

    if (token) {
      const { data: authData, error: authError } = await admin.auth.getUser(token);
      if (authError || !authData.user?.id || !authData.user.email) {
        return new Response(JSON.stringify({ error: "Usuário inválido" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      user = authData.user;
    } else {
      const requestedUserId = String(body.userId || body.user_id || "");
      const requestedEmail = String(body.email || "").trim().toLowerCase();
      if (!requestedUserId || !strictEmail.test(requestedEmail)) {
        return new Response(JSON.stringify({ error: "Dados de cadastro inválidos" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: userData, error: userError } = await admin.auth.admin.getUserById(requestedUserId);
      if (userError || !userData.user?.email || userData.user.email.toLowerCase() !== requestedEmail) {
        return new Response(JSON.stringify({ error: "Usuário não encontrado no Auth" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const createdAt = new Date(userData.user.created_at || 0).getTime();
      if (!createdAt || Date.now() - createdAt > 30 * 60 * 1000) {
        return new Response(JSON.stringify({ error: "Faça login para sincronizar este cadastro" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      user = userData.user;
    }

    if (!user?.id || !user.email) {
      return new Response(JSON.stringify({ error: "Usuário inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = user.email.toLowerCase();
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        email,
        nome: email.split("@")[0],
        plano: "gratuito",
        status: "ativo",
        ciclo: "mensal",
        trial: true,
        trial_end: trialEnd,
        first_login: true,
      },
      { onConflict: "id" },
    );
    if (profileError) throw profileError;

    const { error: perfilError } = await admin.from("perfis").upsert(
      {
        user_id: user.id,
        email,
        nome: email.split("@")[0],
        plano: "gratuito",
        status: "ativo",
        primeiro_login: true,
        ciclo: "mensal",
      },
      { onConflict: "user_id" },
    );
    if (perfilError) throw perfilError;

    const { error: subscriberError } = await admin.from("subscribers").upsert(
      {
        email,
        name: email.split("@")[0],
        plan: "trial",
        plan_value: 0,
        status: "active",
        trial: true,
        trial_end: trialEnd,
      },
      { onConflict: "email" },
    );
    if (subscriberError) throw subscriberError;

    const [{ data: profile }, { data: perfil }, { data: subscriber }] = await Promise.all([
      admin.from("profiles").select("id").eq("id", user.id).maybeSingle(),
      admin.from("perfis").select("id").eq("user_id", user.id).maybeSingle(),
      admin.from("subscribers").select("id").eq("email", email).maybeSingle(),
    ]);

    if (!profile?.id || !perfil?.id || !subscriber?.id) throw new Error("Cadastro não confirmado nas tabelas");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const details = e instanceof Error ? e.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: "Erro ao liberar acesso", details }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});