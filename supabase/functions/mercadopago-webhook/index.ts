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

async function persistProfile(admin: ReturnType<typeof createClient>, params: {
  userId: string;
  email?: string;
  plano: string;
  ciclo: string;
}) {
  const { userId, email, plano, ciclo } = params;
  const cleanEmail = email?.trim().toLowerCase() || null;
  const basePayload: Record<string, unknown> = {
    id: userId,
    email: cleanEmail,
    nome: cleanEmail?.split("@")[0] ?? null,
    plano,
    status: "active",
    trial: false,
  };

  const { error } = await admin
    .from("profiles")
    .upsert({ ...basePayload, ciclo, expires_at: computeExpiresAt(ciclo) }, { onConflict: "id" });

  if (!error) return;

  console.warn("[mp-webhook] retrying without ciclo/expires_at:", error.message);

  const { error: fallbackError } = await admin
    .from("profiles")
    .upsert(basePayload, { onConflict: "id" });

  if (fallbackError) {
    throw new Error(`Profile sync failed: ${fallbackError.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const testUrl = Deno.env.get("TEST_SUPABASE_URL");
    const testKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY");
    const internalUrl = Deno.env.get("SUPABASE_URL");
    const internalServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!accessToken || !testUrl || !testKey || !internalUrl || !internalServiceKey) throw new Error("Secrets missing");

    const body = await req.json().catch(() => ({}));
    console.log("MP webhook:", JSON.stringify(body));

    const paymentId =
      body?.data?.id ||
      body?.resource?.toString().split("/").pop() ||
      new URL(req.url).searchParams.get("id");

    if (!paymentId) {
      return new Response(JSON.stringify({ ok: true, skipped: "no id" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payment = await mpRes.json();
    console.log("MP payment:", payment.status, payment.external_reference);

    if (payment.status === "approved") {
      let userId: string | undefined;
      let plano: string | undefined;
      let ciclo = "mensal";
      try {
        const ref = JSON.parse(payment.external_reference || "{}");
        userId = ref.userId;
        plano = ref.plano;
      } catch {
        const [refUserId, refPlano, refCiclo] = String(payment.external_reference || "").split("|");
        userId = payment?.metadata?.user_id || refUserId;
        plano = payment?.metadata?.plano || refPlano;
        ciclo = payment?.metadata?.ciclo || refCiclo || "mensal";
      }

      if (userId && plano) {
        await persistExternalProfile({
          testUrl,
          testKey,
          userId,
          email: payment?.payer?.email,
          plano,
          ciclo,
        });
      }

      const email = (payment?.metadata?.email || payment?.payer?.email)?.trim()?.toLowerCase();
      if (email && plano) {
        const internalAdmin = createClient(internalUrl, internalServiceKey);
        await internalAdmin.from("subscribers").upsert(
          {
            email,
            name: email.split("@")[0],
            plan: plano,
            plan_value: PLAN_VALUES[plano] ?? 1,
            status: "active",
            trial: false,
            trial_end: null,
          },
          { onConflict: "email" },
        );
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("Webhook error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 200, // sempre 200 para MP não reenviar infinito
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
