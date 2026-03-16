import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { properties, type Property, type DemoModel } from "@/data/models";
import ModelLogo from "./ModelLogo";
import ModelFooter from "./ModelFooter";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle, ChevronLeft, ChevronRight, Award, TrendingUp, Users } from "lucide-react";
import { getSearchFilter } from "@/components/demo/SearchFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import bannerImg from "@/assets/banner-model1.jpg";
import brokerPhoto from "@/assets/broker-photo.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

type DemoPage = "home" | "listing" | "property" | "about" | "contact";

const featureIcon = (f: string) => {
  const map: Record<string, any> = {
    "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
    Varanda: Fence, "Acabamento Premium": Gem,
  };
  const Icon = map[f] || Gem;
  return <Icon className="w-4 h-4" />;
};

const DemoSiteModel1 = ({ model }: { model: DemoModel }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const c = model.colors;

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (selectedProperty) window.scrollTo({ top: 0, behavior: "smooth" }); }, [selectedProperty]);


  const filtered = filter === "todos" ? properties : properties.filter((p) => {
    if (filter === "casas") return p.type === "casa";
    if (filter === "apartamentos") return p.type === "apartamento";
    if (filter === "terrenos") return p.type === "terreno";
    return true;
  });

  const NavLink = ({ label, target }: { label: string; target: DemoPage }) => (
    <button
      onClick={() => { setPage(target); setMobileMenu(false); setSelectedProperty(null); }}
      className="text-sm font-medium tracking-wide uppercase transition-all border-b-2 pb-1"
      style={{
        color: page === target ? c.primary : c.text + "77",
        borderColor: page === target ? c.primary : "transparent",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Back */}
      <div className="fixed top-4 left-4 z-[60]">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-display font-semibold bg-primary text-primary-foreground shadow-lg hover:brightness-110 transition-all">
          <ArrowLeft className="w-3 h-3" /> Voltar
        </button>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: c.bg, borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-3">
            <button onClick={() => { setPage("home"); setSelectedProperty(null); }}>
              <ModelLogo model={model} />
            </button>
          </div>
          <div className="hidden md:flex items-center justify-center gap-8 pb-3">
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Sobre" target="about" />
            <NavLink label="Contato" target="contact" />
          </div>
          <button className="md:hidden absolute right-6 top-4" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: c.text }}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden p-6 space-y-4 border-t flex flex-col items-center" style={{ borderColor: c.text + "12" }}>
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Sobre" target="about" />
            <NavLink label="Contato" target="contact" />
          </div>
        )}
      </nav>

      {/* HOME */}
      {page === "home" && !selectedProperty && (
        <>
          {/* Hero */}
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <motion.div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: c.primary }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
              <motion.h1 className="font-display font-black text-4xl md:text-6xl mb-4 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {model.name}
              </motion.h1>
              <motion.p className="text-lg md:text-xl mb-8 text-white/80 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                "{model.tagline}"
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={() => setPage("listing")} className="px-8 py-3 rounded-none font-display font-bold tracking-wider uppercase text-sm transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Ver Imóveis
                </button>
                <button onClick={() => setPage("contact")} className="px-8 py-3 rounded-none font-display font-semibold tracking-wider uppercase text-sm border-2 text-white transition-all hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.4)" }}>
                  Fale Conosco
                </button>
              </motion.div>
            </div>
          </section>

          {/* Search Filter */}
          {(() => {
            const FilterComponent = getSearchFilter(model.id);
            return FilterComponent ? <FilterComponent colors={c} /> : null;
          })()}

          {/* Properties grid */}
          <section className="py-20">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-12">
                <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.primary }} />
                <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: c.text }}>Imóveis em Destaque</h2>
              </div>
              <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-6 py-2 text-sm font-display font-semibold capitalize transition-all tracking-wide uppercase"
                    style={{
                      backgroundColor: filter === f ? c.primary : "transparent",
                      color: filter === f ? "#fff" : c.text + "66",
                      border: `1px solid ${filter === f ? c.primary : c.text + "20"}`,
                    }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.slice(0, visibleCount).map((p) => (
                  <Model1Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
              {filtered.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((v) => v + 8)}
                    className="px-6 py-2.5 rounded-lg text-sm font-display font-semibold transition-all border hover:opacity-80"
                    style={{ borderColor: c.primary + "40", color: c.primary, backgroundColor: "transparent" }}
                  >
                    Ver mais imóveis
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Sobre o Corretor */}
          <BrokerSection colors={c} modelName={model.name} />

          {/* Entre em Contato */}
          <ContactSection colors={c} modelId={model.id} variant="classic" />
        </>
      )}

      {/* LISTING */}
      {page === "listing" && !selectedProperty && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-8">
               <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.primary }} />
              <h2 className="font-display font-bold text-3xl" style={{ color: c.text }}>Nossos Imóveis</h2>
              <p className="mt-2" style={{ color: c.text + "77" }}>Portfólio exclusivo de imóveis de alto padrão</p>
            </div>
            {(() => {
              const FilterComponent = getSearchFilter(model.id);
              return FilterComponent ? <div className="mb-8"><FilterComponent colors={c} /></div> : null;
            })()}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className="px-6 py-2 text-sm font-display font-semibold capitalize transition-all tracking-wide uppercase"
                  style={{
                    backgroundColor: filter === f ? c.primary : "transparent",
                    color: filter === f ? "#fff" : c.text + "66",
                    border: `1px solid ${filter === f ? c.primary : c.text + "20"}`,
                  }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(0, visibleCount).map((p) => (
                <Model1Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
            {filtered.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((v) => v + 8)}
                  className="px-6 py-2.5 rounded-lg text-sm font-display font-semibold transition-all border hover:opacity-80"
                  style={{ borderColor: c.primary + "40", color: c.primary, backgroundColor: "transparent" }}
                >
                  Ver mais imóveis
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROPERTY DETAIL */}
      {selectedProperty && (
        <Model1Detail property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
      )}

      {/* ABOUT */}
      {page === "about" && !selectedProperty && (
        <>
          <section className="py-24">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.primary }} />
              <h2 className="font-display font-bold text-3xl mb-8 text-center" style={{ color: c.primary }}>Sobre Nós</h2>
              <div className="space-y-6 text-base leading-relaxed" style={{ color: c.text + "aa" }}>
                <p>A <strong style={{ color: c.primary }}>{model.name}</strong> é uma referência no mercado imobiliário urbano de alto padrão. Com anos de experiência e um portfólio exclusivo, oferecemos imóveis que atendem aos mais exigentes padrões de qualidade, localização e sofisticação.</p>
                <p>Nossa equipe de consultores especializados está preparada para oferecer um atendimento personalizado, compreendendo suas necessidades e apresentando as melhores opções do mercado.</p>
              </div>
            </div>
          </section>
          <BrokerSection colors={c} modelName={model.name} />
        </>
      )}

      {/* CONTACT */}
      {page === "contact" && !selectedProperty && (
        <ContactSection colors={c} modelId={model.id} variant="classic" />
      )}

      <ModelFooter model={model} onNavigate={(target) => { setPage(target as any); setSelectedProperty(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
    </div>
  );
};

/* ── Broker Section ── */
const BrokerSection = ({ colors, modelName }: { colors: DemoModel["colors"]; modelName: string }) => (
  <section className="py-20" style={{ backgroundColor: colors.text + "04" }}>
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="text-center mb-12">
        <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: colors.primary }} />
        <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: colors.primary }}>Sobre o Corretor</h2>
      </div>
      <div className="grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-2 flex justify-center">
          <div className="w-64 h-64 overflow-hidden rounded-sm shadow-lg">
            <img src={brokerPhoto} alt="Ricardo Mendes" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <h3 className="font-display font-bold text-2xl" style={{ color: colors.text }}>Ricardo Mendes</h3>
          <p className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>Corretor de Imóveis • CRECI 123.456</p>
          <p className="leading-relaxed" style={{ color: colors.text + "88" }}>
            Com mais de 15 anos de experiência no mercado imobiliário de alto padrão, Ricardo Mendes é especialista em imóveis residenciais e comerciais nas regiões mais valorizadas de São Paulo.
          </p>
          <p className="leading-relaxed" style={{ color: colors.text + "88" }}>
            Reconhecido pela excelência no atendimento e profundo conhecimento do mercado, já intermediou mais de 500 transações imobiliárias, sempre priorizando a satisfação e segurança dos seus clientes.
          </p>
          <div className="flex gap-6 pt-4">
            {[
              { icon: Award, label: "15+ anos de experiência" },
              { icon: TrendingUp, label: "500+ imóveis vendidos" },
              { icon: Users, label: "1000+ clientes atendidos" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: colors.text + "77" }}>
                <item.icon className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── Contact Section ── */
const ContactSection = ({ colors, modelId, variant }: { colors: DemoModel["colors"]; modelId: string; variant: "classic" }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: colors.primary }} />
        <h2 className="font-display font-bold text-3xl mb-3" style={{ color: colors.primary }}>Entre em Contato</h2>
        <p style={{ color: colors.text + "77" }}>Tem interesse em algum imóvel? Envie sua mensagem por e-mail ou WhatsApp.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
           <div className="flex items-center gap-3"><Phone className="w-5 h-5" style={{ color: colors.primary }} /><span>(11) 99999-0000</span></div>
           <div className="flex items-center gap-3"><Mail className="w-5 h-5" style={{ color: colors.primary }} /><span>contato@{modelId}.com.br</span></div>
           <div className="flex items-center gap-3"><MapPin className="w-5 h-5" style={{ color: colors.primary }} /><span>Av. Paulista, 1000 - São Paulo, SP</span></div>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Seu nome completo" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <input type="email" placeholder="seu@email.com" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <input type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <textarea placeholder="Escreva sua mensagem aqui..." rows={4} className="w-full px-4 py-3 border text-sm font-body resize-none" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 py-3 font-display font-bold tracking-wider uppercase text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: "#fff" }}>
              <Mail className="w-4 h-4" /> Enviar por e-mail
            </button>
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-4 h-4" /> Enviar no WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  </section>
);

