import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Essencial Premium", price: "R$ 197", period: "/mês",
    description: "Para corretores que estão começando no digital.",
    features: ["1 modelo premium à escolha", "Até 30 imóveis cadastrados", "Formulário de leads", "Integração WhatsApp", "Responsivo mobile", "SSL incluso", "Suporte por e-mail"],
    highlighted: false,
  },
  {
    name: "Profissional Elite", price: "R$ 397", period: "/mês",
    description: "Para corretores que querem dominar o mercado digital.",
    features: ["3 modelos premium à escolha", "Imóveis ilimitados", "Formulário de leads avançado", "Integração WhatsApp", "SEO otimizado", "Painel administrativo completo", "Filtros inteligentes", "Suporte prioritário", "Domínio personalizado"],
    highlighted: true,
  },
  {
    name: "Luxury Performance", price: "R$ 697", period: "/mês",
    description: "Para imobiliárias e corretores de elite.",
    features: ["Todos os 9 modelos premium", "Imóveis ilimitados", "CRM integrado", "Relatórios de performance", "SEO avançado + Blog", "Integração redes sociais", "Tour virtual 360°", "Suporte VIP 24/7", "Domínio personalizado", "Identidade visual exclusiva"],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="planos" className="py-24 bg-surface-light-alt relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-primary font-display font-semibold text-sm uppercase tracking-widest">Planos</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading mt-3">
            Escolha o plano ideal para <span className="text-gradient-primary">seu negócio</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-surface-light-card border-primary/40 shadow-premium scale-105"
                  : "bg-surface-light-card border-border hover:border-primary/20 shadow-soft"
              }`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs font-display font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Mais Popular
                </div>
              )}

              <h3 className="font-display font-bold text-xl text-heading mb-2">{plan.name}</h3>
              <p className="text-body-muted text-sm font-body mb-6">{plan.description}</p>

              <div className="mb-8">
                <span className="font-display font-black text-4xl text-heading">{plan.price}</span>
                <span className="text-body-muted text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-body">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-body">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3.5 rounded-lg font-display font-bold text-sm transition-all ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-premium"
                  : "border border-primary/30 text-primary hover:bg-primary/10"
              }`}>
                Começar Agora
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
