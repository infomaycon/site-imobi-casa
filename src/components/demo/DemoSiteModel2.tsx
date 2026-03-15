import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle, Award, TrendingUp, Users } from "lucide-react";
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

type DemoPage = "home" | "listing" | "detail" | "about" | "contact";

const featureIcon = (f: string) => {
  const map: Record<string, any> = {
    "Área Gourmet": ChefHat, Piscina: Waves, "Vista Panorâmica": Mountain,
    Varanda: Fence, "Acabamento Premium": Gem,
  };
  const Icon = map[f] || Gem;
  return <Icon className="w-4 h-4" />;
};

const DemoSiteModel2 = ({ model }: { model: DemoModel }) => {
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

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: c.bg, borderColor: c.text + "10" }}>
        <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => { setPage("home"); setSelectedProperty(null); }} className="font-display font-bold text-base sm:text-lg tracking-tight" style={{ color: c.primary }}>
            {model.name}
          </button>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
          <div className="md:hidden px-4 sm:px-6 pb-4 space-y-3 flex flex-col">
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
          <section className="relative h-[60vh] sm:h-[75vh] md:h-[90vh] flex items-end overflow-hidden">
            <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
            <div className="relative z-10 px-4 sm:px-8 md:px-16 pb-10 sm:pb-16 max-w-2xl">
              <motion.p className="text-xs sm:text-sm font-display tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3" style={{ color: c.primary }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Exclusividade
              </motion.p>
              <motion.h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 leading-tight" style={{ color: c.text }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                {model.tagline}
              </motion.h1>
              <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <button onClick={() => setPage("listing")} className="px-6 sm:px-8 py-3 rounded-full font-display font-bold text-sm transition-all hover:brightness-110" style={{ backgroundColor: c.primary, color: "#fff" }}>
                  Explorar Imóveis
                </button>
                <button onClick={() => setPage("contact")} className="px-6 sm:px-8 py-3 rounded-full font-display font-semibold text-sm border transition-all" style={{ borderColor: c.primary + "40", color: c.primary }}>
                  Contato
                </button>
              </motion.div>
            </div>
          </section>

          {(() => {
            const FilterComponent = getSearchFilter(model.id);
            return FilterComponent ? <FilterComponent colors={c} /> : null;
          })()}

          <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
              <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-2" style={{ color: c.text }}>Destaques</h2>
              <p className="text-sm mb-6 sm:mb-8" style={{ color: c.text + "55" }}>Os melhores imóveis selecionados para você</p>
              <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-display font-semibold capitalize transition-all"
                    style={{
                      backgroundColor: filter === f ? c.primary : c.text + "08",
                      color: filter === f ? "#fff" : c.text + "66",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filtered.map((p) => (
                  <Model2Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
            </div>
          </section>

          <BrokerSection2 colors={c} />
          <ContactSection2 colors={c} modelId={model.id} />
        </>
      )}

      {/* LISTING */}
      {page === "listing" && !selectedProperty && (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{ color: c.text }}>Todos os Imóveis</h2>
            <p className="text-sm mb-6 sm:mb-8" style={{ color: c.text + "55" }}>Explore nosso portfólio completo</p>
            {(() => {
              const FilterComponent = getSearchFilter(model.id);
              return FilterComponent ? <div className="mb-6 sm:mb-8"><FilterComponent colors={c} /></div> : null;
            })()}
            <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-display font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: filter === f ? c.primary : c.text + "08",
                    color: filter === f ? "#fff" : c.text + "66",
                  }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <Model2Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROPERTY DETAIL */}
      {selectedProperty && (
        <Model2Detail property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
      )}

      {/* ABOUT */}
      {page === "about" && !selectedProperty && (
        <>
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ color: c.text }}>Sobre</h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: c.text + "aa" }}>
                <p>A <strong style={{ color: c.text }}>{model.name}</strong> é referência no mercado imobiliário urbano.</p>
                <p>Nossa equipe de especialistas possui amplo conhecimento do mercado e está preparada para oferecer as melhores oportunidades.</p>
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

      <footer className="py-6 sm:py-8 border-t" style={{ borderColor: c.text + "10" }}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="font-display font-bold text-sm" style={{ color: c.text }}>{model.name}</p>
          <p className="text-xs mt-1" style={{ color: c.text + "55" }}>© 2026 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

