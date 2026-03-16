import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, ZoomIn } from "lucide-react";
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
 * Modelo 6 — Galeria Grid Moderno com 3-4 colunas, cards arredondados com sombra,
 * hover zoom e lightbox com navegação.
 */
const PropertyGalleryModel6 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = Array.from({ length: 15 }, (_, i) =>
    propertyImages[(property.image - 1 + i) % 6]
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-sm font-display font-semibold transition-opacity hover:opacity-80"
          style={{ color: colors.text + "88" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 pb-6 border-b" style={{ borderColor: colors.text + "10" }}>
          <div>
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-display font-bold capitalize mb-3"
              style={{ backgroundColor: colors.primary + "12", color: colors.primary }}
            >
              {property.type}
            </span>
            <h1 className="font-display font-bold text-2xl md:text-3xl mb-1" style={{ color: colors.text }}>
              {property.title}
            </h1>
            <p className="text-sm flex items-center gap-1" style={{ color: colors.text + "66" }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              {property.location}
            </p>
          </div>
          <p className="font-display font-black text-4xl md:text-5xl" style={{ color: colors.primary }}>
            {property.price}
          </p>
        </div>

        {/* Modern grid gallery — 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-14">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden cursor-pointer group"
              style={{
                borderRadius: "16px",
                boxShadow: `0 4px 16px ${colors.text}0a`,
              }}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={`${property.title} - ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center rounded-[16px]">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 backdrop-blur-sm"
                  style={{ backgroundColor: colors.primary + "cc" }}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: colors.primary }}
              />
            </motion.div>
          ))}
        </div>

        {/* Info section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {property.type !== "terreno" && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms}` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="text-center py-4 rounded-lg"
                    style={{ backgroundColor: colors.text + "04" }}
                  >
                    <item.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: colors.primary }} />
                    <p className="font-display font-bold text-sm" style={{ color: colors.text }}>{String(item.value)}</p>
                    <p className="text-[10px]" style={{ color: colors.text + "55" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-semibold text-base mb-3" style={{ color: colors.text }}>Descrição</h3>
              <p className="leading-relaxed font-body text-sm" style={{ color: colors.text + "77" }}>{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-base mb-3" style={{ color: colors.text }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold"
                    style={{ backgroundColor: colors.text + "06", color: colors.text + "77" }}
                  >
                    <span style={{ color: colors.primary }}>{featureIcon(f)}</span> {f}
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

export default PropertyGalleryModel6;
