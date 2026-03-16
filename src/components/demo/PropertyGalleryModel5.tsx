import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";
import ImageLightbox from "./ImageLightbox";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

const featureIcon = (f: string) => {
  const map: Record<string, any> = {
    "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
    Varanda: Fence, "Acabamento Premium": Gem,
  };
  const Icon = map[f] || Gem;
  return <Icon className="w-4 h-4" />;
};

/**
 * Modelo 5 — Galeria Imersiva com imagem principal full-width, setas de navegação,
 * indicadores/miniaturas e lightbox ao clicar.
 */
const PropertyGalleryModel5 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const [mainIndex, setMainIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = Array.from({ length: 6 }, (_, i) =>
    propertyImages[(property.image - 1 + i) % 6]
  );

  const goTo = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    setDirection(newIndex > mainIndex ? 1 : -1);
    setMainIndex(newIndex);
  }, [mainIndex, galleryImages.length]);

  // Keyboard navigation for main slider
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.min(mainIndex + 1, galleryImages.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(mainIndex - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mainIndex, goTo, galleryImages.length]);

  const variants = {
    enter: { opacity: 0, scale: 0.98 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <section className="pb-16">
      <div className="container mx-auto px-6 max-w-6xl pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-display font-semibold transition-opacity hover:opacity-80"
          style={{ color: colors.text + "88" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>
      </div>

      {/* Immersive main image slider */}
      <div className="relative w-full mb-4 bg-black/5">
        <div className="container mx-auto px-6 max-w-5xl py-8">
          <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-lg">
            {/* Navigation arrows */}
            {mainIndex > 0 && (
              <button
                onClick={() => goTo(mainIndex - 1)}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {mainIndex < galleryImages.length - 1 && (
              <button
                onClick={() => goTo(mainIndex + 1)}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Main image with crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mainIndex}
                className="relative cursor-pointer w-full"
                onClick={() => setLightboxIndex(mainIndex)}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <img
                  src={galleryImages[mainIndex]}
                  alt={property.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg pointer-events-none" />
                
                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span
                    className="inline-block px-4 py-1.5 rounded-lg text-xs font-display font-bold capitalize mb-2"
                    style={{ backgroundColor: colors.primary, color: "#fff" }}
                  >
                    {property.type}
                  </span>
                  <h1 className="font-display font-black text-2xl md:text-4xl text-white mb-1 drop-shadow-lg">
                    {property.title}
                  </h1>
                  <p className="text-white/90 flex items-center gap-1 text-sm drop-shadow">
                    <MapPin className="w-4 h-4" /> {property.location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Thumbnail indicators */}
      <div className="container mx-auto px-6 max-w-6xl mb-12">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300"
              style={{
                border: i === mainIndex ? `3px solid ${colors.primary}` : "3px solid transparent",
                opacity: i === mainIndex ? 1 : 0.55,
                transform: i === mainIndex ? "scale(1.05)" : "scale(1)",
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === mainIndex && (
                <motion.div
                  className="absolute inset-0"
                  style={{ boxShadow: `inset 0 0 0 3px ${colors.primary}` }}
                  layoutId="thumb-indicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Property info */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="font-display font-black text-3xl" style={{ color: colors.primary }}>
            {property.price}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {property.type !== "terreno" && (
              <div className="flex flex-wrap gap-6 py-4 border-y" style={{ borderColor: colors.text + "12" }}>
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" style={{ color: colors.primary }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: colors.text + "55" }}>{item.label}</p>
                      <p className="font-display font-bold text-sm" style={{ color: colors.text }}>{String(item.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.text }}>Sobre o Imóvel</h3>
              <p className="leading-relaxed font-body" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.text }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                    style={{ backgroundColor: colors.primary + "10", color: colors.primary }}
                  >
                    {featureIcon(f)} {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="https://wa.me/5511999990000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}
            >
              WhatsApp
            </a>
            <button
              className="w-full py-3 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              Tenho Interesse
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={galleryImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertyGalleryModel5;
