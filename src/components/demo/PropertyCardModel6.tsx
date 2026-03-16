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
 * Modelo 6 — Layout minimalista com destaque forte para o preço
 * e ícones organizados de forma moderna em pills.
 */
const PropertyCardModel6 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden cursor-pointer group border"
    style={{
      backgroundColor: colors.bg,
      borderColor: colors.text + "0a",
      boxShadow: `0 1px 8px ${colors.text}06`,
    }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{
      y: -5,
      boxShadow: `0 12px 36px ${colors.text}14`,
    }}
    whileTap={{ scale: 0.985 }}
    transition={{ duration: 0.3 }}
  >
    {/* Compact image */}
    <div className="relative h-44 overflow-hidden">
      <img
        src={propertyImages[property.image - 1]}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-12"
        style={{ background: `linear-gradient(to top, ${colors.bg}, transparent)` }}
      />
    </div>

    {/* Content: price-first layout */}
    <div className="p-5 -mt-2 relative">
      {/* Large price */}
      <div className="flex items-start justify-between mb-3">
        <p className="font-display font-black text-xl" style={{ color: colors.primary }}>
          {property.price}
        </p>
        <span
          className="px-2.5 py-1 rounded-md text-[10px] font-display font-bold capitalize"
          style={{ backgroundColor: colors.primary + "12", color: colors.primary }}
        >
          {property.type}
        </span>
      </div>

      <h3 className="font-display font-semibold text-sm leading-snug mb-1.5" style={{ color: colors.text }}>
        {property.title}
      </h3>
      <p className="text-[11px] flex items-center gap-1 mb-4" style={{ color: colors.text + "55" }}>
        <MapPin className="w-3 h-3" style={{ color: colors.primary + "88" }} />
        {property.location}
      </p>

      {/* Icon pills */}
      {property.type !== "terreno" ? (
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Bed, label: `${property.bedrooms} Quartos` },
            { icon: Bath, label: `${property.bathrooms} Ban.` },
            { icon: Car, label: `${property.parking} Vagas` },
            { icon: Maximize, label: property.area },
          ].map(({ icon: Icon, label }, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-display font-semibold"
              style={{ backgroundColor: colors.text + "06", color: colors.text + "77" }}
            >
              <Icon className="w-3 h-3" style={{ color: colors.primary }} /> {label}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-display font-semibold"
            style={{ backgroundColor: colors.text + "06", color: colors.text + "77" }}
          >
            <Maximize className="w-3 h-3" style={{ color: colors.primary }} /> {property.area}
          </span>
        </div>
      )}
    </div>
  </motion.div>
);

export default PropertyCardModel6;
