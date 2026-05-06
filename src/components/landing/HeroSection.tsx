import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.webp";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Casa moderna de alto padrão" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.span
          className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase bg-white/10 text-white border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Plataforma Premium para Corretores
        </motion.span>

        <motion.h1
          className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Seu Próximo Cliente Pode Estar Procurando um{" "}
          <span className="text-accent">Imóvel Agora</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Tenha um site profissional preparado para capturar oportunidades todos os dias.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <span
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-bold text-base sm:text-lg bg-gold text-white cursor-default shadow-premium"
          >
            Quero Meu Site
          </span>
          <span
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-semibold text-base sm:text-lg border-2 border-white/30 text-white cursor-default backdrop-blur-sm"
          >
            Ver Modelos
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