/* ── Broker Section ── */
const BrokerSection2 = ({ colors }: { colors: DemoModel["colors"] }) => (
  <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: colors.text + "04" }}>
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
      <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10" style={{ color: colors.text }}>Sobre o Corretor</h2>
      <div className="flex flex-col items-center gap-6">
        <div className="w-40 h-40 sm:w-52 sm:h-52 overflow-hidden rounded-2xl shadow-xl">
          <img src={brokerPhoto} alt="Ricardo Mendes" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3 max-w-xl">
          <h3 className="font-display font-bold text-xl sm:text-2xl" style={{ color: colors.text }}>Ricardo Mendes</h3>
          <p className="text-xs sm:text-sm font-display font-semibold" style={{ color: colors.primary }}>Corretor de Imóveis • CRECI 123.456</p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>
            Com mais de 15 anos de experiência no mercado imobiliário de alto padrão, Ricardo Mendes é especialista em imóveis residenciais e comerciais nas regiões mais valorizadas de São Paulo.
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>
            Reconhecido pela excelência no atendimento, já intermediou mais de 500 transações imobiliárias.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-3">
            {[
              { icon: Award, label: "15+ anos" },
              { icon: TrendingUp, label: "500+ vendidos" },
              { icon: Users, label: "1000+ clientes" },
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

/* ── Contact Section – Centered ── */
const ContactSection2 = ({ colors, modelId }: { colors: DemoModel["colors"]; modelId: string }) => (
  <section className="py-16 sm:py-20 md:py-24">
    <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
      <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3" style={{ color: colors.text }}>Entre em Contato</h2>
      <p className="text-sm sm:text-base mb-8" style={{ color: colors.text + "77" }}>Tem interesse em algum imóvel? Envie sua mensagem por e-mail ou WhatsApp.</p>

      <div className="flex flex-col items-center gap-3 mb-8 text-sm" style={{ color: colors.text + "88" }}>
        <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: colors.primary }} /><span>(11) 99999-0000</span></div>
        <div className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: colors.primary }} /><span>contato@{modelId}.com.br</span></div>
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: colors.primary }} /><span>Av. Paulista, 1000 - São Paulo</span></div>
      </div>

      <form className="space-y-3 sm:space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
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
  </section>
);

/* ── Card ── */
const Model2Card = ({ property, colors, onSelect }: { property: Property; colors: DemoModel["colors"]; onSelect: () => void }) => (
  <motion.div
    className="relative rounded-2xl overflow-hidden cursor-pointer group h-56 sm:h-72 md:h-80"
    onClick={onSelect}
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
  >
    <img src={propertyImages[property.image - 1]} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-display font-bold uppercase" style={{ backgroundColor: colors.primary, color: "#fff" }}>
      {property.type}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
      <h3 className="font-display font-bold text-base sm:text-xl mb-1" style={{ color: colors.text }}>{property.title}</h3>
      <p className="text-[10px] sm:text-xs flex items-center gap-1 mb-2 sm:mb-3" style={{ color: colors.text + "66" }}><MapPin className="w-3 h-3" />{property.location}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-display font-black text-lg sm:text-2xl" style={{ color: colors.primary }}>{property.price}</p>
        {property.type !== "terreno" && (
          <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs" style={{ color: colors.text + "55" }}>
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms}</span>
            <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area}</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

/* ── Detail ── */
const Model2Detail = ({ property, colors, onBack }: { property: Property; colors: DemoModel["colors"]; onBack: () => void }) => {
  const allImages = [0, 1, 2].map((i) => propertyImages[(property.image + i - 1) % 6]);

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <button onClick={onBack} className="flex items-center gap-2 mb-6 sm:mb-8 text-sm font-display font-semibold transition-opacity hover:opacity-80" style={{ color: colors.text + "88" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="w-full h-48 sm:h-64 md:h-[400px] overflow-hidden rounded-2xl mb-4 sm:mb-6">
          <img src={allImages[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8 sm:mb-10">
          {allImages.slice(1).map((img, i) => (
            <div key={i} className="h-32 sm:h-40 md:h-48 overflow-hidden rounded-xl">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-display font-bold uppercase mb-3" style={{ backgroundColor: colors.primary, color: "#fff" }}>{property.type}</span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{ color: colors.text }}>{property.title}</h1>
            <p className="text-xs sm:text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}><MapPin className="w-4 h-4" />{property.location}</p>
          </div>

          <p className="font-display font-black text-2xl sm:text-3xl" style={{ color: colors.primary }}>{property.price}</p>

          {property.type !== "terreno" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Maximize, label: "Área", value: property.area },
                { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                { icon: Bath, label: "Banheiros", value: property.bathrooms },
                { icon: Car, label: "Vagas", value: property.parking },
              ].map((item, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl" style={{ backgroundColor: colors.text + "06" }}>
                  <item.icon className="w-4 sm:w-5 h-4 sm:h-5 mb-2" style={{ color: colors.primary }} />
                  <p className="text-[10px] sm:text-xs" style={{ color: colors.text + "66" }}>{item.label}</p>
                  <p className="font-display font-bold text-xs sm:text-sm">{String(item.value)}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3" style={{ color: colors.text }}>Diferenciais</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((f, i) => (
                <span key={i} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border" style={{ borderColor: colors.primary + "30", color: colors.primary }}>
                  {featureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3" style={{ color: colors.text }}>Descrição</h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>{property.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <button onClick={onBack} className="py-3 px-6 rounded-full font-display font-bold text-sm transition-all border" style={{ borderColor: colors.primary, color: colors.primary }}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSiteModel2;
