const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PLAN_VALUES: Record<string, number> = {
  essencial: 1,
  profissional: 1,
  elite: 1,
};

async function syncInternalRegistration(admin: ReturnType<typeof createClient>, params: {
  userId: string;
  email: string;
  plano: string;
  ciclo: string;
}) {
  const profilePayload = {
    id: params.userId,
    email: params.email,
    nome: params.email.split("@")[0],
    plano: params.plano,
    status: "pending",
    ciclo: params.ciclo,
    trial: false,
    trial_end: null,
    first_login: true,
  };

  const { error: profileError } = await admin
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: perfilError } = await admin.from("perfis").upsert(
    {
      user_id: params.userId,
      email: params.email,
      nome: params.email.split("@")[0],
      plano: params.plano,
      status: "ativo",
      primeiro_login: true,
      ciclo: params.ciclo,
    },
    { onConflict: "user_id" },
  );
  if (perfilError) throw perfilError;

  const [{ data: profile }, { data: perfil }] = await Promise.all([
    admin.from("profiles").select("id").eq("id", params.userId).maybeSingle(),
    admin.from("perfis").select("id").eq("user_id", params.userId).maybeSingle(),
  ]);
  if (!profile?.id || !perfil?.id) throw new Error("Cadastro não confirmado nas tabelas");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const internalUrl = Deno.env.get("SUPABASE_URL");
    const internalServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!internalUrl || !internalServiceKey) throw new Error("Secrets not configured");

    const body = await req.json();
    const userId = String(body.userId || body.user_id || "");
    const email = String(body.email || "").trim().toLowerCase();
    const plano = String(body.plano || "essencial").toLowerCase();
    const ciclo = String(body.ciclo || "mensal").toLowerCase();
    const valor = Number(body.valor ?? PLAN_VALUES[plano] ?? 1);

    const strictEmail = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!userId || !strictEmail.test(email)) {
      return new Response(JSON.stringify({ error: "Dados de cadastro inválidos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const internalAdmin = createClient(internalUrl, internalServiceKey);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const authCheck = token
      ? await internalAdmin.auth.getUser(token)
      : await internalAdmin.auth.admin.getUserById(userId);

    if (authCheck.error || authCheck.data.user?.id !== userId || authCheck.data.user?.email?.toLowerCase() !== email) {
      return new Response(JSON.stringify({ error: "Cadastro não confere com o usuário logado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: subscriberError } = await internalAdmin
      .from("subscribers")
      .upsert(
        {
          email,
          name: email.split("@")[0],
          plan: plano,
          plan_value: Number.isFinite(valor) && valor > 0 ? valor : PLAN_VALUES[plano] ?? 1,
          status: "pending",
          trial: false,
          trial_end: null,
        },
        { onConflict: "email" },
      );

    if (subscriberError) throw subscriberError;
    await syncInternalRegistration(internalAdmin, { userId, email, plano, ciclo });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return new Response(JSON.stringify({ error: "Erro ao validar cadastro", details: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});