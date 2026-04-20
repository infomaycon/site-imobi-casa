import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Check, Copy, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { testSupabase } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

type Step = "signup" | "pay" | "waiting" | "approved";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  essencial: { mensal: 49.9, semestral: 254.9, anual: 449.9 },
  profissional: { mensal: 79.9, semestral: 379, anual: 699.9 },
  elite: { mensal: 129.9, semestral: 649.9, anual: 1099.9 },
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
  const valor = PLAN_PRICES[plano]?.[ciclo] ?? 79.9;

  const [step, setStep] = useState<Step>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pix, setPix] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);

  // já logado? pula para pagamento
  useEffect(() => {
    testSupabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setEmail(data.session.user.email || "");
        setStep("pay");
      }
    });
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await testSupabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/checkout` },
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("Usuário não criado");

      await testSupabase.from("profiles" as any).upsert({
        id: uid,
        email,
        plano: "pending",
        status: "pending",
        trial: false,
        trial_start: null,
        trial_end: null,
      });

      setUserId(uid);
      setStep("pay");
      toast({ title: "Cadastro criado", description: "Agora finalize o pagamento." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePix = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: { userId, email, plano, ciclo, valor },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPix({
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        paymentId: String(data.paymentId),
      });
      setStep("waiting");
    } catch (err: any) {
      toast({ title: "Erro ao gerar PIX", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (silent = false) => {
    if (!pix || !userId) return;
    if (!silent) setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("check-pix-payment", {
        body: { paymentId: pix.paymentId, userId, plano },
      });
      if (data?.status === "approved") {
        setStep("approved");
        toast({ title: "Pagamento aprovado!" });
        setTimeout(() => navigate("/admin"), 1500);
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
          {["signup", "pay", "waiting"].map((s, i) => {
            const done =
              (s === "signup" && step !== "signup") ||
              (s === "pay" && (step === "waiting" || step === "approved")) ||
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
                {i < 2 && <div className="w-8 h-px bg-border" />}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar cadastro"}
            </Button>
          </form>
        )}

        {step === "pay" && (
          <div className="text-center space-y-4">
            <p className="text-body">
              Cadastro concluído ✅<br />
              Agora gere seu PIX para liberar o acesso.
            </p>
            <Button onClick={handleCreatePix} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar com PIX
                </>
              )}
            </Button>
          </div>
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
            <h2 className="font-display font-bold text-xl text-heading">Pagamento aprovado!</h2>
            <p className="text-body-muted text-sm">Redirecionando para o painel...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
