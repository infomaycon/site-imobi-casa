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
    if (!accessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN not configured");

    const body = (await req.json()) as PixRequest;
    if (!body.userId || !body.email || !body.plano || !body.valor) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const idempotencyKey = `${body.userId}-${Date.now()}`;
    const payload = {
      transaction_amount: Number(body.valor),
      description: `ImobiCasa - Plano ${body.plano} (${body.ciclo})`,
      payment_method_id: "pix",
      payer: { email: body.email },
      external_reference: JSON.stringify({
        userId: body.userId,
        plano: body.plano,
        ciclo: body.ciclo,
      }),
      metadata: {
        user_id: body.userId,
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
