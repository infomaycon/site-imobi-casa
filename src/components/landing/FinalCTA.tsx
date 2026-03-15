import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const FinalCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(220_30%_10%/0.65)]" />
      </div>
      <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
        <motion.h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Corretores de alto padrão precisam de um site{" "}
          <span className="text-primary">à altura.</span>
        </motion.h2>
        <motion.p className="text-white/85 text-lg mb-10 font-body" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Não perca mais tempo com sites genéricos. Conquiste autoridade digital com uma presença online premium.
        </motion.p>
        <motion.a href="#planos" className="inline-flex items-center justify-center px-10 py-5 rounded-lg font-display font-bold text-lg bg-gold text-white hover:brightness-110 transition-all shadow-premium"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Quero Começar Agora
        </motion.a>
      </div>
    </section>
  );
};

export default FinalCTA;
