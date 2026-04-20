import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Check, Copy, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { testSupabase } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

type Step = "signup" | "pay" | "waiting" | "approved";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  essencial: { mensal: 1, semestral: 254.9, anual: 449.9 },
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
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pix, setPix] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedConfirm = emailConfirm.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@gmail.com")) {
      toast({ title: "Email inválido", description: "Use um email com final @gmail.com", variant: "destructive" });
      return;
    }
    if (normalizedEmail !== normalizedConfirm) {
      toast({ title: "Emails não conferem", description: "Os dois campos de email devem ser iguais.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Garante que não existe sessão antiga
      await testSupabase.auth.signOut().catch(() => {});

      const { data, error } = await testSupabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/checkout` },
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("Usuário não criado");

      await testSupabase.from("profiles" as any).upsert({
        id: uid,
        email: normalizedEmail,
        plano: "pending",
        status: "pending",
        trial: false,
        trial_start: null,
        trial_end: null,
      });

      setEmail(normalizedEmail);
      setUserId(uid);
      setStep("pay");
      toast({ title: "Cadastro criado", description: "Agora finalize o pagamento." });
    } catch (err: any) {
      toast({ title: "Erro no cadastro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePix = async () => {
    if (!userId || loading) return;
    setLoading(true);
    toast({ title: "Aguarde, gerando pagamento..." });
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          userId,
          email,
          plano,
          ciclo,
          valor,
        },
      });

      if (error) {
        const msg =
          (typeof error.message === "string" && error.message) ||
          "Erro ao gerar PIX, tente novamente";
        throw new Error(msg);
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
      toast({ title: "Erro ao gerar PIX", description, variant: "destructive" });
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
        toast({ title: "Pagamento concluído com sucesso!", description: "Liberando seu acesso..." });
        setTimeout(() => navigate("/admin"), 2000);
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
              <Label htmlFor="email">Email (somente @gmail.com)</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emailConfirm">Confirme seu email</Label>
              <Input
                id="emailConfirm"
                type="email"
                required
                placeholder="seuemail@gmail.com"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta e continuar"}
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
            <h2 className="font-display font-bold text-xl text-heading">Pagamento concluído com sucesso!</h2>
            <p className="text-body-muted text-sm">Liberando seu plano e redirecionando para o painel...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
