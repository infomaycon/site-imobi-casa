import { Construction, Mail, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Icon */}
        <motion.div
          className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Construction className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Em <span className="text-primary">construção</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg font-body mb-3">
          Estamos preparando algo incrível para você.
        </p>
        <p className="text-gray-500 text-sm font-body mb-10">
          Nosso site estará disponível em breve. Fique ligado!
        </p>

        {/* Animated progress bar */}
        <div className="w-full max-w-xs mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden mb-10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "65%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </div>

        {/* Contact */}
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
          <a
            href="mailto:contato@imobicasa.com"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contato
          </a>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
        </div>
      </motion.div>

      {/* Footer copyright - hidden super admin link */}
      <div className="absolute bottom-6 text-center text-gray-600 text-xs">
        <a href="/super-admin-login" className="hover:text-gray-500 transition-colors cursor-default">
          ©
        </a>{" "}
        2026 ImobiCasa. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default UnderConstruction;