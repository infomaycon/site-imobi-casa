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
 * Modelo 5 — Foco maior na imagem, informações elegantemente sobrepostas.
 * Card com imagem full-height e overlay gradient com informações na parte inferior.
 */
const PropertyCardModel5 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="relative rounded-2xl overflow-hidden cursor-pointer group h-[380px]"
    style={{
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
    {/* Full background image */}
    <img
      src={propertyImages[property.image - 1]}
      alt={property.title}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
    />

    {/* Top badge */}
    <div className="absolute top-4 left-4 z-10">
      <span
        className="px-3 py-1.5 rounded-lg text-[11px] font-display font-bold capitalize"
        style={{ backgroundColor: colors.primary, color: "#fff" }}
      >
        {property.type}
      </span>
    </div>

    {/* Price badge top right */}
    <div className="absolute top-4 right-4 z-10">
      <span
        className="px-3 py-1.5 rounded-lg text-sm font-display font-black backdrop-blur-md"
        style={{ backgroundColor: colors.bg + "dd", color: colors.primary }}
      >
        {property.price}
      </span>
    </div>

    {/* Bottom gradient overlay with info */}
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{ background: `linear-gradient(to top, ${colors.text}dd 0%, ${colors.text}88 30%, transparent 55%)` }}
    >
      <div className="p-5 space-y-2">
        <h3 className="font-display font-bold text-base leading-tight text-white drop-shadow-sm">
          {property.title}
        </h3>
        <p className="text-xs flex items-center gap-1 text-white/70">
          <MapPin className="w-3 h-3" />
          {property.location}
        </p>
        {property.type !== "terreno" ? (
          <div className="flex items-center gap-4 pt-2">
            {[
              { icon: Bed, val: property.bedrooms },
              { icon: Bath, val: property.bathrooms },
              { icon: Car, val: property.parking },
              { icon: Maximize, val: property.area },
            ].map(({ icon: Icon, val }, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-white/60">
                <Icon className="w-3.5 h-3.5" /> {val}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 pt-2 text-[11px] text-white/60">
            <Maximize className="w-3.5 h-3.5" /> {property.area}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel5;
