const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PixRequest {
  userId: string;
  email: string;
  plano: string;
  ciclo: string;
  valor: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!accessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN not configured");
    if (!supabaseUrl) throw new Error("SUPABASE_URL not configured");

    const body = (await req.json()) as PixRequest & { user_id?: string };
    const userId = body.userId || body.user_id;
    if (!userId || !body.email || !body.plano || !body.ciclo || !body.valor) {
      console.error("[create-pix] missing fields:", body);
      return new Response(JSON.stringify({ error: "Missing fields", received: body }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = String(body.email).trim().toLowerCase();
    const strictEmail = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!strictEmail.test(cleanEmail)) {
      console.error("[create-pix] invalid email:", body.email);
      return new Response(
        JSON.stringify({
          error: "Email inválido",
          details:
            "Use um email válido (sem ponto antes do @ e sem caracteres especiais).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("[create-pix] payload:", { userId, email: body.email, plano: body.plano, ciclo: body.ciclo, valor: body.valor });

    const idempotencyKey = `${userId}-${Date.now()}`;
    const payload = {
      transaction_amount: Number(body.valor),
      description: `ImobiCasa - Plano ${body.plano} (${body.ciclo})`,
      payment_method_id: "pix",
      notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      payer: { email: cleanEmail },
      external_reference: `${userId}|${body.plano}|${body.ciclo}`,
      metadata: {
        user_id: userId,
        email: cleanEmail,
        plano: body.plano,
        ciclo: body.ciclo,
      },
    };

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP error:", data);
      return new Response(JSON.stringify({ error: "Mercado Pago error", details: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tx = data?.point_of_interaction?.transaction_data;
    return new Response(
      JSON.stringify({
        paymentId: data.id,
        status: data.status,
        qrCode: tx?.qr_code,
        qrCodeBase64: tx?.qr_code_base64,
        ticketUrl: tx?.ticket_url,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
