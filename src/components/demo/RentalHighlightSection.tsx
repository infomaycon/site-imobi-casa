import { motion } from "framer-motion";
import { Key, Bed, Bath, Car, Maximize } from "lucide-react";
import { properties, type Property, type DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.webp";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import property5 from "@/assets/property-5.webp";
import property6 from "@/assets/property-6.webp";

const propertyImages = [property1, property2, property3, property4, property5, property6];

const RentalHighlightSection = ({
  colors,
  onSelect,
}: {
  colors: DemoModel["colors"];
  onSelect?: (p: Property) => void;
}) => {
  const rentalProperties = properties.filter((p) => p.status === "aluguel");
  if (rentalProperties.length === 0) return null;

  const c = colors;

  return (
    <section className="py-20" style={{ backgroundColor: c.text + "04" }}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: c.primary + "15", color: c.primary }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Key className="w-3.5 h-3.5" />
            Aluguel
          </motion.div>
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: c.text }}>
            Imóveis para Locação
          </h2>
          <p className="mt-2 font-body text-sm" style={{ color: c.text + "77" }}>
            Confira nossos imóveis disponíveis para aluguel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalProperties.map((p, i) => (
            <motion.div
              key={p.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.text}12`, boxShadow: `0 2px 12px ${c.text}08` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 8px 30px ${c.primary}18` }}
              onClick={() => onSelect?.(p)}
            >
              {/* Rental badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-bold text-white"
                  style={{ backgroundColor: c.primary }}
                >
                  <Key className="w-3 h-3" />
                  Aluguel
                </span>
              </div>

              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={propertyImages[(p.image - 1) % propertyImages.length]}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Accent bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.primary}44)` }} />

              <div className="p-5">
                <h3 className="font-display font-bold text-base mb-1" style={{ color: c.text }}>
                  {p.title}
                </h3>
                <p className="text-xs font-body mb-3" style={{ color: c.text + "66" }}>{p.location}</p>

                <div className="flex items-center gap-3 mb-3 text-xs font-body" style={{ color: c.text + "77" }}>
                  {p.bedrooms > 0 && (
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bedrooms}</span>
                  )}
                  {p.bathrooms > 0 && (
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>
                  )}
                  {p.parking > 0 && (
                    <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{p.parking}</span>
                  )}
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{p.area}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-lg" style={{ color: c.primary }}>
                    {p.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalHighlightSection;
