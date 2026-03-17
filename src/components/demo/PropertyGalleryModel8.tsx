import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

const featureIconMap: Record<string, any> = {
  "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
  Varanda: Fence, "Acabamento Premium": Gem,
};

/**
 * Modelo 8 — Galeria Glass Luxo
 * Full-screen image, dark overlay + glassmorphism, slider horizontal,
 * miniaturas com transparência, preço em badge vermelho no topo.
 */
const PropertyGalleryModel8 = ({
  property,
  colors,
  onBack,
}: {
  property: Property;
  colors: DemoModel["colors"];
  onBack: () => void;
}) => {
  const images = Array.from({ length: 6 }, (_, i) => propertyImages[(property.image - 1 + i) % 6]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Preload
  useEffect(() => { images.forEach((s) => { const img = new Image(); img.src = s; }); }, []);

  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= images.length) return;
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
  }, [activeIndex, images.length]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.min(activeIndex + 1, images.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo, images.length]);

  // Swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && activeIndex < images.length - 1) goTo(activeIndex + 1);
      if (diff > 0 && activeIndex > 0) goTo(activeIndex - 1);
    }
    setTouchStart(null);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 600 : -600, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -600 : 600, opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      {/* ── Full-screen hero with glass overlay ── */}
      <div className="relative h-screen overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Background blur layer */}
        <div className="absolute inset-0">
          <img src={images[activeIndex]} alt="" className="w-full h-full object-cover scale-110 blur-xl opacity-40" />
        </div>

        {/* Main image slider */}
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-16">
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={property.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold text-white/80 transition-colors hover:text-white"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {/* Price badge — top right (red) */}
        <div
          className="absolute top-6 right-6 z-20 rounded-full px-5 py-2 font-display font-black text-lg text-white"
          style={{
            backgroundColor: colors.primary + "dd",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 8px 32px ${colors.primary}44`,
          }}
        >
          {property.price}
        </div>

        {/* Counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-white/50 text-sm font-display">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Navigation arrows */}
        {activeIndex > 0 && (
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {activeIndex < images.length - 1 && (
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* ── Glass info panel (bottom) ── */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 md:p-8">
          <div
            className="max-w-5xl mx-auto rounded-[24px] p-5 md:p-7"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  {property.type}
                </span>
                <h1 className="font-display font-black text-2xl md:text-3xl text-white leading-tight">{property.title}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
                  <MapPin className="w-4 h-4" /> {property.location}
                </p>
              </div>
              {property.type !== "terreno" && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Bed, label: `${property.bedrooms} quartos` },
                    { icon: Bath, label: `${property.bathrooms} banheiros` },
                    { icon: Car, label: `${property.parking} vagas` },
                    { icon: Maximize, label: property.area },
                  ].map(({ icon: Icon, label }, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-display font-semibold text-white"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails strip */}
            <div ref={thumbsRef} className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  className="shrink-0 rounded-xl overflow-hidden"
                  style={{
                    width: 72,
                    height: 52,
                    opacity: i === activeIndex ? 1 : 0.4,
                    border: i === activeIndex ? `2px solid ${colors.primary}` : "2px solid transparent",
                  }}
                  whileHover={{ opacity: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Description section (dark bg) ── */}
      <div className="py-16" style={{ backgroundColor: "#111" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
                <p className="leading-relaxed text-sm text-white/60">{property.description}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Diferenciais</h3>
                <div className="flex flex-wrap gap-3">
                  {property.features.map((f, i) => {
                    const Icon = featureIconMap[f] || Gem;
                    return (
                      <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/70" style={{ border: `1px solid ${colors.primary}40` }}>
                        <Icon className="w-4 h-4" style={{ color: colors.primary }} /> {f}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <a
                href="https://wa.me/5511999990000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
                style={{ backgroundColor: "#25d366", color: "#fff" }}
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h4 className="font-display font-bold text-sm mb-4" style={{ color: colors.primary }}>Formulário de Interesse</h4>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  {["Nome", "E-mail", "Telefone"].map((ph) => (
                    <input
                      key={ph}
                      type="text"
                      placeholder={ph}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none text-white/80"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                  <button type="submit" className="w-full py-3 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                    Tenho Interesse
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyGalleryModel8;
