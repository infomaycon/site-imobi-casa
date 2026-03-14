import { motion } from "framer-motion";
import { Users, MessageCircle, SlidersHorizontal, Building2, Smartphone, Search, Settings, Sparkles } from "lucide-react";

const benefits = [
  { icon: Users, title: "Captação automática de leads qualificados", desc: "Formulários inteligentes que captam e qualificam seus leads automaticamente." },
  { icon: MessageCircle, title: "Integração direta com WhatsApp", desc: "Seus clientes entram em contato com um clique, direto pelo WhatsApp." },
  { icon: SlidersHorizontal, title: "Filtros inteligentes", desc: "Casas, Apartamentos e Terrenos — busca refinada para cada perfil de cliente." },
  { icon: Building2, title: "Estrutura ideal para imóveis urbanos", desc: "Layouts pensados para destacar o melhor de cada imóvel urbano." },
  { icon: Smartphone, title: "Layout moderno e responsivo", desc: "Perfeito em qualquer dispositivo — mobile, tablet ou desktop." },
  { icon: Search, title: "Estrutura otimizada para SEO", desc: "Seus imóveis encontrados no Google por quem realmente quer comprar." },
  { icon: Settings, title: "Área administrativa prática", desc: "Gerencie imóveis, leads e conteúdo com facilidade total." },
  { icon: Sparkles, title: "Experiência visual de alto padrão", desc: "Design premium que transmite confiança e exclusividade." },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-surface-light-alt relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="text-primary font-display font-semibold text-sm uppercase tracking-widest">Benefícios</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading mt-3">
            Tudo que seu site precisa para <span className="text-gradient-primary">vender mais</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className="group p-6 rounded-xl bg-surface-light-card border border-border hover:border-primary/30 transition-all duration-300 shadow-soft"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-heading text-base mb-2">{b.title}</h3>
              <p className="text-body-muted text-sm font-body leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
