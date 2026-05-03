import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Check, Copy, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Step = "signup" | "pay" | "waiting" | "approved";

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
  const { user } = useAuth();
  const plano = (params.get("plano") || "profissional").toLowerCase();
  const ciclo = (params.get("ciclo") || "mensal").toLowerCase();
  const valor = PLAN_PRICES[plano]?.[ciclo] ?? 1;
  const isUpgrade = params.get("upgrade") === "1";

  // Só pula o cadastro se vier explicitamente do painel (upgrade=1)
  const [step, setStep] = useState<Step>(user && isUpgrade ? "pay" : "signup");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pix, setPix] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);

  // Só reaproveita sessão quando vier explicitamente do painel como upgrade.
  useEffect(() => {
    if (user?.email && isUpgrade) {
      setEmail(user.email);
      setUserId(user.id);
      setStep((s) => (s === "signup" ? "pay" : s));
    }
  }, [user, isUpgrade]);

  const createProfile = async (uid: string, normalizedEmail: string) => {
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: profileError } = await supabase.from("profiles" as any).upsert(
      {
        id: uid,
        email: normalizedEmail,
        nome: normalizedEmail.split("@")[0],
        plano,
        status: "pending",
        ciclo,
        trial: false,
        trial_end: trialEnd,
        first_login: true,
      },
      { onConflict: "id" },
    );
    if (profileError) {
      console.error("Erro ao criar profile:", profileError);
      throw profileError;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedConfirm = emailConfirm.trim().toLowerCase();

    // Regex estrita: bloqueia ponto antes do @, domínio inválido e caracteres incompatíveis com pagamento.
    const strictEmail = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!strictEmail.test(normalizedEmail)) {
      toast({
        title: "Email inválido",
        description: "Use um email válido, sem ponto antes do @ e com domínio completo.",
        variant: "destructive",
      });
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
      await supabase.auth.signOut().catch(() => {});

      // Cadastro no Lovable Cloud (Supabase principal — onde /admin autentica)
      console.log("Tentando criar usuário...");
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/checkout` },
      });
      console.log("Resposta do Auth:", data);
      if (error) {
        console.error("Erro ao criar usuário:", error);
        if (error.message?.toLowerCase().includes("already")) {
          toast({
            title: "Email já cadastrado",
            description: "Faça login para continuar a assinatura.",
            variant: "destructive",
          });
          setTimeout(() => navigate(`/login?redirect=/checkout?plano=${plano}&ciclo=${ciclo}`), 1500);
          return;
        }
        throw error;
      }
      const uid = data.user?.id;
      if (!uid) throw new Error("Usuário não criado");
      if (data.user?.identities && data.user.identities.length === 0) {
        toast({
          title: "Email já cadastrado",
          description: "Faça login para continuar a assinatura.",
          variant: "destructive",
        });
        setTimeout(() => navigate(`/login?redirect=/checkout?plano=${plano}&ciclo=${ciclo}&valor=${valor}`), 1500);
        return;
      }
      const accessToken = data.session?.access_token;
      if (accessToken) await createProfile(uid, normalizedEmail);

      // Registra no banco como assinante pendente e sincroniza a base de validação antes do PIX.
      const { data: syncData, error: syncError } = await supabase.functions.invoke("sync-checkout-registration", {
        ...(accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
        body: {
          userId: uid,
          email: normalizedEmail,
          plano,
          ciclo,
          valor: Number(valor),
        },
      });
      if (syncError || syncData?.error) {
        throw new Error(syncData?.details || syncData?.error || syncError?.message || "Erro ao validar cadastro no banco");
      }

      setEmail(normalizedEmail);
      setUserId(uid);
      setStep("pay");
      toast({ title: "Cadastro criado", description: "Agora finalize o pagamento para liberar o acesso." });
    } catch (err: any) {
      toast({ title: "Erro no cadastro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const planoValido = !!plano && plano.trim() !== "";
  const cicloValido = !!ciclo && ciclo.trim() !== "";
  const valorValido = Number.isFinite(valor) && valor > 0;
  const dadosCompletos = planoValido && cicloValido && valorValido && !!userId && !!email;

  const handleCreatePix = async () => {
    if (loading) return;
    // Cria/atualiza perfil no projeto externo ANTES de gerar o PIX
    if (!email || !email.trim()) {
      toast({ title: "Email obrigatório", description: "Não foi possível identificar o email.", variant: "destructive" });
      return;
    }
    const strictEmailCheck = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!strictEmailCheck.test(email.trim().toLowerCase())) {
      toast({ title: "Email inválido", description: "Use um email válido para continuar.", variant: "destructive" });
      return;
    }
    // Validação obrigatória ANTES de qualquer requisição
    if (!plano || !ciclo) {
      toast({
        title: "Erro ao identificar plano",
        description: "Volte e selecione novamente.",
        variant: "destructive",
      });
      return;
    }
    if (!email) {
      toast({
        title: "Erro ao identificar usuário",
        description: "Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    if (!dadosCompletos) {
      toast({
        title: "Dados incompletos",
        description: "Erro ao identificar plano selecionado. Tente novamente.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    toast({ title: "Aguarde, gerando pagamento..." });
    try {
      // Criar/atualizar perfil no projeto externo antes do PIX
      console.log("[checkout] Criando perfil externo para:", email);
      const externalRes = await fetch("https://conuhvxiiwdsppowwrib.supabase.co/functions/v1/create-or-update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!externalRes.ok) {
        const errBody = await externalRes.json().catch(() => ({}));
        console.error("[checkout] Erro ao criar perfil externo:", errBody);
        throw new Error(errBody?.error || "Erro ao registrar perfil antes do pagamento");
      }
      console.log("[checkout] Perfil externo criado/atualizado com sucesso");

      const payload = {
        email,
        user_id: userId,
        userId,
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
        body: { paymentId: pix.paymentId, userId, plano, ciclo, email, password },
      });
      if (data?.status === "approved") {
        setStep("approved");
        toast({ title: "Pagamento concluído com sucesso!", description: "Liberando seu acesso..." });

        // Já está logado (upgrade pelo painel) → vai direto pro admin
        if (user) {
          setTimeout(() => navigate("/admin"), 1200);
          return;
        }

        // Sign in on internal Lovable Cloud (where /admin authenticates)
        try {
          await supabase.auth.signOut().catch(() => {});
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInErr) {
            console.error("Internal sign-in failed:", signInErr);
            toast({
              title: "Acesso criado",
              description: "Faça login para acessar o painel.",
            });
            setTimeout(() => navigate("/login"), 1500);
            return;
          }
          setTimeout(() => navigate("/admin"), 1200);
        } catch (e) {
          console.error(e);
          setTimeout(() => navigate("/login"), 1500);
        }
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
            <Button onClick={handleCreatePix} disabled={loading || !dadosCompletos} className="w-full" size="lg">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar com PIX
                </>
              )}
            </Button>
            {!dadosCompletos && (
              <p className="text-xs text-destructive">
                Erro ao identificar plano selecionado. Tente novamente.
              </p>
            )}
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
