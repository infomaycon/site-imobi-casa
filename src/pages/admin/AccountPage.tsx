import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriberAccess } from "@/hooks/useSubscriberAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  UserPlus,
  Crown,
  ArrowUpCircle,
  XCircle,
  Trash2,
  Check,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Period = "mensal" | "semestral" | "anual";

const PERIODS: { key: Period; label: string; discount?: string }[] = [
  { key: "mensal", label: "Mensal" },
  { key: "semestral", label: "Semestral", discount: "-15%" },
  { key: "anual", label: "Anual", discount: "-25%" },
];

const PLANS = [
  {
    slug: "gratuito",
    name: "Free",
    level: 0,
    tagline: "Para conhecer a plataforma.",
    prices: { mensal: "R$ 0", semestral: "R$ 0", anual: "R$ 0" },
    periodLabel: { mensal: "", semestral: "", anual: "" },
    highlighted: false,
    features: [
      "1 modelo de site",
      "Até 5 imóveis cadastrados",
      "Até 3 imagens por imóvel",
      "Marca d'água ImobiCasa",
      "Subdomínio gratuito",
    ],
  },
  {
    slug: "essencial",
    name: "Essencial",
    level: 1,
    tagline: "Ideal para corretores iniciantes.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: false,
    features: [
      "3 modelos de site disponíveis",
      "Até 20 imóveis cadastrados",
      "Até 10 imagens por imóvel",
      "Integração com WhatsApp",
      "Subdomínio gratuito",
    ],
  },
  {
    slug: "profissional",
    name: "Profissional",
    level: 2,
    tagline: "Perfeito para corretores que querem crescer.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: true,
    features: [
      "Acesso a todos os modelos",
      "Até 50 imóveis cadastrados",
      "Até 20 imagens por imóvel",
      "Domínio próprio",
      "Até 2 colaboradores",
      "Sem marca d'água",
    ],
  },
  {
    slug: "elite",
    name: "Elite",
    level: 3,
    tagline: "Para corretores profissionais e imobiliárias.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: false,
    features: [
      "Todos os modelos",
      "Até 150 imóveis cadastrados",
      "Até 40 imagens por imóvel",
      "Até 5 colaboradores",
      "Destaque na home",
      "Suporte via WhatsApp",
    ],
  },
];

const MAX_COLLABORATORS = 2;

const AccountPage = () => {
  const { user } = useAuth();
  const { subscriber, plan } = useSubscriberAccess();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("mensal");
  const [showUpgrade, setShowUpgrade] = useState(true);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentSlug = (plan || "trial").toLowerCase();
  const currentPlanObj = PLANS.find((p) => p.slug === currentSlug);
  const isTrial = !currentPlanObj;
  const currentLevel = currentPlanObj?.level ?? 0;
  const isOwner = true;

  const planLabel = isTrial
    ? `Trial gratuito${
        subscriber?.trial_end
          ? ` · expira em ${new Date(subscriber.trial_end).toLocaleDateString("pt-BR")}`
          : ""
      }`
    : `Plano ${currentPlanObj?.name} · ${currentPlanObj?.prices.mensal}/mês`;

  const goToCheckout = (slug: string) => {
    const valor = 1;
    navigate(`/checkout?plano=${slug}&ciclo=${period}&valor=${valor}&upgrade=1`);
  };

  const addCollaborator = () => {
    if (!collaboratorEmail.trim() || collaborators.length >= MAX_COLLABORATORS) return;
    setCollaborators((prev) => [...prev, collaboratorEmail.trim()]);
    setCollaboratorEmail("");
  };

  const removeCollaborator = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">
          Gerencie sua conta e assinatura
        </p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-body text-muted-foreground">{planLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Management */}
      {isOwner && (
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">
            Gerenciar Plano
          </h2>

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setShowUpgrade(!showUpgrade)}
              className="h-11 font-body"
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              {isTrial ? "Assinar um plano" : "Upgrade de Plano"}
            </Button>
            {!isTrial && (
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(!showCancelConfirm)}
                className="h-11 font-body text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar Plano
              </Button>
            )}
          </div>

          <AnimatePresence>
            {showUpgrade && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <p className="text-sm text-muted-foreground font-body">
                  Escolha o plano e o ciclo desejado:
                </p>

                {/* Period selector */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center bg-muted rounded-full p-1 border border-border">
                    {PERIODS.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setPeriod(p.key)}
                        className={`relative px-4 py-2 rounded-full text-xs font-display font-semibold transition-all ${
                          period === p.key
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p.label}
                        {p.discount && period !== p.key && (
                          <span className="ml-1 text-[10px] font-bold text-primary">
                            {p.discount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {PLANS.map((p) => {
                    const isCurrent = p.slug === currentSlug;
                    const isDowngrade = !isTrial && p.level < currentLevel;
                    const isFree = p.slug === "gratuito";
                    return (
                      <div
                        key={p.slug}
                        className={`relative rounded-xl border p-5 flex flex-col ${
                          p.highlighted
                            ? "border-primary/50 bg-primary/[0.03] shadow-sm"
                            : "border-border bg-card"
                        }`}
                      >
                        {p.highlighted && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-display font-bold flex items-center gap-1 whitespace-nowrap">
                            <Star className="w-3 h-3 fill-current" /> Mais escolhido
                          </div>
                        )}
                        <h3 className="font-display font-bold text-base text-foreground">
                          {p.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body mb-3">
                          {p.tagline}
                        </p>
                        <div className="mb-4">
                          <span className="font-display font-black text-2xl text-foreground">
                            {p.prices[period]}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {p.periodLabel[period]}
                          </span>
                        </div>
                        <ul className="space-y-1.5 mb-4 flex-1">
                          {p.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs font-body text-foreground"
                            >
                              <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          size="sm"
                          variant={p.highlighted ? "default" : "outline"}
                          disabled={isCurrent || isDowngrade || isFree}
                          onClick={() => !isFree && goToCheckout(p.slug)}
                          className="w-full font-display font-semibold"
                        >
                          {isCurrent
                            ? "Plano atual"
                            : isDowngrade
                              ? "Indisponível"
                              : isFree
                                ? "Gratuito"
                                : "Assinar"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {showCancelConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-sm text-foreground font-body mb-3">
                    Tem certeza que deseja cancelar seu plano? Você perderá acesso aos
                    recursos ao final do período.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" className="font-body">
                      Confirmar Cancelamento
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCancelConfirm(false)}
                      className="font-body"
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Collaborators */}
      <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground text-lg">
            Colaboradores
          </h2>
          <span className="text-xs text-muted-foreground font-body">
            {collaborators.length}/{MAX_COLLABORATORS}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          Colaboradores podem gerenciar imóveis e conteúdo, mas não podem cancelar, fazer
          upgrade ou remover o assinante principal.
        </p>

        {collaborators.length < MAX_COLLABORATORS && (
          <div className="flex gap-2">
            <Input
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              placeholder="email@colaborador.com"
              className="h-11"
            />
            <Button onClick={addCollaborator} className="h-11 px-4 font-body shrink-0">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        )}

        {collaborators.length > 0 && (
          <div className="space-y-2">
            {collaborators.map((email, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-foreground">{email}</span>
                </div>
                <button
                  onClick={() => removeCollaborator(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
