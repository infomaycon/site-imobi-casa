const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PLAN_VALUES: Record<string, number> = {
  essencial: 2,
  profissional: 2,
  elite: 2,
};

function computeExpiresAt(ciclo: string): string {
  const now = new Date();
  const days = ciclo === "anual" ? 365 : ciclo === "semestral" ? 180 : 30;
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

async function persistExternalProfile(params: {
  testUrl: string;
  testKey: string;
  userId: string;
  email?: string;
  plano: string;
  ciclo: string;
}) {
  const { testUrl, testKey, userId, email, plano, ciclo } = params;
  const admin = createClient(testUrl, testKey);
  const basePayload: Record<string, unknown> = {
    id: userId,
    email: email ?? null,
    plano,
    status: "active",
    trial: false,
  };
  const expires_at = computeExpiresAt(ciclo);

  const { error } = await admin
    .from("profiles")
    .upsert({ ...basePayload, ciclo, expires_at }, { onConflict: "id" });

  if (!error) return;

  console.warn("[check-pix] retrying without ciclo/expires_at:", error.message);

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
    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const testUrl = Deno.env.get("TEST_SUPABASE_URL");
    const testKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY");
    // Internal Lovable Cloud (where /admin authenticates)
    const internalUrl = Deno.env.get("SUPABASE_URL");
    const internalServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!accessToken || !testUrl || !testKey || !internalUrl || !internalServiceKey) {
      throw new Error("Secrets not configured");
    }

    const { paymentId, userId, plano, ciclo, email, password } = await req.json();
    const cicloFinal = (ciclo as string | undefined)?.toLowerCase() || "mensal";
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "paymentId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await mpRes.json();
    if (!mpRes.ok) {
      return new Response(JSON.stringify({ error: "MP error", details: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (data.status === "approved") {
      // 1) Update external test profile (legacy)
      if (userId && plano) {
        await persistExternalProfile({
          testUrl,
          testKey,
          userId,
          email,
          plano,
          ciclo: cicloFinal,
        });
      }

      // 2) Provision user in INTERNAL Lovable Cloud + subscribers row
      if (email && password) {
        const internalAdmin = createClient(internalUrl, internalServiceKey);
        const planValue = PLAN_VALUES[plano] ?? 0;

        // Create or fetch user in internal auth (auto-confirmed)
        const { data: created, error: createErr } =
          await internalAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });

        // If user already exists, update their password so login works
        if (createErr && /already/i.test(createErr.message)) {
          const { data: list } = await internalAdmin.auth.admin.listUsers();
          const existing = list.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
          );
          if (existing) {
            await internalAdmin.auth.admin.updateUserById(existing.id, {
              password,
              email_confirm: true,
            });
          }
        }

        // Upsert subscriber so /admin grants access
        await internalAdmin
          .from("subscribers")
          .upsert(
            {
              email,
              name: email.split("@")[0],
              plan: plano ?? "essencial",
              plan_value: planValue,
              status: "active",
            },
            { onConflict: "email" },
          );
      }
    }

    return new Response(JSON.stringify({ status: data.status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
