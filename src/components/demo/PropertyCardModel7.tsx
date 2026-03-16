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
    className="group relative h-[430px] cursor-pointer overflow-hidden rounded-[28px]"
    style={{ boxShadow: `0 18px 44px ${colors.text}18` }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, boxShadow: `0 28px 60px ${colors.text}22` }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.3 }}
  >
    <img
      src={propertyImages[property.image - 1]}
      alt={property.title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 12%, ${colors.text}22 58%, ${colors.text}66 100%)` }} />

    <div className="absolute left-5 top-5 z-10">
      <span
        className="rounded-full px-3 py-1.5 text-[11px] font-display font-bold uppercase tracking-[0.18em]"
        style={{ backgroundColor: colors.primary, color: "#fff" }}
      >
        {property.type}
      </span>
    </div>

    <div className="absolute inset-x-0 bottom-0 z-10">
      <div className="h-16 w-full" style={{ clipPath: "polygon(0 100%, 100% 8%, 100% 100%)", backgroundColor: colors.bg }} />
      <div className="-mt-px px-5 pb-5 pt-2" style={{ backgroundColor: colors.bg }}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-black leading-tight" style={{ color: colors.text }}>
              {property.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: colors.text + "77" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {property.location}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-display font-bold"
            style={{ backgroundColor: colors.primary + "10", color: colors.primary }}
          >
            <Hash className="h-3 w-3" /> {property.id}
          </span>
        </div>

        {property.type !== "terreno" ? (
          <div className="mb-4 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
            {[
              { icon: Bed, label: `${property.bedrooms} quartos` },
              { icon: Bath, label: `${property.bathrooms} ban.` },
              { icon: Car, label: `${property.parking} vagas` },
              { icon: Maximize, label: property.area },
            ].map(({ icon: Icon, label }, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 font-display font-semibold"
                style={{ backgroundColor: colors.text + "06", color: colors.text + "88" }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-display font-semibold"
              style={{ backgroundColor: colors.text + "06", color: colors.text + "88" }}
            >
              <Maximize className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {property.area}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between gap-4 border-t pt-4" style={{ borderColor: colors.text + "10" }}>
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-[0.18em]" style={{ color: colors.text + "55" }}>
              Valor
            </p>
            <p className="font-display text-2xl font-black" style={{ color: colors.primary }}>
              {property.price}
            </p>
          </div>
          <div className="h-10 w-px" style={{ backgroundColor: colors.primary + "25" }} />
          <p className="max-w-[110px] text-right text-[11px] font-body leading-relaxed" style={{ color: colors.text + "70" }}>
            Overlay diagonal com leitura editorial.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default PropertyCardModel7;