/* ── Card: Large image on top, info below (classic) ── */
const Model1Card = ({ property, colors, onSelect }: { property: Property; colors: DemoModel["colors"]; onSelect: () => void }) => (
  <motion.div
    className="overflow-hidden cursor-pointer group border"
    style={{ backgroundColor: colors.bg, borderColor: colors.text + "10" }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
  >
    <div className="relative h-64 overflow-hidden">
      <img src={propertyImages[property.image - 1]} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-0 left-0 px-4 py-2 text-xs font-display font-bold uppercase tracking-wider" style={{ backgroundColor: colors.primary, color: "#fff" }}>
        {property.type}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-display font-bold text-lg mb-1" style={{ color: colors.text }}>{property.title}</h3>
      <p className="text-xs mb-4 flex items-center gap-1" style={{ color: colors.text + "66" }}><MapPin className="w-3 h-3" />{property.location}</p>
      <div className="flex items-center justify-between">
        <p className="font-display font-black text-xl" style={{ color: colors.primary }}>{property.price}</p>
        {property.type !== "terreno" && (
          <div className="flex gap-3 text-xs" style={{ color: colors.text + "55" }}>
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms}</span>
            <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms}</span>
            <span className="flex items-center gap-1"><Car className="w-3 h-3" />{property.parking}</span>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.text + "10" }}>
        <span className="text-xs flex items-center gap-1" style={{ color: colors.text + "55" }}><Maximize className="w-3 h-3" />{property.area}</span>
        <span className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>Ver detalhes →</span>
      </div>
    </div>
  </motion.div>
);

