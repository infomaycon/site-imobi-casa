import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from "lucide-react";
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
}) => {
  const features = property.type !== "terreno"
    ? [
        { icon: Maximize, value: property.area },
        { icon: Bed, value: String(property.bedrooms) },
        { icon: Car, value: String(property.parking) },
        { icon: Bath, value: String(property.bathrooms) },
      ]
    : [{ icon: Maximize, value: property.area }];

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-xl"
      style={{ boxShadow: `0 6px 22px ${colors.text}14` }}
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: `0 14px 36px ${colors.text}20` }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.28 }}
    >
      <div className="relative h-[240px] sm:h-[260px] lg:h-[230px] overflow-hidden bg-white">
        <img
          src={propertyImages[property.image - 1]}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-y-3 right-3 left-[42%] sm:left-[44%] md:left-[45%] lg:left-[42%]">
          <div
            className="absolute inset-0 rounded-none bg-white"
            style={{
              clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)",
              boxShadow: `0 0 0 1px ${colors.text}10`,
            }}
          />

          <div
            className="absolute left-[18%] top-0 h-full w-[3px]"
            style={{
              backgroundColor: colors.primary,
              transform: "skewX(-20deg)",
              transformOrigin: "top",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between pl-[24%] pr-4 py-4 sm:pr-5">
            <div>
              <h3 className="font-display text-[14px] font-semibold leading-tight sm:text-[15px]" style={{ color: colors.text }}>
                {property.type === "apartamento" ? "Apartamento - Venda" : property.type === "casa" ? "Casa - Venda" : "Terreno - Venda"}
              </h3>
              <p className="mt-1 text-[12px] leading-tight sm:text-[13px]" style={{ color: colors.text + "dd" }}>
                {property.location}
              </p>
              <p className="mt-1 text-[12px] font-display font-bold" style={{ color: colors.text }}>
                Cod: APART{property.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-[12px]" style={{ color: colors.text + "dd" }}>
              {features.map(({ icon: Icon, value }, index) => (
                <span key={index} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: colors.primary }} />
                  {value}
                </span>
              ))}
            </div>

            <div className="flex items-stretch overflow-hidden">
              <div className="flex flex-1 items-center px-3 py-3 font-display text-[14px] font-black text-white sm:text-[15px]" style={{ backgroundColor: colors.primary }}>
                {property.price}
              </div>
              <div className="flex items-center justify-center px-4 text-white" style={{ backgroundColor: colors.text }}>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCardModel7;
