import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Imóvel urbano de alto padrão" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/80 via-surface-dark/60 to-surface-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
            Plataforma Premium para Corretores
          </span>
        </motion.div>

        <motion.h1
          className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-on-dark leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Sites Premium para Corretores que Vendem{" "}
          <span className="text-gradient-primary">Alto Padrão</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-on-dark-muted max-w-2xl mx-auto mb-10 font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Conquiste autoridade digital e multiplique suas vendas com sites imobiliários de alto padrão, projetados para converter visitantes em clientes qualificados.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <a
            href="#planos"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-bold text-lg bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-premium"
          >
            Quero Meu Site de Alto Padrão
          </a>
          <a
            href="#modelos"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-semibold text-lg border-2 border-primary/30 text-on-dark hover:bg-primary/10 transition-all"
          >
            Ver Modelos Demonstrativos
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-dark to-transparent" />
    </section>
  );
};

export default HeroSection;
