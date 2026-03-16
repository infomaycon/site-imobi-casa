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
 * Modelo 8 — Card Glass Overlay (Glassmorphism)
 * Imagem full + caixa translúcida com blur sobre a imagem.
 */
const PropertyCardModel8 = ({
  property,
  colors,
  onSelect,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onSelect: () => void;
}) => (
  <motion.div
    className="relative rounded-2xl overflow-hidden cursor-pointer group h-[400px]"
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
    {/* Full background image with hover zoom */}
    <img
      src={propertyImages[property.image - 1]}
      alt={property.title}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
    />

    {/* Subtle dark overlay for contrast */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

    {/* Type badge */}
    <div className="absolute top-4 right-4 z-10">
      <span
        className="px-3 py-1.5 rounded-full text-[11px] font-display font-bold capitalize backdrop-blur-md"
        style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
      >
        {property.type}
      </span>
    </div>

    {/* Price badge top left */}
    <div className="absolute top-4 left-4 z-10">
      <span
        className="px-3 py-1.5 rounded-lg text-sm font-display font-black backdrop-blur-md"
        style={{ backgroundColor: colors.primary + "cc", color: "#fff" }}
      >
        {property.price}
      </span>
    </div>

    {/* Glass info box at bottom */}
    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
      <div
        className="rounded-xl p-4 space-y-2"
        style={{
          backgroundColor: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h3 className="font-display font-bold text-sm leading-tight text-white drop-shadow-sm">
          {property.title}
        </h3>
        <p className="text-xs flex items-center gap-1 text-white/70">
          <MapPin className="w-3 h-3" />
          {property.location}
        </p>

        {property.type !== "terreno" ? (
          <div className="flex items-center gap-4 pt-1">
            {[
              { icon: Bed, val: property.bedrooms },
              { icon: Bath, val: property.bathrooms },
              { icon: Car, val: property.parking },
              { icon: Maximize, val: property.area },
            ].map(({ icon: Icon, val }, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-white/70">
                <Icon className="w-3.5 h-3.5" /> {val}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 pt-1 text-[11px] text-white/70">
            <Maximize className="w-3.5 h-3.5" /> {property.area}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel8;
