const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const testUrl = Deno.env.get("TEST_SUPABASE_URL");
    const testKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY");
    if (!accessToken || !testUrl || !testKey) throw new Error("Secrets missing");

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
      try {
        const ref = JSON.parse(payment.external_reference || "{}");
        userId = ref.userId;
        plano = ref.plano;
      } catch {
        userId = payment?.metadata?.user_id;
        plano = payment?.metadata?.plano;
      }

      if (userId && plano) {
        const admin = createClient(testUrl, testKey);
        const { error } = await admin
          .from("profiles")
          .update({ plano, status: "active", trial: false })
          .eq("id", userId);
        if (error) console.error("Profile update error:", error);
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