/* ── Image Lightbox ── */
const ImageLightbox = ({ images, currentIndex, onClose, onNav }: { images: string[]; currentIndex: number; onClose: () => void; onNav: (i: number) => void }) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-center justify-center"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0 bg-black/85" onClick={onClose} />
    <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
      <X className="w-5 h-5" />
    </button>
    <button onClick={() => onNav(-1)} className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
      <ChevronLeft className="w-6 h-6" />
    </button>
    <button onClick={() => onNav(1)} className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
      <ChevronRight className="w-6 h-6" />
    </button>
    <AnimatePresence mode="wait">
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt=""
        className="relative z-10 max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
    </AnimatePresence>
    <div className="absolute bottom-6 flex gap-2 z-10">
      {images.map((_, i) => (
        <button key={i} onClick={() => onNav(i - currentIndex)} className="w-2.5 h-2.5 rounded-full transition-all" style={{ backgroundColor: i === currentIndex ? "#fff" : "rgba(255,255,255,0.3)" }} />
      ))}
    </div>
  </motion.div>
);

/* ── Detail: Full page with image grid + lightbox ── */
const Model1Detail = ({ property, colors, onBack }: { property: Property; colors: DemoModel["colors"]; onBack: () => void }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const allImages = [0, 1, 2, 3, 4, 5].map((i) => propertyImages[(property.image + i - 1) % 6]);

  const handleNav = useCallback((dir: number) => {
    setLightboxIndex((prev) => prev !== null ? (prev + dir + allImages.length) % allImages.length : null);
  }, [allImages.length]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-display font-semibold uppercase tracking-wider transition-opacity hover:opacity-80" style={{ color: colors.text + "88" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>

        {/* Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          <div className="md:col-span-2 h-[400px] overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(0)}>
            <img src={allImages[0]} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(1)}>
              <img src={allImages[1]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(2)}>
              <img src={allImages[2]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="inline-block px-4 py-1 text-xs font-display font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                {property.type}
              </div>
              <h1 className="font-display font-bold text-3xl mb-2" style={{ color: colors.text }}>{property.title}</h1>
              <p className="text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}><MapPin className="w-4 h-4" />{property.location}</p>
            </div>

            <p className="font-display font-black text-3xl" style={{ color: colors.primary }}>{property.price}</p>

            {property.type !== "terreno" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Maximize, label: "Área", value: property.area },
                  { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms },
                  { icon: Car, label: "Vagas", value: property.parking },
                ].map((item, i) => (
                  <div key={i} className="p-4 border" style={{ borderColor: colors.text + "12" }}>
                    <item.icon className="w-5 h-5 mb-2" style={{ color: colors.primary }} />
                    <p className="text-xs" style={{ color: colors.text + "66" }}>{item.label}</p>
                    <p className="font-display font-bold text-sm">{String(item.value)}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Diferenciais</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 text-sm border" style={{ borderColor: colors.primary + "40", color: colors.primary }}>
                    {featureIcon(f)} {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
              <p className="leading-relaxed" style={{ color: colors.text + "88" }}>{property.description}</p>
            </div>

            {/* Gallery */}
            <div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Galeria</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allImages.map((img, i) => (
                  <div key={i} className="h-40 overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(i)}>
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <div className="p-6 border" style={{ borderColor: colors.text + "12" }}>
              <h4 className="font-display font-bold text-sm mb-4" style={{ color: colors.primary }}>Tenho Interesse</h4>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nome" className="w-full px-3 py-2 border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
                <input type="email" placeholder="E-mail" className="w-full px-3 py-2 border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
                <input type="tel" placeholder="Telefone" className="w-full px-3 py-2 border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
                <button type="submit" className="w-full py-2.5 font-display font-bold text-sm tracking-wider uppercase transition-all hover:brightness-110" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox images={allImages} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={handleNav} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default DemoSiteModel1;
