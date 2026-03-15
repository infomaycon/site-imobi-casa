import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle } from "lucide-react";
import { getSearchFilter } from "@/components/demo/SearchFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import bannerImg from "@/assets/banner-model1.jpg";

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

/* ── Model 1: Aurora Prime – Classic Luxury ──
   Layout: Traditional elegant, large image cards, full-page property detail
   Nav: Centered logo with gold underline accents
*/
const DemoSiteModel1 = ({ model }: { model: DemoModel }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
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
      className="text-sm font-medium tracking-wide uppercase transition-all border-b-2 pb-1"
      style={{
        color: page === target ? c.secondary : c.text + "77",
        borderColor: page === target ? c.secondary : "transparent",
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

      {/* Navbar – centered logo, elegant */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: c.bg, borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-3">
            <button onClick={() => { setPage("home"); setSelectedProperty(null); }} className="font-display font-black text-xl tracking-widest uppercase" style={{ color: c.primary }}>
              {model.name}
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
          {/* Hero – full-width image with centered text */}
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.primary}dd 0%, ${c.primary}88 50%, transparent 100%)` }} />
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <motion.div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: c.secondary }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
              <motion.h1 className="font-display font-black text-4xl md:text-6xl mb-4 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {model.name}
              </motion.h1>
              <motion.p className="text-lg md:text-xl mb-8 text-white/80 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                "{model.tagline}"
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={() => setPage("listing")} className="px-8 py-3 rounded-none font-display font-bold tracking-wider uppercase text-sm transition-all hover:brightness-110" style={{ backgroundColor: c.secondary, color: c.primary }}>
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
                <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.secondary }} />
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
                {filtered.map((p) => (
                  <Model1Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* LISTING */}
      {page === "listing" && !selectedProperty && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-8">
              <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.secondary }} />
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
              {filtered.map((p) => (
                <Model1Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROPERTY DETAIL – Full page */}
      {selectedProperty && (
        <Model1Detail property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
      )}

      {/* ABOUT */}
      {page === "about" && !selectedProperty && (
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.secondary }} />
            <h2 className="font-display font-bold text-3xl mb-8 text-center" style={{ color: c.primary }}>Sobre Nós</h2>
            <div className="space-y-6 text-base leading-relaxed" style={{ color: c.text + "aa" }}>
              <p>A <strong style={{ color: c.primary }}>{model.name}</strong> é uma referência no mercado imobiliário urbano de alto padrão. Com anos de experiência e um portfólio exclusivo, oferecemos imóveis que atendem aos mais exigentes padrões de qualidade, localização e sofisticação.</p>
              <p>Nossa equipe de consultores especializados está preparada para oferecer um atendimento personalizado, compreendendo suas necessidades e apresentando as melhores opções do mercado.</p>
              <p>Seja para encontrar a residência dos seus sonhos, um investimento seguro ou o espaço comercial ideal, conte com a excelência e o comprometimento que definem nossa marca.</p>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {page === "contact" && !selectedProperty && (
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: c.secondary }} />
            <h2 className="font-display font-bold text-3xl mb-8 text-center" style={{ color: c.primary }}>Entre em Contato</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3"><Phone className="w-5 h-5" style={{ color: c.secondary }} /><span>(11) 99999-0000</span></div>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5" style={{ color: c.secondary }} /><span>contato@{model.id}.com.br</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5" style={{ color: c.secondary }} /><span>Av. Paulista, 1000 - São Paulo, SP</span></div>
                <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 font-display font-bold transition-all hover:brightness-110"
                  style={{ backgroundColor: "#25d366", color: "#fff" }}>
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Seu nome" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <input type="email" placeholder="Seu e-mail" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <input type="tel" placeholder="Seu telefone" className="w-full px-4 py-3 border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <textarea placeholder="Mensagem" rows={4} className="w-full px-4 py-3 border text-sm font-body resize-none" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <button type="submit" className="w-full py-3 font-display font-bold tracking-wider uppercase text-sm transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      <footer className="py-8 border-t" style={{ borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-sm tracking-widest uppercase" style={{ color: c.primary }}>{model.name}</p>
          <p className="text-xs mt-1" style={{ color: c.text + "55" }}>© 2026 Todos os direitos reservados. Site demonstrativo.</p>
        </div>
      </footer>
    </div>
  );
};

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
      <div className="absolute top-0 left-0 px-4 py-2 text-xs font-display font-bold uppercase tracking-wider" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
        {property.type}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-display font-bold text-lg mb-1" style={{ color: colors.text }}>{property.title}</h3>
      <p className="text-xs mb-4 flex items-center gap-1" style={{ color: colors.text + "66" }}><MapPin className="w-3 h-3" />{property.location}</p>
      <div className="flex items-center justify-between">
        <p className="font-display font-black text-xl" style={{ color: colors.secondary }}>{property.price}</p>
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

/* ── Detail: Full page with image grid ── */
const Model1Detail = ({ property, colors, onBack }: { property: Property; colors: DemoModel["colors"]; onBack: () => void }) => (
  <section className="py-16">
    <div className="container mx-auto px-6 max-w-6xl">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-display font-semibold uppercase tracking-wider transition-opacity hover:opacity-80" style={{ color: colors.text + "88" }}>
        <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
      </button>

      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
        <div className="md:col-span-2 h-[400px] overflow-hidden">
          <img src={propertyImages[property.image - 1]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="overflow-hidden"><img src={propertyImages[(property.image) % 6]} alt="" className="w-full h-full object-cover" /></div>
          <div className="overflow-hidden"><img src={propertyImages[(property.image + 1) % 6]} alt="" className="w-full h-full object-cover" /></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="inline-block px-4 py-1 text-xs font-display font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
              {property.type}
            </div>
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: colors.text }}>{property.title}</h1>
            <p className="text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}><MapPin className="w-4 h-4" />{property.location}</p>
          </div>

          <p className="font-display font-black text-3xl" style={{ color: colors.secondary }}>{property.price}</p>

          {property.type !== "terreno" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Maximize, label: "Área", value: property.area },
                { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                { icon: Bath, label: "Banheiros", value: property.bathrooms },
                { icon: Car, label: "Vagas", value: property.parking },
              ].map((item, i) => (
                <div key={i} className="p-4 border" style={{ borderColor: colors.text + "12" }}>
                  <item.icon className="w-5 h-5 mb-2" style={{ color: colors.secondary }} />
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
                <span key={i} className="flex items-center gap-2 px-4 py-2 text-sm border" style={{ borderColor: colors.secondary + "40", color: colors.primary }}>
                  {featureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
            <p className="leading-relaxed" style={{ color: colors.text + "88" }}>{property.description}</p>
          </div>

          {/* Extra images */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Galeria</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-40 overflow-hidden">
                  <img src={propertyImages[(property.image + i - 1) % 6]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
  </section>
);

export default DemoSiteModel1;
