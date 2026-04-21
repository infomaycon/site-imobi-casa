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
    className="group relative h-[430px] cursor-pointer overflow-hidden rounded-[30px]"
    style={{ boxShadow: `0 18px 46px ${colors.text}18` }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, boxShadow: `0 30px 70px ${colors.text}24` }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.3 }}
  >
    <img
      src={propertyImages[property.image - 1]}
      alt={property.title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.text}18 0%, transparent 35%, ${colors.text}88 100%)` }} />

    <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3">
      <span
        className="rounded-full px-3 py-1.5 text-[11px] font-display font-bold uppercase tracking-[0.16em]"
        style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        {property.type}
      </span>
      <span
        className="rounded-full px-3 py-1.5 text-sm font-display font-black"
        style={{ backgroundColor: colors.primary + "d9", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        {property.price}
      </span>
    </div>

    <div className="absolute inset-x-4 bottom-4 z-10">
      <div
        className="rounded-[24px] p-5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
        }}
      >
        <h3 className="font-display text-lg font-black leading-tight text-white">
          {property.title}
        </h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-white/78">
          <MapPin className="h-4 w-4" />
          {property.location}
        </p>

        {property.type !== "terreno" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: Bed, label: `${property.bedrooms} quartos` },
              { icon: Bath, label: `${property.bathrooms} banheiros` },
              { icon: Car, label: `${property.parking} vagas` },
              { icon: Maximize, label: property.area },
            ].map(({ icon: Icon, label }, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-display font-semibold text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <span
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-display font-semibold text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              <Maximize className="h-3.5 w-3.5" />
              {property.area}
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel8;
