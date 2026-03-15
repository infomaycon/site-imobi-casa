import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { demoModels, properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle } from "lucide-react";
import { getSearchFilter } from "@/components/demo/SearchFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const propertyImages = [property1, property2, property3, property4, property5, property6];

type DemoPage = "home" | "listing" | "property" | "about" | "contact";

const DemoSite = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const model = demoModels.find((m) => m.id === modelId);
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-heading">Modelo não encontrado.</p>
      </div>
    );
  }

  const c = model.colors;

  const filtered = filter === "todos" ? properties : properties.filter((p) => {
    if (filter === "casas") return p.type === "casa";
    if (filter === "apartamentos") return p.type === "apartamento";
    if (filter === "terrenos") return p.type === "terreno";
    return true;
  });

  const featureIcon = (f: string) => {
    const map: Record<string, any> = {
      "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
      Varanda: Fence, "Acabamento Premium": Gem,
    };
    const Icon = map[f] || Gem;
    return <Icon className="w-4 h-4" />;
  };

  const NavLink = ({ label, target }: { label: string; target: DemoPage }) => (
    <button
      onClick={() => { setPage(target); setMobileMenu(false); setSelectedProperty(null); }}
      className="text-sm font-medium transition-colors hover:opacity-80"
      style={{ color: page === target ? c.primary : c.text + "88" }}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Back to main site */}
      <div className="fixed top-4 left-4 z-[60]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-display font-semibold bg-primary text-primary-foreground shadow-lg hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-3 h-3" /> Voltar
        </button>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: c.bg + "ee", borderColor: c.text + "12" }}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => { setPage("home"); setSelectedProperty(null); }} className="font-display font-bold text-lg" style={{ color: c.primary }}>
            {model.name}
          </button>
          <div className="hidden md:flex items-center gap-6">
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Sobre" target="about" />
            <NavLink label="Contato" target="contact" />
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: c.text }}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden p-6 space-y-4 border-t" style={{ borderColor: c.text + "12" }}>
            <NavLink label="Início" target="home" />
            <NavLink label="Imóveis" target="listing" />
            <NavLink label="Sobre" target="about" />
            <NavLink label="Contato" target="contact" />
          </div>
        )}
      </nav>

      {/* Pages */}
      {page === "home" && !selectedProperty && (
        <>
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <img src={propertyImages[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${c.bg}cc, ${c.bg}ee)` }} />
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <motion.h1 className="font-display font-black text-4xl md:text-6xl mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ color: c.text }}>
                {model.name}
              </motion.h1>
              <motion.p className="text-lg md:text-xl italic mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: c.text + "aa" }}>
                "{model.tagline}"
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={() => setPage("listing")} className="px-8 py-3 rounded-lg font-display font-bold transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Ver Imóveis
                </button>
                <button onClick={() => setPage("contact")} className="px-8 py-3 rounded-lg font-display font-semibold border-2 transition-all" style={{ borderColor: c.primary + "40", color: c.text }}>
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

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-8" style={{ color: c.text }}>Encontre seu Imóvel Ideal</h2>
              <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-5 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all"
                    style={{ backgroundColor: filter === f ? c.primary : c.text + "08", color: filter === f ? "#fff" : c.text + "88" }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {page === "listing" && !selectedProperty && (
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-display font-bold text-3xl text-center mb-4" style={{ color: c.text }}>Nossos Imóveis</h2>
            <p className="text-center mb-8" style={{ color: c.text + "77" }}>Explore nosso portfólio exclusivo de imóveis de alto padrão</p>
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className="px-5 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all"
                  style={{ backgroundColor: filter === f ? c.primary : c.text + "08", color: filter === f ? "#fff" : c.text + "88" }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedProperty && (
        <PropertyDetail property={selectedProperty} colors={c} featureIcon={featureIcon} onBack={() => setSelectedProperty(null)} />
      )}

      {page === "about" && !selectedProperty && (
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-display font-bold text-3xl mb-8 text-center" style={{ color: c.primary }}>Sobre Nós</h2>
            <div className="space-y-6 text-base leading-relaxed" style={{ color: c.text + "aa" }}>
              <p>A <strong style={{ color: c.primary }}>{model.name}</strong> é uma referência no mercado imobiliário urbano de alto padrão. Com anos de experiência e um portfólio exclusivo, oferecemos imóveis que atendem aos mais exigentes padrões de qualidade, localização e sofisticação.</p>
              <p>Nossa equipe de consultores especializados está preparada para oferecer um atendimento personalizado, compreendendo suas necessidades e apresentando as melhores opções do mercado. Trabalhamos com transparência, ética e dedicação para garantir a melhor experiência em cada negociação.</p>
              <p>Seja para encontrar a residência dos seus sonhos, um investimento seguro ou o espaço comercial ideal, conte com a excelência e o comprometimento que definem nossa marca.</p>
            </div>
          </div>
        </section>
      )}

      {page === "contact" && !selectedProperty && (
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display font-bold text-3xl mb-8 text-center" style={{ color: c.primary }}>Entre em Contato</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3"><Phone className="w-5 h-5" style={{ color: c.primary }} /><span>(11) 99999-0000</span></div>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5" style={{ color: c.primary }} /><span>contato@{model.id}.com.br</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5" style={{ color: c.primary }} /><span>Av. Paulista, 1000 - São Paulo, SP</span></div>
                <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all hover:brightness-110"
                  style={{ backgroundColor: "#25d366", color: "#fff" }}>
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Seu nome" className="w-full px-4 py-3 rounded-lg border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <input type="email" placeholder="Seu e-mail" className="w-full px-4 py-3 rounded-lg border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <input type="tel" placeholder="Seu telefone" className="w-full px-4 py-3 rounded-lg border text-sm font-body" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <textarea placeholder="Mensagem" rows={4} className="w-full px-4 py-3 rounded-lg border text-sm font-body resize-none" style={{ backgroundColor: c.text + "05", borderColor: c.text + "15", color: c.text }} />
                <button type="submit" className="w-full py-3 rounded-lg font-display font-bold transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      <footer className="py-8 border-t" style={{ borderColor: c.text + "10" }}>
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-sm" style={{ color: c.primary }}>{model.name}</p>
          <p className="text-xs mt-1" style={{ color: c.text + "55" }}>© 2026 Todos os direitos reservados. Site demonstrativo.</p>
        </div>
      </footer>
    </div>
  );
};

const PropertyCard = ({ property, colors, onSelect }: { property: Property; colors: DemoModel["colors"]; onSelect: () => void }) => (
  <motion.div
    className="rounded-xl overflow-hidden border cursor-pointer group"
    style={{ backgroundColor: colors.bg, borderColor: colors.text + "10" }}
    onClick={onSelect}
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
  >
    <div className="relative h-52 overflow-hidden">
      <img src={propertyImages[property.image - 1]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-display font-bold capitalize" style={{ backgroundColor: colors.primary, color: "#fff" }}>
        {property.type}
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-display font-bold text-base mb-1" style={{ color: colors.text }}>{property.title}</h3>
      <p className="text-xs mb-3 flex items-center gap-1" style={{ color: colors.text + "77" }}><MapPin className="w-3 h-3" />{property.location}</p>
      <p className="font-display font-black text-xl mb-3" style={{ color: colors.primary }}>{property.price}</p>
      {property.type !== "terreno" ? (
        <div className="flex gap-4 text-xs" style={{ color: colors.text + "66" }}>
          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms}</span>
          <span className="flex items-center gap-1"><Car className="w-3 h-3" />{property.parking}</span>
          <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area}</span>
        </div>
      ) : (
        <div className="flex gap-4 text-xs" style={{ color: colors.text + "66" }}>
          <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const PropertyDetail = ({ property, colors, featureIcon, onBack }: { property: Property; colors: DemoModel["colors"]; featureIcon: (f: string) => JSX.Element; onBack: () => void }) => (
  <section className="py-16">
    <div className="container mx-auto px-6 max-w-5xl">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-display font-semibold transition-opacity hover:opacity-80" style={{ color: colors.text + "88" }}>
        <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl overflow-hidden h-80">
          <img src={propertyImages[property.image - 1]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <img src={propertyImages[(property.image + i - 1) % 6]} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-display font-bold capitalize mb-3" style={{ backgroundColor: colors.primary, color: "#fff" }}>
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
                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: colors.text + "12" }}>
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
                <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border" style={{ borderColor: colors.primary + "30", color: colors.primary }}>
                  {featureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3" style={{ color: colors.primary }}>Descrição</h3>
            <p className="leading-relaxed" style={{ color: colors.text + "88" }}>{property.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: "#25d366", color: "#fff" }}>
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
          <div className="p-6 rounded-xl border" style={{ borderColor: colors.text + "12" }}>
            <h4 className="font-display font-bold text-sm mb-4" style={{ color: colors.primary }}>Formulário de Interesse</h4>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Nome" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
              <input type="email" placeholder="E-mail" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
              <input type="tel" placeholder="Telefone" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
              <button type="submit" className="w-full py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110" style={{ backgroundColor: colors.primary, color: "#fff" }}>
                Tenho Interesse
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DemoSite;
