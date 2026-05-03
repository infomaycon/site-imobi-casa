import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Check, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = "signup" | "waiting" | "approved";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  essencial: { mensal: 1, semestral: 1, anual: 1 },
  profissional: { mensal: 1, semestral: 1, anual: 1 },
  elite: { mensal: 1, semestral: 1, anual: 1 },
};

const PLAN_LABEL: Record<string, string> = {
  essencial: "Essencial",
  profissional: "Profissional",
  elite: "Elite",
};

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const plano = (params.get("plano") || "profissional").toLowerCase();
  const ciclo = (params.get("ciclo") || "mensal").toLowerCase();
  const valor = PLAN_PRICES[plano]?.[ciclo] ?? 1;
  const isUpgrade = params.get("upgrade") === "1";

  const [step, setStep] = useState<Step>("signup");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    const strictEmail = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!strictEmail.test(normalizedEmail)) {
      toast({
        title: "Email inválido",
        description: "Use um email válido, sem ponto antes do @ e com domínio completo.",
        variant: "destructive",
      });
      return;
    }

    if (!plano || !ciclo || !Number.isFinite(valor) || valor <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Erro ao identificar plano selecionado. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("[checkout] Salvando perfil pending para:", normalizedEmail);
      const externalRes = await fetch("https://conuhvxiiwdsppowwrib.supabase.co/functions/v1/create-or-update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (!externalRes.ok) {
        const errBody = await externalRes.json().catch(() => ({}));
        console.error("[checkout] Erro ao salvar perfil pending, continuando para o PIX:", errBody);
      }
      setEmail(normalizedEmail);

      console.log("[checkout] Perfil salvo. Gerando PIX sem autenticação.");
      const payload = {
        email: normalizedEmail,
        valor: Number(valor),
        plano,
        ciclo,
      };
      console.log("PIX DATA:", { plano, ciclo, valor: Number(valor) });
      console.log("[checkout] create-pix payload:", payload);
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: payload,
      });

      // Lê mensagem de erro real do backend, mesmo quando vem como non-2xx
      if (error || data?.error) {
        const apiMsg =
          data?.details ||
          data?.error ||
          (typeof error?.message === "string" && error.message) ||
          "Erro ao gerar PIX, tente novamente";
        throw new Error(apiMsg);
      }

      if (!data?.qrCode || !data?.qrCodeBase64) {
        throw new Error("Resposta inválida do servidor de pagamento");
      }

      setPix({
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        paymentId: String(data.paymentId ?? ""),
      });
      setStep("waiting");
      toast({ title: "PIX gerado com sucesso!", description: "Escaneie o QR Code ou copie o código." });
    } catch (err: any) {
      const description =
        err?.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor de pagamento. Tente novamente."
          : err?.message || "Erro ao gerar PIX, tente novamente";
      toast({ title: "Erro ao continuar", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (silent = false) => {
    if (!pix) return;
    if (!silent) setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("check-pix-payment", {
        body: { paymentId: pix.paymentId, plano, ciclo, email },
      });
      if (data?.status === "approved") {
        setStep("approved");
        toast({ title: "Pagamento concluído com sucesso!", description: "Seu acesso será liberado em seguida." });
        setTimeout(() => navigate("/login"), 1500);
      } else if (!silent) {
        toast({ title: "Aguardando pagamento", description: `Status: ${data?.status}` });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };
  // polling automático
  useEffect(() => {
    if (step !== "waiting") return;
    const id = setInterval(() => checkStatus(true), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, pix]);

  const copyPix = () => {
    if (!pix?.qrCode) return;
    navigator.clipboard.writeText(pix.qrCode);
    toast({ title: "Código PIX copiado" });
  };

  return (
    <div className="min-h-screen bg-surface-light-alt py-12 px-4">
      <div className="max-w-xl mx-auto mb-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs text-body-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao site
        </button>
      </div>
      <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl shadow-soft p-8">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-2xl text-heading">Finalizar assinatura</h1>
          <p className="text-body-muted text-sm mt-1">
            Plano <span className="font-semibold text-primary">{PLAN_LABEL[plano] ?? plano}</span> ·{" "}
            {ciclo} · <span className="font-semibold">R$ {valor.toFixed(2).replace(".", ",")}</span>
          </p>
        </div>

        {/* steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["signup", "waiting"].map((s, i) => {
            const done =
              (s === "signup" && step !== "signup") ||
              (s === "waiting" && step === "approved");
            const active = s === step;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < 1 && <div className="w-8 h-px bg-border" />}
              </div>
            );
          })}
        </div>

        {step === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerar PIX"}
            </Button>
          </form>
        )}

        {step === "waiting" && pix && (
          <div className="space-y-4 text-center">
            {pix.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${pix.qrCodeBase64}`}
                alt="QR Code PIX"
                className="mx-auto w-64 h-64 border border-border rounded-lg"
              />
            )}
            <div className="bg-muted rounded-lg p-3 text-xs font-mono break-all text-left max-h-32 overflow-auto">
              {pix.qrCode}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyPix} className="flex-1">
                <Copy className="w-4 h-4 mr-2" /> Copiar código
              </Button>
              <Button onClick={() => checkStatus(false)} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Já paguei"}
              </Button>
            </div>
            <p className="text-sm text-body-muted flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Aguardando pagamento...
            </p>
          </div>
        )}

        {step === "approved" && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl text-heading">Pagamento concluído com sucesso!</h2>
            <p className="text-body-muted text-sm">Liberando seu plano e redirecionando para o painel...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
