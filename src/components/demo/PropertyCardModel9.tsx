import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.webp";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import property5 from "@/assets/property-5.webp";
import property6 from "@/assets/property-6.webp";

const propertyImages = [property1, property2, property3, property4, property5, property6];

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
    className="group relative cursor-pointer h-[460px]"
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.3 }}
  >
    <div
      className="relative h-[330px] overflow-hidden rounded-[30px]"
      style={{ boxShadow: `0 20px 44px ${colors.text}14` }}
    >
      <img
        src={propertyImages[property.image - 1]}
        alt={property.title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, ${colors.text}44 72%, ${colors.text}55 100%)` }} />

      <div className="absolute left-5 top-5 z-10">
        <span
          className="rounded-full px-3 py-1.5 text-[11px] font-display font-bold uppercase tracking-[0.16em]"
          style={{ backgroundColor: colors.primary, color: "#fff" }}
        >
          {property.type}
        </span>
      </div>
    </div>

    <div
      className="absolute bottom-0 left-1/2 z-10 w-[86%] -translate-x-1/2 rounded-[26px] p-5"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.text}10`,
        boxShadow: `0 20px 50px ${colors.text}16`,
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-black leading-tight" style={{ color: colors.text }}>
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: colors.text + "70" }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: colors.primary }} />
            {property.location}
          </p>
        </div>
        <p className="shrink-0 text-right font-display text-xl font-black" style={{ color: colors.primary }}>
          {property.price}
        </p>
      </div>

      {property.type !== "terreno" ? (
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Bed, label: `${property.bedrooms} qt` },
            { icon: Bath, label: `${property.bathrooms} ban` },
            { icon: Car, label: `${property.parking} vg` },
            { icon: Maximize, label: property.area },
          ].map(({ icon: Icon, label }, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-display font-semibold"
              style={{ backgroundColor: colors.primary + "10", color: colors.text + "88" }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {label}
            </span>
          ))}
        </div>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-display font-semibold"
          style={{ backgroundColor: colors.primary + "10", color: colors.text + "88" }}
        >
          <Maximize className="h-3.5 w-3.5" style={{ color: colors.primary }} />
          {property.area}
        </span>
      )}
    </div>
  </motion.div>
);

export default PropertyCardModel9;
