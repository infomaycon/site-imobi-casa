import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, DemoModel } from "@/data/models";

import property1 from "@/assets/property-1.webp";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import property5 from "@/assets/property-5.webp";
import property6 from "@/assets/property-6.webp";

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
      {/* Back button */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold text-white/80 transition-colors hover:text-white"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      {/* ── Main layout: Info Left + Image Right ── */}
      <div className="relative h-screen flex flex-col md:flex-row">
        {/* Background blur */}
        <div className="absolute inset-0 z-0">
          <img src={images[activeIndex]} alt="" className="w-full h-full object-cover scale-110 blur-xl opacity-30" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* ── LEFT: Fixed info panel ── */}
        <div className="relative z-10 w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col justify-center p-6 md:p-8 overflow-y-auto">
          <div
            className="rounded-[24px] p-6"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
            }}
          >
            {/* Price badge */}
            <div
              className="inline-block rounded-full px-4 py-1.5 font-display font-black text-lg text-white mb-4"
              style={{
                backgroundColor: colors.primary + "dd",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: `0 8px 32px ${colors.primary}44`,
              }}
            >
              {property.price}
            </div>

            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider mb-2 ml-2"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {property.type}
            </span>

            <h1 className="font-display font-black text-xl md:text-2xl text-white leading-tight mt-3">{property.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="w-4 h-4" /> {property.location}
            </p>

            {property.type !== "terreno" && (
              <div className="flex flex-wrap gap-2 mt-5">
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

            {/* Thumbnails */}
            <div ref={thumbsRef} className="flex flex-wrap gap-2 mt-5">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  className="shrink-0 rounded-xl overflow-hidden"
                  style={{
                    width: 56,
                    height: 42,
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

            {/* Counter */}
            <div className="mt-3 text-white/40 text-xs font-display text-center">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Image area ── */}
        <div
          className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={property.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Nav arrows */}
          {activeIndex > 0 && (
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
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
