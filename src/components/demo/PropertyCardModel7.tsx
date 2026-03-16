import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize, ChevronRight, Hash } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

/**
 * Modelo 7 — Card Diagonal Overlay (estilo referência)
 * Imagem à esquerda/topo, caixa de info à direita/baixo com diagonal verde separando.
 */
const PropertyCardModel7 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => {
  const feats = property.type !== "terreno"
    ? [
        { icon: Maximize, val: property.area },
        { icon: Bed, val: String(property.bedrooms) },
        { icon: Car, val: String(property.parking) },
        { icon: Bath, val: String(property.bathrooms) },
      ]
    : [{ icon: Maximize, val: property.area }];

  return (
    <motion.div
      className="group relative grid cursor-pointer overflow-hidden rounded-xl bg-white"
      style={{
        gridTemplateColumns: "1fr 1fr",
        boxShadow: `0 2px 12px ${colors.text}10`,
      }}
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: `0 10px 36px ${colors.text}1c` }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Left: image with diagonal clip ── */}
      <div className="relative h-full min-h-[220px] overflow-hidden">
        <img
          src={propertyImages[property.image - 1]}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Diagonal colored line — sits on top-right edge of the image */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-[6px] origin-top-right"
          style={{
            backgroundColor: colors.primary,
            transform: "skewX(-4deg)",
            zIndex: 2,
          }}
        />

        {/* White diagonal overlap that creates the cut effect */}
        <div
          className="pointer-events-none absolute -right-1 top-0 h-full w-6"
          style={{
            backgroundColor: "#fff",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* ── Right: info panel ── */}
      <div className="relative flex flex-col justify-between p-4 sm:p-5" style={{ backgroundColor: "#fff" }}>
        {/* Type + title + location + code */}
        <div>
          <p className="mb-0.5 text-xs font-display font-bold capitalize" style={{ color: colors.text + "88" }}>
            {property.type} - Venda
          </p>
          <h3 className="font-display text-sm font-bold leading-snug sm:text-[15px]" style={{ color: colors.text }}>
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px]" style={{ color: colors.text + "70" }}>
            <MapPin className="h-3 w-3" style={{ color: colors.primary }} />
            {property.location}
          </p>
          <p className="mt-0.5 flex items-center gap-0.5 text-[11px] font-display font-semibold" style={{ color: colors.primary }}>
            <Hash className="h-3 w-3" />
            Cod: {property.id}
          </p>
        </div>

        {/* Features in 2×2 grid */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {feats.map(({ icon: Icon, val }, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-[12px] font-display font-medium"
              style={{ color: colors.text + "77" }}
            >
              <Icon className="h-4 w-4" style={{ color: colors.primary }} />
              {val}
            </span>
          ))}
        </div>

        {/* Price bar */}
        <div className="mt-4 flex items-center overflow-hidden rounded-lg" style={{ backgroundColor: colors.primary }}>
          <span className="flex-1 px-4 py-2.5 font-display text-sm font-black text-white sm:text-base">
            {property.price}
          </span>
          <span
            className="flex h-full items-center justify-center border-l px-3 py-2.5"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCardModel7;
