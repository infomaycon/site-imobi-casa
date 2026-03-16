import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

/**
 * Modelo 9 — Card Floating Info
 * Imagem ocupa todo o card + pequeno card flutuante sobreposto com sombra.
 * Hover: card levanta levemente (floating effect).
 */
const PropertyCardModel9 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="relative rounded-2xl overflow-visible cursor-pointer group"
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
  >
    {/* Image container */}
    <div className="relative rounded-2xl overflow-hidden h-[280px]"
      style={{ boxShadow: `0 4px 16px ${colors.text}10` }}
    >
      <img
        src={propertyImages[property.image - 1]}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Type badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="px-3 py-1.5 rounded-lg text-[11px] font-display font-bold capitalize"
          style={{ backgroundColor: colors.primary, color: "#fff" }}
        >
          {property.type}
        </span>
      </div>
    </div>

    {/* Floating info card */}
    <motion.div
      className="relative mx-4 -mt-12 rounded-xl p-4 z-10"
      style={{
        backgroundColor: colors.bg,
        boxShadow: `0 8px 30px ${colors.text}15`,
        border: `1px solid ${colors.text}08`,
      }}
      whileHover={{ y: -8, boxShadow: `0 16px 48px ${colors.text}22` }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-display font-bold text-sm leading-tight mb-1.5" style={{ color: colors.text }}>
        {property.title}
      </h3>
      <p className="text-xs flex items-center gap-1 mb-3" style={{ color: colors.text + "66" }}>
        <MapPin className="w-3 h-3" style={{ color: colors.primary }} />
        {property.location}
      </p>

      <div className="flex items-center justify-between">
        <p className="font-display font-black text-lg" style={{ color: colors.primary }}>
          {property.price}
        </p>

        {property.type !== "terreno" ? (
          <div className="flex items-center gap-2.5">
            {[
              { icon: Bed, val: property.bedrooms },
              { icon: Bath, val: property.bathrooms },
              { icon: Car, val: property.parking },
              { icon: Maximize, val: property.area },
            ].map(({ icon: Icon, val }, i) => (
              <span key={i} className="flex items-center gap-0.5 text-[10px]" style={{ color: colors.text + "55" }}>
                <Icon className="w-3 h-3" style={{ color: colors.primary + "88" }} /> {val}
              </span>
            ))}
          </div>
        ) : (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: colors.text + "55" }}>
            <Maximize className="w-3 h-3" style={{ color: colors.primary + "88" }} /> {property.area}
          </span>
        )}
      </div>
    </motion.div>
  </motion.div>
);

export default PropertyCardModel9;
