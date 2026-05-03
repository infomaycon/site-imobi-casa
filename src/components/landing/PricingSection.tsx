import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Star } from "lucide-react";

type Period = "mensal" | "semestral" | "anual";

const periods: { key: Period; label: string; discount?: string }[] = [
  { key: "mensal", label: "Mensal" },
  { key: "semestral", label: "Semestral", discount: "-15%" },
  { key: "anual", label: "Anual", discount: "-25%" },
];

const plans = [
  {
    name: "Free",
    tagline: "Para começar sem compromisso.",
    prices: { mensal: "R$ 0", semestral: "R$ 0", anual: "R$ 0" },
    periodLabel: { mensal: "", semestral: "", anual: "" },
    highlighted: false,
    isFree: true,
    cta: "Criar conta grátis",
    features: [
      "1 modelo de site",
      "Até 5 imóveis cadastrados",
      "3 imagens por imóvel",
      "Subdomínio gratuito",
      "Marca d'água ImobiCasa",
      "Suporte por email",
    ],
  },
  {
    name: "Essencial",
    tagline: "Ideal para corretores iniciantes.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: false,
    cta: "Começar agora",
    features: [
      "3 modelos de site disponíveis",
      "Até 20 imóveis cadastrados",
      "Até 10 imagens por imóvel",
      "Painel administrativo com funções essenciais",
      "Integração direta com WhatsApp",
      "Formulário de contato para clientes",
      "Subdomínio gratuito",
      "Certificado SSL incluso",
      "Suporte por email (resposta em até 6h)",
      "Marca d'água ImobiCasa no rodapé",
      "Garantia de reembolso por 7 dias",
    ],
  },
  {
    name: "Profissional",
    tagline: "Perfeito para corretores que querem crescer.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: true,
    cta: "Começar agora",
    features: [
      "Acesso a todos os modelos de site",
      "Até 50 imóveis cadastrados",
      "Até 20 imagens por imóvel",
      "Personalização de cores do site",
      "Até 2 colaboradores no painel",
      "Uso de domínio próprio",
      "Sem marca d'água",
      "Filtros avançados de busca de imóveis",
      "Formulário de captação de leads",
      "Integração com WhatsApp",
      "Suporte prioritário por email (até 2h)",
    ],
  },
  {
    name: "Elite",
    tagline: "Para corretores profissionais e imobiliárias.",
    prices: { mensal: "R$ 1,00", semestral: "R$ 1,00", anual: "R$ 1,00" },
    periodLabel: { mensal: "/mês", semestral: "/semestre", anual: "/ano" },
    highlighted: false,
    cta: "Começar agora",
    features: [
      "Acesso a todos os modelos",
      "Controle total de edição do site",
      "Até 150 imóveis cadastrados",
      "Até 40 imagens por imóvel",
      "Até 5 colaboradores no painel",
      "Uso de domínio próprio",
      "Sem marca d'água",
      "Destaque de imóveis na página inicial",
      "Sistema de busca avançada",
      "Suporte prioritário via WhatsApp",
    ],
  },
];

const PLAN_SLUGS: Record<string, string> = {
  Free: "gratuito",
  Essencial: "essencial",
  Profissional: "profissional",
  Elite: "elite",
};

const PricingSection = () => {
  const [period, setPeriod] = useState<Period>("mensal");
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-24 bg-surface-light-alt relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold font-display font-semibold text-sm uppercase tracking-widest">
            Planos & Preços
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading mt-3 mb-4">
            Escolha o plano ideal para{" "}
            <span className="text-gradient-primary">seu negócio</span>
          </h2>
          <p className="text-body-muted font-body max-w-xl mx-auto">
            Comece gratuitamente e escale conforme seu negócio cresce. Todos os planos incluem 7 dias de garantia.
          </p>
        </motion.div>

        {/* Period selector */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center bg-surface-light-card rounded-full p-1.5 shadow-soft border border-border">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-display font-semibold transition-all duration-300 ${
                  period === p.key
                    ? "bg-primary text-primary-foreground shadow-premium"
                    : "text-body-muted hover:text-heading"
                }`}
              >
                {p.label}
                {p.discount && period !== p.key && (
                  <span className="ml-1.5 text-[10px] font-bold text-gold">{p.discount}</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-surface-light-card border-primary/40 shadow-premium lg:scale-105 z-10"
                  : "bg-surface-light-card border-border hover:border-primary/20 shadow-soft hover:shadow-premium"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Most popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-display font-bold flex items-center gap-1.5 shadow-premium whitespace-nowrap">
                  <Star className="w-3.5 h-3.5 fill-current" /> Mais escolhido
                </div>
              )}

              <div className="p-8">
                {/* Plan name & tagline */}
                <h3 className="font-display font-bold text-xl text-heading mb-1">
                  {plan.name}
                </h3>
                <p className="text-body-muted text-sm font-body mb-6">
                  {plan.tagline}
                </p>

                {/* Price with animation */}
                <div className="mb-8 min-h-[60px] flex items-end">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={period}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="font-display font-black text-4xl md:text-5xl text-heading">
                        {plan.prices[period]}
                      </span>
                      <span className="text-body-muted text-sm ml-1">
                        {plan.periodLabel[period]}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CTA button */}
                <button
                  onClick={() => {
                    if ((plan as any).isFree) {
                      navigate("/signup");
                      return;
                    }
                    const priceMap: Record<string, Record<Period, number>> = {
                      Essencial: { mensal: 69.90, semestral: 356.49, anual: 628.65 },
                      Profissional: { mensal: 99.90, semestral: 509.49, anual: 898.65 },
                      Elite: { mensal: 149.90, semestral: 764.49, anual: 1348.65 },
                    };
                    const valor = priceMap[plan.name][period];
                    navigate(
                      `/checkout?plano=${PLAN_SLUGS[plan.name]}&ciclo=${period}&valor=${valor}`,
                    );
                  }}
                  className={`w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all duration-300 mb-8 ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:brightness-110 shadow-premium"
                      : "border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Divider */}
                <div className="h-px bg-border mb-6" />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-body">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-body">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee note */}
        <motion.p
          className="text-center text-body-muted text-sm font-body mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          🔒 Pagamento seguro • Cancele quando quiser • 7 dias de garantia
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
