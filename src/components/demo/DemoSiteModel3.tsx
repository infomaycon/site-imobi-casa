import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { properties, type Property, type DemoModel } from "@/data/models";
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Car, Maximize, ChefHat, Waves, Mountain, Fence, Gem, Menu, X, MessageCircle, ArrowRight, Award, TrendingUp, Users } from "lucide-react";
import { getSearchFilter } from "@/components/demo/SearchFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import bannerImg from "@/assets/banner-model3.jpg";
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

const DemoSiteModel3 = ({ model }: { model: DemoModel }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<DemoPage>("home");
  const [filter, setFilter] = useState<string>("todos");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sideNav, setSideNav] = useState(false);
  const c = model.colors;

  const filtered = filter === "todos" ? properties : properties.filter((p) => {
    if (filter === "casas") return p.type === "casa";
    if (filter === "apartamentos") return p.type === "apartamento";
    if (filter === "terrenos") return p.type === "terreno";
    return true;
  });

  const navTo = (target: DemoPage) => {
    setPage(target);
    setSideNav(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Back */}
      <div className="fixed top-4 left-4 z-[60]">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-display font-semibold bg-primary text-primary-foreground shadow-lg hover:brightness-110 transition-all">
          <ArrowLeft className="w-3 h-3" /> Voltar
        </button>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: c.bg + "ee", borderColor: c.text + "10" }}>
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => navTo("home")} className="font-display font-bold text-base sm:text-lg" style={{ color: c.accent }}>
            {model.name}
          </button>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {(["home", "listing", "about", "contact"] as DemoPage[]).map((p) => {
              const labels: Record<DemoPage, string> = { home: "Início", listing: "Imóveis", about: "Sobre", contact: "Contato", property: "" };
              return (
                <button key={p} onClick={() => navTo(p)}
                  className="text-sm font-display font-medium transition-all relative"
                  style={{ color: page === p ? c.accent : c.text + "66" }}>
                  {labels[p]}
                  {page === p && <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: c.accent }} />}
                </button>
              );
            })}
          </div>
          <button className="md:hidden" onClick={() => setSideNav(!sideNav)} style={{ color: c.text }}>
            {sideNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Side nav (mobile) */}
      {sideNav && (
        <div className="fixed inset-0 z-[55]" onClick={() => setSideNav(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-64 sm:w-72 p-6 sm:p-8 flex flex-col gap-6"
            style={{ backgroundColor: c.bg }}
            initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSideNav(false)} className="self-end"><X className="w-6 h-6" style={{ color: c.text }} /></button>
            {(["home", "listing", "about", "contact"] as DemoPage[]).map((p) => {
              const labels: Record<DemoPage, string> = { home: "Início", listing: "Imóveis", about: "Sobre", contact: "Contato", property: "" };
              return (
                <button key={p} onClick={() => navTo(p)} className="text-lg font-display font-semibold text-left" style={{ color: page === p ? c.accent : c.text + "77" }}>
                  {labels[p]}
                </button>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* HOME */}
      {page === "home" && !selectedProperty && (
        <>
          <section className="flex flex-col md:grid md:grid-cols-2 min-h-[60vh] md:min-h-[80vh]">
            <div className="flex items-center justify-center p-6 sm:p-10 md:p-16 order-2 md:order-1">
              <div className="max-w-md">
                <motion.p className="text-xs sm:text-sm font-display tracking-widest uppercase mb-3 sm:mb-4" style={{ color: c.accent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {model.name}
                </motion.p>
                <motion.h1 className="font-display font-black text-2xl sm:text-3xl md:text-5xl mb-3 sm:mb-4 leading-tight" style={{ color: c.text }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {model.tagline}
                </motion.h1>
                <motion.p className="mb-6 sm:mb-8 text-xs sm:text-sm" style={{ color: c.text + "77" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Encontre o imóvel perfeito com a sofisticação e a qualidade que você merece.
                </motion.p>
                <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <button onClick={() => setPage("listing")} className="px-5 sm:px-6 py-3 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110" style={{ backgroundColor: c.accent, color: "#fff" }}>
                    Ver Imóveis
                  </button>
                  <button onClick={() => setPage("contact")} className="px-5 sm:px-6 py-3 rounded-xl font-display font-semibold text-sm border transition-all" style={{ borderColor: c.accent + "40", color: c.accent }}>
                    Fale Conosco
                  </button>
                </motion.div>
              </div>
            </div>
            <div className="relative h-[40vh] md:h-auto overflow-hidden order-1 md:order-2">
              <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 hidden md:block" style={{ background: `linear-gradient(to right, ${c.bg} 0%, transparent 30%)` }} />
            </div>
          </section>

          {(() => {
            const FilterComponent = getSearchFilter(model.id);
            return FilterComponent ? <FilterComponent colors={c} /> : null;
          })()}

          <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="font-display font-bold text-lg sm:text-2xl" style={{ color: c.text }}>Imóveis Selecionados</h2>
                <button onClick={() => setPage("listing")} className="text-xs sm:text-sm font-display font-semibold flex items-center gap-1" style={{ color: c.accent }}>
                  Ver todos <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </button>
              </div>
              <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-display font-semibold capitalize transition-all border"
                    style={{
                      backgroundColor: filter === f ? c.accent + "15" : "transparent",
                      color: filter === f ? c.accent : c.text + "55",
                      borderColor: filter === f ? c.accent + "40" : c.text + "15",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="space-y-3 sm:space-y-4">
                {filtered.map((p) => (
                  <Model3Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
                ))}
              </div>
            </div>
          </section>

          <BrokerSection3 colors={c} />
          <ContactSection3 colors={c} modelId={model.id} />
        </>
      )}

      {/* LISTING */}
      {page === "listing" && !selectedProperty && (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{ color: c.text }}>Portfólio Completo</h2>
            <p className="text-sm mb-6 sm:mb-8" style={{ color: c.text + "66" }}>Imóveis exclusivos selecionados para o mais exigente comprador</p>
            {(() => {
              const FilterComponent = getSearchFilter(model.id);
              return FilterComponent ? <div className="mb-6 sm:mb-8"><FilterComponent colors={c} /></div> : null;
            })()}
            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
              {["todos", "casas", "apartamentos", "terrenos"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-display font-semibold capitalize transition-all border"
                  style={{
                    backgroundColor: filter === f ? c.accent + "15" : "transparent",
                    color: filter === f ? c.accent : c.text + "55",
                    borderColor: filter === f ? c.accent + "40" : c.text + "15",
                  }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-3 sm:space-y-4">
              {filtered.map((p) => (
                <Model3Card key={p.id} property={p} colors={c} onSelect={() => setSelectedProperty(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROPERTY DETAIL */}
      {selectedProperty && (
        <Model3Detail property={selectedProperty} colors={c} onBack={() => setSelectedProperty(null)} />
      )}

      {/* ABOUT */}
      {page === "about" && !selectedProperty && (
        <>
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ color: c.accent }}>Sobre Nós</h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: c.text + "aa" }}>
                <p>A <strong style={{ color: c.accent }}>{model.name}</strong> é uma imobiliária que une sofisticação e modernidade para oferecer experiências imobiliárias extraordinárias.</p>
                <p>Nosso compromisso é encontrar o imóvel que reflete seu estilo de vida, com atendimento exclusivo e curadoria impecável.</p>
              </div>
            </div>
          </section>
          <BrokerSection3 colors={c} />
        </>
      )}

      {/* CONTACT */}
      {page === "contact" && !selectedProperty && (
        <ContactSection3 colors={c} modelId={model.id} />
      )}

      <footer className="py-6 sm:py-8 border-t" style={{ borderColor: c.text + "10" }}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="font-display font-bold text-sm" style={{ color: c.accent }}>{model.name}</p>
          <p className="text-xs mt-1" style={{ color: c.text + "55" }}>© 2026 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

/* ── Broker Section ── */
const BrokerSection3 = ({ colors }: { colors: DemoModel["colors"] }) => (
  <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: colors.text + "04" }}>
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
      <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10" style={{ color: colors.accent }}>Sobre o Corretor</h2>
      <div className="flex flex-col items-center gap-6">
        <div className="w-40 h-40 sm:w-52 sm:h-52 overflow-hidden rounded-xl shadow-lg border-4" style={{ borderColor: colors.accent + "20" }}>
          <img src={brokerPhoto} alt="Ricardo Mendes" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3 max-w-xl">
          <h3 className="font-display font-bold text-xl sm:text-2xl" style={{ color: colors.text }}>Ricardo Mendes</h3>
          <p className="text-xs sm:text-sm font-display font-semibold" style={{ color: colors.accent }}>Corretor de Imóveis • CRECI 123.456</p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>
            Com mais de 15 anos de experiência no mercado imobiliário de alto padrão, Ricardo Mendes é especialista em imóveis residenciais e comerciais nas regiões mais valorizadas de São Paulo.
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>
            Reconhecido pela excelência no atendimento, já intermediou mais de 500 transações imobiliárias.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 pt-3">
            {[
              { icon: Award, label: "15+ anos" },
              { icon: TrendingUp, label: "500+ vendidos" },
              { icon: Users, label: "1000+ clientes" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: colors.text + "77" }}>
                <item.icon className="w-4 h-4" style={{ color: colors.accent }} />
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
const ContactSection3 = ({ colors, modelId }: { colors: DemoModel["colors"]; modelId: string }) => (
  <section className="py-16 sm:py-20 md:py-24">
    <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
      <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3" style={{ color: colors.accent }}>Entre em Contato</h2>
      <p className="text-sm sm:text-base mb-8" style={{ color: colors.text + "77" }}>Tem interesse em algum imóvel? Envie sua mensagem por e-mail ou WhatsApp.</p>

      <div className="flex flex-col items-center gap-3 mb-8 text-sm" style={{ color: colors.text + "88" }}>
        <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: colors.accent }} /><span>(11) 99999-0000</span></div>
        <div className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: colors.accent }} /><span>contato@{modelId}.com.br</span></div>
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: colors.accent }} /><span>Av. Paulista, 1000 - São Paulo</span></div>
      </div>

      <form className="space-y-3 sm:space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Seu nome completo" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
        <input type="email" placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
        <input type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border text-sm font-body" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
        <textarea placeholder="Escreva sua mensagem aqui..." rows={4} className="w-full px-4 py-3 rounded-xl border text-sm font-body resize-none" style={{ backgroundColor: colors.text + "05", borderColor: colors.text + "15", color: colors.text }} />
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className="flex-1 py-3 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ backgroundColor: colors.accent, color: "#fff" }}>
            <Mail className="w-4 h-4" /> Enviar por e-mail
          </button>
          <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#25d366", color: "#fff" }}>
            <MessageCircle className="w-4 h-4" /> Enviar no WhatsApp
          </a>
        </div>
      </form>
    </div>
  </section>
);

/* ── Card ── */
const Model3Card = ({ property, colors, onSelect }: { property: Property; colors: DemoModel["colors"]; onSelect: () => void }) => (
  <motion.div
    className="flex flex-col sm:flex-row rounded-2xl overflow-hidden border cursor-pointer group"
    style={{ backgroundColor: colors.bg, borderColor: colors.text + "10" }}
    onClick={onSelect}
    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
    whileHover={{ x: 4 }} transition={{ duration: 0.3 }}
  >
    <div className="relative w-full sm:w-44 md:w-56 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
      <img src={propertyImages[property.image - 1]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-display font-bold capitalize" style={{ backgroundColor: colors.accent, color: "#fff" }}>
        {property.type}
      </div>
    </div>
    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-display font-bold text-sm sm:text-base mb-1" style={{ color: colors.text }}>{property.title}</h3>
        <p className="text-[10px] sm:text-xs flex items-center gap-1 mb-2" style={{ color: colors.text + "66" }}><MapPin className="w-3 h-3" />{property.location}</p>
        {property.type !== "terreno" && (
          <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs mb-2" style={{ color: colors.text + "55" }}>
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms} qts</span>
            <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} ban</span>
            <span className="flex items-center gap-1"><Car className="w-3 h-3" />{property.parking} vg</span>
            <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {property.features.slice(0, 3).map((f, i) => (
            <span key={i} className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-display font-semibold border" style={{ borderColor: colors.accent + "30", color: colors.accent }}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t" style={{ borderColor: colors.text + "10" }}>
        <p className="font-display font-black text-base sm:text-lg" style={{ color: colors.accent }}>{property.price}</p>
        <span className="text-[10px] sm:text-xs font-display font-semibold flex items-center gap-1" style={{ color: colors.text + "55" }}>
          Detalhes <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </motion.div>
);

/* ── Detail ── */
const Model3Detail = ({ property, colors, onBack }: { property: Property; colors: DemoModel["colors"]; onBack: () => void }) => {
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
            <div key={i} className="h-28 sm:h-40 md:h-48 overflow-hidden rounded-xl">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-xl text-[10px] sm:text-xs font-display font-bold capitalize mb-3" style={{ backgroundColor: colors.accent + "15", color: colors.accent }}>
              {property.type}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{ color: colors.text }}>{property.title}</h1>
            <p className="text-xs sm:text-sm flex items-center gap-1" style={{ color: colors.text + "77" }}><MapPin className="w-4 h-4" />{property.location}</p>
          </div>

          <p className="font-display font-black text-2xl sm:text-3xl" style={{ color: colors.accent }}>{property.price}</p>

          {property.type !== "terreno" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Maximize, label: "Área", value: property.area },
                { icon: Bed, label: "Quartos", value: `${property.bedrooms} (${property.suites} suítes)` },
                { icon: Bath, label: "Banheiros", value: property.bathrooms },
                { icon: Car, label: "Vagas", value: property.parking },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent + "15" }}>
                    <item.icon className="w-4 sm:w-5 h-4 sm:h-5" style={{ color: colors.accent }} />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider" style={{ color: colors.text + "55" }}>{item.label}</p>
                    <p className="font-display font-bold text-xs sm:text-sm">{String(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3" style={{ color: colors.accent }}>Diferenciais</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((f, i) => (
                <span key={i} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm" style={{ backgroundColor: colors.accent + "10", color: colors.accent }}>
                  {featureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-3" style={{ color: colors.accent }}>Descrição</h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text + "88" }}>{property.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: "#25d366", color: "#fff" }}>
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <button onClick={onBack} className="py-3 px-6 rounded-xl font-display font-bold text-sm transition-all border" style={{ borderColor: colors.accent, color: colors.accent }}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSiteModel3;
