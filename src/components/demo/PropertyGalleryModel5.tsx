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
 * Modelo 5 — Elegant full-width hero image + horizontal scroll gallery strip.
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = Array.from({ length: 6 }, (_, i) =>
    propertyImages[(property.image - 1 + i) % 6]
  );

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

      {/* Hero main image */}
      <motion.div
        className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden cursor-pointer group mb-4"
        onClick={() => setLightboxIndex(0)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={galleryImages[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <span
              className="inline-block px-4 py-1.5 rounded-lg text-xs font-display font-bold capitalize mb-3"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              {property.type}
            </span>
            <h1 className="font-display font-black text-3xl md:text-5xl text-white mb-2 drop-shadow-lg">
              {property.title}
            </h1>
            <p className="text-white/80 flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4" /> {property.location}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Horizontal scroll gallery strip */}
      <div className="overflow-x-auto pb-2 mb-12">
        <div className="flex gap-3 px-6 min-w-max">
          {galleryImages.slice(1).map((img, i) => (
            <motion.div
              key={i}
              className="relative w-48 h-32 md:w-64 md:h-44 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0"
              onClick={() => setLightboxIndex(i + 1)}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{ boxShadow: `0 4px 20px ${colors.text}12` }}
            >
              <img
                src={img}
                alt={`${property.title} - ${i + 2}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: colors.primary }}
              />
            </motion.div>
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
