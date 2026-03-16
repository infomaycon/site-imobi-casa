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
 * Modelo 4 — Layout moderno com imagem grande e informações bem organizadas abaixo.
 * Card alto, imagem dominante (~60%), info compacta abaixo com separador colorido.
 */
const PropertyCardModel4 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden cursor-pointer group"
    style={{
      backgroundColor: colors.bg,
      boxShadow: `0 2px 12px ${colors.text}08`,
    }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{
      y: -6,
      boxShadow: `0 8px 30px ${colors.text}18`,
    }}
    whileTap={{ scale: 0.985 }}
    transition={{ duration: 0.3 }}
  >
    {/* Large image area */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={propertyImages[property.image - 1]}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to top, ${colors.primary}30, transparent 60%)` }}
      />
      <div
        className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-display font-bold capitalize backdrop-blur-md"
        style={{ backgroundColor: colors.bg + "cc", color: colors.primary }}
      >
        {property.type}
      </div>
    </div>

    {/* Colored accent bar */}
    <div className="h-1" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary || colors.primary}88)` }} />

    {/* Info section */}
    <div className="p-5">
      <p className="text-xs flex items-center gap-1 mb-1.5" style={{ color: colors.text + "66" }}>
        <MapPin className="w-3 h-3" style={{ color: colors.primary }} />
        {property.location}
      </p>
      <h3 className="font-display font-bold text-sm leading-tight mb-3" style={{ color: colors.text }}>
        {property.title}
      </h3>
      <p className="font-display font-black text-lg mb-4" style={{ color: colors.primary }}>
        {property.price}
      </p>
      {property.type !== "terreno" ? (
        <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: colors.text + "0a" }}>
          {[
            { icon: Bed, val: property.bedrooms },
            { icon: Bath, val: property.bathrooms },
            { icon: Car, val: property.parking },
            { icon: Maximize, val: property.area },
          ].map(({ icon: Icon, val }, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px]" style={{ color: colors.text + "55" }}>
              <Icon className="w-3.5 h-3.5" /> {val}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1 pt-3 border-t text-[11px]" style={{ borderColor: colors.text + "0a", color: colors.text + "55" }}>
          <Maximize className="w-3.5 h-3.5" /> {property.area}
        </div>
      )}
    </div>
  </motion.div>
);

export default PropertyCardModel4;
