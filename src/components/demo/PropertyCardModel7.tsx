import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize, Hash } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.webp";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import property5 from "@/assets/property-5.webp";
import property6 from "@/assets/property-6.webp";

const propertyImages = [property1, property2, property3, property4, property5, property6];

/**
 * Modelo 7 — Card Diagonal Overlay
 * Imagem ocupa todo o fundo. Caixa branca sobreposta com corte diagonal entre imagem e info.
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
    className="group relative cursor-pointer overflow-hidden rounded-2xl"
    style={{ boxShadow: `0 6px 24px ${colors.text}14` }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6, boxShadow: `0 18px 48px ${colors.text}22` }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.3 }}
  >
    {/* ── Image background ── */}
    <div className="relative h-[240px] overflow-hidden">
      <img
        src={propertyImages[property.image - 1]}
        alt={property.title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* Subtle gradient so badge is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

      {/* Type badge */}
      <span
        className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider"
        style={{ backgroundColor: colors.primary, color: "#fff" }}
      >
        {property.type}
      </span>
    </div>

    {/* ── Diagonal separator — the key visual element ── */}
    <div className="relative -mt-8">
      <svg
        viewBox="0 0 500 50"
        preserveAspectRatio="none"
        className="block h-10 w-full"
      >
        <polygon points="0,50 500,0 500,50" fill={colors.bg} />
      </svg>
    </div>

    {/* ── White info box ── */}
    <div className="-mt-px px-5 pb-5 pt-0" style={{ backgroundColor: colors.bg }}>
      {/* Title + code */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-[15px] font-bold leading-snug" style={{ color: colors.text }}>
          {property.title}
        </h3>
        <span
          className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-md px-2 py-0.5 text-[10px] font-display font-semibold"
          style={{ backgroundColor: colors.text + "08", color: colors.text + "60" }}
        >
          <Hash className="h-2.5 w-2.5" />
          {property.id}
        </span>
      </div>

      {/* Location */}
      <p className="mb-3 flex items-center gap-1.5 text-xs" style={{ color: colors.text + "70" }}>
        <MapPin className="h-3.5 w-3.5" style={{ color: colors.primary }} />
        {property.location}
      </p>

      {/* Features */}
      {property.type !== "terreno" ? (
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { icon: Bed, val: `${property.bedrooms} Quartos` },
            { icon: Bath, val: `${property.bathrooms} Banh.` },
            { icon: Car, val: `${property.parking} Vagas` },
            { icon: Maximize, val: property.area },
          ].map(({ icon: Icon, val }, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[11px] font-display font-medium"
              style={{ color: colors.text + "66" }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: colors.primary + "bb" }} />
              {val}
            </span>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <span className="flex items-center gap-1 text-[11px] font-display font-medium" style={{ color: colors.text + "66" }}>
            <Maximize className="h-3.5 w-3.5" style={{ color: colors.primary + "bb" }} />
            {property.area}
          </span>
        </div>
      )}

      {/* Price — highlighted */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ backgroundColor: colors.primary + "0c" }}
      >
        <span className="text-[10px] font-display font-semibold uppercase tracking-widest" style={{ color: colors.text + "55" }}>
          Valor
        </span>
        <span className="font-display text-xl font-black" style={{ color: colors.primary }}>
          {property.price}
        </span>
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel7;
