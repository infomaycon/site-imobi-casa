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

function computeExpiresAt(ciclo: string): string {
  const now = new Date();
  const days = ciclo === "anual" ? 365 : ciclo === "semestral" ? 180 : 30;
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

async function syncExternalProfile(params: {
  userId: string;
  email: string;
  plano: string;
  ciclo: string;
}) {
  const testUrl = Deno.env.get("TEST_SUPABASE_URL");
  const testKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY");
  if (!testUrl || !testKey) return;

  const admin = createClient(testUrl, testKey);
  const basePayload: Record<string, unknown> = {
    id: params.userId,
    email: params.email,
    plano: params.plano,
    status: "pending",
    trial: false,
  };

  const { error } = await admin
    .from("profiles")
    .upsert({ ...basePayload, ciclo: params.ciclo, expires_at: computeExpiresAt(params.ciclo) }, { onConflict: "id" });

  if (!error) return;

  const { error: fallbackError } = await admin
    .from("profiles")
    .upsert(basePayload, { onConflict: "id" });

  if (fallbackError) {
    throw new Error(`External profile sync failed: ${fallbackError.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const internalUrl = Deno.env.get("SUPABASE_URL");
    const internalServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!internalUrl || !internalServiceKey) throw new Error("Secrets not configured");

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Login obrigatório" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    const { data: authData, error: authError } = await internalAdmin.auth.getUser(token);
    if (authError || authData.user?.id !== userId || authData.user?.email?.toLowerCase() !== email) {
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
    await syncExternalProfile({ userId, email, plano, ciclo });

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