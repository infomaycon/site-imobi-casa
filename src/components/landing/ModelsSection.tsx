import { motion } from "framer-motion";
import { demoModels } from "@/data/models";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import previewAuroraPrime from "@/assets/preview-aurora-prime.png";
import previewSkylineUrban from "@/assets/preview-skyline-urban.png";
import previewMetropolitanElite from "@/assets/preview-metropolitan-elite.png";
import previewVillaCapital from "@/assets/preview-villa-capital.png";
import previewUrbanSignature from "@/assets/preview-urban-signature.png";
import previewInfinityCity from "@/assets/preview-infinity-city.png";
import previewEmpireUrban from "@/assets/preview-empire-urban.png";
import previewPrimeDistrict from "@/assets/preview-prime-district.png";
import previewCrownCity from "@/assets/preview-crown-city.png";

const previewMap: Record<string, string> = {
  "aurora-prime": previewAuroraPrime,
  "skyline-urban": previewSkylineUrban,
  "metropolitan-elite": previewMetropolitanElite,
  "villa-capital": previewVillaCapital,
  "urban-signature": previewUrbanSignature,
  "infinity-city": previewInfinityCity,
  "empire-urban": previewEmpireUrban,
  "prime-district": previewPrimeDistrict,
  "crown-city": previewCrownCity,
};

const ModelsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="modelos" className="py-28 bg-surface-light relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-gold font-display font-semibold text-sm uppercase tracking-widest">Modelos</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-heading mt-3">
            9 Modelos Premium <span className="text-gradient-primary">Prontos para Usar</span>
          </h2>
          <p className="text-body-muted mt-4 max-w-2xl mx-auto font-body">
            Cada modelo foi projetado com identidade visual exclusiva, paleta de cores própria e estrutura completa para corretores de alto padrão.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoModels.map((model, i) => (
            <motion.div
              key={model.id}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 bg-surface-light-card shadow-soft hover:shadow-lg"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Preview Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={previewMap[model.id]}
                  alt={`Preview do modelo ${model.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30" />
                {/* Large number */}
                <span
                  className="absolute top-3 left-4 font-display font-black text-6xl leading-none select-none pointer-events-none text-white drop-shadow-lg"
                  style={{ opacity: 0.9 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Color bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${model.colors.primary}, ${model.colors.secondary})` }} />

              <div className="p-6">
                <h3 className="font-display font-bold text-lg mb-1.5 text-heading">{model.name}</h3>
                <p className="text-sm mb-3 font-body italic text-body-muted">"{model.tagline}"</p>

                {/* Color palette */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-5 h-5 rounded-full border border-border shadow-sm" style={{ backgroundColor: model.colors.primary }} />
                  <span className="text-xs font-body text-body-muted ml-1">{model.style}</span>
                </div>

                <button
                  onClick={() => navigate(`/demo/${model.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all hover:brightness-110 w-full justify-center text-white"
                  style={{ backgroundColor: "#00bf63" }}
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
