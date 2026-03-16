import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

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

/**
 * Modelo 4 — Galeria Fullscreen com hero image, modo tela cheia, miniaturas e navegação completa.
 */
const PropertyGalleryModel4 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const galleryImages = Array.from({ length: 6 }, (_, i) =>
    propertyImages[(property.image - 1 + i) % 6]
  );

  const goTo = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  }, [currentIndex, galleryImages.length]);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") goTo(Math.min(currentIndex + 1, galleryImages.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(currentIndex - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, currentIndex, goTo, galleryImages.length]);

  // Swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 500 : -500, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -500 : 500, opacity: 0 }),
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-sm font-display font-semibold transition-opacity hover:opacity-80"
          style={{ color: colors.text + "88" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>

        {/* Property header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-display font-bold capitalize"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
            >
              {property.type}
            </span>
            <span className="font-display font-black text-2xl" style={{ color: colors.primary }}>
              {property.price}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2" style={{ color: colors.text }}>
            {property.title}
          </h1>
          <p className="text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}>
            <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            {property.location}
          </p>
        </div>

        {/* Hero image with "Ver todas as fotos" */}
        <div
          className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group mb-12"
          onClick={() => { setCurrentIndex(0); setFullscreen(true); }}
        >
          <img
            src={galleryImages[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <button
            className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-bold text-white backdrop-blur-md transition-all hover:scale-105"
            style={{ backgroundColor: colors.primary + "dd" }}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(0); setFullscreen(true); }}
          >
            <Camera className="w-4 h-4" />
            Ver todas as fotos ({galleryImages.length})
          </button>
          {/* Small preview thumbnails */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            {galleryImages.slice(1, 4).map((img, i) => (
              <div
                key={i}
                className="w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 border-white/40 cursor-pointer hover:border-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i + 1); setFullscreen(true); }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Property details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {property.type !== "terreno" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.primary + "08", border: `1px solid ${colors.primary}15` }}
                  >
                    <item.icon className="w-5 h-5 mb-2" style={{ color: colors.primary }} />
                    <p className="text-xs" style={{ color: colors.text + "66" }}>{item.label}</p>
                    <p className="font-display font-bold text-sm" style={{ color: colors.text }}>{String(item.value)}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
              <p className="leading-relaxed font-body" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border"
                    style={{ borderColor: colors.primary + "30", color: colors.primary }}
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

      {/* ============ FULLSCREEN GALLERY ============ */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: "#0a0a0a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-white/60 text-sm font-display">
                {currentIndex + 1} / {galleryImages.length}
              </span>
              <button
                onClick={() => setFullscreen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main image area */}
            <div
              className="flex-1 relative flex items-center justify-center px-4 md:px-20 overflow-hidden"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStart === null) return;
                const diff = e.changedTouches[0].clientX - touchStart;
                if (Math.abs(diff) > 50) {
                  if (diff < 0 && currentIndex < galleryImages.length - 1) goTo(currentIndex + 1);
                  if (diff > 0 && currentIndex > 0) goTo(currentIndex - 1);
                }
                setTouchStart(null);
              }}
            >
              {/* Arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={() => goTo(currentIndex - 1)}
                  className="absolute left-3 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentIndex < galleryImages.length - 1 && (
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  className="absolute right-3 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={currentIndex}
                  src={galleryImages[currentIndex]}
                  alt=""
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnails bar */}
            <div className="py-4 px-6 overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-max mx-auto">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
                    style={{
                      border: i === currentIndex ? `2px solid ${colors.primary}` : "2px solid transparent",
                      opacity: i === currentIndex ? 1 : 0.5,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertyGalleryModel4;
