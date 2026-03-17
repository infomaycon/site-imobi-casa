import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, Hash, ChefHat, Waves, Mountain, Fence, Gem, MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
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
 * Modelo 7 — Galeria Clean Expandida
 * Card branco sobreposto à imagem, bordas arredondadas, sombra leve,
 * grid de imagens com lightbox, ícones verdes, preço em destaque.
 */
const PropertyGalleryModel7 = ({
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

  // Preload next images
  useEffect(() => {
    images.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < images.length) setActiveIndex(i);
  }, [images.length]);

  // Keyboard nav for lightbox
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

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-display font-semibold transition-opacity hover:opacity-70"
          style={{ color: colors.text + "88" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>

        {/* ── Hero: Image + Floating Card ── */}
        <div className="relative mb-10">
          {/* Main image */}
          <motion.div
            className="relative h-[50vh] md:h-[65vh] overflow-hidden rounded-[24px]"
            style={{ boxShadow: `0 12px 40px ${colors.text}12` }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </AnimatePresence>

            {/* Nav arrows on image */}
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

            {/* Diagonal separator */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="block w-full h-12 md:h-16">
                <polygon points="0,80 1200,20 1200,80" fill={colors.bg} />
              </svg>
            </div>
          </motion.div>

          {/* ── Floating white card (same style as listing card) ── */}
          <motion.div
            className="relative md:absolute md:bottom-0 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:w-[440px] z-20 rounded-[22px] p-6 md:p-7 -mt-12 md:mt-0 md:-mb-10"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.text}10`,
              boxShadow: `0 20px 60px ${colors.text}18`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Type badge + code */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider"
                style={{ backgroundColor: colors.primary, color: "#fff" }}
              >
                {property.type}
              </span>
              <span
                className="inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[10px] font-display font-semibold"
                style={{ backgroundColor: colors.text + "08", color: colors.text + "60" }}
              >
                <Hash className="h-2.5 w-2.5" />
                {property.id}
              </span>
            </div>

            <h1 className="font-display font-bold text-xl md:text-2xl leading-tight mb-2" style={{ color: colors.text }}>
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm mb-4" style={{ color: colors.text + "70" }}>
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
              {property.location}
            </p>

            {/* Price — prominent */}
            <div
              className="flex items-center justify-between rounded-xl px-5 py-3 mb-4"
              style={{ backgroundColor: colors.primary + "0c" }}
            >
              <span className="text-[10px] font-display font-semibold uppercase tracking-widest" style={{ color: colors.text + "55" }}>Valor</span>
              <span className="font-display text-2xl font-black" style={{ color: colors.primary }}>{property.price}</span>
            </div>

            {/* Features */}
            {property.type !== "terreno" ? (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[
                  { icon: Bed, val: `${property.bedrooms} Quartos` },
                  { icon: Bath, val: `${property.bathrooms} Banh.` },
                  { icon: Car, val: `${property.parking} Vagas` },
                  { icon: Maximize, val: property.area },
                ].map(({ icon: Icon, val }, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-display font-medium" style={{ color: colors.text + "66" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                    {val}
                  </span>
                ))}
              </div>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-display font-medium" style={{ color: colors.text + "66" }}>
                <Maximize className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                {property.area}
              </span>
            )}
          </motion.div>
        </div>

        {/* ── Image Grid Gallery ── */}
        <div className="mt-16 md:mt-20">
          <h3 className="font-display font-bold text-lg mb-5" style={{ color: colors.text }}>Galeria de Fotos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]"
                style={{ boxShadow: `0 4px 16px ${colors.text}08` }}
                whileHover={{ y: -4, boxShadow: `0 12px 32px ${colors.text}16` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <img
                  src={img}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {i === activeIndex && (
                  <div className="absolute inset-0 rounded-2xl ring-2" style={{ boxShadow: `inset 0 0 0 3px ${colors.primary}` }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Description & Features ── */}
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
            <a
              href="https://wa.me/5511999990000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}
            >
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
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
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

export default PropertyGalleryModel7;
