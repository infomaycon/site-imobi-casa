import { motion } from "framer-motion";
import { Users, MessageCircle, SlidersHorizontal, Building2, Smartphone, Search, Settings, Sparkles } from "lucide-react";

const benefits = [
  { icon: Users, title: "Captação Automática de Leads", desc: "Formulários inteligentes que captam e qualificam seus leads automaticamente, 24 horas por dia." },
  { icon: MessageCircle, title: "WhatsApp Integrado", desc: "Seus clientes entram em contato com um único clique, direto pelo WhatsApp." },
  { icon: SlidersHorizontal, title: "Filtros Inteligentes", desc: "Busca refinada por Casas, Apartamentos e Terrenos para cada perfil de cliente." },
  { icon: Building2, title: "Feito para Imóveis Urbanos", desc: "Layouts projetados para destacar o melhor de cada imóvel de alto padrão." },
  { icon: Smartphone, title: "100% Responsivo", desc: "Experiência perfeita em qualquer dispositivo — mobile, tablet ou desktop." },
  { icon: Search, title: "Otimizado para SEO", desc: "Seus imóveis encontrados no Google por quem realmente quer comprar." },
  { icon: Settings, title: "Painel Administrativo", desc: "Gerencie imóveis, leads e conteúdo com facilidade e autonomia total." },
  { icon: Sparkles, title: "Design de Alto Padrão", desc: "Visual premium que transmite confiança, credibilidade e exclusividade." },
];

const BenefitsSection = () => {
  return (
    <section className="py-28 bg-surface-light-alt relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="text-primary font-display font-semibold text-sm uppercase tracking-widest">Por que escolher</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading mt-3">
            Tudo que seu site precisa para <span className="text-gradient-primary">vender mais</span>
          </h2>
          <p className="text-body-muted mt-4 max-w-2xl mx-auto font-body text-base">
            Recursos pensados para corretores que querem se destacar no mercado e fechar mais negócios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className="group relative p-7 rounded-2xl bg-surface-light-card border border-border hover:border-primary/40 transition-all duration-500 shadow-soft hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-primary/0 group-hover:bg-primary transition-all duration-500" />
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-premium transition-all duration-500">
                <b.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
              </div>
              <h3 className="font-display font-bold text-heading text-base mb-2">{b.title}</h3>
              <p className="text-body-muted text-sm font-body leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
