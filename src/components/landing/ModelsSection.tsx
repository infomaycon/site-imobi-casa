import { motion } from "framer-motion";
import { demoModels } from "@/data/models";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const ModelsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="modelos" className="py-24 bg-surface-dark-lighter relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-display font-semibold text-sm uppercase tracking-widest">Modelos</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-on-dark mt-3">
            9 Modelos Premium <span className="text-gradient-primary">Prontos para Usar</span>
          </h2>
          <p className="text-on-dark-muted mt-4 max-w-2xl mx-auto font-body">
            Cada modelo foi projetado com identidade visual exclusiva, paleta de cores própria e estrutura completa para corretores de alto padrão.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoModels.map((model, i) => (
            <motion.div
              key={model.id}
              className="group relative rounded-2xl overflow-hidden border border-border/10 hover:border-primary/30 transition-all duration-500"
              style={{ backgroundColor: model.colors.bg }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Header bar with model colors */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${model.colors.primary}, ${model.colors.secondary})` }}
              />

              <div className="p-8">
                {/* Logo placeholder */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 font-display font-black text-xl"
                  style={{ backgroundColor: model.colors.secondary + "20", color: model.colors.secondary }}
                >
                  {model.name.charAt(0)}
                </div>

                <h3
                  className="font-display font-bold text-xl mb-2"
                  style={{ color: model.colors.text }}
                >
                  {model.name}
                </h3>
                <p
                  className="text-sm mb-2 font-body italic"
                  style={{ color: model.colors.text + "aa" }}
                >
                  "{model.tagline}"
                </p>
                <p
                  className="text-xs font-body mb-6"
                  style={{ color: model.colors.text + "66" }}
                >
                  {model.style}
                </p>

                <button
                  onClick={() => navigate(`/demo/${model.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all hover:brightness-110"
                  style={{ backgroundColor: model.colors.secondary, color: model.colors.bg }}
                >
                  Ver Demonstração
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
