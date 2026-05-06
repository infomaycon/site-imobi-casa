import { useEffect, useState } from "react";
import { useTestProfile } from "@/hooks/useTestProfile";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Check, LogOut } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Essencial",
    price: "R$ 1,00",
    period: "/mês",
    features: [
      "Até 10 imóveis cadastrados",
      "2 modelos de site",
      "3 cores de destaque",
      "Suporte por email",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Profissional",
    price: "R$ 1,00",
    period: "/mês",
    features: [
      "Até 50 imóveis cadastrados",
      "Todos os 9 modelos de site",
      "Todas as 20 cores",
      "Domínio personalizado",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 1,00",
    period: "/mês",
    features: [
      "Imóveis ilimitados",
      "Todos os 9 modelos de site",
      "Todas as 20 cores",
      "Domínio personalizado",
      "2 colaboradores",
      "Suporte VIP 24/7",
    ],
    highlight: false,
  },
];

const TrialExpiredOverlay = () => {
  const { profile, isFree, refetch } = useTestProfile();
  const { signOut } = useAuth();
  const [updated, setUpdated] = useState(false);

  const expired =
    isFree &&
    !!profile?.trial_end &&
    Date.now() > new Date(profile.trial_end).getTime();

  // Marca status como "expired" uma vez quando detecta expiração
  useEffect(() => {
    if (!expired || updated) return;
    if (profile?.status === "expired") {
      setUpdated(true);
      return;
    }
    (async () => {
      await testSupabase
        .from("profiles" as any)
        .update({ status: "expired" })
        .eq("id", profile!.id);
      setUpdated(true);
      refetch();
    })();
  }, [expired, updated, profile, refetch]);

  if (!expired) return null;

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/test-login";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-300">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Seu período de teste terminou.
            </h2>
            <p className="text-lg text-muted-foreground font-body">
              Escolha um plano para continuar usando o painel.
            </p>
          </div>

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl bg-card p-6 shadow-soft border-2 transition-all hover:shadow-lg ${
                  plan.highlight
                    ? "border-primary ring-2 ring-primary/20 md:scale-105"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-display font-bold">
                      Mais escolhido
                    </span>
                  </div>
                )}
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-5">
                  <span className="text-3xl font-display font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground font-body">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm font-body text-foreground"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full h-11 rounded-lg font-display font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground font-body hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredOverlay;
