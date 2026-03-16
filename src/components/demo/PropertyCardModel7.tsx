import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize, Hash } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

/**
 * Modelo 7 — Card Diagonal Overlay
 * Imagem como fundo + caixa branca sobreposta com separação diagonal.
 */
const PropertyCardModel7 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="relative rounded-2xl overflow-hidden cursor-pointer group h-[420px]"
    style={{ boxShadow: `0 4px 20px ${colors.text}12` }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{
      y: -6,
      boxShadow: `0 12px 40px ${colors.text}20`,
    }}
    whileTap={{ scale: 0.985 }}
    transition={{ duration: 0.3 }}
  >
    {/* Full background image */}
    <img
      src={propertyImages[property.image - 1]}
      alt={property.title}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
    />

    {/* Type badge */}
    <div className="absolute top-4 left-4 z-10">
      <span
        className="px-3 py-1.5 rounded-lg text-[11px] font-display font-bold capitalize"
        style={{ backgroundColor: colors.primary, color: "#fff" }}
      >
        {property.type}
      </span>
    </div>

    {/* Diagonal overlay info box */}
    <div className="absolute bottom-0 left-0 right-0 z-10">
      {/* Diagonal SVG separator */}
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        className="w-full h-8 block"
        style={{ filter: `drop-shadow(0 -2px 4px ${colors.text}10)` }}
      >
        <polygon
          points="0,40 400,0 400,40"
          fill={colors.bg}
        />
      </svg>

      {/* Info box */}
      <div className="px-5 pb-5 pt-1" style={{ backgroundColor: colors.bg }}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-bold text-sm leading-tight flex-1 pr-2" style={{ color: colors.text }}>
            {property.title}
          </h3>
          <span className="flex items-center gap-1 text-[10px] font-display font-semibold shrink-0" style={{ color: colors.text + "55" }}>
            <Hash className="w-3 h-3" />{property.id}
          </span>
        </div>

        <p className="text-xs flex items-center gap-1 mb-3" style={{ color: colors.text + "66" }}>
          <MapPin className="w-3 h-3" style={{ color: colors.primary }} />
          {property.location}
        </p>

        {property.type !== "terreno" ? (
          <div className="flex items-center gap-3 mb-3">
            {[
              { icon: Bed, val: property.bedrooms },
              { icon: Bath, val: property.bathrooms },
              { icon: Car, val: property.parking },
              { icon: Maximize, val: property.area },
            ].map(({ icon: Icon, val }, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px]" style={{ color: colors.text + "66" }}>
                <Icon className="w-3.5 h-3.5" style={{ color: colors.primary + "99" }} /> {val}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 mb-3 text-[11px]" style={{ color: colors.text + "66" }}>
            <Maximize className="w-3.5 h-3.5" style={{ color: colors.primary + "99" }} /> {property.area}
          </div>
        )}

        <p className="font-display font-black text-lg" style={{ color: colors.primary }}>
          {property.price}
        </p>
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel7;
