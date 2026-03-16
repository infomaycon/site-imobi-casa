import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";
import ImageLightbox from "./ImageLightbox";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

const featureIcon = (f: string) => {
  const map: Record<string, any> = {
    "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
    Varanda: Fence, "Acabamento Premium": Gem,
  };
  const Icon = map[f] || Gem;
  return <Icon className="w-4 h-4" />;
};

const PropertyGalleryModel5 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const [mainIndex, setMainIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const galleryImages = Array.from({ length: 6 }, (_, i) =>
    propertyImages[(property.image - 1 + i) % 6]
  );

  const goTo = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    setDirection(newIndex > mainIndex ? 1 : -1);
    setMainIndex(newIndex);
  }, [mainIndex, galleryImages.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.min(mainIndex + 1, galleryImages.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(mainIndex - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mainIndex, goTo, galleryImages.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRef.current) {
      const active = thumbnailRef.current.children[mainIndex] as HTMLElement;
      active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [mainIndex]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && mainIndex < galleryImages.length - 1) goTo(mainIndex + 1);
      if (diff > 0 && mainIndex > 0) goTo(mainIndex - 1);
    }
    setTouchStart(null);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="pb-16">
      <div className="container mx-auto px-6 max-w-6xl pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-display font-semibold transition-opacity hover:opacity-80"
          style={{ color: colors.text + "88" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>
      </div>

      {/* Cinematic Gallery */}
      <div className="relative w-full mb-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div
            className="relative w-full overflow-hidden cursor-pointer"
            style={{ maxHeight: "75vh" }}
            onClick={() => setLightboxIndex(mainIndex)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Cinematic image with slow zoom */}
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={mainIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full flex items-center justify-center"
              >
                <motion.img
                  src={galleryImages[mainIndex]}
                  alt={property.title}
                  className="w-full h-auto max-h-[75vh] object-contain select-none"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.04 }}
                  transition={{ duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Cinematic overlay gradients */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/30 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/30 to-transparent" />
            </div>

            {/* Counter - top right */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-xs font-display tracking-wider">
              {mainIndex + 1} / {galleryImages.length}
            </div>

            {/* Title overlay - bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10 pointer-events-none">
              <span
                className="inline-block px-4 py-1.5 rounded-lg text-xs font-display font-bold capitalize mb-3"
                style={{ backgroundColor: colors.primary, color: "#fff" }}
              >
                {property.type}
              </span>
              <h1 className="font-display font-black text-2xl md:text-4xl lg:text-5xl text-white mb-2 drop-shadow-lg">
                {property.title}
              </h1>
              <p className="text-white/85 flex items-center gap-1.5 text-sm drop-shadow">
                <MapPin className="w-4 h-4" /> {property.location}
              </p>
            </div>

            {/* Navigation arrows - elegant minimal */}
            {mainIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goTo(mainIndex - 1); }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:bg-white/25 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {mainIndex < galleryImages.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goTo(mainIndex + 1); }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:bg-white/25 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="container mx-auto px-6 max-w-6xl mb-12">
        <div ref={thumbnailRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-500 group"
              style={{
                width: i === mainIndex ? "6rem" : "4.5rem",
                height: i === mainIndex ? "4rem" : "3rem",
                border: i === mainIndex ? `2px solid ${colors.primary}` : "2px solid transparent",
                opacity: i === mainIndex ? 1 : 0.5,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {i === mainIndex && (
                <div className="absolute inset-0 rounded-lg" style={{ boxShadow: `0 0 12px ${colors.primary}44` }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Property info */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="font-display font-black text-3xl" style={{ color: colors.primary }}>
            {property.price}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {property.type !== "terreno" && (
              <div className="flex flex-wrap gap-6 py-4 border-y" style={{ borderColor: colors.text + "12" }}>
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" style={{ color: colors.primary }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: colors.text + "55" }}>{item.label}</p>
                      <p className="font-display font-bold text-sm" style={{ color: colors.text }}>{String(item.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.text }}>Sobre o Imóvel</h3>
              <p className="leading-relaxed font-body" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.text }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                    style={{ backgroundColor: colors.primary + "10", color: colors.primary }}
                  >
                    {featureIcon(f)} {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="https://wa.me/5511999990000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}
            >
              WhatsApp
            </a>
            <button
              className="w-full py-3 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              Tenho Interesse
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={galleryImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertyGalleryModel5;
