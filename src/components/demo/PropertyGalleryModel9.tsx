import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
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
 * Modelo 9 — Galeria Card Flutuante Moderna
 * Imagem grande + card branco flutuante (mesmo estilo da listagem),
 * carrossel horizontal abaixo, badges verdes, transições fade+slide.
 */
const PropertyGalleryModel9 = ({
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Preload
  useEffect(() => { images.forEach((s) => { const img = new Image(); img.src = s; }); }, []);

  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < images.length) setActiveIndex(i);
  }, [images.length]);

  // Auto-scroll carousel to active
  useEffect(() => {
    if (carouselRef.current) {
      const child = carouselRef.current.children[activeIndex] as HTMLElement;
      if (child) child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  // Keyboard for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((p) => Math.min((p ?? 0) + 1, images.length - 1));
      if (e.key === "ArrowLeft") setLightbox((p) => Math.max((p ?? 0) - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  // Swipe on main image
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

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm font-display font-semibold transition-opacity hover:opacity-70" style={{ color: colors.text + "88" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>

        {/* ── Hero: Large image + floating card ── */}
        <div className="relative pb-16">
          {/* Main image */}
          <motion.div
            className="relative h-[50vh] md:h-[65vh] overflow-hidden rounded-[30px]"
            style={{ boxShadow: `0 20px 44px ${colors.text}14` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            </AnimatePresence>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, ${colors.text}44 72%, ${colors.text}55 100%)` }} />

            {/* Type badge */}
            <div className="absolute left-5 top-5 z-10">
              <span className="rounded-full px-3 py-1.5 text-[11px] font-display font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                {property.type}
              </span>
            </div>

            {/* Nav arrows */}
            {activeIndex > 0 && (
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.bg + "cc", color: colors.text }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {activeIndex < images.length - 1 && (
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.bg + "cc", color: colors.text }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Counter */}
            <div className="absolute top-5 right-5 z-10 rounded-full px-3 py-1 text-xs font-display font-semibold text-white/80" style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>

          {/* ── Floating white card (matching card style) ── */}
          <motion.div
            className="absolute bottom-0 left-1/2 z-10 w-[90%] md:w-[70%] -translate-x-1/2 rounded-[26px] p-6 md:p-7"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.text}10`,
              boxShadow: `0 20px 50px ${colors.text}16`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="font-display text-xl md:text-2xl font-black leading-tight" style={{ color: colors.text }}>
                  {property.title}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-sm" style={{ color: colors.text + "70" }}>
                  <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                  {property.location}
                </p>
              </div>
              <p className="shrink-0 font-display text-2xl font-black" style={{ color: colors.primary }}>
                {property.price}
              </p>
            </div>

            {property.type !== "terreno" ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: Bed, label: `${property.bedrooms} quartos` },
                  { icon: Bath, label: `${property.bathrooms} banheiros` },
                  { icon: Car, label: `${property.parking} vagas` },
                  { icon: Maximize, label: property.area },
                ].map(({ icon: Icon, label }, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-display font-semibold"
                    style={{ backgroundColor: colors.primary + "10", color: colors.text + "88" }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-display font-semibold mt-4" style={{ backgroundColor: colors.primary + "10", color: colors.text + "88" }}>
                <Maximize className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                {property.area}
              </span>
            )}
          </motion.div>
        </div>

        {/* ── Horizontal carousel ── */}
        <div className="mt-10">
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: colors.text }}>Galeria</h3>
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
          >
            {images.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => { setActiveIndex(i); }}
                onDoubleClick={() => setLightbox(i)}
                className="shrink-0 snap-center relative overflow-hidden rounded-2xl"
                style={{
                  width: 200,
                  height: 140,
                  boxShadow: i === activeIndex ? `0 8px 28px ${colors.primary}30` : `0 4px 12px ${colors.text}08`,
                  border: i === activeIndex ? `3px solid ${colors.primary}` : `3px solid transparent`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {i !== activeIndex && <div className="absolute inset-0 bg-black/20" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Description & Contact ── */}
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
              <p className="leading-relaxed text-sm" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => {
                  const Icon = featureIconMap[f] || Gem;
                  return (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border" style={{ borderColor: colors.primary + "30", color: colors.primary }}>
                      <Icon className="w-4 h-4" /> {f}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <div className="p-6 rounded-2xl border" style={{ borderColor: colors.text + "12", backgroundColor: colors.text + "02" }}>
              <h4 className="font-display font-bold text-sm mb-4" style={{ color: colors.primary }}>Formulário de Interesse</h4>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nome" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text }} />
                <input type="email" placeholder="E-mail" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text }} />
                <input type="tel" placeholder="Telefone" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ backgroundColor: colors.bg, borderColor: colors.text + "15", color: colors.text }} />
                <button type="submit" className="w-full py-3 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                  Tenho Interesse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLightbox(null)} />
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm font-display">{(lightbox ?? 0) + 1} / {images.length}</div>
            {lightbox > 0 && (
              <button onClick={() => setLightbox(lightbox - 1)} className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {lightbox < images.length - 1 && (
              <button onClick={() => setLightbox(lightbox + 1)} className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20 py-16">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightbox}
                  src={images[lightbox]}
                  alt=""
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertyGalleryModel9;
