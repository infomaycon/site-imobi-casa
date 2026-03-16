import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";
import ImageLightbox from "./ImageLightbox";
import { AnimatePresence } from "framer-motion";

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
 * Modelo 4 — Gallery with masonry-style grid, accent borders, and elegant spacing.
 */
const PropertyGalleryModel4 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build gallery images array from property image cycling through available images
  const galleryImages = Array.from({ length: 6 }, (_, i) =>
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

        {/* Property header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-display font-bold capitalize"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              {property.type}
            </span>
            <span className="font-display font-black text-2xl" style={{ color: colors.primary }}>
              {property.price}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2" style={{ color: colors.text }}>
            {property.title}
          </h1>
          <p className="text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}>
            <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            {property.location}
          </p>
        </div>

        {/* Masonry-style gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden cursor-pointer group ${
                i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
              }`}
              style={{
                borderRadius: "16px",
                border: `2px solid ${colors.primary}15`,
              }}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={img}
                alt={`${property.title} - Imagem ${i + 1}`}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                  i === 0 ? "h-[400px] md:h-[500px]" : "h-[200px] md:h-[240px]"
                }`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {/* Accent corner */}
              <div
                className="absolute top-0 left-0 w-12 h-12 opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}40, transparent)`,
                  borderRadius: "16px 0 0 0",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Property details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {property.type !== "terreno" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.primary + "08", border: `1px solid ${colors.primary}15` }}
                  >
                    <item.icon className="w-5 h-5 mb-2" style={{ color: colors.primary }} />
                    <p className="text-xs" style={{ color: colors.text + "66" }}>{item.label}</p>
                    <p className="font-display font-bold text-sm" style={{ color: colors.text }}>{String(item.value)}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
              <p className="leading-relaxed font-body" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border"
                    style={{ borderColor: colors.primary + "30", color: colors.primary }}
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

export default PropertyGalleryModel4;
