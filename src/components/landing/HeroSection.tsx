import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import laptopMockup from "@/assets/laptop-mockup.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Casa moderna de alto padrão" className="w-full h-full object-cover" />
        {/* Dark overlay 40% */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen pt-24 lg:pt-0">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <motion.span
              className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase bg-white/10 text-white border border-white/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Plataforma Premium para Corretores
            </motion.span>

            <motion.h1
              className="font-display font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Sites Premium para Corretores que Vendem{" "}
              <span className="text-gradient-primary">Alto Padrão</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 max-w-xl mb-10 font-body leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              Conquiste autoridade digital e multiplique suas vendas com sites imobiliários de alto padrão, projetados para converter visitantes em clientes qualificados.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="#planos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-bold text-lg bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-premium"
              >
                Quero Meu Site de Alto Padrão
              </a>
              <a
                href="#modelos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-display font-semibold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Ver Modelos Demonstrativos
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Laptop mockup */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={laptopMockup}
                alt="Site imobiliário premium em um notebook"
                className="w-full max-w-lg xl:max-w-xl drop-shadow-2xl"
              />
              {/* Glow effect beneath laptop */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
