import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle, ChevronLeft, ChevronRight, Award, TrendingUp, Users } from "lucide-react";
import { getSearchFilter } from "@/components/demo/SearchFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import bannerImg from "@/assets/banner-model2.jpg";
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

/* ── Model 2: Skyline Urban – Light theme, Overlay Gallery ── */
const DemoSiteModel2 = ({ model }: { model: DemoModel }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const c = model.colors;

  const filtered = filter === "todos" ? properties : properties.filter((p) => {
    if (filter === "casas") return p.type === "casa";
    if (filter === "apartamentos") return p.type === "apartamento";
    if (filter === "terrenos") return p.type === "terreno";
    return true;
  });

  const NavLink = ({ label, target }: { label: string; target: DemoPage }) => (
    <button
      onClick={() => { setPage(target); setMobileMenu(false); setSelectedProperty(null); }}
      className="text-sm font-medium transition-colors"
      style={{ color: page === target ? c.primary : c.text + "55" }}
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

      {/* Navbar – light bar */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: c.bg, borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => { setPage("home"); setSelectedProperty(null); }} className="font-display font-bold text-lg tracking-tight" style={{ color: c.primary }}>
            {model.name}
          </button>
          <div className="hidden md:flex items-center gap-8">
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Sobre" target="about" />
            <NavLink label="Contato" target="contact" />
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" style={{ color: c.text }} /> : <Menu className="w-6 h-6" style={{ color: c.text }} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 pb-4 space-y-3">
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
          {/* Hero – full bleed */}
          <section className="relative h-[90vh] flex items-end overflow-hidden">
            <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 px-8 md:px-16 pb-16 max-w-2xl">
              <motion.p className="text-sm font-display tracking-[0.3em] uppercase mb-3 text-white/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Exclusividade
              </motion.p>
              <motion.h1 className="font-display font-black text-4xl md:text-6xl mb-4 text-white leading-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                {model.tagline}
              </motion.h1>
              <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <button onClick={() => setPage("listing")} className="px-8 py-3 rounded-full font-display font-bold text-sm text-black transition-all hover:brightness-90" style={{ backgroundColor: "#fff" }}>
                  Explorar Imóveis
                </button>
                <button onClick={() => setPage("contact")} className="px-8 py-3 rounded-full font-display font-semibold text-sm text-white border border-white/30 transition-all hover:bg-white/10">
                  Contato
                </button>
              </motion.div>
            </div>
          </section>

          {/* Search Filter */}
          {(() => {
            const FilterComponent = getSearchFilter(model.id);
            return FilterComponent ? <FilterComponent colors={c} /> : null;
          })()}

          {/* Properties */}
          <section className="py-20">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2" style={{ color: c.text }}>Destaques</h2>
              <p className="mb-8" style={{ color: c.text + "55" }}>Os melhores imóveis selecionados para você</p>
              <div className="flex gap-3 mb-10 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-5 py-2 rounded-full text-sm font-display font-semibold capitalize transition-all"
                    style={{
                      backgroundColor: filter === f ? c.primary : c.text + "08",
                      color: filter === f ? "#fff" : c.text + "66",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.slice(0, visibleCount).map((p) => (
                  <Model2Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
              {filtered.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <button onClick={() => setVisibleCount((v) => v + 12)} className="px-8 py-3 rounded-full text-sm font-display font-bold transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>Ver mais imóveis</button>
                </div>
              )}
            </div>
          </section>

          {/* Sobre o Corretor */}
          <BrokerSection2 colors={c} />

          {/* Entre em Contato */}
          <ContactSection2 colors={c} modelId={model.id} />
        </>
      )}

      {/* LISTING */}
      {page === "listing" && !selectedProperty && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-display font-bold text-3xl mb-2" style={{ color: c.text }}>Todos os Imóveis</h2>
            <p className="mb-8" style={{ color: c.text + "55" }}>Explore nosso portfólio completo</p>
            {(() => {
              const FilterComponent = getSearchFilter(model.id);
              return FilterComponent ? <div className="mb-8"><FilterComponent colors={c} /></div> : null;
            })()}
            <div className="flex gap-3 mb-10 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className="px-5 py-2 rounded-full text-sm font-display font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: filter === f ? c.primary : c.text + "08",
                    color: filter === f ? "#fff" : c.text + "66",
                  }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.slice(0, visibleCount).map((p) => (
                <Model2Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
            {filtered.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setVisibleCount((v) => v + 12)} className="px-8 py-3 rounded-full text-sm font-display font-bold transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>Ver mais imóveis</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* OVERLAY GALLERY */}
      <AnimatePresence>
        {selectedProperty && (
          <Model2Overlay property={selectedProperty} colors={c} onClose={() => setSelectedProperty(null)} />
        )}
      </AnimatePresence>

      {/* ABOUT */}
      {page === "about" && !selectedProperty && (
        <>
          <section className="py-24">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="font-display font-bold text-3xl mb-8" style={{ color: c.text }}>Sobre</h2>
              <div className="space-y-6 text-base leading-relaxed" style={{ color: c.text + "aa" }}>
                <p>A <strong style={{ color: c.text }}>{model.name}</strong> é referência no mercado imobiliário urbano. Combinamos tecnologia de ponta com um atendimento personalizado para encontrar o imóvel perfeito para você.</p>
                <p>Nossa equipe de especialistas possui amplo conhecimento do mercado e está preparada para oferecer as melhores oportunidades de investimento e moradia.</p>
              </div>
            </div>
          </section>
          <BrokerSection2 colors={c} />
        </>
      )}

      {/* CONTACT */}
      {page === "contact" && !selectedProperty && (
        <ContactSection2 colors={c} modelId={model.id} />
      )}

      <footer className="py-8 border-t" style={{ borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-sm" style={{ color: c.text }}>{model.name}</p>
          <p className="text-xs mt-1" style={{ color: c.text + "55" }}>© 2026 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

/* ── Broker Section – Model 2 style ── */
const BrokerSection2 = ({ colors }: { colors: DemoModel["colors"] }) => (
  <section className="py-20" style={{ backgroundColor: colors.text + "04" }}>
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 className="font-display font-bold text-2xl md:text-3xl mb-10" style={{ color: colors.text }}>Sobre o Corretor</h2>
      <div className="grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-2 flex justify-center">
          <div className="w-60 h-60 overflow-hidden rounded-2xl shadow-xl">
            <img src={brokerPhoto} alt="Ricardo Mendes" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <h3 className="font-display font-bold text-2xl" style={{ color: colors.text }}>Ricardo Mendes</h3>
          <p className="text-sm font-display font-semibold" style={{ color: colors.primary }}>Corretor de Imóveis • CRECI 123.456</p>
          <p className="leading-relaxed" style={{ color: colors.text + "88" }}>
            Com mais de 15 anos de experiência no mercado imobiliário de alto padrão, Ricardo Mendes é especialista em imóveis residenciais e comerciais nas regiões mais valorizadas de São Paulo.
          </p>
          <p className="leading-relaxed" style={{ color: colors.text + "88" }}>
            Reconhecido pela excelência no atendimento e profundo conhecimento do mercado, já intermediou mais de 500 transações imobiliárias, sempre priorizando a satisfação e segurança dos seus clientes.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
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

/* ── Contact Section – Model 2 style ── */
const ContactSection2 = ({ colors, modelId }: { colors: DemoModel["colors"]; modelId: string }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 className="font-display font-bold text-3xl mb-3" style={{ color: colors.text }}>Entre em Contato</h2>
      <p className="mb-10" style={{ color: colors.text + "77" }}>Tem interesse em algum imóvel? Envie sua mensagem por e-mail ou WhatsApp.</p>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
           <div className="flex items-center gap-3"><Phone className="w-5 h-5" style={{ color: colors.primary }} /><span>(11) 99999-0000</span></div>
           <div className="flex items-center gap-3"><Mail className="w-5 h-5" style={{ color: colors.primary }} /><span>contato@{modelId}.com.br</span></div>
           <div className="flex items-center gap-3"><MapPin className="w-5 h-5" style={{ color: colors.primary }} /><span>Av. Paulista, 1000 - São Paulo, SP</span></div>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Seu nome completo" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <input type="email" placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <input type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <textarea placeholder="Escreva sua mensagem aqui..." rows={4} className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 py-3 rounded-full font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: "#fff" }}>
              <Mail className="w-4 h-4" /> Enviar por e-mail
            </button>
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 rounded-full font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-4 h-4" /> Enviar no WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  </section>
);

/* ── Card: Image dominant with overlaid info ── */
const Model2Card = ({ property, colors, onSelect }: { property: Property; colors: DemoModel["colors"]; onSelect: () => void }) => (
  <motion.div
    className="relative rounded-2xl overflow-hidden cursor-pointer group h-80"
    onClick={onSelect}
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
  >
    <img src={propertyImages[property.image - 1]} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-display font-bold uppercase backdrop-blur-sm bg-white/20 text-white">
      {property.type}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h3 className="font-display font-bold text-xl mb-1">{property.title}</h3>
      <p className="text-xs text-white/60 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{property.location}</p>
      <div className="flex items-center justify-between">
        <p className="font-display font-black text-2xl">{property.price}</p>
        {property.type !== "terreno" && (
          <div className="flex gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms}</span>
            <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area}</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

/* ── Overlay Gallery: Full-screen image gallery with swipe ── */
const Model2Overlay = ({ property, colors, onClose }: { property: Property; colors: DemoModel["colors"]; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = [0, 1, 2, 3, 4, 5].map((i) => propertyImages[(property.image + i - 1) % 6]);

  const paginate = useCallback((dir: number) => {
    setCurrentImage((prev) => (prev + dir + allImages.length) % allImages.length);
  }, [allImages.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" onClick={onClose} />

      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-all" style={{ color: colors.text }}>
        <X className="w-5 h-5" />
      </button>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={allImages[currentImage]}
            alt=""
            className="max-h-[70vh] max-w-[85vw] object-contain rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) paginate(1);
              else if (info.offset.x > 80) paginate(-1);
            }}
          />
        </AnimatePresence>

        <button onClick={() => paginate(-1)} className="absolute left-4 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-all" style={{ color: colors.text }}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => paginate(1)} className="absolute right-4 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-all" style={{ color: colors.text }}>
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 flex gap-2">
          {allImages.map((_, i) => (
            <button key={i} onClick={() => setCurrentImage(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ backgroundColor: i === currentImage ? colors.primary : colors.text + "30" }} />
          ))}
        </div>
      </div>

      {/* Property info panel */}
      <motion.div
        className="relative z-10 border-t p-6 md:p-8"
        style={{ backgroundColor: colors.bg, borderColor: colors.text + "10" }}
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase capitalize" style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>{property.type}</span>
                <span className="text-sm flex items-center gap-1" style={{ color: colors.text + "55" }}><MapPin className="w-3 h-3" />{property.location}</span>
              </div>
              <h2 className="font-display font-bold text-2xl mb-2" style={{ color: colors.text }}>{property.title}</h2>
              <p className="text-sm mb-4 max-w-xl" style={{ color: colors.text + "77" }}>{property.description}</p>
              {property.type !== "terreno" && (
                <div className="flex gap-6 text-sm" style={{ color: colors.text + "66" }}>
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} quartos</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} banh.</span>
                  <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {property.parking} vagas</span>
                  <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {property.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: colors.text + "15", color: colors.text + "77" }}>{f}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <p className="font-display font-black text-3xl" style={{ color: colors.primary }}>{property.price}</p>
              <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-sm transition-all hover:brightness-110"
                style={{ backgroundColor: "#25d366", color: "#fff" }}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoSiteModel2;
